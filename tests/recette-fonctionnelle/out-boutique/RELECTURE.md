# Relecture indépendante du lot « La boutique du récif »

Relecture faite le 11 octobre 2026 par une session qui n'a pas vu le travail, sans lire le code, l'historique, le journal de conception ni la maquette `art/boutique/`.

## Ce que j'ai lu

**Phase 1, sans spécification :**
- `docs/archives/PROMPT-RECETTE-LOT3.md` : « Les deux personnes à incarner » et la grille du relecteur (ergonomie 1 à 4, pédagogie 5 à 10).
- Les 54 captures de `tests/recette-fonctionnelle/out-boutique/captures/`, dans l'ordre (1280 × 800 ; 1920 × 1200 et « tablette » pour 02, 03, 04, 09, 17, 18), avec quelques agrandissements (coche et croix, coins des tuiles, perles des onglets, haut de l'espace parent).
- `phrases.json` : ce que la voix a dit avant chaque capture et ce qu'écrit la bulle.
- Les lignes « Récompense et fin » de `tests/recette-fonctionnelle/out/B-sequences/neuve/` et `mois/` (calcul rapide, étal), et une recherche des mots « boutique », « coquillage », « diamant », « zone ouverte » dans tous les fichiers, plus l'en-tête de `SYNTHESE.md`.

**Phase 2 :** `docs/SPEC.md`, section 10 (« Récompenses », « La boutique du récif », « Les cartes », « Le récif vivant ») et section 12 (« L'espace parent »).

**Limites du matériel :**
- Pour trois captures, `phrases.json` ne correspond pas à l'image. En 24, la voix a dit « Tu as bien travaillé. À demain ! » mais la bulle écrit « C'est fini pour aujourd'hui. À demain ! ». En 26-fin-carte-1, la voix nomme la coquille Saint-Jacques mais la carte montre le poisson-chirurgien. En 26-fin-carte-2, elle nomme la méduse à crinière de lion mais la carte montre le poisson volant. Les tirages au hasard ont sans doute été différents entre l'enregistrement des phrases et la capture (voir R11). Je n'ai donc pas pu vérifier sur ces trois écrans que la bulle écrit bien ce que dit la voix.
- Les cartes du grand large n'ont pas d'illustration (26-fin-carte-2 et 27-coquillage-de-diamant-2 : mer vide, « Anecdote fictive pour la capture ») : c'est un décor de test, puisque la spécification interdit d'ouvrir une zone dont le contenu n'est pas prêt. Je ne le compte pas comme un défaut.
- Plusieurs captures repartent d'états fabriqués (compteur qui passe de 190 à 290 entre 10 et 11, bernard-l'ermite brillant puis à vendre). Je n'ai pas jugé ces sauts.

## Synthèse

