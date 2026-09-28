// LOT 3, ÉTAPE 4 : parcours du calcul rapide (docs/SPEC-LOT3.md, section 6) : la leçon L7 sur le mur de corail (le mur
// qui se construit, le poisson qui descend, les dizaines et les unités en couleurs), les calculs guidés où l'enfant remplit
// chaque pont, une erreur corrigée sur le mur (C1), une erreur corrigée sur le chemin (C4), le chemin d'emblée (cran
// « plus facile »), la forme à trou (« très dur »), l'écran « choisir » (quatre exercices, neuf niveaux), la rotation de
// « jouer » (module imposé), le bloc « Calcul rapide » de l'espace parent. Captures en densité 2 (tests/e2e/out/calcul).
//   node tests/e2e/calcul.mjs [--out dossier]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/calcul"); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const open = async (q = "", prep = null) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [], said = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); await window.__app.store.setSetting("echauffement", false); });
  if (prep) await page.evaluate(prep);
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(() => { const v = window.__app.voice, say = v.say.bind(v); window.__said = []; v.say = (t, o) => { window.__said.push(t); return say(t, o); }; });
  return { page, context, errors };
};
const shot = (page, n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const waitQ = (page) => page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 60000 });
const type = async (page, n) => { for (const d of String(n)) { await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.waitForTimeout(60); } await page.tap('.key[data-key="valider"]', { force: true }); };
const cur = (page) => page.evaluate(() => { const q = window.__app.facts.q; return { a: q.a, op: q.op, b: q.b, n: q.n, forme: q.forme, pont: !!q.pont, niveau: q.niveau, cheminMode: q.cheminMode, aideDEmblee: !!q.aideDEmblee }; });

