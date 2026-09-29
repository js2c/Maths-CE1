# Lot 3 ter : l'échauffement et l'appui long

Rédigé en conception le 29 septembre 2026, à partir des essais du parent sur la tablette après la fusion du lot 3 bis (PR 23). Cette spécification **prévaut** sur `docs/SPEC.md`, `docs/SPEC-LOT2.md`, `docs/SPEC-LOT3.md` et `docs/SPEC-LOT3BIS.md` en cas de contradiction.

Le lot est volontairement **court** : une seule session, deux étapes. Il ne touche pas au récif. La mer continue et vivante fait l'objet d'un chantier graphique séparé, qui aura sa propre demande de fusion. En particulier, le récif en pages n'est pas modifié ici, et son rebond de fin de liste reste en l'état.

Les points marqués **(décision du parent)** ne se rediscutent pas. Les autres ont une valeur par défaut que Claude Code peut ajuster, en le notant dans `docs/AVANCEMENT.md` avec la raison.

## T1. Passer l'échauffement (décision du parent)

**Constat.** Le bouton « passer » de l'échauffement (lot 3) **disparaît à la première réponse validée**. Il porte en outre le même pictogramme que « passer l'exemple » et « passer la correction ». Le parent ne l'a pas trouvé : pour sauter l'échauffement, il enchaînait « je ne sais pas » puis « avancer », question après question.

**Ce qui change**
- **Le bouton.** Un bouton **dédié** « passer l'échauffement » :
  - il reste présent **pendant tout l'échauffement**, de la phrase d'introduction à la dernière question ;
  - il a **son propre pictogramme**, dessiné à l'atelier et nettement distinct de « passer » (par exemple une vague franchie par une flèche) ;
  - il est placé hors de la zone du pavé et des bulles-réponses.
- **La confirmation**, pour éviter un saut par erreur :
  1. Un toucher bref sur le bouton **met l'échauffement en attente** : la voix s'arrête, le pavé et les bulles-réponses se ferment, et la question en cours reste affichée.
  2. La voix demande : « Tu veux passer l'échauffement ? Touche la coche pour dire oui. »
  3. Une **coche** apparaît à la place du bouton.
  4. **Un toucher sur la coche** met fin à l'échauffement, et la séance passe à la suite, comme le « passer » actuel.
  5. **Sans toucher dans les 5 s** (réglage), la coche disparaît, le bouton revient, et l'échauffement **reprend** : la voix redit la consigne de la question en cours.
- **Le journal.** Il note « échauffement passé » (le journal le fait déjà pour le « passer » actuel).
- **Sans changement** : le réglage parent « Échauffement : oui / non ».
- **Le pictogramme « passer »** des exemples et des corrections ne change pas.

## T2. L'échauffement s'ajuste seul au niveau de l'enfant (décision du parent)

**Constat.** L'échauffement ne pose que des faits des **familles ouvertes** (`famillesActives`). Or ces familles ne s'ouvrent que par la notion du jour des additions, ou par le point de départ réglé dans l'espace parent. Une enfant qui travaille surtout le calcul rapide ou la ligne graduée reste donc bloquée sur « plus un, plus deux » et les doubles, des faits trop faciles pour elle.

**Décision du parent** : le principe des additions à l'échauffement ne change pas. Mais leur difficulté doit suivre automatiquement le niveau de l'enfant, **sans passer par l'espace parent**.

**Règle (valeurs par défaut, réglables dans `app/content/`).** À la fin d'un échauffement, la **famille suivante** (dans l'ordre des familles) s'ouvre si les trois conditions suivantes sont remplies :
1. Tous les faits des familles ouvertes ont été introduits, et au moins **80 %** d'entre eux sont en boîte 2 ou plus.
2. Sur les **12 dernières réponses** d'échauffement portant sur les familles ouvertes, au moins **90 %** sont justes, et le temps médian est sous le seuil « rapide » déjà utilisé par la voie rapide.
3. Aucune famille ne s'est ouverte ainsi le même jour : **au plus une famille par jour**.

**Les conséquences**
- La famille ouverte par l'échauffement est **une famille ouverte comme les autres**. Ses faits entrent comme faits nouveaux, dans les limites existantes (3 réservés par échauffement, plafond de la boîte 1, voie rapide). Ses formes à trou suivent les règles du lot 3 bis (A1).
- **Aucune leçon n'est imposée**, car l'échauffement ne joue pas de leçon. La leçon de la famille reste proposée normalement si l'enfant choisit ensuite cette famille en notion du jour.
- **L'espace parent**, rubrique additions, indique « ouverte par l'échauffement le 12/10 ».
- **Pas de fermeture automatique.** Une famille ouverte trop tôt se régule d'elle-même : les faits ratés restent en boîte 1 et reviennent souvent.
- **Le point de départ réglé par le parent** reste possible, mais il n'est plus nécessaire.

**Attendu, à vérifier par simulation** (`tests/sim-seances.mjs`, sur une base neuve) :
- le profil « sait » atteint les amis de 10 à l'échauffement en **4 séances au plus** ;
- le profil « diff » n'ouvre **aucune** famille avant d'avoir réellement réussi les précédentes ;
- le profil « réel » progresse de façon régulière, sans ouvrir plus d'une famille par semaine en moyenne sur le premier mois.

