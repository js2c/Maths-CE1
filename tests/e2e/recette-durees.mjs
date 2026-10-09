// RECETTE : durées réelles (voix normale) de ce que l'enfant regarde sans pouvoir agir, niveau par niveau :
// leçon d'entrée, exemples guidés, correction après « je ne sais pas », correction après une erreur ; puis
// (décision du parent du 27 septembre) l'aide des additions (coquillage, aide affichée d'emblée du cran « plus
// (lot 3 ter, T3 : « passer » et « je ne sais pas » valident au lever du doigt : chaque toucher simulé pose puis lève le doigt)
// facile ») ; pour chaque parcours, la plus longue attente SANS AUCUNE COMMANDE (ni « passer », ni question
// ouverte, ni bouton de leçon) : en tout, et hors voix (la voix parle : consigne, bravo, correction dite).
import { chromium } from "./navigateur.mjs";
import { serve } from "../serve.mjs";
const PASSER = process.argv.includes("--passer"); // l'enfant touche « passer » dès qu'il apparaît
// (bloc « Sommes jusqu'à 30 » et « Multiplication ») --bloc : seulement les familles 8 à 12, leurs appuis et la multiplication
const BLOC = process.argv.includes("--bloc");
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const out = [];
// la plus longue attente sans commande : échantillonnée toutes les 100 ms dans la page (`window.__gap`)
const MONITOR = () => {
  const vis = (sel) => [...document.querySelectorAll(sel)].some((e) => e.isConnected && getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).display !== "none");
  const cmd = () => { const a = window.__app; if (!a) return true; if (a.clock?.paused || !a.session) return true; const open = [a.screen, a.facts].some((s) => s?.q && s.resolve && !s.locked) || !!a.voiliers?.attend; return open || vis(".skip") || vis(".lessonkey") || vis(".play") || vis(".shelltap") || vis(".check"); };
  window.__gap = { max: 0, maxHors: 0, at: "", atHors: "" }; let t0 = null, h0 = null;
  setInterval(() => {
    const now = performance.now(), c = cmd(), speak = !!window.__app?.voice?.speaking, where = () => `${window.__app?.session?.progress?.etape ?? "-"} q${window.__app?.session?.rec?.questions ?? 0}`;
    if (c) { t0 = null; h0 = null; return; }
    t0 ??= now; if (now - t0 > window.__gap.max) { window.__gap.max = now - t0; window.__gap.at = where(); }
    if (speak) { h0 = null; return; }
    h0 ??= now; if (now - h0 > window.__gap.maxHors) { window.__gap.maxHors = now - h0; window.__gap.atHors = where(); }
  }, 100);
};
const gapOf = async (page) => { const g = await page.evaluate(() => window.__gap); return `sans commande : ${(g.max / 1000).toFixed(1)} s au plus (${g.at}), hors voix ${(g.maxHors / 1000).toFixed(1)} s (${g.atHors})`; };
for (const niveau of BLOC ? [] : [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }); await context.addInitScript(MONITOR); const page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  await page.goto(url + `?nosw&cran=conseille&sans=echauffement&niveau=${niveau}&questions=4`); // (lot 2 : le sélecteur de difficulté est mesuré à part, tests/e2e/selecteur.mjs) await page.waitForFunction(() => window.__ready !== undefined);
  const t0 = Date.now(); await page.tap(".play", { force: true });
  // (niveau 12, la dictée : la question est posée au pavé des additions, window.__app.facts)
  const open = () => page.waitForFunction(() => [window.__app.screen, window.__app.facts].some((s) => s?.q && s.resolve && !s.locked), null, { timeout: 240000, polling: 100 });
  const ev = []; let t = Date.now();
  if (PASSER) await page.evaluate(() => { window.__passes = 0; setInterval(() => { const b = document.querySelector(".skip"); if (b && getComputedStyle(b).visibility !== "hidden") { (b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); window.__passes++; } }, 150); });
  for (let k = 0; k < 5; k++) {
    await open(); const now = Date.now(), dict = await page.evaluate(() => !!(window.__app.facts?.q?.dictee && window.__app.facts.resolve && !window.__app.facts.locked)), q = dict ? await page.evaluate(() => ({ f: "ecrire", a: window.__app.facts.q.answer ?? window.__app.facts.q.value })) : await page.evaluate(() => ({ f: window.__app.screen.q.format, a: window.__app.screen.q.answer, g: !!window.__app.screen.q.guide }));
    ev.push(`${k === 0 ? "avant la 1re question (accueil, leçon, exemple)" : "attente"} ${((now - t) / 1000).toFixed(1)} s`);
    await page.waitForTimeout(800); t = Date.now();
    if (dict) {
      // la dictée : « je ne sais pas », une erreur (un chiffre de trop), sinon le bon nombre
      const n = await page.evaluate(() => window.__app.facts.q.answer);
      if (k === 1) { await page.tap(".nsp", { force: true }); ev.push("[NSP ecrire]"); continue; }
      const v = k === 2 ? `${n}0` : String(n);
      for (const d of v) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); }
      await page.tap('.key[data-key="valider"]', { force: true }); if (k === 2) ev.push("[erreur ecrire]"); continue;
    }
    if (k === 1) { await page.tap(".nsp", { force: true }); ev.push(`[NSP ${q.f}]`); }
    else if (k === 2) { const v = await page.evaluate(() => { const b = [...document.querySelectorAll(".answer")].find((x) => Number(x.dataset.value) !== window.__app.screen.q.answer); return b?.dataset.value ?? null; }); if (v) await page.tap(`.answer[data-value="${v}"]`, { force: true }); else await page.evaluate(() => { const s = window.__app.screen; s.answer(s.q.answer + (s.q.max - s.q.min) / 4, null); }); ev.push(`[erreur ${q.f}]`); }
    else if (q.f === "lire" || q.f === "sauter") await page.tap(`.answer[data-value="${q.a}"]`, { force: true });
    else await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); });
  }
  const rec = await page.evaluate(() => window.__app.session.rec);
  const passes = PASSER ? await page.evaluate(() => window.__passes) : 0;
  out.push(`niveau ${niveau}${PASSER ? ` (passer touché ${passes} fois)` : ""} : ${ev.join(" · ")} ; leçons ${JSON.stringify((rec.lecons ?? []).map((l) => l.id + " " + l.dureeS + "s"))} ; ${await gapOf(page)}`);
  console.log(out.at(-1)); await context.close();
}
// lot 2, étape 6 : la notion du jour sur les additions, famille par famille (le parent a marqué connues les
// familles d'avant) : leçon d'entrée ou exemples guidés, correction après « je ne sais pas », après une erreur
for (const famille of BLOC ? [8, 9, 11, 12] : [1, 3, 4, 5, 6, 8, 9, 11, 12]) { // (8 à 12 : lot « Sommes jusqu'à 30 »)
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }); await context.addInitScript(MONITOR); const page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (fam) => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); const { markFamilyKnown } = await import("./js/parent/depart.js"), m2 = await (await fetch("content/module2.json")).json(); for (let f = 1; f < fam; f++) await markFamilyKnown(s, m2, f); }, famille);
  await page.goto(url + "?nosw&cran=conseille&sans=echauffement&module=2&questions=4"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const open = () => page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked; }, null, { timeout: 240000, polling: 100 });
  const ev = []; let t = Date.now();
  if (PASSER) await page.evaluate(() => { window.__passes = 0; setInterval(() => { const b = document.querySelector(".skip"); if (b && getComputedStyle(b).visibility !== "hidden") { (b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); window.__passes++; } }, 150); });
  const typeIn = async (n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
  for (let k = 0; k < 5; k++) {
    await open(); const now = Date.now(), q = await page.evaluate(() => { const f = window.__app.facts.q; return { v: f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a + f.b, g: !!f.guide, appui: f.appui }; });
    ev.push(`${k === 0 ? "avant la 1re question (leçon, exemple)" : "attente"} ${((now - t) / 1000).toFixed(1)} s`);
    await page.waitForTimeout(800); t = Date.now();
    if (k === 2) { await page.evaluate(() => { const b = [...document.querySelectorAll(".nsp")].find((x) => getComputedStyle(x).visibility !== "hidden"); (b?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); }); ev.push(`[NSP ${q.appui}]`); }
    else if (k === 3) { await typeIn(q.v === 9 ? 8 : q.v + 1); ev.push(`[erreur ${q.appui}]`); }
    else await typeIn(q.v);
  }
  const rec = await page.evaluate(() => window.__app.session.rec);
  const passes = PASSER ? await page.evaluate(() => window.__passes) : 0;
  out.push(`additions, famille ${rec.famille}${PASSER ? ` (passer touché ${passes} fois)` : ""} : ${ev.join(" · ")} ; leçons ${JSON.stringify((rec.lecons ?? []).map((l) => l.id + " " + l.dureeS + "s"))} ; ${await gapOf(page)}`);
  console.log(out.at(-1)); await context.close();
}
// lot 3, étape 4 : le calcul rapide, sur une base neuve, niveau choisi (leçon d'entrée L7 au niveau 2, L8 au 6, L9 au 7 ;
// puis les calculs guidés, pont par pont) : « je ne sais pas », une erreur (correction sur le mur ou le chemin)
for (const niveau of BLOC ? [] : [1, 2, 6, 7, 9]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }); await context.addInitScript(MONITOR); const page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  await page.goto(url + `?nosw&cran=conseille&sans=echauffement&choix=3:${niveau}&questions=5`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const open = () => page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked; }, null, { timeout: 240000, polling: 100 });
  const ev = []; let t = Date.now(), nq = 0;
  if (PASSER) await page.evaluate(() => { window.__passes = 0; setInterval(() => { const b = document.querySelector(".skip"); if (b && getComputedStyle(b).visibility !== "hidden") { (b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); window.__passes++; } }, 150); });
  const typeIn = async (n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
  for (let k = 0; k < 14 && nq < 4; k++) {
    await open(); const now = Date.now(), q = await page.evaluate(() => { const f = window.__app.facts.q; return { v: f.forme === "trouDroite" ? f.b : f.n, pont: !!f.pont }; });
    ev.push(`${k === 0 ? "avant la 1re question (leçon, guide)" : "attente"} ${((now - t) / 1000).toFixed(1)} s${q.pont ? " (pont)" : ""}`);
    await page.waitForTimeout(800); t = Date.now();
    if (q.pont) { await typeIn(q.v); continue; }
    nq++;
    if (nq === 2) { await page.evaluate(() => { const b = [...document.querySelectorAll(".nsp")].find((x) => getComputedStyle(x).visibility !== "hidden"); (b?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); }); ev.push("[NSP]"); }
    else if (nq === 3) { await typeIn(q.v + 1); ev.push("[erreur]"); }
    else await typeIn(q.v);
  }
  const rec = await page.evaluate(() => window.__app.session.rec);
  const passes = PASSER ? await page.evaluate(() => window.__passes) : 0;
  out.push(`calcul rapide, niveau ${niveau}${PASSER ? ` (passer touché ${passes} fois)` : ""} : ${ev.join(" · ")} ; leçons ${JSON.stringify((rec.lecons ?? []).map((l) => l.id + " " + l.dureeS + "s"))} ; ${await gapOf(page)}`);
  console.log(out.at(-1)); await context.close();
}
// lot « Multiplication » : niveaux 1 (leçon L13), 3, 6 (leçon L14) et 9, base neuve, niveau choisi : la leçon d'entrée ou
// l'exemple guidé (les rangées comptées), « je ne sais pas », une erreur (la correction et les rangées comptées) ; puis
// l'aide du coquillage au niveau 3 (les rangées comptées, sans le dernier total)
for (const niveau of [1, 3, 6, 9]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }); await context.addInitScript(MONITOR); const page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  await page.goto(url + `?nosw&cran=conseille&sans=echauffement&choix=5:${niveau}&questions=4`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const open = () => page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked; }, null, { timeout: 240000, polling: 100 });
  const ev = []; let t = Date.now();
  if (PASSER) await page.evaluate(() => { window.__passes = 0; setInterval(() => { const b = document.querySelector(".skip"); if (b && getComputedStyle(b).visibility !== "hidden") { (b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); window.__passes++; } }, 150); });
  const typeIn = async (n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
  for (let k = 0; k < 5; k++) {
    await open(); const now = Date.now(), q = await page.evaluate(() => { const f = window.__app.facts.q; return { v: f.forme === "trouDroite" ? f.b : f.forme === "trouGauche" ? f.a : f.a * f.b, g: !!f.guide }; });
    ev.push(`${k === 0 ? "avant la 1re question (leçon, exemple)" : "attente"} ${((now - t) / 1000).toFixed(1)} s`);
    await page.waitForTimeout(800); t = Date.now();
    if (k === 2) { await page.evaluate(() => { const b = [...document.querySelectorAll(".nsp")].find((x) => getComputedStyle(x).visibility !== "hidden"); (b?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); }); ev.push("[NSP]"); }
    else if (k === 3) { await typeIn(q.v + 1); ev.push("[erreur]"); }
    else if (k === 4 && niveau === 3) { const t1 = Date.now(); await page.tap(".help", { force: true }); await page.waitForTimeout(400); await open(); ev.push(`[coquillage : pavé rendu après ${((Date.now() - t1) / 1000).toFixed(1)} s]`); await typeIn(q.v); }
    else await typeIn(q.v);
  }
  const rec = await page.evaluate(() => window.__app.session.rec);
  const passes = PASSER ? await page.evaluate(() => window.__passes) : 0;
  out.push(`multiplication, niveau ${niveau}${PASSER ? ` (passer touché ${passes} fois)` : ""} : ${ev.join(" · ")} ; leçons ${JSON.stringify((rec.lecons ?? []).map((l) => l.id + " " + l.dureeS + "s"))} ; ${await gapOf(page)}`);
  console.log(out.at(-1)); await context.close();
}
// décision du parent du 27 septembre : l'aide des additions (coquillage au cran conseillé, aide affichée d'emblée
// au cran « plus facile »), appui par appui : durée jusqu'au retour du pavé, apparition de « passer »
for (const [famille, appui] of BLOC ? [[8, "deuxCadres"], [9, "reflet"]] : [[1, "ligne"], [2, "reflet"], [3, "cadre"], [4, "maison"], [6, "doublePlus"], [8, "deuxCadres"], [9, "reflet"]]) for (const cran of ["conseille", "facile"]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }); await context.addInitScript(MONITOR); const page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async (fam) => { const s = window.__app.store; await s.setSetting("mascotte", "Pili"); const { markFamilyKnown } = await import("./js/parent/depart.js"), m2 = await (await fetch("content/module2.json")).json(); for (let f = 1; f < fam; f++) await markFamilyKnown(s, m2, f); }, famille);
  await page.goto(url + `?nosw&cran=${cran}&sans=echauffement&module=2&sansLecon&guides=0&questions=3`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const skipOn = () => page.evaluate(() => [...document.querySelectorAll(".skip")].some((b) => getComputedStyle(b).visibility !== "hidden"));
  const padBack = () => page.waitForFunction(() => { const s = window.__app.facts; return s?.q && s.resolve && !s.locked && [...document.querySelectorAll(".key")].every((k) => getComputedStyle(k).visibility === "visible"); }, null, { timeout: 60000, polling: 50 });
  let t0, sk, appuiVu;
  if (cran === "facile") {
    await page.waitForFunction(() => window.__app.facts?.q?.aideDEmblee, null, { timeout: 120000, polling: 50 }); t0 = Date.now();
    await page.waitForTimeout(150); sk = await skipOn();
  } else {
    await padBack(); await page.waitForTimeout(300); t0 = Date.now(); await page.tap(".help", { force: true }); await page.waitForTimeout(150); sk = await skipOn();
  }
  appuiVu = await page.evaluate(() => window.__app.facts.q.appui);
  if (PASSER) { await page.waitForTimeout(350); await page.tap(".skip", { force: true }); }
  await padBack(); const dt = Date.now() - t0;
  out.push(`aide ${cran === "facile" ? "d'emblée (plus facile)" : "du coquillage"}, ${appuiVu} (famille ${famille})${PASSER ? ", passée" : ""} : pavé rendu après ${(dt / 1000).toFixed(1)} s ; « passer » ${sk ? "visible dès le début" : "ABSENT"} ; ${await gapOf(page)}`);
  console.log(out.at(-1)); await context.close();
}
// lot « Les voiliers » : niveaux 1, 5 et 9 (double encadrement), au calme (cran « plus facile ») : l'exemple guidé, un bon
// passage, « je ne sais pas » (le bateau va seul), une erreur puis une deuxième (le bateau va seul) ; la mer en WebGL
// logiciel (sans processeur graphique, la scène est lente : les gestes suivent l'horloge, pas les images)
const bgl = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const niveau of BLOC ? [] : [1, 5, 9]) {
  const context = await bgl.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }); await context.addInitScript(MONITOR); const page = await context.newPage();
  await page.goto(url + "?nosw"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.goto(url + `?nosw&cran=facile&sans=echauffement&choix=4:${niveau}&questions=8`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  const open = () => page.waitForFunction(() => window.__app.voiliers?.attend, null, { timeout: 240000, polling: 100 });
  const ev = []; let t = Date.now();
  if (PASSER) await page.evaluate(() => { window.__passes = 0; setInterval(() => { const b = document.querySelector(".skip"); if (b && getComputedStyle(b).visibility !== "hidden") { (b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })), b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))); window.__passes++; } }, 300); });
  for (let nq = 1; nq <= 4; nq++) {
    await open(); const now = Date.now(), q = await page.evaluate(() => { const v = window.__app.voiliers; return { k: v.q.k, k2: v.q.k2, n: v.q.bouees.length, rangee: v.api.etat().rangee }; });
    ev.push(`${nq === 1 ? "avant le 1er bateau (exemple guidé)" : "attente"} ${((now - t) / 1000).toFixed(1)} s`);
    await page.waitForTimeout(800); t = Date.now();
    const k = q.rangee === 2 ? q.k2 : q.k, faux = k === 0 ? 2 : 0;
    if (nq === 2) { await page.evaluate(() => { const b = document.querySelector(".voiliers-nsp"); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); }); ev.push("[NSP]"); }
    else if (nq === 3) { await page.evaluate((c) => window.__app.voiliers.api.deposer(c), faux); ev.push("[erreur]"); await open(); ev.push(`retour du bateau ${((Date.now() - t) / 1000).toFixed(1)} s`); await page.waitForTimeout(500); t = Date.now(); await page.evaluate((c) => window.__app.voiliers.api.deposer(c), faux); ev.push("[deuxième erreur]"); }
    else { await page.evaluate((c) => window.__app.voiliers.api.deposer(c), k); if (q.rangee === 1 && niveau === 9) { await open(); await page.waitForTimeout(300); const k2 = await page.evaluate(() => window.__app.voiliers.q.k2); await page.evaluate((c) => window.__app.voiliers.api.deposer(c), k2); } }
  }
  await page.waitForTimeout(4000);
  const passes = PASSER ? await page.evaluate(() => window.__passes) : 0;
  out.push(`voiliers, niveau ${niveau}${PASSER ? ` (passer touché ${passes} fois)` : ""} : ${ev.join(" · ")} ; ${await gapOf(page)}`);
  console.log(out.at(-1)); await context.close();
}
await bgl.close();
await browser.close(); srv.close();
