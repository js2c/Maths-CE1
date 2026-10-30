# Le temps de démarrage, profil s5e

2026-10-30T09:25:59.311Z ; budget : 3000 ms (CLAUDE.md). Application installée (service worker), processeur ralenti comme le profil ; 10 relances (une sur deux, le navigateur tué).

| Mesure (relances) | Temps |
| --- | --- |
| première image (l'écran de démarrage) | 642 à 1865 ms (médiane 834) |
| prêt (« Toucher pour continuer ») | 3262 à 4758 ms (médiane 3654) |
| accueil, après le toucher | 4649 à 6000 ms (médiane 5000) |
| les 17 vidéos de la mascotte lues en entier | 1856 à 3132 ms (médiane 2229) |
| tout sauf les vidéos (fichiers, décodage des images) | 3235 à 4754 ms (médiane 3638) |
| … et les vidéos de l'accueil seulement (idle-respiration, talk-a, talk-b, success) | 3235 à 4754 ms (médiane 3638) |

| Lancement | Première image | Prêt | Accueil | Images décodées | Tout sauf les vidéos | + vidéos de l'accueil | 17 vidéos lues |
| --- | --- | --- | --- | --- | --- | --- | --- |
| premier lancement (rien en cache) | 1155 | 6082 | 8082 | 5769 (1197 ms) | 6073 | 6073 | 3504 (wrong) |
| relance 1 | 915 | 3412 | 4724 | 3254 (658 ms) | 3363 | 3363 | 2040 (wrong) |
| relance 2 (tuée) | 772 | 3952 | 5371 | 3743 (913 ms) | 3923 | 3923 | 2309 (talk-b) |
| relance 3 | 1865 | 4758 | 5954 | 4616 (1054 ms) | 4754 | 4754 | 3132 (talk-b) |
| relance 4 (tuée) | 1829 | 4627 | 6000 | 4472 (916 ms) | 4592 | 4592 | 3126 (success) |
| relance 5 | 702 | 3262 | 4726 | 3148 (1021 ms) | 3235 | 3235 | 1971 (wrong) |
| relance 6 (tuée) | 728 | 3454 | 4649 | 3264 (732 ms) | 3439 | 3439 | 2173 (talk-b) |
| relance 7 | 774 | 3604 | 4817 | 3346 (751 ms) | 3573 | 3573 | 2229 (wrong) |
| relance 8 (tuée) | 921 | 3654 | 5000 | 3482 (712 ms) | 3638 | 3638 | 2398 (wrong) |
| relance 9 | 642 | 3282 | 4870 | 3117 (826 ms) | 3250 | 3250 | 1935 (talk-b) |
| relance 10 (tuée) | 834 | 3874 | 5127 | 3568 (923 ms) | 3843 | 3843 | 1856 (talk-b) |
