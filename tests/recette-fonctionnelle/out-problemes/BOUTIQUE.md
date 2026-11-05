# Les prix de la boutique avec le problème du jour

Décision du parent du 4 novembre 2026 : baisser d'environ 10 % les prix d'achat des niveaux « 3 séances » et « 4 séances », en nombres ronds, le rapport de 2,5 entre rare et commune gardé ; la simulation d'une année refaite (`node tests/sim-boutique.mjs --prix 3 --rythmes 3`, puis `--prix 4 --rythmes 4` : chaque niveau à son rythme ; mode Arrivages ; les zones 3 et 4 à leurs dates ; les prix pour faire briller inchangés).

**Retenu : 64 et 160 (« 3 séances », au lieu de 70 et 175, −8,6 %) ; 88 et 220 (« 4 séances », au lieu de 96 et 240, −8,3 %).**

| Niveau | Profil | Rythme | Avant le lot (prix d'avant, sans problèmes) | Avec les problèmes, prix d'avant | Avec les problèmes, prix retenus |
| --- | --- | --- | --- | --- | --- |
| 3 séances | reel | 3/sem | 60 créatures, 25/06/2027, 6/96 sans nouveauté | 59 créatures, non, 2/96 sans nouveauté | 60 créatures, 21/06/2027, 8/96 sans nouveauté |
| 3 séances | sait | 3/sem | 60 créatures, 24/05/2027, 43/96 sans nouveauté | 60 créatures, 07/06/2027, 14/96 sans nouveauté | 60 créatures, 24/05/2027, 42/96 sans nouveauté |
| 3 séances | diff | 3/sem | 49 créatures, non, 0/96 sans nouveauté | 48 créatures, non, 0/96 sans nouveauté | 53 créatures, non, 0/96 sans nouveauté |
| 4 séances | reel | 4/sem | 60 créatures, 24/06/2027, 8/128 sans nouveauté | 57 créatures, non, 0/128 sans nouveauté | 60 créatures, 22/06/2027, 9/128 sans nouveauté |
| 4 séances | sait | 4/sem | 60 créatures, 27/05/2027, 37/128 sans nouveauté | 60 créatures, 11/06/2027, 15/128 sans nouveauté | 60 créatures, 27/05/2027, 37/128 sans nouveauté |
| 4 séances | diff | 4/sem | 42 créatures, non, 0/128 sans nouveauté | 48 créatures, non, 0/128 sans nouveauté | 54 créatures, non, 0/128 sans nouveauté |

« Collection complète » : la date où les 60 créatures sont à l'enfant (« non » : pas avant le 2 juillet) ; « sans nouveauté » : les séances où la vitrine n'a plus rien de nouveau à vendre (le critère de la fiche 15 : presque exactement les arrivées de la semaine).

## L'enfant en difficulté : ce qu'il faudrait

Avec environ 10 % de moins, l'enfant en difficulté ne finit pas la collection en juin (53 et 54 créatures sur 60 ; avant le lot, aux prix d'avant, 49 et 42 : il ne la finissait déjà pas). Il lui faudrait 20 à 27 % de moins ; le profil de l'évaluation finit alors fin mai, avec près de la moitié des séances sans rien de nouveau en vitrine :

| Prix (« 3 séances » ; « 4 séances ») | Profil | « 3 séances » à 3/sem | « 4 séances » à 4/sem |
| --- | --- | --- | --- |
| 60/150 ; 84/210 | reel | 60 créatures, 09/06/2027, 14/96 sans nouveauté | 60 créatures, 15/06/2027, 13/128 sans nouveauté |
| 60/150 ; 84/210 | sait | 60 créatures, 24/05/2027, 59/96 sans nouveauté | 60 créatures, 21/05/2027, 67/128 sans nouveauté |
| 60/150 ; 84/210 | diff | 56 créatures, non, 0/96 sans nouveauté | 55 créatures, non, 0/128 sans nouveauté |
| 56/140 ; 76/190 | reel | 60 créatures, 26/05/2027, 45/96 sans nouveauté | 60 créatures, 27/05/2027, 35/128 sans nouveauté |
| 56/140 ; 76/190 | sait | 60 créatures, 24/05/2027, 62/96 sans nouveauté | 60 créatures, 21/05/2027, 91/128 sans nouveauté |
| 56/140 ; 76/190 | diff | 60 créatures, 25/06/2027, 6/96 sans nouveauté | 60 créatures, 02/07/2027, 3/128 sans nouveauté |
| 50/125 ; 70/175 | reel | 60 créatures, 24/05/2027, 63/96 sans nouveauté | 60 créatures, 24/05/2027, 88/128 sans nouveauté |
| 50/125 ; 70/175 | sait | 60 créatures, 24/05/2027, 64/96 sans nouveauté | 60 créatures, 21/05/2027, 93/128 sans nouveauté |
| 50/125 ; 70/175 | diff | 60 créatures, 09/06/2027, 17/96 sans nouveauté | 60 créatures, 08/06/2027, 17/128 sans nouveauté |
