// LES LEÇONS ANIMÉES L1 à L3 dans Chromium (tablette 1280 × 800, tactile), voix accélérée. Pour chaque
// leçon : lecture jusqu'au bout, avec un retour « phrase précédente » au milieu (L1 : deux) et un
// « rejouer » (L1) ; vérifie que la scène retombe sur l'état du début de la phrase demandée (tortue,
// arcs, nombres écrits), que la leçon est notée vue, et qu'aucune erreur n'apparaît. Captures des moments
// clés dans tests/e2e/out/lecons.
//   node tests/e2e/lecons.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { stateAt } from "../../app/js/lessons/script.js";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/lecons"));
mkdirSync(OUT, { recursive: true });
const lecons = JSON.parse(readFileSync(new URL("../../app/content/lecons.json", import.meta.url)));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };

for (const id of ["L1", "L2", "L3"]) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true })).newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + `?nosw&voix=rapide&lecon=${id}`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const L = lecons[id], at = () => page.evaluate(() => window.__app.lessons.p);
  const scene = () => page.evaluate(() => { const l = window.__app.lessons, S = l.S; return { p: l.p, tortue: S.tortue, arcs: S.arcs.length, ecrits: S.ecrits.join(), turtleVisible: window.__app.screen.turtle.a.vis }; });
  // au milieu de la leçon : « phrase précédente » ; la scène doit être celle du début de la phrase d'avant
  const mid = Math.min(L.phrases.length - 2, 2);
  await page.waitForFunction((m) => window.__app.lessons.p === m, mid, { timeout: 60000 }); await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `${id}-phrase-${mid + 1}.png`) });
  await page.tap(".lessonkey.precedent", { force: true }); await page.waitForTimeout(80);
  const want = stateAt(L, mid - 1), got = await scene();
  check(got.p === mid - 1 && got.tortue === want.tortue && got.arcs === want.arcs.length && got.ecrits === want.ecrits.join(), `${id} : « phrase précédente » ramène au début de la phrase ${mid} (${JSON.stringify(got)})`);
  if (id === "L1") {
    // deux retours de suite, puis « rejouer » : tout repart de la scène vide
    await page.waitForFunction(() => window.__app.lessons.p === 3, null, { timeout: 60000 }); await page.waitForTimeout(700);
    await page.screenshot({ path: join(OUT, "L1-arcs.png") });
    await page.tap(".lessonkey.precedent", { force: true }); await page.waitForTimeout(40); await page.tap(".lessonkey.precedent", { force: true }); await page.waitForTimeout(80);
    check((await at()) === 1, `L1 : deux retours en arrière depuis la phrase 4 -> phrase 2 (${await at()})`);
    await page.waitForTimeout(600);
    await page.tap(".lessonkey.rejouer", { force: true }); await page.waitForTimeout(80);
    const s = await scene();
    check(s.p === 0 && s.tortue === null && s.arcs === 0 && !s.turtleVisible, "L1 : « rejouer » repart de la scène vide");
    await page.waitForFunction(() => window.__app.lessons.p === 4, null, { timeout: 90000 }); await page.waitForTimeout(2500);
    await page.screenshot({ path: join(OUT, "L1-compter.png") });
  }
  await page.waitForFunction(() => window.__lecon, null, { timeout: 120000 });
  const r = await page.evaluate(() => window.__lecon);
  check(r.vue && r.precedentes === (id === "L1" ? 3 : 1) && r.rejouees === (id === "L1" ? 1 : 0), `${id} vue jusqu'au bout (${JSON.stringify(r)})`);
  check((await page.locator(".lessonkey").count()) === 0, `${id} : les boutons de la leçon disparaissent à la fin`);
  check(errors.length === 0, `${id} : aucune erreur dans la page ${errors.join(" | ")}`);
  await page.context().close();
}
await browser.close(); srv.close();
