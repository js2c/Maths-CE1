# Recette fonctionnelle du lot 3 (à coller dans Claude Code)

Rédigé en conception le 28 septembre 2026, à la demande du parent, après ses premiers essais du lot 3.

## Pourquoi cette recette

Les recettes précédentes vérifiaient la **conformité à la spécification** : critères chiffrés, profils simulés qui répondent automatiquement. Or une application conforme peut rester incompréhensible ou inutile pour l'enfant. Deux défauts, conformes à la SPEC, ont été trouvés par le parent en quelques minutes d'essai.

Cette recette juge l'application **du point de vue de l'enfant assise devant la tablette**, puis du point de vue du parent à côté d'elle. Elle porte sur deux plans :

- **l'ergonomie** : l'enfant sait-elle quoi faire, sans lire ?
- **la pédagogie** : l'exercice fait-il travailler ce qu'il prétend travailler ?

Elle ne corrige rien. Elle produit un rapport. Un seul lot correctif suivra, rédigé en conception à partir de ce rapport.

## Comment s'en servir

La recette se fait en **deux sessions Claude Code distinctes**. Le jugement ne doit pas venir de la session qui a lu la spécification et produit le matériel.

| Session | Rôle | Réflexion | Coût estimé |
| --- | --- | --- | --- |
| 1 · Matériel | Produit les captures, les séquences de questions et les mesures. Ne juge rien, ne corrige rien. | moyen | 8 à 15 $ |
| 2 · Relecteur | Joue l'enfant et le parent sur ce matériel, écrit le rapport. | élevé | 10 à 20 $ |

Le total estimé est de 18 à 35 $, avec une incertitude d'environ ± 50 %. Lancer la session 2 seulement quand la session 1 a poussé sa branche. Ensuite, le rapport revient en conception.

## Les deux personnes à incarner

**L'enfant**
- 7 ans, en CE1. Elle lit et écrit les nombres jusqu'à 1 000.
- Elle ne lit pas les phrases : seules comptent l'image et la voix.
- Points faibles : la ligne graduée, les tables d'addition, le calcul rapide.
- Elle touche vite, parfois pendant que la voix parle, parfois deux fois de suite, parfois à côté.
- Elle répond au hasard pour aller plus vite quand elle s'ennuie, et repère très bien une réponse qui revient toujours.
- Elle veut des étoiles et des cartes.
- Quand elle ne comprend pas, elle demande au parent.

**Le parent**
- Pas technicien.
- Assis à côté, il doit pouvoir répondre à « qu'est-ce que je choisis ? » ou « ça veut dire quoi ? » en une dizaine de secondes, sans ouvrir l'espace parent.

---

## Prompt de la session 1 · Matériel

Lis CLAUDE.md, docs/ARCHITECTURE.md et docs/AVANCEMENT.md, puis docs/archives/PROMPT-RECETTE-LOT3.md (ce fichier, section « Session 1 »). Tu prépares le **matériel** d'une recette fonctionnelle. Tu ne juges rien et tu ne modifies pas l'application. Tu écris seulement des outils de test, dans `tests/recette-fonctionnelle/`.

**Méthode**

