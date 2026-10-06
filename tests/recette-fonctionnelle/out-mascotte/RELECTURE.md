# Lot « Mascotte » : la relecture indépendante et son traitement

Relecteur : un agent lancé par la session du lot, qui n'avait pas vu le travail. Il a reçu la section « Les deux personnes à incarner » de `docs/archives/PROMPT-RECETTE-LOT3.md`, les 58 captures du parcours `tests/e2e/mascotte.mjs` (`captures/1280`, `captures/1920`) et le relevé de ce que dit la voix (`parcours-resultat.json`) ; puis, après son premier jugement, les extraits de `docs/SPEC.md` cités par la fiche du lot (sections 2, 3, 8, 11). Il juge ce que l'enfant voit et entend, puis ce que le parent comprend.

Légende du relecteur, seconde étape : (a) écart à la spécification ; (b) conforme mais gênant, donc une question au parent ; (c) déjà là avant le lot.

| N° | Constat | Gravité | Classement | Traitement |
| --- | --- | --- | --- | --- |
| M1 | En leçon L3, la tortue arrive à la nage sur le visage du capitaine (elle partait de l'ancienne place de la pieuvre, à la hauteur de la tête) | bloquant | (a) | **Corrigé** : elle arrive d'en bas à gauche, sous la tête (`engine/turtle.js`, `swimTo`). |
| M2 | Le clip de déception commence par un large sourire | gênant | (a), à voir en vidéo | **Gardé** : clip de la maquette validée par le parent ; le bref sourire du début (0,4 à 0,9 s) est déjà noté « à regarder avec l'enfant » (`docs/IDEES.md`, section 6). Question au parent. |
| M3 | Les réactions se ressemblent sur des images fixes ; à la récompense, le clip est « talk-a » | gênant | (a) en partie, (b) | **Vérifié** : la grande joie est jouée à l'ouverture du bilan (le parcours l'a observée, « récompense : grande joie ») ; elle cède à la phrase suivante après 1,8 s, comme dans la maquette, d'où la capture en « talk-a ». L'ampleur des gestes est celle des vidéos : question au parent. |
| M4 | En « placer », la flèche couchée à côté de l'étiquette se lit comme une direction | gênant | (a) | **Corrigé** : plus de flèche en « placer » et « estimer » (une flèche précise donnerait la place de la réponse). |
| M5 | En L7, la flèche cache 14 et 24 sur le tableau | gênant | (b) | **Corrigé** : posée au bord gauche de la grille, à la hauteur du poisson, pointée vers lui. |
| M6 | La pieuvre reste : bouton « je ne sais pas », frise, icône, logo de l'espace parent | gênant | (b) | **Question au parent** (déjà ouverte dans `docs/IDEES.md`, section 4) : il faut un nouveau dessin, à valider. |
| M7 | En pause, « Touche la grande bulle » : on ne la trouve pas ; une étoile de mer reste seule | gênant | (c) | **Hors du lot**, noté dans `docs/IDEES.md`. |
| M8 | Rien ne montre « réécouter » quand la relance le propose ; la flèche part avec la fin de la consigne | gênant | (b) | **Question au parent** (flèche sur « réécouter » à 25 s) ; la flèche suit la règle de la pieuvre (pendant la consigne). |
| M9 | Le geste de relance arrive à 4 ou 6 s au lieu de 12 s | gênant | (a) | **Corrigé** : défaut du moteur de la maquette, une relance due n'était pas annulée par un toucher (`engine/mascotte.js`, raccord commenté) ; testé. |
| M10 | La flèche jaune de l'erreur E4 semble sortir du menton | gênant | (a) | **Corrigé** : elle part à droite de la tête. |
| M11 | « Touche une bulle » quand la bulle de BD est la plus grande forme blanche | cosmétique à gênant | (c) | **Hors du lot** ; la bulle de BD ne réagit pas au toucher. Noté. |
| M12 | La bulle écrit les nombres en chiffres : en dictée, elle donnerait la réponse | à vérifier, bloquant si confirmé | (b), urgent | **Corrigé** : pendant une question de dictée, la bulle n'écrit rien (`dicteeEnCours`, `main.js`). |
| M13 | « Étoile de mer » ou « étoiles » à la récompense | gênant | (c) | **Hors du lot.** |
| M14 | Les leçons écrivent les nombres en lettres (pas en rouge, moins lisibles) | cosmétique | (c), (b) | **Question au parent** : changer les textes des leçons demande de refabriquer leurs voix. |
| M15 | Forme de la bulle : « À » seul en fin de ligne, ovales en pilule pour une ligne | cosmétique | (a) en partie | **Corrigé** : un mot d'une lettre reste attaché au suivant ; une ligne seule garde un ovale (hauteur au moins un cinquième de la largeur). La bulle « géante pour un mot » est l'instant où les premiers mots s'écrivent : la taille est celle de la phrase entière. |
| M16 | Le capitaine assombri derrière le voile de l'album | cosmétique | (b) | **Question au parent** (la pieuvre y était aussi). |
| M17 | Découpe nette du portrait sous le menton | cosmétique | (b) | **Gardé** : « la tête entière, sans fondu », décision du parent. |
| M18 | Pas de flèche pendant « La tortue part de trente » en L3 | gênant | (a) | **Expliqué et corrigé avec M1** : la flèche se pose quand la tortue arrive ; la capture était prise pendant sa nage. |
| M19 | La flèche de la correction de dictée ne se voit pas | gênant | (a) | **Corrigé** : elle passait sous l'ardoise ; posée à gauche du nombre décomposé, pointée vers lui. |
| M20 | La mascotte parle pendant la pause | à décider | (a) ou (b) | **Conforme** : c'est « réécouter » touché pendant la pause (la phrase de la pause). |
| M21 | Parfois un clip d'attente pendant que la bulle se remplit | à vérifier | (a) | **Expliqué** : au salut, le geste passe avant la parole ; une parole attend au plus 0,8 s un raccord. Le relevé du parcours est pris juste après la capture (quelques dixièmes de seconde plus tard). La séance simulée a relevé 0 fondu forcé sur 150 et 413 raccords. |
| M22 | Petite joie = un clip d'attente | à vérifier | (a) ou (b) | **Conforme** : la petite joie est l'un des clips « approbation », « sourire », « amusé » (maquette, section 5.2). |

Après correction, les parcours concernés (`mascotte`, `selecteur`, `lecons`, `lagon`) ont été relancés : voir la demande de fusion.
