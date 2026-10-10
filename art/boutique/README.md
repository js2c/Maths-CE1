# Maquette — la boutique du récif

**Une maquette à essayer sur la tablette, pas encore l'intégration.** L'enfant achète les créatures du récif avec ses étoiles de mer, au lieu du coquillage tiré tous les 25 étoiles. Aucun fichier de `app/`, de `docs/SPEC.md` ni de `art/recif-vivant/` n'est modifié : la maquette lit seulement les images et le contenu de l'application quand on la fabrique.

## L'ouvrir

`index.html` est **un seul fichier autonome** (5,4 Mo) : images, police, bulle de la mascotte et créatures sont dedans, sans aucune ressource extérieure. Il s'ouvre dans Chrome, sur la tablette ou sur un ordinateur, sans serveur.

- **Sur la tablette** : télécharger le fichier (sur GitHub, page du fichier `art/boutique/index.html`, bouton « Download raw file »), puis l'ouvrir depuis Chrome, menu ⋮ → Téléchargements. Mettre la tablette en paysage.
- **L'espace parent de la maquette** : garder le doigt **une seconde** sur le petit rond discret en bas à droite (sur un ordinateur : touche `p`). On y choisit le rythme (Arrivages ou Libre), les phrases (économes ou naturelles), les prix, on simule une fin de séance ou un lundi d'arrivage, on ajoute des étoiles, on repart d'une situation (la rentrée, octobre, février). Les réglages et les achats sont gardés sur la tablette ; « Tout effacer » remet à zéro.
- **Pas de voix** : la bulle écrit ce que la voix dirait, au rythme d'une voix (environ 65 ms par lettre), puis s'efface comme dans l'application.

## Ce qu'on y voit

