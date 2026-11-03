# Relecture indépendante : réserves d'étoiles et étoiles arc-en-ciel

Relecteur extérieur au lot. J'ai regardé les 16 captures en 1280 × 800 (avec des agrandissements des réserves, des coches et des tuiles), en lisant `SEQUENCES.md` à côté. J'ai lu `docs/SPEC.md`, section 10, seulement après la phase 1. Pour comprendre deux captures (06 et 15), j'ai aussi regardé à quel moment `tests/e2e/reserves.mjs` les prend.

## Phase 1 : ce que voient et comprennent l'enfant et le parent

### L'enfant

**Combien d'étoiles ? (01, 04, 12, 14, 16)** Elle lit les nombres sans peine, et les deux étoiles se distinguent bien : l'arc-en-ciel a des couleurs vives, le diamant est pâle et taillé, avec un halo. Le nombre est écrit sous l'étoile, alors qu'il est à droite pour l'étoile de mer ; cela se lit quand même. Une réserve vide disparaît, et l'étoile de diamant prend alors la première place (04, puis 12 et 14 sans diamant). Une enfant qui retient les places peut prendre l'étoile de diamant de 04 pour « l'étoile de couleur ». Ce n'est pas grave, mais à surveiller.

**À quoi elles servent ? (02, 03)** On touche l'étoile, la mascotte répond, et la bulle ne couvre pas la réserve : c'est simple et bien vu. La phrase arc-en-ciel est assez courte. La phrase du diamant est longue (25 mots) et pose une condition, « quand tu auras toutes les créatures du grand large », qui parle d'une zone que l'enfant n'a jamais vue et dont elle ne connaît pas le nom. Les mots changent d'un écran à l'autre : « les nouvelles zones » (02, 10), « un nouveau coin du récif » (14), « le récif de corail » (15). À 7 ans, rien n'indique que ces trois mots désignent la même chose.

**Pendant une question (05)** Les réserves ne réagissent pas, mais elles ont le même aspect que d'habitude. L'enfant qui les touche n'obtient rien. Ce n'est pas gênant : c'est aussi le cas du compteur d'étoiles de mer.

**La boutique, deux coches (07)** La consigne « Touche la coche de l'étoile que tu veux donner » est claire. Mais les deux coches sont pareilles, deux coches vertes. Seule une petite étoile d'environ 28 px dans leur coin les distingue, et celle de l'arc-en-ciel déborde sur la tuile voisine. Une enfant qui touche vite choisira au hasard. Personne ne lui dit quel choix est le plus avantageux. Ici, l'étoile arc-en-ciel lui laisse ses 150 étoiles de mer pour acheter une créature nouvelle. La rangée de trois boutons couvre en partie l'anémone et le concombre de mer : si son doigt tombe à côté, il touche la tuile du dessous, ce qui annule et choisit une autre créature.

**Le vol de l'étoile (08)** On voit bien l'étoile partir : la réserve passe de 4 à 3 et l'étoile arrive sur le crabe. Mais le prix « ✦150★ » reste affiché sur la tuile pendant le vol. On peut croire qu'on a aussi payé 150 étoiles.

**Le crabe brille (09)** On entend « C'est le crabe ! Oh ! **Elle** est brillante ! » : le masculin et le féminin ne vont pas ensemble, et l'enfant comme le parent l'entendent. Sur l'image, la tuile ne change presque pas : trois petites étincelles, et le prix a disparu.

**L'étoile « gardée » (10, 12)** C'est le point le plus faible. On montre l'étoile gardée par une étoile pâlie et un cadenas dans le coin de la tuile. Agrandie, l'étoile est coupée par le cadre corail de la sélection, elle chevauche les antennes de la crevette, et le cadenas, d'environ 12 px, ne se lit pas. La phrase « Tes étoiles arc-en-ciel sont gardées pour les nouvelles zones » emploie deux mots abstraits pour l'enfant. Rien à l'écran ne relie ces étoiles gardées aux trois onglets à cadenas du haut, pourtant tout proches. En 10, le compteur affiche 3 et elle ne peut en utiliser aucune ; en 07, il affiche 4 et une seule peut servir. Rien ne le montre. La bulle de 10 et 12 tient en 4 phrases (35 mots) : c'est long pour 7 ans. Elle ne couvre ni la croix ni la coche.

