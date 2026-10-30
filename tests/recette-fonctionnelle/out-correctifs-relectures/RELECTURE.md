# Relecture indépendante du lot « Correctifs des relectures » (points R8 et R9)

**Méthode.** Étape 1 : j'ai regardé les 38 captures puis lu les séquences simulées (SYNTHESE.md, `neuve/`, `mois/additions-famille-3.md`) en jouant l'enfant de 7 ans, puis le parent pas technicien, sans rien lire d'autre. Étape 2 : j'ai lu `docs/SPEC.md` (section 2 sur les galets, 7 quater, 8, et « La bulle » de la section 11) et noté à part les écarts avec la spécification.

Pour éviter la confusion avec les points R8 et R9 du lot, mes constats sont numérotés R1 à R16, et les points du lot sont appelés « le point R8 du lot » et « le point R9 du lot ».

---

## Étape 1 : ce que l'enfant voit et entend, ce que le parent comprend

### R1 — gênant (enfant) — L'étiquette de valeur arrive sans sa pièce

**Captures** : `r8-s5e-menu-L15.jpg`, `r8-s5e-pause-L18.jpg`, `r8-petit-smartphone-menu-L15.jpg`.

**Ce qui ne va pas.** Sur la tablette de l'enfant (L15, depuis le menu), une étiquette « 2 € » est posée seule au milieu de la soucoupe vide. La pièce de 2 € est encore en haut, sur la glace, et elle n'a pas d'étiquette. Dans L18 depuis la pause, les étiquettes « 1 € », « 50 c », « 20 c » et « 10 c » flottent au-dessus de la glace, et « 50 c » est seule dans la soucoupe, alors que les pièces sont encore dans la poche du portefeuille. Sur petit smartphone (L15, depuis le menu), c'est pareil : les étiquettes « 2 € », « 1 € », « 1 € » sont en place, les pièces sont dans le portefeuille. Une enfant qui lit à peine voit un « 2 € » sans pièce, et une pièce sans « 2 € ». Elle ne peut pas relier le nombre à l'objet, alors que c'est justement ce que la leçon apprend.

**Proposition.** L'étiquette est attachée à sa pièce ou à son billet : elle se déplace avec l'objet, ou elle n'apparaît qu'une fois l'objet arrivé. Ajouter au parcours un contrôle simple : jamais d'étiquette visible sans son objet sous elle.

### R2 — gênant (enfant) — Pas de bulle quand l'argent sort dans L15 et L16

**Captures** : toutes les `r8-*-L15.jpg` et `r8-*-L16.jpg`.

**Ce qui ne va pas.** Sur les 12 captures de L15 et L16, une seule bulle est visible (`r8-petit-smartphone-pause-L15.jpg`, « Une pièce de 2 euros… », une phrase plus loin, et elle s'efface déjà sur `r8-petit-smartphone-menu-L15.jpg`). Dans L16, aucune capture n'a de bulle, même quand le billet de 10 € vient d'arriver dans la soucoupe pendant le compte « 10… » (`r8-s5e-menu-L16.jpg`, `r8-petit-smartphone-menu-L16.jpg`). Dans L18, la bulle est là sur les 8 captures. L'enfant entend la voix, mais au moment où il se passe le plus de choses à l'écran, la phrase n'est pas écrite. Ces captures ne permettent pas de dire que le point R8 du lot marche pour L15 et L16.

**Proposition.** Refaire les captures de L15 et L16 pendant la phrase qui sort l'argent (« Voici des pièces et des billets d'euros. », « Voici ton portefeuille. »). Si la bulle manque vraiment, voir R13 : la place à droite de la tête est prise par les billets, et le ciel, libre, n'est pas essayé.

### R3 — gênant (enfant) — À 1920, trois captures sur six montrent un portefeuille fantôme et pas d'argent

**Captures** : `r8-1920-menu-L15.jpg`, `r8-1920-menu-L16.jpg`, `r8-1920-pause-L15.jpg`.

