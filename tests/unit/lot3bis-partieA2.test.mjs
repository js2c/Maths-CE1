// Lot 3 bis, étape 2 (docs/SPEC-LOT3BIS.md, A3, A5, A6) : repères de la ligne et tirage sans remise ; niveau 1 (voisins et
// trajet cachés) ; E3 en « sauter » sans L3 ; le pavé ignoré pendant un retour et le double toucher ; la reprise avec la
// consigne .
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { repriseText, TapGate } from "../../app/js/engine/toucher.js";
import { applyCran, makeEstimate, makeJump, makePlace, makeRead, makeWrite, questionKey } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { checkSequence } from "../../app/js/modules/variete.js";
import { fill } from "../../app/js/engine/phrases.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m1 = load("module1.json"), seance = load("seance.json"), cartes = load("cartes.json"), cal = load("calendrier.json"), T = load("textes.json");
const gen = (c, r, o = {}) => (o.format === "ecrire" ? makeWrite(c, r, o) : o.format === "sauter" ? makeJump(c, r) : o.format === "placer" ? makePlace(c, r, o) : o.format === "estimer" ? makeEstimate(c, r, o) : makeRead(c, r, o));
const mk = async (o = {}) => new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(o.seed ?? 4), seance: 1, variete: seance.variete, ...o }).load();
const written = (q) => q.labelled.map((i) => q.min + i * q.step);

// ---------------------------------------------------------------- A3 : repères et tirage sans remise
test("A3 : « plus facile » des niveaux 2, 5, 9 : un repère de plus (2 et 8, 20 et 80, 200 et 800) ; au moins 6 cibles", () => {
  for (const [n, labels] of [[2, [0, 2, 5, 8, 10]], [5, [0, 20, 50, 80, 100]], [9, [0, 200, 500, 800, 1000]]]) {
    const cfg = applyCran(m1.niveaux[n - 1], "facile"); assert.deepEqual(cfg.labels, labels);
    const cibles = new Set(); for (let s = 0; s < 200; s++) cibles.add(makeRead(cfg, rng(s)).answer);
    assert.ok(cibles.size >= 6, `niveau ${n} : ${[...cibles].sort((a, b) => a - b).join(" ")}`);
  }
});

test("A3 : tirage sans remise : chaque tour passe toutes les cibles, jamais dans le même ordre, la première d'un tour n'est pas la dernière du précédent", async () => {
  const R = await mk({ choix: 2, cran: () => "facile", seed: 11 }), lire = [];
  for (let i = 0; i < 60; i++) { const x = R.next(); if (!x) break; lire.push(x.q); await R.record({ q: x.q, value: x.q.answer, ok: true, code: null, ms: 3000, listens: 1 }, x.cfg); }
  const cibles = lire.map((q) => q.answer), tour = 6, tours = [];
  for (let i = 0; i + tour <= cibles.length; i += tour) tours.push(cibles.slice(i, i + tour));
  assert.ok(tours.length >= 3, `${cibles.length} questions`);
  for (const t of tours) assert.deepEqual([...t].sort((a, b) => a - b), [1, 3, 4, 6, 7, 9], `un tour : ${t.join(" ")}`);
  for (let i = 1; i < tours.length; i++) { assert.notDeepEqual(tours[i], tours[i - 1]); assert.notEqual(tours[i][0], tours[i - 1].at(-1)); }
  assert.deepEqual(checkSequence(lire.map((q) => ({ cle: questionKey(q), reponse: q.answer }))), []);
  // les propositions pièges reconstruites à chaque question (celles de lire)
  const props = lire.filter((q) => q.format === "lire").map((q) => q.choices.map((c) => c.value).join("/"));
  assert.ok(new Set(props).size >= 5);
});

