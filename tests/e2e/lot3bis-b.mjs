// LOT 3 BIS, PARTIE B (docs/SPEC-LOT3BIS.md, B1 à B11) : parcours et captures de l'intégration.
//   node tests/e2e/lot3bis-b.mjs [--out dossier] [--seul choisir,legende,appui,calcul,additions,fins,placer,lecons,parent,cosmetique]
// Parties :
//   choisir   — B1 : les trois écrans de niveaux aux trois formats (numéros, lueur, rien de coupé ni sur la pieuvre)
//   legende   — B2 : la légende ouverte puis fermée par la croix et par un toucher dehors, sans rien lancer
//   appui     — B3 : appui long de 0,8 s sur chaque pictogramme : étiquette, rien de lancé ; toucher bref : lancé
//   calcul    — B4 : l'aide du coquillage (mur et poisson, premier pont dit), les corrections (mur : bonne réponse entourée ;
//               chemin : rassurer, pont rejoué, C4 ou C5), les calculs guidés (l'ardoise garde le calcul), l'annonce du poisson
//   additions — B5 : l'aide de la famille 1 (forme directe, formes à trou : sans dire la réponse), la maison aux poissons
//               (familles 4 et 5, formes directe et à trou ; le cadre de 10 de la famille 5)
//   fins      — B6 : trois étoiles arc-en-ciel à la récompense (une phrase au pluriel, les étoiles qui volent vers l'album,
//               le coquillage à toucher aussitôt) ; la fin du défi est vérifiée par tests/e2e/defi.mjs
//   placer    — B7 : le nombre écrit sur l'étiquette du poisson (plus de rond comme une bulle-réponse), la corde qui ondule,
//               le poisson glissé jusqu'à la corde donne la réponse
//   lecons    — B9 : L2, L8, L9, une capture à chaque phrase dite ; la chronologie voix et sauts de L2 ; durée de L8
//   parent    — B10 : l'espace parent sur une base « un mois » (tools/sauvegarde-test.mjs reel 2 4) : aucun sigle, erreurs
//               d'additions détaillées, « acquise le … (depuis, n sur m) », la légende des niveaux
//   cosmetique — B11 : accueil (bulles hors du rocher), album (médaillons), « réécouter » à l'accueil et en pause, L1 (« 0 saut »),
//               L10 (rien sur le rocher, « 100 » une fois), bulles « 800 », « 900 », le bernard-l'ermite entier, « rejouer »
//   reprise   — R12 : calcul guidé (niveau 7), la maison pendant le « bravo » d'un caillou, visite du récif, « continuer » :
//               la consigne est redite (« On continue ! Plus 1. » ; lot « Correctifs de la tablette » : la phrase du pont, qui a son fichier)
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2), arg = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(arg("--out", "tests/e2e/out/lot3bis-b")); mkdirSync(OUT, { recursive: true });
const ONLY = arg("--seul", null)?.split(","), want = (p) => !ONLY || ONLY.includes(p);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
export const open = async (q = "", { prep = null, prepArg = null, size = [1280, 800], scale = 2 } = {}) => {
  const context = await browser.newContext({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: scale, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  if (prep) await page.evaluate(prep, prepArg);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
};
const tap = async (page, sel, ms = 250) => { await page.tap(sel, { force: true }); await page.waitForTimeout(ms); };
const shot = (page, name) => page.screenshot({ path: join(OUT, `${name}.png`) });
// les boîtes (px logiques) des éléments d'un sélecteur
const boxes = (page, sel) => page.evaluate((sel) => { const ui = document.querySelector("#ui"), k = ui.getBoundingClientRect().width / 1280, o = ui.getBoundingClientRect(); return [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { key: e.dataset.key, x: (r.left - o.left) / k, y: (r.top - o.top) / k, w: r.width / k, h: r.height / k }; }); }, sel);

// B1 : les écrans de niveaux
if (want("choisir")) {
  for (const size of [[1280, 800], [1920, 1200], [1340, 800]]) {
    // des niveaux validés (l'étoile doit rester dans sa plaque) : calcul 1 à 3 acquis, conseillé 4
    const prep = async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [1, 2, 3], obtenus: [], vus: {}, fenetres: {}, lecons: [] }); };
    const { page, context, errors } = await open("&cran=conseille&sans=echauffement", { size, scale: size[0] > 1500 ? 1 : 2, prep });
    await page.waitForSelector(".choisir"); await tap(page, ".choisir"); await page.waitForSelector(".choix-ex");
    for (const ex of ["ligne", "additions", "calcul"]) { // (lot « Les leçons » : les leçons ont quitté « choisir », tests/e2e/lecons-menu.mjs)
      await tap(page, `.choix-ex[aria-label="${ex}"]`, 450); await tap(page, `.choix-ex[aria-label="${ex}"]`); await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(500);
      const b = await boxes(page, ".choix-tuile");
      const inside = b.every((r) => r.x >= 4 && r.y >= 4 && r.x + r.w <= 1276 && r.y + r.h <= 796);
      // la pieuvre (à gauche) et les algues de droite : aucune plaque avant x = 410 ni après x = 1165
      const clear = b.every((r) => r.x >= 410 && r.x + r.w <= 1165);
      const overlap = b.some((r, i) => b.some((s, j) => j > i && r.x < s.x + s.w && s.x < r.x + r.w && r.y < s.y + s.h && s.y < r.y + r.h));
      check(inside && clear && !overlap, `${size.join("×")} ${ex} : ${b.length} plaques dans l'écran, hors de la pieuvre et des algues, sans chevauchement`);
      await shot(page, `B1-${ex}-${size.join("x")}`);
      if (size[0] === 1280) { const c = b.find((r) => r.key === String(ex === "calcul" ? 3 : 1)) ?? b[0]; await page.screenshot({ path: join(OUT, `B1-${ex}-zoom.png`), clip: { x: c.x - 30, y: c.y - 30, width: 2 * c.w + 60, height: 2 * c.h + 60 } }); }
      await tap(page, ".choix-retour"); await page.waitForSelector(".choix-ex");
    }
    check(!errors.length, `${size.join("×")} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

// un appui tenu `ms` millisecondes (vrai toucher : Input.dispatchTouchEvent), au centre d'un élément
const hold = async (page, sel, ms) => {
  const b = await page.locator(sel).first().boundingBox(), x = b.x + b.width / 2, y = b.y + b.height / 2, cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await page.waitForTimeout(ms);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.detach();
};
const inScreen = async (page, sel) => (await boxes(page, sel)).every((r) => r.x >= 0 && r.y >= 0 && r.x + r.w <= 1280 && r.y + r.h <= 800);

// B2 : la légende
if (want("legende")) {
  const { page, context, errors } = await open("&cran=conseille&sans=echauffement");
  await page.waitForSelector(".choisir"); await tap(page, ".choisir"); await page.waitForSelector(".choix-ex");
  for (const ex of ["ligne", "additions", "calcul"]) { // (lot « Les leçons » : les leçons ont quitté « choisir », tests/e2e/lecons-menu.mjs)
    await tap(page, `.choix-ex[aria-label="${ex}"]`, 450); await tap(page, `.choix-ex[aria-label="${ex}"]`); await page.waitForSelector(".legende");
    const lb = (await boxes(page, ".legende"))[0], tiles = await boxes(page, ".choix-tuile");
    check(!tiles.some((r) => lb.x < r.x + r.w && r.x < lb.x + lb.w && lb.y < r.y + r.h && r.y < lb.y + lb.h), `${ex} : le bouton de la légende est hors de la zone des plaques`);
    const spoken = await page.evaluate(() => (window.__app.voice.log ?? []).length);
    await tap(page, ".legende"); await page.waitForSelector(".legende-panneau"); await page.waitForTimeout(300);
    const n = await page.locator(".legende-ligne").count();
    check(n === tiles.length, `${ex} : le panneau a une ligne par niveau (${n} / ${tiles.length})`);
    await shot(page, `B2-legende-${ex}`);
    if (ex === "ligne") { await page.evaluate(() => { document.querySelector(".legende-defile").scrollTop = 10000; }); await page.waitForTimeout(200); await shot(page, "B2-legende-ligne-bas"); }
    // fermer : la croix (ligne, calcul), un toucher dehors (additions, leçons)
    if (ex === "ligne" || ex === "calcul") await tap(page, ".legende-fermer");
    else { const cdp = await context.newCDPSession(page), vp = page.viewportSize(); await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: vp.width * 0.05, y: vp.height * 0.95 }] }); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await page.waitForTimeout(300); }
    const st = await page.evaluate(() => ({ panneau: !!document.querySelector(".legende-panneau"), tuiles: document.querySelectorAll(".choix-tuile").length, runner: !!window.__app.session }));
    check(!st.panneau && st.tuiles === tiles.length && !st.runner, `${ex} : fermée (${ex === "ligne" || ex === "calcul" ? "la croix" : "toucher dehors"}), rien de lancé, les plaques toujours là`);
    await tap(page, ".choix-retour"); await page.waitForSelector(".choix-ex");
  }
  check(!errors.length, `légende : aucune erreur (${errors.join(" | ")})`); await context.close();
}

// B3 : l'appui long sur les pictogrammes
if (want("appui")) {
  const { page, context, errors } = await open("&cran=conseille&sans=echauffement");
  await page.waitForSelector(".choisir"); await page.waitForTimeout(300);
  for (const [sel, key] of [[".play", "jouer"], [".choisir", "choisir"], [".reefkey", "recif"], [".albumkey", "album"]]) {
    await hold(page, sel, 800); await page.waitForTimeout(100);
    const st = await page.evaluate(() => ({ lab: !!document.querySelector(".etiquette"), home: !!document.querySelector(".choisir"), choix: !!document.querySelector(".choix-ex"), session: !!window.__app.session }));
    check(st.lab && st.home && !st.choix && !st.session && (await inScreen(page, ".etiquette")), `accueil, appui long de 0,8 s sur « ${key} » : étiquette visible (dans l'écran), rien de lancé`);
    await shot(page, `B3-appui-${key}`);
    await page.waitForTimeout(600);
    check(!(await page.locator(".etiquette").count()), `« ${key} » : l'étiquette a disparu 0,5 s après le lever du doigt (lot 3 ter, T3)`);
  }
  await tap(page, ".choisir"); await page.waitForSelector(".choix-ex");
  check(true, "accueil, toucher bref sur « choisir » : l'écran des exercices s'ouvre");
  for (const ex of ["ligne", "additions", "calcul"]) { // (lot « Les leçons » : les leçons ont quitté « choisir », tests/e2e/lecons-menu.mjs)
    await hold(page, `.choix-ex[aria-label="${ex}"]`, 800); await page.waitForTimeout(100);
    const st = await page.evaluate(() => ({ lab: !!document.querySelector(".etiquette"), tiles: document.querySelectorAll(".choix-tuile").length }));
    check(st.lab && !st.tiles && (await inScreen(page, ".etiquette")), `« choisir », appui long de 0,8 s sur « ${ex} » : étiquette, rien de lancé`);
    await shot(page, `B3-appui-${ex}`);
  }
  await tap(page, '.choix-ex[aria-label="calcul"]', 450); await tap(page, '.choix-ex[aria-label="calcul"]'); await page.waitForSelector(".choix-tuile");
  check(true, "toucher bref sur « calcul » : ses niveaux s'ouvrent");
  check(!errors.length, `appui long : aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- B4 : le calcul rapide
const spy = (page) => page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
const said = (page) => page.evaluate(() => window.__said.join(" | "));
const waitQ = (page) => page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 60000 });
const typeN = async (page, n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
const curQ = (page) => page.evaluate(() => { const f = window.__app.facts, q = f.q; return { a: q.a, op: q.op, b: q.b, n: q.n, forme: q.forme, pont: !!q.pont, niveau: q.niveau, type: q.type, support: q.support, parent: q.parent ? { a: q.parent.a, op: q.parent.op, b: q.parent.b, n: q.parent.n } : null, i: q.i, slateQ: f.slateQ ? { a: f.slateQ.a, b: f.slateQ.b } : null }; });
const slate = (page) => page.evaluate(() => { const f = window.__app.facts; return { typed: f.typed, ring: f.ring, slateQ: !!f.slateQ }; });
const calcOpen = (niveau, cran = "conseille", vus = { [niveau]: 10 }, extra = "&sansLecon") => open(`&cran=${cran}&choix=3:${niveau}${extra}`, { prepArg: vus, prep: async (vus) => { await window.__app.store.setSetting("echauffement", false); await window.__app.store.put("niveaux", { module: 3, acquis: [], obtenus: [], vus, fenetres: {}, lecons: ["L7", "L8", "L9"] }); } });
if (want("calcul")) {
  // l'annonce aux niveaux du mur (le poisson à l'écran) ; l'aide du coquillage au mur ; une erreur au mur
  for (const niveau of [2, 6]) {
    const { page, context, errors } = await open(`&cran=conseille&choix=3:${niveau}&sansLecon`, { prep: async () => { await window.__app.store.setSetting("echauffement", false); await window.__app.store.put("niveaux", { module: 3, acquis: [], obtenus: [], vus: { 2: 10, 6: 10 }, fenetres: {}, lecons: ["L7", "L8"] }); } });
    await spy(page); await page.tap(".play", { force: true });
    if (niveau === 2) {
      await page.waitForFunction(() => window.__app.calc?.fish?.a.vis, null, { polling: 50, timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(500); await shot(page, "B4-annonce-mur");
      const s0 = await said(page);
      check(/poisson/.test(s0), `niveau 2 : l'annonce parle du poisson, montré à l'écran pendant la phrase (${s0})`);
    }
    await waitQ(page); const q = await curQ(page);
    await page.tap(".bubble.help", { force: true });
    await page.waitForFunction(() => window.__app.calc?.fish?.a.vis && window.__app.aidBoard, null, { polling: 50, timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(900); await shot(page, `B4-aide-mur-${niveau}`);
    await waitQ(page); await page.waitForTimeout(300);
    const s1 = await said(page);
    check(/le poisson (descend|monte)/.test(s1), `niveau ${niveau}, coquillage : le mur, le poisson fait le premier pas, dit (« ${s1.split(" | ").filter((x) => /poisson/.test(x)).pop()} »)`);
    await shot(page, `B4-aide-mur-${niveau}-apres`);
    // une erreur : la bonne réponse entourée dès le début, jamais la fausse égalité
    const wrong = q.op === "+" ? q.n + 1 : q.n - 1; await typeN(page, wrong);
    await page.waitForFunction(() => window.__app.calc?.fish?.a.vis, null, { polling: 50, timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(400); const sl = await slate(page);
    check(sl.ring && Number(sl.typed) === q.n, `niveau ${niveau}, correction au mur : la bonne réponse entourée (${sl.typed}), pas « ${q.a} ${q.op} ${q.b} = ${wrong} »`);
    await shot(page, `B4-correction-mur-${niveau}`);
    check(!errors.length, `niveau ${niveau} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // le chemin : l'aide dit le premier pont (niveau 7) ou le départ (niveau 1) ; une erreur au niveau 7 (C4)
  for (const niveau of [1, 7, 9]) {
    const { page, context, errors } = await calcOpen(niveau);
    await spy(page); await page.tap(".play", { force: true }); await waitQ(page);
    const s0 = await said(page);
    check(!/poisson/.test(s0), `niveau ${niveau} (chemin) : l'annonce ne parle pas du poisson (${s0.split(" | ")[0]})`);
    const q = await curQ(page);
    await page.tap(".bubble.help", { force: true }); await waitQ(page); await page.waitForTimeout(400);
    const s1 = await said(page);
    check(niveau === 1 ? /On part de/.test(s1) : /D'abord, on va jusqu'à/.test(s1), `niveau ${niveau}, coquillage : ${niveau === 1 ? "« On part de … Suis le pont. »" : "« D'abord, on va jusqu'à … »"}`);
    await shot(page, `B4-aide-chemin-${niveau}`);
    if (niveau > 1) {
      const wrong = niveau === 7 ? Math.floor(q.a / 10) * 10 + ((q.a % 10) + q.b) % 10 : Math.floor(q.a / 10) * 10 + (q.b - (q.a % 10));
      await typeN(page, wrong);
      await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(1200); await shot(page, `B4-correction-chemin-${niveau}`);
      await waitQ(page); const s = (await said(page)).split(" | "), i0 = s.lastIndexOf("Ce n'est pas grave, regardons ensemble."), i1 = s.findIndex((x, i) => i > i0 && /dépasse dix|casse une dizaine/.test(x));
      check(i0 >= 0 && i1 > i0 && !s.slice(i0).includes(`C'était ${q.n}.`), `niveau ${niveau}, erreur ${niveau === 7 ? "C4" : "C5"} : « Ce n'est pas grave… », les ponts, puis « ${s[i1]} » (plus de « C'était ${q.n}. » seul)`);
    }
    check(!errors.length, `niveau ${niveau} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  // les calculs guidés d'un nouveau niveau (7, puis 9) : l'ardoise garde le calcul ; une erreur puis « je ne sais pas » sur un caillou
  for (const niveau of [7, 9]) {
    const { page, context, errors } = await calcOpen(niveau, "conseille", {});
    await spy(page);
    await page.tap(".play", { force: true }); await waitQ(page); await page.waitForTimeout(300);
    const q = await curQ(page);
    check(q.pont && q.slateQ && q.slateQ.a === q.parent.a, `niveau ${niveau}, calcul guidé : l'ardoise garde « ${q.parent.a} ${q.parent.op} ${q.parent.b} = ? » pendant l'étape (${q.a} ${q.op} ${q.b})`);
    await shot(page, `B4-guide-${niveau}-etape1`);
    if (niveau === 7) await typeN(page, q.n + 1); else { await page.tap(".nsp", { force: true }); }
    await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(1300); await shot(page, `B4-guide-${niveau}-correction`);
    await waitQ(page);
    const s = await said(page);
    check(/Ce n'est pas grave/.test(s) && (niveau === 7 ? /dépasse dix/ : /casse une dizaine/).test(s), `niveau ${niveau}, ${niveau === 7 ? "erreur" : "« je ne sais pas »"} sur un caillou : rassurer, le pont rejoué, puis ${niveau === 7 ? "C4" : "C5"}`);
    const q2 = await curQ(page); await typeN(page, q2.n);
    await page.waitForFunction(() => { const f = window.__app.facts; return f.ring && !f.slateQ; }, null, { polling: 50, timeout: 15000 }).catch(() => {});
    const sl = await slate(page); await shot(page, `B4-guide-${niveau}-fin`);
    check(sl.ring && Number(sl.typed) === q.parent.n, `niveau ${niveau} : à la fin, le résultat écrit dans la bulle (${sl.typed})`);
    check(!errors.length, `guidé ${niveau} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

// ---------------------------------------------------------------- B5 : les aides des additions
if (want("additions")) {
  const cases = [
    [1, { a: 8, b: 2, forme: "directe" }, "f1-directe"], [1, { a: 2, b: 8, forme: "trouGauche" }, "f1-trou"],
    [4, { a: 4, b: 3, forme: "directe" }, "f4-directe"], [4, { a: 4, b: 3, forme: "trouDroite" }, "f4-trou"],
    [5, { a: 5, b: 3, forme: "directe" }, "f5-directe"], [5, { a: 6, b: 3, forme: "trouGauche" }, "f5-trou"],
  ];
  for (const [fam, over, name] of cases) {
    const { page, context, errors } = await open(`&cran=conseille&choix=2:${fam}&sans=echauffement&sansLecon`);
    await spy(page); await page.tap(".play", { force: true }); await waitQ(page);
    // la question en cours devient le cas voulu (même famille), puis le coquillage
    await page.evaluate(([over, fam]) => { const f = window.__app.facts; Object.assign(f.q, over, { n: over.a + over.b, famille: fam, guide: false, aideDEmblee: false, appui: undefined }); f.slate.repaint(); }, [over, fam]);
    await page.waitForTimeout(200);
    const g0 = await page.evaluate(() => window.__app.aidBoard?.gen ?? 0);
    await page.tap(".bubble.help", { force: true });
    if (fam === 1) { await page.waitForFunction(() => window.__app.lineScreen?.().arcs?.length >= 1, null, { polling: 50, timeout: 15000 }).catch(() => {}); await page.waitForTimeout(900); }
    else await page.waitForTimeout(300);
    await shot(page, `B5-aide-${name}-a`);
    if (fam > 1) { await page.waitForFunction((g0) => window.__app.aidBoard.gen - g0 >= 21, g0, { polling: 20, timeout: 8000 }).catch(() => {}); await shot(page, `B5-aide-${name}-b`); }
    await waitQ(page);
    const s = (await said(page)).split(" | ");
    if (fam === 1 && over.forme !== "directe") check(s.some((x) => /jusqu'à 10/.test(x)) && !s.slice(s.findIndex((x) => /jusqu'à 10/.test(x))).some((x) => /fait (un saut|\d sauts)|^[0-9]+$/.test(x)), `famille 1, « ? + 8 = 10 » : « Compte les sauts avec la tortue jusqu'à 10. », sans dire le nombre de sauts (${s.slice(-6).join(" / ")})`);
    if (fam === 1 && over.forme === "directe") check(s.some((x) => /La tortue est sur 8/.test(x)), "famille 1, « 8 + 2 » : la tortue fait les sauts");
    if (fam > 1) check(s.some((x) => (over.forme === "directe" ? /montent sous le toit/ : /places vides/).test(x)), `famille ${fam}, ${over.forme} : ${over.forme === "directe" ? "« … montent sous le toit : compte-les tous ! »" : "« Sous le toit, il y a n places. Compte les places vides ! »"}`);
    check(!errors.length, `${name} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

// ---------------------------------------------------------------- B6 : les étoiles arc-en-ciel à la récompense
if (want("fins")) {
  const prep = async () => { const s = window.__app.store; await s.put("recompenses", { id: "etoiles", total: 40, cumul: 40, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 3, coquillages: 0, coquillagesDores: 0 }); };
  const { page, context, errors } = await open("&cran=conseille&sans=echauffement,notion,defi", { prep });
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; window.__saidAt = []; v.say = (t, o) => { window.__said.push(t); window.__saidAt.push(performance.now()); return say(t, o); }; });
  await page.tap(".play", { force: true });
  await page.waitForSelector(".etoile-vol", { timeout: 60000 }); await page.waitForTimeout(500); await shot(page, "B6-etoiles-arc-posees");
  await page.waitForTimeout(700); await shot(page, "B6-etoiles-arc-vol");
  await page.waitForSelector(".shelltap", { timeout: 20000 });
  const r = await page.evaluate(() => { const i = window.__said.findIndex((t) => /arc-en-ciel/.test(t)); return { arc: window.__said.filter((t) => /arc-en-ciel/.test(t)), dt: performance.now() - window.__saidAt[i] }; });
  await shot(page, "B6-coquillage-a-toucher");
  check(r.arc.length === 1 && /^3 étoiles arc-en-ciel ! Un jour, elles/.test(r.arc[0]), `une seule phrase, au pluriel (« ${r.arc.join(" | ")} »)`);
  check(r.dt < 6000, `le coquillage est à toucher ${(r.dt / 1000).toFixed(1)} s après le début de la phrase (voix accélérée)`);
  check(!errors.length, `fins : aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- B7 : « placer »
if (want("placer")) {
  for (const [niveau, format] of [[2, "placer"], [9, "placer"], [8, "estimer"]]) {
    const { page, context, errors } = await open(`&cran=conseille&choix=1:${niveau}&format=${format}&sans=echauffement&sansLecon&guides=0`);
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.input && !s.locked; }, null, { timeout: 60000 });
    await page.waitForTimeout(250); await shot(page, `B7-${format}-${niveau}-debut`);
    const st = await page.evaluate(() => { const s = window.__app.screen; return { label: s.fishLabel, answer: s.q.answer, bulles: document.querySelectorAll(".answer").length, x: s.xOf(s.q.answer) }; });
    check(st.label === String(st.answer) && st.bulles === 0, `niveau ${niveau}, ${format} : le nombre ${st.answer} est sur l'étiquette du poisson, aucun rond comme une bulle-réponse`);
    await page.waitForTimeout(900);
    // glisser le poisson (vrai toucher) jusqu'au-dessus de la bonne graduation, puis le lâcher
    const vp = page.viewportSize(), k = vp.width / 1280, cdp = await context.newCDPSession(page), P = (x, y) => ({ x: x * k, y: y * k });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [P(640, 640)] });
    for (let i = 1; i <= 8; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [P(640 + ((st.x - 640) * i) / 8, 640 - (170 * i) / 8)] }); await page.waitForTimeout(40); }
    await page.waitForTimeout(200); await shot(page, `B7-${format}-${niveau}-glisse`);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(600); await shot(page, `B7-${format}-${niveau}-pose`);
    const rep = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 1).at(-1));
    check(rep && rep.juste, `niveau ${niveau}, ${format} : le poisson glissé sur la corde donne la réponse (${rep?.reponse ?? rep?.valeur}, juste : ${rep?.juste})`);
    check(!errors.length, `${format} ${niveau} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

// ---------------------------------------------------------------- B9 : les leçons L2, L8, L9
if (want("lecons")) {
  for (const id of ["L2", "L8", "L9"]) {
    // voix réelle (non accélérée) : la chronologie et la durée sont celles de la tablette
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url + "?nosw&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
    await page.goto(url + `?nosw&son=non&lecon=${id}`); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(() => {
      const v = window.__app.voice, say = v.say.bind(v), t0 = performance.now(); window.__said = []; window.__jumps = [];
      v.say = (t, o) => { window.__said.push({ t: performance.now() - t0, text: t }); return say(t, o); };
      const T = window.__app.lineScreen().turtle, j = T.jump.bind(T); T.jump = (i) => { window.__jumps.push({ t: performance.now() - t0, i }); return j(i); };
    });
    const start = Date.now();
    await page.tap(".play", { force: true });
    let n = 0;
    for (;;) {
      const done = await page.waitForFunction((n) => window.__said.length > n || (window.__lecon !== undefined), n, { timeout: 90000, polling: 50 }).then(() => page.evaluate(() => window.__lecon !== undefined));
      const len = await page.evaluate(() => window.__said.length);
      if (len > n) { n = len; await page.waitForTimeout(id === "L2" ? 450 : 900); await shot(page, `B9-${id}-${String(n).padStart(2, "0")}`); }
      else if (done) break;
    }
    const dur = (Date.now() - start) / 1000, said = await page.evaluate(() => window.__said), jumps = await page.evaluate(() => window.__jumps);
    console.log(`     ${id} : ${said.length} phrases en ${dur.toFixed(1)} s`);
    if (id === "L2") {
      // chaque saut part au moment où son nombre est dit (« dix, », « vingt, », « trente… »)
      const lag = ["dix,", "vingt,", "trente…"].map((w, k) => { const s = said.find((x) => x.text === w), jmp = jumps.filter((x) => x.i > 0)[k]; return s && jmp ? Math.round(jmp.t - s.t) : null; });
      check(lag.every((d) => d !== null && Math.abs(d) < 200), `L2 : chaque saut part avec son nombre (écarts voix → saut : ${lag.join(", ")} ms)`);
      const geant = await page.evaluate(() => { const S = window.__app.lessons.p ?? null; return !!window.__app.lineScreen().spec?.geant; });
      check(geant, "L2 : la corde aux bouées géantes");
    }
    if (id === "L8") check(dur >= 25 && dur <= 50, `L8 : deux exemples, ${dur.toFixed(0)} s (cible 30 à 45 s)`);
    check(!errors.length, `${id} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

// ---------------------------------------------------------------- B10 : l'espace parent
if (want("parent")) {
  const f = join(OUT, "sauvegarde-un-mois.json");
  execFileSync("node", ["tools/sauvegarde-test.mjs", "reel", "2", "4", "--sortie", f], { stdio: "ignore" });
  const dump = JSON.parse(readFileSync(f, "utf8"));
  const { page, context, errors } = await open("", { prepArg: dump, prep: async (dump) => { await window.__app.store.restore(dump, ["reglages"]); await window.__app.store.setSetting("codeParent", "1234"); } });
  page.evaluate(() => window.__app.parent.open()).catch(() => {}); await page.waitForSelector(".pa-keys", { timeout: 10000 });
  for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
  await page.waitForTimeout(600); await page.click('.pa-tabs button:has-text("Progression")'); await page.waitForTimeout(800);
  const txt = await page.evaluate(() => document.querySelector(".pa-sheet")?.innerText ?? document.body.innerText);
  const sigles = [...txt.matchAll(/\b([EC][1-7])\b|SPEC|l'une des deux/g)].map((m) => m[0]);
  check(!sigles.length, `onglet Progression : aucun sigle ni mot de conception (${sigles.join(", ") || "aucun"})`);
  const add = await page.evaluate(() => [...document.querySelectorAll(".pa-err")].map((e) => e.innerText.replace(/\s+/g, " ")).filter((t) => /additions/.test(t)));
  check(add.length > 0, `journal : erreurs d'additions détaillées (${add.slice(0, 3).join(" | ")})`);
  const acq = await page.evaluate(() => [...document.querySelectorAll(".pa-fam td")].map((t) => t.innerText).filter((t) => /acquise/.test(t)));
  check(acq.every((t) => /acquise( le \d\d\/\d\d)?.*\(depuis, \d+ sur \d+\)/.test(t)), `familles : « acquise le … (depuis, n sur m) » (${acq.join(" ; ") || "aucune acquise"})`);
  for (const [sel, name] of [[".pa-fam", "B10-parent-familles"], [".pa-err", "B10-parent-journal"], [".pa-niveaux", "B10-parent-legende"]]) {
    await page.evaluate((sel) => { const e = document.querySelector(sel); if (e?.tagName === "DETAILS") e.open = true; e?.scrollIntoView({ block: "start" }); document.querySelector(".pa-sheet")?.scrollBy?.(0, -90); }, sel);
    await page.waitForTimeout(300); await shot(page, name);
  }
  // le détail des séances : chaque erreur en une phrase, sans son code
  await page.tap('[data-tab="seances"]'); await page.waitForTimeout(300);
  const n = await page.locator(".pa-session > button").count();
  for (let i = 0; i < n; i++) await page.locator(".pa-session > button").nth(i).click();
  await page.waitForTimeout(300);
  const txt3 = await page.evaluate(() => document.body.innerText), sig3 = [...txt3.matchAll(/\b([EC][1-7]) ·/g)].map((m) => m[1]);
  check(!sig3.length, `détail des ${n} séances : les erreurs en phrases, sans code (${sig3.slice(0, 5).join(", ") || "aucun code"})`);
  await page.click('.pa-tabs button:has-text("Données et réglages")'); await page.waitForTimeout(600);
  const txt2 = await page.evaluate(() => document.body.innerText);
  check(!/l'une des deux|SPEC/.test(txt2) && /l'un des cinq exercices, voiliers et multiplication compris/.test(txt2), "réglages : « imposer l'un des cinq exercices, voiliers et multiplication compris » (lots « Les voiliers » et « Multiplication »)");
  check(!errors.length, `parent : aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- B11 : la cosmétique
if (want("cosmetique")) {
  {
    const { page, context, errors } = await open("&cran=conseille");
    await page.waitForSelector(".choisir"); await page.waitForTimeout(400); await shot(page, "B11-accueil");
    // les bulles de l'accueil ne sont plus posées sur le rocher de droite (x 1024 à 1203, y 600 à 665)
    // (lot « Les leçons » : cinq bulles ; le fond est le lagon depuis le lot « Lagon », ce rocher n'existe plus : les bulles,
    // de 60 px de rayon, restent entre le rocher de gauche, jusqu'à x 285, et le corail de droite, depuis x 1155)
    const b = await boxes(page, ".play, .choisir, .leconskey, .reefkey, .albumkey");
    check(b.length === 5 && b.every((r) => r.x + r.w / 2 - 60 >= 285 && r.x + r.w / 2 + 60 <= 1155), `accueil : les cinq bulles entre le rocher de gauche et le corail de droite (${b.map((r) => Math.round(r.x + r.w / 2)).join(", ")})`);
    await spy(page); await page.tap(".mascotte-tap", { force: true }); await page.waitForTimeout(600);
    check(/Touche une bulle/.test(await said(page)), "accueil : « réécouter » dit ce qu'on peut faire");
    await tap(page, ".albumkey"); await page.waitForSelector(".album-tab"); await page.waitForTimeout(700); await shot(page, "B11-album");
    check((await page.locator(".album-tab").count()) === 4, "album : quatre médaillons de zone");
    check(!errors.length, `accueil, album : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  {
    // en pause : « réécouter » visible et qui répond
    const { page, context, errors } = await open("&cran=conseille&choix=2:3&sans=echauffement&sansLecon");
    await page.tap(".play", { force: true }); await waitQ(page); await page.waitForTimeout(300);
    await page.tap(".session-home", { force: true }); await page.waitForSelector(".play.keep"); await page.waitForTimeout(400);
    const vis = await page.evaluate(() => getComputedStyle(document.querySelector(".mascotte-tap")).visibility);
    // (lot « Correctifs de la tablette » : on touche la mascotte, qui remplace le bouton « réécouter »)
    await spy(page); await page.tap(".mascotte-tap", { force: true }); await page.waitForTimeout(800);
    check(vis === "visible" && /C'est la pause/.test(await said(page)), `pause : « réécouter » visible (${vis}) et qui répond`);
    await shot(page, "B11-pause-reecouter");
    await page.tap(".play.keep", { force: true }); await waitQ(page); await page.waitForTimeout(300);
    const b = await boxes(page, ".nsp");
    await shot(page, "B11-bernard");
    check(!errors.length, `pause : aucune erreur (${errors.join(" | ")})`); void b; await context.close();
  }
  for (const [q, name, waitFor] of [["&lecon=L1", "L1", 6], ["&lecon=L10", "L10", 99]]) {
    const { page, context, errors } = await open(`&cran=conseille${q}`);
    await spy(page); await page.tap(".play", { force: true });
    let n = 0;
    for (let k = 0; k < 60; k++) {
      const len = await page.evaluate(() => window.__said.length), done = await page.evaluate(() => window.__lecon !== undefined);
      if (len > n) { n = len; await page.waitForTimeout(500); await shot(page, `B11-${name}-${String(n).padStart(2, "0")}`); if (n >= waitFor) break; }
      if (done) break;
      await page.waitForTimeout(250);
    }
    const rj = (await boxes(page, ".rejouer"))[0];
    if (rj) check(rj.y + rj.h < 460, `${name} : « rejouer » en haut à droite, sous « passer » (y ${Math.round(rj.y)})`);
    check(!errors.length, `${name} : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
  {
    const { page, context, errors } = await open("&cran=conseille&choix=1:9&format=lire&sans=echauffement&sansLecon&guides=0");
    await page.tap(".play", { force: true }); await page.waitForSelector(".answer"); await page.waitForTimeout(600); await shot(page, "B11-bulles-centaines");
    check(!errors.length, `bulles : aucune erreur (${errors.join(" | ")})`); await context.close();
  }
}

// ---------------------------------------------------------------- R12 : la reprise d'un calcul guidé après une visite du récif
if (want("reprise")) {
  const { page, context, errors } = await calcOpen(7, "conseille", {});
  await spy(page); await page.tap(".play", { force: true });
  await page.waitForFunction(() => { const f = window.__app.facts; return f?.q?.pont && f.resolve && !f.locked; }, null, { timeout: 30000 });
  const n = await page.evaluate(() => window.__app.facts.q.n); await typeN(page, n);
  await page.waitForTimeout(250); await page.tap(".session-home", { force: true }); await page.waitForSelector(".reefkey.keep");
  await page.tap(".reefkey.keep", { force: true }); await page.waitForTimeout(2500);
  await page.tap(".homekey:not(.session-home)", { force: true }); await page.waitForSelector(".play.keep");
  await page.evaluate(() => { window.__said = []; });
  await page.tap(".play.keep", { force: true }); await page.waitForTimeout(3000);
  const s = await said(page);
  check(/^On continue ! Plus \d+\./.test(s), `calcul guidé, pause pendant le « bravo », visite du récif, « continuer » : la consigne est redite (« ${s} »)`);
  await shot(page, "R12-reprise-calcul-guide");
  check(!errors.length, `reprise : aucune erreur (${errors.join(" | ")})`); await context.close();
}

await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} ÉCHEC(S)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
