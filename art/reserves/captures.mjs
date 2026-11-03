// LES CAPTURES DE LA MAQUETTE « Réserves d'étoiles et étoiles arc-en-ciel » (docs/maquettes/reserves/), en 1280 × 800 et sur le
// petit smartphone du banc Android (tests/e2e/appareils.mjs). L'application est servie telle quelle (tests/serve.mjs) ; la
// maquette (art/reserves/maquette.js) y est injectée. Rien n'est modifié sous app/.
//   node art/reserves/captures.mjs [--vue 1280|petit-smartphone]
// BANC ANDROID, raccourcis : voix rapide, sans service worker (raison : des captures d'écrans fixes, pas un parcours).
import { chromium, voixPermise } from "../../tests/e2e/navigateur.mjs";
import { optionsProfil } from "../../tests/e2e/appareils.mjs";
import { serve } from "../../tests/serve.mjs";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../../docs/maquettes/reserves/", import.meta.url)); mkdirSync(OUT, { recursive: true });
const MAQ = fileURLToPath(new URL("./maquette.js", import.meta.url));
const args = process.argv.slice(2), seule = args.includes("--vue") ? args[args.indexOf("--vue") + 1] : null;
// les phrases proposées ne sont pas encore fabriquées : la bulle les écrit
voixPermise(/^Tu as /, /^Elles? /, /^À la fin de ta prochaine séance/, /^Ou bien une étoile arc-en-ciel/, /^Touche la coche de l'étoile/, /^Tes? étoiles? arc-en-ciel (est|sont) gardée/, /^Les prix de la boutique ont changé/);
const VUES = [["1280", { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }], ["petit-smartphone", optionsProfil("petit-smartphone")]].filter(([v]) => !seule || v === seule);
const Q = "?nosw&voix=rapide&sansLecon&sans=echauffement&questions=2&guides=0";
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const lagon = ["poisson-clown", "etoile-de-mer", "crabe", "crevette", "bernard-l-ermite", "moule"];
const owned = (l) => ({ id: "cartes", cartes: Object.fromEntries(l.map((id) => [id, { n: 1, premiere: 1, brillante: false }])) });
const etoiles = (total, arc, dorees) => ({ id: "etoiles", total, cumul: total + 400, dorees, doreesDepensees: 0, arcEnCiel: arc + 1, arcDepensees: 1, arcLibre: 0, coquillages: 0, coquillagesDores: 0 });
const tap = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };

async function ouvrir(vue, st) {
  const context = await browser.newContext(vue[1]), page = await context.newPage();
  page.on("pageerror", (e) => console.log("ERREUR PAGE", e.message));
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (st) => { const s = window.__app.store; await s.wipe(); for (const r of st) await s.put("recompenses", r); }, st);
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.addScriptTag({ path: MAQ }); await page.waitForTimeout(1800);
  return { context, page };
}
const M = (page, f, a) => page.evaluate(([f, a]) => window.MaquetteReserves[f](window.__app, a), [f, a]);
const shot = async (page, vue, nom, ms = 700) => { await page.waitForTimeout(ms); await page.screenshot({ path: `${OUT}${nom}-${vue[0]}.png` }); console.log(`capture ${nom}-${vue[0]}`); };
async function boutique(page) {
  await tap(page, ".reefkey"); await page.waitForFunction(() => !!(window.__app.reef?.open && window.__app.reef.api), null, { timeout: 30000 }); await page.waitForTimeout(1200);
  await tap(page, ".boutique-cle"); await page.waitForFunction(() => document.querySelectorAll(".boutique-tuile").length === 15 && window.__app.boutique.open, null, { timeout: 30000 }); await page.waitForTimeout(1500);
}

