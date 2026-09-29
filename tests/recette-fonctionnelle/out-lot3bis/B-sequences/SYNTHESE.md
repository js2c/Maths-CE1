# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Ligne graduée, niveau 1 | plus facile | 33 | 29 | 21 | 64 % |
| Ligne graduée, niveau 1 | conseillé | 56 | 48 | 29 | 52 % |
| Ligne graduée, niveau 1 | plus dur | 77 | 48 | 26 | 34 % |
| Ligne graduée, niveau 1 | très dur | 99 | 53 | 29 | 29 % |
| Ligne graduée, niveau 2 | plus facile | 31 | 28 | 15 | 48 % |
| Ligne graduée, niveau 2 | conseillé | 59 | 45 | 19 | 32 % |
| Ligne graduée, niveau 2 | plus dur | 83 | 46 | 25 | 30 % |
| Ligne graduée, niveau 2 | très dur | 82 | 77 | 21 | 26 % |
| Ligne graduée, niveau 3 | plus facile | 33 | 27 | 19 | 58 % |
| Ligne graduée, niveau 3 | conseillé | 59 | 51 | 23 | 39 % |
| Ligne graduée, niveau 3 | plus dur | 83 | 52 | 21 | 25 % |
| Ligne graduée, niveau 3 | très dur | 108 | 79 | 25 | 23 % |
| Ligne graduée, niveau 4 | plus facile | 33 | 30 | 20 | 61 % |
| Ligne graduée, niveau 4 | conseillé | 56 | 43 | 25 | 45 % |
| Ligne graduée, niveau 4 | plus dur | 77 | 62 | 18 | 23 % |
| Ligne graduée, niveau 4 | très dur | 99 | 85 | 24 | 24 % |
| Ligne graduée, niveau 5 | plus facile | 33 | 31 | 18 | 55 % |
| Ligne graduée, niveau 5 | conseillé | 56 | 50 | 21 | 38 % |
| Ligne graduée, niveau 5 | plus dur | 77 | 59 | 22 | 29 % |
| Ligne graduée, niveau 5 | très dur | 85 | 54 | 26 | 31 % |
| Ligne graduée, niveau 6 | plus facile | 33 | 26 | 19 | 58 % |
| Ligne graduée, niveau 6 | conseillé | 58 | 50 | 21 | 36 % |
| Ligne graduée, niveau 6 | plus dur | 83 | 71 | 23 | 28 % |
| Ligne graduée, niveau 6 | très dur | 104 | 83 | 24 | 23 % |
| Ligne graduée, niveau 7 | plus facile | 33 | 28 | 21 | 64 % |
| Ligne graduée, niveau 7 | conseillé | 59 | 48 | 26 | 44 % |
| Ligne graduée, niveau 7 | plus dur | 83 | 56 | 25 | 30 % |
| Ligne graduée, niveau 7 | très dur | 108 | 65 | 26 | 24 % |
| Ligne graduée, niveau 8 | plus facile | 29 | 25 | 18 | 62 % |
| Ligne graduée, niveau 8 | conseillé | 52 | 51 | 17 | 33 % |
| Ligne graduée, niveau 8 | plus dur | 73 | 50 | 17 | 23 % |
| Ligne graduée, niveau 8 | très dur | 94 | 77 | 20 | 21 % |
| Ligne graduée, niveau 9 | plus facile | 33 | 28 | 20 | 61 % |
| Ligne graduée, niveau 9 | conseillé | 56 | 49 | 20 | 36 % |
| Ligne graduée, niveau 9 | plus dur | 77 | 70 | 21 | 27 % |
| Ligne graduée, niveau 9 | très dur | 85 | 61 | 24 | 28 % |
| Ligne graduée, niveau 10 | plus facile | 33 | 34 | 19 | 58 % |
| Ligne graduée, niveau 10 | conseillé | 58 | 45 | 26 | 45 % |
| Ligne graduée, niveau 10 | plus dur | 82 | 59 | 26 | 32 % |
| Ligne graduée, niveau 10 | très dur | 108 | 76 | 24 | 22 % |
| Ligne graduée, niveau 11 | plus facile | 33 | 25 | 18 | 55 % |
| Ligne graduée, niveau 11 | conseillé | 57 | 46 | 20 | 35 % |
| Ligne graduée, niveau 11 | plus dur | 82 | 54 | 21 | 26 % |
| Ligne graduée, niveau 11 | très dur | 108 | 61 | 21 | 19 % |
| Ligne graduée, niveau 12 | plus facile | 32 | 27 | 11 | 34 % |
| Ligne graduée, niveau 12 | conseillé | 57 | 46 | 12 | 21 % |
| Ligne graduée, niveau 12 | plus dur | 83 | 51 | 17 | 20 % |
| Ligne graduée, niveau 12 | très dur | 108 | 86 | 14 | 13 % |
| Ligne graduée, niveau 13 | plus facile | 29 | 29 | 16 | 55 % |
| Ligne graduée, niveau 13 | conseillé | 52 | 54 | 17 | 33 % |
| Ligne graduée, niveau 13 | plus dur | 73 | 73 | 17 | 23 % |
| Ligne graduée, niveau 13 | très dur | 94 | 94 | 16 | 17 % |
| Additions, famille 1 (+ 1 et + 2) | plus facile | 25 | 26 | 11 | 44 % |
| Additions, famille 1 (+ 1 et + 2) | conseillé | 59 | 48 | 18 | 31 % |
| Additions, famille 1 (+ 1 et + 2) | plus dur | 83 | 43 | 14 | 17 % |
| Additions, famille 1 (+ 1 et + 2) | très dur | 108 | 78 | 19 | 18 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus facile | 25 | 25 | 17 | 68 % |
| Additions, famille 2 (doubles jusqu'à 5) | conseillé | 54 | 46 | 17 | 31 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus dur | 76 | 50 | 14 | 18 % |
| Additions, famille 2 (doubles jusqu'à 5) | très dur | 91 | 69 | 19 | 21 % |
| Additions, famille 3 (amis de 10) | plus facile | 25 | 23 | 14 | 56 % |
| Additions, famille 3 (amis de 10) | conseillé | 55 | 45 | 17 | 31 % |
| Additions, famille 3 (amis de 10) | plus dur | 76 | 53 | 16 | 21 % |
| Additions, famille 3 (amis de 10) | très dur | 97 | 56 | 16 | 16 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | 25 | 23 | 14 | 56 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | 55 | 35 | 14 | 25 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | 76 | 59 | 18 | 24 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | très dur | 97 | 56 | 20 | 21 % |
| Additions, famille 5 (maisons de 8 et 9) | plus facile | 25 | 20 | 15 | 60 % |
| Additions, famille 5 (maisons de 8 et 9) | conseillé | 55 | 47 | 17 | 31 % |
| Additions, famille 5 (maisons de 8 et 9) | plus dur | 76 | 50 | 15 | 20 % |
| Additions, famille 5 (maisons de 8 et 9) | très dur | 97 | 70 | 19 | 20 % |
| Additions, famille 6 (presque-doubles) | plus facile | 25 | 24 | 15 | 60 % |
| Additions, famille 6 (presque-doubles) | conseillé | 55 | 44 | 16 | 29 % |
| Additions, famille 6 (presque-doubles) | plus dur | 76 | 54 | 14 | 18 % |
| Additions, famille 6 (presque-doubles) | très dur | 97 | 57 | 14 | 14 % |
| Additions, famille 7 (mélange) | plus facile | 25 | 22 | 11 | 44 % |
| Additions, famille 7 (mélange) | conseillé | 59 | 49 | 12 | 20 % |
| Additions, famille 7 (mélange) | plus dur | 83 | 67 | 13 | 16 % |
| Additions, famille 7 (mélange) | très dur | 108 | 63 | 12 | 11 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus facile | 28 | 26 | 10 | 36 % |
| Calcul rapide, niveau 1 (petit, ligne) | conseillé | 62 | 54 | 10 | 16 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus dur | 88 | 44 | 12 | 14 % |
| Calcul rapide, niveau 1 (petit, ligne) | très dur | 110 | 78 | 10 | 9 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus facile | 28 | 24 | 13 | 46 % |
| Calcul rapide, niveau 2 (dizaine, mur) | conseillé | 56 | 42 | 13 | 23 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus dur | 77 | 52 | 13 | 17 % |
| Calcul rapide, niveau 2 (dizaine, mur) | très dur | 99 | 69 | 13 | 13 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus facile | 26 | 21 | 10 | 38 % |
| Calcul rapide, niveau 3 (dizaines, mur) | conseillé | 55 | 37 | 10 | 18 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus dur | 79 | 59 | 10 | 13 % |
| Calcul rapide, niveau 3 (dizaines, mur) | très dur | 110 | 60 | 10 | 9 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | 28 | 24 | 10 | 36 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | 62 | 49 | 10 | 16 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | 88 | 67 | 10 | 11 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | 112 | 86 | 10 | 9 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | 28 | 23 | 10 | 36 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | 62 | 50 | 11 | 18 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | 83 | 65 | 11 | 13 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | 114 | 85 | 10 | 9 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus facile | 27 | 26 | 14 | 52 % |
| Calcul rapide, niveau 6 (plus9, mur) | conseillé | 55 | 41 | 13 | 24 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus dur | 76 | 44 | 16 | 21 % |
| Calcul rapide, niveau 6 (plus9, mur) | très dur | 97 | 60 | 18 | 19 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | 27 | 26 | 13 | 48 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | 55 | 41 | 13 | 24 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | 76 | 52 | 13 | 17 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | 99 | 59 | 13 | 13 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | 27 | 21 | 11 | 41 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | 60 | 48 | 10 | 17 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | 85 | 45 | 10 | 12 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | 114 | 53 | 11 | 10 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 27 | 24 | 11 | 41 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 60 | 42 | 14 | 23 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 83 | 40 | 12 | 14 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 110 | 63 | 11 | 10 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Ligne graduée, niveau 1 | plus facile | 52 | 40 | 31 | 60 % |
| Ligne graduée, niveau 1 | conseillé | 86 | 62 | 34 | 40 % |
| Ligne graduée, niveau 1 | plus dur | 117 | 94 | 40 | 34 % |
| Ligne graduée, niveau 1 | très dur | 152 | 114 | 34 | 22 % |
| Ligne graduée, niveau 2 | plus facile | 51 | 39 | 21 | 41 % |
| Ligne graduée, niveau 2 | conseillé | 86 | 68 | 31 | 36 % |
| Ligne graduée, niveau 2 | plus dur | 119 | 64 | 28 | 24 % |
| Ligne graduée, niveau 2 | très dur | 126 | 96 | 28 | 22 % |
| Ligne graduée, niveau 3 | plus facile | 53 | 41 | 22 | 42 % |
| Ligne graduée, niveau 3 | conseillé | 85 | 62 | 26 | 31 % |
| Ligne graduée, niveau 3 | plus dur | 119 | 71 | 31 | 26 % |
| Ligne graduée, niveau 3 | très dur | 148 | 88 | 25 | 17 % |
| Ligne graduée, niveau 4 | plus facile | 53 | 39 | 28 | 53 % |
| Ligne graduée, niveau 4 | conseillé | 86 | 64 | 33 | 38 % |
| Ligne graduée, niveau 4 | plus dur | 119 | 87 | 31 | 26 % |
| Ligne graduée, niveau 4 | très dur | 152 | 77 | 37 | 24 % |
| Ligne graduée, niveau 5 | plus facile | 53 | 40 | 24 | 45 % |
| Ligne graduée, niveau 5 | conseillé | 83 | 61 | 26 | 31 % |
| Ligne graduée, niveau 5 | plus dur | 113 | 63 | 30 | 27 % |
| Ligne graduée, niveau 5 | très dur | 129 | 111 | 30 | 23 % |
| Ligne graduée, niveau 6 | plus facile | 52 | 42 | 24 | 46 % |
| Ligne graduée, niveau 6 | conseillé | 84 | 54 | 31 | 37 % |
| Ligne graduée, niveau 6 | plus dur | 119 | 79 | 24 | 20 % |
| Ligne graduée, niveau 6 | très dur | 148 | 104 | 29 | 20 % |
| Ligne graduée, niveau 7 | plus facile | 53 | 38 | 28 | 53 % |
| Ligne graduée, niveau 7 | conseillé | 84 | 51 | 30 | 36 % |
| Ligne graduée, niveau 7 | plus dur | 119 | 69 | 33 | 28 % |
| Ligne graduée, niveau 7 | très dur | 152 | 70 | 31 | 20 % |
| Ligne graduée, niveau 8 | plus facile | 49 | 38 | 18 | 37 % |
| Ligne graduée, niveau 8 | conseillé | 79 | 61 | 25 | 32 % |
| Ligne graduée, niveau 8 | plus dur | 108 | 72 | 31 | 29 % |
| Ligne graduée, niveau 8 | très dur | 138 | 107 | 24 | 17 % |
| Ligne graduée, niveau 9 | plus facile | 53 | 39 | 24 | 45 % |
| Ligne graduée, niveau 9 | conseillé | 83 | 65 | 29 | 35 % |
| Ligne graduée, niveau 9 | plus dur | 113 | 72 | 29 | 26 % |
| Ligne graduée, niveau 9 | très dur | 129 | 97 | 34 | 26 % |
| Ligne graduée, niveau 10 | plus facile | 53 | 39 | 25 | 47 % |
| Ligne graduée, niveau 10 | conseillé | 86 | 67 | 30 | 35 % |
| Ligne graduée, niveau 10 | plus dur | 119 | 65 | 33 | 28 % |
| Ligne graduée, niveau 10 | très dur | 152 | 51 | 34 | 22 % |
| Ligne graduée, niveau 11 | plus facile | 53 | 37 | 25 | 47 % |
| Ligne graduée, niveau 11 | conseillé | 86 | 65 | 31 | 36 % |
| Ligne graduée, niveau 11 | plus dur | 119 | 60 | 29 | 24 % |
| Ligne graduée, niveau 11 | très dur | 152 | 102 | 28 | 18 % |
| Ligne graduée, niveau 12 | plus facile | 53 | 41 | 17 | 32 % |
| Ligne graduée, niveau 12 | conseillé | 86 | 56 | 18 | 21 % |
| Ligne graduée, niveau 12 | plus dur | 119 | 67 | 20 | 17 % |
| Ligne graduée, niveau 12 | très dur | 148 | 98 | 18 | 12 % |
| Ligne graduée, niveau 13 | plus facile | 49 | 42 | 21 | 43 % |
| Ligne graduée, niveau 13 | conseillé | 79 | 66 | 22 | 28 % |
| Ligne graduée, niveau 13 | plus dur | 108 | 70 | 29 | 27 % |
| Ligne graduée, niveau 13 | très dur | 138 | 87 | 28 | 20 % |
| Additions, famille 1 (+ 1 et + 2) | plus facile | 45 | 35 | 17 | 38 % |
| Additions, famille 1 (+ 1 et + 2) | conseillé | 86 | 64 | 23 | 27 % |
| Additions, famille 1 (+ 1 et + 2) | plus dur | 119 | 69 | 19 | 16 % |
| Additions, famille 1 (+ 1 et + 2) | très dur | 152 | 131 | 17 | 11 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus facile | 45 | 33 | 19 | 42 % |
| Additions, famille 2 (doubles jusqu'à 5) | conseillé | 82 | 61 | 22 | 27 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus dur | 111 | 88 | 20 | 18 % |
| Additions, famille 2 (doubles jusqu'à 5) | très dur | 141 | 86 | 22 | 16 % |
| Additions, famille 3 (amis de 10) | plus facile | 45 | 37 | 21 | 47 % |
| Additions, famille 3 (amis de 10) | conseillé | 86 | 52 | 25 | 29 % |
| Additions, famille 3 (amis de 10) | plus dur | 119 | 73 | 24 | 20 % |
| Additions, famille 3 (amis de 10) | très dur | 152 | 110 | 25 | 16 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | 45 | 35 | 21 | 47 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | 82 | 61 | 21 | 26 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | 111 | 61 | 19 | 17 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | très dur | 141 | 108 | 28 | 20 % |
| Additions, famille 5 (maisons de 8 et 9) | plus facile | 45 | 35 | 19 | 42 % |
| Additions, famille 5 (maisons de 8 et 9) | conseillé | 82 | 61 | 21 | 26 % |
| Additions, famille 5 (maisons de 8 et 9) | plus dur | 111 | 64 | 22 | 20 % |
| Additions, famille 5 (maisons de 8 et 9) | très dur | 141 | 60 | 23 | 16 % |
| Additions, famille 6 (presque-doubles) | plus facile | 45 | 34 | 19 | 42 % |
| Additions, famille 6 (presque-doubles) | conseillé | 82 | 53 | 27 | 33 % |
| Additions, famille 6 (presque-doubles) | plus dur | 111 | 77 | 23 | 21 % |
| Additions, famille 6 (presque-doubles) | très dur | 141 | 88 | 24 | 17 % |
| Additions, famille 7 (mélange) | plus facile | 45 | 36 | 19 | 42 % |
| Additions, famille 7 (mélange) | conseillé | 86 | 61 | 23 | 27 % |
| Additions, famille 7 (mélange) | plus dur | 119 | 59 | 18 | 15 % |
| Additions, famille 7 (mélange) | très dur | 152 | 82 | 21 | 14 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus facile | 47 | 33 | 15 | 32 % |
| Calcul rapide, niveau 1 (petit, ligne) | conseillé | 89 | 60 | 19 | 21 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus dur | 123 | 61 | 16 | 13 % |
| Calcul rapide, niveau 1 (petit, ligne) | très dur | 158 | 76 | 23 | 15 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus facile | 47 | 35 | 15 | 32 % |
| Calcul rapide, niveau 2 (dizaine, mur) | conseillé | 89 | 61 | 16 | 18 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus dur | 123 | 59 | 17 | 14 % |
| Calcul rapide, niveau 2 (dizaine, mur) | très dur | 158 | 71 | 19 | 12 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus facile | 47 | 34 | 18 | 38 % |
| Calcul rapide, niveau 3 (dizaines, mur) | conseillé | 87 | 65 | 17 | 20 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus dur | 123 | 61 | 19 | 15 % |
| Calcul rapide, niveau 3 (dizaines, mur) | très dur | 156 | 73 | 21 | 13 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | 47 | 30 | 16 | 34 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | 89 | 58 | 19 | 21 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | 122 | 74 | 15 | 12 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | 158 | 76 | 17 | 11 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | 48 | 38 | 18 | 38 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | 88 | 64 | 17 | 19 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | 123 | 73 | 17 | 14 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | 158 | 94 | 22 | 14 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus facile | 47 | 35 | 19 | 40 % |
| Calcul rapide, niveau 6 (plus9, mur) | conseillé | 82 | 52 | 26 | 32 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus dur | 111 | 64 | 21 | 19 % |
| Calcul rapide, niveau 6 (plus9, mur) | très dur | 141 | 87 | 19 | 13 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | 47 | 32 | 19 | 40 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | 82 | 60 | 20 | 24 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | 111 | 60 | 21 | 19 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | 143 | 68 | 19 | 13 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | 47 | 38 | 19 | 40 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | 87 | 63 | 18 | 21 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | 120 | 64 | 18 | 15 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | 158 | 79 | 21 | 13 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 47 | 33 | 16 | 34 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 87 | 59 | 21 | 24 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 119 | 81 | 16 | 13 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 154 | 62 | 26 | 17 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Ligne graduée, niveau 1 | plus facile | appliquée | 34 | 9 | 6 % | 3 (6, 4, 2 : pas de -2) | L1×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 1 | plus facile | réelle | 27 | 9 | 0 % | 3 (7, 5, 3 : pas de -2) | L1×1 | 29 | 85 % | plus facile |
| neuve | Ligne graduée, niveau 1 | plus facile | pressée | 27 | 10 | 4 % | 2 (8, 2 : pas de -6) | L1×1 | 21 | 33 % | plus facile |
| neuve | Ligne graduée, niveau 1 | conseillé | appliquée | 34 | 10 | 3 % | 2 (6, 1 : pas de -5) | L1×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 1 | conseillé | réelle | 25 | 10 | 4 % | 2 (6, 3 : pas de -3) | L1×1 | 48 | 81 % | conseillé |
| neuve | Ligne graduée, niveau 1 | conseillé | pressée | 28 | 9 | 0 % | 2 (9, 6 : pas de -3) | L1×1 | 29 | 32 % | conseillé |
| neuve | Ligne graduée, niveau 1 | plus dur | appliquée | 34 | 10 | 0 % | 3 (8, 9, 10 : pas de +1) | L1×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 1 | plus dur | réelle | 25 | 10 | 4 % | 3 (9, 8, 7 : pas de -1) | L1×1 | 48 | 76 % | conseillé |
| neuve | Ligne graduée, niveau 1 | plus dur | pressée | 25 | 10 | 0 % | 3 (2, 3, 4 : pas de +1) | L1×1 | 26 | 24 % | conseillé |
| neuve | Ligne graduée, niveau 1 | très dur | appliquée | 34 | 9 | 9 % | 3 (3, 6, 9 : pas de +3) | L1×1 | 99 | 100 % | très dur |
| neuve | Ligne graduée, niveau 1 | très dur | réelle | 24 | 10 | 17 % | 2 (3, 6 : pas de +3) | L1×1 | 53 | 71 % | conseillé |
| neuve | Ligne graduée, niveau 1 | très dur | pressée | 28 | 10 | 4 % | 3 (9, 8, 7 : pas de -1) | L1×1 | 29 | 35 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus facile | appliquée | 36 | 6 | 0 % | 3 (7, 4, 1 : pas de -3) | – | 31 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 2 | plus facile | réelle | 22 | 6 | 0 % | 3 (1, 4, 7 : pas de +3) | L1×1 | 28 | 73 % | plus facile |
| neuve | Ligne graduée, niveau 2 | plus facile | pressée | 22 | 6 | 0 % | 2 (4, 6 : pas de +2) | L1×1 | 15 | 15 % | plus facile |
| neuve | Ligne graduée, niveau 2 | conseillé | appliquée | 40 | 8 | 0 % | 3 (2, 4, 6 : pas de +2) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 2 | conseillé | réelle | 22 | 8 | 0 % | 3 (6, 7, 8 : pas de +1) | L1×1 | 45 | 73 % | conseillé |
| neuve | Ligne graduée, niveau 2 | conseillé | pressée | 21 | 8 | 0 % | 2 (8, 4 : pas de -4) | L1×1 | 19 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus dur | appliquée | 40 | 9 | 0 % | 3 (1, 2, 3 : pas de +1) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 2 | plus dur | réelle | 20 | 9 | 0 % | 2 (5, 7 : pas de +2) | L1×1 | 46 | 68 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus dur | pressée | 22 | 8 | 0 % | 3 (3, 2, 1 : pas de -1) | L1×1 | 25 | 27 % | conseillé |
| neuve | Ligne graduée, niveau 2 | très dur | appliquée | 27 | 9 | 0 % | 3 (1, 3, 5 : pas de +2) | – | 82 | 100 % | très dur |
| neuve | Ligne graduée, niveau 2 | très dur | réelle | 24 | 9 | 0 % | 3 (9, 6, 3 : pas de -3) | L1×1 | 77 | 78 % | très dur |
| neuve | Ligne graduée, niveau 2 | très dur | pressée | 24 | 8 | 0 % | 2 (7, 6 : pas de -1) | L1×1 | 21 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 3 | plus facile | appliquée | 40 | 16 | 0 % | 3 (2, 9, 16 : pas de +7) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 3 | plus facile | réelle | 22 | 16 | 0 % | 3 (14, 16, 18 : pas de +2) | L1×1 | 27 | 76 % | plus facile |
| neuve | Ligne graduée, niveau 3 | plus facile | pressée | 23 | 15 | 0 % | 2 (19, 17 : pas de -2) | L1×1 | 19 | 25 % | plus facile |
| neuve | Ligne graduée, niveau 3 | conseillé | appliquée | 40 | 18 | 0 % | 3 (1, 2, 3 : pas de +1) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 3 | conseillé | réelle | 29 | 18 | 0 % | 2 (6, 15 : pas de +9) | L1×1 | 51 | 83 % | conseillé |
| neuve | Ligne graduée, niveau 3 | conseillé | pressée | 23 | 14 | 0 % | 3 (19, 15, 11 : pas de -4) | L1×1 | 23 | 22 % | conseillé |
| neuve | Ligne graduée, niveau 3 | plus dur | appliquée | 40 | 19 | 0 % | 2 (18, 19 : pas de +1) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 3 | plus dur | réelle | 22 | 17 | 0 % | 3 (5, 11, 17 : pas de +6) | L1×1 | 52 | 81 % | conseillé |
| neuve | Ligne graduée, niveau 3 | plus dur | pressée | 24 | 17 | 0 % | 2 (2, 3 : pas de +1) | L1×1 | 21 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 3 | très dur | appliquée | 40 | 19 | 0 % | 3 (6, 8, 10 : pas de +2) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 3 | très dur | réelle | 24 | 19 | 0 % | 3 (3, 4, 5 : pas de +1) | L1×1 | 79 | 86 % | très dur |
| neuve | Ligne graduée, niveau 3 | très dur | pressée | 22 | 14 | 0 % | 2 (16, 9 : pas de -7) | L1×1 | 25 | 23 % | conseillé |
| neuve | Ligne graduée, niveau 4 | plus facile | appliquée | 34 | 29 | 0 % | 2 (76, 74 : pas de -2) | L3×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 4 | plus facile | réelle | 27 | 21 | 0 % | 2 (16, 21 : pas de +5) | L3×1 | 30 | 73 % | plus facile |
| neuve | Ligne graduée, niveau 4 | plus facile | pressée | 19 | 14 | 0 % | 2 (87, 92 : pas de +5) | L3×1 L1×1 | 20 | 25 % | plus facile |
| neuve | Ligne graduée, niveau 4 | conseillé | appliquée | 34 | 30 | 0 % | 2 (42, 49 : pas de +7) | L3×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 4 | conseillé | réelle | 25 | 20 | 0 % | 2 (99, 94 : pas de -5) | L3×1 | 43 | 82 % | conseillé |
| neuve | Ligne graduée, niveau 4 | conseillé | pressée | 19 | 12 | 0 % | 2 (77, 79 : pas de +2) | L3×1 L1×1 | 25 | 18 % | conseillé |
| neuve | Ligne graduée, niveau 4 | plus dur | appliquée | 34 | 22 | 0 % | 2 (95, 86 : pas de -9) | L3×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 4 | plus dur | réelle | 19 | 13 | 0 % | 2 (76, 85 : pas de +9) | L3×1 L1×1 | 62 | 79 % | plus dur |
| neuve | Ligne graduée, niveau 4 | plus dur | pressée | 18 | 12 | 0 % | 2 (92, 88 : pas de -4) | L3×1 L1×1 | 18 | 7 % | conseillé |
| neuve | Ligne graduée, niveau 4 | très dur | appliquée | 34 | 25 | 0 % | 2 (61, 70 : pas de +9) | L3×1 | 99 | 100 % | très dur |
| neuve | Ligne graduée, niveau 4 | très dur | réelle | 27 | 24 | 0 % | 2 (82, 90 : pas de +8) | L3×1 | 85 | 92 % | très dur |
| neuve | Ligne graduée, niveau 4 | très dur | pressée | 20 | 11 | 0 % | 2 (34, 43 : pas de +9) | L3×1 L1×1 | 24 | 16 % | conseillé |
| neuve | Ligne graduée, niveau 5 | plus facile | appliquée | 34 | 6 | 0 % | 2 (30, 40 : pas de +10) | L2×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 5 | plus facile | réelle | 28 | 6 | 0 % | 2 (60, 70 : pas de +10) | L2×1 | 31 | 83 % | plus facile |
| neuve | Ligne graduée, niveau 5 | plus facile | pressée | 18 | 6 | 0 % | 2 (30, 40 : pas de +10) | L2×1 L1×1 | 18 | 13 % | plus facile |
| neuve | Ligne graduée, niveau 5 | conseillé | appliquée | 34 | 8 | 0 % | 2 (80, 90 : pas de +10) | L2×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 5 | conseillé | réelle | 26 | 8 | 0 % | 2 (30, 40 : pas de +10) | L2×1 | 50 | 87 % | conseillé |
| neuve | Ligne graduée, niveau 5 | conseillé | pressée | 18 | 8 | 0 % | 2 (60, 70 : pas de +10) | L2×1 L1×1 | 21 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 5 | plus dur | appliquée | 34 | 9 | 0 % | 3 (40, 50, 60 : pas de +10) | L2×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 5 | plus dur | réelle | 25 | 9 | 0 % | 3 (40, 50, 60 : pas de +10) | L2×1 | 59 | 78 % | conseillé |
| neuve | Ligne graduée, niveau 5 | plus dur | pressée | 20 | 8 | 0 % | 2 (70, 80 : pas de +10) | L2×1 L1×1 | 22 | 16 % | conseillé |
| neuve | Ligne graduée, niveau 5 | très dur | appliquée | 27 | 9 | 0 % | 2 (50, 60 : pas de +10) | L2×1 | 85 | 100 % | très dur |
| neuve | Ligne graduée, niveau 5 | très dur | réelle | 25 | 8 | 0 % | 2 (20, 10 : pas de -10) | L2×1 L1×1 | 54 | 72 % | conseillé |
| neuve | Ligne graduée, niveau 5 | très dur | pressée | 20 | 8 | 0 % | 2 (70, 80 : pas de +10) | L2×1 L1×1 | 26 | 21 % | conseillé |
| neuve | Ligne graduée, niveau 6 | plus facile | appliquée | 40 | 32 | 0 % | 2 (54, 56 : pas de +2) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 6 | plus facile | réelle | 23 | 19 | 0 % | 2 (78, 72 : pas de -6) | L1×1 | 26 | 83 % | plus facile |
| neuve | Ligne graduée, niveau 6 | plus facile | pressée | 19 | 14 | 0 % | 2 (57, 59 : pas de +2) | L1×1 L3×1 | 19 | 19 % | plus facile |
| neuve | Ligne graduée, niveau 6 | conseillé | appliquée | 39 | 33 | 0 % | 2 (38, 36 : pas de -2) | – | 58 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 6 | conseillé | réelle | 27 | 20 | 0 % | 2 (62, 58 : pas de -4) | L1×1 | 50 | 74 % | conseillé |
| neuve | Ligne graduée, niveau 6 | conseillé | pressée | 24 | 16 | 0 % | 2 (49, 47 : pas de -2) | L1×1 | 21 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 6 | plus dur | appliquée | 40 | 29 | 0 % | 2 (77, 70 : pas de -7) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 6 | plus dur | réelle | 29 | 22 | 0 % | 2 (78, 70 : pas de -8) | L1×1 | 71 | 81 % | plus dur |
| neuve | Ligne graduée, niveau 6 | plus dur | pressée | 25 | 18 | 0 % | 2 (43, 53 : pas de +10) | L1×1 | 23 | 28 % | conseillé |
| neuve | Ligne graduée, niveau 6 | très dur | appliquée | 38 | 35 | 0 % | 2 (93, 84 : pas de -9) | – | 104 | 100 % | très dur |
| neuve | Ligne graduée, niveau 6 | très dur | réelle | 27 | 25 | 0 % | 2 (68, 77 : pas de +9) | L1×1 | 83 | 83 % | très dur |
| neuve | Ligne graduée, niveau 6 | très dur | pressée | 17 | 12 | 0 % | 2 (34, 35 : pas de +1) | L3×1 L1×1 | 24 | 20 % | conseillé |
| neuve | Ligne graduée, niveau 7 | plus facile | appliquée | 40 | 27 | 0 % | 2 (60, 69 : pas de +9) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 7 | plus facile | réelle | 23 | 14 | 0 % | 2 (70, 80 : pas de +10) | L1×1 | 28 | 79 % | plus facile |
| neuve | Ligne graduée, niveau 7 | plus facile | pressée | 20 | 14 | 0 % | 2 (80, 86 : pas de +6) | L1×1 L2×1 | 21 | 28 % | plus facile |
| neuve | Ligne graduée, niveau 7 | conseillé | appliquée | 40 | 28 | 0 % | 2 (60, 50 : pas de -10) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 7 | conseillé | réelle | 24 | 15 | 0 % | 2 (68, 77 : pas de +9) | L1×1 | 48 | 79 % | conseillé |
| neuve | Ligne graduée, niveau 7 | conseillé | pressée | 19 | 14 | 0 % | 2 (84, 76 : pas de -8) | L1×1 L3×1 | 26 | 32 % | conseillé |
| neuve | Ligne graduée, niveau 7 | plus dur | appliquée | 40 | 24 | 0 % | 2 (75, 74 : pas de -1) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 7 | plus dur | réelle | 29 | 20 | 0 % | 3 (90, 80, 70 : pas de -10) | L2×1 | 56 | 83 % | conseillé |
| neuve | Ligne graduée, niveau 7 | plus dur | pressée | 19 | 13 | 0 % | 2 (49, 55 : pas de +6) | L1×1 L3×1 | 25 | 29 % | conseillé |
| neuve | Ligne graduée, niveau 7 | très dur | appliquée | 40 | 25 | 0 % | 2 (90, 88 : pas de -2) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 7 | très dur | réelle | 24 | 15 | 0 % | 2 (27, 35 : pas de +8) | L1×1 | 65 | 74 % | plus dur |
| neuve | Ligne graduée, niveau 7 | très dur | pressée | 20 | 14 | 0 % | 2 (57, 50 : pas de -7) | L1×1 L3×1 | 26 | 27 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus facile | appliquée | 33 | 11 | 0 % | 2 (70, 80 : pas de +10) | – | 29 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 8 | plus facile | réelle | 27 | 11 | 0 % | 3 (70, 75, 80 : pas de +5) | – | 25 | 73 % | plus facile |
| neuve | Ligne graduée, niveau 8 | plus facile | pressée | 30 | 11 | 0 % | 3 (80, 70, 60 : pas de -10) | – | 18 | 26 % | plus facile |
| neuve | Ligne graduée, niveau 8 | conseillé | appliquée | 33 | 11 | 0 % | 2 (20, 30 : pas de +10) | – | 52 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 8 | conseillé | réelle | 33 | 11 | 0 % | 2 (80, 90 : pas de +10) | – | 51 | 75 % | conseillé |
| neuve | Ligne graduée, niveau 8 | conseillé | pressée | 27 | 11 | 0 % | 3 (70, 80, 90 : pas de +10) | – | 17 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus dur | appliquée | 33 | 11 | 0 % | 3 (60, 50, 40 : pas de -10) | – | 73 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 8 | plus dur | réelle | 29 | 11 | 0 % | 3 (50, 60, 70 : pas de +10) | – | 50 | 72 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus dur | pressée | 28 | 11 | 0 % | 2 (10, 20 : pas de +10) | – | 17 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 8 | très dur | appliquée | 33 | 11 | 0 % | 2 (50, 60 : pas de +10) | – | 94 | 100 % | très dur |
| neuve | Ligne graduée, niveau 8 | très dur | réelle | 32 | 11 | 0 % | 2 (70, 60 : pas de -10) | – | 77 | 84 % | plus dur |
| neuve | Ligne graduée, niveau 8 | très dur | pressée | 29 | 11 | 0 % | 2 (75, 70 : pas de -5) | – | 20 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 9 | plus facile | appliquée | 34 | 6 | 0 % | aucune | L10×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 9 | plus facile | réelle | 27 | 6 | 0 % | aucune | L10×1 | 28 | 85 % | plus facile |
| neuve | Ligne graduée, niveau 9 | plus facile | pressée | 21 | 6 | 0 % | aucune | L10×1 L1×1 | 20 | 21 % | plus facile |
| neuve | Ligne graduée, niveau 9 | conseillé | appliquée | 34 | 8 | 0 % | aucune | L10×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 9 | conseillé | réelle | 19 | 8 | 0 % | aucune | L10×1 L1×1 | 49 | 74 % | conseillé |
| neuve | Ligne graduée, niveau 9 | conseillé | pressée | 17 | 8 | 0 % | aucune | L10×1 L1×1 | 20 | 14 % | conseillé |
| neuve | Ligne graduée, niveau 9 | plus dur | appliquée | 34 | 9 | 0 % | aucune | L10×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 9 | plus dur | réelle | 27 | 9 | 0 % | aucune | L10×1 | 70 | 85 % | plus dur |
| neuve | Ligne graduée, niveau 9 | plus dur | pressée | 18 | 8 | 0 % | aucune | L10×1 L1×1 | 21 | 13 % | conseillé |
| neuve | Ligne graduée, niveau 9 | très dur | appliquée | 27 | 9 | 0 % | aucune | L10×1 | 85 | 100 % | très dur |
| neuve | Ligne graduée, niveau 9 | très dur | réelle | 19 | 9 | 0 % | aucune | L10×1 L1×1 | 61 | 75 % | plus dur |
| neuve | Ligne graduée, niveau 9 | très dur | pressée | 19 | 8 | 0 % | aucune | L10×1 L1×1 | 24 | 26 % | conseillé |
| neuve | Ligne graduée, niveau 10 | plus facile | appliquée | 40 | 34 | 0 % | 2 (970, 960 : pas de -10) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 10 | plus facile | réelle | 33 | 28 | 0 % | 2 (380, 370 : pas de -10) | L1×1 | 34 | 85 % | plus facile |
| neuve | Ligne graduée, niveau 10 | plus facile | pressée | 18 | 13 | 0 % | 2 (830, 840 : pas de +10) | L3×1 L1×1 | 19 | 17 % | plus facile |
| neuve | Ligne graduée, niveau 10 | conseillé | appliquée | 39 | 32 | 0 % | aucune | – | 58 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 10 | conseillé | réelle | 22 | 17 | 0 % | 2 (780, 790 : pas de +10) | L10×1 | 45 | 70 % | conseillé |
| neuve | Ligne graduée, niveau 10 | conseillé | pressée | 19 | 13 | 0 % | aucune | L3×1 L1×1 | 26 | 24 % | conseillé |
| neuve | Ligne graduée, niveau 10 | plus dur | appliquée | 39 | 22 | 0 % | 2 (640, 650 : pas de +10) | – | 82 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 10 | plus dur | réelle | 18 | 12 | 0 % | 2 (640, 650 : pas de +10) | L1×1 L10×1 | 59 | 75 % | plus dur |
| neuve | Ligne graduée, niveau 10 | plus dur | pressée | 26 | 17 | 0 % | 2 (850, 840 : pas de -10) | L3×1 | 26 | 24 % | conseillé |
| neuve | Ligne graduée, niveau 10 | très dur | appliquée | 40 | 33 | 0 % | aucune | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 10 | très dur | réelle | 32 | 20 | 0 % | 2 (650, 660 : pas de +10) | – | 76 | 84 % | plus dur |
| neuve | Ligne graduée, niveau 10 | très dur | pressée | 18 | 14 | 0 % | aucune | L10×1 L1×1 | 24 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 11 | plus facile | appliquée | 40 | 36 | 0 % | 2 (459, 463 : pas de +4) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 11 | plus facile | réelle | 24 | 22 | 0 % | 2 (389, 397 : pas de +8) | L1×1 | 25 | 74 % | plus facile |
| neuve | Ligne graduée, niveau 11 | plus facile | pressée | 17 | 12 | 0 % | 2 (397, 388 : pas de -9) | L1×1 L3×1 | 18 | 14 % | plus facile |
| neuve | Ligne graduée, niveau 11 | conseillé | appliquée | 38 | 38 | 0 % | 2 (524, 526 : pas de +2) | – | 57 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 11 | conseillé | réelle | 24 | 22 | 0 % | 2 (786, 796 : pas de +10) | L3×1 | 46 | 86 % | conseillé |
| neuve | Ligne graduée, niveau 11 | conseillé | pressée | 17 | 12 | 0 % | aucune | L1×1 L10×1 | 20 | 14 % | conseillé |
| neuve | Ligne graduée, niveau 11 | plus dur | appliquée | 39 | 39 | 0 % | 2 (724, 722 : pas de -2) | – | 82 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 11 | plus dur | réelle | 32 | 29 | 0 % | 2 (456, 465 : pas de +9) | – | 54 | 80 % | conseillé |
| neuve | Ligne graduée, niveau 11 | plus dur | pressée | 17 | 12 | 0 % | 2 (798, 795 : pas de -3) | L10×1 L1×1 | 21 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 11 | très dur | appliquée | 40 | 40 | 0 % | 2 (894, 897 : pas de +3) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 11 | très dur | réelle | 25 | 21 | 0 % | aucune | L1×1 | 61 | 74 % | conseillé |
| neuve | Ligne graduée, niveau 11 | très dur | pressée | 18 | 14 | 0 % | 2 (567, 563 : pas de -4) | L3×1 L1×1 | 21 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 12 | plus facile | appliquée | 39 | 29 | 0 % | aucune | – | 32 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 12 | plus facile | réelle | 29 | 20 | 0 % | aucune | – | 27 | 72 % | plus facile |
| neuve | Ligne graduée, niveau 12 | plus facile | pressée | 26 | 14 | 0 % | 2 (332, 331 : pas de -1) | – | 11 | 8 % | plus facile |
| neuve | Ligne graduée, niveau 12 | conseillé | appliquée | 38 | 30 | 0 % | aucune | – | 57 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 12 | conseillé | réelle | 30 | 21 | 0 % | 2 (692, 700 : pas de +8) | – | 46 | 76 % | conseillé |
| neuve | Ligne graduée, niveau 12 | conseillé | pressée | 26 | 16 | 0 % | aucune | – | 12 | 5 % | conseillé |
| neuve | Ligne graduée, niveau 12 | plus dur | appliquée | 40 | 31 | 0 % | 2 (415, 408 : pas de -7) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 12 | plus dur | réelle | 23 | 18 | 0 % | aucune | L10×1 | 51 | 84 % | conseillé |
| neuve | Ligne graduée, niveau 12 | plus dur | pressée | 26 | 16 | 0 % | 2 (253, 252 : pas de -1) | – | 17 | 13 % | conseillé |
| neuve | Ligne graduée, niveau 12 | très dur | appliquée | 40 | 29 | 0 % | 2 (800, 809 : pas de +9) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 12 | très dur | réelle | 31 | 22 | 0 % | 2 (305, 311 : pas de +6) | – | 86 | 77 % | conseillé |
| neuve | Ligne graduée, niveau 12 | très dur | pressée | 26 | 15 | 0 % | 2 (759, 754 : pas de -5) | – | 14 | 8 % | conseillé |
| neuve | Ligne graduée, niveau 13 | plus facile | appliquée | 33 | 11 | 0 % | aucune | – | 29 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 13 | plus facile | réelle | 30 | 11 | 0 % | aucune | – | 29 | 80 % | plus facile |
| neuve | Ligne graduée, niveau 13 | plus facile | pressée | 30 | 11 | 0 % | aucune | – | 16 | 25 % | plus facile |
| neuve | Ligne graduée, niveau 13 | conseillé | appliquée | 33 | 11 | 0 % | aucune | – | 52 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 13 | conseillé | réelle | 33 | 11 | 0 % | aucune | – | 54 | 83 % | conseillé |
| neuve | Ligne graduée, niveau 13 | conseillé | pressée | 26 | 11 | 0 % | aucune | – | 17 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 13 | plus dur | appliquée | 33 | 11 | 0 % | aucune | – | 73 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 13 | plus dur | réelle | 30 | 11 | 0 % | aucune | – | 73 | 80 % | plus dur |
| neuve | Ligne graduée, niveau 13 | plus dur | pressée | 29 | 11 | 0 % | aucune | – | 17 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 13 | très dur | appliquée | 33 | 11 | 0 % | aucune | – | 94 | 100 % | très dur |
| neuve | Ligne graduée, niveau 13 | très dur | réelle | 32 | 11 | 0 % | aucune | – | 94 | 82 % | très dur |
| neuve | Ligne graduée, niveau 13 | très dur | pressée | 27 | 11 | 0 % | aucune | – | 16 | 13 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus facile | appliquée | 24 | 7 | 17 % | 2 (5, 7 : pas de +2) | – | 25 | 100 % | plus facile |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus facile | réelle | 22 | 6 | 10 % | 2 (2, 10 : pas de +8) | – | 26 | 85 % | plus facile |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus facile | pressée | 20 | 5 | 11 % | 3 (5, 6, 7 : pas de +1) | – | 11 | 9 % | plus facile |
| neuve | Additions, famille 1 (+ 1 et + 2) | conseillé | appliquée | 40 | 8 | 10 % | 2 (7, 8 : pas de +1) | – | 59 | 100 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | conseillé | réelle | 31 | 8 | 20 % | 2 (3, 8 : pas de +5) | – | 48 | 88 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | conseillé | pressée | 29 | 7 | 14 % | 2 (4, 9 : pas de +5) | – | 18 | 17 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus dur | appliquée | 40 | 10 | 5 % | 2 (6, 7 : pas de +1) | – | 83 | 100 % | plus dur |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus dur | réelle | 27 | 6 | 12 % | 2 (3, 9 : pas de +6) | – | 43 | 67 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus dur | pressée | 27 | 5 | 15 % | 3 (7, 8, 9 : pas de +1) | – | 14 | 10 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | très dur | appliquée | 40 | 7 | 10 % | 3 (7, 4, 1 : pas de -3) | – | 108 | 100 % | très dur |
| neuve | Additions, famille 1 (+ 1 et + 2) | très dur | réelle | 31 | 8 | 13 % | 2 (4, 5 : pas de +1) | – | 78 | 77 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | très dur | pressée | 27 | 6 | 12 % | 3 (10, 8, 6 : pas de -2) | – | 19 | 15 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | appliquée | 19 | 6 | 6 % | 3 (2, 4, 6 : pas de +2) | L4×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | réelle | 15 | 5 | 0 % | 3 (10, 8, 6 : pas de -2) | L4×1 | 25 | 70 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | pressée | 17 | 5 | 0 % | 3 (8, 6, 4 : pas de -2) | L4×1 | 17 | 16 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | conseillé | appliquée | 32 | 8 | 16 % | 3 (2, 4, 6 : pas de +2) | L4×1 | 54 | 100 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | conseillé | réelle | 24 | 6 | 9 % | 3 (2, 6, 10 : pas de +4) | L4×1 | 46 | 83 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | conseillé | pressée | 22 | 6 | 5 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 17 | 11 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus dur | appliquée | 33 | 10 | 0 % | 3 (1, 4, 7 : pas de +3) | L4×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus dur | réelle | 25 | 6 | 17 % | 3 (6, 4, 2 : pas de -2) | L4×1 | 50 | 79 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus dur | pressée | 20 | 6 | 5 % | 3 (2, 6, 10 : pas de +4) | L4×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | très dur | appliquée | 30 | 6 | 10 % | 3 (1, 2, 3 : pas de +1) | L4×1 | 91 | 100 % | très dur |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | très dur | réelle | 23 | 8 | 0 % | 3 (1, 3, 5 : pas de +2) | L4×1 | 69 | 77 % | plus dur |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | très dur | pressée | 20 | 5 | 11 % | 3 (8, 6, 4 : pas de -2) | L4×1 | 19 | 16 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus facile | appliquée | 19 | 9 | 6 % | 2 (1, 4 : pas de +3) | L5×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | plus facile | réelle | 14 | 8 | 0 % | 2 (4, 9 : pas de +5) | L5×1 | 23 | 57 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | plus facile | pressée | 16 | 5 | 13 % | 2 (9, 5 : pas de -4) | L5×1 | 14 | 10 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | conseillé | appliquée | 33 | 9 | 9 % | 3 (8, 7, 6 : pas de -1) | L5×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | conseillé | réelle | 24 | 9 | 0 % | 2 (4, 1 : pas de -3) | L5×1 | 45 | 85 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | conseillé | pressée | 23 | 8 | 0 % | 3 (9, 8, 7 : pas de -1) | L5×1 | 17 | 11 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus dur | appliquée | 33 | 9 | 6 % | 3 (4, 5, 6 : pas de +1) | L5×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 3 (amis de 10) | plus dur | réelle | 24 | 9 | 4 % | 3 (4, 3, 2 : pas de -1) | L5×1 | 53 | 74 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus dur | pressée | 22 | 8 | 5 % | 2 (8, 9 : pas de +1) | L5×1 | 16 | 6 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | très dur | appliquée | 33 | 9 | 3 % | 3 (4, 5, 6 : pas de +1) | L5×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 3 (amis de 10) | très dur | réelle | 24 | 9 | 4 % | 3 (6, 7, 8 : pas de +1) | L5×1 | 56 | 74 % | plus dur |
| neuve | Additions, famille 3 (amis de 10) | très dur | pressée | 22 | 7 | 14 % | 3 (5, 7, 9 : pas de +2) | L5×1 | 16 | 9 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | appliquée | 19 | 7 | 17 % | 2 (6, 5 : pas de -1) | L6×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | réelle | 16 | 5 | 20 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 23 | 77 % | plus facile |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | pressée | 16 | 7 | 0 % | 3 (5, 7, 9 : pas de +2) | L6×1 | 14 | 10 % | plus facile |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | appliquée | 33 | 8 | 3 % | 3 (4, 5, 6 : pas de +1) | L6×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | réelle | 21 | 7 | 5 % | 3 (4, 6, 8 : pas de +2) | L6×1 | 35 | 56 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | pressée | 21 | 9 | 5 % | 3 (4, 7, 10 : pas de +3) | L6×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | appliquée | 33 | 8 | 0 % | 3 (7, 6, 5 : pas de -1) | L6×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | réelle | 24 | 8 | 4 % | 3 (7, 4, 1 : pas de -3) | L6×1 | 59 | 81 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | pressée | 22 | 7 | 5 % | 2 (6, 4 : pas de -2) | L6×1 | 18 | 9 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | appliquée | 33 | 6 | 3 % | 3 (4, 3, 2 : pas de -1) | L6×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | réelle | 21 | 7 | 5 % | 3 (7, 4, 1 : pas de -3) | L6×1 | 56 | 69 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | pressée | 23 | 6 | 0 % | 3 (3, 4, 5 : pas de +1) | L6×1 | 20 | 14 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus facile | appliquée | 19 | 8 | 0 % | 3 (7, 8, 9 : pas de +1) | L6×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus facile | réelle | 14 | 7 | 0 % | 2 (8, 6 : pas de -2) | L6×1 | 20 | 60 % | plus facile |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus facile | pressée | 16 | 7 | 0 % | 3 (1, 5, 9 : pas de +4) | L6×1 | 15 | 11 % | plus facile |
| neuve | Additions, famille 5 (maisons de 8 et 9) | conseillé | appliquée | 33 | 9 | 9 % | 3 (8, 6, 4 : pas de -2) | L6×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | conseillé | réelle | 23 | 9 | 5 % | 3 (1, 5, 9 : pas de +4) | L6×1 | 47 | 74 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | conseillé | pressée | 23 | 7 | 9 % | 2 (9, 1 : pas de -8) | L6×1 | 17 | 9 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus dur | appliquée | 33 | 8 | 6 % | 3 (7, 4, 1 : pas de -3) | L6×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus dur | réelle | 24 | 9 | 0 % | 2 (1, 2 : pas de +1) | L6×1 | 50 | 74 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus dur | pressée | 20 | 8 | 0 % | 3 (3, 6, 9 : pas de +3) | L6×1 | 15 | 6 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | très dur | appliquée | 33 | 8 | 9 % | 3 (6, 5, 4 : pas de -1) | L6×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 5 (maisons de 8 et 9) | très dur | réelle | 24 | 8 | 0 % | 2 (1, 2 : pas de +1) | L6×1 | 70 | 76 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | très dur | pressée | 22 | 7 | 5 % | 3 (1, 5, 9 : pas de +4) | L6×1 | 19 | 11 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | plus facile | appliquée | 19 | 7 | 11 % | 3 (3, 5, 7 : pas de +2) | L4×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 6 (presque-doubles) | plus facile | réelle | 16 | 7 | 13 % | 2 (3, 9 : pas de +6) | L4×1 | 24 | 81 % | plus facile |
| neuve | Additions, famille 6 (presque-doubles) | plus facile | pressée | 17 | 7 | 13 % | 3 (9, 7, 5 : pas de -2) | L4×1 | 15 | 10 % | plus facile |
| neuve | Additions, famille 6 (presque-doubles) | conseillé | appliquée | 33 | 7 | 16 % | 3 (5, 4, 3 : pas de -1) | L4×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | conseillé | réelle | 24 | 5 | 9 % | 3 (9, 7, 5 : pas de -2) | L4×1 | 44 | 82 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | conseillé | pressée | 22 | 6 | 10 % | 3 (9, 7, 5 : pas de -2) | L4×1 | 16 | 9 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | plus dur | appliquée | 33 | 9 | 0 % | 2 (5, 9 : pas de +4) | L4×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 6 (presque-doubles) | plus dur | réelle | 23 | 8 | 9 % | 2 (3, 7 : pas de +4) | L4×1 | 54 | 81 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | plus dur | pressée | 21 | 5 | 15 % | 2 (5, 7 : pas de +2) | L4×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | très dur | appliquée | 33 | 8 | 6 % | 3 (9, 5, 1 : pas de -4) | L4×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 6 (presque-doubles) | très dur | réelle | 23 | 8 | 5 % | 3 (5, 6, 7 : pas de +1) | L4×1 | 57 | 70 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | très dur | pressée | 21 | 5 | 10 % | 3 (9, 7, 5 : pas de -2) | L4×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 7 (mélange) | plus facile | appliquée | 24 | 5 | 13 % | 2 (10, 6 : pas de -4) | – | 25 | 100 % | plus facile |
| neuve | Additions, famille 7 (mélange) | plus facile | réelle | 20 | 5 | 11 % | 3 (8, 9, 10 : pas de +1) | – | 22 | 89 % | plus facile |
| neuve | Additions, famille 7 (mélange) | plus facile | pressée | 20 | 5 | 5 % | 2 (6, 7 : pas de +1) | – | 11 | 9 % | plus facile |
| neuve | Additions, famille 7 (mélange) | conseillé | appliquée | 40 | 6 | 15 % | 3 (4, 6, 8 : pas de +2) | – | 59 | 100 % | conseillé |
| neuve | Additions, famille 7 (mélange) | conseillé | réelle | 31 | 8 | 10 % | 2 (6, 9 : pas de +3) | – | 49 | 83 % | conseillé |
| neuve | Additions, famille 7 (mélange) | conseillé | pressée | 26 | 5 | 4 % | 2 (6, 7 : pas de +1) | – | 12 | 5 % | conseillé |
| neuve | Additions, famille 7 (mélange) | plus dur | appliquée | 40 | 10 | 0 % | 3 (10, 9, 8 : pas de -1) | – | 83 | 100 % | plus dur |
| neuve | Additions, famille 7 (mélange) | plus dur | réelle | 31 | 10 | 3 % | 2 (10, 5 : pas de -5) | – | 67 | 88 % | plus dur |
| neuve | Additions, famille 7 (mélange) | plus dur | pressée | 23 | 5 | 9 % | 3 (2, 6, 10 : pas de +4) | – | 13 | 8 % | conseillé |
| neuve | Additions, famille 7 (mélange) | très dur | appliquée | 40 | 9 | 10 % | 2 (9, 5 : pas de -4) | – | 108 | 100 % | très dur |
| neuve | Additions, famille 7 (mélange) | très dur | réelle | 26 | 8 | 12 % | 2 (9, 10 : pas de +1) | – | 63 | 74 % | conseillé |
| neuve | Additions, famille 7 (mélange) | très dur | pressée | 26 | 6 | 8 % | 2 (6, 4 : pas de -2) | – | 12 | 5 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus facile | appliquée | 30 | 26 | 0 % | 2 (51, 45 : pas de -6) | – | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus facile | réelle | 24 | 20 | 0 % | 3 (90, 89, 88 : pas de -1) | – | 26 | 78 % | plus facile |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus facile | pressée | 20 | 13 | 0 % | 2 (94, 84 : pas de -10) | – | 10 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | conseillé | appliquée | 43 | 35 | 0 % | 2 (55, 50 : pas de -5) | – | 62 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | conseillé | réelle | 32 | 26 | 0 % | 2 (57, 52 : pas de -5) | – | 54 | 83 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | conseillé | pressée | 22 | 14 | 0 % | 2 (30, 29 : pas de -1) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus dur | appliquée | 43 | 35 | 0 % | 2 (44, 53 : pas de +9) | – | 88 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus dur | réelle | 27 | 22 | 0 % | 2 (33, 40 : pas de +7) | – | 44 | 69 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus dur | pressée | 22 | 14 | 5 % | 2 (24, 19 : pas de -5) | – | 12 | 6 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | très dur | appliquée | 41 | 32 | 0 % | 2 (38, 32 : pas de -6) | – | 110 | 100 % | très dur |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | très dur | réelle | 28 | 21 | 0 % | 2 (39, 31 : pas de -8) | – | 78 | 74 % | plus dur |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | très dur | pressée | 22 | 14 | 0 % | 3 (79, 73, 67 : pas de -6) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | appliquée | 24 | 22 | 0 % | 2 (31, 39 : pas de +8) | L7×1 | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | réelle | 19 | 17 | 0 % | 2 (51, 60 : pas de +9) | L7×1 | 24 | 84 % | plus facile |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | pressée | 16 | 10 | 0 % | 3 (33, 23, 13 : pas de -10) | L7×1 | 13 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | appliquée | 34 | 27 | 0 % | 2 (22, 31 : pas de +9) | L7×1 | 56 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | réelle | 23 | 19 | 0 % | 2 (42, 44 : pas de +2) | L7×1 | 42 | 75 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | pressée | 18 | 11 | 0 % | 2 (64, 54 : pas de -10) | L7×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | appliquée | 34 | 31 | 0 % | 2 (62, 55 : pas de -7) | L7×1 | 77 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | réelle | 24 | 19 | 0 % | 2 (27, 37 : pas de +10) | L7×1 | 52 | 83 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | pressée | 18 | 12 | 0 % | 2 (41, 40 : pas de -1) | L7×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | très dur | appliquée | 34 | 30 | 0 % | 3 (26, 19, 12 : pas de -7) | L7×1 | 99 | 100 % | très dur |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | très dur | réelle | 24 | 20 | 0 % | 2 (17, 18 : pas de +1) | L7×1 | 69 | 85 % | plus dur |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | très dur | pressée | 18 | 12 | 0 % | 2 (22, 29 : pas de +7) | L7×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | appliquée | 26 | 24 | 0 % | 2 (58, 54 : pas de -4) | – | 26 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | réelle | 20 | 17 | 0 % | 3 (71, 62, 53 : pas de -9) | – | 21 | 81 % | plus facile |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | pressée | 19 | 12 | 0 % | 2 (16, 19 : pas de +3) | – | 10 | 0 % | plus facile |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | appliquée | 36 | 31 | 0 % | 2 (53, 56 : pas de +3) | – | 55 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | réelle | 17 | 14 | 0 % | 2 (57, 49 : pas de -8) | L7×1 | 37 | 69 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | pressée | 22 | 15 | 0 % | 2 (35, 33 : pas de -2) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | appliquée | 37 | 32 | 0 % | 2 (32, 31 : pas de -1) | – | 79 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | réelle | 26 | 21 | 0 % | 2 (92, 97 : pas de +5) | – | 59 | 81 % | plus dur |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | pressée | 22 | 14 | 0 % | 2 (91, 94 : pas de +3) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | très dur | appliquée | 41 | 33 | 0 % | 2 (51, 44 : pas de -7) | – | 110 | 100 % | très dur |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | très dur | réelle | 30 | 21 | 0 % | 2 (68, 76 : pas de +8) | – | 60 | 81 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | très dur | pressée | 22 | 13 | 0 % | 2 (83, 79 : pas de -4) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | appliquée | 30 | 24 | 0 % | 2 (28, 35 : pas de +7) | – | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | réelle | 23 | 17 | 5 % | 2 (66, 58 : pas de -8) | – | 24 | 79 % | plus facile |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | pressée | 19 | 12 | 0 % | 2 (69, 64 : pas de -5) | – | 10 | 0 % | plus facile |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | appliquée | 43 | 30 | 2 % | 2 (67, 67 : même réponse) | – | 62 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | réelle | 32 | 21 | 0 % | 2 (68, 76 : pas de +8) | – | 49 | 84 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | pressée | 22 | 14 | 0 % | 2 (96, 86 : pas de -10) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | appliquée | 43 | 30 | 0 % | 2 (89, 99 : pas de +10) | – | 88 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | réelle | 27 | 18 | 0 % | 2 (95, 85 : pas de -10) | – | 67 | 72 % | plus dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | pressée | 22 | 13 | 5 % | 2 (77, 79 : pas de +2) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | appliquée | 42 | 5 | 7 % | 3 (6, 5, 4 : pas de -1) | – | 112 | 100 % | très dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | réelle | 31 | 6 | 17 % | 3 (4, 5, 6 : pas de +1) | – | 86 | 83 % | très dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | pressée | 22 | 14 | 10 % | 2 (67, 68 : pas de +1) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | appliquée | 30 | 25 | 3 % | 2 (23, 31 : pas de +8) | – | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | réelle | 22 | 17 | 0 % | 2 (15, 13 : pas de -2) | – | 23 | 68 % | plus facile |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | pressée | 19 | 12 | 0 % | 2 (73, 63 : pas de -10) | – | 10 | 0 % | plus facile |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | appliquée | 43 | 33 | 0 % | 2 (75, 80 : pas de +5) | – | 62 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | réelle | 32 | 21 | 0 % | 3 (40, 41, 42 : pas de +1) | – | 50 | 88 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | pressée | 23 | 13 | 0 % | 2 (64, 55 : pas de -9) | – | 11 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | appliquée | 40 | 28 | 5 % | 2 (46, 51 : pas de +5) | – | 83 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | réelle | 31 | 21 | 3 % | 2 (50, 41 : pas de -9) | – | 65 | 73 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | pressée | 23 | 15 | 0 % | 2 (52, 62 : pas de +10) | – | 11 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | appliquée | 43 | 6 | 14 % | 3 (2, 4, 6 : pas de +2) | – | 114 | 100 % | très dur |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | réelle | 29 | 8 | 11 % | 3 (2, 3, 4 : pas de +1) | – | 85 | 77 % | plus dur |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | pressée | 22 | 15 | 0 % | 2 (73, 70 : pas de -3) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus facile | appliquée | 23 | 20 | 0 % | 2 (41, 44 : pas de +3) | L8×1 | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus facile | réelle | 18 | 14 | 0 % | 2 (93, 85 : pas de -8) | L8×1 | 26 | 82 % | plus facile |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus facile | pressée | 16 | 11 | 0 % | 2 (60, 58 : pas de -2) | L8×1 | 14 | 7 % | plus facile |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | conseillé | appliquée | 33 | 31 | 0 % | 2 (70, 63 : pas de -7) | L8×1 | 55 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | conseillé | réelle | 23 | 21 | 0 % | 2 (43, 36 : pas de -7) | L8×1 | 41 | 68 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | conseillé | pressée | 18 | 12 | 0 % | 2 (22, 32 : pas de +10) | L8×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus dur | appliquée | 33 | 25 | 0 % | 2 (86, 77 : pas de -9) | L8×1 | 76 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus dur | réelle | 15 | 14 | 0 % | 2 (73, 81 : pas de +8) | L8×1 L9×1 | 44 | 77 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus dur | pressée | 18 | 12 | 0 % | 3 (42, 44, 46 : pas de +2) | L8×1 | 16 | 7 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | très dur | appliquée | 33 | 28 | 0 % | 2 (23, 25 : pas de +2) | L8×1 | 97 | 100 % | très dur |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | très dur | réelle | 20 | 17 | 0 % | 3 (96, 93, 90 : pas de -3) | L8×1 | 60 | 74 % | plus dur |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | très dur | pressée | 18 | 12 | 0 % | 2 (23, 20 : pas de -3) | L8×1 | 18 | 7 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | appliquée | 23 | 19 | 0 % | 2 (22, 31 : pas de +9) | L9×1 | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | réelle | 17 | 12 | 0 % | 2 (85, 93 : pas de +8) | L9×1 | 26 | 72 % | plus facile |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | pressée | 16 | 10 | 0 % | 2 (82, 73 : pas de -9) | L9×1 | 13 | 0 % | plus facile |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | appliquée | 33 | 25 | 0 % | 3 (63, 72, 81 : pas de +9) | L9×1 | 55 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | réelle | 22 | 17 | 0 % | 2 (74, 71 : pas de -3) | L9×1 | 41 | 81 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | pressée | 18 | 12 | 0 % | 2 (32, 24 : pas de -8) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | appliquée | 33 | 24 | 0 % | 2 (62, 71 : pas de +9) | L9×1 | 76 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | réelle | 22 | 13 | 5 % | 2 (52, 51 : pas de -1) | L9×1 | 52 | 79 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | pressée | 18 | 11 | 0 % | 2 (26, 21 : pas de -5) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | appliquée | 34 | 6 | 9 % | 3 (8, 7, 6 : pas de -1) | L9×1 | 99 | 100 % | très dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | réelle | 21 | 16 | 0 % | 3 (4, 6, 8 : pas de +2) | L9×1 | 59 | 72 % | plus dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | pressée | 18 | 12 | 0 % | 2 (44, 54 : pas de +10) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | appliquée | 29 | 23 | 4 % | 2 (96, 99 : pas de +3) | – | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | réelle | 15 | 10 | 0 % | 2 (91, 85 : pas de -6) | L7×1 | 21 | 67 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | pressée | 20 | 10 | 0 % | 3 (95, 96, 97 : pas de +1) | – | 11 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | appliquée | 41 | 30 | 3 % | 2 (73, 75 : pas de +2) | – | 60 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | réelle | 31 | 19 | 0 % | 2 (99, 97 : pas de -2) | – | 48 | 80 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | pressée | 22 | 12 | 0 % | 2 (79, 88 : pas de +9) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | appliquée | 41 | 29 | 3 % | 2 (85, 92 : pas de +7) | – | 85 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | réelle | 20 | 13 | 0 % | 2 (89, 97 : pas de +8) | L7×1 | 45 | 65 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | pressée | 22 | 14 | 0 % | 2 (96, 99 : pas de +3) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | appliquée | 43 | 32 | 0 % | 3 (14, 21, 28 : pas de +7) | – | 114 | 100 % | très dur |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | réelle | 29 | 17 | 0 % | 2 (88, 96 : pas de +8) | – | 53 | 71 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | pressée | 22 | 11 | 10 % | 2 (99, 89 : pas de -10) | – | 11 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | appliquée | 29 | 22 | 4 % | 2 (16, 18 : pas de +2) | – | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | réelle | 24 | 20 | 0 % | 2 (58, 56 : pas de -2) | – | 24 | 82 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | pressée | 19 | 13 | 0 % | 2 (19, 28 : pas de +9) | – | 11 | 6 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | appliquée | 41 | 28 | 0 % | 2 (19, 16 : pas de -3) | – | 60 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | réelle | 26 | 19 | 4 % | 2 (44, 34 : pas de -10) | – | 42 | 76 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | pressée | 24 | 14 | 0 % | 2 (77, 85 : pas de +8) | – | 14 | 6 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | appliquée | 40 | 28 | 0 % | 2 (43, 37 : pas de -6) | – | 83 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | réelle | 25 | 16 | 0 % | 2 (79, 76 : pas de -3) | – | 40 | 62 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | pressée | 22 | 15 | 0 % | 2 (35, 27 : pas de -8) | – | 12 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | appliquée | 41 | 27 | 0 % | 2 (78, 85 : pas de +7) | – | 110 | 100 % | très dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | réelle | 26 | 16 | 4 % | 2 (57, 48 : pas de -9) | – | 63 | 77 % | plus dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | pressée | 22 | 13 | 0 % | 2 (58, 64 : pas de +6) | – | 11 | 3 % | conseillé |
| mois | Ligne graduée, niveau 1 | plus facile | appliquée | 38 | 10 | 0 % | 3 (7, 8, 9 : pas de +1) | – | 52 | 100 % | plus facile |
| mois | Ligne graduée, niveau 1 | plus facile | réelle | 26 | 10 | 4 % | 2 (9, 7 : pas de -2) | L1×1 | 40 | 75 % | plus facile |
| mois | Ligne graduée, niveau 1 | plus facile | pressée | 29 | 9 | 4 % | 2 (5, 6 : pas de +1) | L1×1 | 31 | 28 % | plus facile |
| mois | Ligne graduée, niveau 1 | conseillé | appliquée | 40 | 10 | 3 % | 3 (1, 5, 9 : pas de +4) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 1 | conseillé | réelle | 23 | 10 | 9 % | 3 (4, 3, 2 : pas de -1) | L1×1 | 62 | 76 % | conseillé |
| mois | Ligne graduée, niveau 1 | conseillé | pressée | 24 | 8 | 0 % | 3 (4, 3, 2 : pas de -1) | L1×1 | 34 | 16 % | conseillé |
| mois | Ligne graduée, niveau 1 | plus dur | appliquée | 39 | 10 | 0 % | 3 (5, 4, 3 : pas de -1) | – | 117 | 100 % | plus dur |
| mois | Ligne graduée, niveau 1 | plus dur | réelle | 29 | 10 | 7 % | 2 (2, 10 : pas de +8) | L1×1 | 94 | 84 % | plus dur |
| mois | Ligne graduée, niveau 1 | plus dur | pressée | 27 | 9 | 4 % | 3 (4, 6, 8 : pas de +2) | L1×1 | 40 | 24 % | conseillé |
| mois | Ligne graduée, niveau 1 | très dur | appliquée | 40 | 10 | 10 % | 2 (4, 9 : pas de +5) | – | 152 | 100 % | très dur |
| mois | Ligne graduée, niveau 1 | très dur | réelle | 25 | 10 | 0 % | 3 (8, 7, 6 : pas de -1) | L1×1 | 114 | 78 % | très dur |
| mois | Ligne graduée, niveau 1 | très dur | pressée | 26 | 10 | 4 % | 3 (1, 4, 7 : pas de +3) | L1×1 | 34 | 17 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus facile | appliquée | 36 | 6 | 0 % | 3 (1, 4, 7 : pas de +3) | – | 51 | 100 % | plus facile |
| mois | Ligne graduée, niveau 2 | plus facile | réelle | 24 | 6 | 0 % | 3 (7, 4, 1 : pas de -3) | L1×1 | 39 | 85 % | plus facile |
| mois | Ligne graduée, niveau 2 | plus facile | pressée | 23 | 6 | 0 % | 2 (4, 6 : pas de +2) | L1×1 | 21 | 9 % | plus facile |
| mois | Ligne graduée, niveau 2 | conseillé | appliquée | 40 | 8 | 0 % | 2 (9, 6 : pas de -3) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 2 | conseillé | réelle | 34 | 8 | 0 % | 3 (8, 6, 4 : pas de -2) | – | 68 | 78 % | conseillé |
| mois | Ligne graduée, niveau 2 | conseillé | pressée | 22 | 8 | 0 % | 2 (3, 7 : pas de +4) | L1×1 | 31 | 15 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus dur | appliquée | 40 | 9 | 0 % | 3 (5, 6, 7 : pas de +1) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 2 | plus dur | réelle | 31 | 8 | 0 % | 3 (3, 6, 9 : pas de +3) | – | 64 | 73 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus dur | pressée | 22 | 8 | 0 % | 2 (4, 7 : pas de +3) | L1×1 | 28 | 14 % | conseillé |
| mois | Ligne graduée, niveau 2 | très dur | appliquée | 27 | 9 | 0 % | 3 (9, 7, 5 : pas de -2) | – | 126 | 100 % | très dur |
| mois | Ligne graduée, niveau 2 | très dur | réelle | 23 | 9 | 0 % | 2 (4, 1 : pas de -3) | L1×1 | 96 | 79 % | très dur |
| mois | Ligne graduée, niveau 2 | très dur | pressée | 24 | 8 | 0 % | 3 (3, 6, 9 : pas de +3) | L1×1 | 28 | 13 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus facile | appliquée | 40 | 16 | 0 % | 3 (11, 6, 1 : pas de -5) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 3 | plus facile | réelle | 30 | 16 | 0 % | 2 (18, 14 : pas de -4) | – | 41 | 77 % | plus facile |
| mois | Ligne graduée, niveau 3 | plus facile | pressée | 22 | 14 | 0 % | 2 (16, 9 : pas de -7) | L1×1 | 22 | 10 % | plus facile |
| mois | Ligne graduée, niveau 3 | conseillé | appliquée | 39 | 18 | 0 % | 2 (16, 11 : pas de -5) | – | 85 | 100 % | conseillé |
| mois | Ligne graduée, niveau 3 | conseillé | réelle | 29 | 18 | 0 % | 2 (16, 19 : pas de +3) | – | 62 | 74 % | conseillé |
| mois | Ligne graduée, niveau 3 | conseillé | pressée | 21 | 13 | 0 % | 2 (4, 5 : pas de +1) | L1×1 | 26 | 11 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus dur | appliquée | 40 | 19 | 0 % | 3 (3, 10, 17 : pas de +7) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 3 | plus dur | réelle | 22 | 14 | 0 % | 2 (3, 13 : pas de +10) | L1×1 | 71 | 75 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus dur | pressée | 24 | 17 | 0 % | 2 (7, 17 : pas de +10) | L1×1 | 31 | 16 % | conseillé |
| mois | Ligne graduée, niveau 3 | très dur | appliquée | 38 | 19 | 0 % | 3 (18, 16, 14 : pas de -2) | – | 148 | 100 % | très dur |
| mois | Ligne graduée, niveau 3 | très dur | réelle | 22 | 19 | 0 % | 3 (1, 10, 19 : pas de +9) | L1×1 | 88 | 76 % | très dur |
| mois | Ligne graduée, niveau 3 | très dur | pressée | 23 | 15 | 0 % | 2 (13, 7 : pas de -6) | L1×1 | 25 | 9 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus facile | appliquée | 40 | 33 | 0 % | 2 (87, 82 : pas de -5) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 4 | plus facile | réelle | 26 | 21 | 0 % | 2 (97, 93 : pas de -4) | L1×1 | 39 | 73 % | plus facile |
| mois | Ligne graduée, niveau 4 | plus facile | pressée | 19 | 14 | 0 % | 2 (44, 43 : pas de -1) | L1×1 L3×1 | 28 | 17 % | plus facile |
| mois | Ligne graduée, niveau 4 | conseillé | appliquée | 40 | 34 | 0 % | 2 (44, 39 : pas de -5) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 4 | conseillé | réelle | 26 | 23 | 0 % | 2 (67, 64 : pas de -3) | L1×1 | 64 | 81 % | conseillé |
| mois | Ligne graduée, niveau 4 | conseillé | pressée | 19 | 14 | 0 % | 2 (29, 26 : pas de -3) | L3×1 L1×1 | 33 | 17 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus dur | appliquée | 40 | 21 | 0 % | 2 (95, 94 : pas de -1) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 4 | plus dur | réelle | 30 | 18 | 0 % | 2 (84, 86 : pas de +2) | L1×1 | 87 | 84 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus dur | pressée | 19 | 12 | 0 % | 2 (37, 46 : pas de +9) | L3×1 L1×1 | 31 | 14 % | conseillé |
| mois | Ligne graduée, niveau 4 | très dur | appliquée | 40 | 32 | 0 % | 2 (29, 25 : pas de -4) | – | 152 | 100 % | très dur |
| mois | Ligne graduée, niveau 4 | très dur | réelle | 24 | 21 | 0 % | 2 (46, 44 : pas de -2) | L1×1 | 77 | 80 % | conseillé |
| mois | Ligne graduée, niveau 4 | très dur | pressée | 18 | 14 | 0 % | 2 (75, 67 : pas de -8) | L3×1 L1×1 | 37 | 19 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus facile | appliquée | 34 | 6 | 0 % | 2 (30, 40 : pas de +10) | L2×1 | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 5 | plus facile | réelle | 24 | 6 | 4 % | 2 (60, 70 : pas de +10) | L2×1 | 40 | 78 % | plus facile |
| mois | Ligne graduée, niveau 5 | plus facile | pressée | 19 | 6 | 0 % | 2 (40, 30 : pas de -10) | L2×1 L1×1 | 24 | 8 % | plus facile |
| mois | Ligne graduée, niveau 5 | conseillé | appliquée | 34 | 8 | 0 % | 2 (70, 60 : pas de -10) | L2×1 | 83 | 100 % | conseillé |
| mois | Ligne graduée, niveau 5 | conseillé | réelle | 19 | 8 | 6 % | 2 (60, 70 : pas de +10) | L2×1 L1×1 | 61 | 73 % | conseillé |
| mois | Ligne graduée, niveau 5 | conseillé | pressée | 24 | 8 | 0 % | 2 (70, 60 : pas de -10) | L2×1 | 26 | 7 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus dur | appliquée | 34 | 9 | 0 % | 3 (60, 70, 80 : pas de +10) | L2×1 | 113 | 100 % | plus dur |
| mois | Ligne graduée, niveau 5 | plus dur | réelle | 26 | 8 | 0 % | 2 (70, 60 : pas de -10) | L2×1 | 63 | 71 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus dur | pressée | 20 | 8 | 0 % | 2 (80, 90 : pas de +10) | L2×1 L1×1 | 30 | 9 % | conseillé |
| mois | Ligne graduée, niveau 5 | très dur | appliquée | 27 | 9 | 0 % | 3 (60, 70, 80 : pas de +10) | L2×1 | 129 | 100 % | très dur |
| mois | Ligne graduée, niveau 5 | très dur | réelle | 23 | 9 | 0 % | 2 (60, 70 : pas de +10) | L2×1 L1×1 | 111 | 82 % | très dur |
| mois | Ligne graduée, niveau 5 | très dur | pressée | 19 | 8 | 6 % | 2 (70, 60 : pas de -10) | L2×1 L1×1 | 30 | 9 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus facile | appliquée | 39 | 30 | 0 % | 3 (33, 27, 21 : pas de -6) | – | 52 | 100 % | plus facile |
| mois | Ligne graduée, niveau 6 | plus facile | réelle | 33 | 27 | 3 % | 2 (81, 77 : pas de -4) | – | 42 | 83 % | plus facile |
| mois | Ligne graduée, niveau 6 | plus facile | pressée | 24 | 15 | 0 % | 2 (27, 34 : pas de +7) | L1×1 | 24 | 14 % | plus facile |
| mois | Ligne graduée, niveau 6 | conseillé | appliquée | 38 | 31 | 0 % | 2 (26, 27 : pas de +1) | – | 84 | 100 % | conseillé |
| mois | Ligne graduée, niveau 6 | conseillé | réelle | 24 | 21 | 0 % | 2 (75, 82 : pas de +7) | L1×1 | 54 | 67 % | conseillé |
| mois | Ligne graduée, niveau 6 | conseillé | pressée | 19 | 15 | 0 % | 2 (73, 82 : pas de +9) | L3×1 L1×1 | 31 | 14 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus dur | appliquée | 40 | 37 | 0 % | 2 (71, 74 : pas de +3) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 6 | plus dur | réelle | 23 | 21 | 0 % | 2 (26, 31 : pas de +5) | L3×1 L1×1 | 79 | 77 % | plus dur |
| mois | Ligne graduée, niveau 6 | plus dur | pressée | 22 | 15 | 0 % | 2 (63, 59 : pas de -4) | L1×1 | 24 | 9 % | conseillé |
| mois | Ligne graduée, niveau 6 | très dur | appliquée | 38 | 30 | 0 % | 2 (70, 79 : pas de +9) | – | 148 | 100 % | très dur |
| mois | Ligne graduée, niveau 6 | très dur | réelle | 23 | 18 | 0 % | 2 (50, 49 : pas de -1) | L1×1 | 104 | 79 % | très dur |
| mois | Ligne graduée, niveau 6 | très dur | pressée | 16 | 12 | 0 % | 2 (48, 46 : pas de -2) | L3×1 L1×1 | 29 | 12 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus facile | appliquée | 40 | 26 | 0 % | 3 (50, 60, 70 : pas de +10) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 7 | plus facile | réelle | 28 | 18 | 0 % | 2 (50, 60 : pas de +10) | – | 38 | 72 % | plus facile |
| mois | Ligne graduée, niveau 7 | plus facile | pressée | 23 | 13 | 0 % | 3 (40, 50, 60 : pas de +10) | L1×1 L2×1 | 28 | 19 % | plus facile |
| mois | Ligne graduée, niveau 7 | conseillé | appliquée | 38 | 29 | 0 % | 2 (50, 56 : pas de +6) | – | 84 | 100 % | conseillé |
| mois | Ligne graduée, niveau 7 | conseillé | réelle | 28 | 21 | 0 % | 2 (60, 70 : pas de +10) | – | 51 | 62 % | conseillé |
| mois | Ligne graduée, niveau 7 | conseillé | pressée | 18 | 9 | 0 % | 2 (90, 86 : pas de -4) | L1×1 L2×1 | 30 | 14 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus dur | appliquée | 40 | 27 | 0 % | 3 (70, 80, 90 : pas de +10) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 7 | plus dur | réelle | 23 | 13 | 0 % | 3 (60, 70, 80 : pas de +10) | L2×1 | 69 | 67 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus dur | pressée | 19 | 13 | 0 % | 2 (50, 60 : pas de +10) | L2×1 L1×1 | 33 | 17 % | conseillé |
| mois | Ligne graduée, niveau 7 | très dur | appliquée | 40 | 27 | 0 % | 2 (50, 46 : pas de -4) | – | 152 | 100 % | très dur |
| mois | Ligne graduée, niveau 7 | très dur | réelle | 23 | 14 | 0 % | 3 (60, 50, 40 : pas de -10) | L2×1 L1×1 | 70 | 74 % | plus dur |
| mois | Ligne graduée, niveau 7 | très dur | pressée | 23 | 13 | 0 % | 2 (40, 50 : pas de +10) | L2×1 | 31 | 16 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus facile | appliquée | 33 | 11 | 0 % | 3 (20, 25, 30 : pas de +5) | – | 49 | 100 % | plus facile |
| mois | Ligne graduée, niveau 8 | plus facile | réelle | 28 | 11 | 0 % | 3 (80, 70, 60 : pas de -10) | – | 38 | 81 % | plus facile |
| mois | Ligne graduée, niveau 8 | plus facile | pressée | 26 | 11 | 0 % | 3 (70, 75, 80 : pas de +5) | – | 18 | 9 % | plus facile |
| mois | Ligne graduée, niveau 8 | conseillé | appliquée | 33 | 11 | 0 % | 3 (60, 70, 80 : pas de +10) | – | 79 | 100 % | conseillé |
| mois | Ligne graduée, niveau 8 | conseillé | réelle | 30 | 11 | 0 % | 2 (80, 75 : pas de -5) | – | 61 | 75 % | conseillé |
| mois | Ligne graduée, niveau 8 | conseillé | pressée | 29 | 11 | 0 % | 2 (30, 25 : pas de -5) | – | 25 | 11 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus dur | appliquée | 33 | 11 | 0 % | 2 (40, 30 : pas de -10) | – | 108 | 100 % | plus dur |
| mois | Ligne graduée, niveau 8 | plus dur | réelle | 29 | 11 | 0 % | 2 (40, 30 : pas de -10) | – | 72 | 73 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus dur | pressée | 30 | 11 | 0 % | 2 (40, 50 : pas de +10) | – | 31 | 16 % | conseillé |
| mois | Ligne graduée, niveau 8 | très dur | appliquée | 33 | 11 | 0 % | 3 (70, 80, 90 : pas de +10) | – | 138 | 100 % | très dur |
| mois | Ligne graduée, niveau 8 | très dur | réelle | 29 | 11 | 0 % | 2 (60, 50 : pas de -10) | – | 107 | 75 % | très dur |
| mois | Ligne graduée, niveau 8 | très dur | pressée | 27 | 11 | 0 % | 3 (70, 75, 80 : pas de +5) | – | 24 | 10 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus facile | appliquée | 34 | 6 | 0 % | aucune | L10×1 | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 9 | plus facile | réelle | 25 | 6 | 0 % | aucune | L10×1 | 39 | 74 % | plus facile |
| mois | Ligne graduée, niveau 9 | plus facile | pressée | 20 | 6 | 0 % | aucune | L10×1 L1×1 | 24 | 9 % | plus facile |
| mois | Ligne graduée, niveau 9 | conseillé | appliquée | 34 | 8 | 0 % | aucune | L10×1 | 83 | 100 % | conseillé |
| mois | Ligne graduée, niveau 9 | conseillé | réelle | 26 | 8 | 0 % | aucune | L10×1 L1×1 | 65 | 84 % | conseillé |
| mois | Ligne graduée, niveau 9 | conseillé | pressée | 25 | 8 | 0 % | aucune | L10×1 | 29 | 14 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus dur | appliquée | 34 | 9 | 0 % | aucune | L10×1 | 113 | 100 % | plus dur |
| mois | Ligne graduée, niveau 9 | plus dur | réelle | 31 | 8 | 0 % | aucune | L10×1 | 72 | 90 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus dur | pressée | 18 | 8 | 0 % | aucune | L10×1 L1×1 | 29 | 13 % | conseillé |
| mois | Ligne graduée, niveau 9 | très dur | appliquée | 27 | 9 | 0 % | aucune | L10×1 | 129 | 100 % | très dur |
| mois | Ligne graduée, niveau 9 | très dur | réelle | 29 | 9 | 0 % | aucune | L10×1 | 97 | 85 % | plus dur |
| mois | Ligne graduée, niveau 9 | très dur | pressée | 20 | 8 | 0 % | aucune | L10×1 L1×1 | 34 | 17 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus facile | appliquée | 40 | 32 | 0 % | 2 (630, 640 : pas de +10) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 10 | plus facile | réelle | 23 | 17 | 0 % | aucune | L1×1 | 39 | 79 % | plus facile |
| mois | Ligne graduée, niveau 10 | plus facile | pressée | 19 | 14 | 0 % | 2 (540, 530 : pas de -10) | L1×1 L10×1 | 25 | 13 % | plus facile |
| mois | Ligne graduée, niveau 10 | conseillé | appliquée | 40 | 32 | 0 % | 2 (440, 450 : pas de +10) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 10 | conseillé | réelle | 32 | 21 | 0 % | aucune | L10×1 | 67 | 81 % | conseillé |
| mois | Ligne graduée, niveau 10 | conseillé | pressée | 19 | 15 | 0 % | aucune | L1×1 L10×1 | 30 | 14 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus dur | appliquée | 40 | 21 | 0 % | 2 (260, 250 : pas de -10) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 10 | plus dur | réelle | 22 | 16 | 0 % | aucune | L3×1 L1×1 | 65 | 67 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus dur | pressée | 23 | 16 | 0 % | 2 (660, 670 : pas de +10) | L1×1 L10×1 | 33 | 15 % | conseillé |
| mois | Ligne graduée, niveau 10 | très dur | appliquée | 40 | 34 | 0 % | 2 (620, 610 : pas de -10) | – | 152 | 100 % | très dur |
| mois | Ligne graduée, niveau 10 | très dur | réelle | 23 | 18 | 0 % | aucune | L1×1 | 51 | 62 % | conseillé |
| mois | Ligne graduée, niveau 10 | très dur | pressée | 19 | 14 | 0 % | aucune | L1×1 L3×1 | 34 | 16 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus facile | appliquée | 40 | 39 | 0 % | 2 (399, 393 : pas de -6) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 11 | plus facile | réelle | 22 | 18 | 0 % | 2 (903, 904 : pas de +1) | L1×1 | 37 | 69 % | plus facile |
| mois | Ligne graduée, niveau 11 | plus facile | pressée | 25 | 18 | 0 % | 2 (899, 901 : pas de +2) | L10×1 | 25 | 16 % | plus facile |
| mois | Ligne graduée, niveau 11 | conseillé | appliquée | 40 | 35 | 0 % | 2 (567, 572 : pas de +5) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 11 | conseillé | réelle | 26 | 25 | 0 % | 2 (893, 903 : pas de +10) | L1×1 | 65 | 87 % | conseillé |
| mois | Ligne graduée, niveau 11 | conseillé | pressée | 20 | 14 | 0 % | 2 (394, 398 : pas de +4) | L10×1 L3×1 | 31 | 13 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus dur | appliquée | 40 | 39 | 0 % | 2 (164, 167 : pas de +3) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 11 | plus dur | réelle | 23 | 20 | 0 % | 2 (523, 528 : pas de +5) | L1×1 | 60 | 73 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus dur | pressée | 17 | 13 | 0 % | 2 (387, 386 : pas de -1) | L1×1 L10×1 | 29 | 12 % | conseillé |
| mois | Ligne graduée, niveau 11 | très dur | appliquée | 40 | 40 | 0 % | 2 (523, 526 : pas de +3) | – | 152 | 100 % | très dur |
| mois | Ligne graduée, niveau 11 | très dur | réelle | 23 | 18 | 0 % | aucune | L1×1 | 102 | 73 % | très dur |
| mois | Ligne graduée, niveau 11 | très dur | pressée | 19 | 14 | 0 % | 2 (793, 791 : pas de -2) | L3×1 L10×1 | 28 | 11 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus facile | appliquée | 40 | 29 | 0 % | aucune | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 12 | plus facile | réelle | 34 | 23 | 0 % | aucune | – | 41 | 85 % | plus facile |
| mois | Ligne graduée, niveau 12 | plus facile | pressée | 26 | 16 | 0 % | aucune | – | 17 | 7 % | plus facile |
| mois | Ligne graduée, niveau 12 | conseillé | appliquée | 40 | 35 | 0 % | 2 (810, 800 : pas de -10) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 12 | conseillé | réelle | 25 | 20 | 0 % | 2 (603, 605 : pas de +2) | L10×1 | 56 | 74 % | conseillé |
| mois | Ligne graduée, niveau 12 | conseillé | pressée | 26 | 16 | 0 % | 2 (907, 911 : pas de +4) | – | 18 | 4 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus dur | appliquée | 40 | 28 | 0 % | 2 (692, 700 : pas de +8) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 12 | plus dur | réelle | 26 | 18 | 0 % | aucune | L10×1 | 67 | 61 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus dur | pressée | 26 | 15 | 0 % | aucune | – | 20 | 7 % | conseillé |
| mois | Ligne graduée, niveau 12 | très dur | appliquée | 38 | 26 | 0 % | 2 (605, 600 : pas de -5) | – | 148 | 100 % | très dur |
| mois | Ligne graduée, niveau 12 | très dur | réelle | 24 | 19 | 0 % | 2 (202, 206 : pas de +4) | L10×1 | 98 | 80 % | plus dur |
| mois | Ligne graduée, niveau 12 | très dur | pressée | 26 | 15 | 0 % | aucune | – | 18 | 4 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus facile | appliquée | 33 | 11 | 0 % | aucune | – | 49 | 100 % | plus facile |
| mois | Ligne graduée, niveau 13 | plus facile | réelle | 31 | 11 | 0 % | aucune | – | 42 | 83 % | plus facile |
| mois | Ligne graduée, niveau 13 | plus facile | pressée | 30 | 11 | 0 % | aucune | – | 21 | 16 % | plus facile |
| mois | Ligne graduée, niveau 13 | conseillé | appliquée | 33 | 11 | 0 % | aucune | – | 79 | 100 % | conseillé |
| mois | Ligne graduée, niveau 13 | conseillé | réelle | 33 | 11 | 0 % | aucune | – | 66 | 85 % | conseillé |
| mois | Ligne graduée, niveau 13 | conseillé | pressée | 27 | 11 | 0 % | aucune | – | 22 | 8 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus dur | appliquée | 33 | 11 | 0 % | aucune | – | 108 | 100 % | plus dur |
| mois | Ligne graduée, niveau 13 | plus dur | réelle | 28 | 11 | 0 % | aucune | – | 70 | 68 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus dur | pressée | 27 | 11 | 0 % | aucune | – | 29 | 16 % | conseillé |
| mois | Ligne graduée, niveau 13 | très dur | appliquée | 33 | 11 | 0 % | aucune | – | 138 | 100 % | très dur |
| mois | Ligne graduée, niveau 13 | très dur | réelle | 31 | 11 | 0 % | aucune | – | 87 | 77 % | conseillé |
| mois | Ligne graduée, niveau 13 | très dur | pressée | 30 | 11 | 0 % | aucune | – | 28 | 12 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | appliquée | 24 | 6 | 9 % | 3 (2, 4, 6 : pas de +2) | – | 45 | 100 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | réelle | 18 | 7 | 6 % | 2 (10, 2 : pas de -8) | – | 35 | 80 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | pressée | 20 | 8 | 5 % | 3 (4, 6, 8 : pas de +2) | – | 17 | 6 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | appliquée | 40 | 9 | 5 % | 3 (4, 6, 8 : pas de +2) | – | 86 | 100 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | réelle | 31 | 10 | 0 % | 3 (2, 5, 8 : pas de +3) | – | 64 | 82 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | pressée | 29 | 10 | 7 % | 3 (5, 6, 7 : pas de +1) | – | 23 | 8 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | appliquée | 40 | 9 | 5 % | 3 (2, 4, 6 : pas de +2) | – | 119 | 100 % | plus dur |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | réelle | 31 | 10 | 3 % | 2 (5, 10 : pas de +5) | – | 69 | 77 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | pressée | 27 | 8 | 8 % | 2 (10, 2 : pas de -8) | – | 19 | 4 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | appliquée | 40 | 9 | 15 % | 3 (10, 9, 8 : pas de -1) | – | 152 | 100 % | très dur |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | réelle | 34 | 9 | 0 % | 3 (3, 2, 1 : pas de -1) | – | 131 | 90 % | très dur |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | pressée | 26 | 9 | 8 % | 3 (4, 5, 6 : pas de +1) | – | 17 | 3 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | appliquée | 19 | 8 | 0 % | 3 (2, 6, 10 : pas de +4) | L4×1 | 45 | 100 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | réelle | 16 | 6 | 0 % | 3 (8, 6, 4 : pas de -2) | L4×1 | 33 | 66 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | pressée | 16 | 6 | 0 % | 3 (8, 6, 4 : pas de -2) | L4×1 | 19 | 3 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | appliquée | 33 | 10 | 9 % | 3 (2, 3, 4 : pas de +1) | L4×1 | 82 | 100 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | réelle | 25 | 10 | 0 % | 2 (2, 4 : pas de +2) | L4×1 | 61 | 78 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | pressée | 22 | 8 | 5 % | 2 (2, 4 : pas de +2) | L4×1 | 22 | 5 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | appliquée | 33 | 10 | 6 % | 3 (2, 3, 4 : pas de +1) | L4×1 | 111 | 100 % | plus dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | réelle | 27 | 9 | 4 % | 2 (2, 8 : pas de +6) | L4×1 | 88 | 86 % | plus dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | pressée | 21 | 7 | 5 % | 3 (2, 3, 4 : pas de +1) | L4×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | appliquée | 33 | 9 | 6 % | 3 (8, 5, 2 : pas de -3) | L4×1 | 141 | 100 % | très dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | réelle | 22 | 8 | 5 % | 2 (2, 4 : pas de +2) | L4×1 | 86 | 74 % | plus dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | pressée | 23 | 8 | 0 % | 3 (5, 4, 3 : pas de -1) | L4×1 | 22 | 6 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus facile | appliquée | 24 | 9 | 13 % | 2 (3, 8 : pas de +5) | – | 45 | 100 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | réelle | 22 | 8 | 5 % | 3 (7, 4, 1 : pas de -3) | – | 37 | 83 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | pressée | 16 | 9 | 7 % | 3 (9, 5, 1 : pas de -4) | L5×1 | 21 | 10 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | conseillé | appliquée | 40 | 9 | 15 % | 3 (7, 4, 1 : pas de -3) | – | 86 | 100 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | réelle | 23 | 9 | 5 % | 3 (1, 5, 9 : pas de +4) | L5×1 | 52 | 68 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | pressée | 22 | 8 | 10 % | 2 (8, 7 : pas de -1) | L5×1 | 25 | 9 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | appliquée | 40 | 9 | 10 % | 3 (7, 4, 1 : pas de -3) | – | 119 | 100 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | plus dur | réelle | 22 | 8 | 14 % | 3 (3, 2, 1 : pas de -1) | L5×1 | 73 | 75 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | pressée | 22 | 9 | 10 % | 3 (5, 3, 1 : pas de -2) | L5×1 | 24 | 8 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | très dur | appliquée | 40 | 9 | 18 % | 3 (7, 4, 1 : pas de -3) | – | 152 | 100 % | très dur |
| mois | Additions, famille 3 (amis de 10) | très dur | réelle | 34 | 9 | 15 % | 3 (3, 6, 9 : pas de +3) | – | 110 | 73 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | très dur | pressée | 21 | 8 | 5 % | 3 (5, 3, 1 : pas de -2) | L5×1 | 25 | 9 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | appliquée | 19 | 7 | 6 % | 2 (6, 4 : pas de -2) | L6×1 | 45 | 100 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | réelle | 16 | 6 | 0 % | 2 (6, 4 : pas de -2) | L6×1 | 35 | 76 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | pressée | 16 | 6 | 0 % | 2 (6, 4 : pas de -2) | L6×1 | 21 | 8 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | appliquée | 33 | 9 | 0 % | 2 (6, 4 : pas de -2) | L6×1 | 82 | 100 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | réelle | 25 | 7 | 4 % | 3 (2, 4, 6 : pas de +2) | L6×1 | 61 | 80 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | pressée | 22 | 8 | 0 % | 2 (6, 4 : pas de -2) | L6×1 | 21 | 5 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | appliquée | 33 | 9 | 3 % | 3 (1, 4, 7 : pas de +3) | L6×1 | 111 | 100 % | plus dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | réelle | 23 | 8 | 5 % | 2 (6, 4 : pas de -2) | L6×1 | 61 | 69 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | pressée | 21 | 8 | 0 % | 2 (6, 4 : pas de -2) | L6×1 | 19 | 2 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | appliquée | 33 | 8 | 9 % | 3 (4, 3, 2 : pas de -1) | L6×1 | 141 | 100 % | très dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | réelle | 27 | 6 | 19 % | 3 (2, 3, 4 : pas de +1) | L6×1 | 108 | 79 % | très dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | pressée | 22 | 7 | 0 % | 2 (6, 4 : pas de -2) | L6×1 | 28 | 12 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | appliquée | 19 | 6 | 0 % | 2 (9, 3 : pas de -6) | L6×1 | 45 | 100 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | réelle | 17 | 7 | 13 % | 3 (2, 5, 8 : pas de +3) | L6×1 | 35 | 74 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | pressée | 16 | 6 | 7 % | 2 (8, 6 : pas de -2) | L6×1 | 19 | 3 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | appliquée | 33 | 10 | 3 % | 3 (2, 3, 4 : pas de +1) | L6×1 | 82 | 100 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | réelle | 25 | 9 | 4 % | 2 (8, 3 : pas de -5) | L6×1 | 61 | 78 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | pressée | 21 | 8 | 5 % | 3 (9, 5, 1 : pas de -4) | L6×1 | 21 | 5 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | appliquée | 33 | 9 | 3 % | 3 (5, 4, 3 : pas de -1) | L6×1 | 111 | 100 % | plus dur |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | réelle | 23 | 9 | 5 % | 2 (2, 3 : pas de +1) | L6×1 | 64 | 69 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | pressée | 22 | 8 | 5 % | 2 (8, 3 : pas de -5) | L6×1 | 22 | 5 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | appliquée | 33 | 8 | 3 % | 3 (3, 5, 7 : pas de +2) | L6×1 | 141 | 100 % | très dur |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | réelle | 20 | 8 | 5 % | 2 (8, 4 : pas de -4) | L6×1 | 60 | 60 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | pressée | 21 | 8 | 5 % | 2 (8, 4 : pas de -4) | L6×1 | 23 | 5 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus facile | appliquée | 19 | 7 | 6 % | 3 (3, 4, 5 : pas de +1) | L4×1 | 45 | 100 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | plus facile | réelle | 14 | 5 | 8 % | 3 (3, 4, 5 : pas de +1) | L4×1 | 34 | 74 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | plus facile | pressée | 16 | 6 | 0 % | 2 (7, 9 : pas de +2) | L4×1 | 19 | 5 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | conseillé | appliquée | 33 | 9 | 3 % | 3 (7, 5, 3 : pas de -2) | L4×1 | 82 | 100 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | conseillé | réelle | 20 | 7 | 5 % | 3 (4, 3, 2 : pas de -1) | L4×1 | 53 | 63 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | conseillé | pressée | 21 | 7 | 0 % | 3 (7, 4, 1 : pas de -3) | L4×1 | 27 | 10 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus dur | appliquée | 33 | 9 | 0 % | 3 (5, 4, 3 : pas de -1) | L4×1 | 111 | 100 % | plus dur |
| mois | Additions, famille 6 (presque-doubles) | plus dur | réelle | 24 | 7 | 13 % | 2 (7, 9 : pas de +2) | L4×1 | 77 | 78 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus dur | pressée | 23 | 8 | 9 % | 3 (5, 4, 3 : pas de -1) | L4×1 | 23 | 5 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | très dur | appliquée | 33 | 7 | 16 % | 3 (7, 4, 1 : pas de -3) | L4×1 | 141 | 100 % | très dur |
| mois | Additions, famille 6 (presque-doubles) | très dur | réelle | 27 | 8 | 12 % | 3 (7, 5, 3 : pas de -2) | L4×1 | 88 | 79 % | plus dur |
| mois | Additions, famille 6 (presque-doubles) | très dur | pressée | 21 | 8 | 0 % | 3 (3, 2, 1 : pas de -1) | L4×1 | 24 | 6 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus facile | appliquée | 24 | 6 | 13 % | 3 (10, 9, 8 : pas de -1) | – | 45 | 100 % | plus facile |
| mois | Additions, famille 7 (mélange) | plus facile | réelle | 20 | 6 | 16 % | 2 (10, 4 : pas de -6) | – | 36 | 83 % | plus facile |
| mois | Additions, famille 7 (mélange) | plus facile | pressée | 20 | 8 | 5 % | 2 (10, 2 : pas de -8) | – | 19 | 11 % | plus facile |
| mois | Additions, famille 7 (mélange) | conseillé | appliquée | 40 | 9 | 8 % | 3 (10, 9, 8 : pas de -1) | – | 86 | 100 % | conseillé |
| mois | Additions, famille 7 (mélange) | conseillé | réelle | 30 | 9 | 14 % | 3 (1, 2, 3 : pas de +1) | – | 61 | 73 % | conseillé |
| mois | Additions, famille 7 (mélange) | conseillé | pressée | 27 | 9 | 8 % | 3 (1, 2, 3 : pas de +1) | – | 23 | 10 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus dur | appliquée | 40 | 9 | 10 % | 3 (10, 9, 8 : pas de -1) | – | 119 | 100 % | plus dur |
| mois | Additions, famille 7 (mélange) | plus dur | réelle | 32 | 9 | 10 % | 3 (7, 4, 1 : pas de -3) | – | 59 | 75 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus dur | pressée | 26 | 8 | 12 % | 3 (6, 7, 8 : pas de +1) | – | 18 | 4 % | conseillé |
| mois | Additions, famille 7 (mélange) | très dur | appliquée | 40 | 9 | 10 % | 3 (4, 3, 2 : pas de -1) | – | 152 | 100 % | très dur |
| mois | Additions, famille 7 (mélange) | très dur | réelle | 29 | 9 | 7 % | 3 (3, 2, 1 : pas de -1) | – | 82 | 69 % | conseillé |
| mois | Additions, famille 7 (mélange) | très dur | pressée | 27 | 9 | 12 % | 3 (6, 4, 2 : pas de -2) | – | 21 | 7 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | appliquée | 29 | 26 | 0 % | 3 (24, 32, 40 : pas de +8) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | réelle | 20 | 13 | 0 % | 2 (70, 76 : pas de +6) | – | 33 | 69 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | pressée | 19 | 11 | 0 % | 2 (69, 60 : pas de -9) | – | 15 | 2 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | appliquée | 43 | 37 | 0 % | 2 (86, 95 : pas de +9) | – | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | réelle | 29 | 22 | 0 % | 2 (21, 26 : pas de +5) | – | 60 | 77 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | pressée | 22 | 13 | 0 % | 2 (64, 60 : pas de -4) | – | 19 | 6 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | appliquée | 43 | 34 | 0 % | 2 (35, 37 : pas de +2) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | réelle | 29 | 19 | 7 % | 2 (74, 72 : pas de -2) | – | 61 | 74 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | pressée | 22 | 13 | 0 % | 2 (16, 20 : pas de +4) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | appliquée | 43 | 36 | 0 % | 2 (100, 90 : pas de -10) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | réelle | 28 | 21 | 0 % | 2 (25, 33 : pas de +8) | – | 76 | 74 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | pressée | 23 | 14 | 0 % | 2 (61, 53 : pas de -8) | – | 23 | 7 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | appliquée | 29 | 26 | 0 % | 2 (66, 64 : pas de -2) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | réelle | 18 | 12 | 0 % | 2 (79, 84 : pas de +5) | L7×1 | 35 | 71 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | pressée | 19 | 11 | 0 % | 2 (54, 44 : pas de -10) | – | 15 | 2 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | appliquée | 43 | 35 | 2 % | 2 (25, 16 : pas de -9) | – | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | réelle | 23 | 18 | 0 % | 2 (39, 46 : pas de +7) | L7×1 | 61 | 77 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | pressée | 22 | 13 | 0 % | 2 (40, 47 : pas de +7) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | appliquée | 43 | 36 | 0 % | 2 (48, 44 : pas de -4) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | réelle | 23 | 18 | 0 % | 2 (22, 31 : pas de +9) | L7×1 | 59 | 69 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | pressée | 22 | 13 | 0 % | 2 (42, 39 : pas de -3) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | appliquée | 43 | 37 | 0 % | 2 (71, 77 : pas de +6) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | réelle | 22 | 17 | 0 % | 2 (21, 29 : pas de +8) | L7×1 | 71 | 67 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | pressée | 22 | 13 | 0 % | 3 (42, 36, 30 : pas de -6) | – | 19 | 5 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | appliquée | 29 | 24 | 0 % | 2 (86, 78 : pas de -8) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | réelle | 22 | 16 | 0 % | 2 (76, 83 : pas de +7) | – | 34 | 68 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | pressée | 19 | 10 | 0 % | 2 (87, 94 : pas de +7) | – | 18 | 8 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | appliquée | 41 | 34 | 0 % | 2 (35, 40 : pas de +5) | – | 87 | 100 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | réelle | 29 | 21 | 0 % | 2 (44, 52 : pas de +8) | – | 65 | 80 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | pressée | 22 | 13 | 0 % | 2 (72, 67 : pas de -5) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | appliquée | 43 | 30 | 2 % | 3 (83, 74, 65 : pas de -9) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | réelle | 31 | 23 | 3 % | 2 (94, 92 : pas de -2) | – | 61 | 73 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | pressée | 22 | 11 | 10 % | 2 (66, 60 : pas de -6) | – | 19 | 6 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | appliquée | 42 | 32 | 0 % | 2 (86, 79 : pas de -7) | – | 156 | 100 % | très dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | réelle | 20 | 14 | 0 % | 2 (14, 7 : pas de -7) | L7×1 | 73 | 80 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | pressée | 23 | 13 | 0 % | 2 (16, 23 : pas de +7) | – | 21 | 6 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | appliquée | 29 | 23 | 4 % | 2 (38, 28 : pas de -10) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | réelle | 20 | 14 | 5 % | 2 (77, 83 : pas de +6) | – | 30 | 62 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | pressée | 19 | 10 | 0 % | 2 (18, 28 : pas de +10) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | appliquée | 43 | 30 | 2 % | 2 (94, 87 : pas de -7) | – | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | réelle | 25 | 15 | 0 % | 2 (47, 38 : pas de -9) | – | 58 | 72 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | pressée | 22 | 12 | 0 % | 2 (27, 24 : pas de -3) | – | 19 | 6 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | appliquée | 42 | 30 | 2 % | 2 (89, 97 : pas de +8) | – | 122 | 100 % | plus dur |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | réelle | 30 | 23 | 0 % | 2 (47, 38 : pas de -9) | – | 74 | 75 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | pressée | 22 | 13 | 0 % | 2 (76, 84 : pas de +8) | – | 15 | 0 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | appliquée | 43 | 6 | 14 % | 3 (2, 3, 4 : pas de +1) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | réelle | 32 | 20 | 3 % | 2 (87, 93 : pas de +6) | – | 76 | 66 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | pressée | 22 | 13 | 0 % | 2 (36, 39 : pas de +3) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | appliquée | 30 | 25 | 0 % | 2 (73, 71 : pas de -2) | – | 48 | 100 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | réelle | 26 | 22 | 0 % | 2 (41, 46 : pas de +5) | – | 38 | 84 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | pressée | 21 | 13 | 0 % | 2 (33, 43 : pas de +10) | – | 18 | 8 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | appliquée | 42 | 31 | 2 % | 2 (86, 82 : pas de -4) | – | 88 | 100 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | réelle | 29 | 20 | 0 % | 2 (20, 22 : pas de +2) | – | 64 | 82 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | pressée | 23 | 13 | 0 % | 2 (51, 41 : pas de -10) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | appliquée | 43 | 32 | 0 % | 2 (83, 81 : pas de -2) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | réelle | 28 | 21 | 4 % | 2 (71, 70 : pas de -1) | – | 73 | 81 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | pressée | 22 | 15 | 0 % | 2 (92, 94 : pas de +2) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | appliquée | 43 | 6 | 14 % | 3 (3, 5, 7 : pas de +2) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | réelle | 34 | 26 | 0 % | 2 (20, 12 : pas de -8) | – | 94 | 83 % | plus dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | pressée | 22 | 14 | 0 % | 3 (13, 12, 11 : pas de -1) | – | 22 | 6 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | appliquée | 23 | 20 | 0 % | 2 (65, 75 : pas de +10) | L8×1 | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | réelle | 17 | 13 | 0 % | 2 (73, 65 : pas de -8) | L8×1 | 35 | 72 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | pressée | 16 | 11 | 0 % | 2 (41, 51 : pas de +10) | L8×1 | 19 | 5 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | appliquée | 33 | 26 | 0 % | 2 (38, 30 : pas de -8) | L8×1 | 82 | 100 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | réelle | 22 | 19 | 0 % | 2 (46, 54 : pas de +8) | L8×1 | 52 | 68 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | pressée | 18 | 12 | 0 % | 2 (92, 93 : pas de +1) | L8×1 | 26 | 11 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | appliquée | 33 | 27 | 0 % | 2 (73, 65 : pas de -8) | L8×1 | 111 | 100 % | plus dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | réelle | 21 | 17 | 0 % | 2 (58, 67 : pas de +9) | L8×1 | 64 | 76 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | pressée | 18 | 12 | 0 % | 2 (36, 38 : pas de +2) | L8×1 | 21 | 5 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | appliquée | 33 | 28 | 0 % | 2 (56, 63 : pas de +7) | L8×1 | 141 | 100 % | très dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | réelle | 24 | 19 | 0 % | 2 (61, 71 : pas de +10) | L8×1 | 87 | 78 % | plus dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | pressée | 18 | 12 | 0 % | 2 (33, 36 : pas de +3) | L8×1 | 19 | 2 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | appliquée | 23 | 20 | 0 % | 2 (27, 33 : pas de +6) | L9×1 | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | réelle | 16 | 13 | 0 % | 2 (86, 87 : pas de +1) | L9×1 | 32 | 62 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | pressée | 16 | 10 | 0 % | aucune | L9×1 | 19 | 3 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | appliquée | 33 | 27 | 3 % | 2 (85, 93 : pas de +8) | L9×1 | 82 | 100 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | réelle | 22 | 14 | 10 % | 2 (55, 65 : pas de +10) | L9×1 | 60 | 83 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | pressée | 18 | 12 | 0 % | 2 (63, 61 : pas de -2) | L9×1 | 20 | 3 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | appliquée | 33 | 27 | 3 % | 3 (33, 43, 53 : pas de +10) | L9×1 | 111 | 100 % | plus dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | réelle | 20 | 15 | 0 % | 2 (45, 52 : pas de +7) | L9×1 | 60 | 74 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | pressée | 18 | 12 | 0 % | 2 (53, 51 : pas de -2) | L9×1 | 21 | 5 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | appliquée | 34 | 6 | 15 % | 3 (8, 6, 4 : pas de -2) | L9×1 | 143 | 100 % | très dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | réelle | 19 | 13 | 0 % | 2 (71, 64 : pas de -7) | L9×1 | 68 | 73 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | pressée | 18 | 12 | 0 % | 2 (92, 94 : pas de +2) | L9×1 | 19 | 2 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | appliquée | 29 | 24 | 0 % | 2 (67, 69 : pas de +2) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | réelle | 19 | 14 | 0 % | 2 (66, 69 : pas de +3) | L7×1 | 38 | 76 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | pressée | 19 | 13 | 0 % | 2 (85, 87 : pas de +2) | – | 19 | 13 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | appliquée | 41 | 29 | 3 % | 2 (59, 58 : pas de -1) | – | 87 | 100 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | réelle | 28 | 18 | 0 % | 2 (86, 87 : pas de +1) | – | 63 | 83 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | pressée | 22 | 14 | 5 % | 2 (97, 88 : pas de -9) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | appliquée | 41 | 24 | 5 % | 2 (77, 77 : même réponse) | – | 120 | 100 % | plus dur |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | réelle | 28 | 19 | 4 % | 2 (99, 89 : pas de -10) | – | 64 | 76 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | pressée | 22 | 12 | 10 % | 2 (55, 59 : pas de +4) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | appliquée | 43 | 27 | 0 % | 3 (22, 23, 24 : pas de +1) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | réelle | 26 | 18 | 8 % | 2 (21, 23 : pas de +2) | – | 79 | 67 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | pressée | 22 | 13 | 5 % | 2 (46, 38 : pas de -8) | – | 21 | 7 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | appliquée | 29 | 22 | 0 % | 2 (68, 75 : pas de +7) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | réelle | 20 | 15 | 5 % | 2 (78, 68 : pas de -10) | – | 33 | 80 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | pressée | 19 | 12 | 6 % | 2 (36, 29 : pas de -7) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | appliquée | 41 | 31 | 0 % | 2 (56, 55 : pas de -1) | – | 87 | 100 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | réelle | 26 | 19 | 0 % | 2 (79, 78 : pas de -1) | – | 59 | 73 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | pressée | 22 | 14 | 0 % | 2 (75, 74 : pas de -1) | – | 21 | 9 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | appliquée | 40 | 27 | 0 % | 2 (38, 28 : pas de -10) | – | 119 | 100 % | plus dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | réelle | 29 | 18 | 4 % | 2 (57, 66 : pas de +9) | – | 81 | 74 % | plus dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | pressée | 22 | 13 | 5 % | 2 (38, 45 : pas de +7) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | appliquée | 41 | 26 | 0 % | 2 (79, 88 : pas de +9) | – | 154 | 100 % | très dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | réelle | 27 | 20 | 0 % | 2 (84, 79 : pas de -5) | – | 62 | 64 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | pressée | 22 | 13 | 0 % | 2 (46, 44 : pas de -2) | – | 26 | 9 % | conseillé |
