# Relecture indépendante du lot « Les leçons »

J'ai lu, dans cet ordre : les deux personnes à incarner, les 39 captures du parcours (`captures/1280-*.jpg` et `captures/1920-*.jpg`), ce que dit la voix (`1280-phrases.json`, comparé à `1920-phrases.json`), puis seulement ensuite `docs/SPEC.md`, sections 3 (« Les leçons ») et 8 (« Les leçons animées »). Je n'ai pas lu le code.

Limite : les captures « 1920 » sont enregistrées en 1280 × 800 (réduites). Elles montrent la même mise en page, mais on ne peut pas y mesurer les tailles réelles au doigt. Les mesures en pixels ci-dessous sont faites sur les captures 1280.

## Constats

| N° | Capture(s) | Ce qui ne va pas | Gravité | Suggestion |
| --- | --- | --- | --- | --- |
| 1 | 1280-03-menu, 1280-11-pause-menu, 1920-03-menu | La rangée des additions n'a que **4, 5, 6** : les leçons **11 et 12** n'existent pas dans le menu, et le menu a 4 colonnes au lieu de 5. L'enfant et le parent ne peuvent pas les lancer. | bloquant | Ajouter les tuiles 11 et 12 à la rangée des additions (après le 6), sur 5 colonnes. Si les captures viennent d'une base antérieure au lot « Sommes jusqu'à 30 », les refaire. |
| 2 | 1280-07-fin-L1, puis 1280-11-pause-menu | La leçon 1 a été regardée jusqu'au bout (le compteur passe de 0 à 3 étoiles), mais en revenant au menu la tuile 1 est **identique** à avant (aucune petite étoile ; vérifié en agrandissant la première rangée). L'enfant ne voit pas ce qu'elle a déjà regardé, et le parent ne peut pas répondre à « je l'ai déjà vue ? ». | gênant | Afficher la petite étoile dans la tuile d'une leçon vue ou passée, comme sur les écrans de niveaux. |
| 3 | 1280-16-table, 1280-phrases.json (5e bloc) | À l'ouverture de la table, aucune bulle n'est visible et la voix n'enregistre que « 7 plus 5, 12. » : ni « La table d'addition. » ni « Touche une case : je te dis le calcul. ». Sans cette phrase, l'enfant arrive devant 121 nombres sans savoir quoi faire. | gênant (à vérifier : la capture des phrases a peut-être commencé trop tard) | S'assurer que les deux phrases sont dites et écrites dans la bulle à l'arrivée, avant tout toucher. |
| 4 | 1280-10-pause, 1920-10-pause | Sur l'accueil en pause, la **tortue avec l'étoile de mer** de l'exercice reste à flotter au milieu de l'eau (1280 : à droite de la mascotte, vers x 240-345, y 330-460 ; 1920 : au centre). Rien ne l'explique ; l'enfant va la toucher en croyant que c'est un bouton. | gênant | Si c'est voulu (rappel de l'exercice en pause), la rendre utile (toucher = reprendre) ou la dire ; sinon, la retirer en quittant l'exercice. |
| 5 | 1280-06-lecon-L1, 1280-20-L10-chalut | La maison du coin haut gauche est présente pendant la leçon 1 mais **absente pendant la leçon 10**. Dans L10, l'enfant ne peut sortir qu'en passant (⏩) ou en recommençant. | gênant (à vérifier) | Même jeu de boutons dans toutes les leçons du menu. |
| 6 | 1280-19-table-6+2-sauts | L'appui « sauts de la tortue » est **minuscule** (environ 210 px de large, chiffres de 20 px environ) et le **8** (le résultat) ainsi que le bout de la ligne sont en partie cachés par le corail du décor (vers x 1170-1260, y 280-390). | gênant | Agrandir cet appui à la taille des autres (cadre de 10, maison) et le garder dans un panneau qui ne touche pas le corail. |
| 7 | 1280-19-table-3+4-double-plus-un | Le premier poisson du haut est **coupé en deux** par le bord gauche du panneau (vers x 1045, y 290) ; la bulle dorée est posée sur une branche de corail. | mineur | Décaler l'appui vers la droite ou réduire l'espacement. |
| 8 | 1280-17, 1280-18, 1280-19-* | Une case touchée s'allume en jaune, mais ses **deux en-têtes s'allument en bleu clair**, pas en jaune. | mineur | Allumer les en-têtes en jaune, comme la spécification le dit. |
| 9 | 1280-16-table (mesure) | Les cases visibles font environ **60 px** de large à 1280 (64 px d'un centre à l'autre, avec 4 px de vide). C'est juste sous les 64 px demandés si la zone de toucher ne comprend pas l'espace entre les cases. | mineur (à mesurer dans l'application) | Vérifier que la zone de toucher fait bien 64 px, espace compris. |
| 10 | 1280-12, 1280-16 | Pour le parent : rien sur la table ne dit ce que veulent dire les cases **bleues** (doubles) et **corail** (amis de 10), et il n'y a pas de petit livre sur cet écran. « Ça veut dire quoi, les cases bleues ? » reste sans réponse en 10 s. | mineur | Une petite légende de deux pastilles sous la grille, ou le petit livre sur cet écran. |
| 11 | 1280-14-fin-L5-passee, 1920-14 | Après la leçon **5**, la grande bulle « À toi ! » montre un grand **3** (la famille d'additions). C'est ce que dit la spécification, mais l'enfant qui vient de toucher « 5 » voit un autre numéro, et le parent peut croire à une erreur. | mineur | Garder (conforme), ou ajouter dans la tuile le pictogramme de l'exercice pour montrer que c'est un autre « 3 ». À trancher par le parent. |
| 12 | 1280-phrases.json (3e bloc), 1920-phrases.json | Au toucher de « À toi ! », la voix dit **« À ton tour ! »** à 1280 (la spécification dit « À toi ! »). À 1920, on entend trois fois « À toi ! » de suite (fin de leçon, toucher, première question). | mineur | Dire toujours « À toi ! » au toucher ; éventuellement varier la formule de la première question. |
| 13 | 1280-04-menu-etiquette | L'étiquette écrite d'une tuile (« 7 · Plus 10 sur le mur de corail, on descend d'une rangée ») **cache en partie les tuiles 4 et 5**. Elle n'est pas décrite dans la spécification, et elle porte le numéro. | mineur | Si elle sert au parent (appui long), la poser au-dessus de la rangée sans couvrir d'autre tuile, ou la supprimer : la légende fait déjà ce travail. |
| 14 | 1280-02-accueil-etiquette | L'étiquette de l'accueil (« Les leçons animées et la table d'addition. ») ne dit pas la même chose que la voix (« Les leçons. »). Sans gravité pour l'enfant, qui ne lit pas. | mineur | Aligner le texte, ou le laisser comme aide au parent. |
| 15 | 1280-01-accueil, 1280-03-menu | Deux **livres ouverts** presque pareils : la bulle « les leçons » de l'accueil et la légende du parent dans le menu (x 1180-1260, y 175-255). L'enfant qui a appris « livre = leçons » touchera le livre du menu et tombera sur un tableau de texte. | mineur | Donner à la légende un pictogramme différent (petit livre fermé, ou « ? »), plus discret. |
| 16 | 1280-03-menu | Le pictogramme du calcul rapide devant sa rangée (le mur de corail, x 425-490, y 485-550) a un cadre qui ressemble à un bouton, alors que ce n'en est pas un. | mineur | Le dessiner sans cadre, comme l'étoile et le « + » des autres rangées. |
| 17 | 1280-03-menu | Les tuiles 8 et 9 et la tuile « + » sont posées sur les rochers et les algues du décor (x 760-1000, y 545-670). | mineur | Remonter la grille ou dégager le décor derrière elle. |
| 18 | 1280-03-menu (agrandi) | Vignette 10 : le chalut touche et dépasse le bord droit de sa tuile ; vignette 3 : la ligne a un double trait au-dessus, peu lisible. | mineur | Réduire un peu le chalut dans la tuile ; simplifier la ligne de la vignette 3. |
| 19 | 1280-20-L10-chalut (agrandi) | Dans le chalut, les filets du bas **dépassent du contour** du chalut, à gauche et à droite (x 545-735, y 440-470), et les filets sont décalés une rangée sur deux. Chaque filet montre bien 10 poissons en deux rangées de 5. | mineur (la spécification renvoie le rendu au chantier graphique) | Tenir les dix filets à l'intérieur du chalut. |
| 20 | 1280-05-legende, 1280-06-lecon-L1, 1280-phrases.json | Vocabulaire différent entre légende et voix : légende 1 « on compte les sauts, **pas les traits** » / voix « on ne compte pas **les bouées** » ; légende 5 « remplir le **cadre** de 10 » / voix « la **boîte** à dix places ». Le parent qui reprend les mots de la légende ne parle pas comme la voix. | mineur | Reprendre les mots de la voix dans la légende (bouées, boîte). |
| 21 | 1920-09-exercice-apres-L1, 1920-phrases.json | Première question après L1 : la voix compte « 1… 6 », les arcs portent 1 à 6, puis elle demande le nombre sous l'étoile, dont la réponse est 6, déjà écrit sur le dernier arc. C'est l'exemple guidé prévu (section 3), mais l'enfant apprend vite que la première réponse est donnée. | mineur | Garder (conforme) ; vérifier seulement que cette question guidée ne compte pas comme une bonne réponse. |

Hors du périmètre du lot, vu au passage, non compté : la pieuvre apparaît encore en pictogramme (début de la frise, bouton d'aide en bas à droite de l'exercice, bouton en bas à gauche de l'accueil) alors que la mascotte l'a remplacée ; dans 1280-09, la tortue et l'arc « 1 » touchent presque le menton de la mascotte ; dans 1280-15, la bulle de la mascotte passe sous la plaque du calcul.

## Écarts avec la spécification (sections 3 et 8)

- **Menu** : la spécification demande les additions 4, 5, 6, 11, 12 sur cinq colonnes ; on voit 4, 5, 6 sur quatre colonnes (constat 1). Les douze leçons de la section 8 ne sont donc pas toutes accessibles.
- **Étoile d'une leçon vue** : « une leçon déjà vue (ou passée) porte la petite étoile » ; absente après L1 regardée jusqu'au bout (constat 2).
- **Table d'addition** : « Touche une case : je te dis le calcul. » et « La table d'addition. » ne sont pas dans les phrases enregistrées (constat 3) ; les en-têtes s'allument en bleu clair et non en jaune (constat 8) ; cases visibles d'environ 60 px au lieu de 64 (constat 9, à mesurer).
- **« À toi ! »** : la voix dit « À ton tour ! » au toucher à 1280, au lieu de « À toi ! » (constat 12).
- **Étiquettes écrites** sur l'accueil et sur les tuiles du menu : non décrites dans la spécification ; celle du menu porte le numéro de la leçon (constats 13 et 14).
- **Non vérifiable avec ces captures** : la ligne de la légende pour la table d'addition (il faut faire défiler, la capture s'arrête à la leçon 5) ; le retour à la pause après une leçon lancée depuis l'accueil en pause ; le geste de la mascotte après 12 s sans toucher ; la règle « 3 étoiles une fois par leçon et par jour » ; la case ignorée si touchée deux fois en moins de 150 ms.
- **Conforme** : accès par la bulle de l'accueil (avant, après la séance et en pause) ; phrases d'accueil du menu ; numéro en grand et vignette du moment clé sur chaque tuile ; nom de la leçon dit au toucher, sans numéro (« On compte les sauts. », « Les amis de dix. ») ; deux boutons « passer » et « rejouer » dans la leçon ; 3 étoiles pour L1 vue en entier, aucune pour L5 passée ; écran de fin avec « À toi ! » (tuile de l'exercice associé : ligne 1 pour L1, famille 3 pour L5) et la grande maison seule ; « À toi ! » mène au sélecteur puis à l'exercice ; table de 0 + 0 à 10 + 10 avec doubles en bleu et amis de 10 en corail, chemin teinté, plaque « 7 + 5 = 12 », un appui par famille (cadre de 10, reflet, double et bulle dorée, sauts, maison, deux boîtes au-delà de 10, rien pour + 0), pas de compteur d'étoiles, bulle sous la tête de la mascotte ; légende avec numéro, vignette, phrase et exemple, fermée par une croix.

## Ce qui marche bien

- Le menu est lisible d'un coup d'œil : grands numéros que l'enfant sait lire, une rangée par exercice, vignettes jolies et reconnaissables (la tortue, la maison du 7, le mur de corail).
- L'écran de fin est très clair : une grande bulle pour continuer, une grande maison pour partir, et la phrase dit exactement quoi toucher.
- La table d'addition est belle et utile : le chemin jaune de la rangée et de la colonne montre bien d'où vient la somme, et les appuis (surtout les deux boîtes de dix pour 7 + 5 et 9 + 8) sont justes et parlants.
- La légende du parent est en français simple, avec un exemple pour chaque leçon.
- Les phrases dites sont courtes, au tutoiement, et la bulle ne cache jamais une tuile ni une case.

## Suite donnée par la session (étape 0 du bloc « Sommes jusqu'à 30 » et « Multiplication »)

Les captures relues ont été faites sur `main` (le lot « Les leçons » tel que fusionné), la spécification relue est celle de la branche du bloc : d'où le constat 1.

| N° | Suite |
| --- | --- |
| 1 | **Pas un défaut du lot** : les leçons 11 et 12 arrivent avec le lot « Sommes jusqu'à 30 » (même branche) ; le menu à cinq colonnes, puis à quatre rangées avec L13, L14 et la table de multiplication, est vérifié par `tests/e2e/sommes30.mjs`, `tests/e2e/multiplication.mjs` et `tests/e2e/lecons-menu.mjs`. |
| 2 | **Corrigé** : en base neuve, l'état de l'exercice n'existait pas encore et la leçon vue depuis le menu n'était pas notée (sa tuile restait sans étoile) ; il est créé (`app/js/main.js`, `lessonAlone`). Le parcours le vérifie (« la leçon 1 vue porte son étoile dans le menu »). Au passage : L13 et L14 auraient été notées dans la ligne graduée, elles le sont dans la multiplication. |
| 3 | **Pas un défaut** : les deux phrases sont dites (vérifié par le parcours, « la table d'addition : la consigne ») ; le journal des phrases de cette étape commence après elles. |
| 4 | **Corrigé** : la tortue et son étoile, rendues visibles par leur propre style, restaient à l'écran malgré la pause (`app/css/app.css`) ; le parcours le vérifie. Défaut antérieur au lot (depuis la pause du lot 3). |
| 5 | **Pas un défaut** : la capture de la leçon 10 est faite avec le mode d'essai `?lecon=L10` (sans maison, réservé aux captures), pas depuis le menu ; depuis le menu, la maison est là pour toutes les leçons. |
| 6 | **Corrigé en partie** : l'appui est posé sur une plaque de nacre, lisible devant le corail ; sa taille reste celle que permet le panneau (230 px de large). |
| 7 | **Corrigé** : une place de plus pour le double + 1, le premier poisson n'est plus coupé. |
| 8 | **Spécification alignée** sur la maquette validée : les en-têtes s'éclairent en bleu clair. |
| 9 | **Conforme** : la zone de toucher est le pas de la grille, 64 px (`tableHit`, test unitaire du lot « Les leçons ») ; le vide entre les cases en fait partie. |
| 10, 11, 15, 16, 17, 18 | **Laissés tels quels**, mineurs, notés pour le parent dans la demande de fusion (question ouverte : un pictogramme différent pour la légende). |
| 12 | **Spécification alignée** : « À toi ! » a une variante, « À ton tour ! » (`textes.json`, `aToi`). |
| 13, 14 | **Voulus** : l'étiquette de l'appui long est une aide au parent (lot 3 ter), éphémère. |
| 19 | Relève du chantier graphique (section 8 de la spécification). |
| 20 | **Corrigé** : la légende reprend les mots de la voix (« pas les bouées », « la boîte de dix »), et le guide du parent aussi. |
| 21 | Conforme : la question guidée ne compte pas comme une réponse. |
