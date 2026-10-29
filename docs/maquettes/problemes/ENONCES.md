# La banque des problèmes, à relire

168 énoncés (source : `art/problemes/enonces.json`, contrôlée par `node art/problemes/verifier.mjs` ; ce fichier en est tiré par `--md`). Pour chaque énoncé : ce que dit la voix (l'énoncé, puis la question), la réponse et le calcul, puis la correction dite après une erreur. La difficulté (1 à 4) ne mesure que le calcul (règle : `art/problemes/README.md`).

| Structure | 1 | 2 | 3 | 4 | Total | Réponses différentes |
| --- | --- | --- | --- | --- | --- | --- |
| reunion · tout | 4 | 4 | 4 | 4 | 16 | 14 |
| reunion · partie | 3 | 3 | 3 | 3 | 12 | 9 |
| transformation · gain · fin | 3 | 3 | 3 | 3 | 12 | 12 |
| transformation · perte · fin | 3 | 3 | 3 | 3 | 12 | 10 |
| transformation · gain · changement | 2 | 2 | 2 | 2 | 8 | 7 |
| transformation · perte · changement | 2 | 2 | 2 | 2 | 8 | 7 |
| transformation · gain · debut | 1 | 1 | 1 | 2 | 5 | 5 |
| transformation · perte · debut | 2 | 2 | 2 | 1 | 7 | 7 |
| comparaison · ecart | 3 | 4 | 3 | 2 | 12 | 7 |
| comparaison · grand | 2 | 2 | 2 | 1 | 7 | 7 |
| comparaison · petit | 2 | 1 | 1 | 1 | 5 | 5 |
| groupes-egaux | 6 | 12 | 6 | · | 24 | 17 |
| partage · part | 4 | 4 | 4 | · | 12 | 8 |
| partage · parts | 4 | 4 | 4 | · | 12 | 5 |
| deux-etapes | · | 5 | 6 | 5 | 16 | 13 |
| **Total** | 41 | 52 | 46 | 29 | **168** | 43 |

## Réunion (deux parties et le tout)

- **reu-t-01** · 1 · cuisine · tout — Dans la corbeille, il y a 4 pommes et 3 poires. *Combien de fruits y a-t-il dans la corbeille ?* → **7** (4 + 3 = 7)  
  Correction : « 4 pommes et 3 poires, ça fait 7 fruits. »
- **reu-t-02** · 1 · chambre · tout — Sur l'étagère, il y a 5 voitures rouges et 2 voitures bleues. *Combien de voitures y a-t-il sur l'étagère ?* → **7** (5 + 2 = 7)  
  Correction : « 5 voitures et 2 voitures, ça fait 7 voitures. »
- **reu-t-03** · 1 · jardin · tout — Papa plante 6 tulipes et 3 roses. *Combien de fleurs Papa plante-t-il ?* → **9** (6 + 3 = 9)  
  Correction : « 6 tulipes et 3 roses, ça fait 9 fleurs. »
- **reu-t-04** · 1 · parc · tout — Au toboggan, il y a 3 garçons et 5 filles. *Combien d'enfants y a-t-il au toboggan ?* → **8** (3 + 5 = 8)  
  Correction : « 3 garçons et 5 filles, ça fait 8 enfants. »
- **reu-t-05** · 2 · classe · tout — Dans la classe, il y a 9 filles et 8 garçons. *Combien d'élèves y a-t-il dans la classe ?* → **17** (9 + 8 = 17)  
  Correction : « 9 filles et 8 garçons, ça fait 17 élèves. »
- **reu-t-06** · 2 · bibliotheque · tout — Sur la table, il y a 7 livres de contes et 6 bandes dessinées. *Combien de livres y a-t-il sur la table ?* → **13** (7 + 6 = 13)  
  Correction : « 7 livres de contes et 6 bandes dessinées, ça fait 13 livres. »
- **reu-t-07** · 2 · plage · tout — Dans ton seau, il y a 8 coquillages blancs et 5 coquillages roses. *Combien de coquillages y a-t-il dans ton seau ?* → **13** (8 + 5 = 13)  
  Correction : « 8 coquillages et 5 coquillages, ça fait 13 coquillages. »
- **reu-t-08** · 2 · ferme · tout — Dans le pré, il y a 7 vaches et 9 moutons. *Combien d'animaux y a-t-il dans le pré ?* → **16** (7 + 9 = 16)  
  Correction : « 7 vaches et 9 moutons, ça fait 16 animaux. »
- **reu-t-09** · 3 · bus · tout — Dans le bus, il y a 23 enfants et 4 adultes. *Combien de personnes y a-t-il dans le bus ?* → **27** (23 + 4 = 27)  
  Correction : « 23 enfants et 4 adultes, ça fait 27 personnes. »
- **reu-t-10** · 3 · marche · tout — La marchande a 32 melons et 15 pastèques. *Combien de melons et de pastèques a-t-elle en tout ?* → **47** (32 + 15 = 47)  
  Correction : « 32 melons et 15 pastèques, ça fait 47 fruits. »
- **reu-t-11** · 3 · cantine · tout — À la cantine, 40 enfants mangent au premier service et 30 enfants au deuxième service. *Combien d'enfants mangent à la cantine ?* → **70** (40 + 30 = 70)  
  Correction : « 40 enfants et 30 enfants, ça fait 70 enfants. »
- **reu-t-12** · 3 · kermesse · tout — À la kermesse, on a vendu 24 crêpes au sucre et 13 crêpes au chocolat. *Combien de crêpes a-t-on vendues ?* → **37** (24 + 13 = 37)  
  Correction : « 24 crêpes et 13 crêpes, ça fait 37 crêpes. »
- **reu-t-13** · 4 · gymnase · tout — Dans le grand sac, il y a 18 ballons de basket et 15 ballons de foot. *Combien de ballons y a-t-il dans le grand sac ?* → **33** (18 + 15 = 33)  
  Correction : « 18 ballons et 15 ballons, ça fait 33 ballons. »
- **reu-t-14** · 4 · foret · tout — Pendant la promenade, la classe a trouvé 27 pommes de pin et 16 châtaignes. *Combien de pommes de pin et de châtaignes a-t-elle trouvées en tout ?* → **43** (27 + 16 = 43)  
  Correction : « 27 pommes de pin et 16 châtaignes, ça fait 43 trésors. »
- **reu-t-15** · 4 · supermarche · tout — Au magasin, il y a 36 bouteilles d'eau et 26 bouteilles de jus. *Combien de bouteilles y a-t-il au magasin ?* → **62** (36 + 26 = 62)  
  Correction : « 36 bouteilles et 26 bouteilles, ça fait 62 bouteilles. »
- **reu-t-16** · 4 · anniversaire · tout — Pour la fête, Mamie a gonflé 19 ballons rouges et 17 ballons jaunes. *Combien de ballons Mamie a-t-elle gonflés ?* → **36** (19 + 17 = 36)  
  Correction : « 19 ballons et 17 ballons, ça fait 36 ballons. »
- **reu-p-01** · 1 · classe · partie — Il y a 9 crayons dans la trousse. 4 crayons sont rouges, les autres sont bleus. *Combien de crayons bleus y a-t-il ?* → **5** (9 − 4 = 5)  
  Correction : « 9 crayons en tout, 4 rouges : il y a 5 crayons bleus. »
- **reu-p-02** · 1 · cuisine · partie — Dans la boîte, il y a 8 œufs. 3 œufs sont blancs, les autres sont roux. *Combien d'œufs roux y a-t-il ?* → **5** (8 − 3 = 5)  
  Correction : « 8 œufs en tout, 3 blancs : il y a 5 œufs roux. »
- **reu-p-03** · 1 · parc · partie — 10 enfants jouent au parc. 6 enfants sont sur les balançoires, les autres sont dans le bac à sable. *Combien d'enfants sont dans le bac à sable ?* → **4** (10 − 6 = 4)  
  Correction : « 10 enfants en tout, 6 sur les balançoires : 4 enfants sont dans le bac à sable. »
- **reu-p-04** · 2 · jardin · partie — Dans le jardin, il y a 15 fleurs. 7 fleurs sont jaunes, les autres sont rouges. *Combien de fleurs rouges y a-t-il ?* → **8** (15 − 7 = 8)  
  Correction : « 15 fleurs en tout, 7 jaunes : il y a 8 fleurs rouges. »
- **reu-p-05** · 2 · chambre · partie — Tu as 18 peluches. 9 peluches sont sur ton lit, les autres sont dans le coffre. *Combien de peluches sont dans le coffre ?* → **9** (18 − 9 = 9)  
  Correction : « 18 peluches en tout, 9 sur le lit : 9 peluches sont dans le coffre. »
- **reu-p-06** · 2 · ferme · partie — Dans le poulailler, il y a 14 poules. 6 poules sont blanches, les autres sont noires. *Combien de poules noires y a-t-il ?* → **8** (14 − 6 = 8)  
  Correction : « 14 poules en tout, 6 blanches : il y a 8 poules noires. »
- **reu-p-07** · 3 · bibliotheque · partie — La bibliothèque a 48 livres d'animaux. 25 livres sont rangés, les autres sont sur le chariot. *Combien de livres sont sur le chariot ?* → **23** (48 − 25 = 23)  
  Correction : « 48 livres en tout, 25 rangés : 23 livres sont sur le chariot. »
- **reu-p-08** · 3 · bus · partie — Le car peut transporter 50 personnes. 30 places sont déjà prises. *Combien de places sont libres ?* → **20** (50 − 30 = 20)  
  Correction : « 50 places en tout, 30 prises : 20 places sont libres. »
- **reu-p-09** · 3 · kermesse · partie — Il y a 65 lots à gagner. 40 lots sont des peluches, les autres sont des jeux. *Combien de jeux y a-t-il ?* → **25** (65 − 40 = 25)  
  Correction : « 65 lots en tout, 40 peluches : il y a 25 jeux. »
- **reu-p-10** · 4 · classe · partie — L'école a 52 élèves. 27 élèves sont des filles. *Combien de garçons y a-t-il ?* → **25** (52 − 27 = 25)  
  Correction : « 52 élèves en tout, 27 filles : il y a 25 garçons. »
- **reu-p-11** · 4 · supermarche · partie — Dans le rayon, il y a 34 paquets de pâtes. 18 paquets sont des spaghettis, les autres sont des coquillettes. *Combien de paquets de coquillettes y a-t-il ?* → **16** (34 − 18 = 16)  
  Correction : « 34 paquets en tout, 18 de spaghettis : il y a 16 paquets de coquillettes. »
- **reu-p-12** · 4 · gymnase · partie — Il y a 41 enfants au stade. 26 enfants courent, les autres sautent. *Combien d'enfants sautent ?* → **15** (41 − 26 = 15)  
  Correction : « 41 enfants en tout, 26 qui courent : 15 enfants sautent. »

## Transformation (un état, un changement, un nouvel état)

- **tra-gf-01** · 1 · chambre · gain, fin inconnu — Tu as 5 billes. Ton copain t'en donne 3. *Combien de billes as-tu maintenant ?* → **8** (5 + 3 = 8)  
  Correction : « 5 billes, et 3 de plus, ça fait 8 billes. »
- **tra-gf-02** · 1 · ferme · gain, fin inconnu — Ce matin, il y a 4 œufs dans le nid. La poule en pond 2 autres. *Combien d'œufs y a-t-il dans le nid maintenant ?* → **6** (4 + 2 = 6)  
  Correction : « 4 œufs, et 2 de plus, ça fait 6 œufs. »
- **tra-gf-03** · 1 · parc · gain, fin inconnu — 6 enfants jouent au ballon. 3 enfants arrivent. *Combien d'enfants jouent au ballon maintenant ?* → **9** (6 + 3 = 9)  
  Correction : « 6 enfants, et 3 de plus, ça fait 9 enfants. »
- **tra-gf-04** · 2 · classe · gain, fin inconnu — La maîtresse a 12 cahiers. Elle en achète 6 autres. *Combien de cahiers a-t-elle maintenant ?* → **18** (12 + 6 = 18)  
  Correction : « 12 cahiers, et 6 de plus, ça fait 18 cahiers. »
- **tra-gf-05** · 2 · jardin · gain, fin inconnu — Papa a planté 9 salades. Il en plante encore 7. *Combien de salades y a-t-il dans le potager ?* → **16** (9 + 7 = 16)  
  Correction : « 9 salades, et 7 de plus, ça fait 16 salades. »
- **tra-gf-06** · 2 · bus · gain, fin inconnu — Il y a 8 personnes dans le bus. À l'arrêt, 5 personnes montent. *Combien de personnes y a-t-il dans le bus maintenant ?* → **13** (8 + 5 = 13)  
  Correction : « 8 personnes, et 5 de plus, ça fait 13 personnes. »
- **tra-gf-07** · 3 · bibliotheque · gain, fin inconnu — La bibliothèque a 45 livres de contes. Elle en reçoit 20 nouveaux. *Combien de livres de contes a-t-elle maintenant ?* → **65** (45 + 20 = 65)  
  Correction : « 45 livres, et 20 de plus, ça fait 65 livres. »
- **tra-gf-08** · 3 · kermesse · gain, fin inconnu — Au début de la kermesse, il y a 32 personnes. 6 personnes arrivent. *Combien de personnes y a-t-il maintenant ?* → **38** (32 + 6 = 38)  
  Correction : « 32 personnes, et 6 de plus, ça fait 38 personnes. »
- **tra-gf-09** · 3 · atelier · gain, fin inconnu — Ton collier a 24 perles. Tu enfiles 5 perles de plus. *Combien de perles a ton collier maintenant ?* → **29** (24 + 5 = 29)  
  Correction : « 24 perles, et 5 de plus, ça fait 29 perles. »
- **tra-gf-10** · 4 · cour · gain, fin inconnu — Les enfants ont rangé les 17 ballons de l'école. La maîtresse en achète 8 nouveaux. *Combien de ballons l'école a-t-elle maintenant ?* → **25** (17 + 8 = 25)  
  Correction : « 17 ballons, et 8 de plus, ça fait 25 ballons. »
- **tra-gf-11** · 4 · anniversaire · gain, fin inconnu — Tu as 28 cartes de jeu. Pour ton anniversaire, on t'en offre 15. *Combien de cartes as-tu maintenant ?* → **43** (28 + 15 = 43)  
  Correction : « 28 cartes, et 15 de plus, ça fait 43 cartes. »
- **tra-gf-12** · 4 · ferme · gain, fin inconnu — La fermière a 36 poules. Elle en achète 9. *Combien de poules a-t-elle maintenant ?* → **45** (36 + 9 = 45)  
  Correction : « 36 poules, et 9 de plus, ça fait 45 poules. »
- **tra-pf-01** · 1 · cuisine · perte, fin inconnu — Il y a 8 biscuits dans l'assiette. Tu en manges 2. *Combien de biscuits reste-t-il dans l'assiette ?* → **6** (8 − 2 = 6)  
  Correction : « 8 biscuits, 2 de moins, il en reste 6. »
- **tra-pf-02** · 1 · parc · perte, fin inconnu — 9 pigeons sont sur la pelouse. 4 pigeons s'envolent. *Combien de pigeons reste-t-il sur la pelouse ?* → **5** (9 − 4 = 5)  
  Correction : « 9 pigeons, 4 de moins, il en reste 5. »
- **tra-pf-03** · 1 · anniversaire · perte, fin inconnu — Il y a 10 bougies allumées sur le gâteau. Tu en souffles 7. *Combien de bougies sont encore allumées ?* → **3** (10 − 7 = 3)  
  Correction : « 10 bougies, 7 de moins, il en reste 3. »
- **tra-pf-04** · 2 · boulangerie · perte, fin inconnu — Le boulanger a 15 croissants. Il en vend 9. *Combien de croissants lui reste-t-il ?* → **6** (15 − 9 = 6)  
  Correction : « 15 croissants, 9 de moins, il en reste 6. »
- **tra-pf-05** · 2 · plage · perte, fin inconnu — Tu as 14 coquillages dans ton seau. Tu en perds 5 dans le sable. *Combien de coquillages te reste-t-il ?* → **9** (14 − 5 = 9)  
  Correction : « 14 coquillages, 5 de moins, il en reste 9. »
- **tra-pf-06** · 2 · animaux · perte, fin inconnu — Il y a 17 croquettes dans la gamelle du chat. Le chat en mange 8. *Combien de croquettes reste-t-il dans la gamelle ?* → **9** (17 − 8 = 9)  
  Correction : « 17 croquettes, 8 de moins, il en reste 9. »
- **tra-pf-07** · 3 · marche · perte, fin inconnu — Il y a 58 pommes sur l'étal. Le marchand en vend 30. *Combien de pommes reste-t-il sur l'étal ?* → **28** (58 − 30 = 28)  
  Correction : « 58 pommes, 30 de moins, il en reste 28. »
- **tra-pf-08** · 3 · classe · perte, fin inconnu — La boîte contient 46 craies. La maîtresse en casse 4. *Combien de craies entières reste-t-il dans la boîte ?* → **42** (46 − 4 = 42)  
  Correction : « 46 craies, 4 de moins, il en reste 42. »
- **tra-pf-09** · 3 · foret · perte, fin inconnu — Il y a 39 champignons dans le panier. Papy en jette 6 qui ne sont pas bons. *Combien de champignons reste-t-il dans le panier ?* → **33** (39 − 6 = 33)  
  Correction : « 39 champignons, 6 de moins, il en reste 33. »
- **tra-pf-10** · 4 · boulangerie · perte, fin inconnu — Le matin, le boulanger a 42 baguettes. Il en vend 25. *Combien de baguettes lui reste-t-il ?* → **17** (42 − 25 = 17)  
  Correction : « 42 baguettes, 25 de moins, il en reste 17. »
- **tra-pf-11** · 4 · bus · perte, fin inconnu — Il y a 31 personnes dans le bus. À l'arrêt, 7 personnes descendent. *Combien de personnes reste-t-il dans le bus ?* → **24** (31 − 7 = 24)  
  Correction : « 31 personnes, 7 de moins, il en reste 24. »
- **tra-pf-12** · 4 · jardin · perte, fin inconnu — Il y a 53 fraises dans le panier. Toute la famille en mange 18. *Combien de fraises reste-t-il dans le panier ?* → **35** (53 − 18 = 35)  
  Correction : « 53 fraises, 18 de moins, il en reste 35. »
- **tra-gc-01** · 1 · chambre · gain, changement inconnu — Tu as 4 autocollants. Mamie t'en donne. Maintenant, tu as 9 autocollants. *Combien d'autocollants Mamie t'a-t-elle donnés ?* → **5** (4 + 5 = 9)  
  Correction : « De 4 pour aller à 9, il faut 5 : Mamie t'a donné 5 autocollants. »
- **tra-gc-02** · 1 · parc · gain, changement inconnu — 5 canards nagent sur le lac. D'autres canards arrivent. Maintenant, il y a 8 canards. *Combien de canards sont arrivés ?* → **3** (5 + 3 = 8)  
  Correction : « De 5 pour aller à 8, il faut 3 : 3 canards sont arrivés. »
- **tra-gc-03** · 2 · ferme · gain, changement inconnu — Il y a 8 lapins dans le clapier. Des bébés lapins naissent. Maintenant, il y a 15 lapins. *Combien de bébés lapins sont nés ?* → **7** (8 + 7 = 15)  
  Correction : « De 8 pour aller à 15, il faut 7 : 7 bébés lapins sont nés. »
- **tra-gc-04** · 2 · bus · gain, changement inconnu — Il y a 9 personnes dans le bus. À l'arrêt, des personnes montent. Maintenant, il y a 14 personnes. *Combien de personnes sont montées ?* → **5** (9 + 5 = 14)  
  Correction : « De 9 pour aller à 14, il faut 5 : 5 personnes sont montées. »
- **tra-gc-05** · 3 · bibliotheque · gain, changement inconnu — Tu as lu 20 pages de ton livre. Ce soir, tu en lis encore. Maintenant, tu as lu 30 pages. *Combien de pages as-tu lues ce soir ?* → **10** (20 + 10 = 30)  
  Correction : « De 20 pour aller à 30, il faut 10 : tu as lu 10 pages ce soir. »
- **tra-gc-06** · 3 · atelier · gain, changement inconnu — Ton collier a 32 perles. Tu en ajoutes. Maintenant, il a 38 perles. *Combien de perles as-tu ajoutées ?* → **6** (32 + 6 = 38)  
  Correction : « De 32 pour aller à 38, il faut 6 : tu as ajouté 6 perles. »
- **tra-gc-07** · 4 · gymnase · gain, changement inconnu — Au début du match, ton équipe a 18 points. À la fin du match, elle a 26 points. *Combien de points ton équipe a-t-elle marqués pendant le match ?* → **8** (18 + 8 = 26)  
  Correction : « De 18 pour aller à 26, il faut 8 : ton équipe a marqué 8 points. »
- **tra-gc-08** · 4 · ferme · gain, changement inconnu — La fermière a 27 œufs. Les poules en pondent d'autres. Maintenant, elle a 41 œufs. *Combien d'œufs les poules ont-elles pondus ?* → **14** (27 + 14 = 41)  
  Correction : « De 27 pour aller à 41, il faut 14 : les poules ont pondu 14 œufs. »
- **tra-pc-01** · 1 · cuisine · perte, changement inconnu — Il y a 7 fraises dans le bol. Tu en manges. Il en reste 3. *Combien de fraises as-tu mangées ?* → **4** (7 − 4 = 3)  
  Correction : « 7 fraises, il en reste 3 : tu en as mangé 4. »
- **tra-pc-02** · 1 · classe · perte, changement inconnu — La maîtresse a 10 feutres. Elle en prête à un élève. Il lui en reste 6. *Combien de feutres a-t-elle prêtés ?* → **4** (10 − 4 = 6)  
  Correction : « 10 feutres, il en reste 6 : elle en a prêté 4. »
- **tra-pc-03** · 2 · boulangerie · perte, changement inconnu — La boulangère a 16 pains au chocolat. Elle en vend. Il lui en reste 7. *Combien de pains au chocolat a-t-elle vendus ?* → **9** (16 − 9 = 7)  
  Correction : « 16 pains au chocolat, il en reste 7 : elle en a vendu 9. »
- **tra-pc-04** · 2 · salon · perte, changement inconnu — Au début du jeu, tu as 18 jetons. Tu en perds. À la fin du jeu, tu as 11 jetons. *Combien de jetons as-tu perdus ?* → **7** (18 − 7 = 11)  
  Correction : « 18 jetons, il en reste 11 : tu en as perdu 7. »
- **tra-pc-05** · 3 · supermarche · perte, changement inconnu — Le magasin a 45 bouteilles de lait. Il en vend. Il lui en reste 23. *Combien de bouteilles de lait le magasin a-t-il vendues ?* → **22** (45 − 22 = 23)  
  Correction : « 45 bouteilles, il en reste 23 : le magasin en a vendu 22. »
- **tra-pc-06** · 3 · kermesse · perte, changement inconnu — Il y a 60 lots dans la caisse. Les enfants en gagnent. Il en reste 20. *Combien de lots les enfants ont-ils gagnés ?* → **40** (60 − 40 = 20)  
  Correction : « 60 lots, il en reste 20 : les enfants en ont gagné 40. »
- **tra-pc-07** · 4 · anniversaire · perte, changement inconnu — Il y a 35 bonbons dans le sac. Les enfants en mangent. Il en reste 17. *Combien de bonbons les enfants ont-ils mangés ?* → **18** (35 − 18 = 17)  
  Correction : « 35 bonbons, il en reste 17 : les enfants en ont mangé 18. »
- **tra-pc-08** · 4 · plage · perte, changement inconnu — Il y a 44 personnes sur la plage. Des personnes s'en vont. Il en reste 29. *Combien de personnes sont parties ?* → **15** (44 − 15 = 29)  
  Correction : « 44 personnes, il en reste 29 : 15 personnes sont parties. »
- **tra-gd-01** · 1 · chambre · gain, debut inconnu — Tu avais des billes. Tu en gagnes 3. Maintenant, tu as 8 billes. *Combien de billes avais-tu au début ?* → **5** (8 − 3 = 5)  
  Correction : « 8 billes, sans les 3 gagnées : tu avais 5 billes au début. »
- **tra-gd-02** · 2 · classe · gain, debut inconnu — La maîtresse avait des cahiers. Elle en achète 8. Maintenant, elle a 17 cahiers. *Combien de cahiers avait-elle au début ?* → **9** (17 − 8 = 9)  
  Correction : « 17 cahiers, sans les 8 achetés : elle avait 9 cahiers au début. »
- **tra-gd-03** · 3 · bibliotheque · gain, debut inconnu — La bibliothèque avait des livres. Elle en reçoit 30. Maintenant, elle a 80 livres. *Combien de livres avait-elle au début ?* → **50** (80 − 30 = 50)  
  Correction : « 80 livres, sans les 30 reçus : elle avait 50 livres au début. »
- **tra-gd-04** · 4 · ferme · gain, debut inconnu — La fermière avait des poules. Elle en achète 7. Maintenant, elle a 23 poules. *Combien de poules avait-elle au début ?* → **16** (23 − 7 = 16)  
  Correction : « 23 poules, sans les 7 achetées : elle avait 16 poules au début. »
- **tra-gd-05** · 4 · gymnase · gain, debut inconnu — Ton équipe avait des points. Elle marque encore 9 points. Maintenant, elle a 31 points. *Combien de points avait ton équipe au début ?* → **22** (31 − 9 = 22)  
  Correction : « 31 points, sans les 9 marqués : ton équipe avait 22 points au début. »
- **tra-pd-01** · 1 · cuisine · perte, debut inconnu — Il y avait des biscuits dans la boîte. Tu en manges 2. Il en reste 6. *Combien de biscuits y avait-il au début ?* → **8** (6 + 2 = 8)  
  Correction : « 6 biscuits, et les 2 mangés : il y en avait 8 au début. »
- **tra-pd-02** · 1 · parc · perte, debut inconnu — Des enfants jouent au ballon. 4 enfants s'en vont. Il reste 5 enfants. *Combien d'enfants jouaient au début ?* → **9** (5 + 4 = 9)  
  Correction : « 5 enfants, et les 4 partis : il y en avait 9 au début. »
- **tra-pd-03** · 2 · boulangerie · perte, debut inconnu — Le boulanger avait des croissants. Il en vend 7. Il lui en reste 6. *Combien de croissants avait-il au début ?* → **13** (6 + 7 = 13)  
  Correction : « 6 croissants, et les 7 vendus : il y en avait 13 au début. »
- **tra-pd-04** · 2 · animaux · perte, debut inconnu — Il y avait des croquettes dans la gamelle. Le chien en mange 9. Il en reste 5. *Combien de croquettes y avait-il au début ?* → **14** (5 + 9 = 14)  
  Correction : « 5 croquettes, et les 9 mangées : il y en avait 14 au début. »
- **tra-pd-05** · 3 · bus · perte, debut inconnu — Il y avait des personnes dans le bus. 5 personnes descendent. Il en reste 23. *Combien de personnes y avait-il au début ?* → **28** (23 + 5 = 28)  
  Correction : « 23 personnes, et les 5 descendues : il y en avait 28 au début. »
- **tra-pd-06** · 3 · atelier · perte, debut inconnu — Tu avais des perles. Tu en utilises 12 pour un bracelet. Il t'en reste 25. *Combien de perles avais-tu au début ?* → **37** (25 + 12 = 37)  
  Correction : « 25 perles, et les 12 utilisées : tu en avais 37 au début. »
- **tra-pd-07** · 4 · marche · perte, debut inconnu — Le marchand avait des melons. Il en vend 18. Il lui en reste 14. *Combien de melons avait-il au début ?* → **32** (14 + 18 = 32)  
  Correction : « 14 melons, et les 18 vendus : il y en avait 32 au début. »

## Comparaison (de plus, de moins)

- **cmp-e-01** · 1 · chambre · ecart — Tu as 7 billes. Ton copain a 4 billes. *Combien de billes as-tu de plus que ton copain ?* → **3** (7 − 4 = 3)  
  Correction : « 7 billes contre 4 : tu en as 3 de plus. »
- **cmp-e-02** · 1 · cuisine · ecart — Sur la table, il y a 9 cuillères et 6 fourchettes. *Combien y a-t-il de cuillères de plus que de fourchettes ?* → **3** (9 − 6 = 3)  
  Correction : « 9 cuillères contre 6 fourchettes : il y a 3 cuillères de plus. »
- **cmp-e-03** · 1 · jardin · ecart — Papa a cueilli 8 tomates. Maman a cueilli 3 tomates. *Combien de tomates Papa a-t-il cueillies de plus que Maman ?* → **5** (8 − 3 = 5)  
  Correction : « 8 tomates contre 3 : Papa en a cueilli 5 de plus. »
- **cmp-e-04** · 2 · classe · ecart — Dans la classe, il y a 14 filles et 9 garçons. *Combien y a-t-il de filles de plus que de garçons ?* → **5** (14 − 9 = 5)  
  Correction : « 14 filles contre 9 garçons : il y a 5 filles de plus. »
- **cmp-e-05** · 2 · gymnase · ecart — L'équipe bleue a marqué 16 points. L'équipe rouge a marqué 11 points. *Combien de points l'équipe bleue a-t-elle de plus que l'équipe rouge ?* → **5** (16 − 11 = 5)  
  Correction : « 16 points contre 11 : l'équipe bleue a 5 points de plus. »
- **cmp-e-06** · 2 · plage · ecart — Ta cousine a 12 coquillages. Tu as 19 coquillages. *Combien de coquillages as-tu de plus que ta cousine ?* → **7** (19 − 12 = 7)  
  Correction : « 19 coquillages contre 12 : tu en as 7 de plus. »
- **cmp-e-07** · 2 · salon · ecart — Tu as 15 cartes. Ton copain a 8 cartes. *Combien de cartes ton copain a-t-il de moins que toi ?* → **7** (15 − 8 = 7)  
  Correction : « 15 cartes contre 8 : ton copain en a 7 de moins. »
- **cmp-e-08** · 3 · bibliotheque · ecart — Tu as lu 35 pages. Ton cousin a lu 23 pages. *Combien de pages as-tu lues de plus que ton cousin ?* → **12** (35 − 23 = 12)  
  Correction : « 35 pages contre 23 : tu en as lu 12 de plus. »
- **cmp-e-09** · 3 · kermesse · ecart — Les CE1 ont vendu 48 gâteaux. Les CP ont vendu 30 gâteaux. *Combien de gâteaux les CE1 ont-ils vendus de plus que les CP ?* → **18** (48 − 30 = 18)  
  Correction : « 48 gâteaux contre 30 : les CE1 en ont vendu 18 de plus. »
- **cmp-e-10** · 3 · parc · ecart — Au parc, il y a 26 enfants et 14 adultes. *Combien y a-t-il d'adultes de moins que d'enfants ?* → **12** (26 − 14 = 12)  
  Correction : « 26 enfants contre 14 adultes : il y a 12 adultes de moins. »
- **cmp-e-11** · 4 · ferme · ecart — La ferme a 42 moutons et 27 chèvres. *Combien y a-t-il de moutons de plus que de chèvres ?* → **15** (42 − 27 = 15)  
  Correction : « 42 moutons contre 27 chèvres : il y a 15 moutons de plus. »
- **cmp-e-12** · 4 · marche · ecart — Le marchand a 31 citrons et 18 oranges. *Combien y a-t-il de citrons de plus que d'oranges ?* → **13** (31 − 18 = 13)  
  Correction : « 31 citrons contre 18 oranges : il y a 13 citrons de plus. »
- **cmp-g-01** · 1 · chambre · grand — Ton copain a 5 petites voitures. Tu as 3 petites voitures de plus que lui. *Combien de petites voitures as-tu ?* → **8** (5 + 3 = 8)  
  Correction : « 5 voitures, et 3 de plus : tu en as 8. »
- **cmp-g-02** · 1 · cuisine · grand — Maman a 4 crêpes dans son assiette. Papa a 2 crêpes de plus. *Combien de crêpes Papa a-t-il ?* → **6** (4 + 2 = 6)  
  Correction : « 4 crêpes, et 2 de plus : Papa en a 6. »
- **cmp-g-03** · 2 · jardin · grand — Il y a 9 roses dans le jardin. Il y a 6 tulipes de plus que de roses. *Combien de tulipes y a-t-il ?* → **15** (9 + 6 = 15)  
  Correction : « 9 roses, et 6 de plus : il y a 15 tulipes. »
- **cmp-g-04** · 2 · classe · grand — Ta trousse contient 8 crayons. La trousse de ta voisine en contient 5 de plus. *Combien de crayons y a-t-il dans la trousse de ta voisine ?* → **13** (8 + 5 = 13)  
  Correction : « 8 crayons, et 5 de plus : ta voisine en a 13. »
- **cmp-g-05** · 3 · gymnase · grand — L'équipe rouge a marqué 24 points. L'équipe bleue a marqué 12 points de plus. *Combien de points l'équipe bleue a-t-elle marqués ?* → **36** (24 + 12 = 36)  
  Correction : « 24 points, et 12 de plus : l'équipe bleue a marqué 36 points. »
- **cmp-g-06** · 3 · bibliotheque · grand — Le livre de contes a 40 pages. Le livre des dinosaures a 20 pages de plus. *Combien de pages a le livre des dinosaures ?* → **60** (40 + 20 = 60)  
  Correction : « 40 pages, et 20 de plus : le livre des dinosaures a 60 pages. »
- **cmp-g-07** · 4 · ferme · grand — La fermière a 26 poules. Elle a 17 canards de plus que de poules. *Combien de canards a-t-elle ?* → **43** (26 + 17 = 43)  
  Correction : « 26 poules, et 17 de plus : elle a 43 canards. »
- **cmp-p-01** · 1 · chambre · petit — Tu as 9 images. Ton copain a 4 images de moins que toi. *Combien d'images ton copain a-t-il ?* → **5** (9 − 4 = 5)  
  Correction : « 9 images, et 4 de moins : ton copain en a 5. »
- **cmp-p-02** · 1 · parc · petit — Il y a 10 enfants sur les balançoires. Sur le toboggan, il y a 3 enfants de moins. *Combien d'enfants y a-t-il sur le toboggan ?* → **7** (10 − 3 = 7)  
  Correction : « 10 enfants, et 3 de moins : il y en a 7 sur le toboggan. »
- **cmp-p-03** · 2 · boulangerie · petit — Le boulanger a fait 18 baguettes. Il a fait 6 pains de campagne de moins. *Combien de pains de campagne a-t-il faits ?* → **12** (18 − 6 = 12)  
  Correction : « 18 baguettes, et 6 de moins : il a fait 12 pains de campagne. »
- **cmp-p-04** · 3 · cantine · petit — À la cantine, 47 enfants ont pris de la soupe. 20 enfants de moins ont pris de la salade. *Combien d'enfants ont pris de la salade ?* → **27** (47 − 20 = 27)  
  Correction : « 47 enfants, et 20 de moins : 27 enfants ont pris de la salade. »
- **cmp-p-05** · 4 · bus · petit — Le grand car a 52 places. Le petit car a 19 places de moins. *Combien de places a le petit car ?* → **33** (52 − 19 = 33)  
  Correction : « 52 places, et 19 de moins : le petit car a 33 places. »

## Groupes égaux (sans le signe ×)

- **grp-01** · 1 · cuisine — Maman pose 3 assiettes sur la table. Dans chaque assiette, elle met 2 crêpes. *Combien de crêpes y a-t-il en tout ?* → **6** (2 + 2 + 2 = 6 (3 fois 2))  
  Correction : « 3 assiettes de 2 crêpes : 2, 4, 6. Il y a 6 crêpes. »
- **grp-02** · 1 · ferme — Il y a 3 nids dans le poulailler. Dans chaque nid, il y a 4 œufs. *Combien d'œufs y a-t-il en tout ?* → **12** (4 + 4 + 4 = 12 (3 fois 4))  
  Correction : « 3 nids de 4 œufs : 4, 8, 12. Il y a 12 œufs. »
- **grp-03** · 1 · chambre — Tu as 2 boîtes. Dans chaque boîte, il y a 5 billes. *Combien de billes as-tu en tout ?* → **10** (5 + 5 = 10 (2 fois 5))  
  Correction : « 2 boîtes de 5 billes : 5, 10. Tu as 10 billes. »
- **grp-04** · 1 · jardin — Papa remplit 3 vases. Dans chaque vase, il met 5 fleurs. *Combien de fleurs Papa a-t-il mises dans les vases ?* → **15** (5 + 5 + 5 = 15 (3 fois 5))  
  Correction : « 3 vases de 5 fleurs : 5, 10, 15. Papa a mis 15 fleurs. »
- **grp-05** · 1 · classe — Il y a 4 pots sur les tables. Dans chaque pot, il y a 3 crayons. *Combien de crayons y a-t-il en tout ?* → **12** (3 + 3 + 3 + 3 = 12 (4 fois 3))  
  Correction : « 4 pots de 3 crayons : 3, 6, 9, 12. Il y a 12 crayons. »
- **grp-06** · 1 · parc — Il y a 4 bancs au parc. Sur chaque banc, 2 personnes sont assises. *Combien de personnes sont assises sur les bancs ?* → **8** (2 + 2 + 2 + 2 = 8 (4 fois 2))  
  Correction : « 4 bancs de 2 personnes : 2, 4, 6, 8. 8 personnes sont assises. »
- **grp-07** · 2 · animaux — Papa vide 3 sachets de gourmandises dans la gamelle du chien. Chaque sachet contient 6 gourmandises. *Combien de gourmandises y a-t-il dans la gamelle ?* → **18** (6 + 6 + 6 = 18 (3 fois 6))  
  Correction : « 3 sachets de 6 gourmandises : 6, 12, 18. Il y a 18 gourmandises dans la gamelle. »
- **grp-08** · 2 · boulangerie — La boulangère remplit 5 sachets. Dans chaque sachet, elle met 4 croissants. *Combien de croissants a-t-elle mis dans les sachets ?* → **20** (4 + 4 + 4 + 4 + 4 = 20 (5 fois 4))  
  Correction : « 5 sachets de 4 croissants : 4, 8, 12, 16, 20. Elle a mis 20 croissants. »
- **grp-09** · 2 · supermarche — Maman achète 4 boîtes d'œufs. Chaque boîte contient 6 œufs. *Combien d'œufs Maman achète-t-elle ?* → **24** (6 + 6 + 6 + 6 = 24 (4 fois 6))  
  Correction : « 4 boîtes de 6 œufs : 6, 12, 18, 24. Maman achète 24 œufs. »
- **grp-10** · 2 · classe — La maîtresse fait 5 équipes. Dans chaque équipe, il y a 4 élèves. *Combien d'élèves y a-t-il dans les équipes ?* → **20** (4 + 4 + 4 + 4 + 4 = 20 (5 fois 4))  
  Correction : « 5 équipes de 4 élèves : 4, 8, 12, 16, 20. Il y a 20 élèves. »
- **grp-11** · 2 · marche — Le marchand prépare 3 paniers. Dans chaque panier, il met 10 pommes. *Combien de pommes a-t-il mises dans les paniers ?* → **30** (10 + 10 + 10 = 30 (3 fois 10))  
  Correction : « 3 paniers de 10 pommes : 10, 20, 30. Il a mis 30 pommes. »
- **grp-12** · 2 · atelier — Tu fabriques 2 colliers. Chaque collier a 9 perles. *Combien de perles as-tu utilisées ?* → **18** (9 + 9 = 18 (2 fois 9))  
  Correction : « 2 colliers de 9 perles : 9, 18. Tu as utilisé 18 perles. »
- **grp-13** · 2 · anniversaire — Il y a 6 enfants à la fête. Chaque enfant reçoit 2 ballons. *Combien de ballons faut-il en tout ?* → **12** (2 + 2 + 2 + 2 + 2 + 2 = 12 (6 fois 2))  
  Correction : « 6 enfants, 2 ballons chacun : 2, 4, 6, 8, 10, 12. Il faut 12 ballons. »
- **grp-14** · 2 · gymnase — Il y a 5 filets de ballons. Dans chaque filet, il y a 5 ballons. *Combien de ballons y a-t-il en tout ?* → **25** (5 + 5 + 5 + 5 + 5 = 25 (5 fois 5))  
  Correction : « 5 filets de 5 ballons : 5, 10, 15, 20, 25. Il y a 25 ballons. »
- **grp-15** · 2 · ferme — Il y a 7 vaches dans le pré. Chaque vache a 4 pattes. *Combien de pattes y a-t-il en tout ?* → **28** (4 + 4 + 4 + 4 + 4 + 4 + 4 = 28 (7 fois 4))  
  Correction : « 7 vaches de 4 pattes : 4, 8, 12, 16, 20, 24, 28. Il y a 28 pattes. »
- **grp-16** · 2 · jardin — Papy plante 4 rangées de salades. Dans chaque rangée, il y a 5 salades. *Combien de salades Papy a-t-il plantées ?* → **20** (5 + 5 + 5 + 5 = 20 (4 fois 5))  
  Correction : « 4 rangées de 5 salades : 5, 10, 15, 20. Papy a planté 20 salades. »
- **grp-17** · 2 · cantine — À la cantine, il y a 3 tables. Autour de chaque table, il y a 8 enfants. *Combien d'enfants y a-t-il autour des tables ?* → **24** (8 + 8 + 8 = 24 (3 fois 8))  
  Correction : « 3 tables de 8 enfants : 8, 16, 24. Il y a 24 enfants. »
- **grp-18** · 2 · bibliotheque — Chaque soir, tu lis 5 pages. Tu lis pendant 4 soirs. *Combien de pages as-tu lues ?* → **20** (5 + 5 + 5 + 5 = 20 (4 fois 5))  
  Correction : « 4 soirs de 5 pages : 5, 10, 15, 20. Tu as lu 20 pages. »
- **grp-19** · 3 · classe — La maîtresse achète 4 paquets de feutres. Chaque paquet contient 10 feutres. *Combien de feutres achète-t-elle ?* → **40** (10 + 10 + 10 + 10 = 40 (4 fois 10))  
  Correction : « 4 paquets de 10 feutres : 10, 20, 30, 40. Elle achète 40 feutres. »
- **grp-20** · 3 · supermarche — Papa achète 6 packs d'eau. Dans chaque pack, il y a 6 bouteilles. *Combien de bouteilles Papa achète-t-il ?* → **36** (6 + 6 + 6 + 6 + 6 + 6 = 36 (6 fois 6))  
  Correction : « 6 packs de 6 bouteilles : 6, 12, 18, 24, 30, 36. Papa achète 36 bouteilles. »
- **grp-21** · 3 · kermesse — Pour la kermesse, il y a 5 boîtes de gâteaux. Chaque boîte contient 10 gâteaux. *Combien de gâteaux y a-t-il ?* → **50** (10 + 10 + 10 + 10 + 10 = 50 (5 fois 10))  
  Correction : « 5 boîtes de 10 gâteaux : 10, 20, 30, 40, 50. Il y a 50 gâteaux. »
- **grp-22** · 3 · bus — Dans le petit car, il y a 8 rangées de sièges. Chaque rangée a 4 sièges. *Combien de sièges y a-t-il dans le petit car ?* → **32** (4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 = 32 (8 fois 4))  
  Correction : « 8 rangées de 4 sièges : 4, 8, 12, 16, 20, 24, 28, 32. Il y a 32 sièges. »
- **grp-23** · 3 · ferme — La fermière remplit 7 boîtes. Dans chaque boîte, elle met 6 œufs. *Combien d'œufs a-t-elle mis dans les boîtes ?* → **42** (6 + 6 + 6 + 6 + 6 + 6 + 6 = 42 (7 fois 6))  
  Correction : « 7 boîtes de 6 œufs : 6, 12, 18, 24, 30, 36, 42. Elle a mis 42 œufs. »
- **grp-24** · 3 · foret — Il y a 9 enfants dans la forêt. Chaque enfant ramasse 5 châtaignes. *Combien de châtaignes les enfants ont-ils ramassées ?* → **45** (5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 = 45 (9 fois 5))  
  Correction : « 9 enfants, 5 châtaignes chacun : 5, 10, 15, 20, 25, 30, 35, 40, 45. Ils ont ramassé 45 châtaignes. »

## Partage (la valeur d'une part, le nombre de parts)

- **par-v-01** · 1 · cuisine · part — Tu as 6 fraises. Tu les partages entre toi et ton copain. Vous en avez autant chacun. *Combien de fraises a chacun ?* → **3** (6 = 3 + 3 (2 parts de 3))  
  Correction : « 6 fraises en 2 parts égales : 3 chacun. »
- **par-v-02** · 1 · chambre · part — Tu ranges 9 peluches sur 3 étagères. Il y a autant de peluches sur chaque étagère. *Combien de peluches y a-t-il sur chaque étagère ?* → **3** (9 = 3 + 3 + 3 (3 parts de 3))  
  Correction : « 9 peluches sur 3 étagères : 3 sur chaque étagère. »
- **par-v-03** · 1 · classe · part — La maîtresse a 12 crayons. Elle les met dans 3 pots. Chaque pot a le même nombre de crayons. *Combien de crayons y a-t-il dans chaque pot ?* → **4** (12 = 4 + 4 + 4 (3 parts de 4))  
  Correction : « 12 crayons dans 3 pots : 4 dans chaque pot. »
- **par-v-04** · 1 · anniversaire · part — Maman partage 10 bonbons entre 2 enfants. Chaque enfant en a autant. *Combien de bonbons a chaque enfant ?* → **5** (10 = 5 + 5 (2 parts de 5))  
  Correction : « 10 bonbons pour 2 enfants : 5 chacun. »
- **par-v-05** · 2 · animaux · part — Il y a 16 croquettes. Tu les partages entre les 2 chats. Chaque chat en a autant. *Combien de croquettes a chaque chat ?* → **8** (16 = 8 + 8 (2 parts de 8))  
  Correction : « 16 croquettes pour 2 chats : 8 chacun. »
- **par-v-06** · 2 · boulangerie · part — Le boulanger range 20 croissants sur 4 plateaux. Il met autant de croissants sur chaque plateau. *Combien de croissants y a-t-il sur chaque plateau ?* → **5** (20 = 5 + 5 + 5 + 5 (4 parts de 5))  
  Correction : « 20 croissants sur 4 plateaux : 5 sur chaque plateau. »
- **par-v-07** · 2 · jardin · part — Papa plante 15 salades en 3 rangées. Il y a autant de salades dans chaque rangée. *Combien de salades y a-t-il dans chaque rangée ?* → **5** (15 = 5 + 5 + 5 (3 parts de 5))  
  Correction : « 15 salades en 3 rangées : 5 dans chaque rangée. »
- **par-v-08** · 2 · gymnase · part — 18 enfants font 3 équipes. Chaque équipe a autant d'enfants. *Combien d'enfants y a-t-il dans chaque équipe ?* → **6** (18 = 6 + 6 + 6 (3 parts de 6))  
  Correction : « 18 enfants en 3 équipes : 6 dans chaque équipe. »
- **par-v-09** · 3 · classe · part — La maîtresse partage 35 feuilles entre 5 groupes. Chaque groupe en reçoit autant. *Combien de feuilles reçoit chaque groupe ?* → **7** (35 = 7 + 7 + 7 + 7 + 7 (5 parts de 7))  
  Correction : « 35 feuilles pour 5 groupes : 7 chacun. »
- **par-v-10** · 3 · ferme · part — La fermière range 36 œufs dans 6 boîtes. Chaque boîte contient autant d'œufs. *Combien d'œufs y a-t-il dans chaque boîte ?* → **6** (36 = 6 + 6 + 6 + 6 + 6 + 6 (6 parts de 6))  
  Correction : « 36 œufs dans 6 boîtes : 6 dans chaque boîte. »
- **par-v-11** · 3 · kermesse · part — On partage 40 gâteaux entre 4 tables. Chaque table en reçoit autant. *Combien de gâteaux reçoit chaque table ?* → **10** (40 = 10 + 10 + 10 + 10 (4 parts de 10))  
  Correction : « 40 gâteaux pour 4 tables : 10 chacune. »
- **par-v-12** · 3 · marche · part — Le marchand met 45 pommes dans 5 paniers. Il y a autant de pommes dans chaque panier. *Combien de pommes y a-t-il dans chaque panier ?* → **9** (45 = 9 + 9 + 9 + 9 + 9 (5 parts de 9))  
  Correction : « 45 pommes dans 5 paniers : 9 dans chaque panier. »
- **par-n-01** · 1 · cuisine · parts — Tu as 8 biscuits. Tu en mets 2 dans chaque assiette. *Combien d'assiettes peux-tu remplir ?* → **4** (8 = 2 + 2 + 2 + 2 (4 fois 2))  
  Correction : « 8 biscuits, 2 par assiette : 4 assiettes. »
- **par-n-02** · 1 · chambre · parts — Tu as 10 billes. Tu en mets 5 dans chaque sachet. *Combien de sachets te faut-il ?* → **2** (10 = 5 + 5 (2 fois 5))  
  Correction : « 10 billes, 5 par sachet : 2 sachets. »
- **par-n-03** · 1 · jardin · parts — Tu as 12 fleurs. Tu fais des bouquets de 4 fleurs. *Combien de bouquets peux-tu faire ?* → **3** (12 = 4 + 4 + 4 (3 fois 4))  
  Correction : « 12 fleurs, 4 par bouquet : 3 bouquets. »
- **par-n-04** · 1 · parc · parts — 9 enfants veulent faire un tour de barque. Dans chaque barque, il y a 3 places. *Combien de barques faut-il ?* → **3** (9 = 3 + 3 + 3 (3 fois 3))  
  Correction : « 9 enfants, 3 par barque : 3 barques. »
- **par-n-05** · 2 · classe · parts — La maîtresse fabrique des carnets. Elle a 28 pages. Elle utilise 4 pages pour chaque carnet. *Combien de carnets peut-elle fabriquer ?* → **7** (28 = 4 + 4 + 4 + 4 + 4 + 4 + 4 (7 fois 4))  
  Correction : « 28 pages, 4 par carnet : 7 carnets. »
- **par-n-06** · 2 · boulangerie · parts — La boulangère a 20 croissants. Elle en met 5 dans chaque sachet. *Combien de sachets remplit-elle ?* → **4** (20 = 5 + 5 + 5 + 5 (4 fois 5))  
  Correction : « 20 croissants, 5 par sachet : 4 sachets. »
- **par-n-07** · 2 · gymnase · parts — 24 enfants font des équipes de 6 enfants. *Combien d'équipes y a-t-il ?* → **4** (24 = 6 + 6 + 6 + 6 (4 fois 6))  
  Correction : « 24 enfants, 6 par équipe : 4 équipes. »
- **par-n-08** · 2 · ferme · parts — La fermière a 18 œufs. Elle les range par 6 dans des boîtes. *Combien de boîtes remplit-elle ?* → **3** (18 = 6 + 6 + 6 (3 fois 6))  
  Correction : « 18 œufs, 6 par boîte : 3 boîtes. »
- **par-n-09** · 3 · atelier · parts — Tu as 40 perles. Il faut 10 perles pour faire un bracelet. *Combien de bracelets peux-tu faire ?* → **4** (40 = 10 + 10 + 10 + 10 (4 fois 10))  
  Correction : « 40 perles, 10 par bracelet : 4 bracelets. »
- **par-n-10** · 3 · bus · parts — 36 enfants partent en sortie. Dans chaque minibus, il y a 9 places. *Combien de minibus faut-il ?* → **4** (36 = 9 + 9 + 9 + 9 (4 fois 9))  
  Correction : « 36 enfants, 9 par minibus : 4 minibus. »
- **par-n-11** · 3 · supermarche · parts — Le magasin a 32 yaourts. Il les vend par paquets de 4. *Combien de paquets de yaourts y a-t-il ?* → **8** (32 = 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 (8 fois 4))  
  Correction : « 32 yaourts, 4 par paquet : 8 paquets. »
- **par-n-12** · 3 · cantine · parts — Il y a 42 enfants à la cantine. On met 6 enfants à chaque table. *Combien de tables faut-il ?* → **7** (42 = 6 + 6 + 6 + 6 + 6 + 6 + 6 (7 fois 6))  
  Correction : « 42 enfants, 6 par table : 7 tables. »

## Deux étapes

- **etp-01** · 2 · chambre — Tu as 6 billes. Ton copain t'en donne 5. Puis tu en perds 3. *Combien de billes as-tu à la fin ?* → **8** (6 + 5 = 11 ; 11 − 3 = 8)  
  Correction : « 6 et 5, ça fait 11. 11, moins 3, il en reste 8 billes. »
- **etp-02** · 2 · cuisine — Il y a 12 biscuits dans la boîte. Tu en manges 2, et Papa en mange 3. *Combien de biscuits reste-t-il dans la boîte ?* → **7** (12 − 2 = 10 ; 10 − 3 = 7)  
  Correction : « 12, moins 2, il en reste 10. 10, moins 3, il en reste 7 biscuits. »
- **etp-03** · 2 · bus — Il y a 10 personnes dans le bus. À l'arrêt, 4 personnes descendent et 6 personnes montent. *Combien de personnes y a-t-il dans le bus maintenant ?* → **12** (10 − 4 = 6 ; 6 + 6 = 12)  
  Correction : « 10, moins 4, il en reste 6. 6, et 6 de plus, ça fait 12 personnes. »
- **etp-04** · 2 · jardin — Papa cueille 7 tomates. Maman en cueille 8. Toute la famille en mange 5 au déjeuner. *Combien de tomates reste-t-il ?* → **10** (7 + 8 = 15 ; 15 − 5 = 10)  
  Correction : « 7 et 8, ça fait 15. 15, moins 5, il en reste 10 tomates. »
- **etp-05** · 2 · anniversaire — Pour la fête, Mamie achète 2 sachets de 5 bonbons. Elle achète aussi 4 sucettes. *Combien de friandises Mamie achète-t-elle ?* → **14** (2 × 5 = 10 ; 10 + 4 = 14)  
  Correction : « 2 sachets de 5 bonbons, ça fait 10. 10, et 4 sucettes, ça fait 14 friandises. »
- **etp-06** · 3 · bibliotheque — Ton livre a 50 pages. Lundi, tu lis 10 pages. Mardi, tu lis 20 pages. *Combien de pages te reste-t-il à lire ?* → **20** (10 + 20 = 30 ; 50 − 30 = 20)  
  Correction : « 10 et 20, ça fait 30 pages lues. 50, moins 30, il reste 20 pages. »
- **etp-07** · 3 · kermesse — Le stand a 40 lots. Le matin, les enfants en gagnent 10. L'après-midi, ils en gagnent 20. *Combien de lots reste-t-il ?* → **10** (40 − 10 = 30 ; 30 − 20 = 10)  
  Correction : « 40, moins 10, il en reste 30. 30, moins 20, il reste 10 lots. »
- **etp-08** · 3 · boulangerie — Le boulanger fait 30 croissants et 25 pains au chocolat. Il en vend 40 en tout. *Combien de viennoiseries lui reste-t-il ?* → **15** (30 + 25 = 55 ; 55 − 40 = 15)  
  Correction : « 30 et 25, ça fait 55. 55, moins 40, il en reste 15. »
- **etp-09** · 3 · marche — Le marchand prépare 3 paniers de 10 pommes. Il a aussi 6 pommes sur la table. *Combien de pommes a-t-il en tout ?* → **36** (3 × 10 = 30 ; 30 + 6 = 36)  
  Correction : « 3 paniers de 10 pommes, ça fait 30. 30, et 6, ça fait 36 pommes. »
- **etp-10** · 3 · ferme — La fermière a 24 poules et 12 canards. Elle vend 5 canards. *Combien d'animaux lui reste-t-il ?* → **31** (24 + 12 = 36 ; 36 − 5 = 31)  
  Correction : « 24 et 12, ça fait 36 animaux. 36, moins 5, il en reste 31. »
- **etp-11** · 3 · gymnase — Ton équipe marque 12 points au premier jeu et 15 points au deuxième jeu. L'autre équipe a marqué 20 points en tout. *Combien de points ton équipe a-t-elle de plus que l'autre équipe ?* → **7** (12 + 15 = 27 ; 27 − 20 = 7)  
  Correction : « 12 et 15, ça fait 27 points. 27 contre 20 : ton équipe a 7 points de plus. »
- **etp-12** · 4 · bus — Il y a 26 personnes dans le bus. À l'arrêt, 8 personnes descendent et 13 personnes montent. *Combien de personnes y a-t-il dans le bus maintenant ?* → **31** (26 − 8 = 18 ; 18 + 13 = 31)  
  Correction : « 26, moins 8, il en reste 18. 18, et 13 de plus, ça fait 31 personnes. »
- **etp-13** · 4 · classe — L'école a 3 classes. Il y a 24 élèves dans la première, 23 dans la deuxième et 25 dans la troisième. *Combien d'élèves y a-t-il dans l'école ?* → **72** (24 + 23 = 47 ; 47 + 25 = 72)  
  Correction : « 24 et 23, ça fait 47. 47 et 25, ça fait 72 élèves. »
- **etp-14** · 4 · marche — Papa a 50 euros. Il dépense 18 euros chez le marchand de fruits et 14 euros chez le boulanger. *Combien d'euros lui reste-t-il ?* → **18** (50 − 18 = 32 ; 32 − 14 = 18)  
  Correction : « 50, moins 18, il en reste 32. 32, moins 14, il reste 18 euros. »
- **etp-15** · 4 · foret — Le matin, tu ramasses 17 châtaignes. L'après-midi, tu en ramasses 16. Tu en donnes 9 à Mamie. *Combien de châtaignes te reste-t-il ?* → **24** (17 + 16 = 33 ; 33 − 9 = 24)  
  Correction : « 17 et 16, ça fait 33. 33, moins 9, il en reste 24 châtaignes. »
- **etp-16** · 4 · cantine — Le cuisinier prépare 4 plateaux de 10 yaourts. Les enfants en mangent 27. *Combien de yaourts reste-t-il ?* → **13** (4 × 10 = 40 ; 40 − 27 = 13)  
  Correction : « 4 plateaux de 10 yaourts, ça fait 40. 40, moins 27, il en reste 13 yaourts. »
