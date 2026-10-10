// LES PASSAGES ENTRE ÉTAPES (lot « Correctifs : passage de l'échauffement aux voiliers », points 1 et 2 ; docs/LOTS.md, fiche 8).
// Le contrôle durable du défaut vu sur la tablette le 10 octobre 2026 (capture 01) : après « passer l'échauffement », le pavé,
// le coquillage, le bernard-l'ermite et un second « je ne sais pas » restaient par-dessus les voiliers. Cause trouvée : un
// échauffement quitté par la pause, puis un autre exercice choisi, laissait son bouton « passer l'échauffement » ; touché
// plus tard, il faisait repartir la séance abandonnée (la notion du jour des additions s'affichait par-dessus).
// Le parcours passe par CHAQUE EXERCICE (ligne, additions, calcul rapide, voiliers, multiplication, étal) précédé d'un
// échauffement passé, par chaque CHEMIN (« choisir » en deux touchers, « jouer » avec l'exercice imposé, et la pause pendant
// l'échauffement puis « choisir ») et à chaque MOMENT de l'échauffement (pendant la phrase d'introduction, pendant une
// question, chiffres tapés, pendant l'aide, pendant une correction, confirmation par la coche, coche laissée 5 s puis
// reprise). L'échauffement n'a ni exemple guidé ni bernard-l'ermite (ils sont à la notion du jour des additions) : le
// parcours vérifie qu'il n'en laisse pas. Puis les autres passages : notion du jour vers le défi, défi vers la récompense,
// pause et reprise. Il échoue si un élément d'une étape précédente reste visible : pavé, coquillage, personnage guide,
// bouton de l'échauffement, double « je ne sais pas ».
//   node tests/e2e/passages.mjs [--court] [--lent 6] [--seul choisir,jouer,pause,etapes] [--out dossier]
//   --court : un moment par exercice (pour un contrôle rapide) ; --lent N : processeur ralenti N fois (tablette lente)
import { accueilReel, chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = resolve(arg("--out", "tests/e2e/out/passages")); mkdirSync(OUT, { recursive: true });
const COURT = args.includes("--court"), LENT = Number(arg("--lent", 1)), seul = arg("--seul")?.split(","), part = (p) => !seul || seul.includes(p);
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const T = (ms) => ms * Math.max(1, LENT / 2);

const EXOS = [{ id: "ligne", module: 1 }, { id: "additions", module: 2 }, { id: "calcul", module: 3 }, { id: "voiliers", module: 4 }, { id: "multiplication", module: 5 }, { id: "etal", module: 6 }];
const MOMENTS = ["intro", "question", "tape", "aide", "correction", "coche5s"];

async function open(q = "", prep = null) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true }); await accueilReel(context);
  const page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(url + "?nosw&voix=rapide&son=non"); await page.waitForFunction(() => window.__ready !== undefined);
  if (prep) { await page.evaluate(prep); }
  await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&faits=5&questions=2&sansLecon" + q); await page.waitForFunction(() => window.__ready !== undefined);
  if (LENT > 1) { const s = await context.newCDPSession(page); await s.send("Emulation.setCPUThrottlingRate", { rate: LENT }); }
  return { page, context, errors };
}
// un bouton de l'accueil ou d'un écran de choix : touché, puis touché encore s'il est toujours là (deux touchers, lot
// « Correctifs de la tablette » et point 10 de ce lot ; un bouton qui lance au premier toucher a disparu entre-temps)
const entrer = async (page, sel) => {
  await page.locator(sel).first().tap({ force: true }); await page.waitForTimeout(T(450));
  if (await page.evaluate((s) => { const e = document.querySelector(s); return !!e?.isConnected && getComputedStyle(e).visibility !== "hidden"; }, sel)) await page.locator(sel).first().tap({ force: true });
  await page.waitForTimeout(T(300));
};
const etape = (page, id, module = null, t = 60000) => page.waitForFunction(([id, m]) => window.__app.session?.progress.etape === id && (m == null || window.__app.session.rec.module === m), [id, module], { timeout: T(t) });
const question = (page) => page.waitForFunction(() => { const f = window.__app.facts; return f?.resolve && !f.locked && f.q && !f.defi; }, null, { timeout: T(30000) });
const attendu = (page) => page.evaluate(() => { const q = window.__app.facts.q, f = q.forme; return f === "trouDroite" ? q.b : f === "trouGauche" ? q.a : q.a + q.b; });
const tapKey = async (page, k) => { await page.tap(`.key[data-key="${k}"]:not(.etal-key)`, { force: true }); await page.waitForTimeout(170); };
const repondre = async (page, juste = true) => { const e = await attendu(page); for (const d of String(juste ? e : e === 9 ? 8 : e + 1)) await tapKey(page, d); await page.tap('.key[data-key="valider"]:not(.etal-key)', { force: true }); };
const visible = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].some((e) => e.isConnected && !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true })), sel);
// le bouton de l'échauffement, puis la coche
const passer = async (page, { attendre5s = false } = {}) => {
  await page.locator(".skip-warmup:visible").last().tap({ force: true });
  await page.waitForSelector(".check-warmup", { state: "visible", timeout: T(10000) });
  if (attendre5s) {
    // sans toucher, la coche s'en va au bout de 5 s et l'échauffement reprend ; on le passe ensuite pour de bon
    await page.waitForSelector(".check-warmup", { state: "hidden", timeout: T(20000) });
    await page.waitForTimeout(T(600));
    await page.locator(".skip-warmup:visible").last().tap({ force: true });
    await page.waitForSelector(".check-warmup", { state: "visible", timeout: T(10000) });
  }
  await page.waitForTimeout(T(150));
  await page.locator(".check-warmup:visible").first().tap({ force: true });
};
// ce qui reste à l'écran : rien d'une étape quittée
async function restes(page, module) {
  for (const t of [T(400), T(2500), T(6000)]) {
    await page.waitForTimeout(t === T(400) ? t : t - T(400));
    const r = await page.evaluate((module) => {
      const a = window.__app, vis = (e) => e.isConnected && !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true });
      const n = (s) => [...document.querySelectorAll(s)].filter(vis).length;
      const pad = module === 2 || module === 3 || module === 5;
      return {
        boutonEchauffement: document.querySelectorAll(".skip-warmup, .check-warmup").length,
        attente: document.querySelector("#stage")?.classList.contains("attente-passer") || !!a.warmupPending,
        nsp: n(".nsp"),
        // le pavé, le coquillage et l'ardoise de l'échauffement : seulement là où l'exercice s'en sert
        pave: pad ? 0 : n(".key:not(.etal-key)"), coquillage: pad ? 0 : n(".bubble.help:not(.etal-aide)"), ardoise: pad ? 0 : n(".hud.slate"),
        ermite: module === 2 ? 0 : (a.hermit ? 1 : 0),
        moduleSeance: a.session?.rec?.module, notionAdditions: module !== 2 && !!a.facts?.notion,
      };
    }, module);
    const bad = [r.boutonEchauffement && "bouton de l'échauffement", r.attente && "échauffement en attente", r.nsp > 1 && `${r.nsp} « je ne sais pas »`, r.pave && "pavé", r.coquillage && "coquillage", r.ardoise && "ardoise", r.ermite && "bernard-l'ermite", r.notionAdditions && "notion des additions", r.moduleSeance !== module && `séance du module ${r.moduleSeance}`].filter(Boolean);
    if (bad.length) return bad;
  }
  return [];
}
// l'échauffement, au moment voulu, puis passé
async function auMoment(page, m) {
  await etape(page, "echauffement");
  if (m === "intro") { await page.waitForTimeout(T(200)); return passer(page); }
  await question(page);
  if (m === "question") return passer(page);
  if (m === "coche5s") return passer(page, { attendre5s: true });
  if (m === "tape") { await tapKey(page, String((await attendu(page)) % 10)); return passer(page); }
  if (m === "correction") { await repondre(page, false); await page.waitForTimeout(T(350)); return passer(page); }
  if (m === "aide") {
    // les premières questions d'une base neuve (le temps de base) n'ont pas de coquillage : on répond jusqu'à en avoir un
    for (let i = 0; i < 6 && !(await visible(page, ".bubble.help")); i++) { await repondre(page, true); await question(page); }
    if (await visible(page, ".bubble.help")) { await page.tap(".bubble.help", { force: true }); await page.waitForTimeout(T(500)); }
    return passer(page);
  }
}
let n = 0;
async function cas(nom, ex, chemin, m) {
  const { page, context, errors } = await open(chemin === "jouer" ? `&module=${ex.module}` : "");
  try {
    if (chemin === "choisir") {
      await entrer(page, ".choisir"); await page.waitForSelector(".choix-ex", { timeout: T(15000) });
      await entrer(page, `.choix-ex[data-key="${ex.id}"]`); await page.waitForSelector(".choix-tuile", { timeout: T(15000) });
      await entrer(page, '.choix-tuile[data-key="1"]');
      await auMoment(page, m);
    } else if (chemin === "jouer") {
      await entrer(page, ".play"); await auMoment(page, m);
    } else if (chemin === "pause") {
      // la séance proposée (ici les additions) ; pause pendant l'échauffement ; « choisir » ; l'exercice ; puis l'échauffement
      // de la nouvelle séance est passé au moment voulu (le chemin du défaut)
      await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&faits=5&questions=2&sansLecon&module=2"); await page.waitForFunction(() => window.__ready !== undefined);
      await entrer(page, ".play"); await etape(page, "echauffement", 2); await question(page);
      await page.tap(".session-home", { force: true }); await page.waitForTimeout(T(700));
      await entrer(page, ".choisir"); await page.waitForSelector(".choix-ex", { timeout: T(15000) });
      await entrer(page, `.choix-ex[data-key="${ex.id}"]`); await page.waitForSelector(".choix-tuile", { timeout: T(15000) });
      await entrer(page, '.choix-tuile[data-key="1"]');
      await etape(page, "echauffement", ex.module);
      check(await page.evaluate(() => document.querySelectorAll(".skip-warmup").length) === 1, `${nom} : un seul bouton « passer l'échauffement »`);
      await auMoment(page, m);
    }
    await etape(page, "notion", ex.module);
    const bad = await restes(page, ex.module);
    if (bad.length || n++ % 6 === 0) await page.screenshot({ path: join(OUT, `${nom.replace(/[^a-z0-9]+/gi, "-")}.png`) });
    check(!bad.length, `${nom} : rien de l'échauffement par-dessus l'exercice${bad.length ? ` (${bad.join(", ")})` : ""}`);
    check(!errors.length, `${nom} : aucune erreur dans la page${errors.length ? ` (${errors[0]})` : ""}`);
  } catch (e) {
    await page.screenshot({ path: join(OUT, `${nom.replace(/[^a-z0-9]+/gi, "-")}-erreur.png`) }).catch(() => {});
    check(false, `${nom} : ${e.message.split("\n")[0]}`);
  } finally { await context.close(); }
}

