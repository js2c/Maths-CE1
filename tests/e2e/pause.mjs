// LOT 3, ÉTAPE 5 : L'ACCUEIL COMPLET PENDANT UNE PAUSE (décision du parent du 28 septembre 2026 ; docs/SPEC.md, « Navigation
// pendant la séance »). Dans Chromium (1280 × 800, tactile), voix accélérée. Pour chaque étape (échauffement, ligne,
// additions, calcul rapide, une leçon, le défi record) : la maison, l'accueil en pause (continuer, choisir, le récif,
// l'album, le logo), la visite du récif (une carte ouverte) puis de l'album, et la reprise exacte : même question, même
// consigne, mêmes calques et planches, le temps de la visite compté comme pause, puis la séance continue. Ensuite : choisir
// sans valider (retour à l'accueil en pause), une leçon seule depuis la pause, puis un autre exercice : la séance en pause
// est interrompue (raison notée, étoiles gardées) et l'exercice choisi devient la séance du jour, sans refaire
// l'échauffement déjà passé. Captures dans tests/e2e/out/pause.
//   node tests/e2e/pause.mjs [--seul ligne] [--out dossier]
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert, toucherCreature } from "./recif-commun.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/pause")), ONLY = opt("--seul", null); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const DAY = 86400000;

// ---------------------------------------------------------------- une page préparée (nom de la pieuvre, une carte : le crabe)
async function open(q, prep = null) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async ({ DAY, prep }) => {
    const s = window.__app.store, now = Date.now(); await s.setSetting("mascotte", "Pili"); await s.setSetting("codeParent", "1234");
    await s.put("recompenses", { id: "cartes", cartes: { crabe: { n: 1, premiere: now - DAY, brillante: false } } });
    if (prep === "defi") {
      for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] });
      const faits = ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"];
      for (const [i, k] of faits.entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); }
    }
  }, { DAY, prep });
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
}
// l'état qui doit être identique avant et après les visites (la séance en pause, la scène, les planches)
const state = (page) => page.evaluate(() => {
  const a = window.__app, st = a.stage, o = a.ocean, s = a.facts?.q && (a.facts.resolve || a.challenge) ? a.facts : a.screen, q = s?.q;
  const L = a.lessons.keys ? a.lessons : a.lessons.p2?.keys ? a.lessons.p2 : null;
  return {
    q: q ? JSON.stringify([q.a, q.b, q.op, q.target, q.answer, q.format, q.niveau, q.forme]) : null, attend: !!s?.resolve && !s.locked,
    questions: a.session.rec.questions, etoiles: a.session.rec.etoiles, etape: a.session.progress.etape, consigne: a.voice.instruction,
    lecon: L ? L.p : null, ui: st.ui.children.length, front: o.frontEl.children.length, root: st.root.children.length, acteurs: o.actors.length,
    images: st.ticks.size, avant: o.front.length, planches: [...a.sprites.held()].sort().join(","), ligne: a.line.c === document.querySelector("#line"),
    aides: a.aidBoard?.c?.isConnected ?? null, ecran: a.screen?.band?.isConnected ?? null, ermite: !!a.hermit, defi: !!a.challenge,
    enPause: st.root.classList.contains("paused"), horloge: a.clock.paused, voix: a.voice.paused,
  };
});
const vis = (page, sel) => page.evaluate((sel) => [...document.querySelectorAll(sel)].some((e) => e.isConnected && getComputedStyle(e).visibility !== "hidden"), sel);
const tap = async (page, sel, ms = 400) => { await page.waitForSelector(sel, { timeout: 20000 }); await page.tap(sel, { force: true }); await page.waitForTimeout(ms); };

