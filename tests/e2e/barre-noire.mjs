// LA BARRE NOIRE (lot « Recette de l'enfant et nettoyage des couches », point 0.1 ; docs/LOTS.md, fiche 9 ; captures
// docs/maquettes/fiche9/). Vue par le parent sur la tablette et sur un Xiaomi 14 : une bande noire sur toute la largeur, de
// y = 300 à y = 610 dans la scène, au-dessus du décor de l'exercice et sous la mascotte, dans tous les exercices ; elle
// disparaît à la pause. C'est exactement la bande de la ligne graduée (engine/line.js, BAND), qu'occupent deux calques :
// `#line`, un canvas « bitmaprenderer », vidé par transferFromImageBitmap(null), et `#fx`. Le Chromium des parcours (sans
// carte graphique, même avec SwiftShader) ne montre pas le noir : le parcours vérifie donc la règle qui l'empêche, aucun
// calque de la bande (ni le fond #bg) ne reste affiché sans image, et relève quand même les pixels de la bande.
// Il passe par chaque exercice (choisir, niveau 1, échauffement passé), y reste plusieurs secondes, revient à l'accueil par
// la maison (la pause), puis prend l'exercice suivant par « choisir » : à chaque relevé (toutes les 400 ms), après chaque
// changement d'exercice et après la pause.
//   node tests/e2e/barre-noire.mjs [--out dossier]
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : ce parcours vérifie la logique et l'affichage de nombreuses situations, chacune sur une base neuve dans un
// navigateur neuf : à la vitesse réelle de la voix il durerait plusieurs fois plus longtemps, et installer l'application (140
// Mo, environ une minute) pour chaque situation n'apporterait rien à ce qu'il vérifie ; le son (bruitages, musique) ne change
// rien à ce qu'il vérifie. La vraie voix, le son et l'application installée sont éprouvés sur le banc Android (journee.mjs,
// enfant.mjs --android, installation.mjs, veille.mjs).)
import { accueilReel, chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(arg("--out", "tests/e2e/out/barre-noire")); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
// avec le rendu de la carte graphique simulé (SwiftShader), au plus près de la tablette
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const EXOS = [{ id: "ligne", module: 1 }, { id: "additions", module: 2 }, { id: "calcul", module: 3 }, { id: "voiliers", module: 4 }, { id: "multiplication", module: 5 }, { id: "etal", module: 6 }];

// l'état des calques de la bande : chacun n'est affiché que s'il a quelque chose à montrer
const calques = (page) => page.evaluate(() => {
  const a = window.__app, aff = (e) => !!e && e.isConnected && getComputedStyle(e).display !== "none";
  const lignes = [...document.querySelectorAll("#stage > canvas#line, #stage > canvas#fx")];
  return {
    // une ligne affichée sans image (vidée) : le cas de la barre noire
    ligneSansImage: aff(a.line.c) && !a.line.affichee,
    effetsSansDessin: aff(a.line.fx) && !a.line.fxUsed,
    fondSansImage: aff(a.stage.bg) && a.stage.bg.classList.contains("vide"),
    calquesAffiches: lignes.filter(aff).length,
    canvasVidesAffiches: lignes.filter((c) => aff(c) && c.classList.contains("vide")).length,
  };
});
// la part de pixels presque noirs dans la bande (y de 300 à 610), d'après une capture
const noirs = async (page) => {
  const png = (await page.screenshot({ clip: { x: 0, y: 300, width: 1280, height: 310 } })).toString("base64");
  return page.evaluate(async (b64) => {
    const im = new Image(); im.src = `data:image/png;base64,${b64}`; await im.decode();
    const c = new OffscreenCanvas(im.width, im.height), x = c.getContext("2d"); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, im.width, im.height).data; let n = 0, t = 0;
    for (let i = 0; i < d.length; i += 4 * 13) { t++; if (d[i] + d[i + 1] + d[i + 2] < 45) n++; }
    return n / t;
  }, png);
};
const entrer = async (page, sel) => {
  await page.locator(sel).first().tap({ force: true }); await page.waitForTimeout(450);
  if (await page.evaluate((s) => { const e = document.querySelector(s); return !!e?.isConnected && getComputedStyle(e).visibility !== "hidden"; }, sel)) await page.locator(sel).first().tap({ force: true });
  await page.waitForTimeout(300);
};

