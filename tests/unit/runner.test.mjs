// Module 1 : déroulement des questions (question qui revient, étoiles, leçons, montée, question plus simple).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { makeEstimate, makeJump, makePlace, makeRead } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";

const content = JSON.parse(readFileSync(new URL("../../app/content/module1.json", import.meta.url)));
const screen = { generate: (cfg, r, o = {}) => (o.format === "sauter" ? makeJump(cfg, r) : o.format === "placer" ? makePlace(cfg, r, o) : o.format === "estimer" ? makeEstimate(cfg, r, o) : makeRead(cfg, r, o)) };
const mk = async () => new Module1Runner({ screen, store: await Store.open(new IDBFactory()), content, rnd: rng(4), seance: 1 }).load();
const res = (q, ok, ms = 3000, code = ok ? null : "E1") => ({ q, value: ok ? q.answer : q.answer + 1, ok, code, ms, listens: 1 });

test("une question ratée revient 3 à 5 questions plus loin ; réussie, elle rapporte une étoile de plus", async () => {
  const R = await mk(); const { q, cfg } = R.next(); await R.record(res(q, false, 9000), cfg);
  let back = -1;
  for (let i = 1; i <= 6; i++) { const n = R.next(); if (n.q.revient) { back = i; assert.equal(n.q.answer, q.answer); const r = await R.record(res(n.q, true, 9000), n.cfg); assert.equal(r.etoiles, 2); break; } await R.record(res(n.q, true, 9000), n.cfg); }
  assert.ok(back >= 3 && back <= 5, `revenue après ${back} questions`);
  assert.equal((await R.store.all("reponses")).length, back + 1);
});

test("la même erreur deux fois dans la séance relance la leçon (E1 -> L1)", async () => {
  const R = await mk(); let ev = [];
  for (let i = 0; i < 2; i++) { const n = R.next(); ev = (await R.record(res(n.q, false, 9000), n.cfg)).events; }
  assert.ok(ev.some((e) => e.type === "lecon" && e.id === "L1"));
});

test("voie rapide : niveau 2 après 5 réponses rapides, état enregistré dans la base", async () => {
  const R = await mk(); let ev = [];
  for (let i = 0; i < 5; i++) { const n = R.next(); ev.push(...(await R.record(res(n.q, true, 2000), n.cfg)).events); }
  assert.ok(ev.some((e) => e.type === "montee" && e.a === 2)); assert.equal((await R.store.get("niveaux", 1)).niveau, 2);
  const n = R.next(); assert.equal(n.cfg.niveau, 2);
});

test("difficulté persistante : une question plus simple ensuite (niveau inférieur)", async () => {
  const R = await mk(); R.st.niveau = 3; let ev = [];
  for (const ok of [true, false, true, false, false]) { const n = R.next(); ev = (await R.record(res(n.q, ok, 9000, ok ? null : "autre"), n.cfg)).events; }
  assert.ok(ev.some((e) => e.type === "difficulte"));
  let n = R.next(); while (n.q.revient) n = R.next();
  assert.equal(n.cfg.niveau, 2);
});
