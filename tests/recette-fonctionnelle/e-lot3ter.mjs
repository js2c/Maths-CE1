// RECETTE FONCTIONNELLE, PARTIE E (lot 3 ter) : les écrans que le lot change, d'après les captures du parcours
// `node tests/e2e/lot3ter.mjs` (densité 2) et la planche spécimen du pictogramme (`art/out/lot3ter.png`, atelier), réduites en
// JPEG. Écrit E-lot3ter/ et son index. Rien n'est jugé.
//   node tests/e2e/lot3ter.mjs && (cd art && node tools/still.mjs lot3terSheet --frame 0 --out out/lot3ter.png --scale 2) && node tests/recette-fonctionnelle/e-lot3ter.mjs
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "../e2e/navigateur.mjs";
import { indexPartie } from "./commun.mjs";

const ROOT = new URL("../../", import.meta.url).pathname, SRC = join(ROOT, "tests/e2e/out/lot3ter"), OUT = join(ROOT, process.env.RECETTE_OUT ?? "tests/recette-fonctionnelle/out", "E-lot3ter");
mkdirSync(OUT, { recursive: true });
const items = [
  ["t1-1-question.png", "T1 · échauffement : une question, le bouton « passer l'échauffement » (la vague et la flèche) à droite, au-dessus de « je ne sais pas »"],
  ["t1-2-correction-deux-boutons.png", "T1 · une correction : « passer » (la correction, deux triangles) et « passer l'échauffement » en même temps"],
  ["t1-2b-deux-boutons.png", "T1 · les deux boutons de près"],
  ["t1-3-attente-coche.png", "T1 · le bouton touché : la voix a demandé « Tu veux passer l'échauffement ? Touche la coche pour dire oui. » ; le pavé est fermé, la question reste, la coche remplace le bouton"],
  ["t1-4-reprise.png", "T1 · rien touché pendant 5 s : la coche s'en va, le bouton et le pavé reviennent, la consigne est redite"],
  ["t1-5-suite.png", "T1 · la coche touchée : la notion du jour commence (plus de bouton ni de coche)"],
  ["t2-parent-familles.png", "T2 · espace parent, Progression : « ouverte par l'échauffement le 28/09 »"],
  ["../../../../art/out/lot3ter.png", "T1 · atelier, planche spécimen : le pictogramme à la taille de l'écran, à côté de « passer » (inchangé), de la coche et de « je ne sais pas »"],
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }), page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const lignes = [];
for (const [i, [f, what]] of items.entries()) {
  const src = join(SRC, f); if (!existsSync(src)) { console.log(`absent : ${f}`); continue; }
  const name = `E-lot3ter-${String(i + 1).padStart(2, "0")}.jpg`, sheet = f.includes("art/out");
  await page.setViewportSize(sheet ? { width: 900, height: 520 } : f.includes("2b") ? { width: 340, height: 720 } : { width: 1280, height: 800 });
  await page.setContent(`<body style="margin:0"><img style="width:100%;display:block" src="data:image/png;base64,${readFileSync(src).toString("base64")}">`);
  await page.screenshot({ path: join(OUT, name), type: "jpeg", quality: 80, fullPage: true });
  lignes.push([name, what]);
}
await browser.close();
indexPartie(OUT, "Partie E · lot 3 ter : les écrans que le lot change", lignes, "Captures du parcours `tests/e2e/lot3ter.mjs` (1280 × 800, densité 2, vrai toucher, voix accélérée), réduites en JPEG ; l'étiquette de l'appui long sur chaque bouton est en partie C (`C-toucher/C7-appui-long.md`).");
console.log(`écrit : ${OUT} (${lignes.length} captures)`);
