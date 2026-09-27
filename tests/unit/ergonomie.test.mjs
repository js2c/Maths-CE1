// Lot 1 bis, ergonomie : « je ne sais pas » (code NSP), entraînement libre (aucune étoile), horloge de la
// pause (le temps de pause ne compte pas, une activité abandonnée ne reprend jamais), frise de la séance,
// accord de l'erreur E5, cartes des zones 2 à 4.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { Clock } from "../../app/js/engine/clock.js";
import { decompose, fill } from "../../app/js/engine/phrases.js";
import { makeRead } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { Rewards } from "../../app/js/session/rewards.js";
import { Session } from "../../app/js/session/session.js";
import { FreeTraining } from "../../app/js/session/free.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const module1 = load("module1.json"), module2 = load("module2.json"), textes = load("textes.json"), seance = load("seance.json"), cartes = load("cartes.json");
const screen = { generate: (cfg, r, o) => makeRead(cfg, r, o) };

test("« je ne sais pas » (ligne graduée) : une erreur NSP, qui compte pour l'adaptation et fait revenir la question", async () => {
  const store = await Store.open(new IDBFactory()), runner = await new Module1Runner({ screen, store, content: module1, rnd: rng(1), seance: 1 }).load();
  const { q, cfg } = runner.next();
  const r = await runner.record({ q, value: null, ok: false, code: "NSP", ms: 3000, listens: 1 }, cfg);
  assert.equal(r.etoiles, 0);
  const [rep] = await store.all("reponses");
  assert.equal(rep.erreur, "NSP"); assert.equal(rep.juste, false); assert.equal(rep.donnee, null);
  assert.equal(runner.count, 1); assert.equal(runner.ok, 0); assert.equal(runner.st.fenetre.at(-1).juste, false);
  assert.equal(runner.replays.length, 1); // elle reviendra 3 à 5 questions plus loin, comme après une erreur
  assert.ok(!r.events.some((e) => e.type === "lecon")); // NSP ne relance aucune leçon d'erreur type
});

test("« je ne sais pas » (échauffement) : erreur NSP, le fait revient et redescend en boîte 1", async () => {
  const store = await Store.open(new IDBFactory()), w = await new Warmup({ store, content: module2, rnd: rng(2), seance: 1, clock: () => 1e12 }).load();
  const rest = w.questions(5, 5).filter((x) => !x.base), q = rest.shift();
  const res = await w.record(q, { value: null, ms: 2000, listens: 1, aide: false, nsp: true }, rest);
  assert.equal(res.juste, false); assert.equal(res.etoiles, 0);
  const rep = (await store.all("reponses")).at(-1);
  assert.equal(rep.erreur, "NSP");
  assert.ok(rest.some((x) => x.fait === q.fait && x.revient));
  assert.equal((await store.all("faits")).find((f) => f.fait === q.fait).boite, 1);
});

test("entraînement libre : réponses enregistrées « libre », adaptation appliquée, aucune étoile ni coquillage", async () => {
  const store = await Store.open(new IDBFactory()), rewards = await new Rewards(store, cartes).load(), STOP = Symbol("fin");
  let n = 0;
  const line = { generate: screen.generate, leave() {}, ask: async (q) => { if (n++ >= 6) throw STOP; return { q, value: q.answer, ok: true, code: null, ms: 2000, listens: 1 }; } };
  const app = { voice: { say: async () => {}, stop() {} }, text: { data: textes }, clock: { now: () => 0 }, lineScreen: () => line };
  const free = new FreeTraining(app, { store, module1, module2, rnd: rng(3) });
  free.t0 = 0;
  await assert.rejects(free.line(), (e) => e === STOP);
  const reps = await store.all("reponses"), seances = await store.all("seances");
  assert.equal(reps.length, 6); assert.ok(reps.every((r) => r.libre && r.seance === free.rec.id));
  assert.equal(seances.length, 1); assert.equal(seances[0].libre, true); assert.equal(seances[0].terminee, false); assert.equal(seances[0].questions, 6);
  assert.equal(rewards.total, 0); assert.equal((await new Rewards(store, cartes).load()).total, 0); // le trésor n'a pas bougé
  // cinq bonnes réponses rapides : la voie rapide s'applique aussi en entraînement libre (sans étoile arc-en-ciel)
  assert.ok((await store.get("niveaux", 1)).niveau >= 2);
  assert.equal((await new Rewards(store, cartes).load()).st.arcEnCiel, 0);
});

