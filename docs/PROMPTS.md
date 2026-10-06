# Prompts à coller dans Claude Code

Tenu en conception. Les prompts des lots passés sont dans `docs/archives/`.

## Règles communes à toutes les sessions

Pour les lots, la méthode commune de `docs/LOTS.md` les reprend et les complète. Pour les sessions de contrôle ci-dessous :

- Lire `CLAUDE.md`, `docs/SPEC.md` (la spécification unique), `docs/ARCHITECTURE.md` et `docs/AVANCEMENT.md`. Les anciennes spécifications (`docs/archives/`) ne servent qu'à retrouver l'origine d'une règle : **en cas d'écart, `docs/SPEC.md` fait foi**.
- Partir de `origin/main` à jour ; une branche poussée dès le début ; une demande de fusion en brouillon ouverte tout de suite ; commits poussés après chaque sous-partie et au moins toutes les 30 à 45 minutes ; une rubrique « Reprise » tenue à jour dans `docs/AVANCEMENT.md`.
- Un lot modifie **`docs/SPEC.md` en place**, dans la même demande de fusion que le code (pas de nouvelle spécification). Les raisons des décisions vont dans `docs/JOURNAL-CONCEPTION.md`, les questions non tranchées dans `docs/IDEES.md`.
- Arrêt propre si le contexte dépasse environ la moitié : tout pousser, noter où reprendre, s'arrêter en le disant.

## Relecteur (recette de contrôle des lots 3 bis et 3 ter)

Facultatif. À lancer après l'essai du lot 3 ter sur la tablette, **avant le lot « Mascotte »**, qui change les écrans qu'il juge ; sinon, l'abandonner : la relecture indépendante de chaque lot (`docs/LOTS.md`) prend le relais. Ne touche pas à l'application ; peut tourner en même temps qu'un lot. Réflexion « élevé ».

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

`docs/SPEC.md` a été rédigée le 30 septembre 2026 à partir des spécifications successives, pas du code. Cette session relève les écarts, sans rien corriger, et ne modifie que son rapport : elle peut tourner en même temps qu'un lot. Facultatif, mais utile avant les lots « Sommes jusqu'à 30 » et « Multiplication », qui s'appuient sur les règles du module 2. Réflexion « élevé ».

```
Lis CLAUDE.md et docs/SPEC.md. Ta mission : confronter docs/SPEC.md au code et au contenu (app/js, app/content), sans rien corriger dans l'application.

Méthode :
- Pour chaque section de docs/SPEC.md, vérifie chaque règle dans le code et les réglages (app/content) ; lance les outils de simulation si c'est le moyen le plus sûr de vérifier (tests/sim-seances.mjs, tests/recette-fonctionnelle/b-sequences.mjs --test).
- Relève chaque écart : la règle telle qu'écrite, ce que fait réellement l'application (fichier, fonction, réglage), et ta qualification : la spécification est fausse ou datée (le code a raison), le code s'écarte d'une décision (la spécification a raison), ou question à trancher.
- Relève aussi ce que l'application fait et que docs/SPEC.md ne dit pas (comportements visibles pour l'enfant ou le parent seulement ; pas les détails d'implémentation).
- Pour retrouver l'origine d'une règle, consulte docs/archives/ et docs/JOURNAL-CONCEPTION.md.

Écris docs/ECARTS-SPEC.md : une synthèse en cinq lignes, puis un tableau par section de la spécification (règle, ce que fait l'application, où, qualification, proposition), puis la liste de ce qui manque à la spécification. Ne modifie aucun autre fichier (un lot peut être en cours sur docs/SPEC.md) : les corrections de la spécification seront faites après la décision du parent. Ouvre une demande de fusion intitulée « Confrontation de la spécification et du code », puis arrête-toi.
```

## Lancer un lot

Les lots à lancer, leur ordre, la méthode commune (dont la recette faite par la session) et la fiche de chaque lot sont dans **`docs/LOTS.md`** (6 octobre 2026). Le prompt tient en une ligne, réflexion « élevé » :

```
Lis CLAUDE.md puis docs/LOTS.md, et réalise le lot « <nom du lot> » en suivant sa fiche et la méthode commune.
```

Pour reprendre un lot interrompu :

```
Lis CLAUDE.md puis docs/LOTS.md, et reprends le lot « <nom du lot> » là où il s'est arrêté (docs/AVANCEMENT.md, rubrique « Reprise »).
```

Un lot nouveau s'ajoute à `docs/LOTS.md` (une ligne du tableau et une fiche), en conception.
