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

Gorgones, anémones et coraux supplémentaires sont posés par leur pied à des emplacements choisis sur le panorama : en arrière du premier plan quand ils poussent sur le massif (le récif cache leur pied), devant lui quand ils sont posés sur le sable. Une houle commune traverse le récif ; les gorgones plient d'un bloc depuis un pied rigide, les anémones gardent leur colonne immobile et agitent leurs tentacules. Voir le README pour le détail.

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

Les petites cheminées du panorama ont d'abord reçu des fumerolles en ruban ondulant. Retour du parent : cela ressemblait à un fluide qui s'échappe, pas à une fumée sous-marine, et les cheminées étaient trop petites. Deux reprises :

- un **massif de cheminées hydrothermales** dessiné en code d'après l'image d'inspiration, assombri, qui recouvre les anciennes ;
- une **fumée en bouffées** : des volutes rondes qui gonflent en montant et se défont au sommet, cernées d'encre.

La fumée reste dessinée en direct plutôt que fabriquée en boucle d'images : quelques dizaines de disques par panache, comme les bulles ou le miroitement. Voir le README.

## Sous-marin

Un sous-marin traverse le grand large et les abysses sans demi-tour. Vers la gauche, il s'éloigne dans le fond et disparaît derrière le tombant du récif ; vers la droite, il sort par le bord du panorama. Ses phares s'allument en entrant dans les abysses : faisceaux en cônes doux, poussières révélées par la lumière, tache sur le fond. Le dessin vient d'une image fournie par le parent, détourée à l'avance comme la grande faune ; seul le calque des lampes allumées s'y ajoute. Voir le README.

Après essai, le parent a demandé que le sous-marin ne rapetisse que peu avant le récif, et moins : le rapetissement est désormais tardif (les 800 derniers px) et limité à 50 %.

## Poissons des abysses

Les abysses reçoivent leurs propres nageurs, quatre poissons des grands fonds fournis par le parent, animés comme ceux du récif (ondulation, pas de demi-tour). Contrainte posée : ils ne vont pas dans le grand large. Plutôt que de les arrêter à une frontière, ils **s'éloignent dans le fond** avant de l'atteindre : ils rapetissent et se fondent dans le bleu sombre. À droite, ils peuvent sortir par le bord du panorama. La baudroie porte une lueur vivante au bout de son leurre. Voir le README.

## Créatures à gagner : images générées, mouvement par le code

Le parent n'était pas satisfait du rendu des créatures dessinées en code et a proposé des images générées. Question posée : faut-il des vidéos courtes pour en tirer du mouvement ? Parti pris retenu pour l'essai : **une seule image par créature, animée par le code** (bandes décalées, comme les poissons et les algues), parce qu'une vidéo générée fait trembler le trait, demande un détourage image par image et pèse lourd hors ligne. Les 15 créatures du lagon servent de pilote. Les créatures articulées (crabe, crevette, bernard-l'ermite) montrent la limite de l'image unique ; 2 à 4 poses seraient l'étape suivante. Voir le README.

## Grande faune du grand large

La zone entre le récif et les abysses accueille des **ombres de profondeur** : baleine, orques, dauphins, requin blanc, requins-marteaux, petits requins, marlin, congre. Chaque fichier source a été identifié (nom et forme), détouré et ramené à une échelle commune fondée sur la longueur réelle de l'animal. Chaque espèce a sa nage (battement vertical des cétacés, balayage de la queue des requins et du marlin, onde du congre), sa profondeur, sa taille de groupe et sa vitesse. Les animaux apparaissent dans la brume ou remontent du fond, et disparaissent dans la brume ou en plongeant. Voir le README.

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
