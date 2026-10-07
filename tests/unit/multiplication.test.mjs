// Lot « Multiplication » (docs/SPEC.md, section 7 ter ; docs/maquettes/multiplication/PROPOSITION.md) : les 9 niveaux
// (les multiplications de chacun), la réponse et les formes à trou, les erreurs M1 et M2, le niveau conseillé et le
// déblocage, le déroulé (leçon d'entrée, exemples guidés, l'image des rangées selon le cran), la montée sur deux jours,
// la leçon d'une erreur répétée, le point de départ du parent, les phrases de la voix.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { allMults, astuceOf, classifyMult, makeMult, multAnswer, multQuestion, multsOf, tableFacts } from "../../app/js/modules/mult/mult.js";
import { initialMultState, Module5Runner, multMastery, recommendedMult } from "../../app/js/modules/mult/runner.js";
import { rowsLayout, ROWS_BIG, ROWS_SMALL } from "../../app/js/modules/mult/screen.js";
import { setMultLevel } from "../../app/js/parent/depart.js";
import { exerciseOf } from "../../app/js/session/lessons.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m5 = load("module5.json"), lecons = load("lecons.json"), textes = load("textes.json"), legendes = load("legendes.json");
const cfg = (n) => m5.niveaux[n - 1];
const open = () => Store.open(new IDBFactory());
const DAY = 86400e3, T0 = new Date(2027, 0, 4, 18).getTime();

