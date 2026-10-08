# « Sommes jusqu'à 30 » : la proposition pédagogique

Lot « Sommes jusqu'à 30 » (`docs/LOTS.md`, fiches 4 et « 4 et 5 »). **Bloc fait sans arrêt pour validation** (décision du parent du 7 octobre 2026) : cette proposition a été faite, puis appliquée par la même session. Chaque choix qui n'avait pas été tranché par le parent est marqué **choix de la session, à revoir par le parent**, et repris dans `docs/JOURNAL-CONCEPTION.md`.

**Maquette** : `art/sommes30/index.html` (les écrans nouveaux, faits avec les pièces de l'application), captures `01-familles.png` à `11-presque-double-7+8.png` dans ce dossier (`node art/sommes30/captures.mjs`). Les captures de l'application elle-même, après le code : `tests/e2e/sommes30.mjs` (dans `tests/e2e/out/sommes30/`).

## 1. Le programme officiel

**Texte de référence** : programme de mathématiques du cycle 2, annexe 4 de l'arrêté publié au Bulletin officiel n° 41 du 31 octobre 2024, en vigueur au CE1 pour l'année 2026-2027 ; lien gardé dans `docs/JOURNAL-CONCEPTION.md` (« Références »).

**Réserve** : depuis la session, le site du ministère et Eduscol sont inaccessibles (le réseau du conteneur les bloque). Les citations ci-dessous sont les extraits du texte officiel rendus par un moteur de recherche le 7 octobre 2026, pas une lecture du document entier. **À vérifier par le parent sur le PDF officiel** (le lien est dans le journal). Aucun choix ne repose sur une seule de ces phrases.

Extraits (« Mémoriser des faits numériques », CE1) :

- « Connaître les tables d'addition dans les deux sens » : retrouver « l'un des trois nombres d'une égalité du type A + B = C ou C = A + B, où A et B sont des nombres entiers compris entre 0 et 10 », quand les deux autres sont connus.
- Exemple de réussite : des égalités à trou « du type 4 + … = 12 ou 10 = 7 + … » ; à la fin du CE1, l'élève en complète douze en une minute.
- Les doubles : « les doubles des nombres de 1 à 15 », puis ceux de 20, 25, 30, 35, 40, 45 et 50 ; les moitiés des nombres pairs de 2 à 30.
- Calcul mental : « Trouver le complément d'un nombre à la dizaine supérieure, en utilisant les compléments à dix pour déterminer le nombre d'unités à ajouter » ; « Ajouter ou soustraire 20, 30, 40, 50, 60, 70, 80 ou 90 à un nombre » ; « Les procédures de calcul mental enseignées au CP sont utilisées tout au long du CE1 ».

Ce qu'on en tire :

1. **Les tables d'addition du CE1 vont jusqu'à 10 + 10 = 20**, pas seulement 9 + 9 = 18 (« A et B compris entre 0 et 10 »), et **dans les deux sens** : les formes à trou (« 4 + … = 12 ») font partie de l'attendu.
2. **Les doubles jusqu'à 15 + 15 = 30** sont des faits à connaître : c'est la seule partie des sommes de 21 à 30 que le programme demande de mémoriser.
3. **Les autres sommes jusqu'à 30** (17 + 8, 19 + 6) se **calculent** : complément à la dizaine supérieure, puis ce qui reste (le niveau 7 du calcul rapide, 38 + 5 = 38 + 2 + 3, qui couvre déjà ces sommes).

## 2. Ce que l'application fait déjà (avant le lot)

- **Additions** (module 2) : 45 faits jusqu'à 10, en 7 familles, avec révision espacée et formes à trou.
- **Calcul rapide** (module 3) : le niveau 7 (passer la dizaine en ajoutant, 11 à 89 plus 3 à 8) contient déjà toutes les sommes de 19 à 30 de la forme « nombre à deux chiffres + un chiffre » (17 + 8, 22 + 7…) ; le niveau 6 (+ 9) contient 19 + 9, 21 + 9 ; le niveau 4 (sans changer de dizaine) contient 21 + 5.
- **La table d'addition** à consulter (lot « Les leçons ») : déjà de 0 + 0 à 10 + 10.

## 3. La proposition

### Partage entre mémoriser et calculer

| Sommes | Comment | Où |
| --- | --- | --- |
| jusqu'à 10 | mémorisées (inchangé) | additions, familles 1 à 7 |
| **de 11 à 20, termes jusqu'à 10** (55 faits) | **mémorisées** : révision espacée, formes à trou | additions, **familles 8 à 12** (nouvelles) |
| **doubles de 11 à 15** (5 faits, 22 à 30) | **mémorisés** | additions, **famille 9** (avec les doubles de 6 à 10) |
| tous les faits jusqu'à 30 | revus ensemble | additions, **famille 13**, le grand mélange |
| les autres sommes jusqu'à 30 (17 + 8, 24 + 6…) | **calculées** : passer la dizaine | calcul rapide, niveaux 4, 6 et 7 (inchangés) |

C'est la proposition par défaut de `docs/LOTS.md`, **élargie** sur deux points, d'après le programme : les faits vont jusqu'à **10 + 10** (et non 9 + 9 : « A et B compris entre 0 et 10 ») ; les **doubles de 11 à 15** sont mémorisés (programme : « les doubles des nombres de 1 à 15 »). Les sommes de 19 à 30 par procédure ne demandent **aucun exercice nouveau** : le niveau 7 du calcul rapide les contient déjà, avec la même méthode (le cadre de 10 qui se complète, puis les ponts) ; les nouvelles familles en apportent les faits de base (8 + 5 = 13 est l'étape « unités » de 38 + 5). **Choix de la session, à revoir par le parent.**

