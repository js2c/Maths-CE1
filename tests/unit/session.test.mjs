// Déroulé de séance : étapes, plafond, enregistrement, « à demain », notion du jour (exemples guidés,
// finir sur une réussite), étoiles.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { makeEstimate, makeJump, makePlace, makeRead } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { doneToday, Session } from "../../app/js/session/session.js";
import { runNotion } from "../../app/js/session/notion.js";
import { Rewards } from "../../app/js/session/rewards.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const seance = load("seance.json"), module1 = load("module1.json");
const gen = (cfg, r, o = {}) => (o.format === "sauter" ? makeJump(cfg, r) : o.format === "placer" ? makePlace(cfg, r, o) : o.format === "estimer" ? makeEstimate(cfg, r, o) : makeRead(cfg, r, o));
const clock = () => { let t = new Date(2026, 8, 26, 18, 0).getTime(); const c = () => t; c.add = (ms) => { t += ms; }; return c; };
const mk = async () => { const store = await Store.open(new IDBFactory()); return { store, rewards: await new Rewards(store).load() }; };
// un écran factice : répond juste ou faux selon `answers(q, i)`, et fait passer le temps
const fakeScreen = (c, answers, msPer = 20000) => { const log = []; return { log, generate: gen, ask: async (q, cfg, o) => { const ok = answers(q, log.length); log.push({ q, guide: !!o?.guide, lesson: o?.lesson ?? null, ok }); c.add(msPer); return { q, value: ok ? q.answer : q.answer + 1, ok, code: ok ? null : "autre", ms: 4000, listens: 1 }; } }; };

test("une séance enchaîne les étapes, saute celles désactivées ou pas encore construites, et s'enregistre", async () => {
  const { store, rewards } = await mk(), c = clock(), seen = [];
  const h = (id) => async ({ session }) => { seen.push(id); if (id === "recompense") await session.stars(seance.etoiles.seanceTerminee, "séance terminée"); };
  const s = new Session({ store, content: seance, rewards, clock: c, handlers: { accueil: h("accueil"), notion: h("notion"), recompense: h("recompense"), defi: h("defi") } });
  const rec = await s.run();
  assert.deepEqual(seen, ["accueil", "notion", "recompense"]);
  assert.equal(rec.etapes.find((e) => e.id === "echauffement").sautee, "pas encore construite");
  assert.equal(rec.etapes.find((e) => e.id === "defi").sautee, "désactivée");
  const saved = await store.get("seances", rec.id);
  assert.equal(saved.terminee, true); assert.equal(saved.module, 1); assert.equal(saved.etoiles, 10);
  assert.equal(rewards.total, 10); assert.equal((await store.get("recompenses", "etoiles")).cumul, 10);
});

test("« à demain » : une séance terminée aujourd'hui, pas une séance interrompue ni celle d'hier", async () => {
  const { store } = await mk(), now = new Date(2026, 8, 26, 19, 0).getTime();
  await store.add("seances", { debut: now - 86400000, terminee: true });
  await store.add("seances", { debut: now - 3600000, terminee: false });
  assert.equal(await doneToday(store, now), false);
  await store.add("seances", { debut: now - 1800000, terminee: true });
  assert.equal(await doneToday(store, now), true);
});

test("notion du jour : deux exemples guidés, puis 8 à 10 questions ; les exemples ne comptent pas pour l'adaptation", async () => {
  const { store, rewards } = await mk(), c = clock();
  const s = await new Session({ store, content: seance, rewards, clock: c, handlers: {} }).start(), screen = fakeScreen(c, () => true, 10000);
  const runner = await new Module1Runner({ screen, store, content: module1, rnd: rng(3), seance: s.id }).load();
  const step = seance.etapes.find((e) => e.id === "notion");
  await runNotion({ session: s, step, end: c() + 5 * 60000, runner, screen, rnd: rng(5) });
  const guides = screen.log.filter((x) => x.guide).length, qs = screen.log.length - guides;
  assert.equal(guides, 2); assert.ok(qs >= 8 && qs <= 10, `${qs} questions`);
  assert.equal(screen.log.slice(0, 2).every((x) => x.guide), true);
  assert.equal(runner.count, qs); // les exemples guidés ne sont pas comptés dans le taux du module
  const reps = await store.all("reponses"); assert.equal(reps.length, qs + 2); assert.equal(reps.filter((r) => r.guide && r.aide).length, 2); assert.ok(reps.every((r) => r.seance === s.id));
  assert.equal(s.rec.questions, qs + 2); assert.equal(rewards.total, qs + 2);
  // cinq bonnes réponses rapides : la voie rapide fait franchir un niveau, une étoile arc-en-ciel
  assert.ok(runner.st.niveau >= 2); assert.equal(s.rec.arcEnCiel, runner.st.niveau - 1); assert.equal(rewards.st.arcEnCiel, runner.st.niveau - 1);
});