- Pars de `origin/main` à jour.
- Crée la branche `recette-lot3` (ou garde le nom imposé par l'environnement), pousse-la, et ouvre une demande de fusion en BROUILLON intitulée « Recette fonctionnelle du lot 3 (matériel) ».
- Commit et pousse après chaque partie.
- Arrêt propre au-delà d'environ la moitié du contexte : pousse tout, note dans la demande de fusion où reprendre, et arrête-toi.

Tout va dans `tests/recette-fonctionnelle/out/`, rangé par partie, avec un `INDEX.md` qui décrit chaque fichier en une ligne.

**Format des captures**
- Format de la tablette : 1280 × 800, densité 1.
- Converties en JPEG, qualité 80.
- Regroupées en **planches contact** de 4 captures (2 × 2, chacune légendée : écran, état, ce que dit la voix à ce moment). Le relecteur regardera ces planches, pas les captures une à une, pour limiter l'usage.

Deux sauvegardes servent de point de départ :
- **base neuve** : premier lancement ;
- **un mois** : `node tools/sauvegarde-test.mjs reel 2 4`.

### Partie A · Les écrans et leurs états

Faire des captures, en base neuve et en « un mois » quand l'écran diffère :

- l'accueil : avant et après la séance du jour, et en pause ;
- l'écran « choisir » : les exercices, puis les écrans de niveaux de chaque exercice (ligne graduée, additions, calcul rapide, leçons), avec le conseillé et les validés ;
- le sélecteur de difficulté ;
- l'échauffement ;
- une question de chaque exercice ;
- les aides (coquillage) de chaque famille et de chaque support ;
- une correction pour **chaque** type d'erreur (E1 à E7, C1 à C5, une erreur d'addition directe et une à trou) ;
- le bouton « je ne sais pas » ;
- chaque étape de chaque leçon (L1 à L10) ;
- le défi record ;
- la récompense (étoiles, coquillage, carte nouvelle, doublon, brillante) ;
- le récif ;
- l'album et une carte ouverte ;
- l'espace parent (chaque rubrique).

Pour chaque capture, noter dans la légende **tout ce qui est touchable** à l'écran.

### Partie B · Les séquences de questions

Pour **chaque exercice × niveau (ou famille) × cran**, soit 13 + 7 + 9 niveaux × 4 crans, produire le texte d'une séance complète, telle que le moteur la génère. Le faire en base neuve et en « un mois », avec trois comportements de l'enfant :
- **appliquée** : tout juste, 4 s par réponse ;
- **réelle** : 25 % d'erreurs ;
- **pressée** : réponses au hasard, en 1 s.

