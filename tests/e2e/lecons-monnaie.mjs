// LES LEÇONS DE LA MONNAIE NE SONT JAMAIS NOIRES (lot « Correctifs de l'installation et de la veille », point 4 ; docs/LOTS.md,
// fiche 12). Sur la tablette, les leçons L15 à L18 avaient un fond complètement noir. Le décor de l'étal est un canvas opaque,
// noir tant que rien n'y est dessiné ; sa boucle ne dessinait rien quand la séance était en pause (`fige`) : une leçon choisie
// depuis l'accueil en pause installe sa propre scène pendant que la séance est en pause, et cette scène restait noire.
// Ce parcours joue les quatre leçons depuis chaque entrée :
//   - le menu des leçons (depuis l'accueil) ;
//   - l'accueil en pause (une séance de l'étal en cours, la maison, puis les leçons) ;
//   - la leçon relancée pendant l'exercice (trois erreurs de suite à l'étal, dans la séance), chacune à son niveau ;
//   - la séance du jour faite, depuis le menu des leçons (« À toi ! » mène à l'entraînement libre, qui ne relance pas les leçons) ;
// processeur ralenti 4 fois, à la taille de la tablette (1280 × 800, densité 2), et à 1920 × 1200. Une capture toutes les
// 2 secondes pendant la leçon : aucune n'a plus de 20 % de pixels noirs.
//   node tests/e2e/lecons-monnaie.mjs [--petit] [--sans-ralenti]
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : ce parcours vérifie la logique et l'affichage de nombreuses situations, chacune sur une base neuve dans un
// navigateur neuf : à la vitesse réelle de la voix il durerait plusieurs fois plus longtemps, et installer l'application (140
// Mo, environ une minute) pour chaque situation n'apporterait rien à ce qu'il vérifie ; le son (bruitages, musique) ne change
// rien à ce qu'il vérifie. La vraie voix, le son et l'application installée sont éprouvés sur le banc Android (journee.mjs,
// enfant.mjs --android, installation.mjs, veille.mjs).)
import { chromium } from "./navigateur.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve("tests/e2e/out/lecons-monnaie"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: [] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const TAILLES = args.includes("--petit") ? [[1280, 800, 2]] : [[1280, 800, 2], [1920, 1200, 1]];
const RALENTI = args.includes("--sans-ralenti") ? 1 : 4;
const LECONS = ["L15", "L16", "L17", "L18"];
const ETAT = (lecons = []) => ({ module: 6, niveau: 1, obtenus: [], redescentes: [], fenetre: [], vus: 0, taux: [], lecons, exemples: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });

const ouvrir = async ([w, h, dpr], q, prep = null) => {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url + "?nosw&voix=rapide&son=non&sansReprise"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("echauffement", false); });
  if (prep) await page.evaluate(prep.f, prep.a);
  await page.goto(url + "?nosw&voix=rapide&son=non&sansReprise&meteo=beau" + q); await page.waitForFunction(() => window.__ready !== undefined);
  if (RALENTI > 1) { const cdp = await context.newCDPSession(page); await cdp.send("Emulation.setCPUThrottlingRate", { rate: RALENTI }); }
  return { page, context, errors };
};
// la part de pixels noirs d'une capture (décodée par la page elle-même)
const noir = async (page, buf) => page.evaluate(async (b64) => {
  const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob()), w = 160, h = Math.round((160 * bmp.height) / bmp.width);
  const c = new OffscreenCanvas(w, h), x = c.getContext("2d"); x.drawImage(bmp, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 18 && d[i + 1] < 18 && d[i + 2] < 18) n++;
  return n / (w * h);
}, buf.toString("base64"));
// (les galets de l'accueil s'ouvrent ici au premier toucher : tests/e2e/navigateur.mjs, __accueilUnToucher)
// pendant la leçon : une capture toutes les 2 s (jusqu'à `n` captures, ou la fin de la leçon) ; la pire part de noir
const surveiller = async (page, nom, enCours, n = 30) => {
  let pire = 0, vues = 0;
  for (let i = 0; i < n; i++) {
    await page.waitForTimeout(i === 0 ? 700 : 2000);
    if (!(await page.evaluate(enCours))) break;
    const buf = await page.screenshot(); vues++;
    const p = await noir(page, buf); pire = Math.max(pire, p);
    if (i === 0) writeFileSync(join(OUT, `${nom}.png`), buf); // (la leçon à l'écran)
    else writeFileSync(join(OUT, `${nom}-${i}.png`), buf); // (et la suite, toutes les 2 s : relecture du lot, R12)
    if (p > 0.2) writeFileSync(join(OUT, `${nom}-noir.png`), buf);
  }
  return { pire, vues };
};
const leconEnCours = () => !!window.__app.etalLecon?.actif || !!document.querySelector(".lessonkey");
const deuxTouchers = async (page, sel) => { for (let i = 0; i < 2; i++) { await page.tap(sel, { force: true }); await page.waitForTimeout(250); } };
// trois « je ne sais pas » de suite à l'étal (chacun compte comme une erreur) : la difficulté persistante relance la leçon du niveau
const troisErreurs = async (page) => {
  for (let k = 0; k < 8; k++) {
    const pret = await page.waitForFunction(() => (window.__app.etal?.attend && !!document.querySelector(".etal-nsp")) || !!document.querySelector(".lessonkey"), null, { timeout: 90000, polling: 100 }).then(() => true, () => false);
    if (!pret || (await page.evaluate(() => !!document.querySelector(".lessonkey")))) return;
    await page.locator(".etal-nsp").first().tap({ force: true }).catch(() => {});
    await page.waitForFunction(() => !window.__app.etal?.attend || !!document.querySelector(".lessonkey"), null, { timeout: 30000, polling: 100 }).catch(() => {});
  }
};

