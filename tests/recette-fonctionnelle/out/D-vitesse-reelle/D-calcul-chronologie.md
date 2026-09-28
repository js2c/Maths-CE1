# Partie D · calcul rapide (module 3) : une séance à vitesse réelle

Voix réelle (fichiers Piper), base neuve (première séance : choix du nom de la pieuvre), réponse 4.5 s après pouvoir répondre ; outil `tests/recette-fonctionnelle/d-vitesse-reelle.mjs --cas calcul`, paramètre de l'application `?module=3`.

- **durée totale** : 8 min 38 s (518,2 s)
- durée par étape : accueil 11,5 s ; echauffement 80,2 s ; notion 364,0 s ; recompense 62,0 s
- **attentes sans rien à toucher** (hors réécouter, maison, espace parent) : 59 en tout, 192,9 s cumulées ; 26 de 1,5 s ou plus (tableau plus bas)
- erreurs de page : aucune

## Chronologie

Un moment = tant que l'étape, ce qui est affiché et ce qui est attendu de l'enfant ne changent pas (relevé toutes les 250 ms). « dit » : les phrases qui commencent pendant ce moment (relevées au quart de seconde près : une phrase dite juste au changement peut apparaître au moment suivant). Hors question, les bulles-réponses, le pavé, « je ne sais pas » et le coquillage (aide) restent affichés mais sont bloqués : ils ne sont pas comptés comme « à toucher ».

