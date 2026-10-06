# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | 28 | 27 | 16 | 57 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | 49 | 46 | 19 | 39 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | 68 | 49 | 23 | 34 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | 88 | 61 | 27 | 31 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | 28 | 28 | 17 | 61 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | 49 | 43 | 27 | 55 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | 68 | 56 | 22 | 32 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | 88 | 80 | 24 | 27 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | 28 | 27 | 15 | 54 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | 49 | 43 | 18 | 37 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | 68 | 62 | 30 | 44 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | 88 | 61 | 24 | 27 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | 28 | 25 | 13 | 46 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | 49 | 40 | 24 | 49 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | 68 | 61 | 24 | 35 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | 88 | 78 | 21 | 24 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | 28 | 29 | 13 | 46 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | 49 | 46 | 24 | 49 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | 68 | 54 | 23 | 34 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | 88 | 64 | 21 | 24 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | 28 | 26 | 16 | 57 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | 49 | 37 | 23 | 47 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | 68 | 45 | 16 | 24 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | 88 | 72 | 20 | 23 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | 28 | 28 | 13 | 46 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | 49 | 44 | 18 | 37 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | 68 | 62 | 16 | 24 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | 88 | 69 | 16 | 18 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | 28 | 23 | 12 | 43 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | 49 | 46 | 19 | 39 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | 68 | 61 | 19 | 28 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | 88 | 52 | 14 | 16 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | 24 | 23 | 12 | 50 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | 42 | 32 | 10 | 24 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | 58 | 37 | 11 | 19 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | très dur | 74 | 40 | 13 | 18 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | 48 | 38 | 21 | 44 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | 77 | 61 | 24 | 31 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | 107 | 59 | 32 | 30 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | 136 | 91 | 28 | 21 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | 48 | 36 | 20 | 42 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | 80 | 59 | 24 | 30 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | 107 | 75 | 30 | 28 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | 144 | 75 | 23 | 16 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | 48 | 35 | 24 | 50 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | 76 | 62 | 31 | 41 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | 104 | 78 | 25 | 24 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | 144 | 105 | 23 | 16 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | 49 | 36 | 22 | 45 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | 80 | 54 | 25 | 31 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | 108 | 73 | 23 | 21 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | 144 | 68 | 25 | 17 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | 48 | 37 | 19 | 40 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | 78 | 64 | 26 | 33 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | 107 | 59 | 31 | 29 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | 142 | 101 | 24 | 17 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | 49 | 36 | 21 | 43 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | 77 | 55 | 27 | 35 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | 110 | 59 | 19 | 17 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | 142 | 86 | 24 | 17 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | 49 | 37 | 17 | 35 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | 79 | 65 | 22 | 28 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | 108 | 88 | 22 | 20 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | 140 | 107 | 29 | 21 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | 49 | 35 | 19 | 39 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | 80 | 62 | 24 | 30 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | 110 | 87 | 25 | 23 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | 140 | 109 | 25 | 18 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | 46 | 34 | 16 | 35 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | 69 | 42 | 20 | 29 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | 98 | 62 | 21 | 21 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | très dur | 122 | 72 | 24 | 20 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | appliquée | 30 | 4 | 14 % | 3 (2, 1, 0 : pas de -1) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | réelle | 23 | 4 | 18 % | 3 (0, 1, 2 : pas de +1) | – | 27 | 77 % | plus facile |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | pressée | 24 | 4 | 17 % | 3 (0, 1, 2 : pas de +1) | – | 16 | 27 % | plus facile |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | appliquée | 30 | 4 | 21 % | 2 (1, 2 : pas de +1) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | réelle | 25 | 4 | 25 % | 3 (2, 1, 0 : pas de -1) | – | 46 | 80 % | conseillé |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | pressée | 21 | 4 | 20 % | 3 (0, 1, 2 : pas de +1) | – | 19 | 17 % | conseillé |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | appliquée | 30 | 4 | 17 % | 2 (1, 0 : pas de -1) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | réelle | 22 | 4 | 19 % | 3 (0, 1, 2 : pas de +1) | – | 49 | 70 % | conseillé |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | pressée | 22 | 4 | 5 % | 3 (3, 2, 1 : pas de -1) | – | 23 | 23 % | conseillé |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | appliquée | 30 | 4 | 31 % | 3 (0, 1, 2 : pas de +1) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | réelle | 23 | 4 | 9 % | 3 (0, 1, 2 : pas de +1) | – | 61 | 75 % | plus dur |
| neuve | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | pressée | 24 | 4 | 22 % | 3 (0, 1, 2 : pas de +1) | – | 27 | 34 % | conseillé |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | appliquée | 30 | 4 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | réelle | 24 | 4 | 13 % | 2 (2, 0 : pas de -2) | – | 28 | 83 % | plus facile |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | pressée | 23 | 4 | 23 % | 3 (3, 2, 1 : pas de -1) | – | 17 | 27 % | plus facile |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | appliquée | 30 | 4 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | réelle | 22 | 4 | 24 % | 3 (1, 2, 3 : pas de +1) | – | 43 | 75 % | conseillé |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | pressée | 23 | 4 | 23 % | 2 (3, 1 : pas de -2) | – | 27 | 24 % | conseillé |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | appliquée | 30 | 4 | 7 % | 3 (0, 1, 2 : pas de +1) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | réelle | 24 | 4 | 30 % | 2 (1, 3 : pas de +2) | – | 56 | 81 % | plus dur |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | pressée | 21 | 4 | 15 % | 3 (3, 2, 1 : pas de -1) | – | 22 | 15 % | conseillé |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | appliquée | 30 | 4 | 17 % | 2 (2, 3 : pas de +1) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | réelle | 26 | 4 | 20 % | 2 (3, 1 : pas de -2) | – | 80 | 94 % | très dur |
| neuve | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | pressée | 23 | 4 | 27 % | 3 (0, 1, 2 : pas de +1) | – | 24 | 19 % | conseillé |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | appliquée | 30 | 4 | 14 % | 3 (1, 2, 3 : pas de +1) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | réelle | 24 | 4 | 22 % | 3 (3, 2, 1 : pas de -1) | – | 27 | 73 % | plus facile |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | pressée | 22 | 4 | 5 % | 3 (1, 2, 3 : pas de +1) | – | 15 | 17 % | plus facile |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | appliquée | 30 | 4 | 24 % | 3 (1, 2, 3 : pas de +1) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | réelle | 23 | 4 | 23 % | 3 (3, 2, 1 : pas de -1) | – | 43 | 68 % | conseillé |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | pressée | 20 | 4 | 11 % | 3 (0, 1, 2 : pas de +1) | – | 18 | 15 % | conseillé |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | appliquée | 30 | 4 | 21 % | 3 (1, 2, 3 : pas de +1) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | réelle | 24 | 4 | 13 % | 3 (3, 2, 1 : pas de -1) | – | 62 | 84 % | plus dur |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | pressée | 26 | 4 | 16 % | 3 (2, 1, 0 : pas de -1) | – | 30 | 31 % | conseillé |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | appliquée | 30 | 4 | 24 % | 3 (3, 2, 1 : pas de -1) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | réelle | 24 | 4 | 9 % | 3 (2, 1, 0 : pas de -1) | – | 61 | 83 % | plus dur |
| neuve | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | pressée | 24 | 4 | 17 % | 2 (1, 0 : pas de -1) | – | 24 | 24 % | conseillé |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | appliquée | 30 | 5 | 7 % | 3 (3, 2, 1 : pas de -1) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | réelle | 25 | 5 | 21 % | 3 (2, 3, 4 : pas de +1) | – | 25 | 91 % | plus facile |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | pressée | 20 | 5 | 11 % | 2 (3, 4 : pas de +1) | – | 13 | 6 % | plus facile |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | appliquée | 30 | 5 | 17 % | 3 (4, 3, 2 : pas de -1) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | réelle | 23 | 5 | 9 % | 3 (1, 2, 3 : pas de +1) | – | 40 | 85 % | conseillé |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | pressée | 22 | 5 | 5 % | 3 (2, 3, 4 : pas de +1) | – | 24 | 19 % | conseillé |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | appliquée | 30 | 5 | 7 % | 3 (0, 1, 2 : pas de +1) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | réelle | 25 | 5 | 21 % | 3 (0, 2, 4 : pas de +2) | – | 61 | 75 % | plus dur |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | pressée | 24 | 5 | 13 % | 3 (0, 2, 4 : pas de +2) | – | 24 | 24 % | conseillé |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | appliquée | 30 | 5 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | réelle | 24 | 5 | 17 % | 2 (4, 2 : pas de -2) | – | 78 | 81 % | très dur |
| neuve | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | pressée | 22 | 5 | 5 % | 3 (1, 2, 3 : pas de +1) | – | 21 | 14 % | conseillé |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | appliquée | 30 | 5 | 14 % | 3 (4, 2, 0 : pas de -2) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | réelle | 26 | 5 | 8 % | 2 (3, 0 : pas de -3) | – | 29 | 87 % | plus facile |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | pressée | 19 | 5 | 6 % | 3 (0, 1, 2 : pas de +1) | – | 13 | 6 % | plus facile |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | appliquée | 30 | 5 | 21 % | 3 (2, 1, 0 : pas de -1) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | réelle | 28 | 5 | 11 % | 2 (4, 1 : pas de -3) | – | 46 | 85 % | conseillé |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | pressée | 22 | 5 | 19 % | 3 (4, 3, 2 : pas de -1) | – | 24 | 22 % | conseillé |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | appliquée | 30 | 5 | 21 % | 3 (1, 2, 3 : pas de +1) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | réelle | 23 | 5 | 5 % | 3 (0, 1, 2 : pas de +1) | – | 54 | 85 % | conseillé |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | pressée | 23 | 5 | 5 % | 3 (4, 3, 2 : pas de -1) | – | 23 | 19 % | conseillé |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | appliquée | 30 | 5 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | réelle | 26 | 5 | 16 % | 3 (2, 1, 0 : pas de -1) | – | 64 | 78 % | conseillé |
| neuve | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | pressée | 23 | 5 | 9 % | 3 (3, 2, 1 : pas de -1) | – | 21 | 19 % | conseillé |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | appliquée | 30 | 5 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | réelle | 27 | 5 | 12 % | 3 (2, 1, 0 : pas de -1) | – | 26 | 94 % | plus facile |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | pressée | 21 | 5 | 5 % | 3 (2, 1, 0 : pas de -1) | – | 16 | 23 % | plus facile |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | appliquée | 30 | 5 | 17 % | 2 (1, 0 : pas de -1) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | réelle | 20 | 5 | 5 % | 3 (0, 2, 4 : pas de +2) | – | 37 | 73 % | conseillé |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | pressée | 20 | 5 | 0 % | 3 (4, 2, 0 : pas de -2) | – | 23 | 18 % | conseillé |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | appliquée | 30 | 5 | 17 % | 3 (3, 2, 1 : pas de -1) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | réelle | 24 | 5 | 9 % | 3 (2, 1, 0 : pas de -1) | – | 45 | 76 % | conseillé |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | pressée | 20 | 5 | 5 % | 3 (0, 2, 4 : pas de +2) | – | 16 | 9 % | conseillé |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | appliquée | 30 | 5 | 17 % | 2 (4, 1 : pas de -3) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | réelle | 24 | 5 | 13 % | 3 (2, 1, 0 : pas de -1) | – | 72 | 83 % | très dur |
| neuve | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | pressée | 22 | 5 | 14 % | 3 (4, 2, 0 : pas de -2) | – | 20 | 14 % | conseillé |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | appliquée | 30 | 6 | 10 % | 3 (1, 2, 3 : pas de +1) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | réelle | 25 | 6 | 17 % | 3 (0, 2, 4 : pas de +2) | – | 28 | 87 % | plus facile |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | pressée | 21 | 6 | 10 % | 2 (5, 0 : pas de -5) | – | 13 | 12 % | plus facile |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | appliquée | 30 | 6 | 10 % | 2 (0, 4 : pas de +4) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | réelle | 23 | 6 | 14 % | 3 (3, 4, 5 : pas de +1) | – | 44 | 83 % | conseillé |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | pressée | 21 | 5 | 15 % | 3 (3, 4, 5 : pas de +1) | – | 18 | 14 % | conseillé |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | appliquée | 30 | 6 | 14 % | 3 (2, 3, 4 : pas de +1) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | réelle | 25 | 6 | 13 % | 3 (5, 3, 1 : pas de -2) | – | 62 | 84 % | plus dur |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | pressée | 22 | 6 | 14 % | 3 (4, 3, 2 : pas de -1) | – | 16 | 17 % | conseillé |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | appliquée | 30 | 6 | 7 % | 3 (1, 3, 5 : pas de +2) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | réelle | 22 | 6 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 69 | 79 % | plus dur |
| neuve | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | pressée | 21 | 6 | 10 % | 3 (1, 2, 3 : pas de +1) | – | 16 | 18 % | conseillé |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | appliquée | 30 | 6 | 17 % | 3 (4, 3, 2 : pas de -1) | – | 28 | 100 % | plus facile |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | réelle | 23 | 6 | 14 % | 3 (2, 3, 4 : pas de +1) | – | 23 | 80 % | plus facile |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | pressée | 20 | 6 | 21 % | 3 (1, 2, 3 : pas de +1) | – | 12 | 3 % | plus facile |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | appliquée | 30 | 6 | 17 % | 3 (1, 3, 5 : pas de +2) | – | 49 | 100 % | conseillé |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | réelle | 26 | 6 | 20 % | 3 (3, 2, 1 : pas de -1) | – | 46 | 90 % | conseillé |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | pressée | 21 | 6 | 15 % | 2 (3, 1 : pas de -2) | – | 19 | 20 % | conseillé |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | appliquée | 30 | 6 | 10 % | 3 (0, 2, 4 : pas de +2) | – | 68 | 100 % | plus dur |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | réelle | 26 | 6 | 20 % | 2 (4, 0 : pas de -4) | – | 61 | 87 % | plus dur |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | pressée | 21 | 6 | 15 % | 2 (5, 1 : pas de -4) | – | 19 | 18 % | conseillé |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | appliquée | 30 | 6 | 17 % | 3 (1, 2, 3 : pas de +1) | – | 88 | 100 % | très dur |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | réelle | 21 | 6 | 20 % | 2 (1, 3 : pas de +2) | – | 52 | 77 % | conseillé |
| neuve | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | pressée | 18 | 6 | 12 % | 3 (0, 2, 4 : pas de +2) | – | 14 | 13 % | conseillé |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | appliquée | 23 | 10 | 14 % | 2 (22, 24 : pas de +2) | – | 24 | 100 % | plus facile |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | réelle | 17 | 10 | 0 % | 2 (11, 21 : pas de +10) | – | 23 | 75 % | plus facile |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | pressée | 18 | 8 | 0 % | 2 (34, 31 : pas de -3) | – | 12 | 6 % | plus facile |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | appliquée | 23 | 11 | 0 % | 2 (23, 24 : pas de +1) | – | 42 | 100 % | conseillé |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | réelle | 16 | 8 | 0 % | 2 (33, 31 : pas de -2) | – | 32 | 73 % | conseillé |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | pressée | 18 | 8 | 6 % | 3 (12, 22, 32 : pas de +10) | – | 10 | 3 % | conseillé |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | appliquée | 23 | 12 | 0 % | 2 (11, 12 : pas de +1) | – | 58 | 100 % | plus dur |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | réelle | 18 | 7 | 12 % | 2 (23, 14 : pas de -9) | – | 37 | 73 % | conseillé |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | pressée | 18 | 6 | 6 % | 2 (14, 21 : pas de +7) | – | 11 | 7 % | conseillé |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | appliquée | 23 | 12 | 5 % | 3 (31, 21, 11 : pas de -10) | – | 74 | 100 % | très dur |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | réelle | 15 | 8 | 0 % | 2 (33, 34 : pas de +1) | – | 40 | 60 % | conseillé |
| neuve | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | pressée | 18 | 9 | 0 % | 3 (24, 23, 22 : pas de -1) | – | 13 | 6 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | appliquée | 30 | 4 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | réelle | 22 | 4 | 14 % | 3 (3, 2, 1 : pas de -1) | – | 38 | 78 % | plus facile |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | pressée | 22 | 4 | 19 % | 3 (0, 1, 2 : pas de +1) | – | 21 | 15 % | plus facile |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | appliquée | 30 | 4 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 77 | 100 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | réelle | 26 | 4 | 16 % | 3 (1, 2, 3 : pas de +1) | – | 61 | 81 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | pressée | 19 | 4 | 11 % | 3 (2, 1, 0 : pas de -1) | – | 24 | 11 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | appliquée | 30 | 4 | 28 % | 3 (0, 1, 2 : pas de +1) | – | 107 | 100 % | plus dur |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | réelle | 25 | 4 | 17 % | 2 (0, 2 : pas de +2) | – | 59 | 77 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | pressée | 22 | 4 | 24 % | 3 (0, 1, 2 : pas de +1) | – | 32 | 13 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | appliquée | 30 | 4 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 136 | 100 % | très dur |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | réelle | 23 | 4 | 23 % | 3 (1, 2, 3 : pas de +1) | – | 91 | 76 % | plus dur |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | pressée | 21 | 4 | 15 % | 3 (0, 1, 2 : pas de +1) | – | 28 | 9 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | appliquée | 30 | 4 | 14 % | 2 (2, 1 : pas de -1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | réelle | 21 | 4 | 20 % | 3 (0, 1, 2 : pas de +1) | – | 36 | 75 % | plus facile |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | pressée | 22 | 4 | 19 % | 2 (0, 1 : pas de +1) | – | 20 | 10 % | plus facile |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | appliquée | 30 | 4 | 21 % | 3 (1, 2, 3 : pas de +1) | – | 80 | 100 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | réelle | 23 | 4 | 27 % | 3 (0, 1, 2 : pas de +1) | – | 59 | 76 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | pressée | 21 | 4 | 15 % | 2 (3, 1 : pas de -2) | – | 24 | 10 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | appliquée | 30 | 4 | 21 % | 3 (3, 2, 1 : pas de -1) | – | 107 | 100 % | plus dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | réelle | 22 | 4 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 75 | 79 % | plus dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | pressée | 21 | 4 | 20 % | 3 (0, 1, 2 : pas de +1) | – | 30 | 13 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | appliquée | 30 | 4 | 17 % | 3 (1, 2, 3 : pas de +1) | – | 144 | 100 % | très dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | réelle | 23 | 4 | 14 % | 3 (3, 2, 1 : pas de -1) | – | 75 | 69 % | plus dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | pressée | 22 | 4 | 24 % | 3 (1, 2, 3 : pas de +1) | – | 23 | 9 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | appliquée | 30 | 4 | 24 % | 3 (3, 2, 1 : pas de -1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | réelle | 23 | 4 | 18 % | 3 (3, 2, 1 : pas de -1) | – | 35 | 75 % | plus facile |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | pressée | 24 | 4 | 17 % | 3 (2, 1, 0 : pas de -1) | – | 24 | 16 % | plus facile |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | appliquée | 30 | 4 | 17 % | 3 (0, 1, 2 : pas de +1) | – | 76 | 100 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | réelle | 25 | 4 | 13 % | 3 (2, 1, 0 : pas de -1) | – | 62 | 81 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | pressée | 26 | 4 | 12 % | 3 (3, 2, 1 : pas de -1) | – | 31 | 18 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | appliquée | 30 | 4 | 21 % | 3 (0, 1, 2 : pas de +1) | – | 104 | 100 % | plus dur |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | réelle | 22 | 4 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 78 | 79 % | plus dur |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | pressée | 22 | 4 | 19 % | 2 (0, 1 : pas de +1) | – | 25 | 10 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | appliquée | 30 | 4 | 21 % | 2 (0, 2 : pas de +2) | – | 144 | 100 % | très dur |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | réelle | 25 | 4 | 13 % | 3 (3, 2, 1 : pas de -1) | – | 105 | 81 % | très dur |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | pressée | 21 | 4 | 20 % | 3 (1, 2, 3 : pas de +1) | – | 23 | 8 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | appliquée | 30 | 5 | 10 % | 2 (3, 0 : pas de -3) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | réelle | 24 | 5 | 17 % | 3 (2, 3, 4 : pas de +1) | – | 36 | 78 % | plus facile |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | pressée | 21 | 5 | 5 % | 3 (2, 3, 4 : pas de +1) | – | 22 | 15 % | plus facile |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | appliquée | 30 | 5 | 21 % | 3 (4, 2, 0 : pas de -2) | – | 80 | 100 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | réelle | 23 | 5 | 32 % | 3 (0, 1, 2 : pas de +1) | – | 54 | 71 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | pressée | 22 | 5 | 14 % | 3 (2, 3, 4 : pas de +1) | – | 25 | 12 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | appliquée | 30 | 5 | 14 % | 3 (1, 2, 3 : pas de +1) | – | 108 | 100 % | plus dur |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | réelle | 24 | 5 | 9 % | 3 (0, 2, 4 : pas de +2) | – | 73 | 79 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | pressée | 22 | 5 | 29 % | 2 (1, 2 : pas de +1) | – | 23 | 8 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | appliquée | 30 | 5 | 7 % | 3 (1, 2, 3 : pas de +1) | – | 144 | 100 % | très dur |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | réelle | 22 | 5 | 14 % | 2 (3, 1 : pas de -2) | – | 68 | 80 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | pressée | 22 | 5 | 14 % | 2 (4, 1 : pas de -3) | – | 25 | 10 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | appliquée | 30 | 5 | 14 % | 3 (4, 3, 2 : pas de -1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | réelle | 24 | 5 | 13 % | 3 (0, 1, 2 : pas de +1) | – | 37 | 78 % | plus facile |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | pressée | 21 | 5 | 20 % | 3 (0, 2, 4 : pas de +2) | – | 19 | 6 % | plus facile |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | appliquée | 30 | 5 | 14 % | 3 (4, 2, 0 : pas de -2) | – | 78 | 100 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | réelle | 25 | 5 | 13 % | 3 (0, 2, 4 : pas de +2) | – | 64 | 81 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | pressée | 20 | 5 | 11 % | 3 (2, 3, 4 : pas de +1) | – | 26 | 12 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | appliquée | 30 | 5 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 107 | 100 % | plus dur |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | réelle | 20 | 5 | 11 % | 2 (2, 4 : pas de +2) | – | 59 | 70 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | pressée | 22 | 5 | 10 % | 2 (4, 2 : pas de -2) | – | 31 | 14 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | appliquée | 30 | 5 | 10 % | 3 (4, 2, 0 : pas de -2) | – | 142 | 100 % | très dur |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | réelle | 23 | 5 | 9 % | 3 (2, 1, 0 : pas de -1) | – | 101 | 80 % | très dur |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | pressée | 22 | 5 | 10 % | 2 (3, 4 : pas de +1) | – | 24 | 9 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | appliquée | 30 | 5 | 17 % | 2 (2, 3 : pas de +1) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | réelle | 24 | 5 | 9 % | 3 (4, 3, 2 : pas de -1) | – | 36 | 71 % | plus facile |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | pressée | 21 | 5 | 15 % | 3 (0, 1, 2 : pas de +1) | – | 21 | 13 % | plus facile |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | appliquée | 30 | 5 | 14 % | 3 (3, 2, 1 : pas de -1) | – | 77 | 100 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | réelle | 24 | 5 | 22 % | 3 (3, 2, 1 : pas de -1) | – | 55 | 72 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | pressée | 21 | 5 | 15 % | 3 (0, 1, 2 : pas de +1) | – | 27 | 8 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | appliquée | 30 | 5 | 17 % | 2 (0, 3 : pas de +3) | – | 110 | 100 % | plus dur |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | réelle | 22 | 5 | 19 % | 2 (4, 2 : pas de -2) | – | 59 | 77 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | pressée | 19 | 5 | 0 % | 3 (4, 2, 0 : pas de -2) | – | 19 | 5 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | appliquée | 30 | 5 | 10 % | 3 (0, 2, 4 : pas de +2) | – | 142 | 100 % | très dur |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | réelle | 27 | 5 | 12 % | 3 (1, 2, 3 : pas de +1) | – | 86 | 81 % | plus dur |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | pressée | 22 | 5 | 19 % | 3 (2, 3, 4 : pas de +1) | – | 24 | 10 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | appliquée | 30 | 6 | 17 % | 3 (1, 3, 5 : pas de +2) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | réelle | 22 | 6 | 10 % | 3 (4, 2, 0 : pas de -2) | – | 37 | 78 % | plus facile |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | pressée | 20 | 6 | 5 % | 3 (3, 4, 5 : pas de +1) | – | 17 | 8 % | plus facile |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | appliquée | 30 | 6 | 10 % | 3 (1, 2, 3 : pas de +1) | – | 79 | 100 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | réelle | 24 | 6 | 9 % | 3 (1, 3, 5 : pas de +2) | – | 65 | 84 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | pressée | 19 | 6 | 6 % | 3 (0, 1, 2 : pas de +1) | – | 22 | 8 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | appliquée | 30 | 6 | 17 % | 3 (4, 2, 0 : pas de -2) | – | 108 | 100 % | plus dur |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | réelle | 25 | 5 | 17 % | 3 (2, 3, 4 : pas de +1) | – | 88 | 85 % | plus dur |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | pressée | 20 | 5 | 5 % | 3 (2, 1, 0 : pas de -1) | – | 22 | 5 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | appliquée | 30 | 5 | 24 % | 2 (3, 1 : pas de -2) | – | 140 | 100 % | très dur |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | réelle | 26 | 6 | 4 % | 3 (4, 3, 2 : pas de -1) | – | 107 | 79 % | très dur |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | pressée | 20 | 6 | 5 % | 3 (2, 1, 0 : pas de -1) | – | 29 | 13 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | appliquée | 30 | 6 | 3 % | 3 (5, 4, 3 : pas de -1) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | réelle | 25 | 6 | 8 % | 3 (3, 2, 1 : pas de -1) | – | 35 | 73 % | plus facile |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | pressée | 20 | 6 | 11 % | 2 (0, 5 : pas de +5) | – | 19 | 6 % | plus facile |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | appliquée | 30 | 6 | 17 % | 3 (0, 1, 2 : pas de +1) | – | 80 | 100 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | réelle | 24 | 6 | 17 % | 2 (3, 5 : pas de +2) | – | 62 | 78 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | pressée | 20 | 5 | 16 % | 3 (1, 2, 3 : pas de +1) | – | 24 | 9 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | appliquée | 30 | 6 | 10 % | 3 (0, 1, 2 : pas de +1) | – | 110 | 100 % | plus dur |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | réelle | 25 | 6 | 8 % | 3 (2, 1, 0 : pas de -1) | – | 87 | 85 % | plus dur |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | pressée | 19 | 6 | 22 % | 3 (4, 2, 0 : pas de -2) | – | 25 | 9 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | appliquée | 30 | 6 | 7 % | 3 (3, 2, 1 : pas de -1) | – | 140 | 100 % | très dur |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | réelle | 25 | 6 | 17 % | 2 (5, 1 : pas de -4) | – | 109 | 86 % | très dur |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | pressée | 21 | 5 | 5 % | 3 (4, 2, 0 : pas de -2) | – | 25 | 8 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | appliquée | 23 | 9 | 14 % | 3 (14, 24, 34 : pas de +10) | – | 46 | 100 % | plus facile |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | réelle | 18 | 11 | 0 % | 3 (21, 22, 23 : pas de +1) | – | 34 | 75 % | plus facile |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | pressée | 18 | 8 | 6 % | 3 (14, 24, 34 : pas de +10) | – | 16 | 3 % | plus facile |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | appliquée | 23 | 11 | 9 % | 2 (11, 21 : pas de +10) | – | 69 | 100 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | réelle | 14 | 9 | 8 % | 2 (32, 33 : pas de +1) | – | 42 | 54 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | pressée | 19 | 10 | 0 % | 2 (22, 21 : pas de -1) | – | 20 | 8 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | appliquée | 23 | 12 | 9 % | 3 (31, 32, 33 : pas de +1) | – | 98 | 100 % | plus dur |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | réelle | 17 | 10 | 0 % | 2 (13, 22 : pas de +9) | – | 62 | 71 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | pressée | 18 | 8 | 6 % | 2 (11, 21 : pas de +10) | – | 21 | 6 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | appliquée | 23 | 11 | 5 % | 2 (14, 12 : pas de -2) | – | 122 | 100 % | très dur |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | réelle | 17 | 11 | 0 % | 3 (22, 23, 24 : pas de +1) | – | 72 | 72 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | pressée | 18 | 8 | 6 % | 2 (32, 34 : pas de +2) | – | 24 | 8 % | conseillé |
