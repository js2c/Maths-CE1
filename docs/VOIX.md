# La voix du jeu : la fabriquer, la compléter, la corriger

Ce document est pour le parent. Il dit comment ajouter les sons des phrases nouvelles quand le jeu évolue,
et comment corriger une phrase mal dite. Le détail technique est dans `docs/ARCHITECTURE.md`, « La voix ».

## En bref

- Chaque phrase du jeu est un fichier son fabriqué à l'avance, sur l'ordinateur du parent, par le modèle
  Chatterbox, qui imite la voix du parent à partir d'un enregistrement de dix secondes.
- Chaque son est contrôlé : il est retranscrit automatiquement (Whisper) et comparé à son texte. S'il est
  faux, il est refait, quatre fois au plus.
- L'outil ne refabrique que les phrases nouvelles ou modifiées. Ajouter dix phrases prend quelques minutes.

## Ce qu'il faut garder

| Quoi | Où | Pourquoi |
| --- | --- | --- |
| L'enregistrement de référence `ref-posee.wav` | hors du dépôt (`Documents`), avec une copie de secours | Sans ce fichier exact, les sons nouveaux n'auraient plus la même voix que les anciens. Il ne doit jamais aller dans le dépôt, qui est public. |
| L'installation Python (Chatterbox, Whisper) | sur l'ordinateur | La réinstaller : en-tête de `tools\\voix\\essais\\essai_chatterbox.py`, plus `pip install imageio-ffmpeg`. |
| Le dossier `tools\voix\travail\` | dans le dépôt, mais jamais envoyé sur GitHub | Les sons bruts de chaque phrase. Il permet de reprendre un lot, de recompresser, et il contient les sons corrigés à la main. On peut le supprimer pour gagner de la place : les sons du jeu restent dans `app\assets\voix\`. Mais alors, ne plus jamais lancer `--tout`, qui referait tout (neuf heures et demie). |

## Ajouter les sons quand le jeu évolue

À faire chaque fois qu'un texte dit par le jeu est ajouté ou modifié (une session Claude Code le signale :
les tests échouent avec « phrases sans fichier à jour »).

1. Récupérer la dernière version du jeu, dans PowerShell :
   ```
   cd $env:USERPROFILE\Documents\Maths-CE1
   git checkout main
   git pull
   ```
2. Fabriquer ce qui manque (si Chatterbox est installé dans un environnement Python, par exemple `.venv-voix`, l'activer d'abord : `.venv-voix\Scripts\activate` ; le début de la ligne affiche alors `(.venv-voix)`) :
   ```
   node tools\voix\fabriquer.mjs --ref ..\ref-posee.wav
   ```
   La première ligne dit combien de phrases sont à fabriquer. Compter environ 4 secondes par phrase.
3. Ouvrir la page indiquée à la fin (`a-reecouter.html`) si des phrases sont refusées, et les écouter
   (voir plus bas).
4. Écouter aussi quelques phrases nouvelles dans le jeu : le contrôle n'entend pas tout (voir plus bas).
5. Vérifier, puis publier :
   ```
   node --test tests\unit\voix.test.mjs
   git add app tools\voix
   git commit -m "Voix : phrases nouvelles"
   git push
   ```
   Le test doit finir par `# fail 0`. `git add app tools\voix` n'ajoute que les sons, l'index et les fichiers de l'outil : jamais l'enregistrement de référence, ni un environnement Python posé dans le dossier. À la publication, GitHub refait lui-même la liste des fichiers du mode
   hors ligne et lance tous les tests : si l'un échoue, rien n'est publié et l'ancienne version reste en ligne
   (onglet « Actions » du dépôt).

## Fabriquer les sons d'un lot avant sa fusion (conseillé)

Quand une session Claude Code prépare un lot qui ajoute ou change des phrases, elle s'arrête en le signalant
dans sa demande de fusion, avec la liste des phrases. Mieux vaut alors fabriquer les sons **sur la branche du
lot, avant de fusionner** : le jeu publié n'a jamais de phrase sans sa voix, et les tests de la demande de
fusion passent au vert.

1. Repérer le nom de la branche : en haut de la demande de fusion sur GitHub (par exemple
   `claude/mascotte-xxxx`).
2. Dans PowerShell :
   ```
   cd $env:USERPROFILE\Documents\Maths-CE1
   git fetch
   git checkout <nom-de-la-branche>
   git pull
   node tools\voix\fabriquer.mjs --ref ..\ref-posee.wav
   ```
   La première ligne dit combien de phrases sont à fabriquer (environ 4 secondes chacune). Les sons qui ne
   servent plus (par exemple des phrases supprimées) sont effacés par l'outil.
3. Écouter `a-reecouter.html` s'il est indiqué, et quelques phrases nouvelles (comme plus haut).
4. Vérifier, puis publier sur la branche :
   ```
   node tools\precache.mjs
   node --test tests\unit\voix.test.mjs
   git add app tools\voix
   git commit -m "Voix : phrases nouvelles du lot"
   git push
   git checkout main
   ```
5. Fusionner la demande de fusion sur GitHub quand ses tests sont verts.

Si la session Claude Code travaille encore sur la branche, attendre qu'elle ait fini et tout poussé avant
l'étape 2 : sinon ses commits et les vôtres se croiseraient.

## Ce que le contrôle entend, et ce qu'il n'entend pas

Le contrôle repère : un mot en trop (« Presque beau »), un mot qui manque, un nombre faux (66 pour 76), une
coupure dans un nombre (« vingt… et un »), un son anormalement long.

