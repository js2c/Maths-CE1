# Partie D · additions (module 2) : une séance à vitesse réelle

Voix réelle (fichiers Piper), base neuve (première séance : choix du nom de la pieuvre), réponse 4.5 s après pouvoir répondre ; outil `tests/recette-fonctionnelle/d-vitesse-reelle.mjs --cas additions`, paramètre de l'application `?module=2`.

- **durée totale** : 8 min 21 s (500,7 s)
- durée par étape : accueil 11,7 s ; echauffement 80,6 s ; notion 365,8 s ; recompense 41,9 s
- **attentes sans rien à toucher** (hors réécouter, maison, espace parent) : 69 en tout, 126,8 s cumulées ; 18 de 1,5 s ou plus (tableau plus bas)
- erreurs de page : aucune

## Chronologie

Un moment = tant que l'étape, ce qui est affiché et ce qui est attendu de l'enfant ne changent pas (relevé toutes les 250 ms). « dit » : les phrases qui commencent pendant ce moment (relevées au quart de seconde près : une phrase dite juste au changement peut apparaître au moment suivant). Hors question, les bulles-réponses, le pavé, « je ne sais pas » et le coquillage (aide) restent affichés mais sont bloqués : ils ne sont pas comptés comme « à toucher ».

| début (s) | durée (s) | étape | affiché | attendu de l'enfant | dit |
| --- | --- | --- | --- | --- | --- |
| 0,7 | 2,1 | accueil | — | toucher : noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Coucou ! Je suis une petite pieuvre, et je n'ai pas encore de nom. Touche un nom pour l'écouter. » |
| 2,8 | 2,2 | accueil | — | toucher : c'est bon ; noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Pili ! » « Si tu veux que je m'appelle Pili, touche la coche verte. » |
| 5,0 | 3,8 | accueil | — | rien à toucher | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 8,8 | 0,3 | accueil | — | toucher : crans : facile, conseille, dur, tresdur ; valider | « Choisis ton niveau. Plus c'est dur, plus tu gagnes d'étoiles ! » |
| 9,1 | 0,4 | echauffement | — | rien à toucher |  |
| 9,5 | 5,6 | echauffement | — | toucher : passer l'échauffement | « On commence par s'échauffer avec des additions ! » « Tape la réponse, puis touche la coche verte. » |
| 15,1 | 5,1 | echauffement | 0 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 0 plus 3 ? » |
| 20,2 | 1,3 | echauffement | 0 + 3 = ? | rien à toucher | « Exactement ! » |
| 21,6 | 5,1 | echauffement | 6 + 0 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 6 plus 0 ? » |
| 26,7 | 1,1 | echauffement | 6 + 0 = ? | rien à toucher | « Super ! » |
| 27,8 | 6,0 | echauffement | 0 + 7 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 0 plus 7 ? » |
| 33,8 | 4,9 | echauffement | 0 + 7 = ? | toucher : passer la correction | « Ce n'est pas grave, regardons ensemble. » « 0 plus 7, ça fait 7. » |
| 38,7 | 5,1 | echauffement | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 43,8 | 1,1 | echauffement | 1 + 1 = ? | rien à toucher | « Bien joué ! » |
| 44,8 | 5,8 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 50,6 | 1,6 | echauffement | 2 + 1 = ? | toucher : passer la correction | « 2 plus 1, ça fait 3. » |
| 52,2 | 4,9 | echauffement | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 2 ? » |
| 57,1 | 1,4 | echauffement | 1 + 2 = ? | rien à toucher | « Exactement ! » |
| 58,5 | 5,0 | echauffement | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 1 ? » |
| 63,5 | 1,1 | echauffement | 3 + 1 = ? | rien à toucher | « Super ! » |
| 64,6 | 5,1 | echauffement | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 3 ? » |
| 69,7 | 1,1 | echauffement | 1 + 3 = ? | rien à toucher | « Super ! » |
| 70,8 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 75,8 | 1,1 | echauffement | 2 + 1 = ? | rien à toucher | « Super ! » |
| 76,9 | 5,1 | echauffement | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 4 plus 1 ? » |
| 82,0 | 1,1 | echauffement | 4 + 1 = ? | rien à toucher | « Super ! » |
| 83,1 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 88,1 | 1,6 | echauffement | 2 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 89,7 | 3,6 | notion | — | rien à toucher | « Maintenant, les additions, avec le bernard-l'ermite ! » |
| 93,3 | 11,0 | notion | 2 + 1 = ? | toucher : passer l'exemple | « La tortue est sur 2. Elle fait un saut. Compte avec elle ! » « 1 » « 2 plus 1, ça fait 3. » « À toi ! Tape la réponse. » |
| 104,4 | 5,0 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 109,4 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Bien joué ! » |
| 110,5 | 11,3 | notion | 1 + 1 = ? | toucher : passer l'exemple | « La tortue est sur 1. Elle fait un saut. Compte avec elle ! » « 1 » « 1 plus 1, ça fait 2. » « À toi ! Tape la réponse. » |
| 121,8 | 4,9 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 126,7 | 1,1 | notion | 1 + 1 = ? | rien à toucher | « Bravo ! » |
| 127,8 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 1 ? » |
| 132,9 | 1,1 | notion | 3 + 1 = ? | rien à toucher | « Exactement ! » |
| 134,0 | 0,3 | notion | — | rien à toucher |  |
| 134,3 | 4,9 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 139,2 | 1,6 | notion | 2 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 140,8 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 1 ? » |
| 145,9 | 1,1 | notion | 1 + 1 = ? | rien à toucher | « Bien joué ! » |
| 147,0 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 1 ? » |
| 152,1 | 1,6 | notion | 3 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 153,8 | 4,9 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 158,6 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Bien joué ! » |
| 159,7 | 4,9 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 3 ? » |
| 164,6 | 1,3 | notion | 1 + 3 = ? | rien à toucher | « Exactement ! » |
| 165,9 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 1 ? » |
| 171,0 | 1,1 | notion | 3 + 1 = ? | rien à toucher | « Bien joué ! » |
| 172,1 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 1 ? » |
| 177,2 | 1,1 | notion | 1 + 1 = ? | rien à toucher | « Bien joué ! » |
| 178,3 | 5,1 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 183,4 | 1,1 | notion | 4 + 1 = ? | rien à toucher | « Super ! » |
| 184,5 | 4,9 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 3 ? » |
| 189,4 | 0,9 | notion | 1 + 3 = ? | rien à toucher | « Bravo ! » |
| 190,3 | 0,3 | notion | — | rien à toucher | « 1 plus 2 ? » |
| 190,5 | 4,9 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) |  |
| 195,4 | 1,1 | notion | 1 + 2 = ? | rien à toucher | « Super ! » |
| 196,5 | 4,9 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 201,4 | 1,4 | notion | 4 + 1 = ? | rien à toucher | « Exactement ! » |
| 202,8 | 5,1 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 3 ? » |
| 207,9 | 1,1 | notion | 1 + 3 = ? | rien à toucher | « Super ! » |
| 209,0 | 4,9 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 2 ? » |
| 213,9 | 1,1 | notion | 1 + 2 = ? | rien à toucher | « Bravo ! » |
| 214,9 | 5,1 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 4 plus 1 ? » |
| 220,0 | 1,1 | notion | 4 + 1 = ? | rien à toucher | « Bravo ! » |
| 221,1 | 5,1 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 226,2 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Super ! » |
| 227,3 | 0,3 | notion | — | rien à toucher |  |
| 227,6 | 4,9 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 2 ? » |
| 232,5 | 1,4 | notion | 1 + 2 = ? | rien à toucher | « Exactement ! » |
| 233,8 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 1 ? » |
| 238,9 | 1,1 | notion | 3 + 1 = ? | rien à toucher | « Super ! » |
| 240,0 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 245,1 | 1,1 | notion | 1 + 1 = ? | rien à toucher | « Super ! » |
| 246,2 | 5,1 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 251,3 | 1,6 | notion | 4 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 252,9 | 5,1 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 2 ? » |
| 257,9 | 1,3 | notion | 1 + 2 = ? | rien à toucher | « Exactement ! » |
| 259,3 | 4,9 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 3 ? » |
| 264,1 | 1,3 | notion | 1 + 3 = ? | rien à toucher | « Exactement ! » |
| 265,4 | 5,1 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 270,5 | 1,6 | notion | 2 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 272,1 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 1 ? » |
| 277,2 | 1,1 | notion | 3 + 1 = ? | rien à toucher | « Bravo ! » |
| 278,3 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 1 ? » |
| 283,3 | 1,6 | notion | 1 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 284,9 | 5,1 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 290,0 | 1,1 | notion | 4 + 1 = ? | rien à toucher | « Super ! » |
| 291,1 | 5,1 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 2 ? » |
| 296,1 | 1,1 | notion | 1 + 2 = ? | rien à toucher | « Bien joué ! » |
| 297,2 | 4,9 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 3 ? » |
| 302,1 | 1,6 | notion | 1 + 3 = ? | rien à toucher | « Oui, c'est ça ! » |
| 303,7 | 5,1 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 308,8 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Bien joué ! » |
| 309,9 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 1 ? » |
| 315,0 | 1,3 | notion | 3 + 1 = ? | rien à toucher | « Exactement ! » |
| 316,3 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 321,4 | 1,6 | notion | 1 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 323,1 | 5,1 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 328,1 | 1,1 | notion | 4 + 1 = ? | rien à toucher | « Bravo ! » |
| 329,2 | 5,1 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 2 ? » |
| 334,3 | 1,1 | notion | 1 + 2 = ? | rien à toucher | « Super ! » |
| 335,4 | 5,1 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 3 ? » |
| 340,5 | 1,6 | notion | 1 + 3 = ? | rien à toucher | « Oui, c'est ça ! » |
| 342,1 | 4,9 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 347,0 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Super ! » |
| 348,1 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 1 ? » |
| 353,2 | 1,3 | notion | 3 + 1 = ? | rien à toucher | « Exactement ! » |
| 354,5 | 4,9 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 359,4 | 1,4 | notion | 1 + 1 = ? | rien à toucher | « Exactement ! » |
| 360,8 | 4,9 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 4 plus 1 ? » |
| 365,7 | 1,1 | notion | 4 + 1 = ? | rien à toucher | « Bien joué ! » |
| 366,8 | 5,1 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 2 ? » |
| 371,9 | 1,3 | notion | 1 + 2 = ? | rien à toucher | « Exactement ! » |
| 373,2 | 5,1 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 3 ? » |
| 378,3 | 1,6 | notion | 1 + 3 = ? | rien à toucher | « Oui, c'est ça ! » |
| 379,9 | 4,9 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 384,8 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Bravo ! » |
| 385,9 | 4,9 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 1 ? » |
| 390,8 | 1,6 | notion | 3 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 392,4 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 1 ? » |
| 397,4 | 1,1 | notion | 1 + 1 = ? | rien à toucher | « Bien joué ! » |
| 398,5 | 5,1 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 403,6 | 1,1 | notion | 4 + 1 = ? | rien à toucher | « Bien joué ! » |
| 404,7 | 5,1 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 3 ? » |
| 409,8 | 1,3 | notion | 1 + 3 = ? | rien à toucher | « Exactement ! » |
| 411,1 | 5,1 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 2 ? » |
| 416,2 | 1,1 | notion | 1 + 2 = ? | rien à toucher | « Bravo ! » |
| 417,3 | 5,1 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 422,4 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Bien joué ! » |
| 423,5 | 5,1 | notion | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 1 ? » |
| 428,6 | 1,1 | notion | 3 + 1 = ? | rien à toucher | « Bravo ! » |
| 429,6 | 5,1 | notion | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 3 ? » |
| 434,7 | 1,6 | notion | 1 + 3 = ? | rien à toucher | « Oui, c'est ça ! » |
| 436,3 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 441,4 | 1,6 | notion | 1 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 443,1 | 5,1 | notion | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 4 plus 1 ? » |
| 448,2 | 1,1 | notion | 4 + 1 = ? | rien à toucher | « Bien joué ! » |
| 449,3 | 4,9 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 2 ? » |
| 454,2 | 1,3 | notion | 1 + 2 = ? | rien à toucher | « Exactement ! » |
| 455,5 | 9,8 | recompense | — | rien à toucher | « Bravo ! Ce soir, tu as gagné 64 étoiles de mer. » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » |
| 465,3 | 0,4 | recompense | — | toucher : ouvrir le coquillage |  |
| 465,7 | 15,1 | recompense | — | rien à toucher | « Qu'est-ce qu'il y a dedans ? » « C'est le bernard-l'ermite ! Le bernard-l'ermite habite dans une coquille vide. Quand il grandit, il déménage dans une plus grande. Cette créature va vivre dans ton récif ! » |
| 480,8 | 0,5 | recompense | — | toucher : c'est bon |  |
| 481,2 | 1,9 | recompense | — | rien à toucher | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 483,1 | 0,4 | recompense | — | toucher : ouvrir le coquillage |  |
| 483,5 | 12,9 | recompense | — | rien à toucher | « Qu'est-ce qu'il y a dedans ? » « C'est la moule ! La moule s'accroche aux rochers avec des fils très solides, qu'elle fabrique elle-même. Cette créature va vivre dans ton récif ! » |
| 496,4 | 0,5 | recompense | — | toucher : c'est bon |  |
| 496,9 | 0,5 | recompense | — | rien à toucher |  |
| 497,4 | 3,2 | accueil | — | toucher : le récif ; l'album ; encore | « Tu as bien travaillé. À demain ! » |

