# Guide du parent

Ce guide explique, sans connaissances techniques, comment mettre l'application en ligne, l'installer sur la tablette et suivre la progression. Il correspond aux lots 1, 1 bis, 2 et 3 (septembre 2026), avec les décisions du 27 et du 28 septembre 2026. Les bilans sont dans `docs/BILAN-LOT2.md` et `docs/BILAN-LOT3.md`. Les nouveautés du lot 3 sont regroupées dans la partie **d bis**.

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
4. Une icône « Océan » (la pieuvre) apparaît sur l'écran d'accueil. Ouvrir l'application par cette icône désormais : elle s'ouvre en plein écran, sans barre d'adresse.

**Sans Internet.** Après la première ouverture avec le Wi-Fi, l'application a tout gardé sur la tablette : elle marche ensuite sans réseau.

**Mises à jour.** Quand une nouvelle version est publiée, la tablette la télécharge d'elle-même à la prochaine ouverture avec le Wi-Fi ; elle s'affiche à l'ouverture suivante. Les données de l'enfant sont gardées.

**La voix.** Depuis le lot 1 bis, chaque phrase est enregistrée à l'avance (voix « siwis », celle que vous avez choisie) et fait partie de l'application : il n'y a rien à régler, elle marche aussi sans Internet. Monter le volume « multimédia ». La synthèse vocale d'Android ne sert plus que de secours, pour un nom de pieuvre que vous auriez tapé vous-même ; pour ce cas, on peut choisir dans **Paramètres** > **Système** > **Langues et saisie** > **Synthèse vocale** (le chemin varie selon la marque) le moteur **Google** en **français (France)**. La voix ne démarre qu'après le premier toucher sur l'écran (règle de Chrome) : c'est pour cela que la séance commence par la grosse bulle « jouer ».

