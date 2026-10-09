# Maquette — l'étal du pêcheur (le décor de la monnaie)

**Maquette du décor, à valider par le parent** (9 octobre 2026). Elle ne contient pas encore l'exercice (produits, portefeuille, pièces et billets) : seulement la scène et ses animations. Aucun fichier sous `app/` n'est modifié.

**Tester** : depuis la racine du dépôt, `python -m http.server 8080`, puis `http://localhost:8080/art/etal/`. Le capitaine vient de `art/mascotte/` (mêmes vidéos, même moteur). Le compteur en haut à droite donne les images par seconde.

## Ce qui bouge

| Élément | Comment |
| --- | --- |
| Nuages | La tuile du ciel défile lentement vers la gauche (3 px/s, 12 px/s par mauvais temps). Elle est faite du ciel de l'illustration suivi de son reflet en miroir : le raccord est invisible. |
| Vagues | La mer en trois bandes qui glissent vers la gauche, plus vite près de l'étal qu'à l'horizon (2, 5,5 et 11 px/s ; 2,6 fois plus par mauvais temps), raccordées par un fondu de 12 px. |
| Oiseaux | Des vols de 3 à 7 « V » lointains, en formation, battements par séries puis vol plané ; un vol toutes les 9 à 22 s, seulement par beau temps. |
| Bateaux | Six modèles détourés, trois au plus en même temps, un nouveau toutes les 5 à 13 s, dans les deux sens (l'image est retournée au besoin). Ils naissent derrière la cabane ou au bord droit. Leur hauteur dans la mer fixe leur taille et leur vitesse (perspective). Ils tanguent et roulent un peu, davantage par mauvais temps. Écume le long de la coque, vague d'étrave, sillage de petits traits blancs qui s'allongent et s'effacent. |
| Mauvais temps | Bouton en haut. Passage en 3 s : ciel, mer, jetée et étal de l'illustration du mauvais temps ; pluie (gouttes proches et lointaines, poussées par le vent) et éclaboussures sur la glace ; bords assombris ; faisceau du phare qui tourne (longueur qui suit la rotation, éclat quand il passe face à nous) ; fenêtres et feux de mât des bateaux allumés, avec leur reflet tremblant ; capitaine assombri. |
| Lampe à huile | Accrochée sous l'angle du toit, par mauvais temps seulement. Elle se balance comme un pendule poussé par les rafales. Sa lumière suit la flamme : l'étal et la cabane prennent, autour d'elle, les couleurs du beau temps teintées de la flamme, avec une décroissance progressive ; la face avant de l'étal, verticale et sous la lampe, en reçoit moins que la glace. La flamme scintille ; les gouttes qui passent près d'elle s'éclairent. |

## Les images

`sources/` : les illustrations générées par le parent (Nano Banana) : l'étal par beau et par mauvais temps (superposables au pixel près), la lampe, les trois images de bateaux. `img/` : les calques fabriqués par `outils/` (Python, OpenCV), à 1,5 fois la taille de la scène de 1280 × 800 :

```bash
cd art/etal/outils
python3 1-masque.py    # le ciel et la mer de l'étal (remplissage depuis quelques points)
python3 2-calques.py   # premier plan, jetée et phare, tuiles du ciel et de la mer, pour les deux temps
python3 3-bateaux.py   # les six bateaux : détourage, coupe à la ligne de flottaison
python3 4-lampe.py     # la lampe : détourage, crochet et flamme
```

- L'illustration fait 2 576 × 1 438 px (16:9) ; la scène la ramène à 800 px de haut et coupe 153 px à droite (la fin de l'étal). La fenêtre de la cabane tombe sur la place de la mascotte (intérieur de x 26 à 224, y 136 à 406).
- Les bateaux peints dans l'illustration sont effacés de la mer (recopie de la mer voisine, fondue) ; les traits de pluie peints dans le ciel et la mer du mauvais temps sont retirés (ouverture morphologique horizontale) pour ne pas défiler avec les nuages.
- Les bateaux : sens d'origine vers la gauche, sauf le chalutier orange ; ligne de flottaison et positions des feux dans `TYPES` (`index.html`).

## Points ouverts

- La lampe n'existe que par mauvais temps (elle apparaît en fondu). Une lampe éteinte par beau temps demanderait une autre image.
- Le capitaine, assombri par un filtre, ne reçoit pas la lumière de la lampe.
- Sur ordinateur sans carte graphique, 20 à 33 images/s ; à mesurer sur la tablette.
