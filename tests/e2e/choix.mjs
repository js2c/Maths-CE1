// LOT 3, ÉTAPE 1 : parcours de l'écran « choisir » (docs/SPEC-LOT3.md, sections 2 et 4) : l'accueil et ses quatre
// bulles ; choisir la ligne graduée au niveau 8 dès une base vide (3 choix : choisir, l'exercice, le niveau, puis le
// sélecteur) ; les additions d'une famille pas encore ouverte ; une leçon seule ; « passer » l'échauffement ; le
// réglage « Échauffement : non » ; « Encore ! » ouvre le même écran. Captures en densité 2.
//   node tests/e2e/choix.mjs [--out dossier]
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/choix"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const open = async (q = "", prep = null) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
};
let taps = 0;
const tap = async (page, sel) => { taps++; await page.tap(sel, { force: true }); await page.waitForTimeout(250); };
// choisir un exercice puis une vignette (lot « Correctifs de la tablette » : en deux touchers, le premier sélectionne et dit
// le nom et la description, le second lance ; avant, validation « simple », décision du parent du 28 septembre)
const pick = async (page, sel) => { await page.waitForSelector(sel, { timeout: 10000 }); await tap(page, sel); };

// 1. l'accueil, l'écran des exercices et les 13 niveaux ; la ligne au niveau 8 dès une base vide
{
  const { page, context, errors } = await open("&cran=conseille&sans=echauffement");
  await page.waitForSelector(".choisir"); await page.waitForTimeout(400);
  check((await page.locator(".play, .choisir, .leconskey, .reefkey, .albumkey").count()) === 5, "l'accueil : jouer, choisir, les leçons, le récif, l'album");
  await page.screenshot({ path: join(OUT, "1-accueil.png") });
  taps = 0;
  await tap(page, ".choisir");
  await page.waitForSelector(".choix-ex"); await page.waitForTimeout(400);
  check((await page.locator(".choix-ex").count()) === 5, "cinq exercices (ligne, additions, calcul rapide, voiliers, multiplication ; lot « Les leçons » : plus de leçons ici)");
  await page.screenshot({ path: join(OUT, "2-exercices.png") });
  await tap(page, '.choix-ex[aria-label="ligne"]', 300); await tap(page, '.choix-ex[aria-label="ligne"]');
  await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(400);
  check((await page.locator(".choix-tuile").count()) === 13, "les 13 niveaux de la ligne, tous accessibles");
  check(await page.evaluate(() => document.querySelector('.choix-tuile[data-conseille="1"]')?.dataset.key) === "1", "base vide : le niveau 1 conseillé (lueur)");
  await page.screenshot({ path: join(OUT, "3-niveaux-ligne.png") });
  await tap(page, '.choix-tuile[data-key="8"]', 300); await tap(page, '.choix-tuile[data-key="8"]');
  check(taps === 5, `5 touchers de l'accueil au sélecteur (choisir, l'exercice deux fois, le niveau deux fois : lot « Correctifs de la tablette ») : ${taps}`);
  await page.waitForFunction(() => window.__app.runner && window.__app.screen?.q, null, { timeout: 30000 });
  const qs = [];
  for (let i = 0; i < 4; i++) {
    await page.waitForFunction(() => window.__app.screen?.q && window.__app.screen.resolve, null, { timeout: 30000 });
    qs.push(await page.evaluate(() => ({ niveau: window.__app.screen.q.niveau, format: window.__app.screen.q.format })));
    await page.evaluate(() => { const s = window.__app.screen; s.q.__done = true; s.resolve?.({ q: s.q, value: s.q.answer, ok: true, code: null, ms: 3000, listens: 1 }); s.resolve = null; });
    await page.waitForTimeout(300);
  }
  const rec = await page.evaluate(() => window.__app.session.rec);
  check(rec.choix?.module === 1 && rec.choix?.niveau === 8 && rec.module === 1, "la séance du jour a pour notion la ligne, niveau 8");
  check(qs.every((q) => q.niveau === 8 && q.format === "estimer"), `toutes les questions au niveau 8 (${qs.map((q) => `${q.niveau}/${q.format}`).join(", ")})`);
  await page.screenshot({ path: join(OUT, "5-niveau-8-question.png") });
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 2. les additions : les 7 familles ; la famille 5 (pas encore ouverte) devient la famille en cours et s'ouvre
{
  const { page, context, errors } = await open("&cran=conseille&sans=echauffement&sansLecon");
  await tap(page, ".choisir"); await pick(page, '.choix-ex[aria-label="additions"]'); await pick(page, '.choix-ex[aria-label="additions"]');
  await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(400);
  check((await page.locator(".choix-tuile").count()) === 13, "les 13 familles (lot « Sommes jusqu'à 30 »)");
  await page.screenshot({ path: join(OUT, "6-familles.png") });
  await pick(page, '.choix-tuile[data-key="5"]'); await pick(page, '.choix-tuile[data-key="5"]');
  await page.waitForFunction(() => window.__app.runner?.famille && window.__app.facts?.q, null, { timeout: 30000 });
  const st = await page.evaluate(async () => ({ famille: window.__app.runner.famille, ouvertes: (await window.__app.store.get("niveaux", 2)).ouvertes, rec: window.__app.session.rec }));
  check(st.famille === 5 && st.ouvertes.includes(5) && st.rec.choix?.famille === 5 && st.rec.module === 2, `famille 5 en cours et ouverte (ouvertes : ${st.ouvertes})`);
  await page.waitForTimeout(800); await page.screenshot({ path: join(OUT, "7-famille-5.png") });
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 3. (lot « Les leçons ») les leçons ont quitté « choisir » : elles ont leur bulle à l'accueil (parcours tests/e2e/lecons-menu.mjs)
{
  const { page, context, errors } = await open();
  check((await page.locator(".leconskey").count()) === 1, "la bulle « les leçons » à l'accueil");
  await tap(page, ".choisir"); await page.waitForSelector(".choix-ex"); await page.waitForTimeout(300);
  check((await page.locator('.choix-ex[aria-label="lecons"]').count()) === 0, "pas d'image des leçons dans « choisir »");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 4. « passer » l'échauffement (lot 3 ter, T1 : le bouton dédié, puis la coche) : la notion du jour commence moins de 2 s après la coche
{
  const { page, context, errors } = await open("&cran=conseille&module=1&sansLecon");
  await tap(page, ".play");
  await page.waitForFunction(() => window.__app.session?.progress.etape === "echauffement", null, { timeout: 30000 });
  await page.waitForSelector(".skip-warmup", { timeout: 5000 }); await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, "10-echauffement-passer.png") });
  await tap(page, ".skip-warmup"); await page.waitForSelector(".check-warmup", { state: "visible", timeout: 5000 });
  const t0 = Date.now(); await tap(page, ".check-warmup");
  await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 10000 });
  const dt = Date.now() - t0; check(dt < 2000, `la notion du jour commence ${dt} ms après « passer »`);
  check(!!(await page.evaluate(() => window.__app.session.rec.echauffementPasse)), "noté « échauffement passé »");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 5. réglage du parent « Échauffement : non » : ni échauffement, ni pictogramme dans la frise
{
  const { page, context, errors } = await open("&cran=conseille&module=1&sansLecon", async () => { await window.__app.store.setSetting("echauffement", false); });
  await tap(page, ".play");
  await page.waitForFunction(() => window.__app.session?.progress.etape === "notion", null, { timeout: 30000 });
  const r = await page.evaluate(() => ({ steps: window.__app.frieze.steps, et: window.__app.session.rec.etapes }));
  check(!r.steps.includes("echauffement") && r.et.some((e) => e.id === "echauffement" && e.sautee === "réglage du parent"), `pas d'échauffement ni de pictogramme (frise : ${r.steps.join(", ")})`);
  await page.waitForTimeout(500); await page.screenshot({ path: join(OUT, "11-sans-echauffement.png") });
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 6. « Encore ! » (séance du jour faite) ouvre le même écran, sans étoiles
{
  const { page, context, errors } = await open("", async () => { const n = Date.now(); await window.__app.store.add("seances", { debut: n - 600000, fin: n, terminee: true, module: 1, etapes: [] }); });
  await page.waitForSelector(".again"); await tap(page, ".again");
  await page.waitForSelector(".choix-ex", { timeout: 15000 }); await page.waitForTimeout(400);
  check((await page.locator(".choix-ex").count()) === 5, "« Encore ! » : le même écran de choix");
  await pick(page, '.choix-ex[aria-label="ligne"]'); await pick(page, '.choix-ex[aria-label="ligne"]'); await pick(page, '.choix-tuile[data-key="3"]'); await pick(page, '.choix-tuile[data-key="3"]');
  await page.waitForSelector(".cran", { timeout: 15000 });
  check(true, "puis le sélecteur sans étoiles");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
