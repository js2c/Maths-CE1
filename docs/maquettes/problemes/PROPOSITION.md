# « Problèmes » : la maquette et les questions à trancher

Maquette de l'exercice « Problèmes de la vie courante » (`docs/SPEC.md`, section 13, « Problèmes » ; `docs/IDEES.md`, sections 1 et 3), **préparée avant le lot, pour validation du parent**, comme le veut la règle du 30 septembre (`docs/IDEES.md`, section 1 : aucun exercice nouveau en code sans maquette validée). Rien n'est codé dans l'application : `app/`, `docs/SPEC.md`, `docs/LOTS.md` et `docs/IDEES.md` ne sont pas modifiés.

**Ce qui est livré** :

1. **La banque** : 170 énoncés de la vie courante, `art/problemes/enonces.json`, à relire dans **`ENONCES.md`** (ce dossier). Contrôlée par `node art/problemes/verifier.mjs` (réponses, calculs, aides, difficultés).
2. **La maquette des écrans clés** : `art/problemes/index.html`, captures `01-enonce.png` à `09-deux-etapes.png` (ce dossier) ; la planche des dessins nouveaux de l'atelier : `00-planche.png`.
3. **Les contextes d'illustration** : 22 lieux réutilisables et le prompt Nano Banana de chacun, `art/problemes/contextes.json` (section 4).
4. **Les phrases à fabriquer et leur poids** : **`PHRASES.md`** (ce dossier), par `node art/problemes/phrases.mjs` (section 6).
5. **Les questions à trancher**, avec une recommandation pour chacune : **section 7**.

**Le point le plus important** : la voix. Il reste **3,8 Mo** sous le plafond de 85 Mo ; la banque demande **759 phrases, environ 6,6 Mo**. Il faut relever le plafond ou alléger (question 1).

## 1. Ce que dit la spécification

- Des **situations de la vie courante**, pas seulement marines (décision du parent du 30 septembre), **lues à voix haute** (l'énoncé n'est pas à lire), **illustrées**, réécoutables, **réponse au pavé**.
- Les **structures** : additives (réunion ; transformation, avec le début, le changement ou la fin inconnu ; comparaison) ; dès le départ, avec de petits nombres, **groupes égaux** et **partage** (valeur d'une part, nombre de parts), résolus **sans le signe ×**, en groupant des objets ou par additions répétées ; **deux étapes** ensuite.
- **Aide après une erreur** : le **schéma en barres** (le tout et ses parties) pour les problèmes additifs, des **objets à grouper** pour les autres.
- Restaient ouverts (`docs/IDEES.md`, section 3) : la place dans la séance, la banque d'énoncés face à la limite de la voix, les illustrations (un générateur d'images compte mal : l'image montre le lieu, les quantités sont dessinées par l'application ou dites par la voix), le crabe.
- Le point de départ de l'enfant : **résoudre des problèmes 2,5/3** à l'évaluation Repères de septembre (`docs/SPEC.md`, section 1) : ce n'est pas un point faible ; l'exercice entretient et fait progresser une compétence d'usage.

## 2. Les écrans (la maquette)

La maquette est faite avec les pièces de l'application (le lagon, le pavé, le coquillage, « je ne sais pas », la mascotte, la maison, les étoiles) et les dessins nouveaux de l'atelier (`art/src/canvas-core/sea/problemes.ts`, style A : aplats, une ombre nette, contour épais côté ombre). La bulle écrit ce que dit la voix, comme dans l'application. Le fil des écrans 1 à 5 est un même problème : « Ce matin, le pêcheur a 23 sardines sur son étal. Il en vend 9. Combien de sardines lui reste-t-il ? ».

