# Guide du parent

Ce guide explique, sans connaissances techniques, comment mettre l'application en ligne, l'installer sur la tablette et suivre la progression. Il correspond aux lots 1, 1 bis, 2 et 3 (septembre 2026), avec les décisions du 27 et du 28 septembre 2026. Les bilans sont dans `docs/archives/BILAN-LOT2.md` et `docs/archives/BILAN-LOT3.md`. Les nouveautés du lot 3 sont regroupées dans la partie **d bis**.

## a) L'adresse de l'application

**https://js2c.github.io/Maths-CE1/**

Cette adresse fonctionne dès que les deux réglages ci-dessous sont faits et que le travail est arrivé sur la branche `main` (la branche principale du dépôt). Tant que ce n'est pas le cas, la page affiche une erreur 404 : c'est normal.

## b) Les réglages à faire dans GitHub (une seule fois)

1. Sur la page du dépôt (github.com/js2c/Maths-CE1), ouvrir **Settings** (l'onglet avec une roue dentée), puis **Pages** dans la colonne de gauche.
2. Dans **Build and deployment**, à la ligne **Source**, choisir **GitHub Actions** (et non « Deploy from a branch »). Il n'y a rien d'autre à remplir.
3. Faire arriver le travail sur `main` : ouvrir l'onglet **Pull requests**, ouvrir la demande de fusion prête (par exemple « Lot 2, étapes 7 à 9 », ou en créer une avec **New pull request**, base `main`), puis **Merge pull request**.
4. Ouvrir l'onglet **Actions** : une ligne « Publier l'application » apparaît. Au bout d'une à deux minutes, elle devient verte. L'application est en ligne.

Ensuite, chaque modification arrivée sur `main` est publiée toute seule de la même façon. Si une ligne devient rouge, l'ancienne version reste en ligne : rien n'est cassé sur la tablette. On peut aussi relancer la publication à la main : **Actions** > **Publier l'application** > **Run workflow**.

Le dépôt est public : l'application et son code sont visibles par tous, mais **aucune donnée de l'enfant n'y est jamais envoyée** (tout reste sur la tablette).

## c) Installer l'application sur la tablette Android

1. Sur la tablette, ouvrir **Chrome** et aller à l'adresse ci-dessus, avec le Wi-Fi.
2. Attendre que l'océan s'affiche et s'anime (quelques secondes la première fois).
3. Toucher le menu **⋮** en haut à droite de Chrome, puis **Installer l'application** (ou **Ajouter à l'écran d'accueil** puis **Installer**).
4. Une icône « Maths CE1 » (le logo de l'écran de démarrage) apparaît sur l'écran d'accueil. Ouvrir l'application par cette icône désormais : elle s'ouvre en plein écran, sans barre d'adresse.

**Si l'icône est encore la pieuvre** (application installée avant le 10 octobre 2026) : Android ne change souvent l'icône et son nom qu'après avoir **désinstallé puis réinstallé** l'application. Désinstaller ne perd pas la progression tant qu'on ne vide pas les données du site dans Chrome ; mais **faites d'abord une sauvegarde complète** (espace parent, **Données et réglages**), par sécurité. Puis réinstaller comme ci-dessus (étapes 1 à 3).

**Sans Internet.** Après la première ouverture avec le Wi-Fi, l'application a tout gardé sur la tablette : elle marche ensuite sans réseau.

**Mises à jour.** Quand une nouvelle version est publiée, la tablette la télécharge d'elle-même à la prochaine ouverture avec le Wi-Fi ; elle s'affiche à l'ouverture suivante. Les données de l'enfant sont gardées.

**La voix.** Depuis le lot 1 bis, chaque phrase est enregistrée à l'avance et fait partie de l'application ; depuis octobre 2026, c'est votre voix, imitée par un modèle sur votre ordinateur (pour ajouter des phrases : `docs/VOIX.md`) : il n'y a rien à régler, elle marche aussi sans Internet. Monter le volume « multimédia ». La synthèse vocale d'Android ne sert plus que de secours, pour une phrase nouvelle dont vous n'avez pas encore fabriqué le son ; pour ce cas, on peut choisir dans **Paramètres** > **Système** > **Langues et saisie** > **Synthèse vocale** (le chemin varie selon la marque) le moteur **Google** en **français (France)**. La voix ne démarre qu'après le premier toucher sur l'écran (règle de Chrome) : c'est pour cela que la séance commence par la grosse bulle « jouer ».

**Le son (depuis le lot 2, étape 4).** Une petite musique douce accompagne la séance et l'entraînement libre : l'une des trois que vous avez choisies (la harpe du lagon, le marimba des bulles, les profondeurs), tirée au hasard au début de chaque séance et gardée jusqu'à la fin, même après une pause. Elle démarre en douceur au premier toucher, reste toujours bien plus basse que la voix, baisse encore quand la voix parle, devient très faible pendant la pause et s'arrête à la fin de la séance. De petits bruitages marquent les bonnes réponses (des bulles claires), les erreurs (une bulle grave et douce, jamais un son d'échec), les étoiles, le coquillage, la carte qui se retourne, les cartes brillantes, les boutons et l'ouverture d'une zone. Dans l'espace parent (**Données et réglages**, ligne **Son**) : musique oui ou non, son volume (douce, moyenne, plus forte), bruitages oui ou non. Tout se tait pendant la visite de l'espace parent. Le volume général reste celui de la tablette.

**Pendant la séance.**

- **Le choix du niveau (depuis le lot 2, étape 2).** Juste après le bonjour de la mascotte, quatre grosses bulles montrent des vagues de plus en plus grosses : plus facile, le niveau conseillé (celui que l'application a calculé, entouré d'une lueur et déjà choisi), plus dur, très dur. Sous chaque vague, ce qu'elle rapporte : une demi-étoile, une étoile, une étoile et demie ou deux étoiles de mer par bonne réponse. L'enfant touche une bulle (la voix dit ce qu'elle rapporte), puis la coche verte ; si elle ne touche rien pendant 15 secondes, la séance commence au niveau conseillé. Le choix vaut pour toute la séance. Sur la ligne des nombres, « plus dur » donne un niveau au-dessus, « très dur » deux ; aux additions, plus de faits nouveaux et des additions à trou (« 3 plus combien, ça fait 7 ? »). Réussir au-dessus fait avancer pour de bon ; se tromper au-dessus ne fait jamais reculer. Si elle se trompe beaucoup à un niveau plus dur (3 erreurs sur 5), l'application redescend d'un cran pour le reste de la séance (« On essaie un peu moins dur ? »). Vous pouvez interdire des crans dans l'espace parent.
- **Si l'enfant choisit « plus facile » presque à chaque séance.** Le cran « plus facile » est fait pour souffler un soir de fatigue : il **consolide sans faire progresser**. Sur la ligne des nombres, les questions sont un niveau en dessous, et les réussir ne fait pas monter le niveau conseillé. Aux additions, l'aide (la boîte à dix places, la maison, la tortue qui saute…) est montrée d'emblée avant chaque question : une addition réussie ainsi reste dans sa boîte, sans monter (comme une addition réussie avec le coquillage), et sans redescendre non plus ; seule une erreur la fait revenir plus souvent. C'est voulu. Si elle le choisit presque à chaque séance, elle ne monte plus de niveau (la simulation de toute une année la laisse au niveau 2 de la ligne des nombres, et ses additions ne sont jamais bien sues) et gagne moins d'étoiles. Dans ce cas, et seulement dans ce cas : **Données et réglages** > **Difficulté proposée à l'enfant**, à la ligne « Le plus facile », toucher **conseillé**. Le sélecteur ne montre plus « plus facile » ; le choix est enregistré aussitôt, et vous pourrez le rendre à nouveau disponible de la même façon. Regardez l'onglet **Séances** (difficulté choisie à chaque séance) et **Progression** (niveau atteint) pour savoir si c'est le cas.
- **Les nombres jusqu'à 1 000 (depuis le lot 2, étape 8).** Quand le niveau 8 de la ligne des nombres est acquis, cinq niveaux de plus s'ouvrent : la ligne de 0 à 1 000 (pas de 100), une centaine découpée en dizaines (par exemple 300 à 400), vingt graduations dans les centaines (par exemple 340 à 360), la **dictée** (la voix dit « Écris le nombre trois-cent-sept », l'enfant le tape au pavé) et l'estimation sur une ligne de 0 à 1 000 sans graduations. Une petite leçon animée présente les centaines : un filet, c'est dix poissons ; dix filets vont dans un grand chalut, cent poissons ; trois chaluts et sept poissons, c'est 307, avec un zéro au milieu. Sur la ligne, un petit chalut marque chaque centaine. Deux erreurs nouvelles sont reconnues et corrigées avec les chaluts et les filets : confondre dizaines et centaines (37 ou 370 pour 307) et écrire le nombre comme on l'entend (3007 pour 307). Vous pouvez aussi placer directement l'enfant à l'un de ces niveaux (point de départ, niveaux 1 à 13).
- **La notion du jour tourne (depuis le lot 2, étape 6 ; trois exercices depuis le lot 3)** : avec « jouer », l'application choisit, d'une séance à l'autre, la ligne des nombres, les additions ou le calcul rapide (le moins avancé d'abord, jamais deux fois de suite le même). Les additions se font avec le bernard-l'ermite (le petit crabe dans sa coquille, en bas à gauche). Les additions sont apprises par familles : « + 1 et + 2 », les doubles, les amis de 10, les maisons de 5, 6 et 7, les maisons de 8 et 9, les presque-doubles (3 + 4, c'est 3 + 3 et une bulle de plus), puis le mélange. Une famille s'ouvre quand les additions déjà vues sont bien parties ; quand une famille est bien sue, l'enfant gagne une étoile arc-en-ciel. La première fois qu'une famille est la notion du jour, une petite leçon animée la présente (les doubles, les amis de 10 avec la boîte à dix places, la maison des nombres), ou deux exemples montrés par le bernard-l'ermite ; ensuite deux exemples, que l'on peut passer. Après une erreur, l'application montre l'aide de la famille (la boîte à dix places, la maison, le poisson et son reflet, la tortue qui saute) puis la bonne réponse. Quand la moitié d'une famille est bien sue, ses additions arrivent aussi sous les formes « 3 plus combien, ça fait 7 ? » et « Combien plus 4, ça fait 6 ? ». **Si une famille résiste** (pas bien sue après 6 séances d'additions, réglage du fichier `app/content/module2.json`), la famille suivante devient la notion du jour, avec sa leçon ; la famille qui résiste n'est pas abandonnée : ses additions reviennent à l'échauffement et parmi les autres questions, et elle peut encore être acquise (dans l'espace parent, elle est marquée « en révision »). Ainsi une enfant qui peine ne reste pas toute l'année sur la même famille.
- **Le coquillage d'aide** (à gauche du pavé des additions) montre l'aide de la famille. Dès qu'elle commence, les deux triangles jaunes permettent de la **passer** : la voix se tait, l'aide est rangée et le pavé revient tout de suite. Une addition réussie avec le coquillage reste dans sa boîte (elle ne monte pas).
- **Une séance plus longue** : 10 à 14 additions à l'échauffement (au lieu de 5 à 8), puis 12 à 16 questions de ligne des nombres. Les additions faciles « 4 + 0 », qui servent à mesurer la vitesse de frappe, ne reviennent plus qu'une séance sur cinq. Trois places de l'échauffement sont gardées pour des additions nouvelles tant qu'il en reste ; une addition nouvelle réussie tout de suite, vite et sans aide, est considérée comme presque sue, et d'autres additions nouvelles peuvent alors s'ajouter (au plus 6 nouvelles par séance).
- **Le défi record (depuis le lot 2, étape 7).** À partir de la 5e séance, et dès qu'au moins 8 additions sont bien sues, la séance se termine par une minute de défi, juste avant la récompense : seulement des additions déjà bien sues, au pavé, sans que la voix lise chaque question. Le temps est une grosse bulle pleine d'eau qui se vide (aucun chiffre de secondes) ; chaque bonne réponse ajoute une perle d'or, et un petit drapeau rouge marque son record. À la fin, la voix dit combien de bonnes réponses elle a trouvées et si c'est un nouveau record (5 étoiles de mer). Elle n'est jamais comparée à d'autres enfants ni à une norme. Une erreur montre la bonne réponse un instant, sans explication (le temps continue). Vous pouvez désactiver le défi dans l'espace parent.
- La **maison**, en haut à gauche (pendant l'échauffement, l'exercice du jour, les leçons, les corrections et le défi), met la séance en pause et montre l'accueil (voir **d bis**, « La maison pendant la séance ») : **continuer** (le triangle rouge) la reprend exactement là où elle en était ; **choisir**, le récif et l'album restent possibles. Le temps de pause, visites comprises, ne compte pas dans les 12 minutes. L'enfant n'a pas de bouton pour arrêter la séance ; si elle ne veut ou ne peut pas continuer, **vous** pouvez la terminer : pendant la pause, entrer dans l'espace parent (la petite pieuvre en bas à gauche, appui long), toucher **Terminer la séance…** en haut, puis **Oui, terminer la séance**. Elle est notée « interrompue », sans coquillage ni carte à la fin (les étoiles déjà gagnées restent), et l'application revient à l'accueil : une autre séance pourra être faite le même jour.
- La **frise**, en haut, montre les étapes de la séance : de petits dessins plats enfilés sur une corde fine ; l'étape en cours brille doucement et, à côté, une petite bulle se remplit à chaque question. Ce n'est pas un bouton : elle ne réagit pas au toucher.
- La bulle au **point d'interrogation** (en bas à droite, ou à droite du pavé) veut dire « je ne sais pas » : l'application montre la réponse, la voix rassure, et la question reviendra plus tard. Elle compte comme une réponse fausse pour le choix des niveaux.
- Les **deux triangles jaunes** (en haut à droite, toujours au même endroit) permettent de **passer**, dès la première fois : une leçon, un exemple montré par la tortue, une correction après une erreur ou un « je ne sais pas », ou l'aide des additions. Une leçon passée ne rapporte pas ses 3 étoiles, et l'application enchaîne tout de suite sur « À toi ! » et l'exercice guidé. Une correction passée montre la bonne réponse environ une seconde, puis passe à la question suivante ; la question reviendra plus tard, comme après toute erreur. Tout cela est noté dans l'historique (« passée », « exemple guidé passé », « correction passée »).
- Pendant une **leçon**, il n'y a que deux boutons : les triangles jaunes pour passer, et la flèche ronde en bas à droite pour **rejouer** la leçon depuis le début.
- Les animations des exemples et des corrections vont **une fois et demie plus vite** qu'au premier essai (la voix garde son débit). Ce réglage est dans le fichier `app/content/seance.json` (`vitesseAnimations` : 1 = vitesse d'origine, 1.5 = plus rapide) ; le modifier demande une nouvelle publication.

**Tenir la tablette en paysage.** L'application est prévue pour l'écran couché.

**Une séance par jour.** Une fois la séance du jour finie, l'écran montre la lune (« à demain »), qui n'est qu'un décor. La bulle **« Encore ! »** (triangle doré) ouvre l'entraînement libre : la ligne des nombres, les additions ou une leçon déjà vue, aussi longtemps que l'enfant veut (la voix propose d'arrêter au bout de 10 minutes ; la maison ramène à la lune). L'entraînement libre ne rapporte ni étoiles de mer ni coquillages, pour que les récompenses restent liées au rendez-vous du soir, mais ses réponses comptent dans le suivi ; un niveau franchi pendant l'entraînement libre garde son étoile arc-en-ciel, remise à la fin de la séance suivante. Le récif et l'**album** (le livre au coquillage) se visitent librement.

**Les cartes, l'album et la boutique (depuis le lot « La boutique du récif »).** L'enfant **achète les créatures de son récif à la boutique** avec ses étoiles de mer : 40 étoiles une créature commune, 100 une rare ; 150 et 300 pour faire briller une créature qu'elle a déjà. La boutique s'ouvre depuis le récif (le bouton à auvent rayé, au-dessus de l'album ; pas pendant une séance en pause) et, en fin de séance, quand elle peut acheter quelque chose, le bouton de fin y mène directement (sinon il mène au récif). Elle touche une créature : le capitaine dit son prix ; si elle a assez d'étoiles, une coche verte et une croix rouge apparaissent : **seule la coche achète**, la croix annule. Un achat est définitif ; les étoiles ne se perdent jamais. Une créature achetée a une chance sur cinq de sortir brillante. L'album montre les quatre zones du récif : les cartes de ses créatures, le dos de celles qui restent à découvrir, et les zones pas encore ouvertes (assombries).

**Le rythme (réglage « Rythme de la boutique », onglet Données et réglages).** Par défaut, **Arrivages** : 2 créatures nouvelles arrivent à la boutique chaque semaine d'école, le lundi (les vacances n'en apportent pas ; une semaine sans séance n'en fait rien perdre). Plus de séances donnent plus d'étoiles, mais pas plus de créatures : les étoiles en plus servent à faire briller. Les calculs faits sur toute l'année prévoient, à 2 séances par semaine, toute la collection en juin, même pour une enfant qui a plus de mal. **Libre** : toutes les créatures des zones ouvertes sont en vitrine ; plus de séances, plus vite. Quand toutes les créatures ordinaires d'une zone sont dans le récif, la zone suivante s'ouvre à la fin d'une séance, avec une **étoile arc-en-ciel** (gagnée en franchissant un niveau), et offre son **premier habitant** (une créature commune tirée au hasard). Le récif de corail est prêt ; le grand large et les abysses attendent leurs illustrations et leurs anecdotes.

**Le coquillage de la série.** Toutes les 10 séances de la série, un coquillage fait briller une créature du récif tirée au hasard (20 étoiles si toutes brillent déjà). Les 5 étoiles toutes les 3 séances restent.

**Une carte en grand (depuis le 28 septembre 2026).** Dans le récif (toucher une créature) comme dans l'album (toucher une carte), la carte s'affiche en grand et la voix dit **une seule fois** son nom et son anecdote. Toucher la carte la retourne pour lire l'anecdote écrite, et la retourne encore : cela fait le petit bruit de la carte, mais la voix ne recommence pas (si elle parle encore, elle finit sa phrase). La coche verte range la carte. L'ouverture d'un coquillage en fin de séance ne change pas.

**Les étoiles de diamant et les légendaires.** Une semaine est « réussie » quand l'enfant y a fait au moins 2 séances ; toutes les 4 semaines réussies (à la suite ou non), une **étoile de diamant** (on disait « étoile dorée » avant la boutique ; c'est la même règle). Les cinq créatures légendaires (grand requin blanc, orque, baleine bleue, cachalot, narval) ne s'achètent pas : ce sont les dernières de leur zone ; quand les autres créatures de la zone sont dans le récif, chaque étoile de diamant ouvre un **coquillage de diamant** qui contient une légendaire (au plus un par séance). Les calculs faits sur toute l'année prévoient, à 2 séances par semaine : le lagon complet fin novembre, le récif de corail début février, le grand large fin avril, les 55 créatures ordinaires fin mai à mi-juin.

**La surprise.** Environ une séance sur cinq (jamais deux de suite), un visiteur traverse l'écran d'accueil (la tortue, un banc de poissons) ou un cadeau (corail, gorgone, étoile de mer, coquille) rejoint le récif, où il reste. Cela ne rapporte pas d'étoiles.

## d) L'espace parent

**Y entrer.** Sur l'écran d'accueil de l'application (celui avec la bulle « jouer » ou la lune), le bouton « Parents » (un cadenas) est posé en bas à gauche, sur le sable. **Appuyer dessus et garder le doigt 2 secondes** : un anneau clair se remplit, puis le clavier du code apparaît. Un toucher bref ne fait rien, pour que l'enfant ne tombe pas dessus par hasard.

**Le code.** La première fois, choisir un code à 4 chiffres et le taper une seconde fois pour le confirmer. Les fois suivantes, taper ce code. En cas d'oubli : **Code oublié ?**, répondre à l'opération proposée (par exemple 7 × 8 + 15), puis choisir un nouveau code ; rien n'est effacé.

**Ce qu'on y trouve.**

- **Calendrier** : chaque jour travaillé, avec la durée et la part de réponses justes (en vert à partir de 80 %, en jaune de 50 à 79 %, en orange en dessous ; hachuré si la séance a été interrompue). Toucher un jour montre ses séances.
- **Séances** : l'historique complet. Toucher une séance déplie chaque question posée, la réponse donnée, la bonne réponse, le temps mis, le nombre d'écoutes de la consigne et, pour la ligne graduée, le type d'erreur (par exemple « E1 · compte les traits au lieu des sauts »). Les « je ne sais pas » sont comptés à part des erreurs ; on voit aussi les exemples, les corrections et les leçons passés, les pauses et, marqué « entraînement libre », ce qui a été fait après la séance (qui n'apparaît pas dans le calendrier).
- **Progression** : le niveau atteint sur la ligne graduée (sur 13) et les dates, les faits d'addition rangés par boîte (de la boîte 1, revue à chaque séance, à la boîte 5, revue tous les 15 jours) et ceux qui résistent, deux courbes semaine par semaine (réussite et temps de réponse), le journal des erreurs avec des exemples réels, le trésor de l'enfant (étoiles) et le bloc **Cartes** : cartes gagnées et brillantes, cartes nouvelles encore gagnables cette semaine, zones et ce qu'attend la prochaine, étoiles dorées et arc-en-ciel en réserve, semaines réussies (pour vous seulement : l'enfant ne voit aucun nombre).
- **Données et réglages** : les sauvegardes, la durée maximale d'une séance (10, 12 ou 15 minutes), les niveaux de difficulté proposés à l'enfant (par exemple interdire « plus facile », ou ne pas aller au-delà de « plus dur »), le défi record (activé ou non), **Échauffement : oui / non** (lot 3), la **notion du jour de la prochaine séance** (la ligne des nombres, les additions ou le calcul rapide, pour une seule séance lancée avec « jouer » ; ensuite la rotation reprend), le **son**, le **point de départ**, le changement de code, et « Tout effacer ».
- **Progression du module 2 (depuis le lot 2, étape 7)**, dans l'onglet **Progression** : la famille d'additions en cours et, pour chaque famille, sa date d'ouverture, combien de ses additions sont bien sues, si elle est acquise (ou « en révision » si elle a résisté 6 séances) et si les formes à trou sont ouvertes ; la **grille des additions** (un tableau : le nombre de la ligne plus celui de la colonne), où chaque case prend la couleur de sa boîte (du rose de la boîte 1 au vert de la boîte 5 ; blanche si l'addition n'a pas encore été vue) avec un anneau vert quand l'addition est donnée vite ; les cases « + 0 », en gris, montrent seulement le temps de frappe. Toucher une case montre chaque passage de cette addition (date, juste ou faux, temps, forme, changement de boîte). Une courbe montre, semaine par semaine, combien d'additions sont bien sues. Le bloc **Défi record** donne son record et chaque défi joué ; dans **Séances**, les réponses du défi sont à part, et les exports CSV ont des colonnes pour la notion du jour et le défi.
- **Le point de départ** : si l'enfant sait déjà faire, choisir le niveau de la ligne des nombres (1 à 13) où elle reprendra, ou marquer une famille d'additions comme connue (de « + 1 et + 2 » jusqu'au « mélange ») : ses additions seront revues moins souvent, et la famille (avec celles d'avant) est ouverte. C'est noté dans l'historique des niveaux comme votre choix, et cela ne rapporte rien à l'enfant.
- Dans **Séances**, chaque séance indique la difficulté choisie (et si l'application l'a redescendue) ; l'export CSV des séances a trois colonnes de plus (cran choisi, cran à la fin, descentes de cran) et celui des réponses une colonne « cran ».

