# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (7 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : dans l'ordre de `docs/LOTS.md` (« Correctifs », issu de la confrontation de la spécification avec le code, `docs/ECARTS-SPEC.md` ; puis leçons et table d'addition, sommes jusqu'à 30, multiplication et tables) ; le relecteur des lots 3 bis et 3 ter est abandonné.
- **En attente du parent** : le lot « Les voiliers » (PR #36, prête) attend la fabrication de ses 835 phrases, avec les 6 du lot « Mascotte » (PR #34, fusionnée), puis la fusion et l'essai sur la tablette.
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
| Les voiliers | Le jeu de la maquette des voiliers devient le module 4 : ranger un nombre entre des bouées, jusqu'à 1 000, mer selon la difficulté | fait (PR #36, à fusionner après la fabrication des phrases) |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Correctifs »

- **Branche** : `claude/friendly-pascal-ylq8p1`, partie de `main` après la fusion des voiliers (PR #36). Demande de fusion en brouillon « Lot : Correctifs ».
- **Fiche** : `docs/LOTS.md`, 2 bis ; rapport : `docs/ECARTS-SPEC.md`.
- **Fait** : les 7 correctifs du code, testés (`tests/unit/lot-correctifs.test.mjs`) ; 6.2 simulé (5 profils × 2 rythmes, et `--deux-par-jour`) ; la spécification, `docs/IDEES.md`, le journal, l'architecture, le guide du parent ; la ligne en tête du rapport ; le cache ; le parcours du lot (`tests/e2e/correctifs.mjs`, captures dans `tests/recette-fonctionnelle/out-correctifs/`) ; `b-sequences --test` (0 en défaut).
- **Reste** : relecture indépendante de la spécification ; tous les parcours `tests/e2e/` ; temps d'image après ; séance à vitesse réelle et attentes ; demande de fusion complète ; état « fait » dans `docs/LOTS.md` ; rubrique archivée.
- **Mesures de départ** (sur `main`) : 283 tests sur 284 (seul échec : 841 phrases sans voix des lots « Mascotte » et « Les voiliers ») ; `perf.mjs` à processeur ÷ 4 dépasse ses délais dans le conteneur, même sur `main` : mesure faite à ÷ 1 (démarrage 1,4 s à froid, image moyenne 18,6 ms, allègement niveau 2).

