// L'ERGONOMIE DU LOT 1 BIS dans Chromium (tablette 1280 × 800, tactile), voix accélérée :
//  1. la frise d'avancement ; « je ne sais pas » (code NSP, la question revient) ; la maison met la séance
//     en pause (tout disparaît, le temps ne compte plus) et « continuer » la reprend là où elle en était ;
//  2. « passer » un exemple guidé dès la première vue (réponse notée « exemple passé ») ; « passer » une
//     correction (après « je ne sais pas ») : visible moins d'une demi-seconde après son début, la bonne
//     réponse reste en place, puis la question suivante ; réponse notée « correction passée » ; de même au
//     pavé des additions ;
//  3. une leçon jamais vue : « rejouer » et « passer » dès le début (pas de « phrase précédente ») ;
//     passée : pas d'étoiles, notée « passée » ;
//  4. après la séance du jour : la lune en décor, « Encore ! » et l'entraînement libre (réponses marquées
//     « libre », aucune étoile, aucun coquillage ; la maison le quitte) ;
//  5. l'espace parent montre les « je ne sais pas », l'exemple passé, la correction passée et l'entraînement libre.
// Le bouton « passer » est toujours le même, à la même place (en haut à droite), zone tactile de 64 px au moins.
// Captures dans tests/e2e/out/ergonomie.
//   node tests/e2e/ergonomie.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/ergonomie"));
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
// le moment où chaque bouton « passer » apparaît, et celui du dernier toucher
const SPY = () => { window.__skipAt = []; window.__tapAt = 0; addEventListener("pointerdown", () => { window.__tapAt = performance.now(); }, true); new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.classList?.contains("skip")) window.__skipAt.push(performance.now()); }).observe(document, { childList: true, subtree: true }); };
await context.addInitScript(SPY);
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = (n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const ready = async () => page.waitForFunction(() => window.__ready !== undefined);
const waitQ = () => page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked; }, null, { timeout: 60000 });
// le bouton « passer » : même place, même taille partout ; délai depuis le dernier toucher (ms)
const skipBox = (p = page) => p.evaluate(() => { const b = [...document.querySelectorAll(".skip")].at(-1), r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), delay: Math.round(window.__skipAt.at(-1) - window.__tapAt) }; });
const SKIP_BOX = { x: 1135, y: 148, w: 140, h: 140 };
const sameSkip = (b) => b.x === SKIP_BOX.x && b.y === SKIP_BOX.y && b.w === SKIP_BOX.w && b.h === SKIP_BOX.h && b.w >= 64;
const answerRight = async () => { const q = await page.evaluate(() => { const s = window.__app.screen; return { f: s.q.format, a: s.q.answer }; }); if (q.f === "lire" || q.f === "sauter") await page.tap(`.answer[data-value="${q.a}"]`, { force: true }); else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); }); await page.waitForFunction(() => !window.__app.screen?.resolve || window.__app.screen.locked, null, { timeout: 30000 }).catch(() => {}); };