**Sauvegarder chaque semaine.** Les données ne sont que sur la tablette. Elles seraient perdues si l'on effaçait les données de Chrome ou si l'on désinstallait l'application. Dans **Données et réglages**, **Sauvegarde complète (JSON)** enregistre un fichier dans les Téléchargements de la tablette ; **Envoyer la sauvegarde…** permet de l'envoyer directement vers Drive ou par e-mail. Un rappel s'affiche si la dernière sauvegarde date de plus d'une semaine. Pour tout récupérer (nouvelle tablette, effacement) : **Restaurer une sauvegarde** et choisir ce fichier. Les boutons **CSV** donnent des tableaux à ouvrir dans Excel, LibreOffice ou Google Sheets ; ils servent à lire, pas à restaurer.

**Tester l'espace parent** (sans gêner l'enfant) :

1. Faire une séance complète (environ 10 minutes) jusqu'à la lune.
2. Entrer dans l'espace parent, choisir un code.
3. Vérifier que le jour apparaît dans le **Calendrier**, puis déplier la séance dans **Séances** : on doit y retrouver les additions de l'échauffement et les questions de la ligne graduée.
4. Faire une **Sauvegarde complète** et vérifier que le fichier est dans les Téléchargements.
5. Pour recommencer à zéro avant que l'enfant ne commence vraiment : **Données et réglages** > **Tout effacer** (cela efface aussi le code).

