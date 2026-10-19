// LES CAPTURES DU LOT « Correctifs de l'installation et de la veille » (docs/LOTS.md, fiche 12), à 1280 × 800 (densité 2, la
// tablette) et 1920 × 1200 (densité 1) :
//   - le secours du lancement dans la page : « Chargement… », puis « Toucher pour réessayer » (point 1) ;
//   - la page de secours du service worker (ni cache ni réseau ; point 1) ;
//   - l'espace parent, « Données et réglages » : le journal technique, et son export seul (point 5) ;
// et vérifie que la sauvegarde complète contient le journal, et qu'une sauvegarde qui le contient se restaure.
// Les autres situations du lot ont leur propre parcours, avec leurs captures : installation.mjs (les relances), veille.mjs
// (les longues inactivités), poissons.mjs (les poissons du lagon), lecons-monnaie.mjs (les leçons L15 à L18).
//   node tests/e2e/correctifs-installation.mjs
// BANC ANDROID, raccourcis : sans service worker, son coupé
// (raison : chaque cas part d'une base neuve, dans un navigateur neuf : la voix y est la vraie, mais installer l'application
// (140 Mo, environ une minute) pour chaque cas n'apporterait rien à ce qu'il vérifie ; le son (bruitages, musique) ne change
// rien à ce qu'il vérifie. L'application installée, relancée, gelée, hors ligne, est éprouvée sur le banc Android
// (installation.mjs, journee.mjs).)
import { chromium } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const OUT = resolve("tests/e2e/out/correctifs-installation"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
// la page de secours du service worker, telle qu'il l'écrit (app/sw.js, `secours`)
const SECOURS = readFileSync("app/sw.js", "utf8").match(/const secours = \(\) => new Response\(`([\s\S]*?)`, \{/)[1];

for (const [w, h, dpr] of [[1280, 800, 2], [1920, 1200, 1]]) {
  const T = `${w}`;
  // 1. le secours de la page : un chargement qui tarde (les images du premier écran retenues)
  {
    const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: true, serviceWorkers: "block" }), page = await context.newPage();
    const retenus = []; await page.route("**/assets/art/atlas.json", (r) => retenus.push(r));
    await page.goto(url + "?nosw&son=non");
    await page.waitForTimeout(400); await page.screenshot({ path: join(OUT, `${T}-1-lancement-premiere-image.png`) });
    const vide = await page.evaluate(() => getComputedStyle(document.getElementById("chargement-etat")).visibility);
    check(vide === "hidden", `${T} : au lancement, le fond de l'écran de lancement d'Android, sans texte (${vide})`);
    await page.waitForTimeout(2600); await page.screenshot({ path: join(OUT, `${T}-2-chargement.png`) });
    check(/Chargement…/.test(await page.locator("#chargement").innerText()), `${T} : au bout de 2,5 s, « Chargement… »`);
    await page.waitForTimeout(12800); await page.screenshot({ path: join(OUT, `${T}-3-toucher-pour-reessayer.png`) });
    check(/Toucher pour réessayer/.test(await page.locator("#chargement").innerText()), `${T} : au bout de 15 s, « Toucher pour réessayer »`);
    retenus.forEach((r) => r.abort().catch(() => {}));
    await context.close();
  }
  // 2. la page de secours du service worker
  {
    const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr }), page = await context.newPage();
    await page.setContent(SECOURS); await page.screenshot({ path: join(OUT, `${T}-4-secours-service-worker.png`) });
    check(/Vérifiez le Wi-Fi, puis touchez l'écran pour réessayer/.test(await page.innerText("body")), `${T} : la page de secours du service worker dit quoi faire`);
    await context.close();
  }
  // 3. l'espace parent : le journal technique
  {
    const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: true }), page = await context.newPage(), errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url + "?nosw&son=non&sansReprise"); await page.waitForFunction(() => window.__ready !== undefined);
    // (quelques événements de plus, comme sur la tablette : une lecture refusée, un passage en arrière-plan)
    await page.evaluate(async () => { const { noter } = await import("./js/engine/journal.js"); await noter("page", "en arrière-plan", { son: "running" }); await noter("page", "au premier plan", { son: "suspended" }); await noter("voix", "lecture refusée", { phrase: "Touche une bulle : je te dis ce que c'est.", erreur: "NotAllowedError" }); await noter("service worker", "installation finie", { source: "service worker", fichiers: 11804, nouveaux: 214, dureeMs: 41800, version: "4452ac0e8be3" }); });
    const logo = await page.locator(".logo").boundingBox(); await page.mouse.move(logo.x + logo.width / 2, logo.y + logo.height / 2);
    for (let k = 0; k < 3 && !(await page.locator(".pa-gate").isVisible()); k++) { await page.waitForTimeout(800); await page.mouse.down(); await page.waitForTimeout(3000); await page.mouse.up(); await page.waitForTimeout(400); }
    const type = async (code) => { for (const d of code) await page.tap(`.pa-keys [data-key="${d}"]`); await page.waitForTimeout(250); };
    await page.waitForSelector(".pa-gate"); await type("2468"); await type("2468"); await page.waitForSelector(".pa-sheet");
    await page.tap('[data-tab="donnees"]'); await page.waitForTimeout(600);
    const box = page.locator(".pa-journal-box");
    check(await box.isVisible(), `${T} : « Journal technique » dans « Données et réglages »`);
    const lignes = await page.locator(".pa-journal li").allInnerTexts();
    check(lignes.some((l) => /lancement · application lancée \(première image en \d+,\d s, prête en \d+,\d s/.test(l)) && lignes.some((l) => /lecture refusée/.test(l)), `${T} : le lancement et son temps jusqu'à la première image, la lecture refusée (${lignes.length} lignes ; « ${lignes.find((l) => /lancement/.test(l))} »)`);
    await box.scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
    await box.screenshot({ path: join(OUT, `${T}-5-journal-technique.png`) });
    const grab = async (sel) => { const [dl] = await Promise.all([page.waitForEvent("download"), page.locator(sel).click()]); const p = join(OUT, `${T}-${dl.suggestedFilename()}`); await dl.saveAs(p); return { name: dl.suggestedFilename(), text: readFileSync(p, "utf8") }; };
    const j = await grab('[data-export="journal"]'), journal = JSON.parse(j.text);
    check(/journal-technique/.test(j.name) && journal.length >= 5 && journal.every((e) => e.t && e.type && e.message), `${T} : le journal exporté seul (${j.name}, ${journal.length} événements)`);
    const s = await grab('[data-export="json"]'), dump = JSON.parse(s.text);
    check(Array.isArray(dump.journalTechnique) && dump.journalTechnique.length >= 5, `${T} : la sauvegarde complète contient le journal technique (${dump.journalTechnique?.length} événements)`);
    // une sauvegarde qui contient le journal se restaure (le journal n'est pas restauré : il est propre à la tablette)
    const { restoreProblem } = await import("../../app/js/parent/data.js");
    check(restoreProblem(dump, { base: dump.base, version: dump.version, stores: Object.keys(dump).filter((k) => Array.isArray(dump[k]) && k !== "journalTechnique") }) === null, `${T} : une sauvegarde avec le journal se restaure`);
    check(!errors.length, `${T} : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
}
await browser.close(); srv.close();
process.exitCode = fail.length ? 1 : 0;
