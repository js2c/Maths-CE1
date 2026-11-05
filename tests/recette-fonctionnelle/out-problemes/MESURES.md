# Mesures du lot « Problèmes »

L'année simulée (du 28 septembre 2026 au 2 juillet 2027, `tests/sim-recette.mjs`, graine 7), le moteur de l'application avec le modèle de durée et de réussite d'un problème décrit dans `docs/JOURNAL-CONCEPTION.md` (lot « Problèmes », choix 13 : des hypothèses). « Avant le lot » : le même code, l'étape fixe désactivée (la notion du jour garde ses 6 minutes). Outils : `node tests/recette-fonctionnelle/mesure-problemes.mjs --problemes 1,2 --avant` (données : `mesures.json`), `node tests/sim-boutique.mjs` (données : `boutique.json`).

## L'étape fixe, la durée des séances, les étoiles

« Étape sautée » : les séances « jouer » où elle n'a pas eu lieu faute de temps (la fiche demande de s'arrêter au-delà d'une sur vingt). Les profils `facile` et `tresdur` sont le profil de l'évaluation qui choisit toujours ce cran.

| profil | rythme | problèmes par soir | étape sautée | durée de l’étape (s) | problèmes par étape | séance (min), sous 9 min | notion du jour (min) | additions (min), sous 9 min | étoiles de mer par séance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2/sem | avant le lot | - | - | - | 9,8, 5/64 | 6,2 | 9,6, 2/17 | 58,3 |
| reel | 2/sem | 1 au plus | 0 sur 64 | 31,1 | 1,0 | 8,8, 42/64 | 4,7 | 8,6, 17/22 | 54,4 |
| reel | 2/sem | 2 au plus | 0 sur 64 | 57,9 | 1,7 | 9,4, 8/64 | 4,9 | 9,1, 3/12 | 51,9 |
| reel | 3/sem | avant le lot | - | - | - | 9,8, 5/96 | 6,1 | 9,6, 2/36 | 61,9 |
| reel | 3/sem | 1 au plus | 0 sur 96 | 33,1 | 1,0 | 8,9, 53/96 | 4,8 | 8,8, 20/29 | 54,0 |
| reel | 3/sem | 2 au plus | 0 sur 96 | 61,0 | 1,8 | 9,4, 10/96 | 4,8 | 9,3, 5/28 | 55,2 |
| reel | 5/sem | avant le lot | - | - | - | 9,7, 5/160 | 6,1 | 9,6, 2/61 | 61,8 |
| reel | 5/sem | 1 au plus | 0 sur 160 | 35,7 | 1,0 | 8,9, 90/160 | 4,7 | 8,8, 37/61 | 55,9 |
| reel | 5/sem | 2 au plus | 0 sur 160 | 62,6 | 1,9 | 9,3, 35/160 | 4,7 | 9,2, 16/56 | 55,8 |
| sait | 2/sem | avant le lot | - | - | - | 9,4, 5/64 | 6,0 | 9,3, 2/21 | 69,0 |
| sait | 2/sem | 1 au plus | 0 sur 64 | 29,7 | 1,0 | 8,5, 57/64 | 4,6 | 8,4, 17/19 | 62,6 |
| sait | 2/sem | 2 au plus | 0 sur 64 | 59,2 | 1,9 | 8,9, 30/64 | 4,6 | 8,8, 7/18 | 63,3 |
| sait | 3/sem | avant le lot | - | - | - | 9,4, 5/96 | 6,0 | 9,3, 2/37 | 69,9 |
| sait | 3/sem | 1 au plus | 0 sur 96 | 32,0 | 1,0 | 8,4, 90/96 | 4,6 | 8,3, 32/32 | 62,5 |
| sait | 3/sem | 2 au plus | 0 sur 96 | 60,9 | 2,0 | 8,9, 57/96 | 4,6 | 8,9, 21/34 | 64,2 |
| sait | 5/sem | avant le lot | - | - | - | 9,3, 5/160 | 6,0 | 9,2, 2/68 | 70,6 |
| sait | 5/sem | 1 au plus | 0 sur 160 | 32,4 | 1,0 | 8,3, 155/160 | 4,6 | 8,4, 65/66 | 64,0 |
| sait | 5/sem | 2 au plus | 0 sur 160 | 61,8 | 2,0 | 8,8, 113/160 | 4,6 | 8,8, 46/66 | 64,5 |
| diff | 2/sem | avant le lot | - | - | - | 9,8, 14/64 | 6,3 | 9,7, 6/32 | 49,3 |
| diff | 2/sem | 1 au plus | 0 sur 64 | 32,0 | 1,0 | 8,7, 37/64 | 4,8 | 8,7, 19/32 | 43,9 |
| diff | 2/sem | 2 au plus | 0 sur 64 | 60,8 | 1,8 | 9,3, 23/64 | 4,9 | 9,4, 9/32 | 44,1 |
| diff | 3/sem | avant le lot | - | - | - | 10,2, 10/96 | 6,3 | 10,2, 4/48 | 50,8 |
| diff | 3/sem | 1 au plus | 0 sur 96 | 34,5 | 1,0 | 9,2, 34/96 | 4,8 | 9,2, 16/48 | 45,6 |
| diff | 3/sem | 2 au plus | 0 sur 96 | 58,1 | 1,7 | 9,4, 25/96 | 4,8 | 9,5, 11/48 | 45,4 |
| diff | 5/sem | avant le lot | - | - | - | 10,1, 15/160 | 6,3 | 10,1, 7/80 | 52,6 |
| diff | 5/sem | 1 au plus | 0 sur 160 | 34,6 | 1,0 | 9,2, 42/160 | 4,8 | 9,3, 17/80 | 47,6 |
| diff | 5/sem | 2 au plus | 0 sur 160 | 61,9 | 1,7 | 9,6, 36/160 | 4,8 | 9,6, 17/80 | 47,1 |
| facile | 2/sem | avant le lot | - | - | - | 9,6, 5/64 | 6,0 | 8,0, 2/4 | 39,4 |
| facile | 2/sem | 2 au plus | 0 sur 64 | 63,6 | 2,0 | 9,2, 8/64 | 4,5 | 8,0, 2/3 | 36,7 |
| tresdur | 2/sem | avant le lot | - | - | - | 9,8, 5/64 | 6,2 | 9,8, 2/27 | 103,4 |
| tresdur | 2/sem | 2 au plus | 0 sur 64 | 61,4 | 1,8 | 9,5, 9/64 | 4,8 | 9,3, 5/22 | 84,9 |

