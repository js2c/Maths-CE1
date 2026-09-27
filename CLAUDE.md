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
| `art/` | L'**atelier graphique** : le moteur anidoodle (TypeScript, esbuild, Playwright) et les modules de dessin de l'application. Il ne tourne jamais sur la tablette ; il fabrique les images de `app/assets/art/`. |
| `.claude/skills/anidoodle/` | La compétence anidoodle (copie figée, licence Apache 2.0, voir `VENDORED.txt`). La lire avant tout travail graphique. |
| `docs/` | `SPEC.md` (contenu pédagogique), `maquettes/` (références visuelles validées). |
| `tests/` | Tests unitaires (`node --test`) et parcours Playwright. |

## Direction graphique (validée)

- **Style A, « BD au marqueur »**, la main du koï d'anidoodle : aplats, une ombre nette par forme, contour épais qui s'épaissit du côté de l'ombre, lumière en haut à gauche. Référence absolue : `docs/maquettes/scene-ligne-graduee-style-A.jpg`, `docs/maquettes/animation-style-A.mp4`, et leur code `art/src/canvas-core/ocean.ts` (géométrie de la scène, de la pieuvre, des chiffres) et `art/src/canvas-core/oceanMarker.ts` (le rendu).
- Tout élément graphique de l'application est dessiné en code dans cet atelier et respecte la « craft bar » de la compétence (`references/craft-bar.md`) : pas de formes génériques, anatomie juste, contrôle des détails (visages, jonctions) sur des agrandissements.
- **Exception : les illustrations des cartes** sont des images générées à part et déposées dans `app/assets/cards/`. L'application ajoute le cadre, la rareté, le nom et l'anecdote par-dessus ; il n'y a jamais de texte dans ces images.

## Animation : comment elle est fabriquée

Mesure faite le 26 septembre 2026 : dessiner la scène complète en direct coûte 70 à 190 ms par image sur un ordinateur de bureau, donc bien davantage sur une tablette. On ne redessine donc **jamais** les personnages et le décor en direct. Trois niveaux :

1. **Fabriqué à l'avance par l'atelier** : chaque élément qui bouge est rendu en courte boucle d'images (pieuvre : bras qui ondulent, clignement, chaque geste ; poissons : battement de queue ; algues : ondulation ; tortue : saut). Boucles périodiques sans raccord visible, fond transparent, en planches de sprites. Le moteur est déterministe : une même source donne les mêmes images.
2. **Composé en direct par l'application** : affichage de la bonne image de la boucle, déplacements, flottement, légères rotations (au plus une couche tournée par image). Le décor fixe est composé une fois dans un canvas de fond.
3. **Dessiné en direct, seulement ce qui est léger et dynamique** : bulles, miroitement, arcs des sauts, surbrillances. La ligne graduée d'un exercice (bornes, graduations, chiffres) change à chaque question : elle est dessinée une fois par question avec les primitives du style (même encre, mêmes chiffres que `ocean.ts`) dans un canvas mis en cache, puis simplement affichée.

Budget à tenir sur la tablette : démarrage en moins de 3 s, animation à 30 images/s au minimum (viser 60), mémoire des sprites raisonnable. Mesurer le temps d'image dans l'application et réduire automatiquement les effets si la moyenne dépasse 20 ms.

## Personnages

La pieuvre (mascotte, présente partout) et un personnage guide par module : tortue de mer (ligne graduée, lot 1), bernard-l'ermite (faits d'addition, lot 2), dauphin (calcul rapide, lot 3), crabe (problèmes, lot 4). Chaque personnage est un module de l'atelier, dessiné une fois et seulement posé ensuite (`references/workflows/character-consistency.md`) ; ses gestes sont des boucles fabriquées.

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
- Un commit par étape, message en français.
- La qualité graphique est un critère de réussite : un écran fonctionnel mais pauvre n'est pas terminé.
- Ne pas simplifier silencieusement le contenu de `docs/SPEC.md` ; signaler tout écart et sa raison.

## Confidentialité

- Aucun prénom d'enfant, aucune donnée personnelle dans le code, le contenu ou les commits (le dépôt est public).
- Aucun appel réseau à l'exécution en dehors des fichiers de l'application ; pas d'analytics, pas de publicité, pas de ressources tierces.
