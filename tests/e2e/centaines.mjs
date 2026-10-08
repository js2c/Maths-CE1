// LOT 2, ÉTAPE 8 : LES NOMBRES JUSQU'À 1 000 dans Chromium (1280 × 800, tactile, voix accélérée). La leçon L10
// (filet, chalut qui se remplit, trois-cents, trois-cent-sept et son zéro qui clignote), puis une séance par
// niveau : 9 (ligne de 0 à 1 000, petits chaluts des centaines ; une erreur E6 : la décomposition en chaluts,
// filets et poissons), 10, 11, 12 (la dictée : une erreur E7, 3007 pour 307… ; puis juste), 13 (estimer). Vérifie
// les réponses notées (formes, codes E6 et E7) et que chaque phrase dite a son fichier. Captures dans
// tests/e2e/out/centaines.
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const OUT = resolve("tests/e2e/out/centaines");
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const errors = [], misses = new Set();

async function open(query) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true })).newPage();
  page.on("pageerror", (e) => errors.push(e.stack ?? e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + `?nosw&voix=rapide&son=non&cran=conseille&${query}`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); window.__app.mascotte = "Pili"; });
  return page;
}
const done = async (page) => { for (const m of await page.evaluate(() => [...window.__app.voice.misses])) misses.add(m); await page.close(); };

// ---------------------------------------------------------------- la leçon L10
{
  const page = await open("lecon=L10");
  await page.tap(".play", { force: true });
  // une capture à chaque changement de la scène (filet, chalut, trois-cents, trois-cent-sept)
  let last = "", n = 0;
  while (!(await page.evaluate(() => !!window.__lecon)) && n < 30) {
    const sig = await page.evaluate(() => { const st = window.__app.lessons.p2?.st; return st ? JSON.stringify([st.filet, st.chalut, st.chaluts, st.nombre?.v]) : ""; });
    if (sig && sig !== last) { last = sig; n++; await page.waitForTimeout(150); await page.screenshot({ path: join(OUT, `1-l10-${String(n).padStart(2, "0")}.png`) }); }
    await page.waitForTimeout(60);
  }
  check(n >= 4, `L10 : ${n} états de la scène (filet, chalut qui se remplit, 300, 307)`);
  await page.waitForFunction(() => window.__lecon, null, { timeout: 60000 });
  check((await page.evaluate(() => window.__lecon)).vue, "L10 vue jusqu'au bout");
  await done(page);
}

// ---------------------------------------------------------------- une séance à un niveau donné
async function level(niveau, { format = null, wrong = null, shots = {}, questions = 3 } = {}) {
  const page = await open(`module=1&niveau=${niveau}${format ? `&format=${format}` : ""}&questions=${questions}&guides=1&sansLecon&sans=echauffement`);
  await page.tap(".play", { force: true });
  let k = 0;
  for (const until = Date.now() + 180000; Date.now() < until && k < questions + 3;) {
    const st = await page.evaluate(() => {
      const a = window.__app, l = a.screen, f = a.facts;
      if (document.querySelector(".tally")) return { end: true };
      if (f?.q?.dictee && f.resolve && !f.locked) return { kind: "ecrire", n: f.q.answer, guide: !!f.q.guide };
      if (l?.q && l.resolve && !l.locked) return { kind: l.q.format, n: l.q.answer, choices: l.q.choices, guide: !!l.q.guide };
      return null;
    });
    if (st?.end) break;
    if (!st) { await page.waitForTimeout(120); continue; }
    if (k === 0 && shots.question) await page.screenshot({ path: join(OUT, `${shots.question}.png`) });
    const bad = !st.guide && k >= 1 && wrong && !page.__wrongDone;
    if (st.kind === "ecrire") {
      const v = bad ? wrong(st.n) : st.n;
      for (const d of String(v)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); }
      if (bad && shots.tape) await page.screenshot({ path: join(OUT, `${shots.tape}.png`) });
      await page.tap('.key[data-key="valider"]', { force: true });
    } else if (st.choices) {
      const c = bad ? st.choices.find((x) => x.code === wrong) ?? st.choices.find((x) => x.value !== st.n) : st.choices.find((x) => x.value === st.n);
      await page.locator(`.answer[data-value="${c.value}"]`).first().dispatchEvent("pointerdown");
    } else {
      // placer / estimer : le poisson posé sur la bonne valeur (toucher la bande sous la ligne)
      await page.evaluate((n) => { const s = window.__app.screen; s.aimed = n; s.answer(n); }, st.n);
    }
    if (bad) { page.__wrongDone = true; await page.waitForFunction(() => window.__app.aidBoard?.used, null, { timeout: 8000 }).catch(() => {}); await page.waitForTimeout(250); if (shots.correction) await page.screenshot({ path: join(OUT, `${shots.correction}.png`) }); }
    await page.waitForTimeout(400); k++;
  }
  const rep = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 1));
  await done(page);
  return rep;
}
let rep = await level(9, { format: "lire", wrong: "E6", shots: { question: "5-niveau9-lire", correction: "6-niveau9-e6" } });
check(rep.some((r) => r.niveau === 9 && r.erreur === "E6"), "niveau 9 : une erreur E6 notée");
rep = await level(10, { format: "placer", shots: { question: "7-niveau10-placer" } });
check(rep.some((r) => r.niveau === 10 && r.forme === "placer" && r.juste), "niveau 10 : placer juste");
rep = await level(11, { format: "lire", shots: { question: "8-niveau11-lire" } });
check(rep.some((r) => r.niveau === 11 && r.juste), "niveau 11 : lire juste");
rep = await level(12, { wrong: (n) => Number(`${Math.floor(n / 100) * 100}${n % 100 || ""}`) === n ? Math.floor(n / 10) : Number(`${Math.floor(n / 100) * 100}${n % 100}`), shots: { question: "9-dictee", tape: "10-dictee-3007", correction: "11-dictee-correction" } });
check(rep.some((r) => r.niveau === 12 && r.forme === "ecrire" && ["E6", "E7"].includes(r.erreur)), `dictée : une erreur E6 ou E7 notée (${rep.filter((r) => r.niveau === 12).map((r) => `${r.question}:${r.donnee}:${r.erreur}`).join(", ")})`);
check(rep.some((r) => r.niveau === 12 && r.juste && !r.guide), "dictée : une réponse juste");
rep = await level(13, { shots: { question: "12-niveau13-estimer" } });
check(rep.some((r) => r.niveau === 13 && r.forme === "estimer"), "niveau 13 : estimer");
check(misses.size === 0, `chaque phrase dite a son fichier son${misses.size ? ` ; sans fichier : ${[...misses].join(" | ")}` : ""}`);
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
