# Partie B · synthèse des séquences

Une ligne par séance simulée (base × exercice × cran × comportement). Mesures sur la notion du jour. Le détail de chaque séance est dans `neuve/` et `mois/`, un fichier par exercice et niveau (ou famille).

Comportements : **appliquée** : tout juste, 4 s par réponse ; **réelle** : 25 % d'erreurs (dont 1 sur 5 en « je ne sais pas »), 5 s par réponse ; **pressée** : réponses au hasard, 1 s par réponse. Durées hors réponse (voix, animations) estimées : consigne 3 s, bravo 1,5 s, correction 11 s (14 s au calcul rapide), exemple guidé 12 s, leçon 75 s ; elles ne servent qu'au plafond de 12 minutes.

Limites : la voix est reconstituée à partir de `app/content/textes.json` avec la même logique que les écrans (une variante tirée au hasard, comme l'application) ; les pièges proposés par l'enfant « réelle » sont les erreurs types quand il y en a (bulles-pièges, symétrique, dizaines/unités, C1 à C5), sinon ± 1 ; l'aide du coquillage n'est jamais demandée ; « un mois » : la sauvegarde `sauvegarde-un-mois.json` (fabriquée le jour du lancement), la séance jouée le jour même à 18 h.

## Étoiles : pressée comparée à appliquée

### Base neuve

| exercice | cran | appliquée | réelle | pressée | pressée / appliquée |
| --- | --- | --- | --- | --- | --- |
| Ligne graduée, niveau 1 | plus facile | 33 | 29 | 21 | 64 % |
| Ligne graduée, niveau 1 | conseillé | 56 | 48 | 25 | 45 % |
| Ligne graduée, niveau 1 | plus dur | 77 | 48 | 26 | 34 % |
| Ligne graduée, niveau 1 | très dur | 99 | 53 | 35 | 35 % |
| Ligne graduée, niveau 2 | plus facile | 31 | 28 | 15 | 48 % |
| Ligne graduée, niveau 2 | conseillé | 59 | 47 | 19 | 32 % |
| Ligne graduée, niveau 2 | plus dur | 83 | 46 | 28 | 34 % |
| Ligne graduée, niveau 2 | très dur | 82 | 77 | 28 | 34 % |
| Ligne graduée, niveau 3 | plus facile | 33 | 27 | 16 | 48 % |
| Ligne graduée, niveau 3 | conseillé | 59 | 51 | 23 | 39 % |
| Ligne graduée, niveau 3 | plus dur | 83 | 52 | 21 | 25 % |
| Ligne graduée, niveau 3 | très dur | 108 | 79 | 25 | 23 % |
| Ligne graduée, niveau 4 | plus facile | 33 | 30 | 20 | 61 % |
| Ligne graduée, niveau 4 | conseillé | 56 | 43 | 25 | 45 % |
| Ligne graduée, niveau 4 | plus dur | 77 | 62 | 18 | 23 % |
| Ligne graduée, niveau 4 | très dur | 99 | 85 | 24 | 24 % |
| Ligne graduée, niveau 5 | plus facile | 33 | 31 | 20 | 61 % |
| Ligne graduée, niveau 5 | conseillé | 56 | 50 | 21 | 38 % |
| Ligne graduée, niveau 5 | plus dur | 77 | 59 | 22 | 29 % |
| Ligne graduée, niveau 5 | très dur | 85 | 54 | 26 | 31 % |
| Ligne graduée, niveau 6 | plus facile | 33 | 26 | 19 | 58 % |
| Ligne graduée, niveau 6 | conseillé | 58 | 50 | 21 | 36 % |
| Ligne graduée, niveau 6 | plus dur | 83 | 71 | 23 | 28 % |
| Ligne graduée, niveau 6 | très dur | 104 | 83 | 24 | 23 % |
| Ligne graduée, niveau 7 | plus facile | 33 | 28 | 22 | 67 % |
| Ligne graduée, niveau 7 | conseillé | 59 | 48 | 26 | 44 % |
| Ligne graduée, niveau 7 | plus dur | 83 | 56 | 25 | 30 % |
| Ligne graduée, niveau 7 | très dur | 108 | 65 | 26 | 24 % |
| Ligne graduée, niveau 8 | plus facile | 29 | 25 | 17 | 59 % |
| Ligne graduée, niveau 8 | conseillé | 52 | 50 | 17 | 33 % |
| Ligne graduée, niveau 8 | plus dur | 73 | 50 | 17 | 23 % |
| Ligne graduée, niveau 8 | très dur | 94 | 77 | 20 | 21 % |
| Ligne graduée, niveau 9 | plus facile | 33 | 28 | 18 | 55 % |
| Ligne graduée, niveau 9 | conseillé | 56 | 49 | 20 | 36 % |
| Ligne graduée, niveau 9 | plus dur | 77 | 70 | 21 | 27 % |
| Ligne graduée, niveau 9 | très dur | 85 | 61 | 24 | 28 % |
| Ligne graduée, niveau 10 | plus facile | 33 | 34 | 19 | 58 % |
| Ligne graduée, niveau 10 | conseillé | 58 | 45 | 25 | 43 % |
| Ligne graduée, niveau 10 | plus dur | 82 | 59 | 26 | 32 % |
| Ligne graduée, niveau 10 | très dur | 108 | 76 | 24 | 22 % |
| Ligne graduée, niveau 11 | plus facile | 33 | 25 | 18 | 55 % |
| Ligne graduée, niveau 11 | conseillé | 57 | 46 | 20 | 35 % |
| Ligne graduée, niveau 11 | plus dur | 82 | 54 | 21 | 26 % |
| Ligne graduée, niveau 11 | très dur | 108 | 61 | 21 | 19 % |
| Ligne graduée, niveau 12 | plus facile | 32 | 27 | 11 | 34 % |
| Ligne graduée, niveau 12 | conseillé | 57 | 46 | 13 | 23 % |
| Ligne graduée, niveau 12 | plus dur | 83 | 51 | 16 | 19 % |
| Ligne graduée, niveau 12 | très dur | 108 | 86 | 14 | 13 % |
| Ligne graduée, niveau 13 | plus facile | 29 | 29 | 16 | 55 % |
| Ligne graduée, niveau 13 | conseillé | 52 | 53 | 17 | 33 % |
| Ligne graduée, niveau 13 | plus dur | 73 | 73 | 17 | 23 % |
| Ligne graduée, niveau 13 | très dur | 94 | 94 | 16 | 17 % |
| Additions, famille 1 (+ 1 et + 2) | plus facile | 25 | 26 | 11 | 44 % |
| Additions, famille 1 (+ 1 et + 2) | conseillé | 59 | 48 | 18 | 31 % |
| Additions, famille 1 (+ 1 et + 2) | plus dur | 83 | 43 | 14 | 17 % |
| Additions, famille 1 (+ 1 et + 2) | très dur | 108 | 78 | 15 | 14 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus facile | 25 | 25 | 14 | 56 % |
| Additions, famille 2 (doubles jusqu'à 5) | conseillé | 54 | 46 | 17 | 31 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus dur | 76 | 50 | 14 | 18 % |
| Additions, famille 2 (doubles jusqu'à 5) | très dur | 91 | 69 | 19 | 21 % |
| Additions, famille 3 (amis de 10) | plus facile | 25 | 23 | 14 | 56 % |
| Additions, famille 3 (amis de 10) | conseillé | 55 | 45 | 16 | 29 % |
| Additions, famille 3 (amis de 10) | plus dur | 76 | 53 | 16 | 21 % |
| Additions, famille 3 (amis de 10) | très dur | 97 | 57 | 16 | 16 % |
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
| Additions, famille 7 (mélange) | conseillé | 59 | 49 | 13 | 22 % |
| Additions, famille 7 (mélange) | plus dur | 83 | 67 | 13 | 16 % |
| Additions, famille 7 (mélange) | très dur | 108 | 63 | 12 | 11 % |
| Additions, famille 8 (dix et quelques) | plus facile | 25 | 25 | 13 | 52 % |
| Additions, famille 8 (dix et quelques) | conseillé | 55 | 49 | 15 | 27 % |
| Additions, famille 8 (dix et quelques) | plus dur | 76 | 48 | 17 | 22 % |
| Additions, famille 8 (dix et quelques) | très dur | 97 | 61 | 14 | 14 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | 25 | 22 | 14 | 56 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | 55 | 54 | 16 | 29 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | 76 | 55 | 14 | 18 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | 97 | 74 | 14 | 14 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | 25 | 22 | 14 | 56 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | 55 | 40 | 18 | 33 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | 76 | 53 | 15 | 20 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | 97 | 74 | 19 | 20 % |
| Additions, famille 11 (+ 9) | plus facile | 25 | 28 | 14 | 56 % |
| Additions, famille 11 (+ 9) | conseillé | 55 | 42 | 16 | 29 % |
| Additions, famille 11 (+ 9) | plus dur | 76 | 50 | 16 | 21 % |
| Additions, famille 11 (+ 9) | très dur | 97 | 77 | 15 | 15 % |
| Additions, famille 12 (passer la dizaine) | plus facile | 25 | 26 | 14 | 56 % |
| Additions, famille 12 (passer la dizaine) | conseillé | 55 | 43 | 14 | 25 % |
| Additions, famille 12 (passer la dizaine) | plus dur | 76 | 61 | 15 | 20 % |
| Additions, famille 12 (passer la dizaine) | très dur | 97 | 69 | 20 | 21 % |
| Additions, famille 13 (grand mélange) | plus facile | 25 | 26 | 12 | 48 % |
| Additions, famille 13 (grand mélange) | conseillé | 59 | 42 | 14 | 24 % |
| Additions, famille 13 (grand mélange) | plus dur | 83 | 54 | 14 | 17 % |
| Additions, famille 13 (grand mélange) | très dur | 108 | 82 | 17 | 16 % |
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
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | 27 | 26 | 14 | 52 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | 55 | 41 | 13 | 24 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | 76 | 53 | 14 | 18 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | 99 | 59 | 13 | 13 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | 27 | 21 | 11 | 41 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | 60 | 49 | 10 | 17 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | 85 | 46 | 10 | 12 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | 114 | 39 | 11 | 10 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 27 | 24 | 11 | 41 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 60 | 42 | 14 | 23 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 83 | 40 | 12 | 14 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 112 | 59 | 11 | 10 % |
| Multiplication, niveau 1 (groupes) | plus facile | 32 | 30 | 13 | 41 % |
| Multiplication, niveau 1 (groupes) | conseillé | 55 | 43 | 14 | 25 % |
| Multiplication, niveau 1 (groupes) | plus dur | 76 | 53 | 14 | 18 % |
| Multiplication, niveau 1 (groupes) | très dur | 97 | 72 | 14 | 14 % |
| Multiplication, niveau 2 (groupes) | plus facile | 33 | 31 | 10 | 30 % |
| Multiplication, niveau 2 (groupes) | conseillé | 60 | 39 | 12 | 20 % |
| Multiplication, niveau 2 (groupes) | plus dur | 85 | 56 | 13 | 15 % |
| Multiplication, niveau 2 (groupes) | très dur | 110 | 79 | 11 | 10 % |
| Multiplication, niveau 3 (table 2) | plus facile | 25 | 23 | 10 | 40 % |
| Multiplication, niveau 3 (table 2) | conseillé | 60 | 44 | 11 | 18 % |
| Multiplication, niveau 3 (table 2) | plus dur | 85 | 65 | 12 | 14 % |
| Multiplication, niveau 3 (table 2) | très dur | 110 | 86 | 18 | 16 % |
| Multiplication, niveau 4 (table 10) | plus facile | 25 | 25 | 11 | 44 % |
| Multiplication, niveau 4 (table 10) | conseillé | 60 | 44 | 13 | 22 % |
| Multiplication, niveau 4 (table 10) | plus dur | 85 | 58 | 15 | 18 % |
| Multiplication, niveau 4 (table 10) | très dur | 110 | 70 | 14 | 13 % |
| Multiplication, niveau 5 (table 5) | plus facile | 25 | 25 | 11 | 44 % |
| Multiplication, niveau 5 (table 5) | conseillé | 60 | 45 | 11 | 18 % |
| Multiplication, niveau 5 (table 5) | plus dur | 85 | 56 | 15 | 18 % |
| Multiplication, niveau 5 (table 5) | très dur | 110 | 57 | 11 | 10 % |
| Multiplication, niveau 6 (tourner) | plus facile | 25 | 24 | 13 | 52 % |
| Multiplication, niveau 6 (tourner) | conseillé | 55 | 42 | 16 | 29 % |
| Multiplication, niveau 6 (tourner) | plus dur | 76 | 42 | 15 | 20 % |
| Multiplication, niveau 6 (tourner) | très dur | 97 | 79 | 18 | 19 % |
| Multiplication, niveau 7 (table 3) | plus facile | 25 | 24 | 10 | 40 % |
| Multiplication, niveau 7 (table 3) | conseillé | 60 | 50 | 11 | 18 % |
| Multiplication, niveau 7 (table 3) | plus dur | 85 | 48 | 11 | 13 % |
| Multiplication, niveau 7 (table 3) | très dur | 110 | 82 | 13 | 12 % |
| Multiplication, niveau 8 (table 4) | plus facile | 25 | 25 | 11 | 44 % |
| Multiplication, niveau 8 (table 4) | conseillé | 60 | 40 | 11 | 18 % |
| Multiplication, niveau 8 (table 4) | plus dur | 85 | 54 | 11 | 13 % |
| Multiplication, niveau 8 (table 4) | très dur | 110 | 52 | 15 | 14 % |
| Multiplication, niveau 9 (tables) | plus facile | 25 | 26 | 10 | 40 % |
| Multiplication, niveau 9 (tables) | conseillé | 60 | 43 | 11 | 18 % |
| Multiplication, niveau 9 (tables) | plus dur | 85 | 74 | 11 | 13 % |
| Multiplication, niveau 9 (tables) | très dur | 110 | 72 | 11 | 10 % |
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
| Ligne graduée, niveau 1 | plus facile | 54 | 38 | 33 | 61 % |
| Ligne graduée, niveau 1 | conseillé | 93 | 68 | 38 | 41 % |
| Ligne graduée, niveau 1 | plus dur | 125 | 62 | 38 | 30 % |
| Ligne graduée, niveau 1 | très dur | 156 | 96 | 33 | 21 % |
| Ligne graduée, niveau 2 | plus facile | 53 | 38 | 20 | 38 % |
| Ligne graduée, niveau 2 | conseillé | 90 | 62 | 33 | 37 % |
| Ligne graduée, niveau 2 | plus dur | 126 | 55 | 30 | 24 % |
| Ligne graduée, niveau 2 | très dur | 130 | 104 | 26 | 20 % |
| Ligne graduée, niveau 3 | plus facile | 55 | 43 | 21 | 38 % |
| Ligne graduée, niveau 3 | conseillé | 90 | 57 | 27 | 30 % |
| Ligne graduée, niveau 3 | plus dur | 125 | 69 | 31 | 25 % |
| Ligne graduée, niveau 3 | très dur | 156 | 83 | 25 | 16 % |
| Ligne graduée, niveau 4 | plus facile | 53 | 41 | 24 | 45 % |
| Ligne graduée, niveau 4 | conseillé | 90 | 66 | 29 | 32 % |
| Ligne graduée, niveau 4 | plus dur | 122 | 84 | 29 | 24 % |
| Ligne graduée, niveau 4 | très dur | 160 | 120 | 25 | 16 % |
| Ligne graduée, niveau 5 | plus facile | 53 | 40 | 24 | 45 % |
| Ligne graduée, niveau 5 | conseillé | 90 | 66 | 25 | 28 % |
| Ligne graduée, niveau 5 | plus dur | 122 | 64 | 31 | 25 % |
| Ligne graduée, niveau 5 | très dur | 135 | 118 | 27 | 20 % |
| Ligne graduée, niveau 6 | plus facile | 55 | 38 | 25 | 45 % |
| Ligne graduée, niveau 6 | conseillé | 92 | 60 | 34 | 37 % |
| Ligne graduée, niveau 6 | plus dur | 125 | 59 | 28 | 22 % |
| Ligne graduée, niveau 6 | très dur | 156 | 90 | 32 | 21 % |
| Ligne graduée, niveau 7 | plus facile | 55 | 37 | 27 | 49 % |
| Ligne graduée, niveau 7 | conseillé | 91 | 57 | 30 | 33 % |
| Ligne graduée, niveau 7 | plus dur | 122 | 70 | 31 | 25 % |
| Ligne graduée, niveau 7 | très dur | 160 | 114 | 34 | 21 % |
| Ligne graduée, niveau 8 | plus facile | 51 | 39 | 20 | 39 % |
| Ligne graduée, niveau 8 | conseillé | 84 | 72 | 24 | 29 % |
| Ligne graduée, niveau 8 | plus dur | 113 | 84 | 22 | 19 % |
| Ligne graduée, niveau 8 | très dur | 144 | 88 | 19 | 13 % |
| Ligne graduée, niveau 9 | plus facile | 53 | 39 | 24 | 45 % |
| Ligne graduée, niveau 9 | conseillé | 87 | 60 | 28 | 32 % |
| Ligne graduée, niveau 9 | plus dur | 117 | 76 | 26 | 22 % |
| Ligne graduée, niveau 9 | très dur | 133 | 88 | 30 | 23 % |
| Ligne graduée, niveau 10 | plus facile | 52 | 36 | 27 | 52 % |
| Ligne graduée, niveau 10 | conseillé | 89 | 68 | 31 | 35 % |
| Ligne graduée, niveau 10 | plus dur | 126 | 72 | 34 | 27 % |
| Ligne graduée, niveau 10 | très dur | 152 | 119 | 30 | 20 % |
| Ligne graduée, niveau 11 | plus facile | 53 | 39 | 25 | 47 % |
| Ligne graduée, niveau 11 | conseillé | 90 | 59 | 33 | 37 % |
| Ligne graduée, niveau 11 | plus dur | 126 | 71 | 31 | 25 % |
| Ligne graduée, niveau 11 | très dur | 164 | 106 | 27 | 16 % |
| Ligne graduée, niveau 12 | plus facile | 55 | 38 | 17 | 31 % |
| Ligne graduée, niveau 12 | conseillé | 90 | 66 | 18 | 20 % |
| Ligne graduée, niveau 12 | plus dur | 126 | 60 | 18 | 14 % |
| Ligne graduée, niveau 12 | très dur | 156 | 104 | 21 | 13 % |
| Ligne graduée, niveau 13 | plus facile | 51 | 40 | 21 | 41 % |
| Ligne graduée, niveau 13 | conseillé | 84 | 57 | 21 | 25 % |
| Ligne graduée, niveau 13 | plus dur | 113 | 72 | 21 | 19 % |
| Ligne graduée, niveau 13 | très dur | 142 | 100 | 21 | 15 % |
| Additions, famille 1 (+ 1 et + 2) | plus facile | 45 | 32 | 19 | 42 % |
| Additions, famille 1 (+ 1 et + 2) | conseillé | 93 | 66 | 26 | 28 % |
| Additions, famille 1 (+ 1 et + 2) | plus dur | 122 | 93 | 19 | 16 % |
| Additions, famille 1 (+ 1 et + 2) | très dur | 162 | 83 | 21 | 13 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus facile | 45 | 32 | 21 | 47 % |
| Additions, famille 2 (doubles jusqu'à 5) | conseillé | 85 | 63 | 27 | 32 % |
| Additions, famille 2 (doubles jusqu'à 5) | plus dur | 116 | 83 | 23 | 20 % |
| Additions, famille 2 (doubles jusqu'à 5) | très dur | 149 | 74 | 25 | 17 % |
| Additions, famille 3 (amis de 10) | plus facile | 46 | 36 | 20 | 43 % |
| Additions, famille 3 (amis de 10) | conseillé | 92 | 53 | 27 | 29 % |
| Additions, famille 3 (amis de 10) | plus dur | 126 | 57 | 26 | 21 % |
| Additions, famille 3 (amis de 10) | très dur | 156 | 89 | 23 | 15 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | 45 | 36 | 21 | 47 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | 86 | 65 | 21 | 24 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | 114 | 52 | 23 | 20 % |
| Additions, famille 4 (maisons de 5, 6 et 7) | très dur | 151 | 65 | 23 | 15 % |
| Additions, famille 5 (maisons de 8 et 9) | plus facile | 47 | 37 | 18 | 38 % |
| Additions, famille 5 (maisons de 8 et 9) | conseillé | 86 | 61 | 19 | 22 % |
| Additions, famille 5 (maisons de 8 et 9) | plus dur | 116 | 76 | 23 | 20 % |
| Additions, famille 5 (maisons de 8 et 9) | très dur | 151 | 65 | 26 | 17 % |
| Additions, famille 6 (presque-doubles) | plus facile | 46 | 34 | 20 | 43 % |
| Additions, famille 6 (presque-doubles) | conseillé | 89 | 49 | 20 | 22 % |
| Additions, famille 6 (presque-doubles) | plus dur | 114 | 71 | 22 | 19 % |
| Additions, famille 6 (presque-doubles) | très dur | 147 | 104 | 21 | 14 % |
| Additions, famille 7 (mélange) | plus facile | 45 | 34 | 17 | 38 % |
| Additions, famille 7 (mélange) | conseillé | 92 | 62 | 26 | 28 % |
| Additions, famille 7 (mélange) | plus dur | 122 | 66 | 23 | 19 % |
| Additions, famille 7 (mélange) | très dur | 164 | 74 | 20 | 12 % |
| Additions, famille 8 (dix et quelques) | plus facile | 45 | 36 | 19 | 42 % |
| Additions, famille 8 (dix et quelques) | conseillé | 85 | 52 | 22 | 26 % |
| Additions, famille 8 (dix et quelques) | plus dur | 114 | 87 | 24 | 21 % |
| Additions, famille 8 (dix et quelques) | très dur | 145 | 73 | 23 | 16 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | 46 | 32 | 20 | 43 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | 88 | 55 | 21 | 24 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | 116 | 59 | 20 | 17 % |
| Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | 145 | 102 | 22 | 15 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | 47 | 35 | 19 | 40 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | 86 | 65 | 24 | 28 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | 117 | 51 | 20 | 17 % |
| Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | 151 | 95 | 24 | 16 % |
| Additions, famille 11 (+ 9) | plus facile | 47 | 34 | 19 | 40 % |
| Additions, famille 11 (+ 9) | conseillé | 85 | 53 | 23 | 27 % |
| Additions, famille 11 (+ 9) | plus dur | 120 | 60 | 20 | 17 % |
| Additions, famille 11 (+ 9) | très dur | 151 | 52 | 28 | 19 % |
| Additions, famille 12 (passer la dizaine) | plus facile | 47 | 38 | 19 | 40 % |
| Additions, famille 12 (passer la dizaine) | conseillé | 86 | 59 | 22 | 26 % |
| Additions, famille 12 (passer la dizaine) | plus dur | 117 | 85 | 24 | 21 % |
| Additions, famille 12 (passer la dizaine) | très dur | 151 | 73 | 23 | 15 % |
| Additions, famille 13 (grand mélange) | plus facile | 45 | 29 | 16 | 36 % |
| Additions, famille 13 (grand mélange) | conseillé | 90 | 65 | 24 | 27 % |
| Additions, famille 13 (grand mélange) | plus dur | 125 | 55 | 24 | 19 % |
| Additions, famille 13 (grand mélange) | très dur | 156 | 62 | 25 | 16 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus facile | 49 | 36 | 15 | 31 % |
| Calcul rapide, niveau 1 (petit, ligne) | conseillé | 91 | 65 | 18 | 20 % |
| Calcul rapide, niveau 1 (petit, ligne) | plus dur | 126 | 66 | 18 | 14 % |
| Calcul rapide, niveau 1 (petit, ligne) | très dur | 162 | 92 | 19 | 12 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus facile | 49 | 35 | 16 | 33 % |
| Calcul rapide, niveau 2 (dizaine, mur) | conseillé | 92 | 67 | 15 | 16 % |
| Calcul rapide, niveau 2 (dizaine, mur) | plus dur | 131 | 72 | 18 | 14 % |
| Calcul rapide, niveau 2 (dizaine, mur) | très dur | 164 | 60 | 17 | 10 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus facile | 47 | 36 | 16 | 34 % |
| Calcul rapide, niveau 3 (dizaines, mur) | conseillé | 92 | 64 | 16 | 17 % |
| Calcul rapide, niveau 3 (dizaines, mur) | plus dur | 128 | 91 | 17 | 13 % |
| Calcul rapide, niveau 3 (dizaines, mur) | très dur | 160 | 102 | 17 | 11 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | 49 | 35 | 16 | 33 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | 92 | 75 | 19 | 21 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | 131 | 74 | 17 | 13 % |
| Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | 162 | 82 | 18 | 11 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | 49 | 34 | 17 | 35 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | 93 | 63 | 21 | 23 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | 126 | 64 | 17 | 13 % |
| Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | 164 | 111 | 18 | 11 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus facile | 48 | 34 | 15 | 31 % |
| Calcul rapide, niveau 6 (plus9, mur) | conseillé | 92 | 58 | 20 | 22 % |
| Calcul rapide, niveau 6 (plus9, mur) | plus dur | 126 | 60 | 21 | 17 % |
| Calcul rapide, niveau 6 (plus9, mur) | très dur | 168 | 117 | 19 | 11 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | 47 | 31 | 19 | 40 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | 89 | 59 | 20 | 22 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | 116 | 68 | 23 | 20 % |
| Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | 155 | 123 | 23 | 15 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | 49 | 34 | 16 | 33 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | 90 | 62 | 16 | 18 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | 125 | 63 | 20 | 16 % |
| Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | 164 | 91 | 23 | 14 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | 47 | 33 | 16 | 34 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | 93 | 62 | 18 | 19 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | 125 | 62 | 16 | 13 % |
| Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | 164 | 92 | 16 | 10 % |
| Multiplication, niveau 1 (groupes) | plus facile | 54 | 40 | 19 | 35 % |
| Multiplication, niveau 1 (groupes) | conseillé | 88 | 57 | 21 | 24 % |
| Multiplication, niveau 1 (groupes) | plus dur | 120 | 59 | 24 | 20 % |
| Multiplication, niveau 1 (groupes) | très dur | 149 | 93 | 21 | 14 % |
| Multiplication, niveau 2 (groupes) | plus facile | 55 | 40 | 16 | 29 % |
| Multiplication, niveau 2 (groupes) | conseillé | 93 | 64 | 17 | 18 % |
| Multiplication, niveau 2 (groupes) | plus dur | 126 | 81 | 21 | 17 % |
| Multiplication, niveau 2 (groupes) | très dur | 158 | 73 | 24 | 15 % |
| Multiplication, niveau 3 (table 2) | plus facile | 45 | 38 | 16 | 36 % |
| Multiplication, niveau 3 (table 2) | conseillé | 90 | 62 | 20 | 22 % |
| Multiplication, niveau 3 (table 2) | plus dur | 129 | 64 | 19 | 15 % |
| Multiplication, niveau 3 (table 2) | très dur | 164 | 113 | 18 | 11 % |
| Multiplication, niveau 4 (table 10) | plus facile | 46 | 35 | 16 | 35 % |
| Multiplication, niveau 4 (table 10) | conseillé | 92 | 60 | 16 | 17 % |
| Multiplication, niveau 4 (table 10) | plus dur | 126 | 58 | 19 | 15 % |
| Multiplication, niveau 4 (table 10) | très dur | 162 | 121 | 21 | 13 % |
| Multiplication, niveau 5 (table 5) | plus facile | 45 | 36 | 16 | 36 % |
| Multiplication, niveau 5 (table 5) | conseillé | 94 | 61 | 22 | 23 % |
| Multiplication, niveau 5 (table 5) | plus dur | 129 | 63 | 19 | 15 % |
| Multiplication, niveau 5 (table 5) | très dur | 158 | 93 | 22 | 14 % |
| Multiplication, niveau 6 (tourner) | plus facile | 47 | 38 | 20 | 43 % |
| Multiplication, niveau 6 (tourner) | conseillé | 89 | 61 | 21 | 24 % |
| Multiplication, niveau 6 (tourner) | plus dur | 120 | 59 | 20 | 17 % |
| Multiplication, niveau 6 (tourner) | très dur | 145 | 84 | 19 | 13 % |
| Multiplication, niveau 7 (table 3) | plus facile | 45 | 34 | 16 | 36 % |
| Multiplication, niveau 7 (table 3) | conseillé | 93 | 58 | 24 | 26 % |
| Multiplication, niveau 7 (table 3) | plus dur | 128 | 58 | 17 | 13 % |
| Multiplication, niveau 7 (table 3) | très dur | 164 | 125 | 25 | 15 % |
| Multiplication, niveau 8 (table 4) | plus facile | 46 | 36 | 16 | 35 % |
| Multiplication, niveau 8 (table 4) | conseillé | 94 | 71 | 19 | 20 % |
| Multiplication, niveau 8 (table 4) | plus dur | 129 | 60 | 19 | 15 % |
| Multiplication, niveau 8 (table 4) | très dur | 158 | 80 | 26 | 16 % |
| Multiplication, niveau 9 (tables) | plus facile | 47 | 33 | 18 | 38 % |
| Multiplication, niveau 9 (tables) | conseillé | 92 | 57 | 22 | 24 % |
| Multiplication, niveau 9 (tables) | plus dur | 125 | 56 | 18 | 14 % |
| Multiplication, niveau 9 (tables) | très dur | 164 | 86 | 26 | 16 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | 48 | 39 | 20 | 42 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | 80 | 64 | 25 | 31 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | 110 | 84 | 31 | 28 % |
| Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | 136 | 82 | 26 | 19 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | 48 | 36 | 20 | 42 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | 83 | 59 | 30 | 36 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | 110 | 79 | 34 | 31 % |
| Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | 144 | 85 | 34 | 24 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | 48 | 35 | 24 | 50 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | 79 | 58 | 22 | 28 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | 107 | 60 | 31 | 29 % |
| Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | 144 | 85 | 36 | 25 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | 49 | 39 | 21 | 43 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | 83 | 60 | 26 | 31 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | 111 | 81 | 27 | 24 % |
| Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | 144 | 109 | 28 | 19 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | 48 | 35 | 22 | 46 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | 81 | 55 | 24 | 30 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | 110 | 84 | 29 | 26 % |
| Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | 142 | 109 | 28 | 20 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | 49 | 38 | 19 | 39 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | 80 | 57 | 24 | 30 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | 113 | 69 | 27 | 24 % |
| Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | 142 | 99 | 32 | 23 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | 49 | 44 | 18 | 37 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | 82 | 53 | 25 | 30 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | 111 | 70 | 20 | 18 % |
| Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | 140 | 80 | 23 | 16 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | 49 | 39 | 20 | 41 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | 83 | 59 | 18 | 22 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | 113 | 76 | 28 | 25 % |
| Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | 140 | 113 | 20 | 14 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | 46 | 32 | 17 | 37 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | 72 | 51 | 22 | 31 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | 101 | 65 | 18 | 18 % |
| Voiliers, niveau 9 (4 bouées, double, partout) | très dur | 122 | 67 | 17 | 14 % |

## Toutes les séquences

| base | exercice | cran | comportement | questions | réponses différentes | même que la précédente | plus longue suite prévisible | leçons | étoiles | réussite | cran final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neuve | Ligne graduée, niveau 1 | plus facile | appliquée | 34 | 9 | 6 % | 3 (6, 4, 2 : pas de -2) | L1×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 1 | plus facile | réelle | 27 | 9 | 0 % | 3 (7, 5, 3 : pas de -2) | L1×1 | 29 | 85 % | plus facile |
| neuve | Ligne graduée, niveau 1 | plus facile | pressée | 27 | 10 | 4 % | 2 (8, 2 : pas de -6) | L1×1 | 21 | 33 % | plus facile |
| neuve | Ligne graduée, niveau 1 | conseillé | appliquée | 34 | 10 | 3 % | 2 (6, 1 : pas de -5) | L1×1 | 56 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 1 | conseillé | réelle | 25 | 10 | 4 % | 2 (6, 3 : pas de -3) | L1×1 | 48 | 81 % | conseillé |
| neuve | Ligne graduée, niveau 1 | conseillé | pressée | 26 | 10 | 4 % | 2 (9, 6 : pas de -3) | L1×1 | 25 | 23 % | conseillé |
| neuve | Ligne graduée, niveau 1 | plus dur | appliquée | 34 | 10 | 0 % | 3 (8, 9, 10 : pas de +1) | L1×1 | 77 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 1 | plus dur | réelle | 25 | 10 | 4 % | 3 (9, 8, 7 : pas de -1) | L1×1 | 48 | 76 % | conseillé |
| neuve | Ligne graduée, niveau 1 | plus dur | pressée | 25 | 10 | 0 % | 3 (2, 3, 4 : pas de +1) | L1×1 | 26 | 24 % | conseillé |
| neuve | Ligne graduée, niveau 1 | très dur | appliquée | 34 | 9 | 9 % | 3 (3, 6, 9 : pas de +3) | L1×1 | 99 | 100 % | très dur |
| neuve | Ligne graduée, niveau 1 | très dur | réelle | 24 | 10 | 17 % | 2 (3, 6 : pas de +3) | L1×1 | 53 | 71 % | conseillé |
| neuve | Ligne graduée, niveau 1 | très dur | pressée | 30 | 10 | 14 % | 3 (9, 6, 3 : pas de -3) | L1×1 | 35 | 42 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus facile | appliquée | 36 | 6 | 0 % | 3 (7, 4, 1 : pas de -3) | – | 31 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 2 | plus facile | réelle | 22 | 6 | 0 % | 3 (1, 4, 7 : pas de +3) | L1×1 | 28 | 73 % | plus facile |
| neuve | Ligne graduée, niveau 2 | plus facile | pressée | 22 | 6 | 0 % | 2 (4, 6 : pas de +2) | L1×1 | 15 | 15 % | plus facile |
| neuve | Ligne graduée, niveau 2 | conseillé | appliquée | 40 | 8 | 0 % | 3 (2, 4, 6 : pas de +2) | – | 59 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 2 | conseillé | réelle | 22 | 8 | 0 % | 3 (6, 7, 8 : pas de +1) | L1×1 | 47 | 73 % | conseillé |
| neuve | Ligne graduée, niveau 2 | conseillé | pressée | 21 | 8 | 0 % | 2 (8, 4 : pas de -4) | L1×1 | 19 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus dur | appliquée | 40 | 9 | 0 % | 3 (1, 2, 3 : pas de +1) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 2 | plus dur | réelle | 20 | 9 | 0 % | 2 (5, 7 : pas de +2) | L1×1 | 46 | 68 % | conseillé |
| neuve | Ligne graduée, niveau 2 | plus dur | pressée | 25 | 8 | 0 % | 2 (6, 4 : pas de -2) | L1×1 | 28 | 28 % | conseillé |
| neuve | Ligne graduée, niveau 2 | très dur | appliquée | 27 | 9 | 0 % | 3 (1, 3, 5 : pas de +2) | – | 82 | 100 % | très dur |
| neuve | Ligne graduée, niveau 2 | très dur | réelle | 24 | 9 | 0 % | 3 (9, 6, 3 : pas de -3) | L1×1 | 77 | 78 % | très dur |
| neuve | Ligne graduée, niveau 2 | très dur | pressée | 27 | 8 | 0 % | 3 (1, 4, 7 : pas de +3) | L1×1 | 28 | 30 % | conseillé |
| neuve | Ligne graduée, niveau 3 | plus facile | appliquée | 40 | 16 | 0 % | 3 (2, 9, 16 : pas de +7) | – | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 3 | plus facile | réelle | 22 | 16 | 0 % | 3 (14, 16, 18 : pas de +2) | L1×1 | 27 | 76 % | plus facile |
| neuve | Ligne graduée, niveau 3 | plus facile | pressée | 25 | 16 | 0 % | 2 (4, 6 : pas de +2) | L1×1 | 16 | 16 % | plus facile |
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
| neuve | Ligne graduée, niveau 5 | plus facile | pressée | 18 | 6 | 0 % | 2 (40, 30 : pas de -10) | L2×1 L1×1 | 20 | 19 % | plus facile |
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
| neuve | Ligne graduée, niveau 7 | plus facile | pressée | 20 | 13 | 0 % | 2 (80, 86 : pas de +6) | L1×1 L2×1 | 22 | 30 % | plus facile |
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
| neuve | Ligne graduée, niveau 8 | plus facile | pressée | 31 | 11 | 0 % | 3 (20, 30, 40 : pas de +10) | – | 17 | 23 % | plus facile |
| neuve | Ligne graduée, niveau 8 | conseillé | appliquée | 33 | 11 | 0 % | 2 (20, 30 : pas de +10) | – | 52 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 8 | conseillé | réelle | 33 | 11 | 0 % | 2 (80, 90 : pas de +10) | – | 50 | 75 % | conseillé |
| neuve | Ligne graduée, niveau 8 | conseillé | pressée | 27 | 11 | 0 % | 3 (70, 80, 90 : pas de +10) | – | 17 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus dur | appliquée | 33 | 11 | 0 % | 3 (60, 50, 40 : pas de -10) | – | 73 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 8 | plus dur | réelle | 29 | 11 | 0 % | 3 (50, 60, 70 : pas de +10) | – | 50 | 72 % | conseillé |
| neuve | Ligne graduée, niveau 8 | plus dur | pressée | 28 | 11 | 0 % | 2 (10, 20 : pas de +10) | – | 17 | 15 % | conseillé |
| neuve | Ligne graduée, niveau 8 | très dur | appliquée | 33 | 11 | 0 % | 2 (50, 60 : pas de +10) | – | 94 | 100 % | très dur |
| neuve | Ligne graduée, niveau 8 | très dur | réelle | 32 | 11 | 0 % | 2 (70, 60 : pas de -10) | – | 77 | 84 % | plus dur |
| neuve | Ligne graduée, niveau 8 | très dur | pressée | 29 | 11 | 0 % | 2 (75, 70 : pas de -5) | – | 20 | 17 % | conseillé |
| neuve | Ligne graduée, niveau 9 | plus facile | appliquée | 34 | 6 | 0 % | aucune | L10×1 | 33 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 9 | plus facile | réelle | 27 | 6 | 0 % | aucune | L10×1 | 28 | 85 % | plus facile |
| neuve | Ligne graduée, niveau 9 | plus facile | pressée | 18 | 6 | 6 % | 2 (100, 100 : même réponse) | L10×1 L1×1 | 18 | 10 % | plus facile |
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
| neuve | Ligne graduée, niveau 10 | conseillé | pressée | 22 | 14 | 0 % | aucune | L1×1 L3×1 | 25 | 23 % | conseillé |
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
| neuve | Ligne graduée, niveau 12 | conseillé | pressée | 26 | 15 | 0 % | 2 (509, 512 : pas de +3) | – | 13 | 8 % | conseillé |
| neuve | Ligne graduée, niveau 12 | plus dur | appliquée | 40 | 31 | 0 % | 2 (415, 408 : pas de -7) | – | 83 | 100 % | plus dur |
| neuve | Ligne graduée, niveau 12 | plus dur | réelle | 23 | 18 | 0 % | aucune | L10×1 | 51 | 84 % | conseillé |
| neuve | Ligne graduée, niveau 12 | plus dur | pressée | 26 | 16 | 0 % | 2 (253, 252 : pas de -1) | – | 16 | 10 % | conseillé |
| neuve | Ligne graduée, niveau 12 | très dur | appliquée | 40 | 29 | 0 % | 2 (800, 809 : pas de +9) | – | 108 | 100 % | très dur |
| neuve | Ligne graduée, niveau 12 | très dur | réelle | 31 | 22 | 0 % | 2 (305, 311 : pas de +6) | – | 86 | 77 % | conseillé |
| neuve | Ligne graduée, niveau 12 | très dur | pressée | 26 | 15 | 0 % | 2 (759, 754 : pas de -5) | – | 14 | 8 % | conseillé |
| neuve | Ligne graduée, niveau 13 | plus facile | appliquée | 33 | 11 | 0 % | aucune | – | 29 | 100 % | plus facile |
| neuve | Ligne graduée, niveau 13 | plus facile | réelle | 30 | 11 | 0 % | aucune | – | 29 | 80 % | plus facile |
| neuve | Ligne graduée, niveau 13 | plus facile | pressée | 30 | 11 | 0 % | aucune | – | 16 | 25 % | plus facile |
| neuve | Ligne graduée, niveau 13 | conseillé | appliquée | 33 | 11 | 0 % | aucune | – | 52 | 100 % | conseillé |
| neuve | Ligne graduée, niveau 13 | conseillé | réelle | 32 | 11 | 0 % | aucune | – | 53 | 83 % | conseillé |
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
| neuve | Additions, famille 1 (+ 1 et + 2) | très dur | pressée | 27 | 6 | 8 % | 3 (10, 8, 6 : pas de -2) | – | 15 | 10 % | conseillé |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | appliquée | 19 | 6 | 6 % | 3 (2, 4, 6 : pas de +2) | L4×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | réelle | 15 | 5 | 0 % | 3 (10, 8, 6 : pas de -2) | L4×1 | 25 | 70 % | plus facile |
| neuve | Additions, famille 2 (doubles jusqu'à 5) | plus facile | pressée | 16 | 5 | 7 % | 2 (2, 6 : pas de +4) | L4×1 | 14 | 7 % | plus facile |
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
| neuve | Additions, famille 3 (amis de 10) | conseillé | pressée | 21 | 7 | 5 % | 2 (3, 8 : pas de +5) | L5×1 | 16 | 6 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus dur | appliquée | 33 | 9 | 6 % | 3 (4, 5, 6 : pas de +1) | L5×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 3 (amis de 10) | plus dur | réelle | 24 | 9 | 4 % | 3 (4, 3, 2 : pas de -1) | L5×1 | 53 | 74 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | plus dur | pressée | 22 | 8 | 5 % | 2 (8, 9 : pas de +1) | L5×1 | 16 | 6 % | conseillé |
| neuve | Additions, famille 3 (amis de 10) | très dur | appliquée | 33 | 9 | 3 % | 3 (4, 5, 6 : pas de +1) | L5×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 3 (amis de 10) | très dur | réelle | 25 | 8 | 8 % | 3 (5, 4, 3 : pas de -1) | L5×1 | 57 | 77 % | conseillé |
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
| neuve | Additions, famille 5 (maisons de 8 et 9) | conseillé | réelle | 23 | 8 | 5 % | 2 (8, 2 : pas de -6) | L6×1 | 47 | 74 % | conseillé |
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
| neuve | Additions, famille 7 (mélange) | conseillé | pressée | 26 | 5 | 16 % | 2 (6, 7 : pas de +1) | – | 13 | 8 % | conseillé |
| neuve | Additions, famille 7 (mélange) | plus dur | appliquée | 40 | 10 | 0 % | 3 (10, 9, 8 : pas de -1) | – | 83 | 100 % | plus dur |
| neuve | Additions, famille 7 (mélange) | plus dur | réelle | 31 | 10 | 3 % | 2 (10, 5 : pas de -5) | – | 67 | 88 % | plus dur |
| neuve | Additions, famille 7 (mélange) | plus dur | pressée | 23 | 5 | 9 % | 3 (2, 6, 10 : pas de +4) | – | 13 | 8 % | conseillé |
| neuve | Additions, famille 7 (mélange) | très dur | appliquée | 40 | 9 | 10 % | 2 (9, 5 : pas de -4) | – | 108 | 100 % | très dur |
| neuve | Additions, famille 7 (mélange) | très dur | réelle | 26 | 8 | 12 % | 2 (9, 10 : pas de +1) | – | 63 | 74 % | conseillé |
| neuve | Additions, famille 7 (mélange) | très dur | pressée | 26 | 6 | 8 % | 2 (6, 4 : pas de -2) | – | 12 | 5 % | conseillé |
| neuve | Additions, famille 8 (dix et quelques) | plus facile | appliquée | 19 | 7 | 17 % | 2 (15, 20 : pas de +5) | L11×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 8 (dix et quelques) | plus facile | réelle | 17 | 8 | 6 % | 2 (17, 16 : pas de -1) | L11×1 | 25 | 89 % | plus facile |
| neuve | Additions, famille 8 (dix et quelques) | plus facile | pressée | 16 | 5 | 13 % | 3 (12, 15, 18 : pas de +3) | L11×1 | 13 | 4 % | plus facile |
| neuve | Additions, famille 8 (dix et quelques) | conseillé | appliquée | 33 | 12 | 3 % | 3 (10, 13, 16 : pas de +3) | L11×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 8 (dix et quelques) | conseillé | réelle | 26 | 10 | 0 % | 2 (16, 12 : pas de -4) | L11×1 | 49 | 89 % | conseillé |
| neuve | Additions, famille 8 (dix et quelques) | conseillé | pressée | 21 | 6 | 5 % | 2 (17, 12 : pas de -5) | L11×1 | 15 | 6 % | conseillé |
| neuve | Additions, famille 8 (dix et quelques) | plus dur | appliquée | 33 | 19 | 0 % | 3 (5, 8, 11 : pas de +3) | L11×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 8 (dix et quelques) | plus dur | réelle | 26 | 9 | 12 % | 3 (19, 15, 11 : pas de -4) | L11×1 | 48 | 81 % | conseillé |
| neuve | Additions, famille 8 (dix et quelques) | plus dur | pressée | 22 | 7 | 10 % | 2 (15, 16 : pas de +1) | L11×1 | 17 | 9 % | conseillé |
| neuve | Additions, famille 8 (dix et quelques) | très dur | appliquée | 33 | 10 | 6 % | 3 (5, 7, 9 : pas de +2) | L11×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 8 (dix et quelques) | très dur | réelle | 25 | 11 | 8 % | 2 (17, 11 : pas de -6) | L11×1 | 61 | 72 % | conseillé |
| neuve | Additions, famille 8 (dix et quelques) | très dur | pressée | 21 | 7 | 5 % | 2 (16, 11 : pas de -5) | L11×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | appliquée | 19 | 10 | 0 % | 2 (30, 20 : pas de -10) | L4×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | réelle | 16 | 10 | 0 % | 2 (20, 24 : pas de +4) | L4×1 | 22 | 82 % | plus facile |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | pressée | 16 | 7 | 0 % | 2 (30, 28 : pas de -2) | L4×1 | 14 | 7 % | plus facile |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | appliquée | 33 | 13 | 0 % | 3 (14, 12, 10 : pas de -2) | L4×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | réelle | 27 | 12 | 0 % | 2 (18, 24 : pas de +6) | L4×1 | 54 | 88 % | conseillé |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | pressée | 22 | 9 | 0 % | 3 (16, 12, 8 : pas de -4) | L4×1 | 16 | 6 % | conseillé |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | appliquée | 33 | 18 | 0 % | 2 (24, 20 : pas de -4) | L4×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | réelle | 24 | 13 | 0 % | 2 (28, 26 : pas de -2) | L4×1 | 55 | 83 % | conseillé |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | pressée | 21 | 8 | 0 % | 2 (26, 16 : pas de -10) | L4×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | appliquée | 33 | 14 | 3 % | 3 (11, 12, 13 : pas de +1) | L4×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | réelle | 24 | 13 | 0 % | 3 (18, 13, 8 : pas de -5) | L4×1 | 74 | 83 % | plus dur |
| neuve | Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | pressée | 21 | 8 | 0 % | 3 (20, 16, 12 : pas de -4) | L4×1 | 14 | 3 % | conseillé |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | appliquée | 19 | 5 | 17 % | 3 (11, 13, 15 : pas de +2) | L4×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | réelle | 15 | 5 | 21 % | 2 (11, 15 : pas de +4) | L4×1 | 22 | 76 % | plus facile |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | pressée | 16 | 5 | 13 % | 3 (11, 15, 19 : pas de +4) | L4×1 | 14 | 7 % | plus facile |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | appliquée | 33 | 8 | 13 % | 3 (11, 15, 19 : pas de +4) | L4×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | réelle | 21 | 6 | 10 % | 3 (13, 15, 17 : pas de +2) | L4×1 | 40 | 63 % | conseillé |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | pressée | 22 | 6 | 10 % | 2 (15, 13 : pas de -2) | L4×1 | 18 | 9 % | conseillé |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | appliquée | 33 | 12 | 3 % | 2 (17, 13 : pas de -4) | L4×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | réelle | 24 | 11 | 4 % | 2 (19, 17 : pas de -2) | L4×1 | 53 | 80 % | conseillé |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | pressée | 22 | 7 | 5 % | 3 (17, 11, 5 : pas de -6) | L4×1 | 15 | 6 % | conseillé |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | appliquée | 33 | 9 | 9 % | 3 (5, 6, 7 : pas de +1) | L4×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | réelle | 23 | 7 | 9 % | 3 (7, 8, 9 : pas de +1) | L4×1 | 74 | 77 % | plus dur |
| neuve | Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | pressée | 22 | 5 | 5 % | 2 (19, 17 : pas de -2) | L4×1 | 19 | 9 % | conseillé |
| neuve | Additions, famille 11 (+ 9) | plus facile | appliquée | 19 | 8 | 11 % | 3 (13, 14, 15 : pas de +1) | L12×1 | 25 | 100 % | plus facile |
| neuve | Additions, famille 11 (+ 9) | plus facile | réelle | 17 | 8 | 19 % | 2 (13, 12 : pas de -1) | L12×1 | 28 | 84 % | plus facile |
| neuve | Additions, famille 11 (+ 9) | plus facile | pressée | 16 | 6 | 0 % | 2 (15, 13 : pas de -2) | L12×1 | 14 | 10 % | plus facile |
| neuve | Additions, famille 11 (+ 9) | conseillé | appliquée | 33 | 12 | 0 % | 3 (12, 15, 18 : pas de +3) | L12×1 | 55 | 100 % | conseillé |
| neuve | Additions, famille 11 (+ 9) | conseillé | réelle | 23 | 6 | 0 % | 3 (15, 16, 17 : pas de +1) | L12×1 | 42 | 75 % | conseillé |
| neuve | Additions, famille 11 (+ 9) | conseillé | pressée | 23 | 8 | 5 % | 2 (13, 15 : pas de +2) | L12×1 | 16 | 9 % | conseillé |
| neuve | Additions, famille 11 (+ 9) | plus dur | appliquée | 33 | 14 | 3 % | 3 (3, 7, 11 : pas de +4) | L12×1 | 76 | 100 % | plus dur |
| neuve | Additions, famille 11 (+ 9) | plus dur | réelle | 23 | 8 | 0 % | 3 (7, 11, 15 : pas de +4) | L12×1 | 50 | 78 % | conseillé |
| neuve | Additions, famille 11 (+ 9) | plus dur | pressée | 22 | 7 | 5 % | 2 (17, 12 : pas de -5) | L12×1 | 16 | 9 % | conseillé |
| neuve | Additions, famille 11 (+ 9) | très dur | appliquée | 33 | 10 | 13 % | 3 (7, 8, 9 : pas de +1) | L12×1 | 97 | 100 % | très dur |
| neuve | Additions, famille 11 (+ 9) | très dur | réelle | 24 | 9 | 9 % | 3 (7, 6, 5 : pas de -1) | L12×1 | 77 | 76 % | très dur |
| neuve | Additions, famille 11 (+ 9) | très dur | pressée | 22 | 7 | 5 % | 3 (5, 11, 17 : pas de +6) | L12×1 | 15 | 6 % | conseillé |
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
| neuve | Additions, famille 13 (grand mélange) | plus facile | appliquée | 24 | 7 | 13 % | 2 (3, 8 : pas de +5) | – | 25 | 100 % | plus facile |
| neuve | Additions, famille 13 (grand mélange) | plus facile | réelle | 22 | 5 | 19 % | 2 (7, 6 : pas de -1) | – | 26 | 97 % | plus facile |
| neuve | Additions, famille 13 (grand mélange) | plus facile | pressée | 19 | 5 | 6 % | 3 (6, 5, 4 : pas de -1) | – | 12 | 9 % | plus facile |
| neuve | Additions, famille 13 (grand mélange) | conseillé | appliquée | 40 | 7 | 15 % | 3 (6, 5, 4 : pas de -1) | – | 59 | 100 % | conseillé |
| neuve | Additions, famille 13 (grand mélange) | conseillé | réelle | 28 | 7 | 15 % | 3 (7, 5, 3 : pas de -2) | – | 42 | 69 % | conseillé |
| neuve | Additions, famille 13 (grand mélange) | conseillé | pressée | 27 | 5 | 12 % | 3 (10, 8, 6 : pas de -2) | – | 14 | 8 % | conseillé |
| neuve | Additions, famille 13 (grand mélange) | plus dur | appliquée | 40 | 10 | 0 % | 2 (3, 8 : pas de +5) | – | 83 | 100 % | plus dur |
| neuve | Additions, famille 13 (grand mélange) | plus dur | réelle | 30 | 8 | 7 % | 3 (10, 6, 2 : pas de -4) | – | 54 | 73 % | conseillé |
| neuve | Additions, famille 13 (grand mélange) | plus dur | pressée | 27 | 5 | 4 % | 3 (10, 8, 6 : pas de -2) | – | 14 | 10 % | conseillé |
| neuve | Additions, famille 13 (grand mélange) | très dur | appliquée | 40 | 7 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 108 | 100 % | très dur |
| neuve | Additions, famille 13 (grand mélange) | très dur | réelle | 31 | 9 | 13 % | 2 (4, 7 : pas de +3) | – | 82 | 88 % | plus dur |
| neuve | Additions, famille 13 (grand mélange) | très dur | pressée | 27 | 5 | 19 % | 3 (10, 8, 6 : pas de -2) | – | 17 | 15 % | conseillé |
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
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | pressée | 16 | 10 | 7 % | 2 (31, 36 : pas de +5) | L9×1 | 14 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | appliquée | 33 | 25 | 0 % | 3 (63, 72, 81 : pas de +9) | L9×1 | 55 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | réelle | 22 | 17 | 0 % | 2 (74, 71 : pas de -3) | L9×1 | 41 | 81 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | pressée | 18 | 12 | 0 % | 2 (32, 24 : pas de -8) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | appliquée | 33 | 24 | 0 % | 2 (62, 71 : pas de +9) | L9×1 | 76 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | réelle | 21 | 15 | 0 % | 2 (65, 72 : pas de +7) | L9×1 | 53 | 77 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | pressée | 18 | 11 | 6 % | 2 (86, 93 : pas de +7) | L9×1 | 14 | 3 % | conseillé |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | appliquée | 34 | 6 | 9 % | 3 (8, 7, 6 : pas de -1) | L9×1 | 99 | 100 % | très dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | réelle | 21 | 16 | 0 % | 3 (4, 6, 8 : pas de +2) | L9×1 | 59 | 72 % | plus dur |
| neuve | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | pressée | 18 | 12 | 0 % | 2 (44, 54 : pas de +10) | L9×1 | 13 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | appliquée | 29 | 23 | 4 % | 2 (96, 99 : pas de +3) | – | 27 | 100 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | réelle | 15 | 10 | 0 % | 2 (91, 85 : pas de -6) | L7×1 | 21 | 67 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | pressée | 19 | 10 | 11 % | 2 (96, 99 : pas de +3) | – | 11 | 3 % | plus facile |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | appliquée | 41 | 30 | 3 % | 2 (73, 75 : pas de +2) | – | 60 | 100 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | réelle | 30 | 21 | 0 % | 2 (58, 64 : pas de +6) | – | 49 | 73 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | pressée | 22 | 12 | 0 % | 2 (79, 88 : pas de +9) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | appliquée | 41 | 29 | 3 % | 2 (85, 92 : pas de +7) | – | 85 | 100 % | plus dur |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | réelle | 20 | 13 | 0 % | 2 (89, 97 : pas de +8) | L7×1 | 46 | 65 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | pressée | 22 | 14 | 0 % | 2 (96, 99 : pas de +3) | – | 10 | 0 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | appliquée | 43 | 32 | 0 % | 3 (14, 21, 28 : pas de +7) | – | 114 | 100 % | très dur |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | réelle | 24 | 17 | 4 % | 2 (91, 81 : pas de -10) | – | 39 | 57 % | conseillé |
| neuve | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | pressée | 22 | 11 | 10 % | 2 (99, 89 : pas de -10) | – | 11 | 3 % | conseillé |
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
| neuve | Multiplication, niveau 1 (groupes) | plus facile | appliquée | 33 | 10 | 3 % | 2 (15, 16 : pas de +1) | L13×1 | 32 | 100 % | plus facile |
| neuve | Multiplication, niveau 1 (groupes) | plus facile | réelle | 23 | 9 | 5 % | 2 (6, 16 : pas de +10) | L13×1 | 30 | 74 % | plus facile |
| neuve | Multiplication, niveau 1 (groupes) | plus facile | pressée | 21 | 9 | 0 % | 2 (15, 25 : pas de +10) | L13×1 | 13 | 3 % | plus facile |
| neuve | Multiplication, niveau 1 (groupes) | conseillé | appliquée | 33 | 10 | 3 % | 3 (12, 16, 20 : pas de +4) | L13×1 | 55 | 100 % | conseillé |
| neuve | Multiplication, niveau 1 (groupes) | conseillé | réelle | 25 | 10 | 17 % | 3 (4, 6, 8 : pas de +2) | L13×1 | 43 | 85 % | conseillé |
| neuve | Multiplication, niveau 1 (groupes) | conseillé | pressée | 21 | 9 | 0 % | 2 (8, 9 : pas de +1) | L13×1 | 14 | 3 % | conseillé |
| neuve | Multiplication, niveau 1 (groupes) | plus dur | appliquée | 33 | 10 | 0 % | 3 (20, 15, 10 : pas de -5) | L13×1 | 76 | 100 % | plus dur |
| neuve | Multiplication, niveau 1 (groupes) | plus dur | réelle | 21 | 6 | 5 % | 2 (12, 20 : pas de +8) | L13×1 | 53 | 69 % | conseillé |
| neuve | Multiplication, niveau 1 (groupes) | plus dur | pressée | 21 | 7 | 0 % | 3 (4, 8, 12 : pas de +4) | L13×1 | 14 | 3 % | conseillé |
| neuve | Multiplication, niveau 1 (groupes) | très dur | appliquée | 33 | 10 | 0 % | 3 (9, 12, 15 : pas de +3) | L13×1 | 97 | 100 % | très dur |
| neuve | Multiplication, niveau 1 (groupes) | très dur | réelle | 24 | 9 | 4 % | 2 (6, 15 : pas de +9) | L13×1 | 72 | 82 % | plus dur |
| neuve | Multiplication, niveau 1 (groupes) | très dur | pressée | 21 | 8 | 5 % | 2 (4, 9 : pas de +5) | L13×1 | 14 | 3 % | conseillé |
| neuve | Multiplication, niveau 2 (groupes) | plus facile | appliquée | 41 | 10 | 0 % | 2 (4, 6 : pas de +2) | – | 33 | 100 % | plus facile |
| neuve | Multiplication, niveau 2 (groupes) | plus facile | réelle | 27 | 8 | 8 % | 3 (8, 10, 12 : pas de +2) | L13×1 | 31 | 79 % | plus facile |
| neuve | Multiplication, niveau 2 (groupes) | plus facile | pressée | 26 | 8 | 0 % | 2 (10, 15 : pas de +5) | – | 10 | 3 % | plus facile |
| neuve | Multiplication, niveau 2 (groupes) | conseillé | appliquée | 41 | 10 | 8 % | 3 (16, 10, 4 : pas de -6) | – | 60 | 100 % | conseillé |
| neuve | Multiplication, niveau 2 (groupes) | conseillé | réelle | 21 | 10 | 0 % | 2 (12, 8 : pas de -4) | L13×1 | 39 | 77 % | conseillé |
| neuve | Multiplication, niveau 2 (groupes) | conseillé | pressée | 26 | 10 | 0 % | 2 (16, 15 : pas de -1) | – | 12 | 5 % | conseillé |
| neuve | Multiplication, niveau 2 (groupes) | plus dur | appliquée | 41 | 10 | 3 % | 3 (4, 12, 20 : pas de +8) | – | 85 | 100 % | plus dur |
| neuve | Multiplication, niveau 2 (groupes) | plus dur | réelle | 31 | 10 | 3 % | 3 (9, 12, 15 : pas de +3) | – | 56 | 73 % | conseillé |
| neuve | Multiplication, niveau 2 (groupes) | plus dur | pressée | 26 | 10 | 4 % | 3 (12, 16, 20 : pas de +4) | – | 13 | 5 % | conseillé |
| neuve | Multiplication, niveau 2 (groupes) | très dur | appliquée | 41 | 10 | 5 % | 3 (12, 10, 8 : pas de -2) | – | 110 | 100 % | très dur |
| neuve | Multiplication, niveau 2 (groupes) | très dur | réelle | 24 | 10 | 9 % | 3 (20, 16, 12 : pas de -4) | L13×1 | 79 | 88 % | très dur |
| neuve | Multiplication, niveau 2 (groupes) | très dur | pressée | 26 | 7 | 4 % | 3 (25, 20, 15 : pas de -5) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 3 (table 2) | plus facile | appliquée | 24 | 9 | 9 % | 3 (2, 6, 10 : pas de +4) | – | 25 | 100 % | plus facile |
| neuve | Multiplication, niveau 3 (table 2) | plus facile | réelle | 17 | 10 | 0 % | 3 (8, 14, 20 : pas de +6) | L13×1 | 23 | 83 % | plus facile |
| neuve | Multiplication, niveau 3 (table 2) | plus facile | pressée | 20 | 9 | 0 % | 3 (2, 6, 10 : pas de +4) | – | 10 | 3 % | plus facile |
| neuve | Multiplication, niveau 3 (table 2) | conseillé | appliquée | 41 | 10 | 5 % | 2 (16, 20 : pas de +4) | – | 60 | 100 % | conseillé |
| neuve | Multiplication, niveau 3 (table 2) | conseillé | réelle | 25 | 9 | 8 % | 3 (10, 8, 6 : pas de -2) | L13×1 | 44 | 78 % | conseillé |
| neuve | Multiplication, niveau 3 (table 2) | conseillé | pressée | 26 | 9 | 0 % | 3 (14, 12, 10 : pas de -2) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 3 (table 2) | plus dur | appliquée | 41 | 10 | 8 % | 3 (20, 16, 12 : pas de -4) | – | 85 | 100 % | plus dur |
| neuve | Multiplication, niveau 3 (table 2) | plus dur | réelle | 23 | 10 | 5 % | 3 (14, 16, 18 : pas de +2) | L13×1 | 65 | 76 % | plus dur |
| neuve | Multiplication, niveau 3 (table 2) | plus dur | pressée | 26 | 8 | 12 % | 2 (12, 6 : pas de -6) | – | 12 | 5 % | conseillé |
| neuve | Multiplication, niveau 3 (table 2) | très dur | appliquée | 41 | 11 | 18 % | 3 (8, 5, 2 : pas de -3) | – | 110 | 100 % | très dur |
| neuve | Multiplication, niveau 3 (table 2) | très dur | réelle | 31 | 11 | 10 % | 3 (9, 5, 1 : pas de -4) | – | 86 | 81 % | très dur |
| neuve | Multiplication, niveau 3 (table 2) | très dur | pressée | 21 | 8 | 10 % | 2 (10, 6 : pas de -4) | L13×1 | 18 | 9 % | conseillé |
| neuve | Multiplication, niveau 4 (table 10) | plus facile | appliquée | 24 | 10 | 0 % | 2 (70, 60 : pas de -10) | – | 25 | 100 % | plus facile |
| neuve | Multiplication, niveau 4 (table 10) | plus facile | réelle | 20 | 9 | 0 % | 2 (10, 20 : pas de +10) | L13×1 | 25 | 81 % | plus facile |
| neuve | Multiplication, niveau 4 (table 10) | plus facile | pressée | 20 | 9 | 5 % | 3 (50, 60, 70 : pas de +10) | – | 11 | 6 % | plus facile |
| neuve | Multiplication, niveau 4 (table 10) | conseillé | appliquée | 41 | 10 | 3 % | 2 (50, 60 : pas de +10) | – | 60 | 100 % | conseillé |
| neuve | Multiplication, niveau 4 (table 10) | conseillé | réelle | 23 | 10 | 0 % | 3 (30, 20, 10 : pas de -10) | L13×1 | 44 | 77 % | conseillé |
| neuve | Multiplication, niveau 4 (table 10) | conseillé | pressée | 26 | 9 | 4 % | 2 (90, 80 : pas de -10) | – | 13 | 5 % | conseillé |
| neuve | Multiplication, niveau 4 (table 10) | plus dur | appliquée | 41 | 10 | 3 % | 2 (60, 50 : pas de -10) | – | 85 | 100 % | plus dur |
| neuve | Multiplication, niveau 4 (table 10) | plus dur | réelle | 23 | 10 | 0 % | 2 (20, 30 : pas de +10) | L13×1 | 58 | 81 % | conseillé |
| neuve | Multiplication, niveau 4 (table 10) | plus dur | pressée | 27 | 10 | 8 % | 2 (70, 80 : pas de +10) | – | 15 | 8 % | conseillé |
| neuve | Multiplication, niveau 4 (table 10) | très dur | appliquée | 41 | 11 | 18 % | 3 (5, 7, 9 : pas de +2) | – | 110 | 100 % | très dur |
| neuve | Multiplication, niveau 4 (table 10) | très dur | réelle | 28 | 12 | 7 % | 2 (10, 8 : pas de -2) | – | 70 | 74 % | plus dur |
| neuve | Multiplication, niveau 4 (table 10) | très dur | pressée | 26 | 10 | 8 % | 2 (40, 50 : pas de +10) | – | 14 | 8 % | conseillé |
| neuve | Multiplication, niveau 5 (table 5) | plus facile | appliquée | 24 | 10 | 4 % | 3 (40, 30, 20 : pas de -10) | – | 25 | 100 % | plus facile |
| neuve | Multiplication, niveau 5 (table 5) | plus facile | réelle | 22 | 10 | 5 % | 2 (15, 20 : pas de +5) | – | 25 | 82 % | plus facile |
| neuve | Multiplication, niveau 5 (table 5) | plus facile | pressée | 20 | 9 | 0 % | 2 (25, 35 : pas de +10) | – | 11 | 6 % | plus facile |
| neuve | Multiplication, niveau 5 (table 5) | conseillé | appliquée | 41 | 10 | 5 % | 2 (35, 25 : pas de -10) | – | 60 | 100 % | conseillé |
| neuve | Multiplication, niveau 5 (table 5) | conseillé | réelle | 21 | 9 | 0 % | 3 (35, 40, 45 : pas de +5) | L13×1 | 45 | 71 % | conseillé |
| neuve | Multiplication, niveau 5 (table 5) | conseillé | pressée | 26 | 9 | 8 % | 2 (45, 50 : pas de +5) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 5 (table 5) | plus dur | appliquée | 41 | 10 | 8 % | 2 (35, 40 : pas de +5) | – | 85 | 100 % | plus dur |
| neuve | Multiplication, niveau 5 (table 5) | plus dur | réelle | 24 | 9 | 13 % | 2 (45, 50 : pas de +5) | L13×1 | 56 | 77 % | conseillé |
| neuve | Multiplication, niveau 5 (table 5) | plus dur | pressée | 21 | 9 | 0 % | 2 (50, 45 : pas de -5) | L13×1 | 15 | 6 % | conseillé |
| neuve | Multiplication, niveau 5 (table 5) | très dur | appliquée | 41 | 11 | 18 % | 3 (1, 5, 9 : pas de +4) | – | 110 | 100 % | très dur |
| neuve | Multiplication, niveau 5 (table 5) | très dur | réelle | 22 | 9 | 0 % | 2 (30, 25 : pas de -5) | L13×1 | 57 | 70 % | conseillé |
| neuve | Multiplication, niveau 5 (table 5) | très dur | pressée | 26 | 9 | 0 % | 3 (25, 35, 45 : pas de +10) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 6 (tourner) | plus facile | appliquée | 19 | 14 | 0 % | 2 (14, 8 : pas de -6) | L14×1 | 25 | 100 % | plus facile |
| neuve | Multiplication, niveau 6 (tourner) | plus facile | réelle | 11 | 9 | 0 % | 2 (15, 8 : pas de -7) | L14×1 L13×1 | 24 | 82 % | plus facile |
| neuve | Multiplication, niveau 6 (tourner) | plus facile | pressée | 16 | 9 | 0 % | 3 (24, 18, 12 : pas de -6) | L14×1 | 13 | 4 % | plus facile |
| neuve | Multiplication, niveau 6 (tourner) | conseillé | appliquée | 33 | 17 | 0 % | 2 (32, 30 : pas de -2) | L14×1 | 55 | 100 % | conseillé |
| neuve | Multiplication, niveau 6 (tourner) | conseillé | réelle | 24 | 14 | 4 % | 3 (15, 21, 27 : pas de +6) | L14×1 | 42 | 80 % | conseillé |
| neuve | Multiplication, niveau 6 (tourner) | conseillé | pressée | 22 | 10 | 10 % | 2 (15, 12 : pas de -3) | L14×1 | 16 | 9 % | conseillé |
| neuve | Multiplication, niveau 6 (tourner) | plus dur | appliquée | 33 | 16 | 3 % | 2 (16, 21 : pas de +5) | L14×1 | 76 | 100 % | plus dur |
| neuve | Multiplication, niveau 6 (tourner) | plus dur | réelle | 16 | 11 | 0 % | 2 (28, 36 : pas de +8) | L14×1 L13×1 | 42 | 67 % | conseillé |
| neuve | Multiplication, niveau 6 (tourner) | plus dur | pressée | 21 | 10 | 0 % | 3 (20, 18, 16 : pas de -2) | L14×1 | 15 | 6 % | conseillé |
| neuve | Multiplication, niveau 6 (tourner) | très dur | appliquée | 33 | 16 | 0 % | 3 (18, 24, 30 : pas de +6) | L14×1 | 97 | 100 % | très dur |
| neuve | Multiplication, niveau 6 (tourner) | très dur | réelle | 24 | 14 | 0 % | 3 (28, 21, 14 : pas de -7) | L14×1 | 79 | 78 % | très dur |
| neuve | Multiplication, niveau 6 (tourner) | très dur | pressée | 16 | 8 | 0 % | 2 (8, 12 : pas de +4) | L14×1 L13×1 | 18 | 7 % | conseillé |
| neuve | Multiplication, niveau 7 (table 3) | plus facile | appliquée | 24 | 10 | 0 % | 2 (27, 30 : pas de +3) | – | 25 | 100 % | plus facile |
| neuve | Multiplication, niveau 7 (table 3) | plus facile | réelle | 15 | 9 | 7 % | 2 (15, 24 : pas de +9) | L13×1 | 24 | 76 % | plus facile |
| neuve | Multiplication, niveau 7 (table 3) | plus facile | pressée | 20 | 8 | 0 % | 3 (18, 24, 30 : pas de +6) | – | 10 | 3 % | plus facile |
| neuve | Multiplication, niveau 7 (table 3) | conseillé | appliquée | 41 | 10 | 5 % | 3 (9, 18, 27 : pas de +9) | – | 60 | 100 % | conseillé |
| neuve | Multiplication, niveau 7 (table 3) | conseillé | réelle | 32 | 10 | 6 % | 3 (3, 12, 21 : pas de +9) | – | 50 | 88 % | conseillé |
| neuve | Multiplication, niveau 7 (table 3) | conseillé | pressée | 26 | 9 | 8 % | 3 (24, 21, 18 : pas de -3) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 7 (table 3) | plus dur | appliquée | 41 | 10 | 5 % | 3 (6, 15, 24 : pas de +9) | – | 85 | 100 % | plus dur |
| neuve | Multiplication, niveau 7 (table 3) | plus dur | réelle | 23 | 10 | 0 % | 3 (21, 15, 9 : pas de -6) | L13×1 | 48 | 71 % | conseillé |
| neuve | Multiplication, niveau 7 (table 3) | plus dur | pressée | 26 | 10 | 0 % | 3 (6, 12, 18 : pas de +6) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 7 (table 3) | très dur | appliquée | 41 | 11 | 13 % | 2 (3, 7 : pas de +4) | – | 110 | 100 % | très dur |
| neuve | Multiplication, niveau 7 (table 3) | très dur | réelle | 29 | 9 | 7 % | 3 (1, 3, 5 : pas de +2) | – | 82 | 74 % | très dur |
| neuve | Multiplication, niveau 7 (table 3) | très dur | pressée | 26 | 8 | 12 % | 2 (18, 24 : pas de +6) | – | 13 | 5 % | conseillé |
| neuve | Multiplication, niveau 8 (table 4) | plus facile | appliquée | 24 | 10 | 0 % | 3 (28, 32, 36 : pas de +4) | – | 25 | 100 % | plus facile |
| neuve | Multiplication, niveau 8 (table 4) | plus facile | réelle | 21 | 9 | 0 % | 2 (32, 40 : pas de +8) | – | 25 | 81 % | plus facile |
| neuve | Multiplication, niveau 8 (table 4) | plus facile | pressée | 20 | 7 | 11 % | 2 (28, 20 : pas de -8) | – | 11 | 6 % | plus facile |
| neuve | Multiplication, niveau 8 (table 4) | conseillé | appliquée | 41 | 10 | 3 % | 3 (4, 8, 12 : pas de +4) | – | 60 | 100 % | conseillé |
| neuve | Multiplication, niveau 8 (table 4) | conseillé | réelle | 22 | 10 | 10 % | 3 (24, 32, 40 : pas de +8) | L13×1 | 40 | 71 % | conseillé |
| neuve | Multiplication, niveau 8 (table 4) | conseillé | pressée | 26 | 9 | 8 % | 3 (16, 24, 32 : pas de +8) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 8 (table 4) | plus dur | appliquée | 41 | 10 | 13 % | 3 (16, 20, 24 : pas de +4) | – | 85 | 100 % | plus dur |
| neuve | Multiplication, niveau 8 (table 4) | plus dur | réelle | 31 | 10 | 7 % | 3 (28, 32, 36 : pas de +4) | L13×1 | 54 | 76 % | conseillé |
| neuve | Multiplication, niveau 8 (table 4) | plus dur | pressée | 26 | 7 | 12 % | 2 (4, 8 : pas de +4) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 8 (table 4) | très dur | appliquée | 41 | 10 | 20 % | 3 (9, 6, 3 : pas de -3) | – | 110 | 100 % | très dur |
| neuve | Multiplication, niveau 8 (table 4) | très dur | réelle | 22 | 10 | 0 % | 3 (16, 24, 32 : pas de +8) | L13×1 | 52 | 68 % | plus dur |
| neuve | Multiplication, niveau 8 (table 4) | très dur | pressée | 21 | 8 | 5 % | 3 (40, 36, 32 : pas de -4) | L13×1 | 15 | 6 % | conseillé |
| neuve | Multiplication, niveau 9 (tables) | plus facile | appliquée | 24 | 16 | 0 % | 2 (20, 16 : pas de -4) | – | 25 | 100 % | plus facile |
| neuve | Multiplication, niveau 9 (tables) | plus facile | réelle | 17 | 11 | 0 % | 3 (16, 24, 32 : pas de +8) | L13×1 | 26 | 82 % | plus facile |
| neuve | Multiplication, niveau 9 (tables) | plus facile | pressée | 20 | 12 | 0 % | 2 (27, 32 : pas de +5) | – | 10 | 3 % | plus facile |
| neuve | Multiplication, niveau 9 (tables) | conseillé | appliquée | 41 | 23 | 5 % | 2 (24, 30 : pas de +6) | – | 60 | 100 % | conseillé |
| neuve | Multiplication, niveau 9 (tables) | conseillé | réelle | 22 | 12 | 5 % | 2 (14, 10 : pas de -4) | L13×1 | 43 | 69 % | conseillé |
| neuve | Multiplication, niveau 9 (tables) | conseillé | pressée | 26 | 12 | 0 % | 2 (10, 5 : pas de -5) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 9 (tables) | plus dur | appliquée | 41 | 24 | 3 % | 2 (14, 20 : pas de +6) | – | 85 | 100 % | plus dur |
| neuve | Multiplication, niveau 9 (tables) | plus dur | réelle | 36 | 23 | 3 % | 2 (30, 24 : pas de -6) | – | 74 | 93 % | plus dur |
| neuve | Multiplication, niveau 9 (tables) | plus dur | pressée | 26 | 14 | 0 % | 3 (30, 35, 40 : pas de +5) | – | 11 | 3 % | conseillé |
| neuve | Multiplication, niveau 9 (tables) | très dur | appliquée | 41 | 10 | 18 % | 2 (4, 2 : pas de -2) | – | 110 | 100 % | très dur |
| neuve | Multiplication, niveau 9 (tables) | très dur | réelle | 33 | 20 | 3 % | 2 (50, 40 : pas de -10) | – | 72 | 72 % | conseillé |
| neuve | Multiplication, niveau 9 (tables) | très dur | pressée | 26 | 14 | 0 % | 2 (80, 70 : pas de -10) | – | 11 | 3 % | conseillé |
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
| mois | Ligne graduée, niveau 1 | plus facile | appliquée | 40 | 10 | 0 % | 3 (6, 5, 4 : pas de -1) | – | 54 | 100 % | plus facile |
| mois | Ligne graduée, niveau 1 | plus facile | réelle | 25 | 10 | 4 % | 3 (8, 6, 4 : pas de -2) | L1×1 | 38 | 75 % | plus facile |
| mois | Ligne graduée, niveau 1 | plus facile | pressée | 33 | 9 | 6 % | 3 (4, 5, 6 : pas de +1) | L1×1 | 33 | 30 % | plus facile |
| mois | Ligne graduée, niveau 1 | conseillé | appliquée | 40 | 10 | 3 % | 3 (6, 4, 2 : pas de -2) | – | 93 | 100 % | conseillé |
| mois | Ligne graduée, niveau 1 | conseillé | réelle | 29 | 9 | 0 % | 2 (6, 4 : pas de -2) | L1×1 | 68 | 82 % | conseillé |
| mois | Ligne graduée, niveau 1 | conseillé | pressée | 27 | 10 | 4 % | 3 (7, 8, 9 : pas de +1) | L1×1 | 38 | 22 % | conseillé |
| mois | Ligne graduée, niveau 1 | plus dur | appliquée | 39 | 10 | 5 % | 3 (7, 4, 1 : pas de -3) | – | 125 | 100 % | plus dur |
| mois | Ligne graduée, niveau 1 | plus dur | réelle | 21 | 9 | 5 % | 2 (4, 9 : pas de +5) | L1×1 | 62 | 70 % | conseillé |
| mois | Ligne graduée, niveau 1 | plus dur | pressée | 27 | 9 | 4 % | 3 (4, 6, 8 : pas de +2) | L1×1 | 38 | 21 % | conseillé |
| mois | Ligne graduée, niveau 1 | très dur | appliquée | 40 | 10 | 0 % | 3 (7, 6, 5 : pas de -1) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 1 | très dur | réelle | 31 | 10 | 0 % | 3 (9, 7, 5 : pas de -2) | L1×1 | 96 | 77 % | conseillé |
| mois | Ligne graduée, niveau 1 | très dur | pressée | 28 | 10 | 0 % | 3 (8, 9, 10 : pas de +1) | L1×1 | 33 | 21 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus facile | appliquée | 36 | 6 | 0 % | 3 (1, 4, 7 : pas de +3) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 2 | plus facile | réelle | 22 | 6 | 0 % | 3 (7, 4, 1 : pas de -3) | L1×1 | 38 | 74 % | plus facile |
| mois | Ligne graduée, niveau 2 | plus facile | pressée | 23 | 6 | 0 % | 2 (4, 6 : pas de +2) | L1×1 | 20 | 8 % | plus facile |
| mois | Ligne graduée, niveau 2 | conseillé | appliquée | 38 | 8 | 0 % | 3 (9, 6, 3 : pas de -3) | – | 90 | 100 % | conseillé |
| mois | Ligne graduée, niveau 2 | conseillé | réelle | 24 | 8 | 0 % | 2 (3, 2 : pas de -1) | L1×1 | 62 | 78 % | conseillé |
| mois | Ligne graduée, niveau 2 | conseillé | pressée | 23 | 8 | 0 % | 3 (3, 6, 9 : pas de +3) | L1×1 | 33 | 17 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus dur | appliquée | 40 | 9 | 0 % | 3 (8, 5, 2 : pas de -3) | – | 126 | 100 % | plus dur |
| mois | Ligne graduée, niveau 2 | plus dur | réelle | 20 | 8 | 0 % | 3 (7, 8, 9 : pas de +1) | L1×1 | 55 | 64 % | conseillé |
| mois | Ligne graduée, niveau 2 | plus dur | pressée | 24 | 8 | 0 % | 2 (3, 7 : pas de +4) | L1×1 | 30 | 14 % | conseillé |
| mois | Ligne graduée, niveau 2 | très dur | appliquée | 27 | 9 | 0 % | 3 (1, 4, 7 : pas de +3) | – | 130 | 100 % | très dur |
| mois | Ligne graduée, niveau 2 | très dur | réelle | 22 | 9 | 0 % | 3 (7, 6, 5 : pas de -1) | L1×1 | 104 | 78 % | très dur |
| mois | Ligne graduée, niveau 2 | très dur | pressée | 23 | 8 | 0 % | 3 (9, 8, 7 : pas de -1) | L1×1 | 26 | 9 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus facile | appliquée | 40 | 16 | 0 % | 2 (19, 16 : pas de -3) | – | 55 | 100 % | plus facile |
| mois | Ligne graduée, niveau 3 | plus facile | réelle | 24 | 16 | 0 % | 3 (16, 17, 18 : pas de +1) | L1×1 | 43 | 77 % | plus facile |
| mois | Ligne graduée, niveau 3 | plus facile | pressée | 23 | 15 | 0 % | 3 (9, 6, 3 : pas de -3) | L1×1 | 21 | 9 % | plus facile |
| mois | Ligne graduée, niveau 3 | conseillé | appliquée | 40 | 18 | 0 % | 2 (18, 14 : pas de -4) | – | 90 | 100 % | conseillé |
| mois | Ligne graduée, niveau 3 | conseillé | réelle | 30 | 18 | 0 % | 3 (6, 9, 12 : pas de +3) | – | 57 | 69 % | conseillé |
| mois | Ligne graduée, niveau 3 | conseillé | pressée | 23 | 16 | 0 % | 3 (13, 9, 5 : pas de -4) | L1×1 | 27 | 13 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus dur | appliquée | 40 | 19 | 0 % | 3 (17, 14, 11 : pas de -3) | – | 125 | 100 % | plus dur |
| mois | Ligne graduée, niveau 3 | plus dur | réelle | 22 | 14 | 0 % | 3 (12, 10, 8 : pas de -2) | L1×1 | 69 | 74 % | conseillé |
| mois | Ligne graduée, niveau 3 | plus dur | pressée | 25 | 17 | 0 % | 2 (8, 4 : pas de -4) | L1×1 | 31 | 14 % | conseillé |
| mois | Ligne graduée, niveau 3 | très dur | appliquée | 40 | 19 | 0 % | 3 (14, 9, 4 : pas de -5) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 3 | très dur | réelle | 22 | 14 | 0 % | 2 (9, 2 : pas de -7) | L1×1 | 83 | 71 % | conseillé |
| mois | Ligne graduée, niveau 3 | très dur | pressée | 24 | 18 | 0 % | 2 (12, 7 : pas de -5) | L1×1 | 25 | 10 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus facile | appliquée | 40 | 33 | 0 % | 2 (39, 36 : pas de -3) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 4 | plus facile | réelle | 29 | 22 | 0 % | 2 (31, 22 : pas de -9) | L1×1 | 41 | 80 % | plus facile |
| mois | Ligne graduée, niveau 4 | plus facile | pressée | 17 | 13 | 0 % | 2 (78, 69 : pas de -9) | L1×1 L3×1 | 24 | 10 % | plus facile |
| mois | Ligne graduée, niveau 4 | conseillé | appliquée | 40 | 33 | 0 % | 2 (64, 61 : pas de -3) | – | 90 | 100 % | conseillé |
| mois | Ligne graduée, niveau 4 | conseillé | réelle | 26 | 23 | 0 % | 2 (67, 64 : pas de -3) | L1×1 | 66 | 83 % | conseillé |
| mois | Ligne graduée, niveau 4 | conseillé | pressée | 18 | 13 | 0 % | 2 (25, 16 : pas de -9) | L3×1 L1×1 | 29 | 13 % | conseillé |
| mois | Ligne graduée, niveau 4 | plus dur | appliquée | 40 | 21 | 0 % | 2 (95, 94 : pas de -1) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 4 | plus dur | réelle | 29 | 17 | 0 % | 2 (94, 96 : pas de +2) | – | 84 | 73 % | plus dur |
| mois | Ligne graduée, niveau 4 | plus dur | pressée | 26 | 18 | 0 % | 2 (37, 46 : pas de +9) | L1×1 | 29 | 14 % | conseillé |
| mois | Ligne graduée, niveau 4 | très dur | appliquée | 40 | 37 | 0 % | 2 (31, 24 : pas de -7) | – | 160 | 100 % | très dur |
| mois | Ligne graduée, niveau 4 | très dur | réelle | 25 | 21 | 0 % | 2 (33, 24 : pas de -9) | L1×1 | 120 | 87 % | très dur |
| mois | Ligne graduée, niveau 4 | très dur | pressée | 23 | 14 | 0 % | 2 (64, 71 : pas de +7) | L3×1 | 25 | 9 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus facile | appliquée | 34 | 6 | 0 % | 2 (40, 30 : pas de -10) | L2×1 | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 5 | plus facile | réelle | 20 | 6 | 0 % | 2 (30, 40 : pas de +10) | L2×1 L1×1 | 40 | 75 % | plus facile |
| mois | Ligne graduée, niveau 5 | plus facile | pressée | 19 | 6 | 0 % | 2 (40, 30 : pas de -10) | L2×1 L1×1 | 24 | 10 % | plus facile |
| mois | Ligne graduée, niveau 5 | conseillé | appliquée | 34 | 8 | 0 % | 2 (40, 30 : pas de -10) | L2×1 | 90 | 100 % | conseillé |
| mois | Ligne graduée, niveau 5 | conseillé | réelle | 26 | 8 | 0 % | 3 (30, 20, 10 : pas de -10) | L2×1 | 66 | 82 % | conseillé |
| mois | Ligne graduée, niveau 5 | conseillé | pressée | 24 | 8 | 0 % | 2 (70, 60 : pas de -10) | L2×1 | 25 | 6 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus dur | appliquée | 34 | 9 | 0 % | 2 (40, 50 : pas de +10) | L2×1 | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 5 | plus dur | réelle | 26 | 8 | 0 % | 3 (40, 30, 20 : pas de -10) | L2×1 | 64 | 77 % | conseillé |
| mois | Ligne graduée, niveau 5 | plus dur | pressée | 20 | 8 | 0 % | 2 (80, 90 : pas de +10) | L2×1 L1×1 | 31 | 11 % | conseillé |
| mois | Ligne graduée, niveau 5 | très dur | appliquée | 27 | 9 | 0 % | 2 (30, 40 : pas de +10) | L2×1 | 135 | 100 % | très dur |
| mois | Ligne graduée, niveau 5 | très dur | réelle | 27 | 9 | 0 % | 2 (50, 60 : pas de +10) | L2×1 | 118 | 89 % | très dur |
| mois | Ligne graduée, niveau 5 | très dur | pressée | 19 | 8 | 0 % | 3 (20, 30, 40 : pas de +10) | L2×1 L1×1 | 27 | 8 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus facile | appliquée | 40 | 33 | 0 % | 2 (81, 73 : pas de -8) | – | 55 | 100 % | plus facile |
| mois | Ligne graduée, niveau 6 | plus facile | réelle | 32 | 26 | 0 % | 2 (47, 41 : pas de -6) | – | 38 | 75 % | plus facile |
| mois | Ligne graduée, niveau 6 | plus facile | pressée | 19 | 14 | 0 % | 2 (48, 49 : pas de +1) | L3×1 L1×1 | 25 | 11 % | plus facile |
| mois | Ligne graduée, niveau 6 | conseillé | appliquée | 39 | 29 | 0 % | 2 (75, 76 : pas de +1) | – | 92 | 100 % | conseillé |
| mois | Ligne graduée, niveau 6 | conseillé | réelle | 25 | 19 | 0 % | 2 (23, 24 : pas de +1) | L1×1 | 60 | 78 % | conseillé |
| mois | Ligne graduée, niveau 6 | conseillé | pressée | 19 | 15 | 0 % | 2 (73, 82 : pas de +9) | L3×1 L1×1 | 34 | 17 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus dur | appliquée | 38 | 34 | 0 % | 2 (25, 22 : pas de -3) | – | 125 | 100 % | plus dur |
| mois | Ligne graduée, niveau 6 | plus dur | réelle | 23 | 18 | 0 % | 2 (83, 89 : pas de +6) | L1×1 | 59 | 71 % | conseillé |
| mois | Ligne graduée, niveau 6 | plus dur | pressée | 20 | 15 | 0 % | 2 (47, 43 : pas de -4) | L1×1 L3×1 | 28 | 11 % | conseillé |
| mois | Ligne graduée, niveau 6 | très dur | appliquée | 40 | 33 | 0 % | 2 (62, 54 : pas de -8) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 6 | très dur | réelle | 21 | 13 | 0 % | 2 (79, 74 : pas de -5) | L1×1 | 90 | 76 % | plus dur |
| mois | Ligne graduée, niveau 6 | très dur | pressée | 19 | 13 | 0 % | 2 (23, 24 : pas de +1) | L3×1 L1×1 | 32 | 16 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus facile | appliquée | 40 | 26 | 0 % | 2 (76, 70 : pas de -6) | – | 55 | 100 % | plus facile |
| mois | Ligne graduée, niveau 7 | plus facile | réelle | 21 | 12 | 0 % | 2 (80, 70 : pas de -10) | L3×1 | 37 | 77 % | plus facile |
| mois | Ligne graduée, niveau 7 | plus facile | pressée | 23 | 13 | 0 % | 3 (40, 50, 60 : pas de +10) | L1×1 L2×1 | 27 | 15 % | plus facile |
| mois | Ligne graduée, niveau 7 | conseillé | appliquée | 40 | 24 | 0 % | 2 (38, 40 : pas de +2) | – | 91 | 100 % | conseillé |
| mois | Ligne graduée, niveau 7 | conseillé | réelle | 24 | 19 | 0 % | 2 (80, 90 : pas de +10) | L3×1 | 57 | 73 % | conseillé |
| mois | Ligne graduée, niveau 7 | conseillé | pressée | 18 | 9 | 0 % | 2 (90, 86 : pas de -4) | L1×1 L2×1 | 30 | 14 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus dur | appliquée | 39 | 24 | 0 % | 2 (70, 60 : pas de -10) | – | 122 | 100 % | plus dur |
| mois | Ligne graduée, niveau 7 | plus dur | réelle | 21 | 12 | 0 % | 2 (50, 60 : pas de +10) | L2×1 | 70 | 71 % | conseillé |
| mois | Ligne graduée, niveau 7 | plus dur | pressée | 19 | 13 | 0 % | 2 (50, 60 : pas de +10) | L2×1 L1×1 | 31 | 16 % | conseillé |
| mois | Ligne graduée, niveau 7 | très dur | appliquée | 40 | 26 | 0 % | 2 (70, 80 : pas de +10) | – | 160 | 100 % | très dur |
| mois | Ligne graduée, niveau 7 | très dur | réelle | 27 | 20 | 0 % | 2 (50, 60 : pas de +10) | L3×1 | 114 | 78 % | très dur |
| mois | Ligne graduée, niveau 7 | très dur | pressée | 19 | 12 | 0 % | 2 (76, 79 : pas de +3) | L1×1 L3×1 | 34 | 16 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus facile | appliquée | 33 | 11 | 0 % | 3 (70, 75, 80 : pas de +5) | – | 51 | 100 % | plus facile |
| mois | Ligne graduée, niveau 8 | plus facile | réelle | 28 | 11 | 0 % | 3 (80, 70, 60 : pas de -10) | – | 39 | 76 % | plus facile |
| mois | Ligne graduée, niveau 8 | plus facile | pressée | 29 | 11 | 0 % | 2 (20, 25 : pas de +5) | – | 20 | 12 % | plus facile |
| mois | Ligne graduée, niveau 8 | conseillé | appliquée | 33 | 11 | 0 % | 2 (40, 30 : pas de -10) | – | 84 | 100 % | conseillé |
| mois | Ligne graduée, niveau 8 | conseillé | réelle | 31 | 11 | 0 % | 3 (30, 25, 20 : pas de -5) | – | 72 | 83 % | conseillé |
| mois | Ligne graduée, niveau 8 | conseillé | pressée | 28 | 11 | 0 % | 2 (25, 30 : pas de +5) | – | 24 | 8 % | conseillé |
| mois | Ligne graduée, niveau 8 | plus dur | appliquée | 33 | 11 | 0 % | 3 (30, 40, 50 : pas de +10) | – | 113 | 100 % | plus dur |
| mois | Ligne graduée, niveau 8 | plus dur | réelle | 29 | 11 | 0 % | 2 (30, 40 : pas de +10) | – | 84 | 75 % | plus dur |
| mois | Ligne graduée, niveau 8 | plus dur | pressée | 27 | 11 | 0 % | 3 (30, 20, 10 : pas de -10) | – | 22 | 9 % | conseillé |
| mois | Ligne graduée, niveau 8 | très dur | appliquée | 33 | 11 | 0 % | 3 (60, 70, 80 : pas de +10) | – | 144 | 100 % | très dur |
| mois | Ligne graduée, niveau 8 | très dur | réelle | 28 | 11 | 0 % | 2 (70, 75 : pas de +5) | – | 88 | 72 % | plus dur |
| mois | Ligne graduée, niveau 8 | très dur | pressée | 27 | 11 | 0 % | 3 (80, 70, 60 : pas de -10) | – | 19 | 6 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus facile | appliquée | 34 | 6 | 0 % | aucune | L10×1 | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 9 | plus facile | réelle | 19 | 6 | 0 % | aucune | L10×1 L1×1 | 39 | 68 % | plus facile |
| mois | Ligne graduée, niveau 9 | plus facile | pressée | 20 | 6 | 0 % | aucune | L10×1 L1×1 | 24 | 8 % | plus facile |
| mois | Ligne graduée, niveau 9 | conseillé | appliquée | 34 | 8 | 0 % | aucune | L10×1 | 87 | 100 % | conseillé |
| mois | Ligne graduée, niveau 9 | conseillé | réelle | 20 | 8 | 0 % | aucune | L10×1 L1×1 | 60 | 78 % | conseillé |
| mois | Ligne graduée, niveau 9 | conseillé | pressée | 25 | 8 | 0 % | aucune | L10×1 | 28 | 13 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus dur | appliquée | 34 | 9 | 0 % | aucune | L10×1 | 117 | 100 % | plus dur |
| mois | Ligne graduée, niveau 9 | plus dur | réelle | 18 | 9 | 0 % | aucune | L10×1 L1×1 | 76 | 82 % | conseillé |
| mois | Ligne graduée, niveau 9 | plus dur | pressée | 18 | 8 | 0 % | aucune | L10×1 L1×1 | 26 | 6 % | conseillé |
| mois | Ligne graduée, niveau 9 | très dur | appliquée | 27 | 9 | 0 % | aucune | L10×1 | 133 | 100 % | très dur |
| mois | Ligne graduée, niveau 9 | très dur | réelle | 18 | 9 | 0 % | aucune | L10×1 L1×1 | 88 | 71 % | plus dur |
| mois | Ligne graduée, niveau 9 | très dur | pressée | 18 | 8 | 0 % | aucune | L10×1 L1×1 | 30 | 11 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus facile | appliquée | 39 | 30 | 0 % | 2 (780, 770 : pas de -10) | – | 52 | 100 % | plus facile |
| mois | Ligne graduée, niveau 10 | plus facile | réelle | 21 | 17 | 0 % | aucune | L1×1 | 36 | 68 % | plus facile |
| mois | Ligne graduée, niveau 10 | plus facile | pressée | 18 | 13 | 0 % | aucune | L10×1 L1×1 | 27 | 17 % | plus facile |
| mois | Ligne graduée, niveau 10 | conseillé | appliquée | 40 | 33 | 0 % | 2 (530, 540 : pas de +10) | – | 89 | 100 % | conseillé |
| mois | Ligne graduée, niveau 10 | conseillé | réelle | 30 | 24 | 0 % | aucune | L1×1 | 68 | 80 % | conseillé |
| mois | Ligne graduée, niveau 10 | conseillé | pressée | 18 | 13 | 0 % | aucune | L3×1 L10×1 | 31 | 14 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus dur | appliquée | 40 | 21 | 0 % | 2 (150, 160 : pas de +10) | – | 126 | 100 % | plus dur |
| mois | Ligne graduée, niveau 10 | plus dur | réelle | 24 | 16 | 0 % | 2 (840, 850 : pas de +10) | L1×1 | 72 | 81 % | conseillé |
| mois | Ligne graduée, niveau 10 | plus dur | pressée | 23 | 16 | 0 % | 2 (660, 670 : pas de +10) | L1×1 L10×1 | 34 | 16 % | conseillé |
| mois | Ligne graduée, niveau 10 | très dur | appliquée | 38 | 35 | 0 % | 2 (340, 330 : pas de -10) | – | 152 | 100 % | très dur |
| mois | Ligne graduée, niveau 10 | très dur | réelle | 25 | 21 | 0 % | aucune | L1×1 | 119 | 90 % | très dur |
| mois | Ligne graduée, niveau 10 | très dur | pressée | 19 | 14 | 0 % | 2 (640, 630 : pas de -10) | L10×1 L1×1 | 30 | 13 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus facile | appliquée | 40 | 38 | 0 % | 2 (354, 353 : pas de -1) | – | 53 | 100 % | plus facile |
| mois | Ligne graduée, niveau 11 | plus facile | réelle | 31 | 26 | 0 % | 2 (464, 467 : pas de +3) | – | 39 | 74 % | plus facile |
| mois | Ligne graduée, niveau 11 | plus facile | pressée | 18 | 14 | 0 % | 2 (899, 893 : pas de -6) | L10×1 L1×1 | 25 | 13 % | plus facile |
| mois | Ligne graduée, niveau 11 | conseillé | appliquée | 40 | 37 | 0 % | 2 (794, 784 : pas de -10) | – | 90 | 100 % | conseillé |
| mois | Ligne graduée, niveau 11 | conseillé | réelle | 23 | 20 | 0 % | 2 (132, 125 : pas de -7) | L3×1 | 59 | 76 % | conseillé |
| mois | Ligne graduée, niveau 11 | conseillé | pressée | 20 | 14 | 0 % | 2 (394, 398 : pas de +4) | L10×1 L3×1 | 33 | 15 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus dur | appliquée | 39 | 37 | 0 % | aucune | – | 126 | 100 % | plus dur |
| mois | Ligne graduée, niveau 11 | plus dur | réelle | 19 | 18 | 0 % | 2 (389, 392 : pas de +3) | L10×1 L1×1 | 71 | 78 % | conseillé |
| mois | Ligne graduée, niveau 11 | plus dur | pressée | 26 | 18 | 0 % | aucune | L10×1 | 31 | 16 % | conseillé |
| mois | Ligne graduée, niveau 11 | très dur | appliquée | 40 | 39 | 0 % | 2 (352, 360 : pas de +8) | – | 164 | 100 % | très dur |
| mois | Ligne graduée, niveau 11 | très dur | réelle | 31 | 26 | 0 % | 2 (460, 463 : pas de +3) | L10×1 | 106 | 79 % | plus dur |
| mois | Ligne graduée, niveau 11 | très dur | pressée | 19 | 14 | 0 % | 2 (727, 722 : pas de -5) | L1×1 L3×1 | 27 | 8 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus facile | appliquée | 40 | 27 | 0 % | aucune | – | 55 | 100 % | plus facile |
| mois | Ligne graduée, niveau 12 | plus facile | réelle | 24 | 16 | 0 % | 2 (828, 837 : pas de +9) | L10×1 | 38 | 76 % | plus facile |
| mois | Ligne graduée, niveau 12 | plus facile | pressée | 26 | 16 | 0 % | aucune | – | 17 | 7 % | plus facile |
| mois | Ligne graduée, niveau 12 | conseillé | appliquée | 40 | 30 | 0 % | 2 (500, 509 : pas de +9) | – | 90 | 100 % | conseillé |
| mois | Ligne graduée, niveau 12 | conseillé | réelle | 31 | 23 | 0 % | 2 (907, 906 : pas de -1) | – | 66 | 77 % | conseillé |
| mois | Ligne graduée, niveau 12 | conseillé | pressée | 26 | 14 | 0 % | aucune | – | 18 | 4 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus dur | appliquée | 40 | 30 | 0 % | 2 (911, 907 : pas de -4) | – | 126 | 100 % | plus dur |
| mois | Ligne graduée, niveau 12 | plus dur | réelle | 23 | 19 | 0 % | 2 (253, 252 : pas de -1) | L10×1 | 60 | 77 % | conseillé |
| mois | Ligne graduée, niveau 12 | plus dur | pressée | 26 | 15 | 0 % | aucune | – | 18 | 4 % | conseillé |
| mois | Ligne graduée, niveau 12 | très dur | appliquée | 40 | 28 | 0 % | 2 (603, 600 : pas de -3) | – | 156 | 100 % | très dur |
| mois | Ligne graduée, niveau 12 | très dur | réelle | 29 | 20 | 0 % | 2 (605, 600 : pas de -5) | – | 104 | 71 % | plus dur |
| mois | Ligne graduée, niveau 12 | très dur | pressée | 26 | 16 | 0 % | aucune | – | 21 | 6 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus facile | appliquée | 33 | 11 | 0 % | aucune | – | 51 | 100 % | plus facile |
| mois | Ligne graduée, niveau 13 | plus facile | réelle | 31 | 11 | 0 % | aucune | – | 40 | 80 % | plus facile |
| mois | Ligne graduée, niveau 13 | plus facile | pressée | 30 | 11 | 0 % | aucune | – | 21 | 15 % | plus facile |
| mois | Ligne graduée, niveau 13 | conseillé | appliquée | 33 | 11 | 0 % | aucune | – | 84 | 100 % | conseillé |
| mois | Ligne graduée, niveau 13 | conseillé | réelle | 29 | 11 | 0 % | aucune | – | 57 | 71 % | conseillé |
| mois | Ligne graduée, niveau 13 | conseillé | pressée | 27 | 11 | 0 % | aucune | – | 21 | 8 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus dur | appliquée | 33 | 11 | 0 % | aucune | – | 113 | 100 % | plus dur |
| mois | Ligne graduée, niveau 13 | plus dur | réelle | 33 | 11 | 0 % | aucune | – | 72 | 81 % | conseillé |
| mois | Ligne graduée, niveau 13 | plus dur | pressée | 27 | 11 | 0 % | aucune | – | 21 | 6 % | conseillé |
| mois | Ligne graduée, niveau 13 | très dur | appliquée | 33 | 11 | 0 % | aucune | – | 142 | 100 % | très dur |
| mois | Ligne graduée, niveau 13 | très dur | réelle | 33 | 11 | 0 % | aucune | – | 100 | 85 % | plus dur |
| mois | Ligne graduée, niveau 13 | très dur | pressée | 27 | 11 | 0 % | aucune | – | 21 | 9 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | appliquée | 24 | 5 | 13 % | 3 (8, 9, 10 : pas de +1) | – | 45 | 100 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | réelle | 18 | 6 | 6 % | 3 (5, 7, 9 : pas de +2) | – | 32 | 66 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | plus facile | pressée | 21 | 8 | 5 % | 3 (10, 9, 8 : pas de -1) | – | 19 | 12 % | plus facile |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | appliquée | 40 | 10 | 10 % | 3 (8, 7, 6 : pas de -1) | – | 93 | 100 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | réelle | 31 | 8 | 7 % | 2 (7, 9 : pas de +2) | – | 66 | 75 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | conseillé | pressée | 26 | 8 | 16 % | 3 (8, 5, 2 : pas de -3) | – | 26 | 14 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | appliquée | 40 | 10 | 3 % | 3 (2, 5, 8 : pas de +3) | – | 122 | 100 % | plus dur |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | réelle | 30 | 10 | 3 % | 2 (3, 6 : pas de +3) | – | 93 | 83 % | plus dur |
| mois | Additions, famille 1 (+ 1 et + 2) | plus dur | pressée | 26 | 8 | 12 % | 3 (5, 3, 1 : pas de -2) | – | 19 | 6 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | appliquée | 40 | 9 | 15 % | 3 (3, 2, 1 : pas de -1) | – | 162 | 100 % | très dur |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | réelle | 30 | 10 | 10 % | 2 (10, 8 : pas de -2) | – | 83 | 80 % | conseillé |
| mois | Additions, famille 1 (+ 1 et + 2) | très dur | pressée | 26 | 8 | 8 % | 3 (5, 3, 1 : pas de -2) | – | 21 | 7 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | appliquée | 19 | 6 | 6 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 45 | 100 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | réelle | 14 | 5 | 0 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 32 | 65 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus facile | pressée | 17 | 5 | 0 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 21 | 8 % | plus facile |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | appliquée | 33 | 10 | 3 % | 2 (4, 3 : pas de -1) | L4×1 | 85 | 100 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | réelle | 26 | 10 | 0 % | 3 (4, 6, 8 : pas de +2) | L4×1 | 63 | 75 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | conseillé | pressée | 24 | 7 | 9 % | 3 (6, 7, 8 : pas de +1) | L4×1 | 27 | 10 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | appliquée | 33 | 10 | 3 % | 3 (3, 4, 5 : pas de +1) | L4×1 | 116 | 100 % | plus dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | réelle | 24 | 8 | 0 % | 2 (4, 6 : pas de +2) | L4×1 | 83 | 86 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | plus dur | pressée | 23 | 7 | 0 % | 3 (2, 5, 8 : pas de +3) | L4×1 | 23 | 6 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | appliquée | 33 | 7 | 6 % | 3 (3, 5, 7 : pas de +2) | L4×1 | 149 | 100 % | très dur |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | réelle | 21 | 9 | 0 % | 3 (2, 3, 4 : pas de +1) | L4×1 | 74 | 67 % | conseillé |
| mois | Additions, famille 2 (doubles jusqu'à 5) | très dur | pressée | 24 | 8 | 0 % | 3 (4, 3, 2 : pas de -1) | L4×1 | 25 | 10 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus facile | appliquée | 24 | 9 | 13 % | 3 (4, 3, 2 : pas de -1) | – | 46 | 100 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | réelle | 22 | 8 | 5 % | 2 (7, 2 : pas de -5) | – | 36 | 85 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | plus facile | pressée | 16 | 8 | 13 % | 3 (8, 7, 6 : pas de -1) | L5×1 | 20 | 8 % | plus facile |
| mois | Additions, famille 3 (amis de 10) | conseillé | appliquée | 40 | 9 | 8 % | 3 (8, 7, 6 : pas de -1) | – | 92 | 100 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | réelle | 22 | 8 | 0 % | 2 (7, 2 : pas de -5) | L5×1 | 53 | 69 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | conseillé | pressée | 22 | 7 | 0 % | 3 (7, 5, 3 : pas de -2) | L5×1 | 27 | 12 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | appliquée | 40 | 9 | 8 % | 3 (9, 5, 1 : pas de -4) | – | 126 | 100 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | plus dur | réelle | 23 | 8 | 23 % | 3 (5, 3, 1 : pas de -2) | L5×1 | 57 | 71 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | plus dur | pressée | 21 | 8 | 10 % | 2 (8, 3 : pas de -5) | L5×1 | 26 | 9 % | conseillé |
| mois | Additions, famille 3 (amis de 10) | très dur | appliquée | 40 | 9 | 13 % | 3 (1, 4, 7 : pas de +3) | – | 156 | 100 % | très dur |
| mois | Additions, famille 3 (amis de 10) | très dur | réelle | 23 | 9 | 9 % | 3 (7, 4, 1 : pas de -3) | L5×1 | 89 | 74 % | plus dur |
| mois | Additions, famille 3 (amis de 10) | très dur | pressée | 21 | 8 | 5 % | 3 (8, 7, 6 : pas de -1) | L5×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | appliquée | 19 | 7 | 0 % | 2 (5, 4 : pas de -1) | L6×1 | 45 | 100 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | réelle | 17 | 6 | 19 % | 2 (6, 3 : pas de -3) | L6×1 | 36 | 74 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus facile | pressée | 17 | 7 | 6 % | 3 (2, 4, 6 : pas de +2) | L6×1 | 21 | 10 % | plus facile |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | appliquée | 33 | 9 | 3 % | 3 (3, 5, 7 : pas de +2) | L6×1 | 86 | 100 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | réelle | 26 | 8 | 12 % | 3 (6, 4, 2 : pas de -2) | L6×1 | 65 | 83 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | conseillé | pressée | 21 | 6 | 5 % | 3 (2, 4, 6 : pas de +2) | L6×1 | 21 | 5 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | appliquée | 33 | 9 | 6 % | 3 (4, 5, 6 : pas de +1) | L6×1 | 114 | 100 % | plus dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | réelle | 23 | 7 | 9 % | 2 (6, 3 : pas de -3) | L6×1 | 52 | 61 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | plus dur | pressée | 21 | 6 | 5 % | 3 (1, 4, 7 : pas de +3) | L6×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | appliquée | 33 | 7 | 16 % | 3 (1, 2, 3 : pas de +1) | L6×1 | 151 | 100 % | très dur |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | réelle | 23 | 9 | 5 % | 3 (7, 4, 1 : pas de -3) | L6×1 | 65 | 68 % | conseillé |
| mois | Additions, famille 4 (maisons de 5, 6 et 7) | très dur | pressée | 21 | 7 | 5 % | 3 (2, 4, 6 : pas de +2) | L6×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | appliquée | 19 | 7 | 0 % | 3 (9, 6, 3 : pas de -3) | L6×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | réelle | 17 | 8 | 0 % | 3 (9, 5, 1 : pas de -4) | L6×1 | 37 | 81 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus facile | pressée | 16 | 6 | 0 % | 2 (8, 6 : pas de -2) | L6×1 | 18 | 2 % | plus facile |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | appliquée | 33 | 10 | 6 % | 3 (9, 6, 3 : pas de -3) | L6×1 | 86 | 100 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | réelle | 27 | 9 | 4 % | 3 (5, 7, 9 : pas de +2) | L6×1 | 61 | 73 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | conseillé | pressée | 21 | 7 | 10 % | 3 (9, 5, 1 : pas de -4) | L6×1 | 19 | 2 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | appliquée | 33 | 9 | 9 % | 3 (5, 3, 1 : pas de -2) | L6×1 | 116 | 100 % | plus dur |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | réelle | 24 | 9 | 4 % | 2 (5, 4 : pas de -1) | L6×1 | 76 | 71 % | plus dur |
| mois | Additions, famille 5 (maisons de 8 et 9) | plus dur | pressée | 22 | 8 | 10 % | 3 (8, 5, 2 : pas de -3) | L6×1 | 23 | 6 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | appliquée | 33 | 8 | 3 % | 3 (5, 4, 3 : pas de -1) | L6×1 | 151 | 100 % | très dur |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | réelle | 24 | 9 | 9 % | 2 (6, 4 : pas de -2) | L6×1 | 65 | 69 % | conseillé |
| mois | Additions, famille 5 (maisons de 8 et 9) | très dur | pressée | 21 | 7 | 5 % | 3 (9, 8, 7 : pas de -1) | L6×1 | 26 | 11 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus facile | appliquée | 19 | 7 | 17 % | 3 (9, 5, 1 : pas de -4) | L4×1 | 46 | 100 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | plus facile | réelle | 14 | 6 | 0 % | 2 (5, 7 : pas de +2) | L4×1 | 34 | 73 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | plus facile | pressée | 16 | 7 | 13 % | 2 (3, 7 : pas de +4) | L4×1 | 20 | 7 % | plus facile |
| mois | Additions, famille 6 (presque-doubles) | conseillé | appliquée | 33 | 8 | 16 % | 2 (5, 4 : pas de -1) | L4×1 | 89 | 100 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | conseillé | réelle | 18 | 5 | 0 % | 3 (5, 4, 3 : pas de -1) | L4×1 | 49 | 56 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | conseillé | pressée | 21 | 7 | 5 % | 2 (3, 5 : pas de +2) | L4×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus dur | appliquée | 33 | 9 | 6 % | 3 (2, 3, 4 : pas de +1) | L4×1 | 114 | 100 % | plus dur |
| mois | Additions, famille 6 (presque-doubles) | plus dur | réelle | 26 | 8 | 0 % | 3 (3, 2, 1 : pas de -1) | L4×1 | 71 | 81 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | plus dur | pressée | 23 | 8 | 5 % | 3 (9, 5, 1 : pas de -4) | L4×1 | 22 | 6 % | conseillé |
| mois | Additions, famille 6 (presque-doubles) | très dur | appliquée | 33 | 8 | 6 % | 3 (2, 3, 4 : pas de +1) | L4×1 | 147 | 100 % | très dur |
| mois | Additions, famille 6 (presque-doubles) | très dur | réelle | 25 | 7 | 8 % | 3 (2, 3, 4 : pas de +1) | L4×1 | 104 | 84 % | très dur |
| mois | Additions, famille 6 (presque-doubles) | très dur | pressée | 22 | 7 | 5 % | 3 (3, 5, 7 : pas de +2) | L4×1 | 21 | 5 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus facile | appliquée | 24 | 5 | 26 % | 2 (8, 10 : pas de +2) | – | 45 | 100 % | plus facile |
| mois | Additions, famille 7 (mélange) | plus facile | réelle | 21 | 6 | 25 % | 2 (8, 3 : pas de -5) | – | 34 | 78 % | plus facile |
| mois | Additions, famille 7 (mélange) | plus facile | pressée | 19 | 7 | 6 % | 2 (10, 8 : pas de -2) | – | 17 | 6 % | plus facile |
| mois | Additions, famille 7 (mélange) | conseillé | appliquée | 40 | 10 | 8 % | 2 (8, 10 : pas de +2) | – | 92 | 100 % | conseillé |
| mois | Additions, famille 7 (mélange) | conseillé | réelle | 29 | 9 | 7 % | 3 (7, 6, 5 : pas de -1) | – | 62 | 75 % | conseillé |
| mois | Additions, famille 7 (mélange) | conseillé | pressée | 28 | 7 | 7 % | 3 (7, 8, 9 : pas de +1) | – | 26 | 12 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus dur | appliquée | 40 | 10 | 3 % | 3 (5, 7, 9 : pas de +2) | – | 122 | 100 % | plus dur |
| mois | Additions, famille 7 (mélange) | plus dur | réelle | 26 | 8 | 4 % | 3 (10, 6, 2 : pas de -4) | – | 66 | 67 % | conseillé |
| mois | Additions, famille 7 (mélange) | plus dur | pressée | 27 | 8 | 15 % | 3 (4, 3, 2 : pas de -1) | – | 23 | 10 % | conseillé |
| mois | Additions, famille 7 (mélange) | très dur | appliquée | 40 | 8 | 5 % | 2 (8, 10 : pas de +2) | – | 164 | 100 % | très dur |
| mois | Additions, famille 7 (mélange) | très dur | réelle | 26 | 9 | 8 % | 3 (9, 8, 7 : pas de -1) | – | 74 | 68 % | conseillé |
| mois | Additions, famille 7 (mélange) | très dur | pressée | 26 | 9 | 4 % | 3 (9, 5, 1 : pas de -4) | – | 20 | 6 % | conseillé |
| mois | Additions, famille 8 (dix et quelques) | plus facile | appliquée | 19 | 7 | 11 % | 2 (18, 19 : pas de +1) | L11×1 | 45 | 100 % | plus facile |
| mois | Additions, famille 8 (dix et quelques) | plus facile | réelle | 18 | 6 | 6 % | 2 (14, 13 : pas de -1) | L11×1 | 36 | 77 % | plus facile |
| mois | Additions, famille 8 (dix et quelques) | plus facile | pressée | 16 | 5 | 7 % | 2 (12, 19 : pas de +7) | L11×1 | 19 | 5 % | plus facile |
| mois | Additions, famille 8 (dix et quelques) | conseillé | appliquée | 33 | 13 | 3 % | 2 (13, 18 : pas de +5) | L11×1 | 85 | 100 % | conseillé |
| mois | Additions, famille 8 (dix et quelques) | conseillé | réelle | 23 | 10 | 9 % | 2 (15, 11 : pas de -4) | L11×1 | 52 | 66 % | conseillé |
| mois | Additions, famille 8 (dix et quelques) | conseillé | pressée | 22 | 8 | 10 % | 2 (14, 12 : pas de -2) | L11×1 | 22 | 5 % | conseillé |
| mois | Additions, famille 8 (dix et quelques) | plus dur | appliquée | 33 | 17 | 0 % | 2 (13, 19 : pas de +6) | L11×1 | 114 | 100 % | plus dur |
| mois | Additions, famille 8 (dix et quelques) | plus dur | réelle | 25 | 10 | 0 % | 2 (14, 13 : pas de -1) | L11×1 | 87 | 81 % | plus dur |
| mois | Additions, famille 8 (dix et quelques) | plus dur | pressée | 23 | 6 | 5 % | 2 (19, 13 : pas de -6) | L11×1 | 24 | 8 % | conseillé |
| mois | Additions, famille 8 (dix et quelques) | très dur | appliquée | 33 | 10 | 13 % | 2 (11, 1 : pas de -10) | L11×1 | 145 | 100 % | très dur |
| mois | Additions, famille 8 (dix et quelques) | très dur | réelle | 25 | 11 | 8 % | 2 (19, 15 : pas de -4) | L11×1 | 73 | 70 % | conseillé |
| mois | Additions, famille 8 (dix et quelques) | très dur | pressée | 21 | 7 | 5 % | 2 (17, 15 : pas de -2) | L11×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | appliquée | 19 | 10 | 0 % | 3 (18, 20, 22 : pas de +2) | L4×1 | 46 | 100 % | plus facile |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | réelle | 15 | 8 | 0 % | 3 (14, 16, 18 : pas de +2) | L4×1 | 32 | 61 % | plus facile |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus facile | pressée | 15 | 7 | 0 % | 2 (24, 30 : pas de +6) | L4×1 | 20 | 8 % | plus facile |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | appliquée | 33 | 13 | 0 % | 3 (28, 20, 12 : pas de -8) | L4×1 | 88 | 100 % | conseillé |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | réelle | 22 | 9 | 0 % | 3 (24, 26, 28 : pas de +2) | L4×1 | 55 | 67 % | conseillé |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | conseillé | pressée | 21 | 9 | 0 % | 3 (26, 18, 10 : pas de -8) | L4×1 | 21 | 5 % | conseillé |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | appliquée | 33 | 18 | 3 % | 2 (14, 11 : pas de -3) | L4×1 | 116 | 100 % | plus dur |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | réelle | 23 | 14 | 0 % | 2 (26, 30 : pas de +4) | L4×1 | 59 | 76 % | conseillé |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | plus dur | pressée | 21 | 8 | 0 % | 3 (20, 14, 8 : pas de -6) | L4×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | appliquée | 33 | 13 | 0 % | 3 (10, 11, 12 : pas de +1) | L4×1 | 145 | 100 % | très dur |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | réelle | 24 | 13 | 9 % | 3 (10, 9, 8 : pas de -1) | L4×1 | 102 | 78 % | très dur |
| mois | Additions, famille 9 (doubles jusqu'à 15 + 15) | très dur | pressée | 22 | 10 | 0 % | 3 (12, 14, 16 : pas de +2) | L4×1 | 22 | 6 % | conseillé |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | appliquée | 19 | 5 | 17 % | 3 (19, 15, 11 : pas de -4) | L4×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | réelle | 15 | 5 | 21 % | 2 (17, 13 : pas de -4) | L4×1 | 35 | 73 % | plus facile |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | plus facile | pressée | 16 | 5 | 13 % | 3 (11, 15, 19 : pas de +4) | L4×1 | 19 | 3 % | plus facile |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | appliquée | 33 | 10 | 13 % | 3 (11, 13, 15 : pas de +2) | L4×1 | 86 | 100 % | conseillé |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | réelle | 24 | 8 | 9 % | 3 (3, 11, 19 : pas de +8) | L4×1 | 65 | 83 % | conseillé |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | conseillé | pressée | 23 | 6 | 9 % | 3 (13, 15, 17 : pas de +2) | L4×1 | 24 | 8 % | conseillé |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | appliquée | 33 | 12 | 0 % | 2 (17, 11 : pas de -6) | L4×1 | 117 | 100 % | plus dur |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | réelle | 20 | 7 | 5 % | 3 (13, 15, 17 : pas de +2) | L4×1 | 51 | 58 % | conseillé |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | plus dur | pressée | 21 | 7 | 5 % | 3 (17, 15, 13 : pas de -2) | L4×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | appliquée | 33 | 10 | 9 % | 3 (5, 7, 9 : pas de +2) | L4×1 | 151 | 100 % | très dur |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | réelle | 25 | 8 | 13 % | 3 (9, 5, 1 : pas de -4) | L4×1 | 95 | 77 % | plus dur |
| mois | Additions, famille 10 (presque-doubles jusqu'à 10) | très dur | pressée | 23 | 6 | 5 % | 3 (11, 13, 15 : pas de +2) | L4×1 | 24 | 6 % | conseillé |
| mois | Additions, famille 11 (+ 9) | plus facile | appliquée | 19 | 7 | 6 % | 3 (16, 14, 12 : pas de -2) | L12×1 | 47 | 100 % | plus facile |
| mois | Additions, famille 11 (+ 9) | plus facile | réelle | 16 | 5 | 7 % | 3 (17, 16, 15 : pas de -1) | L12×1 | 34 | 67 % | plus facile |
| mois | Additions, famille 11 (+ 9) | plus facile | pressée | 16 | 5 | 7 % | 2 (11, 16 : pas de +5) | L12×1 | 19 | 3 % | plus facile |
| mois | Additions, famille 11 (+ 9) | conseillé | appliquée | 33 | 12 | 3 % | 2 (16, 11 : pas de -5) | L12×1 | 85 | 100 % | conseillé |
| mois | Additions, famille 11 (+ 9) | conseillé | réelle | 22 | 9 | 10 % | 3 (11, 13, 15 : pas de +2) | L12×1 | 53 | 68 % | conseillé |
| mois | Additions, famille 11 (+ 9) | conseillé | pressée | 21 | 7 | 5 % | 2 (11, 18 : pas de +7) | L12×1 | 23 | 8 % | conseillé |
| mois | Additions, famille 11 (+ 9) | plus dur | appliquée | 33 | 15 | 0 % | 2 (12, 14 : pas de +2) | L12×1 | 120 | 100 % | plus dur |
| mois | Additions, famille 11 (+ 9) | plus dur | réelle | 25 | 11 | 0 % | 2 (17, 12 : pas de -5) | L12×1 | 60 | 69 % | conseillé |
| mois | Additions, famille 11 (+ 9) | plus dur | pressée | 21 | 7 | 5 % | 2 (13, 17 : pas de +4) | L12×1 | 20 | 3 % | conseillé |
| mois | Additions, famille 11 (+ 9) | très dur | appliquée | 33 | 10 | 9 % | 3 (9, 6, 3 : pas de -3) | L12×1 | 151 | 100 % | très dur |
| mois | Additions, famille 11 (+ 9) | très dur | réelle | 23 | 8 | 5 % | 3 (17, 15, 13 : pas de -2) | L12×1 | 52 | 61 % | conseillé |
| mois | Additions, famille 11 (+ 9) | très dur | pressée | 22 | 8 | 10 % | 3 (11, 13, 15 : pas de +2) | L12×1 | 28 | 8 % | conseillé |
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
| mois | Additions, famille 13 (grand mélange) | plus facile | appliquée | 24 | 5 | 26 % | 2 (8, 10 : pas de +2) | – | 45 | 100 % | plus facile |
| mois | Additions, famille 13 (grand mélange) | plus facile | réelle | 18 | 6 | 6 % | 2 (7, 9 : pas de +2) | – | 29 | 61 % | plus facile |
| mois | Additions, famille 13 (grand mélange) | plus facile | pressée | 19 | 7 | 11 % | 2 (10, 8 : pas de -2) | – | 16 | 3 % | plus facile |
| mois | Additions, famille 13 (grand mélange) | conseillé | appliquée | 40 | 10 | 0 % | 3 (1, 2, 3 : pas de +1) | – | 90 | 100 % | conseillé |
| mois | Additions, famille 13 (grand mélange) | conseillé | réelle | 31 | 9 | 3 % | 2 (7, 8 : pas de +1) | – | 65 | 81 % | conseillé |
| mois | Additions, famille 13 (grand mélange) | conseillé | pressée | 25 | 8 | 17 % | 2 (10, 8 : pas de -2) | – | 24 | 11 % | conseillé |
| mois | Additions, famille 13 (grand mélange) | plus dur | appliquée | 40 | 10 | 5 % | 3 (7, 4, 1 : pas de -3) | – | 125 | 100 % | plus dur |
| mois | Additions, famille 13 (grand mélange) | plus dur | réelle | 28 | 8 | 7 % | 3 (8, 7, 6 : pas de -1) | – | 55 | 70 % | conseillé |
| mois | Additions, famille 13 (grand mélange) | plus dur | pressée | 26 | 7 | 12 % | 3 (1, 2, 3 : pas de +1) | – | 24 | 11 % | conseillé |
| mois | Additions, famille 13 (grand mélange) | très dur | appliquée | 40 | 9 | 5 % | 3 (3, 2, 1 : pas de -1) | – | 156 | 100 % | très dur |
| mois | Additions, famille 13 (grand mélange) | très dur | réelle | 31 | 7 | 13 % | 3 (8, 7, 6 : pas de -1) | – | 62 | 72 % | conseillé |
| mois | Additions, famille 13 (grand mélange) | très dur | pressée | 27 | 8 | 8 % | 3 (5, 7, 9 : pas de +2) | – | 25 | 11 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | appliquée | 29 | 25 | 0 % | 2 (34, 36 : pas de +2) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | réelle | 23 | 19 | 0 % | 2 (64, 59 : pas de -5) | – | 36 | 71 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus facile | pressée | 19 | 9 | 6 % | 2 (67, 57 : pas de -10) | – | 15 | 2 % | plus facile |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | appliquée | 41 | 36 | 0 % | 2 (10, 19 : pas de +9) | – | 91 | 100 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | réelle | 29 | 17 | 0 % | 2 (12, 11 : pas de -1) | – | 65 | 74 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | conseillé | pressée | 22 | 13 | 0 % | 2 (64, 60 : pas de -4) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | appliquée | 40 | 35 | 0 % | 2 (71, 77 : pas de +6) | – | 126 | 100 % | plus dur |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | réelle | 28 | 18 | 4 % | 2 (58, 53 : pas de -5) | – | 66 | 74 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | plus dur | pressée | 22 | 13 | 0 % | 2 (16, 20 : pas de +4) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | appliquée | 43 | 38 | 0 % | 2 (63, 68 : pas de +5) | – | 162 | 100 % | très dur |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | réelle | 28 | 24 | 0 % | 2 (85, 76 : pas de -9) | – | 92 | 78 % | conseillé |
| mois | Calcul rapide, niveau 1 (petit, ligne) | très dur | pressée | 23 | 14 | 0 % | 2 (79, 70 : pas de -9) | – | 19 | 5 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | appliquée | 29 | 23 | 4 % | 2 (29, 26 : pas de -3) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | réelle | 22 | 16 | 0 % | 2 (82, 80 : pas de -2) | – | 35 | 75 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus facile | pressée | 19 | 11 | 0 % | 2 (95, 87 : pas de -8) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | appliquée | 43 | 30 | 0 % | 2 (47, 41 : pas de -6) | – | 92 | 100 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | réelle | 28 | 21 | 0 % | 2 (84, 94 : pas de +10) | – | 67 | 81 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | conseillé | pressée | 22 | 12 | 0 % | 2 (83, 91 : pas de +8) | – | 15 | 0 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | appliquée | 42 | 36 | 0 % | 2 (13, 22 : pas de +9) | – | 131 | 100 % | plus dur |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | réelle | 33 | 28 | 0 % | 2 (92, 100 : pas de +8) | – | 72 | 83 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | plus dur | pressée | 22 | 13 | 0 % | 2 (93, 100 : pas de +7) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | appliquée | 43 | 34 | 0 % | 2 (19, 14 : pas de -5) | – | 164 | 100 % | très dur |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | réelle | 21 | 15 | 0 % | 2 (72, 74 : pas de +2) | L7×1 | 60 | 60 % | conseillé |
| mois | Calcul rapide, niveau 2 (dizaine, mur) | très dur | pressée | 23 | 13 | 0 % | 2 (12, 6 : pas de -6) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | appliquée | 29 | 24 | 0 % | 2 (49, 39 : pas de -10) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | réelle | 24 | 20 | 0 % | 2 (94, 90 : pas de -4) | – | 36 | 82 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus facile | pressée | 19 | 11 | 0 % | 2 (56, 65 : pas de +9) | – | 16 | 5 % | plus facile |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | appliquée | 43 | 36 | 0 % | 2 (74, 83 : pas de +9) | – | 92 | 100 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | réelle | 29 | 22 | 0 % | 2 (30, 20 : pas de -10) | – | 64 | 80 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | conseillé | pressée | 22 | 13 | 0 % | 2 (72, 67 : pas de -5) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | appliquée | 43 | 32 | 0 % | 2 (80, 74 : pas de -6) | – | 128 | 100 % | plus dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | réelle | 31 | 23 | 3 % | 2 (94, 92 : pas de -2) | – | 91 | 81 % | plus dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | plus dur | pressée | 22 | 11 | 0 % | 2 (79, 87 : pas de +8) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | appliquée | 41 | 34 | 0 % | 2 (84, 88 : pas de +4) | – | 160 | 100 % | très dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | réelle | 22 | 16 | 0 % | 2 (32, 26 : pas de -6) | L7×1 | 102 | 77 % | très dur |
| mois | Calcul rapide, niveau 3 (dizaines, mur) | très dur | pressée | 22 | 13 | 0 % | 2 (57, 64 : pas de +7) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | appliquée | 30 | 22 | 3 % | 2 (88, 97 : pas de +9) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | réelle | 23 | 18 | 0 % | 2 (25, 29 : pas de +4) | – | 35 | 69 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus facile | pressée | 19 | 11 | 0 % | 2 (77, 68 : pas de -9) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | appliquée | 40 | 24 | 3 % | 2 (18, 27 : pas de +9) | – | 92 | 100 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | réelle | 31 | 21 | 0 % | 2 (37, 35 : pas de -2) | – | 75 | 85 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | conseillé | pressée | 22 | 14 | 0 % | 2 (37, 29 : pas de -8) | – | 19 | 6 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | appliquée | 43 | 32 | 5 % | 2 (25, 35 : pas de +10) | – | 131 | 100 % | plus dur |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | réelle | 28 | 17 | 4 % | 2 (39, 38 : pas de -1) | – | 74 | 71 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | plus dur | pressée | 22 | 15 | 0 % | 2 (78, 77 : pas de -1) | – | 17 | 3 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | appliquée | 43 | 6 | 10 % | 3 (3, 5, 7 : pas de +2) | – | 162 | 100 % | très dur |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | réelle | 35 | 22 | 3 % | 2 (34, 35 : pas de +1) | – | 82 | 75 % | conseillé |
| mois | Calcul rapide, niveau 4 (unitesPlus, ligne) | très dur | pressée | 23 | 13 | 0 % | 2 (87, 85 : pas de -2) | – | 18 | 3 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | appliquée | 30 | 25 | 0 % | 2 (55, 61 : pas de +6) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | réelle | 23 | 18 | 0 % | 2 (46, 41 : pas de -5) | – | 34 | 71 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus facile | pressée | 21 | 13 | 0 % | 2 (33, 43 : pas de +10) | – | 17 | 8 % | plus facile |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | appliquée | 43 | 37 | 2 % | 2 (63, 64 : pas de +1) | – | 93 | 100 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | réelle | 29 | 20 | 4 % | 2 (75, 65 : pas de -10) | – | 63 | 76 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | conseillé | pressée | 23 | 13 | 0 % | 2 (51, 41 : pas de -10) | – | 21 | 9 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | appliquée | 43 | 32 | 0 % | 2 (83, 81 : pas de -2) | – | 126 | 100 % | plus dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | réelle | 29 | 19 | 7 % | 2 (82, 80 : pas de -2) | – | 64 | 69 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | plus dur | pressée | 22 | 12 | 0 % | 2 (21, 30 : pas de +9) | – | 17 | 2 % | conseillé |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | appliquée | 43 | 6 | 14 % | 3 (6, 4, 2 : pas de -2) | – | 164 | 100 % | très dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | réelle | 29 | 6 | 11 % | 3 (4, 5, 6 : pas de +1) | – | 111 | 77 % | très dur |
| mois | Calcul rapide, niveau 5 (unitesMoins, ligne) | très dur | pressée | 22 | 13 | 5 % | 2 (50, 51 : pas de +1) | – | 18 | 5 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | appliquée | 29 | 27 | 0 % | 2 (54, 48 : pas de -6) | – | 48 | 100 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | réelle | 18 | 16 | 0 % | 2 (62, 70 : pas de +8) | L9×1 | 34 | 66 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus facile | pressée | 19 | 13 | 0 % | 2 (41, 51 : pas de +10) | – | 15 | 2 % | plus facile |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | appliquée | 41 | 32 | 0 % | 2 (23, 30 : pas de +7) | – | 92 | 100 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | réelle | 26 | 22 | 0 % | 2 (50, 40 : pas de -10) | – | 58 | 75 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | conseillé | pressée | 18 | 13 | 0 % | 2 (40, 46 : pas de +6) | L8×1 | 20 | 3 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | appliquée | 41 | 37 | 0 % | 2 (36, 28 : pas de -8) | – | 126 | 100 % | plus dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | réelle | 29 | 21 | 0 % | 2 (86, 95 : pas de +9) | – | 60 | 70 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | plus dur | pressée | 18 | 13 | 0 % | 2 (46, 37 : pas de -9) | L8×1 | 21 | 5 % | conseillé |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | appliquée | 42 | 35 | 0 % | 2 (58, 66 : pas de +8) | – | 168 | 100 % | très dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | réelle | 32 | 24 | 0 % | 2 (43, 46 : pas de +3) | – | 117 | 76 % | très dur |
| mois | Calcul rapide, niveau 6 (plus9, mur) | très dur | pressée | 18 | 13 | 0 % | 3 (46, 56, 66 : pas de +10) | L8×1 | 19 | 2 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | appliquée | 23 | 18 | 0 % | 2 (85, 95 : pas de +10) | L9×1 | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | réelle | 16 | 13 | 0 % | 2 (85, 86 : pas de +1) | L9×1 | 31 | 59 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus facile | pressée | 16 | 10 | 0 % | 2 (91, 82 : pas de -9) | L9×1 | 19 | 3 % | plus facile |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | appliquée | 33 | 26 | 0 % | 2 (23, 22 : pas de -1) | L9×1 | 89 | 100 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | réelle | 23 | 19 | 0 % | 2 (82, 75 : pas de -7) | L9×1 | 59 | 76 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | conseillé | pressée | 18 | 12 | 0 % | 2 (82, 72 : pas de -10) | L9×1 | 20 | 3 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | appliquée | 33 | 24 | 3 % | 2 (32, 26 : pas de -6) | L9×1 | 116 | 100 % | plus dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | réelle | 21 | 16 | 0 % | 2 (45, 52 : pas de +7) | L9×1 | 68 | 74 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | plus dur | pressée | 18 | 11 | 0 % | 2 (42, 51 : pas de +9) | L9×1 | 23 | 5 % | conseillé |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | appliquée | 34 | 6 | 6 % | 3 (8, 7, 6 : pas de -1) | L9×1 | 155 | 100 % | très dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | réelle | 25 | 6 | 4 % | 3 (8, 6, 4 : pas de -2) | L9×1 | 123 | 87 % | très dur |
| mois | Calcul rapide, niveau 7 (passerPlus, ligne) | très dur | pressée | 18 | 12 | 0 % | 2 (23, 21 : pas de -2) | L9×1 | 23 | 3 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | appliquée | 29 | 21 | 4 % | 2 (66, 69 : pas de +3) | – | 49 | 100 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | réelle | 21 | 15 | 5 % | 2 (58, 63 : pas de +5) | – | 34 | 75 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus facile | pressée | 19 | 12 | 0 % | 2 (38, 43 : pas de +5) | – | 16 | 3 % | plus facile |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | appliquée | 41 | 32 | 3 % | 2 (75, 73 : pas de -2) | – | 90 | 100 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | réelle | 30 | 22 | 3 % | 2 (84, 87 : pas de +3) | – | 62 | 74 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | conseillé | pressée | 22 | 13 | 5 % | 2 (87, 86 : pas de -1) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | appliquée | 41 | 23 | 3 % | 2 (68, 69 : pas de +1) | – | 125 | 100 % | plus dur |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | réelle | 30 | 21 | 3 % | 2 (58, 59 : pas de +1) | – | 63 | 71 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | plus dur | pressée | 22 | 12 | 10 % | 2 (55, 59 : pas de +4) | – | 20 | 7 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | appliquée | 43 | 28 | 2 % | 3 (31, 37, 43 : pas de +6) | – | 164 | 100 % | très dur |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | réelle | 29 | 20 | 4 % | 2 (87, 96 : pas de +9) | – | 91 | 79 % | conseillé |
| mois | Calcul rapide, niveau 8 (deuxNombres, mur) | très dur | pressée | 22 | 14 | 0 % | 2 (77, 78 : pas de +1) | – | 23 | 10 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | appliquée | 29 | 21 | 4 % | 2 (26, 18 : pas de -8) | – | 47 | 100 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | réelle | 22 | 15 | 0 % | 2 (74, 73 : pas de -1) | – | 33 | 71 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus facile | pressée | 19 | 12 | 0 % | 2 (36, 34 : pas de -2) | – | 16 | 5 % | plus facile |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | appliquée | 41 | 29 | 3 % | 2 (56, 57 : pas de +1) | – | 93 | 100 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | réelle | 29 | 22 | 0 % | 2 (74, 78 : pas de +4) | – | 62 | 76 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | conseillé | pressée | 22 | 15 | 0 % | 2 (79, 87 : pas de +8) | – | 18 | 3 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | appliquée | 40 | 25 | 3 % | 2 (38, 28 : pas de -10) | – | 125 | 100 % | plus dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | réelle | 29 | 17 | 4 % | 2 (67, 69 : pas de +2) | – | 62 | 71 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | plus dur | pressée | 22 | 13 | 5 % | 2 (38, 45 : pas de +7) | – | 16 | 2 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | appliquée | 43 | 6 | 7 % | 3 (6, 5, 4 : pas de -1) | – | 164 | 100 % | très dur |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | réelle | 30 | 15 | 7 % | 3 (6, 7, 8 : pas de +1) | – | 92 | 68 % | conseillé |
| mois | Calcul rapide, niveau 9 (passerMoins, ligne) | très dur | pressée | 22 | 12 | 0 % | 2 (27, 18 : pas de -9) | – | 16 | 2 % | conseillé |
| mois | Multiplication, niveau 1 (groupes) | plus facile | appliquée | 33 | 10 | 0 % | 2 (8, 15 : pas de +7) | L13×1 | 54 | 100 % | plus facile |
| mois | Multiplication, niveau 1 (groupes) | plus facile | réelle | 24 | 8 | 9 % | 2 (12, 8 : pas de -4) | L13×1 | 40 | 73 % | plus facile |
| mois | Multiplication, niveau 1 (groupes) | plus facile | pressée | 21 | 7 | 5 % | 2 (8, 15 : pas de +7) | L13×1 | 19 | 3 % | plus facile |
| mois | Multiplication, niveau 1 (groupes) | conseillé | appliquée | 33 | 10 | 6 % | 3 (15, 12, 9 : pas de -3) | L13×1 | 88 | 100 % | conseillé |
| mois | Multiplication, niveau 1 (groupes) | conseillé | réelle | 24 | 10 | 0 % | 2 (15, 12 : pas de -3) | L13×1 | 57 | 71 % | conseillé |
| mois | Multiplication, niveau 1 (groupes) | conseillé | pressée | 22 | 8 | 5 % | 3 (12, 8, 4 : pas de -4) | L13×1 | 21 | 5 % | conseillé |
| mois | Multiplication, niveau 1 (groupes) | plus dur | appliquée | 33 | 10 | 6 % | 3 (10, 15, 20 : pas de +5) | L13×1 | 120 | 100 % | plus dur |
| mois | Multiplication, niveau 1 (groupes) | plus dur | réelle | 24 | 10 | 0 % | 2 (10, 20 : pas de +10) | L13×1 | 59 | 73 % | conseillé |
| mois | Multiplication, niveau 1 (groupes) | plus dur | pressée | 21 | 8 | 0 % | 3 (8, 6, 4 : pas de -2) | L13×1 | 24 | 9 % | conseillé |
| mois | Multiplication, niveau 1 (groupes) | très dur | appliquée | 33 | 10 | 0 % | 3 (4, 12, 20 : pas de +8) | L13×1 | 149 | 100 % | très dur |
| mois | Multiplication, niveau 1 (groupes) | très dur | réelle | 26 | 10 | 4 % | 3 (20, 15, 10 : pas de -5) | L13×1 | 93 | 85 % | plus dur |
| mois | Multiplication, niveau 1 (groupes) | très dur | pressée | 21 | 8 | 10 % | 3 (12, 10, 8 : pas de -2) | L13×1 | 21 | 5 % | conseillé |
| mois | Multiplication, niveau 2 (groupes) | plus facile | appliquée | 41 | 10 | 3 % | 3 (8, 10, 12 : pas de +2) | – | 55 | 100 % | plus facile |
| mois | Multiplication, niveau 2 (groupes) | plus facile | réelle | 24 | 10 | 4 % | 2 (10, 8 : pas de -2) | L13×1 | 40 | 80 % | plus facile |
| mois | Multiplication, niveau 2 (groupes) | plus facile | pressée | 26 | 9 | 4 % | 3 (10, 9, 8 : pas de -1) | – | 16 | 3 % | plus facile |
| mois | Multiplication, niveau 2 (groupes) | conseillé | appliquée | 41 | 10 | 5 % | 3 (4, 6, 8 : pas de +2) | – | 93 | 100 % | conseillé |
| mois | Multiplication, niveau 2 (groupes) | conseillé | réelle | 26 | 10 | 4 % | 2 (15, 20 : pas de +5) | L13×1 | 64 | 81 % | conseillé |
| mois | Multiplication, niveau 2 (groupes) | conseillé | pressée | 26 | 10 | 0 % | 2 (9, 16 : pas de +7) | – | 17 | 3 % | conseillé |
| mois | Multiplication, niveau 2 (groupes) | plus dur | appliquée | 41 | 10 | 5 % | 3 (12, 16, 20 : pas de +4) | – | 126 | 100 % | plus dur |
| mois | Multiplication, niveau 2 (groupes) | plus dur | réelle | 23 | 9 | 0 % | 3 (6, 9, 12 : pas de +3) | L13×1 | 81 | 74 % | plus dur |
| mois | Multiplication, niveau 2 (groupes) | plus dur | pressée | 23 | 8 | 0 % | 3 (6, 8, 10 : pas de +2) | L13×1 | 21 | 5 % | conseillé |
| mois | Multiplication, niveau 2 (groupes) | très dur | appliquée | 41 | 10 | 5 % | 2 (25, 15 : pas de -10) | – | 158 | 100 % | très dur |
| mois | Multiplication, niveau 2 (groupes) | très dur | réelle | 18 | 10 | 0 % | 3 (8, 6, 4 : pas de -2) | L13×1 | 73 | 69 % | conseillé |
| mois | Multiplication, niveau 2 (groupes) | très dur | pressée | 26 | 10 | 8 % | 3 (10, 15, 20 : pas de +5) | – | 24 | 10 % | conseillé |
| mois | Multiplication, niveau 3 (table 2) | plus facile | appliquée | 24 | 10 | 4 % | 3 (6, 12, 18 : pas de +6) | – | 45 | 100 % | plus facile |
| mois | Multiplication, niveau 3 (table 2) | plus facile | réelle | 17 | 8 | 0 % | 3 (20, 18, 16 : pas de -2) | L13×1 | 38 | 82 % | plus facile |
| mois | Multiplication, niveau 3 (table 2) | plus facile | pressée | 20 | 8 | 5 % | 3 (16, 12, 8 : pas de -4) | – | 16 | 3 % | plus facile |
| mois | Multiplication, niveau 3 (table 2) | conseillé | appliquée | 41 | 10 | 5 % | 2 (10, 20 : pas de +10) | – | 90 | 100 % | conseillé |
| mois | Multiplication, niveau 3 (table 2) | conseillé | réelle | 24 | 10 | 4 % | 2 (6, 2 : pas de -4) | L13×1 | 62 | 78 % | conseillé |
| mois | Multiplication, niveau 3 (table 2) | conseillé | pressée | 27 | 10 | 4 % | 3 (16, 18, 20 : pas de +2) | – | 20 | 6 % | conseillé |
| mois | Multiplication, niveau 3 (table 2) | plus dur | appliquée | 41 | 10 | 0 % | 3 (10, 12, 14 : pas de +2) | – | 129 | 100 % | plus dur |
| mois | Multiplication, niveau 3 (table 2) | plus dur | réelle | 23 | 9 | 9 % | 3 (8, 12, 16 : pas de +4) | L13×1 | 64 | 74 % | conseillé |
| mois | Multiplication, niveau 3 (table 2) | plus dur | pressée | 26 | 9 | 4 % | 3 (20, 16, 12 : pas de -4) | – | 19 | 6 % | conseillé |
| mois | Multiplication, niveau 3 (table 2) | très dur | appliquée | 41 | 9 | 13 % | 3 (6, 7, 8 : pas de +1) | – | 164 | 100 % | très dur |
| mois | Multiplication, niveau 3 (table 2) | très dur | réelle | 31 | 11 | 23 % | 3 (6, 8, 10 : pas de +2) | – | 113 | 79 % | très dur |
| mois | Multiplication, niveau 3 (table 2) | très dur | pressée | 26 | 9 | 4 % | 2 (20, 18 : pas de -2) | – | 18 | 4 % | conseillé |
| mois | Multiplication, niveau 4 (table 10) | plus facile | appliquée | 24 | 10 | 0 % | 2 (60, 70 : pas de +10) | – | 46 | 100 % | plus facile |
| mois | Multiplication, niveau 4 (table 10) | plus facile | réelle | 15 | 8 | 0 % | 2 (60, 70 : pas de +10) | L13×1 | 35 | 73 % | plus facile |
| mois | Multiplication, niveau 4 (table 10) | plus facile | pressée | 20 | 7 | 0 % | 2 (20, 10 : pas de -10) | – | 16 | 5 % | plus facile |
| mois | Multiplication, niveau 4 (table 10) | conseillé | appliquée | 41 | 10 | 3 % | 3 (90, 80, 70 : pas de -10) | – | 92 | 100 % | conseillé |
| mois | Multiplication, niveau 4 (table 10) | conseillé | réelle | 24 | 9 | 0 % | 3 (100, 90, 80 : pas de -10) | L13×1 | 60 | 71 % | conseillé |
| mois | Multiplication, niveau 4 (table 10) | conseillé | pressée | 26 | 10 | 4 % | 3 (60, 70, 80 : pas de +10) | – | 16 | 1 % | conseillé |
| mois | Multiplication, niveau 4 (table 10) | plus dur | appliquée | 41 | 10 | 5 % | 2 (30, 20 : pas de -10) | – | 126 | 100 % | plus dur |
| mois | Multiplication, niveau 4 (table 10) | plus dur | réelle | 22 | 10 | 5 % | 2 (50, 40 : pas de -10) | L13×1 | 58 | 60 % | conseillé |
| mois | Multiplication, niveau 4 (table 10) | plus dur | pressée | 27 | 9 | 0 % | 3 (40, 30, 20 : pas de -10) | – | 19 | 4 % | conseillé |
| mois | Multiplication, niveau 4 (table 10) | très dur | appliquée | 41 | 10 | 20 % | 2 (10, 3 : pas de -7) | – | 162 | 100 % | très dur |
| mois | Multiplication, niveau 4 (table 10) | très dur | réelle | 33 | 10 | 22 % | 2 (10, 3 : pas de -7) | – | 121 | 80 % | très dur |
| mois | Multiplication, niveau 4 (table 10) | très dur | pressée | 21 | 10 | 0 % | 3 (50, 60, 70 : pas de +10) | L13×1 | 21 | 5 % | conseillé |
| mois | Multiplication, niveau 5 (table 5) | plus facile | appliquée | 24 | 10 | 0 % | 2 (25, 20 : pas de -5) | – | 45 | 100 % | plus facile |
| mois | Multiplication, niveau 5 (table 5) | plus facile | réelle | 22 | 10 | 0 % | 3 (25, 35, 45 : pas de +10) | – | 36 | 84 % | plus facile |
| mois | Multiplication, niveau 5 (table 5) | plus facile | pressée | 20 | 9 | 0 % | 3 (10, 20, 30 : pas de +10) | – | 16 | 3 % | plus facile |
| mois | Multiplication, niveau 5 (table 5) | conseillé | appliquée | 41 | 10 | 5 % | 3 (15, 10, 5 : pas de -5) | – | 94 | 100 % | conseillé |
| mois | Multiplication, niveau 5 (table 5) | conseillé | réelle | 29 | 9 | 7 % | 3 (20, 25, 30 : pas de +5) | – | 61 | 77 % | conseillé |
| mois | Multiplication, niveau 5 (table 5) | conseillé | pressée | 22 | 10 | 0 % | 3 (25, 35, 45 : pas de +10) | L13×1 | 22 | 6 % | conseillé |
| mois | Multiplication, niveau 5 (table 5) | plus dur | appliquée | 41 | 10 | 3 % | 3 (40, 30, 20 : pas de -10) | – | 129 | 100 % | plus dur |
| mois | Multiplication, niveau 5 (table 5) | plus dur | réelle | 23 | 9 | 0 % | 2 (30, 40 : pas de +10) | L13×1 | 63 | 78 % | conseillé |
| mois | Multiplication, niveau 5 (table 5) | plus dur | pressée | 26 | 9 | 4 % | 2 (30, 40 : pas de +10) | – | 19 | 4 % | conseillé |
| mois | Multiplication, niveau 5 (table 5) | très dur | appliquée | 41 | 10 | 18 % | 3 (3, 4, 5 : pas de +1) | – | 158 | 100 % | très dur |
| mois | Multiplication, niveau 5 (table 5) | très dur | réelle | 25 | 10 | 4 % | 3 (25, 30, 35 : pas de +5) | L13×1 | 93 | 84 % | plus dur |
| mois | Multiplication, niveau 5 (table 5) | très dur | pressée | 26 | 9 | 0 % | 2 (20, 10 : pas de -10) | – | 22 | 10 % | conseillé |
| mois | Multiplication, niveau 6 (tourner) | plus facile | appliquée | 19 | 13 | 11 % | 2 (14, 12 : pas de -2) | L14×1 | 47 | 100 % | plus facile |
| mois | Multiplication, niveau 6 (tourner) | plus facile | réelle | 17 | 13 | 0 % | 3 (14, 16, 18 : pas de +2) | L14×1 | 38 | 86 % | plus facile |
| mois | Multiplication, niveau 6 (tourner) | plus facile | pressée | 16 | 10 | 0 % | 3 (36, 28, 20 : pas de -8) | L14×1 | 20 | 7 % | plus facile |
| mois | Multiplication, niveau 6 (tourner) | conseillé | appliquée | 33 | 16 | 3 % | 2 (10, 16 : pas de +6) | L14×1 | 89 | 100 % | conseillé |
| mois | Multiplication, niveau 6 (tourner) | conseillé | réelle | 25 | 14 | 0 % | 2 (20, 16 : pas de -4) | L14×1 | 61 | 77 % | conseillé |
| mois | Multiplication, niveau 6 (tourner) | conseillé | pressée | 21 | 10 | 5 % | 2 (20, 18 : pas de -2) | L14×1 | 21 | 5 % | conseillé |
| mois | Multiplication, niveau 6 (tourner) | plus dur | appliquée | 33 | 16 | 0 % | 3 (30, 35, 40 : pas de +5) | L14×1 | 120 | 100 % | plus dur |
| mois | Multiplication, niveau 6 (tourner) | plus dur | réelle | 16 | 9 | 0 % | 2 (20, 12 : pas de -8) | L14×1 L13×1 | 59 | 66 % | conseillé |
| mois | Multiplication, niveau 6 (tourner) | plus dur | pressée | 21 | 10 | 15 % | 2 (15, 6 : pas de -9) | L14×1 | 20 | 3 % | conseillé |
| mois | Multiplication, niveau 6 (tourner) | très dur | appliquée | 33 | 15 | 6 % | 2 (28, 20 : pas de -8) | L14×1 | 145 | 100 % | très dur |
| mois | Multiplication, niveau 6 (tourner) | très dur | réelle | 18 | 13 | 0 % | 3 (24, 18, 12 : pas de -6) | L14×1 L13×1 | 84 | 80 % | plus dur |
| mois | Multiplication, niveau 6 (tourner) | très dur | pressée | 21 | 10 | 0 % | 2 (15, 8 : pas de -7) | L14×1 | 19 | 2 % | conseillé |
| mois | Multiplication, niveau 7 (table 3) | plus facile | appliquée | 24 | 10 | 9 % | 3 (18, 12, 6 : pas de -6) | – | 45 | 100 % | plus facile |
| mois | Multiplication, niveau 7 (table 3) | plus facile | réelle | 14 | 9 | 0 % | 2 (3, 6 : pas de +3) | L13×1 | 34 | 74 % | plus facile |
| mois | Multiplication, niveau 7 (table 3) | plus facile | pressée | 20 | 9 | 5 % | 2 (12, 6 : pas de -6) | – | 16 | 5 % | plus facile |
| mois | Multiplication, niveau 7 (table 3) | conseillé | appliquée | 41 | 10 | 8 % | 3 (12, 9, 6 : pas de -3) | – | 93 | 100 % | conseillé |
| mois | Multiplication, niveau 7 (table 3) | conseillé | réelle | 23 | 10 | 9 % | 3 (24, 15, 6 : pas de -9) | L13×1 | 58 | 78 % | conseillé |
| mois | Multiplication, niveau 7 (table 3) | conseillé | pressée | 21 | 9 | 5 % | 3 (21, 24, 27 : pas de +3) | L13×1 | 24 | 9 % | conseillé |
| mois | Multiplication, niveau 7 (table 3) | plus dur | appliquée | 41 | 10 | 0 % | 2 (18, 27 : pas de +9) | – | 128 | 100 % | plus dur |
| mois | Multiplication, niveau 7 (table 3) | plus dur | réelle | 22 | 9 | 5 % | 3 (12, 15, 18 : pas de +3) | L13×1 | 58 | 66 % | conseillé |
| mois | Multiplication, niveau 7 (table 3) | plus dur | pressée | 26 | 9 | 4 % | 2 (30, 27 : pas de -3) | – | 17 | 3 % | conseillé |
| mois | Multiplication, niveau 7 (table 3) | très dur | appliquée | 41 | 10 | 18 % | 3 (2, 3, 4 : pas de +1) | – | 164 | 100 % | très dur |
| mois | Multiplication, niveau 7 (table 3) | très dur | réelle | 33 | 10 | 16 % | 2 (3, 6 : pas de +3) | – | 125 | 82 % | très dur |
| mois | Multiplication, niveau 7 (table 3) | très dur | pressée | 25 | 8 | 4 % | 2 (27, 30 : pas de +3) | – | 25 | 7 % | conseillé |
| mois | Multiplication, niveau 8 (table 4) | plus facile | appliquée | 24 | 9 | 4 % | 3 (28, 32, 36 : pas de +4) | – | 46 | 100 % | plus facile |
| mois | Multiplication, niveau 8 (table 4) | plus facile | réelle | 16 | 8 | 20 % | 2 (8, 12 : pas de +4) | L13×1 | 36 | 77 % | plus facile |
| mois | Multiplication, niveau 8 (table 4) | plus facile | pressée | 20 | 8 | 5 % | 3 (24, 28, 32 : pas de +4) | – | 16 | 5 % | plus facile |
| mois | Multiplication, niveau 8 (table 4) | conseillé | appliquée | 41 | 10 | 3 % | 2 (28, 24 : pas de -4) | – | 94 | 100 % | conseillé |
| mois | Multiplication, niveau 8 (table 4) | conseillé | réelle | 34 | 9 | 3 % | 3 (40, 36, 32 : pas de -4) | – | 71 | 84 % | conseillé |
| mois | Multiplication, niveau 8 (table 4) | conseillé | pressée | 26 | 9 | 8 % | 2 (4, 8 : pas de +4) | – | 19 | 4 % | conseillé |
| mois | Multiplication, niveau 8 (table 4) | plus dur | appliquée | 41 | 10 | 0 % | 3 (20, 24, 28 : pas de +4) | – | 129 | 100 % | plus dur |
| mois | Multiplication, niveau 8 (table 4) | plus dur | réelle | 27 | 10 | 8 % | 3 (32, 36, 40 : pas de +4) | L13×1 | 60 | 71 % | conseillé |
| mois | Multiplication, niveau 8 (table 4) | plus dur | pressée | 26 | 8 | 4 % | 3 (28, 24, 20 : pas de -4) | – | 19 | 6 % | conseillé |
| mois | Multiplication, niveau 8 (table 4) | très dur | appliquée | 41 | 11 | 25 % | 3 (2, 3, 4 : pas de +1) | – | 158 | 100 % | très dur |
| mois | Multiplication, niveau 8 (table 4) | très dur | réelle | 29 | 10 | 4 % | 2 (24, 20 : pas de -4) | – | 80 | 72 % | conseillé |
| mois | Multiplication, niveau 8 (table 4) | très dur | pressée | 21 | 9 | 0 % | 3 (20, 28, 36 : pas de +8) | L13×1 | 26 | 8 % | conseillé |
| mois | Multiplication, niveau 9 (tables) | plus facile | appliquée | 24 | 19 | 0 % | 2 (2, 8 : pas de +6) | – | 47 | 100 % | plus facile |
| mois | Multiplication, niveau 9 (tables) | plus facile | réelle | 20 | 15 | 0 % | 2 (2, 10 : pas de +8) | – | 33 | 74 % | plus facile |
| mois | Multiplication, niveau 9 (tables) | plus facile | pressée | 20 | 11 | 0 % | 2 (24, 25 : pas de +1) | – | 18 | 8 % | plus facile |
| mois | Multiplication, niveau 9 (tables) | conseillé | appliquée | 41 | 21 | 3 % | 3 (16, 18, 20 : pas de +2) | – | 92 | 100 % | conseillé |
| mois | Multiplication, niveau 9 (tables) | conseillé | réelle | 22 | 15 | 0 % | 2 (14, 16 : pas de +2) | L13×1 | 57 | 71 % | conseillé |
| mois | Multiplication, niveau 9 (tables) | conseillé | pressée | 24 | 14 | 0 % | 2 (50, 40 : pas de -10) | L13×1 | 22 | 4 % | conseillé |
| mois | Multiplication, niveau 9 (tables) | plus dur | appliquée | 41 | 25 | 0 % | 2 (50, 45 : pas de -5) | – | 125 | 100 % | plus dur |
| mois | Multiplication, niveau 9 (tables) | plus dur | réelle | 23 | 17 | 0 % | 2 (20, 28 : pas de +8) | L13×1 | 56 | 71 % | conseillé |
| mois | Multiplication, niveau 9 (tables) | plus dur | pressée | 26 | 15 | 0 % | 2 (12, 20 : pas de +8) | – | 18 | 4 % | conseillé |
| mois | Multiplication, niveau 9 (tables) | très dur | appliquée | 41 | 11 | 10 % | 3 (10, 8, 6 : pas de -2) | – | 164 | 100 % | très dur |
| mois | Multiplication, niveau 9 (tables) | très dur | réelle | 24 | 16 | 0 % | 2 (45, 35 : pas de -10) | L13×1 | 86 | 78 % | plus dur |
| mois | Multiplication, niveau 9 (tables) | très dur | pressée | 27 | 14 | 0 % | 2 (24, 21 : pas de -3) | – | 26 | 10 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | appliquée | 30 | 4 | 10 % | 3 (2, 1, 0 : pas de -1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | réelle | 26 | 4 | 16 % | 3 (3, 2, 1 : pas de -1) | – | 39 | 87 % | plus facile |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus facile | pressée | 22 | 4 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 20 | 14 % | plus facile |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | appliquée | 30 | 4 | 14 % | 2 (1, 3 : pas de +2) | – | 80 | 100 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | réelle | 26 | 4 | 28 % | 3 (2, 1, 0 : pas de -1) | – | 64 | 83 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | conseillé | pressée | 22 | 4 | 10 % | 3 (1, 2, 3 : pas de +1) | – | 25 | 8 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | appliquée | 30 | 4 | 14 % | 3 (3, 2, 1 : pas de -1) | – | 110 | 100 % | plus dur |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | réelle | 27 | 4 | 23 % | 2 (2, 0 : pas de -2) | – | 84 | 80 % | plus dur |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | plus dur | pressée | 21 | 4 | 15 % | 3 (1, 2, 3 : pas de +1) | – | 31 | 16 % | conseillé |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | appliquée | 30 | 4 | 21 % | 3 (0, 1, 2 : pas de +1) | – | 136 | 100 % | très dur |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | réelle | 21 | 4 | 20 % | 3 (3, 2, 1 : pas de -1) | – | 82 | 75 % | plus dur |
| mois | Voiliers, niveau 1 (3 bouées, dizaine, loin) | très dur | pressée | 19 | 4 | 11 % | 3 (1, 2, 3 : pas de +1) | – | 26 | 9 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | appliquée | 30 | 4 | 24 % | 3 (2, 1, 0 : pas de -1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | réelle | 22 | 4 | 14 % | 3 (3, 2, 1 : pas de -1) | – | 36 | 75 % | plus facile |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus facile | pressée | 22 | 4 | 14 % | 3 (1, 2, 3 : pas de +1) | – | 20 | 9 % | plus facile |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | appliquée | 30 | 4 | 17 % | 3 (1, 2, 3 : pas de +1) | – | 83 | 100 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | réelle | 24 | 4 | 9 % | 3 (1, 2, 3 : pas de +1) | – | 59 | 77 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | conseillé | pressée | 21 | 4 | 20 % | 3 (2, 1, 0 : pas de -1) | – | 30 | 17 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | appliquée | 30 | 4 | 21 % | 3 (3, 2, 1 : pas de -1) | – | 110 | 100 % | plus dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | réelle | 26 | 4 | 24 % | 3 (3, 2, 1 : pas de -1) | – | 79 | 86 % | plus dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | plus dur | pressée | 24 | 4 | 9 % | 3 (1, 2, 3 : pas de +1) | – | 34 | 14 % | conseillé |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | appliquée | 30 | 4 | 17 % | 3 (3, 2, 1 : pas de -1) | – | 144 | 100 % | très dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | réelle | 25 | 4 | 21 % | 3 (2, 1, 0 : pas de -1) | – | 85 | 80 % | plus dur |
| mois | Voiliers, niveau 2 (3 bouées, impair, partout) | très dur | pressée | 24 | 4 | 22 % | 3 (2, 1, 0 : pas de -1) | – | 34 | 16 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | appliquée | 30 | 4 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | réelle | 24 | 4 | 22 % | 3 (0, 1, 2 : pas de +1) | – | 35 | 70 % | plus facile |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus facile | pressée | 22 | 4 | 24 % | 3 (0, 1, 2 : pas de +1) | – | 24 | 17 % | plus facile |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | appliquée | 30 | 4 | 21 % | 3 (3, 2, 1 : pas de -1) | – | 79 | 100 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | réelle | 24 | 4 | 26 % | 3 (3, 2, 1 : pas de -1) | – | 58 | 77 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | conseillé | pressée | 20 | 4 | 21 % | 2 (2, 3 : pas de +1) | – | 22 | 8 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | appliquée | 30 | 4 | 17 % | 2 (2, 3 : pas de +1) | – | 107 | 100 % | plus dur |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | réelle | 25 | 4 | 8 % | 3 (0, 1, 2 : pas de +1) | – | 60 | 71 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | plus dur | pressée | 22 | 4 | 5 % | 3 (3, 2, 1 : pas de -1) | – | 31 | 15 % | conseillé |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | appliquée | 30 | 4 | 21 % | 3 (2, 1, 0 : pas de -1) | – | 144 | 100 % | très dur |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | réelle | 27 | 4 | 27 % | 2 (2, 0 : pas de -2) | – | 85 | 81 % | plus dur |
| mois | Voiliers, niveau 3 (3 bouées, centaine, loin) | très dur | pressée | 22 | 4 | 10 % | 3 (2, 1, 0 : pas de -1) | – | 36 | 19 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | appliquée | 30 | 5 | 21 % | 3 (3, 2, 1 : pas de -1) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | réelle | 26 | 5 | 16 % | 2 (1, 3 : pas de +2) | – | 39 | 83 % | plus facile |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus facile | pressée | 22 | 5 | 5 % | 3 (0, 1, 2 : pas de +1) | – | 21 | 14 % | plus facile |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | appliquée | 30 | 5 | 14 % | 3 (0, 2, 4 : pas de +2) | – | 83 | 100 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | réelle | 22 | 5 | 10 % | 3 (0, 1, 2 : pas de +1) | – | 60 | 76 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | conseillé | pressée | 21 | 5 | 5 % | 3 (2, 3, 4 : pas de +1) | – | 26 | 10 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | appliquée | 30 | 5 | 21 % | 3 (4, 2, 0 : pas de -2) | – | 111 | 100 % | plus dur |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | réelle | 24 | 5 | 9 % | 3 (0, 2, 4 : pas de +2) | – | 81 | 77 % | plus dur |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | plus dur | pressée | 21 | 5 | 20 % | 3 (4, 3, 2 : pas de -1) | – | 27 | 10 % | conseillé |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | appliquée | 30 | 5 | 10 % | 3 (4, 3, 2 : pas de -1) | – | 144 | 100 % | très dur |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | réelle | 24 | 5 | 17 % | 3 (0, 2, 4 : pas de +2) | – | 109 | 82 % | très dur |
| mois | Voiliers, niveau 4 (4 bouées, dizaine, loin) | très dur | pressée | 22 | 5 | 10 % | 3 (4, 3, 2 : pas de -1) | – | 28 | 13 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | appliquée | 30 | 5 | 17 % | 2 (2, 3 : pas de +1) | – | 48 | 100 % | plus facile |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | réelle | 22 | 5 | 24 % | 3 (3, 2, 1 : pas de -1) | – | 35 | 69 % | plus facile |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus facile | pressée | 22 | 5 | 14 % | 3 (0, 1, 2 : pas de +1) | – | 22 | 10 % | plus facile |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | appliquée | 30 | 5 | 10 % | 3 (4, 3, 2 : pas de -1) | – | 81 | 100 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | réelle | 23 | 5 | 14 % | 3 (2, 3, 4 : pas de +1) | – | 55 | 71 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | conseillé | pressée | 20 | 5 | 11 % | 3 (0, 2, 4 : pas de +2) | – | 24 | 9 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | appliquée | 30 | 5 | 21 % | 3 (4, 2, 0 : pas de -2) | – | 110 | 100 % | plus dur |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | réelle | 23 | 5 | 5 % | 3 (0, 1, 2 : pas de +1) | – | 84 | 80 % | plus dur |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | plus dur | pressée | 21 | 5 | 20 % | 3 (3, 2, 1 : pas de -1) | – | 29 | 13 % | conseillé |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | appliquée | 30 | 5 | 14 % | 3 (0, 2, 4 : pas de +2) | – | 142 | 100 % | très dur |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | réelle | 25 | 5 | 13 % | 3 (0, 2, 4 : pas de +2) | – | 109 | 85 % | très dur |
| mois | Voiliers, niveau 5 (4 bouées, alterne, pres) | très dur | pressée | 22 | 5 | 5 % | 3 (0, 1, 2 : pas de +1) | – | 28 | 9 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | appliquée | 30 | 5 | 21 % | 3 (2, 1, 0 : pas de -1) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | réelle | 25 | 5 | 21 % | 2 (3, 0 : pas de -3) | – | 38 | 77 % | plus facile |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus facile | pressée | 20 | 5 | 11 % | 3 (0, 2, 4 : pas de +2) | – | 19 | 9 % | plus facile |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | appliquée | 30 | 5 | 3 % | 3 (2, 1, 0 : pas de -1) | – | 80 | 100 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | réelle | 24 | 5 | 17 % | 3 (4, 3, 2 : pas de -1) | – | 57 | 76 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | conseillé | pressée | 19 | 5 | 11 % | 3 (1, 2, 3 : pas de +1) | – | 24 | 10 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | appliquée | 30 | 5 | 17 % | 2 (0, 3 : pas de +3) | – | 113 | 100 % | plus dur |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | réelle | 23 | 5 | 5 % | 3 (0, 2, 4 : pas de +2) | – | 69 | 72 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | plus dur | pressée | 21 | 5 | 25 % | 3 (4, 3, 2 : pas de -1) | – | 27 | 8 % | conseillé |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | appliquée | 30 | 5 | 21 % | 3 (0, 1, 2 : pas de +1) | – | 142 | 100 % | très dur |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | réelle | 24 | 5 | 17 % | 3 (1, 2, 3 : pas de +1) | – | 99 | 84 % | plus dur |
| mois | Voiliers, niveau 6 (4 bouées, impair, pres) | très dur | pressée | 20 | 5 | 0 % | 3 (4, 2, 0 : pas de -2) | – | 32 | 14 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | appliquée | 30 | 6 | 14 % | 3 (2, 1, 0 : pas de -1) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | réelle | 25 | 6 | 17 % | 2 (5, 3 : pas de -2) | – | 44 | 84 % | plus facile |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus facile | pressée | 21 | 5 | 5 % | 3 (5, 3, 1 : pas de -2) | – | 18 | 9 % | plus facile |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | appliquée | 30 | 6 | 14 % | 3 (4, 2, 0 : pas de -2) | – | 82 | 100 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | réelle | 23 | 6 | 0 % | 3 (3, 2, 1 : pas de -1) | – | 53 | 67 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | conseillé | pressée | 21 | 6 | 0 % | 3 (1, 2, 3 : pas de +1) | – | 25 | 9 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | appliquée | 30 | 6 | 14 % | 2 (1, 0 : pas de -1) | – | 111 | 100 % | plus dur |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | réelle | 23 | 6 | 5 % | 3 (4, 2, 0 : pas de -2) | – | 70 | 80 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | plus dur | pressée | 19 | 6 | 6 % | 3 (1, 3, 5 : pas de +2) | – | 20 | 5 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | appliquée | 30 | 6 | 17 % | 2 (1, 3 : pas de +2) | – | 140 | 100 % | très dur |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | réelle | 23 | 6 | 14 % | 3 (2, 1, 0 : pas de -1) | – | 80 | 69 % | conseillé |
| mois | Voiliers, niveau 7 (5 bouées, dizaine, pres) | très dur | pressée | 21 | 6 | 25 % | 3 (0, 2, 4 : pas de +2) | – | 23 | 9 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | appliquée | 30 | 6 | 17 % | 3 (2, 1, 0 : pas de -1) | – | 49 | 100 % | plus facile |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | réelle | 25 | 6 | 13 % | 3 (1, 2, 3 : pas de +1) | – | 39 | 79 % | plus facile |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus facile | pressée | 22 | 6 | 14 % | 3 (5, 4, 3 : pas de -1) | – | 20 | 10 % | plus facile |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | appliquée | 30 | 6 | 14 % | 3 (4, 2, 0 : pas de -2) | – | 83 | 100 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | réelle | 23 | 5 | 18 % | 3 (3, 4, 5 : pas de +1) | – | 59 | 78 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | conseillé | pressée | 20 | 5 | 21 % | 2 (0, 1 : pas de +1) | – | 18 | 3 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | appliquée | 30 | 6 | 10 % | 3 (3, 2, 1 : pas de -1) | – | 113 | 100 % | plus dur |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | réelle | 23 | 6 | 18 % | 2 (1, 3 : pas de +2) | – | 76 | 81 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | plus dur | pressée | 20 | 6 | 16 % | 3 (2, 1, 0 : pas de -1) | – | 28 | 12 % | conseillé |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | appliquée | 30 | 6 | 10 % | 2 (3, 1 : pas de -2) | – | 140 | 100 % | très dur |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | réelle | 27 | 6 | 19 % | 2 (5, 4 : pas de -1) | – | 113 | 87 % | très dur |
| mois | Voiliers, niveau 8 (5 bouées, melange, pres) | très dur | pressée | 18 | 5 | 12 % | 3 (5, 3, 1 : pas de -2) | – | 20 | 6 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | appliquée | 23 | 11 | 9 % | 2 (21, 23 : pas de +2) | – | 46 | 100 % | plus facile |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | réelle | 15 | 8 | 7 % | 2 (34, 33 : pas de -1) | – | 32 | 60 % | plus facile |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus facile | pressée | 17 | 7 | 6 % | 3 (14, 24, 34 : pas de +10) | – | 17 | 8 % | plus facile |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | appliquée | 23 | 11 | 9 % | 2 (24, 34 : pas de +10) | – | 72 | 100 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | réelle | 15 | 8 | 7 % | 2 (12, 11 : pas de -1) | – | 51 | 68 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | conseillé | pressée | 18 | 9 | 6 % | 2 (31, 32 : pas de +1) | – | 22 | 6 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | appliquée | 23 | 10 | 5 % | 2 (33, 24 : pas de -9) | – | 101 | 100 % | plus dur |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | réelle | 17 | 8 | 6 % | 2 (13, 11 : pas de -2) | – | 65 | 80 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | plus dur | pressée | 18 | 7 | 6 % | 2 (14, 23 : pas de +9) | – | 18 | 5 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | appliquée | 23 | 10 | 5 % | 2 (11, 13 : pas de +2) | – | 122 | 100 % | très dur |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | réelle | 17 | 9 | 0 % | 2 (21, 11 : pas de -10) | – | 67 | 64 % | conseillé |
| mois | Voiliers, niveau 9 (4 bouées, double, partout) | très dur | pressée | 17 | 7 | 6 % | 2 (12, 22 : pas de +10) | – | 17 | 5 % | conseillé |
