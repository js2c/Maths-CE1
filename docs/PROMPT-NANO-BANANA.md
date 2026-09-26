# Illustrations des cartes avec Nano Banana — mode d'emploi et prompts

Zone du lagon : 15 cartes (lot 1). Les 45 autres cartes (zones 2 à 4) viendront au lot 4, avec la même méthode.

## Méthode

1. Ouvrir Gemini, choisir la génération d'images (Nano Banana).
2. **Joindre les deux images de référence** : `docs/maquettes/reference-style-1-pieuvre.png` et `docs/maquettes/reference-style-2-poissons.png`.
3. Coller le **prompt de base** ci-dessous, puis, à la place de `[CREATURE]`, la ligne de la créature.
4. Générer, choisir la meilleure image, la **vérifier** avec la liste de contrôle.
5. À partir de la 2ᵉ carte : joindre aussi 1 ou 2 cartes déjà validées, pour que toute la série ait le même style.
6. Enregistrer chaque image sous le nom indiqué (`poisson-clown.png`, etc.).

Les prompts sont en anglais : c'est la langue où ces modèles respectent le mieux les consignes de style. Les demandes de retouche peuvent se faire en français (« les rayures blanches doivent être bordées de noir »).

## Prompt de base

```
Children's picture-card illustration, vertical 3:4 format.
Subject: [CREATURE]

Style: match the attached reference images exactly — "marker comic" cel illustration.
Flat colour fills, each shape with ONE hard-edged darker shadow on the side away from the light,
a lighter flat tone on the lit side, light coming from the upper left. A single thick, confident,
dark navy (#15122a) brush-pen outline that gets thicker on the shadow side. Small crisp white
highlights. No gradients except in the water, no painterly texture, no 3D render look.

Composition: one creature only, whole body visible, centred, filling about 60% of the height,
three-quarter or side view that shows its recognisable shape. Keep a clear margin: nothing
important within 12% of the edges (a frame will be added on top).
Background: simple underwater scene in the same turquoise palette as the references
(#0b5563 deep corners, #138493 lit middle), a few pale light streaks and 2-3 small bubbles,
a hint of sand or rock at the bottom only if it suits the creature. No other animals.

Character: friendly and appealing for a 7-year-old, big glossy eyes with two small white
highlights like the references, but anatomically accurate for the real species
(correct number of legs, arms, fins, correct markings). No human clothes, no hands.

Strictly no text, no letters, no numbers, no logo, no watermark, no border, no frame.
```

## Une ligne par créature

| Fichier | `[CREATURE]` à coller |
| --- | --- |
| `poisson-clown.png` | a clownfish (Amphiprion ocellaris): bright orange body, three white bands edged with thin black lines (behind the eye, mid-body, at the tail base), black-edged fins, peeking from a pink sea anemone with soft tentacles |
| `etoile-de-mer.png` | an orange-red sea star with exactly five tapering arms, bumpy textured top, seen from above resting on sand |
| `crabe.png` | a red shore crab, seen from the front: wide flat shell, two claws, and exactly eight walking legs (four on each side), eyes on short stalks |
| `crevette.png` | a translucent pale pink shrimp in side view: curved segmented body, fan-shaped tail, very long thin antennae, small legs underneath, dark eye |
| `bernard-l-ermite.png` | a hermit crab living in an empty spiral sea-snail shell, only its head, eye stalks, one big claw, one small claw and front legs coming out of the shell |
| `moule.png` | a small cluster of blue-black mussels (elongated shells, slightly open on one, showing orange flesh) attached to a rock by fine golden threads |
| `oursin.png` | a round purple sea urchin covered with long pointed spines, resting on a rock, tiny tube feet between the spines |
| `anemone.png` | a sea anemone like an underwater flower: thick column, crown of many soft rounded pink-orange tentacles, attached to a rock |
| `concombre-de-mer.png` | a sea cucumber: long soft sausage-shaped brown-orange body covered with small bumps, a small ring of feathery tentacles at the front end, lying on sand |
| `coquille-saint-jacques.png` | a scallop, shell slightly open: fan-shaped ribbed shell with two small "ears" at the hinge, a row of tiny bright blue eyes along the edge of the opening |
| `poisson-chirurgien.png` | a blue surgeonfish (Paracanthurus hepatus): royal blue oval body, black pattern like a painter's palette on the side, bright yellow tail |
| `hippocampe.png` | a yellow seahorse in side view: upright body with bony rings, horse-like head with a long tubular snout, small crown, tail curled around a strand of seagrass, small back fin |
| `poisson-ballon.png` | a pufferfish fully inflated like a round ball, small spines all over, small fins and tail, round surprised mouth, yellow-brown with dark spots |
| `limace-de-mer.png` | a colourful sea slug (nudibranch), purple body with orange edges, two small horns on the head, a feathery bouquet of gills on its back, crawling on a rock |
| `raie-pastenague.png` | a stingray seen from above: flat diamond-shaped sandy-grey body, eyes on top of the body, long thin tail with a small spine, gliding just above the sand |

## Liste de contrôle pour chaque image

- [ ] Aucun texte, chiffre, logo ou signature.
- [ ] Anatomie juste : crabe 8 pattes + 2 pinces ; étoile 5 bras ; poisson-clown 3 bandes blanches bordées de noir ; hippocampe avec la queue enroulée.
- [ ] Même style que les références : contour épais sombre, aplats, une ombre nette, lumière en haut à gauche.
- [ ] Le sujet ne touche pas les bords (marge d'environ 12 %).
- [ ] Format portrait 3:4.

## Intégration dans l'application

Deux possibilités :

- **Ici, dans la conversation de conception** : joindre les 15 images dans le chat. Claude les convertit (WebP 600 × 800), met à jour `app/content/cartes.json` et la liste hors ligne, et dépose le tout dans une demande de fusion.
- **Dans Claude Code** : déposer les images dans `app/assets/cards/` (GitHub, *Add file → Upload files*), puis ouvrir une courte session (Sonnet suffit) : « Intègre les illustrations de app/assets/cards : conversion en WebP 600 × 800, mise à jour de cartes.json, liste hors ligne, tests. »
