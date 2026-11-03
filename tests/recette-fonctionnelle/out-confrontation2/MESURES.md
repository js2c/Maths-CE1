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

