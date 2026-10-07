// Lot « Correctifs » (docs/LOTS.md, fiche 2 bis) : les décisions du parent du 6 octobre 2026 sur le rapport de
// confrontation de la spécification avec le code (docs/ECARTS-SPEC.md). Les numéros sont ceux du rapport.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { makeEstimate, makeJump, makePlace, makeRead, makeWrite } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const src = (f) => readFileSync(new URL(`../../app/js/${f}`, import.meta.url), "utf8");
const m1 = load("module1.json");
const gen = (c, r, o = {}) => (o.format === "ecrire" ? makeWrite(c, r, o) : o.format === "sauter" ? makeJump(c, r) : o.format === "placer" ? makePlace(c, r, o) : o.format === "estimer" ? makeEstimate(c, r, o) : makeRead(c, r, o));
const juste = (n, ms = 2000) => ({ q: n.q, value: n.q.answer, ok: true, code: null, ms, listens: 1 });

test("10.1 et 12.3 : l'espace parent ne montre plus les cadeaux de la surprise (supprimés le 5 octobre 2026)", () => {
  assert.ok(!/cadeaux de la surprise dans le récif|K\.cadeaux/.test(src("parent/parent.js")));
});

test("4.2 : à la ligne avec « jouer », une réponse au cran « plus facile » ne fait jamais monter, même au niveau conseillé (niveau 1)", async () => {
  // conseillé au niveau 1 : « plus facile » (décalage − 1) reste au niveau 1, qui est le conseillé
  const R = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(5), seance: 1, offset: () => -1, cran: () => "facile" }).load(), ev = [];
  assert.equal(R.eff(), 1);
  for (let i = 0; i < 14; i++) { const n = R.next(); ev.push(...(await R.record(juste(n, 1500), n.cfg)).events); }
  assert.ok(!ev.some((e) => e.type === "montee"), "ni montée, ni voie rapide (5 réponses justes et rapides)");
  assert.equal(R.st.niveau, 1);
  // au cran conseillé, les mêmes réponses font monter (voie rapide) : le cran seul fait la différence
  const C = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(5), seance: 1, offset: () => 0, cran: () => "conseille" }).load(), evC = [];
  for (let i = 0; i < 14; i++) { const n = C.next(); evC.push(...(await C.record(juste(n, 1500), n.cfg)).events); }
  assert.ok(evC.some((e) => e.type === "montee"));
});
