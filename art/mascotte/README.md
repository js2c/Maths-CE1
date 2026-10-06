# Maquette — la mascotte (le capitaine)

**Maquette validée par le parent le 6 octobre 2026**, intégration dans l'application à faire (`docs/SPEC.md`, section 11, « La mascotte » ; prompt dans `docs/PROMPTS.md`). Aucun fichier sous `app/` n'est modifié par cette maquette.

| Fichier | Rôle |
| --- | --- |
| `index.html` | La maquette du comportement : la scène, la bulle, les actions de l'enfant simulées, une séance simulée, le journal des décisions de la mascotte. |
| `mascotte-moteur.js` | Le moteur seul, `creerMascotte({canvas, base})` : clips, rendu, lecteur, comportement. Déjà utilisé tel quel par la maquette des voiliers (`art/voiliers/`) ; l'application reprendra ce même code. |
| `v/` | Les 17 clips coupés et recadrés (450 × 600, 24 images/s, sans son), en WebM (VP9) et en MP4 (H.264). |
| `outils-mascotte.py` | La coupe et la mesure des clips (ffmpeg, numpy) : pour préparer les vidéos à venir. |

**Tester** : depuis la racine du dépôt, `python -m http.server 8080`, puis `http://localhost:8080/art/mascotte/`. Le compteur en haut à droite indique le clip, l'ambiance et les images par seconde.

**Format dans l'application : WebM (VP9).** La tablette (Chrome pour Android) lit les deux formats ; le Chromium des sessions Claude Code et des parcours Playwright ne lit pas le H.264 : avec des MP4, les captures et les parcours ne verraient jamais la mascotte. Le moteur choisit le MP4 seulement si le navigateur le lit, sinon le WebM ; l'application peut ne livrer que les WebM (7,5 Mo).

La mascotte remplace la pieuvre en gardant **la même interface** (`play`, `hold`, `release`) : les exercices n'ont pas à être réécrits. Elle ajoute deux branchements, sur la voix et sur les touchers de l'enfant.

---

## 1. Ce que voit l'enfant

- Une tête dessinée, en vidéo, qui ne reste jamais figée : entre deux phrases, elle enchaîne de courts mouvements d'attente tirés au hasard (respiration, regard vers son travail, petit sourire, réflexion…), choisis selon le moment de la séance.
- Quand la voix parle, la mascotte parle (sans synchronisation des lèvres) et le texte s'écrit mot à mot dans une bulle de BD.
- Ses réactions sont graduées : petit signe pour une réussite ordinaire, grande joie pour une réussite marquante, déception bienveillante à la première erreur, encouragement ensuite.
- Si l'enfant ne touche plus l'écran pendant une question : un geste pour attirer son attention à 12 s, une phrase d'aide à 25 s, puis plus rien (pas de harcèlement).

---

## 2. Les vidéos

### 2.1 Fichiers

17 clips, recadrés sur la tête (450 × 600 px), 24 images/s, sans son, en MP4 (H.264, 5,7 Mo au total) et en WebM (VP9, 7,5 Mo, secours pour les navigateurs sans H.264). Sur la tablette Android, seuls les MP4 sont lus : les WebM peuvent rester hors du cache hors ligne.

Chaque clip a été coupé au début et à la fin là où la vidéo générée restait figée, **en gardant à chaque bout une image identique à la pose de référence** : n'importe quelle fin raccorde avec n'importe quel début.

