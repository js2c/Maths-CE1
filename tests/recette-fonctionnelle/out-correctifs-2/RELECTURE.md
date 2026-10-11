# Relecture indépendante du lot « Correctifs : passage de l'échauffement aux voiliers »

Relecteur indépendant, 10 octobre 2026. Je n'ai rien modifié dans le dépôt en dehors de ce fichier.

## Ce que j'ai lu

**Phase 1** (sans la spécification ni le code) :
- `docs/archives/PROMPT-RECETTE-LOT3.md` : « Les deux personnes à incarner » et la grille du relecteur ;
- toutes les captures de `captures/` : les 1280, puis les 1138d2.25, puis une partie des 1920 (accueil, exercices, ligne, calcul, leçons, tables, « encore », album) ;
- `captures/phrases.json` ;
- les captures du parent `docs/maquettes/correctifs-2/01` à `07`.

**Phase 2** : `docs/LOTS.md`, fiche 8 ; `docs/SPEC.md`, section 2 (la séance, l'accueil), section 3 (choisir), section 9 (dont « Le toucher »), section 11 (la mascotte, la bulle, la voix). J'ai aussi cherché la règle de la bulle des voiliers à la section 7 bis.

## Synthèse

1. **Aucun constat bloquant.** L'enfant peut toujours avancer, et rien de ce que je vois ne lui apprend quelque chose de faux.
2. **Les défauts vus par le parent sont corrigés là où les captures permettent de le vérifier** : plus de pavé de l'échauffement sur les voiliers (01), plus de double bulle sur l'écran des exercices (04), un entourage centré sur les bulles rondes (05), des galets à l'accueil (06), une bulle qui ne se remet plus en page en cours de phrase (07), et un long nombre coupé à ses traits d'union (« six-cent- / quarante-six », point 3).
3. **Le démarrage est fidèle à la maquette** à 1280 et à la taille de la tablette. L'icône tient aussi dans la découpe ronde.
4. **Gênant : sur les écrans de niveaux, la bulle cache des tuiles.** Au calcul rapide, les tuiles 7 et 8 disparaissent entièrement, et une rangée entière de leçons sous la tuile « × ». C'est conforme à la spécification, mais peu commode pour une enfant qui touche vite.
5. **Gênant : la tuile sélectionnée est rognée par son cadre.** Le « 7 » de la leçon 7 n'est plus qu'un trait, et les nombres des bouées de la tuile 3 des voiliers sont coupés. Le point 8 demande une « distance régulière du bord ».
6. **À vérifier : la bulle du niveau 3 de l'étal semble déborder.** « …qui ne dépasse pas le » est le dernier mot visible ; « prix. » n'apparaît dans aucune capture.
7. **À vérifier (cosmétique), au démarrage des voiliers** : une bulle vide et pâle apparaît sur une image, et un trait fin reste dans le ciel.
8. **Plusieurs points de la fiche ne sont pas visibles dans les captures** : le parcours `tests/e2e` du point 2, le clavier (5), les mesures de la mer (6), l'appui long dans les menus (7), le temps d'image du démarrage (9), le double toucher sur chaque écran (11) et la voix (12). Voir la fin du rapport.
9. **Les preuves sont parfois incohérentes** : `phrases.json` ne correspond pas toujours à l'image (R16).

## Premier jugement (phase 1, écrit avant la phase 2, gardé tel quel)

Ce qui marche : le démarrage identique à la maquette ; l'accueil en galets, avec un seul entourage et une bulle qui part du galet ; une seule bulle sur l'écran des exercices ; le texte entier placé dès le début, les mots pas encore dits en gris ; l'entourage centré sur les bulles rondes ; plus de clavier de l'échauffement sur la mer ; deux touchers rapides sur « Choisir » qui mènent à l'écran des exercices.

Constats :
1. La bulle de description cache d'autres tuiles sur les écrans de niveaux et de leçons.
2. La phrase longue de l'étal (niveau 3) s'arrête sur « le » ; « prix. » n'apparaît pas.
3. La tuile sélectionnée a son dessin rogné (le « 7 », les nombres des bouées, la grille « × »).
4. Deux mises en valeur sur les écrans de niveaux : le halo jaune et le cadre orange.
5. Après la séance, « Choisir » disparaît ; le compteur d'étoiles reste à 0.
6. Deux touchers rapides sur les voiliers lancent des additions.
7. Au démarrage des voiliers, une bulle vide ou grisée ; la bulle du nombre écrit des guillemets et le nombre en lettres.
8. Un trait fin dans le ciel des voiliers.
9. Aux voiliers, rien ne montre où toucher pour répondre.
10. Ligne graduée : le « ? » contre une algue et un rocher, le « 0 » sur le rocher.
11. Étal : des étiquettes de prix cachées par le portefeuille.
12. L'anneau de l'appui long du bouton parent est pâle et décalé.
13. Le cercle orange de l'album touche le bord droit.
14. Leçons numérotées 1, 2, 3, 10 / 4, 5, 6, 11, 12…
15. `phrases.json` ne correspond pas toujours aux images.

## Constats qualifiés

Gravités : **bloquant** (l'enfant ne peut pas avancer, ou apprend de travers), **gênant**, **cosmétique**. Nature : **réalisation** (non conforme à la spécification), **spécification** (conforme, mais mauvais pour l'enfant), **question** (la spécification ne tranche pas).

### Gênants

**R1. La bulle d'une tuile cache d'autres tuiles.**
- Captures : `1138d2.25-choix-niveaux-calcul`, `-ligne`, `-additions`, `-etal`, `-voiliers`, `-multiplication`, `1138d2.25-choix-tables` (et les mêmes en 1280 et 1920).
- Ce que voit l'enfant :
  - au calcul rapide, après avoir touché le 3, les tuiles 7 et 8 disparaissent entièrement, et 5 et 6 à moitié ;
  - sur le menu des leçons, après avoir touché « × », toute la rangée 7, 8, 9 est cachée, avec son pictogramme ;
  - à la ligne, aux additions et à l'étal, la 12, la 11 ou la 10 sont cachées.

  Pendant 4 à 8 s, elle ne voit plus où elle voulait aller. Au calcul rapide, le chemin de cailloux (1-2-3 / 6-5-4 / 7-8-9) est coupé en son milieu. Pourtant, le sable à gauche, sous la mascotte, reste vide.
- Nature : **spécification**. La section 3 l'admet : « elle en cache souvent quelques-unes… elle laisse passer le doigt ». C'est conforme, mais la tuile cachée ne se voit plus, même si elle se touche.
- Gravité : **gênant**.
- Proposition : quand la bulle collée à la tuile cacherait au moins une tuile entière, la poser dans la plus grande zone libre de l'écran (le sable à gauche, ou le haut de l'écran), la pointe allongée jusqu'à la tuile. Ou accepter une distance de plus de 210 px.

