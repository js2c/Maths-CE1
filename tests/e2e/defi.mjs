// LOT 2, ÉTAPE 7 : LE DÉFI RECORD dans Chromium (1280 × 800, tactile, voix accélérée). La base est préparée pour
// que le défi ait lieu (5 séances terminées, 10 faits en boîte 3 ou plus) ; l'échauffement et la notion du jour
// sont sautés (?sans=…). Premier défi : consigne, la bulle qui se vide, des perles, une erreur (la bonne réponse
// montrée, le temps continue), premier record et ses 5 étoiles ; second défi avec un record à battre (le
// drapeau). Vérifie la base (réponses `defi`, record, séance) et que chaque phrase dite a son fichier.
// Captures dans tests/e2e/out/defi.
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const OUT = resolve("tests/e2e/out/defi");
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const DAY = 86400000;

async function run(n, { record = null, answers = 12, wrongAt = 3 } = {}) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true })).newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const shot = (k) => page.screenshot({ path: join(OUT, `${n}-${k}.png`) });
  await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&sans=echauffement,notion"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async ({ record, DAY }) => {
    const s = window.__app.store, now = Date.now(); await s.setSetting("mascotte", "Pili"); window.__app.mascotte = "Pili";
    for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] });
    const faits = ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"];
    for (const [i, k] of faits.entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); }
    if (record != null) await s.put("recompenses", { id: "defi", record, date: now - 3 * DAY, scores: [{ t: now - 3 * DAY, score: record }] });
  }, { record, DAY });
  await page.reload(); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  await page.tap(".play", { force: true });
  await page.waitForFunction(() => window.__app.challenge && window.__app.facts?.resolve && !window.__app.facts.locked, null, { timeout: 60000 });
  const t0 = Date.now();
  await shot("1-debut");
  let k = 0, sawWrong = false;
  while (k < answers) {
    const q = await page.evaluate(() => { const s = window.__app.facts; return s?.resolve && !s.locked && s.defi ? { a: s.q.a, b: s.q.b, forme: s.q.forme ?? "directe" } : null; });
    if (!q) { if (!(await page.evaluate(() => !!window.__app.challenge))) break; await page.waitForTimeout(50); continue; }
    const exp = q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.a + q.b, wrong = k === wrongAt;
    for (const d of String(wrong ? (exp === 9 ? 8 : exp + 1) : exp)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); }
    await page.tap('.key[data-key="valider"]', { force: true });
    if (wrong) { await page.waitForTimeout(250); await shot("2-erreur"); sawWrong = true; }
    k++;
    if (k === 7) { await page.waitForTimeout(200); await shot("3-perles"); }
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(Math.max(0, 30000 - (Date.now() - t0))); await shot("4-bulle-a-moitie");
  await page.waitForFunction(() => window.__app.facts?.locked && window.__app.challenge?.f === window.__app.challenge?.frames - 1, null, { timeout: 45000 });
  const dur = (Date.now() - t0) / 1000;
  await page.waitForTimeout(300); await shot("5-fin");
  // (lot 3 bis, B6) la fin : le pavé rangé, les perles jusqu'au score, le grand drapeau du record, la phrase du résultat
  await page.waitForSelector(".defi-drapeau", { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(600); await shot("5b-drapeau");
  const fin = await page.evaluate(() => ({ drapeau: !!document.querySelector(".defi-drapeau"), pave: [...document.querySelectorAll(".key")].some((k) => getComputedStyle(k).visibility !== "hidden"), ardoise: getComputedStyle(document.querySelector(".slate")).visibility }));
  check(fin.drapeau && !fin.pave && fin.ardoise === "hidden", "fin du défi : pavé et ardoise rangés, le drapeau du record planté");
  await page.waitForSelector(".tally", { timeout: 60000 }); await page.waitForTimeout(600); await shot("6-recompense");
  const db = await page.evaluate(async () => { const s = window.__app.store; return { se: (await s.all("seances")).at(-1), rep: await s.all("reponses"), rec: await s.get("recompenses", "defi") }; });
  const rep = db.rep.filter((r) => r.defi && r.seance === db.se.id);
  check(Math.abs(dur - 60) < 6, `la bulle se vide en une minute environ (${dur.toFixed(1)} s)`);
  check(sawWrong && rep.some((r) => !r.juste), "une erreur notée ; le défi continue");
  check(db.se.defi && db.se.defi.score === rep.filter((r) => r.juste).length, `score ${db.se.defi?.score} = bonnes réponses notées (${rep.length} questions)`);
  check(!db.se.etapes.find((e) => e.id === "defi")?.sautee, "l'étape « defi » a eu lieu");
  if (record == null) check(db.se.defi.nouveauRecord && db.rec.record === db.se.defi.score, `premier record : ${db.rec.record}`);
  else check(db.se.defi.nouveauRecord === db.se.defi.score > record && db.rec.record === Math.max(record, db.se.defi.score), `record ${record} → ${db.rec.record}`);
  const dit = await page.evaluate(() => window.__said.filter((t) => /record|Presque|perle/i.test(t)).join(" | "));
  check(record == null || db.se.defi.score > record ? /Nouveau record ! (\d+ perles|Une perle) !/.test(dit) : db.se.defi.score === record ? /Record égalé/.test(dit) : /Presque ! Tu as fait/.test(dit), `la fin du défi est dite (« ${dit} »)`);
  const voix = await page.evaluate(() => [...window.__app.voice.misses]);
  check(voix.length === 0, `chaque phrase dite a son fichier son${voix.length ? ` ; sans fichier : ${voix.join(" | ")}` : ""}`);
  check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
  await page.close();
}
await run("a", {});
await run("b", { record: 20, answers: 9, wrongAt: 2 });
await browser.close(); srv.close();
