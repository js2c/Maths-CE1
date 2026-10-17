// LES POISSONS DU FOND NE SONT JAMAIS COUPÉS (lot « Correctifs de l'installation et de la veille », point 3 ; docs/LOTS.md,
// fiche 12, capture 02 du parent : un poisson du lagon coupé net, à l'horizontale). Chaque poisson du lagon (engine/lagon.js)
// est dessiné dans le petit canvas de son acteur (engine/actor.js), son inclinaison et l'ondulation de son corps comprises.
// Ce parcours dessine chaque poisson de la planche, à chaque inclinaison extrême (et à plat), dans les deux sens, à plusieurs
// moments de son ondulation, à chaque profondeur (sa taille), à plusieurs densités d'écran (1, 1,5, 2, 2,25 ; la tablette est
// à 1,5 ou 2) et vérifie qu'aucun pixel opaque ne touche le bord du canvas (le dessin y serait coupé). Il vérifie aussi, sur le
// lagon vivant, les canvas des poissons à l'écran pendant 20 secondes.
//   node tests/e2e/poissons.mjs
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { serve } from "../serve.mjs";

mkdirSync("tests/e2e/out/poissons", { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };

for (const [w, h, dpr] of [[1280, 800, 1], [1280, 800, 1.5], [1280, 800, 2], [1138, 711, 2.25], [1920, 1200, 1]]) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url + "?nosw&voix=rapide&son=non&sansReprise"); await page.waitForFunction(() => window.__ready !== undefined);
  const r = await page.evaluate(() => {
    const L = window.__app.lagon, keys = Object.keys(window.__app.atlas.sprites).filter((n) => n.startsWith("lagon.poisson.")).map((n) => n.slice(14));
    const bords = (c) => { const x = c.getContext("2d"), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H).data, a = (i, j) => d[(j * W + i) * 4 + 3]; let n = 0;
      for (let i = 0; i < W; i++) { if (a(i, 0) > 8) n++; if (a(i, H - 1) > 8) n++; } for (let j = 0; j < H; j++) { if (a(0, j) > 8) n++; if (a(W - 1, j) > 8) n++; } return n; };
    const out = [], marges = []; let essais = 0;
    for (const key of keys) for (const x of [500, 5600, 6500]) for (const tilt of [-0.22, 0, 0.22]) for (const dir of [-1, 1]) for (const ph of [0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6]) {
      const len = (L.SOLOS.find(([k]) => k === key)?.[1] ?? L.SCHOOLS.find((s) => s.keys.includes(key))?.len ?? 120) * 1.1;
      const m = { key, len, x, y: 500, tilt, ph };
      m.a = L.fishActor(m); L.paintFish(m, dir, `essai-${essais++}`);
      const n = bords(m.a.c); if (n) out.push({ key, x, tilt, dir, ph, pixels: n, canvas: [m.a.c.width, m.a.c.height] });
      // la marge libre : la plus petite distance entre le dessin et le bord
      m.a.remove();
    }
    return { keys: keys.length, essais, coupes: out };
  });
  check(r.coupes.length === 0, `${w}×${h} densité ${dpr} : ${r.keys} poissons, ${r.essais} dessins (inclinaisons, sens, ondulation, profondeurs) ; aucun ne touche le bord de son canvas${r.coupes.length ? ` — ${r.coupes.length} coupés, par exemple ${JSON.stringify(r.coupes.slice(0, 3))}` : ""}`);
  // le lagon vivant : 20 secondes à chaque niveau d'allègement (tenu fixe), les canvas des poissons à l'écran relevés toutes les 0,5 s
  for (const niveau of [0, 1, 2]) {
  const vivant = await page.evaluate(async (niveau) => {
    const s = window.__app.stage; s.perf.level = niveau; s.measure = () => {};
    const L = window.__app.lagon, coupes = []; let vus = 0;
    const bords = (c) => { const x = c.getContext("2d"), W = c.width, H = c.height; if (!W || !H) return 0; const d = x.getImageData(0, 0, W, H).data, a = (i, j) => d[(j * W + i) * 4 + 3]; let n = 0;
      for (let i = 0; i < W; i++) { if (a(i, 0) > 8) n++; if (a(i, H - 1) > 8) n++; } for (let j = 0; j < H; j++) { if (a(0, j) > 8) n++; if (a(W - 1, j) > 8) n++; } return n; };
    for (let k = 0; k < 40; k++) {
      await new Promise((r) => setTimeout(r, 500));
      for (const g of L.groups) for (const m of g.members) if (m.a) { vus++; const n = bords(m.a.c); if (n) coupes.push({ key: m.key, tilt: +m.tilt.toFixed(3), pixels: n }); }
    }
    return { vus, coupes };
  }, niveau);
  check(vivant.vus > 0 && vivant.coupes.length === 0, `${w}×${h} densité ${dpr}, allègement ${niveau} : le lagon vivant, ${vivant.vus} poissons relevés en 20 s, aucun coupé${vivant.coupes.length ? ` — ${JSON.stringify(vivant.coupes.slice(0, 3))}` : ""}`);
  }
  if (dpr === 2) await page.screenshot({ path: "tests/e2e/out/poissons/lagon-1280-d2.png" });
  check(!errors.length, `${w}×${h} densité ${dpr} : aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
