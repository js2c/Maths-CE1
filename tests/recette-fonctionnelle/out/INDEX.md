# Matériel de la recette fonctionnelle du lot 3 : index

Produit par les outils de `tests/recette-fonctionnelle/` (session 1 de `docs/PROMPT-RECETTE-LOT3.md`). Aucun jugement ici : seulement ce que l'application montre, dit et génère. Captures au format de la tablette (1280 × 800, densité 1), en JPEG qualité 80, regroupées en planches de 4 (2 × 2) ; chaque légende donne l'écran, l'état, ce que dit la voix à ce moment (les dernières phrases dites depuis la capture précédente) et tout ce qui est touchable.

Bases de départ : **base neuve** (premier lancement) et **un mois** (`node tools/sauvegarde-test.mjs reel 2 4`, fichier `sauvegarde-un-mois.json`).

- `sauvegarde-un-mois.json` : la sauvegarde « un mois » (profil réel, 2 séances par semaine, 4 semaines), restaurée au départ des captures et des séquences.

## Partie A · les écrans et leurs états

Planches de 4 captures (numérotées dans l'ordre). Base neuve et « un mois » (restaurée comme par l'espace parent). Voix accélérée (`?voix=rapide`) sauf pour les leçons (voix réelle, pour capturer chaque étape) ; son coupé. Réglages de test de l'application utilisés : `choix`, `cran`, `sans`, `sansLecon`, `guides`, `lecon`, `etoiles`.

