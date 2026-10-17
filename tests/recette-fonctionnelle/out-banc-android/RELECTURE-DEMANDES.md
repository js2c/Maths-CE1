# Relecture indépendante : les deux demandes du parent du 17 octobre 2026 (commit 5a4ecc62)

Demande 1 : plus jamais de rechargement quand la taille de la fenêtre change.
Demande 2 : la reprise après un rechargement se fait à la question près.

Relecture faite sans navigateur ni parcours `tests/e2e` (des recettes tournaient sur la machine). Ce que j'ai fait : lu le diff et le code autour, regardé les 49 captures de `captures-demandes/`, lancé `node --test tests/unit/reprise-question.test.mjs` (5 tests sur 5 passent) et mesuré la taille d'un instantané avec un petit script Node (constat 8).

## Phase 1 : l'enfant et le parent (les captures)

**Redimensionnements (`redimension-*`).** Sur les trois profils, tous les écrans sont entiers, centrés, nets. Rien n'est noir. Sur les téléphones, les bandes bleu-vert à gauche et à droite sont propres. Aucun texte n'est coupé, aucune cible n'a bougé. Une limite du parcours : chaque capture est prise **après** la réponse à une nouvelle question (`secouer` répond, attend que le compteur avance, puis photographie). On ne voit donc jamais ce que devient, après un redimensionnement, un dessin déjà à l'écran (une aide, une correction). C'est justement là qu'est le défaut du constat 1. Par exemple, `redimension-s5e-calcul-rapide` montre la consigne « Suis le chemin » de la question suivante, et le chemin n'y est pas encore dessiné : la capture ne prouve rien dans un sens ni dans l'autre.

