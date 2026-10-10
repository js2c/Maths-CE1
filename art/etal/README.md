# Maquette — l'étal du pêcheur (le décor de la monnaie)

**Maquette validée par le parent le 10 octobre 2026** ; à intégrer par le lot « L'étal du pêcheur » (`docs/LOTS.md`, fiche 7). Elle contient la scène, ses animations, la pêche du jour sur l'étal, l'arrivée de l'orage et le portefeuille (pièces, billets, soucoupe) ; pas encore la consigne ni la validation d'un achat. Aucun fichier sous `app/` n'est modifié.

**Tester** : depuis la racine du dépôt, `python -m http.server 8080`, puis `http://localhost:8080/art/etal/`. Le capitaine vient de `art/mascotte/` (mêmes vidéos, même moteur). Le compteur en haut à droite donne les images par seconde.

## Ce qui bouge

| Élément | Comment |
| --- | --- |
| Nuages | La tuile du ciel défile lentement vers la gauche (3 px/s, 12 px/s par mauvais temps). Elle est faite du ciel de l'illustration suivi de son reflet en miroir : le raccord est invisible. |
| Vagues | La mer en trois bandes qui glissent vers la gauche, plus vite près de l'étal qu'à l'horizon (2, 5,5 et 11 px/s ; 2,6 fois plus par mauvais temps), raccordées par un fondu de 12 px. |
| Oiseaux | Des vols de 3 à 7 « V » lointains, en formation, battements par séries puis vol plané ; un vol toutes les 9 à 22 s, seulement par beau temps. |
| Bateaux | Six modèles détourés, trois au plus en même temps, un nouveau toutes les 5 à 13 s, dans les deux sens (l'image est retournée au besoin). Ils naissent derrière la cabane ou au bord droit. Leur hauteur dans la mer fixe leur taille et leur vitesse (perspective). Ils tanguent et roulent un peu, davantage par mauvais temps. Écume le long de la coque, vague d'étrave, sillage de petits traits blancs qui s'allongent et s'effacent. |
| Mauvais temps | Bouton en haut. Passage en 3 s : ciel, mer, jetée et étal de l'illustration du mauvais temps ; pluie (gouttes proches et lointaines, poussées par le vent) et éclaboussures sur la glace ; bords assombris ; faisceau du phare qui tourne (longueur qui suit la rotation, éclat quand il passe face à nous) ; fenêtres et feux de mât des bateaux allumés, avec leur reflet tremblant ; capitaine assombri. |
| Temps du jour | Tiré au hasard à l'ouverture : mauvais une fois sur deux (décision du parent du 9 octobre 2026). Sinon, une fois sur deux, l'orage arrive en cours de séance, entre 2 et 6 minutes (décision du 10 octobre ; réglable) : le pêcheur s'exclame et se met à l'abri (bulle seule dans la maquette ; aucune voix fabriquée ici : phrases à fabriquer plus tard par le parent, `PHRASES.md`). Le bouton « Mauvais temps » fait arriver l'orage de la même façon. |
| Portefeuille | Fermé sur le comptoir. Un toucher l'ouvre : les images de la vidéo du parent, à l'envers, pendant qu'il vient au centre du comptoir, puis un fondu vers l'illustration du portefeuille ouvert et vide du parent (meilleure que la vidéo), en deux calques : le portefeuille et le cuir de devant (`outils/8-portefeuille-ouvert.py`). Les pièces qui sortent montent devant le rabat de leur poche. Les billets sont rangés dans la grande poche, le haut dépassant à des hauteurs et inclinaisons variées ; les pièces dans la poche à pièces, sur deux rangs, un peu plus de la moitié dépassant du bord. Ouvert, un toucher sur le portefeuille (n'importe où) sort tout : billets en éventail en haut, pièces dessous ; un nouveau toucher range tout, le portefeuille restant ouvert. Un toucher à côté (le décor) range ce qui est sorti et le referme, comme pour en sortir ; ce qui est dans la soucoupe y reste (décisions du parent du 10 octobre 2026). Un billet ou une pièce sorti : un toucher l'envoie dans la soucoupe (plateau de bois du parent), ou on l'y fait glisser ; dans la soucoupe, un toucher le rend. Tailles proportionnelles aux vraies. Contenus d'essai dans les réglages, total de la soucoupe affichable. |
| Réglages | Bouton « Réglages » : assombrissement (voile général, bords, capitaine, monnaie), lumière de la lampe sur l'étal et sur les produits (recalculée au relâchement du curseur), halo, phare, pluie, probabilités et délais de l'orage. Gardés sur la tablette ; « Copier les réglages » donne les valeurs à reporter dans l'application. |
| Pêche du jour | 8 produits sur 12, tirés au hasard (bouton « Autre pêche »), en deux rangées de 4 sur la glace, légèrement tournés, avec leur ombre portée ; une ardoise de prix plantée devant chacun (police Shantell Sans). **Les prix ne sont pas dans les images** : le code écrit sur chaque ardoise le prix que l'exercice donne au produit (en centimes, « 3 € » ou « 2,50 € », ardoise élargie au besoin) ; « Autres prix » en tire d'autres (entiers, puis avec 50 c, puis avec 10 à 90 c). L'étal, les produits et les ardoises sont composés une fois dans un calque, pour chaque temps (produits assombris par mauvais temps). Par mauvais temps, chaque produit reçoit en plus la lumière de la lampe selon sa distance, plus forte du côté tourné vers elle, avec une ombre portée à l'opposé ; les ardoises aussi. |
| Lampe à huile | Accrochée sous l'angle du toit : éteinte par beau temps (brise légère), allumée par mauvais temps. Elle se balance comme un pendule poussé par les rafales. Sa lumière suit la flamme : l'étal et la cabane prennent, autour d'elle, les couleurs du beau temps teintées de la flamme, avec une décroissance progressive ; la face avant de l'étal, verticale et sous la lampe, en reçoit moins que la glace. La flamme scintille ; les gouttes qui passent près d'elle s'éclairent. |

## Les images

`sources/` : les illustrations générées par le parent (Nano Banana) : l'étal par beau et par mauvais temps (superposables au pixel près), la lampe allumée et éteinte, les trois images de bateaux, les 12 produits (`sources/produits/`, sur fond vert), les 5 pièces et 4 billets (`sources/monnaie/`), la vidéo du portefeuille qui se referme (`sources/portefeuille.mp4`), le portefeuille ouvert et vide (`sources/monnaie/portefeuille-vide.jpg`), la soucoupe (`sources/monnaie/soucoupe.jpg`). `polices/` : Shantell Sans, pour les ardoises. `img/` : les calques fabriqués par `outils/` (Python, OpenCV), à 1,5 fois la taille de la scène de 1280 × 800 :

```bash
cd art/etal/outils
python3 1-masque.py    # le ciel et la mer de l'étal (remplissage depuis quelques points)
python3 2-calques.py   # premier plan, jetée et phare, tuiles du ciel et de la mer, pour les deux temps
python3 3-bateaux.py   # les six bateaux : détourage, coupe à la ligne de flottaison
python3 4-lampe.py     # la lampe allumée : détourage, crochet et flamme
python3 5-produits.py  # les 12 produits : fond vert retiré, poissons remis à plat, cadrage
python3 6-lampe-eteinte.py  # la lampe éteinte, éclaircie pour le plein jour
python3 7-monnaie.py   # pièces, billets, soucoupe détourés ; portefeuille : 35 images de la vidéo (ouvert → fermé)
python3 8-portefeuille-ouvert.py  # le portefeuille ouvert et vide de l'illustration : le portefeuille et le cuir de devant
```

- L'illustration fait 2 576 × 1 438 px (16:9) ; la scène la ramène à 800 px de haut et coupe 153 px à droite (la fin de l'étal). La fenêtre de la cabane tombe sur la place de la mascotte (intérieur de x 26 à 224, y 136 à 406).
- Les bateaux peints dans l'illustration sont effacés de la mer (recopie de la mer voisine, fondue) ; les traits de pluie peints dans le ciel et la mer du mauvais temps sont retirés (ouverture morphologique horizontale) pour ne pas défiler avec les nuages.
- Le capitaine est abaissé de 28 px et rogné au bas de l'intérieur de la fenêtre : la coupe de son cou passe sous le rebord.
- La jetée et le phare ne font partie que de leur calque (pas du premier plan), pour ne pas recevoir la lumière de la lampe.
- Les bateaux lointains, très réduits, se pixellisaient : chaque bateau a des versions préréduites (1/2, 1/4, 1/8…), et la plus proche de la taille voulue est posée.
- Les bateaux : sens d'origine vers la gauche, sauf le chalutier orange ; ligne de flottaison et positions des feux dans `TYPES` (`index.html`).

## Points ouverts

- Le capitaine, assombri par un filtre, ne reçoit pas la lumière de la lampe.
- Fluidité : mesurée par le parent sur la tablette le 9 octobre 2026, 60 images/s par beau temps mais 20 par mauvais temps. Optimisé le 10 octobre (temps de calcul d'une image par mauvais temps : 32,5 ms → 9,5 ms en essai automatique, contre 7,8 ms par beau temps) : la lumière de la lampe est cuite une fois dans l'étal du mauvais temps au lieu de quatre passes plein écran par image ; lueurs, halos, reflets et pinceau du phare dessinés une fois puis seulement posés ; pluie tracée en trois traits groupés sur un calque à la taille de la scène ; assombrissement des bords et du capitaine par des voiles CSS au lieu d'un dégradé redessiné et d'un filtre sur la vidéo. Si l'image dépasse encore 21 ms en moyenne, la pluie s'allège d'elle-même (jusqu'à 45 % des gouttes ; le compteur l'indique). À remesurer sur la tablette.
