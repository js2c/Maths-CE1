# Maquette — réserves d'étoiles et étoiles arc-en-ciel (en attente de la validation du parent)

Lot « Réserves d'étoiles et étoiles arc-en-ciel » (`docs/LOTS.md`, fiche 16 ; décisions du parent du 2 novembre 2026). Point d'arrêt « maquette » : rien n'est encore changé sous `app/`. La maquette se pose sur l'application elle-même (sa mascotte, sa bulle, sa boutique, ses dessins) : `art/reserves/` (son `README.md`).

Les captures sont en 1280 × 800 (`*-1280.png`) et sur le petit smartphone du banc Android (`*-petit-smartphone.png`, 640 × 360, densité 2). Dans les captures, la bulle écrit les phrases nouvelles : elles ne sont pas encore fabriquées.

## 1. Les réserves, près du compteur

| Capture | Ce qu'on voit |
| --- | --- |
| `01-compteur-deux-reserves` | à droite du compteur d'étoiles de mer, l'étoile arc-en-ciel (4) et l'étoile de diamant (2), chacune avec son nombre dessous |
| `02-reserve-arc-touchee` | l'étoile arc-en-ciel touchée : « Tu as 4 étoiles arc-en-ciel. Elles ouvrent les nouvelles zones du récif, et font briller tes créatures. » |
| `03-reserve-diamant-touchee` | l'étoile de diamant touchée : « Tu as 2 étoiles de diamant. Elles t'offriront les créatures légendaires, quand tu auras toutes les créatures du grand large. » |
| `04-compteur-une-seule-reserve` | pas d'étoile de diamant : sa réserve n'est pas montrée |
| `05-pendant-un-exercice` | les réserves restent là où est le compteur (ici, le choix du cran au début d'un exercice) |

- **Où** : partout où le compteur d'étoiles est affiché (l'accueil, les exercices, la récompense, la boutique) ; ni dans le récif vivant ni pendant une leçon, où le compteur est caché. Une réserve à 0 n'est pas montrée ; s'il n'y a que les étoiles de diamant, leur réserve prend la première place.
- **Taille** : deux cases de 68 × 100 px (cibles d'au moins 64 px), l'étoile en haut, le nombre dessous, à droite du compteur. Dans l'étal par temps d'orage, comme le compteur, elles sont posées sur une plaque claire.
- **Les dessins** : ceux de l'atelier, déjà dans l'application (`etoile.arc`, `etoile.diamant`) ; rien de nouveau à dessiner.
- **Toucher une réserve** : elle sautille, la mascotte dit combien il y en a et ce qu'elles débloquent. La bulle part de la mascotte et évite la réserve touchée (`engine/bulle.js`, `eviter`, comme pour la lune) : elle ne couvre jamais ce que l'enfant touche. Ce n'est pas une consigne : toucher la mascotte redit toujours la consigne de l'écran.

**Ce que dit la mascotte**, selon l'état :

| Réserve | État | Phrases |
| --- | --- | --- |
| arc-en-ciel | des zones encore fermées, au moins une étoile à dépenser | « Tu as 4 étoiles arc-en-ciel. Elles ouvrent les nouvelles zones du récif, et font briller tes créatures. » |
| arc-en-ciel | des zones encore fermées, toutes les étoiles gardées (section 2) | « Tu as une étoile arc-en-ciel. Elle ouvrira la prochaine zone du récif. » ; « Tu as 2 étoiles arc-en-ciel. Elles ouvriront les prochaines zones du récif. » |
| arc-en-ciel | toutes les zones ouvertes | « Tu as une étoile arc-en-ciel. Elle fait briller une créature, à la boutique. » ; « Tu as 5 étoiles arc-en-ciel. Elles font briller tes créatures, à la boutique. » |
| arc-en-ciel | la zone en cours est complète (une zone va s'ouvrir) | la phrase de l'état, puis « Une nouvelle zone va bientôt s'ouvrir. » (elle existe déjà) |
| diamant | une légendaire peut sortir à la prochaine récompense | « Tu as une étoile de diamant. À la fin de ta prochaine séance, une étoile de diamant t'offrira une créature légendaire ! » |
| diamant | pas encore | « Tu as 2 étoiles de diamant. Elles t'offriront les créatures légendaires, quand tu auras toutes les créatures du grand large. » (ou « des abysses », quand les deux légendaires du grand large sont là) ; au singulier : « Elle t'offrira une créature légendaire, quand… » |
| diamant | toutes les légendaires sont dans le récif | « Tu as 3 étoiles de diamant. Tu as déjà toutes les créatures légendaires ! » |

Les nombres sont dits de 1 à 50 (arc-en-ciel) et de 1 à 15 (diamant) ; au-delà : « Tu as beaucoup d'étoiles arc-en-ciel. » (la simulation donne au plus 44 étoiles arc-en-ciel et 8 étoiles de diamant gagnées en une année ; le nombre reste écrit).

## 2. Faire briller avec une étoile arc-en-ciel

### La règle proposée : une étoile arc-en-ciel gardée par zone encore fermée

Une étoile arc-en-ciel peut faire briller une créature du récif seulement s'il en reste **plus que de zones encore fermées** : au début de l'année, 3 sont gardées (le récif de corail, le grand large, les abysses) ; après l'ouverture du récif de corail, 2 ; puis 1 ; quand les abysses sont ouvertes, aucune. La tuile le montre (l'étoile arc-en-ciel et un cadenas) et la mascotte le dit (capture `09`).

**Pourquoi elle garantit que l'ouverture d'une zone n'est jamais retardée.** Comparons, à chaque instant, la réserve de l'enfant (R′) à celle qu'elle aurait si elle n'avait jamais fait briller avec ses étoiles arc-en-ciel (R). La règle maintient R′ ≥ le plus petit de R et du nombre de zones fermées (Z) :

- gagner une étoile ajoute 1 aux deux : l'inégalité reste vraie ;
- faire briller n'est permis que si R′ > Z : après, R′ ≥ Z, donc encore ≥ min(R, Z) ;
- ouvrir une zone retire 1 à R′, à R et à Z : l'inégalité reste vraie.

Quand une zone peut s'ouvrir, Z vaut au moins 1 : si l'enfant avait eu une étoile sans la règle (R ≥ 1), elle en a une avec (R′ ≥ 1). Elle s'ouvre donc à la même récompense qu'avant le lot.

**Pourquoi pas une seule étoile gardée** (la règle donnée en exemple par le parent) : elle ne le garantit pas. Après l'ouverture d'une zone, l'étoile gardée est dépensée et la réserve peut tomber à 0 ; si la zone suivante est complète avant qu'une nouvelle étoile soit gagnée (en fin d'année, quand les niveaux franchis se raréfient), elle attend, alors que sans « faire briller » l'enfant aurait eu des étoiles en réserve. Dans la simulation d'une année, les deux règles ouvrent les zones aux mêmes dates (tableau ci-dessous) : l'écart ne se voit que dans ce cas rare ; il ne coûte que 2 étoiles arc-en-ciel gardées de plus en début d'année, rendues à l'ouverture des zones.

**Simulation** (`tests/sim-boutique.mjs --prix 2 --arc aucun,un,zones` ; une année, prix pour 2 séances, mode Arrivages, le grand large prêt le 1er février et les abysses le 26 avril ; « aucun » : comme aujourd'hui). Les dates d'ouverture des zones ne sont jamais plus tardives avec la règle proposée que sans « faire briller » (les petits écarts du profil `diff` à 4 séances viennent du hasard : une même graine, mais une boutique différente change la suite des tirages des séances) :

| Profil | Séances par semaine | Règle | Arc-en-ciel gagnées | pour les zones | pour faire briller | restantes | Zones ouvertes (corail, large, abysses) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| reel | 2 | aucun / un / zones | 37 | 3 | 0 / 34 / 34 | 34 / 0 / 0 | 07/12, 04/02, 26/04 (les trois) |
| reel | 3 | aucun / un / zones | 44 | 3 | 0 / 29 / 29 | 41 / 12 / 12 | 02/12, 03/02, 26/04 (les trois) |
| reel | 4 | aucun / un / zones | 43 | 3 | 0 / 23 / 23 | 40 / 17 / 17 | 01/12, 02/02, 26/04 (les trois) |
| sait | 2 | aucun / un / zones | 43 | 3 | 0 / 35 / 35 | 40 / 5 / 5 | 03/12, 22/02 / 04/02 / 04/02, 26/04 |
| diff | 2 | aucun / un / zones | 15 | 3 | 0 / 12 / 12 | 12 / 0 / 0 | 10/12, 08/03, 13/05 (les trois) |
| diff | 3 | aucun / un / zones | 21 | 3 | 0 / 18 / 18 | 18 / 0 / 0 | 02/12, 05/02, 26/04 (les trois) |
| diff | 4 | aucun / un / zones | 32 / 27 / 26 | 3 | 0 / 21 / 20 | 29 / 3 / 3 | 01/12 ; 04/02, 02/02, 04/02 ; 26/04 |

(Dans la simulation, l'enfant dépense ses étoiles arc-en-ciel dès qu'elle le peut, les rares d'abord, et garde ses étoiles de mer pour les créatures nouvelles. Les étoiles « restantes » à 3 et 4 séances par semaine : toutes les créatures qui peuvent briller brillent déjà ; les légendaires ne se font pas briller.)

**Un effet à connaître** : faire briller avec une étoile arc-en-ciel, c'est autant d'étoiles de mer gardées pour les créatures nouvelles. Aux prix d'origine, à 3 séances par semaine, la vitrine sans rien de nouveau passe de 52 à 67 séances sur 96 (profil `reel`) ; à 2 séances par semaine, rien ne change (10 sur 64). Au niveau de prix qui correspond au rythme, le tableau complet est à la section 4.

### À l'écran

| Capture | Ce qu'on voit |
| --- | --- |
| `06-boutique-deux-facons` | le crabe, déjà dans le récif, touché ; 260 étoiles et une étoile arc-en-ciel à dépenser : la tuile porte l'étoile arc-en-ciel dans son coin ; sous elle, la croix, la coche de l'étoile de mer et la coche de l'étoile arc-en-ciel. « C'est le crabe ! Cette créature est déjà dans ton récif. Pour la faire briller, il faut 150 étoiles. Ou bien une étoile arc-en-ciel ! Touche la coche de l'étoile que tu veux donner. » |
| `07-boutique-briller-arc-vol` | la coche arc-en-ciel touchée : l'étoile part de sa réserve (4 devient 3) et vole jusqu'à la tuile ; puis la gerbe, le reflet, « C'est le crabe ! Oh ! Elle est brillante ! », comme « faire briller » aujourd'hui |
| `08-boutique-arc-seule` | pas assez d'étoiles de mer (60) : la seule coche arc-en-ciel. « … Pour la faire briller, il faut 150 étoiles. Ou bien une étoile arc-en-ciel ! Si tu es d'accord, touche la coche verte. » (pas de « Il te manque … ») |
| `09-boutique-etoile-gardee` | 2 étoiles arc-en-ciel, 3 zones fermées : toutes gardées. La tuile porte l'étoile arc-en-ciel pâlie et un cadenas ; une seule coche, celle des étoiles de mer. « … Pour la faire briller, il faut 150 étoiles. Tes étoiles arc-en-ciel sont gardées pour ouvrir les nouvelles zones. Si tu es d'accord, touche la coche verte. » |

- **Les deux coches** : la coche verte de la boutique, chacune portant dans son coin ce qu'on donne (l'étoile de mer, l'étoile arc-en-ciel). Seules les coches achètent, comme aujourd'hui ; la croix, ou un toucher ailleurs, annule. Une étoile arc-en-ciel fait briller une commune comme une rare.
- **La rangée de coches** se pose à côté du départ de la bulle (à droite du milieu de la tuile, ou à gauche près du bord droit), pour que la pointe de la bulle ne passe sur aucune d'elles.
- **L'achat** suit les règles d'aujourd'hui : enregistré avant l'animation, en une seule écriture, jamais à moitié ni deux fois ; une brillante le reste. Le journal des achats de l'espace parent note « 1 étoile arc-en-ciel » à la place du prix.
- **Le compteur d'étoiles de mer** ne bouge pas : seule la réserve arc-en-ciel descend, d'un cran, quand son étoile s'envole.

## 3. La récompense

| Capture | Ce qu'on voit |
| --- | --- |
| `10-recompense-vol-vers-les-reserves` | le bilan ; « 2 étoiles arc-en-ciel ! Un jour, elles t'ouvriront un nouveau coin du récif. » : les deux étoiles volent jusqu'à leur réserve, et l'étoile de diamant (montrée en grand, comme aujourd'hui, pendant « Et une étoile de diamant ! … ») jusqu'à la sienne |
| `11-recompense-reserves-a-jour` | les réserves à jour (3 + 2 = 5 ; 1 + 1 = 2) |

- Chaque étoile qui arrive fait sautiller sa réserve, qui avance d'un cran (comme le compteur d'étoiles de mer). La réserve apparaît à l'arrivée de la première étoile.
- **L'album n'est plus posé en bas à droite pendant le vol** (décision 8 du 13 octobre 2026, constat 15 de l'agent : l'étoile filait vers un coin vide) : la réserve, visible, est maintenant sa destination.
- **L'ouverture d'une zone** : l'étoile arc-en-ciel part de sa réserve (qui descend d'un cran) et vole jusqu'au dos assombri de la zone, au lieu de monter du bas de l'écran. **Le coquillage de diamant** : l'étoile de diamant part de sa réserve jusqu'au coquillage.
- **Quand toutes les zones sont ouvertes**, la phrase de la récompense s'arrête à « Et une étoile arc-en-ciel ! » (« Un jour, elle t'ouvrira un nouveau coin du récif » ne serait plus vrai) : une phrase qui existe déjà.

