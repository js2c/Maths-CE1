// LES LEÇONS ANIMÉES L1 à L3 dans Chromium (tablette 1280 × 800, tactile), voix accélérée. Pour chaque
// leçon : les deux boutons « rejouer » et « passer » dès le début (pas de « phrase précédente ») ; un
// « rejouer » au milieu, qui ramène à la scène vide ; lecture jusqu'au bout ; la leçon est notée vue, et
// aucune erreur n'apparaît. Captures des moments clés dans tests/e2e/out/lecons.
//   node tests/e2e/lecons.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
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
  await page.waitForSelector(".lessonkey.rejouer", { timeout: 5000 });
  check((await page.locator(".lessonkey.precedent").count()) === 0 && (await page.locator(".skip.lessonkey").count()) === 1, `${id} : « rejouer » et « passer », pas de « phrase précédente »`);
  // au milieu de la leçon : « rejouer » ; tout repart de la scène vide
  const mid = Math.min(L.phrases.length - 2, 2);
  await page.waitForFunction((m) => window.__app.lessons.p === m, mid, { timeout: 60000 }); await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `${id}-phrase-${mid + 1}.png`) });
  await page.tap(".lessonkey.rejouer", { force: true }); await page.waitForTimeout(80);
  const got = await scene();
  check(got.p === 0 && got.tortue === null && got.arcs === 0 && !got.turtleVisible, `${id} : « rejouer » repart de la scène vide (${JSON.stringify(got)})`);
  if (id === "L1") {
    await page.waitForFunction(() => window.__app.lessons.p === 3, null, { timeout: 60000 }); await page.waitForTimeout(700);
    await page.screenshot({ path: join(OUT, "L1-arcs.png") });
    await page.waitForFunction(() => window.__app.lessons.p === 4, null, { timeout: 90000 }); await page.waitForTimeout(2500);
    await page.screenshot({ path: join(OUT, "L1-compter.png") });
  }
  await page.waitForFunction(() => window.__lecon, null, { timeout: 120000 });
  const r = await page.evaluate(() => window.__lecon);
  check(r.vue && !r.passee && r.rejouees === 1, `${id} vue jusqu'au bout (${JSON.stringify(r)})`);
  check((await page.locator(".lessonkey").count()) === 0, `${id} : les boutons de la leçon disparaissent à la fin`);
  const manques = await page.evaluate(() => [...window.__app.voice.misses]);
  check(manques.length === 0, `${id} : chaque phrase dite a son fichier son${manques.length ? ` ; sans fichier : ${manques.join(" | ")}` : ""}`);
  check(errors.length === 0, `${id} : aucune erreur dans la page ${errors.join(" | ")}`);
  await page.context().close();
}
await browser.close(); srv.close();
