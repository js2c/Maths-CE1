# Maquette « Mise en scène des problèmes »

Préparée après le constat du parent du 5 novembre 2026 (l'écran des problèmes vide à 80 %), pour validation : `docs/maquettes/problemes-scene/PROPOSITION.md`. Rien ici n'est lu par l'application : `app/` n'est pas modifié, ni `art/problemes/contextes.json`.

| Fichier | Rôle |
| --- | --- |
| `objets.json` | **La bibliothèque des objets de l'histoire** (personnages, animaux, contenants, lieux de dépôt, unités) : les mots qui les désignent dans les énoncés, le prompt Nano Banana, le format, la taille dans la scène, le fond à détourer, les variantes. |
| `lieux.json` | Les 21 lieux à générer (et l'étal), **revus pour la mise en scène** : générés en 16:9 avec un bandeau sans détail en haut, recadrés par l'atelier à la forme de la scène (860 × 350) en retirant le haut, un sol libre en bas, un coin calme pour la bulle, aucun objet de l'histoire dans l'image. À reporter dans `contextes.json` si la maquette est validée. |
| `relever.mjs` | **Le relevé** : lit la banque (`app/content/problemes.json`) et `objets.json`, trouve les objets de chaque énoncé et leur rôle, compte ceux qui servent le plus ; `--md` écrit `docs/maquettes/problemes-scene/OBJETS.md` et `PROMPTS.md`. |
| `index.html`, `provisoires.js` | **La maquette des écrans clés** (cinq énoncés) : la mise en page, avec des images provisoires dessinées vite (`provisoires.js`) à la place des objets et des lieux à générer ; les étiquettes, la plaque, le pavé et les schémas sont ceux de l'application (`../dessins.js`). |
| `captures.mjs` | Les captures dans `docs/maquettes/problemes-scene/` (1280 × 800, petit smartphone, et l'écran d'aujourd'hui pris dans l'application) ; contrôle que la bulle ne couvre rien de ce qu'on touche. |
| `captures-vraies.mjs` | Les 15 mêmes écrans joués dans l'application, avec les images du parent (`docs/maquettes/problemes-scene/vraies/`), et côte à côte avec la maquette (`comparaison/`). |
| `scenes.mjs` | La première version de la scène de chaque énoncé dans la banque ; `--unites` refait seulement l'image de ce qu'on compte (`scene.unite`, et `scene.unites` quand l'histoire compte plusieurs sortes de choses). |
| `sources/` | Où déposer les objets générés (`<objet>.png`, `<objet>-<variante>.png`). |

```bash
node art/problemes/mise-en-scene/relever.mjs --md     # le relevé des objets, OBJETS.md et PROMPTS.md
node art/problemes/mise-en-scene/captures.mjs         # les captures (--sans-avant : sans l'écran d'aujourd'hui)
node art/problemes/mise-en-scene/captures-vraies.mjs  # les 15 écrans dans l'application, avec les vraies images
```

La maquette s'ouvre avec un serveur à la racine du dépôt, à l'adresse `/art/problemes/mise-en-scene/` (`?ecran=groupes-question`, ou les boutons en bas). Elle a besoin de `art/node_modules` pour les captures (`cd art && npm install`).
