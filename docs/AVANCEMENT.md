# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (10 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : les lots de `docs/LOTS.md` sont faits, « L'étal du pêcheur » compris (PR #49, à fusionner) ; la suite est à décider par le parent (`docs/IDEES.md`).
- **En attente du parent** : la fabrication des 394 phrases de l'étal (`docs/maquettes/etal/PHRASES.md` ; avec elles, la voix pèsera environ 79,3 Mo, tout près de la limite de 80 Mo), la fusion de la PR #49, l'essai sur la tablette et la relecture de ses « Choix faits sans le parent » ; les phrases des lots précédents sont toutes fabriquées.
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
| Les leçons | La bulle des leçons, le menu, « À toi ! », la table d'addition ; recette finie à l'étape 0 du bloc suivant (durées, relecture indépendante) | fait (PR #40, recette dans la PR #42) |
| Sommes jusqu'à 30 et Multiplication | Familles d'additions 8 à 13, leçons L11 et L12 ; cinquième exercice (multiplication, 9 niveaux, tables de 2, 3, 4, 5 et 10), leçons L13 et L14, table de multiplication ; fait d'un seul bloc, sans arrêt pour validation | fait (PR #42) ; 945 phrases à fabriquer |
| Correctifs de la tablette | Écran de démarrage (logo, barre de chargement, toucher qui autorise la voix), bienvenue au lancement ; choisir en deux touchers ; toucher la mascotte pour réécouter ; clavier de l'ordinateur ; ardoise jamais vide ; plus de phrase dite par l'ancienne voix (contrôle dans tous les parcours) ; fins de ligne sous Windows | fait (PR #46) ; voix fabriquées |
| L'étal du pêcheur | Sixième exercice, la monnaie (module 6) : la maquette de l'étal intégrée, 10 niveaux (pièces et billets, payer juste, sans pièce de trop, rendre la monnaie, deux produits, centimes), l'orage, leçons L15 à L18, espace parent ; d'un seul tenant | fait (PR #49) ; 394 phrases à fabriquer |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Correctifs : passage de l'échauffement aux voiliers »

- Branche `claude/practical-franklin-gr2y0x`, partie de `main` (167eec50, étal fusionné), demande de fusion en brouillon « Lot : Correctifs : passage de l'échauffement aux voiliers ».
- Fiche 8 de `docs/LOTS.md`, d'un seul tenant (choix de la session dans `docs/JOURNAL-CONCEPTION.md`).
- Fait (code, tests unitaires, parcours `tests/e2e/passages.mjs` et `tests/e2e/mise-a-jour.mjs`) : points 1 à 14.
- Reste : la documentation (SPEC, ARCHITECTURE, VOIX, GUIDE-PARENT, CLAUDE.md, journal), le parcours du lot
  `tests/e2e/correctifs-2.mjs` (captures), la recette de la méthode commune, la relecture indépendante, la demande de fusion
  (GitHub injoignable depuis la session au départ : à ouvrir dès que possible).

