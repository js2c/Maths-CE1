# Prompts à coller dans Claude Code

Tenu en conception. Les prompts des lots passés sont dans `docs/archives/`.

## Règles communes à toutes les sessions

- Lire `CLAUDE.md`, `docs/SPEC.md` (la spécification unique), `docs/ARCHITECTURE.md` et `docs/AVANCEMENT.md`. Les anciennes spécifications (`docs/archives/`) ne servent qu'à retrouver l'origine d'une règle : **en cas d'écart, `docs/SPEC.md` fait foi**.
- Partir de `origin/main` à jour ; une branche poussée dès le début ; une demande de fusion en brouillon ouverte tout de suite ; commits poussés après chaque sous-partie et au moins toutes les 30 à 45 minutes ; une rubrique « Reprise » tenue à jour dans `docs/AVANCEMENT.md`.
- Un lot modifie **`docs/SPEC.md` en place**, dans la même demande de fusion que le code (pas de nouvelle spécification). Les raisons des décisions vont dans `docs/JOURNAL-CONCEPTION.md`, les questions non tranchées dans `docs/IDEES.md`.
- Arrêt propre si le contexte dépasse environ la moitié : tout pousser, noter où reprendre, s'arrêter en le disant.

## Relecteur (recette de contrôle des lots 3 bis et 3 ter)

À lancer après l'essai du lot 3 ter sur la tablette. Réflexion « élevé ».

```
Tu es relecteur d'une application de mathématiques pour une enfant de CE1. Lis la section « Les deux personnes à incarner » de docs/archives/PROMPT-RECETTE-LOT3.md, le rapport docs/archives/RECETTE-LOT3.md, puis tests/recette-fonctionnelle/out-lot3bis/INDEX.md et tests/recette-fonctionnelle/out-lot3ter/INDEX.md. Ne lis pas les spécifications avant d'avoir terminé la première partie.

Ta mission :
1. Pour chaque constat R1 à R25 de docs/archives/RECETTE-LOT3.md, regarde le matériel le plus récent et dis s'il est levé, en partie levé ou non levé, avec ce que l'enfant voit maintenant et la planche ou la séquence qui le montre.
2. Juge les trois nouveautés du lot 3 ter avec les dix questions de la grille (docs/archives/PROMPT-RECETTE-LOT3.md, session 2, phase 1) :
   - passer l'échauffement : le bouton est-il trouvable, et la confirmation est-elle comprise sans lire ?
   - l'échauffement qui s'ajuste : les séquences d'échauffement d'un mois sont-elles à la bonne difficulté pour chaque profil ?
   - l'appui long : un appui prolongé lance-t-il encore quelque chose quelque part ?
3. Cherche les régressions et les problèmes nouveaux, sur tous les écrans modifiés depuis le rapport initial.
4. Vérifie que ce que le rapport initial rangeait dans « Ce qui fonctionne bien » (§5) l'est toujours.

Ensuite seulement, lis docs/SPEC.md (la spécification unique en vigueur), et qualifie chaque constat encore ouvert : défaut de spécification, défaut de réalisation, ou question.

Écris docs/RECETTE-LOT3TER.md dans cet ordre : une synthèse en cinq lignes ; le tableau des constats R1 à R25 ; les constats sur les nouveautés et les constats nouveaux, numérotés N1, N2…, avec la gravité (bloquant, gênant, cosmétique) ; la non-régression.

Commit le rapport sur une branche, ouvre une demande de fusion intitulée « Recette de contrôle des lots 3 bis et 3 ter », puis arrête-toi. Ne corrige rien.
```

## Confrontation de la spécification avec le code

`docs/SPEC.md` a été rédigée le 30 septembre 2026 à partir des spécifications successives, pas du code. Cette session relève les écarts, sans rien corriger. Réflexion « élevé » ; peut suivre le relecteur, ou être faite avant.

