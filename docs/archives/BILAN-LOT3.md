# Bilan du lot 3 — choisir l'exercice et le niveau, difficulté dans le niveau, calcul rapide, pause complète, récif par zones

Lot décidé le 27 septembre 2026 au soir, après les premiers essais du lot 2 par le parent (spécification : `docs/archives/SPEC-LOT3.md`, qui prévaut sur les précédentes ; prompt : `docs/archives/PROMPT-LOT3.md`). Cinq étapes, en deux demandes de fusion : étapes 1 à 4 (PR #19, fusionnée), étape 5 élargie par les décisions du parent du 28 septembre (PR #20). Le détail de chaque étape (décisions prises, écarts, recettes allégées) est dans `docs/AVANCEMENT.md`.

## Ce qui est fait

| Étape | Contenu | Demande de fusion |
| --- | --- | --- |
| 1 | Accueil « choisir » : l'exercice et le niveau (ligne 1 à 13, familles 1 à 7, leçons), tout accessible ; l'exercice choisi est la séance du jour ; échauffement passable (bouton) et réglage « Échauffement : oui / non » ; leçons cohérentes avec l'exercice (suppression de `leconSiPasVue`, 80 % des questions sur la famille) ; maison des nombres entière ; contrôle automatique des bords des sprites | #19 |
| 2 | La difficulté à l'intérieur du niveau choisi (ligne : 13 niveaux × 4 crans ; additions : 4 crans) ; outil des sauvegardes de test (un mois, trois mois, en difficulté) | #19 |
| 3 | Atelier du calcul rapide : le mur de corail, le petit poisson jaune, les cailloux et les ponts du chemin, les pictogrammes et les neuf plaques de niveaux | #19 |
| 4 | Module 3, calcul rapide : 9 niveaux générés au hasard, chemin des ponts, erreurs C1 à C5, déroulé d'un nouveau niveau, leçons L7 à L9, crans, rotation de « jouer » entre les trois exercices, espace parent ; recette complète des étapes 1 à 4 | #19 |
| 5 | Décisions du 28 septembre (validation simple, voix à 80 Mo et calculs élargis, `ermite.repos` inchangé), accueil complet pendant une pause, récif en pages par zone, voix des cartes une seule fois, erreur « reading '0' » trouvée et corrigée, ce bilan, guide du parent relu, recette | #20 |

### Pour l'enfant, étape par étape

- **Étape 1.** Une quatrième bulle à l'accueil, **choisir** : elle choisit elle-même l'exercice (la tortue, le « + », le mur de corail, le livre des leçons) puis le niveau, avec un petit dessin par niveau, une lueur sur celui qui est conseillé et une petite étoile sur ceux qu'elle a réussis. L'exercice choisi est la vraie séance du soir, avec ses étoiles. Elle peut **passer l'échauffement** avec les deux triangles jaunes. Les leçons parlent enfin de ce qu'elle va faire (plus de leçon des doubles avant des « + 1 »). La maison des nombres est entière.
- **Étape 2.** Quand elle a choisi son niveau, les vagues du début rendent **ce même niveau** plus facile (un repère de plus, l'aide d'emblée) ou plus exigeant (moins de repères, des additions à trou), sans changer de niveau.
- **Étapes 3 et 4.** Un **troisième exercice, le calcul rapide** : 47 + 2, 34 + 10, 38 + 5, 42 − 5… Un mur de corail où le petit poisson descend d'une rangée pour « plus dix », un chemin de cailloux et de ponts (38, « + 2 », 40, « + 3 », 43) ; une leçon animée à l'entrée des niveaux 2, 6 et 7 (L7, L8, L9), trois calculs guidés où elle tape chaque caillou, puis le chemin au coquillage. Une réponse juste mais lente n'est jamais reprochée : « Bravo ! Regarde le raccourci. »
- **Étape 5.**
  - *Choisir en un toucher* : l'image s'entoure d'or, la voix dit son nom, et l'écran suivant arrive (3 touchers de l'accueil au choix de la difficulté).
  - *Des calculs plus variés* : tous les calculs utiles de chaque niveau (68 − 20, 23 + 14, 99 − 90…), 3 762 au lieu de 1 498.
  - *La maison ne mène plus à une impasse* : pendant la séance, elle ouvre l'accueil complet : **continuer** (reprise exacte), **choisir** (un autre exercice, ou une leçon), le récif et l'album, puis retour.
  - *Le récif par zones* : on glisse le doigt pour changer de zone ; les créatures et le décor suivent le doigt ; de petites perles en bas. Aujourd'hui une seule zone (le lagon) : un petit rebond.
  - *Les cartes en grand* ne répètent plus leur texte à chaque retournement : la voix le dit une fois, à l'ouverture.

### Pour le parent

- **Étape 1.** Le réglage « Échauffement : oui / non » ; dans **Séances**, l'exercice choisi par l'enfant, l'échauffement passé, les leçons choisies seules ; une colonne « exercice choisi » dans l'export.
- **Étape 2.** Les sauvegardes de test (`node tools/sauvegarde-test.mjs`), à restaurer pour voir l'application après un mois, trois mois, ou avec une enfant en difficulté ; mode d'emploi et avertissement dans le guide.
- **Étape 4.** Le bloc **Module 3 · Calcul rapide** (niveau conseillé, niveaux acquis, courbes), les erreurs C1 à C5 dans le journal, le point de départ du calcul rapide, « calcul rapide » dans la notion du jour de la prochaine séance.
- **Étape 5.** La raison d'une séance interrompue (« autre exercice choisi par l'enfant », ou terminée par vous) dans **Séances** et dans l'export ; « échauffement pas refait » quand il avait déjà été fait ce jour-là ; l'encadré **Incidents techniques** (s'il y en a) en bas de **Données et réglages** ; le guide relu pour tout le lot 3.

## Les décisions prises (et pourquoi)

Décisions du parent : voir `docs/archives/SPEC-LOT3.md` (sections 1 à 6, et section 8 pour celles du 28 septembre) et `docs/JOURNAL-CONCEPTION.md`. Décisions prises pendant la réalisation, quand la SPEC ne tranchait pas (détail et raisons dans `docs/AVANCEMENT.md`) :

| Sujet | Décision |
| --- | --- |
| Niveau 1 de la ligne, « plus facile » | 2 propositions (le niveau 1 en a déjà 3), et la tortue fait le premier saut |
| Protection au niveau choisi | elle redescend le cran (les repères reviennent), jamais le niveau |
| Tableau de la dictée | les images de la leçon L10 (chalut, filet, poisson) au lieu des lettres c, d, u |
| 80 % sur la famille | un fait d'une petite famille peut revenir plus de 3 fois (jamais deux fois de suite) |
| Leçon choisie seule | notée vue, 3 étoiles une fois par leçon et par jour, rangée comme une séance « libre » |
| Calcul rapide, supports | le mur pour les niveaux ± 10 (2, 3, 6, 8), le chemin pour les autres ; le chemin sert aussi d'aide et de calcul guidé |
| Calcul rapide, déblocage | « en boîte 2 ou plus » = 80 % des faits de la famille ; un niveau débloqué le reste |
| Calcul rapide, C2 | temps de base = celui des additions (mesuré à l'échauffement) |
| Rotation de « jouer » | parmi les exercices qui n'étaient pas celui de la dernière séance, le moins avancé |
| Calcul rapide, pas de redescente de niveau | ses niveaux ne forment pas une échelle unique ; la difficulté persistante relance la leçon, puis un calcul plus simple |
| Bornes élargies (28 septembre) | tout le domaine de chaque procédure sur le mur de 1 à 100 ; les listes de seconds nombres des niveaux 4, 5, 7 et 9 (2 à 7, 3 à 8) gardées : ce sont des choix pédagogiques, pas des bornes de voix |
| Chemin du niveau 8 | les dizaines d'un seul pont, puis les unités (23 + 34 → + 30 → 53 → + 4 → 57) ; au niveau 3, un pont par dizaine (jusqu'à 9 ponts) |
| Validation simple | le nom est dit jusqu'au bout avant la consigne suivante ; les consignes de l'écran ne disent plus « touche-la encore » |
| Échauffement « fait ou passé » | compté dès que son étape s'est terminée (toutes ses questions, le temps, ou « passer ») ; interrompu au milieu, il est refait |
| Pause : porte d'activité | ce qui avance sans l'horloge (sauts de la tortue, gestes, chargements) attend la reprise ; trouvé par le parcours de la pause (une phrase de leçon avançait pendant une visite) |
| Récif : perles | une perle de page dessinée dans l'atelier (`recif.perle`, planche « petits ») plutôt que celle de l'album (qui aurait chargé 34 Mo) ; la rangée n'apparaît qu'à partir de deux pages |
| Récif : ce qui suit le doigt | le fond, les algues, les poissons, les créatures, les cadeaux ; la pieuvre reste, en guide |
| Récif : page d'entrée | la zone de la dernière carte gagnée, doublons compris (date `derniere`, nouvelle) |

## Écarts avec la spécification

| SPEC | Ce qui est fait | Raison |
| --- | --- | --- |
| SPEC-LOT3, section 2 : « toucher deux fois ou la coche valide » | validation simple (un toucher) | décision du parent du 28 septembre (la section 7 demandait 3 touchers) |
| SPEC, module 3 : « Dauphin » guide du calcul rapide | pas de dauphin : la tortue et le petit poisson du mur | décision du parent (SPEC-LOT3, section 5) |
| SPEC, module 3 : bornes des calculs | lot 3, étape 4 : bornes resserrées (voix sous 40 Mo) ; étape 5 : élargies (voix 50,96 Mo, plafond 80 Mo) | décision du parent du 28 septembre |
| SPEC, « Navigation » : « on ne choisit pas l'activité pendant la séance » | remplacé : choisir dès l'accueil, et depuis la pause | SPEC-LOT3, section 2, et décision du 28 septembre |
| SPEC, « Le récif » : quatre zones | quatre pages prévues ; une seule aujourd'hui (le lagon) | les créatures animées des zones 2 à 4 viennent au lot 4 |
| Récif : « perles dans l'esprit de l'album » | une perle de page nouvelle, de la même main | mémoire (voir plus haut) |

## Recette

### Recette complète des étapes 1 à 4 (28 septembre 2026, reprise de `docs/AVANCEMENT.md`)

| Critère | Mesure | |
| --- | --- | --- |
| Tests unitaires | `npm test` : 199 tests, tous passent | ✓ |
| Choisir un exercice et un niveau | 3 choix ; 5 touchers en validation « double » (3 en « simple », retenu le 28 septembre) ; parcours pour la ligne (niveau 8 dès une base vide), les additions (famille 5 pas encore ouverte), le calcul rapide (niveaux 2 et 7), les leçons | ✓ |
| L'exercice choisi est celui joué | 100 % des questions au niveau choisi ; additions : au moins 80 % sur la famille (minimum 80 % sur tous les profils) | ✓ |
| Leçon et exercice cohérents | aucune leçon de famille pour une autre famille ; après L4, 80 à 100 % de doubles ou presque-doubles | ✓ |
| Échauffement passé | la notion du jour commence 307 ms après « passer » ; « Échauffement : non » : ni échauffement ni pictogramme | ✓ |
| Difficulté dans le niveau | 52 captures (13 niveaux × 4 crans) conformes ; réussite simulée plus basse à « très dur » qu'à « plus facile » (ligne niveau 5 : 78 contre 86 % ; niveau 8 : 78 contre 87 % ; additions : 81 contre 90 %) | ✓ |
| Maison des nombres et bords des sprites | seuil entier en @1x et @2x ; `bords.test.mjs` passe (11 exceptions justifiées) | ✓ |
| Sauvegardes de test | un mois, trois mois, en difficulté : restaurées sans erreur, écrans cohérents | ✓ |
| Calcul rapide | 9 niveaux jouables ; C1 à C5 ; L7 à L9 ; séance de calcul rapide 8,7 min sans défi, 10,6 min avec le défi ; 44 calculs en 6 min | ✓ |
| Durée d'une séance « jouer » | 8,9 min (première séance, ligne, sans défi) | ✓ |
| Attente sans commande | hors voix, 1,0 s au plus partout | ✓ |
| Simulation sur l'année | 60 cartes avant le 18 juin 2027 partout ; quota jamais dépassé ; jamais deux fois de suite le même module ; calcul rapide : « reel » 9 niveaux vers la 22e séance, « en difficulté » 4 à 7 niveaux | ✓ |
| Parcours Playwright | 20 parcours : tous passent ; une erreur de page vue une fois dans `seance.mjs` (voir l'étape 5) | ✓ |

### Recette de l'étape 5 (28 septembre 2026)

Recette ciblée (la recette complète du 28 septembre, ci-dessus, n'est pas refaite). Voix réelle pour les séances à vitesse réelle, Chromium, 1280 × 800.

| Critère | Mesure | État |
| --- | --- | --- |
| Tests unitaires | `npm test` : 210 tests, tous passent (nouveaux : voix des cartes, erreur « reading '0' », pages du récif, chemin et bornes du calcul rapide) ; `precache.mjs --check` à jour | tenu |
| Voix | 39,70 Mo avant, **50,95 Mo** après (8 382 fichiers ; plafond 80 Mo, lot 3 sous 60 Mo) | tenu |
| Choisir en 3 touchers | `choix.mjs` : 3 touchers de l'accueil au sélecteur (choisir, exercice, niveau) ; tout le parcours passe | tenu |
| Erreur « reading '0' » | cause trouvée (temps d'animation qui recule, indice d'image négatif) et reproduite par un test ; `seance.mjs` ×3 et `centaines.mjs` ×3 : aucune erreur | tenu |
| Accueil complet pendant une pause | `pause.mjs` : depuis l'échauffement, la ligne, les additions, le calcul rapide, une leçon et le défi, récif (une carte ouverte) puis album puis reprise exacte (même question, même consigne, même phrase de leçon ; calques, acteurs et planches identiques ; temps de visite compté comme pause) ; choisir sans valider, une leçon depuis la pause, un autre exercice (séance interrompue avec sa raison, étoiles gardées, échauffement non refait, raison visible dans l'espace parent) : tout est bon | tenu |
| Récif en pages | `recif-pages.mjs` : une page aujourd'hui (rebond, toucher ou glisser) ; zone de test : entrée sur la dernière zone, glisser et calage (tiers de l'écran, geste rapide), retour, rebond, créature touchée pendant et après le calage, perles, planches libérées : tout est bon | tenu |
| Mémoire | planches décodées (densité 2) : récif, une zone 43,8 Mo, **deux zones 87,6 Mo** ; `perf.mjs` : 180,6 Mo en pause, **224,4 Mo** avec le récif ouvert en pause, 180,6 Mo après le retour | tenu (à confirmer sur la tablette) |
| Voix des cartes | test unitaire ; `recompenses.mjs` et `cartes.mjs` : aucune phrase dite au retournement, dans le récif comme dans l'album | tenu |
| Parcours qui passent par la maison, l'accueil, le récif ou l'album | `ergonomie`, `pause-parent`, `recompenses`, `cartes`, `choix` : tout est bon | tenu |
| Simulation du module 3 (bornes élargies, sur l'année) | « reel » : 9 niveaux acquis à la 22e séance (2 par semaine) et à la 20e (5 par semaine), comme avant ; « sait » : à la 9e ; « en difficulté » : 4 niveaux (2 par semaine), 7 (5 par semaine), comme avant ; durée simulée des séances de calcul rapide 9,2 à 10,3 min ; jamais deux fois de suite le même exercice ; 60 cartes le 15 ou le 17 juin 2027, quota jamais dépassé | tenu |
| Séance de calcul rapide à vitesse réelle | `recette.mjs --delai 4.5 --module 3` (première séance, sans défi) : **8 min 35 s** (accueil 10 s, échauffement 1 min 16 s, calcul rapide 6 min 04 s, récompense 1 min) ; 8,7 min avant l'élargissement ; aucune erreur | tenu |
| Attente sans commande | `recette-durees.mjs --passer` : hors voix, **1,0 s au plus** partout (ligne 1 à 13, familles 1 à 6, calcul rapide 1, 2, 6, 7, 9, aides) | tenu |
| Performance | `perf.mjs` (processeur ÷ 4, densité 2) : démarrage 1,8 s à froid, 2,0 s à chaud ; image moyenne 18,4 ms (allègement au niveau 2 sur cette machine), 18,1 ms pendant la visite du récif en pause ; aucune erreur | tenu |
| Captures | écrans nouveaux ou modifiés regardés : accueil en pause, récif et album en pause, leçon depuis la pause, reprises, espace parent (raison), récif (rebond, glisser vers la page voisine, perles), chemins longs (99 − 90, 10 + 80, 23 + 34), écran « choisir » | — |

Remarque : lancé d'un seul tenant, `pause.mjs` a une fois dépassé 15 minutes sans rien écrire (sortie filtrée) ; scénario par scénario (`--seul`), chacun passe en 12 à 22 s. La cause n'a pas été cherchée plus loin : à regarder si le parcours doit tourner d'un bloc.

## Points à observer

- **Profil « en difficulté » : L8 revue à plusieurs séances.** En simulation, la difficulté persistante au niveau 6 (+ 9) relance la leçon L8 (au plus une fois par séance), et cela revient d'une séance de calcul rapide à l'autre. À observer avec l'enfant : si L8 revient trop, « passer » l'arrête, et le point de départ (espace parent) peut placer le calcul rapide plus bas ou plus haut.
- **Le calcul rapide revient rarement chez une enfant rapide.** La rotation de « jouer » prend l'exercice le moins avancé ; une enfant qui acquiert vite les 9 niveaux voit ensuite surtout la ligne et les additions (le calcul rapide ne revient qu'en révision du plus haut niveau acquis). « choisir » et le module imposé du parent permettent d'y revenir.
- **Durée avec le défi au calcul rapide : 10,6 min**, dans la fourchette haute ; avec les calculs plus longs du niveau 3 (jusqu'à 9 ponts dans une correction), une séance peut s'allonger : à mesurer avec l'enfant.
- **Le niveau 3 élargi** : une correction de « 23 + 70 » montre sept descentes de rangée ; trois calculs guidés d'un nouveau niveau peuvent demander jusqu'à 9 cailloux.
- **La pause** : l'enfant peut maintenant choisir un autre exercice depuis la pause ; si cela devient une façon d'éviter ce qui est difficile, l'historique le montre (« autre exercice choisi par l'enfant »).
- **L'échauffement passé** souvent ralentit la révision espacée (guide du parent, partie d bis).

## Textes nouveaux à valider à l'écoute

Aucune phrase n'a été écoutée par une personne ; la voix est fabriquée par Piper (voix siwis).

- **Écran « choisir »** : « Qu'est-ce que tu veux faire ? Touche une bulle. », « Choisis ! Touche une image pour commencer. », « Quelle leçon veux-tu regarder ? Touche-la. » (réécrites à l'étape 5 pour la validation simple) ; les noms des exercices (« La ligne des nombres. », « Les additions. », « Le calcul rapide. », « Les leçons. »), des 13 niveaux de la ligne, des 7 familles, des 10 leçons et des 9 niveaux du calcul rapide (« Plus un, plus deux, moins un, moins deux. », « Ajouter deux grands nombres. »…).
- **Presque-doubles** : « 3 plus 4, c'est 3 plus 3, et encore 1. »
- **Calcul rapide** : les consignes (« 47 plus 2 ? » ; forme à trou : « 38 plus combien ? Ça fait 43. »), les ponts (« Plus 2. », « Moins 10. », et, depuis l'étape 5, « Plus 20. » à « Plus 80. »), « Suis le chemin : tape le nombre de chaque caillou. », « Bravo ! Regarde le raccourci. », les erreurs C1 à C5 (« Quand on ajoute dix, seules les dizaines changent. On descend d'une rangée. », « 8 plus 5 dépasse dix : on passe à la dizaine suivante. »…), l'annonce (« Maintenant, le calcul rapide, avec le petit poisson du mur de corail ! »).
- **Leçons L7, L8, L9** (textes de `docs/SPEC.md`).
- **Étape 5** : 2 230 calculs nouveaux (même gabarit, nombres nouveaux) ; à écouter en particulier les grands nombres (« 99 moins 90 ? », « 11 plus 88 ? »).

## Ce qui reste à vérifier sur la tablette

- **Écouter** les textes ci-dessus.
- **Choisir en un toucher** : que l'enfant ne valide pas par erreur (un toucher suffit maintenant) ; qu'elle entende bien le nom avant l'écran suivant.
- **La maison pendant la séance** : l'accueil en pause, la visite du récif ou de l'album, puis « continuer » ; choisir un autre exercice (séance interrompue, raison dans l'historique).
- **Le récif** : le petit rebond quand on glisse (une seule zone aujourd'hui) ; qu'un toucher sur une créature ouvre bien sa carte sans être pris pour un glisser.
- **La carte en grand** : la voix une seule fois ; le retournement sans voix.
- **Fluidité et mémoire** : 224 Mo de planches décodées avec le récif ouvert pendant une pause (mesure sur ordinateur, densité 2) ; 51 Mo de voix à télécharger la première fois.
- La durée réelle d'une séance de calcul rapide et du défi.

## Reste ouvert

Illustrations et anecdotes du grand large (avant début février) et des abysses (avant fin avril) ; les créatures animées et les décors des zones 2 à 4 du récif (lot 4 : il suffira de les dessiner et de leur donner une place dans `cartes.json`) ; les problèmes (module 4) et les bilans périodiques ; le raccord de la boucle `ermite.repos` (laissé tel quel, décision du 28 septembre) ; la cause exacte du temps d'image qui recule (hypothèse, voir « Décisions prises (étape 5) » dans `docs/AVANCEMENT.md`) : le journal des incidents dira si l'erreur, désormais gardée, se reproduit.
