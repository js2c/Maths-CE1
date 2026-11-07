# Recette du lot « Suites des correctifs du 5 novembre »

Faite les 6 et 7 novembre 2026 sur la branche `claude/pensive-hawking-8m1y5x` (demande de fusion #77), sur le banc Android (méthode commune, `docs/LOTS.md`).

## Technique

| Contrôle | Résultat |
| --- | --- |
| `npm test` | 465 tests sur 465 |
| `node tools/precache.mjs --check` | à jour (12 896 fichiers). **Trouvé à la recette** : le précache n'avait pas été refait après la dernière correction (`session/reserves.js`, constat 1 de la relecture) ; la tablette n'aurait pas pris la nouvelle version. Refait (commit « Précache à jour… ») ; seul le numéro de version change, les parcours avaient tourné sur les bons fichiers. |
| `node tests/e2e/tous.mjs` | **71 parcours, tous passent du premier coup.** En trois morceaux : le premier coupé après `etal-quitte-installation` par un redémarrage de la machine de la session, le deuxième par la limite de durée des commandes après `parent` ; repris par `--depuis etat-quitte`, puis `--depuis passages`. Aucun parcours n'a échoué, aucun n'a été relancé. |
| Parcours du lot `suites-5-novembre.mjs` | passe : 1280 × 800, 1920 × 1200, `s5e`, `petit-smartphone` (les trois compteurs à l'accueil, dans le récif, dans la boutique, en séance ; la réserve arc-en-ciel à 0 touchée ; le livre de cartes ; la sortie de l'album) |
| Parcours touchés par le lot | `reserves.mjs` (la réserve arc-en-ciel à 0 montrée et touchée), `lot3ter.mjs` (la sortie de l'album), `correctifs-5-novembre.mjs` (la musique « Les profondeurs », la phrase du diamant à 0), `recif-vivant.mjs`, `boutique.mjs` : passent |
| Taille des cibles (`cibles.mjs`, lancé à part, quatre profils) | passe (le bouton de l'album, à la taille de la maison : 140 px de la scène) |
| Journée d'usage courte, tablette de référence (`journee.mjs --court`) | aucun défaut en 55,6 min. Un premier passage a été coupé par le redémarrage de la machine (le navigateur fermé 10 s avant le démarrage de la machine) ; relancé en entier. |
| Enfant imprévisible sur le banc (`enfant.mjs --android --graines 5`) | 5 graines, 400 actions, aucun défaut ; aucune phrase dite sans fichier |
| Temps d'image (`perf.mjs`, processeur ÷4) | avant (`main`) : intervalle moyen 24,4 ms, travail par image 0,8 ms, démarrage à froid 6,7 s ; après : 25,7 ms, 0,6 ms, 5,4 s ; même niveau d'allègement (2) : pas d'écart au-delà du bruit de la mesure (le lot ajoute une case dessinée et change deux dessins de bouton) |

## Fonctionnelle

Le lot ne change aucune règle pédagogique (ni niveaux, ni questions, ni séquences, ni gains d'étoiles) : seul l'affichage de la réserve arc-en-ciel à 0 et deux dessins de bouton changent.

| Contrôle | Résultat |
| --- | --- |
| `node tests/sim-seances.mjs` | passe ; mêmes résultats que la recette du lot précédent (récif de corail ouvert le 10/12/2026, 29 cartes sur 60, 5 étoiles arc-en-ciel et 3 de diamant en réserve à la fin) |
| `node tests/recette-fonctionnelle/b-sequences.mjs --test` | passe |
| Séance jouée à vitesse réelle (`recette.mjs --delai 4.5`) | passe : 17,4 min avec le problème du jour, aucune erreur, aucune phrase sans fichier ; les deux réserves à 0 visibles et inertes pendant toute la séance |
| Attentes (`recette-durees.mjs`, avec et sans `--passer`) | passent ; mêmes attentes qu'avant le lot (la séance n'est pas changée) |

## Phrases

Aucune phrase nouvelle à fabriquer. La réserve arc-en-ciel à 0, touchée, dit deux phrases déjà fabriquées : celle de l'album pour la prochaine zone fermée (« Le récif de corail s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. ») et celle du diamant à 0 (« Viens jouer souvent : tu en gagneras une ! ») ; vérifié par `tests/unit/reserves.test.mjs` (contre l'inventaire des voix) et par les parcours (aucune phrase sans fichier).

## Relecture indépendante

`RELECTURE.md` (ce dossier) : 9 constats, rien de bloquant ; le constat 1 corrigé, les autres expliqués ou antérieurs au lot et signalés au parent.
