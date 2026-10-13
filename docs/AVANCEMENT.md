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

- **Branche** : `ccr-98d11c55-0bfws4` ; demande de fusion en brouillon « Lot : Décisions sur les constats de l'agent ».
- **Ordre suivi** (du plus court au plus lourd, chaque décision un commit) : 2 (fin de séance), 3 (« continuer » en deux touchers), 7 (boutique), 5 (répétition des additions, simulée avant), 6 (voiliers), 4 (bulle), 8 (finition), 1 (reprise après rechargement), puis la recette.
- **Fait** : décisions 2 (maison en fin de séance, 15 s), 3 (accueil en pause en deux touchers), 7 (prix pour briller), 5 (répétition des additions, simulée : journal), 6 (voiliers), 4 (la bulle évite ce dont parle la voix), 8 (finition).
- **Où reprendre** : décision 1 (reprise après rechargement), puis la recette.
