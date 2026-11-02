# Relecture indépendante du lot « Prix de la boutique réglables » (2 novembre 2026)

Un agent relecteur qui n'avait pas vu le travail a reçu la section « Les deux personnes à incarner » de `docs/archives/PROMPT-RECETTE-LOT3.md` et les captures du parcours `tests/e2e/prix-boutique.mjs` (1280 × 800, 1920 × 1200, `s5e`, `petit-smartphone`) ; après son premier jugement, la section 10 de `docs/SPEC.md` (« Prix », « Calibrage »), la ligne « Réglages » de la section 12 et le paragraphe « Les prix » du guide du parent.

Son verdict : ce qui est montré correspond à la spécification et au contenu (`cartes.json`) ; dans la boutique, la vitrine et la mascotte disent les prix du niveau choisi ; « Enregistré » et le retour aux prix d'origine marchent.

## Constats et traitement

| N° | Gravité | Constat | Traitement |
| --- | --- | --- | --- |
| 1 | gênant | Quand une tuile de la première rangée est choisie, la bulle de la mascotte couvre des tuiles achetables (05, 1280). | **Hérité de `main`** (lot « La boutique du récif », `bulleTuile`) : la bulle est temporaire, le temps de la phrase, et un toucher ailleurs la retire. Pas touché dans ce lot ; signalé dans la demande de fusion. |
| 2 | gênant | Sur le petit smartphone, la coche et la croix font environ 32 px CSS. | **Hérité de `main`** : décision du parent du 19 octobre 2026 (les téléphones restent tels quels). Pas touché. |
| 3 | gênant | Le texte d'explication : « au même rythme » ambigu ; « la vitrine est souvent vide » ne dit pas pourquoi c'est gênant ; rien ne rassure en cas d'erreur. | **Corrigé** : « arrivent toujours 2 par semaine » ; « elle n'a souvent plus rien de nouveau à acheter en fin de semaine » ; « Vous pouvez changer à tout moment : ses étoiles restent, rien n'est perdu » ; « Si elle a du mal, prenez plutôt le choix du dessous ». |
| 4 | gênant | L'enfant voit les prix passer de 40 à 70 sans explication. | **Laissé au parent** (choix pédagogique) : le guide lui donne une phrase toute prête ; une phrase de la mascotte au premier passage après un changement serait possible (question ouverte de la demande de fusion). |
| 5 | cosmétique | Les trois titres ne suivent pas le même modèle ; le choix en cours n'est signalé que par la couleur. | Titres **gardés** : ce sont les mots du parent (« Prix pour 2 séances par semaine », « 3 séances par semaine », « 4 séances par semaine »). **Corrigé** : le choix en cours porte une coche (✓). |
| 6 | cosmétique | Un « ; » en début de ligne. | **Corrigé** dans les textes du lot (espace insécable avant « ; » et « : »). |
| 7 | cosmétique | L'éclat « faire briller » devant le prix ressemble à un « + ». | **Hérité de `main`** (pictogramme du lot « La boutique du récif »). Pas touché ; signalé. |
| 8 | gênant | Le bloc « Cartes et boutique » renvoyait à « l'onglet Réglages » ; le nom du niveau s'insérait mal. | **Corrigé** : « (réglage « Prix de la boutique », onglet Données et réglages : « 3 séances par semaine ») » ; la même erreur de nom d'onglet, plus ancienne, pour le rythme, corrigée aussi. |
| 9 | gênant | Le paragraphe du guide : long, chiffres mêlés, repère invérifiable. | **Corrigé** : il commence par « Que choisir ? » (2, 3, 4 soirs, et le choix du dessous si elle a du mal), « environ une séance sur 20 », et un repère chiffré (plus de 4 créatures en vitrine deux semaines de suite : trop cher ; 0 presque à chaque fois : trop bas). |
| 10 | gênant | Les captures : sur le petit smartphone, l'en-tête cachait le réglage ; 03 cachait le paragraphe ; 1280 et 1920 identiques. | **Corrigé** : les captures montrent l'écran tel que le parent le voit (le bloc amené sous l'en-tête, puis la suite) ; sur un petit écran, un choix par ligne (vérifié par le parcours). 1280 et 1920 identiques : attendu (l'espace parent a une largeur maximale de 1 120 px). |
