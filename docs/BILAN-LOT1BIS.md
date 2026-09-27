# Bilan du lot 1 bis — ergonomie et voix

Lot demandé après le premier essai du lot 1 par le parent (docs/SPEC.md, « Ergonomie et voix (lot 1 bis) » ; prompt : docs/PROMPT-LOT1BIS.md). Quatre étapes, du 26 au 27 septembre 2026, sur la branche `claude/blissful-hamilton-vnwgme`. Le détail de chaque étape est dans docs/AVANCEMENT.md.

## Ce qui est fait

| Étape | Contenu | Commit |
| --- | --- | --- |
| 1 | Échantillons de quatre voix Piper, licences notées ; le parent a choisi **siwis, vitesse normale** | `54f5130` |
| 2 | Voix fabriquée à l'avance : inventaire tiré de `app/content/`, nombres en lettres, Opus mono, moteur de voix qui joue les fichiers (synthèse du navigateur en secours) | `2772862` |
| 3 | Ergonomie, cartes en pleine image, album | `e717694` |
| 4 | Ce bilan, guide du parent mis à jour, demande de fusion vers `main` | ce commit |

**Pour l'enfant.**

- **La voix** est la même sur tous les appareils : 1 517 phrases enregistrées à l'avance (voix `fr_FR-siwis-medium`), dont chaque nombre de 0 à 100 et les 66 additions sous leurs trois formes. « Réécouter » rejoue le même fichier.
- **La maison** (en haut à gauche) met la séance en pause ; la bulle « continuer » la reprend là où elle en était, et la voix redit la consigne.
- **La frise** en haut de l'écran : une bulle par étape (accueil, échauffement, notion du jour, récompense) et, dans l'étape en cours, une petite bulle par question qui se remplit d'or. Aucun chiffre.
- **« Je ne sais pas »** (une bulle de parole avec un « ? ») sur chaque question : la voix dit « Ce n'est pas grave, regardons ensemble », la réponse est montrée comme après une erreur, et la question revient plus tard.
- **« Passer »** (deux triangles jaunes, en haut à droite) sur une leçon ou un exemple guidé, à partir de la deuxième fois qu'il est vu.
- **Après la séance** : la lune est un simple décor ; la bulle **« Encore ! »** ouvre l'entraînement libre (la ligne des nombres, les additions, les leçons déjà vues), sans étoiles ni coquillages. Au bout de 10 minutes, la voix propose d'arrêter ; la maison le quitte.
- **Les cartes** montrent les illustrations naturalistes en pleine image, dans un cadre de nacre (commune), d'argent (rare) ou d'or (légendaire), avec le nom sur un bandeau.
- **L'album** (le livre au coquillage, sur l'accueil et dans le récif) : les quatre zones, 15 emplacements chacune, les dos des cartes à découvrir, les zones fermées assombries, 15 perles par zone.
- **Un coquillage dès la première séance** : son prix passe de 40 à 25 étoiles.

**Pour le parent (espace parent).** Les « je ne sais pas » sont comptés à part des erreurs (dans chaque séance et dans le journal des erreurs) ; les exemples guidés et les leçons passés, les pauses (nombre et durée) et l'entraînement libre sont visibles dans l'historique et dans les exports CSV. L'entraînement libre n'apparaît pas dans le calendrier.

**Technique.** Une seule résolution d'images est mise en cache (celle de l'écran) ; les enchaînements de la séance attendent avec une horloge qui s'arrête pendant la pause (`app/js/engine/clock.js`) ; la liste des 60 cartes est dans `app/content/cartes.json` (noms seulement pour les zones 2 à 4). Les nouveaux boutons, pictogrammes, cadres de cartes et la lune sont dessinés dans l'atelier (`art/src/canvas-core/sea/ui.ts`, `treasure.ts`).

## Écarts avec docs/SPEC.md

