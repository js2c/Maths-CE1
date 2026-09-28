# Partie D · additions, famille 3 choisie : une séance à vitesse réelle

Voix réelle (fichiers Piper), base neuve (première séance : choix du nom de la pieuvre), réponse 4.5 s après pouvoir répondre ; outil `tests/recette-fonctionnelle/d-vitesse-reelle.mjs --cas famille3`, paramètre de l'application `?choix=2:3`.

- **durée totale** : 8 min 22 s (502,4 s)
- durée par étape : accueil 11,6 s ; echauffement 81,5 s ; notion 362,3 s ; recompense 46,4 s
- **attentes sans rien à toucher** (hors réécouter, maison, espace parent) : 62 en tout, 122,7 s cumulées ; 13 de 1,5 s ou plus (tableau plus bas)
- erreurs de page : aucune

## Chronologie

Un moment = tant que l'étape, ce qui est affiché et ce qui est attendu de l'enfant ne changent pas (relevé toutes les 250 ms). « dit » : les phrases qui commencent pendant ce moment (relevées au quart de seconde près : une phrase dite juste au changement peut apparaître au moment suivant). Hors question, les bulles-réponses, le pavé, « je ne sais pas » et le coquillage (aide) restent affichés mais sont bloqués : ils ne sont pas comptés comme « à toucher ».

