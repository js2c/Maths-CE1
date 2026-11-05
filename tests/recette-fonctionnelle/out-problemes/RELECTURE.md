# Relecture indépendante du lot « Problèmes » et son traitement

Relecteur : un agent qui n'avait pas vu le travail (3 novembre 2026), avec la méthode commune (`docs/LOTS.md`) : les deux personnes à incarner (`docs/archives/PROMPT-RECETTE-LOT3.md`), les captures (`tests/e2e/out/problemes/`), la voix (`voix.json`), les séquences (`tests/recette-fonctionnelle/out/B-sequences/*/problemes-*.md`), la banque (`docs/maquettes/problemes/ENONCES.md`) ; la spécification (section 7 quinquies) seulement après son premier jugement. Son rapport complet est résumé ci-dessous, constat par constat, avec ce qui en a été fait.

## Les constats et leur traitement

| N° | Gravité | Constat | Traitement |
| --- | --- | --- | --- |
| R1 | bloquant | Un énoncé manqué revenait identique 3 questions plus loin (la correction venait de dire sa réponse) et rapportait le double d'étoiles (« erreur corrigée ») : se tromper payait (78 « +2 » et 26 « +4 » sur les séquences) | **Corrigé** : plus de retour dans la séance (`module7.json`, `repetition.retourErreur` 0) ; l'énoncé manqué revient à une séance suivante, avant les autres (la fiche disait les deux ; choix de la session, journal de conception) |
| R2 | gênant | Le cadre de l'illustration presque toujours vide : seul l'étal a son image | **Reste** : les 21 images sont à générer par le parent (fiche 20 : un fond de papier en attendant) ; dit en tête de la demande de fusion et dans le guide ; proposition du relecteur (les lieux les plus fréquents d'abord : chambre, cuisine, cour, ferme, classe, jardin, boulangerie, bus) reprise |
| R3 | gênant | L'objet des étiquettes : « 4 pommes et 3 poires » montre des pommes ; les animaux sont des jetons jaunes | **Reste** : la banque n'a qu'un objet par énoncé, et l'atelier n'a pas d'objet « animal » ni « poire » (13 objets validés avec la maquette) ; proposition pour le parent (un objet par donnée, de nouveaux objets dessinés), `docs/IDEES.md` |
| R4 | gênant | À la correction, la bonne réponse s'écrit en vert, comme une réussite | **Corrigé** : la plaque reste neutre à la correction |
| R5 | gênant | Au moment de répondre, la question n'est plus redite qu'avec toute l'histoire | **Corrigé** : toucher la plaque de la réponse redit la question seule |
| R6 | gênant | « De plus ne veut pas dire ajouter » dit à une comparaison « de moins » | **Corrigé** : la phrase suit le mot de l'histoire et l'erreur faite (une phrase nouvelle : « Attention : « de moins » ne veut pas dire qu'il faut enlever. ») ; spécification mise à jour (R24) |
| R7 | gênant | La leçon L19 (le schéma en barres) relancée aux groupes, aux comparaisons, aux deux étapes | **Corrigé** : relancée seulement aux niveaux du schéma en barres (1, 2, 4, 6) ; spécification mise à jour (R27) |
| R8 | gênant | Peu d'énoncés par niveau, des réponses répétées (niveau 4 : 6 réponses pour 14 énoncés) | **Reste** : la banque est celle validée avec la maquette ; avec R1, un énoncé ne revient plus le même soir ; proposition pour le parent (des énoncés à gabarit, ou enrichir les niveaux 3 et 4), `docs/IDEES.md` |
| R9 | gênant | La correction des deux étapes dit « la première partie de l'histoire » sans la nommer | **Reste** : nommer la partie demande une phrase par énoncé (16 énoncés, 32 phrases de voix) ; proposition pour le parent |
| R10 | question pour le parent | Au niveau 3, la réponse se compte sur l'image (les groupes formés) | **Reste** : c'est la décision du parent du 30 octobre (« les groupes sont montrés formés, l'enfant les compte ») ; la question va au parent |
| R11 | cosmétique | Énoncés à reformuler (pains de campagne, viennoiseries, « gagnent » dans une soustraction…) | Pour le parent, avec la relecture des rôles (`docs/maquettes/problemes/ENONCES.md`) |
| R12 | cosmétique | Les étiquettes du nombre de groupes ou de parts n'ont pas d'objet | Voulu par la fiche (le contenant vient avec les objets) |
| R13 | cosmétique | La bulle de la mascotte déborde sur le haut de l'illustration | Voulu par la fiche (elle peut couvrir le décor, jamais ce dont parle la voix) |
| R14 | cosmétique | Les couleurs du schéma changent de rôle (comparaison, partie trouvée) | Ce sont les dessins de la maquette validée ; noté |
| R15 | cosmétique | À la reprise après une pause, l'histoire n'est pas redite | La question est redite (comme partout) ; l'histoire, en touchant la mascotte |
| R16 | gênant | La légende des niveaux : l'exemple du niveau 4 faux, des exemples obscurs | **Corrigé** : un exemple par niveau, sous forme de question courte (`legendes.json`, le guide du parent) |
| R17 | gênant | Le texte de l'espace parent, dense et en partie faux (« revient à une séance suivante ») | **Corrigé** : en liste de phrases courtes ; juste avec R1 ; la règle du cran « plus facile » ajoutée (R31) |
| R18 | cosmétique | Les vignettes des niveaux 1, 2, 6 et 4, 8 se ressemblent | Noté (les numéros les distinguent) |
| R19 | cosmétique | Le coquillage et « je ne sais pas » ne sont expliqués nulle part | Ce sont les boutons de tous les exercices (guide du parent, légende de l'appui long) |
| R20 | cosmétique | Le réglage « Problème du jour » trop chiffré | **Corrigé** : « Activé : un ou deux problèmes à la fin de chaque séance, sans l'allonger. » |
| R21 | cosmétique | Le graphique « temps médian d'une réponse juste » gradué de 0 à 1 s | Le graphique commun de l'espace parent ; noté |
| R22 | gênant | Le matériel : `voix.json` ne garde que la fin, les séquences ne montrent pas l'étape fixe | L'étape fixe est recettée par le parcours (`problemes.mjs`, partie 2 : après la notion du jour, « Le problème du jour ! », dans ses 1 min 30) et par la simulation de l'année (`MESURES.md` : jamais sautée) ; `voix.json` refait plus complet pour la recette finale |
| R23 | gênant | La spécification se contredit sur la répétition | **Corrigé** avec R1 |
| R24 | gênant | La phrase de P1 à une comparaison prescrite trop largement | **Corrigé** avec R6 |
| R25 | gênant | La plaque verte à la correction, contraire à la spécification | **Corrigé** avec R4 |
| R26 | gênant | Un seul objet par énoncé dans la banque | Voir R3 |
| R27 | gênant | L19 relancée pour la difficulté persistante (section 9), absent de la section 7 quinquies | **Corrigé** avec R7 ; la section 7 quinquies le dit |
| R28 | gênant | La légende contredit le tableau des niveaux | **Corrigé** avec R16 |
| R29 | gênant | L'étape fixe non recettée | Voir R22 |
| R30 | cosmétique | Jusqu'à 16 problèmes dans une séance | Avec R1, plus d'énoncé revenu : 10 à 14 au plus |
| R31 | cosmétique | Le texte du parent sans la règle du cran « plus facile » | **Corrigé** avec R17 |
