# Mesures des séances d'additions (lot « Correctifs de la confrontation 2 »)

`node tests/recette-fonctionnelle/mesure-additions.mjs [--detail] [--essai cle=valeur]` : l'année simulée (moteur de l'application, `tests/sim-recette.mjs`, graine 7), les séances « jouer » dont la notion du jour est les additions. Colonnes : nombre de séances d'additions ; durée de la séance (moyenne, min – max, nombre sous 9 min) ; durée de la notion du jour ; part des questions sur la famille en cours ; faits nouveaux par séance (toutes séances).

## Avant (`main`, 46174df8)

| profil | rythme | séances d'additions | durée moyenne (min) | durée min – max | sous 9 min | notion du jour moyenne (min) | part de la famille : moyenne, min | faits nouveaux : moyenne, max | séances à plus de 8 faits nouveaux |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2/sem | 24 | 9.0 | 7.5 – 10.2 | 10 | 5.4 | 78 %, 62 % | 1.6, 15 | 2 |
| reel | 3/sem | 33 | 9.4 | 6.0 – 10.7 | 4 | 5.9 | 91 %, 69 % | 1.1, 15 | 2 |
| sait | 2/sem | 20 | 9.2 | 6.7 – 10.3 | 4 | 5.8 | 94 %, 75 % | 1.6, 17 | 4 |
| sait | 3/sem | 35 | 9.2 | 6.9 – 9.8 | 2 | 6.0 | 96 %, 70 % | 1.1, 17 | 3 |
| diff | 2/sem | 32 | 8.7 | 5.1 – 10.8 | 16 | 5.1 | 76 %, 36 % | 0.5, 8 | 0 |
| diff | 3/sem | 48 | 8.9 | 5.3 – 10.9 | 22 | 5.3 | 80 %, 36 % | 0.4, 8 | 0 |

## Après (les décisions telles qu’écrites : révisions si la famille est épuisée avant la moitié de l’étape ; plafond de 8, puis révisions à tout moment)

| profil | rythme | séances d'additions | durée moyenne (min) | durée min – max | sous 9 min | notion du jour moyenne (min) | part de la famille : moyenne, min | faits nouveaux : moyenne, max | séances à plus de 8 faits nouveaux |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2/sem | 22 | 8.3 | 6.2 – 10.4 | 13 | 4.8 | 75 %, 24 % | 1.5, 8 | 0 |
| reel | 3/sem | 35 | 9.5 | 6.2 – 10.9 | 5 | 5.9 | 88 %, 73 % | 1.1, 8 | 0 |
| sait | 2/sem | 21 | 9.3 | 5.8 – 10.0 | 2 | 5.9 | 86 %, 15 % | 1.6, 8 | 0 |
| sait | 3/sem | 36 | 9.3 | 5.8 – 10.2 | 3 | 5.9 | 93 %, 15 % | 1.1, 8 | 0 |
| diff | 2/sem | 32 | 9.3 | 6.7 – 11.0 | 12 | 5.5 | 69 %, 8 % | 0.6, 8 | 0 |
| diff | 3/sem | 48 | 9.4 | 6.1 – 11.3 | 15 | 5.7 | 80 %, 13 % | 0.4, 8 | 0 |

## Essais (profils reel et diff, 2 séances par semaine)

### essai : notion.nouveauxMaxException = 99

| profil | rythme | séances d'additions | durée moyenne (min) | durée min – max | sous 9 min | notion du jour moyenne (min) | part de la famille : moyenne, min | faits nouveaux : moyenne, max | séances à plus de 8 faits nouveaux |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2/sem | 24 | 9.0 | 7.5 – 10.2 | 10 | 5.4 | 78 %, 63 % | 1.4, 15 | 2 |
| diff | 2/sem | 32 | 9.3 | 6.7 – 11.0 | 12 | 5.5 | 69 %, 8 % | 0.6, 8 | 0 |

### essai : notion.revisionsAvantPart = 1

| profil | rythme | séances d'additions | durée moyenne (min) | durée min – max | sous 9 min | notion du jour moyenne (min) | part de la famille : moyenne, min | faits nouveaux : moyenne, max | séances à plus de 8 faits nouveaux |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2/sem | 20 | 9.6 | 6.2 – 10.7 | 2 | 6.0 | 60 %, 24 % | 1.5, 8 | 0 |
| diff | 2/sem | 32 | 9.7 | 7.3 – 11.0 | 6 | 6.2 | 64 %, 8 % | 0.6, 8 | 0 |

### essai : notion.revisionsFamilleEpuisee = false