1. **Rien n'est bloquant.** Le parcours se comprend sans lire : on touche une créature, le capitaine dit son nom et son prix, la coche verte achète, les étoiles volent du compteur vers la créature et le compteur descend avec elles (08, 09). Puis la créature arrive à la nage dans le récif (13, 14). C'est clair et joyeux.
2. **Une vraie occasion de calcul** : « Pour la faire briller, il faut 300 étoiles. Il te manque 70 étoiles. » (04), avec les nombres en rouge dans la bulle. C'est une soustraction utile, dans un contexte qui compte pour l'enfant.
3. **Les états de la vitrine sont bien choisis** : sablier pour « bientôt », cadenas sur les zones fermées, cadre argent pour les rares et or pour les légendaires, halo doré sur les nouvelles arrivées (23). Pas de coche quand il manque des étoiles (04, 05).
4. **L'effort paie** : dans les simulations, l'enfant « pressée » gagne 23 à 67 % des étoiles de l'« appliquée ». Avec des prix de 40 et 100, cela se traduit en achats nettement moins nombreux. Dans les séances « un mois », la fin mène toujours à la boutique.
5. **Le principal risque au toucher (R1)** : la coche et la croix se posent sur le haut de la tuile du dessous. En voulant toucher l'hippocampe juste après l'oursin, on peut acheter l'oursin. Un achat est définitif.
6. **La bulle cache des créatures et leurs prix (R2)** pendant qu'elle parle : jusqu'à trois tuiles de la rangée du haut (04, 18). C'est contraire à la règle du projet.
7. **Trois sortes d'étoiles, une seule visible (R3)** : l'enfant entend parler d'étoiles arc-en-ciel et d'étoiles de diamant, mais n'en voit jamais la réserve. L'étoile de diamant, irisée, ressemble à ce qu'on imagine d'une étoile « arc-en-ciel ». Enfin, la zone fermée dit qu'elle s'ouvrira « grâce à tes étoiles arc-en-ciel », alors que la vraie condition est d'acheter toutes les créatures de la zone d'avant.
8. **L'espace parent est bien rédigé**, notamment la phrase « Prochaine zone… elle attend que les 6 créatures… soient achetées » et le réglage du rythme. Mais deux chiffres de la capture 29 se contredisent (R4) : à vérifier, car ils tromperaient le parent.
9. Le reste est cosmétique : signes « déjà à toi », « brillante » et perles trop petits (R5), bouton de retour qui ressemble à l'onglet du récif de corail (R6), « le poisson-clown… Elle est brillante » (R7), annonce d'une zone qui renvoie à l'album et bulle restée affichée pendant l'animation (R8), mise en page de l'espace parent (R9).
10. Deux questions : le premier soir d'une enfant toute neuve (R10), et le matériel de recette (R11).

## Les constats

### R1 · La coche et la croix couvrent la tuile du dessous : achat possible sans le vouloir