| Capture | Ce qu'on voit |
| --- | --- |
| `01-enonce.png` | **L'énoncé lu.** En haut, l'illustration du lieu dans un cadre de nacre (ici, l'étal du pêcheur, déjà dans l'application : c'est aussi l'image de référence du style des contextes à générer). Au bas de l'illustration, une **étiquette par donnée** (le nombre et l'objet, dessiné par le code) qui **s'allume quand la voix la dit** ; à droite, la **plaque de la réponse**, au « ? » rouge. Dessous, le pavé, le coquillage et « je ne sais pas », aux places de tous les exercices. |
| `02-question.png` | La deuxième donnée dite, puis la question. |
| `03-pave.png` | La réponse tapée au pavé s'écrit dans la plaque (ici 32 : l'enfant a ajouté au lieu d'enlever, l'erreur la plus fréquente). |
| `04-erreur-barres.png` | **Après l'erreur, le schéma en barres** prend la place du pavé : en haut le tout (23), en dessous les deux parties (« ? » hachuré et 9). « Regarde le schéma. On connaît le tout et une partie : on enlève la partie. » |
| `05-correction.png` | **La correction** : la partie trouvée s'allume (14), le calcul s'écrit sur une plaque (« 23 − 9 = 14 »), la plaque de la réponse passe au vert ; la voix dit la correction dans l'histoire : « 23 sardines, 9 de moins, il en reste 14. » |
| `06-groupes.png` | **Groupes égaux, les objets groupés** : 4 cagettes de 5 maquereaux, comptées par bonds (5, 10, 15, 20, écrits dessous), la cagette comptée s'allume. Sans le signe × ; l'étiquette « 4 » n'a pas d'objet (ce sont les cagettes). |
| `07-partage.png` | **Partage, les objets à grouper** : 12 crayons à mettre dans 3 boîtes ; l'enfant les fait glisser un à un (« Mets-en autant dans chaque boîte. »). Ici, 2 dans chaque boîte, un crayon en train de glisser. Illustration à générer (la classe). |
| `08-comparaison.png` | **La comparaison** : deux barres alignées à gauche, le plus grand en haut ; l'écart, en pointillés au bout du plus petit (ici connu, 5 : « La trousse de ta voisine en contient 5 de plus. » ; on cherche la barre du haut). |
| `09-deux-etapes.png` | **Deux étapes** : deux schémas côte à côte, numérotés 1 et 2 ; le premier déjà résolu (10 − 4 = 6), le second à résoudre (6 + 6). Trois données : les étiquettes rétrécissent pour tenir sur une ligne. |
| `00-planche.png` | Les dessins nouveaux de l'atelier, en grand : les **13 objets** qu'on compte (bille, biscuit, pomme, œuf, crayon, ballon, bonbon, fleur, perle, livre, poisson, petit personnage de bois, jeton), les **5 contenants** et l'anneau de corde (sachet transparent, assiette, cagette, panier, bocal), les barres (question et correction), la comparaison, les étiquettes, la plaque de la réponse. |

Les objets sont des pions de classe plus que des dessins réalistes, pour rester comptables à 40 px : un **jeton** jaune remplace tout objet qui n'a pas son dessin (animaux, croissants, cartes… 70 énoncés sur 170). Les personnes sont de petits personnages de bois aux couleurs variées.

## 3. La banque d'énoncés

**170 énoncés** (la demande : 150 à 200), à relire dans `ENONCES.md`. Chacun : sa structure et ce qui est inconnu, sa difficulté, son contexte d'illustration, l'objet dessiné (et son contenant), l'énoncé (une à trois phrases courtes), la question, la réponse et le calcul, l'aide (barres, comparaison, groupes, deux schémas), la correction dite.

