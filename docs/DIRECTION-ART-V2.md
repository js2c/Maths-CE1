# Direction artistique V2 — monde sous-marin illustré

Statut : direction de production pour la refonte graphique engagée le 28 septembre 2026. Elle ne change ni le contenu pédagogique ni les règles de jeu.

## 1. Objectif

La V2 doit conserver la clarté et la chaleur de l'univers marin actuel tout en augmentant fortement :

- la profondeur de la scène ;
- la densité de détails ;
- le volume et la personnalité des personnages ;
- la sensation d'un lieu illustré, habité et exploré, plutôt que d'un fond décoratif plat.

L'inspiration générale vient des livres-jeux et jeux 2D d'aventure très illustrés : composition riche, détails narratifs, formes dessinées et nombreuses petites scènes secondaires. Il ne faut pas reproduire les compositions, personnages ou éléments distinctifs d'une œuvre existante.

Le jeu reste destiné à un enfant de CE1. La richesse graphique ne doit jamais rendre une consigne, une cible ou une interaction ambiguë.

## 2. Repère et affichage

Le moteur existant reste la référence : **1280 × 800 pixels logiques** (`app/js/engine/stage.js`). La refonte V2 ne crée pas un second système de coordonnées.

- Fond plein écran @1x : 1280 × 800.
- Fond plein écran @2x : 2560 × 1600.
- Sources de travail : idéalement créées à 2x ou davantage puis réduites à l'export.
- Tous les placements de `scene.json` sont exprimés dans le repère 1280 × 800.
- Le stage continue d'être mis à l'échelle sans déformation et sans recadrage par le moteur existant.

## 3. Profondeur visuelle

La profondeur est d'abord **dessinée dans les assets**, et non fabriquée avec de gros filtres temps réel.

### Arrière-plan lointain

- contraste faible ;
- saturation légèrement réduite ;
- dominante plus froide et plus bleue ;
- silhouettes et détails simplifiés ;
- brume sous-marine et lumière diffuse.

### Plan intermédiaire

- ruines, reliefs, arches, coraux et végétation plus lisibles ;
- contraste intermédiaire ;
- chevauchements nets qui construisent l'espace.

### Zone de jeu

- personnages et objets utiles très nets ;
- silhouettes immédiatement compréhensibles ;
- contraste et saturation supérieurs au fond ;
- aucun détail décoratif ne doit se confondre avec une cible pédagogique.

### Premier plan

- éléments plus grands, plus sombres ou plus saturés ;
- occlusions partielles possibles sur les bords ;
- léger flou peint dans l'asset autorisé ;
- aucun élément pédagogique essentiel ne doit être masqué.

## 4. Correspondance avec les couches existantes

La V2 réutilise l'architecture déjà optimisée de l'application :

| Profondeur V2 | Couche existante | Usage |
| --- | --- | --- |
| 0–19 | `#bg` | eau, lumière, reliefs, ruines, sol : composition fixe peinte une fois |
| 20–39 | `#back` | poissons lointains, végétation mobile, éléments d'ambiance |
| dynamique | `#line` | ligne graduée et éléments pédagogiques générés ; inchangé |
| ~40 | `#octo` | mascotte principale |
| 41–69 | `#front` | acteurs proches, objets interactifs, occlusions et effets locaux |
| 100+ | `#ui` | commandes, réponses, score et navigation |

On évite d'ajouter de nouveaux calques plein écran si une composition dans `#bg` ou un petit acteur recadré suffit.

## 5. Pipeline d'assets

Les illustrations complexes ne sont plus obligatoirement dessinées en code. Les sources possibles sont :

- illustration raster créée ou générée puis retouchée ;
- dessin de l'atelier anidoodle lorsqu'il reste adapté ;
- combinaison des deux, à condition que le rendu final soit cohérent.

Les fichiers de l'application restent locaux, versionnés et utilisables hors ligne.

### Formats

- WebP opaque pour les grands décors si possible ;
- WebP avec alpha pour les personnages et éléments détourés ;
- PNG uniquement lorsqu'un besoin précis le justifie ;
- @1x et @2x lorsque l'asset est suffisamment important pour bénéficier des deux densités.

### Recadrage

Un élément transparent doit être recadré au plus près de son contenu. Ne pas exporter une algue occupant 15 % de l'écran dans une image transparente de 1280 × 800.

Un bitmap RGBA 2560 × 1600 représente environ 16,4 Mo une fois décodé, quelle que soit sa taille compressée sur disque. La compression WebP économise le téléchargement et le stockage, pas la mémoire décodée.