### Les familles nouvelles du module 2

Ordre d'apprentissage : du plus simple (la numération, « dix et quatre, quatorze ») au plus difficile (passer la dizaine sans appui), en s'appuyant sur ce qui est su (les doubles d'abord, les presque-doubles ensuite, comme pour les familles 2 et 6).

| N° | Famille | Règle (faits pratiqués) | Faits nouveaux | Appui visuel | Leçon |
| --- | --- | --- | --- | --- | --- |
| 8 | dix et quelques | un terme vaut 10 (10 + 1 à 10 + 10, 1 + 10 à 9 + 10) | 19 | **deux boîtes de dix** : la première pleine, les unités dans la seconde | **L11 · Dix et encore** (nouvelle) |
| 9 | doubles jusqu'à 15 + 15 | 6 + 6 à 15 + 15 | 9 | le poisson et son reflet jusqu'à 10 + 10 (comme la famille 2) ; au-delà, le **grand double** : un filet de dix et ses unités, et leur reflet (13 + 13 = 20 + 6) | L4 si jamais vue |
| 10 | presque-doubles jusqu'à 10 | 5 + 6, 6 + 7, 7 + 8, 8 + 9, 9 + 10 et inverses | 8 | le double + 1 (comme la famille 6) ; chaque question rappelle le double | L4 si jamais vue |
| 11 | + 9 | 9 + 2 à 9 + 9 et inverses | 12 | **deux boîtes** : le 9, un poisson le complète, le reste dans la seconde | **L12 · Faire dix d'abord** (nouvelle) |
| 12 | passer la dizaine | les sommes de 11 à 16, termes de 3 à 8 | 12 | **deux boîtes** (8 + 5 : 8, puis 2 pour faire dix, puis 3) | L12 si jamais vue |
| 13 | grand mélange | tous les faits introduits, jusqu'à 30 | — | l'appui de la famille de chaque fait | — |

Soit **60 faits nouveaux** (le catalogue passe de 45 à 105 faits). Une première version avait une famille 13 « grands doubles » (11 + 11 à 15 + 15, 5 faits) et le grand mélange en 14 : la simulation l'a montrée trop petite (la part de la famille du jour tombait à 35 % : 5 faits ne remplissent pas une séance) ; les grands doubles ont rejoint la famille 9 (**choix de la session**, section 7).

- Un fait appartient à la première famille qui le contient (règle inchangée) : 10 + 10 est dans la famille 8, 9 + 10 aussi, 8 + 9 dans la famille 10. La pratique d'une famille porte sur tous les faits de sa règle (la famille 12 pratique aussi 6 + 6, 6 + 7, 7 + 8…).
- La famille 7 (le mélange jusqu'à 10) reste ce qu'elle est : elle mêle les faits jusqu'à 10. La famille en cours ne la reprend plus quand une famille plus haute est ouverte et pas acquise (règle inchangée : la plus basse famille ouverte, pas acquise, pas dépassée, hors mélanges) ; quand toutes sont acquises, c'est le grand mélange (13).
- **Ouverture, acquisition, stagnation, formes à trou** : les règles des familles 1 à 7 s'appliquent (au plus une famille ouverte par jour ; les formes à trou s'ouvrent pour une famille quand la moitié des faits de sa règle sont en boîte 3 ; acquise : 80 % de sa règle en boîte 3, sur deux jours au moins), avec **une règle de plus à partir de la famille 9** : une famille ne s'ouvre que si la dernière ouverte a 80 % de ses propres faits en boîte 2 ou plus (`familles2.ouverture.derniere`). Sans elle, la simulation ouvrait une famille nouvelle presque une séance d'additions sur deux, avant que la précédente soit travaillée (section 7). Toutes les valeurs restent dans `module2.json`.
- **Appuis** : les deux appuis nouveaux (les deux boîtes de dix, le grand double) réutilisent les pièces déjà dessinées (le cadre de 10 et les poissons des aides, le filet de dix poissons de L2, le reflet de la famille 2). Aucun personnage nouveau ; seules les vignettes des familles 8 à 13 et des leçons L11 et L12 sont nouvelles, dessinées dans l'atelier avec ces mêmes pièces.
- **Crans** : ceux des familles 1, 2 et 6 (tableau « Les crans en notion du jour », section 6 de `docs/SPEC.md`), sans changement.

### Les leçons nouvelles (suivies de leur exercice)

| Leçon | Exercice associé | Ce qu'elle montre |
| --- | --- | --- |
| **L11 · Dix et encore** | additions, famille 8 | une boîte de dix pleine, quatre poissons dans une seconde boîte : « dix et quatre, quatorze » ; quatre plus dix, pareil ; dix plus dix, vingt |
| **L12 · Faire dix d'abord** | additions, famille 11 | 8 + 5 : huit poissons dans la boîte, deux sautent pour la remplir (dix), il en reste trois : treize ; puis 9 + 4 (un seul saute) |

Elles entrent dans le menu des leçons, rangée des additions (4, 5, 6, **11, 12**), avec leur vignette du moment clé (11 : la boîte pleine et quatre poissons ; 12 : la boîte complétée par deux poissons dorés) et leur bulle « À toi ! ». **Leur numéro** : L11 et L12 étaient réservés dans `docs/SPEC.md`, section 13, à des leçons pas encore construites (pair et impair, la moitié) ; elles prennent ces numéros, les leçons à venir prendront les suivants (**choix de la session** : le numéro est ce que l'enfant voit en grand, il vaut mieux qu'il se suive).

### L'échauffement et le défi record

- **Échauffement** : aucune règle nouvelle ; il pose les faits des familles ouvertes (dus d'abord, 3 places pour les faits nouveaux). Les faits nouveaux jusqu'à 20 y entrent donc d'eux-mêmes quand leur famille s'ouvre ; une famille peut s'ouvrir par l'échauffement comme aujourd'hui. Le pavé accepte déjà deux chiffres.
- **Défi record** : il pose les faits en boîte 3 ou plus ; les grands faits y entrent quand ils sont sus. Les scores restent comparés au seul record de l'enfant ; un défi avec des sommes jusqu'à 20 est plus lent : **le record ne change pas de règle** (choix de la session). À observer : un record qui ne se bat plus pendant des semaines.
- **Rotation de « jouer »** : « le moins avancé » compte maintenant les familles acquises sur 13 au lieu de 7 ; une enfant qui avait fini les 7 familles revient à 50 % : les additions reviennent plus souvent dans « jouer » tant que les familles nouvelles ne sont pas acquises. C'est voulu (le programme du CE1 est là).

### Ce qui change ailleurs

- **L'écran « choisir »** : 13 tuiles de familles au lieu de 7 (4 rangées, comme les 13 niveaux de la ligne), chacune avec son numéro en grand et la vignette de son appui.
- **La table d'addition** : inchangée (0 + 0 à 10 + 10) ; au toucher d'une case dont la somme dépasse 10, l'appui montré est toujours celui des deux boîtes (le reflet et le double + 1 faisaient, dans le panneau, une rangée de poissons trop petite pour 9 + 9 ou 7 + 8 : vu sur les captures).
- **Espace parent** : les familles 8 à 13 dans la progression (ouverture, faits bien sus, acquise, formes à trou) ; la grille des additions (11 × 11) montre jusqu'à 10 + 10 avec les faits nouveaux colorés ; les grands doubles (11 + 11 à 15 + 15) sont listés sous la grille. Point de départ : familles connues 1 à 13.
- **Légende des niveaux** : une ligne par famille nouvelle, une par leçon nouvelle.

## 4. Codes d'erreur

Ceux des additions, inchangés (« se trompe de 1 », « a répondu l'un des deux nombres », « a fait une soustraction », « autre »), plus un nouveau, propre aux sommes au-delà de 10 : **« a oublié la dizaine »** (7 + 6 → 3 : seules les unités sont données ; 8 + 5 → 3 reste classé « a fait une soustraction », 8 − 5 = 3, comme avant). **Choix de la session**, à revoir.

## 5. Simulation de l'année et séquences

`tests/sim-seances.mjs`, section « sommes jusqu'à 30 » (étendue pour le lot : les faits au-delà de 10 sont plus lents et moins sus au départ, ils s'apprennent à chaque bonne réponse), sur l'année scolaire (jusqu'au 2 juillet 2027), seed 7, **multiplication comprise** (elle entre dans la rotation le 4 janvier 2027) :

| Profil | Séances/sem. | Familles 8 à 13 : séance d'ouverture / d'acquisition | Faits au-delà de 10 en boîte 3 à la fin (sur 60) |
| --- | --- | --- | --- |
| l'évaluation (« réel ») | 2 | 8 : 16/35 · 9 : 18/53 · 10 : 47/55 · 11 : 53/61 · 12 : 59/— · 13 : jamais ouverte | 36 |
| l'évaluation | 5 | 8 : 10/16 · 9 : 15/17 · 10 : 21/28 · 11 : 27/32 · 12 : 31/45 · 13 : 40/42 | 54 |
| sait déjà | 2 | toutes ouvertes de la séance 9 à 20, acquises de 12 à 21 | 56 |
| en difficulté | 2 | aucune (elle travaille encore les familles 1 à 7 à la fin de l'année, comme avant le lot) | 0 |
| choisit « très dur » | 2 | 8 : 16/28 · 9 : 28/56 · 10 : 42/52 · 11 : 50/54 · 12 : 52/— | 39 |
| choisit « plus facile » | 2 | 8 ouverte à la séance 34, rien d'acquis (au cran « plus facile », rien ne monte, règle d'avant le lot) | 8 |

Séquences lues : `tests/recette-fonctionnelle/b-sequences.mjs --test` (52 combinaisons, 208 séances, aucune en défaut), et les séances du profil « réel » une à une (`node tests/sim-seances.mjs reel 2 annee`).

## 6. Phrases nouvelles

**384 phrases** (liste : `PHRASES.md`), environ **2,7 Mo** (7,1 Ko par phrase, la moyenne des phrases déjà fabriquées) : les 60 faits nouveaux sous leurs trois formes et leur correction (284), les appuis dits (69), les leçons L11 et L12 (20), les noms (6) et les rappels du double (10).

## 7. Résultats et défauts corrigés

La simulation a montré cinq défauts, corrigés avant le code définitif :

1. **Les familles s'ouvraient trop vite** (une séance d'additions sur deux, de la séance 16 à 30, avant que la précédente soit travaillée) : règle « la dernière famille ouverte d'abord à 80 % en boîte 2 » (section 3).
2. **La famille des grands doubles était trop petite** (5 faits : la part de la famille du jour tombait à 35 %) : fondue dans la famille 9, les doubles de 6 + 6 à 15 + 15.
3. **Le profil n'apprenait jamais un fait nouveau** (défaut de la simulation, pas de l'application) : chaque bonne réponse rend un fait un peu mieux su.
4. **Dans la table d'addition**, le reflet et le double + 1 faisaient une rangée de poissons trop petite au-delà de 10 : les deux boîtes pour toute somme au-delà de 10.
5. **L'appui des deux boîtes touchait le bas de l'écran** : remonté (son haut à 350).

