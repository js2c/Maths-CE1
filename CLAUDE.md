# Maths CE1 — conventions du projet

Application d'entraînement aux mathématiques pour une élève de CE1, utilisée chaque soir 10 à 12 minutes sur une tablette Android (Chrome). Le contenu pédagogique de référence est dans `docs/SPEC.md` : le lire avant toute tâche. En cas de doute sur un choix pédagogique, demander plutôt que d'inventer.

## Utilisateurs

- **L'enfant (7 ans)** : ne lit pas encore avec aisance. Toute consigne est orale, toute interaction se fait au toucher. Pas de texte long à l'écran, jamais de clavier alphabétique.
- **Le parent** : consulte l'espace parent (progression réelle, historique, export). Ce n'est pas un développeur ; les instructions qui lui sont destinées doivent être en français simple.

## Organisation du dépôt

| Dossier | Rôle |
| --- | --- |
| `app/` | L'application publiée : HTML, CSS, JavaScript (modules ES natifs), sans étape de build. C'est ce dossier que GitHub Pages sert. |
| `app/assets/art/` | Les images et boucles d'animation fabriquées par l'atelier (WebP ou PNG transparents, en @1x et @2x), versionnées dans le dépôt. |
| `app/assets/cards/` | Les illustrations des cartes (générées à part, voir plus bas). |
| `app/content/` | Tout le contenu éditable, en JSON, séparé du code : niveaux et paramètres de génération, textes lus (consignes, retours d'erreur, scripts des leçons), cartes et anecdotes, seuils et réglages. Un changement de contenu ne doit jamais demander de toucher au moteur. |
| `art/` | L'**atelier graphique** : le moteur anidoodle (TypeScript, esbuild, Playwright), les modules de dessin existants et les outils de production. Il ne tourne jamais sur la tablette ; il fabrique les images de `app/assets/art/`. |
| `art/v2/` | Le prototype du pipeline graphique V2 : manifeste de scène, composition en couches et placeholders. Il n'est pas publié dans `app/` tant que l'intégration n'est pas validée. |
| `.claude/skills/anidoodle/` | La compétence anidoodle (copie figée, licence Apache 2.0, voir `VENDORED.txt`). La lire avant tout travail graphique procédural. |
| `docs/` | `SPEC.md` (contenu pédagogique), `SPEC-LOT2.md` (lot 2), `SPEC-LOT3.md` (lot 3, prévaut sur les précédentes en cas de contradiction), `maquettes/` (références visuelles validées). |
| `tests/` | Tests unitaires (`node --test`) et parcours Playwright. |

## Direction graphique (V2 — refonte engagée le 28 septembre 2026)

- La référence de production est désormais `docs/DIRECTION-ART-V2.md` : monde sous-marin illustré, riche et narratif, avec plusieurs plans de profondeur, personnages plus volumétriques et davantage de détails, tout en gardant une lisibilité immédiate pour un enfant de CE1.
- Le **repère logique reste 1280 × 800** comme dans `app/js/engine/stage.js`. Ne pas introduire un second repère graphique ni modifier le moteur de mise à l'échelle pour la refonte.
- Les décors, personnages et accessoires complexes peuvent être des **illustrations raster locales** (WebP opaque ou alpha, @1x/@2x selon le besoin), versionnées dans le dépôt et utilisables hors ligne. Ils n'ont plus l'obligation d'être dessinés procéduralement.
- Anidoodle reste la bonne voie pour les éléments pédagogiques dynamiques et les effets simples : ligne graduée, nombres, géométrie, bulles, surbrillances et autres primitives qui doivent varier à l'exécution. Il reste aussi la source des assets existants tant qu'ils ne sont pas migrés.
- L'ancien **Style A « BD au marqueur »** reste une référence de cohérence pour ces primitives et pour les assets non migrés, mais n'est plus une règle imposant que tout visuel complexe soit dessiné en code.
- Les illustrations des cartes restent des images générées à part dans `app/assets/cards/` ; l'application ajoute le cadre, la rareté, le nom et l'anecdote par-dessus, sans texte incorporé dans l'image.
- Pour toute nouvelle scène V2 : profondeur principalement dessinée dans les assets (perspective atmosphérique, chevauchements, premier plan), pas de gros flous plein écran calculés en permanence. Les assets transparents sont recadrés au plus près de leur contenu.

## Animation : comment elle est fabriquée

Mesure faite le 26 septembre 2026 : dessiner la scène complète en direct coûte 70 à 190 ms par image sur un ordinateur de bureau, donc bien davantage sur une tablette. On ne redessine donc **jamais** les personnages et le décor en direct. Trois niveaux :

1. **Fabriqué à l'avance** : chaque élément qui bouge est rendu en courte boucle d'images (pieuvre : bras qui ondulent, clignement, chaque geste ; poissons : battement de queue ; algues : ondulation ; tortue : saut). La source peut venir de l'atelier procédural ou d'une illustration raster préparée pour l'animation. Boucles périodiques sans raccord visible, fond transparent, en planches de sprites. Les exports finaux sont versionnés : à l'exécution, une même version donne toujours les mêmes images.
2. **Composé en direct par l'application** : affichage de la bonne image de la boucle, déplacements, flottement, légères rotations (au plus une couche tournée par image). Le décor fixe est composé une fois dans un canvas de fond.
3. **Dessiné en direct, seulement ce qui est léger et dynamique** : bulles, miroitement, arcs des sauts, surbrillances. La ligne graduée d'un exercice (bornes, graduations, chiffres) change à chaque question : elle est dessinée une fois par question avec les primitives du style (même encre, mêmes chiffres que `ocean.ts`) dans un canvas mis en cache, puis simplement affichée.

Budget à tenir sur la tablette : démarrage en moins de 3 s, animation à 30 images/s au minimum (viser 60), mémoire des sprites raisonnable. Mesurer le temps d'image dans l'application et réduire automatiquement les effets si la moyenne dépasse 20 ms.

## Personnages

La pieuvre (mascotte, présente partout) et un personnage guide par module : tortue de mer (ligne graduée, lot 1), bernard-l'ermite (faits d'addition, lot 2), crabe (problèmes, lot 4) ; pas de dauphin : le calcul rapide (lot 3) se contente de la tortue et du petit poisson du mur de corail (décision du parent, `docs/SPEC-LOT3.md`). Chaque personnage possède une **référence visuelle canonique** et n'est décliné qu'à partir d'elle ; ses gestes sont des boucles fabriquées. Pour les personnages encore procéduraux, le workflow de cohérence existant (`references/workflows/character-consistency.md`) reste applicable.