for (const vue of VUES) {
  // A. 4 étoiles arc-en-ciel (une à dépenser : trois zones fermées, trois gardées), 2 étoiles de diamant, 260 étoiles de mer
  {
    const { context, page } = await ouvrir(vue, [owned(lagon), etoiles(260, 4, 2), { id: "quota", date: Date.now(), cartes: 9 }]);
    await M(page, "reserves", { arc: 4, diamant: 2 }); await shot(page, vue, "01-compteur-deux-reserves");
    await tap(page, ".maquette-reserve.arc"); await shot(page, vue, "02-reserve-arc-touchee", 2200);
    await tap(page, ".maquette-reserve.diamant"); await shot(page, vue, "03-reserve-diamant-touchee", 2200);
    await M(page, "reserves", { arc: 4, diamant: 0 }); await page.evaluate(() => window.__app.voice.stop()); await shot(page, vue, "04-compteur-une-seule-reserve");
    // pendant un exercice (la notion du jour)
    await M(page, "reserves", { arc: 4, diamant: 2 });
    await tap(page, ".play"); await page.waitForTimeout(5000); await M(page, "reserves", { arc: 4, diamant: 2 }); await shot(page, vue, "05-pendant-un-exercice");
    await context.close();
  }
  // B. la boutique : deux façons de faire briller ; puis le vol de l'étoile arc-en-ciel
  {
    const { context, page } = await ouvrir(vue, [owned(lagon), etoiles(260, 4, 2), { id: "quota", date: Date.now(), cartes: 9 }]);
    await boutique(page); await M(page, "reserves", { arc: 4, diamant: 2 });
    await tap(page, '.boutique-tuile[data-id="crabe"]'); await page.waitForTimeout(600);
    await M(page, "boutique", { facon: "deux" }); await shot(page, vue, "06-boutique-deux-facons", 2200);
    await page.evaluate(() => { window.__app.voice.stop(); window.__app.bulle.cacher(true); document.querySelectorAll(".boutique-conf").forEach((k) => { k.style.visibility = "hidden"; }); });
    await M(page, "brillerArc", { arret: 0.6 }); await shot(page, vue, "07-boutique-briller-arc-vol");
    await context.close();
  }
  // C. pas assez d'étoiles de mer : la seule coche arc-en-ciel
  {
    const { context, page } = await ouvrir(vue, [owned(lagon), etoiles(60, 4, 2), { id: "quota", date: Date.now(), cartes: 9 }]);
    await boutique(page); await M(page, "reserves", { arc: 4, diamant: 2 });
    await tap(page, '.boutique-tuile[data-id="crabe"]'); await page.waitForTimeout(600);
    await M(page, "boutique", { facon: "arc" }); await shot(page, vue, "08-boutique-arc-seule", 2200);
    await context.close();
  }
  // D. l'étoile arc-en-ciel gardée pour la prochaine zone (2 étoiles, 3 zones fermées : toutes gardées)
  {
    const { context, page } = await ouvrir(vue, [owned(lagon), etoiles(260, 2, 0), { id: "quota", date: Date.now(), cartes: 9 }]);
    await boutique(page); await M(page, "reserves", { arc: 2, diamant: 0 });
    await tap(page, '.boutique-tuile[data-id="crevette"]'); await page.waitForTimeout(600);
    await M(page, "boutique", { facon: "gardee", gardees: 2 }); await shot(page, vue, "09-boutique-etoile-gardee", 2200);
    await context.close();
  }
  // E. la récompense : 2 étoiles arc-en-ciel et une étoile de diamant volent vers leur réserve
  {
    const { context, page } = await ouvrir(vue, [owned(lagon), etoiles(260, 3, 1), { id: "quota", date: Date.now(), cartes: 9 }]);
    await M(page, "reserves", { arc: 3, diamant: 1 });
    await page.evaluate(() => { document.querySelectorAll("#ui .galet, #ui .play, #ui .reefkey, #ui .accueil").forEach((e) => { e.style.visibility = "hidden"; }); });
    await M(page, "recompense", { arcs: 2, diamant: true, arret: 0.55 }); await shot(page, vue, "10-recompense-vol-vers-les-reserves");
    await page.evaluate(() => { document.querySelectorAll(".maquette-vol").forEach((e) => e.remove()); window.MaquetteReserves.etat.set("arc", 5); window.MaquetteReserves.etat.set("diamant", 2); });
    await M(page, "recompense", { etoiles: 34, arcs: 0, diamant: false, phrase: "Tu as bien travaillé !" }); await shot(page, vue, "11-recompense-reserves-a-jour");
    await context.close();
  }
}
await browser.close(); srv.close();
