// LE PARCOURS DU LOT « CORRECTIFS : PASSAGE DE L'ÉCHAUFFEMENT AUX VOILIERS » (docs/LOTS.md, fiche 8 ; essai du parent sur la
// tablette, le 10 octobre 2026). Chaque situation nouvelle, avec ses captures (tests/e2e/out/correctifs-2) en 1280 × 800,
// 1920 × 1200 et à la taille de la tablette (1138 × 711, densité 2,25) :
//   demarrage : l'écran de démarrage (chargement, prêt, « Toucher pour continuer »), une suite d'images sur 4 s, la maquette
//               art/logo/ à la même taille, le temps d'image mesuré ;
//   accueil   : les galets, chacun sélectionné (l'entourage, la bulle, la phrase), rien sur la mascotte, le bouton de l'espace
//               parent ni la lune ; la séance faite (« Encore ! » et la lune) ;
//   double    : un double toucher rapide sur chaque écran en deux touchers (accueil, exercices, niveaux, leçons, tables,
//               entraînement libre) : lancé aussitôt, la mascotte se tait, pas de bulle ;
//   choix     : chaque écran de choix avec une tuile sélectionnée (agrandissements de l'entourage), sans étiquette d'appui long ;
//   jeu       : les écrans de jeu à la taille de la tablette (échauffement, ligne, voiliers et sa bulle « trois-cent-… », étal) ;
//               aucune bulle vide ; les voiliers filmés image par image à leur démarrage, sans l'ancienne mer ;
//   parent    : le bouton de l'espace parent pendant l'appui long ; les icônes (la maskable découpée en rond).
//   node tests/e2e/correctifs-2.mjs [--seul demarrage,accueil,double,choix,jeu,parent] [--out dossier]
import { accueilReel, chromium, demarrageReel } from "./navigateur.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(arg("--out", "tests/e2e/out/correctifs-2")); mkdirSync(OUT, { recursive: true });
const seul = arg("--seul")?.split(","), part = (p) => !seul || seul.includes(p);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const TABLETTE = [1138, 711, 2.25], TAILLES = [[1280, 800, 1], [1920, 1200, 1], TABLETTE];
const nom = ([w, , d]) => (d > 1 ? `${w}d${d}` : String(w));
const textes = JSON.parse(readFileSync("app/content/textes.json", "utf8"));
const releve = [];

async function open(taille, q = "", { reel = true, demarrage = false, prep = null } = {}) {
  const [w, h, d] = taille, context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: d, hasTouch: true });
  if (reel) await accueilReel(context);
  if (demarrage) await demarrageReel(context);
  const page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  if (prep) { await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined); await page.evaluate(prep); }
  await page.goto(url + "?nosw&voix=rapide&son=non" + q);
  if (!demarrage) { await page.waitForFunction(() => window.__ready !== undefined); await espion(page); }
  return { page, context, errors };
}
// ce que la voix dit, et ce qu'écrit la bulle
const espion = (page) => page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
const shot = async (page, n, taille, clip = null) => {
  const f = `${nom(taille)}-${n}.png`; await page.screenshot({ path: join(OUT, f), ...(clip ? { clip } : {}) });
  const x = await page.evaluate(() => { const b = window.__app?.bulle?.etat?.(); const d = window.__said ?? []; const r = { dit: d.slice(window.__vu ?? 0), bulle: b?.visible ? b.texte : null }; window.__vu = d.length; return r; }).catch(() => ({}));
  releve.push({ capture: f, ...x });
};
const rect = (page, sel) => page.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const k = window.__app.stage.k, r0 = window.__app.stage.ui.getBoundingClientRect(), r = e.getBoundingClientRect(); return [(r.left - r0.left) / k, (r.top - r0.top) / k, (r.right - r0.left) / k, (r.bottom - r0.top) / k]; }, sel);
const coupe = (a, b) => !!a && !!b && a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const tap2 = async (page, sel, gap = 120) => { await page.locator(sel).first().tap({ force: true }); await page.waitForTimeout(gap); await page.locator(sel).first().tap({ force: true }); };
const MASCOTTE = [22, 136, 232, 416];

