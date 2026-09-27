# Échantillons de son (lot 2, étape 3)

Ces fichiers servent à **choisir la musique de fond et les bruitages** de l'application (`docs/SPEC-LOT2.md`, section 6). L'application ne les utilise pas encore : ce sera l'étape 4, avec les sons choisis.

## Pour écouter

- **Le plus simple** : la page d'écoute publiée (lien dans la demande de fusion de l'étape 3). Elle joue les trois musiques, « écouter le raccord » (la fin de la boucle qui repart au début), les bruitages, une petite scène « comme dans l'application » (musique basse, voix, bruitages), et prépare la ligne à recopier pour donner votre choix.
- **Sans la page** : chaque son existe en MP3, lisible partout. Sur GitHub, ouvrir le fichier, puis « Download » (ou « View raw »).

## Ce qu'il y a

| Fichiers | Ce que c'est |
| --- | --- |
| `musique-harpe` | « La harpe du lagon » : harpe, 64 battements par minute, boucle de 2 min 30 |
| `musique-marimba` | « Le marimba des bulles » : marimba doux, 68 battements par minute, boucle de 2 min 21 |
| `musique-profondeurs` | « Les profondeurs » : nappe plus présente et quelques cloches douces, 60 battements par minute, boucle de 2 min 24 |
| `bruitage-bonne-a`, `bruitage-bonne-b` | bonne réponse, deux variantes : a (deux bulles et une perle), b (trois bulles) |
| `bruitage-erreur-a`, `bruitage-erreur-b` | erreur, deux variantes : a (une bulle grave et douce), b (deux bulles étouffées) |
| `bruitage-etoile` | l'étoile vole vers le compteur |
| `bruitage-coquillage` | le coquillage s'ouvre (2 s, le seul de plus d'une seconde) |
| `bruitage-carte` | la carte se retourne |
| `bruitage-brillante` | la carte est brillante |
| `bruitage-bouton` | toucher d'un bouton |
| `bruitage-zone` | une zone du récif s'ouvre |
| `voix-*.mp3` | trois phrases de la voix de l'application, pour la scène de la page |
| `echantillons.json` | durées, niveaux et poids de chaque son (lu par la page) |

Chaque son est en deux formats : `.ogg` (Opus, le format prévu pour l'application, comme la voix) et `.mp3`.

Les trois musiques sont en gamme pentatonique (cinq notes, sans aucune dissonance forte), avec des vagues lointaines. La mélodie est tirée au hasard, à petits pas et avec des silences, puis figée : aucun motif ne revient, pour que rien n'attire l'attention.

## Comment ils sont fabriqués

Par un programme du dépôt, `node tools/son/fabriquer.mjs` (réglages dans `tools/son/reglages.json`) : aucun enregistrement, aucune banque de sons, donc aucune question de droits. La harpe est une corde pincée simulée, le marimba et les cloches des sommes de vibrations amorties, les bulles un modèle physique de bulle, les vagues un bruit filtré qui enfle et retombe. Le programme est déterministe : relancé, il redonne exactement les mêmes sons.

## Niveaux

- Bruitages réglés au même niveau perçu (-16 LUFS), l'erreur un peu plus bas (-18), le toucher d'un bouton nettement plus bas (-23) puisqu'il revient sans cesse.
- Musiques à -23 LUFS dans les fichiers. Dans l'application (étape 4), elles joueront environ 18 dB sous les bruitages, et baisseront encore d'environ 10 dB quand la voix parle ; c'est ce que fait la scène de la page d'écoute.

## Poids

En Opus : environ 1,2 Mo par musique, 0,08 Mo pour tous les bruitages. Une musique et tous les bruitages : 1,4 Mo au plus (objectif de la SPEC : moins de 3 Mo).
