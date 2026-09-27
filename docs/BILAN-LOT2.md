# Bilan du lot 2 — séance, cartes, son, module 2, nombres jusqu'à 1 000

Lot décidé le 27 septembre 2026 après la recette du lot 1 bis (spécification : `docs/SPEC-LOT2.md` ; prompt : `docs/PROMPT-LOT2.md`). Neuf étapes, du 27 septembre 2026, en quatre demandes de fusion : étapes 1 (PR #11), 2 (PR #13), 3 (PR #14), 4 à 6 (PR #16), 7 à 9 (PR #17). Le détail de chaque étape (décisions prises, écarts, recettes allégées) est dans `docs/AVANCEMENT.md`.

## Ce qui est fait

| Étape | Contenu | Demande de fusion |
| --- | --- | --- |
| 1 | Cartes et rythme : calendrier et quota (2 cartes nouvelles par semaine d'école), doublons, brillantes, ouverture des zones, zone 2 (récif de corail) avec anecdotes et voix, étoiles dorées (4 semaines réussies), légendaires et coquillage doré, étoile arc-en-ciel de l'entraînement libre, surprise une séance sur cinq | #11 |
| 2 | Séance et progression : séance plus longue, places réservées et voie rapide des faits, enchaînement des niveaux, leçon au plus une fois par séance, point de départ du parent, tortue devant la pieuvre, pieuvre qui montre la cible, sélecteur de difficulté à 4 crans | #13 |
| 3 | Son, échantillons : outil `tools/son/`, trois musiques et les bruitages, choix du parent | #14 |
| 4 | Son, intégration : bruitages « a », les trois musiques tirées au hasard, mixage, baisse sous la voix, réglages du parent | #16 |
| 5 | Atelier : bernard-l'ermite (repos et gestes), cadre de 10, maison des nombres, double + 1 | #16 |
| 6 | Module 2 comme notion du jour : familles 3 à 7, formes à trou, leçons L4 à L6, alternance avec la ligne graduée, module imposé par le parent | #16 |
| 7 | Défi record (une minute, bulle qui se vide, perles, drapeau du record), grille des 66 additions, progression du module 2 dans l'espace parent | #17 |
| 8 | Nombres jusqu'à 1 000 : niveaux 9 à 13, dictée, erreurs E6 et E7, chaluts et filets, leçon L10 ; voix des grands nombres (26,9 Mo de voix en tout, sous 40 Mo) | #17 |
| 9 | Ce bilan, le guide du parent relu, la recette complète sur l'année, et les quatre corrections de la relecture extérieure (ci-dessous) | #17 |

**Pour l'enfant.**

- **Une vraie séance de 9 à 11 minutes** : un choix de niveau (quatre bulles de vagues, « conseillé » déjà choisi), 12 à 16 additions à l'échauffement, puis la notion du jour, qui **alterne** d'une séance à l'autre entre la ligne des nombres (avec la tortue) et les additions (avec le bernard-l'ermite), puis, à partir de la 5e séance, **une minute de défi** où elle essaie de battre son propre record.
- **Les additions par familles** : « + 1 et + 2 », doubles, amis de 10 (la boîte à dix places), maisons des nombres, presque-doubles, mélange ; une petite leçon animée pour les doubles, les amis de 10 et la maison ; des additions à trou (« 3 plus combien, ça fait 7 ? ») quand une famille est à moitié sue. Une famille qui résiste six séances laisse la place à la suivante (elle revient en révision).
- **Les nombres jusqu'à 1 000** : la ligne de 0 à 1 000, les centaines découpées, la dictée au pavé, l'estimation ; la leçon des chaluts (dix filets de dix poissons) ; deux erreurs nouvelles reconnues et expliquées (307 écrit 37 ou 3007).
- **Des cartes toute l'année** : deux cartes nouvelles par semaine d'école, le récif de corail ouvert (15 cartes avec leurs anecdotes), des brillantes (une carte nouvelle sur cinq, un doublon sur vingt), les légendaires gagnées avec les étoiles dorées ; une petite surprise à l'accueil une séance sur cinq.
- **Du son** : de petits bruitages doux et une musique calme, sous la voix.
- **Toujours une issue** : « passer » sur les leçons, les exemples, les corrections et, depuis l'étape 9, sur l'aide des additions.

**Pour le parent (espace parent).** Le point de départ (niveau 1 à 13, familles d'additions connues), la notion du jour imposée pour une séance, les crans de difficulté autorisés, le défi record (oui ou non), le son (musique, volume, bruitages), la grille des additions et l'historique de chaque fait, les familles (ouverte, acquise, « en révision »), les courbes semaine par semaine, le bloc « Cartes » et le bloc « Défi record » ; depuis l'étape 9, **« Terminer la séance »** pendant une pause.

**Technique.** Tout ce qui se règle est dans `app/content/` (`seance.json`, `module1.json`, `module2.json`, `cartes.json`, `calendrier.json`, `son.json`) ; les nouveaux personnages et aides sont dessinés dans l'atelier (`art/src/canvas-core/sea/`) et exportés en planches ; les planches lourdes (bernard-l'ermite, défi, centaines) ne sont chargées que le temps de leur étape.

## Les corrections de la relecture extérieure (décisions du parent du 27 septembre)

| Correction | Ce qui est fait | Vérification |
| --- | --- | --- |
| 1. Aide des additions passable | Le coquillage et l'aide affichée d'emblée du cran « plus facile » ont le bouton « passer » habituel (même dessin, même place) dès leur début ; un toucher coupe la voix et l'animation, range l'appui et rend le pavé | parcours `aide-passer.mjs` : « passer » 3 à 5 ms après le toucher du coquillage, pavé rendu 40 à 60 ms après « passer », pour la tortue et le cadre de 10, aux crans conseillé et « plus facile » ; `recette-durees.mjs` (tableau ci-dessous) |
| 2. Sortie de la pause | Pas de bouton d'arrêt pour l'enfant ; pendant une pause, l'espace parent montre « Terminer la séance… » puis une confirmation ; la séance est enregistrée interrompue, sans récompense, et l'accueil revient | parcours `pause-parent.mjs` : séance notée « terminée : non », sans étape de récompense, étoiles gagnées gardées, accueil propre (sans bernard-l'ermite, pavé ni « passer »), nouvelle séance possible |
| 3. Cran « plus facile », additions | Un fait réussi avec l'aide affichée d'emblée ne change pas de boîte (ni montée, ni retour en boîte 1) ; réponse notée « aide d'emblée » | test unitaire ; simulation « plus facile » : les faits montent seulement à l'échauffement (sans aide), les familles sont acquises plus tard qu'avant (2 séances par semaine : la famille 1 à la 11e séance au lieu de la 8e, toutes les familles à la 30e au lieu de la 14e) ; guide du parent |
| 4. Stagnation du module 2 | Une famille pas acquise après 6 séances d'additions (réglage `familles2.stagnation` de `module2.json`) laisse la place à la suivante, avec sa leçon ; elle reste travaillée en révision | tests unitaires ; simulation ci-dessous |

**Profil « diff » sur l'année (simulation, familles et leçons).**

| | 2 séances par semaine (64 séances) | 5 séances par semaine (160 séances) |
| --- | --- | --- |
| Familles ouvertes | toutes (1 et 2 dès la 1re séance, 3 à la 9e, 4 à la 10e, 5 à la 11e, 6 à la 12e, 7 à la 13e) | toutes (3 à la 6e, 7 à la 12e) |
| Familles dépassées (séance) | 1 (12e), 2 (24e), 3 (36e), 4 (48e), 5 (60e) | 1 (12e), 3 (26e), 4 (38e), 5 (50e), 6 (62e) |
| Familles acquises | aucune | la 2 (14e séance) |
| Famille en cours, séance d'additions par séance d'additions | 1 ×6, 2 ×6, 3 ×6, 4 ×6, 5 ×6, 6 ×2 | 1 ×6, 2, 3 ×6, 4 ×6, 5 ×6, 6 ×6, puis le mélange |
| Leçons du module 2 jouées | L4 (5 fois : entrée à la 14e séance, puis relancée après 3 erreurs sur 5), L5 (6 fois, dès la 26e), L6 (6 fois, dès la 38e) | L4, L5, L6 (entrée et relances) |
| Avant la correction | la famille 1 restait la famille en cours toute l'année ; **aucune leçon du module 2** | — |

Toutes les leçons jouées sur l'année (2 par semaine) : L1 (séances 1, 3, 5, 7, 9), L3 (9 à 17), L4 (14 à 24), L2 (19 à 57, une séance de ligne sur deux), L5 (26 à 36), L6 (38 à 48), L10 (63). Aucune leçon deux fois dans une même séance. Les autres profils ne dépassent aucune famille.

## Écarts avec la spécification

Les écarts de chaque étape sont dans `docs/AVANCEMENT.md` ; les principaux :

| SPEC | Ce qui est fait | Raison |
| --- | --- | --- |
| Échauffement 10 à 14 faits, notion 12 à 16 questions | relevés (règle « la durée prime ») : 12 à 16 faits, 36 à 44 questions de ligne, 50 à 60 d'additions en notion du jour | à 12 à 16 questions, la séance durait 4 min 30 s |
| Musique sous 3 Mo | 3,7 Mo (trois musiques à 64 kbit/s) | le parent a choisi les trois musiques |
| « Bouées géantes à chalut » sur la ligne jusqu'à 1 000 | un petit chalut au-dessus de chaque centaine | les niveaux 9 à 13 sont des lignes d'école, sans bouées |
| Quatre cartes rares liées aux nouveaux décors (SPEC-COMPLÉMENTS) | pas ajoutées | contenu (illustrations) à fournir par le parent |
| Défi : « faits mélangés » | aussi les formes à trou des familles qui les ont ouvertes | comme l'évaluation |
| Leçons d'appui jamais vues (L6 pour les maisons de 8 et 9, L4 pour les presque-doubles) | ajout | sans cette règle, L6 n'était presque jamais jouée |

## Recette complète (27 septembre 2026, soir)

Outils : `npm test`, `node tests/sim-seances.mjs` (5 profils, 2 et 5 séances par semaine, du 28 septembre 2026 au 2 juillet 2027), `node tests/e2e/recette.mjs --delai 4.5` (ligne graduée, `--module 2`, `--defi`), `node tests/e2e/recette-durees.mjs` avec et sans `--passer` (niveaux 1 à 13, familles 1 à 6, aides), tous les parcours Playwright. Voix réelle, Chromium, 1280 × 800.

| Critère (SPEC-LOT2, section 8) | Seuil | Mesure | État |
| --- | --- | --- | --- |
| Tests unitaires | tous | 170 sur 170 (dont 2 nouveaux à l'étape 9 : cran « plus facile », stagnation) ; `precache.mjs --check` à jour | tenu |
| Durée d'une séance complète, sans défi (première séance) | 8 à 10 min | ligne graduée **8 min 54 s** (accueil 10 s, échauffement 1 min 19 s, notion 6 min 01 s avec les leçons, récompense 1 min 19 s) ; additions (`--module 2`) **8 min 08 s** | tenu |
| Durée d'une séance avec le défi (`--defi` : 5 séances déjà faites) | 9 à 11 min | **10 min 42 s** (échauffement 1 min 49 s, notion 6 min 04 s, défi 1 min 16 s avec 12 réponses, récompense 1 min 23 s) | tenu |
| Attente sans rien pouvoir faire, hors consigne orale | 3 s ; environ 2 s pour l'aide des additions | hors voix, **au plus 1,0 s** partout (niveaux 1 à 13, familles 1 à 6, aides, avec et sans « passer ») ; avec « passer », au plus 2,5 s entre deux questions ; l'aide (5,5 à 8,6 s sans la passer) a son bouton « passer » dès le début, et le pavé revient 0,2 à 0,3 s après le toucher. Avec la voix : le bonjour puis l'annonce de la notion (7 à 12 s sans bouton avant la première question, voix seule, comme avant) | tenu |
| Faits nouveaux (profil « reel », 2 séances par semaine) | au moins 2 par séance, autant que la boîte 1 le permet | 6, 6, 6, 6, 1, 5, 5 jusqu'aux 33 faits (le 1 : boîte 1 à 7 faits sur 8) | tenu |
| Familles 1 et 2 (profil « sait ») | les 33 faits avant la 7e séance | à la **6e séance** (2 et 5 par semaine) | tenu |
| Cartes (2 séances par semaine, zones 3 et 4 prêtes) | 60, légendaires comprises, avant le 25 juin 2027 ; jamais plus que le quota | **60 cartes le 17 juin** pour les 5 profils (le 15 juin à 5 par semaine) ; 15 le 30 novembre, 30 le 1er février, 45 le 26 avril ; quota jamais dépassé | tenu |
| Tirage des brillantes | 20 % / 5 % (1 000 tirages, écart de moins de 3 points) | test unitaire tenu ; en juin, voir le tableau ci-dessous | tenu |
| Alternance | jamais deux fois de suite le même module | 0 fois, 5 profils, 2 et 5 par semaine (32 + 32 et 80 + 80 séances) | tenu |
| Stagnation du module 2 (profil « diff ») | la famille suivante s'ouvre, avec sa leçon | voir plus haut : 5 familles dépassées, L4, L5, L6 jouées ; aucune pour les autres profils | tenu |
| Défi (simulation, 2 par semaine) | — | premier défi à la 6e séance pour les 5 profils ; 51 à 59 défis sur 64 séances ; meilleurs scores : « sait » 20, « reel » 14, « très dur » et « plus facile » 15, « diff » 9 ; 2 à 5 records battus dans l'année ; séances avec défi 9,4 à 10,5 min estimées | — |
| Nombres jusqu'à 1 000 (simulation, 2 par semaine) | — | niveau 9 à la 9e séance (« sait »), 25e (« reel »), 19e (« très dur »), 63e (« diff ») ; niveau 13 à la 13e, 55e, 25e, jamais pour « diff » (121e à 5 par semaine) ; « plus facile » reste au niveau 2 | — |
| Parcours Playwright | aucune erreur | aucune erreur dans les 17 parcours : pwa, voix, séance, leçons, récompenses, cartes, ergonomie, frise, parent, sélecteur, bernard-l'ermite, additions en notion du jour, défi, centaines, perf, et les deux nouveaux `aide-passer.mjs` et `pause-parent.mjs` ; les trois recettes à vitesse réelle et `recette-durees` (avec et sans « passer ») sans erreur. `perf.mjs` a échoué une fois pendant la série, au moment où je modifiais des fichiers de l'application ; relancé seul deux fois : aucune erreur | tenu |
| Performance (`perf.mjs`) | démarrage < 3 s, 30 images/s | démarrage à froid **2,2 à 2,5 s** (à chaud 2,0 s) ; intervalle moyen entre images 26 à 27 ms (environ 37 images/s, allègement automatique au niveau 2 sur cette machine, plus lente depuis l'étape 6 : `main` y donnait 44,7 ms) ; travail par image 4,5 à 5,3 ms ; 180 Mo de planches décodées (175 à l'étape 2) | tenu (à confirmer sur la tablette) |

**Brillantes en juin** (simulation sur l'année, zones 3 et 4 prêtes ; décision du parent : 20 % pour une carte nouvelle, 5 % pour un doublon) :

| Profil | 2 séances par semaine | 5 séances par semaine |
| --- | --- | --- |
| sait | 13 | 17 |
| reel | 17 | 19 |
| diff | 13 | 30 |
| très dur | 17 | 25 |
| plus facile | 14 | 25 |

(avant la décision : 13 à 42 à 2 séances par semaine, 56 à 57 à 5.)

**Profils « très dur » et « plus facile »** (10 premières séances, 2 par semaine) : très dur, réussite 80 %, 2,7 « je ne sais pas » par séance, 10 descentes de cran, 93 étoiles par séance ; plus facile, réussite 89 %, 1,8 « je ne sais pas », 38 étoiles par séance, niveau 2 de la ligne toute l'année, familles d'additions acquises seulement par l'échauffement (toutes à la 30e séance au lieu de la 14e avant la correction 3).

**Remarque sur la simulation.** Avec la stagnation, le profil « diff » atteint le niveau 8 de la ligne à la 59e séance au lieu de la 47e (même graine) ; sur cinq autres graines, 45 à 59 (ou jamais) au lieu de 37 à 57 : l'écart est dans la dispersion du tirage, mais il penche du même côté. Les séances de ligne ne changent pas (14 questions en moyenne, même durée) ; l'hypothèse la plus probable est l'échauffement, plus chargé en faits nouveaux (45 faits vus à la 56e séance au lieu de jamais). À observer.

## À valider par le parent

1. Les textes nouveaux des étapes 7 et 8 (défi, dictée, E6, E7 ; liste dans `docs/AVANCEMENT.md`) et ceux des étapes 4 à 6.
2. La règle de stagnation telle qu'elle est comprise : seules les séances où la famille est la famille en cours comptent ; une famille dépassée ne redevient jamais la famille en cours (elle revient en révision et peut encore être acquise).
3. Après « passer l'aide » du coquillage, la consigne est redite ; la réponse compte comme faite avec l'aide.
4. Le lot 2 laisse la leçon L2 revenir une séance de ligne sur deux pour une enfant en difficulté (relance après 3 erreurs sur 5, au plus une fois par séance, règle de la SPEC) : à observer.

## À vérifier sur la tablette

- **Écouter** la voix des phrases nouvelles (défi, dictée, grands nombres), les bruitages et les musiques : rien n'a été écouté par une personne.
- La longueur réelle d'une séance avec l'enfant, et le défi (la bulle qui se vide se lit-elle comme un temps ?).
- L'aide passable : que les deux triangles jaunes pendant l'aide ne poussent pas l'enfant à tout passer (le compteur est dans l'historique des réponses : « aide »).
- « Terminer la séance » depuis l'espace parent pendant une pause.
- Fluidité et mémoire : planches plus nombreuses (bernard-l'ermite, défi, centaines chargées à la demande) ; 34 Mo de voix.

## Reste ouvert

Illustrations et anecdotes du grand large (avant début février) et des abysses (avant fin avril) ; cartes animées (idée non spécifiée) ; débit des musiques ; calendrier 2027-2028 ; le calcul rapide (lot 3), les problèmes et le récif animé des zones 2 à 4 (lot 4).
