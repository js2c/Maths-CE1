# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Ligne graduée, niveau 1 | plus facile | 33 | 27 | 23 | 70 % |
| Ligne graduée, niveau 1 | conseillé | 56 | 45 | 21 | 38 % |
| Ligne graduée, niveau 1 | plus dur | 77 | 50 | 24 | 31 % |
| Ligne graduée, niveau 1 | très dur | 99 | 88 | 28 | 28 % |
| Ligne graduée, niveau 2 | plus facile | 32 | 29 | 19 | 59 % |
| Ligne graduée, niveau 2 | conseillé | 59 | 48 | 25 | 42 % |
| Ligne graduée, niveau 2 | plus dur | 83 | 60 | 23 | 28 % |
| Ligne graduée, niveau 2 | très dur | 108 | 81 | 27 | 25 % |
| Ligne graduée, niveau 3 | plus facile | 32 | 26 | 16 | 50 % |
| Ligne graduée, niveau 3 | conseillé | 59 | 44 | 17 | 29 % |
| Ligne graduée, niveau 3 | plus dur | 83 | 51 | 18 | 22 % |
| Ligne graduée, niveau 3 | très dur | 106 | 58 | 19 | 18 % |
| Ligne graduée, niveau 4 | plus facile | 33 | 29 | 17 | 52 % |
| Ligne graduée, niveau 4 | conseillé | 56 | 48 | 28 | 50 % |
| Ligne graduée, niveau 4 | plus dur | 77 | 50 | 22 | 29 % |
| Ligne graduée, niveau 4 | très dur | 99 | 70 | 21 | 21 % |
| Ligne graduée, niveau 5 | plus facile | 33 | 33 | 22 | 67 % |
| Ligne graduée, niveau 5 | conseillé | 56 | 46 | 21 | 38 % |
| Ligne graduée, niveau 5 | plus dur | 77 | 42 | 24 | 31 % |
| Ligne graduée, niveau 5 | très dur | 99 | 61 | 23 | 23 % |
| Ligne graduée, niveau 6 | plus facile | 32 | 29 | 19 | 59 % |
| Ligne graduée, niveau 6 | conseillé | 59 | 39 | 21 | 36 % |
| Ligne graduée, niveau 6 | plus dur | 83 | 43 | 31 | 37 % |
| Ligne graduée, niveau 6 | très dur | 104 | 85 | 21 | 20 % |
| Ligne graduée, niveau 7 | plus facile | 33 | 30 | 20 | 61 % |
| Ligne graduée, niveau 7 | conseillé | 57 | 47 | 30 | 53 % |
| Ligne graduée, niveau 7 | plus dur | 83 | 57 | 31 | 37 % |
| Ligne graduée, niveau 7 | très dur | 108 | 49 | 25 | 23 % |
| Ligne graduée, niveau 8 | plus facile | 33 | 30 | 18 | 55 % |
| Ligne graduée, niveau 8 | conseillé | 59 | 47 | 23 | 39 % |
| Ligne graduée, niveau 8 | plus dur | 83 | 54 | 19 | 23 % |
| Ligne graduée, niveau 8 | très dur | 108 | 83 | 20 | 19 % |
| Ligne graduée, niveau 9 | plus facile | 33 | 32 | 20 | 61 % |
| Ligne graduée, niveau 9 | conseillé | 56 | 44 | 26 | 46 % |
| Ligne graduée, niveau 9 | plus dur | 77 | 47 | 24 | 31 % |
| Ligne graduée, niveau 9 | très dur | 99 | 78 | 23 | 23 % |
| Ligne graduée, niveau 10 | plus facile | 32 | 26 | 21 | 66 % |
| Ligne graduée, niveau 10 | conseillé | 57 | 42 | 21 | 37 % |
| Ligne graduée, niveau 10 | plus dur | 83 | 55 | 25 | 30 % |
| Ligne graduée, niveau 10 | très dur | 108 | 55 | 20 | 19 % |
| Ligne graduée, niveau 11 | plus facile | 33 | 27 | 20 | 61 % |
| Ligne graduée, niveau 11 | conseillé | 59 | 48 | 26 | 44 % |
| Ligne graduée, niveau 11 | plus dur | 83 | 62 | 23 | 28 % |
| Ligne graduée, niveau 11 | très dur | 108 | 87 | 21 | 19 % |
| Ligne graduée, niveau 12 | plus facile | 33 | 31 | 11 | 33 % |
| Ligne graduée, niveau 12 | conseillé | 58 | 42 | 14 | 24 % |
| Ligne graduée, niveau 12 | plus dur | 83 | 65 | 14 | 17 % |
| Ligne graduée, niveau 12 | très dur | 108 | 90 | 12 | 11 % |
| Ligne graduée, niveau 13 | plus facile | 33 | 26 | 13 | 39 % |
| Ligne graduée, niveau 13 | conseillé | 59 | 42 | 13 | 22 % |
| Ligne graduée, niveau 13 | plus dur | 83 | 49 | 19 | 23 % |
| Ligne graduée, niveau 13 | très dur | 104 | 62 | 17 | 16 % |
| Additions, famille 1 (+ 1 et + 2) | plus facile | 25 | 20 | 11 | 44 % |
| Additions, famille 1 (+ 1 et + 2) | conseillé | 59 | 51 | 14 | 24 % |
| Additions, famille 1 (+ 1 et + 2) | plus dur | 83 | 73 | 15 | 18 % |
| Additions, famille 1 (+ 1 et + 2) | très dur | 108 | 76 | 17 | 16 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus facile | 25 | 23 | 13 | 52 % |
| Additions, famille 2 (doubles jusqu'à 5) | conseillé | 55 | 43 | 16 | 29 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus dur | 76 | 57 | 15 | 20 % |
| Additions, famille 2 (doubles jusqu'à 5) | très dur | 97 | 58 | 18 | 19 % |
| Additions, famille 3 (amis de 10) | plus facile | 25 | 23 | 15 | 60 % |
| Additions, famille 3 (amis de 10) | conseillé | 52 | 51 | 20 | 38 % |
| Additions, famille 3 (amis de 10) | plus dur | 71 | 61 | 19 | 27 % |
| Additions, famille 3 (amis de 10) | très dur | 91 | 53 | 19 | 21 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | 25 | 23 | 15 | 60 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | 55 | 40 | 18 | 33 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | 76 | 59 | 18 | 24 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | très dur | 97 | 51 | 22 | 23 % |
| Additions, famille 5 (maisons de 8 et 9) | plus facile | 25 | 24 | 15 | 60 % |
| Additions, famille 5 (maisons de 8 et 9) | conseillé | 52 | 47 | 17 | 33 % |
| Additions, famille 5 (maisons de 8 et 9) | plus dur | 71 | 65 | 17 | 24 % |
| Additions, famille 5 (maisons de 8 et 9) | très dur | 91 | 75 | 16 | 18 % |
| Additions, famille 6 (presque-doubles) | plus facile | 25 | 23 | 15 | 60 % |
| Additions, famille 6 (presque-doubles) | conseillé | 55 | 50 | 15 | 27 % |
| Additions, famille 6 (presque-doubles) | plus dur | 76 | 51 | 14 | 18 % |
| Additions, famille 6 (presque-doubles) | très dur | 97 | 68 | 19 | 20 % |
| Additions, famille 7 (mélange) | plus facile | 25 | 22 | 11 | 44 % |
| Additions, famille 7 (mélange) | conseillé | 59 | 48 | 12 | 20 % |
| Additions, famille 7 (mélange) | plus dur | 83 | 64 | 14 | 17 % |
| Additions, famille 7 (mélange) | très dur | 108 | 83 | 14 | 13 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus facile | 28 | 24 | 11 | 39 % |
| Calcul rapide, niveau 1 (petit, ligne) | conseillé | 62 | 51 | 10 | 16 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus dur | 88 | 60 | 11 | 13 % |
| Calcul rapide, niveau 1 (petit, ligne) | très dur | 110 | 59 | 10 | 9 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus facile | 28 | 24 | 13 | 46 % |
| Calcul rapide, niveau 2 (dizaine, mur) | conseillé | 56 | 42 | 15 | 27 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus dur | 77 | 53 | 13 | 17 % |
| Calcul rapide, niveau 2 (dizaine, mur) | très dur | 99 | 61 | 15 | 15 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus facile | 26 | 25 | 10 | 38 % |
| Calcul rapide, niveau 3 (dizaines, mur) | conseillé | 57 | 48 | 10 | 18 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus dur | 76 | 46 | 10 | 13 % |
| Calcul rapide, niveau 3 (dizaines, mur) | très dur | 114 | 41 | 10 | 9 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | 28 | 22 | 11 | 39 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | 62 | 42 | 12 | 19 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | 88 | 67 | 13 | 15 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | 114 | 100 | 10 | 9 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | 28 | 22 | 12 | 43 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | 62 | 49 | 14 | 23 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | 88 | 54 | 12 | 14 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | 114 | 83 | 11 | 10 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus facile | 27 | 24 | 13 | 48 % |
| Calcul rapide, niveau 6 (plus9, mur) | conseillé | 55 | 40 | 13 | 24 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus dur | 76 | 40 | 14 | 18 % |
| Calcul rapide, niveau 6 (plus9, mur) | très dur | 99 | 69 | 14 | 14 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | 27 | 24 | 13 | 48 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | 55 | 41 | 13 | 24 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | 76 | 47 | 13 | 17 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | 99 | 71 | 13 | 13 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | 27 | 23 | 10 | 37 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | 60 | 49 | 12 | 20 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | 83 | 47 | 13 | 16 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | 114 | 59 | 10 | 9 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 27 | 27 | 11 | 41 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 60 | 46 | 10 | 17 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 85 | 57 | 10 | 12 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 110 | 88 | 12 | 11 % |

### Un mois

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Ligne graduée, niveau 1 | plus facile | 54 | 39 | 30 | 56 % |
| Ligne graduée, niveau 1 | conseillé | 88 | 58 | 27 | 31 % |
| Ligne graduée, niveau 1 | plus dur | 122 | 76 | 39 | 32 % |
| Ligne graduée, niveau 1 | très dur | 152 | 81 | 33 | 22 % |
| Ligne graduée, niveau 2 | plus facile | 54 | 40 | 24 | 44 % |
| Ligne graduée, niveau 2 | conseillé | 86 | 55 | 25 | 29 % |
| Ligne graduée, niveau 2 | plus dur | 122 | 60 | 29 | 24 % |
| Ligne graduée, niveau 2 | très dur | 156 | 108 | 34 | 22 % |
| Ligne graduée, niveau 3 | plus facile | 54 | 40 | 24 | 44 % |
| Ligne graduée, niveau 3 | conseillé | 86 | 53 | 24 | 28 % |
| Ligne graduée, niveau 3 | plus dur | 119 | 81 | 28 | 24 % |
| Ligne graduée, niveau 3 | très dur | 156 | 97 | 27 | 17 % |
| Ligne graduée, niveau 4 | plus facile | 54 | 42 | 23 | 43 % |
| Ligne graduée, niveau 4 | conseillé | 88 | 58 | 29 | 33 % |
| Ligne graduée, niveau 4 | plus dur | 122 | 67 | 30 | 25 % |
| Ligne graduée, niveau 4 | très dur | 156 | 80 | 28 | 18 % |
| Ligne graduée, niveau 5 | plus facile | 54 | 39 | 24 | 44 % |
| Ligne graduée, niveau 5 | conseillé | 85 | 61 | 28 | 33 % |
| Ligne graduée, niveau 5 | plus dur | 116 | 70 | 30 | 26 % |
| Ligne graduée, niveau 5 | très dur | 147 | 120 | 33 | 22 % |
| Ligne graduée, niveau 6 | plus facile | 54 | 40 | 25 | 46 % |
| Ligne graduée, niveau 6 | conseillé | 88 | 60 | 29 | 33 % |
| Ligne graduée, niveau 6 | plus dur | 120 | 64 | 27 | 23 % |
| Ligne graduée, niveau 6 | très dur | 156 | 81 | 24 | 15 % |
| Ligne graduée, niveau 7 | plus facile | 54 | 40 | 29 | 54 % |
| Ligne graduée, niveau 7 | conseillé | 88 | 57 | 30 | 34 % |
| Ligne graduée, niveau 7 | plus dur | 122 | 90 | 30 | 25 % |
| Ligne graduée, niveau 7 | très dur | 156 | 89 | 30 | 19 % |
| Ligne graduée, niveau 8 | plus facile | 54 | 37 | 20 | 37 % |
| Ligne graduée, niveau 8 | conseillé | 88 | 58 | 25 | 28 % |
| Ligne graduée, niveau 8 | plus dur | 122 | 72 | 24 | 20 % |
| Ligne graduée, niveau 8 | très dur | 156 | 108 | 23 | 15 % |
| Ligne graduée, niveau 9 | plus facile | 54 | 40 | 26 | 48 % |
| Ligne graduée, niveau 9 | conseillé | 85 | 62 | 26 | 31 % |
| Ligne graduée, niveau 9 | plus dur | 116 | 70 | 27 | 23 % |
| Ligne graduée, niveau 9 | très dur | 147 | 65 | 27 | 18 % |
| Ligne graduée, niveau 10 | plus facile | 54 | 38 | 23 | 43 % |
| Ligne graduée, niveau 10 | conseillé | 88 | 65 | 30 | 34 % |
| Ligne graduée, niveau 10 | plus dur | 122 | 87 | 34 | 28 % |
| Ligne graduée, niveau 10 | très dur | 156 | 59 | 33 | 21 % |
| Ligne graduée, niveau 11 | plus facile | 54 | 40 | 26 | 48 % |
| Ligne graduée, niveau 11 | conseillé | 88 | 51 | 29 | 33 % |
| Ligne graduée, niveau 11 | plus dur | 122 | 78 | 29 | 24 % |
| Ligne graduée, niveau 11 | très dur | 156 | 69 | 33 | 21 % |
| Ligne graduée, niveau 12 | plus facile | 54 | 36 | 17 | 31 % |
| Ligne graduée, niveau 12 | conseillé | 88 | 60 | 19 | 22 % |
| Ligne graduée, niveau 12 | plus dur | 122 | 76 | 21 | 17 % |
| Ligne graduée, niveau 12 | très dur | 156 | 114 | 19 | 12 % |
| Ligne graduée, niveau 13 | plus facile | 54 | 41 | 19 | 35 % |
| Ligne graduée, niveau 13 | conseillé | 88 | 60 | 19 | 22 % |
| Ligne graduée, niveau 13 | plus dur | 122 | 72 | 20 | 16 % |
| Ligne graduée, niveau 13 | très dur | 156 | 111 | 26 | 17 % |
| Additions, famille 1 (+ 1 et + 2) | plus facile | 46 | 38 | 20 | 43 % |
| Additions, famille 1 (+ 1 et + 2) | conseillé | 88 | 65 | 19 | 22 % |
| Additions, famille 1 (+ 1 et + 2) | plus dur | 122 | 82 | 21 | 17 % |
| Additions, famille 1 (+ 1 et + 2) | très dur | 156 | 94 | 28 | 18 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus facile | 47 | 35 | 21 | 45 % |
| Additions, famille 2 (doubles jusqu'à 5) | conseillé | 84 | 67 | 21 | 25 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus dur | 114 | 90 | 20 | 18 % |
| Additions, famille 2 (doubles jusqu'à 5) | très dur | 145 | 108 | 20 | 14 % |
| Additions, famille 3 (amis de 10) | plus facile | 46 | 35 | 22 | 48 % |
| Additions, famille 3 (amis de 10) | conseillé | 88 | 59 | 22 | 25 % |
| Additions, famille 3 (amis de 10) | plus dur | 122 | 66 | 22 | 18 % |
| Additions, famille 3 (amis de 10) | très dur | 156 | 91 | 23 | 15 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | 47 | 36 | 21 | 45 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | 84 | 59 | 19 | 23 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | 114 | 79 | 19 | 17 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | très dur | 145 | 91 | 24 | 17 % |
| Additions, famille 5 (maisons de 8 et 9) | plus facile | 47 | 35 | 20 | 43 % |
| Additions, famille 5 (maisons de 8 et 9) | conseillé | 84 | 58 | 19 | 23 % |
| Additions, famille 5 (maisons de 8 et 9) | plus dur | 114 | 70 | 25 | 22 % |
| Additions, famille 5 (maisons de 8 et 9) | très dur | 145 | 71 | 20 | 14 % |
| Additions, famille 6 (presque-doubles) | plus facile | 47 | 34 | 19 | 40 % |
| Additions, famille 6 (presque-doubles) | conseillé | 84 | 62 | 23 | 27 % |
| Additions, famille 6 (presque-doubles) | plus dur | 114 | 85 | 23 | 20 % |
| Additions, famille 6 (presque-doubles) | très dur | 145 | 82 | 26 | 18 % |
| Additions, famille 7 (mélange) | plus facile | 46 | 35 | 18 | 39 % |
| Additions, famille 7 (mélange) | conseillé | 88 | 62 | 20 | 23 % |
| Additions, famille 7 (mélange) | plus dur | 122 | 88 | 20 | 16 % |
| Additions, famille 7 (mélange) | très dur | 156 | 111 | 18 | 12 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus facile | 49 | 36 | 16 | 33 % |
| Calcul rapide, niveau 1 (petit, ligne) | conseillé | 91 | 54 | 20 | 22 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus dur | 126 | 65 | 17 | 13 % |
| Calcul rapide, niveau 1 (petit, ligne) | très dur | 160 | 129 | 16 | 10 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus facile | 49 | 37 | 15 | 31 % |
| Calcul rapide, niveau 2 (dizaine, mur) | conseillé | 91 | 71 | 17 | 19 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus dur | 126 | 74 | 17 | 13 % |
| Calcul rapide, niveau 2 (dizaine, mur) | très dur | 162 | 98 | 18 | 11 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus facile | 49 | 35 | 17 | 35 % |
| Calcul rapide, niveau 3 (dizaines, mur) | conseillé | 91 | 64 | 19 | 21 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus dur | 126 | 74 | 16 | 13 % |
| Calcul rapide, niveau 3 (dizaines, mur) | très dur | 158 | 127 | 19 | 12 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | 49 | 35 | 17 | 35 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | 91 | 62 | 19 | 21 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | 123 | 61 | 19 | 15 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | 162 | 97 | 17 | 10 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | 49 | 36 | 16 | 33 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | 89 | 65 | 18 | 20 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | 125 | 70 | 18 | 14 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | 156 | 76 | 23 | 15 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus facile | 49 | 32 | 16 | 33 % |
| Calcul rapide, niveau 6 (plus9, mur) | conseillé | 89 | 60 | 21 | 24 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus dur | 123 | 56 | 20 | 16 % |
| Calcul rapide, niveau 6 (plus9, mur) | très dur | 162 | 62 | 20 | 12 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | 49 | 35 | 19 | 39 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | 84 | 59 | 20 | 24 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | 114 | 54 | 20 | 18 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | 147 | 87 | 24 | 16 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | 49 | 36 | 18 | 37 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | 89 | 67 | 18 | 20 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | 123 | 71 | 20 | 16 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | 162 | 74 | 18 | 11 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 49 | 35 | 17 | 35 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 89 | 60 | 17 | 19 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 123 | 53 | 16 | 13 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 158 | 89 | 21 | 13 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Ligne graduée, niveau 1 | plus facile | appliquée | 34 | 9 | 6 % | 3 (6, 4, 2 : pas de -2) | L1×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 1 | plus facile | réelle | 26 | 10 | 4 % | 3 (4, 7, 10 : pas de +3) | L1×1 | 27 | 88 % | plus facile |
| neuve | Ligne graduée, niveau 1 | plus facile | pressée | 31 | 9 | 10 % | 2 (5, 8 : pas de +3) | L1×1 | 23 | 39 % | plus facile |
| neuve | Ligne graduée, niveau 1 | conseillé | appliquée | 34 | 10 | 6 % | 2 (8, 2 : pas de -6) | L1×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 1 | conseillé | réelle | 26 | 10 | 0 % | 3 (5, 6, 7 : pas de +1) | L1×1 | 45 | 89 % | conseillé |
| neuve | Ligne graduée, niveau 1 | conseillé | pressée | 17 | 8 | 0 % | 2 (7, 5 : pas de -2) | L1×1 L3×1 | 21 | 14 % | conseillé |
| neuve | Ligne graduée, niveau 1 | plus dur | appliquée | 34 | 10 | 3 % | 3 (9, 8, 7 : pas de -1) | L1×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 1 | plus dur | réelle | 24 | 8 | 0 % | 2 (6, 9 : pas de +3) | L1×1 | 50 | 69 % | conseillé |
| neuve | Ligne graduée, niveau 1 | plus dur | pressée | 21 | 7 | 10 % | 2 (8, 3 : pas de -5) | L1×1 L3×1 | 24 | 21 % | conseillé |
| neuve | Ligne graduée, niveau 1 | très dur | appliquée | 34 | 10 | 3 % | 3 (7, 8, 9 : pas de +1) | L1×1 | 99 | 100 % | très dur |
| neuve | Ligne graduée, niveau 1 | très dur | réelle | 27 | 9 | 4 % | 3 (6, 7, 8 : pas de +1) | L1×1 | 88 | 78 % | plus dur |
| neuve | Ligne graduée, niveau 1 | très dur | pressée | 20 | 8 | 0 % | 3 (2, 5, 8 : pas de +3) | L1×1 L3×1 | 28 | 28 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus facile | appliquée | 38 | 4 | 0 % | 2 (9, 1 : pas de -8) | – | 32 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 2 | plus facile | réelle | 23 | 4 | 9 % | 2 (9, 7 : pas de -2) | L1×1 | 29 | 73 % | plus facile |
| neuve | Ligne graduée, niveau 2 | plus facile | pressée | 24 | 4 | 4 % | 2 (7, 1 : pas de -6) | L1×1 | 19 | 22 % | plus facile |
| neuve | Ligne graduée, niveau 2 | conseillé | appliquée | 40 | 8 | 0 % | 3 (6, 7, 8 : pas de +1) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 2 | conseillé | réelle | 24 | 6 | 4 % | 2 (6, 7 : pas de +1) | L1×1 | 48 | 86 % | conseillé |
| neuve | Ligne graduée, niveau 2 | conseillé | pressée | 24 | 7 | 0 % | 3 (8, 7, 6 : pas de -1) | L1×1 | 25 | 26 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus dur | appliquée | 40 | 9 | 0 % | 2 (3, 4 : pas de +1) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 2 | plus dur | réelle | 23 | 8 | 5 % | 3 (3, 4, 5 : pas de +1) | L1×1 | 60 | 78 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus dur | pressée | 22 | 7 | 5 % | 3 (4, 6, 8 : pas de +2) | L1×1 | 23 | 23 % | conseillé |
| neuve | Ligne graduée, niveau 2 | très dur | appliquée | 40 | 9 | 0 % | 3 (3, 4, 5 : pas de +1) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 2 | très dur | réelle | 25 | 9 | 0 % | 2 (7, 5 : pas de -2) | L1×1 | 81 | 89 % | très dur |
| neuve | Ligne graduée, niveau 2 | très dur | pressée | 23 | 7 | 5 % | 2 (1, 4 : pas de +3) | L1×1 | 27 | 25 % | conseillé |
| neuve | Ligne graduée, niveau 3 | plus facile | appliquée | 39 | 14 | 0 % | 2 (11, 2 : pas de -9) | – | 32 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 3 | plus facile | réelle | 24 | 12 | 0 % | 2 (11, 18 : pas de +7) | L1×1 | 26 | 73 % | plus facile |
| neuve | Ligne graduée, niveau 3 | plus facile | pressée | 24 | 12 | 0 % | 3 (13, 16, 19 : pas de +3) | L1×1 | 16 | 17 % | plus facile |
| neuve | Ligne graduée, niveau 3 | conseillé | appliquée | 40 | 18 | 0 % | 3 (5, 6, 7 : pas de +1) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 3 | conseillé | réelle | 24 | 13 | 0 % | 2 (19, 12 : pas de -7) | L1×1 | 44 | 70 % | conseillé |
| neuve | Ligne graduée, niveau 3 | conseillé | pressée | 22 | 11 | 0 % | 2 (7, 3 : pas de -4) | L1×1 | 17 | 12 % | conseillé |
| neuve | Ligne graduée, niveau 3 | plus dur | appliquée | 40 | 16 | 0 % | 3 (16, 14, 12 : pas de -2) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 3 | plus dur | réelle | 24 | 16 | 0 % | 3 (18, 13, 8 : pas de -5) | L1×1 | 51 | 79 % | conseillé |
| neuve | Ligne graduée, niveau 3 | plus dur | pressée | 22 | 13 | 0 % | 2 (6, 16 : pas de +10) | L1×1 | 18 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 3 | très dur | appliquée | 39 | 17 | 0 % | 3 (18, 14, 10 : pas de -4) | – | 106 | 100 % | très dur |
| neuve | Ligne graduée, niveau 3 | très dur | réelle | 21 | 11 | 5 % | 2 (19, 18 : pas de -1) | L1×1 | 58 | 70 % | plus dur |
| neuve | Ligne graduée, niveau 3 | très dur | pressée | 22 | 11 | 0 % | 2 (4, 2 : pas de -2) | L1×1 | 19 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 4 | plus facile | appliquée | 34 | 28 | 0 % | 2 (86, 96 : pas de +10) | L3×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 4 | plus facile | réelle | 19 | 16 | 0 % | 2 (99, 92 : pas de -7) | L3×1 L1×1 | 29 | 74 % | plus facile |
| neuve | Ligne graduée, niveau 4 | plus facile | pressée | 17 | 10 | 0 % | 3 (18, 16, 14 : pas de -2) | L3×1 L1×1 | 17 | 10 % | plus facile |
| neuve | Ligne graduée, niveau 4 | conseillé | appliquée | 34 | 29 | 0 % | 2 (81, 77 : pas de -4) | L3×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 4 | conseillé | réelle | 23 | 19 | 0 % | 3 (56, 65, 74 : pas de +9) | L3×1 L1×1 | 48 | 82 % | conseillé |
| neuve | Ligne graduée, niveau 4 | conseillé | pressée | 23 | 15 | 0 % | 2 (91, 85 : pas de -6) | L3×1 L1×1 | 28 | 29 % | conseillé |
| neuve | Ligne graduée, niveau 4 | plus dur | appliquée | 34 | 20 | 0 % | 2 (74, 76 : pas de +2) | L3×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 4 | plus dur | réelle | 27 | 24 | 0 % | 3 (95, 85, 75 : pas de -10) | L3×1 | 50 | 75 % | conseillé |
| neuve | Ligne graduée, niveau 4 | plus dur | pressée | 20 | 13 | 0 % | 2 (55, 46 : pas de -9) | L3×1 L1×1 | 22 | 18 % | conseillé |
| neuve | Ligne graduée, niveau 4 | très dur | appliquée | 34 | 32 | 0 % | 2 (70, 65 : pas de -5) | L3×1 | 99 | 100 % | très dur |
| neuve | Ligne graduée, niveau 4 | très dur | réelle | 21 | 18 | 0 % | 2 (64, 70 : pas de +6) | L3×1 L1×1 | 70 | 87 % | très dur |
| neuve | Ligne graduée, niveau 4 | très dur | pressée | 19 | 12 | 0 % | 2 (37, 28 : pas de -9) | L3×1 L1×1 | 21 | 13 % | conseillé |
| neuve | Ligne graduée, niveau 5 | plus facile | appliquée | 34 | 4 | 0 % | aucune | L2×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 5 | plus facile | réelle | 28 | 4 | 7 % | 2 (70, 70 : même réponse) | L2×1 | 33 | 83 % | plus facile |
| neuve | Ligne graduée, niveau 5 | plus facile | pressée | 22 | 4 | 5 % | 2 (70, 70 : même réponse) | L2×1 L1×1 | 22 | 26 % | plus facile |
| neuve | Ligne graduée, niveau 5 | conseillé | appliquée | 34 | 7 | 0 % | 2 (70, 80 : pas de +10) | L2×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 5 | conseillé | réelle | 20 | 7 | 5 % | 2 (70, 80 : pas de +10) | L2×1 L1×1 | 46 | 77 % | conseillé |
| neuve | Ligne graduée, niveau 5 | conseillé | pressée | 20 | 8 | 0 % | 2 (80, 90 : pas de +10) | L2×1 L1×1 | 21 | 16 % | conseillé |
| neuve | Ligne graduée, niveau 5 | plus dur | appliquée | 34 | 8 | 0 % | 3 (70, 60, 50 : pas de -10) | L2×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 5 | plus dur | réelle | 22 | 6 | 0 % | 2 (70, 60 : pas de -10) | L2×1 | 42 | 62 % | conseillé |
| neuve | Ligne graduée, niveau 5 | plus dur | pressée | 20 | 7 | 0 % | 3 (20, 30, 40 : pas de +10) | L2×1 L1×1 | 24 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 5 | très dur | appliquée | 34 | 9 | 0 % | 3 (50, 40, 30 : pas de -10) | L2×1 | 99 | 100 % | très dur |
| neuve | Ligne graduée, niveau 5 | très dur | réelle | 22 | 9 | 0 % | 3 (60, 50, 40 : pas de -10) | L2×1 L1×1 | 61 | 69 % | plus dur |
| neuve | Ligne graduée, niveau 5 | très dur | pressée | 20 | 6 | 0 % | 2 (60, 70 : pas de +10) | L2×1 L1×1 | 23 | 16 % | conseillé |
| neuve | Ligne graduée, niveau 6 | plus facile | appliquée | 38 | 29 | 0 % | 2 (34, 39 : pas de +5) | – | 32 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 6 | plus facile | réelle | 25 | 19 | 0 % | 2 (72, 82 : pas de +10) | L1×1 | 29 | 83 % | plus facile |
| neuve | Ligne graduée, niveau 6 | plus facile | pressée | 18 | 12 | 0 % | 2 (78, 86 : pas de +8) | L3×1 L1×1 | 19 | 19 % | plus facile |
| neuve | Ligne graduée, niveau 6 | conseillé | appliquée | 40 | 34 | 0 % | 2 (34, 29 : pas de -5) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 6 | conseillé | réelle | 21 | 15 | 0 % | 2 (59, 58 : pas de -1) | L3×1 | 39 | 69 % | conseillé |
| neuve | Ligne graduée, niveau 6 | conseillé | pressée | 24 | 16 | 0 % | 2 (55, 48 : pas de -7) | L3×1 | 21 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 6 | plus dur | appliquée | 40 | 34 | 0 % | 2 (81, 86 : pas de +5) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 6 | plus dur | réelle | 15 | 12 | 0 % | aucune | L1×1 L3×1 | 43 | 79 % | conseillé |
| neuve | Ligne graduée, niveau 6 | plus dur | pressée | 24 | 15 | 0 % | 2 (78, 83 : pas de +5) | L1×1 L3×1 | 31 | 34 % | conseillé |
| neuve | Ligne graduée, niveau 6 | très dur | appliquée | 38 | 34 | 0 % | 2 (21, 15 : pas de -6) | – | 104 | 100 % | très dur |
| neuve | Ligne graduée, niveau 6 | très dur | réelle | 24 | 19 | 0 % | 2 (88, 80 : pas de -8) | L3×1 | 85 | 84 % | très dur |
| neuve | Ligne graduée, niveau 6 | très dur | pressée | 25 | 15 | 0 % | 2 (68, 75 : pas de +7) | L3×1 | 21 | 16 % | conseillé |
| neuve | Ligne graduée, niveau 7 | plus facile | appliquée | 40 | 25 | 0 % | 2 (26, 18 : pas de -8) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 7 | plus facile | réelle | 20 | 13 | 0 % | 2 (50, 47 : pas de -3) | L1×1 L3×1 | 30 | 66 % | plus facile |
| neuve | Ligne graduée, niveau 7 | plus facile | pressée | 18 | 9 | 0 % | 2 (40, 35 : pas de -5) | L3×1 L1×1 | 20 | 20 % | plus facile |
| neuve | Ligne graduée, niveau 7 | conseillé | appliquée | 38 | 23 | 0 % | 2 (76, 80 : pas de +4) | – | 57 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 7 | conseillé | réelle | 33 | 18 | 0 % | 3 (40, 50, 60 : pas de +10) | – | 47 | 80 % | conseillé |
| neuve | Ligne graduée, niveau 7 | conseillé | pressée | 22 | 12 | 5 % | 2 (70, 76 : pas de +6) | L1×1 L2×1 | 30 | 34 % | conseillé |
| neuve | Ligne graduée, niveau 7 | plus dur | appliquée | 40 | 25 | 0 % | 3 (70, 60, 50 : pas de -10) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 7 | plus dur | réelle | 30 | 17 | 0 % | 2 (77, 78 : pas de +1) | – | 57 | 77 % | conseillé |
| neuve | Ligne graduée, niveau 7 | plus dur | pressée | 20 | 14 | 0 % | 3 (50, 55, 60 : pas de +5) | L2×1 L3×1 L1×1 | 31 | 33 % | conseillé |
| neuve | Ligne graduée, niveau 7 | très dur | appliquée | 40 | 25 | 0 % | 2 (80, 70 : pas de -10) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 7 | très dur | réelle | 28 | 16 | 0 % | 3 (90, 80, 70 : pas de -10) | – | 49 | 61 % | conseillé |
| neuve | Ligne graduée, niveau 7 | très dur | pressée | 19 | 11 | 0 % | 2 (90, 80 : pas de -10) | L2×1 L3×1 | 25 | 26 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus facile | appliquée | 40 | 11 | 0 % | 2 (25, 30 : pas de +5) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 8 | plus facile | réelle | 32 | 11 | 0 % | 4 (50, 40, 30, 20 : pas de -10) | – | 30 | 81 % | plus facile |
| neuve | Ligne graduée, niveau 8 | plus facile | pressée | 30 | 9 | 0 % | 2 (70, 60 : pas de -10) | – | 18 | 30 % | plus facile |
| neuve | Ligne graduée, niveau 8 | conseillé | appliquée | 40 | 11 | 0 % | 3 (90, 80, 70 : pas de -10) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 8 | conseillé | réelle | 32 | 10 | 0 % | 2 (10, 20 : pas de +10) | – | 47 | 83 % | conseillé |
| neuve | Ligne graduée, niveau 8 | conseillé | pressée | 29 | 10 | 0 % | 3 (50, 60, 70 : pas de +10) | – | 23 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus dur | appliquée | 40 | 11 | 0 % | 2 (30, 20 : pas de -10) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 8 | plus dur | réelle | 31 | 11 | 0 % | 3 (90, 80, 70 : pas de -10) | – | 54 | 76 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus dur | pressée | 29 | 10 | 0 % | 2 (20, 10 : pas de -10) | – | 19 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 8 | très dur | appliquée | 40 | 11 | 0 % | 2 (50, 40 : pas de -10) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 8 | très dur | réelle | 31 | 11 | 0 % | 4 (40, 50, 60, 70 : pas de +10) | – | 83 | 77 % | plus dur |
| neuve | Ligne graduée, niveau 8 | très dur | pressée | 30 | 10 | 0 % | 2 (20, 10 : pas de -10) | – | 20 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 9 | plus facile | appliquée | 34 | 4 | 0 % | aucune | L10×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 9 | plus facile | réelle | 24 | 4 | 4 % | 2 (700, 700 : même réponse) | L10×1 L1×1 | 32 | 80 % | plus facile |
| neuve | Ligne graduée, niveau 9 | plus facile | pressée | 20 | 4 | 0 % | aucune | L10×1 L1×1 | 20 | 21 % | plus facile |
| neuve | Ligne graduée, niveau 9 | conseillé | appliquée | 34 | 8 | 0 % | aucune | L10×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 9 | conseillé | réelle | 18 | 7 | 0 % | aucune | L10×1 L1×1 | 44 | 70 % | conseillé |
| neuve | Ligne graduée, niveau 9 | conseillé | pressée | 20 | 8 | 0 % | aucune | L10×1 L1×1 | 26 | 21 % | conseillé |
| neuve | Ligne graduée, niveau 9 | plus dur | appliquée | 34 | 9 | 0 % | aucune | L10×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 9 | plus dur | réelle | 17 | 9 | 6 % | 2 (100, 100 : même réponse) | L10×1 L1×1 | 47 | 76 % | conseillé |
| neuve | Ligne graduée, niveau 9 | plus dur | pressée | 18 | 6 | 6 % | 2 (800, 800 : même réponse) | L10×1 L1×1 | 24 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 9 | très dur | appliquée | 34 | 9 | 0 % | aucune | L10×1 | 99 | 100 % | très dur |
| neuve | Ligne graduée, niveau 9 | très dur | réelle | 20 | 8 | 0 % | aucune | L10×1 L1×1 | 78 | 79 % | très dur |
| neuve | Ligne graduée, niveau 9 | très dur | pressée | 17 | 7 | 0 % | aucune | L10×1 L1×1 | 23 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 10 | plus facile | appliquée | 39 | 29 | 0 % | 2 (220, 210 : pas de -10) | – | 32 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 10 | plus facile | réelle | 15 | 11 | 0 % | 2 (730, 720 : pas de -10) | L3×1 L10×1 | 26 | 69 % | plus facile |
| neuve | Ligne graduée, niveau 10 | plus facile | pressée | 23 | 16 | 0 % | aucune | L1×1 L3×1 | 21 | 22 % | plus facile |
| neuve | Ligne graduée, niveau 10 | conseillé | appliquée | 38 | 32 | 0 % | aucune | – | 57 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 10 | conseillé | réelle | 22 | 16 | 0 % | aucune | L1×1 | 42 | 74 % | conseillé |
| neuve | Ligne graduée, niveau 10 | conseillé | pressée | 17 | 12 | 0 % | aucune | L1×1 L10×1 | 21 | 14 % | conseillé |
| neuve | Ligne graduée, niveau 10 | plus dur | appliquée | 40 | 24 | 0 % | 2 (750, 760 : pas de +10) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 10 | plus dur | réelle | 19 | 12 | 0 % | 2 (560, 550 : pas de -10) | L1×1 L10×1 | 55 | 82 % | plus dur |
| neuve | Ligne graduée, niveau 10 | plus dur | pressée | 16 | 11 | 0 % | aucune | L3×1 L1×1 L10×1 | 25 | 21 % | conseillé |
| neuve | Ligne graduée, niveau 10 | très dur | appliquée | 40 | 31 | 0 % | 2 (820, 830 : pas de +10) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 10 | très dur | réelle | 23 | 17 | 0 % | 2 (550, 560 : pas de +10) | L1×1 | 55 | 74 % | conseillé |
| neuve | Ligne graduée, niveau 10 | très dur | pressée | 17 | 11 | 0 % | 2 (410, 420 : pas de +10) | L1×1 L10×1 | 20 | 14 % | conseillé |
| neuve | Ligne graduée, niveau 11 | plus facile | appliquée | 40 | 38 | 0 % | 2 (726, 718 : pas de -8) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 11 | plus facile | réelle | 26 | 21 | 0 % | 2 (523, 529 : pas de +6) | L1×1 | 27 | 81 % | plus facile |
| neuve | Ligne graduée, niveau 11 | plus facile | pressée | 19 | 12 | 0 % | 2 (352, 349 : pas de -3) | L1×1 L3×1 | 20 | 23 % | plus facile |
| neuve | Ligne graduée, niveau 11 | conseillé | appliquée | 40 | 38 | 0 % | 2 (795, 792 : pas de -3) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 11 | conseillé | réelle | 23 | 18 | 0 % | aucune | L10×1 | 48 | 81 % | conseillé |
| neuve | Ligne graduée, niveau 11 | conseillé | pressée | 19 | 13 | 0 % | aucune | L1×1 L3×1 | 26 | 23 % | conseillé |
| neuve | Ligne graduée, niveau 11 | plus dur | appliquée | 40 | 37 | 0 % | 2 (531, 522 : pas de -9) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 11 | plus dur | réelle | 23 | 19 | 0 % | 2 (893, 892 : pas de -1) | L3×1 | 62 | 81 % | plus dur |
| neuve | Ligne graduée, niveau 11 | plus dur | pressée | 19 | 12 | 0 % | 2 (673, 678 : pas de +5) | L3×1 L1×1 | 23 | 19 % | conseillé |
| neuve | Ligne graduée, niveau 11 | très dur | appliquée | 40 | 38 | 0 % | 2 (907, 900 : pas de -7) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 11 | très dur | réelle | 29 | 25 | 0 % | 2 (582, 579 : pas de -3) | L3×1 | 87 | 81 % | très dur |
| neuve | Ligne graduée, niveau 11 | très dur | pressée | 22 | 14 | 0 % | 2 (673, 671 : pas de -2) | L10×1 | 21 | 18 % | conseillé |
| neuve | Ligne graduée, niveau 12 | plus facile | appliquée | 40 | 28 | 0 % | 2 (331, 332 : pas de +1) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 12 | plus facile | réelle | 32 | 21 | 0 % | 2 (698, 692 : pas de -6) | – | 31 | 79 % | plus facile |
| neuve | Ligne graduée, niveau 12 | plus facile | pressée | 26 | 13 | 0 % | 2 (145, 151 : pas de +6) | – | 11 | 5 % | plus facile |
| neuve | Ligne graduée, niveau 12 | conseillé | appliquée | 39 | 36 | 0 % | 2 (949, 941 : pas de -8) | – | 58 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 12 | conseillé | réelle | 23 | 18 | 0 % | 2 (900, 906 : pas de +6) | L10×1 | 42 | 68 % | conseillé |
| neuve | Ligne graduée, niveau 12 | conseillé | pressée | 26 | 15 | 0 % | aucune | – | 14 | 8 % | conseillé |
| neuve | Ligne graduée, niveau 12 | plus dur | appliquée | 40 | 31 | 0 % | aucune | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 12 | plus dur | réelle | 26 | 20 | 0 % | 2 (613, 603 : pas de -10) | L10×1 | 65 | 89 % | plus dur |
| neuve | Ligne graduée, niveau 12 | plus dur | pressée | 26 | 15 | 0 % | aucune | – | 14 | 8 % | conseillé |
| neuve | Ligne graduée, niveau 12 | très dur | appliquée | 40 | 28 | 0 % | 2 (408, 415 : pas de +7) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 12 | très dur | réelle | 31 | 20 | 0 % | aucune | – | 90 | 86 % | très dur |
| neuve | Ligne graduée, niveau 12 | très dur | pressée | 26 | 16 | 0 % | aucune | – | 12 | 5 % | conseillé |
| neuve | Ligne graduée, niveau 13 | plus facile | appliquée | 40 | 11 | 0 % | aucune | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 13 | plus facile | réelle | 29 | 10 | 7 % | 2 (150, 150 : même réponse) | – | 26 | 77 % | plus facile |
| neuve | Ligne graduée, niveau 13 | plus facile | pressée | 27 | 9 | 0 % | aucune | – | 13 | 13 % | plus facile |
| neuve | Ligne graduée, niveau 13 | conseillé | appliquée | 40 | 11 | 0 % | aucune | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 13 | conseillé | réelle | 28 | 11 | 4 % | 2 (800, 800 : même réponse) | – | 42 | 73 % | conseillé |
| neuve | Ligne graduée, niveau 13 | conseillé | pressée | 27 | 11 | 0 % | aucune | – | 13 | 8 % | conseillé |
| neuve | Ligne graduée, niveau 13 | plus dur | appliquée | 40 | 11 | 0 % | aucune | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 13 | plus dur | réelle | 28 | 10 | 0 % | aucune | – | 49 | 73 % | conseillé |
| neuve | Ligne graduée, niveau 13 | plus dur | pressée | 29 | 10 | 0 % | aucune | – | 19 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 13 | très dur | appliquée | 38 | 10 | 0 % | aucune | – | 104 | 100 % | très dur |
| neuve | Ligne graduée, niveau 13 | très dur | réelle | 30 | 10 | 0 % | aucune | – | 62 | 77 % | conseillé |
| neuve | Ligne graduée, niveau 13 | très dur | pressée | 29 | 10 | 0 % | aucune | – | 17 | 17 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus facile | appliquée | 24 | 9 | 0 % | 3 (2, 3, 4 : pas de +1) | – | 25 | 100 % | plus facile |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus facile | réelle | 17 | 7 | 0 % | 3 (2, 3, 4 : pas de +1) | – | 20 | 63 % | plus facile |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus facile | pressée | 20 | 6 | 0 % | 3 (2, 3, 4 : pas de +1) | – | 11 | 9 % | plus facile |
| neuve | Additions, famille 1 (+ 1 et + 2) | conseillé | appliquée | 40 | 9 | 5 % | 2 (2, 3 : pas de +1) | – | 59 | 100 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | conseillé | réelle | 33 | 9 | 3 % | 3 (5, 4, 3 : pas de -1) | – | 51 | 87 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | conseillé | pressée | 27 | 8 | 0 % | 2 (2, 3 : pas de +1) | – | 14 | 8 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus dur | appliquée | 40 | 10 | 5 % | 2 (2, 3 : pas de +1) | – | 83 | 100 % | plus dur |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus dur | réelle | 31 | 10 | 0 % | 2 (2, 4 : pas de +2) | – | 73 | 84 % | plus dur |
| neuve | Additions, famille 1 (+ 1 et + 2) | plus dur | pressée | 26 | 7 | 4 % | 3 (5, 4, 3 : pas de -1) | – | 15 | 11 % | conseillé |
| neuve | Additions, famille 1 (+ 1 et + 2) | très dur | appliquée | 40 | 8 | 18 % | 3 (1, 1, 1 : même réponse) | – | 108 | 100 % | très dur |
| neuve | Additions, famille 1 (+ 1 et + 2) | très dur | réelle | 30 | 9 | 7 % | 2 (3, 3 : même réponse) | – | 76 | 79 % | plus dur |
| neuve | Additions, famille 1 (+ 1 et + 2) | très dur | pressée | 27 | 8 | 0 % | 4 (4, 5, 6, 7 : pas de +1) | – | 17 | 13 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | appliquée | 19 | 5 | 0 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | réelle | 14 | 5 | 0 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 23 | 71 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | pressée | 16 | 5 | 0 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 13 | 4 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | conseillé | appliquée | 33 | 7 | 6 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | conseillé | réelle | 23 | 6 | 0 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 43 | 79 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | conseillé | pressée | 22 | 6 | 0 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 16 | 6 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus dur | appliquée | 33 | 8 | 9 % | 3 (2, 2, 2 : même réponse) | L4×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus dur | réelle | 24 | 8 | 4 % | 2 (2, 4 : pas de +2) | L4×1 | 57 | 76 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus dur | pressée | 21 | 5 | 0 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 15 | 6 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | très dur | appliquée | 33 | 5 | 9 % | 4 (2, 3, 4, 5 : pas de +1) | L4×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | très dur | réelle | 23 | 8 | 9 % | 2 (2, 4 : pas de +2) | L4×1 | 58 | 68 % | plus dur |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | très dur | pressée | 22 | 6 | 0 % | 4 (2, 4, 6, 8 : pas de +2) | L4×1 | 18 | 11 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus facile | appliquée | 18 | 1 | 100 % | 18 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | plus facile | réelle | 15 | 1 | 100 % | 15 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 23 | 91 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | plus facile | pressée | 15 | 1 | 100 % | 15 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 15 | 17 % | plus facile |
| neuve | Additions, famille 3 (amis de 10) | conseillé | appliquée | 30 | 4 | 66 % | 6 (10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 52 | 100 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | conseillé | réelle | 26 | 4 | 68 % | 6 (10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 51 | 83 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | conseillé | pressée | 22 | 3 | 71 % | 8 (10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 20 | 15 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus dur | appliquée | 30 | 9 | 7 % | 3 (4, 7, 10 : pas de +3) | L5×1 | 71 | 100 % | plus dur |
| neuve | Additions, famille 3 (amis de 10) | plus dur | réelle | 24 | 8 | 9 % | 3 (10, 6, 2 : pas de -4) | L5×1 | 61 | 91 % | plus dur |
| neuve | Additions, famille 3 (amis de 10) | plus dur | pressée | 20 | 3 | 68 % | 8 (10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 19 | 15 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | très dur | appliquée | 30 | 10 | 10 % | 3 (9, 5, 1 : pas de -4) | L5×1 | 91 | 100 % | très dur |
| neuve | Additions, famille 3 (amis de 10) | très dur | réelle | 20 | 6 | 26 % | 4 (10, 10, 10, 10 : même réponse) | L5×1 | 53 | 69 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | très dur | pressée | 22 | 2 | 71 % | 8 (10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 19 | 14 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | appliquée | 18 | 3 | 35 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | réelle | 15 | 3 | 14 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 23 | 91 % | plus facile |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | pressée | 14 | 3 | 23 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 15 | 15 % | plus facile |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | appliquée | 33 | 6 | 16 % | 4 (4, 5, 6, 7 : pas de +1) | L6×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | réelle | 22 | 4 | 19 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 40 | 71 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | pressée | 22 | 5 | 24 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 18 | 12 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | appliquée | 33 | 7 | 6 % | 3 (5, 5, 5 : même réponse) | L6×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | réelle | 23 | 7 | 14 % | 2 (5, 5 : même réponse) | L6×1 | 59 | 79 % | plus dur |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | pressée | 20 | 5 | 26 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 18 | 13 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | appliquée | 33 | 6 | 19 % | 3 (1, 1, 1 : même réponse) | L6×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | réelle | 24 | 5 | 22 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 51 | 76 % | conseillé |
| neuve | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | pressée | 20 | 4 | 26 % | 3 (5, 6, 7 : pas de +1) | L6×1 | 22 | 21 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus facile | appliquée | 18 | 2 | 41 % | 2 (8, 9 : pas de +1) | L6×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus facile | réelle | 15 | 2 | 36 % | 2 (8, 9 : pas de +1) | L6×1 | 24 | 76 % | plus facile |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus facile | pressée | 15 | 2 | 29 % | 2 (8, 9 : pas de +1) | L6×1 | 15 | 15 % | plus facile |
| neuve | Additions, famille 5 (maisons de 8 et 9) | conseillé | appliquée | 30 | 5 | 24 % | 2 (8, 9 : pas de +1) | L6×1 | 52 | 100 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | conseillé | réelle | 23 | 3 | 36 % | 4 (8, 8, 8, 8 : même réponse) | L6×1 | 47 | 83 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | conseillé | pressée | 22 | 3 | 33 % | 4 (8, 8, 8, 8 : même réponse) | L6×1 | 17 | 12 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus dur | appliquée | 30 | 8 | 7 % | 2 (8, 9 : pas de +1) | L6×1 | 71 | 100 % | plus dur |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus dur | réelle | 24 | 7 | 4 % | 3 (8, 5, 2 : pas de -3) | L6×1 | 65 | 89 % | plus dur |
| neuve | Additions, famille 5 (maisons de 8 et 9) | plus dur | pressée | 22 | 4 | 10 % | 2 (8, 9 : pas de +1) | L6×1 | 17 | 12 % | conseillé |
| neuve | Additions, famille 5 (maisons de 8 et 9) | très dur | appliquée | 30 | 8 | 7 % | 3 (8, 5, 2 : pas de -3) | L6×1 | 91 | 100 % | très dur |
| neuve | Additions, famille 5 (maisons de 8 et 9) | très dur | réelle | 25 | 8 | 13 % | 3 (7, 4, 1 : pas de -3) | L6×1 | 75 | 91 % | très dur |
| neuve | Additions, famille 5 (maisons de 8 et 9) | très dur | pressée | 21 | 4 | 10 % | 2 (8, 9 : pas de +1) | L6×1 | 16 | 9 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | plus facile | appliquée | 19 | 4 | 22 % | 2 (3, 5 : pas de +2) | L4×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 6 (presque-doubles) | plus facile | réelle | 17 | 4 | 6 % | 3 (9, 7, 5 : pas de -2) | L4×1 | 23 | 78 % | plus facile |
| neuve | Additions, famille 6 (presque-doubles) | plus facile | pressée | 16 | 3 | 20 % | 2 (3, 5 : pas de +2) | L4×1 | 15 | 10 % | plus facile |
| neuve | Additions, famille 6 (presque-doubles) | conseillé | appliquée | 33 | 6 | 16 % | 2 (3, 5 : pas de +2) | L4×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | conseillé | réelle | 25 | 6 | 8 % | 2 (3, 5 : pas de +2) | L4×1 | 50 | 80 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | conseillé | pressée | 22 | 5 | 14 % | 3 (3, 4, 5 : pas de +1) | L4×1 | 15 | 6 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | plus dur | appliquée | 33 | 7 | 3 % | 2 (3, 5 : pas de +2) | L4×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 6 (presque-doubles) | plus dur | réelle | 25 | 6 | 13 % | 2 (3, 5 : pas de +2) | L4×1 | 51 | 82 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | plus dur | pressée | 21 | 3 | 25 % | 2 (3, 5 : pas de +2) | L4×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | très dur | appliquée | 33 | 5 | 13 % | 3 (2, 2, 2 : même réponse) | L4×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 6 (presque-doubles) | très dur | réelle | 24 | 6 | 13 % | 3 (2, 2, 2 : même réponse) | L4×1 | 68 | 76 % | conseillé |
| neuve | Additions, famille 6 (presque-doubles) | très dur | pressée | 22 | 4 | 19 % | 2 (3, 5 : pas de +2) | L4×1 | 19 | 9 % | conseillé |
| neuve | Additions, famille 7 (mélange) | plus facile | appliquée | 24 | 2 | 35 % | 2 (2, 3 : pas de +1) | – | 25 | 100 % | plus facile |
| neuve | Additions, famille 7 (mélange) | plus facile | réelle | 19 | 2 | 33 % | 2 (2, 3 : pas de +1) | – | 22 | 80 % | plus facile |
| neuve | Additions, famille 7 (mélange) | plus facile | pressée | 19 | 2 | 33 % | 2 (2, 3 : pas de +1) | – | 11 | 7 % | plus facile |
| neuve | Additions, famille 7 (mélange) | conseillé | appliquée | 40 | 4 | 33 % | 2 (2, 3 : pas de +1) | – | 59 | 100 % | conseillé |
| neuve | Additions, famille 7 (mélange) | conseillé | réelle | 32 | 4 | 29 % | 3 (3, 4, 5 : pas de +1) | – | 48 | 85 % | conseillé |
| neuve | Additions, famille 7 (mélange) | conseillé | pressée | 26 | 3 | 28 % | 3 (2, 3, 4 : pas de +1) | – | 12 | 5 % | conseillé |
| neuve | Additions, famille 7 (mélange) | plus dur | appliquée | 40 | 5 | 23 % | 3 (4, 4, 4 : même réponse) | – | 83 | 100 % | plus dur |
| neuve | Additions, famille 7 (mélange) | plus dur | réelle | 29 | 5 | 11 % | 3 (3, 2, 1 : pas de -1) | – | 64 | 82 % | plus dur |
| neuve | Additions, famille 7 (mélange) | plus dur | pressée | 26 | 2 | 32 % | 2 (2, 3 : pas de +1) | – | 14 | 8 % | conseillé |
| neuve | Additions, famille 7 (mélange) | très dur | appliquée | 40 | 4 | 38 % | 5 (1, 1, 1, 1, 1 : même réponse) | – | 108 | 100 % | très dur |
| neuve | Additions, famille 7 (mélange) | très dur | réelle | 28 | 4 | 41 % | 9 (1, 1, 1, 1, 1, 1, 1, 1, 1 : même réponse) | – | 83 | 74 % | plus dur |
| neuve | Additions, famille 7 (mélange) | très dur | pressée | 27 | 2 | 35 % | 2 (2, 3 : pas de +1) | – | 14 | 8 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus facile | appliquée | 30 | 24 | 0 % | 2 (96, 99 : pas de +3) | – | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus facile | réelle | 24 | 18 | 0 % | 2 (64, 56 : pas de -8) | – | 24 | 62 % | plus facile |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus facile | pressée | 20 | 12 | 0 % | 2 (21, 12 : pas de -9) | – | 11 | 6 % | plus facile |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | conseillé | appliquée | 43 | 34 | 0 % | 2 (73, 63 : pas de -10) | – | 62 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | conseillé | réelle | 33 | 25 | 3 % | 2 (28, 23 : pas de -5) | – | 51 | 79 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | conseillé | pressée | 22 | 13 | 0 % | 2 (34, 42 : pas de +8) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus dur | appliquée | 43 | 37 | 0 % | 2 (14, 18 : pas de +4) | – | 88 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus dur | réelle | 31 | 26 | 0 % | 2 (47, 41 : pas de -6) | – | 60 | 86 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | plus dur | pressée | 22 | 12 | 0 % | 2 (17, 21 : pas de +4) | – | 11 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | très dur | appliquée | 41 | 2 | 35 % | 5 (1, 1, 1, 1, 1 : même réponse) | – | 110 | 100 % | très dur |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | très dur | réelle | 26 | 14 | 20 % | 4 (1, 1, 1, 1 : même réponse) | – | 59 | 74 % | conseillé |
| neuve | Calcul rapide, niveau 1 (petit, ligne) | très dur | pressée | 22 | 11 | 0 % | 3 (47, 38, 29 : pas de -9) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | appliquée | 24 | 19 | 9 % | 2 (44, 38 : pas de -6) | L7×1 | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | réelle | 20 | 19 | 0 % | 2 (8, 11 : pas de +3) | L7×1 | 24 | 89 % | plus facile |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | pressée | 16 | 9 | 0 % | 2 (24, 26 : pas de +2) | L7×1 | 13 | 0 % | plus facile |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | appliquée | 34 | 30 | 0 % | 2 (44, 35 : pas de -9) | L7×1 | 56 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | réelle | 23 | 18 | 0 % | 2 (5, 12 : pas de +7) | L7×1 | 42 | 78 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | pressée | 19 | 12 | 0 % | 2 (75, 77 : pas de +2) | L7×1 | 15 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | appliquée | 34 | 29 | 0 % | 2 (24, 17 : pas de -7) | L7×1 | 77 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | réelle | 29 | 24 | 0 % | 2 (43, 39 : pas de -4) | L7×1 | 53 | 81 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | pressée | 18 | 10 | 0 % | 2 (26, 16 : pas de -10) | L7×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | très dur | appliquée | 34 | 1 | 100 % | 34 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L7×1 | 99 | 100 % | très dur |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | très dur | réelle | 24 | 21 | 0 % | 2 (34, 38 : pas de +4) | L7×1 | 61 | 71 % | conseillé |
| neuve | Calcul rapide, niveau 2 (dizaine, mur) | très dur | pressée | 18 | 11 | 0 % | 2 (83, 88 : pas de +5) | L7×1 | 15 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | appliquée | 27 | 22 | 0 % | 2 (83, 79 : pas de -4) | – | 26 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | réelle | 22 | 18 | 5 % | 2 (71, 77 : pas de +6) | – | 25 | 88 % | plus facile |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | pressée | 19 | 12 | 0 % | 2 (64, 57 : pas de -7) | – | 10 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | appliquée | 38 | 33 | 0 % | 2 (76, 80 : pas de +4) | – | 57 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | réelle | 27 | 19 | 0 % | 2 (34, 40 : pas de +6) | – | 48 | 74 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | pressée | 22 | 13 | 0 % | 2 (59, 51 : pas de -8) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | appliquée | 35 | 29 | 3 % | 2 (36, 41 : pas de +5) | – | 76 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | réelle | 26 | 19 | 0 % | 2 (10, 18 : pas de +8) | – | 46 | 73 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | pressée | 22 | 12 | 0 % | 2 (15, 9 : pas de -6) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | très dur | appliquée | 43 | 8 | 17 % | 3 (20, 30, 40 : pas de +10) | – | 114 | 100 % | très dur |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | très dur | réelle | 12 | 11 | 0 % | 2 (75, 66 : pas de -9) | L7×1 | 41 | 58 % | conseillé |
| neuve | Calcul rapide, niveau 3 (dizaines, mur) | très dur | pressée | 22 | 12 | 0 % | 2 (52, 43 : pas de -9) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | appliquée | 30 | 21 | 0 % | 2 (75, 66 : pas de -9) | – | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | réelle | 23 | 17 | 0 % | 3 (49, 59, 69 : pas de +10) | – | 22 | 72 % | plus facile |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | pressée | 19 | 12 | 0 % | 2 (17, 15 : pas de -2) | – | 11 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | appliquée | 43 | 34 | 0 % | 2 (88, 79 : pas de -9) | – | 62 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | réelle | 30 | 19 | 0 % | 2 (49, 55 : pas de +6) | – | 42 | 68 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | pressée | 23 | 12 | 0 % | 2 (68, 76 : pas de +8) | – | 12 | 6 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | appliquée | 43 | 33 | 2 % | 2 (55, 58 : pas de +3) | – | 88 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | réelle | 32 | 23 | 0 % | 2 (79, 87 : pas de +8) | – | 67 | 84 % | plus dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | pressée | 21 | 12 | 0 % | 2 (76, 78 : pas de +2) | – | 13 | 6 % | conseillé |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | appliquée | 43 | 6 | 17 % | 3 (7, 5, 3 : pas de -2) | – | 114 | 100 % | très dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | réelle | 34 | 5 | 12 % | 5 (6, 5, 4, 3, 2 : pas de -1) | – | 100 | 87 % | très dur |
| neuve | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | pressée | 22 | 12 | 0 % | 2 (58, 68 : pas de +10) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | appliquée | 30 | 23 | 7 % | 2 (21, 22 : pas de +1) | – | 28 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | réelle | 19 | 13 | 0 % | 2 (95, 92 : pas de -3) | – | 22 | 62 % | plus facile |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | pressée | 19 | 12 | 0 % | 2 (42, 52 : pas de +10) | – | 12 | 9 % | plus facile |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | appliquée | 43 | 29 | 0 % | 2 (83, 81 : pas de -2) | – | 62 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | réelle | 30 | 20 | 7 % | 2 (92, 85 : pas de -7) | – | 49 | 85 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | pressée | 23 | 12 | 0 % | 2 (43, 51 : pas de +8) | – | 14 | 8 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | appliquée | 43 | 31 | 2 % | 3 (71, 61, 51 : pas de -10) | – | 88 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | réelle | 33 | 22 | 3 % | 2 (32, 33 : pas de +1) | – | 54 | 84 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | pressée | 22 | 12 | 0 % | 2 (52, 53 : pas de +1) | – | 12 | 6 % | conseillé |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | appliquée | 43 | 6 | 5 % | 3 (4, 4, 4 : même réponse) | – | 114 | 100 % | très dur |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | réelle | 29 | 7 | 21 % | 2 (2, 2 : même réponse) | – | 83 | 75 % | plus dur |
| neuve | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | pressée | 22 | 13 | 0 % | 2 (72, 80 : pas de +8) | – | 11 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus facile | appliquée | 23 | 20 | 0 % | 2 (93, 95 : pas de +2) | L8×1 | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus facile | réelle | 18 | 16 | 0 % | 2 (43, 45 : pas de +2) | L8×1 | 24 | 83 % | plus facile |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus facile | pressée | 16 | 10 | 0 % | 2 (43, 44 : pas de +1) | L8×1 | 13 | 0 % | plus facile |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | conseillé | appliquée | 33 | 31 | 0 % | 2 (46, 52 : pas de +6) | L8×1 | 55 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | conseillé | réelle | 19 | 14 | 0 % | 3 (41, 37, 33 : pas de -4) | L8×1 L9×1 | 40 | 73 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | conseillé | pressée | 18 | 12 | 0 % | aucune | L8×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus dur | appliquée | 33 | 29 | 0 % | 2 (58, 66 : pas de +8) | L8×1 | 76 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus dur | réelle | 18 | 14 | 0 % | 2 (80, 81 : pas de +1) | L8×1 | 40 | 70 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | plus dur | pressée | 18 | 10 | 0 % | 2 (95, 96 : pas de +1) | L8×1 | 14 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | très dur | appliquée | 34 | 1 | 100 % | 34 (9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9 : même réponse) | L8×1 | 99 | 100 % | très dur |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | très dur | réelle | 23 | 1 | 100 % | 23 (9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9 : même réponse) | L8×1 | 69 | 79 % | très dur |
| neuve | Calcul rapide, niveau 6 (plus9, mur) | très dur | pressée | 18 | 12 | 0 % | 2 (63, 58 : pas de -5) | L8×1 | 14 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | appliquée | 23 | 19 | 0 % | 2 (81, 82 : pas de +1) | L9×1 | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | réelle | 18 | 13 | 0 % | 2 (63, 65 : pas de +2) | L9×1 | 24 | 71 % | plus facile |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | pressée | 16 | 10 | 0 % | 2 (22, 26 : pas de +4) | L9×1 | 13 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | appliquée | 33 | 21 | 0 % | 2 (73, 71 : pas de -2) | L9×1 | 55 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | réelle | 22 | 15 | 0 % | 2 (76, 67 : pas de -9) | L9×1 | 41 | 79 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | pressée | 18 | 12 | 0 % | 2 (62, 53 : pas de -9) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | appliquée | 33 | 27 | 0 % | 2 (51, 44 : pas de -7) | L9×1 | 76 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | réelle | 21 | 17 | 5 % | 2 (82, 82 : même réponse) | L9×1 | 47 | 71 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | pressée | 18 | 11 | 0 % | 2 (41, 31 : pas de -10) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | appliquée | 34 | 6 | 9 % | 3 (4, 6, 8 : pas de +2) | L9×1 | 99 | 100 % | très dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | réelle | 24 | 5 | 13 % | 3 (6, 7, 8 : pas de +1) | L9×1 | 71 | 82 % | très dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | pressée | 18 | 11 | 0 % | 2 (62, 63 : pas de +1) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | appliquée | 29 | 21 | 0 % | 3 (78, 82, 86 : pas de +4) | – | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | réelle | 22 | 13 | 0 % | 2 (88, 96 : pas de +8) | – | 23 | 69 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | pressée | 19 | 11 | 6 % | 2 (85, 84 : pas de -1) | – | 10 | 0 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | appliquée | 41 | 29 | 0 % | 2 (49, 48 : pas de -1) | – | 60 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | réelle | 28 | 19 | 0 % | 2 (78, 87 : pas de +9) | – | 49 | 77 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | pressée | 21 | 11 | 0 % | 2 (59, 58 : pas de -1) | – | 12 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | appliquée | 40 | 26 | 5 % | 2 (68, 68 : même réponse) | – | 83 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | réelle | 22 | 17 | 0 % | 2 (56, 48 : pas de -8) | L7×1 | 47 | 81 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | pressée | 23 | 12 | 0 % | 2 (66, 72 : pas de +6) | – | 13 | 6 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | appliquée | 43 | 31 | 0 % | 2 (32, 39 : pas de +7) | – | 114 | 100 % | très dur |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | réelle | 24 | 18 | 9 % | 2 (16, 16 : même réponse) | L7×1 | 59 | 73 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | pressée | 22 | 12 | 0 % | 2 (88, 92 : pas de +4) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | appliquée | 29 | 19 | 7 % | 2 (87, 89 : pas de +2) | – | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | réelle | 21 | 14 | 0 % | 2 (39, 36 : pas de -3) | – | 27 | 72 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | pressée | 19 | 11 | 0 % | 2 (78, 68 : pas de -10) | – | 11 | 6 % | plus facile |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | appliquée | 41 | 27 | 0 % | 2 (17, 27 : pas de +10) | – | 60 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | réelle | 29 | 21 | 0 % | 2 (36, 28 : pas de -8) | – | 46 | 80 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | pressée | 22 | 11 | 5 % | 2 (66, 68 : pas de +2) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | appliquée | 41 | 24 | 8 % | 2 (25, 19 : pas de -6) | – | 85 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | réelle | 29 | 18 | 4 % | 2 (69, 69 : même réponse) | – | 57 | 79 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | pressée | 22 | 12 | 10 % | 2 (58, 54 : pas de -4) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | appliquée | 41 | 27 | 3 % | 2 (27, 18 : pas de -9) | – | 110 | 100 % | très dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | réelle | 29 | 16 | 4 % | 2 (69, 75 : pas de +6) | – | 88 | 80 % | plus dur |
| neuve | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | pressée | 22 | 13 | 0 % | 2 (65, 59 : pas de -6) | – | 12 | 3 % | conseillé |
| mois | Ligne graduée, niveau 1 | plus facile | appliquée | 39 | 10 | 5 % | 2 (2, 2 : même réponse) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 1 | plus facile | réelle | 26 | 10 | 8 % | 2 (5, 10 : pas de +5) | L1×1 | 39 | 77 % | plus facile |
| mois | Ligne graduée, niveau 1 | plus facile | pressée | 31 | 9 | 7 % | 4 (9, 8, 7, 6 : pas de -1) | L1×1 | 30 | 28 % | plus facile |
| mois | Ligne graduée, niveau 1 | conseillé | appliquée | 40 | 10 | 3 % | 2 (2, 8 : pas de +6) | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 1 | conseillé | réelle | 22 | 8 | 0 % | 3 (9, 6, 3 : pas de -3) | L3×1 | 58 | 77 % | conseillé |
| mois | Ligne graduée, niveau 1 | conseillé | pressée | 16 | 7 | 7 % | 3 (8, 5, 2 : pas de -3) | L1×1 L3×1 | 27 | 10 % | conseillé |
| mois | Ligne graduée, niveau 1 | plus dur | appliquée | 40 | 10 | 8 % | 3 (3, 2, 1 : pas de -1) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 1 | plus dur | réelle | 22 | 9 | 5 % | 2 (2, 6 : pas de +4) | L1×1 | 76 | 78 % | plus dur |
| mois | Ligne graduée, niveau 1 | plus dur | pressée | 24 | 9 | 9 % | 2 (6, 3 : pas de -3) | L1×1 L3×1 | 39 | 19 % | conseillé |
| mois | Ligne graduée, niveau 1 | très dur | appliquée | 38 | 10 | 14 % | 3 (7, 8, 9 : pas de +1) | – | 152 | 100 % | très dur |
| mois | Ligne graduée, niveau 1 | très dur | réelle | 23 | 9 | 9 % | 3 (8, 7, 6 : pas de -1) | L1×1 | 81 | 79 % | conseillé |
| mois | Ligne graduée, niveau 1 | très dur | pressée | 26 | 9 | 4 % | 3 (6, 7, 8 : pas de +1) | L1×1 | 33 | 16 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus facile | appliquée | 40 | 4 | 0 % | 2 (7, 3 : pas de -4) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 2 | plus facile | réelle | 23 | 4 | 5 % | 2 (9, 1 : pas de -8) | L1×1 | 40 | 76 % | plus facile |
| mois | Ligne graduée, niveau 2 | plus facile | pressée | 24 | 4 | 4 % | 2 (7, 3 : pas de -4) | L1×1 | 24 | 14 % | plus facile |
| mois | Ligne graduée, niveau 2 | conseillé | appliquée | 38 | 7 | 0 % | 2 (3, 6 : pas de +3) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 2 | conseillé | réelle | 22 | 6 | 5 % | 3 (2, 4, 6 : pas de +2) | L1×1 | 55 | 73 % | conseillé |
| mois | Ligne graduée, niveau 2 | conseillé | pressée | 24 | 7 | 9 % | 2 (4, 8 : pas de +4) | L1×1 | 25 | 10 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus dur | appliquée | 40 | 9 | 0 % | 3 (5, 6, 7 : pas de +1) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 2 | plus dur | réelle | 22 | 6 | 5 % | 3 (9, 6, 3 : pas de -3) | L1×1 | 60 | 76 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus dur | pressée | 24 | 6 | 9 % | 2 (6, 7 : pas de +1) | L1×1 | 29 | 14 % | conseillé |
| mois | Ligne graduée, niveau 2 | très dur | appliquée | 40 | 9 | 0 % | 5 (7, 6, 5, 4, 3 : pas de -1) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 2 | très dur | réelle | 25 | 9 | 4 % | 3 (5, 7, 9 : pas de +2) | L1×1 | 108 | 77 % | très dur |
| mois | Ligne graduée, niveau 2 | très dur | pressée | 27 | 6 | 8 % | 2 (4, 6 : pas de +2) | L1×1 | 34 | 22 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus facile | appliquée | 39 | 14 | 0 % | 3 (18, 13, 8 : pas de -5) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 3 | plus facile | réelle | 25 | 11 | 0 % | 2 (19, 14 : pas de -5) | L1×1 | 40 | 78 % | plus facile |
| mois | Ligne graduée, niveau 3 | plus facile | pressée | 24 | 13 | 0 % | 3 (14, 9, 4 : pas de -5) | L1×1 | 24 | 17 % | plus facile |
| mois | Ligne graduée, niveau 3 | conseillé | appliquée | 38 | 15 | 0 % | 3 (6, 9, 12 : pas de +3) | – | 86 | 100 % | conseillé |
| mois | Ligne graduée, niveau 3 | conseillé | réelle | 24 | 12 | 0 % | 3 (15, 11, 7 : pas de -4) | L1×1 | 53 | 60 % | conseillé |
| mois | Ligne graduée, niveau 3 | conseillé | pressée | 22 | 12 | 0 % | 3 (11, 6, 1 : pas de -5) | L1×1 | 24 | 9 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus dur | appliquée | 38 | 17 | 0 % | 3 (9, 13, 17 : pas de +4) | – | 119 | 100 % | plus dur |
| mois | Ligne graduée, niveau 3 | plus dur | réelle | 25 | 17 | 0 % | 2 (18, 13 : pas de -5) | L1×1 | 81 | 73 % | plus dur |
| mois | Ligne graduée, niveau 3 | plus dur | pressée | 24 | 12 | 0 % | 3 (1, 3, 5 : pas de +2) | L1×1 | 28 | 13 % | conseillé |
| mois | Ligne graduée, niveau 3 | très dur | appliquée | 40 | 18 | 0 % | 3 (3, 8, 13 : pas de +5) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 3 | très dur | réelle | 22 | 13 | 0 % | 2 (4, 3 : pas de -1) | L1×1 | 97 | 77 % | plus dur |
| mois | Ligne graduée, niveau 3 | très dur | pressée | 23 | 13 | 0 % | 2 (15, 7 : pas de -8) | L1×1 | 27 | 13 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus facile | appliquée | 40 | 31 | 0 % | 2 (14, 23 : pas de +9) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 4 | plus facile | réelle | 35 | 25 | 0 % | 2 (79, 87 : pas de +8) | – | 42 | 82 % | plus facile |
| mois | Ligne graduée, niveau 4 | plus facile | pressée | 25 | 16 | 0 % | 2 (73, 81 : pas de +8) | L1×1 | 23 | 12 % | plus facile |
| mois | Ligne graduée, niveau 4 | conseillé | appliquée | 40 | 34 | 0 % | 2 (14, 11 : pas de -3) | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 4 | conseillé | réelle | 23 | 17 | 0 % | 2 (67, 75 : pas de +8) | L1×1 | 58 | 69 % | conseillé |
| mois | Ligne graduée, niveau 4 | conseillé | pressée | 17 | 11 | 0 % | 2 (35, 31 : pas de -4) | L3×1 L1×1 | 29 | 11 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus dur | appliquée | 40 | 24 | 0 % | 2 (35, 36 : pas de +1) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 4 | plus dur | réelle | 31 | 22 | 0 % | 2 (24, 28 : pas de +4) | – | 67 | 84 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus dur | pressée | 22 | 12 | 0 % | 2 (46, 54 : pas de +8) | L3×1 L1×1 | 30 | 20 % | conseillé |
| mois | Ligne graduée, niveau 4 | très dur | appliquée | 40 | 31 | 0 % | 2 (90, 83 : pas de -7) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 4 | très dur | réelle | 20 | 15 | 0 % | 2 (41, 50 : pas de +9) | L1×1 | 80 | 78 % | conseillé |
| mois | Ligne graduée, niveau 4 | très dur | pressée | 18 | 12 | 0 % | 2 (31, 33 : pas de +2) | L3×1 L1×1 | 28 | 10 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus facile | appliquée | 34 | 4 | 0 % | aucune | L2×1 | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 5 | plus facile | réelle | 24 | 4 | 9 % | 2 (90, 90 : même réponse) | L2×1 | 39 | 76 % | plus facile |
| mois | Ligne graduée, niveau 5 | plus facile | pressée | 19 | 4 | 6 % | 2 (70, 70 : même réponse) | L2×1 L1×1 | 24 | 8 % | plus facile |
| mois | Ligne graduée, niveau 5 | conseillé | appliquée | 34 | 8 | 0 % | 2 (70, 60 : pas de -10) | L2×1 | 85 | 100 % | conseillé |
| mois | Ligne graduée, niveau 5 | conseillé | réelle | 20 | 7 | 5 % | 2 (40, 40 : même réponse) | L2×1 L1×1 | 61 | 80 % | conseillé |
| mois | Ligne graduée, niveau 5 | conseillé | pressée | 17 | 7 | 0 % | 2 (40, 30 : pas de -10) | L2×1 L1×1 | 28 | 10 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus dur | appliquée | 34 | 9 | 0 % | 2 (90, 80 : pas de -10) | L2×1 | 116 | 100 % | plus dur |
| mois | Ligne graduée, niveau 5 | plus dur | réelle | 24 | 7 | 0 % | 2 (70, 60 : pas de -10) | L2×1 L1×1 | 70 | 84 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus dur | pressée | 19 | 6 | 0 % | 2 (30, 40 : pas de +10) | L2×1 L1×1 | 30 | 14 % | conseillé |
| mois | Ligne graduée, niveau 5 | très dur | appliquée | 34 | 8 | 0 % | 5 (30, 40, 50, 60, 70 : pas de +10) | L2×1 | 147 | 100 % | très dur |
| mois | Ligne graduée, niveau 5 | très dur | réelle | 28 | 9 | 0 % | 2 (30, 40 : pas de +10) | L2×1 | 120 | 91 % | très dur |
| mois | Ligne graduée, niveau 5 | très dur | pressée | 20 | 6 | 11 % | 2 (60, 70 : pas de +10) | L2×1 L1×1 | 33 | 17 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus facile | appliquée | 40 | 34 | 0 % | 2 (24, 16 : pas de -8) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 6 | plus facile | réelle | 33 | 26 | 3 % | 2 (32, 37 : pas de +5) | – | 40 | 81 % | plus facile |
| mois | Ligne graduée, niveau 6 | plus facile | pressée | 26 | 18 | 0 % | 2 (76, 66 : pas de -10) | L1×1 | 25 | 17 % | plus facile |
| mois | Ligne graduée, niveau 6 | conseillé | appliquée | 40 | 30 | 0 % | 2 (31, 36 : pas de +5) | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 6 | conseillé | réelle | 30 | 24 | 0 % | 2 (33, 43 : pas de +10) | – | 60 | 75 % | conseillé |
| mois | Ligne graduée, niveau 6 | conseillé | pressée | 19 | 13 | 0 % | 2 (74, 66 : pas de -8) | L3×1 L1×1 | 29 | 13 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus dur | appliquée | 39 | 31 | 0 % | 2 (54, 48 : pas de -6) | – | 120 | 100 % | plus dur |
| mois | Ligne graduée, niveau 6 | plus dur | réelle | 23 | 20 | 0 % | 2 (62, 63 : pas de +1) | L3×1 | 64 | 77 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus dur | pressée | 23 | 15 | 0 % | 2 (37, 33 : pas de -4) | L3×1 | 27 | 12 % | conseillé |
| mois | Ligne graduée, niveau 6 | très dur | appliquée | 40 | 33 | 0 % | 3 (36, 37, 38 : pas de +1) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 6 | très dur | réelle | 17 | 15 | 0 % | 2 (41, 47 : pas de +6) | L1×1 L3×1 | 81 | 77 % | plus dur |
| mois | Ligne graduée, niveau 6 | très dur | pressée | 23 | 14 | 0 % | 3 (36, 45, 54 : pas de +9) | L3×1 | 24 | 9 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus facile | appliquée | 40 | 20 | 0 % | 3 (60, 50, 40 : pas de -10) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 7 | plus facile | réelle | 31 | 15 | 3 % | 3 (70, 80, 90 : pas de +10) | – | 40 | 79 % | plus facile |
| mois | Ligne graduée, niveau 7 | plus facile | pressée | 20 | 9 | 0 % | 3 (70, 80, 90 : pas de +10) | L1×1 L2×1 | 29 | 20 % | plus facile |
| mois | Ligne graduée, niveau 7 | conseillé | appliquée | 40 | 23 | 0 % | 2 (95, 85 : pas de -10) | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 7 | conseillé | réelle | 21 | 12 | 0 % | 2 (79, 80 : pas de +1) | L1×1 | 57 | 78 % | conseillé |
| mois | Ligne graduée, niveau 7 | conseillé | pressée | 23 | 14 | 0 % | 2 (90, 80 : pas de -10) | L1×1 L3×1 | 30 | 12 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus dur | appliquée | 40 | 27 | 0 % | 2 (78, 85 : pas de +7) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 7 | plus dur | réelle | 26 | 16 | 0 % | 2 (77, 70 : pas de -7) | L1×1 | 90 | 79 % | plus dur |
| mois | Ligne graduée, niveau 7 | plus dur | pressée | 18 | 10 | 6 % | 2 (80, 90 : pas de +10) | L3×1 L1×1 | 30 | 11 % | conseillé |
| mois | Ligne graduée, niveau 7 | très dur | appliquée | 40 | 21 | 0 % | 2 (50, 60 : pas de +10) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 7 | très dur | réelle | 22 | 13 | 0 % | 3 (70, 80, 90 : pas de +10) | L1×1 | 89 | 77 % | plus dur |
| mois | Ligne graduée, niveau 7 | très dur | pressée | 17 | 11 | 0 % | aucune | L1×1 L3×1 | 30 | 13 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus facile | appliquée | 40 | 11 | 0 % | 3 (10, 20, 30 : pas de +10) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 8 | plus facile | réelle | 32 | 11 | 0 % | 2 (25, 30 : pas de +5) | – | 37 | 77 % | plus facile |
| mois | Ligne graduée, niveau 8 | plus facile | pressée | 28 | 9 | 0 % | 3 (60, 70, 80 : pas de +10) | – | 20 | 12 % | plus facile |
| mois | Ligne graduée, niveau 8 | conseillé | appliquée | 40 | 11 | 0 % | 2 (40, 50 : pas de +10) | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 8 | conseillé | réelle | 28 | 11 | 0 % | 3 (70, 75, 80 : pas de +5) | – | 58 | 74 % | conseillé |
| mois | Ligne graduée, niveau 8 | conseillé | pressée | 27 | 10 | 0 % | 4 (40, 30, 20, 10 : pas de -10) | – | 25 | 10 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus dur | appliquée | 40 | 11 | 0 % | 2 (60, 50 : pas de -10) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 8 | plus dur | réelle | 28 | 9 | 0 % | 3 (30, 40, 50 : pas de +10) | – | 72 | 76 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus dur | pressée | 27 | 9 | 0 % | 3 (70, 60, 50 : pas de -10) | – | 24 | 11 % | conseillé |
| mois | Ligne graduée, niveau 8 | très dur | appliquée | 40 | 11 | 0 % | 2 (90, 80 : pas de -10) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 8 | très dur | réelle | 31 | 11 | 0 % | 4 (60, 70, 80, 90 : pas de +10) | – | 108 | 86 % | plus dur |
| mois | Ligne graduée, niveau 8 | très dur | pressée | 29 | 10 | 0 % | 3 (60, 50, 40 : pas de -10) | – | 23 | 10 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus facile | appliquée | 34 | 4 | 0 % | aucune | L10×1 | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 9 | plus facile | réelle | 20 | 4 | 11 % | 2 (900, 900 : même réponse) | L10×1 L1×1 | 40 | 74 % | plus facile |
| mois | Ligne graduée, niveau 9 | plus facile | pressée | 21 | 4 | 15 % | 2 (100, 100 : même réponse) | L10×1 L1×1 | 26 | 12 % | plus facile |
| mois | Ligne graduée, niveau 9 | conseillé | appliquée | 34 | 8 | 0 % | aucune | L10×1 | 85 | 100 % | conseillé |
| mois | Ligne graduée, niveau 9 | conseillé | réelle | 25 | 8 | 4 % | 2 (200, 200 : même réponse) | L10×1 | 62 | 77 % | conseillé |
| mois | Ligne graduée, niveau 9 | conseillé | pressée | 19 | 8 | 0 % | aucune | L10×1 L1×1 | 26 | 6 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus dur | appliquée | 34 | 9 | 0 % | aucune | L10×1 | 116 | 100 % | plus dur |
| mois | Ligne graduée, niveau 9 | plus dur | réelle | 28 | 8 | 0 % | aucune | L10×1 | 70 | 85 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus dur | pressée | 20 | 8 | 0 % | aucune | L10×1 L1×1 | 27 | 9 % | conseillé |
| mois | Ligne graduée, niveau 9 | très dur | appliquée | 34 | 9 | 0 % | aucune | L10×1 | 147 | 100 % | très dur |
| mois | Ligne graduée, niveau 9 | très dur | réelle | 18 | 9 | 6 % | 2 (500, 500 : même réponse) | L10×1 L1×1 | 65 | 70 % | conseillé |
| mois | Ligne graduée, niveau 9 | très dur | pressée | 20 | 8 | 0 % | aucune | L10×1 L1×1 | 27 | 8 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus facile | appliquée | 39 | 28 | 0 % | aucune | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 10 | plus facile | réelle | 24 | 19 | 0 % | aucune | L1×1 | 38 | 70 % | plus facile |
| mois | Ligne graduée, niveau 10 | plus facile | pressée | 18 | 12 | 0 % | aucune | L10×1 L3×1 | 23 | 8 % | plus facile |
| mois | Ligne graduée, niveau 10 | conseillé | appliquée | 40 | 36 | 0 % | 2 (330, 340 : pas de +10) | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 10 | conseillé | réelle | 25 | 19 | 0 % | aucune | L1×1 | 65 | 84 % | conseillé |
| mois | Ligne graduée, niveau 10 | conseillé | pressée | 19 | 13 | 0 % | aucune | L1×1 L3×1 | 30 | 13 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus dur | appliquée | 40 | 23 | 0 % | 2 (650, 660 : pas de +10) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 10 | plus dur | réelle | 26 | 19 | 0 % | 3 (440, 450, 460 : pas de +10) | L3×1 | 87 | 86 % | plus dur |
| mois | Ligne graduée, niveau 10 | plus dur | pressée | 18 | 12 | 0 % | aucune | L3×1 L1×1 | 34 | 18 % | conseillé |
| mois | Ligne graduée, niveau 10 | très dur | appliquée | 40 | 34 | 0 % | 2 (380, 370 : pas de -10) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 10 | très dur | réelle | 23 | 19 | 0 % | aucune | L1×1 | 59 | 68 % | conseillé |
| mois | Ligne graduée, niveau 10 | très dur | pressée | 19 | 12 | 0 % | aucune | L3×1 L10×1 | 33 | 14 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus facile | appliquée | 40 | 39 | 0 % | 2 (896, 893 : pas de -3) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 11 | plus facile | réelle | 31 | 23 | 3 % | 2 (164, 167 : pas de +3) | – | 40 | 81 % | plus facile |
| mois | Ligne graduée, niveau 11 | plus facile | pressée | 19 | 13 | 0 % | 2 (522, 529 : pas de +7) | L1×1 L3×1 | 26 | 14 % | plus facile |
| mois | Ligne graduée, niveau 11 | conseillé | appliquée | 40 | 39 | 0 % | aucune | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 11 | conseillé | réelle | 22 | 19 | 0 % | 2 (384, 383 : pas de -1) | L1×1 | 51 | 66 % | conseillé |
| mois | Ligne graduée, niveau 11 | conseillé | pressée | 25 | 17 | 0 % | aucune | L3×1 | 29 | 13 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus dur | appliquée | 40 | 37 | 0 % | 2 (239, 236 : pas de -3) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 11 | plus dur | réelle | 23 | 20 | 0 % | 2 (678, 677 : pas de -1) | L1×1 | 78 | 77 % | plus dur |
| mois | Ligne graduée, niveau 11 | plus dur | pressée | 16 | 11 | 0 % | aucune | L10×1 L1×1 L3×1 | 29 | 8 % | conseillé |
| mois | Ligne graduée, niveau 11 | très dur | appliquée | 40 | 38 | 0 % | 2 (175, 167 : pas de -8) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 11 | très dur | réelle | 21 | 16 | 0 % | aucune | L1×1 | 69 | 70 % | conseillé |
| mois | Ligne graduée, niveau 11 | très dur | pressée | 15 | 11 | 0 % | 2 (792, 786 : pas de -6) | L10×1 L1×1 L3×1 | 33 | 13 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus facile | appliquée | 40 | 26 | 0 % | 2 (828, 837 : pas de +9) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 12 | plus facile | réelle | 28 | 17 | 0 % | aucune | – | 36 | 73 % | plus facile |
| mois | Ligne graduée, niveau 12 | plus facile | pressée | 26 | 15 | 0 % | 2 (332, 331 : pas de -1) | – | 17 | 6 % | plus facile |
| mois | Ligne graduée, niveau 12 | conseillé | appliquée | 40 | 34 | 0 % | aucune | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 12 | conseillé | réelle | 30 | 21 | 0 % | aucune | – | 60 | 70 % | conseillé |
| mois | Ligne graduée, niveau 12 | conseillé | pressée | 26 | 15 | 0 % | aucune | – | 19 | 6 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus dur | appliquée | 40 | 33 | 0 % | 2 (941, 940 : pas de -1) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 12 | plus dur | réelle | 23 | 16 | 0 % | 2 (370, 368 : pas de -2) | L10×1 | 76 | 74 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus dur | pressée | 26 | 14 | 0 % | aucune | – | 21 | 8 % | conseillé |
| mois | Ligne graduée, niveau 12 | très dur | appliquée | 40 | 27 | 0 % | 2 (102, 107 : pas de +5) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 12 | très dur | réelle | 27 | 23 | 0 % | 2 (509, 507 : pas de -2) | L10×1 | 114 | 81 % | très dur |
| mois | Ligne graduée, niveau 12 | très dur | pressée | 26 | 14 | 0 % | 2 (408, 415 : pas de +7) | – | 19 | 6 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus facile | appliquée | 40 | 11 | 0 % | aucune | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 13 | plus facile | réelle | 31 | 11 | 0 % | aucune | – | 41 | 81 % | plus facile |
| mois | Ligne graduée, niveau 13 | plus facile | pressée | 28 | 10 | 0 % | aucune | – | 19 | 10 % | plus facile |
| mois | Ligne graduée, niveau 13 | conseillé | appliquée | 40 | 11 | 0 % | aucune | – | 88 | 100 % | conseillé |
| mois | Ligne graduée, niveau 13 | conseillé | réelle | 29 | 11 | 4 % | 2 (250, 250 : même réponse) | – | 60 | 78 % | conseillé |
| mois | Ligne graduée, niveau 13 | conseillé | pressée | 27 | 11 | 0 % | aucune | – | 19 | 6 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus dur | appliquée | 40 | 11 | 0 % | aucune | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 13 | plus dur | réelle | 26 | 11 | 0 % | aucune | – | 72 | 73 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus dur | pressée | 28 | 10 | 0 % | aucune | – | 20 | 7 % | conseillé |
| mois | Ligne graduée, niveau 13 | très dur | appliquée | 40 | 11 | 0 % | aucune | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 13 | très dur | réelle | 30 | 11 | 0 % | aucune | – | 111 | 78 % | très dur |
| mois | Ligne graduée, niveau 13 | très dur | pressée | 26 | 9 | 4 % | 2 (750, 750 : même réponse) | – | 26 | 10 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | appliquée | 24 | 6 | 13 % | 3 (7, 5, 3 : pas de -2) | – | 46 | 100 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | réelle | 18 | 4 | 18 % | 3 (10, 9, 8 : pas de -1) | – | 38 | 74 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | pressée | 19 | 6 | 0 % | 2 (10, 7 : pas de -3) | – | 20 | 12 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | appliquée | 40 | 10 | 0 % | 3 (3, 2, 1 : pas de -1) | – | 88 | 100 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | réelle | 34 | 10 | 3 % | 3 (9, 6, 3 : pas de -3) | – | 65 | 78 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | pressée | 27 | 7 | 8 % | 2 (10, 8 : pas de -2) | – | 19 | 6 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | appliquée | 40 | 10 | 5 % | 3 (7, 6, 5 : pas de -1) | – | 122 | 100 % | plus dur |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | réelle | 32 | 9 | 10 % | 4 (8, 8, 8, 8 : même réponse) | – | 82 | 78 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | pressée | 27 | 8 | 8 % | 2 (10, 8 : pas de -2) | – | 21 | 7 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | appliquée | 40 | 8 | 15 % | 3 (2, 2, 2 : même réponse) | – | 156 | 100 % | très dur |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | réelle | 32 | 9 | 0 % | 4 (9, 8, 7, 6 : pas de -1) | – | 94 | 76 % | plus dur |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | pressée | 29 | 8 | 11 % | 3 (1, 3, 5 : pas de +2) | – | 28 | 12 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | appliquée | 19 | 5 | 0 % | 4 (4, 6, 8, 10 : pas de +2) | L4×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | réelle | 18 | 5 | 0 % | 4 (4, 6, 8, 10 : pas de +2) | L4×1 | 35 | 71 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | pressée | 16 | 5 | 0 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 21 | 8 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | appliquée | 33 | 9 | 3 % | 3 (6, 4, 2 : pas de -2) | L4×1 | 84 | 100 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | réelle | 27 | 8 | 0 % | 3 (2, 5, 8 : pas de +3) | L4×1 | 67 | 83 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | pressée | 22 | 6 | 14 % | 3 (6, 4, 2 : pas de -2) | L4×1 | 21 | 5 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | appliquée | 33 | 9 | 3 % | 3 (4, 3, 2 : pas de -1) | L4×1 | 114 | 100 % | plus dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | réelle | 25 | 8 | 4 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 90 | 79 % | plus dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | pressée | 22 | 7 | 0 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | appliquée | 33 | 7 | 6 % | 3 (1, 2, 3 : pas de +1) | L4×1 | 145 | 100 % | très dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | réelle | 25 | 7 | 0 % | 3 (1, 2, 3 : pas de +1) | L4×1 | 108 | 77 % | très dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | pressée | 21 | 8 | 5 % | 3 (4, 5, 6 : pas de +1) | L4×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus facile | appliquée | 24 | 1 | 100 % | 24 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | – | 46 | 100 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | réelle | 22 | 1 | 100 % | 22 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | – | 35 | 80 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | pressée | 15 | 1 | 100 % | 15 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | L5×1 | 22 | 13 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | conseillé | appliquée | 40 | 10 | 5 % | 3 (4, 7, 10 : pas de +3) | – | 88 | 100 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | réelle | 24 | 7 | 26 % | 3 (10, 10, 10 : même réponse) | L5×1 | 59 | 76 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | pressée | 22 | 5 | 33 % | 3 (10, 10, 10 : même réponse) | L5×1 | 22 | 6 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | appliquée | 40 | 10 | 8 % | 3 (10, 10, 10 : même réponse) | – | 122 | 100 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | plus dur | réelle | 29 | 10 | 7 % | 3 (6, 8, 10 : pas de +2) | L5×1 | 66 | 71 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | pressée | 22 | 5 | 24 % | 2 (10, 10 : même réponse) | L5×1 | 22 | 6 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | très dur | appliquée | 40 | 10 | 15 % | 3 (2, 2, 2 : même réponse) | – | 156 | 100 % | très dur |
| mois | Additions, famille 3 (amis de 10) | très dur | réelle | 21 | 8 | 10 % | 3 (2, 3, 4 : pas de +1) | L5×1 | 91 | 75 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | très dur | pressée | 21 | 7 | 20 % | 3 (8, 5, 2 : pas de -3) | L5×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | appliquée | 19 | 3 | 22 % | 3 (7, 6, 5 : pas de -1) | L6×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | réelle | 16 | 3 | 27 % | 3 (7, 6, 5 : pas de -1) | L6×1 | 36 | 78 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | pressée | 16 | 3 | 27 % | 2 (7, 7 : même réponse) | L6×1 | 21 | 8 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | appliquée | 33 | 7 | 3 % | 2 (7, 3 : pas de -4) | L6×1 | 84 | 100 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | réelle | 24 | 8 | 22 % | 3 (2, 4, 6 : pas de +2) | L6×1 | 59 | 78 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | pressée | 21 | 6 | 15 % | 3 (7, 4, 1 : pas de -3) | L6×1 | 19 | 2 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | appliquée | 33 | 9 | 9 % | 3 (7, 5, 3 : pas de -2) | L6×1 | 114 | 100 % | plus dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | réelle | 27 | 8 | 8 % | 3 (7, 5, 3 : pas de -2) | L6×1 | 79 | 73 % | plus dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | pressée | 21 | 7 | 10 % | 3 (3, 5, 7 : pas de +2) | L6×1 | 19 | 2 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | appliquée | 33 | 7 | 3 % | 3 (1, 4, 7 : pas de +3) | L6×1 | 145 | 100 % | très dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | réelle | 24 | 7 | 22 % | 4 (3, 3, 3, 3 : même réponse) | L6×1 | 91 | 70 % | plus dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | pressée | 21 | 7 | 0 % | 2 (6, 4 : pas de -2) | L6×1 | 24 | 6 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | appliquée | 19 | 2 | 39 % | 5 (9, 9, 9, 9, 9 : même réponse) | L6×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | réelle | 16 | 2 | 67 % | 8 (9, 9, 9, 9, 9, 9, 9, 9 : même réponse) | L6×1 | 35 | 77 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | pressée | 15 | 2 | 36 % | 2 (8, 8 : même réponse) | L6×1 | 20 | 7 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | appliquée | 33 | 10 | 6 % | 2 (8, 4 : pas de -4) | L6×1 | 84 | 100 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | réelle | 24 | 8 | 13 % | 3 (3, 6, 9 : pas de +3) | L6×1 | 58 | 71 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | pressée | 21 | 8 | 5 % | 4 (8, 6, 4, 2 : pas de -2) | L6×1 | 19 | 2 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | appliquée | 33 | 9 | 3 % | 2 (8, 9 : pas de +1) | L6×1 | 114 | 100 % | plus dur |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | réelle | 23 | 8 | 14 % | 3 (8, 8, 8 : même réponse) | L6×1 | 70 | 76 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | pressée | 22 | 6 | 14 % | 3 (7, 4, 1 : pas de -3) | L6×1 | 25 | 10 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | appliquée | 33 | 8 | 9 % | 4 (1, 1, 1, 1 : même réponse) | L6×1 | 145 | 100 % | très dur |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | réelle | 22 | 7 | 14 % | 3 (3, 6, 9 : pas de +3) | L6×1 | 71 | 66 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | pressée | 20 | 6 | 21 % | 3 (8, 8, 8 : même réponse) | L6×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus facile | appliquée | 19 | 4 | 22 % | 3 (7, 5, 3 : pas de -2) | L4×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | plus facile | réelle | 16 | 4 | 20 % | 2 (7, 9 : pas de +2) | L4×1 | 34 | 75 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | plus facile | pressée | 16 | 4 | 13 % | 2 (3, 7 : pas de +4) | L4×1 | 19 | 5 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | conseillé | appliquée | 33 | 9 | 16 % | 3 (4, 3, 2 : pas de -1) | L4×1 | 84 | 100 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | conseillé | réelle | 22 | 7 | 10 % | 3 (3, 2, 1 : pas de -1) | L4×1 | 62 | 80 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | conseillé | pressée | 21 | 8 | 0 % | 2 (3, 4 : pas de +1) | L4×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus dur | appliquée | 33 | 9 | 0 % | 2 (3, 9 : pas de +6) | L4×1 | 114 | 100 % | plus dur |
| mois | Additions, famille 6 (presque-doubles) | plus dur | réelle | 24 | 9 | 9 % | 3 (3, 3, 3 : même réponse) | L4×1 | 85 | 82 % | plus dur |
| mois | Additions, famille 6 (presque-doubles) | plus dur | pressée | 22 | 6 | 14 % | 3 (1, 3, 5 : pas de +2) | L4×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | très dur | appliquée | 33 | 8 | 9 % | 3 (1, 2, 3 : pas de +1) | L4×1 | 145 | 100 % | très dur |
| mois | Additions, famille 6 (presque-doubles) | très dur | réelle | 24 | 7 | 4 % | 3 (3, 4, 5 : pas de +1) | L4×1 | 82 | 74 % | plus dur |
| mois | Additions, famille 6 (presque-doubles) | très dur | pressée | 22 | 8 | 5 % | 2 (7, 3 : pas de -4) | L4×1 | 26 | 10 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus facile | appliquée | 24 | 6 | 17 % | 2 (8, 10 : pas de +2) | – | 46 | 100 % | plus facile |
| mois | Additions, famille 7 (mélange) | plus facile | réelle | 20 | 4 | 26 % | 3 (10, 10, 10 : même réponse) | – | 35 | 80 % | plus facile |
| mois | Additions, famille 7 (mélange) | plus facile | pressée | 19 | 6 | 0 % | 4 (7, 8, 9, 10 : pas de +1) | – | 18 | 9 % | plus facile |
| mois | Additions, famille 7 (mélange) | conseillé | appliquée | 40 | 10 | 8 % | 3 (3, 4, 5 : pas de +1) | – | 88 | 100 % | conseillé |
| mois | Additions, famille 7 (mélange) | conseillé | réelle | 28 | 9 | 4 % | 3 (6, 7, 8 : pas de +1) | – | 62 | 74 % | conseillé |
| mois | Additions, famille 7 (mélange) | conseillé | pressée | 27 | 7 | 15 % | 2 (10, 8 : pas de -2) | – | 20 | 7 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus dur | appliquée | 40 | 10 | 5 % | 2 (8, 10 : pas de +2) | – | 122 | 100 % | plus dur |
| mois | Additions, famille 7 (mélange) | plus dur | réelle | 30 | 10 | 14 % | 2 (7, 7 : même réponse) | – | 88 | 79 % | plus dur |
| mois | Additions, famille 7 (mélange) | plus dur | pressée | 26 | 6 | 16 % | 3 (7, 8, 9 : pas de +1) | – | 20 | 6 % | conseillé |
| mois | Additions, famille 7 (mélange) | très dur | appliquée | 40 | 9 | 8 % | 3 (10, 8, 6 : pas de -2) | – | 156 | 100 % | très dur |
| mois | Additions, famille 7 (mélange) | très dur | réelle | 32 | 8 | 16 % | 3 (2, 3, 4 : pas de +1) | – | 111 | 79 % | très dur |
| mois | Additions, famille 7 (mélange) | très dur | pressée | 27 | 7 | 8 % | 3 (9, 8, 7 : pas de -1) | – | 18 | 4 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | appliquée | 29 | 26 | 0 % | 2 (14, 24 : pas de +10) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | réelle | 21 | 12 | 5 % | 2 (79, 84 : pas de +5) | – | 36 | 72 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | pressée | 19 | 10 | 0 % | 2 (82, 75 : pas de -7) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | appliquée | 43 | 35 | 0 % | 2 (66, 71 : pas de +5) | – | 91 | 100 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | réelle | 27 | 19 | 0 % | 2 (70, 69 : pas de -1) | – | 54 | 64 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | pressée | 22 | 12 | 0 % | 2 (40, 41 : pas de +1) | – | 20 | 6 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | appliquée | 43 | 35 | 2 % | 2 (51, 45 : pas de -6) | – | 126 | 100 % | plus dur |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | réelle | 30 | 25 | 0 % | 2 (22, 29 : pas de +7) | – | 65 | 76 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | pressée | 22 | 11 | 0 % | 2 (65, 69 : pas de +4) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | appliquée | 42 | 2 | 51 % | 5 (1, 1, 1, 1, 1 : même réponse) | – | 160 | 100 % | très dur |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | réelle | 33 | 2 | 66 % | 6 (1, 1, 1, 1, 1, 1 : même réponse) | – | 129 | 88 % | très dur |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | pressée | 22 | 12 | 0 % | 2 (89, 96 : pas de +7) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | appliquée | 29 | 25 | 4 % | 2 (24, 15 : pas de -9) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | réelle | 23 | 17 | 0 % | 2 (49, 54 : pas de +5) | – | 37 | 78 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | pressée | 19 | 10 | 0 % | 2 (68, 62 : pas de -6) | – | 15 | 2 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | appliquée | 43 | 33 | 0 % | 2 (67, 73 : pas de +6) | – | 91 | 100 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | réelle | 33 | 26 | 0 % | 2 (48, 52 : pas de +4) | – | 71 | 90 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | pressée | 22 | 12 | 0 % | 2 (7, 11 : pas de +4) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | appliquée | 43 | 36 | 0 % | 2 (15, 25 : pas de +10) | – | 126 | 100 % | plus dur |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | réelle | 30 | 25 | 0 % | 2 (78, 77 : pas de -1) | – | 74 | 79 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | pressée | 22 | 11 | 0 % | 2 (84, 82 : pas de -2) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | appliquée | 43 | 1 | 100 % | 43 (10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 : même réponse) | – | 162 | 100 % | très dur |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | réelle | 31 | 25 | 0 % | 2 (56, 61 : pas de +5) | – | 98 | 75 % | plus dur |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | pressée | 22 | 12 | 0 % | 2 (33, 40 : pas de +7) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | appliquée | 29 | 26 | 0 % | 2 (55, 53 : pas de -2) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | réelle | 13 | 8 | 0 % | 2 (56, 54 : pas de -2) | L7×1 | 35 | 75 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | pressée | 19 | 10 | 0 % | 2 (7, 9 : pas de +2) | – | 17 | 6 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | appliquée | 43 | 33 | 2 % | 2 (13, 23 : pas de +10) | – | 91 | 100 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | réelle | 30 | 21 | 0 % | 2 (87, 82 : pas de -5) | – | 64 | 78 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | pressée | 18 | 10 | 0 % | 2 (12, 21 : pas de +9) | L7×1 | 19 | 2 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | appliquée | 43 | 36 | 2 % | 2 (85, 87 : pas de +2) | – | 126 | 100 % | plus dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | réelle | 29 | 22 | 0 % | 2 (24, 18 : pas de -6) | – | 74 | 75 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | pressée | 22 | 12 | 0 % | 2 (4, 5 : pas de +1) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | appliquée | 41 | 7 | 15 % | 3 (50, 40, 30 : pas de -10) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | réelle | 30 | 7 | 21 % | 4 (20, 30, 40, 50 : pas de +10) | – | 127 | 84 % | très dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | pressée | 22 | 12 | 0 % | 2 (63, 54 : pas de -9) | – | 19 | 5 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | appliquée | 30 | 24 | 0 % | 2 (97, 88 : pas de -9) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | réelle | 24 | 17 | 0 % | 3 (18, 27, 36 : pas de +9) | – | 35 | 73 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | pressée | 20 | 11 | 0 % | 2 (19, 18 : pas de -1) | – | 17 | 6 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | appliquée | 43 | 30 | 5 % | 2 (98, 94 : pas de -4) | – | 91 | 100 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | réelle | 29 | 18 | 7 % | 2 (27, 17 : pas de -10) | – | 62 | 75 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | pressée | 22 | 11 | 0 % | 2 (79, 88 : pas de +9) | – | 19 | 4 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | appliquée | 41 | 29 | 5 % | 2 (69, 66 : pas de -3) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | réelle | 25 | 14 | 0 % | 2 (38, 48 : pas de +10) | – | 61 | 73 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | pressée | 22 | 13 | 0 % | 2 (66, 69 : pas de +3) | – | 19 | 6 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | appliquée | 43 | 6 | 21 % | 3 (5, 4, 3 : pas de -1) | – | 162 | 100 % | très dur |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | réelle | 29 | 11 | 11 % | 2 (4, 3 : pas de -1) | – | 97 | 74 % | plus dur |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | pressée | 23 | 12 | 5 % | 2 (19, 19 : même réponse) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | appliquée | 30 | 25 | 0 % | 2 (44, 51 : pas de +7) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | réelle | 24 | 17 | 0 % | 2 (72, 62 : pas de -10) | – | 36 | 80 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | pressée | 19 | 11 | 6 % | 2 (70, 74 : pas de +4) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | appliquée | 41 | 30 | 3 % | 2 (32, 30 : pas de -2) | – | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | réelle | 29 | 23 | 0 % | 2 (53, 62 : pas de +9) | – | 65 | 80 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | pressée | 22 | 12 | 0 % | 2 (31, 21 : pas de -10) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | appliquée | 42 | 31 | 10 % | 2 (24, 30 : pas de +6) | – | 125 | 100 % | plus dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | réelle | 28 | 19 | 0 % | 3 (24, 23, 22 : pas de -1) | – | 70 | 72 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | pressée | 22 | 12 | 0 % | 2 (72, 63 : pas de -9) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | appliquée | 40 | 6 | 13 % | 3 (5, 5, 5 : même réponse) | – | 156 | 100 % | très dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | réelle | 29 | 21 | 0 % | 2 (45, 41 : pas de -4) | – | 76 | 76 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | pressée | 22 | 13 | 0 % | 2 (41, 33 : pas de -8) | – | 23 | 6 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | appliquée | 29 | 24 | 0 % | 2 (37, 33 : pas de -4) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | réelle | 22 | 19 | 0 % | 2 (65, 62 : pas de -3) | – | 32 | 67 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | pressée | 19 | 12 | 0 % | 2 (37, 34 : pas de -3) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | appliquée | 41 | 35 | 0 % | 2 (85, 81 : pas de -4) | – | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | réelle | 21 | 16 | 0 % | 2 (74, 84 : pas de +10) | L9×1 | 60 | 75 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | pressée | 19 | 12 | 0 % | 2 (62, 52 : pas de -10) | L8×1 | 21 | 3 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | appliquée | 41 | 36 | 0 % | 2 (76, 81 : pas de +5) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | réelle | 18 | 13 | 0 % | 2 (72, 68 : pas de -4) | L8×1 | 56 | 57 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | pressée | 18 | 12 | 0 % | 2 (34, 32 : pas de -2) | L8×1 | 20 | 3 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | appliquée | 43 | 1 | 100 % | 43 (9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9 : même réponse) | – | 162 | 100 % | très dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | réelle | 25 | 22 | 0 % | 2 (63, 57 : pas de -6) | L9×1 | 62 | 66 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | pressée | 18 | 12 | 0 % | 2 (92, 90 : pas de -2) | L8×1 | 20 | 2 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | appliquée | 23 | 21 | 0 % | 2 (25, 32 : pas de +7) | L9×1 | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | réelle | 18 | 13 | 12 % | 2 (91, 91 : même réponse) | L9×1 | 35 | 79 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | pressée | 16 | 9 | 0 % | 2 (45, 41 : pas de -4) | L9×1 | 19 | 2 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | appliquée | 33 | 22 | 0 % | 3 (22, 32, 42 : pas de +10) | L9×1 | 84 | 100 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | réelle | 24 | 15 | 0 % | 2 (56, 61 : pas de +5) | L9×1 | 59 | 80 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | pressée | 19 | 11 | 0 % | 2 (43, 52 : pas de +9) | L9×1 | 20 | 2 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | appliquée | 33 | 26 | 0 % | 2 (32, 33 : pas de +1) | L9×1 | 114 | 100 % | plus dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | réelle | 18 | 14 | 0 % | 2 (25, 35 : pas de +10) | L9×1 | 54 | 61 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | pressée | 19 | 11 | 6 % | 2 (52, 62 : pas de +10) | L9×1 | 20 | 2 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | appliquée | 34 | 6 | 18 % | 4 (7, 6, 5, 4 : pas de -1) | L9×1 | 147 | 100 % | très dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | réelle | 24 | 18 | 0 % | 2 (73, 72 : pas de -1) | L9×1 | 87 | 80 % | plus dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | pressée | 18 | 10 | 0 % | 2 (33, 31 : pas de -2) | L9×1 | 24 | 6 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | appliquée | 29 | 20 | 4 % | 3 (98, 97, 96 : pas de -1) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | réelle | 22 | 14 | 5 % | 2 (86, 94 : pas de +8) | – | 36 | 78 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | pressée | 20 | 10 | 0 % | 2 (42, 37 : pas de -5) | – | 18 | 8 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | appliquée | 41 | 27 | 8 % | 2 (57, 48 : pas de -9) | – | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | réelle | 24 | 19 | 0 % | 2 (98, 99 : pas de +1) | L7×1 | 67 | 88 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | pressée | 22 | 11 | 5 % | 2 (75, 75 : même réponse) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | appliquée | 41 | 24 | 3 % | 2 (79, 76 : pas de -3) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | réelle | 22 | 16 | 5 % | 2 (86, 78 : pas de -8) | L7×1 | 71 | 83 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | pressée | 22 | 12 | 10 % | 2 (66, 72 : pas de +6) | – | 20 | 6 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | appliquée | 43 | 22 | 2 % | 2 (44, 34 : pas de -10) | – | 162 | 100 % | très dur |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | réelle | 27 | 19 | 0 % | 2 (87, 84 : pas de -3) | – | 74 | 75 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | pressée | 23 | 14 | 0 % | 2 (89, 95 : pas de +6) | – | 18 | 3 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | appliquée | 29 | 21 | 4 % | 2 (57, 48 : pas de -9) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | réelle | 20 | 13 | 5 % | 2 (18, 15 : pas de -3) | – | 35 | 78 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | pressée | 19 | 11 | 0 % | 2 (33, 29 : pas de -4) | – | 17 | 5 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | appliquée | 41 | 26 | 5 % | 2 (39, 47 : pas de +8) | – | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | réelle | 25 | 18 | 0 % | 2 (78, 88 : pas de +10) | – | 60 | 73 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | pressée | 22 | 12 | 5 % | 2 (79, 79 : même réponse) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | appliquée | 41 | 28 | 3 % | 2 (49, 58 : pas de +9) | – | 123 | 100 % | plus dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | réelle | 26 | 16 | 0 % | 2 (39, 49 : pas de +10) | – | 53 | 63 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | pressée | 22 | 10 | 5 % | 2 (59, 49 : pas de -10) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | appliquée | 41 | 29 | 3 % | 2 (28, 18 : pas de -10) | – | 158 | 100 % | très dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | réelle | 26 | 17 | 0 % | 3 (16, 17, 18 : pas de +1) | – | 89 | 75 % | plus dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | pressée | 22 | 12 | 5 % | 2 (48, 38 : pas de -10) | – | 21 | 7 % | conseillé |
