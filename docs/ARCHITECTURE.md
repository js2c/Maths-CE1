# Architecture

Ce document décrit comment l'application est construite. Le contenu pédagogique est dans [`SPEC.md`](SPEC.md), les conventions dans [`../CLAUDE.md`](../CLAUDE.md).

## Vue d'ensemble

```
art/  (atelier, tourne sur un ordinateur)            app/  (publiée, tourne sur la tablette)
─────────────────────────────────────────            ──────────────────────────────────────────
src/canvas-core/ocean.ts, oceanMarker.ts   ─┐         index.html, css/, js/ (modules ES natifs)
  (scène de référence, style A)             │         content/*.json  (niveaux, textes lus)
src/canvas-core/sea/                        │
  octopus.ts   la pieuvre : poses, gestes   ├─ tools/export-app.mjs ─▶ assets/art/*.webp + atlas.json
  decor.ts     fond, algues, poissons…      │                        ▶ js/art/runtime.js (généré)
  catalog.ts   ce qui est fabriqué          │
  runtime.ts   dessin en direct (ligne)    ─┘
```

Une seule source pour chaque dessin : l'atelier. L'application ne contient aucune géométrie de personnage ; elle pose des images fabriquées et dessine seulement ce qui change à chaque question (la ligne graduée, les chiffres des réponses), avec le module `runtime.js` généré depuis `runtime.ts`, qui réutilise l'encre et les chiffres de la scène de référence.

## Les trois niveaux de l'animation

| Niveau | Quoi | Où |
| --- | --- | --- |
| Fabriqué à l'avance | fond, rayons, pièces de la pieuvre, algues au repos, poissons (battement de queue), bulles, reflets, étoile de mer, bulles-réponses, boutons | `art/` → `app/assets/art/` |
| Composé en direct | frise des gestes de la pieuvre, flottement, nage des poissons, ondulation des algues (décalage de bandes de pixels), montée des bulles, dérive des reflets | `app/js/engine/` |
| Dessiné en direct | la ligne graduée (une fois par question), les chiffres des réponses, les anneaux de surbrillance, les arcs de saut | `app/js/art/runtime.js` |

## La pieuvre : des pièces et une frise