## Attentes sans rien à toucher (1,5 s ou plus)

| de (s) | à (s) | durée (s) | étape | dit pendant l'attente |
| --- | --- | --- | --- | --- |
| 5,0 | 8,8 | 3,8 | accueil | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 88,1 | 93,3 | 5,2 | notion | « Oui, c'est ça ! » « Maintenant, les additions, avec le bernard-l'ermite ! » |
| 139,2 | 140,8 | 1,6 | notion | « Oui, c'est ça ! » |
| 152,1 | 153,8 | 1,6 | notion | « Oui, c'est ça ! » |
| 251,3 | 252,9 | 1,6 | notion | « Oui, c'est ça ! » |
| 270,5 | 272,1 | 1,6 | notion | « Oui, c'est ça ! » |
| 283,3 | 284,9 | 1,6 | notion | « Oui, c'est ça ! » |
| 302,1 | 303,7 | 1,6 | notion | « Oui, c'est ça ! » |
| 321,4 | 323,1 | 1,6 | notion | « Oui, c'est ça ! » |
| 340,5 | 342,1 | 1,6 | notion | « Oui, c'est ça ! » |
| 378,3 | 379,9 | 1,6 | notion | « Oui, c'est ça ! » |
| 390,8 | 392,4 | 1,6 | notion | « Oui, c'est ça ! » |
| 434,7 | 436,3 | 1,6 | notion | « Oui, c'est ça ! » |
| 441,4 | 443,1 | 1,6 | notion | « Oui, c'est ça ! » |
| 454,2 | 465,3 | 11,1 | recompense | « Exactement ! » « Bravo ! Ce soir, tu as gagné 64 étoiles de mer. » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » |
| 465,7 | 480,8 | 15,1 | recompense | « Qu'est-ce qu'il y a dedans ? » « C'est le bernard-l'ermite ! Le bernard-l'ermite habite dans une coquille vide. Quand il grandit, il déménage dans une plus grande. Cette créature va vivre dans ton récif ! » |
| 481,2 | 483,1 | 1,9 | recompense | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 483,5 | 496,4 | 12,9 | recompense | « Qu'est-ce qu'il y a dedans ? » « C'est la moule ! La moule s'accroche aux rochers avec des fils très solides, qu'elle fabrique elle-même. Cette créature va vivre dans ton récif ! » |
