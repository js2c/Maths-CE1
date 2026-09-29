// RECETTE : simulation de séances avec les modules réels de l'application (hors navigateur). Profils d'enfant
// hypothétiques (PROFILS) ; durées par question estimées (T), à caler sur tests/e2e/recette-durees.mjs.
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../app/js/engine/store.js";
import { rng } from "../app/js/engine/ocean.js";
import { makeEstimate, makeJump, makePlace, makeRead, makeWrite } from "../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../app/js/modules/numberline/runner.js";
import { Session } from "../app/js/session/session.js";
import { runNotion } from "../app/js/session/notion.js";
import { Rewards, goldenStar } from "../app/js/session/rewards.js";
import { drawSurprise, previousSession } from "../app/js/session/surprise.js";
import { Warmup } from "../app/js/modules/facts/warmup.js";
import { runWarmup } from "../app/js/modules/facts/screen.js";
import { expected, ruleFacts, startOfDay } from "../app/js/modules/facts/facts.js";
import { Module2Runner } from "../app/js/modules/facts/runner.js";
import { calcMastery, Module3Runner } from "../app/js/modules/calc/runner.js";
import { runChallenge } from "../app/js/modules/facts/challenge.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../app/content/${f}`, import.meta.url)));
const seance = load("seance.json"), module1 = load("module1.json"), module2 = load("module2.json"), module3 = load("module3.json"), cartes0 = load("cartes.json"), calendrier = load("calendrier.json");
// les zones 3 et 4 « prêtes » (illustrations et anecdotes fictives) pour vérifier le rythme des cartes sur l'année
const pretes = (c) => ({ ...c, cartes: c.cartes.map((x) => ({ ...x, illustration: x.illustration ?? `fictif/${x.id}.webp`, anecdote: x.anecdote ?? "Anecdote fictive." })) });
const gen = (cfg, r, o = {}) => (o.format === "ecrire" ? makeWrite(cfg, r, o) : o.format === "sauter" ? makeJump(cfg, r) : o.format === "placer" ? makePlace(cfg, r, o) : o.format === "estimer" ? makeEstimate(cfg, r, o) : makeRead(cfg, r, o));
const ERR = { 1: "E1", 2: "E1", 3: "E1", 4: "E3", 5: "E2", 6: "E5", 7: "E2", 8: "autre", 9: "E6", 10: "E6", 11: "E3", 12: "E6", 13: "autre" };

// profils : p(niveau, essais) = probabilité de réussir ; faits : p et temps ; nsp : part des échecs donnés par
// « je ne sais pas » ; trou : probabilité de réussir un fait sous une forme à trou, relative à la forme directe ;
// cran : le cran que l'enfant choisit toujours au sélecteur de difficulté (lot 2)
// (lot 2, étape 8 : niveaux 9 à 13, nombres jusqu'à 1 000 : hypothèses du même ordre que les niveaux 5 à 8)
// lot 3, étape 4 : calcul(n) : probabilité de réussir un calcul du niveau n du calcul rapide (hypothèse), qui progresse avec
// les essais comme la ligne ; calculMs : temps d'un calcul juste
const reel = { calcul: (n) => [0, 0.9, 0.8, 0.7, 0.8, 0.7, 0.55, 0.45, 0.6, 0.4][n], calculMs: 6000, ligne: (n) => [0, 0.95, 0.9, 0.85, 0.55, 0.45, 0.45, 0.4, 0.45, 0.5, 0.45, 0.4, 0.5, 0.45][n], apprend: 0.006, fait: 0.9, faitMs: 5000, baseMs: 3500, nsp: 0.3, trou: 0.85 };
export const PROFILS = {
  sait: { nom: "sait déjà (rapide)", calcul: (n) => (n <= 5 ? 0.95 : 0.88), calculMs: 4000, ligne: (n) => (n <= 5 ? 0.97 : 0.85), apprend: 0.004, fait: 0.97, faitMs: 3500, baseMs: 3000, nsp: 0.2, trou: 0.95 },
  reel: { nom: "profil de l'évaluation (ligne faible au-delà de 20, faits en partie sus)", ...reel },
  diff: { nom: "en difficulté", calcul: (n) => [0, 0.8, 0.65, 0.55, 0.65, 0.55, 0.4, 0.3, 0.45, 0.3][n], calculMs: 9000, ligne: (n) => [0, 0.85, 0.75, 0.7, 0.45, 0.35, 0.35, 0.3, 0.35, 0.4, 0.35, 0.3, 0.4, 0.35][n], apprend: 0.004, fait: 0.75, faitMs: 8000, baseMs: 4000, nsp: 0.4, trou: 0.75 },
  tresdur: { nom: "profil de l'évaluation, choisit toujours « très dur »", ...reel, cran: "tresdur" },
  facile: { nom: "profil de l'évaluation, choisit toujours « plus facile »", ...reel, cran: "facile" },
};
const T = { calc: 9000, calcFaux: 24000, calcGuide: 26000, phrase: 3000, defiEnPlus: 500, chauffe: 7000, chauffeFaux: 9000, notion: 15000, notionFaux: 30000, guide: 30000, lecon: 75000, add: 8000, addFaux: 16000, addGuide: 16000 };

