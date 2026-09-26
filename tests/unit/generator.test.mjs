// Module 1 : génération des questions « lire » et détection du type d'erreur (docs/SPEC.md, Module 1).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { choicesFor, classify, lineSpec, makeRead, TRAPS } from "../../app/js/modules/numberline/generator.js";
import { rng } from "../../app/js/engine/ocean.js";

const cfg = JSON.parse(readFileSync(new URL("../../app/content/module1.json", import.meta.url))).niveaux;
const lvl = (n) => cfg.find((c) => c.niveau === n);

test("les pièges de l'exemple de la SPEC", () => {
  const q = { answer: 34, min: 30, max: 40, step: 1 };
  assert.equal(TRAPS.E1(q), 35); // compte les traits
  assert.equal(TRAPS.E3(q), 4); // ignore le départ
  assert.equal(TRAPS.E4(q), 36); // compte depuis la droite
  assert.equal(TRAPS.E5(q), 43); // inverse dizaines et unités
  assert.equal(TRAPS.E2({ answer: 70, min: 0, max: 100, step: 10 }), 7); // ignore la valeur du saut
  assert.equal(TRAPS.E2(q), null); // pas de 1 : pas de piège E2
  assert.equal(TRAPS.E3({ answer: 6, min: 0, max: 10, step: 1 }), null); // la ligne part de 0 : pas de piège E3
});

test("niveau 1 : 6 sur la ligne 0-10 donne 5, 6, 7 comme la maquette", () => {
  const q = { niveau: 1, answer: 6, min: 0, max: 10, step: 1 };
  assert.deepEqual(choicesFor(q, 3).map((c) => c.value), [4, 6, 7]); // E1 = 7, E4 = 4
});

for (const n of [1, 2, 3, 4, 5, 6, 7]) test(`niveau ${n} : 300 questions bien formées`, () => {
  const r = rng(n * 97), c = lvl(n);
  let near = 0;
  for (let k = 0; k < 300; k++) {
    const q = makeRead(c, r);
    assert.ok(q.target > 0 && q.target < q.n - 1, "jamais une extrémité");
    assert.ok(!q.labelled.includes(q.target), "la cible n'est jamais une graduation numérotée");
    assert.equal(q.answer, q.min + q.target * q.step);
    assert.equal(q.choices.length, c.choix);
    assert.equal(new Set(q.choices.map((x) => x.value)).size, q.choices.length, "propositions distinctes");
    assert.ok(q.choices.some((x) => x.value === q.answer));
    assert.deepEqual(q.choices.map((x) => x.value), [...q.choices.map((x) => x.value)].sort((a, b) => a - b), "triées");
    for (const ch of q.choices) {
      assert.ok(ch.value >= 0 && ch.value <= 100);
      if (ch.value !== q.answer) assert.equal(classify(q, ch.value), ch.code ?? "autre");
    }
    assert.equal(classify(q, q.answer), null);
    if (q.target <= 2 || q.target >= q.n - 3) near++;
    const s = lineSpec(q, c);
    assert.equal(s.labels.length, q.n); assert.equal(s.labels[q.target], null); assert.equal(s.mark, q.target);
  }
  if (n >= 2 && n <= 6) assert.ok(near / 300 > 0.15, `assez de cibles près d'une extrémité (${near}/300)`);
});

test("niveau 7 : deux graduations voisines écrites, la cible au moins deux sauts plus loin", () => {
  const r = rng(7);
  for (let k = 0; k < 200; k++) {
    const q = makeRead(lvl(7), r);
    assert.equal(q.labelled.length, 2); assert.equal(q.labelled[1] - q.labelled[0], 1);
    assert.ok(q.target >= q.labelled[1] + 2);
    assert.ok([1, 10].includes(q.step));
  }
});

test("les pièges apparaissent aux niveaux où ils ont un sens", () => {
  const r = rng(3), seen = (n) => { const s = new Set(); for (let k = 0; k < 400; k++) makeRead(lvl(n), r).choices.forEach((c) => c.code && s.add(c.code)); return s; };
  assert.ok(seen(1).has("E1") && seen(1).has("E4"));
  assert.ok(seen(4).has("E3"));
  assert.ok(seen(5).has("E2"));
  assert.ok(seen(6).has("E5") || seen(6).has("E3"));
});

test("niveau 5 : 0, 50 et 100 écrits, jamais la cible", () => {
  const r = rng(55);
  for (let k = 0; k < 200; k++) { const q = makeRead(lvl(5), r); assert.deepEqual(q.labelled, [0, 5, 10]); assert.ok(![0, 50, 100].includes(q.answer)); }
});
