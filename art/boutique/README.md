# Maquette — la boutique du récif

**Maquette arrêtée par le parent le 10 octobre 2026** (ses réponses aux questions de la version 2, reportées ci-dessous dans « Les décisions »). Elle est à intégrer par un lot à venir : l'enfant achète les créatures du récif avec ses étoiles de mer, au lieu du coquillage tiré tous les 25 étoiles. Aucun fichier de `app/`, de `docs/SPEC.md` ni de `art/recif-vivant/` n'est modifié : la maquette lit seulement les images et le contenu de l'application quand on la fabrique.

Historique : version 1 (achat au second toucher, vœu avec des cœurs, phrases économes) ; version 2 (retours du parent : confirmation par une coche verte, vœu supprimé, l'unité toujours dite, des étoiles d'une autre matière pour les légendaires) ; version 3 (les décisions : étoile et coquillage de diamant, coquillage de la série, premier habitant au hasard, fin de séance qui mène à la boutique).

## L'ouvrir

`index.html` est **un seul fichier autonome** (5,4 Mo) : images, police, bulle de la mascotte et créatures sont dedans, sans aucune ressource extérieure. Il s'ouvre dans Chrome, sur la tablette ou sur un ordinateur, sans serveur.

- **Sur la tablette** : télécharger le fichier (sur GitHub, page du fichier `art/boutique/index.html`, bouton « Download raw file »), puis l'ouvrir depuis Chrome, menu ⋮ → Téléchargements. Mettre la tablette en paysage. Après une nouvelle version, retélécharger le fichier.
- **L'espace parent de la maquette** : garder le doigt **une seconde** sur le petit rond discret en bas à droite (sur un ordinateur : touche `p`). On y choisit le rythme (Arrivages ou Libre) et les prix, on simule une fin de séance (ou la 10e de la série) ou un lundi d'arrivage, on ajoute des étoiles ou une étoile de diamant, on repart d'une situation (la rentrée, octobre, février). Les réglages et les achats sont gardés sur la tablette ; « Tout effacer » remet à zéro.
- **Pas de voix** : la bulle écrit ce que la voix dirait, au rythme d'une voix (environ 65 ms par lettre), puis s'efface comme dans l'application.

## Ce qu'on y voit

