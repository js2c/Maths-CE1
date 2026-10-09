// RECETTE FONCTIONNELLE, PARTIE C (lot 3 ter, docs/SPEC-LOT3TER.md, T3) : l'appui long sur chaque bouton recensé.
// Reprend le relevé du parcours `node tests/e2e/lot3ter.mjs --seul appui` (vrai toucher, densité 2 : appui de 0,8 s, puis
// toucher bref) : `tests/e2e/out/lot3ter/appui.json` et ses captures (l'étiquette visible pendant l'appui). Écrit
// C-toucher/C7-appui-long.md (une ligne par bouton) et les captures en JPEG réduit (C7-appui-long-*.jpg). Rien n'est jugé.
//   node tests/e2e/lot3ter.mjs --seul appui && node tests/recette-fonctionnelle/c-appui-long.mjs
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "../e2e/navigateur.mjs";

const ROOT = new URL("../../", import.meta.url).pathname, SRC = join(ROOT, "tests/e2e/out/lot3ter"), OUT = join(ROOT, process.env.RECETTE_OUT ?? "tests/recette-fonctionnelle/out", "C-toucher");
if (!existsSync(join(SRC, "appui.json"))) throw new Error("lancer d'abord : node tests/e2e/lot3ter.mjs --seul appui");
mkdirSync(OUT, { recursive: true });
const rows = JSON.parse(readFileSync(join(SRC, "appui.json"), "utf8"));
const shots = readdirSync(SRC).filter((f) => f.startsWith("t3-") && f.endsWith(".png")).sort();
// les captures, réduites de moitié en JPEG (qualité 80) : Chromium les redessine
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }), page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const done = [];
for (const [i, f] of shots.entries()) {
  const name = `C7-appui-long-${String(i + 1).padStart(2, "0")}.jpg`;
  await page.setContent(`<body style="margin:0"><img style="width:1280px;height:800px;display:block" src="data:image/png;base64,${readFileSync(join(SRC, f)).toString("base64")}">`);
  await page.screenshot({ path: join(OUT, name), type: "jpeg", quality: 80 });
  done.push([name, f.replace(/^t3-|\.png$/g, "").replace(/-/g, " ")]);
}
await browser.close();
const out = [
  "# Partie C · l'appui long sur chaque bouton recensé (lot 3 ter)", "",
  "Relevé du parcours `node tests/e2e/lot3ter.mjs --seul appui` (Chromium, 1280 × 800, densité 2, vrai toucher par `Input.dispatchTouchEvent`). Pour chaque bouton : un appui tenu 0,8 s (l'étiquette est-elle visible et dans l'écran ? quelque chose est-il lancé ?), le doigt levé (quelque chose est-il lancé ? l'étiquette a-t-elle disparu 0,5 s après ?), puis, pour les boutons marqués, un toucher bref de 0,08 s (l'action est-elle lancée ?). « Rien de lancé » : l'état de l'écran (étape, pause, écrans ouverts, bouton choisi, phrases dites, pavé) est le même avant, pendant et après. Les touches du pavé et les bulles-réponses répondent au premier contact (exception de la spécification). Rien n'est jugé.", "",
  `${rows.length} boutons ; étiquette visible : ${rows.filter((r) => r.label === "visible").length} ; lancés par un appui long : ${rows.filter((r) => r.rien === "LANCÉ").length} ; étiquette encore là 0,5 s après le lever : ${rows.filter((r) => !r.disparue).length}.`, "",
  "| écran | bouton | étiquette pendant l'appui | dans l'écran | appui long, puis doigt levé | disparue 0,5 s après | toucher bref |", "| --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map((r) => `| ${r.where} | ${r.name} | ${r.label} | ${r.dans == null ? "—" : r.dans ? "oui" : "NON"} | ${r.rien} | ${r.disparue ? "oui" : "NON"} | ${r.bref ?? "—"} |`), "",
  "## Captures (l'étiquette pendant l'appui)", "", ...done.map(([f, what]) => `- \`${f}\` : ${what}`), "",
];
writeFileSync(join(OUT, "C7-appui-long.md"), out.join("\n"));
// les lignes de l'index de la partie C (écrit par c-toucher.mjs)
const ix = join(OUT, "_index.json");
if (existsSync(ix)) { const j = JSON.parse(readFileSync(ix, "utf8")); j.lignes = [...j.lignes.filter((l) => !l[0].startsWith("C7-")), ["C7-appui-long.md", `(lot 3 ter) l'appui long de 0,8 s sur chacun des ${rows.length} boutons recensés, puis le toucher bref : une ligne par bouton`], ...done.map(([f, what]) => [f, `(lot 3 ter) l'étiquette pendant l'appui long : ${what}`])]; writeFileSync(ix, JSON.stringify(j, null, 1)); }
console.log(`écrit : ${join(OUT, "C7-appui-long.md")} (${rows.length} boutons, ${done.length} captures)`);
