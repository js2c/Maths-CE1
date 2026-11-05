// LA MASCOTTE REDIT LA CONSIGNE DE L'ÉCRAN VISIBLE (lot « Correctifs du 5 novembre », docs/LOTS.md, fiche 22, point 3 ; constat du
// parent du 5 novembre 2026 : au partage manipulé des problèmes, la mascotte touchée redisait « Choisis ton niveau… »). Le parcours de
// non-régression : il TOUCHE LA MASCOTTE À CHAQUE PHASE (et la petite tête qui la remplace dans le récif) et vérifie que ce qu'elle
// redit est la consigne de l'écran qu'on voit.
//
// L'ORACLE, le même partout : la page note chaque changement d'écran (une « signature » : l'écran, l'étape de la séance, la question en
// cours, la phase d'un problème — l'histoire, le partage, la question —, la leçon, l'étape de la récompense, la carte ouverte, la
// créature choisie dans la boutique…) et chaque consigne posée (`voice.instruction`). Ce que la mascotte redit doit avoir été posé
// APRÈS le dernier changement d'écran (à 0,6 s près : la consigne est posée en même temps que l'écran se dessine) : une consigne
// posée avant appartient à l'écran d'avant, c'est le défaut du constat. Dans l'accueil en pause, elle redit la consigne de la pause.
//
// Les phases : l'accueil ; « choisir » (les exercices, les niveaux) ; le menu des leçons, une leçon, sa fin, la table d'addition ; une
// séance « jouer » complète (la bienvenue, le sélecteur, l'échauffement, la notion du jour avec un exemple guidé, la pause, la
// récompense, « à demain ») ; chaque exercice (additions, calcul rapide, voiliers, multiplication, étal, problèmes : l'histoire, le
// partage manipulé, la question, la comparaison) et le problème du jour ; le défi record ; le récif (la petite tête), une carte, la
// boutique, une créature choisie, l'album ; l'entraînement libre (« Encore ! »).
// Le tableau de chaque toucher : tests/e2e/out/consignes-mascotte/TOUCHERS.md. Échoue si une consigne est périmée ou si la page a
// une erreur.
//   node tests/e2e/consignes-mascotte.mjs [--seul menus|seance|exercices|defi|recif|encore]
// BANC ANDROID, raccourcis : voix rapide, sans service worker, son coupé
// (raison : ce parcours vérifie quelle phrase la mascotte redit à chaque phase, dans une trentaine de situations, chacune sur une base
// neuve : à la vitesse réelle de la voix il durerait plusieurs fois plus longtemps ; le son et l'application installée ne changent rien
// à ce qu'il vérifie. La vraie voix et l'application installée sont éprouvées par journee.mjs, enfant.mjs --android, installation.mjs.)
import { chromium } from "./navigateur.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { serve } from "../serve.mjs";
import { recifOuvert, toucherCreature, ilYaSemaines } from "./recif-commun.mjs";
import { REPONDRE, ATTEND } from "./jeu.mjs";

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = resolve(opt("--out", "tests/e2e/out/consignes-mascotte")), SEUL = opt("--seul", null); mkdirSync(OUT, { recursive: true });
const T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url), "utf8"));
const { srv, url } = await serve(0);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const fail = [], lignes = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${msg}`); if (!ok) fail.push(msg); };
const BASE = "?nosw&voix=rapide&son=non&sansReprise";
const TOL = 600;

// ---------------------------------------------------------------- l'instrumentation de la page
// (posée après chaque chargement) : les consignes posées, les phrases dites, les changements d'écran
const INSTRUMENTER = () => {
  const a = window.__app, v = a.voice;
  if (window.__consignes) return;
  let val = v.instruction; window.__consignes = [{ t: performance.now(), x: val }];
  // (l'écran est aussi relevé à chaque consigne posée, avant elle : quand la page est occupée, les images se font attendre et le
  // changement d'écran, relevé à chaque image, arriverait après la consigne qu'il a posée)
  Object.defineProperty(v, "instruction", { configurable: true, get: () => val, set: (x) => { window.__relever?.(); window.__consignes.push({ t: performance.now(), x }); val = x; } });
  window.__dit = []; const say = v.say.bind(v); v.say = (t, o) => { window.__dit.push({ t: performance.now(), x: t }); return say(t, o); };
  // (le moment où la mascotte touchée demande de redire : la phrase peut partir un peu plus tard, quand la voix était retenue)
  window.__ptr = []; for (const ty of ["pointerdown", "pointerup", "pointercancel"]) document.addEventListener(ty, (e) => window.__ptr.push([Math.round(performance.now()), ty, String(e.target.className || e.target.tagName).slice(0, 30)]), true);
  window.__redire = []; const rp = v.replay.bind(v); v.replay = () => { window.__redire.push({ t: performance.now(), x: v.instruction }); return rp(); };
  const ids = new WeakMap(); let n = 0; const id = (o) => (o ? (ids.has(o) || ids.set(o, ++n), ids.get(o)) : 0);
  const vis = (s) => [...document.querySelectorAll(s)].some((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true }));
  window.__signature = () => {
    const q = a.facts?.q ?? a.screen?.q ?? (a.voiliers?.actif ? a.voiliers.q : null) ?? (a.etal?.actif ? a.etal.q : null), p = a.prob;
    const phaseProb = a.facts?.q?.module === 7 ? (p?.occupe ? "partage" : p?.lit >= 0 ? "histoire" : "question") : "";
    // (pas le mode de main.js : il change aussi sans que l'écran change, entre la fin d'une leçon et son écran de fin)
    const lecon = !!(a.lessons?.keys || a.lessons?.p2?.keys || a.lessons?.p6?.keys || a.lessons?.p7?.keys || a.lessonCancel);
    return JSON.stringify([a.session?.progress?.etape ?? "", !!a.enPause, !!a.reef?.open, !!a.boutique?.open, !!a.album?.open, a.boutique?.sel?.carte?.id ?? "",
      // (pendant le défi, les questions défilent sans consigne chacune : la consigne est l'explication du défi)
      lecon ? "leçon" : a.challenge ? "défi" : id(q), phaseProb, lecon, ...[".galet", ".cran", ".choix-ex", ".choix-tuile", ".lecons-tuile", ".lecons-atoi", ".table-grille", ".hud.tally", ".shelltap", ".card", ".moon", ".probleme-objet"].map(vis)]);
  };
  // (un écran vide, de passage : rien à l'écran que le lagon, le temps qu'une étoile vole au compteur entre la fin d'une leçon et son
  // écran de fin ; la mascotte y redit la dernière phrase de ce qui vient de finir : il n'est pas jugé)
  window.__vide = () => { const s = JSON.parse(window.__signature()); return !s.slice(1).some((x) => x && x !== "0" && x !== 0) && !s[0]; };
  // (la clé de l'oracle : la signature sans la phase d'un problème, qui change sans que l'écran change : la consigne d'un problème est
  // posée au début de son histoire et vaut pour le partage et la question)
  const cle = (s) => { const x = JSON.parse(s); x[7] = ""; x[x.length - 1] = false; return JSON.stringify(x); }; // (la phase, et les objets du partage)
  window.__changements = [{ t: performance.now(), s: window.__signature() }]; window.__cles = [{ t: performance.now(), s: cle(window.__signature()) }];
  window.__relever = () => { try { const s = window.__signature(); if (s !== window.__changements.at(-1).s) window.__changements.push({ t: performance.now(), s }); const k = cle(s); if (k !== window.__cles.at(-1).s) window.__cles.push({ t: performance.now(), s: k }); } catch { /* écran en cours de construction */ } };
  const suivre = () => { window.__relever(); requestAnimationFrame(suivre); };
  requestAnimationFrame(suivre);
};
// l'écran, en quelques mots (pour le tableau)
const DECRIRE = () => { const a = window.__app; return [a.modeEcran?.() ?? "accueil", a.session?.progress?.etape, a.enPause && "en pause", a.reef?.open && "récif", a.boutique?.open && "boutique", a.album?.open && "album", a.facts?.q?.module === 7 && `problème (${a.prob?.occupe ? "partage" : a.prob?.lit >= 0 ? "histoire" : "question"})`, a.facts?.q && a.facts.q.module !== 7 && `question du module ${a.facts.q.module ?? 2}`, a.screen?.q && "question de la ligne", a.voiliers?.actif && a.voiliers.q && "un bateau", a.etal?.actif && a.etal.q && "l'étal", document.querySelector(".card") && "une carte", document.querySelector(".hud.tally") && "le bilan", document.querySelector(".moon") && "à demain", document.querySelector(".cran") && "le sélecteur", document.querySelector(".choix-tuile") ? "les niveaux" : document.querySelector(".choix-ex") && "les exercices", document.querySelector(".lecons-atoi") ? "fin de leçon" : document.querySelector(".lecons-tuile") && "les leçons", document.querySelector(".table-grille") && "la table", a.lessonCancel && "une leçon"].filter(Boolean).join(" · "); };

async function ouvrir(q = "", prep = null) {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }), page = await context.newPage(), errors = [];
  page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url + BASE); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
  if (prep) await page.evaluate(prep.f, prep.arg);
  await page.goto(url + BASE + q); await page.waitForFunction(() => window.__ready !== undefined, null, { timeout: 60000 });
  await page.evaluate(INSTRUMENTER);
  return { context, page, errors };
}
const tap = async (page, sel) => { const b = await page.locator(sel).first().boundingBox(); if (!b) throw new Error(`introuvable : ${sel}`); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); };
const visible = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].some((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true })), sel);
const attendreSel = (page, sel, ms = 30000) => page.waitForFunction((s) => [...document.querySelectorAll(s)].some((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true })), sel, { timeout: ms });

// TOUCHER LA MASCOTTE (ou sa petite tête, dans le récif) et juger ce qu'elle redit
async function sonder(page, scenario) {
  const cible = (await visible(page, ".mascotte-tap")) ? ".mascotte-tap" : (await visible(page, ".speaker")) ? ".speaker" : null;
  if (!cible) return null;
  // (un point de la mascotte qui n'est couvert par rien : dans l'étal, le portefeuille ouvert et ses pièces passent devant le bas de sa
  // tête ; l'enfant touche ce qu'il voit de la mascotte)
  const pt = await page.evaluate((sel) => {
    const e = document.querySelector(sel), b = e.getBoundingClientRect();
    for (const [u, v] of [[0.5, 0.35], [0.5, 0.2], [0.35, 0.3], [0.65, 0.3], [0.5, 0.5], [0.5, 0.7]]) { const x = b.x + u * b.width, y = b.y + v * b.height; if (document.elementFromPoint(x, y) === e) return [x, y]; }
    return null;
  }, cible);
  if (!pt) { lignes.push({ scenario, ecran: await page.evaluate(DECRIRE), dit: "(la mascotte est couverte : pas touchée)", ok: true, note: "" }); return null; }
  const t0 = await page.evaluate(() => performance.now());
  await page.touchscreen.tap(pt[0], pt[1]);
  // (le toucher n'est traité qu'une fois la page libre : pendant que l'étal installe sa scène, jusqu'à 1,3 s plus tard ; la référence
  // est le moment où la mascotte reçoit le toucher et demande de redire)
  await page.waitForFunction((t0) => window.__redire.some((d) => d.t >= t0), t0, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(150);
  const r = await page.evaluate(({ t0: tTap, TOL }) => {
    const t0 = window.__redire.find((d) => d.t >= tTap)?.t ?? tTap;
    const ch = window.__cles.filter((c) => c.t <= t0).at(-1), a = (t) => window.__consignes.filter((c) => c.t <= t).at(-1);
    // (ce que la mascotte redit : la phrase dite juste après le toucher, qui est la consigne de ce moment ; une leçon qui enchaîne
    // peut poser la phrase suivante au même instant : c'est alors elle qui est redite)
    const rd = window.__redire.find((d) => d.t >= t0 && d.t < t0 + 1);
    const dits = rd ? [{ t: rd.t, x: rd.x }] : window.__dit.filter((d) => d.t >= t0 && d.t < t0 + 340), dit = dits.find((d) => d.x === a(d.t + 0.01)?.x) ?? dits[0], cs = a((dit?.t ?? t0) + 0.01);
    return { ecran: ch?.s, depuis: Math.round(t0 - ch.t), age: Math.round(t0 - cs.t), consigne: cs.x, posee: cs.t >= ch.t - TOL, dit: dit?.x ?? null, pause: !!window.__app.enPause && !window.__app.reef?.open && !window.__app.boutique?.open && !window.__app.album?.open };
  }, { t0, TOL });
  const desc = await page.evaluate(DECRIRE);
  const ok = r.pause ? r.dit === T.pauseConsigne : !!r.dit && r.posee && r.dit === r.consigne;
  if (!ok) console.log("     (détail)", JSON.stringify(await page.evaluate((t0) => ({ dits: window.__dit.filter((d) => d.t > t0 - 3000).map((d) => [Math.round(d.t - t0), d.x.slice(0, 50)]), consignes: window.__consignes.filter((c) => c.t > t0 - 3000).map((c) => [Math.round(c.t - t0), String(c.x).slice(0, 50)]), cles: window.__cles.filter((c) => c.t > t0 - 3000).map((c) => [Math.round(c.t - t0), c.s.slice(0, 40)]), ptr: window.__ptr.filter((p) => p[0] > t0 - 500).map((p) => [Math.round(p[0] - t0), p[1], p[2]]), redire: window.__redire.filter((d) => d.t > t0 - 500).map((d) => Math.round(d.t - t0)), pause: window.__app.voice.paused, parle: window.__app.voice.speaking }), t0)));
  lignes.push({ scenario, ecran: desc, dit: r.dit, ok, note: r.pause ? "pause" : r.posee ? "" : `consigne posée ${((r.age - r.depuis) / 1000).toFixed(1)} s avant l'écran` });
  check(ok, `${scenario} · ${desc} : la mascotte redit « ${(r.dit ?? "(rien)").slice(0, 70)} »${ok ? "" : ` — ${r.pause ? "attendu : la consigne de la pause" : !r.dit ? "rien" : r.posee ? `pas la consigne (« ${String(r.consigne).slice(0, 60)} »)` : "consigne de l'écran précédent"}`}`);
  return r;
}

