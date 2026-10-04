# Idées et questions ouvertes

Tout ce qui n'est pas décidé : idées d'amélioration, questions laissées avec une valeur par défaut, points à observer avec l'enfant. Tenu en conception. Quand un point est tranché, la règle va dans `docs/SPEC.md`, la raison dans `docs/JOURNAL-CONCEPTION.md`, et la ligne est retirée d'ici.

Dernière mise à jour : 30 septembre 2026, après la fusion du lot 3 ter (PR 25).

## 1. À faire ensuite (dans l'ordre proposé)

1. **Essai sur la tablette** du lot 3 ter (parent).
2. **Session relecteur de contrôle** des lots 3 bis et 3 ter (`docs/PROMPTS.md`, « Relecteur ») : les constats R1 à R25 de la première recette fonctionnelle sont-ils levés, et y a-t-il des régressions ? Jamais faite, reportée deux fois.
3. **Confrontation de `docs/SPEC.md` avec le code** (`docs/PROMPTS.md`, « Confrontation ») : la liste des écarts, à trancher par le parent.
4. **Revue de périmètre** (section 2), puis le lot suivant.

## 2. Revue de périmètre : questions à trancher avant le prochain lot

- **L'échauffement quand un exercice est choisi** : aujourd'hui il reste, sauf si on le passe. Le garder, le supprimer, ou le réduire quand l'enfant a choisi ?
- **Le nombre de crans de difficulté** : quatre crans sur chaque exercice multiplient les cas à tester (116 combinaisons pour la seule vérification des séquences). En garder quatre, ou passer à trois ?
- **L'ordre des prochains lots.** Proposition de conception (30 septembre) :
  1. un lot court avec les **sommes jusqu'à 20** et les **bilans périodiques** (la mesure objective des progrès) ;
  2. **l'heure et la monnaie**, au moment où la classe les aborde (d'où la question à l'enseignante, section 5) ;
  3. **les problèmes et le dénombrement** (compétences presque acquises : entretien) ;
  4. comparer, doubles et moitiés, pair et impair.
