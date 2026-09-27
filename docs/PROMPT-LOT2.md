# Prompt du lot 2 (à coller dans Claude Code, une étape par session)

Spécification : `docs/SPEC-LOT2.md` (elle prévaut sur `docs/SPEC.md` en cas de contradiction). Rédigé en conception le 27 septembre 2026.

## Comment s'en servir

- **Une étape = une session = une demande de fusion (PR) vers `main`.** À la fin de chaque étape, Claude Code ouvre la PR et s'arrête. Le parent la signale à la conversation de conception, qui fait sa recette ; le parent fusionne, la version est publiée, il essaie sur la tablette, puis lance l'étape suivante dans une **nouvelle** session. On ne construit jamais une étape sur une autre qui n'est pas encore fusionnée.
- Environnement : le même que pour le lot 1 bis (accès à Hugging Face autorisé, pour fabriquer la voix des phrases nouvelles avec Piper).
- Couper la session vers 30 à 40 % de contexte. Si une étape est trop grosse pour une session, la finir dans une seconde session (« étape 5, suite ») sans ouvrir de PR entre les deux.
- **Fusion après chaque étape** : chaque étape part de `main` à jour, qui contient les étapes précédentes. La demande de fusion d'une étape doit donc être fusionnée **avant** de lancer l'étape suivante. Chaque fusion publie la version sur la tablette : l'enfant profite de chaque étape et le parent l'essaie aussitôt.
- Pour lancer une étape : coller le prompt ci-dessous en remplaçant **N** par le numéro de l'étape.
- **Reprise sans perte** (quota d'utilisation atteint, coupure) : la règle est dans le prompt (branche `lot2-etapeN` poussée dès le début, demande de fusion en brouillon, commits poussés régulièrement, rubrique « Reprise de l'étape N » dans `docs/AVANCEMENT.md`). Si la session a disparu, coller le prompt de reprise en fin de document.

