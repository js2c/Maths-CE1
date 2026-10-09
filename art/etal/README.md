# Maquette — l'étal du pêcheur (le décor de la monnaie)

**Maquette du décor, à valider par le parent** (9 octobre 2026). Elle contient la scène, ses animations, la pêche du jour sur l'étal, l'arrivée de l'orage et le portefeuille (pièces, billets, soucoupe) ; pas encore la consigne ni la validation d'un achat. Aucun fichier sous `app/` n'est modifié.

**Tester** : depuis la racine du dépôt, `python -m http.server 8080`, puis `http://localhost:8080/art/etal/`. Le capitaine vient de `art/mascotte/` (mêmes vidéos, même moteur). Le compteur en haut à droite donne les images par seconde.

## Ce qui bouge

| Élément | Comment |
| --- | --- |
| Nuages | La tuile du ciel défile lentement vers la gauche (3 px/s, 12 px/s par mauvais temps). Elle est faite du ciel de l'illustration suivi de son reflet en miroir : le raccord est invisible. |
| Vagues | La mer en trois bandes qui glissent vers la gauche, plus vite près de l'étal qu'à l'horizon (2, 5,5 et 11 px/s ; 2,6 fois plus par mauvais temps), raccordées par un fondu de 12 px. |
| Oiseaux | Des vols de 3 à 7 « V » lointains, en formation, battements par séries puis vol plané ; un vol toutes les 9 à 22 s, seulement par beau temps. |
| Bateaux | Six modèles détourés, trois au plus en même temps, un nouveau toutes les 5 à 13 s, dans les deux sens (l'image est retournée au besoin). Ils naissent derrière la cabane ou au bord droit. Leur hauteur dans la mer fixe leur taille et leur vitesse (perspective). Ils tanguent et roulent un peu, davantage par mauvais temps. Écume le long de la coque, vague d'étrave, sillage de petits traits blancs qui s'allongent et s'effacent. |
| Mauvais temps | Bouton en haut. Passage en 3 s : ciel, mer, jetée et étal de l'illustration du mauvais temps ; pluie (gouttes proches et lointaines, poussées par le vent) et éclaboussures sur la glace ; bords assombris ; faisceau du phare qui tourne (longueur qui suit la rotation, éclat quand il passe face à nous) ; fenêtres et feux de mât des bateaux allumés, avec leur reflet tremblant ; capitaine assombri. |
| Temps du jour | Tiré au hasard à l'ouverture : mauvais une fois sur deux (décision du parent du 9 octobre 2026). Sinon, une fois sur deux, l'orage arrive en cours de séance, entre 2 et 6 minutes (décision du 10 octobre ; réglable) : le pêcheur s'exclame et se met à l'abri (bulle, et voix de secours dans la maquette ; phrases dans `PHRASES.md`). Le bouton « Mauvais temps » fait arriver l'orage de la même façon. |
| Portefeuille | Fermé sur le comptoir ; un toucher l'ouvre (les images de la vidéo du parent, à l'envers, pendant qu'il vient au centre du comptoir). Ouvert, les billets dépassent du haut et les pièces de leur poche. Toucher la poche à billets : les billets glissent hors de la poche, derrière le cuir, puis passent devant et s'ouvrent en éventail ; toucher la poche à pièces : les pièces sautent dehors, l'une après l'autre. Une seule poche ouverte à la fois ; la retoucher la referme. Un billet ou une pièce sorti : un toucher l'envoie dans la soucoupe, ou on l'y fait glisser ; dans la soucoupe, un toucher le rend au portefeuille. Toucher le cuir ailleurs que sur les poches referme le portefeuille (ce qui est dans la soucoupe y reste). Billets et pièces gardent les rapports de taille des vrais. Contenus d'essai dans les réglages (« Bien garni », « Sans pièce de 1 € », « Billets seulement », « Restreint »), total de la soucoupe affichable. |
| Réglages | Bouton « Réglages » : assombrissement (voile général, bords, capitaine, monnaie), lumière de la lampe sur l'étal et sur les produits (recalculée au relâchement du curseur), halo, phare, pluie, probabilités et délais de l'orage. Gardés sur la tablette ; « Copier les réglages » donne les valeurs à reporter dans l'application. |
| Pêche du jour | 8 produits sur 12, tirés au hasard (bouton « Autre pêche »), en deux rangées de 4 sur la glace, légèrement tournés, avec leur ombre portée ; une ardoise de prix plantée devant chacun (police Shantell Sans). **Les prix ne sont pas dans les images** : le code écrit sur chaque ardoise le prix que l'exercice donne au produit (en centimes, « 3 € » ou « 2,50 € », ardoise élargie au besoin) ; « Autres prix » en tire d'autres (entiers, puis avec 50 c, puis avec 10 à 90 c). L'étal, les produits et les ardoises sont composés une fois dans un calque, pour chaque temps (produits assombris par mauvais temps). Par mauvais temps, chaque produit reçoit en plus la lumière de la lampe selon sa distance, plus forte du côté tourné vers elle, avec une ombre portée à l'opposé ; les ardoises aussi. |
| Lampe à huile | Accrochée sous l'angle du toit : éteinte par beau temps (brise légère), allumée par mauvais temps. Elle se balance comme un pendule poussé par les rafales. Sa lumière suit la flamme : l'étal et la cabane prennent, autour d'elle, les couleurs du beau temps teintées de la flamme, avec une décroissance progressive ; la face avant de l'étal, verticale et sous la lampe, en reçoit moins que la glace. La flamme scintille ; les gouttes qui passent près d'elle s'éclairent. |

## Les images

`sources/` : les illustrations générées par le parent (Nano Banana) : l'étal par beau et par mauvais temps (superposables au pixel près), la lampe allumée et éteinte, les trois images de bateaux, les 12 produits (`sources/produits/`, sur fond vert), les 5 pièces et 4 billets (`sources/monnaie/`), la vidéo du portefeuille qui se referme (`sources/portefeuille.mp4`). `polices/` : Shantell Sans, pour les ardoises. `img/` : les calques fabriqués par `outils/` (Python, OpenCV), à 1,5 fois la taille de la scène de 1280 × 800 :

```bash
cd art/etal/outils
python3 1-masque.py    # le ciel et la mer de l'étal (remplissage depuis quelques points)
python3 2-calques.py   # premier plan, jetée et phare, tuiles du ciel et de la mer, pour les deux temps
python3 3-bateaux.py   # les six bateaux : détourage, coupe à la ligne de flottaison
python3 4-lampe.py     # la lampe allumée : détourage, crochet et flamme
python3 5-produits.py  # les 12 produits : fond vert retiré, poissons remis à plat, cadrage
python3 6-lampe-eteinte.py  # la lampe éteinte, éclaircie pour le plein jour
python3 7-monnaie.py   # pièces et billets détourés ; portefeuille : 35 images de la vidéo (ouvert → fermé)
```

- L'illustration fait 2 576 × 1 438 px (16:9) ; la scène la ramène à 800 px de haut et coupe 153 px à droite (la fin de l'étal). La fenêtre de la cabane tombe sur la place de la mascotte (intérieur de x 26 à 224, y 136 à 406).
- Les bateaux peints dans l'illustration sont effacés de la mer (recopie de la mer voisine, fondue) ; les traits de pluie peints dans le ciel et la mer du mauvais temps sont retirés (ouverture morphologique horizontale) pour ne pas défiler avec les nuages.
- Le capitaine est abaissé de 28 px et rogné au bas de l'intérieur de la fenêtre : la coupe de son cou passe sous le rebord.
- La jetée et le phare ne font partie que de leur calque (pas du premier plan), pour ne pas recevoir la lumière de la lampe.
- Les bateaux : sens d'origine vers la gauche, sauf le chalutier orange ; ligne de flottaison et positions des feux dans `TYPES` (`index.html`).

## Points ouverts

- Le capitaine, assombri par un filtre, ne reçoit pas la lumière de la lampe.
- Fluidité : mesurée par le parent sur la tablette le 9 octobre 2026, 60 images/s par beau temps mais 20 par mauvais temps. Optimisé le 10 octobre (temps de calcul d'une image par mauvais temps : 32,5 ms → 9,5 ms en essai automatique, contre 7,8 ms par beau temps) : la lumière de la lampe est cuite une fois dans l'étal du mauvais temps au lieu de quatre passes plein écran par image ; lueurs, halos, reflets et pinceau du phare dessinés une fois puis seulement posés ; pluie tracée en trois traits groupés sur un calque à la taille de la scène ; assombrissement des bords et du capitaine par des voiles CSS au lieu d'un dégradé redessiné et d'un filtre sur la vidéo. Si l'image dépasse encore 21 ms en moyenne, la pluie s'allège d'elle-même (jusqu'à 45 % des gouttes ; le compteur l'indique). À remesurer sur la tablette.