// ---------------------------------------------------------------- l'écran de démarrage
if (part("demarrage")) for (const taille of [[1280, 800, 1], TABLETTE]) {
  const { page, context, errors } = await open(taille, "", { demarrage: true, reel: false });
  await page.waitForSelector(".demarrage-logo img.demarrage-texte", { timeout: 20000 });
  await page.waitForTimeout(250); await shot(page, "demarrage-1-chargement", taille);
  await page.waitForSelector(".demarrage.pret", { timeout: 120000 });
  await page.waitForTimeout(1200); await shot(page, "demarrage-2-pret", taille);
  check(await page.evaluate(() => getComputedStyle(document.querySelector(".demarrage-continuer")).opacity > 0.9), `${nom(taille)} démarrage : « Toucher pour continuer » sous la barre`);
  for (let i = 0; i < 8; i++) { await page.waitForTimeout(500); await page.screenshot({ path: join(OUT, `${nom(taille)}-demarrage-suite-${i}.png`) }); }
  await page.waitForTimeout(3000);
  const m = await page.evaluate(() => window.__demarrageMesure);
  console.log(`     ${nom(taille)} temps d'image de l'écran de démarrage : ${JSON.stringify(m)}`);
  releve.push({ capture: `${nom(taille)}-demarrage-mesure`, mesure: m });
  check(m && m.images > 20, `${nom(taille)} démarrage : le temps d'image est mesuré (${m?.moyenneMs} ms en moyenne une fois chargé, niveau d'allègement ${m?.niveau})`);
  await page.locator(".demarrage").tap({ force: true });
  await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 30000 });
  await page.waitForTimeout(600);
  check(await page.evaluate(() => !document.querySelector(".demarrage") && !document.querySelector(".demarrage-logo")), `${nom(taille)} démarrage : touché, l'écran s'en va (boucle arrêtée, images libérées)`);
  check(!errors.length, `${nom(taille)} démarrage : aucune erreur (${errors[0] ?? ""})`);
  await context.close();
  // la maquette, à la même taille
  const [w, h, d] = taille, mp = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: d });
  await mp.goto(`file://${resolve("art/logo/index.html")}`); await mp.waitForTimeout(4200);
  await mp.screenshot({ path: join(OUT, `${nom(taille)}-demarrage-maquette.png`) }); await mp.close();
}