for (const T of TAILLES) {
  const W = `${T[0]}×${T[1]}`;
  // 1. le menu des leçons, depuis l'accueil
  for (const id of LECONS) {
    const { page, context, errors } = await ouvrir(T, "");
    await page.tap(".leconskey", { force: true }); await page.waitForSelector(`.lecons-tuile[data-key="${id}"]`, { timeout: 30000 }); await page.waitForTimeout(400);
    await deuxTouchers(page, `.lecons-tuile[data-key="${id}"]`);
    const r = await surveiller(page, `${W}-menu-${id}`, leconEnCours);
    check(r.vues > 0 && r.pire <= 0.2, `${W}, menu des leçons, ${id} : ${r.vues} captures, au plus ${(r.pire * 100).toFixed(1)} % de noir`);
    check(!errors.length, `${W}, menu, ${id} : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
  // 2. l'accueil en pause : une séance de l'étal en cours, la maison, les leçons
  for (const id of LECONS) {
    const { page, context, errors } = await ouvrir(T, "&choix=6:2&cran=conseille", { f: async (e) => { await window.__app.store.put("niveaux", e); }, a: ETAT(["L15", "L16", "L17", "L18"]) });
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => window.__app.etal?.attend, null, { timeout: 90000, polling: 100 });
    await page.tap(".homekey", { force: true }); await page.waitForFunction(() => window.__app.enPause, null, { timeout: 15000 }); await page.waitForTimeout(600);
    await page.tap(".leconskey", { force: true }); await page.waitForSelector(`.lecons-tuile[data-key="${id}"]`, { timeout: 30000 }); await page.waitForTimeout(400);
    await deuxTouchers(page, `.lecons-tuile[data-key="${id}"]`);
    const r = await surveiller(page, `${W}-pause-${id}`, leconEnCours);
    check(r.vues > 0 && r.pire <= 0.2, `${W}, accueil en pause, ${id} : ${r.vues} captures, au plus ${(r.pire * 100).toFixed(1)} % de noir`);
    check(!errors.length, `${W}, pause, ${id} : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
  // 3. la leçon relancée pendant l'exercice (dans la séance : trois erreurs) ; niveau 1 (L15) et 2 (L16)
  // (relecture du lot, R12 : L17, rendre la monnaie, niveau 7 ; L18, les centimes, niveau 9)
  for (const [niveau, id] of [[1, "L15"], [2, "L16"], [7, "L17"], [9, "L18"]]) {
    const { page, context, errors } = await ouvrir(T, `&choix=6:${niveau}&cran=conseille`, { f: async (e) => { await window.__app.store.put("niveaux", e); }, a: { ...ETAT(["L15", "L16", "L17", "L18"]), niveau } });
    await page.tap(".play", { force: true });
    await troisErreurs(page);
    const relancee = await page.waitForFunction(() => !!document.querySelector(".lessonkey"), null, { timeout: 60000 }).then(() => true, () => false);
    const r = relancee ? await surveiller(page, `${W}-exercice-${id}`, leconEnCours) : { vues: 0, pire: 1 };
    check(relancee && r.vues > 0 && r.pire <= 0.2, `${W}, ${id} relancée pendant l'exercice (sur la scène de l'exercice) : ${r.vues} captures, au plus ${(r.pire * 100).toFixed(1)} % de noir`);
    check(!errors.length, `${W}, exercice, ${id} : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
  // 4. l'entraînement libre : la séance du jour faite, le menu des leçons (« À toi ! » mène ensuite à l'entraînement libre ; il ne
  // relance pas les leçons de lui-même)
  for (const id of LECONS) {
    const { page, context, errors } = await ouvrir(T, "", { f: async () => { const n = Date.now(); await window.__app.store.add("seances", { debut: n - 600000, fin: n, terminee: true, module: 1, etapes: [] }); } });
    await page.tap(".leconskey", { force: true }); await page.waitForSelector(`.lecons-tuile[data-key="${id}"]`, { timeout: 30000 }); await page.waitForTimeout(400);
    await deuxTouchers(page, `.lecons-tuile[data-key="${id}"]`);
    const r = await surveiller(page, `${W}-libre-${id}`, leconEnCours);
    check(r.vues > 0 && r.pire <= 0.2, `${W}, séance du jour faite (entraînement libre), ${id} : ${r.vues} captures, au plus ${(r.pire * 100).toFixed(1)} % de noir`);
    check(!errors.length, `${W}, libre, ${id} : aucune erreur (${errors.join(" | ")})`);
    await context.close();
  }
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nleçons de la monnaie : jamais de fond noir, depuis chaque entrée");
process.exitCode = fail.length ? 1 : 0;
