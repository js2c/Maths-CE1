# Recette fonctionnelle du lot 3 : rapport du relecteur

Session 2 de `docs/PROMPT-RECETTE-LOT3.md`, le 28 septembre 2026. Matériel jugé : `tests/recette-fonctionnelle/out/` (planches A, séquences B, journal C, séances D ; voir `INDEX.md`). Les chemins des planches et des fichiers sont relatifs à ce dossier. Phase 1 menée sans lire les spécifications, le journal ni le code ; la qualification (phase 2) a été ajoutée ensuite, d'après `docs/SPEC.md`, `docs/SPEC-LOT2.md` et `docs/SPEC-LOT3.md`. Rien n'a été corrigé.

Légende de la qualification : **spécification** = conforme, mais mauvais pour l'enfant ; **réalisation** = non conforme ; **question** = la spécification ne tranche pas.

## 1. Synthèse

1. **Ce qui empêche d'apprendre.** Plusieurs exercices ont une réponse constante ou presque : les amis de 10 à la forme directe (« 10 » à chaque question), le calcul rapide « très dur » aux niveaux 1, 2 et 6 (« 1 ou 2 », « 10 », « 9 » à chaque question), et le cran « plus facile » de la ligne (niveaux 2, 5, 9), où les mêmes 4 questions reviennent en boucle (R1 à R3).
2. Dans ces cas, la famille ou le niveau peuvent être **validés** sans calculer, et le cran « très dur » double les étoiles de ce qui est devenu l'exercice le plus facile.
3. Au niveau 1 de la ligne, la réponse est le nombre qui manque dans la suite écrite 0 1 2 ? 4… : on la trouve sans compter les sauts (R4).
4. Les aides et les corrections du calcul rapide sont muettes ou se contentent de « C'était 40. » ; l'aide des additions donne parfois la réponse (« Elle fait 2 sauts ») ou ne fait que redessiner la question (la maison) (R5 à R8).
5. **Ce qui la perd.** Un chiffre tapé pendant le « bravo » atterrit dans la question suivante et coupe sa consigne ; après une pause, la consigne n'est pas redite à la ligne et au calcul (R11, R12).
6. La fin de séance fait attendre jusqu'à 45 s sans rien à toucher, avec la même phrase « étoile arc-en-ciel » dite jusqu'à six fois ; la fin du défi record n'est ni dite ni montrée (R13, R14).
7. À l'écran « choisir », le parent ne peut pas dire en dix secondes ce que montre une tuile, et un toucher lance l'exercice sans aperçu (R15).
8. Répondre au hasard donne autant de cartes nouvelles qu'en s'appliquant (le quota plafonne les cartes) ; la différence ne porte que sur les doublons (R10).
9. **Ce qui marche.** Les corrections de la ligne graduée (E1 à E7) et du mur de corail (C1, C3) montrent vraiment pourquoi c'était faux ; les leçons L1, L3, L5, L6, L7 et L10 sont claires ; les pièges des bulles sont bien construits.
10. Aucune impasse ni erreur de page ; pause, reprise, « passer » et « je ne sais pas » répondent partout ; récompense, récif, album et espace parent (calendrier, séances, grille) sont soignés.

## 2. Constats bloquants

### R1 · Additions : réponse constante dans les familles à somme fixe