| SPEC | Ce qui est fait | Raison |
| --- | --- | --- |
| Un coquillage coûte 40 étoiles ; une séance rapporte 35 à 50 étoiles | Coquillage à **25 étoiles** (réglage de `cartes.json`) | Une première séance complète rapporte en réalité 25 à 30 étoiles (simulation : 28 avec une réponse sur deux juste). À 40, le récif restait vide après la première séance, le défaut signalé par le parent |
| La maison « ramène à l'accueil » | Accueil réduit pendant la pause : la bulle « continuer » et le logo du parent ; pas de récif ni d'album | Le récif et l'album utilisent la même scène que la séance en cours |
| La séance « reprend exactement où elle en était » | Exact à une animation près : un saut de tortue commencé (moins d'une seconde) se termine pendant la pause ; la phrase interrompue est redite depuis son début | Arrêter une animation au milieu demanderait de réécrire toutes les animations ; reprendre une phrase au milieu serait incompréhensible |
| Zone fermée : « Le grand large s'ouvrira quand tu auras gagné une étoile arc-en-ciel. » | « Le grand large s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. » (idem pour les autres zones) | L'enfant gagne déjà des étoiles arc-en-ciel, mais les zones ne s'ouvriront qu'au lot 4 : la phrase de la SPEC deviendrait fausse |
| — | Toucher le dos doré d'une légendaire : « C'est une carte légendaire ! Elle se gagne avec les étoiles dorées. » | Ajout : la SPEC ne dit rien pour ces dos |
| « Passer » à partir de la deuxième vue | Les vues sont comptées depuis l'étape 3 | Le lot 1 n'enregistrait pas les vues ; une leçon vue au lot 1 demandera encore une vue complète |
| Voix : si un fichier manque, la synthèse prend le relais pour cette phrase | Si une phrase d'un texte n'a pas de fichier, tout le texte passe par la synthèse | Ne jamais mêler deux voix dans une même phrase (cas rares : nom de pieuvre tapé par le parent, bilan de plus de 60 étoiles) |
| Entraînement libre « ne rapporte ni étoiles ni coquillages » | Un niveau franchi en entraînement libre compte, sans étoile arc-en-ciel | Lecture stricte de « ni étoiles » |

## Mesures

Sur un ordinateur, tablette simulée 1280 × 800, densité 2, processeur ralenti 4 fois (`tests/e2e/perf.mjs`, 26 septembre 2026) :

| Mesure | Lot 1 (après l'étape 8) | Lot 1 bis |
| --- | --- | --- |
| Démarrage (premier écran prêt) | 1,3 à 1,4 s | 1,2 à 1,3 s |
| Intervalle moyen entre images, pendant une séance | 19 ms | 17,5 ms (95e centile 16,8 ms ; 10 images au-delà de 33 ms) |
| Images décodées en mémoire | 150 Mo | 156 Mo |
| Voix | synthèse du navigateur | 1 517 fichiers, 9,4 Mo |
| Téléchargé et gardé hors ligne sur une tablette de densité 2 | 24,8 Mo (lot 1) | 33,0 Mo (dont 9,4 Mo de voix et 5,4 Mo d'illustrations de cartes ; les 5,7 Mo d'images @1x ne sont plus téléchargés) |

Budget de CLAUDE.md : démarrage en moins de 3 s (tenu), 30 images/s au minimum (tenu dans ces mesures). **Tout reste à confirmer sur la vraie tablette.**

**Tests.** 78 tests unitaires (`npm test`) et les parcours Playwright `seance`, `lecons`, `recompenses` (album compris), `ergonomie` (nouveau), `parent`, `voix`, `pwa` passent ; chaque parcours vérifie qu'aucune phrase dite n'est sans fichier son.

## À valider par le parent

1. Le prix du coquillage à 25 étoiles.
2. Les phrases des zones fermées et du dos des légendaires (ci-dessus).
3. Les textes nouveaux : « On continue ! » (reprise), « Tu veux encore jouer ? Choisis ! », « Ici, on s'entraîne pour le plaisir. », « Tu t'entraînes depuis longtemps ! Tu peux t'arrêter quand tu veux : touche la maison. », « Voici ton album ! Touche une carte pour la regarder. » (tous dans `app/content/textes.json`).
4. Une leçon passée est suivie, comme les autres, de « À toi ! » et d'un exercice guidé, et n'est plus relancée comme leçon d'entrée du niveau.
5. Les pictogrammes (captures dans `tests/e2e/out/`, une fois les parcours lancés) : « je ne sais pas », « passer », « Encore ! », l'album, la frise.

## À vérifier sur la tablette

- **Écouter la voix** : aucune phrase n'a été écoutée par une personne ; la vérification a été automatique (décodage, durées, enchaînement). Surtout les nombres, les additions et les phrases nouvelles.
- **Relire les illustrations en grand** (anatomie) : elles n'ont été relues que sur une planche réduite.
- Fluidité, mémoire et démarrage réels ; la voix après une pause longue (Chrome peut couper le son d'un onglet resté en arrière-plan).
- Que la tablette est bien reconnue en densité 2 (sinon elle garde les images @1x, ce qui est prévu).

## Reste ouvert (inchangé depuis le lot 1)

Arcs des retours E2 et E5 en partie derrière la pieuvre ; la tortue qui part de 0 passe devant ses bras ; la pieuvre montre toujours vers la droite ; un petit à-coup à l'apparition de certaines questions ; la « surprise une séance sur cinq » n'est pas faite. Les zones 2 à 4 (anecdotes, illustrations, créatures du récif) et les légendaires gagnées avec les étoiles dorées viennent au lot 4.