| Écran | Ce qui s'y passe |
| --- | --- |
| **Le récif** (simplifié) | Le lagon avec les créatures possédées à leur place du récif vivant. Les boutons de l'application (maison, album, réécouter) et un **nouveau bouton, la boutique** (un étal à auvent rayé), au-dessus de l'album. Il se balance quand une créature peut être achetée. Pendant une séance en pause, il disparaît. Une créature qui vient d'être achetée **arrive à la nage**, avec son halo, et rejoint sa place. Ce n'est qu'un décor : on ne peut ni déplacer les créatures ni ouvrir leur carte. Dans l'application, ce sera le vrai récif vivant, qui garde tout cela. |
| **La boutique** | La mascotte, le compteur d'étoiles, le retour au récif (en haut à gauche), les **4 zones** en onglets (les pictogrammes de l'album, un cadenas sur les zones fermées, 15 perles = les créatures déjà dans le récif), et la **vitrine de la zone : ses 15 places**, dans l'ordre de l'album. Chaque place est une tuile des écrans de choix : la créature en couleur, son prix écrit en chiffres avec une étoile. Les rares ont le cadre argent, les légendaires le cadre or et l'étoile de diamant. |
| **Fin de séance** (simplifiée) | Les étoiles de la séance volent au compteur ; une étoile de diamant gagnée ; les occasions du coquillage (la série, une zone qui s'ouvre et son premier habitant, une légendaire dans le coquillage de diamant) ; en mode Arrivages, les créatures arrivées cette semaine ; s'il y a de quoi acheter, « Tu peux choisir une créature à la boutique ! » et **le bouton mène droit à la boutique** ; sinon, il mène au récif. |

### Une place de la vitrine, selon son état

| État | Ce qu'on voit | Toucher la tuile (la mascotte dit…) | Puis |
| --- | --- | --- | --- |
| à vendre, assez d'étoiles | la créature, « 40 ★ » ou « 100 ★ » | « C'est le crabe ! Pour l'avoir, il faut 40 étoiles. Si tu es d'accord, touche la coche verte. » | une croix rouge et une coche verte apparaissent contre la tuile : la coche achète, la croix annule |
| à vendre, pas assez | pareil | « C'est l'hippocampe ! Pour l'avoir, il faut 100 étoiles. Il te manque 42 étoiles. » | ni coche ni croix : rien ne peut s'acheter |
| pas encore arrivée (mode Arrivages) | son ombre, un sablier | « Cette créature arrive bientôt à la boutique ! » | — |
| déjà dans le récif | la créature, le petit récif dans le coin, « ✧ 150 ★ » | « C'est la crevette ! Cette créature est déjà dans ton récif. Pour la faire briller, il faut 150 étoiles. », puis la coche ou « Il te manque 92 étoiles. » | la coche la fait briller, la croix annule |
| brillante | la créature, reflet irisé et étincelles | « C'est le crabe ! Cette créature brille déjà dans ton récif. » | — |
| légendaire | son ombre dorée, l'étoile de diamant | « C'est une créature légendaire ! Elle se gagne avec les étoiles de diamant. » | — |
| zone fermée | son ombre, plus sombre | « Le grand large s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. » (phrase existante) | — |

Le toucher d'une tuile la **sélectionne** comme sur les écrans de choix (bordure corail épaisse cernée d'encre, la tuile se balance) et la bulle part de la tuile (c'est le code de l'application, `app/js/engine/bulle.js`, embarqué tel quel). **Seule la coche verte achète** : toucher encore la tuile redit seulement ce que c'est ; toucher ailleurs ou la croix rouge annule. La coche et la croix (88 px) se posent juste sous la tuile, au-dessus pour la dernière rangée ; elles n'apparaissent que si l'enfant a assez d'étoiles. Tuiles de 170 × 196 px, onglets de 96 px : au moins 64 px partout.