// ---- 1 et 2 : une séance (nom déjà choisi, exemples guidés jamais vus, sans leçon ni échauffement)
await page.goto(url + "?nosw&voix=rapide"); await ready();
await page.evaluate(async () => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); });
await page.goto(url + "?nosw&voix=rapide&sansLecon&sans=echauffement&questions=7&guides=1&format=lire"); await ready();
await page.tap(".play", { force: true });
// l'exemple guidé, vu pour la première fois : « passer » apparaît
await page.waitForSelector(".skip", { timeout: 30000 }); await page.waitForTimeout(700);
await shot("1-exemple-guide-passer");
check(sameSkip(await skipBox()), `exemple guidé : « passer » dès la première vue, en haut à droite (${JSON.stringify(await skipBox())})`);
await page.tap(".skip", { force: true });
await waitQ();
check(await page.evaluate(() => window.__app.screen.q.guide && window.__app.screen.q.passe), "l'exemple guidé passé : la question attend sa réponse, notée « passé »");
await answerRight();
// « je ne sais pas » sur la première question
await waitQ(); await page.waitForTimeout(300);
await shot("2-question-frise");
const frise = await page.evaluate(() => ({ ...window.__app.frieze.p }));
check(frise.etape === "notion" && frise.faites === 1 && frise.prevues === 8, `la frise : notion du jour, 1 question faite sur 8 prévues (${JSON.stringify(frise)})`);
const nspQ = await page.evaluate(() => window.__app.screen.q.answer), nspAt = await page.evaluate(() => window.__app.session.rec.questions);
await page.tap(".nsp", { force: true });
// la correction commence : « passer » est là tout de suite
await page.waitForSelector(".skip", { timeout: 2000 });
const cb = await skipBox();
check(sameSkip(cb) && cb.delay >= 0 && cb.delay < 500, `correction : « passer » visible ${cb.delay} ms après le toucher, même place et même taille (${JSON.stringify(cb)})`);
await page.waitForTimeout(1500);
await shot("3-correction-passer");
await page.tap(".skip", { force: true }); await page.waitForTimeout(250);
const shown = await page.evaluate(() => { const s = window.__app.screen; return { voix: window.__app.voice.speaking, poisson: s.fishAt ? Math.round(s.fishAt[0]) : null, but: s.fishAt ? Math.round(s.xOf(s.q.answer)) : null, locked: s.locked, bouton: [...document.querySelectorAll(".skip")].some((e) => getComputedStyle(e).visibility === "visible") }; });
await shot("3b-correction-passee");
check(!shown.voix && shown.locked && !shown.bouton, `correction passée : la voix se tait, la bonne réponse reste montrée (${JSON.stringify(shown)})`);
const t0 = Date.now(); await waitQ();
const next = await page.evaluate(() => window.__app.session.rec.questions), gap = Date.now() - t0 + 250;
check(next === nspAt + 1 && gap < 2500, `correction passée : la question suivante arrive ${gap} ms après le toucher`);
await shot("3-je-ne-sais-pas");
// la maison, pendant la question suivante
await waitQ();
const before = await page.evaluate(() => window.__app.session.rec.questions);
await page.tap(".session-home", { force: true }); await page.waitForTimeout(800);
await shot("4-pause");
const paused = await page.evaluate(() => ({ cls: document.getElementById("stage").classList.contains("paused"), clock: window.__app.clock.paused, voice: window.__app.voice.paused, answers: [...document.querySelectorAll(".answer")].every((b) => getComputedStyle(b).visibility === "hidden"), resume: getComputedStyle(document.querySelector(".play.keep")).visibility }));
check(paused.cls && paused.clock && paused.voice && paused.answers && paused.resume === "visible", `pause : la séance disparaît, le temps et la voix s'arrêtent, la bulle « continuer » attend (${JSON.stringify(paused)})`);
await page.waitForTimeout(1500);
await page.tap(".play.keep", { force: true }); await page.waitForTimeout(500);
const resumed = await page.evaluate(() => ({ cls: document.getElementById("stage").classList.contains("paused"), q: window.__app.session.rec.questions, open: !!window.__app.screen.resolve && !window.__app.screen.locked, pause: window.__app.session.rec.pauses }));
check(!resumed.cls && resumed.q === before && resumed.open && resumed.pause === 1, `reprise : la même question attend sa réponse, une pause notée (${JSON.stringify(resumed)})`);
await shot("5-reprise");
// la suite : tout juste, la question « je ne sais pas » revient
let back = false;
for (const until = Date.now() + 120000; Date.now() < until;) {
  if (await page.evaluate(() => !!document.querySelector(".tally"))) break;
  const st = await page.evaluate(() => { const s = window.__app.screen; return s?.q && s.resolve && !s.locked ? { revient: !!s.q.revient, a: s.q.answer } : null; });
  if (!st) { await page.waitForTimeout(150); continue; }
  if (st.revient && st.a === nspQ) back = true;
  await answerRight(); await page.waitForTimeout(200);
}
check(back, "la question « je ne sais pas » revient plus loin");
// la récompense : on laisse faire (coquillage éventuel ouvert tout seul)
for (let i = 0; i < 4; i++) { const sh = await page.waitForSelector(".shelltap, .check.invite, .moon", { timeout: 60000 }); const cls = await sh.getAttribute("class"); if (cls.includes("moon")) break; await sh.tap({ force: true }); await page.waitForTimeout(1500); }
await page.waitForSelector(".moon", { timeout: 90000 }); await page.waitForTimeout(600);
await shot("6-a-demain-encore");
const db = await page.evaluate(async () => { const s = window.__app.store; return { reps: await s.all("reponses"), seances: await s.all("seances") }; });
const nsp = db.reps.filter((r) => r.erreur === "NSP");
check(nsp.length === 1 && nsp[0].juste === false && nsp[0].donnee === null, `réponse « je ne sais pas » enregistrée (erreur NSP)`);
check(db.reps.filter((r) => r.passe && r.guide).length === 1, "l'exemple guidé passé est enregistré");
check(nsp[0]?.correctionPassee === true && db.reps.filter((r) => r.correctionPassee).length === 1, "la correction passée est notée dans la réponse");
const se = db.seances.at(-1);
check(se.terminee && se.pauses === 1 && se.pauseS >= 1, `séance terminée, une pause de ${se.pauseS} s, non comptée dans la durée (${se.dureeS} s)`);
// la lune est un décor : elle ne se touche pas
check(await page.evaluate(() => { const m = document.querySelector(".moon"); return m.tagName === "DIV" && getComputedStyle(m).pointerEvents === "none"; }), "la lune « à demain » est un décor, pas un bouton");

