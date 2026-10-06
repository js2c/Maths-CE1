# Maths CE1 — spécification

**Spécification unique**, en vigueur depuis le 30 septembre 2026. Elle remplace les six documents qui s'empilaient jusqu'au lot 3 ter (première SPEC, lots 2, 3, 3 bis, 3 ter, Compléments), désormais rangés dans `docs/archives/`, où les renvois du code (`docs/SPEC-LOT2.md`, section 3…) les retrouvent.

Mode d'emploi :

- **Ce document dit ce que fait l'application** : les règles en vigueur. Ce qui n'est pas encore construit est marqué **(à construire)**. Les raisons des décisions sont dans `docs/JOURNAL-CONCEPTION.md` ; les idées et les questions ouvertes, dans `docs/IDEES.md`.
- **Les valeurs vivent dans `app/content/`** (nombres de questions, seuils, pourcentages, textes lus). Ce document donne les valeurs par défaut quand elles font partie de la règle ; en cas d'écart, le fichier de contenu fait foi et l'écart est signalé.
- **On le modifie en place** : un lot ne crée plus de nouvelle spécification. Il modifie ce document dans la même demande de fusion que le code.
- **Rédigé à partir des spécifications, pas du code.** La confrontation avec le code reste à faire (`docs/PROMPTS.md`, « Confrontation »), avant le lot « Sommes jusqu'à 30 » ; les écarts trouvés sont tranchés par le parent, puis reportés ici.

## 1. Objectif et public

- **L'enfant** : 7 ans, CE1, ne lit pas encore avec aisance. Toute consigne est orale, toute interaction se fait au toucher, sur une tablette Android en paysage, le soir, une dizaine de minutes.
- **Le parent** dirige l'usage : il peut indiquer l'exercice à faire, suit la progression dans l'espace parent et prend les décisions de réglage.
- **Point de départ** (évaluation Repères CE1, septembre 2026) : lire des nombres 3/3, écrire des nombres 3/3, **placer un nombre sur une ligne graduée 0/3**, **tables d'addition 1,2/3**, **calculer rapidement 1/3**, résoudre des problèmes 2,5/3, dénombrer 2,5/3. L'application vise d'abord les trois points faibles, puis les autres attendus du CE1 (section 13).
- **Critères finaux** (format de l'évaluation officielle) : ligne graduée, 13 bonnes réponses sur 15 en 5 minutes ; additions, 16 sur 20 en 1 minute ; calcul rapide, 24 sur 30 en 3 minutes.
- **Rythme de référence** : au moins 2 séances par semaine d'école ; tout doit rester juste de 2 à 5 séances par semaine.

## 2. La séance

### L'accueil

Quatre bulles : **jouer**, **choisir**, **le récif**, **l'album**, plus le logo (appui long, espace parent). **(à construire)** Une cinquième bulle, **les leçons**, sort les leçons de l'écran « choisir » (section 3, « Les leçons »). Après la séance du jour : la lune « à demain » (un décor, pas un bouton), **Encore !**, le récif, l'album.

- **jouer** : la séance préparée par l'application (notion du jour choisie par la rotation, section 3).
- **choisir** : l'enfant, ou le parent pour elle, choisit l'exercice puis le niveau (section 3). L'exercice choisi **est la séance du jour**, avec étoiles, coquillages et cartes.
- **Encore !** : le même écran de choix, en **entraînement libre** : sans étoiles ni coquillages, réponses enregistrées (marquées « libre »), comptées pour l'adaptation et la révision espacée. Pas de limite de durée ; la voix propose d'arrêter après 10 minutes. Une étoile arc-en-ciel gagnée en entraînement libre est remise à la récompense de la séance suivante.
- **Une séance comptée par jour** : la première séance terminée du jour. Une séance interrompue ne compte pas ; une autre peut suivre le même jour.

### Le déroulé

| Étape | Contenu |
| --- | --- |
| Accueil | La mascotte salue et souhaite la bienvenue (section 11) ; une surprise environ une séance sur cinq (section 10). |
| Sélecteur de difficulté | Quatre crans (section 4). |
| Échauffement | Des additions : faits dus de la révision espacée et faits nouveaux (section 6). Passable. |
| Notion du jour | L'exercice du jour : leçon si besoin, exemples guidés, questions (sections 5 à 7). |
| Défi record | 1 minute d'additions déjà bien sues (section 6). À partir de la 5e séance terminée et si au moins 8 faits sont en boîte 3 ou plus ; sinon sauté sans rien dire. Désactivable par le parent. |
| Problème du jour | **(à construire)** Un problème court (section 13). |
| Récompense | Étoiles, coquillages, cartes, décors, étoiles arc-en-ciel et dorées (section 10). |

- **Durée visée : 9 à 11 minutes** pour une enfant qui répond en 4,5 s. **La durée prime** sur le nombre de questions : chaque étape a une durée et une plage de questions (`seance.json`) ; si la mesure donne moins de 9 minutes, les nombres de questions sont relevés. Plafond de sécurité réglable par le parent (10, 12 ou 15 min ; 12 par défaut).
- **La séance se termine toujours sur une réussite**, puis la récompense.
- **Pas de chronomètre visible**, sauf au défi record (une bulle qui se vide, sans chiffre de secondes).

### Pendant la séance

- **La maison** (coin haut gauche) met la séance en pause, pendant l'échauffement, la notion du jour (leçons, exemples, corrections comprises) et le défi (le chronomètre s'arrête) ; pas pendant l'accueil ni la récompense.
- **L'accueil en pause** montre : **continuer** (reprise exacte : même question, consigne redite, même phrase de leçon) ; **choisir** (revenir sans valider ramène à la pause ; valider un exercice interrompt la séance en pause, avec la raison « autre exercice choisi par l'enfant », sans rien perdre des réponses ni des étoiles, puis lance l'exercice choisi comme séance du jour, sans refaire l'échauffement déjà fait ou passé ; valider une leçon la joue puis revient à la pause) ; **le récif et l'album** (visite libre, horloge, voix et musique de la séance en pause) ; **le logo** (espace parent, où « Terminer la séance » est proposé).
- **Pas de bouton d'arrêt pour l'enfant.** Seul le parent termine une séance en pause (section 12).
- **La frise d'avancement**, en haut : un pictogramme plat par étape (accueil, échauffement, notion du jour, défi, récompense), une rangée de bulles qui se remplissent dans l'étape en cours ; pas de chiffre ; elle ne ressemble à aucun bouton et ne réagit pas au toucher.
- **Réécouter** : toujours visible, rejoue la consigne ; compteur d'écoutes enregistré.

## 3. Choisir l'exercice et le niveau

### L'écran « choisir »

- **Validation simple** : un toucher bref sur une image dit son nom et la lance. De l'accueil au sélecteur : 3 touchers (choisir, l'exercice, le niveau).
- **Premier écran, l'exercice** : la ligne des nombres (la tortue), les additions (le « + »), le calcul rapide (le mur de corail), les voiliers (un voilier entre deux bouées, section 7 bis), les leçons (un livre ouvert).
- **Écrans de niveaux** : **tous les niveaux sont accessibles**, même jamais atteints.
  - Ligne des nombres : 13 tuiles ; additions : 7 familles ; calcul rapide : 9 plaques posées dans l'ordre sur un chemin de cailloux, l'exemple de calcul en petit ; voiliers : 9 tuiles, chacune avec la rangée de bouées du niveau, leurs nombres, et le voilier au-dessus du bon passage, son nombre en rouge.
  - Chaque tuile porte **son numéro en grand** (le parent peut dire « fais le 7 »), avec sa vignette en petit.
  - Le niveau conseillé a un **halo épais et animé** ; un niveau validé porte une petite étoile, à l'intérieur de sa tuile.
  - Aucune tuile coupée par un bord d'écran, ni posée sur la mascotte ou les algues.
