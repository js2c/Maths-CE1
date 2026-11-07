// LES PROMPTS NANO BANANA DES BOUTONS QUI GARDENT LEUR DESSIN (lot « Nouveaux boutons, mascotte du récif et étoiles », décisions
// du parent du 7 novembre 2026). Le relevé de tous les boutons de l'application qui n'ont pas encore leur image du parent, et pour
// chacun un prompt complet, dans le style des 13 images (verre bombé, anneau gris épais, fond vert uni), prêt à coller tel quel, avec
// le nom du fichier à rendre. Écrit docs/maquettes/boutons/PROMPTS.md.
//   node art/boutons/prompts.mjs
// Les niveaux et les leçons sont lus dans app/content/legendes.json (la légende du parent) : un niveau ajouté y aura son prompt.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { USAGES } from "../../app/js/engine/boutons.js";

const ICI = dirname(fileURLToPath(import.meta.url)), ROOT = resolve(ICI, "../..");
const L = JSON.parse(readFileSync(join(ROOT, "app/content/legendes.json"), "utf8"));
const conf = JSON.parse(readFileSync(join(ICI, "boutons.json"), "utf8"));

// le prompt : le style des 13 images, le sujet, le fond (vert franc pour tous ; « magenta » reste possible), sans texte ni chiffre
export const prompt = ({ sujet, fond = "vert", texte = null }) => `Same style as the two attached button images: one round glossy glass button seen straight from the front, like a domed glass bubble set in a thick dark-grey ring (the same ring thickness, the same grey and the same thin black outline as in the attached images). The glass is a pale bluish white, with soft white reflections at the top left and a light rim reflection at the bottom right. Inside the glass, a small hand-drawn picture in a bold comic marker style: thick dark ink outlines, flat bright colours, one crisp shadow per shape, light from the top left, friendly and simple, like a French children's book.

Inside the button: ${sujet}

The picture stays well inside the glass, never over the ring. The button is a perfect circle, centred, entirely visible, about 85 % of the width of the picture, with an even empty margin all around.

Background: one flat uniform ${fond === "magenta" ? "pure magenta (#FF00FF)" : "pure green (#00FF00)"} colour from edge to edge: no gradient, no texture, no shadow under the button, nothing else.

${texte ?? "Strictly no text, no letters, no numbers, no digits, no labels, no logo, no signature, no watermark."}

Square picture (1:1).`;

