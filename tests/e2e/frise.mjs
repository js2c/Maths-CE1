// LA FRISE D'AVANCEMENT en images (tablette 1280 × 800, densité 2) : l'écran d'une question de la notion
// du jour, avec la frise en haut, et un agrandissement de la frise. Vérifie aussi qu'elle ne réagit pas
// au toucher. Sert aux captures « avant / après » des correctifs du 27 septembre 2026.
//   node tests/e2e/frise.mjs [--out dossier]
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/frise"));
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
await page.goto(url + "?nosw&voix=rapide"); await page.waitForFunction(() => window.__ready !== undefined);
await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
await page.goto(url + "?nosw&voix=rapide&sansLecon&sans=echauffement&questions=8&guides=0&format=lire"); await page.waitForFunction(() => window.__ready !== undefined);
await page.tap(".play", { force: true });
const waitQ = () => page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked; }, null, { timeout: 60000 });
// trois questions justes, puis la quatrième attend
for (let i = 0; i < 3; i++) { await waitQ(); const a = await page.evaluate(() => window.__app.screen.q.answer); await page.tap(`.answer[data-value="${a}"]`, { force: true }); await page.waitForFunction(() => window.__app.screen.locked, null, { timeout: 5000 }).catch(() => {}); }
await waitQ(); await page.waitForTimeout(600);
await page.screenshot({ path: join(OUT, "frise-ecran.png") });
await page.screenshot({ path: join(OUT, "frise-detail.png"), clip: { x: 300, y: 18, width: 520, height: 84 } });
const touch = await page.evaluate(() => { const f = document.querySelector(".frieze"); return { tag: f.tagName, events: getComputedStyle(f).pointerEvents }; });
check(touch.tag === "DIV" && touch.events === "none", `la frise ne réagit pas au toucher (${JSON.stringify(touch)})`);
await browser.close(); srv.close();