| début (s) | durée (s) | étape | affiché | attendu de l'enfant | dit |
| --- | --- | --- | --- | --- | --- |
| 0,6 | 2,1 | accueil | — | toucher : noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Coucou ! Je suis une petite pieuvre, et je n'ai pas encore de nom. Touche un nom pour l'écouter. » |
| 2,7 | 2,2 | accueil | — | toucher : c'est bon ; noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Pili ! » « Si tu veux que je m'appelle Pili, touche la coche verte. » |
| 4,9 | 3,7 | accueil | — | rien à toucher | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 8,6 | 0,3 | accueil | — | toucher : crans : facile, conseille, dur, tresdur ; valider | « Choisis ton niveau. Plus c'est dur, plus tu gagnes d'étoiles ! » |
| 9,0 | 6,5 | echauffement | — | toucher : passer l'échauffement | « D'abord, un petit échauffement : des additions ! » « Tape la réponse, puis touche la coche verte. » |
| 15,5 | 5,2 | echauffement | 0 + 4 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 0 plus 4 ? » |
| 20,7 | 1,3 | echauffement | 0 + 4 = ? | rien à toucher | « Super ! » |
| 22,0 | 5,1 | echauffement | 0 + 8 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 0 plus 8 ? » |
| 27,1 | 1,1 | echauffement | 0 + 8 = ? | rien à toucher | « Bien joué ! » |
| 28,2 | 5,9 | echauffement | 0 + 5 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 0 plus 5 ? » |
| 34,1 | 4,5 | echauffement | 0 + 5 = ? | toucher : passer la correction | « Ce n'est pas grave, regardons ensemble. » « 0 plus 5, ça fait 5. » |
| 38,6 | 5,1 | echauffement | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 43,7 | 1,1 | echauffement | 1 + 1 = ? | rien à toucher | « Bien joué ! » |
| 44,7 | 6,0 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 50,7 | 1,6 | echauffement | 2 + 1 = ? | toucher : passer la correction | « 2 plus 1, ça fait 3. » |
| 52,4 | 5,1 | echauffement | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 2 ? » |
| 57,5 | 1,1 | echauffement | 1 + 2 = ? | rien à toucher | « Super ! » |
| 58,6 | 5,1 | echauffement | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 1 ? » |
| 63,7 | 1,1 | echauffement | 3 + 1 = ? | rien à toucher | « Super ! » |
| 64,8 | 5,1 | echauffement | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 3 ? » |
| 69,8 | 1,3 | echauffement | 1 + 3 = ? | rien à toucher | « Exactement ! » |
| 71,2 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 76,2 | 1,6 | echauffement | 2 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 77,8 | 4,8 | echauffement | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 82,7 | 1,1 | echauffement | 4 + 1 = ? | rien à toucher | « Exactement ! » |
| 83,8 | 0,3 | echauffement | — | rien à toucher |  |
| 84,1 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 89,1 | 1,3 | echauffement | 2 + 1 = ? | rien à toucher | « Exactement ! » |
| 90,5 | 3,3 | notion | — | rien à toucher | « Maintenant, les additions, avec le bernard-l'ermite ! » |
| 93,8 | 16,9 | notion | leçon animée | toucher : rejouer la leçon ; passer la leçon | « Voici la boîte à dix places. » « Deux rangées de cinq. » « Sept poissons entrent. » « Combien de places vides ? Trois ! » « Sept et trois font dix. Ce sont des amis de dix. » « Pour trouver l'ami de dix, regarde les places vides. » « Six et quatre. » « Huit et deux. » |
| 110,7 | 0,5 | notion | — | rien à toucher |  |
| 111,2 | 7,8 | notion | 1 + 9 = ? | toucher : passer l'exemple | « Regarde la boîte à dix places : 1 poissons. » « 1 plus 9, ça fait 10. » « À toi ! Tape la réponse. » |
| 119,1 | 5,2 | notion | 1 + 9 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 9 ? » |
| 124,3 | 1,1 | notion | 1 + 9 = ? | rien à toucher | « Bien joué ! » |
| 125,4 | 5,0 | notion | 2 + 8 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 8 ? » |
| 130,4 | 1,3 | notion | 2 + 8 = ? | rien à toucher | « Exactement ! » |
| 131,7 | 4,9 | notion | 3 + 7 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 7 ? » |
| 136,6 | 1,1 | notion | 3 + 7 = ? | rien à toucher | « Bravo ! » |
| 137,7 | 4,9 | notion | 4 + 6 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 4 plus 6 ? » |
| 142,7 | 1,1 | notion | 4 + 6 = ? | rien à toucher | « Bien joué ! » |
| 143,7 | 7,9 | notion | 1 + 9 = ? | toucher : passer l'exemple | « Regarde la boîte à dix places : 1 poissons. » « 1 plus 9, ça fait 10. » « À toi ! Tape la réponse. » |
| 151,6 | 5,2 | notion | 1 + 9 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 9 ? » |
| 156,8 | 1,1 | notion | 1 + 9 = ? | rien à toucher | « Bravo ! » |
| 157,8 | 4,9 | notion | 5 + 5 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 5 plus 5 ? » |
| 162,8 | 1,1 | notion | 5 + 5 = ? | rien à toucher | « Bien joué ! » |
| 163,9 | 5,1 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 169,0 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Super ! » |
| 170,0 | 5,2 | notion | 6 + 4 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 6 plus 4 ? » |
| 175,3 | 1,1 | notion | 6 + 4 = ? | rien à toucher | « Super ! » |
| 176,4 | 7,8 | notion | 1 + 9 = ? | toucher : passer l'exemple | « Regarde la boîte à dix places : 1 poissons. » « 1 plus 9, ça fait 10. » « À toi ! Tape la réponse. » |
| 184,2 | 4,9 | notion | 1 + 9 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 9 ? » |
| 189,1 | 1,4 | notion | 1 + 9 = ? | rien à toucher | « Exactement ! » |
| 190,5 | 5,2 | notion | 7 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 7 plus 3 ? » |
| 195,6 | 1,1 | notion | 7 + 3 = ? | rien à toucher | « Bien joué ! » |
| 196,7 | 5,2 | notion | 6 + 4 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 6 plus 4 ? » |
| 201,9 | 1,4 | notion | 6 + 4 = ? | rien à toucher | « Exactement ! » |
| 203,3 | 5,1 | notion | 8 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 8 plus 2 ? » |
| 208,4 | 1,4 | notion | 8 + 2 = ? | rien à toucher | « Exactement ! » |
| 209,8 | 5,1 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 214,9 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Super ! » |
| 216,0 | 5,0 | notion | 9 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 9 plus 1 ? » |
| 221,0 | 1,6 | notion | 9 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 222,6 | 5,2 | notion | 7 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 7 plus 3 ? » |
| 227,8 | 1,1 | notion | 7 + 3 = ? | rien à toucher | « Super ! » |
| 228,9 | 5,0 | notion | 8 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 8 plus 2 ? » |
| 233,9 | 1,6 | notion | 8 + 2 = ? | rien à toucher | « Oui, c'est ça ! » |
| 235,5 | 5,0 | notion | 6 + 4 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 6 plus 4 ? » |
| 240,5 | 1,6 | notion | 6 + 4 = ? | rien à toucher | « Oui, c'est ça ! » |
| 242,1 | 5,1 | notion | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 247,2 | 1,1 | notion | 2 + 1 = ? | rien à toucher | « Exactement ! » |
| 248,3 | 0,3 | notion | — | rien à toucher | « Combien font 7 plus 3 ? » |
| 248,6 | 5,0 | notion | 7 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) |  |
| 253,6 | 1,1 | notion | 7 + 3 = ? | rien à toucher | « Bravo ! » |
| 254,7 | 5,2 | notion | 8 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 8 plus 2 ? » |
| 259,9 | 1,6 | notion | 8 + 2 = ? | rien à toucher | « Oui, c'est ça ! » |
| 261,5 | 5,2 | notion | 3 + 7 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 7 ? » |
| 266,7 | 1,1 | notion | 3 + 7 = ? | rien à toucher | « Bien joué ! » |
| 267,7 | 5,1 | notion | 4 + 6 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 4 plus 6 ? » |
| 272,8 | 1,3 | notion | 4 + 6 = ? | rien à toucher | « Exactement ! » |
| 274,2 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 1 ? » |
| 279,3 | 1,1 | notion | 1 + 1 = ? | rien à toucher | « Bravo ! » |
| 280,4 | 5,1 | notion | 3 + 7 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 3 plus 7 ? » |
| 285,5 | 1,4 | notion | 3 + 7 = ? | rien à toucher | « Exactement ! » |
| 286,9 | 5,2 | notion | 4 + 6 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 6 ? » |
| 292,1 | 1,1 | notion | 4 + 6 = ? | rien à toucher | « Super ! » |
| 293,2 | 5,2 | notion | 5 + 5 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 5 plus 5 ? » |
| 298,3 | 1,6 | notion | 5 + 5 = ? | rien à toucher | « Oui, c'est ça ! » |
| 300,0 | 5,1 | notion | 9 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 9 plus 1 ? » |
| 305,1 | 1,1 | notion | 9 + 1 = ? | rien à toucher | « Super ! » |
| 306,2 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 1 ? » |
| 311,2 | 1,6 | notion | 1 + 1 = ? | rien à toucher | « Oui, c'est ça ! » |
| 312,8 | 5,1 | notion | 5 + 5 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 5 plus 5 ? » |
| 318,0 | 1,3 | notion | 5 + 5 = ? | rien à toucher | « Exactement ! » |
| 319,3 | 5,1 | notion | 9 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 9 plus 1 ? » |
| 324,4 | 1,3 | notion | 9 + 1 = ? | rien à toucher | « Exactement ! » |
| 325,7 | 5,1 | notion | 2 + 8 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 8 ? » |
| 330,8 | 1,1 | notion | 2 + 8 = ? | rien à toucher | « Bravo ! » |
| 331,9 | 7,8 | notion | 1 + 9 = ? | toucher : passer l'exemple | « Regarde la boîte à dix places : 1 poissons. » « 1 plus 9, ça fait 10. » « À toi ! Tape la réponse. » |
| 339,7 | 4,9 | notion | 1 + 9 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 9 ? » |
| 344,6 | 1,1 | notion | 1 + 9 = ? | rien à toucher | « Super ! » |
| 345,7 | 4,9 | notion | 8 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 8 plus 2 ? » |
| 350,6 | 1,1 | notion | 8 + 2 = ? | rien à toucher | « Super ! » |
| 351,7 | 5,1 | notion | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 1 ? » |
| 356,8 | 1,1 | notion | 1 + 1 = ? | rien à toucher | « Bien joué ! » |
| 358,0 | 4,9 | notion | 2 + 8 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 8 ? » |
| 362,9 | 1,4 | notion | 2 + 8 = ? | rien à toucher | « Exactement ! » |
| 364,3 | 4,9 | notion | 3 + 7 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 7 ? » |
| 369,2 | 1,1 | notion | 3 + 7 = ? | rien à toucher | « Bravo ! » |
| 370,3 | 5,2 | notion | 7 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 7 plus 3 ? » |
| 375,4 | 1,1 | notion | 7 + 3 = ? | rien à toucher | « Bien joué ! » |
| 376,5 | 5,2 | notion | 9 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 9 plus 1 ? » |
| 381,7 | 1,1 | notion | 9 + 1 = ? | rien à toucher | « Bravo ! » |
| 382,8 | 4,9 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 2 ? » |
| 387,7 | 1,3 | notion | 1 + 2 = ? | rien à toucher | « Exactement ! » |
| 389,0 | 5,2 | notion | 5 + 5 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 5 plus 5 ? » |
| 394,2 | 1,1 | notion | 5 + 5 = ? | rien à toucher | « Bien joué ! » |
| 395,3 | 5,1 | notion | 6 + 4 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 6 plus 4 ? » |
| 400,4 | 1,1 | notion | 6 + 4 = ? | rien à toucher | « Super ! » |
| 401,4 | 5,2 | notion | 4 + 6 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 6 ? » |
| 406,6 | 1,1 | notion | 4 + 6 = ? | rien à toucher | « Bravo ! » |
| 407,7 | 5,1 | notion | 2 + 8 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 8 ? » |
| 412,8 | 1,1 | notion | 2 + 8 = ? | rien à toucher | « Bravo ! » |
| 413,9 | 5,1 | notion | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 2 ? » |
| 419,0 | 1,1 | notion | 1 + 2 = ? | rien à toucher | « Bien joué ! » |
| 420,1 | 7,7 | notion | 1 + 9 = ? | toucher : passer l'exemple | « Regarde la boîte à dix places : 1 poissons. » « 1 plus 9, ça fait 10. » « À toi ! Tape la réponse. » |
| 427,8 | 4,9 | notion | 1 + 9 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 9 ? » |
| 432,7 | 1,6 | notion | 1 + 9 = ? | rien à toucher | « Oui, c'est ça ! » |
| 434,3 | 5,1 | notion | 7 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 7 plus 3 ? » |
| 439,5 | 1,1 | notion | 7 + 3 = ? | rien à toucher | « Super ! » |
| 440,5 | 5,0 | notion | 5 + 5 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 5 plus 5 ? » |
| 445,5 | 1,1 | notion | 5 + 5 = ? | rien à toucher | « Bravo ! » |
| 446,6 | 5,1 | notion | 9 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 9 plus 1 ? » |
| 451,7 | 1,1 | notion | 9 + 1 = ? | rien à toucher | « Bien joué ! » |
| 452,8 | 28,2 | recompense | — | rien à toucher | « Bravo ! Ce soir, tu as gagné 61 étoiles de mer. » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » « Qu'est-ce qu'il y a dedans ? » « C'est la crevette ! Quand elle a peur, la crevette file à reculons, d'un grand coup de queue. Cette créature va vivre dans ton récif ! » |
| 481,0 | 0,4 | recompense | — | toucher : c'est bon |  |
| 481,4 | 1,9 | recompense | — | rien à toucher | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 483,3 | 0,5 | recompense | — | toucher : ouvrir le coquillage |  |
| 483,8 | 14,3 | recompense | — | rien à toucher | « Qu'est-ce qu'il y a dedans ? » « C'est l'anémone de mer ! Oh ! Elle est brillante ! L'anémone de mer ressemble à une fleur, mais c'est un animal ! Cette créature va vivre dans ton récif ! » |
| 498,1 | 0,5 | recompense | — | toucher : c'est bon |  |
| 498,6 | 0,5 | recompense | — | rien à toucher |  |
| 499,1 | 3,2 | accueil | — | toucher : le récif ; l'album ; encore | « Tu as bien travaillé. À demain ! » |