| Écran | Ce qui s'y passe |
| --- | --- |
| **Le récif** (simplifié) | Le lagon avec les créatures possédées à leur place du récif vivant. Les boutons de l'application (maison, album, réécouter) et un **nouveau bouton, la boutique** (un étal à auvent rayé), au-dessus de l'album. Il se balance quand une créature peut être achetée. Pendant une séance en pause, il disparaît. Une créature qui vient d'être achetée **arrive à la nage**, avec son halo, et rejoint sa place. Dans l'application, ce sera le vrai récif vivant. |
| **La boutique** | La mascotte, le compteur d'étoiles, le retour au récif (en haut à gauche), les **4 zones** en onglets (les pictogrammes de l'album, un cadenas sur les zones fermées, 15 perles = les créatures déjà dans le récif), et la **vitrine de la zone : ses 15 places**, dans l'ordre de l'album. Chaque place est une tuile des écrans de choix : la créature en couleur, son prix écrit en chiffres avec une étoile. Les rares ont le cadre argent, les légendaires le cadre or. |
| **Fin de séance** (simplifiée) | Les étoiles de la séance volent au compteur ; les occasions du coquillage (une zone qui s'ouvre et son premier habitant, une légendaire) ; en mode Arrivages, les créatures arrivées cette semaine ; puis **la jauge du vœu**. Un bouton (le récif) ramène au récif. |

### Une place de la vitrine, selon son état

| État | Ce qu'on voit | Premier toucher (la mascotte dit…) | Second toucher |
| --- | --- | --- | --- |
| à vendre | la créature, « 40 ★ » ou « 100 ★ » | « C'est le crabe ! Pour l'avoir, il faut 40 étoiles. » | elle l'achète ; pas assez : la tuile se secoue, « Il te manque… 12 », puis « Touche le cœur : ce sera ton vœu ! » |
| pas encore arrivée (mode Arrivages) | son ombre, un sablier | « Cette créature arrive bientôt à la boutique ! » | la même phrase |
| déjà dans le récif | la créature, le petit récif dans le coin, « ✧ 150 ★ » | « C'est la crevette ! Cette créature est déjà dans ton récif. Pour la faire briller, il faut 150 étoiles. » | elle la fait briller (ou « Il te manque… ») |
| brillante | la créature, reflet irisé et étincelles | « C'est le crabe ! Cette créature brille déjà dans ton récif. » | la même phrase |
| légendaire | son ombre dorée, une étoile dorée | « C'est une carte légendaire ! Elle se gagne avec les étoiles dorées. » (phrase existante) | la même phrase |
| zone fermée | son ombre, plus sombre | « Le grand large s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. » (phrase existante) | la même phrase |

Comme partout depuis le lot « Correctifs de la tablette » : le premier toucher **sélectionne** (bordure corail épaisse cernée d'encre, la tuile se balance), la bulle part de la tuile (c'est le code de l'application, `app/js/engine/bulle.js`, embarqué tel quel) ; le second toucher, pas moins de 0,3 s après, achète ; un toucher ailleurs désélectionne. Les tuiles font 170 × 196 px, le cœur 78 px, les onglets 96 px (au moins 64 px partout).

**L'achat** : les étoiles s'envolent du compteur et vont se poser sur la créature, le compteur descend avec elles (jamais d'un coup) ; la créature sort de la vitrine, grandit au milieu de l'écran dans une gerbe d'étincelles, la mascotte est contente : « Bravo ! Cette créature va vivre dans ton récif ! » (deux phrases qui existent déjà) ; une fois sur cinq elle sort brillante : « Oh ! Elle est brillante ! » (existante). Puis elle file vers le bouton du récif, où on la retrouve. **Faire briller** : les étoiles volent, une gerbe d'étincelles, « C'est le crabe ! Oh ! Elle est brillante ! ».

**Le vœu** : à la sélection d'une créature à vendre (ou à faire briller), un **cœur** apparaît sur le coin de la tuile. Le toucher en fait le vœu (un seul à la fois ; le toucher encore l'enlève) : « C'est ton vœu ! Je te dirai combien d'étoiles il te manque. » Un petit cœur reste sur la tuile. À la fin de chaque séance : la carte de la créature avec son cœur, une jauge qui se remplit, « 77 / 100 ★ », et « C'est la raie manta ! Ton vœu se rapproche ! Il te manque… 23 ». Assez d'étoiles : la jauge luit, « Tu as assez d'étoiles pour ton vœu ! Va vite à la boutique ! ». Sans vœu, s'il y a de quoi acheter : « Tu peux choisir une créature à la boutique ! ».

## Les règles proposées

| Règle | Proposition | D'où elle vient |
| --- | --- | --- |
| Prix d'une créature | **commune 40 ★, rare 100 ★** | calibrage ci-dessous ; **plus bas que vos 50 à 60 et 100 à 150** : avec 50 et 120, une enfant en difficulté qui fait 2 séances par semaine finit l'année à 52 créatures sur 60, et le profil réel complète sa collection le 21 juin |
| Faire briller une créature possédée | **150 ★ (commune), 300 ★ (rare)** | ce sont les étoiles « en trop » des enfants qui font beaucoup de séances qui paient les brillantes ; à 2 séances par semaine, on en achète peu (les brillantes viennent surtout de la chance) |
| Brillante par chance | une créature achetée sort brillante **une fois sur cinq** | la règle d'aujourd'hui pour une carte nouvelle, gardée |
| Rythme | **à vous de choisir** : Arrivages (2 créatures nouvelles par semaine d'école en vitrine, le lundi, cumulées : une semaine sans séance n'en perd aucune) ou Libre (toute zone ouverte est en vitrine) | votre demande |
| Zones | une zone s'ouvre quand toutes ses communes et rares de la précédente sont achetées, avec une étoile arc-en-ciel, à la récompense, **et seulement si son contenu est prêt** (grand large début février, abysses fin avril) | la règle d'aujourd'hui |
| Coquillage | il ne s'achète plus ; il reste pour **les occasions** : l'ouverture d'une zone (il offre le premier habitant, une commune de la nouvelle zone : « Le récif de corail est ouvert ! Et voici son premier habitant ! C'est la tortue verte ! »), les légendaires (coquillage doré, une étoile dorée, comme aujourd'hui) ; la série de jours : voir les questions | votre demande |
| Légendaires | inchangées : une étoile dorée (4 semaines réussies), dans le coquillage doré, quand la zone est finie ; jamais à vendre | votre demande |
| On ne perd jamais rien | un achat est définitif, rien ne se revend, les étoiles ne se perdent pas, le compteur ne baisse qu'avec les étoiles qui volent | SPEC, section 10 |
| Hors séance | la boutique ne s'ouvre que depuis le récif, hors séance ; en pause (séance en cours), son bouton n'apparaît pas | votre demande |

## Le calibrage (simulation d'une année)

**Vérification de vos chiffres** (`node tests/sim-seances.mjs reel 5 annee --court`, puis `diff 5`, `reel 2`, le 10 octobre 2026, avec le mécanisme actuel) : les créatures arrivent aux mêmes dates quel que soit l'effort (15 le 30 novembre, 30 le 1er février, 45 le 26 avril, 60 le 15 juin) ; une séance rapporte en moyenne **61 à 62 étoiles** (profil réel), **51 à 53** (en difficulté), **70** (enfant rapide) ; en fin d'année il reste **7 406 étoiles** à 5 séances par semaine (5 892 en difficulté) et **1 506** à 2 séances ; 115 séances sur 160 (23 sur 64 à 2 par semaine) finissent avec un coquillage qui attend. Vos chiffres (7 300, 113, 1 400, 20) sont confirmés à quelques unités près : le contenu a un peu bougé depuis votre relevé.

**La méthode** (`outils/simulation.mjs`) : le flux d'étoiles de chaque séance est celui de la simulation de l'application (les vrais modules, les profils diff, reel et sait, 2, 3 ou 5 séances par semaine, du 28 septembre au 2 juillet) ; la boutique est rejouée dessus. Hypothèse sur l'enfant : elle choisit un vœu au hasard dans la vitrine, l'achète dès qu'elle a assez, sinon elle économise ; quand la vitrine n'a plus de créature nouvelle, elle fait briller la moins chère. Le grand large est prêt le 1er février, les abysses le 26 avril. Pas pris en compte : un éventuel coquillage de la série de jours.

**Avec les prix proposés (40 / 100, briller 150 / 300)** — dates où l'enfant a 15, 30, 45 et 55 créatures (les 55 communes et rares ; les 5 légendaires viennent en plus) :

| mode | séances/sem. | profil | ★ gagnées | 15 | 30 | 45 | 55 | fin : cartes (/60) | brillantes | ★ restantes | séances sans achat | vitrine sans nouvelle |
| --- | ---: | --- | ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| arrivages | 2 | diff | 3271 | 07/12 | 25/02 | 03/05 | 14/06 | 60 | 13 | 141 | 18/64 | 5 |
| arrivages | 2 | reel | 3881 | 30/11 | 22/02 | 26/04 | 31/05 | 60 | 14 | 1 | 19/64 | 22 |
| arrivages | 2 | sait | 4498 | 30/11 | 01/02 | 26/04 | 31/05 | 60 | 20 | 18 | 24/64 | 30 |
| arrivages | 3 | diff | 4979 | 30/11 | 05/02 | 26/04 | 31/05 | 60 | 21 | 49 | 47/96 | 57 |
| arrivages | 3 | reel | 5777 | 30/11 | 03/02 | 26/04 | 31/05 | 60 | 31 | 97 | 42/96 | 59 |
| arrivages | 3 | sait | 6700 | 30/11 | 03/02 | 26/04 | 31/05 | 60 | 30 | 120 | 40/96 | 61 |
| arrivages | 5 | diff | 8492 | 01/12 | 03/02 | 26/04 | 01/06 | 60 | 44 | 262 | 86/160 | 111 |
| arrivages | 5 | reel | 9931 | 30/11 | 02/02 | 26/04 | 31/05 | 60 | 48 | 51 | 88/160 | 123 |
| arrivages | 5 | sait | 11151 | 01/12 | 01/02 | 26/04 | 31/05 | 60 | 52 | 221 | 88/160 | 127 |
| libre | 2 | diff | 3271 | 07/12 | 25/02 | 03/05 | 14/06 | 60 | 12 | 141 | 18/64 | 5 |
| libre | 2 | reel | 3881 | 30/11 | 01/02 | 26/04 | 24/05 | 60 | 16 | 1 | 17/64 | 14 |
| libre | 2 | sait | 4498 | 23/11 | 18/01 | 26/04 | 20/05 | 60 | 18 | 18 | 18/64 | 22 |
| libre | 3 | diff | 4979 | 18/11 | 08/01 | 26/04 | 19/05 | 60 | 25 | 49 | 39/96 | 38 |
| libre | 3 | reel | 5777 | 13/11 | 14/12 | 26/04 | 12/05 | 60 | 28 | 97 | 40/96 | 49 |
| libre | 3 | sait | 6700 | 11/11 | 07/12 | 26/04 | 12/05 | 60 | 37 | 120 | 33/96 | 52 |
| libre | 5 | diff | 8492 | 02/11 | 24/11 | 26/04 | 10/05 | 60 | 42 | 262 | 81/160 | 103 |
| libre | 5 | reel | 9931 | 16/10 | 19/11 | 26/04 | 05/05 | 60 | 51 | 201 | 84/160 | 112 |
| libre | 5 | sait | 11151 | 15/10 | 13/11 | 26/04 | 04/05 | 60 | 55 | 71 | 83/160 | 120 |

« Séances sans achat » : séances après lesquelles l'enfant n'achète rien (elle économise, ou il n'y a rien à acheter). « Vitrine sans nouvelle » : séances où la vitrine n'a aucune créature nouvelle à vendre (il ne reste qu'à faire briller).

**Avec 50 / 120** (briller 150 / 300), pour comparer : à 2 séances par semaine, diff finit à **52 cartes sur 60** (45 créatures le 10 juin), reel complète le **21 juin** ; à 5 séances par semaine, rien ne change d'important (30 créatures le 3 février en arrivages, le 27 novembre en libre). Tableau complet : `node art/boutique/outils/simulation.mjs 50 120 150 300`.

**Ce que la simulation dit, à mon avis** (ce sont des constats sur un modèle, pas des certitudes ; l'hypothèse sur la façon d'acheter de l'enfant pèse) :

- **Les étoiles inutilisées disparaissent presque** : au plus 262 en fin d'année au lieu de 7 406, et plus aucune séance « coquillage qui attend ». Les brillantes absorbent le surplus des enfants qui font beaucoup de séances (42 à 55 brillantes sur 55 à 5 séances par semaine, 12 à 20 à 2 séances).
- **À 2 séances par semaine (le rythme de référence), les deux modes donnent presque le même calendrier** : ce sont les étoiles qui freinent, pas les arrivages. Le choix du rythme ne compte vraiment qu'à 3 séances et plus.
- **En mode Libre, à 5 séances par semaine, le calendrier du contenu freine quand même** : le lagon est complet dès la mi-octobre, le récif de corail vers le 19 novembre, puis plus rien de nouveau jusqu'au 1er février (le grand large), et de mi-février au 26 avril (les abysses). Ce sont environ 110 séances sur 160 avec une vitrine sans créature nouvelle, autant qu'en mode Arrivages (environ 120), mais en deux longues attentes au lieu d'une attente régulière de quelques jours. Si le contenu des zones 3 et 4 arrivait plus tôt, le mode Libre finirait la collection vers janvier à 5 séances par semaine.
- **En mode Arrivages, l'effort ne change pas les dates** (15, 30, 45, 55 aux mêmes dates à 2, 3 ou 5 séances, sauf pour l'enfant en difficulté à 2 séances, plus lente) ; il change le nombre de brillantes.

## Les phrases (aucune n'est fabriquée ici)

Poids estimé à partir des fichiers de voix existants (3,1 Ko par seconde de voix, environ 110 ms par lettre, corrigé de 25 % sur les phrases à nombre déjà fabriquées) : **une phrase courte pèse 6 à 11 Ko**.

**Phrases nouvelles, version économe (celle de la maquette par défaut) : 23 phrases, environ 0,2 Mo.**

| Phrase | Ko | Quand |
| --- | ---: | --- |
| Bienvenue à la boutique ! | 6 | première visite |
| Touche une créature : je te dis son prix. | 11 | consigne (entrée, toucher la mascotte) |
| Touche-la encore pour l'acheter. | 8 | consigne |
| De nouvelles créatures sont arrivées à la boutique ! | 13 | arrivages (entrée, fin de séance) |
| Pour l'avoir, il faut 40 étoiles. | 9 | une phrase par prix de créature |
| Pour l'avoir, il faut 100 étoiles. | 9 | |
| Cette créature est déjà dans ton récif. | 10 | |
| Pour la faire briller, il faut 150 étoiles. | 11 | une phrase par prix de brillante |
| Pour la faire briller, il faut 300 étoiles. | 11 | |
| Cette créature brille déjà dans ton récif. | 11 | |
| Cette créature arrive bientôt à la boutique ! | 12 | mode Arrivages |
| Il te manque… | 3 | **suivi du nombre dit seul** (« 12 ») : les fichiers des nombres de 0 à 1 000 existent déjà, comme pour le nombre du bateau des voiliers (`voiliersConsigne`, suivie du nombre) |
| Touche le cœur : ce sera ton vœu ! | 9 | |
| C'est ton vœu ! | 4 | |
| Je te dirai combien d'étoiles il te manque. | 11 | |
| Ce n'est plus ton vœu. | 6 | |
| Tu as toutes les créatures de cette zone ! | 11 | |
| Une nouvelle zone va bientôt s'ouvrir. | 10 | |
| Ton vœu se rapproche ! | 6 | fin de séance, suivi de « Il te manque… » et du nombre |
| Tu as assez d'étoiles pour ton vœu ! | 9 | |
| Va vite à la boutique ! | 6 | |
| Tu peux choisir une créature à la boutique ! | 11 | fin de séance, sans vœu |
| Et voici son premier habitant ! | 8 | ouverture d'une zone |

**Réutilisées telles quelles** (elles existent déjà) : « C'est {nom} ! » (pour chaque créature dont la carte est prête), « Bravo ! », « Cette créature va vivre dans ton récif ! », « Oh ! », « Elle est brillante ! », « C'est une carte légendaire ! », « Elle se gagne avec les étoiles dorées. », « Ton étoile dorée ouvre un coquillage doré ! », l'ouverture et la fermeture des zones, le bilan « Bravo ! Ce soir, tu as gagné 62 étoiles de mer. », les nombres seuls.

**Qui ne servent plus** : « Tu as assez d'étoiles pour ouvrir un coquillage ! » et « Gagne des étoiles de mer pour ouvrir des coquillages ! » (17 Ko de moins).

**Version naturelle** (choix « Naturelles » dans l'espace parent) : « Il te manque 12 étoiles. » et « Plus que 12 étoiles pour ton vœu ! », une phrase par nombre. Le nombre manquant va de 1 à 299 (une brillante rare coûte 300) : 2 × 299 phrases, **environ 4,6 Mo** (1,9 Mo pour la première, 2,7 Mo pour la seconde). Si le vœu ne pouvait porter que sur une créature nouvelle (100 ★ au plus), environ 1,5 Mo.

**La phrase de votre demande, « Plus que 12 étoiles pour la tortue luth ! »**, n'est pas faisable : 55 créatures × 299 nombres, environ 16 000 phrases et 150 Mo. La maquette la remplace par le nom dit à part, avec la phrase qui existe : « C'est la tortue luth ! Ton vœu se rapproche ! Il te manque… 12 », la carte de la créature et la jauge à l'écran.

**Le budget de la voix** : vous l'avez donné à 79,3 Mo pour une limite de 80 Mo (dans ce dépôt, sur `main` le 10 octobre, je mesure 76,0 Mo : les voix d'autres lots ne sont sans doute pas encore versées). Version économe : 79,3 + 0,2 = **79,5 Mo, sous la limite**. Version naturelle complète : **environ 84 Mo**, il faudrait relever la limite à 85 Mo (le test `tests/unit/voix.test.mjs`) ; avec le vœu limité aux créatures nouvelles, environ 81 Mo (limite à 82 Mo).

## Ce que l'intégration changerait

- **`app/js/session/rewards.js`** : le coquillage ordinaire (`pickShell`, `canOpen`, `openShell`, le quota) disparaît au profit de la boutique : `prix(carte)`, `vitrine(maintenant)` (mode Arrivages : le quota d'aujourd'hui, `quotaAt`, devient le nombre d'arrivées, sans les légendaires ; mode Libre : les zones ouvertes), `acheter(id)`, `faireBriller(id)`, le vœu (lire, poser, enlever). `openGolden` (légendaires) reste ; `openZone` offre en plus le premier habitant. `total` reste « ce qui reste à dépenser » : rien à convertir. Un journal des achats (date, créature, prix) pour l'espace parent.
- **`app/content/cartes.json`** : un bloc `boutique` (mode, arrivages par semaine, prix des communes et des rares, prix pour briller, chance de brillante à l'achat) ; `coquillage.prix`, `coquillage.parSeance`, `poids` et `quota` ne servent plus. **`textes.json`** : les phrases ci-dessus ; puis les fabriquer chez vous (`node tools/voix/publier.mjs`).
- **Les sauvegardes de l'enfant déjà en cours** : rien n'est perdu ni converti. Les créatures possédées et leurs brillantes restent ; les étoiles au compteur deviennent dépensables à la boutique ; la base du quota (fiche `quota`) devient la base des arrivages, donc les créatures « dues » depuis cette date sont en vitrine dès la mise à jour ; une nouvelle fiche (le vœu, les arrivées déjà vues) se crée à la première visite. Pas de nouvelle version du schéma de la base : tout tient dans le magasin `recompenses`, une fiche de plus.
- **La récompense** (`session/screens.js`) : plus de coquillages ordinaires ; à la fin, après les occasions (zone, légendaire), les arrivages de la semaine et la jauge du vœu.
- **Le récif** (`session/reef.js`) : un quatrième bouton, la boutique, au-dessus de l'album, absent pendant une séance en pause ; l'arrivée de la créature achetée (halo à l'entrée). **La maquette du récif vivant n'est pas touchée** : seuls ses raccords, faits par `art/tools/export-recif.mjs`, gagneraient l'arrivée de la dernière créature.
- **Un écran de boutique** (`session/boutique.js`) avec la sélection en deux touchers (`session/selection.js`) et la bulle partie de la tuile, comme l'écran « choisir ».
- **L'atelier** : les pictogrammes de la maquette (la boutique, le cœur, l'étincelle « briller », le sablier, le cadenas) sont des dessins rapides en SVG ; ils seraient redessinés dans l'atelier (`art/src/canvas-core/sea/boutique.ts`), au niveau de la craft bar, comme le reste de l'application.
- **L'espace parent** : le réglage du rythme (Arrivages ou Libre) ; le vœu en cours ; la liste des achats ; l'export les contient.
- **`docs/SPEC.md`**, section 10 (et le guide du parent) : réécrite par le lot qui intègre. **Les tests** : unitaires (prix, vitrine, achat, vœu, arrivages, sauvegarde ancienne), parcours Playwright de la boutique, inventaire de la voix ; la simulation (`tests/sim-seances.mjs`) remplace le bilan des coquillages par celui de la boutique (la règle d'achat de `outils/simulation.mjs`).

## Les questions qui vous reviennent

1. **Le rythme** : Arrivages (2 créatures nouvelles par semaine d'école) ou Libre (plus de séances, plus vite) ? À 2 séances par semaine, la différence est faible ; à 5, le mode Libre donne le lagon en trois semaines puis de longues attentes liées au contenu (de fin novembre au 1er février, puis jusqu'au 26 avril).
2. **Les prix** : 40 / 100 (proposés) ou 50 / 120 (votre fourchette ; une enfant en difficulté à 2 séances par semaine n'aurait pas toute la collection en juin) ?
3. **Faire briller** : 150 / 300, et la chance d'une brillante à l'achat (une fois sur cinq) gardée ?
4. **Les phrases** : économes (« Il te manque… 12 », 0,2 Mo, sous la limite) ou naturelles (« Il te manque 12 étoiles. », environ 4,6 Mo, limite à relever à 85 Mo) ?
5. **Le vœu** : aussi sur une créature à faire briller (comme dans la maquette), ou seulement sur une créature nouvelle ? Et sur une créature pas encore arrivée (mode Arrivages) ? La maquette ne le permet pas.
6. **Le coquillage de la série de jours** : que donne-t-il ? Proposition, non simulée : toutes les 10 séances de la série, un coquillage qui fait briller une créature tirée au hasard (20 étoiles si toutes brillent déjà). Les 5 étoiles de série toutes les 3 séances restent.
7. **Le premier habitant offert** à l'ouverture d'une zone : la première commune de la zone, ou une tirée au hasard ? (La maquette prend la première.)
8. **Où ouvrir la boutique** : seulement depuis le récif (la maquette), ou aussi depuis l'accueil après la séance du jour ?

## Fabrication

```bash
python3 art/boutique/outils/preparer.py      # les images, depuis app/ (img/, non versionné) : fond, pictogrammes, 60 créatures, 3 boucles de la mascotte
node art/boutique/outils/fabriquer.mjs       # index.html (autonome) à partir de source.html
node art/boutique/outils/captures.mjs        # captures, à 1138 × 711 densité 2,25 (la tablette) et à 1280 × 800 (captures/, non versionné)
node art/boutique/outils/simulation.mjs      # le tableau du calibrage (premier lancement : quelques minutes, puis .travail/)
```

- **Source** : `source.html` (la page, ses styles et son code). `index.html` est **fabriqué** : ne pas le modifier à la main.
- **Repris de l'application, sans modification** : le fond du lagon et les pictogrammes de l'atelier (planches de `app/assets/art/`), les 60 créatures détourées du récif vivant (`app/assets/recif/`, ramenées à 260 px), la police Shantell Sans, la bulle de la mascotte (`app/js/engine/bulle.js`, embarquée telle quelle), les noms, raretés et zones (`app/content/cartes.json`).
- **Simplifié dans la maquette** : la mascotte joue trois courtes boucles (attente, parole, joie) détourées comme dans l'application, au lieu de son moteur et de ses 17 vidéos ; le récif est le lagon fixe avec les créatures possédées, pas le récif vivant ; la fin de séance ne montre que ce qui concerne la boutique ; les zones 3 et 4 sont montrées comme si leur contenu était prêt.
- **Aperçus** : `apercus/` (captures à la taille de la tablette, réduites).
