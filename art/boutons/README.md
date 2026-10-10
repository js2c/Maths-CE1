# Les boutons faits d'une image

**Le bouton de l'espace parent** (décision du parent du 10 octobre 2026 ; `docs/LOTS.md`, fiche 8, point 13). Le parent a donné l'image `parents-reference.jpg`, où le bouton est posé sur le sable. `decoupe.py` en garde le bouton seul, sans le sable, et écrit :
- `images/parents@1x.webp` et `images/parents@2x.webp` : 108 px de scène de large ;
- `images/parents-forme.json` : sa taille en px de scène.

Le découpage est déterministe : `python art/boutons/decoupe.py` (il faut numpy, scipy et Pillow).

C'est une exception à la règle « tout est dessiné dans l'atelier » (`CLAUDE.md`). L'application ne fait que poser l'image et l'anneau de l'appui long, qui suit la forme du bouton.
