# Les captures du lot « Décisions sur les constats de l'agent »

Faites par `node tests/e2e/decisions-agent.mjs` (Chromium, tactile, voix accélérée). Trois tailles d'écran : `-1280` (1280 × 800),
`-1920` (1920 × 1200), `-tablette` (1138 × 711, densité 2,25, la tablette). La bulle de la mascotte écrit ce que dit la voix, mot à
mot : une bulle capturée pendant la phrase n'en montre que le début.

| Capture | Le moment | Ce que dit la voix |
| --- | --- | --- |
| 1a-reprise-accueil-continuer | La page a été rechargée pendant l'échauffement (Android a fermé le navigateur, par exemple), puis rouverte le même jour. | « Te revoilà ! Touche la grande bulle pour continuer. » |
| 1b-parent-reprise | L'espace parent, onglet « Séances », la séance de 1a ouverte après qu'elle a été reprise puis finie. | — |
| 2a-fin-boutique-et-maison | La fin de la récompense, quand l'enfant a de quoi acheter une créature. | « Tu peux choisir une créature à la boutique ! » |
| 2b-maison-a-demain | La maison de 2a touchée. | « C'est fini pour aujourd'hui. À demain ! » |
| 3a-pause-galets | L'accueil pendant une pause (la maison touchée en pleine séance). | — (toucher la mascotte fait dire « C'est la pause. Touche la grande bulle pour continuer. ») |
| 3b-pause-continuer-choisi | Un premier toucher sur le galet de gauche de 3a. | « Continuer. On reprend la séance. » |
| 4a-aide-tortue-egalite | Additions, l'aide de la tortue (le coquillage touché). | « La tortue est sur 4. Elle fait 2 sauts. Compte avec elle ! » (puis « 1 », « 2 ») ; nombres différents selon la capture |
| 4b-calcul-chemin | Calcul rapide, le chemin de l'aide. | « Plus 5. » |
| 4c-voiliers-bouee-nommee | Voiliers, après une erreur. | « Il est plus petit que cette bouée : il passe avant. » |
| 4d-etal-article-allume | L'étal du pêcheur, un article à acheter. | « Ouvre ton portefeuille, et paie juste le prix : pose l'argent dans la soucoupe, puis touche la coche. » puis « Achète le homard. Il coûte… 8 euros. » |
| 6a-voiliers-toucher-un-passage | Voiliers : l'enfant a touché un passage entre deux bouées au lieu de faire glisser le bateau. | « Fais glisser le bateau jusqu'au passage ! » |
| 7a-vitrine-sans-prix-pour-briller | La boutique du récif ; le poisson-clown, en haut à gauche, est déjà dans le récif. | — |
| 7b-tuile-touchee-prix-et-coche | Le poisson-clown de 7a touché. | « C'est le poisson-clown ! Cette créature est déjà dans ton récif. Pour la faire briller, il faut 150 étoiles. Si tu es d'accord, touche la coche verte. » |
| 7c-apres-achat | Juste après l'achat de la crevette (la bulle s'efface). | « Bravo ! Cette créature va vivre dans ton récif ! » |
| 8a-etal-orage-compteur-bulle | L'étal sous l'orage, une question en cours. | « 7 euros. » (fin d'une phrase de prix) |
| 8c-etoile-arc-en-ciel-vers-l-album | La récompense de fin de séance, une famille d'additions vient d'être acquise. | « Et une étoile arc-en-ciel ! Un jour, elle t'ouvrira un nouveau coin du récif. » |

Les séquences de questions (avant et après la nouvelle règle de répétition des additions, famille 3, une séance neuve et une séance
après un mois) sont dans `../sequences/`.