// SUIVRE LA SÉANCE jusqu'à `fin` : à chaque écran nouveau, resté 0,7 s, la mascotte est touchée ; une question qui attend est répondue
// (juste) une fois la mascotte touchée ; le sélecteur validé, les coquillages ouverts, les cartes rangées
async function suivre(page, scenario, fin, { ms = 240000, pendant = null, sansFin = false } = {}) {
  const t1 = Date.now(), sondes = new Set();
  while (Date.now() - t1 < ms) {
    if (await page.evaluate(fin).catch(() => false)) return true;
    const [sig, stable, attend] = await page.evaluate(() => { const c = window.__changements.at(-1); return [c.s, performance.now() - c.t, false]; });
    if (!sondes.has(sig) && stable > 700) { sondes.add(sig); if (!(await page.evaluate(() => window.__vide()))) await sonder(page, scenario); if (pendant) await pendant(sig); continue; }
    if (sondes.has(sig)) {
      if (await page.evaluate(ATTEND)) { await page.evaluate(REPONDRE, true); await page.waitForTimeout(600); continue; }
      if (await visible(page, ".cran-ok")) { await tap(page, ".cran-ok").catch(() => {}); await page.waitForTimeout(500); continue; }
      if (await visible(page, ".shelltap")) { await tap(page, ".shelltap").catch(() => {}); await page.waitForTimeout(800); continue; }
      if (await visible(page, ".card") && await visible(page, ".check")) { await tap(page, ".check:not(.cran-ok)").catch(() => {}); await page.waitForTimeout(600); continue; }
    }
    await page.waitForTimeout(200);
  }
  if (!sansFin) check(false, `${scenario} : la séance n'est pas arrivée au bout en ${ms / 1000} s`);
  return false;
}
const fini = async (nom, { context, errors }) => { check(!errors.length, `${nom} : aucune erreur dans la page${errors.length ? ` (${errors[0]})` : ""}`); await context.close(); };