// ---------------------------------------------------------------- l'accueil en galets
if (part("accueil")) for (const taille of TAILLES) {
  const { page, context, errors } = await open(taille);
  await page.waitForSelector(".galet"); await page.waitForTimeout(500);
  await shot(page, "accueil-0", taille);
  const ids = ["jouer", "choisir", "lecons", "recif", "album"], R = {};
  for (const k of ids) R[k] = await rect(page, `.galet[data-key="${k}"]`);
  const logo = await rect(page, ".logo");
  check(ids.every((k) => !coupe(R[k], MASCOTTE) && !coupe(R[k], logo)), `${nom(taille)} accueil : aucun galet sur la mascotte ni sur le bouton de l'espace parent`);
  check(ids.every((k, i) => !i || R[k][0] >= R[ids[i - 1]][2]), `${nom(taille)} accueil : les galets ne se chevauchent pas`);
  check(ids.every((k) => R[k][2] - R[k][0] >= 200), `${nom(taille)} accueil : chaque galet fait au moins 200 px de large`);
  for (const k of ids) {
    await page.locator(`.galet[data-key="${k}"]`).tap({ force: true }); await page.waitForTimeout(900);
    const b = await page.evaluate(() => window.__app.bulle.etat()), dit = await page.evaluate(() => window.__said.at(-1));
    check(dit === textes.accueilDescription[k] && b.visible && b.texte === dit, `${nom(taille)} accueil : « ${k} » sélectionné, la mascotte dit et la bulle écrit « ${dit} »`);
    check(!coupe(b.rect, MASCOTTE) && !coupe(b.rect, logo) && !coupe(b.rect, R[k]), `${nom(taille)} accueil : la bulle de « ${k} » ne couvre ni la mascotte, ni le bouton de l'espace parent, ni son galet`);
    check(await page.evaluate((k) => document.querySelector(".galet.play, .galet.choisir, .galet.leconskey, .galet.reefkey, .galet.albumkey") && !!document.querySelector(`.galet[data-key="${k}"]`), k), `${nom(taille)} accueil : un toucher ne lance pas « ${k} »`);
    await shot(page, `accueil-${k}`, taille);
  }
  // un toucher ailleurs désélectionne
  await page.touchscreen.tap(640 * (taille[0] / 1280), 300 * (taille[1] / 800)); await page.waitForTimeout(500);
  check(await page.evaluate(() => !document.querySelector(".galet.choisie")), `${nom(taille)} accueil : un toucher ailleurs désélectionne`);
  // la consigne de la mascotte touchée
  await page.locator(".mascotte-tap").tap({ force: true }); await page.waitForTimeout(400);
  check((await page.evaluate(() => window.__said.at(-1))) === textes.accueilConsigne, `${nom(taille)} accueil : la mascotte touchée dit « ${textes.accueilConsigne} »`);
  check(!errors.length, `${nom(taille)} accueil : aucune erreur (${errors[0] ?? ""})`);
  await context.close();
  // la séance du jour faite : « Encore ! » et la lune
  const F = await open(taille, "", { prep: async () => { await window.__app.store.add("seances", { debut: Date.now() - 600000, fin: Date.now() - 60000, terminee: true, module: 1, questions: 20, justes: 18, etapes: [] }); } });
  await F.page.waitForSelector(".galet.again"); await F.page.waitForTimeout(600);
  const lune = await rect(F.page, ".moon"), G = await Promise.all(["encore", "lecons", "recif", "album"].map((k) => rect(F.page, `.galet[data-key="${k}"]`)));
  check(G.every((r) => !coupe(r, lune) && !coupe(r, MASCOTTE)), `${nom(taille)} séance faite : « Encore ! », les leçons, le récif et l'album, rien sur la lune ni la mascotte`);
  await F.page.locator('.galet[data-key="encore"]').tap({ force: true }); await F.page.waitForTimeout(900);
  check((await F.page.evaluate(() => window.__said.at(-1))) === textes.accueilDescription.encore, `${nom(taille)} séance faite : « Encore ! » sélectionné, la mascotte le dit`);
  await shot(F.page, "accueil-encore", taille);
  await F.context.close();
}

