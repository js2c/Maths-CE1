# Recette sur le banc « tablette » — rapport

- **Début** : 19 octobre 2026, 07 h 37 (UTC)
- **Fin** : 19 octobre 2026, 08 h 25 (UTC)
- **Durée de jeu effectif** : environ 48 minutes (dont environ 10 minutes d'attente voulue : écran éteint, page gelée, inactivité)
- `P/` veut dire le dossier des captures : `tests/recette-fonctionnelle/out-banc-android/agent/`

## Ce que j'ai joué

- Une séance « jouer » complète, au niveau conseillé : échauffement (additions), calcul rapide avec le mur de corail, défi record, récompense (23 étoiles, puis 10 et 5 en bonus).
- La boutique : achat du bernard-l'ermite (40 étoiles), avec un double toucher sur la coche ; puis le récif et l'album (cartes regardées).
- L'entraînement libre : ligne graduée niveaux 5 et 6 (« dur »), additions (après la leçon 6), presque-doubles, voiliers niveau 2, étal du pêcheur niveau 1.
- Une leçon (L6, la maison des nombres) puis « à toi ».
- L'espace parent : création du code, calendrier, historique des séances (détail de la séance du jour), progression ; puis « Fermer ».
- Les gestes de l'enfant : double et triple toucher (chiffres, coche d'achat, maison), touchers pendant la voix et pendant la correction, toujours la même réponse (5) en calcul rapide, toujours la réponse de droite sur la ligne, deux doigts sur la ligne, glisser sur l'accueil, appui long, maison en pleine correction, toucher la ligne au lieu de glisser le poisson, toucher le passage au lieu de glisser le bateau.
- La vie de la tablette : écran éteint 2 min 30 en pleine question, page gelée 3 min en pleine question, Chrome tué en pleine question, Wi-Fi coupé puis application relancée et jeu hors ligne (voiliers, étal), page rechargée, 4 minutes d'inactivité sur une question et 3 minutes sur l'accueil.

## Constats

### 1. Le choix du niveau (facile, conseillé, dur, très dur) démarre seul après une vingtaine de secondes, et le toucher de l'enfant devient une réponse — **gênant**

Ce que j'ai vu : dans l'entraînement libre, après avoir choisi un exercice et son numéro, l'écran des vagues (facile, conseillé, dur, très dur, coche verte) démarre l'exercice tout seul si l'on ne touche pas la coche, environ 20 secondes après le dernier toucher, sans prévenir. Le toucher qui suit, prévu pour cet écran, tombe alors sur la question :
- à 07 h 54, j'ai touché « dur » puis la coche, à sa place habituelle : la question était déjà affichée, et la coche est tombée sur la réponse « 70 ». Faux, correction, alors que l'enfant n'a jamais entendu la question (`P/049-ligne5-q1b.jpg`) ;
- à 07 h 57, après « très dur » (`P/060-tresdur-2.jpg`), j'ai touché « dur » 21 secondes plus tard : l'exercice a démarré à ce moment, et ce même toucher a posé le poisson sur la ligne, à la hauteur de la vague « dur ». Faux, correction « On compte les sauts, pas les traits » (`P/061-dur-1tap.jpg`).

Le parent le retrouve dans son historique : « 07 h 57 · entraînement libre (ligne graduée) · 21 s · 1 question · 0 % de réussite » (`P/082-parent-seances.jpg`, `P/084-parent-detail.jpg`). La première question de 07 h 54 est elle aussi comptée fausse (80 % au lieu de 100 %).

Combien de fois : le démarrage seul est revenu 3 fois sur 3 quand j'ai attendu (la troisième fois sans toucher : à 07 h 58 min 37 j'ai touché « dur », et à 07 h 59 min 00 la question était là, `P/065-ligne6-q.jpg`). La réponse involontaire est revenue 2 fois. Un parent qui hésite (« qu'est-ce que je choisis ? ») met facilement 20 secondes à répondre.

Reproduire :
```
toucher?x=478&y=652   (encore, deux fois)
toucher?x=478&y=652
toucher?x=350&y=470   (ligne, deux fois)
toucher?x=350&y=470
toucher?x=496&y=398   (ligne 5, deux fois)
toucher?x=496&y=398
attendre?ms=20000     (ne rien toucher)
toucher?x=920&y=420   (« dur ») -> le toucher place le poisson sur la ligne
```

### 2. Pendant la correction de l'échauffement, le clavier reste affiché et un chiffre touché passe à la question suivante — **gênant**

Ce que j'ai vu : dans la séance « jouer », après une réponse fausse (« ? + 2 = 3 », j'ai répondu 4), la correction montre « 1 + 2 = 3 » avec le clavier toujours visible (`P/009-faux-correction2.jpg`). Trois touchers rapides sur « 1 » pendant la correction : la correction s'est arrêtée et la question suivante est arrivée avec « 3 + 3 = 1 » déjà écrit (`P/010-tape-pendant-correction.jpg`, `P/011-apres-correction.jpg`). L'enfant qui touche vite valide alors un faux « 1 », ou doit comprendre qu'il faut effacer.