| Fichier | Vidéo d'origine | Images gardées (origine) | Durée | Rôle |
|---|---|---|---|---|
| `idle-hochement` | idle.mp4 | 9 → 133 | 5,21 s | attente (accueil) — ancien idle, long hochement |
| `idle-amuse` | Amusé.mp4 | 13 → 66 | 2,25 s | attente, petite réussite |
| `idle-approbation` | Approbation.mp4 | 22 → 69 | 2,00 s | attente, petite réussite |
| `idle-clin-oeil` | Clin d'œil.mp4 | 12 → 62 | 2,13 s | attente (rare) — mouvement parasite final écarté |
| `idle-coup-oeil` | Coup d'œil.mp4 | 18 → 59 | 1,75 s | attente (accueil) — mouvement parasite final écarté |
| `idle-curiosite` | Curiosité.mp4 | 13 → 71 | 2,46 s | attente (accueil), relance |
| `idle-immobile` | Presque immobile.mp4 | 33 → 63 | 1,29 s | attente calme |
| `idle-reflexion` | Réflexion.mp4 | 31 → 69 | 1,63 s | attente calme |
| `idle-respiration` | Respiration calme.mp4 | 10 → 66 | 2,38 s | attente calme |
| `idle-sourcils` | Sourcils.mp4 | 9 → 75 | 2,79 s | bonjour, relance |
| `idle-sourire` | Sourire chaleureux.mp4 | 32 → 69 | 1,58 s | attente calme, petite réussite |
| `idle-travail` | Il regarde le travail de l'enfant.mp4 | 31 → 74 | 1,83 s | attente calme, « montrer » |
| `talk-a` | talk-a.mp4 | 9 → 179 | 7,13 s | parole (principale) |
| `talk-b` | talk-b.mp4 | 2 → 190 | 7,88 s | parole longue (> 7,4 s) |
| `success` | success.mp4 | 24 → 232 | 8,71 s | réussite marquante |
| `wrong` | wrong.mp4 | 15 → 171 | 6,54 s | première erreur — commence par un bref sourire (vers 0,4-0,9 s) avant la déception |
| `encourage` | encourage.mp4 | 21 → 147 | 5,29 s | erreurs suivantes |

Les anciennes vidéos étaient aussi figées au début : `success` restait immobile 1 s avant de réagir, `wrong` 0,6 s, `talk-a` 0,4 s. La coupe rend les réactions plus rapides.

### 2.2 Préparer de nouvelles vidéos

`outils-mascotte.py` (ffmpeg et numpy) reproduit exactement la coupe et la mesure :

```bash
# coupe, recadre, encode (MP4 + WebM) ; la référence est la vidéo idle d'origine
python3 outils-mascotte.py preparer "Nouvelle.mp4" idle-xxx --reference idle.mp4 --dossier v
# mesure les moments de raccord de tous les clips et imprime la table CLIPS à coller dans le moteur
python3 outils-mascotte.py mesurer --dossier v --json clips.json
```

La vidéo `idle` d'origine (720 × 1280, fond vert) est gardée par le parent hors du dépôt, avec les autres vidéos générées ; à défaut, n'importe quelle vidéo générée depuis la même image de départ sert de référence. Avec la vidéo `idle` d'origine comme référence, l'outil retrouve image pour image les coupes du tableau (16 clips sur 16 vérifiables). Avec une autre référence, l'écart reste au plus de 12 images, toujours du côté prudent (quelques images calmes de plus).

Pour la génération : même image de départ que les autres vidéos, utilisée comme première **et** dernière image ; un seul geste bref au milieu ; mouvement en temps réel (pas de ralenti). C'est la structure des 11 prompts d'attente déjà utilisés.

---

## 3. Le rendu

- Chaque vidéo est téléchargée en entier puis lue depuis la mémoire (`fetch` → `Blob` → `URL.createObjectURL`) : la lecture et le retour au début ne dépendent pas du serveur.
- Les éléments `<video>` sont dans la page, minuscules et quasi transparents (`#vids`), muets, `playsinline` : le navigateur ne les met pas en veille.
- Le fond vert est retiré par la carte graphique (WebGL) : un nuanceur calcule la transparence (`1 − smoothstep(0.098, 0.275, vert − max(rouge, bleu))`), retire le reflet vert des bords et mélange deux textures pour les fondus. Secours sans WebGL : le même calcul en 2D, plus lent.
- Une image neuve est envoyée à la carte graphique à chaque `requestVideoFrameCallback` (secours : à chaque `requestAnimationFrame` si le temps de la vidéo a changé).
- Lecture fluide constatée sur la maquette (artefact et fichier autonome) ; un compteur d'images par seconde est affiché en haut à droite.

---

## 4. Les raccords

Un seul clip joue à la fois. Toute demande de changement attend un **moment de raccord** du clip en cours :

