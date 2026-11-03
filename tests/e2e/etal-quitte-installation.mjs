// L'ÉTAL QUITTÉ PENDANT QU'IL S'INSTALLE (lot « Correctif : l'étal resté actif à l'accueil »). Défaut vu sur GitHub le 2 novembre
// 2026 (l'enfant imprévisible, version courte, graine 1 : « étal actif à l'accueil ; à l'accueil : etal-scene keep »), une fois,
// sur une demande de fusion qui ne touchait que la documentation. La cause : l'installation de la scène de l'étal
// (modules/etal/screen.js, `enter`) attend deux fois (un réglage lu, puis les images) ; la maison touchée pendant ces attentes
// ramenait à l'accueil, mais l'installation allait jusqu'au bout : la scène était posée sur l'accueil, active, et n'en partait
// qu'une fois ses images chargées (0,2 à 2 s sur l'ordinateur, davantage sur un processeur lent). Une course de vitesse : seule
// une maison touchée dans cette fenêtre la montre.
// Ce parcours force la course : les images de l'étal (et les données des voiliers, la même course) sont retardées, la maison est
// touchée à plusieurs moments de l'installation, et l'accueil est regardé toutes les 15 ms, du toucher jusqu'à bien après la fin
// du chargement : jamais l'étal (scène, décor, ou écran actif) sur l'accueil, jamais deux scènes, aucune phrase de l'étal après
// la maison, aucune erreur. Situations : une leçon de la monnaie du menu (L15, L18) ; l'étal de l'entraînement libre ; les voiliers
// de l'entraînement libre (première entrée) ; la notion du jour à l'étal mise en pause pendant l'installation, puis terminée par
// le parent ; et, pour vérifier que la pause n'arrête pas l'installation, la même pause suivie de « continuer » (la partie
// commence normalement) ; enfin, le portefeuille touché pendant l'installation (l'enfant imprévisible, images lentes : une erreur
// de la page). Échoue sur le code d'avant le correctif (RACINE_APP=copie de main).
//   node tests/e2e/etal-quitte-installation.mjs [--out dossier]
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : la course se joue entre le toucher de la maison et le chargement des images ; le parcours la force en retardant ces
// images par le réseau du navigateur de test, ce que le service worker de l'application installée court-circuiterait (il sert
// les images depuis son cache) ; chaque situation part d'une base neuve dans un navigateur neuf, et la vitesse de la voix ou le
// son ne changent rien à ce qu'il vérifie. L'application installée et la vraie voix sont éprouvées sur le banc Android
// (journee.mjs, enfant.mjs --android).)
import { chromium } from "./navigateur.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/etal-quitte-installation")); mkdirSync(OUT, { recursive: true });
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };

// dans la page : la surveillance de l'accueil, toutes les 15 ms ; chaque phrase dite, avec les fichiers qui l'ont demandée
const SURVEILLER = () => {
  const a = window.__app; window.__vu = []; window.__dit = []; window.__maisonT = null; window.__surv = true;
  const say = a.voice.say.bind(a.voice);
  a.voice.say = (t, o) => { const pile = (new Error().stack ?? "").split("\n").map((l) => /\/js\/([\w/.-]+\.js)/.exec(l)?.[1]).filter(Boolean); window.__dit.push({ t: performance.now(), texte: t, etal: pile.some((f) => /^modules\/etal\/|^lessons\/etal\.js/.test(f)) }); return say(t, o); };
  addEventListener("pointerdown", (e) => { if (e.target.closest?.(".session-home")) window.__maisonT ??= performance.now(); }, true);
  const tour = () => {
    if (!window.__surv) return;
    const mode = a.modeEcran(), scenes = document.querySelectorAll("#etal-scene").length, decor = !!document.querySelector("canvas.etal-decor");
    const etal = !!(a.etal?.actif || a.etalLecon?.actif), voiliers = !!(a.voiliers?.actif || document.querySelector("canvas.voiliers"));
    const pb = [];
    if (mode === null && !a.enPause && (etal || scenes || decor)) pb.push(`étal sur l'accueil (actif ${etal}, scène ${scenes}, décor ${decor})`);
    if (mode === null && !a.enPause && voiliers) pb.push("voiliers sur l'accueil");
    if (scenes > 1) pb.push(`${scenes} scènes de l'étal`);
    if (pb.length) window.__vu.push({ t: Math.round(performance.now()), pb });
    setTimeout(tour, 15);
  };
  tour();
};
const BILAN = () => {
  window.__surv = false; const m = window.__maisonT ?? 0, vu = window.__vu;
  return { vu: vu.length ? { n: vu.length, de: vu[0].t, a: vu.at(-1).t, pb: [...new Set(vu.flatMap((v) => v.pb))] } : null, ditEtal: window.__dit.filter((d) => d.etal && d.t > m).map((d) => d.texte), galets: !!document.querySelector(".galet") };
};