**Pas assez d'étoiles de mer (11)** La voix dit « Pour le faire briller : 150 étoiles, ou une étoile arc-en-ciel. Si tu es d'accord, touche la coche verte. » Or elle n'a que 60 étoiles. On lui propose un prix qu'elle ne peut pas payer, et « la coche verte » ne dit pas ce qu'elle donne. Seule la petite étoile du coin l'indique.

**Les prix ont changé (13)** C'est clair. L'annonce passe, puis vient la consigne habituelle.

**La récompense (14 à 16)** En 14, la pastille du bilan montre une **étoile de mer jaune et « 2 »** au moment où la voix dit « 2 étoiles arc-en-ciel ! », et les étoiles arc-en-ciel passent devant cette pastille. L'enfant voit une étoile jaune et entend « arc-en-ciel » : c'est le contraire de ce qu'il faut pour apprendre à les distinguer. La voix ajoute « Un jour, elles t'ouvriront un nouveau coin du récif » et, juste après (15), une zone s'ouvre avec l'une de ces étoiles. « Un jour » veut donc dire tout de suite. En 15, le dos assombri de la zone est déjà là alors que la bulle écrit encore « Un jour… » : la contradiction se voit aussi. En 16, la réserve est juste : 1 + 2 − 1 = 2.

### Le parent assis à côté

- **« C'est quoi cette étoile ? »** Il répond en dix secondes s'il pense à la toucher, et la phrase de 02 suffit. Rien ne l'invite à la toucher, mais c'est la règle de toute l'application.
- **« Pourquoi je ne peux pas l'utiliser ? »** Il entend « gardées pour les nouvelles zones ». Il comprend qu'elles sont réservées, sans savoir combien ni jusqu'à quand. La règle (une étoile gardée par zone fermée) ne se devine pas, même avec les trois cadenas sous les yeux. À l'accueil (02), la mascotte vient de dire « Tu as 4 étoiles… elles font briller tes créatures », et dans la boutique, trois de ces quatre étoiles sont gardées. Le parent peut croire à une erreur.
- **« Qu'est-ce que je choisis ? »** devant les deux coches (07) : il n'a aucun élément pour répondre.
- En 14, il ne saura pas non plus expliquer pourquoi l'étoile affichée est jaune.

## Phase 2 : écarts avec `docs/SPEC.md`, section 10

**Ce qui est conforme**
- Place et ordre des réserves, nombre écrit dessous, réserve à 0 cachée, diamant à la première place quand il est seul (01, 04, 12).
- Les deux phrases des réserves, l'arc-en-ciel « au moins une à dépenser » et le diamant « pas encore » (02, 03). La bulle évite la réserve touchée.
- Les réserves sont inertes pendant une question et répondent dans l'accueil en pause, d'après les vérifications du parcours (05, 06).
- Dans la boutique : l'étoile arc-en-ciel dans le coin de la tuile touchée, pâlie avec un cadenas quand toutes sont gardées (07, 10, 12). Les phrases à deux coches, sans assez d'étoiles de mer, et « toutes gardées » sont celles de la spécification (07, 10, 11, 12). La rangée de coches est à droite du départ de la bulle et la pointe n'en touche aucune. La réserve descend d'un cran quand on fait briller et le compteur d'étoiles de mer ne bouge pas (08).
- « Les prix de la boutique ont changé ! », puis les prix du niveau 3 : 70 et 175 (13).
- Les étoiles arc-en-ciel volent jusqu'à leur réserve à la récompense, et la réserve est juste à la fin (14, 16).