**R2. La tuile sélectionnée est rognée par son entourage.**
- Captures : `1138d2.25-choix-lecons-zoom`, `1920-choix-lecons-zoom` (le « 7 » réduit à un trait) ; `1138d2.25-choix-niveaux-voiliers-zoom` (« 300 » et « 500 » deviennent « 00 » et « 50 ») ; `*-choix-tables-zoom` (la grille coupée en bas) ; `*-niveaux-ligne-zoom` (les nombres collés au cadre).
- Ce que voient l'enfant et le parent : la tuile touchée perd son numéro ou ses nombres au moment même où on l'en félicite. Le parent qui a dit « fais le 7 » ne voit plus de 7. L'entourage ne laisse aucun écart : il mord sur la tuile.
- Nature : **réalisation**. Le point 8 et la section 3 demandent un entourage « centré, à distance régulière du bord ».
- Gravité : **gênant** (les autres cas sont cosmétiques).
- Proposition : tracer l'entourage à l'extérieur de la tuile, avec un écart constant, sans agrandir le contenu dans un cadre fixe. Vérifier sur les agrandissements des 18 leçons et des 9 tuiles des voiliers.

**R3. La phrase longue de l'étal ne s'affiche pas en entier.**
- Captures : `1280-choix-niveaux-etal` et `1138d2.25-choix-niveaux-etal`.
- Ce que voit le parent : la bulle descend jusqu'au bas de l'écran, sur six lignes, et s'arrête sur « …qui ne dépasse pas » puis « …pas le ». « prix. » n'est visible nulle part. Si le texte entier est placé dès le début (mots non dits en gris, comme ailleurs), « prix. » devrait déjà apparaître en gris.
- Nature : **réalisation**, à vérifier. La section 11 dit que la bulle « contient toujours son texte ».
- Gravité : **gênant** pour le parent, cosmétique pour l'enfant (qui entend la phrase).
- Proposition : une capture à la fin de cette phrase. Si le mot manque, passer aux lignes de 500 px, ou raccourcir la description (« Paie juste : commence par le plus gros billet. »).

### Cosmétiques