if (part("choisir")) for (const ex of EXOS) for (const m of COURT ? [MOMENTS[EXOS.indexOf(ex) % MOMENTS.length]] : MOMENTS) await cas(`choisir ${ex.id}, passé ${m}`, ex, "choisir", m);
if (part("jouer")) for (const ex of EXOS) await cas(`jouer ${ex.id}, passé question`, ex, "jouer", COURT ? "question" : "tape");
if (part("pause")) for (const ex of EXOS.filter((e) => e.module !== 2)) for (const m of COURT ? ["question"] : ["intro", "question", "correction"]) await cas(`pause puis choisir ${ex.id}, passé ${m}`, ex, "pause", m);

// LES AUTRES PASSAGES : notion du jour (additions) vers le défi, défi vers la récompense ; pause et reprise
if (part("etapes")) {
  const prep = async () => {
    const s = window.__app.store, now = Date.now(), DAY = 86400000;
    for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] });
    for (const [i, k] of ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"].entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); }
  };
  const { page, context, errors } = await open("&module=2&choix=2:1", prep);
  try {
    await entrer(page, ".play");
    // pause et reprise pendant l'échauffement : l'accueil en pause s'en va, le pavé revient
    await etape(page, "echauffement"); await question(page);
    await page.tap(".session-home", { force: true }); await page.waitForTimeout(T(600));
    check(await visible(page, ".play") && !(await visible(page, '.key[data-key="5"]')), "pause : l'accueil en pause, sans le pavé");
    await page.locator(".play").first().tap({ force: true }); await page.waitForTimeout(T(300));
    if (await visible(page, ".play")) { await page.locator(".play").first().tap({ force: true }); }
    await question(page);
    check(!(await visible(page, ".play")) && !(await visible(page, ".choisir")) && await visible(page, '.key[data-key="5"]'), "reprise : plus rien de l'accueil en pause, le pavé est là");
    // l'échauffement jusqu'au bout, puis la notion du jour des additions (deux questions)
    while (await page.evaluate(() => window.__app.session.progress.etape === "echauffement")) { if (await page.evaluate(() => { const f = window.__app.facts; return f?.resolve && !f.locked; })) await repondre(page, true); await page.waitForTimeout(T(250)); }
    await etape(page, "notion");
    check(await page.evaluate(() => !document.querySelector(".skip-warmup, .check-warmup")), "échauffement fini : son bouton est retiré");
    while (await page.evaluate(() => window.__app.session.progress.etape === "notion")) { if (await page.evaluate(() => { const f = window.__app.facts; return f?.resolve && !f.locked && !f.defi; })) await repondre(page, true); await page.waitForTimeout(T(250)); }
    await etape(page, "defi");
    await page.waitForTimeout(T(800));
    check(await page.evaluate(() => !window.__app.hermit && !window.__app.facts?.notion && ![...document.querySelectorAll(".bubble.help")].some((e) => e.checkVisibility({ visibilityProperty: true }))), "notion du jour vers le défi : ni bernard-l'ermite ni coquillage");
    await page.screenshot({ path: join(OUT, "etapes-1-defi.png") });
    await etape(page, "recompense", null, 120000); await page.waitForTimeout(T(1500));
    check(await page.evaluate(() => !document.querySelector(".defi-timer, .defi-row, .defi-drapeau") && ![...document.querySelectorAll(".key, .nsp, .slate")].some((e) => e.checkVisibility({ visibilityProperty: true }))), "défi vers la récompense : ni sablier, ni perles, ni pavé, ni ardoise");
    await page.screenshot({ path: join(OUT, "etapes-2-recompense.png") });
    check(!errors.length, `étapes : aucune erreur dans la page${errors.length ? ` (${errors[0]})` : ""}`);
  } catch (e) { await page.screenshot({ path: join(OUT, "etapes-erreur.png") }).catch(() => {}); check(false, `étapes : ${e.message.split("\n")[0]}`); }
  finally { await context.close(); }
}

await browser.close(); srv.close();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ntous les passages sont propres");
process.exitCode = fail.length ? 1 : 0;
