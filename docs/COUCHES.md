# L'inventaire des couches

Lot « Recette de l'enfant et nettoyage des couches » (`docs/LOTS.md`, fiche 9 ; 11 et 12 octobre 2026). Le parent, le
10 octobre : « le jeu est devenu un oignon, c'est-à-dire un empilement de couches dont les anciennes sont encore présentes
sous la surface, et peuvent créer des bugs ». Ce document fait l'inventaire de ces couches avant de modifier le code :

1. pour chaque écran et chaque étape, ce qu'il pose, ce qu'il lance, et chaque façon d'en sortir (avec ce qui range,
   **avant** ce lot, et ce qui range **après** : la règle de sortie unique, point 2) ;
2. ce qui ne sert plus (code jamais exécuté, fichiers jamais chargés, images jamais dessinées, règles CSS sans cible,
   clés de contenu jamais lues, anciens modes) : retiré, ou gardé avec sa raison.

Les mots : un **élément** est un nœud HTML posé dans la scène (`#ui`, `#stage`, `document.body`) ; un **acteur** est un petit
canvas du premier plan ou des visiteurs (`engine/actor.js`), tenu par `ocean.actors` ; un **rappel d'image** est une
fonction appelée à chaque image (`stage.ticks`, `ocean.front`) ; une **planche** est une image de sprites chargée
(`sprites.load`) ; une **minuterie** est un `setTimeout`, un `setInterval` ou une attente de l'horloge des activités
(`clock.wait`, qui ne se réveille jamais une fois l'activité abandonnée) ; un **écouteur** est posé sur la fenêtre ou le
document (ceux posés sur un élément partent avec lui).

## 1. Ce qui est posé une fois pour toutes (au démarrage)

Ni retiré ni remplacé de toute la vie de la page ; ce n'est pas une couche, mais le socle.

| Quoi | Où | Ce qu'il lance |
| --- | --- | --- |
| La scène (`#stage`, `#ui`), le fond `#bg`, la bande `#line` et `#fx` | `engine/stage.js`, `engine/line.js` | la boucle d'images (`stage.start`), un Worker (la ligne graduée) ; écouteur `resize` |
| Le lagon (`#lagon` : miroitement WebGL, poissons et algues en acteurs, faisceaux) | `engine/lagon.js` | rappel d'image ; `pause(true)` sous les voiliers et l'étal |
| La mascotte (`#mascotte`, 17 vidéos), la bulle (`.bulle`), la flèche | `engine/mascotte.js`, `bulle.js`, `fleche.js` | sa propre boucle ; la bulle vérifie 4 fois par seconde qu'elle ne couvre rien |
| Le bouton « réécouter » (`.speaker`), la zone de la tête (`.mascotte-tap`), la maison (`.session-home`), le compteur d'étoiles (`.stars`), la frise | `main.js`, `session/screens.js` (`StarHud`), `session/frieze.js` | un rappel d'image (tête ou « réécouter ») |
| La voix, le son et la musique | `engine/voice.js`, `engine/son.js` | écouteur `pointerdown` du document (débloque le son, petit bruit des boutons) |
| Le journal des incidents | `main.js` | écouteurs `error` et `unhandledrejection` de la fenêtre |
| La mise à jour | `engine/miseajour.js` | le service worker |
| L'écran de démarrage | `session/demarrage.js` | sa boucle (bulles, étincelles, faisceaux) ; retiré par `fermer()` après le toucher, avec ses images et sa planche |
| Les écrans des exercices, créés une fois puis réutilisés : la ligne (`app.screen`, `ReadScreen`), les additions (`app.facts`, `FactsScreen` : ardoise, pavé de 12 touches, « je ne sais pas », coquillage), les voiliers (`app.voiliers`), l'étal (`app.etal`), le calcul rapide et la multiplication (`app.calc`, `app.mult`, qui prennent l'écran des additions), la dictée | `main.js`, `modules/*/screen.js` | voir 2.4 : **c'est la couche principale de l'oignon** |