| profil | rythme | séances d'additions | durée moyenne (min) | durée min – max | sous 9 min | notion du jour moyenne (min) | part de la famille : moyenne, min | faits nouveaux : moyenne, max | séances à plus de 8 faits nouveaux |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2/sem | 22 | 8.5 | 4.9 – 10.4 | 13 | 5.0 | 78 %, 68 % | 1.5, 8 | 0 |
| diff | 2/sem | 32 | 8.5 | 5.1 – 10.6 | 15 | 4.9 | 76 %, 40 % | 0.6, 8 | 0 |


## La grille demandée par le parent (3 novembre 2026, le soir) : plafond et moment des révisions

Réponse du parent à la question posée à l'arrêt : essayer en simulation le plafond des faits nouveaux à 10, à 12 et sans plafond, et les révisions seulement avant la moitié de l'étape ou à tout moment (une fois la famille épuisée ou le plafond atteint) ; profils `reel` et `diff`, 2 et 3 séances par semaine, une année ; choisir selon quatre critères, dans cet ordre : (1) la progression dans les familles pas plus lente qu'avant le lot (chaque famille ouverte et dépassée au plus une séance plus tard ; plus de famille bloquée pendant des semaines) ; (2) au plus 10 faits nouveaux par séance ; (3) la durée moyenne des séances d'additions d'au moins 9 minutes, le moins possible sous 7 minutes ; (4) la part de la famille du jour la plus haute possible, au moins 70 % en moyenne.

Outil : `node tests/recette-fonctionnelle/grille-additions.mjs --combos grille --graines 1,2,3,7 --json …` (sur la branche), le même outil sur une copie de `main` (46174df8) pour la base, puis `--reunir … --base … --synthese`. Les données : `grille-main.json` et `grille-branche.json` (ce dossier). « Dépassée » : acquise ou passée par la stagnation. Le **témoin** est le code du lot sans les deux règles (pas de révisions, pas de plafond) : il mesure ce qui, dans l'écart à `main`, vient des autres changements du lot (6.12, 7 ter, 3.8 : ils changent les séances des autres exercices, donc le tirage au hasard de toute la suite de l'année), et non des règles essayées.

### Synthèse : 4 graines (1, 2, 3, 7) × 4 cas (reel et diff, 2 et 3 séances par semaine)

Colonne (1), « bien plus longtemps » : les cas où une famille reste la famille en cours plus de 4 séances (environ deux semaines) de plus que la plus longue sur `main`.

| combinaison | cas | (1) retard ≤ 1 séance | (1) retard médian, le plus grand | (1) famille en cours bien plus longtemps que sur `main` | (2) faits nouveaux, max | (3) durée moyenne (min) | (3) séances sous 7 min | (4) part de la famille : moyenne, cas le plus bas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| avant le lot (main) | 16 | 16 | 0, 0 | 0 | 16 | 8.8 | 64 | 80 %, 70 % |
| témoin (le lot sans les règles 2.6 et 6.10) | 16 | 6 | 4, 25 | 4 | 16 | 8.7 | 80 | 79 %, 68 % |
| plafond 10, révisions avant la moitié | 16 | 4 | 6, 25 | 2 | 10 | 9.1 | 34 | 77 %, 52 % |
| plafond 10, révisions à tout moment | 16 | 5 | 4, 21 | 1 | 10 | 9.8 | 10 | 68 %, 49 % |
| plafond 12, révisions avant la moitié | 16 | 4 | 8, 25 | 4 | 12 | 9.1 | 31 | 75 %, 52 % |
| plafond 12, révisions à tout moment | 16 | 5 | 6, 30 | 2 | 12 | 9.8 | 4 | 68 %, 49 % |
| sans plafond, révisions avant la moitié | 16 | 4 | 6, 20 | 3 | 16 | 9.2 | 23 | 74 %, 52 % |
| sans plafond, révisions à tout moment | 16 | 4 | 10, 30 | 4 | 16 | 9.8 | 2 | 68 %, 50 % |

### Le détail, graine 7

