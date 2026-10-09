// LOT 3 BIS (docs/SPEC-LOT3BIS.md) : parcours et captures des écrans que le lot change, du point de vue de l'enfant.
// Étape 1 : les amis de 10 à trou (le cadre de 10 d'emblée au cran « plus facile », les deux formes à trou qui alternent),
// les maisons de 8 et 9 (deux questions sur trois à trou), le calcul rapide « très dur » au niveau 2 (la forme directe,
// puis le trou sur le nombre de départ, « Combien plus 10 ? Ça fait 57. »). Captures en densité 2 (tests/e2e/out/lot3bis).
//   node tests/e2e/lot3bis.mjs [--out dossier] [--seulement additions,calcul]
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/lot3bis"); mkdirSync(OUT, { recursive: true });
const only = args.includes("--seulement") ? args[args.indexOf("--seulement") + 1].split(",") : null, run = (k) => !only || only.includes(k);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const open = async (q = "", prep = null) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); await window.__app.store.setSetting("echauffement", false); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { page, context, errors };
};
const shot = (page, n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const waitQ = (page) => page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 60000 });
const type = async (page, n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
const cur = (page) => page.evaluate(() => { const q = window.__app.facts.q; return { a: q.a, op: q.op, b: q.b, n: q.n ?? q.a + q.b, forme: q.forme, aide: !!q.aideDEmblee, appui: q.appui, niveau: q.niveau, guide: !!q.guide, pont: !!q.pont }; });
const answerOf = (q) => (q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.n);

// ---------------------------------------------------------------- étape 1 : amis de 10 et maisons
if (run("additions")) {
  // famille 3, cran « plus facile », leçon L5 déjà vue : le cadre de 10 d'emblée, à trou
  const { page, context, errors } = await open("&cran=facile&choix=2:3", async () => { await window.__app.store.put("niveaux", { module: 2, ouvertes: [1, 2, 3], ouvertures: [], acquises: [1, 2], trou: [], notion: [3], lecons: ["L4", "L5"] }); });
  await page.tap(".play", { force: true });
  const formes = [];
  for (let i = 0, k = 0; i < 9; i++) {
    // (une question nouvelle : l'aide d'emblée est montrée avant que le pavé revienne)
    await page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.q !== window.__lastQ; }, null, { timeout: 60000 });
    await page.evaluate(() => { window.__lastQ = window.__app.facts.q; });
    const q = await cur(page); if (q.guide) { await waitQ(page); await type(page, answerOf(q)); await page.waitForTimeout(400); continue; }
    if (q.a + q.b === 10) formes.push(q.forme);
    if (k++ === 0) { await page.waitForTimeout(900); await shot(page, "1-amis10-facile-cadre"); check(q.forme !== "directe" && q.aide && q.appui === "cadre", `amis de 10, plus facile : à trou, cadre d'emblée (${q.a}, ${q.b}, ${q.forme})`); }
    await waitQ(page); if (k === 2) { await page.waitForTimeout(300); await shot(page, "2-amis10-facile-ardoise"); }
    await type(page, answerOf(q)); await page.waitForTimeout(500);
  }
  check(formes.length >= 5 && formes.every((f) => f !== "directe"), `amis de 10 : toutes à trou (${formes.join(" ")})`);
  const fresh = formes; check(fresh.every((f, i) => !i || f !== fresh[i - 1]), "les deux formes à trou alternent");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
