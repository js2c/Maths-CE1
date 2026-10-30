# Maquette de l'exercice « Problèmes »

Préparée avant le lot, pour la validation du parent (`docs/maquettes/problemes/PROPOSITION.md`). Rien ici n'est lu par l'application : `app/` n'est pas modifié.

| Fichier | Rôle |
| --- | --- |
| `enonces.json` | **La banque** : 200 énoncés de la vie courante, classés par structure, par niveau (1 à 9) et par difficulté, avec leurs phrases lues, leur réponse, leur calcul et leur aide (barres, comparaison, groupes, étapes). La seule source : on la modifie à la main. |
| `verifier.mjs` | Le contrôle de la banque (réponses, calculs, aides, niveaux, difficultés, ponctuation, contextes, mots des corrections) ; `--md` écrit `docs/maquettes/problemes/ENONCES.md`, la banque à relire. |
| `contextes.json` | Les 22 contextes d'illustration (une image par lieu, réutilisée par tous ses énoncés) et le prompt Nano Banana de chacun. |
| `phrases.mjs` | Le compte des phrases à fabriquer et leur poids, comparé à la place qui reste sous le plafond de la voix ; `--md` écrit `docs/maquettes/problemes/PHRASES.md`. Il contient aussi les phrases communes proposées (`COMMUNES`). |
| `sim-niveaux.mjs` | Une première simulation de la montée des niveaux (1 ou 2 problèmes par soir, deux règles de montée) ; le lot la refait avec la vraie séance (`docs/LOTS.md`, fiche 14). |
| `index.html` | La maquette des écrans clés (ouvrir avec un serveur à la racine du dépôt, par exemple `npm run serve`, puis `/art/problemes/`). |
| `captures.mjs` | Les captures de chaque écran dans `docs/maquettes/problemes/`. |
| `construire.mjs`, `dessins.js` | Les dessins de l'atelier (`art/src/canvas-core/sea/problemes.ts`) empaquetés pour la page ; `dessins.js` est généré. |
| `mascotte.png`, `maison.png`, `etoiles.png` | Capturés dans l'application (une image fixe de la mascotte) pour que les écrans soient complets. |

```bash
node art/problemes/verifier.mjs --md          # contrôle la banque, écrit ENONCES.md
node art/problemes/phrases.mjs --md           # compte les phrases et leur poids, écrit PHRASES.md
node art/problemes/sim-niveaux.mjs            # la montée des niveaux, simulée
cd art && node problemes/construire.mjs       # après une modification des dessins
node art/problemes/captures.mjs               # les captures des écrans
cd art && node tools/still.mjs problemesSheet --out ../docs/maquettes/problemes/00-planche.png --scale 2   # la planche des dessins
```

## Le niveau d'un énoncé (1 à 9)

Celui de l'exercice (`docs/LOTS.md`, fiche 14 ; `verifier.mjs`, fonction `niveau`) : **1**, ajouter et enlever (réunion, transformation : le tout ou la fin inconnus) jusqu'à 10 ; **2**, les mêmes jusqu'à 20 (le niveau de départ) ; **3**, groupes égaux et partage, petits nombres ; **4**, chercher une partie ou le changement, jusqu'à 20 ; **5**, comparer, jusqu'à 20 ; **6**, les structures des niveaux 1, 2 et 4 au-delà de 20 ; **7**, groupes égaux et partage au-delà ; **8**, le début inconnu, et comparer au-delà de 20 ; **9**, deux étapes.

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
- **La correction n'emploie que des mots de l'énoncé ou de la question** (demande du parent du 30 octobre 2026 ; contrôlé) : ses seuls mots en plus sont ceux qui lient le calcul (« ça fait », « de moins », « il en reste », « en tout »…), et un verbe peut y changer de temps (« vend », « vendu »).
- **Pas plus de 100**, et le partage tombe toujours juste.
