# Les prompts Nano Banana des boutons qui gardent leur dessin

Écrit par `node art/boutons/prompts.mjs` (lot « Nouveaux boutons, mascotte du récif et étoiles », décisions du parent du 7 novembre 2026). Un prompt = une image. Chaque prompt est complet : le copier tel quel.

**Déjà faits** (les 13 images du 7 novembre, `art/boutons/sources/01.jpg` à `13.jpg`) : les sept exercices de l'écran « choisir », le récif, la boutique, l'album, la maison, choisir, les leçons, jouer (et « continuer »), les quatre zones de l'album, encore.

**Méthode** :

1. Joindre deux des images déjà faites comme référence du style, toujours les mêmes : `art/boutons/sources/02.jpg` (le récif) et `art/boutons/sources/08.jpg` (jouer).
2. Copier le prompt du bouton, tel quel.
3. Vérifier : un seul bouton, rond, entier, l'anneau gris épais tout autour, le dessin dans le verre, aucun texte ni chiffre, le fond d'une seule couleur, sans ombre.
4. Déposer l'image telle quelle dans `art/boutons/sources/`, sous le nom indiqué. La session du lot qui l'intègre l'ajoute à `art/boutons/boutons.json` et relance `node art/tools/export-boutons.mjs`.

**Fond** : vert franc (`#00FF00`) pour tous, comme les 13 images. Un dessin vert dans le verre (la coche, une tortue) ne gêne pas : l'outil ne cherche le vert qu'autour de l'anneau, et coupe le bouton sur son cercle. (Pour une source sur fond magenta, `boutons.json` a la liste `magenta`.)

**Les chiffres et les étoiles restent dessinés par l'application**, par-dessus l'image : le chiffre d'une touche du pavé, le numéro d'un niveau et sa petite étoile « validé », les étoiles des crans du sélecteur. Une image générée ne doit donc jamais en contenir (Nano Banana les déforme, et elles changent).

**111 images** en tout, dans l'ordre où les boutons se voient le plus : les commandes (14), le sélecteur de difficulté (4), les niveaux de l'écran « choisir » (72), les leçons (21).

**Non relevés** : ce qui n'est pas un bouton (la frise, les compteurs et réserves d'étoiles, les cartes, les créatures, les étiquettes) ; ce qui appartient à une maquette intégrée telle quelle (la lampe de l'étal, les voiliers, le récif vivant) ; la tête de la mascotte du récif (lot « Nouveaux boutons… » : c'est la mascotte elle-même) ; le grand bouton « À toi ! » de la fin d'une leçon (l'image de sa leçon, avec le triangle « jouer » posé par l'application).

## Les commandes

### passer

- **Où** : les leçons, les exemples guidés, les corrections (en haut à droite). **Aujourd'hui** : le dessin `passer` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/passer.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: two bold yellow triangles pointing to the right, side by side, like a « fast forward » sign, with rounded tips.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la coche (« c'est bon »)

- **Où** : le pavé des additions et de l'étal, le sélecteur de difficulté, la carte gagnée, la confirmation de « passer l'échauffement ». **Aujourd'hui** : le dessin `valider` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/valider.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a big bold green tick mark (check mark), slightly tilted, with a dark ink outline.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### effacer

- **Où** : le pavé des additions et de l'étal. **Aujourd'hui** : le dessin `effacer` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/effacer.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a bold coral-red arrow pointing to the left, like a « backspace » key arrow, short and thick.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### l'aide (le coquillage)

- **Où** : les additions, la multiplication, l'étal, les problèmes. **Aujourd'hui** : le dessin `aide` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/aide.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small purple-blue spiral sea shell with a pink opening, and a tiny yellow star sparkling next to it.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### « je ne sais pas »

- **Où** : la ligne graduée, les additions, les voiliers, l'étal. **Aujourd'hui** : le dessin `nsp` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/je-ne-sais-pas.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small friendly orange octopus raising two tentacles in the air with a puzzled, shrugging face (« I don't know »), big round eyes.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### revoir la leçon

- **Où** : les leçons (revoir depuis le début). **Aujourd'hui** : le dessin `rejouer` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/rejouer.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a bold coral-red circular arrow turning around, like a « replay » sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### passer l'échauffement

- **Où** : l'échauffement (en haut à droite). **Aujourd'hui** : le dessin `passer.echauffement` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/passer-echauffement.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue sea wave at the bottom, and a bold yellow curved arrow jumping over the wave from left to right.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### acheter (la coche de la boutique)

- **Où** : la boutique du récif. **Aujourd'hui** : le dessin `boutique.coche` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/acheter.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a big bold green tick mark (check mark), slightly tilted, with a dark ink outline.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### annuler (la croix de la boutique)

- **Où** : la boutique du récif. **Aujourd'hui** : le dessin `boutique.croix` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/annuler.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a bold red cross (X) made of two thick rounded strokes.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### le petit livre de la légende (pour le parent)

- **Où** : les écrans « choisir » et le menu des leçons. **Aujourd'hui** : le dessin `legende` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/legende.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open book seen from the front, white pages with a few grey lines, on a grey cover.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### fermer la légende

- **Où** : la légende des niveaux. **Aujourd'hui** : le dessin `fermer` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/fermer.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a bold coral-red cross (X) made of two thick rounded strokes.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### ouvrir le coquillage (la récompense)

- **Où** : la récompense de fin de séance. **Aujourd'hui** : le dessin `coquillage` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/coquillage.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a closed pink scallop shell lying flat, seen from the front, its ridges clearly drawn, a tiny round pink bump on top.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### une touche du pavé et une bulle-réponse (vide : l'application écrit le chiffre)