// ---------------------------------------------------------------- 1. l'accueil, « choisir », les leçons
if (!SEUL || SEUL === "menus") {
  const s = await ouvrir(), { page } = s, N = "menus";
  await page.waitForTimeout(2500); await sonder(page, N);
  await tap(page, ".galet.choisir"); await attendreSel(page, ".choix-ex"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, ".choix-ex"); await page.waitForTimeout(300); await tap(page, ".choix-ex"); await attendreSel(page, ".choix-tuile"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, ".homekey"); await attendreSel(page, ".galet.leconskey"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, ".galet.leconskey"); await attendreSel(page, ".lecons-tuile"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, '.lecons-tuile[data-key="L1"]'); await page.waitForTimeout(300); await tap(page, '.lecons-tuile[data-key="L1"]');
  await suivre(page, N, () => !!document.querySelector(".lecons-atoi"), { ms: 180000 });
  await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, ".lecons-maison"); await attendreSel(page, ".galet.leconskey"); await page.waitForTimeout(700);
  await tap(page, ".galet.leconskey"); await attendreSel(page, ".lecons-tuile"); await page.waitForTimeout(700);
  const table = await page.evaluate(() => [...document.querySelectorAll(".lecons-tuile")].map((e) => e.dataset.key).find((k) => /table|addition/.test(k ?? "")));
  if (table) { await tap(page, `.lecons-tuile[data-key="${table}"]`); await page.waitForTimeout(300); await tap(page, `.lecons-tuile[data-key="${table}"]`); await attendreSel(page, ".table-grille"); await page.waitForTimeout(900); await sonder(page, N); }
  else check(false, `${N} : la tuile de la table d'addition est introuvable`);
  await fini(N, s);
}

