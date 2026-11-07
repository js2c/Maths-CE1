# Relecture indépendante du lot « Mise en scène des problèmes »

7 novembre 2026.

**Méthode.** Phase 1 : les captures regardées une à une sans avoir lu la spécification, en jouant l'enfant (7 ans, ne lit pas, n'a que l'image et la voix, touche vite) puis le parent assis à côté (personnes de `docs/archives/PROMPT-RECETTE-LOT3.md`). Phase 2 : chaque constat confronté à `docs/SPEC.md`, section 7 quinquies, et à `docs/maquettes/problemes-scene/PROPOSITION.md`, section 6, avec un coup d'œil à la banque (`app/content/problemes.json`) et au code (`modules/problemes/screen.js`) pour trouver la cause.

## Captures regardées

- `docs/maquettes/problemes-scene/vraies/` : les 15 captures de `01-reunion-question` à `15-partage-question`, avec les vraies images.
- `tests/e2e/out/problemes/` (images d'essai) : `1280-30` à `1280-37` (scène gourmandises, bonds, correction, partage, partage rangé, comparaison, aide de la comparaison, étal) ; `1280-petit-30`, `-31`, `-32`, `-33`, `-34`, `-37` (petit smartphone, 640 × 360) ; pour le contexte : `1280-06` (étiquette allumée), `1280-11` (correction du calcul), `1280-12` (deux étapes), `1280-13` (lieu sans image), `1280-14` et `1280-15` (partage), `1280-17` (groupes formés), `1280-19` (cran plus facile).
- Des agrandissements pour compter : les 14 sardines de `06`, les crayons des pots de `15`, les trousses de `08`.

## Ce qui fonctionne bien (à ne pas casser)

- Le lieu raconte vraiment l'histoire : la plage et le seau, l'étal et le pêcheur, la classe et les trousses, la cuisine et les assiettes. On voit tout de suite « où on est » et « à qui c'est ».
- La plaque rouge « ? » se repère au premier coup d'œil, et elle est posée sur ce qu'on cherche (la trousse jaune, la gamelle, les pots). Le parent peut répondre « tape combien il y en a là » en quelques secondes.
- Pendant la question, les quantités restent cachées (sachets fermés, sardines absentes) : on ne peut pas compter à la place de calculer. À la correction, elles apparaissent, et le compte est juste sur toutes les captures (13 coquillages, 14 sardines, 13 crayons, 18 gourmandises dans la gamelle, 4 crayons par pot).
- À la correction, les étiquettes prennent la couleur de leur barre (`03`, `06`, `08`, `1280-11`, `1280-13`) : le lien entre l'histoire et le schéma se voit. L'écart de la comparaison est en pointillés, sans icône, dans le schéma (`08`, `1280-36`) : c'est juste.
- Les bonds (`11`, `1280-31`) : le total écrit sous chaque sachet, et le dernier total ni dit ni écrit pendant l'aide. C'est une très bonne aide.
- Le partage manipulé se fait dans les pots et les assiettes de la scène, avec le contenant suivant allumé (`13`, `14`, `1280-14`, `1280-15`) ; tout rangé, les pots pleins restent et le pavé revient (`15`).
- Le pavé, le coquillage et « je ne sais pas » sont à leur place habituelle. La bulle ne couvre jamais une étiquette ni la plaque.
- Petit smartphone : la scène est réduite en entier, rien n'est coupé et tout reste lisible.

## Constats

Gravités : **bloquant** (elle ne peut pas continuer, ou l'exercice ne fait pas travailler la compétence) ; **gênant** (elle se trompe de chemin, est induite en erreur, ou a besoin du parent sans raison) ; **cosmétique**.

### 1. Des coquillages montrés en pièces d'or. Gênant (enfant et parent)

- **Captures** : `vraies/01`, `02`, `03` (« 8 coquillages blancs et 5 coquillages roses »).
- **Ce qu'on voit** : sur les étiquettes, sur la plaque, puis au cran « plus facile » et à la correction, ce qu'on compte est dessiné en **pièces jaunes**. L'enfant entend « coquillages » et voit de l'argent, celui de l'étal du pêcheur. Le parent ne sait pas répondre à « pourquoi il y a des sous ? ».
- **Cause** : l'énoncé `reu-t-07` n'a pas d'unité dans la banque (deux « sortes » : blancs et roses). Il retombe alors sur l'objet `jeton` de l'atelier, qui ressemble à une pièce. Pourtant `u-coquillage` existe. Même chose pour `reu-t-15` (« bouteilles d'eau » et « bouteilles de jus » : `u-bouteille` existe).
- **Qualification** : conforme à la lettre de la règle (« aucune quand l'histoire compte deux sortes de choses »), mais la règle est appliquée trop largement (deux couleurs d'une même chose, c'est une seule sorte). Et le repli « jeton » trompe l'enfant (défaut de spécification).
- **Suggestion** : garder l'unité quand le nom est le même (coquillages blancs ou roses, bouteilles d'eau ou de jus). Pour le repli, prendre un jeton qui ne ressemble pas à une pièce (un rond neutre, sans or).

### 2. Une seule sorte dessinée quand l'histoire en compte deux. Gênant (enfant)

- **Captures** : `1280-19` (cran « plus facile », « 7 vaches et 9 moutons ») : les 7 vaches sont dessinées en **moutons**, et l'étiquette « 7 » porte un mouton.
- **Cause** : dans la banque, des énoncés à deux sortes d'animaux ont reçu l'unité d'une seule : `reu-t-08` (vaches et moutons → `u-animal-mouton`, **niveau 2, le niveau de départ**), `cmp-p-07` (vaches et chevaux → cheval, niveau 5), `cmp-g-07` (poules et canards → canard, niveau 8), `etp-10` (poules et canards → canard, niveau 9). Le contrôle de la banque (`verifier.mjs`) ne le voit pas.
- **Qualification** : défaut de réalisation (la spécification dit « aucune quand l'histoire compte deux sortes de choses »).
- **Suggestion** : retirer l'unité de ces énoncés, ou ajouter au contrôle une détection « deux noms différents après les nombres de l'énoncé ». J'ai fait ce repérage à la main sur la banque : les personnes (filles et garçons) et les poissons génériques peuvent garder leur icône.

### 3. La plaque montre ce qu'on partage alors qu'on demande le nombre de parts. Gênant (enfant)

- **Captures** : aucune ne montre ce cas. Je l'ai trouvé dans la banque et dans le code (`screen.js`, ligne 118 : la plaque dessine toujours `q.e.objet`).
- **Ce que l'enfant verrait** : « Tu as 8 biscuits. Tu en mets 2 dans chaque assiette. Combien d'assiettes peux-tu remplir ? » La plaque « ? » est posée **sur l'assiette**, avec **un biscuit** dessus. L'image lui demande « combien de biscuits dans l'assiette ? », et elle répondra 2 ou 8. Cela concerne les 12 énoncés `par-n-*` (4 au niveau 3, où l'on manipule, et 8 au niveau 7) : bouquets marqués d'une tulipe, tables marquées d'une personne, barques, carnets, sachets, paquets…
- **Qualification** : la plaque avait déjà ce dessin avant le lot, mais la mise en scène aggrave le défaut en la posant sur le contenant. C'est une question que la spécification ne tranche pas.
- **Suggestion** : au partage en nombre de parts, pas d'icône sur la plaque, ou l'icône du contenant (l'assiette, le vase).

### 4. À la correction, les objets trouvés sont posés à côté d'une autre étiquette. Gênant (enfant)

- **Captures** : `vraies/06` (les 14 sardines restantes sont collées sur la fenêtre de la cabane, juste à gauche de l'étiquette « 23 », loin de la plaque « 14 » à l'autre bout de la scène) ; `1280-12` (les 8 billes restantes sont entre l'étiquette « 6 » et le garçon, loin de la plaque « 8 »).
- **Pourquoi c'est un problème** : l'enfant associe ce qu'elle voit à l'étiquette la plus proche. Elle compte 14 poissons à côté du « 23 », et la correction qui devait montrer le « pourquoi » brouille le sens.
- **Qualification** : défaut de réalisation (« dans le dépôt de la réponse, sinon au sol près de la plaque »).
- **Suggestion** : quand la place près de la plaque manque, les poser sous la plaque (dans la scène) ou ne pas les montrer, plutôt qu'ailleurs. Ajouter au parcours un contrôle de distance entre la plaque et les objets.

### 5. Le seau, seul objet de l'histoire, caché sous les étiquettes. Gênant (enfant)

- **Captures** : `vraies/01`, `02`, `03`.
- **Ce qu'on voit** : « Dans ton seau… ». Le seau n'est visible que par son anse et son fond : les étiquettes « 8 » et « 5 » et la plaque « ? » sont empilées dessus, alors que la plage est vide tout autour. Les trois se lisent aussi dans l'ordre « ? 8 5 », à l'envers de l'histoire.
- **Qualification** : défaut de réalisation (« une étiquette ou la plaque ne couvre un objet qu'en dernier recours » ; « à côté quand elles couvriraient plus des deux tiers de l'objet » : ensemble, elles le couvrent presque entier). Le cas de plusieurs données sur un même objet n'est pas traité.
- **Suggestion** : quand plusieurs étiquettes décrivent le même objet, les mettre côte à côte à côté de lui, dans l'ordre de l'histoire, et la plaque juste au-dessus du seau.

### 6. Au cran « plus facile », les deux collections sont près de la même étiquette. Gênant (enfant)

- **Captures** : `vraies/02` (les collections de 8 et de 5 sont toutes deux à droite de l'étiquette « 5 ») ; `1280-19` (les collections de 7 et de 9 sont toutes deux après l'étiquette « 9 »).
- **Pourquoi c'est un problème** : le cran « plus facile » doit permettre de compter chaque donnée près de son étiquette. Ici, la collection de 8 touche le « 5 ». L'ordre aide un peu, mais une enfant qui lit mal fait le lien par la proximité.
- **Qualification** : défaut de réalisation (« une collection par étiquette, séparées, près d'elle »).
- **Suggestion** : poser chaque collection sous son étiquette. À défaut, donner à chaque collection et à son étiquette la même teinte légère.

### 7. L'écart d'une comparaison ressemble à une quantité. Gênant (enfant)

- **Captures** : `vraies/07`, `1280-35` (« 8 crayons », « 5 de plus », « ? »).
- **Ce qu'on voit** : l'écart « 5 » a exactement l'étiquette d'une quantité (le nombre et un crayon), posée entre les deux trousses. Sans lire, l'enfant voit « 8 crayons, 5 crayons, combien ? » et pense à la trousse jaune qui en aurait 5, ou ajoute par réflexe. C'est précisément l'erreur P1 que la comparaison veut travailler. Le schéma, lui, dessine bien l'écart en pointillés sans icône.
- **Qualification** : conforme (« l'écart d'une comparaison entre les deux objets »), défaut de spécification.
- **Suggestion** : donner dès l'histoire à l'étiquette de l'écart le même aspect que dans le schéma : bord en pointillés, sans icône, éventuellement une petite flèche d'une trousse à l'autre. Cela ne dit pas l'opération.

### 8. Les étiquettes des sachets se chevauchent et cachent les sachets. Cosmétique (enfant)

- **Captures** : `vraies/09`, `10`, `11` ; `1280-30`, `1280-31`, `1280-petit-30`.
- **Ce qu'on voit** : les trois « 6 » se recouvrent l'une l'autre et masquent l'essentiel des sachets. On ne devine les sachets que par leur haut.
- **Qualification** : conforme (une étiquette sur chaque objet du groupe, moins des deux tiers chacune).
- **Suggestion** : des étiquettes un peu plus petites sur les objets d'un groupe, ou posées au-dessus de chaque sachet, sans chevauchement.

### 9. La plaque déborde sur le troisième pot (images d'essai). Cosmétique, à surveiller (enfant)

- **Captures** : `1280-33`, `1280-34`, `1280-petit-33`, `1280-petit-34`. La plaque « ? » couvre le bord droit du troisième pot et une partie de ses crayons, au niveau 3, où compter le contenu des pots est le cœur de l'exercice. Ce n'est pas le cas avec les vraies images (`vraies/13` à `15`, pots plus étroits).
- **Qualification** : défaut de réalisation si cela se produit avec une vraie image (« en dernier recours »).
- **Suggestion** : ajouter au parcours un contrôle « la plaque ne recouvre aucun contenant ouvert ».

### 10. Détails de dessin. Cosmétique (enfant)

- `vraies/14`, `15` : les crayons sont collés en travers sur la face des pots, pas dedans. Ils se comptent (4 par pot), mais on dirait qu'ils sont posés devant.
- `vraies/04` à `06`, `1280-37` : les « sardines » sont des poissons orange (l'icône `u-poisson`), alors que les sardines de l'étal sont argentées.
- `1280-13` : « 6 tulipes et 3 roses » : les roses sont marquées d'une tulipe, et les 9 fleurs de la correction sont des tulipes. C'est conforme (le dessin de l'atelier pour deux sortes de choses), mais un peu trompeur.
- `vraies/12` : à la correction, l'unique étiquette « 6 » des sachets ouverts monte à côté de la tête de Papa et se lit « Papa en a 6 ».

## Écarts entre les captures et ce qui est promis

- Non conformes : constats 2 (unité d'une seule sorte), 4 (objets de la correction loin de la plaque), 5 (seau caché), 6 (collections du cran facile) ; 9 seulement avec les images d'essai.
- Conformes mais mauvais pour l'enfant : constats 1 (repli « jeton » et deux couleurs comptées pour deux sortes), 7 (étiquette de l'écart), 8.
- Question non tranchée : constat 3 (l'icône de la plaque au partage en nombre de parts).
- Tenu : la scène au-dessus du pavé qui ne bouge pas (question 1) ; les quantités cachées puis montrées jusqu'à 20 (question 3) ; la plaque sur le dépôt (question 4) ; « tu » jamais dessiné (question 5) ; les icônes générées des unités (question 6) ; les personnages génériques (question 7) ; les étiquettes aux couleurs du schéma à l'aide et à la correction (question 10).

## Verdict

**Rien de bloquant** : sur toutes les captures, l'enfant voit où taper, la plaque est claire, les quantités montrées sont justes, et la scène sert vraiment l'histoire. Le lot est une nette amélioration.

En revanche, **sept constats gênants** induisent l'enfant en erreur sur **ce qu'on compte** ou **à quoi se rapporte un nombre** : 1, 2, 3, 4, 5, 6 et 7. C'est exactement ce que la mise en scène doit éviter. Les constats 2 et 1 touchent dès le niveau 2, le niveau de départ (`reu-t-08`, `reu-t-07`). Je recommande de corriger au moins 1, 2, 4 et 5 avant que l'enfant ne rencontre ces énoncés, et de trancher 3 et 7 avec le parent.
