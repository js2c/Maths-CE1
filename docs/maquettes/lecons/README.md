# Maquette du lot « Les leçons » (avec la table d'addition)

**En attente de la validation du parent.** Rien n'est modifié dans `app/` avant sa réponse (`docs/LOTS.md`, méthode commune, « Le point d'arrêt maquette »).

- La maquette elle-même : `art/lecons/index.html` (mode d'emploi dans `art/lecons/README.md`). Elle a la mascotte, la bulle, les boutons et le fond de l'application ; elle n'a pas de voix : la bulle écrit ce que la voix dira.
- Spécification : `docs/SPEC.md`, section 3, « Les leçons », et section 8 (L10). Fiche : `docs/LOTS.md`, lot 3.

## Les écrans (captures en 1280 × 800)

| Capture | Ce qu'elle montre |
| --- | --- |
| `01-accueil.png` | L'accueil à **cinq bulles** : jouer, choisir, **les leçons** (le livre ouvert de l'écran « choisir »), le récif, l'album. |
| `02-menu-lecons.png` | Le **menu des leçons** refait : une rangée par exercice, son pictogramme à gauche (celui de la frise, plat : ce n'est pas un bouton), puis les tuiles. Chaque tuile a **son numéro en grand** et la **vignette du moment clé** de la leçon. Dernière rangée : la table d'addition. Le petit livre de la légende (pour le parent) reste à sa place. |
| `03-menu-lecon-touchee.png` | Une tuile touchée : l'anneau doré, le nom dit. |
| `04-menu-avec-table-multiplication-plus-tard.png` | La place prévue pour la **table de multiplication** (lot « Multiplication ») : à droite de la table d'addition. Elle n'apparaîtra qu'avec ce lot ; d'ici là, la place reste vide. |
| `05-fin-L1.png`, `06-fin-L5-passee.png`, `07-fin-L8.png` | La **fin d'une leçon** (regardée jusqu'au bout ou passée) : deux bulles, **« À toi ! »** (dedans, la tuile du niveau de l'exercice associé, celle de l'écran « choisir », et un petit triangle « on y va ») et **la maison**. Les 3 étoiles d'une leçon regardée jusqu'au bout sont déjà au compteur (05, 07) ; une leçon passée n'en donne pas (06). |
| `10-table.png` | La **table d'addition** : de 0 + 0 à 10 + 10, la somme dans chaque case. Teintes très légères : les doubles en bleu (le reflet), les amis de 10 en corail (le cadre). |
| `11` à `17` | Une case touchée : la case en jaune, ses deux en-têtes éclaircis, le chemin de la rangée et de la colonne teinté ; à droite, le calcul écrit et **l'appui de la famille** (celui des aides et des corrections des additions) ; la bulle dit « 7 plus 5, 12. ». 11 : 7 + 5, deux cadres de 10 (le passage de la dizaine) ; 12 : 7 + 3, le cadre ; 13 : 3 + 3, le reflet ; 14 : 3 + 4, le double et la bulle dorée ; 15 : 6 + 2, les sauts de la tortue ; 16 : 5 + 3, la maison ; 17 : 8 + 0, le calcul seul. |
| `20` à `23` | La **leçon L10 corrigée**, avant et après, aux deux moments où l'on voit les chaluts : « cent ! » (le chalut plein, à sa taille dans la leçon) et « trois chaluts » (réduits). Avant : chaque petit filet du chalut montrait 5 points jaunes ; après : **10 poissons, en deux rangées de 5**, comme le filet de dix poissons et le cadre de 10. |

Les vignettes des leçons, en grand : planche de contrôle `art/out/lecons.png` (`cd art && node tools/still.mjs leconsSheet --frame 0 --out out/lecons.png --scale 2`).

| Leçon | Vignette (le moment clé) |
| --- | --- |
| 1 · On compte les sauts | la tortue sur la corde, après deux sauts numérotés 1 et 2 |
| 2 · Un saut peut valoir 10 | deux bouées géantes, le filet de dix poissons entre elles, l'arc « + 10 » |
| 3 · La ligne ne commence pas toujours à 0 | la loupe sur 30, au début de la ligne ; deux sauts depuis 30 |
| 10 · Les centaines | un filet de dix poissons, une flèche, le chalut plein de dix filets |
| 4 · Les doubles | le poisson et son reflet (trois et trois) |
| 5 · Les amis de 10 | le cadre de 10 : sept poissons, trois places qui s'allument |
| 6 · La maison des nombres | la maison du 7, un étage 5 et 2 |
| 7 · + 10 sur le mur de corail | 34 et 44 sur le mur, la flèche vers le bas ; dizaines en corail, unités en bleu |
| 8 · L'astuce du 9 | 34, puis 44 (+ 10), puis 43 (un pas en arrière) |
| 9 · Passer la dizaine | les cailloux 38, 40, 43 et les ponts « + 2 » et « + 3 » |

## Ce qui se passe (enchaînements)

