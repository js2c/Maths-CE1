// LOT 3 BIS (docs/SPEC-LOT3BIS.md) : parcours et captures des écrans que le lot change, du point de vue de l'enfant.
// Étape 1 : les amis de 10 à trou (le cadre de 10 d'emblée au cran « plus facile », les deux formes à trou qui alternent),
// les maisons de 8 et 9 (deux questions sur trois à trou), le calcul rapide « très dur » au niveau 2 (la forme directe,
// puis le trou sur le nombre de départ, « Combien plus 10 ? Ça fait 57. »). Captures en densité 2 (tests/e2e/out/lot3bis).
//   node tests/e2e/lot3bis.mjs [--out dossier] [--seulement additions,calcul]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), OUT = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "tests/e2e/out/lot3bis"); mkdirSync(OUT, { recursive: true });
const only = args.includes("--seulement") ? args[args.indexOf("--seulement") + 1].split(",") : null, run = (k) => !only || only.includes(k);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const open = async (q = "", prep = null) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: true }), page = await context.newPage(), errors = [];
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
const cur = (page) => page.evaluate(() => { const q = window.__app.facts.q; return { a: q.a, op: q.op, b: q.b, n: q.n ?? q.a + q.b, forme: q.forme, aide: !!q.aideDEmblee, appui: q.appui, niveau: q.niveau, guide: !!q.guide, pont: !!q.pont }; });
const answerOf = (q) => (q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.n);

// ---------------------------------------------------------------- étape 1 : amis de 10 et maisons
if (run("additions")) {
  // famille 3, cran « plus facile », leçon L5 déjà vue : le cadre de 10 d'emblée, à trou
  const { page, context, errors } = await open("&cran=facile&choix=2:3", async () => { await window.__app.store.put("niveaux", { module: 2, ouvertes: [1, 2, 3], ouvertures: [], acquises: [1, 2], trou: [], notion: [3], lecons: ["L4", "L5"] }); });
  await page.tap(".play", { force: true });
  const formes = [];
  for (let i = 0, k = 0; i < 9; i++) {
    // (une question nouvelle : l'aide d'emblée est montrée avant que le pavé revienne)
    await page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.q !== window.__lastQ; }, null, { timeout: 60000 });
    await page.evaluate(() => { window.__lastQ = window.__app.facts.q; });
    const q = await cur(page); if (q.guide) { await waitQ(page); await type(page, answerOf(q)); await page.waitForTimeout(400); continue; }
    if (q.a + q.b === 10) formes.push(q.forme);
    if (k++ === 0) { await page.waitForTimeout(900); await shot(page, "1-amis10-facile-cadre"); check(q.forme !== "directe" && q.aide && q.appui === "cadre", `amis de 10, plus facile : à trou, cadre d'emblée (${q.a}, ${q.b}, ${q.forme})`); }
    await waitQ(page); if (k === 2) { await page.waitForTimeout(300); await shot(page, "2-amis10-facile-ardoise"); }
    await type(page, answerOf(q)); await page.waitForTimeout(500);
  }
  check(formes.length >= 5 && formes.every((f) => f !== "directe"), `amis de 10 : toutes à trou (${formes.join(" ")})`);
  const fresh = formes; check(fresh.every((f, i) => !i || f !== fresh[i - 1]), "les deux formes à trou alternent");
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}
if (run("additions")) {
  // famille 5, cran conseillé : deux questions sur trois à trou, la maison
  const { page, context, errors } = await open("&cran=conseille&choix=2:5", async () => { await window.__app.store.put("niveaux", { module: 2, ouvertes: [1, 2, 3, 4, 5], ouvertures: [], acquises: [1, 2, 3, 4], trou: [], notion: [5], lecons: ["L4", "L5", "L6"] }); });
  await page.tap(".play", { force: true });
  const f = [];
  for (let i = 0; i < 9; i++) {
    await waitQ(page); const q = await cur(page); if (q.guide) { await type(page, answerOf(q)); await page.waitForTimeout(400); continue; }
    if (q.a + q.b >= 8 && q.a + q.b <= 9) f.push(q.forme);
    if (f.length === 2) { await page.waitForTimeout(300); await shot(page, "3-maisons89-question"); }
    await type(page, answerOf(q)); await page.waitForTimeout(500);
  }
  check(f.filter((x) => x !== "directe").length >= Math.floor((f.length * 2) / 3) - 1 && f.includes("directe"), `maisons de 8 et 9 : deux sur trois à trou (${f.join(" ")})`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

// ---------------------------------------------------------------- étape 1 : calcul rapide « très dur », trou sur le départ
if (run("calcul")) {
  const { page, context, errors } = await open("&cran=tresdur&choix=3:2", async () => { await window.__app.store.put("niveaux", { module: 3, acquis: [], obtenus: [], vus: { 2: 10 }, fenetres: {}, lecons: ["L7"] }); });
  await page.tap(".play", { force: true });
  const f = [], rep = new Set();
  for (let i = 0; i < 6; i++) {
    await waitQ(page); const q = await cur(page); f.push(q.forme); rep.add(answerOf(q));
    if (q.forme === "trouGauche" && !f.slice(0, -1).includes("trouGauche")) {
      await page.waitForTimeout(400); await shot(page, "4-calcul-tres-dur-depart");
      const s = await page.evaluate(() => window.__said.at(-1)); check(/^Combien (plus|moins) 10 \? Ça fait \d+\.$/.test(s), `la consigne : « ${s} »`);
      // une erreur : la bonne réponse entourée
      await type(page, q.n); await page.waitForSelector(".skip", { timeout: 10000 }); await page.waitForTimeout(1500); await shot(page, "5-calcul-tres-dur-depart-correction");
      await page.tap(".skip", { force: true, timeout: 2000 }).catch(() => {}); continue;
    }
    await type(page, answerOf(q)); await page.waitForTimeout(500);
  }
  check(f.filter((x) => x === "trouGauche").length >= 2 && f.filter((x) => x === "directe").length >= 2 && !f.includes("trouDroite"), `niveau 2, très dur : directe et trou sur le départ en alternance (${f.join(" ")})`);
  check(rep.size >= 5, `réponses variées (${[...rep].join(", ")})`);
  const r = await page.evaluate(async () => (await window.__app.store.all("reponses")).filter((x) => x.module === 3 && x.forme === "trouGauche").map((x) => `${x.question} → ${x.attendue}`));
  check(r.length && r.every((x) => /^\? [+−] 10 = \d+ → \d+$/.test(x)), `l'historique du parent : ${r.join(", ")}`);
  check(!errors.length, `aucune erreur (${errors.join(" | ")})`); await context.close();
}

await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
