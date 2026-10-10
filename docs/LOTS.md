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
   - **une maquette à valider** (lot « Les leçons » ; plus pour « Sommes jusqu'à 30 » et « Multiplication », faits d'un seul bloc sans arrêt, décision du 7 octobre) : regarder les captures et la maquette indiquées dans la demande de fusion, puis répondre **dans la même session** (« validé », ou les corrections). Elle reprend et code ;
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
| 1 | « Mascotte » | tout : maquette validée (`art/mascotte/`), spécification (`docs/SPEC.md`, section 11) | non | 6 phrases, quelques secondes | fait (PR #34, à fusionner après la fabrication des 6 phrases) |
| 2 | « Les voiliers » | tout : maquette validée (`art/voiliers/`), spécification (section 7 bis) | non (une capture de contrôle du placement de la mascotte) | environ 800 phrases, environ 1 h | fait (PR #36, à fusionner après la fabrication de ses 835 phrases) |
| 3 | « Les leçons » (avec la table d'addition) | la spécification (section 3, « Les leçons ») ; les écrans sont à maquetter | oui (validée le 7 octobre 2026) | 126 phrases (la table d'addition, 121), environ 10 min | fait (PR #40 ; recette finie dans la PR #42 : durées des attentes, relecture indépendante) ; 126 phrases à fabriquer |
| 4 | « Sommes jusqu'à 30 » | le principe (section 13) et une proposition par défaut ; le contenu est à concevoir | non (bloc sans arrêt, décision du 7 octobre) | 384 phrases, environ 2,7 Mo | fait (PR #42, avec « Multiplication ») ; 384 phrases à fabriquer |
| 5 | « Multiplication » (et les tables) | le principe (`docs/IDEES.md`, phase 2) ; tout est à concevoir | non (bloc sans arrêt, décision du 7 octobre) | 561 phrases, environ 4 Mo | fait (PR #42, avec « Sommes jusqu'à 30 ») ; 561 phrases à fabriquer |

**« Sommes jusqu'à 30 » et « Multiplication » : d'un seul bloc, sans arrêt** (décision du parent du 7 octobre 2026) : la colonne « Maquette à valider » ne vaut plus pour eux ; la session fait la proposition et la maquette, puis les applique elle-même (fiche « 4 et 5 »).

Les lots portent un nom, pas un numéro : les numéros 1 à 3 ter désignent déjà les lots passés.

**Entre « Les voiliers » et « Les leçons » : le lot « Correctifs »** (décision du parent du 6 octobre 2026, fiche 2 bis). La confrontation de la spécification avec le code est faite (`docs/ECARTS-SPEC.md`, #37) et ses écarts sont tranchés ; ce lot les applique. Il ne peut pas tourner en même temps qu'un autre lot (il modifie `docs/SPEC.md`). Il n'est pas dans le tableau ci-dessus : son état est tenu ici. **État : fait** (PR #39, à fusionner ; 8 phrases nouvelles, à fabriquer avec celles des lots « Mascotte » et « Les voiliers »).

**Ensuite : le lot « L'étal du pêcheur »** (la monnaie, avancée par le parent le 8 octobre 2026 ; maquette validée le 10 octobre, `art/etal/`, PR #47 ; fiche 7). **État : à faire**, après la fusion de la PR #47 et du lot « Correctifs de la tablette ».

**Après les cinq lots : le lot « Correctifs de la tablette »** (premier essai du parent sur la tablette, 8 octobre 2026 ; fiche 6). **État : fait** (PR #46, à fusionner ; 282 phrases nouvelles, environ 2,2 Mo, à fabriquer).

**Pourquoi cet ordre.**

- Les correctifs de la confrontation avant les leçons et les sommes : ces lots s'appuient sur les règles du module 2 telles qu'elles seront écrites.

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
- **Prérequis** : sur `origin/main`, les lots qui précèdent dans le tableau sont marqués « fait », ainsi que le lot « Correctifs » (son état est sous le tableau) pour « Les leçons » et les lots suivants. Sinon, s'arrêter et le dire au parent : le lot précédent n'est pas fusionné.
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

### 2 bis. Lot « Correctifs » (entre « Les voiliers » et « Les leçons »)

**But** : appliquer les décisions du parent du 6 octobre 2026 sur le rapport de confrontation (`docs/ECARTS-SPEC.md`, demande de fusion #37). Le parent a accepté toutes les propositions de la conception (liste ci-dessous). Les numéros sont ceux du rapport.

**Prérequis** : « Les voiliers » est marqué « fait » sur `main`, et `docs/ECARTS-SPEC.md` y est. **À la fin**, passer son état (sous le tableau) à « fait », au lieu d'une ligne du tableau.

**Pas de maquette** : rien de nouveau à l'écran, sauf la forme à trou du niveau 9 du calcul rapide, qui suit celle des niveaux 4 à 8.

**Dans le code** (chaque correctif avec son test unitaire, simulé d'abord quand il touche une règle pédagogique) :

- **10.1 et 12.3** : retirer de l'espace parent la ligne « cadeaux de la surprise dans le récif ».
- **4.2** : à la ligne, une réponse au cran « plus facile » ne compte jamais pour la montée ni pour la voie rapide, même quand le niveau joué est le conseillé (décision du 27 septembre).
- **6.2** : au plus une famille d'additions ouverte par jour, toutes voies confondues (notion du jour, échauffement, stagnation). Seuls le choix du parent et le point de départ y échappent. À simuler avant de coder : la montée des familles chez les 5 profils ne doit pas ralentir au-delà d'une séance.
- **7.3** : niveau 9 du calcul rapide, forme à trou au cran « très dur » (`trou: true`), avec ses phrases (« {a} moins combien ? Ça fait {n}. ») dans l'inventaire. Ne pas fabriquer leur voix : le parent les fabrique avec celles des autres lots.
- **5.4** : la tolérance d'« estimer » se resserre d'après les estimations justes du **niveau joué**, conseillé ou non.
- **6.9** : difficulté persistante aux maisons de 8 et de 9, relancer L6 ; aux presque-doubles, relancer L4 (les doubles). Toujours au plus une fois par séance.
- **7.6** : au mur, l'erreur non reconnue dit « Hmm, regardons ensemble. » (phrase de la ligne, qui a déjà sa voix), et non « Regardons le chemin ensemble. ».

**Dans `docs/SPEC.md`** :

- les 23 écarts « Spéc. datée » : réécrire la règle comme le code l'applique, selon la proposition du rapport (2.2, 3.1, 4.1, 5.1, 5.2, 5.3, 6.1, 6.3, 6.4, 6.6, 6.7, 6.8, 7.1, 7.2, 7.4, 7.5, 8.1, 9.1, 10.2, 10.3, 10.4, 12.1, 12.2) ;
- les 7 correctifs ci-dessus, comme règles ;
- les questions tranchées, code gardé et règle écrite :
  - 2.1 : le défi à partir de la 6e séance (5 déjà terminées) ;
  - 2.3 : l'échauffement déjà fait vaut pour toute séance du même jour ; un échauffement interrompu est refait ;
  - 2.4 et 11.2 : musique très basse pendant une visite du récif ou de l'album depuis la pause, coupée hors séance (les deux sections mises d'accord) ;
  - 2.5 : séances plus courtes acceptées avec « choisir » aux niveaux étroits ; noter dans `docs/IDEES.md` (à observer) de les mesurer à l'usage ;
  - 3.2 : l'étoile d'un niveau de la ligne veut dire « dépassé » ;
  - 3.3 : laissé tel quel ;
  - 6.5 : les formes à trou du mélange suivent l'ouverture de celles des familles de chaque fait ;
  - 9.2 : la redescente n'existe qu'à la ligne ; aux additions et au calcul, on ne perd jamais rien (la révision espacée suffit) ;
  - 9.3 : la difficulté persistante ne compte que sur le niveau conseillé (ligne) ou un niveau pas encore acquis (calcul) ;
  - 9.4 : une erreur corrigée rapporte 2 étoiles en tout (1 pour la bonne réponse, 1 pour l'erreur corrigée), multipliées par le cran ;
  - 11.1 : la mascotte est déçue à la première erreur après une réussite, puis encourage aux erreurs suivantes ;
- les 24 comportements de la dernière partie du rapport, chacun dans sa section.

**Ensuite** : en tête de `docs/ECARTS-SPEC.md`, une ligne « Tranché par le parent le 6 octobre 2026, appliqué par le lot « Correctifs » (demande de fusion #…) ». La question 2 de la demande de fusion #34 (l'encouragement) est réglée par 11.1.

**Recette** : la méthode commune. Pas de relecture indépendante des écrans (rien ne change à l'écran, sauf la forme à trou du niveau 9, à capturer) ; à la place, une relecture indépendante de la spécification modifiée, confrontée de nouveau au code sur les seules sections touchées.

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

### 4 et 5. Le bloc « Sommes jusqu'à 30 » puis « Multiplication », sans interruption

**Décision du parent du 7 octobre 2026** : les deux lots sont réalisés **d'un seul tenant, par une seule session, sans aucun arrêt pour une validation**. Le parent ne pourra pas répondre pendant le travail. Pour ce bloc, cette décision remplace :

- le point d'arrêt « maquette » de la méthode commune ;
- l'arrêt quand une règle simulée montre un défaut ;
- la règle de `CLAUDE.md` « en cas de doute sur un choix pédagogique, demander plutôt que d'inventer » ;
- l'arrêt à la moitié du contexte : continuer, en tenant la rubrique « Reprise » de `docs/AVANCEMENT.md` à jour après chaque étape, pour qu'une nouvelle session puisse reprendre si celle-ci est coupée.

**À la place des arrêts, décider, et tout consigner.**

1. **La proposition est faite, puis appliquée sans attendre.**
   - Tout ce que la méthode commune demande pour un point d'arrêt est fait de la même façon : maquette dans `art/<lot>/`, captures dans `docs/maquettes/<lot>/`, note `PROPOSITION.md` avec le programme officiel cité, simulation de l'année par profil, séquences lues, nombre de phrases.
   - Ensuite seulement, elle est appliquée.
2. **Chaque choix pédagogique non tranché par le parent est pris par la session.** La session décide selon :
   - le programme officiel de CE1 (texte officiel, cité), en premier ;
   - les propositions par défaut ci-dessous ;
   - ce que montrent la simulation et les séquences.

   Chaque choix est inscrit dans `docs/JOURNAL-CONCEPTION.md` avec sa raison et marqué « choix de la session, à revoir par le parent ».
3. **Un défaut montré par la simulation est corrigé**, avec la meilleure solution trouvée, puis simulé de nouveau. Il est décrit dans le journal.
4. **Ce qui demanderait un dessin, un personnage ou un réglage que le parent n'a pas vu** reste sobre et réutilise ce qui existe : décor, personnages, appuis visuels déjà validés. Pas de personnage nouveau.

**Déroulé**

0. **D'abord, finir la recette du lot « Les leçons »**, écourtée à la demande du parent le 7 octobre 2026 : le lot a été fusionné (#40) avec ses tests unitaires et son parcours `lecons-menu`, mais sans la recette complète.
   - Faire ce qui reste, d'après sa rubrique « Reprise » dans `docs/AVANCEMENT.md` : tous les parcours, la fluidité avant et après, la simulation, `b-sequences`, la séance réelle, les durées, et la relecture indépendante de ses écrans.
   - Corriger ce qui en sort, comme un défaut de la branche, même si l'échec existe aussi sur `main`, puisque c'est ce lot qui l'a introduit. La comparaison se fait avec le `main` d'avant la #40.
   - Archiver ensuite sa rubrique « Reprise ».
   - Dans la demande de fusion du bloc, une section « Recette du lot Les leçons » donne les mesures et les corrections.
1. « Sommes jusqu'à 30 » : proposition, maquette, code, recette complète de la méthode commune, documents.
2. « Multiplication » : la même chose, sur la même branche, à la suite.
3. **Une seule demande de fusion**, intitulée « Lot : Sommes jusqu'à 30 et Multiplication ».
   - Les deux lots passent à « fait » dans le tableau.
   - En tête de la demande de fusion, une section « **Choix faits sans le parent** » : la liste courte de chaque décision pédagogique prise, avec sa raison et le lien vers la note, pour qu'il les relise après coup.
   - Puis, comme toujours, les phrases à fabriquer : liste, nombre, poids. Le poids total de la voix doit rester sous 80 Mo : sinon, réduire les phrases (gabarits plus économes) plutôt que dépasser.
4. Si la session est coupée malgré tout, le parent relance : « Lis CLAUDE.md puis docs/LOTS.md, et reprends le bloc « Sommes jusqu'à 30 » puis « Multiplication » là où il s'est arrêté (docs/AVANCEMENT.md, rubrique « Reprise »). »

**Prérequis** : « Les leçons » et « Correctifs » sont marqués « fait » sur `main` (même si la recette des leçons n'est pas finie : c'est l'étape 0).

### 4. Lot « Sommes jusqu'à 30 »

**But** : la suite du module 2 (`docs/SPEC.md`, section 13, « Sommes jusqu'à 30 » ; question ouverte dans `docs/IDEES.md`, section 3). **Jusqu'à 30** : décision du parent du 30 septembre, confirmée le 6 octobre 2026.

**Prérequis supplémentaire** : le lot « Correctifs » est fait (son état, sous le tableau, dit « fait » sur `main`). Sinon, s'arrêter et le dire.

**Proposition par défaut**, à vérifier contre le programme officiel puis à appliquer sans arrêt (bloc ci-dessus) :

- **les faits jusqu'à 9 + 9 = 18 sont à mémoriser** : nouvelles familles du module 2, avec révision espacée et formes à trou. On y trouve les doubles jusqu'à 10 + 10, les presque-doubles, et le passage de la dizaine par 10 (8 + 5 = 8 + 2 + 3) ;
- **les sommes de 19 à 30 se calculent par procédure** : calcul réfléchi, à rapprocher du niveau 7 du calcul rapide pour ne pas faire double emploi ;
- les leçons nouvelles de ces familles, suivies de leur exercice (lot « Les leçons ») ;
- l'effet sur l'échauffement et sur le défi record.

**Maquette** (faite et appliquée sans arrêt, bloc ci-dessus) : les aides visuelles nouvelles (passage de la dizaine, presque-doubles), les leçons nouvelles, et la note de proposition (méthode commune).

### 5. Lot « Multiplication » (et les tables)

**But** : la multiplication du programme de CE1 (`docs/IDEES.md`, section 1, phase 2) :

- le sens : addition répétée, rangées, groupes égaux ;
- le signe × et la commutativité ;
- les tables qu'attend le programme officiel de CE1, à établir sur le texte officiel, cité ;
- la table de multiplication à consulter dans le menu des leçons, à la place que le lot « Les leçons » lui a prévue (décision du parent du 6 octobre 2026) ;
- les liens avec doubles et moitiés.

**Maquette** (faite et appliquée sans arrêt, bloc ci-dessus) :

- l'exercice : la scène, les gestes, l'image des rangées ;
- les leçons ;
- la table à consulter ;
- la note de proposition (méthode commune), avec la place dans la séance et dans la rotation de « jouer ».

Pas de personnage nouveau : la scène réutilise le décor et les personnages existants (bloc ci-dessus).

### 6. Lot « Correctifs de la tablette »

**Origine** : le premier essai du parent sur la tablette, le 8 octobre 2026, après la publication des cinq lots. Les captures sont dans `docs/maquettes/correctifs-tablette/`.

**Comme le bloc 4 et 5 : d'un seul tenant, sans arrêt pour une validation.** La session décide elle-même. Chaque choix va dans `docs/JOURNAL-CONCEPTION.md`, marqué « choix de la session, à revoir par le parent », et dans une section « Choix faits sans le parent », en tête de la demande de fusion. Pour ce lot, cela remplace la règle « demander plutôt que d'inventer » de `CLAUDE.md`.

**Prérequis** : les lots « Sommes jusqu'à 30 » et « Multiplication » sont marqués « fait » sur `main`.

**Ce qui est demandé** (décisions du parent du 8 octobre 2026, à reporter dans `docs/SPEC.md`) :

1. **Le lancement de l'application**
   - **Écran de démarrage** : au lieu de l'écran bleu, un écran avec le logo « Maths CE1 » (dessiné dans l'atelier, style A) et, dessous, de petites lignes d'information : 2026, js2c, la version. Pas de prénom d'enfant (le dépôt est public).
   - **Une barre de chargement** qui avance réellement, selon ce qui est chargé : planches, vidéos de la mascotte, index de la voix.
   - **Un toucher sur l'écran le fait disparaître**, quand le chargement est fini. Ce toucher sert aussi de « premier toucher » qui autorise la voix.
   - **À l'arrivée sur l'accueil, la mascotte souhaite la bienvenue**, une fois par lancement : salut et phrase courte, quelques variantes. C'est distinct de la bienvenue qui suit « jouer », qui reste.
2. **Choisir en deux touchers** : ceci remplace la décision du 28 septembre (« validation simple en un toucher ») pour les écrans de choix :
   - l'écran « choisir », au niveau des exercices puis des niveaux ;
   - le menu des leçons, tables comprises ;
   - les écrans de choix de l'entraînement libre.

   Le fonctionnement :
   - **Premier toucher** sur une tuile : elle est **sélectionnée**, avec une bordure bien visible et distincte du halo du niveau conseillé.
   - La mascotte dit son nom et une courte description. La description est celle de la légende du parent (`legendes.json`), adaptée si besoin pour être dite à une enfant.
   - Le même texte s'écrit dans une **bulle de BD qui part d'un coin de la tuile**. La bulle est placée selon la position de la tuile, de façon à rester dans l'écran et à ne cacher ni la tuile ni ses voisines immédiates si possible.
   - **Second toucher sur la même tuile : elle se lance.** Un toucher sur une autre tuile la sélectionne à la place. Un toucher hors des tuiles désélectionne.
   - L'appui long continue de ne rien lancer.
   - Le petit livre de la légende reste, pour le parent.
3. **Les voiliers rament sur la tablette : hors de ce lot** (décision du parent du 8 octobre 2026). Ne rien changer au rendu ni à la fluidité du jeu des voiliers. Les mesures faites sur la tablette et les remèdes envisagés sont gardés dans `docs/IDEES.md`, pour un lot ultérieur.
4. **L'ardoise vide derrière la bulle** (capture 01, calcul rapide en entraînement) : l'ardoise de l'opération apparaît vide, en arrière-plan, pendant que la bulle parle. Reproduire, trouver la cause et corriger dans tous les exercices et dans l'entraînement libre :
   - jamais d'ardoise vide visible ;
   - la bulle évite l'ardoise quand elle peut (règle du lot « Mascotte »).
5. **« +10 » dit par l'ancienne voix** (capture 02, ponts du chemin au calcul rapide). Une phrase dite sans fichier passe par la synthèse du navigateur, une autre voix.
   - Trouver toutes ces phrases, dans tout le jeu : les pas des ponts, et toute phrase composée à la volée qui échappe à l'inventaire (`tools/voix/inventaire.mjs`).
   - Les ajouter à l'inventaire, ou les dire avec des phrases qui existent déjà.
   - Ajouter un contrôle durable : chaque parcours `tests/e2e` relève les phrases dites sans fichier (`voice.misses`). Le parcours échoue s'il y en a une, sauf phrase volontairement absente comme un nom tapé.
6. **Le clavier de l'ordinateur** : dans tout exercice où l'on tape un nombre au pavé, les touches du clavier font la même chose :
   - les chiffres, pavé numérique compris ;
   - « Retour arrière » efface ;
   - « Entrée » vaut la coche.

   Rien ne change sur la tablette.
7. **Plus de bouton « réécouter » en haut à droite** : on **touche la mascotte** pour la faire répéter.
   - Mêmes effets qu'avant : redit la consigne, compteur d'écoutes, refait la bulle.
   - La zone à toucher couvre toute la tête et fait au moins 64 px.
   - Un petit signe discret indique la première fois que la mascotte se touche : par exemple la relance de 25 s, « Touche-moi pour réécouter la consigne. », qui remplace « Tu peux réécouter la consigne. ».
   - Là où la mascotte n'est pas affichée, comme le récif, rien ne change.
   - Mettre à jour `CLAUDE.md` (« bouton réécouter toujours visible ») et `docs/SPEC.md`.
8. **Les fins de ligne sous Windows** : ajouter un `.gitattributes` (`* text=auto eol=lf`, binaires marqués comme tels). La liste du mode hors ligne fabriquée sur l'ordinateur du parent doit être identique à celle de GitHub : plus d'avertissement « sw-files.json n'était pas à jour ».

**Voix** : les phrases nouvelles sont listées dans la demande de fusion, avec leur nombre et leur poids :
- les bienvenues ;
- les descriptions des tuiles ;
- « Touche-moi… » ;
- les phrases trouvées au point 5.

Le parent les fabrique ensuite avec `node tools\voix\publier.mjs`. Rester sous 80 Mo.

**Recette** : la méthode commune. En plus :
- un parcours du choix en deux touchers sur chaque écran de choix, avec les bulles capturées dans les quatre coins de l'écran ;
- l'écran de démarrage capturé ;
- le clavier essayé dans chaque exercice à pavé ;
- le contrôle des phrases sans fichier sur tous les parcours.

### 7. Lot « L'étal du pêcheur » (la monnaie)

**But** : la maquette `art/etal/` (décor, pêche du jour, orage, portefeuille, soucoupe ; validée par le parent le 10 octobre 2026) devient le **module 6** de l'application : un exercice de monnaie à l'étal du pêcheur, avec ses niveaux, ses crans, ses corrections, ses leçons, son enregistrement et son espace parent. Avancé à la demande du parent (8 octobre 2026) : la monnaie est une notion de la vie courante qu'il veut faire acquérir. Concept et décisions : `docs/IDEES.md`, section 2, « L'étal du pêcheur » ; ce qui en reste dans `docs/SPEC.md`, section 13, « L'heure et la monnaie », est remplacé par une section **7 quater** (le module 6). Lire `art/etal/README.md`, `art/etal/PHRASES.md`, `art/mascotte/README.md`, et la fiche du lot « Les voiliers » (même méthode d'intégration).

**Comme le bloc 4 et 5 : d'un seul tenant, sans arrêt pour une validation** (la maquette visuelle est validée ; les règles ci-dessous sont celles du parent ou proposées par la conception). Si une règle pose problème en simulation, la session tranche elle-même ; chaque choix va dans `docs/JOURNAL-CONCEPTION.md`, marqué « choix de la session, à revoir par le parent », et dans une section « Choix faits sans le parent » en tête de la demande de fusion.

**Prérequis** : la demande de fusion de la maquette (#47) et le lot « Correctifs de la tablette » sont fusionnés sur `main`.

**Méthode d'intégration** (celle des voiliers et du récif vivant) :

- un outil de l'atelier, `art/tools/export-etal.mjs`, reprend les images de `art/etal/img/` dans `app/assets/etal/` et fabrique le module de la scène à partir du script de la maquette ; la maquette n'est jamais modifiée ; les retouches (raccords avec l'application) sont faites et contrôlées par l'export ;
- **gardé tel quel** : le décor et ses animations (ciel, mer en trois bandes, oiseaux, bateaux et leurs versions réduites, phare, pluie, lampe, lumière cuite dans l'étal), la pêche du jour et ses ardoises de prix écrites par le code, le portefeuille (vidéo d'ouverture, portefeuille ouvert en deux calques, argent rangé entre les deux, sortie et rangement en un toucher, fermeture d'un toucher à côté), la soucoupe, le glisser et le toucher de l'argent ;
- **retiré** : les boutons de la maquette, le panneau de réglages et le compteur. Les valeurs des réglages deviennent des constantes de `app/content/etal.json` : celles que le parent donne dans son prompt (« Copier les réglages » de la maquette), sinon les valeurs de départ de la maquette ;
- **la mascotte** : celle de l'application, à sa place (la fenêtre de la cabane tombe sur sa place, `art/etal/README.md`), abaissée et rognée au rebord de la fenêtre comme dans la maquette ; sa bulle, sa flèche, ses réactions comme partout ; le voile de l'orage sur elle ;
- **les boutons de l'application** (maison, pause, « passer », « je ne sais pas », la coche) à leur place habituelle, sauf s'ils tombent sur le portefeuille, la soucoupe ou les produits : alors les placer sur le comptoir ou le décor, captures à l'appui, et le dire. La coche de validation (« J'ai payé ») est grande et près de la soucoupe.
- **Fluidité** : 60 images/s mesurées par le parent sur la tablette avec la maquette (beau et mauvais temps). Mesurer avec `tests/e2e/perf.mjs` avant et après ; garder l'allègement automatique de la pluie ; si l'intégration coûte plus que la maquette, le dire.

**Le déroulement d'une question** (« acheter ») :

1. Un produit de l'étal s'allume (léger soulèvement, halo, son ardoise de prix aussi). Le pêcheur : « Achète les sardines. » puis « Elles coûtent 3 euros. » (deux phrases enchaînées, voir « Voix »). Le prix est écrit sur l'ardoise : la voix le redit, l'ardoise le montre.
2. L'enfant ouvre le portefeuille, sort l'argent, dépose billets et pièces dans la soucoupe (toucher ou glisser) ; elle peut en reprendre (toucher dans la soucoupe).
3. Elle touche la coche. Le pêcheur compte ce qu'il y a dans la soucoupe, à voix haute, objet par objet, du plus gros au plus petit (« 2… 3 euros »), avec un halo sur l'objet compté (en « plus facile », ce compte est montré et dit à chaque objet posé).
4. Juste : il prend l'argent (qui glisse vers sa fenêtre), emballe le produit (le produit glisse hors de l'étal, un nouveau prend sa place à la question suivante), réaction de la mascotte. S'il doit rendre la monnaie (niveaux de rendu), il pose la monnaie dans la soucoupe en comptant à partir du prix (« 13… 14, 15… 20 ») : l'argent rendu revient ensuite dans le portefeuille de l'enfant.
5. Faux : correction (voir plus bas), puis la question revient plus loin, comme partout (section 9).

**Les niveaux** (dans `app/content/module6.json` ; les prix et le contenu du portefeuille sont tirés par le code à chaque question, jamais écrits dans les images) :

| Niveau | Contenu | Portefeuille | Prix | Exemple |
| --- | --- | --- | --- | --- |
| 1 | Pièces et billets : poser la pièce ou le billet demandé | 1 € à 50 €, un de chaque | — | « Pose un billet de 10 euros. » |
| 2 | Payer juste avec des pièces | pièces de 1 € et 2 € | 2 à 10 € | 7 € = 2 + 2 + 2 + 1 |
| 3 | Payer juste avec billets et pièces | billets de 5 et 10 €, pièces de 1 et 2 € | 6 à 20 € | 17 € = 10 + 5 + 2 |
| 4 | Payer juste jusqu'à 50 € | billets de 5 à 50 €, pièces de 1 et 2 € | 11 à 50 € | 34 € = 20 + 10 + 2 + 2 |
| 5 | Payer juste avec un portefeuille restreint : le compte juste existe, mais il faut le trouver | tiré pour qu'il n'y ait qu'une ou deux façons (par exemple sans pièce de 1 €) | 3 à 30 € | 7 € sans pièce de 1 € : 5 + 2 |
| 6 | Le compte juste est impossible : payer sans pièce de trop ; le pêcheur rend la monnaie et compte | tiré pour que le compte juste soit impossible | 3 à 20 € | 13 € avec un billet de 20 € et des pièces de 2 € : donner 20 € |
| 7 | Rendre la monnaie : le paiement est montré (le billet est déjà dans la soucoupe) ; « Combien je te rends ? » au pavé | — | 1 à 19 €, billet de 5, 10 ou 20 € | 13 € payés avec 20 € → 7 |
| 8 | Deux produits : « Achète les sardines et le maquereau. » ; payer juste le total | billets de 5 à 20 €, pièces | total 5 à 30 € | 3 + 4 = 7 € |
| 9 | Les centimes : prix ronds ou en 50 c, écriture à virgule sur l'ardoise | ajoute les pièces de 50 c | 1,50 à 10 € | 3,50 € = 2 + 1 + 50 c |
| 10 | Les centimes : prix en 10 c, 20 c, 50 c | ajoute les pièces de 10 et 20 c | 0,30 à 10 € | 2,70 € = 2 + 50 c + 20 c |

- **Ordre et montée** : règles communes (section 9). Le niveau 1 est court (une poignée de questions, voie rapide). Les centimes (9 et 10) sont attendus par le programme au plus tard en période 2 ; ils restent accessibles par « choisir » dès le départ.
- **Le contenu du portefeuille** est tiré à chaque question selon le niveau ; ce qui a été dépensé ne manque pas à la question suivante (le portefeuille est regarni à chaque question). Contrôle automatique : au niveau 5, le compte juste existe toujours ; au niveau 6, il n'existe jamais, et un paiement sans pièce de trop existe toujours.
- **La règle de validation** : quand le compte juste est possible (niveaux 2 à 5, 8 à 10), il est exigé. Quand il est impossible (niveau 6), le paiement est juste s'il suffit et si on ne peut retirer aucun objet sans qu'il ne suffise plus (« aucune pièce de trop »).
- **La réponse qui varie** (section 9) : prix, produits et contenus tirés sans remise ; contrôlé par `b-sequences.mjs`, étendu au module 6 (la « réponse » est le prix).

**Les crans** (section 4 ; avec « jouer » comme avec « choisir », le cran ne change pas le niveau, comme aux voiliers) :

- **plus facile** : le total de la soucoupe est affiché et dit à chaque objet posé ; la valeur s'écrit sur chaque pièce et billet sortis ; au niveau 7, la ligne de l'aide est montrée d'emblée ;
- **conseillé** : le total est montré au moment du compte (après la coche) ;
- **plus dur** : pas de total ; prix dans le haut de la fourchette du niveau ;
- **très dur** : pas de total, prix en haut de fourchette, et un portefeuille plus garni de petites pièces (le chemin le plus long n'est pas le bon).

**Erreurs, corrections, aides** :

- **M1 « pas assez »** : le pêcheur compte, puis « Il manque 2 euros. » ; l'argent reste dans la soucoupe, l'enfant peut compléter **une fois** (deuxième essai, comme aux voiliers), sinon correction ;
- **M2 « trop » quand le compte juste existe** : « Tu peux faire le compte juste. » ; il rend ce qui est en trop, deuxième essai ;
- **M3 « une pièce de trop »** (niveau 6) : il rend la pièce inutile (« Celle-là, garde-la ! ») ;
- **M4 « le nombre au lieu de la valeur »** : la soucoupe contient autant d'objets que le prix en euros (heuristique) : correction qui compte les valeurs ;
- **M5 « rend le prix au lieu de la différence »** et **M6 « erreur de rendu »** (niveau 7) ;
- **M7 « mauvaise pièce ou mauvais billet »** (niveau 1) ;
- **NSP** comme partout.
- **La correction** montre une bonne façon de payer : l'argent de l'enfant revient au portefeuille, puis les objets d'une solution glissent un par un dans la soucoupe pendant que le pêcheur compte. Au niveau 7 : le saut sur une ligne graduée, du prix à la somme donnée (les primitives de la ligne de l'application), « 13… 20, ça fait 7 ».
- **L'aide (coquillage)** : le total affiché et dit à chaque objet posé, plus la valeur sur chaque objet ; au niveau 7, la ligne.

**Les leçons** (section 8 ; menu des leçons : une rangée « monnaie ») :

- **L15 « Pièces et billets »** : une pièce de 2 € vaut deux pièces de 1 € ; un billet de 5 € vaut cinq pièces de 1 € ; on compte la valeur, pas le nombre (trois pièces de 2 € : 2, 4, 6) ;
- **L16 « Payer juste »** : du plus gros au plus petit (17 € : 10, 15, 16, 17) ;
- **L17 « Rendre la monnaie »** : on compte à partir du prix jusqu'à ce qu'on a donné (13… 20 : 7 euros) ;
- **L18 « Les centimes »** : 100 centimes font 1 euro ; 3,50 € c'est 3 euros et 50 centimes ; deux pièces de 50 c font 1 € ; « deux euros cinq » et « deux euros cinquante » ne sont pas la même chose.

Chacune suivie de « À toi ! » vers son niveau (section 3). Relancées selon les règles communes (difficulté persistante, même erreur deux fois).

**L'orage** (décision du parent du 10 octobre 2026) : à l'entrée de l'exercice, mauvais temps une fois sur deux (`etal.json`) ; sinon, une fois sur deux, il arrive en cours de partie (entre 2 et 6 min, tiré au hasard) : la mascotte dit une des quatre répliques de `art/etal/PHRASES.md` (jamais deux fois de suite la même), à un moment où elle ne parle pas d'une question (entre deux questions). Le temps ne change rien à l'exercice. Par mauvais temps, la lampe s'allume et éclaire l'étal, les produits, le portefeuille et la soucoupe comme dans la maquette.

**Récompenses** : les règles de la section 10 (étoiles selon le cran, erreur corrigée, niveau franchi). La monnaie de l'exercice n'est **jamais** celle des étoiles.

**Accès** : une tuile de l'écran « choisir » (un portefeuille ou une pièce, dessinés dans l'atelier, style A), ses 10 niveaux (légende du parent), l'entraînement libre ; pictogramme de frise. **Hors de la rotation de « jouer »**, comme les voiliers (`seance.json`, `alternance.horsRotation`) ; le parent peut l'imposer pour la prochaine séance « jouer ». Question ouverte pour le parent (valeur par défaut : hors rotation).

**Espace parent** : réponses, codes M1 à M7 et NSP, progression, légende des 10 niveaux, notes de la séance (prix, contenu de la soucoupe, rendu).

**Voix** — **aucune voix n'est fabriquée dans ce lot** (`CLAUDE.md`, « Voix ») ; le parent les fabrique plus tard, sur son ordinateur, avec Chatterbox (`docs/VOIX.md`). La session :

- écrit les phrases dans `app/content/textes.json` (et les leçons) et les fait entrer dans l'inventaire (`tools/voix/inventaire.mjs`) ;
- limite leur nombre par des phrases enchaînées : le produit (« Achète les sardines. », 12 phrases, avec le bon article et l'accord : « Elles coûtent » / « Il coûte ») puis le prix (« 3 euros. », « 3 euros 50. », « 2 euros 70. »…, autant que de prix possibles), les montants comptés (« 2… », « 3 euros. »), les manques et les rendus ; viser moins de 600 phrases nouvelles ; les prix tirés seulement parmi ceux qui ont une phrase ;
- reprend les quatre répliques de l'orage de `art/etal/PHRASES.md` ;
- donne dans la demande de fusion la liste exacte des phrases nouvelles, leur nombre et leur poids estimé.

**Recette, en plus de la méthode commune** :

- tests unitaires des règles : tirage des portefeuilles (existence ou absence du compte juste), validation « aucune pièce de trop », rendu, tirage des prix parmi ceux qui ont une phrase ;
- simulation par profil (`tests/sim-seances.mjs`, étendu au module 6) et séquences lues ;
- un parcours `tests/e2e/etal.mjs` avec les captures (1280 × 800 et 1920 × 1200) de chaque situation : beau temps, mauvais temps, arrivée de l'orage et réplique, portefeuille fermé, ouvert, argent sorti, paiement juste, « pas assez », « trop », pièce de trop, rendu de monnaie par le pêcheur, niveau 7 au pavé, deux produits, centimes, « je ne sais pas », correction, exemple guidé, pause et reprise, chaque leçon ;
- mesure du temps d'image, beau et mauvais temps, portefeuille ouvert ;
- relecture indépendante (méthode commune).

### 8. Lot « Correctifs : passage de l'échauffement aux voiliers »

(et autres défauts vus sur la tablette le 10 octobre 2026 : points 1 à 8 ; et le nouveau logo de démarrage : point 9)

**Origine** : essai du parent sur la tablette, le 10 octobre 2026. Les captures sont dans `docs/maquettes/correctifs-2/`.

**Comme les lots 4, 5 et 6 : d'un seul tenant, sans arrêt pour une validation.** Les choix de la session vont dans le journal, marqués « choix de la session, à revoir par le parent », et dans une section « Choix faits sans le parent » de la demande de fusion.

**Les défauts à corriger**

1. **L'écran de l'échauffement reste par-dessus les voiliers** (capture 01, tablette). Après « passer l'échauffement », le jeu des voiliers démarre, mais il reste par-dessus :
   - le pavé de l'échauffement (chiffres, effacer, coche) ;
   - le coquillage d'aide ;
   - le bernard-l'ermite ;
   - un second bouton « je ne sais pas », celui de l'échauffement, en plus de celui des voiliers.

   **Le défaut est certain : le parent l'a eu sur la tablette.** La session de conception ne l'a pas reproduit en passant l'échauffement depuis la première question, après une erreur ou après avoir touché le coquillage. Il dépend donc du moment où l'on passe, du chemin d'entrée, ou de la lenteur de la tablette, par exemple une minuterie qui se déclenche après le passage à l'étape suivante.
   - **Reproduire en essayant chaque chemin** : « jouer », « choisir » avec le choix en deux touchers, « Encore ! ».
   - **Et chaque moment de l'échauffement** : pendant la phrase d'introduction, pendant une question, chiffres tapés, pendant l'aide, pendant une correction avec le bernard-l'ermite, pendant l'exemple guidé, confirmation par la coche, confirmation automatique après 5 s.
   - **Corriger la cause, pas le symptôme** : à la fin de l'échauffement, quelle que soit la façon dont il finit, tout ce qu'il a posé à l'écran est retiré, et ses minuteries sont arrêtées.
   - **Vérifier les autres passages entre étapes** de la même façon : échauffement vers chaque exercice (ligne, additions, calcul rapide, voiliers, multiplication), notion du jour vers le défi, défi vers la récompense, pause et reprise.
2. **Un contrôle durable.** Un parcours `tests/e2e` passe par chaque exercice précédé d'un échauffement passé, à chacun des moments ci-dessus. Il échoue si un élément d'une étape précédente reste visible : pavé, coquillage, personnage guide, double bouton.

   Le parcours actuel des voiliers désactive l'échauffement : c'est pourquoi ce défaut n'a pas été vu.
3. **Le texte qui déborde de la bulle** (capture 02, conteneur) : « trois-cent-soixante-neuf » sort de la bulle, dans les voiliers. Dans toute l'application, la bulle s'agrandit ou passe à la ligne pour contenir son texte. Le long mot composé peut se couper aux traits d'union.
4. **Une bulle vide visible** (capture 03, conteneur) : pendant une question de l'échauffement, une bulle vide et pâle reste à côté de la mascotte. Une bulle sans texte ne s'affiche jamais.
5. **À vérifier** :
   - **Le clavier pendant l'échauffement.** En conception, des chiffres tapés au clavier ne se sont pas inscrits. Le moment n'était peut-être pas le bon : la question était peut-être encore en train d'apparaître.
   - **Le cadrage à la taille exacte de la tablette** (écran 1138 × 711, densité 2,25). Sur la capture 01, la maison et la mascotte semblent coupées à gauche. Faire les captures à cette taille sur les écrans de jeu.
6. **L'ancienne mer calculée des voiliers apparaît un instant** (vue par le parent sur la tablette).
   - Depuis la mer illustrée (#48), le module garde la mer procédurale « en secours » (`app/js/voiliers/voiliers-scene.js`, `render`, « repli : la mer procédurale »). Elle est dessinée tant que l'illustration n'est pas prête : c'est le flash du début.
   - **La retirer de l'application**, par l'outil d'export, jamais à la main : son programme, son contexte de dessin, ses réglages.
   - Tant que la mer illustrée n'est pas prête, montrer sa première image fixe, ou le dégradé fixe de la mer, sans calcul.
   - Si la mer illustrée ne peut pas fonctionner (pas de WebGL), une image fixe de la mer.
   - La maquette `art/voiliers/` garde sa mer à elle : seule l'application l'abandonne.
   - Mesurer le gain : poids du module, mémoire, temps de démarrage du jeu.
7. **Plus d'étiquette d'appui long dans les menus** (capture 04) : sur les écrans de choix (exercices, niveaux, leçons, tables, entraînement), l'appui long faisait apparaître une étiquette rectangulaire.
   - Depuis le choix en deux touchers, cette étiquette **double** la bulle de la mascotte, avec un autre texte : deux descriptions à la fois.
   - La supprimer sur ces écrans : seule la bulle reste. L'appui long n'y fait plus rien de particulier ; il ne lance toujours rien.
   - Ailleurs (maison, coquillage, « je ne sais pas », etc.), ne rien changer.
   - Mettre `docs/SPEC.md` à jour (appui long).
8. **L'entourage de sélection ne suit pas la tuile** (captures 04 et 05) : sur les tuiles carrées à coins arrondis (niveaux, leçons), l'entourage rouge est décalé dans les angles. Il doit :
   - suivre exactement la forme de chaque tuile : cercle pour les exercices, carré aux coins arrondis du même rayon pour les niveaux et les leçons ;
   - être centré, à distance régulière du bord.

   Vérifier sur agrandissement, à 1280 × 800, 1920 × 1200 et à la taille de la tablette (1138 × 711, densité 2,25).

**Et une amélioration**

9. **Le nouveau logo de l'écran de démarrage** (décision du parent du 10 octobre 2026 ; maquette validée : `art/logo/`, lire son `README.md`).
   - **Remplacer le logo dessiné** (`demarrage.logo`, `art/src/canvas-core/sea/demarrage.ts`) par les calques de la maquette : texte, étoile, ombre, et leurs places (`art/logo/images/position.json`).
   - **Les images vont dans `app/assets/logo/`**, copiées par un outil d'export, `art/tools/export-logo.mjs`, comme pour le récif et les voiliers. On ne les copie jamais à la main, et l'outil ne modifie jamais la maquette.
   - **Reprendre les mouvements de la maquette tels quels**, avec ses valeurs : le va-et-vient du logo et de son ombre, le tour de l'étoile puis 2 s d'arrêt, les bulles qui montent, les étincelles, les faisceaux du lagon, le fond d'eau. S'il faut changer un mouvement, on change d'abord la maquette.
   - **Garder sans changement** la barre de chargement (qui avance réellement), la ligne « 2026 · js2c · version », le toucher qui ferme l'écran et autorise la voix, et le fondu de sortie.
   - **Le logo s'affiche dès l'ouverture.** Ses images (environ 165 Ko en @2x) sont chargées les toutes premières, comme l'est aujourd'hui la planche `demarrage`. Le démarrage tient toujours en moins de 3 s.
   - **Retirer de la planche `demarrage` le logo dessiné**, qui ne sert plus, par `export-app.mjs`. La barre reste.
   - **À la fermeture de l'écran**, arrêter la boucle d'animation et libérer les images.
   - **Mesurer le temps d'image sur cet écran.** Si la moyenne dépasse 20 ms, alléger : moins de bulles, puis faisceaux figés. C'est la règle de `CLAUDE.md`.
   - **Le logo de l'espace parent et l'icône de l'application ne changent pas** : ce n'est pas demandé.
   - **Mettre à jour** `docs/SPEC.md` (section 2, l'écran de démarrage) et `docs/ARCHITECTURE.md`, avec l'outil d'export.

**Voix** : en principe aucune phrase nouvelle. S'il y en a, les lister dans la demande de fusion.

**Recette** : la méthode commune, avec :
- le parcours du point 2 ;
- des captures à 1138 × 711, densité 2,25 ;
- une capture de chaque écran de choix avec une tuile sélectionnée ;
- le démarrage des voiliers filmé image par image, sans aucune image de l'ancienne mer.
- l'écran de démarrage, à 1280 × 800 et à 1138 × 711 (densité 2,25), comparé à la maquette `art/logo/` : une capture fixe, puis une suite d'images sur 4 s (le va-et-vient, le tour de l'étoile, les bulles qui montent) ; le temps d'image mesuré sur cet écran.