| Structure | 1 | 2 | 3 | 4 | Total | Réponses différentes |
| --- | --- | --- | --- | --- | --- | --- |
| réunion, le tout inconnu | 4 | 4 | 4 | 4 | 16 | 14 |
| réunion, une partie inconnue | 3 | 3 | 3 | 3 | 12 | 9 |
| transformation, gain, fin inconnue | 3 | 3 | 3 | 3 | 12 | 12 |
| transformation, perte, fin inconnue | 3 | 3 | 3 | 4 | 13 | 11 |
| transformation, gain, changement inconnu | 2 | 2 | 2 | 2 | 8 | 7 |
| transformation, perte, changement inconnu | 2 | 2 | 2 | 2 | 8 | 7 |
| transformation, gain, début inconnu | 1 | 1 | 1 | 2 | 5 | 5 |
| transformation, perte, début inconnu | 2 | 2 | 2 | 1 | 7 | 7 |
| comparaison, l'écart inconnu | 3 | 4 | 3 | 2 | 12 | 7 |
| comparaison, le plus grand inconnu | 2 | 2 | 2 | 1 | 7 | 7 |
| comparaison, le plus petit inconnu | 2 | 1 | 1 | 1 | 5 | 5 |
| groupes égaux | 6 | 13 | 6 | · | 25 | 17 |
| partage, la valeur d'une part | 4 | 4 | 4 | · | 12 | 8 |
| partage, le nombre de parts | 4 | 4 | 4 | · | 12 | 5 |
| deux étapes | · | 5 | 6 | 5 | 16 | 13 |
| **Total** | **41** | **53** | **46** | **30** | **170** | 43 |

- **La difficulté** ne mesure que le calcul : pour les problèmes additifs, **1** jusqu'à 10, **2** jusqu'à 20, **3** au-delà de 20 sans passage de la dizaine, **4** avec ; groupes égaux et partage, de 1 à 3 selon le nombre d'objets (règle exacte : `art/problemes/README.md`). Tous les nombres restent sous 100 ; le partage tombe toujours juste.
- **Les pièges classiques sont là exprès** : « de plus » qui demande une soustraction (« Combien de billes as-tu de plus que ton copain ? »), « de moins » qui demande une addition (début inconnu : « Le boulanger avait des croissants. Il en vend 7. Il lui en reste 6. »).
- **Les trois exemples du parent** sont dans la banque, mot pour mot ou presque : `grp-07` (les gourmandises du chien), `par-n-05` (les carnets de la maîtresse), `tra-gf-10` (les ballons de l'école).
- **Écriture** : aucun prénom (« tu », Papa, Maman, Mamie, Papy, la maîtresse, ton copain, ta voisine…) ; nombres en chiffres (la voix les dit en lettres) ; jamais le nombre 1 ; la question seule à la fin ; la réponse jamais dite dans l'énoncé (règles et contrôles : `art/problemes/README.md`).

## 4. Les illustrations : 22 contextes réutilisables

Une **image par lieu**, réutilisée par tous les énoncés de ce lieu, et non une image par énoncé : 22 images au lieu de 170, un style tenu, et surtout **aucune quantité dans l'image** (un générateur compte mal, et une image de « 3 sachets » ne pourrait servir qu'à un seul énoncé). Le lieu porte l'histoire ; les quantités sont portées par les étiquettes, les objets et les barres, dessinés par le code.

| Contexte | Énoncés | Contexte | Énoncés |
| --- | --- | --- | --- |
| la classe | 16 | le parc | 10 |
| la ferme | 15 | le gymnase et le stade | 10 |
| la chambre | 12 | la bibliothèque | 9 |
| la cuisine | 11 | la boulangerie | 9 |
| le jardin et le potager | 11 | le marché | 8 |
| le bus et le car | 11 | la fête de l'école | 8 |
| l'anniversaire | 7 | le magasin | 6 |
| la cantine | 5 | l'atelier de bricolage | 5 |
| la plage | 4 | la forêt | 4 |
| le coin du chien et du chat | 4 | le salon (jeux de société) | 2 |
| l'étal du pêcheur (**déjà fait** : le décor de l'étal) | 2 | la cour de l'école | 1 |

