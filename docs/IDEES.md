# Idées et questions ouvertes

Tout ce qui n'est pas décidé : idées d'amélioration, concepts d'exercices à maquetter, questions laissées avec une valeur par défaut, points à observer avec l'enfant. Tenu en conception. Quand un point est tranché, la règle va dans `docs/SPEC.md`, la raison dans `docs/JOURNAL-CONCEPTION.md`, et la ligne est retirée d'ici.

Dernière mise à jour : 6 octobre 2026 (mascotte, voiliers et lots ordonnés de `docs/LOTS.md`), après la revue du programme de CE1 du 30 septembre.

## 1. La feuille de route (décision du parent du 30 septembre)

**Règle** : aucun exercice nouveau n'est lancé en code avant que le parent ait validé **une maquette de son rendu final** (écrans clés, gestes, ce que dit la voix). Un exercice mal conçu est impossible à corriger ensuite.

Les lots prêts à lancer, dans l'ordre, sont dans **`docs/LOTS.md`** (décision du parent du 6 octobre 2026) : « Mascotte », « Les voiliers », « Les leçons » (avec la table d'addition), « Sommes jusqu'à 30 », « Multiplication » (et les tables). Cette section garde ce qui n'est pas encore un lot. Depuis le 6 octobre, un lot dont la maquette n'existe pas commence par la fabriquer, s'arrête pour la validation du parent, puis seulement code.

**Contrôles** (décisions du parent du 6 octobre) : la session relecteur des lots 3 bis et 3 ter est abandonnée (chaque lot a sa relecture indépendante) ; la confrontation de la spécification avec le code (`docs/PROMPTS.md`) est faite (`docs/ECARTS-SPEC.md`), ses écarts tranchés le 6 octobre et appliqués par le lot « Correctifs ».

**Phase 1, maintenant** — ordre proposé le 30 septembre (un lot court chacun ; les leçons et les sommes jusqu'à 30 sont devenues les lots « Les leçons » et « Sommes jusqu'à 30 » de `docs/LOTS.md`) :

1. Les leçons (`docs/SPEC.md`, section 3, « Les leçons ») : bulle à l'accueil, menu refait, leçon suivie de son exercice, table d'addition à consulter ; correction des filets de la leçon L10 (10 poissons).
2. Les problèmes de la vie courante (`docs/SPEC.md`, section 13) : l'essentiel du travail est la banque d'énoncés, rédigée en conception.
3. La pêche (section 2 ci-dessous).
4. Le banc de poissons (section 2) : **couvert pour l'essentiel par le jeu des voiliers** (encadrer entre des bouées, lot « Les voiliers » de `docs/LOTS.md`) ; ce qui n'y est pas (« donne un nombre compris entre », les signes <, >, =) reste à placer.
5. Suites et rangs (section 2).
6. Les sommes jusqu'à 30 (`docs/SPEC.md`, section 13).

**Phase 2, d'ici quelques semaines** (la multiplication et les tables sont devenues le lot « Multiplication » de `docs/LOTS.md`, demande du parent du 6 octobre) : les fractions (le programme les attend **au plus tard en période 2**, avant les vacances de Noël ; le parent les remet à plus tard, décision du 6 octobre) ; la multiplication (addition répétée, signe ×, commutativité, rangées) et les tables ; le partage (valeur d'une part, nombre de parts) ; l'addition et la soustraction posées jusqu'à 3 chiffres, avec retenues (la méthode de soustraction, par cassage ou par compensation, **à demander à l'enseignante** : l'école en choisit une du CE1 au CM2) ; ± centaines entières et calculs à 3 chiffres (234 + 60, 765 − 200) ; × 10 d'un nombre inférieur à 100.

**Phase 3** : l'heure, la monnaie (le programme demande les **centimes** en période 2 et l'**écriture à virgule** dès la période 3 : la spécification actuelle, en euros entiers, est à revoir), les longueurs, les masses.

**Exclu** : écrire les nombres en lettres.

**Non placés** : comparer, doubles et moitiés, pair et impair (`docs/SPEC.md`, section 13) ; proposition : comparer fusionné dans le banc de poissons (phase 1), doubles et moitiés, pair et impair avec la multiplication et le partage (phase 2). Géométrie, repérage dans l'espace, données : hors du plan (le codage de déplacements, « avance, pivote d'un quart de tour », irait bien avec la tortue).

## 2. Concepts d'exercices à maquetter (phase 1)

