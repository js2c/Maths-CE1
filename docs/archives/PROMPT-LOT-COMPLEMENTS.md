# Prompt du lot « Compléments » (à coller dans Claude Code)

À lancer après le lot 2 au plus tôt, dans une nouvelle session. Réflexion : élevé pour les étapes 1, 4 et 5 (atelier graphique et logique), moyen pour les autres.

---

Lis CLAUDE.md, docs/SPEC.md, docs/archives/SPEC-COMPLEMENTS.md et docs/AVANCEMENT.md. Réalise le lot « Compléments » décrit dans docs/archives/SPEC-COMPLEMENTS.md, en réutilisant les mécaniques existantes (générateurs, adaptation, révision espacée, leçons, récompenses) plutôt qu'en les réécrivant.

Découpe le lot en étapes et inscris-les dans docs/AVANCEMENT.md avant de commencer :
1. *(Fait au lot 2, étape 8 : ne pas refaire.)* A · Nombres jusqu'à 1 000 : niveaux 9 à 13 du module 1 (paramètres dans app/content), format « écrire » (dictée), erreurs E6 et E7, chalut de 100 dans l'atelier, leçon L10.
2. B · Module 5 « Comparer et ranger » : 4 niveaux, signes < > =, rangement par glisser-déposer, erreurs C6 à C8.
3. B · Doubles et moitiés (familles 8 à 10 du module 2, même révision espacée) et module 5 bis « Pair ou impair », leçons L11 et L12.
4. C · Module 6 « L'heure » : horloge-hublot dessinée dans l'atelier (style A, aiguilles manipulables), 5 niveaux, erreurs H1 à H4, leçons L13 et L14.
5. C · Module 7 « La monnaie » : boutique du crabe, pièces et billets stylisés (pas de reproduction des vrais motifs), porte-monnaie coquillage, 5 niveaux, erreurs M1 à M3, leçons L15 et L16. Crée le crabe dans l'atelier s'il n'existe pas encore.
6. Espace parent : réglage « Modules activés » (activer, désactiver, mettre en priorité), lignes des nouveaux modules dans le tableau « Modules », nouveaux codes dans le journal des erreurs. Puis docs/BILAN-LOT-COMPLEMENTS.md.

Règles de travail pour ce lot :
- Une étape par session. À la fin de chaque étape : mets à jour docs/AVANCEMENT.md, fais le commit, pousse la branche, puis arrête-toi.
- Vérifications visuelles limitées aux écrans nouveaux (une capture par nouvel écran, un agrandissement des nouveaux dessins) ; pas de vidéo sauf pour les leçons.
- Tests unitaires pour chaque générateur et chaque détection d'erreur.
- Signale tout écart avec docs/archives/SPEC-COMPLEMENTS.md et sa raison.
