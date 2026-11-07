# Recette du lot « Mise en scène des problèmes »

Faite sur la branche `claude/sweet-davinci-vwkk2u` (demande de fusion #76), mise à jour avec `main` (PR #77 fusionnée), avec les images déposées par le parent le 7 novembre (22 lieux, 136 objets et unités). Sur le banc Android (méthode commune, `docs/LOTS.md`), chaque parcours l'un après l'autre, rien d'autre de lourd en même temps.

## Technique

| Contrôle | Résultat |
| --- | --- |
| `npm test` | 476 tests sur 477 ; le seul échec : les 3 phrases sans fichier son du lot (`PHRASES.md`) |
| `node tools/precache.mjs --check` | à jour (13 211 fichiers) |
| `node art/problemes/verifier.mjs` | banque conforme (200 énoncés ; les scènes, `unite` et `unites` contrôlées) |
| Tous les parcours (`tests/e2e/tous.mjs`) | **avant la mise à jour avec `main`** : tous passent, sauf `multiplication` et `voiliers`, deux défauts des parcours, corrigés (ci-dessous) ; **après** : relancés ceux que le lot et la fusion touchent : `choix`, `consignes-mascotte`, `correctifs-5-novembre`, `crans`, `lecons`, `lecons-menu`, `problemes`, `seance`, `suites-5-novembre` : tous passent |
| Le parcours du lot (`tests/e2e/problemes.mjs`) | passe en 1280 × 800 et 1920 × 1200, et à 640 × 360 (le petit smartphone, partie 10) ; relancé après les corrections de la relecture, puis après les décisions du parent du 7 novembre (la plaque, l'écart ; contrôles ajoutés) : passe |
| Journée d'usage courte, tablette de référence (`journee.mjs --court`) | **aucun défaut en 55,1 min** (l'installation, les séances avec le problème du jour, les leçons, la boutique, le récif, l'album, les inactivités, l'arrière-plan ; aucune erreur de page, aucun lecteur refusé, budgets tenus) |
| Enfant imprévisible sur le banc (`enfant.mjs --android`) | 5 graines, 400 actions, aucun défaut ; après les corrections de la relecture, 3 graines, 240 actions, aucun défaut ; après les décisions du parent du 7 novembre, 2 graines, 160 actions, aucun défaut |
| Taille des cibles (`cibles.mjs --profils s5e,petit-smartphone`) | s5e : problèmes 11,7 mm, partage 11,3 mm (au moins 9 mm), les autres écrans 15,2 à 17,7 mm ; petit-smartphone : la scène entière, aucune erreur de page |
| Temps d'image (`perf.mjs --niveau 2`, processeur ÷4) | avant (`main`) : intervalle moyen 19,6 ms, travail par image 0,3 ms ; après : 23,3 ms, 0,4 ms ; démarrage à chaud 4,2 s et 4,6 s ; même mémoire des planches (63,9 Mo) : pas d'écart au-delà du bruit de la mesure. (Le démarrage « à froid » de `main`, 10,6 s, était le premier lancement de la série, disque froid ; 4,9 s sur la branche.) |
| Tests de GitHub | `tests`, `enfant` et `android` réussis sur le code d'avant la relecture ; relancés à la poussée |

**Les parcours corrigés pendant la recette** (chaque échec a sa cause ; aucun relancé jusqu'à ce qu'il passe) :

- `multiplication` : une question 1 × 2 tirée au hasard ; l'aide de la coquille n'y dit pas de total, et le parcours l'attendait. Il ne l'attend plus que pour plus d'un groupe ; la relance a tiré 1 × 2 et passé.
- `voiliers` (et `choix`, `etal`, `lecons-menu`, `lecons-monnaie`, `maison-correction`) : lancé à 0 h 05, la séance préparée par le parent de test datait de la veille (10 minutes avant) ; l'application, à juste titre, ne la reprenait pas. La séance préparée commence désormais le jour même.

**Un défaut de l'application trouvé par l'enfant imprévisible des tests de GitHub** (7 novembre, graine 1 ; non reproduit d'abord ici en trois essais, ni avec les images ralenties) : « à l'accueil : hud probleme-cadre ». **Cause** : la leçon L19 pose sa scène, qui charge ses images ; quittée par la maison pendant ce chargement, la leçon nettoyait l'écran sans changer son jeton : le chargement fini posait le cadre des problèmes sur l'accueil. Reproduit 3 fois sur 3 par un essai ciblé (les images retardées de 3 s, la maison touchée 0,2, 0,6 et 1,2 s après le début) ; **corrigé** (`lessons/problemes.js`, `clear` : le jeton de l'écran change), puis 0 sur 3 ; gardé par le parcours `problemes.mjs`, partie « 8 bis ».

## Fonctionnelle

| Contrôle | Résultat |
| --- | --- |
| `b-sequences.mjs --test` | 288 combinaisons, 1 152 séances, **0 en défaut** |
| Simulation de l'année (`sim-seances.mjs`, profils `sait`, `reel`, `diff`, 4 séances par semaine) | inchangée par le lot (la banque garde ses énoncés et ses réponses) : collection complète les 21, 21 et 25 mai 2027 |
| Séance à vitesse réelle (`recette.mjs --delai 4.5`) | sans erreur, aucune phrase sans fichier (17,3 min jouées, avec le problème du jour) |
| Les attentes (`recette-durees.mjs`, avec et sans `--passer`) | sans défaut, aucune phrase sans fichier ; avec « passer », le pavé revient en 0,6 s après l'aide (l'outil ne mesure pas les problèmes : leurs attentes sont celles de `problemes.mjs`) |

## Le contrôle des images du parent

`docs/maquettes/problemes-scene/CONTROLE-IMAGES.md` : aucun fichier non reconnu, aucune image manquante ; détourage propre (ni vert, ni magenta, ni liseré, ni trou, rien d'effacé), le sol entier de chaque lieu, l'échelle cohérente. **`u-perle`**, dont le prompt était faux, a été refaite par le parent avec le prompt corrigé, puis déposée et contrôlée : plus aucune image à refaire. Les 15 écrans de la maquette repris dans l'application avec les vraies images : `docs/maquettes/problemes-scene/vraies/`, et à côté des captures provisoires : `comparaison/`.

## Relecture indépendante

`RELECTURE.md` (ce dossier) : **rien de bloquant** ; 7 constats gênants, 3 cosmétiques. Corrigés : 1, 2, 4, 5 ; 6 en partie ; 3 et 7 après les décisions du parent du 7 novembre (la plaque montre l'image de ce qu'on cherche ; l'écart en pointillés, sans image, dès l'histoire).

## Ce qui reste au parent

- Fabriquer les 3 phrases (`PHRASES.md`). (La perle refaite par le parent est déposée et contrôlée : plus aucune image à refaire.)
- Essayer sur la tablette : un problème de chaque sorte (niveaux 2 à 9), le partage au niveau 3, une erreur (la correction), le coquillage (les groupes comptés sur la scène), une histoire qui compte deux sortes de choses (« 8 coquillages blancs et 5 roses », niveau 2).
