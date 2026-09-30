# Prompt du lot 1 (à coller dans Claude Code)

Lis CLAUDE.md, docs/SPEC.md et la compétence .claude/skills/anidoodle/SKILL.md. Réalise le lot 1 décrit dans la section « Découpage en lots » de SPEC.md.

Périmètre du lot 1 :
1. Socle : PWA installable et utilisable hors ligne dans app/ (manifest, icône, service worker), stockage IndexedDB avec le schéma complet de SPEC (séances, réponses, faits, niveaux, bilans, récompenses), moteur de voix fr-FR avec bouton « réécouter ».
2. Atelier graphique (art/) : un outil d'export qui fabrique les planches de sprites et les boucles d'animation vers app/assets/art/, à partir de la scène de référence (art/src/canvas-core/ocean.ts et oceanMarker.ts). Décor sous-marin en couches (eau, rayons, sable, rochers, algues animées), pieuvre animée (flottement, bras qui ondulent, clignement, et les gestes saluer, montrer, se réjouir, réfléchir, encourager), tortue de mer animée (nage, saut de bouée en bouée), poissons animés. Style A strict, craft bar de la compétence respectée, contrôle des détails sur agrandissements.
3. Déroulé de séance (SPEC, « Cadre d'une séance ») : accueil, échauffement, notion du jour, récompense, plafonnement et « à demain ». Les étapes « défi record » et « problème du jour » sont prévues dans le moteur mais désactivées dans ce lot.
4. Module 1 complet : 8 niveaux, 3 formats, génération aléatoire, propositions pièges E1 à E5 et détection du type d'erreur, retours oraux et visuels, règles d'adaptation. La ligne graduée est dessinée par question dans le style A (voir CLAUDE.md, « Animation »).
5. Leçons animées L1 à L3.
6. Échauffement : faits d'addition des familles 1 et 2, révision espacée en 5 boîtes, mesure du temps de base.
7. Récompenses : étoiles de mer, coquillages, ouverture animée, 15 cartes de la zone lagon avec anecdotes vérifiées (retire toute anecdote dont tu n'es pas sûr), récif visitable. Les illustrations des cartes seront fournies plus tard : prévois un emplacement et une illustration provisoire.
8. Espace parent : accès par appui long + code à 4 chiffres, calendrier, historique des séances et des réponses, niveaux, export CSV et JSON.
9. Déploiement de app/ sur GitHub Pages par GitHub Actions.

Commence par l'architecture puis par la fabrication des animations de la pieuvre et du décor, et un écran d'exercice du module 1 assemblé dans l'application. Mesure le temps de démarrage et le temps d'image dans Chromium avec un processeur ralenti 4 fois (1280×800, densité 2). Montre-moi les captures, une courte vidéo et les mesures, puis arrête-toi pour que je valide.
Ensuite, travaille par étapes : tests et captures d'écran à chaque étape, un commit par étape.

À la fin, explique-moi en français simple :
a) l'adresse de l'application ;
b) les réglages à faire dans GitHub pour activer Pages ;
c) comment l'installer sur la tablette Android ;
d) comment accéder à l'espace parent et le tester ;
e) ce qui reste approximatif ou à ajuster.
