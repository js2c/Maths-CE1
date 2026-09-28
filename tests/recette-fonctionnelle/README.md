# Recette fonctionnelle du lot 3 : le matériel

Outils de la session 1 de `docs/PROMPT-RECETTE-LOT3.md`. Ils ne modifient pas l'application : ils la pilotent
(Playwright, sans écran) ou appellent ses modules (runners du moteur, sans navigateur), et rangent ce qu'ils produisent
dans `out/`, une partie par dossier. Le relecteur commence par `out/INDEX.md`.

| Outil | Partie | Produit |
| --- | --- | --- |
| `commun.mjs` | toutes | navigateur 1280 × 800 densité 1, sauvegardes de départ, captures JPEG, planches contact 2 × 2 |
| `a-ecrans.mjs` | A | `out/A-ecrans/` : planches des écrans et de leurs états |
| `b-sequences.mjs` | B | `out/B-sequences/` : le texte des séances générées par le moteur |
| `c-toucher.mjs` | C | `out/C-toucher/` : planches avant/après et journal des touchers |
| `d-vitesse-reelle.mjs` | D | `out/D-vitesse-reelle/` : chronologies des séances jouées à vitesse réelle |

Préalable : `npm install` à la racine et dans `art/` (Playwright, Chromium préinstallé).
