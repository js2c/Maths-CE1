// LES PHRASES DE L'EXERCICE « PROBLÈMES » ET LEUR POIDS (maquette, docs/maquettes/problemes/PROPOSITION.md, question « La
// voix »). Une phrase = un fichier son (docs/VOIX.md) ; une phrase déjà fabriquée (inventaire de tools/voix/inventaire.mjs)
// ne coûte rien. Le poids d'une phrase nouvelle est estimé d'après les fichiers déjà fabriqués : une droite (octets en
// fonction du nombre de lettres de son texte pour la voix) ajustée sur les 11 000 fichiers d'app/assets/voix/.
//   node art/problemes/phrases.mjs          le bilan
//   node art/problemes/phrases.mjs --md     écrit aussi docs/maquettes/problemes/PHRASES.md (le bilan et la liste)
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sentences } from "../../app/js/engine/phrases.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";
import { lire, VOIX } from "../../tools/voix/fabriquer.mjs";

const ICI = dirname(fileURLToPath(import.meta.url)), RACINE = join(ICI, "../..");
const banque = JSON.parse(readFileSync(join(ICI, "enonces.json"), "utf8")).enonces;
// tout le dossier de la voix (sons, index, crédits) : 85 Mo aujourd'hui (tests/unit/voix.test.mjs) ; 95 Mo décidés par le parent le
// 30 octobre 2026 pour le lot « Problèmes », tant que la voix reste Chatterbox (docs/JOURNAL-CONCEPTION.md)
const PLAFOND_AUJOURDHUI = 85e6, PLAFOND = 95e6;

// LES PHRASES COMMUNES À TOUS LES ÉNONCÉS (proposition : la consigne, les aides, les erreurs repérées ; PROPOSITION.md)
export const COMMUNES = {
  "le nom et l'entrée": ["Les problèmes.", "Écoute bien l'histoire.", "Écoute l'histoire, puis tape ta réponse.", "Touche-moi pour réécouter l'histoire."],
  "les objets à grouper": ["Fais des groupes avec les objets.", "Glisse les objets dans les cercles.", "Mets-en autant dans chaque cercle.", "Mets-en autant dans chaque sachet.", "Mets-en autant dans chaque assiette.", "Mets-en autant dans chaque boîte.", "Mets-en autant dans chaque panier.", "Mets-en autant dans chaque vase.", "Chaque groupe en a autant.", "Compte les groupes.", "Compte les objets d'un groupe.", "Compte tous les objets."],
  "le schéma en barres": ["Regarde le schéma.", "La grande barre, c'est le tout.", "Les petites barres, ce sont les parties.", "On connaît les deux parties : on les ajoute.", "On connaît le tout et une partie : on enlève la partie.", "La barre du haut, c'est le plus grand.", "Le bout qui dépasse, c'est l'écart.", "On cherche le point d'interrogation."],
  "les deux étapes": ["D'abord, la première partie de l'histoire.", "Puis, la suite de l'histoire."],
  "les erreurs repérées": ["Tu as redit un nombre de l'histoire. Il faut calculer.", "Attention : « de plus » ne veut pas dire qu'il faut ajouter.", "Le bon calcul, mais une petite erreur de compte.", "C'est la réponse de la première étape. Il en reste une."],
};

// la droite octets = a + b × lettres, ajustée sur les fichiers déjà fabriqués (et la durée de la même façon)
const index = JSON.parse(readFileSync(join(VOIX, "index.json"), "utf8")).phrases;
const pts = Object.entries(index).map(([k, [f, ms]]) => [lire(k).length, statSync(join(VOIX, f)).size, ms]);
const ajuste = (j) => { const n = pts.length, sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[j], 0), sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[j], 0); const b = (n * sxy - sx * sy) / (n * sxx - sx * sx); return [(sy - b * sx) / n, b]; };
const [oA, oB] = ajuste(1), [mA, mB] = ajuste(2);
const octets = (s) => oA + oB * lire(s).length, ms = (s) => mA + mB * lire(s).length;
// contrôle de la droite : l'estimation des fichiers existants contre leur poids réel
const reel = pts.reduce((s, p) => s + p[1], 0), estime = pts.reduce((s, p) => s + oA + oB * p[0], 0);
const indexParPhrase = statSync(join(VOIX, "index.json")).size / Object.keys(index).length;

const deja = inventaire(), dossier = readdirSync(VOIX).reduce((s, f) => s + statSync(join(VOIX, f)).size, 0), place = PLAFOND - dossier;

// les phrases de chaque partie, sans doublon, sans celles qui existent déjà
const parties = {
  "énoncés": banque.flatMap((e) => e.enonce),
  "questions": banque.map((e) => e.question),
  "corrections dans l'histoire (« 17 ballons, et 8 de plus, ça fait 25 ballons. »)": banque.flatMap((e) => sentences(e.correction)),
  ...Object.fromEntries(Object.entries(COMMUNES).map(([k, v]) => [`communes : ${k}`, v])),
};
// la correction sans l'histoire, qui reprend les phrases de calcul existantes quand elles existent (« 17 plus 8, ça fait 25. »)
const parSigne = (e) => {
  if (e.structure === "groupes-egaux") return [`${e.donnees[0]} fois ${e.donnees[1]}, ça fait ${e.reponse}.`];
  if (e.structure === "partage") return [e.inconnue === "part" ? `${e.donnees[0]} partagé en ${e.donnees[1]}, ça fait ${e.reponse} chacun.` : `Dans ${e.donnees[0]}, il y a ${e.reponse} fois ${e.donnees[1]}.`];
  const m = e.calcul.split(" ; ").map((c) => c.match(/^(\d+) ([+−×]) (\d+) = (\d+)/).slice(1));
  return m.map(([a, o, b, n]) => `${a} ${o === "+" ? "plus" : o === "−" ? "moins" : "fois"} ${b}, ça fait ${n}.`);
};
const variante = { "corrections par le calcul seul (« 17 plus 8, ça fait 25. »)": banque.flatMap(parSigne) };

