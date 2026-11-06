# Recette du lot « Correctifs du 5 novembre »

Faite le 6 novembre 2026 sur la branche `claude/practical-einstein-us3eme` (demande de fusion #75), sur le banc Android (méthode commune, `docs/LOTS.md`).

## Technique

| Contrôle | Résultat |
| --- | --- |
| `npm test` | 464 tests sur 465 ; le seul échec : les 4 phrases sans fichier son, à fabriquer (`PHRASES.md`) |
| `node tools/precache.mjs --check` | à jour (12 896 fichiers) |
| `node tests/e2e/tous.mjs` | en deux moitiés (la première arrêtée par la limite de durée des commandes de la session après `fuites`, reprise par `--depuis installation`) : 65 parcours passent du premier coup, 5 échouent ; chacun a sa cause (ci-dessous) et passe à la relance |
| Parcours du lot `correctifs-5-novembre.mjs` | passe : 1280 × 800, 1920 × 1200, `s5e`, `petit-smartphone` (l'accueil, les compteurs, le récif, l'album, l'accueil en pause), la boutique en pause sur 1280 × 800 et `petit-smartphone`, la musique avec le son |
| Parcours `consignes-mascotte.mjs` | passe : 91 touchers de la mascotte, aucun en défaut |
| Journée d'usage courte, tablette de référence (`journee.mjs --court`) | aucun défaut en 55,9 min |
| Enfant imprévisible sur le banc (`enfant.mjs --android --graines 5`) | 5 graines, 400 actions, aucun défaut |
| Taille des cibles (`cibles.mjs`, dans le passage complet) | passe |
| Temps d'image (`perf.mjs`, processeur ÷4) | avant (`main`) : intervalle moyen 31 ms, travail par image 0,7 ms ; après : 23,6 ms et 0,5 ms ; même niveau d'allègement (2) : pas d'écart au-delà du bruit de la mesure |

**Les cinq échecs du passage complet, et leur cause** (aucun n'a été relancé jusqu'à ce qu'il passe : chacun a été expliqué, puis relancé une fois) :

- `boutique`, `correctifs-2`, `seance` : leurs contrôles attendaient l'ancien comportement, changé par les décisions du parent du 5 novembre (pas de boutique en pause ; le galet de l'album à l'accueil ; plus de musique après la séance). Contrôles mis à jour ; passent.
- `recif-vivant` : **un défaut du lot**. La case de la réserve arc-en-ciel masquée à 0 n'était plus dessinée du tout (la nouvelle rangée ne posait que les cases montrées) ; or tout ce qui est dans la page doit être dessiné (le parcours le vérifie, et la reprise après une perte de la carte graphique en dépend). Corrigé : la case masquée est dessinée à la place qu'elle prendra. Passe.
- `notion2` : **échec isolé, cause trouvée, pas un défaut de l'application**. Le parcours se trompait toujours à la 2e question et attendait que le fait revienne ; or, selon le tirage, la règle des additions l'en empêche à bon droit : un fait déjà posé 2 fois dans le bloc ne revient pas (`repetition.parBlocMax`, décision du 13 octobre), et le fait retourné compte pour l'écart (`retourneNotion`, 14 octobre), ce qui peut repousser le retour au-delà de la dernière des 8 questions. Le parcours se trompe désormais sur un fait jamais posé et a 12 questions. 8 passages sur 8 ; passe aussi sur une copie de `main`.

**Trouvés par les parcours pendant le lot et corrigés** :

- La musique de la séance n'était plus lancée (une modification de la session, un commentaire posé au milieu d'une ligne) : trouvé par `correctifs-5-novembre.mjs` avant la recette.
- Les écarts de l'oracle du parcours des consignes, tous expliqués (la page occupée par l'étal qui s'installe ; le changement d'écran relevé après la consigne ; le défi joué trop vite) : `docs/JOURNAL-CONCEPTION.md`.

## Fonctionnelle

Le lot ne change aucune règle pédagogique (ni niveaux, ni questions, ni séquences) : la simulation de l'année et les séquences ne sont pas concernées. La séance jouée de bout en bout l'est par `seance.mjs`, `consignes-mascotte.mjs` et la journée d'usage.

## Relecture indépendante

`RELECTURE.md` (ce dossier) : 16 constats ; corrigés, expliqués, ou antérieurs au lot et signalés au parent.