## 4. Simulation de l'année, chaque niveau de prix

`node tests/sim-boutique.mjs` : une année (du 28 septembre 2026 au 2 juillet 2027), mode Arrivages, le grand large prêt le 1er février et les abysses le 26 avril, la règle proposée ; l'enfant dépense ses étoiles arc-en-ciel dès qu'elle le peut. Pour l'instant, le paiement en étoile arc-en-ciel est imité par la simulation (`tests/sim-recette.mjs`, `arcBriller`) ; le tableau sera refait avec le code de l'application pour la demande de fusion.

| Prix pour | Profil | Séances par semaine | Créatures (sur 60) | Collection complète | Séances sans rien de nouveau | Arc-en-ciel gagnées | pour les zones | pour faire briller | restantes | Diamant gagnées | utilisées | Zones ouvertes (corail, large, abysses) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 séances | reel | 2 | 60 | 14/06/2027 | 10/64 | 37 | 3 | 34 | 0 | 8 | 5 | 07/12, 04/02, 26/04 |
| 2 séances | reel | 3 | 60 | 24/05/2027 | 67/96 | 44 | 3 | 29 | 12 | 8 | 5 | 02/12, 03/02, 26/04 |
| 2 séances | reel | 4 | 60 | 21/05/2027 | 100/128 | 43 | 3 | 23 | 17 | 8 | 5 | 01/12, 02/02, 26/04 |
| 2 séances | sait | 2 | 60 | 27/05/2027 | 33/64 | 43 | 3 | 35 | 5 | 8 | 5 | 03/12, 04/02, 26/04 |
| 2 séances | sait | 3 | 60 | 24/05/2027 | 67/96 | 43 | 3 | 25 | 15 | 8 | 5 | 02/12, 03/02, 26/04 |
| 2 séances | sait | 4 | 60 | 21/05/2027 | 100/128 | 43 | 3 | 21 | 19 | 8 | 5 | 01/12, 02/02, 26/04 |
| 2 séances | diff | 2 | 60 | 01/07/2027 | 3/64 | 15 | 3 | 12 | 0 | 8 | 5 | 10/12, 08/03, 13/05 |
| 2 séances | diff | 3 | 60 | 28/05/2027 | 45/96 | 21 | 3 | 18 | 0 | 8 | 5 | 02/12, 05/02, 26/04 |
| 2 séances | diff | 4 | 60 | 28/05/2027 | 83/128 | 26 | 3 | 20 | 3 | 8 | 5 | 01/12, 04/02, 26/04 |
| 3 séances | reel | 2 | 40 | non | 0/64 | 35 | 2 | 31 | 2 | 8 | 0 | 21/01, 10/05, — |
| 3 séances | reel | 3 | 60 | 25/06/2027 | 6/96 | 46 | 3 | 40 | 3 | 8 | 5 | 11/12, 05/03, 10/05 |
| 3 séances | reel | 4 | 60 | 21/05/2027 | 93/128 | 44 | 3 | 39 | 2 | 8 | 5 | 01/12, 02/02, 26/04 |
| 3 séances | sait | 2 | 50 | non | 0/64 | 43 | 3 | 33 | 7 | 8 | 2 | 14/01, 19/04, 17/06 |
| 3 séances | sait | 3 | 60 | 24/05/2027 | 43/96 | 43 | 3 | 33 | 7 | 8 | 5 | 04/12, 03/02, 26/04 |
| 3 séances | sait | 4 | 60 | 21/05/2027 | 97/128 | 43 | 3 | 28 | 12 | 8 | 5 | 01/12, 02/02, 26/04 |
| 3 séances | diff | 2 | 33 | non | 0/64 | 16 | 2 | 13 | 1 | 8 | 0 | 22/02, 24/06, — |
| 3 séances | diff | 3 | 49 | non | 0/96 | 18 | 3 | 15 | 0 | 8 | 2 | 11/01, 19/04, 21/06 |
| 3 séances | diff | 4 | 60 | 24/06/2027 | 9/128 | 24 | 3 | 21 | 0 | 8 | 5 | 10/12, 01/03, 30/04 |
| 4 séances | reel | 2 | 29 | non | 0/64 | 35 | 1 | 20 | 14 | 8 | 0 | 11/03, —, — |
| 4 séances | reel | 3 | 43 | non | 0/96 | 44 | 2 | 30 | 12 | 8 | 0 | 15/01, 30/04, — |
| 4 séances | reel | 4 | 60 | 24/06/2027 | 8/128 | 44 | 3 | 36 | 5 | 8 | 5 | 15/12, 11/03, 11/05 |
| 4 séances | sait | 2 | 35 | non | 0/64 | 43 | 2 | 27 | 14 | 8 | 0 | 22/02, 10/06, — |
| 4 séances | sait | 3 | 54 | non | 0/96 | 43 | 3 | 33 | 7 | 8 | 2 | 06/01, 24/03, 02/06 |
| 4 séances | sait | 4 | 60 | 27/05/2027 | 37/128 | 43 | 3 | 38 | 2 | 8 | 5 | 04/12, 05/02, 26/04 |
| 4 séances | diff | 2 | 25 | non | 0/64 | 14 | 1 | 11 | 2 | 8 | 0 | 22/04, —, — |
| 4 séances | diff | 3 | 36 | non | 0/96 | 21 | 2 | 18 | 1 | 8 | 0 | 05/02, 07/06, — |
| 4 séances | diff | 4 | 42 | non | 0/128 | 27 | 2 | 24 | 1 | 8 | 0 | 08/01, 20/04, — |

