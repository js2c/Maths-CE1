# Guide du parent

Ce guide explique, sans connaissances techniques, comment mettre l'application en ligne, l'installer sur la tablette et suivre la progression. Il correspond au lot 1 et au lot 1 bis (septembre 2026), avec les correctifs du 27 septembre 2026.

## a) L'adresse de l'application

**https://js2c.github.io/Maths-CE1/**

Cette adresse fonctionne dès que les deux réglages ci-dessous sont faits et que le travail est arrivé sur la branche `main` (la branche principale du dépôt). Tant que ce n'est pas le cas, la page affiche une erreur 404 : c'est normal.

## b) Les réglages à faire dans GitHub (une seule fois)

1. Sur la page du dépôt (github.com/js2c/Maths-CE1), ouvrir **Settings** (l'onglet avec une roue dentée), puis **Pages** dans la colonne de gauche.
2. Dans **Build and deployment**, à la ligne **Source**, choisir **GitHub Actions** (et non « Deploy from a branch »). Il n'y a rien d'autre à remplir.
3. Faire arriver le travail sur `main` : ouvrir l'onglet **Pull requests**, ouvrir la demande de fusion du lot (par exemple celle de la branche `claude/blissful-hamilton-vnwgme` pour le lot 1 bis, ou en créer une avec **New pull request**, base `main`), puis **Merge pull request**.
4. Ouvrir l'onglet **Actions** : une ligne « Publier l'application » apparaît. Au bout d'une à deux minutes, elle devient verte. L'application est en ligne.

Ensuite, chaque modification arrivée sur `main` est publiée toute seule de la même façon. Si une ligne devient rouge, l'ancienne version reste en ligne : rien n'est cassé sur la tablette. On peut aussi relancer la publication à la main : **Actions** > **Publier l'application** > **Run workflow**.

Le dépôt est public : l'application et son code sont visibles par tous, mais **aucune donnée de l'enfant n'y est jamais envoyée** (tout reste sur la tablette).

## c) Installer l'application sur la tablette Android

1. Sur la tablette, ouvrir **Chrome** et aller à l'adresse ci-dessus, avec le Wi-Fi.
2. Attendre que l'océan s'affiche et s'anime (quelques secondes la première fois).
3. Toucher le menu **⋮** en haut à droite de Chrome, puis **Installer l'application** (ou **Ajouter à l'écran d'accueil** puis **Installer**).
4. Une icône « Océan » (la pieuvre) apparaît sur l'écran d'accueil. Ouvrir l'application par cette icône désormais : elle s'ouvre en plein écran, sans barre d'adresse.

**Sans Internet.** Après la première ouverture avec le Wi-Fi, l'application a tout gardé sur la tablette : elle marche ensuite sans réseau.

**Mises à jour.** Quand une nouvelle version est publiée, la tablette la télécharge d'elle-même à la prochaine ouverture avec le Wi-Fi ; elle s'affiche à l'ouverture suivante. Les données de l'enfant sont gardées.

**La voix.** Depuis le lot 1 bis, chaque phrase est enregistrée à l'avance (voix « siwis », celle que vous avez choisie) et fait partie de l'application : il n'y a rien à régler, elle marche aussi sans Internet. Monter le volume « multimédia ». La synthèse vocale d'Android ne sert plus que de secours, pour un nom de pieuvre que vous auriez tapé vous-même ; pour ce cas, on peut choisir dans **Paramètres** > **Système** > **Langues et saisie** > **Synthèse vocale** (le chemin varie selon la marque) le moteur **Google** en **français (France)**. La voix ne démarre qu'après le premier toucher sur l'écran (règle de Chrome) : c'est pour cela que la séance commence par la grosse bulle « jouer ».

**Pendant la séance.**

- La **maison**, en haut à gauche, met la séance en pause : l'écran se vide, seule reste la bulle pour continuer. La séance reprend là où elle en était, et le temps de pause ne compte pas dans les 12 minutes.
- La **frise**, en haut, montre les étapes de la séance : de petits dessins plats enfilés sur une corde fine ; l'étape en cours brille doucement et, à côté, une petite bulle se remplit à chaque question. Ce n'est pas un bouton : elle ne réagit pas au toucher.
- La bulle au **point d'interrogation** (en bas à droite, ou à droite du pavé) veut dire « je ne sais pas » : l'application montre la réponse, la voix rassure, et la question reviendra plus tard. Elle compte comme une réponse fausse pour le choix des niveaux.
- Les **deux triangles jaunes** (en haut à droite, toujours au même endroit) permettent de **passer**, dès la première fois : une leçon, un exemple montré par la tortue, ou une correction après une erreur ou un « je ne sais pas ». Une leçon passée ne rapporte pas ses 3 étoiles, et l'application enchaîne tout de suite sur « À toi ! » et l'exercice guidé. Une correction passée montre la bonne réponse environ une seconde, puis passe à la question suivante ; la question reviendra plus tard, comme après toute erreur. Tout cela est noté dans l'historique (« passée », « exemple guidé passé », « correction passée »).
- Pendant une **leçon**, il n'y a que deux boutons : les triangles jaunes pour passer, et la flèche ronde en bas à droite pour **rejouer** la leçon depuis le début.
- Les animations des exemples et des corrections vont **une fois et demie plus vite** qu'au premier essai (la voix garde son débit). Ce réglage est dans le fichier `app/content/seance.json` (`vitesseAnimations` : 1 = vitesse d'origine, 1.5 = plus rapide) ; le modifier demande une nouvelle publication.

