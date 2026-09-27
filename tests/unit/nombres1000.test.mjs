// Lot 2, étape 8 : nombres jusqu'à 1 000 (docs/SPEC-COMPLEMENTS.md, partie A ; docs/SPEC-LOT2.md, section 4) :
// niveaux 9 à 13 (lignes, formats, nombres écrits), dictée (niveau 12), pièges et erreurs E6 et E7, estimation
// (tolérances ±60 puis ±40), petits chaluts des centaines, décomposition dite (« 307 : 3 centaines, 0 dizaine,
// 7 unités. »), nombres possibles d'un niveau (la voix ne fabrique que ceux-là).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { rng } from "../../app/js/engine/ocean.js";
import { hundredsWords, fill } from "../../app/js/engine/phrases.js";
import { classify, e6Values, e7Value, levelValues, lineSpec, makeEstimate, makePlace, makeRead, makeWrite, toleranceFor } from "../../app/js/modules/numberline/generator.js";
import { e7Words } from "../../app/js/modules/numberline/dictation.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m1 = load("module1.json"), T = load("textes.json"), cfg = (n) => m1.niveaux.find((c) => c.niveau === n);

test("niveaux 9 à 13 : lignes et formats de la SPEC", () => {
  assert.deepEqual(m1.niveaux.map((c) => c.niveau), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const r = rng(1);
  for (let i = 0; i < 200; i++) {
    const q9 = makeRead(cfg(9), r); assert.deepEqual([q9.min, q9.max, q9.step, q9.n], [0, 1000, 100, 11]); assert.ok(![0, 500, 1000].includes(q9.answer) && q9.answer % 100 === 0);
    const q10 = makePlace(cfg(10), r); assert.equal(q10.max - q10.min, 100); assert.equal(q10.step, 10); assert.ok(q10.min >= 100 && q10.min % 100 === 0); assert.ok(q10.answer > q10.min && q10.answer < q10.max);
    const q11 = makeRead(cfg(11), r); assert.equal(q11.max - q11.min, 20); assert.equal(q11.step, 1); assert.ok(q11.answer % 10 !== 0, "la cible n'est jamais une dizaine écrite");
    assert.ok(q11.choices.every((c) => c.value >= 0 && c.value <= 1000)); assert.equal(q11.choices.length, 4);
  }
  assert.deepEqual(cfg(12).formats, ["ecrire"]); assert.deepEqual(cfg(13).tolerances, [60, 40]);
  assert.equal(toleranceFor(cfg(13), 0), 60); assert.equal(toleranceFor(cfg(13), 5), 40);
});

test("pièges E6 (dizaines et centaines confondues) et E7 (écrit comme on l'entend)", () => {
  assert.deepEqual(e6Values(700), [70]); assert.deepEqual(e6Values(370), [37]); assert.deepEqual(e6Values(307), [37, 370]); assert.deepEqual(e6Values(347), [437]); assert.deepEqual(e6Values(88), []);
  assert.equal(e7Value(307), 3007); assert.equal(e7Value(317), 30017); assert.equal(e7Value(300), null);
  // lire : E6 est proposé parmi les bulles, et une bulle E6 choisie est notée E6
  const r = rng(2); let seen = 0;
  for (let i = 0; i < 100; i++) { const q = makeRead(cfg(10), r), c = q.choices.find((x) => x.code === "E6"); if (c) { seen++; assert.equal(classify(q, c.value), "E6"); } }
  assert.ok(seen > 80, `${seen} questions avec le piège E6`);
  // écrire : 37 ou 370 pour 307 -> E6 ; 3007 -> E7 ; autre chose -> autre ; juste -> null
  const q = { ...makeWrite(cfg(12), r), answer: 307 };
  assert.deepEqual([classify(q, 307), classify(q, 37), classify(q, 370), classify(q, 3007), classify(q, 308)], [null, "E6", "E6", "E7", "autre"]);
});

test("dictée : des nombres variés (centaines rondes, zéro au milieu, dizaines rondes, « dix-… »), tous entre 100 et 999", () => {
  const N = cfg(12).nombres;
  assert.ok(N.length >= 60 && N.every((n) => n >= 100 && n <= 999));
  assert.ok(N.filter((n) => n % 100 === 0).length >= 9, "centaines rondes");
  assert.ok(N.filter((n) => Math.floor(n / 10) % 10 === 0 && n % 10).length >= 9, "zéro au milieu (307)");
  assert.ok(N.filter((n) => Math.floor(n / 10) % 10 === 1).length >= 9, "« dix-… » (317)");
  const r = rng(3), seen = new Set(); for (let i = 0; i < 500; i++) { const q = makeWrite(cfg(12), r, { eviter: [...seen].slice(-3) }); assert.equal(q.format, "ecrire"); seen.add(q.answer); }
  assert.ok(seen.size > N.length * 0.8);
});

test("estimer sur 0 à 1 000 et petits chaluts des centaines sur la ligne", () => {
  const r = rng(4);
  for (let i = 0; i < 50; i++) { const q = makeEstimate(cfg(13), r, { tolerance: 60 }); assert.ok(cfg(13).cibles.includes(q.answer)); assert.equal(classify(q, q.answer + 60), null); assert.equal(classify(q, q.answer + 61), classify(q, q.answer + 61) === "E4" ? "E4" : "autre"); }
  const q9 = makeRead(cfg(9), r), sp = lineSpec(q9, cfg(9));
  assert.deepEqual(sp.centaines, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(lineSpec(makeRead(cfg(5), r), cfg(5)).centaines, undefined); // jusqu'à 100 : rien de nouveau
});

test("voix : la décomposition dite, accordée (« 0 dizaine », « 1 centaine »), et la phrase E7", () => {
  assert.equal(fill(T.erreur.E6, { n: 307, ...hundredsWords(T, 307) }), "307 : 3 centaines, 0 dizaine, 7 unités.");
  assert.equal(fill(T.erreur.E6, { n: 110, ...hundredsWords(T, 110) }), "110 : 1 centaine, 1 dizaine, 0 unité.");
  assert.equal(fill(T.erreur.E7, e7Words(307, T)), "On n'écrit pas 300 puis 7 : le 7 prend la place des unités.");
  assert.equal(fill(T.erreur.E7, e7Words(317, T)), "On n'écrit pas 300 puis 17 : le 17 prend la place des dizaines et des unités.");
});

test("nombres possibles d'un niveau (ce que la voix fabrique) : peu nombreux, et chaque question produite en fait partie", () => {
  const V = Object.fromEntries([9, 10, 11, 12, 13].map((n) => [n, new Set(levelValues(cfg(n)))]));
  assert.deepEqual([V[9].size, V[10].size, V[12].size], [11, 91, cfg(12).nombres.length]);
  assert.ok(V[11].size <= 12 * 21);
  const r = rng(5);
  for (let i = 0; i < 300; i++) {
    for (const n of [9, 10, 11]) { const q = makeRead(cfg(n), r); assert.ok(V[n].has(q.answer) && V[n].has(q.min) && q.choices.every((c) => c.value < 100 || V[n].has(c.value) || c.code === "E6" || c.code === "E3")); }
    assert.ok(V[12].has(makeWrite(cfg(12), r).answer)); assert.ok(V[13].has(makeEstimate(cfg(13), r).answer));
  }
});
