# Relecture indépendante — lot « Correctifs de la tablette »

Relecture faite le 8 octobre 2026 sur les captures de `captures/` (toutes les 1280 × 800, et 1920 : 01, 02, 03, 10, 2-ligne-haut-gauche-1, 2-ligne-bas-droite-12, 2-voiliers-bas-droite-8, 29, 30, 41, 50, 51), sur `parcours-resultat.json` et sur les phrases nouvelles de `app/content/textes.json`.

Gravités : **bloquant** (l'enfant ou le parent est coincé ou induit en erreur), **gênant** (on s'en sort, mais ça coûte du temps, de l'attention ou de la confiance), **cosmétique** (laid ou maladroit, sans effet sur le jeu).

Les 1920 × 1200 (réduites) montrent la même mise en page que les 1280 × 800, au pixel près : les constats valent pour les deux tailles.

---

## Phase 1 — ce que vivent l'enfant et le parent (sans lire la spécification)

### P1-1. La bulle de la mascotte cache d'autres tuiles qu'on peut toucher — **gênant** (bloquant si la bulle bloque aussi le toucher)

Captures : `1280-2-ligne-haut-gauche-1` (tuiles 2, 3, 4 cachées), `1280-2-ligne-bas-droite-12` et `1280-2-additions-bas-droite-12` (tuile 13 entièrement cachée), les quatre `1280-2-calcul-*` (selon le cas les tuiles 4-5, 1-2-5-6, 4-8-9, 7-8), `1280-2-voiliers-haut-gauche-1` (2, 3, 4), `1280-2-voiliers-haut-droite-4` (1, 2, 3, 5, 6, 7 à moitié), `1280-2-voiliers-bas-*` et `1280-2-multiplication-bas-droite-8` (tuile 9), `1280-2-multiplication-haut-gauche-1` (2, 3), `1280-30-lecons-L1` (5, 6, 11, 12), `1280-32-lecons-table-multiplication` (6, 8, 9, 11), `1280-41-libre-niveau` (5, 6, 7, 8).

Ce que vit l'enfant : elle touche le niveau 1 pour l'entendre, puis veut toucher le 2 pour comparer… mais le 2 a disparu sous la bulle pendant 5 à 10 secondes. Elle touche vite : soit elle touche la bulle (rien ne se passe, ou pire elle touche la tuile cachée sans la voir), soit elle attend. Sur le calcul rapide, presque chaque position de bulle cache deux ou trois tuiles. La bulle évite bien la tuile choisie, mais pas les voisines.

Proposition : placer la bulle d'abord dans les zones vides de l'écran (la colonne de gauche sous la mascotte est libre sur tous les écrans de niveaux, le haut entre la mascotte et la grille aussi), et n'accepter une place que si elle ne recouvre **aucune** tuile ni bouton ; sinon réduire la bulle (texte plus court, voir P1-5) plutôt que couvrir. Ajouter au parcours de recette une vérification automatique « bulle ∩ toutes les zones touchables = vide », pas seulement « bulle ∩ tuile choisie ».

### P1-2. Rien ne montre qu'un second toucher lance le jeu — **gênant**

Captures : `1280-10`, `1280-11`, tous les `1280-2-*`, `1280-30` à `33`.

Seule la voix le dit, une fois, à l'entrée de l'écran (« Touche-la encore pour commencer »). Ensuite, la tuile choisie reçoit juste un cadre orange : aucun signe « c'est parti » (pas de triangle « jouer » sur la tuile, pas de pulsation, pas de petit pouce). Une enfant de 7 ans qui n'a pas écouté la première phrase touche une tuile, entend une description, et attend que quelque chose se passe ; ou bien, à l'inverse, touche deux fois très vite et lance un niveau sans avoir rien entendu.

Proposition : sur la tuile choisie, faire apparaître un petit triangle « jouer » (le même que celui de l'accueil) qui pulse doucement ; le rappeler à la voix si l'enfant ne touche rien pendant quelques secondes. Ignorer un second toucher arrivé moins d'une demi-seconde après le premier (double toucher accidentel), si ce n'est pas déjà fait.

### P1-3. Après les deux touchers, il reste encore deux touchers : le sélecteur de difficulté — **gênant**

Capture : `1280-29-lance-selecteur`.

Après « touche une fois pour entendre, une fois pour lancer », l'enfant arrive sur quatre vagues et un bouton ✓ : il faut encore choisir, puis valider. Quatre touchers en tout pour commencer à jouer. Ici, la vague préchoisie a un **cercle jaune** : sur l'écran précédent, le jaune voulait dire « niveau conseillé » et l'orange « ce que tu as choisi ». Le code couleur change d'un écran à l'autre. La phrase « Plus c'est dur, plus tu gagnes d'étoiles ! » pousse une enfant qui « veut des étoiles » à toujours prendre la plus grosse vague, même quand elle bute. Il n'y a pas de bouton « maison » sur cet écran (on ne peut pas revenir en arrière).

Proposition : garder le même code partout (halo jaune = conseillé, cadre orange = choisi) ; montrer la vague conseillée par le halo et la vague choisie par le cadre ; remplacer le ✓ par le second toucher sur la vague (même règle que partout ailleurs) ; remettre la maison. Revoir la phrase, par exemple « Choisis ta vague. La grosse vague donne plus d'étoiles, mais elle est plus dure. »

### P1-4. Le cadre « choisi » et le halo « conseillé » se distinguent bien — mais personne n'explique le halo — **gênant (parent)**

Captures : tous les `1280-2-*`.

Pour l'œil, c'est réussi : cadre orange épais et net contre lueur jaune floue ; quand les deux sont sur la même tuile (`2-ligne-haut-gauche-1`), on voit bien le cadre à l'intérieur du halo. En revanche, rien ne dit à quoi sert le halo : ni la voix à l'entrée de l'écran, ni la description quand on touche la tuile conseillée. Le parent à côté qui se demande « qu'est-ce que je choisis ? » ne sait pas que le halo est la réponse.

Proposition : quand l'enfant touche la tuile conseillée, ajouter une phrase courte (« C'est celui que je te conseille. ») ; dans la phrase d'entrée `choixNiveau`, dire « Celui qui brille, c'est celui que je te conseille. »

### P1-5. Descriptions trop longues ou redondantes — **gênant**

Captures et phrases (titre du niveau + `choixDescription`) :

- `2-voiliers-bas-gauche-5` : « Des bouées de cent en cent, ou de dix en dix, et le bateau tout près d'une bouée. Le nombre est juste à côté d'une bouée : avant, ou après ? » — 30 mots, six lignes de bulle, l'idée « tout près / juste à côté d'une bouée » dite deux fois.
- `2-voiliers-bas-droite-8` : « Des bouées mélangées, et le bateau tout près d'une bouée. Les bouées ne sont pas toutes à la même distance : lis bien chaque nombre. » — « mélangées » et « pas toutes à la même distance » disent la même chose ; la bulle déborde sur six lignes.
- `2-ligne-bas-gauche-9` : « La ligne de zéro à mille, de cent en cent. Chaque saut vaut cent. » — « de cent en cent » puis « chaque saut vaut cent ».
- `2-ligne-bas-droite-12` : « La dictée des grands nombres. Tu entends un grand nombre, et tu l'écris en chiffres. »
- `2-additions-bas-gauche-9` : « Les doubles jusqu'à quinze. […] : deux fois le même nombre. »
- `2-multiplication-haut-gauche-1` : « Des rangées égales. Tu ajoutes les rangées de poissons. »
- `41-libre-niveau` (calcul 4) : « Ajouter sans changer de dizaine. Les unités s'ajoutent, la dizaine ne bouge pas. »
- `2-ligne-haut-gauche-1` : « La corde de zéro à dix, avec presque tous les nombres. Tu comptes les sauts de la tortue, de un en un. » (« presque tous les nombres » n'aide pas l'enfant).
- `2-voiliers-haut-droite-4` : « Quatre bouées de dix en dix, jusqu'à mille. » (le nombre de bouées n'apprend rien à l'enfant).

Une enfant de 7 ans retient une idée par phrase entendue. Au-delà de 15 mots, elle a déjà touché autre chose.

Proposition : une phrase de titre + une phrase de description qui apporte **autre chose** (ce qu'on fait, ou l'astuce), 15 à 18 mots en tout. Exemples : voiliers 5 → « Le bateau est tout près d'une bouée : juste avant, ou juste après ? » ; voiliers 8 → « Les bouées ne sont pas bien rangées : lis chaque nombre. » ; ligne 9 → « La ligne de zéro à mille. Chaque saut vaut cent. »

### P1-6. Des mots trop difficiles ou trompeurs pour 7 ans — **gênant**

Phrases de `choixDescription` :

- ligne 8 et 13 : « tu **devines** où va le nombre ». Pour une enfant qui répond déjà au hasard quand elle s'ennuie, « deviner » est une permission de tirer au hasard. Proposer : « Il n'y a pas de traits : regarde bien le milieu de la ligne. »
- calcul 7 et 9 : « On va d'abord jusqu'à **la dizaine** » / « On recule d'abord jusqu'à **la dizaine** » : laquelle ? Pour 38 + 5, c'est « jusqu'à quarante ». Proposer : « On va d'abord jusqu'à la dizaine d'après, puis on ajoute le reste. » / « On recule d'abord jusqu'à la dizaine juste avant… ».
- multiplication 5 : « Fois cinq, c'est la moitié de fois dix » : juste, mais trop abstrait en CE1. Proposer : « Fois cinq, ça finit toujours par zéro ou par cinq. » (ou « Cinq, dix, quinze, vingt… »).
- calcul 3 « **Seules** les dizaines changent », calcul 4-5 « Les **unités** s'ajoutent, la dizaine ne bouge pas », voiliers 4 « après cent » : vocabulaire de maîtresse plus que d'enfant ; « après cent » ne correspond pas à l'image de la tuile (530 à 560).
- additions 5 : « avec le **cadre** de dix » alors que partout ailleurs on dit « la **boîte** de dix » (additions 8, 12, leçons L5, L11, L12). Garder un seul mot.

### P1-7. L'écran de démarrage prêt n'invite pas à toucher — **gênant**

Captures : `1280-02-demarrage-pret`, `1920-02`.

Le logo « Maths CE1 » est joli, dans l'esprit BD (contour sombre, ombre, reflets), l'étoile et les bulles sont mignonnes. Mais une fois la barre pleine, rien ne change, sinon que la barre est jaune : aucun doigt, aucun bouton, aucun son (la voix ne peut pas parler avant le premier toucher). L'enfant qui ne lit pas attend devant une barre pleine. La ligne « 2026 js2c version cd09edd » est du charabia technique au premier plan.

Proposition : quand tout est chargé, remplacer la barre par un gros bouton rond « jouer » (le triangle de l'accueil) qui pulse, ou une main qui tapote ; mettre la version en tout petit dans un coin, ou seulement dans l'espace parent.

### P1-8. L'accueil ne dit pas quoi toucher, et ses boutons n'ont pas de nom — **gênant (parent)**

Captures : `1280-03-accueil-bienvenue`, `1920-03-accueil-bienvenue`.

La voix dit « Ah, te voilà ! On part à l'aventure ? » mais pas « touche le triangle ». Six boutons sans légende : triangle, carrés de couleur, livre ouvert, corail, livre au coquillage, et le carré à la **pieuvre** en bas à gauche. Le parent ne sait pas en dix secondes ce qui sépare « livre ouvert » et « livre au coquillage », ni à quoi sert la pieuvre. Sur la capture 1280, aucune bulle n'est affichée (la 1920 en a une) : la phrase de bienvenue n'a peut-être pas été capturée au bon moment, ou elle ne s'affiche pas toujours ; à vérifier.

Proposition : que la phrase de bienvenue finisse par l'action (« Touche le triangle pour commencer ! ») et que le triangle pulse ; que toucher une fois un bouton de l'accueil dise son nom (même règle « une fois pour entendre, une fois pour lancer ») ; un tout petit mot sous chaque bouton pour le parent ne gênerait pas l'enfant.

### P1-9. La pieuvre est encore partout alors que la mascotte est le capitaine — **gênant**

Captures : `1280-03` (carré à la pieuvre), `1280-29` et `1280-50`, `60-*`, `61`, `62` (pieuvre au début de la frise, bouton rond à la pieuvre à droite du pavé).

L'enfant voit un capitaine qui parle, et une pieuvre sur un bouton : qui est la pieuvre ? Que fait ce bouton ? Le parent non plus ne sait pas. Sur les écrans d'exercice, trois boutons ronds sans explication entourent le pavé : la pieuvre (à droite), le coquillage bleu (à gauche, pas toujours présent), la vague avec une flèche (`60-clavier-additions` seulement).

Proposition : remplacer la pieuvre par un pictogramme qui dit ce que fait le bouton (ou par le visage du capitaine si c'est « aide ») ; faire dire son rôle à chaque bouton au premier toucher.

### P1-10. On ne sait pas qu'on peut toucher la mascotte pour réécouter, et le bouton « réécouter » n'est pas toujours là — **gênant**

Captures : `1280-50-toucher-mascotte` (pas de haut-parleur), `1280-60-*` (pas de haut-parleur), `1280-62-calcul-guide-consigne` (haut-parleur en haut à droite), `1280-51-recif-reecouter` (haut-parleur).

Toucher le capitaine fonctionne (`50` : la bulle réécrit « 3 plus combien, ça fait 10 ? »). Mais rien ne le montre : pas d'oreille, pas de petite onde près de sa tête. La phrase `relanceAide` (« Touche-moi pour réécouter la consigne ») ne vient qu'après un temps d'attente. Le bouton haut-parleur apparaît sur certains écrans (62, 51) et pas sur d'autres (50, 60) : l'enfant ne peut pas s'y fier.

Proposition : un petit pictogramme d'oreille ou d'onde collé à la mascotte, sur tous les écrans où elle est ; le bouton haut-parleur soit partout, soit nulle part. Dire la phrase « touche-moi pour réécouter » une fois au premier exercice de la séance, pas seulement en relance.

### P1-11. La queue de la bulle, quand la bulle est en bas, est un trait noir sans remplissage — **cosmétique**

Captures : `1280-2-ligne-bas-droite-12`, `1280-2-additions-bas-droite-12` (agrandissement : entre la tuile 12 et la bulle).

La pointe de la bulle devient un fin trait noir hérissé qui traverse les rochers ; on dirait une algue morte ou une rayure, pas une bulle de BD. Ailleurs (bulle à droite ou en haut), la queue est blanche, bordée, bien faite.

Proposition : dessiner la queue comme ailleurs (triangle blanc contour épais), ou raccourcir la bulle pour que la queue ait de la place.

### P1-12. La bulle cache le compteur d'étoiles — **cosmétique**

Captures : `1280-2-ligne-haut-droite-4`, `1280-2-additions-haut-droite-4`, `1280-2-multiplication-haut-droite-4` (l'étoile disparaît, il reste « 0 »).

L'enfant qui veut des étoiles voit son compteur mangé pendant la description. Proposition : compter le compteur d'étoiles parmi les zones que la bulle ne doit pas couvrir.

### P1-13. La dictée : après la réponse, l'écran est vide — **gênant**

Capture : `1280-60-clavier-dictée`.

Le capitaine dit « Super ! », mais il n'y a plus ni ardoise, ni nombre écrit, ni pavé : la mer vide. L'enfant ne voit pas le nombre qu'elle a écrit au moment où on la félicite (alors que `parcours-resultat.json` dit qu'aucune ardoise n'était vide). Pour les autres exercices, la réponse reste affichée (« 0 + 3 = 3 », « 35 + 10 = 45 » entouré).

Proposition : garder l'ardoise de la dictée (le nombre entendu, écrit en chiffres) affichée pendant le « bravo », comme dans les autres exercices ; vérifier à quel moment la capture a été prise.

### P1-14. Le défi : une grosse bulle vide et deux points jaunes inexpliqués — **cosmétique** (à vérifier)

Capture : `1280-61-clavier-defi`.

À gauche du pavé, une grosse boule transparente vide ; au milieu de l'eau, deux petits ronds jaunes, que l'on retrouve aussi dans la frise. Rien ne dit ce que c'est (des réponses à trouver ? un minuteur ?). Proposition : que la voix explique l'objet au premier défi ; sinon le rendre plus parlant.

### P1-15. La frise du haut peut compter une cinquantaine de perles — **cosmétique** (à vérifier)

Captures : `1280-50`, `60-clavier-calcul`, `60-clavier-dictée`, `60-clavier-multiplication`, `62`.

Une frise de 55 perles minuscules : impossible de voir où l'on en est, et décourageant (« il en reste combien ? »). Dans `60-clavier-additions` et `61`, la frise est courte et lisible. Si c'est l'entraînement libre, montrer plutôt une frise courte par tranche, ou pas de frise.

### P1-16. Le menu des leçons : numéros dans le désordre, tuiles collées au bord — **cosmétique**

Captures : `1280-30` à `33`.

Rangée 1 : 1, 2, 3, **10** ; rangée 2 : 4, 5, 6, 11, 12 ; rangée 3 : 7, 8, 9 ; rangée 4 : 13, 14, +, ×. Une enfant qui connaît ses nombres cherche le 10 après le 9. Le regroupement par thème (pictogrammes à gauche de chaque rangée) se comprend pour un adulte, pas pour elle. Les tuiles 12 et × touchent presque le bord droit (une dizaine de pixels de marge) et le bouton « livre » se serre entre les tuiles 10 et 12.

Proposition : renuméroter les leçons dans l'ordre d'affichage, ou ne pas afficher de numéro (seulement l'image) ; reprendre la marge à droite.

### P1-17. Le récif sans carte : une mer vide — **cosmétique**

Captures : `1280-51-recif-reecouter`, `1920-51`.

Pour une enfant qui n'a pas encore de carte, le récif est le décor seul, sans rien à regarder ni à espérer. Proposition (à décider par le parent) : montrer en ombre les premières créatures à gagner, et une phrase « Gagne des cartes pour remplir ton récif ! ».

### P1-18. Ce qui marche bien

- Le style BD au marqueur est tenu partout : tuiles, bulles, pavé, décor ; rien de coupé, rien d'illisible dans les tuiles de niveaux (les plus petits nombres des voiliers restent lisibles à 1280).
- Le cadre orange « choisi » et le halo jaune « conseillé » se distinguent d'un coup d'œil (voir toutefois P1-3 et P1-4).
- La bulle écrit la phrase au fur et à mesure (mots gris puis noirs) : utile au parent qui suit.
- Le clavier : la réponse tapée s'écrit à la place du « ? » ; aucune ardoise vide relevée par le parcours ; touches de 85 px environ, bien au-dessus des 64 px.
- Les phrases `bienvenueLancement`, `recompenseBeaucoup`, `choixExercice`, `relanceAide` sont courtes, chaleureuses et justes.

---

## Phase 2 — ce que demande la spécification

Lu : `docs/LOTS.md`, section 6 ; `docs/SPEC.md`, sections 2 (« L'accueil », « Pendant la séance »), 3 (« L'écran « choisir » », « Les leçons »), 4 (le sélecteur, pour la capture 29), 9 (« Le toucher ») et 11 (mascotte, bulle, voix). Les constats de la phase 1 ne sont pas réécrits : ceux que la spécification explique ou change sont repris ci-dessous (« revu »).

### P2-1. La bulle cache plus de tuiles que la spécification ne l'accepte, et la spécification se contredit — **gênant** (reprend P1-1)

- Le lot demande que la bulle ne cache « ni la tuile ni ses voisines immédiates si possible ». La section 3 de `SPEC.md` l'écrit ainsi : elle « évite si possible les tuiles voisines, puis les autres (sur ces écrans pleins de tuiles, elle en cache souvent une ou deux le temps de la phrase) ».
- Mais la section 11 dit : la bulle « ne couvre jamais ce que l'enfant touche pour répondre (boutons, pavé, bulles-réponses, **tuiles**…) ». Les deux phrases ne disent pas la même chose ; il faut en garder une.
- Sur les captures, on va au-delà de « une ou deux » : six tuiles touchées dans `2-voiliers-haut-droite-4`, quatre dans `2-calcul-haut-droite-3`, `30-lecons-L1`, `32-lecons-table-multiplication` et `41-libre-niveau`. Des voisines immédiates sont cachées alors qu'il y a de la place ailleurs. Par exemple, dans `2-calcul-haut-droite-3`, la bulle couvre les tuiles 1, 2, 5 et 6 alors que toute la bande au-dessus des plaques (y 0 à 180, entre la petite bulle de l'exercice et le petit livre) est libre.
- Le contrôle de la recette (`parcours-resultat.json`) ne relève que le rectangle de la bulle et celui de la tuile choisie. Il ne voit donc pas ce défaut.

Proposition : pour chaque place candidate, compter les tuiles couvertes et choisir celle qui en couvre le moins (zéro, puis aucune voisine, puis une seule). Essayer aussi les lignes de 500 px, comme pour la bulle des exercices. Ajouter au parcours un relevé « tuiles couvertes » qui échoue au-delà de deux. Aligner la section 11 sur la section 3, ou l'inverse (choix du parent).

### P2-2. Le bouton « réécouter » est encore affiché pendant la consigne d'un calcul guidé — **gênant** (à vérifier)

Capture : `1280-62-calcul-guide-consigne` : le haut-parleur est en haut à droite alors que la mascotte est à l'écran.

Le lot (point 7) et la section 2 disent : plus de bouton « réécouter » en haut à droite, sauf là où la mascotte n'est pas (le récif). Cette capture n'a pas été faite par le parcours principal (`tests/e2e/correctifs-tablette.mjs` ne produit pas de « 62 », et elle est datée 12 s après les autres). Elle vient peut-être d'un autre parcours ou d'un état laissé par une visite du récif. Le parcours ne vérifie l'absence du haut-parleur qu'à l'accueil.

Ce que vit l'enfant, si c'est réel : deux façons de réécouter sur un écran, aucune sur un autre. Et si l'application croit la mascotte cachée, toucher sa tête ne fait plus rien.

Proposition : vérifier « pas de haut-parleur, tête touchable » sur chaque type d'écran d'exercice (consigne, calcul guidé, correction, défi), et en particulier après une visite du récif depuis la pause.

### P2-3. Le sélecteur de difficulté ne suit pas la règle des deux touchers — **gênant** (revu, remplace P1-3)

La section 4 décrit bien ce qu'on voit : vagues, lueur sur le cran conseillé, « toucher une vague dit ce qu'elle rapporte ; une grosse coche valide ». Le jaune y veut bien dire « conseillé », comme sur les niveaux : **ma remarque sur le changement de couleur est retirée**. L'absence de maison est conforme aussi (la maison n'existe pas pendant l'accueil et le sélecteur).

Restent trois gênes :

- **Une règle différente juste après la nouvelle règle.** L'enfant vient d'apprendre « je touche une fois pour entendre, une fois pour lancer » ; ici, toucher deux fois une vague ne lance rien, il faut trouver la coche. On ne voit pas non plus de bordure corail sur la vague choisie : quand elle touche une autre vague, rien ne montre que c'est celle-là qui sera prise (à vérifier sur une capture après un toucher).
- **« Choisis ton niveau »** : elle vient de choisir « le niveau 4 » ; le mot « niveau » désigne maintenant autre chose. Proposer : « Choisis ta vague. »
- **Pas de retour possible.** Un double toucher trop rapide sur une tuile (P2-4) lance le sélecteur, sans maison. Sans toucher, la séance du jour part toute seule au bout de 15 s, sur un niveau que personne n'a choisi.

Proposition : sur le sélecteur, appliquer la même règle (premier toucher : la vague est cernée de corail et dite ; second toucher : on part), garder la coche pour le parent ; dire « vague » plutôt que « niveau » ; ajouter une petite bulle « retour » vers l'écran des niveaux, au moins quand on vient de « choisir ».

### P2-4. Rien n'empêche un double toucher de tout lancer d'un coup — **gênant**

La section 9 ignore un second toucher en moins de 150 ms, mais seulement pour le pavé. Pour les tuiles, rien n'est prévu. L'enfant « touche parfois deux fois de suite » : un double toucher rapide sélectionne puis lance aussitôt, avant que la mascotte ait dit un mot. C'est exactement ce que la règle des deux touchers voulait éviter.

Proposition : n'accepter le second toucher qu'après un court délai (environ 0,6 s), ou après que le nom de la tuile a été dit. L'écrire dans la section 3, et ajouter le cas au parcours de recette.

### P2-5. L'écran de démarrage : conforme, mais l'invitation au toucher est trop discrète — **gênant** (revu, remplace P1-7)

Le lot et la section 2 demandent le logo, la barre qui avance réellement (vérifiée : `01` à moitié, `02` pleine), et les lignes « 2026, js2c, la version » : **ces lignes sont une demande du parent ; ma remarque sur le « charabia » est retirée.** La spécification dit aussi : « quand tout est chargé, le logo invite au toucher ». Entre `01` et `02`, le logo a seulement un peu changé de taille (une pulsation, sans doute). Pour une enfant qui ne lit pas et n'entend encore rien, une pulsation du titre ne veut pas dire « touche ».

Proposition : à la fin du chargement, faire apparaître sous le logo, à la place de la barre, un doigt qui tapote, ou le triangle « jouer » de l'accueil qui pulse.

### P2-6. Les descriptions : l'exemple de la spécification porte lui-même l'ambiguïté — **gênant** (complète P1-5 et P1-6)

Le lot demande « la légende du parent, adaptée si besoin pour être dite à une enfant ». L'exemple donné en section 3, « On va d'abord jusqu'à la dizaine, puis on ajoute le reste », est la phrase ambiguë relevée en P1-6 (quelle dizaine ?). Les redites relevées en P1-5 viennent de ce que la voix dit le **nom** du niveau puis sa **description**, et les deux ont été écrits séparément : « La ligne de zéro à mille, de cent en cent » + « Chaque saut vaut cent ».

Proposition : relire chaque paire nom + description comme une seule phrase entendue ; corriger aussi l'exemple de la section 3. Après correction, prévenir le parent : les phrases changées sont à refabriquer avec `node tools\voix\publier.mjs`.

### P2-7. La pieuvre : c'est voulu pour l'instant, mais le bouton « je ne sais pas » perd son sens — **gênant** (revu, remplace P1-9)

La section 11 garde les pictogrammes de la pieuvre « pour l'instant » : le bouton « je ne sais pas » (la pieuvre qui hausse les bras), l'étape « accueil » de la frise, l'icône de l'application. C'est une question ouverte de `docs/IDEES.md`. Le carré à la pieuvre de l'accueil est donc le logo (appui long : espace parent), et le bouton rond à la pieuvre est « je ne sais pas ».

Reste que la pieuvre ne parle plus. Le geste « hausser les bras » n'est plus relié à rien de connu par l'enfant : elle ne peut pas deviner que ce bouton veut dire « je ne sais pas ». Ce lot a aussi mis un logo « Maths CE1 » au démarrage, alors que l'accueil garde la pieuvre comme logo : il y a deux logos.

Proposition : mettre la question de `IDEES.md` au prochain lot. D'ici là, faire dire « Je ne sais pas » au premier toucher de ce bouton, le jour où il apparaît pour la première fois.

### P2-8. Apprendre à toucher la mascotte : la relance de 25 s ne suffit pas — **gênant** (complète P1-10)

Le lot propose comme « petit signe » la relance de 25 s (« Touche-moi pour réécouter la consigne. »), et c'est ce qui est fait. Mais la relance ne vient qu'après 25 s sans toucher pendant une question. Une enfant qui touche vite, ou qui répond au hasard pour aller plus vite, n'attend jamais 25 s : elle n'entendra jamais la phrase. La spécification ne prévoit rien d'autre.

Proposition : dire la phrase une fois, à la première consigne de la première séance après la mise à jour (et la noter comme dite), en plus de la relance ; ou poser un petit signe visuel (une onde près de la tête) les premières fois.

### P2-9. Le défi : la grosse bulle est le chronomètre prévu — **cosmétique** (revu, remplace P1-14)

La section 2 prévoit au défi « une bulle qui se vide, sans chiffre de secondes » : c'est la grosse boule de `61`, pleine d'eau. **Constat retiré** pour la bulle. Les deux petits ronds jaunes au milieu de l'eau restent inexpliqués (ils répètent peut-être ceux de la frise).

### P2-10. La frise : conforme, mais illisible quand l'étape est longue — **cosmétique** (revu, complète P1-15)

La section 2 prévoit une rangée de bulles qui se remplissent, sans chiffre. Rien ne limite leur nombre : une notion du jour réglée sur la durée en donne une cinquantaine (`50`, `60-clavier-calcul`…), trop petites pour se voir remplir. Proposition : plafonner le nombre de bulles affichées (par exemple 10, chacune valant plusieurs questions).

### P2-11. Le menu des leçons : l'ordre est voulu — **cosmétique** (revu, remplace P1-16)

La section 3 range les leçons par exercice (1, 2, 3, 10 ; 4, 5, 6, 11, 12 ; 7, 8, 9 ; 13, 14 et les tables) : c'est un choix validé. **La remarque sur l'ordre est retirée**, mais il serait bon de le signaler au parent : une enfant qui cherche « la 10 » après la 9 ne la trouvera pas. Restent la marge droite très étroite (tuiles 12 et × à une douzaine de pixels du bord) et les tuiles posées sur le corail. La section 3 demande « aucune tuile posée sur la mascotte ou les algues ». Aux écrans de niveaux de la ligne et des additions, les tuiles du bas (10, 11, 13) sont posées sur les algues et les rochers du lagon.

### P2-12. La bulle cache le compteur d'étoiles : la liste des choses protégées l'oublie — **cosmétique** (complète P1-12)

La section 3 protège la tuile, la maison, le retour, le petit livre et la tête de la mascotte, pas le compteur d'étoiles. Proposition : l'ajouter à la liste.

### P2-13. La recette ne vérifie pas assez — **gênant** (pour la suite)

Ce que demande le lot pour la recette est fait : choix en deux touchers sur chaque écran de choix, bulles aux quatre coins, écran de démarrage, clavier dans chaque exercice à pavé. Trois vérifications manquent, et elles auraient trouvé les défauts ci-dessus :

- toutes les tuiles et tous les boutons que couvre la bulle (P2-1, P2-12) ;
- l'absence du haut-parleur et la tête touchable sur chaque écran d'exercice, pas seulement à l'accueil (P2-2) ;
- la présence de la bulle de bienvenue à l'accueil (`1280-03` n'en a pas, `1920-03` en a une) et la présence de l'ardoise ou du nombre écrit pendant le « bravo » de la dictée (`60-clavier-dictée` montre une mer vide ; le relevé `vides: []` ne voit pas une ardoise **absente**) (P1-8, P1-13).

### Ce que la phase 2 confirme

- Bordure de sélection « corail épaisse cernée d'encre » et halo « doré, épais, animé » : conformes et bien distincts (P1-4, sauf l'explication du halo pour le parent, qui reste à faire).
- La bulle part d'un coin de la tuile, reste dans l'écran, ne cache jamais la tuile choisie, ni la maison, ni la petite bulle de l'exercice, ni le petit livre, ni la tête de la mascotte : vérifié sur toutes les captures.
- Toucher ailleurs désélectionne (`12`) ; le petit livre de la légende est présent sur chaque écran de niveaux et sur le menu des leçons.
- Toucher la mascotte refait la consigne et la bulle (`50`) ; le haut-parleur revient dans le récif (`51`).
- Le clavier : les 23 réponses tapées du relevé sont arrivées telles quelles (additions, calculs guidés, calcul rapide, multiplication, dictée). Le défi, que la section 9 compte parmi les exercices à pavé, a sa capture (`61`) mais n'apparaît pas dans le relevé `clavier` de `parcours-resultat.json` : à ajouter au relevé.
- Aucune ardoise vide relevée.

## Traitement par la session du lot

Les constats bloquants : aucun (P1-1 n'est pas bloquant : la bulle laisse passer le doigt, `pointer-events: none` ; le parcours du lot le vérifie maintenant, une tuile sous la bulle se touche et prend la sélection). Les constats gênants :

- **P1-1, P2-1 (la bulle cache des tuiles)** : corrigé en partie. La bulle d'une tuile est plus petite (texte de 26 px au lieu de 30), les descriptions sont raccourcies, et quand aucune place contre la tuile n'est libre, la bulle s'en éloigne (jusqu'à 210 px, la pointe allongée) : aux voiliers, niveau 4, elle ne cache plus aucune tuile (elle en cachait six). Sur les écrans les plus pleins (la ligne, 13 tuiles ; le calcul), elle en cache encore deux ou trois le temps de la phrase : il n'y a pas de place libre assez grande. La spécification est corrigée (section 11 : l'exception de la bulle d'une tuile ; section 3 : « quelques-unes »). Le compteur d'étoiles est évité si possible (P1-12, P2-12).
- **P1-2, P2-4 (second toucher)** : la tuile sélectionnée se balance doucement, comme la bulle « jouer », pour inviter au second toucher ; un second toucher moins de 0,3 s après le premier (un doigt qui rebondit, un double toucher très rapide) ne lance rien.
- **P1-3, P2-3 (le sélecteur de difficulté)** : laissé tel quel. Il n'est pas un écran de choix de la fiche (exercices, niveaux, leçons) ; à soumettre au parent (`docs/IDEES.md`).
- **P1-4 (le halo du conseillé)** : laissé tel quel (inchangé par le lot ; la légende et le guide du parent l'expliquent).
- **P1-5, P1-6, P2-6 (descriptions)** : corrigé. Raccourcies et sans redite du nom (voiliers 5 à 8, ligne 9 et 12, multiplication 5 et 9, leçon 1, additions 9) ; « tu devines » remplacé par « place le nombre à peu près » ; « jusqu'à la dizaine » par « jusqu'au nombre rond » ; « après cent » par « avec de grands nombres » ; « cadre de dix » par « boîte de dix ». Les tables ne redisent plus la consigne de la table. « Unités » et « dizaines » restent : ce sont les mots de la classe de CE1.
- **P1-7, P2-5 (invitation au toucher du démarrage)** : laissé tel quel (le logo se balance, la barre pleine brille) ; à revoir avec l'enfant.
- **P1-8 (l'accueil)** : la bulle de bienvenue est bien dite (la capture 1280 a été prise après la fin d'une phrase accélérée, en mode de test) ; le reste est inchangé par le lot.
- **P1-9, P2-7 (la pieuvre)** : hors du lot (question ouverte, `docs/IDEES.md`).
- **P1-10, P2-8 (toucher la mascotte)** : corrigé. Tant que l'enfant n'a jamais touché la mascotte, la bienvenue du lancement ajoute « Pour réécouter, touche-moi ! ». Le bouton « réécouter » ne reste que dans le récif (règle de la fiche).
- **P1-11 (la pointe de la bulle en bas)** : corrigé : la bulle se tient à 26 px de la tuile et la pointe vise 16 px à l'intérieur du coin (trop courte, elle se tordait).
- **P1-13 (la dictée, écran vide)** : corrigé : l'ardoise de la dictée (« ? ») est là dès le début de chaque question.
- **P2-2 (« réécouter » pendant un calcul guidé)** : la capture 62 avait été prise avant le point 7 ; elle est refaite (plus de bouton, et la bulle entre l'ardoise et le pavé). Le parcours du lot vérifie maintenant que la consigne d'un calcul guidé ne couvre pas l'ardoise.
- **P2-13 (la recette)** : le parcours vérifie en plus la tuile sous la bulle et la consigne des calculs guidés ; le défi est dans le relevé du clavier (capture 61).
- **Cosmétiques P1-14 à P1-17, P2-9 à P2-11** : inchangés par le lot (comportements antérieurs) ; notés pour le parent.