**Écarts et manques**
1. **11 : une seule coche, mais avec l'étoile dans son coin.** La spécification ne met cette étoile que « quand les deux coches sont là ». L'écart aide l'enfant : il faut l'écrire dans la spécification plutôt que le retirer.
2. **09 : « Oh ! Elle est brillante ! » après « C'est le crabe ! ».** C'est la phrase de la spécification (« Faire briller », « Brillantes »). La capture la suit, mais la spécification elle-même accorde mal. Elle donne pourtant déjà le genre ailleurs (`cartes.json`, `genre`).
3. **15 : la capture ne montre pas ce que dit la spécification.** La spécification prévoit que l'étoile parte de la réserve, que le compteur descende d'un cran, que l'étoile vole jusqu'au dos et que la voix annonce la zone. La capture est prise 300 ms après l'apparition du dos (`reserves.mjs`, ligne 202) : la réserve affiche encore 3, aucune étoile ne vole et la bulle écrit la phrase précédente. Le moment demandé n'est donc pas prouvé.
4. **06 : pas de bulle sur la capture.** Le parcours tourne avec la voix rapide, et la phrase est déjà finie quand la capture est prise. La vérification passe dans le parcours, mais l'image ne prouve rien.
5. **Situations prévues par la spécification et jamais capturées :**
   - pour les réserves : arc-en-ciel « toutes gardées » (« Elles ouvriront les prochaines zones »), « toutes les zones ouvertes », « la zone en cours est complète », diamant « à la prochaine récompense » et « toutes les légendaires » ;
   - dans la boutique : le singulier « Ton étoile arc-en-ciel est gardée pour la prochaine zone » ;
   - à la récompense : la phrase « Et une étoile arc-en-ciel ! » quand toutes les zones sont ouvertes, et le vol de l'étoile de diamant vers sa réserve puis vers le coquillage ;
   - dans l'étal : les réserves sur leur plaque claire, par temps d'orage.
6. **La spécification ne prévoit pas** le cas où une zone s'ouvre dans la même récompense que l'annonce des étoiles arc-en-ciel (le « Un jour » de 14 et 15), ni le cas où la pastille du bilan reste affichée pendant le vol des étoiles arc-en-ciel (14).

## Constats

