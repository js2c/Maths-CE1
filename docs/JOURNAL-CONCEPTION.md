# Journal de conception

Mémoire de la conversation de conception (claude.ai, 26 au 30 septembre 2026, mise à jour le 30 septembre), pour la reprendre dans une nouvelle conversation sans rien perdre. À lire en premier par toute nouvelle conversation de conception.

**Pour reprendre dans une nouvelle conversation** : ajouter le dépôt `js2c/Maths-CE1` à la session, puis lire, dans cet ordre : ce journal (au moins « État au 30 septembre » et « Prochaines étapes »), `docs/SPEC.md` (la spécification unique : ce que fait l'application), `docs/IDEES.md` (idées, questions ouvertes, revue de périmètre), `docs/AVANCEMENT.md` et `docs/PROMPTS.md`. Les anciennes spécifications, prompts, bilans et recettes sont dans `docs/archives/` : n'y aller que pour retrouver l'origine d'une règle. Outils de recette : `docs/SPEC.md`, section 14. Le parent est sous forfait Claude Pro : économiser l'usage (pas de recette sans demande, recettes ciblées).

**Où ranger quoi** : ce que fait l'application dans `docs/SPEC.md` (modifiée en place, jamais de nouvelle spécification par lot) ; pourquoi, dans ce journal (« Décisions prises ») ; ce qui n'est pas décidé, dans `docs/IDEES.md` ; les valeurs, dans `app/content/`.

## Qui fait quoi

| Rôle | Où | Fait |
| --- | --- | --- |
| Le parent | Tablette, GitHub | Décide, fusionne les demandes de fusion (PR), lance chaque lot, teste avec l'enfant, génère les illustrations des cartes (Nano Banana) |
| Conversation de conception | claude.ai | Pédagogie, choix graphiques, rédaction de la SPEC et des prompts de lot, relecture des bilans, prompts Nano Banana, intégration des images ; dépose ses modifications par PR |
| Claude Code (web) | Sessions sur le dépôt | Construit l'application, une étape par session, tient `docs/AVANCEMENT.md` |

**Cycle d'un lot (depuis le 30 septembre)** : le lot est décrit dans `docs/SPEC.md` (sections « à construire »), le prompt tiré de `docs/PROMPTS.md` ; lots courts (une fonction, une session) ; recette de Claude Code ; recette fonctionnelle du point de vue de l'enfant ; fusion ; essai de dix minutes avec l'enfant. *Cycle des lots 2 à 3 ter, pour mémoire* : prompt rédigé en conception (`docs/PROMPT-*.md`, archivés) → une étape par session Claude Code → **une PR vers `main` par étape**, avec le tableau de recette → **recette de la conversation de conception** sur la branche (simulation de séances, séance jouée à vitesse réelle, captures) → fusion par le parent → publication automatique (GitHub Pages) → essais sur la tablette (voix, ressenti, réactions de l'enfant : ce que la recette ne peut pas juger) → étape suivante.

**Hygiène des sessions Claude Code** (retours du lot 1) : une étape par session (« traite uniquement cette étape, puis arrête-toi ») ; couper la session vers 30 à 40 % de contexte ; réflexion « élevé » pour les étapes de logique fine ou de graphisme, « moyen » ailleurs ; captures limitées aux écrans modifiés. Coût constaté du lot 1 : **68 $**, environ 6 h (session unique trop longue au départ).

## Décisions prises (et pourquoi)