**Le prompt** (`art/problemes/contextes.json`) : un prompt de base, en anglais comme ceux du journal de conception, où l'on remplace `[SCENE]` (le lieu) et `[ABSENT]` (ce qui ne doit pas y être). On joint **l'image de l'étal par beau temps** (`art/etal/sources/etal-beau-temps.jpg`), générée par le parent, et on commence par « Same illustration style, line work, colour palette, lighting and level of detail as the attached image. » Le prompt demande : paysage 16:9 ; le style BD au marqueur (contours épais, aplats, une ombre nette, lumière en haut à gauche) ; le quart du bas calme (les étiquettes s'y posent) ; **ni personne, ni animal, ni groupe d'objets identiques** ; aucun texte, aucun chiffre, ni horloge, ni prix. Exemple, la ferme : « a farmyard: a red barn, a henhouse with its little ramp, a meadow with a wooden fence, a tractor, hills behind. » et « No hens, no eggs, no cows, no sheep, no rabbits, no ducks; the meadow and the henhouse are empty. »

L'image est montrée à 620 × 350 dans la scène de 1280 × 800 : une fois en 1920 × 1080 générée, l'atelier la réduirait en WebP (@1x et @2x), comme les images de l'étal : environ 22 × 80 Ko, moins de 2 Mo.

## 5. Les niveaux proposés

L'ordre suit la difficulté des structures (les recherches sur les problèmes additifs, Vergnaud, et l'ordre des manuels de CE1) puis celle des nombres. Le compte de la banque par niveau :

| Niveau | Ce qui est travaillé | Énoncés |
| --- | --- | --- |
| 1 | ajouter, enlever : la réunion et la transformation, la fin inconnue, jusqu'à 10 | 10 |
| 2 | les mêmes, jusqu'à 20 | 10 |
| 3 | groupes égaux et partage, petits nombres, en groupant des objets | 14 |
| 4 | chercher une partie ou le changement, jusqu'à 20 | 14 |
| 5 | comparer (« de plus », « de moins »), jusqu'à 20 | 7 |
| 6 | les structures des niveaux 1, 2, 4 et 5, jusqu'à 100 | 40 |
| 7 | groupes égaux et partage, jusqu'à 50 | 35 |
| 8 | les pièges : le début inconnu, la comparaison où « de plus » demande d'enlever | 24 |
| 9 | deux étapes | 16 |

Les niveaux 1, 2 et 5 sont **minces** (7 à 10 énoncés) : à un ou deux problèmes par séance, ils dureraient trois à cinq semaines avant qu'un énoncé ne revienne. Si la maquette est validée, une dizaine d'énoncés de plus à chacun (la banque passerait à 200, environ 0,9 Mo de voix de plus).

## 6. La voix : les phrases et leur poids

Mesures de `node art/problemes/phrases.mjs` (détail et liste complète : `PHRASES.md`). Le poids d'une phrase nouvelle est estimé d'après les 11 377 fichiers déjà fabriqués (environ 190 octets par lettre lue) ; l'estimation redonne exactement leur poids réel.

| | Phrases nouvelles | Poids estimé |
| --- | --- | --- |
| **Aujourd'hui** : dossier de la voix | 11 377 | **81,2 Mo** sur un plafond de **85 Mo** : il reste **3,8 Mo** |
| les énoncés (351 phrases), les questions (168), les phrases communes proposées (30) | 549 | 4,3 Mo |
| **+ les corrections dans l'histoire** (« 23 sardines, 9 de moins, il en reste 14. », 210 phrases) | **759** | **6,6 Mo** (2,8 Mo de trop) |
| ou **+ les corrections par le calcul seul** (« 23 moins 9, ça fait 14. » : 163 phrases, dont 43 déjà fabriquées) | 669 | 5,3 Mo (1,5 Mo de trop) |

**Même sans aucune correction propre, la banque ne tient pas** sous le plafond actuel. Environ 36 minutes de parole à fabriquer sur l'ordinateur du parent. Les phrases communes (consigne, aides, erreurs repérées) sont une proposition, dans `art/problemes/phrases.mjs`.

## 7. Les questions à trancher