- **Gravité : gênant.**
- **Ce qui se voit** : 03 (dans les trois tailles d'écran). L'oursin est sélectionné ; la croix et la coche (environ 85 px à 1280) sont posées à cheval entre l'oursin et l'hippocampe. Elles couvrent le tiers haut de la tuile de l'hippocampe, soit sa tête. La voix a dit : « Pour l'avoir, il faut 40 étoiles. Si tu es d'accord, touche la coche verte. »
- **Pourquoi c'est un problème** : l'enfant touche vite, et souvent la créature suivante pour entendre son prix. Si elle vise le haut de l'hippocampe, elle touche la coche et achète l'oursin. Les étoiles partent et rien ne se revend. Elle perd un achat choisi, ce qui est frustrant à 7 ans, et ne comprend pas ce qui s'est passé.
- **Spécification** : c'est conforme (« se posent sous la tuile, au-dessus pour la dernière rangée »). C'est donc une règle voulue qui pose problème : les rangées se touchent presque, si bien que « sous la tuile » veut toujours dire « sur la tuile voisine ».
- **Proposition** : pendant que la coche et la croix sont affichées, voiler les autres tuiles, pour qu'un toucher à côté annule seulement (comme le dit déjà la règle), même sur la tuile du dessous. Autre solution : poser la coche et la croix dans une zone fixe qui ne couvre aucune tuile, par exemple sous la mascotte, à gauche de la vitrine. Ajouter au parcours de test : sélection de l'oursin, puis toucher sur le haut de l'hippocampe, sans qu'aucun achat ne doive avoir lieu.

### R2 · La bulle couvre des tuiles pendant qu'elle parle

- **Gravité : gênant.**
- **Ce qui se voit** : en 04 et 05 (raie pastenague), la bulle cache l'étoile de mer, le crabe et la crevette, ainsi que leurs prix. En 18 (légendaire), elle cache le poisson volant, le thon et une partie de l'espadon. En 06, elle cache le prix du crabe, l'oursin et l'anémone. En 03, elle cache la tuile en bas à gauche et le prix de la moule. `phrases.json` mesure d'ailleurs une gêne (« gene » 5 à 10) sur ces écrans.
- **Pourquoi c'est un problème** : dans une boutique, l'enfant compare. Pendant la phrase, qui est longue (« Cette créature est déjà dans ton récif. Pour la faire briller, il faut 300 étoiles. Il te manque 70 étoiles. »), elle ne voit plus les créatures voisines. Si elle touche la bulle en croyant toucher une tuile, il ne se passe rien, ou pas ce qu'elle attend.
- **Spécification** : la bulle doit partir de la tuile, et c'est le cas. Mais la règle du projet est que la bulle « ne couvre jamais ce que l'enfant touche » : c'est un écart de réalisation.
- **Proposition** : placer la bulle dans l'espace libre de gauche, sous le capitaine (comme en 02, 09, 20), avec une pointe longue qui va jusqu'à la tuile. On garde ainsi le lien avec la tuile touchée sans rien recouvrir. À défaut, la placer au-dessus de la vitrine, entre les onglets et la première rangée, en réduisant un peu la hauteur des tuiles.

### R3 · Étoiles arc-en-ciel et étoiles de diamant : l'enfant ne les voit pas et peut les confondre

- **Gravité : gênant.**
- **Ce qui se voit** :
  - 19 : la zone fermée dit « Les abysses et les mers glacées s'ouvriront un jour, grâce à tes étoiles arc-en-ciel. »
  - 18 et 28 : la légendaire dit « Elle se gagne avec les étoiles de diamant. » L'icône sous l'ombre dorée est une étoile irisée, rose, verte et bleue.
  - 26-fin-special : « Et une étoile de diamant ! » ; l'étoile est la même, irisée ; elle disparaît ensuite sans rejoindre aucun compteur visible.
  - Le seul compteur à l'écran est celui des étoiles de mer.
- **Pourquoi c'est un problème** :
  - L'enfant entend trois mots (étoiles de mer, arc-en-ciel, diamant) pour trois choses dont elle ne voit qu'une. Une étoile irisée « de toutes les couleurs », elle l'appellera « arc-en-ciel ».
  - La phrase de la zone fermée l'oriente vers le mauvais levier : ce qui ouvre la zone suivante, c'est d'abord d'acheter toutes les créatures de la zone en cours (l'espace parent le dit très bien en 29). Les étoiles arc-en-ciel ne sont que la clé qu'on tourne à la fin. Elle demandera au parent : « c'est quoi les étoiles arc-en-ciel ? Comment j'en ai ? », et le parent devra ouvrir l'espace parent pour répondre.
- **Spécification** : conforme (la phrase de la zone fermée et l'étoile de diamant aux « facettes irisées » sont écrites ainsi). C'est donc une règle voulue qui pose problème.
- **Propositions** :
  1. Pour la zone fermée, une phrase qui dit le vrai levier : « Cette zone s'ouvrira quand toutes les créatures du lagon vivront dans ton récif ! ». Il faudra fabriquer la voix.
  2. Montrer quelque part la réserve d'étoiles de diamant, sans chiffre, par exemple une petite étoile de diamant près du compteur quand il y en a une. Sinon, ne parler à l'enfant de l'étoile de diamant qu'au moment où elle ouvre un coquillage.
  3. S'assurer que l'étoile arc-en-ciel et l'étoile de diamant ne se ressemblent pas : couleur dominante franche pour l'une (or, ou bleu glacier façon pierre taillée), bandes d'arc-en-ciel pour l'autre.

### R4 · Espace parent : deux chiffres qui se contredisent (à vérifier)

- **Gravité : gênant** si le défaut existe dans l'application réelle, car il trompe le parent.
- **Ce qui se voit** : 29.
  - « 0 créatures brillantes », alors que la liste des achats montre « 11/10 08 h 28 · Poisson-clown · 150 étoiles · faire briller ».
  - « 1 étoile de diamant en réserve (2 gagnées) » avec « 0 / 5 légendaires » : une étoile de diamant aurait été dépensée sans légendaire, alors que la spécification dit qu'elle ne sert qu'au coquillage de diamant, qui donne une légendaire.
- **Pourquoi c'est un problème** : le parent qui vérifie un achat « faire briller » ne le retrouve pas dans les brillantes. Il peut croire qu'une étoile a été perdue, ou que l'application se trompe.
- **Spécification** : l'écran doit montrer les brillantes, les étoiles de diamant et les légendaires de façon cohérente (section 12). C'est probablement un état fabriqué pour la capture : le journal des achats garde l'achat de la capture 12, alors que le reste a été remplacé. Mais il faut le vérifier.
- **Proposition** : refaire la capture 29 à partir d'un état cohérent, celui qu'a laissé la séquence 08 à 12, et ajouter un test qui confronte la liste des achats « faire briller » et le nombre de brillantes, ainsi que « gagnées − en réserve » et le nombre de légendaires.

### R5 · « Déjà à toi », « à acheter », « brillante » : des signes trop petits

- **Gravité : cosmétique.**
- **Ce qui se voit** :
  - Une créature déjà dans le récif ne se distingue d'une créature à vendre que par un petit récif dans le coin (environ 22 px à 1280) et une étincelle minuscule devant le prix : « ✦150 ★ » au lieu de « 40 ★ » (02, 15, agrandissement du coin).
  - Une brillante, entre deux passages du reflet, ressemble à une tuile ordinaire sans prix (07 : l'étoile de mer ; 10).
  - Les 15 perles sous chaque onglet font environ 4 px : on ne les voit qu'en agrandissant.
- **Pourquoi c'est un problème** : sans lire, l'enfant voit « 150 » sous le poisson-clown qu'elle a déjà et peut croire qu'on le lui revend. La voix le corrige si elle touche la tuile. Les perles, censées montrer qu'une zone se remplit, ne lui disent rien à cette taille.
- **Spécification** : c'est conforme dans le principe (le petit récif, l'étincelle, le reflet toutes les 3 à 4 s, les 15 perles). Le défaut tient à l'affichage.
- **Proposition** : doubler la taille du petit récif dans le coin ; dessiner l'étincelle de « faire briller » aussi grande que l'étoile du prix ; garder un liseré irisé permanent sur les brillantes entre deux passages du reflet ; perles de 8 à 10 px.

### R6 · Le bouton de retour au récif ressemble à l'onglet du récif de corail

- **Gravité : cosmétique.**
- **Ce qui se voit** : en 15 et 16, en haut à gauche, le bouton de retour au récif (un corail rose sur une île, rond blanc) est à côté de l'onglet « récif de corail » (un corail rose et un poisson, rond rose).
- **Pourquoi c'est un problème** : deux pictogrammes proches pour deux sens différents. En voulant voir le récif de corail, l'enfant peut quitter la boutique. Ce n'est pas grave, elle revient par le bouton de l'étal, mais c'est une petite impasse.
- **Proposition** : donner au bouton de retour un signe différent de tous les onglets, par exemple le corail avec une flèche de retour, ou le même dessin que le bouton du récif à l'accueil, mais sans corail rose ; ou bien l'éloigner des onglets.

### R7 · « C'est le poisson-clown ! Oh ! Elle est brillante ! »

- **Gravité : cosmétique.**
- **Ce qui se voit** : 12 et 26-fin-carte-1 (« C'est le poisson-chirurgien ! Oh ! Elle est brillante ! »).
- **Pourquoi c'est un problème** : le parent l'entend, et la bulle l'écrit sous les yeux d'une enfant qui apprend à lire. Pour un nom masculin, « Elle » sonne faux.
- **Spécification** : conforme, l'exemple même de la spécification est « C'est le crabe ! Oh ! Elle est brillante ! ». C'est une règle voulue qui pose un petit problème.
- **Proposition** : une phrase qui ne dépend pas du genre, « Oh ! Cette créature est brillante ! » ou « Oh ! Comme ça brille ! ». Sinon, deux variantes, « Il est brillant ! » et « Elle est brillante ! », selon le genre écrit dans `cartes.json`. Il faudra fabriquer les voix.

### R8 · L'ouverture d'une zone : renvoi vers l'album, bulle périmée

- **Gravité : cosmétique.**
- **Ce qui se voit** :
  - En 26-fin-zone-1 à 3, le dos de carte de la zone apparaît et grandit sans aucune voix, pendant que la bulle écrit encore « Et une étoile de diamant ! Tu as joué souvent, semaine après semaine. ».
  - Puis, en 26-fin-coquillage-2, la voix dit : « Le grand large est ouvert ! De nouvelles cartes t'attendent dans ton album. »
- **Pourquoi c'est un problème** : la bulle parle d'une chose pendant que l'écran en montre une autre. Surtout, depuis la boutique, les nouvelles créatures ne s'obtiennent plus dans l'album mais à la boutique : si l'enfant va voir l'album, elle n'y trouve que des dos de cartes.
- **Spécification** : la spécification dit seulement « la voix annonce la zone », sans fixer la phrase. La phrase actuelle date d'avant la boutique.
- **Proposition** : faire disparaître la bulle dès qu'une nouvelle étape de la récompense commence, et remplacer la phrase par « Le grand large est ouvert ! Ses créatures vont arriver à la boutique. ».
- **Remarque** : la fin de séance la plus chargée (26 : bilan, coquillage de la série, carte, étoile de diamant, zone, premier habitant, carte, arrivages, invitation à la boutique) est longue pour une enfant de 7 ans, mais elle est rare. Je ne la compte pas comme un constat.

### R9 · Espace parent : mise en page et une formule ambiguë

- **Gravité : cosmétique.**
- **Ce qui se voit** :
  - En 29, la première phrase (« L'enfant ne voit aucun de ces nombres, sauf les prix. ») passe sous la barre des onglets et n'est lisible qu'à moitié. Le bouton « Fermer » et l'onglet « Calendrier » sont coupés sur les bords. Le tableau des achats est coupé après une ligne, au-dessus d'un grand vide.
  - « étoiles arc-en-ciel en réserve (0 gagnées, 0 pour ouvrir des zones) » : « 0 pour ouvrir des zones » peut se lire « il en faut 0 ».
  - En 30, le texte du rythme tient dans une colonne étroite (environ 260 px), à côté d'un grand blanc.
- **Pourquoi c'est un problème** : le parent n'est pas technicien. Une phrase cachée ou ambiguë le fait douter. Le reste est clair, en particulier la phrase sur la prochaine zone et l'explication « arrivages / libre ».
- **Proposition** : laisser de la place sous les onglets fixes, ou refaire la capture si c'est un effet du défilement. Écrire « 0 déjà utilisées pour ouvrir des zones ». Élargir la colonne de texte du réglage.

### R10 · Question : le premier soir d'une enfant toute neuve

- **Gravité : cosmétique** pour cette enfant, qui a déjà un récif (32 montre qu'une ancienne sauvegarde garde tout).
- **Ce qui se voit** : dans les séances simulées « base neuve », plus de la moitié finissent par « boutique : rien à acheter (le bouton de fin mène au récif) » (407 sur 756). Une première séance au cran « plus facile » rapporte 26 à 33 étoiles, moins que 40. Le récif est alors vide (« Ton récif attend ses premiers habitants… »). Avant la boutique, un coquillage tous les 25 étoiles donnait une carte dès le premier soir.
- **Pourquoi c'est un problème** : après une réinstallation, ou pour une autre enfant, le premier soir se termine sans aucune créature. C'est la soirée où l'envie de revenir se joue.
- **Spécification** : elle ne tranche pas.
- **Proposition** : offrir un premier habitant au tout premier soir, comme à l'ouverture d'une zone (« Et voici ton premier habitant ! »), ou mettre la première commune à 20 étoiles.

### R11 · Le matériel de recette ne permet pas tout à fait de juger

- **Gravité : cosmétique** (outil de recette, pas l'application).
- **Ce qui se voit** :
  - `phrases.json` ne correspond pas à l'image pour 24, 26-fin-carte-1 et 26-fin-carte-2 (voir « Limites du matériel »). Si ce n'est pas un écart de tirage, c'est que la bulle écrit autre chose que la voix, ce qui serait un défaut réel à corriger.
  - Les séances simulées (`B-sequences`) ne mentionnent jamais le coquillage de la série, l'étoile de diamant, l'étoile arc-en-ciel à la récompense ou l'ouverture d'une zone (aucune ligne avec « coquillage », « diamant » ou « zone ouverte » dans « Récompense et fin ») : on ne peut pas juger à quelle fréquence ces moments arrivent.
- **Proposition** : enregistrer la bulle et les phrases dans la même passe que la capture, en fixant la graine du hasard. Ajouter à « Récompense et fin » les coquillages, étoiles de diamant, étoiles arc-en-ciel et ouvertures de zone, et au moins une séance « un mois » où ils se produisent.

## Traitement par la session

- **R1 (gênant), la coche et la croix sur la tuile du dessous** : laissées telles quelles. C'est la place que le parent a arrêtée dans la maquette (« juste sous la tuile, au-dessus pour la dernière rangée »), et l'achat demande trois gestes voulus : toucher la créature, entendre son prix et « touche la coche verte », toucher la coche (qui se balance). Le risque décrit (viser l'hippocampe et toucher la coche de l'oursin) est réel : **question posée au parent** dans la demande de fusion (poser la coche et la croix sur le côté de la tuile, ou laisser l'achat se faire seulement si le doigt reste sur la coche).
- **R2 (gênant), la bulle qui cache des tuiles** : conforme à la règle des écrans de choix (`docs/SPEC.md`, section 11 : « sauf la bulle d'une tuile sur les écrans de choix, qui peut cacher d'autres tuiles le temps de la phrase : elle laisse passer le doigt »), reprise telle quelle pour la boutique. Le doigt passe à travers la bulle ; elle n'est là que le temps de la phrase. La boutique a ajouté à la spécification qu'elle part de la tuile, comme sur les écrans de choix.
- **R3 (gênant), étoiles arc-en-ciel et de diamant** : la phrase des zones fermées est une phrase existante, gardée par la maquette ; l'étoile de diamant est dessinée d'après la décision du parent (« blanc irisé, étincelant »). Signalé au parent (question ouverte), sans changement.
- **R4 (gênant), espace parent** : c'était l'état fabriqué pour la capture (un journal d'achats qui ne correspondait pas à la collection). Le parcours pose maintenant un état cohérent ; l'espace parent calcule bien les brillantes depuis la collection (test unitaire `tests/unit/parent.test.mjs`).
- **R5, R6, R7, R8, R10** : cosmétiques ou questions : laissés, et listés pour le parent (R7 et R8 viennent de phrases existantes ; R10 : le premier soir, une séance rapporte en moyenne 50 à 70 étoiles, une créature coûte 40).
- **R9** : « 0 pour ouvrir des zones » devient « 0 déjà utilisées pour ouvrir des zones » ; le reste vient de la capture d'un bloc défilé sous la barre des onglets.
- **R11** : l'écart entre `phrases.json` et trois captures vient de l'outil (les phrases sont relevées juste après la capture, quand la voix a déjà enchaîné) ; les séances simulées mentionnent le coquillage de la série, l'étoile de diamant et l'ouverture d'une zone quand ils ont lieu (rares sur une seule séance simulée).
