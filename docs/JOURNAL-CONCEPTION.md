# Journal de conception

Mémoire de la conversation de conception (claude.ai, 26 et 27 septembre 2026, mise à jour le 27 septembre à 17 h), pour la reprendre dans une nouvelle conversation sans rien perdre. À lire en premier par toute nouvelle conversation de conception.

**Pour reprendre dans une nouvelle conversation** : ajouter le dépôt `js2c/Maths-CE1` à la session, puis lire, dans cet ordre, ce journal, `docs/SPEC-LOT2.md` (prévaut), `docs/SPEC.md`, `docs/AVANCEMENT.md` (tableau du lot 2 et rubriques « Reprise… » : décisions du parent prises en cours d'étape) et `docs/PROMPT-LOT2.md`. Outils de recette : `tests/sim-seances.mjs` (simulation par profil d'enfant), `tests/e2e/recette.mjs --delai 4.5` (séance jouée à vitesse réelle), `tests/e2e/recette-durees.mjs [--passer]` (attentes). Le parent est sous forfait Claude Pro : économiser l'usage (pas de recette sans demande, recettes ciblées, pas de relecteur indépendant sauf enjeu important).

## Qui fait quoi

| Rôle | Où | Fait |
| --- | --- | --- |
| Le parent | Tablette, GitHub | Décide, fusionne les demandes de fusion (PR), lance chaque lot, teste avec l'enfant, génère les illustrations des cartes (Nano Banana) |
| Conversation de conception | claude.ai | Pédagogie, choix graphiques, rédaction de la SPEC et des prompts de lot, relecture des bilans, prompts Nano Banana, intégration des images ; dépose ses modifications par PR |
| Claude Code (web) | Sessions sur le dépôt | Construit l'application, une étape par session, tient `docs/AVANCEMENT.md` |

**Cycle d'un lot (depuis le lot 2)** : prompt rédigé en conception (`docs/PROMPT-*.md`) → une étape par session Claude Code → **une PR vers `main` par étape**, avec le tableau de recette → **recette de la conversation de conception** sur la branche (simulation de séances, séance jouée à vitesse réelle, captures) → fusion par le parent → publication automatique (GitHub Pages) → essais sur la tablette (voix, ressenti, réactions de l'enfant : ce que la recette ne peut pas juger) → étape suivante.

**Hygiène des sessions Claude Code** (retours du lot 1) : une étape par session (« traite uniquement cette étape, puis arrête-toi ») ; couper la session vers 30 à 40 % de contexte ; réflexion « élevé » pour les étapes de logique fine ou de graphisme, « moyen » ailleurs ; captures limitées aux écrans modifiés. Coût constaté du lot 1 : **68 $**, environ 6 h (session unique trop longue au départ).

## Décisions prises (et pourquoi)

