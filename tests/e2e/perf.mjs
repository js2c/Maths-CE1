// MESURES ET CAPTURES dans Chromium : tablette simulée 1280 × 800, densité 2, écran tactile,
// processeur ralenti 4 fois (CDP Emulation.setCPUThrottlingRate).
//   node tests/e2e/perf.mjs [--video] [--out dossier] [--throttle 4] [--seconds 12]
// Mesure :
//   - démarrage : du début de la navigation à « premier écran prêt » (planches du premier écran
//     décodées et deux images dessinées : repère performance « app-ready »), à froid puis à chaud ;
//   - temps d'image pendant une séance : intervalles entre images (requestAnimationFrame) et temps de
//     travail de chaque image dans l'application (stage.perf), moyenne, 95e centile, images > 33 ms.
// Captures : premier écran, question posée, retour juste, retour faux.
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync, renameSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out")), RATE = Number(opt("--throttle", 4)), SECONDS = Number(opt("--seconds", 12)), VIDEO = args.includes("--video");
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const stats = (a) => { const s = [...a].sort((x, y) => x - y), q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return { n: a.length, moyenne: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1), p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), max: +s[s.length - 1].toFixed(1), plusDe33ms: a.filter((x) => x > 33.4).length }; };

const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true, isMobile: false, ...(VIDEO ? { recordVideo: { dir: OUT, size: { width: 1280, height: 800 } } } : {}) });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: RATE });

// ---- démarrage à froid (cache vide), puis à chaud (cache HTTP rempli)
const startup = async () => { await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 }); return page.evaluate(() => Math.round(performance.getEntriesByName("app-ready")[0].startTime)); };
await page.goto(url + opt("--query", "?sans=echauffement")); const cold = await startup();
await page.reload(); const warm = await startup();
console.log(`démarrage (processeur ÷${RATE}) : à froid ${cold} ms, à chaud ${warm} ms`);
await page.waitForTimeout(1500);
await page.screenshot({ path: join(OUT, "1-accueil.png") });

// ---- séance : on touche « jouer », puis on répond (juste, puis faux, puis juste…) en mesurant les images
await page.tap(".play", { force: true });
// premier lancement : la pieuvre demande son nom (un nom, puis la coche)
await page.waitForSelector(".name", { timeout: 30000 }); await page.tap('.name[data-value="Pili"]', { force: true }); await page.tap(".check", { force: true });
await page.waitForSelector(".answer", { timeout: 30000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, "2-question.png") });
await page.waitForTimeout(500);
await page.evaluate(() => { window.__gaps = []; window.__slow = []; let last = performance.now(); const f = (t) => { window.__gaps.push(t - last); if (t - last > 33.4) window.__slow.push([Math.round(t), Math.round(t - last), window.__app.ocean.octo.clip]); last = t; requestAnimationFrame(f); }; requestAnimationFrame(f); window.__app.stage.perf.work.length = 0; window.__work = []; const s = window.__app.stage, m = s.measure.bind(s); s.measure = (w, g) => { window.__work.push(w); m(w, g); }; });

const answer = async (right) => {
  const v = await page.evaluate((r) => { const q = window.__app.screen?.q ?? null; return q ? (r ? q.answer : q.choices.find((c) => c.value !== q.answer).value) : null; }, right);
  await page.tap(`.answer[data-value="${v}"]`, { force: true });
};
// la mesure : aucune capture pendant cette boucle (une capture fige le rendu et fausserait les chiffres)
const next = async () => { await page.waitForFunction(() => document.querySelectorAll(".answer").length && !window.__app.screen?.locked, null, { timeout: 30000 }); await page.waitForTimeout(1500); };
const t0 = Date.now(); let k = 0;
while (Date.now() - t0 < SECONDS * 1000) { await answer(k % 3 !== 1); await page.waitForTimeout(300); await next(); k++; }
const gaps = await page.evaluate(() => window.__gaps), work = await page.evaluate(() => window.__work), slow = await page.evaluate(() => window.__slow);
const perfLevel = await page.evaluate(() => window.__app.stage.perf.level);
const mem = await page.evaluate(() => { const sp = window.__app.sprites; let px = 0; for (const { pages } of sp.pages.values()) for (const p of pages) px += p.width * p.height; return +(px * 4 / 1048576).toFixed(1); });
// les captures, après la mesure : une réponse juste, puis une fausse
await answer(true); await page.waitForTimeout(1500); await page.screenshot({ path: join(OUT, "3-juste.png") }); await next();
await answer(false); await page.waitForTimeout(2200); await page.screenshot({ path: join(OUT, "4-faux.png") });
const result = { date: new Date().toISOString(), ecran: "1280x800, densité 2, tactile", processeur: `ralenti ×${RATE}`, demarrage_ms: { froid: cold, chaud: warm }, intervalles_ms: stats(gaps), travail_par_image_ms: stats(work), niveau_allegement: perfLevel, sprites_decodes_Mo: mem, questions: k, images_lentes: slow.map(([t, d, c]) => `${d} ms (${c})`), erreurs: errors };
console.log(JSON.stringify(result, null, 1));
writeFileSync(join(OUT, `mesures-x${RATE}.json`), JSON.stringify(result, null, 1));
await context.close();
if (VIDEO) { const v = readdirSync(OUT).filter((f) => f.endsWith(".webm")).map((f) => join(OUT, f)); if (v.length) renameSync(v[v.length - 1], join(OUT, "seance.webm")); }
await browser.close(); srv.close();
if (errors.length) process.exitCode = 1;
