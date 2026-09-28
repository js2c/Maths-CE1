# Partie D · séances à vitesse réelle : synthèse

Voix réelle, base neuve (première séance), l'enfant répond 4,5 s après pouvoir répondre (« je ne sais pas » une fois, une erreur une fois par exercice ; bulles hors questions touchées au bout de 2 s). Détail dans chaque `D-<cas>-chronologie.md`.

## tests/recette-fonctionnelle/d-vitesse-reelle.mjs (avec le relevé de la voix)

| séance | durée totale | durée par étape | attentes sans rien à toucher (≥ 1,5 s) | temps cumulé sans rien à toucher | erreurs de page |
| --- | --- | --- | --- | --- | --- |
| ligne graduée (module 1) | 8 min 47 s | accueil 11,8 s ; echauffement 81,4 s ; notion 356,5 s ; recompense 77,1 s | 40 | 166,0 s | aucune |
| additions (module 2) | 8 min 21 s | accueil 11,7 s ; echauffement 80,6 s ; notion 365,8 s ; recompense 41,9 s | 18 | 126,8 s | aucune |
| calcul rapide (module 3) | 8 min 38 s | accueil 11,5 s ; echauffement 80,2 s ; notion 364,0 s ; recompense 62,0 s | 26 | 192,9 s | aucune |
| additions, famille 3 choisie | 8 min 22 s | accueil 11,6 s ; echauffement 81,5 s ; notion 362,3 s ; recompense 46,4 s | 13 | 122,7 s | aucune |

## tests/e2e/recette.mjs --delai 4.5 (l'outil de recette du dépôt, lancé tel quel)

Même enfant, sans le relevé de la voix ; « attente » : le temps entre la fin de l'action précédente et le moment où l'enfant peut répondre (la consigne comprise).

| module | durée totale | questions | attente avant de pouvoir répondre : moyenne / plus longue (étape) | erreurs de page |
| --- | --- | --- | --- | --- |
| 1 | 8 min 54 s | 53 | 3,5 s / 36,2 s (notion, lire:3) | aucune |
| 2 | 8 min 20 s | 67 | 1,7 s / 16,5 s (echauffement, 0+5) | aucune |
| 3 | 8 min 46 s | 55 | 3,2 s / 25,2 s (notion, 30+10) | aucune |
