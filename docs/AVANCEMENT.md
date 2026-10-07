# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (7 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : dans l'ordre de `docs/LOTS.md` (leçons et table d'addition, sommes jusqu'à 30, multiplication et tables) ; le relecteur des lots 3 bis et 3 ter est abandonné.
- **En attente du parent** : la fabrication des phrases des lots « Mascotte » (6), « Les voiliers » (835) et « Correctifs » (8), puis la publication et l'essai sur la tablette ; le lot « Correctifs » (PR #39) attend aussi sa fusion et une réponse sur la mascotte (11.1).
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
| Les voiliers | Le jeu de la maquette des voiliers devient le module 4 : ranger un nombre entre des bouées, jusqu'à 1 000, mer selon la difficulté | fait (PR #36) |
| Correctifs | Les décisions du parent sur la confrontation de la spécification avec le code (`docs/ECARTS-SPEC.md`) : 7 correctifs, spécification réécrite | fait (PR #39) |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Les leçons »

- **Branche** : `claude/upbeat-ramanujan-tvcxot` ; demande de fusion en brouillon « Lot : Les leçons ».
- **Prérequis** : vérifiés sur `origin/main` le 7 octobre 2026 (« Mascotte », « Les voiliers » et « Correctifs » marqués « fait »).
- **Fait** : la maquette (`art/lecons/`, ses dessins dans `art/src/canvas-core/sea/lecons.ts`, la grille `drawAddTable` dans `sea/runtime.ts`, le chalut corrigé de L10 dans `sea/hundreds.ts`), ses captures, ses phrases et ses questions (`docs/maquettes/lecons/README.md`), en tête de la demande de fusion.
- **Validé par le parent** le 7 octobre 2026 (« validé » : les douze questions à leur valeur par défaut), reporté dans `docs/JOURNAL-CONCEPTION.md` et `docs/SPEC.md`.
- **Fait** : sprites exportés (planches « lecons », « lecons-atoi », bulle de l'accueil dans « petits », chalut corrigé dans « centaines ») ; `app/js/session/lessons.js` (menu, « À toi ! », table) ; `main.js` (cinq bulles, pause, séance après une leçon, entraînement libre) ; leçons retirées de « choisir » et de l'entraînement libre ; textes, légende, inventaire des voix ; tests unitaires (`tests/unit/lecons-menu.test.mjs`) ; parcours `tests/e2e/lecons-menu.mjs` (vert aux deux résolutions) ; parcours `choix`, `pause`, `lot3ter`, `lot3bis-b` mis à jour.
- **Reste** : la recette complète (méthode commune : tous les parcours, perf avant et après, simulation, b-sequences, séance réelle, durées), la relecture indépendante, les documents (ARCHITECTURE, GUIDE-PARENT, LOTS), la demande de fusion finale.
- **Constat hors lot** : l'étoile de mer (ou la tortue) de la ligne reste visible dans l'accueil en pause ; c'est déjà le cas sur `main` (vérifié), non corrigé ici.