## d bis) Lot 3 : choisir l'exercice, l'échauffement, la difficulté, le calcul rapide, la maison pendant la séance, le récif par zones, les sauvegardes de test

**Choisir l'exercice et le niveau.** L'accueil a maintenant quatre bulles : **jouer** (la séance proposée par l'application, comme avant), **choisir** (quatre petits carrés de couleur), le récif et l'album. Avec **choisir**, l'enfant (ou vous, pour lui indiquer l'exercice du soir) choisit d'abord l'exercice : la ligne des nombres (la tortue), les additions (le « + »), le calcul rapide (le mur de corail), les leçons (le livre). Puis le niveau : les 13 niveaux de la ligne, les 7 familles d'additions, les 9 niveaux du calcul rapide ou toutes les leçons, **même ceux jamais atteints**. Chaque image a un petit dessin qui montre le niveau ; le niveau conseillé par l'application est entouré d'une lueur jaune, ceux déjà réussis ont une petite étoile. **Un seul toucher suffit** (votre décision du 28 septembre) : l'image s'entoure d'or, la voix dit son nom, et l'écran suivant arrive ; de l'accueil au choix de la difficulté, il faut donc 3 touchers (choisir, l'exercice, le niveau). La petite bulle en haut revient au choix de l'exercice ; la maison revient à l'accueil. Ensuite vient le choix de la difficulté (les vagues), puis la séance. (Si vous préférez un jour que l'enfant touche deux fois, pour entendre le nom avant de choisir : réglage `choix.validation`, « double », dans `app/content/seance.json`.)

- L'exercice choisi **est la séance du jour** : accueil, échauffement, l'exercice choisi (autant de questions que d'habitude), défi record s'il a lieu, récompense ; étoiles, coquillages, série et étoile dorée comme d'habitude. Après la séance, « Encore ! » ouvre le même écran, sans étoiles.
- Un niveau choisi au-dessus du conseillé : s'il est réussi (8 bonnes réponses sur 10), il est validé et le conseillé passe au niveau suivant ; s'il est raté, **rien ne baisse**. Une famille d'additions pas encore ouverte s'ouvre ; ses additions nouvelles ne sont pas limitées ce jour-là.
- Une **leçon choisie seule** n'est pas une séance : elle se joue, puis on revient à l'accueil (3 étoiles si elle est regardée jusqu'au bout, une fois par leçon et par jour). Elle apparaît dans **Séances** comme « leçon choisie ».
- Dans **Séances**, une séance choisie porte « exercice choisi » (par exemple « ligne graduée, niveau 8 ») ; l'export CSV des séances a une colonne « exercice choisi par l'enfant ».
- Si vous avez imposé la notion du jour (**Données et réglages**) et que l'enfant choisit elle-même son exercice, votre choix attend la séance suivante lancée avec **jouer**.

**L'échauffement.** Depuis le lot 3 ter, un bouton à lui (une vague franchie par une flèche jaune, à droite, au-dessus de « je ne sais pas ») permet de le passer à tout moment, avec une confirmation (voir **d quater**). Dans **Données et réglages**, **Échauffement : oui / non** le retire de toutes les séances (et de la frise). **Ce que cela change** : l'échauffement est l'endroit où reviennent chaque soir les additions « à revoir » (la révision espacée, qui fait revenir une addition juste avant qu'elle soit oubliée). S'il est souvent passé ou retiré, ces additions ne reviennent plus que dans les exercices d'additions (une séance sur trois environ avec « jouer ») : elles restent plus longtemps dans les petites boîtes, et le défi record, qui n'utilise que des additions bien sues, arrive plus tard. Si l'enfant le passe presque chaque soir, regardez dans **Progression** si les additions montent encore de boîte ; sinon, remettez-le. Dans **Séances**, une séance indique « échauffement passé par l'enfant après n questions », « retiré » ou « pas refait » (voir la maison, ci-dessous).

**Les leçons collent à l'exercice.** Une leçon d'additions n'est jouée que pour la famille travaillée : les doubles (L4) pour les doubles, les amis de 10 (L5) pour les amis de 10, la maison (L6) pour les maisons ; les maisons de 8 et 9 rejouent la maison, et les presque-doubles les doubles, seulement si elles n'ont jamais été vues ; le mélange n'en joue aucune. Au moins 80 % des questions portent sur la famille du jour. Pour les presque-doubles, chaque question rappelle le double (« 3 plus 4, c'est 3 plus 3, et encore 1 »).

**La difficulté à l'intérieur du niveau.** Quand l'enfant a choisi son niveau, les vagues du début de séance ne changent plus de niveau : elles rendent **le même niveau** plus facile ou plus exigeant, avec les mêmes étoiles qu'avant (une demi-étoile à « plus facile », deux à « très dur »). Par exemple, pour la ligne de 0 à 100 (niveau 5) : plus facile, les dizaines paires sont écrites ; plus dur, seulement 0 et 100 ; très dur, 0 et 100 et il faut placer le poisson. Pour les additions : plus facile, l'aide est montrée d'emblée ; plus dur, une question sur deux avec un nombre caché (« 3 plus combien, ça fait 7 ? ») ; très dur, toutes. Comme avant, « plus facile » fait réviser sans faire monter de niveau. Avec **jouer**, les vagues gardent leur effet d'avant (un niveau au-dessus ou en dessous du conseillé). Le détail, niveau par niveau, est dans `docs/archives/SPEC-LOT3.md`, section 3.

