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

- Branche `claude/clever-euler-p678bp`, demande de fusion https://github.com/js2c/Maths-CE1/pull/30.
- **Fait** : décisions du parent du 4 octobre (le lagon partout, rien de l'ancien décor, algues et poissons sous la ligne) ; `art/tools/export-lagon.mjs` (extraction reproductible, maquette non modifiée ; liseré des 6 premières colonnes du panorama masqué comme dans la maquette) ; `app/js/engine/lagon.js` ; ancien fond, rayons, algues, reflets, poissons et bulles du décor retirés ; récif en pages sur le lagon ; tests `tests/unit/lagon.test.mjs`, parcours `tests/e2e/lagon.mjs` (1280 × 800 et 1920 × 1200 : tout est bon) ; parcours `seance`, `recompenses`, `recif-pages`, `pause`, `choix` : tout est bon.
- **Mesure** (`tests/e2e/perf.mjs --webgl`, conteneur sans processeur graphique, processeur ÷4, même écran : une question de la ligne) : allègement automatique, les deux versions au niveau 2, intervalle moyen 37,6 ms avant, 44,9 ms après, travail du fil principal 1,8 ms dans les deux cas ; niveau 0 tenu : 60,1 ms avant, 110,6 ms après (4,2 et 4,8 ms de travail) : le surcoût est dans la composition à l'écran, faite ici en logiciel. Mesures aux niveaux 1 et 2 faussées (lancées en même temps que les captures) ou en échec (avant, niveau 2) : non refaites, le parent ayant dit que la consommation n'était pas sa question. Images décodées : 175,3 Mo au lieu de 189,6.
- **Reste** : l'essai sur la tablette (fluidité réelle, miroitement en WebGL) ; les chevauchements relevés dans `docs/IDEES.md`, section 2, sont laissés tels quels (décision du parent : pas d'adaptation de lisibilité).
