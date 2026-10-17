# Relecture indépendante — lot « Correctifs de l'installation et de la veille »

Relecteur qui n'a pas vu le travail. Captures : `captures/` (ce dossier). J'ai aussi regardé, pour des faits, les journaux
des parcours (`veille-30-1.txt`, `veille-30-2.txt`, `tests/e2e/out/installation/`) et les autres captures du parcours des
leçons de la monnaie (`tests/e2e/out/lecons-monnaie/`).

Gravités : **bloquant** (l'enfant ou le parent est arrêté), **gênant** (ça marche, mais on hésite, on se trompe ou on
s'inquiète), **cosmétique**.

## Ce qui va bien (pour situer)

- **Leçons de la monnaie** : plus aucun fond noir, depuis les quatre entrées, à 1280 et à 1920. Ciel, mer, cabane, étal,
  soucoupe, portefeuille sont là ; la mascotte est dans sa fenêtre ; « rejouer » et « passer » sont visibles.
- **Après 30 minutes sans toucher** (`c-…`) : chaque écran vit encore, la bulle se réécrit, la voix reprend (les journaux
  disent « lue depuis son fichier », aucune phrase muette, au plus 2 à 4 lecteurs de médias). Le galet « choisir »
  touché deux fois ouvre bien son écran (`c-pause-choisir`).
- **Lagon** (`d-lagon-1280-d2`) : aucun poisson coupé net dans le décor. Le seul poisson incomplet, en haut à droite,
  est coupé par le bord de l'écran : il entre dans l'image, c'est normal.
- **Secours du lancement** : même texte, même taille, même place à 1280 et à 1920 (pas d'écart entre les deux).

## Phase 1 — ce que voient l'enfant et le parent

### R1 — gênant (parent) — les deux secours sont identiques et n'expliquent rien
Captures : `a-1280-3-toucher-pour-reessayer` et `a-1280-4-secours-service-worker` (et leurs versions 1920,
`e-secours-service-worker`).
Les deux images sont **identiques au pixel près** : « Maths CE1 / Toucher pour réessayer ». Pourtant, ce sont deux
situations très différentes : dans la première, l'application est sur la tablette mais tarde ; dans la seconde,
elle n'est ni sur la tablette ni joignable par Internet, et réessayer ne servira à rien tant que le wifi ne revient
pas. Le parent ne peut ni le savoir ni agir. En plus, la page de secours se recharge **toute seule toutes les
15 secondes** (`app/sw.js`) : sans réseau, elle recommence sans fin, sans rien dire de nouveau. Et depuis cet écran, le
journal technique est inaccessible.
**Proposition** : sur la page de secours, une deuxième ligne simple : « L'application n'a pas pu se charger. Vérifiez
le wifi, puis touchez l'écran. » ; après deux ou trois essais ratés sur l'un ou l'autre écran : « Si cela continue :
fermez l'application et rouvrez-la. » Les deux écrans doivent se distinguer d'un coup d'œil (au minimum par ce texte).

### R2 — gênant (enfant, risque de blocage sur la tablette) — « Toucher pour réessayer » peut interrompre un chargement qui allait aboutir
Capture : `a-…-3-toucher-pour-reessayer`.
Au bout de 15 s, l'écran propose de réessayer, et un toucher recharge la page (`index.html`). Si, sur la tablette, le
démarrage prend un peu plus de 15 s (le défaut d'origine en prenait 12 à 38), l'enfant — qui touche vite, et ne lit
pas — relance un chargement qui allait finir, puis un autre… et l'on retrouve l'écran sans fin du premier essai.
**Proposition** : ne recharger que si le chargement n'avance plus (ou attendre plus longtemps au deuxième essai) ;
noter dans le journal le nombre de rechargements touchés.

### R3 — cosmétique (parent) — un écran qui ne bouge pas ressemble à un écran figé
Captures : `a-…-1-lancement-premiere-image`, `a-…-2-chargement`.
Les 2,5 premières secondes : un aplat bleu-vert, sans rien, de la même couleur que l'écran de lancement d'Android —
c'est justement ce que le parent a décrit comme « bloqué ». Ensuite « Chargement… » reste **immobile** jusqu'à 15 s.
Rien n'indique que quelque chose se passe.
**Proposition** : quelques points ou une bulle qui pulse, en CSS seul (aucun fichier à charger), dès la première image.

### R4 — gênant (parent) — le journal technique parle la langue de la conception
Captures : `a-1280-5-journal-technique`, `a-1920-5-journal-technique`.
Le texte d'introduction est clair (« Rien sur l'enfant », « exportez-le »), mais les lignes ne le sont pas : « service
worker », « NotAllowedError », « 31 calques », « allègement de l'affichage : niveau 1 », « version 83db429 »,
« 11804 fichiers, dont 214 téléchargés », « dans le navigateur, sans le mode hors ligne ». Le parent ne peut pas savoir
si ce qu'il lit est normal ou inquiétant, alors que c'est la seule question qu'il se pose.
**Proposition** : chaque ligne en une phrase simple, avec un repère « normal » / « à signaler » (par exemple une
pastille), et les détails techniques (codes, versions, compteurs) seulement dans le fichier exporté.
Exemples : « L'application a démarré en 3,7 s. » ; « La mise à jour est téléchargée ; elle servira au prochain
lancement. » ; « La tablette ralentissait : le décor a été simplifié. »

### R5 — gênant (parent) — le journal note la panne mais pas la guérison
Capture : `a-1280-5-journal-technique`.
On lit « page · au premier plan (son suspendu) » puis « voix · lecture refusée (…, NotAllowedError) », et plus rien :
aucune ligne ne dit que le son a repris ni que la phrase a été redite (les parcours montrent pourtant que c'est le
cas). « Au premier plan (son suspendu) » se lit même comme « on est revenu et le son est coupé ». De même, « application
lancée … version 83db429 » puis « installation finie (version 4452ac0) » : deux versions différentes, sans explication.
Un parent qui ouvre ce journal après une soirée normale croira qu'il y a un problème.
**Proposition** : noter la suite de chaque incident (« son repris », « phrase redite au toucher suivant »), écrire
l'état du son au présent, sans ambiguïté, et dire en clair qu'une nouvelle version attend le prochain lancement.

### R6 — cosmétique (parent) — « donnez le fichier à la conception » : où est-il, à qui le donner ?
Capture : `a-…-5-journal-technique`.
Le parent ne sait pas où le fichier exporté arrive sur la tablette, ni quoi y ajouter.
**Proposition** : une phrase de plus : « Le fichier arrive dans Téléchargements. Joignez-le à votre prochaine demande,
avec le jour et l'heure du problème. » Et, en tête du bloc, une ligne de synthèse (« Dernier lancement : normal » /
« Un lancement est resté bloqué le … »).

### R7 — gênant (enfant) — dans les leçons, l'argent se pose sur les ardoises de prix
Captures : `b-1280x800-pause-L18`, `b-1280x800-menu-L15`, `b-1280x800-exercice-L16`, `b-1280x800-pause-L15` ; plus
nettement `tests/e2e/out/lecons-monnaie/1280×800-libre-L18.png`.
Les pièces et billets que la leçon présente sont étalés au-dessus du portefeuille, donc **sur l'étal**, au milieu des
poissons et de leurs ardoises. Dans L18, l'étiquette « 1 € » d'une pièce touche l'ardoise « 13 € », la pièce
« 10 c » est à côté de l'ardoise « 10 € », « 50 c » à côté de « 7 € ». Une enfant qui lit les nombres voit deux séries
de prix mêlées, alors que la voix parle seulement des pièces. Plusieurs ardoises sont à moitié cachées par l'argent.
**Proposition** : pendant L15 à L18, retirer de l'étal (ou estomper) les articles et les ardoises dont la leçon ne
parle pas, ne garder que l'article de la leçon (sardines de L16, bar de L17, moules de L18).

### R8 — gênant (enfant) — la bulle mord sur les pièces dont parle la voix
Capture : `b-1280x800-pause-L18` (bord bas de la bulle).
« Voici des pièces de centimes. 100 centimes, ça fait 1 euro. » : le bas de la bulle recouvre le haut de la pièce de
1 € et de la première pièce de 50 c. Ce sont précisément les objets dont parle la phrase.
**Proposition** : déclarer la rangée d'argent présentée comme zone à éviter pour la bulle pendant les leçons de la
monnaie (comme l'article allumé de l'étal).

### R9 — cosmétique (enfant) — à l'étal, la bulle cache plusieurs articles et leurs prix
Captures : `b-1280x800-pause-L16`, `b-1280x800-libre-L17`, `c-etal`.
La bulle, longue, couvre la moitié gauche de l'étal : homard, huîtres, sardines et leurs ardoises disparaissent le
temps de la phrase. L'article allumé n'est pas caché, donc ce n'est pas faux, mais l'enfant voit l'étal « sauter ».
**Proposition** : à l'étal, préférer des lignes plus courtes ou la place sous la fenêtre de la cabane ; à défaut,
accepter.

### R10 — cosmétique (enfant), à vérifier — l'image ne va pas toujours avec la phrase
Captures : `b-1920x1200-pause-L15` ; `tests/e2e/out/lecons-monnaie/1280×800-exercice-L15.png`.
À 1920, pendant « Voici des pièces et des billets d'euros. », le portefeuille, les billets et les pièces sont à moitié
transparents : ils sont en train de disparaître pendant qu'on les présente. Dans L15 relancée pendant l'exercice, un
« 1 € » blanc flotte seul sur le comptoir, sans pièce. Ce sont peut-être des instants de transition saisis par la
capture ; une vidéo de la leçon entière le dirait.
**Proposition** : filmer L15 en entier à 1920 et vérifier que rien ne s'efface pendant que la voix le présente.

### R11 — cosmétique (parent) — des pictogrammes que le parent ne peut pas expliquer
Captures : `c-ligne-graduee`, `c-voiliers`, `c-etal`, `b-1280x800-exercice-L16`.
La pieuvre n'existe plus, mais elle reste au début de la frise et sur le bouton « je ne sais pas ». À l'étal, ce bouton
change de place (en haut, au-dessus de la mer, au lieu d'en bas à droite), et un bouton coquillage, à gauche, n'a pas
de sens évident. À « ça veut dire quoi ? », le parent ne peut pas répondre en dix secondes. (La spécification les
garde « pour l'instant » : question déjà ouverte, hors de ce lot.)
**Proposition** : trancher la question ouverte (`docs/IDEES.md`) ; au moins, la même place pour « je ne sais pas » sur
tous les exercices.

## Phase 2 — écarts avec la spécification et la fiche 12

### R12 — gênant (recette) — L17 et L18 relancées pendant l'exercice ne sont pas contrôlées
Fiche 12, point 4 : « Vérifier les quatre leçons depuis chaque entrée … et leçon relancée pendant l'exercice. » Le
parcours `tests/e2e/lecons-monnaie.mjs` ne relance pendant l'exercice que L15 (niveau 1) et L16 (niveau 2). Or L17 est
relancée aux niveaux 6 et 7 et L18 aux centimes (section 7 quater) : ce sont deux entrées réelles jamais vues. De plus,
chaque leçon n'est capturée que 1 à 3 fois, au début : les moments qui ajoutent quelque chose sur la scène (le total
écrit de L16, la ligne de 13 à 20 et la tortue de L17, l'ardoise à virgule de L18) n'ont pas été regardés.
**Proposition** : ajouter les deux relances manquantes et une capture par étape de chaque leçon.

### R13 — cosmétique (spécification) — le journal contredit la règle « sans sigle ni mot de conception »
Section 12 : ce qui est montré au parent l'est « en phrases simples, sans sigle ni mot de conception ». La même section
décrit le journal technique avec « service worker », « calques », « contexte graphique perdu », et c'est ce qu'affiche
l'écran (voir R4).
**Proposition** : dans la spécification, distinguer ce que l'écran dit (phrases simples) de ce que le fichier exporté
contient (détails techniques).

### R14 — cosmétique (spécification) — la page de secours se recharge seule, la spécification ne le dit pas
Section 11 : « une page de secours dit « Toucher pour réessayer » ». Le code la recharge aussi toutes les 15 s, sans
fin. À écrire dans la spécification, et à borner (voir R1).

### R15 — cosmétique (mesure) — pendant une mise à jour, le démarrage dépasse le budget de 3 s
`tests/e2e/out/installation/mesures.json`, relances « pendant » l'installation d'une nouvelle version : première image
jusqu'à 2,2 s et application prête jusqu'à 3,5 s, sur un ordinateur. Le budget de `CLAUDE.md` est de 3 s, et la
section 11 ne cite que les relances ordinaires (1,6 à 2,2 s). Sur la tablette, ce sera plus long.
**Proposition** : citer aussi ce cas dans la spécification et le regarder sur la tablette (journal technique).

## Ce que les captures ne permettent pas de juger (seule la tablette le montrera)

- **La relance de l'application installée** (icône, plein écran) sur Android : l'écran de lancement d'Android, puis la
  page, et le raccord de couleur entre les deux ; la relance après qu'Android a fermé l'application de lui-même.
- **La durée réelle de l'installation hors ligne** (environ 11 800 fichiers, 140 Mo) sur le wifi de la maison, et ce
  qui se passe si l'application est fermée avant la fin.
- **Le temps de démarrage réel** et donc le risque de R2 (un démarrage de plus de 15 s).
- **Les lecteurs de sons et de vidéos d'Android** : leur vraie limite, les décodeurs matériels, un `AudioContext`
  « interrompu » (appel, verrouillage, casque Bluetooth). Les parcours tournent dans Chromium sur ordinateur, où ces
  limites n'existent pas de la même façon.
- **La voix et la musique après 30 minutes réelles** sur la tablette, écran allumé, puis après une mise en veille.
- **Le temps d'image** et l'allègement automatique du décor (le journal montre déjà un allègement au niveau 1 à 2 sur
  ordinateur, 20 s après le démarrage).
- **Les poissons coupés** à la densité d'écran réelle et avec la carte graphique de la tablette.
- **La note « lancement resté bloqué »** au lancement suivant : aucune capture ne la montre.
- **L'export du journal** sur Android : où arrive le fichier, et si le parent sait le retrouver.
- **L'accord entre la voix et l'animation** dans les leçons : les captures sont des instants (voir R10).

---

## Traitement des constats (session du lot)

- **R1, corrigé** : la page de secours du service worker dit maintenant « L'application n'a pas pu s'ouvrir. Vérifiez le Wi-Fi, puis touchez l'écran pour réessayer. (nouvel essai toutes les 15 secondes) » ; le secours de la page garde « Chargement… » puis « Toucher pour réessayer ». Le nouvel essai automatique reste : sans réseau ni cache, il n'y a rien d'autre à faire que réessayer, et il ne coûte rien.
- **R2, gardé, avec sa raison** : l'écran de démarrage n'attend que de très petits fichiers (l'atlas, le logo, la barre de chargement : environ 200 Ko) ; il apparaît en 0,2 à 0,4 s sur l'ordinateur, servi par le cache. Au-delà de 15 s sans lui, le chargement est bloqué et non lent : recharger est la bonne réponse. Un lancement qui arrive à 15 s est noté dans le journal (« un lancement précédent n'avait rien affiché ») : si le parent en voit, le délai sera revu.
- **R3, corrigé** : « Chargement… » respire (son opacité va et vient), l'écran n'a plus l'air figé. Les 2,5 s d'aplat sans texte restent : c'est la même couleur que l'écran de lancement d'Android, et un lancement normal affiche le logo bien avant.
- **R4, corrigé en partie** : la note du bloc dit que ces lignes sont faites pour la conception, que le parent n'a pas à les comprendre, et qu'une soirée normale en contient beaucoup ; les types sont en mots simples (« hors ligne » au lieu de « service worker », « tablette » pour les passages en arrière-plan, « images animées » au lieu de « calques », « affichage allégé (niveau 1 sur 2 : la tablette peine) »). Le détail technique entre parenthèses (« NotAllowedError », la version) reste : c'est ce dont la conception a besoin.
- **R5, corrigé** : la phrase redite après un refus est notée (« phrase redite après un refus ») ; le son repris l'était déjà (« son : en marche », à chaque changement d'état du son). Les deux versions de la capture viennent du parcours, qui ajoute à la main une ligne d'une autre version.
- **R6, corrigé** : la note dit où arrive le fichier (les Téléchargements de la tablette), comment l'envoyer (par e-mail par exemple) et quoi y joindre (l'heure du problème).
- **R7, R8, R9, R10, hors du lot, notés pour le parent** (`docs/IDEES.md`) : ce sont les leçons de l'étal et la bulle telles que le lot « L'étal du pêcheur » les a faites ; ce lot n'a changé que le décor, qui était noir. Les mêmes écrans s'affichent depuis le menu des leçons sur `main`.
- **R11, hors du lot** : question déjà ouverte (`docs/IDEES.md`).
- **R12, corrigé** : le parcours `lecons-monnaie.mjs` relance aussi L17 (niveau 7) et L18 (niveau 9) pendant l'exercice, et garde une capture toutes les 2 s pendant toute la leçon (pas seulement la première).
- **R13, corrigé** : la spécification (section 12) précise que le journal technique est fait pour la conception, et en quels mots il parle au parent.
- **R14, corrigé** : la spécification dit que la page de secours réessaie seule toutes les 15 s.
- **R15, noté** : pendant qu'une nouvelle version s'installe (une fois par mise à jour), l'application est prête en 1,3 à 4,5 s sur l'ordinateur ; la spécification le dit désormais. Le budget de 3 s vaut pour les lancements ordinaires.
