# Maths CE1 — conventions du projet

Application d'entraînement aux mathématiques pour une élève de CE1, utilisée chaque soir 10 à 12 minutes sur une tablette Android (Chrome). Le contenu pédagogique de référence est dans `docs/SPEC.md` : le lire avant toute tâche. En cas de doute sur un choix pédagogique, demander plutôt que d'inventer.

## Utilisateurs

- **L'enfant (7 ans)** : ne lit pas encore avec aisance. Toute consigne est orale, toute interaction se fait au toucher. Pas de texte long à l'écran, jamais de clavier alphabétique. Seule exception (décision du parent du 6 octobre 2026) : la bulle de la mascotte, qui écrit ce que dit la voix le temps de la phrase (`docs/SPEC.md`, section 11) ; sur les écrans de choix, elle part de la tuile touchée (lot « Correctifs de la tablette »).
- **Le parent** : consulte l'espace parent (progression réelle, historique, export). Ce n'est pas un développeur ; les instructions qui lui sont destinées doivent être en français simple.

## Organisation du dépôt

| Dossier | Rôle |
| --- | --- |
| `app/` | L'application publiée : HTML, CSS, JavaScript (modules ES natifs), sans étape de build. C'est ce dossier que GitHub Pages sert. |
| `app/assets/art/` | Les images et boucles d'animation fabriquées par l'atelier (WebP ou PNG transparents, en @1x et @2x), versionnées dans le dépôt. |
| `app/assets/cards/` | Les illustrations des cartes (générées à part, voir plus bas). |
| `app/content/` | Tout le contenu éditable, en JSON, séparé du code : niveaux et paramètres de génération, textes lus (consignes, retours d'erreur, scripts des leçons), cartes et anecdotes, seuils et réglages. Un changement de contenu ne doit jamais demander de toucher au moteur. |
| `art/` | L'**atelier graphique** : le moteur anidoodle (TypeScript, esbuild, Playwright) et les modules de dessin de l'application. Il ne tourne jamais sur la tablette ; il fabrique les images de `app/assets/art/`. |
| `.claude/skills/anidoodle/` | La compétence anidoodle (copie figée, licence Apache 2.0, voir `VENDORED.txt`). La lire avant tout travail graphique. |
| `docs/` | `SPEC.md` (la **spécification unique** : ce que fait l'application, modifiée en place à chaque lot), `LOTS.md` (les lots à lancer, dans l'ordre : méthode commune, fiche de chaque lot, recette faite par la session), `IDEES.md` (idées et questions ouvertes), `PROMPTS.md` (prompts des sessions de contrôle), `AVANCEMENT.md`, `ARCHITECTURE.md`, `GUIDE-PARENT.md`, `JOURNAL-CONCEPTION.md` (les raisons des décisions), `maquettes/` (références visuelles validées), `archives/` (anciennes spécifications, prompts, bilans et recettes des lots 1 à 3 ter : les renvois du code vers `docs/SPEC-LOT2.md`, `docs/SPEC-LOT3BIS.md`… y renvoient ; en cas d'écart, `docs/SPEC.md` fait foi). |
| `tests/` | Tests unitaires (`node --test`) et parcours Playwright. |

## Direction graphique (validée)

- **Style A, « BD au marqueur »**, la main du koï d'anidoodle : aplats, une ombre nette par forme, contour épais qui s'épaissit du côté de l'ombre, lumière en haut à gauche. Référence absolue : `docs/maquettes/scene-ligne-graduee-style-A.jpg`, `docs/maquettes/animation-style-A.mp4`, et leur code `art/src/canvas-core/ocean.ts` (géométrie de la scène, de la pieuvre, des chiffres) et `art/src/canvas-core/oceanMarker.ts` (le rendu).
- Tout élément graphique de l'application est dessiné en code dans cet atelier et respecte la « craft bar » de la compétence (`references/craft-bar.md`) : pas de formes génériques, anatomie juste, contrôle des détails (visages, jonctions) sur des agrandissements.
- **Exception : les illustrations des cartes** sont des images générées à part et déposées dans `app/assets/cards/`. L'application ajoute le cadre, la rareté, le nom et l'anecdote par-dessus ; il n'y a jamais de texte dans ces images.
- **Exception : le fond de l'application, le lagon** (décision du parent du 4 octobre 2026) : c'est le début du panorama de la maquette du récif vivant (`art/recif-vivant/index.html`), avec ses algues, ses poissons en silhouette, ses faisceaux et son miroitement. Ces images sont extraites telles quelles de la maquette par `art/tools/export-lagon.mjs` (la maquette n'est jamais modifiée) ; leurs mouvements sont ceux du code de la maquette, repris dans `app/js/engine/lagon.js`. L'ancien fond dessiné (fond, rayons, reflets, algues, poissons, bulles du décor) n'existe plus ; ne pas le réintroduire.
- **Exception : la mascotte** (décisions du parent des 5 et 6 octobre 2026, lot « Mascotte ») : des vidéos d'une tête dessinée, détourées à l'affichage, préparées dans `art/mascotte/` (son `README.md` : les clips, les raccords mesurés, l'outil de coupe). Elle remplace la pieuvre. La flèche qui remplace le tentacule, elle, est dessinée dans l'atelier.
- **Exception : le jeu des voiliers** (décision du parent du 6 octobre 2026, lot « Les voiliers ») : la maquette `art/voiliers/` (mer en WebGL, images des bateaux, des bouées et du ciel), intégrée comme le récif vivant, par `art/tools/export-voiliers.mjs`, qui ne la modifie jamais (images dans `app/assets/voiliers/`, module généré `app/js/voiliers/voiliers-scene.js`, à ne pas modifier à la main : on modifie l'outil et on relance l'export). Seuls les pictogrammes qui l'annoncent (l'exercice, les 9 niveaux, la frise) sont dessinés dans l'atelier (`sea/voiliers.ts`).
- **Exception : la collection, le récif vivant** (décisions du parent du 5 octobre 2026) : c'est la maquette du récif vivant elle-même, avec ses images de créatures, intégrée telle quelle par `art/tools/export-recif.mjs` (images dans `app/assets/recif/`, module généré `app/js/recif/recif-vivant.js`, à ne pas modifier à la main : on modifie l'outil et on relance l'export). Les créatures dessinées en code (`sea/creatures.ts`) ne sont plus utilisées par l'application.

## Animation : comment elle est fabriquée

Mesure faite le 26 septembre 2026 : dessiner la scène complète en direct coûte 70 à 190 ms par image sur un ordinateur de bureau, donc bien davantage sur une tablette. On ne redessine donc **jamais** les personnages et le décor en direct. Trois niveaux :

1. **Fabriqué à l'avance par l'atelier** : chaque élément qui bouge est rendu en courte boucle d'images (poissons : battement de queue ; algues : ondulation ; tortue : saut). Boucles périodiques sans raccord visible, fond transparent, en planches de sprites. Le moteur est déterministe : une même source donne les mêmes images.
2. **Composé en direct par l'application** : affichage de la bonne image de la boucle, déplacements, flottement, légères rotations (au plus une couche tournée par image). Le décor fixe est composé une fois dans un canvas de fond.
3. **Dessiné en direct, seulement ce qui est léger et dynamique** : bulles, miroitement, arcs des sauts, surbrillances. La ligne graduée d'un exercice (bornes, graduations, chiffres) change à chaque question : elle est dessinée une fois par question avec les primitives du style (même encre, mêmes chiffres que `ocean.ts`) dans un canvas mis en cache, puis simplement affichée.

Budget à tenir sur la tablette : démarrage en moins de 3 s, animation à 30 images/s au minimum (viser 60), mémoire des sprites raisonnable. Mesurer le temps d'image dans l'application et réduire automatiquement les effets si la moyenne dépasse 20 ms.

## Personnages

La mascotte, présente partout (sauf dans le récif vivant) : le capitaine en vidéo, qui a remplacé la pieuvre au lot « Mascotte » (`docs/SPEC.md`, section 11) ; son moteur est celui de la maquette `art/mascotte/`, repris tel quel dans `app/js/engine/mascotte.js` (ne pas en réécrire les règles : modifier la maquette, puis reporter) ; sa bulle (`engine/bulle.js`) ne couvre jamais ce que l'enfant touche ; on touche la mascotte pour réécouter ; la flèche (`engine/fleche.js`, dessinée dans l'atelier) montre à la place du bras de la pieuvre. Un personnage guide par module : tortue de mer (ligne graduée, lot 1), bernard-l'ermite (faits d'addition, lot 2), crabe (problèmes, à décider : `docs/IDEES.md`) ; pas de dauphin : le calcul rapide (lot 3) se contente de la tortue et du petit poisson du mur de corail (décision du parent du 27 septembre 2026). Chaque personnage est un module de l'atelier, dessiné une fois et seulement posé ensuite (`references/workflows/character-consistency.md`) ; ses gestes sont des boucles fabriquées.

## Contraintes techniques de l'application

- **PWA** installable et utilisable hors ligne : manifest, icône, service worker qui met en cache tous les fichiers de `app/`. Aucune dépendance chargée depuis un CDN, pas de framework sauf nécessité démontrée, pas de backend.
- **Hébergement** : GitHub Pages, déployé par un workflow GitHub Actions qui publie `app/` à chaque poussée sur `main`. Chemins relatifs uniquement (l'application est servie sous `/<nom-du-dépôt>/`).
- **Cible** : tablette Android 10 à 11 pouces, paysage, tactile. Tester à 1280×800 et 1920×1200. Zones tactiles d'au moins 64 px.
- **Stockage** : IndexedDB (petit wrapper maison), `navigator.storage.persist()` demandé au premier lancement, schéma versionné avec migrations. Aucune donnée ne quitte la tablette, sauf export manuel déclenché par le parent.
- **Voix** : chaque phrase est un fichier son fabriqué à l'avance avec Chatterbox Multilingual V3, qui imite la voix du parent, dans `app/assets/voix/`. La fabrication demande la carte graphique et l'enregistrement de référence du parent : elle se fait **sur son ordinateur, pas dans une session Claude Code** (`node tools/voix/publier.mjs`, qui enchaîne fabrication, vérification et envoi, pour plusieurs lots d'un coup), en suivant `docs/VOIX.md`. Un lot peut être fusionné avant ses voix : les tests de GitHub les signalent sans échouer, et la publication attend qu'elles soient faites. Après toute modification d'un texte lu de `app/content/`, le dire au parent : tant qu'il n'a pas refabriqué les phrases nouvelles, `npm test` échoue (une phrase sans fichier). Ne jamais refabriquer avec Piper : deux voix seraient mêlées. Le texte donné à la voix est parfois réécrit comme il se prononce (« plusse », « vingt-et-un ») : `tools/voix/lettres.mjs` et `tools/voix/ecritures.json`, principe dans `docs/VOIX.md`. Voir aussi `docs/ARCHITECTURE.md`, « La voix ». La Web Speech API (`speechSynthesis`, voix `fr-FR`, Google si possible, débit environ 0,9) ne sert plus que de secours pour une phrase sans fichier. File d'attente de phrases ; on touche la mascotte pour réécouter (décision du parent du 8 octobre 2026, lot « Correctifs de la tablette » : plus de bouton « réécouter » à côté d'elle ; le bouton ne reste que là où elle n'est pas, le récif vivant) ; compteur d'écoutes enregistré. L'événement de fin est peu fiable sur Android : délai de secours (durée du fichier, ou longueur du texte pour la synthèse). La voix ne démarre qu'après un premier toucher : celui qui fait disparaître l'écran de démarrage (`session/demarrage.js`). Aucune phrase ne doit être dite sans fichier : chaque parcours `tests/e2e` échoue sur une phrase absente de l'inventaire (`tests/e2e/navigateur.mjs`, par lequel tous les parcours lancent Chromium).
- **Leçons animées** : pilotées par une frise temporelle déterministe découpée en étapes ; chaque étape attend la fin de la phrase lue avant d'avancer.

## Atelier graphique : mode d'emploi

```bash
cd art && npm install
node tools/still.mjs oceanMarker --frame 0 --out out/look.png --scale 2   # une image, avec son empreinte
node tools/render.mjs oceanMarker --out out/loop.mp4                       # la boucle (ffmpeg requis, variable FFMPEG)
```

Chromium est préinstallé dans l'environnement de Claude Code (ne pas lancer `playwright install`). L'export vers l'application : `node tools/export-app.mjs` (planches, `atlas.json`, `app/js/art/runtime.js`, contrôles de reproductibilité et de raccord) ; voir `docs/ARCHITECTURE.md`.

## Méthode de travail

- Avancer par étapes courtes et vérifiables. Après chaque étape : lancer les tests, faire des captures d'écran avec Playwright, les regarder, corriger ce qui est laid ou illisible avant de continuer.
- **Recette à chaque étape** (depuis le lot 2) : simulation de séances par profil d'enfant et séance jouée à vitesse réelle (`tests/sim-seances.mjs`, `tests/e2e/recette.mjs`, `tests/e2e/recette-durees.mjs`), `tests/recette-fonctionnelle/b-sequences.mjs --test`, critères et mesures dans la demande de fusion ; voir `docs/SPEC.md`, section 14.
- Un commit par étape, message en français.
- La qualité graphique est un critère de réussite : un écran fonctionnel mais pauvre n'est pas terminé.
- Ne pas simplifier silencieusement le contenu de `docs/SPEC.md` ; signaler tout écart et sa raison. Un lot met `docs/SPEC.md` à jour dans sa propre demande de fusion ; il ne crée pas de nouvelle spécification.

## Confidentialité

- Aucun prénom d'enfant, aucune donnée personnelle dans le code, le contenu ou les commits (le dépôt est public).
- Aucun appel réseau à l'exécution en dehors des fichiers de l'application ; pas d'analytics, pas de publicité, pas de ressources tierces.
