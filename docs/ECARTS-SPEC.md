# Écarts entre la spécification et l'application

Confrontation de `docs/SPEC.md` avec le code (`app/js`) et les réglages (`app/content`), faite le 6 octobre 2026 sur `main` (après le lot « Mascotte »), sans rien corriger : la spécification et l'application restent telles quelles jusqu'à la décision du parent (`docs/PROMPTS.md`, « Confrontation »). Ce qui est marqué **(à construire)** dans la spécification (jeu des voiliers, leçons refaites, bilans, problèmes, sommes jusqu'à 30…) n'est pas relevé.

## Synthèse

1. Le gros de la spécification est conforme : séance, pause, écran « choisir », sélecteur, ligne graduée, révision espacée, défi, cartes, album, récif vivant, mascotte et espace parent font ce qui est écrit. La règle « une réponse qui varie » est tenue (`b-sequences.mjs --test` : 0 séance en défaut sur 464). L'année simulée (profil réel, 2 séances par semaine) donne 9,3 min par séance, le quota de cartes n'est jamais dépassé et aucune carte n'est donnée en double.
2. **41 écarts** : 23 où la spécification est datée ou imprécise (le code a raison), 4 où le code s'écarte d'une décision (la spécification a raison), 14 questions à trancher. S'y ajoutent 24 comportements visibles que la spécification ne décrit pas (dernière partie).
3. Code à revoir : l'espace parent montre encore « cadeaux de la surprise dans le récif » (supprimés le 5 octobre) ; à la ligne, le cran « plus facile » fait encore progresser quand le conseillé est le niveau 1 ; l'ouverture des familles n'est pas limitée à une par jour quelle que soit la voie ; le niveau 9 du calcul rapide n'a pas de forme à trou au cran « très dur ».
4. À regarder avant le lot « Sommes jusqu'à 30 », qui s'appuie sur le module 2 : la limite de 6 faits nouveaux par séance est dépassée avec « jouer » (6.1) ; les crans des additions avec « jouer » ne sont pas décrits (4.1, 6.4) ; une erreur corrigée rapporte 2 étoiles et non 1 (9.4) ; la redescente après deux séances sous 50 % n'existe que pour la ligne (9.2).
5. La spécification est surtout datée au calcul rapide : il n'y a pas de ligne graduée, le niveau 8 est sur le mur, l'aide reste toujours au coquillage, toute la correction est rejouée. Elle l'est aussi pour les additions : les presque-doubles au cran « plus facile », l'échauffement « plus facile », l'anti-répétition de l'échauffement.

## Comment lire ce rapport

- **Qualification** : « **Spéc. datée** » = la spécification est fausse, datée ou imprécise, le code a raison ; « **Code à revoir** » = le code s'écarte d'une décision, la spécification a raison ; « **À trancher** » = le parent décide.
- Les numéros reprennent la section de `docs/SPEC.md` (2.1 = premier écart de la section 2).
- **Mesures** : `node tests/sim-seances.mjs reel 2 annee --court` (64 séances simulées) ; `node tests/recette-fonctionnelle/b-sequences.mjs --test` (116 combinaisons exercice × niveau × cran, 464 séances : 0 en défaut) ; une copie de ce dernier, dans le dossier de travail de la session, qui relève aussi la durée simulée de chaque séance. Les deux outils demandent `npm install` (paquet `fake-indexeddb`). Les recettes Playwright à vitesse réelle (`tests/e2e/`) n'ont pas été relancées : les durées citées sont celles des modèles de simulation.

## 1. Objectif et public

Aucun écart : la section ne contient pas de règle que le code applique (les critères finaux relèvent des bilans, à construire).

## 2. La séance

| N° | Règle (`docs/SPEC.md`) | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Défi record « à partir de la 5e séance terminée ». | Il faut 5 séances déjà terminées : le premier défi a lieu à la **6e** séance (simulation : « premier défi à la séance 6 »). La phrase vient du lot 2 et se lit des deux façons. | `session/session.js`, `challengeReady` ; `seance.json`, `aPartirDeSeance: 5` | À trancher | Écrire « à partir de la 6e séance (5 déjà terminées) », ou passer `aPartirDeSeance` à 4 si la 5e était voulue. |
| 2.2 | « La séance se termine toujours sur une réussite, puis la récompense. » | Seule la notion du jour essaie de finir sur une réussite : après une dernière réponse fausse, **au plus 2** questions plus simples, et seulement s'il reste du temps. Le défi, qui suit, finit comme il finit. | `session/notion.js` ; `seance.json`, `finirSurReussite.essaisMax: 2` | Spéc. datée | « La notion du jour se termine si possible sur une réussite (jusqu'à 2 questions plus simples après une erreur finale). » |
| 2.3 | Après « choisir » depuis la pause, l'exercice choisi commence « sans refaire l'échauffement déjà fait ou passé ». | La règle vaut pour **toute** nouvelle séance du même jour, par exemple après « Terminer la séance » du parent. En revanche, un échauffement interrompu en cours (pause, puis autre exercice) ne compte pas comme fait : il est refait en entier. | `main.js`, `runSession` (raison « déjà fait aujourd'hui ») | À trancher | Généraliser la phrase à « toute séance du même jour » ; dire si un échauffement commencé puis interrompu doit compter comme fait. |
| 2.4 | Pause : « le récif et l'album (visite libre, horloge, voix et musique de la séance en pause) ». La section 11, elle, dit : musique « pas dans le récif, l'album ». | Pendant une visite du récif ou de l'album depuis la pause, la musique continue, très bas (niveau « pause »). Depuis l'accueil hors séance, il n'y a pas de musique. | `main.js`, `pauseSession` et `visitInPause` ; `engine/son.js`, `pauseLevel` | À trancher | Les deux sections se contredisent. Choisir « très basse, comme en pause » ou « coupée pendant la visite ». |
| 2.5 | « Durée visée : 9 à 11 minutes pour une enfant qui répond en 4,5 s ; si la mesure donne moins de 9 minutes, les nombres de questions sont relevés. » | En moyenne avec « jouer », c'est tenu (simulation de l'année : 9,3 min, 10,0 min avec le défi). Avec « choisir », 179 des 464 séances simulées font moins de 9 min (6 à 8 min), dont 171 sur une base neuve (sans défi), surtout aux niveaux étroits : ligne niveau 2 « très dur », ligne niveau 8, crans « plus facile ». La cause : la notion du jour s'arrête quand plus aucune question ne peut être posée sans dépasser 3 passages. Aucune séance « mois » de l'enfant au profil réel ne passe sous 9 min. 32 séances dépassent 11 min (au plus 12,1, sous le plafond). | `session/notion.js` (arrêt quand `next` rend `null`) ; `seance.json`, `variete` | À trancher | Mesurer quelques niveaux choisis avec `tests/e2e/recette.mjs --delai 4.5`. Ensuite, accepter des séances plus courtes aux niveaux étroits, ou leur donner plus de cibles. |