**Ce qui ne va pas.** Le portefeuille n'est qu'une silhouette transparente sur le bois, sans argent ni étiquette ; on attendait « l'argent qui vient de sortir ». Sur `r8-1920-pause-L16.jpg`, les billets sortent encore du portefeuille. Soit la capture a été prise trop tôt (pendant l'ouverture du portefeuille), soit le portefeuille reste à moitié transparent trop longtemps à cette taille. Sur une seule image, on ne peut pas trancher.

**Proposition.** Prendre la capture sur un signal de la scène (l'argent posé) plutôt qu'après un délai. Si le portefeuille reste vraiment transparent à 1920, c'est un défaut à corriger.

### R4 — gênant (enfant) — Trop de prix à l'écran pendant une leçon sur les pièces

**Captures** : `r8-s5e-menu-L15.jpg`, `r8-s5e-menu-L18.jpg`, `r8-petit-smartphone-pause-L15.jpg`.

**Ce qui ne va pas.** Pendant L15 et L18, huit à dix ardoises de prix restent sur l'étal (de « 2 € » à « 17 € »), en plus des étiquettes blanches de l'argent. Les pièces se posent sur certaines ardoises et en coupent la moitié (« 6 » sans son €, « 12 » à moitié caché, « 2 6 »). Quand la voix dit « Une pièce de 2 euros… », l'enfant voit parfois deux ou trois « 2 € » à l'écran (l'ardoise des maquereaux dans `r8-s5e-menu-L18.jpg`, l'étiquette, la pièce). Une enfant qui « repère très bien » les nombres risque de regarder la mauvaise chose.

**Proposition.** Pendant les leçons L15 et L18 (sans achat), atténuer les ardoises ou les cacher. Ou, au moins, ne pas poser l'argent sur une ardoise. Voir aussi R14 : la spécification accepte qu'en exercice l'argent couvre les colonnes du milieu.

### R5 — cosmétique (enfant) — Dans la soucoupe, l'étiquette cache la pièce, qui est plus petite

**Captures** : `r8-petit-smartphone-pause-L15.jpg`, `r8-petit-smartphone-menu-L18.jpg`, `r8-petit-smartphone-pause-L18.jpg`.

**Ce qui ne va pas.** La pièce de 2 € (ou de 50 c) posée dans la soucoupe est nettement plus petite que les mêmes pièces au-dessus de la glace, et l'étiquette « 2 € » / « 50 c » en couvre la moitié basse. C'est la pièce dont parle la voix, et c'est celle qu'on voit le moins bien.

**Proposition.** Garder la même taille de pièce dans la soucoupe, et poser l'étiquette juste sous la pièce, sans la toucher.

### R6 — cosmétique (enfant) — Le triangle « jouer » / « continuer » est réparé ; restent deux points rouges aux pointes, visibles seulement très agrandis

**Captures** : `r9-avant-jouer-agrandi.jpg`, `r9-apres-jouer-agrandi.jpg`, `r9-*-jouer.jpg`, `r9-*-continuer.jpg`, `r9-*-accueil.jpg`.

**Ce qui ne va pas.** Avant, il y avait des encoches claires et des éclats rouges et blancs aux trois pointes. Après, les pointes sont arrondies et le contour est propre, aux quatre tailles. C'est réussi. Sur l'agrandissement, il reste un point rouge sur le contour, à la pointe de droite et à la pointe du bas. À taille réelle, on ne le voit pas.

**Proposition.** Rien d'urgent. Si l'atelier repasse sur ce dessin, faire passer le contour par-dessus le remplissage aux pointes.

### R7 — cosmétique (enfant) — Le bouton « Parents » touche presque le galet « jouer »

**Captures** : `r9-s5e-accueil.jpg`, `r9-1920-accueil.jpg`, `r9-petit-smartphone-accueil.jpg`.

**Ce qui ne va pas.** Il y a très peu d'espace entre le bouton « Parents » et le bord bas gauche du galet « jouer ». Une enfant qui touche vite et « parfois à côté » touchera le cadenas. Comme il faut un appui long, ce n'est pas dangereux, mais l'anneau qui se remplit peut l'intriguer.

**Proposition.** Garder un écart d'au moins une demi-zone tactile (environ 32 px) entre les deux, ou décaler un peu la rangée de galets vers la droite.

### R8 — gênant (parent) — La ligne « Récompense et fin » des séances d'un mois ne se comprend pas

**Passage** : `mois/additions-famille-3.md`, séances « appliquée », lignes 68, 268, 477, 684.

**Ce qui ne va pas.** La ligne enchaîne : « étoile arc-en-ciel (niveau franchi) ; fin de la notion : la famille 7 (mélange) est acquise : ce n'est pas la famille de la séance… ; fin de la notion : la famille 7 (mélange) : sans effet (un mélange prend les formes à trou des familles de chacun de ses faits) ; défi : … ; +10★ ; +5★ ; boutique… ». Le parent ne sait pas quel niveau a été franchi (l'en-tête dit « cran à la fin : plus facile », donc rien n'a changé ?). La famille 7 est d'abord « acquise », puis « sans effet », ce qui semble se contredire. Elle passe d'« inconnue » (le point de départ n'ouvre que les familles 1 à 6) à « acquise » sans jamais « s'ouvrir », alors que l'enfant « réelle » la voit « s'ouvrir ». Et rien n'est dit sur la famille 3, qui était pourtant l'exercice du jour. Le parent ne peut pas répondre en dix secondes à « qu'est-ce que j'ai gagné ? ».

