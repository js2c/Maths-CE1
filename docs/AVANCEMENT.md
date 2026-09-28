# Avancement

Tenu à jour à chaque étape (un commit par étape). Pour reprendre le travail dans une nouvelle session : lire ce fichier, puis `CLAUDE.md`, `docs/SPEC.md` et `docs/ARCHITECTURE.md`.

## Lot 3

Spécification : `docs/SPEC-LOT3.md` (prévaut sur `docs/SPEC.md`, `docs/SPEC-LOT2.md` et `docs/SPEC-COMPLEMENTS.md`) ; prompt : `docs/PROMPT-LOT3.md`. Deux parties : A (étapes 1 et 2, correctif du lot 2), B (étapes 3 à 5, calcul rapide).

**Où en est-on (28 septembre 2026)** : lot 2 terminé et fusionné (PR #17). **Étapes 1 à 4 du lot 3 faites** (branche `claude/laughing-ritchie-cp777i`, https://github.com/js2c/Maths-CE1/pull/19), recette complète faite ; reste l'étape 5 (bilan du lot 3) et l'essai sur la tablette.

| Étape | Partie | Contenu | État |
| --- | --- | --- | --- |
| 1 | A | Accueil « choisir » : exercice et niveau (ligne 1 à 13, familles 1 à 7, leçons), exercice choisi = séance du jour ; échauffement passable et réglage ; leçons cohérentes (suppression de `leconSiPasVue`, 80 % sur la famille) ; maison des nombres ; test des bords des sprites | fait (branche `claude/laughing-ritchie-cp777i`, https://github.com/js2c/Maths-CE1/pull/19) |
| 2 | A | Difficulté à l'intérieur du niveau (ligne graduée, 13 niveaux × 4 crans ; additions) ; outil de sauvegardes de test ; guide du parent ; recette complète de la partie A | fait (même branche ; recette complète faite avec celle de l'étape 4, les étapes 1 à 4 étant enchaînées) |
| 3 | B | Atelier : mur de corail, poisson sur le mur, ponts du chemin, pictogramme du calcul rapide pour l'écran de choix | fait (même branche) |
| 4 | B | Module 3 : niveaux 1 à 9, générateurs, erreurs C1 à C5, déroulé d'un nouveau niveau, leçons L7 à L9, crans, choix du niveau, rotation dans « jouer », espace parent | fait (même branche ; recette complète des étapes 1 à 4 faite) |
| 5 | B | Bilan : `docs/BILAN-LOT3.md`, guide du parent, recette complète sur l'année | à faire |

### Reprise de l'étape 5 du lot 3

Pour reprendre si la session s'est arrêtée : branche `claude/intelligent-hawking-xwz6hw` (nom imposé par l'environnement), demande de fusion en brouillon « Lot 3, étape 5 (en cours) ». L'étape 5 est élargie par la demande du parent du 28 septembre (neuf sous-parties : décisions du 28 septembre, accueil complet pendant une pause, récif en pages, voix des cartes, erreur « reading '0' », bilan, guide du parent, recette, clôture).

**Sous-partie en cours :** 2 (accueil complet pendant une pause).

**Fait :**

- 1. Décisions du 28 septembre : validation « simple » (`seance.json`, `choice.js` : le nom est dit jusqu'au bout, la consigne suivante attend ; `choix.mjs` vérifie 3 touchers de l'accueil au sélecteur ; parcours `calcul`, `ergonomie`, `sauvegardes` adaptés) ; plafond de la voix 80 Mo (`voix.test.mjs`, SPEC) ; bornes du module 3 élargies (`module3.json` : 1 498 → 3 762 calculs ; niveau 1 : 10 à 99 ; 2 : 1 à 99 ; 3 : 10 à 99, ± 20 à ± 90 ; 4 : 11 à 98 ; 5 : 12 à 99 ; 6 : 11 à 89 ; 7 : 11 à 89 ; 8 : 11 à 88 et tous les seconds nombres à deux chiffres sans retenue ; 9 : 11 à 99) ; voix : **39,70 Mo avant, 50,96 Mo après** (2 230 phrases fabriquées) ; chemin du niveau 8 en deux ponts (dizaines, puis unités) ; long chemin décalé pour tenir à l'écran (captures regardées : 99 − 90, 10 + 80, 23 + 34) ; `ermite.repos` non touché ; SPEC-LOT3 (section 8), JOURNAL-CONCEPTION, ARCHITECTURE, SPEC.
- 4 (fait en avance). La voix des cartes en grand : une seule fois, à l'ouverture (`cards.js`, `cardLine`) ; test `tests/unit/carte-voix.test.mjs` ; contrôles ajoutés dans `recompenses.mjs` et `cartes.mjs`.
- 5 (fait en avance). Erreur « reading '0' » : cause trouvée par lecture du code (voir « Décisions prises (étape 5) ») ; corrigée (`stage.js`, `turtle.js`, `sprites.js` : `frameIndex`) avec le test `tests/unit/erreur-image.test.mjs`, qui reproduit le message avant la correction ; journal des incidents techniques (console et espace parent).

**Reste :** 2, 3, 6 à 9 ; vérifier 4 dans `recompenses.mjs` et `cartes.mjs` (recette).

**Décisions prises (étape 5) :**