**Reprise (`reprise-*`).**
- L'accueil en pause après le rechargement est clair : le capitaine, la bulle « Te revoilà ! Touche cette bulle pour continuer. », les galets, le logo des parents. Sur aucune des captures « accueil en pause » on ne voit la **flèche** sur le galet « continuer », que la SPEC annonce (section 2) et que `consigneEnPause` doit montrer pendant la phrase. C'est peut-être le moment de la capture (après la phrase) ; à vérifier, ce n'est pas dans le commit. Pour une enfant qui ne lit pas, cette flèche est la seule indication écrite.
- Les questions reposées sont bien les mêmes (échauffement `7 + 0`, `2 + 7`, additions, calcul rapide, voiliers, multiplication, étal). La frise garde ses ronds (2, puis 3 ronds jaunes à l'échauffement ; 2 ronds à la ligne graduée…). Les étoiles sont gardées.
- `reprise-05-lecon-rejouee` : la leçon L1 repart de son début, la frise est intacte. `reprise-07` : le « À toi ! » qui suit la leçon est bien reposé.
- `reprise-10-multiplication-question-reposee` (et aussi `redimension-s5e-multiplication`) : la bulle « 5 rangées de 2 poissons. Combien de poissons en tout ? » **recouvre presque entièrement les rangées de poissons** dont parle la voix ; on n'en voit que les bords. Ce n'est pas dû au commit (constat 9), mais c'est ce qu'une enfant de 7 ans verrait.
- `redimension-s5e-accueil-en-pause` : l'accueil en pause est posé sur la scène de l'étal, portefeuille ouvert et pièces visibles. C'est chargé, mais ce n'est pas lié au commit.

**Historique du parent (`reprise-10-parent-historique`).**
- La phrase « Pages rechargées en pleine séance : … a repris à la question en cours / à la question suivante (la réponse donnée juste avant est comptée) / à la leçon en cours » est en français simple. Elle est longue ici parce que le parcours recharge huit fois ; dans la vraie vie, une ou deux reprises.
- **Faux pour le parent** : « Étapes : échauffement 7 s, notion du jour 16 s ». Ces durées ne comptent que ce qui a été joué après la dernière reprise (constat 4).
- « après 2 questions ; … a repris à la question suivante (la réponse donnée juste avant est comptée) » : les « 2 questions » ne comptent pas cette réponse « juste avant ». Dans le tableau, elle apparaît **après** la ligne « page rechargée », avec l'heure de la reprise (constat 6).

## Phase 2 : le code

Points examinés : `session/instantane.js` avec chaque runner (modules 1 à 6, `Warmup`, `Module2Runner` et son `w`, `Variete`, les `Set` et `Map`, `bags`, `donnes`, `ranks`) ; `session/notion.js` ; `runWarmup` ; les appels `app.surReponse` dans les six écrans et dans la dictée ; `session.js` (`point`, `notePoint`, `noteReponse`, `pointValide`, la version) ; `engine/stage.js` et tout ce qui suit `stage.px`, `stage.k` et `onResize`.

Ce qui est juste. La copie et la restauration des runners : les champs exclus (`store`, `c`, `rnd`, `cran`, `choix`, `levels`, `rules`…) sont bien reconstruits par le constructeur et `load()`. Les objets d'une classe (`Variete`, le `Warmup` de `Module2Runner`) gardent leur classe. Les `Set` et `Map` créés plus tard (`ranks`, `donnes`, `bags.used`) reviennent bien. Le prochain `next()` ne repose pas une question déjà tirée, parce que l'instantané est pris après `next()`. `warmup.questions()` n'est pas rappelé, donc le compteur du temps de base n'avance pas deux fois. Les exemples guidés, la leçon d'entrée et le « finir sur une réussite » reprennent avec les bons compteurs (`S.g`, `S.k`, `S.fin`, `S.entree`). La réponse notée par les écrans de la ligne, des additions, du calcul rapide et de la multiplication est bien celle que `ask` aurait rendue, à `correctionPassee` près (normal : la correction n'a pas été passée) et à `lent` près au calcul rapide (le runner recalcule C2 d'après `ms`). `Actor`, la ligne, le fond, le lagon, la mascotte et les voiliers se remettent bien à l'échelle sans effacer leur dessin.

## Constats

### 1. Les aides et les corrections dessinées disparaissent quand la fenêtre change de taille

- **Ce qui se passe.** `AidBoard.place()` (`app/js/modules/facts/aids.js`, ligne 23) n'a pas été modifié. Il est appelé à chaque changement de taille (`st.onResize`). Il réaffecte toujours `c.width` et `c.height`, ce qui **efface** la toile, même quand la taille ne change pas. Il remet aussi `used` et `__used` à faux, et la bulle ne sait alors plus qu'il faut éviter cette zone. Le commit a corrigé cela pour `Actor`, `line.fx` et le fond, mais pas pour ce calque. C'est le calque des aides des additions (maison, cadre de 10, deux boîtes), du chemin du calcul rapide (qui reste affiché pendant la réponse), des rangées de la multiplication (posées dès la question), du nombre décomposé de la dictée et de l'erreur E6 de la ligne, et des leçons des additions (`lessons/player2.js`).
- **Comment le reproduire.** Multiplication, une question « 5 rangées de 5 poissons » : les rangées sont dessinées au-dessus du pavé. L'enfant glisse le doigt depuis le bas de l'écran, les boutons d'Android apparaissent : les rangées disparaissent, la voix continue de parler des poissons. Même chose aux additions pendant l'aide du coquillage (« Regarde la maison… »), ou au calcul rapide après avoir touché le coquillage (le chemin s'efface et ne revient pas avant la question suivante).
- **Gravité.** À corriger. C'est exactement le geste de la demande 1, et la SPEC (section 11) promet « la scène se remet à l'échelle sans rien perdre (la partie, la voix, l'écran en cours) ».
- **Proposition.** Dans `place()`, ne réaffecter `width` et `height` que s'ils changent, et ne pas toucher à `used` dans ce cas (comme pour `line.fx`). Dans `tests/e2e/redimension.mjs`, ajouter un cas qui redimensionne pendant une aide affichée et vérifie que le calque n'est pas vide (`c.__used`, ou quelques pixels lus), **avant** de répondre.

### 2. Certaines réponses ne sont pas notées avant leur correction : après un rechargement, elles sont perdues

- **Ce qui se passe.** La SPEC (section 2) dit que la réponse est écrite « dès qu'elle est donnée, avant la correction », et qu'une réponse fausse dont la correction était à l'écran est enregistrée. Ce n'est pas le cas :
  - **la dictée de nombres** (ligne graduée, niveau 12, format « ecrire ») : `Dictation.ask` (`modules/numberline/dictation.js`) n'appelle jamais `app.surReponse`, et `FactsScreen.submit` s'arrête avant pour `q.dictee` (ligne 288) ;
  - **les voiliers, « je ne sais pas »** : `montrer()` (le bateau guidé, la phrase de l'erreur) est joué avant le seul `surReponse` du bilan (ligne 277) ;
  - **les voiliers, bateau rattrapé par les pirates** (`r.rattrape`) : `couler()` et la phrase sont joués avant le bilan ;
  - **l'étal** : `compter()` (le pêcheur compte la soucoupe pièce par pièce, une phrase par pièce) est joué avant `signaler`.
- **Comment le reproduire.** Ligne graduée au niveau 12 : la voix dit « trois-cent-sept », l'enfant tape 3007. La correction (le nombre décomposé) est à l'écran. Android ferme Chrome, puis « continuer » : la même dictée est reposée, la réponse fausse n'existe nulle part, et l'espace parent dit « a repris à la question en cours ». Même chose aux voiliers après « je ne sais pas » pendant que le bateau va seul au bon passage.
- **Gravité.** À corriger (la deuxième demande du parent le dit mot pour mot).
- **Proposition.** Dictée : appeler `this.app.surReponse?.(result)` juste après le calcul de `result`. Voiliers : appeler `surReponse` (avec `nsp` ou `rattrape` et le code) avant `montrer` et avant `couler`. Étal : `signaler(res)` avant `compter`, avec un résultat provisoire si besoin, ou bien dire dans la SPEC que le comptage n'en fait pas partie. Ajouter ces cas à `tests/e2e/reprise.mjs`.

### 3. Ce qui est redit à la reprise ne suit pas la SPEC, et les voiliers reprennent sans consigne

- **Ce qui se passe.** La SPEC dit : « Ni la phrase d'entrée de l'étape, ni l'introduction de l'échauffement ne sont redites. » C'est vrai pour l'échauffement, faux pour la notion du jour. `notion2`, `notion3`, `notion5` et `notion6` (`main.js`) disent leur phrase d'entrée avant `runNotion`, sans regarder s'il y a un point de reprise : « On continue ! », puis « Maintenant, les additions, avec le bernard-l'ermite ! » (ou le mur de corail montré par `introWall`, ou « Bienvenue à mon étal ! »), puis la question reposée. À l'inverse, aux voiliers, `premier` et `annonce` du runner sont restaurés à faux : après la reprise, le bateau suivant n'a ni la consigne (« Range le bateau… »), ni l'annonce du vent ou des pirates. La voix dit seulement le nombre.
- **Comment le reproduire.** (a) Notion du jour aux additions, 10e question, rechargement, « continuer » : trois phrases avant la question, dont la phrase d'entrée. (b) Voiliers, après 5 bateaux, rechargement pendant le « bravo » (réponse déjà notée), « continuer » : un bateau arrive, la voix dit « 47 ». Si la reprise a lieu une heure plus tard, l'enfant ne sait plus quoi faire.
- **Gravité.** À corriger. Il y a un écart avec la SPEC, et aux voiliers une enfant qui ne lit pas reste sans consigne.
- **Proposition.** Soit les fonctions `notionN` ne disent leur phrase d'entrée que sans point de reprise (une lecture de `session.rec.pointReprise` valide, sans le consommer), soit la SPEC dit que la phrase d'entrée est redite ; je pense que la redire peut aider l'enfant, c'est au parent de trancher. Aux voiliers, forcer `premier: true` (et l'annonce de la mer en cours) sur la première question posée après une reprise.

### 4. Le temps de l'étape repart de zéro à chaque reprise

- **Ce qui se passe.** Dans `Session.run()`, `t0 = this.active()` est pris quand l'étape (re)commence. La fin de l'étape (`end = t0 + minutes`) et sa durée notée (`dureeS`) partent donc du moment de la reprise. Quand l'étape repartait de son début, c'était défendable ; maintenant qu'elle continue à la question près, elle reçoit un budget neuf.
- **Comment le reproduire.** Notion du jour (6 minutes prévues), rechargement au bout de 5 minutes, « continuer » : la notion peut durer encore jusqu'à 6 minutes, bornée seulement par le plafond de la séance (12 min moins la réserve de la récompense). Le défi record qui devait suivre est alors sauté pour « temps écoulé ». Et le parent lit « notion du jour 16 s » (capture `reprise-10-parent-historique` : « échauffement 7 s, notion du jour 16 s »).
- **Gravité.** À corriger.
- **Proposition.** Garder dans le point de reprise (ou dans la fiche) le temps actif déjà passé dans l'étape, et en tenir compte pour `t0`. Ajouter les deux morceaux pour `dureeS`.

### 5. Une réponse donnée juste avant la fin du temps est perdue après un rechargement

- **Ce qui se passe.** La réponse notée n'est enregistrée que si l'étape est rejouée et pose une question. Or `run()` saute l'étape si `this.over()` (« temps écoulé »), et les boucles de `runNotion` et `runWarmup` testent `session.over(end)` avant de consommer `reprise`.
- **Comment le reproduire.** Fin de séance : la dernière question de la notion est posée juste avant l'heure limite. L'enfant répond après l'heure limite (la sauvegarde de `noteReponse` fixe alors `dureeS` au-delà). La réponse est fausse, la correction est à l'écran, puis rechargement et « continuer ». La notion est notée « sautée (temps écoulé) » alors qu'elle a été jouée, et la réponse n'est pas enregistrée.
- **Gravité.** À corriger.
- **Proposition.** À la reprise, si le point valide contient une réponse, l'enregistrer (`runner.record`, `answered`, `stars`) avant tout test de temps ; ou laisser entrer l'étape même si le temps est écoulé, le temps de consommer la réponse notée.

### 6. Dans l'historique du parent, la réponse d'avant le rechargement est datée de la reprise

- **Ce qui se passe.** La réponse notée est enregistrée par `runner.record` à la reprise, avec `t: Date.now()` (par exemple dans `numberline/runner.js`, ligne 119). Son heure est donc celle de « continuer » (parfois une heure plus tard), et `answerTable` (`parent/parent.js`) la range **après** la ligne « page rechargée… la réponse donnée juste avant est comptée ». De plus, « après N questions » ne compte pas cette réponse.
- **Comment le reproduire.** Ligne graduée, une réponse fausse à 18 h 42, rechargement pendant la correction, « continuer » à 19 h 30. Le tableau montre « 19 h 30 : page rechargée ; … la réponse donnée juste avant est comptée », puis la réponse fausse, notée à 19 h 30.
- **Gravité.** Mineur (l'information est là, mais elle est trompeuse pour le parent).
- **Proposition.** Noter l'heure dans la réponse au moment de `noteReponse` (`t`). Les runners utiliseraient `r.t ?? Date.now()` ; ou, plus simple, l'espace parent place la ligne de reprise après une réponse marquée « notée avant le rechargement ».

### 7. Pendant quelques secondes après une réponse, la fiche est incohérente

- **Ce qui se passe.** `point(null, { sauver: false })` copie `progress` **avant** `session.answered()`, qui fait `faites++` et `questions++`. Le premier enregistrement qui suit (dans `answered`) écrit donc un point avec une frise en retard d'un rond. Pire : si le cran redescend, `protect()` enregistre la fiche (point sans question en cours, réponse déjà enregistrée par le runner), puis attend la phrase « cranDescente » (environ 3 s) **avant** `questions++`.
- **Comment le reproduire.** Cran « dur », 3 erreurs sur les 5 dernières réponses : la voix annonce la descente, rechargement pendant cette phrase, « continuer ». La réponse est dans le tableau du parent, mais pas dans « N questions », ni dans la réussite de la séance. La frise a un rond de moins qui ne se remplira jamais.
- **Gravité.** Mineur (la fenêtre est courte).
- **Proposition.** Écrire le point dans la même sauvegarde que `answered`, après l'incrément : par exemple, `answered` accepte le point à écrire, ou bien `point(null)` est appelé juste après `answered`, avec sauvegarde.

### 8. Le point de reprise est gros, copié à chaque question, et reste pour toujours dans les fiches non terminées

- **Ce qui se passe.** `instantane(warmup)` (et celui de `Module2Runner`, par `w`) copie `facts`, c'est-à-dire tous les faits **avec tout leur historique**, qui n'est jamais raccourci (`afterFact` y ajoute une ligne à chaque réponse). Mesure avec un script Node, pour 120 faits de 40 lignes d'historique chacun (quelques mois d'usage) : **environ 450 Ko par instantané, environ 10 ms de copie sur un ordinateur de bureau** (bien davantage sur la Tab S5e). Il est copié deux fois par question, et la fiche entière (avec lui) est réécrite dans IndexedDB trois à quatre fois par question, dont une au moment même de la réponse (`noteReponse`, juste avant le « bravo »). Enfin, `pointReprise` n'est effacé qu'au changement d'étape et en fin de séance. Il reste dans toute fiche interrompue (« choisir » depuis la pause, « Terminer la séance » du parent) et dans toute séance laissée en cours et non reprise le jour même. Ces fiches sont relues à chaque lancement (`store.all("seances")`) et partent dans l'export.
- **Comment le reproduire.** Une séance avec échauffement ; en pause, « choisir », un autre exercice. La fiche interrompue garde son `pointReprise` (des centaines de Ko) pour toujours.
- **Gravité.** À corriger (à mesurer sur le banc, profil `s5e` : temps d'image au moment de la réponse, durée du lancement après quelques mois de données).
- **Proposition.** Ne pas copier ce qui est déjà dans la base et que `load()` relit (`facts`, `fam`, `st` : les relire suffit, puisque l'instantané est pris après chaque enregistrement). Effacer `pointReprise` dans `interrupt()`, et au lancement pour une séance que `repriseDuJour` ne reprend pas.

### 9. (Hors du commit) La bulle cache les rangées de poissons de la multiplication

- **Ce qui se passe.** La bulle « 5 rangées de 5 poissons. Combien de poissons en tout ? » se pose sur les rangées dessinées par `paintBand`. La bulle n'évite le calque des aides que par ses `zones`, que seul le calcul rapide déclare.
- **Comment le reproduire.** N'importe quelle question de multiplication sur `s5e` (captures `redimension-s5e-multiplication`, `reprise-10-multiplication-question-reposee`).
- **Gravité.** Mineur (déjà là avant ; contraire à « la bulle ne cache plus ce dont parle la voix » du guide du parent).
- **Proposition.** Faire déclarer à `paintBand` la zone des rangées (`board.zones`), comme le chemin du calcul rapide.

### Écarts avec les documents

- **SPEC, section 2** : la phrase d'entrée (constat 3), les réponses notées « dès qu'elles sont données » (constat 2 : dictée, voiliers « je ne sais pas » et rattrapés, comptage de l'étal), et rien sur le temps de l'étape (constat 4). Le reste est exact (le défi et l'accueil repartent au début, une leçon en cours est rejouée, le calcul guidé repart du premier caillou, une nouvelle version repart au début de l'étape).
- **SPEC, section 11** : « sans rien perdre (la partie, la voix, l'écran en cours) » n'est pas vrai pour les aides (constat 1).
- **GUIDE-PARENT** : l'ancien paragraphe (« reprend au début de l'étape… pas à la question près… Une limite… ») est gardé, avec une phrase en italique qui le contredit. Le nouveau paragraphe, plus bas, est clair, mais il promet aussi « sa réponse est comptée (même fausse, même si la correction était à l'écran) », ce qui n'est pas vrai dans les cas du constat 2.

## Traitement (par la session du lot)

| Constat | Traitement | Vérifié par |
| --- | --- | --- |
| 1. Les aides dessinées s'effacent au redimensionnement | Corrigé : le calque des aides (`AidBoard.place`) n'est réinitialisé que si sa résolution change, comme le fond, la ligne et les personnages | `tests/e2e/redimension.mjs` compte les points de l'aide dessinée avant et après (les rangées de la multiplication des niveaux 1 et 2, le chemin du calcul rapide) |
| 2. Réponses non notées avant leur correction | Corrigé : la dictée (`numberline/dictation.js`), « je ne sais pas » et le bateau rattrapé des voiliers, l'étal jugé et noté dès la coche, avant que le pêcheur compte | `tests/e2e/reprise.mjs` : la dictée des nombres et « je ne sais pas » aux voiliers ajoutés |
| 3. Phrase d'entrée redite ; voiliers sans consigne | Corrigé : `session.reprendAuPoint` ; la question reprise est marquée (`q.repris`, non enregistrée) et les voiliers redisent la consigne et l'annonce de la mer | lecture du code ; `reprise.mjs` (aucune phrase sans fichier) |
| 4. Le temps de l'étape repart de zéro | Corrigé : `rec.etapeDebut`, le début de l'étape en temps actif, gardé dans la fiche et repris | `tests/unit/reprise-question.test.mjs`, constat 4 |
| 5. Réponse perdue après l'heure limite | Corrigé : l'étape n'est pas sautée si son point porte une réponse ; la réponse est enregistrée avant que les boucles regardent l'heure | `reprise-question.test.mjs`, constat 5 |
| 6. L'heure de la réponse | Corrigé : la réponse notée garde son heure (`t`), reprise par l'enregistrement ; « après N questions » la compte | `reprise-question.test.mjs`, constat 5 |
| 7. Réponse comptée après la phrase du cran | Corrigé : `answered` compte et enregistre d'abord, la protection (et sa phrase) ensuite | `reprise-question.test.mjs`, constats 7 et 8 |
| 8. Le point de reprise trop gros, jamais effacé | Corrigé : l'historique des faits (`facts`, relu de la base) n'est plus copié (moins de 1 Ko au lieu de 300) ; effacé à l'interruption et au début de la séance suivante | `reprise-question.test.mjs`, constats 7 et 8 |
| 9. La bulle cache les rangées de la multiplication | Corrigé : leur cadre est déclaré au calque des aides, comme le chemin du calcul rapide | lecture du code |
| Phase 1 : la flèche sur « continuer » absente des captures | Pas un défaut : la flèche est posée le temps de la phrase « Te revoilà… », très courte en voix rapide ; elle est vérifiée image par image par `decisions-agent.mjs`, partie 1 | `decisions-agent.mjs` |
| Phase 1 : l'historique affiche des durées d'étape fausses | Conséquence du constat 4, corrigée avec lui | idem |