// ---------------------------------------------------------------- le double toucher rapide
if (part("double")) {
  const taille = TABLETTE;
  const rapide = async (page, sel, attendu, quoi) => {
    await page.evaluate(() => { window.__said.length = 0; });
    await tap2(page, sel);
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => ({ bulle: window.__app.bulle.etat(), said: window.__said.slice(), parle: window.__app.voice.talking?.text ?? null }));
    const lance = await page.waitForSelector(attendu, { timeout: 20000 }).then(() => true, () => false);
    check(lance, `double toucher rapide sur ${quoi} : lancé aussitôt`);
    return r;
  };
  const { page, context, errors } = await open(taille, "&cran=conseille");
  await page.waitForSelector(".galet"); await page.waitForTimeout(400);
  let r = await rapide(page, '.galet[data-key="choisir"]', ".choix-ex", "le galet « choisir » de l'accueil");
  check(r.parle !== textes.accueilDescription.choisir && r.bulle.texte !== textes.accueilDescription.choisir, "accueil : la mascotte ne dit pas la description (elle se tait aussitôt), sa bulle ne l'écrit pas");
  await page.waitForTimeout(600); await shot(page, "double-1-exercices", taille);
  r = await rapide(page, '.choix-ex[data-key="voiliers"]', ".choix-tuile", "l'exercice « voiliers »");
  check(!r.bulle.visible || !r.bulle.texte.startsWith(textes.choixNom.voiliers), `exercices : pas de bulle de la tuile après le double toucher (bulle : « ${r.bulle.texte} »)`);
  await page.waitForTimeout(500);
  r = await rapide(page, '.choix-tuile[data-key="1"]', ".skip-warmup, canvas.voiliers", "le niveau 1 des voiliers (la séance commence)");
  check(!r.bulle.visible || !r.bulle.texte.startsWith(textes.choixVoiliers["1"]), `niveaux : pas de bulle de la tuile après le double toucher (bulle : « ${r.bulle.texte} »)`);
  await page.waitForTimeout(1500); await shot(page, "double-2-voiliers-lance", taille);
  check(!errors.length, `double toucher : aucune erreur (${errors[0] ?? ""})`);
  await context.close();
  // les leçons et les tables
  const L = await open(taille);
  await L.page.waitForSelector(".galet"); await rapide(L.page, '.galet[data-key="lecons"]', ".lecons-tuile", "le galet « les leçons »");
  await L.page.waitForTimeout(800);
  await rapide(L.page, '.lecons-tuile[data-key="table.addition"]', ".table-grille, canvas.table-grille", "la table d'addition");
  await L.page.waitForTimeout(800); await shot(L.page, "double-3-table", taille);
  await L.page.locator(".session-home").tap({ force: true }); await L.page.waitForSelector(".galet", { timeout: 20000 }); await L.page.waitForTimeout(500);
  await tap2(L.page, '.galet[data-key="lecons"]'); await L.page.waitForSelector(".lecons-tuile"); await L.page.waitForTimeout(800);
  await rapide(L.page, '.lecons-tuile[data-key="L1"]', ".lessonkey", "la leçon L1");
  await L.context.close();
  // l'entraînement libre (« Encore ! ») : le même écran « choisir »
  const F = await open(taille, "", { prep: async () => { await window.__app.store.add("seances", { debut: Date.now() - 600000, fin: Date.now() - 60000, terminee: true, module: 1, questions: 20, justes: 18, etapes: [] }); } });
  await F.page.waitForSelector(".galet.again");
  await rapide(F.page, '.galet[data-key="encore"]', ".choix-ex", "« Encore ! »");
  await F.page.waitForTimeout(400);
  await rapide(F.page, '.choix-ex[data-key="ligne"]', ".choix-tuile", "un exercice de l'entraînement libre");
  await F.page.waitForTimeout(400);
  await rapide(F.page, '.choix-tuile[data-key="2"]', ".cran", "un niveau de l'entraînement libre");
  await F.context.close();
}

// ---------------------------------------------------------------- les écrans de choix, une tuile sélectionnée
if (part("choix")) for (const taille of TAILLES) {
  const { page, context, errors } = await open(taille, "&cran=conseille");
  const k = taille[0] / 1280, zoom = async (sel, n) => { const r = await rect(page, sel); if (!r) return; await shot(page, n, taille, { x: Math.max(0, (r[0] - 30) * k), y: Math.max(0, (r[1] - 30) * k), width: (r[2] - r[0] + 60) * k, height: (r[3] - r[1] + 60) * k }); };
  await tap2(page, '.galet[data-key="choisir"]', 450); await page.waitForSelector(".choix-ex"); await page.waitForTimeout(600);
  await page.locator('.choix-ex[data-key="etal"]').tap({ force: true }); await page.waitForTimeout(900);
  await shot(page, "choix-exercices", taille); await zoom('.choix-ex[data-key="etal"]', "choix-exercices-zoom");
  // l'appui long : rien de plus que la bulle
  const b = await page.locator('.choix-ex[data-key="ligne"]').boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(900);
  check(await page.evaluate(() => !document.querySelector(".etiquette")), `${nom(taille)} choisir : l'appui long ne montre pas d'étiquette`);
  await page.mouse.up(); await page.waitForTimeout(300);
  check(await page.evaluate(() => !!document.querySelector(".choix-ex")), `${nom(taille)} choisir : l'appui long ne lance rien`);
  for (const ex of ["ligne", "additions", "calcul", "voiliers", "multiplication", "etal"]) {
    if (taille[0] === 1920 && !["ligne", "calcul"].includes(ex)) continue;
    await tap2(page, `.choix-ex[data-key="${ex}"]`, 450); await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(600);
    await page.locator('.choix-tuile[data-key="3"]').tap({ force: true }); await page.waitForTimeout(900);
    await shot(page, `choix-niveaux-${ex}`, taille); await zoom('.choix-tuile[data-key="3"]', `choix-niveaux-${ex}-zoom`);
    await page.locator(".choix-retour").tap({ force: true }); await page.waitForSelector(".choix-ex"); await page.waitForTimeout(500);
  }
  await page.locator(".session-home").tap({ force: true }); await page.waitForSelector(".galet"); await page.waitForTimeout(400);
  await tap2(page, '.galet[data-key="lecons"]', 450); await page.waitForSelector(".lecons-tuile"); await page.waitForTimeout(700);
  await page.locator('.lecons-tuile[data-key="L7"]').tap({ force: true }); await page.waitForTimeout(900);
  await shot(page, "choix-lecons", taille); await zoom('.lecons-tuile[data-key="L7"]', "choix-lecons-zoom");
  await page.locator('.lecons-tuile[data-key="table.multiplication"]').tap({ force: true }); await page.waitForTimeout(900);
  await shot(page, "choix-tables", taille); await zoom('.lecons-tuile[data-key="table.multiplication"]', "choix-tables-zoom");
  check(!errors.length, `${nom(taille)} choix : aucune erreur (${errors[0] ?? ""})`);
  await context.close();
}

