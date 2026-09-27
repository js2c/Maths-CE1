# Prompt du lot 3 (à coller dans Claude Code)

Spécification : `docs/SPEC-LOT3.md` (elle prévaut sur `docs/SPEC.md`, `docs/SPEC-LOT2.md` et `docs/SPEC-COMPLEMENTS.md` en cas de contradiction). Rédigé en conception le 27 septembre 2026.

## Comment s'en servir

- Deux demandes de fusion : **partie A (étapes 1 et 2, correctif du lot 2)**, à fusionner et essayer sur la tablette avant de lancer la **partie B (étapes 3 à 5, calcul rapide)**.
- Chaque partie s'enchaîne dans une session, avec le prompt « enchaîner » ci-dessous (réflexion « élevé »). Si la session s'arrête d'elle-même (contexte au-delà de la moitié), relancer avec le prompt de reprise.
- Recette allégée à chaque étape, complète à la fin de chaque partie ; la conversation de conception ne fait de recette que sur demande.

| Étape | Partie | Contenu | Réflexion | Coût estimé |
| --- | --- | --- | --- | --- |
| 1 | A | Accueil « choisir » : exercice et niveau (ligne 1 à 13, familles 1 à 7, leçons), exercice choisi = séance du jour ; échauffement passable et réglage ; leçons cohérentes (suppression de `leconSiPasVue`, 80 % sur la famille) ; maison des nombres ; test des bords des sprites | élevé | 15 à 25 $ |
| 2 | A | Difficulté à l'intérieur du niveau (ligne graduée, 13 niveaux × 4 crans ; additions) ; outil de sauvegardes de test ; guide du parent ; recette complète de la partie A | élevé | 10 à 18 $ |
| 3 | B | Atelier : mur de corail, poisson sur le mur, ponts du chemin, pictogramme du calcul rapide pour l'écran de choix | élevé | 8 à 15 $ |
| 4 | B | Module 3 : niveaux 1 à 9, générateurs, erreurs C1 à C5, déroulé d'un nouveau niveau, leçons L7 à L9, crans, choix du niveau, rotation dans « jouer », espace parent | élevé | 18 à 28 $ |
| 5 | B | Bilan : `docs/BILAN-LOT3.md`, guide du parent, recette complète sur l'année | moyen | 4 à 6 $ |

Total estimé : **55 à 90 $**, incertitude d'environ ± 50 %.

---

## Prompt pour enchaîner les étapes N à M

Lis CLAUDE.md, docs/SPEC.md, docs/SPEC-LOT2.md, docs/SPEC-LOT3.md (elle prévaut en cas de contradiction), docs/ARCHITECTURE.md et docs/AVANCEMENT.md. Réalise **les étapes N à M du lot 3, dans l'ordre, sans t'arrêter entre elles**, telles que décrites dans le tableau de docs/PROMPT-LOT3.md et détaillées dans docs/SPEC-LOT3.md.

Méthode :
- Pars de `origin/main` à jour. À la première étape du lot seulement, inscris d'abord les 5 étapes du lot 3 dans docs/AVANCEMENT.md (et mets à jour la ligne « Où en est-on » en tête du fichier). Dès le début, crée la branche `lot3-etapes-N-M` (ou garde le nom imposé par l'environnement), pousse-la et ouvre une demande de fusion en BROUILLON vers `main` intitulée « Lot 3, étapes N à M (en cours) ».
- Tiens à jour dans docs/AVANCEMENT.md une rubrique « Reprise des étapes N à M du lot 3 » : étape en cours, fait, reste, où tu en es exactement, décisions prises. Après chaque sous-partie terminée, et au moins toutes les 30 à 45 minutes, fais un commit « Lot 3, étape k (en cours) : … » et pousse-le.
- Tout ce qui se règle va dans app/content/, jamais en dur. Toute phrase nouvelle dite par la voix : ajoute-la au contenu, fabrique son fichier (`node tools/voix/fabriquer.mjs`), puis `node tools/precache.mjs`. Tout élément graphique nouveau est dessiné dans l'atelier (style A, craft bar), regardé à l'agrandissement.
- Tests unitaires pour chaque règle nouvelle (choix du niveau et validation au-dessus du conseillé, famille choisie et limite des faits nouveaux, 80 % sur la famille, suppression de leconSiPasVue, crans à l'intérieur du niveau, générateurs et erreurs du module 3, rotation à trois modules, test des bords des sprites).
- **Pour chaque étape** : recette allégée (tests unitaires, `node tests/sim-seances.mjs`, une capture de chaque écran nouveau ou modifié, regardée et corrigée), mise à jour de docs/AVANCEMENT.md, commit « Lot 3, étape k : … » poussé ; passe ensuite à l'étape suivante sans attendre.
- **Arrêt propre** : si, à la fin d'une étape, le contexte dépasse environ la moitié, ne commence pas la suivante : pousse tout, mets à jour la rubrique de reprise (« reprendre à l'étape k+1 ») et arrête-toi en le disant.
- **Décisions manquantes** : si une étape bute sur une question que docs/SPEC-LOT3.md ne tranche pas, prends le choix par défaut indiqué s'il y en a un, note la question dans la demande de fusion et dans docs/AVANCEMENT.md, et continue ; s'il n'y en a pas de raisonnable, arrête-toi et pose la question. Ne réintroduis pas de règle que la SPEC du lot 3 supprime.
- **Recette complète à la fin de l'étape M** (docs/SPEC-LOT2.md, section 8, et docs/SPEC-LOT3.md, section 7) : `node tests/sim-seances.mjs` (tous les profils, 2 et 5 séances par semaine, sur l'année), `node tests/e2e/recette.mjs --delai 4.5`, `node tests/e2e/recette-durees.mjs` avec et sans `--passer`, tous les parcours Playwright (un par un s'ils échouent sous la charge), captures regardées. Tableau des critères avec les mesures.
- À la fin : complète la description de la demande de fusion (pour chaque étape : ce qui change pour l'enfant, pour le parent ; le tableau de recette ; les questions restées ouvertes ; ce qui reste à vérifier sur la tablette), retire « (en cours) » du titre, sors-la du mode brouillon, **puis arrête-toi.**

## Prompt de reprise (enchaînement interrompu)

Reprise des étapes N à M du lot 3, interrompues. Récupère la branche de la demande de fusion en brouillon « Lot 3, étapes N à M (en cours) », lis la rubrique « Reprise des étapes N à M du lot 3 » de docs/AVANCEMENT.md sur cette branche, relance les tests pour vérifier l'état, puis continue là où le travail s'est arrêté, sans refaire ce qui est fait, avec les mêmes règles (section « Prompt pour enchaîner les étapes N à M » de docs/PROMPT-LOT3.md).
