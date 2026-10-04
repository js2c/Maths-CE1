// LOT « LAGON EN FOND D'EXERCICES » (docs/SPEC.md, section 11, « Le lagon, fond de toute l'application ») : captures de
// chaque écran et de chaque type d'exercice sur le lagon, à 1280 × 800 (densité 2) et 1920 × 1200 (densité 1), et contrôles :
//   - le lagon est là (fond, algues, poissons, faisceaux ; miroitement si WebGL), sous la ligne graduée ;
//   - pendant les exercices : aucune créature à gagner (ni bouton de créature, ni planche du récif), aucun sous-marin ;
//   - rien de l'ancien décor (ses sprites n'existent plus ; aucun acteur dans le calque des visiteurs hors surprise) ;
//   - aucune erreur dans la page.
//   node tests/e2e/lagon.mjs [--out dossier] [--seul 1280|1920]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/lagon")), SEUL = opt("--seul", null);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const fail = [], check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const BASE = "?nosw&voix=rapide&son=non&sansLecon&guides=0";
const DAY = 86400000;

// l'état du décor, vu de la page
const decor = (page) => page.evaluate(() => {
  const a = window.__app, l = a.lagon, kids = [...a.stage.root.children].map((e) => e.id || e.className);
  return {
    lagon: !!l, ordre: kids.indexOf("lagon") > kids.indexOf("bg") && kids.indexOf("lagon") < kids.indexOf("line"),
    poissons: l.fishEl.children.length, algues: l.weeds.length, miroitement: !!l.surface, niveau: a.stage.perf.level,
    creatures: document.querySelectorAll(".creature").length, recif: a.sprites.ready("recif"),
    visiteurs: a.ocean.backEl.children.length, ancien: ["fond", "rayons", "algue.0", "reflet.0"].filter((n) => a.atlas.sprites[n]),
  };
});
const exercice = async (page, nom) => {
  const d = await decor(page);
  check(d.lagon && d.ordre && d.algues === 3 && d.poissons > 0, `${nom} : le lagon sous la ligne graduée (${d.poissons} poissons, miroitement ${d.miroitement ? "oui" : "non"}, allègement ${d.niveau})`);
  check(d.creatures === 0 && !d.recif && d.visiteurs === 0, `${nom} : aucune créature à gagner, aucun visiteur`);
  check(d.ancien.length === 0, `${nom} : rien de l'ancien décor`);
};

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]]) {
  if (SEUL && SEUL !== String(W)) continue;
  const out = join(OUT, String(W)); mkdirSync(out, { recursive: true });
  const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true });
  const page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  const shot = (n) => page.screenshot({ path: join(out, `${n}.png`) });
  const go = async (q) => { await page.goto(url + BASE + q); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 }); };
  const line = () => page.waitForFunction(() => { const s = window.__app.screen, f = window.__app.facts; return (s?.q && s.resolve && !s.locked) || (f?.q?.dictee && f.resolve); }, null, { timeout: 60000 });
  const pad = () => page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 60000 });
  await go(""); await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); });

  // ---- l'accueil, le sélecteur, « choisir »
  await go(""); await page.waitForTimeout(1500); await shot("01-accueil");
  { const d = await decor(page); check(d.lagon && d.ancien.length === 0, `${W} accueil : le lagon, rien de l'ancien décor`); }
  await page.tap(".play", { force: true }); await page.waitForSelector(".cran", { timeout: 30000 }); await page.waitForTimeout(800); await shot("02-selecteur");
  await go(""); await page.tap(".bubble.choisir", { force: true });
  await page.waitForSelector(".choix-ex", { timeout: 15000 }).then(async () => { await page.waitForTimeout(600); await shot("03-choisir-exercices"); await page.tap(".choix-ex >> nth=0", { force: true }); await page.waitForSelector(".choix-tuile", { timeout: 15000 }); await page.waitForTimeout(800); await shot("04-choisir-niveaux"); }).catch(() => console.log("     (écran « choisir » non capturé)"));

  // ---- les exercices
  const S = [
    ["10-echauffement", "&cran=conseille&sans=notion,defi", pad],
    ["11-ligne-n1-sauter-lire", "&choix=1:1&cran=conseille&sans=echauffement,defi", line],
    ["12-ligne-n2-placer", "&choix=1:2&format=placer&cran=conseille&sans=echauffement,defi", line],
    ["13-ligne-n5", "&choix=1:5&cran=conseille&sans=echauffement,defi", line],
    ["14-ligne-n8-estimer", "&choix=1:8&cran=conseille&sans=echauffement,defi", line],
    ["15-ligne-n11", "&choix=1:11&cran=conseille&sans=echauffement,defi", line],
    ["16-ligne-n12-dictee", "&choix=1:12&cran=facile&sans=echauffement,defi", line],
    ["17-additions-f3-cadre", "&choix=2:3&cran=facile&sans=echauffement,defi", pad],
    ["18-additions-f4-maison", "&choix=2:4&cran=facile&sans=echauffement,defi", pad],
    ["19-additions-f2-double", "&choix=2:2&cran=facile&sans=echauffement,defi", pad],
    ["20-calcul-n2-mur", "&choix=3:2&cran=conseille&sans=echauffement,defi", pad],
    ["21-calcul-n7-chemin", "&choix=3:7&cran=facile&sans=echauffement,defi", pad],
  ];
  for (const [nom, q, ready] of S) {
    await go(q); await page.tap(".play", { force: true }); await ready(); await page.waitForTimeout(1200);
    await shot(nom); await exercice(page, `${W} ${nom}`);
    // l'aide (coquillage) quand il y en a une, puis une correction (« je ne sais pas »)
    if (await page.locator(".bubble.help").isVisible().catch(() => false)) { await page.tap(".bubble.help", { force: true }); await page.waitForTimeout(1800); await shot(`${nom}-aide`); await exercice(page, `${W} ${nom} (aide)`); await ready().catch(() => {}); }
    if (await page.locator(".nsp").first().isVisible().catch(() => false)) { await page.tap(".nsp >> nth=0", { force: true }); await page.waitForTimeout(1600); await shot(`${nom}-correction`); await exercice(page, `${W} ${nom} (correction)`); }
  }

  // ---- le défi record (cinq séances terminées et dix faits bien sus)
  await go("&cran=conseille&sans=echauffement,notion");
  await page.evaluate(async (DAY) => {
    const s = window.__app.store, now = Date.now();
    for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] });
    for (const [i, k] of ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"].entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); }
  }, DAY);
  await go("&cran=conseille&sans=echauffement,notion"); await page.tap(".play", { force: true });
  await page.waitForFunction(() => window.__app.challenge && window.__app.facts?.resolve && !window.__app.facts.locked, null, { timeout: 60000 }).then(async () => { await page.waitForTimeout(1500); await shot("30-defi"); await exercice(page, `${W} défi`); }).catch(() => check(false, `${W} défi : pas atteint`));

  // ---- les leçons (au milieu de la leçon)
  for (const L of ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"]) {
    await page.goto(url + `?nosw&voix=rapide&son=non&lecon=${L}`); await page.waitForFunction(() => window.__ready !== undefined);
    await page.tap(".play", { force: true });
    await page.waitForFunction(() => (window.__app.lessons?.p ?? 0) >= 2 || window.__lecon, null, { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(700); await shot(`40-lecon-${L}`); await exercice(page, `${W} leçon ${L}`);
  }

  // ---- le récif et l'album (les quinze créatures du lagon gagnées), « à demain »
  await go(""); await page.evaluate(async () => { const a = window.__app, ids = a.cartes.cartes.filter((c) => c.zone === "lagon").map((c) => c.id); await a.store.put("recompenses", { id: "cartes", cartes: Object.fromEntries(ids.map((id) => [id, { n: 1, premiere: Date.now() }])) }); await a.rewards.load(); });
  await go(""); await page.tap(".reefkey", { force: true }); await page.waitForSelector(".creature", { timeout: 30000 }); await page.waitForTimeout(1500); await shot("50-recif");
  { const d = await decor(page); check(d.lagon && d.creatures > 0, `${W} récif : les créatures gagnées sur le lagon`); }
  await go(""); await page.tap(".albumkey", { force: true }); await page.waitForTimeout(2000); await shot("51-album");
  check(errors.length === 0, `${W} : aucune erreur dans la page (${errors.slice(0, 3).join(" | ")})`);
  await context.close();
}
writeFileSync(join(OUT, "resultat.json"), JSON.stringify({ date: new Date().toISOString(), echecs: fail }, null, 1));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exitCode = fail.length ? 1 : 0;