- **Où** : `B-sequences/neuve/additions-famille-3.md` (cran « plus facile » : 18 questions sur 18 ont la réponse 10 ; « conseillé » : 24 sur 30, jusqu'à 6 « 10 » de suite, famille déclarée acquise à la question 24) ; `B-sequences/mois/additions-famille-3.md` (« plus facile » : 24 sur 24) ; `additions-famille-5.md` et `additions-famille-4.md`, cran « plus facile » (2 réponses possibles, 8 ou 9 ; 3 réponses possibles, 5, 6 ou 7) ; planches `A-ecrans/A03-questions-04.jpg` n° 16, `A03-questions-05.jpg` n° 17, `A05-corrections-12.jpg` n° 45–46 (2 + 8, puis 7 + 3).
- **Personne** : l'enfant.
- **Observé** : à la forme directe, « 2 + 8 = ? », « 7 + 3 = ? », « 4 + 6 = ? »… ont toutes pour réponse 10 ; aux maisons de 8 et 9, toutes les réponses valent 8 ou 9.
- **Pourquoi c'est un problème** : elle repère très bien une réponse qui revient toujours. Après deux questions, elle tape « 10 » sans regarder, gagne ses étoiles, et la famille est validée (étoile arc-en-ciel) sans qu'elle ait appris un seul complément à 10. C'est l'inverse de la compétence visée (« 3 + ? = 10 »).
- **Qualification** : **spécification**. `docs/SPEC.md` (module 2) ouvre les formes à trou seulement « quand la forme directe d'un groupe est acquise », et `docs/SPEC-LOT3.md` §3 limite « plus facile » aux formes directes ; pour une famille à somme fixe, la forme directe n'a qu'une seule réponse.
- **Piste** : pour les amis de 10 et les maisons, poser d'emblée les formes à trou (ou mêler des sommes différentes), et ne compter pour l'acquisition que les réponses à des questions dont la réponse varie.

### R2 · Calcul rapide « très dur » : la même réponse à chaque question

- **Où** : `B-sequences/neuve/calcul-2.md`, cran « très dur » (34 questions, toutes « 10 » : « 79 + ? = 89 », « 84 − ? = 74 »…) ; `calcul-6.md`, « très dur » (34 fois « 9 ») ; `calcul-1.md`, « très dur » (41 questions, réponses 1 ou 2) ; mêmes résultats en base « un mois » (`B-sequences/mois/`, 43 questions) ; tableau de `B-sequences/SYNTHESE.md`.
- **Personne** : l'enfant.
- **Observé** : la forme à trou d'une procédure à pas fixe a une réponse fixe (le pas). Le niveau est validé à la 5e question (« MONTÉE (niveau 2 acquis) ; étoile arc-en-ciel »), et chaque bonne réponse rapporte 2 étoiles (cran × 2) : jusqu'à 99 à 114 étoiles par séance.
- **Pourquoi c'est un problème** : le cran présenté comme le plus exigeant devient le plus facile et le plus payant ; elle le choisira pour les étoiles, tapera « 10 » ou « 9 » sans calculer, et le niveau sera validé sans travail.
- **Qualification** : **spécification**. `docs/SPEC-LOT3.md` §6 : « très dur = sans chemin et formes à trou […] aux niveaux où la forme à trou a un sens (1 à 8) » ; aux niveaux 1, 2 (et 3 en partie) et 6, elle n'en a pas.
- **Piste** : aux niveaux à pas fixe, remplacer la forme à trou par le trou sur le nombre de départ (« ? + 10 = 57 ») ou par un mélange avec les niveaux acquis.

### R3 · Ligne graduée « plus facile » : 4 questions qui reviennent en boucle

- **Où** : `B-sequences/neuve/ligne-02.md`, cran « plus facile » (38 questions, 4 réponses différentes : 9, 1, 3, 7, toujours dans cet ordre, avec les mêmes bulles 1 / 9 / 10 et 3 / 4 / 7) ; même chose en `ligne-05.md` (4 réponses) et `ligne-09.md` (100, 300, 700, 900 : 4 réponses) ; mêmes résultats en base « un mois ».
- **Personne** : l'enfant.
- **Observé** : au cran « plus facile », presque toutes les graduations sont écrites (0, 2, 4, 5, 6, 8, 10) ; il ne reste que 4 cibles possibles, et les questions tournent dans le même ordre avec les mêmes propositions.
- **Pourquoi c'est un problème** : dès le deuxième tour, elle répond de mémoire (« l'étoile juste avant 10, c'est 9 ») ; la séance ne travaille plus la lecture de la ligne.
- **Qualification** : **spécification** pour le petit nombre de cibles (`docs/SPEC-LOT3.md` §3, tableau : « aussi 2, 4, 6, 8 écrits », « plus les dizaines paires », « aussi 200, 400, 600, 800 ») ; **réalisation** pour la boucle strictement répétée, contraire à `docs/SPEC.md`, module 1 : « Les exercices sont tirés au hasard […] Ainsi, elle ne peut pas apprendre les réponses par cœur. »
- **Piste** : au cran « plus facile », écrire un repère de plus sans vider les cibles (par exemple seulement 5 au niveau 2), et tirer les cibles au hasard avec des propositions renouvelées.

## 3. Constats gênants

### R4 · Ligne graduée niveau 1 : la réponse est le nombre qui manque

- **Où** : `A-ecrans/A03-questions-01.jpg` n° 4 (0 1 2 ? 4 5…), `A03-questions-02.jpg` n° 5 (tortue sur 7, un saut : le 8 manque sous la corde), `D-vitesse-reelle/D-ligne-03.jpg` n° 9–10.
- **Personne** : l'enfant.
- **Observé** : tous les nombres sont écrits sauf la cible ; en « sauter », la graduation d'arrivée est la seule sans nombre.
- **Pourquoi c'est un problème** : elle lit la suite « 0, 1, 2, ?, 4 » et trouve 3 sans compter un seul saut ; en « sauter », elle n'a pas à suivre la tortue. La leçon L1 (« on compte les sauts ») n'est pas mise à l'épreuve. La voie rapide l'en fait sortir vite, ce qui limite le dommage.
- **Qualification** : **spécification** (`docs/SPEC.md`, module 1, niveau 1 : « Tous sauf la cible »).
- **Piste** : cacher aussi un ou deux nombres voisins de la cible, et, en « sauter », ne pas laisser un trou unique à l'arrivée.

### R5 · Additions : aides qui donnent la réponse ou qui n'aident pas

- **Où** : `A-ecrans/A04-aides-01.jpg` n° 2–3 et `A04-aides-04.jpg` n° 15 (« ? + 8 = 10 » : « La tortue est sur 8. Elle fait 2 sauts. ») ; `A04-aides-03.jpg` n° 9 et 11 (maison : 3 et 4 dans les pièces, « ? » sur le toit).
- **Personne** : l'enfant.
- **Observé** : l'aide des « + 1 et + 2 » dit la réponse avant de la montrer ; l'aide des maisons (familles 4 et 5) redessine la question (« les deux pièces, ensemble, font le nombre du toit ») sans rien pour trouver le total ; la famille 5 n'a que la maison, sans cadre de 10.
- **Pourquoi c'est un problème** : dans le premier cas, elle recopie « 2 » entendu ; dans le second, elle reste seule devant « 3 + 4 » avec une image qui ne lui dit rien de plus. Elle appellera le parent.
- **Qualification** : **spécification** pour les deux appuis (`docs/SPEC.md`, module 2, tableau des familles) ; **réalisation** pour l'appui de la famille 5 (le tableau prévoit « Maison et cadre de 10 »).
- **Piste** : faire compter les sauts sans les annoncer (« compte avec elle jusqu'à 10 ») ; pour les maisons, faire apparaître les quantités (poissons dans les pièces, ou cadre de 10).

### R6 · Calcul rapide : aides muettes, mur de corail absent

- **Où** : `A-ecrans/A04-aides-05.jpg` n° 17–20, `A04-aides-06.jpg` n° 22 et 24, `A04-aides-07.jpg` (voix : « (silence) ») ; `A03-questions-05.jpg` n° 18–19 (« Le petit poisson va t'aider », aucun poisson ni mur à l'écran).
- **Personne** : l'enfant.
- **Observé** : l'aide du coquillage fait apparaître un chemin de cailloux (« − 10 », « + 10 − 1 ») sans un mot ; le mur de corail et le petit poisson, annoncés par la voix et vus en leçon L7, n'apparaissent qu'aux corrections.
- **Pourquoi c'est un problème** : elle ne lit pas « + 10 » écrit en petit sous la bulle ; sans voix, l'aide ne lui dit pas quoi faire. La promesse « le petit poisson va t'aider » n'est pas tenue, et le lien avec la leçon L7 se perd.
- **Qualification** : **réalisation** pour le mur (`docs/SPEC-LOT3.md` §6 : « le mur est composé une fois par question dans un canvas mis en cache, comme la ligne ») ; **question** pour la voix de l'aide (la spécification ne dit pas ce que dit l'aide du chemin).
- **Piste** : aux niveaux du mur, montrer le mur et le poisson à l'aide, et faire dire le premier pas (« Plus dix : le poisson descend d'une rangée »).

