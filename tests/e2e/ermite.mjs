// LOT 2, ÉTAPE 5 : le bernard-l'ermite et les aides visuelles du module 2 dans l'application (Chromium,
// 1280 × 800, densité 2) : ses gestes (repos, sortir, montrer, se réjouir, changer de coquille), le cadre de
// 10, la maison des nombres, le double + 1. Captures dans tests/e2e/out/ermite ; échoue sur une erreur de page.
//   node tests/e2e/ermite.mjs
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const OUT = resolve("tests/e2e/out/ermite"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const shot = (n) => page.screenshot({ path: join(OUT, `${n}.png`) });
await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
await page.evaluate(async () => {
  const app = window.__app; document.querySelectorAll("#ui > *").forEach((e) => (e.style.visibility = "hidden"));
  await Promise.all([app.sprites.load("ermite"), app.sprites.load("aides")]);
  const { Hermit } = await import("./js/engine/hermit.js"), A = await import("./js/modules/facts/aids.js");
  window.__h = new Hermit(app.ocean, { x: 560, y: 740 }); window.__h.show(true);
  window.__A = A; window.__board = new A.AidBoard(app);
});
await page.waitForTimeout(800); await shot("1-repos");
for (const [clip, at] of [["sortir", 450], ["montrer", 700], ["rejouir", 600]]) {
  await page.evaluate(([c]) => { window.__p = window.__h.play(c, { hold: 1500 }); }, [clip]); await page.waitForTimeout(at); await shot(`2-${clip}`);
  await page.evaluate(() => window.__p);
}
await page.evaluate(() => { window.__p = window.__h.play("changer"); }); await page.waitForTimeout(1200); await shot("3-changer-milieu");
await page.evaluate(() => window.__p); await page.waitForTimeout(400); await shot("3-changer-fin");
const st = await page.evaluate(() => ({ shell: window.__h.shell, clip: window.__h.clip, left: window.__h.left }));
check(st.shell === 1 && st.clip === "repos" && st.left === 560, `après « changer » : nouvelle coquille, au repos, l'ancienne posée (${JSON.stringify(st)})`);
// les aides : cadre de 10 (7 + ? = 10), maison du 7 (5 et ?), double + 1 (3 + 4)
await page.evaluate(() => { const { app } = { app: window.__app }; window.__h.at(160, 740); window.__board.draw((ctx) => window.__A.paintTenFrame(ctx, app.sprites, 440, 250, { n: 7, glow: [7, 8, 9] })); });
await page.waitForTimeout(300); await shot("4-cadre-de-10");
await page.evaluate(() => { const app = window.__app; window.__board.draw((ctx) => window.__A.paintHouse(ctx, app.sprites, 700, 330, 7, [[6, 1], [5, "?"]])); });
await page.waitForTimeout(300); await shot("5-maison");
await page.evaluate(() => { const app = window.__app; window.__board.draw((ctx) => window.__A.paintDoublePlus(ctx, app.sprites, 3, { cx: 700, y: 330 })); });
await page.waitForTimeout(300); await shot("6-double-plus-un");
const mem = await page.evaluate(() => { const s = window.__app.sprites.atlas.sheets; return ["ermite@2", "aides@2"].map((k) => [k, s[k].reduce((t, p) => t + p.w * p.h * 4, 0) / 1e6]); });
console.log(`planches décodées : ${mem.map(([k, v]) => `${k} ${v.toFixed(1)} Mo`).join(", ")}`);
await page.evaluate(() => { window.__h.remove(); window.__board.clear(); window.__app.sprites.unload("ermite"); });
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
