# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 27 | 24 | 11 | 41 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 60 | 42 | 14 | 23 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 83 | 40 | 12 | 14 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 112 | 59 | 11 | 10 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 47 | 35 | 16 | 34 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 90 | 68 | 17 | 19 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 123 | 54 | 17 | 14 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 158 | 86 | 19 | 12 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | appliquée | 29 | 22 | 4 % | 2 (16, 18 : pas de +2) | – | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | réelle | 24 | 20 | 0 % | 2 (58, 56 : pas de -2) | – | 24 | 82 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | pressée | 19 | 11 | 6 % | 2 (49, 46 : pas de -3) | – | 11 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | appliquée | 41 | 28 | 0 % | 2 (19, 16 : pas de -3) | – | 60 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | réelle | 26 | 19 | 4 % | 2 (44, 34 : pas de -10) | – | 42 | 76 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | pressée | 24 | 14 | 0 % | 2 (77, 85 : pas de +8) | – | 14 | 6 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | appliquée | 40 | 28 | 0 % | 2 (43, 37 : pas de -6) | – | 83 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | réelle | 25 | 16 | 0 % | 2 (79, 76 : pas de -3) | – | 40 | 62 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | pressée | 22 | 15 | 0 % | 2 (35, 27 : pas de -8) | – | 12 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | appliquée | 42 | 5 | 24 % | 3 (4, 6, 8 : pas de +2) | – | 112 | 100 % | très dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | réelle | 27 | 15 | 8 % | 3 (8, 7, 6 : pas de -1) | – | 59 | 75 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | pressée | 22 | 13 | 0 % | 2 (58, 64 : pas de +6) | – | 11 | 3 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | appliquée | 29 | 22 | 0 % | 2 (47, 46 : pas de -1) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | réelle | 21 | 16 | 5 % | 3 (49, 58, 67 : pas de +9) | – | 35 | 78 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | pressée | 19 | 9 | 0 % | 2 (28, 26 : pas de -2) | – | 16 | 5 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | appliquée | 41 | 26 | 3 % | 2 (78, 68 : pas de -10) | – | 90 | 100 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | réelle | 30 | 18 | 0 % | 2 (58, 68 : pas de +10) | – | 68 | 81 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | pressée | 22 | 14 | 0 % | 2 (49, 45 : pas de -4) | – | 17 | 2 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | appliquée | 41 | 27 | 0 % | 2 (88, 89 : pas de +1) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | réelle | 26 | 16 | 0 % | 2 (33, 35 : pas de +2) | – | 54 | 66 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | pressée | 21 | 10 | 5 % | 2 (74, 64 : pas de -10) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | appliquée | 40 | 6 | 8 % | 3 (3, 5, 7 : pas de +2) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | réelle | 27 | 19 | 0 % | 2 (7, 8 : pas de +1) | – | 86 | 77 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | pressée | 22 | 13 | 0 % | 3 (19, 17, 15 : pas de -2) | – | 19 | 5 % | conseillé |
