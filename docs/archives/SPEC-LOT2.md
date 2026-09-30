# Lot 2 — spécification

Version du 27 septembre 2026, rédigée en conception après la recette du lot 1 bis et les décisions du parent du même jour. Ce document complète `docs/SPEC.md` et reprend la partie A de `docs/archives/SPEC-COMPLEMENTS.md` (nombres jusqu'à 1 000). **En cas de contradiction, ce document prévaut.** Le prompt est dans `docs/archives/PROMPT-LOT2.md`.

## 1. Pourquoi ce lot : ce que la recette a montré

Recette du 27 septembre 2026 (outils `tests/sim-seances.mjs`, `tests/e2e/recette.mjs`, `tests/e2e/recette-durees.mjs`). Les profils d'enfant simulés sont des hypothèses ; les durées sont mesurées dans Chromium avec la voix réelle.

| Constat | Mesure |
| --- | --- |
| La séance est deux à trois fois plus courte que prévu | 3 min en répondant vite ; 4 min 10 s pour une enfant qui répond en 4,5 s (première séance, leçon L1 comprise) ; 15 à 20 questions au lieu de 25 à 35 : elle s'arrête au nombre de questions, pas au temps |
| Les révisions étouffent les faits nouveaux | l'échauffement remplit ses 5 à 8 places avec les faits dus ; en 30 séances simulées (2 par semaine) : 29 faits sur 33 vus par une enfant qui sait tout, 24 pour le profil de l'évaluation, 11 pour une enfant en difficulté ; la première séance pose 1 + 1, 2 + 1, 1 + 2 deux fois |
| La ligne graduée plafonne ou tourne en rond | une enfant à l'aise atteint le niveau 8 à la 8e séance puis ne fait plus que de l'estimation ; une enfant en difficulté revoit la même leçon deux fois par séance, séance après séance |
| Les cartes s'épuisent | lagon complet vers la 12e à 14e séance, puis doublons seulement ; aucune étoile dorée possible à 2 séances par semaine |
| Défauts graphiques | la tortue passe derrière les bras de la pieuvre au départ de la ligne ; la pieuvre montre toujours vers la droite |

Hypothèse de rythme retenue par le parent : **au moins 2 séances par semaine d'école**. Tout ce qui suit doit rester juste à 2 comme à 5 séances par semaine.

## 2. La séance : plus longue, et plus variée

**Durée visée : 9 à 11 minutes** pour une enfant qui répond en 4,5 secondes (mesuré avec `tests/e2e/recette.mjs --delai 4.5`). Estimation : il faudra probablement 35 à 40 questions en tout (une question dure environ 7 à 10 s, voix et correction comprises), soit davantage que les nombres ci-dessous ; d'où la règle « la durée prime ».

| Étape | Lot 1 | Lot 2 |
| --- | --- | --- |
| Échauffement (faits d'addition dus et nouveaux) | 5 à 8 faits, 2 min | **10 à 14 faits, 3 min** |
| Notion du jour | 8 à 10 questions, 5 min | **12 à 16 questions, 6 min** |
| Défi record | désactivé | **activé à partir de la 5e séance terminée**, 1 min, seulement si au moins 8 faits sont en boîte 3 ou plus (sinon l'étape est sautée sans rien dire) |
| Problème du jour | désactivé | inchangé (lot 4) |

Les nombres sont des réglages de `app/content/seance.json`, à ajuster après essai sans toucher au moteur. **La durée prime** : si la recette (enfant qui répond en 4,5 s, `tests/e2e/recette.mjs --delai 4.5`) donne moins de 9 minutes, Claude Code relève les nombres de questions dans `seance.json` jusqu'à l'atteindre, et le note. Tant que le défi record n'existe pas (étapes 2 à 6), la cible est 8 à 10 minutes.

**Notion du jour : alternance.** La notion du jour alterne **séance après séance** (et non jour après jour) entre le module 1 (ligne graduée) et le module 2 (faits d'addition). On ne choisit jamais deux fois de suite le même module, sauf si l'autre n'a rien à proposer. Le parent peut imposer le module de la prochaine séance (réglage de l'espace parent, valable une séance). Le module 3 s'ajoutera à la rotation au lot 3 (règle de la SPEC : le module débloqué le moins maîtrisé, jamais trois fois de suite).

### Sélecteur de difficulté en début de séance (décision du parent, 27 septembre)

Juste après l'accueil, avant l'échauffement, l'enfant voit un **curseur à 4 crans déjà placé sur « conseillé »** (le niveau que l'adaptation a calculé). Elle peut le laisser ou le déplacer. Le cran vaut pour **toute la séance, échauffement compris**.

| Cran | Effet | Étoiles des bonnes réponses |
| --- | --- | --- |
| Plus facile | un cran de difficulté en dessous du conseillé | × 0,5 |
| Conseillé (position de départ) | le niveau calculé par l'adaptation | × 1 |
| Plus dur | un cran au-dessus | × 1,5 |
| Très dur | deux crans au-dessus | × 2 |

- **Le multiplicateur** ne s'applique qu'aux étoiles des bonnes réponses (et des erreurs corrigées). Les étoiles de fin de séance, des leçons, de la série et du défi record restent inchangées. Les fractions s'accumulent : une étoile tombe chaque fois que le total atteint un entier (à × 0,5, une étoile toutes les deux bonnes réponses). Réglages dans `app/content/seance.json` (`selecteur.multiplicateurs`).
- **Ce que veut dire « un cran »**, réglages dans `app/content/` :
  - *Ligne graduée* : un niveau (plus facile = niveau − 1, très dur = niveau + 2), borné au premier et au dernier niveau disponible.
  - *Échauffement* : plus facile = seulement des faits dus, pas de fait nouveau ; plus dur = 2 faits nouveaux de plus (dans la limite commune de la séance) et formes à trou pour les faits en boîte 3 ou plus ; très dur = 3 faits nouveaux de plus, formes à trou dès la boîte 2, et faits de la famille suivante même si elle n'est pas encore ouverte.
  - *Additions en notion du jour* (étape 6) : plus facile = formes directes de la famille en cours, aide affichée d'emblée ; plus dur = formes à trou et faits de la famille suivante ; très dur = formes à trou, mélange de toutes les familles ouvertes et famille suivante.
- **Progression** : réussir à un cran au-dessus valide ce niveau (8 bonnes réponses sur 10, règle habituelle) et fait monter le « conseillé ». Échouer au-dessus ne fait **jamais** baisser le conseillé. Une séance « plus facile » compte normalement.
- **Protection** : si l'enfant est en difficulté persistante à un cran au-dessus du conseillé (3 erreurs sur 5), l'application redescend d'un cran pour le reste de la séance, avec une phrase douce (« On essaie un peu moins dur ? »), et le multiplicateur suit le nouveau cran.
- **Les questions triviales « a + 0 »** (mesure du temps de base) ne sont plus posées qu'une séance sur 5, quel que soit le cran.
- **Écran** : sans texte à lire. Quatre bulles alignées ou un curseur à glisser ; chaque cran montre des vagues de plus en plus grosses et ses étoiles (une demi-étoile, une étoile, une étoile et demie, deux étoiles). Le cran conseillé est entouré d'une lueur. La voix dit : « Choisis ton niveau. Plus c'est dur, plus tu gagnes d'étoiles ! » ; toucher un cran le fait dire (« Très dur : deux fois plus d'étoiles ! »). Une grosse coche valide ; sans toucher pendant 15 secondes, la séance commence sur le cran affiché. Dessins dans l'atelier, style A.
- **Entraînement libre** : même sélecteur, sans étoiles (donc sans multiplicateur).
- **Espace parent** : le cran choisi à chaque séance (historique, export CSV) ; réglage des crans autorisés (par exemple interdire « plus facile », ou ne pas aller au-delà de « plus dur »).
- **Effet sur les cartes** : davantage d'étoiles ne donne pas plus de cartes nouvelles (le quota prime) ; cela donne plus de doublons, donc un peu plus de brillantes (5 % par doublon depuis la décision du 27 septembre, voir section 5).
- **Cran « plus facile », additions (décision du parent du 27 septembre, après une relecture extérieure)** : un fait réussi avec l'aide affichée d'emblée **ne change pas de boîte** (règle de la SPEC « juste avec une aide : pas de promotion ») ; il n'est pas non plus renvoyé en boîte 1 (seule une erreur le fait). La réponse est notée « aide d'emblée » (champ `aideDEmblee`), distincte de l'aide demandée. Cohérent avec la ligne graduée (une réussite « plus facile » ne fait pas monter le niveau) : le cran « plus facile » consolide sans faire progresser.
- **Cran « plus facile » choisi à chaque séance (point tranché le 27 septembre 2026)** : le moteur ne change pas ; une réussite au cran « plus facile » ne compte toujours pas pour la montée du niveau conseillé. La parade est le réglage existant de l'espace parent (interdire « plus facile »), expliqué dans `docs/GUIDE-PARENT.md` : à utiliser si l'enfant choisit « plus facile » presque à chaque séance et ne monte plus de niveau.
- **Recette** : deux profils de plus dans la simulation, une enfant qui choisit toujours « très dur » et une qui choisit toujours « plus facile » : taux de réussite, « je ne sais pas », descentes automatiques de cran, étoiles par séance.

## 3. Module 2 complet

### Familles et ouverture

Les familles 3 à 7 de la SPEC s'ajoutent aux familles 1 et 2. Le catalogue compte **45 faits** (a et b de 1 à 9, a + b ≤ 10) ; les 21 additions avec 0 ne servent qu'au temps de base et n'ont pas de boîte (les « 66 » de la SPEC les comptent).

- **Deux notions distinctes.** L'*introduction* d'un fait nouveau suit la règle du lot 1 : il est présenté avec la première famille qui le contient (ordre des familles). La *pratique* d'une famille, elle, porte sur **tous les faits qui relèvent de sa règle**, même déjà rencontrés dans une famille précédente : les amis de 10 incluent 9 + 1, 8 + 2 et 5 + 5 ; les presque-doubles sont 1 + 2, 2 + 3, 3 + 4, 4 + 5 et leurs inverses (8 faits). Une famille est « acquise » quand 80 % des faits de sa règle sont en boîte 3 ou plus.
- La famille suivante **s'ouvre** quand 80 % des faits déjà introduits sont en boîte 2 ou plus, ou quand le parent la marque connue (« point de départ », section 7). Une famille sans fait nouveau à introduire s'ouvre quand même (elle a des faits à pratiquer).
- La famille 7 (mélange) : tous les faits introduits, les plus faibles d'abord (boîte la plus basse, puis temps médian le plus long).
- **Une boîte au plus par séance** : un fait monte d'une boîte au plus dans une même séance (échauffement, notion du jour et défi confondus) ; les passages suivants ne peuvent que le faire redescendre après une erreur.
- Une famille acquise compte comme un **niveau franchi** : une étoile arc-en-ciel (comme au module 1). Un niveau ou une famille fixés par le parent (« point de départ ») ne rapportent rien.

### Échauffement : places réservées et voie rapide

- **Places réservées** : tant qu'il reste des faits à introduire, **3 places** de l'échauffement vont à des faits nouveaux, même quand les faits dus remplissent toute la liste (les faits dus en trop attendent la séance suivante, les plus en retard d'abord). Limite : autant que la boîte 1 le permet (pas plus de 8 faits en boîte 1, règle du lot 1 qui protège l'enfant qui se trompe beaucoup).
- **Voie rapide des faits** : un fait rencontré pour la première fois et réussi juste, vite et sans aide entre directement en **boîte 3** au lieu de la boîte 1. Si les 3 faits nouveaux réservés passent ainsi, l'échauffement en **ajoute** jusqu'à 3 autres à la fin de la liste (ils s'ajoutent aux 10 à 14 questions, sans prendre la place des faits dus).
- **Limite commune** : au plus 6 faits nouveaux par séance, échauffement et notion du jour confondus.
- Critère de recette : profil « sait » de la simulation, les 33 faits des familles 1 et 2 vus avant la 7e séance ; profil « reel », au moins 2 faits nouveaux par séance tant qu'il en reste à introduire et que la boîte 1 le permet.

### Formes à trou

- Les formes à trou (« 3 plus combien, ça fait 7 ? », « Combien plus 4, ça fait 6 ? », textes `faitTrouDroite` et `faitTrouGauche` déjà validés) **s'ouvrent pour une famille** le jour où la moitié des faits de sa règle atteignent la boîte 3. L'ouverture est enregistrée et **définitive** (elle ne se referme pas si des erreurs font redescendre des faits). Ensuite, chaque question sur un fait de cette famille tire la forme au hasard (un tiers chacune).
- Une seule boîte par fait : une réponse juste et rapide dans n'importe quelle forme le fait monter. La forme est enregistrée avec la réponse (champ `forme`), pour l'espace parent.

### Le module 2 comme notion du jour

Quand la notion du jour est le module 2 :

1. **La famille en cours** est la plus basse des familles ouvertes qui n'est pas encore acquise (ni dépassée, ci-dessous) ; quand toutes sont acquises, c'est la famille 7 (mélange).
   **Stagnation (décision du parent du 27 septembre, après une relecture extérieure)** : si la famille en cours n'est pas acquise après **6 séances dont la notion du jour est les additions** avec elle pour famille en cours (réglage `familles2.stagnation.seances` de `app/content/module2.json`), elle est « dépassée » : la famille suivante devient la famille en cours (elle s'ouvre si elle ne l'était pas) et joue sa leçon à sa première notion du jour ; la famille dépassée reste travaillée en révision (échauffement, questions « autres familles » de la notion du jour) et peut encore être acquise (étoile arc-en-ciel). L'espace parent la marque « en révision ».
2. **La première fois** qu'une famille est la notion du jour : sa leçon (L4 doubles, L5 amis de 10, L6 maison des nombres ; textes de la SPEC). Pour une famille sans leçon (1, 5, 6, 7), deux exemples guidés avec l'appui visuel de la famille. Ensuite, comme au module 1 : deux exemples guidés, que l'on peut passer.
3. **12 à 16 questions** : au moins la moitié sur les faits de la règle de la famille en cours (faits nouveaux compris, dans la limite commune de 6 par séance ; formes à trou quand elles sont ouvertes), le reste sur les faits introduits les plus faibles des autres familles. Un même fait ne revient pas plus de 3 fois dans la séance. Aide du coquillage disponible. Les réponses suivent la même révision espacée que l'échauffement.
4. Une erreur montre l'appui visuel de la famille (cadre de 10, maison, reflet, ligne), puis la bonne réponse ; « passer » disponible comme partout.
5. **Aide passable (décision du parent du 27 septembre, après une relecture extérieure)** : l'aide du coquillage et l'aide affichée d'emblée du cran « plus facile » montrent **dès leur début** le bouton « passer » habituel (`skipKey` : même dessin, même place) ; un toucher coupe la voix et l'animation (tortue, cadre, maison, reflet), range l'appui et rend le pavé aussitôt. Aucune attente sans commande ne doit dépasser environ 2 s (hors voix), vérifié par `tests/e2e/recette-durees.mjs`.

### Aides visuelles et personnage guide

- **Cadre de 10** : une boîte de corail de 2 × 5 alvéoles (famille 3, L5).
- **Maison des nombres** : une maison-coquillage, le total sur le toit, deux pièces par étage (familles 4 et 5, L6).
- **Double + 1** : le poisson et son reflet plus une bulle (presque-doubles).
- **Bernard-l'ermite**, guide du module 2 (option complète retenue par le parent) : personnage de l'atelier, dessiné une fois (`references/workflows/character-consistency.md`), avec repos, sortir de sa coquille, changer de coquille, montrer, se réjouir. Il apparaît dans les leçons L4 à L6, les exemples guidés et les corrections du module 2.

### Défi record

Selon la SPEC : 1 minute, faits en boîte 3 ou plus seulement, pavé numérique, score comparé à son propre record (jamais à une norme), 5 étoiles au nouveau record. Chronomètre visible (seul endroit), sous la forme d'un sablier ou d'une bulle qui se vide, sans chiffre de secondes.

## 4. Module 1 : ligne graduée

- **Voie rapide** : elle doit pouvoir faire franchir **plusieurs niveaux dans une même séance** (avec la leçon d'entrée du niveau quand elle existe). À vérifier et corriger si ce n'est pas le cas.
- **Leçon relancée au plus une fois par séance** (même leçon). Si la difficulté persiste ensuite : les questions suivantes de la séance sont prises au niveau inférieur, et la prochaine erreur est corrigée à vitesse 1 (plus lente) au lieu de relancer la leçon.
- **Nombres jusqu'à 1 000** : niveaux 9 à 13, format « écrire » (dictée au pavé numérique), erreurs E6 et E7, chalut de 100 dans l'atelier, leçon L10 : **tout ce qui est décrit dans `docs/archives/SPEC-COMPLEMENTS.md`, partie A**. Ouverture quand le niveau 8 est acquis, ou par le « point de départ » du parent.
- **Voix des grands nombres (contrainte réelle)** : aujourd'hui, les phrases qui contiennent un nombre sont fabriquées pour chaque valeur de 0 à 100. Les étendre à 1 000 pour chaque type de phrase coûterait environ 5 000 phrases et 25 à 30 Mo de plus, au-dessus du plafond actuel de 15 Mo (la voix en fait déjà 9,4). Règle : fabriquer **seulement les valeurs que les générateurs des niveaux 9 à 13 peuvent produire**, et porter le plafond du test à **40 Mo**. Si l'estimation dépasse encore 40 Mo, s'arrêter et le signaler avant de fabriquer (solution de repli à faire valider par le parent : une phrase courte suivie du nombre seul, dans un second fichier).
- **Tortue devant la pieuvre** : la tortue, les arcs numérotés et les filets de bulles des retours (E1 à E5) ne passent jamais derrière la pieuvre. Soit la pieuvre s'écarte ou remonte pendant ces animations (comme pendant les leçons), soit la tortue et le calque d'effets passent au-dessus d'elle ; au choix, à vérifier sur capture.
- **La pieuvre montre la cible** : le geste « montrer » vise la cible de la question (au moins trois orientations : bas, bas-droite, droite).

## 5. Récompenses : rythme des cartes jusqu'en juin

Objectif du parent : **toutes les cartes gagnées, légendaires comprises, à la fin de l'année scolaire**, à raison d'au moins 2 séances par semaine d'école.

### Calendrier

Un fichier de contenu `app/content/calendrier.json` donne les vacances scolaires (zone C, académie de Versailles) et la fin de l'année. Il se modifie sans toucher au moteur.

| Période 2026-2027 (zone C) | Dates (départ après la classe, reprise le matin) |
| --- | --- |
| Toussaint | 17 octobre au 2 novembre 2026 |
| Noël | 19 décembre 2026 au 4 janvier 2027 |
| Hiver | 6 février au 22 février 2027 |
| Printemps | 3 avril au 19 avril 2027 |
| Été | à partir du 3 juillet 2027 |

Source : calendrier scolaire officiel, education.gouv.fr (arrêté publié en octobre 2025). Du 28 septembre 2026 au 2 juillet 2027 : **32 semaines d'école**.

### Quota de cartes nouvelles

- **2 cartes nouvelles par semaine d'école**, cumulées : `quota = base + 2 × (semaines d'école dont le lundi est passé depuis la date de base, semaine de la date de base comprise si c'est une semaine d'école)`, au plus 60. La **base** (date et nombre de cartes possédées) est enregistrée sur la tablette au premier lancement de la version du lot 2 (ou au premier lancement tout court, ou après « tout effacer »). Une semaine sans séance se rattrape plus tard, dans la limite de 2 coquillages par séance (règle inchangée). Pendant les vacances, le quota n'augmente pas, mais ce qui reste à gagner reste gagnable.
- Un coquillage donne une **carte nouvelle** si le nombre de cartes possédées est sous le quota ; sinon, un **doublon** d'une carte déjà possédée, de préférence une carte qui n'est pas encore brillante. **Le quota prime** sur l'ancienne règle « pas de doublon tant qu'une zone n'est pas complète » : sous le quota, pas de doublon ; au-dessus, doublon même si la zone est incomplète. Sans aucune carte possédée, toujours une carte nouvelle.
- Le prix du coquillage reste 25 étoiles. Avec la séance allongée, une séance rapportera probablement assez pour 2 coquillages : à 2 séances par semaine, cela fait environ 2 cartes nouvelles et 1 à 2 doublons par semaine.
- Calendrier attendu à 2 séances par semaine, en partant de zéro : lagon complet vers la semaine du 30 novembre, récif de corail vers le 1er février, grand large vers le 26 avril, abysses vers le 14 juin ; 2 semaines de marge.

### Cartes brillantes (décision du parent)

- **Une carte nouvelle a 20 % de chances d'être brillante, un doublon 5 %** (décision du parent du 27 septembre 2026 ; réglages `brillanteNouvelle` : 0,2 et `brillanteDoublon` : 0,05 dans `cartes.json`). **La règle « le 3e doublon rend la carte brillante » est supprimée.** Une carte déjà brillante sur la tablette le reste.
- **Effet** : un reflet irisé qui balaie la carte en diagonale toutes les 3 à 4 secondes, et quelques étincelles sur le cadre ; en grand comme dans l'album (les vignettes brillantes scintillent). Dessiné dans l'atelier, léger à l'affichage (pas de redessin de l'illustration).
- **Annonce** : quand la carte sort brillante, la voix dit « Oh ! Elle est brillante ! » (phrase nouvelle, voix à fabriquer) et l'effet démarre au retournement.
- But : une collection de brillantes qui grandit toute l'année. Pas de compteur chiffré pour l'enfant.
- **Point tranché le 27 septembre 2026** (il était ouvert depuis la recette de l'étape 1) : avec 20 % pour toute carte et la règle du 3e doublon, 56 à 57 cartes sur 60 devenaient brillantes avant l'été à 5 séances par semaine, 13 à 42 à 2 séances selon le profil (le cran « très dur » augmentant les doublons). Décision du parent : 20 % pour une carte nouvelle, 5 % pour un doublon, suppression de la règle du 3e doublon (appliquée au début de l'étape 7 ; le nombre de brillantes en juin par profil est donné à la recette de l'étape 9).

### Zones

- La zone suivante **s'ouvre dès que toutes les communes et les rares de la zone en cours sont gagnées**, **à condition que toutes ses cartes aient leur illustration et leur anecdote** (sinon elle attend son contenu, et les coquillages donnent des doublons). Elle est ouverte par une étoile arc-en-ciel à la récompense (petite cérémonie : l'étoile vole vers l'album, le dos de la zone s'éclaire). La réserve est le compteur `arcEnCiel` existant (les étoiles gagnées depuis le lot 1 comptent) ; si elle est vide, la zone s'ouvre au prochain niveau franchi ou à la prochaine famille acquise.
- La simulation sur l'année considère les zones 3 et 4 comme prêtes (contenu fictif) pour vérifier le rythme. Dans la réalité, leur contenu doit être livré à temps : **zone 3 avant début février, zone 4 avant fin avril** (à 2 séances par semaine).
- Une zone ouverte dont les créatures ne sont pas encore dessinées dans l'atelier vit **seulement dans l'album** (le récif animé des zones 2 à 4 vient au lot 4). Le récif continue de montrer le lagon.
- Les phrases des zones fermées restent celles validées le 27 septembre (« … s'ouvrira un jour, grâce à tes étoiles arc-en-ciel »).

### Étoiles dorées et légendaires

- **Une étoile dorée pour 4 semaines « réussies »** : une semaine (du lundi au dimanche) avec au moins 2 séances terminées ; consécutives ou non (on ne perd jamais rien). Les semaines comptent depuis la toute première séance (celles du lot 1 comprises). Remplace la règle « 5 séances dans la semaine », impossible à 2 séances par semaine.
- **Les légendaires sont les dernières cartes de leur zone** (grand requin blanc et orque au grand large ; baleine bleue, cachalot et narval aux abysses). Quand toutes les communes et rares de la zone sont gagnées, chaque légendaire coûte une étoile dorée, dépensée à la récompense : un **coquillage doré** s'ouvre (même animation, en or). Règles : **au plus un coquillage doré par séance**, en plus des 2 coquillages ordinaires ; il ne coûte pas d'étoiles de mer ; il passe **avant** les coquillages ordinaires quand il ne reste qu'une place sous le quota (les légendaires comptent dans le quota).
- À 2 séances par semaine : au plus 7 étoiles dorées d'ici la mi-juin (30 semaines d'école) pour 5 légendaires ; il faut donc 20 semaines réussies sur 30, soit une marge d'une dizaine de semaines incomplètes.
- Le mécanisme est codé au lot 2 pour toutes les zones ; les zones 3 et 4 n'attendent ensuite que leur contenu (illustrations, anecdotes, voix).

### Autres règles

- **Étoile arc-en-ciel gagnée en entraînement libre** (niveau franchi pendant « Encore ! ») : elle n'est plus perdue ; elle est remise à la récompense de la séance suivante.
- **Surprise une séance sur cinq** (tirage d'environ 20 %, jamais deux séances de suite) : à l'accueil, un visiteur traverse la scène avec une petite animation (un personnage déjà dessiné : tortue, bernard-l'ermite ou une créature du lagon), ou un décor offert rejoint le récif (coquillage, corail, parmi des éléments dessinés dans l'atelier). Ne rapporte pas d'étoiles.

### Zone 2 : le récif de corail

Les 15 illustrations sont dans `app/assets/cards/` et déclarées dans `cartes.json` (générées par le parent, qui les a contrôlées). À intégrer au lot 2 avec leur voix : les noms (`nomLu`, déjà présents) et les anecdotes ci-dessous, relues en conception.

| id | Anecdote |
| --- | --- |
| `tortue-verte` | La tortue verte ne doit pas son nom à sa carapace, mais à sa graisse, qui devient verte parce qu'elle mange des algues et des herbes de mer. |
| `poisson-perroquet` | Le soir, certains poissons-perroquets s'enveloppent dans une bulle de bave, comme dans un sac de couchage, pour dormir à l'abri. |
| `murene` | La murène a une deuxième mâchoire cachée au fond de sa gorge : elle avance pour attraper la proie et l'avaler. |
| `poulpe` | Le poulpe a trois cœurs et du sang bleu. |
| `seiche` | La seiche change de couleur en un clin d'œil, pour se cacher ou pour parler aux autres seiches. |
| `poisson-papillon` | Le poisson-papillon a une fausse tache en forme d'œil près de la queue : ses ennemis ne savent plus de quel côté il va partir. |
| `poisson-lion` | Le poisson-lion a sur le dos de longues épines venimeuses : on l'admire, mais on ne le touche pas. |
| `poisson-coffre` | Le poisson-coffre vit dans une carapace dure comme une boîte : seules ses nageoires et sa queue peuvent bouger. |
| `langouste` | La langouste n'a pas de grosses pinces comme le homard : pour se défendre, elle pointe ses longues antennes piquantes. |
| `benitier-geant` | Le bénitier géant est le plus grand coquillage du monde : il peut peser aussi lourd que trois grandes personnes. |
| `crevette-mante` | La crevette-mante frappe avec ses pattes si vite et si fort qu'elle casse la coquille des escargots de mer. |
| `requin-pointes-noires` | Le requin à pointes noires aime l'eau peu profonde, près des plages : on voit parfois sa nageoire noire dépasser de l'eau. |
| `poisson-mandarin` | Chaque soir, au coucher du soleil, les poissons-mandarins se retrouvent à deux et montent ensemble vers la surface, comme pour danser. |
| `raie-leopard` | La raie léopard bat de ses grandes nageoires comme des ailes : on dirait qu'elle vole sous l'eau. Elle sait même sauter hors de l'eau ! |
| `napoleon` | Le napoléon est un poisson géant : il peut devenir aussi long qu'un lit, jusqu'à deux mètres ! |

## 6. Son : bruitages et musique de fond

Demande du parent : des bruitages courts, et une petite musique de fond calme, propice à la concentration, sur un thème marin, **moins forte que les bruitages**.

- **Fabrication** : tous les sons sont fabriqués à l'avance par un outil du dépôt (`tools/son/`), sans enregistrement ni banque de sons extérieure : aucune question de droits (le dépôt est public). Fichiers Ogg Opus, versionnés, mis en cache hors ligne ; poids total visé sous 3 Mo.
- **Bruitages** : bonne réponse (bulle claire), erreur (bulle douce, jamais un son d'échec), étoile qui vole vers le compteur, coquillage qui s'ouvre, carte qui se retourne, carte brillante, toucher d'un bouton, zone qui s'ouvre. Courts (moins d'une seconde, sauf l'ouverture du coquillage).
- **Musique** : calme, lente (60 à 72 battements par minute), gamme douce (pentatonique), harpe ou marimba sur une nappe légère, vagues lointaines ; boucle de 2 à 3 minutes sans raccord audible ; aucun motif qui attire l'attention.
- **Mixage** : la musique environ 18 dB sous les bruitages ; elle baisse encore (environ 10 dB, fondu court) pendant que la voix parle ; fondu à l'entrée et à la sortie. Elle démarre au premier toucher (règle de Chrome), s'arrête dans l'espace parent, continue très bas pendant la pause.
- **Échantillons d'abord** : 2 ou 3 musiques et la série de bruitages dans `docs/son-echantillons/`, avec une petite page qui les joue (et un fichier MP3 de chaque, lisible partout). Le parent choisit à l'écoute, comme pour la voix.
- **Espace parent** : musique oui/non et son volume (3 niveaux), bruitages oui/non.
- **Choix du parent (27 septembre, après écoute des échantillons de l'étape 3)** : bruitages, les variantes « a » (bonne réponse : deux bulles et une perle ; erreur : une bulle grave et douce). Musique : **les trois musiques** (la harpe du lagon, le marimba des bulles, les profondeurs), l'une tirée au hasard au début de chaque séance et gardée en boucle pour toute la séance (y compris après une pause). Poids : les trois musiques font 3,6 Mo en Opus à 64 kbit/s, au-delà des 3 Mo visés ; voir `docs/AVANCEMENT.md`, étape 3.

## 7. Espace parent

- **Point de départ** (« Données et réglages ») : choisir le niveau actuel de la ligne graduée ; marquer une famille de faits comme connue (ses faits passent en boîte 3). Noté dans l'historique des niveaux comme un choix du parent. Construit à l'étape 2 pour les niveaux 1 à 8 et les familles 1 et 2, étendu aux familles 3 à 7 à l'étape 6 et aux niveaux 9 à 13 à l'étape 8.
- **Module imposé pour la prochaine séance** (ligne graduée ou additions ; valable une séance).
- **Défi record** : activé ou non.
- **Terminer une séance en pause (décision du parent du 27 septembre, après une relecture extérieure)** : l'enfant n'a pas de bouton d'arrêt ; pendant une pause (bouton « maison »), l'espace parent montre en haut « Terminer la séance » (avec confirmation). La séance est enregistrée comme interrompue (terminée : non, sans récompense ; les étoiles déjà gagnées restent ; champ `arreteeParParent`), la scène est rangée et l'application revient à l'accueil (une nouvelle séance est possible le même jour).
- **Son** : section 6.
- **Grille des additions** (SPEC, tableau de bord 3) : tableau 11 × 11, couleur selon la boîte et la rapidité pour les 45 faits ; les 21 cases « + 0 » montrent seulement le temps de base, en gris ; toucher une case montre l'historique du fait.
- **Progression** : le module 2 a sa ligne (famille en cours, familles acquises, courbes semaine par semaine) ; formes des réponses (directe, trou à droite, trou à gauche) dans le détail des séances et l'export CSV ; journal des erreurs avec E6 et E7 (à l'étape 8, avec ces erreurs).
- **Cartes** (étape 1) : nombre de cartes et de brillantes, cartes encore gagnables selon le quota, étoiles dorées (pour le parent seulement).

## 8. Recette à chaque étape

Chaque étape se termine par une recette, lancée par Claude Code et résumée dans la demande de fusion :

1. `node tests/sim-seances.mjs` pour les trois profils, à 2 et 5 séances par semaine, sur l'année (outil à compléter à chaque étape pour qu'il simule ce qui vient d'être construit : notion du jour du module 2, cartes et quota, etc.).
2. `node tests/e2e/recette.mjs --delai 4.5` (séance complète, voix réelle, enfant qui répond en 4,5 s) et `node tests/e2e/recette-durees.mjs` (avec et sans `--passer`).
3. Un tableau des critères ci-dessous, cochés ou non, avec la mesure.

| Critère | Seuil |
| --- | --- |
| Durée d'une séance complète (`recette.mjs --delai 4.5`) | 9 à 11 min ; 8 à 10 min tant que le défi record n'existe pas |
| Attente sans rien pouvoir faire, hors consigne orale | jamais plus de 3 s sans bouton « passer » ; environ 2 s pour l'aide des additions (décision du 27 septembre) |
| Faits nouveaux (profil « reel », 2 séances par semaine) | au moins 2 par séance tant qu'il en reste à introduire, autant que la boîte 1 le permet |
| Familles 1 et 2 (profil « sait ») | les 33 faits vus avant la 7e séance |
| Cartes (2 séances par semaine, zones 3 et 4 considérées prêtes) | 60 cartes, légendaires comprises, avant le 25 juin 2027 ; jamais plus de cartes nouvelles que le quota |
| Tirage des brillantes | 20 % des tirages pour une carte nouvelle, 5 % pour un doublon (graine fixe, 1 000 tirages, écart de moins de 3 points) |
| Alternance | jamais deux fois de suite le même module, sauf module imposé ou autre module sans rien à proposer |
| Erreurs dans la page | aucune |

La conversation de conception refait sa propre recette sur la version publiée avant de passer à l'étape suivante.
