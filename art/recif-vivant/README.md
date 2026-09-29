# Maquette — récif vivant

Prototype graphique autonome du futur récif de Maths-CE1.

Cette branche est volontairement séparée de l'application publiée : **aucun fichier sous `app/` n'est modifié**. La maquette sert à valider le rendu et les mouvements avant l'intégration applicative.

## Tester

Le fichier `index.html` est autonome : panorama, sprites et masques sont embarqués.

Depuis la racine du dépôt :

```bash
python -m http.server 8080
```

Puis ouvrir :

```
http://localhost:8080/art/recif-vivant/
```

Glisser horizontalement pour parcourir le lagon, le récif de corail, le grand large puis les abysses.

## État du rendu

- panorama continu : 10 874 × 1 774 px ;
- poissons et bancs animés, sans demi-tour ;
- passages derrière le récif grâce au masque de premier plan ;
- algues du lagon ondulantes ;
- flore du récif implantée par le pied (gorgones, anémones, coraux) et animée par une houle commune ;
- faisceaux de lumière doux jusqu'au grand large ;
- ondulation de la surface en WebGL, avec secours fond fixe ;
- éclats mobiles de surface retirés ;
- particules lumineuses des abysses animées, vitesse augmentée de 30 % ;
- grande faune du large en ombres lointaines, à l'échelle, nage propre à chaque animal, apparition dans la brume ou remontée du fond, disparition dans la brume ou en plongée.

## Flore du récif

Chaque élément est posé **par son pied** à un point choisi du panorama (le pied est repéré dans le sprite), jamais par une hauteur de relief approximative :

| Élément | Où | Plan |
| --- | --- | --- |
| Gorgone violette (grande) | sur le massif de coraux, derrière le corail branchu violet | arrière : le pied est caché par le récif |
| Gorgone violette | sur le haut du tombant | arrière |
| Gorgone violette (petite, retournée) | sur une corniche du tombant | arrière |
| Anémone blanche | sur le sable, au pied du grand corail cerveau | avant |
| Petite anémone blanche | sur le sable, au pied de la roche aux éponges | avant |
| Anémone rose et sa limace de mer | sur le sable, devant les coraux bleus | avant |
| Corail violet, corail jaune | dans le massif, derrière le premier plan | arrière |
| Éponges jaunes, limace et son rocher | sur le sable | avant |

Le corail cerveau ajouté par la version précédente a été retiré : il doublait ceux du panorama.

Mouvements : une même houle (période 6,8 s) traverse tout le récif de gauche à droite ; chaque plante la suit avec un retard qui dépend de sa position.

- **Gorgones** : le pied est rigide, l'éventail plie d'un bloc (flexion croissante vers la cime, en retard sur le pied), la cime bascule très légèrement et les extrémités frémissent.
- **Anémones** : la colonne reste plantée ; les tentacules suivent la houle (les pointes plus que la base, et en retard), ondulent chacun à leur rythme (onde qui tourne autour du disque) et la couronne respire lentement. La limace de mer reste posée. La déformation est calculée pixel par pixel sur un petit sprite, 25 fois par seconde, une anémone par image.
- **Coraux durs** : immobiles.

## Grande faune du large

Ce sont des **ombres lointaines** : silhouettes pleines d'un bleu sombre, peu opaques (16 à 36 %), plus floues quand l'animal est plus loin. Trois présences au plus en même temps, jamais deux fois la même espèce.

**Échelle** : une seule règle pour tous, 80 px par mètre de longueur réelle, multipliée par l'éloignement (0,55 à 1). Les proportions entre espèces sont donc justes :

| Fichier source | Animal | Longueur | Nage | Groupe | Profondeur |
| --- | --- | ---: | --- | --- | --- |
| `baleine.jpg` | baleine bleue (rorqual) | 23 m | nageoire horizontale, battement lent de haut en bas | seule, parfois avec son baleineau | moyenne |
| `orque.png` | orque | 7,5 m | idem, plus rapide | 1 à 3 | haute à moyenne |
| `requin_blanc.png` | grand requin blanc | 5 m | queue verticale : la nageoire balaie (vue de profil elle se raccourcit) | seul | moyenne à profonde |
| `requin_marteau.png` | requin-marteau | 4,2 m | idem | seul ou en petit banc | moyenne à profonde |
| `marlin_espadon.jpg` | marlin | 3,6 m | queue verticale, battement rapide, accélérations brèves | seul | proche de la surface |
| `dauphins_groupe.jpg` | 4 dauphins découpés séparément | 2,4 m | battement vertical rapide et ondulation du groupe | 3 à 6 | près de la surface |
| `requins_groupe.jpg` | petit requin (un seul exploitable) | 1,9 m | queue verticale | 3 à 5 | profonde |
| `anguille.jpg` | congre | 1,8 m | onde sur tout le corps | seul | la plus profonde, lent |

**Vitesses** : vitesses de croisière réelles, ralenties d'un même facteur pour tous (scène calme) ; elles varient doucement pour chaque animal. La fréquence du battement découle de la vitesse et de la taille (une baleine bat lentement, un dauphin vite). Pente de nage limitée en croisière, plus forte en plongée.

**Cycle** : un animal apparaît en sortant de la brume, en remontant des profondeurs ou en arrivant par un bord (côté récif ou côté abysses), nage 15 s à 1 min, puis disparaît soit dans la brume, soit **en plongeant** : il pique du nez et se perd dans le bleu sombre (il n'y a pas de fond dans cette zone). Côté récif, il passe derrière le tombant.

Les silhouettes ont été détourées à l'avance (fond estimé par un polynôme, puis seuillage) et sont embarquées dans la maquette ; plus aucun traitement d'image n'est fait au chargement.

## Poids

La maquette a déjà fait l'objet de l'optimisation principale sans perte visuelle : le premier plan du récif réutilise les tuiles du fond et n'embarque que des masques alpha. On évite ainsi une seconde copie complète du panorama.

Le présent fichier reste volontairement autonome pour faciliter la revue. Lors de l'intégration dans l'application, les images pourront être externalisées et chargées par tuiles.

## Hors périmètre de cette PR

- remplacement du récif actuellement utilisé par l'application ;
- progression et positionnement des créatures gagnées avec les cartes ;
- boutons de navigation définitifs ;
- adaptation au cache PWA ;
- recette de performance sur la tablette réelle.

Ces points feront l'objet de l'intégration applicative après validation de la direction graphique.
