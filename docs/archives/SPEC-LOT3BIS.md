# Lot 3 bis : correctif issu de la recette fonctionnelle

Rédigé en conception le 28 septembre 2026, à partir du rapport de la recette fonctionnelle (`docs/archives/RECETTE-LOT3.md`, constats R1 à R25), des essais du parent et de ses décisions du même jour (`docs/JOURNAL-CONCEPTION.md`, « Décisions prises »). Cette spécification **prévaut** sur `docs/SPEC.md`, `docs/archives/SPEC-LOT2.md`, `docs/archives/SPEC-LOT3.md` et `docs/archives/SPEC-COMPLEMENTS.md` en cas de contradiction.

Chaque point renvoie au constat du rapport (R…). Le rapport donne les planches et les séquences qui le montrent. Les points marqués **(décision du parent)** ne se rediscutent pas. Les autres ont une valeur par défaut que Claude Code peut ajuster s'ils rendent un exercice infaisable, en le notant dans `docs/AVANCEMENT.md` avec la raison.

## 0. Le principe qui manquait : une réponse qui varie

La recette a montré qu'un exercice peut être conforme et ne rien faire travailler, parce que **la réponse attendue ne varie pas** : toujours 10, toujours le même pas, 4 cibles en boucle. L'enfant le repère en deux questions, répond sans calculer, gagne ses étoiles et valide le niveau.

**Règle générale, pour tous les exercices, niveaux et crans** (réglages dans le contenu, valeurs par défaut) :

- dans la notion du jour, la réponse attendue prend **au moins 5 valeurs différentes** sur une séance, ou toutes les valeurs possibles du niveau s'il y en a moins (et alors le niveau doit être revu) ;
- **jamais plus de 2 fois de suite la même réponse** ;
- **pas de suite prévisible de plus de 3 questions** (réponses qui avancent d'un même pas, cibles dans le même ordre qu'au tour précédent) ;
- un même fait ou une même question ne revient **pas plus de 3 fois** dans la séance (règle existante de `docs/archives/SPEC-LOT2.md` §3, étendue aux trois modules).

**Test automatique** : l'outil de séquences de la recette (`tests/recette-fonctionnelle/b-sequences.mjs`) devient un test de la recette de chaque lot. Il vérifie ces quatre règles sur les 116 combinaisons exercice × niveau (ou famille) × cran, en base neuve et en base « un mois », pour les comportements « appliquée » et « réelle ».

---

## Partie A · Ce qui empêche d'apprendre (moteur et contenu)

### A1. Amis de 10 et maisons des nombres (R1)

Les familles définies par leur résultat (3 : amis de 10 ; 4 : maisons de 5 à 7 ; 5 : maisons de 8 et 9) ne passent plus par la forme directe d'abord. Ce point **remplace**, pour ces trois familles, la règle « formes à trou ouvertes quand la forme directe est acquise » (`docs/SPEC.md`, module 2) et le tableau des crans des additions (`docs/archives/SPEC-LOT3.md` §3).

| Famille | Plus facile | Conseillé | Plus dur | Très dur |
| --- | --- | --- | --- | --- |
| 3 · amis de 10 | toutes à trou, cadre de 10 affiché d'emblée | toutes à trou | toutes à trou | toutes à trou, révisions de toutes les familles |
| 5 · maisons de 8 et 9 | 2 sur 3 à trou, appui (maison et cadre de 10) affiché d'emblée | 2 sur 3 à trou | toutes à trou | toutes à trou, révisions de toutes les familles |
| 4 · maisons de 5 à 7 | moitié à trou, appui affiché d'emblée | moitié à trou | 2 sur 3 à trou | toutes à trou, révisions de toutes les familles |

Les deux formes à trou (`3 + ? = 10`, `? + 7 = 10`) alternent. Au cran « plus facile » de la famille 3, le cadre montre les poissons du premier nombre et les places vides : l'enfant compte les places vides (c'est la leçon L5).

**Faits nouveaux** : tirés au hasard parmi les faits de la famille, et non plus dans l'ordre du catalogue (1 + 9, 2 + 8…). Les deux ordres des termes (7 + 3, 3 + 7) apparaissent dans la séance.