**Tenir la tablette en paysage.** L'application est prévue pour l'écran couché.

**Une séance par jour.** Une fois la séance du jour finie, l'écran montre la lune (« à demain »), qui n'est qu'un décor. La bulle **« Encore ! »** (triangle doré) ouvre l'entraînement libre : la ligne des nombres, les additions ou une leçon déjà vue, aussi longtemps que l'enfant veut (la voix propose d'arrêter au bout de 10 minutes ; la maison ramène à la lune). L'entraînement libre ne rapporte ni étoiles ni coquillages, pour que les récompenses restent liées au rendez-vous du soir, mais ses réponses comptent dans le suivi. Le récif et l'**album** (le livre au coquillage) se visitent librement.

**Les cartes et l'album.** Chaque coquillage (25 étoiles, environ un par séance) contient une carte illustrée. L'album montre les quatre zones du récif : les cartes gagnées, le dos de celles qui restent à découvrir, et les zones pas encore ouvertes (assombries). Seul le lagon est ouvert pour l'instant ; les autres zones viendront au lot 4.

## d) L'espace parent

**Y entrer.** Sur l'écran d'accueil de l'application (celui avec la bulle « jouer » ou la lune), une petite icône de la pieuvre est posée en bas à gauche, sur le sable. **Appuyer dessus et garder le doigt 2 secondes** : un anneau clair se remplit, puis le clavier du code apparaît. Un toucher bref ne fait rien, pour que l'enfant ne tombe pas dessus par hasard.

**Le code.** La première fois, choisir un code à 4 chiffres et le taper une seconde fois pour le confirmer. Les fois suivantes, taper ce code. En cas d'oubli : **Code oublié ?**, répondre à l'opération proposée (par exemple 7 × 8 + 15), puis choisir un nouveau code ; rien n'est effacé.

**Ce qu'on y trouve.**

- **Calendrier** : chaque jour travaillé, avec la durée et la part de réponses justes (en vert à partir de 80 %, en jaune de 50 à 79 %, en orange en dessous ; hachuré si la séance a été interrompue). Toucher un jour montre ses séances.
- **Séances** : l'historique complet. Toucher une séance déplie chaque question posée, la réponse donnée, la bonne réponse, le temps mis, le nombre d'écoutes de la consigne et, pour la ligne graduée, le type d'erreur (par exemple « E1 · compte les traits au lieu des sauts »). Les « je ne sais pas » sont comptés à part des erreurs ; on voit aussi les exemples, les corrections et les leçons passés, les pauses et, marqué « entraînement libre », ce qui a été fait après la séance (qui n'apparaît pas dans le calendrier).
- **Progression** : le niveau atteint sur la ligne graduée (sur 8) et les dates, les faits d'addition rangés par boîte (de la boîte 1, revue à chaque séance, à la boîte 5, revue tous les 15 jours) et ceux qui résistent, deux courbes semaine par semaine (réussite et temps de réponse), le journal des erreurs avec des exemples réels, et le trésor de l'enfant (étoiles, cartes).
- **Données et réglages** : les sauvegardes, le nom de la pieuvre, la durée maximale d'une séance (10, 12 ou 15 minutes), le changement de code, et « Tout effacer ».

