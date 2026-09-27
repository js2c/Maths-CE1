// RECETTE : simulation de séances avec les modules réels de l'application (hors navigateur). Profils d'enfant
// hypothétiques (PROFILS) ; durées par question estimées (T), à caler sur tests/e2e/recette-durees.mjs.
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../app/js/engine/store.js";
import { rng } from "../app/js/engine/ocean.js";
import { makeEstimate, makeJump, makePlace, makeRead } from "../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../app/js/modules/numberline/runner.js";
import { Session } from "../app/js/session/session.js";
import { runNotion } from "../app/js/session/notion.js";
import { Rewards, goldenStar } from "../app/js/session/rewards.js";
import { Warmup } from "../app/js/modules/facts/warmup.js";
import { runWarmup } from "../app/js/modules/facts/screen.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../app/content/${f}`, import.meta.url)));
const seance = load("seance.json"), module1 = load("module1.json"), module2 = load("module2.json"), cartes = load("cartes.json");
const gen = (cfg, r, o = {}) => (o.format === "sauter" ? makeJump(cfg, r) : o.format === "placer" ? makePlace(cfg, r, o) : o.format === "estimer" ? makeEstimate(cfg, r, o) : makeRead(cfg, r, o));
const ERR = { 1: "E1", 2: "E1", 3: "E1", 4: "E3", 5: "E2", 6: "E5", 7: "E2", 8: "autre" };

// profils : p(niveau, essais) = probabilité de réussir ; faits : p et temps
export const PROFILS = {
  sait: { nom: "sait déjà (rapide)", ligne: (n) => (n <= 5 ? 0.97 : 0.85), apprend: 0.004, fait: 0.97, faitMs: 3500, baseMs: 3000 },
  reel: { nom: "profil de l'évaluation (ligne faible au-delà de 20, faits en partie sus)", ligne: (n) => [0, 0.95, 0.9, 0.85, 0.55, 0.45, 0.45, 0.4, 0.45][n], apprend: 0.006, fait: 0.9, faitMs: 5000, baseMs: 3500 },
  diff: { nom: "en difficulté", ligne: (n) => [0, 0.85, 0.75, 0.7, 0.45, 0.35, 0.35, 0.3, 0.35][n], apprend: 0.004, fait: 0.75, faitMs: 8000, baseMs: 4000 },
};
const T = { chauffe: 7000, chauffeFaux: 9000, notion: 15000, notionFaux: 30000, guide: 30000, lecon: 75000 };

export async function simulate({ profil, jours, seed = 1 }) {
  const P = PROFILS[profil], R = rng(seed), store = await Store.open(new IDBFactory()), rewards = await new Rewards(store, cartes).load();
  let t = 0; const clock = () => t, add = (ms) => { t += ms; };
  const essais = {}; const out = [];
  for (const [i, day] of jours.entries()) {
    t = day.getTime() + 18 * 3600000;
    const log = { n: i + 1, date: day.toLocaleDateString("fr-FR"), faits: [], ligne: [], lecons: [] };
    const warmScreen = { show() {}, keys() {}, leave() {}, ask: async (q) => {
      const ok = q.base ? true : R() < P.fait; const ms = q.base ? P.baseMs + R() * 1000 : ok ? P.faitMs * (0.7 + R() * 0.6) : 9000;
      add(ok ? T.chauffe : T.chauffeFaux); if (!q.base) log.faits.push(`${q.a}+${q.b}${ok ? "" : "✗"}${q.nouveau ? "*" : ""}`);
      return { value: ok ? q.a + q.b : q.a + q.b + 1, ms, listens: 1, aide: false }; } };
    const lineScreen = { generate: gen, ask: async (q, cfg, o) => {
      const niv = cfg.niveau ?? cfg.id ?? 0; essais[niv] = (essais[niv] ?? 0) + 1;
      const p = Math.min(0.97, P.ligne(niv) + P.apprend * essais[niv]), ok = o?.guide ? true : R() < p;
      add(o?.guide ? T.guide : ok ? T.notion : T.notionFaux); log.ligne.push(`${niv}${ok ? "" : "✗"}${o?.guide ? "g" : ""}`);
      return { q, value: ok ? q.answer : q.answer + 1, ok, code: ok ? null : ERR[niv] ?? "autre", ms: ok ? 4500 : 9000, listens: 1 }; } };
    const s = new Session({ store, content: seance, rewards, clock, handlers: {
      accueil: async () => add(20000),
      echauffement: async (ctx) => { const w = await new Warmup({ store, content: module2, rnd: R, seance: ctx.session.id, clock }).load(); await runWarmup({ ...ctx, warmup: w, screen: warmScreen, rnd: R }); },
      notion: async (ctx) => { const runner = await new Module1Runner({ screen: lineScreen, store, content: module1, rnd: R, seance: ctx.session.id }).load(); log.niv0 = runner.st.niveau;
        await runNotion({ ...ctx, runner, screen: lineScreen, rnd: R, lesson: async (id) => { add(T.lecon); log.lecons.push(id); return { vue: true }; } }); log.niv1 = runner.st.niveau; },
      recompense: async ({ session }) => { await session.stars(seance.etoiles.seanceTerminee, "fin"); const b = await rewards.endOfSession(session.rec.debut); if (b) await session.stars(b, "série");
        const others = (await store.all("seances")).filter((x) => x.terminee && x.id !== session.id).map((x) => x.debut);
        if (goldenStar([...others, session.rec.debut], session.rec.debut, cartes.semaine)) { await rewards.special("dorees"); log.doree = true; }
        log.cartes = []; for (let k = 0; k < cartes.coquillage.parSeance && rewards.canOpen(); k++) { const g = await rewards.openShell(R, t); if (!g) break; log.cartes.push(g.carte.id + (g.nouvelle ? "" : "(doublon)")); } },
    } });
    const rec = await s.run();
    Object.assign(log, { questions: rec.questions, etoiles: rec.etoiles, duree: Math.round(rec.dureeS / 60 * 10) / 10, arc: rec.arcEnCiel ?? 0, reste: rewards.total, nbCartes: Object.keys(rewards.owned).length });
    const faits = await store.all("faits"); log.boites = [1, 2, 3, 4, 5].map((b) => faits.filter((f) => f.boite === b).length); log.faitsVus = faits.length;
    out.push(log);
  }
  return out;
}
