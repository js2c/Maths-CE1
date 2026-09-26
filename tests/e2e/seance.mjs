// PARCOURS D'UNE SÉANCE COMPLÈTE dans Chromium (tablette 1280 × 800, tactile), voix accélérée :
// premier lancement -> choix du nom de la pieuvre -> accueil -> exemples guidés -> questions (justes et
// fausses) -> récompense -> « à demain ». Puis vérifie la base (séance terminée, réponses, étoiles, nom)
// et qu'une relance le même jour affiche la lune au lieu de « jouer ». Captures dans tests/e2e/out/seance.
//   node tests/e2e/seance.mjs [--out dossier] [--questions 3]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/seance")), N = Number(opt("--questions", 3));
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true });
const page = await context.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = (n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
const q = `?nosw&voix=rapide&questions=${N}&guides=2`;

await page.goto(url + q); await page.waitForFunction(() => window.__ready !== undefined);
await shot("1-accueil");
await page.tap(".play", { force: true });
await page.waitForSelector(".name", { timeout: 20000 }); await page.waitForTimeout(600);
check(await page.locator(".check").isHidden(), "la coche n'apparaît qu'après un nom touché");
await page.tap('.name[data-value="Octavie"]', { force: true }); await page.waitForTimeout(500);
await shot("2-choix-du-nom");
await page.tap(".check", { force: true });

// répond à chaque question dès qu'elle accepte une réponse : juste, sauf la 2e (fausse)
let k = 0, sawGuide = false;
const deadline = Date.now() + 240000;
while (Date.now() < deadline) {
  const st = await page.evaluate(() => { const s = window.__app.screen; return { moon: !!document.querySelector(".moon") || !!document.querySelector(".tally"), q: s?.q && !s.locked && s.resolve ? { guide: !!s.q.guide, format: s.q.format, answer: s.q.answer, wrong: s.q.choices?.find((c) => c.value !== s.q.answer)?.value ?? null } : null, demo: !!(s?.q?.guide && s.locked && s.resolve) }; });
  if (st.moon) break;
  if (st.demo && !sawGuide) { sawGuide = true; await page.waitForTimeout(1800); await shot("3-exemple-guide"); }
  if (!st.q) { await page.waitForTimeout(150); continue; }
  const right = st.q.guide || k !== 1 || st.q.wrong === null;
  if (!st.q.guide && k === 0) await shot("4-question");
  await page.tap(`.answer[data-value="${right ? st.q.answer : st.q.wrong}"]`, { force: true });
  if (!st.q.guide) k++;
  if (!right) { await page.waitForTimeout(1500); await shot("5-retour-faux"); }
  await page.waitForFunction(() => !window.__app.screen?.resolve || window.__app.screen.locked, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(300);
}
await page.waitForSelector(".tally", { timeout: 60000 });
await page.waitForTimeout(900); await shot("6-recompense");
await page.waitForSelector(".moon", { timeout: 60000 }); await page.waitForTimeout(800);
await shot("7-a-demain");
check(sawGuide, "un exemple guidé a été montré");
const db = await page.evaluate(async () => { const s = window.__app.store; return { seances: await s.all("seances"), reponses: await s.all("reponses"), etoiles: await s.get("recompenses", "etoiles"), nom: await s.setting("mascotte") }; });
const se = db.seances.at(-1);
check(db.nom === "Octavie", `nom de la pieuvre enregistré (${db.nom})`);
check(se?.terminee === true, "séance terminée enregistrée");
check(db.reponses.filter((r) => r.guide).length === 2, `2 exemples guidés enregistrés (${db.reponses.filter((r) => r.guide).length})`);
check(db.reponses.filter((r) => !r.guide).length >= N, `${db.reponses.filter((r) => !r.guide).length} questions enregistrées (au moins ${N})`);
check(db.reponses.every((r) => r.seance === se.id), "chaque réponse porte le numéro de la séance");
check(db.etoiles?.total === se.etoiles && se.etoiles >= 10, `étoiles : ${se.etoiles} gagnées, trésor ${db.etoiles?.total}`);
check(db.reponses.filter((r) => !r.guide).at(-1)?.juste === true, "la séance finit sur une réussite");
const hudShown = await page.evaluate(() => window.__app.hud.shown); check(hudShown === db.etoiles.total, `le compteur affiche le trésor (${hudShown})`);
console.log(JSON.stringify({ seance: { ...se, etapes: se.etapes.map((e) => `${e.id}${e.sautee ? ` (sautée : ${e.sautee})` : ` ${e.dureeS} s`}`) } }, null, 1));
// relance le même jour : la lune, pas de « jouer »
await page.reload(); await page.waitForFunction(() => window.__ready !== undefined); await page.waitForTimeout(800);
check((await page.locator(".play").count()) === 0 && (await page.locator(".moon").count()) === 1, "relance le même jour : la lune au lieu de « jouer »");
await shot("8-relance-meme-jour");
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
