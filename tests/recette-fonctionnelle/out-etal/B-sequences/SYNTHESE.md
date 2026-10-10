# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Étal du pêcheur, niveau 1 (poser) | plus facile | 23 | 22 | 13 | 57 % |
| Étal du pêcheur, niveau 1 (poser) | conseillé | 36 | 33 | 13 | 36 % |
| Étal du pêcheur, niveau 1 (poser) | plus dur | 47 | 50 | 16 | 34 % |
| Étal du pêcheur, niveau 1 (poser) | très dur | 59 | 61 | 15 | 25 % |
| Étal du pêcheur, niveau 2 (payer) | plus facile | 23 | 23 | 18 | 78 % |
| Étal du pêcheur, niveau 2 (payer) | conseillé | 36 | 36 | 23 | 64 % |
| Étal du pêcheur, niveau 2 (payer) | plus dur | 47 | 46 | 18 | 38 % |
| Étal du pêcheur, niveau 2 (payer) | très dur | 59 | 57 | 26 | 44 % |
| Étal du pêcheur, niveau 3 (payer) | plus facile | 22 | 21 | 17 | 77 % |
| Étal du pêcheur, niveau 3 (payer) | conseillé | 37 | 35 | 26 | 70 % |
| Étal du pêcheur, niveau 3 (payer) | plus dur | 50 | 42 | 22 | 44 % |
| Étal du pêcheur, niveau 3 (payer) | très dur | 64 | 61 | 18 | 28 % |
| Étal du pêcheur, niveau 4 (payer) | plus facile | 22 | 25 | 17 | 77 % |
| Étal du pêcheur, niveau 4 (payer) | conseillé | 37 | 39 | 21 | 57 % |
| Étal du pêcheur, niveau 4 (payer) | plus dur | 50 | 43 | 18 | 36 % |
| Étal du pêcheur, niveau 4 (payer) | très dur | 64 | 49 | 23 | 36 % |
| Étal du pêcheur, niveau 5 (restreint) | plus facile | 22 | 23 | 16 | 73 % |
| Étal du pêcheur, niveau 5 (restreint) | conseillé | 37 | 35 | 22 | 59 % |
| Étal du pêcheur, niveau 5 (restreint) | plus dur | 50 | 39 | 26 | 52 % |
| Étal du pêcheur, niveau 5 (restreint) | très dur | 64 | 52 | 24 | 38 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus facile | 22 | 23 | 16 | 73 % |
| Étal du pêcheur, niveau 6 (monnaie) | conseillé | 37 | 36 | 27 | 73 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus dur | 50 | 44 | 23 | 46 % |
| Étal du pêcheur, niveau 6 (monnaie) | très dur | 64 | 63 | 21 | 33 % |
| Étal du pêcheur, niveau 7 (rendre) | plus facile | 23 | 23 | 13 | 57 % |
| Étal du pêcheur, niveau 7 (rendre) | conseillé | 36 | 34 | 14 | 39 % |
| Étal du pêcheur, niveau 7 (rendre) | plus dur | 47 | 46 | 15 | 32 % |
| Étal du pêcheur, niveau 7 (rendre) | très dur | 59 | 59 | 16 | 27 % |
| Étal du pêcheur, niveau 8 (deux) | plus facile | 22 | 24 | 17 | 77 % |
| Étal du pêcheur, niveau 8 (deux) | conseillé | 37 | 34 | 25 | 68 % |
| Étal du pêcheur, niveau 8 (deux) | plus dur | 50 | 43 | 21 | 42 % |
| Étal du pêcheur, niveau 8 (deux) | très dur | 64 | 50 | 20 | 31 % |
| Étal du pêcheur, niveau 9 (payer) | plus facile | 23 | 24 | 18 | 78 % |
| Étal du pêcheur, niveau 9 (payer) | conseillé | 36 | 32 | 23 | 64 % |
| Étal du pêcheur, niveau 9 (payer) | plus dur | 47 | 36 | 21 | 45 % |
| Étal du pêcheur, niveau 9 (payer) | très dur | 59 | 63 | 25 | 42 % |
| Étal du pêcheur, niveau 10 (payer) | plus facile | 22 | 24 | 18 | 82 % |
| Étal du pêcheur, niveau 10 (payer) | conseillé | 37 | 33 | 21 | 57 % |
| Étal du pêcheur, niveau 10 (payer) | plus dur | 50 | 49 | 21 | 42 % |
| Étal du pêcheur, niveau 10 (payer) | très dur | 64 | 70 | 26 | 41 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Étal du pêcheur, niveau 1 (poser) | plus facile | 43 | 32 | 19 | 44 % |
| Étal du pêcheur, niveau 1 (poser) | conseillé | 63 | 50 | 20 | 32 % |
| Étal du pêcheur, niveau 1 (poser) | plus dur | 83 | 54 | 18 | 22 % |
| Étal du pêcheur, niveau 1 (poser) | très dur | 105 | 90 | 19 | 18 % |
| Étal du pêcheur, niveau 2 (payer) | plus facile | 43 | 32 | 23 | 53 % |
| Étal du pêcheur, niveau 2 (payer) | conseillé | 63 | 49 | 27 | 43 % |
| Étal du pêcheur, niveau 2 (payer) | plus dur | 83 | 52 | 25 | 30 % |
| Étal du pêcheur, niveau 2 (payer) | très dur | 105 | 56 | 27 | 26 % |
| Étal du pêcheur, niveau 3 (payer) | plus facile | 42 | 30 | 22 | 52 % |
| Étal du pêcheur, niveau 3 (payer) | conseillé | 64 | 48 | 28 | 44 % |
| Étal du pêcheur, niveau 3 (payer) | plus dur | 86 | 57 | 27 | 31 % |
| Étal du pêcheur, niveau 3 (payer) | très dur | 110 | 78 | 27 | 25 % |
| Étal du pêcheur, niveau 4 (payer) | plus facile | 42 | 32 | 22 | 52 % |
| Étal du pêcheur, niveau 4 (payer) | conseillé | 64 | 51 | 30 | 47 % |
| Étal du pêcheur, niveau 4 (payer) | plus dur | 86 | 54 | 27 | 31 % |
| Étal du pêcheur, niveau 4 (payer) | très dur | 110 | 71 | 27 | 25 % |
| Étal du pêcheur, niveau 5 (restreint) | plus facile | 42 | 35 | 24 | 57 % |
| Étal du pêcheur, niveau 5 (restreint) | conseillé | 64 | 54 | 28 | 44 % |
| Étal du pêcheur, niveau 5 (restreint) | plus dur | 86 | 54 | 29 | 34 % |
| Étal du pêcheur, niveau 5 (restreint) | très dur | 110 | 61 | 28 | 25 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus facile | 42 | 33 | 23 | 55 % |
| Étal du pêcheur, niveau 6 (monnaie) | conseillé | 64 | 49 | 30 | 47 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus dur | 86 | 50 | 26 | 30 % |
| Étal du pêcheur, niveau 6 (monnaie) | très dur | 110 | 70 | 31 | 28 % |
| Étal du pêcheur, niveau 7 (rendre) | plus facile | 43 | 31 | 19 | 44 % |
| Étal du pêcheur, niveau 7 (rendre) | conseillé | 63 | 53 | 20 | 32 % |
| Étal du pêcheur, niveau 7 (rendre) | plus dur | 83 | 64 | 22 | 27 % |
| Étal du pêcheur, niveau 7 (rendre) | très dur | 105 | 76 | 21 | 20 % |
| Étal du pêcheur, niveau 8 (deux) | plus facile | 42 | 32 | 23 | 55 % |
| Étal du pêcheur, niveau 8 (deux) | conseillé | 64 | 57 | 32 | 50 % |
| Étal du pêcheur, niveau 8 (deux) | plus dur | 86 | 60 | 31 | 36 % |
| Étal du pêcheur, niveau 8 (deux) | très dur | 110 | 75 | 26 | 24 % |
| Étal du pêcheur, niveau 9 (payer) | plus facile | 43 | 31 | 25 | 58 % |
| Étal du pêcheur, niveau 9 (payer) | conseillé | 63 | 43 | 31 | 49 % |
| Étal du pêcheur, niveau 9 (payer) | plus dur | 83 | 73 | 26 | 31 % |
| Étal du pêcheur, niveau 9 (payer) | très dur | 105 | 63 | 30 | 29 % |
| Étal du pêcheur, niveau 10 (payer) | plus facile | 42 | 29 | 23 | 55 % |
| Étal du pêcheur, niveau 10 (payer) | conseillé | 64 | 52 | 27 | 42 % |
| Étal du pêcheur, niveau 10 (payer) | plus dur | 86 | 45 | 29 | 34 % |
| Étal du pêcheur, niveau 10 (payer) | très dur | 110 | 89 | 32 | 29 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Étal du pêcheur, niveau 1 (poser) | plus facile | appliquée | 14 | 5 | 0 % | aucune | L15×1 | 23 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 1 (poser) | plus facile | réelle | 13 | 6 | 0 % | aucune | L15×1 | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 1 (poser) | plus facile | pressée | 13 | 6 | 0 % | aucune | L15×1 | 13 | 4 % | plus facile |
| neuve | Étal du pêcheur, niveau 1 (poser) | conseillé | appliquée | 14 | 5 | 0 % | aucune | L15×1 | 36 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 1 (poser) | conseillé | réelle | 14 | 6 | 0 % | aucune | L15×1 | 33 | 83 % | conseillé |
| neuve | Étal du pêcheur, niveau 1 (poser) | conseillé | pressée | 13 | 6 | 0 % | aucune | L15×1 | 13 | 4 % | conseillé |
| neuve | Étal du pêcheur, niveau 1 (poser) | plus dur | appliquée | 14 | 6 | 0 % | aucune | L15×1 | 47 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 1 (poser) | plus dur | réelle | 12 | 5 | 0 % | aucune | L15×1 | 50 | 89 % | plus dur |
| neuve | Étal du pêcheur, niveau 1 (poser) | plus dur | pressée | 13 | 6 | 0 % | aucune | L15×1 | 16 | 11 % | conseillé |
| neuve | Étal du pêcheur, niveau 1 (poser) | très dur | appliquée | 14 | 6 | 0 % | aucune | L15×1 | 59 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 1 (poser) | très dur | réelle | 14 | 6 | 0 % | aucune | L15×1 | 61 | 92 % | très dur |
| neuve | Étal du pêcheur, niveau 1 (poser) | très dur | pressée | 13 | 6 | 0 % | aucune | L15×1 | 15 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus facile | appliquée | 14 | 8 | 0 % | aucune | L16×1 | 23 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus facile | réelle | 12 | 6 | 0 % | aucune | L16×1 | 23 | 87 % | plus facile |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus facile | pressée | 15 | 9 | 0 % | aucune | L16×1 | 18 | 4 % | plus facile |
| neuve | Étal du pêcheur, niveau 2 (payer) | conseillé | appliquée | 14 | 8 | 0 % | aucune | L16×1 | 36 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | conseillé | réelle | 12 | 7 | 0 % | aucune | L16×1 | 36 | 88 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | conseillé | pressée | 14 | 7 | 0 % | aucune | L16×1 | 23 | 14 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus dur | appliquée | 14 | 6 | 0 % | aucune | L16×1 | 47 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus dur | réelle | 12 | 7 | 0 % | aucune | L16×1 | 46 | 83 % | plus dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus dur | pressée | 11 | 6 | 0 % | aucune | L16×1 L15×1 | 18 | 4 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | très dur | appliquée | 14 | 6 | 0 % | aucune | L16×1 | 59 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | très dur | réelle | 12 | 6 | 0 % | aucune | L16×1 | 57 | 88 % | très dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | très dur | pressée | 12 | 7 | 0 % | aucune | L16×1 L15×1 | 26 | 12 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus facile | appliquée | 18 | 10 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus facile | réelle | 10 | 8 | 0 % | aucune | L16×1 | 21 | 78 % | plus facile |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus facile | pressée | 14 | 8 | 0 % | aucune | L16×1 | 17 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 3 (payer) | conseillé | appliquée | 18 | 11 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | conseillé | réelle | 11 | 9 | 0 % | aucune | L16×1 | 35 | 74 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | conseillé | pressée | 14 | 8 | 0 % | aucune | L16×1 | 26 | 17 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus dur | réelle | 13 | 6 | 0 % | aucune | L16×1 | 42 | 87 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus dur | pressée | 14 | 9 | 0 % | aucune | L16×1 | 22 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | très dur | appliquée | 18 | 8 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 3 (payer) | très dur | réelle | 11 | 8 | 0 % | aucune | L16×1 | 61 | 85 % | très dur |
| neuve | Étal du pêcheur, niveau 3 (payer) | très dur | pressée | 13 | 8 | 0 % | aucune | L16×1 | 18 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus facile | réelle | 12 | 9 | 0 % | aucune | L16×1 | 25 | 79 % | plus facile |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus facile | pressée | 14 | 11 | 0 % | aucune | L16×1 | 17 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 4 (payer) | conseillé | appliquée | 18 | 16 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | conseillé | réelle | 16 | 14 | 0 % | aucune | – | 39 | 80 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | conseillé | pressée | 13 | 10 | 0 % | aucune | L16×1 | 21 | 11 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus dur | appliquée | 18 | 13 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus dur | réelle | 11 | 10 | 0 % | aucune | L16×1 | 43 | 79 % | plus dur |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus dur | pressée | 13 | 9 | 0 % | aucune | L16×1 | 18 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | très dur | appliquée | 18 | 13 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 4 (payer) | très dur | réelle | 11 | 8 | 0 % | aucune | L16×1 | 49 | 74 % | plus dur |
| neuve | Étal du pêcheur, niveau 4 (payer) | très dur | pressée | 14 | 11 | 0 % | aucune | L16×1 | 23 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus facile | réelle | 16 | 15 | 0 % | aucune | L16×1 | 23 | 87 % | plus facile |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus facile | pressée | 13 | 7 | 0 % | aucune | L16×1 | 16 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 5 (restreint) | conseillé | appliquée | 18 | 14 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | conseillé | réelle | 10 | 9 | 0 % | aucune | L16×1 | 35 | 72 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | conseillé | pressée | 12 | 8 | 0 % | aucune | L16×1 | 22 | 18 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus dur | appliquée | 18 | 12 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus dur | réelle | 12 | 9 | 0 % | aucune | L16×1 | 39 | 74 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus dur | pressée | 14 | 11 | 0 % | aucune | L16×1 | 26 | 14 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | très dur | appliquée | 18 | 11 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 5 (restreint) | très dur | réelle | 12 | 10 | 0 % | aucune | L16×1 | 52 | 73 % | plus dur |
| neuve | Étal du pêcheur, niveau 5 (restreint) | très dur | pressée | 14 | 12 | 0 % | aucune | L16×1 | 24 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus facile | appliquée | 18 | 12 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus facile | réelle | 16 | 11 | 0 % | aucune | – | 23 | 86 % | plus facile |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus facile | pressée | 13 | 10 | 0 % | aucune | L17×1 | 16 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | conseillé | appliquée | 18 | 13 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | conseillé | réelle | 12 | 9 | 0 % | aucune | L17×1 | 36 | 81 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | conseillé | pressée | 14 | 11 | 0 % | aucune | L17×1 | 27 | 17 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus dur | réelle | 11 | 8 | 0 % | aucune | L17×1 | 44 | 79 % | plus dur |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus dur | pressée | 13 | 9 | 0 % | aucune | L17×1 | 23 | 14 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | très dur | appliquée | 18 | 8 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | très dur | réelle | 16 | 11 | 0 % | aucune | L17×1 | 63 | 82 % | très dur |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | très dur | pressée | 14 | 8 | 0 % | aucune | L17×1 | 21 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus facile | appliquée | 14 | 9 | 0 % | aucune | L17×1 | 23 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus facile | réelle | 12 | 9 | 0 % | aucune | L17×1 | 23 | 83 % | plus facile |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus facile | pressée | 13 | 7 | 0 % | aucune | L17×1 | 13 | 4 % | plus facile |
| neuve | Étal du pêcheur, niveau 7 (rendre) | conseillé | appliquée | 14 | 11 | 0 % | aucune | L17×1 | 36 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | conseillé | réelle | 12 | 8 | 0 % | aucune | L17×1 | 34 | 83 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | conseillé | pressée | 13 | 6 | 0 % | aucune | L17×1 | 14 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus dur | appliquée | 14 | 8 | 0 % | aucune | L17×1 | 47 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus dur | réelle | 12 | 9 | 0 % | aucune | L17×1 | 46 | 92 % | plus dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus dur | pressée | 13 | 7 | 0 % | aucune | L17×1 | 15 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | très dur | appliquée | 14 | 6 | 0 % | aucune | L17×1 | 59 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | très dur | réelle | 12 | 7 | 0 % | aucune | L17×1 | 59 | 92 % | très dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | très dur | pressée | 13 | 9 | 0 % | aucune | L17×1 | 16 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus facile | réelle | 16 | 10 | 0 % | aucune | – | 24 | 84 % | plus facile |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus facile | pressée | 14 | 10 | 0 % | aucune | L16×1 | 17 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 8 (deux) | conseillé | appliquée | 18 | 15 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | conseillé | réelle | 15 | 11 | 0 % | aucune | – | 34 | 92 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | conseillé | pressée | 14 | 9 | 0 % | aucune | L16×1 | 25 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus dur | appliquée | 18 | 10 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus dur | réelle | 10 | 9 | 0 % | aucune | L16×1 | 43 | 78 % | plus dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus dur | pressée | 13 | 9 | 0 % | aucune | L16×1 | 21 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | très dur | appliquée | 18 | 10 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | très dur | réelle | 11 | 6 | 10 % | 2 (2400, 2400 : même réponse) | L16×1 | 50 | 86 % | plus dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | très dur | pressée | 13 | 9 | 0 % | aucune | L16×1 | 20 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus facile | appliquée | 14 | 9 | 0 % | aucune | L18×1 | 23 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus facile | réelle | 13 | 10 | 0 % | aucune | L18×1 | 24 | 83 % | plus facile |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus facile | pressée | 15 | 7 | 0 % | aucune | L18×1 | 18 | 4 % | plus facile |
| neuve | Étal du pêcheur, niveau 9 (payer) | conseillé | appliquée | 14 | 8 | 0 % | aucune | L18×1 | 36 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | conseillé | réelle | 11 | 6 | 0 % | aucune | L18×1 | 32 | 74 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | conseillé | pressée | 15 | 9 | 0 % | aucune | L18×1 | 23 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus dur | appliquée | 14 | 7 | 0 % | aucune | L18×1 | 47 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus dur | réelle | 11 | 8 | 0 % | aucune | L18×1 | 36 | 68 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus dur | pressée | 14 | 8 | 0 % | aucune | L18×1 | 21 | 4 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | très dur | appliquée | 14 | 8 | 0 % | aucune | L18×1 | 59 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 9 (payer) | très dur | réelle | 13 | 6 | 0 % | aucune | L18×1 | 63 | 82 % | très dur |
| neuve | Étal du pêcheur, niveau 9 (payer) | très dur | pressée | 14 | 7 | 0 % | aucune | L18×1 | 25 | 11 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus facile | réelle | 11 | 9 | 0 % | aucune | L18×1 | 24 | 75 % | plus facile |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus facile | pressée | 14 | 11 | 0 % | aucune | L18×1 | 18 | 10 % | plus facile |
| neuve | Étal du pêcheur, niveau 10 (payer) | conseillé | appliquée | 18 | 18 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | conseillé | réelle | 12 | 10 | 0 % | aucune | L18×1 | 33 | 57 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | conseillé | pressée | 14 | 11 | 0 % | aucune | L18×1 | 21 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus dur | appliquée | 18 | 15 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus dur | réelle | 15 | 13 | 0 % | 2 (990, 980 : pas de -10) | L18×1 | 49 | 92 % | plus dur |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus dur | pressée | 13 | 8 | 0 % | aucune | L18×1 | 21 | 11 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | très dur | appliquée | 18 | 15 | 0 % | 2 (580, 570 : pas de -10) | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 10 (payer) | très dur | réelle | 15 | 9 | 0 % | aucune | – | 70 | 81 % | très dur |
| neuve | Étal du pêcheur, niveau 10 (payer) | très dur | pressée | 14 | 11 | 0 % | aucune | L18×1 | 26 | 10 % | conseillé |
| mois | Étal du pêcheur, niveau 1 (poser) | plus facile | appliquée | 14 | 5 | 0 % | aucune | L15×1 | 43 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 1 (poser) | plus facile | réelle | 11 | 6 | 0 % | aucune | L15×1 | 32 | 70 % | plus facile |
| mois | Étal du pêcheur, niveau 1 (poser) | plus facile | pressée | 13 | 6 | 0 % | aucune | L15×1 | 19 | 7 % | plus facile |
| mois | Étal du pêcheur, niveau 1 (poser) | conseillé | appliquée | 14 | 6 | 0 % | aucune | L15×1 | 63 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 1 (poser) | conseillé | réelle | 11 | 5 | 0 % | aucune | L15×1 | 50 | 76 % | conseillé |
| mois | Étal du pêcheur, niveau 1 (poser) | conseillé | pressée | 13 | 6 | 0 % | aucune | L15×1 | 20 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 1 (poser) | plus dur | appliquée | 14 | 6 | 0 % | aucune | L15×1 | 83 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 1 (poser) | plus dur | réelle | 12 | 6 | 0 % | aucune | L15×1 | 54 | 74 % | conseillé |
| mois | Étal du pêcheur, niveau 1 (poser) | plus dur | pressée | 13 | 6 | 0 % | aucune | L15×1 | 18 | 2 % | conseillé |
| mois | Étal du pêcheur, niveau 1 (poser) | très dur | appliquée | 14 | 6 | 0 % | aucune | L15×1 | 105 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 1 (poser) | très dur | réelle | 12 | 6 | 0 % | aucune | L15×1 | 90 | 85 % | très dur |
| mois | Étal du pêcheur, niveau 1 (poser) | très dur | pressée | 13 | 6 | 0 % | aucune | L15×1 | 19 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | plus facile | appliquée | 14 | 7 | 0 % | aucune | L16×1 | 43 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 2 (payer) | plus facile | réelle | 11 | 8 | 0 % | aucune | L16×1 | 32 | 68 % | plus facile |
| mois | Étal du pêcheur, niveau 2 (payer) | plus facile | pressée | 12 | 7 | 0 % | aucune | L16×1 L15×1 | 23 | 4 % | plus facile |
| mois | Étal du pêcheur, niveau 2 (payer) | conseillé | appliquée | 14 | 7 | 0 % | aucune | L16×1 | 63 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | conseillé | réelle | 13 | 7 | 0 % | aucune | L16×1 | 49 | 70 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | conseillé | pressée | 14 | 7 | 0 % | aucune | L16×1 | 27 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | plus dur | appliquée | 14 | 6 | 0 % | aucune | L16×1 | 83 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 2 (payer) | plus dur | réelle | 12 | 8 | 0 % | aucune | L16×1 | 52 | 77 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | plus dur | pressée | 10 | 5 | 0 % | aucune | L16×1 L15×1 | 25 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | très dur | appliquée | 14 | 6 | 0 % | aucune | L16×1 | 105 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 2 (payer) | très dur | réelle | 14 | 7 | 0 % | aucune | L16×1 | 56 | 66 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | très dur | pressée | 14 | 7 | 0 % | aucune | L16×1 | 27 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | plus facile | appliquée | 18 | 11 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 3 (payer) | plus facile | réelle | 12 | 7 | 0 % | aucune | L16×1 | 30 | 67 % | plus facile |
| mois | Étal du pêcheur, niveau 3 (payer) | plus facile | pressée | 13 | 7 | 0 % | aucune | L16×1 | 22 | 8 % | plus facile |
| mois | Étal du pêcheur, niveau 3 (payer) | conseillé | appliquée | 18 | 11 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | conseillé | réelle | 11 | 9 | 0 % | aucune | L16×1 | 48 | 72 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | conseillé | pressée | 14 | 11 | 0 % | aucune | L16×1 | 28 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 3 (payer) | plus dur | réelle | 10 | 9 | 0 % | aucune | L16×1 | 57 | 73 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | plus dur | pressée | 14 | 10 | 0 % | aucune | L16×1 | 27 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | très dur | appliquée | 18 | 7 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 3 (payer) | très dur | réelle | 13 | 8 | 0 % | aucune | L16×1 | 78 | 68 % | plus dur |
| mois | Étal du pêcheur, niveau 3 (payer) | très dur | pressée | 13 | 8 | 0 % | aucune | L16×1 | 27 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 4 (payer) | plus facile | réelle | 11 | 9 | 0 % | aucune | L16×1 | 32 | 73 % | plus facile |
| mois | Étal du pêcheur, niveau 4 (payer) | plus facile | pressée | 13 | 9 | 0 % | aucune | L16×1 | 22 | 5 % | plus facile |
| mois | Étal du pêcheur, niveau 4 (payer) | conseillé | appliquée | 18 | 14 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | conseillé | réelle | 13 | 11 | 0 % | aucune | L16×1 | 51 | 92 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | conseillé | pressée | 14 | 10 | 0 % | aucune | L16×1 | 30 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | plus dur | appliquée | 18 | 11 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 4 (payer) | plus dur | réelle | 10 | 8 | 0 % | aucune | L16×1 | 54 | 70 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | plus dur | pressée | 13 | 11 | 0 % | aucune | L16×1 | 27 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | très dur | appliquée | 18 | 12 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 4 (payer) | très dur | réelle | 10 | 8 | 0 % | aucune | L16×1 | 71 | 76 % | plus dur |
| mois | Étal du pêcheur, niveau 4 (payer) | très dur | pressée | 14 | 9 | 0 % | aucune | L16×1 | 27 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus facile | appliquée | 18 | 14 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus facile | réelle | 14 | 12 | 0 % | aucune | L16×1 | 35 | 78 % | plus facile |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus facile | pressée | 14 | 10 | 0 % | aucune | L16×1 | 24 | 7 % | plus facile |
| mois | Étal du pêcheur, niveau 5 (restreint) | conseillé | appliquée | 18 | 12 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | conseillé | réelle | 16 | 12 | 0 % | aucune | – | 54 | 91 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | conseillé | pressée | 14 | 10 | 0 % | aucune | L16×1 | 28 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus dur | appliquée | 18 | 10 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus dur | réelle | 10 | 8 | 0 % | aucune | L16×1 | 54 | 70 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus dur | pressée | 14 | 11 | 0 % | aucune | L16×1 | 29 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | très dur | appliquée | 18 | 8 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 5 (restreint) | très dur | réelle | 12 | 9 | 0 % | aucune | L16×1 | 61 | 68 % | plus dur |
| mois | Étal du pêcheur, niveau 5 (restreint) | très dur | pressée | 9 | 8 | 0 % | aucune | L16×1 L15×1 | 28 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus facile | appliquée | 18 | 12 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus facile | réelle | 10 | 7 | 0 % | aucune | L17×1 | 33 | 65 % | plus facile |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus facile | pressée | 13 | 8 | 0 % | aucune | L17×1 | 23 | 7 % | plus facile |
| mois | Étal du pêcheur, niveau 6 (monnaie) | conseillé | appliquée | 18 | 11 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | conseillé | réelle | 15 | 11 | 0 % | aucune | – | 49 | 76 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | conseillé | pressée | 14 | 9 | 0 % | aucune | L17×1 | 30 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus dur | réelle | 16 | 9 | 0 % | aucune | – | 50 | 83 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus dur | pressée | 13 | 9 | 0 % | aucune | L17×1 | 26 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | très dur | appliquée | 18 | 8 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 6 (monnaie) | très dur | réelle | 11 | 6 | 0 % | aucune | L17×1 | 70 | 79 % | plus dur |
| mois | Étal du pêcheur, niveau 6 (monnaie) | très dur | pressée | 14 | 10 | 0 % | aucune | L17×1 | 31 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus facile | appliquée | 14 | 9 | 8 % | 2 (400, 400 : même réponse) | L17×1 | 43 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus facile | réelle | 10 | 7 | 0 % | aucune | L17×1 | 31 | 70 % | plus facile |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus facile | pressée | 13 | 7 | 0 % | aucune | L17×1 | 19 | 3 % | plus facile |
| mois | Étal du pêcheur, niveau 7 (rendre) | conseillé | appliquée | 14 | 11 | 0 % | aucune | L17×1 | 63 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | conseillé | réelle | 12 | 9 | 0 % | aucune | L17×1 | 53 | 82 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | conseillé | pressée | 13 | 6 | 0 % | aucune | L17×1 | 20 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus dur | appliquée | 14 | 8 | 0 % | aucune | L17×1 | 83 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus dur | réelle | 12 | 8 | 0 % | aucune | L17×1 | 64 | 79 % | plus dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus dur | pressée | 13 | 7 | 0 % | aucune | L17×1 | 22 | 9 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | très dur | appliquée | 14 | 9 | 0 % | aucune | L17×1 | 105 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | très dur | réelle | 12 | 8 | 0 % | aucune | L17×1 | 76 | 72 % | très dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | très dur | pressée | 13 | 6 | 0 % | aucune | L17×1 | 21 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | plus facile | appliquée | 18 | 16 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 8 (deux) | plus facile | réelle | 14 | 10 | 0 % | aucune | L16×1 | 32 | 68 % | plus facile |
| mois | Étal du pêcheur, niveau 8 (deux) | plus facile | pressée | 13 | 10 | 0 % | aucune | L16×1 | 23 | 8 % | plus facile |
| mois | Étal du pêcheur, niveau 8 (deux) | conseillé | appliquée | 18 | 15 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | conseillé | réelle | 15 | 12 | 0 % | aucune | L16×1 | 57 | 81 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | conseillé | pressée | 14 | 10 | 0 % | aucune | L16×1 | 32 | 8 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | plus dur | appliquée | 18 | 10 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 8 (deux) | plus dur | réelle | 13 | 12 | 0 % | aucune | L16×1 | 60 | 75 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | plus dur | pressée | 14 | 9 | 0 % | aucune | L16×1 | 31 | 8 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | très dur | appliquée | 18 | 10 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 8 (deux) | très dur | réelle | 14 | 8 | 0 % | aucune | – | 75 | 78 % | plus dur |
| mois | Étal du pêcheur, niveau 8 (deux) | très dur | pressée | 13 | 9 | 0 % | aucune | L16×1 | 26 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | plus facile | appliquée | 14 | 8 | 0 % | aucune | L18×1 | 43 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 9 (payer) | plus facile | réelle | 13 | 10 | 0 % | aucune | L18×1 | 31 | 72 % | plus facile |
| mois | Étal du pêcheur, niveau 9 (payer) | plus facile | pressée | 14 | 7 | 0 % | aucune | L18×1 | 25 | 8 % | plus facile |
| mois | Étal du pêcheur, niveau 9 (payer) | conseillé | appliquée | 14 | 9 | 0 % | aucune | L18×1 | 63 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | conseillé | réelle | 11 | 8 | 0 % | aucune | L18×1 | 43 | 62 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | conseillé | pressée | 15 | 9 | 0 % | aucune | L18×1 | 31 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | plus dur | appliquée | 14 | 7 | 0 % | aucune | L18×1 | 83 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 9 (payer) | plus dur | réelle | 14 | 8 | 0 % | aucune | L18×1 | 73 | 90 % | plus dur |
| mois | Étal du pêcheur, niveau 9 (payer) | plus dur | pressée | 14 | 8 | 0 % | aucune | L18×1 | 26 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | très dur | appliquée | 14 | 7 | 0 % | aucune | L18×1 | 105 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 9 (payer) | très dur | réelle | 13 | 7 | 0 % | aucune | L18×1 | 63 | 74 % | plus dur |
| mois | Étal du pêcheur, niveau 9 (payer) | très dur | pressée | 15 | 8 | 0 % | aucune | L18×1 | 30 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | plus facile | appliquée | 18 | 17 | 0 % | 2 (530, 520 : pas de -10) | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 10 (payer) | plus facile | réelle | 14 | 13 | 0 % | aucune | L18×1 | 29 | 56 % | plus facile |
| mois | Étal du pêcheur, niveau 10 (payer) | plus facile | pressée | 14 | 12 | 0 % | aucune | L18×1 | 23 | 7 % | plus facile |
| mois | Étal du pêcheur, niveau 10 (payer) | conseillé | appliquée | 18 | 17 | 0 % | 2 (550, 540 : pas de -10) | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | conseillé | réelle | 16 | 16 | 0 % | aucune | – | 52 | 81 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | conseillé | pressée | 13 | 8 | 0 % | aucune | L18×1 | 27 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | plus dur | appliquée | 18 | 14 | 0 % | 2 (790, 780 : pas de -10) | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 10 (payer) | plus dur | réelle | 10 | 8 | 0 % | aucune | L18×1 | 45 | 64 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | plus dur | pressée | 14 | 11 | 0 % | aucune | L18×1 | 29 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | très dur | appliquée | 18 | 17 | 0 % | 2 (730, 720 : pas de -10) | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 10 (payer) | très dur | réelle | 15 | 12 | 0 % | 2 (930, 940 : pas de +10) | – | 89 | 79 % | très dur |
| mois | Étal du pêcheur, niveau 10 (payer) | très dur | pressée | 14 | 12 | 0 % | aucune | L18×1 | 32 | 7 % | conseillé |
