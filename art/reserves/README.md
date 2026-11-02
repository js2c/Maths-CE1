# Maquette — réserves d'étoiles et étoiles arc-en-ciel

Maquette du lot « Réserves d'étoiles et étoiles arc-en-ciel » (`docs/LOTS.md`, fiche 16 ; décisions du parent du 2 novembre 2026). La proposition, les captures, les phrases et les questions : `docs/maquettes/reserves/README.md`.

**Elle se pose sur l'application elle-même** : la mascotte, la bulle, la boutique, le compteur et les dessins sont ceux de `app/`, qui n'est jamais modifié. `maquette.js` est injecté dans la page de l'application et ajoute ce que le lot propose (les réserves près du compteur, les deux façons de faire briller, l'étoile gardée, les vols de la récompense). Les dessins sont ceux de l'atelier déjà dans l'application (`etoile.arc`, `etoile.diamant`, `etoile`, `boutique.coche`, `boutique.cadenas`) : rien de nouveau à dessiner.

## L'ouvrir

Depuis la racine du dépôt :

```bash
python -m http.server 8080
```

puis `http://localhost:8080/art/reserves/`. Les boutons du haut posent un état (étoiles arc-en-ciel, de diamant, de mer) et rechargent l'application. On touche les réserves ; à la boutique (le récif, puis l'étal), on touche une créature déjà dans le récif ; « La récompense » fait voler les étoiles vers leur réserve. La voix ne dit pas les phrases nouvelles (elles ne sont pas fabriquées) : la bulle les écrit.

## Les captures

```bash
node art/reserves/captures.mjs                 # docs/maquettes/reserves/*.png, en 1280 × 800 et sur le petit smartphone
node art/reserves/captures.mjs --vue 1280      # une seule vue
```