// ---- 4 : l'entraînement libre
const stars0 = await page.evaluate(() => [window.__app.rewards.st.total, window.__app.rewards.st.coquillages]);
await page.tap(".again", { force: true });
// (lot 3 : « Encore ! » ouvre l'écran « choisir », sans étoiles : l'exercice, puis le niveau ; deux touchers chacun)
await page.waitForSelector(".choix-ex", { timeout: 20000 }); await page.waitForTimeout(600);
await shot("7-encore-menu");
check((await page.locator(".choix-ex").count()) === 5, "entraînement libre : l'écran « choisir » (ligne, additions, calcul rapide, voiliers, multiplication ; lot « Les leçons » : les leçons ont leur bulle à l'accueil)");
await page.tap('.choix-ex[aria-label="ligne"]', { force: true }); await page.waitForTimeout(250);
await page.waitForSelector('.choix-tuile[data-conseille="1"]', { timeout: 10000 });
await page.tap('.choix-tuile[data-conseille="1"]', { force: true }); await page.waitForTimeout(250);
for (let i = 0; i < 3; i++) { await waitQ(); if (i === 0) { await page.waitForTimeout(300); await shot("8-libre-ligne"); } await answerRight(); await page.waitForTimeout(300); }
const stars1 = await page.evaluate(() => [window.__app.rewards.st.total, window.__app.rewards.st.coquillages, window.__app.hud.shown]);
check(stars1[0] === stars0[0] && stars1[1] === stars0[1] && stars1[2] === stars0[0], `entraînement libre : ni étoile ni coquillage (${stars1[0]} étoiles avant et après)`);
await waitQ();
await page.tap(".session-home", { force: true }); await page.waitForTimeout(800);
check((await page.locator(".again").count()) === 1 && (await page.locator(".answer").count()) === 0 && (await page.locator(".nsp").evaluate((e) => getComputedStyle(e).visibility)) === "hidden", "la maison quitte l'entraînement libre : retour à la lune et à « Encore ! »");
await page.waitForTimeout(1500);
check(await page.evaluate(() => !window.__app.screen.resolve && (window.__app.screen.q === null || window.__app.screen.locked)), "l'activité abandonnée ne revient pas à l'écran");
await shot("9-retour-apres-libre");
const libre = await page.evaluate(async () => { const s = window.__app.store; return { reps: (await s.all("reponses")).filter((r) => r.libre), seances: (await s.all("seances")).filter((x) => x.libre) }; });
check(libre.reps.length === 3 && libre.seances.length === 1 && libre.seances[0].questions === 3 && libre.reps.every((r) => r.seance === libre.seances[0].id), `3 réponses « libre » dans une séance « libre » (${libre.reps.length})`);
check(await page.evaluate(() => import("./js/session/session.js").then((m) => m.doneToday(window.__app.store))), "l'entraînement libre ne change pas « la séance du jour est faite »");

