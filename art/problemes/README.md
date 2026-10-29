# Maquette de l'exercice « Problèmes »

Préparée avant le lot, pour la validation du parent (`docs/maquettes/problemes/PROPOSITION.md`). Rien ici n'est lu par l'application : `app/` n'est pas modifié.

| Fichier | Rôle |
| --- | --- |
| `enonces.json` | **La banque** : 170 énoncés de la vie courante, classés par structure et par difficulté, avec leurs phrases lues, leur réponse, leur calcul et leur aide (barres, comparaison, groupes, étapes). La seule source : on la modifie à la main. |
| `verifier.mjs` | Le contrôle de la banque (réponses, calculs, aides, difficultés, ponctuation, contextes) ; `--md` écrit `docs/maquettes/problemes/ENONCES.md`, la banque à relire. |
| `contextes.json` | Les 22 contextes d'illustration (une image par lieu, réutilisée par tous ses énoncés) et le prompt Nano Banana de chacun. |
| `phrases.mjs` | Le compte des phrases à fabriquer et leur poids, comparé à la place qui reste sous le plafond de la voix ; `--md` écrit `docs/maquettes/problemes/PHRASES.md`. Il contient aussi les phrases communes proposées (`COMMUNES`). |
| `index.html` | La maquette des écrans clés (ouvrir avec un serveur à la racine du dépôt, par exemple `npm run serve`, puis `/art/problemes/`). |
| `captures.mjs` | Les captures de chaque écran dans `docs/maquettes/problemes/`. |
| `construire.mjs`, `dessins.js` | Les dessins de l'atelier (`art/src/canvas-core/sea/problemes.ts`) empaquetés pour la page ; `dessins.js` est généré. |
| `mascotte.png`, `maison.png`, `etoiles.png` | Capturés dans l'application (une image fixe de la mascotte) pour que les écrans soient complets. |

```bash
node art/problemes/verifier.mjs --md          # contrôle la banque, écrit ENONCES.md
node art/problemes/phrases.mjs --md           # compte les phrases et leur poids, écrit PHRASES.md
cd art && node problemes/construire.mjs       # après une modification des dessins
node art/problemes/captures.mjs               # les captures des écrans
cd art && node tools/still.mjs problemesSheet --out ../docs/maquettes/problemes/00-planche.png --scale 2   # la planche des dessins
```

## La difficulté d'un énoncé (1 à 4)

Elle ne mesure que le calcul ; la structure ajoute sa propre difficulté (l'ordre des niveaux proposé est dans la proposition, section 5).

- **Problèmes additifs** (réunion, transformation, comparaison, deux étapes), selon tous les nombres du calcul (données, résultat intermédiaire, réponse) : **1**, jusqu'à 10 ; **2**, jusqu'à 20 ; **3**, au-delà de 20 sans passage de la dizaine ; **4**, au-delà de 20 avec passage de la dizaine.
- **Groupes égaux** : **1**, au plus 4 groupes d'au plus 5 objets ; **2**, au plus 30 objets ; **3**, plus de 30.
- **Partage** (toujours juste, sans reste) : **1**, au plus 12 objets ; **2**, au plus 30 ; **3**, plus de 30.

## Les règles d'écriture suivies

- **Aucun prénom** : « tu » (l'enfant), des rôles (Papa, Maman, Mamie, Papy, la maîtresse, le boulanger, ton copain…). Le dépôt est public, et un prénom inventé pourrait être celui d'un camarade.
- **Les nombres en chiffres** dans le texte, comme partout dans `app/content/` : l'outil de la voix les écrit en lettres (`tools/voix/lettres.mjs`), la bulle les met en rouge. Jamais le nombre 1 (« un » ou « une » selon le nom : écrit en lettres).
- **Des phrases courtes**, une idée par phrase (une phrase = un fichier son) ; la question toujours seule, à la fin.
- **La réponse n'est jamais dite dans l'énoncé** ; chaque donnée y est dite (contrôlé).
- **Pas plus de 100**, et le partage tombe toujours juste.
