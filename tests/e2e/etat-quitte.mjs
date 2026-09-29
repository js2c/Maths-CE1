// CORRECTIF DU 28 SEPTEMBRE 2026 : L'ÉTAT LAISSÉ PAR UN EXERCICE QUITTÉ EN COURS. Constaté sur la tablette : un calcul
// guidé du calcul rapide quitté par la maison, puis un autre exercice ; le premier chiffre tapé dans les additions
// redessinait l'ancien chemin avec ce chiffre dans son caillou (« 1 + 3 = 4 » et le chemin 65 → 75 → 4) : le rappel de la
// saisie (`FactsScreen.onTyped`) n'était pas remis à zéro en quittant. Même risque pour le tableau de la dictée.
// Ce parcours essaie toute la famille de défauts : pour chaque exercice (ligne, dictée, additions, calcul rapide guidé et
// non guidé, défi record) et à chaque moment d'une question (consigne, saisie, aide, correction, exemple guidé), la maison,
// puis, depuis l'accueil en pause, « choisir » et chacun des autres exercices ; une réponse tapée. L'écran doit être celui
// d'un démarrage à neuf du même exercice (même page, sans rien quitter avant) : aucune aide, aucun chemin, aucun tableau,
// aucun chiffre d'avant, pas de « passer » ni de poisson du mur qui traîne.
//   node tests/e2e/etat-quitte.mjs [--seul additions] [--vers calcul] [--parallele 3]
import { chromium } from "../../art/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve("tests/e2e/out/etat-quitte"), ONLY = opt("--seul", null), TO = opt("--vers", null), PAR = Number(opt("--parallele", 3)); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const DAY = 86400000;

// ---------------------------------------------------------------- une page préparée
async function open(q, prep) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  await page.evaluate(async ({ DAY, prep }) => {
    const s = window.__app.store, now = Date.now(); await s.setSetting("mascotte", "Pili");
    // le calcul rapide non guidé : le niveau 2 déjà vu (les trois calculs guidés d'un nouveau niveau sont passés)
    if (prep === "calculVu") await s.put("niveaux", { id: 3, module: 3, acquis: [1], obtenus: [{ niveau: 1, date: now - DAY }, { niveau: 2, date: now - DAY }], vus: { 2: 12 }, fenetres: {}, lecons: ["L7"], seances: 3 });
    if (prep === "defi") {
      for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] });
      const faits = ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"];
      for (const [i, k] of faits.entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); }
    }
  }, { DAY, prep });
  await page.goto(url + "?nosw&voix=rapide&son=non" + q); await page.waitForFunction(() => window.__ready !== undefined);
  return { page, context, errors };
}
const tap = async (page, sel, ms = 400) => { await page.waitForSelector(sel, { timeout: 20000 }); await page.tap(sel, { force: true }); await page.waitForTimeout(ms); };
const pad = (page, digits) => page.evaluate(async (digits) => { const f = window.__app.facts; for (const d of digits) { f.type(d, document.querySelector(`.key[data-key="${d}"]`)); await new Promise((r) => setTimeout(r, 200)); } }, digits);
// une réponse fausse au pavé (la bonne réponse n'est jamais 99 ni 0 à la fois), validée
const wrongPad = (page) => page.evaluate(async () => { const f = window.__app.facts, q = f.q, good = String(q.dictee ? q.answer ?? q.n : q.pont ? q.n : q.module === 3 ? (q.forme === "trouGauche" ? q.a : q.forme === "trouDroite" ? q.b : q.n) : q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.a + q.b), v = good === "9" ? "8" : "9"; f.type(v, document.querySelector(`.key[data-key="${v}"]`)); await new Promise((r) => setTimeout(r, 200)); f.submit(); });
const wrongLine = (page) => page.evaluate(() => { const s = window.__app.screen, c = s.q.choices.find((x) => x.value !== s.q.answer); s.answer(c.value, s.buttons[s.q.choices.indexOf(c)]); });

