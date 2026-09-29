# Maquette — récif vivant

Prototype graphique autonome du futur récif de Maths-CE1.

Cette branche est volontairement séparée de l'application publiée : **aucun fichier sous `app/` n'est modifié**. La maquette sert à valider le rendu et les mouvements avant l'intégration applicative.

## Tester

Le fichier `index.html` est autonome : panorama, sprites et masques sont embarqués.

Depuis la racine du dépôt :

```bash
python -m http.server 8080
```

Puis ouvrir :

```
http://localhost:8080/art/recif-vivant/
```

Glisser horizontalement pour parcourir le lagon, le récif de corail, le grand large puis les abysses.

## État du rendu

- panorama continu : 10 874 × 1 774 px ;
- poissons et bancs animés, sans demi-tour ;
- passages derrière le récif grâce au masque de premier plan ;
- algues du lagon ondulantes ;
- gorgones, anémones et coraux additionnels animés dans le récif ;
- faisceaux de lumière doux jusqu'au grand large ;
- ondulation de la surface en WebGL, avec secours fond fixe ;
- éclats mobiles de surface retirés ;
- particules lumineuses des abysses animées, vitesse augmentée de 30 % ;
- grande faune du large en silhouettes d'arrière-plan : apparition, dérive lente et disparition progressive.

## Grande faune du large

Les tailles sont volontairement différenciées pour garder une hiérarchie crédible dans l'image, sans prétendre reproduire une échelle zoologique exacte :

| Sujet | Longueur graphique de référence |
| --- | ---: |
| Baleine | 1700 |
| Orque | 960 |
| Requin blanc | 820 |
| Requin-marteau | 760 |
| Groupe de dauphins | 760 |
| Marlin / espadon | 700 |
| Groupe de requins | 680 |
| Congre / anguille | 560 |

Trois présences lointaines vivent simultanément dans le grand large. Elles restent peu opaques (environ 11 à 17 % au maximum), apparaissent déjà dans la profondeur, dérivent légèrement pendant 20 à 34 s puis se dissolvent. Une nouvelle silhouette réapparaît ailleurs.

Les images fournies avec un fond bleu sont transformées en silhouettes au chargement par la maquette ; celles déjà détourées sont utilisées directement. Cela évite d'afficher des rectangles de fond autour des animaux.

## Poids

La maquette a déjà fait l'objet de l'optimisation principale sans perte visuelle : le premier plan du récif réutilise les tuiles du fond et n'embarque que des masques alpha. On évite ainsi une seconde copie complète du panorama.

Le présent fichier reste volontairement autonome pour faciliter la revue. Lors de l'intégration dans l'application, les images pourront être externalisées et chargées par tuiles.

## Hors périmètre de cette PR

- remplacement du récif actuellement utilisé par l'application ;
- progression et positionnement des créatures gagnées avec les cartes ;
- boutons de navigation définitifs ;
- adaptation au cache PWA ;
- recette de performance sur la tablette réelle.

Ces points feront l'objet de l'intégration applicative après validation de la direction graphique.