| profil | rythme | problèmes par soir | semaine où chaque niveau est acquis (2 à 9) | niveau en fin d’année |
| --- | --- | --- | --- | --- |
| reel | 2/sem | 1 au plus | 2 : s. 7 · 3 : s. 12 · 4 : s. 19 · 5 : s. 26 · 6 : s. 33 · 7 : s. 38 · 8 : — · 9 : — | 8 |
| reel | 2/sem | 2 au plus | 2 : s. 3 · 3 : s. 7 · 4 : s. 10 · 5 : s. 16 · 6 : s. 25 · 7 : s. 34 · 8 : — · 9 : — | 8 |
| reel | 3/sem | 1 au plus | 2 : s. 8 · 3 : s. 11 · 4 : s. 18 · 5 : s. 23 · 6 : s. 34 · 7 : s. 39 · 8 : — · 9 : — | 8 |
| reel | 3/sem | 2 au plus | 2 : s. 2 · 3 : s. 6 · 4 : s. 8 · 5 : s. 12 · 6 : s. 17 · 7 : s. 23 · 8 : s. 27 · 9 : s. 32 | 9 |
| reel | 5/sem | 1 au plus | 2 : s. 2 · 3 : s. 7 · 4 : s. 10 · 5 : s. 12 · 6 : s. 17 · 7 : s. 19 · 8 : s. 26 · 9 : s. 31 | 9 |
| reel | 5/sem | 2 au plus | 2 : s. 1 · 3 : s. 3 · 4 : s. 6 · 5 : s. 8 · 6 : s. 9 · 7 : s. 10 · 8 : s. 12 · 9 : s. 16 | 9 |
| sait | 2/sem | 1 au plus | 2 : s. 7 · 3 : s. 12 · 4 : s. 19 · 5 : s. 26 · 6 : s. 33 · 7 : s. 38 · 8 : — · 9 : — | 8 |
| sait | 2/sem | 2 au plus | 2 : s. 3 · 3 : s. 8 · 4 : s. 10 · 5 : s. 15 · 6 : s. 18 · 7 : s. 23 · 8 : s. 27 · 9 : s. 31 | 9 |
| sait | 3/sem | 1 au plus | 2 : s. 6 · 3 : s. 9 · 4 : s. 12 · 5 : s. 18 · 6 : s. 23 · 7 : s. 27 · 8 : s. 32 · 9 : s. 35 | 9 |
| sait | 3/sem | 2 au plus | 2 : s. 2 · 3 : s. 6 · 4 : s. 8 · 5 : s. 9 · 6 : s. 11 · 7 : s. 15 · 8 : s. 16 · 9 : s. 18 | 9 |
| sait | 5/sem | 1 au plus | 2 : s. 2 · 3 : s. 6 · 4 : s. 8 · 5 : s. 10 · 6 : s. 12 · 7 : s. 16 · 8 : s. 18 · 9 : s. 22 | 9 |
| sait | 5/sem | 2 au plus | 2 : s. 1 · 3 : s. 3 · 4 : s. 6 · 5 : s. 7 · 6 : s. 8 · 7 : s. 9 · 8 : s. 10 · 9 : s. 11 | 9 |
| diff | 2/sem | 1 au plus | 2 : s. 7 · 3 : s. 12 · 4 : s. 19 · 5 : — · 6 : — · 7 : — · 8 : — · 9 : — | 5 |
| diff | 2/sem | 2 au plus | 2 : s. 3 · 3 : s. 10 · 4 : s. 18 · 5 : s. 26 · 6 : s. 32 · 7 : — · 8 : — · 9 : — | 7 |
| diff | 3/sem | 1 au plus | 2 : s. 6 · 3 : s. 11 · 4 : s. 30 · 5 : s. 38 · 6 : — · 7 : — · 8 : — · 9 : — | 6 |
| diff | 3/sem | 2 au plus | 2 : s. 2 · 3 : s. 7 · 4 : s. 10 · 5 : s. 16 · 6 : s. 32 · 7 : — · 8 : — · 9 : — | 7 |
| diff | 5/sem | 1 au plus | 2 : s. 2 · 3 : s. 7 · 4 : s. 25 · 5 : s. 31 · 6 : s. 35 · 7 : — · 8 : — · 9 : — | 7 |
| diff | 5/sem | 2 au plus | 2 : s. 2 · 3 : s. 3 · 4 : s. 7 · 5 : s. 12 · 6 : s. 16 · 7 : s. 22 · 8 : s. 27 · 9 : s. 35 | 9 |
| facile | 2/sem | 2 au plus | 2 : — · 3 : — · 4 : — · 5 : — · 6 : — · 7 : — · 8 : — · 9 : — | 2 |
| tresdur | 2/sem | 2 au plus | 2 : s. 7 · 3 : s. 12 · 4 : s. 18 · 5 : s. 23 · 6 : s. 25 · 7 : s. 33 · 8 : — · 9 : — | 8 |