const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }); await accueilReel(context);
const page = await context.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&faits=5&questions=4&sansLecon"); await page.waitForFunction(() => window.__ready !== undefined);

let releves = 0;
const releve = async (nom, { pixels = false } = {}) => {
  const r = await calques(page); releves++;
  const bad = [r.ligneSansImage && "ligne vidée encore affichée", r.effetsSansDessin && "calque d'effets vide affiché", r.fondSansImage && "fond sans image affiché", r.canvasVidesAffiches && "canvas vide affiché"].filter(Boolean);
  if (bad.length) { await page.screenshot({ path: join(OUT, `${nom.replace(/[^a-z0-9]+/gi, "-")}.png`) }); check(false, `${nom} : ${bad.join(", ")}`); return false; }
  if (pixels) { const p = await noirs(page); check(p < 0.25, `${nom} : bande sans noir (${Math.round(p * 100)} % de pixels presque noirs)`); }
  return true;
};
check(await releve("accueil", { pixels: true }), "accueil : aucun calque de la bande affiché sans image");

for (const ex of EXOS) {
  try {
    await entrer(page, ".choisir"); await page.waitForSelector(".choix-ex", { timeout: 15000 });
    await entrer(page, `.choix-ex[data-key="${ex.id}"]`); await page.waitForSelector(".choix-tuile", { timeout: 15000 });
    await entrer(page, '.choix-tuile[data-key="1"]');
    // l'échauffement : passé dès qu'on peut
    await page.waitForFunction(() => ["echauffement", "notion"].includes(window.__app.session?.progress.etape), null, { timeout: 60000 });
    let ok = true;
    for (let i = 0; i < 60 && await page.evaluate(() => window.__app.session?.progress.etape === "echauffement"); i++) {
      ok = await releve(`${ex.id}, échauffement`) && ok;
      if (await page.locator(".skip-warmup:visible").count()) { await page.locator(".skip-warmup:visible").last().tap({ force: true }); await page.waitForTimeout(250); if (await page.locator(".check-warmup:visible").count()) await page.locator(".check-warmup:visible").first().tap({ force: true }); }
      await page.waitForTimeout(400);
    }
    await page.waitForFunction((m) => window.__app.session?.progress.etape === "notion" && window.__app.session.rec.module === m, ex.module, { timeout: 60000 });
    // l'exercice : relevés pendant 8 s, puis une capture et les pixels
    for (let i = 0; i < 20; i++) { ok = await releve(`${ex.id}, notion du jour`) && ok; await page.waitForTimeout(400); }
    await page.screenshot({ path: join(OUT, `${ex.id}.png`) });
    ok = await releve(`${ex.id}, notion du jour`, { pixels: true }) && ok;
    // la pause (la maison) ; l'exercice suivant se choisit depuis l'accueil en pause (« choisir ») : changement d'exercice
    await page.tap(".session-home", { force: true }); await page.waitForTimeout(700);
    ok = await releve(`${ex.id}, pause`, { pixels: true }) && ok;
    check(ok, `${ex.id} : aucun calque de la bande affiché sans image, à chaque relevé`);
  } catch (e) {
    await page.screenshot({ path: join(OUT, `${ex.id}-erreur.png`) }).catch(() => {});
    check(false, `${ex.id} : ${e.message.split("\n")[0]}`);
    await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&faits=5&questions=4&sansLecon"); await page.waitForFunction(() => window.__ready !== undefined);
  }
}
console.log(`     ${releves} relevés`);
check(!errors.length, `aucune erreur dans la page${errors.length ? ` (${errors[0]})` : ""}`);
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nla bande n'est jamais affichée sans image");
process.exitCode = fail.length ? 1 : 0;
