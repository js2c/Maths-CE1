// LOT 3 BIS, PARTIE B (docs/SPEC-LOT3BIS.md, B1 à B11) : parcours et captures de l'intégration.
//   node tests/e2e/lot3bis-b.mjs [--out dossier] [--seul choisir,legende,appui,calcul,additions,fins,placer,lecons,parent,cosmetique]
// Parties :
//   choisir   — B1 : les trois écrans de niveaux aux trois formats (numéros, lueur, rien de coupé ni sur la pieuvre)
//   legende   — B2 : la légende ouverte puis fermée par la croix et par un toucher dehors, sans rien lancer
//   appui     — B3 : appui long de 0,8 s sur chaque pictogramme : étiquette, rien de lancé ; toucher bref : lancé
// (les autres parties s'ajoutent au fil de l'étape 4)
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(arg("--out", "tests/e2e/out/lot3bis-b")); mkdirSync(OUT, { recursive: true });
const ONLY = arg("--seul", null)?.split(","), want = (p) => !ONLY || ONLY.includes(p);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
export const open = async (q = "", { prep = null, size = [1280, 800], scale = 2 } = {}) => {
  const context = await browser.newContext({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: scale, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
};
const tap = async (page, sel) => { await page.tap(sel, { force: true }); await page.waitForTimeout(250); };
const shot = (page, name) => page.screenshot({ path: join(OUT, `${name}.png`) });
// les boîtes (px logiques) des éléments d'un sélecteur
const boxes = (page, sel) => page.evaluate((sel) => { const ui = document.querySelector("#ui"), k = ui.getBoundingClientRect().width / 1280, o = ui.getBoundingClientRect(); return [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { key: e.dataset.key, x: (r.left - o.left) / k, y: (r.top - o.top) / k, w: r.width / k, h: r.height / k }; }); }, sel);

// B1 : les écrans de niveaux
if (want("choisir")) {
  for (const size of [[1280, 800], [1920, 1200], [1340, 800]]) {
    // des niveaux validés (l'étoile doit rester dans sa plaque) : calcul 1 à 3 acquis, conseillé 4
    const prep = async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [1, 2, 3], obtenus: [], vus: {}, fenetres: {}, lecons: [] }); };
    const { page, context, errors } = await open("&cran=conseille&sans=echauffement", { size, scale: size[0] > 1500 ? 1 : 2, prep });
    await page.waitForSelector(".choisir"); await tap(page, ".choisir"); await page.waitForSelector(".choix-ex");
    for (const ex of ["ligne", "additions", "calcul", "lecons"]) {
      await tap(page, `.choix-ex[aria-label="${ex}"]`); await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(500);
      const b = await boxes(page, ".choix-tuile");
      const inside = b.every((r) => r.x >= 4 && r.y >= 4 && r.x + r.w <= 1276 && r.y + r.h <= 796);
      // la pieuvre (à gauche) et les algues de droite : aucune plaque avant x = 410 ni après x = 1165
      const clear = b.every((r) => r.x >= 410 && r.x + r.w <= 1165);
      const overlap = b.some((r, i) => b.some((s, j) => j > i && r.x < s.x + s.w && s.x < r.x + r.w && r.y < s.y + s.h && s.y < r.y + r.h));
      check(inside && clear && !overlap, `${size.join("×")} ${ex} : ${b.length} plaques dans l'écran, hors de la pieuvre et des algues, sans chevauchement`);
      await shot(page, `B1-${ex}-${size.join("x")}`);
      if (size[0] === 1280) { const c = b.find((r) => r.key === String(ex === "calcul" ? 3 : 1)) ?? b[0]; await page.screenshot({ path: join(OUT, `B1-${ex}-zoom.png`), clip: { x: c.x - 30, y: c.y - 30, width: 2 * c.w + 60, height: 2 * c.h + 60 } }); }
      await tap(page, ".choix-retour"); await page.waitForSelector(".choix-ex");
    }
    check(!errors.length, `${size.join("×")} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} ÉCHEC(S)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