// ---------------------------------------------------------------- les exercices et leur question prête
const facts = "window.__app.facts?.q && window.__app.facts.resolve && !window.__app.facts.locked";
const EX = {
  ligne: { ex: "ligne", key: "1", ready: `window.__app.screen?.q && window.__app.screen.resolve && !window.__app.screen.locked` },
  dictee: { ex: "ligne", key: "12", ready: `${facts} && window.__app.facts.q.dictee` },
  additions: { ex: "additions", key: "3", ready: `${facts} && window.__app.session?.progress.etape === "notion"` },
  calcul: { ex: "calcul", key: "2", ready: `${facts} && window.__app.facts.q.module === 3` },
};
// les exercices quittés : où, comment les lancer, quels moments ont un sens
const SOURCES = [
  { name: "ligne", q: "&choix=1:1", ready: EX.ligne.ready, moments: ["consigne", "correction", "exemple"], pad: false },
  { name: "dictee", q: "&choix=1:12&cran=facile", ready: EX.dictee.ready, moments: ["consigne", "saisie", "correction"], pad: true },
  { name: "additions", q: "&choix=2:3", ready: EX.additions.ready, moments: ["consigne", "saisie", "aide", "correction", "exemple"], pad: true },
  { name: "calcul-guide", q: "&choix=3:2", ready: `${EX.calcul.ready} && window.__app.facts.q.pont`, moments: ["consigne", "saisie", "correction"], pad: true },
  { name: "calcul", q: "&choix=3:2", prep: "calculVu", ready: `${EX.calcul.ready} && !window.__app.facts.q.pont`, moments: ["consigne", "saisie", "aide", "correction"], pad: true },
  // le défi vient après la notion du jour : une seule question d'additions (`questions=1`), répondue juste, puis le défi
  { name: "defi", q: "&choix=2:3&questions=1", prep: "defi", avant: true, ready: `${facts} && window.__app.challenge`, moments: ["saisie", "correction"], pad: true },
];
// les paramètres communs : pas d'échauffement, pas de leçon ; `guides` : des exemples guidés (moment « exemple ») ou non
const params = (src, moment) => `&cran=${src.q.includes("cran=") ? "" : "conseille"}&sans=echauffement&sansLecon&guides=${moment === "exemple" ? 2 : 0}`.replace("&cran=&", "&");
const rightPad = (page) => page.evaluate(async () => { const f = window.__app.facts, q = f.q, v = String(q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.a + q.b); for (const d of v) { f.type(d, document.querySelector(`.key[data-key="${d}"]`)); await new Promise((r) => setTimeout(r, 200)); } f.submit(); });