**Le son (depuis le lot 2, étape 4).** Une petite musique douce accompagne la séance et l'entraînement libre : l'une des trois que vous avez choisies (la harpe du lagon, le marimba des bulles, les profondeurs), tirée au hasard au début de chaque séance et gardée jusqu'à la fin, même après une pause. Elle démarre en douceur au premier toucher, reste toujours bien plus basse que la voix, baisse encore quand la voix parle, devient très faible pendant la pause et s'arrête à la fin de la séance. De petits bruitages marquent les bonnes réponses (des bulles claires), les erreurs (une bulle grave et douce, jamais un son d'échec), les étoiles, le coquillage, la carte qui se retourne, les cartes brillantes, les boutons et l'ouverture d'une zone. Dans l'espace parent (**Données et réglages**, ligne **Son**) : musique oui ou non, son volume (douce, moyenne, plus forte), bruitages oui ou non. Tout se tait pendant la visite de l'espace parent. Le volume général reste celui de la tablette.

**Pendant la séance.**

- **Le choix du niveau (depuis le lot 2, étape 2).** Juste après le bonjour de la pieuvre, quatre grosses bulles montrent des vagues de plus en plus grosses : plus facile, le niveau conseillé (celui que l'application a calculé, entouré d'une lueur et déjà choisi), plus dur, très dur. Sous chaque vague, ce qu'elle rapporte : une demi-étoile, une étoile, une étoile et demie ou deux étoiles de mer par bonne réponse. L'enfant touche une bulle (la voix dit ce qu'elle rapporte), puis la coche verte ; si elle ne touche rien pendant 15 secondes, la séance commence au niveau conseillé. Le choix vaut pour toute la séance. Sur la ligne des nombres, « plus dur » donne un niveau au-dessus, « très dur » deux ; aux additions, plus de faits nouveaux et des additions à trou (« 3 plus combien, ça fait 7 ? »). Réussir au-dessus fait avancer pour de bon ; se tromper au-dessus ne fait jamais reculer. Si elle se trompe beaucoup à un niveau plus dur (3 erreurs sur 5), l'application redescend d'un cran pour le reste de la séance (« On essaie un peu moins dur ? »). Vous pouvez interdire des crans dans l'espace parent.
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

**Les cartes et l'album.** Chaque coquillage (25 étoiles, environ un par séance) contient une carte illustrée. L'album montre les quatre zones du récif : les cartes gagnées, le dos de celles qui restent à découvrir, et les zones pas encore ouvertes (assombries).

**Le rythme des cartes (depuis le lot 2).** Pour que la collection dure jusqu'à l'été, l'enfant peut gagner **2 cartes nouvelles par semaine d'école** (les semaines de vacances ne comptent pas, mais ce qui n'a pas été gagné reste gagnable). Au-delà, un coquillage donne un doublon d'une carte déjà gagnée, de préférence une carte qui n'est pas encore brillante. Une carte nouvelle a **une chance sur cinq d'être brillante**, un doublon une chance sur vingt : un reflet irisé la balaie, des étincelles scintillent sur son cadre, et la voix dit « Oh ! Elle est brillante ! ». Une carte brillante le reste pour toujours (depuis le 27 septembre 2026, les doublons ne rendent plus une carte brillante à eux seuls : la brillante reste une trouvaille). Quand toutes les cartes ordinaires d'une zone sont gagnées, la zone suivante s'ouvre avec une **étoile arc-en-ciel** (gagnée en franchissant un niveau) : la voix l'annonce et ses cartes arrivent dans l'album. Le récif de corail est prêt ; le grand large et les abysses attendent leurs illustrations et leurs anecdotes. Les cartes du récif de corail vivent dans l'album (les créatures animées du récif viendront plus tard).

**Une carte en grand (depuis le 28 septembre 2026).** Dans le récif (toucher une créature) comme dans l'album (toucher une carte), la carte s'affiche en grand et la voix dit **une seule fois** son nom et son anecdote. Toucher la carte la retourne pour lire l'anecdote écrite, et la retourne encore : cela fait le petit bruit de la carte, mais la voix ne recommence pas (si elle parle encore, elle finit sa phrase). La coche verte range la carte. L'ouverture d'un coquillage en fin de séance ne change pas.

**Les étoiles dorées et les légendaires.** Une semaine est « réussie » quand l'enfant y a fait au moins 2 séances ; toutes les 4 semaines réussies (à la suite ou non), une **étoile dorée**. Les cinq cartes légendaires (grand requin blanc, orque, baleine bleue, cachalot, narval) sont les dernières de leur zone : quand les autres cartes de la zone sont gagnées, chaque étoile dorée ouvre un **coquillage doré** qui contient une légendaire (au plus un par séance). Les calculs faits sur toute l'année prévoient, à 2 séances par semaine : le lagon complet fin novembre, le récif de corail début février, le grand large fin avril, les 60 cartes mi-juin.

**La surprise.** Environ une séance sur cinq (jamais deux de suite), un visiteur traverse l'écran d'accueil (la tortue, un banc de poissons) ou un cadeau (corail, gorgone, étoile de mer, coquille) rejoint le récif, où il reste. Cela ne rapporte pas d'étoiles.

## d) L'espace parent

**Y entrer.** Sur l'écran d'accueil de l'application (celui avec la bulle « jouer » ou la lune), une petite icône de la pieuvre est posée en bas à gauche, sur le sable. **Appuyer dessus et garder le doigt 2 secondes** : un anneau clair se remplit, puis le clavier du code apparaît. Un toucher bref ne fait rien, pour que l'enfant ne tombe pas dessus par hasard.

**Le code.** La première fois, choisir un code à 4 chiffres et le taper une seconde fois pour le confirmer. Les fois suivantes, taper ce code. En cas d'oubli : **Code oublié ?**, répondre à l'opération proposée (par exemple 7 × 8 + 15), puis choisir un nouveau code ; rien n'est effacé.

**Ce qu'on y trouve.**

- **Calendrier** : chaque jour travaillé, avec la durée et la part de réponses justes (en vert à partir de 80 %, en jaune de 50 à 79 %, en orange en dessous ; hachuré si la séance a été interrompue). Toucher un jour montre ses séances.
- **Séances** : l'historique complet. Toucher une séance déplie chaque question posée, la réponse donnée, la bonne réponse, le temps mis, le nombre d'écoutes de la consigne et, pour la ligne graduée, le type d'erreur (par exemple « E1 · compte les traits au lieu des sauts »). Les « je ne sais pas » sont comptés à part des erreurs ; on voit aussi les exemples, les corrections et les leçons passés, les pauses et, marqué « entraînement libre », ce qui a été fait après la séance (qui n'apparaît pas dans le calendrier).
- **Progression** : le niveau atteint sur la ligne graduée (sur 13) et les dates, les faits d'addition rangés par boîte (de la boîte 1, revue à chaque séance, à la boîte 5, revue tous les 15 jours) et ceux qui résistent, deux courbes semaine par semaine (réussite et temps de réponse), le journal des erreurs avec des exemples réels, le trésor de l'enfant (étoiles) et le bloc **Cartes** : cartes gagnées et brillantes, cartes nouvelles encore gagnables cette semaine, zones et ce qu'attend la prochaine, étoiles dorées et arc-en-ciel en réserve, semaines réussies (pour vous seulement : l'enfant ne voit aucun nombre).
- **Données et réglages** : les sauvegardes, le nom de la pieuvre, la durée maximale d'une séance (10, 12 ou 15 minutes), les niveaux de difficulté proposés à l'enfant (par exemple interdire « plus facile », ou ne pas aller au-delà de « plus dur »), le défi record (activé ou non), **Échauffement : oui / non** (lot 3), la **notion du jour de la prochaine séance** (la ligne des nombres, les additions ou le calcul rapide, pour une seule séance lancée avec « jouer » ; ensuite la rotation reprend), le **son**, le **point de départ**, le changement de code, et « Tout effacer ».
- **Progression du module 2 (depuis le lot 2, étape 7)**, dans l'onglet **Progression** : la famille d'additions en cours et, pour chaque famille, sa date d'ouverture, combien de ses additions sont bien sues, si elle est acquise (ou « en révision » si elle a résisté 6 séances) et si les formes à trou sont ouvertes ; la **grille des additions** (un tableau : le nombre de la ligne plus celui de la colonne), où chaque case prend la couleur de sa boîte (du rose de la boîte 1 au vert de la boîte 5 ; blanche si l'addition n'a pas encore été vue) avec un anneau vert quand l'addition est donnée vite ; les cases « + 0 », en gris, montrent seulement le temps de frappe. Toucher une case montre chaque passage de cette addition (date, juste ou faux, temps, forme, changement de boîte). Une courbe montre, semaine par semaine, combien d'additions sont bien sues. Le bloc **Défi record** donne son record et chaque défi joué ; dans **Séances**, les réponses du défi sont à part, et les exports CSV ont des colonnes pour la notion du jour et le défi.
- **Le point de départ** : si l'enfant sait déjà faire, choisir le niveau de la ligne des nombres (1 à 13) où elle reprendra, ou marquer une famille d'additions comme connue (de « + 1 et + 2 » jusqu'au « mélange ») : ses additions seront revues moins souvent, et la famille (avec celles d'avant) est ouverte. C'est noté dans l'historique des niveaux comme votre choix, et cela ne rapporte rien à l'enfant.
- Dans **Séances**, chaque séance indique la difficulté choisie (et si l'application l'a redescendue) ; l'export CSV des séances a trois colonnes de plus (cran choisi, cran à la fin, descentes de cran) et celui des réponses une colonne « cran ».

**Sauvegarder chaque semaine.** Les données ne sont que sur la tablette. Elles seraient perdues si l'on effaçait les données de Chrome ou si l'on désinstallait l'application. Dans **Données et réglages**, **Sauvegarde complète (JSON)** enregistre un fichier dans les Téléchargements de la tablette ; **Envoyer la sauvegarde…** permet de l'envoyer directement vers Drive ou par e-mail. Un rappel s'affiche si la dernière sauvegarde date de plus d'une semaine. Pour tout récupérer (nouvelle tablette, effacement) : **Restaurer une sauvegarde** et choisir ce fichier. Les boutons **CSV** donnent des tableaux à ouvrir dans Excel, LibreOffice ou Google Sheets ; ils servent à lire, pas à restaurer.

**Tester l'espace parent** (sans gêner l'enfant) :

