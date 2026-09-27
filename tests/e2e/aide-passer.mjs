// L'AIDE DES ADDITIONS PEUT ÊTRE PASSÉE (décision du parent du 27 septembre 2026), dans Chromium (1280 × 800,
// tactile), voix accélérée : le coquillage (aide demandée) et l'aide affichée d'emblée du cran « plus facile »
// montrent dès leur début le bouton « passer » habituel (même dessin, même place) ; un toucher coupe la voix et
// l'animation (tortue et ligne, ou cadre de 10), range l'appui et rend le pavé aussitôt. Réponses notées : aide
// demandée (coquillage), « aide d'emblée » (cran « plus facile »). Captures dans tests/e2e/out/aide-passer.
//   node tests/e2e/aide-passer.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/aide-passer"));
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const SKIP_BOX = { x: 1135, y: 148, w: 140, h: 140 };
const SPY = () => { window.__skipAt = []; window.__tapAt = 0; addEventListener("pointerdown", () => { window.__tapAt = performance.now(); }, true); new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.classList?.contains("skip")) window.__skipAt.push(performance.now()); }).observe(document, { childList: true, subtree: true }); };
const errors = [];

// une séance d'additions en notion du jour ; familles d'avant marquées connues par le parent
async function run({ nom, familles = 0, cran = "conseille", appui }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
  await context.addInitScript(SPY);
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const shot = (n) => page.screenshot({ path: join(OUT, `${nom}-${n}.png`) });
  await page.goto(url + "?nosw&voix=rapide"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (fam) => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); const { markFamilyKnown } = await import("./js/parent/depart.js"), m2 = await (await fetch("content/module2.json")).json(); for (let f = 1; f <= fam; f++) await markFamilyKnown(s, m2, f); }, familles);
  await page.goto(url + `?nosw&voix=rapide&cran=${cran}&sans=echauffement&module=2&sansLecon&guides=0&questions=4`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const skipState = () => page.evaluate(() => { const b = [...document.querySelectorAll(".skip")].at(-1); if (!b || getComputedStyle(b).visibility === "hidden") return null; const r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), delay: Math.round(window.__skipAt.at(-1) - window.__tapAt), label: b.getAttribute("aria-label") }; });
  const padOpen = () => page.evaluate(() => { const s = window.__app.facts; return !!(s?.q && s.resolve && !s.locked && [...document.querySelectorAll(".key")].every((k) => getComputedStyle(k).visibility === "visible")); });
  // la question du jour, avec son appui (cran « plus facile » : l'aide est déjà là, le pavé caché)
  if (cran === "facile") {
    await page.waitForFunction(() => window.__app.facts?.q?.aideDEmblee && document.querySelector(".skip"), null, { timeout: 60000 });
    await page.waitForTimeout(600);
    const sk = await skipState(), q = await page.evaluate(() => window.__app.facts.q.appui);
    await shot("1-aide-d-emblee");
    check(!!sk && sk.x === SKIP_BOX.x && sk.y === SKIP_BOX.y && sk.w === SKIP_BOX.w, `${nom} : « passer » dès le début de l'aide affichée d'emblée (${q}), même place (${JSON.stringify(sk)})`);
  } else {
    await page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked; }, null, { timeout: 60000 });
    await page.waitForTimeout(400);
    await page.tap(".help", { force: true });
    await page.waitForSelector(".skip", { timeout: 2000 });
    const sk = await skipState(), q = await page.evaluate(() => window.__app.facts.q.appui);
    check(!!sk && sk.x === SKIP_BOX.x && sk.y === SKIP_BOX.y && sk.w === SKIP_BOX.w && sk.delay >= 0 && sk.delay < 300, `${nom} : « passer » ${sk?.delay} ms après le toucher du coquillage (${q}), même place et même taille (${JSON.stringify(sk)})`);
    await page.waitForTimeout(appui === "ligne" ? 900 : 600);
    await shot("1-aide-coquillage");
  }
  const busy = await page.evaluate(() => ({ board: !!window.__app.aidBoard?.used, tortue: !!window.__app.lineScreen?.().turtle?.a?.vis, voix: window.__app.voice.speaking }));
  const t0 = Date.now();
  await page.tap(".skip", { force: true });
  await page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked && [...document.querySelectorAll(".key")].every((k) => getComputedStyle(k).visibility === "visible"); }, null, { timeout: 5000 });
  const dt = Date.now() - t0;
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => ({ board: !!window.__app.aidBoard?.used, tortue: !!window.__app.lineScreen?.().turtle?.a?.vis, skip: [...document.querySelectorAll(".skip")].some((e) => getComputedStyle(e).visibility !== "hidden"), arcs: window.__app.lineScreen?.().arcs?.length ?? 0 }));
  await shot("2-aide-passee");
  check(dt < 600 && (await padOpen()), `${nom} : le pavé revient ${dt} ms après « passer »`);
  check((busy.board || busy.tortue) && !after.board && !after.tortue && !after.arcs && !after.skip, `${nom} : l'appui était là (${JSON.stringify(busy)}) ; il est rangé, le bouton « passer » aussi (${JSON.stringify(after)})`);
  // la réponse, puis ce qui est noté
  const v = await page.evaluate(() => { const f = window.__app.facts.q; return f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a + f.b; });
  for (const d of String(v)) await page.tap(`.key[data-key="${d}"]`, { force: true });
  await page.tap('.key[data-key="valider"]', { force: true });
  let rep = null;
  for (let i = 0; i < 50 && !rep; i++) { await page.waitForTimeout(200); rep = await page.evaluate(async () => (await window.__app.store.all("reponses")).at(-1) ?? null); }
  if (cran === "facile") check(rep.juste && rep.aideDEmblee && !rep.aide, `${nom} : réponse notée « aide d'emblée » (${JSON.stringify({ juste: rep.juste, aide: rep.aide, aideDEmblee: rep.aideDEmblee })})`);
  else check(rep.juste && rep.aide, `${nom} : réponse notée « aide demandée » (${JSON.stringify({ juste: rep.juste, aide: rep.aide })})`);
  await context.close();
}

await run({ nom: "ligne", familles: 0, appui: "ligne" });
await run({ nom: "cadre", familles: 2, appui: "cadre" });
await run({ nom: "facile-ligne", familles: 0, cran: "facile", appui: "ligne" });
await run({ nom: "facile-cadre", familles: 2, cran: "facile", appui: "cadre" });
check(errors.length === 0, `aucune erreur dans la page${errors.length ? ` : ${errors.join(" | ")}` : ""}`);
await browser.close(); srv.close();
