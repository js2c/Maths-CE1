# Maquette — le jeu des voiliers

Jeu de rangement des nombres réalisé par le parent hors du dépôt (artefact « Les voiliers », octobre 2026), puis équipé de la mascotte (`art/mascotte/`). **Maquette validée par le parent le 6 octobre 2026**, intégration dans l'application à faire : `docs/SPEC.md`, section 7 bis ; prompt dans `docs/PROMPTS.md`. Aucun fichier sous `app/` n'est modifié par cette maquette.

## Tester

Le fichier `index.html` est autonome (images des bateaux, des bouées et du ciel embarquées en base64, polices comprises), sauf les vidéos de la mascotte, lues dans `../mascotte/v/`. Depuis la racine du dépôt :

```bash
python -m http.server 8080
```

puis `http://localhost:8080/art/voiliers/`. Toucher « Jouer ». Un appui long en haut à gauche ouvre le panneau de réglage de la maquette (niveaux, mer, nombre de bouées, durée du vent, longueur de la partie, qualité de la mer).

La maquette n'a pas de voix : la bulle remplace la voix et la mascotte parle le temps de lire la bulle (durée calculée sur la longueur du texte).

## Le jeu

Des bouées numérotées, rangées du plus petit au plus grand, barrent la mer. Un bateau arrive avec un nombre sur sa voile ; l'enfant le fait glisser jusqu'au **passage** (le « chenal ») où il se range : entre les deux bouées qui l'encadrent, avant la première ou après la dernière.

- **Bonne réponse** : le bateau passe et s'éloigne ; « Bravo ! », ou au double encadrement « 15, c'est entre 10 et 20 ! ».
- **Erreur** : les deux bouées du passage choisi s'allument et la bulle explique (« 47 est plus grand que 40 : il passe après. ») ; selon la mer, le bateau revient attendre (calme), le vent le repousse (vent), ou les pirates le rattrapent et il coule (pirates).
- **Double encadrement** (niveau 9) : d'abord entre deux centaines (4 bouées de 100 en 100), puis la caméra recule et une seconde rangée apparaît, entre deux dizaines (5 bouées de 10 en 10).

### Les niveaux de nombres (`LV` dans le script)

| Niveau | Nombres | Bouées | Écart entre bouées | Place du bateau |
| --- | --- | --- | --- | --- |
| 1 | jusqu'à 100 | 3 | 10 (dizaines) | loin des bouées (au moins 3) |
| 2 | jusqu'à 100 | 3 | 3 à 9, bouées « non rondes » | n'importe où |
| 3 | jusqu'à 1 000 | 3 | 100 (centaines) | loin (au moins 20) |
| 4 | jusqu'à 1 000 | 4 | 10 | loin (au moins 3) |
| 5 | jusqu'à 1 000 | 4 | 100 ou 10, en alternance | près d'une bouée |
| 6 | jusqu'à 1 000 | 4 | 3 à 9, non rondes | près d'une bouée |
| 7 | jusqu'à 1 000 | 5 | 10 | près d'une bouée |
| 8 | jusqu'à 1 000 | 5 | mélangés (100, 10, 3 à 9) | près d'une bouée |
| 9 | jusqu'à 1 000 | 4 puis 5 | 100, puis 10 | double encadrement |

Le passage visé est tiré au hasard (tous les passages également probables) ; jamais deux fois de suite le même nombre.

### La mer (`MV`)

| Mer | Ce qui se passe |
| --- | --- |
| calme (« statique ») | le bateau attend ; on le pose où l'on veut ; une erreur le ramène au point d'attente |
| vent | le vent pousse le bateau vers les bouées en 7 s (réglable 5 à 12 s) ; le doigt guide à gauche et à droite et peut accélérer, jamais retenir ; une erreur : une rafale le repousse |
| pirates | un bateau pirate le poursuit (30 % plus vite qu'un bateau immobile) ; une erreur ou un retard : le bateau est rattrapé et coule |

**Progression de la maquette** (à remplacer par les règles de l'application, `docs/SPEC.md` section 7 bis) : 3 bateaux réussis de suite font passer à la mer suivante (annoncée : « Le vent se lève ! », « Attention, des pirates ! ») ; après les pirates, niveau de nombres suivant et retour au calme (« Bravo ! De nouvelles bouées t'attendent. ») ; 2 échecs font redescendre (« La mer se calme. », « Les pirates sont partis. Le vent souffle. », « De nouvelles bouées ! »). Une partie : 15 bateaux (10, 15 ou 20), une pastille par bateau (verte du premier coup, orange quand une seule des deux rangées du double encadrement est juste, rouge sinon).

## Ce qui est dessiné et ce qui est image

- **La mer** : dessinée en direct en WebGL (houle, reflets, écume), avec trois qualités (`QUAL`) ; les bateaux et les bouées tanguent avec la houle.
- **Les images** (2,2 Mo dans `ASSETS`, 0,6 Mo dans `SKY`) : 5 bateaux (voilier, catamaran, yacht, chalutier, pirate) en textures avec leur ombre, 4 types de bouées, le ciel et les nuages, la côte. Images générées à part, pas dessinées dans l'atelier : une exception de plus au « tout dessiné », comme les cartes, le lagon et le récif vivant.
- **Les nombres** sur les voiles, les plaques et les bouées : peints en direct.
- **La bulle** : ovale de BD dessiné en SVG (`balloonPath`, `drawBalloon`), police Shantell Sans ; la mascotte en haut à droite, « réécouter » dessous.

## Branchements de la mascotte (déjà dans la maquette)

- `say(grand, petit, humeur, consigne)` : tout ce qui est dit passe par là ; la mascotte parle (`parole`), puis se tait (`silence`) ; la bulle s'efface 1,5 s après (décision du parent du 6 octobre 2026).
- Un nouveau nombre (`newBoat`) et la seconde rangée du double encadrement sont des **consignes** (le compte d'erreurs de la mascotte repart de zéro).
- Bon passage : `play('rejouir')` (petite joie, ou grande joie après une erreur et toutes les 3 réussites de suite) ; erreur ou bateau rattrapé : `play('encourager')` (déception, puis encouragement) ; fin de partie : `play('rejouir', {fort: true})`.
- Premier « Jouer » : `play('saluer')` et « Bienvenue à bord ! ».
- 25 s sans toucher pendant qu'un bateau attend : la consigne est redite, précédée de « Prends ton temps. ».

## Ce que la maquette fait autrement que l'application (à reprendre au lot)

- Pas de voix : à l'intégration, chaque texte devient une phrase fabriquée avec Chatterbox (liste économe dans `docs/SPEC.md`, section 7 bis).
- Les nombres en lettres de la bulle (« Quarante-sept ») suivent ici l'ancienne orthographe (« vingt et un ») : l'application écrit avec des traits d'union, comme partout ailleurs (`app/js/engine/phrases.js`).
- Le panneau de réglage (appui long en haut à gauche) disparaît : ce qui doit rester réglable va dans l'espace parent ou dans `app/content/`.
- Les pastilles de la partie sont remplacées par la frise d'avancement de l'application ; la longueur de la partie suit la durée de la séance.
- Ni maison, ni « je ne sais pas », ni « passer », ni pause : à ajouter selon les règles communes (`docs/SPEC.md`, section 9).
