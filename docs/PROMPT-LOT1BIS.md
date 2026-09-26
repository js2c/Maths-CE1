# Prompt du lot 1 bis « Ergonomie et voix » (à coller dans Claude Code)

## Avant de lancer : un réglage à faire par le parent

Piper doit télécharger ses voix sur le site Hugging Face, qui n'est pas autorisé par défaut dans l'environnement de Claude Code.

1. Dans Claude Code (claude.ai/code), ouvrir les réglages de l'environnement utilisé par le dépôt (icône de réglage à côté du nom de l'environnement, ou « Add cloud environment »).
2. **Network access** : choisir **Custom**.
3. Dans **Allowed domains**, saisir ces lignes :
   ```
   huggingface.co
   *.huggingface.co
   *.hf.co
   ```
4. Cocher **Also include default list of common package managers**, puis enregistrer.
5. Lancer une **nouvelle** session avec cet environnement (le réglage ne s'applique pas à une session déjà ouverte).

Réflexion conseillée : moyen pour toutes les étapes.

---

## Prompt

Lis CLAUDE.md, docs/SPEC.md (en particulier la section « Ergonomie et voix (lot 1 bis) »), docs/ARCHITECTURE.md et docs/AVANCEMENT.md. Réalise le lot 1 bis. Inscris d'abord ces étapes dans docs/AVANCEMENT.md :

1. **Échantillons de voix.** Installe Piper (`pip install piper-tts`), télécharge 3 ou 4 voix françaises de rhasspy/piper-voices sur Hugging Face (par exemple fr_FR-siwis-medium, fr_FR-upmc-medium avec ses deux locuteurs, fr_FR-tom-medium), vérifie la licence de chacune (fichier MODEL_CARD) et note-la. Pour chaque voix, génère les trois mêmes phrases : une consigne (« Place le poisson sur le nombre trente-sept. »), une correction (« Six plus trois, ça fait neuf. ») et une anecdote de carte. Essaie deux vitesses (normale et un peu ralentie). Dépose les fichiers dans docs/voix-echantillons/ avec un petit tableau (voix, licence, vitesse), pousse la branche, puis **arrête-toi** pour que le parent choisisse la voix et la vitesse. Si Hugging Face reste inaccessible, dis-le et arrête-toi aussi.
2. **Voix générée à l'avance.** Avec la voix choisie : outil qui inventorie toutes les phrases à partir de app/content/ (y compris les phrases à nombre, déclinées pour chaque valeur possible, et les 66 additions sous leurs trois formes), écrit nombres et symboles en toutes lettres, génère les fichiers son compressés dans app/assets/voix/ avec un index ; le moteur de voix de l'application joue ces fichiers, garde la synthèse du navigateur en secours, et « réécouter » rejoue le fichier. Vérifie l'inventaire (aucune phrase de l'application sans fichier) par un test, et le poids total (moins de 15 Mo visé).
3. **Ergonomie.** Bouton « maison » avec pause et reprise de la séance ; frise d'avancement ; bouton « passer » à partir de la deuxième vue d'une leçon ou d'un exemple guidé ; bouton « je ne sais pas » (code NSP) ; lune « à demain » qui n'a plus l'air d'un bouton ; bouton « Encore ! » et entraînement libre sans étoiles ni coquillages ; vérification qu'une séance complète rapporte au moins un coquillage ; mise en cache d'une seule résolution d'images ; espace parent : NSP et leçons passées visibles dans l'historique. Cartes : nouvelle mise en page pleine image (cadre selon la rareté, bandeau du nom) et **album** avec les dos des cartes non découvertes et des zones fermées (SPEC, « La carte et l'album ») ; tant que les images de dos n'existent pas, un dos provisoire dessiné dans l'atelier. Mets à jour la liste des cartes de app/content/cartes.json pour les zones 2 à 4 (noms seulement, anecdotes au lot 4).
4. **Bilan.** docs/BILAN-LOT1BIS.md (ce qui est fait, écarts avec la SPEC, mesures), mise à jour de docs/GUIDE-PARENT.md si l'usage change, puis ouvre une pull request vers main.

Règles de travail :
- Une étape par session. À la fin de chaque étape : mets à jour docs/AVANCEMENT.md, fais le commit, pousse la branche, puis arrête-toi.
- Vérifications visuelles limitées aux écrans modifiés (une capture chacun). Pas de vidéo.
- Tests unitaires pour l'inventaire des phrases, la conversion des nombres en lettres, le bouton NSP et l'entraînement libre (aucune étoile gagnée).
- Signale tout écart avec docs/SPEC.md et sa raison.
