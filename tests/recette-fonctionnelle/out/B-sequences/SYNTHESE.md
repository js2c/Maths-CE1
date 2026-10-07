# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Additions, famille 12 (passer la dizaine) | plus facile | 25 | 26 | 14 | 56 % |
| Additions, famille 12 (passer la dizaine) | conseillé | 55 | 43 | 14 | 25 % |
| Additions, famille 12 (passer la dizaine) | plus dur | 76 | 61 | 15 | 20 % |
| Additions, famille 12 (passer la dizaine) | très dur | 97 | 69 | 20 | 21 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Additions, famille 12 (passer la dizaine) | plus facile | 47 | 38 | 19 | 40 % |
| Additions, famille 12 (passer la dizaine) | conseillé | 86 | 59 | 22 | 26 % |
| Additions, famille 12 (passer la dizaine) | plus dur | 117 | 85 | 24 | 21 % |
| Additions, famille 12 (passer la dizaine) | très dur | 151 | 73 | 23 | 15 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Additions, famille 12 (passer la dizaine) | plus facile | appliquée | 19 | 5 | 28 % | 2 (13, 11 : pas de -2) | L12×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 12 (passer la dizaine) | plus facile | réelle | 16 | 5 | 13 % | 3 (11, 13, 15 : pas de +2) | L12×1 | 26 | 85 % | plus facile |
| neuve | Additions, famille 12 (passer la dizaine) | plus facile | pressée | 16 | 6 | 0 % | 2 (14, 11 : pas de -3) | L12×1 | 14 | 10 % | plus facile |
| neuve | Additions, famille 12 (passer la dizaine) | conseillé | appliquée | 33 | 9 | 13 % | 2 (11, 14 : pas de +3) | L12×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 12 (passer la dizaine) | conseillé | réelle | 23 | 7 | 0 % | 3 (15, 14, 13 : pas de -1) | L12×1 | 43 | 71 % | conseillé |
| neuve | Additions, famille 12 (passer la dizaine) | conseillé | pressée | 21 | 7 | 5 % | 3 (13, 12, 11 : pas de -1) | L12×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 12 (passer la dizaine) | plus dur | appliquée | 33 | 12 | 3 % | 3 (5, 8, 11 : pas de +3) | L12×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 12 (passer la dizaine) | plus dur | réelle | 24 | 8 | 4 % | 2 (12, 13 : pas de +1) | L12×1 | 61 | 83 % | conseillé |
| neuve | Additions, famille 12 (passer la dizaine) | plus dur | pressée | 22 | 5 | 14 % | 3 (11, 13, 15 : pas de +2) | L12×1 | 15 | 6 % | conseillé |
| neuve | Additions, famille 12 (passer la dizaine) | très dur | appliquée | 33 | 9 | 13 % | 3 (4, 6, 8 : pas de +2) | L12×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 12 (passer la dizaine) | très dur | réelle | 24 | 9 | 0 % | 2 (13, 14 : pas de +1) | L12×1 | 69 | 74 % | conseillé |
| neuve | Additions, famille 12 (passer la dizaine) | très dur | pressée | 23 | 6 | 5 % | 3 (12, 13, 14 : pas de +1) | L12×1 | 20 | 11 % | conseillé |
| mois | Additions, famille 12 (passer la dizaine) | plus facile | appliquée | 19 | 5 | 11 % | 2 (14, 11 : pas de -3) | L12×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 12 (passer la dizaine) | plus facile | réelle | 17 | 5 | 19 % | 2 (12, 15 : pas de +3) | L12×1 | 38 | 84 % | plus facile |
| mois | Additions, famille 12 (passer la dizaine) | plus facile | pressée | 16 | 5 | 20 % | 2 (11, 12 : pas de +1) | L12×1 | 19 | 3 % | plus facile |
| mois | Additions, famille 12 (passer la dizaine) | conseillé | appliquée | 33 | 11 | 16 % | 3 (16, 15, 14 : pas de -1) | L12×1 | 86 | 100 % | conseillé |
| mois | Additions, famille 12 (passer la dizaine) | conseillé | réelle | 25 | 7 | 13 % | 2 (15, 11 : pas de -4) | L12×1 | 59 | 71 % | conseillé |
| mois | Additions, famille 12 (passer la dizaine) | conseillé | pressée | 21 | 6 | 5 % | 2 (11, 15 : pas de +4) | L12×1 | 22 | 5 % | conseillé |
| mois | Additions, famille 12 (passer la dizaine) | plus dur | appliquée | 33 | 11 | 0 % | 2 (14, 13 : pas de -1) | L12×1 | 117 | 100 % | plus dur |
| mois | Additions, famille 12 (passer la dizaine) | plus dur | réelle | 24 | 10 | 0 % | 2 (12, 14 : pas de +2) | L12×1 | 85 | 77 % | plus dur |
| mois | Additions, famille 12 (passer la dizaine) | plus dur | pressée | 23 | 5 | 14 % | 2 (11, 12 : pas de +1) | L12×1 | 24 | 9 % | conseillé |
| mois | Additions, famille 12 (passer la dizaine) | très dur | appliquée | 33 | 8 | 19 % | 3 (7, 5, 3 : pas de -2) | L12×1 | 151 | 100 % | très dur |
| mois | Additions, famille 12 (passer la dizaine) | très dur | réelle | 23 | 9 | 9 % | 2 (15, 8 : pas de -7) | L12×1 | 73 | 70 % | conseillé |
| mois | Additions, famille 12 (passer la dizaine) | très dur | pressée | 21 | 7 | 5 % | 3 (13, 12, 11 : pas de -1) | L12×1 | 23 | 8 % | conseillé |
