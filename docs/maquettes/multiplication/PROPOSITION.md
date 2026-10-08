# « Multiplication » : la proposition pédagogique

Lot « Multiplication » (et les tables) (`docs/LOTS.md`, fiches 5 et « 4 et 5 »). **Bloc fait sans arrêt pour validation** (décision du parent du 7 octobre 2026) : cette proposition a été faite, puis appliquée par la même session. Chaque choix qui n'avait pas été tranché par le parent est marqué **choix de la session, à revoir par le parent**, et repris dans `docs/JOURNAL-CONCEPTION.md`.

**Maquette** : `art/multiplication/index.html` (les écrans nouveaux, faits avec les pièces de l'application), captures `01-exercices.png` à `13-atoi-L13.png` dans ce dossier (`node art/multiplication/captures.mjs`). Les captures de l'application elle-même, après le code : `tests/e2e/multiplication.mjs` (dans `tests/e2e/out/multiplication/`). La planche des dessins nouveaux de l'atelier : `node art/tools/still.mjs multSheet`.

## 1. Le programme officiel

**Texte de référence** : programme de mathématiques du cycle 2, annexe 4 de l'arrêté publié au Bulletin officiel n° 41 du 31 octobre 2024, en vigueur au CE1 pour l'année 2026-2027 (lien dans `docs/JOURNAL-CONCEPTION.md`, « Références »).

**Réserve** : comme pour le lot « Sommes jusqu'à 30 », le site du ministère, Eduscol et les copies du texte sont inaccessibles depuis la session (le réseau du conteneur les bloque). Les citations ci-dessous sont les extraits rendus par un moteur de recherche le 8 octobre 2026, pas une lecture du document entier. **À vérifier par le parent sur le PDF officiel.**

Extraits (CE1) :

- « Comprendre et utiliser le symbole × » ;
- « Comprendre et savoir que la multiplication est commutative » ;
- (calcul mental, « Mémoriser des faits numériques ») connaître « dans les deux sens » les tables de multiplication, et des « faits multiplicatifs usuels » ; la mémorisation « s'étale sur l'année scolaire tout entière, de manière progressive », les premiers résultats servant « de points d'appui pour en construire d'autres » ;
- (résolution de problèmes) des problèmes multiplicatifs (groupes égaux, rangées), d'abord résolus sans le signe ×.

Les extraits ne disent pas **quelles tables** : le document Eduscol plus ancien des « attendus de fin d'année » de CE1 nomme les **tables de 2, 3, 4 et 5** ; une fiche d'accompagnement cite la table de 2 en exemple. Ce qu'on en tire :

1. le **sens** d'abord : des rangées égales, l'addition répétée (4 + 4 + 4), puis le signe × ;
2. la **commutativité** (3 × 5 = 5 × 3), montrée en tournant l'image ;
3. les **tables de 2, 3, 4 et 5**, dans les deux sens (« 3 × ? = 12 »), et **la table de 10** en plus (un fait usuel, le lien avec les dizaines, la plus facile après celle de 2) ;
4. les **liens avec les doubles et les moitiés** : fois 2, c'est le double ; fois 4, le double du double ; fois 5, la moitié de fois 10.

## 2. Ce que l'application fait déjà (avant le lot)

- Les **doubles** jusqu'à 15 + 15 (additions, familles 2 et 9) : la table de 2 s'appuie dessus.
- La **table d'addition** à consulter, dans le menu des leçons (lot « Les leçons »), qui avait réservé la place de la table de multiplication.
- Les **poissons des aides** (orange, bleu) et la plaque de nacre : les rangées en sont faites, sans dessin nouveau de personnage.

## 3. La proposition

### Un cinquième exercice, « la multiplication » (module 5)

Le même écran que les additions et le calcul rapide (l'ardoise, le pavé, « je ne sais pas », le coquillage, réécouter) : rien de nouveau à apprendre pour l'enfant. Ce qui est propre à la multiplication : **les rangées**. « 3 × 4 », ce sont **3 rangées de 4 poissons**, et cela se dit « 3 fois 4 ».

| Niveau | Ce qui est travaillé | Exemple | Image des rangées | Leçon |
| --- | --- | --- | --- | --- |
| 1 | des rangées égales, écrites en addition (2 à 5 rangées de 2 à 5) | 4 + 4 + 4 | toujours là | **L13 · Des rangées égales** |
| 2 | le signe ×, les mêmes rangées | 3 × 4 | toujours là | — |
| 3 | la table de 2, dans les deux sens (« fois deux, c'est le double ») | 2 × 7, 7 × 2 | au coquillage | — |
| 4 | la table de 10 (« ce sont des dizaines ») | 10 × 4 | au coquillage | — |
| 5 | la table de 5 (« la moitié de fois dix ») | 5 × 6 | au coquillage | — |
| 6 | le tour des rangées : 3 × 5 est donné, on demande 5 × 3 | 5 × 3 = 3 × 5 | au coquillage | **L14 · On tourne les rangées** |
| 7 | la table de 3 | 3 × 7 | au coquillage | — |
| 8 | la table de 4 (« le double du double ») | 4 × 6 | au coquillage | — |
| 9 | les tables de 2, 3, 4, 5 et 10 mélangées | ? × 5 = 20 | au coquillage | — |

- **Ordre** : du sens au signe, puis les tables les plus faciles d'abord (2 : le double, déjà su ; 10 : les dizaines ; 5 : la moitié de 10), le tour (qui divise par deux ce qui reste à apprendre), puis 3 et 4. **Choix de la session**, d'après le programme (« les premiers résultats servent de points d'appui ») et l'ordre habituel des manuels.
- **Les rangées** sont dessinées en direct avec les poissons des aides, sur une plaque de nacre : en petit entre l'ardoise et le pavé aux niveaux 1 et 2 ; en grand, à la place du pavé, pour l'aide (coquillage), l'aide d'emblée (cran « plus facile »), l'exemple guidé et la correction. En grand, **elles se comptent rangée par rangée** : chaque rangée s'allume (les poissons deviennent orange), son total s'écrit au bout et se dit (« 4… 8… 12 »). Avant de compter, l'astuce de la table, s'il y en a une (2, 4, 5, 10).
- **Le tour** (niveau 6) : la multiplication donnée est écrite sur une petite plaque sous l'ardoise (« 3 × 7 = 21 ») et dite (« 3 fois 7, ça fait 21. Et 7 fois 3 ? »).
- **Déroulé d'un nouveau niveau** (comme le calcul rapide) : la leçon s'il y en a une, puis un exemple guidé (les rangées comptées, la réponse écrite), puis « À toi ! ». Avec « jouer », une question sur cinq est prise dans un niveau déjà acquis.
- **Montée** : 8 bonnes réponses sur les 10 dernières, au plus une aide, ou la voie rapide (les 5 premières justes et rapides) — les règles du calcul rapide — **sur deux jours au moins** (`acquisJours`, section 7).
- **Crans** : « plus facile », les rangées comptées d'emblée, sans promotion ; « conseillé », au coquillage ; « plus dur », sans image ni coquillage ; « très dur », sans image, avec les **formes à trou** aux niveaux des tables (« 3 × ? = 12 », puis « ? × 4 = 12 », en alternance) : le programme demande les tables « dans les deux sens ».
- **Pas de personnage nouveau** : la scène est celle des additions, avec la mascotte ; aucun guide (comme le calcul rapide).

### Les leçons nouvelles (suivies de leur exercice)

| Leçon | Exercice associé | Ce qu'elle montre |
| --- | --- | --- |
| **L13 · Des rangées égales** | multiplication, niveau 1 | trois rangées de quatre poissons, comptées rangée par rangée (4, 8, 12) ; « quatre plus quatre plus quatre » ; « on dit trois fois quatre » ; puis deux rangées de cinq |
| **L14 · On tourne les rangées** | multiplication, niveau 6 | trois rangées de cinq ; l'image tourne : cinq rangées de trois, toujours quinze ; « 9 fois 2 ? C'est 2 fois 9 : le double de neuf » |

Elles forment la **quatrième rangée du menu des leçons**, avec le pictogramme de la multiplication (trois rangées de pastilles et une croix), et au bout de cette rangée les **deux tables à consulter** : l'addition (« + ») et la **multiplication (« × »)**, à la place prévue par le lot « Les leçons ».

### La table de multiplication à consulter

De 1 × 1 à 10 × 10 (la ligne et la colonne de 0 n'apprennent rien), la diagonale des carrés teintée. Toucher une case dit le calcul (« 7 fois 5, 35. ») et montre, dans le panneau de droite, le calcul et ses rangées (7 rangées de 5). **Choix de la session** : jusqu'à 10 × 10, bien au-delà des tables travaillées, pour que l'enfant puisse explorer (et parce que c'est la table que les classes affichent).

### La place dans la séance et dans « jouer »

- **Avec « choisir »** : un cinquième exercice, dès maintenant (entre les voiliers et le bord de l'écran).
- **Avec « jouer »** : la multiplication **entre dans la rotation à partir du 4 janvier 2027** (la rentrée de janvier), avec la ligne, les additions et le calcul rapide (`seance.json`, `alternance.aPartirDe`). Avant, la rotation est inchangée : les additions jusqu'à 20 occupent le premier trimestre, et la multiplication s'introduit comme une addition répétée (`docs/LOTS.md`, « Pourquoi cet ordre »). **Choix de la session**, d'après le programme (période 3 dans les progressions courantes) ; le parent peut aussi l'imposer pour une séance, comme les voiliers.
- **Échauffement et défi record** : inchangés (des additions).
- **Espace parent** : un bloc « Module 5 · La multiplication » (niveau conseillé, niveaux acquis, historique, semaine par semaine), ses erreurs dans le journal, son niveau dans le point de départ, la multiplication parmi les notions qu'on peut imposer.

## 4. Codes d'erreur

| Code | Erreur | Exemple | Ce qui est dit |
| --- | --- | --- | --- |
| M1 | a additionné au lieu de multiplier | 3 × 4 → 7 | « Attention : fois, ce n'est pas plus. On compte les rangées. », puis les rangées comptées |
| M2 | une rangée ou une colonne de trop ou de moins | 3 × 4 → 8, 16, 9 ou 15 | les rangées comptées (pas de phrase à part) |

La même erreur deux fois dans une séance relance la leçon L13 (une fois). **Choix de la session**.

## 5. Simulation de l'année et séquences

`tests/sim-seances.mjs`, section « multiplication » (étendue pour le lot : un profil par enfant, qui sait plus ou moins vite les tables), sur l'année scolaire, seed 7 :

| Profil | Séances/sem. | Séances de multiplication (dans « jouer », à partir du 4 janvier) | Niveaux acquis (séance) |
| --- | --- | --- | --- |
| l'évaluation (« réel ») | 2 | 9 sur 64 | 1 à 5 (23 à 31), 6 (37), 7 (46), 8 (58) ; le 9 pas encore |
| l'évaluation | 5 | 10 sur 160 | tous, de la séance 53 à 69 |
| sait déjà | 2 | 10 sur 64 | tous, de 23 à 39 |
| en difficulté | 2 | 5 sur 64 | 1 à 4 |
| choisit « très dur » | 2 | 10 sur 64 | 1 à 8 |
| choisit « plus facile » | 2 | 15 sur 64 | aucun (au cran « plus facile », rien ne monte : règle de tous les exercices) |

Séquences lues : les séances du profil « réel » une à une ; `tests/recette-fonctionnelle/b-sequences.mjs --test` (aucune séance en défaut).

## 6. Phrases nouvelles

**561 phrases** (liste : `PHRASES.md`), environ **4,0 Mo** : chaque multiplication posée (75 : 3 × 4 et 4 × 3 comptent pour deux) sous ses formes (la question, « 3 fois combien… », « combien de fois 4… », la correction), les rangées dites (« 3 rangées de 4 poissons. »), les 100 cases de la table, les leçons L13 et L14 (15), les noms des niveaux et les astuces.

## 7. Résultats et défauts corrigés

1. **Tous les niveaux tombaient en quelques séances** (la voie rapide, 5 bonnes réponses rapides, acquiert un niveau dans la même séance ; les neuf niveaux en 9 séances, sans que rien soit revu un autre jour) : un niveau ne s'acquiert que sur **deux jours au moins** (`acquisJours`).
2. **L'écran jugeait la réponse comme une addition** (3 × 4 : 7 était compté juste) : trouvé par le parcours de l'application, corrigé (la réponse attendue est le produit), et un test l'empêche de revenir.
3. **La légende de la multiplication et celle de la table ne s'ouvraient pas** (une image manquante faisait échouer le panneau) : trouvé par le parcours, corrigé.
4. **Les rangées étaient petites et se lisaient mal sur le sable** : agrandies (jusqu'à 1,45 fois quand il y a de la place) et posées sur une plaque de nacre.

À 2 séances par semaine, la multiplication prend environ une séance de « jouer » sur sept à partir de janvier ; les additions jusqu'à 20 en ont un peu moins (la famille 12 n'est plus acquise dans l'année : `docs/maquettes/sommes30/PROPOSITION.md`, section 7). **Une fois tous les niveaux acquis** (profil « réel » à 5 séances par semaine, séance 69), la multiplication n'est plus choisie par « jouer » (le moins avancé d'abord) : les tables ne sont plus revues, sauf par « choisir » — comme le calcul rapide aujourd'hui. Question ouverte, section 8.

## 8. Questions qui restaient ouvertes, et le choix fait

Tous **choix de la session, à revoir par le parent** (aussi dans `docs/JOURNAL-CONCEPTION.md`) :

| Question | Choix fait | Pourquoi |
| --- | --- | --- |
| Quelles tables ? | 2, 3, 4, 5 et 10 | attendus Eduscol de fin de CE1 (2, 3, 4, 5) ; 10 : fait usuel, le lien avec les dizaines |
| Dans quel ordre ? | rangées, signe ×, 2, 10, 5, le tour, 3, 4, mélange | du plus facile au plus difficile, chaque table sur la précédente |
| Quand dans « jouer » ? | à partir du 4 janvier 2027 | les sommes jusqu'à 20 d'abord ; période 3 des progressions courantes |
| Jusqu'où la table à consulter ? | 1 × 1 à 10 × 10 | la table des classes ; explorer sans limite |
| Les formes à trou | au cran « très dur », aux niveaux des tables | « dans les deux sens » |
| Acquis en un jour ? | non : deux jours au moins | simulation (section 7) |
| Erreurs M1 et M2 | leçon L13 si la même revient deux fois | le sens d'abord |
| Les tables une fois toutes acquises | plus proposées par « jouer » (comme le calcul rapide) ; restent dans « choisir » | à revoir : une révision espacée des tables, comme les additions ? (`docs/IDEES.md`) |
| Personnage | aucun nouveau (la mascotte, les poissons des aides) | fiche du lot |