test("notion du jour : la leçon du niveau la première fois (3 étoiles), puis « À toi ! » et un exercice guidé au format lire", async () => {
  const { store, rewards } = await mk(), c = clock(), played = [];
  const s = await new Session({ store, content: seance, rewards, clock: c, handlers: {} }).start(), screen = fakeScreen(c, () => true, 10000);
  const runner = await new Module1Runner({ screen, store, content: module1, rnd: rng(3), seance: s.id }).load();
  runner.k = 1; // le format suivant aurait été « sauter » : l'exercice qui suit la leçon est quand même « lire »
  await runNotion({ session: s, step: seance.etapes[2], end: c() + 5 * 60000, runner, screen, rnd: rng(5), lesson: async (id, raison) => { played.push([id, raison]); return true; } });
  assert.deepEqual(played, [["L1", "niveau"]]);
  assert.equal(screen.log[0].guide, true); assert.equal(screen.log[0].lesson, "L1"); assert.equal(screen.log[0].q.format, "lire");
  assert.equal(screen.log.filter((x) => x.guide).length, 1); // pas d'autres exemples guidés après une leçon
  assert.deepEqual(runner.st.lecons, ["L1"]); assert.equal(runner.entryLesson(), null);
  const qs = screen.log.length - 1; assert.equal(rewards.total, qs + 1 + seance.etoiles.lecon);
});

test("notion du jour : la même erreur deux fois relance sa leçon, suivie d'un exercice guidé ; une leçon non finie ne rapporte rien", async () => {
  const { store, rewards } = await mk(), c = clock(), played = [];
  const s = await new Session({ store, content: seance, rewards, clock: c, handlers: {} }).start(), log = [];
  // niveau 4 (ligne 30-40) : l'enfant répond toujours « sans le départ » (E3) sauf aux exercices guidés
  const screen = { log, generate: gen, ask: async (q, cfg, o) => { const ok = !!o?.guide; log.push({ q, guide: !!o?.guide, lesson: o?.lesson ?? null }); c.add(1000); const v = ok ? q.answer : q.answer - q.min; return { q, value: v, ok, code: ok ? null : "E3", ms: 4000, listens: 1 }; } };
  const runner = await new Module1Runner({ screen, store, content: module1, rnd: rng(4), seance: s.id }).load();
  runner.st.niveau = 4; runner.st.lecons = ["L3"]; runner.save = () => {};
  await runNotion({ session: s, step: { ...seance.etapes[2], guides: 0, questions: [3, 3] }, end: Infinity, runner, screen, rnd: rng(1), lesson: async (id, raison) => { played.push([id, raison]); return false; } });
  assert.deepEqual(played[0], ["L3", "E3"]);
  assert.equal(log.filter((x) => x.lesson).length, 0); // leçon pas regardée jusqu'au bout : pas d'exercice guidé, pas d'étoiles
  assert.equal(rewards.total, log.filter((x) => x.guide).length);
});

