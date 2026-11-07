# Contrôle des images déposées par le parent (7 novembre 2026)

Ce qui a été déposé dans `main` : **21 lieux** (`art/problemes/sources/`, JPEG de 2048 px de large, générés en 16:9, le cinquième du haut sans détail) et **137 objets et unités** (`art/problemes/mise-en-scene/sources/`, JPEG de 1280 px au plus). L'étal reprend l'image de l'étal du pêcheur.

`node art/tools/export-problemes.mjs` : **aucun fichier non reconnu, aucune image manquante** (les 137 noms de `PROMPTS.md` sont tous là ; chaque lieu a son image). Produit : 22 lieux et 136 objets (la perle retirée, ci-dessous) dans `app/assets/problemes/`.

## Les objets : le détourage

Planches regardées : `controle/objets-1.png` à `objets-5.png` (chaque objet sur un fond moitié sombre, moitié clair : un liseré vert ou magenta s'y verrait) et `controle/objets-damier.png` (les objets douteux en grand, sur un damier rouge : un trou ou une partie effacée laisserait voir le damier). Mesures faites sur chaque image en plus du regard : les pixels restés de la couleur du fond, la teinte des bords, les trous à l'intérieur de l'objet.

- **Aucun reste de vert ni de magenta**, aucun liseré coloré visible, **aucun objet entamé** : l'enfant au pull vert, le cerceau aux segments verts, la salade, la pastèque, le canard (fond vert, ou magenta quand c'est demandé) sont entiers.
- Les trous mesurés sont tous voulus : l'intérieur des cerceaux et du collier, les mailles du filet, les barreaux des balançoires, l'espace sous les tables et les bancs, l'anse des paniers et des seaux.
- Les objets transparents (la bouteille d'eau, le vase) gardent leur verre, légèrement teinté : c'est leur dessin.
- **L'outil n'a pas eu à être corrigé** : aucun défaut général.

## Les lieux : le recadrage

Planches regardées : `controle/lieux-1.png` et `lieux-2.png` (l'image telle que l'application la montre, avec en rouge la bande de la bulle et en vert la ligne où les objets ont le pied) et `controle/lieux-dans-l-application.png` (le marché, la boulangerie, le supermarché et l'atelier dans l'application).

- **Le sol entier en bas** dans les 21 lieux (27 % retirés en haut, rien en bas) ; rien d'important coupé en haut (le haut d'un rideau, d'un panier de basket, des arbres de la forêt).
- **La bande de la bulle** est calme presque partout (un mur, le ciel). Plus chargée : la cour (le bâtiment de l'école), le supermarché (les rayons), la rue du bus (les maisons) ; la bulle les couvre et reste lisible : pas à refaire.
- Le marché et la boulangerie ont une table et un comptoir au premier plan : c'est ce que leurs prompts demandaient (le bord d'une table d'étal, le haut d'un comptoir vide). Dans l'application, la marchande se tient derrière sa table, le boulanger devant son comptoir : lisible.

## L'échelle des objets entre eux

Vue dans les 15 écrans repris dans l'application (`vraies/`, `comparaison/`) et dans les captures du parcours : Papa (250 px) et la maîtresse dominent, le copain et la voisine sont des enfants, le chien est assis à hauteur de hanche, les sachets et les pots à mi-jambe, la gamelle au sol. Cohérente ; rien à changer dans `objets.json`.

Corrigé dans l'application pendant ce contrôle (les vraies tailles l'ont montré) :

- une étiquette plus grande que son objet (la trousse sous son « 8 ») le cachait : un petit objet reçoit maintenant son étiquette au-dessus de lui ;
- deux étiquettes empilées couvraient tout le seau des coquillages : la deuxième va à côté quand elles en couvriraient plus des deux tiers ;
- à la correction et au niveau 3, les étiquettes couvraient les contenants ouverts (on ne voyait pas les billes dans les boîtes) : une seule étiquette, à côté de la rangée, comme dans la maquette validée ; la plaque garde sa place sur le dépôt (les 18 gourmandises se voient dans la gamelle) ;
- les unités allongées (le crayon, la craie, la baguette) étaient réduites à un trait : elles gardent la surface des autres.

## Les icônes des unités

Branchées (décision 6 du 6 novembre : les icônes générées, de la même main que les objets) : l'image de ce qu'on compte remplace le dessin de l'atelier sur les étiquettes, sur la plaque, à la correction, au partage et au cran « plus facile ». 175 énoncés sur 200 ont l'image de ce qu'on compte (le champ `unite` de leur scène, écrit par `scenes.mjs --unites`). Quand l'histoire compte plusieurs sortes de choses (« 27 pommes de pin et 16 châtaignes », « 8 coquillages blancs et 5 roses », « 7 vaches et 9 moutons »), chaque étiquette a l'image de la sienne (le champ `unites`, 22 énoncés ; d'abord le jeton, changé après la relecture indépendante, qui y voyait des pièces d'or). Les choses sans image (billes, jetons, images, autocollants, points, pattes, euros, poissons) gardent le dessin de l'atelier.

## Images à refaire

| Image | Raison |
| --- | --- |
| `u-perle` | **Le prompt était faux** (une note de travail, « Dessinée par le code (perle). », à la place du sujet) : l'image montre une boule couverte de pseudo-écriture. Le prompt est corrigé dans `PROMPTS.md` (une perle de bois peinte, le trou visible) ; l'image a été retirée (elle reste dans l'historique de git). En attendant, la perle garde le dessin de l'atelier. |

Aucune autre. Facultatif, si le parent le souhaite : le supermarché avec des rayons plus discrets dans la moitié gauche (la bulle les couvre déjà).