## Contraintes techniques de l'application

- **PWA** installable et utilisable hors ligne : manifest, icône, service worker qui met en cache tous les fichiers de `app/`. Aucune dépendance chargée depuis un CDN, pas de framework sauf nécessité démontrée, pas de backend.
- **Hébergement** : GitHub Pages, déployé par un workflow GitHub Actions qui publie `app/` à chaque poussée sur `main`. Chemins relatifs uniquement (l'application est servie sous `/<nom-du-dépôt>/`).
- **Cible** : tablette Android 10 à 11 pouces, paysage, tactile. Tester à 1280×800 et 1920×1200. Zones tactiles d'au moins 64 px.
- **Stockage** : IndexedDB (petit wrapper maison), `navigator.storage.persist()` demandé au premier lancement, schéma versionné avec migrations. Aucune donnée ne quitte la tablette, sauf export manuel déclenché par le parent.
- **Voix** : chaque phrase est un fichier son fabriqué à l'avance avec Piper (voix `fr_FR-siwis-medium`, choisie par le parent), dans `app/assets/voix/` ; outil `node tools/voix/fabriquer.mjs` à relancer après toute modification d'un texte lu de `app/content/` (puis `node tools/precache.mjs`), voir `docs/ARCHITECTURE.md`, « La voix ». La Web Speech API (`speechSynthesis`, voix `fr-FR`, Google si possible, débit environ 0,9) ne sert plus que de secours pour une phrase sans fichier. File d'attente de phrases ; bouton « réécouter » toujours visible ; compteur d'écoutes enregistré. L'événement de fin est peu fiable sur Android : délai de secours (durée du fichier, ou longueur du texte pour la synthèse). La voix ne démarre qu'après un premier toucher.
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
- **Recette à chaque étape** (depuis le lot 2) : simulation de séances par profil d'enfant et séance jouée à vitesse réelle (`tests/sim-seances.mjs`, `tests/e2e/recette.mjs`, `tests/e2e/recette-durees.mjs`), critères et mesures dans la demande de fusion ; voir `docs/SPEC-LOT2.md`, section 8.
- Un commit par étape, message en français.
- La qualité graphique est un critère de réussite : un écran fonctionnel mais pauvre n'est pas terminé.
- Ne pas simplifier silencieusement le contenu de `docs/SPEC.md` ; signaler tout écart et sa raison.

## Confidentialité

- Aucun prénom d'enfant, aucune donnée personnelle dans le code, le contenu ou les commits (le dépôt est public).
- Aucun appel réseau à l'exécution en dehors des fichiers de l'application ; pas d'analytics, pas de publicité, pas de ressources tierces.