## Attentes sans rien à toucher (1,5 s ou plus)

| de (s) | à (s) | durée (s) | étape | dit pendant l'attente |
| --- | --- | --- | --- | --- |
| 4,9 | 8,6 | 3,7 | accueil | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 76,2 | 77,8 | 1,6 | echauffement | « Oui, c'est ça ! » |
| 89,1 | 93,8 | 4,6 | notion | « Exactement ! » « Maintenant, les additions, avec le bernard-l'ermite ! » |
| 221,0 | 222,6 | 1,6 | notion | « Oui, c'est ça ! » |
| 233,9 | 235,5 | 1,6 | notion | « Oui, c'est ça ! » |
| 240,5 | 242,1 | 1,6 | notion | « Oui, c'est ça ! » |
| 259,9 | 261,5 | 1,6 | notion | « Oui, c'est ça ! » |
| 298,3 | 300,0 | 1,6 | notion | « Oui, c'est ça ! » |
| 311,2 | 312,8 | 1,6 | notion | « Oui, c'est ça ! » |
| 432,7 | 434,3 | 1,6 | notion | « Oui, c'est ça ! » |
| 451,7 | 481,0 | 29,3 | recompense | « Bien joué ! » « Bravo ! Ce soir, tu as gagné 61 étoiles de mer. » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » « Qu'est-ce qu'il y a dedans ? » « C'est la crevette ! Quand elle a peur, la crevette file à reculons, d'un grand coup de queue. Cette créature va vivre dans ton récif ! » |
| 481,4 | 483,3 | 1,9 | recompense | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 483,8 | 498,1 | 14,3 | recompense | « Qu'est-ce qu'il y a dedans ? » « C'est l'anémone de mer ! Oh ! Elle est brillante ! L'anémone de mer ressemble à une fleur, mais c'est un animal ! Cette créature va vivre dans ton récif ! » |
