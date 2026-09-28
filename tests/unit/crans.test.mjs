// Lot 3, étape 2 (docs/SPEC-LOT3.md, section 3) : la difficulté à l'intérieur du niveau choisi. Ligne graduée : un bloc
// `crans` par niveau (module1.json), appliqué seulement au niveau choisi ; nombres écrits, propositions, formats,
// étendue, cibles au milieu, sauts plus loin, tolérances, repère, filtres de la dictée ; « plus facile » consolide sans
// faire progresser ; chaque nombre possible a sa voix. Additions (famille choisie) : formes directes, moitié à trou,
// toutes à trou.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { applyCran, dictationPool, levelValues, makeEstimate, makeJump, makePlace, makeRead, makeWrite } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { initialFamilies } from "../../app/js/modules/facts/families.js";
import { expected } from "../../app/js/modules/facts/facts.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m1 = load("module1.json"), m2 = load("module2.json"), cfg = (n) => m1.niveaux[n - 1];
const gen = (c, r, o = {}) => (o.format === "ecrire" ? makeWrite(c, r, o) : o.format === "sauter" ? makeJump(c, r) : o.format === "placer" ? makePlace(c, r, o) : o.format === "estimer" ? makeEstimate(c, r, o) : makeRead(c, r, o));
const qs = async (n, cran, k = 30) => { const R = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(n * 7 + k), seance: 1, choix: n, cran: () => cran }).load(); return Array.from({ length: k }, () => R.next().q); };
const written = (q) => q.labelled.map((i) => q.min + i * q.step);

test("chaque niveau a ses crans (plus facile, plus dur, très dur) ; le conseillé est le niveau tel quel", () => {
  for (const c of m1.niveaux) { assert.deepEqual(Object.keys(c.crans).sort(), ["dur", "facile", "tresdur"], `niveau ${c.niveau}`); assert.equal(applyCran(c, "conseille"), c); assert.equal(applyCran(c, "dur").crans, undefined); }
});

test("ligne : les nombres écrits et les formats suivent le tableau de la SPEC", async () => {
  const W = async (n, cran) => [...new Set((await qs(n, cran)).flatMap((q) => written(q)))].sort((a, b) => a - b);
  // niveau 1 : plus facile, 2 propositions et le premier saut ; plus dur 0, 5, 10 ; très dur 0 et 10
  const f1 = await qs(1, "facile"); assert.ok(f1.filter((q) => q.format === "lire").every((q) => q.choices.length === 2 && q.premierSaut));
  assert.deepEqual(await W(1, "dur"), [0, 5, 10]); assert.deepEqual(await W(1, "tresdur"), [0, 10]);
  assert.deepEqual(await W(2, "facile"), [0, 2, 4, 5, 6, 8, 10]); assert.deepEqual(await W(2, "dur"), [0, 10]);
  assert.ok((await qs(2, "tresdur")).every((q) => q.format === "placer"));
  assert.deepEqual(await W(3, "facile"), [0, 5, 10, 15, 20]); assert.deepEqual(await W(3, "dur"), [0, 20]);
  // niveau 4 : le milieu aussi écrit ; plus dur : cibles près du milieu ; très dur : 20 graduations
  for (const q of await qs(4, "facile")) assert.deepEqual(written(q), [q.min, q.min + 5, q.max]);
  for (const q of await qs(4, "dur")) assert.ok(q.target >= 10 / 3 && q.target <= 20 / 3, `cible ${q.target}`);
  for (const q of await qs(4, "tresdur")) { assert.equal(q.n, 21); assert.deepEqual(written(q), [q.min, q.max]); }
  assert.deepEqual(await W(5, "facile"), [0, 20, 40, 50, 60, 80, 100]); assert.deepEqual(await W(5, "dur"), [0, 100]);
  for (const q of await qs(6, "facile")) assert.ok(written(q).every((v) => v % 5 === 0) && written(q).length === 5);
  for (const q of await qs(6, "tresdur")) { assert.equal(q.max - q.min, 30); assert.deepEqual(written(q), [q.min, q.max]); }
  // niveau 7 : trois graduations écrites ; cible 3 à 5 sauts après ; deux graduations non voisines
  for (const q of await qs(7, "facile")) assert.equal(q.labelled.length, 3);
  for (const q of await qs(7, "dur")) { const hi = Math.max(...q.labelled); assert.ok(q.target - hi >= 3 && q.target - hi <= 5, `${q.target} ${hi}`); }
  for (const q of await qs(7, "tresdur")) assert.equal(q.labelled[1] - q.labelled[0], 2);
  // niveaux 8 et 13 : tolérances ; repère au cran plus facile
  assert.ok((await qs(8, "facile")).every((q) => q.tolerance === 10 && q.repere)); assert.ok((await qs(8, "dur")).every((q) => q.tolerance === 5)); assert.ok((await qs(8, "tresdur")).every((q) => q.tolerance === 3));
  assert.ok((await qs(13, "facile")).every((q) => q.tolerance === 80 && q.repere)); assert.ok((await qs(13, "tresdur")).every((q) => q.tolerance === 25));
  assert.deepEqual(await W(9, "dur"), [0, 1000]);
  for (const q of await qs(10, "tresdur")) { assert.equal(q.max - q.min, 200); assert.equal(q.n, 21); }
  for (const q of await qs(11, "tresdur")) assert.equal(q.n, 31);
});

