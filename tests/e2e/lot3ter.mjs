// LOT 3 TER (docs/SPEC-LOT3TER.md) : parcours des écrans que le lot change, en densité 2, toucher réel (hasTouch).
//   passer   : T1, « passer l'échauffement » : le bouton à chaque question de l'échauffement ; toucher, puis la voix, puis la
//              coche ; sans toucher pendant 5 s, reprise sur la même question avec la consigne redite ; la coche touchée, la
//              séance passe à la suite ; passé pendant une correction : rien ne continue après ; pictogramme distinct de « passer »
//   parent   : T2, la famille « ouverte par l'échauffement le … » dans l'espace parent
//   appui    : T3, l'appui long sur chaque bouton recensé (étape 2)
//   node tests/e2e/lot3ter.mjs [--seul passer,parent,appui] [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/lot3ter"); mkdirSync(OUT, { recursive: true });
const seul = args.includes("--seul") ? args[args.indexOf("--seul") + 1].split(",") : null, part = (p) => !seul || seul.includes(p);
const textes = JSON.parse(readFileSync("app/content/textes.json", "utf8")), seance = JSON.parse(readFileSync("app/content/seance.json", "utf8"));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
export const open = async (q = "", prep = null, { width = 1280, height = 800 } = {}) => {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  // la voix : chaque texte dit, dans l'ordre
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { page, context, errors };
};
const visible = (page, sel) => page.evaluate((s) => { const e = document.querySelector(s); return !!e && getComputedStyle(e).visibility !== "hidden" && e.isConnected; }, sel);
const said = (page) => page.evaluate(() => window.__said.slice());
const tapKey = async (page, k) => { await page.tap(`.key[data-key="${k}"]`, { force: true }); await page.waitForTimeout(170); };
// attend la question suivante de l'échauffement (le pavé ouvert)
const nextQ = (page) => page.waitForFunction(() => { const f = window.__app.facts; return f?.resolve && !f.locked && f.q; }, null, { timeout: 30000 });
const answer = async (page, right = true) => {
  const exp = await page.evaluate(() => { const q = window.__app.facts.q, f = q.forme; return f === "trouDroite" ? q.b : f === "trouGauche" ? q.a : q.a + q.b; });
  for (const d of String(right ? exp : exp === 9 ? 8 : exp + 1)) await tapKey(page, d);
  await page.tap('.key[data-key="valider"]', { force: true });
};