| combinaison | profil | rythme | retard le plus grand sur `main` (séances) | famille en cours le plus longtemps (séances) | faits nouveaux : max, séances à plus de 10 | séances d'additions | durée moyenne (min) | sous 7 min | sous 9 min | part de la famille : moyenne, min |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| avant le lot (main) | reel | 2/sem | 0 | 17 (famille 8) | 15, 2 | 24 | 9.0 | 0 | 10 | 78 %, 62 % |
| avant le lot (main) | reel | 3/sem | 0 | 18 (famille 11) | 15, 2 | 33 | 9.4 | 2 | 4 | 91 %, 69 % |
| avant le lot (main) | diff | 2/sem | 0 | 32 (famille 3) | 8, 0 | 32 | 8.7 | 3 | 16 | 76 %, 36 % |
| avant le lot (main) | diff | 3/sem | 0 | 25 (famille 7) | 8, 0 | 48 | 8.9 | 3 | 22 | 80 %, 36 % |
| témoin (le lot sans les règles 2.6 et 6.10) | reel | 2/sem | 6 : famille 10 dépassée séance 54 (avant : 48) | 21 (famille 8) | 15, 2 | 24 | 9.0 | 0 | 10 | 78 %, 63 % |
| témoin (le lot sans les règles 2.6 et 6.10) | reel | 3/sem | 11 : famille 11 dépassée séance 58 (avant : 47) | 29 (famille 11) | 15, 2 | 35 | 9.4 | 2 | 4 | 89 %, 69 % |
| témoin (le lot sans les règles 2.6 et 6.10) | diff | 2/sem | 0 | 32 (famille 3) | 8, 0 | 32 | 8.5 | 6 | 15 | 76 %, 40 % |
| témoin (le lot sans les règles 2.6 et 6.10) | diff | 3/sem | 0 | 27 (famille 7) | 8, 0 | 48 | 7.6 | 15 | 32 | 75 %, 47 % |
| plafond 10, révisions avant la moitié | reel | 2/sem | 6 : famille 10 dépassée séance 54 (avant : 48) | 23 (famille 9) | 10, 0 | 24 | 8.7 | 2 | 11 | 77 %, 56 % |
| plafond 10, révisions avant la moitié | reel | 3/sem | 15 : famille 13 dépassée séance 71 (avant : 56) | 26 (famille 11) | 10, 0 | 34 | 9.4 | 2 | 4 | 88 %, 71 % |
| plafond 10, révisions avant la moitié | diff | 2/sem | 0 | 32 (famille 3) | 8, 0 | 32 | 9.3 | 2 | 12 | 69 %, 8 % |
| plafond 10, révisions avant la moitié | diff | 3/sem | 6 : famille 3 ouverte séance 24 (avant : 18) | 25 (famille 7) | 8, 0 | 48 | 9.4 | 3 | 15 | 80 %, 13 % |
| plafond 10, révisions à tout moment | reel | 2/sem | 0 | 19 (famille 8) | 10, 0 | 17 | 9.6 | 1 | 2 | 73 %, 30 % |
| plafond 10, révisions à tout moment | reel | 3/sem | 2 : famille 7 ouverte séance 9 (avant : 7) | 25 (famille 12) | 10, 0 | 36 | 9.6 | 1 | 2 | 88 %, 31 % |
| plafond 10, révisions à tout moment | diff | 2/sem | 0 | 26 (famille 3) | 8, 0 | 32 | 9.7 | 0 | 6 | 64 %, 8 % |
| plafond 10, révisions à tout moment | diff | 3/sem | 6 : famille 3 ouverte séance 24 (avant : 18) | 25 (famille 7) | 8, 0 | 48 | 10.2 | 0 | 4 | 76 %, 13 % |
| plafond 12, révisions avant la moitié | reel | 2/sem | 10 : famille 11 ouverte séance 56 (avant : 46) | 21 (famille 8) | 12, 1 | 21 | 8.3 | 1 | 14 | 77 %, 64 % |
| plafond 12, révisions avant la moitié | reel | 3/sem | 17 : famille 10 dépassée séance 41 (avant : 24) | 21 (famille 10) | 12, 1 | 31 | 9.6 | 0 | 3 | 89 %, 29 % |
| plafond 12, révisions avant la moitié | diff | 2/sem | 0 | 32 (famille 3) | 8, 0 | 32 | 9.3 | 2 | 12 | 69 %, 8 % |
| plafond 12, révisions avant la moitié | diff | 3/sem | 6 : famille 3 ouverte séance 24 (avant : 18) | 25 (famille 7) | 8, 0 | 48 | 9.4 | 3 | 15 | 80 %, 13 % |
| plafond 12, révisions à tout moment | reel | 2/sem | 5 : famille 3 dépassée séance 16 (avant : 11) | 20 (famille 8) | 12, 2 | 24 | 9.6 | 0 | 2 | 66 %, 30 % |
| plafond 12, révisions à tout moment | reel | 3/sem | 30 : famille 10 dépassée séance 54 (avant : 24) | 29 (famille 10) | 12, 1 | 37 | 9.8 | 0 | 1 | 80 %, 29 % |
| plafond 12, révisions à tout moment | diff | 2/sem | 0 | 26 (famille 3) | 8, 0 | 32 | 9.7 | 0 | 6 | 64 %, 8 % |
| plafond 12, révisions à tout moment | diff | 3/sem | 6 : famille 3 ouverte séance 24 (avant : 18) | 25 (famille 7) | 8, 0 | 48 | 10.2 | 0 | 4 | 76 %, 13 % |
| sans plafond, révisions avant la moitié | reel | 2/sem | 6 : famille 10 dépassée séance 54 (avant : 48) | 21 (famille 8) | 15, 2 | 24 | 9.0 | 0 | 10 | 78 %, 63 % |
| sans plafond, révisions avant la moitié | reel | 3/sem | 19 : famille 9 dépassée séance 41 (avant : 22) | 29 (famille 11) | 15, 1 | 35 | 9.4 | 2 | 6 | 86 %, 21 % |
| sans plafond, révisions avant la moitié | diff | 2/sem | 0 | 32 (famille 3) | 8, 0 | 32 | 9.3 | 2 | 12 | 69 %, 8 % |
| sans plafond, révisions avant la moitié | diff | 3/sem | 6 : famille 3 ouverte séance 24 (avant : 18) | 25 (famille 7) | 8, 0 | 48 | 9.4 | 3 | 15 | 80 %, 13 % |
| sans plafond, révisions à tout moment | reel | 2/sem | 10 : famille 9 dépassée séance 48 (avant : 38) | 25 (famille 8) | 15, 1 | 24 | 9.9 | 0 | 2 | 67 %, 49 % |
| sans plafond, révisions à tout moment | reel | 3/sem | 30 : famille 10 dépassée séance 54 (avant : 24) | 28 (famille 10) | 15, 2 | 37 | 9.7 | 0 | 2 | 79 %, 22 % |
| sans plafond, révisions à tout moment | diff | 2/sem | 0 | 26 (famille 3) | 8, 0 | 32 | 9.7 | 0 | 6 | 64 %, 8 % |
| sans plafond, révisions à tout moment | diff | 3/sem | 6 : famille 3 ouverte séance 24 (avant : 18) | 25 (famille 7) | 8, 0 | 48 | 10.2 | 0 | 4 | 76 %, 13 % |