Combien de fois : 1 fois. Je n'ai pas pu le refaire dans l'échauffement (une seule séance « jouer » par soir). Dans les additions de l'entraînement libre, le clavier disparaît pendant la correction, donc le défaut ne s'y produit pas (`P/105-repro-tape-correction4.jpg`). Je suppose que c'est propre à la correction de l'échauffement.

Reproduire : séance « jouer », à la première question à trou, répondre faux puis valider, puis `toucher?x=508&y=540&n=3&ecart=100` pendant la correction.

### 3. Fin de séance : le bouton « la boutique » a mené à l'accueil et le toucher a ouvert l'album — **gênant (incertain)**

Ce que j'ai vu : à la fin de la récompense, l'écran montre seulement la maison et le bouton de la boutique en bas à droite, et la voix dit « Tu peux choisir une créature à la boutique ! » (`P/031-recompense3.jpg`). 13 secondes plus tard, j'ai touché le bouton de la boutique (1175, 688) : je me suis retrouvé sur l'accueil du soir (« Tu as bien travaillé. À demain ! »), et la voix a ensuite dit « L'album. Toutes tes cartes sont rangées ici. », la tuile de l'album étant entourée (`P/032-boutique.jpg`). L'enfant qui voulait la boutique tombe sur l'accueil. Elle peut retrouver la boutique par le récif.