**Proposition.** Une phrase par événement, avec son nom : « Étoile arc-en-ciel : la famille 7 (mélange) est acquise. » Dire ce que devient la famille du jour (« famille 3 : encore en cours, 6 faits sur 9 bien sus »). Retirer « sans effet », qui ne sert que le moteur, ou le mettre dans une note technique à part.

### R9 — gênant (parent) — « Les formes à trou s'ouvrent » alors que la séance en montrait déjà

**Passage** : `neuve/additions-famille-3.md`, lignes 165, 210, 306, 434, 479.

**Ce qui ne va pas.** À la fin, on lit « les formes à trou s'ouvrent pour la famille 3 (amis de 10) : la moitié de ses faits sont bien sus (ses formes à elle suivent déjà le tableau des crans ; cela compte pour le mélange) ». Or tout le tableau au-dessus montre déjà des formes à trou (« 9 + ? = 10 »). La parenthèse emploie trois mots du moteur (« formes à trou », « tableau des crans », « mélange »). Autre question : l'enfant « appliquée » au cran « plus facile » fait 100 % et n'a pas cette ligne. Le parent ne sait pas pourquoi.

**Proposition.** Dire ce qui change pour l'enfant, et quand : par exemple « À partir de la prochaine séance, les calculs à trou de la famille 3 viennent aussi dans l'échauffement. » Ajouter, quand c'est le cas : « (pas au cran plus facile : …) ».

### R10 — gênant (parent) — « +5★ (série) » n'est pas expliqué, et l'enfant qui répond au hasard le reçoit

**Passage** : `mois/additions-famille-3.md`, toutes les lignes « Récompense et fin ».