- **Écran des leçons** (aujourd'hui, la dernière image du premier écran) : toutes les leçons existantes, vues ou non. Une leçon choisie seule n'est pas une séance : elle se joue, puis revient à l'accueil ; 3 étoiles si elle est regardée jusqu'au bout, une fois par leçon et par jour. Les tuiles portent un exemple (« 1 2 3 », « 10 20 », « 100 »…) sans numéro : **incompréhensibles** (constat du parent du 30 septembre), à refaire ci-dessous.

### Les leçons (à construire)

- **Accès** : depuis l'accueil (bulle « les leçons »), plus depuis l'écran « choisir ».
- **Menu refait** : les leçons rangées par exercice (la ligne, les additions, le calcul rapide), chaque tuile avec **son numéro en grand** et une **vignette qui montre le moment clé de la leçon** (la tortue et ses sauts comptés, le poisson et son reflet, le cadre de 10…), pas un exemple de calcul ; le nom dit au toucher ; la légende du parent inchangée. Maquette fabriquée en tête du lot et validée par le parent avant le code (`docs/LOTS.md`, lot « Les leçons »).
- **Les tables à consulter** : dans le menu des leçons, la **table d'addition** et la **table de multiplication** (décision du parent du 6 octobre 2026 ; la seconde arrive avec le lot « Multiplication »). Présentation à maquetter : une grille où toucher une case dit et montre le calcul (« 7 plus 5, 12 »), avec l'appui visuel de la famille.
- **La leçon suivie de son exercice** : à la fin d'une leçon, regardée jusqu'au bout **ou passée**, deux bulles : **« À toi ! »** (la vignette de l'exercice associé) et la maison. « À toi ! » enchaîne sur les exemples guidés puis les questions de l'exercice associé, **sans échauffement** ni leçon d'entrée (elle vient d'être vue) ; c'est la **séance du jour** si aucune n'a été terminée aujourd'hui, de l'**entraînement libre** sinon (même règle que « choisir » et « Encore ! »). Sélecteur de difficulté comme pour « choisir ».

| Leçon | Exercice associé |
| --- | --- |
| L1 · On compte les sauts | ligne, niveau 1 |
| L2 · Un saut peut valoir 10 | ligne, niveau 5 |
| L3 · La ligne ne commence pas toujours à 0 | ligne, niveau 4 |
| L10 · Les centaines | ligne, niveau 9 |
| L4 · Les doubles | additions, famille 2 |
| L5 · Les amis de 10 | additions, famille 3 |
| L6 · La maison des nombres | additions, famille 4 |
| L7 · + 10 sur le mur de corail | calcul rapide, niveau 2 |
| L8 · L'astuce du 9 | calcul rapide, niveau 6 |
| L9 · Passer la dizaine | calcul rapide, niveau 7 |
- **La légende des niveaux**, pour le parent : sur chaque écran de niveaux et celui des leçons, un bouton discret (un petit livre) ouvre un panneau par-dessus ; une ligne par niveau (numéro, vignette, ce qui est travaillé en une phrase simple, un exemple) ; fermé par une croix ou un toucher en dehors ; ne choisit et ne lance rien ; pas lue par la voix. Texte rangé une seule fois (`legendes.json`), repris par le guide et l'espace parent.

### Ce qu'entraîne un choix

- **Niveau choisi au-dessus du conseillé** : le réussir (8 bonnes réponses sur 10, au plus une aide) **le valide** et fait passer le conseillé au niveau suivant ; échouer ne fait jamais baisser le conseillé ni rien retirer. La leçon d'entrée du niveau est jouée la première fois.
- **Famille d'additions choisie** : elle devient la famille en cours de la séance ; si elle n'est pas ouverte, elle s'ouvre (sans étoile arc-en-ciel). La limite de faits nouveaux par séance ne s'applique pas à ses faits.
- **Mélange choisi en base neuve** : si moins de 3 familles ont des faits introduits, il introduit des faits des familles 1 à 3, avec la même limite que pour une famille choisie.

### La rotation de « jouer »

- La notion du jour tourne entre les trois exercices : **le moins avancé d'abord**, jamais deux fois de suite le même, sauf si un autre n'a rien à proposer.
- Quand tout ce qui est débloqué dans un exercice est acquis, « jouer » y révise le plus haut niveau acquis.
- **Module imposé par le parent** : valable pour la prochaine séance lancée par « jouer » ; si l'enfant choisit elle-même, il attend la suivante.
- **Les voiliers n'entrent pas dans la rotation** (décision du parent du 6 octobre 2026 : on y accède par « choisir », comme aux autres exercices) ; le parent peut les imposer pour la prochaine séance « jouer » (`seance.json`, `alternance.horsRotation`).

## 4. La difficulté : le sélecteur à quatre crans

Juste après l'accueil, un curseur à 4 crans, placé sur **conseillé**. Le cran vaut pour toute la séance, échauffement compris. Sans toucher pendant 15 s, la séance commence sur le cran affiché. Écran sans texte : des vagues de plus en plus grosses et les étoiles de chaque cran ; le conseillé a une lueur. En entraînement libre : même sélecteur, sans étoiles.

| Cran | Étoiles des bonnes réponses | Avec « jouer » | Avec « choisir » |
| --- | --- | --- | --- |
| Plus facile | × 0,5 | niveau conseillé − 1 | même niveau, une aide ou un repère en plus |
| Conseillé | × 1 | niveau conseillé | le niveau tel qu'il est défini |
| Plus dur | × 1,5 | niveau conseillé + 1 | même niveau, un repère en moins |
| Très dur | × 2 | niveau conseillé + 2 | même niveau, repères au minimum ou tolérance resserrée |

- Le multiplicateur ne porte que sur les bonnes réponses et les erreurs corrigées ; les fractions s'accumulent.
- **« Plus facile » consolide sans faire progresser** : une réussite à ce cran ne fait pas monter le niveau conseillé, et un fait réussi avec l'aide affichée d'emblée ne change pas de boîte (sans être renvoyé en boîte 1). La parade, si l'enfant le choisit presque toujours : l'interdire dans l'espace parent.
- **Réussir au-dessus du conseillé** valide le niveau ; échouer au-dessus ne fait jamais baisser le conseillé.
- **Protection** : 3 erreurs sur 5 au-dessus du conseillé font redescendre **d'un cran** pour le reste de la séance, avec une phrase douce (« On essaie un peu moins dur ? ») ; le multiplicateur suit. Avec « choisir », la protection descend un cran, jamais un niveau.
- **Crans autorisés** : réglage du parent (par exemple interdire « plus facile », ou plafonner à « plus dur »).
- Le détail de chaque cran par exercice est aux sections 5 à 7. **Les voiliers** (section 7 bis) font exception : le cran n'y change pas le niveau, avec « jouer » comme avec « choisir » ; il change la mer.

## 5. La ligne des nombres (module 1)

**Objectif** : comprendre qu'on compte des **sauts** et non des traits, qu'un saut peut valoir 1, 10 ou 100, qu'une ligne ne commence pas toujours à 0 ; lire, placer, situer et écrire les nombres jusqu'à 1 000.

**Support.** Aux niveaux 1 et 2, une corde sous l'eau avec des bouées, et la tortue qui saute de bouée en bouée ; à partir du niveau 3, la corde devient peu à peu une ligne d'école. Une dizaine est un filet de 10 poissons, une centaine un chalut de 10 filets.

**Formats.**

- **Lire** : une étoile de mer sur une graduation, choisir le bon nombre parmi des propositions (format de l'évaluation). Les propositions pièges sont construites à partir des erreurs E1 à E7 et reconstruites à chaque question.
- **Placer** : « Place le poisson sur 7 ». Le nombre est écrit sur une étiquette que porte le poisson (il ne ressemble pas à une bulle-réponse) ; la corde ondule au début de la question ; on peut toucher la corde, toucher ou glisser le poisson.
- **Sauter** : « La tortue est sur 4 et fait 3 sauts. Où arrive-t-elle ? »
- **Estimer** : placer un nombre sur une ligne sans graduations, avec une tolérance.
- **Écrire** : dictée au pavé numérique.

| Niveau | Ligne | Nombres écrits | Formats |
| --- | --- | --- | --- |
| 1 | 0 à 10, pas de 1 | tous sauf la cible et ses deux voisins (0 1 ? ? ? 5 6…) ; en « sauter », les nombres du trajet cachés | lire, sauter |
| 2 | 0 à 10, pas de 1 | 0, 5, 10 | lire, placer |
| 3 | 0 à 20, pas de 1 | 0, 10, 20 | lire, placer |
| 4 | 10 graduations hors de 0 (30 à 40) | les deux extrémités | lire, placer |
| 5 | 0 à 100, pas de 10 | 0 et 100, puis 0, 50, 100 | lire, placer |
| 6 | segment de 20, pas de 1 (30 à 50) | les dizaines | lire, placer |
| 7 | pas à déduire (1 ou 10) | deux graduations voisines | lire |
| 8 | 0 à 100 sans graduations | 0 et 100 | estimer (± 8 puis ± 5) |
| 9 | 0 à 1 000, pas de 100 | 0, 500, 1 000 | lire, placer |
| 10 | une centaine, pas de 10 (300 à 400) | les deux extrémités | lire, placer |
| 11 | 20 graduations de 1 (340 à 360) | les dizaines | lire, placer |
| 12 | pas de ligne : dictée | — | écrire (« trois-cent-sept » → 307) |
| 13 | 0 à 1 000 sans graduations | 0 et 1 000 | estimer (± 60 puis ± 40) |

Les niveaux 9 à 13 s'ouvrent avec « jouer » quand le niveau 8 est acquis ; avec « choisir », ils sont accessibles dès le départ.

**Crans à l'intérieur du niveau (avec « choisir »)** — réglés dans `module1.json` ; une case qui rendrait le niveau infaisable peut être ajustée, avec la raison notée :

| Niveau | Plus facile | Plus dur | Très dur |
| --- | --- | --- | --- |
| 1 | moins de propositions ; la tortue montre le premier saut | seulement 0, 5 et 10 écrits | seulement 0 et 10 |
| 2 | aussi 2 et 8 écrits | seulement 0 et 10 | 0 et 10, « placer » seulement |
| 3 | aussi 5 et 15 | seulement 0 et 20 | 0 et 20, « placer » seulement |
| 4 | le milieu aussi écrit (35) | extrémités seulement, cibles près du milieu | 20 graduations (30 à 50), extrémités seulement |
| 5 | aussi 20 et 80 | 0 et 100 seulement | 0 et 100, « placer » seulement |
| 6 | aussi les 5 (35, 45) | les deux extrémités seulement | segment de 30 (30 à 60), extrémités seulement |
| 7 | trois graduations écrites | cible 3 à 5 sauts après | deux graduations non voisines (40 et 60, deux sauts) |
| 8 | ± 10, repère 50 marqué | ± 5 d'emblée | ± 3 |
| 9 | aussi 200 et 800 | 0 et 1 000 seulement | 0 et 1 000, « placer » seulement |
| 10 | le milieu aussi écrit (350) | extrémités seulement, cibles près du milieu | deux centaines (300 à 500), extrémités seulement |
| 11 | aussi 345 et 355 | extrémités seulement | 30 graduations (340 à 370), extrémités seulement |
| 12 | nombres sans zéro (347), tableau centaines / dizaines / unités affiché | un nombre sur deux avec un zéro (307, 370) | zéros et « dix » (310, 715, 970) |
| 13 | ± 80, repère 500 marqué | ± 40 d'emblée | ± 25 |

**Génération.** Tirage au hasard selon les paramètres du niveau ; la cible n'est jamais une graduation numérotée ; aux niveaux 2 à 7, un quart des cibles près d'une extrémité. **Cibles tirées sans remise** : quand elles sont épuisées, un nouveau tour dans un nouvel ordre, dont la première n'est pas la dernière du tour précédent. Tout cran garde au moins 6 cibles possibles.

**Erreurs types et retours.**

| Code | Erreur | Piège | Retour oral (résumé) |
| --- | --- | --- | --- |
| E1 | compte les traits au lieu des sauts | bonne réponse + 1 | « On compte les sauts, pas les traits. » (la tortue saute depuis 0) |
| E2 | ignore la valeur du saut | 7 au lieu de 70 | « Ici, chaque saut vaut 10 ! » |
| E3 | ignore le point de départ | 4 au lieu de 34 | « La ligne commence à 30, pas à 0. » ; au format « sauter » : « La tortue part de 2, pas de zéro. » |
| E4 | compte depuis la droite | nombre symétrique | « Les nombres grandissent vers la droite. » |
| E5 | inverse dizaines et unités | 43 au lieu de 34 | « 3 dizaines et 4 unités. » |
| E6 | confond dizaines et centaines | 37 ou 370 au lieu de 307 | « Trois-cent-sept : 3 centaines, 0 dizaine, 7 unités. » |
| E7 | écrit le nombre comme il l'entend | 3007 au lieu de 307 | « Le 7 prend la place des unités. » |

**Leçons** : L1 (niveau 1, et E1 répétée), L3 (niveau 4, et E3 répétée au format « lire » sur une ligne qui ne commence pas à 0 ; une E3 au format « sauter » rejoue seulement sa correction), L2 (niveau 5, et E2 répétée), L10 (niveau 9). Section 8.

**Voie rapide** : elle peut faire franchir plusieurs niveaux dans une même séance, avec la leçon d'entrée de chaque niveau.

## 6. Les additions (module 2)

**Objectif** : retrouver de mémoire, sans compter, les additions dont le résultat ne dépasse pas 10, sous trois formes : 5 + 2 = ? · 3 + ? = 7 · ? + 4 = 6.

**Le catalogue** : **45 faits** (a et b de 1 à 9, a + b ≤ 10). Les additions avec 0 ne servent qu'à mesurer le temps de base.

### Les familles

| N° | Famille | Règle (faits pratiqués) | Appui visuel | Leçon |
| --- | --- | --- | --- | --- |
| 1 | + 1 et + 2 | un terme vaut 1 ou 2 | la tortue fait les sauts sur la ligne | — |
| 2 | doubles jusqu'à 5 | 1 + 1 à 5 + 5 | le poisson et son reflet | L4 |
| 3 | amis de 10 | somme 10 | le cadre de 10 (2 × 5 alvéoles de corail) | L5 |
| 4 | maisons de 5, 6 et 7 | somme 5, 6 ou 7 | la maison : total sur le toit, les poissons des deux nombres dans les pièces | L6 |
| 5 | maisons de 8 et 9 | somme 8 ou 9 | la maison, et le cadre de 10 | L6 si jamais vue |
| 6 | presque-doubles | 1 + 2, 2 + 3, 3 + 4, 4 + 5 et inverses | le double + 1 (le reflet et une bulle dorée) | L4 si jamais vue |
| 7 | mélange | tous les faits introduits, les plus faibles d'abord | l'appui le plus parlant pour chaque fait | aucune |

- **Introduction et pratique** : un fait nouveau est introduit avec la première famille qui le contient ; la pratique d'une famille porte sur tous les faits de sa règle, même rencontrés avant (les amis de 10 incluent 9 + 1, 5 + 5).
- **Faits nouveaux tirés au hasard** dans la famille (pas dans l'ordre 1 + 9, 2 + 8…) ; les deux ordres des termes apparaissent dans la séance.
- **Ouverture de la famille suivante** (au plus une par jour, quelle que soit la voie) :
  - par la **notion du jour** : 80 % des faits déjà introduits en boîte 2 ou plus ;
  - par l'**échauffement** : tous les faits des familles ouvertes introduits et 80 % en boîte 2 ou plus, et 90 % de réussite rapide sur les 12 dernières réponses d'échauffement ; aucune leçon imposée ; l'espace parent note « ouverte par l'échauffement le … » ;
  - par le **choix** de l'enfant (section 3), ou par le **point de départ** du parent (section 12).
  - Pas de fermeture automatique : une famille ouverte trop tôt se régule par la révision (les faits ratés restent en boîte 1).
- **Famille acquise** (une étoile arc-en-ciel, sauf point de départ du parent) : 80 % des faits de sa règle en boîte 3 ou plus ; pour les familles 3 à 5, chacun de ces faits réussi au moins une fois à une forme à trou ; ces réussites sur au moins 2 séances à deux jours différents. Une famille acquise le reste.
- **Famille en cours** (avec « jouer ») : la plus basse des familles ouvertes ni acquise ni dépassée ; quand toutes sont acquises, le mélange.
- **Stagnation** : une famille pas acquise après 6 séances où elle était la famille en cours de la notion du jour est **dépassée** ; la suivante devient la famille en cours (elle s'ouvre si besoin, avec sa leçon) ; la famille dépassée reste travaillée en révision, peut encore être acquise, et ne redevient jamais la famille en cours. L'espace parent la marque « en révision ».

### La révision espacée (5 boîtes)

| Boîte | Revient | On y entre quand… |
| --- | --- | --- |
| 1 | à chaque séance | fait nouveau, ou erreur |
| 2 | tous les 2 jours | juste et rapide depuis la boîte 1 |
| 3 | tous les 4 jours | juste et rapide depuis la boîte 2 |
| 4 | tous les 8 jours | juste et rapide depuis la boîte 3 |
| 5 (acquis) | tous les 15 jours | juste et rapide depuis la boîte 4 |

- Juste mais lent : reste dans sa boîte. Faux : retour en boîte 1. Juste avec une aide : pas de promotion.
- **Une boîte au plus par séance** (échauffement, notion du jour et défi confondus).
- Une seule boîte par fait, quelle que soit la forme ; la forme est enregistrée avec la réponse.
- **Seuil « rapide »** : 4 s au-delà du temps de base (mesuré sur des « a + 0 », posés une séance sur cinq), puis 3 s quand la moitié des faits rencontrés sont en boîte 3 ou plus.
- **Voie rapide des faits** : un fait nouveau réussi juste, vite et sans aide entre en boîte 3 ; elle ne fait jamais acquérir une famille en une seule séance.

### Les formes à trou

- Pour les familles 1, 2, 6 et 7 : elles **s'ouvrent pour une famille** le jour où la moitié des faits de sa règle atteignent la boîte 3 (ouverture définitive) ; ensuite, chaque question tire la forme au hasard (un tiers chacune).
- Pour les familles définies par leur résultat, les formes à trou sont là **d'emblée**, et les deux côtés du trou alternent :

| Famille | Plus facile | Conseillé | Plus dur | Très dur |
| --- | --- | --- | --- | --- |
| 3 · amis de 10 | toutes à trou, cadre affiché d'emblée (le premier nombre en poissons, les places vides à compter) | toutes à trou | toutes à trou | toutes à trou, révisions de toutes les familles |
| 4 · maisons de 5 à 7 | moitié à trou, appui affiché d'emblée | moitié à trou | 2 sur 3 à trou | toutes à trou, révisions de toutes les familles |
| 5 · maisons de 8 et 9 | 2 sur 3 à trou, appui affiché d'emblée | 2 sur 3 à trou | toutes à trou | toutes à trou, révisions de toutes les familles |

- Pour les familles 1, 2, 6 et 7 : plus facile = formes directes, appui affiché d'emblée ; conseillé = formes directes, et à trou si elles sont ouvertes ; plus dur = la moitié à trou même si elles ne sont pas ouvertes ; très dur = toutes à trou, révisions (au plus 20 %) prises dans toutes les familles.
- Formulations lues : « 3 plus combien, ça fait 7 ? », « Combien plus 4, ça fait 6 ? ».

### L'échauffement

- **12 à 16 questions, 3 minutes** (réglages) : les faits dus, les plus en retard d'abord, et **3 places réservées** aux faits nouveaux tant qu'il en reste à introduire, dans la limite de la boîte 1 (au plus 8 faits). Si les 3 faits nouveaux passent par la voie rapide, jusqu'à 3 autres s'ajoutent à la fin.
- **Limite commune** : au plus 6 faits nouveaux par séance, échauffement et notion du jour confondus (sauf les faits d'une famille choisie).
- Crans : plus facile = seulement des faits dus ; plus dur = 2 faits nouveaux de plus et formes à trou dès la boîte 3 ; très dur = 3 faits nouveaux de plus, formes à trou dès la boîte 2, faits de la famille suivante même non ouverte.
- **Variété** : la question suivante est la première de la file qui ne redonne pas la même réponse ; une forme à trou peut changer de côté.
- **Passer l'échauffement** : un bouton dédié, présent pendant tout l'échauffement, de la phrase d'introduction à la dernière question, avec son propre pictogramme (une vague franchie par une flèche), hors de la zone du pavé. Un toucher met l'échauffement en attente (voix arrêtée, pavé fermé, question affichée), la voix demande « Tu veux passer l'échauffement ? Touche la coche pour dire oui. » et une coche remplace le bouton ; la coche touchée termine l'échauffement ; sans toucher en 5 s, la coche disparaît et l'échauffement reprend, consigne redite. Journal : « échauffement passé ».
- **Réglage du parent** « Échauffement : oui / non » (oui par défaut) ; « non » le retire de la séance et de la frise. Passer souvent l'échauffement ralentit la révision espacée : les faits dus ne reviennent alors que dans les exercices d'additions.

### Les additions en notion du jour

- **Au moins 80 % des questions** sur les faits de la famille en cours (ou choisie), le reste en révision des faits les plus faibles des autres familles. Un même fait ne revient pas plus de 3 fois dans la séance. *(Pour une petite famille, la limite de 3 passages empêche parfois d'atteindre 80 % : question ouverte, `docs/IDEES.md`.)*
- **Leçon** : celle de la famille, seulement quand cette famille est travaillée, la première fois qu'elle est la notion du jour (L4, L5, L6 ; L6 pour les maisons de 8 et 9 et L4 pour les presque-doubles si elles n'ont jamais été vues ; aucune pour le mélange). Ensuite, deux exemples guidés que l'on peut passer.
- **Exemple guidé** : l'appui avec la réponse, « 3 plus 7, ça fait 10. », puis « À toi ! Tape la réponse. »
- **Presque-doubles** : chaque question rappelle le double (« 3 plus 4, c'est 3 plus 3, et encore 1. »), avec l'appui double + 1.
- **Correction** : l'appui visuel de la famille avec la réponse, puis la phrase de correction.
- **Aide (coquillage)** : l'appui visuel, lu par la voix, qui fait comprendre sans donner la réponse. Famille 1 : à la forme à trou, « Compte les sauts avec la tortue jusqu'à 10 » et la tortue avance saut par saut sans que le nombre de sauts soit annoncé ; à la forme directe, la tortue saute et l'enfant lit où elle arrive. L'aide se passe avec le « passer » habituel (voix et animation coupées, pavé rendu aussitôt) ; après l'aide, la consigne est redite ; la réponse compte comme faite avec aide.
- **Difficulté persistante** (3 erreurs sur 5) : la leçon de la famille si elle n'a pas été jouée dans la séance, puis un fait déjà bien su.

### Le défi record

1 minute, seulement des faits en boîte 3 ou plus, au pavé, sans consigne lue ; score en perles comparé à son propre record (jamais à une norme) ; 5 étoiles au nouveau record. Fin : le pavé est rangé, les perles avancent jusqu'au score, le drapeau du record est visible, la voix dit « Nouveau record ! 12 perles ! », « Record égalé ! » ou « Presque ! Tu as fait 9 perles. ».

## 7. Le calcul rapide (module 3)

**Objectif** : des **procédures** qui évitent de compter un par un, sur les nombres jusqu'à 100.

**Supports** : la **ligne** pour les petits sauts ; le **mur de corail** (tableau de 1 à 100, 10 rangées de 10 ; ajouter 10, c'est descendre d'une rangée) et le petit poisson qui s'y déplace ; le **chemin** : des ponts entre les nombres (38 → + 2 → 40 → + 3 → 43), avec le cadre de 10 pour passer la dizaine. Pas de personnage guide.

| Niveau | Procédure | Exemples | Débloqué (avec « jouer ») quand… |
| --- | --- | --- | --- |
| 1 | + 1, + 2, − 1, − 2 | 47 + 2, 60 − 1 | dès le début |
| 2 | + 10, − 10 (le mur) | 34 + 10, 57 − 10 | niveau 1 acquis |
| 3 | dizaines rondes : + 20, − 30… (un pont par dizaine) | 23 + 30, 68 − 20 | niveau 2 acquis |
| 4 | ajouter un chiffre sans changer de dizaine | 34 + 5 | maisons de 5 à 7 : 80 % des faits en boîte 2 ou plus |
| 5 | retirer un chiffre sans changer de dizaine | 38 − 5 | niveau 4 acquis |
| 6 | + 9 = + 10 puis − 1 | 34 + 9 | niveau 2 acquis |
| 7 | passer la dizaine en ajoutant | 38 + 5 = 38 + 2 + 3 | amis de 10 : 80 % des faits en boîte 3 ou plus |
| 8 | deux nombres à deux chiffres sans retenue (les dizaines d'un pont, puis les unités) | 23 + 34 → 53 → 57 | niveaux 3 et 4 acquis |
| 9 | passer la dizaine en retirant | 42 − 5 = 42 − 2 − 3 | niveau 7 acquis |

- **Domaine** : tout le domaine de chaque procédure sur le mur de 1 à 100 (sommes au plus 99), sans borne artificielle ; chaque calcul lu a son fichier de voix.
- **Déroulé d'un nouveau niveau** : la leçon s'il y en a une ; 3 calculs guidés où l'enfant remplit chaque caillou du chemin ; 3 calculs où le chemin n'apparaît qu'au coquillage ; puis sans aide. Les niveaux acquis reviennent en révision.
- **Affichage** : le calcul en grand dans une bulle, lu à voix haute ; réponse au pavé (même écran que les additions). Pendant les étapes guidées, la bulle garde le calcul demandé ; les étapes s'inscrivent sur les cailloux ; le résultat s'écrit dans la bulle à la fin.
- **Crans** : plus facile = le chemin affiché d'emblée (sans promotion) ; conseillé = le chemin au coquillage ; plus dur = sans chemin ; très dur = sans chemin, et à parts égales la forme directe et une forme à trou dont la réponse varie : aux niveaux à pas fixe (1, 2, 3, 6), le trou sur le nombre de départ (« ? + 10 = 57 ») ; aux niveaux 4, 5, 7, 8, 9, le trou sur le second nombre (« 38 plus combien ? Ça fait 43. »).
- **Aide (coquillage)** : aux niveaux du mur (2, 3, 6), le mur et le poisson apparaissent, le poisson fait le premier pas et la voix le dit (« Plus dix : le poisson descend d'une rangée ») ; sur le chemin (7 à 9), la voix dit le premier pont (« D'abord, on va jusqu'à 40 »). « Le petit poisson va t'aider » n'est dit que si le poisson est à l'écran.
- **Corrections** : jamais « C'était 40. » seul. Sur le chemin, y compris après « je ne sais pas » : « Ce n'est pas grave, regardons ensemble », le pont en cause rejoué, la phrase de l'erreur. Au mur, la réponse fausse n'est pas laissée écrite comme une égalité ; la bonne réponse est entourée.

| Code | Erreur | Exemple | Retour oral (résumé) |
| --- | --- | --- | --- |
| C1 | + 10 change les unités | 34 + 10 = 35 | « Quand on ajoute dix, seules les dizaines changent. On descend d'une rangée. » |
| C2 | compte un par un (juste mais lent) | plus de 8 s au-delà du temps de base | pas de reproche ; le chemin est rejoué une fois à la fin de la question |
| C3 | oublie le − 1 du + 9 | 34 + 9 = 44 | « + 9, c'est + 10 puis on recule d'un pas. » |
| C4 | oublie de changer de dizaine | 38 + 5 = 33 | « 8 plus 5 dépasse dix : on passe à la dizaine suivante. » |
| C5 | inverse la soustraction des unités | 42 − 5 = 43 | « On ne peut pas retirer 5 de 2 : on casse une dizaine. » |

**Leçons** : L7 (niveau 2, et C1 répétée), L8 (niveau 6, et C3 répétée), L9 (niveau 7, et C4 répétée). Section 8.

## 7 bis. Les voiliers : ranger un nombre entre des bouées (module 4)

Décisions du parent des 5 et 6 octobre 2026 ; lot « Les voiliers » (octobre 2026). Maquette validée : `art/voiliers/` (son `README.md` décrit le jeu, les niveaux, la mer et les images) ; la mascotte y était déjà branchée.

**Objectif** : situer un nombre parmi des nombres rangés : l'encadrer entre deux dizaines, deux centaines ou deux nombres quelconques, dire s'il est plus grand ou plus petit qu'une bouée ; jusqu'à 1 000. C'est une partie de « Comparer et ranger » (section 13) ; les signes <, > et = n'y sont pas.

**Accès** : une tuile de l'écran « choisir » (un voilier entre deux bouées), avec les autres exercices, puis ses 9 niveaux (section 3) ; aussi en entraînement libre (« Encore ! ») ; pas dans la rotation de « jouer » ; le parent peut l'imposer pour la prochaine séance « jouer ». Choisi, c'est la notion du jour de la séance, avec l'échauffement et le défi comme les autres exercices. Le pictogramme de la frise est un petit voilier.

**La scène** : celle de la maquette, telle quelle : la mer en WebGL, le ciel, la côte, les bateaux et les bouées qui tanguent. Pendant cet exercice, le lagon n'est pas affiché (c'est une scène de surface) : il se met en pause sous la mer. **Fabrication**, comme le récif vivant : un outil de l'atelier (`art/tools/export-voiliers.mjs`) extrait les 22 images de la maquette dans `app/assets/voiliers/` (2,7 Mo) et fabrique le module de l'application (`app/js/voiliers/voiliers-scene.js`) à partir du script de la maquette, sans le réécrire ; seuls ses raccords avec l'application sont retouchés (l'écran, le temps, le toucher, la place du bateau qui attend, la séance) ; chaque retouche est contrôlée par l'export, qui échoue si la maquette a changé. La maquette n'est jamais modifiée ; si elle change, l'export refait le module. La bulle, la mascotte, le panneau de réglage, les pastilles et l'écran « Jouer » de la maquette disparaissent : l'application a les siens. Les images sont une exception de plus au « tout dessiné », après les cartes, le lagon et le récif vivant. Sans WebGL (le jeu ne peut pas se jouer), la notion du jour se fait sur la ligne graduée, et l'incident est noté pour l'espace parent.

**Une question = un bateau.** Le bateau arrive ; la voix dit son nombre, seul (au premier bateau, la consigne d'abord ; quand la mer change, son annonce d'abord) et la bulle l'écrit en chiffres et en lettres (« 347 « trois-cent-quarante-sept » », avec les traits d'union de l'application, `engine/phrases.js`). L'enfant le fait glisser jusqu'au passage où il se range : entre les deux bouées qui l'encadrent, avant la première ou après la dernière ; la réponse est le passage où il le lâche (le geste de la maquette, sans changement). Le temps de réponse court de la fin du nombre dit au lâcher (s'il le lâche pendant que la voix parle, la voix se tait).

**Niveaux** (réglés dans `app/content/module4.json`, valeurs de la maquette, comparées à elle par `tests/unit/voiliers.test.mjs`) :

| Niveau | Nombres | Bouées | Écart entre bouées | Place du nombre |
| --- | --- | --- | --- | --- |
| 1 | jusqu'à 100 | 3 | 10 | à au moins 3 des bouées |
| 2 | jusqu'à 100 | 3 | 3 à 9, aucune bouée ronde | n'importe où |
| 3 | jusqu'à 1 000 | 3 | 100 | à au moins 20 des bouées |
| 4 | jusqu'à 1 000 | 4 | 10 | à au moins 3 des bouées |
| 5 | jusqu'à 1 000 | 4 | 100 ou 10, en alternance | près d'une bouée |
| 6 | jusqu'à 1 000 | 4 | 3 à 9, aucune bouée ronde | près d'une bouée |
| 7 | jusqu'à 1 000 | 5 | 10 | près d'une bouée |
| 8 | jusqu'à 1 000 | 5 | mélangés (100, 10, 3 à 9) | près d'une bouée |
| 9 | jusqu'à 1 000 | 4, puis 5 | 100, puis 10 | double encadrement : entre deux centaines, puis entre deux dizaines |

- Les bouées et les nombres sont tirés comme dans la maquette (mêmes fonctions, mêmes tirages) ; le passage visé est tiré au hasard, tous également probables ; jamais deux fois de suite le même nombre.
- **La rangée de bouées change tous les 5 bateaux** (`nouvellesBoueesApres`), et à chaque changement de niveau (l'ancienne s'efface, la nouvelle apparaît, comme dans la maquette). Dans la maquette, elle ne changeait qu'avec le niveau : au niveau 5, l'alternance des centaines et des dizaines ne se serait jamais vue. Un nombre manqué revient avec ses bouées.
- Le niveau suit les règles communes (section 9) : montée à 8 bateaux rangés du premier coup sur les 10 derniers, voie rapide, redescente après deux séances sous 50 % ; « plus facile » ne fait pas monter ; avec « choisir », tous les niveaux sont accessibles, et en réussir un au-dessus de celui atteint le valide (le niveau atteint passe au suivant) ; un niveau franchi rapporte une étoile arc-en-ciel. **Le cran ne change pas le niveau** (ni avec « jouer », ni avec « choisir ») : il change la mer. La progression propre à la maquette (changer de niveau de nombres après les pirates) a disparu.

**La mer et les crans** (proposition de conception retenue par défaut le 6 octobre 2026, le parent n'ayant pas de préférence ; à revoir après l'essai) :

| Cran | Mer |
| --- | --- |
| Plus facile | calme toute la partie |
| Conseillé | calme ; après 3 bateaux rangés de suite du premier coup, le vent ; après 2 échecs, retour au calme |
| Plus dur | le vent ; après 3 réussites de suite, les pirates ; après 2 échecs, retour au vent |
| Très dur | les pirates toute la partie |

- Un changement de mer est annoncé au bateau suivant par les phrases de la maquette ; une mer agitée dès le début (« plus dur », « très dur ») est annoncée au premier bateau. Au double encadrement, un bateau dont une seule rangée est juste du premier coup ne compte ni comme une réussite ni comme un échec pour la mer. Si la protection redescend le cran en cours de séance, la mer devient la plus forte que connaît le nouveau cran.
- **Calme** : le bateau attend, et se touche dès qu'il est arrivé. **Vent** et **pirates** : le bateau s'arrête au-dessus d'un mauvais passage (de préférence à droite du centre, pour la bulle), et le vent ne pousse, les pirates ne partent qu'une fois le nombre dit ; le vent mène le bateau jusqu'aux bouées en 7 s (`module4.json`) : le doigt le guide à gauche et à droite et peut l'accélérer, jamais le retenir ; le passage où il arrive est sa réponse. Les pirates rattrapent un bateau immobile 30 % plus vite, comme dans la maquette. Tout s'arrête pendant la pause (maison) : la houle, le vent, les pirates.
- Dans la simulation de l'année (`tests/sim-seances.mjs --choix 4:0`), au cran conseillé, le vent souffle sur deux bateaux sur trois environ (proposition à revoir après l'essai : `docs/IDEES.md`).

**Erreurs et corrections.**

- **Calme et vent** : les bouées du passage choisi s'allument (une seule, celle dont parle la voix, quand elle n'est pas ronde) et la voix explique (liste ci-dessous) ; le même bateau revient attendre (calme) ou une rafale le repousse (vent, qui repart une fois l'explication dite), et l'enfant réessaie. Réussi au deuxième essai : « erreur corrigée », une étoile (une erreur pour l'adaptation). Deuxième erreur : le bateau va seul au bon passage pendant que la voix dit pourquoi, et le nombre revient 3 à 5 bateaux plus loin (section 9).
- **Pirates** : après l'explication, « Les pirates ont rattrapé le bateau ! », le bateau est abordé et coule ; le nombre revient 3 à 5 bateaux plus loin. Pas lâché à temps : seulement « Les pirates ont rattrapé le bateau ! » (la maquette ajoutait « Il fallait le mettre à l'abri plus vite. », qui n'est pas dans la liste des phrases).
- **Double encadrement** (niveau 9) : chaque rangée a ses deux essais (un seul avec les pirates). La bonne centaine franchie : « C'est entre 300 et 400 ! », la caméra recule, une seconde rangée apparaît (« Et maintenant, entre quelles dizaines ? », puis le nombre) ; deux erreurs sur la première rangée : le bateau va seul à la bonne centaine, puis la rangée des dizaines suit. Le bateau n'est juste que si les deux rangées le sont du premier coup ; une rangée sur deux du premier coup, l'autre au deuxième essai (la pastille orange de la maquette) : erreur corrigée.
- **Codes d'erreur** (journal de l'espace parent, une phrase chacun) : V1, passage voisin du bon (« a confondu plus grand et plus petit près d'une bouée ») ; V2, deux passages ou plus d'écart (« s'est trompée de plusieurs passages ») ; V3, au double encadrement, bonne centaine et mauvaise dizaine (« a trouvé les centaines, pas les dizaines ») ; V4, mauvaise centaine (« s'est trompée de centaine »). Le délai dépassé aux pirates est noté à part (code « rattrape » : « le bateau a été rattrapé par les pirates avant d'être rangé »), compté comme une erreur. Chaque réponse enregistre aussi le passage choisi au premier essai, le bon passage, le nombre d'essais et la mer.
- **Pas de leçon** ; à la place, **un exemple guidé** la première fois que l'enfant joue un niveau (au début de la partie, ou après une montée dans la même partie) : un bateau va seul au bon passage, au calme, pendant que la voix dit la phrase du niveau, avec un nombre et des bouées fixés par niveau dans `module4.json`. « Passer » l'arrête. Il ne rapporte rien et ne compte pas pour l'adaptation (il compte une bulle de la frise). La difficulté persistante (3 erreurs sur 5) donne le bateau suivant loin des bouées (comme la question « plus simple » des autres exercices), de même pour finir sur une réussite.

**Les règles communes** (section 9) s'appliquent : « je ne sais pas » (à sa place habituelle, en bas à droite ; « Ce n'est pas grave, regardons ensemble. », puis le bateau va seul au bon passage pendant que la voix dit pourquoi ; code NSP ; le nombre revient plus tard) ; « passer » (en haut à droite) sur les explications, les bateaux qui vont seuls et l'exemple : la voix se tait, le bateau finit vite son geste, et le bouton ne revient pas pour la suite de la même correction (notée « correction passée ») ; « réécouter » redit la consigne et le nombre (au double encadrement, la question des dizaines et le nombre) ; reprise après une pause (« On continue ! » et la consigne redite) ; réponse qui varie (la « réponse » est le passage, la « question » le nombre ; avec 3 bouées, il n'y a que 4 passages : la réponse prend alors au moins 4 valeurs ; contrôlé par `tests/recette-fonctionnelle/b-sequences.mjs`, qui couvre aussi ce module). La partie compte autant de bateaux que la durée de l'étape le permet (`seance.json`, `module4` : 6 minutes, de 25 à 38 bateaux selon la simulation) ; la frise d'avancement remplace les pastilles de la maquette ; le panneau de réglage de la maquette a disparu (ce qui se règle est dans `module4.json`).

**Étoiles** : une par bateau rangé du premier coup ou par erreur corrigée (deux pour un nombre qui revient et qui est rangé du premier coup, comme dans les autres exercices), × le multiplicateur du cran (section 4).

**Voix** : toutes les phrases sont fabriquées avec Chatterbox (section 11), donc rédigées pour qu'il y en ait peu à fabriquer. Les textes, dans `textes.json` :

- consigne (`voiliersConsigne`) : « Les bouées sont rangées du plus petit au plus grand. Fais passer chaque bateau par le bon passage. » (au premier bateau et à « réécouter ») ;
- le nombre du bateau, dit seul (« 47 ») ;
- réussite : les « bravo » existants ; avec les pirates, « Bravo, tu as semé les pirates ! » ou « Ouf ! Les pirates sont loin. » ; entre deux bouées rondes voisines (deux dizaines ou deux centaines), et au double encadrement : « C'est entre {a} et {b} ! » ;
- erreur, bouée ronde (une dizaine ou une centaine) : « Il est plus grand que {b} : il passe après. » ou « Il est plus petit que {b} : il passe avant. » ; bouée non ronde : « Il est plus grand que cette bouée : il passe après. » ou « Il est plus petit que cette bouée : il passe avant. », la bouée allumée ; les mêmes phrases disent pourquoi quand le bateau va seul au bon passage (par rapport à la bouée de gauche, ou à la première) ;
- la mer : « Le vent repousse le bateau. », « Les pirates ont rattrapé le bateau ! », « Les pirates sont loin. », « Le vent se lève ! Il pousse les bateaux vers les bouées. », « Attention, des pirates ! Mets vite le bateau à l'abri. », « La mer se calme. », « Les pirates sont partis. Le vent souffle. », « Et maintenant, entre quelles dizaines ? » ;
- les 9 phrases des exemples guidés (`voiliersExemple`), et les noms des 9 niveaux dans l'écran « choisir » (`choixVoiliers`) et de l'exercice (« Les voiliers. »).

Phrases nouvelles : 835 (dont 486 nombres de 101 à 999 qui n'existaient pas encore, 198 erreurs avec une bouée ronde, 106 « C'est entre … ! »), environ 5 Mo ; la voix passe d'environ 60 à 66 Mo, sous le plafond de 80 Mo. L'inventaire (`tools/voix/inventaire.mjs`) donne le domaine de chaque gabarit.

**La mascotte** : en haut à gauche, sous la maison, comme sur les autres écrans (décision du parent du 6 octobre 2026 ; la maquette la place en haut à droite), sa bulle à sa droite ; « réécouter », « passer » et « je ne sais pas » à leur place habituelle. Pour que la bulle ne cache jamais la voile et son nombre, le point d'attente du bateau (430, 410 dans la maquette, au centre gauche) passe à droite du centre (880, 410) ; l'export le règle sans modifier la maquette. La bulle ne couvre jamais le bateau qui arrive ou attend le geste, ni la bande des bouées (obstacles « durs ») ; quand le bateau va seul au bon passage, elle l'évite si elle peut (obstacle « souple »). Ses réactions sont celles des autres exercices : petite joie au bon passage, déception bienveillante puis encouragement à l'erreur ; la bulle n'est là que le temps de parler (section 11).

**Fluidité** : 30 images/s au moins sur la tablette ; si le temps d'image moyen dépasse 20 ms, la mer passe à une qualité plus basse (les trois qualités de la maquette : fine, normale, économe ; on part de « normale »), puis remonte quand tout redevient fluide ; mesuré par `tests/e2e/perf.mjs --webgl --voiliers`. Dans le conteneur de développement, sans processeur graphique, la mer (WebGL logiciel) ne dépasse pas 1 à 2 images/s, maquette seule comprise : la fluidité réelle est à juger sur la tablette.

**Espace parent** : « Les voiliers » dans la progression (niveau atteint, historique, courbe de réussite et temps médian par semaine), dans le journal des erreurs (V1 à V4, NSP, rattrapé), dans le point de départ (niveau 1 à 9) et dans le choix de l'exercice imposé ; légende des 9 niveaux dans `legendes.json`.

## 8. Les leçons animées

- **Dix leçons** de 30 à 90 s, découpées en temps courts : une phrase lue, puis une animation qui attend la fin de la phrase. Textes dans `app/content/lecons.json` (tutoiement). Quand la pieuvre montrait quelque chose, une flèche le montre (section 11) : la tortue, l'étoile de mer et la loupe dans L1 à L3, le petit poisson du mur et de la ligne dans L7 à L9. Dans L4 à L6 et L10, où la pieuvre ne montrait rien de précis, le bernard-l'ermite et les aides suffisent.
- **Deux boutons seulement, dès la première vue** : « rejouer » (reprend au début) et « passer » (enchaîne sur « À toi ! » et l'exercice guidé). Une leçon passée ne rapporte pas ses 3 étoiles et est notée « passée ».
- **Au plus une fois par séance** la même leçon. Si la difficulté persiste ensuite : les questions suivantes au niveau inférieur, et la prochaine erreur corrigée plus lentement au lieu de relancer la leçon.

| Leçon | Exercice | Ce qu'elle montre |
| --- | --- | --- |
| L1 · On compte les sauts | ligne | la tortue saute depuis 0, chaque saut s'allume et se compte |
| L2 · Un saut peut valoir 10 | ligne | des bouées géantes (nettement plus grosses que celles de L1), un filet de 10 poissons par saut ; chaque saut part au moment où le nombre est dit |
| L3 · La ligne ne commence pas toujours à 0 | ligne | le départ à 30, les sauts numérotés depuis 30 |
| L4 · Les doubles | additions | le poisson et son reflet, 3 + 3 = 6, les doubles de 1 + 1 à 5 + 5 |
| L5 · Les amis de 10 | additions | le cadre de 10, 7 poissons et 3 places vides ; 6 et 4, 8 et 2 |
| L6 · La maison des nombres | additions | la maison du 7 et ses étages ; une pièce et le toit donnent l'autre pièce |
| L7 · + 10 sur le mur de corail | calcul | le poisson descend d'une rangée ; seules les dizaines changent |
| L8 · L'astuce du 9 | calcul | + 10 puis un pas en arrière, deux exemples (34 + 9, puis 56 + 9) |
| L9 · Passer la dizaine | calcul | deux tableaux successifs : le cadre de 10 qui se complète (8 + 2), puis la ligne et ses deux ponts (38 → 40 → 43) ; rien ne se superpose |
| L10 · Les centaines | ligne | dix filets dans un chalut, 300, puis 307 et le zéro des dizaines. **À corriger** (constat du parent du 30 septembre) : dans le chalut, chaque petit filet ne montre que 5 poissons ; **un filet montre toujours 10 poissons**, en deux rangées de 5 comme le cadre de 10. Le rendu, jugé daté, relève du chantier graphique |

Le vocabulaire (« amis de 10 », « maison », « mur ») est à aligner sur celui de la classe si l'enseignante en utilise un autre.

## 9. Règles communes à tous les exercices

**Adaptation.**

- **Montée de niveau** : 8 bonnes réponses sur les 10 dernières du niveau, avec au plus une aide.
- **Voie rapide** : les 5 premières questions d'un niveau justes, sans aide, en moins de 6 s chacune : niveau suivant. On part du niveau 1 partout.
- **Après une erreur** : retour immédiat qui montre la bonne réponse et pourquoi ; la même question revient 3 à 5 questions plus loin. Réussie à son retour : « erreur corrigée », une étoile.
- **Difficulté persistante** : 3 erreurs sur 5 relancent la leçon (au plus une fois par séance, section 8), puis une question plus simple. Deux séances de suite sous 50 % font redescendre d'un niveau, sans le dire.
- **La même erreur deux fois dans une séance** relance la leçon correspondante (dans la limite d'une fois par séance).

**Une réponse qui varie** (principe du lot 3 bis : un exercice conforme peut ne rien faire travailler si la réponse est toujours la même). Dans la notion du jour, pour chaque exercice, niveau et cran :

- la réponse attendue prend **au moins 5 valeurs différentes** sur une séance (sinon le niveau est à revoir) ;
- **jamais plus de 2 fois de suite la même réponse** ;
- **pas de suite prévisible de plus de 3 questions** (même pas, même ordre qu'au tour précédent) ;
- une même question ne revient **pas plus de 3 fois** dans la séance.

Vérifié automatiquement par `tests/recette-fonctionnelle/b-sequences.mjs` sur toutes les combinaisons exercice × niveau × cran.

**« Je ne sais pas ».** Sur chaque question, un bouton dont le pictogramme est distinct du « ? » des questions. Il compte comme une erreur (code NSP) pour l'adaptation, déclenche la même correction qu'une erreur ; la voix rassure (« Ce n'est pas grave, regardons ensemble ») ; la question revient plus tard. Compté à part des erreurs dans l'espace parent. Pas de bruitage d'erreur.

**« Passer ».** Le même bouton (deux triangles jaunes, en haut à droite, sous « réécouter »), visible moins d'une demi-seconde après le début, **dès la première vue**, sur les leçons, les exemples guidés, les corrections (après une erreur comme après « je ne sais pas ») et les aides.

- Exemple passé : la démonstration s'arrête, la question attend la réponse ; noté « exemple passé ».
- Correction passée : voix et animation coupées, la bonne réponse montrée en place environ une seconde, puis la question suivante ; la question revient plus tard, sans étoile de plus ; noté « correction passée ».
- **Aucune attente sans commande de plus de 2 s environ** (hors consigne orale), récompense comprise ; mesuré par `tests/e2e/recette-durees.mjs`.
- Vitesse des animations des exemples et corrections : réglage `vitesseAnimations` (1,5) ; la voix et les leçons gardent leur rythme.

**Le toucher.**

- **Boutons de choix et de commande** (tous, recensés) : un **toucher bref** (moins de 0,5 s) valide **au lever du doigt** ; un **appui long** montre une **étiquette** (fondu d'environ 0,2 s, tant que le doigt est posé, disparue 0,5 s après le lever) et **ne lance jamais rien**. La voix ne lit pas l'étiquette. Étiquettes dans `legendes.json` (pour une tuile de niveau : sa ligne de légende, « 7 · Ajouter en passant la dizaine »).
- **Exception : le pavé et les bulles-réponses** : la réponse part au premier contact, un appui long compte comme une réponse. Un second toucher sur la même touche en moins de 150 ms est ignoré. Pendant un retour (« bravo », correction), le pavé et les bulles sont ignorés jusqu'à la question suivante.
- **L'appui long sur le logo** ouvre l'espace parent (durée indiquée dans le guide du parent).
- Zones tactiles d'au moins 64 px.

**Reprise** : après une pause, « On continue ! » et la consigne redite dans les trois exercices, même si la pause a coupé une correction.

## 10. Récompenses

Principe : la progression visible récompense **l'effort et la régularité** ; **on ne perd jamais rien** ; pas de classement ni de comparaison ; pas de gain hors séance (l'entraînement libre ne rapporte ni étoiles ni coquillages) ; une série de jours se met en pause au lieu de retomber à zéro.

| Événement | Gain |
| --- | --- |
| Bonne réponse, erreur corrigée | 1 étoile de mer, × le multiplicateur du cran |
| Leçon regardée jusqu'au bout | 3 étoiles |
| Séance terminée | 10 étoiles |
| Nouveau record au défi | 5 étoiles |
| Série (une séance sur quelques-unes de la série, réglage) | 5 étoiles |
| Niveau franchi, famille acquise | 1 étoile arc-en-ciel |
| 4 semaines réussies (au moins 2 séances terminées dans la semaine, consécutives ou non) | 1 étoile dorée |

- **Le compteur d'étoiles** ne baisse jamais d'un coup : à l'échange, les étoiles volent vers le coquillage. Jamais « tu as gagné 0 étoiles » : « Tu as bien travaillé ! ».
- **Coquillages** : 25 étoiles chacun, au plus 2 par séance ; ouverture animée (il s'entrouvre, une perle brille, la carte se retourne).
- **Quota de cartes nouvelles** : 2 par semaine d'école (calendrier scolaire de `calendrier.json`, zone C), cumulées depuis la date de base enregistrée sur la tablette, au plus 60. Objectif : toutes les cartes, légendaires comprises, à la fin de l'année scolaire à 2 séances par semaine.
- **Jamais de doublon** (décision du parent du 5 octobre 2026) : un coquillage ne redonne jamais une créature déjà possédée.
  - **Sous le quota** (et toujours quand l'enfant n'a encore aucune carte) : une **créature nouvelle**, tirée parmi celles pas encore acquises des zones ouvertes (tirage pondéré par la rareté, jamais une légendaire).
  - **Au-dessus du quota**, ou quand il ne reste rien à gagner dans les zones ouvertes : le coquillage **rend brillante une créature déjà possédée** qui ne l'est pas encore (tirée de la même façon) ; la carte sort du coquillage et la voix dit « C'est {nom} ! Oh ! Elle est brillante ! ».
  - **Si toutes les créatures possédées sont déjà brillantes** (et qu'il n'y en a pas de nouvelle à gagner sous le quota) : le coquillage attend ; les étoiles restent au compteur, rien n'est perdu. Les étoiles peuvent ainsi s'accumuler (décision du parent du 5 octobre 2026 : accepté, rien d'autre n'est prévu).
- **Brillantes** : une créature nouvelle sort brillante une fois sur cinq (20 %) ; une créature possédée le devient au-dessus du quota (ci-dessus) ; une brillante le reste. Sur la carte, un reflet irisé la balaie toutes les 3 à 4 s, quelques étincelles sur le cadre ; dans le récif, la créature scintille. « Oh ! Elle est brillante ! ». Pas de compteur chiffré pour l'enfant.
- **Plus de décors ni de cadeaux pour le récif** (décision du parent du 5 octobre 2026) : les 15 décors des doublons et les cadeaux de la surprise sont supprimés ; ceux déjà gagnés restent dans les données de la tablette, mais ne sont plus montrés.
- **Zones** : la zone suivante s'ouvre quand toutes les communes et rares de la zone en cours sont gagnées **et** que toutes ses cartes ont leur illustration et leur anecdote ; elle est ouverte par une étoile arc-en-ciel à la récompense (l'étoile vole vers l'album) ; réserve vide : au prochain niveau franchi. Étoiles arc-en-ciel à la récompense : une seule phrase, au pluriel s'il y en a plusieurs, étoiles dessinées qui volent vers l'album.
- **Légendaires** : les dernières cartes de leur zone ; chacune coûte une étoile dorée, dépensée à la récompense dans un **coquillage doré** (au plus un par séance, en plus des coquillages ordinaires, sans étoiles de mer ; il passe avant les ordinaires quand il ne reste qu'une place sous le quota).
- **Surprise** : environ une séance sur cinq, jamais deux de suite, à l'accueil : un visiteur qui traverse la scène (la tortue, ou un banc de poissons) ; sans étoiles. (Plus de cadeau pour le récif depuis le 5 octobre 2026.)

**Les cartes.** 60 cartes (40 communes, 15 rares, 5 légendaires), en 4 zones de 15 :

| Zone | Communes | Rares | Légendaires |
| --- | --- | --- | --- |
| 1 · Le lagon | poisson-clown, étoile de mer, crabe, crevette, bernard-l'ermite, moule, oursin, anémone de mer, concombre de mer, coquille Saint-Jacques, poisson-chirurgien | hippocampe, poisson-ballon, limace de mer, raie pastenague | — |
| 2 · Le récif de corail | tortue verte, poisson-perroquet, murène, poulpe, seiche, poisson-papillon, poisson-lion, poisson-coffre, langouste, bénitier géant, crevette-mante | requin à pointes noires, poisson-mandarin, raie léopard, napoléon | — |
| 3 · Le grand large | dauphin, poisson volant, thon rouge, espadon, méduse à crinière de lion, tortue luth, poisson-lune, otarie, requin bleu | requin-marteau, requin-baleine, raie manta, baleine à bosse | grand requin blanc, orque |
| 4 · Les abysses et les mers glacées | poisson-lanterne, baudroie abyssale, poisson-vipère, isopode géant, pieuvre Dumbo, calmar vampire, requin-lutin, ver tubicole géant, cténophore | béluga, requin du Groenland, calmar géant | baleine bleue, cachalot, narval |

- **Illustrations** générées à part par le parent (Nano Banana) : style naturaliste réaliste, différent de l'application, portrait 3:4 **pleine page**, sans texte, le bas calme pour le bandeau ; relues (anatomie) avant intégration. L'application ajoute le cadre (nacre, argent, or selon la rareté), le bandeau du nom et, au dos, l'anecdote. Chaque anecdote est vérifiée avant d'être ajoutée.
- **Contenu à livrer** : lagon et récif de corail faits ; grand large **avant début février 2027** ; abysses **avant fin avril 2027**. Une zone sans contenu ne s'ouvre pas (au-dessus du quota, les coquillages rendent des créatures brillantes).
- **La carte en grand** (toucher une créature du récif ou une carte de l'album) : la voix dit le nom et l'anecdote **une seule fois**, à l'ouverture ; toucher la carte la retourne, sans relancer la voix.
- **L'album** : les quatre zones, 15 emplacements chacune ; carte obtenue visible, carte à découvrir montrée **de dos** ; zone fermée : dos assombris et coquillage fermé ; 15 perles sous chaque zone (pas de chiffre). Toucher un dos : « Cette carte t'attend quelque part dans le lagon ! » ; zone fermée : « … s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. » ; dos doré d'une légendaire : « C'est une carte légendaire ! Elle se gagne avec les étoiles dorées. ». Les onglets de zone ne ressemblent pas à des cartes.
- **Le récif vivant** : la collection où vivent les créatures obtenues. C'est la maquette du récif vivant (`art/recif-vivant/index.html`), validée par le parent, intégrée telle quelle ; elle remplace le récif en pages (décisions du parent des 4 et 5 octobre 2026). Détail ci-dessous.

### Le récif vivant

- **Une mer continue** : le panorama de la maquette (10 874 × 1 774 px, à la hauteur de l'écran) : le lagon, le récif de corail, le grand large, les abysses. On le parcourt en glissant à l'horizontale (avec élan) ; **on entre toujours par le lagon**. Les zones pas encore ouvertes se visitent aussi : la mer y est, sans créature de la collection.
- **Ce qui vit**, comme dans la maquette (un seul écart, voir « Le grand large » ci-dessous) : poissons et bancs, algues du lagon, flore du récif (gorgones, anémones, coraux), faisceaux de lumière, miroitement de la surface, grande faune du large en ombres lointaines, sous-marin, cheminées et leurs fumées, particules et poissons des abysses.
- **Les créatures de la collection** : seulement celles que l'enfant possède, en **images générées animées par le code** (celles de la maquette), à leur place, les grandes nageuses dans leur ronde. Elles remplacent les créatures dessinées en code (atelier, planche « recif »), qui sont retirées de l'application. Une créature brillante scintille.
- **Le grand large** (décision du parent du 5 octobre 2026) : ses quinze nageuses sont réparties sur toute la hauteur de l'eau, et non plus surtout au milieu, sur le trajet du sous-marin. Le poisson volant et le dauphin restent près de la surface ; les treize autres ont chacune leur profondeur, à intervalles réguliers jusqu'au fond. C'est le seul écart avec la maquette ; la ronde, la vitesse et le sens de chacune ne changent pas. Des croisements restent inévitables.
- **Toucher** : un toucher bref sur une créature ouvre sa carte en grand (la voix dit son nom et son anecdote, une fois) ; le doigt posé fait apparaître son halo ; doigt posé puis glissé, on la **déplace** : elle reste où on la lâche (une nageuse reprend sa ronde de là) ; les places sont oubliées à la visite suivante. Partout ailleurs, glisser fait défiler la mer.
- **Autour** : la maison (retour à l'accueil), l'album et « réécouter » ; s'ils couvrent par endroits une créature, ce n'est pas grave : on fait défiler la mer ou on déplace la créature (décision du parent du 5 octobre 2026). Ni la mascotte (ni sa bulle) ni le compteur d'étoiles par-dessus la mer, comme dans la maquette : la pieuvre, fixe, cachait des créatures et le sous-marin ; le compteur était illisible sur le noir des abysses. À l'entrée, la voix dit « Voici ton récif ! Touche une créature pour voir sa carte. » (ou, sans créature, « Ton récif attend ses premiers habitants… »).
- **Plus de pages, de perles, de décors ni de cadeaux.**
- **Mémoire et fluidité** : les images du récif ne sont chargées qu'à l'entrée (celles des créatures possédées seulement) et libérées en sortant ; si le temps d'image moyen dépasse 20 ms, le récif se dessine en densité 1.
- **Fabrication** : l'atelier (`art/tools/export-recif.mjs`) extrait les images de la maquette dans `app/assets/recif/` et fabrique le module de l'application (`app/js/recif/recif-vivant.js`) **à partir du script de la maquette lui-même**, sans le réécrire : seuls ses raccords avec l'application sont retouchés (l'écran, le toucher, la carte, les créatures possédées, les brillantes). La maquette n'est jamais modifiée ; si elle change, l'export refait le module. Quatre créatures portent un autre nom dans la maquette que dans `cartes.json` (bénitier, méduse, ver tubicole, requin du Groenland) : une table de correspondance.

## 11. L'univers, la voix et le son

- **La mascotte, le capitaine** (lot « Mascotte », octobre 2026 ; elle a remplacé la pieuvre partout). Décisions du parent des 5 et 6 octobre 2026 ; maquette validée : `art/mascotte/` (son `README.md` donne les vidéos, les raccords mesurés, le rendu et les règles du comportement).
  - Une tête dessinée, en vidéo (17 clips, fond vert retiré à l'affichage), **à la place de la pieuvre** sur chaque écran : en haut à gauche, sous la maison (210 × 280 px de la scène de 1280 × 800, de x 22 à 232 et de y 136 à 416) ; dans le jeu des voiliers aussi (section 7 bis) ; la tête entière, sans fondu ; absente du récif vivant, comme la pieuvre. Elle ne se déplace pas : ce qu'elle cacherait pendant un exemple, une correction ou une leçon est déplacé, pas elle (la pieuvre s'écartait ou remontait pendant les exemples, les corrections et les leçons ; la tête ne touche pas la ligne graduée, rien n'a eu à être déplacé).
  - **Pas de nom** : plus de choix du nom au premier lancement ni de réglage « nom de la pieuvre », plus de `{mascotte}` dans les textes. Le nom choisi autrefois reste dans la base (réglage `mascotte`), sans être montré.
  - **Jamais figée** : entre deux phrases, elle enchaîne de courts clips d'attente tirés au hasard selon le moment (accueil ; question en cours : calme et attentive ; après une réussite ; après une erreur ; pendant une explication), sans répéter les deux derniers, avec un délai minimal avant de refaire un geste marqué et un clip calme après chaque geste.
  - **Elle parle quand la voix parle**, sans synchronisation des lèvres, et se tait au plus 1,4 s après la fin de la phrase.
  - **Réactions** : à l'accueil, un salut et une phrase de bienvenue ; petite joie à une bonne réponse ; grande joie après une erreur surmontée, toutes les 3 réussites de suite et en fin de séance ; **déception bienveillante à la première erreur d'une question, puis encouragement** (remplace « jamais triste ni déçue ») ; elle regarde le travail quand quelque chose est montré.
  - **Relance** : 12 s sans toucher pendant une question, un geste pour attirer l'attention ; 25 s, « Prends ton temps. Tu peux réécouter la consigne. » (`relanceAide`) ; puis plus rien. Seulement quand une question attend sa réponse : ni pendant une leçon, ni en pause.
  - **La pause** (la maison) : la mascotte se tait, sa bulle s'efface, la relance s'arrête ; elle attend comme à l'accueil (jamais figée) ; à la reprise, elle reparle avec la phrase redite.
  - **Raccords invisibles** : elle ne change de clip qu'aux moments où les vidéos repassent par la même pose (mesurés image par image) ; une réaction attend en moyenne 0,4 s.
  - **La bulle** (sauf pendant une question de dictée, où elle écrirait en chiffres le nombre à écrire) : ce que dit la voix s'écrit mot à mot dans une bulle de BD (ovale tracé à la main, pointe vers sa bouche, police Shantell Sans, nombres en rouge). **Elle n'est là que le temps de parler**, puis 1,5 s, partout, jeu des voiliers compris ; « réécouter » la refait. Elle ne couvre jamais ce que l'enfant touche pour répondre (boutons, pavé, bulles-réponses, tuiles, poisson à placer) ni la bande de la ligne graduée ; elle peut couvrir un moment la carte de la question ou le décor (décision du parent du 6 octobre 2026), mais les évite quand elle peut, comme ce que dessine une leçon ou une aide. Sa place, dans l'ordre : à droite de la tête, au-dessus de la ligne ; plus étroite ; à hauteur de la bouche, entre l'ardoise et le pavé ; sous la tête. Le texte tient sur des lignes de 420 px au plus, équilibrées. Pas dans le récif vivant, où la mascotte n'est pas ; pas non plus là où aucune place ne laisse libre ce que l'enfant touche (l'album, couvert de cartes) : la voix parle seule. C'est la seule exception à « pas de texte long à l'écran » : elle reprend la voix, elle ne la remplace pas.
  - **La flèche** : là où la pieuvre montrait, une flèche bien faite, dessinée dans l'atelier en style A (corail, la couleur de la pieuvre), se pose au-dessus de ce qui est montré, avec une petite animation d'arrivée (elle tombe en 0,4 s avec un petit rebond), puis respire. Ligne graduée, pendant la consigne et l'exemple guidé : au-dessus de l'étoile de mer (« lire »), de la tortue sur son départ (« sauter ») ; pas de flèche en « placer » et « estimer » (la pieuvre y montrait la place de la réponse, qu'une flèche précise donnerait ; à côté du poisson, sur la ligne, elle se lisait comme une direction) ; dictée : à gauche du nombre décomposé de la correction, pointée vers lui ; leçons : section 8 (sur le mur de L7 et L8, au bord gauche de la grille, à la hauteur du poisson, pour ne cacher aucun nombre). Ce qu'elle cacherait d'utile, comme la tête de la mascotte, est évité : la tortue qui arrive à la nage passe sous la tête, la flèche de croissance de l'erreur E4 part à droite de la tête.
  - **Les pictogrammes** de la pieuvre restent pour l'instant : le bouton « je ne sais pas » (la pieuvre qui hausse les bras), l'étape « accueil » de la frise et l'icône de l'application (question ouverte, `docs/IDEES.md`).
  - **Fabrication** : les vidéos sont une exception au « tout dessiné » ; dans l'application, en WebM (le Chromium des tests ne lit pas le H.264), 7,5 Mo dans le cache hors ligne ; fond vert retiré par la carte graphique (WebGL), avec secours sans WebGL. Le moteur est celui de la maquette, repris tel quel (`app/js/engine/mascotte.js`) ; à l'allègement de niveau 2 (section 11, « Le lagon »), la vidéo passe à 12 images/s.
- **Personnages guides** : la tortue (ligne des nombres) ; le bernard-l'ermite (additions : leçons, exemples et corrections ; aucun travail de plus prévu) ; pas de personnage pour le calcul rapide ; le crabe pour les problèmes est à décider (`docs/IDEES.md`).
- **Style** : style A, « BD au marqueur » ; tout est dessiné dans l'atelier (règles dans `CLAUDE.md`), sauf les illustrations des cartes, le décor du lagon repris du récif vivant (ci-dessous), les vidéos de la mascotte et la scène du jeu des voiliers (section 7 bis). Rien n'est jamais figé à l'écran.
- **Voix** : toutes les phrases sont **fabriquées à l'avance** avec Chatterbox, qui imite la voix du parent (docs/VOIX.md), à partir du contenu ; une phrase avec un nombre est fabriquée pour chaque valeur possible, les nombres écrits en toutes lettres avant la synthèse ; la synthèse du navigateur ne sert que de secours. Plafond : **80 Mo**, contrôlé par un test. La voix ne démarre qu'après un premier toucher ; la consigne se lit automatiquement.
- **Son** : fabriqué par l'outil du dépôt (`tools/son/`), sans banque extérieure. Bruitages courts (bonne réponse, erreur douce jamais un son d'échec, étoile, coquillage, carte, brillante, bouton, zone). Trois musiques calmes (harpe, marimba, cloches), l'une tirée au hasard au début de chaque séance et gardée toute la séance ; environ 18 dB sous les bruitages, plus basse encore pendant la voix, très basse en pause, coupée dans l'espace parent ; aussi en entraînement libre ; pas dans le récif, l'album ni sur l'écran « à demain ». Réglages du parent : musique oui/non et volume (3 niveaux), bruitages oui/non.

### Le lagon, fond de toute l'application

Le fond dessiné d'origine (le sprite « fond », ses rayons, ses reflets, ses algues, ses trois poissons et ses bulles qui montent) disparaît de l'application. À sa place, partout, le lagon du panorama de la maquette du récif vivant (`art/recif-vivant/index.html`), avec ses algues et ses poissons. Décisions du parent du 4 octobre 2026 (lot « Lagon en fond d'exercices »).

- **Où.** Sur tous les écrans de l'enfant : accueil (et accueil en pause), sélecteur de difficulté, écran « choisir », échauffement, notion du jour (leçons, exemples guidés, questions, aides, corrections), défi record, entraînement libre, leçon choisie seule, récompense, album, « à demain ». Le récif vivant (section 10) est le panorama entier, dont le lagon est le début.
- **Ce qu'on voit.** Le début du panorama (10 874 × 1 774 px) ramené à la hauteur de l'écran : ses 2 838 premiers pixels, soit tout le lagon et, à droite, le début du récif de corail (corail rouge, corail cerveau, éponges, le bord d'une gorgone violette et d'une anémone blanche, immobiles). C'est voulu. Le fond ne défile pas. Même cadrage à 1280 × 800 et à 1920 × 1200 (même rapport).
- **Aucune adaptation de lisibilité** : pas de voile, pas d'éclaircissement du sable, aucun élément d'exercice déplacé.
- **Ce qui vit**, repris de la maquette avec ses mouvements et ses réglages :
  - les trois algues du lagon, implantées par le pied : le pied reste fixe, l'ondulation grandit vers le sommet ;
  - les poissons : solitaires et bancs en silhouettes, jamais de demi-tour, corps qui ondule, vitesse et profondeur qui varient lentement ; la population est celle de la maquette (le même peuplement simulé sur tout le panorama, seule la partie visible est affichée) : ils entrent et sortent par les bords de l'écran ;
  - les faisceaux de lumière, inclinés, qui dérivent et respirent ;
  - le miroitement de la surface, en haut de l'écran.
- **Rien de l'ancien décor** : ni son fond, ni ses rayons, ni ses reflets, ni ses algues, ni ses poissons, ni ses bulles qui montent, sur aucun écran. Restent, parce qu'ils ne sont pas le décor : les visiteurs de la surprise de l'accueil, les poissons et les bulles qui servent aux exercices (aides, leçons, effets des réponses).
- **Ce qui n'apparaît jamais pendant les exercices** : aucune créature à gagner (ni les 60 de la maquette, ni celles que l'enfant possède), ni le sous-marin, ni la grande faune du large. L'enfant ne les voit que dans sa collection (le récif, l'album).
- **Inchangés** : la mascotte (à la place de la pieuvre depuis le lot « Mascotte ») et les personnages guides (tortue, bernard-l'ermite, petit poisson du mur), la ligne graduée, les objets (étoile de mer, poisson à étiquette, filets, chaluts, mur, chemin, aides), l'ardoise, le pavé, les bulles-réponses, les boutons, la frise ; leur dessin et leur place.
- **Ordre des plans**, de l'arrière vers l'avant, celui de la maquette : le fond du lagon (et son miroitement), les poissons, les algues, les faisceaux ; puis la ligne graduée et tout ce qui porte l'exercice, comme aujourd'hui. Les algues et les poissons passent donc derrière la ligne graduée et ses nombres (l'ancien décor passait devant).
- **Allègement automatique** (temps d'image moyen au-delà de 20 ms, comme aujourd'hui) : niveau 1, algues et ondulation des poissons à 8 images/s, miroitement à 15 images/s, un faisceau sur deux ; niveau 2, algues, miroitement et faisceaux figés (les faisceaux fondus une fois dans le fond), poissons sans ondulation, au plus trois groupes à l'écran. Retour au niveau inférieur quand tout redevient fluide.
- **Fabrication.** Le panorama, les algues et les poissons sont des images (celles de la maquette), pas des dessins de l'atelier : c'est la deuxième exception au « tout dessiné » après les cartes. Un outil de l'atelier (`art/tools/export-lagon.mjs`, appelé aussi par l'export complet) les extrait de la maquette sans la modifier, compose le fond à la taille de la scène (@1x et @2x), les range dans des planches de l'application et vérifie qu'une seconde extraction donne les mêmes images. Le fond est en WebP avec perte (l'image d'origine l'est déjà). Les mouvements sont ceux du code de la maquette, repris dans le moteur de l'application.
- **Hors ligne.** Les nouvelles planches sont dans la liste du service worker (une seule résolution mise en cache, comme les autres planches) ; celles de l'ancien fond sont retirées de l'application.
- **Recette du lot** : captures de chaque écran (accueil, sélecteur, « choisir », récompense, récif, album, « à demain ») et de chaque type d'exercice (ligne : lire, placer, sauter, estimer, dictée ; additions et leurs appuis ; calcul au mur et sur le chemin ; échauffement ; défi ; leçons ; une correction et une aide), à 1280 × 800 et 1920 × 1200 ; temps d'image mesuré avant et après sur le même écran (`tests/e2e/perf.mjs`) ; aucune créature à gagner ni sous-marin à l'écran pendant les exercices (contrôle automatique).

## 12. L'espace parent

- **Accès** : appui long sur le logo, puis un code à 4 chiffres (créé et confirmé au premier accès ; récupération par une petite opération).
- **Les données** restent sur la tablette (IndexedDB, stockage persistant demandé), jamais en ligne. Elles disparaissent si l'on efface les données de Chrome ou désinstalle l'application : **sauvegarde complète (JSON)**, avec un rappel chaque semaine ; export CSV ; **restaurer une sauvegarde** (remplace toutes les données, le code parent conservé).
- **Ce qui est enregistré** : séances (date, heures, durée, terminée ou interrompue et pourquoi, exercice, cran, musique, nombre de questions, réussite) ; réponses (horodatage, exercice, niveau, question, forme, réponse, juste ou fausse, temps, écoutes, aide demandée ou d'emblée, code d'erreur, exemple ou correction passés, « libre ») ; faits (boîte, prochain passage, historique, temps médian) ; niveaux (atteint, dates d'obtention, redescentes, choix du parent) ; défi ; récompenses.
- **Ce qui est montré**, en **phrases simples, sans sigle ni mot de conception** :
  - calendrier des séances ;
  - progression de chaque exercice (niveau, courbe de réussite et temps médian par semaine ; familles : ouverture, faits bien sus, « acquise le 17/09 (depuis, 19 sur 30) », « en révision », « ouverte par l'échauffement le … ») ;
  - grille des additions (11 × 11, couleur selon la boîte et la rapidité ; les « + 0 » en gris ; toucher une case montre l'historique du fait) ;
  - journal des erreurs, chaque type en une phrase, précédé de l'exercice ; les erreurs d'additions détaillées (« se trompe de 1 », « a répondu l'un des deux nombres », « a fait une soustraction au lieu d'une addition », « autre ») ;
  - le défi (scores, record) ; les cartes (cartes, brillantes, cartes encore gagnables, étoiles dorées) ; la légende des niveaux ;
  - les incidents techniques, s'il y en a.
- **Réglages** : durée maximale de séance ; crans autorisés ; échauffement oui/non ; défi record oui/non ; exercice imposé pour la prochaine séance « jouer » ; point de départ (niveau de la ligne 1 à 13, du calcul rapide 1 à 9, des voiliers 1 à 9, familles connues 1 à 7 : leurs faits passent en boîte 3, sans étoile, noté comme choix du parent) ; son ; tout effacer (avec confirmation).
- **Terminer la séance** : pendant une pause, en haut de l'espace parent, avec confirmation : séance enregistrée comme interrompue, sans récompense (les étoiles déjà gagnées restent), retour à l'accueil.
- **Sauvegardes de test** (pour le parent qui veut essayer un stade plus avancé) : `node tools/sauvegarde-test.mjs <profil> <séances par semaine> <semaines>` fabrique une sauvegarde restaurable d'après la simulation ; mode d'emploi dans le guide du parent.
- **Bilans** : **(à construire)**, section 13.

## 13. Ce qui reste à construire

Les lots prêts à lancer, dans l'ordre, sont dans `docs/LOTS.md` (décision du parent du 6 octobre : mascotte, voiliers, leçons et table d'addition, sommes jusqu'à 30, multiplication et tables). Les phases (décision du parent du 30 septembre, détail dans `docs/IDEES.md`, section 1) : **phase 1**, les leçons (section 3), les problèmes, les sommes jusqu'à 30 et trois nouveaux exercices de numération ; **phase 2**, fractions, multiplication et partage, opérations posées, calculs à trois chiffres ; **phase 3**, heure, monnaie, longueurs et masses. **Exclu** : écrire les nombres en lettres. Chaque élément est précisé ici au moment de son lot, **après validation par le parent d'une maquette de son rendu** (fabriquée en tête du lot quand elle n'existe pas, `docs/LOTS.md`) ; les concepts non encore validés sont dans `docs/IDEES.md`, section 2.

### Bilans périodiques (à construire)

Toutes les deux semaines, un bilan remplace la notion du jour, au format officiel d'un exercice à la fois, en tournant : 15 questions de ligne graduée en 5 minutes (paliers officiels 0–4, 5–8, 9–15) ; 20 additions en 1 minute (0–5, 6–7, 8–20) ; 30 calculs en 3 minutes (0–8, 9–17, 18–30). Pour l'enfant, une « grande exploration » qui rapporte des étoiles comme une séance ; pour le parent, les scores bruts comparés aux paliers et au point de départ de septembre. Source des paliers : fiches descriptives Repères CE1, https://www.education.gouv.fr/l-evaluation-des-acquis-des-eleves-en-cp-ce1-ce2-cm1-et-cm2-fiches-descriptives-des-exercices-342046

### Sommes jusqu'à 30 (à construire, phase 1)

Suite du module 2, décidée en phase 1 (décision du parent du 30 septembre, confirmée le 6 octobre : jusqu'à 30, pas 20). Au moins : doubles jusqu'à 10 + 10, presque-doubles, passage de la dizaine par 10 (8 + 5 = 8 + 2 + 3), sommes dont le résultat va jusqu'à 30. Partage entre faits à mémoriser et calculs à faire : question ouverte (`docs/IDEES.md`), proposition par défaut dans `docs/LOTS.md` (lot « Sommes jusqu'à 30 »). À spécifier après maquette.

### Problèmes (à construire, phase 1)

**Situations de la vie courante** (décision du parent du 30 septembre : le thème marin serait trop restrictif), par exemple : « Papa vide trois sachets de gourmandises dans la gamelle du chien. Chaque sachet contient 6 gourmandises. », « La maîtresse fabrique des carnets. Elle a 28 pages. Elle utilise 4 pages pour chaque carnet. », « Les enfants ont rangé les 17 ballons de l'école. La maîtresse en achète 8 nouveaux. ».

- Lus à voix haute (l'énoncé n'est pas à lire), illustrés ; « réécouter » toujours disponible ; réponse au pavé.
- **Structures** : additives (réunion, transformation avec début, changement ou fin inconnu, comparaison), et dès le départ, avec de petits nombres, **multiplicatives** (groupes égaux) et de **partage** (valeur d'une part, nombre de parts), résolues sans le signe × en groupant des objets ou par additions répétées ; problèmes en deux étapes ensuite.
- **Aide après une erreur** : le schéma en barres (le tout et ses parties) pour les problèmes additifs ; des objets à grouper pour les autres.
- Place dans la séance (étape fixe ou exercice à choisir), banque d'énoncés, illustrations : `docs/IDEES.md`.

### Dénombrement (à construire)

Collections organisées (filets de 10 et poissons seuls : 3 filets + 7 = 37) ; en vrac jusqu'à 40 objets, que l'enfant peut marquer et entourer par 10 ; on enregistre si elle a regroupé par 10. Pourrait être remplacé par le jeu de la pêche (`docs/IDEES.md`), qui va jusqu'aux centaines.

### Comparer, doubles et moitiés, pair et impair (à construire)

Le jeu des voiliers (section 7 bis) couvre déjà une partie de « Comparer et ranger » : situer un nombre parmi des nombres rangés, plus grand ou plus petit, jusqu'à 1 000. Restent les signes <, >, = et ranger soi-même plusieurs nombres.

- **Comparer et ranger** : le plus grand de deux nombres (jusqu'à 100) ; les signes <, >, = (la bouche du poisson s'ouvre vers le plus grand) ; ranger 4 nombres ; jusqu'à 1 000. Aide : les nombres posés sur une ligne. Erreurs : compare les unités d'abord, croit qu'un nombre plus long peut être plus petit, inverse le signe.
- **Doubles et moitiés** (nouvelles familles du module 2) : doubles jusqu'à 10 ; doubles de 11 à 15 et de 20, 25… 50 (double de 13 = 20 + 6) ; moitiés des nombres pairs de 2 à 30 (partager en deux rangées). « Le double de 7 ? », « La moitié de 16 ? ». Leçon L12 · La moitié.
- **Pair ou impair** : deux gros boutons illustrés (deux poissons côte à côte, un poisson seul en plus) ; jusqu'à 20 avec la collection, puis jusqu'à 100 par le dernier chiffre. Leçon L11 · Chacun son copain.

### L'heure et la monnaie (à construire)

- **L'heure**, sur une horloge-hublot (petite aiguille courte et épaisse, grande fine, deux couleurs) : heures pile, placer la petite aiguille, et demie, et quart et moins le quart, durées simples ; cadran de 12 heures ; l'heure écrite aussi en chiffres, dite sous sa forme parlée. Erreurs : aiguilles inversées, « et demie » avec la petite aiguille pile sur l'heure, « moins le quart » lu comme l'heure suivante, nombres du cadran pris pour des minutes. Leçons L13 · Les deux aiguilles, L14 · Et demie, et quart.
- **La monnaie**, à la boutique du récif, en euros entiers : reconnaître pièces (1 €, 2 €) et billets (5 à 50 €, stylisés), compter une somme, payer un prix, échanger, rendre la monnaie en complétant sur la ligne ; la monnaie de la boutique n'est jamais celle des étoiles. Erreurs : compte les pièces au lieu de leur valeur, s'arrête avant le prix, rend le prix au lieu de la différence. Leçons L15 · Pièces et billets, L16 · Rendre la monnaie.
- À caler sur le moment où la classe travaille ces notions (réglage « exercices activés » du parent, avec une priorité sur une période).

### Autres

- **Synchronisation vers un Google Sheet** (facultatif).
- **Calendrier scolaire 2027-2028** à ajouter dans `calendrier.json` avant la rentrée 2027.

## 14. Recette

À chaque lot, avant la demande de fusion :

1. **Tests** : `npm test` ; `node tools/precache.mjs --check`.
2. **Simulation** : `node tests/sim-seances.mjs` (profils sait, reel, diff, tresdur, facile ; 2 et 5 séances par semaine ; sur l'année), complétée pour ce que le lot construit.
3. **Réponse qui varie** : `tests/recette-fonctionnelle/b-sequences.mjs --test`, aucune séance en défaut.
4. **Séance réelle et attentes** : `node tests/e2e/recette.mjs --delai 4.5` (9 à 11 min) ; `node tests/e2e/recette-durees.mjs`, avec et sans `--passer` (aucune attente sans commande de plus de 2 s environ).
5. **Parcours Playwright** concernés (tous en fin de lot), captures des écrans modifiés regardées ; aucune erreur dans la page.
6. **Recette fonctionnelle** du point de vue de l'enfant devant l'écran (et du parent à côté), pas de conformité : planches et séquences (`tests/recette-fonctionnelle/`), jugées par un relecteur distinct qui n'a pas vu le travail et ne lit la spécification qu'après : un agent lancé par la session du lot (`docs/LOTS.md`, « La recette »).
7. **Essai de dix minutes avec l'enfant** par le parent, après fusion : ce que la recette ne peut pas juger (voix, ressenti, réactions).

Toute règle pédagogique nouvelle est **simulée et lue en séquences avant d'être codée**.