// la pause, la visite du récif (une carte ouverte et rangée) puis de l'album, et le retour à l'accueil en pause
async function visits(page, name, errors, { shots = false } = {}) {
  await tap(page, ".session-home", 700);
  check(await page.evaluate(() => document.querySelectorAll(".keep.play, .keep.choisir, .keep.reefkey, .keep.albumkey, .logo.keep").length) === 5, `${name} : l'accueil en pause montre continuer, choisir, le récif, l'album et le logo du parent`);
  if (shots) await page.screenshot({ path: join(OUT, "1-accueil-en-pause.png") });
  const s0 = await state(page), t0 = await page.evaluate(() => window.__app.clock.pausedTotal()), w0 = Date.now();
  await tap(page, ".keep.reefkey", 1200);
  const viv = await recifOuvert(page);
  check(viv.length > 0 && await vis(page, "canvas.recif-dessin") && !(await vis(page, ".key, .answer, .nsp, .slate, .skip")), `${name} : le récif en pause, la créature visible, rien de la séance à l'écran`);
  if (shots) await page.screenshot({ path: join(OUT, "2-recif-en-pause.png") });
  await toucherCreature(page, viv[0]); await page.waitForTimeout(1200); await page.waitForSelector(".card", { timeout: 20000 });
  if (shots) await page.screenshot({ path: join(OUT, "3-recif-carte-en-pause.png") });
  await tap(page, ".check:not(.key):not(.stash)", 700);
  if (name === "ligne") await measure(page);
  await tap(page, ".homekey:not(.session-home)", 900);
  await tap(page, ".keep.albumkey", 1200); await page.waitForSelector(".album-card", { timeout: 20000 }); await page.waitForTimeout(500);
  if (shots) await page.screenshot({ path: join(OUT, "4-album-en-pause.png") });
  await tap(page, ".homekey:not(.session-home)", 900);
  await page.waitForSelector(".keep.play", { timeout: 10000 });
  const s1 = await state(page), t1 = await page.evaluate(() => window.__app.clock.pausedTotal()), dt = Date.now() - w0;
  const diff = Object.keys(s0).filter((k) => s0[k] !== s1[k]);
  check(!diff.length, `${name} : après le récif et l'album, la séance en pause est intacte (${diff.map((k) => `${k} : ${s0[k]} -> ${s1[k]}`).join(" ; ") || "question, consigne, calques, acteurs, planches, horloge, voix"})`);
  check(t1 - t0 >= dt - 1500, `${name} : le temps de la visite compte comme pause (${Math.round((t1 - t0) / 100) / 10} s pour ${Math.round(dt / 100) / 10} s de visite)`);
  if (shots) await page.screenshot({ path: join(OUT, "5-retour-en-pause.png") });
  check(!errors.length, `${name} : aucune erreur (${errors.join(" | ")})`);
  return s0;
}
// la mémoire décodée des planches après la visite du récif en pause (le récif et les planches de la séance ensemble)
async function measure(page) {
  const m = await page.evaluate(() => { const a = window.__app, px = a.sprites.src, out = {}; for (const [k, v] of a.sprites.pages) out[k] = v.pages.reduce((t, b) => t + (b.width * b.height * 4) / 1e6, 0); return { out, px }; });
  const tot = Object.values(m.out).reduce((a, b) => a + b, 0);
  console.log(`     mémoire décodée des planches, récif ouvert en pause (@${m.px}x) : ${tot.toFixed(1)} Mo (${Object.entries(m.out).map(([k, v]) => `${k} ${v.toFixed(1)}`).join(", ")})`);
}
// reprendre : « continuer » ; la même question attend, la même consigne est redite, puis la séance continue
async function resume(page, name, before, next) {
  await tap(page, ".keep.play", 0);
  const s = await state(page);
  check(!s.enPause && !s.horloge && !s.voix, `${name} : « continuer » reprend (horloge et voix repartent)`);
  check(s.q === before.q && s.consigne === before.consigne && s.lecon === before.lecon, `${name} : reprise exacte (même question, même consigne${before.lecon !== null ? ", même phrase de la leçon" : ""}) ${s.q === before.q && s.consigne === before.consigne && s.lecon === before.lecon ? "" : JSON.stringify([before.q, s.q, before.consigne, s.consigne, before.lecon, s.lecon])}`);
  check(await next(), `${name} : la séance continue après la reprise`);
}
const answerFacts = (page) => page.evaluate(() => { const f = window.__app.facts, q = f.q, v = q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.module === 3 ? q.n : q.a + q.b; for (const d of String(v)) f.type(d, document.querySelector(`.key[data-key="${d}"]`)); f.submit(); return v; });
const advanced = (page, n0) => page.waitForFunction((n0) => window.__app.session.rec.questions > n0, n0, { timeout: 30000 }).then(() => true, () => false);