| Type | Condition | Fondu |
|---|---|---|
| neutre | le visage entier est dans la pose de référence (fenêtres `n`) | 0,1 s, invisible |
| tête neutre | la tête est dans la pose de référence, seule la bouche diffère (fenêtres `s`) — seulement si la demande l'accepte | 0,2 s, se lit comme une bouche qui se ferme ou s'ouvre |
| fin du clip | la dernière image (toujours neutre) | 0,1 s |
| forcé | la demande a un délai maximal dépassé et aucun raccord n'arrive dans les 0,45 s | 0,3 s, visible : noté dans le journal |

Les fenêtres ont été mesurées image par image (`outils-mascotte.py mesurer`) :

```js
const CLIPS = {
  'encourage':        { d: 5.292, n: [[0.208, 1.042], [5.208, 5.292]], s: [[0.167, 1.417]] },
  'idle-amuse':       { d: 2.25,  n: [[0.0, 0.083], [0.208, 0.958], [2.167, 2.25]], s: [[0.167, 1.875], [2.083, 2.25]] },
  'idle-approbation': { d: 2.0,   n: [[0.0, 0.083], [0.208, 0.375], [1.917, 2.0]], s: [[0.167, 0.417]] },
  'idle-clin-oeil':   { d: 2.125, n: [[0.0, 0.083], [2.0, 2.125]], s: [[1.875, 2.125]] },
  'idle-coup-oeil':   { d: 1.75,  n: [[0.292, 0.625], [1.625, 1.75]], s: [[0.208, 0.625]] },
  'idle-curiosite':   { d: 2.458, n: [[0.0, 0.083], [0.208, 0.833], [2.375, 2.458]], s: [[0.167, 0.833]] },
  'idle-hochement':   { d: 5.208, n: [[0.0, 0.083], [3.833, 4.833], [5.0, 5.208]], s: [[0.0, 0.167], [3.75, 4.875], [4.958, 5.208]] },
  'idle-immobile':    { d: 1.292, n: [[0.0, 0.083], [0.583, 0.792], [1.125, 1.292]], s: [[0.333, 0.833], [1.042, 1.292]] },
  'idle-reflexion':   { d: 1.625, n: [[0.0, 0.083], [1.458, 1.625]], s: [[1.375, 1.625]] },
  'idle-respiration': { d: 2.375, n: [[0.0, 0.292], [2.292, 2.375]], s: [[0.0, 0.958]] },
  'idle-sourcils':    { d: 2.792, n: [[0.292, 1.042], [2.625, 2.792]], s: [[0.208, 1.042], [2.375, 2.792]] },
  'idle-sourire':     { d: 1.583, n: [[0.0, 0.083], [1.458, 1.583]], s: [[1.333, 1.583]] },
  'idle-travail':     { d: 1.833, n: [[0.0, 0.125], [1.542, 1.833]], s: [[1.458, 1.833]] },
  'success':          { d: 8.708, n: [[0.0, 0.083], [8.417, 8.708]], s: [[1.792, 3.083], [3.625, 6.292], [8.375, 8.708]] },
  'talk-a':           { d: 7.125, n: [[0.0, 0.083], [6.958, 7.125]], s: [[1.417, 1.708], [1.875, 3.042], [4.333, 5.583], [5.792, 7.125]] },
  'talk-b':           { d: 7.875, n: [[7.75, 7.875]], s: [[0.0, 0.167]] },
  'wrong':            { d: 6.542, n: [[0.0, 0.125], [5.417, 6.0], [6.25, 6.542]], s: [[0.0, 0.583], [5.375, 6.042], [6.208, 6.542]] }
};
```

