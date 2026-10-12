// UNE LEÇON DE L'ÉTAL QUITTÉE PENDANT QUE SA SCÈNE S'INSTALLE (lot « Recette de l'enfant et nettoyage des couches », point 3 :
// défaut trouvé par l'enfant imprévisible, graine 1, réduit à deux actions : les leçons, puis L18). La leçon installe sa
// propre scène de l'étal (lessons/etal.js) ; quittée par la maison avant la fin de l'installation, la scène restait à l'écran
// sur l'accueil, et la leçon reprenait ensuite. Les images de l'étal sont ici retardées (1,5 s) pour ouvrir la fenêtre ; la
// maison est touchée à plusieurs moments : rien de l'étal ne doit rester, aucune phrase de la leçon ne doit être dite après.
//   node tests/e2e/lecon-etal-quittee.mjs
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
for (const apres of [100, 600, 1200, 4000]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await context.route(/assets\/etal\//, async (r) => { await new Promise((ok) => setTimeout(ok, 1500)); await r.continue(); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await page.tap(".leconskey", { force: true }); await page.waitForSelector('.lecons-tuile[data-key="L18"]'); await page.waitForTimeout(500);
  for (let i = 0; i < 2; i++) { await page.tap('.lecons-tuile[data-key="L18"]', { force: true }); await page.waitForTimeout(120); }
  await page.waitForTimeout(apres);
  const n0 = await page.evaluate(() => window.__said.length);
  await page.tap(".homekey", { force: true });
  await page.waitForTimeout(4000);
  const r = await page.evaluate((n0) => ({ scene: [...document.querySelectorAll("canvas.etal-decor, .etal-scene")].filter((e) => e.isConnected && e.getBoundingClientRect().width > 2 && getComputedStyle(e).display !== "none").length, lecon: !!window.__app.etalLecon, galets: !!document.querySelector(".galet"), dit: window.__said.slice(n0) }), n0);
  check(r.galets && !r.scene && !r.lecon, `maison ${apres} ms après le choix de L18 : l'accueil, sans la scène de l'étal (éléments : ${r.scene}, scène de la leçon : ${r.lecon})`);
  const lecon = r.dit.filter((t) => !/Touche|Choisis|bulle|encore|demain/i.test(t));
  check(!lecon.length, `maison ${apres} ms après : la leçon ne parle plus (${lecon.join(" | ")})`);
  check(!errors.length, `${apres} : aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
