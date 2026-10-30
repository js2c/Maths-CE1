# Le temps de démarrage sur le banc Android (profil s5e) : mesure et proposition

Lot « Correctifs des relectures », 30 octobre 2026. **Mesure et proposition seulement : rien n'est changé dans l'application.**

Outil : `node tests/e2e/demarrage-temps.mjs --profil s5e --relances 10` (l'application installée, service worker, processeur ralenti 4 fois, écran de démarrage touché pour de vrai ; dix relances, une sur deux le navigateur tué). Budget de `CLAUDE.md` : démarrage en moins de 3 s. « Prêt » : « Toucher pour continuer » paraît. Les variantes ont été mesurées sur des copies de `app/` à part (`--racine`), le même jour, avec le même outil.

## Le code de la branche

| Mesure (10 relances) | Temps |
| --- | --- |
| première image (l'écran de démarrage) | 642 à 1 865 ms (médiane 834) |
| **prêt** | **3 262 à 4 758 ms (médiane 3 654)** |
| accueil, après le toucher | 4 649 à 6 000 ms (médiane 5 000) |
| les 17 vidéos de la mascotte lues en entier | 1 856 à 3 132 ms (médiane 2 229) |
| premier lancement (rien en cache) | première image 1 155 ms, prêt 6 082 ms |

La première image tient largement le budget ; « prêt » le dépasse d'environ 0,65 s en médiane. Le lot « Banc Android » avait mesuré 2,6 à 3,1 s sur le même profil le 19 octobre, avec `journee.mjs` : le banc imite le processeur de la tablette en ralentissant celui de la machine, dont la charge varie d'un jour à l'autre ; les chiffres ci-dessous se comparent entre eux (même outil, même jour), pas à ceux du 19.

## Où passe le temps (copie instrumentée, repères « etape: » posés dans `main.js` et `engine/lagon.js`)

Relance typique (médianes de cinq relances, ms) :

| Étape | Durée |
| --- | --- |
| la page, puis le code jusqu'au début de `main.js` | 450 à 600 (davantage quand la machine est chargée : la première image varie de 0,6 à 2,2 s) |
| l'atlas, le logo, la planche du démarrage | 150 à 300 |
| les neuf premiers contenus, dont l'index de la voix (577 Ko) | 950 à 1 550 : ils passent par le service worker en même temps que les 17 vidéos de la mascotte (7,5 Mo) |
| les huit autres contenus, la base de données | 100 à 250 |
| les cinq planches du premier écran (fichiers et décodage) | 220 à 360 |
| **le lagon : le miroitement de la surface (un contexte WebGL et son programme)** | **480 à 600** |
| le reste du lagon (algues, faisceaux, poissons, fond) | 150 à 300 |
| le son, le trésor, la suite de `main.js` | 150 à 250 |

## Les variantes essayées (copies à part, non appliquées)

| Variante | Prêt, médiane (min à max) | Effet |
| --- | --- | --- |
| la branche | 3 654 (3 262 à 4 758) | — |
| les planches du premier écran chargées en même temps que les contenus | 3 616 (3 242 à 5 083) | aucun : le décodage s'allonge d'autant |
| « tortue » et « poissons » chargées après « prêt » (elles ne servent qu'à la surprise et aux exercices) | 3 594 (3 100 à 4 794) | aucun |
| la même chose, et seulement 6 vidéos de la mascotte attendues (les 11 autres chargées ensuite) | 3 783 (3 158 à 4 693) | aucun |
| les vidéos lancées après les contenus (6 relances) | 4 688 (3 287 à 5 037) | les contenus vont vite (0,3 s), les planches ralentissent d'autant |
| **le miroitement de la surface créé après « prêt »** | **2 934 (2 469 à 4 169)** | **− 0,7 s : sous le budget en médiane** |

Sur le banc, l'ordre des chargements ne change rien : le processeur ralenti est la limite, et seul un travail retiré du chemin fait gagner. Le seul gros bloc qu'on peut retirer sans rien changer à ce que voit l'enfant est le miroitement de la surface : il est en haut de la scène, sous l'écran de démarrage opaque, et ne sert qu'une fois l'accueil montré.

## Proposition (à décider ; non appliquée)

1. **Créer le miroitement de la surface du lagon après « prêt »**, pendant que l'écran de démarrage attend le toucher (`Lagon` : `makeSurface` sorti du constructeur et appelé par `main.js` juste après `attendreToucher`). Gain mesuré sur le banc : 0,7 s (médiane 3,65 s → 2,93 s). Pour l'enfant, rien ne change : l'écran de démarrage attend de toute façon son toucher, qui vient plus tard. À vérifier en le faisant : la place et la taille du miroitement (`sizeCanvases`), l'allègement de niveau 2, et la perte du contexte WebGL (déjà gérée).
2. **Regarder d'abord les temps réels de la tablette** (journal technique de l'espace parent, ligne « lancement » : « prête en … ») : sur le banc, le WebGL est dessiné en logiciel ; sur la Galaxy Tab S5e, la création du miroitement est sans doute bien plus courte, et le budget peut être déjà tenu.
3. Ne pas changer l'ordre des chargements ni le nombre de vidéos attendues : aucun gain mesuré.

Les journaux des mesures : `tests/e2e/out/demarrage-temps/` (non versionné) ; le parcours de mesure garde tous les chiffres de chaque lancement dans `s5e.json`.