Contrôles faits : l'écart entre la fin d'un clip et le début d'un autre (17 × 17 paires) est de 1,85 en médiane et 2,78 au pire, du même ordre que l'écart entre deux images consécutives pendant un mouvement normal (1,43 en médiane). Sur une séance simulée complète suivie de clics rapprochés, 1 fondu forcé sur 60 raccords (consigne arrivée en plein `idle-hochement`, à l'accueil).

---

## 5. Le comportement

### 5.1 Interface

| Appel | Origine | Effet |
|---|---|---|
| `play(geste, {fort})` → promesse | exercices (inchangé) | réaction ; la promesse se résout quand la réaction cède la place |
| `hold(geste)` / `release()` | exercices (inchangé) | ambiance « montre » (`montrer`, et toute désignation sur la ligne) ou « réfléchit » (`reflechir`) le temps du geste |
| `parole(texte, ms, {consigne})` | **voix** (nouveau) | la mascotte parle `ms` millisecondes ; la bulle affiche le texte ; une consigne remet le compte d'erreurs à zéro et passe en ambiance « écoute » |
| `silence()` | **voix** (nouveau) | fin de la phrase : retour à l'attente au prochain raccord ; après une phrase qui n'est pas la consigne, la consigne revient dans la bulle 1,6 s plus tard |
| `activite()` | **toucher** (nouveau) | remet à zéro le compteur d'inactivité |
| `ambiance(nom)` | écrans hors exercice (nouveau) | `pause` pour l'accueil, le récif, l'album ; efface la consigne |
| `onRelance` | rappel fourni par l'application | appelé après 25 s sans toucher pendant une question : l'application dit sa phrase d'aide |

### 5.2 Ce que fait la mascotte selon ce qui se passe

| Situation (appel) | Clip | Durée minimale avant de céder | Ambiance ensuite |
|---|---|---|---|
| Consigne (`voice.say(t, {instruction: true})`) | `talk-a` (entrée variée, voir 5.4) | — | écoute |
| Bonne réponse ordinaire (`play('rejouir')`) | au choix `idle-approbation`, `idle-sourire`, `idle-amuse` (jamais deux fois le même de suite) | clip entier (1,6 à 2,3 s) | bravo (7 s), puis écoute |
| Bonne réponse après une erreur, 3e, 6e… réussite de suite, ou `{fort: true}` (fin de séance) | `success` | 1,8 s, puis cède à la prochaine parole au moment « tête neutre » | bravo |
| Première erreur de la question (`play('encourager')`) | `wrong` | 5,4 s | soutien |
| Erreurs suivantes | `encourage` | 5,2 s | soutien |
| Début de séance (`play('saluer')`) | `idle-sourcils` (salut des sourcils) | clip entier | inchangée |
| Montrer sur la ligne (`hold('montrer')`) | attente tirée dans « montre » (regard vers le travail) | — | celle d'avant, au `release()` |
| 12 s sans toucher pendant une question | `idle-sourcils` ou `idle-curiosite`, une fois | — | inchangée |
| 25 s sans toucher | `onRelance()` : l'application fait dire sa phrase d'aide | — | inchangée |
| Écran sans exercice (`ambiance('pause')`) | attente tirée dans « pause » | — | pause |

Pendant une réaction, une parole ne la coupe pas : la mascotte garde l'expression de la réaction (les clips `wrong` et `encourage` ont des mouvements de bouche), puis enchaîne sur la parole si la voix parle encore à la fin de la durée minimale. Une parole très courte (« Bravo ! ») finie avant ce moment ne déclenche rien.

### 5.3 Attente : ambiances et tirage

| Ambiance | Clips (poids) |
|---|---|
| pause (accueil, fin) | respiration 3, immobile 3, sourire 2, hochement 1, sourcils 1, curiosité 1, coup d'œil 1, réflexion 1, amusé 1, clin d'œil 0,5 |
| écoute (question en cours) | immobile 3, respiration 3, travail 3, réflexion 2, sourire 1, approbation 1 |
| montre | travail 4, immobile 2, réflexion 1 |
| réfléchit | réflexion 4, immobile 2, travail 1 |
| bravo (7 s après une réussite) | sourire 3, amusé 2, approbation 2, immobile 2, respiration 1, clin d'œil 1 |
| soutien (après une erreur) | respiration 3, immobile 3, travail 2, approbation 1, sourire 1 |

Règles du tirage, dans l'ordre :
1. jamais un des 2 derniers clips joués ;
2. écart minimal avant de rejouer un geste marqué : clin d'œil 45 s, coup d'œil 30 s, amusé, curiosité et sourcils 20 s, hochement 15 s, approbation 8 s ;
3. après un geste (tout clip hors immobile, respiration, travail, réflexion, sourire), un clip calme ;
4. tirage au hasard pondéré parmi ce qui reste (immobile si rien ne reste).

L'ambiance « écoute » ne contient que des clips qui repassent vite au neutre : une réaction à une réponse de l'enfant attend en moyenne 0,4 s, 1,5 s au pire. Les gestes amples (curiosité, coup d'œil, hochement) sont réservés à l'accueil.

### 5.4 Parole

- La voix connaît la durée de chaque phrase (index des fichiers Chatterbox, `app/assets/voix/index.json`) : `parole(texte, ms)` reçoit la durée totale.
- Clip : `talk-b` si la phrase dure plus de 7,4 s (et que le clip précédent n'était pas `talk-b`), sinon `talk-a`. Si la phrase dépasse le clip, un autre clip de parole enchaîne.
- **Entrée variée** : `talk-a` commence au hasard au début ou à l'un de ses moments « tête neutre » (1,9 ; 2,5 ; 4,35 ; 5,0 ; 5,8 s), en évitant le même départ que la fois précédente et en choisissant un départ qui laisse assez de clip pour la phrase. Sans cela, chaque consigne d'environ 3,4 s rejouerait exactement les mêmes mouvements.
- Fin : au prochain moment « tête neutre » de `talk-a` après la fin de la voix, soit au plus 1,4 s de mouvements de bouche en trop (0,3 s en moyenne).
- Début : une parole attend au plus 0,8 s un moment de raccord, puis passe par un fondu forcé (la voix a déjà commencé).

### 5.5 Bulle

- Texte de la voix, mot à mot au rythme de la phrase ; les nombres en rouge.
- **Elle n'est là que le temps de parler** (décision du parent du 6 octobre 2026, jeu des voiliers compris) : elle apparaît avec la phrase et s'efface 1,5 s après sa fin ; « réécouter » la refait avec la consigne.
- Elle ne couvre jamais ce que l'enfant touche pour répondre (pavé, bulles-réponses, bande de la ligne graduée, bateau, boutons) ; elle peut couvrir un moment la carte de la question ou le décor.
- Forme : un ovale de BD tracé à la main (superellipse d'exposant 2,7, léger tremblé), pointe effilée et courbée d'un seul trait avec le contour, arrêtée devant la joue à hauteur de la bouche (bouche à 71,5 % de la hauteur du clip, bord du visage à 15,6 % de sa largeur, marge de 12 px) ; trait qui s'épaissit du côté de l'ombre, ombre portée. Code de référence : `drawBalloon` et `balloonPath` dans `art/voiliers/index.html`.
- Police : **Shantell Sans** (graisse 600, nombres en 700), choix du parent du 6 octobre ; intégrée en base64 (licence SIL OFL), donc disponible hors ligne.

---

## 6. Branchement dans l'application

L'application utilise de la pieuvre : `play` (18 appels), `hold` (3), `release` (2), `holding` (2), `update`, `place`, `resize`, `warm`, `cache` (1 chacun), et `ocean.octoAt` / `ocean.octoVisible`.

1. **`engine/mascotte.js`** : reprendre les sections 1 à 4 du script de la maquette (table `CLIPS`, rendu, lecteur `L`, comportement `M`) dans une classe qui expose `play`, `hold`, `release`, `holding`, `update(dt)` (vide : la mascotte a sa propre boucle), `place(x, y)` (position du calque), `resize()`, `warm()` (charge les vidéos), `cache` (l'élément affiché, pour `style.visibility`).
2. **`engine/ocean.js`** : `this.octo = new Mascotte(...)` à la place de `new Octopus(...)`, **là où était la pieuvre** (décision du parent du 6 octobre 2026) ; supprimer l'ondulation verticale de `place` ; la mascotte ne se déplace plus pendant les leçons (`lessons/player.js` faisait monter la pieuvre).
3. **`engine/voice.js`** : deux crochets, `onTalk(text, ms, {instruction})` au démarrage d'un texte et `onSilence()` à sa fin. Dans `playFiles(parts)`, `ms = Σ p.ms + GAP_MS × (parts.length − 1)` ; pour la synthèse de secours, la durée estimée déjà calculée pour le délai de secours. Le drapeau `instruction` de `say` est à transmettre jusque-là. Dans `main.js` : `voice.onTalk = (t, ms, o) => ocean.octo.parole(t, ms, { consigne: o.instruction })`, `voice.onSilence = () => ocean.octo.silence()`.
4. **Pause (bouton « maison »)** : `clock.pause()` doit mettre la vidéo en pause et suspendre la surveillance d'inactivité ; `resume()` les relance.
5. **Toucher** : dans le gestionnaire `pointerdown` existant de `main.js`, appeler `ocean.octo.activite()`.
6. **Relance** : `ocean.octo.onRelance = () => voice.say(text.pick("relanceAide"))`, avec une entrée `relanceAide` dans `content/textes.json`, à fabriquer avec Chatterbox sur l'ordinateur du parent (`docs/VOIX.md`).
7. **Bulle** : un calque dans `#ui` (repère 1280 × 800), alimenté par `parole`, à côté de la mascotte ; elle s'efface 1,5 s après la phrase (section 5.5) ; sa place est réglée écran par écran sur captures.
8. **Écrans hors exercice** : `ocean.octo.ambiance('pause')` à l'accueil, au récif et à l'album.
9. **Hors ligne** : les 17 WebM (environ 7,5 Mo) dans `app/assets/mascotte/` et dans la liste du service worker.
10. **Tests de parcours** : en mode `fast` (voix accélérée), `play()` doit se résoudre tout de suite et la mascotte ne rien attendre, pour ne pas ralentir les parcours automatiques.

---

## 7. Décisions du parent (6 octobre 2026)

- **Pas de nom pour la mascotte.** Le choix du nom au premier lancement (`nomDemande`, `nomTouche`, `nomValider`, `nomChoisi`, liste `noms` de `seance.json`, réglage « nom de la pieuvre » de l'espace parent) est supprimé, ainsi que `{mascotte}` dans les salutations.
- **Au lancement : une phrase d'introduction courte avec « bienvenue »** (par exemple « Bienvenue à bord ! On s'entraîne ensemble ? »), avec le geste `saluer`. Phrase à fabriquer avec Chatterbox sur l'ordinateur du parent, comme celles des salutations réécrites et de la relance.
- **Ligne graduée : une flèche bien faite** marque le nombre pendant l'explication, à la place du tentacule de la pieuvre (`hold(pointAt(q))`) : dessinée dans le style A de l'atelier, posée au-dessus de la graduation, avec une petite animation d'arrivée.
- **La mascotte remplace la pieuvre partout**, à sa place sur chaque écran (en haut à droite dans le jeu des voiliers, comme sur sa maquette).
- **La bulle n'est là que le temps de parler**, partout, jeu des voiliers compris (section 5.5).
- **Police de la bulle : Shantell Sans.**

## 8. Points à décider et limites connues

- **Longueur de `success` (8,7 s).** Elle cède à la parole suivante dès 1,8 s ; sans parole, elle joue en entier.
- **`talk-b`** ne repasse jamais par la pose neutre avant sa fin : il n'est utilisé que pour les phrases de plus de 7,4 s. Des clips de parole courts (2 à 3 s, même structure que les attentes) donneraient plus de variété et des fins de phrase plus nettes.
- **`idle-hochement`** (ancien idle) ne revient au neutre qu'après 3,8 s : une consigne qui arrive pendant ce clip passe par un fondu forcé. Il n'est tiré qu'à l'accueil (poids 1).
- **Présentation** : détourée, la tête entière (sans fondu du cou).
- **Poids** : 7,5 Mo de vidéos WebM dans le cache hors ligne, contre environ 11 Mo de planches de la pieuvre retirées.
- **Le dépôt est public** : les clips (un visage dessiné qui ressemble au parent) y sont visibles, comme le sont déjà sa voix (Chatterbox) et l'application publiée.