| Sujet | Décision | Raison |
| --- | --- | --- |
| Cible pédagogique | Remédier aux trois points faibles de l'évaluation Repères de septembre : ligne graduée (0/3), tables d'addition (1,2/3), calcul rapide (1/3). Pas de diagnostic complémentaire : on part du niveau 1 avec « voie rapide » | Le reste (lire, écrire, problèmes, dénombrement) est quasi acquis |
| Format | PWA hors ligne, GitHub Pages (dépôt public, aucune donnée de l'enfant en ligne), tablette Android paysage, scène fixe 1280 × 800 mise à l'échelle | Pas de backend, pas de coût d'hébergement |
| Séance | 10 à 12 min, une séance comptée par jour, notion du jour choisie par l'application (pas de changement d'activité pendant la séance) | Éviter que l'enfant fuie ce qui est difficile |
| Style de l'application | **Style A « BD au marqueur »** (main du koï d'anidoodle), univers sous-marin, pieuvre mascotte ; un personnage guide par module (tortue, bernard-l'ermite, dauphin, crabe) | Choisi par le parent parmi trois maquettes |
| Animation | Boucles d'images fabriquées à l'avance par l'atelier, composées en direct ; rien de lourd dessiné en direct | Mesure : 70 à 190 ms par image pour dessiner la scène en direct |
| Voix | Phrases générées à l'avance. D'abord **Piper, voix fr_FR-siwis-medium** (CC-BY 4.0) ; depuis octobre 2026, **Chatterbox Multilingual V3 qui imite la voix du parent**, sur son ordinateur, chaque fichier contrôlé par retranscription (8 555 phrases) ; synthèse du navigateur en secours | Voix du navigateur variable et peu fiable ; Piper jugée trop robotique et monotone par le parent |
| Récompenses | Étoiles de mer → coquillages → cartes → récif ; on ne perd jamais rien ; progression visible fondée sur l'effort et la régularité | Motivation sans décourager |
| Entraînement libre | Bouton « Encore ! » après la séance, **sans étoiles ni coquillages**, mais compté dans le suivi | Garder les récompenses liées au rendez-vous du soir |
| Ergonomie (lot 1 bis et correctifs) | Bouton maison, frise d'avancement (plate, pas un bouton), « passer » dès la première vue sur leçons, exemples et corrections, leçons avec « rejouer » et « passer » seulement, « je ne sais pas » (NSP) compté comme erreur | Retours du parent après les essais |
| Cartes | **Style différent de l'application** : dessin animalier naturaliste réaliste, en mouvement, **pleine image** (cadre et bandeau du nom ajoutés par l'application) ; album avec les **dos** des cartes à découvrir ; 60 cartes du familier (lagon) au spectaculaire (requins, orques, baleines) ; légendaires via la régularité | Objet précieux, envie d'aller plus loin |
| Illustrations des cartes | Générées par le parent avec Nano Banana, déposées dans la conversation de conception, converties en WebP 900 × 1200 et intégrées par PR. Le parent contrôle lui-même les images | Préférence du parent |
| Recette (27 septembre) | À chaque étape : `tests/sim-seances.mjs` (profils sait, reel, diff), `tests/e2e/recette.mjs`, `tests/e2e/recette-durees.mjs` ; critères chiffrés dans `docs/archives/SPEC-LOT2.md`, section 8 | La recette du lot 1 bis a montré des séances de 3 à 6 min, des faits nouveaux étouffés par les révisions, le lagon épuisé en 12 à 14 séances : défauts de spécification invisibles à la lecture des bilans |
| Rythme (27 septembre) | Hypothèse : au moins 2 séances par semaine d'école ; séance de 9 à 11 min ; notion du jour alternée module 1 / module 2 | Décision du parent ; la séance s'arrêtait au nombre de questions |
| Cartes (27 septembre) | 2 cartes nouvelles par semaine d'école (calendrier zone C), doublons au-delà ; 20 % de cartes brillantes (plus le 3e doublon) ; zone suivante ouverte quand communes et rares sont gagnées ; étoile dorée pour 4 semaines d'au moins 2 séances ; légendaires en dernière carte de leur zone | Toutes les cartes à la fin de l'année scolaire ; collection de brillantes comme motivation |
| Son (27 septembre) | Bruitages courts et musique de fond calme, thème marin, plus basse que les bruitages ; fabriqués par un outil du dépôt, échantillons choisis par le parent | Décision du parent |
| Lot 2 (27 septembre) | Option complète (bernard-l'ermite animé) ; nombres jusqu'à 1 000 inclus ; zone 2 avancée (album seulement) ; correctifs « passer » partout (PR #9, fusionnée) | Décisions du parent |
| Sélecteur de difficulté (27 septembre) | Curseur à 4 crans en début de séance, placé sur « conseillé » : plus facile × 0,5, conseillé × 1, plus dur × 1,5, très dur × 2 (étoiles des bonnes réponses) ; vaut dès l'échauffement ; échouer au-dessus ne fait jamais baisser le niveau | Éviter les échauffements triviaux, inciter l'enfant à choisir plus dur |
| Méthode (27 septembre) | Une demande de fusion par étape, fusionnée dans `main` avant l'étape suivante ; reprise sans perte (branche poussée dès le début, brouillon, commits réguliers, rubrique de reprise) | Tester chaque étape sur la tablette ; ne rien perdre si le quota d'utilisation est atteint |
| Son, choix du parent (27 septembre) | Bruitages variante « a » ; les **trois** musiques (harpe, marimba, cloches), une tirée au hasard au début de chaque séance et gardée toute la séance ; débit par défaut 64 kbit/s (3,7 Mo) sauf décision contraire du parent | Écoute des échantillons de l'étape 3 |
| Recettes (27 septembre, soir) | Pour économiser l'usage : Claude Code fait une recette allégée à chaque étape et une recette complète en fin d'enchaînement ; la conversation de conception ne fait de recette que sur demande, ciblée (historique réel de l'enfant, plusieurs soirs, espace parent contre la vérité) ; étapes 4 à 6 enchaînées sur une seule branche | Forfait Pro du parent |
| Lot 3 (27 septembre, 23 h, après les essais du lot 2) | Choisir l'exercice **et le niveau** dès l'accueil (bulle « choisir » ; tous les niveaux accessibles, même jamais atteints) ; l'exercice choisi est la séance du jour, avec étoiles ; le curseur de difficulté agit **à l'intérieur du niveau** choisi ; échauffement passable (bouton et réglage du parent) ; leçon jouée seulement pour la famille travaillée, 80 % des questions sur elle (suppression de `leconSiPasVue`) ; maison des nombres tronquée corrigée ; sauvegardes de test ; module 3 **sans dauphin** | Le parent dirige lui-même l'exercice de l'enfant ; leçon et exercice sans rapport constatés ; le bernard-l'ermite n'apporte rien de pédagogique |
| Lot 3, étape 5 (28 septembre, décisions du parent) | Écran « choisir » en validation **simple** (3 touchers de l'accueil au sélecteur) ; plafond de la voix **80 Mo**, lot 3 sous 60 Mo, bornes du calcul rapide élargies à tout le domaine de chaque procédure (3 762 calculs, 50,96 Mo de voix) ; `ermite.repos` laissé tel quel ; **accueil complet pendant une pause** (continuer, choisir, récif, album, logo du parent ; choisir un autre exercice termine la séance en pause comme interrompue, sans rien perdre) ; **récif en pages, une par zone** (glisser, perles, zone de la dernière carte gagnée) ; **voix des cartes une seule fois**, à l'ouverture | Une enfant qui ne lit pas choisit mieux sans double toucher ; les exemples de la SPEC (68 − 20, 23 + 14) n'étaient pas dans leur niveau ; une pause ne doit pas être une impasse ; le récif sera encombré quand les zones 2 à 4 arriveront ; la voix répétée à chaque retournement gênait |
| Amis de 10 (28 septembre, constat du parent) | Défaut de **spécification**, pas de code : famille choisie + 80 % sur la famille + forme directe d'abord ⇒ en base neuve, 100 % de sommes à 10 dont la réponse directe vaut **toujours 10**, dans l'ordre 1 + 9, 2 + 8… ; la voie rapide déclare la famille acquise en une séance. Même défaut, moindre, pour la famille 5 (réponse 8 ou 9) et la famille 4 (5, 6 ou 7). Correctif proposé (à confirmer après la recette) : formes à trou d'emblée pour les familles définies par leur résultat (famille 3 : toutes à trou, cadre affiché au cran « plus facile » ; famille 5 : au moins 2 sur 3 ; famille 4 : mélangées) ; faits nouveaux tirés au hasard, ordre des termes alterné ; pas d'acquisition sur la seule forme directe ni en une séance ; contrôle automatique « la réponse attendue prend plusieurs valeurs » | Reproduit par simulation du moteur (`Module2Runner`, choix 3, base neuve) ; la recette mesurait le critère « 80 % sur la famille », qui produit précisément la monotonie |
| Plaques du calcul rapide (28 septembre, décision du parent) | Option A : plaques **numérotées 1 à 9** sur un chemin de cailloux (lueur du conseillé, étoile des acquis), l'exemple en petit sous le chiffre ; le parent dirige le choix. Plaque 38 − 5 coupée au bord droit à corriger | Un exemple de calcul ne montre pas la procédure (34 + 5, 34 + 9, 38 + 5 indiscernables) ; avec la validation simple, le nom dit au toucher n'est entendu qu'après avoir choisi |
| Légende des niveaux (28 septembre, décision du parent) | Sur chaque écran de niveaux (ligne, additions, calcul rapide) : un bouton discret ouvre un panneau par-dessus (vignette ou numéro, ce qui est travaillé, un exemple), **croix** pour fermer, rien n'est choisi ; texte rangé une seule fois dans le contenu (légende, guide du parent et espace parent identiques) | L'enfant demande au parent quoi choisir : il doit répondre sans aller dans l'espace parent |
| Appui long (28 septembre, décision du parent) | Garder le doigt (ou le clic) enfoncé sur un pictogramme d'exercice ou sur « leçons » affiche une étiquette explicative, **sans valider** (seuil d'environ 0,5 s) ; étendu aux bulles de l'accueil (jouer, choisir, récif, album) ; l'appui long sur le logo (espace parent) inchangé | Le parent a mis du temps à comprendre ces pictogrammes |
| Recette fonctionnelle (28 septembre, décision du parent) | Avant tout correctif : une recette **ergonomique et pédagogique** du point de vue de l'enfant devant l'écran (et du parent à côté), pas de conformité ; deux sessions Claude Code distinctes (matériel, puis relecteur qui juge avant de lire la SPEC) ; rapport `docs/archives/RECETTE-LOT3.md` ; puis **un seul** lot correctif (lot 3 bis). Prompt : `docs/archives/PROMPT-RECETTE-LOT3.md` (18 à 35 $ estimés) | Les deux défauts du 28 septembre étaient conformes à la SPEC ; celui qui a écrit la SPEC ou le code ne les voit pas |
| Résultat de la recette fonctionnelle (28 septembre) | Rapport `docs/archives/RECETTE-LOT3.md` (branche `claude/lucid-albattani-fp89se`, à fusionner) : 3 bloquants (R1 amis de 10, R2 calcul « très dur » à réponse fixe, R3 ligne « plus facile » en boucle), 16 gênants, 6 cosmétiques. **Témoins** : amis de 10 et plaques indiscernables retrouvés seuls (R1, R15) ; la plaque 38 − 5 coupée manquée (grille moins bonne sur les bords d'écran). **Leçon L5** : jouée une seule fois par séance dans toutes les séquences, pas de bug ; ce que le parent a vu revenir était le cadre de l'aide ou de la correction | Cause commune des bloquants : aucune règle ne garantissait que la réponse attendue varie ; devient le §0 de `docs/archives/SPEC-LOT3BIS.md`, testé sur les 116 combinaisons |
| Arbitrages après la recette (28 septembre, décisions du parent) | (1) **Récompenses** : pas de seuil de bonnes réponses pour les cartes ; le **doublon reçoit une contrepartie visible**, réalisée par un **décor du récif** (15 décors). Précision de conception : la recommandation initiale « une perle vers une brillante » aurait rétabli sous une autre forme la règle du 3e doublon supprimée le 27 septembre ; brillante d'un doublon maintenue à 5 %. (2) **Validation simple** conservée à l'écran « choisir » (proposition du relecteur de revenir à deux temps écartée) ; numéros en grand aussi sur les tuiles de la ligne et des additions. (3) **Leçons L2, L8, L9** refaites dans le lot 3 bis | Lot 3 bis : `docs/archives/SPEC-LOT3BIS.md`, `docs/archives/PROMPT-LOT3BIS.md` (55 à 95 $ estimés, relecteur de contrôle compris) |
| Méthode (29 septembre, après échange avec le parent) | Constat partagé : spécifications longues jamais confrontées à ce qu'elles produisent, recettes de conformité, lots trop gros, spécifications empilées. Désormais : **lots courts** (une fonction, une session) terminés par un essai de dix minutes avec l'enfant ; toute règle pédagogique **simulée et lue en séquences avant d'être codée** ; recette fonctionnelle du point de vue de l'enfant à chaque lot. **Avant le lot 4** : une **spécification unique et vivante**, confrontée au code par une session Claude Code (liste des écarts tranchés par le parent), les anciennes spécifications archivées, l'avancement allégé ; faite **en même temps qu'une revue de périmètre** | Réponse à « est-ce qu'on s'y est mal pris ? » ; le « quoi » dans la spécification unique, le « pourquoi » dans ce journal ; ne pas recopier les réglages (ils vivent dans `app/content/`) |
| Échauffement (29 septembre, décisions du parent) | (1) Bouton **« passer l'échauffement » dédié**, présent pendant tout l'échauffement, pictogramme propre, **confirmation par la coche** (voix, coche, reprise sans toucher après 5 s). (2) **Ne pas changer le principe** des additions d'échauffement, mais leur difficulté suit **automatiquement** le niveau de l'enfant : la famille suivante s'ouvre depuis l'échauffement (80 % des faits en boîte 2 ou plus, 90 % de réussite rapide sur les 12 dernières réponses, une famille par jour au plus), **sans réglage parent** | Le bouton du lot 3 disparaissait à la première réponse et ressemblait à « passer l'exemple » ; les familles ne s'ouvraient que par la notion du jour ou par l'espace parent. Lot 3 ter : `docs/archives/SPEC-LOT3TER.md` (T1, T2) |
| Appui long (29 septembre, décisions du parent) | **Généralisé** à tous les boutons de choix et de commande : validation au **lever du doigt** après un toucher bref ; appui long = étiquette, **jamais de lancement** ; étiquette en **fondu**, disparue **0,5 s** après le lever du doigt. Exception : pavé et bulles-réponses (lot 3 bis, A5) | Le lot 3 bis l'avait limité aux 8 pictogrammes du premier niveau (lecture littérale de B3) ; le parent a lancé une leçon en voulant lire son étiquette. Lot 3 ter, T3 |
| Le récif vivant (29 septembre, décisions du parent) | **Mer continue horizontale** (plutôt que des pages par zone) : panorama de 7 images Nano Banana assemblées, animaux du décor conservés ; poissons en arrière-plan opaques, sans demi-tour, qui sortent à gauche, s'estompent vers le grand large dès la sortie du récif, arrivent aussi depuis le large, plongent derrière le corail ; algues du lagon extraites et ondulantes ; faisceaux de lumière doux et mouvants (pas dans les abysses), surface qui ondule ; reflets sur le sable retirés. **Chantier graphique séparé** (nouvelle conversation, kit `kit-recif-vivant.zip`, démarche dans son `DEMARCHE.md`), intégré plus tard par une demande de fusion dédiée | Maquette testable validée pas à pas avec le parent ; le corail n'est pas extrait (massif dense, bouge peu) : les éléments animés en plus seront générés isolés sur fond uni |
| Spécification unique (30 septembre, décision du parent) | Les six spécifications (première SPEC, lots 2, 3, 3 bis, 3 ter, Compléments) fusionnées en une seule, `docs/SPEC.md`, qui décrit l'application telle qu'elle doit être et marque ce qui reste « à construire » ; anciennes spécifications, prompts, bilans et recettes rangés dans `docs/archives/` ; avancement allégé (historique archivé) ; idées et questions ouvertes regroupées dans `docs/IDEES.md` ; prompts des sessions dans `docs/PROMPTS.md`. Rédigée à partir des spécifications : la confrontation avec le code reste à faire par une session Claude Code (liste des écarts, tranchés par le parent) | Moins d'erreurs de Claude Code, qui n'a plus à chercher laquelle prévaut, et des sessions moins coûteuses ; réalise la décision de méthode du 29 septembre |
| Formulations | Formes à trou : « 3 plus combien, ça fait 7 ? », « Combien plus 4, ça fait 6 ? » ; E5 au singulier (« 1 dizaine ») | Oral naturel pour un enfant de 7 ans |
| Brillantes (27 septembre, décision du parent) | 20 % de chances pour une carte nouvelle, 5 % pour un doublon ; **suppression de la règle « le 3e doublon rend la carte brillante »** ; réglages séparés dans `cartes.json` (`brillanteNouvelle`, `brillanteDoublon`) ; les cartes déjà brillantes le restent. Appliqué au début de l'étape 7 | À 5 séances par semaine, presque toutes les cartes devenaient brillantes avant l'été ; la brillante doit rester une trouvaille |
| Cran « plus facile » (27 septembre, décision du parent) | Moteur inchangé : une réussite au cran « plus facile » ne compte toujours pas pour la montée du niveau conseillé. Parade : le réglage existant de l'espace parent (interdire « plus facile »), expliqué dans `docs/GUIDE-PARENT.md` | Garder « plus facile » comme un repos, pas comme un moyen d'avancer ; le parent intervient s'il devient systématique |
| Relecture extérieure (27 septembre, décisions du parent, faites à l'étape 9) | 1. **Aide des additions passable** : coquillage et aide affichée d'emblée du cran « plus facile » ont le bouton « passer » habituel dès leur début ; un toucher coupe voix et animation, range l'appui et rend le pavé ; aucune attente sans commande au-delà d'environ 2 s (mesuré par `recette-durees.mjs`). 2. **Sortie de la pause** : pas de bouton d'arrêt pour l'enfant ; dans l'espace parent, pendant une pause, « Terminer la séance » (avec confirmation) l'enregistre comme interrompue, sans récompense, et ramène à l'accueil. 3. **Cran « plus facile », additions** : un fait réussi avec l'aide affichée d'emblée ne change pas de boîte (« juste avec une aide : pas de promotion »), sans être renvoyé en boîte 1 ; cohérent avec la ligne graduée. 4. **Stagnation du module 2** : une famille pas acquise après 6 séances d'additions en notion du jour (`module2.json`, `familles2.stagnation`) est dépassée : la suivante devient la famille en cours, avec sa leçon ; l'autre reste travaillée en révision | Une aide sans issue bloquait l'enfant ; l'enfant n'avait aucun moyen de sortir d'une pause sinon de fermer l'application ; « plus facile » faisait monter les faits sans effort ; une enfant en difficulté restait toute l'année sur la famille 1 (simulation : aucune leçon du module 2 sur l'année) |

## État au 30 septembre 2026

- **Lot 3 ter** fusionné (PR #25) : tous les lots 1 à 3 ter sont en ligne.
- **Spécification unique** faite (`docs/SPEC.md`), avec `docs/IDEES.md`, `docs/PROMPTS.md`, un avancement allégé et les archives ; pas encore confrontée au code.
- **Graphisme** (récif vivant, refonte graphique des PR 24 et 26) : projet parallèle, hors du travail fonctionnel.

## État au 29 septembre 2026

- **Lot 3 bis** : terminé et fusionné (PR #22 partie A, PR #23 partie B), avec le correctif de l'état laissé par un exercice quitté en cours. La **session relecteur de contrôle n'a pas été faite** : elle est reportée à la fin du lot 3 ter et couvrira les deux lots.
- **Lot 3 ter** spécifié : `docs/archives/SPEC-LOT3TER.md` (T1 passer l'échauffement, T2 échauffement qui s'ajuste, T3 appui long partout), prompt `docs/archives/PROMPT-LOT3TER.md` (21 à 38 $ estimés, relecteur compris). Hors récif.
- **Récif vivant** : maquette et kit prêts ; suite dans une conversation dédiée, puis une demande de fusion propre.
- **PR 24** (refonte graphique) : ouverte, le parent n'est pas satisfait, pas de fusion prévue pour l'instant ; projet parallèle.

## État au 27 septembre 2026, soir

- **Lot 2 terminé** sur la branche de la PR #17 (étapes 7 à 9, avec les quatre corrections de la relecture extérieure) ; bilan dans `docs/archives/BILAN-LOT2.md`. Étapes 1 à 6 fusionnées (PR #11, #13, #14, #16). Reste : fusionner la PR #17, essayer sur la tablette.

## État au 27 septembre 2026, 23 h 30

- **Lots 1, 1 bis et 2** : terminés, en ligne (https://js2c.github.io/Maths-CE1/) ; lot 2 fusionné (PR #11, #13, #14, #16, #17), bilan `docs/archives/BILAN-LOT2.md`.
- **Lot 3** (`docs/archives/SPEC-LOT3.md`, `docs/archives/PROMPT-LOT3.md`, 5 étapes, 55 à 90 $ estimés) : partie A, correctif du lot 2 (étapes 1 et 2 : choisir l'exercice et le niveau, difficulté dans le niveau, échauffement passable, leçons cohérentes, maison des nombres, sauvegardes de test) ; partie B, calcul rapide (étapes 3 à 5). À lancer : partie A d'abord, fusion et essai sur la tablette, puis partie B.
- **Lot 4** (problèmes, dénombrement, bilans, récif) et **Compléments** B (comparer, doubles et moitiés, pair et impair) et C (heure, monnaie) : à faire.
- Une sauvegarde de test « un mois d'usage » a été fabriquée en conception le 27 septembre (hors dépôt) ; l'outil pérenne est à l'étape 2 du lot 3.

## Prochaines étapes

1. **Essai du lot 3 ter** sur la tablette.
2. **Session relecteur** de contrôle des lots 3 bis et 3 ter (`docs/PROMPTS.md`, « Relecteur ») ; relecture du rapport en conception.
3. **Confrontation de la spécification avec le code** (`docs/PROMPTS.md`, « Confrontation ») ; le parent tranche les écarts.
4. **Revue de périmètre** (`docs/IDEES.md`, section 2), puis le prochain lot ; ordre proposé : sommes jusqu'à 20 et bilans périodiques, puis l'heure et la monnaie (au rythme de la classe), puis les problèmes.
5. **Contenu des cartes** : grand large avant début février 2027, abysses avant fin avril 2027.

## Points ouverts

Regroupés depuis le 30 septembre dans `docs/IDEES.md` (questions à trancher, idées d'amélioration, points à observer, à demander).

## Estimations de coût (Claude Code)

Lot 2 (périmètre élargi le 27 septembre : séance, cartes, son, nombres jusqu'à 1 000, sélecteur de difficulté) : 100 à 150 $ ; lot 3 : 30 à 50 $ ; lot 4 : 50 à 90 $ ; Compléments : 60 à 100 $. Fiabilité : environ ±50 %. Option « recentrée » (moins de personnages animés, récif simplifié) : environ 110 à 160 $ au total au lieu de 180 à 300 $.

## Prompts de référence Nano Banana

**Carte (base)** — joindre une carte déjà validée et commencer par « Same illustration style, medium, lighting and level of detail as the attached image. » :

```
Natural history illustration for a collectible card, vertical 3:4 format, full-bleed:
the painting fills the entire image edge to edge, no border, no frame.
Subject: [CREATURE]

Style: hyper-detailed, realistic wildlife illustration, hand-painted in watercolour and gouache
with fine pencil and ink detailing, in the tradition of classic natural history plates, but
alive and dynamic. Accurate anatomy, true-to-life colours and markings, precise textures
(scales, spines, tentacles, shell ridges). It must look drawn and painted by a master wildlife
artist, not a photograph and not a 3D render. No cartoon features, no exaggerated eyes, no smile.

Movement: the creature is caught in action, as described, with a strong sense of motion:
flowing currents, trailing bubbles, drifting particles, swirling sand, shafts of sunlight
through the water, a dynamic diagonal composition. Dramatic but natural.

Layout: the creature is the clear focus, its head and key features in the upper three quarters.
Keep the bottom 20% of the image calmer (water, sand or shadow, no important detail): a name
banner will be overlaid there. Leave a small margin (about 5%) at the edges for a thin frame.
Background: its natural habitat, painted all the way to the edges, softer and less detailed
than the creature so it stands out.

Strictly no text, no letters, no numbers, no labels, no signature, no watermark.
```

`[CREATURE]` = espèce précise (nom latin), couleurs et marques exactes, points d'anatomie à respecter, et une action (nager, chasser, se retourner…).

**Dos de carte** : les 5 dos existent déjà (lagon, récif, grand large, abysses, légendaire).

## Références

- Évaluation Repères CE1 (fiches descriptives) : https://www.education.gouv.fr/l-evaluation-des-acquis-des-eleves-en-cp-ce1-ce2-cm1-et-cm2-fiches-descriptives-des-exercices-342046
- Programme de mathématiques du cycle 2 (2024) : https://www.education.gouv.fr/sites/default/files/document/Annexe%204%20%E2%80%93%20Programme%20de%20math%C3%A9matiques%20du%20cycle%202-403821.pdf
- anidoodle (Apache 2.0) : https://github.com/alexgreensh/anidoodle