Retenus dans leur principe par le parent le 30 septembre ; chacun doit passer par une maquette validée avant d'être spécifié dans `docs/SPEC.md`.

**La pêche** (centaines, dizaines, unités ; « 23 dizaines et 5 unités », 600 + 30 + 5). Trois réserves au bord d'un bateau : chaluts (100 poissons), filets (10), poissons seuls. La voix : « Pêche 235 poissons » ; l'enfant fait glisser chaluts, filets et poissons dans la cale, puis valide. Variantes, de la plus simple à la plus difficile :

1. Construire : la voix donne le nombre, l'enfant assemble la pêche.
2. Lire : une pêche est montrée, l'enfant tape le nombre.
3. Sans chalut : « Il n'y a plus de chaluts ! » Faire 235 avec 23 filets et 5 poissons.
4. Échanger : ouvrir un filet pour obtenir 10 poissons seuls (prépare la soustraction posée par cassage).

Au cran « plus facile », l'écriture 600 + 30 + 5 s'affiche sous la cale. Un filet montre toujours 10 poissons (2 rangées de 5). Pourrait remplacer le dénombrement prévu (limité à 40 objets).

**Le banc de poissons** (encadrer, intercaler, comparer, « compris entre »). Une portion de ligne bornée par deux bouées (340 et 350) ; des poissons portant un nombre arrivent en nageant ; l'enfant fait glisser chacun dans la bonne zone : avant, entre, après. Dynamique par le mouvement, sans chronomètre. Autres formes : « Entre quelles dizaines est 347 ? » (toucher deux bouées) ; « Donne un nombre compris entre 340 et 350 » (au pavé). « Comparer et ranger » (signes <, >, =, ranger jusqu'à 5 nombres) pourrait y être fusionné.

