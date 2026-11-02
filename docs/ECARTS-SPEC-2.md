# Écarts entre la spécification et l'application (deuxième confrontation)

Confrontation de `docs/SPEC.md` avec le code (`app/js`) et les réglages (`app/content`), faite le 29 octobre 2026 sur `main` après le lot « Banc Android et recette en conditions réelles » (demande de fusion #63), sans rien corriger : la spécification et l'application restent telles quelles jusqu'à la décision du parent. La première confrontation (6 octobre 2026) est dans `docs/ECARTS-SPEC.md` ; ses écarts ont été tranchés et appliqués par le lot « Correctifs » (#39).

**Périmètre** : ce qui a été construit depuis le lot « Correctifs » : les leçons et les tables (#40, #42), les sommes jusqu'à 30 et la multiplication (#42), l'étal du pêcheur (#49), la boutique du récif (#54), et les lots de correctifs jusqu'au banc Android : « Correctifs de la tablette » (#46), « Correctifs : passage de l'échauffement aux voiliers » (#52), « Recette de l'enfant et nettoyage des couches » (#56), « Décisions sur les constats de l'agent » (#59), « Correctifs de l'installation et de la veille » (#61), « Banc Android » (#63). Les règles plus anciennes ne sont relevées que là où ces lots les touchent. Ce qui est marqué **(à construire)** n'est pas relevé.

## Synthèse

1. Le gros de ce qui a été construit est conforme : le catalogue des 105 faits et les familles 8 à 13, l'ouverture d'une famille par jour, la répétition dans un bloc (jamais un fait 3 fois, jamais deux passages à moins de 4 questions : 0 cas sur 1 216 blocs simulés), les niveaux, la validation et le deuxième essai de l'étal, les prix et le calibrage de la boutique (collection complète en juin à 2 séances par semaine, même pour l'enfant en difficulté), le sélecteur qui ne part plus seul quand l'enfant a choisi. `b-sequences.mjs --test` : 252 combinaisons, 1 008 séances, aucune en défaut ; `npm test` : 418 tests, tous passent.
2. **23 écarts** : 15 où la spécification est datée ou incomplète (le code a raison), 2 où le code s'écarte d'une règle écrite (la spécification a raison), 6 questions à trancher. S'y ajoutent 8 comportements visibles que la spécification ne décrit pas (dernière partie).
3. Code à revoir : la multiplication donne un exemple guidé au cran « très dur », que la spécification exclut (7 ter.2) ; le pavé de l'étal et les cases des tables jugent le second toucher à l'heure où la page le traite, pas à l'heure du toucher, contrairement à la règle du banc Android (9.9).
4. À trancher en priorité, parce que l'enfant le voit : l'arrêt de la notion du jour quand la famille est épuisée (décision du 14 octobre) fait des séances d'additions de 5 minutes, même avec « jouer » pour l'enfant en difficulté (2.6) ; la règle des 80 % de questions sur la famille en cours n'est plus tenue (moyenne 76 à 78 %, jusqu'à 36 %) depuis la règle de l'écart de 4 questions (6.11) ; jusqu'à 15 faits nouveaux dans une séance, pour une limite écrite de 6 (6.10).
5. Une erreur de contenu dans la spécification : les sommes qui tombent sur une dizaine ronde (24 + 6, 17 + 3) ne sont dans aucun niveau du calcul rapide, contrairement à ce qu'elle affirme (6.12).

## Comment lire ce rapport