- *Validation simple* : le toucher entoure l'image, dit son nom et valide 0,3 s plus tard ; le nom n'est plus coupé par la consigne suivante (elle attend dans la file de la voix).
- *Bornes du calcul rapide* : les listes de seconds nombres des niveaux 4, 5, 7 et 9 (2 à 7, 3 à 8) sont gardées : ce sont des choix pédagogiques (le niveau 1 couvre ± 1 et ± 2, le niveau 6 couvre + 9), pas des bornes de voix. Au niveau 3, un pont par dizaine : jusqu'à 9 ponts (99 − 90), donc une correction plus longue sur le mur (à observer).
- *Erreur « Cannot read properties of undefined (reading '0') »* : les images des boucles sont choisies d'après le temps de l'animation ; la tortue calcule `path[Math.floor(u)]` pendant un saut et `Math.floor((t - t0) * 12) % n` au repos ; si l'horodatage d'une image (requestAnimationFrame) est plus ancien que le précédent, l'indice devient négatif, `path[-1]` ou `rects[-1]` vaut undefined et `p0[0]` ou `q[0]` lève exactement ce message. La tortue est présente dans les deux parcours où l'erreur a été vue (ligne graduée). Le test reproduit le message avec un temps qui recule de 30 ms. Le déclencheur (un horodatage non monotone sous la charge de Chromium sans écran) est une hypothèse vraisemblable, pas observée directement. Corrections : temps monotone dans la boucle de la scène et dans la tortue, indice d'image ramené dans la boucle (`frameIndex`), et, si une image manque quand même, une garde qui journalise au lieu de planter (`Sprites.onMissing`). Toute erreur de page est aussi notée (réglage `journalErreurs`, les 20 dernières, avec l'écran et l'étape) et montrée dans l'espace parent, « Données et réglages », « Incidents techniques » (rien n'est affiché s'il n'y en a pas).

### Reprise des étapes 1 à 4 du lot 3

Pour reprendre si la session s'est arrêtée : branche `claude/laughing-ritchie-cp777i`, demande de fusion en brouillon « Lot 3, étapes 1 à 4 (en cours) ».

**Étape en cours :** aucune ; étapes 1 à 4 terminées, demande de fusion prête. Prochaine : l'étape 5 (bilan).

**Fait :**

- Étape 1 : écran « choisir » (`js/session/choice.js`, planche « choix » de l'atelier, `sea/choice.ts`) ; exercice choisi = séance du jour (`Session({ choix })`, `Module1Runner({ choix })`, `Module2Runner({ choix })`) ; leçon choisie seule ; « Encore ! » ouvre le même écran sans étoiles ; « passer » l'échauffement et réglage parent « Échauffement : oui / non » ; `leconSiPasVue` supprimée (`leconSiJamaisVue` : L6 pour les maisons de 8 et 9, L4 pour les presque-doubles), 80 % sur la famille, rappel du double ; maison des nombres ; contrôle des bords des sprites (`bords` dans l'atlas, `tests/unit/bords.test.mjs`) et six sprites corrigés ; voix des phrases nouvelles ; tests `choix.test.mjs`, `bords.test.mjs`, parcours `tests/e2e/choix.mjs`.

- Étape 2 : crans à l'intérieur du niveau choisi (`module1.json`, un bloc `crans` par niveau, `applyCran` ; additions : `module2.json`, `notion.cransChoix`) ; « plus facile » consolide sans faire progresser ; captures des 13 niveaux × 4 crans (`tests/e2e/crans.mjs`) ; voix des nombres nouveaux (niveau 11 très dur : 30 graduations) ; simulation par cran (`--choix`, `--cran`) ; outil `tools/sauvegarde-test.mjs` et contrôle `tests/e2e/sauvegardes.mjs` ; guide du parent (section d bis).

- Étape 3 : le mur de corail, les cailloux et les ponts dessinés en direct (`runtime.ts`), le petit poisson jaune (12 images, boucle sans raccord : écart au raccord 10,5 pour 10,5 entre images voisines), les pictogrammes (écran « choisir », frise) et les neuf plaques de niveaux ; planche spécimen regardée ; export complet reproductible.

- Étape 4 : le calcul rapide (`content/module3.json`, `modules/calc/` : calc.js, runner.js, screen.js, wallfish.js) : 9 niveaux générés au hasard selon leurs paramètres, chemin des ponts, erreurs C1 à C5, niveau conseillé et déblocage (définitif), déroulé d'un nouveau niveau (leçon, 3 calculs guidés pont par pont, chemin au coquillage), crans dans le niveau, leçons L7 à L9 (scènes « mur » et « ligne » du lecteur des leçons), écran « choisir » (exercice « calcul », 9 plaques), entraînement libre, rotation de « jouer » entre les trois modules (le moins maîtrisé d'abord), espace parent (bloc Calcul rapide, C1 à C5 au journal, point de départ, module imposé, export), voix (1 571 calculs, 39,7 Mo en tout), simulation, parcours `tests/e2e/calcul.mjs`, recette des durées.

**Reste :** l'étape 5 (bilan, dans une autre session) ; l'essai sur la tablette.

**Recette complète (étapes 1 à 4, 28 septembre 2026) :**

| Critère | Mesure | |
| --- | --- | --- |
| Tests unitaires | `npm test` : 199 tests, tous passent | ✓ |
| Choisir un exercice et un niveau | écran « choisir » : 3 choix (choisir, exercice, niveau), 5 touchers avec la validation « double » (question ouverte ; « simple » : 3 touchers) ; parcours pour la ligne (niveau 8 dès une base vide), les additions (famille 5 pas encore ouverte), le calcul rapide (niveaux 2 et 7), les leçons | ✓ (sauf le compte des touchers, question ouverte) |
| L'exercice choisi est celui joué | 100 % des questions au niveau choisi (ligne : 4 sur 4 au niveau 8 ; calcul : tests unitaires et parcours) ; additions : au moins 80 % sur la famille (simulation : minimum 80 % sur tous les profils) | ✓ |
| Leçon et exercice cohérents | simulation sur l'année, 5 profils × 2 rythmes : aucune leçon de famille jouée pour une autre famille ; après L4, 80 à 100 % de doubles ou presque-doubles | ✓ |
| Échauffement passé | la notion du jour commence 307 ms après « passer » ; « Échauffement : non » : ni échauffement ni pictogramme | ✓ |
| Difficulté dans le niveau | 52 captures (13 niveaux × 4 crans) regardées, conformes au tableau ; réussite simulée plus basse à « très dur » qu'à « plus facile » (ligne niveau 5 : 78 contre 86 % ; niveau 8 : 78 contre 87 % ; additions : 81 contre 90 %) | ✓ |
| Maison des nombres et bords des sprites | seuil entier en @1x et @2x, en pierre gris-bleu ; `bords.test.mjs` passe (11 exceptions justifiées) | ✓ |
| Sauvegardes de test | un mois, trois mois, en difficulté : restaurées sans erreur, accueil, album, écran « choisir », espace parent cohérents | ✓ |
| Calcul rapide | 9 niveaux jouables, générés au hasard ; C1 à C5 reconnues (tests, parcours : C1, C4) ; L7 à L9 ; séance de calcul rapide (`recette.mjs --delai 4.5 --module 3`) : 8,7 min sans défi (première séance), **10,6 min avec le défi record** ; 44 calculs en 6 min | ✓ |
| Durée d'une séance « jouer » | `recette.mjs --delai 4.5` (première séance, ligne, sans défi) : 8,9 min | ✓ (le défi, dès la 5e séance, ajoute 1 à 2 min) |
| Attente sans commande | `recette-durees.mjs` avec et sans `--passer` : hors voix, 1,0 s au plus partout (ligne, additions, aides, calcul rapide) ; avec voix, les consignes et phrases d'entrée | ✓ |
| Simulation sur l'année | 5 profils, 2 et 5 séances par semaine : 60 cartes avant le 18 juin 2027 partout, quota jamais dépassé, jamais deux fois de suite le même module ; calcul rapide : profil « reel » 9 niveaux acquis vers la 22e séance, « en difficulté » 4 niveaux (2/sem) à 7 (5/sem), durée simulée 9 à 10,3 min | ✓ |
| Parcours Playwright | 20 parcours, un par un : tous passent ; `seance.mjs` a montré une fois une erreur de page (« Cannot read properties of undefined (reading '0') »), jamais reproduite en 4 relances (voir les questions ouvertes) | ✓ (1 erreur non reproduite) |

**Décisions prises (étape 4) :**

- *Bornes des calculs* : chaque calcul lu a son fichier son ; pour tenir sous le plafond de 40 Mo de voix, les premiers nombres sont bornés (par exemple ± 1, ± 2 entre 21 et 69 ; + 20, + 30 jusqu'à 59) : 1 571 calculs en tout. La forme à trou est dite en deux phrases (« 38 plus combien ? » « Ça fait 43. »), pour ne pas doubler les fichiers. **Question ouverte : élargir les bornes en relevant le plafond.**
- *Déblocage* : « maisons de 5 à 7 en boîte 2 ou plus » et « compléments à 10 en boîte 3 ou plus » = 80 % des faits de la règle de la famille ; un niveau débloqué le reste. Quand tout ce qui est débloqué est acquis, « jouer » révise le plus haut niveau acquis.
- *Supports* : le mur de corail pour les niveaux ± 10 (2, 3, 6, 8), le chemin (les ponts) pour les autres ; le chemin est aussi l'aide du coquillage et le support des calculs guidés.
- *Mélange des niveaux acquis* : une question sur cinq avec « jouer », une fois le déroulé du nouveau niveau passé ; jamais avec « choisir ».
- *C2* : le temps de base est celui des additions (mesuré à l'échauffement) ; au-delà de 8 s de plus : « Bravo ! Regarde le raccourci. », le chemin rejoué une fois (« passer » possible), la réponse notée C2 (juste), au journal du parent.
- *Rotation de « jouer »* : parmi les modules qui n'étaient pas la notion de la dernière séance, le moins maîtrisé (ligne : niveau / 13 ; additions : familles acquises / 7 ; calcul : niveaux acquis / 9), à égalité l'ordre de la rotation. Conséquence en simulation : une enfant rapide finit vite le calcul rapide, qui revient alors rarement.
- *Redescente* : pas de redescente de niveau au calcul rapide (ses niveaux ne sont pas une échelle unique) ; la difficulté persistante relance la leçon du niveau (une fois par séance) puis un calcul plus simple. En simulation, le profil « en difficulté » revoit L8 à plusieurs séances : à surveiller.

**Questions ouvertes (pour le parent) :** validation « double » ou « simple » de l'écran « choisir » ; bornes des calculs et plafond de la voix ; l'erreur de page vue une fois dans `seance.mjs` ; le raccord de la boucle `ermite.repos` (lot 2).

**Recette allégée de l'étape 2 :** `npm test` : 189 tests, tous passent. `node tests/e2e/crans.mjs` : 52 captures (13 niveaux × 4 crans) conformes au tableau de la SPEC, additions aux quatre crans (0, 0, 3 et 6 formes à trou sur 6) ; captures regardées (`tests/e2e/out/crans/`). `node tests/e2e/sauvegardes.mjs` : un mois, trois mois, en difficulté restaurés sans erreur, accueil, album, écran « choisir » et espace parent cohérents. Tous les parcours existants (aide-passer, cartes, centaines, defi, ergonomie, frise, lecons, notion2, parent, pause-parent, pwa, recompenses, selecteur, seance, voix) : tout est bon. Simulation, profil « reel », 10 séances en choisissant toujours le même exercice (réussite de la notion du jour, plus facile / conseillé / plus dur / très dur) : ligne niveau 5 : 86 / 81 / 82 / 78 % ; ligne niveau 8 : 87 / 86 / 85 / 78 % ; additions famille 4 : 90 / 84 / 83 / 81 % (hypothèse de l'effet d'un cran sur la ligne : `EFFET_CRAN` de `sim-recette.mjs` ; les protections redescendent le cran 4 à 9 fois en 10 séances aux crans au-dessus).

**Décisions prises (étape 2) :**

- *Niveau 1, « plus facile »* : la SPEC dit « 3 propositions au lieu de 4 », mais le niveau 1 en a déjà 3 (réglage validé du lot 1) : « plus facile » en donne 2, avec la tortue qui montre le premier saut (depuis zéro, avant la consigne, au format « lire »).
- *Protection* : au niveau choisi, elle redescend le cran (donc les repères reviennent), jamais le niveau, comme demandé.
- *Additions, « très dur »* : « les révisions prises dans toutes les familles » : c'était déjà le cas des révisions (les faits introduits de toutes les familles) ; la différence est que toutes les questions sont à trou.
- *Tableau de la dictée* : les trois colonnes ont l'image de la leçon L10 (le chalut, le filet, le poisson) au lieu des lettres c, d, u (l'enfant ne lit pas) ; les chiffres tapés s'y rangent depuis la droite.
- *Sauvegardes de test* : les séances tombent aux jours habituels (2 par semaine : lundi et jeudi ; 3 : lundi, mercredi, vendredi), sans tenir compte des vacances ; la dernière est la veille. Trois mois fabriqués en septembre commencent en juillet : les cartes, qui suivent le calendrier scolaire (quota), restent alors peu nombreuses (8 cartes pour 36 séances) ; c'est dit dans le guide du parent.

**Recette allégée de l'étape 1 :** `npm test` : 182 tests, tous passent. `node tests/e2e/choix.mjs` : tout est bon (niveau 8 dès une base vide, 100 % des questions au niveau 8 ; famille 5 ouverte par le choix ; leçon seule ; notion du jour 307 ms après « passer » ; « Échauffement : non » sans pictogramme ; « Encore ! »). `seance.mjs`, `ergonomie.mjs` (adapté : « Encore ! » ouvre l'écran « choisir »), `notion2.mjs`, `ermite.mjs` : tout est bon. Simulation sur l'année, 2 séances par semaine : part des questions sur la famille en cours au minimum 81 % (réel), 82 % (sait), 81 % (en difficulté), 80 % (très dur), 100 % (plus facile) ; aucune leçon de famille jouée pour une autre famille ; après L4, 91 % de doubles ou presque-doubles (sait). Captures regardées : `tests/e2e/out/choix/`, `tests/e2e/out/ermite/5-maison.png`.

**Décisions prises (étape 1) :**

- *Validation de l'écran de choix* : la SPEC dit « toucher deux fois ou la coche valide » (section 2) et « en 3 touchers au plus (choisir, exercice, niveau) » (section 7). Choix par défaut : la description de l'écran (validation « double » à chaque étape, pour une enfant qui ne lit pas : le premier toucher fait entendre le nom) ; mesuré : 5 touchers jusqu'au sélecteur (choisir, exercice ×2, niveau ×2), soit 3 choix. Réglage `seance.json`, `choix.validation` : « simple » donne 3 touchers. **Question ouverte pour le parent.**
- *Presque-doubles* : le rappel du double est dit avec la consigne des formes directes seulement (dans une forme à trou, il donnerait la réponse) ; ce n'est pas compté comme une aide (le fait peut monter de boîte) ; « avec l'appui double + 1 » est lu comme l'appui de la famille (coquillage, correction), déjà en place.
- *80 % sur la famille* : pour y parvenir avec une petite famille (5 doubles, 8 presque-doubles), un fait de la famille peut revenir plus de 3 fois (`memeFaitMax` ne vaut plus que pour les autres familles quand la famille est épuisée) ; jamais deux fois de suite. Avec « jouer » aux crans « plus dur » et « très dur », les faits que le cran ajoute (famille suivante, familles mêlées) passent dans les 20 % restants.
- *Passer l'échauffement* : le bouton est montré au début (consigne et première question), puis disparaît à la première réponse (la correction a son propre « passer » à la même place).
- *Leçon choisie seule* : notée vue (ou passée) dans l'état du module ; ses 3 étoiles une fois par leçon et par jour ; rangée dans l'historique comme une séance « libre » (« leçon choisie »), jamais la séance du jour.
- *Maison des nombres* : le seuil débordait parce que la courbe lissée à quatre points gonflait de 40 px de chaque côté ; redessiné avec des points près des coins, calque élargi, et en pierre gris-bleu (la marche de sable se perdait sur le sable).
- *Export de l'atelier* : un contrôle échoue depuis le lot 2 sur le raccord de la boucle `ermite.repos` (écart 31,1 pour 28,7 entre images voisines, seuil 1,05 ×) ; il n'était pas relevé parce que le bernard-l'ermite était exporté avec `--only ermite`. La SPEC du lot 3 demande de ne plus toucher au bernard-l'ermite : laissé tel quel, signalé.

## Lot 2

Spécification : `docs/SPEC-LOT2.md` (prévaut sur `docs/SPEC.md`) ; prompt : `docs/PROMPT-LOT2.md`. Une étape = une session = une demande de fusion vers `main`.

**Où en est-on (27 septembre 2026, soir)** : étapes 1 à 6 faites et fusionnées (PR #11, #13, #14, #16) ; **étapes 7 à 9 faites** sur la branche de la PR #17, avec les quatre corrections de la relecture extérieure (aide passable, fin de séance en pause par le parent, cran « plus facile » sans promotion, stagnation du module 2) ; bilan dans `docs/BILAN-LOT2.md`. **Lot 2 terminé** : reste à fusionner la PR #17 et à essayer sur la tablette. Décisions du parent du 27 septembre : brillantes à 20 % pour une carte nouvelle et 5 % pour un doublon, sans règle du 3e doublon ; cran « plus facile » : moteur inchangé, parade dans l'espace parent (`docs/GUIDE-PARENT.md`).

| Étape | Contenu | État |
| --- | --- | --- |
| 1 | Cartes et rythme : calendrier et quota, doublons, brillantes (20 % et effet), ouverture des zones, zone 2 (anecdotes et voix), étoiles dorées (4 semaines réussies), légendaires et coquillage doré, étoile arc-en-ciel de l'entraînement libre, surprise une séance sur cinq, ligne « Cartes » de l'espace parent ; simulation des cartes sur l'année | fait (branche `lot2-etape1`, https://github.com/js2c/Maths-CE1/pull/11) |
| 2 | Séance et progression : durées et nombres de questions, défi record activable, places réservées et voie rapide des faits, enchaînement des niveaux, leçon au plus une fois par séance, point de départ du parent, tortue devant la pieuvre, pieuvre qui montre la cible ; option `--delai` de la recette ; sélecteur de difficulté (4 crans) | fait (branche `claude/prompt-lot2-section-9xloz0`, https://github.com/js2c/Maths-CE1/pull/13) |
| 3 | Son, échantillons (`tools/son/`, `docs/son-echantillons/`) ; arrêt pour le choix du parent | fait (branche `claude/tender-volta-20rhlz`, https://github.com/js2c/Maths-CE1/pull/14) ; choix du parent reçu |
| 4 | Son, intégration : bruitages, musique, mixage, réglages du parent | fait (branche `claude/loving-tesla-rtv3o5`, https://github.com/js2c/Maths-CE1/pull/16) |
| 5 | Atelier : bernard-l'ermite, cadre de 10, maison des nombres, double + 1 | fait (même branche, même demande de fusion) |
| 6 | Module 2 comme notion du jour : familles 3 à 7, formes à trou, leçons L4 à L6, alternance, module imposé, point de départ étendu | fait (même branche, même demande de fusion) |
| 7 | Défi record, grille des 66 additions, progression du module 2 dans l'espace parent | fait (branche `claude/youthful-tesla-rtkgta`, https://github.com/js2c/Maths-CE1/pull/17) |
| 8 | Nombres jusqu'à 1 000 (`docs/SPEC-COMPLEMENTS.md`, partie A) | fait (même branche, même demande de fusion) |
| 9 | Bilan : `docs/BILAN-LOT2.md`, guide du parent, recette complète sur l'année ; corrections de la relecture extérieure | fait (même branche, même demande de fusion) |

### Reprise des étapes 7 à 9

Pour reprendre si la session s'est arrêtée : branche `claude/youthful-tesla-rtkgta` (nom imposé par l'environnement), demande de fusion en brouillon « Lot 2, étapes 7 à 9 (en cours) » (https://github.com/js2c/Maths-CE1/pull/17).

**Étape en cours :** aucune ; **étapes 7 à 9 terminées**, recette complète faite (tableau dans `docs/BILAN-LOT2.md`, section « Recette complète »), demande de fusion https://github.com/js2c/Maths-CE1/pull/17 prête (sortie du brouillon). L'étape 9 a été reprise le 27 septembre au soir avec quatre corrections demandées par le parent après une relecture extérieure (ci-dessous).

**Corrections du 27 septembre (relecture extérieure, décisions du parent ; faites au début de l'étape 9) :**

1. **Aide des additions passable** (`modules/facts/screen.js`, `skippable`) : le coquillage et l'aide affichée d'emblée du cran « plus facile » créent dès leur début le bouton « passer » habituel (`skipKey`, même dessin, même place, libellé « passer l'aide ») ; un toucher coupe la voix et l'animation (la tortue et ses sauts sont arrêtés par `stop`/`guard`, `lineAid`), range l'appui (calque des aides, ligne) et rend le pavé aussitôt (40 à 60 ms mesurés, parcours `tests/e2e/aide-passer.mjs`). Les exemples guidés et les corrections passent aussi `guard` à la tortue (elle ne continue plus de sauter derrière). Mesures à vitesse réelle : `recette-durees.mjs`, section « aide ».
2. **Sortie de la pause par le parent** (`main.js`, `endPausedSession` ; `parent.js`, `pauseBlock` ; `session.js`, `interrupt`) : pas de bouton d'arrêt pour l'enfant ; pendant une pause, l'espace parent montre en haut « Terminer la séance… », puis une confirmation (« Oui, terminer la séance » / « Annuler »). La séance est enregistrée interrompue (`terminee: false`, `arreteeParParent: true`, pas d'étape « récompense »), l'activité est abandonnée comme l'entraînement libre (`abandonActivity` : horloge, voix, leçon, écrans, bernard-l'ermite, boutons « passer »), et l'accueil revient avec « jouer » (une autre séance est possible le même jour). Parcours `tests/e2e/pause-parent.mjs`.
3. **Cran « plus facile », additions** (`runner.js`, `warmup.js`) : une réponse avec l'aide affichée d'emblée est enregistrée `aideDEmblee: true` (et non `aide`) et passée comme une aide à `afterFact` : juste, le fait reste dans sa boîte (ni montée, ni voie rapide, ni retour en boîte 1) ; faux, boîte 1 comme toute erreur. **Remplace** la décision de l'étape 6 (« l'aide d'emblée n'est pas comptée comme une aide demandée »). Test unitaire ; guide du parent mis à jour (« consolide sans faire progresser »).
4. **Stagnation du module 2** (`families.js`, `noteNotion` ; réglage `familles2.stagnation.seances` : 6) : chaque fin de notion du jour sur les additions compte une séance pour la famille en cours (`seancesNotion`) ; à 6, si elle n'est pas acquise, elle est « dépassée » (`depassees`) : `currentFamily` passe à la famille ouverte suivante non acquise ; s'il n'y en a pas, la famille suivante s'ouvre (notée `stagnation`). Sa leçon se joue à sa première notion du jour (règle existante). La famille dépassée reste dans l'échauffement et parmi les « autres familles », et peut encore être acquise (étoile arc-en-ciel). Espace parent : « (en révision) » dans le tableau des familles, et la règle expliquée. Tests unitaires ; simulation ci-dessous.

**Décisions prises (corrections) :**

- Le compteur de stagnation ne compte que les séances où la famille était **la famille en cours** de la notion du jour (une séance de ligne graduée ne compte pas ; les séances d'avant cette version non plus : le compteur part de zéro).
- Une famille dépassée ne redevient jamais la famille en cours ; quand toutes les familles sont acquises ou dépassées, la famille en cours est le mélange (qui, lui, n'est jamais dépassé).
- Après « passer l'aide » du coquillage, la consigne est redite (comme après l'aide non passée) ; l'appui compte quand même comme aide demandée (le fait ne monte pas).
- « Terminer la séance » n'apparaît que pendant une pause de séance (ni pendant l'entraînement libre, que la maison quitte déjà, ni hors séance).

**Fait :**

- Décisions du parent du 27 septembre reportées (SPEC-LOT2 section 5 et points ouverts, JOURNAL-CONCEPTION, GUIDE-PARENT). Brillantes : `cartes.json` (`brillanteNouvelle` 0,2, `brillanteDoublon` 0,05 ; `brillante` et `brillanteHasard` retirés), `rewards.js` (`shinyChance`, `addCard` sans règle du 3e doublon ; une carte déjà brillante le reste : aucun changement de schéma, donc pas de migration), phrase « Ta carte devient brillante ! » retirée (voix refabriquée). Tests `cartes.test.mjs`, `rewards.test.mjs`.
- Étape 7 (défi record, grille des additions, progression du module 2) : voir ci-dessous.
- Étape 8 (nombres jusqu'à 1 000) : voir ci-dessous.

**Étape 9, fait :** `docs/BILAN-LOT2.md` (bilan, corrections, recette complète) ; guide du parent relu (lot 2, cran « plus facile » qui consolide sans faire progresser, aide passable, « Terminer la séance », famille « en révision », défauts corrigés retirés) ; `recette-durees.mjs` étendue (niveaux 9 à 13, aides, plus longue attente sans commande) ; option `--defi` de `recette.mjs` ; parcours `aide-passer.mjs` et `pause-parent.mjs` ; simulation : familles dépassées et leçons jouées sur l'année. L'erreur « Cannot read properties of undefined (reading '0') » de `centaines.mjs` ne s'est pas reproduite (un passage propre de plus). Recette complète : tous les critères tenus (voir le bilan).

**Ce qui était prévu pour l'étape 9 (pour mémoire) :** `docs/BILAN-LOT2.md` ; relecture du guide du parent ; recette complète (section 8 de la SPEC-LOT2 : `sim-seances` tous profils à 2 et 5 séances, `recette.mjs --delai 4.5` (ligne et `--module 2`, avec une séance où le défi a lieu : la cible devient 9 à 11 min), `recette-durees.mjs` avec et sans `--passer` (y compris niveaux 9 à 13), tous les parcours Playwright) ; donner le nombre de brillantes en juin par profil (mesure provisoire ci-dessous, étape 8) ; mettre à jour la ligne « Où en est-on », le JOURNAL-CONCEPTION (état), puis finir la demande de fusion https://github.com/js2c/Maths-CE1/pull/17 (description complète, sortir du brouillon). Surveiller une erreur « Cannot read properties of undefined (reading '0') » vue une fois dans `centaines.mjs` et jamais reproduite (trois passages propres).

**Décisions prises (étape 8) :**

- **Niveaux 9 à 13** (`module1.json`) : 9, ligne 0 à 1 000 pas de 100 (0, 500, 1 000 écrits) ; 10, une centaine pas de 10 (départs 100 à 900, extrémités écrites) ; 11, 20 graduations de 1 (douze lignes fixes, de 120-140 à 890-910, dizaines écrites) ; 12, dictée (78 nombres fixes : les neuf centaines rondes, des zéros au milieu comme 307, des dizaines rondes, des « dix-… » comme 317, et d'autres) ; 13, estimer sur 0 à 1 000 (11 cibles, ±60 puis ±40). Ils s'enchaînent après le niveau 8 (voie rapide et montée 8 sur 10 comme ailleurs) ; ligne d'école (k = 1) comme les niveaux 5 à 8.
- **Voix** : seulement les nombres que ces réglages peuvent produire (`levelValues`), d'où les lignes du niveau 11 et la dictée en listes fixes : 2 004 phrases de plus, **26,9 Mo** de voix en tout (estimation avant fabrication : 27,2 Mo), sous le plafond de 40 Mo ; pas de solution de repli nécessaire.
- **Pièges** : E6 remplace E2 et E5 au-delà de 100 (70 pour 700, 37 pour 370, 37 ou 370 pour 307, 437 pour 347) ; E7 (3007 pour 307, 30017 pour 317, 40040 pour 440) seulement en dictée (ces nombres ne sont pas sur la ligne) ; E3 garde son sens (340 au lieu de 347 sur 340-360 donne 7).
- **Petits chaluts** : les niveaux 9 à 13 sont des lignes d'école, sans bouées ; la « bouée géante à chalut » de la SPEC devient un petit chalut (sac de mailles et flotteur orange) au-dessus de chaque graduation de centaine.
- **Dictée** : la voix dit « Écris le nombre 307. » (ou « Tape le nombre 307 sur le pavé. ») ; le pavé des additions, l'ardoise ne montre que le nombre tapé (jusqu'à 5 chiffres, pour reconnaître 3007 ou 30017) ; exemple guidé : le nombre décomposé et dit, puis écrit ; correction : la phrase E7 (ou E6, NSP, autre), puis la décomposition en chaluts, filets et poissons avec les chiffres dessous (le chiffre de la place vide en rouge), le nombre sur l'ardoise, « C'était 307. ». Pas de coquillage d'aide en dictée.
- **E6 sur la ligne** : la décomposition (sans les chiffres) au-dessus de la ligne pendant 2,8 s, puis la suite habituelle.
- **L10** : le texte de la SPEC ; le comptage des filets est dit filet par filet (« dix, vingt, … cent ! »), le compteur à côté du chalut ; « trois-cents » : 300 écrit en grand, le 3 en rouge ; 307 : le 0 clignote. Jouée à l'entrée du niveau 9 et quand E6 revient deux fois (comme L1 à L3 pour leurs erreurs) ; sans le bernard-l'ermite (la SPEC-COMPLÉMENTS confie les centaines à la tortue ; la leçon se joue sur le calque des aides, la pieuvre à côté).
- **Arcs de saut** : un nombre à trois chiffres ne tient pas entre deux graduations serrées (niveau 11) ; l'arc n'a alors pas d'étiquette, la voix compte toujours.
- **Mémoire** : le chalut (11 images) est sur une planche « centaines » (19 Mo décodés en @2x) chargée seulement pour L10, la dictée et la correction E6, pas sur « aides » (chargée au démarrage).
- **Textes nouveaux, à valider** : « Écris le nombre 307. », « Tape le nombre 307 sur le pavé. », « Regarde d'abord comment on fait. » (exemple guidé de la dictée), « 307 : 3 centaines, 0 dizaine, 7 unités. » (E6, singulier pour 0 et 1 comme dans la SPEC), « On n'écrit pas 300 puis 7 : le 7 prend la place des unités. » / « … puis 17 : le 17 prend la place des dizaines et des unités. » (E7).

**Écarts avec la spécification (étape 8) :**

- Les quatre cartes rares « liées aux nouveaux décors » (SPEC-COMPLÉMENTS, Récompenses) ne sont pas ajoutées (contenu à générer par le parent ; hors du tableau de l'étape 8).
- Réglage « Modules activés » de la SPEC-COMPLÉMENTS : sans objet (la partie A est une extension du module 1, ouverte par le niveau 8 ou le point de départ).
- Petits chaluts au-dessus des graduations au lieu de « bouées géantes » (voir les décisions).

**Brillantes en juin (décision du parent du 27 septembre, mesure provisoire de l'étape 8, simulation sur l'année, zones 3 et 4 prêtes) :**

| Profil | 2 séances par semaine | 5 séances par semaine |
| --- | --- | --- |
| sait | 13 | 17 |
| reel | 17 | 19 |
| diff | 10 | 30 |
| très dur | 17 | 25 |
| plus facile | 18 | 22 |

(avant la décision : 56 à 57 à 5 séances par semaine, 13 à 42 à 2 séances). Refait à la recette complète de l'étape 9 (avec les corrections) : sait 13 / 17, reel 17 / 19, diff 13 / 30, très dur 17 / 25, plus facile 14 / 25 (2 / 5 séances par semaine) ; voir `docs/BILAN-LOT2.md`.

**Recette allégée de l'étape 8 (27 septembre 2026) :**

| Critère | Mesure | État |
| --- | --- | --- |
| Tests unitaires | 168 sur 168 (dont 7 nouveaux : niveaux 9 à 13, E6 et E7, dictée, estimer, chaluts, décomposition dite, nombres possibles ; L10) ; voix 26,9 Mo, sous 40 Mo | tenu |
| Simulation sur l'année | niveau 9 atteint à la 9e séance (« sait »), 25e (« reel »), 51e (« diff ») ; niveau 13 à la 13e, 55e (47e à 5 par semaine), jamais pour « diff » à 2 par semaine (93e séance à 5) ; « plus facile » reste au niveau 2 (règle inchangée, parade du parent) ; 60 cartes le 17 juin (15 juin à 5 par semaine), quota jamais dépassé ; alternance jamais rompue | tenu |
| Parcours `centaines.mjs` | L10 jusqu'au bout ; niveau 9 avec erreur E6 ; niveau 10 placer ; niveau 11 lire ; dictée avec erreur E7 et réponse juste ; niveau 13 estimer ; chaque phrase dite a son fichier | tenu |
| Parcours `parent.mjs` | point de départ 1 à 13 (rangée resserrée pour tenir dans la carte), le reste inchangé | tenu |
| Captures regardées | planche de l'atelier (filet, chalut 0, 3 et 10 filets, petits chaluts sur la ligne), L10 (chalut qui se remplit, 307 et son zéro), ligne 0 à 1 000, correction E6, dictée et sa correction ; corrigés : L10 invisible dans les captures (elles venaient après la leçon, jouée en voix accélérée), chaluts trop petits et chiffres sur la ligne pendant E6, anneau décalé sur l'ardoise, étiquettes « 891 892… » qui se chevauchaient, colonnes de la décomposition trop serrées, neuf chaluts sur une rangée | tenu |

**Décisions prises (étape 7) :**

- **Défi record, déroulement** : après la notion du jour (ordre de `seance.json`), une minute de chronomètre (`dureeS`), faits en boîte 3 ou plus mélangés (tous les faits avant d'en reposer un, jamais deux fois de suite le même), formes à trou comme à l'échauffement au cran conseillé ; **pas de consigne lue par question** (la voix ralentirait tout ; l'ardoise suffit, et la consigne du défi est dite avant le départ), pas d'aide ; « je ne sais pas » reste disponible (il passe la question). Une erreur : bruitage doux, l'ardoise tremble, la bonne réponse reste écrite 0,9 s (`apresErreurMs`), sans correction ; le temps continue. La question en cours quand la bulle est vide n'est pas notée.
- **Score et record** : le score est le nombre de bonnes réponses ; le premier défi avec au moins une bonne réponse fait le premier record (5 étoiles, « C'est ton premier record ! ») ; ensuite seul un score plus haut le bat (5 étoiles, `etoiles.nouveauRecord`) ; égalé : « Autant que ton record ! Bravo ! » ; en dessous : « Ton record, c'est 12. Tu le battras peut-être la prochaine fois ! » ; aucune bonne réponse : « Ce n'est pas grave, on réessaiera la prochaine fois ! ». Chaque bonne réponse rapporte une étoile (multipliée par le cran, comme partout).
- **Révision espacée** : les réponses du défi comptent comme les autres (une boîte au plus par séance, une erreur renvoie en boîte 1), conformément à la SPEC-LOT2 (« échauffement, notion du jour et défi confondus »). Pas de protection du cran pendant le défi (elle dirait « On essaie un peu moins dur ? » au milieu de la minute).
- **Écran** : la bulle-sablier (une bulle de verre pleine d'eau qui baisse, 30 niveaux fabriqués dans l'atelier) à la place du coquillage d'aide ; une perle d'or par bonne réponse sous l'ardoise ; le record est un petit drapeau rouge planté après la perle du record ; à la fin, l'ardoise est rangée et la rangée reste pendant l'annonce. La frise montre un pictogramme de bulle à moitié pleine, seulement pour les séances où le défi aura lieu.
- **Textes nouveaux, à valider** : « C'est le défi ! Tape le plus de bonnes réponses possible avant que la bulle se vide. Chaque bonne réponse te donne une perle. » (premier défi), « C'est le défi ! Essaie de dépasser le drapeau de ton record. », « Attention… Partez ! », « Fini ! », « 12 bonnes réponses ! » / « Une bonne réponse ! », « C'est ton nouveau record ! Bravo ! », « C'est ton premier record ! Tu essaieras de le battre la prochaine fois. », « Autant que ton record ! Bravo ! », « Ton record, c'est 12. Tu le battras peut-être la prochaine fois ! », « Ce n'est pas grave, on réessaiera la prochaine fois ! ».
- **Espace parent** : grille des additions 11 × 11 (boîte en couleur et en chiffre, anneau vert « rapide » : temps médian des réponses justes sous le seuil ; « + 0 » en gris avec le temps de base de chaque question ; toucher une case : l'historique du fait) ; tableau des familles (ouverte le, faits bien sus, acquise le, formes à trou ; famille en cours) ; courbe des faits bien sus semaine par semaine (en plus de la réussite et du temps médian) ; bloc « Défi record » ; détail d'une séance : famille du jour, défi et ses réponses à part ; colonnes CSV. Le point de départ du parent n'est plus compté comme une erreur ni un passage d'un fait (défaut trouvé en passant : « faits qui résistent » et export des faits).

**Écarts avec la spécification (étape 7) :**

- Étape « defi » : `minutes` porté à 2 dans `seance.json` (durée maximale de l'étape, consignes et annonce du score comprises) ; le chronomètre lui-même dure 60 s (`dureeS`).
- La SPEC dit « faits mélangés » ; le défi pose aussi les formes à trou des familles qui les ont ouvertes (comme l'évaluation, qui a les trois formes).

**Points à observer (étape 7) :**

- Records battus rarement dans la simulation (2 à 4 dans l'année) : l'enfant simulé ne gagne pas en vitesse, contrairement à une vraie enfant. À observer : si le record plafonne, la phrase « Ton record, c'est … » revient souvent ; parade possible plus tard : un record par période.

**Recette allégée de l'étape 7 (27 septembre 2026) :**

| Critère | Mesure | État |
| --- | --- | --- |
| Tests unitaires | 161 sur 161 (dont 11 nouveaux : défi record, grille, familles, faits bien sus, brillantes) | tenu |
| Défi dans la simulation (2 séances par semaine, sur l'année) | premier défi à la 6e séance pour les 5 profils ; « reel » : 59 défis sur 64 séances, scores 5 à 14 ; « sait » 16 à 20 ; « diff » 3 à 8 (19 défis sautés faute de 8 faits bien sus) ; séances avec défi : 9,4 à 10,5 min estimées | tenu |
| Parcours `defi.mjs` | la bulle se vide en 60,0 s ; erreur notée, le défi continue ; score = bonnes réponses notées ; premier record ; record de 20 non battu ; chaque phrase a son fichier ; aucune erreur | tenu |
| Parcours `parent.mjs` | grille (66 cases dont 21 « + 0 »), historique d'une case, bloc « Défi record », familles avec la famille en cours ; tout le reste inchangé ; aucune erreur | tenu |
| Captures regardées | planche de l'atelier (bulle à 6 niveaux, perles, drapeau, pictogramme), défi (début, erreur, perles, bulle à moitié, fin avec le drapeau), grille des additions ; corrigés : eau sombre au-dessus de la surface, eau trop proche du fond de la mer, question restée sur l'ardoise à la fin, perles qui se chevauchaient | tenu |

### Reprise des étapes 4 à 6

Pour reprendre si la session s'est arrêtée : branche `claude/loving-tesla-rtv3o5` (nom imposé par l'environnement), demande de fusion en brouillon « Lot 2, étapes 4 à 6 (en cours) » (https://github.com/js2c/Maths-CE1/pull/16).

**Étape en cours :** aucune : étapes 4 à 6 terminées, recette complète faite, demande de fusion prête.

**Fait :**

- Étape 4 (son, intégration) : sons choisis copiés dans `app/assets/son/` (`node tools/son/fabriquer.mjs app`), moteur `app/js/engine/son.js`, mixage `app/content/son.json`, bruitages branchés (réponses, étoiles, coquillage, carte, brillante, bouton, zone), musique tirée à chaque séance et notée (`rec.musique`), baisse sous la voix et en pause, arrêt dans l'espace parent, ligne « Son » des réglages du parent. Tests `tests/unit/son-app.test.mjs` ; parcours `seance.mjs` (son) et `parent.mjs` (réglages).

- Étape 5 (atelier) : bernard-l'ermite (`art/src/canvas-core/sea/hermit.ts`, planche de modèle `hermitSheet`, gestes repos, sortir, montrer, se réjouir, changer de coquille ; export en deux calques, planche « ermite » ; `app/js/engine/hermit.js`) ; aides visuelles (`sea/aids.ts`, planche « aides », `aidsSheet` ; `app/js/modules/facts/aids.js`). Tests `tests/unit/ermite.test.mjs`, parcours `tests/e2e/ermite.mjs` (captures regardées).

**Reste :** étape 6 ; recette complète à la fin.

- Étape 6 (module 2 comme notion du jour) : familles 3 à 7 (`module2.json`, règles dans `facts.js`, `families.js` : ouverture, famille acquise, formes à trou définitives) ; alternance séance après séance et module imposé (`session.js`, `chooseModule`) ; `modules/facts/runner.js` (notion du jour des additions) ; écran des additions (exemples guidés, appui de chaque famille, correction avec l'appui, aide d'emblée du cran « plus facile ») ; bernard-l'ermite pendant la notion du jour ; leçons L4 à L6 (`lecons.json`, `lessons/player2.js`), aussi dans la revue de l'entraînement libre ; espace parent (notion du jour de la prochaine séance, point de départ familles 1 à 7, additions de la notion du jour à part dans le détail d'une séance) ; 5 phrases nouvelles et leurs variantes (38 fichiers son) ; simulation et recette (`sim-recette.mjs`, `sim-seances.mjs`, `recette.mjs --module 2`, `recette-durees.mjs`, parcours `notion2.mjs`) ; tests `tests/unit/module2-notion.test.mjs`.

**Où j'en suis :** terminé ; demande de fusion https://github.com/js2c/Maths-CE1/pull/16 prête (sortie du brouillon). Étape suivante : 7 (défi record, grille des additions, progression du module 2), après fusion.

**Décisions prises (étape 6) :**

- **Ouverture des familles** : règle de la SPEC (80 % des faits introduits en boîte 2 ou plus), au plus une famille par séance. Comme l'introduction suit l'ordre du catalogue, une famille ouverte tôt n'introduit ses faits nouveaux qu'après ceux des familles 1 et 2 ; mais elle compte pour la famille en cours, les formes à trou et les crans « plus dur ». Mesure (simulation, 2 séances par semaine) : les 7 familles sont ouvertes dès la 5e séance pour les profils « sait » et « reel », à la 40e pour « diff ».
- **Point de départ du parent** : marquer une famille connue ouvre cette famille et celles d'avant, et la compte comme acquise par le parent (sans étoile arc-en-ciel) ; la suivante s'ouvre ensuite d'elle-même par la règle des 80 %.
- **Leçons d'appui jamais vues** (ajout à la SPEC, **à valider**) : une famille est souvent acquise (par les faits des familles 1 et 2) avant d'être la notion du jour ; sans règle, la leçon L6 (maison des nombres) n'était jamais jouée, et L4 rarement. Les maisons de 8 et 9 jouent donc L6 si elle n'a jamais été vue, les presque-doubles L4 (puis L6), le mélange la première leçon d'appui qui manque (réglage `leconSiPasVue` de `module2.json`). Avec cette règle, sur l'année : L4, L5 et L6 pour « sait » ; L5 et L6 pour « reel » (2 par semaine) ; aucune pour « diff », qui reste sur la famille 1 (voir les points à observer).
- **Choix des faits** en notion du jour : une question sur deux sur la règle de la famille en cours (toutes au cran « plus facile »), l'autre sur les faits les plus faibles des autres familles ; un fait nouveau une question de famille sur deux, tant que la limite de la séance (6) et la boîte 1 (8) le permettent ; aux crans « plus dur » et « très dur », les faits nouveaux alternent entre la famille en cours et la suivante.
- **Appui de chaque question** : celui de la famille en cours si le fait relève de sa règle, sinon celui de la famille du fait ; pour le mélange, l'appui le plus parlant (`aidFor` : ami de 10 → cadre, double → reflet, presque-double → double + 1, + 1 et + 2 → la tortue, sinon la maison).
- **Exemple guidé** : l'appui avec la réponse, « 3 plus 7, ça fait 10. », « À toi ! Tape la réponse. » ; l'appui est rangé quand le pavé revient (il occupe la même place). Correction en notion du jour : l'appui avec la réponse, puis la phrase de correction ; « passer » comme partout.
- **Cran « plus facile »** : l'aide « affichée d'emblée » est montrée au début de chaque question (appui sans la réponse, avec sa phrase), puis le pavé revient ; elle n'est pas comptée comme une aide demandée (la séance « plus facile » compte normalement ; sinon aucun fait ne monterait jamais de boîte). **Remplacé le 27 septembre** (décision du parent, correction 3 de l'étape 9) : un fait réussi avec l'aide d'emblée ne change plus de boîte.
- **Difficulté persistante** (3 erreurs sur 5) : la leçon de la famille si elle en a une et qu'elle n'a pas été jouée dans la séance, puis un fait déjà bien su.
- **Nombres de questions** : la durée prime. Avec 30 à 38 questions, la séance d'additions jouée à vitesse réelle (`recette.mjs --delai 4.5 --module 2`) durait 6 min 39 s (39 questions en 4 min 21 s, environ 6,7 s par question) ; relevé à **50 à 60** (`seance.json`, `notion.module2`), c'est la limite de 6 minutes qui arrête l'étape : 8 min 23 s, 56 questions.
- **Frise** : pendant la notion du jour des additions, le pictogramme est le « + » de l'échauffement.
- **Textes nouveaux, à valider** : « Maintenant, les additions, avec le bernard-l'ermite ! » (ou « Au tour des additions ! Le bernard-l'ermite va t'aider. »), « Regarde la boîte à dix places : 7 poissons. », « Regarde la maison : les deux pièces, ensemble, font le nombre du toit. », « 3 plus 3, c'est un double. Et une bulle de plus ! », « À toi ! Tape la réponse. » ; leçon L4 : les bulles de chaque côté du miroir sont les bulles dorées de l'atelier ; L5 : « Six et quatre. », « Huit et deux. » (les deux exemples rapides de la SPEC dits à voix haute) ; L6 : le bernard-l'ermite change de coquille pendant « Voici la maison du sept. ».

**Écarts avec la spécification (étapes 4 à 6) :**

- Son : 3,6 Mo (trois musiques à 64 kbit/s) au lieu des 3 Mo visés ; 48 kbit/s ramènerait à 2,7 Mo (choix du parent attendu, `tools/son/reglages.json`).
- SPEC : « 12 à 16 questions » en notion du jour ; relevé à 50 à 60 pour les additions (la durée prime, voir plus haut).
- Leçons L4 et L6 jouées aussi par les familles qui reprennent leur appui (`leconSiPasVue`) : ajout à la SPEC, voir les décisions de l'étape 6.
- Le bernard-l'ermite n'est pas un visiteur de la surprise de l'accueil (planche de 55 Mo à charger pour quelques secondes).

**Points à observer ou à décider (recette des étapes 4 à 6) :**

- Profil « en difficulté » (simulation) : la famille 1 (« + 1 et + 2 », 30 faits) n'est jamais acquise dans l'année (80 % en boîte 3) ; la notion du jour des additions reste donc sur la famille 1 toute l'année (avec les autres familles en révision), sans leçon L4 à L6. À observer ; parade possible : le point de départ du parent.
- L'ouverture des familles est rapide pour une enfant à l'aise (les 7 ouvertes dès la 6e séance), car la règle ne compte que les faits déjà introduits.
- Écouter les phrases nouvelles et le mixage sur la tablette (je n'ai rien pu écouter).

**Recette complète des étapes 4 à 6 (27 septembre 2026) :**

| Critère | Mesure | État |
| --- | --- | --- |
| Tests unitaires | 150 sur 150 (dont 21 nouveaux : son, bernard-l'ermite, module 2) ; `precache.mjs --check` à jour | tenu |
| Durée d'une séance complète (`recette.mjs --delai 4.5`), 8 à 10 min tant que le défi record n'existe pas | ligne graduée (première séance) : **8 min 58 s** ; additions (`--module 2`, première séance) : **8 min 23 s** (6 min 39 s avant le relèvement des questions) | tenu |
| Attente sans rien pouvoir faire, hors consigne orale (`recette-durees.mjs --passer`) | au plus **2,5 s** après une question, niveaux 1 à 8 de la ligne et familles 1 à 5 des additions ; avant la première question : 4 à 5 s (ligne), 7,4 à 8,7 s (additions : accueil et « Maintenant, les additions… », consigne orale). Sans « passer » : corrections jusqu'à 24 s (après « je ne sais pas », la tortue compte), leçons L4 à L6 de 13 à 17 s | tenu |
| Faits nouveaux (profil « reel », 2 séances par semaine) | 6, 6, 6, 6, 1, 5, 6 jusqu'aux 33 faits (le 1 : boîte 1 à 7 faits sur 8) ; « diff » : 0 à 6, bloqué quand la boîte 1 est pleine | tenu |
| Familles 1 et 2 (profil « sait ») | les 33 faits vus à la **6e séance** (2 et 5 par semaine) ; les 45 à la 8e | tenu |
| Cartes (2 séances par semaine, zones 3 et 4 prêtes) | 60 cartes (5 légendaires) le 17 juin pour les 5 profils (le 15 juin à 5 par semaine) ; quota jamais dépassé | tenu |
| Tirage des brillantes | inchangé (test unitaire 20 % ± 3 points) ; sur l'année : 17 à 42 à 2 par semaine, 56 à 57 à 5 par semaine (point ouvert inchangé) | tenu |
| Alternance | jamais deux fois de suite le même module (5 profils, 2 et 5 par semaine) : 32 + 32 et 80 + 80 séances ; module imposé : parcours `notion2.mjs` et test unitaire | tenu |
| Module 2 en notion du jour (simulation) | 35 à 39 questions par séance d'additions, 8,1 à 9,1 min estimées ; leçons L4 à L6 vues dans l'année (« sait », « reel » à 5 par semaine, « très dur », « plus facile ») ; une famille acquise = une étoile arc-en-ciel | tenu (voir « diff ») |
| Son | bruitages décodés et joués dans Chromium, contexte à 48 kHz, musique tirée et notée, arrêtée à la fin (`seance.mjs`) ; réglages du parent (`parent.mjs`) | tenu (écoute à faire) |
| Écrans nouveaux ou modifiés | captures regardées : réglages du son, bernard-l'ermite (gestes, planche de modèle, visage en grand), cadre de 10, maison, double + 1, leçons L4 à L6, exemple guidé, corrections avec l'appui (tortue, cadre, reflet, maison), fin de la notion avec la nouvelle coquille ; corrigés : proportions et visage du bernard-l'ermite, coquille retrouvée après « changer », appui qui chevauchait le pavé, coquille à moitié hors de l'écran | tenu |
| Erreurs dans la page | aucune (pwa, voix, séance, leçons, récompenses, sélecteur, cartes, ergonomie, frise, parent, perf, ermite, notion2 et `--famille 3`, `--famille 6`, deux recettes à vitesse réelle, recette-durees) | tenu |
| Performance (`perf.mjs`, processeur ÷4, densité 2) | la machine de l'environnement est plus lente depuis un redémarrage : mesuré le même jour, `main` donne 2,75 s au démarrage à froid et 44,7 ms d'intervalle moyen ; cette branche 2,9 à 3,1 s et 42,9 à 46,5 ms : pas d'écart significatif ; planches décodées 180 Mo (+5 Mo, « aides ») ; « ermite » (55 Mo) seulement pendant le module 2 | à vérifier sur la tablette |

**Décisions prises (étape 5) :**

- Bernard-l'ermite : de profil vers la droite, bulot crème rayé de brun (comme la carte du lagon), grands yeux blancs à pupille au bout des pédoncules (comme la pieuvre), joue rose et sourire ; grosse pince devant. Rentré dans sa coquille, sa grosse pince reste à l'ouverture (c'est ainsi qu'un pagure ferme sa maison). « Changer de coquille » : une turbo rose plus grande l'attend à droite ; il sort (on voit son abdomen mou), marche, y entre à reculons, se réjouit ; l'ancienne reste posée.
- Mémoire : rendu en images entières, le personnage coûtait 139 Mo décodés (@2x) ; en deux calques (coquilles fixes, corps seul) et avec moins d'images (8 images/s), 55 Mo, chargés seulement pendant le module 2.
- Aides : le cadre de 10 reçoit les poissons de l'application (le petit poisson jaune du décor), la maison des nombres s'empile (un toit Saint-Jacques avec le total, un étage par paire, un seuil), le double + 1 reprend le poisson et son reflet et ajoute une bulle dorée ; les nombres sont écrits en direct avec les chiffres de la scène.
- Le bernard-l'ermite n'est pas (encore) un visiteur de la surprise de l'accueil : il faudrait charger sa planche (55 Mo) pour quelques secondes.

**Décisions prises (étape 4) :**

- Débit des musiques : 64 kbit/s (choix par défaut, le parent n'ayant pas demandé 48 kbit/s) ; 3,6 Mo de sons en tout, au-delà des 3 Mo visés (noté comme écart).
- Niveaux : bruitages 4 dB sous leur niveau de fabrication (la voix mesure environ -16 LUFS : elle reste devant) ; musique 18 dB sous les bruitages ; volume du parent : douce -6 dB, moyenne, plus forte +4 dB ; baisse de 10 dB sous la voix (fondu 0,25 s) ; pendant la pause, 14 dB de moins (« très bas ») ; fondu d'entrée 3 s, de sortie 2 s. Tout est dans `app/content/son.json`.
- Musique aussi pendant l'entraînement libre (tirée à son ouverture) ; pas de musique dans le récif ni dans l'album (visite libre, hors séance), ni sur l'écran « à demain ».
- « Je ne sais pas » ne fait pas le bruitage d'erreur (ce n'est pas une erreur pour l'enfant ; la voix rassure).
- Bruitage « étoile » : une fois par vol d'étoiles (à la première arrivée), pas à chaque étoile (jusqu'à 10 d'affilée).
- Bruitage « bouton » : tous les boutons de l'écran de l'enfant (pavé compris), sauf les bulles-réponses (elles ont la bulle claire ou douce) et le coquillage à ouvrir (il a le sien).

### Reprise de l'étape 3

Pour reprendre si la session s'est arrêtée : branche `claude/tender-volta-20rhlz` (nom imposé par l'environnement), demande de fusion https://github.com/js2c/Maths-CE1/pull/14.

**Fait :**

- Synthétiseur `tools/son/` (JavaScript pur, déterministe, sans enregistrement ni banque de sons) : `synth.mjs` (corde pincée, sons modaux de marimba, de cloche et de perle, bulle de Minnaert, nappe, filtres, réverbération, limiteur, sonie BS.1770), `bruitages.mjs`, `musiques.mjs`, `fabriquer.mjs`, réglages `reglages.json`.
- Échantillons dans `docs/son-echantillons/` : 3 musiques (harpe 64 bpm, marimba 68 bpm, cloches douces 60 bpm ; boucles de 2 min 21 à 2 min 30), 10 bruitages (les 8 de la SPEC, avec deux variantes pour la bonne réponse et l'erreur), chacun en Opus et en MP3 ; `LISEZMOI.md` ; page d'écoute `index.html`, publiée : https://claude.ai/artifact/QAmobN6rrwNExcEe3PrwBE (musiques, « écouter le raccord », bruitages, scène « comme dans l'application » avec le mixage prévu, ligne de choix à copier).
- Tests `tests/unit/son.test.mjs` (déterminisme, durées, niveaux, crêtes, fin sans clic, tempo, gamme pentatonique, aucune mesure répétée, raccord de la boucle, échantillons à jour, poids, étalonnage de la sonie).
- Documentation : `docs/ARCHITECTURE.md` (« Le son (lot 2) »).

**Choix du parent (27 septembre 2026)** : bruitages, les variantes « a » (`bruitage-bonne-a`, `bruitage-erreur-a`) ; musique, **les trois**, l'une tirée au hasard au début de chaque séance et gardée en boucle toute la séance (reprise après une pause comprise). Noté dans `docs/SPEC-LOT2.md`, section 6. À faire à l'étape 4 :

- intégrer `bruitage-*-a` (les variantes « b » restent dans les échantillons, hors de l'application) et les trois musiques ;
- tirer la musique au début de la séance et l'enregistrer avec la séance (une séance reprise après la maison garde sa musique) ;
- **poids** : les trois musiques font 3,6 Mo en Opus à 64 kbit/s, plus 0,08 Mo de bruitages, au-delà des 3 Mo visés par la SPEC. Deux possibilités, à trancher par le parent : garder 64 kbit/s (3,7 Mo en tout, soit environ 20 % de plus que la voix déjà en cache), ou encoder les musiques à 48 kbit/s (environ 2,7 Mo en tout, sous l'objectif ; pour une musique douce, la différence devrait être peu audible, à confirmer à l'écoute). Par défaut, l'étape 4 garderait 64 kbit/s ;
- ne charger que la musique tirée (décodée, une boucle stéréo de 2 min 30 à 48 kHz occupe environ 58 Mo en mémoire ; les trois ensemble : 170 Mo).

**Reste à faire :** l'étape 4 (intégration), dans une nouvelle session, après fusion.

**Où j'en suis :** étape terminée, choix du parent reçu et noté.

**Décisions prises :**

- Deux variantes (a, b) pour la bonne réponse et l'erreur, les deux sons qu'elle entendra le plus souvent ; un seul son pour les autres (ajout à la SPEC, qui ne demandait qu'une série).
- Erreur : une ou deux bulles graves, attaque adoucie (12 ms), filtrées ; ni descente de hauteur, ni intervalle mineur, ni bourdonnement ; 2 dB plus bas que les autres bruitages.
- Niveaux des fichiers : bruitages à -16 LUFS (sonie momentanée maximale ; erreur -18, toucher d'un bouton -23 car il revient sans cesse), musiques à -23 LUFS (sonie intégrée), crête au plus -1,5 dBFS. Le mixage (-18 dB, baisse de 10 dB sous la voix) sera fait par l'application à l'étape 4 ; la page d'écoute l'applique déjà.
- Musiques jamais limitées (un limiteur casserait le régime périodique de la boucle) : l'excitation de la harpe est un triangle (forme d'une corde tirée), ce qui a supprimé les crêtes qui demandaient 5 à 8 dB de limitation.
- Formats : Opus 64 kbit/s (stéréo pour les musiques, mono pour les bruitages) ; MP3 96 kbit/s pour l'écoute. La nappe : une voix juste et deux voix désaccordées plus faibles (deux voix égales produisaient un battement d'amplitude complet, visible au spectrogramme).

**Écarts avec la spécification (étape 3) :**

- La page d'écoute charge une police de Google Fonts (titres) ; c'est un document pour le parent, hors de l'application, qui reste sans ressource tierce.
- **Je n'ai pas pu écouter les sons.** Vérifications faites à la place : spectrogrammes (raccords des boucles invisibles, attaques, battements corrigés), sonie et crêtes mesurées, fichiers décodés dans Chromium à la bonne longueur, erreur d'encodage Opus pas plus grande au début et à la fin de la boucle qu'au milieu, justesse de la corde pincée mesurée (à moins de 6 cents). Le jugement à l'oreille (naturel de la harpe, douceur de l'erreur, calme de la musique) revient au parent.
- À prévoir à l'étape 4 : jouer la musique dans un `AudioContext` à 48 kHz (sur un contexte à 44,1 kHz, Chromium rééchantillonne et la boucle perd au plus un échantillon, inaudible mais évitable).

**Recette de l'étape 3 (27 septembre 2026, allégée à la demande du parent : tests, simulation, capture de chaque écran nouveau ou modifié ; ni séance réelle ni mesure des durées) :**

| Critère | Mesure | État |
| --- | --- | --- |
| Tests unitaires | 130 sur 130 (dont 10 nouveaux pour le son) ; `precache.mjs --check` à jour | tenu |
| Simulation (`sim-seances.mjs`, sait, reel, diff ; 2 et 5 séances par semaine, sur l'année) | résultats identiques à l'étape 2 (l'application n'a pas changé) : 60 cartes le 15 ou le 17 juin, quota jamais dépassé, familles 1 et 2 vues à la 6e séance (« sait »), aucune leçon revue deux fois | tenu |
| Écrans nouveaux ou modifiés | un seul, la page d'écoute (hors de l'application) : captures à 1280 × 800, 400 px de large et en thème sombre, regardées ; tuiles étirées corrigées ; aucune erreur dans la page (hors police bloquée par le proxy de l'environnement) | tenu |
| Poids (SPEC : moins de 3 Mo) | musique la plus lourde 1,28 Mo + bruitages 0,08 Mo = 1,36 Mo en Opus | tenu |
| Musique : 60 à 72 battements par minute, pentatonique, boucle de 2 à 3 min sans raccord | 60, 64 et 68 ; toutes les notes dans la gamme (test) ; 2 min 21 à 2 min 30 ; raccord vérifié par construction, test et spectrogramme | tenu (à confirmer à l'oreille) |
| Bruitages : moins d'une seconde sauf le coquillage | 0,09 à 0,98 s ; coquillage 2 s | tenu |
| Durée d'une séance, attentes, faits nouveaux, alternance | — | sans objet (recette allégée ; application inchangée) |

### Reprise de l'étape 2

Pour reprendre si la session s'est arrêtée : branche `claude/prompt-lot2-section-9xloz0` (nom imposé par l'environnement), demande de fusion https://github.com/js2c/Maths-CE1/pull/13.

**Fait :**

- Échauffement (`modules/facts/`, réglages `content/module2.json`) : 3 places réservées aux faits nouveaux (dans la limite de la boîte 1), faits dus les plus en retard d'abord, voie rapide (première rencontre juste, rapide, sans aide : boîte 3 ; si tous les faits nouveaux prévus passent ainsi, jusqu'à 3 autres à la fin), limite commune de 6 faits nouveaux par séance, une boîte au plus par séance, questions triviales « a + 0 » une séance sur cinq, formes à trou (ardoise et consignes) selon le cran. Tests : `tests/unit/echauffement-lot2.test.mjs`, `facts.test.mjs`.
- Ligne graduée (`modules/numberline/runner.js`) : la voie rapide enchaîne plusieurs niveaux dans une séance (leçon d'entrée de chaque niveau) ; une même leçon au plus une fois par séance, ensuite niveau inférieur et correction à vitesse 1 ; cran du sélecteur (niveau joué, validation au-dessus du conseillé, jamais de baisse). Tests : `tests/unit/ligne-lot2.test.mjs`.
- Sélecteur de difficulté : atelier (`sea/selector.ts`, planche « selecteur », `selectorSheet`), écran (`session/selector.js`), voix (6 phrases nouvelles + 4 sans étoiles + « On essaie un peu moins dur ? »), séance (`setCran`, multiplicateur, protection), entraînement libre sans étoiles. Tests : `tests/unit/selecteur.test.mjs`, parcours `tests/e2e/selecteur.mjs`.
- Séance (`content/seance.json`) : durées 3 et 6 min, nombres de questions relevés (la durée prime), défi record actif mais sauté tant qu'il n'est pas construit (conditions : 5e séance terminée, 8 faits en boîte 3, réglage du parent) ; la frise ne montre que les étapes construites.
- Graphisme : la pieuvre montre la cible (gestes `montrer`, `montrerBasDroite`, `montrerBas`) ; calque d'effets au-dessus de la pieuvre ; la pieuvre s'écarte pendant les exemples et corrections.
- Espace parent : point de départ (niveaux 1 à 8, familles 1 et 2 ; `parent/depart.js`), crans autorisés, défi record activé ou non, cran dans l'historique et les exports.
- Recette : simulation (profils `tresdur` et `facile`), `recette.mjs --delai 4.5`, `recette-durees.mjs` avec et sans `--passer` ; documentation (ARCHITECTURE, GUIDE-PARENT).

**Reste à faire :** rien pour l'étape 2. Étape suivante : étape 3 (son, échantillons), dans une nouvelle session, après fusion.

**Où j'en suis :** étape terminée, demande de fusion prête.

**Décisions prises :**

- Défi record « activé à partir de la 5e séance terminée » : compris comme « au moins 5 séances déjà terminées » (réglage `aPartirDeSeance`).
- Liste d'échauffement trop courte (peu de faits dus, par exemple à la première séance) : complétée d'abord par d'autres faits nouveaux (dans la limite de 6 et de la boîte 1), puis par des révisions en avance (faits pas encore dus, sans montée de boîte), enfin par un second passage des faits de la boîte 1 ; ce second passage est sauté si le fait vient d'entrer en boîte 3 par la voie rapide (c'était « 1 + 1, 2 + 1, 1 + 2 deux fois » à la première séance).
- Réussir au-dessus du conseillé (sélecteur) : le niveau joué est validé et le conseillé passe au niveau suivant (au dernier niveau : ce niveau) ; le cran reste le même écart pour la suite de la séance. Échouer au-dessus : ces questions ne comptent pas dans le taux de la séance (donc jamais de redescente).
- Protection : 3 erreurs sur les 5 dernières réponses (échauffement et notion du jour confondus, « je ne sais pas » compris), il faut donc 5 réponses au nouveau cran avant une seconde descente ; pas de relance de leçon au-dessus du conseillé (la protection s'en charge) ; les faits nouveaux « bonus » du cran pas encore posés sont retirés ; pas de protection en entraînement libre.
- Textes nouveaux, **à valider** : « Plus facile : une demi-étoile par bonne réponse. », « Le niveau fait pour toi : une étoile par bonne réponse. », « Plus dur : une étoile et demie par bonne réponse ! » (la SPEC ne donnait que « Très dur : deux fois plus d'étoiles ! ») ; sans étoiles (entraînement libre) : « Choisis ton niveau. », « Plus facile. », « Le niveau fait pour toi. », « Plus dur ! », « Très dur ! ».
- Écran du sélecteur : quatre bulles à droite de la pieuvre, la bulle choisie à sa taille avec un anneau doré, les autres un peu réduites ; la lueur marque le conseillé ; la coche en dessous. Le parent peut restreindre les crans ; un seul cran autorisé : pas d'écran.
- Point de départ, famille connue : ce sont les faits de la **règle** de la famille (les doubles 1 + 1 à 5 + 5), pas seulement ceux que la famille introduit ; un fait déjà plus haut que la boîte 3 y reste.

**Écarts avec la spécification (étape 2) :**

- **Nombres de questions** : la SPEC donne 10 à 14 faits et 12 à 16 questions ; mesurée avec ces nombres, la première séance durait **4 min 32 s** (7 s environ par question). Relevés selon la règle « la durée prime » à 12 à 16 faits et **36 à 44 questions** de notion du jour : la séance dure **8 min 56 s** ; c'est la limite de 6 minutes de la notion du jour qui l'arrête (vers la 40e question). À revoir avec l'essai réel : une enfant qui se trompe davantage fera moins de questions dans le même temps.
- **Cran « plus facile » à l'échauffement** : « seulement des faits dus » donnait un échauffement vide (aucun fait connu) à une enfant qui choisit toujours « plus facile ». Au plus 3 faits nouveaux complètent donc une liste trop courte (`complementMax`).
- **« Très dur » : faits de la famille suivante** : sans objet à cette étape (les familles 1 et 2 sont déjà ouvertes toutes les deux, les suivantes arrivent à l'étape 6) ; le mécanisme existe (`familleSuivante`).
- **Tortue devant la pieuvre** : la tortue était déjà dans un calque au-dessus ; ce sont le calque d'effets (arcs, filets de bulles) qui passait derrière. En plus, la pieuvre s'écarte de 60 px vers la gauche pendant les exemples et corrections (la remonter, comme dans les leçons, lui faisait cacher la frise).
- **Mémoire** : les deux gestes « montrer » nouveaux font passer la planche des gestes de la pieuvre de 62 à 81 Mo décodés (@2x). L'ondulation de leur pointe est quantifiée pour limiter cette hausse.
- **Défi record** : l'étape est active dans `seance.json`, mais sans écran (étape 7) : elle est toujours sautée et notée « pas encore construite ».

**Points à décider par le parent (constats de la simulation) :**

- Une enfant qui choisit **toujours « plus facile »** reste au niveau 2 de la ligne graduée toute l'année (ses questions sont au niveau inférieur, qui ne fait jamais monter le conseillé) ; faute d'étoiles arc-en-ciel, elle ne gagne que 30 cartes. C'est la règle de la SPEC ; parade possible dès maintenant : interdire « plus facile » dans l'espace parent, ou décider qu'une réussite en « plus facile » compte pour le niveau.
- Une enfant qui choisit **toujours « très dur »** gagne environ 50 % d'étoiles en plus, donc plus de doublons : 40 brillantes sur 60 à 2 séances par semaine (34 pour le profil « reel » au cran conseillé), 55 à 5 séances. Point ouvert des brillantes (SPEC-LOT2, section 5) à trancher avant l'étape 9.

**Recette de l'étape 2 (27 septembre 2026) :**

| Critère | Mesure | État |
| --- | --- | --- |
| Durée d'une séance complète (`recette.mjs --delai 4.5`, première séance) ; cible 8 à 10 min tant que le défi record n'existe pas | **8 min 56 s** (accueil et sélecteur 15 s, échauffement 1 min 18 s, notion du jour 6 min 06 s avec les leçons L1, L3 et L2 et la voie rapide du niveau 1 au niveau 5, récompense 1 min 13 s) ; 4 min 32 s avec les nombres de la SPEC, d'où le relèvement | tenu |
| Attente sans rien pouvoir faire, hors consigne orale (`recette-durees.mjs --passer`) | au plus **2,4 s** après une question, sur les niveaux 1 à 8 (sans « passer » : jusqu'à 18 s pendant une correction, qui a toujours son bouton « passer ») | tenu |
| Faits nouveaux (profil « reel », 2 séances par semaine) | 6, 6, 3, 6, 3, 6, 3 par séance jusqu'aux 33 faits (minimum 3) ; profil « diff » : 0 à 6, bloqué quand la boîte 1 est pleine (8 faits) | tenu |
| Familles 1 et 2 (profil « sait ») | les 33 faits vus à la **6e séance** (2 et 5 séances par semaine) | tenu |
| Cartes (2 séances par semaine, zones 3 et 4 prêtes) | 60 cartes (5 légendaires) le 17 juin pour « sait », « reel », « diff » et « très dur » ; quota jamais dépassé. « Plus facile » toujours : 30 cartes (voir les points à décider) | tenu (sauf « plus facile » toujours) |
| Tirage des brillantes | inchangé (test unitaire : 20 % ± 3 points) ; sur l'année à 2 séances par semaine : 21 à 40 brillantes selon le profil | tenu |
| Alternance | — | sans objet (étape 6) |
| Sélecteur : profils « très dur » et « plus facile » (10 premières séances, 2 par semaine) | très dur : réussite 71 %, 2,3 « je ne sais pas » par séance, 16 descentes de cran en 10 séances, 56 étoiles par séance ; plus facile : réussite 92 %, 1,1 « je ne sais pas », 29 étoiles par séance ; « reel » au cran conseillé : 77 %, 1,6, 39 étoiles | mesuré |
| Leçon au plus une fois par séance | aucune leçon revue deux fois dans une séance, tous profils, sur l'année | tenu |
| Erreurs dans la page | aucune (recette, séance, leçons, récompenses, cartes, frise, pwa, voix, perf, ergonomie, parent, sélecteur) | tenu |
| Performance (`perf.mjs`, processeur ÷4, densité 2) | démarrage 1,6 s à froid ; intervalle moyen 18,7 ms (95e centile 33 ms) ; 175 Mo de planches décodées (156 avant l'étape) | tenu |

**Correctif trouvé par la recette :** le service worker aurait mis en cache, sur la tablette, la planche @1x des gestes de la pieuvre en plus de la @2x (la planche @2x a désormais deux pages : `pieuvre-gestes@2x-0.webp`, `-1.webp`) ; `sw.js` et `tests/e2e/pwa.mjs` reconnaissent maintenant les planches en plusieurs pages.

**À vérifier sur la tablette :** le confort du sélecteur (lisibilité des vagues et des demi-étoiles, 15 s d'attente), la longueur réelle d'une séance avec l'enfant (environ 40 questions de ligne graduée à la première séance : est-ce trop ?), la voix des 11 phrases nouvelles, la pieuvre qui montre la cible, la fluidité (planches un peu plus lourdes).

### Reprise de l'étape 1

Pour reprendre si la session s'est arrêtée : branche `lot2-etape1`, demande de fusion en brouillon « Lot 2, étape 1 (en cours) ».

**Fait :**

- Branche créée, demande de fusion en brouillon ouverte (https://github.com/js2c/Maths-CE1/pull/11), étapes du lot 2 inscrites ci-dessus.
- Moteur des cartes (`app/js/session/rewards.js`) : calendrier (`app/content/calendrier.json`), quota (base enregistrée au premier lancement, fiche `quota`), doublons au-dessus du quota (de préférence pas encore brillants), tirage des brillantes (20 %, `brillanteHasard`), ouverture des zones (fiche `zones`, étoile arc-en-ciel dépensée : `arcDepensees`), semaines réussies et étoile dorée toutes les 4, légendaires et coquillage doré (`doreesDepensees`), étoile arc-en-ciel de l'entraînement libre (`arcLibre`), cadeaux (fiche `cadeaux`). Tests : `tests/unit/cartes.test.mjs`.
- Contenu : `cartes.json` (quota, brillantes, semaines, surprise, anecdotes de la zone 2, `ouvertureLu`), `textes.json` (phrases nouvelles), voix fabriquée (72 phrases).
- Atelier : coquillage doré (`coquillage.or`), reflet irisé (`carte.reflet`), cadeaux (`cadeau.corail|gorgone|etoile|coquille`) ; planche `node tools/still.mjs giftsSheet`.
- Application : récompense (`screens.js` : cérémonie d'ouverture de zone, coquillage doré, annonce des brillantes, carte « dans ton album »), effet des brillantes (`cards.js`, `shine`, en grand et dans l'album), album selon les zones ouvertes, surprise (`session/surprise.js`, à l'accueil), cadeaux dans le récif, étoile arc-en-ciel gardée en entraînement libre (`free.js`), espace parent : bloc « Cartes » (Progression ; `data.js`, `cardsSummary`).

- Parcours `tests/e2e/cartes.mjs` (ouverture d'une zone, brillantes, doublon au quota, coquillage doré, surprise, bloc parent), captures regardées et corrigées (visiteurs passés derrière la pieuvre et attendus avant la première question, cadeaux replacés dans le récif, cadeau montré au moins 2,5 s).
- Simulation de l'année (`node tests/sim-seances.mjs <profil> <2|5> annee`, zones 3 et 4 prêtes) ; recette complète ; documentation (ARCHITECTURE, GUIDE-PARENT).

**Reste à faire :** rien pour l'étape 1. Étape suivante : étape 2 (séance et progression), dans une nouvelle session, après fusion.

**Où j'en suis :** étape terminée, demande de fusion prête.

**Décisions prises :**

- Semaine d'école : au moins un jour de classe du lundi au vendredi. Après la fin de l'année du calendrier, plus aucune semaine d'école : à compléter pour 2027-2028 (sans toucher au moteur).
- Étoile arc-en-ciel dépensée pour ouvrir une zone : compteur à part (`arcDepensees`) ; `arcEnCiel` garde le total gagné (le parent voit toujours les niveaux franchis).
- Une carte brillante l'est pour de bon ; un doublon d'une carte déjà brillante ne relance pas l'annonce. « Oh ! Elle est brillante ! » pour le tirage de 20 %, « Ta carte devient brillante ! » (phrase existante) pour le 3e doublon.
- Surprise : `hasard` 0,25 (avec « jamais deux de suite », cela fait une séance sur cinq en moyenne). Visiteurs : la tortue ou un banc de poissons (déjà dessinés et chargés ; les créatures du lagon demanderaient de charger la planche du récif, 43 Mo). Cadeaux : 4 décors, chacun offert une fois, puis seulement des visites.
- Cartes des zones 2 à 4 : pas de créature dans le récif (lot 4) ; la voix dit « Tu la retrouveras dans ton album ! » au lieu de « Cette créature va vivre dans ton récif ! ».
- Texte de l'étoile dorée changé (l'ancien disait « cinq fois cette semaine ») : « Et une étoile dorée ! Tu as joué souvent, semaine après semaine. » (à valider).

**Écarts avec la spécification (étape 1) :**

- Surprise : les visiteurs sont la tortue ou un banc de poissons (pas le bernard-l'ermite, dessiné à l'étape 5, ni une créature du lagon, dont la planche pèse 43 Mo décodés) ; `hasard` vaut 0,25 pour obtenir une séance sur cinq malgré « jamais deux de suite ».
- Ouverture d'une zone : la cérémonie se joue sur l'écran de la récompense (le dos de la zone, assombri, s'éclaire quand l'étoile arc-en-ciel l'atteint, puis file vers un livre de l'album posé pour l'occasion), puisque l'album lui-même n'est pas ouvert à ce moment.
- Coquillage doré : il passe avant les coquillages ordinaires dès qu'il est possible (pas seulement quand il ne reste qu'une place sous le quota) ; c'est la même règle vue autrement, au plus un par séance.
- Les illustrations et anecdotes des zones 3 et 4 manquent : dans la réalité, le grand large attend son contenu (à livrer avant début février), les abysses avant fin avril.

**Recette de l'étape 1 (27 septembre 2026) :**

| Critère | Mesure | État |
| --- | --- | --- |
| Cartes : 60 avant le 25 juin 2027, jamais plus que le quota (2 séances par semaine, zones 3 et 4 prêtes) | 60 cartes (5 légendaires) le 17 juin pour les trois profils ; 15 le 30 novembre, 30 le 4 février, 45 le 26 avril ; quota jamais dépassé. À 5 séances par semaine : 60 le 15 juin | tenu |
| Tirage des brillantes | 20 % ± 3 points sur 1 000 tirages (test unitaire) ; sur l'année : 13 à 22 brillantes à 2 séances par semaine, 56 à 57 à 5 séances | tenu |
| Durée d'une séance (`recette.mjs --delai 4.5`) | 3 min 40 s (première séance, leçon L1 comprise) | sans objet (étape 2) |
| Attente sans rien pouvoir faire | inchangée par cette étape ; avec « passer », au plus 2,5 s après une question (recette-durees) | inchangé |
| Faits nouveaux, familles 1 et 2 | profil « sait » : 13 faits sur 33 avant la 7e séance ; « reel » : 1,5 par séance environ | sans objet (étape 2) |
| Alternance | — | sans objet (étape 6) |
| Erreurs dans la page | aucune (recette, cartes, récompenses, séance, ergonomie, leçons, frise, parent, pwa, voix) | tenu |

## Lot 1 bis — correctifs du 27 septembre

Demandés par le parent après essai sur la tablette (27 septembre 2026). Une session, branche `claude/ergonomie-lecons-exercices-dsrvra`, demande de fusion vers `main`.

| Correctif | Ce qui a été fait |
| --- | --- |
| Leçons : « rejouer » et « passer » | `lessons/player.js` : plus de « phrase précédente » (le bouton et son dessin `precedent` sont retirés de l'atelier) ; « rejouer » (en bas à droite) reprend au début ; « passer » arrête la leçon, la séance enchaîne sur « À toi ! » et l'exercice guidé. Une leçon passée ne rapporte pas ses 3 étoiles et reste notée « passée » (l'enregistrement de la leçon est désormais fait par `session/notion.js`). |
| « Passer » dès la première vue | La règle « à partir de la deuxième vue » est abandonnée partout (leçons, exemples guidés, revue des leçons de l'entraînement libre) ; le réglage `vues` n'est plus lu ni écrit. |
| Corrections passables | Ligne graduée (`answer`) et additions (`submit`), après une erreur comme après « je ne sais pas » : le bouton apparaît dès le début de la correction ; un toucher coupe la voix et l'animation, laisse la bonne réponse en place environ 1 s (nombre écrit et graduation allumée, poisson posé dessus, tortue sur la bonne bouée au format « sauter » ; résultat entouré sur l'ardoise), puis la question suivante. La question revient comme avant. Réponse notée `correctionPassee` : historique du parent (« correction passée », « Corrections passées : n ») et colonne « correction passée » de l'export CSV des réponses. |
| Un seul bouton « passer » | `engine/ui.js`, `skipKey` : les deux triangles jaunes, en haut à droite (140 × 140 px), créés sans attente ; mesuré dans `tests/e2e/ergonomie.mjs` : 2 ms après le toucher pour une correction, 5 ms après le début d'une leçon. Le bouton s'efface dès qu'on l'a touché. |
| Rythme | `app/content/seance.json`, `vitesseAnimations` : 1,5. Accélère les sauts et la nage de la tortue et les pauses des exemples guidés et des corrections (y compris l'attente maximale entre deux sauts comptés, 750 ms → 500 ms). Voix inchangée. |
| Frise | Redessinée dans l'atelier (`sea/ui.ts`) : pictogrammes plats d'environ 36 px (au lieu de disques blancs de 60 px en relief), sans contour épais ni ombre, sur une corde fine couleur sable (`drawCord`, dessinée en direct car sa longueur dépend du nombre de questions) ; lueur douce (`frise.lueur`) derrière l'étape en cours ; étapes à venir estompées ; petites bulles des questions inchangées. Toujours `pointer-events: none`. |
| Documents | `docs/SPEC.md` (« Leçons animées », « Ergonomie et voix »), `docs/GUIDE-PARENT.md`, `docs/ARCHITECTURE.md`, ce fichier. |

Tests : `tests/unit/correctifs.test.mjs` (correction passée sur la ligne et au pavé : aucune étoile en plus, la question revient, colonne CSV ; leçon passée dès la première vue : pas de 3 étoiles, « À toi ! » et exercice guidé, notée dans la séance ; plus de règle de vues ni de « phrase précédente » ; réglage 1,5), `tests/unit/parent.test.mjs` (nouvelle colonne) ; parcours `tests/e2e/ergonomie.mjs` et `tests/e2e/lecons.mjs` mis à jour, nouveau `tests/e2e/frise.mjs` (captures avant / après en densité 2). Aucune phrase nouvelle n'est dite par la voix : pas de fichier son à fabriquer.

**Écarts et remarques.**

- La vitesse ne s'applique qu'aux exemples guidés et aux corrections, comme demandé : les leçons animées et le petit retour « bravo » du format « sauter » (la tortue refait les sauts après une bonne réponse) gardent la vitesse d'origine, ainsi que l'aide du coquillage au pavé.
- Au pavé, la correction n'a pas d'animation : « passer » y coupe la phrase de correction et garde le résultat écrit une seconde.
- Pendant la seconde où la bonne réponse reste montrée, rien ne se touche (les réponses sont verrouillées) ; la maison reste disponible.
- Le mot « passer » n'est pas dit par la voix (bouton sans consigne orale, comme avant).
- Non vérifié sur la tablette : le confort de la vitesse 1,5 avec la vraie voix (les tests jouent la voix accélérée) ; si les sauts semblent trop rapides pour suivre le comptage, baisser `vitesseAnimations` (par exemple 1,25) dans `seance.json`.

## Lot 1 bis — ergonomie et voix

Spécification : `docs/SPEC.md`, « Ergonomie et voix (lot 1 bis) » ; prompt : `docs/PROMPT-LOT1BIS.md`. Une étape par session.

| Étape | Contenu | État |
| --- | --- | --- |
| 1 | Échantillons de voix : Piper installé, voix françaises de `rhasspy/piper-voices` (siwis, upmc Jessica et Pierre, tom), licence de chacune notée, trois phrases (consigne, correction, anecdote) à deux vitesses, dans `docs/voix-echantillons/` avec un tableau (`LISEZMOI.md`) et le script qui les refait | fait (`54f5130`) ; le parent a choisi **siwis, vitesse normale** |
| 2 | Voix générée à l'avance : `tools/voix/` (inventaire de 1 496 phrases tiré de `app/content/`, nombres et symboles en lettres, synthèse Piper, Opus mono 24 kbit/s, fichiers nommés par leur empreinte dans `app/assets/voix/` avec `index.json`, fabrication incrémentale) ; moteur `engine/voice.js` : une phrase = un fichier, synthèse du navigateur en secours, « réécouter » rejoue le fichier ; le service worker reprend les fichiers son déjà en cache ; tests `tests/unit/voix.test.mjs` et `tests/e2e/voix.mjs`, contrôle « aucune phrase sans fichier » dans les parcours séance, leçons et récompenses ; 9,0 Mo | fait (`2772862`) |
| 3 | Ergonomie : maison (pause et reprise exacte, `engine/clock.js`, pause de la voix), frise d'avancement (`session/frieze.js`), « passer » dès la deuxième vue d'une leçon ou d'un exemple guidé, « je ne sais pas » (code NSP) sur la ligne et au pavé, lune « à demain » en décor, « Encore ! » et entraînement libre (`session/free.js` : ligne, additions, revue des leçons ; ni étoiles ni coquillages), prix du coquillage ajusté (au moins un coquillage par séance complète), une seule résolution d'images en cache (`sw.js?r=`), historique du parent (NSP à part, exemples et leçons passés, pauses, entraînement libre). Cartes : mise en page pleine image (cadre nacre, argent ou or, bandeau du nom), les 15 illustrations du lagon et les 5 dos intégrés, **album** (`session/album.js`) depuis l'accueil et le récif ; les 60 cartes dans `cartes.json` (noms des zones 2 à 4). Décisions du parent intégrées (formes à trou, E5 au singulier). Nouveaux dessins de l'atelier : `sea/ui.ts`, cadres et bandeau dans `sea/treasure.ts`. Tests `tests/unit/ergonomie.test.mjs`, `tests/e2e/ergonomie.mjs`, album dans `tests/e2e/recompenses.mjs`, une seule résolution dans `tests/e2e/pwa.mjs` ; voix : 1 517 phrases, 9,4 Mo | fait (`e717694`) |
| 4 | Bilan : `docs/BILAN-LOT1BIS.md` (fait, écarts avec la SPEC, mesures, points à valider et à vérifier sur la tablette) ; `docs/GUIDE-PARENT.md` mis à jour (voix enregistrée, maison, frise, « je ne sais pas », « passer », « Encore ! », album, coquillage à 25 étoiles, historique du parent) ; lien dans le `README` ; `origin/main` (journal de conception) fusionné ; demande de fusion vers `main` | fait |

**Le lot 1 bis est terminé.** Suite : fusion de la demande par le parent, publication, essais de plusieurs soirs sur la tablette (écouter la voix, regarder les cartes en grand, mesures réelles), puis bilan en conception et préparation du lot 2 (voir `docs/JOURNAL-CONCEPTION.md`).

### Décisions et remarques du lot 1 bis

- Étape 1 : Hugging Face est accessible depuis l'environnement. Voix essayées : les trois modèles français « medium » (siwis, upmc à deux locuteurs, tom) ; `fr_FR-mls-medium` (125 locuteurs d'un corpus de livres audio) et les modèles « low » ont été écartés (qualité moindre ou choix trop large pour un échantillon).
- Licences relevées (MODEL_CARD) : siwis CC-BY 4.0, upmc CC-BY-SA 4.0, tom AGPLv3. Piper (`piper-tts` 1.8.0) est sous GPL-3.0 et ne sert qu'à fabriquer les sons, hors de l'application. La voix choisie sera créditée (`app/assets/voix/`, étape 2).
- Vitesse « un peu ralentie » : `length_scale` 1,15 (1,0 = vitesse du modèle).
- Piper n'est pas déterministe (un peu de hasard dans le rythme) : à l'étape 2, les fichiers son seront fabriqués une fois et versionnés, et l'outil ne refabriquera que les phrases nouvelles ou modifiées. Écart avec la règle « même source, mêmes images » de l'atelier, qui ne vaut ici que pour les images.
- Format des échantillons : MP3 mono 64 kbit/s (lisible partout pour l'écoute par le parent). Le format de l'application (Opus ou MP3) sera choisi à l'étape 2 selon le poids total.
- Voix choisie par le parent (26 septembre 2026) : `fr_FR-siwis-medium`, vitesse normale (`length_scale` 1). Crédit CC-BY 4.0 dans `app/assets/voix/CREDITS.txt`.
- **Défaut trouvé et corrigé (lot 1)** : `text.pick()` remplissait les gabarits avant que les nombres soient fournis et effaçait les variables inconnues. L'échauffement disait donc « plus ? » au lieu de « 0 plus 6 ? », et le bilan « Regarde tout ce que tu as gagné ce soir : ! ». C'est le défaut que `docs/SPEC.md` attribue à la synthèse du navigateur (« 0 plus 6 ? » lu « plus ») : la synthèse n'y était pour rien. `fill` laisse désormais intacte une variable non fournie. Trouvé par le nouveau contrôle « aucune phrase dite sans fichier ».
- **Défaut trouvé et corrigé (lot 1)** : au format « sauter », l'erreur E3 (oublier le point de départ) faisait dire « La ligne commence à 0, pas à zéro. ». Nouveau texte `erreur.E3sauter` : « La tortue part de {a}, pas de zéro. » (proposition à valider).
- Une phrase = un fichier ; un texte de plusieurs phrases joue plusieurs fichiers à la suite (140 ms entre deux). Les nombres ne sont jamais recollés à l'intérieur d'une phrase (SPEC respectée) ; le découpage entre phrases entières réduit l'inventaire (par exemple, « À toi ! » n'est pas refabriqué devant chaque consigne).
- Écart avec la SPEC : si une phrase d'un texte n'a pas de fichier, **tout le texte** est lu par la synthèse du navigateur (pour ne pas mêler deux voix). Cela arrive seulement pour un nom de pieuvre tapé par le parent (les six noms proposés ont leurs fichiers) et pour un bilan de plus de 60 étoiles dans une séance (inventaire de 0 à 60 ; d'après le déroulé d'une séance, estimation : une trentaine au plus, bonus de fin de séance non compris puisqu'ils sont annoncés à part).
- Domaines des nombres (`tools/voix/inventaire.mjs`) : 0 à 100 pour « placer », « estimer », « C'était n. », le départ de l'exemple guidé et les nombres comptés à voix haute ; les départs et sauts réellement possibles pour « sauter », E3 et E5 ; les 66 additions (0 compris) sous leurs trois formes et leur correction. Les deux formes à trou n'avaient pas de texte : ajout de `faitTrouDroite` (« 3 plus combien font 7 ? ») et `faitTrouGauche` (« Combien plus 4 font 6 ? »), **propositions à valider**, utilisées à partir du lot 2.
- « 1 dizaines et 2 unités. » (erreur E5) reste écrit ainsi dans `textes.json` ; la voix dit « une dizaines », qui se prononce comme « une dizaine ». Le féminin est géré pour étoile, dizaine, unité (« vingt et une étoiles »).
- Format : Ogg Opus mono 24 kbit/s (lu par Chrome sur Android) plutôt que MP3 : deux à trois fois plus léger à qualité égale pour la voix. 9,0 Mo pour 1 496 phrases (objectif : moins de 15 Mo). Je n'ai pas pu écouter le résultat : la vérification est automatique (décodage, durées, enchaînement dans Chromium) ; l'écoute sur la tablette reste à faire.
- Le débit est celui des fichiers (vitesse normale choisie) ; le réglage 0,9 ne vaut plus que pour la synthèse de secours.
- Mise à jour de l'application : les fichiers son étant nommés par l'empreinte de leur contenu, le service worker reprend ceux déjà en cache au lieu de retélécharger 9 Mo à chaque nouvelle version.

**Étape 3 (ergonomie et cartes).**

- Décisions du parent (26 septembre 2026) intégrées : formes à trou « 3 plus combien, ça fait 7 ? » et « Combien plus 4, ça fait 6 ? » (`faitTrouDroite`, `faitTrouGauche`) ; erreur E5 accordée au singulier (« 1 dizaine et 3 unités. », « 2 dizaines et 1 unité. ») par quatre fragments de `textes.json` (`uneDizaine`, `desDizaines`, `uneUnite`, `desUnites`). La voix des 150 phrases concernées a été refabriquée.
- **Coquillage à 25 étoiles au lieu de 40** (`cartes.json`, sans toucher au moteur), **à valider**. Constat : une première séance complète rapporte bien moins que les « 35 à 50 étoiles » de la SPEC : le test `tests/unit/session.test.mjs` simule la séance la plus courte (5 faits, 8 questions, leçon L1 regardée) avec une réponse sur deux juste : 28 étoiles ; toutes justes, une trentaine. À 40 étoiles, la première séance ne donnait donc aucun coquillage. À 25 : un coquillage dès la première séance, environ un par séance ensuite, parfois deux (au plus 2 par séance, règle inchangée).
- **Pause** : la maison n'est visible que pendant l'échauffement, la notion du jour (leçons comprises) et l'entraînement libre, pas pendant l'accueil ni la récompense (la séance y est déjà terminée). Pendant la pause, l'écran d'accueil ne montre que la bulle « continuer » et le logo du parent (pas le récif ni l'album : ils partagent la scène avec la séance). Écart avec la SPEC (« ramène à l'accueil ») : c'est un accueil réduit. La reprise est exacte à une animation près : un saut de tortue déjà commencé (moins d'une seconde) se termine pendant la pause ; la phrase interrompue est redite depuis son début ; si la séance attendait une réponse, la voix dit « On continue ! » puis la consigne. Le temps de pause n'est compté ni dans le plafond de 12 minutes, ni dans la durée d'étape, ni dans la durée enregistrée (il est noté à part : `pauses`, `pauseS`).
- **« Je ne sais pas »** : une bulle de parole avec un « ? » corail, en bas à droite (ligne) ou à droite du pavé. Correction animée : la méthode de l'exemple guidé (la tortue compte depuis 0 ou depuis le nombre écrit le plus proche ; le milieu de la corde pour « estimer » ; les sauts pour « sauter ») ; au pavé, la voix rassure puis donne la réponse. La voix dit la phrase de la SPEC : « Ce n'est pas grave, regardons ensemble. »
- **« Passer »** (deux triangles jaunes, en haut à droite) : les vues sont comptées à partir de cette version (réglage `vues`) ; une leçon vue au lot 1 comptera donc encore une vue obligatoire. Une leçon passée ne rapporte pas ses 3 étoiles, mais elle est suivie comme les autres de « À toi ! » et de l'exercice guidé, et n'est plus relancée comme leçon d'entrée du niveau (proposition à valider).
- **Entraînement libre** : trois bulles (la ligne, les additions, les leçons déjà vues ; les leçons sont reconnues aux nombres que la tortue y écrit : « 1 2 3 », « 10 20 », « 30 31 »). Pas de frise (pas de fin prévue). Un niveau franchi en entraînement libre compte, mais ne donne pas d'étoile arc-en-ciel (« ni étoiles »). Additions : les faits dus d'abord ; s'il n'y en a pas, des faits déjà rencontrés, qui ne montent pas de boîte (une erreur les fait redescendre). Les réponses vont dans une séance marquée « libre », visible dans l'historique du parent, absente du calendrier.
- **Lune** : un croissant dans son halo, sans bulle, qui flotte en haut de l'écran ; le toucher ne fait rien. La phrase « Tu as déjà bien travaillé aujourd'hui… » (dite avant en touchant la lune) n'est plus utilisée.
- **Cartes** : 330 × 440 (3:4). L'illustration remplit la carte ; cadre fin (9 px) en nacre (commune, avec une perle à chaque coin), argent (rare, étincelles) ou or (légendaire, étoiles) ; bandeau d'eau sombre à 58 % d'opacité avec le nom écrit au feutre crème. Les dessins provisoires des 15 créatures ont quitté la planche des cartes (toutes les illustrations du lagon existent) ; une carte sans image montrerait un fond d'eau. Les images sont décodées à la taille affichée et libérées en quittant le récif ou l'album. Relecture des 20 images sur une planche réduite : aucun texte, rien d'aberrant repéré à cette taille ; la relecture détaillée de l'anatomie demandée par la SPEC reste à faire en grand.
- **Album** : une page par zone, onglets à droite (le dos de chaque zone, assombri et fermé d'un coquillage si la zone n'est pas ouverte) ; 15 vignettes sans nom (l'enfant ne lit pas encore ; le nom apparaît sur la carte en grand) ; 15 perles sous la zone. Dans le récif, le livre est en bas à gauche, au-dessus de la maison.
- **Écart de texte** : pour une zone fermée, la SPEC propose « Le grand large s'ouvrira quand tu auras gagné une étoile arc-en-ciel. » Or l'enfant gagne déjà des étoiles arc-en-ciel au lot 1 alors que les zones ne s'ouvriront qu'au lot 4 : la phrase deviendrait fausse. Texte retenu, **à valider** : « Le grand large s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. » (idem pour le récif de corail et « Les abysses et les mers glacées s'ouvriront… »). Ajout hors SPEC : toucher le dos doré d'une légendaire dit « C'est une carte légendaire ! Elle se gagne avec les étoiles dorées. »
- **Cartes des zones 2 à 4** : les 45 noms de la SPEC (avec l'article pour la voix), `anecdote`, `illustration` et `recif` à `null` : elles ne se gagnent pas encore (zones fermées ; légendaires jamais tirées d'un coquillage) et leurs noms ne sont pas encore dits par la voix.
- **Une seule résolution en cache** : `main.js` enregistre `sw.js?r=1` ou `?r=2` selon l'échelle d'affichage (le même choix que `sprites.js`) ; sur la tablette (densité 2), les 9 planches @1x (5,7 Mo) ne sont plus téléchargées. Limite : si l'échelle change (fenêtre redimensionnée), les planches de l'autre résolution sont téléchargées et gardées à la première utilisation, donc pas disponibles hors ligne avant.
- Mesure du 26 septembre 2026 (processeur ÷4, densité 2, sans leçon ni échauffement) : démarrage 1,2 à 1,3 s ; intervalle moyen 17,5 ms, 95e centile 16,8 ms, 10 images au-delà de 33 ms ; 156 Mo de planches décodées. Le parcours `perf.mjs` saute désormais la leçon L1 (avec la voix fabriquée, elle dure plus d'une minute avant la première question).
- Voix : 1 517 phrases, 9,4 Mo (148 fichiers remplacés : formes à trou, E5 au singulier). L'écoute des nouvelles phrases sur la tablette reste à faire.