// ---------------------------------------------------------------- les écrans de jeu à la taille de la tablette ; la bulle
if (part("jeu")) {
  const taille = TABLETTE;
  // l'échauffement : aucune bulle vide, la bulle de chaque phrase contient son texte
  const E = await open(taille, "&cran=conseille&module=1&faits=6");
  await E.page.evaluate(() => { window.__vides = []; const b = window.__app.bulle; const f = () => { const op = parseFloat(getComputedStyle(b.el).opacity), on = b.el.querySelectorAll(".m.on").length, t = b.txt.textContent.trim(); if (op > 0.05 && (!t || !on)) window.__vides.push({ t: Math.round(performance.now()), op, txt: t }); requestAnimationFrame(f); }; f(); });
  await tap2(E.page, '.galet[data-key="jouer"]', 450);
  await E.page.waitForFunction(() => window.__app.session?.progress.etape === "echauffement", null, { timeout: 30000 });
  for (let i = 0; i < 4; i++) {
    await E.page.waitForFunction(() => { const f = window.__app.facts; return f?.resolve && !f.locked && f.q; }, null, { timeout: 30000 });
    if (i === 0) { await E.page.waitForTimeout(300); await shot(E.page, "jeu-echauffement", taille); }
    const e = await E.page.evaluate(() => { const q = window.__app.facts.q, f = q.forme; return f === "trouDroite" ? q.b : f === "trouGauche" ? q.a : q.a + q.b; });
    for (const d of String(e)) { await E.page.tap(`.key[data-key="${d}"]`, { force: true }); await E.page.waitForTimeout(160); }
    await E.page.tap('.key[data-key="valider"]', { force: true }); await E.page.waitForTimeout(400);
  }
  const vides = await E.page.evaluate(() => window.__vides);
  check(!vides.length, `échauffement : aucune bulle vide (${vides.length} images)`);
  await E.context.close();
  // la ligne, l'étal
  for (const [q, n, attendre] of [["&choix=1:3", "jeu-ligne", ".answer, .touchband"], ["&choix=6:2", "jeu-etal", "canvas.etal-decor"]]) {
    const P = await open(taille, `&cran=conseille&sans=echauffement${q}`);
    await tap2(P.page, '.galet[data-key="jouer"]', 450);
    await P.page.waitForSelector(attendre, { timeout: 60000 }).catch(() => {}); await P.page.waitForTimeout(4000);
    await shot(P.page, n, taille); await P.context.close();
  }
  // les voiliers : filmés image par image à leur démarrage ; puis la bulle d'un nombre à trois chiffres
  const V = await open(taille, "&cran=conseille&sans=echauffement&choix=4:3");
  const cdp = await V.context.newCDPSession(V.page), images = [];
  cdp.on("Page.screencastFrame", async (f) => { images.push(f.data); await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await tap2(V.page, '.galet[data-key="jouer"]', 450);
  await V.page.waitForSelector("canvas.voiliers", { timeout: 60000 });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, maxWidth: 640, maxHeight: 400, everyNthFrame: 1 });
  await V.page.waitForFunction(() => window.__app.voiliers?.attend, null, { timeout: 90000 });
  await cdp.send("Page.stopScreencast");
  // l'ancienne mer calculée : sombre et grise (la mer illustrée et son fond fixe sont clairs, le lagon est turquoise)
  const stats = await V.page.evaluate(async (imgs) => Promise.all(imgs.map(async (b64) => {
    const im = new Image(); im.src = `data:image/jpeg;base64,${b64}`; await im.decode();
    const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const x = c.getContext("2d"); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, Math.round(im.height * 0.42), im.width, Math.round(im.height * 0.25)).data; let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  })), images);
  const sombres = stats.filter(([r, g, b]) => b >= g && (r + g + b) / 3 < 105);
  writeFileSync(join(OUT, "voiliers-demarrage-images.json"), JSON.stringify(stats));
  images.forEach((b64, i) => { if (i % 3 === 0 || sombres.length) writeFileSync(join(OUT, `voiliers-demarrage-${String(i).padStart(3, "0")}.jpg`), Buffer.from(b64, "base64")); });
  check(images.length >= 5 && !sombres.length, `voiliers : ${images.length} images du démarrage, aucune de l'ancienne mer (${sombres.length} sombres)`);
  await V.page.waitForTimeout(400); await shot(V.page, "jeu-voiliers", taille);
  const bul = await V.page.evaluate(() => { const b = window.__app.bulle, x = b.txt; return { etat: b.etat(), dans: x.scrollWidth <= x.offsetWidth + 1, coupe: x.classList.contains("coupe") }; });
  check(!bul.etat.visible || bul.dans, `voiliers : la bulle contient son texte (« ${bul.etat.texte} »${bul.coupe ? ", coupé aux traits d'union" : ""})`);
  await V.context.close();
}

