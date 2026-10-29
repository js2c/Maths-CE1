// CONTRÔLE DE LA BANQUE DES PROBLÈMES (maquette de l'exercice « Problèmes », docs/maquettes/problemes/PROPOSITION.md).
// Recalcule chaque énoncé de art/problemes/enonces.json à partir de sa structure et de ses données : la réponse, le calcul
// écrit, l'aide (barres, comparaison, groupes, étapes), la difficulté (règle ci-dessous) ; vérifie que les nombres des
// données sont dits dans l'énoncé, que chaque phrase finit par sa ponctuation, que le contexte d'illustration et l'objet
// dessiné existent ; puis dit la répartition (structure × difficulté) et la variété des réponses.
//   node art/problemes/verifier.mjs          le contrôle (sort en échec au premier défaut trouvé, avec la liste)
//   node art/problemes/verifier.mjs --md     écrit aussi docs/maquettes/problemes/ENONCES.md (la banque à relire)
//
// LA DIFFICULTÉ (1 à 4) :
//  - problèmes additifs (réunion, transformation, comparaison, deux étapes) : selon les nombres du calcul (données,
//    résultats intermédiaires, réponse) : 1, tous jusqu'à 10 ; 2, jusqu'à 20 ; 3, au-delà de 20 sans passage de la dizaine
//    (ni retenue ni « emprunt ») ; 4, au-delà de 20 avec passage de la dizaine ;
//  - groupes égaux : 1, au plus 4 groupes d'au plus 5 objets ; 2, au plus 30 objets ; 3, plus de 30 objets ;
//  - partage : 1, au plus 12 objets ; 2, au plus 30 ; 3, plus de 30.
// La structure ajoute sa propre difficulté (l'ordre proposé des structures est dans le README) : elle n'entre pas dans ce
// nombre, qui ne mesure que le calcul.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url)), RACINE = join(ICI, "../..");
const banque = JSON.parse(readFileSync(join(ICI, "enonces.json"), "utf8")).enonces;
const contextes = JSON.parse(readFileSync(join(ICI, "contextes.json"), "utf8")).contextes;
export const OBJETS = ["bille", "biscuit", "pomme", "oeuf", "crayon", "ballon", "bonbon", "fleur", "perle", "livre", "personne", "jeton"];
export const CONTENANTS = ["sachet", "assiette", "boite", "panier", "vase"];
const defauts = [], defaut = (e, m) => defauts.push(`${e.id} : ${m}`);
const op = (o, x, y) => (o === "+" ? x + y : o === "−" ? x - y : x * y);

// les étapes du calcul [opération, x, y, résultat], recalculées depuis la structure et les données
export function etapes(e) {
  const [x, y] = e.donnees ?? [];
  const S = { reunion: { tout: [["+", x, y]], partie: [["−", x, y]] },
    comparaison: { ecart: [["−", Math.max(x, y), Math.min(x, y)]], grand: [["+", x, y]], petit: [["−", x, y]] } };
  let L;
  if (e.structure === "transformation") {
    L = { "gain/fin": [["+", x, y]], "perte/fin": [["−", x, y]], "gain/changement": [["−", y, x]], "perte/changement": [["−", x, y]], "gain/debut": [["−", y, x]], "perte/debut": [["+", y, x]] }[`${e.sens}/${e.inconnue}`];
  } else if (e.structure === "groupes-egaux") L = [["×", x, y]];
  else if (e.structure === "partage") L = [["÷", x, y]];
  else if (e.structure === "deux-etapes") { let p = null; return e.operations.map(([o, a, b]) => { const A = a === "_" ? p : a, B = b === "_" ? p : b; p = op(o, A, B); return [o, A, B, p]; }); }
  else L = S[e.structure]?.[e.inconnue];
  if (!L) return null;
  return L.map(([o, a, b]) => [o, a, b, o === "÷" ? a / b : op(o, a, b)]);
}
const passe = ([o, a, b]) => (o === "+" ? (a % 10) + (b % 10) >= 10 : o === "−" ? a % 10 < b % 10 : false);
export function difficulte(e, E) {
  const nombres = E.flatMap(([, a, b, r]) => [a, b, r]), M = Math.max(...nombres);
  if (e.structure === "groupes-egaux") { const [n, t] = e.donnees; return n <= 4 && t <= 5 && M <= 15 ? 1 : M <= 30 ? 2 : 3; }
  if (e.structure === "partage") return M <= 12 ? 1 : M <= 30 ? 2 : 3;
  return M <= 10 ? 1 : M <= 20 ? 2 : E.some(passe) ? 4 : 3;
}

