# Lot 3 — spécification

Rédigée en conception le 27 septembre 2026 (soir), après les premiers essais du lot 2 par le parent. Elle complète `docs/SPEC.md`, `docs/SPEC-LOT2.md` et `docs/SPEC-COMPLEMENTS.md` et, **en cas de contradiction, elle prévaut** sur eux. Prompt : `docs/PROMPT-LOT3.md`.

Le lot 3 a deux parties :

- **A · Correctif du lot 2** (étapes 1 et 2) : ce que le parent a constaté en essayant l'application ; à publier vite, avant le calcul rapide.
- **B · Module 3, calcul rapide** (étapes 3 à 5) : le contenu prévu au lot 3 par `docs/SPEC.md`, adapté aux décisions ci-dessous.

## 1. Ce que les essais ont montré (27 septembre 2026)

- **On ne peut pas choisir l'exercice.** L'accueil ne propose que « jouer », qui enchaîne l'échauffement puis une notion du jour choisie par l'application ; le choix libre n'existe qu'après la séance (« Encore ! »), sans étoiles. Le parent veut indiquer lui-même à l'enfant l'exercice à faire, et que l'enfant puisse aussi choisir le **niveau** (par exemple l'estimation sans graduations, niveau 8, dès la première semaine).
- **L'échauffement est obligatoire.** Il doit pouvoir être passé.
- **La leçon et l'exercice ne se répondent pas.** Constaté, puis rejoué en simulation : famille « mélange » en cours, la règle `leconSiPasVue` joue la leçon L4 (les doubles), puis les 30 questions vont aux faits les plus faibles, surtout des « + 1 / + 2 » à trou ; 2 doubles seulement. Pour une enfant de 7 ans, la leçon n'a aucun rapport avec l'exercice.
- **La maison des nombres est tronquée** : le seuil (la marche de sable et la porte) est coupé à gauche et à droite (le dessin dépasse du cadre de son image dans l'atelier : `aide.maison.seuil`, `art/src/canvas-core/sea/catalog.ts`, largeur `HOUSE.w + 50` pour un dessin plus large), et en bas en @1x (rectangle de 64 px pour un cadre de 66).
- **Le bernard-l'ermite n'apporte rien de pédagogique** (avis partagé par le parent) : ce sont les aides visuelles qui servent. Décision : **pas de nouveau personnage guide au lot 3** (voir section 5).

## 2. Choisir l'exercice et le niveau dès l'accueil (étape 1)

**Décision du parent** : elle remplace la règle « on ne choisit pas l'activité pendant la séance » (`docs/SPEC.md`, « Navigation pendant la séance ») et l'alternance imposée de `docs/SPEC-LOT2.md`, section 2, qui ne vaut plus que pour « jouer ».

**L'accueil** montre quatre bulles : « jouer » (la séance proposée par l'application, inchangée), **« choisir »** (nouvelle), le récif, l'album. Après la séance du jour : la lune, « Encore ! » (qui ouvre le même écran de choix, sans étoiles), le récif, l'album.

**L'écran de choix**, en deux temps, sans texte à lire (pictogrammes dessinés dans l'atelier, style A ; le nom dit par la voix au toucher ; toucher deux fois ou la coche valide) :

1. **L'exercice** : la ligne graduée (la tortue), les additions (le « + »), le calcul rapide (étape 4 : le mur de corail), les leçons (un livre qui s'ouvre).
2. **Le niveau** :
   - *Ligne graduée* : **les 13 niveaux, tous accessibles**, même ceux jamais atteints. Chaque niveau a un petit dessin qui le montre (une corde courte à bouées, une ligne de 0 à 100, une ligne sans graduations avec un « ? »…) ; le niveau conseillé est entouré d'une lueur ; les niveaux déjà validés portent une petite étoile. Pour tenir à l'écran : deux rangées, ou une frise que l'on fait glisser.
   - *Additions* : **les 7 familles, toutes accessibles** (+ 1 et + 2, doubles, amis de 10, maisons de 5 à 7, maisons de 8 et 9, presque-doubles, mélange), chacune avec son appui visuel en vignette (la tortue, le reflet, le cadre de 10, la maison, le double + 1).
   - *Calcul rapide* (étape 4) : les 9 niveaux, tous accessibles.
   - *Leçons* : **toutes les leçons existantes**, vues ou non (L1 à L6, L10, puis L7 à L9).

**Ensuite** : le sélecteur de difficulté (section 3), puis la séance.