Rendue en images entières, la pieuvre coûtait 667 Mo une fois décodée (6 gestes, 264 images à l'échelle 2). Elle est donc fabriquée en **pièces** : chaque bras, le manteau, le rebord du manteau, chaque œil, la bouche, les joues, dessinés droits. L'export découpe chaque image de chaque geste en pièces et ne fabrique qu'une fois une pièce déjà vue : un bras qui ne bouge pas dans un geste reprend les images du repos. Au repos, chaque bras repasse par les mêmes poses à l'aller et au retour de sa respiration, d'où 19 poses par bras au lieu de 36. Résultat à l'échelle 2 : 31 Mo pour le repos, 62 Mo pour les cinq gestes.

La **frise** (`atlas.json`, clé `octo`) donne, pour chaque image de chaque geste, la liste des pièces et la transformation du tout (inclinaison, décalage, écrasement). L'application (`js/engine/octopus.js`) joue la frise à 12 images/s et recompose la pieuvre **droite** dans son propre canvas quand l'image change ; l'inclinaison, l'écrasement et le flottement sont des `transform` CSS, appliqués par le compositeur.

Enchaînements : chaque geste part d'une phase connue du repos (`entry`) et y revient (`exit`). Pour lancer un geste, le repos est amené à cette phase en vitesse triple, dans le sens le plus court (au plus une demi-seconde). Les gestes « montrer » et « réfléchir » ont une boucle intérieure (`hold`) répétée tant que dure le geste ; une réaction demandée pendant ce temps le fait finir en vitesse triple. L'export vérifie la continuité : entrée identique au repos, sortie et raccords de boucle sous l'écart maximal entre deux images voisines.

## Les couches de l'écran

De bas en haut, dans une scène logique de 1280 × 800 mise à l'échelle de l'écran (`js/engine/stage.js`) :

1. `#bg` : fond fixe (eau, rayons, sable, rochers), composé une fois hors écran et affiché par un canvas `bitmaprenderer`.
2. `#line` : la ligne graduée de la question, dans une bande de la scène, dessinée par un **Worker** (`js/art/line-worker.js`, qui exécute `runtime.js`) ; la version « question » et la version « correction » sont préparées ensemble.
3. `#back` : le décor mobile, en **acteurs** (`js/engine/actor.js`) : reflets, algues, poissons, bulles.
4. `#octo` : la pieuvre.
5. `#fx` : calque d'effets de la bande de la ligne (arcs de saut numérotés), dessiné seulement pendant un retour ou une leçon.
6. `#front` : premier plan en acteurs (étoile de mer, tortue).
7. `#ui` : boutons HTML (bulles-réponses, réécouter, jouer), chacun portant un petit canvas dessiné une fois.

**Pourquoi des acteurs et pas un grand canvas animé.** Mesuré dans Chromium sans processeur graphique, processeur ralenti ×4 : un canvas modifié est recopié en entier vers le compositeur à chaque image ; un canvas animé plein écran (2560 × 1600) coûtait ~880 ms de copie par seconde, et un canvas 2D fixe plein écran était lui aussi recopié à chaque image (~11 ms). Chaque acteur a donc son petit canvas, redessiné seulement quand son image change (12 à 15 fois par seconde au plus), et ses déplacements, sa réduction (jamais d'agrandissement) et son opacité sont des `transform` CSS. Les algues ondulent en décalant les bandes horizontales du brin au repos, 15 fois par seconde. Sur une tablette avec processeur graphique, ces copies sont presque gratuites ; cette organisation protège surtout les appareils où Chrome dessine sans lui.

Les planches existent en @1x et @2x. L'application prend la plus proche au-dessus de son échelle d'affichage et, si l'échelle ne tombe pas juste (écran à 1,5 pixel par pixel logique), réduit la planche une seule fois au chargement : chaque image affichée est ensuite une copie pixel pour pixel. Aucune image n'est agrandie, sauf les rayons (fournis en @1x, aplats à 10 % d'opacité).

**Allègement automatique** : la scène mesure l'intervalle moyen entre images (hors 3 premières secondes) ; au-delà de 20 ms elle passe au niveau 1 (algues à 8 images/s, moitié moins de reflets), puis au niveau 2 (algues figées, pas de reflets, un poisson de moins). Elle remonte quand tout redevient fluide.

## Fabriquer les images

```bash
cd art && npm install
node tools/export-app.mjs                # tout : planches, atlas, runtime.js, contrôles
node tools/export-app.mjs --only pieuvre # une partie
node tools/export-app.mjs --runtime      # seulement app/js/art/runtime.js
node tools/still.mjs octoSheet --frame 18 --out out/pieuvre.png --scale 2   # planche de modèle de la pieuvre
node tools/still.mjs creaturesSheet --frame 0 --out out/creatures.png --scale 2   # les 15 créatures du lagon
node tools/still.mjs treasureSheet --frame 0 --out out/tresor.png --scale 1       # coquillage, étoiles, cartes
```

Chaque planche est rendue une seconde fois dans une page neuve : l'export échoue si une seule image diffère (empreintes). Les planches sont en WebP sans perte.

## La séance

`js/session/session.js` enchaîne les étapes de `content/seance.json` (accueil, échauffement, notion du jour, défi record, problème du jour, récompense). Chaque étape est jouée par un gestionnaire fourni par `main.js` ; une étape désactivée (`"actif": false`) ou sans gestionnaire est sautée et notée dans l'enregistrement de la séance. Le plafond (12 minutes, moins une minute gardée pour la récompense) et la durée de chaque étape arrêtent les questions. `js/session/notion.js` déroule la notion du jour (leçon ou deux exemples guidés, 8 à 10 questions, fin sur une réussite) quel que soit le module. `js/session/screens.js` : compteur et vol des étoiles, choix du nom de la pieuvre, bilan, « à demain ». `js/session/rewards.js` : le trésor d'étoiles.

Les leçons animées (L1 à L3, `content/lecons.json`) : `js/lessons/script.js` (fonctions pures : l'état de la scène au début de chaque phrase, calculé sans rien jouer, et la vérification du contenu) et `js/lessons/player.js` (le lecteur). Une leçon est une suite de phrases découpées en temps { dire, faire } : la voix dit pendant que les actions se jouent, et le temps suivant attend la fin des deux. « Phrase précédente » et « rejouer » abandonnent la phrase en cours (jeton) et remettent la scène dans l'état exact du début de la phrase demandée. La leçon se joue sur la scène de la ligne (la tortue, l'étoile et le calque d'effets de l'écran du module 1) ; la pieuvre remonte un peu pour dégager le début de la ligne. Nouvelles primitives de l'atelier : `drawLitTick` (une graduation allumée) et `drawLens` (la loupe de L3). Après toute leçon regardée jusqu'au bout : 3 étoiles, puis « À toi ! » et un premier exercice guidé au format « lire », sans démonstration, la tortue attendant au départ de la ligne (`session/notion.js`).

L'échauffement (module 2) : `js/modules/facts/facts.js` (catalogue des familles, 5 boîtes, seuil « rapide », plan d'un échauffement, fonctions pures), `warmup.js` (enregistrement, temps de base), `screen.js` (ardoise, pavé numérique, aide du coquillage, `runWarmup`). Paramètres dans `content/module2.json`.

Les récompenses (`content/cartes.json`) : `js/session/rewards.js` (le trésor : étoiles de mer, dorées, arc-en-ciel, coquillages, collection de cartes, série ; fonctions pures du tirage, des doublons et des bonus), `js/session/screens.js` (la récompense : bilan, bonus, coquillages qui s'ouvrent), `js/session/cards.js` (une carte à l'écran : dos, recto, verso de l'anecdote, retournée par une rotation CSS), `js/session/reef.js` (le récif visitable). Dessins de l'atelier : `sea/creatures.ts` (les 15 créatures du lagon, boucles de 12 images à 8 images/s ; planche spécimen `creaturesSheet`) et `sea/treasure.ts` (le grand coquillage en 12 images d'ouverture, l'éclat, les étoiles dorée et arc-en-ciel, les faces des cartes, les boutons récif et maison ; planche spécimen `treasureSheet`). Deux grandes planches ne sont chargées que le temps de s'en servir, puis libérées (`Sprites.unload`) : « recif » (43 Mo décodés en @2x) pendant la visite du récif, « cartes » (34 Mo) pendant la récompense et quand on regarde une carte. Les illustrations générées des cartes iront dans `app/assets/cards/<id>.webp` (voir `LISEZMOI.txt` dans ce dossier) ; tant qu'une carte n'a pas la sienne, le recto montre le dessin provisoire de l'atelier (`carte.illu.<id>`).

Les lettres (noms, plus tard cartes) sont écrites au feutre comme les chiffres : `art/src/canvas-core/sea/letters.ts`, dessinées en direct par `drawWord` (`runtime.js`) ; planche de contrôle `node tools/still.mjs lettersSheet --frame 0 --out out/lettres.png --scale 2`.

## Hors ligne et stockage

- `app/sw.js` met en cache tous les fichiers listés dans `app/sw-files.json`. Cette liste et la version du cache sont produites par `node tools/precache.mjs` ; `npm test` échoue si elle n'est pas à jour. À relancer après chaque changement dans `app/`.
- `app/js/engine/store.js` : IndexedDB, un magasin par table de la SPEC (séances, réponses, faits, niveaux, bilans, récompenses, réglages). Le schéma évolue par migrations ajoutées à la fin de `MIGRATIONS`, jamais modifiées.

## Tests

```bash
npm test                          # tests unitaires (node --test)
node tests/e2e/pwa.mjs             # installable et utilisable hors ligne
node tests/e2e/seance.mjs          # une séance complète (nom, échauffement, leçon L1, questions, récompense, « à demain »)
node tests/e2e/lecons.mjs          # les leçons L1 à L3, avec « phrase précédente » et « rejouer »
node tests/e2e/recompenses.mjs     # bonus, coquillage qui s'ouvre, carte, récif (et récif complet)
node tests/e2e/perf.mjs            # mesures (processeur ralenti ×4, 1280 × 800, densité 2) et captures
FFMPEG=/chemin/ffmpeg node tests/e2e/video.mjs   # vidéo d'une séance (MP4)
```