// LES BOUTONS DE COMMANDE (un toucher fait quelque chose), du plus vu au moins vu. `ou` : où il sert ; `sprite` : l'ancien dessin
const COMMANDES = [
  { f: "passer", nom: "passer", sprite: "passer", ou: "les leçons, les exemples guidés, les corrections (en haut à droite)", sujet: "two bold yellow triangles pointing to the right, side by side, like a « fast forward » sign, with rounded tips." },
  { f: "valider", nom: "la coche (« c'est bon »)", sprite: "valider", ou: "le pavé des additions et de l'étal, le sélecteur de difficulté, la carte gagnée, la confirmation de « passer l'échauffement »", sujet: "a big bold green tick mark (check mark), slightly tilted, with a dark ink outline." },
  { f: "effacer", nom: "effacer", sprite: "effacer", ou: "le pavé des additions et de l'étal", sujet: "a bold coral-red arrow pointing to the left, like a « backspace » key arrow, short and thick." },
  { f: "aide", nom: "l'aide (le coquillage)", sprite: "aide", ou: "les additions, la multiplication, l'étal, les problèmes", sujet: "a small purple-blue spiral sea shell with a pink opening, and a tiny yellow star sparkling next to it." },
  { f: "je-ne-sais-pas", nom: "« je ne sais pas »", sprite: "nsp", ou: "la ligne graduée, les additions, les voiliers, l'étal", sujet: "a small friendly orange octopus raising two tentacles in the air with a puzzled, shrugging face (« I don't know »), big round eyes." },
  { f: "rejouer", nom: "revoir la leçon", sprite: "rejouer", ou: "les leçons (revoir depuis le début)", sujet: "a bold coral-red circular arrow turning around, like a « replay » sign." },
  { f: "passer-echauffement", nom: "passer l'échauffement", sprite: "passer.echauffement", ou: "l'échauffement (en haut à droite)", sujet: "a blue sea wave at the bottom, and a bold yellow curved arrow jumping over the wave from left to right." },
  { f: "acheter", nom: "acheter (la coche de la boutique)", sprite: "boutique.coche", ou: "la boutique du récif", sujet: "a big bold green tick mark (check mark), slightly tilted, with a dark ink outline." },
  { f: "annuler", nom: "annuler (la croix de la boutique)", sprite: "boutique.croix", ou: "la boutique du récif", sujet: "a bold red cross (X) made of two thick rounded strokes." },
  { f: "legende", nom: "le petit livre de la légende (pour le parent)", sprite: "legende", ou: "les écrans « choisir » et le menu des leçons", sujet: "a small open book seen from the front, white pages with a few grey lines, on a grey cover." },
  { f: "fermer", nom: "fermer la légende", sprite: "fermer", ou: "la légende des niveaux", sujet: "a bold coral-red cross (X) made of two thick rounded strokes." },
  { f: "coquillage", nom: "ouvrir le coquillage (la récompense)", sprite: "coquillage", ou: "la récompense de fin de séance", sujet: "a closed pink scallop shell lying flat, seen from the front, its ridges clearly drawn, a tiny round pink bump on top." },
  { f: "touche", nom: "une touche du pavé et une bulle-réponse (vide : l'application écrit le chiffre)", sprite: "reponse", ou: "le pavé des additions et de l'étal, les bulles-réponses de la ligne graduée", sujet: "nothing: the glass is empty, just the pale glass and its reflections (the application writes a digit on it).", texte: "The glass must stay empty. Strictly no text, no letters, no numbers, no digits, no picture inside." },
  { f: "parents", nom: "le bouton de l'espace parent", sprite: "(image découpée par art/boutons/decoupe.py)", ou: "l'accueil, en bas à gauche (appui long)", sujet: "a small golden padlock, closed, with a tiny blue sea star hanging from it." },
];
// LE SÉLECTEUR DE DIFFICULTÉ : les quatre vagues ; les étoiles de chaque cran (½, 1, 1½, 2), et leur absence en entraînement libre,
// restent dessinées par l'application, posées sur l'image
const VAGUES = [
  { f: "cran-1-plus-facile", nom: "le cran « plus facile »", sujet: "calm flat turquoise sea water filling the bottom third, a gentle ripple on the surface, nothing else." },
  { f: "cran-2-conseille", nom: "le cran « conseillé »", sujet: "turquoise sea water filling the bottom half with one small round wave curling to the left, nothing else." },
  { f: "cran-3-plus-dur", nom: "le cran « plus dur »", sujet: "turquoise sea water with one big wave rising high and curling to the left, a few small bubbles above it, nothing else." },
  { f: "cran-4-tres-dur", nom: "le cran « très dur »", sujet: "turquoise sea water with one huge wave rising to the top of the glass and curling to the left, white foam on its crest, a few bubbles, nothing else." },
];
// les niveaux de l'écran « choisir » et les leçons : la légende du parent (ce qu'on y travaille), et l'idée de l'image
const EXOS = [
  ["ligne", "la ligne graduée", "a little sea turtle jumping along a rope with red and white buoys, like on a number line"],
  ["additions", "les faits d'addition", "a small dark blue-grey chalk slate in a wooden frame"],
  ["calcul", "le calcul rapide", "an orange coral wall made of square tiles, with a small orange fish"],
  ["voiliers", "les voiliers", "a small red sailing boat between two buoys on the sea"],
  ["multiplication", "la multiplication", "an orange tray with equal rows of round orange beads"],
  ["etal", "l'étal du pêcheur (la monnaie)", "a blue banknote and golden coins"],
  ["problemes", "les problèmes", "a little question card above two coloured tiles"],
];
const niveaux = (ex) => (L[ex] ?? []).map((n) => ({ ...n, n: n.n }));

export function relever() {
  const deja = new Set(Object.values(USAGES).map((u) => u.ancien));
  return { commandes: COMMANDES, vagues: VAGUES, niveaux: EXOS.map(([ex, nom, idee]) => ({ ex, nom, idee, liste: niveaux(ex) })), lecons: L.lecons ?? [], remplaces: [...deja] };
}