Ce que je ne sais pas : si l'écran de fin est revenu seul à l'accueil juste avant mon toucher (celui-ci tombant alors sur l'album, qui est au même endroit), ou si un seul toucher a servi deux fois. 1 fois, non reproduit (une seule séance par soir).

### 4. L'entraînement libre ne donne aucune étoile et n'a pas de fin visible — **gênant (question pour le parent)**

Ce que j'ai vu : dans « encore », aucune réponse juste ne rapporte d'étoile (8 étoiles avant, 8 après, `P/057-maison-pendant-correction.jpg`), et les vagues du niveau n'ont pas d'étoiles (`P/048-ligne5-q1.jpg`). Pourtant la séance « jouer » dit « Plus c'est dur, plus tu gagnes d'étoiles ! » sur le même écran de vagues. Les additions libres ont enchaîné plus de 25 questions sans frise ni fin (`P/078-additions-fin.jpg`). Seule la leçon a donné 3 étoiles (`P/075-lecon6-b.jpg`). La voix dit bien « Ici, on s'entraîne pour le plaisir », mais une enfant qui veut des étoiles demandera « pourquoi je n'en gagne pas ? » ou « c'est bientôt fini ? », et rien à l'écran n'aide le parent à répondre. C'est peut-être voulu ; je le signale comme question.

### 5. La bulle de la mascotte cache d'autres tuiles ou des étiquettes — **cosmétique**

Ce que j'ai vu :
- dans la boutique, la bulle qui part du bernard-l'ermite cache les cartes du poisson-ballon, de la limace de mer et le haut de la raie le temps de la phrase (`P/036-boutique-bernard.jpg`) ;
- à l'étal, la bulle de la consigne cache deux étiquettes de prix (`P/096-etal.jpg`) ;
- dans la leçon 6, la bulle est très grande et presque vide pendant qu'elle s'écrit, et laisse voir en transparence le dessin du coquillage qu'elle recouvre (`P/074-lecon6-a.jpg`).

### 6. Le crabe de la carte ne ressemble pas au crabe du récif — **cosmétique**

Ce que j'ai vu : le crabe du récif et de la boutique est rouge orangé ; sa carte montre un crabe vert (`P/034-recif-crabe.jpg`, à comparer avec `P/035-boutique-vraie.jpg`). Une enfant attentive peut croire que ce n'est pas le même animal.

### 7. Les nombres de la ligne graduée sont loin de la ligne, et la dizaine du milieu manque au niveau « dur » — **cosmétique (en partie incertain)**

Ce que j'ai vu : les nombres (0, 50, 100) sont écrits sur le sable, nettement sous la ligne, et « 40 », « 60 », « 30 » chevauchent le rocher de gauche (`P/065-ligne6-q.jpg`, `P/066-ligne6-q2.jpg`). Au niveau 6 en « dur », seules les deux bornes sont écrites (40 et 60, puis 60 et 80, puis 30 et 50), alors que la vignette du niveau et la légende montrent trois dizaines (« 30 40 50 ») (`P/045-ligne-niveaux.jpg`). C'est peut-être ce qui rend le niveau « dur » ; je ne le sais pas.

### 8. Un « 11 » tapé vite a été lu « 1 » — **incertain**

Ce que j'ai vu : deux touchers rapides sur « 1 » ont donné « 8 + 9 = 1 » (`P/106-tape-11.jpg`) ; un troisième toucher une seconde plus tard a bien donné « 11 » (`P/108-tape-11c.jpg`). En recommençant, deux touchers rapides ont bien donné « 11 » (`P/110-tape-11d.jpg`), et un double toucher sur « 8 » au début de la séance avait donné « 88 » (`P/006-double8.jpg`). 1 fois sur 3 ; cela vient peut-être de la lenteur du banc.

### 9. L'espace parent demande de créer un code après un mois d'usage — **à vérifier**

Ce que j'ai vu : l'appui long sur le bouton « Parents » a ouvert « Choisissez un code à 4 chiffres » (`P/079-parent.jpg`), alors que l'application a un mois d'historique. Si aucun code n'a jamais été fait, l'enfant peut en créer un elle-même par un appui long, et le parent ne pourra plus entrer. C'est peut-être seulement l'état préparé du banc.

### 10. Démarrage un peu au-dessus de 3 secondes — **cosmétique (mesure)**

Ce que j'ai vu : l'application est prête en 2,6 s après « Chrome tué » et en 3,3 s (3,7 s au total) après la relance hors ligne, sur ce banc au processeur ralenti. C'est un peu au-dessus de l'objectif de 3 s ; sur la vraie tablette, je ne sais pas.

## Ce qui marche bien

- La voix : aucune phrase refusée ni manquante pendant toute la recette, y compris après un écran éteint, une page gelée, un Chrome tué, une relance hors ligne et un rechargement. Toucher la mascotte répète bien la consigne.
- Hors ligne : relance, voiliers et étal fonctionnent sans réseau.
- Écran éteint, page gelée, longue inactivité : on retrouve la même question, avec seulement un doux « Prends ton temps. Touche-moi pour réécouter la consigne. », sans rien perdre.
- Les gestes maladroits sont bien tolérés : double toucher sur la coche d'achat (une seule dépense, 48 vers 8), double toucher sur la maison, deux doigts sur la ligne (ignoré), glisser sur l'accueil (rien ne se passe), toucher la ligne au lieu de glisser le poisson (accepté), toucher un passage au lieu de glisser le bateau (« Fais glisser le bateau jusqu'au passage ! »).
- Les corrections sont belles et parlantes : le mur de corail avec le poisson qui compte les dizaines (`P/017-cr-correction2.jpg`), la tortue qui compte les sauts, les bouées, les doubles avec les poissons. Les questions ratées reviennent plus tard.
- Les images sont soignées : voiliers, étal, récif, album et cartes sont très réussis.
- Le parent trouve tout en quelques secondes : la légende des niveaux (« Ce qui est travaillé », avec un exemple, `P/046-legende.jpg`), le niveau conseillé entouré, et dans l'espace parent un historique très précis (chaque question, la réponse, le temps, les corrections passées, `P/085-parent-detail2.jpg`) et une progression claire (`P/086-parent-progression.jpg`).

## Les lectures

| Moment | Phrases essayées / jouées / finies | Refusées | Manquées | Canvas | Écouteurs | Mémoire | Lecteurs vidéo / médias |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Début (07 h 37, avant le premier toucher) | 0 / 0 / 0 | 0 | 0 | — | — | — | — |
| Accueil (07 h 37) | 3 / 3 / 3 | 0 | 0 | 40 | 39 | 7 Mo | 2 / 2 |
| Milieu (07 h 51, après la séance et la boutique) | 142 / 142 / 142 | 0 | 0 | 70 | 85 | 9 Mo | 2 / 2 |
| Avant « Chrome tué » (08 h 05) | 248 / 247 / 247 | 0 | 0 | 71 | 33 | 10 Mo | 2 / 3 |
| Fin (08 h 25, après rechargement à 08 h 19) | 28 / 28 / 27 | 0 | 0 | 31 | 36 | 8 Mo | 2 / 2 |

- Aucune phrase refusée, aucune phrase manquante, aucune erreur de la page pendant toute la recette.
- L'écart d'une phrase entre « jouées » et « finies » vient de la phrase en cours au moment de l'appel.
- Le nombre de canvas est monté de 40 à 70 environ, puis est resté stable ; les écouteurs sont redescendus d'eux-mêmes (85 puis 33). Rien ne grossit sans cesse. Toujours 2 lecteurs vidéo, au plus 1 lecteur de voix.
- « Allègement » est passé de 0 à 2 dès la séance et y est resté : l'application a réduit ses effets à cause du processeur ralenti.