| N° | Gravité | Capture | Constat | Proposition |
| --- | --- | --- | --- | --- |
| 1 | gênant | 14 | La pastille du bilan montre une étoile de mer jaune et « 2 » pendant que la voix dit « 2 étoiles arc-en-ciel ! ». Les étoiles arc-en-ciel passent devant cette pastille. | Pendant le pas des étoiles arc-en-ciel, retirer la pastille du bilan, ou lui donner l'étoile arc-en-ciel et le nombre gagné, pour que les étoiles partent d'elle. L'écrire dans la spécification (« Ordre de la récompense »). |
| 2 | gênant | 14, 15 | « Un jour, elles t'ouvriront un nouveau coin du récif », puis une zone s'ouvre tout de suite avec l'une de ces étoiles. Le dos de la zone apparaît pendant que la bulle écrit encore « Un jour ». | Quand une ouverture suit dans la même récompense, dire seulement « 2 étoiles arc-en-ciel ! » (ou « … L'une va ouvrir un nouveau coin du récif ! »), et attendre la fin de la phrase pour montrer le dos. Ajouter ce cas à la spécification. Phrase nouvelle : à fabriquer par le parent. |
| 3 | gênant | 11 | Avec 60 étoiles, la voix propose quand même « 150 étoiles, ou une étoile arc-en-ciel » puis « touche la coche verte » : elle propose un prix impossible, et on ne sait pas ce que la coche fait donner. | Sans assez d'étoiles de mer : « Pour le faire briller : une étoile arc-en-ciel. Si tu es d'accord, touche la coche verte. » Mettre à jour la spécification (tableau « déjà dans le récif ») et prévenir le parent pour la voix. |
| 4 | gênant | 07 | Les deux coches vertes sont identiques et seule une étoile d'environ 28 px les distingue. Celle de l'arc-en-ciel déborde sur la tuile voisine. Ni l'enfant ni le parent ne savent laquelle choisir. | Agrandir l'étoile de chaque coche (au moins 44 px, posée dans la coche, sans déborder), ou remplacer la coche par l'étoile elle-même sur un rond vert. Demander au parent s'il veut un conseil dit par la mascotte, par exemple « L'étoile arc-en-ciel garde tes étoiles de mer pour acheter » : c'est un choix pédagogique, à ne pas décider seul. |
| 5 | gênant | 02, 07, 10, 12 | Le mot « gardée » n'a aucune traduction visuelle. La réserve affiche 4 (07) ou 3 (10) sans montrer combien sont utilisables, et rien ne relie les étoiles gardées aux trois onglets à cadenas. En 10, le parent ne peut pas expliquer « pourquoi je ne peux pas l'utiliser ». | Quand la mascotte dit « gardées pour les nouvelles zones », faire montrer par la flèche les onglets à cadenas, ou poser une petite étoile arc-en-ciel sur chaque cadenas, ce qui donne la règle « une par zone fermée » d'un coup d'œil. Ajouter peut-être à la phrase « Il en faut une pour ouvrir chaque nouvelle zone. » (à proposer au parent). |
| 6 | gênant | 10, 12 | L'étoile pâlie et son cadenas, dans le coin de la tuile, sont coupés par le cadre de la sélection et chevauchent les antennes de la crevette. Le cadenas, d'environ 12 px, ne se lit pas. | Poser l'étoile entièrement dans la tuile, à au moins 40 px, avec un cadenas lisible. La contrôler sur un agrandissement, comme le demande la craft bar. |
| 7 | gênant | 09 | « C'est le crabe ! Oh ! Elle est brillante ! » : le féminin ne va pas avec « le crabe ». Le défaut vient du texte de la spécification. | Accorder avec `genre` (« Oh ! Il est brillant ! »), ou employer une phrase sans genre (« Oh ! Il brille ! » ou « Regarde comme il brille ! »). Corriger la spécification. Phrases nouvelles : à fabriquer par le parent. |
| 8 | cosmétique | 08 | Pendant le vol de l'étoile arc-en-ciel, « ✦150★ » reste écrit sur la tuile : on peut croire qu'on a aussi payé 150 étoiles. | Effacer le prix dès que la coche arc-en-ciel est touchée, ou le remplacer par l'étoile arc-en-ciel. |
| 9 | cosmétique | 09 | La créature qui brille se distingue à peine sur l'image : trois petites étincelles. | Vérifier que le reflet irisé passe bien à l'arrivée (une gerbe plus visible au moment de « Oh ! … brillant ! »), sur une vidéo ou une série de captures. |
| 10 | cosmétique | 02, 03, 14, 15 | Trois mots pour la même chose : « zones », « coin du récif », « récif de corail ». La phrase du diamant (25 mots) parle du « grand large », que l'enfant ne connaît pas. | Choisir un seul mot pour l'enfant, par exemple « un nouveau coin du récif », et raccourcir la phrase du diamant (« Tu as 2 étoiles de diamant. Plus tard, elles t'offriront des créatures légendaires ! »). À valider par le parent : voix à refabriquer. |
| 11 | cosmétique | 10, 12 | La bulle tient en 4 phrases (35 mots) et couvre une rangée et demie de tuiles. Elle ne couvre ni la coche ni la croix. | Raccourcir, par exemple sans « Elle est déjà dans ton récif. » quand on parle de briller, ou en coupant la phrase en deux bulles. À décider avec le parent. |
| 12 | cosmétique | 07, 11 | La rangée de trois boutons couvre l'anémone et le concombre de mer. Un toucher à côté annule et choisit la tuile du dessous. | Élargir la zone tactile invisible des coches de quelques pixels, ou ignorer pendant un court instant le toucher sur une tuile qui se trouve sous la rangée. |
| 13 | cosmétique | 01, 04, 12 | L'étoile de diamant prend la place de l'arc-en-ciel quand celle-ci est à 0. Le nombre est dessous, alors qu'il est à droite pour l'étoile de mer. C'est conforme à la décision du parent. | À garder. À reconsidérer seulement si l'enfant confond les deux étoiles. |
| 14 | cosmétique | 11 | Une seule coche porte l'étoile dans son coin, alors que la spécification ne la prévoit qu'avec deux coches. L'écart aide l'enfant. | Garder le comportement et écrire dans la spécification que l'étoile est portée « dès qu'une étoile arc-en-ciel est en jeu ». |
| 15 | cosmétique (recette) | 15 | La capture est prise avant que l'étoile ne parte de la réserve (qui affiche encore 3, sans étoile en vol, avec la bulle précédente). Le moment demandé n'est pas prouvé. | Prendre la capture pendant le vol de l'étoile depuis la réserve (`.etoile-vol` après l'apparition du dos), puis une autre à l'annonce de la zone. |
| 16 | cosmétique (recette) | 06 | Pas de bulle sur la capture, parce que la voix rapide a déjà fini. L'image ne montre pas que la réserve répond dans l'accueil en pause. | Prendre la capture tant que la bulle est montrée (attendre `bulle.shown`), ou avec la voix à vitesse réelle pour ce seul cas. |
| 17 | cosmétique (recette) | aucune | Plusieurs états de la spécification ne sont pas capturés : réserve arc-en-ciel « toutes gardées », « toutes les zones ouvertes », « zone complète » ; diamant « à la prochaine récompense » et « toutes les légendaires » ; le singulier « Ton étoile arc-en-ciel est gardée pour la prochaine zone » ; « Et une étoile arc-en-ciel ! » ; l'étoile de diamant qui vole vers sa réserve puis vers le coquillage ; les réserves sur leur plaque dans l'étal par temps d'orage. | Ajouter ces captures à `tests/e2e/reserves.mjs` et leurs phrases à `SEQUENCES.md`. |