**Suites et rangs** (le collier de coquillages). Suites : une rangée de coquillages et de perles avec un ou deux trous ; suites répétitives complétées en choisissant un élément (rouge, bleu, bleu, ?), suites de nombres au pavé (5, 10, 15, ? ; 97, 98, 99, ? ; 340, 350, 360, ?) ; à un cran plus difficile, prolonger de deux éléments. Rangs : une file de poissons devant une grotte ; « Touche le 7e poisson » ; « Combien de poissons sont devant le 5e ? » (réponse 4 ; l'erreur classique est 5).

**La table d'addition à consulter** et celle de multiplication : faites (lots « Les leçons » et « Multiplication »).

## 3. Questions à trancher

- **Les problèmes** : une étape courte de chaque séance (recommandation de conception : un ou deux problèmes par soir, c'est une compétence d'usage) ou un exercice qu'on choisit ?
- **La banque de problèmes** : chaque phrase lue est fabriquée à l'avance (plafond 80 Mo, 51 Mo utilisés) ; des énoncés à nombres variables multiplieraient les fichiers. Recommandation : une banque fixe de 150 à 200 énoncés rédigés en conception et relus par le parent (quelques Mo de voix).
- **Les illustrations des problèmes** : 150 à 200 scènes de la vie courante ne sont pas dessinables en code à un coût raisonnable ; Nano Banana, une image fixe par énoncé (ou par contexte réutilisé), dans un style fixé par une image de référence. Point de vigilance : un générateur d'images compte mal (« 3 sachets de 6 » ne sera pas exact) ; l'image montre le contexte, les quantités sont dessinées par l'application (objets à grouper) ou dites par la voix.
- **L'échauffement quand un exercice est choisi** : aujourd'hui il reste, sauf si on le passe. Le garder, le supprimer, ou le réduire ?
- **Le nombre de crans de difficulté** : quatre crans multiplient les cas à tester (116 combinaisons pour la seule vérification des séquences). En garder quatre, ou passer à trois ?
- **Le crabe**, prévu comme personnage des problèmes : au vu de ce que le bernard-l'ermite a apporté (rien de pédagogique, avis du parent), le laisser de côté ?
- **+ 19, + 29, − 9** (programme) : extension peu coûteuse du niveau 6 du calcul rapide (L8 enseigne déjà « + 10 puis un pas en arrière »), aujourd'hui limité à + 9.
- **Le lagon sous les exercices** (lot « Lagon en fond d'exercices », octobre 2026). Décision du parent : aucune adaptation de lisibilité. Relevé, pour mémoire, de ce que le fond met sous l'exercice (captures : `node tests/e2e/lagon.mjs`) :
  - les nombres de la ligne graduée sont écrits sur le sable du panorama, dont les rides sont des traits d'encre aussi épais que les chiffres ; le bord du sable passe au ras du haut des nombres à gauche ;
  - le rocher de gauche est sous le poteau et le « 0 » ; le rocher de droite et ses algues sous les nombres 7 à 9 (ligne de 0 à 10) et sous les touches 3, 4, 8, 9 et la coche du pavé ; les algues passent derrière les nombres (décision du parent) ;
  - une étoile de mer peinte dans le sable, au milieu de l'écran, entre les bulles-réponses, à côté de l'étiquette du poisson en « placer » et « estimer », entre les touches 8 et 9 : le même animal que la cible du format « lire » ;
  - le corail de droite sous le bout de la ligne, sous « je ne sais pas » ; le miroitement derrière la frise ;
  - leçons : en L9, l'étoile de mer du sable est juste sous « 40 41 » ; en L10, le « 0 » et le « 7 » de 307 décomposé sont écrits sur le rocher de droite ; en L3 et au niveau 11, le « ? » rouge est traversé par les feuilles d'une algue (derrière lui) ;
  - écran « choisir » : les tuiles 10, 11 et 13 de la ligne sont posées devant les algues et les rochers (la règle de la section 3 dit « ni posée sur la pieuvre ou les algues ») : garder ainsi, ou déplacer les tuiles ?

## 4. Questions laissées avec une valeur par défaut

- **Les pictogrammes de la pieuvre** (lot « Mascotte ») : la pieuvre a quitté l'application, sauf trois dessins de l'atelier : le bouton « je ne sais pas » (la pieuvre qui hausse les bras, choisi au lot 3 bis pour ne plus ressembler au « ? » des questions), l'étape « accueil » de la frise (une petite pieuvre) et l'icône de l'application. Par défaut, ils restent : les refaire est un choix graphique (un nouveau pictogramme « je ne sais pas » à faire valider), pas une conséquence du lot. Autres possibilités : une ancre ou une casquette de capitaine pour la frise ; pour « je ne sais pas », des épaules qui se haussent sans personnage.
- **L'encouragement** (lot « Mascotte ») : la règle de la maquette (déception à la première erreur d'une question, encouragement aux suivantes) compte les erreurs depuis la dernière consigne. Dans l'application, chaque erreur est suivie de sa correction puis d'une autre question, avec sa consigne : l'encouragement ne vient donc que quand deux erreurs se suivent sans consigne entre elles (la protection du sélecteur qui redescend d'un cran juste après une erreur, le défi record). Par défaut : la règle de la maquette telle quelle. Autre possibilité : compter les erreurs de la séance (déception à la première, encouragement ensuite, remis à zéro par une réussite).
- **Questions de la relecture du lot « Mascotte »** (`tests/recette-fonctionnelle/out-mascotte/RELECTURE.md`) :
  - la flèche pourrait montrer « réécouter » quand la relance dit « Tu peux réécouter la consigne » (aujourd'hui rien ne le désigne) ;
  - en pause, « Touche la grande bulle pour continuer » : les quatre bulles ont la même taille (déjà avant le lot) ;
  - les leçons écrivent leurs nombres en lettres (« trente-quatre ») : la bulle ne les met pas en rouge ; les écrire en chiffres demanderait de refabriquer les voix des leçons ;
  - dans l'album, le capitaine reste visible, assombri, derrière le voile (la pieuvre aussi l'était) : le cacher comme dans le récif ?
- **La flèche dans les leçons L4 à L6 et L10** (lot « Mascotte ») : la pieuvre y faisait le geste « montrer » sans viser rien de précis ; la flèche ne s'y pose pas (le bernard-l'ermite et les aides montrent déjà). Par défaut : pas de flèche ; à revoir avec le lot « Les leçons ».

- **Part de la famille en cours pour une petite famille** (lot 3 bis) : avec la limite de 3 passages par fait, les doubles et les presque-doubles n'atteignent pas 80 % de la notion du jour pour une enfant en difficulté (62 % en moyenne, 32 à 41 % au plus bas, en simulation). L'accepter, ou relâcher la limite pour les petites familles ?
- **Pictogramme « passer l'échauffement »** (lot 3 ter) : une vague franchie par une flèche. L'enfant peut le confondre avec les vagues du sélecteur de difficulté. Autre idée : une flèche qui saute un rocher. À juger sur la tablette.
- **Ouverture d'une famille par l'échauffement** (lot 3 ter) : une enfant à l'aise atteint les amis de 10 à la 6e séance, pas à la 4e visée. Rien n'a été changé.
- **Variété des tout premiers échauffements** : ils tournent sur 2 ou 3 faits et leurs inverses.
- **Débit des musiques** : 64 kbit/s (3,7 Mo) par défaut, ou 48 kbit/s (2,7 Mo) : à l'écoute.

