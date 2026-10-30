# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Additions, famille 3 (amis de 10) | plus facile | 25 | 21 | 14 | 56 % |
| Additions, famille 3 (amis de 10) | conseillé | 44 | 43 | 16 | 36 % |
| Additions, famille 3 (amis de 10) | plus dur | 59 | 50 | 15 | 25 % |
| Additions, famille 3 (amis de 10) | très dur | 75 | 46 | 18 | 24 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Additions, famille 3 (amis de 10) | plus facile | 46 | 37 | 18 | 39 % |
| Additions, famille 3 (amis de 10) | conseillé | 75 | 55 | 20 | 27 % |
| Additions, famille 3 (amis de 10) | plus dur | 101 | 67 | 23 | 23 % |
| Additions, famille 3 (amis de 10) | très dur | 121 | 72 | 27 | 22 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Additions, famille 3 (amis de 10) | plus facile | appliquée | 19 | 9 | 0 % | 2 (1, 4 : pas de +3) | L5×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | plus facile | réelle | 16 | 7 | 0 % | 2 (6, 8 : pas de +2) | L5×1 | 21 | 73 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | plus facile | pressée | 16 | 6 | 0 % | 3 (7, 6, 5 : pas de -1) | L5×1 | 14 | 9 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | conseillé | appliquée | 22 | 9 | 0 % | 3 (7, 5, 3 : pas de -2) | L5×1 | 44 | 100 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | conseillé | réelle | 22 | 9 | 10 % | 3 (7, 5, 3 : pas de -2) | L5×1 | 43 | 87 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | conseillé | pressée | 22 | 8 | 10 % | 2 (3, 8 : pas de +5) | L5×1 | 16 | 9 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus dur | appliquée | 22 | 9 | 5 % | 3 (5, 3, 1 : pas de -2) | L5×1 | 59 | 100 % | plus dur |
| neuve | Additions, famille 3 (amis de 10) | plus dur | réelle | 22 | 8 | 0 % | 2 (8, 1 : pas de -7) | L5×1 | 50 | 77 % | plus dur |
| neuve | Additions, famille 3 (amis de 10) | plus dur | pressée | 16 | 8 | 7 % | 3 (1, 3, 5 : pas de +2) | L5×1 | 15 | 9 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | très dur | appliquée | 22 | 8 | 5 % | 2 (8, 9 : pas de +1) | L5×1 | 75 | 100 % | très dur |
| neuve | Additions, famille 3 (amis de 10) | très dur | réelle | 22 | 8 | 10 % | 2 (6, 8 : pas de +2) | L5×1 | 46 | 71 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | très dur | pressée | 21 | 9 | 0 % | 3 (9, 8, 7 : pas de -1) | L5×1 | 18 | 11 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus facile | appliquée | 19 | 9 | 0 % | 3 (3, 6, 9 : pas de +3) | L5×1 | 46 | 100 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | réelle | 17 | 8 | 0 % | 2 (4, 7 : pas de +3) | L5×1 | 37 | 80 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | pressée | 16 | 7 | 0 % | 2 (4, 1 : pas de -3) | L5×1 | 18 | 2 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | conseillé | appliquée | 23 | 9 | 0 % | 3 (3, 6, 9 : pas de +3) | L5×1 | 75 | 100 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | réelle | 22 | 9 | 5 % | 2 (4, 7 : pas de +3) | L5×1 | 55 | 67 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | pressée | 21 | 9 | 10 % | 2 (4, 1 : pas de -3) | L5×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | appliquée | 23 | 8 | 5 % | 3 (3, 6, 9 : pas de +3) | L5×1 | 101 | 100 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | plus dur | réelle | 22 | 9 | 0 % | 2 (4, 7 : pas de +3) | L5×1 | 67 | 77 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | pressée | 22 | 9 | 0 % | 3 (8, 6, 4 : pas de -2) | L5×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | très dur | appliquée | 23 | 8 | 5 % | 3 (3, 6, 9 : pas de +3) | L5×1 | 121 | 100 % | très dur |
| mois | Additions, famille 3 (amis de 10) | très dur | réelle | 22 | 9 | 5 % | 3 (9, 6, 3 : pas de -3) | L5×1 | 72 | 68 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | très dur | pressée | 21 | 9 | 5 % | 3 (8, 6, 4 : pas de -2) | L5×1 | 27 | 8 % | conseillé |