| début (s) | durée (s) | étape | affiché | attendu de l'enfant | dit |
| --- | --- | --- | --- | --- | --- |
| 0,5 | 2,1 | accueil | — | toucher : noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Coucou ! Je suis une petite pieuvre, et je n'ai pas encore de nom. Touche un nom pour l'écouter. » |
| 2,6 | 2,2 | accueil | — | toucher : c'est bon ; noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Pili ! » « Si tu veux que je m'appelle Pili, touche la coche verte. » |
| 4,8 | 3,7 | accueil | — | rien à toucher | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 8,6 | 0,3 | accueil | — | toucher : crans : facile, conseille, dur, tresdur ; valider | « Choisis ton niveau. Plus c'est dur, plus tu gagnes d'étoiles ! » |
| 8,9 | 6,5 | echauffement | — | toucher : passer l'échauffement | « D'abord, un petit échauffement : des additions ! » « Tape la réponse, puis touche la coche verte. » |
| 15,4 | 5,2 | echauffement | 0 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 0 plus 2 ? » |
| 20,6 | 1,1 | echauffement | 0 + 2 = ? | rien à toucher | « Super ! » |
| 21,7 | 0,3 | echauffement | — | rien à toucher |  |
| 22,1 | 5,1 | echauffement | 0 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 0 plus 2 ? » |
| 27,2 | 1,1 | echauffement | 0 + 2 = ? | rien à toucher | « Bravo ! » |
| 28,3 | 5,7 | echauffement | 2 + 0 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 0 ? » |
| 34,0 | 4,4 | echauffement | 2 + 0 = ? | toucher : passer la correction | « Ce n'est pas grave, regardons ensemble. » « 2 plus 0, ça fait 2. » |
| 38,4 | 5,1 | echauffement | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 43,5 | 1,1 | echauffement | 1 + 1 = ? | rien à toucher | « Super ! » |
| 44,6 | 5,8 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 50,4 | 1,6 | echauffement | 2 + 1 = ? | toucher : passer la correction | « 2 plus 1, ça fait 3. » |
| 52,0 | 4,9 | echauffement | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 2 ? » |
| 56,9 | 1,1 | echauffement | 1 + 2 = ? | rien à toucher | « Bien joué ! » |
| 58,0 | 5,1 | echauffement | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 1 ? » |
| 63,1 | 1,1 | echauffement | 3 + 1 = ? | rien à toucher | « Super ! » |
| 64,1 | 5,1 | echauffement | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 3 ? » |
| 69,2 | 1,1 | echauffement | 1 + 3 = ? | rien à toucher | « Bien joué ! » |
| 70,3 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 75,3 | 1,1 | echauffement | 2 + 1 = ? | rien à toucher | « Bravo ! » |
| 76,4 | 5,1 | echauffement | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 81,5 | 1,1 | echauffement | 4 + 1 = ? | rien à toucher | « Super ! » |
| 82,6 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 87,8 | 1,3 | echauffement | 2 + 1 = ? | rien à toucher | « Exactement ! » |
| 89,1 | 8,6 | notion | — | rien à toucher | « Au tour du calcul rapide ! Le petit poisson va t'aider. » « 51 moins 2 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 97,7 | 5,3 | notion | 51 − 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 2 ? » |
| 102,9 | 0,8 | notion | 51 − 2 = ? | rien à toucher | « Bien joué ! » |
| 103,8 | 5,2 | notion | — | rien à toucher | « 47 moins 2 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 109,0 | 4,9 | notion | 47 − 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 2 ? » |
| 113,9 | 0,8 | notion | 47 − 2 = ? | rien à toucher | « Bravo ! » |
| 114,7 | 5,5 | notion | — | rien à toucher | « 87 plus 1 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 120,3 | 5,2 | notion | 87 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 1 ? » |
| 125,4 | 0,8 | notion | 87 + 1 = ? | rien à toucher | « Bravo ! » |
| 126,2 | 0,8 | notion | — | rien à toucher |  |
| 127,1 | 4,9 | notion | 58 − 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 58 moins 2 ? » |
| 132,0 | 1,6 | notion | 58 − 2 = ? | rien à toucher | « Oui, c'est ça ! » |
| 133,7 | 4,9 | notion | 28 − 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 28 moins 2 ? » |
| 138,6 | 1,6 | notion | 28 − 2 = ? | rien à toucher | « Oui, c'est ça ! » |
| 140,2 | 5,1 | notion | 94 − 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 94 moins 2 ? » |
| 145,4 | 1,4 | notion | 94 − 2 = ? | rien à toucher | « Exactement ! » |
| 146,7 | 4,9 | notion | 56 − 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 56 moins 2 ? » |
| 151,6 | 1,6 | notion | 56 − 2 = ? | rien à toucher | « Oui, c'est ça ! » |
| 153,2 | 4,9 | notion | 96 − 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 96 moins 2 ? » |
| 158,2 | 1,3 | notion | 96 − 2 = ? | rien à toucher | « Exactement ! » |
| 159,5 | 19,0 | notion | leçon animée | toucher : rejouer la leçon ; passer la leçon | « Voici le mur de corail : tous les nombres de un à cent, rangés par dix. » « Le poisson est sur trente-quatre. » « Il ajoute dix : il descend d'une rangée, juste en dessous. » « Quarante-quatre ! » « Regarde : le quatre des unités ne bouge pas. Seules les dizaines changent. » « Moins dix, il monte d'une rangée. » |
| 178,5 | 5,0 | notion | — | rien à toucher | « 52 plus 10 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 183,5 | 5,2 | notion | 52 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 188,7 | 1,1 | notion | 52 + 10 = ? | rien à toucher | « Super ! » |
| 189,8 | 5,6 | notion | — | rien à toucher | « 78 moins 10 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 195,4 | 4,9 | notion | 78 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 200,3 | 1,3 | notion | 78 − 10 = ? | rien à toucher | « Oui, c'est ça ! » |
| 201,6 | 5,5 | notion | — | rien à toucher | « 48 plus 10 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 207,1 | 4,9 | notion | 48 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 212,0 | 0,8 | notion | 48 + 10 = ? | rien à toucher | « Bien joué ! » |
| 212,8 | 0,8 | notion | — | rien à toucher |  |
| 213,6 | 5,1 | notion | 72 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 72 moins 10 ? » |
| 218,7 | 1,4 | notion | 72 − 10 = ? | rien à toucher | « Exactement ! » |
| 220,0 | 4,9 | notion | 61 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 61 plus 10 ? » |
| 225,0 | 1,6 | notion | 61 + 10 = ? | rien à toucher | « Oui, c'est ça ! » |
| 226,6 | 5,0 | notion | 27 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 27 moins 10 ? » |
| 231,6 | 1,1 | notion | 27 − 10 = ? | rien à toucher | « Bravo ! » |
| 232,7 | 5,1 | notion | 45 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 45 moins 10 ? » |
| 237,8 | 1,1 | notion | 45 − 10 = ? | rien à toucher | « Super ! » |
| 238,9 | 5,1 | notion | 73 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 73 plus 1 ? » |
| 244,0 | 1,1 | notion | 73 + 1 = ? | rien à toucher | « Super ! » |
| 245,1 | 5,1 | notion | 74 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 74 plus 10 ? » |
| 250,2 | 1,1 | notion | 74 + 10 = ? | rien à toucher | « Super ! » |
| 251,3 | 4,9 | notion | — | rien à toucher | « 28 plus 30 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 256,2 | 5,2 | notion | 28 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 261,4 | 1,1 | notion | 28 + 10 = ? | rien à toucher | « Exactement ! » |
| 262,5 | 5,1 | notion | 38 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 267,7 | 0,8 | notion | 38 + 10 = ? | rien à toucher | « Super ! » |
| 268,5 | 5,2 | notion | 48 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 273,6 | 0,8 | notion | 48 + 10 = ? | rien à toucher | « Super ! » |
| 274,5 | 6,1 | notion | — | rien à toucher | « 91 moins 40 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 280,5 | 4,9 | notion | 91 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 285,5 | 0,8 | notion | 91 − 10 = ? | rien à toucher | « Bravo ! » |
| 286,3 | 5,2 | notion | 81 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 291,4 | 0,8 | notion | 81 − 10 = ? | rien à toucher | « Bravo ! » |
| 292,2 | 4,9 | notion | 71 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 297,2 | 0,8 | notion | 71 − 10 = ? | rien à toucher | « Bien joué ! » |
| 298,0 | 5,1 | notion | 61 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 303,2 | 0,8 | notion | 61 − 10 = ? | rien à toucher | « Bravo ! » |
| 303,9 | 5,8 | notion | — | rien à toucher | « 76 moins 50 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 309,8 | 5,1 | notion | 76 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 314,9 | 0,8 | notion | 76 − 10 = ? | rien à toucher | « Bravo ! » |
| 315,7 | 5,2 | notion | 66 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 320,9 | 0,8 | notion | 66 − 10 = ? | rien à toucher | « Bravo ! » |
| 321,7 | 5,1 | notion | 56 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 326,8 | 0,8 | notion | 56 − 10 = ? | rien à toucher | « Bravo ! » |
| 327,6 | 5,2 | notion | 46 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 332,7 | 1,1 | notion | 46 − 10 = ? | rien à toucher | « Exactement ! » |
| 333,8 | 5,1 | notion | 36 − 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 10 ? » |
| 339,0 | 0,8 | notion | 36 − 10 = ? | rien à toucher | « Bravo ! » |
| 339,8 | 0,6 | notion | — | rien à toucher |  |
| 340,4 | 4,9 | notion | 74 − 70 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 74 moins 70 ? » |
| 345,2 | 1,1 | notion | 74 − 70 = ? | rien à toucher | « Bravo ! » |
| 346,3 | 5,0 | notion | 25 + 20 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 25 plus 20 ? » |
| 351,3 | 1,1 | notion | 25 + 20 = ? | rien à toucher | « Super ! » |
| 352,4 | 5,2 | notion | 73 − 40 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 73 moins 40 ? » |
| 357,5 | 1,1 | notion | 73 − 40 = ? | rien à toucher | « Bravo ! » |
| 358,6 | 4,9 | notion | 16 + 30 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 16 plus 30 ? » |
| 363,5 | 1,7 | notion | 16 + 30 = ? | rien à toucher | « Oui, c'est ça ! » |
| 365,2 | 5,2 | notion | 56 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 56 plus 1 ? » |
| 370,3 | 1,6 | notion | 56 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 372,0 | 5,2 | notion | 33 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 33 plus 1 ? » |
| 377,1 | 1,1 | notion | 33 + 1 = ? | rien à toucher | « Super ! » |
| 378,2 | 5,0 | notion | 72 − 40 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 72 moins 40 ? » |
| 383,2 | 1,3 | notion | 72 − 40 = ? | rien à toucher | « Exactement ! » |
| 384,5 | 8,0 | notion | leçon animée | toucher : rejouer la leçon ; passer la leçon | « Ajouter neuf, c'est presque ajouter dix. » « Alors on ajoute dix, et on recule d'un pas. » « Trente-quatre plus neuf, ça fait quarante-trois. » |
| 392,6 | 4,9 | notion | — | rien à toucher | « 27 plus 9 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 397,5 | 5,1 | notion | 27 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 402,6 | 0,8 | notion | 27 + 10 = ? | rien à toucher | « Bien joué ! » |
| 403,4 | 5,2 | notion | 37 − 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 1 ? » |
| 408,6 | 1,3 | notion | 37 − 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 409,9 | 5,8 | notion | — | rien à toucher | « 61 plus 9 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 415,7 | 5,2 | notion | 61 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 420,9 | 1,1 | notion | 61 + 10 = ? | rien à toucher | « Exactement ! » |
| 422,0 | 5,2 | notion | 71 − 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 1 ? » |
| 427,2 | 1,4 | notion | 71 − 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 428,6 | 5,3 | notion | — | rien à toucher | « 42 plus 9 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 433,8 | 5,1 | notion | 42 + 10 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Plus 10 ? » |
| 439,0 | 0,8 | notion | 42 + 10 = ? | rien à toucher | « Bravo ! » |
| 439,8 | 5,1 | notion | 52 − 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Moins 1 ? » |
| 444,9 | 0,8 | notion | 52 − 1 = ? | rien à toucher | « Super ! » |
| 445,7 | 0,8 | notion | — | rien à toucher |  |
| 446,5 | 4,9 | notion | 77 + 9 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 77 plus 9 ? » |
| 451,4 | 1,6 | notion | 77 + 9 = ? | rien à toucher | « Oui, c'est ça ! » |
| 453,0 | 27,0 | recompense | — | rien à toucher | « Regarde tout ce que tu as gagné ce soir : 47 étoiles de mer ! » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » |
| 480,0 | 0,5 | recompense | — | toucher : ouvrir le coquillage |  |
| 480,5 | 16,1 | recompense | — | rien à toucher | « Qu'est-ce qu'il y a dedans ? » « C'est le poisson-chirurgien ! Oh ! Elle est brillante ! Le poisson-chirurgien a une petite lame de chaque côté de la queue, comme le couteau d'un chirurgien. Cette créature va vivre dans ton récif ! » |
| 496,6 | 0,5 | recompense | — | toucher : c'est bon |  |
| 497,1 | 1,9 | recompense | — | rien à toucher | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 499,0 | 0,4 | recompense | — | toucher : ouvrir le coquillage |  |
| 499,4 | 14,7 | recompense | — | rien à toucher | « Qu'est-ce qu'il y a dedans ? » « C'est la crevette ! Oh ! Elle est brillante ! Quand elle a peur, la crevette file à reculons, d'un grand coup de queue. Cette créature va vivre dans ton récif ! » |
| 514,1 | 0,4 | recompense | — | toucher : c'est bon |  |
| 514,5 | 0,5 | recompense | — | rien à toucher |  |
| 515,0 | 3,2 | accueil | — | toucher : le récif ; l'album ; encore | « C'est fini pour aujourd'hui. À demain ! » |

