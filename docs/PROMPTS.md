# Prompts à coller dans Claude Code

Tenu en conception. Les prompts des lots passés sont dans `docs/archives/`.

## Règles communes à toutes les sessions

Pour les lots, la méthode commune de `docs/LOTS.md` les reprend et les complète. Pour la session de contrôle ci-dessous (la session « relecteur » des lots 3 bis et 3 ter a été abandonnée par le parent le 6 octobre 2026 : chaque lot a désormais sa relecture indépendante) :

- Lire `CLAUDE.md`, `docs/SPEC.md` (la spécification unique), `docs/ARCHITECTURE.md` et `docs/AVANCEMENT.md`. Les anciennes spécifications (`docs/archives/`) ne servent qu'à retrouver l'origine d'une règle : **en cas d'écart, `docs/SPEC.md` fait foi**.
- Partir de `origin/main` à jour ; une branche poussée dès le début ; une demande de fusion en brouillon ouverte tout de suite ; commits poussés après chaque sous-partie et au moins toutes les 30 à 45 minutes ; une rubrique « Reprise » tenue à jour dans `docs/AVANCEMENT.md`.
- Un lot modifie **`docs/SPEC.md` en place**, dans la même demande de fusion que le code (pas de nouvelle spécification). Les raisons des décisions vont dans `docs/JOURNAL-CONCEPTION.md`, les questions non tranchées dans `docs/IDEES.md`.
- Arrêt propre si le contexte dépasse environ la moitié : tout pousser, noter où reprendre, s'arrêter en le disant.

## Confrontation de la spécification avec le code

`docs/SPEC.md` a été rédigée le 30 septembre 2026 à partir des spécifications successives, pas du code. Cette session relève les écarts, sans rien corriger, et ne modifie que son rapport : elle peut tourner en même temps qu'un lot. **À faire avant le lot « Sommes jusqu'à 30 »** (décision du parent du 6 octobre 2026), qui s'appuie sur les règles du module 2 ; le parent tranche ensuite les écarts. Réflexion « élevé ».

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
