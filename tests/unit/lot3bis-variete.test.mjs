// Lot 3 bis, étape 1 (docs/SPEC-LOT3BIS.md, §0, A1, A2, A4) : la réponse qui varie ; les formes à trou des amis de 10 et
// des maisons et leur alternance ; les faits nouveaux tirés au hasard ; l'acquisition à trou et sur deux séances ; le trou
// sur le nombre de départ au calcul « très dur » ; le mélange choisi sur une base neuve.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { checkSequence, MANQUE, Variete } from "../../app/js/modules/variete.js";
import { catalog, DAY, expected, orderFresh, ruleFacts, trouPartOf, trouTurn } from "../../app/js/modules/facts/facts.js";
import { initialFamilies, isAcquired } from "../../app/js/modules/facts/families.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { answerOf, classifyCalc } from "../../app/js/modules/calc/calc.js";
import { calcAnswer, calcQuestion, initialCalcState, Module3Runner } from "../../app/js/modules/calc/runner.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m2 = load("module2.json"), m3 = load("module3.json"), seance = load("seance.json"), T = load("textes.json");
const NOW = new Date(2026, 9, 1, 18, 0).getTime();
const open = () => Store.open(new IDBFactory());

// ---------------------------------------------------------------- §0
test("variété : les réglages sont dans le contenu ; le contrôle reconnaît chacune des quatre règles", () => {
  assert.deepEqual({ ...seance.variete, _doc: undefined }, { _doc: undefined, valeursMin: 5, memeReponseSuite: 2, suiteMax: 3, memeQuestionMax: 3 });
  const s = (xs) => xs.map((v, i) => ({ cle: `q${i}`, reponse: v }));
  assert.deepEqual(checkSequence(s([1, 5, 2, 8, 3, 7, 4])), []);
  assert.match(checkSequence(s([10, 10, 10, 10, 10])).join(), /réponses différentes/);
  assert.match(checkSequence(s([1, 5, 5, 5, 2, 8, 3])).join(), /3 fois de suite 5/);
  assert.match(checkSequence(s([9, 2, 4, 6, 8, 1, 7])).join(), /suite de pas 2/);
  const cyc = [9, 1, 3, 7, 9, 1, 3, 7].map((v) => ({ cle: `lire:${v}`, reponse: v }));
  assert.match(checkSequence(cyc).join(), /même suite de 4 questions/);
  assert.match(checkSequence([1, 2, 3, 4, 1, 5, 1, 6, 1].map((v, i) => ({ cle: v === 1 ? "x" : `q${i}`, reponse: v }))).join(), /posée 4 fois/);
});

test("variété : le coût d'un candidat suit les règles ; une question déjà posée 3 fois (retours prévus compris) est bloquée", () => {
  const V = new Variete(seance.variete);
  for (const [cle, reponse] of [["a", 4], ["b", 4]]) V.note({ cle, reponse });
  assert.ok(V.cost({ cle: "c", reponse: 4 }) >= MANQUE, "trois fois de suite 4");
  assert.ok(V.cost({ cle: "c", reponse: 6 }) < MANQUE);
  const W = new Variete(); for (const v of [3, 5, 7]) W.note({ cle: `k${v}`, reponse: v });
  assert.ok(W.cost({ cle: "k9", reponse: 9 }) >= MANQUE, "3, 5, 7, 9 : une suite prévisible");
  const X = new Variete(); for (const [cle, reponse] of [["a", 1], ["b", 2], ["a", 1], ["c", 6]]) X.note({ cle, reponse });
  assert.ok(X.cost({ cle: "a", reponse: 1 }, { attente: 1 }) >= MANQUE, "deux passages et un retour prévu : bloquée");
  assert.ok(X.cost({ cle: "a", reponse: 1 }, { attente: 1, retour: true }) < MANQUE, "le retour prévu lui-même passe");
  assert.ok(X.cost({ cle: "b", reponse: 2 }) < MANQUE && X.cost({ cle: "c", reponse: 7 }) >= MANQUE, "jamais deux fois de suite la même question");
});

// ---------------------------------------------------------------- A1 : formes à trou
test("A1 : parts de formes à trou des familles 3 à 5 à chaque cran (réglages) ; répartition régulière", () => {
  const P = (id) => ["facile", "conseille", "dur", "tresdur"].map((k) => Math.round(trouPartOf(m2, id, k) * 100) / 100);
  assert.deepEqual(P(3), [1, 1, 1, 1]); assert.deepEqual(P(5), [0.67, 0.67, 1, 1]); assert.deepEqual(P(4), [0.5, 0.5, 0.67, 1]);
  assert.equal(trouPartOf(m2, 1, "conseille"), undefined, "les autres familles gardent leurs règles");
  const turns = (p) => Array.from({ length: 6 }, (_, i) => trouTurn(p, i + 1));
  assert.deepEqual(turns(0.5), [false, true, false, true, false, true]); assert.deepEqual(turns(0.6667), [false, true, true, false, true, true]);
});

