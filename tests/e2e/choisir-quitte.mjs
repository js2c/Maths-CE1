// « CHOISIR » QUITTÉ PENDANT SON CHARGEMENT (lot « Recette de l'enfant et nettoyage des couches », point 3 : défaut trouvé par
// l'enfant imprévisible, graine 1023). L'écran « choisir » charge sa planche avant de poser ses images ; la maison touchée
// pendant ce temps ramenait à l'accueil, puis l'écran se construisait quand même, par-dessus l'accueil (ses exercices, puis ses
// niveaux, touchables). La planche est ici retardée (1,5 s) : depuis l'accueil, puis depuis l'accueil en pause.
//   node tests/e2e/choisir-quitte.mjs
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";

const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const choix = (page) => page.evaluate(() => [...document.querySelectorAll(".choix-ex, .choix-tuile")].filter((e) => e.isConnected && !e.closest(".stash")).length);
for (const enPause of [false, true]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let retard = false;
  await context.route(/assets\/art\/choix@/, async (r) => { if (retard) await new Promise((ok) => setTimeout(ok, 1500)); await r.continue(); });
  await page.goto(url + "?nosw&voix=rapide&son=non&sans=echauffement&module=1&sansLecon&guides=0&cran=conseille"); await page.waitForFunction(() => window.__ready !== undefined);
  if (enPause) {
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, null, { timeout: 60000 });
    await page.tap(".session-home", { force: true }); await page.waitForSelector(".keep.choisir", { timeout: 10000 }); await page.waitForTimeout(500);
  }
  retard = true;
  await page.tap(enPause ? ".keep.choisir" : ".choisir", { force: true }); await page.waitForTimeout(250);
  await page.tap(".homekey", { force: true });
  await page.waitForTimeout(3500);
  const n = await choix(page), ou = await page.evaluate(() => ({ mode: window.__app.modeEcran?.() ?? null, pause: !!window.__app.enPause }));
  check(n === 0, `${enPause ? "depuis l'accueil en pause" : "depuis l'accueil"} : « choisir », puis la maison pendant le chargement : aucune image de l'écran de choix ne reste (${n} ; ${JSON.stringify(ou)})`);
  if (enPause) check(ou.pause && (await page.locator(".keep.play").count()) > 0, "on revient à l'accueil en pause, la séance intacte");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
