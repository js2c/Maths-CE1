# Les prompts Nano Banana des objets de l'histoire

Écrit par `node art/problemes/mise-en-scene/relever.mjs --md` (`art/problemes/mise-en-scene/objets.json`). Dans l'ordre où les objets servent le plus : commencer par le haut de la liste suffit pour les premiers niveaux.

**Méthode** (la même que pour les produits de l'étal, `art/etal/outils/5-produits.py`) :

1. Joindre l'image de référence du style : `art/etal/sources/etal-beau-temps.jpg` ; dès qu'un objet de la même catégorie est réussi (un personnage, un contenant), le joindre aussi, en deuxième image, et ajouter « Same character design (proportions, line weight, eyes) as the second attached image. » : c'est ce qui garde une même main pour Papa, Maman, la maîtresse…
2. Copier le prompt. Une image par variante (« fermé », « ouvert »…) : demander l'une, puis « the same object, but … » pour l'autre, dans la même conversation.
3. Vérifier : un seul objet, entier, rien dedans qu'on puisse compter, aucun texte ni chiffre, le contour fermé tout autour, le fond d'une seule couleur.
4. Déposer l'image telle quelle dans `art/problemes/mise-en-scene/sources/`, sous le nom indiqué. Le détourage (fond vert ou magenta retiré, cadrage, réduction en @1x et @2x) sera fait par l'atelier, au lot.

**Fond** : vert franc (`#00FF00`), comme les produits de l'étal, les créatures du récif et la mascotte ; **magenta** (`#FF00FF`) pour un objet qui a du vert (le détourage retirerait sa couleur).

## Le prompt commun

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: [SUJET]

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

[ETAT]

Background: one flat uniform [FOND] colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

[SUJET] : la description de l'objet ; [ETAT] : selon sa catégorie (personnage : « Full body, standing… » ; contenant : « It is closed… » ; dépôt : « It is empty… ») ; [FOND] : la couleur du fond. Les prompts complets suivent.

## Les 83 objets à générer

### la table (`table`)

- **Sert** : 27 énoncés, jusqu'à 4 à la fois. **Taille** : 150 px de haut dans la scène (@1x ; @2x : 300 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/table-cuisine.png`, `art/problemes/mise-en-scene/sources/table-salon.png`, `art/problemes/mise-en-scene/sources/table-cantine.png`
- **Note** : la table est aussi un groupe (3 tables de 8 enfants, 4 tables à la kermesse)

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a simple wooden table seen from the front, slightly from above so that its top is visible; make three pictures: a family kitchen table with a checked tablecloth, a low living-room coffee table, a long canteen table.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : cuisine, salon, cantine ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### ton copain (ton cousin) (`copain`)

- **Sert** : 12 énoncés. **Taille** : 190 px de haut dans la scène (@1x ; @2x : 380 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/copain.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a seven-year-old boy, messy fair hair, an orange T-shirt, blue shorts, trainers.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer, arms relaxed, hands empty. About seven years old, child proportions (big head, short legs). A simple, friendly face with clear eyes and a small smile. Only one child in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### Papa (`papa`)

- **Sert** : 12 énoncés. **Taille** : 250 px de haut dans la scène (@1x ; @2x : 500 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/papa.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly French dad in his thirties, short brown hair, a light beard, a blue checked shirt with rolled-up sleeves, jeans, trainers.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le boulanger, la boulangère (`boulanger`)

- **Sert** : 12 énoncés. **Taille** : 245 px de haut dans la scène (@1x ; @2x : 490 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/boulanger-homme.png`, `art/problemes/mise-en-scene/sources/boulanger-femme.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a smiling baker wearing a white apron over a light blue shirt, a small white baker's cap; make two pictures: a man with a round face, and a woman with a red headscarf.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : homme, femme ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### la maîtresse (`maitresse`)

- **Sert** : 11 énoncés. **Taille** : 250 px de haut dans la scène (@1x ; @2x : 500 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/maitresse.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly young French primary-school teacher, a brown ponytail, a red cardigan, a long navy skirt, flat shoes.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la fermière (`fermiere`)

- **Sert** : 8 énoncés. **Taille** : 245 px de haut dans la scène (@1x ; @2x : 490 px), image générée portrait (864 × 1184). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/fermiere.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a farmer woman with red hair in a bun, blue dungarees over a white T-shirt, green rubber boots.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le marchand, la marchande (`marchand`)

- **Sert** : 8 énoncés. **Taille** : 245 px de haut dans la scène (@1x ; @2x : 490 px), image générée portrait (864 × 1184). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/marchand-homme.png`, `art/problemes/mise-en-scene/sources/marchand-femme.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a market seller wearing a long green canvas apron over a striped shirt; make two pictures: a man with a straw hat, and a woman with a braid.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : homme, femme ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### Maman (`maman`)

- **Sert** : 7 énoncés. **Taille** : 245 px de haut dans la scène (@1x ; @2x : 490 px), image générée portrait (864 × 1184). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/maman.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly French mum in her thirties, shoulder-length dark hair, a yellow jumper, a long green skirt, ankle boots.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le pêcheur (`pecheur`)

- **Sert** : 7 énoncés. **Taille** : 250 px de haut dans la scène (@1x ; @2x : 500 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/pecheur.png`
- **Note** : vu derrière l'étal : seul le haut dépasse ; à ne pas confondre avec la mascotte (elle raconte, elle n'est pas dans l'histoire)

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly fisherman with a grey beard, a yellow oilskin jacket, navy trousers tucked into rubber boots, a wool beanie.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le pupitre (la table de classe) (`pupitre`)

- **Sert** : 7 énoncés. **Taille** : 140 px de haut dans la scène (@1x ; @2x : 280 px), image générée paysage large (1344 × 768). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/pupitre.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a French primary-school pupil's desk for two, light wood with a green metal frame, seen from the front, its top visible.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la boîte (d'œufs, de billes, de gâteaux) (`boite`)

- **Sert** : 7 énoncés, jusqu'à 5 à la fois. **Taille** : 95 px de haut dans la scène (@1x ; @2x : 190 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/boite-fermee.png`, `art/problemes/mise-en-scene/sources/boite-ouverte.png`

*fermee* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a simple rectangular light blue cardboard box.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Its lid is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

*ouverte* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a simple rectangular light blue cardboard box.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is open, the lid lifted behind, and empty: nothing inside.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le bus (`bus`)

- **Sert** : 7 énoncés. **Taille** : 220 px de haut dans la scène (@1x ; @2x : 440 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/bus.png`
- **Note** : l'illustration du lieu « bus » montre déjà un bus : à la mise en scène, le bus devient un objet posé (la plaque de la réponse sur sa vitre), et le lieu n'a plus que la rue

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a city bus seen from the side, its front door open, windows showing only soft reflections: no passengers, no seats visible.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### l'assiette (`assiette`)

- **Sert** : 5 énoncés, jusqu'à 3 à la fois. **Taille** : 55 px de haut dans la scène (@1x ; @2x : 110 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/assiette.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round white plate with a thin blue rim, seen slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la boîte d'œufs (`boite-oeufs`)

- **Sert** : 5 énoncés, jusqu'à 7 à la fois. **Taille** : 75 px de haut dans la scène (@1x ; @2x : 150 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/boite-oeufs-fermee.png`, `art/problemes/mise-en-scene/sources/boite-oeufs-ouverte.png`

*fermee* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a grey cardboard egg box for six eggs.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: the eggs cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

*ouverte* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a grey cardboard egg box for six eggs.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is open and all its six cups are empty.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le sachet (`sachet`)

- **Sert** : 5 énoncés, jusqu'à 5 à la fois. **Taille** : 125 px de haut dans la scène (@1x ; @2x : 250 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/sachet-ferme.png`, `art/problemes/mise-en-scene/sources/sachet-ouvert.png`

*ferme* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small brown kraft-paper bag.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is folded and closed at the top with a red ribbon: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

*ouvert* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small brown kraft-paper bag.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is open at the top, the paper slightly crumpled, and empty: nothing inside.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le collier, le bracelet (`collier`)

- **Sert** : 5 énoncés, jusqu'à 2 à la fois. **Taille** : 120 px de haut dans la scène (@1x ; @2x : 240 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/collier.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a plain cord for a bead necklace, lying in a round loop, with its little clasp; no bead on it.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le panier (`panier`)

- **Sert** : 5 énoncés, jusqu'à 5 à la fois. **Taille** : 130 px de haut dans la scène (@1x ; @2x : 260 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/panier-vide.png`, `art/problemes/mise-en-scene/sources/panier-couvert.png`

*vide* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round wicker basket with a handle.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

*couvert* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round wicker basket with a handle.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is covered with a red and white checked cloth: its contents cannot be seen, nothing can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### Mamie (`mamie`)

- **Sert** : 4 énoncés. **Taille** : 235 px de haut dans la scène (@1x ; @2x : 470 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/mamie.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a cheerful grandmother, short white curly hair, round glasses, a lilac cardigan over a flowered dress, comfortable shoes.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le carnet, le livre (qui contient des pages) (`carnet`)

- **Sert** : 4 énoncés. **Taille** : 95 px de haut dans la scène (@1x ; @2x : 190 px), image générée portrait (864 × 1184). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/carnet-carnet.png`, `art/problemes/mise-en-scene/sources/carnet-livre.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a closed hardback book with a plain coloured cover; make two pictures: a small red notebook, and a thick green book.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : carnet, livre ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### le cerceau (une équipe, un groupe) (`cerceau`)

- **Sert** : 4 énoncés, jusqu'à 5 à la fois. **Taille** : 50 px de haut dans la scène (@1x ; @2x : 100 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/cerceau.png`
- **Note** : les équipes et les groupes : un cerceau au sol, autour duquel l'application pose les enfants

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a plastic gym hoop lying flat on the floor, seen from above at an angle, bright yellow.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le minibus, le car (`minibus`)

- **Sert** : 4 énoncés. **Taille** : 150 px de haut dans la scène (@1x ; @2x : 300 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/minibus-minibus.png`, `art/problemes/mise-en-scene/sources/minibus-car.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small white school minibus seen from the side, windows showing only soft reflections (no passengers, no seats visible); and a big yellow coach, the same way.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : minibus, car ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### le clapier, le poulailler (`nid-poule`)

- **Sert** : 3 énoncés. **Taille** : 160 px de haut dans la scène (@1x ; @2x : 320 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/nid-poule-clapier.png`, `art/problemes/mise-en-scene/sources/nid-poule-poulailler.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small wooden rabbit hutch with a wire door, empty; and a small wooden henhouse with its ramp, empty.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : clapier, poulailler ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### le seau (`seau`)

- **Sert** : 3 énoncés. **Taille** : 150 px de haut dans la scène (@1x ; @2x : 300 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/seau-plage.png`, `art/problemes/mise-en-scene/sources/seau-pecheur.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a child's beach bucket in red plastic with a yellow handle, seen slightly from above, the inside visible; and a grey metal fisherman's bucket.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : plage, pecheur ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### le toboggan, les balançoires, le bac à sable (`toboggan`)

- **Sert** : 3 énoncés. **Taille** : 200 px de haut dans la scène (@1x ; @2x : 400 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/toboggan-toboggan.png`, `art/problemes/mise-en-scene/sources/toboggan-balancoires.png`, `art/problemes/mise-en-scene/sources/toboggan-bac.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a playground slide, seen from the side; make three pictures: the slide, a swing set with two empty swings, a square sandbox with a wooden border.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : toboggan, balancoires, bac ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### l'étagère (`etagere`)

- **Sert** : 3 énoncés, jusqu'à 3 à la fois. **Taille** : 70 px de haut dans la scène (@1x ; @2x : 140 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/etagere.png`
- **Note** : jusqu'à 3 l'une au-dessus de l'autre (9 peluches sur 3 étagères)

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a single wooden wall shelf with two brackets, seen from the front.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la caisse des lots (`caisse`)

- **Sert** : 3 énoncés. **Taille** : 110 px de haut dans la scène (@1x ; @2x : 220 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/caisse.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a striped cardboard prize box with its lid closed, like at a school fête.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### des enfants (quand ils forment les groupes) (`enfants`)

- **Sert** : 3 énoncés, jusqu'à 9 à la fois. **Taille** : 170 px de haut dans la scène (@1x ; @2x : 340 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/enfants-a.png`, `art/problemes/mise-en-scene/sources/enfants-b.png`, `art/problemes/mise-en-scene/sources/enfants-c.png`, `art/problemes/mise-en-scene/sources/enfants-d.png`
- **Note** : quatre enfants différents, répétés et retournés par l'application quand un groupe en compte plus (jusqu'à 9) ; aussi pour les élèves des équipes

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a seven-year-old child; make four different pictures, one child each: (a) a boy with a red cap and a green jumper, (b) a girl with blond plaits and a yellow raincoat, (c) a boy with short black hair and a blue hoodie, (d) a girl with a brown bob and a pink T-shirt.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer, arms relaxed, hands empty. About seven years old, child proportions (big head, short legs). A simple, friendly face with clear eyes and a small smile. Only one child in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : a, b, c, d ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### la gamelle (`gamelle`)

- **Sert** : 3 énoncés. **Taille** : 70 px de haut dans la scène (@1x ; @2x : 140 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/gamelle.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round stainless-steel pet bowl seen slightly from above, the inside visible.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la rangée (de salades, de sièges) (`rangee`)

- **Sert** : 3 énoncés, jusqu'à 8 à la fois. **Taille** : 45 px de haut dans la scène (@1x ; @2x : 90 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/rangee-sillon.png`, `art/problemes/mise-en-scene/sources/rangee-sieges.png`
- **Note** : les sièges du car : une rangée de sièges (variante)

*sillon* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one straight row, seen from the front, slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

The row is a single furrow of freshly dug brown soil, empty: no plant in it.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

*sieges* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one straight row, seen from the front, slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

The row is one single row of empty blue bus seats, seen from the front (only the seat backs).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le banc (`banc`)

- **Sert** : 2 énoncés, jusqu'à 4 à la fois. **Taille** : 110 px de haut dans la scène (@1x ; @2x : 220 px), image générée paysage large (1344 × 768). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/banc.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a green wooden park bench seen from the front.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le coffre (`coffre`)

- **Sert** : 2 énoncés. **Taille** : 120 px de haut dans la scène (@1x ; @2x : 240 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/coffre.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a painted wooden toy chest, its lid closed, blue with yellow corners.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le nid (`nid`)

- **Sert** : 2 énoncés, jusqu'à 3 à la fois. **Taille** : 60 px de haut dans la scène (@1x ; @2x : 120 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/nid.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round straw nest, seen slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le pot à crayons (`pot`)

- **Sert** : 2 énoncés, jusqu'à 4 à la fois. **Taille** : 110 px de haut dans la scène (@1x ; @2x : 220 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/pot.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a cylindrical pencil pot made of a painted tin can, bright red.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la trousse (`trousse`)

- **Sert** : 2 énoncés. **Taille** : 70 px de haut dans la scène (@1x ; @2x : 140 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/trousse-bleue.png`, `art/problemes/mise-en-scene/sources/trousse-jaune.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a soft fabric pencil case with a zip, closed; make two pictures: a blue one, and a yellow one with little stars.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : bleue, jaune ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### le vase (`vase`)

- **Sert** : 2 énoncés, jusqu'à 3 à la fois. **Taille** : 130 px de haut dans la scène (@1x ; @2x : 260 px), image générée portrait (864 × 1184). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/vase.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a simple glass vase with a little water, round at the bottom.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### ta voisine (ta cousine) (`voisine`)

- **Sert** : 2 énoncés. **Taille** : 185 px de haut dans la scène (@1x ; @2x : 370 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/voisine.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a seven-year-old girl, dark curly hair in two puffs, a purple dress over striped leggings, trainers.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer, arms relaxed, hands empty. About seven years old, child proportions (big head, short legs). A simple, friendly face with clear eyes and a small smile. Only one child in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le chat (`chat`)

- **Sert** : 2 énoncés, jusqu'à 2 à la fois. **Taille** : 115 px de haut dans la scène (@1x ; @2x : 230 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/chat-roux.png`, `art/problemes/mise-en-scene/sources/chat-gris.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly cat, sitting, seen three-quarters, ginger tabby fur, a white muzzle, tail curled around its paws; make two pictures: a ginger cat, and a grey cat with white paws.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only one animal, whole, calm and friendly, eyes open.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : roux, gris ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### le chien (`chien`)

- **Sert** : 2 énoncés. **Taille** : 160 px de haut dans la scène (@1x ; @2x : 320 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/chien.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly medium-sized dog, sitting, seen from the side three-quarters, light brown fur with a white chest, floppy ears, a red collar, tongue slightly out.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only one animal, whole, calm and friendly, eyes open.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### Papy (`papy`)

- **Sert** : 2 énoncés. **Taille** : 240 px de haut dans la scène (@1x ; @2x : 480 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/papy.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a cheerful grandfather, grey hair and a white moustache, a flat cap, a brown waistcoat over a white shirt, corduroy trousers.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le paquet (de feutres, de yaourts, de pâtes) (`paquet`)

- **Sert** : 2 énoncés, jusqu'à 4 à la fois. **Taille** : 105 px de haut dans la scène (@1x ; @2x : 210 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/paquet.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a closed cardboard packet, orange and white, plain (no drawing on it, no window).

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le plateau (`plateau`)

- **Sert** : 2 énoncés, jusqu'à 4 à la fois. **Taille** : 50 px de haut dans la scène (@1x ; @2x : 100 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/plateau.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a rectangular wooden baker's tray, seen slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le sac (`sac`)

- **Sert** : 2 énoncés. **Taille** : 140 px de haut dans la scène (@1x ; @2x : 280 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/sac-toile.png`, `art/problemes/mise-en-scene/sources/sac-filet.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a big closed cloth tote bag, red; and a big mesh sports bag for balls, closed.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : toile, filet ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### la barque (`barque`)

- **Sert** : 1 énoncés. **Taille** : 85 px de haut dans la scène (@1x ; @2x : 170 px), image générée paysage large (1344 × 768). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/barque.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small wooden rowing boat on calm water, seen from the side, empty, oars inside.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le bol (`bol`)

- **Sert** : 1 énoncés. **Taille** : 65 px de haut dans la scène (@1x ; @2x : 130 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/bol.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round ceramic breakfast bowl, white with red dots, seen slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la corbeille à fruits (`corbeille`)

- **Sert** : 1 énoncés. **Taille** : 90 px de haut dans la scène (@1x ; @2x : 180 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/corbeille.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a low round wicker fruit bowl seen slightly from above, the inside visible.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le gâteau d'anniversaire (`gateau`)

- **Sert** : 1 énoncés. **Taille** : 90 px de haut dans la scène (@1x ; @2x : 180 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/gateau.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round chocolate birthday cake on a plate, seen slightly from above, without candles and not cut.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la poule (`poule`)

- **Sert** : 1 énoncés. **Taille** : 95 px de haut dans la scène (@1x ; @2x : 190 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/poule.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a plump brown hen standing, seen from the side, red comb.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only one animal, whole, calm and friendly, eyes open.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le rosier (`rosier`)

- **Sert** : 1 énoncés. **Taille** : 150 px de haut dans la scène (@1x ; @2x : 300 px), image générée carré (1024 × 1024). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/rosier.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small rose bush in the ground, green leaves and only two pink roses, no butterfly.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la tour de cubes (`tour`)

- **Sert** : 1 énoncés. **Taille** : 40 px de haut dans la scène (@1x ; @2x : 80 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/tour.png`
- **Note** : à revoir : la tour est faite des unités (les cubes) ; sans doute seulement l'icône du cube

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a wooden play mat seen from the front with the base of a toy tower: just a flat square wooden base.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la cagette (`cagette`)

- **Sert** : 1 énoncés, jusqu'à 4 à la fois. **Taille** : 95 px de haut dans la scène (@1x ; @2x : 190 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/cagette-vide.png`, `art/problemes/mise-en-scene/sources/cagette-couverte.png`

*vide* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a light wooden fruit crate with slatted sides, seen from the front, slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

*couverte* :

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a light wooden fruit crate with slatted sides, seen from the front, slightly from above.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is covered with brown paper: its contents cannot be seen, nothing can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le chariot de la bibliothèque (`chariot`)

- **Sert** : 1 énoncés. **Taille** : 140 px de haut dans la scène (@1x ; @2x : 280 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/chariot.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small wooden library book trolley on wheels, seen from the front, its shelves empty.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing on it and nothing in it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le cuisinier (`cuisinier`)

- **Sert** : 1 énoncés. **Taille** : 250 px de haut dans la scène (@1x ; @2x : 500 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/cuisinier.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly school cook with a white chef's hat, a white jacket and blue checked trousers.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Full body, standing, facing the viewer and very slightly turned to the right, arms relaxed, hands empty and open (objects will be placed next to the person). A simple, friendly face with clear eyes and a small smile. Only one person in the picture.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le filet de ballons (`filet`)

- **Sert** : 1 énoncés, jusqu'à 5 à la fois. **Taille** : 140 px de haut dans la scène (@1x ; @2x : 280 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/filet.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a closed mesh net bag for sports balls, hanging from its cord, seen from the front; the net is empty.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le pack d'eau (`pack`)

- **Sert** : 1 énoncés, jusqu'à 6 à la fois. **Taille** : 90 px de haut dans la scène (@1x ; @2x : 180 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/pack.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a pack of water bottles wrapped in opaque blue plastic film with a carrying handle: the bottles cannot be counted through the film.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is closed: its contents cannot be seen, nothing inside can be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### le soir (une soirée de lecture) (`soir`)

- **Sert** : 1 énoncés, jusqu'à 4 à la fois. **Taille** : 80 px de haut dans la scène (@1x ; @2x : 160 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/soir.png`
- **Note** : une image par soir lu (4 soirs, 5 pages chaque soir)

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small round window at night with a crescent moon and the corner of a bedside lamp.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

It is empty: nothing inside and nothing on it, nothing that could be counted.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### la vache (`vache`)

- **Sert** : 1 énoncés, jusqu'à 7 à la fois. **Taille** : 140 px de haut dans la scène (@1x ; @2x : 280 px), image générée paysage (1184 × 864). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/vache.png`
- **Note** : aussi dans les groupes (7 vaches de 4 pattes) : à l'échelle réduite, jusqu'à 7 dans la scène

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a friendly black and white dairy cow standing, seen from the side, all four legs clearly visible.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only one animal, whole, calm and friendly, eyes open.

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### bille, voiture, peluche, cube, carte, jeton, ballon, cerceau (`u-jouet`)

- **Sert** : 28 énoncés. **Taille** : 44 px de haut dans la scène (@1x ; @2x : 88 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-jouet-voiture.png`, `art/problemes/mise-en-scene/sources/u-jouet-peluche.png`, `art/problemes/mise-en-scene/sources/u-jouet-cube.png`, `art/problemes/mise-en-scene/sources/u-jouet-carte.png`, `art/problemes/mise-en-scene/sources/u-jouet-cerceau.png`, `art/problemes/mise-en-scene/sources/u-jouet-ballon-basket.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one toy; make six pictures: a small red toy car, a teddy bear, a wooden toy cube, a playing card seen from the back with a plain pattern, a plastic hoop, a basketball.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : voiture, peluche, cube, carte, cerceau, ballon-basket ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### mouton, chèvre, cheval, canard, lapin, pigeon, papillon, poule (`u-animal`)

- **Sert** : 14 énoncés. **Taille** : 46 px de haut dans la scène (@1x ; @2x : 92 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-animal-mouton.png`, `art/problemes/mise-en-scene/sources/u-animal-chevre.png`, `art/problemes/mise-en-scene/sources/u-animal-cheval.png`, `art/problemes/mise-en-scene/sources/u-animal-canard.png`, `art/problemes/mise-en-scene/sources/u-animal-lapin.png`, `art/problemes/mise-en-scene/sources/u-animal-pigeon.png`, `art/problemes/mise-en-scene/sources/u-animal-papillon.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one small animal seen from the side; make seven pictures: a sheep, a goat, a horse, a duck, a rabbit, a pigeon, a butterfly.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : mouton, chevre, cheval, canard, lapin, pigeon, papillon ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### crayon, feutre, craie, cahier, feuille, image, autocollant (`u-ecole`)

- **Sert** : 13 énoncés. **Taille** : 42 px de haut dans la scène (@1x ; @2x : 84 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-ecole-crayon.png`, `art/problemes/mise-en-scene/sources/u-ecole-feutre.png`, `art/problemes/mise-en-scene/sources/u-ecole-craie.png`, `art/problemes/mise-en-scene/sources/u-ecole-cahier.png`, `art/problemes/mise-en-scene/sources/u-ecole-feuille.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one school item; make five pictures: a coloured pencil, a felt-tip pen with its cap, a white stick of chalk, a small notebook, a blank sheet of paper.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : crayon, feutre, craie, cahier, feuille ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### croissant, pain au chocolat, baguette, pain (`u-viennoiserie`)

- **Sert** : 11 énoncés. **Taille** : 44 px de haut dans la scène (@1x ; @2x : 88 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-viennoiserie-croissant.png`, `art/problemes/mise-en-scene/sources/u-viennoiserie-pain-chocolat.png`, `art/problemes/mise-en-scene/sources/u-viennoiserie-baguette.png`, `art/problemes/mise-en-scene/sources/u-viennoiserie-pain.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one bakery item; make four pictures: a croissant, a pain au chocolat, a baguette, a round country loaf.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : croissant, pain-chocolat, baguette, pain ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### biscuit, gourmandise, croquette, gâteau (`u-biscuit`)

- **Sert** : 11 énoncés. **Taille** : 40 px de haut dans la scène (@1x ; @2x : 80 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-biscuit-biscuit.png`, `art/problemes/mise-en-scene/sources/u-biscuit-gourmandise.png`, `art/problemes/mise-en-scene/sources/u-biscuit-croquette.png`, `art/problemes/mise-en-scene/sources/u-biscuit-gateau.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one item; make four pictures: a round cookie with chocolate chips, a bone-shaped dog treat, a single small kibble, a small cupcake.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : biscuit, gourmandise, croquette, gateau ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### livre, bande dessinée, page (`u-livre`)

- **Sert** : 10 énoncés. **Taille** : 44 px de haut dans la scène (@1x ; @2x : 88 px), image générée portrait (864 × 1184). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-livre.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one closed book seen from the front, plain coloured cover.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### œuf (`u-oeuf`)

- **Sert** : 8 énoncés. **Taille** : 38 px de haut dans la scène (@1x ; @2x : 76 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-oeuf.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a light brown egg.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### fleur, tulipe, rose (`u-fleur`)

- **Sert** : 5 énoncés. **Taille** : 50 px de haut dans la scène (@1x ; @2x : 100 px), image générée portrait (864 × 1184). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-fleur-tulipe.png`, `art/problemes/mise-en-scene/sources/u-fleur-rose.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one flower with its stem; make two pictures: a red tulip, a pink rose.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : tulipe, rose ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### pomme (`u-pomme`)

- **Sert** : 5 énoncés. **Taille** : 44 px de haut dans la scène (@1x ; @2x : 88 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-pomme.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a red apple with a leaf.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### perle (`u-perle`)

- **Sert** : 5 énoncés. **Taille** : 30 px de haut dans la scène (@1x ; @2x : 60 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-perle.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one round wooden bead for a necklace, painted a single bright colour, with the hole through its middle visible.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### salade (`u-salade`)

- **Sert** : 4 énoncés. **Taille** : 42 px de haut dans la scène (@1x ; @2x : 84 px), image générée carré (1024 × 1024). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-salade.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round green lettuce.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### lot, jeu (de la kermesse) (`u-lot`)

- **Sert** : 4 énoncés. **Taille** : 42 px de haut dans la scène (@1x ; @2x : 84 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-lot.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small wrapped present with a ribbon.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### pomme de pin, châtaigne, champignon (`u-foret`)

- **Sert** : 4 énoncés. **Taille** : 40 px de haut dans la scène (@1x ; @2x : 80 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-foret-pomme-de-pin.png`, `art/problemes/mise-en-scene/sources/u-foret-chataigne.png`, `art/problemes/mise-en-scene/sources/u-foret-champignon.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one forest find; make three pictures: a pine cone, a shiny chestnut, a brown mushroom.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : pomme-de-pin, chataigne, champignon ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### place, siège (`u-place`)

- **Sert** : 4 énoncés. **Taille** : 44 px de haut dans la scène (@1x ; @2x : 88 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-place.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one empty blue bus seat seen from the front.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### coquillage (`u-coquillage`)

- **Sert** : 3 énoncés. **Taille** : 38 px de haut dans la scène (@1x ; @2x : 76 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-coquillage-blanc.png`, `art/problemes/mise-en-scene/sources/u-coquillage-rose.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one scallop seashell; make two pictures: a white one, a pink one.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : blanc, rose ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### crêpe (`u-crepe`)

- **Sert** : 3 énoncés. **Taille** : 40 px de haut dans la scène (@1x ; @2x : 80 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-crepe.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a folded golden pancake (crêpe).

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### fraise (`u-fraise`)

- **Sert** : 3 énoncés. **Taille** : 40 px de haut dans la scène (@1x ; @2x : 80 px), image générée carré (1024 × 1024). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-fraise.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a red strawberry with its green top.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### bonbon, sucette (`u-bonbon`)

- **Sert** : 3 énoncés. **Taille** : 36 px de haut dans la scène (@1x ; @2x : 72 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-bonbon-bonbon.png`, `art/problemes/mise-en-scene/sources/u-bonbon-sucette.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one sweet; make two pictures: a wrapped sweet, a round lollipop.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : bonbon, sucette ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### bouteille (`u-bouteille`)

- **Sert** : 3 énoncés. **Taille** : 50 px de haut dans la scène (@1x ; @2x : 100 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-bouteille-eau.png`, `art/problemes/mise-en-scene/sources/u-bouteille-jus.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a plastic bottle with a blue cap; make two pictures: water (clear blue), orange juice.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : eau, jus ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### melon, pastèque, citron, orange (`u-fruit`)

- **Sert** : 3 énoncés. **Taille** : 46 px de haut dans la scène (@1x ; @2x : 92 px), image générée carré (1024 × 1024). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-fruit-melon.png`, `art/problemes/mise-en-scene/sources/u-fruit-pasteque.png`, `art/problemes/mise-en-scene/sources/u-fruit-citron.png`, `art/problemes/mise-en-scene/sources/u-fruit-orange.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one fruit; make four pictures: a melon, a small watermelon, a lemon, an orange.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : melon, pasteque, citron, orange ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### bougie, part de gâteau (`u-bougie`)

- **Sert** : 2 énoncés. **Taille** : 44 px de haut dans la scène (@1x ; @2x : 88 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-bougie-bougie.png`, `art/problemes/mise-en-scene/sources/u-bougie-part.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one item; make two pictures: a lit birthday candle, a triangular slice of chocolate cake.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : bougie, part ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### tomate (`u-tomate`)

- **Sert** : 2 énoncés. **Taille** : 42 px de haut dans la scène (@1x ; @2x : 84 px), image générée carré (1024 × 1024). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-tomate.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a round red tomato with its green stalk.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### yaourt (`u-yaourt`)

- **Sert** : 2 énoncés. **Taille** : 40 px de haut dans la scène (@1x ; @2x : 80 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-yaourt.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small yoghurt pot with a plain white lid.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### château de sable (`u-chateau`)

- **Sert** : 1 énoncés. **Taille** : 50 px de haut dans la scène (@1x ; @2x : 100 px), image générée carré (1024 × 1024). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-chateau.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small sandcastle with one tower and a tiny flag without any sign on it.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### cuillère, fourchette (`u-couvert`)

- **Sert** : 1 énoncés. **Taille** : 46 px de haut dans la scène (@1x ; @2x : 92 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-couvert-cuillere.png`, `art/problemes/mise-en-scene/sources/u-couvert-fourchette.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: one item of cutlery; make two pictures: a spoon, a fork.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

(une image par variante : cuillere, fourchette ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)

### poire (`u-poire`)

- **Sert** : 1 énoncés. **Taille** : 46 px de haut dans la scène (@1x ; @2x : 92 px), image générée carré (1024 × 1024). **Fond** : magenta (l'objet a du vert).
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-poire.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a yellow-green pear.

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright magenta (#FF00FF) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

### paquet de pâtes (`u-paquet`)

- **Sert** : 1 énoncés. **Taille** : 44 px de haut dans la scène (@1x ; @2x : 88 px), image générée portrait (864 × 1184). **Fond** : vert.
- **Où le déposer** : `art/problemes/mise-en-scene/sources/u-paquet.png`

```text
Same illustration style, line work, colour palette and lighting as the attached image.

Children's picture-book illustration, a single isolated subject.
Subject: a small closed packet of pasta, plain yellow and blue (no window, no drawing).

Composition: the subject alone, centred, entirely visible, with a wide empty margin all around (at least a tenth of the picture on each side). Seen from the front, at a child's eye level, very slightly from above.

Style: bold hand-drawn comic style, a thick, closed, dark ink outline all around the silhouette (no gap in the outline), heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Only ONE of them, alone (never two, never a group, never a pile).

Background: one flat uniform pure bright green (#00FF00) colour from edge to edge: no gradient, no texture, no floor, no horizon, no cast shadow on the ground, no other object.

Strictly no text, no letters, no numbers, no digits, no labels, no logo, no price tag, no signature, no watermark.
```

## Les lieux, revus pour la mise en scène

`art/problemes/mise-en-scene/lieux.json` (validés par le parent le 6 novembre 2026 ; le lot les reporte dans `art/problemes/contextes.json`, dont les prompts n'ont pas encore servi, sauf l'étal). Format : 16:9 (Nano Banana ne propose pas le 21:9 : précision du parent du 6 novembre 2026), la plus grande taille proposée (1920 × 1080 ou plus). L'atelier la recadre à la forme de la scène (860 × 350, un peu plus large que le 21:9) en retirant le haut, JAMAIS le bas : 27,6 % de la hauteur, c'est-à-dire le cinquième du haut (le bandeau de ciel, de mur ou de plafond, sans détail, que le prompt demande) et encore 7,6 % juste en dessous ; le sol, en bas, reste entier. Affichée à 860 × 350 dans la scène de 1280 × 800 (cadre de 884 × 374), en @1x et @2x. L'étal fait exception : c'est l'image de l'étal du pêcheur (2576 × 1438), recadrée autour de sa glace, qui est son sol. Déposer l'image dans `art/problemes/sources/<lieu>.png`, comme prévu aujourd'hui.

### cuisine

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a cosy family kitchen in the early evening: a cupboard with closed doors and a fridge on the right, a window with a plant on the sill in the background.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat kitchen floor of large warm terracotta tiles, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No table, no fruit bowl, no plates, no food. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### chambre

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a child's bedroom: a bed with a patterned duvet on the far right, a window with curtains, a few soft posters without writing.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat wooden bedroom floor with a round rug, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No shelf, no toy chest, no toys, no cards. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### jardin

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a small family garden: a wooden fence, a shed on the right, a tree, a watering can far away.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat lawn of short grass with a strip of freshly dug brown soil, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No flowers, no lettuces, no tomatoes, no strawberries, no vases. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### parc

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a public park: trees, a small pond with reeds far away on the right, bushes.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat gravel path and lawn, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No slide, no swings, no sandbox, no bench, no boat, no ducks, no pigeons, no balls. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### classe

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a French primary classroom: a green chalkboard (blank, wiped clean) high on the back wall on the right, shelves far away, a big window with daylight on the right, plants.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat classroom floor of light wooden boards, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No desks, no chairs, no pencils, no pots, no notebooks, no chalk. The chalkboard is completely blank. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### cour

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a school playground: the school building with its big windows in the background, a plane tree on the right, a covered area far away.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat school playground tarmac, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No balls, no hoops, no chest, no bench; no hopscotch grid (it would show numbers). No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### bibliotheque

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a bright children's library: tall shelves along the back wall seen from a distance (book spines as soft colour stripes, not countable), cushions far away.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat library floor with a soft blue carpet, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No table, no trolley, no single book lying around. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### cantine

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a school canteen: a serving counter along the back wall, colourful walls, big windows on the right.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat canteen floor of large pale tiles, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No tables, no benches, no trays, no plates, no yoghurts. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### boulangerie

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a French bakery seen from inside: empty wooden shelves on the back wall, a big oven on the right.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat bakery floor of black and white tiles, with the top of a long empty glass counter running along the bottom edge, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. The shelves and counter are empty: no croissants, no baguettes, no loaves, no trays, no bags. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### marche

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: an open-air market in a village square: a striped awning, plane trees, old houses behind.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat cobbled village square, with the front edge of a long empty market stall table along the bottom, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No crates, no baskets, no fruit, no scale. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### supermarche

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a neighbourhood grocery shop: shelves far away along the back wall (only soft colour blocks, nothing countable), a fridge with a frosted door on the right.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat shop floor of light grey tiles, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No basket, no bottles, no boxes, no packs, nothing countable on the shelves. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### ferme

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a farmyard: a red barn on the right, a meadow with a wooden fence, hills behind.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat farmyard of packed earth and grass, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No henhouse, no hutch, no nest, no hens, no eggs, no cows, no sheep, no rabbits, no ducks, no tractor in the foreground. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### animaux

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a corner of a living room: a door to the garden on the right, a low cupboard, a framed picture of a landscape on the wall.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat warm wooden floor of a living room, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No pet bowls, no dog basket, no cat cushion, no kibble, no treats. No dog and no cat. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### bus

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a town street with houses and trees in the background, a bus shelter far away on the right.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat pavement of a town street, seen from slightly above, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No bus, no car, no coach in the picture (the bus is placed afterwards); nobody waits. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### plage

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a sunny beach: the sea and its small waves in the background, dunes with grass far away on the right, a beach umbrella far away.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat flat golden sand, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No bucket, no spade, no shells on the sand, no sandcastles, no people. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### foret

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: an autumn forest: tall trees with orange and yellow leaves, ferns, soft light.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat forest path covered with a few orange leaves, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No basket, no pine cones, no chestnuts, no mushrooms; no people. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### gymnase

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a school gym: a basketball hoop on the right, wall bars along the back wall.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat wooden gym floor with a few coloured lines, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No ball bag, no net, no ball, no hoops on the floor, no scoreboard, no benches. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### kermesse

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a school fête: a garland of little plain flags, a games stall with a striped awning far away on the right.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat school playground tarmac with a few confetti, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No cakes, no crêpes, no prizes, no prize box, no tables; no people; no price signs. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### anniversaire

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a living room decorated for a birthday party: a paper garland, streamers on the wall, a window on the right.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat living-room floor of warm wooden boards, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No table, no cake, no candles, no sweets, no presents, no balloons; no guests. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### atelier

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a craft corner at home: a window on the right, a jar of brushes and a thread spool far away.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat bright craft mat covering a big table top, seen from slightly above, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No beads, no necklaces, no bracelets, no stickers, no craft box. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```

### salon

```text
Same illustration style, line work, colour palette, lighting and level of detail as the attached image.

Children's picture-book illustration, landscape format 16:9, full-bleed (painted edge to edge, no border, no frame).
Scene: a cosy living room: a sofa on the right, a lamp, a bookshelf far away.

Style: bold hand-drawn comic style with thick dark ink outlines that get heavier on the shadow side, flat colour fills, one crisp cel shadow per shape, light from the top left, warm and friendly colours, slightly simplified shapes like a French children's book. It must look drawn by hand with markers, not a photograph and not a 3D render.

Composition, very important: this picture is a stage set. Things will be placed on it afterwards.
- The top fifth of the picture is plain sky, wall or ceiling with no detail at all: it will be cropped away. Nothing important in the top third of the picture either: its upper part will be cut too.
- The lower 40% of the picture is an open, empty, flat living-room floor with a big round rug, seen from slightly above, running across the whole width, with nothing standing on it: this is where people, animals and objects will be placed.
- Just below that plain band, the left half of the picture, down to the middle of its height, is calm and plain (wall or sky, no detail): a speech bubble will cover it.
- The interesting details of the place are in the background, in the middle of the height and on the right, small and soft, never in the foreground and never in the top third.

Very important, quantities: the picture shows the place, never the objects that are counted and never the furniture or containers of the story. No coffee table, no board game, no cards, no counters, no dice, no blocks. No people, no animals. No bowls, baskets, buckets, boxes, bags, plates, shelves, tables, benches, toys or vehicles in the foreground. No groups, rows, piles or sets of identical small objects that a child could count.

Strictly no text, no letters, no numbers, no digits, no labels, no price tags, no clock, no calendar, no signs with writing, no signature, no watermark.
```