**Ce qu'il montre.**

- **Au niveau qui correspond au rythme** (prix pour 2 à 2 séances, pour 3 à 3, pour 4 à 4), le profil `reel` garde le calibrage du lot précédent : 10 séances sur 64 sans rien de nouveau, collection complète le 14 juin (inchangé) ; 6 sur 96, le 25 juin (5 sur 96, le 28 juin, sans les étoiles arc-en-ciel) ; 8 sur 128, le 24 juin (7 sur 128, le 25 juin). Faire briller avec les étoiles arc-en-ciel laisse un peu plus d'étoiles de mer pour les créatures nouvelles : l'effet est faible là où les prix suivent le rythme.
- **Les étoiles arc-en-ciel servent** : à ces niveaux, 34, 40 et 36 font briller une créature (sur 37 à 46 gagnées) ; il en reste 0 à 5 en fin d'année. Celles qui restent ailleurs : toutes les créatures qui peuvent briller brillent déjà, ou la collection n'est pas complète (moins de créatures à faire briller).
- **Les étoiles de diamant** : 8 gagnées dans l'année ; 5 utilisées quand la collection est complète (les 5 légendaires), moins sinon (une légendaire attend que toute sa zone soit dans le récif).
- **L'enfant en difficulté** à 3 séances par semaine : aucun niveau n'est juste (comme au lot précédent ; pas de niveau intermédiaire, décision du parent).