if (run("additions")) {
  // famille 5, cran conseillé : deux questions sur trois à trou, la maison
  const { page, context, errors } = await open("&cran=conseille&choix=2:5", async () => { await window.__app.store.put("niveaux", { module: 2, ouvertes: [1, 2, 3, 4, 5], ouvertures: [], acquises: [1, 2, 3, 4], trou: [], notion: [5], lecons: ["L4", "L5", "L6"] }); });
  await page.tap(".play", { force: true });
  const f = [];
  for (let i = 0; i < 9; i++) {
    await waitQ(page); const q = await cur(page); if (q.guide) { await type(page, answerOf(q)); await page.waitForTimeout(400); continue; }
    if (q.a + q.b >= 8 && q.a + q.b <= 9) f.push(q.forme);
    if (f.length === 2) { await page.waitForTimeout(300); await shot(page, "3-maisons89-question"); }
    await type(page, answerOf(q)); await page.waitForTimeout(500);
  }
  check(f.filter((x) => x !== "directe").length >= Math.floor((f.length * 2) / 3) - 1 && f.includes("directe"), `maisons de 8 et 9 : deux sur trois à trou (${f.join(" ")})`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- étape 1 : calcul rapide « très dur », trou sur le départ
if (run("calcul")) {
  const { page, context, errors } = await open("&cran=tresdur&choix=3:2", async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [], obtenus: [], vus: { 2: 10 }, fenetres: {}, lecons: ["L7"] }); });
  await page.tap(".play", { force: true });
  const f = [], rep = new Set();
  for (let i = 0; i < 6; i++) {
    await waitQ(page); const q = await cur(page); f.push(q.forme); rep.add(answerOf(q));
    if (q.forme === "trouGauche" && !f.slice(0, -1).includes("trouGauche")) {
      await page.waitForTimeout(400); await shot(page, "4-calcul-tres-dur-depart");
      const s = await page.evaluate(() => window.__said.at(-1)); check(/^Combien (plus|moins) 10 \? Ça fait \d+\.$/.test(s), `la consigne : « ${s} »`);
      // une erreur : la bonne réponse entourée
      await type(page, q.n); await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(1500); await shot(page, "5-calcul-tres-dur-depart-correction");
      await page.tap(".skip", { force: true, timeout: 2000 }).catch(() => {}); continue;
    }
    await type(page, answerOf(q)); await page.waitForTimeout(500);
  }
  check(f.filter((x) => x === "trouGauche").length >= 2 && f.filter((x) => x === "directe").length >= 2 && !f.includes("trouDroite"), `niveau 2, très dur : directe et trou sur le départ en alternance (${f.join(" ")})`);
  check(rep.size >= 5, `réponses variées (${[...rep].join(", ")})`);
  const r = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((x) => x.module === 3 && x.forme === "trouGauche").map((x) => `${x.question} → ${x.attendue}`));
  check(r.length && r.every((x) => /^\? [+−] 10 = \d+ → \d+$/.test(x)), `l'historique du parent : ${r.join(", ")}`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- étape 2 : toucher et reprise (A5)
// un toucher réel (Input.dispatchTouchEvent) au centre d'un élément ; `ms` : durée de l'appui
const touch = async (page, sel, ms = 40) => {
  const box = await page.locator(sel).first().boundingBox(); if (!box) return false;
  const c = (page.__cdp ??= await page.context().newCDPSession(page)), x = box.x + box.width / 2, y = box.y + box.height / 2;
  await c.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await page.waitForTimeout(ms); await c.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  return true;
};
const said = (page) => page.evaluate(() => window.__said.slice());
// deux touchers sur un élément, envoyés depuis la page à `gapMs` d'écart (pointerdown puis pointerup, chacun). Le toucher
// réel de Chromium (ci-dessus) met ici 170 à 200 ms entre deux appuis, quelle que soit l'attente demandée : trop lent
// pour éprouver la porte du pavé (150 ms). Renvoie l'écart réellement mesuré entre les deux pointerdown.
const doubleTouch = (page, sel, gapMs) => page.evaluate(({ sel, gapMs }) => new Promise((done) => {
  const el = document.querySelector(sel), r = el.getBoundingClientRect(), t = [];
  const o = { bubbles: true, cancelable: true, pointerId: 7, pointerType: "touch", isPrimary: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 };
  const hit = () => { t.push(performance.now()); el.dispatchEvent(new PointerEvent("pointerdown", o)); el.dispatchEvent(new PointerEvent("pointerup", o)); };
  hit(); setTimeout(() => { hit(); done(Math.round(t[1] - t[0])); }, gapMs);
}), { sel, gapMs });
const pauseResume = async (page) => { await touch(page, ".session-home"); await page.waitForTimeout(700); await page.evaluate(() => { window.__said = []; }); await touch(page, ".play"); await page.waitForTimeout(900); return said(page); };
if (run("toucher")) {
  // la reprise redit la consigne : ligne (niveau 5), additions (famille 3), calcul rapide (niveau 7)
  for (const [nom, q, prep, wait0] of [
    ["ligne graduée", "&cran=conseille&choix=1:5", async () => { await window.__app.store.put("niveaux", { module: 1, niveau: 5, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L1", "L2", "L3"] }); }, async (p) => { for (;;) { await p.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked; }, null, { timeout: 60000 }); if (!(await p.evaluate(() => window.__app.screen.q.guide))) return; await p.evaluate(() => window.__app.screen.answer(window.__app.screen.q.answer, null)); await p.waitForTimeout(500); } }],
    ["additions", "&cran=conseille&choix=2:3", async () => { await window.__app.store.put("niveaux", { module: 2, ouvertes: [1, 2, 3], ouvertures: [], acquises: [1, 2], trou: [], notion: [3], lecons: ["L4", "L5"] }); }, async (p) => { for (;;) { await waitQ(p); const q = await cur(p); if (!q.guide) return; await type(p, answerOf(q)); await p.waitForTimeout(300); } }],
    ["calcul rapide", "&cran=dur&choix=3:7", async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [], obtenus: [], vus: { 7: 10 }, fenetres: {}, lecons: ["L9"] }); }, waitQ],
  ]) {
    const { page, context, errors } = await open(q, prep);
    await page.tap(".play", { force: true }); await wait0(page);
    const consigne = await page.evaluate(() => window.__app.voice.instruction);
    await page.waitForFunction(() => !window.__app.voice.cur, null, { timeout: 20000 }).catch(() => {});
    const s = await pauseResume(page);
    check(s.some((x) => x.includes(consigne)), `${nom} : après la pause, la consigne est redite (${s.join(" | ") || "rien"})`);
    if (nom === "calcul rapide") await shot(page, "6-reprise-calcul");
    check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}
if (run("toucher")) {
  // additions : une erreur, la pause pendant la correction, la reprise ; puis un chiffre tapé pendant le « bravo » ; puis un double toucher à 60 ms
  const { page, context, errors } = await open("&cran=conseille&choix=2:3", async () => { await window.__app.store.put("niveaux", { module: 2, ouvertes: [1, 2, 3], ouvertures: [], acquises: [1, 2], trou: [], notion: [3], lecons: ["L4", "L5"] }); });
  await page.tap(".play", { force: true });
  for (;;) { await waitQ(page); const q = await cur(page); if (!q.guide) break; await type(page, answerOf(q)); await page.waitForTimeout(300); }
  const q1 = await cur(page); await type(page, answerOf(q1) === 1 ? 2 : 1);
  await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(600);
  const s = await pauseResume(page);
  check(s.length > 0, `pause pendant une correction : à la reprise, la voix reprend (${s.join(" | ")})`);
  await waitQ(page); const q2 = await cur(page);
  await page.waitForTimeout(300); const c2 = await page.evaluate(() => window.__app.voice.instruction);
  // la bonne réponse, puis un chiffre tapé aussitôt, pendant le « bravo »
  for (const d of String(answerOf(q2))) { await touch(page, `.key[data-key="${d}"]`); await page.waitForTimeout(170); }
  await touch(page, '.key[data-key="valider"]'); await page.waitForTimeout(150); await touch(page, '.key[data-key="5"]');
  await waitQ(page); await page.waitForTimeout(400);
  const after = await page.evaluate(() => ({ typed: window.__app.facts.typed, q: window.__app.facts.q.fait, said: window.__said.slice(-2) }));
  check(after.typed === "", `un chiffre tapé pendant le « bravo » n'est pas dans la question suivante (ardoise « ${after.typed} »)`);
  check(after.said.some((x) => x !== c2 && /combien|plus/i.test(x)), `la consigne suivante est dite (${after.said.join(" | ")})`);
  // la porte du pavé (seance.json, toucher.doubleMs) : deux touchers à 60 ms sur la même touche ne tapent qu'un chiffre ;
  // à plus de doubleMs, deux chiffres (une enfant qui tape « 11 »). L'écart est mesuré : sous une machine trop chargée, un
  // essai dont l'écart n'est pas du bon côté du seuil est refait (trois fois au plus), jamais compté pour bon.
  const doubleMs = await page.evaluate(() => window.__app.facts.gate.doubleMs);
  const vider = async () => { for (let k = 0; k < 4 && (await page.evaluate(() => window.__app.facts.typed)); k++) { await doubleTouch(page, '.key[data-key="effacer"]', 0); await page.waitForTimeout(doubleMs + 60); } };
  const essai = async (key, gapMs, ok) => {
    for (let k = 0; k < 3; k++) {
      await vider(); await page.waitForTimeout(doubleMs + 60);
      const gap = await doubleTouch(page, `.key[data-key="${key}"]`, gapMs); await page.waitForTimeout(150);
      if (ok(gap)) return { gap, typed: await page.evaluate(() => window.__app.facts.typed) };
      console.log(`     (essai refait : écart mesuré ${gap} ms)`);
    }
    return { gap: null, typed: null };
  };
  const vite = await essai("7", 60, (g) => g < doubleMs);
  check(vite.gap !== null && vite.typed === "7", `deux touchers à ${vite.gap ?? "?"} ms sur la même touche : un seul chiffre (« ${vite.typed} ») ; seuil ${doubleMs} ms`);
  await shot(page, "7-double-toucher");
  const lent = await essai("1", doubleMs + 100, (g) => g > doubleMs);
  check(lent.gap !== null && lent.typed === "11", `deux touchers à ${lent.gap ?? "?"} ms sur la même touche : deux chiffres (« ${lent.typed} »)`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
if (run("toucher")) {
  // ligne graduée : un appui long (1,5 s) sur une bulle-réponse compte comme un toucher
  const { page, context, errors } = await open("&cran=conseille&choix=1:5", async () => { await window.__app.store.put("niveaux", { module: 1, niveau: 5, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L1", "L2", "L3"] }); });
  await page.tap(".play", { force: true });
  for (let i = 0; i < 6; i++) {
    await page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked; }, null, { timeout: 60000 });
    const q = await page.evaluate(() => ({ f: window.__app.screen.q.format, a: window.__app.screen.q.answer, g: !!window.__app.screen.q.guide }));
    if (q.f !== "lire" || q.g) { await page.evaluate(() => window.__app.screen.answer(window.__app.screen.q.answer, null)); await page.waitForTimeout(400); continue; }
    const n0 = await page.evaluate(async () => (await window.__app.store.all("reponses")).length);
    await touch(page, `.answer[data-value="${q.a}"]`, 1500); await page.waitForTimeout(500);
    const n1 = await page.evaluate(async () => (await window.__app.store.all("reponses")).length);
    check(n1 === n0 + 1, `appui long (1,5 s) sur la bonne bulle : une réponse enregistrée (${n0} → ${n1})`);
    break;
  }
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- étape 2 : la ligne graduée (A3)
const lineQ = (page) => page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked; }, null, { timeout: 60000 });
const lineAnswer = async (page) => { const q = await page.evaluate(() => ({ f: window.__app.screen.q.format, a: window.__app.screen.q.answer })); if (q.f === "lire" || q.f === "sauter") await page.tap(`.answer[data-value="${q.a}"]`, { force: true }); else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); }); };
if (run("ligne")) {
  // niveau 1, leçon L1 déjà vue : « lire » (la cible et ses voisins cachés), « sauter » (le trajet caché)
  const { page, context, errors } = await open("&cran=conseille&choix=1:1", async () => { await window.__app.store.put("niveaux", { module: 1, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L1"] }); });
  await page.tap(".play", { force: true });
  const seen = {};
  for (let i = 0; i < 10 && !(seen.lire && seen.sauter); i++) {
    await lineQ(page); const q = await page.evaluate(() => { const q = window.__app.screen.q; return { f: q.format, g: !!q.guide, w: q.labelled.map((i) => q.min + i * q.step), t: q.target, s: q.start, j: q.jumps }; });
    if (!q.g && !seen[q.f]) {
      seen[q.f] = true; await page.waitForTimeout(700); await shot(page, `8-ligne1-${q.f}`);
      if (q.f === "lire") check([q.t - 1, q.t, q.t + 1].filter((v) => v > 0 && v < 10).every((v) => !q.w.includes(v)), `niveau 1, lire : la cible ${q.t} et ses voisins cachés (écrits : ${q.w.join(" ")})`);
      else check(Array.from({ length: q.j }, (_, k) => q.s + k + 1).filter((v) => v < 10).every((v) => !q.w.includes(v)), `niveau 1, sauter : le trajet ${q.s} → ${q.s + q.j} caché (écrits : ${q.w.join(" ")})`);
    }
    await lineAnswer(page); await page.waitForTimeout(500);
  }
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
if (run("ligne")) {
  // niveau 2 « plus facile » : 0, 2, 5, 8, 10 écrits ; les cibles tournent sans remise
  const { page, context, errors } = await open("&cran=facile&choix=1:2", async () => { await window.__app.store.put("niveaux", { module: 1, niveau: 2, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L1"] }); });
  await page.tap(".play", { force: true });
  const cibles = [];
  for (let i = 0; i < 14; i++) {
    await lineQ(page); const q = await page.evaluate(() => { const q = window.__app.screen.q; return { f: q.format, g: !!q.guide, a: q.answer, w: q.labelled.map((i) => q.min + i * q.step), r: !!q.revient }; });
    if (!q.r) cibles.push(q.a); // (les exemples guidés tirent aussi dans le sac)
    if (i === 3) { await page.waitForTimeout(600); await shot(page, `9-ligne2-facile-${q.f}`); check(q.w.join(" ") === "0 2 5 8 10", `niveau 2, plus facile : ${q.w.join(" ")} écrits`); }
    await lineAnswer(page); await page.waitForTimeout(400);
  }
  check(new Set(cibles.slice(0, 6)).size === 6, `les 6 premières cibles toutes différentes (${cibles.join(" ")})`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

// (étape 2, A6 : le doublon offrait un décor ; retiré le 5 octobre 2026, décision du parent : plus de doublon ni de décor)

await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
