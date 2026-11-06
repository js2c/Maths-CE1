# Les phrases où « plus » n'est pas l'addition (lot « Correctifs du 5 novembre », point 4)

Tirées de l'inventaire de la voix (`tools/voix/inventaire.mjs`) le 5 novembre 2026 : toutes les phrases qui contiennent « plus », sauf celles où il est l'addition (« 5 plus 3 », « 3 + ? »). Pour chacune, ce qui est donné à la voix quand ce n'est pas le texte du jeu (« ⇒ voix »). À écouter par le parent ; une phrase mal dite se corrige par une écriture particulière (`tools/voix/ecritures.json`, `docs/VOIX.md`).

Deux familles :

- **« plus » gardé** : la voix reçoit « plus » (« le plus grand », « plus … plus », « ne … plus », « plus facile », « de plus que ») ; le risque est qu'elle dise « plusse ». C'était le défaut de « Plus c'est dur, plus tu gagnes d'étoiles ! », corrigé par l'écriture « Plu c'est dur, plu… ».
- **« de plus » ou « en plus » en fin de groupe → « plusse »** : la règle de `tools/voix/lettres.mjs` (« trois de plus » se dit « plusse »). À écouter aussi : la voix peut en faire trop.

Aussi trouvé en dressant cette liste et corrigé : « Combien de plus, combien de moins ? » (leçon L19) était donné à la voix « … combien de moins combien » (la règle du « ? » d'un calcul) ; il ne l'est plus (`tools/voix/lettres.mjs`, test dans `tests/unit/voix.test.mjs`) ; la phrase est à refabriquer.

## « plus » gardé
- Tape le plus de bonnes réponses possible avant que la bulle se vide.
- Plus c'est dur, plus tu gagnes d'étoiles !  ⇒ voix : Plu c'est dur, plu tu gagnes d'étoiles !
- Plus facile : une demi-étoile par bonne réponse.
- Plus dur : une étoile et demie par bonne réponse !
- Très dur : deux fois plus d'étoiles !
- Plus facile.
- Plus dur !
- Commence par le plus gros billet qui ne dépasse pas le prix.
- Du plus gros au plus petit, en comptant.
- Donne un peu plus que le prix, mais pas une pièce de trop.
- On paie juste, du plus gros au plus petit.
- Les bouées sont rangées du plus petit au plus grand.
- Il est plus grand que 10 : il passe après. (et 98 autres, nombre changé)  ⇒ voix : Il est plus grand que dix : il passe après.
- Il est plus petit que 10 : il passe avant. (et 98 autres, nombre changé)  ⇒ voix : Il est plus petit que dix : il passe avant.
- Il est plus grand que cette bouée : il passe après.
- Il est plus petit que cette bouée : il passe avant.
- Regarde : 36 est plus grand que 30, et plus petit que 40. (et 3 autres, nombre changé)  ⇒ voix : Regarde : trente-six est plus grand que trente, et plus petit que quarante.
- Regarde : 698 est tout près de 700, mais il est plus petit. (et 2 autres, nombre changé)  ⇒ voix : Regarde : six cent quatre-vingt-dix-huit est tout près de sept cents, mais il est plus petit.
- Regarde : 426 est tout près de 425, mais il est plus grand.  ⇒ voix : Regarde : quatre cent vingt-six est tout près de quatre cent vingt-cinq, mais il est plus grand.
- Puis, de plus près : 347 est entre 340 et 350.  ⇒ voix : Puis, de plus près : trois cent quarante-sept est entre trois cent quarante et trois cent cinquante.
- Donne un peu plus : je te rendrai la monnaie.
- Groupes et partages, plus grands.
- La barre du haut, c'est le plus grand.
- Attention : « de plus » ne veut pas dire qu'il faut ajouter.
- Pour payer juste, on commence par le plus gros : 10…  ⇒ voix : Pour payer juste, on commence par le plus gros : dix…
- 2 euros 50, c'est plus cher.  ⇒ voix : deux euros cinquante, c'est plus cher.
- Quand il grandit, il déménage dans une plus grande.
- Le poisson-papillon a une fausse tache en forme d'œil près de la queue : ses ennemis ne savent plus de quel côté il va partir.
- Le bénitier géant est le plus grand coquillage du monde : il peut peser aussi lourd que trois grandes personnes.
- Combien de billes as-tu de plus que ton copain ?
- Combien y a-t-il de cuillères de plus que de fourchettes ?
- Combien de tomates Papa a-t-il cueillies de plus que Maman ?
- Combien y a-t-il de filles de plus que de garçons ?
- Combien de points l'équipe bleue a-t-elle de plus que l'équipe rouge ?
- Combien de coquillages as-tu de plus que ta cousine ?
- Combien de pages as-tu lues de plus que ton cousin ?
- Combien de gâteaux les CE1 ont-ils vendus de plus que les CP ?  ⇒ voix : Combien de gâteaux les CEun ont-ils vendus de plus que les CP ?
- Combien y a-t-il de moutons de plus que de chèvres ?
- Combien y a-t-il de citrons de plus que d'oranges ?
- Combien de jetons as-tu de plus que ton copain ?
- Combien y a-t-il de sardines de plus que de dorades ?
- Tu as 3 petites voitures de plus que lui.  ⇒ voix : Tu as trois petites voitures de plus que lui.
- 5 voitures, et 3 de plus : tu en as 8.  ⇒ voix : cinq voitures, et trois de plus : tu en as huit.
- 4 crêpes, et 2 de plus : Papa en a 6.  ⇒ voix : quatre crêpes, et deux de plus : Papa en a six.
- Il y a 6 tulipes de plus que de roses.  ⇒ voix : Il y a six tulipes de plus que de roses.
- 9 roses, et 6 de plus : il y a 15 tulipes.  ⇒ voix : neuf roses, et six de plus : il y a quinze tulipes.
- 8 crayons, et 5 de plus : ta voisine en a 13.  ⇒ voix : huit crayons, et cinq de plus : ta voisine en a treize.
- 24 points, et 12 de plus : l'équipe bleue a marqué 36 points.  ⇒ voix : vingt-quatre points, et douze de plus : l'équipe bleue a marqué trente-six points.
- 40 pages, et 20 de plus : le livre des dinosaures a 60 pages.  ⇒ voix : quarante pages, et vingt de plus : le livre des dinosaures a soixante pages.
- Elle a 17 canards de plus que de poules.  ⇒ voix : Elle a dix-sept canards de plus que de poules.
- 26 poules, et 17 de plus : elle a 43 canards.  ⇒ voix : vingt-six poules, et dix-sept de plus : elle a quarante-trois canards.
- 8 enfants, et 7 de plus : 15 enfants jouent au ballon cet après-midi.  ⇒ voix : huit enfants, et sept de plus : quinze enfants jouent au ballon cet après-midi.
- Maman a planté 3 salades de plus que lui.  ⇒ voix : Maman a planté trois salades de plus que lui.
- 4 salades, et 3 de plus : Maman en a planté 7.  ⇒ voix : quatre salades, et trois de plus : Maman en a planté sept.
- Ton copain a 6 petites voitures de plus que toi.  ⇒ voix : Ton copain a six petites voitures de plus que toi.
- 7 voitures, et 6 de plus : ton copain en a 13.  ⇒ voix : sept voitures, et six de plus : ton copain en a treize.
- Combien de points ton équipe a-t-elle de plus que l'autre équipe ?

## de/en plus → « plusse »
- Et en plus, dix étoiles parce que tu as fini ta séance !  ⇒ voix : Et en plusse, dix étoiles parce que tu as fini ta séance !
- Et 5 étoiles de plus, parce que tu viens jouer souvent !  ⇒ voix : Et cinq étoiles de plusse, parce que tu viens jouer souvent !
- Et une bulle de plus !  ⇒ voix : Et une bulle de plusse !
- Combien de plus, combien de moins ?  ⇒ voix : Combien de plusse, combien de moins ?
- De plus, de moins.  ⇒ voix : De plusse, de moins.
- 5 billes, et 3 de plus, ça fait 8 billes.  ⇒ voix : cinq billes, et trois de plusse, ça fait huit billes.
- 4 œufs, et 2 de plus, ça fait 6 œufs.  ⇒ voix : quatre œufs, et deux de plusse, ça fait six œufs.
- 6 enfants, et 3 de plus, ça fait 9 enfants. (et 1 autres, nombre changé)  ⇒ voix : six enfants, et trois de plusse, ça fait neuf enfants.
- 12 cahiers, et 6 de plus, ça fait 18 cahiers.  ⇒ voix : douze cahiers, et six de plusse, ça fait dix-huit cahiers.
- 9 salades, et 7 de plus, ça fait 16 salades.  ⇒ voix : neuf salades, et sept de plusse, ça fait seize salades.
- 8 personnes, et 5 de plus, ça fait 13 personnes. (et 1 autres, nombre changé)  ⇒ voix : huit personnes, et cinq de plusse, ça fait treize personnes.
- 45 livres, et 20 de plus, ça fait 65 livres.  ⇒ voix : quarante-cinq livres, et vingt de plusse, ça fait soixante-cinq livres.
- Tu enfiles 5 perles de plus.  ⇒ voix : Tu enfiles cinq perles de plusse.
- 24 perles, et 5 de plus, ça fait 29 perles.  ⇒ voix : vingt-quatre perles, et cinq de plusse, ça fait vingt-neuf perles.
- 17 ballons, et 8 de plus, ça fait 25 ballons.  ⇒ voix : dix-sept ballons, et huit de plusse, ça fait vingt-cinq ballons.
- 28 cartes, et 15 de plus, ça fait 43 cartes.  ⇒ voix : vingt-huit cartes, et quinze de plusse, ça fait quarante-trois cartes.
- 36 poules, et 9 de plus, ça fait 45 poules.  ⇒ voix : trente-six poules, et neuf de plusse, ça fait quarante-cinq poules.
- 2 jetons, et 6 de plus, ça fait 8 jetons.  ⇒ voix : deux jetons, et six de plusse, ça fait huit jetons.
- 2 papillons, et 5 de plus, ça fait 7 papillons.  ⇒ voix : deux papillons, et cinq de plusse, ça fait sept papillons.
- 9 cubes, et 6 de plus, ça fait 15 cubes.  ⇒ voix : neuf cubes, et six de plusse, ça fait quinze cubes.
- 12 maquereaux, et 7 de plus, ça fait 19 maquereaux.  ⇒ voix : douze maquereaux, et sept de plusse, ça fait dix-neuf maquereaux.
- 9 canards, et 8 de plus, ça fait 17 canards.  ⇒ voix : neuf canards, et huit de plusse, ça fait dix-sept canards.
- 7 billes contre 4 : tu en as 3 de plus.  ⇒ voix : sept billes contre quatre : tu en as trois de plusse.
- 9 cuillères contre 6 fourchettes : il y a 3 cuillères de plus.  ⇒ voix : neuf cuillères contre six fourchettes : il y a trois cuillères de plusse.
- 8 tomates contre 3 : Papa en a cueilli 5 de plus.  ⇒ voix : huit tomates contre trois : Papa en a cueilli cinq de plusse.
- 14 filles contre 9 garçons : il y a 5 filles de plus. (et 1 autres, nombre changé)  ⇒ voix : quatorze filles contre neuf garçons : il y a cinq filles de plusse.
- 16 points contre 11 : l'équipe bleue a 5 points de plus.  ⇒ voix : seize points contre onze : l'équipe bleue a cinq points de plusse.
- 19 coquillages contre 12 : tu en as 7 de plus.  ⇒ voix : dix-neuf coquillages contre douze : tu en as sept de plusse.
- 35 pages contre 23 : tu en as lu 12 de plus.  ⇒ voix : trente-cinq pages contre vingt-trois : tu en as lu douze de plusse.
- 48 gâteaux contre 30 : les CE1 en ont vendu 18 de plus.  ⇒ voix : quarante-huit gâteaux contre trente : les CEun en ont vendu dix-huit de plusse.
- 42 moutons contre 27 chèvres : il y a 15 moutons de plus.  ⇒ voix : quarante-deux moutons contre vingt-sept chèvres : il y a quinze moutons de plusse.
- 31 citrons contre 18 oranges : il y a 13 citrons de plus.  ⇒ voix : trente-et-un citrons contre dix-huit oranges : il y a treize citrons de plusse.
- 13 jetons contre 9 : tu en as 4 de plus.  ⇒ voix : treize jetons contre neuf : tu en as quatre de plusse.
- 17 sardines contre 8 dorades : il y a 9 sardines de plus.  ⇒ voix : dix-sept sardines contre huit dorades : il y a neuf sardines de plusse.
- Papa a 2 crêpes de plus.  ⇒ voix : Papa a deux crêpes de plusse.
- La trousse de ta voisine en contient 5 de plus.  ⇒ voix : La trousse de ta voisine en contient cinq de plusse.
- L'équipe bleue a marqué 12 points de plus.  ⇒ voix : L'équipe bleue a marqué douze points de plusse.
- Le livre des dinosaures a 20 pages de plus.  ⇒ voix : Le livre des dinosaures a vingt pages de plusse.
- Cet après-midi, il y en a 7 de plus.  ⇒ voix : Cet après-midi, il y en a sept de plusse.
- 6, et 6 de plus, ça fait 12 personnes. (et 1 autres, nombre changé)  ⇒ voix : six, et six de plusse, ça fait douze personnes.
- 27 contre 20 : ton équipe a 7 points de plus.  ⇒ voix : vingt-sept contre vingt : ton équipe a sept points de plusse.

Total : 303