const ids = new Set();
for (const e of banque) {
  if (ids.has(e.id)) defaut(e, "identifiant en double"); ids.add(e.id);
  const E = etapes(e);
  if (!E) { defaut(e, `structure inconnue ${e.structure}/${e.inconnue}`); continue; }
  const r = E.at(-1)[3];
  if (r !== e.reponse) defaut(e, `réponse ${e.reponse}, le calcul donne ${r}`);
  if (!Number.isInteger(r) || r <= 0 || E.some(([, a, b, v]) => !Number.isInteger(v) || v < 0 || a <= 0 || b <= 0)) defaut(e, "un nombre qui n'est pas entier, nul ou négatif");
  if (E.some(([, a, b, v]) => Math.max(a, b, v) > 100)) defaut(e, "un nombre au-delà de 100");
  const d = difficulte(e, E);
  if (d !== e.difficulte) defaut(e, `difficulté ${e.difficulte}, la règle donne ${d}`);
  // le calcul écrit contient la réponse et chaque donnée
  const nb = (s) => (s.match(/\d+/g) ?? []).map(Number);
  for (const n of (e.donnees ?? E.flatMap(([, a, b]) => [a, b]).filter((n, i, t) => i === 0 || !E.some(([, , , v]) => v === n)))) if (!nb(e.calcul).includes(n)) defaut(e, `le calcul « ${e.calcul} » n'a pas ${n}`);
  if (!nb(e.calcul).includes(r)) defaut(e, `le calcul « ${e.calcul} » n'a pas la réponse`);
  // les données sont dites (en chiffres dans le texte, la voix les dit en lettres) ; la réponse n'est pas dans l'énoncé
  const dits = nb([...e.enonce, e.question].join(" "));
  const donnees = e.structure === "deux-etapes" ? e.operations.flatMap(([, a, b]) => [a, b]).filter((n) => n !== "_") : e.donnees;
  for (const n of donnees) if (!dits.includes(n) && !(e.structure === "partage" && e.inconnue === "part" && n === 2 && /entre toi et/.test(e.enonce.join(" ")))) defaut(e, `la donnée ${n} n'est pas dite`);
  if (dits.includes(r) && !donnees.includes(r)) defaut(e, `la réponse ${r} est dite dans l'énoncé`);
  if (!nb(e.correction).includes(r)) defaut(e, "la correction ne dit pas la réponse");
  // la ponctuation, ce que la voix découpe en phrases
  for (const s of e.enonce) if (!/[.!?]$/.test(s)) defaut(e, `phrase sans point : ${s}`);
  if (!/ \?$/.test(e.question)) defaut(e, "la question ne finit pas par « ? »");
  if (/\b1\b/.test([...e.enonce, e.question].join(" "))) defaut(e, "le nombre 1 (un ou une : à écrire en lettres)");
  // l'illustration et les dessins
  if (!contextes.some((c) => c.id === e.contexte)) defaut(e, `contexte inconnu ${e.contexte}`);
  if (!OBJETS.includes(e.objet)) defaut(e, `objet inconnu ${e.objet}`);
  if (e.contenant && !CONTENANTS.includes(e.contenant)) defaut(e, `contenant inconnu ${e.contenant}`);
  // l'aide
  const b = e.barres;
  if (b && b.parties[0] + b.parties[1] !== b.tout) defaut(e, "les barres : les parties ne font pas le tout");
  if (b && (b.inconnue === "tout" ? b.tout : b.parties[b.inconnue]) !== r) defaut(e, "les barres : l'inconnue n'est pas la réponse");
  const c = e.comparaison;
  if (c && (c.petit + c.ecart !== c.grand || c[c.inconnue] !== r)) defaut(e, "la comparaison");
  const g = e.groupes;
  if (g && (g.inconnue === "tout" ? g.nombre * g.taille : g[g.inconnue]) !== r) defaut(e, "les groupes");
  if (["reunion", "transformation"].includes(e.structure) && !b) defaut(e, "pas de barres");
  if (e.structure === "comparaison" && !c) defaut(e, "pas de comparaison");
  if (["groupes-egaux", "partage"].includes(e.structure) && !g) defaut(e, "pas de groupes");
  if (e.structure === "deux-etapes" && (e.operations.length !== 2 || e.etapes?.length !== 2)) defaut(e, "deux étapes, pas plus");
}

