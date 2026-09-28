# Partie D · ligne graduée (module 1) : une séance à vitesse réelle

Voix réelle (fichiers Piper), base neuve (première séance : choix du nom de la pieuvre), réponse 4.5 s après pouvoir répondre ; outil `tests/recette-fonctionnelle/d-vitesse-reelle.mjs --cas ligne`, paramètre de l'application `?module=1`.

- **durée totale** : 8 min 47 s (527,4 s)
- durée par étape : accueil 11,8 s ; echauffement 81,4 s ; notion 356,5 s ; recompense 77,1 s
- **attentes sans rien à toucher** (hors réécouter, maison, espace parent) : 55 en tout, 166,0 s cumulées ; 40 de 1,5 s ou plus (tableau plus bas)
- erreurs de page : aucune

## Chronologie

Un moment = tant que l'étape, ce qui est affiché et ce qui est attendu de l'enfant ne changent pas (relevé toutes les 250 ms). « dit » : les phrases qui commencent pendant ce moment (relevées au quart de seconde près : une phrase dite juste au changement peut apparaître au moment suivant). Hors question, les bulles-réponses, le pavé, « je ne sais pas » et le coquillage (aide) restent affichés mais sont bloqués : ils ne sont pas comptés comme « à toucher ».

| début (s) | durée (s) | étape | affiché | attendu de l'enfant | dit |
| --- | --- | --- | --- | --- | --- |
| 0,6 | 2,3 | accueil | — | toucher : noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Coucou ! Je suis une petite pieuvre, et je n'ai pas encore de nom. Touche un nom pour l'écouter. » |
| 2,9 | 2,3 | accueil | — | toucher : c'est bon ; noms proposés : Pili, Octavie, Bulle, Coralie, Plouf, Mimosa | « Pili ! » « Si tu veux que je m'appelle Pili, touche la coche verte. » |
| 5,2 | 3,8 | accueil | — | rien à toucher | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 8,9 | 0,3 | accueil | — | toucher : crans : facile, conseille, dur, tresdur ; valider | « Choisis ton niveau. Plus c'est dur, plus tu gagnes d'étoiles ! » |
| 9,2 | 6,0 | echauffement | — | toucher : passer l'échauffement | « On commence par s'échauffer avec des additions ! » « Tape la réponse, puis touche la coche verte. » |
| 15,2 | 5,2 | echauffement | 8 + 0 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 8 plus 0 ? » |
| 20,4 | 1,4 | echauffement | 8 + 0 = ? | rien à toucher | « Exactement ! » |
| 21,8 | 5,1 | echauffement | 7 + 0 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 7 plus 0 ? » |
| 26,9 | 1,1 | echauffement | 7 + 0 = ? | rien à toucher | « Super ! » |
| 28,0 | 5,8 | echauffement | 8 + 0 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 8 plus 0 ? » |
| 33,8 | 4,6 | echauffement | 8 + 0 = ? | toucher : passer la correction | « Ce n'est pas grave, regardons ensemble. » « 8 plus 0, ça fait 8. » |
| 38,4 | 5,1 | echauffement | 1 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 1 ? » |
| 43,5 | 1,3 | echauffement | 1 + 1 = ? | rien à toucher | « Exactement ! » |
| 44,8 | 6,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 50,9 | 1,7 | echauffement | 2 + 1 = ? | toucher : passer la correction | « 2 plus 1, ça fait 3. » |
| 52,6 | 5,1 | echauffement | 1 + 2 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 1 plus 2 ? » |
| 57,7 | 1,6 | echauffement | 1 + 2 = ? | rien à toucher | « Oui, c'est ça ! » |
| 59,3 | 4,9 | echauffement | 3 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 3 plus 1 ? » |
| 64,1 | 1,3 | echauffement | 3 + 1 = ? | rien à toucher | « Exactement ! » |
| 65,5 | 5,1 | echauffement | 1 + 3 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 1 plus 3 ? » |
| 70,5 | 1,6 | echauffement | 1 + 3 = ? | rien à toucher | « Oui, c'est ça ! » |
| 72,1 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « Combien font 2 plus 1 ? » |
| 77,2 | 1,1 | echauffement | 2 + 1 = ? | rien à toucher | « Bien joué ! » |
| 78,3 | 5,1 | echauffement | 4 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 4 plus 1 ? » |
| 83,4 | 1,0 | echauffement | 4 + 1 = ? | rien à toucher | « Bien joué ! » |
| 84,4 | 5,1 | echauffement | 2 + 1 = ? | répondre (pavé : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, effacer, valider ; je ne sais pas) | « 2 plus 1 ? » |
| 89,5 | 1,1 | echauffement | 2 + 1 = ? | rien à toucher | « Bien joué ! » |
| 90,6 | 34,7 | notion | leçon animée | toucher : rejouer la leçon ; passer la leçon | « Regarde cette corde avec ses bouées. » « Chaque bouée a sa place, et elles sont toutes à la même distance. » « La petite tortue est sur zéro. » « Elle n'a pas encore sauté. » « Hop, un saut : » « elle est sur 1. » « Hop, un deuxième saut : » « elle est sur 2. » « Tu vois ? On ne compte pas les bouées, on compte les sauts. » « Pour trouver où est l'étoile de mer, compte les sauts depuis zéro. » « 1 » « 2 » « 3 » « 4 » « 5 » « 6 » |
| 125,4 | 0,5 | notion | — | rien à toucher |  |
| 125,9 | 4,9 | notion | ligne 0–10 (lire, étoile sur 5) | répondre (je ne sais pas ; bulles-réponses : 4, 5, 6) | « À toi ! Combien de sauts jusqu'à l'étoile ? » |
| 130,8 | 1,6 | notion | ligne 0–10 (lire, étoile sur 5) | rien à toucher | « Super ! » |
| 132,4 | 5,0 | notion | ligne 0–10 (lire, étoile sur 8) | répondre (je ne sais pas ; bulles-réponses : 2, 8, 9) | « L'étoile de mer est posée sur une bouée. Quel est ce nombre ? » |
| 137,5 | 1,6 | notion | ligne 0–10 (lire, étoile sur 8) | rien à toucher | « Exactement ! » |
| 139,1 | 0,3 | notion | — | rien à toucher |  |
| 139,3 | 5,1 | notion | ligne 0–10 (sauter) | répondre (je ne sais pas ; bulles-réponses : 3, 7, 8) | « La tortue est sur 5 et fait 3 sauts. Où arrive-t-elle ? » |
| 144,4 | 6,5 | notion | ligne 0–10 (sauter) | rien à toucher | « Oui, c'est ça ! » « 1 » « 2 » « 3 » |
| 150,9 | 11,0 | notion | ligne 0–10 (lire, étoile sur 2) | répondre (je ne sais pas ; bulles-réponses : 2, 3, 8) | « L'étoile de mer est posée sur une bouée. Quel est ce nombre ? » |
| 161,9 | 1,6 | notion | ligne 0–10 (lire, étoile sur 2) | rien à toucher | « Exactement ! » |
| 163,6 | 5,9 | notion | ligne 0–10 (sauter) | répondre (je ne sais pas ; bulles-réponses : 1, 2, 3) | « La tortue est sur 2 et fait un saut. Où arrive-t-elle ? » |
| 169,5 | 4,6 | notion | ligne 0–10 (sauter) | toucher : passer la correction | « La tortue part de 2, pas de zéro. » « 1 » « C'était 3. » |
| 174,1 | 5,0 | notion | ligne 0–10 (lire, étoile sur 4) | répondre (je ne sais pas ; bulles-réponses : 4, 5, 6) | « Quel nombre se cache sous l'étoile de mer ? » |
| 179,1 | 1,6 | notion | ligne 0–10 (lire, étoile sur 4) | rien à toucher | « Bien joué ! » |
| 180,8 | 4,8 | notion | ligne 0–10 (sauter) | répondre (je ne sais pas ; bulles-réponses : 1, 4, 5) | « La tortue part de 4. Elle fait un saut. Sur quel nombre arrive-t-elle ? » |
| 185,6 | 3,0 | notion | ligne 0–10 (sauter) | rien à toucher | « Super ! » « 1 » |
| 188,5 | 0,3 | notion | — | rien à toucher |  |
| 188,8 | 4,9 | notion | ligne 0–10 (lire, étoile sur 1) | répondre (je ne sais pas ; bulles-réponses : 1, 2, 9) | « Quel nombre se cache sous l'étoile de mer ? » |
| 193,7 | 1,6 | notion | ligne 0–10 (lire, étoile sur 1) | rien à toucher | « Bravo ! » |
| 195,3 | 5,1 | notion | ligne 0–10 (sauter) | répondre (je ne sais pas ; bulles-réponses : 1, 2, 3) | « La tortue est sur 2 et fait un saut. Où arrive-t-elle ? » |
| 200,4 | 3,3 | notion | ligne 0–10 (sauter) | rien à toucher | « Exactement ! » « 1 » |
| 203,6 | 5,1 | notion | ligne 0–10 (sauter) | répondre (je ne sais pas ; bulles-réponses : 1, 8, 9) | « La tortue part de 8. Elle fait un saut. Sur quel nombre arrive-t-elle ? » |
| 208,7 | 3,5 | notion | ligne 0–10 (sauter) | rien à toucher | « Oui, c'est ça ! » « 1 » |
| 212,2 | 5,0 | notion | ligne 0–10 (lire, étoile sur 7) | répondre (je ne sais pas ; bulles-réponses : 3, 7, 8) | « Quel nombre se cache sous l'étoile de mer ? » |
| 217,3 | 1,6 | notion | ligne 0–10 (lire, étoile sur 7) | rien à toucher | « Exactement ! » |
| 218,9 | 5,0 | notion | ligne 0–10 (placer 2) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Où est le nombre 2 ? Pose le poisson dessus. » |
| 223,9 | 1,6 | notion | ligne 0–10 (placer 2) | rien à toucher | « Bien joué ! » |
| 225,5 | 4,9 | notion | ligne 0–10 (lire, étoile sur 4) | répondre (je ne sais pas ; bulles-réponses : 4, 5, 6) | « Quel nombre se cache sous l'étoile de mer ? » |
| 230,4 | 2,2 | notion | ligne 0–10 (lire, étoile sur 4) | rien à toucher | « Oui, c'est ça ! » |
| 232,5 | 4,8 | notion | ligne 0–10 (placer 6) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Où est le nombre 6 ? Pose le poisson dessus. » |
| 237,3 | 1,3 | notion | ligne 0–10 (placer 6) | rien à toucher | « Bravo ! » |
| 238,6 | 0,3 | notion | ligne 0–10 (lire, étoile sur 1) | rien à toucher |  |
| 238,9 | 5,0 | notion | ligne 0–10 (lire, étoile sur 1) | répondre (je ne sais pas ; bulles-réponses : 1, 2, 9) | « L'étoile de mer est posée sur une bouée. Quel est ce nombre ? » |
| 243,9 | 1,6 | notion | ligne 0–10 (lire, étoile sur 1) | rien à toucher | « Exactement ! » |
| 245,6 | 5,0 | notion | ligne 0–10 (placer 7) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Où est le nombre 7 ? Pose le poisson dessus. » |
| 250,6 | 1,6 | notion | ligne 0–10 (placer 7) | rien à toucher | « Bien joué ! » |
| 252,2 | 5,0 | notion | ligne 0–20 (lire, étoile sur 9) | répondre (je ne sais pas ; bulles-réponses : 8, 9, 10, 11) | « Quel nombre se cache sous l'étoile de mer ? » |
| 257,2 | 1,6 | notion | ligne 0–20 (lire, étoile sur 9) | rien à toucher | « Super ! » |
| 258,8 | 5,0 | notion | ligne 0–20 (placer 15) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Place le poisson sur le nombre 15. » |
| 263,8 | 1,6 | notion | ligne 0–20 (placer 15) | rien à toucher | « Exactement ! » |
| 265,4 | 5,0 | notion | ligne 0–20 (lire, étoile sur 1) | répondre (je ne sais pas ; bulles-réponses : 0, 1, 2, 19) | « Quel nombre se cache sous l'étoile de mer ? » |
| 270,4 | 1,4 | notion | ligne 0–20 (lire, étoile sur 1) | rien à toucher | « Bravo ! » |
| 271,8 | 5,0 | notion | ligne 0–20 (placer 13) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Place le poisson sur le nombre 13. » |
| 276,8 | 1,6 | notion | ligne 0–20 (placer 13) | rien à toucher | « Bravo ! » |
| 278,4 | 5,0 | notion | ligne 0–20 (lire, étoile sur 5) | répondre (je ne sais pas ; bulles-réponses : 4, 5, 6, 15) | « Quel nombre se cache sous l'étoile de mer ? » |
| 283,4 | 1,3 | notion | ligne 0–20 (lire, étoile sur 5) | rien à toucher | « Bravo ! » |
| 284,8 | 0,3 | notion | — | toucher : rejouer la leçon ; passer la leçon |  |
| 285,1 | 19,3 | notion | leçon animée | toucher : rejouer la leçon ; passer la leçon | « Oh ! Cette corde ne commence pas à zéro. » « Regarde le premier nombre : trente. » « La tortue part de trente. » « Un saut : trente-et-un. » « Deux sauts : trente-deux. » « Trois sauts : trente-trois. » « Quatre sauts : trente-quatre. » « Toujours commencer par regarder d'où on part. » |
| 304,4 | 0,5 | notion | — | rien à toucher |  |
| 304,9 | 5,0 | notion | ligne 80–90 (lire, étoile sur 85) | répondre (je ne sais pas ; bulles-réponses : 5, 58, 85, 86) | « À toi ! L'étoile de mer est posée sur une bouée. Quel est ce nombre ? » |
| 309,9 | 1,6 | notion | ligne 80–90 (lire, étoile sur 85) | rien à toucher | « Bien joué ! » |
| 311,6 | 5,0 | notion | ligne 20–30 (placer 25) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Où est le nombre 25 ? Pose le poisson dessus. » |
| 316,6 | 1,4 | notion | ligne 20–30 (placer 25) | rien à toucher | « Bravo ! » |
| 317,9 | 4,8 | notion | ligne 70–80 (lire, étoile sur 72) | répondre (je ne sais pas ; bulles-réponses : 2, 27, 72, 73) | « Quel nombre se cache sous l'étoile de mer ? » |
| 322,8 | 1,6 | notion | ligne 70–80 (lire, étoile sur 72) | rien à toucher | « Exactement ! » |
| 324,4 | 0,3 | notion | ligne 80–90 (placer 86) | rien à toucher |  |
| 324,7 | 5,0 | notion | ligne 80–90 (placer 86) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Place le poisson sur le nombre 86. » |
| 329,7 | 1,3 | notion | ligne 80–90 (placer 86) | rien à toucher | « Bravo ! » |
| 331,0 | 0,3 | notion | — | rien à toucher |  |
| 331,3 | 5,1 | notion | ligne 60–70 (lire, étoile sur 67) | répondre (je ne sais pas ; bulles-réponses : 7, 67, 68, 76) | « L'étoile de mer est posée sur une bouée. Quel est ce nombre ? » |
| 336,3 | 1,6 | notion | ligne 60–70 (lire, étoile sur 67) | rien à toucher | « Super ! » |
| 337,9 | 5,0 | notion | ligne 50–60 (placer 57) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Place le poisson sur le nombre 57. » |
| 342,9 | 1,6 | notion | ligne 50–60 (placer 57) | rien à toucher | « Super ! » |
| 344,5 | 21,3 | notion | leçon animée | toucher : rejouer la leçon ; passer la leçon | « Sur cette corde-ci, les bouées sont des bouées géantes. » « Entre deux bouées géantes, il y a un filet de dix poissons. » « Alors chaque saut vaut dix ! » « On compte : » « dix, » « vingt, » « trente… » « Pour savoir comment compter, regarde les nombres écrits : » « ils te disent ce que vaut un saut. » |
| 365,8 | 0,6 | notion | — | rien à toucher |  |
| 366,4 | 4,8 | notion | ligne 0–100 (lire, étoile sur 30) | répondre (je ne sais pas ; bulles-réponses : 3, 30, 40, 70) | « À toi ! L'étoile de mer est posée sur une bouée. Quel est ce nombre ? » |
| 371,2 | 2,2 | notion | ligne 0–100 (lire, étoile sur 30) | rien à toucher | « Oui, c'est ça ! » |
| 373,4 | 5,0 | notion | ligne 0–100 (lire, étoile sur 70) | répondre (je ne sais pas ; bulles-réponses : 7, 30, 70, 80) | « Quel nombre se cache sous l'étoile de mer ? » |
| 378,4 | 2,2 | notion | ligne 0–100 (lire, étoile sur 70) | rien à toucher | « Oui, c'est ça ! » |
| 380,6 | 4,8 | notion | ligne 0–100 (placer 80) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Place le poisson sur le nombre 80. » |
| 385,3 | 1,7 | notion | ligne 0–100 (placer 80) | rien à toucher | « Exactement ! » |
| 387,0 | 5,1 | notion | ligne 0–100 (lire, étoile sur 40) | répondre (je ne sais pas ; bulles-réponses : 4, 40, 50, 60) | « Quel nombre se cache sous l'étoile de mer ? » |
| 392,1 | 1,6 | notion | ligne 0–100 (lire, étoile sur 40) | rien à toucher | « Exactement ! » |
| 393,7 | 5,0 | notion | ligne 0–100 (placer 30) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Place le poisson sur le nombre 30. » |
| 398,7 | 1,3 | notion | ligne 0–100 (placer 30) | rien à toucher | « Bravo ! » |
| 400,0 | 5,0 | notion | ligne 0–100 (lire, étoile sur 90) | répondre (je ne sais pas ; bulles-réponses : 9, 10, 90, 100) | « Quel nombre se cache sous l'étoile de mer ? » |
| 405,1 | 1,6 | notion | ligne 0–100 (lire, étoile sur 90) | rien à toucher | « Super ! » |
| 406,7 | 5,0 | notion | ligne 80–100 (placer 96) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Place le poisson sur le nombre 96. » |
| 411,7 | 1,6 | notion | ligne 80–100 (placer 96) | rien à toucher | « Super ! » |
| 413,3 | 5,0 | notion | ligne 30–50 (lire, étoile sur 32) | répondre (je ne sais pas ; bulles-réponses : 2, 23, 32, 33) | « Quel nombre se cache sous l'étoile de mer ? » |
| 418,3 | 2,1 | notion | ligne 30–50 (lire, étoile sur 32) | rien à toucher | « Oui, c'est ça ! » |
| 420,4 | 5,0 | notion | ligne 40–60 (placer 44) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Où est le nombre 44 ? Pose le poisson dessus. » |
| 425,4 | 1,6 | notion | ligne 40–60 (placer 44) | rien à toucher | « Exactement ! » |
| 427,0 | 5,1 | notion | ligne 80–100 (lire, étoile sur 83) | répondre (je ne sais pas ; bulles-réponses : 3, 38, 83, 84) | « Quel nombre se cache sous l'étoile de mer ? » |
| 432,1 | 1,6 | notion | ligne 80–100 (lire, étoile sur 83) | rien à toucher | « Super ! » |
| 433,7 | 4,8 | notion | ligne 50–70 (placer 58) | répondre (bande de la ligne (poser le poisson) ; je ne sais pas) | « Où est le nombre 58 ? Pose le poisson dessus. » |
| 438,5 | 1,6 | notion | ligne 50–70 (placer 58) | rien à toucher | « Bien joué ! » |
| 440,1 | 4,9 | notion | ligne 0–100 (lire, étoile sur 80) | répondre (je ne sais pas ; bulles-réponses : 8, 20, 80, 90) | « L'étoile de mer est posée sur une bouée. Quel est ce nombre ? » |
| 445,0 | 2,1 | notion | ligne 0–100 (lire, étoile sur 80) | rien à toucher | « Oui, c'est ça ! » |
| 447,1 | 43,1 | recompense | — | rien à toucher | « Bravo ! Ce soir, tu as gagné 58 étoiles de mer. » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » |
| 490,2 | 0,4 | recompense | — | toucher : ouvrir le coquillage |  |
| 490,6 | 14,0 | recompense | — | rien à toucher | « Qu'est-ce qu'il y a dedans ? » « C'est le poisson-chirurgien ! Le poisson-chirurgien a une petite lame de chaque côté de la queue, comme le couteau d'un chirurgien. Cette créature va vivre dans ton récif ! » |
| 504,7 | 0,4 | recompense | — | toucher : c'est bon |  |
| 505,1 | 1,8 | recompense | — | rien à toucher | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 506,9 | 0,4 | recompense | — | toucher : ouvrir le coquillage |  |
| 507,3 | 16,1 | recompense | — | rien à toucher | « Qu'est-ce qu'il y a dedans ? » « C'est le poisson-clown ! Oh ! Elle est brillante ! Le poisson-clown vit dans une anémone de mer. Elle pique les autres poissons, mais pas lui ! Cette créature va vivre dans ton récif ! » |
| 523,3 | 0,4 | recompense | — | toucher : c'est bon |  |
| 523,7 | 0,5 | recompense | — | rien à toucher |  |
| 524,2 | 3,2 | accueil | — | toucher : le récif ; l'album ; encore | « C'est fini pour aujourd'hui. À demain ! » |