test("l'horloge : la pause ne compte pas ; reprise exacte ; une activité abandonnée ne reprend jamais", async () => {
  let t = 0; const c = new Clock(() => t), done = [];
  c.wait(100).then(() => done.push("a"));
  t = 40; c.pause(); t = 5000;
  assert.equal(c.now(), 40); assert.equal(c.pausedTotal(), 4960);
  await new Promise((r) => setTimeout(r, 20)); assert.deepEqual(done, []);
  c.resume(); assert.equal(c.now(), 40);
  t = 5100; await new Promise((r) => setTimeout(r, 90)); assert.deepEqual(done, ["a"]);
  c.wait(10).then(() => done.push("b")); c.pause(); c.abandon(); t = 9000;
  await new Promise((r) => setTimeout(r, 40)); assert.deepEqual(done, ["a"]);
  assert.equal(c.paused, false);
});

test("séance : la pause n'entre ni dans le plafond ni dans la durée ; la frise suit les questions", async () => {
  const store = await Store.open(new IDBFactory()); let now = new Date(2026, 8, 26, 18).getTime(), paused = 0; const seen = [];
  const s = await new Session({ store, content: seance, clock: () => now, paused: () => paused, onProgress: (p) => seen.push({ ...p }), handlers: {} }).start();
  now += 11 * 60000; paused += 5 * 60000; // 11 minutes, dont 5 de pause
  assert.equal(s.over(), false);
  await s.notePause(); const rec = await store.get("seances", s.id);
  assert.equal(rec.dureeS, 6 * 60); assert.equal(rec.pauseS, 5 * 60); assert.equal(rec.pauses, 1);
  s.progress = { etape: "notion", faites: 0, prevues: 0 }; s.expect(10); await s.answered(true); s.expect(4);
  assert.deepEqual(seen.at(-1), { etape: "notion", faites: 1, prevues: 10 }); // le nombre prévu ne fait que grandir
});

test("erreur E5 accordée : « 1 dizaine et 3 unités », « 2 dizaines et 1 unité »", () => {
  assert.equal(fill(textes.erreur.E5, decompose(textes, 13)), "1 dizaine et 3 unités.");
  assert.equal(fill(textes.erreur.E5, decompose(textes, 21)), "2 dizaines et 1 unité.");
  assert.equal(fill(textes.erreur.E5, decompose(textes, 47)), "4 dizaines et 7 unités.");
  assert.equal(textes.faitTrouDroite, "{a} plus combien, ça fait {n} ?"); assert.equal(textes.faitTrouGauche, "Combien plus {b}, ça fait {n} ?");
});

test("les 60 cartes : 40 communes, 15 rares, 5 légendaires ; 15 par zone ; illustrations du lagon et dos de chaque zone présents", () => {
  const C = cartes.cartes, count = (k, v) => C.filter((c) => c[k] === v).length;
  assert.equal(C.length, 60); assert.equal(new Set(C.map((c) => c.id)).size, 60);
  assert.deepEqual([count("rarete", "commune"), count("rarete", "rare"), count("rarete", "legendaire")], [40, 15, 5]);
  for (const z of cartes.zones) assert.equal(count("zone", z.id), 15, z.id);
  assert.deepEqual(C.filter((c) => c.rarete === "legendaire").map((c) => c.id).sort(), ["baleine-bleue", "cachalot", "grand-requin-blanc", "narval", "orque"]);
  const file = (p) => { try { return readFileSync(new URL(`../../app/${p}`, import.meta.url)).length > 0; } catch { return false; } };
  for (const c of C.filter((x) => x.zone === "lagon")) assert.ok(c.illustration && file(c.illustration), c.id);
  for (const z of cartes.zones) assert.ok(file(z.dos), z.id);
  assert.ok(file(cartes.dosLegendaire));
});