test("les 9 niveaux : des rangées (2 à 5 rangées de 2 à 5), les tables de 2, 10, 5, le tour, les tables de 3 et 4, le mélange", () => {
  assert.deepEqual(m5.niveaux.map((c) => c.niveau), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (const n of [1, 2]) { const all = multsOf(cfg(n)); assert.equal(all.length, 16); assert.ok(all.every((x) => x.a >= 2 && x.a <= 5 && x.b >= 2 && x.b <= 5 && x.n === x.a * x.b)); }
  // une table : dans les deux sens, de 1 à 10 (2 × 7 et 7 × 2 ; 2 × 2 une seule fois)
  assert.equal(tableFacts(2).length, 19); assert.ok(tableFacts(2).some((x) => x.a === 7 && x.b === 2) && tableFacts(2).some((x) => x.a === 2 && x.b === 7));
  assert.deepEqual([3, 4, 5, 7, 8].map((n) => cfg(n).table), [2, 10, 5, 3, 4]);
  for (const n of [3, 4, 5, 7, 8]) assert.ok(multsOf(cfg(n)).every((x) => x.a === cfg(n).table || x.b === cfg(n).table));
  // le tour : jamais un carré ; la multiplication donnée est le tour de celle qu'on demande
  const tour = multsOf(cfg(6)); assert.ok(tour.length > 20 && tour.every((x) => x.a !== x.b));
  const q6 = makeMult(cfg(6), rng(3)); assert.deepEqual([q6.tour.a, q6.tour.b], [q6.b, q6.a]); assert.equal(q6.n, q6.a * q6.b);
  // le mélange : les tables de 2, 3, 4, 5 et 10, sans doublon ; tout produit au plus 100 (dit par le comptage)
  const nine = multsOf(cfg(9)); assert.equal(new Set(nine.map((x) => `${x.a}x${x.b}`)).size, nine.length);
  assert.ok(allMults(m5).every((x) => x.n <= 100));
  // niveau 1 : écrit en addition (« 4 + 4 + 4 »), niveau 2 : avec le signe ×
  const q1 = makeMult(cfg(1), rng(1)); assert.ok(q1.addition); assert.equal(multQuestion({ a: 3, b: 4, addition: true }), "4 + 4 + 4");
  assert.ok(!makeMult(cfg(2), rng(1)).addition); assert.equal(multQuestion({ a: 3, b: 4 }), "3 × 4");
});

test("la réponse, les formes à trou, les erreurs M1 (a additionné) et M2 (une rangée ou une colonne de trop ou de moins)", () => {
  assert.equal(multAnswer({ a: 3, b: 4 }), 12); assert.equal(multAnswer({ a: 3, b: 4, forme: "trouDroite" }), 4); assert.equal(multAnswer({ a: 3, b: 4, forme: "trouGauche" }), 3);
  assert.equal(multQuestion({ a: 3, b: 4, n: 12, forme: "trouDroite" }), "3 × ? = 12"); assert.equal(multQuestion({ a: 3, b: 4, n: 12, forme: "trouGauche" }), "? × 4 = 12");
  const q = { a: 3, b: 4, n: 12 };
  assert.equal(classifyMult(q, 12), null); assert.equal(classifyMult(q, 7), "M1");
  for (const v of [8, 16, 9, 15]) assert.equal(classifyMult(q, v), "M2", String(v));
  assert.equal(classifyMult(q, 13), "autre"); assert.equal(classifyMult({ a: 2, b: 2, n: 4 }, 4), null, "2 × 2 = 2 + 2 : pas une erreur");
  assert.equal(classifyMult({ ...q, forme: "trouDroite" }, 7), "autre", "à trou : pas de code");
});

test("l'astuce dite avant de compter : celle de la table du niveau (fois 2, 4, 5, 10), aucune aux niveaux des rangées", () => {
  assert.equal(astuceOf({ type: "table", table: 2, a: 7, b: 2 }), 2); assert.equal(astuceOf({ type: "table", table: 3, a: 3, b: 7 }), null); assert.equal(astuceOf({ type: "table", table: 3, a: 3, b: 4 }), 4, "sinon, celle de l'autre facteur");
  assert.equal(astuceOf({ type: "tables", a: 5, b: 7 }), 5); assert.equal(astuceOf({ type: "groupes", a: 2, b: 4 }), null);
  for (const t of ["2", "4", "5", "10"]) assert.ok(textes.multAstuce[t]);
});

test("le niveau conseillé et le déblocage : dans l'ordre, le point de départ du parent ouvre un niveau", async () => {
  const st = initialMultState(T0);
  assert.equal(recommendedMult(m5, st), 1);
  assert.equal(recommendedMult(m5, { ...st, acquis: [1, 2] }), 3);
  assert.equal(recommendedMult(m5, { ...st, acquis: [1, 2, 3, 4, 5] }), 6);
  assert.equal(recommendedMult(m5, { ...st, acquis: [1, 2, 3, 4, 5, 6, 7, 8] }), 9);
  assert.equal(recommendedMult(m5, { ...st, acquis: [1, 2, 3, 4, 5, 6, 7, 8, 9] }), 9, "tout acquis : le dernier");
  assert.equal(multMastery(m5, { acquis: [1, 2, 3] }), 3 / 9);
  const store = await open(); const p = await setMultLevel(store, 5, T0);
  assert.deepEqual(p.acquis, [1, 2, 3, 4]); assert.equal(p.depart, 5); assert.ok(p.obtenus.at(-1).parent);
  assert.equal((await new Module5Runner({ store, content: m5, rnd: rng(1), clock: () => T0 }).load()).niveau, 5);
});

test("le déroulé : la leçon d'entrée (L13 au niveau 1, L14 au niveau 6), l'exemple guidé ; l'image selon le niveau et le cran ; le trou au cran « très dur »", async () => {
  const r = await new Module5Runner({ store: await open(), content: m5, rnd: rng(2), clock: () => T0 }).load();
  assert.equal(r.entryLesson(), "L13"); r.lessonPlayed("L13"); assert.equal(r.entryLesson(), null);
  const g = r.next({ guide: true }).q; assert.ok(g.guide && g.module === 5 && g.niveau === 1); assert.equal(g.image, "toujours");
  assert.equal(cfg(6).lecon, "L14");
  const mk = async (cran, niveau) => new Module5Runner({ store: await open(), content: m5, rnd: rng(4), cran: () => cran, choix: niveau, clock: () => T0 }).load();
  assert.equal((await mk("conseille", 3)).next().q.image, "aide");
  const fac = (await mk("facile", 3)).next().q; assert.equal(fac.image, "emblee"); assert.ok(fac.aideDEmblee);
  assert.equal((await mk("dur", 1)).next().q.image, "non", "plus dur : sans image, même aux rangées");
  const td = await mk("tresdur", 3), formes = [td.next().q.forme, td.next().q.forme, td.next().q.forme];
  assert.deepEqual(formes, ["trouDroite", "trouGauche", "trouDroite"]);
  assert.equal((await mk("tresdur", 6)).next().q.forme, "directe", "pas de trou au niveau du tour");
});

test("la montée : 8 sur 10 au plus une aide, sur deux jours au moins ; la leçon L13 après deux fois la même erreur", async () => {
  let now = T0; const store = await open();
  const r = await new Module5Runner({ store, content: m5, rnd: rng(5), clock: () => now }).load(); r.lessonPlayed("L13");
  const answer = async (ok, value) => { const { q, cfg: c } = r.next(); return r.record({ q, ok, value: ok ? multAnswer(q) : value ?? multAnswer(q) + 1, ms: 2500, listens: 0, aide: false }, c); };
  for (let i = 0; i < 12; i++) await answer(true);
  assert.deepEqual(r.st.acquis, [], "un seul jour : pas encore acquis (même par la voie rapide)");
  now = T0 + DAY; let up = false;
  for (let i = 0; i < 4 && !up; i++) up = (await answer(true)).events.some((e) => e.type === "montee");
  assert.ok(up); assert.deepEqual(r.st.acquis, [1]); assert.equal(r.niveau, 2);
  // M1 deux fois dans la séance : la leçon L13, une seule fois (déjà jouée ici : rien) ; dans une séance neuve, elle revient
  const r2 = await new Module5Runner({ store: await open(), content: m5, rnd: rng(6), choix: 3, clock: () => now }).load();
  const m1 = async () => { const { q, cfg: c } = r2.next(); return r2.record({ q, ok: false, value: q.a + q.b === q.n ? -1 : q.a + q.b, ms: 3000, listens: 0, aide: false }, c); };
  const e1 = await m1(), e2 = await m1();
  assert.ok(!e1.events.some((e) => e.type === "lecon")); assert.ok(e2.events.some((e) => e.type === "lecon" && e.id === "L13" && e.raison === "M1"));
  const rows = await store.all("reponses"); assert.ok(rows.every((x) => x.module === 5 && x.question && x.attendue !== undefined));
});

test("« À toi ! » des leçons L13 et L14 : la multiplication, niveaux 1 et 6 ; la légende et les noms dits", () => {
  assert.deepEqual(exerciseOf(lecons, "L13"), { module: 5, niveau: 1, apresLecon: "L13" });
  assert.deepEqual(exerciseOf(lecons, "L14"), { module: 5, niveau: 6, apresLecon: "L14" });
  assert.equal(legendes.multiplication.length, 9); for (let n = 1; n <= 9; n++) assert.ok(textes.choixMult[n], String(n));
  assert.ok(textes.choixNom.multiplication && textes.choixTableMult && textes.choixLeconNom.L13 && textes.choixLeconNom.L14);
});

test("les rangées tiennent dans leur place, poissons d'au moins 0,5 fois leur taille, même à 10 rangées de 10", () => {
  for (const Z of [ROWS_SMALL, ROWS_BIG]) for (const [a, b] of [[2, 2], [5, 5], [10, 4], [4, 10], [10, 10]]) {
    if (Z === ROWS_SMALL && (a > 5 || b > 5)) continue;
    const L = rowsLayout(a, b, Z), [x0, y0] = L.at(0, 0), [x1, y1] = L.at(a - 1, b - 1), [xe] = L.end(0);
    assert.ok(x0 - 36 * L.k >= Z.cx - Z.w / 2 - 1 && xe + 40 <= Z.cx + Z.w / 2 + 40, `${a} × ${b} en largeur`);
    assert.ok(y0 - 22 * L.k >= Z.top - 1 && y1 + 22 * L.k <= Z.top + Z.h + 1, `${a} × ${b} en hauteur`);
    assert.ok(L.k >= 0.5, `${a} × ${b} : ${L.k}`); void x1;
  }
});

test("la voix : chaque multiplication posée a sa consigne et sa correction ; la table de multiplication, ses 100 cases", () => {
  const I = inventaire();
  for (const x of allMults(m5)) { assert.ok(I.has(`${x.a} fois ${x.b} ?`), `${x.a} × ${x.b}`); assert.ok(I.has(`${x.a} fois ${x.b}, ça fait ${x.n}.`)); }
  assert.ok(I.has("3 fois combien, ça fait 12 ?") && I.has("Combien de fois 4, ça fait 12 ?"));
  assert.ok(I.has("3 rangées de 4 poissons.") && I.has("Une rangée de 4 poissons.") && I.has("Et 5 fois 3 ?"));
  assert.ok(I.has("10 fois 10, 100.") && I.has("1 fois 1, 1."));
});
