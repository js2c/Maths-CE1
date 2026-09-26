# Avancement

Tenu à jour à chaque étape (un commit par étape). Pour reprendre le travail dans une nouvelle session : lire ce fichier, puis `CLAUDE.md`, `docs/SPEC.md` et `docs/ARCHITECTURE.md`.

## Lot 1

### Fait

| Étape | Contenu | Commit |
| --- | --- | --- |
| 1 | Atelier : pieuvre en pièces (repos + 5 gestes), décor découpé, outil d'export (`art/tools/export-app.mjs`) avec contrôles de reproductibilité et de raccord | `5c70dcf` |
| 2 | Application : scène animée (acteurs, Worker de la ligne, pieuvre en CSS), voix, écran « lire » du module 1, mesures ÷4 | `4e5acb7` |
| 3 | Point d'étape validé par le parent (rendu, gestes). Niveau 5 : 0, 50 et 100 toujours écrits. Ce fichier. | `093c0c1` |
| 4 | Tortue de mer (atelier : repos, saut, nage ; planche spécimen `turtleSheet`), format « sauter » au niveau 1, retour animé E1 (la tortue repart de 0, chaque saut s'allume et se compte), calque d'effets `#fx` | `09a725e` |
| 5 | Socle : PWA (manifeste, icône dessinée dans l'atelier `appIcon`, service worker, liste `tools/precache.mjs` vérifiée par `npm test`), stockage IndexedDB (7 magasins de la SPEC, migrations versionnées, `persist()` au premier lancement), test `tests/e2e/pwa.mjs` (installable, hors ligne) | `4926fee` |
| 6 | Module 1 complet : formats lire, sauter, placer (toucher ou glisser le poisson), estimer (tolérance ±8 puis ±5) ; 8 niveaux, la corde devient une réglette d'école (niveaux 3 à 5) ; règles d'adaptation (`modules/progress.js`) ; question qui revient 3 à 5 questions plus loin ; retours animés E1 à E5 ; chaque réponse enregistrée dans la base ; déclencheurs des leçons (utilisés à l'étape 9) | ce commit |

### Reste à faire (dans l'ordre prévu)

| Étape | Contenu |
| --- | --- |
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
- Format « sauter » (niveau 1) : les nombres écrits sont ceux du niveau, donc tous sauf la cible (sans « ? »). Pièges : a + b − 1 (compter la bouée de départ, E1) et b (oublier le départ, E3).
- Module 1 : pas d'aide (coquillage) définie dans la SPEC pour la ligne graduée ; « aide utilisée » est donc toujours faux pour ce module.
- Placer : l'erreur est typée E4 (symétrique), E1 (un pas à côté), E5 (chiffres inversés), sinon « autre ». Estimer : E4 si placé au symétrique.
- Difficulté persistante : la question plus simple est prise au niveau inférieur (au niveau 1 : une cible proche de 0).
- Les rayons de lumière sont fixes (fondus dans le fond) : leur animation coûtait trop cher sans processeur graphique.

### Points ouverts

- Retours E2 et E5 : quand la ligne commence à gauche, les arcs numérotés et les filets de bulles passent en partie derrière la pieuvre (à décaler ou faire s'écarter la pieuvre).
- La séance en cours de l'application est encore provisoire (boucle de questions du module 1) : le vrai déroulé arrive à l'étape 7.
- La pieuvre montre toujours vers la droite, quelle que soit la place de l'étoile.
- Un à-coup d'environ 170 ms (processeur ÷4) à l'apparition de certaines questions, non expliqué.