// ---- 3 : une leçon jamais vue : « rejouer » et « passer » dès le début (une tablette neuve)
{
  const c2 = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }); await c2.addInitScript(SPY);
  const p2 = await c2.newPage();
  p2.on("pageerror", (e) => errors.push(e.message));
  await p2.goto(url + "?nosw&voix=rapide&lecon=L1"); await p2.waitForFunction(() => window.__ready !== undefined);
  await p2.tap(".play", { force: true });
  await p2.waitForSelector(".skip", { timeout: 2000 });
  const lb = await skipBox(p2);
  check(sameSkip(lb) && lb.delay < 500, `leçon vue pour la première fois : « passer » visible ${lb.delay} ms après le début, même place (${JSON.stringify(lb)})`);
  check((await p2.locator(".lessonkey.rejouer").count()) === 1 && (await p2.locator(".lessonkey.precedent").count()) === 0 && (await p2.locator(".lessonkey").count()) === 2, "leçon : deux boutons, « rejouer » et « passer »");
  await p2.waitForFunction(() => window.__app.lessons.p >= 1, null, { timeout: 30000 }); await p2.waitForTimeout(800);
  await p2.screenshot({ path: join(OUT, "10-lecon-boutons.png") });
  await p2.tap(".skip", { force: true });
  await p2.waitForFunction(() => window.__lecon !== undefined, null, { timeout: 20000 });
  const L = await p2.evaluate(() => window.__lecon);
  check(L.passee === true && L.vue === false, `leçon passée : ni vue jusqu'au bout, ni étoiles (${JSON.stringify(L)})`);
  // ---- 2 bis : « passer » la correction au pavé des additions
  await p2.goto(url + "?nosw&voix=rapide"); await p2.waitForFunction(() => window.__ready !== undefined);
  await p2.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); await window.__app.store.setSetting("tempsDeBase", { mesures: [3000, 3000, 3000] }); });
  await p2.goto(url + "?nosw&voix=rapide&sansLecon&sans=notion&faits=5"); await p2.waitForFunction(() => window.__ready !== undefined);
  await p2.tap(".play", { force: true });
  await p2.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 30000 });
  await p2.waitForTimeout(300);
  const fq = await p2.evaluate(() => { const q = window.__app.facts.q; return `${q.a} + ${q.b}`; });
  await p2.evaluate(() => { window.__app.facts.submit({ nsp: true }); }); // sans attendre la fin de la correction
  await p2.waitForSelector(".skip", { timeout: 2000 });
  const fb = await skipBox(p2);
  check(sameSkip(fb), `additions : « passer » à la même place pendant la correction (${JSON.stringify(fb)})`);
  await p2.tap(".skip", { force: true }); await p2.waitForTimeout(300);
  await p2.screenshot({ path: join(OUT, "10b-additions-correction-passee.png") });
  const slate = await p2.evaluate(() => ({ typed: window.__app.facts.typed, sum: window.__app.facts.q.a + window.__app.facts.q.b, ring: window.__app.facts.ring }));
  check(Number(slate.typed) === slate.sum && slate.ring, `additions : le résultat reste écrit sur l'ardoise (${JSON.stringify(slate)})`);
  await p2.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 5000 });
  const fr = (await p2.evaluate(() => window.__app.store.all("reponses"))).find((r) => r.module === 2 && r.question === fq);
  check(fr?.correctionPassee === true && fr.erreur === "NSP", `additions : réponse notée « correction passée » (${fq})`);
  await c2.close();
}

// ---- 5 : l'espace parent
await page.goto(url + "?nosw&voix=rapide"); await ready();
await page.evaluate(async () => { await window.__app.store.setSetting("codeParent", "1234"); });
page.evaluate(() => window.__app.parent.open()).catch(() => {});
await page.waitForSelector(".pa-keys", { timeout: 10000 });
for (const d of "1234") await page.tap(`.pa-keys [data-key="${d}"]`);
await page.waitForTimeout(300); if (await page.locator('.pa-keys [data-key="ok"]').count()) await page.tap('.pa-keys [data-key="ok"]').catch(() => {});
await page.waitForSelector(".pa-sheet", { timeout: 10000 });
await page.evaluate(() => window.__app.parent.show("seances"));
await page.waitForTimeout(300);
await page.locator(".pa-session button").nth(1).click(); await page.waitForTimeout(400);
await page.screenshot({ path: join(OUT, "11-parent-seance.png"), fullPage: true });
const txt = await page.evaluate(() => document.querySelector(".pa-sheet").innerText);
check(/entraînement libre/.test(txt) && /« Je ne sais pas »/.test(txt) && /je ne sais pas/.test(txt) && /exemple guidé passé/.test(txt) && /correction passée/.test(txt) && /Corrections passées/.test(txt) && /Pauses/.test(txt), "espace parent : entraînement libre, « je ne sais pas » à part, exemple passé, correction passée, pause");
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
const misses = await page.evaluate(() => [...window.__app.voice.misses]);
check(misses.length === 0, `chaque phrase dite a son fichier son ${misses.join(" | ")}`);
await browser.close(); srv.close();