test("dictée (niveau 12) : sans zéro et tableau ; un nombre sur deux avec un zéro ; zéros et « dix »", async () => {
  const z = (v) => String(v).includes("0"), dix = (v) => Math.floor(v / 10) % 10 === 1;
  const f = await qs(12, "facile"); assert.ok(f.every((q) => !z(q.answer) && q.tableau));
  const d = await qs(12, "dur", 20); assert.ok(d.every((q, i) => z(q.answer) === (i % 2 === 0)), d.map((q) => q.answer).join(" "));
  assert.ok((await qs(12, "tresdur")).every((q) => z(q.answer) || dix(q.answer)));
  for (const k of ["facile", "dur", "tresdur"]) assert.ok(dictationPool(applyCran(cfg(12), k), 1).every((v) => cfg(12).nombres.includes(v)), "toujours des nombres de la liste (leur voix existe)");
});

test("chaque nombre qu'un cran peut produire a sa voix (levelValues couvre les crans)", async () => {
  for (const n of [4, 6, 9, 10, 11]) { const V = new Set(levelValues(cfg(n))); for (const cran of ["facile", "dur", "tresdur"]) for (const q of await qs(n, cran, 40)) { assert.ok(V.has(q.answer) || q.answer <= 100, `niveau ${n} ${cran} : ${q.answer}`); for (const v of written(q)) assert.ok(V.has(v) || v <= 100, `${n} ${cran} écrit ${v}`); } }
});

test("le cran ne change rien sans niveau choisi (« jouer » : il décale le niveau, lot 2)", async () => {
  const R = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(2), seance: 1, cran: () => "dur", offset: () => 1 }).load();
  const q = R.next().q; assert.equal(q.niveau, 2); assert.equal(q.cran, undefined);
});

test("niveau choisi, cran « plus facile » : consolide sans faire progresser (ni montée, ni validation)", async () => {
  const R = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(3), seance: 1, choix: 1, cran: () => "facile" }).load(), ev = [];
  for (let i = 0; i < 12; i++) { const n = R.next(); ev.push(...(await R.record({ q: n.q, value: n.q.answer, ok: true, code: null, ms: 2000, listens: 1 }, n.cfg)).events); }
  assert.ok(!ev.some((e) => e.type === "montee")); assert.equal(R.st.niveau, 1);
  const U = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(3), seance: 1, choix: 3, cran: () => "facile" }).load();
  for (let i = 0; i < 12; i++) { const n = U.next(); await U.record({ q: n.q, value: n.q.answer, ok: true, code: null, ms: 2000, listens: 1 }, n.cfg); }
  assert.equal(U.st.niveau, 1, "pas de validation au-dessus du conseillé non plus");
});

test("additions, famille choisie : plus facile formes directes et aide d'emblée ; plus dur une question sur deux à trou ; très dur toutes", async () => {
  const run = async (cran) => {
    const store = await Store.open(new IDBFactory()); await store.put("niveaux", { ...initialFamilies(m2), ouvertes: [1, 2, 3, 4] });
    const m = await new Module2Runner({ store, content: m2, rnd: rng(9), seance: 1, cran: () => cran, choix: 4 }).load(), out = [];
    for (let i = 0; i < 20; i++) { const { q, cfg: c } = m.next(); out.push(q); await m.record({ q, value: expected(q), ok: true, ms: 2500, listens: 1 }, c); }
    return out;
  };
  const f = await run("facile"); assert.ok(f.every((q) => q.forme === "directe" && q.aideDEmblee));
  const c = await run("conseille"); assert.ok(c.every((q) => q.forme === "directe"), "formes à trou pas encore ouvertes pour la famille");
  const d = (await run("dur")).filter((q) => !q.revient), trouD = d.filter((q) => q.forme !== "directe").length; assert.ok(Math.abs(trouD - d.length / 2) <= 1, `${trouD} sur ${d.length}`);
  assert.ok((await run("tresdur")).every((q) => q.forme !== "directe"));
});