## La boutique : la simulation de la fiche 17 refaite avec les problèmes (prix non changés)

| Prix pour | Profil | Séances par semaine | Créatures (sur 60) | Collection complète | Séances sans rien de nouveau | Arc-en-ciel gagnées | pour les zones | pour faire briller | restantes | Diamant gagnées | utilisées | Zones ouvertes (corail, large, abysses) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 séances | reel | 2 | 60 | 21/06/2027 | 6/64 | 42 | 3 | 39 | 0 | 8 | 5 | 10/12, 25/02, 03/05 |
| 2 séances | reel | 3 | 60 | 24/05/2027 | 67/96 | 53 | 3 | 33 | 17 | 8 | 5 | 02/12, 03/02, 26/04 |
| 2 séances | reel | 4 | 60 | 21/05/2027 | 100/128 | 54 | 3 | 24 | 27 | 8 | 5 | 01/12, 02/02, 26/04 |
| 2 séances | sait | 2 | 60 | 27/05/2027 | 31/64 | 51 | 3 | 38 | 10 | 8 | 5 | 03/12, 04/02, 26/04 |
| 2 séances | sait | 3 | 60 | 24/05/2027 | 67/96 | 51 | 3 | 30 | 18 | 8 | 5 | 02/12, 03/02, 26/04 |
| 2 séances | sait | 4 | 60 | 21/05/2027 | 100/128 | 51 | 3 | 19 | 29 | 8 | 5 | 01/12, 02/02, 26/04 |
| 2 séances | diff | 2 | 55 | non | 0/64 | 19 | 3 | 16 | 0 | 8 | 2 | 14/12, 18/03, 27/05 |
| 2 séances | diff | 3 | 60 | 02/06/2027 | 48/96 | 23 | 3 | 20 | 0 | 8 | 5 | 02/12, 03/02, 26/04 |
| 2 séances | diff | 4 | 60 | 25/05/2027 | 79/128 | 29 | 3 | 24 | 2 | 8 | 5 | 01/12, 04/02, 26/04 |
| 3 séances | reel | 2 | 38 | non | 0/64 | 43 | 2 | 30 | 11 | 8 | 0 | 01/02, 27/05, — |
| 3 séances | reel | 3 | 59 | non | 2/96 | 51 | 3 | 35 | 13 | 8 | 4 | 14/12, 12/03, 17/05 |
| 3 séances | reel | 4 | 60 | 21/05/2027 | 89/128 | 52 | 3 | 41 | 8 | 8 | 5 | 01/12, 02/02, 26/04 |
| 3 séances | sait | 2 | 43 | non | 0/64 | 51 | 2 | 32 | 17 | 8 | 0 | 18/01, 03/05, — |
| 3 séances | sait | 3 | 60 | 07/06/2027 | 14/96 | 51 | 3 | 46 | 2 | 8 | 5 | 07/12, 24/02, 26/04 |
| 3 séances | sait | 4 | 60 | 21/05/2027 | 93/128 | 51 | 3 | 37 | 11 | 8 | 5 | 01/12, 02/02, 26/04 |
| 3 séances | diff | 2 | 32 | non | 0/64 | 19 | 2 | 16 | 1 | 8 | 0 | 25/02, 28/06, — |
| 3 séances | diff | 3 | 48 | non | 0/96 | 25 | 3 | 22 | 0 | 8 | 2 | 11/01, 19/04, 28/06 |
| 3 séances | diff | 4 | 60 | 08/06/2027 | 17/128 | 24 | 3 | 21 | 0 | 8 | 5 | 08/12, 02/03, 03/05 |
| 4 séances | reel | 2 | 28 | non | 0/64 | 43 | 1 | 23 | 19 | 8 | 0 | 18/03, —, — |
| 4 séances | reel | 3 | 41 | non | 0/96 | 55 | 2 | 31 | 22 | 8 | 0 | 22/01, 14/05, — |
| 4 séances | reel | 4 | 57 | non | 0/128 | 53 | 3 | 30 | 20 | 8 | 2 | 18/12, 16/03, 20/05 |
| 4 séances | sait | 2 | 32 | non | 0/64 | 51 | 2 | 25 | 24 | 8 | 0 | 04/03, 28/06, — |
| 4 séances | sait | 3 | 50 | non | 0/96 | 51 | 3 | 31 | 17 | 8 | 2 | 11/01, 19/04, 18/06 |
| 4 séances | sait | 4 | 60 | 11/06/2027 | 15/128 | 51 | 3 | 39 | 9 | 8 | 5 | 08/12, 26/02, 29/04 |
| 4 séances | diff | 2 | 24 | non | 0/64 | 20 | 1 | 16 | 3 | 8 | 0 | 01/04, —, — |
| 4 séances | diff | 3 | 35 | non | 0/96 | 26 | 2 | 23 | 1 | 8 | 0 | 01/02, 09/06, — |
| 4 séances | diff | 4 | 48 | non | 0/128 | 28 | 3 | 25 | 0 | 8 | 2 | 12/01, 23/04, 24/06 |