- **Accueil → « les leçons »** : la voix dit « Les leçons. », puis le menu ; « Quelle leçon veux-tu regarder ? Touche-la. ».
- **Une tuile** : la voix dit son nom (inchangé, par exemple « Les amis de dix. ») et la leçon se joue (les leçons elles-mêmes ne changent pas, sauf L10). À la fin, regardée ou passée : l'écran « À toi ! ».
- **« À toi ! »** : la voix dit « À toi ! », puis le sélecteur de difficulté et l'exercice associé (tableau de `docs/SPEC.md`, section 3), exemples guidés puis questions, **sans échauffement ni leçon d'entrée**. C'est la séance du jour si aucune n'a été terminée aujourd'hui, de l'entraînement libre sinon. **La maison** : retour à l'accueil.
- **La table d'addition** : chaque case touchée dit et montre son calcul ; un nouveau toucher coupe la phrase en cours et la remplace. La maison ramène à l'accueil.
- **L'écran « choisir »** perd son image « les leçons » (« plus depuis l'écran choisir », section 3) : il garde la ligne, les additions, le calcul rapide et les voiliers.

## Les phrases dites (texte exact)

Nouvelles (à fabriquer) :

| Clé (`textes.json`) | Texte | Nombre |
| --- | --- | --- |
| `accueilConsigne` (remplacée) | « Touche une bulle : jouer, choisir, les leçons, le récif ou l'album. » | 1 |
| `accueilConsigneFaite` (remplacée, voir question 5) | « La séance du jour est finie. Tu peux jouer encore, regarder les leçons, ou aller voir le récif et l'album. » | 1 |
| `finLecon` | « À toi ! Touche la grande bulle pour t'entraîner. » | 1 |
| `choixTable` | « La table d'addition. » | 1 |
| `tableConsigne` | « Touche une case : je te dis le calcul. » | 1 |
| `tableCase` | « {a} plus {b}, {n}. », de « 0 plus 0, 0. » à « 10 plus 10, 20. » | 121 |
| **Total** | | **126 phrases**, environ 0,9 Mo (6,8 Ko en moyenne par phrase aujourd'hui), une dizaine de minutes de fabrication |

Déjà fabriquées, reprises telles quelles : « Les leçons. » (`choixNom.lecons`), « Quelle leçon veux-tu regarder ? Touche-la. » (`choixLecon`), les noms des dix leçons (`choixLeconNom`), « À toi ! » (`aToi`), les phrases de L10 (le texte de la leçon ne change pas). Les deux anciennes consignes de l'accueil ne sont plus dites (leurs fichiers seront retirés).

Avec la question 2 réglée autrement (« 7 plus 5, ça fait 12. », la phrase des corrections), il n'y aurait que 55 phrases nouvelles pour la table au lieu de 121 : les 66 sommes jusqu'à 10 sont déjà fabriquées sous cette forme.

## Questions ouvertes (avec la valeur par défaut retenue si vous ne dites rien)

1. **Taille de la table** : de 0 + 0 à 10 + 10 (121 cases, celle de la fiche). Les cases font 64 px, la taille minimale d'une zone à toucher : c'est tout juste ce qui tient en hauteur. *Autre choix* : de 1 + 1 à 10 + 10 (100 cases, plus aérée, sans la rangée des « + 0 »).
2. **La phrase d'une case** : « 7 plus 5, 12. », comme la spécification l'écrit (121 phrases). *Autre choix* : « 7 plus 5, ça fait 12. », la phrase déjà entendue dans les corrections (55 phrases nouvelles seulement).
3. **L'appui montré au-delà de 10** (par exemple 7 + 5) : deux cadres de 10, le premier complété (le passage de la dizaine, comme dans L9), sauf pour + 1 et + 2 (les sauts de la tortue). Le lot « Sommes jusqu'à 30 » pourra le changer avec ses aides nouvelles. Une somme avec 0 : le calcul écrit, sans appui.
4. **Les teintes de la grille** : seulement les doubles (bleu) et les amis de 10 (corail), qui dessinent deux diagonales faciles à voir. *Autres choix* : aucune teinte, ou une teinte par famille.
5. **Après la séance du jour**, la bulle « les leçons » reste à l'accueil, à côté de « Encore ! », du récif et de l'album ; « À toi ! » y lance de l'entraînement libre.
6. **En pause**, l'accueil en pause a aussi la bulle « les leçons » (à la place de la leçon qu'on choisissait par « choisir ») ; la leçon jouée revient à la pause, **sans l'écran « À toi ! »** (qui lancerait un autre exercice et interromprait la séance).
7. **Les leçons jouées dans une séance** (leçon d'entrée d'un niveau, difficulté persistante) ne montrent pas l'écran « À toi ! » : la séance continue comme aujourd'hui. L'écran n'existe qu'après une leçon lancée depuis le menu.
8. **L'écran « À toi ! »** : la petite maison du coin haut gauche est retirée, la grande maison la remplace (une seule maison à l'écran). Sans toucher, rien ne se lance ; « réécouter » redit la phrase ; la mascotte fait un geste après 12 s, comme pendant une question.
9. **La table ne rapporte pas d'étoiles** (on la consulte) ; le compteur d'étoiles n'y est pas affiché, pour laisser la place à la grille.
10. **Les touchers de la table** : la case compte au premier contact, comme le pavé (un appui long compte comme un toucher, un second toucher sur la même case en moins de 150 ms est ignoré).
11. **Le nom dit au toucher d'une tuile** ne change pas (« Les amis de dix. »), sans le numéro.
12. **La légende du parent** (le petit livre) gagne une ligne pour la table : « + · La table d'addition : toucher une case dit et montre le calcul. ».
