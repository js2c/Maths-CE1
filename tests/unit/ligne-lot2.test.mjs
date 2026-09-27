// Lot 2, étape 2 (docs/SPEC-LOT2.md, sections 2 et 4), ligne graduée : plusieurs niveaux dans une séance par
// la voie rapide (avec la leçon d'entrée), une même leçon au plus une fois par séance (ensuite : niveau
// inférieur et correction lente), cran du sélecteur (niveau joué, validation au-dessus, jamais de baisse).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { makeEstimate, makeJump, makePlace, makeRead } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { runNotion } from "../../app/js/session/notion.js";

const content = JSON.parse(readFileSync(new URL("../../app/content/module1.json", import.meta.url)));
const gen = (cfg, r, o = {}) => (o.format === "sauter" ? makeJump(cfg, r) : o.format === "placer" ? makePlace(cfg, r, o) : o.format === "estimer" ? makeEstimate(cfg, r, o) : makeRead(cfg, r, o));
const mk = async (o = {}) => new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content, rnd: rng(4), seance: 1, ...o }).load();
const res = (q, ok, ms = 3000, code = ok ? null : "E1") => ({ q, value: ok ? q.answer : q.answer + 1, ok, code, ms, listens: 1 });
// une fausse séance pour runNotion
const fakeSession = (n = 16) => ({ c: { etoiles: { lecon: 3 }, finirSurReussite: { essaisMax: 2 } }, progress: { faites: 0, prevues: 0 }, rec: {}, over: () => false, answered: async () => {}, stars: async () => {}, levelUp: async function () { this.ups = (this.ups ?? 0) + 1; }, save: async () => {}, expect() {}, n });

test("voie rapide : plusieurs niveaux franchis dans une même séance, chacun avec sa leçon d'entrée", async () => {
  const R = await mk(), lessons = [], session = fakeSession();
  const screen = { ask: async (q) => res(q, true, 2000) };
  await runNotion({ session, step: { questions: [16, 16], guides: 2 }, runner: R, screen, rnd: () => 0, lesson: async (id) => { lessons.push(id); return { vue: true }; } });
  assert.ok(R.st.niveau >= 4, `niveau atteint : ${R.st.niveau}`); assert.ok(session.ups >= 3);
  assert.deepEqual(lessons.slice(0, 2), ["L1", "L3"]); // L1 à l'entrée du niveau 1, L3 en arrivant au niveau 4
});

test("une même leçon au plus une fois par séance ; ensuite le niveau inférieur et une correction à vitesse 1", async () => {
  const R = await mk(); R.st.niveau = 2; R.st.lecons = ["L1"];
  // L1 déjà jouée dans la séance (leçon d'entrée, ou relancée plus tôt)
  R.lessonPlayed("L1");
  let ev = [];
  for (let i = 0; i < 2; i++) { const n = R.next(); ev.push(...(await R.record(res(n.q, false, 9000, "E1"), n.cfg)).events); }
  assert.ok(!ev.some((e) => e.type === "lecon"), "L1 n'est pas relancée"); assert.ok(ev.some((e) => e.type === "plusBas"));
  const n = R.next(); assert.equal(n.q.niveau, 1, "niveau inférieur"); assert.ok(n.q.lent, "correction lente");
  await R.record(res(n.q, false, 9000, "E1"), n.cfg); assert.ok(!R.next().q.lent, "une seule correction lente");
  // première relance : la leçon est bien jouée, une fois
  const R2 = await mk(); R2.st.niveau = 2; const ev2 = [];
  for (let i = 0; i < 4; i++) { const m = R2.next(); ev2.push(...(await R2.record(res(m.q, false, 9000, "E1"), m.cfg)).events); }
  assert.equal(ev2.filter((e) => e.type === "lecon" && e.id === "L1").length, 1);
});

test("cran : le niveau joué suit l'écart au conseillé, borné au premier et au dernier niveau", async () => {
  let off = 2; const R = await mk({ offset: () => off }); R.st.niveau = 3;
  assert.equal(R.next().q.niveau, 5); off = -1; assert.equal(R.next().q.niveau, 2);
  R.st.niveau = 1; assert.equal(R.next().q.niveau, 1); off = 2; R.st.niveau = 8; assert.equal(R.next().q.niveau, 10);
  R.st.niveau = 13; assert.equal(R.next().q.niveau, 13);
  assert.equal(content.niveaux.length, 13); // lot 2, étape 8 : niveaux 9 à 13
});

test("cran au-dessus : réussir valide le niveau joué et fait monter le conseillé ; échouer ne le fait jamais baisser", async () => {
  const R = await mk({ offset: () => 1 }); R.st.niveau = 2; const ev = [];
  for (let i = 0; i < 5; i++) { const n = R.next(); assert.equal(n.q.niveau, 3); ev.push(...(await R.record(res(n.q, true, 2000), n.cfg)).events); }
  assert.ok(ev.some((e) => e.type === "montee" && e.a === 4 && e.cran)); assert.equal(R.st.niveau, 4);
  assert.equal(R.next().q.niveau, 5, "le cran reste au-dessus du nouveau conseillé");
  const D = await mk({ offset: () => 2 }); D.st.niveau = 3;
  for (let i = 0; i < 12; i++) { const n = D.next(); await D.record(res(n.q, false, 9000, "autre"), n.cfg); }
  const f = await D.finish(); assert.equal(D.st.niveau, 3); assert.equal(f.rate, null, "les questions au-dessus ne comptent pas dans le taux");
  // deux séances ratées au-dessus : pas de redescente
  const D2 = await mk({ offset: () => 2 }); D2.st = { ...D.st, taux: [0.1] };
  for (let i = 0; i < 6; i++) { const n = D2.next(); await D2.record(res(n.q, false, 9000, "autre"), n.cfg); }
  await D2.finish(); assert.equal(D2.st.niveau, 3);
});

test("cran « plus facile » : les questions au niveau inférieur comptent pour le taux, sans faire monter", async () => {
  const R = await mk({ offset: () => -1 }); R.st.niveau = 4;
  for (let i = 0; i < 10; i++) { const n = R.next(); assert.equal(n.q.niveau, 3); await R.record(res(n.q, true, 2000), n.cfg); }
  assert.equal(R.st.niveau, 4); assert.equal((await R.finish()).rate, 1);
});

test("cran au-dessus au dernier niveau : réussir le niveau 13 fait passer le conseillé de 12 à 13", async () => {
  const R = await mk({ offset: () => 1 }); R.st.niveau = 12; const ev = [];
  for (let i = 0; i < 5; i++) { const n = R.next(); assert.equal(n.q.niveau, 13); ev.push(...(await R.record(res(n.q, true, 2000), n.cfg)).events); }
  assert.equal(R.st.niveau, 13); assert.ok(ev.some((e) => e.type === "montee" && e.a === 13));
});
