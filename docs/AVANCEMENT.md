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
| 6 | Module 1 complet : formats lire, sauter, placer (toucher ou glisser le poisson), estimer (tolérance ±8 puis ±5) ; 8 niveaux, la corde devient une réglette d'école (niveaux 3 à 5) ; règles d'adaptation (`modules/progress.js`) ; question qui revient 3 à 5 questions plus loin ; retours animés E1 à E5 ; chaque réponse enregistrée dans la base ; déclencheurs des leçons (utilisés à l'étape 9) | `1924bac` |
| 7 | Déroulé de séance (`js/session/`, `content/seance.json`) : accueil avec choix du nom de la pieuvre au premier lancement (6 noms écrits au feutre, lettres dessinées dans l'atelier `sea/letters.ts`), échauffement (emplacement, rempli à l'étape 8), notion du jour (2 exemples guidés montrés par la tortue puis 8 à 10 questions, fin sur une réussite), défi record et problème du jour prévus mais désactivés, récompense (bilan des étoiles + 10 pour la séance finie, étoiles qui volent vers le compteur), plafond de 12 minutes, « à demain » (lune) et une seule séance terminée par jour ; séance enregistrée dès son début ; test `tests/e2e/seance.mjs` | `b7a9ee4` |
| 8 | Échauffement (module 2, `js/modules/facts/`, `content/module2.json`) : faits des familles 1 (+ 1, + 2 : 30 faits) et 2 (doubles 3+3, 4+4, 5+5), forme directe ; révision espacée en 5 boîtes (magasin « faits ») ; au plus 3 nouveaux faits par séance si la boîte 1 a moins de 8 faits ; temps de base mesuré sur « a + 0 » (médiane des 5 dernières), seuil « rapide » base + 4 s puis + 3 s ; un fait raté revient 3 questions plus loin ; pavé numérique géant (0 à 4 et 5 à 9 en deux rangées, effacer, coche) ; aide du coquillage (la tortue fait 1 ou 2 sauts sur la ligne ; le poisson et son reflet) qui empêche la montée de boîte ; ardoise « a + b = ? » au feutre | ce commit |

### Reste à faire (dans l'ordre prévu)

| Étape | Contenu |
| --- | --- |
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
- Exemple guidé (module 1), proposition à valider : la tortue montre la méthode avant que l'enfant réponde. Lire et placer : elle part de 0 (cible proche, ligne qui commence à 0) ou du nombre écrit le plus proche à gauche, et compte les sauts jusqu'à la cible (un arc numéroté par saut, la voix compte). Sauter : elle fait les sauts en les comptant puis revient au départ. Estimer : le milieu de la ligne s'allume avec son nombre. Il rapporte une étoile s'il est réussi, compte comme question posée pour la séance, mais pas pour les règles d'adaptation ni pour le taux du module.
- Finir sur une réussite : si la dernière réponse est fausse, jusqu'à 2 questions plus simples (niveau inférieur, ou au niveau 1 une cible proche de 0).
- Une seule séance terminée par jour ; une séance interrompue (application fermée) ne compte pas et peut être recommencée le jour même. Une séance est « terminée » dès que la récompense commence.
- Le compteur d'étoiles montre le trésor total ; chaque étoile gagnée est ajoutée aussitôt (rien n'est perdu si la séance s'arrête).
- La montée de niveau n'est pas annoncée à l'enfant (la progression se voit dans le récif, étape 10).
- Faits d'addition : un fait est une addition ordonnée (3 + 1 et 1 + 3 sont deux faits, comme dans le décompte des 66 de la SPEC) ; il appartient à la première famille qui le contient (1 + 1 et 2 + 2 sont dans la famille 1, la famille 2 ajoute 3 + 3, 4 + 4, 5 + 5). Les faits avec 0 ne sont pas dans les familles : ils servent au temps de base.
- Ordre d'introduction : famille par famille ; dans une famille, + 1 avant + 2, du plus petit total au plus grand, le grand nombre d'abord (3 + 1 avant 1 + 3).
- Temps de base : 3 questions « a + 0 » au premier échauffement, puis 1 à chaque échauffement ; médiane des 5 dernières réponses justes (3 s par défaut tant qu'il n'y a pas de mesure). Le temps est compté de l'affichage à la coche, voix comprise, pour les questions triviales comme pour les faits.
- « La moitié des faits en boîte 3 ou plus » (seuil à + 3 s) : la moitié des faits déjà rencontrés, pas des 66 (au lot 1, seuls 33 existent).
- Premières séances : il y a moins de 5 faits dus (3 nouveaux au plus) ; l'échauffement est alors complété par un second passage des faits de la boîte 1 de la séance, qui ne fait pas monter de boîte (une erreur fait redescendre). Même règle pour un fait qui revient après une erreur.
- Réponse au pavé : deux chiffres au plus, validée par la coche (pas de validation automatique, pour pouvoir se corriger).
- Aide du coquillage : proposée dès le lot 1 pour les familles 1 et 2 (tortue sur la ligne ; poissons et leur reflet), absente pour les questions « a + 0 ». Un fait résolu avec l'aide ne monte pas de boîte.
- Une réponse juste à l'échauffement rapporte une étoile, comme ailleurs (questions « a + 0 » comprises).
- Les rayons de lumière sont fixes (fondus dans le fond) : leur animation coûtait trop cher sans processeur graphique.

### Points ouverts

- Retours E2 et E5 : quand la ligne commence à gauche, les arcs numérotés et les filets de bulles passent en partie derrière la pieuvre (à décaler ou faire s'écarter la pieuvre).
- Pendant les exemples guidés et les retours animés, la mesure (processeur ÷4, sans processeur graphique) tombe à 30 images/s environ ; l'allègement automatique s'enclenche. Les mesures de cet environnement varient beaucoup d'un passage à l'autre (8 à 34 images lentes sur la même version).
- Les formes à trou, les familles 3 à 7, le défi record et le bernard-l'ermite restent pour le lot 2.
- Mesure du 26 septembre 2026 après l'étape 8 (processeur ÷4, sans l'échauffement) : démarrage 1,3 à 1,4 s ; intervalle moyen 19 ms, 95e centile 33 ms, allègement au niveau 2 ; 150 Mo de sprites décodés.
- La tortue qui part de 0 passe devant les bras de la pieuvre (même cause que les arcs E2/E5).
- La pieuvre montre toujours vers la droite, quelle que soit la place de l'étoile.
- Un à-coup d'environ 170 ms (processeur ÷4) à l'apparition de certaines questions, non expliqué.