- **Questions du lot « Les voiliers »** (`docs/JOURNAL-CONCEPTION.md`, « Lot « Les voiliers » ») :
  - au cran conseillé, le vent souffle sur environ deux bateaux sur trois dans la simulation (3 réussites de suite suffisent à le lever, 2 échecs à le calmer) : une enfant à l'aise ne voit presque plus la mer calme ;
  - la voie rapide (5 bateaux justes en moins de 6 s) fait franchir les niveaux 1 et 2 dès la première partie dans la simulation ; le geste du doigt prend 2 à 4 s : à observer ;
  - « je ne sais pas » reste en bas à droite, au bout de la ligne des bouées : il ne gêne pas le geste (le bateau glisse dessous sans le déclencher), mais il couvre un peu l'eau du dernier passage ;
  - la rangée de bouées change tous les 5 bateaux : plus souvent, moins souvent ?
  - le nombre écrit en lettres dans la bulle suit l'orthographe à traits d'union (« trois-cent-quarante-sept ») ; la maquette écrivait « trois cent quarante-sept ».
  - questions de la relecture du lot (`tests/recette-fonctionnelle/out-voiliers/RELECTURE.md`) :
    - avec les pirates, le bateau rattrapé coule sans montrer le bon passage (pas de deuxième essai, comme dans la maquette) : montrer une ombre du bateau au bon passage ? (V4)
    - aux niveaux 1 à 4, environ la moitié des bateaux se rangent avant la première bouée ou après la dernière, parfois très loin (8 parmi 50 · 60 · 70) : il suffit alors de voir qu'il est « beaucoup plus petit » ; borner l'éloignement aux deux bouts, ou leur donner moins de poids ? (V5) Et au niveau 9, le bon passage n'est jamais aux bouts (le nombre est tiré entre la première et la dernière centaine, comme dans la maquette). (V14)
    - aux niveaux 2 et 6, les bouées qui ne sont pas des dizaines sont dites « cette bouée », allumée, sans leur nombre : assez pour une enfant qui ne lit pas ? Des phrases avec les nombres en feraient environ 2 000 de plus. (V7)
    - rien ne montre les passages ni le geste à l'image (la maquette non plus) : allumer les deux bouées du passage visé pendant le glisser, une main qui montre le geste au premier bateau ? Et un signe visible du vent (rides, voiles tendues) ? (V10, V11)
    - une montée de niveau peut être fêtée juste après un naufrage (la règle des 8 sur 10 compte les 10 derniers bateaux) : fêter au bateau réussi suivant ? (V12)
    - les étoiles : en lâchant les bateaux au hasard en « très dur », l'enfant gagne presque autant qu'une enfant appliquée en « plus facile » ; un nombre manqué puis rangé à son retour rapporte deux étoiles. Règle commune à revoir ? (V13)
    - l'écran de pause pose ses boutons sur la rangée de bouées, sans voile sur la mer (V15) ; l'écran des crans dit « Choisis ton niveau » alors que l'enfant vient de choisir un niveau : « Choisis ta mer » pour les voiliers ? (V17, phrase à refaire en voix)
    - au niveau 9, rien ne relie les deux rangées : allumer les deux centaines retenues pendant que la caméra recule ? (V22) Sur le chalutier et la vedette, le nombre est sur une petite plaque (images de la maquette, V21).

## 5. Idées d'amélioration (non décidées)

