// RECETTE : durées réelles (voix normale) de ce que l'enfant regarde sans pouvoir agir, niveau par niveau :
// leçon d'entrée, exemples guidés, correction après « je ne sais pas », correction après une erreur.
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { serve } from "../serve.mjs";
const PASSER = process.argv.includes("--passer"); // l'enfant touche « passer » dès qu'il apparaît
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const out = [];
for (const niveau of [1, 3, 4, 5, 6, 7, 8]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  await page.goto(url + `?nosw&cran=conseille&sans=echauffement&niveau=${niveau}&questions=4`); // (lot 2 : le sélecteur de difficulté est mesuré à part, tests/e2e/selecteur.mjs) await page.waitForFunction(() => window.__ready !== undefined);
  const t0 = Date.now(); await page.tap(".play", { force: true });
  const open = () => page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked; }, null, { timeout: 240000, polling: 100 });
  const ev = []; let t = Date.now();
  if (PASSER) await page.evaluate(() => { window.__passes = 0; setInterval(() => { const b = document.querySelector(".skip"); if (b && getComputedStyle(b).visibility !== "hidden") { b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); window.__passes++; } }, 150); });
  for (let k = 0; k < 5; k++) {
    await open(); const now = Date.now(), q = await page.evaluate(() => ({ f: window.__app.screen.q.format, a: window.__app.screen.q.answer, g: !!window.__app.screen.q.guide }));
    ev.push(`${k === 0 ? "avant la 1re question (accueil, leçon, exemple)" : "attente"} ${((now - t) / 1000).toFixed(1)} s`);
    await page.waitForTimeout(800); t = Date.now();
    if (k === 1) { await page.tap(".nsp", { force: true }); ev.push(`[NSP ${q.f}]`); }
    else if (k === 2) { const v = await page.evaluate(() => { const b = [...document.querySelectorAll(".answer")].find((x) => Number(x.dataset.value) !== window.__app.screen.q.answer); return b?.dataset.value ?? null; }); if (v) await page.tap(`.answer[data-value="${v}"]`, { force: true }); else await page.evaluate(() => { const s = window.__app.screen; s.answer(s.q.answer + (s.q.max - s.q.min) / 4, null); }); ev.push(`[erreur ${q.f}]`); }
    else if (q.f === "lire" || q.f === "sauter") await page.tap(`.answer[data-value="${q.a}"]`, { force: true });
    else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); });
  }
  const rec = await page.evaluate(() => window.__app.session.rec);
  const passes = PASSER ? await page.evaluate(() => window.__passes) : 0;
  out.push(`niveau ${niveau}${PASSER ? ` (passer touché ${passes} fois)` : ""} : ${ev.join(" · ")} ; leçons ${JSON.stringify((rec.lecons ?? []).map((l) => l.id + " " + l.dureeS + "s"))}`);
  console.log(out.at(-1)); await context.close();
}
// lot 2, étape 6 : la notion du jour sur les additions, famille par famille (le parent a marqué connues les
// familles d'avant) : leçon d'entrée ou exemples guidés, correction après « je ne sais pas », après une erreur
for (const famille of [1, 3, 4, 5, 6]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (fam) => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); const { markFamilyKnown } = await import("./js/parent/depart.js"), m2 = await (await fetch("content/module2.json")).json(); for (let f = 1; f < fam; f++) await markFamilyKnown(s, m2, f); }, famille);
  await page.goto(url + "?nosw&cran=conseille&sans=echauffement&module=2&questions=4"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const open = () => page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked; }, null, { timeout: 240000, polling: 100 });
  const ev = []; let t = Date.now();
  if (PASSER) await page.evaluate(() => { window.__passes = 0; setInterval(() => { const b = document.querySelector(".skip"); if (b && getComputedStyle(b).visibility !== "hidden") { b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); window.__passes++; } }, 150); });
  const typeIn = async (n) => { for (const d of String(n)) await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.tap('.key[data-key="valider"]', { force: true }); };
  for (let k = 0; k < 5; k++) {
    await open(); const now = Date.now(), q = await page.evaluate(() => { const f = window.__app.facts.q; return { v: f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a + f.b, g: !!f.guide, appui: f.appui }; });
    ev.push(`${k === 0 ? "avant la 1re question (leçon, exemple)" : "attente"} ${((now - t) / 1000).toFixed(1)} s`);
    await page.waitForTimeout(800); t = Date.now();
    if (k === 2) { await page.evaluate(() => { const b = [...document.querySelectorAll(".nsp")].find((x) => getComputedStyle(x).visibility !== "hidden"); b?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); }); ev.push(`[NSP ${q.appui}]`); }
    else if (k === 3) { await typeIn(q.v === 9 ? 8 : q.v + 1); ev.push(`[erreur ${q.appui}]`); }
    else await typeIn(q.v);
  }
  const rec = await page.evaluate(() => window.__app.session.rec);
  const passes = PASSER ? await page.evaluate(() => window.__passes) : 0;
  out.push(`additions, famille ${rec.famille}${PASSER ? ` (passer touché ${passes} fois)` : ""} : ${ev.join(" · ")} ; leçons ${JSON.stringify((rec.lecons ?? []).map((l) => l.id + " " + l.dureeS + "s"))}`);
  console.log(out.at(-1)); await context.close();
}
await browser.close(); srv.close();