test("A3 : niveau 1 : en « lire », la cible et ses voisins cachés (sauf les extrémités) ; en « sauter », le trajet caché", () => {
  const cfg = m1.niveaux[0];
  for (let s = 0; s < 60; s++) {
    const q = makeRead(cfg, rng(s)), w = written(q), t = q.target;
    for (const i of [t - 1, t, t + 1]) if (i > 0 && i < 10) assert.ok(!w.includes(i), `lire : ${w.join(" ")} (cible ${t})`);
    assert.ok(w.includes(0) && w.includes(10));
    const j = makeJump(cfg, rng(s)), wj = written(j);
    for (let i = j.start + 1; i <= j.target; i++) if (i < 10) assert.ok(!wj.includes(i), `sauter : ${wj.join(" ")} (${j.start} + ${j.jumps})`);
    assert.ok(wj.includes(j.start) || j.start === j.target, "le départ reste écrit");
  }
});

test("A3 : E3 au format « sauter » ne relance jamais L3 ; E3 en « lire » sur une corde qui ne commence pas à 0, si", async () => {
  const R = await mk({ choix: 1 }), ev = [];
  for (let i = 0; i < 12; i++) { const x = R.next(); if (!x) break; const q = { ...x.q, format: "sauter", start: 2, jumps: 3, answer: 5 }; const r = await R.record({ q, value: 3, ok: false, code: "E3", ms: 3000, listens: 1 }, x.cfg); ev.push(...r.events); }
  assert.ok(!ev.some((e) => e.type === "lecon" && e.id === "L3"), JSON.stringify(ev.filter((e) => e.type === "lecon")));
  assert.equal(fill(T.erreur.E3sauter, { a: 2 }), "La tortue part de 2, pas de zéro. On compte les sauts à partir d'elle.");
  const S = await mk({ choix: 4 }), ev2 = [];
  for (let i = 0; i < 4; i++) { const x = S.next(); const q = { ...x.q, format: "lire" }; const r = await S.record({ q, value: q.answer - q.min, ok: false, code: "E3", ms: 3000, listens: 1 }, x.cfg); ev2.push(...r.events); }
  assert.ok(ev2.some((e) => e.type === "lecon" && e.id === "L3"), "L3 pour E3 en « lire » sur la ligne 30–40");
});

// ---------------------------------------------------------------- A5 : toucher et reprise
test("A5 : le pavé ignoré pendant un retour ; un second toucher de la même touche en moins de 150 ms ignoré", () => {
  assert.equal(seance.toucher.doubleMs, 150);
  const G = new TapGate(seance.toucher);
  assert.ok(G.accept("7", 1000)); assert.ok(!G.accept("7", 1060), "double toucher à 60 ms"); assert.ok(G.accept("7", 1300), "un vrai second 7");
  assert.ok(G.accept("4", 1310), "une autre touche aussitôt"); assert.ok(G.accept("7", 1330));
  G.close(); assert.ok(!G.accept("5", 5000), "pendant le « bravo »"); assert.ok(!G.accept("valider", 6000));
  G.open(); assert.ok(G.accept("5", 7000), "la question suivante est affichée");
});

test("A5 : la reprise redit la consigne quand la séance attendait une réponse (les trois modules)", () => {
  for (const consigne of ["L'étoile de mer est posée sur une bouée. Quel est ce nombre ?", "7 plus combien, ça fait 10 ?", "Combien plus 10 ? Ça fait 57."])
    assert.equal(repriseText({ attend: true, consigne, reprise: T.reprise }), `${T.reprise} ${consigne}`);
  assert.equal(repriseText({ attend: false, consigne: "x", reprise: T.reprise }), null, "pendant une correction : la phrase coupée reprend, rien de plus");
  assert.equal(repriseText({ attend: true, consigne: null, reprise: T.reprise }), null);
});

// ---------------------------------------------------------------- A6 : décors du doublon
// (supprimés le 5 octobre 2026, décision du parent : jamais de doublon ; les nouvelles règles sont testées par
// tests/unit/cartes.test.mjs et tests/unit/recompenses-sans-doublon.test.mjs)