## T3. L'appui long, partout (décision du parent)

**Constat.** Le lot 3 bis a mis l'étiquette d'appui long sur les 8 pictogrammes du premier niveau seulement (B3). Les tuiles de niveaux et de leçons se lancent **dès que le doigt touche l'écran**. Le parent, en gardant le doigt appuyé pour lire l'explication, a donc lancé une leçon sans le vouloir.

**La règle générale**
- **Un toucher bref valide.** Tout bouton de **choix** ou de **commande** valide au **lever du doigt**, si l'appui a duré moins que `appuiLong.ms` (500 ms). La validation ne se fait plus au premier contact.
- **Un appui long montre l'étiquette et ne lance jamais rien**, même quand on relève le doigt.
- **Seule exception** : le **pavé** et les **bulles-réponses** gardent le comportement décidé au lot 3 bis (A5). La réponse part au premier contact, et un appui long compte comme une réponse, pour ne jamais gêner l'enfant quand elle répond.

**L'étiquette (décision du parent)**
- Elle apparaît **en fondu** d'environ 0,2 s.
- Elle reste affichée tant que le doigt est posé.
- Une fois le doigt relevé, elle **disparaît en fondu, et a totalement disparu 0,5 s après**.
- Réglages dans `legendes.json`, bloc `appuiLong` : `ms` 500, `fonduEntreeMs` 200, et un délai de sortie de 500 ms au total, fondu compris. La valeur `gardeMs` de 2 000 ms est supprimée.
- La voix ne lit pas l'étiquette.

**Les boutons concernés et leur étiquette.** Textes par défaut, à ranger dans `legendes.json`, écrits au feutre selon les règles de ce fichier :

| Où | Bouton | Étiquette |
| --- | --- | --- |
| Accueil, écran « choisir » | Les 8 pictogrammes du lot 3 bis | inchangée |
| Écrans de niveaux | Chaque tuile (ligne graduée, additions, calcul rapide) | La ligne de la légende : « 7 · Ajouter en passant la dizaine » |
| Écran des leçons | Chaque tuile de leçon | Son titre et ce qu'elle montre, en une phrase |
| Sélecteur de difficulté | Chaque cran | « Plus facile », « Conseillé », « Plus dur », « Très dur », avec une phrase sur ce qui change |
| Séance | Coquillage d'aide | « Un indice » |
| Séance | « Je ne sais pas » | « Je ne sais pas, on regarde ensemble » |
| Séance | Réécouter | « Réécouter la consigne » |
| Séance | Passer (exemple ou correction) | « Passer » |
| Séance | Passer l'échauffement (T1) | « Passer l'échauffement » |
| Séance | Rejouer la leçon | « Revoir la leçon » |
| Séance | Effacer | « Effacer le dernier chiffre » |
| Séance | Coche du pavé | « Valider ma réponse » |
| Partout | Maison | « Revenir à l'accueil » |
| Partout | Pause | « Faire une pause » |
| Récif, album | Boutons de navigation et onglets de zone | Leur nom |
| Album | Une carte | Le nom de la créature, ou « Carte à découvrir » |
| Légende | Bouton du petit livre | « La légende des niveaux » |

**Recenser les autres boutons.** Claude Code recense **tous** les autres boutons de choix ou de commande de l'application et leur applique la même règle. Il fait la liste dans `docs/AVANCEMENT.md`.

**L'appui long sur le logo**, qui ouvre l'espace parent, est **inchangé**.

## Recette du lot 3 ter

| Critère | Mesure |
| --- | --- |
| Passer l'échauffement (T1) | Parcours Playwright : bouton présent à chaque question de l'échauffement ; toucher, puis voix, puis coche ; coche touchée, la séance passe à la suite ; sans toucher pendant 5 s, reprise sur la même question avec la consigne redite ; le pictogramme est différent de « passer » (captures regardées) |
| Échauffement qui s'ajuste (T2) | `sim-seances.mjs` sur une base neuve, pour tous les profils : séance d'ouverture de chaque famille ; les trois attendus de T2 ; jamais deux familles ouvertes le même jour ; la variété des réponses (lot 3 bis, §0) reste respectée à l'échauffement |
| Appui long (T3) | Parcours Playwright sur **chaque** bouton recensé : appui de 800 ms, étiquette visible et rien de lancé ; au lever du doigt, rien de lancé et l'étiquette a disparu en 0,5 s ; toucher bref, action lancée. Pavé et bulles-réponses : réponse au premier contact, inchangée |
| Non-régression | Les recettes des lots précédents (`sim-seances.mjs` tous profils, `e2e/recette.mjs --delai 4.5`, `recette-durees.mjs` avec et sans `--passer`, tous les parcours Playwright), et `b-sequences.mjs` en mode test |

**Recette fonctionnelle de contrôle.** La session relecteur limitée du lot 3 bis n'a pas été faite. Elle est faite **à la fin de ce lot**, et couvre à la fois les constats R1 à R25 du lot 3 bis et les trois points de ce lot. Le prompt est dans `docs/PROMPT-LOT3TER.md`.