// l'état de l'écran après la réponse tapée dans l'exercice lancé
const signature = (page) => page.evaluate(() => {
  const a = window.__app, f = a.facts, b = a.aidBoard?.c;
  let board = false;
  if (b?.isConnected) { const d = b.getContext("2d").getImageData(0, 0, b.width, b.height).data; for (let i = 3; i < d.length; i += 4 * 7) if (d[i] > 0) { board = true; break; } }
  let effets = false; const x = a.line?.fx;
  if (x?.isConnected) { const d = x.getContext("2d").getImageData(0, 0, x.width, x.height).data; for (let i = 3; i < d.length; i += 4 * 7) if (d[i] > 0) { effets = true; break; } }
  const shown = (e) => e?.isConnected && getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).display !== "none";
  return {
    aide: board, // le calque des aides : chemin, tableau, cadre, maison…
    saisie: f?.q ? f.typed : null, anneau: !!f?.ring, coquillage: !!f?.aide, rappelSaisie: !!f?.onTyped,
    passer: [...document.querySelectorAll("#ui .skip")].filter(shown).length,
    // les arcs de saut et surbrillances de la ligne (hors le premier saut que la tortue montre au cran « plus facile »)
    poissonMur: !!a.calc?.fish, effets: effets && !a.screen?.q?.premierSaut, ermite: !!a.hermit, defi: !!a.challenge,
    pave: f ? shown(f.els[0]) : false,
  };
});
// lance l'exercice cible depuis l'écran « choisir » (déjà ouvert), attend sa question, tape une réponse
async function launch(page, to) {
  const T = EX[to], old = await page.evaluate(() => window.__app.session?.id ?? null);
  if (process.env.TRACE) await page.evaluate(() => { window.__leaves = []; const f = window.__app.facts; if (f) { const o = f.leave.bind(f); f.leave = () => { window.__leaves.push(new Error().stack); o(); }; } });
  await tap(page, `.choix-ex[aria-label="${T.ex}"]`, 700); await tap(page, `.choix-tuile[data-key="${T.key}"]`, 300);
  // (la question de la NOUVELLE séance : pendant que l'ancienne s'arrête, sa question est encore là)
  await page.waitForFunction(`window.__app.session && window.__app.session.id !== ${JSON.stringify(old)} && ${T.ready}`, null, { timeout: 90000 }); await page.waitForTimeout(300);
  if (to !== "ligne") await pad(page, "1");
  await page.waitForTimeout(300);
  return signature(page);
}
// le démarrage à neuf (même page, mêmes réglages, rien quitté avant), une fois par cible et par jeu de paramètres
const fresh = new Map();
async function baseline(prm, prep, to) {
  const k = `${prm}|${prep}|${to}`;
  if (!fresh.has(k)) fresh.set(k, (async () => {
    const { page, context, errors } = await open(prm, prep);
    await tap(page, ".choisir", 900);
    const s = await launch(page, to);
    await context.close();
    return { s, errors };
  })());
  return fresh.get(k);
}
// un cas : l'exercice `src` quitté au moment `moment`, puis l'exercice `to`
async function run(src, moment, to) {
  const prm = params(src, moment), { page, context, errors } = await open(src.q + prm, src.prep ?? null), name = `${src.name} (${moment}) → ${to}`;
  try {
    await tap(page, ".play", 300);
    if (src.avant) { await page.waitForFunction(EX.additions.ready, null, { timeout: 90000 }); await rightPad(page); }
    if (moment === "exemple") await page.waitForFunction(`(window.__app.screen?.q?.guide || window.__app.facts?.q?.guide) && [...document.querySelectorAll("#ui .skip")].some((e) => getComputedStyle(e).visibility !== "hidden")`, null, { timeout: 90000 });
    else await page.waitForFunction(src.ready, null, { timeout: 90000 });
    if (moment === "consigne") await page.waitForTimeout(50);
    if (moment === "saisie") await pad(page, "1");
    if (moment === "aide") { await tap(page, ".bubble.help", 700); }
    if (moment === "correction") { if (src.pad) await wrongPad(page); else await wrongLine(page); await page.waitForTimeout(src.name === "defi" ? 150 : 700); }
    if (moment === "exemple") await page.waitForTimeout(600);
    await tap(page, ".session-home", 700);
    await tap(page, ".keep.choisir", 900);
    const got = await launch(page, to), base = await baseline(prm, src.prep ?? null, to);
    const diff = Object.keys(base.s).filter((k) => base.s[k] !== got[k]);
    if (diff.length && process.env.TRACE) console.log(await page.evaluate(() => window.__leaves.join("\n----\n")));
    if (diff.length) await page.screenshot({ path: join(OUT, `${src.name}-${moment}-${to}.png`) });
    check(!diff.length && !errors.length, `${name} : comme un démarrage à neuf${diff.length ? ` (${diff.map((k) => `${k} : ${JSON.stringify(got[k])} au lieu de ${JSON.stringify(base.s[k])}`).join(" ; ")})` : ""}${errors.length ? ` ; erreurs : ${errors.join(" | ")}` : ""}`);
  } catch (e) { await page.screenshot({ path: join(OUT, `${src.name}-${moment}-${to}-erreur.png`) }).catch(() => {}); check(false, `${name} : ${e.message.split("\n")[0]}`); }
  await context.close();
}
const jobs = [];
for (const src of SOURCES) { if (ONLY && ONLY !== src.name) continue; for (const moment of src.moments) for (const to of Object.keys(EX)) { if (TO && TO !== to) continue; if (to === src.name) continue; jobs.push([src, moment, to]); } }
console.log(`${jobs.length} cas`);
await Promise.all(Array.from({ length: PAR }, async () => { while (jobs.length) await run(...jobs.shift()); }));
await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntout est bon");
process.exit(fail.length ? 1 : 0);
