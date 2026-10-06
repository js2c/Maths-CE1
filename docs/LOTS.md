# Les lots à lancer, dans l'ordre

Préparé en conception le 6 octobre 2026 (décision du parent : intégrer la mascotte et le jeu des voiliers dans l'application, puis enchaîner les lots suivants, chacun lancé à son tour dans Claude Code, avec sa recette faite par la session elle-même).

Ce document a trois parties : **pour le parent**, comment lancer un lot ; **pour la session**, la méthode commune à tous les lots ; puis **la fiche de chaque lot**. Le prompt de la session de contrôle (confrontation de la spécification avec le code) est dans `docs/PROMPTS.md`. La fabrication des voix se fait à part, sur l'ordinateur du parent (`docs/VOIX.md`).

## Pour le parent : lancer un lot

1. Vérifier dans le tableau ci-dessous que les lots précédents sont marqués « fait ». C'est le cas dès que leur demande de fusion a été fusionnée.
2. Ouvrir une nouvelle session Claude Code sur le dépôt, réflexion « élevé », et coller (en changeant le nom du lot) :
   ```
   Lis CLAUDE.md puis docs/LOTS.md, et réalise le lot « Mascotte » en suivant sa fiche et la méthode commune.
   ```
3. La session s'arrête d'elle-même dans trois cas, et le dit :
   - **une maquette à valider** (lots « Les leçons », « Sommes jusqu'à 30 », « Multiplication ») : regarder les captures et la maquette indiquées dans la demande de fusion, puis répondre **dans la même session** (« validé », ou les corrections). Elle reprend et code ;
   - **une règle qui pose problème en simulation** : elle décrit le problème ; répondre dans la même session ;
   - **le lot est fini** : la demande de fusion liste les phrases dont la voix est à fabriquer. La fusionner quand la coche en bas est verte (les tests sont relancés par GitHub à chaque poussée ; les phrases sans voix y sont seulement signalées). Les voix se fabriquent ensuite, **quand vous voulez, pour plusieurs lots d'un coup**, avec une seule commande sur votre ordinateur : `node tools\voix\publier.mjs` (`docs/VOIX.md`, « En une commande »). Tant qu'elles manquent, GitHub ne publie rien : la tablette garde la version précédente (décision du parent du 6 octobre 2026).
4. Si la session s'est arrêtée en cours de route (contexte plein, coupure), en ouvrir une nouvelle avec :
   ```
   Lis CLAUDE.md puis docs/LOTS.md, et reprends le lot « Mascotte » là où il s'est arrêté (docs/AVANCEMENT.md, rubrique « Reprise »).
   ```
5. Un seul lot à la fois : ils modifient les mêmes fichiers. La session de confrontation (`docs/PROMPTS.md`), qui ne touche pas à l'application, peut tourner en même temps qu'un lot ; elle doit être faite, et ses écarts tranchés, avant le lot « Sommes jusqu'à 30 ».

## L'ordre

| Ordre | Lot (son nom dans le prompt) | Ce qui est prêt | Maquette à valider en début de lot | Voix à fabriquer (estimation) | État |
| --- | --- | --- | --- | --- | --- |
| 1 | « Mascotte » | tout : maquette validée (`art/mascotte/`), spécification (`docs/SPEC.md`, section 11) | non | une dizaine de phrases, quelques minutes | à faire |
| 2 | « Les voiliers » | tout : maquette validée (`art/voiliers/`), spécification (section 7 bis) | non (une capture de contrôle du placement de la mascotte) | environ 800 phrases, environ 1 h | à faire |
| 3 | « Les leçons » (avec la table d'addition) | la spécification (section 3, « Les leçons ») ; les écrans sont à maquetter | oui | environ 150 phrases (la table d'addition), environ 10 min | à faire |
| 4 | « Sommes jusqu'à 30 » | le principe (section 13) et une proposition par défaut ; le contenu est à concevoir | oui, avec la proposition pédagogique | à estimer au point d'arrêt | à faire |
| 5 | « Multiplication » (et les tables) | le principe (`docs/IDEES.md`, phase 2) ; tout est à concevoir | oui, avec la proposition pédagogique | à estimer au point d'arrêt | à faire |

Les lots portent un nom, pas un numéro : les numéros 1 à 3 ter désignent déjà les lots passés.

**Avant le lot « Sommes jusqu'à 30 »** (décision du parent du 6 octobre 2026) : la session de confrontation de la spécification avec le code (`docs/PROMPTS.md`), puis la décision du parent sur ses écarts. Elle peut tourner pendant l'un des lots précédents.

**Pourquoi cet ordre.**

- La mascotte d'abord : le jeu des voiliers se branche sur celle de l'application.
- Les leçons avant les sommes et la multiplication : les leçons nouvelles de ces deux lots arrivent dans le menu refait, suivies de leur exercice. La table de multiplication à consulter rejoint celle d'addition.
- Les sommes avant la multiplication : la multiplication s'introduit comme une addition répétée.

**Pas encore dans la liste** (`docs/IDEES.md`, section 1) :

- les fractions : plus tard (décision du parent du 6 octobre 2026), bien que le programme les attende au plus tard en période 2, c'est-à-dire avant les vacances de Noël ;
- les problèmes de la vie courante, la pêche, suites et rangs ;
- les bilans périodiques.

Chacun deviendra un lot de ce tableau quand le parent le décidera.

## Pour la session : la méthode commune

### Avant de commencer

- Lire `CLAUDE.md`, la fiche du lot, les sections de `docs/SPEC.md` qu'elle cite, plus les sections 9 (règles communes) et 14 (recette), puis `docs/ARCHITECTURE.md` et `docs/AVANCEMENT.md`. Les anciennes spécifications (`docs/archives/`) ne servent qu'à retrouver l'origine d'une règle : en cas d'écart, `docs/SPEC.md` fait foi.
- **Prérequis** : sur `origin/main`, les lots qui précèdent dans le tableau sont marqués « fait ». Sinon, s'arrêter et le dire au parent : le lot précédent n'est pas fusionné.
- Partir de `origin/main` à jour. Pousser la branche dès le début. Ouvrir tout de suite une demande de fusion en brouillon, intitulée « Lot : <nom du lot> ». Tenir une rubrique « Reprise du lot … » dans `docs/AVANCEMENT.md`. Pousser les commits après chaque étape, au moins toutes les 30 à 45 minutes. Un commit par étape, message en français.
- S'arrêter proprement si le contexte dépasse environ la moitié : tout pousser, noter où reprendre, et le dire.

### Le point d'arrêt « maquette » (lots qui en ont un)

Avant toute modification de `app/` :

1. Fabriquer la maquette du rendu final dans `art/<lot>/` : une page autonome qu'on ouvre comme `art/voiliers/`, avec la mascotte de l'application.
2. Y joindre :
   - les captures des écrans clés en 1280 × 800 dans `docs/maquettes/<lot>/` ;
   - le texte exact de chaque phrase dite.
3. Pour un lot pédagogique (« Sommes jusqu'à 30 », « Multiplication »), y joindre aussi une note dans `docs/maquettes/<lot>/PROPOSITION.md` :
   - le programme officiel de CE1 sur le sujet, cité avec sa source (texte officiel, pas une reformulation) ;
   - la proposition : niveaux ou familles, règles, ordre, leçons, aides, codes d'erreur ;
   - une simulation de l'année pour chaque profil (`tests/sim-seances.mjs`, étendu au lot) et des séquences lues ;
   - le nombre de phrases nouvelles et leur poids estimé ;
   - les questions ouvertes, chacune avec une valeur par défaut.
4. Mettre le tout en tête de la demande de fusion, avec la mention « en attente de la validation du parent ». S'arrêter.

Ne reprendre qu'après la réponse du parent. Ses décisions vont dans `docs/JOURNAL-CONCEPTION.md`, les règles qui en découlent dans `docs/SPEC.md`.

### Pendant le lot

- Toute règle pédagogique nouvelle est d'abord simulée (`tests/sim-seances.mjs`), et ses séquences sont lues (`tests/recette-fonctionnelle/b-sequences.mjs`). Si elles montrent un défaut, s'arrêter et le décrire au parent.
- Tout ce qui se règle va dans `app/content/`. Chaque règle nouvelle a ses tests unitaires.
- Après chaque étape : lancer les tests, faire les captures, les regarder, et corriger ce qui est laid ou illisible avant de continuer (`CLAUDE.md`, « Méthode de travail »).
- **Voix** : ne fabriquer aucun son (`CLAUDE.md`, « Voix »). Quand les tests échouent sur des phrases sans fichier, continuer le reste : c'est attendu, y compris au départ du lot si les voix des lots précédents ne sont pas encore faites (le parent les fabrique en une fois, `tools/voix/publier.mjs`). Ne jamais modifier le test de la voix, ni `app/assets/voix/`, pour faire passer les tests. À la fin, donner dans la demande de fusion la liste exacte des phrases nouvelles du lot, leur nombre et leur poids estimé. Sur GitHub, ces phrases ne sont que signalées (`VOIX_A_FABRIQUER=tolere`) ; une croix rouge y signale donc un autre échec, à corriger.
- **Sauvegardes** : migrations non destructives seulement. Une sauvegarde faite avec la version en ligne doit se restaurer.

### La recette, faite par la session avant de rendre la main

1. **Technique**
   - Lancer `npm test`. Seul échec admis : les phrases sans fichier, listées.
   - Lancer `node tools/precache.mjs --check`.
   - Lancer tous les parcours `tests/e2e/*.mjs`. Ceux qui échouent sont relancés sur `main` : un échec qui existe déjà sur `main` est signalé comme tel, un échec propre à la branche est corrigé.
   - Mesurer le temps d'image avec `tests/e2e/perf.mjs`, avant et après le lot.
2. **Fonctionnelle** (`docs/SPEC.md`, section 14) :
   - lancer la simulation par profil ;
   - lancer `tests/recette-fonctionnelle/b-sequences.mjs --test`, étendu aux exercices nouveaux ;
   - jouer une séance à vitesse réelle (`tests/e2e/recette.mjs --delai 4.5`) ;
   - mesurer les attentes (`tests/e2e/recette-durees.mjs`, avec et sans `--passer`).
3. **Parcours du lot** : un parcours nouveau, `tests/e2e/<lot>.mjs`, qui passe par chaque situation nouvelle et en fait les captures en 1280 × 800 et 1920 × 1200.
4. **Relecture indépendante**
   - Lancer un agent relecteur qui n'a pas vu le travail. Lui donner seulement :
     - la section « Les deux personnes à incarner » de `docs/archives/PROMPT-RECETTE-LOT3.md` ;
     - les captures et les séquences du lot ;
     - après son premier jugement, les sections de `docs/SPEC.md` citées par la fiche.
   - Il juge ce que l'enfant voit et entend, puis ce que le parent comprend. Il rend des constats numérotés, avec leur gravité : bloquant, gênant ou cosmétique.
   - Corriger les constats bloquants et gênants, ou expliquer pourquoi ils restent, puis relancer les parcours concernés.
   - Le rapport va dans `tests/recette-fonctionnelle/out-<lot>/RELECTURE.md`.
5. **Demande de fusion**
   - La compléter avec :
     - ce qui change pour l'enfant et pour le parent ;
     - le tableau de recette, avec les mesures ;
     - les constats de la relecture et leur traitement ;
     - les phrases à fabriquer (liste exacte, nombre, poids) ;
     - ce qui reste à vérifier sur la tablette ;
     - les questions restées ouvertes.
   - Dans ce tableau, passer le lot à « fait ».
   - Mettre à jour `docs/SPEC.md` (retirer « à construire » de ce qui est fait), `docs/ARCHITECTURE.md`, `docs/GUIDE-PARENT.md` et, si besoin, `CLAUDE.md`.
   - Déplacer la rubrique « Reprise » de `docs/AVANCEMENT.md` dans l'archive.
   - Sortir la demande de fusion du mode brouillon, puis s'arrêter en disant au parent ce qu'il lui reste à faire.

**Ce que la recette ne remplace pas**, et qui reste au parent :

- la fabrication et l'écoute des voix ;
- l'essai sur la tablette : fluidité, toucher, mémoire ;
- la réaction de l'enfant.

## Les fiches

### 1. Lot « Mascotte »

**But** : la mascotte (le capitaine, en vidéo) remplace la pieuvre partout, à sa place sur chaque écran. Elle a la bulle le temps de parler, une flèche à la place du tentacule, pas de nom, et une phrase de bienvenue à l'accueil. Spécification : `docs/SPEC.md`, section 11, « La mascotte », et les mentions « à construire » des sections 2, 3, 8 et 12 qui la concernent. Le jeu des voiliers est le lot suivant : ne pas y toucher.

**Déjà fait et validé**, à reprendre sans le réinventer (`art/mascotte/`) :

- `index.html`, la maquette du comportement ;
- `mascotte-moteur.js`, le moteur ;
- `v/`, les 17 clips ;
- `README.md`, les mesures et les règles.

Le moteur entre tel quel dans `app/js/engine/` : même table de clips, mêmes règles, mêmes délais. Il imite l'interface de la pieuvre (`play`, `hold`, `release`) pour que les exercices ne changent pas. Seuls ses raccords sont nouveaux : voix, toucher, pause, bulle, mode accéléré des tests. Les clips vont dans `app/assets/mascotte/` en WebM (le Chromium des tests ne lit pas le H.264).

**Points d'attention**

- **Placement** : là où était la pieuvre, écran par écran.
  - Faire les captures avant et après de chaque écran et de chaque type d'exercice (`tests/e2e/lagon.mjs` les produit toutes), et les regarder.
  - La bulle ne couvre jamais ce que l'enfant touche pour répondre.
  - Ce que la mascotte cacherait pendant un exemple, une correction ou une leçon est déplacé, pas elle.
- **La pieuvre disparaît entièrement** :
  - `engine/octopus.js`, ses planches (pieuvre, pieuvre-gestes) et leur fabrication dans l'atelier ;
  - le choix du nom au premier lancement, et le réglage de l'espace parent ;
  - `{mascotte}` et la liste des noms dans le contenu ;
  - la liste du service worker ;
  - les parcours qui la visent.

  Le nom déjà enregistré reste dans la base, sans être montré.
- **La flèche** est dessinée dans l'atelier, en style A, et contrôlée sur agrandissement.
- **Voix** : salutations de l'accueil sans nom, avec « bienvenue » ; phrase de relance ; suppression des phrases du nom.
- **Fluidité** : la mascotte ajoute un contexte WebGL. Mesurer le temps d'image sur les écrans les plus chargés. L'allègement automatique doit continuer de fonctionner.
- **Recette en plus de la méthode commune** :
  - une séance simulée où l'on relève le journal des raccords de la mascotte (combien de fondus forcés) ;
  - une capture de chaque réaction : salut, joie, grande joie, déception, encouragement, relance, flèche.

**Documents** : remplacer, dans `docs/ARCHITECTURE.md`, « La pieuvre : des pièces et une frise » par la mascotte. Mettre à jour `docs/GUIDE-PARENT.md`, et `CLAUDE.md` (« Personnages », « Animation »).

### 2. Lot « Les voiliers »

**But** : le jeu de la maquette `art/voiliers/` devient le module 4 de l'application. Spécification : `docs/SPEC.md`, section 7 bis, et les mentions « à construire » des sections 3, 11, 12 et 13 qui le concernent. Lire aussi `art/voiliers/README.md` et `art/mascotte/README.md`.

**Méthode d'intégration**, celle du récif vivant (section 10, « Fabrication ») :

- un outil de l'atelier, `art/tools/export-voiliers.mjs`, extrait les images de la maquette dans `app/assets/voiliers/` et fabrique le module à partir du script de la maquette ;
- seuls les raccords avec l'application sont retouchés : séance, voix, mascotte, toucher, pause, enregistrement, frise, placement. Chaque retouche est contrôlée par l'export ;
- la maquette n'est jamais modifiée ;
- les branchements de la mascotte, déjà dans la maquette, sont gardés, sur la mascotte de l'application.

**Points d'attention**

- **Placement de la mascotte** (décision du parent du 6 octobre 2026, pour faire comme sur les autres écrans) :
  - la mascotte est en haut à gauche, sous la maison, et non en haut à droite comme dans la maquette ; sa bulle s'ouvre à sa droite ;
  - « réécouter », « passer » et « je ne sais pas » sont à leur place habituelle dans l'application ;
  - pour que la bulle ne cache jamais la voile et son nombre, le point d'attente du bateau (`WAIT`, au centre gauche dans la maquette) passe à droite du centre ; l'export le règle, et la pointe de la bulle est retournée ;
  - vérifier sur captures : arrivée du bateau, poussée du vent, poursuite des pirates, recul de la caméra au niveau 9 ;
  - si ce déplacement abîme le jeu, garder la mascotte à droite comme dans la maquette, mettre les deux captures dans la demande de fusion et le dire.
- **Les règles de l'application appliquées au jeu** : niveaux et adaptation, mer selon le cran, erreurs et corrections, « je ne sais pas », « passer », « réécouter », pause, durée de la partie, étoiles, exemple guidé. Les simuler d'abord.
- **Voix**
  - Rédiger les phrases comme la section 7 bis les donne, avec peu de gabarits à nombre. L'inventaire (`tools/voix/inventaire.mjs`) reçoit le domaine de chaque gabarit.
  - Les nombres en lettres de la bulle suivent l'écriture de l'application (traits d'union, `engine/phrases.js`), pas celle de la maquette.
- **Fluidité** : mesurer le coût de la mer en WebGL et de la mascotte réunies, et alléger avec les trois qualités de mer de la maquette.
- **Enregistrement et espace parent** : réponses, codes V1 à V4 et NSP, progression, point de départ, légende des 9 niveaux.
- **Recette en plus de la méthode commune** :
  - des parties à chaque cran ;
  - une capture de chaque situation : calme, vent, pirates, double encadrement, erreur, « je ne sais pas », exemple guidé, pause et reprise.

### 3. Lot « Les leçons » (avec la table d'addition)

**But** : `docs/SPEC.md`, section 3, « Les leçons », et section 8 (correction de la leçon L10).

- la bulle « les leçons » à l'accueil ;
- le menu des leçons refait : tuiles numérotées, rangées par exercice, chacune avec une vignette du moment clé de la leçon ;
- la leçon suivie de son exercice (« À toi ! ») ;
- la table d'addition à consulter ;
- dans L10, un filet qui montre 10 poissons.

**Maquette à valider** :

- le menu des leçons, avec ses vignettes ;
- l'écran de fin de leçon (« À toi ! » et la maison) ;
- la table d'addition : une grille où toucher une case dit et montre le calcul ;
- la leçon L10 corrigée.

Taille de la table proposée par défaut : de 0 + 0 à 10 + 10, à confirmer au point d'arrêt.

**Les tables dans le menu des leçons** (décision du parent du 6 octobre 2026) : la table d'addition et la table de multiplication y figurent toutes deux. Ce lot fait la table d'addition et prévoit, dans le menu, la place de la table de multiplication, que le lot « Multiplication » remplira.

**Voix** : une phrase par case de la table (« 7 plus 5, 12 »), « À toi ! », et les noms du menu s'ils changent.

**Recette en plus de la méthode commune** :

- les enchaînements : leçon regardée, puis « À toi ! », puis l'exercice ; leçon passée, puis « À toi ! » ;
- « À toi ! » en séance du jour et en entraînement libre ;
- la pause pendant la leçon et pendant l'exercice qui suit ;
- la table touchée vite et deux fois de suite.

### 4. Lot « Sommes jusqu'à 30 »

**But** : la suite du module 2 (`docs/SPEC.md`, section 13, « Sommes jusqu'à 30 » ; question ouverte dans `docs/IDEES.md`, section 3). **Jusqu'à 30** : décision du parent du 30 septembre, confirmée le 6 octobre 2026.

**Prérequis supplémentaire** : le rapport de confrontation (`docs/ECARTS-SPEC.md`) est sur `main`, et les écarts qui touchent le module 2 sont tranchés par le parent. Sinon, s'arrêter et le dire.

**Proposition par défaut**, à vérifier contre le programme officiel puis à soumettre au point d'arrêt :

- **les faits jusqu'à 9 + 9 = 18 sont à mémoriser** : nouvelles familles du module 2, avec révision espacée et formes à trou. On y trouve les doubles jusqu'à 10 + 10, les presque-doubles, et le passage de la dizaine par 10 (8 + 5 = 8 + 2 + 3) ;
- **les sommes de 19 à 30 se calculent par procédure** : calcul réfléchi, à rapprocher du niveau 7 du calcul rapide pour ne pas faire double emploi ;
- les leçons nouvelles de ces familles, suivies de leur exercice (lot « Les leçons ») ;
- l'effet sur l'échauffement et sur le défi record.

**Maquette à valider** : les aides visuelles nouvelles (passage de la dizaine, presque-doubles), les leçons nouvelles, et la note de proposition (méthode commune).

### 5. Lot « Multiplication » (et les tables)

**But** : la multiplication du programme de CE1 (`docs/IDEES.md`, section 1, phase 2) :

- le sens : addition répétée, rangées, groupes égaux ;
- le signe × et la commutativité ;
- les tables qu'attend le programme officiel de CE1, à établir sur le texte officiel, cité ;
- la table de multiplication à consulter dans le menu des leçons, à la place que le lot « Les leçons » lui a prévue (décision du parent du 6 octobre 2026) ;
- les liens avec doubles et moitiés.

**Maquette à valider** :

- l'exercice : la scène, les gestes, l'image des rangées ;
- les leçons ;
- la table à consulter ;
- la note de proposition (méthode commune), avec la place dans la séance et dans la rotation de « jouer ».

Ne pas inventer de personnage nouveau sans le proposer.
