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
| `d-vitesse-reelle.mjs` | D | `out/D-vitesse-reelle/` : chronologies des séances jouées à vitesse réelle (`--cas ligne|additions|calcul|famille3`) |
| `d-index.mjs` | D | la synthèse de la partie D (avec les relevés de `tests/e2e/recette.mjs --delai 4.5`, copiés en `recette-moduleN.json`) |
| `e-lot3bis.mjs` | E | (lot 3 bis) `E-lot3bis/` : planches des écrans nouveaux du lot 3 bis, d'après les captures de `node tests/e2e/lot3bis-b.mjs` |

Lot 3 bis : la variable `RECETTE_OUT` range le matériel dans un autre dossier (la recette de contrôle : `RECETTE_OUT=tests/recette-fonctionnelle/out-lot3bis`), sans toucher à `out/`, jugé dans `docs/RECETTE-LOT3.md`.

Préalable : `npm install` à la racine et dans `art/` (Playwright, Chromium préinstallé).

Relancer tout (environ 1 h 30, dont 40 min de séances à vitesse réelle) :

```bash
node tests/recette-fonctionnelle/b-sequences.mjs          # quelques secondes
node tests/recette-fonctionnelle/a-ecrans.mjs             # ~35 min (--seulement accueil,choisir,… pour un thème)
node tests/recette-fonctionnelle/c-toucher.mjs            # ~25 min (--seulement touchers,maison,appuiLong,rien,passer)
for c in ligne additions calcul famille3; do node tests/recette-fonctionnelle/d-vitesse-reelle.mjs --cas $c --delai 4.5; done
node tests/recette-fonctionnelle/d-index.mjs
```