### R7 · Calcul rapide : corrections sans « pourquoi »

- **Où** : `A-ecrans/A05-corrections-08.jpg` n° 29–32 (« C'était 40. », « C'était 57. », puis la question suivante) ; `A05-corrections-12.jpg` n° 47–48 (« je ne sais pas » : « C'était 90. ») ; `C-toucher/JOURNAL.md`, appui long sur « je ne sais pas » au calcul (« C'était 30. ») ; `A05-corrections-06.jpg` n° 23 et `A05-corrections-07.jpg` n° 26 (l'égalité fausse « 91 − 10 = 90 », « 55 + 9 = 65 » reste écrite pendant la correction).
- **Personne** : l'enfant.
- **Observé** : sur le chemin (niveaux 7 et 9), une erreur ou « je ne sais pas » donne seulement le bon nombre, sans « Ce n'est pas grave, regardons ensemble » ni animation. Au mur, la correction est bonne, mais la bulle affiche sa réponse fausse comme une égalité, sans marque ; aux additions, au contraire, c'est la bonne réponse qui est entourée.
- **Pourquoi c'est un problème** : elle apprend qu'elle s'est trompée, pas pourquoi ; au mur, elle voit écrit « 55 + 9 = 65 » pendant qu'on lui explique que c'est 64.
- **Qualification** : **réalisation**. `docs/SPEC.md` : « Après une erreur : retour visuel immédiat qui montre la bonne réponse et pourquoi », retours C4 et C5 prévus ; « je ne sais pas » « déclenche la même correction animée qu'une erreur » et « la voix rassure ».
- **Piste** : rejouer le pont en cause sur la ligne (les sauts jusqu'à 40) avec la phrase de C4 ou C5, et afficher la bonne réponse entourée, comme aux additions.

### R8 · Calcul rapide sur le chemin : le calcul demandé disparaît

- **Où** : `A-ecrans/A03-questions-05.jpg` n° 20 et `A03-questions-06.jpg` n° 21 (voix « 36 plus 6 ? », bulle « 36 + 4 = ? » puis « 40 + 2 = ? ») ; `A05-corrections-07.jpg` n° 28.
- **Personne** : l'enfant.
- **Observé** : la grande bulle montre l'étape en cours (36 + 4, puis 40 + 2) ; le calcul demandé (36 + 6) n'est jamais écrit, et les pas (+ 4, + 2) sont donnés par les étiquettes, à moitié cachées sous la bulle.
- **Pourquoi c'est un problème** : elle calcule deux petites additions sans voir qu'elles font 36 + 6 ; la procédure « compléter à 10 d'abord » est faite pour elle, et elle ne relie pas 42 à la question entendue.
- **Qualification** : **question** (`docs/SPEC.md` : « Le calcul est affiché en grand » ; les calculs guidés ne disent pas ce qu'affiche la bulle pendant les étapes).
- **Piste** : garder « 36 + 6 = ? » dans la bulle et poser les étapes sur les cailloux, puis écrire 42 dans la bulle à la fin.

### R9 · Additions « mélange » choisi au premier lancement : trois faits en boucle

- **Où** : `B-sequences/neuve/additions-famille-7.md`, cran « conseillé » (40 questions, 4 réponses différentes ; 1 + 1, 2 + 1, 1 + 2 en boucle, puis 3 + 1, 1 + 3, 4 + 1 en boucle ; 1 + 1, 2 + 1 et 4 + 1 posés 4 fois chacun), « plus facile » (2 réponses différentes sur 24).
- **Personne** : l'enfant, et le parent qui a choisi « mélange ».
- **Observé** : sur une base neuve, le mélange ne contient que les « + 1 » ; les questions tournent dans un cycle de trois.
- **Pourquoi c'est un problème** : 40 fois « 1 + 1, 2 + 1, 1 + 2 » : elle s'ennuie et répond par le motif ; le parent a demandé un mélange et obtient autre chose.
- **Qualification** : **réalisation** pour la répétition (`docs/SPEC-LOT2.md` §3 : « Un même fait ne revient pas plus de 3 fois dans la séance ») ; **question** pour le contenu du mélange choisi avant que les familles soient ouvertes (`docs/SPEC-LOT2.md` : « tous les faits introduits » ; `docs/SPEC-LOT3.md` §2 ne dit pas quoi faire pour le mélange).
- **Piste** : quand le mélange est choisi sur une base neuve, y introduire des faits des familles suivantes (comme pour une famille choisie), et tenir la limite de 3 passages.

### R10 · Récompenses : répondre au hasard donne les mêmes cartes

- **Où** : `B-sequences/SYNTHESE.md`, tableaux « pressée comparée à appliquée » (la « pressée » gagne 10 à 31 étoiles, dont 10 de fin de séance, pour un coquillage à 25) ; `A-ecrans/A10-parent-16.jpg` (15 coquillages ouverts pour 8 cartes en un mois) ; `A08-recompense-03.jpg` n° 10 (« Encore la moule ! Tu avais déjà cette carte. »).
- **Personne** : l'enfant (et le parent qui veut récompenser l'effort).
- **Observé** : en étoiles, répondre au hasard rapporte 10 à 70 % de ce que rapporte l'application (plus au cran « plus facile ») ; mais les cartes nouvelles sont plafonnées à 2 par semaine, et la « pressée » ouvre un coquillage presque à chaque séance. S'appliquer ne donne que des doublons de plus, sans rien en échange (« Tu avais déjà cette carte »).
- **Pourquoi c'est un problème** : elle veut des cartes ; elle constate vite qu'elle en a autant en répondant n'importe quoi, et un doublon après une belle séance est une déception.
- **Qualification** : **spécification** (`docs/SPEC-LOT2.md` §5 : quota de 2 cartes nouvelles par semaine, prix à 25 étoiles ; `docs/SPEC.md` : 10 étoiles pour une séance terminée).
- **Piste** : réserver la carte nouvelle aux séances où les bonnes réponses dépassent un seuil, ou donner au doublon une contrepartie visible (perle, décor, pas vers une brillante).

### R11 · Toucher pendant le retour, toucher double, appui long

- **Où** : `C-toucher/C1-touchers-2-3-01.jpg` n° 3–4 (un chiffre touché pendant « Oui, c'est ça ! » : « 5 + 3 = 10 » affiché dans la question suivante, consigne coupée) ; `C1-touchers-3-7-01.jpg` n° 3–4 (même chose au calcul) ; `C1-touchers-2-3-02.jpg` n° 5–6 et `C1-touchers-3-7-02.jpg` n° 5–6 (deux touchers à 60 ms : « 77 », « 44 ») ; `C3-appui-long-03.jpg` n° 11–12 (appui long sur une bulle-réponse : aucune réponse, la voix se tait) ; `C1-touchers-1-5-03.jpg` n° 11–12 (un toucher sur le sable coupe la voix).
- **Personne** : l'enfant.
- **Observé** : le pavé n'est pas bloqué pendant le « bravo » : le chiffre s'inscrit dans l'ardoise de la question suivante et la consigne n'est pas lue. Un double toucher tape deux chiffres. Un appui long sur une bulle ne répond pas et coupe la voix.
- **Pourquoi c'est un problème** : elle touche vite et parfois deux fois ; elle se retrouve avec une réponse déjà écrite qu'elle n'a pas choisie, sans consigne, ou avec « 77 » à effacer ; un appui trop long « ne marche pas », sans retour.
- **Qualification** : **réalisation** pour le chiffre reporté dans la question suivante (comportement non voulu : l'`INDEX.md` décrit pavé et bulles comme bloqués pendant un retour, et la consigne de la question suivante est perdue) ; **question** pour le double toucher et l'appui long (non traités par la spécification).
- **Piste** : ignorer le pavé jusqu'à l'affichage de la question suivante ; ignorer un second toucher de la même touche en moins de 150 ms environ ; traiter un appui long sur une bulle comme un toucher.

### R12 · Reprise après la maison : la consigne n'est pas redite

- **Où** : `C-toucher/C2-maison-1-5-04.jpg` n° 15–16 (ligne : « reprise ; la voix s'est tue ») ; `C2-maison-3-7-04.jpg` n° 15–16 et `C2-maison-3-7-01.jpg` n° 3–4 (calcul : rien n'est dit) ; à comparer à `C2-maison-2-3-04.jpg` n° 15–16 (additions : « On continue ! 3 plus 7 ? »).
- **Personne** : l'enfant.
- **Observé** : après « continuer », la ligne et le calcul reviennent sur une question silencieuse ; seules les additions redisent la consigne.
- **Pourquoi c'est un problème** : elle ne lit pas ; elle revient devant une étoile ou un chemin sans savoir ce qu'on lui demande, et doit penser au haut-parleur ou appeler le parent.
- **Qualification** : **réalisation** (`docs/SPEC.md`, « Navigation pendant la séance » : « la même question, la même consigne redite »).
- **Piste** : redire la consigne à chaque reprise, pour les trois modules et pendant une correction.

### R13 · Fin de séance : longue attente et phrase répétée

- **Où** : `D-vitesse-reelle/D-ligne-chronologie.md`, attente de 445 à 490 s (45 s sans rien à toucher, « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » six fois de suite) ; `D-calcul-chronologie.md` (29 s, la phrase trois fois) ; `D-ligne-03.jpg` n° 11–12 ; `A-ecrans/A09-recif-album-01.jpg` n° 4 (« grâce à tes étoiles arc-en-ciel »).
- **Personne** : l'enfant.
- **Observé** : quand plusieurs niveaux sont franchis dans la séance (voie rapide), chaque étoile arc-en-ciel a sa phrase ; l'enfant attend 30 à 45 s avec seulement « réécouter ». Ces étoiles ne sont montrées nulle part.
- **Pourquoi c'est un problème** : c'est le moment qu'elle attend (la carte) ; six fois la même phrase sur une chose qu'elle ne voit pas, c'est là qu'une enfant de 7 ans décroche ou tapote partout.
- **Qualification** : **question** (la cérémonie de l'étoile arc-en-ciel n'est décrite qu'à l'ouverture d'une zone, `docs/SPEC-LOT2.md` §5 ; les critères d'attente de `docs/SPEC-LOT2.md` §8 excluent la voix).
- **Piste** : une seule phrase au pluriel (« Trois étoiles arc-en-ciel ! ») avec les étoiles dessinées qui volent vers l'album, et le coquillage à toucher tout de suite.

### R14 · Fin du défi record : rien n'est dit ni montré

- **Où** : `A-ecrans/A07-defi-02.jpg` n° 6 (« fin du défi, score et record » : voix « (silence) », une question « 1 + 1 = ? » et le pavé affichés).
- **Personne** : l'enfant.
- **Observé** : quand la bulle est vide, l'écran garde une question et le pavé ; aucune phrase ne dit le score ni si le drapeau est dépassé.
- **Pourquoi c'est un problème** : elle ne sait pas que le défi est fini, continue à taper, et ne sait pas si elle a battu son record, qui est tout l'intérêt du défi.
- **Qualification** : **question** (`docs/SPEC.md` et `docs/SPEC-LOT2.md` §3 décrivent le défi, pas sa fin).
- **Piste** : ranger le pavé, faire avancer les perles jusqu'au drapeau et dire « Nouveau record ! » ou « Presque ! Tu as fait 9 perles ».

### R15 · Écran « choisir » : ni l'enfant ni le parent ne savent ce que montre une tuile

- **Où** : `A-ecrans/A02-choisir-01.jpg` n° 2–4, `A02-choisir-02.jpg` n° 7–8, `A02-choisir-03.jpg` n° 9.
- **Personne** : le parent surtout, l'enfant aussi.
- **Observé** : 13 tuiles de ligne graduée à dessins minuscules (« 30 ? 40 », « 0 ? 1000 ») ; 7 familles d'additions en vignettes (poissons, maison 7, maison 9) ; 9 calculs écrits (« 34+5 », « 38+5 », « 34+9 », très proches). La lueur du conseillé est à peine visible, les petites étoiles des niveaux validés débordent sur les tuiles voisines. Avec la validation simple, le premier toucher dit le nom **et** lance le niveau : pas moyen d'écouter avant de choisir.
- **Pourquoi c'est un problème** : à « qu'est-ce que je choisis ? », le parent ne peut pas répondre en dix secondes sans ouvrir l'espace parent ; à « ça veut dire quoi, 38 + 5 ? », il n'a rien. Un essai pour écouter lance une séance.
- **Qualification** : **spécification** (validation simple décidée le 28 septembre, `docs/SPEC-LOT3.md` §8) ; **réalisation** pour la lueur du conseillé, trop faible pour être vue (`docs/SPEC-LOT3.md` §2 : « entouré d'une lueur »).
- **Piste** : un toucher dit le nom et agrandit la tuile, la coche valide ; une lueur plus franche sur le conseillé ; un guide d'une page pour le parent (« 38 + 5 : passer la dizaine »).

### R16 · Ligne graduée « placer » : le nombre cible ressemble à une bulle-réponse

- **Où** : `A-ecrans/A03-questions-02.jpg` n° 7, `A03-questions-03.jpg` n° 9–11 et 13, `A05-corrections-02.jpg` n° 6.
- **Personne** : l'enfant.
- **Observé** : le nombre à placer est dans un rond blanc identique aux bulles-réponses de « lire », avec un poisson à côté ; il n'est pas touchable, il faut toucher la corde.
- **Pourquoi c'est un problème** : elle touche le rond (rien ne se passe) ou essaie de traîner le poisson ; elle ne comprend pas quoi faire et appelle le parent.
- **Qualification** : **question** (`docs/SPEC.md` : « en touchant ou en glissant », sans dessin prévu pour le nombre à placer).
- **Piste** : écrire le nombre sur le poisson lui-même (une étiquette), et faire trembler la corde au début de la question.

### R17 · Leçon L3 relancée sur une ligne qui commence à 0

- **Où** : `C-toucher/JOURNAL.md`, « passer partout », ligne graduée niveau 1 (après deux erreurs : « Oh ! Cette corde ne commence pas à zéro. ») ; `C-toucher/C5-passer-03.jpg` n° 9–10 ; `B-sequences/SYNTHESE.md`, niveau 1, profil « pressée » (« L1×1 L3×1 »).
- **Personne** : l'enfant.
- **Observé** : au niveau 1 (corde de 0 à 10), deux erreurs de « sauter » classées E3 relancent la leçon L3 sur une corde de 30 à 40.
- **Pourquoi c'est un problème** : elle travaille une corde qui commence à 0 et on lui explique que la corde « ne commence pas à zéro » ; elle ne fait pas le lien.
- **Qualification** : **spécification** (`docs/SPEC.md` : « Dès que la même erreur apparaît deux fois dans une séance, la leçon animée correspondante est relancée ») ; le cas d'E3 en format « sauter » depuis un départ non nul n'est pas prévu.
- **Piste** : pour E3 en « sauter », rejouer la correction « La tortue part de 2, pas de zéro » plutôt que L3.

### R18 · Leçons L2, L8 et L9 : l'image ne suit pas ce que dit la voix

- **Où** : `A-ecrans/A06-lecon-L2-01.jpg` n° 1 et `A06-lecon-L2-02.jpg` n° 5–8 ; `A06-lecon-L8-01.jpg` ; `A06-lecon-L9-01.jpg` n° 3–4.
- **Personne** : l'enfant.
- **Observé** : L2 annonce des « bouées géantes », identiques aux bouées de L1 ; aux captures, le saut suit la voix avec une phrase de retard (« vingt » dit, un seul saut fait ; à vérifier en vidéo) ; les filets de dix poissons sont minuscules. L8 dure 9 s pour « + 10 puis − 1 ». L9 superpose le cadre de 10 et la ligne, les arcs « + 1 » passent sur les poissons, « 5 = 2 + 3 » est traversé par un poisson, « 44 » est coupé par « rejouer ».
- **Pourquoi c'est un problème** : ces trois leçons préparent les procédures les plus difficiles (pas de 10, + 9, passer la dizaine) ; si l'image ne montre pas ce qui est dit, elle retient la phrase sans l'idée.
- **Qualification** : **réalisation** pour L2 (bouées géantes, synchronisation) et L9 (lisibilité ; la craft bar du projet) ; **question** pour la durée de L8 (textes de `docs/SPEC.md`, plus courts que les « 45 à 90 secondes » annoncées).
- **Piste** : L2 avec de vraies bouées plus grosses et des filets lisibles, saut au moment du nombre ; L9 en deux tableaux successifs ; L8 avec un deuxième exemple.

### R19 · Espace parent : des mots de concepteur

- **Où** : `A-ecrans/A10-parent-12.jpg` n° 24 (boîtes 1 à 5, « famille 1 acquise » avec 20 faits sur 30 bien sus), `A10-parent-14.jpg` n° 28 (« dans l'ordre de la SPEC »), `A10-parent-15.jpg` n° 30 et `A10-parent-16.jpg` n° 31 (journal : « E1 à E5 », « C1 à C5 » ; « autre erreur » 6 à 11 fois par semaine, en tête) ; `A10-parent-18.jpg` n° 35 (« imposer l'une des deux » pour trois exercices).
- **Personne** : le parent.
- **Observé** : sigles et vocabulaire internes ; la plupart des erreurs d'additions et de calcul tombent dans « autre erreur » ; « acquise » avec 67 % des faits bien sus, alors que la règle affichée dit 80 %.
- **Pourquoi c'est un problème** : le parent n'est pas technicien ; il ne peut pas en tirer « ce qu'elle doit revoir ».
- **Qualification** : **réalisation** pour « SPEC » et « l'une des deux » (`CLAUDE.md` du projet : instructions en français simple) ; **spécification** pour « autre erreur » (aucun type d'erreur n'est prévu pour les additions) ; **question** pour « acquise » (acquisition définitive, `docs/SPEC-LOT2.md` §3, sans que l'écran l'explique).
- **Piste** : des phrases (« se trompe d'une unité », « compte au lieu de savoir »), et « acquise le 17/09 (depuis, 20 sur 30) ».

## 4. Constats cosmétiques

### R20 · Éléments coupés ou superposés

- **Où et quoi** (enfant) : « 700 » déborde de sa bulle (`A03-questions-04.jpg` n° 13) ; « 1000 » touche le bord droit (`A03-questions-03.jpg` n° 12) ; les étiquettes « + 4 », « − 10 » du chemin sont à moitié sous la bulle (`A04-aides-05.jpg`, `D-calcul-02.jpg` n° 8) ; le « 8 » de 408 et le « 7 » de 307 sont posés sur un rocher (`A05-corrections-05.jpg` n° 20, `A06-lecon-L10-04.jpg`) ; le poisson du mur cache le nombre sur lequel il est (« Le poisson est sur trente-quatre », `A06-lecon-L7-01.jpg` n° 2, `A06-lecon-L7-02.jpg` n° 6) ; « 100 » écrit deux fois en L10 (`A06-lecon-L10-03.jpg` n° 12) ; les égalités de L4, L5, L9 traversées par des poissons et des bulles ; les étiquettes « 71 72 » sur la tortue (`A05-corrections-03.jpg` n° 12) ; le bernard-l'ermite coupé en bas de l'écran (`A04-aides-01.jpg`) ; les boutons récif et album posés sur un rocher (`A01-accueil-01.jpg`) ; les tuiles de « choisir » sur les bras de la pieuvre et les algues (`A02-choisir-01.jpg` n° 2).
- **Qualification** : **réalisation** (craft bar du projet, `CLAUDE.md`).

### R21 · Textes

- « 0 sout » au lieu de « 0 saut » dans la police de la leçon L1 (`A06-lecon-L1-01.jpg` n° 4) ; « 1 poissons » et « 2 poissons » lus pour un seul (`C-toucher/JOURNAL.md`, « passer partout », additions ; `B-sequences/neuve/additions-famille-3.md`) ; « tu as gagné 0 étoiles » (artefact de la capture, mais possible si la séance n'a que des erreurs).
- **Qualification** : **réalisation**.

### R22 · « Réécouter » muet à l'accueil, absent pendant la pause

- **Où** : `C-toucher/JOURNAL.md` (appui long sur « réécouter » à l'accueil : rien n'est dit) ; `A-ecrans/A01-accueil-02.jpg` n° 7 (accueil en pause : pas de haut-parleur).
- **Qualification** : **réalisation** (`docs/SPEC.md` : « réécouter à tout moment » ; `CLAUDE.md` : « bouton réécouter toujours visible »).

### R23 · Deux choses qui se ressemblent

- Le « ? » rouge de la question et le « ? » du bouton « je ne sais pas » (`A01-accueil-02.jpg` n° 6) ; le coquillage d'aide et le coquillage de la récompense (`A03-questions-04.jpg` n° 16, `A08-recompense-01.jpg` n° 2) ; les onglets de zone de l'album, dessinés comme des cartes (`A09-recif-album-01.jpg` n° 2) ; la demi-étoile du cran « plus facile », qui se lit comme une étoile vide (`A01-accueil-01.jpg` n° 4) ; « rejouer la leçon » à la place du bouton « je ne sais pas » (`A06-lecon-L1-01.jpg`).
- **Qualification** : **question** (non décrit), sauf les étoiles du sélecteur (**spécification**, `docs/SPEC-LOT2.md` §2).

### R24 · Le compteur d'étoiles baisse sous ses yeux

- **Où** : `A08-recompense-01.jpg` n° 1–2 (34 puis 15), `D-ligne-03.jpg` n° 11–12 (57 puis 43).
- **Observé** : l'échange étoiles contre coquillage fait baisser le compteur sans explication.
- **Qualification** : **spécification** (échange voulu) ; la règle « on ne perd jamais rien » peut sembler démentie aux yeux de l'enfant. Piste : faire voler les étoiles du compteur vers le coquillage.

### R25 · Accès à l'espace parent

- **Où** : `C-toucher/C3-appui-long-09.jpg` (appui long de 1,5 s sur le logo : rien) ; `A10-parent-01.jpg` n° 1 (l'anneau de progression n'est qu'au quart à 0,8 s).
- **Observé** : la durée de l'appui n'est indiquée nulle part.
- **Qualification** : **question** (`docs/SPEC.md` : « appui long », sans durée). Piste : le dire dans le guide du parent.

## 5. Ce qui fonctionne bien (à ne pas casser)

- **Premier lancement** : choix du nom de la pieuvre entièrement à l'oreille et au toucher, coche de confirmation, « Youpi ! Maintenant, je m'appelle Pili » (`A01-accueil-01.jpg` n° 2).
- **Accueil** : quatre bulles claires (jouer, choisir, récif, album), lune « à demain » et « Encore ! » après la séance ; « choisir » en 3 touchers (`A01`, `A02`).
- **Corrections de la ligne graduée** : chaque piège a son retour ciblé et animé (« On compte les sauts, pas les traits », « Ici, chaque saut vaut dix », « La ligne commence à 90, pas à zéro », « Les nombres grandissent vers la droite », « 1 dizaine et 4 unités », 408 en centaines et unités) ; les propositions sont bien construites (6 / 68 / 86 / 87 ; 4 / 49 / 94 / 95) (`A05-corrections-01` à `05`).
- **Corrections au mur de corail** (C1 « on monte d'une rangée », C3 « plus 10, moins 1 ») et raccourci sans reproche pour la réponse juste mais lente (C2) (`A05-corrections-06`, `07`, `09`).
- **Leçons** L1, L3 (la loupe sur 30), L5 (les places vides), L6 (la maison qui se remplit), L7 (le mur qui se construit) et L10 (filets, chaluts, zéro au milieu de 307) : claires, courtes, « rejouer » et « passer » toujours là (`A06`).
- **Robustesse** : aucune erreur de page dans les parties C et D ; pas d'impasse ; la maison met en pause à tout moment, même pendant une animation, et « continuer » reprend la même question ; un double toucher sur « valider » n'enregistre qu'une réponse ; répondre pendant la consigne est accepté ; un toucher à côté ne fait rien de fâcheux (`C-toucher/JOURNAL.md`).
- **Adaptation** : la voie rapide fait franchir plusieurs niveaux dans la première séance (corde 0–10, puis 0–20, 80–90, 0–100), avec la leçon d'entrée de chaque niveau (`D-ligne-chronologie.md`) ; la durée d'une séance réelle tient autour de 8 min 20 s à 8 min 50 s.
- **Étoiles par cran** : aux crans conseillé à très dur, répondre au hasard rapporte 10 à 50 % de ce que rapporte l'application (`B-sequences/SYNTHESE.md`).
- **Récompense, récif, album** : coquillage à toucher, carte qui sort, se retourne, anecdote lue une fois, brillante annoncée, créatures animées dans le récif, perles de progression de l'album (`A08`, `A09`).
- **Espace parent** : calendrier coloré, historique des séances détaillable, grille des additions, record du défi, cartes et zones, réglages lisibles (`A10`).
