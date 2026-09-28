# ocean-01 — étape 2

Cette scène est un **prototype séparé** : elle reste sous `art/v2/`, n'est pas copiée dans `app/` et ne change donc ni l'application publiée ni le mode hors ligne existant.

## Ce que valide cette étape

- profondeur perceptible sans filtre temps réel ;
- décor riche avant même d'ajouter les personnages ;
- ruines, reliefs, lumière, coraux et sol dans le repère 1280 × 800 ;
- place libre au centre et dans la zone de jeu pour les futurs éléments pédagogiques ;
- manifeste V2 capable de référencer un vrai visuel raster.

Les acteurs restent volontairement des placeholders. Le bouton **Voir les placements** du prototype vérifie leurs positions sans les confondre avec les futurs personnages définitifs.

## Format du fond dans ce prototype

Le visuel de revue est un WebP 800 × 500 redimensionné par le navigateur dans le repère 1280 × 800. Pour conserver ce prototype dans la branche avec le canal d'écriture actuel, ses octets sont stockés en 12 fragments Base64 référencés par `assets/background.bundle.json`.

Ce conditionnement est **temporaire et propre au prototype de revue**. Après validation artistique, l'intégration finale utilisera des WebP binaires normaux, en densité adaptée à la tablette ; les fragments Base64 ne seront pas repris dans `app/`.

## Voir localement

Depuis la racine du dépôt :

```bash
python -m http.server 8080
```

Puis ouvrir :

```
http://localhost:8080/art/v2/demo.html
```

Aucun build ni aucune dépendance supplémentaire n'est nécessaire.

## Suite après validation visuelle

1. séparer uniquement les éléments de premier plan qui gagnent réellement à bouger ;
2. refaire la pieuvre comme personnage étalon ;
3. remplacer progressivement les placeholders secondaires ;
4. seulement ensuite préparer l'intégration dans le moteur de `app/`.