**Pédagogie et ergonomie** (issues de la relecture extérieure du 27 septembre, non retenues à l'époque)

- **« Je ne sais pas » en deux temps** : une correction courte par défaut, la correction animée complète seulement après une deuxième erreur du même type.
- **Deux indicateurs de séance** pour le parent : la durée réelle et le nombre de questions « utiles ».
- **Récompenses liées à l'effort adapté** plutôt qu'à la difficulté brute : aujourd'hui « très dur » double les étoiles. À observer.
- **Espace parent regroupé en trois ensembles** : séance et difficulté ; son et interface ; données et maintenance.

**Récompenses**

- **Cartes animées** (idée du parent, 27 septembre) : remplacer la version brillante par une courte vidéo en boucle (6 s), WebM ou MP4 sans son, 3:4, 0,3 à 0,8 Mo par carte, téléchargée à la demande. Non décidé.

**Graphisme** (projet parallèle, hors de ce fichier) : la refonte graphique (PR 24 et 26). Le récif vivant est intégré comme collection depuis le 5 octobre 2026 (`docs/SPEC.md`, section 10). Piste notée le 30 septembre, après le constat sur la leçon L10 (rendu daté) : **composition hybride** — les éléments (un poisson, un filet, un chalut, un sac) générés isolément par Nano Banana sur fond uni, détourés, puis **posés et comptés par le code** (le code garantit les quantités exactes, l'image la qualité). C'est la démarche déjà retenue pour le récif vivant.

## 6. À observer avec l'enfant, à vérifier sur la tablette

**Mascotte et voiliers** (6 octobre 2026), après leurs lots :

- **La mer selon le cran** dans les voiliers : choix par défaut de la conception (section 7 bis) ; le revoir après quelques parties.
- **Les voiliers dans la rotation de « jouer »** : non pour l'instant ; à reconsidérer quand les trois points faibles seront acquis.
- **Les signes <, >, =** : pas dans les voiliers ; un format à ajouter au jeu, ou un exercice à part (section 13) ?
- **Des clips de parole courts** (2 à 3 s, même structure que les clips d'attente) donneraient plus de variété quand la mascotte parle et des fins de phrase plus nettes ; `talk-b` ne revient à la pose de départ qu'à sa fin (7,9 s).
- **`wrong`** commence par un bref sourire (vers 0,4 à 0,9 s) avant la déception ; à regarder avec l'enfant : le prend-elle pour de la moquerie ?
- **`success`** dure 8,7 s ; il cède à la phrase suivante dès 1,8 s.
- **`idle-hochement`** (l'ancienne vidéo d'attente) ne revient à la pose de départ qu'après 3,8 s : une phrase qui commence pendant ce clip passe par un fondu visible. Il n'est tiré qu'à l'accueil.
- **La mascotte sur la tablette** (après le lot « Mascotte ») : fluidité des 17 vidéos décodées et du détourage en WebGL avec le lagon (dans le conteneur de développement, sans processeur graphique, la vidéo tourne à 6 à 13 images/s) ; mémoire ; la bulle se lit-elle, ou distrait-elle l'enfant de l'ardoise ? La flèche corail se voit-elle sur l'eau ? Dans le conteneur, la charge de la vidéo retarde les fondus : au parcours `lot3ter`, les étiquettes d'appui long sont à moitié visibles après 0,8 s (9 échecs contre 2 sur `main` ; 3 seulement en masquant la mascotte). Sur la tablette, vérifier qu'un appui long sur « jouer » montre bien son étiquette.

**Après le lot « Sommes jusqu'à 30 »** (octobre 2026 ; choix de la session, `docs/maquettes/sommes30/PROPOSITION.md`) :

- **Le partage entre mémoriser et calculer** : faits jusqu'à 10 + 10 et doubles jusqu'à 15 + 15 à mémoriser (familles 8 à 13), les autres sommes jusqu'à 30 calculées au calcul rapide. À revoir si l'enseignante attend autre chose.
- **Le défi record** avec les grands faits : un défi plus lent, un record qui se bat moins souvent (simulation : records surtout au premier trimestre). Faut-il un record par « âge » des faits ?
- **La part de la famille en cours** pour les presque-doubles jusqu'à 10 (famille 10) : 70 à 80 % en simulation, comme les petites familles (question déjà ouverte ci-dessous).
- **Les deux boîtes** : les places qui brillent aux formes à trou se voient-elles assez sur la tablette ?

**Après le lot « Multiplication »** (octobre 2026 ; choix de la session, `docs/maquettes/multiplication/PROPOSITION.md`) :

- **Les tables une fois acquises** : « jouer » ne propose plus la multiplication quand ses neuf niveaux sont acquis (le moins avancé d'abord), comme le calcul rapide ; les tables ne sont alors revues que par « choisir ». Faut-il une révision espacée des tables, comme les faits d'addition (une famille « tables » dans l'échauffement, ou un niveau de révision) ?
- **Toujours « plus facile »** : à ce cran rien ne monte ; une enfant qui le choisit toujours reste au niveau 1 de la multiplication, et la rotation, qui va au moins avancé, lui donne surtout le calcul rapide et la multiplication (simulation, profil « facile », 2 séances par semaine : 15 séances de multiplication, aucune d'additions en notion du jour après janvier). La parade reste d'interdire ce cran (espace parent).
- **La place dans la rotation** : à partir du 4 janvier 2027 ; avant, par « choisir » seulement. À avancer ou retarder selon la classe.
- **Les tables à mémoriser** : 2, 3, 4, 5 et 10 ; à confirmer sur le texte officiel et auprès de l'enseignante.
- **Le partage et les problèmes multiplicatifs** : pas encore construits (`docs/SPEC.md`, section 13).
- **Sur la tablette** : les rangées de 10 poissons (table de 10, mélange) se lisent-elles ? Les totaux écrits au bout des rangées sont-ils assez gros ?
- **Le menu des leçons** a quatre rangées et seize tuiles : se lit-il encore d'un coup d'œil ? La légende du parent a un pictogramme proche de la bulle des leçons (relecture de l'étape 0) : faut-il un autre dessin ?

**Après le lot « Correctifs »** (octobre 2026) :

- **Les séances courtes avec « choisir »** aux niveaux étroits (ligne niveau 2 « très dur », ligne niveau 8, crans « plus facile ») : 6 à 8 minutes dans la simulation sur une base neuve, acceptées par le parent le 6 octobre 2026 (écart 2.5 de `docs/ECARTS-SPEC.md`). À mesurer à l'usage (historique des séances de l'espace parent) ; si elles reviennent souvent, donner plus de cibles à ces niveaux.
- **Toujours « plus facile »** : depuis que ce cran ne fait jamais monter à la ligne (écart 4.2), une enfant qui le choisit à chaque fois reste au niveau 1 de la ligne (avant, l'écart la faisait passer au niveau 2 conseillé dès la première séance, pour rejouer ensuite le niveau 1), et la rotation de « jouer », qui va au moins avancé, lui donne davantage la ligne : sur l'année simulée (profil « facile », 2 séances par semaine), 31 séances de ligne sur 64 au lieu de 26, 3 d'additions en notion du jour au lieu de 7 ; ses familles s'ouvrent alors surtout par l'échauffement, plus tard (la dernière à la séance 60 au lieu de 34). La parade reste d'interdire ce cran dans l'espace parent.
- **Deux séances le même jour** n'ouvrent plus jamais deux familles d'additions (écart 6.2) ; une famille dépassée ce jour-là ouvre la suivante à la séance d'additions d'un autre jour.

**Depuis les lots précédents :**

- **Écouter** les phrases nouvelles depuis le lot 3, jamais écoutées par une personne : noms des niveaux de « choisir », consignes et corrections du calcul rapide (« 99 moins 90 ? »), leçons L7 à L9, « Tu veux passer l'échauffement ? ». Listes dans `docs/archives/BILAN-LOT3.md` et `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.
- **Durée réelle** d'une séance, surtout de calcul rapide avec le défi (10,6 min en simulation) ; le niveau 3 du calcul rapide, dont une correction peut montrer jusqu'à 9 ponts.
- **La leçon L8** revient-elle trop souvent chez une enfant en difficulté ?
- **Le calcul rapide revient rarement** chez une enfant rapide avec « jouer ».
- **La pause** : choisir un autre exercice depuis la pause devient-il une façon d'éviter ce qui est difficile ?
- **Les aides passables** : les deux triangles jaunes poussent-ils l'enfant à tout passer ?
- **Choisir en un toucher** : l'enfant ne valide-t-elle pas par erreur ?
- **Le défi** : la bulle qui se vide se lit-elle comme un temps ?
- **Fluidité et mémoire** : jusqu'à 224 Mo de planches décodées (ancien récif ouvert pendant une pause, mesure sur ordinateur ; à remesurer avec le récif vivant, dont les images ne sont plus des planches) ; le récif vivant (WebGL et grandes images) sur la tablette ; 51 Mo de voix à télécharger la première fois. Modèle de la tablette inconnu.

## 7. À demander, à préparer

- **À l'enseignante** : la progression de la classe (fractions, soustraction posée et sa méthode, heure, monnaie), pour caler les phases ; son vocabulaire (« amis de 10 », « maison des nombres », « mur ») pour l'aligner.
- **Cartes** : illustrations et anecdotes du grand large **avant début février 2027**, des abysses **avant fin avril 2027**.
- **Calendrier scolaire 2027-2028** dans `app/content/calendrier.json`, avant la rentrée 2027.
- **Vérifier le programme** : la synthèse du programme 2024 transmise par le parent est une reformulation (incohérence sur 1/10) ; vérifier les indicateurs de fluence dans l'annexe 4 officielle avant d'en faire des objectifs chiffrés.