- `A-ecrans/A01-accueil-01.jpg` : L'accueil : accueil (base neuve, premier lancement, avant la séance) ; choix du nom de la pieuvre (base neuve, après « jouer ») ; accueil (un mois, avant la séance du jour) ; sélecteur de difficulté (un mois, juste après « jouer »)
- `A-ecrans/A01-accueil-02.jpg` : L'accueil : sélecteur de difficulté (un cran touché (conseillé)) ; échauffement (un mois, première question) ; accueil en pause (un mois, la maison touchée pendant l'échauffement) ; accueil (base neuve, après la séance du jour (lune, « Encore ! »))
- `A-ecrans/A01-accueil-03.jpg` : L'accueil : entraînement libre (« Encore ! ») (après la séance du jour) ; accueil (un mois, après la séance du jour (lune, « Encore ! »))
- `A-ecrans/A02-choisir-01.jpg` : L'écran « choisir » : choisir : les exercices (base neuve) ; choisir : niveaux de la ligne graduée (base neuve) ; choisir : familles d'additions (base neuve) ; choisir : niveaux du calcul rapide (base neuve)
- `A-ecrans/A02-choisir-02.jpg` : L'écran « choisir » : choisir : les leçons (base neuve) ; choisir : les exercices (un mois) ; choisir : niveaux de la ligne graduée (un mois) ; choisir : familles d'additions (un mois)
- `A-ecrans/A02-choisir-03.jpg` : L'écran « choisir » : choisir : niveaux du calcul rapide (un mois) ; choisir : les leçons (un mois)
- `A-ecrans/A03-questions-01.jpg` : Sélecteur, échauffement, questions : sélecteur de difficulté (base neuve (4 crans, rien de touché)) ; échauffement (base neuve, la consigne d'entrée (« passer » visible)) ; échauffement (base neuve, première question (temps de base)) ; ligne graduée niveau 1 (sauter / lire) (un mois, cran conseillé, question 1)
- `A-ecrans/A03-questions-02.jpg` : Sélecteur, échauffement, questions : ligne graduée niveau 1 (sauter / lire) (un mois, cran conseillé, question 2) ; ligne graduée niveau 4 (un mois, cran conseillé, question 1) ; ligne graduée niveau 4 (un mois, cran conseillé, question 2) ; ligne graduée niveau 5 (lire / placer) (un mois, cran conseillé, question 1)
- `A-ecrans/A03-questions-03.jpg` : Sélecteur, échauffement, questions : ligne graduée niveau 5 (lire / placer) (un mois, cran conseillé, question 2) ; ligne graduée niveau 8 (estimer) (un mois, cran conseillé, question 1) ; ligne graduée niveau 8 (estimer) (un mois, cran conseillé, question 2) ; ligne graduée niveau 9 (centaines) (un mois, cran conseillé, question 1)
- `A-ecrans/A03-questions-04.jpg` : Sélecteur, échauffement, questions : ligne graduée niveau 9 (centaines) (un mois, cran conseillé, question 2) ; ligne graduée niveau 12 (dictée) (un mois, cran conseillé, question 1) ; ligne graduée niveau 12 (dictée) (un mois, cran conseillé, question 2) ; additions famille 3 (un mois, cran conseillé, question 1)
- `A-ecrans/A03-questions-05.jpg` : Sélecteur, échauffement, questions : additions famille 3 (un mois, cran conseillé, question 2) ; calcul rapide niveau 2 (mur) (un mois, cran conseillé, question 1) ; calcul rapide niveau 2 (mur) (un mois, cran conseillé, question 2) ; calcul rapide niveau 7 (chemin) (un mois, cran conseillé, question 1)
- `A-ecrans/A03-questions-06.jpg` : Sélecteur, échauffement, questions : calcul rapide niveau 7 (chemin) (un mois, cran conseillé, question 2)
- `A-ecrans/A04-aides-01.jpg` : Les aides : additions famille 1 (question, coquillage visible) ; additions famille 1 (aide du coquillage en cours) ; additions famille 1 (après l'aide) ; additions famille 2 (question, coquillage visible)
- `A-ecrans/A04-aides-02.jpg` : Les aides : additions famille 2 (aide du coquillage en cours) ; additions famille 3 (question, coquillage visible) ; additions famille 3 (aide du coquillage en cours) ; additions famille 4 (question, coquillage visible)
- `A-ecrans/A04-aides-03.jpg` : Les aides : additions famille 4 (aide du coquillage en cours) ; additions famille 5 (question, coquillage visible) ; additions famille 5 (aide du coquillage en cours) ; additions famille 6 (question, coquillage visible)
- `A-ecrans/A04-aides-04.jpg` : Les aides : additions famille 6 (aide du coquillage en cours) ; additions famille 7 (question, coquillage visible) ; additions famille 7 (aide du coquillage en cours) ; calcul niveau 1 (chemin) (question, coquillage visible)
- `A-ecrans/A04-aides-05.jpg` : Les aides : calcul niveau 1 (chemin) (aide du coquillage en cours) ; calcul niveau 2 (mur) (question, coquillage visible) ; calcul niveau 2 (mur) (aide du coquillage en cours) ; calcul niveau 2 (mur) (après l'aide)
- `A-ecrans/A04-aides-06.jpg` : Les aides : calcul niveau 6 (mur, + 9) (question, coquillage visible) ; calcul niveau 6 (mur, + 9) (aide du coquillage en cours) ; calcul niveau 7 (chemin, passer la dizaine) (question, coquillage visible) ; calcul niveau 7 (chemin, passer la dizaine) (aide du coquillage en cours)
- `A-ecrans/A04-aides-07.jpg` : Les aides : calcul niveau 7 (chemin, passer la dizaine) (après l'aide)
- `A-ecrans/A05-corrections-01.jpg` : Les corrections : correction E1 · exercice 1:2 (module:niveau) (question, l'enfant va répondre 4) ; correction E1 (réponse 4 : début de la correction) ; correction E1 (correction, 2,5 s plus tard) ; correction E2 · exercice 1:5 (module:niveau) (question, l'enfant va répondre 3)
- `A-ecrans/A05-corrections-02.jpg` : Les corrections : correction E2 (réponse 3 : début de la correction) ; correction E2 (correction, 2,5 s plus tard) ; correction E3 · exercice 1:4 (module:niveau) (question, l'enfant va répondre 3) ; correction E3 (réponse 3 : début de la correction)
- `A-ecrans/A05-corrections-03.jpg` : Les corrections : correction E3 (correction, 2,5 s plus tard) ; correction E4 · exercice 1:6 (module:niveau) (question, l'enfant va répondre 45) ; correction E4 (réponse 45 : début de la correction) ; correction E4 (correction, 2,5 s plus tard)
- `A-ecrans/A05-corrections-04.jpg` : Les corrections : correction E5 · exercice 1:3 (module:niveau) (question, l'enfant va répondre 71) ; correction E5 (réponse 71 : début de la correction) ; correction E5 (correction, 2,5 s plus tard) ; correction E6 · exercice 1:9 (module:niveau) (question, l'enfant va répondre 80)
- `A-ecrans/A05-corrections-05.jpg` : Les corrections : correction E6 (réponse 80 : début de la correction) ; correction E6 (correction, 2,5 s plus tard) ; correction E7 · exercice 1:12 (module:niveau) (question, l'enfant va répondre 30011) ; correction E7 (réponse 30011 : début de la correction)
- `A-ecrans/A05-corrections-06.jpg` : Les corrections : correction E7 (correction, 2,5 s plus tard) ; correction C1 · exercice 3:2 (module:niveau) (question, l'enfant va répondre 16) ; correction C1 (réponse 16 : début de la correction) ; correction C1 (correction, 2,5 s plus tard)
- `A-ecrans/A05-corrections-07.jpg` : Les corrections : correction C3 · exercice 3:6 (module:niveau) (question, l'enfant va répondre 47) ; correction C3 (réponse 47 : début de la correction) ; correction C3 (correction, 2,5 s plus tard) ; correction C4 · exercice 3:7 (module:niveau) (question, l'enfant va répondre 10)
- `A-ecrans/A05-corrections-08.jpg` : Les corrections : correction C4 (réponse 10 : début de la correction) ; correction C4 (correction, 2,5 s plus tard) ; correction C5 · exercice 3:9 (module:niveau) (question, l'enfant va répondre 92) ; correction C5 (réponse 92 : début de la correction)
- `A-ecrans/A05-corrections-09.jpg` : Les corrections : correction C5 (correction, 2,5 s plus tard) ; correction C2 (juste mais lent) (question restée 12 s sans réponse) ; correction C2 (réponse juste mais lente : le raccourci) ; correction C2 (2,5 s plus tard)
- `A-ecrans/A05-corrections-10.jpg` : Les corrections : correction : addition directe (question directe) ; correction : addition directe (réponse 5 : début de la correction) ; correction : addition directe (2,5 s plus tard) ; correction : addition à trou (question trouDroite)
- `A-ecrans/A05-corrections-11.jpg` : Les corrections : correction : addition à trou (réponse 3 : début de la correction) ; correction : addition à trou (2,5 s plus tard) ; « je ne sais pas » · ligne graduée (juste après le toucher) ; « je ne sais pas » · ligne graduée (3 s plus tard)
- `A-ecrans/A05-corrections-12.jpg` : Les corrections : « je ne sais pas » · additions (juste après le toucher) ; « je ne sais pas » · additions (3 s plus tard) ; « je ne sais pas » · calcul rapide (juste après le toucher) ; « je ne sais pas » · calcul rapide (3 s plus tard)
- `A-ecrans/A06-lecon-L1-01.jpg` : La leçon L1 (On compte les sauts) : leçon L1 (phrase 1) ; leçon L1 (phrase 2) ; leçon L1 (phrase 3) ; leçon L1 (phrase 4)
- `A-ecrans/A06-lecon-L1-02.jpg` : La leçon L1 (On compte les sauts) : leçon L1 (phrase 5) ; leçon L1 (phrase 6) ; leçon L1 (phrase 7) ; leçon L1 (phrase 8)
- `A-ecrans/A06-lecon-L1-03.jpg` : La leçon L1 (On compte les sauts) : leçon L1 (phrase 9) ; leçon L1 (phrase 10) ; leçon L1 (phrase 11) ; leçon L1 (phrase 12)
- `A-ecrans/A06-lecon-L1-04.jpg` : La leçon L1 (On compte les sauts) : leçon L1 (phrase 13) ; leçon L1 (phrase 14) ; leçon L1 (phrase 15) ; leçon L1 (phrase 16)
- `A-ecrans/A06-lecon-L1-05.jpg` : La leçon L1 (On compte les sauts) : leçon L1 (fin (36 s, voix réelle))
- `A-ecrans/A06-lecon-L2-01.jpg` : La leçon L2 (Un saut peut valoir 10) : leçon L2 (phrase 1) ; leçon L2 (phrase 2) ; leçon L2 (phrase 3) ; leçon L2 (phrase 4)
- `A-ecrans/A06-lecon-L2-02.jpg` : La leçon L2 (Un saut peut valoir 10) : leçon L2 (phrase 5) ; leçon L2 (phrase 6) ; leçon L2 (phrase 7) ; leçon L2 (phrase 8)
- `A-ecrans/A06-lecon-L2-03.jpg` : La leçon L2 (Un saut peut valoir 10) : leçon L2 (phrase 9) ; leçon L2 (fin (22 s, voix réelle))
- `A-ecrans/A06-lecon-L3-01.jpg` : La leçon L3 (La ligne ne commence pas toujours à 0) : leçon L3 (phrase 1) ; leçon L3 (phrase 2) ; leçon L3 (phrase 3) ; leçon L3 (phrase 4)
- `A-ecrans/A06-lecon-L3-02.jpg` : La leçon L3 (La ligne ne commence pas toujours à 0) : leçon L3 (phrase 5) ; leçon L3 (phrase 6) ; leçon L3 (phrase 7) ; leçon L3 (phrase 8)
- `A-ecrans/A06-lecon-L3-03.jpg` : La leçon L3 (La ligne ne commence pas toujours à 0) : leçon L3 (fin (20 s, voix réelle))
- `A-ecrans/A06-lecon-L4-01.jpg` : La leçon L4 (Les doubles) : leçon L4 (phrase 1) ; leçon L4 (phrase 2) ; leçon L4 (phrase 3) ; leçon L4 (phrase 4)
- `A-ecrans/A06-lecon-L4-02.jpg` : La leçon L4 (Les doubles) : leçon L4 (fin (15 s, voix réelle))
- `A-ecrans/A06-lecon-L5-01.jpg` : La leçon L5 (Les amis de 10) : leçon L5 (phrase 1) ; leçon L5 (phrase 2) ; leçon L5 (phrase 3) ; leçon L5 (phrase 4)
- `A-ecrans/A06-lecon-L5-02.jpg` : La leçon L5 (Les amis de 10) : leçon L5 (phrase 5) ; leçon L5 (phrase 6) ; leçon L5 (phrase 7) ; leçon L5 (phrase 8)
- `A-ecrans/A06-lecon-L5-03.jpg` : La leçon L5 (Les amis de 10) : leçon L5 (fin (18 s, voix réelle))
- `A-ecrans/A06-lecon-L6-01.jpg` : La leçon L6 (La maison des nombres) : leçon L6 (phrase 1) ; leçon L6 (phrase 2) ; leçon L6 (phrase 3) ; leçon L6 (phrase 4)
- `A-ecrans/A06-lecon-L6-02.jpg` : La leçon L6 (La maison des nombres) : leçon L6 (fin (14 s, voix réelle))
- `A-ecrans/A06-lecon-L7-01.jpg` : La leçon L7 (+ 10 sur le mur de corail) : leçon L7 (phrase 1) ; leçon L7 (phrase 2) ; leçon L7 (phrase 3) ; leçon L7 (phrase 4)
- `A-ecrans/A06-lecon-L7-02.jpg` : La leçon L7 (+ 10 sur le mur de corail) : leçon L7 (phrase 5) ; leçon L7 (phrase 6) ; leçon L7 (fin (20 s, voix réelle))
- `A-ecrans/A06-lecon-L8-01.jpg` : La leçon L8 (L'astuce du 9) : leçon L8 (phrase 1) ; leçon L8 (phrase 2) ; leçon L8 (phrase 3) ; leçon L8 (fin (9 s, voix réelle))
- `A-ecrans/A06-lecon-L9-01.jpg` : La leçon L9 (Passer la dizaine) : leçon L9 (phrase 1) ; leçon L9 (phrase 2) ; leçon L9 (phrase 3) ; leçon L9 (phrase 4)
- `A-ecrans/A06-lecon-L9-02.jpg` : La leçon L9 (Passer la dizaine) : leçon L9 (fin (19 s, voix réelle))
- `A-ecrans/A06-lecon-L10-01.jpg` : La leçon L10 (Les centaines) : leçon L10 (phrase 1) ; leçon L10 (phrase 2) ; leçon L10 (phrase 3) ; leçon L10 (phrase 4)
- `A-ecrans/A06-lecon-L10-02.jpg` : La leçon L10 (Les centaines) : leçon L10 (phrase 5) ; leçon L10 (phrase 6) ; leçon L10 (phrase 7) ; leçon L10 (phrase 8)
- `A-ecrans/A06-lecon-L10-03.jpg` : La leçon L10 (Les centaines) : leçon L10 (phrase 9) ; leçon L10 (phrase 10) ; leçon L10 (phrase 11) ; leçon L10 (phrase 12)
- `A-ecrans/A06-lecon-L10-04.jpg` : La leçon L10 (Les centaines) : leçon L10 (phrase 13) ; leçon L10 (phrase 14) ; leçon L10 (phrase 15) ; leçon L10 (phrase 16)
- `A-ecrans/A06-lecon-L10-05.jpg` : La leçon L10 (Les centaines) : leçon L10 (fin (28 s, voix réelle))
- `A-ecrans/A07-defi-01.jpg` : Le défi record : défi record (l'annonce) ; défi record (première question) ; défi record (après 4 bonnes réponses) ; défi record (une erreur (99) : la bonne réponse montrée)
- `A-ecrans/A07-defi-02.jpg` : Le défi record : défi record (au milieu de la minute) ; après le défi (fin du défi, score et record)
- `A-ecrans/A08-recompense-01.jpg` : La récompense : récompense (carte nouvelle) (le compte des étoiles (séance réduite à la récompense : aucune question, d'où 0 étoile de questions)) ; récompense (carte nouvelle) (le coquillage à toucher) ; récompense (carte nouvelle) (la carte sort (dos)) ; récompense (carte nouvelle) (la carte retournée)
- `A-ecrans/A08-recompense-02.jpg` : La récompense : récompense (carte nouvelle) (la carte retournée) ; récompense (carte nouvelle) (fin : la lune) ; récompense (doublon) (le compte des étoiles (séance réduite à la récompense : aucune question, d'où 0 étoile de questions)) ; récompense (doublon) (le coquillage à toucher)
- `A-ecrans/A08-recompense-03.jpg` : La récompense : récompense (doublon) (la carte sort (dos)) ; récompense (doublon) (la carte retournée) ; récompense (doublon) (la carte retournée) ; récompense (doublon) (fin : la lune)
- `A-ecrans/A08-recompense-04.jpg` : La récompense : récompense (brillante) (le compte des étoiles (séance réduite à la récompense : aucune question, d'où 0 étoile de questions)) ; récompense (brillante) (le coquillage à toucher) ; récompense (brillante) (la carte sort (dos)) ; récompense (brillante) (la carte retournée)
- `A-ecrans/A08-recompense-05.jpg` : La récompense : récompense (brillante) (la carte retournée) ; récompense (brillante) (fin : la lune)
- `A-ecrans/A09-recif-album-01.jpg` : Le récif et l'album : le récif (base neuve) ; l'album (base neuve) ; l'album (base neuve, le dos d'une carte pas encore gagnée touché) ; l'album (base neuve, une carte d'une zone fermée touchée)
- `A-ecrans/A09-recif-album-02.jpg` : Le récif et l'album : le récif (un mois) ; le récif (un mois, une créature touchée : sa carte) ; le récif (un mois, la carte touchée (retournée)) ; l'album (un mois)
- `A-ecrans/A09-recif-album-03.jpg` : Le récif et l'album : l'album (un mois, une carte ouverte) ; l'album (un mois, la carte retournée (anecdote)) ; l'album (un mois, le dos d'une carte pas encore gagnée touché) ; l'album (un mois, une carte d'une zone fermée touchée)
- `A-ecrans/A10-parent-01.jpg` : L'espace parent : accueil (appui long sur le logo, en cours (0,8 s)) ; espace parent (le code demandé) ; espace parent : Calendrier (base neuve, haut (1/2)) ; espace parent : Calendrier (base neuve, suite (2/2))
- `A-ecrans/A10-parent-02.jpg` : L'espace parent : espace parent : Séances (base neuve) ; espace parent : Progression (base neuve, haut (1/7)) ; espace parent : Progression (base neuve, suite (2/7)) ; espace parent : Progression (base neuve, suite (3/7))
- `A-ecrans/A10-parent-03.jpg` : L'espace parent : espace parent : Progression (base neuve, suite (4/7)) ; espace parent : Progression (base neuve, suite (5/7)) ; espace parent : Progression (base neuve, suite (6/7)) ; espace parent : Progression (base neuve, suite (7/7))
- `A-ecrans/A10-parent-04.jpg` : L'espace parent : espace parent : Données et réglages (base neuve, haut (1/6)) ; espace parent : Données et réglages (base neuve, suite (2/6)) ; espace parent : Données et réglages (base neuve, suite (3/6)) ; espace parent : Données et réglages (base neuve, suite (4/6))
- `A-ecrans/A10-parent-05.jpg` : L'espace parent : espace parent : Données et réglages (base neuve, suite (5/6)) ; espace parent : Données et réglages (base neuve, suite (6/6)) ; espace parent : Calendrier (un mois, haut (1/2)) ; espace parent : Calendrier (un mois, suite (2/2))
- `A-ecrans/A10-parent-06.jpg` : L'espace parent : espace parent : Séances (un mois, haut (1/2)) ; espace parent : Séances (un mois, suite (2/2)) ; espace parent : Progression (un mois, haut (1/11)) ; espace parent : Progression (un mois, suite (2/11))
- `A-ecrans/A10-parent-07.jpg` : L'espace parent : espace parent : Progression (un mois, suite (3/11)) ; espace parent : Progression (un mois, suite (4/11)) ; espace parent : Progression (un mois, suite (5/11)) ; espace parent : Progression (un mois, suite (6/11))
- `A-ecrans/A10-parent-08.jpg` : L'espace parent : espace parent : Progression (un mois, suite (7/11)) ; espace parent : Progression (un mois, suite (8/11)) ; espace parent : Progression (un mois, suite (9/11)) ; espace parent : Progression (un mois, suite (10/11))
- `A-ecrans/A10-parent-09.jpg` : L'espace parent : espace parent : Progression (un mois, suite (11/11)) ; espace parent : Données et réglages (un mois, haut (1/6)) ; espace parent : Données et réglages (un mois, suite (2/6)) ; espace parent : Données et réglages (un mois, suite (3/6))
- `A-ecrans/A10-parent-10.jpg` : L'espace parent : espace parent : Données et réglages (un mois, suite (4/6)) ; espace parent : Données et réglages (un mois, suite (5/6)) ; espace parent : Données et réglages (un mois, suite (6/6))

## Partie B · les séquences de questions

Le texte des séances telles que le moteur les génère (runners de l'application, sans navigateur) : pour chaque exercice × niveau (ou famille) × cran, en base neuve et en « un mois », avec trois comportements de l'enfant. Commencer par `SYNTHESE.md`.

- `B-sequences/SYNTHESE.md` : une ligne par séance simulée (base × exercice × cran × comportement) : réponses différentes, répétitions, suites prévisibles, leçons, étoiles ; et le tableau des étoiles « pressée » comparées à « appliquée »
- `B-sequences/neuve/additions-famille-1.md` : base neuve (premier lancement) : additions famille 1, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/additions-famille-2.md` : base neuve (premier lancement) : additions famille 2, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/additions-famille-3.md` : base neuve (premier lancement) : additions famille 3, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/additions-famille-4.md` : base neuve (premier lancement) : additions famille 4, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/additions-famille-5.md` : base neuve (premier lancement) : additions famille 5, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/additions-famille-6.md` : base neuve (premier lancement) : additions famille 6, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/additions-famille-7.md` : base neuve (premier lancement) : additions famille 7, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-1.md` : base neuve (premier lancement) : calcul 1, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-2.md` : base neuve (premier lancement) : calcul 2, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-3.md` : base neuve (premier lancement) : calcul 3, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-4.md` : base neuve (premier lancement) : calcul 4, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-5.md` : base neuve (premier lancement) : calcul 5, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-6.md` : base neuve (premier lancement) : calcul 6, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-7.md` : base neuve (premier lancement) : calcul 7, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-8.md` : base neuve (premier lancement) : calcul 8, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/calcul-9.md` : base neuve (premier lancement) : calcul 9, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-01.md` : base neuve (premier lancement) : ligne 01, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-02.md` : base neuve (premier lancement) : ligne 02, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-03.md` : base neuve (premier lancement) : ligne 03, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-04.md` : base neuve (premier lancement) : ligne 04, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-05.md` : base neuve (premier lancement) : ligne 05, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-06.md` : base neuve (premier lancement) : ligne 06, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-07.md` : base neuve (premier lancement) : ligne 07, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-08.md` : base neuve (premier lancement) : ligne 08, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-09.md` : base neuve (premier lancement) : ligne 09, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-10.md` : base neuve (premier lancement) : ligne 10, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-11.md` : base neuve (premier lancement) : ligne 11, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-12.md` : base neuve (premier lancement) : ligne 12, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/neuve/ligne-13.md` : base neuve (premier lancement) : ligne 13, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/additions-famille-1.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : additions famille 1, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/additions-famille-2.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : additions famille 2, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/additions-famille-3.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : additions famille 3, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/additions-famille-4.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : additions famille 4, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/additions-famille-5.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : additions famille 5, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/additions-famille-6.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : additions famille 6, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/additions-famille-7.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : additions famille 7, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-1.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 1, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-2.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 2, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-3.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 3, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-4.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 4, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-5.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 5, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-6.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 6, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-7.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 7, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-8.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 8, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/calcul-9.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : calcul 9, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-01.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 01, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-02.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 02, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-03.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 03, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-04.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 04, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-05.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 05, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-06.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 06, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-07.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 07, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-08.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 08, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-09.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 09, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-10.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 10, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-11.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 11, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-12.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 12, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
- `B-sequences/mois/ligne-13.md` : un mois (tools/sauvegarde-test.mjs reel 2 4) : ligne 13, les 4 crans × 3 comportements (appliquée, réelle, pressée), une séance complète chacun