async function play(store, { famille = null, cran = "conseille", n = 30, answer = () => true, rnd = rng(5) } = {}) {
  const m = await new Module2Runner({ store, content: m2, rnd, seance: 1, clock: () => NOW, cran: () => cran, choix: famille, variete: seance.variete }).load(), qs = [];
  for (let i = 0; i < n; i++) { const x = m.next(); if (!x) break; const ok = answer(x.q); qs.push(x.q); await m.record({ q: x.q, value: ok ? expected(x.q) : 99, ok, ms: 2500, listens: 1 }, x.cfg); }
  return { m, qs };
}
const fam = (id) => new Set(ruleFacts(m2, id).map((f) => f.fait));

test("A1 : amis de 10, toutes les questions à trou à tous les crans ; les deux formes alternent ; jamais « 10 » comme réponse", async () => {
  for (const cran of ["facile", "conseille", "dur", "tresdur"]) {
    const { qs } = await play(await open(), { famille: 3, cran }), f3 = qs.filter((q) => fam(3).has(q.fait));
    assert.ok(f3.length >= 10, `${cran} : ${f3.length}`);
    assert.ok(f3.every((q) => q.forme !== "directe"), `${cran} : ${f3.map((q) => q.forme).join(" ")}`);
    assert.ok(f3.every((q) => expected(q) !== 10));
    const fresh = f3.filter((q) => !q.revient).map((q) => q.forme); assert.ok(fresh.every((x, i) => !i || x !== fresh[i - 1]), `${cran} : alternance`);
    if (cran === "facile") assert.ok(f3.every((q) => q.aideDEmblee && q.appui === "cadre"), "plus facile : le cadre de 10 d'emblée");
  }
});

test("A1 : maisons de 8 et 9, deux sur trois à trou (plus facile, conseillé), toutes au-delà ; l'échauffement suit la même part", async () => {
  const part = (qs) => { const f = qs.filter((q) => fam(5).has(q.fait) && !q.revient); return f.filter((q) => q.forme !== "directe").length / f.length; };
  assert.ok(Math.abs(part((await play(await open(), { famille: 5, cran: "conseille" })).qs) - 2 / 3) < 0.1);
  assert.equal(part((await play(await open(), { famille: 5, cran: "dur" })).qs), 1);
  // l'échauffement : un fait des amis de 10 est posé à trou, même nouveau
  const store = await open(); await store.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2, 3] });
  const W = await new Warmup({ store, content: m2, rnd: rng(3), seance: 1, clock: () => NOW }).load();
  const qs = ["7+3", "3+7", "6+4", "1+2"].map((k) => { const c = catalog(m2).find((f) => f.fait === k); return W.prepare({ ...c, nouveau: true }); });
  assert.deepEqual(qs.map((q) => q.forme), ["trouDroite", "trouGauche", "trouDroite", "directe"]);
});

// ---------------------------------------------------------------- A1 : faits nouveaux
test("A1 : faits nouveaux tirés au hasard dans leur famille, l'autre ordre des termes juste après", () => {
  const f3 = catalog(m2).filter((f) => f.famille === 3), orders = new Set();
  for (let s = 1; s <= 6; s++) {
    const o = orderFresh(f3, rng(s)); orders.add(o.map((f) => f.fait).join(" "));
    for (let i = 0; i < o.length; i += 2) if (o[i + 1]) assert.deepEqual([o[i + 1].a, o[i + 1].b], [o[i].b, o[i].a], "les deux ordres à la suite");
  }
  assert.ok(orders.size >= 4, "plus l'ordre du catalogue (1 + 9, 2 + 8…)");
  assert.deepEqual(orderFresh(f3).map((f) => f.fait), f3.map((f) => f.fait), "sans hasard : le catalogue");
  const mixed = orderFresh(catalog(m2).filter((f) => f.famille <= 3), rng(2)); assert.ok(mixed.every((f, i) => !i || f.famille >= mixed[i - 1].famille), "les familles restent dans leur ordre");
});

test("A1 : en notion du jour, la famille choisie introduit ses faits au hasard, les deux ordres dans la séance", async () => {
  const firsts = new Set();
  for (let s = 1; s <= 5; s++) {
    const { qs } = await play(await open(), { famille: 5, rnd: rng(s * 11) }), nw = qs.filter((q) => q.nouveau && !q.revient);
    firsts.add(nw[0].fait);
    const seen = new Set(qs.map((q) => q.fait)); assert.ok(nw.every((q) => q.a === q.b || seen.has(`${q.b}+${q.a}`)), "l'autre ordre apparaît aussi");
  }
  assert.ok(firsts.size >= 3, [...firsts].join(" "));
});