**1. La voix : relever le plafond ?** La banque demande 6,6 Mo ; il reste 3,8 Mo.
- (a) **Relever le plafond à 95 Mo** (comme au lot « La boutique du récif », de 80 à 85) : la banque entière, corrections dans l'histoire comprises, et 3 Mo de marge pour le lot suivant. Le stockage hors ligne passe d'environ 135 à 142 Mo.
- (b) Corrections par le calcul seul : 5,3 Mo, le plafond reste trop bas (relever à 90 Mo).
- (c) Baisser le débit de toute la voix (environ 24 kbit/s aujourd'hui ; à 16 kbit/s, environ un tiers de moins, près de 28 Mo) : il faut réencoder toute la voix et la réécouter.
- (d) Une banque réduite à environ 90 énoncés : trop peu pour neuf niveaux.

**Recommandation : (a), 95 Mo, et les corrections dans l'histoire.** Elles relient le calcul à l'histoire, ce qui est tout l'enjeu de l'exercice ; le calcul seul (« 23 moins 9 ») reste écrit sur la plaque du calcul.

**2. La place dans la séance** (`docs/IDEES.md`, section 3).
- (a) L'étape fixe **« Problème du jour »**, déjà prévue dans le déroulé de la séance (`docs/SPEC.md`, section 2) : un problème (deux s'il reste du temps), après le défi, environ 1 min 30.
- (b) Un **septième exercice** dans « choisir » (après la ligne, les additions, le calcul rapide, les voiliers, la multiplication et l'étal), avec ses neuf niveaux.
- (c) Les deux.

**Recommandation : (c).** L'étape fixe fait du problème une habitude de chaque soir (c'est une compétence d'usage, et 1 ou 2 problèmes suffisent) ; l'exercice à choisir permet une séance entière quand le parent le souhaite. Le niveau de l'étape fixe suit celui de l'exercice. L'étape fixe n'entre pas dans la rotation de « jouer » : elle s'ajoute à chaque séance.

**3. Les illustrations : une image par lieu (22) ou par énoncé (170) ?** **Recommandation : par lieu**, sans personne ni objet compté, avec l'étal comme référence de style (section 4). Le parent les génère ; l'atelier les intègre comme les images de l'étal. Les lieux peu servis (la cour, 1 énoncé ; le salon et l'étal, 2) pourraient recevoir des énoncés de plus.

**4. Les données écrites à l'écran ?** L'enfant ne lit pas les phrases, mais elle lit les nombres.
- (a) **Des étiquettes** au bas de l'illustration, le nombre et l'objet, qui s'allument quand la voix les dit (la maquette).
- (b) Rien d'écrit : l'enfant réécoute.

**Recommandation : (a).** C'est ce qui permet de chercher sans tout retenir de tête, et cela ne dit pas l'opération. Toucher une étiquette redit sa phrase (sans phrase nouvelle) ; toucher la mascotte redit tout l'énoncé.

**5. Les objets à grouper : l'enfant les manipule, ou on les lui montre ?**
- (a) **Partage** (niveau 3) : **l'enfant fait glisser** les objets dans les contenants (`07-partage.png`) ; quand chacun en a autant, elle tape la réponse.
- (b) **Groupes égaux** : les groupes sont montrés déjà formés ; l'enfant les compte, la correction les compte par bonds (`06-groupes.png`).
- (c) Tout en démonstration, rien à manipuler.

**Recommandation : (a) et (b)** au niveau 3, où les objets sont la question elle-même ; aux niveaux suivants, les objets ne viennent qu'en aide (après une erreur, ou au coquillage).

**6. L'aide, et les crans.** **Recommandation** : comme les autres exercices. « Plus facile » : le schéma ou les objets d'emblée. « Conseillé » : au coquillage, et toujours après une erreur. « Plus dur » : sans coquillage. « Très dur » : les énoncés d'une difficulté au-dessus, au même niveau. La montée de niveau : la règle commune (8 bonnes réponses sur les 10 dernières, `docs/SPEC.md`, section 9), sur deux jours au moins, comme la multiplication.