### Atlas

Pour les nouvelles planches, viser au plus 2048 × 2048 par page sauf mesure démontrant qu'une autre taille est préférable. Les gros ensembles doivent pouvoir être chargés et libérés par groupe comme le permet déjà `Sprites`.

## 6. Décor de référence : `ocean-01`

Le premier écran V2 doit être construit dans cet ordre :

1. eau, lumière et brume lointaine ;
2. reliefs et ruines intermédiaires ;
3. sol détaillé ;
4. végétation et coraux proches ;
5. personnages ;
6. petits effets vivants ;
7. harmonisation de l'interface.

Le décor doit donner l'impression d'une vallée sous-marine joyeuse et habitée, avec assez de détails pour inviter à regarder, sans devenir un jeu d'objets cachés involontaire.

## 7. Personnages

La mascotte et les guides doivent gagner en qualité perçue sans devenir réalistes.

Principes :

- silhouette forte et reconnaissable à petite taille ;
- volume par lumière, ombre et variations de couleur ;
- contours dessinés cohérents avec le reste de l'univers ;
- détails secondaires : taches, textures discrètes, reflets, ventouses, nageoires ;
- légère asymétrie ;
- yeux et posture suffisamment expressifs pour transmettre une intention ;
- anatomie simplifiée mais crédible.

Pour la pieuvre, le premier lot final devra au minimum fournir les états `idle`, `blink`, `happy` et `explain`. Les boucles restent courtes ; le flottement vertical et les micro-rotations sont réalisés par le compositeur JavaScript, pas intégrés image par image.

Les poissons suivent le même principe : quelques images pour la flexion du corps, de la queue et des nageoires ; trajectoire, vitesse, demi-tour et flottement restent pilotés par le moteur.

## 8. Mouvement

La scène doit sembler vivante sans faire bouger tout simultanément.

- décalages de phase entre acteurs semblables ;
- mouvements lents et irréguliers ;
- parallax de très faible amplitude ;
- bulles, miroitements et particules légères peuvent rester procéduraux ;
- les animations ne doivent pas détourner le regard pendant une question.

Le seuil de performance existant reste inchangé : au moins 30 images/s, cible 60, et allègement automatique si la moyenne dépasse 20 ms.

## 9. Lisibilité pédagogique

Une scène riche doit conserver une hiérarchie visuelle claire :

- la cible de la question a toujours plus de contraste que son voisinage immédiat ;
- les éléments actionnables peuvent recevoir un mouvement ou éclat discret, jamais un clignotement agressif ;
- les nombres, graduations, zones de réponse et aides ne sont jamais incorporés dans une illustration fixe ;
- le fond ne doit pas créer de faux boutons, fausses graduations ou objets ressemblant à une réponse ;
- les contrôles tactiles restent au moins de 64 px.

## 10. Interface

L'UI peut devenir plus illustrée, mais sa structure reste simple :

- formes rondes ou souples ;
- profondeur légère par contour et ombre ;
- matériaux visuels cohérents avec l'océan (pierre polie, coquillage, bois immergé), sans texture envahissante ;
- pictogrammes simples et très contrastés ;
- positions et tailles ne changent pas sans raison ergonomique.

## 11. Manifeste de scène V2

Le prototype est dans `art/v2/` et ne fait pas partie de l'application publiée.

`ocean-01/scene.json` décrit :

- le repère de conception ;
- les couches fixes ;
- les acteurs ;
- `slot` : destination dans l'architecture existante ;
- `depth` : ordre visuel ;
- `x`, `y`, `scale`, `opacity` ;
- `parallax` ;
- `animation` : nom du clip et cadence indicative ;
- `motion.float` : amplitude, période et micro-rotation.

Pendant l'étape 1, chaque entrée utilise un `placeholder`. Plus tard, `placeholder` sera remplacé par un chemin `asset` sans changer le schéma de placement ni la logique de scène.

## 12. Critère de réussite du premier écran final

La refonte de `ocean-01` sera considérée aboutie lorsque :

- la scène présente au moins quatre niveaux de profondeur perceptibles au premier regard ;
- la pieuvre paraît volumétrique, expressive et nettement plus détaillée que la version actuelle ;
- les personnages secondaires sont cohérents entre eux ;
- le décor paraît riche même lorsque tous les acteurs animés sont figés ;
- les éléments pédagogiques restent immédiatement identifiables ;
- la scène reste fluide sur la tablette cible et respecte le budget mémoire mesuré ;
- la PWA reste entièrement utilisable hors ligne.
