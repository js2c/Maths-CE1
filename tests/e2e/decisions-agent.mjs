// LE PARCOURS DU LOT « DÉCISIONS SUR LES CONSTATS DE L'AGENT » (docs/LOTS.md, fiche 11 ; décisions du parent du 13 octobre 2026)
// dans Chromium, tactile, voix accélérée. Il passe par chaque décision et en fait les captures, en 1280 × 800, 1920 × 1200 et
// 1138 × 711 densité 2,25 (la tablette) :
//  2. la fin de séance : la maison à côté du bouton de la boutique (touchée : « à demain » aussitôt) ; sans toucher, « à demain »
//     au bout de 15 s ;
//  3. l'accueil en pause en deux touchers : le premier toucher sur « continuer » le sélectionne et la mascotte dit ce que c'est,
//     le second reprend ; le double toucher rapide reprend aussitôt ; le second toucher de l'enfant ne tombe jamais dans le pavé
//     (aucune réponse enregistrée par mégarde) ; les autres galets de la pause aussi ;
//  7. la boutique : le prix pour faire briller n'est jamais écrit sur la tuile ; il est dit, et montré avec la coche, quand
//     l'enfant touche la tuile ; juste après un achat, la tuile n'affiche aucun prix ;
//  6. les voiliers : un toucher sur un passage fait dire « Fais glisser le bateau jusqu'au passage ! » et la flèche montre le
//     geste, droit sous le bateau, sans désigner de passage (décision du 14 octobre), au plus une fois par bateau ; le glisser reste le geste qui répond ;
//  4. la bulle de la mascotte évite aussi ce dont parle la voix : l'égalité de l'aide de la tortue, le chemin du calcul rapide,
//     la bouée nommée aux voiliers, l'article allumé de l'étal et son ardoise ; sans place, une bulle plus courte, ou pas de bulle ;
//  8. la finition : le compteur d'étoiles lisible dans l'étal par temps d'orage (une plaque claire) ; dans l'étal, la bulle pointe
//     vers la bouche de la mascotte dans la fenêtre et ne se pose plus sous le rebord ; l'étoile arc-en-ciel vole vers l'album ;
//  1. la reprise d'une séance après un rechargement de la page, le jour même, au début de l'étape en cours : pendant l'échauffement,
//     la notion du jour (une leçon en cours, une leçon déjà passée, une correction, le vol des étoiles), le défi ; pendant une
//     pause ; deux rechargements de suite ; après minuit (pas de reprise) ; « continuer » à l'accueil, les réponses, les étoiles,
//     le cran gardés, le bilan qui compte toute la séance, la reprise notée pour le parent. (Le rechargement avec une nouvelle
//     version de l'application : tests/e2e/mise-a-jour.mjs, étapes 3 et 4.)
// Captures dans tests/e2e/out/decisions-agent/ ; échoue si une vérification échoue ou si la page a une erreur.
//   node tests/e2e/decisions-agent.mjs [--out dossier] [--vite] [--seul 2,3]   (--vite : seulement 1280 × 800)
import { accueilReel, chromium, finReelle } from "./navigateur.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert } from "./recif-commun.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/decisions-agent")); mkdirSync(OUT, { recursive: true });
const SEUL = opt("--seul", null)?.split(","), faire = (n) => !SEUL || SEUL.includes(String(n));
const T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url)));
const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));
const { srv, url } = await serve(0);
// (le WebGL logiciel, pour la mer des voiliers, comme tests/e2e/voiliers.mjs)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const errors = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const VUES = args.includes("--vite") ? [["1280", { width: 1280, height: 800 }, 1]] : [["1280", { width: 1280, height: 800 }, 1], ["1920", { width: 1920, height: 1200 }, 1], ["tablette", { width: 1138, height: 711 }, 2.25]];
const Q = "?nosw&voix=rapide";
const DAY = 86400000;