## Attentes sans rien à toucher (1,5 s ou plus)

| de (s) | à (s) | durée (s) | étape | dit pendant l'attente |
| --- | --- | --- | --- | --- |
| 5,2 | 8,9 | 3,8 | accueil | « Youpi ! Maintenant, je m'appelle Pili. Merci ! » |
| 57,7 | 59,3 | 1,6 | echauffement | « Oui, c'est ça ! » |
| 70,5 | 72,1 | 1,6 | echauffement | « Oui, c'est ça ! » |
| 130,8 | 132,4 | 1,6 | notion | « Super ! » |
| 137,5 | 139,3 | 1,9 | notion | « Exactement ! » |
| 144,4 | 150,9 | 6,5 | notion | « Oui, c'est ça ! » « 1 » « 2 » « 3 » |
| 161,9 | 163,6 | 1,6 | notion | « Exactement ! » |
| 179,1 | 180,8 | 1,6 | notion | « Bien joué ! » |
| 185,6 | 188,8 | 3,2 | notion | « Super ! » « 1 » |
| 193,7 | 195,3 | 1,6 | notion | « Bravo ! » |
| 200,4 | 203,6 | 3,3 | notion | « Exactement ! » « 1 » |
| 208,7 | 212,2 | 3,5 | notion | « Oui, c'est ça ! » « 1 » |
| 217,3 | 218,9 | 1,6 | notion | « Exactement ! » |
| 223,9 | 225,5 | 1,6 | notion | « Bien joué ! » |
| 230,4 | 232,5 | 2,2 | notion | « Oui, c'est ça ! » |
| 237,3 | 238,9 | 1,6 | notion | « Bravo ! » |
| 243,9 | 245,6 | 1,6 | notion | « Exactement ! » |
| 250,6 | 252,2 | 1,6 | notion | « Bien joué ! » |
| 257,2 | 258,8 | 1,6 | notion | « Super ! » |
| 263,8 | 265,4 | 1,6 | notion | « Exactement ! » |
| 276,8 | 278,4 | 1,6 | notion | « Bravo ! » |
| 309,9 | 311,6 | 1,6 | notion | « Bien joué ! » |
| 322,8 | 324,7 | 1,9 | notion | « Exactement ! » |
| 329,7 | 331,3 | 1,6 | notion | « Bravo ! » |
| 336,3 | 337,9 | 1,6 | notion | « Super ! » |
| 342,9 | 344,5 | 1,6 | notion | « Super ! » |
| 371,2 | 373,4 | 2,2 | notion | « Oui, c'est ça ! » |
| 378,4 | 380,6 | 2,2 | notion | « Oui, c'est ça ! » |
| 385,3 | 387,0 | 1,7 | notion | « Exactement ! » |
| 392,1 | 393,7 | 1,6 | notion | « Exactement ! » |
| 405,1 | 406,7 | 1,6 | notion | « Super ! » |
| 411,7 | 413,3 | 1,6 | notion | « Super ! » |
| 418,3 | 420,4 | 2,1 | notion | « Oui, c'est ça ! » |
| 425,4 | 427,0 | 1,6 | notion | « Exactement ! » |
| 432,1 | 433,7 | 1,6 | notion | « Super ! » |
| 438,5 | 440,1 | 1,6 | notion | « Bien joué ! » |
| 445,0 | 490,2 | 45,3 | recompense | « Oui, c'est ça ! » « Bravo ! Ce soir, tu as gagné 58 étoiles de mer. » « Et en plus, dix étoiles parce que tu as fini ta séance ! » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » « Tu as assez d'étoiles pour ouvrir un coquillage ! Touche-le. » |
| 490,6 | 504,7 | 14,0 | recompense | « Qu'est-ce qu'il y a dedans ? » « C'est le poisson-chirurgien ! Le poisson-chirurgien a une petite lame de chaque côté de la queue, comme le couteau d'un chirurgien. Cette créature va vivre dans ton récif ! » |
| 505,1 | 506,9 | 1,8 | recompense | « Et tu peux en ouvrir encore un ! Touche-le. » |
| 507,3 | 523,3 | 16,1 | recompense | « Qu'est-ce qu'il y a dedans ? » « C'est le poisson-clown ! Oh ! Elle est brillante ! Le poisson-clown vit dans une anémone de mer. Elle pique les autres poissons, mais pas lui ! Cette créature va vivre dans ton récif ! » |