**Sauvegarder chaque semaine.** Les données ne sont que sur la tablette. Elles seraient perdues si l'on effaçait les données de Chrome ou si l'on désinstallait l'application. Dans **Données et réglages**, **Sauvegarde complète (JSON)** enregistre un fichier dans les Téléchargements de la tablette ; **Envoyer la sauvegarde…** permet de l'envoyer directement vers Drive ou par e-mail. Un rappel s'affiche si la dernière sauvegarde date de plus d'une semaine. Pour tout récupérer (nouvelle tablette, effacement) : **Restaurer une sauvegarde** et choisir ce fichier. Les boutons **CSV** donnent des tableaux à ouvrir dans Excel, LibreOffice ou Google Sheets ; ils servent à lire, pas à restaurer.

**Tester l'espace parent** (sans gêner l'enfant) :

1. Faire une séance complète (environ 10 minutes) jusqu'à la lune.
2. Entrer dans l'espace parent, choisir un code.
3. Vérifier que le jour apparaît dans le **Calendrier**, puis déplier la séance dans **Séances** : on doit y retrouver les additions de l'échauffement et les questions de la ligne graduée.
4. Faire une **Sauvegarde complète** et vérifier que le fichier est dans les Téléchargements.
5. Pour recommencer à zéro avant que l'enfant ne commence vraiment : **Données et réglages** > **Tout effacer** (cela efface aussi le code et le nom de la pieuvre ; au prochain lancement, l'enfant choisira le nom).

## e) Ce qui reste approximatif ou à ajuster

**À vérifier sur la vraie tablette.** Écouter la voix (aucune phrase n'a été écoutée par une personne, la vérification a été automatique) et regarder les illustrations des cartes en grand. Toutes les mesures ont été faites sur un ordinateur, en ralentissant le processeur 4 fois pour imiter une tablette : démarrage en moins de 1,5 s, animation à 50 à 60 images par seconde la plupart du temps, avec des baisses vers 30 pendant certaines animations (l'application allège alors d'elle-même le décor). Il faut confirmer que tout reste fluide sur la tablette.

**Propositions qui attendent votre avis** (détaillées dans `docs/AVANCEMENT.md`, rubrique « Décisions prises ») :

- les deux exemples guidés montrés par la tortue avant les questions, et le déroulé exact des leçons L1 à L3 ;
- la liste des 15 cartes du lagon et leurs anecdotes, à relire (fichier `app/content/cartes.json`) ;
- les règles de la série (5 étoiles toutes les 3 séances, jamais de remise à zéro) et de l'étoile dorée ;
- lot 1 bis (détail dans `docs/BILAN-LOT1BIS.md`) : le coquillage à 25 étoiles au lieu de 40, les phrases des zones fermées de l'album, les nouvelles phrases (reprise, « Encore ! », album), et le fait qu'une leçon passée soit suivie de son exercice guidé.

**Défauts connus, sans gravité.**

- Dans deux retours d'erreur (E2 et E5), une partie des arcs et des bulles passe derrière les bras de la pieuvre quand la ligne commence tout à gauche ; la tortue qui part de 0 passe devant ses bras.
- La pieuvre montre toujours vers la droite, même quand l'étoile est à gauche.
- Un petit à-coup (environ un dixième de seconde) à l'apparition de certaines questions.
- Pendant une pause, un saut de la tortue déjà commencé se termine (moins d'une seconde), et la phrase coupée est redite depuis son début.

**Pas encore fait (prévu dans les lots suivants).** La grille des 66 additions et le défi chronométré (lot 2), le calcul rapide (lot 3), les problèmes, les bilans officiels toutes les deux semaines, les zones 2 à 4 du récif avec leurs cartes et les cartes légendaires (lot 4). La « surprise une séance sur cinq » (créature visiteuse) n'est pas faite. Dans l'espace parent, le choix du module du lendemain n'existe pas encore, puisqu'il n'y a pour l'instant qu'une notion du jour (la ligne graduée).

**Stockage protégé.** Chrome accorde en général la protection des données (« stockage persistant ») quand l'application est installée sur l'écran d'accueil. L'espace parent indique si c'est le cas (**Données et réglages** > **Données protégées**). Même accordée, elle ne protège pas d'un effacement volontaire : la sauvegarde de la semaine reste la vraie sécurité.