**Acquisition d'une famille** (toutes les familles, pas seulement 3 à 5). Une famille est acquise quand les trois conditions sont remplies :
- au moins 80 % de ses faits sont en boîte 3 ou plus (règle existante) ;
- pour les familles 3 à 5, chacun de ces faits a été réussi **au moins une fois à la forme à trou** ;
- ces réussites sont réparties sur **au moins 2 séances**, à deux jours différents.

La voie rapide reste possible pour un fait, mais elle ne peut plus faire acquérir une famille en une seule séance.

### A2. Calcul rapide, cran « très dur » (R2)

Aux niveaux dont le pas est fixe (1 : ± 1, ± 2 ; 2 : ± 10 ; 3 : ± 20, ± 30… ; 6 : + 9), la forme à trou sur le pas (« 79 + ? = 89 ») est **supprimée**. Le cran « très dur » alterne, à parts égales :
- la forme directe sans chemin ;
- **le trou sur le nombre de départ** (« ? + 10 = 57 », « ? − 2 = 45 »), dont la réponse varie.

Aux niveaux 4, 5, 7, 8 et 9, la forme à trou sur le second nombre reste possible (sa réponse varie), sous la règle générale du §0.

### A3. Ligne graduée (R3, R4, R17)

**Cran « plus facile » des niveaux 2, 5 et 9** : un repère écrit de plus, pas quatre. Au moins 6 cibles doivent rester possibles.

| Niveau | Plus facile (nouveau) |
| --- | --- |
| 2 · 0 à 10 | 0, 5, 10, et aussi 2 et 8 |
| 5 · 0 à 100 de 10 en 10 | 0, 50, 100, et aussi 20 et 80 |
| 9 · 0 à 1 000 de 100 en 100 | 0, 500, 1 000, et aussi 200 et 800 |

Vérifier les autres cases du tableau de `docs/archives/SPEC-LOT3.md` §3 avec la règle du §0, et les corriger de la même manière si besoin.

**Tirage des cibles** (défaut de réalisation, R3) : les cibles sont tirées au hasard **sans remise** parmi les cibles possibles. Quand elles sont épuisées, on recommence dans un nouvel ordre, sans que la première du nouveau tour soit la dernière du précédent. Les propositions pièges sont reconstruites à chaque question. Le principe est celui de `docs/SPEC.md`, module 1 : elle ne doit pas pouvoir apprendre les réponses par cœur.

**Niveau 1** (R4) :
- en « lire », la cible **et ses deux voisins** sont cachés (0 1 ? ? ? 5 6…) : il faut compter les graduations ;
- en « sauter », les nombres du trajet de la tortue sont cachés, pour que l'arrivée ne soit pas le seul trou de la suite.

**Leçon L3** (R17) : une erreur E3 au format « sauter » (oublier le point de départ) ne relance plus la leçon L3, qui parle d'une corde qui ne commence pas à zéro. Elle rejoue la correction de E3 (« La tortue part de 2, pas de zéro. On compte les sauts à partir d'elle. »). L3 n'est relancée que pour E3 au format « lire » sur une corde qui ne commence pas à 0.

### A4. Additions, « mélange » choisi (R9)

- **Base neuve** : quand le mélange est choisi et que moins de 3 familles ont des faits introduits, le mélange introduit des faits des familles 1 à 3, avec la même limite de faits nouveaux par séance que pour une famille choisie.
- **Défaut de réalisation** : la limite de 3 passages d'un même fait par séance doit être respectée (voir le §0).

### A5. Toucher et reprise (R11, R12)

- **Pendant un retour** (« bravo », correction), le pavé et les bulles-réponses sont ignorés jusqu'à l'affichage de la question suivante. Un chiffre tapé pendant le « bravo » ne doit plus apparaître dans la question suivante ni couper sa consigne.
- **Double toucher** : un second toucher sur la même touche du pavé en moins de 150 ms est ignoré (réglage).
- **Appui long sur une bulle-réponse ou une touche du pavé** : il compte comme un toucher (voir B3 pour les pictogrammes, qui se comportent autrement).
- **Reprise** : après une pause, la consigne de la question est **redite** dans les trois modules, y compris si la pause a eu lieu pendant une correction (`docs/SPEC.md`, « Navigation pendant la séance »).