1. Faire une séance complète (environ 10 minutes) jusqu'à la lune.
2. Entrer dans l'espace parent, choisir un code.
3. Vérifier que le jour apparaît dans le **Calendrier**, puis déplier la séance dans **Séances** : on doit y retrouver les additions de l'échauffement et les questions de la ligne graduée.
4. Faire une **Sauvegarde complète** et vérifier que le fichier est dans les Téléchargements.
5. Pour recommencer à zéro avant que l'enfant ne commence vraiment : **Données et réglages** > **Tout effacer** (cela efface aussi le code et le nom de la pieuvre ; au prochain lancement, l'enfant choisira le nom).

## d bis) Lot 3 : choisir l'exercice, l'échauffement, la difficulté, le calcul rapide, la maison pendant la séance, le récif par zones, les sauvegardes de test

**Choisir l'exercice et le niveau.** L'accueil a maintenant quatre bulles : **jouer** (la séance proposée par l'application, comme avant), **choisir** (quatre petits carrés de couleur), le récif et l'album. Avec **choisir**, l'enfant (ou vous, pour lui indiquer l'exercice du soir) choisit d'abord l'exercice : la ligne des nombres (la tortue), les additions (le « + »), le calcul rapide (le mur de corail), les leçons (le livre). Puis le niveau : les 13 niveaux de la ligne, les 7 familles d'additions, les 9 niveaux du calcul rapide ou toutes les leçons, **même ceux jamais atteints**. Chaque image a un petit dessin qui montre le niveau ; le niveau conseillé par l'application est entouré d'une lueur jaune, ceux déjà réussis ont une petite étoile. **Un seul toucher suffit** (votre décision du 28 septembre) : l'image s'entoure d'or, la voix dit son nom, et l'écran suivant arrive ; de l'accueil au choix de la difficulté, il faut donc 3 touchers (choisir, l'exercice, le niveau). La petite bulle en haut revient au choix de l'exercice ; la maison revient à l'accueil. Ensuite vient le choix de la difficulté (les vagues), puis la séance. (Si vous préférez un jour que l'enfant touche deux fois, pour entendre le nom avant de choisir : réglage `choix.validation`, « double », dans `app/content/seance.json`.)

