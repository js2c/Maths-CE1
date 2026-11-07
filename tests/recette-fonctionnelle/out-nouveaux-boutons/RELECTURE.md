# Relecture indépendante du lot « Nouveaux boutons, mascotte du récif et étoiles »

Un agent relecteur qui n'avait pas vu le travail, avec seulement les deux personnes à incarner (`docs/archives/PROMPT-RECETTE-LOT3.md`), les captures du lot (`tests/e2e/out/nouveaux-boutons/`, la comparaison des étoiles, la boucle de la mascotte), puis, après son premier jugement, les rubriques « Les boutons » et « La mascotte du récif » de `docs/SPEC.md`. Ses constats, et ce qui en a été fait.

## Ce qui va bien (selon lui)

Les boutons en verre forment une famille cohérente, nette et lisible sur le sable et sur l'eau ; la sélection (l'anneau corail) se voit très bien, sur la tablette comme sur le petit smartphone ; les étoiles arc-en-ciel (rayures) et de diamant (bleu pâle, éclat, halo) se distinguent nettement en petit, sur fond sombre comme clair, ce qui n'était pas le cas avant ; « encore » et « jouer » ne paraissent jamais ensemble ; « les leçons » et « choisir », « le récif » et « l'album » se distinguent par la forme ; les tailles mesurées sur les captures sont celles de la spécification à quelques pixels près ; la sortie de l'album est le récif, sans flèche ; la mascotte du récif ne cache ni bouton ni compteur, sans bulle.

## Constats et traitement

| # | Gravité | Constat | Traitement |
| --- | --- | --- | --- |
| 1 | gênant | « jouer » et « choisir » se ressemblent trop : mêmes chiffres 1 2 3, même règle, même crayon ; seul le triangle rouge de « jouer » les sépare, petit sur le téléphone | **Reste** : ce sont les images du parent, jamais modifiées. Question au parent (refaire « choisir » sans les fournitures de « jouer », par exemple plusieurs petites bulles d'exercices et une main qui en montre une). |
| 2 | gênant | Dans la boutique (et, plus loin, dans l'album), le retour au récif et l'onglet du récif de corail ont presque le même dessin | **Reste** : images du parent. Question au parent (un autre dessin pour la zone corail : anémone, poisson-clown). |
| 3 | gênant | Le bouton des abysses est presque noir sur fond sombre ; le grand large à peine mieux | **Reste** : images du parent. Question au parent (éclaircir le verre, faire luire la lampe de la baudroie). Capture du récif aux abysses ajoutée (`06c-recif-abysses-*.png`) : les boutons du récif (verre clair) y restent lisibles. |
| 4 | gênant | L'anneau corail marque à la fois la sélection et l'onglet ouvert de la boutique ; l'album a un halo doré | **Corrigé** : l'onglet ouvert de la boutique a l'anneau doré (la couleur du halo de l'album) ; le corail reste la sélection. |
| 5 | gênant | Le calcul rapide (une grille orange, un poisson, une flèche) ne se devine pas sans la voix | **Reste** : image du parent ; la voix le dit au premier toucher. Signalé au parent. |
| 6 | gênant | Le retour de l'étape du niveau (la petite bulle de l'exercice) n'a pas de signe de retour et n'est pas aligné sur la maison | **Reste** : sa place et son principe (l'image de l'exercice) datent du lot 3 ; seul son dessin change. Question ouverte, notée. |
| 7 | gênant | L'accueil en pause est identique à l'accueil : rien ne montre qu'une séance attend | **Reste** : « continuer » a l'image de « jouer » par décision du parent (7 novembre). Question au parent (un petit signe de reprise). La mascotte dit « Continuer. On reprend la séance. » au premier toucher. |
| 8 | gênant, à vérifier | Rien ne prouve sur une image fixe que la mascotte parle en vidéo ; elle a souvent les yeux fermés sur les captures | Le parcours vérifie l'état (la vidéo montrée, la boucle cachée, la voix qui parle, puis la boucle qui revient). Les yeux fermés : la respiration calme les ferme environ une seconde, le clignement un instant ; à juger sur la tablette. |
| 9 | cosmétique | La tête est coupée net sous le menton | **Reste** : ce sont les vidéos de la mascotte, partout pareilles depuis le lot « Mascotte ». |
| 10 | cosmétique | Le petit récif dans le coin des tuiles de la boutique (38 px) se lit mal | **Reste** : même taille qu'avant (le dessin de l'atelier) ; à revoir si le parent le souhaite. |
| 11 | cosmétique | Le livre de la légende garde l'ancien style | **Reste** : annoncé (son prompt est dans `docs/maquettes/boutons/PROMPTS.md`). |
| 12 | cosmétique | La bulle de la réserve vide : une ligne calée à gauche, sans point final | Capture prise pendant que les mots s'écrivent (ils apparaissent au rythme de la voix) ; rien à changer. |
| 13 | cosmétique | La pointe de la bulle mord sur l'anneau de sélection | **Reste** : règle de la bulle inchangée (elle ne couvre jamais le bouton). |
| 14 | cosmétique | Sur le petit smartphone, le livre et la maison du récif sont proches | **Reste** : mêmes places qu'avant ; décision du parent : pas d'agrandissement pour le téléphone. |
| 15 | cosmétique | Capture des abysses manquante ; le gros plan « recif-homekey » montrait la mascotte | **Corrigé** : capture ajoutée ; le gros plan vise la maison du récif. |
| 17, 18 | spécification | « jouer » et « continuer » ont la même image (conforme, à rediscuter) ; l'anneau de l'onglet de la boutique | Voir 7 et 4. |
| 20 | spécification | Sans agrandissement, trois boutons tombent sous 64 px de scène… | Ce sont des px de scène (100, 96, 38) ; seul le petit récif des tuiles est sous 64 px, et il ne se touche pas (c'est la tuile qu'on touche). Décision du parent rappelée dans la demande de fusion. |