Aucun constat bloquant : l'enfant ne reste jamais coincée et aucune étoile n'est perdue. Les constats 1 à 6 touchent pourtant ce que le lot veut faire comprendre (à quoi servent les étoiles arc-en-ciel, et pourquoi certaines sont gardées). Il faut les traiter avant la fusion, ou les soumettre explicitement au parent.

---

## Traitement des constats (la session du lot, le 3 novembre 2026)

| Constat | Gravité | Traitement |
| --- | --- | --- |
| 1. Le bilan (étoile de mer jaune) pendant « 2 étoiles arc-en-ciel ! » | gênant | **Corrigé** : le bilan s'efface quand les étoiles arc-en-ciel apparaissent (`screens.js`, `bonuses`). |
| 2. « Un jour, elles t'ouvriront… », puis une zone s'ouvre aussitôt | gênant | **Corrigé** sans phrase nouvelle : quand une zone s'ouvre à la même récompense, la phrase s'arrête à « 2 étoiles arc-en-ciel ! » (une phrase qui existe). Le dos de la zone vient après la phrase (elle est attendue). |
| 3. « 150 étoiles, ou une étoile arc-en-ciel » avec 60 étoiles | gênant | **Corrigé** : « Pour le faire briller : une étoile arc-en-ciel. Si tu es d'accord, touche la coche verte. » (2 phrases nouvelles, masculin et féminin). |
| 4. Les deux coches se distinguent mal | gênant | **Corrigé** : l'étoile de chaque coche passe d'environ 28 à environ 50 px. La question d'un conseil de la mascotte (laquelle choisir) est laissée au parent (demande de fusion). |
| 5. Rien ne relie les étoiles gardées aux zones fermées | gênant | **Corrigé** sans phrase nouvelle : sur l'onglet de chaque zone fermée, l'étoile arc-en-ciel qui lui est gardée. La phrase « Il en faut une pour ouvrir chaque nouvelle zone. » est proposée au parent (demande de fusion). |
| 6. L'étoile pâlie et son cadenas coupés par le cadre | gênant | **Corrigé** : posés dans la tuile, plus grands (cadenas environ 40 px). |
| 7. « C'est le crabe ! Oh ! Elle est brillante ! » | gênant | **Reste, à décider par le parent** : cette phrase existe depuis le lot « La boutique du récif », pour toutes les brillantes (coquillages, achats) ; « Elle » renvoie à « la créature ». L'accorder demanderait des phrases nouvelles partout où elle est dite : question posée dans la demande de fusion. |
| 8. Le prix reste écrit pendant le vol | cosmétique | **Corrigé** : la tuile quittée est toujours redessinée. |
| 9, 11, 12, 13 | cosmétique | Restent (ce qui existait avant le lot, ou la décision du parent). |
| 10. « zones », « coin du récif » | cosmétique | Reste : à décider par le parent (demande de fusion). |
| 14. L'étoile sur la coche seule | cosmétique | Gardé, écrit dans `docs/SPEC.md`. |
| 15, 16. Les captures 15 et 06 | cosmétique | **Corrigé** : prises pendant le vol et pendant la bulle. |
| 17. Des états sans capture | cosmétique | En partie : les phrases de chaque état sont vérifiées par les tests unitaires (`tests/unit/reserves.test.mjs`) ; les captures de l'étal par temps d'orage restent à faire. |
