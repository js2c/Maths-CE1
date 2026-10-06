# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (6 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : dans l'ordre de `docs/LOTS.md` (mascotte, voiliers, leçons et table d'addition, sommes jusqu'à 30, multiplication et tables). Confrontation de la spécification avec le code (`docs/PROMPTS.md`) avant le lot « Sommes jusqu'à 30 » ; le relecteur des lots 3 bis et 3 ter est abandonné.
- **En cours** : le lot « Les voiliers » (rubrique « Reprise » ci-dessous). Le lot « Mascotte » (PR #34, fusionnée) attend la fabrication de ses 6 phrases.
- **Projet parallèle** : la refonte graphique (hors de ce fichier).

## Lots

| Lot | Contenu | État |
| --- | --- | --- |
| 1, 1 bis | Application, voix, ligne graduée 1 à 8, échauffement des familles 1 et 2, cartes du lagon, ergonomie | fait |
| 2 | Séance allongée, sélecteur de difficulté, module 2 complet, défi record, nombres jusqu'à 1 000, cartes jusqu'en juin, son, bernard-l'ermite | fait (PR #11 à #17) |
| 3 | Choisir l'exercice et le niveau, difficulté dans le niveau, calcul rapide, accueil en pause, récif par zones, sauvegardes de test | fait (PR #19, #20) |
| 3 bis | Correctif de la recette fonctionnelle : réponse qui varie, amis de 10, calcul « très dur », ligne, toucher, décors du récif, écrans « choisir », légende, appui long, aides, leçons L2, L8, L9, espace parent | fait (PR #22, #23) |
| 3 ter | Passer l'échauffement, échauffement qui s'ajuste, appui long partout | fait (PR #25) |
| Lagon | Le lagon de la maquette du récif vivant en fond de toute l'application | fait (PR #30) |
| Récif vivant | La collection est la maquette du récif vivant ; récompenses sans doublon ; correctif des boutons invisibles | fait (PR #31) |
| Mascotte | Le capitaine en vidéo remplace la pieuvre ; bulle, flèche, bienvenue, relance | fait (PR #34) |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)


## Reprise du lot « Les voiliers »

- Branche `claude/pensive-bardeen-yc0m7j` (partie de `main` après la PR #34). Demande de fusion : https://github.com/js2c/Maths-CE1/pull/36 (brouillon).
- **Fiche** : `docs/LOTS.md`, lot 2 ; spécification `docs/SPEC.md`, section 7 bis ; maquette `art/voiliers/` (jamais modifiée).
- **Fait** :
  - les règles du module 4 (`modules/voiliers/voiliers.js`, `runner.js`, `content/module4.json`), comparées tirage par tirage à la maquette (`tests/unit/voiliers.test.mjs`) ; simulation (`tests/sim-seances.mjs --choix 4:N`) et séquences (`b-sequences.mjs`, voiliers compris) sans défaut ; textes et inventaire de la voix (835 phrases nouvelles) ;
  - l'export de la maquette (`art/tools/export-voiliers.mjs` -> `app/js/voiliers/voiliers-scene.js`, `app/assets/voiliers/`), l'écran du module 4 (`modules/voiliers/screen.js`), la notion du jour, « choisir », l'entraînement libre, le module imposé, la pause, la bulle (le nombre en lettres, jamais sur le bateau) ;
  - les pictogrammes de l'atelier (`art/src/canvas-core/sea/voiliers.ts`) ; l'espace parent (bloc des voiliers, journal V1 à V4, point de départ, légende) ;
  - le parcours `tests/e2e/voiliers.mjs` (vert aux deux tailles).
- **Reste** : mesure de fluidité ; recette complète (tous les parcours, séance réelle, attentes) ; relecture indépendante ; documents (SPEC, ARCHITECTURE, GUIDE-PARENT, CLAUDE, LOTS).