// ---------------------------------------------------------------- le bouton de l'espace parent, les icônes
if (part("parent")) for (const taille of [[1280, 800, 1], TABLETTE]) {
  const { page, context } = await open(taille);
  const k = taille[0] / 1280, clip = { x: 0, y: 630 * k, width: 190 * k, height: 170 * k };
  await page.waitForSelector(".logo"); await page.waitForTimeout(400);
  await shot(page, "parent-0", taille, clip);
  const b = await page.locator(".logo").boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(1000);
  await shot(page, "parent-appui", taille, clip);
  await page.waitForTimeout(1300); await page.mouse.up();
  check(await page.evaluate(() => !!document.querySelector(".pa-veil, .parent, .pa-root, .pa-gate") || !!window.__app.parent.root), `${nom(taille)} espace parent : l'appui long de 2 s l'ouvre`);
  await context.close();
}
if (part("parent")) {
  const page = await browser.newPage({ viewport: { width: 900, height: 360 } }), ic = (f) => `file://${resolve("app/icons", f)}`;
  writeFileSync(join(OUT, "icones.html"), `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#3a4a57;display:flex;gap:24px;align-items:center;padding:24px;font:14px sans-serif;color:#fff">
    ${["icone-512.png", "icone-192.png", "icone-180.png"].map((f) => `<figure style="margin:0;text-align:center"><img src="${ic(f)}" width="160" height="160"><figcaption>${f}</figcaption></figure>`).join("")}
    <figure style="margin:0;text-align:center"><img src="${ic("icone-maskable-512.png")}" width="160" height="160" style="border-radius:50%"><figcaption>maskable, en rond</figcaption></figure>
    <figure style="margin:0;text-align:center"><img src="${ic("icone-maskable-512.png")}" width="160" height="160" style="border-radius:22%"><figcaption>maskable, carré arrondi</figcaption></figure></body>`);
  await page.goto(`file://${join(OUT, "icones.html")}`); await page.waitForTimeout(500); await page.screenshot({ path: join(OUT, "icones.png") }); await page.close();
}

writeFileSync(join(OUT, "releve.json"), JSON.stringify(releve, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nparcours du lot : tout est conforme");
process.exitCode = fail.length ? 1 : 0;