### A6. Récompenses : le doublon a une contrepartie (R10, décision du parent)

Aujourd'hui, répondre au hasard donne autant de cartes nouvelles que s'appliquer, parce que le quota de 2 cartes par semaine plafonne. S'appliquer ne rapporte que des doublons, vécus comme une déception (« Tu avais déjà cette carte »).

**Décision du parent** : ne pas conditionner les cartes à un seuil de bonnes réponses (cela contredirait « on ne perd jamais rien »), mais donner au doublon **une contrepartie visible**.

**Réalisation (valeur par défaut)** : chaque doublon apporte **un décor pour le récif**.
- Une collection de 15 décors, dessinés à l'atelier (voir B8) : corail branchu, anémone, gorgone, coquillage géant, étoile de mer, oursin, herbier, amphore, ancre, coffre, etc.
- Les décors sont donnés dans un ordre fixe et posés à des emplacements prévus du récif, répartis sur les zones ouvertes.
- La voix dit : « Tu avais déjà cette carte : elle t'offre un corail pour ton récif ! » (avec le nom du décor et son article, phrases à fabriquer).
- Une fois la collection complète, le doublon reprend son comportement actuel.
- **La probabilité de brillante d'un doublon reste 5 %.** La règle « le 3e doublon rend la carte brillante », supprimée par le parent le 27 septembre, n'est pas rétablie.
- L'espace parent, rubrique « cartes », indique le nombre de décors.

---

## Partie B · Ce qui la perd, l'écran « choisir » et le parent (visuel et atelier)

### B1. Écrans de niveaux de « choisir » (R15, décisions du parent)

- **La validation simple est conservée** (décision du parent) : un toucher dit le nom du niveau et le lance.
- **Calcul rapide** : les 9 plaques portent un **grand numéro de 1 à 9**. Elles sont posées dans l'ordre sur un **chemin de cailloux**, avec l'exemple de calcul en petit sous le numéro, comme repère.
- **Ligne graduée et additions**, par cohérence : chaque tuile porte aussi son **numéro en grand** (1 à 13, 1 à 7), avec la vignette actuelle en petit. Le parent peut dire « fais le 7 » quel que soit l'exercice.
- La lueur du niveau conseillé est **nettement visible** : halo épais et animé doucement. L'étoile d'un niveau validé reste **à l'intérieur** de sa tuile.
- Aucune tuile n'est coupée par un bord de l'écran, comme l'était la plaque 38 − 5, ni posée sur les bras de la pieuvre ou sur les algues. La disposition est vérifiée aux trois formats du test des bords.

### B2. Légende des niveaux (décision du parent)

- Sur chaque écran de niveaux (ligne graduée, additions, calcul rapide) et sur l'écran des leçons, un **bouton discret**, dans un coin et hors de la zone des tuiles, montre un petit livre ouvert.
- Le bouton ouvre un **panneau** par-dessus l'écran, fermé par une **croix** bien visible, ou par un toucher en dehors du panneau.
- Le panneau contient un tableau, une ligne par niveau : le numéro et la vignette, **ce qui est travaillé** en une phrase simple, et un exemple. Il défile si nécessaire.
- Ouvrir ou fermer la légende ne choisit rien et ne lance rien. La voix ne la lit pas : la légende est pour le parent.
- **Texte rangé une seule fois**, dans `app/content/` (un fichier `legendes.json`, ou un bloc par module). Le guide du parent et l'espace parent reprennent ce même texte.

Contenu du calcul rapide (les autres, rédigés sur le même modèle à partir de `docs/SPEC.md`, modules 1 et 2, en français simple et sans sigle) :