- **Où** : le pavé des additions et de l'étal, les bulles-réponses de la ligne graduée. **Aujourd'hui** : le dessin `reponse` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/touche.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: nothing: the glass is empty, just the pale glass and its reflections (the application writes a digit on it).

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

The glass must stay empty. Strictly no text, no letters, no numbers, no digits, no picture inside.

Square picture (1:1).
```

### le bouton de l'espace parent

- **Où** : l'accueil, en bas à gauche (appui long). **Aujourd'hui** : le dessin `(image découpée par art/boutons/decoupe.py)` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/parents.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small golden padlock, closed, with a tiny blue sea star hanging from it.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

## Le sélecteur de difficulté (les quatre vagues)

Les étoiles de chaque cran restent posées par l'application (aucune en entraînement libre).

### le cran « plus facile »

- **Où** : le sélecteur de difficulté, avant chaque séance. **Aujourd'hui** : les dessins `cran.*` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/cran-1-plus-facile.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: calm flat turquoise sea water filling the bottom third, a gentle ripple on the surface, nothing else.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### le cran « conseillé »

- **Où** : le sélecteur de difficulté, avant chaque séance. **Aujourd'hui** : les dessins `cran.*` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/cran-2-conseille.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: turquoise sea water filling the bottom half with one small round wave curling to the left, nothing else.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### le cran « plus dur »

- **Où** : le sélecteur de difficulté, avant chaque séance. **Aujourd'hui** : les dessins `cran.*` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/cran-3-plus-dur.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: turquoise sea water with one big wave rising high and curling to the left, a few small bubbles above it, nothing else.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### le cran « très dur »

- **Où** : le sélecteur de difficulté, avant chaque séance. **Aujourd'hui** : les dessins `cran.*` de l'atelier.
- **Fichier à rendre** : `art/boutons/sources/cran-4-tres-dur.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: turquoise sea water with one huge wave rising to the top of the glass and curling to the left, white foam on its crest, a few bubbles, nothing else.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

## Les niveaux de l'écran « choisir »

Aujourd'hui, des tuiles carrées dessinées dans l'atelier, avec le numéro et l'exemple écrits. Avec une image, le bouton deviendrait rond comme les autres ; l'application écrirait le numéro du niveau sur une petite plaque (à décider au lot qui les intègre).

### la ligne graduée

#### la ligne graduée, niveau 1

- **Ce qu'on y travaille** (la légende du parent) : Compter les sauts de 1 en 1 sur une corde de 0 à 10. Exemple : La tortue part de 2 et fait 3 sauts, 5.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-01.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Compter les sauts de 1 en 1 sur une corde de 0 à 10. » (for example « La tortue part de 2 et fait 3 sauts, 5 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 2

- **Ce qu'on y travaille** (la légende du parent) : Lire et placer un nombre de 0 à 10, avec seulement 0, 5 et 10 écrits. Exemple : Place 8.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-02.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Lire et placer un nombre de 0 à 10, avec seulement 0, 5 et 10 écrits. » (for example « Place 8 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 3

