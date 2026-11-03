// LES PHRASES À FABRIQUER (lot « Problèmes ») : celles de l'inventaire (tools/voix/inventaire.mjs) qui n'ont pas encore de fichier son
// dans app/assets/voix/ (index.json), avec leur origine dans le contenu, leur nombre et leur poids estimé (la droite « octets en
// fonction du nombre de lettres du texte lu », ajustée sur les fichiers déjà fabriqués, comme art/problemes/phrases.mjs) ; le poids
// du dossier de la voix après leur fabrication, comparé au plafond (95 Mo, tests/unit/voix.test.mjs).
//   node tools/voix/a-fabriquer.mjs [--md fichier.md]
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { inventaire } from "./inventaire.mjs";
import { lire, VOIX } from "./fabriquer.mjs";

const index = JSON.parse(readFileSync(join(VOIX, "index.json"), "utf8")).phrases;
const pts = Object.entries(index).map(([k, [f]]) => [lire(k).length, statSync(join(VOIX, f)).size]);
const n = pts.length, sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0), sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
const b = (n * sxy - sx * sy) / (n * sxx - sx * sx), a = (sy - b * sx) / n, parIndex = statSync(join(VOIX, "index.json")).size / n;
const dossier = readdirSync(VOIX).reduce((s, f) => s + statSync(join(VOIX, f)).size, 0);
const manque = [...inventaire()].filter(([t]) => !index[t]);
const groupe = (o) => (o.startsWith("problemes.") ? "problèmes : énoncés, questions, corrections" : o.startsWith("lecons.L19") ? "la leçon L19" : o.startsWith("erreurCalc") || o.startsWith("calc") ? "calcul rapide : niveau 7 (lot « Correctifs de la confrontation 2 »)" : /^(choix|notionProblemes|problemeDuJour|probleme|erreurProbleme|_problemes)/.test(o) ? "problèmes : noms, niveaux, consignes, aides, erreurs" : `autres (${o.split(".")[0]})`);
const G = new Map(); for (const [t, o] of manque) { const g = groupe(o); (G.get(g) ?? G.set(g, []).get(g)).push(t); }
const Mo = (x) => `${(x / 1e6).toFixed(2).replace(".", ",")} Mo`, poids = (L) => L.reduce((s, t) => s + a + b * lire(t).length + parIndex, 0);
const total = poids(manque.map(([t]) => t));
const L = ["# Les phrases à fabriquer", "", `\`node tools/voix/a-fabriquer.mjs --md\` : ${manque.length} phrases de l'inventaire n'ont pas encore de fichier son, environ **${Mo(total)}** (estimation : ${a.toFixed(0)} octets + ${b.toFixed(0)} par lettre du texte lu, plus l'index). Le dossier de la voix pèse ${Mo(dossier)} ; après leur fabrication, environ **${Mo(dossier + total)}**, sous le plafond de 95 Mo (marge : ${Mo(95e6 - dossier - total)}).`, "",
  "| Partie | Phrases | Poids estimé |", "| --- | --- | --- |", ...[...G].map(([g, l]) => `| ${g} | ${l.length} | ${Mo(poids(l))} |`), ""];
for (const [g, l] of G) { L.push(`## ${g} (${l.length})`, ""); for (const t of l) L.push(`- ${t}`); L.push(""); }
console.log(L.slice(0, 12).join("\n"));
const md = process.argv.includes("--md") ? process.argv[process.argv.indexOf("--md") + 1] : null;
if (md) writeFileSync(md, L.join("\n"));