## 2. Les écrans et les étapes

Pour chacun : ce qu'il **pose**, ce qu'il **lance**, ses **sorties** et ce qui les **range**. « Abandon » : `abandonActivity`
(`main.js`), appelé quand l'activité est quittée pour de bon (la maison hors séance, « Terminer la séance » du parent, un
autre exercice choisi depuis la pause, une leçon quittée).

### 2.1 L'accueil (`main.js`, `showHome`)

- **Pose** : cinq galets (ou quatre et la lune, séance faite), le bouton de l'espace parent ; la lune (`goodNight`).
- **Lance** : la bienvenue au lancement, « À demain ! » après la séance ; la sélection en deux touchers (`session/selection.js` :
  un écouteur `pointerdown` du document, retiré dès qu'un galet est lancé ou que les galets ne sont plus là ; une minuterie de
  0,45 s par sélection).
- **Sorties** : un galet lancé (`clearHome`), l'espace parent (l'accueil reste dessous), un rechargement.
- **Défaut trouvé** (point 0.6) : après la séance, l'accueil attendait la fin de « À demain ! » avant d'accepter les
  touchers ; les galets, déjà là, ne répondaient pas. Corrigé (`goodNight` n'attend plus la phrase).

### 2.2 Choisir, les niveaux (`session/choice.js`), les leçons et les tables (`session/lessons.js`)

- **Pose** : les tuiles, la légende, les étoiles des niveaux ; la planche « choix » (ou « lecons »).
- **Lance** : le nom et la description de chaque tuile (bulle partie de la tuile), la sélection en deux touchers.
- **Sorties** : une tuile lancée (`clear`), la maison (`app.choiceCancel`, `app.lessonsCancel`, `app.tableCancel` ; depuis la
  pause : `pause-choix`, `pause-lecons`, `pause-table`), l'abandon (`app.choiceClear`).
- **Rangé** : par leurs fonctions `clear`, chacune avec ses `…Cancel` ; la planche est libérée.

### 2.3 Une séance (`session/session.js`, `Session.run`) et ses étapes (`main.js`, `handlers`)

| Étape | Pose | Lance | Rangé à la fin normale | Rangé à l'abandon (avant ce lot) |
| --- | --- | --- | --- | --- |
| Accueil de la séance | la musique ; la surprise (visiteurs en acteurs, `session/surprise.js`) ; le sélecteur (`session/selector.js` : 4 crans) | bienvenue ; minuterie de 15 s du sélecteur | le sélecteur se retire (`fermer`) | rien de propre : les visiteurs finissent leur nage |
| Échauffement | l'écran des additions ; le bouton « passer l'échauffement » et sa coche | intro, consignes ; la minuterie de 5 s de la coche | **portée** (lot 8) : bouton, coche, minuterie, écran rangé | **portée** fermée par `fermerTout` |
| Notion du jour, la ligne | `app.screen` (bulles-réponses, bande, poisson, étoile, tortue : 3 acteurs et 2 rappels d'image) ; la ligne dans `#line` ; les leçons L1 à L3, L10 | consignes, retours, leçons | `screen.leave()` | `app.screen.leave()`, `lessons.abandon()`, `line.clear()` (au cas par cas) |
| Notion du jour, les additions | l'écran des additions, le bernard-l'ermite (acteurs) et sa planche, le calque des aides, les leçons L4 à L6 | idem | `finally` : ermite, planche, écran | idem, au cas par cas dans `abandonActivity` |
| Notion du jour, le calcul rapide | l'écran des additions, le mur et le poisson (planche « calcul ») | idem | `app.calc.leave()`, planche | `app.calc.leave()` |
| Notion du jour, les voiliers | trois canvas (mer WebGL, bateaux, effets), « je ne sais pas » ; lagon en pause | sa boucle d'images ; écouteurs de la fenêtre (`pointermove`, `pointerup`, `resize`) | `leave()` | `app.voiliers.leave()` |
| Notion du jour, la multiplication | l'écran des additions, les rangées de poissons (calque des aides) | idem | `app.mult.leave()` | `app.mult.leave()` |
| Notion du jour, l'étal | le décor (canvas), la scène (`#etal-scene`), la plaque, les boutons, la lampe (point 0.5), le pavé du niveau 7 ; la mascotte dans la fenêtre ; lagon en pause | sa boucle ; écouteur `keydown` (pavé) | `leave()` | `app.etal.leave()` |
| Défi record | la bulle-sablier et les perles (`challengeView.js`), la planche « defi » | sa minuterie d'une minute | `finally` | au cas par cas |
| Récompense | le bilan, les étoiles qui volent, coquillages, cartes, arrivages, bouton de fin (`session/screens.js`, `reward`) | phrases, animations | ses éléments retirés à la fin | — (pas de maison pendant la récompense) |

**Défaut trouvé** (contrôle des fuites de l'enfant imprévisible, point 3) : l'écran de la ligne et celui des additions, créés une
fois, ne sont que **cachés** en sortant. Après la ligne et les additions, l'accueil garde 30 éléments de plus (bande,
poisson, deux « je ne sais pas », ardoise, 12 touches, coquillage) et 4 acteurs du premier plan, cachés ; l'écran des additions
garde aussi son écouteur `keydown` de la fenêtre. Ils n'apparaissent plus (`visibility`), mais ce sont exactement les couches
« encore présentes sous la surface » : un code qui les rendrait visibles par erreur les ferait réapparaître. Le calcul rapide
libre charge la planche « calcul » sans la libérer.

### 2.4 La pause (`main.js`, `pauseSession`, `showPauseHome`, `visitInPause`, `sandbox`)

- **Pose** : l'accueil en pause (continuer, choisir, leçons, récif, album, bouton du parent), tous `keep`.
- **Lance** : l'horloge, la voix et la musique de la séance en pause ; la mascotte « attend ».
- **Sorties** : continuer (`resumeSession`), une visite (le **bac à sable** `sandbox` : tout ce que la visite ajoute est retiré
  au retour, éléments, acteurs, rappels d'image et planches ; c'était déjà une portée, écrite à part), un autre exercice
  (`startChosen` : la séance est terminée, abandon), « Terminer la séance » du parent (`endPausedSession`).

### 2.5 L'entraînement libre (`session/free.js`)

- **Pose** : le sélecteur (sans étoiles), puis l'écran de l'exercice choisi (le même que dans la séance).
- **Lance** : le déroulement sans fin ; « tu as bien travaillé » au bout de 10 minutes.
- **Sortie** : la maison (`quitFree` : abandon). Rangé par `abandonActivity`, au cas par cas.

### 2.6 Le récif (`session/reef.js`), l'album (`album.js`), la boutique (`boutique.js`)

- **Pose** : le récif vivant (deux canvas, son script), ses boutons (album, boutique, maison) ; l'album (pages, onglets,
  cartes) ; la vitrine (15 tuiles, onglets, coche et croix, étoiles qui volent).
- **Lance** : la boucle du récif (la mascotte cachée) ; un écouteur `pointerdown` du document (la boutique : toucher ailleurs
  désélectionne) ; les animations de l'achat (WAAPI, minuteries).
- **Sorties** : la maison ou le retour (`leave` de chacun : éléments, écouteurs, images, planches ; la boutique annule ses
  animations et remet le compteur au trésor), et, depuis la pause, le bac à sable en plus.

### 2.7 Les leçons seules (`main.js`, `lessonAlone`), « À toi ! » (`lessons.js`, `lessonEnd`)

- **Pose** : le lecteur de la leçon (`lessons/player.js`, `player2.js`, `etal.js`) : « rejouer », « passer », la ligne, les
  acteurs de la leçon ; « À toi ! ».
- **Sorties** : la fin, « passer », la maison (`app.lessonCancel` : le lecteur abandonné, l'horloge et la voix aussi).

### 2.8 L'espace parent (`parent/parent.js`)

- **Pose** : `.pa`, dans `document.body`, par-dessus tout ; la scène en pause (`stage.paused`).
- **Lance** : son clavier (écouteur `keydown` de la fenêtre, retiré à la fermeture), ses minuteries (verrouillage du code).
- **Sortie** : « Fermer » ou « Retour à l'océan » (`close`), un rechargement après une restauration.

### 2.9 Les sorties qui ne passent par aucun code

- **L'écran mis en veille** : la page est gelée (minuteries, images), puis reprend. Rien n'est rangé ni relancé ; les durées
  mesurées (temps de réponse, inactivité de la mascotte) comptent le temps de veille. L'enfant imprévisible en essaie (point 3).
- **Le rechargement** : tout repart de zéro, à l'accueil ; un achat en vol n'est jamais fait à moitié (lot de la boutique). Depuis le lot « Décisions sur les constats de l'agent » (décision 1), une séance du jour en cours est **reprise** : l'accueil en pause avec « continuer », puis la séance au début de son étape (`session/session.js`, `repriseDuJour` ; `main.js`, `preparerReprise`). Rien de l'écran d'avant n'est restauré : l'étape repart de sa portée neuve. Une séance d'hier, ou d'une version d'avant, reste « terminée : non ».
  (elle n'est pas reprise ; « jouer » en commence une nouvelle, sans l'échauffement s'il a déjà été fait ce jour-là) ; un achat
  en vol n'est jamais fait à moitié (lot de la boutique).

## 3. Ce qui ne sert plus

**La mesure.** Chaque parcours de `tests/e2e/` (40 parcours, 398 pages), l'enfant imprévisible (8 graines de 150 actions, dont une interrompue), les
tests unitaires et les simulations (`tests/sim-seances.mjs`, `b-sequences.mjs --test`) ont tourné avec le relevé de
couverture (`COUVERTURE=dossier`, `NODE_V8_COVERAGE`), sur une copie figée de la branche ; `tools/couverture.mjs` réunit les
relevés et écrit le bilan : pour chaque fichier de `app/js/`, la part exécutée et chaque morceau jamais exécuté de plus de 80
caractères ; les fichiers de `app/` jamais demandés ; les images des planches jamais dessinées ; les règles CSS sans cible.
Pour le relancer :

```
COUVERTURE=couv/e2e node tests/e2e/<parcours>.mjs      (pour chaque parcours)
NODE_V8_COVERAGE=couv/node node --test tests/unit/*.test.mjs
node tools/couverture.mjs couv/e2e couv/node --sortie bilan.md
```

Résultat : presque tout le code de l'application est exécuté (la plupart des fichiers à plus de 95 % ; le moins couvert,
`session/free.js`, à 74 %, parce que le relevé ne suit pas tous les exercices en entraînement libre). Un morceau jamais
exécuté n'est pas forcément mort : chacun a été jugé, ci-dessous.

### 3.1 Retiré

| Quoi | Où | Pourquoi |
| --- | --- | --- |
| Les clés de contenu jamais lues : `dejaJoue`, `libreLigne`, `libreFaits`, `libreLecons`, `etalOuvre` (7 phrases) ; `etoiles.bonneReponse`, `etoiles.erreurCorrigee` ; `procheExtremite` ; les légendes `tableAddition`, `tableMultiplication` | `app/content/textes.json`, `seance.json`, `module1.json`, `legendes.json` | l'ancien accueil de fin de séance, l'ancien entraînement libre, l'ancien message de l'étal ; les étoiles par réponse sont écrites dans chaque déroulement ; plus d'étiquette sur les écrans en deux touchers depuis le lot « Correctifs : passage de l'échauffement aux voiliers » |
| La phrase « … » seule, et les répliques des leçons L15 à L17 qui en commençaient | `app/content/lecons.json` | point 0.2 : une phrase sans lettre ni chiffre n'est ni dite ni fabriquée |
| L'ancien petit filet dessiné sous la corde | `lessons/player.js` (`net`) | seule L2 joue des filets, sur la corde aux bouées géantes (le grand filet de l'atelier) ; L10 a sa propre scène |
| Cinq images : `encore`, `libre.ligne`, `libre.lecons`, `poisson.1.g`, `poisson.2.g` | planches « petits » et « poissons » (`art/src/canvas-core/sea/catalog.ts`, exportées de nouveau) | l'ancien accueil et l'ancien entraînement libre ; les poissons tournés à gauche ne servaient qu'au petit filet. Les planches perdent 316 Ko |
| `StarHud.spend` | `session/screens.js` | l'ancien vol des étoiles dépensées ; la boutique a le sien (`boutique.js`, `volEtoiles`) |
| `houseHeight` | `modules/facts/aids.js` | jamais appelée |
| `clock.gate()` | `engine/clock.js` | jamais appelée (`clock.hold()` la remplace) |
| `sprites.sheetOf()` | `engine/sprites.js` | jamais appelée |
| Les paramètres `ring` et `still` de la bulle-réponse, et la règle `.answer.still` | `modules/numberline/screen.js`, `css/app.css` | jamais passés ; l'anneau doré est peint à la correction |
| Les règles CSS `.gift`, `.gift.away` (les cadeaux de la surprise), `.creature` (les créatures dessinées du récif d'avant le récif vivant) | `css/app.css` | aucun élément ne porte ces classes |
| Les restes de la pieuvre dans les commentaires (le calque `#octo`, ses planches, « à droite de la pieuvre ») | `engine/stage.js`, `store.js`, `sprites.js`, `facts/aids.js`, `session/surprise.js`, `session/selector.js` | la pieuvre n'existe plus depuis le lot « Mascotte » |

Poids de `app/` : 141,86 Mo sur `main`, 141,56 Mo ici (sans la voix : 60,52 → 60,23 Mo). Les planches perdent 316 Ko ; le code
gagne 18 Ko (la règle de sortie unique, les écrans détruits, les crochets de l'enfant imprévisible).

### 3.2 Gardé, avec sa raison

- **Les cas rares** (jamais vus par les parcours, mais atteignables) : les erreurs E5 et suivantes de la ligne graduée, le
  rappel du double, la correction passée de la dictée et des additions, le niveau 9 de l'étal (les centimes), les reprises
  du lecteur des leçons, les réglages et les cas d'erreur de l'espace parent (code faux, trop d'essais, restauration
  impossible, partage de fichier, incidents, phrases sans voix, points de départ du calcul rapide et de l'étal), le journal
  des erreurs de la page.
- **`js/art/line-worker.js`** : « jamais chargé » d'après le relevé des pages, parce qu'il tourne dans un Worker ; c'est lui
  qui dessine la ligne graduée.
- **`engine/mascotte.js`, `make2D`** : la mascotte sans WebGL (une tablette qui le refuse) ; `statut` : l'affichage de mise au
  point de la maquette.
- **Les images jamais dessinées pendant les parcours** : `bulle.4` à `bulle.12` (les bulles des sauts, tirées par taille),
  `reecouter` (le bouton du récif), `carte.dos`, `carte.verso.legendaire` (une carte sans illustration, une légendaire),
  `lecons.atoi.*` (l'écran « À toi ! » de chaque leçon : les parcours n'en jouent que quelques-unes), `demarrage.barre.*`
  (dessinées sans passer par le relevé).
- **Les fichiers jamais demandés** : 11 180 phrases (seules les phrases dites sont demandées), 15 illustrations de cartes,
  les icônes de l'application (lues par le système, pas par la page), `index.html` (servi sous `/`),
  `assets/boutons/parents-forme.json` (la taille du bouton, que `tests/unit/logo.test.mjs` compare à la CSS).
- **Les règles CSS sans cible pendant les parcours** : des états (`.pa-day.faible`, `.pa-grid td.sel`, `.pa-btn:disabled`,
  `.pa-confirm`…), l'animation à mouvement réduit, la police de la bulle (`@font-face`, que le relevé ne sait pas compter).

### 3.3 Les anciens modes

La validation simple en un toucher (remplacée le 8 octobre par le choix en deux touchers), le mode « double » avec une coche,
la pieuvre et ses planches, les anciens fonds (rayons, reflets, algues et poissons dessinés), les créatures dessinées en code
du récif : plus rien dans le code de l'application. Seuls des commentaires historiques les citent, pour dire ce qui les a
remplacés.

### 3.4 Les petites pieuvres encore visibles (listées, pas retirées)

Leur remplacement attend une décision du parent (`docs/LOTS.md`, fiche 9) :

- **« Je ne sais pas »** (image `nsp`, planche « petits ») : la pieuvre orange qui hausse les bras, sur le bouton de toutes les
  questions (ligne graduée, additions, calcul rapide, multiplication, étal).
- **La frise, l'étape « accueil »** (image `frise.accueil`) : la petite tête de pieuvre qui dit bonjour.

### 3.5 Ce que le second passage de l'agent a trouvé dans les couches

La correction de la multiplication restait à l'écran sur l'accueil après la maison, sous les galets (constat 3). Ce
n'était pas un oubli de rangement : chaque effacement avait lieu, dans l'ordre, mais la toile accélérée du calque des aides
gardait à l'écran une image périmée (rejeux du parcours de l'agent : au moins 7 sur 22 avec l'accélération du dessin 2D,
0 sur 6 sans). Le calque est désormais dessiné par le processeur (`willReadFrequently`), et les attentes de la multiplication sont
rompues à la sortie ; 0 sur 8 ensuite. C'est la même famille que la barre noire (point 0.1) : une toile qui montre autre chose
que ce qu'elle contient.

### 3.6 Ce que l'enfant imprévisible a trouvé dans les couches

Six défauts, chacun réduit à un parcours de non-régression qui échoue sur le code d'avant la correction :

| Graine | Le défaut | La cause | Le parcours |
| --- | --- | --- | --- |
| 1 | Une leçon de l'étal quittée par la maison pendant que sa scène s'installe : la scène restait sur l'accueil, et la leçon parlait | La scène n'appartenait à la leçon qu'une fois installée (`lessons/etal.js`) | `tests/e2e/lecon-etal-quittee.mjs` |
| 1001 | Une partie bloquée à l'étal | `api.ouvrir` ne rouvrait pas un portefeuille qui finissait de se fermer : une pièce posée à ce moment (la correction, une leçon) attendait pour toujours (`art/tools/export-etal.mjs`) | `tests/e2e/etal-portefeuille.mjs` |
| 1009 | « 7 plus 6 ? » dit sur l'accueil | L'écran détruit pendant une aide d'emblée l'interrompait, et la suite de l'aide redisait la consigne (`modules/facts/screen.js`) | `tests/e2e/aide-quittee.mjs` |
| 1023 | L'écran « choisir » construit par-dessus l'accueil | Quitté pendant le chargement de sa planche, il se construisait ensuite quand même : sa portée naissait après le chargement (`session/choice.js`) | `tests/e2e/choisir-quitte.mjs` |
| 1062 | Une erreur de la page en passant la correction de la ligne (existait sur `main`) | La même image de la ligne était redonnée au calque, déjà « détachée » (`engine/line.js`) | `tests/e2e/passer-correction.mjs` |
| 1063 | La seconde phrase de l'échauffement dite sur l'exercice suivant | À l'abandon, les portées étaient fermées avant la voix : le `voice.stop()` d'un rangement terminait la phrase en cours comme dite, et la suite de l'étape quittée parlait (`main.js`, `abandonActivity`) | `tests/e2e/echauffement-quitte.mjs` |
