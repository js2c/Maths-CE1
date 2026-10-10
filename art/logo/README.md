# Maquette — le logo de l'écran de démarrage

**Maquette validée par le parent le 10 octobre 2026.** Elle est intégrée dans l'application au lot « Correctifs : passage de l'échauffement aux voiliers » (`docs/LOTS.md`, fiche 8, point 9). Aucun fichier sous `app/` n'est modifié par cette maquette.

**Ce qu'a demandé le parent** : partir de son image (`reference.jpg`) ; des bulles d'air qui montent ; un léger va-et-vient du texte, d'avant en arrière ; une étoile qui fait un tour sur elle-même, s'arrête, et reprend 2 s plus tard ; des rayons de soleil dans l'eau, comme dans le lagon ; la barre de chargement, inchangée.

**C'est une exception à la règle « tout est dessiné dans l'atelier »**, comme le lagon, la mascotte, les voiliers et le récif : le texte et l'étoile sont des images découpées dans la référence. Les bulles, les étincelles et les faisceaux, eux, sont dessinés en code.

| Fichier | Rôle |
| --- | --- |
| `reference.jpg` | L'image donnée par le parent (2400 × 1792). Elle ne contient ni prénom ni donnée personnelle. |
| `decoupe.py` | Le découpage : il sépare le texte et l'étoile de l'eau et écrit `images/`. Il est déterministe. On le relance seulement si la référence change : `python art/logo/decoupe.py` (il faut numpy, scipy et Pillow). |
| `images/texte@1x.webp`, `texte@2x.webp` | « Maths CE1 » détouré, avec son contour, son relief et ses reflets (684 × 447 px de scène ; 56 et 138 Ko). |
| `images/etoile@1x.webp`, `etoile@2x.webp` | L'étoile, à part, parce qu'elle tourne (112 × 113 px de scène). |
| `images/ombre.webp` | L'ombre du texte, floue, en basse résolution (10 Ko). Elle bouge avec le texte. |
| `images/position.json` | La place et la taille de chaque calque dans la scène de 1280 × 800. |
| `images/barre-*.webp`, `images/info.png` | Des copies de la barre de chargement et de la ligne « 2026 · js2c · version » de l'application, pour la maquette seulement. L'application garde les siennes. |
| `index.html` | La maquette : la scène, les mouvements, un chargement simulé, et un compteur d'images par seconde en bas à droite. |

**Tester** : depuis la racine du dépôt, lancer `python -m http.server 8080`, puis ouvrir `http://localhost:8080/art/logo/`. Un toucher, une fois le chargement fini, fait disparaître l'écran ; la maquette recommence ensuite.

## Les mouvements (les valeurs à reprendre telles quelles)

- **Le va-et-vient du texte** : tout le logo (texte, ombre et étoile) grandit et rétrécit doucement, de 0,975 à 1,03, en montant de 8 px. Un cycle dure 3,6 s, en douceur à chaque bout. L'ombre suit à contre-temps : quand le texte s'approche, elle s'éloigne (de 10 à 24 px vers le bas) et pâlit. Ce sont des transformations CSS seulement : rien n'est redessiné.
- **L'étoile** : elle fait un tour (360°) en 1,2 s, puis reste immobile 2 s, et ainsi de suite. Sa lumière est peinte dans l'image et tourne avec elle ; sur un tour aussi court, cela ne se voit pas.
- **Les faisceaux** : le code des faisceaux du lagon (`app/js/engine/lagon.js`, maquette du récif vivant), avec les mêmes textures, la même respiration et la même dérive. Ils sont posés de −380 à 1420 px, un peu plus vifs au centre, et redessinés 20 fois par seconde, dans un canvas à la résolution 1x.
- **Les bulles** : six tailles, dessinées une fois en petites images puis seulement posées. Une colonne de 9 bulles monte à droite du « s », comme dans la référence ; 4 petites montent de l'étoile ; 22 montent dans toute l'eau. Elles oscillent, se déforment à peine, accélèrent selon leur taille et s'effacent en haut. Elles passent derrière le logo.
- **Les étincelles** : 8 petites croix dorées qui scintillent près des lettres, là où la référence en avait de fixes.
- **La barre et la ligne d'information** : celles de l'application, à la même place. Une fois le chargement fini, la barre luit doucement.