## 3. Choisir l'exercice et le niveau

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Niveau choisi au-dessus du conseillé : le réussir « le valide et fait passer le conseillé au niveau suivant ». | Ligne : le conseillé devient le niveau qui suit le niveau choisi (réussir le 9 en partant du 3 mène au 10). Calcul rapide : le niveau choisi est acquis, mais le conseillé reste le plus bas des niveaux débloqués et non acquis. Il ne bouge donc pas, car les niveaux du calcul sont des procédures et non une échelle. | `modules/numberline/runner.js`, `record` ; `modules/calc/runner.js`, `recommended` | Spéc. datée | Préciser par exercice : « ligne : le conseillé passe au niveau qui suit le niveau réussi ; calcul : le niveau réussi est acquis, le conseillé reste le plus bas des niveaux à acquérir ». |
| 3.2 | « Un niveau validé porte une petite étoile. » | Ligne : tous les niveaux sous le conseillé portent l'étoile, même jamais joués (réussir le 9 en partant du 3 met une étoile sur les niveaux 4 à 8). Additions et calcul : seulement les familles et niveaux acquis. | `session/choice.js`, `levelItems` (`valide: c.niveau < cur`) | À trancher | Garder (l'étoile veut dire « dépassé »), ou réserver l'étoile aux niveaux réellement réussis, ce qui demande de les garder en mémoire. |
| 3.3 | Rotation de « jouer » : « jamais deux fois de suite le même, sauf si un autre n'a rien à proposer ». | Le cas « rien à proposer » n'est jamais vérifié : chaque exercice est considéré comme ayant toujours quelque chose. Il n'y a pas d'effet aujourd'hui, puisque chaque exercice a toujours un niveau à proposer. | `session/session.js`, `start` (`this.has` jamais fourni) | À trancher | Laisser tel quel (sans effet) ou brancher la vérification. Les voiliers n'entrent pas dans la rotation, ce n'est donc pas urgent. |