| Sujet | Décision | Raison |
| --- | --- | --- |
| Cible pédagogique | Remédier aux trois points faibles de l'évaluation Repères de septembre : ligne graduée (0/3), tables d'addition (1,2/3), calcul rapide (1/3). Pas de diagnostic complémentaire : on part du niveau 1 avec « voie rapide » | Le reste (lire, écrire, problèmes, dénombrement) est quasi acquis |
| Format | PWA hors ligne, GitHub Pages (dépôt public, aucune donnée de l'enfant en ligne), tablette Android paysage, scène fixe 1280 × 800 mise à l'échelle | Pas de backend, pas de coût d'hébergement |
| Séance | 10 à 12 min, une séance comptée par jour, notion du jour choisie par l'application (pas de changement d'activité pendant la séance) | Éviter que l'enfant fuie ce qui est difficile |
| Style de l'application | **Style A « BD au marqueur »** (main du koï d'anidoodle), univers sous-marin, pieuvre mascotte ; un personnage guide par module (tortue, bernard-l'ermite, dauphin, crabe) | Choisi par le parent parmi trois maquettes |
| Animation | Boucles d'images fabriquées à l'avance par l'atelier, composées en direct ; rien de lourd dessiné en direct | Mesure : 70 à 190 ms par image pour dessiner la scène en direct |
| Voix | Phrases générées à l'avance avec **Piper, voix fr_FR-siwis-medium, vitesse normale** (CC-BY 4.0), 1 496 phrases, 9 Mo ; synthèse du navigateur en secours | Voix du navigateur variable et peu fiable |
| Récompenses | Étoiles de mer → coquillages → cartes → récif ; on ne perd jamais rien ; progression visible fondée sur l'effort et la régularité | Motivation sans décourager |
| Entraînement libre | Bouton « Encore ! » après la séance, **sans étoiles ni coquillages**, mais compté dans le suivi | Garder les récompenses liées au rendez-vous du soir |
| Ergonomie (lot 1 bis et correctifs) | Bouton maison, frise d'avancement (plate, pas un bouton), « passer » dès la première vue sur leçons, exemples et corrections, leçons avec « rejouer » et « passer » seulement, « je ne sais pas » (NSP) compté comme erreur | Retours du parent après les essais |
| Cartes | **Style différent de l'application** : dessin animalier naturaliste réaliste, en mouvement, **pleine image** (cadre et bandeau du nom ajoutés par l'application) ; album avec les **dos** des cartes à découvrir ; 60 cartes du familier (lagon) au spectaculaire (requins, orques, baleines) ; légendaires via la régularité | Objet précieux, envie d'aller plus loin |
| Illustrations des cartes | Générées par le parent avec Nano Banana, déposées dans la conversation de conception, converties en WebP 900 × 1200 et intégrées par PR. Le parent contrôle lui-même les images | Préférence du parent |
| Recette (27 septembre) | À chaque étape : `tests/sim-seances.mjs` (profils sait, reel, diff), `tests/e2e/recette.mjs`, `tests/e2e/recette-durees.mjs` ; critères chiffrés dans `docs/SPEC-LOT2.md`, section 8 | La recette du lot 1 bis a montré des séances de 3 à 6 min, des faits nouveaux étouffés par les révisions, le lagon épuisé en 12 à 14 séances : défauts de spécification invisibles à la lecture des bilans |
| Rythme (27 septembre) | Hypothèse : au moins 2 séances par semaine d'école ; séance de 9 à 11 min ; notion du jour alternée module 1 / module 2 | Décision du parent ; la séance s'arrêtait au nombre de questions |
| Cartes (27 septembre) | 2 cartes nouvelles par semaine d'école (calendrier zone C), doublons au-delà ; 20 % de cartes brillantes (plus le 3e doublon) ; zone suivante ouverte quand communes et rares sont gagnées ; étoile dorée pour 4 semaines d'au moins 2 séances ; légendaires en dernière carte de leur zone | Toutes les cartes à la fin de l'année scolaire ; collection de brillantes comme motivation |
| Son (27 septembre) | Bruitages courts et musique de fond calme, thème marin, plus basse que les bruitages ; fabriqués par un outil du dépôt, échantillons choisis par le parent | Décision du parent |
| Lot 2 (27 septembre) | Option complète (bernard-l'ermite animé) ; nombres jusqu'à 1 000 inclus ; zone 2 avancée (album seulement) ; correctifs « passer » partout (PR #9, fusionnée) | Décisions du parent |
| Sélecteur de difficulté (27 septembre) | Curseur à 4 crans en début de séance, placé sur « conseillé » : plus facile × 0,5, conseillé × 1, plus dur × 1,5, très dur × 2 (étoiles des bonnes réponses) ; vaut dès l'échauffement ; échouer au-dessus ne fait jamais baisser le niveau | Éviter les échauffements triviaux, inciter l'enfant à choisir plus dur |
| Méthode (27 septembre) | Une demande de fusion par étape, fusionnée dans `main` avant l'étape suivante ; reprise sans perte (branche poussée dès le début, brouillon, commits réguliers, rubrique de reprise) | Tester chaque étape sur la tablette ; ne rien perdre si le quota d'utilisation est atteint |
| Son, choix du parent (27 septembre) | Bruitages variante « a » ; les **trois** musiques (harpe, marimba, cloches), une tirée au hasard au début de chaque séance et gardée toute la séance ; débit par défaut 64 kbit/s (3,7 Mo) sauf décision contraire du parent | Écoute des échantillons de l'étape 3 |
| Recettes (27 septembre, soir) | Pour économiser l'usage : Claude Code fait une recette allégée à chaque étape et une recette complète en fin d'enchaînement ; la conversation de conception ne fait de recette que sur demande, ciblée (historique réel de l'enfant, plusieurs soirs, espace parent contre la vérité) ; étapes 4 à 6 enchaînées sur une seule branche | Forfait Pro du parent |
| Formulations | Formes à trou : « 3 plus combien, ça fait 7 ? », « Combien plus 4, ça fait 6 ? » ; E5 au singulier (« 1 dizaine ») | Oral naturel pour un enfant de 7 ans |

## État au 27 septembre 2026, 17 h

- **Lot 1** et **lot 1 bis** : terminés, en ligne (https://js2c.github.io/Maths-CE1/), correctifs « passer » (PR #9).
- **Lot 2** (`docs/SPEC-LOT2.md`, `docs/PROMPT-LOT2.md`, 9 étapes, 100 à 150 $ estimés) :
  - étape 1, cartes et rythme : faite, fusionnée (PR #11) ;
  - étape 2, séance et progression, sélecteur de difficulté : faite, fusionnée (PR #13) ; première séance mesurée à 8 min 56 s (36 à 44 questions de notion) ;
  - étape 3, échantillons de son : faite, fusionnée (PR #14), choix du parent reçu ;
  - **étapes 4 (son, intégration), 5 (atelier : bernard-l'ermite, aides visuelles) et 6 (module 2 en notion du jour) : à lancer ensemble**, prompt « Enchaîner plusieurs étapes » de `docs/PROMPT-LOT2.md` avec N = 4, M = 6 ;
  - étapes 7 (défi record, grille parent), 8 (nombres jusqu'à 1 000), 9 (bilan) : à faire.
- **Lot « Compléments »** : la partie A (nombres jusqu'à 1 000) est dans le lot 2 (étape 8) ; B et C restent à faire.
- La conversation de conception n'a pas fait de recette sur les étapes 1 à 3 (choix du parent) ; Claude Code a fait les siennes (tableaux dans `docs/AVANCEMENT.md`).

## Prochaines étapes

1. Lancer les étapes 4 à 6 enchaînées ; à la fin, recette ciblée en conception si le parent la demande, fusion, essai sur la tablette.
2. Puis étapes 7 et 8 (enchaînables de la même façon), puis 9 (bilan).
3. **Contenu des cartes** : illustrations et anecdotes du grand large (zone 3) **avant début février**, des abysses (zone 4) **avant fin avril** ; les descriptions `[CREATURE]` sont à rédiger en conception le moment venu (même méthode que la zone 2, voir « Prompts de référence » ci-dessous).
4. Décisions à prendre avant l'étape 9 : règle des brillantes ; comportement du cran « plus facile » (voir points ouverts).

## Points ouverts

- **Brillantes trop nombreuses** : à 5 séances par semaine, presque toutes les cartes deviennent brillantes avant l'été ; au cran « très dur » toujours, 40 sur 60 à 2 séances par semaine. Piste : 20 % pour une carte nouvelle, 5 % pour un doublon, suppression de la règle du 3e doublon ; ou remplacer la brillante par une carte animée (voir ci-dessous).
- **Cran « plus facile » toujours** (simulation de l'étape 2) : l'enfant reste au niveau 2 de la ligne graduée toute l'année et ne gagne que 30 cartes (moitié d'étoiles, pas d'étoile arc-en-ciel). Parades : interdire « plus facile » dans l'espace parent (déjà possible), ou faire compter une réussite au cran « plus facile » pour la montée du conseillé.
- **Cartes animées (idée du parent, 27 septembre)** : remplacer la version brillante par une courte vidéo en boucle (6 s). Avis de conception : réalisable ; WebM (VP9) ou MP4 (H.264) sans son, 3:4 (720 × 960 ou 600 × 800), 24 images/s, environ 0,3 à 0,8 Mo par carte ; image fixe gardée comme affiche et pour l'album ; une seule vidéo jouée à la fois ; téléchargement à la demande plutôt que tout en cache hors ligne. Les vidéos générées en 9:16 se recadrent en 3:4 en gardant toute la largeur et 75 % de la hauteur (sujet centré, rien d'important dans les 12,5 % du haut et du bas). Non décidé, non spécifié.
- **Débit des musiques** : 64 kbit/s par défaut (3,7 Mo) ou 48 kbit/s (2,7 Mo, sous l'objectif de 3 Mo) : à trancher par le parent à l'écoute, sinon 64.
- **Longueur réelle de la séance avec l'enfant** : environ 40 questions de ligne graduée à la première séance ; à observer sur la tablette.
- Modèle de la tablette inconnu ; mémoire des images mesurée à 175 Mo (à vérifier sur la vraie tablette).
- Progression de la classe (centaines, heure, monnaie) à demander à l'enseignante.
- Calendrier scolaire 2027-2028 à ajouter dans `app/content/calendrier.json` avant la rentrée 2027.
- Récif des zones 3 et 4 : question d'échelle pour les très grands animaux (baleines), à traiter au lot 4.

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
