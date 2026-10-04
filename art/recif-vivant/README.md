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
- flore du récif implantée par le pied (gorgones, anémones, coraux) et animée par une houle commune ;
- faisceaux de lumière doux jusqu'au grand large ;
- ondulation de la surface en WebGL, avec secours fond fixe ;
- éclats mobiles de surface retirés ;
- particules lumineuses des abysses animées, vitesse augmentée de 30 % ;
- massif de cheminées hydrothermales dessiné en code et fumerolles dessinées en direct (voir plus bas) ;
- sous-marin qui traverse le grand large et les abysses, phares allumés dans les abysses (voir plus bas) ;
- poissons des abysses, qui restent dans les abysses et s'éloignent dans le fond (voir plus bas) ;
- les 15 créatures du lagon en images générées, animées par le code (voir plus bas) ;
- les 15 créatures du récif de corail, sur le même principe (voir plus bas) ;
- les 15 créatures du grand large, la ronde des grandes nageuses (voir plus bas) ;
- les 15 créatures des abysses (voir plus bas) ;
- halo au survol ou au doigt posé, déplacement des créatures, fiche à l'appui (voir plus bas) ;
- grande faune du large en ombres lointaines, à l'échelle, nage propre à chaque animal, apparition dans la brume ou remontée du fond, disparition dans la brume ou en plongée.

## Flore du récif

Chaque élément est posé **par son pied** à un point choisi du panorama (le pied est repéré dans le sprite), jamais par une hauteur de relief approximative :

| Élément | Où | Plan |
| --- | --- | --- |
| Gorgone violette | derrière la roche grise, entre le corail rouge et le corail jaune | arrière : le pied est caché par le récif |
| Gorgone violette (grande) | sur le massif, derrière le corail branchu violet | arrière |
| Gorgone violette (petite, retournée) | sur la roche aux éponges orange, derrière le corail violet | arrière |
| Anémone blanche | sur le sable, au pied du grand corail cerveau | avant |
| Petite anémone blanche | sur le sable, au pied de la roche aux éponges | avant |
| Anémone rose et sa limace de mer | sur le sable, devant les coraux bleus | avant |
| Corail jaune | sur le haut du tombant, derrière le premier plan | arrière |
| Éponges jaunes, limace et son rocher | sur le sable | avant |

Aucune gorgone n'est posée sur le tombant : vues de côté, elles semblaient flotter au bord de la falaise. Le corail violet ajouté près du corail rouge a aussi été retiré, parce qu'il s'y superposait mal.
Le corail cerveau ajouté par la version précédente a été retiré : il doublait ceux du panorama.

Mouvements : une même houle (période 6,8 s) traverse tout le récif de gauche à droite ; chaque plante la suit avec un retard qui dépend de sa position.

- **Gorgones** : le pied est rigide, l'éventail plie d'un bloc (flexion croissante vers la cime, en retard sur le pied) et les extrémités frémissent. Chaque ligne de pixels n'est décalée qu'horizontalement, une seule fois et à hauteur entière : aucune bande ne scintille. Le résultat est recalculé 30 fois par seconde, une gorgone par image.
- **Anémones** : la colonne reste plantée ; les tentacules suivent la houle (les pointes plus que la base, et en retard), ondulent chacun à leur rythme (onde qui tourne autour du disque) et la couronne respire lentement. La limace de mer reste posée. La déformation est calculée pixel par pixel sur un petit sprite, 25 fois par seconde, une anémone par image.
- **Coraux durs** : immobiles.

## Grande faune du large

Ce sont des **ombres lointaines** : silhouettes pleines d'un bleu sombre, peu opaques (18 à 40 %), plus floues quand l'animal est plus loin. Quatre à cinq présences en même temps, jamais deux fois la même espèce. Sur 30 minutes simulées, la vue de la tablette est vide environ 6 % du temps. La baleine est la plus rare au tirage, mais elle revient au plus tard 100 s après être partie (une toutes les deux minutes environ).

