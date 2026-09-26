// Module 2 : catalogue des familles 1 et 2, révision espacée en 5 boîtes, seuil « rapide », plan d'un
// échauffement, enregistrement (temps de base, fait qui revient après une erreur).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { afterFact, catalog, DAY, plan, startOfDay, threshold } from "../../app/js/modules/facts/facts.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";

const c = JSON.parse(readFileSync(new URL("../../app/content/module2.json", import.meta.url)));
const NOW = new Date(2026, 8, 26, 18, 0).getTime();

test("familles 1 et 2 : 30 faits + 1 et + 2, puis les doubles 3+3, 4+4, 5+5 ; sommes jusqu'à 10", () => {
  const cat = catalog(c);
  assert.equal(cat.filter((f) => f.famille === 1).length, 30);
  assert.deepEqual(cat.filter((f) => f.famille === 2).map((f) => f.fait), ["3+3", "4+4", "5+5"]);
  assert.ok(cat.every((f) => f.a + f.b <= 10 && f.a >= 1 && f.b >= 1));
  assert.deepEqual(cat.slice(0, 3).map((f) => f.fait), ["1+1", "2+1", "1+2"]);
});

test("boîtes : juste et rapide monte, juste et lent reste, faux redescend en boîte 1, aide ne fait pas monter", () => {
  const f = { fait: "3+1", a: 3, b: 1, famille: 1, boite: 2, prochain: NOW, historique: [] }, lim = 7000;
  const up = afterFact(c, f, { juste: true, ms: 3000 }, lim, NOW); assert.equal(up.boite, 3); assert.equal(up.prochain, startOfDay(NOW) + 4 * DAY);
  assert.equal(afterFact(c, f, { juste: true, ms: 9000 }, lim, NOW).boite, 2);
  const down = afterFact(c, f, { juste: false, ms: 3000 }, lim, NOW); assert.equal(down.boite, 1); assert.equal(down.prochain, startOfDay(NOW));
  assert.equal(afterFact(c, f, { juste: true, ms: 3000, aide: true }, lim, NOW).boite, 2);
  assert.equal(afterFact(c, { ...f, boite: 5 }, { juste: true, ms: 1000 }, lim, NOW).boite, 5);
  assert.equal(up.historique.length, 1); assert.equal(up.tempsMedian, 3000);
});

test("seuil rapide : base + 4 s, puis + 3 s quand la moitié des faits rencontrés sont en boîte 3 ou plus", () => {
  const fs = (bs) => bs.map((b, i) => ({ fait: `x${i}`, boite: b }));
  assert.equal(threshold(c, 2500, fs([1, 2, 3])), 6500);
  assert.equal(threshold(c, 2500, fs([1, 3, 4, 2])), 5500);
});

test("plan : au plus 3 nouveaux faits, seulement si la boîte 1 a moins de 8 faits ; faits dus d'abord", () => {
  const first = plan(c, [], NOW, 8, 5);
  assert.deepEqual(first.filter((f) => !f.anticipe).map((f) => f.fait), ["1+1", "2+1", "1+2"]);
  assert.equal(first.length, 5); assert.ok(first.slice(3).every((f) => f.anticipe));
  const cat = catalog(c), stored = cat.slice(0, 8).map((f, i) => ({ ...f, boite: 1, prochain: NOW - i }));
  const p = plan(c, stored, NOW, 8, 5); assert.equal(p.length, 8); assert.ok(p.every((f) => !f.nouveau)); // boîte 1 pleine : rien de nouveau
  const later = cat.slice(0, 6).map((f, i) => ({ ...f, boite: i < 2 ? 2 : 1, prochain: i < 2 ? NOW + DAY : NOW }));
  const p2 = plan(c, later, NOW, 8, 5); assert.equal(p2.filter((f) => f.nouveau).length, 3); assert.equal(p2.length, 7); assert.ok(!p2.some((f) => f.fait === "1+1" || f.fait === "2+1"));
});

test("échauffement : temps de base mesuré, faits enregistrés, un fait raté revient 3 questions plus loin", async () => {
  const store = await Store.open(new IDBFactory()), W = await new Warmup({ store, content: c, rnd: rng(2), seance: 7, clock: () => NOW }).load();
  const qs = W.questions(6); assert.equal(qs.filter((q) => q.base).length, 3);
  const rest = [...qs]; let k = 0, back = null;
  while (rest.length) {
    const q = rest.shift(), wrong = !q.base && k++ === 0;
    if (q.revient) back = { q, left: rest.length };
    await W.record(q, { value: wrong ? 99 : q.a + q.b, ms: q.base ? 2000 : 3000, listens: 1 }, rest);
  }
  assert.ok(back, "le fait raté est revenu");
  assert.equal((await store.setting("tempsDeBase")).mesures.length, 3); assert.equal(W.baseMs, 2000);
  const faits = await store.all("faits"); assert.equal(faits.length, 3); assert.equal(faits.find((f) => f.fait === back.q.fait).boite, 1);
  assert.ok(faits.filter((f) => f.fait !== back.q.fait).every((f) => f.boite === 2));
  const reps = await store.all("reponses"); assert.ok(reps.every((r) => r.module === 2 && r.seance === 7)); assert.equal(reps.filter((r) => r.forme === "base").length, 3);
});
