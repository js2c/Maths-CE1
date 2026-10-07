// LOT « CORRECTIFS » (docs/LOTS.md, fiche 2 bis ; docs/ECARTS-SPEC.md) : ce que le lot change à l'écran ou à l'oreille,
// en 1280 × 800 (densité 2) et 1920 × 1200 (densité 1), captures dans tests/e2e/out/correctifs :
//  - 7.3 : calcul rapide, niveau 9, cran « très dur » : la forme à trou (« 42 moins combien ? Ça fait 37. »), sans chemin ;
//    une erreur et sa correction (le chemin rejoué), puis une bonne réponse ;
//  - 7.6 : au mur (niveau 2), une erreur non reconnue fait dire « Hmm, regardons ensemble. » (plus de « chemin ») ;
//  - 10.1 : l'espace parent, bloc « Cartes », sans les cadeaux de la surprise (ni « undefined »).
//   node tests/e2e/correctifs.mjs [--out dossier] [--seul 1280|1920]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(opt("--out", "tests/e2e/out/correctifs")); mkdirSync(OUT, { recursive: true });
const SEUL = opt("--seul", null);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };

for (const [W, H, dpr] of [[1280, 800, 2], [1920, 1200, 1]].filter(([w]) => !SEUL || String(w) === SEUL)) {
  const T = `${W}`;
  const open = async (q = "", prep = null) => {
    const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dpr, hasTouch: true }), page = await context.newPage(), errors = [];
    page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(async () => { await window.__app.store.setSetting("echauffement", false); });
    if (prep) await page.evaluate(prep);
    await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
    await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
    return { page, context, errors };
  };
  const shot = (page, n) => page.screenshot({ path: join(OUT, `${T}-${n}.png`) });
  const waitQ = (page) => page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 60000 });
  const type = async (page, n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(170); } await page.tap('.key[data-key="valider"]', { force: true }); };
  const cur = (page) => page.evaluate(() => { const q = window.__app.facts.q; return { a: q.a, op: q.op, b: q.b, n: q.n, forme: q.forme, niveau: q.niveau, cheminMode: q.cheminMode }; });
  const said = (page) => page.evaluate(() => window.__said.join(" | "));

  // 1. (7.3) le niveau 9 au cran « très dur » : la forme à trou ; une erreur corrigée sur le chemin ; une bonne réponse
  {
    const { page, context, errors } = await open("&cran=tresdur&choix=3:9", async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [1, 2, 3, 4, 5, 6, 7], obtenus: [], vus: { 9: 10 }, fenetres: {}, lecons: ["L7", "L8", "L9"] }); });
    await page.tap(".play", { force: true }); await waitQ(page); await page.waitForTimeout(900);
    let q = await cur(page);
    check(q.niveau === 9 && q.forme === "trouDroite" && q.op === "-" && q.cheminMode === "non", `${T} · 7.3 : niveau 9, « très dur » : ${q.a} − ? = ${q.n}, sans chemin`);
    check(new RegExp(`${q.a} moins combien \\? Ça fait ${q.n}\\.`).test(await said(page)), `${T} · 7.3 : la consigne « ${q.a} moins combien ? Ça fait ${q.n}. »`);
    await shot(page, "1-calcul-niveau9-tres-dur");
    // une erreur (le résultat au lieu du nombre retiré) : la correction rejoue le chemin
    await page.evaluate(() => { window.__said = []; });
    await type(page, q.n === q.b ? q.b + 1 : q.n % 100);
    await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(1600);
    await shot(page, "2-calcul-niveau9-correction");
    await waitQ(page); await page.waitForTimeout(700);
    check(/regardons ensemble/i.test(await said(page)), `${T} · 7.3 : la correction (${(await said(page)).slice(0, 140)})`);
    q = await cur(page);
    if (q.forme === "trouDroite") { await type(page, q.b); await page.waitForTimeout(500); await shot(page, "3-calcul-niveau9-juste"); }
    check(!errors.length, `${T} · niveau 9 : aucune erreur dans la page (${errors.join(" | ")})`); await context.close();
  }

  // 2. (7.6) au mur, une erreur non reconnue (ni C1 ni C3)
  {
    const { page, context, errors } = await open("&cran=conseille&choix=3:2", async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [1], obtenus: [], vus: { 2: 10 }, fenetres: {}, lecons: ["L7"] }); });
    await page.tap(".play", { force: true }); await waitQ(page); await page.waitForTimeout(700);
    const q = await cur(page), juste = q.op === "-" ? q.a - q.b : q.a + q.b, c1 = q.op === "-" ? q.a - q.b / 10 : q.a + q.b / 10;
    let faux = (juste + 7) % 100; if (faux === c1 || faux === juste) faux = (juste + 13) % 100;
    await page.evaluate(() => { window.__said = []; });
    await type(page, faux);
    await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(1200);
    await shot(page, "4-mur-erreur-non-reconnue");
    const s = await said(page);
    check(/Hmm, regardons ensemble\./.test(s) && !/chemin/.test(s), `${T} · 7.6 : ${q.a} ${q.op} ${q.b}, réponse ${faux} : « Hmm, regardons ensemble. », sans « chemin » (${s.slice(0, 120)})`);
    check(!errors.length, `${T} · mur : aucune erreur dans la page (${errors.join(" | ")})`); await context.close();
  }

  // 3. (10.1) l'espace parent, bloc « Cartes » : plus de cadeaux de la surprise
  {
    const { page, context, errors } = await open();
    await page.evaluate(async () => { const p = window.__app.parent; p.tab = "progression"; p.open(); await p.dashboard(); });
    await page.waitForTimeout(600);
    const box = page.locator(".pa-card-box", { has: page.locator("h2", { hasText: /^Cartes$/ }) });
    check(await box.count() === 1, `${T} · 10.1 : le bloc « Cartes »`);
    await box.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); await box.screenshot({ path: join(OUT, `${T}-5-parent-cartes.png`) });
    const t = await box.textContent();
    check(!/cadeau|undefined/.test(t), `${T} · 10.1 : ni cadeaux de la surprise ni « undefined »`);
    check(!errors.length, `${T} · espace parent : aucune erreur dans la page (${errors.join(" | ")})`); await context.close();
  }
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
