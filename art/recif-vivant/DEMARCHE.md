# Récif vivant — démarche de conception

## Objectif

Remplacer le récif en pages par une **mer continue horizontale** : lagon → récif de corail → grand large → abysses. L'enfant explore la scène par glissement horizontal. Le fond reste illustré et détaillé ; le mouvement vient d'éléments isolés et peu coûteux plutôt que d'un redessin complet de la scène à chaque image.

## Architecture retenue

Le prototype sépare plusieurs couches :

1. **fond panoramique**, découpé en tuiles ;
2. **faune mobile** ;
3. **premier plan** du récif, qui peut masquer les poissons ;
4. **plantes et décors animés** ;
5. **lumière** ;
6. **effets propres aux abysses**.

Le fichier `index.html` livré dans cette PR est autonome afin de faciliter l'essai. L'intégration définitive pourra conserver le même modèle en externalisant les assets.

## Panorama

Sept images de fond ont été assemblées pour former un panorama de 10 874 × 1 774 px. Les coutures les plus complexes suivent des zones visuellement peu sensibles et sont fondues. Les animaux déjà dessinés dans le panorama sont conservés.

Le massif corallien n'est pas animé en bloc : sa densité rendrait une déformation globale artificielle. Les mouvements supplémentaires viennent d'éléments isolés.

## Premier plan et profondeur

Un masque sépare le corail, les rochers et le sable de l'eau. Ce calque est redessiné après les poissons : ils peuvent donc passer derrière le récif.

Optimisation importante : le premier plan ne contient plus une copie RGB du panorama. Seuls les masques alpha sont embarqués et les pixels sont repris depuis les tuiles du fond.

## Poissons

Principes retenus :

- aucun demi-tour en cours de trajet ;
- ondulation du corps et battement de queue ;
- variations lentes de vitesse et de profondeur ;
- inclinaison progressive ;
- bancs basés sur un meneur invisible ;
- certains poissons plongent derrière le corail ou en émergent ;
- à la sortie du récif vers le grand large, les poissons rapetissent et s'estompent.

Le peuplement vise à éviter une scène vide sans transformer l'écran en aquarium agité.

## Algues et récif animé

Les algues du lagon sont détourées. Leur pied reste fixe et l'amplitude augmente vers le sommet.

Des éléments supplémentaires fournis sur fond uni ont été intégrés dans le récif : gorgones, anémones et coraux. Les éléments souples sont déformés par bandes horizontales ; les masses rigides restent presque fixes.

L'objectif est un mouvement perceptible mais lent : le décor ne doit pas détourner l'attention de l'activité de mathématiques.

## Lumière

Les faisceaux sont fins, légèrement inclinés et déphasés. Leur intensité baisse du lagon vers le grand large puis disparaît avant les abysses.

La surface utilise un petit shader WebGL de déplacement. Les petits éclats lumineux mobiles testés initialement ont été retirés à la demande du parent.

## Abysses

Les points lumineux statiques du fond sont remplacés par des particules procédurales. Elles :

- apparaissent progressivement ;
- dérivent de quelques pixels ;
- s'estompent ;
- renaissent ailleurs.

Leur rythme a ensuite été accéléré de **30 %**.

## Grande faune du grand large

La zone entre le récif et les abysses accueille désormais des présences très lointaines :

- dauphins ;
- groupe de requins ;
- marlin / espadon ;
- congre / anguille ;
- requin blanc ;
- orque ;
- requin-marteau ;
- baleine.

Elles ne sont pas traitées comme les poissons du premier plan. Ce sont des **ombres de profondeur** : faible opacité, vitesse lente, apparition et disparition par fondu, position renouvelée à chaque cycle.

Les dimensions sont différentes selon l'espèce. La baleine domine nettement, puis viennent l'orque et les grands requins ; les dauphins, le marlin et le congre sont plus petits.

Pour les images fournies sur fond bleu, la maquette fabrique au chargement un masque de silhouette à partir de la luminance ou du contraste local, filtre les composantes parasites puis remplit les formes. Les images déjà détourées sont utilisées telles quelles.

## Principes de performance

- aucune animation vidéo permanente ;
- nombre d'éléments actifs limité ;
- premier plan dédupliqué ;
- effets de lumière simples ;
- WebGL utilisé seulement pour la déformation de fond ;
- secours sans WebGL ;
- la version autonome privilégie la simplicité de revue ; l'intégration applicative devra charger les tuiles et textures à la demande.

## Suite

Cette PR valide le **prototype graphique autonome**. Elle ne remplace pas encore le récif de l'application.

Après validation visuelle, l'intégration devra traiter notamment :

- chargement progressif des tuiles ;
- créatures gagnées via les cartes et leurs emplacements ;
- commandes de retour et d'album ;
- mise en cache hors ligne ;
- mesure des images par seconde sur la tablette ;
- dégradation gracieuse des effets si le matériel est trop lent.
