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
//     geste du bateau au passage touché, au plus une fois par bateau ; le glisser reste le geste qui répond ;
//  4. la bulle de la mascotte évite aussi ce dont parle la voix : l'égalité de l'aide de la tortue, le chemin du calcul rapide,
//     la bouée nommée aux voiliers, l'article allumé de l'étal et son ardoise ; sans place, une bulle plus courte, ou pas de bulle ;
// (les décisions suivantes s'ajoutent à leur étape)
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
      check(p0 && p1 && p1[1] > p0[1] + 60 && Math.abs(p1[0] - cx) < Math.abs(p0[0] - cx), `6. la flèche montre le geste, du bateau vers le passage touché (${p0?.map(Math.round)} -> ${p1?.map(Math.round)}, passage en x ${Math.round(cx)})`);
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
async function releverBulle(page, n = 24, extra = "() => []") {
  const out = { vue: 0, couvre: 0, court: 0, zones: 0, textes: new Set() };
  for (let i = 0; i < n; i++) {
    const r = await page.evaluate((ex) => { const b = window.__app.bulle.etat(), zs = [...b.zones, ...(0, eval)(ex)()], inter = (a, o) => Math.min(a[2], o[2]) - Math.max(a[0], o[0]) > 1 && Math.min(a[3], o[3]) - Math.max(a[1], o[1]) > 1; return { v: b.visible && !!b.rect, c: b.visible && b.rect ? zs.some((z) => inter(b.rect, z)) : false, court: b.court, z: zs.length, t: b.texte }; }, extra);
    if (r.v) { out.vue++; out.textes.add(r.t); } if (r.c) out.couvre++; if (r.v && r.court) out.court++; out.zones = Math.max(out.zones, r.z);
    await page.waitForTimeout(150);
  }
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
      const r = await releverBulle(page, 30);
      await shot(page, vue, "4b-calcul-chemin");
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
      const r = await releverBulle(page, 16);
      await shot(page, vue, "4c-voiliers-bouee-nommee");
      if (un) check(r.zones >= 1 && r.couvre === 0, `4. voiliers : la bulle ne couvre jamais la bouée nommée (${r.vue} relevés visibles, ${r.couvre} sur la bouée ; « ${r.textes.join(" / ")} »)`);
      await context.close();
    }
    // d. l'étal (niveau 3) : l'article allumé et son ardoise ne sont jamais couverts
    {
      const { context, page } = await fresh({ q: `${Q}&sansLecon&sans=echauffement&choix=6:3&cran=conseille`, vue, reel: false });
      await tap(page, ".play");
      await attendre(page, () => !!window.__app.etal?.api && (window.__app.etal.api.allumes?.() ?? []).length > 0, null, 90000);
      const r = await releverBulle(page, 24, "() => window.__app.etal?.api?.allumes?.() ?? []");
      await shot(page, vue, "4d-etal-article-allume");
      if (un) check(r.zones >= 1 && r.couvre === 0, `4. étal : la bulle ne couvre jamais l'article allumé ni son ardoise (${r.vue} relevés visibles, ${r.couvre} dessus ; « ${r.textes.join(" / ")} »)`);
      await context.close();
    }
  }
}

check(!errors.length, `aucune erreur dans la page (${errors.slice(0, 3).join(" | ")})`);
await browser.close(); srv.close();
