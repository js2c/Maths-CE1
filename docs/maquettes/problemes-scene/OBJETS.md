# Les objets de l'histoire : le relevé

Écrit par `node art/problemes/mise-en-scene/relever.mjs --md` à partir de la banque (`app/content/problemes.json`, 200 énoncés) et de la bibliothèque proposée (`art/problemes/mise-en-scene/objets.json`). Ne pas modifier à la main : modifier `objets.json` (les mots qui désignent chaque objet) et relancer.

**Lecture** : *groupe ×n*, dessiné n fois, en nombre exact (3 sachets) ; *groupe ?*, le nombre de groupes est la question (on n'en montre qu'un, en exemple) ; *objet*, nommé par l'histoire, dessiné une fois ; *unité*, ce qu'on compte, jamais dessiné tant qu'il faut le trouver (une icône sur l'étiquette) ; *par défaut* (`*`), le dépôt du lieu quand l'histoire n'en nomme pas (`lieux.json`, `defaut`).

## Ceux qui servent le plus (hors unités)

1. **la table** : 27 énoncés (11 aux niveaux 1 à 5), jusqu'à 4 à la fois
2. **ton copain (ton cousin)** : 12 énoncés (10 aux niveaux 1 à 5)
3. **Papa** : 12 énoncés (6 aux niveaux 1 à 5)
4. **le boulanger, la boulangère** : 12 énoncés (5 aux niveaux 1 à 5)
5. **la maîtresse** : 11 énoncés (4 aux niveaux 1 à 5)
6. **la fermière** : 8 énoncés (0 aux niveaux 1 à 5)
7. **le marchand, la marchande** : 8 énoncés (0 aux niveaux 1 à 5)
8. **Maman** : 7 énoncés (5 aux niveaux 1 à 5)
9. **le pêcheur** : 7 énoncés (5 aux niveaux 1 à 5)
10. **le pupitre (la table de classe)** : 7 énoncés (4 aux niveaux 1 à 5)
11. **la boîte (d'œufs, de billes, de gâteaux)** : 7 énoncés (3 aux niveaux 1 à 5), jusqu'à 5 à la fois
12. **le bus** : 7 énoncés (2 aux niveaux 1 à 5)
13. **l'assiette** : 5 énoncés (5 aux niveaux 1 à 5), jusqu'à 3 à la fois
14. **la boîte d'œufs** : 5 énoncés (1 aux niveaux 1 à 5), jusqu'à 7 à la fois
15. **le sachet** : 5 énoncés (1 aux niveaux 1 à 5), jusqu'à 5 à la fois

**Pour les niveaux 1 à 5** (ceux des premiers mois) : 36 objets hors unités (`table`, `copain`, `papa`, `boulanger`, `maitresse`, `maman`, `pecheur`, `pupitre`, `boite`, `bus`, `assiette`, `boite-oeufs`, `sachet`, `mamie`, `nid-poule`, `seau`, `toboggan`, `etagere`, `caisse`, `enfants`, `gamelle`, `banc`, `coffre`, `nid`, `pot`, `trousse`, `vase`, `voisine`, `chat`, `barque`, `bol`, `corbeille`, `gateau`, `poule`, `rosier`, `tour`) et 20 unités.

**83 objets à générer en tout, 137 images** avec leurs variantes (les autres existent déjà, à l'étal, ou restent dessinés par le code). Énoncés sans aucun objet dessiné : **27** (`reu-t-08`, `reu-t-14`, `reu-t-15`, `reu-t-17`, `reu-t-19`, `reu-p-04`, `reu-p-12`, `tra-gf-03`, `tra-gf-13`, `tra-gf-18`, `tra-pf-02`, `tra-gc-02`, `tra-gc-07`, `tra-pc-05`, `tra-pc-08`, `tra-gd-01`, `tra-gd-05`, `tra-pd-02`, `cmp-e-05`, `cmp-e-10`, `cmp-e-11`, `cmp-e-13`, `cmp-g-03`, `cmp-g-05`, `cmp-g-08`, `cmp-p-07`, `etp-11`).

## Par catégorie

### Personnages (13)

| Objet | Énoncés | dont niveaux 1 à 5 | Au plus à la fois | Rôles | Variantes | À générer |
| --- | --- | --- | --- | --- | --- | --- |
| **ton copain (ton cousin)** (`copain`) | 12 | 10 | 1 | objet | — | oui |
| **Papa** (`papa`) | 12 | 6 | 1 | objet | — | oui |
| **le boulanger, la boulangère** (`boulanger`) | 12 | 5 | 1 | objet | homme, femme | oui |
| **la maîtresse** (`maitresse`) | 11 | 4 | 1 | objet | — | oui |
| **la fermière** (`fermiere`) | 8 | 0 | 1 | objet | — | oui |
| **le marchand, la marchande** (`marchand`) | 8 | 0 | 1 | objet | homme, femme | oui |
| **Maman** (`maman`) | 7 | 5 | 1 | objet | — | oui |
| **le pêcheur** (`pecheur`) | 7 | 5 | 1 | objet | — | oui |
| **Mamie** (`mamie`) | 4 | 1 | 1 | objet | — | oui |
| **des enfants (quand ils forment les groupes)** (`enfants`) | 3 | 1 | 9 | groupe | a, b, c, d | oui |
| **ta voisine (ta cousine)** (`voisine`) | 2 | 2 | 1 | objet | — | oui |
| **Papy** (`papy`) | 2 | 0 | 1 | objet | — | oui |
| **le cuisinier** (`cuisinier`) | 1 | 0 | 1 | objet | — | oui |

### Animaux (4)

| Objet | Énoncés | dont niveaux 1 à 5 | Au plus à la fois | Rôles | Variantes | À générer |
| --- | --- | --- | --- | --- | --- | --- |
| **le chat** (`chat`) | 2 | 1 | 2 | objet, groupe | roux, gris | oui |
| **le chien** (`chien`) | 2 | 0 | 1 | objet | — | oui |
| **la poule** (`poule`) | 1 | 1 | 1 | objet | — | oui |
| **la vache** (`vache`) | 1 | 0 | 7 | groupe | — | oui |

### Contenants (22)

| Objet | Énoncés | dont niveaux 1 à 5 | Au plus à la fois | Rôles | Variantes | À générer |
| --- | --- | --- | --- | --- | --- | --- |
| **la boîte (d'œufs, de billes, de gâteaux)** (`boite`) | 7 | 3 | 5 | objet, groupe | fermee, ouverte | oui |
| **l'assiette** (`assiette`) | 5 | 5 | 3 | objet, groupe, groupe ? | — | oui |
| **la boîte d'œufs** (`boite-oeufs`) | 5 | 1 | 7 | objet, groupe, groupe ? | fermee, ouverte | oui |
| **le sachet** (`sachet`) | 5 | 1 | 5 | groupe, groupe ? | ferme, ouvert | oui |
| **le collier, le bracelet** (`collier`) | 5 | 0 | 2 | objet, groupe, groupe ? | — | oui |
| **le panier** (`panier`) | 5 | 0 | 5 | objet, groupe | vide, couvert | oui |
| **le carnet, le livre (qui contient des pages)** (`carnet`) | 4 | 0 | 1 | objet, groupe ? | carnet, livre | oui |
| **le cerceau (une équipe, un groupe)** (`cerceau`) | 4 | 0 | 5 | groupe, groupe ? | — | oui |
| **le minibus, le car** (`minibus`) | 4 | 0 | 1 | objet, groupe ? | minibus, car | oui |
| **la rangée (de salades, de sièges)** (`rangee`) | 3 | 0 | 8 | groupe | sillon, sieges | oui |
| **le nid** (`nid`) | 2 | 2 | 3 | objet, groupe | — | oui |
| **le pot à crayons** (`pot`) | 2 | 2 | 4 | groupe | — | oui |
| **la trousse** (`trousse`) | 2 | 2 | 1 | objet | bleue, jaune | oui |
| **le vase** (`vase`) | 2 | 2 | 3 | groupe, groupe ? | — | oui |
| **le paquet (de feutres, de yaourts, de pâtes)** (`paquet`) | 2 | 0 | 4 | groupe, groupe ? | — | oui |
| **le plateau** (`plateau`) | 2 | 0 | 4 | groupe | — | oui |
| **le sac** (`sac`) | 2 | 0 | 1 | objet | toile, filet | oui |
| **la barque** (`barque`) | 1 | 1 | 1 | groupe ? | — | oui |
| **la cagette** (`cagette`) | 1 | 0 | 4 | groupe | vide, couverte | oui |
| **le filet de ballons** (`filet`) | 1 | 0 | 5 | groupe | — | oui |
| **le pack d'eau** (`pack`) | 1 | 0 | 6 | groupe | — | oui |
| **le soir (une soirée de lecture)** (`soir`) | 1 | 0 | 4 | groupe | — | oui |

### Lieux de dépôt (17)

| Objet | Énoncés | dont niveaux 1 à 5 | Au plus à la fois | Rôles | Variantes | À générer |
| --- | --- | --- | --- | --- | --- | --- |
| **la table** (`table`) | 27 | 11 | 4 | objet, objet (par défaut), groupe, groupe ? | cuisine, salon, cantine | oui |
| **le pupitre (la table de classe)** (`pupitre`) | 7 | 4 | 1 | objet (par défaut) | — | oui |
| **le bus** (`bus`) | 7 | 2 | 1 | objet | — | oui |
| **le clapier, le poulailler** (`nid-poule`) | 3 | 3 | 1 | objet | clapier, poulailler | oui |
| **le seau** (`seau`) | 3 | 3 | 1 | objet | plage, pecheur | oui |
| **le toboggan, les balançoires, le bac à sable** (`toboggan`) | 3 | 3 | 1 | objet | toboggan, balancoires, bac | oui |
| **l'étagère** (`etagere`) | 3 | 2 | 3 | objet, groupe | — | oui |
| **la caisse des lots** (`caisse`) | 3 | 1 | 1 | objet | — | oui |
| **la gamelle** (`gamelle`) | 3 | 1 | 1 | objet | — | oui |
| **le banc** (`banc`) | 2 | 2 | 4 | objet, groupe | — | oui |
| **le coffre** (`coffre`) | 2 | 2 | 1 | objet | — | oui |
| **le bol** (`bol`) | 1 | 1 | 1 | objet | — | oui |
| **la corbeille à fruits** (`corbeille`) | 1 | 1 | 1 | objet | — | oui |
| **le gâteau d'anniversaire** (`gateau`) | 1 | 1 | 1 | objet | — | oui |
| **le rosier** (`rosier`) | 1 | 1 | 1 | objet | — | oui |
| **la tour de cubes** (`tour`) | 1 | 1 | 1 | objet | — | oui |
| **le chariot de la bibliothèque** (`chariot`) | 1 | 0 | 1 | objet | — | oui |

### Unités comptées (icônes) (33)

| Objet | Énoncés | dont niveaux 1 à 5 | Au plus à la fois | Rôles | Variantes | À générer |
| --- | --- | --- | --- | --- | --- | --- |
| **enfant, élève, personne, fille, garçon, adulte** (`u-personne`) | 45 | 18 | — | unite | — | non (code) |
| **bille, voiture, peluche, cube, carte, jeton, ballon, cerceau** (`u-jouet`) | 28 | 19 | — | unite | voiture, peluche, cube, carte, cerceau, ballon-basket | oui |
| **mouton, chèvre, cheval, canard, lapin, pigeon, papillon, poule** (`u-animal`) | 14 | 8 | — | unite | mouton, chevre, cheval, canard, lapin, pigeon, papillon | oui |
| **crayon, feutre, craie, cahier, feuille, image, autocollant** (`u-ecole`) | 13 | 9 | — | unite | crayon, feutre, craie, cahier, feuille | oui |
| **croissant, pain au chocolat, baguette, pain** (`u-viennoiserie`) | 11 | 5 | — | unite | croissant, pain-chocolat, baguette, pain | oui |
| **biscuit, gourmandise, croquette, gâteau** (`u-biscuit`) | 11 | 3 | — | unite | biscuit, gourmandise, croquette, gateau | oui |
| **livre, bande dessinée, page** (`u-livre`) | 10 | 1 | — | unite | — | oui |
| **œuf** (`u-oeuf`) | 8 | 3 | — | unite | — | oui |
| **sardine, maquereau, dorade** (`u-poisson`) | 7 | 5 | — | unite | — | non, existe : app/assets/etal/produit-sardines.webp, produit-maquereau.webp, produit-dorade.webp |
| **fleur, tulipe, rose** (`u-fleur`) | 5 | 5 | — | unite | tulipe, rose | oui |
| **point (d'un match)** (`u-point`) | 5 | 1 | — | unite | — | non (code) |
| **pomme** (`u-pomme`) | 5 | 1 | — | unite | — | oui |
| **perle** (`u-perle`) | 5 | 0 | — | unite | — | oui |
| **salade** (`u-salade`) | 4 | 2 | — | unite | — | oui |
| **lot, jeu (de la kermesse)** (`u-lot`) | 4 | 1 | — | unite | — | oui |
| **pomme de pin, châtaigne, champignon** (`u-foret`) | 4 | 0 | — | unite | pomme-de-pin, chataigne, champignon | oui |
| **place, siège** (`u-place`) | 4 | 0 | — | unite | — | oui |
| **coquillage** (`u-coquillage`) | 3 | 3 | — | unite | blanc, rose | oui |
| **crêpe** (`u-crepe`) | 3 | 2 | — | unite | — | oui |
| **fraise** (`u-fraise`) | 3 | 2 | — | unite | — | oui |
| **bonbon, sucette** (`u-bonbon`) | 3 | 1 | — | unite | bonbon, sucette | oui |
| **bouteille** (`u-bouteille`) | 3 | 0 | — | unite | eau, jus | oui |
| **melon, pastèque, citron, orange** (`u-fruit`) | 3 | 0 | — | unite | melon, pasteque, citron, orange | oui |
| **bougie, part de gâteau** (`u-bougie`) | 2 | 2 | — | unite | bougie, part | oui |
| **tomate** (`u-tomate`) | 2 | 1 | — | unite | — | oui |
| **yaourt** (`u-yaourt`) | 2 | 0 | — | unite | — | oui |
| **château de sable** (`u-chateau`) | 1 | 1 | — | unite | — | oui |
| **cuillère, fourchette** (`u-couvert`) | 1 | 1 | — | unite | cuillere, fourchette | oui |
| **crabe** (`u-crabe`) | 1 | 1 | — | unite | — | non, existe : app/assets/etal/produit-tourteau.webp |
| **poire** (`u-poire`) | 1 | 1 | — | unite | — | oui |
| **euro** (`u-euro`) | 1 | 0 | — | unite | — | non, existe : app/assets/etal/piece-1e.webp, billet-10.webp… |
| **paquet de pâtes** (`u-paquet`) | 1 | 0 | — | unite | — | oui |
| **patte** (`u-patte`) | 1 | 0 | — | unite | — | non (code) |

## Énoncé par énoncé

| Énoncé | Niv. | Structure | Lieu | Dans la scène (dessiné) | Unités (cachées) | L'histoire |
| --- | --- | --- | --- | --- | --- | --- |
| `reu-t-01` | 1 | reunion, tout | cuisine | la corbeille à fruits | pommes, poires | Dans la corbeille, il y a 4 pommes et 3 poires. Combien de fruits y a-t-il dans la corbeille ? |
| `reu-t-02` | 1 | reunion, tout | chambre | l'étagère | voitures | Sur l'étagère, il y a 5 voitures rouges et 2 voitures bleues. Combien de voitures y a-t-il sur l'étagère ? |
| `reu-t-03` | 1 | reunion, tout | jardin | Papa | tulipes, roses, fleurs | Papa plante 6 tulipes et 3 roses. Combien de fleurs Papa plante-t-il ? |
| `reu-t-04` | 1 | reunion, tout | parc | le toboggan, les balançoires, le bac à sable | garçons, filles, enfants | Au toboggan, il y a 3 garçons et 5 filles. Combien d'enfants y a-t-il au toboggan ? |
| `reu-t-05` | 2 | reunion, tout | classe | le pupitre* | filles, garçons, élèves | Dans la classe, il y a 9 filles et 8 garçons. Combien d'élèves y a-t-il dans la classe ? |
| `reu-t-06` | 2 | reunion, tout | bibliotheque | la table | livres, bandes dessinées | Sur la table, il y a 7 livres de contes et 6 bandes dessinées. Combien de livres y a-t-il sur la table ? |
| `reu-t-07` | 2 | reunion, tout | plage | le seau | coquillages | Dans ton seau, il y a 8 coquillages blancs et 5 coquillages roses. Combien de coquillages y a-t-il dans ton seau ? |
| `reu-t-08` | 2 | reunion, tout | ferme | — | vaches, moutons | Dans le pré, il y a 7 vaches et 9 moutons. Combien d'animaux y a-t-il dans le pré ? |
| `reu-t-09` | 6 | reunion, tout | bus | le bus | enfants, adultes, personnes | Dans le bus, il y a 23 enfants et 4 adultes. Combien de personnes y a-t-il dans le bus ? |
| `reu-t-10` | 6 | reunion, tout | marche | le marchand, la marchande | melons, pastèques | La marchande a 32 melons et 15 pastèques. Combien de melons et de pastèques a-t-elle en tout ? |
| `reu-t-11` | 6 | reunion, tout | cantine | la table (cantine)* | enfants | À la cantine, 40 enfants mangent au premier service et 30 enfants au deuxième service. Combien d'enfants mangent à la cantine ? |
| `reu-t-12` | 6 | reunion, tout | kermesse | la table (cantine)* | crêpes | À la kermesse, on a vendu 24 crêpes au sucre et 13 crêpes au chocolat. Combien de crêpes a-t-on vendues ? |
| `reu-t-13` | 6 | reunion, tout | gymnase | le sac | ballons | Dans le grand sac, il y a 18 ballons de basket et 15 ballons de foot. Combien de ballons y a-t-il dans le grand sac ? |
| `reu-t-14` | 6 | reunion, tout | foret | — | pommes de pin, châtaignes | Pendant la promenade, la classe a trouvé 27 pommes de pin et 16 châtaignes. Combien de pommes de pin et de châtaignes a-t-elle trouvées en tout ? |
| `reu-t-15` | 6 | reunion, tout | supermarche | — | bouteilles | Au magasin, il y a 36 bouteilles d'eau et 26 bouteilles de jus. Combien de bouteilles y a-t-il au magasin ? |
| `reu-t-16` | 6 | reunion, tout | anniversaire | Mamie, la table (salon)* | ballons | Pour la fête, Mamie a gonflé 19 ballons rouges et 17 ballons jaunes. Combien de ballons Mamie a-t-elle gonflés ? |
| `reu-t-17` | 1 | reunion, tout | cour | — | enfants | Dans la cour, 4 enfants jouent à la marelle et 5 enfants jouent au ballon. Combien d'enfants jouent dans la cour ? |
| `reu-t-18` | 1 | reunion, tout | salon | la table | cartes | Sur la table du salon, il y a 6 cartes rouges et 4 cartes noires. Combien de cartes y a-t-il sur la table ? |
| `reu-t-19` | 1 | reunion, tout | etal | — | dorades, maquereaux, poissons | Sur l'étal, il y a 5 dorades et 3 maquereaux. Combien de poissons y a-t-il sur l'étal ? |
| `reu-t-20` | 1 | reunion, tout | plage | ton copain | châteaux de sable | Sur la plage, tu construis 3 châteaux de sable. Ton copain en construit 6. Combien de châteaux de sable avez-vous construits ? |
| `reu-t-21` | 2 | reunion, tout | cour | le banc | enfants | Dans la cour, il y a 8 enfants sur le banc et 7 enfants près de l'arbre. Combien d'enfants y a-t-il dans la cour ? |
| `reu-t-22` | 2 | reunion, tout | etal | le pêcheur | sardines | Le pêcheur a pêché 9 sardines le matin et 6 sardines le soir. Combien de sardines a-t-il pêchées ? |
| `reu-t-23` | 2 | reunion, tout | chambre | la boîte | crayons, feutres | Dans ta boîte, il y a 7 crayons de couleur et 6 feutres. Combien de crayons et de feutres y a-t-il dans ta boîte ? |
| `reu-p-01` | 4 | reunion, partie | classe | la trousse | crayons | Il y a 9 crayons dans la trousse. 4 crayons sont rouges, les autres sont bleus. Combien de crayons bleus y a-t-il ? |
| `reu-p-02` | 4 | reunion, partie | cuisine | la boîte d'œufs | œufs | Dans la boîte, il y a 8 œufs. 3 œufs sont blancs, les autres sont roux. Combien d'œufs roux y a-t-il ? |
| `reu-p-03` | 4 | reunion, partie | parc | le toboggan, les balançoires, le bac à sable | enfants | 10 enfants jouent au parc. 6 enfants sont sur les balançoires, les autres sont dans le bac à sable. Combien d'enfants sont dans le bac à sable ? |
| `reu-p-04` | 4 | reunion, partie | jardin | — | fleurs | Dans le jardin, il y a 15 fleurs. 7 fleurs sont jaunes, les autres sont rouges. Combien de fleurs rouges y a-t-il ? |
| `reu-p-05` | 4 | reunion, partie | chambre | le coffre | peluches | Tu as 18 peluches. 9 peluches sont sur ton lit, les autres sont dans le coffre. Combien de peluches sont dans le coffre ? |
| `reu-p-06` | 4 | reunion, partie | ferme | le clapier, le poulailler | poules | Dans le poulailler, il y a 14 poules. 6 poules sont blanches, les autres sont noires. Combien de poules noires y a-t-il ? |
| `reu-p-07` | 6 | reunion, partie | bibliotheque | le chariot de la bibliothèque | livres | La bibliothèque a 48 livres d'animaux. 25 livres sont rangés, les autres sont sur le chariot. Combien de livres sont sur le chariot ? |
| `reu-p-08` | 6 | reunion, partie | bus | le minibus, le car | personnes, places | Le car peut transporter 50 personnes. 30 places sont déjà prises. Combien de places sont libres ? |
| `reu-p-09` | 6 | reunion, partie | kermesse | la table (cantine)* | peluches, lots, jeux | Il y a 65 lots à gagner. 40 lots sont des peluches, les autres sont des jeux. Combien de jeux y a-t-il ? |
| `reu-p-10` | 6 | reunion, partie | classe | le pupitre* | élèves, filles, garçons | L'école a 52 élèves. 27 élèves sont des filles. Combien de garçons y a-t-il ? |
| `reu-p-11` | 6 | reunion, partie | supermarche | l'étagère | paquets de pâtes, spaghettis, coquillettes | Dans le rayon, il y a 34 paquets de pâtes. 18 paquets sont des spaghettis, les autres sont des coquillettes. Combien de paquets de coquillettes y a-t-il ? |
| `reu-p-12` | 6 | reunion, partie | gymnase | — | enfants | Il y a 41 enfants au stade. 26 enfants courent, les autres sautent. Combien d'enfants sautent ? |
| `tra-gf-01` | 1 | transformation, fin | chambre | ton copain | billes | Tu as 5 billes. Ton copain t'en donne 3. Combien de billes as-tu maintenant ? |
| `tra-gf-02` | 1 | transformation, fin | ferme | la poule, le nid | œufs | Ce matin, il y a 4 œufs dans le nid. La poule en pond 2 autres. Combien d'œufs y a-t-il dans le nid maintenant ? |
| `tra-gf-03` | 1 | transformation, fin | parc | — | enfants | 6 enfants jouent au ballon. 3 enfants arrivent. Combien d'enfants jouent au ballon maintenant ? |
| `tra-gf-04` | 2 | transformation, fin | classe | la maîtresse, le pupitre* | cahiers | La maîtresse a 12 cahiers. Elle en achète 6 autres. Combien de cahiers a-t-elle maintenant ? |
| `tra-gf-05` | 2 | transformation, fin | jardin | Papa | salades | Papa a planté 9 salades. Il en plante encore 7. Combien de salades y a-t-il dans le potager ? |
| `tra-gf-06` | 2 | transformation, fin | bus | le bus | personnes | Il y a 8 personnes dans le bus. À l'arrêt, 5 personnes montent. Combien de personnes y a-t-il dans le bus maintenant ? |
| `tra-gf-07` | 6 | transformation, fin | bibliotheque | la table (salon)* | livres | La bibliothèque a 45 livres de contes. Elle en reçoit 20 nouveaux. Combien de livres de contes a-t-elle maintenant ? |
| `tra-gf-08` | 6 | transformation, fin | kermesse | la table (cantine)* | personnes | Au début de la kermesse, il y a 32 personnes. 6 personnes arrivent. Combien de personnes y a-t-il maintenant ? |
| `tra-gf-09` | 6 | transformation, fin | atelier | le collier, le bracelet | perles | Ton collier a 24 perles. Tu enfiles 5 perles de plus. Combien de perles a ton collier maintenant ? |
| `tra-gf-10` | 6 | transformation, fin | cour | la maîtresse | enfants, ballons | Les enfants ont rangé les 17 ballons de l'école. La maîtresse en achète 8 nouveaux. Combien de ballons l'école a-t-elle maintenant ? |
| `tra-gf-11` | 6 | transformation, fin | anniversaire | la table (salon)* | cartes | Tu as 28 cartes de jeu. Pour ton anniversaire, on t'en offre 15. Combien de cartes as-tu maintenant ? |
| `tra-gf-12` | 6 | transformation, fin | ferme | la fermière | poules | La fermière a 36 poules. Elle en achète 9. Combien de poules a-t-elle maintenant ? |
| `tra-gf-13` | 1 | transformation, fin | cour | — | enfants | 3 enfants sautent à la corde. 4 enfants viennent sauter avec eux. Combien d'enfants sautent à la corde maintenant ? |
| `tra-gf-14` | 1 | transformation, fin | salon | la table (salon)* | jetons | Tu as 2 jetons. Tu gagnes 6 jetons. Combien de jetons as-tu maintenant ? |
| `tra-gf-15` | 1 | transformation, fin | jardin | le rosier | papillons | Il y a 2 papillons sur le rosier. 5 papillons arrivent. Combien de papillons y a-t-il sur le rosier maintenant ? |
| `tra-gf-16` | 2 | transformation, fin | salon | la tour de cubes | cubes | Ta tour a 9 cubes. Tu en ajoutes 6. Combien de cubes a ta tour maintenant ? |
| `tra-gf-17` | 2 | transformation, fin | etal | le pêcheur | maquereaux | Ce matin, le pêcheur a 12 maquereaux. Son bateau en rapporte 7 autres. Combien de maquereaux a-t-il maintenant ? |
| `tra-gf-18` | 2 | transformation, fin | ferme | — | canards | Il y a 9 canards sur la mare. 8 canards se posent à côté d'eux. Combien de canards y a-t-il sur la mare maintenant ? |
| `tra-pf-01` | 1 | transformation, fin | cuisine | l'assiette | biscuits | Il y a 8 biscuits dans l'assiette. Tu en manges 2. Combien de biscuits reste-t-il dans l'assiette ? |
| `tra-pf-02` | 1 | transformation, fin | parc | — | pigeons | 9 pigeons sont sur la pelouse. 4 pigeons s'envolent. Combien de pigeons reste-t-il sur la pelouse ? |
| `tra-pf-03` | 1 | transformation, fin | anniversaire | le gâteau d'anniversaire | bougies | Il y a 10 bougies allumées sur le gâteau. Tu en souffles 7. Combien de bougies sont encore allumées ? |
| `tra-pf-04` | 2 | transformation, fin | boulangerie | le boulanger, la boulangère | croissants | Le boulanger a 15 croissants. Il en vend 9. Combien de croissants lui reste-t-il ? |
| `tra-pf-05` | 2 | transformation, fin | plage | le seau | coquillages | Tu as 14 coquillages dans ton seau. Tu en perds 5 dans le sable. Combien de coquillages te reste-t-il ? |
| `tra-pf-06` | 2 | transformation, fin | animaux | le chat, la gamelle | croquettes | Il y a 17 croquettes dans la gamelle du chat. Le chat en mange 8. Combien de croquettes reste-t-il dans la gamelle ? |
| `tra-pf-07` | 6 | transformation, fin | marche | le marchand, la marchande | pommes | Il y a 58 pommes sur l'étal. Le marchand en vend 30. Combien de pommes reste-t-il sur l'étal ? |
| `tra-pf-08` | 6 | transformation, fin | classe | la maîtresse, la boîte | craies | La boîte contient 46 craies. La maîtresse en casse 4. Combien de craies entières reste-t-il dans la boîte ? |
| `tra-pf-09` | 6 | transformation, fin | foret | Papy, le panier | champignons | Il y a 39 champignons dans le panier. Papy en jette 6 qui ne sont pas bons. Combien de champignons reste-t-il dans le panier ? |
| `tra-pf-10` | 6 | transformation, fin | boulangerie | le boulanger, la boulangère | baguettes | Le matin, le boulanger a 42 baguettes. Il en vend 25. Combien de baguettes lui reste-t-il ? |
| `tra-pf-11` | 6 | transformation, fin | bus | le bus | personnes | Il y a 31 personnes dans le bus. À l'arrêt, 7 personnes descendent. Combien de personnes reste-t-il dans le bus ? |
| `tra-pf-12` | 6 | transformation, fin | jardin | le panier | fraises | Il y a 53 fraises dans le panier. Toute la famille en mange 18. Combien de fraises reste-t-il dans le panier ? |
| `tra-pf-13` | 6 | transformation, fin | etal | le pêcheur | sardines | Ce matin, le pêcheur a 23 sardines sur son étal. Il en vend 9. Combien de sardines lui reste-t-il ? |
| `tra-pf-14` | 1 | transformation, fin | cour | le coffre | enfants, ballons | Il y a 8 ballons dans le coffre de la cour. Les enfants en prennent 5. Combien de ballons reste-t-il dans le coffre ? |
| `tra-pf-15` | 1 | transformation, fin | etal | le pêcheur, le seau | crabes | Il y a 9 crabes dans le seau du pêcheur. Il en vend 3. Combien de crabes reste-t-il dans le seau ? |
| `tra-pf-16` | 1 | transformation, fin | boulangerie | le boulanger, la boulangère | baguettes | La boulangère a 7 baguettes. Elle en vend 4. Combien de baguettes lui reste-t-il ? |
| `tra-pf-17` | 2 | transformation, fin | cour | la maîtresse | cerceaux | Il y a 16 cerceaux dans la cour. La maîtresse en range 9. Combien de cerceaux reste-t-il dans la cour ? |
| `tra-pf-18` | 2 | transformation, fin | salon | la boîte | cartes | Au début du jeu, il y a 14 cartes dans la pioche. Tu en tires 6. Combien de cartes reste-t-il dans la pioche ? |
| `tra-pf-19` | 2 | transformation, fin | anniversaire | la table (salon)* | enfants, parts | Il y a 12 parts de gâteau. Les enfants en mangent 8. Combien de parts de gâteau reste-t-il ? |
| `tra-pf-20` | 2 | transformation, fin | kermesse | la caisse des lots | enfants, lots | Le stand de la pêche aux canards a 20 lots. Les enfants en gagnent 7. Combien de lots reste-t-il au stand ? |
| `tra-gc-01` | 4 | transformation, changement | chambre | Mamie | autocollants | Tu as 4 autocollants. Mamie t'en donne. Maintenant, tu as 9 autocollants. Combien d'autocollants Mamie t'a-t-elle donnés ? |
| `tra-gc-02` | 4 | transformation, changement | parc | — | canards | 5 canards nagent sur le lac. D'autres canards arrivent. Maintenant, il y a 8 canards. Combien de canards sont arrivés ? |
| `tra-gc-03` | 4 | transformation, changement | ferme | le clapier, le poulailler | lapins | Il y a 8 lapins dans le clapier. Des bébés lapins naissent. Maintenant, il y a 15 lapins. Combien de bébés lapins sont nés ? |
| `tra-gc-04` | 4 | transformation, changement | bus | le bus | personnes | Il y a 9 personnes dans le bus. À l'arrêt, des personnes montent. Maintenant, il y a 14 personnes. Combien de personnes sont montées ? |
| `tra-gc-05` | 6 | transformation, changement | bibliotheque | le carnet, le livre | pages | Tu as lu 20 pages de ton livre. Ce soir, tu en lis encore. Maintenant, tu as lu 30 pages. Combien de pages as-tu lues ce soir ? |
| `tra-gc-06` | 6 | transformation, changement | atelier | le collier, le bracelet | perles | Ton collier a 32 perles. Tu en ajoutes. Maintenant, il a 38 perles. Combien de perles as-tu ajoutées ? |
| `tra-gc-07` | 6 | transformation, changement | gymnase | — | points | Au début du match, ton équipe a 18 points. À la fin du match, elle a 26 points. Combien de points ton équipe a-t-elle marqués pendant le match ? |
| `tra-gc-08` | 6 | transformation, changement | ferme | la fermière | œufs, poules | La fermière a 27 œufs. Les poules en pondent d'autres. Maintenant, elle a 41 œufs. Combien d'œufs les poules ont-elles pondus ? |
| `tra-pc-01` | 4 | transformation, changement | cuisine | le bol | fraises | Il y a 7 fraises dans le bol. Tu en manges. Il en reste 3. Combien de fraises as-tu mangées ? |
| `tra-pc-02` | 4 | transformation, changement | classe | la maîtresse, le pupitre* | feutres | La maîtresse a 10 feutres. Elle en prête à un élève. Il lui en reste 6. Combien de feutres a-t-elle prêtés ? |
| `tra-pc-03` | 4 | transformation, changement | boulangerie | le boulanger, la boulangère | pains au chocolat | La boulangère a 16 pains au chocolat. Elle en vend. Il lui en reste 7. Combien de pains au chocolat a-t-elle vendus ? |
| `tra-pc-04` | 4 | transformation, changement | salon | la table (salon)* | jetons | Au début du jeu, tu as 18 jetons. Tu en perds. À la fin du jeu, tu as 11 jetons. Combien de jetons as-tu perdus ? |
| `tra-pc-05` | 6 | transformation, changement | supermarche | — | bouteilles | Le magasin a 45 bouteilles de lait. Il en vend. Il lui en reste 23. Combien de bouteilles de lait le magasin a-t-il vendues ? |
| `tra-pc-06` | 6 | transformation, changement | kermesse | la caisse des lots | enfants, lots | Il y a 60 lots dans la caisse. Les enfants en gagnent. Il en reste 20. Combien de lots les enfants ont-ils gagnés ? |
| `tra-pc-07` | 6 | transformation, changement | anniversaire | le sac | bonbons, enfants | Il y a 35 bonbons dans le sac. Les enfants en mangent. Il en reste 17. Combien de bonbons les enfants ont-ils mangés ? |
| `tra-pc-08` | 6 | transformation, changement | plage | — | personnes | Il y a 44 personnes sur la plage. Des personnes s'en vont. Il en reste 29. Combien de personnes sont parties ? |
| `tra-gd-01` | 8 | transformation, debut | chambre | — | billes | Tu avais des billes. Tu en gagnes 3. Maintenant, tu as 8 billes. Combien de billes avais-tu au début ? |
| `tra-gd-02` | 8 | transformation, debut | classe | la maîtresse, le pupitre* | cahiers | La maîtresse avait des cahiers. Elle en achète 8. Maintenant, elle a 17 cahiers. Combien de cahiers avait-elle au début ? |
| `tra-gd-03` | 8 | transformation, debut | bibliotheque | la table (salon)* | livres | La bibliothèque avait des livres. Elle en reçoit 30. Maintenant, elle a 80 livres. Combien de livres avait-elle au début ? |
| `tra-gd-04` | 8 | transformation, debut | ferme | la fermière | poules | La fermière avait des poules. Elle en achète 7. Maintenant, elle a 23 poules. Combien de poules avait-elle au début ? |
| `tra-gd-05` | 8 | transformation, debut | gymnase | — | points | Ton équipe avait des points. Elle marque encore 9 points. Maintenant, elle a 31 points. Combien de points avait ton équipe au début ? |
| `tra-pd-01` | 8 | transformation, debut | cuisine | la boîte | biscuits | Il y avait des biscuits dans la boîte. Tu en manges 2. Il en reste 6. Combien de biscuits y avait-il au début ? |
| `tra-pd-02` | 8 | transformation, debut | parc | — | enfants | Des enfants jouent au ballon. 4 enfants s'en vont. Il reste 5 enfants. Combien d'enfants jouaient au début ? |
| `tra-pd-03` | 8 | transformation, debut | boulangerie | le boulanger, la boulangère | croissants | Le boulanger avait des croissants. Il en vend 7. Il lui en reste 6. Combien de croissants avait-il au début ? |
| `tra-pd-04` | 8 | transformation, debut | animaux | le chien, la gamelle | croquettes | Il y avait des croquettes dans la gamelle. Le chien en mange 9. Il en reste 5. Combien de croquettes y avait-il au début ? |
| `tra-pd-05` | 8 | transformation, debut | bus | le bus | personnes | Il y avait des personnes dans le bus. 5 personnes descendent. Il en reste 23. Combien de personnes y avait-il au début ? |
| `tra-pd-06` | 8 | transformation, debut | atelier | le collier, le bracelet | perles | Tu avais des perles. Tu en utilises 12 pour un bracelet. Il t'en reste 25. Combien de perles avais-tu au début ? |
| `tra-pd-07` | 8 | transformation, debut | marche | le marchand, la marchande | melons | Le marchand avait des melons. Il en vend 18. Il lui en reste 14. Combien de melons avait-il au début ? |
| `cmp-e-01` | 5 | comparaison, ecart | chambre | ton copain | billes | Tu as 7 billes. Ton copain a 4 billes. Combien de billes as-tu de plus que ton copain ? |
| `cmp-e-02` | 5 | comparaison, ecart | cuisine | la table | cuillères, fourchettes | Sur la table, il y a 9 cuillères et 6 fourchettes. Combien y a-t-il de cuillères de plus que de fourchettes ? |
| `cmp-e-03` | 5 | comparaison, ecart | jardin | Papa, Maman | tomates | Papa a cueilli 8 tomates. Maman a cueilli 3 tomates. Combien de tomates Papa a-t-il cueillies de plus que Maman ? |
| `cmp-e-04` | 5 | comparaison, ecart | classe | le pupitre* | filles, garçons | Dans la classe, il y a 14 filles et 9 garçons. Combien y a-t-il de filles de plus que de garçons ? |
| `cmp-e-05` | 5 | comparaison, ecart | gymnase | — | points | L'équipe bleue a marqué 16 points. L'équipe rouge a marqué 11 points. Combien de points l'équipe bleue a-t-elle de plus que l'équipe rouge ? |
| `cmp-e-06` | 5 | comparaison, ecart | plage | ta voisine | coquillages | Ta cousine a 12 coquillages. Tu as 19 coquillages. Combien de coquillages as-tu de plus que ta cousine ? |
| `cmp-e-07` | 5 | comparaison, ecart | salon | ton copain, la table (salon)* | cartes | Tu as 15 cartes. Ton copain a 8 cartes. Combien de cartes ton copain a-t-il de moins que toi ? |
| `cmp-e-08` | 8 | comparaison, ecart | bibliotheque | ton copain, la table (salon)* | pages | Tu as lu 35 pages. Ton cousin a lu 23 pages. Combien de pages as-tu lues de plus que ton cousin ? |
| `cmp-e-09` | 8 | comparaison, ecart | kermesse | la table (cantine)* | gâteaux | Les CE1 ont vendu 48 gâteaux. Les CP ont vendu 30 gâteaux. Combien de gâteaux les CE1 ont-ils vendus de plus que les CP ? |
| `cmp-e-10` | 8 | comparaison, ecart | parc | — | enfants, adultes | Au parc, il y a 26 enfants et 14 adultes. Combien y a-t-il d'adultes de moins que d'enfants ? |
| `cmp-e-11` | 8 | comparaison, ecart | ferme | — | moutons, chèvres | La ferme a 42 moutons et 27 chèvres. Combien y a-t-il de moutons de plus que de chèvres ? |
| `cmp-e-12` | 8 | comparaison, ecart | marche | le marchand, la marchande | citrons, oranges | Le marchand a 31 citrons et 18 oranges. Combien y a-t-il de citrons de plus que d'oranges ? |
| `cmp-e-13` | 5 | comparaison, ecart | cour | — | filles, garçons | Dans la cour, il y a 8 filles et 5 garçons. Combien y a-t-il de filles de plus que de garçons ? |
| `cmp-e-14` | 5 | comparaison, ecart | salon | ton copain, la table (salon)* | jetons | Tu as 13 jetons. Ton copain a 9 jetons. Combien de jetons as-tu de plus que ton copain ? |
| `cmp-e-15` | 5 | comparaison, ecart | etal | le pêcheur | sardines, dorades | Le pêcheur a 17 sardines et 8 dorades. Combien y a-t-il de sardines de plus que de dorades ? |
| `cmp-e-16` | 5 | comparaison, ecart | boulangerie | le boulanger, la boulangère | croissants, pains au chocolat | La boulangère a 15 croissants et 6 pains au chocolat. Combien de pains au chocolat a-t-elle de moins que de croissants ? |
| `cmp-g-01` | 5 | comparaison, grand | chambre | ton copain | voitures | Ton copain a 5 petites voitures. Tu as 3 petites voitures de plus que lui. Combien de petites voitures as-tu ? |
| `cmp-g-02` | 5 | comparaison, grand | cuisine | Papa, Maman, l'assiette | crêpes | Maman a 4 crêpes dans son assiette. Papa a 2 crêpes de plus. Combien de crêpes Papa a-t-il ? |
| `cmp-g-03` | 5 | comparaison, grand | jardin | — | roses, tulipes | Il y a 9 roses dans le jardin. Il y a 6 tulipes de plus que de roses. Combien de tulipes y a-t-il ? |
| `cmp-g-04` | 5 | comparaison, grand | classe | ta voisine, la trousse | crayons | Ta trousse contient 8 crayons. La trousse de ta voisine en contient 5 de plus. Combien de crayons y a-t-il dans la trousse de ta voisine ? |
| `cmp-g-05` | 8 | comparaison, grand | gymnase | — | points | L'équipe rouge a marqué 24 points. L'équipe bleue a marqué 12 points de plus. Combien de points l'équipe bleue a-t-elle marqués ? |
| `cmp-g-06` | 8 | comparaison, grand | bibliotheque | le carnet, le livre | pages | Le livre de contes a 40 pages. Le livre des dinosaures a 20 pages de plus. Combien de pages a le livre des dinosaures ? |
| `cmp-g-07` | 8 | comparaison, grand | ferme | la fermière | poules, canards | La fermière a 26 poules. Elle a 17 canards de plus que de poules. Combien de canards a-t-elle ? |
| `cmp-g-08` | 5 | comparaison, grand | cour | — | enfants | Ce matin, 8 enfants jouent au ballon. Cet après-midi, il y en a 7 de plus. Combien d'enfants jouent au ballon cet après-midi ? |
| `cmp-g-09` | 5 | comparaison, grand | jardin | Papa, Maman | salades | Papa a planté 4 salades. Maman a planté 3 salades de plus que lui. Combien de salades Maman a-t-elle plantées ? |
| `cmp-g-10` | 5 | comparaison, grand | chambre | ton copain | voitures | Tu as 7 petites voitures. Ton copain a 6 petites voitures de plus que toi. Combien de petites voitures ton copain a-t-il ? |
| `cmp-p-01` | 5 | comparaison, petit | chambre | ton copain | images | Tu as 9 images. Ton copain a 4 images de moins que toi. Combien d'images ton copain a-t-il ? |
| `cmp-p-02` | 5 | comparaison, petit | parc | le toboggan, les balançoires, le bac à sable | enfants | Il y a 10 enfants sur les balançoires. Sur le toboggan, il y a 3 enfants de moins. Combien d'enfants y a-t-il sur le toboggan ? |
| `cmp-p-03` | 5 | comparaison, petit | boulangerie | le boulanger, la boulangère | baguettes, pains de campagne | Le boulanger a fait 18 baguettes. Il a fait 6 pains de campagne de moins. Combien de pains de campagne a-t-il faits ? |
| `cmp-p-04` | 8 | comparaison, petit | cantine | la table (cantine)* | enfants | À la cantine, 47 enfants ont pris de la soupe. 20 enfants de moins ont pris de la salade. Combien d'enfants ont pris de la salade ? |
| `cmp-p-05` | 8 | comparaison, petit | bus | le minibus, le car | places | Le grand car a 52 places. Le petit car a 19 places de moins. Combien de places a le petit car ? |
| `cmp-p-06` | 5 | comparaison, petit | salon | ton copain, la table (salon)* | cartes | Tu as 16 cartes. Ton copain a 7 cartes de moins que toi. Combien de cartes ton copain a-t-il ? |
| `cmp-p-07` | 5 | comparaison, petit | ferme | — | vaches, chevaux | Il y a 9 vaches dans le pré. Il y a 2 chevaux de moins que de vaches. Combien de chevaux y a-t-il ? |
| `cmp-p-08` | 5 | comparaison, petit | etal | le pêcheur | maquereaux | Lundi, le pêcheur a vendu 18 maquereaux. Mardi, il en a vendu 5 de moins. Combien de maquereaux a-t-il vendus mardi ? |
| `grp-01` | 3 | groupes-egaux, tout | cuisine | Maman, l'assiette ×3, la table | crêpes | Maman pose 3 assiettes sur la table. Dans chaque assiette, elle met 2 crêpes. Combien de crêpes y a-t-il en tout ? |
| `grp-02` | 3 | groupes-egaux, tout | ferme | le nid ×3, le clapier, le poulailler | œufs | Il y a 3 nids dans le poulailler. Dans chaque nid, il y a 4 œufs. Combien d'œufs y a-t-il en tout ? |
| `grp-03` | 3 | groupes-egaux, tout | chambre | la boîte ×2 | billes | Tu as 2 boîtes. Dans chaque boîte, il y a 5 billes. Combien de billes as-tu en tout ? |
| `grp-04` | 3 | groupes-egaux, tout | jardin | Papa, le vase ×3 | fleurs | Papa remplit 3 vases. Dans chaque vase, il met 5 fleurs. Combien de fleurs Papa a-t-il mises dans les vases ? |
| `grp-05` | 3 | groupes-egaux, tout | classe | le pot à crayons ×4 | crayons | Il y a 4 pots sur les tables. Dans chaque pot, il y a 3 crayons. Combien de crayons y a-t-il en tout ? |
| `grp-06` | 3 | groupes-egaux, tout | parc | le banc ×4 | personnes | Il y a 4 bancs au parc. Sur chaque banc, 2 personnes sont assises. Combien de personnes sont assises sur les bancs ? |
| `grp-07` | 7 | groupes-egaux, tout | animaux | Papa, le chien, le sachet ×3, la gamelle | gourmandises | Papa vide 3 sachets de gourmandises dans la gamelle du chien. Chaque sachet contient 6 gourmandises. Combien de gourmandises y a-t-il dans la gamelle ? |
| `grp-08` | 7 | groupes-egaux, tout | boulangerie | le boulanger, la boulangère, le sachet ×5 | croissants | La boulangère remplit 5 sachets. Dans chaque sachet, elle met 4 croissants. Combien de croissants a-t-elle mis dans les sachets ? |
| `grp-09` | 7 | groupes-egaux, tout | supermarche | Maman, la boîte d'œufs ×4 | œufs | Maman achète 4 boîtes d'œufs. Chaque boîte contient 6 œufs. Combien d'œufs Maman achète-t-elle ? |
| `grp-10` | 7 | groupes-egaux, tout | classe | la maîtresse, le cerceau ×5 | élèves | La maîtresse fait 5 équipes. Dans chaque équipe, il y a 4 élèves. Combien d'élèves y a-t-il dans les équipes ? |
| `grp-11` | 7 | groupes-egaux, tout | marche | le marchand, la marchande, le panier ×3 | pommes | Le marchand prépare 3 paniers. Dans chaque panier, il met 10 pommes. Combien de pommes a-t-il mises dans les paniers ? |
| `grp-12` | 7 | groupes-egaux, tout | atelier | le collier, le bracelet ×2 | perles | Tu fabriques 2 colliers. Chaque collier a 9 perles. Combien de perles as-tu utilisées ? |
| `grp-13` | 7 | groupes-egaux, tout | anniversaire | des enfants ×6, la table (salon)* | ballons | Il y a 6 enfants à la fête. Chaque enfant reçoit 2 ballons. Combien de ballons faut-il en tout ? |
| `grp-14` | 7 | groupes-egaux, tout | gymnase | le filet de ballons ×5 | ballons | Il y a 5 filets de ballons. Dans chaque filet, il y a 5 ballons. Combien de ballons y a-t-il en tout ? |
| `grp-15` | 7 | groupes-egaux, tout | ferme | la vache ×7 | pattes | Il y a 7 vaches dans le pré. Chaque vache a 4 pattes. Combien de pattes y a-t-il en tout ? |
| `grp-16` | 7 | groupes-egaux, tout | jardin | Papy, la rangée ×4 | salades | Papy plante 4 rangées de salades. Dans chaque rangée, il y a 5 salades. Combien de salades Papy a-t-il plantées ? |
| `grp-17` | 7 | groupes-egaux, tout | cantine | la table ×3 | enfants | À la cantine, il y a 3 tables. Autour de chaque table, il y a 8 enfants. Combien d'enfants y a-t-il autour des tables ? |
| `grp-18` | 7 | groupes-egaux, tout | bibliotheque | le soir ×4 | pages | Chaque soir, tu lis 5 pages. Tu as lu pendant 4 soirs. Combien de pages as-tu lues ? |
| `grp-19` | 7 | groupes-egaux, tout | etal | le pêcheur, la cagette ×4 | maquereaux | Le pêcheur remplit 4 cagettes. Dans chaque cagette, il met 5 maquereaux. Combien de maquereaux a-t-il mis dans les cagettes ? |
| `grp-20` | 7 | groupes-egaux, tout | classe | la maîtresse, le paquet ×4 | feutres | La maîtresse achète 4 paquets de feutres. Chaque paquet contient 10 feutres. Combien de feutres achète-t-elle ? |
| `grp-21` | 7 | groupes-egaux, tout | supermarche | Papa, le pack d'eau ×6 | bouteilles | Papa achète 6 packs d'eau. Dans chaque pack, il y a 6 bouteilles. Combien de bouteilles Papa achète-t-il ? |
| `grp-22` | 7 | groupes-egaux, tout | kermesse | la boîte ×5 | gâteaux | Pour la kermesse, il y a 5 boîtes de gâteaux. Chaque boîte contient 10 gâteaux. Combien de gâteaux y a-t-il ? |
| `grp-23` | 7 | groupes-egaux, tout | bus | la rangée ×8, le minibus, le car | sièges | Dans le petit car, il y a 8 rangées de sièges. Chaque rangée a 4 sièges. Combien de sièges y a-t-il dans le petit car ? |
| `grp-24` | 7 | groupes-egaux, tout | ferme | la fermière, la boîte d'œufs ×7 | œufs | La fermière remplit 7 boîtes. Dans chaque boîte, elle met 6 œufs. Combien d'œufs a-t-elle mis dans les boîtes ? |
| `grp-25` | 7 | groupes-egaux, tout | foret | des enfants ×9 | châtaignes, enfants | Il y a 9 enfants dans la forêt. Chaque enfant ramasse 5 châtaignes. Combien de châtaignes les enfants ont-ils ramassées ? |
| `par-v-01` | 3 | partage, part | cuisine | ton copain, l'assiette ×2 | fraises | Tu as 6 fraises. Tu les partages entre toi et ton copain. Vous en avez autant chacun. Combien de fraises chacun a-t-il ? |
| `par-v-02` | 3 | partage, part | chambre | l'étagère ×3 | peluches | Tu ranges 9 peluches sur 3 étagères. Il y a autant de peluches sur chaque étagère. Combien de peluches y a-t-il sur chaque étagère ? |
| `par-v-03` | 3 | partage, part | classe | la maîtresse, le pot à crayons ×3 | crayons | La maîtresse a 12 crayons. Elle les met dans 3 pots. Chaque pot a le même nombre de crayons. Combien de crayons y a-t-il dans chaque pot ? |
| `par-v-04` | 3 | partage, part | anniversaire | Maman, des enfants ×2, la table (salon)* | bonbons | Maman partage 10 bonbons entre 2 enfants. Chaque enfant en a autant. Combien de bonbons chaque enfant a-t-il ? |
| `par-v-05` | 7 | partage, part | animaux | le chat ×2 | croquettes | Il y a 16 croquettes. Tu les partages entre les 2 chats. Chaque chat en a autant. Combien de croquettes chaque chat a-t-il ? |
| `par-v-06` | 7 | partage, part | boulangerie | le boulanger, la boulangère, le plateau ×4 | croissants | Le boulanger range 20 croissants sur 4 plateaux. Il met autant de croissants sur chaque plateau. Combien de croissants y a-t-il sur chaque plateau ? |
| `par-v-07` | 7 | partage, part | jardin | Papa, la rangée ×3 | salades | Papa plante 15 salades en 3 rangées. Il y a autant de salades dans chaque rangée. Combien de salades y a-t-il dans chaque rangée ? |
| `par-v-08` | 7 | partage, part | gymnase | le cerceau ×3 | enfants | 18 enfants font 3 équipes. Chaque équipe a autant d'enfants. Combien d'enfants y a-t-il dans chaque équipe ? |
| `par-v-09` | 7 | partage, part | classe | la maîtresse, le cerceau ×5 | feuilles | La maîtresse partage 35 feuilles entre 5 groupes. Chaque groupe en reçoit autant. Combien de feuilles reçoit chaque groupe ? |
| `par-v-10` | 7 | partage, part | ferme | la fermière, la boîte d'œufs ×6 | œufs | La fermière range 36 œufs dans 6 boîtes. Chaque boîte contient autant d'œufs. Combien d'œufs y a-t-il dans chaque boîte ? |
| `par-v-11` | 7 | partage, part | kermesse | la table ×4 | gâteaux | On partage 40 gâteaux entre 4 tables. Chaque table en reçoit autant. Combien de gâteaux reçoit chaque table ? |
| `par-v-12` | 7 | partage, part | marche | le marchand, la marchande, le panier ×5 | pommes | Le marchand met 45 pommes dans 5 paniers. Il y a autant de pommes dans chaque panier. Combien de pommes y a-t-il dans chaque panier ? |
| `par-n-01` | 3 | partage, parts | cuisine | l'assiette ? | biscuits | Tu as 8 biscuits. Tu en mets 2 dans chaque assiette. Combien d'assiettes peux-tu remplir ? |
| `par-n-02` | 3 | partage, parts | chambre | le sachet ? | billes | Tu as 10 billes. Tu en mets 5 dans chaque sachet. Combien de sachets te faut-il ? |
| `par-n-03` | 3 | partage, parts | jardin | le vase ? | fleurs | Tu as 12 fleurs. Tu fais des bouquets de 4 fleurs. Combien de bouquets peux-tu faire ? |
| `par-n-04` | 3 | partage, parts | parc | la barque ? | enfants | 9 enfants veulent faire un tour de barque. Dans chaque barque, il y a 3 places. Combien de barques faut-il ? |
| `par-n-05` | 7 | partage, parts | classe | la maîtresse, le carnet, le livre ? | pages | La maîtresse fabrique des carnets. Elle a 28 pages. Elle utilise 4 pages pour chaque carnet. Combien de carnets peut-elle fabriquer ? |
| `par-n-06` | 7 | partage, parts | boulangerie | le boulanger, la boulangère, le sachet ? | croissants | La boulangère a 20 croissants. Elle en met 5 dans chaque sachet. Combien de sachets remplit-elle ? |
| `par-n-07` | 7 | partage, parts | gymnase | le cerceau ? | enfants | 24 enfants font des équipes de 6 enfants. Combien d'équipes y a-t-il ? |
| `par-n-08` | 7 | partage, parts | ferme | la fermière, la boîte d'œufs ? | œufs | La fermière a 18 œufs. Elle les range par 6 dans des boîtes. Combien de boîtes remplit-elle ? |
| `par-n-09` | 7 | partage, parts | atelier | le collier, le bracelet ? | perles | Tu as 40 perles. Il faut 10 perles pour faire un bracelet. Combien de bracelets peux-tu faire ? |
| `par-n-10` | 7 | partage, parts | bus | le minibus, le car ? | enfants, places | 36 enfants partent en sortie. Dans chaque minibus, il y a 9 places. Combien de minibus faut-il ? |
| `par-n-11` | 7 | partage, parts | supermarche | le paquet ? | yaourts | Le magasin a 32 yaourts. Il les vend par paquets de 4. Combien de paquets de yaourts y a-t-il ? |
| `par-n-12` | 7 | partage, parts | cantine | la table ? | enfants | Il y a 42 enfants à la cantine. On met 6 enfants à chaque table. Combien de tables faut-il ? |
| `etp-01` | 9 | deux-etapes | chambre | ton copain | billes | Tu as 6 billes. Ton copain t'en donne 5. Puis tu en perds 3. Combien de billes as-tu à la fin ? |
| `etp-02` | 9 | deux-etapes | cuisine | Papa, la boîte | biscuits | Il y a 12 biscuits dans la boîte. Tu en manges 2, et Papa en mange 3. Combien de biscuits reste-t-il dans la boîte ? |
| `etp-03` | 9 | deux-etapes | bus | le bus | personnes | Il y a 10 personnes dans le bus. À l'arrêt, 4 personnes descendent et 6 personnes montent. Combien de personnes y a-t-il dans le bus maintenant ? |
| `etp-04` | 9 | deux-etapes | jardin | Papa, Maman | tomates | Papa cueille 7 tomates. Maman en cueille 8. Toute la famille en mange 5 au déjeuner. Combien de tomates reste-t-il ? |
| `etp-05` | 9 | deux-etapes | anniversaire | Mamie, le sachet ×2 | bonbons, sucettes, friandises | Pour la fête, Mamie achète 2 sachets de 5 bonbons. Elle achète aussi 4 sucettes. Combien de friandises Mamie achète-t-elle ? |
| `etp-06` | 9 | deux-etapes | bibliotheque | le carnet, le livre | pages | Ton livre a 50 pages. Lundi, tu lis 10 pages. Mardi, tu lis 20 pages. Combien de pages te reste-t-il à lire ? |
| `etp-07` | 9 | deux-etapes | kermesse | la caisse des lots | enfants, lots | Le stand a 40 lots. Le matin, les enfants en gagnent 10. L'après-midi, ils en gagnent 20. Combien de lots reste-t-il ? |
| `etp-08` | 9 | deux-etapes | boulangerie | le boulanger, la boulangère | croissants, pains au chocolat, viennoiseries | Le boulanger fait 30 croissants et 25 pains au chocolat. Il en vend 40 en tout. Combien de viennoiseries lui reste-t-il ? |
| `etp-09` | 9 | deux-etapes | marche | le marchand, la marchande, le panier ×3, la table | pommes | Le marchand prépare 3 paniers de 10 pommes. Il a aussi 6 pommes sur la table. Combien de pommes a-t-il en tout ? |
| `etp-10` | 9 | deux-etapes | ferme | la fermière | poules, canards | La fermière a 24 poules et 12 canards. Elle vend 5 canards. Combien d'animaux lui reste-t-il ? |
| `etp-11` | 9 | deux-etapes | gymnase | — | points | Ton équipe marque 12 points au premier jeu et 15 points au deuxième jeu. L'autre équipe a marqué 20 points en tout. Combien de points ton équipe a-t-elle de plus que l'autre équipe ? |
| `etp-12` | 9 | deux-etapes | bus | le bus | personnes | Il y a 26 personnes dans le bus. À l'arrêt, 8 personnes descendent et 13 personnes montent. Combien de personnes y a-t-il dans le bus maintenant ? |
| `etp-13` | 9 | deux-etapes | classe | le pupitre* | élèves | L'école a 3 classes. Il y a 24 élèves dans la première, 23 dans la deuxième et 25 dans la troisième. Combien d'élèves y a-t-il dans l'école ? |
| `etp-14` | 9 | deux-etapes | marche | Papa, le boulanger, la boulangère, le marchand, la marchande | euros | Papa a 50 euros. Il dépense 18 euros chez le marchand de fruits et 14 euros chez le boulanger. Combien d'euros lui reste-t-il ? |
| `etp-15` | 9 | deux-etapes | foret | Mamie | châtaignes | Le matin, tu ramasses 17 châtaignes. L'après-midi, tu en ramasses 16. Tu en donnes 9 à Mamie. Combien de châtaignes te reste-t-il ? |
| `etp-16` | 9 | deux-etapes | cantine | le cuisinier, le plateau ×4 | yaourts, enfants | Le cuisinier prépare 4 plateaux de 10 yaourts. Les enfants en mangent 27. Combien de yaourts reste-t-il ? |