export function ecrire() {
  const R = relever(), out = [], n = R.commandes.length + R.vagues.length + R.niveaux.reduce((s, x) => s + x.liste.length, 0) + R.lecons.length;
  const bloc = (titre, fichier, o, details, h = "###") => { out.push(`${h} ${titre}`, "", ...details, `- **Fichier à rendre** : \`art/boutons/sources/${fichier}.png\``, "", "```text", prompt(o), "```", ""); };
  out.push("# Les prompts Nano Banana des boutons qui gardent leur dessin", "",
    "Écrit par `node art/boutons/prompts.mjs` (lot « Nouveaux boutons, mascotte du récif et étoiles », décisions du parent du 7 novembre 2026). Un prompt = une image. Chaque prompt est complet : le copier tel quel.", "",
    "**Déjà faits** (les 13 images du 7 novembre, `art/boutons/sources/01.jpg` à `13.jpg`) : les sept exercices de l'écran « choisir », le récif, la boutique, l'album, la maison, choisir, les leçons, jouer (et « continuer »), les quatre zones de l'album, encore.", "",
    "**Méthode** :", "",
    "1. Joindre deux des images déjà faites comme référence du style, toujours les mêmes : `art/boutons/sources/02.jpg` (le récif) et `art/boutons/sources/08.jpg` (jouer).",
    "2. Copier le prompt du bouton, tel quel.",
    "3. Vérifier : un seul bouton, rond, entier, l'anneau gris épais tout autour, le dessin dans le verre, aucun texte ni chiffre, le fond d'une seule couleur, sans ombre.",
    "4. Déposer l'image telle quelle dans `art/boutons/sources/`, sous le nom indiqué. La session du lot qui l'intègre l'ajoute à `art/boutons/boutons.json` et relance `node art/tools/export-boutons.mjs`.", "",
    "**Fond** : vert franc (`#00FF00`) pour tous, comme les 13 images. Un dessin vert dans le verre (la coche, une tortue) ne gêne pas : l'outil ne cherche le vert qu'autour de l'anneau, et coupe le bouton sur son cercle. (Pour une source sur fond magenta, `boutons.json` a la liste `magenta`.)", "",
    "**Les chiffres et les étoiles restent dessinés par l'application**, par-dessus l'image : le chiffre d'une touche du pavé, le numéro d'un niveau et sa petite étoile « validé », les étoiles des crans du sélecteur. Une image générée ne doit donc jamais en contenir (Nano Banana les déforme, et elles changent).", "",
    `**${n} images** en tout, dans l'ordre où les boutons se voient le plus : les commandes (${R.commandes.length}), le sélecteur de difficulté (${R.vagues.length}), les niveaux de l'écran « choisir » (${R.niveaux.reduce((s, x) => s + x.liste.length, 0)}), les leçons (${R.lecons.length}).`, "",
    "**Non relevés** : ce qui n'est pas un bouton (la frise, les compteurs et réserves d'étoiles, les cartes, les créatures, les étiquettes) ; ce qui appartient à une maquette intégrée telle quelle (la lampe de l'étal, les voiliers, le récif vivant) ; la tête de la mascotte du récif (lot « Nouveaux boutons… » : c'est la mascotte elle-même) ; le grand bouton « À toi ! » de la fin d'une leçon (l'image de sa leçon, avec le triangle « jouer » posé par l'application).", "");
  out.push("## Les commandes", "");
  for (const c of R.commandes) bloc(c.nom, c.f, c, [`- **Où** : ${c.ou}. **Aujourd'hui** : le dessin \`${c.sprite}\` de l'atelier.`]);
  out.push("## Le sélecteur de difficulté (les quatre vagues)", "", "Les étoiles de chaque cran restent posées par l'application (aucune en entraînement libre).", "");
  for (const c of R.vagues) bloc(c.nom, c.f, c, ["- **Où** : le sélecteur de difficulté, avant chaque séance. **Aujourd'hui** : les dessins `cran.*` de l'atelier."]);
  out.push("## Les niveaux de l'écran « choisir »", "", "Aujourd'hui, des tuiles carrées dessinées dans l'atelier, avec le numéro et l'exemple écrits. Avec une image, le bouton deviendrait rond comme les autres ; l'application écrirait le numéro du niveau sur une petite plaque (à décider au lot qui les intègre).", "");
  for (const e of R.niveaux) {
    out.push(`### ${e.nom}`, "");
    for (const v of e.liste) bloc(`${e.nom}, niveau ${v.n}`, `niveau-${e.ex}-${String(v.n).padStart(2, "0")}`, { sujet: `${e.idee}, showing the idea of this level: « ${v.travail} » (for example « ${v.exemple} »), drawn as a simple picture, without any written number or sign.` }, [`- **Ce qu'on y travaille** (la légende du parent) : ${v.travail} Exemple : ${v.exemple}.`], "####");
  }
  out.push("## Les leçons (le menu des leçons)", "");
  for (const v of R.lecons) bloc(`la leçon ${v.n}`, `lecon-${v.n}`, { sujet: `a small open picture book, and on its page a simple picture showing the idea of this lesson: « ${v.travail} » (for example « ${v.exemple} »), without any written number or sign.` }, [`- **Ce qu'on y apprend** (la légende du parent) : ${v.travail} Exemple : ${v.exemple}.`]);
  mkdirSync(join(ROOT, "docs/maquettes/boutons"), { recursive: true });
  writeFileSync(join(ROOT, "docs/maquettes/boutons/PROMPTS.md"), `${out.join("\n").replace(/\n+$/, "")}\n`);
  return { n };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(`docs/maquettes/boutons/PROMPTS.md : ${ecrire().n} prompts`);
