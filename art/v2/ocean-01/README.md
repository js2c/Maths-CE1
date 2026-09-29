# ocean-01 — étapes 2 et 3

Cette scène est un prototype séparé : elle reste sous art/v2/, n'est pas copiée dans app/ et ne modifie donc pas le jeu publié.

## Étape 2 — décor

Le décor V2 valide la profondeur, les ruines, la lumière, les coraux et le sol dans le repère logique 1280 × 800. Le fond de revue est actuellement conditionné en fragments Base64 uniquement pour faciliter son transport dans cette branche de prototype. Ce conditionnement ne sera pas repris dans l'application finale.

## Étape 3 — mascotte animée

La pieuvre n'est plus un placeholder. Le prototype charge actors/octopus-v2.svg et combine deux niveaux de mouvement :

- animation interne continue : huit tentacules déphasés, respiration, clignement, déplacement des pupilles, joues et bulles ;
- animation de l'acteur dans la scène : flottement vertical et micro-rotation pilotés par demo.js.

Trois états sont visibles depuis la barre de revue :

- Repos : animation ambiante normale ;
- Bonne réponse : expression heureuse et rythme légèrement plus énergique ;
- Explique : bouche dédiée et tentacule de pointage animé.

Le prototype respecte prefers-reduced-motion et coupe les animations internes lorsque cette préférence est activée.

## Voir localement

Depuis la racine du dépôt :

    python -m http.server 8080

Puis ouvrir :

    http://localhost:8080/art/v2/demo.html

Le bouton Voir les placements affiche encore les acteurs secondaires en placeholders. Ils seront remplacés seulement après validation de la mascotte.

## Hors périmètre pour l'instant

- aucun changement de app/ ;
- aucun changement pédagogique ;
- aucun changement IndexedDB, audio ou PWA ;
- aucune fusion vers main.
