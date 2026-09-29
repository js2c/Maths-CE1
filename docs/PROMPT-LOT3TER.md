# Prompt du lot 3 ter (à coller dans Claude Code)

Spécification : `docs/SPEC-LOT3TER.md`. Elle prévaut sur toutes les spécifications précédentes en cas de contradiction. Rédigé en conception le 29 septembre 2026.

## Comment s'en servir

Le lot tient en **une session, deux étapes, une demande de fusion**. Il se termine par une **session relecteur distincte**, qui fait la recette de contrôle du lot 3 bis (jamais faite) et de ce lot.

| Étape | Contenu (`docs/SPEC-LOT3TER.md`) | Réflexion | Coût estimé |
| --- | --- | --- | --- |
| 1 | T1 (passer l'échauffement : bouton dédié, pictogramme à l'atelier, confirmation par la coche) et T2 (ouverture automatique des familles à l'échauffement) | élevé | 8 à 14 $ |
| 2 | T3 (appui long sur tous les boutons de choix et de commande, fondus) et recette complète | élevé | 7 à 12 $ |
| — | Session relecteur (lot 3 bis et lot 3 ter) | élevé | 6 à 12 $ |

Total estimé : **21 à 38 $**, avec une incertitude d'environ ± 50 %.

**Hors de ce lot** : tout ce qui concerne le récif et la mer vivante, qui passe par un chantier graphique séparé.

---

## Prompt pour enchaîner les étapes 1 et 2

Lis CLAUDE.md, docs/SPEC.md, docs/SPEC-LOT2.md, docs/SPEC-LOT3.md, docs/SPEC-LOT3BIS.md, docs/SPEC-LOT3TER.md (elle prévaut en cas de contradiction), docs/ARCHITECTURE.md et docs/AVANCEMENT.md. Réalise **les étapes 1 et 2 du lot 3 ter, dans l'ordre, sans t'arrêter entre elles**, telles que décrites dans le tableau de docs/PROMPT-LOT3TER.md et détaillées dans docs/SPEC-LOT3TER.md.

**Le sens du lot.** Ces trois points viennent d'essais réels du parent sur la tablette. Pour chacun, vérifie le résultat **du point de vue de l'enfant et du parent devant l'écran**, pas seulement la conformité à la spécification : regarde les captures, et lis les séquences générées.

**Méthode**

- **Branche et demande de fusion.** Pars de `origin/main` à jour. Inscris d'abord les 2 étapes du lot 3 ter dans docs/AVANCEMENT.md et mets à jour la ligne « Où en est-on ». Crée la branche `lot3ter` (ou garde le nom imposé par l'environnement), pousse-la et ouvre une demande de fusion en BROUILLON vers `main`, intitulée « Lot 3 ter (en cours) ».
- **Suivi de la reprise.** Tiens à jour dans docs/AVANCEMENT.md une rubrique « Reprise du lot 3 ter » : étape en cours, fait, reste, décisions prises. Fais un commit poussé après chaque sous-partie, et au moins toutes les 30 à 45 minutes.
- **Contenu.** Tout réglage va dans app/content/ : délai de la coche, seuils d'ouverture des familles, durées de l'appui long et des fondus, textes des étiquettes. Toute phrase nouvelle : ajoute-la au contenu, fabrique son fichier (`node tools/voix/fabriquer.mjs`), puis lance `node tools/precache.mjs`. Le pictogramme « passer l'échauffement » est dessiné dans l'atelier (style A, craft bar) et regardé à l'agrandissement.
- **Tests unitaires pour chaque règle nouvelle** :
  - bouton présent pendant tout l'échauffement ;
  - mise en attente, confirmation et reprise après 5 s ;
  - les trois conditions d'ouverture d'une famille, et le plafond d'une famille par jour ;
  - la validation au lever du doigt ;
  - l'appui long sans validation ;
  - l'exception du pavé et des bulles-réponses.
