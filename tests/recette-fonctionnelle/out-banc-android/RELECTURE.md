# Relecture indépendante : banc Android (téléphones, encoche, stockage, journal)

Relecture faite le 17 octobre 2026, sans avoir vu le travail du lot, en se mettant à la place de l'enfant (7 ans, CE1, ne lit pas les phrases) et du parent (pas technicien, assis à côté).

## Ce que j'ai regardé

- Les 30 captures de `captures/` : une par une.
  - `1-tourner-*` : le smartphone, le petit smartphone et la tablette S5e, en portrait (deux moments de l'animation), puis remis en paysage.
  - `2-encoche-smartphone.png`.
  - `3-stockage-plein-1280.png` et `-1920.png`.
  - `4-journal-etat-de-la-page.png`.
  - `cibles-smartphone-*` (7 écrans) et `cibles-petit-smartphone-*` (9 écrans).
- Le tableau `cibles.md` (taille réelle de la plus petite cible de chaque écran).
- Deux mesures faites sur les images elles-mêmes :
  - les bandes sur les côtés ;
  - la couleur unique de `1-tourner-s5e-paysage.png`.
- Pour la phase 2 seulement : `docs/SPEC.md`, section 11 (puce « Les appareils ») et section 12 (puce « Le stockage »).
- Un seul coup d'œil au code, pour savoir si le pavé du code parent peut défiler (`app/css/parent.css`, `.pa-gate`).

## Phase 1 : ce que voient l'enfant et le parent

### « Tourne ton téléphone » (captures `1-tourner-*`)

**Pour l'enfant :**
- Le dessin est lisible sans un mot :
  - un téléphone avec une étoile sur l'écran ;
  - une grosse flèche dorée courbe ;
  - le téléphone qui se couche d'un quart de tour.
- Le sens de la flèche et celui de la rotation sont cohérents. Le haut du téléphone part à droite, le bouton du côté passe en bas : c'est bien un quart de tour vers la droite.
- Le style (contour épais, ombre nette) est celui de l'application.
- Après deux ou trois boucles, une enfant de 7 ans comprend qu'il faut tourner. Le parent aussi, en moins de dix secondes.
- Deux points faibles :
  - **Le dessin est petit.** Il occupe à peine un tiers de la hauteur, au milieu d'un grand fond uni. Sur la tablette tenue droite, c'est en plus un téléphone qui est dessiné, pas une tablette. Ça reste compréhensible.
  - **Rien n'est prévu si la rotation automatique d'Android est coupée.** L'enfant tourne l'appareil, mais la page ne bascule pas. Elle voit alors le même dessin, maintenant de travers, qui lui redemande de tourner. Ni elle ni le parent ne peuvent deviner qu'il faut réactiver la rotation automatique : il n'y a aucun texte.

**Remis en paysage :**
- Sur les deux smartphones, l'écran de démarrage est là, propre : le logo, la barre de chargement et la ligne « 2026 js2c version… ».
- **Sur la tablette S5e, la capture est entièrement vide** : une seule couleur, bleu-vert, sur les 2 561 × 1 600 points. Pour l'enfant, c'est un écran figé. C'est justement sur la tablette de référence.
- Sur la S5e, les deux moments « portrait » et « portrait-pivoté » montrent presque la même pose : le téléphone est droit, ou penché de quelques degrés. Le moment où il est couché n'a pas été saisi.

### Sur un téléphone : l'enfant peut-elle toucher ce qu'elle veut ?

- La scène de la tablette est réduite telle quelle. Sur le smartphone récent (format allongé), environ 28 % de la largeur reste en bandes vides sur les côtés. Sur le petit smartphone, environ 10 %.
- Comme la scène est limitée par la hauteur, élargir ne grossirait rien tout seul. Mais ces bandes sont de la place perdue.
- **Accueil** : les galets restent bons, au moins 9 mm. Sur le petit smartphone, le bouton **PARENTS** est collé au galet « jouer » : c'est la cible sous 9 mm. Si l'enfant touche à côté du galet, elle ouvre le code parent.
- **Additions** : c'est l'écran le plus fragile.
  - Sur le petit smartphone, 12 touches sont sous 9 mm, et elles sont serrées.
  - La coche (valider) est juste à côté du 9, la flèche d'effacement juste à côté du 4.
  - Une enfant qui tape vite, ou deux fois, validera par erreur.
  - La rangée de petits ronds de progression, en haut, devient un pointillé illisible.
- **Choisir les exercices / les niveaux** : les tuiles restent reconnaissables et de taille correcte. La dernière tuile (l'étal) touche le corail du bord.
- **Boutique** : les quatre pastilles des mondes, en haut, avec leurs cadenas, sont petites (4 à 5 cibles sous 9 mm). Les cartes, elles, sont grandes.
- **Album** : correct. Les cartes et les pastilles des mondes sont assez grandes.
- **Étal** : c'est l'écran le plus petit (6,7 mm sur le petit smartphone).
  - Les étiquettes de prix sont minuscules et se chevauchent. Par exemple, le homard à 13 € et le maquereau à 10 € sont l'un sur l'autre : on ne sait plus quel prix va avec quel produit.
  - Sur le smartphone, **la bulle de la mascotte recouvre le haut de l'étal** et cache une étiquette (« 10 € », coupée).
- **Bulles** : plusieurs sont beaucoup plus grandes que leur texte.
  - « Qu'est-ce que tu veux faire ? » occupe le haut d'une bulle aux deux tiers vide.
  - « Choisis ! Touche une image : » finit par deux-points, au-dessus d'un grand vide.
  - Ce n'est pas gênant pour l'enfant, qui écoute, mais c'est laid.

### L'espace parent sur un téléphone (captures `cibles-*-espace-parent-le-code`)

- **Le pavé du code est coupé en bas.**
  - Sur le smartphone, on voit 1 à 6 ; 7, 8, 9 et 0 sont hors de l'écran.
  - Sur le petit smartphone, la rangée 4-5-6 est coupée à moitié.
- Le cadre peut défiler (le code le prévoit), mais rien ne le montre. Un parent qui a choisi un code avec un 8 croira que l'écran est cassé.

### L'avis de stockage (captures `3-stockage-plein-*`)

- Le parent comprend : le titre en gras dit le problème (« Plus assez de place sur la tablette »). La suite dit :
  - ce qui marche encore (avec le Wi-Fi) ;
  - que les progrès de l'enfant sont gardés ;
  - quoi faire (libérer de la place, relancer avec le Wi-Fi).
  
  C'est en français simple.
- Ce qui manque ou gêne :
  - C'est un bloc de quatre lignes serrées, sans respiration.
  - « Il faut 135 Mo, il reste 60 Mo » oblige à faire la soustraction. Le parent ne sait pas qu'il doit libérer **au moins 75 Mo**.
  - Rien ne dit comment savoir que c'est réglé : l'avis disparaîtra tout seul.
  - Il est écrit « la tablette » même sur un téléphone.
- Le reste de l'écran (calendrier vide, chiffres à zéro) est propre aux deux tailles.

### Le journal technique (capture `4-journal-etat-de-la-page.png`)

- L'en-tête est très clair :
  - « Ces lignes sont faites pour la conception : vous n'avez pas à les comprendre » ;
  - « Rien sur l'enfant » ;
  - quoi faire après un problème.
  
  Le parent sait qu'il n'a pas à lire la suite.
- Les lignes elles-mêmes sont lourdes :
  - Des répétitions : « état · état de la page », « son · son : suspendu ».
  - Des parenthèses dans des parenthèses, et deux parenthèses à la suite : « (niveau 1 sur 2 : la tablette peine) (mémoire 10 Mo, …, 40 zones de dessin (11,16 mégapixels, dont 2 en 3D), …) ».
  - « La tablette peine » et « sans le mode hors ligne » peuvent inquiéter un parent qui lit quand même.
  - « Mémoire 10 Mo » ne dit pas de quelle mémoire il s'agit.

### Qualité graphique

- Le dessin « tourne », la scène et l'espace parent sont soignés.
- Rien n'est coupé dans les scènes de l'enfant.
- Ce qui est coupé ou laid :
  - le pavé du code parent ;
  - l'étiquette sous la bulle de l'étal ;
  - les bulles trop grandes ;
  - le pointillé de progression ;
  - l'écran vide de la S5e.
- La capture de l'encoche ne montre pas l'encoche. Les mesures montrent seulement que la scène est décalée vers la droite : 378 points de bande à gauche, 294 à droite, ce qui correspond à une encoche à gauche. Il faut donc croire la mesure : l'œil ne peut pas le vérifier.

## Phase 2 : écarts avec `docs/SPEC.md`

### Section 11, « Les appareils »

| La spécification dit | Les captures montrent |
| --- | --- |
| « Remis en paysage, l'application est là. » | Vrai sur les deux smartphones. **Faux sur la S5e**, la tablette de référence nommée par la même puce : l'écran est entièrement vide. |
| « Un écran **clair** couvre tout. » | Le fond est bleu-vert foncé. Si « clair » veut dire « facile à comprendre », c'est conforme. Si cela veut dire « lumineux », c'est un écart. À préciser dans la spécification. |
| « Un téléphone qui pivote d'un quart de tour et une flèche dorée courbe… sans texte ni voix ; jamais une scène écrasée. » | Conforme. La spécification ne dit rien du cas où la rotation automatique d'Android est coupée. |
| « Une page déjà ouverte en paysage, tournée puis remise, ne recharge rien. » | Rien dans les captures ne permet de le vérifier. |
| « La scène est entière et centrée dans la partie sûre de l'écran. » | La scène l'est : elle est décalée de la largeur de l'encoche. L'**écran de démarrage**, lui, est centré sur l'écran entier (365 / 376 points de bande). Rien n'est coupé, mais ce n'est pas la même règle. |
| « Le stockage : … l'espace parent le dit. » | Conforme (voir plus bas). |
| « Sur un petit smartphone, quelques cibles passent sous les 9 mm… rien n'est changé aux écrans en attendant. » | Conforme à la lettre. Mais il y a 12 cibles sous 9 mm aux additions, au calcul rapide et à la multiplication : ce n'est pas « quelques ». La puce renvoie aussi à `tests/e2e/out/cibles/cibles.md`, alors que le tableau livré est dans `tests/recette-fonctionnelle/out-banc-android/cibles.md`. |
| (Rien) | La spécification ne mentionne pas le pavé du code parent coupé sur téléphone. Or ce n'est pas une affaire de taille de cible : c'est un écran du parent qui sort de l'écran. |

### Section 12, « Le stockage »

| La spécification dit | Les captures montrent |
| --- | --- |
| « Un avis en haut de **chaque onglet**. » | On ne le voit que sur « Calendrier ». La capture du journal est sur « Données et réglages », mais descendue plus bas, donc on ne peut pas savoir. |
| « … avec ce qu'il faut (« il faut 135 Mo, il reste 60 Mo »), ce qui marche encore (avec le Wi-Fi) et quoi faire (libérer de la place, relancer avec le Wi-Fi). » | Conforme, mot pour mot. |
| « Il disparaît dès qu'une installation réussit. » | Pas vérifiable sur les captures. L'avis ne le dit pas au parent. |
| « Le journal technique écrit, toutes les 10 minutes, l'état de la page : mémoire, lecteurs de sons et de vidéos, zones de dessin (mégapixels, dont en 3D), images en mémoire. » | Le contenu est conforme (ligne 6). On voit aussi ces mesures accrochées à la ligne « affichage allégé » (ligne 9), ce que la spécification ne dit pas mais qui est utile. La forme est à alléger (constat 15). |

## Les constats

| N° | Gravité | Capture | Constat | Proposition |
| --- | --- | --- | --- | --- |
| 1 | **Bloquant** | `1-tourner-s5e-paysage.png` | Sur la tablette de référence, l'écran remis en paysage est entièrement vide (une seule couleur). La spécification dit « l'application est là ». | Vérifier si c'est l'application ou une capture prise trop tôt. Dans les deux cas, le banc doit échouer sur une capture d'une seule couleur, et la capture doit être refaite après l'apparition de l'écran de démarrage. |
| 2 | **Gênant** | `cibles-smartphone-espace-parent-le-code.png`, `cibles-petit-smartphone-espace-parent-le-code.png` | Le pavé du code parent sort de l'écran : 7, 8, 9 et 0 sont invisibles. Le cadre défile, mais rien ne le montre. | Sur un écran bas, mettre le texte à gauche et le pavé à droite, ou raccourcir la phrase et serrer le pavé, pour que les 10 chiffres tiennent sans défiler. À vérifier sur un vrai téléphone : si le défilement ne marche pas, ce constat devient bloquant. |
| 3 | **Gênant** | `cibles-petit-smartphone-additions.png` | 12 touches sous 9 mm et serrées. La coche est collée au 9, l'effacement collé au 4 : l'enfant qui tape vite validera par erreur. | À intégrer à la question au parent sur la « mise en page téléphone ». En attendant, au moins écarter la coche et l'effacement des chiffres. |
| 4 | **Gênant** | `cibles-smartphone-etal.png`, `cibles-petit-smartphone-etal.png` | L'étal est l'écran le plus petit (6,7 mm). Les étiquettes de prix se chevauchent (homard 13 € et maquereau 10 €), et sur le smartphone la bulle cache une étiquette, alors que la règle dit qu'elle ne couvre jamais ce que l'enfant touche ou regarde. | Placer la bulle hors de l'étal (au-dessus de la mer). Sur téléphone, écarter les produits ou grossir les étiquettes. |
| 5 | **Gênant** | `cibles-petit-smartphone-accueil.png` | Le bouton PARENTS (8,4 mm) est collé au galet « jouer ». Un toucher à côté ouvre le code parent au lieu de lancer la séance. | L'éloigner du galet, par exemple dans la bande vide de gauche, ou dans le coin opposé. |
| 6 | **Gênant** | `1-tourner-*-portrait*.png` | Si la rotation automatique d'Android est coupée, l'enfant tourne l'appareil et rien ne bascule : le dessin, de travers, continue de demander de tourner. Personne ne peut deviner pourquoi, puisqu'il n'y a pas de texte. | Ajouter une ligne dans `docs/GUIDE-PARENT.md` (« si l'écran ne bascule pas : activez la rotation automatique »). Éventuellement, après quelques secondes, dessiner le pictogramme Android de la rotation automatique à côté du téléphone, toujours sans texte. À décider avec le parent. |
| 7 | **Gênant** | `cibles-smartphone-boutique.png`, `cibles-petit-smartphone-boutique.png` | Les quatre pastilles des mondes, en haut, sont sous 9 mm (4 à 5 cibles). | Les grossir sur téléphone, ou les mettre en colonne dans la bande vide de droite. |
| 8 | Cosmétique | `3-stockage-plein-*.png` | L'avis est juste et en français simple, mais c'est un bloc de quatre lignes. Le parent doit calculer ce qu'il faut libérer. L'avis dit « tablette » même sur un téléphone, et ne dit pas qu'il disparaîtra une fois le problème réglé. | Garder le titre en gras, puis trois lignes courtes : « Ce qui marche : … », « Ce qui ne marche pas : … », « Que faire : libérez au moins 75 Mo (photos, vidéos…), puis relancez avec le Wi-Fi ; ce message disparaîtra. » Écrire « l'appareil » ou s'adapter au type d'appareil. |
| 9 | Cosmétique | `1-tourner-*-portrait*.png` | Le dessin est petit (un tiers de la hauteur) au milieu d'un grand fond vide. Sur la tablette, c'est un téléphone qui est dessiné. | L'agrandir à environ 60 % de la largeur de l'écran. |
| 10 | Cosmétique | `1-tourner-*-portrait*.png` | La spécification dit « un écran **clair** », alors que le fond est bleu-vert foncé. | Préciser le mot dans la spécification (« clair » au sens de « facile à comprendre »), ou éclaircir le fond. |
| 11 | Cosmétique | `1-tourner-s5e-portrait*.png` | Sur la S5e, les deux moments capturés montrent le téléphone presque droit : le quart de tour n'est pas prouvé sur la tablette. | Capturer à un moment fixe de l'animation (téléphone couché). |
| 12 | Cosmétique | `1-tourner-smartphone-paysage.png`, `2-encoche-smartphone.png` | L'écran de démarrage est centré sur l'écran entier, alors que la scène est centrée dans la partie sûre. Rien n'est coupé, mais ce n'est pas la même règle que la spécification. | Appliquer le même centrage dans la partie sûre à l'écran de démarrage. |
| 13 | Cosmétique | `cibles-*-choisir-*.png`, `cibles-*-accueil.png`, `2-encoche-smartphone.png` | Les bulles sont bien plus grandes que leur texte (« Qu'est-ce que tu veux faire ? »), et « Touche une image : » finit par deux-points au-dessus d'un vide. | Ajuster la bulle à la phrase complète. Retirer les deux-points. |
| 14 | Cosmétique | `cibles-*-additions.png`, `cibles-*-etal.png` | La rangée de petits ronds de progression devient un pointillé illisible sur téléphone. | Sur téléphone, regrouper (par exemple un rond par groupe de 5) ou grossir. |
| 15 | Cosmétique | `4-journal-etat-de-la-page.png` | L'en-tête dit bien « pour la conception », mais les lignes sont lourdes : des répétitions (« état · état de la page », « son · son : suspendu »), des parenthèses dans des parenthèses, une « mémoire 10 Mo » non précisée, et « la tablette peine », qui peut inquiéter. | Une seule parenthèse, des points médians : « état · mémoire du programme 10 Mo · 4 lecteurs · 52 dessins = 11,47 Mpx (2 en 3D) · images 9,46 Mpx ». Écrire « affichage allégé (niveau 1 sur 2) » sans « la tablette peine ». |
| 16 | Cosmétique | `2-encoche-smartphone.png`, `cibles.md` | La recette ne laisse pas tout vérifier à l'œil : l'encoche n'est pas dessinée sur la capture ; aucune capture d'un autre onglet avec l'avis de stockage ; pas de capture « choisir les niveaux » sur le smartphone ; `cibles.md` ne dit pas quelle cible est trop petite ; la spécification renvoie à un autre chemin pour ce tableau. | Dessiner le contour de l'encoche sur la capture. Ajouter une capture « Séances » ou « Données et réglages » avec l'avis. Nommer la cible la plus petite dans `cibles.md`. Aligner le chemin dans `docs/SPEC.md`. |

---

## Traitement par la session du lot

1. **Bloquant, tablette remise en paysage vide : capture prise trop tôt, pas un défaut de l'application.** Ouverte en portrait, la page se recharge une fois à l'échelle du paysage (les images sont préparées pour une échelle) ; la capture était prise 0,5 s après la rotation, avant le rechargement. Mesuré : l'écran de démarrage est prêt 3 à 5 s après. Le parcours attend désormais la page rechargée et son écran de démarrage, et vérifie qu'il n'est pas noir (`banc-android.mjs`, partie 1).
2. **Gênant, pavé du code parent coupé sur téléphone : corrigé.** Sur un écran de moins de 560 px de haut, le texte passe à gauche et le pavé à droite (`app/css/parent.css`) ; le parcours vérifie que chaque touche est dans l'écran (partie 5, capture `5-code-parent-*.png`).
3. 4. 5. 7. 13. 14. **Cibles et mise en page sur les smartphones : la décision du parent (fiche 13, point 6), décrite dans la demande de fusion.** La fiche demande de ne pas refaire les écrans dans ce lot. Le chevauchement de deux étiquettes de l'étal (15 € sur 10 €) est celui de la maquette de l'étal, identique sur la tablette (même mise en page, mise à l'échelle) : noté pour le parent, hors de ce lot.
6. **Gênant, rotation automatique coupée : une ligne dans le guide du parent** (`docs/GUIDE-PARENT.md`) : si l'écran ne tourne pas, activer la rotation automatique d'Android, ou installer l'application (elle s'ouvre alors d'elle-même en paysage).
8. **Avis de stockage : corrigé.** Il dit combien libérer (« libérez au moins 90 Mo ») et qu'il disparaîtra de lui-même une fois l'application installée. « Tablette » est gardé : l'application est faite pour la tablette.
9. **Le dessin « tourner » : agrandi** (94 % de la largeur au lieu de 86 %).
10. **« Écran clair »** : la spécification dit désormais « un écran simple, du bleu de l'écran de lancement ».
11. **Le quart de tour** : la capture est prise quand le téléphone est couché, et le parcours le vérifie.
12. **L'écran de démarrage centré sur tout l'écran** : il ne contient que le logo et la barre, au centre, rien sous l'encoche ; laissé tel quel.
15. **Lignes du journal technique** : elles sont pour la conception (l'en-tête le dit) ; laissées telles quelles.
16. **La recette** : l'avis de stockage est vérifié dans chaque onglet (partie 3) ; le tableau des cibles donne le nom des cibles sous le seuil et une copie est gardée ici (`cibles.md`), là où renvoie la spécification. L'encoche ne se dessine pas dans Chromium : le décalage de la scène, mesuré, la prouve.