// 1. une base neuve, le calcul rapide niveau 2 choisi : la leçon L7 (le mur), puis les calculs guidés, une erreur (C1) corrigée sur le mur
{
  const { page, context, errors } = await open("&cran=conseille&choix=3:2");
  await page.tap(".play", { force: true });
  await page.waitForFunction(() => window.__app.lessons?.p2?.st?.mur, null, { timeout: 60000 });
  // (captures au fil de la leçon, sans attendre : la voix « rapide » l'accélère)
  const poll = { polling: 50, timeout: 30000 };
  await page.waitForFunction(() => window.__app.lessons.p2.st.mur?.upTo >= 100, null, poll).catch(() => {}); await shot(page, "1-L7-mur");
  await page.waitForFunction(() => window.__app.lessons.p2.st.mur?.lit?.length === 2, null, poll).catch(() => {}); await page.waitForTimeout(300); await shot(page, "2-L7-poisson-44");
  await page.waitForFunction(() => window.__app.lessons.p2.st.mur?.split, null, poll).catch(() => {}); await shot(page, "3-L7-couleurs");
  // « À toi ! » : le premier calcul guidé, pont par pont
  await waitQ(page); const g = await cur(page);
  check(g.pont && g.niveau === 2, `après la leçon : un calcul guidé, un pont à remplir (${g.a} ${g.op} ${g.b})`);
  await page.waitForTimeout(400); await shot(page, "4-guide-pont");
  await type(page, g.n); await page.waitForTimeout(400);
  // les calculs guidés restants, puis une vraie question : une erreur C1 (les unités changées)
  for (let i = 0; i < 12; i++) { await waitQ(page); const q = await cur(page); if (!q.pont) break; await type(page, q.n); await page.waitForTimeout(250); }
  await waitQ(page); const q = await cur(page);
  check(!q.pont && q.niveau === 2 && q.cheminMode === "coquillage", `après les calculs guidés : le chemin au coquillage (${q.a} ${q.op} ${q.b})`);
  await page.waitForTimeout(300); await shot(page, "5-question");
  await page.tap(".bubble.help", { force: true }); await page.waitForTimeout(700); await shot(page, "6-coquillage-chemin");
  const wrong = q.op === "+" ? q.a + 1 : q.a - 1; await type(page, wrong);
  await page.waitForFunction(() => window.__app.calc?.fish?.a.vis && window.__app.calc.fish.y > 400, null, { polling: 50, timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(250); await shot(page, "7-correction-mur");
  const s = await page.evaluate(() => window.__said.join(" | "));
  check(/seules les dizaines changent/.test(s), "C1 reconnue : « seules les dizaines changent »");
  await waitQ(page);
  const rep = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((r) => r.module === 3 && !r.guide));
  check(rep.some((r) => r.erreur === "C1" && !r.juste), `réponse enregistrée avec l'erreur C1 (${rep.map((r) => `${r.question}:${r.erreur}`).join(", ")})`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 2. le niveau 7 (leçon déjà vue) : une erreur C4 corrigée sur le chemin ; le chemin d'emblée au cran « plus facile » ; la forme à trou au cran « très dur »
for (const cran of ["conseille", "facile", "tresdur"]) {
  const { page, context, errors } = await open(`&cran=${cran}&choix=3:7`, async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [], obtenus: [], vus: { 7: 10 }, fenetres: {}, lecons: ["L9"] }); });
  await page.tap(".play", { force: true }); await waitQ(page); await page.waitForTimeout(700);
  const q = await cur(page);
  if (cran === "facile") { check(q.aideDEmblee && q.cheminMode === "emblee", "plus facile : le chemin affiché d'emblée"); await shot(page, "9-plus-facile-chemin"); }
  if (cran === "tresdur") { check(q.forme === "trouDroite" && q.cheminMode === "non", `très dur : forme à trou, sans chemin (${q.a} + ? = ${q.n})`); await shot(page, "10-tres-dur-trou"); }
  if (cran === "conseille") {
    await type(page, Math.floor(q.a / 10) * 10 + ((q.a % 10) + q.b) % 10);
    await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(900); await shot(page, "8-correction-chemin-C4");
    const s = await page.evaluate(() => window.__said.join(" | "));
    check(/dépasse dix/.test(s), `C4 reconnue : « … dépasse dix : on passe à la dizaine suivante »`);
    await waitQ(page);
  }
  check(!errors.length, `${cran} : aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 3. l'écran « choisir » : quatre exercices ; le calcul rapide et ses neuf niveaux
{
  const { page, context, errors } = await open();
  await page.tap(".choisir", { force: true }); await page.waitForSelector(".choix-ex"); await page.waitForTimeout(400);
  check((await page.locator(".choix-ex").count()) === 4, "quatre exercices (ligne, additions, calcul rapide, leçons)");
  await shot(page, "11-choisir-exercices");
  await page.tap('.choix-ex[aria-label="calcul"]', { force: true }); await page.waitForSelector(".choix-tuile"); await page.waitForTimeout(400);
  check((await page.locator(".choix-tuile").count()) === 9, "les 9 niveaux du calcul rapide, tous accessibles");
  await shot(page, "12-choisir-niveaux-calcul");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
// 4. « jouer » : le module imposé par le parent (le calcul rapide) ; la frise montre le mur ; l'espace parent
{
  const { page, context, errors } = await open("&cran=conseille&sansLecon", async () => { await window.__app.store.setSetting("moduleImpose", { module: 3, t: Date.now() }); });
  await page.tap(".play", { force: true }); await waitQ(page); await page.waitForTimeout(500);
  check(await page.evaluate(() => window.__app.session.rec.module === 3 && window.__app.frieze.icon === "frise.calcul"), "module imposé : le calcul rapide, pictogramme du mur dans la frise");
  await shot(page, "13-jouer-calcul");
  await page.evaluate(async () => { await window.__app.store.setSetting("codeParent", "1234"); });
  page.evaluate(() => window.__app.parent.open()).catch(() => {}); await page.waitForSelector(".pa-keys", { timeout: 10000 });
  for (const d of "1234") { await page.dispatchEvent(`.pa-keys button[data-key="${d}"]`, "pointerdown"); await page.waitForTimeout(80); }
  await page.waitForTimeout(600); await page.click('.pa-tabs button:has-text("Progression")'); await page.waitForTimeout(700);
  const card = await page.evaluate(() => [...document.querySelectorAll(".pa-card-box h2")].map((h) => h.textContent));
  check(card.some((t) => t.includes("Calcul rapide")), `espace parent : le bloc « Calcul rapide » (${card.join(" ; ")})`);
  await page.evaluate(() => [...document.querySelectorAll(".pa-card-box h2")].find((h) => h.textContent.includes("Calcul rapide"))?.scrollIntoView()); await page.waitForTimeout(300); await shot(page, "14-parent-calcul");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