const SCENES = [
  { name: "echauffement", q: "&cran=conseille&module=1&sansLecon&guides=0", ready: () => window.__app.session?.progress.etape === "echauffement" && window.__app.facts?.q && window.__app.facts.resolve && !window.__app.facts.locked, next: async (page, s) => { await answerFacts(page); return advanced(page, s.questions); } },
  { name: "ligne", q: "&cran=conseille&sans=echauffement&module=1&sansLecon&guides=0", ready: () => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, next: async (page, s) => { await page.evaluate(() => { const sc = window.__app.screen; sc.resolve({ q: sc.q, value: sc.q.answer, ok: true, code: null, ms: 3000, listens: 1 }); sc.resolve = null; }); return advanced(page, s.questions); } },
  { name: "additions", q: "&cran=conseille&sans=echauffement&module=2&sansLecon&guides=0", ready: () => window.__app.session?.progress.etape === "notion" && window.__app.hermit && window.__app.facts?.q && window.__app.facts.resolve && !window.__app.facts.locked, next: async (page, s) => { await answerFacts(page); return advanced(page, s.questions); } },
  { name: "calcul", q: "&cran=conseille&sans=echauffement&module=3&sansLecon", ready: () => window.__app.session?.progress.etape === "notion" && window.__app.facts?.q?.module === 3 && window.__app.facts.resolve && !window.__app.facts.locked, next: async (page, s) => { await answerFacts(page); return page.waitForFunction((n0) => window.__app.session.rec.questions > n0 || (window.__app.facts?.q?.pont && window.__app.facts.resolve), s.questions, { timeout: 30000 }).then(() => true, () => false); } },
  { name: "lecon", q: "&cran=conseille&sans=echauffement&module=1", ready: () => window.__app.lessons.keys && window.__app.lessons.p >= 1, next: (page, s) => page.waitForFunction((p) => !window.__app.lessons.keys || window.__app.lessons.p > p, s.lecon, { timeout: 60000 }).then(() => true, () => false) },
  { name: "defi", prep: "defi", q: "&cran=conseille&sans=echauffement,notion", ready: () => window.__app.challenge && window.__app.facts?.resolve && !window.__app.facts.locked, next: async (page, s) => { await answerFacts(page); return advanced(page, s.questions); } },
];
for (const [i, sc] of SCENES.entries()) {
  if (ONLY && ONLY !== sc.name) continue;
  const { page, context, errors } = await open(sc.q, sc.prep);
  await tap(page, ".play", 300);
  await page.waitForFunction(sc.ready, null, { timeout: 90000 }); await page.waitForTimeout(500);
  const before = await visits(page, sc.name, errors, { shots: i === 1 });
  await resume(page, sc.name, before, () => sc.next(page, before));
  await page.screenshot({ path: join(OUT, `6-repris-${sc.name}.png`) });
  check(!errors.length, `${sc.name} : aucune erreur après la reprise (${errors.join(" | ")})`);
  await context.close();
}

