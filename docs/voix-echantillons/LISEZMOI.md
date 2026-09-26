# Échantillons de voix (lot 1 bis, étape 1)

Ces fichiers servent à **choisir la voix et la vitesse** de l'application. Ils ne sont pas utilisés par l'application.

Chaque voix dit les trois mêmes phrases, à deux vitesses :

- **consigne** : « Place le poisson sur le nombre trente-sept. »
- **correction** : « Six plus trois, ça fait neuf. »
- **anecdote** : « Chez l'hippocampe, c'est le papa qui porte les bébés, dans une poche sur son ventre. »

Nom des fichiers : `<voix>-<vitesse>-<phrase>.mp3` (par exemple `siwis-lente-consigne.mp3`). Pour les écouter : ouvrir le fichier sur GitHub, puis « Download » (ou « View raw ») ; il se lit sur le téléphone ou l'ordinateur.

## Les voix

| Voix (fichiers) | Modèle Piper | Timbre | Licence des données de la voix (MODEL_CARD) | Ce que la licence demande |
| --- | --- | --- | --- | --- |
| `siwis` | fr_FR-siwis-medium | femme | CC-BY 4.0 (corpus SIWIS, université d'Édimbourg) | citer la source (une ligne dans les crédits) |
| `upmc-jessica` | fr_FR-upmc-medium, locutrice 0 | femme | CC-BY-SA 4.0 (corpus UPMC / MaryTTS) | citer la source ; les fichiers son produits seraient probablement à publier sous la même licence (voir plus bas) |
| `upmc-pierre` | fr_FR-upmc-medium, locuteur 1 | homme | CC-BY-SA 4.0 (même corpus) | idem |
| `tom` | fr_FR-tom-medium | homme | AGPLv3 (corpus de l'auteur, git.bksp.space/Tjiho) | incertain (voir plus bas) |

## Les vitesses

| Vitesse (fichiers) | Réglage Piper (`length_scale`) | Effet mesuré |
| --- | --- | --- |
| `normale` | 1,0 (vitesse du modèle) | — |
| `lente` | 1,15 | durée totale des trois phrases : + 5 % pour `siwis`, + 4 % pour `upmc-jessica`, + 14 % pour `upmc-pierre` et `tom` |

Pour `siwis` et `upmc-jessica`, l'écart mesuré est faible (le hasard du rythme, voir plus bas, brouille la mesure sur trois phrases) et peut être à peine audible. La vitesse peut être réglée plus finement à l'étape suivante (par exemple 1,1 ou 1,25) ; il suffit de dire « un peu plus lent » ou « un peu plus rapide ».

## Remarques utiles pour choisir

- **Licences (faits et appréciation).** Le dépôt `rhasspy/piper-voices` est marqué MIT, mais chaque voix renvoie à la licence de ses enregistrements d'origine, qui s'applique en pratique. Le logiciel Piper (`piper-tts` 1.8.0) est sous GPL-3.0 ; il ne tourne que sur l'ordinateur qui fabrique les sons, jamais dans l'application, ce qui ne pose pas de problème.
  - `siwis` (CC-BY 4.0) est la plus simple : il suffit de citer la source.
  - `upmc` (CC-BY-SA 4.0) : le « partage à l'identique » s'appliquerait probablement aux sons fabriqués. Le dépôt étant public, ce n'est pas bloquant : les fichiers son seraient simplement publiés sous CC-BY-SA 4.0.
  - `tom` (AGPLv3) : c'est une licence de logiciel appliquée à des enregistrements ; ce qu'elle impose pour des sons fabriqués n'est pas établi. Mon appréciation : c'est la voix la moins sûre juridiquement, même si le dépôt public rend un conflit très improbable.
- **Qualité du son.** `tom` est enregistrée à 44,1 kHz, les trois autres à 22 kHz (le son peut paraître un peu plus « étouffé »). Les fichiers de ce dossier sont en MP3 mono 64 kbit/s, proche de ce qu'aura l'application.
- **Variations d'une fois à l'autre.** Piper ajoute un peu de hasard au rythme : la même phrase refabriquée n'est pas identique à l'octet près (par exemple, `upmc-jessica-normale-correction` est plus longue que sa version lente, à cause d'une pause). À l'étape suivante, chaque phrase de l'application sera fabriquée une seule fois et gardée dans le dépôt.
- **Prononciation.** Je ne peux pas écouter les fichiers moi-même. J'ai vérifié la transcription phonétique faite par Piper : « trente-sept » [tʁɑ̃tsɛt], « six plus trois » [si ply tʁwa] (sans « s » à « plus »), « ça fait neuf » [sa fɛ nœf] sont correctes. Le rendu réel (naturel, clarté, intonation) reste à juger à l'oreille.

## Refaire les échantillons

```bash
pip install piper-tts imageio-ffmpeg
# télécharger <nom>.onnx et <nom>.onnx.json depuis https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR
python3 docs/voix-echantillons/fabriquer.py <dossier des modèles>
```
