# Prompt du lot 3 bis (à coller dans Claude Code)

Spécification : `docs/SPEC-LOT3BIS.md`. Elle prévaut sur `docs/SPEC.md`, `docs/SPEC-LOT2.md`, `docs/SPEC-LOT3.md` et `docs/SPEC-COMPLEMENTS.md` en cas de contradiction. Rapport de recette qui la motive : `docs/RECETTE-LOT3.md`. Rédigé en conception le 28 septembre 2026.

## Comment s'en servir

- **Préalable** : la demande de fusion de la recette fonctionnelle (matériel et rapport, branche `claude/lucid-albattani-fp89se`) est fusionnée dans `main`. Le lot 3 bis en réutilise les outils (`tests/recette-fonctionnelle/`) et le rapport.
- Deux demandes de fusion.
  - La **partie A (étapes 1 et 2, moteur et contenu)** est à fusionner et à essayer sur la tablette avant de lancer la partie B.
  - La **partie B (étapes 3 à 5, visuel, atelier et parent)** vient ensuite.
- Chaque partie s'enchaîne dans une session, avec le prompt « enchaîner » ci-dessous (réflexion « élevé »). Si la session s'arrête d'elle-même, la relancer avec le prompt de reprise.
- À la fin : une **session relecteur limitée**, distincte (prompt en bas de ce fichier).

| Étape | Partie | Contenu (`docs/SPEC-LOT3BIS.md`) | Réflexion | Coût estimé |
| --- | --- | --- | --- | --- |
| 1 | A | §0 (réponse qui varie : règles et test sur les 116 combinaisons) ; A1 (amis de 10 et maisons, faits tirés au hasard, acquisition) ; A2 (calcul rapide « très dur ») ; A4 (mélange) | élevé | 10 à 18 $ |
| 2 | A | A3 (ligne : « plus facile », tirage sans remise, niveau 1, L3) ; A5 (toucher et reprise) ; A6 (décors : logique et voix, dessin provisoire) ; recette de la partie A | élevé | 10 à 17 $ |
| 3 | B | B8 : atelier (plaques numérotées, numéros des tuiles, légende, étiquette, décors, poissons des maisons, poisson étiqueté, étoiles volantes, fin du défi, bouées de L2) | élevé | 10 à 16 $ |
| 4 | B | B1 à B7, B9 à B12 : intégration (choisir, légende, appui long, aides et corrections, fins, « placer », leçons L2, L8, L9, espace parent, cosmétique, guide du parent) | élevé | 15 à 25 $ |
| 5 | B | Recette complète du lot 3 bis et relance des parties B et C de la recette fonctionnelle | moyen | 5 à 9 $ |
| — | — | Session relecteur limitée | élevé | 5 à 10 $ |

Total estimé : **55 à 95 $**, relecteur compris, avec une incertitude d'environ ± 50 %.

---

## Prompt pour enchaîner les étapes N à M

Lis CLAUDE.md, docs/SPEC.md, docs/SPEC-LOT2.md, docs/SPEC-LOT3.md, docs/SPEC-LOT3BIS.md (elle prévaut en cas de contradiction), docs/RECETTE-LOT3.md, docs/ARCHITECTURE.md et docs/AVANCEMENT.md. Réalise **les étapes N à M du lot 3 bis, dans l'ordre, sans t'arrêter entre elles**, telles que décrites dans le tableau de docs/PROMPT-LOT3BIS.md et détaillées dans docs/SPEC-LOT3BIS.md.

**Le sens du lot.** Chaque point corrige un constat de docs/RECETTE-LOT3.md (R1 à R25). Avant de considérer un point comme fait, regarde la planche ou la séquence du rapport qui le montrait, et vérifie avec le même outil que le problème a disparu **du point de vue de l'enfant**, pas seulement que le code suit la spécification. Ne casse rien de ce que le rapport range dans « Ce qui fonctionne bien » (§5).

**Méthode**

- **Branche et demande de fusion.** Pars de `origin/main` à jour. À la première étape du lot seulement, inscris d'abord les 5 étapes du lot 3 bis dans docs/AVANCEMENT.md, et mets à jour la ligne « Où en est-on ». Crée la branche `lot3bis-etapes-N-M` (ou garde le nom imposé par l'environnement), pousse-la et ouvre une demande de fusion en BROUILLON vers `main`, intitulée « Lot 3 bis, étapes N à M (en cours) ».
- **Suivi de la reprise.** Tiens à jour dans docs/AVANCEMENT.md une rubrique « Reprise des étapes N à M du lot 3 bis » : étape en cours, fait, reste, décisions prises. Fais un commit poussé après chaque sous-partie, et au moins toutes les 30 à 45 minutes.
- **Contenu.** Tout ce qui se règle va dans app/content/, jamais en dur : seuils de variété, formes par famille et par cran, repères de la ligne, durée de l'appui long, légendes, étiquettes, décors. Toute phrase nouvelle : ajoute-la au contenu, fabrique son fichier (`node tools/voix/fabriquer.mjs`), puis lance `node tools/precache.mjs`. Tout élément graphique est dessiné dans l'atelier (style A, craft bar), regardé à l'agrandissement.
- **Tests unitaires pour chaque règle nouvelle** :
  - variété des réponses ;
  - formes à trou des familles 3 à 5 et alternance ;
  - tirage au hasard des faits nouveaux ;
  - acquisition sur deux séances et à la forme à trou ;
  - trou sur le départ au calcul « très dur » ;
  - repères et tirage sans remise de la ligne ;
  - E3 en « sauter » sans L3 ;
  - mélange sur une base neuve ;
  - pavé ignoré pendant un retour et double toucher ;
  - reprise avec consigne ;
  - décors du doublon et probabilité de brillante inchangée ;
  - appui long sans validation ;
  - erreurs d'additions détaillées.