## Attentes sans rien à toucher (1,5 s ou plus)

| de (s) | à (s) | durée (s) | étape | dit pendant l'attente |
| --- | --- | --- | --- | --- |
| 4,8 | 8,6 | 3,7 | accueil | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 87,8 | 97,7 | 9,9 | notion | « Exactement ! » « Au tour du calcul rapide ! Le petit poisson va t'aider. » « 51 moins 2 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 102,9 | 109,0 | 6,1 | notion | « Bien joué ! » « 47 moins 2 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 113,9 | 120,3 | 6,3 | notion | « Bravo ! » « 87 plus 1 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 125,4 | 127,1 | 1,6 | notion | « Bravo ! » |
| 132,0 | 133,7 | 1,6 | notion | « Oui, c'est ça ! » |
| 138,6 | 140,2 | 1,6 | notion | « Oui, c'est ça ! » |
| 151,6 | 153,2 | 1,6 | notion | « Oui, c'est ça ! » |
| 178,5 | 183,5 | 5,0 | notion | « 52 plus 10 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 188,7 | 195,4 | 6,7 | notion | « Super ! » « 78 moins 10 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 200,3 | 207,1 | 6,8 | notion | « Oui, c'est ça ! » « 48 plus 10 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 212,0 | 213,6 | 1,6 | notion | « Bien joué ! » |
| 225,0 | 226,6 | 1,6 | notion | « Oui, c'est ça ! » |
| 250,2 | 256,2 | 6,0 | notion | « Super ! » « 28 plus 30 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 273,6 | 280,5 | 6,9 | notion | « Super ! » « 91 moins 40 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 303,2 | 309,8 | 6,6 | notion | « Bravo ! » « 76 moins 50 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 363,5 | 365,2 | 1,7 | notion | « Oui, c'est ça ! » |
| 370,3 | 372,0 | 1,6 | notion | « Oui, c'est ça ! » |
| 392,6 | 397,5 | 4,9 | notion | « 27 plus 9 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 408,6 | 415,7 | 7,1 | notion | « Oui, c'est ça ! » « 61 plus 9 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 427,2 | 433,8 | 6,6 | notion | « Oui, c'est ça ! » « 42 plus 9 ? Suis le chemin : tape le nombre de chaque caillou. » |
| 444,9 | 446,5 | 1,6 | notion | « Super ! » |
| 451,4 | 480,0 | 28,6 | recompense | « Oui, c'est ça ! » « Regarde tout ce que tu as gagné ce soir : 47 étoiles de mer ! » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » |
| 480,5 | 496,6 | 16,1 | recompense | « Qu'est-ce qu'il y a dedans ? » « C'est le poisson-chirurgien ! Oh ! Elle est brillante ! Le poisson-chirurgien a une petite lame de chaque côté de la queue, comme le couteau d'un chirurgien. Cette créature va vivre dans ton récif ! » |
| 497,1 | 499,0 | 1,9 | recompense | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 499,4 | 514,1 | 14,7 | recompense | « Qu'est-ce qu'il y a dedans ? » « C'est la crevette ! Oh ! Elle est brillante ! Quand elle a peur, la crevette file à reculons, d'un grand coup de queue. Cette créature va vivre dans ton récif ! » |