// ---------------------------------------------------------------- A1 : acquisition
test("A1 : une famille ne s'acquiert plus en une seule séance ; la séance suivante, un autre jour, peut la faire acquérir", async () => {
  const store = await open(); await store.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  const one = await play(store, { famille: 3, n: 40 });
  assert.ok(!one.m.fam.acquises.includes(3), "une séance parfaite ne suffit pas");
  const faits = await store.all("faits"); assert.ok(ruleFacts(m2, 3).filter((r) => faits.find((f) => f.fait === r.fait)?.boite >= 3).length >= 8, "pourtant presque tout est en boîte 3");
  // le lendemain
  const m = await new Module2Runner({ store, content: m2, rnd: rng(7), seance: 2, clock: () => NOW + DAY, cran: () => "conseille", choix: 3 }).load(); let up = false;
  for (let i = 0; i < 30 && !up; i++) { const x = m.next(); if (!x) break; up = (await m.record({ q: x.q, value: expected(x.q), ok: true, ms: 2500, listens: 1 }, x.cfg)).events.some((e) => e.type === "montee"); }
  assert.ok(up, "acquise le lendemain");
  assert.ok(isAcquired(m2, await store.all("faits"), 3));
});

// ---------------------------------------------------------------- A4 : mélange
test("A4 : mélange choisi sur une base neuve : des faits des familles 1 à 3, variés, au plus 3 passages par fait", async () => {
  const { qs, m } = await play(await open(), { famille: 7, n: 40 });
  assert.equal(m.famille, 7);
  const fams = new Set(qs.map((q) => catalog(m2).find((f) => f.fait === q.fait).famille)); assert.deepEqual([...fams].sort(), [1, 2, 3]);
  assert.ok(qs.length >= 30, `${qs.length} questions`);
  const n = {}; qs.forEach((q) => { n[q.fait] = (n[q.fait] ?? 0) + 1; }); assert.ok(Object.values(n).every((x) => x <= 3));
  assert.deepEqual(checkSequence(qs.map((q) => ({ cle: q.fait, reponse: expected(q) }))), []);
});

// ---------------------------------------------------------------- A2 : calcul « très dur »
test("A2 : calcul « très dur » aux niveaux à pas fixe : la forme directe et le trou sur le départ, à parts égales, réponses variées", async () => {
  for (const niveau of [1, 2, 3, 6]) {
    const store = await open(); await store.put("niveaux", { ...initialCalcState(NOW), vus: { [niveau]: 10 } });
    const R = await new Module3Runner({ store, content: m3, content2: m2, rnd: rng(niveau), seance: 1, cran: () => "tresdur", choix: niveau, variete: seance.variete }).load(), qs = [];
    for (let i = 0; i < 30; i++) { const x = R.next(); qs.push(x.q); await R.record({ q: x.q, value: calcAnswer(x.q), ok: true, ms: 3000, listens: 1 }, x.cfg); }
    assert.ok(qs.every((q) => q.forme !== "trouDroite"), `niveau ${niveau} : plus de trou sur le pas`);
    assert.equal(qs.filter((q) => q.forme === "trouGauche").length, 15, `niveau ${niveau}`);
    assert.ok(new Set(qs.map(calcAnswer)).size >= 5, `niveau ${niveau} : réponses variées`);
    assert.deepEqual(checkSequence(qs.map((q) => ({ cle: `${q.a}${q.op}${q.b}`, reponse: calcAnswer(q) }))), [], `niveau ${niveau}`);
  }
  assert.deepEqual(m3.niveaux.filter((c) => c.trouDepart).map((c) => c.niveau), [1, 2, 3, 6]);
  assert.deepEqual(m3.niveaux.filter((c) => c.trou).map((c) => c.niveau), [4, 5, 7, 8]);
  // la réponse, la question pour le parent, la voix, une erreur
  const q = { a: 47, op: "+", b: 10, n: 57, forme: "trouGauche" };
  assert.equal(calcAnswer(q), 47); assert.equal(answerOf(q), 47); assert.equal(calcQuestion(q), "? + 10 = 57"); assert.equal(expected(q), 47);
  assert.equal(calcQuestion({ a: 47, op: "-", b: 2, n: 45, forme: "trouGauche" }), "? − 2 = 45");
  assert.equal(classifyCalc(q, 47), null); assert.equal(classifyCalc(q, 57), "autre");
  assert.equal(T.calcTrouDepartPlus, "Combien plus {b} ? Ça fait {n}.");
});

test("un fait introduit par un exemple guidé n'est plus un exemple guidé ensuite (correction du lot 3 bis) ; les faits déjà rangés ainsi sont nettoyés", async () => {
  const store = await open(); await store.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2, 3], acquises: [1, 2], notion: [3], lecons: ["L5"] });
  await store.put("faits", { fait: "6+4", a: 6, b: 4, famille: 3, boite: 1, prochain: NOW, historique: [], guide: true, appui: "cadre" });
  const m = await new Module2Runner({ store, content: m2, rnd: rng(3), seance: 1, clock: () => NOW, cran: () => "facile", choix: 3 }).load(), qs = [];
  assert.ok(m.facts().every((f) => !("guide" in f) && !("appui" in f)), "nettoyé au chargement");
  for (let i = 0; i < 14; i++) { const x = m.next({ guide: i < 2 }); qs.push({ guide: !!x.q.guide, i }); await m.record({ q: x.q, value: expected(x.q), ok: true, ms: 2500, listens: 1 }, x.cfg); }
  assert.deepEqual(qs.filter((q) => q.guide).map((q) => q.i), [0, 1]);
  assert.ok((await store.all("faits")).every((f) => !f.guide));
});