| Niveau | Ce qui est travaillé | Exemple |
| --- | --- | --- |
| 1 | Ajouter ou retirer 1 ou 2 | 47 + 2 |
| 2 | Ajouter ou retirer 10 : on descend ou on monte d'une rangée sur le mur | 34 + 10 |
| 3 | Ajouter ou retirer des dizaines rondes (20, 30…) | 23 + 30 |
| 4 | Ajouter un petit nombre sans changer de dizaine | 34 + 5 |
| 5 | Retirer un petit nombre sans changer de dizaine | 38 − 5 |
| 6 | Ajouter 9 : on ajoute 10, puis on retire 1 | 34 + 9 |
| 7 | Ajouter en passant la dizaine : on complète d'abord jusqu'à 10 | 38 + 5 = 38 + 2 + 3 |
| 8 | Ajouter deux nombres à deux chiffres, sans retenue | 23 + 14 = 23 + 10 + 4 |
| 9 | Retirer en passant la dizaine | 42 − 5 = 42 − 2 − 3 |

### B3. Appui long sur les pictogrammes (décision du parent)

- Concerne les bulles de l'accueil (jouer, choisir, récif, album), les pictogrammes des exercices et le bouton « leçons » de l'écran « choisir ».
- Garder le doigt, ou le clic, enfoncé **environ 0,5 s** (réglage) fait apparaître une **étiquette** au-dessus du pictogramme. Elle reste affichée tant que le doigt est posé, puis 2 s après.
- **Relâcher après un appui long ne valide pas.** Seul un toucher bref valide.
- La voix ne lit pas l'étiquette (le toucher bref dit déjà le nom).
- L'appui long sur le logo, qui ouvre l'espace parent, est inchangé. Il porte sur un autre élément, et sa durée est indiquée dans le guide du parent (R25).

Textes par défaut, dans `textes.json` ou `legendes.json` :
- **Jouer** : « La séance du jour, préparée par l'application. »
- **Choisir** : « Choisir soi-même l'exercice et le niveau. »
- **Récif** : « Le récif : les créatures des cartes gagnées. »
- **Album** : « L'album des cartes. »
- **Ligne graduée** : « Lire, placer et sauter sur une ligne de nombres. »
- **Additions** : « Les additions à savoir par cœur, famille par famille. »
- **Calcul rapide** : « Des astuces pour calculer sans compter un par un. »
- **Leçons** : « Revoir une leçon animée. »

### B4. Calcul rapide : aides, corrections, affichage (R6, R7, R8)