// ---------------------------------------------------------------- 2. une séance « jouer » : bienvenue, sélecteur, échauffement, notion
// du jour (un exemple guidé), la pause, la récompense, « à demain »
if (!SEUL || SEUL === "seance") {
  const s = await ouvrir("&module=1&faits=2&questions=2&guides=1&sans=probleme&sansLecon"), { page } = s, N = "séance";
  let pause = false;
  await page.waitForTimeout(1500); await tap(page, ".galet.play");
  await suivre(page, N, () => !!document.querySelector(".moon"), { pendant: async () => {
    // la première question de la notion du jour : la maison, la pause, la mascotte touchée, puis « continuer »
    if (pause || !(await page.evaluate(() => window.__app.session?.progress?.etape === "notion" && !!window.__app.screen?.q && !window.__app.screen.q.guide && !window.__app.screen.locked))) return;
    pause = true;
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".session-home")).visibility === "visible", null, { timeout: 10000 });
    await tap(page, ".session-home"); await attendreSel(page, ".keep.play"); await page.waitForTimeout(800); await sonder(page, `${N} (pause)`);
    await tap(page, ".keep.play"); await page.waitForTimeout(400); if (await page.evaluate(() => window.__app.enPause)) await tap(page, ".keep.play"); await page.waitForTimeout(800);
  } });
  check(pause, `${N} : la pause a été essayée`);
  await page.waitForTimeout(1200); await sonder(page, N);
  await fini(N, s);
}