**Ce qui ne va pas.** L'enfant « pressée », qui a 2 à 8 % de bonnes réponses, reçoit « +5★ (série) ». On comprend « série de bonnes réponses », ce qui paraît absurde. C'est sans doute une série de jours (elle vient de la sauvegarde d'un mois), mais rien ne le dit. Chez l'enfant pressée, « fin » et « série » font 15 étoiles sur 18 à 27 : le lecteur doit le savoir pour juger que le hasard ne paie pas.

**Proposition.** Écrire « +5★ (série de jours) » ou le vrai nom de la règle. Dans la synthèse, séparer les étoiles des réponses des étoiles « fin » et « série ».

### R11 — cosmétique (parent) — Au cran « plus facile », une bonne réponse sur deux n'a pas d'étoile, sans explication

**Passage** : `neuve/additions-famille-3.md`, première séance (lignes 19-44) ; `mois/…`, séance « réelle », lignes 10 à 12 du tableau.

**Ce qui ne va pas.** Dans le tableau, « +1★ » ne revient qu'une ligne sur deux. L'en-tête dit seulement « au multiplicateur du cran », sans donner sa valeur. Chez l'enfant « réelle », trois lignes de suite ont « +1★ (erreur corrigée) », ce qui casse le rythme sans explication.

**Proposition.** Ajouter une phrase à l'en-tête : « cran plus facile : une étoile toutes les deux bonnes réponses ; conseillé : une par bonne réponse ; … ; une erreur corrigée compte comme… ».

### R12 — cosmétique (parent) — Des questions « famille 1 » ou « famille 2 » dans « famille 3 (amis de 10) »

**Passage** : les deux fichiers, colonne « forme affichée ».

**Ce qui ne va pas.** Dans une séance titrée « famille 3 (amis de 10) », « 9 + ? = 10 » est marqué « famille 1 » et « 5 + ? = 10 » « famille 2 ». Le parent en déduit que « amis de 10 » n'est pas la famille 3, ou que l'exercice se trompe.

**Proposition.** Une ligne d'en-tête : « la notion "amis de 10" fait faire 10 avec les faits de toutes les familles ouvertes ; entre parenthèses, la famille du fait ».

### R13 — cosmétique (parent) — Petites maladresses d'écriture dans les en-têtes

**Passage** : en-têtes des deux fichiers.

**Ce qui ne va pas.**
- « durée simulée 7.4 min » : un point à l'anglaise, et une espace en fin de ligne. En français : « 7,4 min » ou « 7 min 24 s ».
- « pas encore (moins de 5 séances terminées, ou trop peu de faits bien sus) » : deux parenthèses l'une dans l'autre, et on ne sait pas laquelle des deux raisons s'applique.
- « 7 bonne(s) réponse(s) ».
- Le titre « un mois (tools/sauvegarde-test.mjs reel 2 4) » : un nom de fichier et des arguments.
- « (temps de base) » sur l'échauffement : on ne comprend pas ce que c'est.
- « [aide ligne] » à l'intérieur d'une phrase entre guillemets, comme si la voix le disait (j'ai vérifié : ce n'est pas dans `app/content/`, c'est un repère de la simulation).
- « plus longue suite prévisible : 2 » : deux nombres font toujours une « suite ». Cette mesure n'a de sens qu'à partir de 3.

**Proposition.** Corriger ces points dans `b-sequences.mjs`. Remplacer « [aide ligne] » par « (la tortue montre la ligne) » hors des guillemets. N'afficher la suite prévisible qu'à partir de 3.

---

## Étape 2 : écarts avec la spécification

### R14 — gênant (enfant) — Le point R8 du lot ne se voit pas dans L15 et L16 : la bulle renonce au lieu de se poser

**Captures** : comme R2, et `r8-s5e-menu-L18.jpg` pour comparer.

**Ce qui ne va pas.** La section 11 (« La bulle », point R8 du lot) dit : « la bulle se pose au début de la phrase, l'argent arrive après », et elle ne cache pas l'argent sorti. Dans L18, c'est bien ce qu'on voit : la bulle est à droite de la tête, au-dessus de la glace, et les pièces arrivent dessous. Dans L15 et L16, les billets montent jusqu'à la hauteur de la bouche (`r8-s5e-pause-L16.jpg` : billets vers y 330 à 470 sur 1000). La place « à droite de la tête » est prise, « sous la tête » est interdite à l'étal (section 7 quater), et la règle « sans place, pas de bulle » s'applique. Le résultat respecte la lettre (rien n'est caché), mais pas le but du point R8 : l'enfant n'a plus de bulle dans les deux leçons où l'argent sort en grand. Pourtant, le ciel est vide entre la tête et les boutons (environ 900 × 200 px sur la tablette).

**Proposition.** Ajouter pour l'étal une place « dans le ciel, au-dessus de l'argent », pointe vers la bouche, avant d'abandonner. Puis refaire les captures de L15 et L16 pendant « Voici des pièces et des billets d'euros. » et « 10… ».

### R15 — gênant (enfant) — Les étiquettes ne sont pas « sous chaque pièce et billet sorti », et on ne sait pas quand elles s'affichent

**Captures** : comme R1 ; et `r8-s5e-pause-L15.jpg`, `r8-1280-*-L15.jpg` (aucune étiquette), à comparer avec `r8-s5e-menu-L15.jpg` (des étiquettes).

**Ce qui ne va pas.** Selon la section 7 quater, au cran « plus facile », la valeur est écrite « sous chaque pièce et billet sorti ». Dans les leçons, une étiquette sans sa pièce (R1) contredit cette règle. De plus, les étiquettes apparaissent dans L15 et L18, jamais dans L16. Dans L15, on les voit sur certaines captures et pas sur d'autres, au même moment de la leçon. La section 8 ne dit rien des étiquettes dans les leçons.

**Proposition.** Écrire dans la section 8 si les leçons de la monnaie montrent les étiquettes (et lesquelles). Puis appliquer la règle de R1 : l'étiquette suit son objet.

### R16 — cosmétique (enfant) — La bulle de L18 n'écrit que la première phrase, et ses lignes ne sont pas équilibrées

**Captures** : `r8-s5e-menu-L18.jpg`, `r8-1280-menu-L18.jpg`, `r8-1920-pause-L18.jpg`.

**Ce qui ne va pas.** La voix dit « Voici des pièces de centimes. 100 centimes, ça fait 1 euro. ». La bulle n'écrit que « Voici des pièces de centimes. » : c'est la règle « sans place, la première phrase seulement » (section 11), mais c'est justement la seconde phrase qui contient la notion. Et la bulle coupe « Voici des pièces de / centimes. », un mot seul sur la seconde ligne, alors que la section 11 demande des lignes « équilibrées ». « Voici des pièces / de centimes. » serait équilibré.

**Proposition.** Avec la place dans le ciel de R14, la phrase entière tiendrait. Revoir le découpage des lignes pour les phrases courtes.

### R4 revu — de gênant à cosmétique, et question pour le parent

La section 7 quater dit que l'argent sorti couvre les deux colonnes du milieu de l'étal (choix fait pour l'exercice, où l'article allumé est sur un bord). Les ardoises à moitié cachées sont donc prévues. Reste une question pour le parent : pendant les leçons L15 et L18, où rien n'est à acheter, faut-il garder les ardoises de prix ?

### Ce qui est conforme

- Le triangle de « jouer » et de « continuer » a des pointes arrondies, sans encoches claires, aux quatre tailles (section 2, point R9 du lot). « Continuer » utilise le même galet et le même triangle que « jouer », comme le demande la section 2.
- Le bouton « Parents » est en bas à gauche, et les cinq galets ont chacun une forme différente.
- Les leçons montrent seulement « rejouer » et « passer » (avec la maison et le compteur, communs à tout l'écran) (section 8).
- Lancées depuis la pause, les leçons ont une scène vivante (les bateaux sont à des places différentes d'une capture à l'autre).
- Le contenu suit la section 8 : un portefeuille 10, 5, 2, 1, 1 € puis la pièce de 2 € dans la soucoupe (L15) ; des sardines allumées à 17 € et le billet de 10 € posé en premier (L16) ; les pièces de 10, 20 et 50 c, et « deux pièces de 50 c font 1 € » (L18).
- Dans L18, la bulle ne couvre ni l'argent, ni le portefeuille, ni la soucoupe, et sa pointe vise la bouche (sections 7 quater et 11).

Je n'ai pas vu de capture de l'accueil en pause entier (seulement le triangle agrandi) : je ne peux pas juger la flèche posée sur « continuer » ni la place de la bulle à cet endroit.