**7. Les erreurs repérées** (des codes, comme ailleurs) :

| Code | Erreur | Exemple | Ce qui est dit (avant le schéma) |
| --- | --- | --- | --- |
| P1 | la mauvaise opération (a ajouté au lieu d'enlever, ou l'inverse) | 23 et 9 → 32 | rien de plus : le schéma le montre ; pour la comparaison, « Attention : « de plus » ne veut pas dire qu'il faut ajouter. » |
| P2 | a redit un nombre de l'énoncé | → 23 | « Tu as redit un nombre de l'histoire. Il faut calculer. » |
| P3 | la bonne opération, une erreur de compte (à 1 ou 10 près) | 23 − 9 → 15 | « Le bon calcul, mais une petite erreur de compte. » |
| P4 | deux étapes : la réponse de la première étape | → 6 au lieu de 12 | « C'est la réponse de la première étape. Il en reste une. » |

**Recommandation** : ces quatre codes, comptés dans l'espace parent ; la même erreur deux fois dans une séance relance la leçon (à faire : une leçon « Le schéma en barres », numéro à attribuer).

**8. Un personnage guide (le crabe) ?** (`docs/IDEES.md`, section 3.) **Recommandation : non.** Le bernard-l'ermite n'a rien apporté de pédagogique (avis du parent) ; le calcul rapide et la multiplication s'en passent ; la mascotte suffit, et la place est prise par l'illustration.

**9. Les rôles familiaux.** Les énoncés disent « Papa », « Maman », « Mamie », « Papy », « ton copain », « ta cousine », « ta voisine ». **Recommandation : les garder**, comme dans les exemples du parent ; au parent de signaler ceux qui ne conviennent pas à sa famille (un rôle se change dans `enonces.json` sans toucher au reste ; la voix de la phrase est à refaire).

**10. Le même énoncé deux fois ?** Avec une banque fixe, la règle « une réponse qui varie » (`docs/SPEC.md`, section 9) devient : un énoncé ne revient pas dans la même séance, ni avant que tous ceux de son niveau soient passés ; un énoncé manqué revient à une séance suivante (comme la révision espacée). **Recommandation : cette règle**, simulée avant le code, comme toute règle nouvelle.

## 8. Les limites de la maquette

- **Les illustrations** : seule celle de l'étal existe ; les autres sont marquées « à générer » dans les captures.
- **Pas encore dessinés** : le pictogramme de l'exercice (écran « choisir »), celui de la frise, les plaques des neuf niveaux, la leçon du schéma en barres : ils viendront avec le lot, une fois la maquette validée. La frise n'est pas dans les captures.
- **Des images fixes** : la mascotte est une image capturée dans l'application (elle sera la vidéo, comme partout) ; le geste du glisser, l'allumage des étiquettes et le comptage par bonds sont montrés à un instant, pas animés.
- **Rien n'est simulé** : les niveaux et la règle de répétition (question 10) seront simulés et lus en séquences avant d'être codés (`docs/SPEC.md`, section 14).
- **La recette** : ce travail ne touche ni `app/` ni les tests. `npm test` donne le même résultat que sur `main` (156 réussis, 30 en échec, les mêmes, sans lien avec ce travail : à expliquer au prochain lot) ; `node art/problemes/verifier.mjs` est conforme ; la planche de l'atelier est reproductible (`still.mjs` : « reproducible »).

## 9. Les fichiers

`art/problemes/` (son `README.md`) : `enonces.json`, `verifier.mjs`, `contextes.json`, `phrases.mjs`, `index.html`, `captures.mjs`, `construire.mjs` et `dessins.js` (généré), les images capturées. L'atelier : `art/src/canvas-core/sea/problemes.ts` (les dessins), `problemesSheet.ts` (la planche), `src/hosts/page-problemesSheet.ts` et `src/hosts/problemes-maquette.ts`. Ce dossier : `PROPOSITION.md`, `ENONCES.md`, `PHRASES.md`, les captures.