| Étape | Contenu | Réflexion | Coût estimé |
| --- | --- | --- | --- |
| 1 | **Cartes et rythme** : calendrier et quota, doublons, brillantes (20 % et effet), ouverture des zones, zone 2 (anecdotes et voix), étoiles dorées (4 semaines réussies), légendaires et coquillage doré, étoile arc-en-ciel de l'entraînement libre, surprise une séance sur cinq, ligne « Cartes » de l'espace parent ; simulation des cartes sur l'année (zones 3 et 4 considérées prêtes) | élevé | 12 à 18 $ |
| 2 | **Séance et progression** : durées et nombres de questions, défi record activable (étape vide tant qu'il n'est pas construit), places réservées et voie rapide des faits, enchaînement des niveaux, leçon au plus une fois par séance, point de départ du parent (niveaux 1 à 8, familles 1 et 2), tortue devant la pieuvre, pieuvre qui montre la cible ; option `--delai` de la recette ; **sélecteur de difficulté** (4 crans, multiplicateur d'étoiles) pour l'échauffement et la ligne graduée, profils « toujours très dur » et « toujours plus facile » dans la simulation | élevé | 18 à 27 $ |
| 3 | **Son, échantillons** : outil `tools/son/`, 2 ou 3 musiques et les bruitages dans `docs/son-echantillons/` ; **arrêt pour le choix du parent** | moyen | 4 à 8 $ |
| 4 | **Son, intégration** : bruitages et musique choisis, mixage et baisse sous la voix, réglages de l'espace parent | moyen | 5 à 10 $ |
| 5 | **Atelier** : bernard-l'ermite (repos et gestes), cadre de 10, maison des nombres, double + 1 | élevé | 15 à 25 $ |
| 6 | **Module 2 comme notion du jour** : familles 3 à 7 et leur ouverture, formes à trou, leçons L4 à L6, alternance avec le module 1, module imposé par le parent, point de départ étendu aux familles 3 à 7, sélecteur de difficulté étendu aux additions en notion du jour | élevé | 15 à 25 $ |
| 7 | **Défi record, grille des 66 additions, progression du module 2** dans l'espace parent | moyen | 8 à 12 $ |
| 8 | **Nombres jusqu'à 1 000** (`docs/SPEC-COMPLEMENTS.md`, partie A) : niveaux 9 à 13, dictée, E6 et E7 (et leur place dans le journal des erreurs), chalut, leçon L10, point de départ étendu aux niveaux 9 à 13 ; voix des grands nombres dans la limite de 40 Mo (SPEC-LOT2, section 4) | élevé | 15 à 20 $ |
| 9 | **Bilan** : `docs/BILAN-LOT2.md`, guide du parent, recette complète sur l'année | moyen | 3 à 5 $ |

Total estimé : **100 à 150 $** (sélecteur de difficulté compris), avec une incertitude d'environ ±50 %. Les étapes 1 et 2 sont les plus urgentes (les cartes du lagon s'épuisent, l'échauffement reste trivial) ; elles ont chacune un effet visible dès leur publication.

---

## Prompt (remplacer N)

Lis CLAUDE.md, docs/SPEC.md, docs/SPEC-LOT2.md (elle prévaut en cas de contradiction), docs/ARCHITECTURE.md et docs/AVANCEMENT.md ; pour l'étape 8, lis aussi docs/SPEC-COMPLEMENTS.md, partie A. Réalise **uniquement l'étape N du lot 2**, décrite dans le tableau de docs/PROMPT-LOT2.md et détaillée dans docs/SPEC-LOT2.md.

Méthode :
- Pars de `origin/main` à jour, sur une nouvelle branche. À l'étape 1 seulement, inscris d'abord les 9 étapes du lot 2 dans docs/AVANCEMENT.md.
- Tout ce qui se règle (nombres de questions, durées, quota, 20 % de brillantes, seuils d'ouverture, volumes) va dans app/content/, jamais en dur dans le code.
- Toute phrase nouvelle dite par la voix : ajoute-la au contenu, fabrique son fichier (`node tools/voix/fabriquer.mjs`), puis `node tools/precache.mjs`.
- Tests unitaires pour chaque règle nouvelle (quota, brillantes, ouverture des zones, étoiles dorées, places réservées, voie rapide, alternance, générateurs, détection des erreurs).
- **Recette avant de finir** (docs/SPEC-LOT2.md, section 8) : complète `tests/sim-recette.mjs` pour qu'il simule ce que l'étape a construit, lance `node tests/sim-seances.mjs` (profils sait, reel, diff ; 2 et 5 séances par semaine), `node tests/e2e/recette.mjs --delai 4.5` et `node tests/e2e/recette-durees.mjs` (avec et sans `--passer`), regarde les captures des écrans modifiés et corrige ce qui est laid, illisible, trop long ou sans issue. Les critères qui ne concernent pas encore l'étape sont notés « sans objet ».
- Mets à jour docs/AVANCEMENT.md (ce qui est fait, écarts avec la spécification et leur raison), fais le commit, pousse la branche, puis ouvre une pull request vers `main` dont la description contient : ce qui change pour l'enfant, ce qui change pour le parent, le tableau de recette avec les mesures, ce qui reste à vérifier sur la tablette. **Puis arrête-toi.**
- **Reprise sans perte** : dès le début, crée la branche `lot2-etapeN` (ou garde le nom imposé par l'environnement), pousse-la et ouvre tout de suite une demande de fusion en BROUILLON vers `main` intitulée « Lot 2, étape N (en cours) ». Tiens à jour dans docs/AVANCEMENT.md une rubrique « Reprise de l'étape N » (fait, reste, où tu en es exactement, décisions prises). Après chaque sous-partie terminée, et au moins toutes les 30 à 45 minutes, fais un commit « Étape N (en cours) : … » et pousse-le ; les tests peuvent ne pas tous passer dans ces commits intermédiaires, ils doivent tous passer à la fin. À la fin, complète la description, retire « (en cours) » du titre et sors la demande du mode brouillon.
- Étape 3 : arrête-toi après avoir déposé les échantillons, pour que le parent choisisse à l'écoute.
- En cas de doute pédagogique, demande plutôt que d'inventer ; signale tout écart avec la spécification.

---

## Prompt de reprise (si la session d'une étape s'est arrêtée et n'est plus disponible ; remplacer N)

Reprise de l'étape N du lot 2, interrompue. Récupère la branche de la demande de fusion en brouillon « Lot 2, étape N (en cours) » (branche `lot2-etapeN` ou celle indiquée dans la demande), lis la rubrique « Reprise de l'étape N » de docs/AVANCEMENT.md sur cette branche, relance les tests pour vérifier l'état, puis continue là où le travail s'est arrêté, sans refaire ce qui est fait, avec les mêmes règles (section « Prompt » de docs/PROMPT-LOT2.md : commits et poussées réguliers, rubrique de reprise à jour, recette avant de finir).
