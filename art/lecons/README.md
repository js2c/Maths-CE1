# Maquette — les leçons et la table d'addition (lot « Les leçons »)

Maquette du rendu final du lot (`docs/LOTS.md`, fiche 3 ; `docs/SPEC.md`, sections 3 et 8), **en attente de la validation du parent**. Captures, phrases et questions : `docs/maquettes/lecons/README.md`. Aucun fichier sous `app/` n'est modifié.

## Tester

Depuis la racine du dépôt :

```bash
python -m http.server 8080
```

puis `http://localhost:8080/art/lecons/`. Les boutons en bas à gauche (absents des captures) mènent à chaque écran : accueil, menu des leçons, fin de leçon (regardée, passée), table d'addition, L10 avant et après. On peut aussi toucher les bulles et les tuiles comme dans l'application. La maquette n'a pas de voix : la bulle et la mascotte parlent le temps de lire.

## Ce qu'elle reprend de l'application, et ce qui est nouveau

- **Repris tels quels** (lus dans `app/`, jamais modifiés ; la page pose `<base href="../../app/">`) : les planches de sprites et leur atlas (boutons, fond du lagon, aides des additions), la bulle de la mascotte (`js/engine/bulle.js`), les aides des additions (`js/modules/facts/aids.js`), le dessin en direct (`js/art/runtime.js`), les polices et les feuilles de style. La mascotte vient de `art/mascotte/` (moteur et vidéos).
- **Nouveau, dessiné dans l'atelier** (`art/src/canvas-core/sea/lecons.ts`) : la bulle « les leçons », les tuiles du menu et leurs vignettes, les tuiles des tables, les pictogrammes des rangées, la bulle « À toi ! » et la grande maison. La grille de la table est dessinée en direct (`drawAddTable`, ajouté à `art/src/canvas-core/sea/runtime.ts`, comme le mur de corail). Le chalut corrigé de L10 : `art/src/canvas-core/sea/hundreds.ts` (dix poissons par petit filet).
- `dessins.js` est **généré** à partir de l'hôte `art/src/hosts/maquette-lecons.ts` : `cd art && node tools/maquette-lecons.mjs` (à relancer après toute retouche d'un dessin).
- Le fond est l'image fixe du lagon (dans l'application, il vit).

## Captures

```bash
node art/lecons/captures.mjs        # docs/maquettes/lecons/*.png, en 1280 × 800
```

Planche de contrôle des dessins, en grand : `cd art && node tools/still.mjs leconsSheet --frame 0 --out out/lecons.png --scale 2`.
