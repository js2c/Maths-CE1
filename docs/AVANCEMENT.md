# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (10 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : « La boutique du récif » est fait (PR #54) ; « Recette de l'enfant et nettoyage des couches » (fiche 9) est fait (PR #56, à fusionner ; ses questions pour le parent : `docs/IDEES.md`, section 3).
- **En attente du parent** : les 727 phrases de l'étal, des correctifs et de la boutique sont fabriquées (`main`, « Voix : 727 phrases nouvelles, 9 retirées »). Pour le lot « Recette de l'enfant et nettoyage des couches » : 2 phrases nouvelles et 50 phrases à refaire, de durée anormale (`tools/voix/a-refaire-durees.txt`, `docs/VOIX.md`). Ensuite : l'essai de 10 minutes sur la tablette (`docs/GUIDE-PARENT.md`) et les questions de `docs/IDEES.md`, section 3.
- **Projet parallèle** : la refonte graphique (hors de ce fichier).

## Lots

| Lot | Contenu | État |
| --- | --- | --- |
| 1, 1 bis | Application, voix, ligne graduée 1 à 8, échauffement des familles 1 et 2, cartes du lagon, ergonomie | fait |
| 2 | Séance allongée, sélecteur de difficulté, module 2 complet, défi record, nombres jusqu'à 1 000, cartes jusqu'en juin, son, bernard-l'ermite | fait (PR #11 à #17) |
| 3 | Choisir l'exercice et le niveau, difficulté dans le niveau, calcul rapide, accueil en pause, récif par zones, sauvegardes de test | fait (PR #19, #20) |
| 3 bis | Correctif de la recette fonctionnelle : réponse qui varie, amis de 10, calcul « très dur », ligne, toucher, décors du récif, écrans « choisir », légende, appui long, aides, leçons L2, L8, L9, espace parent | fait (PR #22, #23) |
| 3 ter | Passer l'échauffement, échauffement qui s'ajuste, appui long partout | fait (PR #25) |
| Lagon | Le lagon de la maquette du récif vivant en fond de toute l'application | fait (PR #30) |
| Récif vivant | La collection est la maquette du récif vivant ; récompenses sans doublon ; correctif des boutons invisibles | fait (PR #31) |
| Mascotte | Le capitaine en vidéo remplace la pieuvre ; bulle, flèche, bienvenue, relance | fait (PR #34) |
| Les voiliers | Le jeu de la maquette des voiliers devient le module 4 : ranger un nombre entre des bouées, jusqu'à 1 000, mer selon la difficulté | fait (PR #36) |
| Correctifs | Les décisions du parent sur la confrontation de la spécification avec le code (`docs/ECARTS-SPEC.md`) : 7 correctifs, spécification réécrite | fait (PR #39) |
| Les leçons | La bulle des leçons, le menu, « À toi ! », la table d'addition ; recette finie à l'étape 0 du bloc suivant (durées, relecture indépendante) | fait (PR #40, recette dans la PR #42) |
| Sommes jusqu'à 30 et Multiplication | Familles d'additions 8 à 13, leçons L11 et L12 ; cinquième exercice (multiplication, 9 niveaux, tables de 2, 3, 4, 5 et 10), leçons L13 et L14, table de multiplication ; fait d'un seul bloc, sans arrêt pour validation | fait (PR #42) ; 945 phrases à fabriquer |
| Correctifs de la tablette | Écran de démarrage (logo, barre de chargement, toucher qui autorise la voix), bienvenue au lancement ; choisir en deux touchers ; toucher la mascotte pour réécouter ; clavier de l'ordinateur ; ardoise jamais vide ; plus de phrase dite par l'ancienne voix (contrôle dans tous les parcours) ; fins de ligne sous Windows | fait (PR #46) ; voix fabriquées |
| L'étal du pêcheur | Sixième exercice, la monnaie (module 6) : la maquette de l'étal intégrée, 10 niveaux (pièces et billets, payer juste, sans pièce de trop, rendre la monnaie, deux produits, centimes), l'orage, leçons L15 à L18, espace parent ; d'un seul tenant | fait (PR #49) ; 394 phrases à fabriquer |
| Correctifs : passage de l'échauffement aux voiliers | L'essai du parent du 10 octobre : un échauffement quitté ne repart plus par-dessus l'exercice suivant, la bulle toujours pleine, la mer des voiliers sans l'ancienne mer, plus d'étiquette d'appui long sur les écrans de choix, l'entourage qui suit la tuile, le logo et le bouton « Parents » du parent, l'accueil en cinq galets et deux touchers, plus de voix de secours (phrases sans voix notées pour le parent), mises à jour sans mélange de versions, l'icône ; d'un seul tenant | fait (PR #52, à fusionner) ; 12 phrases à fabriquer |
| La boutique du récif | L'enfant achète ses créatures avec ses étoiles (vitrine par zone, coche verte, faire briller, arrivages de 2 créatures par semaine ou rythme libre), plus de coquillage ordinaire ; coquillage de la série, premier habitant d'une zone, étoile et coquillage de diamant ; la créature achetée arrive à la nage dans le récif ; espace parent (rythme, achats, export) ; d'un seul tenant | fait (PR #54) ; 321 phrases à fabriquer |
| Recette de l'enfant et nettoyage des couches | Une seule règle de sortie (portées), inventaire des couches et retrait de ce qui ne sert plus (`docs/COUCHES.md`), l'enfant imprévisible (`tests/e2e/enfant.mjs`, 200 graines de 300 actions), deux passages d'un agent qui joue l'enfant, la barre noire, la voix (durées anormales), les voiliers nets, la lampe de l'étal, les parcours qui échouaient sur `main` | fait (PR #56) ; 2 phrases nouvelles, 50 à refaire |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Décisions sur les constats de l'agent » (fiche 11)

- **Branche** : `claude/elegant-cannon-a4egyg` depuis la reprise du 13 octobre après-midi (la première session travaillait sur
  `ccr-98d11c55-0bfws4`, brouillon PR #58 ; ses commits sont repris tels quels). La demande de fusion finale part de la nouvelle branche.
- **Fait à la reprise** : `docs/IDEES.md` (questions tranchées retirées) ; `mise-a-jour.mjs --court` passe (la séance de A reprise par B) ;
  tous les parcours `tests/e2e/*.mjs` lancés : 5 échecs, tous propres aux parcours (ils ne connaissaient pas la reprise, les galets de
  la pause, l'écart de 4 questions), corrigés et repassés (`crans`, `lagon`, `lot3ter`, `mascotte`, `notion2`) ; réglage d'essai
  `?sansReprise` ; `perf.mjs` a montré un démarrage plus lent de 0,3 à 1 s (la lecture de la séance à reprendre, après le toucher) :
  les séances sont lues pendant l'écran de démarrage, le démarrage est revenu à celui de `main`.
- **Fait (code, tests unitaires, parcours, SPEC, journal)** : les 8 décisions, un commit chacune :
  - 2 (maison en fin de séance, 15 s), 3 (accueil en pause en deux touchers), 7 (prix pour briller seulement sur la tuile touchée),
    5 (répétition des additions : 2 passages, 4 questions d'écart ; simulée avant/après, chiffres dans `docs/JOURNAL-CONCEPTION.md`),
    6 (voiliers : toucher un passage, « partout » à moins d'un intervalle), 4 (la bulle évite ce dont parle la voix ; bulle courte),
    8 (compteur dans l'orage, bulle de l'étal, étoile arc-en-ciel vers l'album), 1 (reprise après un rechargement).
  - `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/COUCHES.md` (2.9), `docs/GUIDE-PARENT.md` (section « d sexdecies »), journal (décisions
    du 13 octobre et « choix de la session ») : à jour.
  - Liste du mode hors ligne refaite (`node tools/precache.mjs`) ; `node tools/precache.mjs --check` passe.
- **Recette faite** :
  - `npm test` : 393 réussis, 1 échec attendu (les phrases sans fichier : 2 du lot précédent + 3 de ce lot : « Continuer. »,
    « On reprend la séance. », « Fais glisser le bateau jusqu'au passage ! » ; plus les 50 à refaire de `tools/voix/a-refaire-durees.txt`).
  - Simulation par profil avant/après (décision 5) et `b-sequences.mjs --test` : 252 combinaisons, 1 008 séances, **0 en défaut**
    (avant la règle : 655 en défaut sur la nouvelle vérification). Séquences avant/après de la famille 3 : `tests/recette-fonctionnelle/out-decisions-agent/sequences/`.
  - `tests/e2e/decisions-agent.mjs --vite` : toutes les parties passent (1 à 8), une à une (`--seul N`, `--cas a,b,c,e,f,h` pour la 1).
  - Enfant imprévisible, version courte (3 graines × 60 actions) : aucun défaut. Série « rechargements fréquents » (`--recharges 15`,
    graines 2001 à 2020) : les 4 premières sans défaut au moment de l'arrêt ; **à relancer en entier**.
- **Reste à faire** (dans cet ordre) :
  1. Relancer `node tests/e2e/mise-a-jour.mjs --court` sur une machine calme : il a échoué une fois sur un délai de 30 s au chargement de
     l'étape 4 (machine saturée ; le cas ajouté, « la séance de A reprise par B », n'a pas pu être vérifié). Si l'échec se répète, regarder
     si la séance en cours (ajoutée à la fin de l'étape 3) gêne le rechargement de la mise à jour.
  2. Tous les parcours `tests/e2e/*.mjs` sur la branche (l'outil : une boucle séquentielle, un journal par parcours) ; relancer sur `main`
     ceux qui échouent. Déjà vu : `aide-passer` a échoué une fois (« passer » non visible au moment du toucher, sans doute la charge) :
     à relancer seul, puis sur `main` s'il échoue encore. Sur `main`, `etal` a échoué (rc 1) et `etat-quitte` a dépassé 25 min lors d'une
     passe partielle sous charge : à revérifier.
  3. `tests/e2e/decisions-agent.mjs` complet (les trois vues : 1280 × 800, 1920 × 1200, tablette) pour les captures du lot.
  4. La série de l'enfant imprévisible : `node tests/e2e/enfant.mjs --graines 20 --depart 2001 --actions 60 --recharges 15 --parallele 2`.
  5. `tests/e2e/recette.mjs --delai 4.5`, `tests/e2e/recette-durees.mjs` (avec et sans `--passer`), `tests/e2e/perf.mjs` (avant sur `main`, après).
  6. La relecture indépendante (méthode commune, point 4) : un agent qui n'a pas vu le travail ; lui donner la section « Les deux personnes
     à incarner » de `docs/archives/PROMPT-RECETTE-LOT3.md`, les captures `tests/e2e/out/decisions-agent/` et les séquences
     `tests/recette-fonctionnelle/out-decisions-agent/sequences/`, puis les sections de `docs/SPEC.md` citées par la fiche ; rapport dans
     `tests/recette-fonctionnelle/out-decisions-agent/RELECTURE.md`.
  7. La demande de fusion complète (méthode commune, point 5 ; fiche : « Choix faits sans le parent », phrases à fabriquer et total en
     attente, chiffres de la décision 5, la limite de la reprise : une réponse fausse dont la correction était à l'écran au rechargement
     n'est pas enregistrée), le tableau de `docs/LOTS.md` (« fait »), cette rubrique déplacée dans l'archive, sortir du brouillon.
- **Points d'attention pour la demande de fusion** : décision 5, effet sensible sur le calendrier (profil « en difficulté » : aucune
  famille acquise plus tard, mais familles 3 à 5 ouvertes nettement plus tard, environ 9 semaines pour la famille 3 ; profil « réel » :
  familles 8 et 9 acquises 2,5 à 3,5 semaines plus tard) ; décision 1, pas de migration de schéma (choix expliqué dans le journal).
