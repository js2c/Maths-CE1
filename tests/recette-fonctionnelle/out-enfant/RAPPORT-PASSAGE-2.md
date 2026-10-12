# Recette « enfant » — passage 2

`P/` = `tests/recette-fonctionnelle/out-enfant/passage-2/` (captures numérotées et `journal.txt`).
Pilote : `node tests/recette-fonctionnelle/pilote.mjs --port 8796 --tablette --base-un-mois` (version affichée au démarrage : 821fc5a).

- **Début** : 05:40:04 (pilote prêt), premier toucher 05:40:21
- **Fin** : 06:26:20
- **Durée** : environ 46 minutes de jeu effectif

Remarque sur l'installation : la copie `p2-wt` n'avait ni `node_modules` ni le dossier `tests/e2e/out/enfant`, et le pilote s'arrêtait avant « pilote prêt » (`Cannot find package 'fake-indexeddb'`, puis `ENOENT … base-un-mois.json`). Pour le lancer, j'ai ajouté dans le scratchpad un lien vers les `node_modules` du dépôt et créé ce dossier. Aucun fichier du dépôt n'a été modifié.

## Ce que j'ai joué

- Démarrage, accueil, puis une **séance « jouer » complète** : choix du niveau, échauffement (additions à trou, aide de la tortue, « je ne sais pas »), passage à l'accueil par la maison puis « continuer », rechargement de la page en plein bloc, bloc d'additions du bernard-l'ermite avec sa leçon (environ 55 questions), défi final, récompense, fin.
- **Entraînement libre** (« encore ») : l'étal du pêcheur aux niveaux 3, 7 et 4 (payer avec le portefeuille, rendre la monnaie, la lampe et l'orage, « je ne sais pas », toujours la même réponse, veille, rechargement), les voiliers au niveau 2, le calcul rapide au niveau 4, la multiplication au niveau 2 (trois fois), la grille des niveaux de la ligne graduée.
- Les leçons (L9 quittée en route, table d'addition), le récif (cartes, défilement), la boutique (deux achats, zones fermées, sabliers), l'album.
- Côté parent : appui long, création du code, Calendrier, Séances (détail d'une séance), Progression, Données et réglages, puis sortie.
- À essayer partout : touchers pendant la voix, doubles et triples touchers, appuis longs, deux doigts, glissers, maison en pleine question, veille de l'écran, rechargement, réponses au hasard ou toujours identiques.

## Constats

### 1. Recharger la page en pleine séance fait perdre la séance du soir — **bloquant**

Si l'on touche la maison en pleine séance, l'accueil propose bien « continuer » et la séance reprend à la même question (`P/015-14-maison.jpg`, `P/016-15-reprise.jpg`). Après un rechargement, en revanche (cas réel : Chrome vidé de la mémoire par Android), « continuer » a disparu et l'accueil revient à « jouer ». La séance repart du choix du niveau, puis de la leçon du bernard-l'ermite. Tout le bloc d'additions recommence à zéro : une vingtaine de questions déjà faites, la frise de nouveau vide (`P/024-23-apres-veille.jpg` avant, `P/025-24-apres-recharge.jpg`, `P/026-25-jouer-apres-recharge.jpg`, `P/029-28-reprise-additions.jpg`). Les étoiles restent acquises. L'espace parent compte une « séance interrompue ». En fin de séance, la mascotte annonce « Ce soir, tu as gagné 84 étoiles » : seules sont comptées les étoiles gagnées depuis le rechargement, alors que le compteur était passé de 87 à 234 dans la soirée (`P/042-38-recompense.jpg`).

Pour reproduire :
```
curl "localhost:8796/toucher?x=250&y=652"; curl "localhost:8796/toucher?x=250&y=652"   # jouer (2 touchers)
curl "localhost:8796/toucher?x=920&y=420"; curl "localhost:8796/toucher?x=810&y=668"   # niveau, valider
# répondre à une quinzaine de questions (clavier 0-9 en y=540/668, valider 1010,668), jusqu'au bloc du bernard-l'ermite
curl "localhost:8796/recharger"; curl "localhost:8796/toucher?x=640&y=400"
curl "localhost:8796/etat"        # pas de « continuer », seulement « jouer »
curl "localhost:8796/toucher?x=250&y=652"; curl "localhost:8796/toucher?x=250&y=652"   # choix du niveau, puis leçon, puis frise vide
```

### 2. Fin de séance : environ 50 s sans moyen de revenir à l'accueil — **gênant**

Après la récompense (« Tu peux choisir une créature à la boutique ! »), l'écran ne montre plus que la boutique : pas de maison, et toucher le décor ne fait rien. L'accueil ne revient seul qu'environ 50 s plus tard (05:57:29 → 05:58:21). Une enfant qui ne veut pas aller à la boutique reste devant un écran vide (`P/044-40-recompense3.jpg`, `P/045-41-fin-attente.jpg`).

Pour reproduire : aller au bout d'une séance, puis `curl localhost:8796/etat` toutes les 5 s. Les boutons restent « réécouter, la boutique » jusqu'à l'arrivée de l'accueil (« encore… »).

### 3. Multiplication : l'image de la correction reste à l'écran après le retour à l'accueil, et la voix continue — **gênant**

Si l'on touche la maison pendant la correction d'une réponse fausse, la carte de correction (poissons en rangées, nombres « 2 / 4 » ou « 3 / 6 ») reste affichée par-dessus l'accueil. Elle reste aussi sur la grille des niveaux de la ligne graduée et sur la page des leçons. Elle ne disparaît qu'en entrant dans une leçon (`P/109-105-ligne.jpg`, `P/110-106-ligne-fantome.jpg`, `P/111-107-accueil-fantome.jpg`, `P/112-108-lecons.jpg`, reproduit dans `P/149-145-fantome-essai2.jpg`). La correction continue aussi à parler après le départ : « 3 fois 2, ça fait 6. », « 2 fois 4 ? », puis « 3 rangées de 5 poissons. » sont dits alors qu'on est déjà à l'accueil.

Pour reproduire (reproduit 2 fois sur 3 ; le moment exact du toucher compte) :
```
# accueil après la séance : encore ×2, attendre ~10 s
curl "localhost:8796/toucher?x=1014&y=470"; curl "localhost:8796/toucher?x=1014&y=470"   # multiplication
curl "localhost:8796/toucher?x=692&y=246";  curl "localhost:8796/toucher?x=692&y=246"    # niveau 2
curl "localhost:8796/toucher?x=810&y=668"                                               # valider
# à la première question, taper une réponse fausse (ex. 1) puis valider (1010,668)
# 2 à 8 s après la réponse fausse :
curl "localhost:8796/toucher?x=74&y=70"
curl "localhost:8796/capture?nom=fantome"
```

### 4. Après la séance, les exercices ne rapportent plus aucune étoile, sans que l'enfant le comprenne — **gênant**

En entraînement libre (« encore »), l'étal, les voiliers, le calcul rapide et la multiplication disent « Super ! », « Bravo ! », mais le compteur reste à 234 (`P/062-58-apres10.jpg`, `P/097-93-voiliers-90.jpg`, `P/107-103-multi2.jpg`). Une seule phrase, au début, le dit (« Ici, on s'entraîne pour le plaisir »). Une enfant qui veut des étoiles ne comprend pas pourquoi elles ne montent plus et le demandera au parent. Si c'est voulu, il manque un signe visible : un compteur grisé, ou une phrase après la première bonne réponse. Autre point : « choisir » disparaît de l'accueil après la séance. L'icône « encore » (triangle et étoiles) ne ressemble plus à « choisir », et le parent qui a dit « prends la bulle aux carrés de couleur » ne la retrouve pas (`P/046-42-accueil-fin.jpg`).

### 5. « Encore » : environ 10 s de paroles devant un écran vide avant de pouvoir choisir — **gênant**

Chaque fois qu'on passe par « encore », la mascotte enchaîne « Tu veux encore jouer ? Choisis ! Ici, on s'entraîne pour le plaisir. » puis « Qu'est-ce que tu veux faire ? Touche une bulle… Touche-la encore pour commencer. ». Les bulles d'exercices n'apparaissent qu'à la fin de la seconde phrase. Les touchers donnés entre-temps sont perdus. C'est la même chose à chaque retour, même la cinquième fois de la soirée (`P/047-43-encore.jpg` : seuls la mascotte et la maison sont visibles).

Pour reproduire : à l'accueil après la séance, `toucher?x=478&y=652` deux fois, puis `etat` à +2 s : les boutons sont « réécouter, maison » seulement. Les bulles apparaissent vers +10 s.

### 6. La bulle de la mascotte cache justement ce dont parle la voix — **gênant**

- Aide de la tortue, à l'échauffement : la bulle « Compte les sauts avec la tortue » couvre le début de l'égalité (« 2 + ») (`P/012-11-aide.jpg`).
- Calcul rapide : « 42 plus 6 ? Suis le chemin… ». Pendant toute la phrase, la bulle recouvre le chemin de cailloux (`P/103-99-calcul-q2.jpg`, `P/104-100-calcul-faux.jpg`).
- Voiliers : « Il est plus petit que cette bouée : il passe avant. ». La bulle couvre la bouée 63 dont il est question, et aussi le passage « avant » (`P/090-86-voiliers-glisse.jpg`).
- Boutique : la bulle qui part de la tuile du poisson-clown couvre toute la rangée du bas (hippocampe, poisson-ballon…), que l'enfant veut toucher ensuite (`P/120-116-boutique-clown.jpg`).
- Étal : le portefeuille ouvert cache l'article à acheter (« Achète la seiche… 11 euros » : la seiche est sous les billets) (`P/067-63-q3-etale.jpg`).

### 7. Voiliers : toucher un passage ne fait rien, il faut faire glisser le bateau ; bateaux très loin des bouées — **gênant**

La consigne dit « Fais passer chaque bateau par le bon passage ». Toucher l'eau entre deux bouées, ou à gauche de la première, ne donne aucune réaction, ni voix ni geste (`P/088-84-voiliers-gauche.jpg`, `P/089-85-voiliers-6367.jpg`). Seul un glisser depuis le bateau fonctionne. L'enfant touche, rien ne se passe, et elle demande au parent. Autre point : au niveau 2, décrit dans la légende comme « ranger un nombre jusqu'à 100 entre des bouées », arrivent les bateaux **43** puis **3** devant les bouées 63, 67 et 73 (`P/087-83-voiliers-43.jpg`, `P/095-91-voiliers-3.jpg`). La bonne réponse est « avant la première bouée », ce qui déroute. Pour le bateau 3, les bouées 63 et 73 contiennent aussi un 3.

Pour reproduire : encore ×2, voiliers ×2 (848,470), niveau 2 ×2 (692,246), valider (810,668). Laisser passer l'exemple, puis `toucher?x=480&y=640` : aucune réaction. Ensuite `glisser?x1=880&y1=370&x2=480&y2=640&ms=600` : réaction.

### 8. Boutique : toucher la mascotte ne redit pas le prix de la créature choisie — **gênant**

Pendant la proposition d'achat (anémone, 40 étoiles, coche verte affichée), toucher la mascotte redit la consigne générale (« Touche une créature : je te dis son prix… ») au lieu de « C'est l'anémone de mer ! Pour l'avoir, il faut 40 étoiles… » (`P/125-121-boutique-reecoute.jpg`).

Pour reproduire : dans la boutique, `toucher?x=801&y=458` (anémone), puis `toucher?x=127&y=276`, puis `etat`.

### 9. Boutique : une créature qu'on vient d'acheter affiche encore un prix — **gênant**

Juste après l'achat de l'oursin (40 étoiles), sa tuile affiche « ✦150★ », comme les autres créatures déjà possédées (prix pour la « faire briller »). Seule une petite étincelle les distingue d'un prix d'achat. L'enfant croit que l'achat n'a pas marché, ou qu'il faut repayer (`P/123-119-boutique-achat2.jpg`). L'achat lui-même est solide : trois touchers rapides sur la coche ne débitent qu'une fois (234 → 194, `P/122-118-boutique-achat.jpg`).

### 10. Espace parent : on ne sait pas de quel exercice il s'agit, et la « notion du jour » se contredit — **gênant** (parent)

L'historique liste quatre « entraînement libre » sans dire si c'était l'étal, les voiliers, le calcul ou la multiplication (`P/133-129-parent-seances.jpg`). Il faut ouvrir chaque séance. Dans le détail d'une séance d'étal, l'en-tête dit « Notion du jour : **Ligne graduée** » et la ligne juste en dessous « Notion du jour : **L'étal du pêcheur** » (`P/135-131-parent-detail2.jpg`). Les réponses « toujours 5 » données en 0,6 s ne sont signalées par rien.

### 11. Accueil : « jouer » demande deux touchers, « continuer » démarre au premier, et le second toucher tape un chiffre — **gênant**

Au premier toucher, « jouer » ne fait que se présenter ; il faut un second toucher. « Continuer » lance la séance dès le premier. L'enfant qui a pris l'habitude de toucher deux fois voit son second toucher atterrir sur le clavier : un « 5 » s'écrit dans la réponse (`P/016-15-reprise.jpg`).

Pour reproduire : en pleine séance, `toucher?x=74&y=70` (maison), puis `toucher?x=370&y=650` deux fois à 2 s d'écart, puis `capture`.

### 12. Défi de fin de séance : « Prends ton temps » pendant une course contre la montre — **gênant**

Pendant le défi chronométré (« Essaie de dépasser le drapeau de ton record… Partez ! »), la relance habituelle arrive au bout d'une vingtaine de secondes : « Prends ton temps. Touche-moi pour réécouter la consigne. » (05:56:17, défi lancé à 05:55:56). C'est contradictoire. Les questions du défi ne sont pas lues : c'est sans doute voulu, mais l'enfant doit tout lire seule (`P/036-34-apres-additions.jpg`).

### 13. Bloc d'additions très répétitif — **gênant** (question pédagogique)

En deux minutes de bonnes réponses, « 4 plus 2 » revient cinq fois et « Combien plus 1, ça fait 5 ? » quatre fois (05:50:56 → 05:53:00, voir le journal). Le bloc de la séance dure environ 55 questions, soit 5 à 6 minutes. L'enfant repère vite les réponses qui reviennent (4, 6, 7). Si cette répétition est voulue, rien à corriger ; je le signale parce qu'elle a fait « toujours 7 » et a eu juste une fois sur trois dans la maison du 7 (`P/021-20-toujours7.jpg`).

### 14. Étal : compteur d'étoiles illisible par temps d'orage, petite bulle coupée — **cosmétique**

Par temps d'orage, le nombre d'étoiles (bleu nuit) se fond dans le ciel sombre (`P/051-47-etal-debut.jpg`). La bulle courte « 7 euros. » apparaît minuscule et en partie cachée par le cadre de la fenêtre de la cabane (`P/052-48-portefeuille.jpg`).

### 15. Récompense : l'« étoile arc-en-ciel » annoncée n'est montrée nulle part — **cosmétique**

« Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » : l'écran ne montre que la grosse bulle « ★ 84 » (`P/042-38-recompense.jpg`). La boutique dit que le récif de corail s'ouvrira « grâce à tes étoiles arc-en-ciel », sans montrer combien elle en a.

### 16. Cartes différentes des créatures du récif — **cosmétique**

Le crabe est rouge dans le récif et vert sur sa carte. L'anémone est violette dans le récif et verte sur sa carte (`P/116-112-recif-crabe.jpg`, `P/126-122-recif-apres-achat.jpg`, `P/127-123-album.jpg`).

### 17. Gestes inattendus — **cosmétique**

- Deux doigts sur le clavier tapent deux chiffres (« 74 ») (`P/031-30-deuxdoigts.jpg`).
- Un glisser sur le clavier remplace la réponse par le chiffre de départ (`P/032-31-glisser.jpg`).
- Un appui long sur une bulle de l'accueil (le récif) ne fait rien, pas même la voix (`P/138-134-appui-long-recif.jpg`).
- Après la veille de l'écran, la question n'est pas redite. Seule la relance « Prends ton temps » arrive 15 s plus tard (`P/024-23-apres-veille.jpg`).
- Au choix des exercices, la bulle de l'étal touche le bord droit et le corail (`P/048-44-choix-exos.jpg`).

## Ce qui m'a paru bien

- Aucune erreur de page sur 46 minutes, aucune phrase sans voix, rien de bloqué par les doubles et triples touchers. Les validations en rafale ne valident qu'une fois, et l'achat en rafale ne débite qu'une fois.
- La maison en pleine séance suivie de « continuer » reprend exactement à la même question, avec « On continue ! ».
- L'étal est très réussi : le portefeuille, les billets qui vont dans la soucoupe au toucher ou au glisser, le comptage à voix haute (« 10, 15, 17, 19 euros »), la correction de la monnaie sur la ligne de la tortue (« 16, 17, 18, 19, 20 »), la lampe et l'orage.
- Les corrections sont claires et visuelles : réponse entourée, maison du 7 avec ses poissons, rangées de poissons, sauts de la tortue. Le « je ne sais pas » est bienveillant.
- Pour le parent, la légende des niveaux (« Ce qui est travaillé », avec un exemple) permet de répondre en dix secondes à « qu'est-ce que je choisis ? ». L'espace parent est clair : calendrier, détail question par question, progression par niveau, sauvegarde.
- Le récif vivant, l'album et les cartes avec leur anecdote lue sont beaux, et l'achat fait vraiment apparaître la créature dans le récif.
