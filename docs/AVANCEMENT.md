# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (5 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : dans l'ordre de `docs/LOTS.md` (mascotte, voiliers, leçons et table d'addition, sommes jusqu'à 30, multiplication et tables). Confrontation de la spécification avec le code (`docs/PROMPTS.md`) avant le lot « Sommes jusqu'à 30 » ; le relecteur des lots 3 bis et 3 ter est abandonné.
- **En cours** : le lot « Mascotte » (rubrique « Reprise » ci-dessous).
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
| Mascotte | Le capitaine en vidéo remplace la pieuvre ; bulle, flèche, bienvenue, relance | en cours |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Mascotte »

- Branche `claude/nifty-knuth-g0r17e` (partie de `main` après la PR #33). Demande de fusion : (à ouvrir).
- **Fiche** : `docs/LOTS.md`, lot 1 ; spécification `docs/SPEC.md`, section 11 ; maquette `art/mascotte/`.
- **Fait** : —
- **Reste** : tout.