```
Lis CLAUDE.md et docs/SPEC.md. Ta mission : confronter docs/SPEC.md au code et au contenu (app/js, app/content), sans rien corriger dans l'application.

Méthode :
- Pour chaque section de docs/SPEC.md, vérifie chaque règle dans le code et les réglages (app/content) ; lance les outils de simulation si c'est le moyen le plus sûr de vérifier (tests/sim-seances.mjs, tests/recette-fonctionnelle/b-sequences.mjs --test).
- Relève chaque écart : la règle telle qu'écrite, ce que fait réellement l'application (fichier, fonction, réglage), et ta qualification : la spécification est fausse ou datée (le code a raison), le code s'écarte d'une décision (la spécification a raison), ou question à trancher.
- Relève aussi ce que l'application fait et que docs/SPEC.md ne dit pas (comportements visibles pour l'enfant ou le parent seulement ; pas les détails d'implémentation).
- Pour retrouver l'origine d'une règle, consulte docs/archives/ et docs/JOURNAL-CONCEPTION.md.

Écris docs/ECARTS-SPEC.md : une synthèse en cinq lignes, puis un tableau par section de la spécification (règle, ce que fait l'application, où, qualification, proposition), puis la liste de ce qui manque à la spécification. Dans la même branche, corrige docs/SPEC.md pour les seuls écarts où la spécification est manifestement datée et le code conforme aux décisions du journal ; laisse tout le reste au parent. Ouvre une demande de fusion intitulée « Confrontation de la spécification et du code », puis arrête-toi.
```

## Lot « Mascotte » (à lancer d'abord)

Préparé en conception le 6 octobre 2026. Réflexion « élevé ».

```
Lis CLAUDE.md, docs/SPEC.md, docs/ARCHITECTURE.md, docs/AVANCEMENT.md et la section « Règles communes à toutes les sessions » de docs/PROMPTS.md, puis art/mascotte/README.md en entier. Réalise le lot « Mascotte » : la mascotte (le capitaine, en vidéo) remplace la pieuvre partout, à sa place sur chaque écran, avec la bulle le temps de parler, la flèche à la place du tentacule, sans nom et avec une phrase de bienvenue à l'accueil (docs/SPEC.md, section 11, « La mascotte », et les mentions « à construire » des sections 2, 3, 8 et 12 qui la concernent ; le jeu des voiliers est un autre lot, n'y touche pas).

Ce qui est fait et validé par le parent, à reprendre sans le réinventer : art/mascotte/ (index.html, la maquette du comportement ; mascotte-moteur.js, le moteur ; v/, les 17 clips ; README.md, les mesures et les règles). Le moteur entre tel quel dans app/js/engine/ (même table de clips, mêmes règles, mêmes délais) ; il imite l'interface de la pieuvre (play, hold, release) pour que les exercices ne changent pas ; seuls ses raccords sont nouveaux (voix, toucher, pause, bulle, mode accéléré des tests). Les clips vont dans app/assets/mascotte/ en WebM.

Points d'attention :
- Placement : là où était la pieuvre, écran par écran. Captures avant et après de chaque écran et de chaque type d'exercice (tests/e2e/lagon.mjs les produit toutes), regardées. La bulle ne couvre jamais ce que l'enfant touche pour répondre. Ce que la mascotte cacherait pendant un exemple, une correction ou une leçon est déplacé, pas elle.
- La pieuvre disparaît entièrement : engine/octopus.js, ses planches (pieuvre, pieuvre-gestes) et leur fabrication dans l'atelier, le choix du nom au premier lancement, le réglage de l'espace parent, {mascotte} et la liste des noms dans le contenu, la liste du service worker, les parcours qui la visent. Le nom déjà enregistré reste dans la base sans être montré (pas de migration destructive ; les sauvegardes restent restaurables).
- La flèche est dessinée dans l'atelier, en style A (CLAUDE.md, « Direction graphique »), contrôlée sur agrandissement.
- Voix : salutations de l'accueil sans nom, avec « bienvenue » ; phrase de relance ; suppression des phrases du nom. Ne fabrique aucun son (CLAUDE.md, « Voix ») : quand les tests échouent sur les phrases sans fichier, donne leur liste exacte dans la demande de fusion, préviens le parent qu'il doit les fabriquer sur cette branche avant la fusion (docs/VOIX.md), et continue le reste.
- Fluidité : la mascotte ajoute un contexte WebGL ; temps d'image avant et après sur les écrans les plus chargés (tests/e2e/perf.mjs) ; l'allègement automatique doit continuer de fonctionner.
- Recette : section 14 de docs/SPEC.md, plus une séance simulée où tu relèves le journal des raccords de la mascotte (combien de fondus forcés) et une capture de chaque réaction (salut, joie, grande joie, déception, encouragement, relance, flèche).

Mets à jour docs/SPEC.md (retire « à construire » de ce qui est fait, et ce qui parle encore de la pieuvre), docs/ARCHITECTURE.md (la mascotte à la place de « La pieuvre : des pièces et une frise »), docs/GUIDE-PARENT.md et CLAUDE.md (« Personnages »).
```

