// LOT « L'ÉTAL DU PÊCHEUR » (docs/SPEC.md, section 7 quater ; docs/LOTS.md, fiche 7) : parcours de l'exercice de monnaie dans
// l'application. Chaque situation nouvelle, avec ses captures en 1280 × 800 et 1920 × 1200 (tests/e2e/out/etal) :
//  1. « choisir » : six exercices, les dix niveaux de l'étal ;
//  2. beau temps, niveau 3, cran conseillé, base neuve : l'exemple guidé ; le portefeuille fermé, ouvert (toucher), l'argent
//     sorti (toucher), une pièce posée d'un toucher, le paiement juste, le compte du pêcheur, l'achat ; « pas assez » (compléter,
//     erreur corrigée) ; « trop » (il rend ce qui est en trop) puis la correction ; « je ne sais pas » ; la pause et la reprise ;
//  3. mauvais temps, niveau 6 : le paiement sans pièce de trop et la monnaie rendue par le pêcheur ; une pièce de trop ;
//  4. l'orage qui arrive en cours de partie, et la réplique de la mascotte, entre deux questions ;
//  5. niveau 7 : « Combien je te rends ? » au pavé (et au clavier), juste ; le prix rendu (M5) et le saut sur la ligne ; cran
//     « plus facile » : la ligne d'emblée ;
//  6. niveau 8 (deux produits), niveaux 9 et 10 (les centimes) au cran « plus facile » (total dit et écrit, valeur sur l'argent) ;
//  7. niveau 1 : la mauvaise pièce (M7) et sa correction ;
//  8. les leçons L15 à L18, et le menu des leçons à cinq rangées ;
//  9. « jouer » avec l'étal imposé par le parent ; l'espace parent (le bloc de l'étal, le journal des erreurs) ; l'entraînement
//     libre (« Encore ! ») quitté par la maison ;
// et, partout : aucune erreur dans la page, la bulle de la mascotte ne couvre jamais la caisse.
//   node tests/e2e/etal.mjs [--out dossier] [--petit] (--petit : seulement 1280 × 800)
import { chromium } from "./navigateur.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/etal"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const TAILLES = args.includes("--petit") ? [[1280, 800]] : [[1280, 800], [1920, 1200]];
const open = async (q, [w, h], prep = null) => {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("echauffement", false); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  // (la bulle ne couvre jamais la caisse : relevé à chaque image où elle est visible)
  await page.evaluate(() => {
    window.__bulleSurCaisse = [];
    const inter = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
    // (la bulle vérifie quatre fois par seconde qu'elle ne couvre rien : quand l'enfant sort l'argent sous elle, elle change de
    // place ou s'efface ; une couverture qui dure plus de 0,4 s est un défaut)
    let depuis = null;
    const tick = (t) => { const e = window.__app.etal, b = window.__app.bulle?.etat?.(); const z = e?.actif && e.attend && b?.visible && b.rect ? e.obstacles().find((z) => inter(b.rect, z)) : null;
      if (!z) depuis = null; else { depuis ??= t; if (t - depuis > 400) { window.__bulleSurCaisse.push({ bulle: b.rect, zone: z, texte: b.texte }); depuis = null; } } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  return { page, context, errors };
};
const attend = (page, t = 60000) => page.waitForFunction(() => window.__app.etal?.attend, null, { timeout: t, polling: 50 });
const question = (page) => page.evaluate(() => { const q = window.__app.etal.q; return { type: q.type, niveau: q.niveau, prix: q.prix, billet: q.billet, valeur: q.valeur, portefeuille: q.portefeuille, produits: q.produits, prixProduits: q.prixProduits, guide: !!q.guide }; });
const etat = (page) => page.evaluate(() => window.__app.etal.api.etat());
// poser des pièces et des billets (comme le doigt, par la scène) ; `quoi` : « juste », « pasAssez », « trop », « pieceDeTrop »
const payer = (page, quoi) => page.evaluate(async (quoi) => {
  const { solution, rendu } = await import("./js/modules/etal/etal.js"); void rendu;
  const e = window.__app.etal, q = e.q, cfg = window.__app.module6.niveaux[q.niveau - 1], sol = solution(cfg, q.type === "poser" ? 0 : q.prix, q.portefeuille, q.valeur);
  const restant = () => { const w = [...q.portefeuille]; for (const v of sol) w.splice(w.indexOf(v), 1); return w; };
  let vs = sol;
  if (quoi === "pasAssez") vs = sol.length > 1 ? sol.slice(0, -1) : [Math.min(...q.portefeuille)];
  // (pas autant d'objets que le prix en euros : ce serait M4, « le nombre au lieu de la valeur », sans deuxième essai)
  if (quoi === "trop" || quoi === "pieceDeTrop") { const r = restant().sort((x, y) => x - y); vs = [...sol, r[0]]; if (vs.length * 100 === q.prix && r.length > 1) vs.push(r[1]); }
  if (quoi === "mauvais") vs = [q.portefeuille.find((v) => v !== q.valeur)];
  for (const v of vs) { await e.api.deposer(v); await new Promise((r) => setTimeout(r, 120)); }
  return vs;
}, quoi);
const coche = async (page) => { await page.waitForSelector(".etal-coche", { state: "visible", timeout: 10000 }); await page.dispatchEvent(".etal-coche", "pointerdown"); await page.dispatchEvent(".etal-coche", "pointerup"); };
const said = (page) => page.evaluate(() => window.__said.join(" | "));
const releve = [];
const shot = async (page, n, [w]) => {
  await page.screenshot({ path: join(OUT, `${n}-${w}.png`) });
  const x = await page.evaluate(() => { const d = window.__said ?? [], b = window.__app.bulle?.etat?.(); const r = { dit: d.slice(window.__vu ?? 0), bulle: b?.visible ? b.texte : null }; window.__vu = d.length; return r; }).catch(() => ({}));
  releve.push({ capture: `${n}-${w}.png`, ...x });
};
const fin = async (page, context, errors, quoi) => {
  const sur = await page.evaluate(() => window.__bulleSurCaisse ?? []);
  check(!sur.length, `${quoi} : la bulle ne couvre jamais la caisse (${JSON.stringify(sur.slice(0, 2))})`);
  check(!errors.length, `${quoi} : aucune erreur (${errors.join(" | ")})`); await context.close();
};
const reponses = (page) => page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 6).map((r) => ({ juste: r.juste, erreur: r.erreur, corrigee: !!r.corrigee, guide: r.guide, niveau: r.niveau, donnee: r.donnee, etal: r.etal })));

for (const T of TAILLES) {
  const [W] = T;
  // 1. « choisir » : six exercices, les dix niveaux de l'étal
  {
    const { page, context, errors } = await open("", T);
    await page.tap(".choisir", { force: true }); await page.waitForSelector(".choix-ex", { timeout: 15000 }); await page.waitForTimeout(500);
    check((await page.locator(".choix-ex").count()) === 6, `${W} : six exercices dans « choisir »`);
    await page.tap('.choix-ex[data-key="etal"]', { force: true }); await page.waitForTimeout(700);
    await shot(page, "01-choisir-exercices", T);
    await page.tap('.choix-ex[data-key="etal"]', { force: true }); await page.waitForTimeout(900);
    check((await page.locator(".choix-tuile").count()) === 10, `${W} : dix niveaux de l'étal`);
    await page.tap('.choix-tuile[data-key="9"]', { force: true }); await page.waitForTimeout(900);
    await shot(page, "02-choisir-niveaux", T);
    await fin(page, context, errors, `${W} choisir`);
  }
  // 2. beau temps, niveau 3, cran conseillé, base neuve
  {
    const { page, context, errors } = await open("&choix=6:3&cran=conseille&meteo=beau", T);
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => window.__app.etal?.q?.guide && window.__app.etal.api.soucoupe().length > 0, null, { timeout: 60000 }); await page.waitForTimeout(300);
    await shot(page, "03-exemple-guide", T);
    await attend(page); await page.waitForTimeout(600);
    const s0 = await etat(page);
    check(s0.pf === "ferme" && s0.meteoCible === 0 && s0.allumes.length === 1, `${W} : beau temps, portefeuille fermé, un produit allumé (${JSON.stringify({ pf: s0.pf, allumes: s0.allumes })})`);
    await shot(page, "04-beau-temps-portefeuille-ferme", T);
    // le doigt : ouvrir le portefeuille, sortir l'argent, poser une pièce d'un toucher
    const box = async (sel) => { const b = await page.locator(sel).boundingBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };
    await page.touchscreen.tap(...(await box("#etal-pf"))); await page.waitForFunction(() => window.__app.etal.api.etat().pf === "ouvert", null, { timeout: 5000 }); await page.waitForTimeout(400);
    await shot(page, "05-portefeuille-ouvert", T);
    const [fx, fy] = await box("#etal-pfFond"); await page.mouse.click(fx, fy); await page.waitForTimeout(700);
    check((await etat(page)).pf === "sorti", `${W} : un toucher sur le portefeuille sort l'argent`);
    await shot(page, "06-argent-sorti", T);
    const q1 = await question(page);
    // une pièce sortie, touchée, va dans la soucoupe
    const piece = (await page.evaluate(() => window.__app.etal.api.rects())).find((r) => r.lieu === "sortie" && r.v < 500), posee = !!piece;
    if (piece) await page.mouse.click(piece.x, piece.y);
    await page.waitForTimeout(500);
    check(posee && (await etat(page)).soucoupe.length === 1, `${W} : une pièce touchée va dans la soucoupe`);
    // le reste : payer juste (on rend d'abord la pièce posée, puis la bonne façon)
    await page.evaluate(() => window.__app.etal.api.rendre()); await page.waitForTimeout(500);
    await payer(page, "juste"); await page.waitForTimeout(500);
    await shot(page, "07-paiement-juste", T);
    await coche(page); await page.waitForTimeout(250);
    await shot(page, "08-compte", T);
    await attend(page); await page.waitForTimeout(300);
    const r1 = await reponses(page);
    check(r1.at(-1)?.juste === true, `${W} : payé juste du premier coup (${q1.prix} : ${JSON.stringify(r1.at(-1)?.etal?.soucoupe)})`);
    // « pas assez » : il dit ce qui manque, l'enfant complète une fois
    await payer(page, "pasAssez"); await coche(page);
    await page.waitForFunction(() => window.__said.some((t) => t.startsWith("Il manque…")), null, { timeout: 30000 }); await page.waitForTimeout(400);
    await shot(page, "09-pas-assez", T);
    await attend(page);
    await page.evaluate(async () => { const { solution } = await import("./js/modules/etal/etal.js"); const e = window.__app.etal, q = e.q, cfg = window.__app.module6.niveaux[q.niveau - 1]; const deja = e.api.soucoupe(), reste = [...q.portefeuille]; for (const v of deja) reste.splice(reste.indexOf(v), 1); for (const v of solution(cfg, q.prix - deja.reduce((x, y) => x + y, 0), reste)) await e.api.deposer(v); });
    await page.waitForTimeout(300); await coche(page); await attend(page);
    const r2 = (await reponses(page)).at(-1);
    check(!r2.juste && r2.corrigee && r2.erreur === "M1", `${W} : pas assez, complété : erreur corrigée M1 (${JSON.stringify(r2)})`);
    // « trop » : il rend tout l'argent (relecture du lot, R1) ; puis on paie trop encore : la correction
    await payer(page, "trop"); await coche(page);
    await page.waitForFunction(() => window.__said.some((t) => t.startsWith("Tu peux faire le compte juste.")), null, { timeout: 30000 }); await page.waitForTimeout(500);
    await shot(page, "10-trop", T);
    await attend(page);
    check((await page.evaluate(() => window.__app.etal.api.soucoupe().length)) === 0, `${W} : trop : tout l'argent est rendu, la soucoupe est vide`);
    await payer(page, "trop"); await page.waitForTimeout(300); await coche(page);
    await page.waitForFunction(() => window.__said.some((t) => t === "Regarde, on peut payer comme ça."), null, { timeout: 30000 }); await page.waitForTimeout(1200);
    await shot(page, "11-correction", T);
    await attend(page);
    const r3 = (await reponses(page)).at(-1);
    check(!r3.juste && !r3.corrigee && r3.erreur === "M2", `${W} : trop deux fois : M2, la correction (${JSON.stringify({ e: r3.erreur, s: r3.etal?.soucoupe, s2: r3.etal?.soucoupe2 })})`);
    // « je ne sais pas »
    await page.dispatchEvent(".etal-nsp", "pointerdown"); await page.dispatchEvent(".etal-nsp", "pointerup");
    await page.waitForFunction(() => window.__app.etal.api.soucoupe().length > 0, null, { timeout: 30000 }); await page.waitForTimeout(400);
    await shot(page, "12-je-ne-sais-pas", T);
    await attend(page);
    check((await reponses(page)).at(-1).erreur === "NSP", `${W} : « je ne sais pas » noté NSP`);
    // la pause et la reprise
    await page.tap(".session-home", { force: true }); await page.waitForTimeout(1200);
    check(await page.evaluate(() => window.__app.enPause && getComputedStyle(document.querySelector(".etal-scene")).visibility === "visible"), `${W} : en pause, l'étal reste visible`);
    await shot(page, "13-pause", T);
    await page.tap(".bubble.play.keep", { force: true }); await page.waitForTimeout(800);
    check(/On continue/.test(await said(page)), `${W} : reprise, « On continue ! »`);
    await shot(page, "14-reprise", T);
    await fin(page, context, errors, `${W} beau temps`);
  }
  // 3. mauvais temps, niveau 6 : paiement sans pièce de trop, la monnaie rendue ; une pièce de trop
  {
    const { page, context, errors } = await open("&choix=6:6&cran=conseille&meteo=orage", T, async () => { await window.__app.store.put("niveaux", { module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: [], exemples: [6] }); });
    await page.tap(".play", { force: true }); await attend(page); await page.waitForTimeout(700);
    check((await etat(page)).meteoCible === 1, `${W} : mauvais temps dès l'entrée`);
    await shot(page, "15-mauvais-temps", T);
    await payer(page, "juste"); await page.waitForTimeout(300); await coche(page);
    await page.waitForFunction(() => window.__said.some((t) => t === "Je te rends la monnaie."), null, { timeout: 30000 }); await page.waitForTimeout(900);
    await shot(page, "16-monnaie-rendue", T);
    await attend(page);
    const r = (await reponses(page)).at(-1);
    check(r.juste && r.etal.rendu > 0, `${W} : niveau 6, juste sans pièce de trop, monnaie rendue (${JSON.stringify(r.etal)})`);
    // (une pièce de trop n'est possible que s'il reste de l'argent hors de la solution : sinon, payer juste et passer à l'achat suivant)
    for (let i = 0; i < 4 && !(await page.evaluate(async () => { const { solution } = await import("./js/modules/etal/etal.js"); const q = window.__app.etal.q, cfg = window.__app.module6.niveaux[q.niveau - 1]; return q.portefeuille.length > solution(cfg, q.prix, q.portefeuille).length; })); i++) { await payer(page, "juste"); await coche(page); await attend(page); }
    await payer(page, "pieceDeTrop"); await coche(page);
    await page.waitForFunction(() => window.__said.some((t) => /^Celles?-là, garde-l/.test(t)), null, { timeout: 30000 }); await page.waitForTimeout(500);
    await shot(page, "17-piece-de-trop", T);
    await attend(page);
    check((await page.evaluate(() => window.__app.etal.api.soucoupe().length)) === 0, `${W} : une pièce de trop : tout l'argent est rendu`);
    await payer(page, "juste"); await page.waitForTimeout(300); await coche(page); await attend(page);
    const r2 = (await reponses(page)).at(-1);
    check(r2.corrigee && r2.erreur === "M3", `${W} : une pièce de trop, puis repayé juste : M3 corrigée (${JSON.stringify(r2)})`);
    await fin(page, context, errors, `${W} mauvais temps`);
  }
  // 4. l'orage arrive en cours de partie (?meteo=arrive : au bout d'une seconde), entre deux questions
  {
    const { page, context, errors } = await open("&choix=6:2&cran=conseille&meteo=arrive&sansLecon", T, async () => { await window.__app.store.put("niveaux", { module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L16"], exemples: [2] }); });
    await page.tap(".play", { force: true }); await attend(page);
    check((await etat(page)).meteoCible === 0, `${W} : beau temps au départ`);
    await page.waitForTimeout(8500); await payer(page, "juste"); await coche(page);
    await page.waitForFunction(() => (window.__etalOrage ?? []).length > 0, null, { timeout: 30000 }); await page.waitForTimeout(1600);
    const T0 = await page.evaluate(() => window.__app.text.data.etalOrage);
    check((await said(page)).split(" | ").some((t) => T0.includes(t)), `${W} : la réplique de l'orage est dite`);
    await shot(page, "18-orage-arrive", T);
    await attend(page); await page.waitForTimeout(2500);
    await shot(page, "19-sous-la-pluie", T);
    await fin(page, context, errors, `${W} orage`);
  }
  // 5. niveau 7 : le pavé, juste ; le prix rendu (M5) et la ligne ; « plus facile » : la ligne d'emblée
  {
    const { page, context, errors } = await open("&choix=6:7&cran=conseille&meteo=beau&sansLecon", T, async () => { await window.__app.store.put("niveaux", { module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L17"], exemples: [7] }); });
    await page.tap(".play", { force: true }); await attend(page); await page.waitForTimeout(500);
    let q = await question(page);
    check(q.type === "rendre" && q.billet > q.prix, `${W} : niveau 7, le billet dans la soucoupe (${q.prix} / ${q.billet})`);
    for (const d of String((q.billet - q.prix) / 100)) { await page.keyboard.press(d); await page.waitForTimeout(220); }
    await page.waitForTimeout(300);
    await shot(page, "20-niveau7-pave", T);
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => window.__said.some((t) => t === "Je te rends la monnaie."), null, { timeout: 30000 }); await page.waitForTimeout(700);
    await shot(page, "21-niveau7-juste", T);
    await attend(page); q = await question(page);
    const faux = q.prix === q.billet - q.prix ? q.prix / 100 + 1 : q.prix / 100;
    for (const d of String(faux)) { await page.dispatchEvent(`.etal-key[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(200); }
    await coche(page);
    await page.waitForFunction(() => window.__app.etal.ligneVue && window.__app.lineScreen().arcs.length > 0, null, { timeout: 30000 }); await page.waitForTimeout(200);
    await shot(page, "22-niveau7-ligne", T);
    await attend(page);
    const r = await reponses(page);
    check(r.at(-2).juste && ["M5", "M6"].includes(r.at(-1).erreur), `${W} : niveau 7 juste, puis le prix rendu (M5, ou M6) et la ligne (${r.at(-1).erreur})`);
    await fin(page, context, errors, `${W} niveau 7`);
    const o = await open("&choix=6:7&cran=facile&meteo=beau&sansLecon", T, async () => { await window.__app.store.put("niveaux", { module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L17"], exemples: [7] }); });
    await o.page.tap(".play", { force: true }); await attend(o.page); await o.page.waitForFunction(() => window.__app.etal.ligneVue, null, { timeout: 20000 }); await o.page.waitForTimeout(500);
    await shot(o.page, "23-niveau7-ligne-demblee", T);
    await fin(o.page, o.context, o.errors, `${W} niveau 7 plus facile`);
  }
  // 6. deux produits ; les centimes au cran « plus facile »
  for (const [n, cran, nom] of [[8, "conseille", "24-deux-produits"], [9, "facile", "25-centimes-50"], [10, "facile", "26-centimes"]]) {
    const { page, context, errors } = await open(`&choix=6:${n}&cran=${cran}&meteo=beau&sansLecon`, T, async (n) => { await window.__app.store.put("niveaux", { module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L18"], exemples: [8, 9, 10] }); });
    await page.tap(".play", { force: true }); await attend(page); await page.waitForTimeout(400);
    const q = await question(page);
    if (n === 8) check(q.produits.length === 2 && (await etat(page)).allumes.length === 2, `${W} : deux produits allumés (${q.produits})`);
    await payer(page, "juste"); await page.waitForTimeout(700);
    await shot(page, nom, T);
    await coche(page); await attend(page);
    check((await reponses(page)).at(-1).juste, `${W} : niveau ${n}, payé juste (${q.prix})`);
    if (cran === "facile") check(((await said(page)).match(/\d+ euros?( \d+)?\.|\d+ centimes\./g) ?? []).length >= 2, `${W} : niveau ${n}, « plus facile » : le total est dit`);
    await fin(page, context, errors, `${W} niveau ${n}`);
  }
  // 7. niveau 1 : la mauvaise pièce (M7)
  {
    const { page, context, errors } = await open("&choix=6:1&cran=conseille&meteo=beau&sansLecon", T, async () => { await window.__app.store.put("niveaux", { module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L15"], exemples: [] }); });
    await page.tap(".play", { force: true }); await attend(page);
    await payer(page, "mauvais"); await coche(page);
    await page.waitForFunction(() => window.__said.some((t) => t.startsWith("Ça, c'est")), null, { timeout: 30000 }); await page.waitForTimeout(1500);
    await shot(page, "27-niveau1-mauvaise-piece", T);
    await attend(page);
    check((await reponses(page)).at(-1).erreur === "M7", `${W} : niveau 1, M7`);
    await fin(page, context, errors, `${W} niveau 1`);
  }
  // 8. les leçons L15 à L18 ; le menu des leçons à cinq rangées
  for (const id of ["L15", "L16", "L17", "L18"]) {
    const { page, context, errors } = await open(`&lecon=${id}&meteo=beau`, T);
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => window.__app.etalLecon?.actif, null, { timeout: 30000 });
    await page.waitForFunction(() => window.__said.length >= 3, null, { timeout: 60000 }); await page.waitForTimeout(600);
    await shot(page, `28-lecon-${id}`, T);
    await page.waitForFunction(() => window.__lecon, null, { timeout: 120000 });
    check(await page.evaluate(() => window.__lecon.vue && !window.__app.etalLecon && !document.querySelector(".etal-scene")), `${W} : la leçon ${id} vue jusqu'au bout, la scène rangée`);
    await fin(page, context, errors, `${W} leçon ${id}`);
  }
  {
    const { page, context, errors } = await open("", T);
    await page.tap(".leconskey", { force: true }); await page.waitForSelector(".lecons-tuile", { timeout: 15000 }); await page.waitForTimeout(500);
    check((await page.locator(".lecons-tuile").count()) === 20, `${W} : dix-huit leçons et deux tables au menu`);
    await page.tap('.lecons-tuile[data-key="L17"]', { force: true }); await page.waitForTimeout(800);
    await shot(page, "29-menu-lecons", T);
    await fin(page, context, errors, `${W} menu des leçons`);
  }
}
// 9. « jouer » avec l'étal imposé par le parent ; l'espace parent ; l'entraînement libre
{
  const T = TAILLES[0];
  const { page, context, errors } = await open("&cran=conseille&meteo=beau&sansLecon", T, async () => { await window.__app.store.setSetting("moduleImpose", { module: 6, t: Date.now() }); await window.__app.store.put("niveaux", { module: 6, niveau: 2, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: ["L16"], exemples: [] }); });
  await page.tap(".play", { force: true }); await attend(page);
  check(await page.evaluate(() => window.__app.session.rec.module === 6 && window.__app.frieze.icon === "frise.etal"), "module imposé : l'étal, son pictogramme dans la frise");
  await shot(page, "30-jouer-impose", T);
  await payer(page, "trop"); await coche(page); await attend(page); await payer(page, "juste"); await coche(page); await attend(page);
  await page.evaluate(async () => { await window.__app.store.setSetting("codeParent", "1234"); });
  page.evaluate(() => window.__app.parent.open()).catch(() => {}); await page.waitForSelector(".pa-keys", { timeout: 10000 });
  for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
  await page.waitForTimeout(600); await page.click('.pa-tabs button:has-text("Progression")'); await page.waitForTimeout(700);
  const card = await page.evaluate(() => [...document.querySelectorAll(".pa-card-box")].map((b) => b.textContent).find((t) => t.includes("Module 6")) ?? "");
  check(/L'étal du pêcheur/.test(card) && /Niveau atteint : 2 sur 10/.test(card), `espace parent : le bloc « L'étal du pêcheur » (${card.slice(0, 100)})`);
  await page.evaluate(() => [...document.querySelectorAll(".pa-card-box h2")].find((h) => h.textContent.includes("Module 6"))?.scrollIntoView()); await page.waitForTimeout(300); await shot(page, "31-parent-etal", T);
  const txt = await page.evaluate(() => document.body.textContent);
  check(/a donné trop alors que le compte juste était possible/.test(txt), "journal des erreurs : l'erreur de l'étal en une phrase");
  await page.evaluate(() => { const el = [...document.querySelectorAll(".pa-main *")].filter((e) => !e.children.length).find((e) => /a donné trop alors que/.test(e.textContent)); el?.scrollIntoView({ block: "center" }); }); await page.waitForTimeout(300); await shot(page, "32-parent-journal", T);
  await fin(page, context, errors, "jouer imposé et espace parent");
  const o = await open("&meteo=beau", T, async () => { const n = Date.now(); await window.__app.store.add("seances", { debut: n - 600000, fin: n, terminee: true, module: 1, etapes: [] }); await window.__app.store.put("niveaux", { module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: [], exemples: [4] }); });
  await o.page.waitForSelector(".again"); await o.page.tap(".again", { force: true });
  await o.page.waitForSelector(".choix-ex", { timeout: 15000 }); await o.page.waitForTimeout(400);
  for (const s of ['.choix-ex[data-key="etal"]', '.choix-ex[data-key="etal"]']) { await o.page.tap(s, { force: true }); await o.page.waitForTimeout(500); }
  await o.page.waitForTimeout(500);
  for (const s of ['.choix-tuile[data-key="4"]', '.choix-tuile[data-key="4"]']) { await o.page.tap(s, { force: true }); await o.page.waitForTimeout(500); }
  await o.page.waitForSelector(".cran", { timeout: 15000 }); await o.page.tap(".cran", { force: true }).catch(() => {});
  await attend(o.page); await payer(o.page, "juste"); await coche(o.page); await attend(o.page);
  check((await reponses(o.page)).every((r) => r.niveau === 4), "entraînement libre : l'étal au niveau choisi");
  await o.page.tap(".session-home", { force: true }); await o.page.waitForTimeout(1200);
  check(await o.page.evaluate(() => !document.querySelector(".etal-scene") && !document.querySelector("canvas.etal-decor")), "la maison quitte l'entraînement libre : la scène s'en va");
  await shot(o.page, "33-libre-quitte", T);
  await fin(o.page, o.context, o.errors, "entraînement libre");
}
writeFileSync(join(OUT, "phrases.json"), JSON.stringify(releve, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
