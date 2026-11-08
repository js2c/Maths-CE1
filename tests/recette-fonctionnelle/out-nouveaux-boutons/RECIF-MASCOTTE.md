# Le temps d'image du récif, avec et sans la mascotte (banc Android, profil s5e)

Lot « Nouveaux boutons, mascotte du récif et étoiles », point 2. Mesuré par `node tests/e2e/recif-nettete.mjs --sans-captures` (profil `s5e` : 1138 × 711 px CSS, densité 2,25, processeur ralenti × 4 ; toute la collection, dix brillantes ; 5 s par zone, chaque niveau d'allègement tenu, puis la visite libre), l'une après l'autre, rien d'autre ne tournant :

- **sans** : la mascotte cachée dans le récif (la version d'avant, sans la petite tête : une copie de `app/` où le récif cache la mascotte) ;
- **avec la vidéo** : la vraie mascotte, réduite (118 × 157 px), ses deux lecteurs vidéo, tout le temps ;
- **avec la boucle** (gardé) : au repos, la boucle d'images (`art/mascotte/boucle.py`), la vidéo seulement le temps d'une phrase.

Chaque case : l'intervalle moyen entre deux images (ms), et entre parenthèses le travail du fil principal par image (ms). Sur le banc, l'intervalle est fait surtout du rendu logiciel de la carte graphique (SwiftShader, lot « Netteté du récif ») : il est bien au-dessus de 33 ms dans tous les cas, et le récif descend toujours jusqu'au dernier cran ; ce qui se compare, c'est l'écart entre les colonnes.

| Niveau | Zone | sans | avec la vidéo | avec la boucle |
| --- | --- | --- | --- | --- |
| 0 · complet | lagon | 180.4 (22.9) | 178.6 (20.7) | 182.7 (22.6) |
| 0 · complet | corail | 168.3 (33.1) | 179.2 (32.5) | 173 (32) |
| 0 · complet | large | 222.7 (11.6) | 261.4 (13.1) | 214.5 (10.6) |
| 0 · complet | abysses | 251.7 (11.1) | 300 (16.9) | 254.4 (9.6) |
| 1 · ondulation des créatures ralentie | lagon | 174.7 (19.8) | 179.2 (19.9) | 173.3 (18.5) |
| 1 · ondulation des créatures ralentie | corail | 186.4 (35.6) | 183.9 (31.3) | 171.7 (28) |
| 1 · ondulation des créatures ralentie | large | 211.1 (11.3) | 213.8 (11.8) | 210.4 (11) |
| 1 · ondulation des créatures ralentie | abysses | 220.3 (10.9) | 231.8 (15.5) | 223.9 (11.1) |
| 2 · définition un peu réduite | lagon | 124.6 (17.1) | 128.2 (14.9) | 128.6 (18.7) |
| 2 · définition un peu réduite | corail | 126.9 (22.3) | 132.9 (23.3) | 127.8 (22.3) |
| 2 · définition un peu réduite | large | 150 (11.2) | 165.5 (11.2) | 154.2 (10.2) |
| 2 · définition un peu réduite | abysses | 198.7 (12) | 188.5 (11.4) | 194.2 (13.5) |
| 3 · définition réduite de moitié | lagon | 97.4 (12.8) | 96.2 (12.5) | 94.9 (10.1) |
| 3 · définition réduite de moitié | corail | 82.2 (12.3) | 79.6 (11.8) | 73.3 (11) |
| 3 · définition réduite de moitié | large | 98 (10.1) | 110.4 (11.7) | 93.2 (9.7) |
| 3 · définition réduite de moitié | abysses | 140 (8) | 157.3 (12.4) | 147.5 (10.7) |

**Allègement pendant la visite libre** (le journal technique) :

- sans : cran 1 (ondulation des créatures ralentie) à 241 ms ; cran 2 (définition un peu réduite) à 159 ms ; cran 3 (définition réduite de moitié) à 153.6 ms
- avec la vidéo : cran 1 (ondulation des créatures ralentie) à 237.2 ms ; cran 2 (définition un peu réduite) à 186.4 ms ; cran 3 (définition réduite de moitié) à 160.3 ms
- avec la boucle : cran 1 (ondulation des créatures ralentie) à 301.7 ms ; cran 2 (définition un peu réduite) à 167.9 ms ; cran 3 (définition réduite de moitié) à 172.2 ms