## 5. Les décisions du parent sur le lot « Prix de la boutique réglables »

- **Le changement de prix annoncé** : à la première visite de la boutique qui suit un changement du niveau de prix, après la bienvenue ou l'annonce des arrivées, « Les prix de la boutique ont changé ! », une seule fois, sans explication. Le changement est noté quand le parent choisit le niveau ; une sauvegarde d'avant le lot n'annonce rien.
- **Pas de niveau intermédiaire** pour l'enfant en difficulté à 3 séances par semaine (noté dans `docs/IDEES.md`, à rouvrir si une collection prend du retard).
- **« Il te manque N étoiles. »** reste dit de 1 à 299 ; au-delà, le prix seul.

## 6. Les phrases nouvelles à fabriquer

**83 phrases, environ 0,9 Mo** (estimation : la taille moyenne des fichiers de la voix selon la longueur du texte). La voix pèse aujourd'hui 81,3 Mo ; avec elles, environ **82,2 Mo**, sous la limite de 85 Mo.

- « Tu as une étoile arc-en-ciel. », « Tu as 2 étoiles arc-en-ciel. » … « Tu as 50 étoiles arc-en-ciel. », « Tu as beaucoup d'étoiles arc-en-ciel. » (51)
- « Elles ouvrent les nouvelles zones du récif, et font briller tes créatures. », « Elle ouvrira la prochaine zone du récif. », « Elles ouvriront les prochaines zones du récif. », « Elle fait briller une créature, à la boutique. », « Elles font briller tes créatures, à la boutique. » (5)
- « Tu as une étoile de diamant. », « Tu as 2 étoiles de diamant. » … « Tu as 15 étoiles de diamant. », « Tu as beaucoup d'étoiles de diamant. » (16)
- « Tu as déjà toutes les créatures légendaires ! », « À la fin de ta prochaine séance, une étoile de diamant t'offrira une créature légendaire ! », « Elle t'offrira une créature légendaire, quand tu auras toutes les créatures du grand large. », « Elles t'offriront les créatures légendaires, quand tu auras toutes les créatures du grand large. », les deux mêmes avec « des abysses » (6)
- « Ou bien une étoile arc-en-ciel ! », « Touche la coche de l'étoile que tu veux donner. », « Ton étoile arc-en-ciel est gardée pour ouvrir une nouvelle zone. », « Tes étoiles arc-en-ciel sont gardées pour ouvrir les nouvelles zones. » (4)
- « Les prix de la boutique ont changé ! » (1)