À 2 séances par semaine, l'enfant du profil de l'évaluation ouvre les familles 8 à 12 dans l'année et sait 36 des 60 faits nouveaux en fin d'année ; la famille 12 (passer la dizaine) n'est pas acquise et le grand mélange n'est pas atteint. C'est moins qu'avant l'arrivée de la multiplication dans la rotation (sans elle, toutes les familles étaient acquises vers la 64e séance) : à partir de janvier, la multiplication prend une séance sur sept environ. À 5 séances par semaine, tout est acquis à la 45e séance. Le défi record se bat moins souvent après le premier trimestre (les faits jusqu'à 20 sont plus lents) : à observer.

## 8. Questions qui restaient ouvertes, et le choix fait

Tous **choix de la session, à revoir par le parent** (aussi dans `docs/JOURNAL-CONCEPTION.md`) :

| Question | Choix fait | Pourquoi |
| --- | --- | --- |
| Jusqu'où mémoriser ? | les faits jusqu'à 10 + 10, et les doubles jusqu'à 15 + 15 ; le reste se calcule | programme : « A et B compris entre 0 et 10 », « les doubles des nombres de 1 à 15 » |
| Exercice nouveau pour les sommes de 19 à 30 ? | aucun : le calcul rapide (niveaux 4, 6, 7) les contient déjà | même méthode, déjà construite |
| Numéros des leçons nouvelles | L11 et L12 (les leçons « pair et impair » et « la moitié », pas encore construites, prendront les suivants) | le numéro est ce que l'enfant voit en grand |
| Un code d'erreur nouveau | « a oublié la dizaine » | l'erreur typique au-delà de 10 |
| Le défi record | règles inchangées | à observer : un record qui ne se bat plus |
| Les grands doubles | dans la famille 9, avec un appui à part (le grand double) | simulation (section 7) |
| L'ouverture des familles 9 à 13 | la dernière ouverte d'abord à 80 % en boîte 2 | simulation (section 7) |
