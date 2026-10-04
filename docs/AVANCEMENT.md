# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (30 septembre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis et 3 ter, tous fusionnés (dernière demande de fusion : PR #25, lot 3 ter).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochaines sessions** (`docs/PROMPTS.md`) : relecteur de contrôle des lots 3 bis et 3 ter ; confrontation de la spécification avec le code. Puis le prochain lot, après la revue de périmètre (`docs/IDEES.md`, section 2).
- **Projet parallèle** : le récif vivant et la refonte graphique (hors de ce fichier).

## Lots

| Lot | Contenu | État |
| --- | --- | --- |
| 1, 1 bis | Application, voix, ligne graduée 1 à 8, échauffement des familles 1 et 2, cartes du lagon, ergonomie | fait |
| 2 | Séance allongée, sélecteur de difficulté, module 2 complet, défi record, nombres jusqu'à 1 000, cartes jusqu'en juin, son, bernard-l'ermite | fait (PR #11 à #17) |
| 3 | Choisir l'exercice et le niveau, difficulté dans le niveau, calcul rapide, accueil en pause, récif par zones, sauvegardes de test | fait (PR #19, #20) |
| 3 bis | Correctif de la recette fonctionnelle : réponse qui varie, amis de 10, calcul « très dur », ligne, toucher, décors du récif, écrans « choisir », légende, appui long, aides, leçons L2, L8, L9, espace parent | fait (PR #22, #23) |
| 3 ter | Passer l'échauffement, échauffement qui s'ajuste, appui long partout | fait (PR #25) |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Lagon en fond d'exercices »

- Branche `claude/clever-euler-p678bp`, partie de `main` (e02b7db0). Demande de fusion : pas encore ouverte.
- **Étape 1 (faite)** : le lot est décrit dans `docs/SPEC.md`, section 11, « Le lagon en fond d'exercices (à construire) ». Arrêt demandé par le parent après cette étape.
- **Étape 2 (attend l'accord du parent)** : extraction du fond, des algues et des poissons depuis la maquette (non modifiée), moteur du lagon dans l'application, allègement automatique, captures de chaque exercice, temps d'image avant et après.
- Mesure de référence avant le lot (`tests/e2e/perf.mjs`, conteneur sans processeur graphique, processeur ÷4, 1280 × 800, densité 2) : intervalle moyen entre images 27,3 ms (p95 50 ms), travail par image 4,7 ms en moyenne, allègement déjà au niveau 2, planches décodées 189,6 Mo.
- Constat hors lot : sur `main`, `app/sw-files.json` n'est pas à jour depuis la nouvelle voix (`node tools/precache.mjs --check` échoue) ; le déploiement refait la liste, donc la tablette n'est pas touchée. Sera corrigé au premier `node tools/precache.mjs` de l'étape 2.