// ---------------------------------------------------------------- 3. chaque exercice, et le problème du jour
if (!SEUL || SEUL === "exercices") {
  const EX = [["additions", "2:1"], ["calcul rapide", "3:1"], ["voiliers", "4:1"], ["multiplication", "5:1"], ["étal", "6:1"], ["problèmes, niveau 1", "7:1"], ["problèmes, le partage", "7:3&enonce=par-v-01"], ["problèmes, la comparaison", "7:5"]];
  for (const [nom, ch] of EX.filter(([n]) => !opt("--ex", null) || n.startsWith(opt("--ex")))) {
    const s = await ouvrir(`&choix=${ch}&cran=conseille&sans=echauffement,probleme&questions=2&guides=1`), { page } = s;
    await page.waitForTimeout(1200); await tap(page, ".galet.play");
    await suivre(page, nom, () => window.__app.session?.progress?.etape === "recompense", { ms: 300000 });
    await fini(nom, s);
  }
  // le problème du jour, dans une séance de la ligne graduée
  const s = await ouvrir("&module=1&cran=conseille&sans=echauffement&questions=1&guides=0&sansLecon"), { page } = s, N = "problème du jour";
  await page.waitForTimeout(1200); await tap(page, ".galet.play");
  await suivre(page, N, () => window.__app.session?.progress?.etape === "recompense", { ms: 300000 });
  await fini(N, s);
}

