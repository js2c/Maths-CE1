# Journal de conception

Mémoire de la conversation de conception (claude.ai, 26 et 27 septembre 2026), pour la reprendre dans une nouvelle conversation sans rien perdre. À lire en premier par toute nouvelle conversation de conception, avec `docs/SPEC.md` et `docs/AVANCEMENT.md`.

## Qui fait quoi

| Rôle | Où | Fait |
| --- | --- | --- |
| Le parent | Tablette, GitHub | Décide, fusionne les demandes de fusion (PR), lance chaque lot, teste avec l'enfant, génère les illustrations des cartes (Nano Banana) |
| Conversation de conception | claude.ai | Pédagogie, choix graphiques, rédaction de la SPEC et des prompts de lot, relecture des bilans, prompts Nano Banana, intégration des images ; dépose ses modifications par PR |
| Claude Code (web) | Sessions sur le dépôt | Construit l'application, une étape par session, tient `docs/AVANCEMENT.md` |

**Cycle d'un lot** : prompt rédigé en conception (`docs/PROMPT-*.md`) → le parent le colle dans une nouvelle session Claude Code → une étape par session (commit, poussée, arrêt) → PR vers `main` → fusion par le parent → publication automatique (GitHub Pages) → essais sur la tablette → retour en conception.

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
| Ergonomie (lot 1 bis) | Bouton maison, frise d'avancement, « passer » à partir de la 2e vue, « je ne sais pas » (NSP) compté comme erreur | Retours du parent après le premier essai |
| Cartes | **Style différent de l'application** : dessin animalier naturaliste réaliste, en mouvement, **pleine image** (cadre et bandeau du nom ajoutés par l'application) ; album avec les **dos** des cartes à découvrir ; 60 cartes du familier (lagon) au spectaculaire (requins, orques, baleines) ; légendaires via la régularité | Objet précieux, envie d'aller plus loin |
| Illustrations des cartes | Générées par le parent avec Nano Banana, déposées dans la conversation de conception, converties en WebP 900 × 1200 et intégrées par PR. Le parent contrôle lui-même les images | Préférence du parent |
| Formulations | Formes à trou : « 3 plus combien, ça fait 7 ? », « Combien plus 4, ça fait 6 ? » ; E5 au singulier (« 1 dizaine ») | Oral naturel pour un enfant de 7 ans |

## État au 27 septembre 2026, 1 h

- **Lot 1** : terminé, fusionné, en ligne (https://js2c.github.io/Maths-CE1/).
- **Lot 1 bis** : étapes 1 (échantillons de voix) et 2 (voix générée) faites sur la branche `claude/blissful-hamilton-vnwgme` ; étapes 3 (ergonomie, cartes pleine image, album) et 4 (bilan, PR) à faire.
- **PR #6** (branche `lot-1bis`) : SPEC des cartes (style, pleine image, album, 60 créatures), étape 3 du prompt complétée, 15 illustrations du lagon et 5 dos de cartes dans `app/assets/cards/`. À fusionner avant l'étape 3.
- **Lot « Compléments »** préparé (`docs/SPEC-COMPLEMENTS.md`, `docs/PROMPT-LOT-COMPLEMENTS.md`) : nombres jusqu'à 1 000 ; comparer, doubles, moitiés, pair et impair ; heure et monnaie. À lancer après le lot 2 au plus tôt.

## Prochaines étapes

1. Fusionner la PR #6, puis lancer l'étape 3 du lot 1 bis (message de reprise : fusionner `origin/main` dans la branche, intégrer les images, appliquer les formulations ci-dessus, une seule étape).
2. Étape 4 du lot 1 bis, fusion, essais de plusieurs soirs sur la tablette (écouter la voix, mesurer démarrage, fluidité et mémoire).
3. Bilan en conception, puis rédaction de `docs/PROMPT-LOT2.md`. Décisions à prendre à ce moment : option « recentrée » ou non pour les lots 2 à 4 (personnages guides animés, récif des zones 2 à 4) ; glisser ou non les nombres jusqu'à 1 000 dans le lot 2.
4. Plus tard : anecdotes (à vérifier) et prompts Nano Banana des 45 cartes des zones 2 à 4 (lot 4).

## Points ouverts

- Modèle de la tablette inconnu ; mémoire des images mesurée à 150 à 195 Mo (à vérifier sur la vraie tablette).
- Progression de la classe (centaines, heure, monnaie) à demander à l'enseignante.
- Défauts connus du lot 1 : la pieuvre montre toujours vers la droite ; arcs des retours E2/E5 en partie derrière la pieuvre ; « surprise une séance sur cinq » non faite.
- Récif des zones 3 et 4 : question d'échelle pour les très grands animaux (baleines), à traiter au lot 4.

## Estimations de coût (Claude Code)

Lot 1 bis : 15 à 30 $ (+5 à 10 $ pour l'album et les cartes pleine image) ; lot 2 : 30 à 50 $ ; lot 3 : 30 à 50 $ ; lot 4 : 50 à 90 $ ; Compléments : 60 à 100 $. Fiabilité : environ ±50 %. Option « recentrée » (moins de personnages animés, récif simplifié) : environ 110 à 160 $ au total au lieu de 180 à 300 $.

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