const bilanDe = (liste) => { const nouv = [...new Set(liste)].filter((s) => !deja.has(s)); return { total: new Set(liste).size, nouv, o: nouv.reduce((s, x) => s + octets(x), 0), ms: nouv.reduce((s, x) => s + ms(x), 0) }; };
const vues = new Set(), lignes = [];
let totalN = 0, totalO = 0, totalMs = 0;
for (const [nom, liste] of Object.entries(parties)) {
  const b = bilanDe(liste.filter((s) => !vues.has(s))); liste.forEach((s) => vues.add(s));
  totalN += b.nouv.length; totalO += b.o; totalMs += b.ms; lignes.push([nom, b]);
}
const totalIdx = totalN * indexParPhrase;
const ecart = (d) => `${Mo(Math.abs(d))} ${d > 0 ? "de plus que" : "de moins que"}`;
const Mo = (o) => `${(o / 1e6).toFixed(2).replace(".", ",")} Mo`, min = (t) => `${Math.round(t / 60000)} min`;
const tableau = ["| Partie | Phrases | Nouvelles | Poids estimé | Durée |", "| --- | --- | --- | --- | --- |"];
for (const [nom, b] of lignes) tableau.push(`| ${nom} | ${b.total} | ${b.nouv.length} | ${Mo(b.o)} | ${min(b.ms)} |`);
tableau.push(`| **Total, corrections dans l'histoire** | | **${totalN}** | **${Mo(totalO + totalIdx)}** (index compris) | ${min(totalMs)} |`);
const [vn, vb] = Object.entries(variante)[0], vB = bilanDe(vb), corrH = lignes.find(([n]) => n.startsWith("corrections"))[1];
const totalB = totalN - corrH.nouv.length + vB.nouv.length, poidsB = totalO - corrH.o + vB.o + totalB * indexParPhrase;
const sansCorr = totalO - corrH.o + (totalN - corrH.nouv.length) * indexParPhrase;
const resume = [
  `- **Voix aujourd'hui** : ${Object.keys(index).length} phrases, dossier de ${Mo(dossier)} (sons, index et crédits). Plafond **95 Mo** (décision du parent du 30 octobre 2026, au lieu de 85 Mo dans \`tests/unit/voix.test.mjs\` : il en restait ${Mo(PLAFOND_AUJOURDHUI - dossier)}) : **il reste ${Mo(place)}**.`,
  `- **Après le lot** (corrections dans l'histoire, la décision du parent) : dossier d'environ ${Mo(dossier + totalO + totalIdx)}, **${Mo(place - totalO - totalIdx)} de marge** sous 95 Mo.`,
  `- **Estimation** : ${oA.toFixed(0)} octets + ${oB.toFixed(0)} octets par lettre du texte lu (droite ajustée sur les fichiers existants : elle redonne ${Mo(estime)} pour ${Mo(reel)} réels) ; ${(indexParPhrase).toFixed(0)} octets d'index par phrase ; durée ${(mA / 1000).toFixed(2).replace(".", ",")} s + ${(mB).toFixed(0)} ms par lettre.`,
  `- **Avec les corrections dans l'histoire** : **${totalN} phrases nouvelles, environ ${Mo(totalO + totalIdx)}**, soit ${ecart(totalO + totalIdx - place)} la place qui reste.`,
  `- **Avec les corrections par le calcul seul** (« 17 plus 8, ça fait 25. ») : ${vB.total} phrases de calcul dont ${vB.nouv.length} nouvelles (${vB.total - vB.nouv.length} existent déjà) : **${totalB} phrases nouvelles, environ ${Mo(poidsB)}**, soit ${ecart(poidsB - place)} la place qui reste.`,
  `- **Sans aucune correction propre** (la correction ne dit que la réponse, déjà dans l'inventaire : « C'était 25. ») : ${totalN - corrH.nouv.length} phrases, environ ${Mo(sansCorr)}.`,
];
console.log(tableau.join("\n")); console.log(`\n${resume.join("\n")}`);

if (process.argv.includes("--md")) {
  const md = ["# Les phrases de l'exercice « Problèmes » et leur poids", "", "Tiré de `art/problemes/enonces.json` et des phrases communes proposées (`art/problemes/phrases.mjs`, `COMMUNES`) par `node art/problemes/phrases.mjs --md`, comparé à l'inventaire de la voix de `main` (`tools/voix/inventaire.mjs`). Une phrase déjà fabriquée ne coûte rien ; une phrase qui revient dans plusieurs énoncés n'est comptée qu'une fois.", "", resume.join("\n"), "", tableau.join("\n"), ""];
  for (const [nom, b] of lignes) { md.push(`## ${nom} (${b.nouv.length})`, ""); for (const s of b.nouv) md.push(`- ${s}`); md.push(""); }
  md.push(`## ${vn} : les nouvelles (${vB.nouv.length})`, "", ...vB.nouv.map((s) => `- ${s}`), "");
  writeFileSync(join(RACINE, "docs/maquettes/problemes/PHRASES.md"), md.join("\n"));
  console.log("\nécrit : docs/maquettes/problemes/PHRASES.md");
}