// ---------------------------------------------------------------- choisir depuis la pause
if (!ONLY || ONLY === "choisir") {
  const { page, context, errors } = await open("&cran=conseille&module=1&sansLecon&guides=0");
  await tap(page, ".play", 300);
  await page.waitForFunction(() => window.__app.session?.progress.etape === "echauffement" && window.__app.facts?.resolve, null, { timeout: 60000 });
  await page.waitForTimeout(400); await tap(page, ".skip-warmup", 300); await tap(page, ".check-warmup", 300); // l'échauffement passé (lot 3 ter : le bouton dédié, puis la coche)
  await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked, null, { timeout: 60000 }); await page.waitForTimeout(400);
  await tap(page, ".session-home", 700);
  const s0 = await state(page), old = await page.evaluate(() => ({ id: window.__app.session.id, etoiles: window.__app.session.rec.etoiles }));
  // 1. choisir, puis la maison sans rien valider : retour à l'accueil en pause, séance intacte
  await tap(page, ".keep.choisir", 900); await page.waitForSelector(".choix-ex", { timeout: 20000 });
  check(await vis(page, ".session-home"), "choisir depuis la pause : l'écran de choix, la maison visible");
  await page.screenshot({ path: join(OUT, "7-choisir-en-pause.png") });
  await tap(page, ".session-home", 900); await page.waitForSelector(".keep.play", { timeout: 10000 });
  let s1 = await state(page), diff = Object.keys(s0).filter((k) => s0[k] !== s1[k]);
  check(!diff.length && !(await page.locator(".choix-ex").count()), `la maison quitte l'écran de choix sans rien valider : retour à l'accueil en pause, séance intacte (${diff.join(", ")})`);
  // 2. une leçon seule depuis la pause : jouée, puis retour à l'accueil en pause, la séance intacte
  // (lot « Les leçons » : par la bulle « les leçons » de l'accueil en pause)
  await tap(page, ".keep.leconskey", 900); await page.waitForSelector(".lecons-tuile", { timeout: 20000 });
  await tap(page, '.lecons-tuile[data-key="L2"]', 300); await tap(page, '.lecons-tuile[data-key="L2"]', 300); await page.waitForSelector(".lessonkey", { timeout: 20000 }); await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, "8-lecon-en-pause.png") });
  await tap(page, ".skip.lessonkey", 300); await page.waitForSelector(".keep.play", { timeout: 20000 }); await page.waitForTimeout(500);
  s1 = await state(page); diff = Object.keys(s0).filter((k) => s0[k] !== s1[k]);
  const L = await page.evaluate(async () => (await window.__app.store.all("seances")).filter((s) => s.leconChoisie).at(-1));
  check(!diff.length, `une leçon jouée depuis la pause : retour à l'accueil en pause, séance intacte (${diff.map((k) => `${k} : ${s0[k]} -> ${s1[k]}`).join(" ; ")})`);
  check(L?.lecons?.[0]?.id === "L2" && L.pendantPause === old.id, "la leçon seule est notée (séance « libre », pendant la pause)");
  // 3. un autre exercice : la séance en pause est interrompue, l'exercice choisi est la séance du jour
  await tap(page, ".keep.choisir", 900); await tap(page, '.choix-ex[aria-label="calcul"]', 300); await tap(page, '.choix-ex[aria-label="calcul"]', 900); await tap(page, '.choix-tuile[data-key="2"]', 300); await tap(page, '.choix-tuile[data-key="2"]', 300);
  await page.waitForFunction((id) => window.__app.session?.id !== id && window.__app.session?.rec?.choix, old.id, { timeout: 30000 });
  await page.waitForFunction(() => window.__app.session.progress.etape === "notion", null, { timeout: 60000 }); await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUT, "9-autre-exercice.png") });
  const r = await page.evaluate(async (id) => { const all = await window.__app.store.all("seances"), a = window.__app; return { prev: all.find((s) => s.id === id), cur: a.session.rec, frise: a.frieze.steps, enPause: a.enPause, paused: a.stage.root.classList.contains("paused"), total: a.rewards.st.total }; }, old.id);
  check(r.prev.terminee === false && r.prev.interruption?.par === "enfant" && r.prev.interruption?.raison === "autre exercice choisi par l'enfant" && !r.prev.arreteeParParent, `la séance en pause est interrompue, raison notée (${JSON.stringify(r.prev.interruption)})`);
  check(r.prev.etoiles === old.etoiles && !r.prev.etapes.some((e) => e.id === "recompense"), `sans récompense, ses étoiles gardées (${r.prev.etoiles})`);
  check(r.cur.choix?.module === 3 && r.cur.choix?.niveau === 2 && r.cur.module === 3 && !r.enPause && !r.paused, "l'exercice choisi (calcul rapide, niveau 2) est la nouvelle séance du jour");
  check(r.cur.etapes.some((e) => e.id === "echauffement" && e.sautee === "déjà fait aujourd'hui") && !r.frise.includes("echauffement"), `l'échauffement passé plus tôt n'est pas refait (frise : ${r.frise.join(", ")})`);
  // l'historique du parent : la raison
  await tap(page, ".session-home", 700);
  const b = await page.locator(".logo.keep").boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(2300); await page.mouse.up();
  await page.waitForSelector(".pa-gate", { timeout: 10000 }); for (const d of "1234") await page.tap(`.pa-keys [data-key="${d}"]`); await page.waitForSelector(".pa-sheet", { timeout: 10000 });
  await page.waitForTimeout(500); await page.click('.pa-tabs button:has-text("Séances")'); await page.waitForTimeout(500);
  const heads = page.locator(".pa-session > button"); const n = await heads.count();
  for (let k = 0; k < n; k++) { const t = await heads.nth(k).textContent(); if (t.includes("interrompue") && (await heads.nth(k).getAttribute("aria-expanded")) !== "true") await heads.nth(k).click(); }
  await page.waitForTimeout(400);
  check(await page.locator('.pa-detail:has-text("autre exercice choisi par l\'enfant")').count() >= 1, "l'espace parent montre la raison de l'interruption");
  await page.screenshot({ path: join(OUT, "10-parent-raison.png"), fullPage: true });
  check(!errors.length, `choisir : aucune erreur (${errors.join(" | ")})`);
  await context.close();
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