## 4. La difficulté : le sélecteur à quatre crans

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Tableau : avec « jouer », « plus facile » = niveau conseillé − 1, « plus dur » = + 1, « très dur » = + 2. | Seule la **ligne** change de niveau avec « jouer ». Additions avec « jouer » : « plus facile » = formes directes de la famille en cours, appui affiché d'emblée ; « plus dur » = formes à trou et faits de la famille suivante ; « très dur » = idem, plus toutes les familles ouvertes mêlées. Calcul rapide avec « jouer » : les mêmes crans qu'avec « choisir » (le chemin). | `seance.json`, `selecteur.decalages` (« ligne graduée ») ; `module2.json`, `notion.crans` ; `module3.json`, `crans` | Spéc. datée | Dire que le décalage de niveau ne vaut que pour la ligne, et renvoyer aux sections 6 et 7 pour les autres (voir 6.4). |
| 4.2 | « “Plus facile” consolide sans faire progresser : une réussite à ce cran ne fait pas monter le niveau conseillé. » | Ligne avec « jouer », conseillé au niveau 1 : « plus facile » reste au niveau 1, qui est le conseillé, et les réussites comptent pour la montée et la voie rapide (à une demi-étoile). | `modules/numberline/runner.js`, `eff` et `record` | Code à revoir | Ne pas compter pour la montée une réponse donnée au cran « plus facile », même quand le niveau joué est le conseillé. |

## 5. La ligne des nombres (module 1)

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Niveau 5 : nombres écrits « 0 et 100, puis 0, 50, 100 ». | Il n'y a pas de progression dans le niveau : 0, 50 et 100 sont écrits d'emblée ; « 0 et 100 seulement », c'est le cran « plus dur ». | `module1.json`, niveau 5 | Spéc. datée | « 0, 50, 100 ». |
| 5.2 | Leçons de la ligne : L10 au niveau 9. | L10 est aussi relancée quand l'erreur E6 (dizaines et centaines confondues) revient deux fois dans la séance. | `modules/numberline/runner.js`, `LESSON_OF_ERROR` | Spéc. datée | Ajouter « et E6 répétée » à L10. |
| 5.3 | Difficulté persistante : « 3 erreurs sur 5 relancent la leçon » (section 9). | À la ligne, la leçon relancée est L1 aux niveaux 1 à 3, L3 au 4, L2 au 5, L10 au 9. Aux niveaux 6 à 8 et 10 à 13, aucune leçon n'est relancée : seulement une question plus simple. | `modules/numberline/runner.js`, `record` | Spéc. datée | Écrire cette correspondance dans la section 5. |
| 5.4 | « Estimer » : tolérance « ± 8 puis ± 5 » (niveau 8), « ± 60 puis ± 40 » (niveau 13). | La tolérance se resserre après 5 estimations justes au niveau, comptées seulement quand ce niveau est le conseillé : quand l'enfant choisit le niveau 8 ou 13 sans que ce soit son conseillé, la tolérance reste large toute la séance. | `modules/numberline/generator.js`, `toleranceFor` ; `runner.js`, `justesNiveau` | À trancher | Compter les estimations justes du niveau joué, ou l'accepter (rare). |

