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
| Étal du pêcheur, niveau 2 (payer) | plus facile | 23 | 24 | 17 | 74 % |
| Étal du pêcheur, niveau 2 (payer) | conseillé | 36 | 36 | 25 | 69 % |
| Étal du pêcheur, niveau 2 (payer) | plus dur | 47 | 44 | 25 | 53 % |
| Étal du pêcheur, niveau 2 (payer) | très dur | 59 | 53 | 23 | 39 % |
| Étal du pêcheur, niveau 3 (payer) | plus facile | 22 | 21 | 15 | 68 % |
| Étal du pêcheur, niveau 3 (payer) | conseillé | 37 | 33 | 25 | 68 % |
| Étal du pêcheur, niveau 3 (payer) | plus dur | 50 | 41 | 24 | 48 % |
| Étal du pêcheur, niveau 3 (payer) | très dur | 64 | 55 | 24 | 38 % |
| Étal du pêcheur, niveau 4 (payer) | plus facile | 22 | 24 | 17 | 77 % |
| Étal du pêcheur, niveau 4 (payer) | conseillé | 37 | 37 | 26 | 70 % |
| Étal du pêcheur, niveau 4 (payer) | plus dur | 50 | 39 | 20 | 40 % |
| Étal du pêcheur, niveau 4 (payer) | très dur | 64 | 46 | 20 | 31 % |
| Étal du pêcheur, niveau 5 (restreint) | plus facile | 22 | 22 | 16 | 73 % |
| Étal du pêcheur, niveau 5 (restreint) | conseillé | 37 | 35 | 24 | 65 % |
| Étal du pêcheur, niveau 5 (restreint) | plus dur | 50 | 39 | 25 | 50 % |
| Étal du pêcheur, niveau 5 (restreint) | très dur | 64 | 53 | 18 | 28 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus facile | 22 | 24 | 18 | 82 % |
| Étal du pêcheur, niveau 6 (monnaie) | conseillé | 37 | 36 | 25 | 68 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus dur | 50 | 35 | 26 | 52 % |
| Étal du pêcheur, niveau 6 (monnaie) | très dur | 64 | 58 | 20 | 31 % |
| Étal du pêcheur, niveau 7 (rendre) | plus facile | 23 | 22 | 13 | 57 % |
| Étal du pêcheur, niveau 7 (rendre) | conseillé | 36 | 33 | 14 | 39 % |
| Étal du pêcheur, niveau 7 (rendre) | plus dur | 47 | 46 | 15 | 32 % |
| Étal du pêcheur, niveau 7 (rendre) | très dur | 59 | 55 | 16 | 27 % |
| Étal du pêcheur, niveau 8 (deux) | plus facile | 22 | 24 | 16 | 73 % |
| Étal du pêcheur, niveau 8 (deux) | conseillé | 37 | 32 | 24 | 65 % |
| Étal du pêcheur, niveau 8 (deux) | plus dur | 50 | 44 | 20 | 40 % |
| Étal du pêcheur, niveau 8 (deux) | très dur | 64 | 53 | 19 | 30 % |
| Étal du pêcheur, niveau 9 (payer) | plus facile | 23 | 24 | 18 | 78 % |
| Étal du pêcheur, niveau 9 (payer) | conseillé | 36 | 34 | 23 | 64 % |
| Étal du pêcheur, niveau 9 (payer) | plus dur | 47 | 38 | 25 | 53 % |
| Étal du pêcheur, niveau 9 (payer) | très dur | 59 | 63 | 28 | 47 % |
| Étal du pêcheur, niveau 10 (payer) | plus facile | 22 | 25 | 18 | 82 % |
| Étal du pêcheur, niveau 10 (payer) | conseillé | 37 | 35 | 24 | 65 % |
| Étal du pêcheur, niveau 10 (payer) | plus dur | 50 | 39 | 21 | 42 % |
| Étal du pêcheur, niveau 10 (payer) | très dur | 64 | 74 | 28 | 44 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Étal du pêcheur, niveau 1 (poser) | plus facile | 43 | 32 | 19 | 44 % |
| Étal du pêcheur, niveau 1 (poser) | conseillé | 63 | 50 | 20 | 32 % |
| Étal du pêcheur, niveau 1 (poser) | plus dur | 83 | 54 | 18 | 22 % |
| Étal du pêcheur, niveau 1 (poser) | très dur | 105 | 90 | 19 | 18 % |
| Étal du pêcheur, niveau 2 (payer) | plus facile | 43 | 33 | 23 | 53 % |
| Étal du pêcheur, niveau 2 (payer) | conseillé | 63 | 46 | 32 | 51 % |
| Étal du pêcheur, niveau 2 (payer) | plus dur | 80 | 48 | 33 | 41 % |
| Étal du pêcheur, niveau 2 (payer) | très dur | 105 | 66 | 28 | 27 % |
| Étal du pêcheur, niveau 3 (payer) | plus facile | 42 | 30 | 24 | 57 % |
| Étal du pêcheur, niveau 3 (payer) | conseillé | 64 | 49 | 29 | 45 % |
| Étal du pêcheur, niveau 3 (payer) | plus dur | 86 | 61 | 30 | 35 % |
| Étal du pêcheur, niveau 3 (payer) | très dur | 110 | 72 | 27 | 25 % |
| Étal du pêcheur, niveau 4 (payer) | plus facile | 42 | 34 | 24 | 57 % |
| Étal du pêcheur, niveau 4 (payer) | conseillé | 64 | 52 | 27 | 42 % |
| Étal du pêcheur, niveau 4 (payer) | plus dur | 86 | 69 | 27 | 31 % |
| Étal du pêcheur, niveau 4 (payer) | très dur | 110 | 84 | 27 | 25 % |
| Étal du pêcheur, niveau 5 (restreint) | plus facile | 42 | 35 | 21 | 50 % |
| Étal du pêcheur, niveau 5 (restreint) | conseillé | 64 | 54 | 30 | 47 % |
| Étal du pêcheur, niveau 5 (restreint) | plus dur | 86 | 53 | 31 | 36 % |
| Étal du pêcheur, niveau 5 (restreint) | très dur | 110 | 56 | 27 | 25 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus facile | 42 | 31 | 25 | 60 % |
| Étal du pêcheur, niveau 6 (monnaie) | conseillé | 64 | 48 | 27 | 42 % |
| Étal du pêcheur, niveau 6 (monnaie) | plus dur | 86 | 47 | 22 | 26 % |
| Étal du pêcheur, niveau 6 (monnaie) | très dur | 110 | 60 | 31 | 28 % |
| Étal du pêcheur, niveau 7 (rendre) | plus facile | 43 | 34 | 19 | 44 % |
| Étal du pêcheur, niveau 7 (rendre) | conseillé | 63 | 52 | 20 | 32 % |
| Étal du pêcheur, niveau 7 (rendre) | plus dur | 83 | 67 | 21 | 25 % |
| Étal du pêcheur, niveau 7 (rendre) | très dur | 105 | 74 | 20 | 19 % |
| Étal du pêcheur, niveau 8 (deux) | plus facile | 42 | 34 | 24 | 57 % |
| Étal du pêcheur, niveau 8 (deux) | conseillé | 64 | 53 | 28 | 44 % |
| Étal du pêcheur, niveau 8 (deux) | plus dur | 86 | 69 | 31 | 36 % |
| Étal du pêcheur, niveau 8 (deux) | très dur | 110 | 87 | 27 | 25 % |
| Étal du pêcheur, niveau 9 (payer) | plus facile | 43 | 33 | 23 | 53 % |
| Étal du pêcheur, niveau 9 (payer) | conseillé | 63 | 50 | 31 | 49 % |
| Étal du pêcheur, niveau 9 (payer) | plus dur | 83 | 59 | 30 | 36 % |
| Étal du pêcheur, niveau 9 (payer) | très dur | 105 | 63 | 26 | 25 % |
| Étal du pêcheur, niveau 10 (payer) | plus facile | 42 | 32 | 23 | 55 % |
| Étal du pêcheur, niveau 10 (payer) | conseillé | 64 | 51 | 26 | 41 % |
| Étal du pêcheur, niveau 10 (payer) | plus dur | 86 | 47 | 32 | 37 % |
| Étal du pêcheur, niveau 10 (payer) | très dur | 110 | 95 | 28 | 25 % |

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
| neuve | Étal du pêcheur, niveau 2 (payer) | plus facile | réelle | 14 | 7 | 0 % | aucune | L16×1 | 24 | 76 % | plus facile |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus facile | pressée | 14 | 7 | 0 % | aucune | L16×1 | 17 | 4 % | plus facile |
| neuve | Étal du pêcheur, niveau 2 (payer) | conseillé | appliquée | 14 | 8 | 0 % | aucune | L16×1 | 36 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | conseillé | réelle | 12 | 7 | 0 % | aucune | L16×1 | 36 | 88 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | conseillé | pressée | 14 | 7 | 0 % | aucune | L16×1 | 25 | 14 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus dur | appliquée | 14 | 5 | 0 % | aucune | L16×1 | 47 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus dur | réelle | 12 | 6 | 0 % | aucune | L16×1 | 44 | 83 % | plus dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | plus dur | pressée | 15 | 8 | 0 % | aucune | L16×1 | 25 | 4 % | conseillé |
| neuve | Étal du pêcheur, niveau 2 (payer) | très dur | appliquée | 14 | 5 | 0 % | aucune | L16×1 | 59 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | très dur | réelle | 11 | 6 | 0 % | aucune | L16×1 | 53 | 78 % | plus dur |
| neuve | Étal du pêcheur, niveau 2 (payer) | très dur | pressée | 14 | 7 | 0 % | aucune | L16×1 | 23 | 11 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus facile | appliquée | 18 | 10 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus facile | réelle | 16 | 12 | 0 % | aucune | – | 21 | 87 % | plus facile |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus facile | pressée | 13 | 8 | 0 % | aucune | L16×1 | 15 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 3 (payer) | conseillé | appliquée | 18 | 11 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | conseillé | réelle | 11 | 9 | 0 % | aucune | L16×1 | 33 | 70 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | conseillé | pressée | 14 | 10 | 0 % | aucune | L16×1 | 25 | 17 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus dur | réelle | 13 | 7 | 0 % | aucune | L16×1 | 41 | 87 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | plus dur | pressée | 14 | 9 | 0 % | aucune | L16×1 | 24 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 3 (payer) | très dur | appliquée | 18 | 8 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 3 (payer) | très dur | réelle | 10 | 6 | 0 % | aucune | L16×1 | 55 | 80 % | très dur |
| neuve | Étal du pêcheur, niveau 3 (payer) | très dur | pressée | 14 | 10 | 0 % | aucune | L16×1 | 24 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus facile | réelle | 17 | 15 | 0 % | aucune | – | 24 | 84 % | plus facile |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus facile | pressée | 14 | 10 | 0 % | aucune | L16×1 | 17 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 4 (payer) | conseillé | appliquée | 18 | 16 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | conseillé | réelle | 15 | 11 | 0 % | aucune | – | 37 | 86 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | conseillé | pressée | 14 | 11 | 0 % | aucune | L16×1 | 26 | 10 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus dur | appliquée | 18 | 13 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus dur | réelle | 11 | 9 | 0 % | aucune | L16×1 | 39 | 78 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | plus dur | pressée | 14 | 10 | 0 % | aucune | L16×1 | 20 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 4 (payer) | très dur | appliquée | 18 | 13 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 4 (payer) | très dur | réelle | 10 | 7 | 0 % | aucune | L16×1 | 46 | 65 % | plus dur |
| neuve | Étal du pêcheur, niveau 4 (payer) | très dur | pressée | 13 | 9 | 0 % | aucune | L16×1 | 20 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus facile | réelle | 14 | 12 | 0 % | aucune | L16×1 | 22 | 91 % | plus facile |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus facile | pressée | 13 | 8 | 0 % | aucune | L16×1 | 16 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 5 (restreint) | conseillé | appliquée | 18 | 14 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | conseillé | réelle | 10 | 8 | 0 % | aucune | L16×1 | 35 | 80 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | conseillé | pressée | 13 | 9 | 0 % | aucune | L16×1 | 24 | 17 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus dur | appliquée | 18 | 12 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus dur | réelle | 12 | 8 | 0 % | aucune | L16×1 | 39 | 77 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | plus dur | pressée | 14 | 9 | 0 % | aucune | L16×1 | 25 | 14 % | conseillé |
| neuve | Étal du pêcheur, niveau 5 (restreint) | très dur | appliquée | 18 | 11 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 5 (restreint) | très dur | réelle | 11 | 9 | 0 % | aucune | L16×1 | 53 | 80 % | très dur |
| neuve | Étal du pêcheur, niveau 5 (restreint) | très dur | pressée | 13 | 8 | 0 % | aucune | L16×1 | 18 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus facile | appliquée | 18 | 11 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus facile | réelle | 11 | 9 | 0 % | aucune | L16×1 | 24 | 83 % | plus facile |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus facile | pressée | 14 | 10 | 0 % | aucune | L16×1 | 18 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | conseillé | appliquée | 18 | 13 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | conseillé | réelle | 12 | 10 | 0 % | aucune | L16×1 | 36 | 81 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | conseillé | pressée | 14 | 9 | 0 % | aucune | L16×1 | 25 | 17 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus dur | réelle | 9 | 7 | 0 % | aucune | L16×1 | 35 | 77 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | plus dur | pressée | 14 | 10 | 0 % | aucune | L16×1 | 26 | 13 % | conseillé |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | très dur | appliquée | 18 | 9 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | très dur | réelle | 15 | 7 | 0 % | aucune | – | 58 | 85 % | très dur |
| neuve | Étal du pêcheur, niveau 6 (monnaie) | très dur | pressée | 13 | 8 | 0 % | aucune | L16×1 | 20 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus facile | appliquée | 14 | 10 | 8 % | 2 (700, 700 : même réponse) | L17×1 | 23 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus facile | réelle | 11 | 7 | 0 % | aucune | L17×1 | 22 | 74 % | plus facile |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus facile | pressée | 13 | 6 | 0 % | aucune | L17×1 | 13 | 4 % | plus facile |
| neuve | Étal du pêcheur, niveau 7 (rendre) | conseillé | appliquée | 14 | 11 | 8 % | 2 (300, 300 : même réponse) | L17×1 | 36 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | conseillé | réelle | 12 | 8 | 9 % | 2 (300, 300 : même réponse) | L17×1 | 33 | 79 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | conseillé | pressée | 13 | 7 | 0 % | aucune | L17×1 | 14 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus dur | appliquée | 14 | 9 | 0 % | aucune | L17×1 | 47 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus dur | réelle | 12 | 9 | 0 % | aucune | L17×1 | 46 | 88 % | plus dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | plus dur | pressée | 13 | 7 | 0 % | aucune | L17×1 | 15 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 7 (rendre) | très dur | appliquée | 14 | 9 | 0 % | aucune | L17×1 | 59 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | très dur | réelle | 12 | 7 | 0 % | aucune | L17×1 | 55 | 79 % | très dur |
| neuve | Étal du pêcheur, niveau 7 (rendre) | très dur | pressée | 13 | 8 | 0 % | aucune | L17×1 | 16 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus facile | réelle | 16 | 12 | 0 % | aucune | – | 24 | 84 % | plus facile |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus facile | pressée | 13 | 10 | 0 % | aucune | L16×1 | 16 | 7 % | plus facile |
| neuve | Étal du pêcheur, niveau 8 (deux) | conseillé | appliquée | 18 | 15 | 0 % | aucune | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | conseillé | réelle | 11 | 7 | 0 % | aucune | L16×1 | 32 | 77 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | conseillé | pressée | 14 | 11 | 0 % | aucune | L16×1 | 24 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus dur | appliquée | 18 | 10 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus dur | réelle | 10 | 6 | 0 % | aucune | L16×1 | 44 | 78 % | plus dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | plus dur | pressée | 13 | 8 | 0 % | aucune | L16×1 | 20 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 8 (deux) | très dur | appliquée | 18 | 10 | 0 % | aucune | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | très dur | réelle | 11 | 6 | 0 % | aucune | L16×1 | 53 | 91 % | très dur |
| neuve | Étal du pêcheur, niveau 8 (deux) | très dur | pressée | 13 | 8 | 0 % | aucune | L16×1 | 19 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus facile | appliquée | 14 | 11 | 0 % | aucune | L18×1 | 23 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus facile | réelle | 13 | 10 | 0 % | aucune | L18×1 | 24 | 79 % | plus facile |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus facile | pressée | 15 | 8 | 0 % | aucune | L18×1 | 18 | 4 % | plus facile |
| neuve | Étal du pêcheur, niveau 9 (payer) | conseillé | appliquée | 14 | 11 | 0 % | aucune | L18×1 | 36 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | conseillé | réelle | 13 | 8 | 0 % | aucune | L18×1 | 34 | 84 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | conseillé | pressée | 14 | 9 | 0 % | aucune | L18×1 | 23 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus dur | appliquée | 14 | 8 | 0 % | aucune | L18×1 | 47 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus dur | réelle | 12 | 9 | 0 % | aucune | L18×1 | 38 | 77 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | plus dur | pressée | 15 | 10 | 0 % | aucune | L18×1 | 25 | 4 % | conseillé |
| neuve | Étal du pêcheur, niveau 9 (payer) | très dur | appliquée | 14 | 9 | 0 % | aucune | L18×1 | 59 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 9 (payer) | très dur | réelle | 12 | 6 | 0 % | aucune | L18×1 | 63 | 85 % | très dur |
| neuve | Étal du pêcheur, niveau 9 (payer) | très dur | pressée | 15 | 10 | 0 % | aucune | L18×1 | 28 | 11 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus facile | appliquée | 18 | 16 | 0 % | aucune | – | 22 | 100 % | plus facile |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus facile | réelle | 16 | 15 | 0 % | 2 (130, 140 : pas de +10) | – | 25 | 91 % | plus facile |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus facile | pressée | 13 | 9 | 0 % | 2 (850, 860 : pas de +10) | L18×1 | 18 | 11 % | plus facile |
| neuve | Étal du pêcheur, niveau 10 (payer) | conseillé | appliquée | 18 | 17 | 0 % | 2 (900, 890 : pas de -10) | – | 37 | 100 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | conseillé | réelle | 13 | 13 | 0 % | 2 (640, 630 : pas de -10) | L18×1 | 35 | 72 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | conseillé | pressée | 14 | 11 | 0 % | 2 (410, 420 : pas de +10) | L18×1 | 24 | 7 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus dur | appliquée | 18 | 16 | 0 % | aucune | – | 50 | 100 % | plus dur |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus dur | réelle | 10 | 9 | 0 % | aucune | L18×1 | 39 | 76 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | plus dur | pressée | 14 | 10 | 0 % | 2 (320, 330 : pas de +10) | L18×1 | 21 | 11 % | conseillé |
| neuve | Étal du pêcheur, niveau 10 (payer) | très dur | appliquée | 18 | 16 | 0 % | 2 (900, 910 : pas de +10) | – | 64 | 100 % | très dur |
| neuve | Étal du pêcheur, niveau 10 (payer) | très dur | réelle | 17 | 15 | 0 % | aucune | – | 74 | 85 % | très dur |
| neuve | Étal du pêcheur, niveau 10 (payer) | très dur | pressée | 14 | 11 | 0 % | aucune | L18×1 | 28 | 10 % | conseillé |
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
| mois | Étal du pêcheur, niveau 2 (payer) | plus facile | réelle | 11 | 7 | 0 % | aucune | L16×1 | 33 | 68 % | plus facile |
| mois | Étal du pêcheur, niveau 2 (payer) | plus facile | pressée | 13 | 7 | 0 % | aucune | L16×1 | 23 | 7 % | plus facile |
| mois | Étal du pêcheur, niveau 2 (payer) | conseillé | appliquée | 14 | 7 | 0 % | aucune | L16×1 | 63 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | conseillé | réelle | 13 | 7 | 0 % | aucune | L16×1 | 46 | 65 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | conseillé | pressée | 15 | 8 | 0 % | aucune | L16×1 | 32 | 8 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | plus dur | appliquée | 12 | 5 | 0 % | aucune | L16×1 | 80 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 2 (payer) | plus dur | réelle | 11 | 8 | 0 % | aucune | L16×1 | 48 | 76 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | plus dur | pressée | 15 | 8 | 0 % | aucune | L16×1 | 33 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 2 (payer) | très dur | appliquée | 14 | 5 | 0 % | aucune | L16×1 | 105 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 2 (payer) | très dur | réelle | 13 | 5 | 0 % | aucune | L16×1 | 66 | 81 % | plus dur |
| mois | Étal du pêcheur, niveau 2 (payer) | très dur | pressée | 14 | 7 | 0 % | aucune | L16×1 | 28 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | plus facile | appliquée | 18 | 11 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 3 (payer) | plus facile | réelle | 11 | 8 | 0 % | aucune | L16×1 | 30 | 61 % | plus facile |
| mois | Étal du pêcheur, niveau 3 (payer) | plus facile | pressée | 13 | 9 | 0 % | aucune | L16×1 | 24 | 12 % | plus facile |
| mois | Étal du pêcheur, niveau 3 (payer) | conseillé | appliquée | 18 | 11 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | conseillé | réelle | 11 | 8 | 0 % | aucune | L16×1 | 49 | 74 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | conseillé | pressée | 14 | 10 | 0 % | aucune | L16×1 | 29 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 3 (payer) | plus dur | réelle | 11 | 8 | 0 % | aucune | L16×1 | 61 | 74 % | plus dur |
| mois | Étal du pêcheur, niveau 3 (payer) | plus dur | pressée | 14 | 9 | 0 % | aucune | L16×1 | 30 | 8 % | conseillé |
| mois | Étal du pêcheur, niveau 3 (payer) | très dur | appliquée | 18 | 7 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 3 (payer) | très dur | réelle | 10 | 7 | 0 % | aucune | L16×1 | 72 | 74 % | plus dur |
| mois | Étal du pêcheur, niveau 3 (payer) | très dur | pressée | 14 | 9 | 0 % | aucune | L16×1 | 27 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 4 (payer) | plus facile | réelle | 13 | 12 | 0 % | aucune | L16×1 | 34 | 82 % | plus facile |
| mois | Étal du pêcheur, niveau 4 (payer) | plus facile | pressée | 14 | 9 | 0 % | aucune | L16×1 | 24 | 7 % | plus facile |
| mois | Étal du pêcheur, niveau 4 (payer) | conseillé | appliquée | 18 | 14 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | conseillé | réelle | 12 | 11 | 0 % | aucune | L16×1 | 52 | 92 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | conseillé | pressée | 13 | 10 | 0 % | aucune | L16×1 | 27 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | plus dur | appliquée | 18 | 11 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 4 (payer) | plus dur | réelle | 14 | 13 | 0 % | aucune | L16×1 | 69 | 75 % | plus dur |
| mois | Étal du pêcheur, niveau 4 (payer) | plus dur | pressée | 13 | 8 | 0 % | aucune | L16×1 | 27 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 4 (payer) | très dur | appliquée | 18 | 12 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 4 (payer) | très dur | réelle | 15 | 11 | 0 % | aucune | L16×1 | 84 | 78 % | très dur |
| mois | Étal du pêcheur, niveau 4 (payer) | très dur | pressée | 14 | 11 | 0 % | aucune | L16×1 | 27 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus facile | appliquée | 18 | 14 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus facile | réelle | 12 | 10 | 0 % | aucune | L16×1 | 35 | 85 % | plus facile |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus facile | pressée | 13 | 8 | 0 % | aucune | L16×1 | 21 | 3 % | plus facile |
| mois | Étal du pêcheur, niveau 5 (restreint) | conseillé | appliquée | 18 | 12 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | conseillé | réelle | 16 | 12 | 0 % | aucune | – | 54 | 91 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | conseillé | pressée | 14 | 9 | 0 % | aucune | L16×1 | 30 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus dur | appliquée | 18 | 10 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus dur | réelle | 10 | 8 | 0 % | aucune | L16×1 | 53 | 70 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | plus dur | pressée | 12 | 8 | 0 % | aucune | L16×1 | 31 | 18 % | conseillé |
| mois | Étal du pêcheur, niveau 5 (restreint) | très dur | appliquée | 18 | 8 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 5 (restreint) | très dur | réelle | 10 | 8 | 0 % | aucune | L16×1 | 56 | 67 % | plus dur |
| mois | Étal du pêcheur, niveau 5 (restreint) | très dur | pressée | 14 | 11 | 0 % | aucune | L16×1 | 27 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus facile | appliquée | 18 | 15 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus facile | réelle | 15 | 12 | 0 % | aucune | – | 31 | 71 % | plus facile |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus facile | pressée | 14 | 8 | 0 % | aucune | L16×1 | 25 | 5 % | plus facile |
| mois | Étal du pêcheur, niveau 6 (monnaie) | conseillé | appliquée | 18 | 10 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | conseillé | réelle | 11 | 10 | 0 % | aucune | L16×1 | 48 | 74 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | conseillé | pressée | 14 | 7 | 0 % | aucune | L16×1 | 27 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus dur | appliquée | 18 | 8 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus dur | réelle | 12 | 9 | 0 % | aucune | L16×1 | 47 | 74 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | plus dur | pressée | 13 | 7 | 0 % | aucune | L16×1 | 22 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | très dur | appliquée | 18 | 9 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 6 (monnaie) | très dur | réelle | 10 | 7 | 0 % | aucune | L16×1 | 60 | 73 % | conseillé |
| mois | Étal du pêcheur, niveau 6 (monnaie) | très dur | pressée | 14 | 8 | 0 % | aucune | L16×1 | 31 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus facile | appliquée | 14 | 11 | 0 % | aucune | L17×1 | 43 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus facile | réelle | 11 | 5 | 10 % | 2 (100, 100 : même réponse) | L17×1 | 34 | 76 % | plus facile |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus facile | pressée | 13 | 7 | 0 % | aucune | L17×1 | 19 | 3 % | plus facile |
| mois | Étal du pêcheur, niveau 7 (rendre) | conseillé | appliquée | 14 | 9 | 0 % | aucune | L17×1 | 63 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | conseillé | réelle | 13 | 10 | 0 % | aucune | L17×1 | 52 | 78 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | conseillé | pressée | 13 | 8 | 0 % | aucune | L17×1 | 20 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus dur | appliquée | 14 | 8 | 0 % | aucune | L17×1 | 83 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus dur | réelle | 11 | 7 | 0 % | aucune | L17×1 | 67 | 81 % | plus dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | plus dur | pressée | 13 | 7 | 8 % | 2 (200, 200 : même réponse) | L17×1 | 21 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 7 (rendre) | très dur | appliquée | 14 | 9 | 0 % | aucune | L17×1 | 105 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | très dur | réelle | 12 | 9 | 0 % | aucune | L17×1 | 74 | 72 % | très dur |
| mois | Étal du pêcheur, niveau 7 (rendre) | très dur | pressée | 13 | 6 | 0 % | aucune | L17×1 | 20 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | plus facile | appliquée | 18 | 16 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 8 (deux) | plus facile | réelle | 12 | 9 | 0 % | aucune | L16×1 | 34 | 80 % | plus facile |
| mois | Étal du pêcheur, niveau 8 (deux) | plus facile | pressée | 14 | 10 | 0 % | aucune | L16×1 | 24 | 5 % | plus facile |
| mois | Étal du pêcheur, niveau 8 (deux) | conseillé | appliquée | 18 | 15 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | conseillé | réelle | 16 | 13 | 0 % | aucune | – | 53 | 81 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | conseillé | pressée | 13 | 9 | 0 % | aucune | L16×1 | 28 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | plus dur | appliquée | 18 | 10 | 0 % | aucune | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 8 (deux) | plus dur | réelle | 15 | 11 | 0 % | aucune | – | 69 | 83 % | plus dur |
| mois | Étal du pêcheur, niveau 8 (deux) | plus dur | pressée | 14 | 10 | 0 % | aucune | L16×1 | 31 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 8 (deux) | très dur | appliquée | 18 | 10 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 8 (deux) | très dur | réelle | 15 | 9 | 0 % | aucune | – | 87 | 81 % | très dur |
| mois | Étal du pêcheur, niveau 8 (deux) | très dur | pressée | 13 | 9 | 0 % | aucune | L16×1 | 27 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | plus facile | appliquée | 14 | 9 | 0 % | aucune | L18×1 | 43 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 9 (payer) | plus facile | réelle | 13 | 9 | 0 % | aucune | L18×1 | 33 | 80 % | plus facile |
| mois | Étal du pêcheur, niveau 9 (payer) | plus facile | pressée | 14 | 8 | 0 % | aucune | L18×1 | 23 | 5 % | plus facile |
| mois | Étal du pêcheur, niveau 9 (payer) | conseillé | appliquée | 14 | 11 | 0 % | aucune | L18×1 | 63 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | conseillé | réelle | 11 | 8 | 0 % | aucune | L18×1 | 50 | 84 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | conseillé | pressée | 15 | 11 | 0 % | aucune | L18×1 | 31 | 7 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | plus dur | appliquée | 14 | 8 | 0 % | aucune | L18×1 | 83 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 9 (payer) | plus dur | réelle | 11 | 7 | 0 % | aucune | L18×1 | 59 | 81 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | plus dur | pressée | 15 | 10 | 0 % | aucune | L18×1 | 30 | 3 % | conseillé |
| mois | Étal du pêcheur, niveau 9 (payer) | très dur | appliquée | 14 | 9 | 0 % | aucune | L18×1 | 105 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 9 (payer) | très dur | réelle | 12 | 8 | 0 % | aucune | L18×1 | 63 | 73 % | plus dur |
| mois | Étal du pêcheur, niveau 9 (payer) | très dur | pressée | 14 | 8 | 0 % | aucune | L18×1 | 26 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | plus facile | appliquée | 18 | 17 | 0 % | aucune | – | 42 | 100 % | plus facile |
| mois | Étal du pêcheur, niveau 10 (payer) | plus facile | réelle | 11 | 11 | 0 % | aucune | L18×1 | 32 | 70 % | plus facile |
| mois | Étal du pêcheur, niveau 10 (payer) | plus facile | pressée | 14 | 12 | 0 % | aucune | L18×1 | 23 | 5 % | plus facile |
| mois | Étal du pêcheur, niveau 10 (payer) | conseillé | appliquée | 18 | 16 | 0 % | aucune | – | 64 | 100 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | conseillé | réelle | 11 | 10 | 0 % | aucune | L18×1 | 51 | 84 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | conseillé | pressée | 13 | 12 | 0 % | aucune | L18×1 | 26 | 5 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | plus dur | appliquée | 18 | 16 | 0 % | 2 (530, 540 : pas de +10) | – | 86 | 100 % | plus dur |
| mois | Étal du pêcheur, niveau 10 (payer) | plus dur | réelle | 12 | 11 | 0 % | aucune | L18×1 | 47 | 68 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | plus dur | pressée | 14 | 11 | 0 % | aucune | L18×1 | 32 | 11 % | conseillé |
| mois | Étal du pêcheur, niveau 10 (payer) | très dur | appliquée | 18 | 17 | 0 % | aucune | – | 110 | 100 % | très dur |
| mois | Étal du pêcheur, niveau 10 (payer) | très dur | réelle | 16 | 15 | 0 % | aucune | – | 95 | 88 % | très dur |
| mois | Étal du pêcheur, niveau 10 (payer) | très dur | pressée | 13 | 12 | 0 % | 2 (520, 510 : pas de -10) | L18×1 | 28 | 5 % | conseillé |
