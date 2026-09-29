# Partie C · l'appui long sur chaque bouton recensé (lot 3 ter)

Relevé du parcours `node tests/e2e/lot3ter.mjs --seul appui` (Chromium, 1280 × 800, densité 2, vrai toucher par `Input.dispatchTouchEvent`). Pour chaque bouton : un appui tenu 0,8 s (l'étiquette est-elle visible et dans l'écran ? quelque chose est-il lancé ?), le doigt levé (quelque chose est-il lancé ? l'étiquette a-t-elle disparu 0,5 s après ?), puis, pour les boutons marqués, un toucher bref de 0,08 s (l'action est-elle lancée ?). « Rien de lancé » : l'état de l'écran (étape, pause, écrans ouverts, bouton choisi, phrases dites, pavé) est le même avant, pendant et après. Les touches du pavé et les bulles-réponses répondent au premier contact (exception de la spécification). Rien n'est jugé.

101 boutons ; étiquette visible : 99 ; lancés par un appui long : 0 ; étiquette encore là 0,5 s après le lever : 0.

| écran | bouton | étiquette pendant l'appui | dans l'écran | appui long, puis doigt levé | disparue 0,5 s après | toucher bref |
| --- | --- | --- | --- | --- | --- | --- |
| accueil | jouer | visible | oui | rien de lancé | oui | — |
| accueil | le récif | visible | oui | rien de lancé | oui | — |
| accueil | l'album | visible | oui | rien de lancé | oui | — |
| accueil | choisir | visible | oui | rien de lancé | oui | lancé |
| choisir | ligne | visible | oui | rien de lancé | oui | — |
| choisir | additions | visible | oui | rien de lancé | oui | — |
| choisir | calcul | visible | oui | rien de lancé | oui | — |
| choisir | lecons | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 1 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 2 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 3 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 4 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 5 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 6 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 7 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 8 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 9 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 10 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 11 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 12 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | 13 | visible | oui | rien de lancé | oui | — |
| niveaux ligne | légende | visible | oui | rien de lancé | oui | lancé |
| niveaux ligne | fermer la légende | visible | oui | rien de lancé | oui | lancé |
| niveaux ligne | retour aux exercices | visible | oui | rien de lancé | oui | lancé |
| niveaux additions | 1 | visible | oui | rien de lancé | oui | — |
| niveaux additions | 2 | visible | oui | rien de lancé | oui | — |
| niveaux additions | 3 | visible | oui | rien de lancé | oui | — |
| niveaux additions | 4 | visible | oui | rien de lancé | oui | — |
| niveaux additions | 5 | visible | oui | rien de lancé | oui | — |
| niveaux additions | 6 | visible | oui | rien de lancé | oui | — |
| niveaux additions | 7 | visible | oui | rien de lancé | oui | — |
| niveaux additions | légende | visible | oui | rien de lancé | oui | lancé |
| niveaux additions | fermer la légende | visible | oui | rien de lancé | oui | lancé |
| niveaux additions | retour aux exercices | visible | oui | rien de lancé | oui | lancé |
| niveaux calcul | 1 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 2 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 3 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 4 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 5 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 6 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 7 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 8 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | 9 | visible | oui | rien de lancé | oui | — |
| niveaux calcul | légende | visible | oui | rien de lancé | oui | lancé |
| niveaux calcul | fermer la légende | visible | oui | rien de lancé | oui | lancé |
| niveaux calcul | retour aux exercices | visible | oui | rien de lancé | oui | lancé |
| niveaux lecons | L1 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L2 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L3 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L4 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L5 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L6 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L10 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L7 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L8 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | L9 | visible | oui | rien de lancé | oui | — |
| niveaux lecons | légende | visible | oui | rien de lancé | oui | lancé |
| niveaux lecons | fermer la légende | visible | oui | rien de lancé | oui | lancé |
| niveaux lecons | retour aux exercices | visible | oui | rien de lancé | oui | lancé |
| niveaux ligne | 3 (toucher bref) | visible | oui | rien de lancé | oui | lancé |
| sélecteur | facile | visible | oui | rien de lancé | oui | — |
| sélecteur | conseille | visible | oui | rien de lancé | oui | — |
| sélecteur | dur | visible | oui | rien de lancé | oui | lancé |
| sélecteur | tresdur | visible | oui | rien de lancé | oui | — |
| sélecteur | valider ce choix | visible | oui | rien de lancé | oui | lancé |
| échauffement | réécouter | visible | oui | rien de lancé | oui | lancé |
| échauffement | effacer | visible | oui | premier contact | oui | — |
| échauffement | coche du pavé | visible | oui | premier contact | oui | — |
| échauffement | chiffre 3 | aucune | — | premier contact | oui | tapé |
| échauffement | passer l'échauffement | visible | oui | rien de lancé | oui | — |
| échauffement | maison (pause) | visible | oui | rien de lancé | oui | — |
| échauffement | coquillage d'aide | visible | oui | rien de lancé | oui | lancé |
| aide | passer (l'aide) | visible | oui | rien de lancé | oui | lancé |
| échauffement | je ne sais pas | visible | oui | rien de lancé | oui | lancé |
| correction | passer (la correction) | visible | oui | rien de lancé | oui | lancé |
| échauffement | coche « passer l'échauffement » | visible | oui | rien de lancé | oui | — |
| échauffement | maison (toucher bref) | visible | oui | rien de lancé | oui | lancé |
| accueil en pause | choisir | visible | oui | rien de lancé | oui | — |
| accueil en pause | le récif | visible | oui | rien de lancé | oui | — |
| accueil en pause | l'album | visible | oui | rien de lancé | oui | — |
| accueil en pause | continuer | visible | oui | rien de lancé | oui | lancé |
| ligne | je ne sais pas | visible | oui | rien de lancé | oui | — |
| ligne | bulle-réponse | aucune | — | premier contact | oui | réponse |
| leçon | revoir la leçon | visible | oui | rien de lancé | oui | — |
| leçon | passer la leçon | visible | oui | rien de lancé | oui | lancé |
| album | onglet Le lagon | visible | oui | rien de lancé | oui | — |
| album | onglet Le récif de corail | visible | oui | rien de lancé | oui | — |
| album | onglet Le grand large | visible | oui | rien de lancé | oui | — |
| album | onglet Les abysses et les mers glacées | visible | oui | rien de lancé | oui | — |
| album | carte à découvrir | visible | oui | rien de lancé | oui | — |
| album | une carte gagnée | visible | oui | rien de lancé | oui | lancé |
| carte en grand | retourner la carte | visible | oui | rien de lancé | oui | lancé |
| carte en grand | c'est bon | visible | oui | rien de lancé | oui | lancé |
| album | maison | visible | oui | rien de lancé | oui | lancé |
| récif | l'album | visible | oui | rien de lancé | oui | — |
| récif | maison | visible | oui | rien de lancé | oui | lancé |
| premier lancement | un nom | visible | oui | rien de lancé | oui | lancé |
| premier lancement | c'est bon | visible | oui | rien de lancé | oui | lancé |
| récompense | ouvrir le coquillage | visible | oui | rien de lancé | oui | lancé |
| récompense | c'est bon | visible | oui | rien de lancé | oui | lancé |
| accueil (séance faite) | Encore ! | visible | oui | rien de lancé | oui | lancé |

## Captures (l'étiquette pendant l'appui)

- `C7-appui-long-01.jpg` : accueil en pause continuer
- `C7-appui-long-02.jpg` : accueil jouer
- `C7-appui-long-03.jpg` : accueil séance faite  Encore 
- `C7-appui-long-04.jpg` : album carte à découvrir
- `C7-appui-long-05.jpg` : album onglet Le lagon
- `C7-appui-long-06.jpg` : carte en grand retourner la carte
- `C7-appui-long-07.jpg` : correction passer la correction 
- `C7-appui-long-08.jpg` : leçon revoir la leçon
- `C7-appui-long-09.jpg` : niveaux calcul 7
- `C7-appui-long-10.jpg` : niveaux lecons L2
- `C7-appui-long-11.jpg` : niveaux ligne 1
- `C7-appui-long-12.jpg` : premier lancement un nom
- `C7-appui-long-13.jpg` : récif l album
- `C7-appui-long-14.jpg` : récompense ouvrir le coquillage
- `C7-appui-long-15.jpg` : sélecteur dur
- `C7-appui-long-16.jpg` : échauffement coche passer l échauffement 
- `C7-appui-long-17.jpg` : échauffement maison pause 
- `C7-appui-long-18.jpg` : échauffement passer l échauffement
- `C7-appui-long-19.jpg` : échauffement réécouter