- **Recette allégée à la fin de l'étape 1** : tests unitaires, `node tests/sim-seances.mjs`, `node tests/recette-fonctionnelle/b-sequences.mjs` en mode test, captures des écrans modifiés. Puis mise à jour de docs/AVANCEMENT.md, commit « Lot 3 ter, étape 1 : … » poussé, et passage à l'étape 2 sans attendre.
- **Arrêt propre.** Si le contexte dépasse environ la moitié à la fin de l'étape 1, pousse tout, mets à jour la rubrique de reprise (« reprendre à l'étape 2 ») et arrête-toi en le disant.
- **Décisions manquantes.** Prends la valeur par défaut, note la question dans la demande de fusion et dans docs/AVANCEMENT.md, et continue. S'il n'y a pas de valeur par défaut raisonnable, arrête-toi et pose la question. **Ne touche pas aux décisions du parent** marquées dans la spécification. **Ne touche pas au récif.**
- **Recette complète à la fin de l'étape 2** :
  - le tableau « Recette du lot 3 ter » de docs/SPEC-LOT3TER.md, avec les mesures ;
  - les recettes des lots précédents ;
  - puis la relance des parties B et C de la recette fonctionnelle (docs/PROMPT-RECETTE-LOT3.md, session 1), dans `tests/recette-fonctionnelle/out-lot3ter/`, avec son `INDEX.md`, en y ajoutant le parcours de l'appui long sur chaque bouton recensé et le parcours « passer l'échauffement ».
- **À la fin** :
  - complète la description de la demande de fusion : ce qui change pour l'enfant et pour le parent, le tableau de recette, la liste des boutons recensés, les questions ouvertes, ce qui reste à vérifier sur la tablette ;
  - retire « (en cours) » du titre et sors la demande de fusion du mode brouillon ;
  - **puis arrête-toi.**

## Prompt de reprise

Reprise du lot 3 ter, interrompu. Récupère la branche de la demande de fusion en brouillon « Lot 3 ter (en cours) », lis la rubrique « Reprise du lot 3 ter » de docs/AVANCEMENT.md sur cette branche, et relance les tests pour vérifier l'état. Continue ensuite là où le travail s'est arrêté, sans refaire ce qui est fait, avec les mêmes règles (section « Prompt pour enchaîner les étapes 1 et 2 » de docs/PROMPT-LOT3TER.md).

---

## Prompt de la session relecteur (après la fusion du lot 3 ter)

Tu es relecteur d'une application de mathématiques pour une enfant de CE1. Lis la section « Les deux personnes à incarner » de docs/PROMPT-RECETTE-LOT3.md, le rapport docs/RECETTE-LOT3.md, puis `tests/recette-fonctionnelle/out-lot3bis/INDEX.md` et `tests/recette-fonctionnelle/out-lot3ter/INDEX.md`. **Ne lis pas les spécifications avant d'avoir terminé la première partie.**

**Ta mission**

1. Pour **chaque constat R1 à R25** de docs/RECETTE-LOT3.md, regarde le matériel le plus récent et dis s'il est :
   - **levé** ;
   - **en partie levé** ;
   - **non levé** ;
   
   avec ce que l'enfant voit maintenant et la planche ou la séquence qui le montre.
2. Juge les trois nouveautés du lot 3 ter avec les dix questions de la grille (docs/PROMPT-RECETTE-LOT3.md, session 2, phase 1) :
   - **passer l'échauffement** : le bouton est-il trouvable, et la confirmation est-elle comprise sans lire ?
   - **l'échauffement qui s'ajuste** : les séquences d'échauffement d'un mois sont-elles à la bonne difficulté pour chaque profil ?
   - **l'appui long** : un appui prolongé lance-t-il encore quelque chose quelque part ?
3. Cherche les **régressions** et les problèmes nouveaux, sur tous les écrans modifiés depuis le rapport initial.
4. Vérifie que ce que le rapport initial rangeait dans « Ce qui fonctionne bien » (§5) l'est toujours.

Ensuite seulement, lis docs/SPEC-LOT3BIS.md et docs/SPEC-LOT3TER.md, et qualifie chaque constat encore ouvert : défaut de spécification, défaut de réalisation, ou question.

Écris `docs/RECETTE-LOT3TER.md` dans cet ordre :
1. une synthèse en cinq lignes ;
2. le tableau des constats R1 à R25 ;
3. les constats sur les nouveautés et les constats nouveaux, numérotés N1, N2…, avec la gravité (bloquant, gênant, cosmétique) ;
4. la non-régression.

Commit le rapport sur une branche, ouvre une demande de fusion intitulée « Recette de contrôle des lots 3 bis et 3 ter », **puis arrête-toi.** Ne corrige rien.