Chaque question tient sur une ligne : numéro ; forme affichée (par exemple `3 + ? = 10`, ligne `30–40` avec l'étoile sur 34) ; phrase dite par la voix ; réponse attendue ; réponse donnée ; ce qui suit (correction, aide, leçon relancée, montée, étoiles gagnées).

Ajouter en tête de chaque séquence :
- le nombre de réponses attendues **différentes** ;
- la part des questions dont la réponse est la même que la précédente ;
- la plus longue suite prévisible (même réponse, ou nombres qui avancent d'un pas) ;
- les leçons jouées et combien de fois ;
- les étoiles gagnées par le comportement « pressée » comparées à « appliquée ».

Passer par les runners du moteur, comme `tests/sim-recette.mjs`, sans navigateur.

### Partie C · Le comportement au toucher

Avec Playwright, sur une séance de chaque exercice, noter ce qui se passe (capture avant et après, erreur de page éventuelle) :

- toucher pendant que la voix parle ;
- deux touchers rapides sur la même bulle ;
- toucher à côté des cibles ;
- toucher la maison au milieu d'une animation ;
- appui long sur chaque pictogramme ;
- **ne rien faire pendant 60 s** à chaque type d'écran ;
- enchaîner « passer » partout ;
- revenir à l'accueil et reprendre.

### Partie D · Une séance à vitesse réelle par exercice

Lancer `node tests/e2e/recette.mjs --delai 4.5` pour chaque module, et en plus pour l'additions famille 3 choisie. Relever :
- la chronologie : ce qui est dit, affiché, attendu, et la durée de chaque moment ;
- les attentes sans rien à toucher ;
- la durée totale.

**À la fin**
- Complète `INDEX.md`.
- Vérifie que chaque planche est lisible à l'échelle où elle sera regardée.
- Pousse, complète la description de la demande de fusion (ce qui a été produit, ce qui n'a pas pu l'être), **puis arrête-toi.**

---

## Prompt de la session 2 · Relecteur

Tu es relecteur d'une application de mathématiques pour une enfant de CE1. Lis **seulement**, pour commencer :
- la section « Les deux personnes à incarner » de docs/archives/PROMPT-RECETTE-LOT3.md, puis sa section « Session 2 » ;
- `tests/recette-fonctionnelle/out/INDEX.md` sur la branche de la demande de fusion « Recette fonctionnelle du lot 3 (matériel) ».

**Ne lis ni la spécification, ni le journal de conception, ni le code avant d'avoir terminé la phase 1** : tu dois juger ce que l'enfant voit, pas ce qui était prévu.

### Phase 1 · Jouer l'enfant, puis le parent

Parcours les planches et les séquences dans l'ordre d'une vraie utilisation : premier lancement, choisir, séance, pause, récompenses, récif, album, puis un soir d'un mois plus tard. À chaque écran et à chaque séquence, réponds aux questions de la grille.

**Ergonomie**
1. Sans lire, l'enfant sait-elle ce qu'elle peut toucher et ce que cela fera ? Chaque image se comprend-elle sans la voix ? Et avec la voix ?
2. Y a-t-il un élément coupé, superposé, trop petit pour un doigt, ou ambigu (deux choses qui se ressemblent pour des sens différents) ?
3. Un toucher rapide, double, à côté ou pendant la voix produit-il quelque chose d'inattendu ? Une impasse, une attente sans rien à toucher, une erreur ?
4. Le parent peut-il répondre en dix secondes à « qu'est-ce que je choisis ? » et « ça veut dire quoi ? » depuis l'écran où se trouve l'enfant ?

**Pédagogie**
5. La question oblige-t-elle à mobiliser la compétence visée ? Ou bien la réponse est-elle constante, devinable, trouvable par un motif (même réponse, suite qui avance d'un pas) ?
6. La leçon prépare-t-elle ce qui suit ? Une enfant de 7 ans ferait-elle le lien ?
7. La correction montre-t-elle **pourquoi** c'était faux, avec un appui qu'elle comprend ?
8. D'un niveau (ou d'un cran) au suivant, la difficulté augmente-t-elle réellement, et de la manière annoncée ?
9. Les récompenses suivent-elles un effort ? Compare « pressée » et « appliquée » : répondre au hasard rapporte-t-il presque autant ?
10. Sur une séance entière : quelle impression de répétition ou de monotonie ? À quel moment une enfant de 7 ans décrocherait-elle ?

Note chaque constat avec :
- un identifiant (R1, R2…) ;
- l'écran ou la séquence, avec la planche ou le fichier ;
- la personne (enfant ou parent) ;
- ce qui est observé ;
- **pourquoi c'est un problème pour elle** ;
- la gravité :
  - **bloquant** : elle ne peut pas continuer, ou l'exercice ne fait pas travailler la compétence ;
  - **gênant** : elle se trompe de chemin, s'ennuie, ou a besoin du parent sans raison ;
  - **cosmétique**.

Note aussi ce qui fonctionne bien, en quelques lignes : le correctif ne doit pas le casser.

### Phase 2 · Qualifier

Lis ensuite docs/SPEC.md, docs/archives/SPEC-LOT2.md et docs/archives/SPEC-LOT3.md. Pour chaque constat, indique s'il s'agit :
- d'un **défaut de spécification** (conforme, mais mauvais pour l'enfant) ;
- d'un **défaut de réalisation** (non conforme) ;
- ou d'une **question** que la spécification ne tranche pas.

Tu peux proposer une piste de correction en une phrase. La décision reviendra à la conception et au parent.

### Le rapport

Écris `docs/archives/RECETTE-LOT3.md`, dans cet ordre :
1. une synthèse en dix lignes : ce qui empêche l'enfant d'apprendre, ce qui la perd, ce qui marche ;
2. les constats bloquants ;
3. les constats gênants ;
4. les constats cosmétiques ;
5. ce qui fonctionne bien.

Chaque constat renvoie à sa planche ou à sa séquence. Commit le rapport sur la branche du matériel, pousse, sors la demande de fusion du mode brouillon avec le titre « Recette fonctionnelle du lot 3 (rapport) », **puis arrête-toi.** Ne corrige rien.
