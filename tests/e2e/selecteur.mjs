// LOT 2, ÉTAPE 2 : parcours du sélecteur de difficulté (quatre crans, lueur du conseillé, cran touché, coche,
// attente de 15 s), cran enregistré dans la séance ; la flèche qui montre la cible (lot « Mascotte ») ; le
// calque d'effets et la tortue au-dessus de la mascotte ; formes à trou au cran « très dur ». Captures en densité 2.
//   node tests/e2e/selecteur.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/selecteur"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const open = async (q = "") => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });
  await page.goto(url + "?nosw&voix=rapide" + q); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
};
const tap = (page, sel) => page.tap(sel, { force: true });

// 1. le sélecteur : quatre crans, le conseillé choisi d'avance et entouré d'une lueur ; toucher « très dur », valider
{
  const { page, context, errors } = await open("&sans=echauffement,notion");
  await tap(page, ".play");
  await page.waitForSelector(".cran", { timeout: 20000 }); await page.waitForTimeout(600);
  check((await page.locator(".cran").count()) === 4, "quatre crans");
  check(await page.evaluate(() => document.querySelector(".cran.chosen")?.dataset.cran) === "conseille", "le conseillé est choisi d'avance");
  await page.screenshot({ path: join(OUT, "1-selecteur.png") });
  await tap(page, '.cran[data-cran="tresdur"]'); await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, "2-tres-dur.png") });
  check(await page.evaluate(() => document.querySelector(".cran.chosen")?.dataset.cran) === "tresdur", "toucher un cran le choisit");
  await tap(page, ".cran-ok"); await page.waitForFunction(() => !document.querySelector(".cran"), null, { timeout: 5000 });
  const rec = await page.evaluate(() => window.__app.session.rec);
  check(rec.cran === "tresdur" && rec.cranDepart === "tresdur", "cran enregistré dans la séance");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 2. sans toucher pendant 15 s : la séance commence sur le cran affiché ; les crans autorisés par le parent
{
  const { page, context } = await open("&sans=echauffement,notion");
  await page.evaluate(async () => { await window.__app.store.setSetting("cransAutorises", { min: "conseille", max: "dur" }); });
  await tap(page, ".play"); await page.waitForSelector(".cran", { timeout: 20000 });
  check((await page.locator(".cran").count()) === 2, "le parent limite les crans (conseillé et plus dur)");
  await page.screenshot({ path: join(OUT, "3-deux-crans.png") });
  const t0 = Date.now(); await page.waitForFunction(() => !document.querySelector(".cran"), null, { timeout: 20000 });
  check(Date.now() - t0 > 13000, `sans toucher, le sélecteur se ferme au bout de 15 s (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  check((await page.evaluate(() => window.__app.session.rec.cran)) === "conseille", "le cran affiché est gardé");
  await context.close();
}
// 3. la flèche montre pendant la consigne (lot « Mascotte », à la place du bras de la pieuvre) : jamais sur la réponse à
// placer ; formes à trou au cran très dur
for (const [niveau, fmt] of [[3, "placer"], [6, "placer"], [2, "lire"]]) {
  const { page, context } = await open(`&cran=conseille&sans=echauffement&sansLecon&niveau=${niveau}&format=${fmt}&guides=0`);
  await tap(page, ".play");
  await page.waitForFunction(() => { const s = window.__app.screen; return s?.q && s.resolve; }, null, { timeout: 30000 });
  await page.waitForFunction(() => window.__app.fleche.visible, null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => ({ vue: window.__app.fleche.visible, cible: window.__app.fleche.cible, angle: window.__app.fleche.angle, want: window.__app.screen.pointAt(window.__app.screen.q), x: window.__app.screen.xOf(window.__app.screen.q.answer), star: window.__app.screen.starAt }));
  if (fmt === "lire") check(info.vue && info.cible.map(Math.round).join() === info.want.point.map(Math.round).join() && Math.abs(info.cible[0] - info.star[0]) < 1, `niveau ${niveau} (${fmt}) : la flèche au-dessus de l'étoile, en ${info.cible?.map(Math.round)}`);
  else check(!info.vue && info.want === null, `niveau ${niveau} (${fmt}) : pas de flèche (elle donnerait la place de la réponse, x=${Math.round(info.x)})`);
  await page.screenshot({ path: join(OUT, `4-fleche-niveau${niveau}.png`) });
  await context.close();
}
{
  const { page, context } = await open("&cran=tresdur&sans=notion&faits=12");
  // des faits déjà en boîte 2 et 3 : les formes à trou peuvent sortir
  await page.evaluate(async () => { const s = window.__app.store; for (const [a, b] of [[3, 1], [4, 1], [5, 1], [2, 2], [6, 2], [3, 3], [7, 1], [6, 1]]) await s.put("faits", { fait: `${a}+${b}`, a, b, famille: a === b ? 2 : 1, boite: 3, prochain: 0, historique: [{ t: 0, juste: true }] }); await s.setSetting("tempsDeBase", { mesures: [2000], depuis: 0 }); });
  await tap(page, ".play");
  let trou = 0;
  for (let k = 0; k < 14 && !trou; k++) {
    await page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 30000 });
    const q = await page.evaluate(() => window.__app.facts.q);
    if (q.forme && q.forme !== "directe") { trou++; await page.waitForTimeout(400); await page.screenshot({ path: join(OUT, `5-trou-${q.forme}.png`) }); }
    const v = q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.a + q.b;
    for (const d of String(v)) { await tap(page, `.key[data-key="${d}"]`); await page.waitForTimeout(170); } await tap(page, '.key[data-key="valider"]');
  }
  check(trou > 0, "formes à trou au cran très dur");
  await context.close();
}
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
await browser.close(); srv.close(); process.exit(fail.length ? 1 : 0);
