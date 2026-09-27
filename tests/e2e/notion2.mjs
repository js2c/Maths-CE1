// LOT 2, ÉTAPE 6 : UNE SÉANCE DONT LA NOTION DU JOUR EST LE MODULE 2 (additions), dans Chromium (1280 × 800,
// tactile, voix accélérée) : échauffement, puis la notion du jour sur les additions (le bernard-l'ermite, deux
// exemples guidés avec l'appui de la famille, des questions dont une fausse : correction avec l'appui), récompense.
// Vérifie la base (module 2 noté dans la séance, réponses marquées « notion », exemples guidés) et que chaque
// phrase dite a son fichier. Captures dans tests/e2e/out/notion2.
//   node tests/e2e/notion2.mjs [--questions 6] [--famille 3]   (--famille : le parent a marqué connues les familles d'avant)
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const N = Number(opt("--questions", 6)), FAM = Number(opt("--famille", 0)), OUT = resolve(`tests/e2e/out/notion2${FAM ? `-f${FAM}` : ""}`);
mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true })).newPage();
const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = (n) => page.screenshot({ path: join(OUT, `${n}.png`) });
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) process.exitCode = 1; };
await page.goto(url + `?nosw&voix=rapide&son=non&module=2&cran=conseille&faits=3&questions=${N}&guides=2`); await page.waitForFunction(() => window.__ready !== undefined);
await page.evaluate(async (fam) => {
  const s = window.__app.store; await s.setSetting("mascotte", "Pili"); window.__app.mascotte = "Pili";
  if (fam > 1) { const { markFamilyKnown } = await import("./js/parent/depart.js"), m2 = await (await fetch("content/module2.json")).json(); for (let f = 1; f < fam; f++) await markFamilyKnown(s, m2, f); }
}, FAM);
await page.tap(".play", { force: true });
const typeIn = async (n) => { for (const d of String(n)) await page.tap(`.key[data-key="${d}"]`, { force: true }); await page.tap('.key[data-key="valider"]', { force: true }); };
let k = 0, sawGuide = false, sawFix = false, notionQ = 0, sawLesson = false, sawHermit = false;
for (const until = Date.now() + 240000; Date.now() < until;) {
  const st = await page.evaluate(() => { const s = window.__app.facts, h = window.__app.hermit; return { done: !!document.querySelector(".tally"), notion: !!s?.notion, hermit: !!h?.visible, lesson: !!window.__app.lessons.p2?.keys, q: s?.q && !s.locked && s.resolve ? { a: s.q.a, b: s.q.b, forme: s.q.forme ?? "directe", guide: !!s.q.guide, base: !!s.q.base } : null }; });
  if (st.done) break;
  if (st.hermit) sawHermit = true;
  if (st.lesson && !sawLesson) { sawLesson = true; await page.waitForTimeout(1200); await shot("2-lecon"); }
  if (!st.q) { await page.waitForTimeout(100); continue; }
  const exp = st.q.forme === "trouDroite" ? st.q.b : st.q.forme === "trouGauche" ? st.q.a : st.q.a + st.q.b;
  if (st.notion && st.q.guide && !sawGuide) { sawGuide = true; await shot("3-exemple-guide"); }
  if (st.notion && !st.q.guide) { notionQ++; if (notionQ === 1) await shot("4-question"); }
  const wrong = st.notion && !st.q.guide && notionQ === 2;
  await typeIn(wrong ? (exp === 9 ? 8 : exp + 1) : exp);
  if (wrong) { await page.waitForTimeout(900); await shot("5-correction"); sawFix = true; }
  await page.waitForFunction(() => !window.__app.facts.resolve || window.__app.facts.locked, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(150); k++;
}
await page.waitForSelector(".tally", { timeout: 60000 }); await page.waitForTimeout(800); await shot("6-recompense");
await page.waitForSelector(".moon", { timeout: 60000 });
const db = await page.evaluate(async () => { const s = window.__app.store; return { seances: await s.all("seances"), rep: await s.all("reponses"), fam: await s.get("niveaux", 2), impose: await s.setting("moduleImpose") }; });
const se = db.seances.at(-1), notion = db.rep.filter((r) => r.seance === se.id && r.notion);
check(se.module === 2 && se.moduleImpose === true && db.impose === null, `séance : module 2 (imposé, réglage consommé) ; famille en cours ${se.famille}`);
check(sawHermit, "le bernard-l'ermite était là pendant la notion du jour");
const guides = se.lecons?.length ? 1 : 2; // après une leçon : un seul exercice guidé (session/notion.js)
check(sawGuide && notion.filter((r) => r.guide).length === guides, `${guides} exemple(s) guidé(s) (${notion.filter((r) => r.guide).length})${se.lecons?.length ? `, après la leçon ${se.lecons[0].id}` : ""}`);
check(notion.filter((r) => !r.guide).length >= N, `${notion.filter((r) => !r.guide).length} questions d'additions en notion du jour (au moins ${N})`);
check(sawFix && notion.some((r) => !r.juste && !r.guide) && notion.some((r) => r.revient), "une erreur, corrigée avec l'appui, et le fait revenu");
const counts = {}; notion.forEach((r) => { counts[r.question] = (counts[r.question] ?? 0) + 1; });
check(Object.values(counts).every((n) => n <= 4), `un même fait au plus 3 fois (plus son retour) : ${JSON.stringify(counts)}`);
check(se.terminee, "séance terminée");
const voix = await page.evaluate(() => [...window.__app.voice.misses]);
check(voix.length === 0, `chaque phrase dite a son fichier son${voix.length ? ` ; sans fichier : ${voix.join(" | ")}` : ""}`);
console.log(JSON.stringify({ famille: se.famille, familles: db.fam?.ouvertes, lecons: se.lecons, etapes: se.etapes }));
check(errors.length === 0, `aucune erreur dans la page ${errors.join(" | ")}`);
await browser.close(); srv.close();