// lot 3 : `choix` ({ module: 1, niveau } ou { module: 2, famille }) : l'enfant choisit toujours cet exercice (écran
// « choisir ») ; `cran` : le cran qu'elle choisit (remplace celui du profil). Hypothèse du lot 3 (docs/SPEC-LOT3.md,
// section 3) : au niveau choisi, un cran change la probabilité de réussir la ligne de EFFET_CRAN (moins de nombres
// écrits, tolérance plus serrée…) ; aux additions, les formes à trou jouent déjà (profil.trou) et l'aide d'emblée du
// cran « plus facile » aussi.
export const EFFET_CRAN = { facile: 0.1, conseille: 0, dur: -0.08, tresdur: -0.15 };
// `horloge` (lot 3, tools/sauvegarde-test.mjs) : pendant la simulation, Date.now() donne l'heure simulée (le moteur la
// prend à plusieurs endroits : réponses, obtention d'un niveau…) ; le résultat garde la base (`out.store`)
export async function simulate({ profil, jours, seed = 1, zonesPretes = true, choix = null, cran = null, horloge = false }) {
  const realNow = Date.now;
  try { return await simulate0({ profil, jours, seed, zonesPretes, choix, cran, horloge }); } finally { Date.now = realNow; }
}
async function simulate0({ profil, jours, seed, zonesPretes, choix, cran, horloge }) {
  const cartes = zonesPretes ? pretes(cartes0) : cartes0;
  const P = { ...PROFILS[profil], ...(cran ? { cran } : {}) }, R = rng(seed), store = await Store.open(new IDBFactory()), rewards = await new Rewards(store, cartes, calendrier).load(jours[0].getTime() + 18 * 3600000);
  let t = 0; const clock = () => t, add = (ms) => { t += ms; };
  if (horloge) Date.now = () => Math.round(t);
  const essais = {}; const out = [];
  for (const [i, day] of jours.entries()) {
    t = day.getTime() + 18 * 3600000;
    const log = { n: i + 1, date: day.toLocaleDateString("fr-FR"), faits: [], ligne: [], lecons: [], nsp: 0, descentes: 0, nouveaux: 0 };
    const warmScreen = { show() {}, keys() {}, leave() {}, ask: async (q) => {
      const trou = q.forme && q.forme !== "directe", ok = q.base ? true : R() < P.fait * (trou ? P.trou : 1); const ms = q.base ? P.baseMs + R() * 1000 : ok ? P.faitMs * (0.7 + R() * 0.6) : 9000;
      const nsp = !ok && R() < P.nsp; if (nsp) log.nsp++;
      add(ok ? T.chauffe : T.chauffeFaux); if (!q.base) log.faits.push(`${trou ? (q.forme === "trouDroite" ? `${q.a}+?` : `?+${q.b}`) : `${q.a}+${q.b}`}${ok ? "" : nsp ? "?" : "✗"}${q.nouveau && !q.anticipe && !q.revient ? "*" : ""}`);
      if (q.nouveau && !q.anticipe && !q.revient) log.nouveaux++;
      return { value: ok ? expected(q) : nsp ? null : expected(q) + 1, ms, listens: 1, aide: false, nsp }; } };
    const lineScreen = { generate: gen, ask: async (q, cfg, o) => {
      const niv = cfg.niveau ?? cfg.id ?? 0; essais[niv] = (essais[niv] ?? 0) + 1;
      const p = Math.max(0.05, Math.min(0.97, P.ligne(niv) + P.apprend * essais[niv] + (q.cran || (choix && P.cran === "conseille") ? EFFET_CRAN[q.cran ?? "conseille"] : 0))), ok = o?.guide ? true : R() < p, nsp = !ok && R() < P.nsp; if (nsp) log.nsp++;
      add(o?.guide ? T.guide : ok ? T.notion : T.notionFaux); if (!o?.guide) (log.notionOk ??= []).push(ok); log.ligne.push(`${niv}${ok ? "" : nsp ? "?" : "✗"}${o?.guide ? "g" : ""}`);
      return { q, value: ok ? q.answer : nsp ? null : q.answer + 1, ok, code: ok ? null : nsp ? "NSP" : ERR[niv] ?? "autre", ms: ok ? 4500 : 9000, listens: 1 }; } };
    // la notion du jour sur les additions (lot 2, étape 6) : même enfant, mêmes probabilités qu'à l'échauffement
    const factScreen = { ask: async (q, cfg, o) => {
      const trou = q.forme && q.forme !== "directe", ok = o?.guide || q.guide ? true : R() < P.fait * (trou ? P.trou : 1), nsp = !ok && R() < P.nsp; if (nsp) log.nsp++;
      add(q.guide ? T.addGuide : ok ? T.add : T.addFaux); if (!q.guide) (log.notionOk ??= []).push(ok); log.add.push(`${trou ? (q.forme === "trouDroite" ? `${q.a}+?` : `?+${q.b}`) : `${q.a}+${q.b}`}${ok ? "" : nsp ? "?" : "✗"}${q.guide ? "g" : ""}${q.nouveau && !q.revient ? "*" : ""}`);
      if (q.nouveau && !q.revient && !q.guide) log.nouveaux++;
      const value = ok ? expected(q) : nsp ? null : expected(q) + 1;
      return { q, value, ok, code: ok ? null : nsp ? "NSP" : "autre", ms: ok ? P.faitMs * (0.7 + R() * 0.6) : 9000, listens: 1, aide: false, nsp }; } };
    log.add = [];
    // le défi record (lot 2, étape 7) : faits bien sus, réponses un peu plus rapides qu'à l'échauffement (pas de
    // consigne lue), la bonne réponse montrée un instant après une erreur ; le temps n'avance qu'avec les réponses
    const defiStep = seance.etapes.find((e) => e.id === "defi");
    const defiScreen = { show() {}, keys() {}, leave() {}, blank() {}, cancel() {}, askDefi: async (q) => {
      const trou = q.forme && q.forme !== "directe", ok = R() < Math.min(0.99, P.fait * (trou ? P.trou : 1) + 0.03), nsp = !ok && R() < P.nsp / 2;
      const ms = ok ? P.faitMs * 0.8 * (0.7 + R() * 0.6) : 7000; add(ms + (ok ? T.defiEnPlus : defiStep.apresErreurMs));
      return { value: ok ? expected(q) : nsp ? null : expected(q) + 1, ms, listens: 0, aide: false, nsp, after: Promise.resolve() }; } };
    // lot 3 : la rotation de « jouer », le moins maîtrisé d'abord (comme main.js)
    const [n1, n2, n3] = await Promise.all([1, 2, 3].map((k) => store.get("niveaux", k))), mast = { 1: ((n1?.niveau ?? 1) - 1) / module1.niveaux.length, 2: (n2?.acquises?.length ?? 0) / module2.familles.length, 3: calcMastery(module3, n3) };
    const s = new Session({ store, content: seance, rewards, clock, choix, mastery: (m) => mast[m] ?? 0, onCranDown: async () => { log.descentes++; add(3000); }, handlers: {
      accueil: async ({ session }) => { add(20000); await session.setCran(P.cran ?? "conseille"); add(8000); const sp = drawSurprise(R, cartes.surprise, previousSession(await store.all("seances"), session.id), rewards.gifts); if (sp) { session.rec.surprise = sp; log.surprise = `${sp.type}:${sp.id}`; if (sp.type === "cadeau") await rewards.giveGift(sp.id); add(5000); } },
      echauffement: async (ctx) => { const w = await new Warmup({ store, content: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, dejaNouveaux: ctx.session.nouveaux }).load(); log.warm = w; await runWarmup({ ...ctx, warmup: w, screen: warmScreen, rnd: R }); },
      notion: async (ctx) => {
        // lot 3, étape 4 : le calcul rapide
        if (ctx.session.rec.module === 3) {
          const runner = await new Module3Runner({ store, content: module3, content2: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, choix: ctx.session.choix?.module === 3 ? ctx.session.choix.niveau : null }).load();
          log.module = 3; log.niv0 = runner.niveau; log.calc = [];
          const scr = { ask: async (q) => {
            const niv = `c${q.niveau}`; essais[niv] = (essais[niv] ?? 0) + 1;
            const p = Math.max(0.05, Math.min(0.97, P.calcul(q.niveau) + P.apprend * essais[niv] + (q.aideDEmblee ? 0.08 : 0) + (q.forme !== "directe" ? -0.1 : 0) + (q.cran === "dur" ? -0.05 : q.cran === "tresdur" ? -0.1 : 0)));
            const ok = R() < p, nsp = !ok && R() < P.nsp; if (nsp) log.nsp++;
            const ms = ok ? P.calculMs * (0.7 + R() * 0.6) : 9000;
            add(q.remplir ? T.calcGuide : ok ? T.calc : T.calcFaux); log.calc.push(`${q.a}${q.op}${q.b}${ok ? "" : nsp ? "?" : "✗"}${q.remplir ? "g" : ""}`); if (!q.remplir) (log.notionOk ??= []).push(ok);
            return { q, value: ok ? (q.forme === "trouDroite" ? q.b : q.n) : nsp ? null : q.n + 1, ok, code: ok ? null : nsp ? "NSP" : "autre", ms, listens: 1, aide: false, nsp };
          } };
          const res = await runNotion({ ...ctx, step: { ...ctx.step, ...(ctx.step.module3 ?? {}) }, runner, screen: scr, rnd: R, lesson: async (id) => { add(T.lecon); log.lecons.push(id); return { vue: true }; } });
          for (const e of res?.events ?? []) void e;
          log.niv1 = runner.niveau; log.acquis3 = [...runner.st.acquis];
          return;
        }
        if (ctx.session.rec.module === 2) {
          const runner = await new Module2Runner({ store, content: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => ctx.session.cran, dejaNouveaux: ctx.session.nouveaux, choix: ctx.session.choix?.famille ?? null }).load();
          log.module = 2; log.famille = runner.famille;
          // lot 3 : part des questions sur la règle de la famille en cours (hors exemples guidés), leçons jouées pour elle
          const rule = new Set(ruleFacts(module2, runner.famille).map((f) => f.fait)), asked = [];
          const scr = { ask: async (q, cfg, o) => { if (!q.guide) asked.push(q.fait); return factScreen.ask(q, cfg, o); } };
          const res = await runNotion({ ...ctx, step: { ...ctx.step, ...(ctx.step.module2 ?? {}) }, runner, screen: scr, rnd: R, lesson: async (id) => { add(T.lecon); log.lecons.push(id); return { vue: true }; } });
          log.asked = asked; log.partFamille = asked.length ? asked.filter((f) => rule.has(f)).length / asked.length : null;
          log.doubles = asked.length ? asked.filter((f) => { const [a, b] = f.split("+").map(Number); return Math.abs(a - b) <= 1 && Math.max(a, b) <= 5; }).length / asked.length : null;
          for (const e of res?.events ?? []) if (e.type === "acquise" && !e.parent && !runner.events.some((x) => x.famille === e.famille)) await ctx.session.levelUp();
          ctx.session.nouveaux = runner.nouveaux; return;
        }
        log.module = 1;
        const runner = await new Module1Runner({ screen: lineScreen, store, content: module1, rnd: R, seance: ctx.session.id, variete: seance.variete, offset: () => ctx.session.offset, cran: () => ctx.session.cran, choix: ctx.session.choix?.niveau ?? null }).load(); log.niv0 = runner.st.niveau;
        await runNotion({ ...ctx, runner, screen: lineScreen, rnd: R, lesson: async (id) => { add(T.lecon); log.lecons.push(id); return { vue: true }; } }); log.niv1 = runner.st.niveau; },
      defi: async (ctx) => {
        const w = await new Warmup({ store, content: module2, rnd: R, seance: ctx.session.id, variete: seance.variete, clock, cran: () => "conseille" }).load(); w.defi = true;
        const view = { show() {}, start() {}, stop() {}, pearl() {}, record() {} };
        const r = await runChallenge({ ...ctx, warmup: w, screen: defiScreen, view, store, rnd: R, stars: seance.etoiles, say: async () => add(T.phrase), now: clock, pause: async (ms) => add(ms), timer: () => new Promise(() => {}) });
        log.defi = r.score; log.record = r.nouveau; },
      // la récompense, dans l'ordre de l'application (session/screens.js : bonuses, puis shells)
      recompense: async ({ session }) => { await session.stars(seance.etoiles.seanceTerminee, "fin"); const b = await rewards.endOfSession(session.rec.debut); if (b) await session.stars(b, "série");
        const others = (await store.all("seances")).filter((x) => x.terminee && !x.libre && x.id !== session.id).map((x) => x.debut);
        if (goldenStar([...others, session.rec.debut], session.rec.debut, cartes.semaine)) { await rewards.special("dorees"); log.doree = true; }
        await rewards.collectFree();
        log.cartes = []; log.zones = []; log.quota = rewards.quota(t);
        const zone = async () => { const z = await rewards.openZone(t); if (z) log.zones.push(z.id); };
        const won = (g, dore = false) => { log.cartes.push(g.carte.id + (dore ? "(doré)" : "") + (g.nouvelle ? "" : "(doublon)") + (g.brillante && (g.parTirage || g.devientBrillante) ? "(brillante)" : "")); if (g.nouvelle) log.nouvelles = (log.nouvelles ?? 0) + 1; };
        await zone();
        if (rewards.goldenCard(t)) won(await rewards.openGolden(R, t), true);
        for (let k = 0; k < cartes.coquillage.parSeance && rewards.canOpen(); k++) { if (k) await zone(); const g = await rewards.openShell(R, t); if (!g) break; won(g); }
        await zone();
        log.depasse = rewards.count > rewards.quota(t); log.decors = rewards.decors?.length ?? 0; },
    } });
    const rec = await s.run();
    Object.assign(log, { cran: rec.cran, cranDepart: rec.cranDepart, reussite: rec.reussite, questions: rec.questions, etoiles: rec.etoiles, duree: Math.round(rec.dureeS / 60 * 10) / 10, arc: rec.arcEnCiel ?? 0, reste: rewards.total, nbCartes: rewards.count, brillantes: Object.values(rewards.owned).filter((o) => o.brillante).length, legendaires: cartes.cartes.filter((c) => c.rarete === "legendaire" && rewards.owned[c.id]).length, ouvertes: [...rewards.zones.ouvertes], doreesDispo: rewards.doreesDispo, arcDispo: rewards.arcDispo });
    log.defiSaute = rec.etapes.find((e) => e.id === "defi")?.sautee ?? null;
    const fam = await store.get("niveaux", 2); log.fOuvertes = [...(fam?.ouvertes ?? [])]; log.fAcquises = [...(fam?.acquises ?? [])]; log.fTrou = [...(fam?.trou ?? [])]; log.fDepassees = (fam?.depassees ?? []).map((d) => d.famille);
    // lot 3 ter (T2) : les ouvertures de familles, l'évaluation de fin d'échauffement, les réponses attendues à l'échauffement
    log.fOuvertures = structuredClone(fam?.ouvertures ?? []); log.opening = log.warm?.opening ?? null; delete log.warm;
    log.chauffe = (await store.all("reponses")).filter((r) => r.seance === rec.id && r.module === 2 && !r.notion && !r.defi && r.forme !== "base").sort((a, b) => a.t - b.t).map((r) => r.attendue);
    const faits = await store.all("faits"); log.boites = [1, 2, 3, 4, 5].map((b) => faits.filter((f) => f.boite === b).length); log.faitsVus = faits.length;
    // lot 3 bis (A1) : les familles dont un fait de la règle a été réussi dans cette séance (acquisition sur deux séances au moins)
    { const d0 = startOfDay(t), by = new Map(faits.map((f) => [f.fait, f])); log.fPratique = [1, 2, 3, 4, 5, 6].filter((id) => ruleFacts(module2, id).some((r) => (by.get(r.fait)?.historique ?? []).some((h) => h.juste && h.t >= d0))); }
    out.push(log);
  }
  out.store = store;
  return out;
}