**L'achat** : les étoiles s'envolent du compteur et vont se poser sur la créature, le compteur descend avec elles (jamais d'un coup) ; la créature sort de la vitrine, grandit au milieu de l'écran dans une gerbe d'étincelles, la mascotte est contente : « Bravo ! Cette créature va vivre dans ton récif ! » (deux phrases qui existent déjà) ; une fois sur cinq elle sort brillante : « Oh ! Elle est brillante ! » (existante). Puis elle file vers le bouton du récif, où on la retrouve. **Faire briller** : les étoiles volent, une gerbe d'étincelles, « C'est le crabe ! Oh ! Elle est brillante ! ».

**L'étoile de diamant** : une étoile taillée comme une pierre, dessinée en direct (dix facettes irisées, rose, lilas, bleu, vert d'eau, or pâle, éclairées d'en haut à gauche ; une table nacrée au centre ; un reflet qui la traverse toutes les 3,4 s ; trois étincelles qui scintillent ; un halo). Le coquillage de diamant est le coquillage doré de l'atelier, irisé comme une nacre. Gagnée, l'étoile apparaît en grand : « Et une étoile de diamant ! Tu as joué souvent, semaine après semaine. » ; quand une légendaire est gagnable, elle vole jusqu'au coquillage de diamant, qui s'ouvre : « Ton étoile de diamant ouvre un coquillage de diamant ! C'est le grand requin blanc ! ».

## Les décisions du parent (10 octobre 2026)

| Règle | Décision |
| --- | --- |
| Rythme | **Arrivages** : 2 créatures nouvelles par semaine d'école en vitrine, le lundi, cumulées (une semaine sans séance n'en perd aucune). Le réglage Arrivages / Libre reste dans l'espace parent. |
| Prix d'une créature | **commune 40 ★, rare 100 ★** (plus bas que la fourchette de départ, 50 à 60 et 100 à 150 : voir le calibrage) |
| Faire briller une créature possédée | **150 ★ (commune), 300 ★ (rare)** ; une créature achetée sort brillante **une fois sur cinq**, comme aujourd'hui une carte nouvelle |
| Confirmation | chaque achat (et chaque « faire briller ») se confirme par la **coche verte** ; la **croix rouge** annule |
| Légendaires | **étoile de diamant** et **coquillage de diamant**, au lieu d'« étoile dorée » et « coquillage doré », **dans toute l'application** (album, espace parent, guide du parent, SPEC). La règle ne change pas : une étoile toutes les 4 semaines réussies ; une légendaire par étoile, dans le coquillage de diamant, quand sa zone est finie ; jamais à vendre. Le dessin doit être le plus précieux de l'application : blanc irisé, étincelant. Les noms internes des données (`dorees`, `doreesDepensees`) restent. |
| Coquillage de la série | toutes les **10 séances** de la série, un coquillage fait briller une créature possédée tirée au hasard ; **20 étoiles** si toutes brillent déjà. Les 5 étoiles de série toutes les 3 séances restent. |
| Ouverture d'une zone | avec une étoile arc-en-ciel, à la récompense, quand toutes les communes et rares de la zone précédente sont achetées et que son contenu est prêt (grand large début février, abysses fin avril) ; son coquillage offre un **premier habitant tiré au hasard parmi les communes** de la nouvelle zone (jamais une rare) |
| Coquillage | il ne s'achète plus ; il reste pour **les occasions** : la série, l'ouverture d'une zone, les légendaires |
| Accès | depuis le **récif**, **hors séance** (en pause, le bouton n'apparaît pas). En **fin de séance**, quand un achat est possible, le bouton mène **directement à la boutique** ; sinon, au récif. **Pas de bouton boutique à l'accueil.** |
| Vœu | **supprimé** (ni cœur ni jauge) |
| On ne perd jamais rien | un achat est définitif, rien ne se revend, les étoiles ne se perdent pas, le compteur ne baisse qu'avec les étoiles qui volent |

## Le calibrage (simulation d'une année)

**Vérification des chiffres de départ** (`node tests/sim-seances.mjs reel 5 annee --court`, puis `diff 5`, `reel 2`, le 10 octobre 2026, avec le mécanisme actuel) : les créatures arrivent aux mêmes dates quel que soit l'effort (15 le 30 novembre, 30 le 1er février, 45 le 26 avril, 60 le 15 juin) ; une séance rapporte en moyenne **61 à 62 étoiles** (profil réel), **51 à 53** (en difficulté), **70** (enfant rapide) ; en fin d'année il reste **7 406 étoiles** à 5 séances par semaine (5 892 en difficulté) et **1 506** à 2 séances ; 115 séances sur 160 (23 sur 64 à 2 par semaine) finissent avec un coquillage qui attend.

**La méthode** (`outils/simulation.mjs`) : le flux d'étoiles de chaque séance est celui de la simulation de l'application (les vrais modules, les profils diff, reel et sait, 2, 3 ou 5 séances par semaine, du 28 septembre au 2 juillet) ; la boutique est rejouée dessus avec les règles décidées (le coquillage de la série et le premier habitant au hasard compris). Hypothèse sur l'enfant : elle choisit une créature au hasard dans la vitrine, l'achète dès qu'elle a assez, sinon elle économise pour elle ; quand la vitrine n'a plus de créature nouvelle, elle fait briller la moins chère. Le grand large est prêt le 1er février, les abysses le 26 avril.

**Avec les prix décidés (40 / 100, briller 150 / 300)** — dates où l'enfant a 15, 30, 45 et 55 créatures (les 55 communes et rares ; les 5 légendaires viennent en plus) :

| mode | séances/sem. | profil | ★ gagnées | 15 | 30 | 45 | 55 | fin : cartes (/60) | brillantes | ★ restantes | séances sans achat | vitrine sans nouvelle |
| --- | ---: | --- | ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| arrivages | 2 | diff | 3271 | 07/12 | 25/02 | 03/05 | 14/06 | 60 | 16 | 141 | 19/64 | 5 |
| arrivages | 2 | reel | 3881 | 30/11 | 22/02 | 26/04 | 31/05 | 60 | 26 | 1 | 17/64 | 20 |
| arrivages | 2 | sait | 4498 | 30/11 | 01/02 | 26/04 | 31/05 | 60 | 24 | 18 | 20/64 | 27 |
| arrivages | 3 | diff | 4979 | 30/11 | 05/02 | 26/04 | 31/05 | 60 | 28 | 49 | 43/96 | 52 |
| arrivages | 3 | reel | 5777 | 30/11 | 03/02 | 26/04 | 31/05 | 60 | 40 | 97 | 41/96 | 59 |
| arrivages | 3 | sait | 6700 | 30/11 | 03/02 | 26/04 | 31/05 | 60 | 46 | 120 | 40/96 | 60 |
| arrivages | 5 | diff | 8492 | 30/11 | 01/02 | 26/04 | 01/06 | 60 | 57 | 562 | 90/160 | 116 |
| arrivages | 5 | reel | 9931 | 30/11 | 01/02 | 26/04 | 31/05 | 60 | 59 | 971 | 102/160 | 127 |
| arrivages | 5 | sait | 11151 | 30/11 | 01/02 | 26/04 | 01/06 | 60 | 59 | 1651 | 109/160 | 128 |
| libre | 2 | diff | 3271 | 07/12 | 25/02 | 03/05 | 14/06 | 60 | 16 | 141 | 20/64 | 5 |
| libre | 2 | reel | 3881 | 30/11 | 01/02 | 26/04 | 24/05 | 60 | 21 | 1 | 18/64 | 14 |
| libre | 2 | sait | 4498 | 23/11 | 18/01 | 26/04 | 20/05 | 60 | 25 | 18 | 19/64 | 22 |
| libre | 3 | diff | 4979 | 18/11 | 08/01 | 26/04 | 19/05 | 60 | 30 | 49 | 46/96 | 38 |
| libre | 3 | reel | 5777 | 13/11 | 14/12 | 26/04 | 12/05 | 60 | 34 | 97 | 43/96 | 49 |
| libre | 3 | sait | 6700 | 11/11 | 07/12 | 26/04 | 12/05 | 60 | 43 | 120 | 37/96 | 52 |
| libre | 5 | diff | 8492 | 02/11 | 24/11 | 26/04 | 05/05 | 60 | 60 | 262 | 93/160 | 106 |
| libre | 5 | reel | 9931 | 16/10 | 19/11 | 26/04 | 30/04 | 60 | 59 | 1251 | 88/160 | 115 |
| libre | 5 | sait | 11151 | 15/10 | 13/11 | 26/04 | 26/04 | 60 | 60 | 1911 | 99/160 | 124 |

« Séances sans achat » : séances après lesquelles l'enfant n'achète rien (elle économise, ou il n'y a rien à acheter). « Vitrine sans nouvelle » : séances où la vitrine n'a aucune créature nouvelle à vendre (il ne reste qu'à faire briller). Le mode décidé est « arrivages » ; les lignes « libre » sont là pour le réglage du parent.

**Avec 50 / 120**, pour mémoire : à 2 séances par semaine, l'enfant en difficulté finit à 53 cartes sur 60 et le profil réel complète sa collection le 21 juin. Tableau complet : `node art/boutique/outils/simulation.mjs 50 120 150 300`.

**Ce que la simulation dit** (des constats sur un modèle, pas des certitudes ; l'hypothèse sur la façon d'acheter de l'enfant pèse) :

- **À 2 séances par semaine (le rythme de référence)**, toute la collection est complète en juin, même pour l'enfant en difficulté (le 14 juin), et il reste au plus 141 étoiles.
- **En mode Arrivages, l'effort ne change pas les dates** (15, 30, 45, 55 aux mêmes dates à 2, 3 ou 5 séances, sauf pour l'enfant en difficulté à 2 séances, un peu plus lente) ; il change le nombre de brillantes.
- **À 5 séances par semaine, des étoiles restent** : 562 à 1 651 en fin d'année en mode Arrivages (contre 5 892 à 7 406 aujourd'hui). Le coquillage de la série fait briller environ 16 créatures par an à ce rythme : vers la fin de l'année tout brille, et il n'y a plus rien à acheter (90 à 109 séances sans achat sur 160). C'est la conséquence de la décision 5 ; sans elle, il en restait 51 à 262. Rien n'est perdu, comme aujourd'hui ; si un jour il fallait les absorber, le prix pour faire briller est le réglage le plus simple.

## Les phrases (aucune n'est fabriquée ici)

Poids estimé à partir des fichiers de voix existants (3,1 Ko par seconde de voix, environ 110 ms par lettre, corrigé de 25 % sur les phrases à nombre déjà fabriquées) : **une phrase courte pèse 6 à 14 Ko**.

**Phrases nouvelles sans nombre variable : 23 phrases, environ 0,25 Mo.**

| Phrase | Ko | Quand |
| --- | ---: | --- |
| Bienvenue à la boutique ! | 6 | première visite |
| Touche une créature : je te dis son prix. | 11 | consigne (entrée, toucher la mascotte) |
| Pour l'acheter, touche la coche verte. | 10 | consigne |
| De nouvelles créatures sont arrivées à la boutique ! | 13 | arrivages (entrée, fin de séance) |
| Pour l'avoir, il faut 40 étoiles. | 9 | une phrase par prix de créature |
| Pour l'avoir, il faut 100 étoiles. | 9 | |
| Cette créature est déjà dans ton récif. | 10 | |
| Pour la faire briller, il faut 150 étoiles. | 11 | une phrase par prix de brillante |
| Pour la faire briller, il faut 300 étoiles. | 11 | |
| Cette créature brille déjà dans ton récif. | 11 | |
| Cette créature arrive bientôt à la boutique ! | 12 | mode Arrivages |
| Si tu es d'accord, touche la coche verte. | 11 | après le prix, quand elle a assez d'étoiles |
| Tu as toutes les créatures de cette zone ! | 11 | |
| Une nouvelle zone va bientôt s'ouvrir. | 10 | |
| Tu peux choisir une créature à la boutique ! | 11 | fin de séance |
| Et voici son premier habitant ! | 8 | ouverture d'une zone |
| Tu viens jouer souvent : voici un coquillage ! | 12 | coquillage de la série |
| Toutes tes créatures brillent déjà : voici 20 étoiles ! | 14 | coquillage de la série, tout brille |
| C'est une créature légendaire ! | 8 | tuile légendaire de la boutique |
| Elle se gagne avec les étoiles de diamant. | 11 | remplace « …avec les étoiles dorées. » (boutique et album) |
| Ton étoile de diamant ouvre un coquillage de diamant ! | 14 | remplace « Ton étoile dorée ouvre un coquillage doré ! » |
| Et une étoile de diamant ! | 6 | remplace « Et une étoile dorée ! » (suivie de « Tu as joué souvent, semaine après semaine. », qui existe) |
| C'est une carte légendaire ! | — | existe ; reste pour l'album |

**« Il te manque 132 étoiles. »** : une phrase par nombre, de « Il te manque une étoile. » à « Il te manque 299 étoiles. » (une brillante rare coûte 300) : **299 phrases, environ 1,9 Mo**. Si les prix changent, seules les phrases de prix (4) et cette série se refabriquent.

**Réutilisées telles quelles** : « C'est {nom} ! » (pour chaque créature dont la carte est prête), « Bravo ! », « Cette créature va vivre dans ton récif ! », « Oh ! », « Elle est brillante ! », « Tu as joué souvent, semaine après semaine. », l'ouverture et la fermeture des zones, le bilan « Bravo ! Ce soir, tu as gagné 62 étoiles de mer. ».

**Qui ne servent plus** : « Tu as assez d'étoiles pour ouvrir un coquillage ! », « Gagne des étoiles de mer pour ouvrir des coquillages ! », « Elle se gagne avec les étoiles dorées. », « Ton étoile dorée ouvre un coquillage doré ! », « Et une étoile dorée ! » (environ 40 Ko).

**Le budget de la voix** : 79,3 Mo au relevé du parent (sur `main` le 10 octobre, je mesure 76,0 Mo : les voix d'autres lots ne sont sans doute pas encore versées). La boutique ajoute **environ 2,1 Mo** : on arrive vers **81,4 Mo**. Le parent accepte de relever la limite de 80 Mo (`tests/unit/voix.test.mjs`) : **85 Mo**, pour garder de la marge aux lots suivants. Le changement se fait dans le lot qui intègre la boutique.

## Ce que l'intégration changerait

- **`app/js/session/rewards.js`** : le coquillage ordinaire (`pickShell`, `canOpen`, `openShell`, le quota) disparaît au profit de la boutique : `prix(carte)`, `vitrine(maintenant)` (mode Arrivages : le quota d'aujourd'hui, `quotaAt`, devient le nombre d'arrivées, sans les légendaires ; mode Libre : les zones ouvertes), `acheter(id)`, `faireBriller(id)`. `openGolden` (légendaires) reste ; `openZone` offre en plus un premier habitant (une commune au hasard) ; `nextSeries` donne en plus, toutes les 10 séances, le coquillage de la série. `total` reste « ce qui reste à dépenser » : rien à convertir. Un journal des achats (date, créature, prix) pour l'espace parent.
- **`app/content/cartes.json`** : un bloc `boutique` (mode, arrivages par semaine, prix des communes et des rares, prix pour briller, chance de brillante à l'achat) ; dans `serie`, le coquillage toutes les 10 séances et ses 20 étoiles ; `coquillage.prix`, `coquillage.parSeance`, `poids` et `quota` ne servent plus ; `legendaireLu` passe au diamant. **`textes.json`** : les phrases ci-dessus (et `etoileDoree`, `coquillageDore` au diamant) ; puis les fabriquer chez le parent (`node tools/voix/publier.mjs`).
- **Le diamant dans toute l'application** : seuls le nom et le dessin changent, pas la règle. À reprendre : `docs/SPEC.md` (section 10 et son tableau), l'album (le dos des légendaires et sa phrase), l'espace parent, le guide du parent ; dans l'atelier, l'étoile (aujourd'hui `etoile.doree`) et le coquillage des légendaires (`coquillage.or`) redessinés en diamant, au niveau de la craft bar, d'après la maquette (l'étoile y est dessinée en direct par `svgDiamant`, dans `source.html` ; le coquillage n'y est qu'irisé). Les noms internes (`dorees`, `doreesDepensees`) restent.
- **Les sauvegardes de l'enfant déjà en cours** : rien n'est perdu ni converti. Les créatures possédées et leurs brillantes restent ; les étoiles au compteur deviennent dépensables à la boutique ; les étoiles dorées déjà gagnées deviennent des étoiles de diamant ; la série continue où elle en est ; la base du quota (fiche `quota`) devient la base des arrivages, donc les créatures « dues » depuis cette date sont en vitrine dès la mise à jour ; une fiche de plus (les arrivées déjà vues) se crée à la première visite. Pas de nouvelle version du schéma de la base : tout tient dans le magasin `recompenses`.
- **La récompense** (`session/screens.js`) : plus de coquillages ordinaires ; à la fin, après l'étoile de diamant et les occasions (série, zone, légendaire), les arrivages de la semaine, l'invitation à la boutique et son bouton (la boutique quand un achat est possible, sinon le récif).
- **Le récif** (`session/reef.js`) : un quatrième bouton, la boutique, au-dessus de l'album, absent pendant une séance en pause ; l'arrivée de la créature achetée (halo à l'entrée). Le déplacement des créatures et l'ouverture de leur carte ne changent pas. **La maquette du récif vivant n'est pas touchée** : seuls ses raccords, faits par `art/tools/export-recif.mjs`, gagneraient l'arrivée de la dernière créature.
- **Un écran de boutique** (`session/boutique.js`) : la sélection et la bulle partie de la tuile (`session/selection.js`, comme l'écran « choisir »), puis la coche et la croix.
- **L'atelier** : les pictogrammes de la maquette (la boutique, la coche, la croix, l'étincelle « briller », le sablier, le cadenas) sont des dessins rapides en SVG ; ils seraient redessinés dans l'atelier (`art/src/canvas-core/sea/boutique.ts`), comme l'étoile et le coquillage de diamant.
- **L'espace parent** : le réglage du rythme (Arrivages par défaut, ou Libre) ; la liste des achats ; l'export la contient ; « étoiles de diamant » au lieu de « étoiles dorées ».
- **`docs/SPEC.md`**, section 10 (et le guide du parent) : réécrite par le lot qui intègre. **Les tests** : unitaires (prix, vitrine, achat, arrivages, coquillage de la série, premier habitant, sauvegarde ancienne), parcours Playwright de la boutique (dont : toucher deux fois une tuile n'achète rien ; la fin de séance mène à la boutique ou au récif), inventaire de la voix et sa limite à 85 Mo ; la simulation (`tests/sim-seances.mjs`) remplace le bilan des coquillages par celui de la boutique (la règle d'achat de `outils/simulation.mjs`).

## Fabrication

```bash
python3 art/boutique/outils/preparer.py      # les images, depuis app/ (img/, non versionné) : fond, pictogrammes, coquillage de diamant, 60 créatures, 3 boucles de la mascotte
                                             # (SANS_MASCOTTE=1 : sans refaire les boucles de la mascotte, la partie lente)
node art/boutique/outils/fabriquer.mjs       # index.html (autonome) à partir de source.html
node art/boutique/outils/captures.mjs        # captures, à 1138 × 711 densité 2,25 (la tablette) et à 1280 × 800 (captures/, non versionné)
node art/boutique/outils/simulation.mjs      # le tableau du calibrage (premier lancement : quelques minutes, puis .travail/)
```

- **Source** : `source.html` (la page, ses styles et son code). `index.html` est **fabriqué** : ne pas le modifier à la main.
- **Repris de l'application, sans modification** : le fond du lagon et les pictogrammes de l'atelier (planches de `app/assets/art/`), les 60 créatures détourées du récif vivant (`app/assets/recif/`, ramenées à 260 px), la police Shantell Sans, la bulle de la mascotte (`app/js/engine/bulle.js`, embarquée telle quelle), les noms, raretés et zones (`app/content/cartes.json`).
- **Simplifié dans la maquette** : la mascotte joue trois courtes boucles (attente, parole, joie) détourées comme dans l'application, au lieu de son moteur et de ses 17 vidéos ; le récif est le lagon fixe avec les créatures possédées, pas le récif vivant : **on ne peut pas y déplacer les créatures ni ouvrir leur carte** ; dans l'application, le récif vivant garde tout cela, inchangé ; la fin de séance ne montre que ce qui concerne la boutique ; les zones 3 et 4 sont montrées comme si leur contenu était prêt.
- **Aperçus** : `apercus/` (captures à la taille de la tablette, réduites).