// une page neuve ; `prep(store)` (dans la page) pose un état, puis la page est rechargée avec `q`
async function fresh({ q = Q, vue = VUES[0], prep = null, arg = null, reel = true, fin = false } = {}) {
  if (process.env.JALONS) console.log(`  … page neuve ${q}`);
  const context = await browser.newContext({ viewport: vue[1], deviceScaleFactor: vue[2], hasTouch: true });
  if (reel) await accueilReel(context);
  if (fin) await finReelle(context);
  const page = await context.newPage();
  page.on("pageerror", (e) => { errors.push(e.message); console.log("ERREUR PAGE", e.message); }); page.on("console", (m) => { if (m.type() === "error") { errors.push(m.text()); console.log("ERREUR CONSOLE", m.text()); } });
  await page.goto(url + Q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async ([p, a]) => { const s = window.__app.store; await s.wipe(); await s.setSetting("codeParent", "1234"); if (p) await (0, eval)(`(${p})`)(s, a); }, [prep?.toString() ?? null, arg]);
  await page.goto(url + q); await page.waitForFunction(() => window.__ready !== undefined);
  await espion(page);
  return { context, page };
}
// les phrases dites (window.__said), relevées depuis le dernier `saidReset`
// (et chaque bulle posée : son texte, visible ou non, en bulle courte ou non, ce qu'elle couvre des zones déclarées : window.__bulles)
const espion = (page) => page.evaluate(() => {
  const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); };
  const b = window.__app.bulle, dire = b.dire.bind(b), inter = (a, o) => Math.min(a[2], o[2]) - Math.max(a[0], o[0]) > 1 && Math.min(a[3], o[3]) - Math.max(a[1], o[1]) > 1; window.__bulles = [];
  b.dire = (t, ms) => { dire(t, ms); const e = b.etat(); window.__bulles.push({ t, texte: e.texte, visible: e.visible, court: e.court, zones: e.zones.length, couvre: e.visible && e.rect ? e.zones.some((z) => inter(e.rect, z)) : false, ...(e.visible ? {} : { durs: b.obstacles().durs.map((r) => r.map(Math.round)) }) }); };
});
const said = (page) => page.evaluate(() => window.__said.join(" | "));
const saidReset = (page) => page.evaluate(() => { window.__said = []; });
const shot = (page, vue, nom) => page.screenshot({ path: join(OUT, `${nom}-${vue[0]}.png`) });
// un toucher au centre d'un élément (les boutons qui se balancent ne sont jamais « stables » pour Playwright)
const boite = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); return b; };
const tap = async (page, sel) => { const b = await boite(page, sel); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const visible = (page, sel) => page.evaluate((sel) => [...document.querySelectorAll(sel)].some((e) => e.isConnected && e.checkVisibility({ visibilityProperty: true })), sel);
const attendre = (page, f, arg, ms = 30000) => page.waitForFunction(f, arg, { timeout: ms }).then(() => true, () => false);
// une question des additions attend sa réponse
const questionPrete = (page) => attendre(page, () => { const f = window.__app.facts; return !!(f?.q && f.resolve && !f.locked && document.querySelector(".key")); });
const repondreJuste = (page) => page.evaluate(() => { const f = window.__app.facts, q = f.q, v = q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.module === 3 ? q.n : q.op === "×" ? q.a * q.b : q.a + q.b; for (const d of String(v)) f.type(d, document.querySelector(`.key[data-key="${d}"]`)); f.submit(); return v; });

// ---------------------------------------------------------------- 2. la fin de séance : la maison, 15 s
// joue la séance jusqu'au bouton de fin (ou « à demain »), en touchant coquillages et coches
async function jusquaLaFin(page) {
  for (const until = Date.now() + 240000; Date.now() < until;) {
    const st = await page.evaluate(() => { const s = window.__app.screen, f = window.__app.facts; return { q: s?.q && !s.locked && s.resolve ? s.q.answer : null, f: s?.q?.format, fq: !!(f?.q && f.resolve && !f.locked), shell: !!document.querySelector(".shelltap"), check: !!document.querySelector(".check:not(.key)"), card: !!document.querySelector(".card.flipped"), fin: !!document.querySelector(".fin-recompense"), moon: !!document.querySelector(".moon") }; });
    if (st.fin || st.moon) return st;
    if (st.fq) { await repondreJuste(page); await page.waitForTimeout(150); continue; }
    if (st.q !== null) { await page.evaluate(() => { const s = window.__app.screen; s.aimed = s.q.answer; s.answer(s.q.answer, null); }); await page.waitForTimeout(200); continue; }
    if (st.shell) { await page.waitForTimeout(700); await page.tap(".shelltap", { force: true }); await page.waitForTimeout(300); continue; }
    if (st.card && st.check) { await page.waitForTimeout(900); await page.tap(".check:not(.key)", { force: true }); await page.waitForTimeout(600); continue; }
    await page.waitForTimeout(150);
  }
  throw new Error("la séance ne s'est pas terminée");
}
const owned = (list) => ({ id: "cartes", cartes: Object.fromEntries(list.map((id) => [id, { n: 1, premiere: 1, brillante: false }])) });
const lagon = cartes.cartes.filter((c) => c.zone === "lagon" && c.rarete !== "legendaire").map((c) => c.id);
const prepFin = async (s, { lagon }) => { await s.put("recompenses", { id: "cartes", cartes: Object.fromEntries(lagon.slice(0, 3).map((id) => [id, { n: 1, premiere: 1, brillante: false }])) }); await s.put("recompenses", { id: "etoiles", total: 120, cumul: 220, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 }); await s.put("recompenses", { id: "quota", date: Date.now() - 7 * 86400000, cartes: 3 }); };
const QFIN = `${Q}&sansLecon&sans=echauffement&questions=2&guides=0&module=1`;
if (faire(2)) {
  for (const vue of VUES) {
    const { context, page } = await fresh({ q: QFIN, vue, prep: prepFin, arg: { lagon }, fin: true, reel: false });
    await tap(page, ".play"); const st = await jusquaLaFin(page);
    await page.waitForTimeout(700);
    await shot(page, vue, "2a-fin-boutique-et-maison");
    if (vue === VUES[0]) {
      check(st.fin && await visible(page, ".fin-recompense.vers-boutique") && await visible(page, ".session-home"), "2. fin de séance, un achat possible : le bouton de la boutique et la maison");
      const b1 = await boite(page, ".fin-recompense"), b2 = await boite(page, ".session-home");
      check(b1.x > 1000 && b2.x < 200, "2. la maison en haut à gauche, à sa place habituelle ; la boutique en bas à droite");
      const t0 = Date.now(); await tap(page, ".session-home");
      check(await attendre(page, () => !!document.querySelector(".moon"), null, 5000), `2. la maison touchée : « à demain » aussitôt (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
      check(!(await page.evaluate(() => window.__app.boutique?.open)) && !(await visible(page, ".fin-recompense")), "2. la maison ne mène pas à la boutique, le bouton de fin a disparu");
      await page.waitForTimeout(600); await shot(page, vue, "2b-maison-a-demain");
    }
    await context.close();
  }
  // sans toucher : « à demain » au bout de 15 s (cartes.json, boutique.finAttenteS)
  check(cartes.boutique.finAttenteS === 15, "2. l'attente avant « à demain » est de 15 s (cartes.json, boutique.finAttenteS)");
  const { context, page } = await fresh({ q: QFIN, prep: prepFin, arg: { lagon }, fin: true, reel: false });
  await tap(page, ".play"); await jusquaLaFin(page);
  const t0 = Date.now(); await page.waitForSelector(".moon", { timeout: 25000 }); const dt = (Date.now() - t0) / 1000;
  check(dt > 12 && dt < 18, `2. sans toucher, « à demain » vient au bout d'environ 15 s (${dt.toFixed(1)} s)`);
  check(!(await visible(page, ".session-home")), "2. « à demain » : la maison n'est plus là");
  await context.close();
}

// ---------------------------------------------------------------- 3. « continuer » en deux touchers
// une séance d'additions en cours (échauffement passé), puis la maison : l'accueil en pause
const QPAUSE = `${Q}&sansLecon&sans=echauffement&guides=0&module=2&cran=conseille`;
async function enPause(vue) {
  const { context, page } = await fresh({ q: QPAUSE, vue });
  // (l'accueil réel, en deux touchers : « jouer » deux fois)
  await tap(page, ".galet.play"); await page.waitForTimeout(250); await tap(page, ".galet.play");
  await questionPrete(page); await repondreJuste(page); await questionPrete(page);
  await page.waitForTimeout(400);
  await tap(page, ".session-home"); await page.waitForSelector(".keep.play", { timeout: 10000 }); await page.waitForTimeout(500);
  return { context, page };
}
const etatSeance = (page) => page.evaluate(() => ({ enPause: !!window.__app.enPause, questions: window.__app.session.rec.questions, tape: window.__app.facts?.typed ?? window.__app.facts?.value ?? null, q: JSON.stringify(window.__app.facts?.q ?? null) }));
if (faire(3)) {
  for (const vue of VUES) {
    const { context, page } = await enPause(vue);
    await shot(page, vue, "3a-pause-galets");
    const s0 = await etatSeance(page);
    await saidReset(page);
    await tap(page, ".keep.play"); await page.waitForTimeout(900);
    await shot(page, vue, "3b-pause-continuer-choisi");
    if (vue === VUES[0]) {
      const s1 = await etatSeance(page);
      check(s1.enPause && (await said(page)).includes(T.accueilDescription.continuer), `3. premier toucher sur « continuer » : la séance reste en pause, la mascotte dit « ${T.accueilDescription.continuer} »`);
      check(await page.evaluate(() => document.querySelector(".keep.play").classList.contains("choisie") || !!document.querySelector(".bulle:not(.cachee)")), "3. le galet est sélectionné, la bulle part du galet");
      // le second toucher reprend ; la séance attend la même question, rien n'est tapé
      await tap(page, ".keep.play"); await page.waitForTimeout(400);
      const s2 = await etatSeance(page);
      check(!s2.enPause && s2.questions === s0.questions && s2.q === s0.q, "3. second toucher : la séance reprend, à la même question, sans réponse enregistrée");
      // l'enfant qui touche encore au même endroit (troisième toucher) : il ne tombe pas dans le pavé
      const b = await boite(page, ".session-home").catch(() => null); void b;
      const dansLePave = await page.evaluate(() => { const r = document.querySelector(".keep.play")?.getBoundingClientRect(); return [...document.querySelectorAll(".key")].some((k) => { const q = k.getBoundingClientRect(); return r && q.width && !(q.right < r.left || q.left > r.right || q.bottom < r.top || q.top > r.bottom); }); });
      check(!dansLePave, "3. le galet « continuer » ne recouvre aucune touche du pavé");
    }
    await context.close();
  }
  // le double toucher rapide reprend aussitôt ; le toucher qui suit (l'habitude des deux touchers) ne tape rien
  {
    const { context, page } = await enPause(VUES[0]);
    const s0 = await etatSeance(page), b = await boite(page, ".keep.play"), x = b.x + b.width / 2, y = b.y + b.height / 2;
    await page.touchscreen.tap(x, y); await page.waitForTimeout(120); await page.touchscreen.tap(x, y);
    await page.waitForTimeout(500);
    const s1 = await etatSeance(page);
    check(!s1.enPause && s1.q === s0.q, "3. double toucher rapide sur « continuer » : la séance reprend aussitôt");
    // les galets sont partis : un toucher de plus au même endroit ne fait rien
    await page.touchscreen.tap(x, y); await page.waitForTimeout(600);
    const s2 = await etatSeance(page);
    check(s2.questions === s0.questions && !(await page.evaluate(() => (window.__app.facts?.typed ?? "").length)), "3. un troisième toucher au même endroit ne tape rien dans le pavé");
    await context.close();
  }
  // l'enfant de l'agent (constat 11) : maison, puis deux touchers sur « continuer » à 2 s d'écart : aucune réponse par mégarde
  {
    const { context, page } = await enPause(VUES[0]);
    const s0 = await etatSeance(page);
    await tap(page, ".keep.play"); await page.waitForTimeout(2000);
    check((await etatSeance(page)).enPause, "3. un premier toucher, puis 2 s : toujours en pause");
    await tap(page, ".keep.play"); await page.waitForTimeout(800);
    const s1 = await etatSeance(page);
    check(!s1.enPause && s1.questions === s0.questions && !(await page.evaluate(() => (window.__app.facts?.typed ?? "").length)), "3. le second toucher reprend la séance, sans aucun chiffre tapé");
    await context.close();
  }
  // les autres galets de la pause : un premier toucher les présente, sans y aller ; un toucher ailleurs désélectionne
  {
    const { context, page } = await enPause(VUES[0]);
    for (const [cls, k] of [["reefkey", "recif"], ["albumkey", "album"], ["leconskey", "lecons"], ["choisir", "choisir"]]) {
      await saidReset(page);
      await tap(page, `.keep.${cls}`); await page.waitForTimeout(700);
      check((await etatSeance(page)).enPause && (await said(page)).includes(T.accueilDescription[k]) && !(await page.evaluate(() => window.__app.reef?.open || window.__app.album?.open)), `3. pause, premier toucher sur ${k} : « ${T.accueilDescription[k]} », on reste à l'accueil en pause`);
    }
    await page.touchscreen.tap(640, 300); await page.waitForTimeout(400);
    check(!(await page.evaluate(() => !!document.querySelector(".galet.choisie"))), "3. un toucher ailleurs désélectionne");
    await tap(page, ".keep.reefkey"); await page.waitForTimeout(300); await tap(page, ".keep.reefkey");
    check(await attendre(page, () => !!document.querySelector("canvas.recif-dessin"), null, 15000), "3. deux touchers sur le récif : la visite du récif");
    await page.waitForTimeout(1500);
    await tap(page, ".homekey:not(.session-home)"); await page.waitForSelector(".keep.play", { timeout: 15000 }); await page.waitForTimeout(400);
    // « réécouter » en pause redit la consigne de la pause, puis la séance retrouve sa voix
    await saidReset(page); await tap(page, ".mascotte-tap"); await page.waitForTimeout(1500);
    check((await said(page)).includes(T.pauseConsigne), "3. toucher la mascotte en pause redit la consigne de la pause");
    await tap(page, ".keep.play"); await page.waitForTimeout(250); await tap(page, ".keep.play"); await page.waitForTimeout(800);
    check(!(await etatSeance(page)).enPause && await questionPrete(page), "3. puis « continuer » reprend la séance, la question attend sa réponse");
    await context.close();
  }
}

// ---------------------------------------------------------------- 7. la boutique : pas de prix pour briller sur la tuile
// l'encre du bas de la tuile (là où s'écrit le prix) : la somme des pixels sombres de la bande du prix
const encrePrix = (page, id) => page.evaluate((id) => {
  const b = document.querySelector(`.boutique-tuile[data-id="${id}"]`), c = b.cv, px = window.__app.stage.px, M = (c.width / px - 170) / 2;
  const d = c.getContext("2d").getImageData(Math.round((M + 20) * px), Math.round((M + 150) * px), Math.round(130 * px), Math.round(40 * px)).data;
  let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && d[i] + d[i + 1] + d[i + 2] < 200) n++;
  return n / (px * px);
}, id);
async function boutique(page) {
  await tap(page, ".reefkey"); await page.waitForTimeout(250); await tap(page, ".reefkey"); await recifOuvert(page);
  await page.waitForSelector(".boutique-cle", { timeout: 20000 }); await tap(page, ".boutique-cle");
  await page.waitForFunction(() => document.querySelectorAll(".boutique-tuile").length === 15 && window.__app.boutique.open, null, { timeout: 30000 });
  await page.waitForTimeout(1800);
}
if (faire(7)) {
  const prep = async (s, { lagon }) => { await s.put("recompenses", { id: "cartes", cartes: Object.fromEntries(lagon.slice(0, 3).map((id) => [id, { n: 1, premiere: 1, brillante: false }])) }); await s.put("recompenses", { id: "etoiles", total: 230, cumul: 330, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 }); await s.put("recompenses", { id: "quota", date: Date.now() - 7 * 86400000, cartes: 3 }); };
  for (const vue of VUES) {
    const { context, page } = await fresh({ vue, prep, arg: { lagon } });
    await boutique(page);
    await shot(page, vue, "7a-vitrine-sans-prix-pour-briller");
    const v = await page.evaluate(() => Object.fromEntries(window.__app.boutique.vit)), terne = Object.keys(v).find((k) => v[k] === "terne"), vendre = Object.keys(v).find((k) => v[k] === "vendre");
    const e0 = await encrePrix(page, terne), eV = await encrePrix(page, vendre);
    await saidReset(page); await tap(page, `.boutique-tuile[data-id="${terne}"]`); await page.waitForTimeout(1500);
    const e1 = await encrePrix(page, terne);
    await shot(page, vue, "7b-tuile-touchee-prix-et-coche");
    if (vue === VUES[0]) {
      check(e0 < 15 && eV > 60, `7. une créature déjà dans le récif : pas de prix écrit sur sa tuile (encre ${e0.toFixed(0)}, à côté d'une tuile à vendre : ${eV.toFixed(0)})`);
      check(e1 > 60 && /Pour la faire briller, il faut 150 étoiles/.test(await said(page)) && await visible(page, ".boutique-conf.coche"), `7. la tuile touchée : le prix est dit et écrit (encre ${e1.toFixed(0)}), avec la coche`);
      await page.touchscreen.tap(250, 760); await page.waitForTimeout(500);
      check((await encrePrix(page, terne)) < 15, "7. un toucher ailleurs : le prix disparaît de nouveau");
      // l'achat : juste après, la tuile n'affiche aucun prix
      await tap(page, `.boutique-tuile[data-id="${vendre}"]`); await page.waitForTimeout(600); await tap(page, ".boutique-conf.coche");
      await page.waitForFunction(() => !window.__app.boutique.verrou, null, { timeout: 30000 }); await page.waitForTimeout(800);
      const st = await page.evaluate((id) => window.__app.boutique.vit.get(id), vendre);
      check(st === "terne" || st === "brillante", `7. l'achat est fait (${st})`);
      await shot(page, vue, "7c-apres-achat");
      check((await encrePrix(page, vendre)) < 15, "7. juste après l'achat, la tuile de la créature achetée n'affiche aucun prix");
    }
    await context.close();
  }
}

// ---------------------------------------------------------------- 6. les voiliers : toucher un passage
const prepVoiliers = async (s) => { await s.setSetting("echauffement", false); };
const bateauAttend = (page, ms = 90000) => attendre(page, () => !!window.__app.voiliers?.attend && window.__app.voiliers.api?.etat().mode === "wait", null, ms);
const toucherPassage = async (page, c, vue) => { const x = await page.evaluate((c) => window.__app.voiliers.api.centre(c), c), k = vue[1].width / 1280; await page.touchscreen.tap(x * k, 640 * k); };
const nGlisser = (page) => page.evaluate((t) => window.__said.filter((x) => x === t).length, T.voiliersGlisser);
if (faire(6)) {
  for (const vue of VUES) {
    const { context, page } = await fresh({ q: `${Q}&sansLecon&choix=4:2&cran=conseille`, vue, prep: prepVoiliers, reel: false });
    await tap(page, ".play");
    check(await bateauAttend(page), "6. un bateau attend le geste (niveau 2, mer calme)");
    const q = await page.evaluate(() => { const q = window.__app.voiliers.q; return { k: q.k, n: q.bouees.length, num: q.num, bouees: q.bouees }; });
    const faux = q.k === 0 ? 1 : 0;
    await saidReset(page);
    await toucherPassage(page, faux, vue); await page.waitForTimeout(250);
    // (la pointe de la flèche, calculée maintenant : dans le conteneur, la mer en WebGL logiciel ne donne qu'une image ou deux par seconde)
    const pointe = () => page.evaluate(() => { const f = window.__app.fleche; return f.visible && typeof f.source === "function" ? f.source() : null; });
    const p0 = await pointe(); await page.waitForTimeout(1000); const p1 = await pointe();
    const cx = await page.evaluate((c) => window.__app.voiliers.api.centre(c), faux);
    await shot(page, vue, "6a-voiliers-toucher-un-passage");
    if (vue === VUES[0]) {
      check((await nGlisser(page)) === 1, `6. toucher un passage : « ${T.voiliersGlisser} »`);
      // (relecture du lot, R2 ; décision du parent du 14 octobre 2026) elle descend droit sous le bateau, s'arrête au-dessus des bouées
      // (plus haut que leur sommet), sans aller vers le passage touché
      const ligne = await page.evaluate(() => window.__app.voiliers.api.etat().LINE_Y);
      check(p0 && p1 && p1[1] > p0[1] + 60 && Math.abs(p1[0] - p0[0]) < 2 && p1[1] <= ligne - 170, `6. la flèche montre le geste, droit sous le bateau, au-dessus des bouées, sans désigner le passage touché (${p0?.map(Math.round)} -> ${p1?.map(Math.round)}, passage touché en x ${Math.round(cx)})`);
      check(await page.evaluate(() => window.__app.voiliers.attend && window.__app.voiliers.api.etat().mode === "wait"), "6. le toucher ne répond pas : le bateau attend toujours");
      await page.waitForTimeout(1500);
      await toucherPassage(page, faux, vue); await page.waitForTimeout(600);
      check((await nGlisser(page)) === 1, "6. au plus une fois par bateau : un second toucher ne redit rien");
      // le glisser répond toujours : le bon passage, puis le bateau suivant, où un toucher redit la phrase une fois
      await page.evaluate((c) => window.__app.voiliers.api.deposer(c), q.k);
      await attendre(page, (n) => window.__app.voiliers?.q?.num !== n && window.__app.voiliers.attend && window.__app.voiliers.api.etat().mode === "wait", q.num, 60000);
      const q2 = await page.evaluate(() => window.__app.voiliers.q.k);
      await toucherPassage(page, q2 === 0 ? 1 : 0, vue); await page.waitForTimeout(500);
      check((await nGlisser(page)) === 2, "6. le bateau suivant : un toucher sur un passage redit la phrase");
      // le doigt prend le bateau : la flèche s'efface
      const st = await page.evaluate(() => window.__app.voiliers.api.etat()), k = vue[1].width / 1280;
      await page.mouse.move(st.x * k, (st.y - 60) * k); await page.mouse.down(); await page.mouse.move(st.x * k - 40, (st.y + 40) * k); await page.waitForTimeout(300);
      check(!(await page.evaluate(() => window.__app.fleche.visible)), "6. le bateau pris par le doigt : la flèche s'efface");
      await page.mouse.up();
    }
    await context.close();
  }
}

// ---------------------------------------------------------------- 4. la bulle évite ce dont parle la voix
// la bulle, relevée `n` fois toutes les 150 ms : chaque fois qu'elle est visible, elle ne couvre aucune des zones (celles que
// les exercices ont déclarées, bulle.etat().zones, et `extra()` : celles que le parcours connaît par ailleurs) ; renvoie le
// nombre de relevés où elle était visible, ceux où elle couvrait une zone, ceux en bulle courte, et les zones vues
// (`capture` : faite au premier relevé où la bulle est écrite pendant que la zone est montrée, sinon à la fin ; relecture du lot, R5 :
// prise après les relevés, elle montrait la bouée déjà éteinte et la bulle partie)
async function releverBulle(page, n = 24, extra = "() => []", capture = null) {
  const out = { vue: 0, couvre: 0, court: 0, zones: 0, textes: new Set() };
  for (let i = 0; i < n; i++) {
    const r = await page.evaluate((ex) => { const b = window.__app.bulle.etat(), zs = [...b.zones, ...(0, eval)(ex)()], inter = (a, o) => Math.min(a[2], o[2]) - Math.max(a[0], o[0]) > 1 && Math.min(a[3], o[3]) - Math.max(a[1], o[1]) > 1; return { v: b.visible && !!b.rect, c: b.visible && b.rect ? zs.some((z) => inter(b.rect, z)) : false, court: b.court, z: zs.length, t: b.texte }; }, extra);
    if (r.v) { out.vue++; out.textes.add(r.t); } if (r.c) out.couvre++; if (r.v && r.court) out.court++; out.zones = Math.max(out.zones, r.z);
    if (capture && r.v && r.z > 0 && String(r.t ?? "").split(" ").length > 1) { await page.waitForTimeout(400); await capture(); capture = null; }
    await page.waitForTimeout(150);
  }
  if (capture) await capture();
  out.textes = [...out.textes]; return out;
}
if (faire(4)) {
  for (const vue of VUES) {
    const un = vue === VUES[0];
    // a. l'aide de la tortue à l'échauffement (famille 1) : la bulle n'est jamais sur l'égalité de l'ardoise
    {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&sans=notion,defi&cran=conseille`, vue, reel: false });
      await tap(page, ".play"); await questionPrete(page);
      // (une question de la famille 1, dont l'aide est la tortue : on passe les autres)
      for (let i = 0; i < 14 && !(await page.evaluate(() => !window.__app.facts.q.base && window.__app.facts.aidKind(window.__app.facts.q) === "ligne")); i++) { await repondreJuste(page); await questionPrete(page); }
      await page.evaluate(() => { window.__bulles = []; });
      await tap(page, ".help");
      await attendre(page, () => window.__bulles.some((x) => x.zones && x.t.length > 12), null, 8000); await page.waitForTimeout(200);
      await shot(page, vue, "4a-aide-tortue-egalite");
      const r = await releverBulle(page, 20), poses = await page.evaluate(() => window.__bulles.filter((x) => x.zones));
      if (process.env.DEBUG_BULLE) console.log(JSON.stringify(poses));
      if (un) check(poses.length && poses.every((x) => !x.couvre), `4. aide de la tortue, chaque phrase : ${poses.map((x) => `« ${x.t} » ${x.visible ? (x.court ? `en bulle courte (« ${x.texte} »)` : "bulle entière") : "sans bulle"}`).join(" ; ")}`);
      if (un) check(r.zones >= 1 && r.couvre === 0, `4. aide de la tortue : la bulle ne couvre jamais l'égalité (${r.vue} relevés où elle est visible, ${r.couvre} sur la zone, ${r.court} en bulle courte ; « ${r.textes.join(" / ")} »)`);
      await context.close();
    }
    // b. le calcul rapide guidé (niveau 4) : le chemin n'est jamais couvert
    {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&sans=echauffement&choix=3:4&cran=conseille`, vue, reel: false });
      await tap(page, ".play");
      await attendre(page, () => (window.__app.aidBoard?.zones ?? []).length > 0, null, 60000);
      const r = await releverBulle(page, 30, "() => []", () => shot(page, vue, "4b-calcul-chemin"));
      if (un) check(r.zones >= 1 && r.couvre === 0, `4. calcul rapide : la bulle ne couvre jamais le chemin (${r.vue} relevés visibles, ${r.couvre} sur le chemin, ${r.court} en bulle courte ; « ${r.textes.join(" / ")} »)`);
      await context.close();
    }
    // c. les voiliers (niveau 2, bouées impaires) : l'erreur « plus petit que cette bouée » ; la bouée allumée n'est pas couverte
    {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&choix=4:2&cran=conseille`, vue, prep: prepVoiliers, reel: false });
      await tap(page, ".play"); await bateauAttend(page);
      const q = await page.evaluate(() => { const q = window.__app.voiliers.q; return { k: q.k, n: q.bouees.length }; });
      await page.evaluate((c) => window.__app.voiliers.api.deposer(c), q.k < q.n ? q.k + 1 : q.k - 1);
      await attendre(page, () => window.__app.voiliers.api.etat().allumees.some((x) => x > 0.05), null, 20000);
      const r = await releverBulle(page, 16, "() => []", () => shot(page, vue, "4c-voiliers-bouee-nommee"));
      if (un) check(r.zones >= 1 && r.couvre === 0, `4. voiliers : la bulle ne couvre jamais la bouée nommée (${r.vue} relevés visibles, ${r.couvre} sur la bouée ; « ${r.textes.join(" / ")} »)`);
      await context.close();
    }
    // d. l'étal (niveau 3) : l'article allumé et son ardoise ne sont jamais couverts
    {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&sans=echauffement&choix=6:3&cran=conseille`, vue, reel: false });
      await tap(page, ".play");
      await attendre(page, () => !!window.__app.etal?.api && (window.__app.etal.api.allumes?.() ?? []).length > 0, null, 90000);
      const r = await releverBulle(page, 24, "() => window.__app.etal?.api?.allumes?.() ?? []", () => shot(page, vue, "4d-etal-article-allume"));
      if (un) check(r.zones >= 1 && r.couvre === 0, `4. étal : la bulle ne couvre jamais l'article allumé ni son ardoise (${r.vue} relevés visibles, ${r.couvre} dessus ; « ${r.textes.join(" / ")} »)`);
      await context.close();
    }
  }
}

// ---------------------------------------------------------------- 8. la finition
if (faire(8)) {
  for (const vue of VUES) {
    const un = vue === VUES[0];
    // a. l'étal par temps d'orage : le compteur sur une plaque claire ; la bulle à droite de la fenêtre, jamais sous le rebord
    {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&sans=echauffement&choix=6:3&cran=conseille&meteo=orage`, vue, reel: false });
      await page.evaluate(() => window.__app.store.put("recompenses", { id: "etoiles", total: 234, cumul: 334, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 }));
      await page.reload(); await page.waitForFunction(() => window.__ready !== undefined); await espion(page);
      await tap(page, ".play");
      await attendre(page, () => !!window.__app.etal?.attend, null, 90000); await page.waitForTimeout(1200);
      if (un) check(await page.evaluate(() => window.__app.hud.sombre === true), "8. étal, orage : le compteur d'étoiles est posé sur une plaque claire");
      // une bulle courte quand la droite est prise (le cas du constat 14 : « 7 euros. ») : pas sous le rebord de la fenêtre
      const r = await page.evaluate(() => { const b = window.__app.bulle; b.eviter("essai", [235, 80, 1280, 300]); b.dire("7 euros.", 3000); const e = b.etat(); b.eviter("essai", null); return e; });
      await page.waitForTimeout(700); await shot(page, vue, "8a-etal-orage-compteur-bulle");
      if (un) {
        check(r.place !== "dessous", `8. étal : la bulle courte ne se pose plus sous le rebord de la fenêtre (place : ${r.place ?? "aucune"})`);
        const b = await page.evaluate(() => window.__bulles.filter((x) => x.visible).map((x) => x.t));
        check(b.length > 0, `8. étal : des bulles écrites pendant la partie (${b.slice(0, 3).join(" / ")})`);
      }
      await context.close();
    }
    // b. par beau temps : pas de plaque
    if (un) {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&sans=echauffement&choix=6:3&cran=conseille&meteo=beau`, vue, reel: false });
      await tap(page, ".play"); await attendre(page, () => !!window.__app.etal?.attend, null, 90000); await page.waitForTimeout(1200);
      check(await page.evaluate(() => !window.__app.hud.sombre), "8. étal, beau temps : le compteur sans plaque");
      await context.close();
    }
    // c. l'étoile arc-en-ciel à la récompense : un niveau franchi pendant la séance (la ligne, voie rapide) ; l'album à l'arrivée
    {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&sans=echauffement,defi&questions=8&guides=0&module=1`, vue, reel: false });
      await page.evaluate(() => { window.__arcAlbum = 0; new MutationObserver(() => { if (document.querySelector(".arc-album")) window.__arcAlbum++; }).observe(document.querySelector("#ui"), { childList: true, subtree: true }); });
      await tap(page, ".play");
      const vu = attendre(page, () => !!document.querySelector(".arc-album") && !!document.querySelector(".etoile-vol"), null, 240000);
      const fin = jusquaLaFin(page);
      if (await vu) { await page.waitForTimeout(500); await shot(page, vue, "8c-etoile-arc-en-ciel-vers-l-album"); }
      await fin.catch(() => {});
      if (un) {
        const s1 = await said(page);
        check(s1.includes(T.etoileArc) && await page.evaluate(() => window.__arcAlbum > 0), "8. « Et une étoile arc-en-ciel ! » : l'album apparaît, l'étoile y vole");
        check(!(await visible(page, ".arc-album")), "8. puis l'album s'en va");
      }
      await context.close();
    }
  }
}

// ---------------------------------------------------------------- 1. la reprise après un rechargement
const jalon = (t) => { if (process.env.JALONS) console.log(`  … ${t}`); };
const CAS1 = opt("--cas", null)?.split(","), cas = (c) => !CAS1 || CAS1.includes(c);
const recharger = async (page) => { jalon("rechargement"); await page.reload(); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 }); await espion(page); await page.waitForTimeout(300); };
const offerte = (page) => page.evaluate(() => ({ attente: !!window.__app.repriseEnAttente, id: window.__app.repriseEnAttente?.id ?? null, continuer: !!document.querySelector(".keep.play"), dit: window.__app.bulle.texte }));
const etatSeance1 = (page) => page.evaluate(() => { const s = window.__app.session; return s?.rec ? { id: s.rec.id, etape: s.progress.etape, questions: s.rec.questions, etoiles: s.rec.etoiles, cran: s.cran, enPause: !!window.__app.enPause, total: window.__app.rewards.total } : null; });
const continuer = async (page) => { await tap(page, ".keep.play"); await page.waitForTimeout(300); if (await page.evaluate(() => !!window.__app.repriseEnAttente)) await tap(page, ".keep.play").catch(() => {}); };
const repris = (page, id, etape) => attendre(page, ([id, etape]) => { const s = window.__app.session; return !window.__app.enPause && !window.__app.repriseEnAttente && s?.rec?.id === id && s.progress.etape === etape; }, [id, etape], 30000);
// une reprise complète : recharger, vérifier « continuer » et la phrase, reprendre ; renvoie l'état d'avant et d'après
async function reprendre(page, nom, { capture = null, vue = VUES[0] } = {}) {
  const avant = await etatSeance1(page);
  await recharger(page);
  const o = await offerte(page);
  if (capture) await shot(page, vue, capture);
  check(o.attente && o.id === avant.id && o.continuer && o.dit === T.repriseRechargement, `1. ${nom} : rechargée, l'accueil en pause avec « continuer » ; la mascotte : « ${o.dit} »`);
  await continuer(page);
  const ok = await repris(page, avant.id, avant.etape);
  const apres = await etatSeance1(page);
  check(ok && apres.questions >= avant.questions && apres.total >= avant.total && apres.cran === avant.cran, `1. ${nom} : « continuer » reprend la même séance au début de l'étape « ${avant.etape} » (questions ${avant.questions} -> ${apres?.questions}, étoiles ${avant.total} -> ${apres?.total}, cran ${apres?.cran})`);
  return { avant, apres };
}
// la séance de test : base neuve, additions ou ligne, sans le sélecteur (cran donné)
if (faire(1)) {
  // a. pendant l'échauffement ; puis la séance jusqu'au bout : le bilan compte toute la séance, la reprise est notée
  if (cas("a")) {
    const { context, page } = await fresh({ q: `${Q}&sansLecon&guides=0&module=2&questions=6&cran=dur&sans=defi`, reel: false });
    await tap(page, ".play"); await questionPrete(page); await repondreJuste(page); await questionPrete(page); await repondreJuste(page); await questionPrete(page);
    const { avant } = await reprendre(page, "pendant l'échauffement", { capture: "1a-reprise-accueil-continuer" });
    check(avant.etape === "echauffement", "1. l'étape reprise est l'échauffement");
    await page.evaluate(() => { window.__tally = null; const o = new MutationObserver(() => { if (document.querySelector(".tally") && window.__tally === null) window.__tally = window.__app.session.rec.etoiles; }); o.observe(document.querySelector("#ui"), { childList: true, subtree: true }); });
    await jusquaLaFin(page).catch(() => {});
    const rec = await page.evaluate((id) => window.__app.store.get("seances", id), avant.id), dit = await said(page), tally = await page.evaluate(() => window.__tally);
    check(rec.terminee && rec.reprises?.length === 1 && rec.reprises[0].etape === "echauffement", "1. la séance reprise se termine ; la reprise est notée dans sa fiche");
    check(tally !== null && tally > avant.etoiles && (dit.includes(` ${tally} étoiles`) || tally > 160), `1. le bilan compte toute la séance : ${tally} étoiles (${avant.etoiles} avant le rechargement)`);
    // l'espace parent : « Page rechargée en pleine séance », et la ligne qui marque le rechargement dans le tableau des réponses
    await page.waitForSelector(".moon", { timeout: 30000 }).catch(() => {});
    await page.evaluate(() => { window.__app.parent.open(); }); await page.waitForSelector(".pa-gate, .pa-sheet", { timeout: 10000 });
    if (await page.locator(".pa-gate").count()) { for (const d of "1234") { await page.tap(`.pa-keys [data-key="${d}"]`); await page.waitForTimeout(150); } }
    await page.waitForSelector(".pa-sheet", { timeout: 10000 });
    await page.locator('[data-tab="seances"]').first().click().catch(() => {}); await page.waitForTimeout(500);
    await page.locator(".pa-session > button").first().click().catch(() => {}); await page.waitForTimeout(500);
    await shot(page, VUES[0], "1b-parent-reprise");
    check(/Page rechargée en pleine séance : à .*, (après \d+ questions?|avant la première question) ; l'étape « échauffement » a repris à son début/.test(await page.evaluate(() => document.body.innerText)), "1. l'espace parent note la reprise dans l'historique de la séance");
    check(await page.locator(".pa-reprise").count() === 1, "1. le tableau des réponses marque l'endroit du rechargement");
    await context.close();
  }
  // b. pendant la leçon d'entrée : la leçon n'a pas été vue, elle est rejouée
  if (cas("b")) {
    const { context, page } = await fresh({ q: `${Q}&guides=0&module=1&cran=conseille&sans=echauffement,defi`, reel: false });
    await tap(page, ".play");
    await attendre(page, () => !!window.__app.lessons.keys && window.__app.lessons.p >= 1, null, 60000);
    await reprendre(page, "pendant une leçon");
    check(await attendre(page, () => !!window.__app.lessons.keys, null, 20000), "1. la leçon interrompue (pas vue jusqu'au bout) est rejouée");
    // passée : notée, et la page rechargée ensuite ne la rejoue pas
    await tap(page, ".skip"); await attendre(page, () => !window.__app.lessons.keys, null, 20000);
    await attendre(page, () => !!window.__app.screen?.q && !!window.__app.screen.resolve, null, 30000);
    await reprendre(page, "après une leçon passée");
    await page.waitForTimeout(4000);
    check(!(await page.evaluate(() => !!window.__app.lessons.keys)) && await attendre(page, () => !!window.__app.screen?.q, null, 20000), "1. une leçon déjà vue ou passée dans la séance n'est pas rejouée");
    await context.close();
  }
  // c. pendant une correction (additions) ; d. pendant le vol des étoiles
  if (cas("c")) {
    const { context, page } = await fresh({ q: `${Q}&sansLecon&guides=0&module=2&cran=conseille&sans=echauffement,defi`, reel: false });
    await tap(page, ".play"); await questionPrete(page);
    await page.evaluate(() => { const f = window.__app.facts; f.type("9", document.querySelector('.key[data-key="9"]')); f.type("9", document.querySelector('.key[data-key="9"]')); f.submit(); });
    await page.waitForTimeout(500);
    await reprendre(page, "pendant une correction");
    await questionPrete(page);
    const t0 = await page.evaluate(() => window.__app.rewards.total);
    await repondreJuste(page);
    // (les étoiles de la bonne réponse sont en vol vers le compteur)
    const enVol = await attendre(page, () => window.__app.hud.flights.length > 0, null, 10000);
    const pendant = await page.evaluate(() => ({ total: window.__app.rewards.total, rec: window.__app.session.rec.etoiles }));
    await recharger(page);
    const stocke = await page.evaluate(async () => (await window.__app.store.get("recompenses", "etoiles"))?.total ?? 0);
    check(enVol && pendant.total > t0, `1. rechargée pendant le vol des étoiles (${pendant.total - t0} en vol)`);
    check(stocke === pendant.total && stocke >= t0, `1. pendant le vol des étoiles : rien n'est perdu ni compté deux fois (${t0} -> ${stocke})`);
    await continuer(page); await page.waitForTimeout(1500);
    check((await page.evaluate(() => window.__app.rewards.total)) === stocke, "1. après la reprise, le trésor est le même");
    await context.close();
  }
  // e. pendant le défi
  if (cas("e")) {
    const prepDefi = async (s) => { const now = Date.now(), DAY = 86400000; for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] }); for (const [i, k] of ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"].entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); } };
    const { context, page } = await fresh({ q: `${Q}&cran=conseille&sans=echauffement,notion`, prep: prepDefi, reel: false });
    await tap(page, ".play");
    await attendre(page, () => !!window.__app.challenge && !!window.__app.facts?.resolve, null, 60000); await repondreJuste(page);
    await reprendre(page, "pendant le défi");
    check(await attendre(page, () => !!window.__app.challenge, null, 20000), "1. le défi repart à son début");
    await context.close();
  }
  // f. pendant une pause ; g. deux rechargements de suite ; puis un rechargement après la reprise
  if (cas("f")) {
    const { context, page } = await fresh({ q: `${Q}&sansLecon&guides=0&module=2&cran=conseille&sans=echauffement,defi`, reel: false });
    await tap(page, ".play"); await questionPrete(page); await repondreJuste(page); await questionPrete(page);
    await tap(page, ".session-home"); await page.waitForSelector(".keep.play", { timeout: 10000 });
    const id = (await etatSeance1(page)).id;
    await recharger(page);
    check((await offerte(page)).attente, "1. rechargée pendant une pause : « continuer »");
    await recharger(page);
    const o = await offerte(page);
    check(o.attente && o.id === id, "1. deux rechargements de suite : toujours « continuer », la même séance");
    await continuer(page);
    check(await repris(page, id, "notion"), "1. puis la séance reprend");
    await questionPrete(page);
    await reprendre(page, "un rechargement après une reprise");
    check((await page.evaluate((id) => window.__app.store.get("seances", id), id)).reprises?.length === 2, "1. deux reprises notées");
    await context.close();
  }
  // h. après minuit : la séance d'hier soir reste interrompue
  if (cas("h")) {
    const { context, page } = await fresh({ q: `${Q}&sansLecon&guides=0&module=2&cran=conseille&sans=echauffement,defi`, reel: false });
    await tap(page, ".play"); await questionPrete(page); await repondreJuste(page);
    const id = (await etatSeance1(page)).id;
    await page.evaluate(async (id) => { const s = window.__app.store, r = await s.get("seances", id), h = new Date(); h.setHours(0, 0, 0, 0); r.debut = h.getTime() - 10 * 60000; await s.put("seances", r); }, id);
    await recharger(page);
    const o = await offerte(page);
    check(!o.attente && !o.continuer && await visible(page, ".galet.play"), "1. après minuit : pas de reprise, l'accueil propose « jouer »");
    check(!(await page.evaluate((id) => window.__app.store.get("seances", id), id)).terminee, "1. la séance d'hier reste « interrompue » (terminée : non)");
    await context.close();
  }
}

check(!errors.length, `aucune erreur dans la page (${errors.slice(0, 3).join(" | ")})`);
await browser.close(); srv.close();