### Le choix : plafond de 10, révisions à tout moment

- **Critère 1 (progression)** : aucune combinaison ne le tient au sens strict ; **le témoin non plus** (6 cas sur 16 seulement à une séance de retard au plus, retard médian 4 séances, jusqu'à 25) : à une séance près, la mesure est plus fine que le hasard de la simulation, que les autres changements du lot suffisent à déplacer. Comparée au témoin, la combinaison retenue ne ralentit pas les familles : même retard médian (4), le plus grand retard plus petit (21 contre 25), un seul cas de famille gardée bien plus longtemps (4 pour le témoin) ; c'est la meilleure des six sur ce critère (les cinq autres : retard médian 6 à 10, plus grand retard 20 à 30, 2 à 4 cas). La famille 3 de la séance 7 à la séance 30 (plafond de 8) ne se retrouve pas.
- **Critère 2** : 10 faits nouveaux au plus par séance (16 sur `main`), tenu.
- **Critère 3** : 9,8 minutes en moyenne (9,7 à 10,0 selon le profil et le rythme ; 8,8 sur `main`), 10 séances sous 7 minutes sur 526 (64 sur `main`), tenu. « Avant la moitié » laisse 23 à 34 séances sous 7 minutes, quel que soit le plafond.
- **Critère 4 : pas tenu** : 68 % de questions sur la famille du jour en moyenne (`main` : 80 %), 86 % pour le profil de l'évaluation à 3 séances par semaine, mais 59 à 66 % pour l'enfant en difficulté et pour le profil de l'évaluation à 2 séances par semaine. C'est la contrepartie de la durée : le temps gagné est fait de révisions d'autres familles, qui ne comptent pas dans la part. Toutes les combinaisons « à tout moment » sont à 68 % ; « avant la moitié » garde 74 à 77 %, mais pas le critère 3.

## Après : la règle retenue (plafond de 10, révisions à tout moment), graine 7, les trois profils

| profil | rythme | séances d'additions | durée moyenne (min) | durée min – max | sous 9 min | notion du jour moyenne (min) | part de la famille : moyenne, min | faits nouveaux : moyenne, max | séances à plus de 8 faits nouveaux |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2/sem | 17 | 9.6 | 6.9 – 10.4 | 2 | 6.0 | 73 %, 30 % | 1.6, 10 | 3 |
| reel | 3/sem | 36 | 9.6 | 6.9 – 10.5 | 2 | 6.0 | 88 %, 31 % | 1.1, 10 | 3 |
| sait | 2/sem | 21 | 9.3 | 6.0 – 9.9 | 2 | 5.9 | 87 %, 30 % | 1.6, 10 | 4 |
| sait | 3/sem | 37 | 9.3 | 6.0 – 10.0 | 2 | 6.0 | 92 %, 29 % | 1.1, 10 | 4 |
| diff | 2/sem | 32 | 9.7 | 7.3 – 11.0 | 6 | 6.2 | 64 %, 8 % | 0.6, 8 | 0 |
| diff | 3/sem | 48 | 10.2 | 7.3 – 11.3 | 4 | 6.2 | 76 %, 13 % | 0.4, 8 | 0 |