- **Aide du coquillage** aux niveaux du mur (2, 3, 6) : le **mur de corail et le petit poisson** apparaissent. Le poisson fait le premier pas, et la voix le dit (« Plus dix : le poisson descend d'une rangée »). Sur le chemin (niveaux 7 à 9), la voix dit le premier pont (« D'abord, on va jusqu'à 40 »).
- **La consigne « Le petit poisson va t'aider » n'est dite que si le poisson est à l'écran.**
- **Corrections sur le chemin** (niveaux 7 et 9), y compris après « je ne sais pas » :
  - la voix rassure : « Ce n'est pas grave, regardons ensemble » ;
  - le pont en cause est rejoué sur la ligne ;
  - la phrase de C4 ou de C5 est dite.
  
  « C'était 40. » seul ne suffit plus.
- **Au mur**, pendant une correction : la réponse fausse n'est pas laissée écrite comme une égalité (« 55 + 9 = 65 »). La bonne réponse est affichée **entourée**, comme aux additions.
- **Calculs guidés et chemin** : la grande bulle garde **le calcul demandé** (« 36 + 6 = ? ») pendant les étapes. Les étapes s'inscrivent sur les cailloux du chemin, et le résultat est écrit dans la bulle à la fin. Les étiquettes des ponts (« + 4 ») ne passent pas sous la bulle.

### B5. Additions : les aides (R5)

- **Famille 1 (plus un et plus deux)** : l'aide ne donne plus la réponse. À la forme à trou, elle dit « Compte les sauts avec la tortue jusqu'à 10 » (jusqu'au total demandé), et la tortue avance saut par saut, au rythme de la voix, sans que le nombre de sauts soit annoncé ; à la forme directe, la tortue fait les sauts et l'enfant lit où elle arrive.
- **Maisons (familles 4 et 5)** : les pièces contiennent les **poissons** des deux nombres, qui se regroupent sous le toit. La famille 5 reçoit en plus le **cadre de 10**, prévu par `docs/SPEC.md`.
- Les aides restent lues par la voix.

### B6. Fins de séquence (R13, R14)

- **Étoiles arc-en-ciel à la récompense** : une seule phrase, au pluriel s'il y en a plusieurs (« Trois étoiles arc-en-ciel ! Un jour, elles t'ouvriront un nouveau coin du récif. »). Les étoiles sont **dessinées** et volent vers l'album. Le coquillage est ensuite à toucher tout de suite. Aucune attente de plus de 2 s sans rien à toucher.
- **Fin du défi record** :
  - le pavé est rangé ;
  - les perles avancent jusqu'au score, et le drapeau du record est visible ;
  - la voix dit le résultat : « Nouveau record ! 12 perles ! », « Record égalé ! » ou « Presque ! Tu as fait 9 perles. » ;
  - puis la séance continue.

### B7. Ligne graduée, format « placer » (R16)

Le nombre à placer est écrit **sur le poisson lui-même** (une étiquette qu'il porte), et non plus dans un rond identique aux bulles-réponses. Au début de la question, la corde ondule brièvement pour montrer où toucher. Toucher ou glisser le poisson doit aussi fonctionner, comme toucher la corde.

### B8. Atelier graphique

Tout est dessiné dans l'atelier, en style A, craft bar du projet, et regardé à l'agrandissement :
- les plaques numérotées et le chemin de cailloux (B1) ;
- les numéros des tuiles (B1) ;
- le bouton de légende, le panneau et la croix (B2) ;
- l'étiquette de l'appui long (B3) ;
- les 15 décors du récif et leurs emplacements (A6) ;
- les poissons des maisons (B5) ;
- le poisson porteur d'étiquette (B7) ;
- les étoiles arc-en-ciel volantes et la fin du défi (B6) ;
- les bouées géantes et les filets de L2 (B9).

### B9. Leçons L2, L8 et L9 (R18, décision du parent : dans ce lot)

- **L2** : de vraies **bouées géantes**, nettement plus grosses que celles de L1. Chaque saut part **au moment où le nombre est dit** : à vérifier sur une capture vidéo ou par la chronologie de la voix. Les filets de dix poissons sont lisibles à l'écran de la tablette.
- **L8** (+ 9) : un **deuxième exemple** après le premier (34 + 9, puis 56 + 9). La durée cible est de 30 à 45 s.
- **L9** (passer la dizaine) : **deux tableaux successifs**. D'abord le cadre de 10 qui se complète (8 + 2), puis la ligne avec les deux ponts (38 → 40 → 43). Rien ne se superpose : arcs, poissons, égalités et bouton « rejouer ».

### B10. Espace parent (R19)

- Aucun sigle ni mot de conception à l'écran (« E1 », « C3 », « SPEC », « l'une des deux ») : des phrases en français simple.
  - E1 : « compte les traits au lieu des sauts »
  - C1 : « + 10 change aussi les unités »
  - et ainsi de suite, dans le contenu.
- **Erreurs d'additions** : la catégorie « autre erreur », aujourd'hui en tête, est détaillée en quatre cas, décidés dans le moteur :
  - « se trompe de 1 » (réponse à ± 1) ;
  - « a répondu l'un des deux nombres » ;
  - « a fait une soustraction au lieu d'une addition » (à trou : a donné le total) ;
  - « autre ».
- « Acquise » s'accompagne de sa date et de l'état actuel : « acquise le 17/09 (depuis, 20 sur 30) ».
- « Imposer l'une des deux » est reformulé selon ce qui est proposé réellement : trois exercices.

### B11. Cosmétique (R20 à R24)

- **Débordements** (R20, liste du rapport) : « 700 » hors de sa bulle, « 1000 » au bord, étiquettes sous la bulle, chiffres posés sur un rocher, poisson du mur qui cache son nombre (il se place à côté ou devient translucide), « 100 » écrit deux fois en L10, égalités traversées par des poissons, bernard-l'ermite coupé, boutons récif et album sur un rocher.
- **Textes** (R21) : « 0 saut » (police de L1) ; accord de « poisson » (« 1 poisson ») ; pas de « tu as gagné 0 étoiles » (dire « Tu as bien travaillé ! » sans nombre).
- **Réécouter** (R22) : le bouton est présent en pause et répond à l'accueil.
- **Ressemblances** (R23) :
  - le « ? » du bouton « je ne sais pas » est remplacé par un pictogramme distinct du « ? » de la question (une pieuvre qui hausse les bras, par exemple) ;
  - le coquillage d'aide et celui de la récompense sont différenciés (couleur ou forme) ;
  - les onglets de zone de l'album ne ressemblent plus à des cartes ;
  - « rejouer la leçon » n'occupe pas la place de « je ne sais pas ».
  
  Les étoiles du sélecteur (demi-étoile du cran « plus facile ») sont inchangées : c'est un choix de `docs/archives/SPEC-LOT2.md`.
- **Compteur d'étoiles** (R24) : à l'échange contre un coquillage, les étoiles **volent** du compteur vers le coquillage au lieu de disparaître d'un coup.

### B12. Guide du parent

À mettre à jour :
- les légendes des niveaux (reprises du contenu) ;
- l'appui long sur les pictogrammes ;
- **la durée de l'appui long sur le logo** pour l'espace parent (R25) ;
- les décors du récif ;
- ce qui change aux amis de 10 et au calcul rapide « très dur ».

---

## Recette du lot 3 bis

Mêmes outils que les lots précédents (`docs/archives/SPEC-LOT2.md` §8, `docs/archives/SPEC-LOT3.md` §7), plus ces critères.

| Critère | Mesure |
| --- | --- |
| Réponse qui varie (§0) | `b-sequences.mjs` en mode test : les 4 règles vérifiées sur les 116 combinaisons, bases neuve et « un mois », comportements « appliquée » et « réelle » ; aucune exception |
| Amis de 10 et maisons (A1) | famille 3 : 100 % de questions à trou à tous les crans ; aucune famille acquise en une seule séance (simulation d'un mois, tous profils) |
| Calcul rapide « très dur » (A2) | niveaux 1, 2, 3, 6 : au moins 5 réponses différentes par séance ; le profil « pressée » gagne au plus 50 % des étoiles de « appliquée » à ce cran |
| Ligne (A3) | niveaux 2, 5, 9 « plus facile » : au moins 6 cibles, jamais le même ordre sur deux tours ; niveau 1 : cible et voisins cachés ; E3 en « sauter » ne relance jamais L3 |
| Toucher (A5) | parcours Playwright : chiffre tapé pendant le « bravo » ignoré ; double toucher à 60 ms donne un seul chiffre ; consigne redite après la reprise dans les trois modules |
| Décors (A6) | la simulation d'un mois montre des décors gagnés au profil « appliquée » ; probabilité de brillante inchangée (tirage de contrôle) |
| Choisir, légende, appui long (B1 à B3) | captures des trois écrans de niveaux (numéros lisibles, lueur visible, rien de coupé aux trois formats) ; parcours Playwright : légende ouverte et fermée par la croix sans rien lancer ; appui long de 0,8 s sur chaque pictogramme : étiquette visible, rien de lancé ; toucher bref : lancé |
| Aides et corrections (B4, B5) | une capture de chaque aide et de chaque correction du calcul rapide et des additions, regardée ; plus de « C'était N. » seul |
| Fins (B6) | `recette-durees.mjs --passer` : aucune attente de plus de 2 s sans commande, récompense comprise ; fin du défi dite et montrée |
| Leçons (B9) | captures de L2, L8, L9 à chaque phrase ; chronologie voix et image de L2 |
| Non-régression | ce que le rapport range dans « Ce qui fonctionne bien » (§5) est intact |

**Recette fonctionnelle de contrôle**, à la fin du lot :
- relancer les parties B et C de la recette fonctionnelle (`docs/archives/PROMPT-RECETTE-LOT3.md`, session 1), et refaire les planches des écrans modifiés ;
- puis une **session relecteur limitée**, dont le prompt est dans `docs/archives/PROMPT-LOT3BIS.md`, vérifie chaque constat R1 à R25 et cherche les régressions.