## 6. Les additions (module 2)

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 6.1 | « Limite commune : au plus 6 faits nouveaux par séance, échauffement et notion du jour confondus (sauf les faits d'une famille choisie). » | Avec « jouer » aussi, la notion du jour dépasse la limite quand la famille en cours n'a plus d'autre question possible. Ce dépassement est permis tant que la boîte 1 compte moins de 8 faits **ratés** (correction du lot 3 bis : sans elle, la notion d'une base neuve s'arrêtait au bout de 4 minutes). Simulation : 9 puis 7 faits nouveaux aux séances 2 et 6. | `modules/facts/runner.js`, `pickOverflow` ; `docs/archives/AVANCEMENT-lots-1-a-3ter.md` | Spéc. datée | Écrire l'exception dans la limite commune. |
| 6.2 | Ouverture de la famille suivante : « au plus une par jour, quelle que soit la voie ». | Par la notion du jour : au plus une par **séance**. Par l'échauffement : au plus une par jour, en ne comptant que les ouvertures par l'échauffement (règle d'origine du lot 3 ter). Le choix, la stagnation et le point de départ ne sont pas limités. Deux familles peuvent donc s'ouvrir le même jour quand il y a deux séances (par exemple après une séance interrompue). | `modules/facts/families.js`, `updateFamilies` et `warmupOpening` | Code à revoir | Compter toutes les ouvertures du jour, choix et point de départ du parent exceptés ; ou bien écrire « une par séance par la notion du jour, une par jour par l'échauffement ». |
| 6.3 | Familles 1, 2, 6 et 7 : « plus facile = formes directes, appui affiché d'emblée ». | Presque-doubles (famille 6) au cran « plus facile » : **une question sur trois à trou**. Avec les seules formes directes, il n'y aurait que 4 réponses possibles (3, 5, 7, 9), sous le minimum de 5 (lot 3 bis). | `module2.json`, `notion.formes["6"].facile` | Spéc. datée | Ajouter l'exception au tableau. |
| 6.4 | Familles 1, 2, 6 et 7 : « plus dur = la moitié à trou même si elles ne sont pas ouvertes ; très dur = toutes à trou ». | C'est le comportement avec **« choisir »**. Avec « jouer », « plus dur » et « très dur » tirent la forme au hasard (un tiers chacune : **deux questions sur trois à trou**) et ajoutent des faits de la famille suivante, même non ouverte ; « très dur » mêle aussi toutes les familles ouvertes. | `module2.json`, `notion.crans` et `notion.cransChoix` ; `runner.js`, `question` | Spéc. datée | Décrire les deux colonnes (« jouer », « choisir »), comme la section 4. |
| 6.5 | Les formes à trou des familles 1, 2, 6 et 7 « s'ouvrent pour une famille » quand la moitié des faits de sa règle atteint la boîte 3. | Pour le mélange (famille 7), sa propre ouverture n'est pas lue : chaque fait reçoit des formes à trou si l'une de **ses** familles les a ouvertes. | `modules/facts/families.js`, `trouOpenFor` | À trancher | Peu d'effet (quand le mélange arrive, les autres familles ont ouvert les leurs). Écrire la règle telle qu'elle est, ou faire compter l'ouverture du mélange. |
| 6.6 | Presque-doubles : « chaque question rappelle le double ». | Seulement les questions à forme directe : sur une forme à trou, le rappel donnerait la réponse. | `modules/facts/runner.js`, `question` (`rappel`) | Spéc. datée | « Chaque question à forme directe. » |
| 6.7 | Échauffement, cran « plus facile » : « seulement des faits dus ». | Si les faits dus ne suffisent pas, au plus 3 faits nouveaux complètent la liste, puis des faits revus en avance. Sans cela, une enfant qui choisit toujours « plus facile » n'aurait aucun échauffement sur une base neuve. | `module2.json`, `crans.facile.complementMax: 3` ; `modules/facts/facts.js`, `plan` | Spéc. datée | Ajouter le complément. |
| 6.8 | Échauffement, variété : « la question suivante est la première de la file qui ne redonne pas la même réponse ». | La file n'est réordonnée qu'après **deux** réponses égales de suite : la règle est « jamais 3 fois de suite la même réponse » (lot 3 ter). Un cas sans issue reste possible : 1 échauffement sur 64 dans la simulation de l'année. | `modules/facts/warmup.js`, `varyIndex` et `vary` | Spéc. datée | « Jamais trois fois de suite la même réponse : après deux réponses égales, la première question de la file qui ne peut pas la redonner. » |
| 6.9 | Difficulté persistante : « la leçon de la famille si elle n'a pas été jouée dans la séance, puis un fait déjà bien su ». | Les maisons de 8 et 9 et les presque-doubles n'ont pas de leçon propre (seulement L6 ou L4 « si jamais vue ») : chez elles, la difficulté ne relance aucune leçon, seulement un fait bien su. | `modules/facts/runner.js`, `record` | À trancher | Relancer L6 ou L4 pour ces familles, ou écrire qu'il n'y a pas de leçon. |

## 7. Le calcul rapide (module 3)

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 7.1 | Supports : « la ligne pour les petits sauts ». | Pas de ligne graduée dans le calcul rapide : aux niveaux 1, 4, 5, 7 et 9 (support « ligne » du réglage), l'aide, les calculs guidés et les corrections montrent le **chemin** de cailloux et de ponts. | `modules/calc/screen.js`, `paintPath` et `procedure` ; `module3.json`, `support` | Spéc. datée | « Le chemin pour les petits sauts et le passage de la dizaine ; le mur pour les dizaines. » |
| 7.2 | Aide : « aux niveaux du mur (2, 3, 6) » ; « sur le chemin (7 à 9) ». | Le niveau 8 (deux nombres à deux chiffres) est sur le **mur** : aide (« Plus 30 : le poisson descend de 3 rangées »), corrections, tuile de « choisir » (lot 3 bis, B4). | `module3.json`, niveau 8, `support: "mur"` | Spéc. datée | « Mur : niveaux 2, 3, 6 et 8 ; chemin : 1, 4, 5, 7 et 9. » |
| 7.3 | Très dur : trou sur le second nombre « aux niveaux 4, 5, 7, 8, 9 ». | Le niveau 9 (retirer en passant la dizaine) n'a pas de forme à trou : « très dur » = forme directe sans chemin. Le lot 3 disait « 1 à 8 », le lot 3 bis (A2) dit que le 9 « reste possible ». | `module3.json`, niveau 9, `trou: false` | Code à revoir | Pour l'ajouter : `trou: true`, puis faire fabriquer les phrases « {a} moins combien ? Ça fait {n}. » du niveau 9 (voix). Sinon, retirer le 9 de la spécification. |
| 7.4 | Déroulé d'un nouveau niveau : « 3 calculs guidés… ; 3 calculs où le chemin n'apparaît qu'au coquillage ; **puis sans aide** ». | Après les 3 calculs guidés, le chemin reste au coquillage **pour toujours** au cran conseillé (ce que dit la ligne « Crans » de la même section) ; « sans aide », c'est le cran « plus dur ». Les 3 calculs « au coquillage » ne servent qu'à retarder la révision des niveaux acquis. | `modules/calc/runner.js`, `next` ; `module3.json`, `deroule` | Spéc. datée | « … 3 calculs guidés, puis le chemin selon le cran (conseillé : au coquillage). » |
| 7.5 | Corrections sur le chemin : « Ce n'est pas grave, regardons ensemble », « le pont en cause rejoué », la phrase de l'erreur. | Après une réponse fausse, **tout** le chemin est rejoué, pont après pont. Seule une erreur sur un caillou d'un calcul guidé rejoue le pont en cause. | `modules/calc/screen.js`, `feedback` et `bridgeFix` | Spéc. datée | « Le chemin rejoué (le pont en cause pendant un calcul guidé). » |
| 7.6 | (Correction au mur) | Une erreur non reconnue (ni C1 ni C3) au mur fait dire « Regardons le chemin ensemble. » alors que l'écran montre le mur et le poisson. | `textes.json`, `erreurCalc.autre` ; `calc/screen.js`, `feedback` | À trancher | Une phrase sans « chemin » au mur (par exemple « Hmm, regardons ensemble. », la phrase `erreur.autre` de la ligne, qui a déjà sa voix). |

## 8. Les leçons animées

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 8.1 | « Si la difficulté persiste ensuite : les questions suivantes au niveau inférieur, et la prochaine erreur corrigée plus lentement au lieu de relancer la leçon. » | Seulement à la ligne. Aux additions : un fait déjà bien su ; au calcul : une question d'un niveau acquis plus bas (ou du même niveau). Pas de correction ralentie hors de la ligne. | `numberline/runner.js` (`lower`, `slowNext`) ; `facts/runner.js` et `calc/runner.js` (`simpler`) | Spéc. datée | Dire ce que fait chaque exercice. |

## 9. Règles communes à tous les exercices

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 9.1 | « La même question revient 3 à 5 questions plus loin. » | Ligne : 3 à 5. Additions (échauffement et notion) et calcul rapide : **3**. | `numberline/runner.js` ; `facts/warmup.js`, `facts/runner.js`, `calc/runner.js` (`in: 3`) | Spéc. datée | Écrire « 3 à 5 (ligne), 3 (additions, calcul) », ou aligner le code. |
| 9.2 | « Deux séances de suite sous 50 % font redescendre d'un niveau, sans le dire. » | Seulement à la ligne. Au calcul rapide, un niveau acquis le reste (le réglage `redescente` de `module3.json` existe mais n'est pas lu) ; aux additions, une famille acquise le reste. | `numberline/runner.js`, `finish` ; `calc/runner.js`, `finish` | À trancher | Garder la redescente à la seule ligne (« on ne perd jamais rien »), et l'écrire ; ou la brancher au calcul. |
| 9.3 | Difficulté persistante (3 erreurs sur 5) : leçon, puis question plus simple. | Ligne : comptée seulement sur les questions du niveau conseillé. Un niveau choisi qui n'est pas le conseillé, ou « plus dur » et « très dur » avec « jouer », ne déclenchent ni leçon ni question plus simple (au-dessus du conseillé, la protection du cran prend le relais). Calcul : seulement sur un niveau pas encore acquis et hors cran « plus facile ». | `numberline/runner.js`, `record` ; `calc/runner.js`, `record` | À trancher | Dire si un niveau choisi doit aussi déclencher la leçon et la question plus simple. |
| 9.4 | « Réussie à son retour : “erreur corrigée”, une étoile » ; tableau des gains : « Bonne réponse, erreur corrigée : 1 étoile ». | Une question qui revient et qui est réussie rapporte **2** étoiles (1 pour la bonne réponse, 1 pour l'erreur corrigée), multipliées par le cran, dans les trois exercices et à l'échauffement. La première spécification avait deux lignes séparées. | `numberline/runner.js`, `facts/warmup.js`, `calc/runner.js` (`etoiles += 1`) | À trancher | Écrire « 2 étoiles en tout », ou revenir à 1. |

## 10. Récompenses

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 10.1 | Cadeaux de la surprise et décors : « ceux déjà gagnés restent dans les données de la tablette, mais ne sont plus montrés ». | L'espace parent, carte « Cartes », affiche encore « x / 4 cadeaux de la surprise dans le récif ». | `parent/parent.js`, `cardsBox` | Code à revoir | Retirer cette case. |
| 10.2 | Principe : « pas de gain hors séance ». | Une leçon choisie seule (accueil, ou accueil en pause) rapporte 3 étoiles, une fois par leçon et par jour, comme le dit la section 3. Dans l'entraînement libre, une leçon ne rapporte rien. | `main.js`, `lessonAlone` | Spéc. datée | Ajouter l'exception au principe (ou la retirer de la section 3). |
| 10.3 | Coquillage doré : « il passe avant les ordinaires quand il ne reste qu'une place sous le quota ». | Il passe **toujours** avant les coquillages ordinaires quand il est possible. | `session/screens.js`, `shells` | Spéc. datée | « Il passe avant les coquillages ordinaires. » |
| 10.4 | Ouverture d'une zone : « ouverte par une étoile arc-en-ciel à la récompense (l'étoile vole vers l'album) ». | L'étoile vole jusqu'au dos assombri de la zone, qui s'éclaire ; la voix annonce la zone ; puis ce dos file vers l'album. | `session/screens.js`, `zoneCeremony` | Spéc. datée | Décrire la scène telle qu'elle est. |

## 11. L'univers, la voix et le son

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 11.1 | Mascotte : « déception bienveillante à la première erreur d'une question, puis encouragement ». | La déception est jouée à la première erreur **depuis la dernière réussite** : deux erreurs de suite sur deux questions différentes donnent la déception, puis l'encouragement. Le compteur n'est remis à zéro que par une réussite, pas par une question nouvelle. | `engine/mascotte.js`, `play` (`erreurs`) | À trancher | Écrire « après une réussite, la première erreur déçoit, les suivantes encouragent », ou remettre le compteur à zéro à chaque question (à faire dans la maquette `art/mascotte/`, puis à reporter). |
| 11.2 | Musique « pas dans le récif, l'album ». | Voir 2.4. | — | À trancher | — |

## 12. L'espace parent

| N° | Règle | Ce que fait l'application | Où | Qualification | Proposition |
| --- | --- | --- | --- | --- | --- |
| 12.1 | Point de départ : « niveau … du calcul rapide 1 à 9 ». | Les niveaux d'avant sont comptés **acquis** (sans étoile) et le niveau choisi devient le conseillé, même si les additions qui le débloquent ne sont pas encore sues. | `parent/depart.js`, `setCalcLevel` | Spéc. datée | Écrire ce qui se passe. |
| 12.2 | Point de départ : « familles connues 1 à 7 : leurs faits passent en boîte 3 ». | Les familles jusqu'à la famille marquée sont aussi **ouvertes** ; si toutes les familles ouvertes sont alors acquises, la suivante s'ouvre aussitôt (pour que la notion du jour ne reprenne pas une famille sue). | `parent/depart.js`, `markFamilyKnown` | Spéc. datée | Écrire ce qui se passe. |
| 12.3 | Cadeaux de la surprise | Voir 10.1. | — | Code à revoir | — |

## 13. Ce qui reste à construire

Rien à confronter (tout y est à construire).

## 14. Recette

Aucun écart. Les outils cités existent et passent : `b-sequences.mjs --test`, 0 séance en défaut ; `sim-seances.mjs`, voir la synthèse.

## Ce que l'application fait et que la spécification ne dit pas

Comportements visibles pour l'enfant ou le parent, à ajouter à `docs/SPEC.md` si le parent les garde.

**Séance**

1. **« Réécouter » à l'accueil et en pause** : il dit ce qu'on peut faire (« Touche une bulle : jouer, choisir, le récif ou l'album. », « C'est la pause. Touche la grande bulle pour continuer. »).
2. **Le plafond** : plus aucune nouvelle question 60 s avant le plafond (le temps de la récompense) ; une étape pas encore commencée quand le temps est écoulé est sautée (`seance.json`, `reserveRecompenseS`).
3. **La notion du jour s'arrête d'elle-même** quand plus aucune question ne respecte « pas plus de 3 fois la même question », ce qui peut écourter la séance (voir 2.5).
4. **La frise** ne montre le défi que s'il aura lieu, et l'échauffement seulement s'il est prévu ; le pictogramme de la notion du jour change selon l'exercice (ligne, « + », mur de corail).
5. **Rotation de « jouer »** : « le moins avancé » se mesure à la part du parcours faite (ligne : niveau atteint sur 13 ; additions : familles acquises sur 7 ; calcul : niveaux acquis sur 9) ; à égalité, l'ordre ligne, additions, calcul ; « la dernière » est la dernière séance terminée, une séance d'exercice choisi comprise.
6. **Le module imposé** par le parent est consommé dès qu'une séance « jouer » commence, même si elle est ensuite interrompue.

**Sélecteur et écran « choisir »**

7. **Sélecteur** : toucher une vague dit ce qu'elle rapporte (« Plus dur : une étoile et demie par bonne réponse ! ») ; une grosse coche valide ; si le parent n'autorise qu'un cran, l'écran n'apparaît pas ; si le conseillé est interdit, le cran de départ est le plus proche autorisé.
8. **Écran « choisir »** : à l'étape des niveaux, une petite bulle (l'image de l'exercice) ramène au choix de l'exercice ; la maison ramène à l'accueil sans rien lancer.

**Exercices**

9. **Exemples guidés** : 1 étoile s'ils sont réussis ; ils ne comptent ni pour l'adaptation ni pour le taux de la séance.
10. **Ligne** : 3 propositions aux niveaux 1 et 2, 4 ensuite ; une leçon jouée pendant la séance est suivie de « À toi ! » et d'un exemple guidé au format « lire » ; toute correction finit par « C'était 7. ».
11. **Additions, notion du jour** : un fait nouveau une question sur deux de la famille, tant que la limite le permet ; le coquillage d'aide existe aussi à l'échauffement ; à l'échauffement, la correction est seulement « 3 plus 4, ça fait 7 » (l'appui de la famille n'est montré qu'en notion du jour).
12. **Échauffement** : la toute première fois, « Tape la réponse, puis touche la coche verte. » ; 3 questions « a + 0 » au premier échauffement, puis 1 une séance sur cinq ; s'il manque des faits dus, des faits nouveaux, puis des faits revus en avance, puis un second passage des faits de la boîte 1.
13. **Défi** : 1 étoile par bonne réponse (multipliée par le cran) en plus des 5 du record ; des formes à trou peuvent y être posées (amis de 10 toujours à trou, maisons en partie) ; après une erreur, la bonne réponse reste écrite un instant pendant que le temps continue ; phrases du premier record (« C'est ton premier record ! ») et d'un score nul (« Ce n'est pas grave, on réessaiera la prochaine fois ! »).
14. **Calcul rapide** : avec « jouer », une question sur cinq dans un niveau déjà acquis, une fois les calculs guidés du nouveau niveau faits (`melange: 0.2`) ; aux crans « plus dur » et « très dur », pas de coquillage d'aide ; juste mais lent : « Bravo ! Regarde le raccourci. ».
15. **Pavé** : deux rangées (0 à 4, 5 à 9), « effacer » et la coche verte ; la réponse part à la coche.

**Récompenses**

16. **Ordre de la récompense** : bilan des étoiles, 10 étoiles de la séance, série, étoile dorée, étoiles arc-en-ciel, ouverture de zone, coquillage doré, coquillages ordinaires.
17. **Le coquillage s'ouvre seul** au bout de 9 s si l'enfant ne le touche pas ; la carte se range seule après 20 s ; une carte nouvelle est suivie de son anecdote et de « Cette créature va vivre dans ton récif ! ».
18. **Entraînement libre** : une musique y joue ; une leçon y est vue sans étoiles ; une famille acquise y donne aussi son étoile arc-en-ciel, remise à la séance suivante ; après 10 minutes, la phrase est « Tu t'entraînes depuis longtemps ! Tu peux t'arrêter quand tu veux : touche la maison. » (une fois).

**Espace parent**

19. **Code** : après 5 codes faux, 30 secondes d'attente ; un réglage « Changer le code ».
20. **Stockage** : un réglage « Données protégées » qui dit si le stockage persistant est accordé, avec « Demander à nouveau ».
21. **Historique des séances** : pour chaque séance, ses étapes et leur durée, les leçons (vues, passées, arrêtées), le cran choisi et ses descentes, les pauses, la raison d'une interruption, les cartes gagnées et chaque réponse ; une leçon choisie seule et l'entraînement libre y figurent, hors du calendrier.
22. **Le trésor de l'enfant** : étoiles gagnées depuis le début, étoiles à dépenser, coquillages ouverts, longueur de la série.
23. **Cartes** : cartes nouvelles encore gagnables d'ici dimanche, prochaine étoile dorée, étoiles arc-en-ciel en réserve et ce qu'attend la zone suivante.
24. **Familles d'additions** : le tableau montre pour chacune son ouverture (date, « par l'échauffement », « parent »), ses faits bien sus, son acquisition et ses formes à trou ; le temps de base et le seuil « rapide » sont écrits en clair.