- **Qualification** : « **Spéc. datée** » = la spécification est fausse, datée ou incomplète, le code a raison ; « **Code à revoir** » = le code s'écarte d'une règle écrite, la spécification a raison ; « **À trancher** » = le parent décide.
- **Les numéros** prolongent ceux du premier rapport, section par section (le premier s'arrêtait à 2.5, 3.3, 6.9, 8.1, 9.4, 10.4) : un renvoi « (6.11) » ne peut donc pas se confondre avec un écart déjà tranché. Les sections nouvelles prennent leur nom : 7 ter.1, 7 quater.1.
- **Mesures** (toutes refaites pour ce rapport, sur le code de `main`) :
  - `npm test` : 418 tests, 0 échec ; `node tools/precache.mjs --check` : à jour (11 808 fichiers) ;
  - `node tests/recette-fonctionnelle/b-sequences.mjs --test` : 252 combinaisons exercice × niveau × cran, 1 008 séances, 0 en défaut ; une copie de l'outil, dans le dossier de travail de la session, a gardé la durée simulée de chaque séance et écrit toutes les séquences (avec « choisir ») ;
  - `node tests/sim-seances.mjs reel 2 annee --court`, `diff 2 annee`, `reel 5 annee` ; et, avec le même moteur de simulation, le détail des séances d'additions (famille, part des questions sur la famille, faits nouveaux, durée).
  - Les parcours Playwright à vitesse réelle (`tests/e2e/`) et le banc Android n'ont pas été relancés : les durées citées sont celles des modèles de simulation.

## 1. Objectif et public

Aucun écart dans le périmètre.

## 2. La séance

| N° | Règle (`docs/SPEC.md`) | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 2.6 | « Durée visée : 9 à 11 minutes … avec « jouer » » ; « Avec « choisir », aux niveaux étroits …, une séance sur une base neuve peut ainsi durer 6 à 8 minutes : c'est accepté (2.5). » | Depuis l'arrêt de la notion du jour quand la famille est épuisée (décision du 14 octobre, R4), les additions des petites familles durent moins que cela. Avec « choisir », base neuve : 14 séances sur 1 008 sous 6 minutes, de 4,9 à 5,9 min (famille 2, les doubles jusqu'à 5 ; famille 6 ; famille 13). **Avec « jouer »**, enfant en difficulté (simulation de l'année, 2 séances par semaine) : tant que la famille en cours est la famille 2 (6 séances, avant la stagnation), la notion du jour compte 5 à 12 questions et la séance dure de 5,1 à 8,9 min (séances 16, 20 et 22 : 5,2, 6,1 et 5,1 min). Plus largement, avec « choisir », 508 séances simulées sur 1 008 font moins de 9 minutes (179 sur 464 au premier rapport). | `modules/facts/runner.js`, `familleEpuisee` et `next` ; `module2.json`, `notion.arretFamilleEpuisee` | À trancher | Accepter et l'écrire (« une famille de 5 faits donne une séance de 5 minutes ») ; ou, quand la famille est épuisée avant la moitié du temps de l'étape, finir la notion du jour sur des révisions des autres familles (le comportement d'avant R4, limité à ce cas) ; ou faire passer plus tôt une petite famille à la suivante. |
| 2.7 | « Encore ! » : « Une musique y joue ; une leçon y est vue sans étoiles. » | Depuis le lot « Les leçons », l'écran de l'entraînement libre ne propose plus de leçon (elles ont quitté l'écran « choisir ») ; une leçon se voit par la bulle « les leçons » de l'accueil, et y rapporte ses 3 étoiles une fois par leçon et par jour, même après la séance du jour. L'entraînement libre ne joue aucune leçon, même la leçon d'entrée d'un niveau ou celle d'une erreur répétée. | `session/free.js` ; `main.js`, `openLessons` et `lessonAlone` | Spéc. datée | « Une musique y joue ; aucune leçon n'y est jouée (le menu des leçons est à l'accueil). » |

## 3. Choisir l'exercice et le niveau

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 3.4 | « De l'accueil au sélecteur : 5 touchers (choisir, l'exercice deux fois, le niveau deux fois). » | 6 touchers : depuis le lot « Correctifs : passage de l'échauffement aux voiliers » (point 10), le galet « choisir » de l'accueil se touche aussi deux fois. Puis la coche du sélecteur. | `main.js`, `showHome` (`deuxTouchers`) | Spéc. datée | « 6 touchers (choisir deux fois, l'exercice deux fois, le niveau deux fois), puis la coche. » |
| 3.5 | Tables à consulter : « au bout de la dernière rangée du menu, celle de la multiplication ». | Depuis le lot « L'étal du pêcheur », la dernière rangée est celle de la monnaie ; les tables sont au bout de la quatrième rangée (multiplication), dans les colonnes 4 et 5, la colonne 3 restant vide. | `seance.json`, `menuLecons.tablesPlace` | Spéc. datée | « Au bout de la rangée de la multiplication (la quatrième). » |
| 3.6 | « À toi ! » enchaîne sur le sélecteur, puis l'exercice, « sans échauffement … ni leçon d'entrée ». | La séance du jour lancée par « À toi ! » n'a ni salut ni surprise à l'accueil (on enchaîne sur le sélecteur), mais **garde le défi record** s'il est prêt, après l'exercice. | `main.js`, `handlers.accueil` et `runSession` | À trancher | Garder le défi (c'est une séance du jour comme une autre) et l'écrire, ou le retirer comme l'échauffement. |
| 3.7 | Rotation : « à égalité, l'ordre qui suit l'exercice de la dernière séance dans le cycle ligne, additions, calcul, multiplication » ; « la dernière, c'est la dernière séance terminée, une séance d'exercice choisi comprise ». | Quand la dernière séance terminée est hors de la rotation (voiliers, étal, ou multiplication avant le 4 janvier 2027), il n'y a pas d'« exercice suivant » : l'ordre repart du début (ligne, additions, calcul…). | `session/session.js`, `chooseModule` | Spéc. datée | Ajouter : « après une séance hors rotation, l'ordre repart de la ligne ». |
| 3.8 | « À toi ! » : « puis les exemples guidés et les questions de l'exercice associé » ; « c'est la séance du jour …, de l'entraînement libre sinon ». | En entraînement libre (la séance du jour déjà faite), il n'y a pas d'exemple guidé (sauf aux voiliers et à l'étal, la première fois qu'un niveau est joué) : la leçon est suivie directement des questions. | `session/free.js` (aucun `guide`) | À trancher | L'écrire, ou donner à l'entraînement libre qui suit une leçon les exemples guidés de la notion du jour (le lien entre la leçon et l'exercice). |

## 4. La difficulté : le sélecteur à quatre crans

Aucun écart. Le sélecteur part seul après 15 s seulement avec « jouer » (y compris pour une séance reprise ou un exercice imposé par le parent) ; avec « choisir », « Encore ! » et « À toi ! », rien ne part sans la coche (`main.js`, `chooseCran`, `attenteS`).

## 5. La ligne des nombres (module 1)

Aucun écart dans le périmètre.

## 6. Les additions (module 2)

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 6.10 | « Limite commune : au plus 6 faits nouveaux par séance … Exception (6.1) : … dans la simulation, 9 puis 7 faits nouveaux aux séances 2 et 6. » | L'exception (la famille en cours n'a plus d'autre question, moins de 8 faits ratés en boîte 1) va bien plus loin depuis les familles 8 à 13 et l'écart de 4 questions : profil de l'évaluation, **15 faits nouveaux** à la séance 2 (famille 1) et **13** à la séance 11 (famille 8, ouverte par l'échauffement de la même séance) ; mêmes chiffres à 5 séances par semaine (15 à la séance 2). | `modules/facts/runner.js`, `pickOverflow` | À trancher | Accepter et mettre les chiffres à jour ; ou plafonner l'exception (par exemple 10 faits nouveaux par séance en tout), sachant que la notion du jour s'arrêterait alors plus tôt (voir 2.6). |
| 6.11 | « Au moins 80 % des questions sur les faits de la famille en cours (ou choisie) ». | Plus tenu : part mesurée sur les séances d'additions de l'année, profil de l'évaluation : **moyenne 78 %**, minimum 62 % (familles 9, 10 et 11 : de 62 à 78 % presque à chaque séance) ; enfant en difficulté : **moyenne 76 %, minimum 36 %** (famille 6 : 14 questions, dont 5 de la famille ; famille 2 : 40 et 43 %) ; à 5 séances par semaine : moyenne 95 %, minimum 74 %. Cause vraisemblable : dans une petite famille (8 ou 9 faits), l'écart de 4 questions entre deux passages, retourné compris (décisions des 13 et 14 octobre), laisse souvent la famille sans question possible à son tour, et c'est un fait d'une autre famille qui est posé ; s'y ajoutent les questions plus simples après une difficulté. | `modules/facts/runner.js`, `choose`, `otherAllowed`, `recent` ; mesure : `tests/sim-recette.mjs`, `partFamille` | À trancher | Les deux décisions se contrarient pour les petites familles. Écrire « environ 80 %, moins pour les familles de moins de 10 faits » ; ou ne pas compter le retourné dans l'écart pour ces familles ; ou arrêter la notion du jour plus tôt (voir 2.6). |
| 6.12 | Catalogue : « Les autres sommes jusqu'à 30 (17 + 8, 24 + 6) … se calculent en passant la dizaine, aux niveaux 4, 6 et 7 du calcul rapide, qui les contiennent déjà » (repris section 13). | 17 + 8 est bien au niveau 7. Mais **les sommes qui tombent sur une dizaine ronde** (24 + 6, 17 + 3, 25 + 5, 13 + 7 : le second nombre de 3 à 8) **ne sont dans aucun niveau** : le niveau 4 exige que les unités restent sous 10 (34 + 5), le niveau 7 qu'elles dépassent 10 (38 + 5), le niveau 1 n'ajoute que 1 ou 2, le niveau 8 des nombres à deux chiffres. | `modules/calc/calc.js`, `KEEP` (`unitesPlus`, `passerPlus`) ; `module3.json` | Spéc. datée | Corriger l'exemple (« 17 + 8, 24 + 5 ») et écrire que les compléments à la dizaine (24 + 6) ne sont pas travaillés au-delà de 10 ; ou les ajouter au niveau 4 ou 7 (des phrases de voix à fabriquer pour chaque calcul nouveau). |
| 6.13 | Formes à trou : « Le mélange (famille 7) n'a pas d'ouverture propre ». | Le grand mélange (famille 13) non plus : ses faits reçoivent des formes à trou si une autre de leurs familles les a ouvertes. | `modules/facts/families.js`, `trouOpenFor` | Spéc. datée | « Les mélanges (familles 7 et 13) n'ont pas d'ouverture propre. » |

## 7. Le calcul rapide (module 3)

Aucun écart dans le périmètre (le niveau 9 a bien sa forme à trou, l'erreur non reconnue au mur dit « Hmm, regardons ensemble. »). Voir 6.12 pour les sommes jusqu'à 30.

## 7 bis. Les voiliers (module 4)

Aucun écart dans le périmètre (décision 6 du 13 octobre : le toucher sur un passage, « Fais glisser le bateau jusqu'au passage ! », la borne `horsBouees` du niveau 2). Pour les règles communes, voir 9.7.

## 7 ter. La multiplication (module 5)

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 7 ter.1 | « **Déroulé d'un nouveau niveau** : la leçon d'entrée (L13 au niveau 1, L14 au niveau 6), sinon un exemple guidé ». | Un exemple guidé (les rangées comptées, la réponse dite) **au début de chaque séance** de multiplication sans leçon d'entrée, que le niveau soit nouveau ou déjà travaillé (comme les deux exemples des additions). Le réglage `deroule.guides` (2) n'est lu que pour décider quand le mélange des niveaux acquis commence. | `seance.json`, `etapes.notion.module5.guides` (1) ; `session/notion.js` ; `modules/mult/runner.js` | À trancher | Garder (un rappel de la méthode à chaque séance) et l'écrire ; ou ne le donner qu'à un niveau nouveau, comme l'exemple de l'étal et des voiliers. |
| 7 ter.2 | « Au cran « très dur », pas d'exemple guidé. » | L'exemple guidé est donné aussi au cran « très dur » (séquences, multiplication niveau 3, « très dur » : l'exemple « Une rangée de 2 poissons… 2 fois 2, ça fait 2 » au début de la notion du jour). | `session/notion.js` (les exemples ne dépendent pas du cran) ; `modules/mult/runner.js`, `next` | Code à revoir | Ne pas donner d'exemple guidé au cran « très dur » (comme le calcul rapide, qui n'a pas de calcul guidé à ce cran). |

Mesure, sans écart : la montée « sur deux jours au moins » tient, mais à 5 séances par semaine les 9 niveaux sont acquis en 10 séances de multiplication (un niveau toutes les deux séances, en un peu plus de trois semaines dans la simulation) ; à 2 séances par semaine, 8 niveaux en 9 séances.

## 7 quater. L'étal du pêcheur (module 6)

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 7 quater.1 | Voix : « La voix de l'application pèsera environ 79,3 Mo : il ne reste presque plus de place pour les lots suivants (question ouverte pour le parent : relever la limite, ou alléger les fichiers). » | La limite est passée à 85 Mo (décision du parent du 10 octobre 2026, lot « La boutique du récif », section 11) ; la voix pèse aujourd'hui 81,2 Mo (11 370 fichiers). La question est tranchée ; il reste 3,8 Mo. | `tests/unit/voix.test.mjs` ; `app/assets/voix/` | Spéc. datée | « … environ 79,3 Mo ; la limite a été portée à 85 Mo (section 11) ; 81,2 Mo le 29 octobre 2026. » |
| 7 quater.2 | Niveau 9 : « prix ronds ou en 50 c (trois sur quatre en 50 c ; l'exemple guidé toujours) ». Niveau 10 : « prix en 10, 20, 50 c ». | La même règle vaut au niveau 10 : trois prix sur quatre ont des centimes, un sur quatre est rond ; l'exemple guidé a toujours des centimes. | `modules/etal/runner.js`, `tirer` | Spéc. datée | Ajouter au niveau 10 « (trois sur quatre avec des centimes ; l'exemple guidé toujours) ». |

Pour la difficulté persistante, le retour d'une erreur, la redescente et le pavé du niveau 7, voir la section 9.

## 8. Les leçons animées

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 8.2 | Si la difficulté persiste après la leçon : « étal : la leçon n'est pas relancée plus d'une fois en quatorze jours ». | Ce qui suit la difficulté à l'étal est **un achat plus simple** (un prix de la moitié basse de la fourchette du niveau), comme la question plus simple des autres exercices ; la limite de quatorze jours porte sur la relance de la leçon elle-même (par la difficulté ou par la même erreur deux fois). Aux voiliers : un nombre loin des bouées. | `modules/etal/runner.js`, `tirer` (`simple`) et `relaunch` ; `modules/voiliers/runner.js` | Spéc. datée | « étal : un achat plus simple (un prix bas) ; la leçon n'est relancée qu'une fois en quatorze jours ; voiliers : un nombre loin des bouées ». |

## 9. Règles communes à tous les exercices

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 9.5 | Après une erreur, la même question revient « 3 à 5 questions à la ligne et aux voiliers, 3 au calcul rapide (9.1), et aux additions … après au moins 4 autres questions ». | L'étal : 3 à 5 achats plus loin (`retourErreur`) ; la multiplication : 3 questions plus loin. Ni l'un ni l'autre n'est dans la liste. | `module6.json`, `reglesAdaptation.retourErreur` ; `modules/mult/runner.js` (`in: 3`) | Spéc. datée | Ajouter « 3 à 5 à l'étal, 3 à la multiplication ». |
| 9.6 | « Exemples guidés : 1 étoile s'ils sont réussis (aux voiliers, où le bateau va seul, rien) ». | À l'étal non plus (le pêcheur paie à la place de l'enfant) : rien. À la multiplication : 1 étoile, × le cran. | `modules/etal/runner.js`, `record` | Spéc. datée | « (aux voiliers et à l'étal, rien) ». |
| 9.7 | Difficulté persistante : « Elle ne compte que là où l'enfant progresse : à la ligne … ; au calcul rapide … ; aux additions … ». | Les trois exercices nouveaux ne sont pas décrits. **Multiplication** : comme le calcul rapide (un niveau pas encore acquis, hors « plus facile ») ; la leçon relancée est celle du niveau (L13 aux niveaux 1 et 2, L14 au 6 ; aucune ailleurs), puis une question d'un niveau acquis plus bas. **Étal et voiliers** : seulement au niveau conseillé, hors « plus facile » ; au-dessus du conseillé (niveau choisi), une question plus simple, sans leçon ; en dessous, rien. | `modules/mult/runner.js`, `modules/etal/runner.js`, `modules/voiliers/runner.js` (`record`) | Spéc. datée | Ajouter ces trois cas. |
| 9.8 | « Redescente : à la ligne et aux voiliers, deux séances de suite sous 50 % … Aux additions et au calcul rapide, on ne perd jamais rien ». | L'étal redescend aussi (deux séances sous 50 %, section 7 quater) ; la multiplication ne perd jamais rien (un niveau acquis le reste). | `module6.json`, `reglesAdaptation.redescente` ; `modules/mult/runner.js` (pas de redescente) | Spéc. datée | « … à la ligne, aux voiliers et à l'étal … Aux additions, au calcul rapide et à la multiplication, on ne perd jamais rien. » |
| 9.9 | Pavé, bulles-réponses et cases de la table : « Un second toucher sur la même touche en moins de 150 ms est ignoré (mesuré entre les heures des touchers eux-mêmes, pas entre les moments où la page les traite : depuis le lot « Banc Android » …, constat 8 de l'agent) ». | Le pavé des additions le fait (`e.timeStamp`). **Le pavé de l'étal (niveau 7) et les cases des tables d'addition et de multiplication** mesurent encore l'écart à l'heure où la page traite le toucher (`performance.now()`). Sur la tablette ralentie, deux touchers bien séparés traités d'un coup (le défaut du constat 8) peuvent faire perdre le second chiffre : « 11 » tapé à l'étal peut devenir « 1 ». | `modules/etal/screen.js`, `pave` (`tap`) ; `session/lessons.js`, `additionTable` (`onTap`) | Code à revoir | Prendre l'heure du toucher (`e.timeStamp`), comme `modules/facts/screen.js`. |
| 9.10 | Le clavier de l'ordinateur : « dans tout exercice où l'on tape un nombre au pavé (additions, échauffement, calcul rapide …, multiplication, dictée, défi) ». | Le pavé de l'étal (niveau 7, « Combien je te rends ? ») répond aussi au clavier, avec les mêmes règles (« Entrée » vaut la coche quand elle est à l'écran). | `modules/etal/screen.js`, `onKey` | Spéc. datée | Ajouter « l'étal, niveau 7 » à la liste. |

## 10. Récompenses et boutique du récif

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 10.5 | Arrivages : « zone par zone, une rare toutes les 3 ou 4 communes ». | L'ordre est celui de la maquette (`art/boutique/source.html`, `ORDRE`, reprise à l'identique) : les communes de la zone en paquets égaux entre ses rares. Lagon et récif de corail : 3, 3, 3 puis 2 communes avant chaque rare ; **grand large : une rare toutes les 2 communes** (9 communes, 4 rares) ; abysses : 3. | `session/rewards.js`, `ordreArrivages` | Spéc. datée | « Zone par zone, les rares réparties entre les communes (une toutes les 2 ou 3 communes, selon la zone). » |

Mesures, sans écart : prix (40, 100 ; faire briller 150, 300), créature achetée brillante une fois sur cinq, « Il te manque N étoiles » de 1 à 299, bouton de fin laissé 15 s, série (5 étoiles toutes les 3 séances, coquillage toutes les 10), étoile de diamant toutes les 4 semaines réussies : conformes à `cartes.json` et au code. Simulation de l'année en Arrivages : à 2 séances par semaine, les 60 cartes sont obtenues (55 communes et rares le 3 juin pour le profil de l'évaluation, le 21 juin pour l'enfant en difficulté) ; à 5 séances par semaine, 1 741 étoiles restent au compteur en fin d'année.

## 11. L'univers, la voix et le son

Aucun écart dans le périmètre. Vérifiés : la réaction de la mascotte (le compteur d'erreurs remis à zéro par une consigne ou une réussite), la relance (12 s, 25 s, ni pendant la pause, la leçon, la confirmation de « passer l'échauffement » ni le défi), le bouton « réécouter » seulement dans le récif vivant, la voix sous 85 Mo, l'écran de lancement (« Chargement… » à 2,5 s, « Toucher pour réessayer » à 15 s), la page de secours du service worker, l'écran « tourne le téléphone » en portrait.

## 12. L'espace parent

Aucun écart dans le périmètre. Vérifiés : les phrases d'erreur des sommes jusqu'à 30, de la multiplication et de l'étal, la grille jusqu'à 10 + 10 et les grands doubles écrits dessous, la liste et l'export des achats, le journal technique (300 événements), l'avis de stockage, le point de départ de la multiplication, de l'étal et des familles 1 à 13.

## 13. Ce qui reste à construire

Voir 6.12 : la phrase « les sommes de 19 à 30 qui ne sont pas des doubles se calculent au calcul rapide (niveaux 4, 6 et 7) » est inexacte pour les sommes qui tombent sur une dizaine ronde.

## 14. Recette

Aucun écart : les outils cités existent et passent (voir « Mesures »).

## Ce que l'application fait et que la spécification ne dit pas

Comportements visibles pour l'enfant ou le parent, à ajouter à `docs/SPEC.md` si le parent les garde.

1. **Après « À toi ! »**, l'accueil de la séance n'a ni salut ni surprise : on passe directement au sélecteur (voir aussi 3.6 pour le défi).
2. **L'entraînement libre ne joue aucune leçon** : ni la leçon d'entrée d'un niveau, ni celle qu'une erreur répétée ou une difficulté relancerait ; il n'a pas non plus d'exemple guidé, sauf aux voiliers et à l'étal, la première fois qu'un niveau est joué (voir 2.7 et 3.8).
3. **Une leçon vue depuis le menu après la séance du jour** rapporte quand même ses 3 étoiles (une fois par leçon et par jour) : c'est l'exception de la section 10, mais la section 3 ne dit pas qu'elle vaut aussi une fois la séance du jour faite.
4. **La multiplication au cran « plus facile »** a des séances d'environ 24 questions au lieu de 41 aux niveaux des tables : les rangées comptées d'emblée prennent le temps de l'étape (séquences simulées).
5. **Le menu des leçons** : une case vide entre L14 et les tables, sur la rangée de la multiplication (voir 3.5).
6. **L'étal, niveau 7, au clavier** : « Entrée » ne vaut la coche que quand la coche est à l'écran (un nombre tapé) (voir 9.10).
7. **La stagnation des familles avec « choisir »** : l'ouverture qui attendait un autre jour (une famille dépassée le jour où une autre s'était ouverte) ne se fait qu'au début d'une séance d'additions lancée par « jouer », jamais par une famille choisie (la section 6 dit « la séance d'additions « jouer » d'un autre jour », sans dire qu'une séance choisie la laisse en attente).
8. **Les mélanges et l'acquisition** : pendant la séance, une famille de mélange (7 ou 13) n'est jamais déclarée acquise en cours de partie (pas d'étoile arc-en-ciel au milieu de la notion du jour) ; elle peut l'être à la fin de la séance, quand les familles sont mises à jour, avec son étoile arc-en-ciel à la récompense (simulation : la famille 7 acquise à la séance 11).