**Approche** : la moitié des animaux se rapprochent lentement pendant leur passage (ils grossissent de 15 à 45 % et deviennent plus nets et plus visibles), quelques-uns s'éloignent, les autres restent à distance.

**Échelle** : une seule règle pour tous, 80 px par mètre de longueur réelle, multipliée par l'éloignement (0,55 à 1). Les proportions entre espèces sont donc justes :

| Fichier source | Animal | Longueur | Nage | Groupe | Profondeur |
| --- | --- | ---: | --- | --- | --- |
| `baleine.jpg` | baleine bleue (rorqual) | 23 m | nageoire horizontale, battement lent de haut en bas | seule, parfois avec son baleineau | moyenne |
| `orque.png` | orque | 7,5 m | idem, plus rapide | 1 à 3 | haute à moyenne |
| `requin_blanc.png` | grand requin blanc | 5 m | queue verticale : la nageoire balaie (vue de profil elle se raccourcit) | seul | moyenne à profonde |
| `requin_marteau.png` | requin-marteau | 4,2 m | idem | seul ou en petit banc | moyenne à profonde |
| `marlin_espadon.jpg` | marlin | 3,6 m | queue verticale, battement rapide, accélérations brèves | seul | proche de la surface |
| `dauphins_groupe.jpg` | 4 dauphins découpés séparément | 2,4 m | battement vertical rapide, corps dans l'axe de la nage, chacun dérivant lentement en profondeur (pas de mouvement de saut) | 3 à 6 | sous la surface |
| `requins_groupe.jpg` | petit requin (un seul exploitable) | 1,9 m | queue verticale | 3 à 5 | profonde |
| `anguille.jpg` | congre | 1,8 m | onde sur tout le corps | seul | la plus profonde, lent |

**Vitesses** : vitesses de croisière réelles, ralenties d'un même facteur pour tous (scène calme) ; elles varient doucement pour chaque animal. La fréquence du battement découle de la vitesse et de la taille (une baleine bat lentement, un dauphin vite). Pente de nage limitée en croisière, plus forte en plongée.