**Les sauvegardes de test (pour essayer, pas pour l'enfant).** Pour voir à quoi ressemble l'application après un mois ou trois mois d'usage, ou avec une enfant en difficulté, sans attendre : sur un ordinateur où le dépôt est installé, lancer par exemple

```
node tools/sauvegarde-test.mjs reel 2 4      (un mois, 2 séances par semaine)
node tools/sauvegarde-test.mjs reel 3 12     (trois mois, 3 séances par semaine)
node tools/sauvegarde-test.mjs diff 2 6      (une enfant en difficulté)
```

Chaque commande fabrique un fichier `sauvegarde-test-….json` : une vraie sauvegarde, calculée en simulant les séances (les réponses de l'enfant sont inventées d'après un profil : `sait`, `reel` pour le profil de l'évaluation de septembre, `diff` pour une enfant en difficulté). La dernière séance tombe la veille. Le mettre sur la tablette (par Drive ou par câble), puis **Données et réglages** > **Restaurer une sauvegarde**.

**Attention : restaurer remplace toutes les données de la tablette.** Faire d'abord une **Sauvegarde complète** des vraies données, et la restaurer après l'essai. Votre code parent est gardé. Les cartes suivent le calendrier scolaire : des séances simulées avant la rentrée (trois mois fabriqués en septembre) ne donnent presque pas de cartes nouvelles, c'est normal.

**Le calcul rapide (lot 3, partie B).** Un troisième exercice : des calculs comme 47 + 2, 34 + 10, 38 + 5 ou 42 − 5, à taper au pavé (le même écran que les additions). Il enseigne des **raccourcis** plutôt que de compter un par un, avec deux supports : le **mur de corail** (les nombres de 1 à 100 rangés par dix ; un petit poisson jaune y descend d'une rangée pour « plus dix ») et le **chemin** : des cailloux reliés par des ponts (38, pont « + 2 », 40, pont « + 3 », 43). Neuf niveaux, dans l'ordre de la SPEC ; les leçons L7 (plus dix sur le mur), L8 (l'astuce du neuf) et L9 (passer la dizaine) se jouent à l'entrée des niveaux 2, 6 et 7.

- Un nouveau niveau commence par sa leçon, puis 3 calculs guidés où l'enfant tape le nombre de chaque caillou, puis des calculs où le chemin apparaît seulement si elle touche le coquillage.
- Les vagues du début de séance : « plus facile » montre le chemin d'emblée (sans faire monter de niveau) ; « plus dur » enlève le chemin ; « très dur » aussi, et pose des calculs à trou (« 38 plus combien, ça fait 43 ? »).
- Une réponse juste mais lente (au-delà du temps de frappe mesuré plus 8 secondes) n'est jamais reprochée : l'application dit « Bravo ! Regarde le raccourci. » et rejoue le chemin.
- Avec **jouer**, la notion du jour tourne entre les trois exercices (le moins avancé d'abord, jamais deux fois de suite le même). Le niveau 1 est ouvert dès le début ; les suivants s'ouvrent quand les précédents sont acquis, le 4 quand les maisons de 5 à 7 sont bien sues, le 7 avec les amis de 10. Avec **choisir**, tous les niveaux sont accessibles.
- Dans l'espace parent : le bloc **Module 3 · Calcul rapide** (onglet Progression), les erreurs C1 à C5 dans le journal (par exemple C4 : « 38 + 5 = 33 », on a oublié de passer à la dizaine suivante), le point de départ du calcul rapide et « calcul rapide » dans la notion du jour de la prochaine séance.
- Chaque calcul a sa phrase enregistrée. Depuis votre décision du 28 septembre, les calculs couvrent tous les nombres utiles de chaque niveau (par exemple « plus 1, plus 2 » de 10 à 99, « moins 20 » jusqu'à 68 − 20 ou 99 − 90, 23 + 14 et toutes les additions de deux nombres à deux chiffres sans retenue) : 3 762 calculs, et la voix pèse 51 Mo en tout (plafond relevé à 80 Mo ; 20 Mo restent pour le lot 4). Au niveau 3, « plus 70 » se montre en sept ponts de dix (c'est le mur : on descend de sept rangées) ; au niveau 8, 23 + 34 se montre en deux ponts : + 30, puis + 4.

**La maison pendant la séance (depuis le 28 septembre 2026).** Quand l'enfant touche la maison pendant la séance (échauffement, exercice du jour, leçon, exemple, correction ou défi), la séance se met en pause et l'accueil apparaît, presque comme d'habitude :

- **continuer** (le triangle rouge, à la place de « jouer ») : la séance reprend exactement où elle en était (la même question, la voix redit la consigne ; une leçon reprend à sa phrase) ;
- **choisir** : l'écran de choix. La maison y ramène à l'accueil en pause, sans rien changer. Si l'enfant choisit **un autre exercice**, la séance en pause s'arrête comme si vous l'aviez terminée vous-même : elle est notée « interrompue », avec la raison « autre exercice choisi par l'enfant » (onglet **Séances**, et colonne « interrompue : raison » de l'export), sans coquillage ni carte ; ses réponses et ses étoiles restent. Puis l'exercice choisi devient la séance du jour, avec étoiles, coquillage et carte ; si l'échauffement a déjà été fait ou passé ce jour-là, il n'est pas refait. Si elle choisit **une leçon**, elle la regarde, puis revient à l'accueil en pause, la séance intacte ;
- **le récif et l'album** : elle peut les visiter, puis revenir à l'accueil en pause ; la séance attend, et ce temps ne compte pas ;
- **le logo de l'espace parent** : comme avant, avec « Terminer la séance… » en haut.

**Le récif par zones (depuis le 28 septembre 2026).** Le récif a maintenant une page par zone (le lagon, le récif de corail, le grand large, les abysses), dans l'ordre de l'album. On passe d'une zone à l'autre en glissant le doigt de côté ; une rangée de petites perles, en bas, montre sur quelle page on est, et toucher une perle y mène. Toucher brièvement une créature ouvre toujours sa carte. Le récif s'ouvre sur la zone de la dernière carte gagnée. **Aujourd'hui, seul le lagon a ses créatures animées** : le récif n'a donc qu'une page, sans perles ; en glissant, le décor fait juste un petit rebond. Les autres zones auront leur page quand leurs créatures seront dessinées (lot 4), sans autre changement. Les cadeaux de la surprise restent dans le lagon.

**Les incidents techniques.** Si l'application rencontre un problème (une erreur de page, une image introuvable), elle le note sans gêner l'enfant. Ces notes apparaissent, s'il y en a, en bas de **Données et réglages**, dans un encadré **Incidents techniques** (les 20 derniers, avec l'heure et l'étape de la séance). Si cela revient souvent, signalez-le en joignant une sauvegarde complète.

## d ter) Lot 3 bis : les plaques numérotées, la légende, l'appui long, les décors du récif, et ce qui change dans les exercices

**Les plaques numérotées.** À l'écran « choisir », chaque niveau porte maintenant son **numéro en grand** (la ligne graduée de 1 à 13, les additions de 1 à 7, le calcul rapide de 1 à 9), avec l'ancienne vignette en petit dessous : vous pouvez dire « fais le 7 » quel que soit l'exercice. Les neuf niveaux du calcul rapide sont posés dans l'ordre sur un **chemin de cailloux**. Le niveau conseillé est entouré d'un halo doré qui respire doucement ; un niveau validé porte une petite étoile dans le coin de sa plaque. Un toucher dit le nom du niveau et le lance, comme avant.

**La légende des niveaux (pour vous).** Sur chaque écran de niveaux, et sur le menu des leçons (depuis le lot « Les leçons »), un petit bouton en forme de **livre ouvert**, en haut à droite, sous le haut-parleur, ouvre un panneau qui dit, pour chaque niveau, ce qui est travaillé et un exemple. La croix, ou un toucher à côté du panneau, le referme. Ouvrir ou fermer la légende ne lance rien, et la voix ne la lit pas. Le même texte est dans l'espace parent (onglet **Progression**, « Les niveaux de « choisir », en bref ») et ci-dessous ; il est rangé une seule fois dans l'application (`app/content/legendes.json`).

**La ligne graduée**

| Niveau | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| 1 | Compter les sauts de 1 en 1 sur une corde de 0 à 10. | La tortue part de 2 et fait 3 sauts, 5 |
| 2 | Lire et placer un nombre de 0 à 10, avec seulement 0, 5 et 10 écrits. | Place 8 |
| 3 | Lire et placer un nombre de 0 à 20. | L'étoile est sur 14 |
| 4 | Une ligne qui ne commence pas à 0. | De 30 à 40, l'étoile est sur 34 |
| 5 | De 0 à 100, de 10 en 10, chaque saut vaut dix. | L'étoile est sur 70 |
| 6 | Un morceau de ligne, seules les dizaines sont écrites. | De 30 à 50, où est 37 ? |
| 7 | Trouver de combien on saute, 1 ou 10. | 40, 50, puis deux sauts, 70 |
| 8 | Deviner où va un nombre sur une ligne sans graduations, de 0 à 100. | Où mettrais-tu 25 ? |
| 9 | De 0 à 1000, de 100 en 100. | L'étoile est sur 700 |
| 10 | Une centaine, de 10 en 10. | De 300 à 400, l'étoile est sur 370 |
| 11 | Des grands nombres, un par un, sur un morceau de ligne. | De 340 à 360, où est 347 ? |
| 12 | Écrire en chiffres un grand nombre entendu. | Trois cent sept, 307 |
| 13 | Deviner où va un nombre sur une ligne sans graduations, de 0 à 1000. | Où mettrais-tu 500 ? |

**Les additions**

| Famille | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| 1 | Ajouter 1 ou 2, la tortue fait les sauts. | 6 + 2 |
| 2 | Les doubles, jusqu'à 5 + 5. | 4 + 4 |
| 3 | Les amis de 10, ce qui manque pour faire 10. | 7 + ? = 10 |
| 4 | Les maisons de 5, 6 et 7, deux nombres qui font le nombre du toit. | 5 + ? = 7 |
| 5 | Les maisons de 8 et 9, avec le cadre de 10. | 6 + ? = 9 |
| 6 | Les presque-doubles, un double et encore 1. | 3 + 4 = 3 + 3 + 1 |
| 7 | Le mélange de toutes les additions déjà rencontrées. | 5 + 3, 4 + 4, 7 + 3 |
| 8 | Dix et quelques, une boîte pleine et ce qui reste. | 10 + 4, 4 + 10 |
| 9 | Les doubles jusqu'à 15 + 15, dix et dix, puis les unités. | 7 + 7, 13 + 13 |
| 10 | Les presque-doubles jusqu'à 10, un double et encore 1. | 7 + 8 = 7 + 7 + 1 |
| 11 | Plus 9, un pour faire dix, puis le reste. | 9 + 4 |
| 12 | Passer la dizaine, on remplit d'abord la boîte de dix. | 8 + 5 = 8 + 2 + 3 |
| 13 | Le grand mélange de toutes les additions, jusqu'à 30. | 8 + 5, 7 + 7, 10 + 6 |

**Le calcul rapide**

| Niveau | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| 1 | Ajouter ou retirer 1 ou 2. | 47 + 2 |
| 2 | Ajouter ou retirer 10, on descend ou on monte d'une rangée sur le mur. | 34 + 10 |
| 3 | Ajouter ou retirer des dizaines rondes, 20, 30. | 23 + 30 |
| 4 | Ajouter un petit nombre sans changer de dizaine. | 34 + 5 |
| 5 | Retirer un petit nombre sans changer de dizaine. | 38 - 5 |
| 6 | Ajouter 9, on ajoute 10, puis on retire 1. | 34 + 9 |
| 7 | Ajouter en passant la dizaine, on complète d'abord jusqu'à 10. | 38 + 5 = 38 + 2 + 3 |
| 8 | Ajouter deux nombres à deux chiffres, sans retenue. | 23 + 14 = 23 + 10 + 4 |
| 9 | Retirer en passant la dizaine. | 42 - 5 = 42 - 2 - 3 |

**La multiplication**

| Niveau | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| 1 | Des rangées égales de poissons, on ajoute les rangées. | 4 + 4 + 4 |
| 2 | Le signe fois, 3 × 4, c'est 3 rangées de 4. | 3 × 4 |
| 3 | La table de 2, fois deux, c'est le double. | 2 × 7 = 14 |
| 4 | La table de 10, fois dix, ce sont des dizaines. | 10 × 4 = 40 |
| 5 | La table de 5, la moitié de fois dix. | 5 × 6 = 30 |
| 6 | On tourne les rangées, 3 × 5 et 5 × 3 font autant. | 5 × 3 = 3 × 5 |
| 7 | La table de 3. | 3 × 7 = 21 |
| 8 | La table de 4, le double du double. | 4 × 6 = 24 |
| 9 | Les tables de 2, 3, 4, 5 et 10 mélangées. | ? × 5 = 20 |

**L'étal du pêcheur**

| Niveau | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| 1 | Pièces et billets, poser dans la soucoupe la pièce ou le billet demandé, de 1 à 50 euros. | Pose un billet de 10 euros. |
| 2 | Payer juste avec des pièces de 1 et 2 euros, prix de 2 à 10 euros. | 7 = 2 + 2 + 2 + 1 |
| 3 | Payer juste avec des billets de 5 et 10 euros et des pièces, prix de 6 à 20 euros. | 17 = 10 + 5 + 2 |
| 4 | Payer juste jusqu'à 50 euros, avec des billets de 5 à 50 euros. | 34 = 20 + 10 + 2 + 2 |
| 5 | Payer juste avec un portefeuille restreint, une ou deux façons seulement. | 7 sans pièce de 1, 5 + 2 |
| 6 | Le compte juste est impossible, payer sans pièce de trop, le pêcheur rend la monnaie. | 13 avec 20, il rend 7 |
| 7 | Rendre la monnaie, dire au pavé combien le pêcheur rend. | 13 payés avec 20, 7 |
| 8 | Deux produits, payer juste le total. | 3 + 4 = 7 |
| 9 | Les centimes, prix ronds ou en 50 centimes, écrits avec une virgule. | 3,50 = 2 + 1 + 0,50 |
| 10 | Les centimes, prix en 10, 20 et 50 centimes. | 2,70 = 2 + 0,50 + 0,20 |

**Les leçons**

| Leçon | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| L1 | On compte les sauts, pas les bouées. | De 0 à 3, 3 sauts |
| L2 | Un saut peut valoir dix. | 10, 20, 30 |
| L3 | Une ligne ne commence pas toujours à 0. | 30, 31, 32 |
| L4 | Les doubles, deux fois le même nombre. | 3 + 3 |
| L5 | Les amis de 10, remplir la boîte de dix. | 7 + 3 |
| L6 | La maison des nombres, deux pièces et le toit. | 5 + 2 = 7 |
| L10 | Les centaines, cent, c'est dix dizaines. | 100, 200, 307 |
| L7 | Plus 10 sur le mur de corail, on descend d'une rangée. | 34 + 10 |
| L8 | L'astuce du 9, plus 10, puis moins 1. | 34 + 9 |
| L9 | Passer la dizaine, on complète d'abord jusqu'à 10. | 38 + 5 |
| L11 | Dix et encore, une boîte pleine et ce qui reste. | 10 + 4 = 14 |
| L12 | Faire dix d'abord, on remplit la boîte, puis on ajoute le reste. | 8 + 5 = 13 |
| L13 | Des rangées égales, 3 fois 4, c'est 4 + 4 + 4. | 3 × 4 = 12 |
| L14 | On tourne les rangées, 3 × 5 fait autant que 5 × 3. | 3 × 5 = 5 × 3 |
| L15 | Pièces et billets, une pièce de 2 euros vaut deux pièces de 1 euro, on compte la valeur. | 2 + 2 + 2 = 6 |
| L16 | Payer juste, du plus gros au plus petit. | 17, 10, 15, 16, 17 |
| L17 | Rendre la monnaie, on compte à partir du prix jusqu'à ce qu'on a donné. | de 13 à 20, 7 |
| L18 | Les centimes, 100 centimes font 1 euro, 3,50 c'est 3 euros et 50 centimes. | 0,50 + 0,50 = 1 |
| + | La table d'addition, toucher une case dit et montre le calcul. | 7 + 5 = 12 |
| × | La table de multiplication, toucher une case dit et montre le calcul. | 3 × 4 = 12 |

**L'appui long sur les pictogrammes.** Garder le doigt environ **une demi-seconde** sur une bulle de l'accueil (jouer, choisir, les leçons, le récif, l'album) ou sur un exercice de l'écran « choisir » (la ligne, les additions, le calcul rapide, les voiliers, la multiplication) fait apparaître une **étiquette** au-dessus, qui reste tant que le doigt est posé (depuis le lot 3 ter : elle s'efface en une demi-seconde, et cela vaut pour tous les boutons, voir **d quater**). Relâcher après un appui long **ne lance rien** ; seul un toucher bref lance. La voix ne lit pas l'étiquette. La durée se règle dans `app/content/legendes.json` (`appuiLong`).

**L'espace parent, rappel.** L'appui long sur le logo de la pieuvre, en bas à gauche de l'accueil, dure **2 secondes** (un anneau clair se remplit) ; il est différent de l'appui court sur les pictogrammes.

**Les décors du récif.** Quand un coquillage donne une carte déjà gagnée (un doublon), la voix le dit et offre un **décor** pour le récif, dans cet ordre : un corail branchu, une anémone, une gorgone, un coquillage géant, une étoile de mer, un oursin, un herbier, une amphore, une ancre, un coffre, un corail cerveau, une éponge, une arche de pierre, une algue rouge, un gouvernail. Les décors se posent dans le lagon, derrière les créatures. Quand les quinze sont gagnés, un doublon redevient un simple doublon. La probabilité qu'un doublon devienne brillant reste de 5 %.

**Ce qui change dans les exercices.**

- **Amis de 10 et maisons** : les questions sont posées « à trou » (« 3 + ? = 10 »), puisque la réponse de la forme directe était toujours la même. Une famille n'est acquise que si chaque fait a été réussi à trou, sur au moins deux jours différents. Dans l'espace parent, « acquise » s'accompagne de sa date et de l'état d'aujourd'hui, par exemple « acquise le 17/09 (depuis, 19 sur 30) » : une famille acquise le reste, même si des faits redescendent ensuite.
- **Calcul rapide « très dur »** : aux niveaux où l'on ajoute toujours le même pas (1, 2, 3 et 6), le nombre qui manque est celui du départ (« ? + 10 = 57 »), pour que la réponse change à chaque question.
- **Aides** : aux additions, l'aide de la tortue ne donne plus la réponse (elle saute jusqu'au total demandé, sans dire combien de sauts) ; les maisons montrent les poissons des deux nombres, qui montent sous le toit (et, pour les maisons de 8 et 9, le cadre de 10). Au calcul rapide, le coquillage montre le mur de corail et le poisson qui fait le premier pas, ou dit le premier pont du chemin. Les corrections du chemin rassurent et rejouent le pont en cause ; la bonne réponse est entourée, jamais une égalité fausse.
- **Fins** : les étoiles arc-en-ciel sont dites en une seule phrase et volent vers l'album ; la fin du défi record range le pavé, fait avancer les perles, plante le drapeau et dit le résultat (« Nouveau record ! », « Record égalé ! » ou « Presque ! »).
- **« Placer »** : le nombre à placer est écrit sur l'étiquette que porte le poisson ; on peut toucher la corde ou faire glisser le poisson.
- **« Réécouter »** reste visible pendant la pause et répond aussi à l'accueil.
- **Journal des erreurs** (espace parent) : plus de sigles ; chaque erreur est une phrase, et les erreurs d'additions sont détaillées (se trompe de 1, a répondu l'un des deux nombres, a fait une soustraction, autre).

## d quater) Lot 3 ter : passer l'échauffement, l'échauffement qui s'ajuste, l'appui long

**Passer l'échauffement.** Pendant tout l'échauffement, de la première phrase à la dernière addition, un bouton montre **une vague franchie par une flèche jaune** (à droite de l'écran, au-dessus de « je ne sais pas ») ; il ne ressemble pas au « passer » des exemples et des corrections (deux triangles jaunes), qui ne change pas. Le toucher met l'échauffement en attente : la voix s'arrête, le pavé se ferme, l'addition reste affichée, et la voix demande « Tu veux passer l'échauffement ? Touche la coche pour dire oui. » Une **coche verte** remplace le bouton : la toucher passe à l'exercice du jour. Sans toucher pendant 5 secondes, la coche s'en va, le bouton revient et l'échauffement reprend là où il était (la voix redit l'addition). Un toucher par erreur ne fait donc rien perdre. Dans **Séances**, la séance indique « échauffement passé par l'enfant après n questions ». Le réglage **Échauffement : oui / non** ne change pas.

**L'échauffement s'ajuste seul.** Avant, les additions de l'échauffement ne changeaient de famille (« + 1 et + 2 », doubles, amis de 10…) que par l'exercice d'additions du jour ou par le point de départ que vous régliez. Une enfant qui choisissait surtout la ligne ou le calcul rapide restait sur « + 1, + 2 » et les doubles. Désormais, à la fin d'un échauffement, **la famille suivante s'ouvre seule** quand l'enfant est prête : toutes les additions des familles déjà ouvertes ont été vues, au moins 8 sur 10 sont bien retenues (boîte 2 ou plus), et sur les 12 dernières additions de l'échauffement, au moins 9 sur 10 sont justes et données vite. **Une famille au plus par jour.** Dans **Progression**, la colonne « Ouverte » indique alors « ouverte par l'échauffement le 12/10 ». Aucune leçon n'est imposée : la leçon de la famille reste proposée si l'enfant choisit ensuite cette famille. Rien ne se referme : une famille ouverte un peu tôt se régule d'elle-même (les additions ratées reviennent souvent). Le point de départ reste possible, mais n'est plus nécessaire. Ordre de grandeur (simulation) : une enfant qui connaît déjà ses additions, et ne fait jamais l'exercice d'additions, voit les amis de 10 à la 6e séance ; une enfant en difficulté reste sur les premières familles tant qu'elle ne les réussit pas vraiment.

**L'appui long, partout.** Tous les boutons que l'enfant touche pour choisir ou pour commander (les tuiles de niveaux et de leçons, les crans de difficulté, le coquillage d'aide, « je ne sais pas », « réécouter », « passer », la maison, les boutons du récif et de l'album, les cartes…) se lancent maintenant **quand on lève le doigt**, et seulement si le doigt est resté posé moins d'une demi-seconde. Garder le doigt plus longtemps montre une **étiquette** qui dit à quoi sert le bouton (par exemple, sur une tuile : « 7 · Ajouter en passant la dizaine, on complète d'abord jusqu'à 10 » ; sur un cran : « Plus dur. Des questions plus difficiles, plus d'étoiles. ») et **ne lance jamais rien**, même quand on relève le doigt ; l'étiquette s'efface alors en une demi-seconde. Vous pouvez donc garder le doigt sur une tuile pour lire ce qu'elle propose sans rien lancer. **Seule exception** : les chiffres du pavé et les bulles-réponses répondent dès que le doigt se pose (un appui long compte comme une réponse), pour ne jamais gêner l'enfant quand elle répond ; « effacer » et la coche du pavé agissent aussi dès le contact, et montrent en plus leur étiquette si l'on garde le doigt. La voix ne lit pas les étiquettes. L'appui long de 2 secondes sur le logo (espace parent) ne change pas. Les textes des étiquettes et les durées sont dans `app/content/legendes.json`.

## d quinquies) Lot « Mascotte » : le capitaine remplace la pieuvre

**Ce qui change pour l'enfant.**

- **La mascotte** est maintenant le capitaine, en vidéo, à la place de la pieuvre : en haut à gauche, sous la maison, sur tous les écrans (sauf dans le récif, où la pieuvre n'était pas non plus). Elle ne reste jamais figée : entre deux phrases, elle fait de petits mouvements (respirer, regarder le travail, sourire…).
- **Elle n'a pas de nom** : au premier lancement, l'enfant ne choisit plus de nom. En touchant « jouer », la mascotte salue d'un mouvement des sourcils et souhaite la bienvenue (« Bienvenue à bord ! On s'entraîne ensemble ? »).
- **Elle parle quand la voix parle**, et ce qu'elle dit s'écrit dans une **bulle de BD**, mot à mot, les nombres en rouge. La bulle disparaît 1,5 seconde après la phrase ; « réécouter » la refait. Elle ne cache jamais ce que l'enfant doit toucher.
- **Ses réactions** : un petit signe à une bonne réponse ; une grande joie toutes les trois réussites de suite et à la fin de la séance ; une **déception bienveillante** à une erreur (elle commence par un bref sourire), puis elle encourage.
- **La relance** : si l'enfant ne touche rien pendant une question, la mascotte fait un geste au bout de 12 secondes, puis dit « Prends ton temps. Tu peux réécouter la consigne. » au bout de 25 secondes, et plus rien ensuite.
- **Une flèche corail** montre ce que la pieuvre montrait du bras : l'étoile de mer, la tortue, la tortue et l'étoile dans les leçons, le petit poisson du tableau des nombres, le nombre décomposé d'une correction de dictée. Elle ne montre rien quand il faut placer le poisson : elle donnerait la bonne place. Pendant une dictée, la bulle n'écrit pas le nombre à écrire.

**Ce qui change pour vous.** Le réglage « nom de la pieuvre » a disparu de l'espace parent (le nom choisi autrefois reste dans les sauvegardes, sans être utilisé). Le logo de l'espace parent, le bouton « je ne sais pas » et la frise gardent pour l'instant leur petite pieuvre (à décider : `docs/IDEES.md`).

**Les phrases à fabriquer.** Six phrases nouvelles (les deux bienvenues et la relance) : les fabriquer sur la branche du lot avant de fusionner (`docs/VOIX.md`, « Fabriquer les sons d'un lot avant sa fusion »). Tant qu'elles ne sont pas fabriquées, la tablette les lit avec la voix de synthèse. Les phrases du choix du nom ne servent plus : l'outil de fabrication efface leurs fichiers.

**Les vidéos** pèsent 7,5 Mo dans l'application hors ligne (les images de la pieuvre en pesaient environ 8 sur la tablette) ; la première ouverture après la mise à jour les télécharge.

## d sexies) Lot « Les voiliers » : un quatrième exercice

**Ce que fait l'enfant.** Des bouées numérotées, rangées du plus petit au plus grand, barrent la mer ; un bateau arrive avec un nombre sur sa voile (la voix le dit, la bulle de la mascotte l'écrit en chiffres et en lettres). L'enfant fait glisser le bateau du doigt jusqu'au **passage** où il se range : entre les deux bouées qui l'encadrent, avant la première ou après la dernière. C'est le jeu de la maquette que vous avez validée, tel quel ; seule la mascotte a changé de place : en haut à gauche, comme ailleurs, et le bateau attend désormais à droite du centre.

- **Où le trouver** : dans **choisir**, le voilier (entre le calcul rapide et les leçons), puis l'un des 9 niveaux (des nombres jusqu'à 100, puis jusqu'à 1 000 ; des bouées de 10 en 10, de 100 en 100, puis « pas rondes » ; le nombre loin des bouées, puis tout près ; au niveau 9, le double encadrement : d'abord entre deux centaines, puis la caméra recule et l'enfant range le nombre entre deux dizaines). Aussi après la séance du jour, avec « Encore ! ». Les voiliers **ne tournent pas** avec les trois autres exercices de « jouer » : vous pouvez les imposer pour la prochaine séance « jouer » (espace parent, **Données et réglages**, « Notion du jour de la prochaine séance »).
- **La mer suit la difficulté choisie au début de la séance** : « plus facile », la mer reste calme ; « conseillé », calme, puis le vent se lève après 3 bateaux rangés de suite du premier coup (il pousse le bateau vers les bouées en 7 secondes ; le doigt le guide à gauche ou à droite) ; « plus dur », le vent, puis des pirates qui poursuivent le bateau ; « très dur », les pirates toute la partie. Deux échecs ramènent la mer d'avant. Ici, la difficulté ne change pas le niveau : seulement la mer.
- **Une erreur** : la bouée concernée s'allume et la voix explique (« Il est plus grand que 40 : il passe après. ») ; le bateau revient (au calme) ou une rafale le repousse (au vent), et l'enfant réessaie. Réussi au deuxième essai, c'est une erreur corrigée (une étoile). Deuxième erreur : le bateau va seul au bon passage pendant que la voix dit pourquoi, et le nombre revient quelques bateaux plus loin. Avec les pirates, le bateau est rattrapé et coule (pas de deuxième essai).
- **Pas de leçon** : la première fois qu'un niveau est joué, un **exemple** : un bateau va seul au bon passage pendant que la voix explique. « Je ne sais pas », « passer » et « réécouter » sont à leur place habituelle.
- La rangée de bouées change tous les 5 bateaux. Une partie dure le temps de l'étape (6 minutes, 25 à 38 bateaux ; au niveau 9, où chaque bateau passe deux rangées, 13 à 23).

**Dans l'espace parent.** Le bloc **Module 4 · Les voiliers** (onglet Progression : niveau atteint, historique, réussite et temps par semaine) ; dans le journal, quatre erreurs : « a confondu plus grand et plus petit près d'une bouée » (le passage voisin), « s'est trompée de plusieurs passages », « a trouvé les centaines, pas les dizaines » et « s'est trompée de centaine » (au niveau 9), plus « le bateau a été rattrapé par les pirates avant d'être rangé » ; le niveau des voiliers dans le **point de départ** ; la légende des 9 niveaux.

**Les phrases à fabriquer.** 835 phrases nouvelles, environ 5 Mo (surtout les nombres de 101 à 999, que la voix dit seuls, et les explications avec une bouée de 10 en 10) : environ une heure de fabrication sur votre ordinateur, avec les autres lots en attente (`node tools\voix\publier.mjs`). Tant qu'elles manquent, GitHub ne publie pas la mise à jour.

**À vérifier sur la tablette.** La fluidité de la mer (elle est dessinée en direct par la carte graphique ; si l'image ralentit, l'application passe d'elle-même à une mer plus simple) ; le geste du doigt sur le bateau ; la place de la bulle.

## d septies) Lot « Correctifs » : vos décisions du 6 octobre sur la confrontation

Vous avez tranché le rapport qui comparait la spécification et l'application (`docs/ECARTS-SPEC.md`). Ce lot applique vos décisions. **Rien ne change à l'écran**, sauf au calcul rapide, niveau 9, au cran « très dur ». Ce qui change :

- **« Plus facile » ne fait jamais progresser.** À la ligne des nombres, au niveau 1, ce cran faisait encore monter le niveau (il ne peut pas descendre en dessous du niveau 1). Désormais non. Une enfant qui choisirait toujours « plus facile » resterait au niveau 1 de la ligne : dans ce cas, interdisez ce cran (**Données et réglages**, crans autorisés).
- **Une famille d'additions au plus par jour**, quelle que soit la façon dont elle s'ouvre (l'exercice d'additions, l'échauffement, une famille qui résiste). Avant, deux séances le même soir (par exemple une séance interrompue, puis une autre) pouvaient en ouvrir deux. Seuls le choix d'une famille (écran « choisir ») et le point de départ que vous réglez ouvrent une famille même si une autre s'est déjà ouverte ce jour-là.
- **Calcul rapide, niveau 9, « très dur »** : les questions sont maintenant à trou, comme aux niveaux 4 à 8 : « 42 moins combien ? Ça fait 37. » (l'enfant tape 5).
- **Placer un nombre sans graduations** (niveaux 8 et 13 de la ligne) : la marge d'erreur acceptée se resserre après 5 bonnes estimations au niveau joué, même quand l'enfant a choisi ce niveau elle-même (avant, seulement au niveau conseillé).
- **Maisons de 8 et 9, presque-doubles** : quand l'enfant se trompe souvent (3 erreurs sur 5), la leçon de la maison (pour les maisons de 8 et 9) ou celle des doubles (pour les presque-doubles) est rejouée, une fois par séance au plus, comme pour les autres familles.
- **Au mur de corail**, une erreur que l'application ne reconnaît pas fait dire « Hmm, regardons ensemble. » (la voix parlait du « chemin », qui n'est pas à l'écran au mur).
- **Dans l'espace parent**, la carte « Cartes » ne montre plus les cadeaux de la surprise, supprimés le 5 octobre (elle affichait « undefined / 4 »).

Ce que vous avez gardé tel quel, et qui est maintenant écrit dans la spécification : le défi record commence à la 6e séance (5 déjà terminées) ; une erreur corrigée rapporte 2 étoiles en tout ; la musique reste très basse quand l'enfant visite le récif ou l'album pendant la pause ; la mascotte est déçue à la première erreur d'une question, puis encourage si l'enfant se trompe encore sans nouvelle consigne (le rapport décrivait autre chose, voir la demande de fusion) ; les séances avec « choisir » peuvent être plus courtes (6 à 8 minutes) aux niveaux qui ont peu de questions différentes : regardez leur durée dans l'historique des séances.

**Les phrases à fabriquer.** 8 phrases nouvelles (« 21 moins combien ? », « 31 moins combien ? »… jusqu'à « 91 moins combien ? »), quelques secondes de fabrication, avec les autres lots en attente (`node tools\voix\publier.mjs`). Une phrase ne sert plus (« Regardons le chemin ensemble. »).

## d octies) Lot « Les leçons » : la bulle des leçons, « À toi ! » et la table d'addition

Vous avez validé la maquette le 7 octobre 2026 (`docs/maquettes/lecons/`).

- **Une cinquième bulle à l'accueil, « les leçons »** (un livre ouvert, entre « choisir » et le récif). Elle est là avant comme après la séance du jour, et aussi quand la séance est en pause. Les leçons ne sont plus dans **choisir**, qui garde la ligne, les additions, le calcul rapide et les voiliers.
- **Le menu des leçons** : une rangée par exercice (la tortue pour la ligne, le « + » pour les additions, le mur de corail pour le calcul rapide), et dans chaque rangée une tuile par leçon, avec **le numéro de la leçon en grand** (vous pouvez dire « regarde la leçon 5 ») et une petite image de son moment le plus important. Une leçon déjà vue porte une petite étoile. Le petit livre en haut à droite ouvre la légende (pour vous), avec une ligne pour la table d'addition.
- **Après une leçon du menu**, regardée jusqu'au bout ou passée : deux grandes bulles, **« À toi ! »** (dedans, la tuile du niveau d'exercice qui va avec la leçon) et **la maison**. La voix dit « À toi ! Touche la grande bulle pour t'entraîner. ». Rien ne se lance tout seul. « À toi ! » montre le choix de la difficulté, puis l'exercice qui va avec la leçon (par exemple la leçon 5, les amis de 10, puis les additions de la famille 3), **sans échauffement** : c'est la séance du jour si elle n'est pas encore faite (avec les étoiles), de l'entraînement libre sinon. La maison revient à l'accueil.
- **Pendant une séance en pause**, la bulle des leçons joue une leçon puis revient à la pause, sans « À toi ! » (qui arrêterait la séance).
- **La table d'addition** : la dernière rangée du menu (une tuile marquée d'un grand « + » ; la table de multiplication viendra à sa droite avec son lot). C'est une grille de 0 + 0 à 10 + 10 ; l'enfant touche une case : elle s'allume, le calcul s'écrit à droite (« 7 + 5 = 12 ») avec l'image de la famille (le cadre de 10, le poisson et son reflet, la maison, les sauts de la tortue ; au-delà de 10, deux cadres de 10), et la voix dit « 7 plus 5, 12. ». Les doubles sont légèrement teintés de bleu, les amis de 10 de corail. La table ne rapporte pas d'étoiles. La maison revient à l'accueil.
- **La leçon 10 (les centaines)** : dans le grand chalut, chaque petit filet montre maintenant **10 poissons**, en deux rangées de 5, comme le cadre de 10.

**Les phrases à fabriquer.** 126 phrases nouvelles (les 121 cases de la table, « 0 plus 0, 0. » à « 10 plus 10, 20. », les deux consignes de l'accueil, « Touche la grande bulle pour t'entraîner. », « La table d'addition. », « Touche une case : je te dis le calcul. »), environ 10 minutes de fabrication, avec les autres lots en attente (`docs/VOIX.md`, « En une commande »).

## d nonies) Lot « Sommes jusqu'à 30 » : les additions jusqu'à 20, et les doubles jusqu'à 15 + 15

Fait sans vous demander de valider la maquette (votre décision du 7 octobre) : les choix pris par l'application sont listés dans la demande de fusion et dans `docs/JOURNAL-CONCEPTION.md` ; vous pouvez revenir sur chacun.

- **Ce qui change pour l'enfant.** Les additions continuent après les sept premières familles. Six familles de plus : **8** « dix et quelques » (10 + 4, 4 + 10), **9** les doubles jusqu'à 15 + 15 (7 + 7, 13 + 13), **10** les presque-doubles jusqu'à 10 (7 + 8), **11** « plus neuf » (9 + 4), **12** passer la dizaine (8 + 5), **13** le grand mélange. Elles s'ouvrent une à une, comme les premières, quand la précédente est bien commencée (au plus une par jour). Le programme de CE1 demande les tables d'addition jusqu'à 10 + 10, dans les deux sens, et les doubles jusqu'à 15 ; les autres sommes jusqu'à 30 (17 + 8) se **calculent**, au calcul rapide (niveaux 4, 6 et 7), qui les proposait déjà.
- **La nouvelle aide : deux boîtes de dix.** Pour 8 + 5 : huit poissons dans la première boîte, deux poissons (entourés de lumière) la complètent, il en reste trois dans la seconde ; la voix dit « On complète la boîte avec 2, il en reste 3. ». Pour les grands doubles : un filet de dix poissons et les poissons seuls, et leur reflet (« 13, c'est dix et 3. Dix et dix, vingt. 3 et 3, 6. »).
- **Deux leçons nouvelles**, dans le menu des leçons, rangée des additions : **11 · Dix et encore** et **12 · Faire dix d'abord**, chacune suivie de « À toi ! ».
- **Pour vous**, dans l'espace parent : les familles 8 à 13 dans la progression ; la grille des additions colore maintenant toutes les cases jusqu'à 10 + 10 (les grands doubles sont écrits dessous) ; une erreur de plus au journal, « a oublié la dizaine » (7 + 6 = 3) ; le point de départ va jusqu'à la famille 13.
- **À vérifier sur la tablette** : que les places qui brillent dans les boîtes (formes à trou, « 9 + ? = 13 ») se voient bien ; que l'enfant comprend les poissons qui « sautent » d'une boîte à l'autre.

**Les phrases à fabriquer.** 384 phrases nouvelles, environ 2,7 Mo (surtout les additions de 11 à 20 sous leurs formes, et les explications des deux boîtes) : la liste est dans `docs/maquettes/sommes30/PHRASES.md` ; elles se fabriquent avec les autres lots en attente (`node tools\voix\publier.mjs`, `docs/VOIX.md`, « En une commande »). Tant qu'elles manquent, GitHub ne publie pas la mise à jour.

## d decies) Lot « Multiplication » : un cinquième exercice, les tables, la table de multiplication

Fait, lui aussi, sans vous demander de valider la maquette (votre décision du 7 octobre) : les choix sont listés dans la demande de fusion et dans `docs/JOURNAL-CONCEPTION.md`.

- **Où la trouver.** Dans **choisir**, la cinquième bulle (trois rangées de poissons et le signe ×), puis l'un des 9 niveaux. Dans **jouer**, la multiplication tourne avec la ligne, les additions et le calcul rapide **à partir du 4 janvier 2027** (avant, seulement par « choisir » et les leçons). Vous pouvez aussi l'imposer pour une séance (espace parent, **Données et réglages**).
- **Ce que fait l'enfant.** « 3 × 4 », ce sont **3 rangées de 4 poissons**, et la voix dit « 3 fois 4 ». Les niveaux : 1, des rangées écrites en addition (4 + 4 + 4) ; 2, le signe × ; 3, la table de 2 ; 4, la table de 10 ; 5, la table de 5 ; 6, « on tourne les rangées » (3 × 5 = 5 × 3) ; 7, la table de 3 ; 8, la table de 4 ; 9, tout mélangé. L'écran est celui des additions (l'ardoise, les chiffres, le coquillage). L'aide montre les rangées en grand, **comptées une à une** (« 4… 8… 12 »), avec l'astuce de la table (« Fois deux, c'est le double. ») ; une erreur où l'enfant a additionné (3 × 4 = 7) est dite (« Attention : fois, ce n'est pas plus. »). Un niveau est validé avec 8 bonnes réponses sur 10, sur deux jours au moins.
- **Deux leçons nouvelles**, dans une quatrième rangée du menu des leçons : **13 · Des rangées égales** et **14 · On tourne les rangées**, chacune suivie de « À toi ! ».
- **La table de multiplication**, au bout de cette rangée, à côté de la table d'addition (un grand « × ») : de 1 × 1 à 10 × 10 ; toucher une case dit le calcul (« 7 fois 5, 35. ») et montre les rangées.
- **Pour vous**, dans l'espace parent : un bloc « Module 5 · La multiplication » (niveau conseillé, niveaux validés, semaine par semaine), deux erreurs au journal (« a additionné au lieu de multiplier », « une rangée ou une colonne de trop ou de moins »), le niveau de la multiplication dans le point de départ, la légende de ses 9 niveaux.
- **À vérifier sur la tablette** : que les rangées de 10 poissons se lisent bien ; que les totaux écrits au bout des rangées sont assez gros.

**Les phrases à fabriquer.** 561 phrases nouvelles, environ 4 Mo (chaque multiplication posée sous ses formes, les rangées dites, les 100 cases de la table) : la liste est dans `docs/maquettes/multiplication/PHRASES.md`. Avec celles des lots précédents encore en attente, la voix pèsera environ 74 Mo, sous la limite de 80 Mo que vous aviez fixée (il restera environ 6 Mo pour les lots suivants).

## d undecies) Lot « Correctifs de la tablette » : vos remarques du premier essai, le 8 octobre

- **Au lancement**, un écran avec le logo « Maths CE1 » et une barre qui se remplit pendant que l'application se charge (dessous, en petit : 2026, js2c et la version, utile si vous me signalez un défaut). Quand la barre est pleine, le logo se balance doucement : **touchez l'écran n'importe où**. Ce toucher autorise aussi la voix. Le capitaine dit alors bonjour (« Coucou ! Je suis content de te voir. »…), une seule fois par lancement.
- **Choisir en deux touchers**, dans « choisir », le menu des leçons et « Encore ! » : le premier toucher entoure l'image d'une **bordure orange** (différente du halo doré du niveau conseillé) ; le capitaine dit son nom et ce qu'on y fait, et la phrase s'écrit dans une bulle qui part de l'image. **Le second toucher sur la même image la lance.** Toucher une autre image la choisit à la place ; toucher ailleurs annule. Le petit livre de la légende est toujours là pour vous.
- **Pour réécouter, on touche le capitaine** (toute sa tête) : il redit la consigne. Le bouton « réécouter » en haut à droite a disparu ; il ne reste que dans le récif, où le capitaine n'est pas. Au bout de 25 secondes sans toucher, il dit « Prends ton temps. Touche-moi pour réécouter la consigne. ».
- **Sur un ordinateur**, dans les exercices où l'on tape un nombre, le clavier marche comme le pavé : les chiffres (pavé numérique compris), « Retour arrière » efface, « Entrée » valide. Sur la tablette, rien ne change.
- **Corrigés** : l'ardoise vide qui apparaissait derrière la bulle (elle n'apparaît plus qu'avec son calcul) ; les petites phrases dites par l'ancienne voix (« Plus 10 ? » des calculs guidés, et le bilan quand l'enfant gagne plus de 60 étoiles) ; l'avertissement « sw-files.json n'était pas à jour » quand vous publiez les voix depuis Windows (rien à faire de votre côté).
- **Pas dans ce lot** : la fluidité des voiliers (votre décision) ; vos mesures et les pistes sont gardées dans `docs/IDEES.md`.
- **Les phrases à fabriquer** : la liste est dans la demande de fusion ; `node tools\voix\publier.mjs`, comme d'habitude.

## d duodecies) Lot « L'étal du pêcheur » : un sixième exercice, la monnaie

Fait d'un seul tenant, à partir de la maquette que vous avez validée (`art/etal/`) : ce que la session a décidé seule est listé en tête de la demande de fusion et dans `docs/JOURNAL-CONCEPTION.md` (« choix de la session, à revoir par le parent »).

- **Où le trouver.** Dans **choisir**, la sixième bulle (un billet et deux pièces), puis l'un des 10 niveaux ; aussi avec « Encore ! ». L'étal **ne tourne pas** avec les exercices de « jouer », comme les voiliers : vous pouvez l'imposer pour la prochaine séance « jouer » (espace parent, **Données et réglages**).
- **Ce que fait l'enfant.** C'est la scène de la maquette : le ciel, la mer, la cabane du pêcheur, sa pêche sur la glace. Le capitaine est dans la fenêtre de la cabane. Un produit s'allume et la voix dit son prix (« Achète les sardines. Elles coûtent… 3 euros. ») ; l'enfant ouvre son portefeuille d'un toucher, sort l'argent d'un toucher, pose pièces et billets dans la soucoupe (toucher ou glisser ; un toucher dans la soucoupe reprend une pièce), puis touche la **coche**. Le pêcheur compte à voix haute (« 2… 3 euros. »). Les niveaux : 1, reconnaître les pièces et les billets ; 2 à 4, payer juste (jusqu'à 10, 20, puis 50 €) ; 5, payer juste avec peu de pièces ; 6, le compte juste est impossible : donner assez, sans pièce de trop, et le pêcheur rend la monnaie ; 7, dire au pavé combien le pêcheur rend ; 8, deux produits ; 9 et 10, les centimes (3,50 €).
- **Le temps qu'il fait** : une fois sur deux, il fait mauvais dès le début (la lampe s'allume, il pleut) ; sinon, l'orage arrive parfois en cours de partie, toujours entre deux achats, et le capitaine dit une des quatre répliques que vous avez écrites. Cela ne change rien à l'exercice.
- **La difficulté** : « plus facile », le total est écrit et dit à chaque pièce posée, la valeur écrite sous chaque pièce ; « conseillé », le coquillage aide ; « plus dur » et « très dur », des prix plus hauts et, au « très dur », plus de petites pièces dans le portefeuille. Elle ne change pas le niveau.
- **Une erreur** : s'il manque de l'argent, le pêcheur dit combien et l'enfant complète une fois ; si elle donne trop, il lui rend tout son argent et elle recommence ; sinon, il montre une bonne façon de payer, et l'achat revient quelques questions plus loin. Au niveau 7, la correction est le saut de la tortue sur une ligne, du prix au billet (« + 7 »).
- **Quatre leçons nouvelles**, jouées à l'étal même, dans une cinquième rangée du menu des leçons : **15 · Pièces et billets**, **16 · Payer juste**, **17 · Rendre la monnaie**, **18 · Les centimes**. Pour faire tenir cette rangée, les tuiles du menu sont un peu plus petites, et le petit livre de la légende est en haut à droite.
- **Pour vous**, dans l'espace parent : un bloc « Module 6 · L'étal du pêcheur » (niveau, historique, semaine par semaine) ; dans le journal des erreurs, sept erreurs en une phrase, précédées de « étal » (« n'a pas donné assez », « a donné une pièce de trop »…) ; pour chaque achat, ce qui a été posé, la monnaie rendue et le contenu du portefeuille ; le niveau et le temps de la partie dans l'historique des séances ; le niveau de l'étal dans le **point de départ** ; la légende des 10 niveaux.
- **À vérifier sur la tablette** : la fluidité (vous l'aviez mesurée à 60 images par seconde avec la maquette ; l'application ajoute peu) ; le geste du doigt sur les pièces ; que le capitaine dans la fenêtre et sa bulle ne gênent pas ; la durée d'une partie (environ 14 achats en 10 minutes, d'après la simulation).

**Les phrases à fabriquer.** 394 phrases nouvelles, environ 2,7 Mo (surtout les montants : « 3 euros. », « 1 euro 50. », « 30 centimes. »…) : la liste est dans `docs/maquettes/etal/PHRASES.md` ; `node tools\voix\publier.mjs`, comme d'habitude. Avec elles, la voix pèsera environ **79,3 Mo, tout près de la limite de 80 Mo** que vous aviez fixée : le prochain lot qui ajoute des phrases demandera de relever cette limite ou d'alléger les fichiers (à vous de décider).

## d terdecies) Lot « Correctifs : passage de l'échauffement aux voiliers » : vos remarques du 10 octobre

Fait d'un seul tenant : ce que la session a décidé seule est listé en tête de la demande de fusion et dans `docs/JOURNAL-CONCEPTION.md` (« choix de la session, à revoir par le parent »).

- **L'échauffement par-dessus les voiliers** (votre capture 01) : trouvé et corrigé. Il arrivait quand l'enfant faisait une pause pendant l'échauffement, puis choisissait un autre exercice : le bouton « passer l'échauffement » de la séance quittée restait à l'écran ; touché plus tard, il faisait repartir l'ancienne séance par-dessus la nouvelle. Désormais, une étape quittée retire tout ce qu'elle avait posé, et une séance interrompue ne repart jamais. Un contrôle automatique essaie chaque exercice, chaque chemin et chaque moment de l'échauffement.
- **La bulle** ne laisse plus déborder un long nombre (« trois-cent-soixante-neuf ») et n'apparaît jamais vide.
- **Les voiliers** ne montrent plus l'ancienne mer au démarrage du jeu (l'application ne la contient plus) ; le jeu démarre un peu plus vite.
- **Les écrans de choix** : plus d'étiquette rectangulaire à l'appui long (seule la bulle du capitaine) ; l'entourage rouge suit exactement la forme de la tuile.
- **L'écran de démarrage** est votre logo, avec ses mouvements, et « Toucher pour continuer » quand tout est chargé.
- **L'accueil** : cinq gros galets, chacun sa forme. Comme dans « choisir » : un toucher, le capitaine dit ce que c'est ; un second toucher, on y va ; deux touchers rapides, on y va tout de suite. Partout où l'on choisit en deux touchers, deux touchers rapides lancent directement. (L'accueil pendant une pause garde ses bulles rondes, en un toucher.)
- **La voix** : la voix de secours du navigateur (celle que vous avez entendue dire « les multiplications ») **n'existe plus**. Elle parlait quand une mise à jour de l'application arrivait en pleine partie : la nouvelle version prenait la main et retirait des sons que la page en cours attendait. Désormais, une mise à jour s'installe en arrière-plan et attend : elle ne prend la main qu'au lancement suivant, ou pendant l'écran de démarrage (l'écran se recharge alors tout seul, avant que l'enfant touche). Si une phrase n'a pas d'enregistrement, le capitaine ne la dit pas : sa bulle l'écrit, et vous la voyez dans l'espace parent, **Données et réglages**, sous **Phrases sans voix** (la phrase, la date, la version, et pourquoi). L'ancienne voix (Piper) est retirée de l'outil de fabrication.
- **Le bouton de l'espace parent** est votre image (« Parents » et un cadenas), un peu plus grand ; l'appui long ne change pas (2 secondes, l'anneau suit le bord du bouton).
- **L'icône** de l'application est le logo, nommée « Maths CE1 » (voir **c)** si la tablette garde la pieuvre).

**Les phrases à fabriquer.** 12 phrases nouvelles (les descriptions des galets et la nouvelle consigne de l'accueil), moins de 0,1 Mo ; deux anciennes phrases de l'accueil ne servent plus (la fabrication les effacera) : la liste est dans la demande de fusion ; `node tools\voix\publier.mjs`, comme d'habitude. Avec celles de l'étal, la voix pèsera environ 79,4 Mo, toujours sous la limite de 80 Mo.

**À essayer sur la tablette** : un double toucher rapide sur un galet et sur une tuile ; la pause pendant l'échauffement, puis « choisir » les voiliers, puis « passer l'échauffement » ; l'écran de démarrage (fluidité du logo) ; après la prochaine mise à jour, qu'aucune phrase ne soit dite par une autre voix.

## d quaterdecies) Lot « La boutique du récif » : l'enfant achète ses créatures

Fait d'un seul tenant, d'après votre maquette arrêtée (`art/boutique/`) : ce que la session a décidé seule est listé en tête de la demande de fusion et dans `docs/JOURNAL-CONCEPTION.md` (« choix de la session, à revoir par le parent »).

- **Plus de coquillage tous les 25 étoiles** : les étoiles s'accumulent au compteur et se dépensent à la boutique (voir « Les cartes, l'album et la boutique » plus haut). Les étoiles déjà accumulées sur la tablette deviennent dépensables ; rien n'est perdu ni converti (créatures, brillantes, série, étoiles dorées devenues étoiles de diamant).
- **La fin de séance** : bilan, série et son coquillage, étoile de diamant, étoiles arc-en-ciel, zone et son premier habitant, coquillage de diamant, puis les créatures arrivées cette semaine, et « Tu peux choisir une créature à la boutique ! » ; le bouton en bas à droite mène à la boutique (ou au récif). « À demain » vient au retour. Si personne ne le touche pendant 30 secondes, « à demain » vient seul.
- **Dans le récif**, la créature achetée arrive à la nage, avec son halo.
- **L'espace parent** : le bloc « Cartes et boutique » (onglet Progression) liste les achats (date, créature, prix, « faire briller ») ; le rythme se règle dans « Données et réglages » ; l'export CSV des achats ; la sauvegarde complète les contient.
- **Les phrases à fabriquer** : 321 phrases nouvelles (dont « Il te manque une étoile. » à « Il te manque 299 étoiles. »), environ 2,2 Mo ; 7 anciennes ne servent plus. La voix pourra peser jusqu'à 85 Mo (au lieu de 80).

**À essayer sur la tablette** : acheter une créature (la coche, la croix, toucher deux fois une tuile), faire briller, le retour au récif (la créature qui arrive à la nage), une fin de séance qui mène à la boutique, la fluidité de la vitrine.

## d quindecies) Lot « Recette de l'enfant et nettoyage des couches » : l'oignon épluché

Fait d'un seul tenant : ce que la session a décidé seule est listé en tête de la demande de fusion et dans `docs/JOURNAL-CONCEPTION.md` (« choix de la session, à revoir par le parent »).

- **Une seule règle de sortie** : chaque étape (l'échauffement, la notion du jour, le défi, la récompense, l'entraînement libre, une leçon, l'écran « choisir ») range tout ce qu'elle a posé quand on la quitte, quelle que soit la façon d'en sortir (la fin, la maison, l'espace parent, « passer », un autre exercice). Les écrans des exercices sont détruits au lieu d'être cachés. L'inventaire de ce que chaque écran pose et lance, et de ce qui ne servait plus (retiré), est dans `docs/COUCHES.md`.
- **Un enfant imprévisible automatique** joue des centaines de parties au hasard (touchers rapides, à côté, deux doigts, la maison, la veille, le rechargement…) et vérifie qu'il ne reste jamais rien de travers à l'écran ; une version courte tourne à chaque envoi sur GitHub.
- **Un agent a joué l'enfant**, deux fois une demi-heure, à vitesse réelle : ses rapports et ce qui en a été fait sont dans `tests/recette-fonctionnelle/out-enfant/`. Le défaut principal trouvé : sur une tablette occupée, un toucher bref pouvait être pris pour un appui long, et ne rien faire (l'étal, le récif, l'album, la boutique semblaient ne plus répondre). C'est corrigé.
- **Deux doigts posés ensemble sur la ligne graduée** ne font plus de réponse.
- **La correction de la multiplication** ne reste plus sur l'accueil après la maison ; **« Encore ! »** montre les exercices dès sa phrase ; dans **la boutique**, toucher le capitaine redit le prix de la créature choisie ; plus de « Prends ton temps » pendant **le défi** ; dans l'espace parent, **l'historique** dit quel exercice a été joué en entraînement libre.
- **Des questions pour vous** (`docs/IDEES.md`, section 3, « Après le second passage de l'agent ») : surtout, une séance n'est pas reprise si la page se recharge (si Android ferme Chrome pendant que la tablette est posée, la séance est perdue ; les étoiles restent).
- **La barre noire** au-dessus de la ligne (votre capture) : elle n'a pas pu être reproduite ici ; la correction est de précaution (aucun calque vide n'est plus affiché). À vérifier sur la tablette.
- **Les voiliers restent nets** : seule la mer s'allège quand la tablette peine ; chaque changement est noté dans l'espace parent (« Qualité des voiliers »).
- **La lampe de l'étal** : la toucher fait venir l'orage, ou le chasse.
- **Dans l'espace parent**, le détail d'une séance dit « Défi record (une minute de faits d'addition) ».

**Les phrases à fabriquer.** 2 phrases nouvelles (les répliques des leçons L15 et L17 qui commençaient par « … »), et 50 phrases à refaire, dont la durée est anormale (un mot coupé en morceaux, ou bien plus lente que ses semblables) : la liste est dans `tools/voix/a-refaire-durees.txt`. Pour les refaire, une fois, en même temps que les phrases nouvelles : les trois commandes de `docs/VOIX.md`, section « Ce que le contrôle entend, et ce qu'il n'entend pas » ; la fabrication refuse désormais d'elle-même un tirage de durée anormale. 10 anciennes phrases ne servent plus (la fabrication les effacera).

**À essayer sur la tablette (10 minutes)**, pour ce que les essais automatiques ne voient pas : le toucher réel, la fluidité, le son.

1. **Toucher vite** : dans l'étal, le récif, l'album et la boutique, des touchers brefs et rapides, du bout du doigt : chacun doit faire quelque chose (rien ne doit « ignorer » un toucher).
2. **La ligne graduée** : la barre noire au-dessus de la ligne ne doit plus apparaître, ni pendant la question, ni pendant la correction ; poser la paume sur la ligne ne doit pas répondre.
3. **Le pavé** : taper deux fois vite le même chiffre (« 77 ») : les deux doivent compter si l'enfant les tape vraiment ; un doigt qui rebondit ne doit en compter qu'un.
4. **Les voiliers** : les bateaux restent nets toute la partie ; si la mer devient plus simple, regardez « Qualité des voiliers » dans l'espace parent.
5. **L'étal** : toucher la lampe (l'orage vient, puis repart au second toucher) ; la voix des leçons L15 à L18.
6. **Sortir de partout** : la maison en pleine question, puis « continuer » ; en « Encore ! », la maison pendant la correction d'une multiplication (les rangées de poissons ne doivent pas rester sur l'accueil) ; l'écran éteint puis rallumé ; quitter une leçon en route : rien ne doit rester à l'écran, aucune voix ne doit continuer.
7. **Le son** : après la prochaine fabrication des voix, écoutez quelques phrases de `tools/voix/a-refaire-durees.txt` (par exemple « 16, 17 ! » et « Ça fait 20. ») : plus de mot coupé ni de lenteur.

## d sexdecies) Lot « Décisions sur les constats de l'agent » : vos réponses du 13 octobre

Fait d'un seul tenant : ce que la session a décidé seule est listé dans la demande de fusion (« Choix faits sans le parent ») et dans `docs/JOURNAL-CONCEPTION.md`.

- **Une séance reprise après un rechargement de la page.** Si Android ferme Chrome pendant que la tablette est posée (ou si une nouvelle version de l'application prend la main au lancement suivant), la séance du jour n'est plus perdue : à l'accueil, le capitaine dit « Te revoilà ! Touche cette bulle pour continuer. », une flèche montre « continuer », comme après la maison. La séance reprend **au début de l'étape** où elle en était (l'échauffement, l'exercice du jour ou le défi), pas à la question près ; les réponses, les étoiles, la difficulté choisie sont gardées ; une leçon déjà vue n'est pas rejouée ; le bilan de fin compte toute la séance. **Le jour même seulement** : le lendemain, la séance de la veille reste « interrompue ». Dans l'espace parent, le détail de la séance dit « Page rechargée en pleine séance : à 18 h 42, après 12 questions ; l'étape « notion du jour » a repris à son début », et une ligne bleutée marque l'endroit dans le tableau des réponses. Une limite : une réponse fausse dont la correction était à l'écran au moment du rechargement n'est pas enregistrée.
- **La fin de séance** : la maison s'ajoute au bouton de la boutique (ou du récif) ; touchée, « à demain » vient aussitôt. Sans toucher, « à demain » vient au bout de 15 secondes (au lieu de 30).
- **« Continuer » en deux touchers**, comme les galets de l'accueil : l'accueil en pause a maintenant les mêmes galets ; le premier toucher dit « Continuer. On reprend la séance. », le second reprend. Le second toucher de l'enfant ne tombe plus dans le pavé.
- **La bulle du capitaine ne cache plus ce dont parle la voix** : l'égalité pendant l'aide de la tortue, le chemin du calcul rapide, la bouée nommée aux voiliers, l'article de l'étal. Quand il n'y a pas la place, elle n'écrit que la première phrase (« La tortue est sur 7. »), ou rien du tout.
- **Les additions se répètent moins** : dans un même bloc, un même calcul revient au plus deux fois, avec au moins quatre autres questions entre les deux. Dans l'exercice du jour, « 3 + 7 » ne suit plus « 7 + 3 » de près, et quand la famille du jour n'a plus de question possible, l'exercice s'arrête au lieu de se finir sur des « + 1 » faciles (vos réponses du 14 octobre). La simulation montre un effet sur le calendrier, chiffres dans la demande de fusion : pour une enfant en difficulté, aucune famille n'est acquise plus tard, mais les familles suivantes s'ouvrent plus tard (les amis de 10 environ 9 semaines plus tard à 2 séances par semaine).
- **Les voiliers** : toucher un passage fait dire « Fais glisser le bateau jusqu'au passage ! » et une flèche montre le geste, droit sous le bateau, sans désigner de passage (votre réponse du 14 octobre) ; au niveau 2, un bateau hors des bouées reste tout près d'elles.
- **La boutique** : le prix pour faire briller une créature n'est plus écrit sur sa tuile ; il apparaît quand l'enfant la touche.
- **Finitions** : le compteur d'étoiles reste lisible dans l'étal par temps d'orage (une petite plaque claire) ; la bulle de l'étal n'est plus coupée par la fenêtre de la cabane ; l'étoile arc-en-ciel de la fin de séance vole maintenant vers l'album, qui apparaît en bas à droite.

**Les phrases à fabriquer.** 4 phrases nouvelles : « Continuer. », « On reprend la séance. », « Touche cette bulle pour continuer. » et « Fais glisser le bateau jusqu'au passage ! ». Avec celles du lot précédent (2 nouvelles et 50 à refaire), elles se fabriquent d'un coup (`docs/VOIX.md`).

**À essayer sur la tablette (10 minutes)** :

1. **La reprise** : en pleine séance (pendant l'exercice du jour), fermer Chrome depuis la liste des applications récentes, puis rouvrir l'application : « continuer » doit être là ; la séance doit reprendre au début de l'exercice du jour, avec les mêmes étoiles. Essayer aussi pendant une pause.
2. **« Continuer » en deux touchers** : la maison, puis toucher « continuer » une fois (le capitaine dit ce que c'est), puis une seconde fois.
3. **La fin de séance** : la maison à côté de la boutique ; « à demain » au bout de 15 secondes sans toucher.
4. **Les voiliers** : toucher l'eau entre deux bouées au lieu de faire glisser le bateau.
5. **L'étal par temps d'orage** (la lampe) : le compteur d'étoiles lisible.

## d septdecies) Lot « Correctifs de l'installation et de la veille » : votre essai du 16 octobre

Fait d'un seul tenant : ce que la session a trouvé et décidé seule est dans `docs/JOURNAL-CONCEPTION.md` et dans la demande de fusion.

- **L'application installée se relance.** La cause de l'écran bleu sans fin est trouvée : à chaque relance, l'application cherchait chacun de ses fichiers en parcourant toute sa réserve hors ligne (près de 12 000 fichiers), des centaines de fois de suite. Sur un ordinateur, une relance prenait 22 à 38 secondes ; elle en prend 2. Si quelque chose bloque encore, l'application ne reste plus sur un écran figé : « Chargement… », puis « Toucher pour réessayer ».
- **Après une longue inactivité, l'application répond.** La tablette n'a qu'un nombre limité de « lecteurs » de sons et de vidéos ; l'application en usait un nouveau à chaque phrase et en gardait 17 pour le capitaine. Elle n'en garde plus que quelques-uns, toujours les mêmes. Si la tablette refuse quand même de lire une phrase, la bulle l'écrit, et la phrase est redite au toucher suivant.
- **Les leçons de la monnaie (L15 à L18)** ne sont plus noires quand elles sont choisies depuis l'accueil en pause.
- **Les poissons coupés** : la session ne les a pas reproduits ; le dessin des poissons est juste. C'est sans doute la mémoire de la tablette, au même moment que le problème précédent. Le journal technique permettra de le voir.
- **Le journal technique** : dans l'espace parent, onglet « Données et réglages », en bas. Il note chaque lancement (et le temps avant le premier écran), les mises à jour, les passages en arrière-plan, le son, les lectures refusées, les erreurs, les écrans ouverts. Rien sur l'enfant. Le bouton « Exporter le journal technique » enregistre un fichier à donner à la conception ; la sauvegarde complète le contient aussi.

**Aucune phrase à fabriquer.**

**À essayer sur la tablette** (après la publication de la nouvelle version : elle s'installe au premier lancement et prend la main au suivant) :

1. **La relance** : lancer l'application installée, la fermer (liste des applications récentes), la relancer, cinq ou six fois ; avec le Wi-Fi coupé aussi. Le logo doit apparaître en une ou deux secondes. Dans le journal technique, chaque ligne « lancement · application lancée » donne « première image en … s » : le noter.
2. **L'inactivité** : ouvrir l'application, ne rien toucher pendant 15 à 30 minutes sur l'accueil, puis toucher un galet deux fois, et toucher le capitaine : il doit parler. Recommencer sur une question d'un exercice. Si quelque chose ne répond pas, exporter le journal technique tout de suite et le donner à la conception (regarder s'il y a des lignes « lecture refusée », « vidéo de la mascotte arrêtée », « contexte WebGL perdu », et le nombre de « lecteurs de sons et vidéos » dans les lignes « état »).
3. **Les leçons de la monnaie** : pendant une séance, la maison, puis « les leçons », puis L15 (ou L16, L17, L18) : le décor de l'étal doit être là.
4. **Les poissons** : si un poisson coupé réapparaît, faire une capture et exporter le journal technique.

## e) Ce qui reste approximatif ou à ajuster

**À vérifier sur la vraie tablette.** Écouter la voix (aucune phrase n'a été écoutée par une personne, la vérification a été automatique) et regarder les illustrations des cartes en grand. Toutes les mesures ont été faites sur un ordinateur, en ralentissant le processeur 4 fois pour imiter une tablette : démarrage en moins de 1,5 s, animation à 50 à 60 images par seconde la plupart du temps, avec des baisses vers 30 pendant certaines animations (l'application allège alors d'elle-même le décor). Il faut confirmer que tout reste fluide sur la tablette.

**Propositions qui attendent votre avis** (détaillées dans `docs/AVANCEMENT.md`, rubrique « Décisions prises ») :

- les deux exemples guidés montrés par la tortue avant les questions, et le déroulé exact des leçons L1 à L3 ;
- la liste des 15 cartes du lagon et leurs anecdotes, à relire (fichier `app/content/cartes.json`) ;
- les règles de la série (5 étoiles toutes les 3 séances, jamais de remise à zéro) et de l'étoile de diamant ;
- lot 1 bis (détail dans `docs/archives/BILAN-LOT1BIS.md`) : le coquillage à 25 étoiles au lieu de 40, les phrases des zones fermées de l'album, les nouvelles phrases (reprise, « Encore ! », album), et le fait qu'une leçon passée soit suivie de son exercice guidé.

**Défauts connus, sans gravité.**

- Un petit à-coup (environ un dixième de seconde) à l'apparition de certaines questions.
- Pendant une pause, un saut de la tortue déjà commencé se termine à l'écran (moins d'une seconde) ; la suite attend « continuer ». La phrase coupée est redite depuis son début.

**Pas encore fait (prévu dans les lots suivants).** Les problèmes, les bilans officiels toutes les deux semaines, les illustrations et anecdotes du grand large et des abysses (à livrer **avant début février** et **avant fin avril**, sinon la collection s'arrête au récif de corail), les quatre cartes rares liées aux nombres jusqu'à 1 000, les créatures animées des zones 2 à 4 dans le récif (lot 4).

**Stockage protégé.** Chrome accorde en général la protection des données (« stockage persistant ») quand l'application est installée sur l'écran d'accueil. L'espace parent indique si c'est le cas (**Données et réglages** > **Données protégées**). Même accordée, elle ne protège pas d'un effacement volontaire : la sauvegarde de la semaine reste la vraie sécurité.