- L'exercice choisi **est la séance du jour** : accueil, échauffement, l'exercice choisi (autant de questions que d'habitude), défi record s'il a lieu, récompense ; étoiles, coquillages, série et étoile dorée comme d'habitude. Après la séance, « Encore ! » ouvre le même écran, sans étoiles.
- Un niveau choisi au-dessus du conseillé : s'il est réussi (8 bonnes réponses sur 10), il est validé et le conseillé passe au niveau suivant ; s'il est raté, **rien ne baisse**. Une famille d'additions pas encore ouverte s'ouvre ; ses additions nouvelles ne sont pas limitées ce jour-là.
- Une **leçon choisie seule** n'est pas une séance : elle se joue, puis on revient à l'accueil (3 étoiles si elle est regardée jusqu'au bout, une fois par leçon et par jour). Elle apparaît dans **Séances** comme « leçon choisie ».
- Dans **Séances**, une séance choisie porte « exercice choisi » (par exemple « ligne graduée, niveau 8 ») ; l'export CSV des séances a une colonne « exercice choisi par l'enfant ».
- Si vous avez imposé la notion du jour (**Données et réglages**) et que l'enfant choisit elle-même son exercice, votre choix attend la séance suivante lancée avec **jouer**.

**L'échauffement.** Depuis le lot 3 ter, un bouton à lui (une vague franchie par une flèche jaune, à droite, au-dessus de « je ne sais pas ») permet de le passer à tout moment, avec une confirmation (voir **d quater**). Dans **Données et réglages**, **Échauffement : oui / non** le retire de toutes les séances (et de la frise). **Ce que cela change** : l'échauffement est l'endroit où reviennent chaque soir les additions « à revoir » (la révision espacée, qui fait revenir une addition juste avant qu'elle soit oubliée). S'il est souvent passé ou retiré, ces additions ne reviennent plus que dans les exercices d'additions (une séance sur trois environ avec « jouer ») : elles restent plus longtemps dans les petites boîtes, et le défi record, qui n'utilise que des additions bien sues, arrive plus tard. Si l'enfant le passe presque chaque soir, regardez dans **Progression** si les additions montent encore de boîte ; sinon, remettez-le. Dans **Séances**, une séance indique « échauffement passé par l'enfant après n questions », « retiré » ou « pas refait » (voir la maison, ci-dessous).

**Les leçons collent à l'exercice.** Une leçon d'additions n'est jouée que pour la famille travaillée : les doubles (L4) pour les doubles, les amis de 10 (L5) pour les amis de 10, la maison (L6) pour les maisons ; les maisons de 8 et 9 rejouent la maison, et les presque-doubles les doubles, seulement si elles n'ont jamais été vues ; le mélange n'en joue aucune. Au moins 80 % des questions portent sur la famille du jour. Pour les presque-doubles, chaque question rappelle le double (« 3 plus 4, c'est 3 plus 3, et encore 1 »).