// la répartition et la variété des réponses
const STRUCT = ["reunion", "transformation", "comparaison", "groupes-egaux", "partage", "deux-etapes"];
const cle = (e) => (e.structure === "transformation" ? `transformation · ${e.sens} · ${e.inconnue}` : e.structure === "groupes-egaux" || e.structure === "deux-etapes" ? e.structure : `${e.structure} · ${e.inconnue}`);
const lignes = [...new Set(banque.map(cle))];
const tableau = ["| Structure | 1 | 2 | 3 | 4 | Total | Réponses différentes |", "| --- | --- | --- | --- | --- | --- | --- |"];
for (const l of lignes) {
  const L = banque.filter((e) => cle(e) === l);
  tableau.push(`| ${l} | ${[1, 2, 3, 4].map((d) => L.filter((e) => e.difficulte === d).length || "·").join(" | ")} | ${L.length} | ${new Set(L.map((e) => e.reponse)).size} |`);
}
const tot = (d) => banque.filter((e) => e.difficulte === d).length;
tableau.push(`| **Total** | ${[1, 2, 3, 4].map(tot).join(" | ")} | **${banque.length}** | ${new Set(banque.map((e) => e.reponse)).size} |`);
console.log(tableau.join("\n"));
for (const s of STRUCT) if (!banque.some((e) => e.structure === s)) defauts.push(`aucun énoncé de structure ${s}`);
if (banque.length < 150 || banque.length > 200) defauts.push(`${banque.length} énoncés : la banque en demande 150 à 200`);

if (process.argv.includes("--md")) {
  const titres = { reunion: "Réunion (deux parties et le tout)", transformation: "Transformation (un état, un changement, un nouvel état)", comparaison: "Comparaison (de plus, de moins)", "groupes-egaux": "Groupes égaux (sans le signe ×)", partage: "Partage (la valeur d'une part, le nombre de parts)", "deux-etapes": "Deux étapes" };
  const md = ["# La banque des problèmes, à relire", "", `${banque.length} énoncés (source : \`art/problemes/enonces.json\`, contrôlée par \`node art/problemes/verifier.mjs\` ; ce fichier en est tiré par \`--md\`). Pour chaque énoncé : ce que dit la voix (l'énoncé, puis la question), la réponse et le calcul, puis la correction dite après une erreur. La difficulté (1 à 4) ne mesure que le calcul (règle : \`art/problemes/README.md\`).`, "", tableau.join("\n"), ""];
  for (const s of STRUCT) {
    md.push(`## ${titres[s]}`, "");
    for (const e of banque.filter((x) => x.structure === s)) md.push(`- **${e.id}** · ${e.difficulte} · ${e.contexte}${e.structure === "transformation" ? ` · ${e.sens}, ${e.inconnue} inconnu` : e.inconnue && !["groupes-egaux", "deux-etapes"].includes(s) ? ` · ${e.inconnue}` : ""} — ${e.enonce.join(" ")} *${e.question}* → **${e.reponse}** (${e.calcul})  \n  Correction : « ${e.correction} »`);
    md.push("");
  }
  writeFileSync(join(RACINE, "docs/maquettes/problemes/ENONCES.md"), md.join("\n"));
  console.log("écrit : docs/maquettes/problemes/ENONCES.md");
}
if (defauts.length) { console.error(`\n${defauts.length} défaut(s) :\n${defauts.join("\n")}`); process.exit(1); }
console.log(`\nbanque conforme : ${banque.length} énoncés`);
