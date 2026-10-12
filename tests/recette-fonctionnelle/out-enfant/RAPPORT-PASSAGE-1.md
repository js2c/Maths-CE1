# Recette « enfant » — passage 1

- **Début** : 11 octobre 2026, 23 h 42 (UTC). **Fin** : 12 octobre 2026, 00 h 31. Environ 49 minutes, dont une coupure d'environ 3 minutes (23 h 49 à 23 h 52, limite de débit de mon côté ; la page est restée ouverte).
- Pilote : `tests/recette-fonctionnelle/pilote.mjs --base-un-mois`, 1280 × 800.
- Captures et journal des commandes : `tests/recette-fonctionnelle/out-enfant/passage-1/` (179 captures, `journal.txt` ; captures réduites ensuite par la session en JPEG 960 × 600, pour le poids du dépôt). Ci-dessous, `P/` veut dire ce dossier.
- Les commandes du pilote sont écrites sans `curl "localhost:8795/…"` autour, par exemple `toucher?x=640&y=400`.

## Ce que j'ai joué

- **Écran de démarrage**, puis **accueil** : chaque galet touché une fois (la voix dit ce qu'il fait), la mascotte touchée une fois puis cinq fois de suite.
- **Une séance « Jouer » en entier**, en « très dur » : échauffement (additions, réponses justes et fausses, « je ne sais pas », l'aide, un double toucher sur un chiffre, « passer l'échauffement » en le confirmant puis sans le confirmer), puis la notion du jour (la maison du 7 avec le bernard-l'ermite : leçon, exemple guidé, réponses justes, fausses, au hasard, toujours la même réponse). En pleine question : **la maison**, puis « continuer », puis « choisir » et **la ligne graduée** niveau 4 (légende, exemple, placer le poisson juste et faux, toucher l'eau, toucher la ligne directement, trois touchers rapides, deux doigts, « je ne sais pas », rejouer puis passer une leçon en route, **veille de 20 s** et reprise). Puis l'**espace parent** ouvert pendant la pause (création du code, calendrier, séances, progression), refermé. Puis **le récif** (créatures touchées, défilement, réécouter), **l'album** (cartes, retour), **les leçons** (L9 regardée en entier), **les voiliers** niveau 1 (bateau bien et mal placé), puis **rechargement de la page** en pleine partie.
- **Une deuxième séance « Jouer »** en « facile », jouée jusqu'au bout (défi record, récompense, annonce de la boutique).
- Après la fin de la séance : **« Encore »**, **l'étal du pêcheur** niveau 1 (deux fois), **le calcul rapide** niveau 6 (puis la maison en pleine question), **la multiplication** niveau 1 (valider sans réponse, trois fois), la leçon L13 **quittée en route** par la maison, **la boutique** (cherchée depuis l'écran de fin et depuis le récif), l'espace parent à nouveau (détail d'une séance).

## Constats

### 1. Bloquant — L'étal du pêcheur ne répond plus aux touchers : ni la coche, ni la maison, ni la mascotte, ni l'aide, ni « je ne sais pas »

Dans l'étal (niveau 1), seuls le portefeuille (toucher) et le glisser des billets marchent. La coche « j'ai payé » apparaît quand le billet est dans la soucoupe, mais la toucher (une fois, deux fois, appui court) ne fait rien. La maison, la mascotte, le coquillage d'aide, la pieuvre « je ne sais pas » et la lampe ne réagissent pas non plus, **dès l'arrivée dans l'étal, avant même d'avoir ouvert le portefeuille** (deuxième essai). La veille et la reprise ne débloquent rien. L'enfant est coincée : elle ne peut ni répondre ni repartir. Seul le rechargement de la page la sort de là. Aucune erreur n'est relevée dans la page.

