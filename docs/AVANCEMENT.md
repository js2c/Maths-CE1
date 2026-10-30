# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (19 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : « Banc Android et recette en conditions réelles » (fiche 13) est fait (PR #63 ; à essayer sur la tablette : `docs/GUIDE-PARENT.md`, section « d octodecies »). Le banc Android est désormais le banc par défaut de tous les lots. Le lot suivant reste à décider par le parent (`docs/LOTS.md`, `docs/IDEES.md`).
- **En attente du parent** : aucune phrase à fabriquer pour ce lot. Une soirée normale sur la tablette, et l'export du journal technique si quelque chose ne va pas (les temps de démarrage réels y sont notés) ; les questions de `docs/IDEES.md`, section 3.
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
| Décisions sur les constats de l'agent | La séance reprise après un rechargement de la page (le jour même, au début de l'étape), la maison en fin de séance (15 s), l'accueil en pause en deux touchers, la bulle qui évite ce dont parle la voix, la répétition des additions (2 passages, 4 questions d'écart ; après la relecture : le fait retourné espacé, la notion du jour qui s'arrête quand sa famille est épuisée), les voiliers (toucher un passage), le prix pour briller, les finitions ; recette et relecture indépendante | fait (PR #59) ; 4 phrases nouvelles |
| Correctifs de l'installation et de la veille | L'essai de l'application installée (16 octobre) : la relance qui restait sur l'écran bleu (le service worker parcourait tout le cache pour chaque fichier), l'application figée après une longue inactivité (lecteurs de médias peu nombreux et réutilisés), le fond noir des leçons de la monnaie depuis l'accueil en pause, le contrôle des poissons coupés, le journal technique de l'espace parent ; d'un seul tenant | fait (PR #61) ; aucune phrase à fabriquer |
| Banc Android et recette en conditions réelles | Un banc qui imite un vrai Android (quatre profils, la tablette de référence Galaxy Tab S5e : application installée, relancée, tuée, gelée, hors ligne, vraie voix, lecture automatique refusée, lecteurs limités, budgets de mémoire), banc par défaut de tous les parcours et des tests de GitHub (travail `android`) ; la recette de toute l'application sur ce banc (journées d'usage, enfant imprévisible, agent qui joue l'enfant) ; « tourne ton téléphone », zones sûres, taille réelle des cibles ; plus de rechargement quand la fenêtre change ; la reprise à la question près ; le sélecteur sans départ seul quand l'exercice est choisi | fait (PR #63) ; aucune phrase à fabriquer |

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Correctifs des relectures »

- Branche `claude/loving-ritchie-oqan39`, demande de fusion #64 (brouillon). D'un seul tenant, sans phrase nouvelle ni modifiée.
- Contenu (les points des relectures qui ont une valeur par défaut, `docs/IDEES.md`, section 3) : R8 (l'argent qui arrive déclaré à la bulle dans les leçons de la monnaie) ; R9 (les encoches claires du triangle « jouer » / « continuer ») ; l'outil des séquences (en-tête, famille acquise annoncée, « trou ») ; la mesure du temps de démarrage sur le banc (proposition, non appliquée). Non traités, listés dans la demande de fusion : R7 (l'argent sur les ardoises), la bulle sur les écrans pleins.
- Fait : R8 (`lessons/etal.js`, `boitesSortie` ajouté par `art/tools/export-etal.mjs`) ; R9 (`sea/decor.ts`, `drawPlayIcon` : pointes arrondies) ; l'outil des séquences (`b-texte.mjs`, test `b-sequences-texte`) ; le parcours de mesure `tests/e2e/demarrage-temps.mjs`.
- Fait aussi : la mesure du démarrage et la proposition (`tests/recette-fonctionnelle/out-correctifs-relectures/DEMARRAGE.md`) ; le parcours du lot `correctifs-relectures.mjs` (85 contrôles, quatre tailles) ; la relecture indépendante et son traitement (`RELECTURE.md` : R14, la bulle de l'étal dans le ciel en dernier recours, corrigé) ; la documentation.
- Recette faite sur le code final (`tests/e2e/out/recette-lot/BILAN.txt`). Elle a trouvé, hors du contenu du lot et aussi sur `main` : la boutique vide pendant les vacances dans quatre parcours (ils comptent désormais en semaines d'école), le portefeuille de l'étal qui se refermait encore quand la question commençait (corrigé dans `art/tools/export-etal.mjs`), et des attentes du banc trop justes (étal, multiplication, installation), chacune mesurée et corrigée. Restent à expliquer ou à décider : `etat-quitte` « effets » et `notion2` (`docs/IDEES.md`, section 7).
- Reste : la demande de fusion complétée et sortie du brouillon ; à la fusion, la rubrique va dans l'archive.