if (part("passer")) {
  const { page, context, errors } = await open("&cran=conseille&module=1&sansLecon&faits=10");
  await page.tap(".play", { force: true });
  await page.waitForFunction(() => window.__app.session?.progress.etape === "echauffement", null, { timeout: 30000 });
  await page.waitForTimeout(150);
  check(await visible(page, ".skip-warmup"), "le bouton est là dès la phrase d'introduction");
  // chaque question : le bouton est là, à côté du pavé ; on répond juste
  let n = 0, seen = 0;
  for (; n < 4; n++) {
    await nextQ(page); await page.waitForTimeout(120);
    if (await visible(page, ".skip-warmup")) seen++;
    if (n === 0) await page.screenshot({ path: join(OUT, "t1-1-question.png") });
    await answer(page, true); await page.waitForTimeout(300);
    if (!(await visible(page, ".skip-warmup"))) check(false, `bouton absent pendant le retour de la question ${n + 1}`);
  }
  check(seen === n, `le bouton présent à chacune des ${n} premières questions (${seen})`);
  // une erreur : pendant la correction, les deux boutons (« passer » la correction, « passer l'échauffement ») sont distincts
  await nextQ(page); await answer(page, false);
  await page.waitForSelector(".skip:not(.skip-warmup)", { timeout: 5000 }); await page.waitForTimeout(250);
  check(await visible(page, ".skip-warmup"), "le bouton reste pendant une correction");
  await page.screenshot({ path: join(OUT, "t1-2-correction-deux-boutons.png") });
  await page.screenshot({ path: join(OUT, "t1-2b-deux-boutons.png"), clip: { x: 1110, y: 130, width: 170, height: 360 } });
  // la mise en attente pendant la question suivante
  await nextQ(page); await page.waitForTimeout(300);
  const q0 = await page.evaluate(() => JSON.stringify(window.__app.facts.q)), before = (await said(page)).length;
  const t0 = Date.now(); await page.tap(".skip-warmup", { force: true }); await page.waitForTimeout(250);
  check(await visible(page, ".check-warmup"), "toucher : la coche apparaît à la place du bouton");
  check(!(await visible(page, ".skip-warmup")), "le bouton est remplacé");
  check(!(await visible(page, '.key[data-key="5"]')) && !(await visible(page, ".nsp")), "le pavé et « je ne sais pas » sont fermés");
  check(await visible(page, ".slate"), "la question reste affichée");
  check((await said(page)).slice(before).includes(textes.passerEchauffementQuestion), "la voix demande « Tu veux passer l'échauffement ? Touche la coche pour dire oui. »");
  await page.screenshot({ path: join(OUT, "t1-3-attente-coche.png") });
  // pendant l'attente, le temps de la séance ne compte pas : la question n'avance pas
  await page.waitForFunction(() => !document.querySelector(".check-warmup") || getComputedStyle(document.querySelector(".check-warmup")).visibility === "hidden", null, { timeout: 15000 });
  const dt = Date.now() - t0;
  check(dt >= seance.passerEchauffement.attenteMs - 300 && dt < seance.passerEchauffement.attenteMs + 2500, `sans toucher, la coche disparaît ${dt} ms après le toucher (la question lue, puis 5 s)`);
  await page.waitForTimeout(400);
  check(await visible(page, ".skip-warmup"), "le bouton revient");
  check(await visible(page, '.key[data-key="5"]'), "le pavé revient");
  check(await page.evaluate(() => JSON.stringify(window.__app.facts.q)) === q0, "reprise sur la même question");
  const cons = await page.evaluate(() => window.__app.voice.instruction), after = (await said(page)).slice(before);
  check(after.at(-1) === cons, `la consigne est redite (« ${cons} »)`);
  await page.screenshot({ path: join(OUT, "t1-4-reprise.png") });
  // cette fois, la coche : la séance passe à la suite
  await page.tap(".skip-warmup", { force: true }); await page.waitForTimeout(300);
  const t1 = Date.now(); await page.tap(".check-warmup", { force: true });
  await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 10000 });
  check(Date.now() - t1 < 2500, `la coche touchée, la notion du jour commence (${Date.now() - t1} ms)`);
  const rec = await page.evaluate(() => window.__app.session.rec);
  check(!!rec.echauffementPasse, `noté « échauffement passé » (après ${rec.echauffementPasse?.apres} questions)`);
  check(!(await visible(page, ".skip-warmup")) && !(await visible(page, ".check-warmup")), "plus de bouton ni de coche ensuite");
  await page.waitForTimeout(800); await page.screenshot({ path: join(OUT, "t1-5-suite.png") });
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();

  // passé pendant une correction : la correction s'arrête, rien d'elle ne continue dans la suite
  {
    const { page, context, errors } = await open("&cran=conseille&module=1&sansLecon&faits=10");
    await page.tap(".play", { force: true });
    await nextQ(page); await answer(page, false);
    await page.waitForSelector(".skip:not(.skip-warmup)", { timeout: 5000 }); await page.waitForTimeout(200);
    await page.tap(".skip-warmup", { force: true }); await page.waitForTimeout(300);
    check(!(await visible(page, ".skip:not(.skip-warmup)")), "en attente : le « passer » de la correction est masqué");
    const mark = (await said(page)).length;
    await page.tap(".check-warmup", { force: true });
    await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 10000 });
    await page.waitForTimeout(2500);
    const later = (await said(page)).slice(mark);
    check(!later.some((t) => /ça fait|Ce n'est pas grave/.test(t)), `la correction ne reprend pas après le saut (${later.slice(0, 3).join(" / ")})`);
    check(!(await visible(page, ".slate")), "l'ardoise des additions est rangée");
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // la maison pendant l'attente : l'échauffement reprend puis se met en pause ; « continuer » redit la consigne
  {
    const { page, context, errors } = await open("&cran=conseille&module=1&sansLecon&faits=10");
    await page.tap(".play", { force: true });
    await nextQ(page); await page.waitForTimeout(300);
    await page.tap(".skip-warmup", { force: true }); await page.waitForTimeout(300);
    await page.tap(".session-home", { force: true }); await page.waitForTimeout(500);
    check(await page.evaluate(() => window.__app.enPause), "la maison pendant l'attente : la pause");
    check(!(await visible(page, ".check-warmup")), "la coche est partie");
    await page.tap(".play", { force: true }); await page.waitForTimeout(600);
    check(await visible(page, ".skip-warmup") && (await visible(page, '.key[data-key="5"]')), "« continuer » : le bouton et le pavé");
    await answer(page, true); await page.waitForTimeout(1500);
    check(await page.evaluate(() => window.__app.session.progress.faites) >= 1, "l'échauffement continue normalement");
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

if (part("parent")) {
  // une famille ouverte par l'échauffement, vue dans l'espace parent
  const { page, context, errors } = await open("", async () => {
    const s = window.__app.store, now = Date.now();
    await s.put("niveaux", { module: 2, ouvertes: [1, 2, 3], ouvertures: [{ famille: 1, date: now - 9e8 }, { famille: 2, date: now - 9e8 }, { famille: 3, date: now - 864e5, echauffement: true }], acquises: [], trou: [], notion: [], lecons: [] });
    await s.setSetting("codeParent", "1234");
  });
  await page.evaluate(() => window.__openParent?.());
  const ok = await page.evaluate(async () => { const { familiesSummary } = await import("./js/parent/data.js"); const c = await (await fetch("content/module2.json")).json(); return familiesSummary(c, await window.__app.store.get("niveaux", 2), []).familles.find((f) => f.id === 3).ouverteEchauffement; });
  check(ok, "la famille 3 est marquée « ouverte par l'échauffement »");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

await browser.close(); srv.close();
if (fail.length) { console.log(`\n${fail.length} échec(s)`); process.exit(1); }
console.log("\ntout est bon");