Il ne repère pas : une prononciation voisine du bon mot. Que la voix dise « plu » ou « plusse », « vingt-si »
ou « vingt-sisse », il écrit « plus » et « 26 ». Ces défauts ne se trouvent qu'à l'oreille.

Il se trompe parfois dans l'autre sens, sur des mots qui se prononcent pareil : « trois » entendu « Troyes »,
« sept » entendu « cette », « cent » entendu « sont ». La phrase est alors listée à tort : si elle est bonne
à l'oreille, il n'y a rien à faire.

## Quand une phrase est mal dite

### Le principe

Le texte du jeu ne change pas. On change seulement le **texte donné à la voix**, en l'écrivant **comme il se
prononce**. Ce texte n'est jamais affiché. Exemple : le jeu affiche « 26 plus 10 ? », la voix reçoit
« vingt-sisse plusse dix ? », et le contrôle compare toujours ce qu'il entend au texte normal.

Le modèle lit les mots comme dans une phrase ordinaire. En calcul, le français se prononce autrement : on dit
le « s » de « plus », on dit « six » en entier devant « plus » alors qu'on dit « si » dans « six poissons ».
Réécrire le texte est le seul moyen de le lui faire dire.

### Les quatre remèdes, du plus général au plus particulier

| Remède | Quand | Où |
| --- | --- | --- |
| 1. Une règle | Le défaut touche toute une famille de phrases | `tools\voix\lettres.mjs` (à demander à Claude) |
| 2. Une écriture particulière | Une seule phrase est mal dite | `tools\voix\ecritures.json` |
| 3. De nouveaux tirages | Le texte est bon, c'est ce tirage qui est raté | `tools\voix\a-refaire.txt`, puis `--refaire` |
| 4. Une correction à la main | Un mot parasite à couper | le fichier `.wav` dans `travail`, puis `--tout` |

En dernier recours, on peut changer le texte du jeu lui-même, dans `app\content\textes.json` (par exemple
allonger un mot isolé : « Presque ! » → « Presque, essaie encore ! »).

### Les règles en place (`lettres.mjs`)

| Dans le jeu | Donné à la voix | Défaut corrigé |
| --- | --- | --- |
| 21, 31, 41, 51, 61, 71 | vingt-et-un, soixante-et-onze | coupure et absence de liaison (« vingt… et un »), une fois sur quatre |
| plus (addition, « de plus », « en plus ») | plusse | « plus » dit « plu » |
| 6, 8, 10, 5 devant plus, moins, fois, égale | sisse, huite, disse, cinque | « si », « hui », « di » comme devant un nom |

« Le plus grand », « six poissons », « Ça fait six. » ne sont pas réécrits : la voix les dit bien.

### Une écriture particulière (`ecritures.json`)

Une ligne par phrase : à gauche la phrase exactement comme dans le jeu, à droite le texte donné à la voix.

```
{
 "900": "neuf sans",
 "Tape le nombre 603 sur le pavé.": "Tape le nombre six-cent-trois sur le pavé."
}
```

Chaque ligne se termine par une virgule, sauf la dernière. Relancer ensuite la commande de fabrication :
seules les phrases concernées sont refaites.

### De nouveaux tirages (`a-refaire.txt`)

Créer `tools\voix\a-refaire.txt` avec une phrase par ligne, exactement comme dans le jeu, puis :

```
node tools\voix\fabriquer.mjs --ref ..\ref-posee.wav --refaire
```

Supprimer le fichier ensuite. Sans ce fichier, `--refaire` refait toutes les phrases refusées par le
contrôle, y compris celles qui sont bonnes à l'oreille : à éviter une fois les sons validés.

### Une correction à la main

Le nom du fichier `.wav` de chaque phrase refusée est dans `a-reecouter.html`. Le corriger dans Audacity,
l'exporter au même endroit sous le même nom (WAV, 16 bits), puis :

```
node tools\voix\fabriquer.mjs --ref ..\ref-posee.wav --tout
```

Malgré son nom, `--tout` reprend les sons déjà présents dans `travail` et ne fait que les recompresser.
« Plouf ! » a été corrigé ainsi : ne pas le mettre dans `a-refaire.txt`, il serait écrasé.

### Trouver la bonne écriture

Avant de changer une règle, essayer les écritures candidates : dans `tools\voix\essais\essai_ecritures.py`,
la liste `PHRASES` donne, pour chaque phrase, l'écriture actuelle puis les écritures à comparer.

```
python tools\voix\essais\essai_ecritures.py --ref ..\ref-posee.wav
```

La page d'écoute produite montre cinq tirages de chaque écriture. Choisir à l'oreille.

## Changer de voix ou de réglages

Un nouvel enregistrement de référence ou de nouveaux réglages (`REGLAGES` dans `fabriquer.mjs`) obligent à
tout refaire, pour ne pas mêler deux voix : `--tout`, environ neuf heures et demie, puis l'écoute des phrases
refusées. Faire d'abord une répétition : `--essai 80`.

## Les commandes

| Commande (après `node tools\voix\fabriquer.mjs --ref ..\ref-posee.wav`) | Effet |
| --- | --- |
| (rien) | fabrique les phrases nouvelles ou modifiées |
| `--essai 80` | répétition sur 80 phrases, sans toucher au jeu |
| `--refaire` | nouveaux tirages : les phrases de `a-refaire.txt`, ou à défaut toutes les refusées |
| `--tout` | reprend tous les sons de `travail` et recompresse ; refait ce qui n'y est pas |

`node tools\voix\fabriquer.mjs --verifier` (sans `--ref`) dit seulement si chaque phrase a son fichier.