test("notion du jour : la durée de l'étape et le plafond de la séance arrêtent les questions", async () => {
  const { store, rewards } = await mk(), c = clock();
  const s = await new Session({ store, content: seance, rewards, clock: c, handlers: {} }).start(), screen = fakeScreen(c, () => true, 60000);
  const runner = await new Module1Runner({ screen, store, content: module1, rnd: rng(3), seance: s.id }).load();
  await runNotion({ session: s, step: seance.etapes[2], end: c() + 5 * 60000, runner, screen, rnd: rng(5) });
  assert.equal(screen.log.length, 5); // une minute par question : 5 minutes pour l'étape
  c.add(6 * 60000); assert.equal(s.over(), true); // 11 minutes : il ne reste que le temps de la récompense
});

test("finir sur une réussite : après une dernière réponse fausse, une question plus simple", async () => {
  const { store, rewards } = await mk(), c = clock();
  const s = await new Session({ store, content: seance, rewards, clock: c, handlers: {} }).start();
  const screen = fakeScreen(c, (q) => q.guide || q.niveau < 3, 1000); // juste seulement aux questions plus simples
  const runner = await new Module1Runner({ screen, store, content: module1, rnd: rng(9), seance: s.id }).load();
  runner.st.niveau = 3; runner.save = () => {};
  await runNotion({ session: s, step: { ...seance.etapes[2], questions: [4, 4] }, end: Infinity, runner, screen, rnd: rng(1) });
  const qs = screen.log.filter((x) => !x.guide), last = qs.at(-1);
  assert.equal(qs[3].ok, false); assert.equal(qs.length, 5); assert.equal(last.ok, true); assert.equal(last.q.niveau, 2);
});

test("une séance plafonnée : les étapes à questions sont sautées, la récompense reste", async () => {
  const { store, rewards } = await mk(), c = clock(), seen = [];
  const s = new Session({ store, content: seance, rewards, clock: c, handlers: { accueil: async () => { seen.push("accueil"); c.add(12 * 60000); }, notion: async () => seen.push("notion"), recompense: async () => seen.push("recompense") } });
  const rec = await s.run();
  assert.deepEqual(seen, ["accueil", "recompense"]); assert.equal(rec.etapes.find((e) => e.id === "notion").sautee, "temps écoulé"); assert.equal(rec.terminee, true);
});

test("une première séance complète, une réponse sur deux juste, rapporte au moins un coquillage (lot 1 bis)", async () => {
  const { runWarmup } = await import("../../app/js/modules/facts/screen.js");
  const { Warmup } = await import("../../app/js/modules/facts/warmup.js");
  const cartes = load("cartes.json"), module2 = load("module2.json");
  const { store, rewards } = await mk(), c = clock();
  let k = 0; const half = () => k++ % 2 === 0;
  // l'échauffement et la notion du jour au plus court (le minimum de questions de seance.json)
  const facts = { show() {}, keys() {}, leave() {}, ask: async (q) => { c.add(8000); const ok = half(); return { value: ok ? q.a + q.b : q.a + q.b + 1, ms: 4000, listens: 1, aide: false }; } };
  const line = fakeScreen(c, () => half(), 20000);
  const handlers = {
    echauffement: async (ctx) => { const warmup = await new Warmup({ store, content: module2, rnd: rng(2), seance: ctx.session.id, clock: c }).load(); await runWarmup({ ...ctx, step: { ...ctx.step, questions: [ctx.step.questions[0], ctx.step.questions[0]] }, warmup, screen: facts, rnd: rng(2) }); },
    notion: async (ctx) => { const runner = await new Module1Runner({ screen: line, store, content: module1, rnd: rng(4), seance: ctx.session.id }).load(); await runNotion({ ...ctx, step: { ...ctx.step, questions: [ctx.step.questions[0], ctx.step.questions[0]] }, runner, screen: line, lesson: async () => ({ vue: true }), rnd: rng(4) }); },
    recompense: async ({ session }) => session.stars(seance.etoiles.seanceTerminee, "séance terminée"),
  };
  const rec = await new Session({ store, content: seance, rewards, clock: c, handlers }).run();
  assert.ok(rec.justes >= rec.questions / 2 - 1 && rec.justes <= rec.questions / 2 + 1, `${rec.justes} sur ${rec.questions}`);
  assert.ok(rewards.total >= cartes.coquillage.prix, `${rewards.total} étoiles pour un coquillage à ${cartes.coquillage.prix}`);
});
