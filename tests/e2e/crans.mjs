// LOT 3, ÉTAPE 2 : la difficulté à l'intérieur du niveau (docs/SPEC-LOT3.md, section 3). Pour chaque niveau de la
// ligne graduée (1 à 13) et chaque cran, une question au niveau choisi, capturée ; les captures sont assemblées en
// planches (une par niveau, les quatre crans de gauche à droite). Puis les additions d'une famille choisie aux
// quatre crans (formes directes, à trou). Vérifie : le niveau joué est le niveau choisi, les nombres écrits et les
// formats suivent module1.json (crans), aucune erreur de page.
//   node tests/e2e/crans.mjs [--out dossier] [--niveaux 1,5,12]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const OUT = resolve(opt("--out") ?? "tests/e2e/out/crans"); mkdirSync(OUT, { recursive: true });
const m1 = JSON.parse(readFileSync(new URL("../../app/content/module1.json", import.meta.url)));
const niveaux = (opt("--niveaux") ?? "1,2,3,4,5,6,7,8,9,10,11,12,13").split(",").map(Number), CRANS = ["facile", "conseille", "dur", "tresdur"];
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
await page.evaluate(async () => { await window.__app.store.setSetting("mascotte", "Pili"); await window.__app.store.setSetting("echauffement", false); });
const shots = [];
for (const n of niveaux) for (const cran of CRANS) {
  // une base neuve à chaque fois (pas de leçon d'entrée : sansLecon ; pas d'exemple guidé : guides=0)
  await page.evaluate(async () => { for (const s of ["seances", "reponses", "niveaux"]) for (const x of await window.__app.store.all(s)) await window.__app.store.del?.(s, x.id ?? x.module); });
  await page.goto(url + `?nosw&voix=rapide&son=non&sansLecon&guides=0&cran=${cran}&choix=1:${n}&sans=defi`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  await page.waitForFunction(() => { const s = window.__app.screen, f = window.__app.facts; return (s?.q && s.resolve && !s.locked) || (f?.q?.dictee && f.resolve); }, null, { timeout: 40000 });
  await page.waitForTimeout(n === 1 && cran === "facile" ? 1200 : 500);
  const q = await page.evaluate(() => { const s = window.__app.screen, f = window.__app.facts; const q = f?.q?.dictee ? f.q : s.q; return { niveau: q.niveau, format: q.format, labelled: q.labelled?.map((i) => q.min + i * q.step), min: q.min, max: q.max, n: q.n, answer: q.answer, tolerance: q.tolerance, choices: q.choices?.length, cran: q.cran ?? null, repere: !!q.repere, tableau: !!q.tableau, premierSaut: !!q.premierSaut }; });
  const f = `n${String(n).padStart(2, "0")}-${cran}.png`; await page.screenshot({ path: join(OUT, f) }); shots.push(f);
  const want = { ...m1.niveaux[n - 1], ...(cran !== "conseille" ? m1.niveaux[n - 1].crans[cran] : {}) };
  check(q.niveau === n && (cran === "conseille" ? q.cran === null : q.cran === cran) && want.formats.includes(q.format), `niveau ${n}, ${cran} : ${q.format} ${q.min}-${q.max} (${q.n} graduations), écrits ${JSON.stringify(q.labelled)}${q.choices ? `, ${q.choices} propositions` : ""}${q.tolerance ? `, ±${q.tolerance}` : ""}${q.repere ? ", repère" : ""}${q.tableau ? ", tableau" : ""}${q.premierSaut ? ", premier saut" : ""} ; réponse ${q.answer}`);
}
// les additions de la famille 4 choisie, aux quatre crans
for (const cran of CRANS) {
  await page.goto(url + `?nosw&voix=rapide&son=non&sansLecon&guides=0&cran=${cran}&choix=2:4&sans=defi`); await page.waitForFunction(() => window.__ready !== undefined);
  await page.tap(".play", { force: true });
  await page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 40000 });
  await page.waitForTimeout(400);
  const forms = []; for (let i = 0; i < 6; i++) { await page.waitForFunction(() => { const f = window.__app.facts; return f?.q && f.resolve && !f.locked; }, null, { timeout: 40000 }); forms.push(await page.evaluate(() => window.__app.facts.q.forme)); if (i === 0) await page.screenshot({ path: join(OUT, `additions-${cran}.png`) }); await page.evaluate(() => { const f = window.__app.facts; f.typed = String(f.q.forme === "trouDroite" ? f.q.b : f.q.forme === "trouGauche" ? f.q.a : f.q.a + f.q.b); f.submit(); }); await page.waitForTimeout(300); }
  const trou = forms.filter((x) => x !== "directe").length;
  check(cran === "facile" ? trou === 0 : cran === "dur" ? trou === 3 : cran === "tresdur" ? trou === 6 : true, `additions, famille 4, ${cran} : formes ${forms.join(", ")}`);
}
check(!errors.length, `aucune erreur (${errors.join(" | ")})`);
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