**L'exercice choisi est la séance du jour** : accueil, sélecteur, échauffement (s'il n'est pas passé, section 4), l'exercice choisi comme notion du jour (même durée et même nombre de questions que la notion du jour), défi record s'il a lieu, récompense. Étoiles, coquillages et cartes comme une séance normale ; il compte comme la séance du jour (série, étoile dorée). Après la séance du jour, le même écran de choix ouvre l'entraînement libre, sans étoiles (règle inchangée). Une leçon choisie seule n'est pas une séance : elle se joue, puis revient à l'accueil (3 étoiles si elle est regardée jusqu'au bout, une fois par leçon et par jour).

**Niveau choisi au-dessus du conseillé** (règle du sélecteur étendue) : réussir le niveau (8 bonnes réponses sur 10, au plus une aide) **le valide**, et le conseillé passe au niveau suivant ; échouer ne fait **jamais** baisser le conseillé ni rien retirer. La leçon d'entrée du niveau (L1 au niveau 1, L3 au 4, L2 au 5, L10 au 9) est jouée la première fois, avec « passer » comme toujours. La protection (3 erreurs sur 5 au-dessus du conseillé) redescend d'un cran de difficulté, jamais de niveau : le choix de l'enfant est respecté.

**Famille d'additions choisie** : elle devient la famille en cours pour cette séance. Si elle n'est pas encore ouverte, elle s'ouvre (sans étoile arc-en-ciel). La limite de faits nouveaux par séance (`nouveauxMaxSeance`) **ne s'applique pas aux faits de la famille choisie** (sinon l'exercice serait fait surtout de révisions) ; la boîte 1 peut dépasser 8 faits ce jour-là.

**« jouer »** garde son fonctionnement : l'application choisit la notion du jour (alternance des modules, famille en cours, niveau conseillé), avec la règle de la section 4 sur les leçons. Le module imposé par le parent (espace parent) reste possible.

## 3. La difficulté à l'intérieur du niveau (étape 2)

**Décision du parent** : le niveau et la difficulté se choisissent **séparément**. Quand le niveau est choisi, le curseur à 4 crans ne décale plus le niveau : il rend **le même niveau** plus facile ou plus exigeant. Le multiplicateur d'étoiles (× 0,5, × 1, × 1,5, × 2), la protection et la règle « plus facile consolide sans faire progresser » (`docs/SPEC-LOT2.md`, section 2) sont inchangés. Avec « jouer », le curseur garde son effet actuel (décaler le niveau conseillé), l'enfant n'ayant pas choisi de niveau.

**Principe commun** : « plus facile » ajoute une aide d'emblée ou un repère ; « conseillé » est le niveau tel que `docs/SPEC.md` le décrit ; « plus dur » retire un repère ; « très dur » retire les repères jusqu'au minimum qui laisse le niveau faisable, ou resserre la tolérance. On ne supprime jamais le bouton « réécouter », les corrections ni « je ne sais pas ».

### Ligne graduée

| Niveau | Plus facile | Plus dur | Très dur |
| --- | --- | --- | --- |
| 1 · 0 à 10, tous les nombres sauf la cible | 3 propositions au lieu de 4 ; la tortue montre le premier saut | seulement 0, 5 et 10 écrits | seulement 0 et 10 écrits |
| 2 · 0 à 10, 0, 5 et 10 écrits | aussi 2, 4, 6, 8 écrits | seulement 0 et 10 | 0 et 10, format « placer » seulement |
| 3 · 0 à 20, 0, 10, 20 | aussi 5 et 15 | seulement 0 et 20 | 0 et 20, « placer » seulement |
| 4 · 10 graduations hors de 0, extrémités | le milieu aussi écrit (35) | extrémités seulement, cibles près du milieu | 20 graduations (30 à 50), extrémités seulement |
| 5 · 0 à 100 de 10 en 10 | 0, 50 et 100, plus les dizaines paires | 0 et 100 seulement | 0 et 100, « placer » seulement |
| 6 · segment de 20, dizaines écrites | aussi les 5 (35, 45) | les deux extrémités seulement | segment de 30 (30 à 60), extrémités seulement |
| 7 · pas à déduire, deux graduations voisines | trois graduations écrites | cible 3 à 5 sauts après | deux graduations non voisines (40 puis 60 deux sauts plus loin) |
| 8 · estimer 0 à 100 (± 8 puis ± 5) | ± 10, repère 50 marqué | ± 5 d'emblée | ± 3 |
| 9 · 0 à 1 000 de 100 en 100 | aussi 200, 400, 600, 800 | 0 et 1 000 seulement | 0 et 1 000, « placer » seulement |
| 10 · une centaine de 10 en 10 | le milieu aussi écrit (350) | extrémités seulement, cibles près du milieu | deux centaines (300 à 500), extrémités seulement |
| 11 · 20 graduations de 1 (340 à 360) | aussi 345 et 355 | extrémités seulement | 30 graduations (340 à 370), extrémités seulement |
| 12 · dictée | nombres sans zéro (347) ; le tableau centaines / dizaines / unités affiché | un nombre sur deux avec un zéro (307, 370) | zéros et « dix » (310, 715, 970) |
| 13 · estimer 0 à 1 000 (± 60 puis ± 40) | ± 80, repère 500 marqué | ± 40 d'emblée | ± 25 |

Les propositions pièges du format « lire » restent construites à partir des erreurs E1 à E7. Tout est réglé dans `app/content/module1.json` (un bloc `crans` par niveau), jamais en dur. Claude Code peut ajuster une case si elle rend le niveau infaisable (par exemple une ligne illisible à l'écran) ; il le note dans `docs/AVANCEMENT.md` avec la raison.

### Additions (famille choisie)

| Cran | Effet |
| --- | --- |
| Plus facile | formes directes seulement, appui visuel affiché d'emblée (règle actuelle) |
| Conseillé | formes directes, et formes à trou si elles sont ouvertes pour la famille |
| Plus dur | formes à trou pour la moitié des questions, même si elles ne sont pas encore ouvertes |
| Très dur | formes à trou pour toutes les questions ; les révisions (au plus 20 %) prises dans toutes les familles |

Dans tous les cas, **au moins 80 % des questions portent sur les faits de la famille choisie** (réglage `module2.json`).

### Calcul rapide

Voir section 6.

## 4. Échauffement facultatif, leçons cohérentes (étape 1)

- **Passer l'échauffement** : au début de l'échauffement, le bouton « passer » habituel (deux triangles jaunes, en haut à droite) l'arrête et enchaîne sur l'exercice. Réglage de l'espace parent « Échauffement : oui / non » (oui par défaut) ; « non » le retire de la séance et de la frise. Note pour le guide du parent : l'échauffement est l'endroit où reviennent les faits « dus » de la révision espacée ; sans lui, ils ne reviennent que dans les exercices d'additions.
- **Une leçon n'est jouée que pour ce qu'on va travailler** : la leçon d'une famille (L4 doubles, L5 amis de 10, L6 maison) seulement quand cette famille est travaillée ; la règle `leconSiPasVue` est **supprimée** ; le mélange ne joue aucune leçon. Les maisons de 8 et 9 jouent L6 si elle n'a jamais été vue (c'est la même représentation, la maison) ; les presque-doubles jouent L4 si elle n'a jamais été vue, et chaque question rappelle le double (« 3 + 4, c'est 3 + 3, et encore 1 »), avec l'appui double + 1.
- **Au moins 80 % des questions de la notion du jour des additions portent sur la famille en cours** (avec « jouer » comme avec « choisir ») ; le reste en révision. La règle actuelle « une question sur deux » est remplacée.

## 5. Correctifs graphiques et outils (étapes 1 et 2)

- **Maison des nombres** (étape 1) : agrandir le cadre de `aide.maison.seuil` pour que tout le dessin tienne (contour et ombre compris), en @1x et en @2x ; vérifier sur un agrandissement que le seuil est entier et qu'il se lit sur le sable (contraste).
- **Contrôle automatique des bords** (étape 1) : un test qui échoue si un sprite a des pixels opaques sur le bord de son cadre, sauf une liste d'exceptions justifiées (images pleine page des cartes, calques découpés à dessein). À examiner à l'agrandissement, relevés le 27 septembre : `aide.cadre10`, `ermite.repos.b`, `creature.crevette`, `creature.hippocampe`, `creature.raie-pastenague`, `precedent`.
- **Sauvegardes de test** (étape 2) : un outil `node tools/sauvegarde-test.mjs <profil> <séances par semaine> <semaines>` qui fabrique, à partir de la simulation (`tests/sim-recette.mjs`), un fichier de sauvegarde restaurable dans l'espace parent : par exemple un mois d'usage, trois mois, un profil en difficulté. Toutes les dates suivent l'horloge simulée (y compris celles que le moteur prend à `Date.now()`), la dernière séance tombe la veille du jour de fabrication. Mode d'emploi en français simple dans `docs/GUIDE-PARENT.md`, avec l'avertissement : **restaurer remplace toutes les données de la tablette** ; faire d'abord une sauvegarde complète.
- **Pas de nouveau personnage** : le module 3 n'a pas de dauphin. La tortue (sur la ligne) et le petit poisson jaune (sur le mur de corail) suffisent, comme dans les textes des leçons L7 à L9. Le bernard-l'ermite reste tel qu'il est (aucun travail de plus).

## 6. Module 3 — calcul rapide (étapes 3 et 4)

Contenu de `docs/SPEC.md`, « Module 3 — Calcul rapide » (niveaux 1 à 9, procédures, erreurs C1 à C5, déroulé d'un nouveau niveau, leçons L7 à L9), avec ces précisions :

- **Supports** (étape 3, atelier) : le **mur de corail** (tableau de 1 à 100, 10 rangées de 10, chiffres de la scène, les dizaines d'une couleur et les unités d'une autre pour L7), le petit poisson qui s'y déplace (descendre = + 10, monter = − 10, glisser d'une case = ± 1), les **ponts** du chemin (38 → + 2 → 40 → + 3 → 43), le cadre de 10 déjà fait (L9). Dessinés dans l'atelier, style A ; le mur est composé une fois par question dans un canvas mis en cache, comme la ligne.
- **Réponse** au pavé des additions (le même écran : ardoise, pavé, « je ne sais pas », coquillage d'aide, réécouter).
- **Déroulé d'un nouveau niveau** (`docs/SPEC.md`) : la leçon (s'il y en a une), 3 calculs guidés où l'enfant remplit chaque pont, 3 calculs où le chemin n'apparaît qu'au coquillage, puis des calculs sans aide.
- **Déblocage** : les conditions « se débloque quand… » de `docs/SPEC.md` décident seulement du **niveau conseillé** et de ce que propose « jouer » ; avec « choisir », **tous les niveaux sont accessibles** (section 2).
- **Crans à l'intérieur du niveau** : plus facile = le chemin (les ponts) affiché d'emblée, sans promotion ; conseillé = le chemin au coquillage ; plus dur = sans chemin ; très dur = sans chemin et formes à trou (« 38 plus combien, ça fait 43 ? »), aux niveaux où la forme à trou a un sens (1 à 8).
- **C2 (juste mais lent)** : seuil de lenteur de 8 s au-delà du temps de base mesuré (réglage) ; pas de reproche, le chemin est rejoué une fois à la fin de la question.
- **Place dans la séance** : avec « jouer », la notion du jour tourne entre les trois modules (ligne, additions, calcul rapide), le module débloqué le moins maîtrisé en priorité, jamais deux fois de suite le même, sauf si un autre n'a rien à proposer ; le calcul rapide niveau 1 est débloqué dès le début.
- **Espace parent** : une ligne « Calcul rapide » dans les modules (niveau, courbe de réussite, temps médian par semaine), les erreurs C1 à C5 dans le journal des erreurs, le module 3 dans « point de départ » (niveaux 1 à 9) et dans « module imposé ».
- **Leçons L7 à L9** : textes de `docs/SPEC.md`, voix fabriquée comme d'habitude ; « rejouer » et « passer » dès la première vue.

## 7. Recette

Mêmes outils et même méthode que `docs/SPEC-LOT2.md`, section 8, plus ces critères :

| Critère | Mesure |
| --- | --- |
| Choisir un exercice et un niveau | depuis l'accueil, en 3 touchers au plus (choisir, exercice, niveau), puis le sélecteur ; parcours Playwright pour chaque exercice, dont le niveau 8 de la ligne dès une base vide |
| L'exercice choisi est celui joué | 100 % des questions de la notion du jour au niveau choisi (ligne, calcul rapide) ; au moins 80 % sur la famille choisie (additions) |
| Leçon et exercice cohérents | simulation : après L4, au moins 80 % de doubles ou de presque-doubles ; aucune leçon de famille jouée pour une autre famille |
| Échauffement passé | la notion du jour commence moins de 2 s après « passer » ; réglage « non » : pas d'échauffement ni de pictogramme dans la frise |
| Difficulté dans le niveau | pour chaque niveau de la ligne et chaque cran, une capture regardée (ligne lisible, repères conformes au tableau) ; la simulation montre une réussite plus basse à « très dur » qu'à « plus facile » pour un même profil |
| Maison des nombres et bords des sprites | seuil entier en @1x et @2x (capture agrandie) ; le test des bords passe |
| Sauvegardes de test | un mois, trois mois, profil en difficulté : restaurées dans l'application sans erreur, accueil, album, espace parent cohérents (dates, niveaux) |
| Calcul rapide | les 9 niveaux jouables et générés au hasard selon leurs paramètres ; C1 à C5 détectées (tests) ; leçons L7 à L9 ; durée d'une séance de calcul rapide 9 à 11 min (`recette.mjs --delai 4.5`) |
| Attente sans commande | au plus environ 2 s partout, écrans nouveaux compris (`recette-durees.mjs --passer`) |