**R4. Bulle vide et pâle au démarrage des voiliers.**
- Capture : `voiliers-demarrage-image-par-image` (images 4 et 8 : une bulle grise avec seulement « Regarde : », puis une bulle vide et translucide pendant que le voilier passe).
- Ce que voit l'enfant : une bulle vide, un court instant. Probablement un fondu d'entrée ou de sortie.
- Nature : **réalisation**, à vérifier (point 4 : « une bulle sans texte ne s'affiche jamais »).
- Gravité : **cosmétique**.
- Proposition : faire apparaître et disparaître la bulle avec son texte, jamais avant ni après lui.

**R5. Un trait fin dans le ciel des voiliers.**
- Capture : `1138d2.25-jeu-voiliers`, vers x 640, y 95 à 170, avec un petit trait horizontal. Il ressemble à celui de la capture 02 du parent.
- Ce que voit l'enfant : une ligne fine verticale au milieu du ciel, comme une rayure.
- Nature : **question / réalisation**, à vérifier (reste d'un conteneur de bulle ?).
- Gravité : **cosmétique**.
- Proposition : agrandir la zone sur une capture à la taille de la tablette, et trouver quel élément dessine ce trait.

**R6. L'anneau de l'appui long du bouton parent est décalé et pâle.**
- Capture : `1138d2.25-parent-appui`, `1280-parent-appui`.
- Ce que comprend le parent : l'anneau crème, peu visible sur le sable, est décalé vers la droite et le bas par rapport au carré. Le parent peut ne pas voir que l'appui progresse.
- Nature : **réalisation** (point 13 : il « suit la forme du bouton »).
- Gravité : **cosmétique**.
- Proposition : centrer l'anneau sur l'image (en tenant compte de sa marge transparente) et le foncer (bleu nuit ou corail).

**R7. Deux mises en valeur sur les écrans de niveaux.**
- Captures : tous les `*-choix-niveaux-*` (halo jaune sur le niveau 1, cadre corail sur le niveau 3).
- Ce que voient l'enfant et le parent : deux tuiles mises en valeur. L'enfant peut croire que la tuile jaune est choisie. Le parent ne sait pas ce que veut dire le jaune.
- Nature : **conforme** (section 3 : « bien distincte du halo doré du niveau conseillé »).
- Gravité : **cosmétique**.
- Proposition : une ligne dans le guide du parent (« le halo jaune : le niveau conseillé »). Laisser le halo jaune immobile pendant qu'une autre tuile est sélectionnée.

**R8. L'accueil après la séance.**
- Captures : `*-accueil-encore`.
- Ce que voit l'enfant :
  - « Choisir » disparaît et « Encore ! » prend la deuxième place, laissant un vide à gauche. Le doigt habitué au premier galet touche du sable ;
  - le compteur d'étoiles reste à 0 après la séance.
- Nature : la disparition de « Choisir » est **conforme** (section 2 : « Encore ! » ouvre le même écran de choix). Le 0 vient probablement des données du test : **à vérifier**.
- Gravité : **cosmétique**.
- Proposition : centrer les quatre galets, ou garder « Encore ! » à la place de « jouer ». Faire la capture « encore » après une vraie séance.

**R9. Deux touchers rapides sur les voiliers lancent des additions.**
- Capture : `1138d2.25-double-2-voiliers-lance` (« 0 + 4 = ? »).
- Ce que voit l'enfant : elle a choisi les bateaux et doit d'abord faire des additions.
- Nature : **conforme** (section 2 : l'exercice choisi est la séance du jour, avec son échauffement). **Question** pour le parent.
- Gravité : **cosmétique**, puisque la voix annonce l'échauffement et la frise montre le voilier.
- Proposition : vérifier que la phrase « On commence par s'échauffer… » est bien dite sur ce chemin. Faire aussi la capture du double toucher sur l'accueil, les niveaux et les leçons (point 11).

**R10. Ligne graduée : le « ? » sur l'algue.**
- Capture : `1138d2.25-jeu-ligne`.
- Ce que voit l'enfant : le « ? » rouge est posé sur une algue et le bord d'un rocher, et le « 0 » sur un rocher. Ils restent lisibles, mais moins nets que le « 10 » et le « 20 ».
- Nature : **conforme** (section 11 : « aucune adaptation de lisibilité »).
- Gravité : **cosmétique**.
- Proposition : un fin liseré clair autour des nombres sous la ligne, si le parent l'accepte.

**R11. Étal : des étiquettes de prix cachées.**
- Capture : `1138d2.25-jeu-etal`.
- Ce que voit l'enfant : deux étiquettes (« 1… € » et « 5 € ») sont à moitié cachées par le portefeuille ouvert.
- Nature : **question** (scène de la maquette).
- Gravité : **cosmétique**, tant que ces articles ne sont pas ceux de la question.
- Proposition : vérifier que la question ne porte jamais sur un article à demi caché.

**R12. La pointe de la bulle entre dans la tuile « × ».**
- Capture : `1138d2.25-choix-tables-zoom`, `1920-choix-tables-zoom`.
- Nature : **réalisation** (section 3 : « ne cache jamais la tuile »).
- Gravité : **cosmétique**.
- Proposition : arrêter la pointe au bord de l'entourage.

**R13. Le cercle de l'album touche le bord droit.**
- Captures : `*-accueil-album`.
- Ce que voit l'enfant : le cercle orange est presque coupé par le bord droit et passe sur le corail.
- Nature : **réalisation**, légère.
- Gravité : **cosmétique**.
- Proposition : décaler la rangée de galets de quelques pixels vers la gauche.

**R14. Les leçons ne sont pas dans l'ordre des numéros.**
- Captures : `*-choix-lecons`.
- Ce que comprend le parent : « où est la leçon 10 ? ». Elle est en haut à droite, après la 3.
- Nature : **conforme** (une rangée par exercice).
- Gravité : **cosmétique**.
- Proposition : le dire dans la légende du petit livre (« une rangée par exercice »).

**R15. « Toucher pour continuer » visible pendant le chargement.**
- Capture : `1138d2.25-demarrage-1-chargement` (le texte, très pâle, alors que la barre est presque vide).
- Nature : **réalisation**, à vérifier (section 2 : il apparaît « quand tout est chargé »).
- Gravité : **cosmétique**.
- Proposition : vérifier qu'il reste invisible jusqu'à la barre pleine, et qu'un toucher pendant le chargement ne fait rien.

**R16. Les preuves de la recette : `phrases.json`.**
- Ce qui ne correspond pas :
  - `1138d2.25-choix-niveaux-additions` : « bulle » vaut `null` alors qu'une bulle est visible (de même pour `-ligne`, `-multiplication` et plusieurs zooms) ;
  - `1138d2.25-jeu-etal` : la bulle annoncée est « Quand c'est juste… », la bulle visible « … 16, 17 ! ».
- Nature : outil de recette.
- Gravité : **cosmétique** (sans effet pour l'enfant), mais ces preuves ne permettent pas de trancher R3.
- Proposition : relever la bulle au moment exact de la capture.

**R17. Voiliers : rien ne montre quoi faire à la question.**
- Capture : `1138d2.25-jeu-voiliers`.
- Ce que voit l'enfant : après « 646 », la bulle s'efface. Rien n'indique qu'il faut faire glisser le bateau ; seul l'exemple du début l'a montré.
- Nature : **question** (section 7 bis : le geste de la maquette, sans changement).
- Gravité : **cosmétique**, à confirmer sur la tablette.
- Proposition : si l'enfant hésite, la relance de 12 s pourrait poser la flèche sur le bateau.

## Ce que je n'ai pas pu vérifier dans les captures (fiche 8)

- **Point 1** : une seule capture des voiliers en jeu, sans pavé, ce qui est bon. Rien ne montre chaque chemin (« jouer », « choisir », « Encore ! ») ni chaque moment de l'échauffement passé, ni les autres passages entre étapes.
- **Point 2** : le parcours `tests/e2e` n'apparaît pas dans les captures.
- **Point 5** : rien sur le clavier pendant l'échauffement. Le cadrage à 1138 × 711 est bon : la maison et la mascotte ne sont plus coupées.
- **Point 6** : le démarrage des voiliers ne montre aucune image de l'ancienne mer sombre, ce qui est bon. Dans `voiliers-mer-main-et-branche`, la nouvelle version montre d'abord un aplat gris-bleu, puis une mer lisse, puis la mer dessinée. Le poids, la mémoire et le temps de démarrage ne sont pas montrés.
- **Point 7** : aucune capture d'un appui long sur une tuile.
- **Point 9** : le temps d'image du démarrage de l'application n'est pas montré. Seule la maquette affiche son compteur : 18 images/s à 1280, 13 à la taille de la tablette, ce qui invite à vérifier la règle des 20 ms sur la tablette.
- **Point 10** : il n'y a pas de capture de la consigne redite en touchant la mascotte à l'accueil.
- **Point 11** : il n'y a que trois doubles touchers (accueil vers exercices, voiliers, table). Il manque l'accueil pour chaque galet, les niveaux et les leçons, ainsi que le cas du rebond.
- **Point 12** : rien sur la voix (`phrases.json` dit ce qui a été dit, pas par quelle voix) ni sur la liste « Phrases sans voix ».
- **Points 13 et 14** : visibles et conformes, à l'anneau près (R6).

## Traitement des constats (par la session du lot)

| Constat | Gravité | Traitement |
| --- | --- | --- |
| R1 · la bulle d'une tuile en cache d'autres | gênant | Laissé : c'est la règle de la spécification (section 3 : sur ces écrans pleins de tuiles, la bulle en cache quelques-unes le temps de la phrase et laisse passer le doigt) ; la bulle part déjà vers la zone la plus libre. À revoir avec le parent si l'enfant s'en plaint. |
| R2 · la tuile sélectionnée rognée par son cadre | gênant | **Corrigé** : l'entourage est désormais posé autour de la tuile, 7 px au-dehors, sur un calque un peu plus grand (`engine/ui.js`, `entourage`) ; concentrique, il ne rogne plus rien (le « 7 » de L7, les nombres des bouées). Contrôlé par `tests/unit/passages.test.mjs` et les agrandissements de `tests/e2e/correctifs-2.mjs`. |
| R3 · la bulle du niveau 3 de l'étal semble déborder | gênant (à vérifier) | Pas un défaut : la capture a été prise pendant que les mots apparaissent au rythme de la voix (« pas » en train d'apparaître, « le prix. » pas encore). La bulle contient tout son texte (contrôle de `correctifs-2.mjs`, « la bulle contient son texte »). |
| R4 · une bulle vide et pâle au démarrage des voiliers | cosmétique | **Corrigé** : les premiers mots s'affichent sans fondu dès que la bulle naît (`app.css`, `.bulle.pop .m.on`) ; avant, l'ovale apparaissait un instant sans texte. |
| R5 · un trait fin dans le ciel des voiliers | cosmétique | Laissé, signalé : très ténu, déjà sur la capture 02 du parent (avant ce lot) ; pas dans les images de la mer illustrée ; à étudier avec la maquette (lot suivant). |
| R6 · l'anneau de l'appui long décalé et pâle | cosmétique | Pas un défaut de place : l'image remplit sa boîte de façon symétrique ; à mi-appui, l'anneau n'est tracé que sur le haut et la droite. Sa couleur est celle d'avant. |
| R7 · halo du conseillé et entourage ensemble | cosmétique | Conforme ; le guide du parent explique déjà le halo du niveau conseillé. |
| R8 · le vide à gauche des galets après la séance | cosmétique | Conforme (la place de « jouer » ; « Encore ! » garde celle de « choisir », pour que les autres galets ne bougent pas). Le compteur à 0 vient des données du test. |
| R9 · deux touchers rapides sur les voiliers lancent l'échauffement | cosmétique | Conforme : un exercice choisi est la séance du jour, échauffement compris. |
| R10, R11, R13, R14 | cosmétique | Conformes ou hors du lot (décor, scène de l'étal, ordre des leçons par exercice). |
| R12 · la pointe de la bulle entre dans la tuile « × » | cosmétique | Voulu : la pointe vise un point à l'intérieur du coin de la tuile. |
| R15 · « Toucher pour continuer » pâle pendant le chargement | cosmétique | **Corrigé** : invisible tant que le chargement n'est pas fini (`visibility: hidden`). |
| R16 · `phrases.json` et la bulle | cosmétique | Le relevé est pris juste après la capture ; une bulle qui naît pendant la capture peut y manquer. Sans effet sur l'application. |
| R17 · rien ne montre qu'il faut faire glisser le bateau | question | Hors du lot (règle du jeu des voiliers : l'exemple guidé le montre la première fois) ; à poser au parent. |

**Points de la fiche que les captures ne montraient pas** : le point 1 et le point 2 sont contrôlés par `tests/e2e/passages.mjs` (chaque exercice, chaque chemin, chaque moment ; il échoue sur `main`, passe sur la branche), le point 12 par `tests/e2e/mise-a-jour.mjs` (deux versions publiées ; la cause prouvée sur `main`), le point 5 (clavier) et le point 6 (mesures) dans la demande de fusion, le point 7 par le contrôle « l'appui long ne montre pas d'étiquette » de `correctifs-2.mjs`, le point 11 par les six doubles touchers de `correctifs-2.mjs` (accueil, exercices, niveaux, leçons, tables, entraînement libre) et `tests/unit/passages.test.mjs`.
