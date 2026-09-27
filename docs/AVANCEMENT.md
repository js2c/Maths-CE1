# Avancement

Tenu à jour à chaque étape (un commit par étape). Pour reprendre le travail dans une nouvelle session : lire ce fichier, puis `CLAUDE.md`, `docs/SPEC.md` et `docs/ARCHITECTURE.md`.

## Lot 2

Spécification : `docs/SPEC-LOT2.md` (prévaut sur `docs/SPEC.md`) ; prompt : `docs/PROMPT-LOT2.md`. Une étape = une session = une demande de fusion vers `main`.

**Où en est-on (27 septembre 2026, 17 h, noté par la conversation de conception)** : étapes 1 à 3 faites et fusionnées (PR #11, #13, #14). **Étapes 4 à 6 à faire ensemble**, sur une seule branche, avec une recette allégée à chaque étape et une recette complète à la fin (section « Prompt pour enchaîner plusieurs étapes » de `docs/PROMPT-LOT2.md`). Décisions du parent à reprendre : choix des sons (rubrique « Reprise de l'étape 3 » : bruitages « a », les trois musiques tirées au hasard ; débit 64 kbit/s par défaut) ; points ouverts dans `docs/JOURNAL-CONCEPTION.md` (brillantes, cran « plus facile »).

| Étape | Contenu | État |
| --- | --- | --- |
| 1 | Cartes et rythme : calendrier et quota, doublons, brillantes (20 % et effet), ouverture des zones, zone 2 (anecdotes et voix), étoiles dorées (4 semaines réussies), légendaires et coquillage doré, étoile arc-en-ciel de l'entraînement libre, surprise une séance sur cinq, ligne « Cartes » de l'espace parent ; simulation des cartes sur l'année | fait (branche `lot2-etape1`, https://github.com/js2c/Maths-CE1/pull/11) |
| 2 | Séance et progression : durées et nombres de questions, défi record activable, places réservées et voie rapide des faits, enchaînement des niveaux, leçon au plus une fois par séance, point de départ du parent, tortue devant la pieuvre, pieuvre qui montre la cible ; option `--delai` de la recette ; sélecteur de difficulté (4 crans) | fait (branche `claude/prompt-lot2-section-9xloz0`, https://github.com/js2c/Maths-CE1/pull/13) |
| 3 | Son, échantillons (`tools/son/`, `docs/son-echantillons/`) ; arrêt pour le choix du parent | fait (branche `claude/tender-volta-20rhlz`, https://github.com/js2c/Maths-CE1/pull/14) ; choix du parent reçu |
| 4 | Son, intégration : bruitages, musique, mixage, réglages du parent | fait (branche `claude/loving-tesla-rtv3o5`, https://github.com/js2c/Maths-CE1/pull/16) |
| 5 | Atelier : bernard-l'ermite, cadre de 10, maison des nombres, double + 1 | à faire |
| 6 | Module 2 comme notion du jour : familles 3 à 7, formes à trou, leçons L4 à L6, alternance, module imposé, point de départ étendu | à faire |
| 7 | Défi record, grille des 66 additions, progression du module 2 dans l'espace parent | à faire |
| 8 | Nombres jusqu'à 1 000 (`docs/SPEC-COMPLEMENTS.md`, partie A) | à faire |
| 9 | Bilan : `docs/BILAN-LOT2.md`, guide du parent, recette complète sur l'année | à faire |

### Reprise des étapes 4 à 6

Pour reprendre si la session s'est arrêtée : branche `claude/loving-tesla-rtv3o5` (nom imposé par l'environnement), demande de fusion en brouillon « Lot 2, étapes 4 à 6 (en cours) » (https://github.com/js2c/Maths-CE1/pull/16).

**Étape en cours :** 5 (atelier).

**Fait :**

- Étape 4 (son, intégration) : sons choisis copiés dans `app/assets/son/` (`node tools/son/fabriquer.mjs app`), moteur `app/js/engine/son.js`, mixage `app/content/son.json`, bruitages branchés (réponses, étoiles, coquillage, carte, brillante, bouton, zone), musique tirée à chaque séance et notée (`rec.musique`), baisse sous la voix et en pause, arrêt dans l'espace parent, ligne « Son » des réglages du parent. Tests `tests/unit/son-app.test.mjs` ; parcours `seance.mjs` (son) et `parent.mjs` (réglages).

**Reste :** étapes 5 et 6 ; recette complète à la fin.

**Où j'en suis :** étape 4 terminée et poussée ; début de l'étape 5.

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