- **Le crabe**, prévu comme personnage des problèmes : au vu de ce que le bernard-l'ermite a apporté (rien de pédagogique, avis du parent), le laisser de côté ?
- **Le « problème du jour »** : une étape fixe de chaque séance (prévu à l'origine) ou un exercice qu'on choisit comme les autres ?
- **Le lagon sous les exercices** (lot « Lagon en fond d'exercices », octobre 2026). Décision du parent : aucune adaptation de lisibilité. Relevé, pour mémoire, de ce que le fond met sous l'exercice (captures : `node tests/e2e/lagon.mjs`) :
  - les nombres de la ligne graduée sont écrits sur le sable du panorama, dont les rides sont des traits d'encre aussi épais que les chiffres ; le bord du sable passe au ras du haut des nombres à gauche ;
  - le rocher de gauche est sous le poteau et le « 0 » ; le rocher de droite et ses algues sous les nombres 7 à 9 (ligne de 0 à 10) et sous les touches 3, 4, 8, 9 et la coche du pavé ; les algues passent derrière les nombres (décision du parent) ;
  - une étoile de mer peinte dans le sable, au milieu de l'écran, entre les bulles-réponses, à côté de l'étiquette du poisson en « placer » et « estimer », entre les touches 8 et 9 : le même animal que la cible du format « lire » ;
  - le corail de droite sous le bout de la ligne, sous « je ne sais pas » ; le miroitement derrière la frise ;
  - écran « choisir » : les tuiles 10, 11 et 13 de la ligne sont posées devant les algues et les rochers (la règle de la section 3 dit « ni posée sur la pieuvre ou les algues ») : garder ainsi, ou déplacer les tuiles ?

## 3. Questions laissées avec une valeur par défaut

- **Part de la famille en cours pour une petite famille** (lot 3 bis) : avec la limite de 3 passages par fait, les doubles et les presque-doubles n'atteignent pas 80 % de la notion du jour pour une enfant en difficulté (62 % en moyenne, 32 à 41 % au plus bas, en simulation). L'accepter, ou relâcher la limite pour les petites familles ?
- **Pictogramme « passer l'échauffement »** (lot 3 ter) : une vague franchie par une flèche. L'enfant peut le confondre avec les vagues du sélecteur de difficulté. Autre idée : une flèche qui saute un rocher. À juger sur la tablette.
- **Ouverture d'une famille par l'échauffement** (lot 3 ter) : une enfant à l'aise atteint les amis de 10 à la 6e séance, pas à la 4e visée. Pour tenir 4 séances : relever la limite de faits nouveaux pour une enfant qui passe tout par la voie rapide, ou assouplir la condition « tous les faits introduits ». Rien n'a été changé.
- **Variété des tout premiers échauffements** : ils tournent sur 2 ou 3 faits et leurs inverses. Viser 5 réponses différentes changerait l'ordre d'introduction des faits (les deux ordres des termes à la suite).
- **Débit des musiques** : 64 kbit/s (3,7 Mo) par défaut, ou 48 kbit/s (2,7 Mo) : à l'écoute.

## 4. Idées d'amélioration (non décidées)

**Contenu**

- **Sommes jusqu'à 20** : attendu de CE1, suite directe des additions ; prévu « après maîtrise » mais dans aucun lot.
- **Géométrie et mesures** (longueurs, masses) : domaines du programme de cycle 2 absents de tout le plan. Choix de départ (l'application vise les trois compétences faibles), à reconsidérer une fois les modules actuels en place.

**Pédagogie et ergonomie** (issues de la relecture extérieure du 27 septembre, non retenues à l'époque)

- **« Je ne sais pas » en deux temps** : une correction courte par défaut, la correction animée complète seulement après une deuxième erreur du même type. Le bouton « passer » existe déjà ; à reconsidérer si l'enfant vit « je ne sais pas » comme une pénalité.
- **Deux indicateurs de séance** pour le parent : la durée réelle et le nombre de questions « utiles » (une séance de 8 minutes et 20 questions bien choisies peut valoir mieux que 40 questions répétitives).
- **Récompenses liées à l'effort adapté** plutôt qu'à la difficulté brute : aujourd'hui « très dur » double les étoiles. C'est voulu (inciter à choisir plus dur), mais cela peut pousser à un cran inadapté. À observer.
- **Espace parent regroupé en trois ensembles** : séance et difficulté ; son et interface ; données et maintenance.

**Récompenses**

- **Cartes animées** (idée du parent, 27 septembre) : remplacer la version brillante par une courte vidéo en boucle (6 s). Faisable : WebM (VP9) ou MP4 (H.264) sans son, 3:4 (720 × 960 ou 600 × 800), 24 images/s, 0,3 à 0,8 Mo par carte ; l'image fixe garde son rôle d'affiche et d'album ; une seule vidéo jouée à la fois ; téléchargement à la demande plutôt que tout en cache. Une vidéo générée en 9:16 se recadre en 3:4 en gardant toute la largeur et 75 % de la hauteur. Non décidé.

**Graphisme** (projet parallèle, hors de ce fichier) : le récif vivant (mer continue, kit `kit-recif-vivant.zip`), la refonte graphique (PR 24 et 26).

## 5. À observer avec l'enfant, à vérifier sur la tablette

- **Écouter** les phrases nouvelles depuis le lot 3, jamais écoutées par une personne : noms des niveaux de « choisir », consignes et corrections du calcul rapide (en particulier les grands nombres, « 99 moins 90 ? »), leçons L7 à L9, « Tu veux passer l'échauffement ? ». Listes dans `docs/archives/BILAN-LOT3.md` (« Textes nouveaux à valider à l'écoute ») et `docs/archives/AVANCEMENT-lots-1-a-3ter.md`.
- **Durée réelle** d'une séance, surtout de calcul rapide avec le défi (10,6 min en simulation) ; le niveau 3 du calcul rapide, dont une correction peut montrer jusqu'à 9 ponts.
- **La leçon L8** revient-elle trop souvent chez une enfant en difficulté (relancée par la difficulté persistante au niveau 6) ?
- **Le calcul rapide revient rarement** chez une enfant rapide avec « jouer » (la rotation prend l'exercice le moins avancé) : « choisir » ou l'exercice imposé y ramènent.
- **La pause** : choisir un autre exercice depuis la pause devient-il une façon d'éviter ce qui est difficile ? L'historique le montre (« autre exercice choisi par l'enfant »).
- **Les aides passables** : les deux triangles jaunes poussent-ils l'enfant à tout passer ? L'historique compte les aides et les corrections passées.
- **Choisir en un toucher** : l'enfant ne valide-t-elle pas par erreur ? Entend-elle le nom avant l'écran suivant ?
- **Le défi** : la bulle qui se vide se lit-elle comme un temps ?
- **Fluidité et mémoire** : jusqu'à 224 Mo de planches décodées (récif ouvert pendant une pause, mesure sur ordinateur) ; 51 Mo de voix à télécharger la première fois. Modèle de la tablette inconnu.

## 6. À demander, à préparer

- **À l'enseignante** : la progression de la classe (centaines, heure, monnaie), pour caler l'ordre des lots ; son vocabulaire (« amis de 10 », « maison des nombres », « mur ») pour l'aligner.
- **Cartes** : illustrations et anecdotes du grand large **avant début février 2027**, des abysses **avant fin avril 2027** (méthode et prompts dans `docs/JOURNAL-CONCEPTION.md`). Question d'échelle dans le récif pour les très grands animaux (baleines).
- **Calendrier scolaire 2027-2028** dans `app/content/calendrier.json`, avant la rentrée 2027.