- **Ce qu'on y travaille** (la légende du parent) : Lire et placer un nombre de 0 à 20. Exemple : L'étoile est sur 14.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-03.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Lire et placer un nombre de 0 à 20. » (for example « L'étoile est sur 14 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 4

- **Ce qu'on y travaille** (la légende du parent) : Une ligne qui ne commence pas à 0. Exemple : De 30 à 40, l'étoile est sur 34.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-04.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Une ligne qui ne commence pas à 0. » (for example « De 30 à 40, l'étoile est sur 34 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 5

- **Ce qu'on y travaille** (la légende du parent) : De 0 à 100, de 10 en 10, chaque saut vaut dix. Exemple : L'étoile est sur 70.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-05.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « De 0 à 100, de 10 en 10, chaque saut vaut dix. » (for example « L'étoile est sur 70 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 6

- **Ce qu'on y travaille** (la légende du parent) : Un morceau de ligne, seules les dizaines sont écrites. Exemple : De 30 à 50, où est 37 ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-06.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Un morceau de ligne, seules les dizaines sont écrites. » (for example « De 30 à 50, où est 37 ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 7

- **Ce qu'on y travaille** (la légende du parent) : Trouver de combien on saute, 1 ou 10. Exemple : 40, 50, puis deux sauts, 70.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-07.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Trouver de combien on saute, 1 ou 10. » (for example « 40, 50, puis deux sauts, 70 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 8

- **Ce qu'on y travaille** (la légende du parent) : Deviner où va un nombre sur une ligne sans graduations, de 0 à 100. Exemple : Où mettrais-tu 25 ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-08.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Deviner où va un nombre sur une ligne sans graduations, de 0 à 100. » (for example « Où mettrais-tu 25 ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 9

- **Ce qu'on y travaille** (la légende du parent) : De 0 à 1000, de 100 en 100. Exemple : L'étoile est sur 700.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-09.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « De 0 à 1000, de 100 en 100. » (for example « L'étoile est sur 700 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 10

- **Ce qu'on y travaille** (la légende du parent) : Une centaine, de 10 en 10. Exemple : De 300 à 400, l'étoile est sur 370.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-10.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Une centaine, de 10 en 10. » (for example « De 300 à 400, l'étoile est sur 370 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 11

- **Ce qu'on y travaille** (la légende du parent) : Des grands nombres, un par un, sur un morceau de ligne. Exemple : De 340 à 360, où est 347 ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-11.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Des grands nombres, un par un, sur un morceau de ligne. » (for example « De 340 à 360, où est 347 ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 12

- **Ce qu'on y travaille** (la légende du parent) : Écrire en chiffres un grand nombre entendu. Exemple : Trois cent sept, 307.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-12.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Écrire en chiffres un grand nombre entendu. » (for example « Trois cent sept, 307 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la ligne graduée, niveau 13

- **Ce qu'on y travaille** (la légende du parent) : Deviner où va un nombre sur une ligne sans graduations, de 0 à 1000. Exemple : Où mettrais-tu 500 ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-ligne-13.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little sea turtle jumping along a rope with red and white buoys, like on a number line, showing the idea of this level: « Deviner où va un nombre sur une ligne sans graduations, de 0 à 1000. » (for example « Où mettrais-tu 500 ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### les faits d'addition

#### les faits d'addition, niveau 1

- **Ce qu'on y travaille** (la légende du parent) : Ajouter 1 ou 2, la tortue fait les sauts. Exemple : 6 + 2.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-01.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Ajouter 1 ou 2, la tortue fait les sauts. » (for example « 6 + 2 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 2

- **Ce qu'on y travaille** (la légende du parent) : Les doubles, jusqu'à 5 + 5. Exemple : 4 + 4.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-02.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Les doubles, jusqu'à 5 + 5. » (for example « 4 + 4 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 3

- **Ce qu'on y travaille** (la légende du parent) : Les amis de 10, ce qui manque pour faire 10. Exemple : 7 + ? = 10.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-03.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Les amis de 10, ce qui manque pour faire 10. » (for example « 7 + ? = 10 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 4

- **Ce qu'on y travaille** (la légende du parent) : Les maisons de 5, 6 et 7, deux nombres qui font le nombre du toit. Exemple : 5 + ? = 7.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-04.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Les maisons de 5, 6 et 7, deux nombres qui font le nombre du toit. » (for example « 5 + ? = 7 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 5

- **Ce qu'on y travaille** (la légende du parent) : Les maisons de 8 et 9, avec le cadre de 10. Exemple : 6 + ? = 9.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-05.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Les maisons de 8 et 9, avec le cadre de 10. » (for example « 6 + ? = 9 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 6

- **Ce qu'on y travaille** (la légende du parent) : Les presque-doubles, un double et encore 1. Exemple : 3 + 4 = 3 + 3 + 1.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-06.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Les presque-doubles, un double et encore 1. » (for example « 3 + 4 = 3 + 3 + 1 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 7

- **Ce qu'on y travaille** (la légende du parent) : Le mélange de toutes les additions déjà rencontrées. Exemple : 5 + 3, 4 + 4, 7 + 3.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-07.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Le mélange de toutes les additions déjà rencontrées. » (for example « 5 + 3, 4 + 4, 7 + 3 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 8

- **Ce qu'on y travaille** (la légende du parent) : Dix et quelques, une boîte pleine et ce qui reste. Exemple : 10 + 4, 4 + 10.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-08.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Dix et quelques, une boîte pleine et ce qui reste. » (for example « 10 + 4, 4 + 10 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 9

- **Ce qu'on y travaille** (la légende du parent) : Les doubles jusqu'à 15 + 15, dix et dix, puis les unités. Exemple : 7 + 7, 13 + 13.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-09.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Les doubles jusqu'à 15 + 15, dix et dix, puis les unités. » (for example « 7 + 7, 13 + 13 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 10

- **Ce qu'on y travaille** (la légende du parent) : Les presque-doubles jusqu'à 10, un double et encore 1. Exemple : 7 + 8 = 7 + 7 + 1.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-10.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Les presque-doubles jusqu'à 10, un double et encore 1. » (for example « 7 + 8 = 7 + 7 + 1 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 11

- **Ce qu'on y travaille** (la légende du parent) : Plus 9, un pour faire dix, puis le reste. Exemple : 9 + 4.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-11.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Plus 9, un pour faire dix, puis le reste. » (for example « 9 + 4 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 12

- **Ce qu'on y travaille** (la légende du parent) : Passer la dizaine, on remplit d'abord la boîte de dix. Exemple : 8 + 5 = 8 + 2 + 3.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-12.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Passer la dizaine, on remplit d'abord la boîte de dix. » (for example « 8 + 5 = 8 + 2 + 3 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les faits d'addition, niveau 13

- **Ce qu'on y travaille** (la légende du parent) : Le grand mélange de toutes les additions, jusqu'à 30. Exemple : 8 + 5, 7 + 7, 10 + 6.
- **Fichier à rendre** : `art/boutons/sources/niveau-additions-13.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small dark blue-grey chalk slate in a wooden frame, showing the idea of this level: « Le grand mélange de toutes les additions, jusqu'à 30. » (for example « 8 + 5, 7 + 7, 10 + 6 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### le calcul rapide

#### le calcul rapide, niveau 1

- **Ce qu'on y travaille** (la légende du parent) : Ajouter ou retirer 1 ou 2. Exemple : 47 + 2.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-01.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Ajouter ou retirer 1 ou 2. » (for example « 47 + 2 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 2

- **Ce qu'on y travaille** (la légende du parent) : Ajouter ou retirer 10, on descend ou on monte d'une rangée sur le mur. Exemple : 34 + 10.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-02.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Ajouter ou retirer 10, on descend ou on monte d'une rangée sur le mur. » (for example « 34 + 10 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 3

- **Ce qu'on y travaille** (la légende du parent) : Ajouter ou retirer des dizaines rondes, 20, 30. Exemple : 23 + 30.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-03.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Ajouter ou retirer des dizaines rondes, 20, 30. » (for example « 23 + 30 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 4

- **Ce qu'on y travaille** (la légende du parent) : Ajouter un petit nombre sans changer de dizaine. Exemple : 34 + 5.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-04.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Ajouter un petit nombre sans changer de dizaine. » (for example « 34 + 5 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 5

- **Ce qu'on y travaille** (la légende du parent) : Retirer un petit nombre sans changer de dizaine. Exemple : 38 - 5.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-05.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Retirer un petit nombre sans changer de dizaine. » (for example « 38 - 5 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 6

- **Ce qu'on y travaille** (la légende du parent) : Ajouter 9, on ajoute 10, puis on retire 1. Exemple : 34 + 9.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-06.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Ajouter 9, on ajoute 10, puis on retire 1. » (for example « 34 + 9 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 7

- **Ce qu'on y travaille** (la légende du parent) : Ajouter en passant la dizaine, on complète d'abord jusqu'à 10. Exemple : 38 + 5 = 38 + 2 + 3.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-07.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Ajouter en passant la dizaine, on complète d'abord jusqu'à 10. » (for example « 38 + 5 = 38 + 2 + 3 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 8

- **Ce qu'on y travaille** (la légende du parent) : Ajouter deux nombres à deux chiffres, sans retenue. Exemple : 23 + 14 = 23 + 10 + 4.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-08.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Ajouter deux nombres à deux chiffres, sans retenue. » (for example « 23 + 14 = 23 + 10 + 4 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### le calcul rapide, niveau 9

- **Ce qu'on y travaille** (la légende du parent) : Retirer en passant la dizaine. Exemple : 42 - 5 = 42 - 2 - 3.
- **Fichier à rendre** : `art/boutons/sources/niveau-calcul-09.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange coral wall made of square tiles, with a small orange fish, showing the idea of this level: « Retirer en passant la dizaine. » (for example « 42 - 5 = 42 - 2 - 3 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### les voiliers

#### les voiliers, niveau 1

- **Ce qu'on y travaille** (la légende du parent) : Ranger un nombre jusqu'à 100 entre deux dizaines, à au moins 3 des bouées. Exemple : 45 entre 40 et 50.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-01.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Ranger un nombre jusqu'à 100 entre deux dizaines, à au moins 3 des bouées. » (for example « 45 entre 40 et 50 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 2

- **Ce qu'on y travaille** (la légende du parent) : Ranger un nombre jusqu'à 100 entre des bouées qui ne sont pas des dizaines. Exemple : 31 entre 28 et 34.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-02.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Ranger un nombre jusqu'à 100 entre des bouées qui ne sont pas des dizaines. » (for example « 31 entre 28 et 34 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 3

- **Ce qu'on y travaille** (la légende du parent) : Ranger un nombre jusqu'à 1 000 entre deux centaines. Exemple : 450 entre 400 et 500.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-03.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Ranger un nombre jusqu'à 1 000 entre deux centaines. » (for example « 450 entre 400 et 500 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 4

- **Ce qu'on y travaille** (la légende du parent) : Ranger un nombre jusqu'à 1 000 entre deux dizaines, avec quatre bouées. Exemple : 534 entre 530 et 540.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-04.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Ranger un nombre jusqu'à 1 000 entre deux dizaines, avec quatre bouées. » (for example « 534 entre 530 et 540 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 5

- **Ce qu'on y travaille** (la légende du parent) : Des centaines ou des dizaines, le nombre tout près d'une bouée. Exemple : 698 avant 700.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-05.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Des centaines ou des dizaines, le nombre tout près d'une bouée. » (for example « 698 avant 700 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 6

- **Ce qu'on y travaille** (la légende du parent) : Des bouées qui ne sont pas rondes, le nombre tout près d'une bouée. Exemple : 426 après 425.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-06.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Des bouées qui ne sont pas rondes, le nombre tout près d'une bouée. » (for example « 426 après 425 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 7

- **Ce qu'on y travaille** (la légende du parent) : Cinq bouées de 10 en 10, le nombre tout près d'une bouée. Exemple : 369 avant 370.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-07.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Cinq bouées de 10 en 10, le nombre tout près d'une bouée. » (for example « 369 avant 370 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 8

- **Ce qu'on y travaille** (la légende du parent) : Des écarts mélangés entre les bouées, le nombre tout près d'une bouée. Exemple : 349 entre 250 et 350.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-08.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Des écarts mélangés entre les bouées, le nombre tout près d'une bouée. » (for example « 349 entre 250 et 350 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les voiliers, niveau 9

- **Ce qu'on y travaille** (la légende du parent) : Double encadrement, entre deux centaines puis entre deux dizaines. Exemple : 347 entre 300 et 400 puis entre 340 et 350.
- **Fichier à rendre** : `art/boutons/sources/niveau-voiliers-09.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small red sailing boat between two buoys on the sea, showing the idea of this level: « Double encadrement, entre deux centaines puis entre deux dizaines. » (for example « 347 entre 300 et 400 puis entre 340 et 350 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la multiplication

#### la multiplication, niveau 1

- **Ce qu'on y travaille** (la légende du parent) : Des rangées égales de poissons, on ajoute les rangées. Exemple : 4 + 4 + 4.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-01.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « Des rangées égales de poissons, on ajoute les rangées. » (for example « 4 + 4 + 4 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 2

- **Ce qu'on y travaille** (la légende du parent) : Le signe fois, 3 × 4, c'est 3 rangées de 4. Exemple : 3 × 4.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-02.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « Le signe fois, 3 × 4, c'est 3 rangées de 4. » (for example « 3 × 4 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 3

- **Ce qu'on y travaille** (la légende du parent) : La table de 2, fois deux, c'est le double. Exemple : 2 × 7 = 14.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-03.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « La table de 2, fois deux, c'est le double. » (for example « 2 × 7 = 14 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 4

- **Ce qu'on y travaille** (la légende du parent) : La table de 10, fois dix, ce sont des dizaines. Exemple : 10 × 4 = 40.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-04.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « La table de 10, fois dix, ce sont des dizaines. » (for example « 10 × 4 = 40 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 5

- **Ce qu'on y travaille** (la légende du parent) : La table de 5, la moitié de fois dix. Exemple : 5 × 6 = 30.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-05.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « La table de 5, la moitié de fois dix. » (for example « 5 × 6 = 30 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 6

- **Ce qu'on y travaille** (la légende du parent) : On tourne les rangées, 3 × 5 et 5 × 3 font autant. Exemple : 5 × 3 = 3 × 5.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-06.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « On tourne les rangées, 3 × 5 et 5 × 3 font autant. » (for example « 5 × 3 = 3 × 5 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 7

- **Ce qu'on y travaille** (la légende du parent) : La table de 3. Exemple : 3 × 7 = 21.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-07.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « La table de 3. » (for example « 3 × 7 = 21 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 8

- **Ce qu'on y travaille** (la légende du parent) : La table de 4, le double du double. Exemple : 4 × 6 = 24.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-08.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « La table de 4, le double du double. » (for example « 4 × 6 = 24 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### la multiplication, niveau 9

- **Ce qu'on y travaille** (la légende du parent) : Les tables de 2, 3, 4, 5 et 10 mélangées. Exemple : ? × 5 = 20.
- **Fichier à rendre** : `art/boutons/sources/niveau-multiplication-09.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: an orange tray with equal rows of round orange beads, showing the idea of this level: « Les tables de 2, 3, 4, 5 et 10 mélangées. » (for example « ? × 5 = 20 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### l'étal du pêcheur (la monnaie)

#### l'étal du pêcheur (la monnaie), niveau 1

- **Ce qu'on y travaille** (la légende du parent) : Pièces et billets, poser dans la soucoupe la pièce ou le billet demandé, de 1 à 50 euros. Exemple : Pose un billet de 10 euros..
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-01.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Pièces et billets, poser dans la soucoupe la pièce ou le billet demandé, de 1 à 50 euros. » (for example « Pose un billet de 10 euros. »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 2

- **Ce qu'on y travaille** (la légende du parent) : Payer juste avec des pièces de 1 et 2 euros, prix de 2 à 10 euros. Exemple : 7 = 2 + 2 + 2 + 1.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-02.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Payer juste avec des pièces de 1 et 2 euros, prix de 2 à 10 euros. » (for example « 7 = 2 + 2 + 2 + 1 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 3

- **Ce qu'on y travaille** (la légende du parent) : Payer juste avec des billets de 5 et 10 euros et des pièces, prix de 6 à 20 euros. Exemple : 17 = 10 + 5 + 2.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-03.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Payer juste avec des billets de 5 et 10 euros et des pièces, prix de 6 à 20 euros. » (for example « 17 = 10 + 5 + 2 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 4

- **Ce qu'on y travaille** (la légende du parent) : Payer juste jusqu'à 50 euros, avec des billets de 5 à 50 euros. Exemple : 34 = 20 + 10 + 2 + 2.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-04.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Payer juste jusqu'à 50 euros, avec des billets de 5 à 50 euros. » (for example « 34 = 20 + 10 + 2 + 2 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 5

- **Ce qu'on y travaille** (la légende du parent) : Payer juste avec un portefeuille restreint, une ou deux façons seulement. Exemple : 7 sans pièce de 1, 5 + 2.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-05.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Payer juste avec un portefeuille restreint, une ou deux façons seulement. » (for example « 7 sans pièce de 1, 5 + 2 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 6

- **Ce qu'on y travaille** (la légende du parent) : Le compte juste est impossible, payer sans pièce de trop, le pêcheur rend la monnaie. Exemple : 13 avec 20, il rend 7.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-06.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Le compte juste est impossible, payer sans pièce de trop, le pêcheur rend la monnaie. » (for example « 13 avec 20, il rend 7 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 7

- **Ce qu'on y travaille** (la légende du parent) : Rendre la monnaie, dire au pavé combien le pêcheur rend. Exemple : 13 payés avec 20, 7.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-07.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Rendre la monnaie, dire au pavé combien le pêcheur rend. » (for example « 13 payés avec 20, 7 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 8

- **Ce qu'on y travaille** (la légende du parent) : Deux produits, payer juste le total. Exemple : 3 + 4 = 7.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-08.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Deux produits, payer juste le total. » (for example « 3 + 4 = 7 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 9

- **Ce qu'on y travaille** (la légende du parent) : Les centimes, prix ronds ou en 50 centimes, écrits avec une virgule. Exemple : 3,50 = 2 + 1 + 0,50.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-09.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Les centimes, prix ronds ou en 50 centimes, écrits avec une virgule. » (for example « 3,50 = 2 + 1 + 0,50 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### l'étal du pêcheur (la monnaie), niveau 10

- **Ce qu'on y travaille** (la légende du parent) : Les centimes, prix en 10, 20 et 50 centimes. Exemple : 2,70 = 2 + 0,50 + 0,20.
- **Fichier à rendre** : `art/boutons/sources/niveau-etal-10.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a blue banknote and golden coins, showing the idea of this level: « Les centimes, prix en 10, 20 et 50 centimes. » (for example « 2,70 = 2 + 0,50 + 0,20 »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### les problèmes

#### les problèmes, niveau 1

- **Ce qu'on y travaille** (la légende du parent) : Ajouter ou enlever jusqu'à 10, le tout ou la fin inconnus. Exemple : 4 pommes et 3 poires, combien de fruits ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-01.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Ajouter ou enlever jusqu'à 10, le tout ou la fin inconnus. » (for example « 4 pommes et 3 poires, combien de fruits ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 2

- **Ce qu'on y travaille** (la légende du parent) : Ajouter ou enlever jusqu'à 20, le niveau de départ. Exemple : 12 parts de gâteau, 8 mangées, combien en reste-t-il ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-02.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Ajouter ou enlever jusqu'à 20, le niveau de départ. » (for example « 12 parts de gâteau, 8 mangées, combien en reste-t-il ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 3

- **Ce qu'on y travaille** (la légende du parent) : Groupes égaux et partage avec de petits nombres, l'enfant range les objets. Exemple : 6 fraises pour 2, combien chacun ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-03.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Groupes égaux et partage avec de petits nombres, l'enfant range les objets. » (for example « 6 fraises pour 2, combien chacun ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 4

- **Ce qu'on y travaille** (la légende du parent) : Chercher une partie ou le changement, jusqu'à 20. Exemple : 9 crayons dont 4 rouges, combien de bleus ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-04.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Chercher une partie ou le changement, jusqu'à 20. » (for example « 9 crayons dont 4 rouges, combien de bleus ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 5

- **Ce qu'on y travaille** (la légende du parent) : Comparer, de plus et de moins, jusqu'à 20. Exemple : 7 billes contre 4, combien de plus ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-05.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Comparer, de plus et de moins, jusqu'à 20. » (for example « 7 billes contre 4, combien de plus ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 6

- **Ce qu'on y travaille** (la légende du parent) : Ajouter, enlever, chercher une partie, jusqu'à 100. Exemple : 35 enfants, 20 à la cantine, combien chez eux ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-06.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Ajouter, enlever, chercher une partie, jusqu'à 100. » (for example « 35 enfants, 20 à la cantine, combien chez eux ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 7

- **Ce qu'on y travaille** (la légende du parent) : Groupes égaux et partage, jusqu'à 50. Exemple : 4 cagettes de 5 poissons, combien en tout ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-07.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Groupes égaux et partage, jusqu'à 50. » (for example « 4 cagettes de 5 poissons, combien en tout ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 8

- **Ce qu'on y travaille** (la légende du parent) : Le début inconnu, et comparer au-delà de 20. Exemple : Il en perd 6, il en reste 12, combien au début ?.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-08.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Le début inconnu, et comparer au-delà de 20. » (for example « Il en perd 6, il en reste 12, combien au début ? »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

#### les problèmes, niveau 9

- **Ce qu'on y travaille** (la légende du parent) : Deux étapes, deux calculs l'un après l'autre. Exemple : 6 billes, 5 de plus, puis 3 perdues.
- **Fichier à rendre** : `art/boutons/sources/niveau-problemes-09.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a little question card above two coloured tiles, showing the idea of this level: « Deux étapes, deux calculs l'un après l'autre. » (for example « 6 billes, 5 de plus, puis 3 perdues »), drawn as a simple picture, without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

## Les leçons (le menu des leçons)

### la leçon L1

- **Ce qu'on y apprend** (la légende du parent) : On compte les sauts, pas les bouées. Exemple : De 0 à 3, 3 sauts.
- **Fichier à rendre** : `art/boutons/sources/lecon-L1.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « On compte les sauts, pas les bouées. » (for example « De 0 à 3, 3 sauts »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L2

- **Ce qu'on y apprend** (la légende du parent) : Un saut peut valoir dix. Exemple : 10, 20, 30.
- **Fichier à rendre** : `art/boutons/sources/lecon-L2.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Un saut peut valoir dix. » (for example « 10, 20, 30 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L3

- **Ce qu'on y apprend** (la légende du parent) : Une ligne ne commence pas toujours à 0. Exemple : 30, 31, 32.
- **Fichier à rendre** : `art/boutons/sources/lecon-L3.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Une ligne ne commence pas toujours à 0. » (for example « 30, 31, 32 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L4

- **Ce qu'on y apprend** (la légende du parent) : Les doubles, deux fois le même nombre. Exemple : 3 + 3.
- **Fichier à rendre** : `art/boutons/sources/lecon-L4.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Les doubles, deux fois le même nombre. » (for example « 3 + 3 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L5

- **Ce qu'on y apprend** (la légende du parent) : Les amis de 10, remplir la boîte de dix. Exemple : 7 + 3.
- **Fichier à rendre** : `art/boutons/sources/lecon-L5.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Les amis de 10, remplir la boîte de dix. » (for example « 7 + 3 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L6

- **Ce qu'on y apprend** (la légende du parent) : La maison des nombres, deux pièces et le toit. Exemple : 5 + 2 = 7.
- **Fichier à rendre** : `art/boutons/sources/lecon-L6.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « La maison des nombres, deux pièces et le toit. » (for example « 5 + 2 = 7 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L10

- **Ce qu'on y apprend** (la légende du parent) : Les centaines, cent, c'est dix dizaines. Exemple : 100, 200, 307.
- **Fichier à rendre** : `art/boutons/sources/lecon-L10.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Les centaines, cent, c'est dix dizaines. » (for example « 100, 200, 307 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L7

- **Ce qu'on y apprend** (la légende du parent) : Plus 10 sur le mur de corail, on descend d'une rangée. Exemple : 34 + 10.
- **Fichier à rendre** : `art/boutons/sources/lecon-L7.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Plus 10 sur le mur de corail, on descend d'une rangée. » (for example « 34 + 10 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L8

- **Ce qu'on y apprend** (la légende du parent) : L'astuce du 9, plus 10, puis moins 1. Exemple : 34 + 9.
- **Fichier à rendre** : `art/boutons/sources/lecon-L8.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « L'astuce du 9, plus 10, puis moins 1. » (for example « 34 + 9 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L9

- **Ce qu'on y apprend** (la légende du parent) : Passer la dizaine, on complète d'abord jusqu'à 10. Exemple : 38 + 5.
- **Fichier à rendre** : `art/boutons/sources/lecon-L9.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Passer la dizaine, on complète d'abord jusqu'à 10. » (for example « 38 + 5 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L11

- **Ce qu'on y apprend** (la légende du parent) : Dix et encore, une boîte pleine et ce qui reste. Exemple : 10 + 4 = 14.
- **Fichier à rendre** : `art/boutons/sources/lecon-L11.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Dix et encore, une boîte pleine et ce qui reste. » (for example « 10 + 4 = 14 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L12

- **Ce qu'on y apprend** (la légende du parent) : Faire dix d'abord, on remplit la boîte, puis on ajoute le reste. Exemple : 8 + 5 = 13.
- **Fichier à rendre** : `art/boutons/sources/lecon-L12.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Faire dix d'abord, on remplit la boîte, puis on ajoute le reste. » (for example « 8 + 5 = 13 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L13

- **Ce qu'on y apprend** (la légende du parent) : Des rangées égales, 3 fois 4, c'est 4 + 4 + 4. Exemple : 3 × 4 = 12.
- **Fichier à rendre** : `art/boutons/sources/lecon-L13.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Des rangées égales, 3 fois 4, c'est 4 + 4 + 4. » (for example « 3 × 4 = 12 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L14

- **Ce qu'on y apprend** (la légende du parent) : On tourne les rangées, 3 × 5 fait autant que 5 × 3. Exemple : 3 × 5 = 5 × 3.
- **Fichier à rendre** : `art/boutons/sources/lecon-L14.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « On tourne les rangées, 3 × 5 fait autant que 5 × 3. » (for example « 3 × 5 = 5 × 3 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L15

- **Ce qu'on y apprend** (la légende du parent) : Pièces et billets, une pièce de 2 euros vaut deux pièces de 1 euro, on compte la valeur. Exemple : 2 + 2 + 2 = 6.
- **Fichier à rendre** : `art/boutons/sources/lecon-L15.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Pièces et billets, une pièce de 2 euros vaut deux pièces de 1 euro, on compte la valeur. » (for example « 2 + 2 + 2 = 6 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L16

- **Ce qu'on y apprend** (la légende du parent) : Payer juste, du plus gros au plus petit. Exemple : 17, 10, 15, 16, 17.
- **Fichier à rendre** : `art/boutons/sources/lecon-L16.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Payer juste, du plus gros au plus petit. » (for example « 17, 10, 15, 16, 17 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L17

- **Ce qu'on y apprend** (la légende du parent) : Rendre la monnaie, on compte à partir du prix jusqu'à ce qu'on a donné. Exemple : de 13 à 20, 7.
- **Fichier à rendre** : `art/boutons/sources/lecon-L17.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Rendre la monnaie, on compte à partir du prix jusqu'à ce qu'on a donné. » (for example « de 13 à 20, 7 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L18

- **Ce qu'on y apprend** (la légende du parent) : Les centimes, 100 centimes font 1 euro, 3,50 c'est 3 euros et 50 centimes. Exemple : 0,50 + 0,50 = 1.
- **Fichier à rendre** : `art/boutons/sources/lecon-L18.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Les centimes, 100 centimes font 1 euro, 3,50 c'est 3 euros et 50 centimes. » (for example « 0,50 + 0,50 = 1 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon L19

- **Ce qu'on y apprend** (la légende du parent) : Le schéma en barres, le tout et ses deux parties, on ajoute ou on enlève. Exemple : 4 + 3 = 7, 9 - 4 = 5.
- **Fichier à rendre** : `art/boutons/sources/lecon-L19.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « Le schéma en barres, le tout et ses deux parties, on ajoute ou on enlève. » (for example « 4 + 3 = 7, 9 - 4 = 5 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon +

- **Ce qu'on y apprend** (la légende du parent) : La table d'addition, toucher une case dit et montre le calcul. Exemple : 7 + 5 = 12.
- **Fichier à rendre** : `art/boutons/sources/lecon-+.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « La table d'addition, toucher une case dit et montre le calcul. » (for example « 7 + 5 = 12 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```

### la leçon ×

- **Ce qu'on y apprend** (la légende du parent) : La table de multiplication, toucher une case dit et montre le calcul. Exemple : 3 × 4 = 12.
- **Fichier à rendre** : `art/boutons/sources/lecon-×.png`

```text
Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: a small open picture book, and on its page a simple picture showing the idea of this lesson: « La table de multiplication, toucher une case dit et montre le calcul. » (for example « 3 × 4 = 12 »), without any written number or sign.

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform pure green (#00FF00) colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark.

Square picture (1:1).
```