**La difficulté à l'intérieur du niveau.** Quand l'enfant a choisi son niveau, les vagues du début de séance ne changent plus de niveau : elles rendent **le même niveau** plus facile ou plus exigeant, avec les mêmes étoiles qu'avant (une demi-étoile à « plus facile », deux à « très dur »). Par exemple, pour la ligne de 0 à 100 (niveau 5) : plus facile, les dizaines paires sont écrites ; plus dur, seulement 0 et 100 ; très dur, 0 et 100 et il faut placer le poisson. Pour les additions : plus facile, l'aide est montrée d'emblée ; plus dur, une question sur deux avec un nombre caché (« 3 plus combien, ça fait 7 ? ») ; très dur, toutes. Comme avant, « plus facile » fait réviser sans faire monter de niveau. Avec **jouer**, les vagues gardent leur effet d'avant (un niveau au-dessus ou en dessous du conseillé). Le détail, niveau par niveau, est dans `docs/SPEC-LOT3.md`, section 3.

**Les sauvegardes de test (pour essayer, pas pour l'enfant).** Pour voir à quoi ressemble l'application après un mois ou trois mois d'usage, ou avec une enfant en difficulté, sans attendre : sur un ordinateur où le dépôt est installé, lancer par exemple

```
node tools/sauvegarde-test.mjs reel 2 4      (un mois, 2 séances par semaine)
node tools/sauvegarde-test.mjs reel 3 12     (trois mois, 3 séances par semaine)
node tools/sauvegarde-test.mjs diff 2 6      (une enfant en difficulté)
```

Chaque commande fabrique un fichier `sauvegarde-test-….json` : une vraie sauvegarde, calculée en simulant les séances (les réponses de l'enfant sont inventées d'après un profil : `sait`, `reel` pour le profil de l'évaluation de septembre, `diff` pour une enfant en difficulté). La dernière séance tombe la veille. Le mettre sur la tablette (par Drive ou par câble), puis **Données et réglages** > **Restaurer une sauvegarde**.

**Attention : restaurer remplace toutes les données de la tablette.** Faire d'abord une **Sauvegarde complète** des vraies données, et la restaurer après l'essai. La pieuvre s'y appelle « Pili » ; votre code parent est gardé. Les cartes suivent le calendrier scolaire : des séances simulées avant la rentrée (trois mois fabriqués en septembre) ne donnent presque pas de cartes nouvelles, c'est normal.

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

**La légende des niveaux (pour vous).** Sur chaque écran de niveaux, et sur celui des leçons, un petit bouton en forme de **livre ouvert**, en haut à droite, sous le haut-parleur, ouvre un panneau qui dit, pour chaque niveau, ce qui est travaillé et un exemple. La croix, ou un toucher à côté du panneau, le referme. Ouvrir ou fermer la légende ne lance rien, et la voix ne la lit pas. Le même texte est dans l'espace parent (onglet **Progression**, « Les niveaux de « choisir », en bref ») et ci-dessous ; il est rangé une seule fois dans l'application (`app/content/legendes.json`).

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

**Les leçons**

| Leçon | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| L1 | On compte les sauts, pas les traits. | De 0 à 3, 3 sauts |
| L2 | Un saut peut valoir dix. | 10, 20, 30 |
| L3 | Une ligne ne commence pas toujours à 0. | 30, 31, 32 |
| L4 | Les doubles, deux fois le même nombre. | 3 + 3 |
| L5 | Les amis de 10, remplir le cadre de 10. | 7 + 3 |
| L6 | La maison des nombres, deux pièces et le toit. | 5 + 2 = 7 |
| L10 | Les centaines, cent, c'est dix dizaines. | 100, 200, 307 |
| L7 | Plus 10 sur le mur de corail, on descend d'une rangée. | 34 + 10 |
| L8 | L'astuce du 9, plus 10, puis moins 1. | 34 + 9 |
| L9 | Passer la dizaine, on complète d'abord jusqu'à 10. | 38 + 5 |

**L'appui long sur les pictogrammes.** Garder le doigt environ **une demi-seconde** sur une bulle de l'accueil (jouer, choisir, le récif, l'album) ou sur un exercice de l'écran « choisir » (la ligne, les additions, le calcul rapide, les leçons) fait apparaître une **étiquette** au-dessus, qui reste tant que le doigt est posé (depuis le lot 3 ter : elle s'efface en une demi-seconde, et cela vaut pour tous les boutons, voir **d quater**). Relâcher après un appui long **ne lance rien** ; seul un toucher bref lance. La voix ne lit pas l'étiquette. La durée se règle dans `app/content/legendes.json` (`appuiLong`).

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

## e) Ce qui reste approximatif ou à ajuster

**À vérifier sur la vraie tablette.** Écouter la voix (aucune phrase n'a été écoutée par une personne, la vérification a été automatique) et regarder les illustrations des cartes en grand. Toutes les mesures ont été faites sur un ordinateur, en ralentissant le processeur 4 fois pour imiter une tablette : démarrage en moins de 1,5 s, animation à 50 à 60 images par seconde la plupart du temps, avec des baisses vers 30 pendant certaines animations (l'application allège alors d'elle-même le décor). Il faut confirmer que tout reste fluide sur la tablette.

**Propositions qui attendent votre avis** (détaillées dans `docs/AVANCEMENT.md`, rubrique « Décisions prises ») :

- les deux exemples guidés montrés par la tortue avant les questions, et le déroulé exact des leçons L1 à L3 ;
- la liste des 15 cartes du lagon et leurs anecdotes, à relire (fichier `app/content/cartes.json`) ;
- les règles de la série (5 étoiles toutes les 3 séances, jamais de remise à zéro) et de l'étoile dorée ;
- lot 1 bis (détail dans `docs/BILAN-LOT1BIS.md`) : le coquillage à 25 étoiles au lieu de 40, les phrases des zones fermées de l'album, les nouvelles phrases (reprise, « Encore ! », album), et le fait qu'une leçon passée soit suivie de son exercice guidé.

**Défauts connus, sans gravité.**

- Un petit à-coup (environ un dixième de seconde) à l'apparition de certaines questions.
- Pendant une pause, un saut de la tortue déjà commencé se termine à l'écran (moins d'une seconde) ; la suite attend « continuer ». La phrase coupée est redite depuis son début.

**Pas encore fait (prévu dans les lots suivants).** Les problèmes, les bilans officiels toutes les deux semaines, les illustrations et anecdotes du grand large et des abysses (à livrer **avant début février** et **avant fin avril**, sinon la collection s'arrête au récif de corail), les quatre cartes rares liées aux nombres jusqu'à 1 000, les créatures animées des zones 2 à 4 dans le récif (lot 4).

**Stockage protégé.** Chrome accorde en général la protection des données (« stockage persistant ») quand l'application est installée sur l'écran d'accueil. L'espace parent indique si c'est le cas (**Données et réglages** > **Données protégées**). Même accordée, elle ne protège pas d'un effacement volontaire : la sauvegarde de la semaine reste la vraie sécurité.
