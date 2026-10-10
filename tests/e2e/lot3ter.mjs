// LOT 3 TER (docs/SPEC-LOT3TER.md) : parcours des écrans que le lot change, en densité 2, toucher réel (hasTouch).
//   passer   : T1, « passer l'échauffement » : le bouton à chaque question de l'échauffement ; toucher, puis la voix, puis la
//              coche ; sans toucher pendant 5 s, reprise sur la même question avec la consigne redite ; la coche touchée, la
//              séance passe à la suite ; passé pendant une correction : rien ne continue après ; pictogramme distinct de « passer »
//   parent   : T2, la famille « ouverte par l'échauffement le … » dans l'espace parent
//   appui    : T3, l'appui long de 0,8 s sur chaque bouton recensé : étiquette, rien de lancé, étiquette disparue 0,5 s après
//              le lever ; toucher bref : lancé ; pavé et bulles-réponses : au premier contact (tableau : out/…/appui.json)
//   node tests/e2e/lot3ter.mjs [--seul passer,parent,appui] [--out dossier]
import { chromium } from "./navigateur.mjs";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/lot3ter"); mkdirSync(OUT, { recursive: true });
const seul = args.includes("--seul") ? args[args.indexOf("--seul") + 1].split(",") : null, part = (p) => !seul || seul.includes(p);
const textes = JSON.parse(readFileSync("app/content/textes.json", "utf8")), seance = JSON.parse(readFileSync("app/content/seance.json", "utf8"));
// une base d'un mois (des cartes dans l'album et le récif), fabriquée une fois
const SAVE = join(OUT, "base-un-mois.json");
if (part("appui") && !existsSync(SAVE)) execFileSync("node", ["tools/sauvegarde-test.mjs", "reel", "2", "4", "--sortie", SAVE], { stdio: "ignore" });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
export const open = async (q = "", prep = null, { width = 1280, height = 800 } = {}, prepArg = null) => {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  if (prep) await page.evaluate(prep, prepArg);
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
  // une famille ouverte par l'échauffement, vue dans l'espace parent (onglet Progression, tableau des familles)
  const { page, context, errors } = await open("", async () => {
    const s = window.__app.store, now = Date.now();
    await s.put("niveaux", { module: 2, ouvertes: [1, 2, 3], ouvertures: [{ famille: 1, date: now - 9e8 }, { famille: 2, date: now - 9e8 }, { famille: 3, date: now - 864e5, echauffement: true, seance: 4 }], acquises: [], trou: [], notion: [], lecons: [] });
    await s.setSetting("codeParent", "1234");
  });
  page.evaluate(() => window.__app.parent.open()).catch(() => {}); await page.waitForSelector(".pa-keys", { timeout: 10000 });
  for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
  await page.waitForTimeout(600); await page.click('.pa-tabs button:has-text("Progression")'); await page.waitForTimeout(800);
  const cells = await page.evaluate(() => [...document.querySelectorAll(".pa-fam td")].map((t) => t.innerText));
  check(cells.some((t) => /^ouverte par l'échauffement le \d\d\/\d\d$/.test(t)), `familles : « ouverte par l'échauffement le … » (${cells.filter((t) => /échauffement/.test(t)).join(" ; ") || "absent"})`);
  await page.evaluate(() => { document.querySelector(".pa-fam")?.scrollIntoView({ block: "start" }); document.querySelector(".pa-sheet")?.scrollBy?.(0, -90); });
  await page.waitForTimeout(300); await page.screenshot({ path: join(OUT, "t2-parent-familles.png") });
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- T3 : l'appui long sur chaque bouton recensé
// probe : appui tenu 800 ms (vrai toucher, Input.dispatchTouchEvent) : l'étiquette est visible, dans l'écran, rien n'est
// lancé ; au lever du doigt, rien n'est lancé et l'étiquette a disparu 0,5 s après ; puis (`brief`) un toucher bref (80 ms) :
// l'action est lancée. `first` : le pavé, l'action part au premier contact (l'étiquette en plus).
// « rien de lancé » : la signature de l'écran (étape, pause, écrans ouverts, boutons choisis, phrases dites, pavé…) ne change pas.
const rows = [];
const SIG = () => { const a = window.__app, vis = (s) => [...document.querySelectorAll(s)].filter((e) => getComputedStyle(e).visibility !== "hidden").length; return JSON.stringify({ e: a.session?.progress?.etape ?? null, f: a.session?.progress?.faites ?? null, p: !!a.enPause, ex: vis(".choix-ex"), t: vis(".choix-tuile"), ch: [...document.querySelectorAll(".chosen")].map((e) => e.getAttribute("aria-label")).join(), reef: !!a.reef?.open, album: !!a.album?.open, zone: a.album?.zone ?? null, leg: !!a.legendOpen, card: document.querySelectorAll(".card").length, flip: document.querySelectorAll(".card.flipped").length, said: (window.__said ?? []).length, pad: a.facts ? [a.facts.locked, !!a.facts.aide, a.facts.typed] : null, wp: !!a.warmupPending, skip: vis(".skip"), chk: vis(".check-warmup"), pearl: a.reef?.idx ?? null, lesson: a.lessons?.p ?? null, pk: vis(".keep.play") }); };
const touchAt = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); return [b.x + b.width / 2, b.y + b.height / 2]; };
const cdpOf = async (page) => (page.__cdp ??= await page.context().newCDPSession(page));
const press = async (page, sel, ms) => { const [x, y] = await touchAt(page, sel), cdp = await cdpOf(page); await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await page.waitForTimeout(ms); return async () => cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); };
// `freeze` : une aide ou une correction avance seule (voix de test rapide) : l'horloge et la voix de la séance sont arrêtées
// le temps de l'appui long, et seul compte l'état du bouton lui-même (`sig`)
async function probe(page, where, sel, name, { brief = null, first = false, label = true, shot = false, freeze = false, sig = null } = {}) {
  const S = sig ? () => page.evaluate(sig, sel) : () => page.evaluate(SIG);
  if (freeze) await page.evaluate(() => { window.__app.clock.pause(); window.__app.voice.pause(); });
  const s0 = await S(), release = await press(page, sel, 800);
  const during = await page.evaluate(() => { const l = document.querySelector(".etiquette:not([data-sortie])"); if (!l) return null; const r = l.getBoundingClientRect(); return { pour: l.dataset.pour, op: getComputedStyle(l).opacity, inside: r.x >= 0 && r.y >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 }; });
  const s1 = await S();
  if (shot) await page.screenshot({ path: join(OUT, `t3-${where}-${name}.png`.replace(/[^\w.\-àéèêç]+/g, "-")) });
  await release(); await page.waitForTimeout(80);
  const s2 = await S(), fading = await page.evaluate(() => document.querySelectorAll(".etiquette").length);
  await page.waitForTimeout(410);
  // 0,5 s après le lever du doigt : plus rien de visible (étiquette retirée, ou en fin de fondu à moins de 5 % d'opacité)
  const gone = await page.evaluate(() => [...document.querySelectorAll(".etiquette")].every((l) => Number(getComputedStyle(l).opacity) < 0.05)), s3 = await S();
  await page.waitForTimeout(150);
  if (freeze) await page.evaluate(() => { window.__app.clock.resume(); window.__app.voice.resume(); });
  const labOk = label ? !!during && during.inside && Number(during.op) > 0.9 : !during, still = first ? true : s1 === s0 && s2 === s0 && s3 === s0;
  const row = { where, name, sel, label: during ? "visible" : "aucune", dans: during?.inside ?? null, rien: first ? "premier contact" : still ? "rien de lancé" : "LANCÉ", disparue: gone, bref: null };
  check(labOk && still && gone, `${where} · ${name} : appui de 0,8 s, ${label ? "étiquette visible" : "pas d'étiquette"}${first ? " (le pavé : l'action au premier contact)" : ", rien de lancé"} ; au lever du doigt, ${first ? "" : "rien de lancé, "}étiquette disparue en 0,5 s${still ? "" : ` [${s0} → ${s3}]`}${labOk ? "" : ` [étiquette : ${JSON.stringify(during)}]`}`);
  void fading;
  if (brief) {
    const b0 = await page.evaluate(SIG), rel = await press(page, sel, 80); await rel(); await page.waitForTimeout(350);
    const ok = await brief(page, b0);
    row.bref = ok ? "lancé" : "RIEN";
    check(ok, `${where} · ${name} : toucher bref, action lancée`);
  }
  rows.push(row);
}
// « passer » (aide, correction) : le bouton toujours visible
const SKIPSIG = (s) => [...document.querySelectorAll(s)].filter((e) => getComputedStyle(e).visibility !== "hidden").length;
const changed = async (page, b0) => (await page.evaluate(SIG)) !== b0;

if (part("appui")) {
  // 1. l'accueil, « choisir », la légende, les tuiles
  // (lot « Correctifs : passage de l'échauffement aux voiliers », points 7 et 10 : plus d'étiquette sur les écrans de choix,
  // galets de l'accueil, exercices, niveaux ; la légende et le retour gardent la leur)
  {
    const { page, context, errors } = await open("&cran=conseille&sans=echauffement");
    await page.waitForSelector(".choisir"); await page.waitForTimeout(400);
    for (const [sel, n] of [[".play", "jouer"], [".leconskey", "les leçons"], [".reefkey", "le récif"], [".albumkey", "l'album"], [".choisir", "choisir"]]) await probe(page, "accueil", sel, n, { label: false, shot: n === "jouer", brief: n === "choisir" ? changed : null });
    await page.waitForSelector(".choix-ex"); await page.waitForTimeout(300);
    for (const ex of ["ligne", "additions", "calcul", "voiliers"]) await probe(page, "choisir", `.choix-ex[aria-label="${ex}"]`, ex, { label: false });
    for (const ex of ["ligne", "additions", "calcul", "voiliers"]) {
      await press(page, `.choix-ex[aria-label="${ex}"]`, 60).then((r) => r()); await page.waitForTimeout(450); await press(page, `.choix-ex[aria-label="${ex}"]`, 60).then((r) => r()); await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(500);
      const keys = await page.evaluate(() => [...document.querySelectorAll(".choix-tuile")].map((e) => e.dataset.key));
      for (const k of keys) await probe(page, `niveaux ${ex}`, `.choix-tuile[data-key="${k}"]`, k, { label: false, shot: (ex === "calcul" && k === "7") || (ex === "ligne" && k === "1") });
      await probe(page, `niveaux ${ex}`, ".legende", "légende", { brief: async (p) => !!(await p.evaluate(() => window.__app.legendOpen)) });
      await probe(page, `niveaux ${ex}`, ".legende-fermer", "fermer la légende", { brief: async (p) => !(await p.evaluate(() => window.__app.legendOpen)) });
      await probe(page, `niveaux ${ex}`, ".choix-retour", "retour aux exercices", { brief: async (p) => (await p.locator(".choix-ex").count()) === 5 }); // (lot « Multiplication » : cinq exercices)
      await page.waitForTimeout(300);
    }
    // une tuile : toucher bref, lancée (la ligne, niveau 3), puis le sélecteur de difficulté
    // (lot « Correctifs de la tablette » : deux touchers pour l'exercice, et pour la tuile : le toucher bref la sélectionne, le second la lance)
    await press(page, '.choix-ex[aria-label="ligne"]', 60).then((r) => r()); await page.waitForTimeout(450); await press(page, '.choix-ex[aria-label="ligne"]', 60).then((r) => r()); await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(400);
    await probe(page, "niveaux ligne", '.choix-tuile[data-key="3"]', "3 (deux touchers brefs)", { label: false, brief: async (p) => { await p.waitForTimeout(450); await press(p, '.choix-tuile[data-key="3"]', 60).then((r) => r()); await p.waitForTimeout(700); return (await p.locator(".cran").count()) > 0 || !!(await p.evaluate(() => window.__app.session)); } });
    check(!errors.length, `accueil et « choisir » : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 2. le sélecteur de difficulté, l'échauffement (pavé, coquillage, je ne sais pas, réécouter, passer l'échauffement, coche, maison), la correction, l'accueil en pause
  {
    const { page, context, errors } = await open("&module=1&sansLecon&faits=10");
    await press(page, ".play", 60).then((r) => r()); await page.waitForSelector(".cran", { timeout: 30000 }); await page.waitForTimeout(600);
    for (const c of ["facile", "conseille", "dur", "tresdur"]) await probe(page, "sélecteur", `.cran[aria-label="${c}"]`, c, { shot: c === "dur", brief: c === "dur" ? async (p, b0) => (await p.evaluate(() => document.querySelector(".cran.chosen")?.getAttribute("aria-label"))) === "dur" : null });
    await probe(page, "sélecteur", ".cran-ok", "valider ce choix", { brief: async (p) => { await p.waitForTimeout(500); return !(await p.locator(".cran").count()); } });
    // l'échauffement : une question qui a une aide (pas « 4 + 0 »)
    await page.waitForFunction(() => window.__app.session?.progress.etape === "echauffement", null, { timeout: 30000 });
    for (;;) { await nextQ(page); if (!(await page.evaluate(() => window.__app.facts.q.base))) break; await answer(page, true); await page.waitForTimeout(400); }
    await page.waitForTimeout(500);
    await probe(page, "échauffement", ".mascotte-tap", "réécouter (la mascotte)", { shot: true, brief: async (p, b0) => JSON.parse(await p.evaluate(SIG)).said > JSON.parse(b0).said });
    await probe(page, "échauffement", '.key[data-key="effacer"]', "effacer", { first: true });
    await probe(page, "échauffement", '.key[data-key="valider"]', "coche du pavé", { first: true });
    // un chiffre : au premier contact
    { const b0 = JSON.parse(await page.evaluate(SIG)), rel = await press(page, '.key[data-key="3"]', 30); const t = await page.evaluate(() => window.__app.facts.typed); await rel(); check(t === `${b0.pad[2]}3`, `échauffement · un chiffre du pavé : tapé au premier contact (« ${t} »)`); rows.push({ where: "échauffement", name: "chiffre 3", sel: '.key[data-key="3"]', label: "aucune", rien: "premier contact", disparue: true, bref: "tapé" });
      const rel2 = await press(page, '.key[data-key="effacer"]', 30); await rel2(); await page.waitForTimeout(200); }
    await probe(page, "échauffement", ".skip-warmup", "passer l'échauffement", { shot: true });
    await probe(page, "échauffement", ".session-home", "maison (pause)", { shot: true });
    await probe(page, "échauffement", ".help", "coquillage d'aide", { brief: async (p) => { const r = !!(await p.evaluate(() => window.__app.facts.aide)); return r; } });
    await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(300);
    await probe(page, "aide", ".skip", "passer (l'aide)", { freeze: true, sig: SKIPSIG, brief: async (p) => { await p.waitForTimeout(400); return !(await p.evaluate(() => [...document.querySelectorAll(".skip")].some((e) => getComputedStyle(e).visibility !== "hidden"))); } });
    await nextQ(page); await page.waitForTimeout(400);
    await probe(page, "échauffement", ".nsp", "je ne sais pas", { brief: async (p) => { await p.evaluate(() => { window.__app.clock.pause(); window.__app.voice.pause(); }); return !!(await p.evaluate(() => window.__app.facts.locked)); } });
    await page.waitForSelector(".skip", { timeout: 10000 });
    await probe(page, "correction", ".skip", "passer (la correction)", { shot: true, freeze: true, sig: SKIPSIG, brief: async (p) => { await p.waitForTimeout(400); return !(await p.evaluate(() => [...document.querySelectorAll(".skip")].some((e) => getComputedStyle(e).visibility !== "hidden"))); } });
    // passer l'échauffement : la coche
    await nextQ(page); await page.waitForTimeout(300);
    await press(page, ".skip-warmup", 80).then((r) => r()); await page.waitForSelector(".check-warmup", { state: "visible" }); await page.waitForTimeout(200);
    await probe(page, "échauffement", ".check-warmup", "coche « passer l'échauffement »", { shot: true });
    // la coche disparaît après 5 s : la reprise, puis la maison (toucher bref : la pause)
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".check-warmup")).visibility === "hidden", null, { timeout: 10000 }); await page.waitForTimeout(500);
    await probe(page, "échauffement", ".session-home", "maison (toucher bref)", { brief: async (p) => { await p.waitForTimeout(400); return !!(await p.evaluate(() => window.__app.enPause)); } });
    await page.waitForTimeout(600);
    for (const [sel, n] of [[".keep.choisir", "choisir"], [".keep.reefkey", "le récif"], [".keep.albumkey", "l'album"], [".keep.play", "continuer"]]) await probe(page, "accueil en pause", sel, n, { shot: n === "continuer", brief: n === "continuer" ? async (p) => { await p.waitForTimeout(300); return !(await p.evaluate(() => window.__app.enPause)); } : null });
    check(!errors.length, `séance : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 3. la ligne graduée : « je ne sais pas » ; les bulles-réponses répondent au premier contact
  {
    const { page, context, errors } = await open("&cran=conseille&choix=1:3&sans=echauffement&sansLecon&guides=0&format=lire");
    await press(page, ".play", 60).then((r) => r());
    await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, null, { timeout: 30000 }); await page.waitForTimeout(500);
    await probe(page, "ligne", ".nsp", "je ne sais pas");
    const v = await page.evaluate(() => { window.__q0 = window.__app.screen.q; return window.__app.screen.q.answer; }), rel = await press(page, `.answer[data-value="${v}"]`, 150);
    const locked = await page.evaluate(() => window.__app.screen.locked || window.__app.screen.q !== window.__q0); await page.waitForTimeout(750); await rel();
    check(locked, "ligne · bulle-réponse : la réponse part au premier contact (appui de 0,9 s)"); rows.push({ where: "ligne", name: "bulle-réponse", sel: ".answer", label: "aucune", rien: "premier contact", disparue: true, bref: "réponse" });
    check(!errors.length, `ligne : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 4. une leçon : rejouer, passer
  {
    const { page, context, errors } = await open("&lecon=L1");
    await press(page, ".play", 60).then((r) => r()); await page.waitForSelector(".lessonkey.rejouer", { timeout: 30000 }); await page.waitForTimeout(1500);
    const LSIG = () => JSON.stringify([window.__app.lessons?.p, window.__lecon, [...document.querySelectorAll(".lessonkey")].filter((e) => getComputedStyle(e).visibility !== "hidden").length]);
    await probe(page, "leçon", ".lessonkey.rejouer", "revoir la leçon", { shot: true, freeze: true, sig: LSIG });
    await probe(page, "leçon", ".skip.lessonkey", "passer la leçon", { freeze: true, sig: LSIG, brief: async (p) => { await p.waitForFunction(() => window.__lecon !== undefined, null, { timeout: 15000 }).catch(() => {}); return !!(await p.evaluate(() => window.__lecon?.passee)); } });
    check(!errors.length, `leçon : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 5. l'album et le récif (une base avec des cartes gagnées), la carte en grand
  {
    const dump = JSON.parse(readFileSync(SAVE, "utf8"));
    const { page, context, errors } = await open("&sans=echauffement", async (d) => { await window.__app.store.restore(d, ["reglages"]); }, {}, dump);
    await page.waitForSelector(".albumkey"); await page.waitForTimeout(300);
    await press(page, ".albumkey", 60).then((r) => r()); await page.waitForSelector(".album-tab"); await page.waitForTimeout(800);
    const tabs = await page.evaluate(() => [...document.querySelectorAll(".album-tab")].map((e) => e.getAttribute("aria-label")));
    for (const t of tabs) await probe(page, "album", `.album-tab[aria-label="${t}"]`, `onglet ${t}`, { shot: t === tabs[0] });
    await probe(page, "album", ".album-card.back", "carte à découvrir", { shot: true });
    await probe(page, "album", ".album-card.got", "une carte gagnée", { brief: async (p) => { await p.waitForTimeout(900); return (await p.locator(".card").count()) > 0; } });
    await page.waitForTimeout(600);
    await probe(page, "carte en grand", ".card", "retourner la carte", { shot: true, brief: async (p) => (await p.locator(".card.flipped").count()) > 0 });
    await probe(page, "carte en grand", ".bubble.check", "c'est bon", { brief: async (p) => { await p.waitForTimeout(500); return !(await p.locator(".card").count()); } });
    await probe(page, "album", ".homekey:not(.session-home)", "maison", { brief: async (p) => { await p.waitForTimeout(800); return !(await p.evaluate(() => window.__app.album.open)); } });
    await page.waitForSelector(".reefkey"); await page.waitForTimeout(300);
    await press(page, ".reefkey", 60).then((r) => r()); await page.waitForFunction(() => window.__app.reef?.open, null, { timeout: 15000 }); await page.waitForTimeout(1500);
    await probe(page, "récif", ".albumkey", "l'album", { shot: true });
    if (await page.locator(".reef-pearl").count()) await probe(page, "récif", ".reef-pearl", "perle d'une zone");
    await probe(page, "récif", ".homekey:not(.session-home)", "maison", { brief: async (p) => { await p.waitForTimeout(800); return !(await p.evaluate(() => window.__app.reef.open)); } });
    check(!errors.length, `album et récif : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // 6. (le premier lancement n'a plus de choix du nom : lot « Mascotte »)
  // 7. la récompense : le coquillage, puis « c'est bon » ; « Encore ! » ensuite
  {
    const { page, context, errors } = await open("&etoiles=75&cran=conseille&choix=1:1&sans=echauffement,defi&sansLecon&questions=1&guides=0");
    await press(page, ".play", 60).then((r) => r());
    // les questions de la notion du jour : répondues juste, directement (le moteur, sans toucher)
    for (let i = 0; i < 40 && !(await page.locator(".shelltap").count()); i++) { await page.evaluate(() => { const s = window.__app.screen; if (s?.resolve && !s.locked && s.q) { s.resolve({ q: s.q, value: s.q.answer, ok: true, code: null, ms: 3000, listens: 1 }); s.resolve = null; } }); await page.waitForTimeout(700); }
    await page.waitForSelector(".shelltap", { timeout: 60000 }); await page.waitForTimeout(400);
    await probe(page, "récompense", ".shelltap", "ouvrir le coquillage", { shot: true, brief: async (p) => { await p.waitForTimeout(300); return !(await p.locator(".shelltap").count()); } });
    await page.waitForSelector(".bubble.check.invite", { timeout: 30000 }); await page.waitForTimeout(300);
    await probe(page, "récompense", ".bubble.check.invite", "c'est bon", { brief: async (p) => { await p.waitForTimeout(500); return !(await p.locator(".bubble.check.invite").count()); } });
    await page.waitForSelector(".again", { timeout: 60000 }).catch(() => {}); await page.waitForTimeout(600);
    if (await page.locator(".again").count()) await probe(page, "accueil (séance faite)", ".again", "Encore !", { label: false, shot: true, brief: async (p) => { await p.waitForTimeout(800); return (await p.locator(".choix-ex, .cran").count()) > 0; } });
    else check(false, "« Encore ! » introuvable après la récompense");
    check(!errors.length, `récompense : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  writeFileSync(join(OUT, "appui.json"), JSON.stringify(rows, null, 1));
  console.log(`\n${rows.length} boutons essayés ; étiquette visible sur ${rows.filter((r) => r.label === "visible").length} ; lancés par un appui long : ${rows.filter((r) => r.rien === "LANCÉ").length}`);
}

await browser.close(); srv.close();
if (fail.length) { console.log(`\n${fail.length} échec(s)`); process.exit(1); }
console.log("\ntout est bon");