Réutilisées, sans fabrication : « Une nouvelle zone va bientôt s'ouvrir. », « Si tu es d'accord, touche la coche verte. », « C'est le crabe ! Oh ! Elle est brillante ! », « Et une étoile arc-en-ciel ! ».

## 7. Questions, chacune avec sa valeur par défaut

1. **Les réserves pendant les exercices** : montrées et touchables partout où est le compteur (la demande du parent). Le risque : un toucher au milieu d'une question fait parler la mascotte d'autre chose. Par défaut : partout ; autre possibilité : seulement à l'accueil, à la récompense et à la boutique.
2. **Le prix d'une étoile arc-en-ciel** : une étoile, pour une commune comme pour une rare. Par défaut : une.
3. **La règle de réserve** : une étoile gardée par zone encore fermée (section 2). Autre possibilité : une seule étoile gardée, plus simple à dire mais sans garantie stricte.
4. **Les légendaires du récif** ne se font pas briller (ni aujourd'hui avec les étoiles de mer, ni avec une étoile arc-en-ciel). Par défaut : pas de changement.
5. **Les étoiles de diamant en trop** : la simulation en donne 8 par an pour 5 légendaires ; les 3 dernières ne servent à rien (« Tu as déjà toutes les créatures légendaires ! »). Rien n'est demandé sur ce point : par défaut, rien ne change ; à noter dans `docs/IDEES.md`.
