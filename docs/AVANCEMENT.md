# Avancement

Tenu à jour à chaque étape (un commit par étape). Pour reprendre le travail dans une nouvelle session : lire ce fichier, puis `CLAUDE.md`, `docs/SPEC.md` et `docs/ARCHITECTURE.md`.

## Lot 1

### Fait

| Étape | Contenu | Commit |
| --- | --- | --- |
| 1 | Atelier : pieuvre en pièces (repos + 5 gestes), décor découpé, outil d'export (`art/tools/export-app.mjs`) avec contrôles de reproductibilité et de raccord | `5c70dcf` |
| 2 | Application : scène animée (acteurs, Worker de la ligne, pieuvre en CSS), voix, écran « lire » du module 1, mesures ÷4 | `4e5acb7` |
| 3 | Point d'étape validé par le parent (rendu, gestes). Niveau 5 : 0, 50 et 100 toujours écrits. Ce fichier. | ce commit |

### Reste à faire (dans l'ordre prévu)

| Étape | Contenu |
| --- | --- |
| 4 | Tortue de mer (atelier : nage, saut de bouée en bouée) et son intégration (format « sauter », retour E1) |
| 5 | Socle : PWA (manifest, icône, service worker), stockage IndexedDB (schéma complet de la SPEC, migrations, `persist()`) |
| 6 | Module 1 complet : formats placer, sauter, estimer ; les 8 niveaux ; règles d'adaptation ; retours animés E1 à E5 ; question qui revient après une erreur |
| 7 | Déroulé de séance : accueil (choix du nom de la pieuvre au premier lancement), échauffement, notion du jour, récompense, plafonnement et « à demain » ; défi record et problème du jour prévus mais désactivés |
| 8 | Échauffement : faits d'addition familles 1 et 2, révision espacée en 5 boîtes, temps de base, pavé numérique |
| 9 | Leçons animées L1 à L3 (frise par étapes, rejouer, phrase précédente) |
| 10 | Récompenses : étoiles de mer, coquillages et ouverture animée, 15 cartes du lagon (anecdotes vérifiées), récif visitable, illustrations provisoires |
| 11 | Espace parent : appui long + code à 4 chiffres, calendrier, historique, niveaux, export CSV et JSON |
| 12 | Déploiement GitHub Pages (GitHub Actions) et explications finales pour le parent |

### Décisions prises

- Niveau 5 : les nombres 0, 50 et 100 sont toujours écrits (réponse du parent, 26 septembre 2026).
- Lot 1 : la notion du jour est toujours le module 1 (le calcul rapide, avec lequel il alterne dans la SPEC, arrive au lot 3).
- Les bras de devant de la pieuvre sortent de sous le rebord du manteau (écart volontaire avec la maquette : supprime une encoche sur la joue).
- Les rayons de lumière sont fixes (fondus dans le fond) : leur animation coûtait trop cher sans processeur graphique.

### Points ouverts

- La pieuvre montre toujours vers la droite, quelle que soit la place de l'étoile.
- Un à-coup d'environ 170 ms (processeur ÷4) à l'apparition de certaines questions, non expliqué.