- Captures : `P/149-144-etal-billet10.jpg` (le billet dans la soucoupe, la coche visible), `P/151-146-etal-q2.jpg`, `P/157-152-etal-fige-10s.jpg` (rien n'a bougé après 3 touchers sur la coche), `P/156-151-etal-maison.jpg`, `P/162-157-etal-apres-veille.jpg`, `P/167-162-etal-repro-maison.jpg` (deuxième essai : la maison ne répond pas).
- Pour le reproduire (depuis l'accueil de fin de séance, « encore » en 478,652) : `toucher?x=478&y=652`, `toucher?x=478&y=652`, `attendre?ms=6000`, `toucher?x=1180&y=470` deux fois (l'étal), `toucher?x=496&y=246` deux fois (niveau 1), `attendre?ms=7000`, `toucher?x=810&y=668` (valider le niveau), `attendre?ms=9000`, puis `toucher?x=150&y=528` (aide : rien), `toucher?x=120&y=290` (mascotte : rien), `toucher?x=74&y=70` (maison : rien). Avec le billet : `toucher?x=1110&y=695` (portefeuille, ça marche), `glisser?x1=840&y1=320&x2=470&y2=690&ms=700` (le billet de 10 dans la soucoupe), `toucher?x=158&y=700` (la coche : rien).

### 2. Bloquant — La boutique ne s'ouvre jamais

À la fin de la séance, la mascotte dit « De nouvelles créatures sont arrivées à la boutique ! » puis « Tu peux choisir une créature à la boutique ! », et un bouton boutique apparaît en bas à droite. Au bout de 13 s environ, et après un toucher sur la mascotte, l'écran passe tout seul à l'accueil « C'est fini pour aujourd'hui. À demain ! » : la boutique n'a pas été ouverte. Dans le récif, le bouton boutique (un étal rayé, à gauche) s'enfonce quand on le touche, mais rien ne s'ouvre, même après 8 s d'attente, ni avec un appui court, ni après rechargement de la page. L'enfant a gagné des créatures à choisir mais ne peut pas les prendre.

- Captures : `P/128-123-boutique-annonce.jpg`, `P/130-125-attente-boutique.jpg`, `P/131-126-boutique.jpg` (on est revenu à l'accueil), `P/134-129-boutique-tap.jpg`, `P/136-131-boutique-attente.jpg`, `P/179-174-boutique-essai3-attente.jpg`.
- Pour le reproduire : finir une séance « Jouer » (la récompense annonce la boutique), puis à l'accueil `toucher?x=933&y=652` deux fois (le récif), `attendre?ms=3500`, `toucher?x=90&y=408` (la boutique), `attendre?ms=8000`, `etat` : toujours le récif.

### 3. Gênant (presque bloquant) — Dans le récif, toucher une créature n'ouvre pas sa carte

La voix dit « Voici ton récif ! Touche une créature pour voir sa carte. » Mais le crabe, l'étoile de mer, l'hippocampe, le poisson-clown, la moule et le bernard-l'ermite, touchés vite ou avec un appui court, ne font rien (ni carte, ni voix). L'enfant fait exactement ce qu'on lui dit et rien ne se passe.

- Captures : `P/078-75-recif-crabe.jpg`, `P/079-76-recif-etoile.jpg`, `P/080-77-recif-hippocampe.jpg`, `P/082-79-recif-poisson-clown-2.jpg`, `P/098-95-recif-etoile-appui.jpg`, `P/100-97-recif-bernard.jpg`.
- Pour le reproduire : à l'accueil, `toucher?x=933&y=652` deux fois, `attendre?ms=3500`, puis `toucher?x=510&y=665` (le crabe) ou `appui?x=195&y=678&ms=150` (l'étoile de mer), `attendre?ms=2500`, `etat` : aucune phrase, pas de carte.

### 4. Gênant — Dans l'album, un toucher rapide est ignoré ; il faut appuyer un peu plus longtemps

Toucher la carte du crabe, ou le bouton « revenir » (deux fois), ne fait rien. Un appui de 150 ms ouvre la carte (le poisson-clown, avec son nom et son anecdote dite) et ramène au récif. Un enfant qui tape vite croira que l'album ne marche pas. C'est peut-être la même cause que les constats 1 à 3 (même endroits de l'application : récif, album, étal).

- Captures : `P/088-85-carte-crabe.jpg` (toucher : rien), `P/089-86-carte-clown-appui.jpg` (appui : la carte s'ouvre), `P/091-88-retour-recif.jpg` et `P/092-89-maison-album-2e.jpg` (« revenir » touché : rien), `P/094-91-recif-retour.jpg` (appui : retour au récif).
- Pour le reproduire : dans le récif, `toucher?x=90&y=560` (l'album, ça marche), puis `toucher?x=633&y=197` (rien), `appui?x=359&y=197&ms=150` (la carte s'ouvre), `toucher?x=90&y=712` (rien), `appui?x=90&y=712&ms=150` (retour).

### 5. Gênant — Deux doigts posés sur la ligne graduée comptent comme une réponse fausse

Sur « Place le poisson sur le nombre 18 », deux doigts posés en même temps sur la ligne (sans rien viser) donnent « Hmm, regardons ensemble. » et la correction : la question est perdue. Une main posée sur la tablette suffit à faire une erreur notée.

- Capture : `P/065-62-deuxdoigts-ligne.jpg`.
- Pour le reproduire : dans la ligne graduée, sur une question « Place le poisson… », `deuxdoigts?x1=500&y1=455&x2=900&y2=455`, puis `etat`.

### 6. Gênant — Un double toucher rapide sur un chiffre tape le chiffre deux fois

Sur « 5 + 2 », deux touchers rapides sur le 7 (80 ms d'écart) donnent « 77 ». Si l'enfant valide sans regarder, la réponse est fausse alors qu'elle savait. Dans la ligne graduée, au contraire, trois touchers rapides sur une réponse ne comptent qu'une fois (bien).

- Capture : `P/016-15-double7.jpg`.
- Pour le reproduire : sur une question de l'échauffement, `toucher?x=626&y=668&n=2&ecart=80`, puis `capture`.

### 7. Gênant — À la fin de la séance, l'offre de la boutique disparaît sans que l'enfant ait choisi

L'écran « Tu peux choisir une créature à la boutique ! » n'a que la mascotte et le bouton boutique. Quand l'enfant touche la mascotte (pour réécouter), l'application passe à l'accueil « C'est fini pour aujourd'hui. À demain ! » : il n'est pas clair si la mascotte a fermé l'écran ou si c'est le temps qui a passé, mais la boutique n'est plus proposée. Le parent ne saura pas dire à l'enfant où la retrouver (le bouton n'est que dans le récif, et il ne marche pas : constat 2).

- Captures : `P/129-124-suite.jpg`, puis `P/131-126-boutique.jpg`.
- Pour le reproduire : en fin de séance, sur l'écran de la boutique, `attendre?ms=10000`, `toucher?x=127&y=276`, `attendre?ms=3000`, `etat`.

### 8. Cosmétique — Après « passer l'échauffement », la relance « Prends ton temps… » est dite au mauvais moment

En touchant « passer l'échauffement » puis la coche, la voix dit d'abord « Prends ton temps. Touche-moi pour réécouter la consigne. », puis répète la question de confirmation, puis annonce la suite. Sans confirmation, la coche disparaît au bout de 8 s environ sans un mot et la question revient : c'est correct, mais l'enfant ne sait pas pourquoi.

- Captures : `P/025-24-apres-echauffement.jpg`, `P/026-25-confirmation-attente.jpg`, `P/027-26-apres-skip.jpg`.
- Pour le reproduire : pendant l'échauffement, `toucher?x=1205&y=400`, `attendre?ms=8000`, `etat`, puis `toucher?x=1205&y=400`, `attendre?ms=800`, `toucher?x=1205&y=400`, `attendre?ms=2500`, `etat`.

### 9. Cosmétique — Valider sans réponse ne dit rien

Dans la multiplication, la coche touchée trois fois sans chiffre tapé ne fait rien, sans un mot. Ce n'est pas faux, mais une petite phrase (« Tape d'abord ta réponse ») aiderait l'enfant qui ne comprend pas pourquoi rien ne se passe.

- Capture : `P/175-170-multi-valide-vide.jpg`.
- Pour le reproduire : sur une question à clavier, `toucher?x=1010&y=668&n=3&ecart=60`, `etat`.

### 10. Cosmétique — Dans l'espace parent, la ligne « Défi record : 0 bonne réponse sur 10 » peut inquiéter

Dans le détail de la séance, le parent lit « Défi record : 0 bonne réponse sur 10 (record : 10) » sans explication : il ne sait pas que c'est le défi d'une minute de fin de séance, ni que 0 peut vouloir dire « répondu au hasard ». J'ai répondu au hasard, donc le chiffre est juste ; c'est la lecture qui n'est pas simple. Le reste de l'espace parent se lit bien (calendrier avec légende des couleurs, historique, détail question par question, bandeau « séance en pause » qui explique ce que fait « Terminer la séance »).

- Capture : `P/139-134-parent-detail.jpg`.

## Ce qui m'a paru bien

- L'accueil se comprend sans lire : chaque galet se présente à voix haute au premier toucher et s'ouvre au second ; la bulle part du galet touché. La mascotte touchée cinq fois de suite répète sans bégayer ni empiler les phrases à l'écran.
- La maison en pleine question puis « continuer » reprend exactement la même question (« On continue ! 1 plus combien, ça fait 7 ? »). Le rechargement de la page et la veille ne cassent rien ; la page n'a relevé aucune erreur de tout le passage.
- Les corrections sont claires et adaptées : « On compte les sauts, pas les traits. », « Il est plus grand que 40 : il passe après. », la maison du 7 avec les poissons qui montent sous le toit, la boîte à dix places. Après plusieurs réponses au hasard, l'application propose d'elle-même « On essaie un peu moins dur ? ».
- Les leçons (L9 « passer la dizaine », L13) sont belles et lisibles. Les quitter par la maison coupe bien la voix. « Passer la leçon » mène directement à la question.
- Les voiliers et le calcul rapide (chemin de cailloux +10 −1) sont très réussis visuellement et se jouent sans hésitation.
- Les trois touchers rapides sur une réponse de la ligne graduée ne comptent qu'une fois. Les choix de niveau (« facile », « conseillé », « dur », « très dur ») disent à voix haute ce qu'ils rapportent en étoiles.