**Cycle** : un animal apparaît en sortant de la brume, en remontant des profondeurs ou en arrivant par un bord (côté récif ou côté abysses), nage 15 s à 1 min, puis disparaît soit dans la brume, soit **en plongeant** : il pique du nez et se perd dans le bleu sombre (il n'y a pas de fond dans cette zone). Côté récif, il passe derrière le tombant.

Les silhouettes ont été détourées à l'avance (fond estimé par un polynôme, puis seuillage) et sont embarquées dans la maquette ; plus aucun traitement d'image n'est fait au chargement.

## Cheminées et fumerolles des abysses

Les petits « volcans » du panorama étaient trop discrets. Ils sont recouverts par un **massif de cheminées hydrothermales** dessiné en code (douze cheminées, la plus haute fait 480 px du panorama, soit un bon quart de la hauteur de l'écran), dans la main « BD au marqueur » de l'image d'inspiration, assombrie pour rester dans la nuit des abysses : fûts accidentés, ombre nette à droite, coulées claires sous les bouches, cannelures et fissures à l'encre, rochers violets au pied, halo bleuté derrière. Le massif est dessiné une seule fois dans un canvas mis en cache (refait seulement si la taille de l'écran change).

Quatre cheminées fument. La fumée est **dessinée en direct**, ce n'est pas une image :

- **Matière** : chaque panache est un chapelet de bouffées rondes qui sortent de la bouche, montent en ralentissant, gonflent et se décalent les unes des autres. Le contour d'encre entoure l'ensemble des bouffées ; le volume vient d'un reflet et d'une ombre par bouffée, et de petites volutes à l'encre.
- **Sommet** : chaque bouffée se défait à son heure ; le haut du panache s'effiloche et lâche de petites bouffées isolées.
- **Dérive** : les panaches penchent vers le large (à gauche), poussés par le courant de fond, et serpentent lentement.
- **Lueur** : un halo bleuté respire autour de chaque bouche.

Réglages en tête du bloc « cheminées » de `index.html` : tableau `SPIRES` (position, hauteur `h`, largeurs `bw`/`tw`, inclinaison, `smoke` = hauteur du panache ou 0), couleurs `FUM_*`.

## Sous-marin

Un sous-marin d'exploration (dessin fourni par le parent, détouré à l'avance et embarqué) parcourt le grand large et les abysses, **sans jamais faire demi-tour** :

- **vers la droite** : il sort de derrière le tombant du récif, plus petit et estompé, reprend très vite sa taille, traverse le large puis les abysses et sort par le bord droit du panorama ;
- **vers la gauche** : il entre par le bord droit, traverse à pleine taille, descend vers le pied du tombant, puis, **seulement juste avant le récif**, rapetisse (jusqu'à 50 %), s'estompe et disparaît derrière le tombant.

Le rapetissement est volontairement tardif et limité (retour du parent : il diminuait trop et trop tôt). Il se joue entre x = 6 250 et x = 5 450 ; la descente, elle, commence dès x = 7 000 pour rester douce.

Après chaque passage, une pause de 7 à 16 s, puis un nouveau passage dans un sens tiré au sort. Une traversée dure environ une minute et demie.

**Profondeur** : libre au large ; plus bas au-dessus de la plaine des abysses (ses phares touchent alors le fond) ; il remonte pour passer au-dessus des cheminées. Le nez suit la pente, l'hélice lâche des bulles.

**Phares** : éteints dans le grand large, allumés dans les abysses (seuil à x = 8 380). À l'allumage, les cinq lampes s'allument l'une après l'autre avec deux hésitations ; à l'extinction, un fondu. Les faisceaux :

| Lampe | Faisceau |
| --- | --- |
| projecteur du toit | long et étroit, droit devant |
| gros phare rond | large et doux |
| trois spots sous la rambarde | en éventail vers le bas |

Chaque faisceau est un cône à bords doux avec un cœur plus vif, blanc chaud près de la lampe et bleu-vert au loin, qui s'épuise avec la distance et vacille très légèrement. S'y ajoutent un halo et un éclat sur chaque lampe, un voile de lumière diffuse devant la proue, des **poussières en suspension** visibles seulement quand un faisceau les traverse, et une **tache de lumière sur le fond** quand un faisceau l'atteint.

Réglages en tête du bloc « sous-marin » : `SUB_L` (taille), `SUB_FAR1`/`SUB_FAR0` (début et fin du rapetissement), `SUB_MIN` (taille minimale), `SUB_DIVE1` (début de la descente), `SUB_ON` (seuil des phares), `SUB_BEAMS` (angle, portée, ouverture, intensité de chaque faisceau), `subCruise` (profondeurs).

## Poissons des abysses

Quatre poissons des grands fonds (dessins fournis par le parent, détourés à l'avance et embarqués) nagent dans les abysses **sur le même principe que les nageurs du récif** : la tête toujours devant, le corps qui ondule, vitesse et profondeur qui varient lentement, jamais de demi-tour. Ce sont des solitaires, lents (13 à 38 px/s).

| Fichier source | Animal | Longueur | Particularité |
| --- | --- | ---: | --- |
| `poisson_des_fonds.jpg` | baudroie | 175 à 220 px | trapue, la plus lente ; son leurre luit et palpite (lueur dessinée en direct) ; une seule à la fois |
| `poisson_des_fonds2.jpg` | poisson des fonds bleu-vert | 220 à 270 px | |
| `poisson_des_fonds3.jpg` | poisson à longues dents | 285 à 345 px | |
| `poisson_des_fonds4.jpg` | grand poisson serpentiforme | 350 à 430 px | ondule comme une anguille ; un seul à la fois |

**Teinte** : les dessins sont recalés sur la couleur de l'eau des abysses (corps à peine plus clair que le fond, contour plus sombre) et légèrement transparents : ce sont des présences qui se devinent, pas des taches claires. Seul le leurre de la baudroie est lumineux.

**Hauteur** : ils occupent toute la hauteur de l'écran, du haut de l'eau jusqu'au-dessus du fond (y = 150 à 1 620). Chaque arrivant choisit la profondeur la plus éloignée des poissons déjà là, puis dérive à partir de sa profondeur du moment (pas de retour systématique vers le milieu). Sur 30 minutes simulées, chacun des cinq cinquièmes de la hauteur reçoit 17 à 23 % des présences.

**Ils ne vont jamais dans le grand large.**

- **Vers la droite** : ils sortent par le bord droit du panorama (près d'un tiers s'éloignent dans le fond avant d'y arriver).
- **Vers la gauche** : à un point tiré au sort entre x = 8 950 et x = 9 900, le poisson **s'éloigne dans le fond des abysses** : en 9 s il rapetisse (jusqu'à 45 %), ralentit et se fond dans le bleu sombre. Sur 30 minutes simulées, aucun poisson visible n'a dépassé x = 8 677 (les abysses commencent à 8 400).
- **Arrivées** : par le bord droit, ou en surgissant du fond de la même façon (petit et invisible, puis il grandit et s'éclaircit en 7 s).

Environ cinq poissons à la fois (4,5 visibles en moyenne, jamais zéro sur la simulation). Ils passent **derrière** les cheminées, leur fumée et le sous-marin. Le bouton « Poissons » les masque aussi.

Réglages en tête du bloc « poissons des abysses » : `AB_SPECIES` (taille, vitesse, ondulation, fréquence), `AB_WANT` (nombre), `AB_LIMIT` (limite gauche), `AB_TOP`/`AB_BOT` (profondeurs), `AB_ALPHA` (opacité).

## Créatures du lagon (celles que l'enfant gagne)

Essai de remplacement des créatures dessinées en code par des **images générées** (une image par créature, fond vert uni, fournies par le parent). Les 15 créatures du lagon sont détourées à l'avance, réduites à 440 px de grand côté et embarquées (environ 650 Ko au total). Le bouton « Créatures » les masque, pour comparer.

**Tout le mouvement vient du code**, à partir de l'image unique : l'image est découpée en fines bandes que l'on décale (par colonnes pour une ondulation de corps, par lignes pour des pattes, des tentacules ou une queue), dans une pose d'ensemble (position, inclinaison, respiration).

| Créature | Place | Mouvement |
| --- | --- | --- |
| poisson-clown | dans l'eau, contre l'anémone | fait du surplace, la queue bat |
| poisson-chirurgien | pleine eau, à gauche | fait du surplace, la queue bat |
| poisson-ballon | pleine eau, à droite | fait du surplace, petite queue rapide, le corps « respire » |
| raie | pleine eau, au-dessus du sable | plane lentement, les ailes ondulent |
| hippocampe | près du rocher de droite | monte et descend, se balance, la queue ondule |
| crevette | juste au-dessus du sable | flotte, se balance, les pattes pédalent |
| crabe | sur le sable | marche de côté, s'arrête, repart ; les pattes s'agitent quand il marche |
| bernard-l'ermite | sur le sable | avance par à-coups, la coquille tangue |
| étoile de mer | sur le sable | respire, les bras bougent à peine, tourne très lentement |
| oursin | contre le rocher de droite | les piquants ondulent tout autour, le cœur ne bouge pas |
| anémone | sur le sable | les tentacules ondulent tout autour, le cœur ne bouge pas |
| moule | contre le rocher de gauche | respire à peine, lâche un chapelet de bulles de temps en temps |
| Saint-Jacques | sur le sable | un petit bond toutes les 9 s |
| concombre de mer | sur le sable | une onde parcourt le corps, il s'étire et rampe très lentement |
| limace de mer | sur le sable | les papilles du dos ondulent, elle rampe très lentement |

**Proportions** : les tailles suivent la taille réelle des animaux, mais adoucie (largeur à l'écran proportionnelle à la taille réelle puissance 0,55), sinon la raie remplirait l'écran et la limace serait un point. Les plus petits ont un plancher : limace, moule, bernard-l'ermite, crevette, poisson-clown et hippocampe sont un peu grossis.

| Créature | Taille réelle prise | Largeur dans la maquette |
| --- | ---: | ---: |
| limace de mer | 5 cm | 125 px (grossie) |
| moule | 7 cm | 125 px |
| bernard-l'ermite | 8 cm | 150 px (grossi) |
| crevette | 9 cm | 150 px |
| poisson-clown | 10 cm | 165 px (grossi) |
| hippocampe | 13 cm de haut | 230 px de haut (grossi) |
| oursin, Saint-Jacques | 12 cm | 165 px |
| étoile de mer, anémone | 20 cm | 215 à 220 px |
| concombre de mer, poisson-chirurgien | 25 cm | 250 px |
| crabe | 28 cm, pattes comprises | 265 px |
| poisson-ballon | 40 cm | 320 px |
| raie | 110 cm, queue comprise | 540 px |

Les créatures posées ont une ombre douce au sol et sont un peu plus grandes quand elles sont plus bas dans l'image (plus près). Elles sont dessinées par-dessus le premier plan, du fond vers l'avant.

**Limites de l'image unique** : le crabe, la crevette et le bernard-l'ermite ne lèvent pas vraiment les pattes ni les pinces (on ne fait que les faire frémir) ; la moule et la Saint-Jacques ne s'ouvrent pas. Pour aller plus loin, il faudrait 2 à 4 poses par créature.

**Coût** : en rendu logiciel (sans carte graphique), les 15 créatures coûtent environ 17 ms par image, contre 3 ms pour les poissons du récif. Ce chiffre ne vaut pas pour une tablette, mais c'est le poste à vérifier en premier sur l'appareil réel.

Réglages : tableau `LAGON` (place `x`, `y`, taille `len`, fonctions `col`, `row`, `pose`).

## Créatures du récif de corail

Même travail que pour le lagon, sur les 15 créatures du récif de corail (images générées fournies par le parent, détourées, réduites à 420 ou 540 px de grand côté, environ 760 Ko au total). Mêmes principes : une image par créature, mouvement par le code, tailles d'après la taille réelle avec la même loi adoucie que le lagon (les plus grandes un peu rabotées, le mandarin grossi).

| Créature | Taille réelle prise | Largeur | Place | Mouvement |
| --- | ---: | ---: | --- | --- |
| poisson-mandarin | 7 cm | 135 px (grossi) | devant la gorgone violette | surplace, la queue bat vite |
| crevette-mante | 15 cm | 190 px | sur le sable | trottine par à-coups, les pattes s'agitent |
| poisson-papillon | 18 cm | 205 px | dans le creux du récif | surplace, la queue bat |
| poisson-coffre | 22 cm | 230 px | pleine eau | surplace, petite queue très rapide |
| poisson-lion | 35 cm | 300 px | au bord du tombant | presque immobile, queue lente, les rayons frémissent |
| seiche | 35 cm | 300 px | pleine eau, à droite | flotte, les bras ondulent, la nageoire frémit |
| poisson-perroquet | 45 cm | 340 px | au-dessus du récif | surplace, la queue bat |
| langouste | 70 cm, antennes comprises | 430 px | devant une crevasse du rocher | avance et recule lentement, antennes et pattes bougent |
| poulpe | 70 cm d'envergure | 430 px | posé sur le récif | les bras ondulent tout autour, la tête respire |
| murène | 90 cm (lovée) | 480 px | au pied du corail cerveau | une onde lente parcourt le corps, elle respire |
| bénitier géant | 90 cm | 460 px | sur le sable | respire, se referme d'un coup toutes les 11 s |
| tortue verte | 110 cm | 540 px (rabotée) | pleine eau, à gauche | les nageoires rament à contretemps, elle tangue |
| napoléon | 130 cm | 580 px (raboté) | pleine eau, vers le large | surplace, queue lente |
| raie léopard | 150 cm | 600 px (rabotée) | pleine eau, à gauche | plane, les ailes ondulent |
| requin à pointes noires | 160 cm | 640 px (raboté) | pleine eau, en haut | surplace, tout l'arrière du corps ondule |

**Limites de l'image unique**, comme au lagon : la langouste et la crevette-mante ne lèvent pas vraiment les pattes ; la murène n'ouvre pas la gueule ; la tortue rame par un simple cisaillement de l'image ; le poulpe ne déplace pas ses bras, ils ondulent sur place. Les quatre grands nageurs (requin, tortue, napoléon, raie léopard) font désormais leur ronde dans la zone (voir « Ronde des grandes nageuses »).

## Créatures du grand large

Même travail sur les 15 créatures du grand large (images générées fournies par le parent). Toutes sont des nageuses et font leur **ronde** (voir ci-dessous) entre x = 5 950 et x = 8 380.

| Créature | Taille réelle prise | Largeur | Sens | Mouvement propre |
| --- | ---: | ---: | --- | --- |
| poisson volant | 30 cm | 200 px (grossi) | gauche | petite queue très rapide, près de la surface |
| otarie | 2 m | 440 px | droite | le corps ondule, elle monte et descend |
| tortue luth | 2 m | 440 px | droite | les nageoires rament à contretemps |
| méduse à crinière de lion | 2,5 m avec les tentacules | 430 px | droite, très lente | l'ombrelle se contracte, les tentacules ondulent |
| poisson-lune | 2,5 m | 430 px | gauche, très lent | il godille avec ses deux grandes nageoires |
| dauphin | 2,5 m | 470 px | droite | la queue bat de haut en bas, il marsouine |
| thon rouge | 2,5 m | 470 px | droite | corps raide, queue rapide |
| espadon | 3 m | 500 px | droite | queue rapide |
| requin bleu | 3 m | 500 px | gauche | l'arrière du corps ondule |
| requin-marteau | 3,5 m | 520 px | gauche | l'arrière du corps ondule |
| grand requin blanc | 4,5 m | 560 px | gauche | l'arrière du corps ondule |
| raie manta | 5 m | 560 px | droite | la grande aile bat lentement |
| orque | 7 m | 610 px | gauche | la queue bat lentement de haut en bas |
| requin-baleine | 10 m | 660 px | gauche | queue très lente |
| baleine à bosse | 14 m | 720 px | gauche | queue très lente |

**Échelle** : l'ordre des tailles est respecté à l'intérieur de la zone, mais l'échelle est plus serrée qu'au lagon et au récif (sinon quinze grands animaux ne tiennent pas sur un écran : la baleine ferait la moitié de la largeur). Conséquence assumée : la tortue luth du large (2 m, 440 px) est dessinée plus petite que la tortue verte du récif (1,1 m, 540 px).

## Créatures des abysses

Même travail sur les 15 créatures des abysses (images générées fournies par le parent). Les sept grandes font leur ronde entre x = 8 480 et x = 10 820 ; les petites restent à leur place ; deux sont posées sur le fond.

| Créature | Taille réelle prise | Largeur | Comportement |
| --- | ---: | ---: | --- |
| poisson-lanterne | 10 cm | 190 px (grossi) | surplace ; son leurre luit (lueur verte dessinée en direct) |
| cténophore | 10 cm | 200 px (grossi) | dérive en tournant lentement, les filaments ondulent |
| pieuvre Dumbo | 30 cm | 270 px | monte et descend, les deux « oreilles » battent |
| calmar vampire | 30 cm | 270 px | pulse, la jupe ondule |
| poisson-vipère | 30 cm | 275 px | surplace, tout le corps ondule |
| isopode géant | 35 cm | 290 px | posé sur le fond, avance par à-coups |
| baudroie abyssale | 40 cm | 300 px | surplace ; son leurre luit (lueur jaune dessinée en direct) |
| ver tubicole géant | 2 m de haut | 275 px de large (440 de haut) | posé près des cheminées, le panache ondule |
| requin-lutin | 3,5 m | 520 px | ronde vers la gauche, près du fond |
| béluga | 4,5 m | 560 px | ronde vers la droite |
| requin du Groenland | 5 m | 570 px | ronde vers la gauche, très lente |
| narval | 7 m, défense comprise | 620 px | ronde vers la gauche, en haut |
| calmar géant | 10 m | 660 px | ronde vers la droite, les bras traînent et ondulent |
| cachalot | 15 m | 730 px | ronde vers la gauche |
| baleine bleue | 25 m | 800 px | ronde vers la droite, queue très lente |

Les grandes suivent l'échelle serrée du grand large ; les petites, l'échelle du lagon (elles sont donc très grossies par rapport aux baleines). Les créatures passent devant les cheminées, la fumée et le sous-marin. Les rayons lumineux tracés autour des leurres dans les images d'origine ont été retirés au détourage et remplacés par une lueur vivante.

**Points à trancher** : deux images de baudroie ont été fournies et aucune de poisson-lanterne (la baudroie grise à points lumineux tient la place du poisson-lanterne) ; l'image de la baleine bleue a les traits d'une baleine à bosse (longues nageoires, tubercules) ; les poissons d'ambiance des abysses comptent eux aussi une baudroie à leurre lumineux, qui peut prêter à confusion avec la créature à gagner.

## Ronde des grandes nageuses

Les grandes nageuses ne font plus du surplace : elles avancent doucement, **toujours dans le sens où elles regardent**, d'un bout à l'autre de leur zone. Aux deux bouts, elles s'éloignent dans le fond (elles rapetissent à 60 % et s'estompent) puis reviennent de la même façon à l'autre bout. Concernées : au récif de corail, le requin à pointes noires, la tortue verte, le napoléon et la raie léopard ; au grand large, les quinze créatures ; dans les abysses, les sept grandes. Vitesses de 6 à 40 px/s (une traversée dure une à sept minutes). Les plus grandes sont dessinées derrière les plus petites.

Réglage : champ `ronde` de chaque créature (`x0`, `x1`, vitesse `v`, sens `dir`).

## Halo, déplacement et fiche des créatures

Au repos, les créatures n'ont **aucun halo** (le liseré permanent essayé d'abord n'a pas plu au parent). Le halo (liseré clair et lueur douce autour de la silhouette) n'apparaît que lorsqu'on désigne une créature :

| Geste | À la souris | Au doigt (tablette) |
| --- | --- | --- |
| montrer le halo | passer la souris sur la créature | garder le doigt posé dessus (un quart de seconde) |
| déplacer la créature | bouton enfoncé, puis glisser | doigt resté posé, puis glisser |
| ouvrir la fiche | clic simple | appui simple |
| faire glisser l'écran | glisser hors d'une créature | glisser hors d'une créature, ou glissé vif qui part d'une créature |

- **Toucher juste** : le test se fait sur la silhouette réelle (pas sur un rectangle), avec une tolérance plus large au doigt qu'à la souris ; quand deux créatures se recouvrent, c'est celle de devant qui répond.
- **Déplacement** : une créature posée ou en surplace reste où on la lâche. Une grande nageuse reprend sa ronde depuis l'endroit où on la lâche (à sa nouvelle profondeur, sans sortir de sa zone). Les positions ne sont pas mémorisées : elles reviennent au rechargement.
- **Fiche** : dans la maquette, une simple fenêtre (image, nom, zone, rareté, anecdote, repris de `app/content/cartes.json`). Dans l'application, ce sera la carte de la collection.
- **Halo** : calculé à la demande, une fois par créature, à partir de sa silhouette ; il suit la même déformation que l'image. Les images n'embarquent plus de liseré.

Le tentacule du calmar géant paraissait « pixelisé » : c'était l'effet d'escalier des bandes verticales sur une ligne fine presque horizontale. Cette créature est désormais découpée en bandes cinq fois plus fines (`nc:90`).

## Glissement de l'écran

Pendant le dessin, la caméra est calée sur la grille des pixels : le fond, le premier plan et les décors se déplacent ensemble d'un nombre entier de pixels, ce qui supprime le tremblement quand la glissade ralentit.

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
