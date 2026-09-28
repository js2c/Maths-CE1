# ocean-01 — étape 2

Cette scène est un **prototype séparé** : elle n'est pas copiée dans `app/` et ne change donc pas l'application publiée.

## Ce que valide cette étape

- profondeur perceptible sans filtre temps réel ;
- décor riche avant même d'ajouter les personnages ;
- ruines, reliefs, lumière et sol composés dans le repère existant 1280 × 800 ;
- place libre au centre et dans la zone de jeu pour les futurs éléments pédagogiques ;
- compatibilité du manifeste V2 avec de vrais assets raster.

Le décor maître est stocké sous forme de **quatre tuiles WebP 640 × 400**. Elles proviennent d'une même image 1280 × 800 : ce découpage est spatial et ne crée pas de raccord visuel. Il évite aussi un nouveau calque plein écran supplémentaire.

Les acteurs restent volontairement des placeholders à cette étape. Le bouton « Voir les placements » du prototype permet de vérifier leurs positions sans les confondre avec les futurs personnages définitifs.

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

## Suite envisagée après validation visuelle

1. séparer uniquement les éléments de premier plan qui gagnent réellement à bouger ;
2. refaire la pieuvre comme personnage étalon ;
3. remplacer progressivement les placeholders secondaires ;
4. seulement ensuite préparer l'intégration dans le moteur de `app/`.
