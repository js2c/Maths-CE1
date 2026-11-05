# Recette du bloc « Correctifs de la confrontation 2 » puis « Problèmes »

Faite sur le code final de la branche (`claude/clever-lovelace-aqsfk1`, demande de fusion #73), l'une après l'autre, sur le banc Android (méthode commune, `docs/LOTS.md`).

## Technique

| Contrôle | Résultat |
| --- | --- |
| `npm test` | 461 tests sur 462 ; le seul échec : les phrases sans fichier son (968 à fabriquer) |
| `node tools/precache.mjs --check` | à jour (11 933 fichiers) |
| `node tests/e2e/tous.mjs` (68 parcours) | 65 passent ; `centaines` n'échoue que sur les phrases sans fichier son (l'échec admis) ; `lot3bis-b` corrigé puis passé en entier (voir plus bas) ; `mascotte` : un échec isolé (« 1920 trois réussites de suite : grande joie ») ; **cause trouvée et corrigée le 5 novembre** (voir plus bas) |
| `tests/e2e/problemes.mjs` (le parcours du lot) | passe en 1280 × 800 et 1920 × 1200 (captures dans `tests/e2e/out/problemes/`) |
| Journée d'usage courte, tablette de référence (`journee.mjs --court`) | aucun défaut en 59,5 min (le problème du jour joué) |
| Enfant imprévisible sur le banc (`enfant.mjs --android --graines 5`) | 5 graines, 400 actions, aucun défaut |
| Taille des cibles (`cibles.mjs`, quatre profils) | tablettes : problèmes 11,7 et 11,2 mm, partage 11,3 et 10,9 mm (au-dessus de 9 mm) ; smartphones : 5 à 5,5 mm, comme les autres écrans (décision du parent du 19 octobre 2026) ; `tests/recette-fonctionnelle/out-banc-android/cibles.md` |
| Temps d'image (`perf.mjs`, processeur ÷4) | avant (`main`) : intervalle moyen 25,5 puis 27,5 ms, travail par image 0,7 et 0,8 ms ; après : 29 puis 26,4 ms, 0,8 et 0,8 ms ; même niveau d'allègement (2) : pas d'écart au-delà du bruit de la mesure |

**Les parcours corrigés pendant la recette** (aucun n'a été relancé jusqu'à ce qu'il passe : chaque échec a sa cause) :

- 16 parcours jouaient une séance « jouer » sans savoir répondre à un problème : ils la jouent désormais sans le problème du jour (`sans=probleme`, raison écrite en tête de chaque fichier) ; le problème du jour est joué par `problemes.mjs`, la journée d'usage et l'enfant imprévisible (le joueur partagé `jeu.mjs` sait y répondre).
- Ceux qui comptaient six exercices, dix-huit leçons ou cinq rangées en comptent sept, dix-neuf et six ; la place des bulles des exercices se vérifie sur deux rangées.
- `calcul` : un calcul qui tombe sur la dizaine dit « ça fait dix » (lot 1, 6.12).
- `lot3bis-b` : le niveau 7 a aussi, depuis 6.12, des calculs guidés à un seul caillou ; la pause « entre deux cailloux » attend désormais un calcul qui en a deux (sinon elle tombait entre deux questions, sans « On continue ! »).
- `veille` : sur une base neuve sans échauffement, la notion du jour d'additions s'arrête vers la 16e question depuis le plafond de 10 faits nouveaux (lot 1, 6.10 ; avant, une trentaine) ; le parcours répond à 14 questions pour qu'une reste ouverte.
- L'application lit tous les `?sans=` d'une adresse de test (une adresse de base et celle de la situation).

**L'échec isolé de `mascotte`** (demande du parent du 4 novembre : le relancer au moins 20 fois, en 1920 × 1200 et 1280 × 800) :

- reproduit 4 fois sur 25 passages (le parcours raccourci à ses deux premières parties, `--jusqua 2`, chaque passage aux deux tailles) ;
- la cause, trouvée avec le diagnostic du compteur de réussites (`DIAG=1`) : la troisième réponse, touchée pendant que la mascotte parlait, comptait bien trois réussites ; la grande joie, demandée, attendait le raccord du clip en cours ; à la fin de la phrase, la demande du clip d'attente la **remplaçait** (le moteur ne garde qu'une demande en attente) : elle était perdue. Un défaut de l'application (une réponse rapide privait la mascotte de sa réaction), pas du banc ;
- corrigé dans la maquette (`art/mascotte/`, `silence()` : la fin de la parole ne remplace plus une réaction en attente), puis reporté dans `app/js/engine/mascotte.js` ; le parcours touche désormais sa troisième réponse pendant la consigne (le cas est gardé) ;
- après la correction : **20 passages sur 20** réussis (`--jusqua 2`, les deux tailles), puis le parcours complet (112 contrôles, la séance simulée : 122 raccords, aucun fondu forcé) : tout est bon.

## Fonctionnelle

| Contrôle | Résultat |
| --- | --- |
| Simulation de l'année (`mesure-problemes.mjs`, `mesure-additions.mjs`, `grille-additions.mjs`) | `MESURES.md` (ce dossier) et `../out-confrontation2/MESURES.md` |
| `b-sequences.mjs --test` | d'abord 288 combinaisons, 1 152 séances, 4 en défaut, toutes à l'étal (4 réponses différentes au lieu de 5, sur 7 à 9 achats : la notion du jour perdait ses 1 min 30 au profit du problème du jour) ; après la décision du parent du 4 novembre (le problème du jour s'ajoute aux séances de l'étal et des voiliers) : 288 combinaisons, 1 152 séances, **0 en défaut** (5 novembre) |
| L'étal et les voiliers avec le problème du jour (`mesure-etal-voiliers.mjs`) | `ETAL-VOILIERS.md` : la séance la plus longue 11,6 min (plafond 12), le problème du jour jamais sauté (0 sur 252) |
| Les prix de la boutique (`sim-boutique.mjs`) | `BOUTIQUE.md` : 64/160 et 88/220 ; collection complète en juin pour `reel` et `sait`, pas pour `diff` (53 et 54 sur 60) |
| Séance à vitesse réelle (`recette.mjs --delai 4.5`) | sans erreur |
| Les attentes (`recette-durees.mjs`, avec et sans `--passer`) | sans défaut ; avec « passer », les attentes reviennent à 1 à 2 s |
| Relecture indépendante | `RELECTURE.md` (ce dossier) : 1 constat bloquant et 16 gênants, corrigés ou expliqués |