- **Pour chaque étape** :
  - recette allégée : tests unitaires, `node tests/sim-seances.mjs`, `node tests/recette-fonctionnelle/b-sequences.mjs` en mode test, et une capture de chaque écran nouveau ou modifié, regardée et corrigée ;
  - mise à jour de docs/AVANCEMENT.md ;
  - commit « Lot 3 bis, étape k : … » poussé ;
  - puis passe à l'étape suivante sans attendre.
- **Arrêt propre.** Si, à la fin d'une étape, le contexte dépasse environ la moitié, ne commence pas la suivante. Pousse tout, mets à jour la rubrique de reprise (« reprendre à l'étape k+1 »), et arrête-toi en le disant.
- **Décisions manquantes.** Si un point bute sur une question que docs/SPEC-LOT3BIS.md ne tranche pas, prends la valeur par défaut indiquée, note la question dans la demande de fusion et dans docs/AVANCEMENT.md, et continue. S'il n'y a pas de valeur par défaut raisonnable, arrête-toi et pose la question. **Ne touche pas aux décisions du parent** : validation simple à l'écran « choisir », pas de seuil de bonnes réponses pour les cartes, probabilité de brillante d'un doublon à 5 %, pas de règle du 3e doublon.
- **Recette complète à la fin de l'étape M** :
  - le tableau « Recette du lot 3 bis » de docs/SPEC-LOT3BIS.md, avec les mesures ;
  - les recettes des lots précédents : `node tests/sim-seances.mjs` (tous les profils, 2 et 5 séances par semaine, sur l'année), `node tests/e2e/recette.mjs --delai 4.5`, `node tests/e2e/recette-durees.mjs` avec et sans `--passer`, et tous les parcours Playwright (un par un s'ils échouent sous la charge) ;
  - les captures, regardées.
  
  **À la fin de l'étape 5 seulement** : relance les parties B et C de la recette fonctionnelle (docs/PROMPT-RECETTE-LOT3.md, session 1) et refais les planches des écrans modifiés, dans `tests/recette-fonctionnelle/out-lot3bis/`, avec leur `INDEX.md`.
- **À la fin** :
  - complète la description de la demande de fusion : pour chaque constat R traité, ce qui change pour l'enfant et pour le parent ; le tableau de recette ; les questions restées ouvertes ; ce qui reste à vérifier sur la tablette ;
  - retire « (en cours) » du titre et sors la demande de fusion du mode brouillon ;
  - **puis arrête-toi.**

## Prompt de reprise (enchaînement interrompu)

Reprise des étapes N à M du lot 3 bis, interrompues. Récupère la branche de la demande de fusion en brouillon « Lot 3 bis, étapes N à M (en cours) », lis la rubrique « Reprise des étapes N à M du lot 3 bis » de docs/AVANCEMENT.md sur cette branche, et relance les tests pour vérifier l'état. Continue ensuite là où le travail s'est arrêté, sans refaire ce qui est fait, avec les mêmes règles (section « Prompt pour enchaîner les étapes N à M » de docs/PROMPT-LOT3BIS.md).

---

## Prompt de la session relecteur limitée (après la fusion de la partie B)

Tu es relecteur d'une application de mathématiques pour une enfant de CE1. Lis la section « Les deux personnes à incarner » de docs/PROMPT-RECETTE-LOT3.md, le rapport docs/RECETTE-LOT3.md, puis `tests/recette-fonctionnelle/out-lot3bis/INDEX.md`.

**Ta mission**

1. Pour **chaque constat R1 à R25** du rapport, regarde le nouveau matériel (séquences, planches, journal des touchers) et dis s'il est :
   - **levé** ;
   - **en partie levé** ;
   - **non levé** ;
   
   avec ce que l'enfant voit maintenant, et la planche ou la séquence qui le montre.
2. Parcours les écrans modifiés avec les dix questions de la grille (docs/PROMPT-RECETTE-LOT3.md, session 2, phase 1), à la recherche de **régressions** et de problèmes nouveaux créés par le correctif : légende, appui long, numéros, décors, nouvelles aides, fins de séquence.
3. Vérifie que ce que le rapport rangeait dans « Ce qui fonctionne bien » (§5) l'est toujours.

Écris `docs/RECETTE-LOT3BIS.md` dans cet ordre :
1. une synthèse en cinq lignes ;
2. le tableau des constats R1 à R25 (état, observation, planche) ;
3. les constats nouveaux (numérotés N1, N2…, avec la même gravité : bloquant, gênant, cosmétique) ;
4. la non-régression.

Commit le rapport sur une branche, ouvre une demande de fusion intitulée « Recette de contrôle du lot 3 bis », **puis arrête-toi.** Ne corrige rien.
