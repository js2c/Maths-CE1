# Avancement

Tenu à jour par chaque session Claude Code. L'historique détaillé des lots 1 à 3 ter (ce qui a été fait, décisions prises en cours de route, recettes) est dans `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.

## Où en est-on (17 octobre 2026)

- **En ligne** (https://js2c.github.io/Maths-CE1/) : lots 1, 1 bis, 2, 3, 3 bis, 3 ter et « Lagon en fond d'exercices », tous fusionnés (dernière demande de fusion : PR #30, le lagon).
- **Ce que fait l'application** : `docs/SPEC.md` (spécification unique ; ce qui reste à construire y est marqué « à construire », section 13).
- **Prochains lots** : « Correctifs de l'installation et de la veille » (fiche 12) est fait (PR #61, à fusionner, puis à essayer sur la tablette : `docs/GUIDE-PARENT.md`, section « d septdecies »). Le lot suivant reste à décider par le parent (`docs/LOTS.md`, `docs/IDEES.md`).
- **En attente du parent** : aucune phrase à fabriquer pour ce lot. L'essai sur la tablette (relances, longue inactivité, leçons de la monnaie depuis la pause) et l'export du journal technique ; les questions de `docs/IDEES.md`, section 3 (dont les constats de la relecture restés hors du lot).
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

## Reprise

(Chaque session en cours tient ici sa rubrique « Reprise du lot … » : branche, demande de fusion, fait, reste, où elle en est exactement, décisions prises. La rubrique est déplacée dans l'archive une fois le lot fusionné.)

### Reprise du lot « Banc Android et recette en conditions réelles » (fiche 13)

- Branche `ccr-3e7c2366-pv8vt6`, partie de `main` (398d794e, PR #62). Demande de fusion en brouillon : « Lot : Banc Android et recette en conditions réelles ».
- Étapes : 0 mise en place ; 1 les échecs laissés par la PR #61 ; 2 le banc (`tests/e2e/appareils.mjs`, conditions par défaut de `navigateur.mjs`, exceptions déclarées) ; 3 les budgets ; 4 la recette en conditions réelles (journée d'usage, enfant imprévisible, agent, démarrages) ; 5 les smartphones ; 6 le banc devient la règle (CLAUDE.md, LOTS.md, travail `android` de GitHub) ; 7 recette commune, relecture, documents.
- Fait : étape 0 ; étape 1 (decisions-agent : la flèche regardée pendant la phrase ; passages : le bouton attendu avant d'être compté ; la règle : les parcours l'un après l'autre, `tests/e2e/tous.mjs`) ; étape 2 (le banc : `appareils.mjs`, `navigateur.mjs`, raccourcis déclarés, `banc.test.mjs` ; installation, veille, leçons de la monnaie, poissons passés sur les profils) ; étape 5 en partie (« tourne ton téléphone », zones sûres, `cibles.mjs`) ; étape 6 (CLAUDE.md, méthode commune, travail `android`).
- En cours : la journée d'usage (`journee.mjs`, mise au point en version courte et `--ci`), puis la longue sur les quatre profils ; l'enfant imprévisible `--android` ; l'agent (`pilote.mjs --banc`) ; les budgets fixés d'après les mesures (`BUDGETS`, ARCHITECTURE « Le banc Android », BUDGETS_A_REMPLIR) ; la recette commune.
- Constats du banc jusqu'ici : la séance courte des tests de GitHub ne finissait pas (la journée ne savait pas revenir du récif : parcours corrigé) ; minuteries mesurées trop tôt après un lancement (mesure au repos) ; l'accueil en pause garde l'exercice en cours (107 canvas pour l'étal), pas de fuite d'un exercice à l'autre.