// une situation : une base neuve, un navigateur neuf ; `retard` : ce qui est retardé (et de combien)
async function situation(nom, { requete = "", retard = /assets\/etal\//, ms = 1500, preparer, jouer, apres = 4000 }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); });
  let retarder = false;
  await context.route(retard, async (r) => { if (retarder) await new Promise((ok) => setTimeout(ok, ms)); await r.continue().catch(() => {}); });
  const go = async () => { await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&sansLecon" + requete); await page.waitForFunction(() => window.__ready !== undefined); };
  await go();
  if (preparer) { await page.evaluate(preparer); await go(); }
  await page.evaluate(SURVEILLER);
  const r = await jouer(page, { retarder: () => { retarder = true; } });
  await page.waitForTimeout(ms + apres);
  const b = await page.evaluate(BILAN);
  await page.screenshot({ path: join(OUT, `${nom.replace(/[^a-z0-9]+/gi, "-")}.png`) });
  await context.close();
  return { ...b, errors, ...(r ?? {}) };
}
const deux = async (page, sel) => { await page.tap(sel, { force: true }); await page.waitForTimeout(450); if (await page.locator(sel).count()) await page.tap(sel, { force: true }).catch(() => {}); };
const maison = (page) => page.tap(".session-home", { force: true });
const rapport = (nom, r, { accueil = true } = {}) => {
  check(!r.vu, `${nom} : jamais l'étal ni les voiliers sur l'accueil${r.vu ? ` (vu ${r.vu.n} fois, de ${r.vu.de} à ${r.vu.a} ms : ${r.vu.pb.join(" ; ")})` : ""}`);
  if (accueil) check(r.galets, `${nom} : l'accueil est là`);
  check(!r.ditEtal.length, `${nom} : l'étal ne parle plus après la maison${r.ditEtal.length ? ` (${r.ditEtal.join(" | ")})` : ""}`);
  check(!r.errors.length, `${nom} : aucune erreur${r.errors.length ? ` (${r.errors.join(" | ")})` : ""}`);
};
// la séance du jour faite : l'accueil propose « Encore ! » (l'entraînement libre) ; datée de l'instant même (dix minutes plus tôt,
// elle tombait la veille quand le parcours tournait juste après minuit)
const SEANCE_FAITE = async () => { await window.__app.store.add("seances", { debut: Date.now() - 2000, fin: Date.now() - 1000, terminee: true, module: 1, questions: 20, justes: 18, etapes: [] }); };

// 1. une leçon de la monnaie, depuis le menu des leçons : la maison pendant le réglage lu (0 ms), pendant les images (200 à 1 400 ms)
for (const [id, t] of [["L15", 0], ["L15", 200], ["L15", 800], ["L18", 0], ["L18", 1400]]) {
  const r = await situation(`lecon-${id}-${t}`, { jouer: async (page, { retarder }) => {
    await deux(page, ".leconskey"); await page.waitForSelector(`.lecons-tuile[data-key="${id}"]`); await page.waitForTimeout(500);
    retarder(); await deux(page, `.lecons-tuile[data-key="${id}"]`);
    await page.waitForTimeout(t); await maison(page);
  } });
  rapport(`leçon ${id}, maison ${t} ms après le choix`, r);
}
// 2. l'étal de l'entraînement libre : la maison pendant l'installation
for (const t of [0, 300, 1200]) {
  const r = await situation(`libre-etal-${t}`, { preparer: SEANCE_FAITE, jouer: async (page, { retarder }) => {
    await deux(page, ".galet.again"); await page.waitForSelector('.choix-ex[data-key="etal"]'); await page.waitForTimeout(300);
    await deux(page, '.choix-ex[data-key="etal"]'); await page.waitForSelector('.choix-tuile[data-key="1"]'); await page.waitForTimeout(300);
    await deux(page, '.choix-tuile[data-key="1"]');
    retarder(); await page.waitForSelector(".cran-ok"); await page.waitForTimeout(300); await page.tap(".cran-ok", { force: true }); // (le sélecteur ne part jamais seul)
    await page.waitForFunction(() => !!window.__app.etal?.x, null, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(t);
    const installait = await page.evaluate(() => !!window.__app.etal?.x && !window.__app.etal.lampeB);
    await maison(page);
    return { installait };
  } });
  check(r.installait, `entraînement libre, l'étal, maison ${t} ms après le début de l'installation : elle s'installait encore`);
  rapport(`entraînement libre, l'étal, maison ${t} ms après le début de l'installation`, r);
}
// 3. les voiliers de l'entraînement libre, à leur première entrée (leurs données attendues avant la scène)
for (const t of [0, 600]) {
  const r = await situation(`libre-voiliers-${t}`, { preparer: SEANCE_FAITE, retard: /assets\/voiliers\/donnees\.json/, jouer: async (page, { retarder }) => {
    await deux(page, ".galet.again"); await page.waitForSelector('.choix-ex[data-key="voiliers"]'); await page.waitForTimeout(300);
    await deux(page, '.choix-ex[data-key="voiliers"]'); await page.waitForSelector('.choix-tuile[data-key="1"]'); await page.waitForTimeout(300);
    await deux(page, '.choix-tuile[data-key="1"]');
    retarder(); await page.waitForSelector(".cran-ok"); await page.waitForTimeout(300); await page.tap(".cran-ok", { force: true }); // (le sélecteur ne part jamais seul)
    await page.waitForTimeout(t); await maison(page);
  } });
  rapport(`entraînement libre, les voiliers, maison ${t} ms après le choix du cran`, r);
}
// 4. la notion du jour à l'étal : la pause pendant l'installation, puis « Terminer la séance » du parent (l'activité abandonnée)
const ouvrirParent = async (page) => {
  const b = await page.locator(".logo").last().boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(2300); await page.mouse.up();
  await page.waitForSelector(".pa-gate"); for (const d of "1234") await page.tap(`.pa-keys [data-key="${d}"]`); await page.waitForSelector(".pa-sheet");
};
{
  const r = await situation("seance-pause-parent", { requete: "&sans=echauffement&module=6", ms: 9000, apres: 3000,
    preparer: async () => { await window.__app.store.setSetting("codeParent", "1234"); },
    jouer: async (page, { retarder }) => {
      retarder(); await deux(page, ".play");
      await page.waitForFunction(() => !!window.__app.etal?.x, null, { timeout: 20000 });
      const t0 = Date.now(); await maison(page); await page.waitForTimeout(500);
      await ouvrirParent(page); await page.tap(".pa-pause button"); await page.tap(".pa-pause .pa-confirm .danger");
      await page.waitForSelector(".play:not(.keep)", { timeout: 10000 });
      const pendant = await page.evaluate(() => !!window.__app.etal?.x);
      return { pendantS: ((Date.now() - t0) / 1000).toFixed(1), pendant };
    } });
  check(!r.pendant, `notion du jour à l'étal, pause pendant l'installation puis « Terminer la séance » (${r.pendantS} s après) : la scène est retirée tout de suite`);
  rapport("notion du jour à l'étal, terminée par le parent pendant l'installation", r);
}
// 5. la même pause, puis « continuer » : l'installation n'est pas arrêtée par la pause, la partie commence
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let retarder = false;
  await context.route(/assets\/etal\//, async (r) => { if (retarder) await new Promise((ok) => setTimeout(ok, 2500)); await r.continue().catch(() => {}); });
  await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&sansLecon&sans=echauffement&module=6"); await page.waitForFunction(() => window.__ready !== undefined);
  retarder = true; await deux(page, ".play");
  await page.waitForFunction(() => !!window.__app.etal?.x, null, { timeout: 20000 });
  await maison(page); await page.waitForTimeout(900);
  await deux(page, ".play.keep");
  const attend = await page.waitForFunction(() => !!window.__app.etal?.attend, null, { timeout: 30000 }).then(() => true, () => false);
  await page.screenshot({ path: join(OUT, "seance-pause-continuer.png") });
  check(attend, "notion du jour à l'étal, pause pendant l'installation puis « continuer » : la partie commence (un achat attend l'enfant)");
  check(!errors.length, `pause puis « continuer » : aucune erreur${errors.length ? ` (${errors.join(" | ")})` : ""}`);
  await context.close();
}
// 6. (l'enfant imprévisible, images lentes, graine 70) le portefeuille touché pendant que la scène s'installe : posée avant ses
// images, la scène répondait au toucher, et le portefeuille s'animait sans ses images (« drawImage », erreur de la page)
for (const [quoi, aller] of [["leçon L15", async (page) => { await deux(page, ".leconskey"); await page.waitForSelector('.lecons-tuile[data-key="L15"]'); await page.waitForTimeout(500); return () => deux(page, '.lecons-tuile[data-key="L15"]'); }],
  ["notion du jour", async (page) => () => deux(page, ".play")]]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let retarder = false;
  await context.route(/assets\/etal\//, async (r) => { if (retarder) await new Promise((ok) => setTimeout(ok, 2500)); await r.continue().catch(() => {}); });
  await page.goto(url + "?nosw&voix=rapide&son=non&cran=conseille&sansLecon&sans=echauffement&module=6"); await page.waitForFunction(() => window.__ready !== undefined);
  const choisir = await aller(page); retarder = true; await choisir();
  await page.waitForFunction(() => !!document.querySelector("#etal-scene"), null, { timeout: 20000 });
  const pendant = await page.evaluate(() => !(window.__app.etalLecon ?? window.__app.etal)?.lampeB);
  // (avant ses images, la scène n'a pas encore placé le portefeuille : il est en haut à gauche, sous la maison ; on touche un
  // point où il est bien le premier sous le doigt, comme la graine 15 « à côté de la maison »)
  const pt = await page.evaluate(() => { const pf = document.querySelector("#etal-pf"), r = pf.getBoundingClientRect(); for (let y = r.y + 10; y < r.bottom; y += 20) for (let x = r.x + 10; x < r.right; x += 20) if (document.elementFromPoint(x, y) === pf) return [x, y]; return null; });
  check(!!pt, `${quoi} : le portefeuille est à portée du doigt pendant l'installation (${pt})`);
  for (let i = 0; i < 4 && pt; i++) { await page.touchscreen.tap(...pt); await page.waitForTimeout(150); }
  await page.waitForTimeout(4000);
  check(pendant, `${quoi} : le portefeuille touché pendant l'installation (la scène s'installait encore)`);
  check(!errors.length, `${quoi}, le portefeuille touché pendant l'installation : aucune erreur${errors.length ? ` (${errors.join(" | ")})` : ""}`);
  await context.close();
}
await browser.close(); srv.close();
console.log(`\n${fail.length ? `${fail.length} échec(s)` : "tout passe"}`);
process.exitCode = fail.length ? 1 : 0;
