# Lot « Correctifs » : relecture indépendante de la spécification

Relecture faite le 7 octobre 2026 par un agent qui n'avait pas vu le travail. À la place de la relecture des écrans (rien ne change à l'écran, sauf la forme à trou du niveau 9 du calcul rapide, capturée dans `captures/`), la fiche du lot (`docs/LOTS.md`, 2 bis) demande de relire la spécification modifiée, en la confrontant de nouveau au code, sur les seules sections touchées.

**Ce qu'il a reçu** : la fiche 2 bis, `docs/ECARTS-SPEC.md`, le diff de `docs/SPEC.md` et celui du code (`app/`).

**Ce qu'il a vérifié** :

- chaque règle ajoutée ou modifiée, comparée au code et aux réglages ;
- que chaque élément de la fiche est reporté ;
- l'absence de contradiction interne ;
- les 7 correctifs et leurs tests ;
- la langue, pour un parent.

Il a aussi relancé la simulation de l'année (5 profils, 2 et 5 séances par semaine), avec et sans le code de l'écart 6.2 : les familles s'ouvrent aux mêmes séances.

## Constats et traitement

| N° | Gravité | Constat | Traitement |
| --- | --- | --- | --- |
| 1 | bloquant | Mascotte (11.1) : la spécification disait « seule une réussite remet le compteur à zéro ». Dans le code (`engine/mascotte.js`, `parole`), chaque consigne le remet aussi à zéro. La première erreur de chaque question déçoit donc. Le rapport de confrontation décrivait mal ce comportement, et le parent a tranché sur cette description. | La règle réelle est écrite (section 11). Le guide du parent est corrigé. Le journal de conception le note. **La question est reposée au parent** dans la demande de fusion : garder, ou changer la maquette `art/mascotte/`. Le code n'est pas modifié : son moteur vient de la maquette, qu'on ne modifie pas sans décision. |
| 2 | gênant | Ligne, écart 4.2 : au cran « plus facile », la difficulté persistante (3 erreurs sur 5) n'est plus détectée au niveau 1. La fiche ne demandait que de couper la montée et la voie rapide. | Gardé, et écrit en sections 4 et 9. Avant le lot, ce cran ne déclenchait déjà la difficulté nulle part ailleurs : avec « choisir », et avec « jouer » au-dessus du niveau 1, la question jouée est sous le conseillé. Le cran ne se comporte plus autrement au seul niveau 1. |
| 3 | gênant | Une famille dépassée un jour où une autre s'était ouverte redevenait la famille en cours à une autre séance du même jour (`currentFamily`). | **Corrigé** : `families.js`, `currentFamily`, qui prend la dernière famille ouverte non dépassée. Testé dans `tests/unit/lot-correctifs.test.mjs`. Ajouté à la section 6. |
| 4 | gênant | Écart 2.2 : « s'il reste du temps » est faux. Les 2 questions de fin sur une réussite sont posées même après la fin de l'étape, et même sur la minute gardée pour la récompense. | Écrit tel quel (section 2, avec une exception notée au plafond). Le code n'est pas modifié : l'erreur venait du rapport. **Signalé au parent**. |
| 5 | gênant | Rotation de « jouer » : à égalité, l'ordre suit le dernier exercice joué, et non « ligne, additions, calcul ». | Corrigé (section 3). |
| 6 | gênant | Calcul rapide : seuls les calculs à forme directe sont guidés. Au cran « très dur » des niveaux 4, 5, 7, 8 et 9, il n'y a aucun calcul guidé. | Écrit (section 7, « Déroulé »). C'est déjà le cas aux niveaux 4 à 8 ; le niveau 9 les rejoint par la décision 7.3. |
| 7 | gênant | « La protection du cran prend le relais » : seulement aux crans « plus dur » et « très dur ». Un niveau choisi au-dessus du conseillé, au cran conseillé, n'a ni difficulté persistante ni protection. | Précisé (section 9). |
| 8 | gênant (langue) | « plus les cadeaux de la surprise » se lisait « en plus ». | Corrigé : « les cadeaux de la surprise n'y sont plus ». |
| 9 | cosmétique | « + 1 et + 2 » n'a pas de leçon non plus (écart 6.9). | Ajouté. |
| 10 | cosmétique | Le tableau des formes « à l'échauffement » ne vaut que pour la part de questions à trou ; il vaut aussi au défi. | Précisé. |
| 11 | cosmétique | La tolérance propre à chaque cran ne vaut qu'avec « choisir ». | Précisé. |
| 12 | cosmétique | « Erreur corrigée » a deux sens (voiliers : réussi au deuxième essai). | Le second sens est signalé en section 9. |
| 13 | cosmétique | Plusieurs petites imprécisions : étoile « dépassé » aussi aux voiliers ; exemple guidé des voiliers sans étoile ; premier record seulement avec un score non nul ; au mur, C2 rejoue le poisson ; « je ne sais pas » au mur ; « deux séances n'ouvrent jamais deux familles » trop absolu. | Toutes corrigées. |
| 14 | cosmétique (langue) | Des parenthèses racontent l'historique (« cette ligne disait… », « la phrase disait… »), et la phrase de l'écart 4.2 est lourde. | Allégées : l'historique est dans `docs/JOURNAL-CONCEPTION.md`. Les noms de réglages restent : la spécification renvoie au fichier de contenu qui fait foi. |

## Liste de contrôle de la fiche (après traitement)

- **23 écarts « Spéc. datée »** : tous reportés. Les écarts 2.2 et 7.4 ont été rectifiés d'après les constats 4 et 6.
- **7 correctifs, écrits comme règles** : tous reportés. Les écarts 4.2 et 6.9 ont été complétés d'après les constats 2 et 9.
- **Questions tranchées** : reportées. L'écart 11.1 est réécrit d'après le constat 1, et sa question est reposée au parent.
- **24 comportements** : tous reportés. Le n° 5 (l'ordre de la rotation) est rectifié.
- **Ligne en tête de `docs/ECARTS-SPEC.md`** : faite. La question 2 de la demande de fusion #34 dépend du constat 1.

## Non vérifié par le relecteur

L'ordre complet de la récompense, l'attente après 5 codes faux, l'historique et le « trésor » de l'espace parent. Pour ces points, il a seulement constaté que les phrases et les délais existent dans le code.