// ---------------------------------------------------------------- 4. le défi record (des séances passées et des faits bien sus)
if (!SEUL || SEUL === "defi") {
  const prep = { arg: 86400000, f: async (DAY) => {
    const s = window.__app.store, now = Date.now();
    for (let i = 0; i < 5; i++) await s.add("seances", { debut: now - (10 - i) * DAY, fin: now - (10 - i) * DAY + 600000, terminee: true, module: 1 + (i % 2), questions: 30, justes: 25, etapes: [] });
    for (const [i, k] of ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1", "1+2", "4+4"].entries()) { const [a, b] = k.split("+").map(Number); await s.put("faits", { fait: k, a, b, boite: 3 + (i % 3), prochain: now + 9 * DAY, historique: [{ t: now - DAY, juste: true, ms: 2000 }], introduit: now - 20 * DAY }); }
  } };
  const s = await ouvrir("&cran=conseille&sans=echauffement,notion,probleme", prep), { page } = s, N = "défi";
  await page.waitForTimeout(1200); await tap(page, ".galet.play");
  await page.waitForFunction(() => !!window.__app.challenge, null, { timeout: 60000 }).catch(() => check(false, `${N} : le défi n'a pas commencé`));
  await suivre(page, N, () => window.__app.session?.progress?.etape === "recompense", { ms: 180000 });
  await fini(N, s);
}

// ---------------------------------------------------------------- 5. le récif (la petite tête), une carte, la boutique, l'album
if (!SEUL || SEUL === "recif") {
  const prep = { arg: ilYaSemaines(3), f: async (debut) => {
    const a = window.__app, s = a.store, lagon = a.cartes.cartes.filter((c) => c.zone === "lagon" && c.rarete === "commune").map((c) => c.id);
    await s.put("recompenses", { id: "cartes", cartes: Object.fromEntries(lagon.slice(0, 4).map((id) => [id, { n: 1, premiere: debut, brillante: false }])) });
    await s.put("recompenses", { id: "etoiles", total: 300, cumul: 600, dorees: 0, doreesDepensees: 0, arcEnCiel: 1, arcDepensees: 1, arcBrillees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 });
    await s.put("recompenses", { id: "quota", date: debut, cartes: 0 });
  } };
  const s = await ouvrir("", prep), { page } = s, N = "récif";
  await page.waitForTimeout(1500); await tap(page, ".galet.reefkey");
  const viv = await recifOuvert(page); await page.waitForTimeout(600); await sonder(page, N);
  await toucherCreature(page, viv[0]); await attendreSel(page, ".card"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, ".check"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, ".boutique-cle"); await attendreSel(page, ".boutique-tuile"); await page.waitForTimeout(1500); await sonder(page, N);
  await tap(page, ".boutique-tuile"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, ".boutique-retour"); await recifOuvert(page); await page.waitForTimeout(800);
  await tap(page, ".albumkey"); await page.waitForFunction(() => window.__app.album?.open, null, { timeout: 20000 }); await page.waitForTimeout(1200);
  // (dans l'album, ni la mascotte ni sa tête ne se touchent : l'album est par-dessus)
  if (await sonder(page, N) === null) lignes.push({ scenario: N, ecran: "album", dit: "(la mascotte n'est pas à toucher)", ok: true, note: "" });
  await fini(N, s);
}

// ---------------------------------------------------------------- 6. l'entraînement libre (« Encore ! »)
if (!SEUL || SEUL === "encore") {
  const prep = { arg: null, f: async () => { const s = window.__app.store, now = Date.now(); await s.add("seances", { debut: now - 700000, fin: now - 60000, terminee: true, module: 1, questions: 20, justes: 18, etapes: [] }); } };
  const s = await ouvrir("&sans=probleme&questions=2&guides=0&sansLecon", prep), { page } = s, N = "entraînement libre";
  await page.waitForTimeout(1500); await sonder(page, N);
  await tap(page, ".galet.again"); await attendreSel(page, ".choix-ex"); await page.waitForTimeout(900); await sonder(page, N);
  await tap(page, '.choix-ex[data-key="additions"]'); await page.waitForTimeout(300); await tap(page, '.choix-ex[data-key="additions"]'); await attendreSel(page, ".choix-tuile"); await page.waitForTimeout(900);
  await tap(page, ".choix-tuile"); await page.waitForTimeout(300); await tap(page, ".choix-tuile");
  let n = 0;
  await suivre(page, N, () => false, { ms: 45000, sansFin: true, pendant: async () => { n++; } }); // (l'entraînement libre n'a pas de fin : 45 s suffisent)
  check(n >= 3, `${N} : ${n} écrans essayés`);
  await fini(N, s);
}

// ---------------------------------------------------------------- le tableau
const md = ["# La mascotte touchée à chaque phase", "", `Parcours \`tests/e2e/consignes-mascotte.mjs\` (lot « Correctifs du 5 novembre », point 3), ${new Date().toISOString().slice(0, 10)}. ${lignes.length} touchers, ${lignes.filter((l) => !l.ok).length} en défaut.`, "", "| Situation | Écran | Ce que la mascotte redit | Bon ? |", "| --- | --- | --- | --- |",
  ...lignes.map((l) => `| ${l.scenario} | ${l.ecran || "—"} | ${(l.dit ?? "(rien)").replace(/\|/g, "/").slice(0, 140)} | ${l.ok ? "oui" : `**non** (${l.note})`} |`)];
writeFileSync(join(OUT, "TOUCHERS.md"), md.join("\n") + "\n");
console.log(`\n${lignes.length} touchers ; tableau : ${join(OUT, "TOUCHERS.md")}`);
await browser.close(); srv.close();
if (fail.length) { console.log(`\n${fail.length} ÉCHEC(S)`); process.exitCode = 1; }
