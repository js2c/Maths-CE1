# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (5 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : dans l'ordre de `docs/LOTS.md` (mascotte, voiliers, leçons et table d'addition, sommes jusqu'à 30, multiplication et tables). Confrontation de la spécification avec le code (`docs/PROMPTS.md`) avant le lot « Sommes jusqu'à 30 » ; le relecteur des lots 3 bis et 3 ter est abandonné.
- **En cours** : le récif vivant comme collection, les récompenses sans doublon et le correctif des boutons invisibles (rubrique « Reprise » ci-dessous).
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
| Récif vivant | La collection est la maquette du récif vivant ; récompenses sans doublon ; correctif des boutons invisibles | en cours |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Récif vivant et récompenses sans doublon »

- Branche `claude/clever-euler-p678bp` (repartie de `main` après la fusion de la PR #30), demande de fusion https://github.com/js2c/Maths-CE1/pull/31.
- **Décisions du parent (4 et 5 octobre)** : le récif est la maquette du récif vivant ; on y entre par le lagon, on glisse vers les autres zones (les zones fermées se visitent, sans créature) ; les créatures se déplacent au doigt, oublié d'une visite à l'autre ; les créatures dessinées en code sont remplacées par les images ; jamais de doublon : au-dessus du quota, une créature possédée devient brillante (option C), la chance de 20 % qu'une créature nouvelle sorte brillante reste ; décors et cadeaux supprimés (les fiches restent dans la base, ignorées).
- **Fait** :
  - correctif : les boutons de l'accueil invisibles après le récif (défaut présent depuis le lot 3, étape 5 : le récif libérait les planches du démarrage) ; planches permanentes (`sprites.keep`), test `planches-permanentes.test.mjs` ;
  - récompenses sans doublon (`pickShell`, `Rewards.shine`, coquillage qui attend) ; simulées puis codées ; test `recompenses-sans-doublon.test.mjs` ;
  - le récif vivant (`art/tools/export-recif.mjs`, `app/js/recif/recif-vivant.js` généré, `session/reef.js`) ; test `recif-vivant.test.mjs`, parcours `tests/e2e/recif-vivant.mjs` (nouveau) ; parcours `recompenses`, `cartes`, `lagon`, `pause`, `perf`, `lot3bis`, recette fonctionnelle mis à jour ;
  - `docs/SPEC.md` (section 10), `docs/ARCHITECTURE.md`, `docs/JOURNAL-CONCEPTION.md`, `docs/IDEES.md` (coquillages qui attendent, chevauchements du récif), `CLAUDE.md`.
- **Recette** (détail dans la demande de fusion) : `npm test` 262 verts ; simulation sans doublon ; séquences sans défaut ; séance réelle 8,6 min ; attentes hors voix 1,3 s au plus ; `recif-vivant`, `lagon` et 21 autres parcours : tout est bon. `lot3bis` vert depuis la correction de son contrôle du double toucher à 60 ms (le toucher émulé de Chromium était trop lent pour l'éprouver ; échouait déjà sur `main`). Échecs qui existent aussi sur `main` : `pwa`, `defi`, `lot3ter` (étiquettes trop lentes dans ce conteneur sans processeur graphique). Propre à la branche : dans `lot3ter`, l'étiquette d'appui long de la maison et de l'album du récif arrive après 0,8 s (le récif dessine lentement ici ; allègement corrigé pour se déclencher quand même).
- **Réponses du parent après la recette (5 octobre)** : étoiles qui s'accumulent, acceptées ; maison et album qui couvrent une créature, acceptés ; baudroie d'ambiance dans les abysses fermées, acceptée ; nageuses du grand large réparties sur toute la hauteur : fait (`art/tools/grand-large.mjs`, profondeurs appliquées par l'export ; pire grappe de 9 à 5 nageuses).
- **Reste** : l'essai sur la tablette (fluidité du récif vivant en WebGL, mémoire).