## Lot « Les voiliers » (après la fusion du lot « Mascotte »)

Préparé en conception le 6 octobre 2026. Réflexion « élevé ».

```
Lis CLAUDE.md, docs/SPEC.md, docs/ARCHITECTURE.md, docs/AVANCEMENT.md et la section « Règles communes à toutes les sessions » de docs/PROMPTS.md, puis art/voiliers/README.md et art/mascotte/README.md. Réalise le lot « Les voiliers » : le jeu de la maquette art/voiliers/, validé par le parent, devient le module 4 de l'application (docs/SPEC.md, section 7 bis, et les mentions « à construire » des sections 3, 11, 12 et 13 qui le concernent).

Méthode d'intégration, celle du récif vivant (docs/SPEC.md, section 10, « Fabrication ») : un outil de l'atelier, art/tools/export-voiliers.mjs, extrait les images de la maquette dans app/assets/voiliers/ et fabrique le module à partir de son script ; seuls les raccords avec l'application sont retouchés (séance, voix, mascotte, toucher, pause, enregistrement, frise), chacun contrôlé par l'export ; la maquette n'est jamais modifiée. La mascotte y est déjà branchée : garde ces branchements, sur la mascotte de l'application.

Points d'attention :
- Les règles de l'application appliquées au jeu (niveaux et adaptation, la mer selon le cran, erreurs et corrections, je ne sais pas, passer, réécouter, pause, durée de la partie, étoiles, exemple guidé) : simule-les d'abord (tests/sim-seances.mjs) et lis les séquences (tests/recette-fonctionnelle/b-sequences.mjs, étendu à ce module) ; si une règle simulée montre un défaut, arrête-toi et décris-le au parent avant de la coder.
- Voix : rédige les phrases comme la section 7 bis les donne (peu de gabarits à nombre) ; l'inventaire (tools/voix/inventaire.mjs) reçoit le domaine de chaque gabarit ; donne dans la demande de fusion le nombre de phrases nouvelles et le poids estimé. Ne fabrique aucun son : donne leur liste et préviens le parent, qui les fabrique sur cette branche avant la fusion (docs/VOIX.md).
- Les nombres en lettres de la bulle suivent l'écriture de l'application (traits d'union, engine/phrases.js), pas celle de la maquette.
- Fluidité sur la tablette : la mer en WebGL et la mascotte ; mesure (tests/e2e/perf.mjs) et allègement par les qualités de mer de la maquette.
- Enregistrement et espace parent : réponses, codes V1 à V4 et NSP, progression, point de départ, légende des 9 niveaux.
- Recette complète (section 14), avec des parties à chaque cran et une capture de chaque situation (calme, vent, pirates, double encadrement, erreur, je ne sais pas, exemple guidé, pause et reprise).

Mets à jour docs/SPEC.md, docs/ARCHITECTURE.md, docs/GUIDE-PARENT.md et CLAUDE.md.
```

## Lancer un lot

Le lot est d'abord décrit dans `docs/SPEC.md` (sections modifiées ou ajoutées, marquées « à construire »), en conception. Puis, dans une nouvelle session (réflexion « élevé » pour la logique fine ou le graphisme) :

```
Lis CLAUDE.md, docs/SPEC.md, docs/ARCHITECTURE.md, docs/AVANCEMENT.md et la section « Règles communes à toutes les sessions » de docs/PROMPTS.md. Réalise le lot « <nom> » : <ce qu'il faut construire, en une ou deux phrases, avec les sections de docs/SPEC.md concernées>.

Avant de coder une règle pédagogique nouvelle, simule-la (tests/sim-seances.mjs) et lis les séquences produites (tests/recette-fonctionnelle/b-sequences.mjs) ; si elles montrent un défaut, arrête-toi et décris-le. Tout ce qui se règle va dans app/content/. Toute phrase nouvelle : ne fabrique pas sa voix toi-même (CLAUDE.md, « Voix ») ; liste-la dans la demande de fusion et préviens le parent, qui la fabrique sur son ordinateur (docs/VOIX.md). Tests unitaires pour chaque règle nouvelle. Recette : docs/SPEC.md, section 14, points 1 à 5. Mets docs/SPEC.md à jour (retire « à construire » de ce qui est fait), puis docs/AVANCEMENT.md. Complète la demande de fusion (ce qui change pour l'enfant, pour le parent, le tableau de recette, les questions restées ouvertes, ce qui reste à vérifier sur la tablette), sors-la du mode brouillon, puis arrête-toi.
```
