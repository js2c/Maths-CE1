// Lot 3, étape 4 (docs/SPEC.md, « Module 3 » ; docs/SPEC-LOT3.md, section 6) : les 9 niveaux du calcul rapide
// (générés au hasard selon leurs paramètres), le chemin des ponts, les erreurs C1 à C5, le niveau conseillé et le
// déblocage, le déroulé d'un nouveau niveau (3 calculs guidés, puis le chemin au coquillage), les crans, la montée,
// la leçon d'une erreur répétée, le niveau choisi.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { answerOf, apply, calcsOf, chemin, classifyCalc, makeCalc } from "../../app/js/modules/calc/calc.js";
import { calcMastery, initialCalcState, Module3Runner, recommended } from "../../app/js/modules/calc/runner.js";
import { DAY, ruleFacts } from "../../app/js/modules/facts/facts.js";
import { chooseModule } from "../../app/js/session/session.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m3 = load("module3.json"), m2 = load("module2.json"), lecons = load("lecons.json");
const cfg = (n) => m3.niveaux[n - 1];
const open = () => Store.open(new IDBFactory());
const u = (n) => n % 10, t = (n) => Math.floor(n / 10);

test("les 9 niveaux : chaque calcul respecte la procédure du niveau (docs/SPEC.md)", () => {
  const all = (n) => calcsOf(cfg(n));
  assert.deepEqual(m3.niveaux.map((c) => c.niveau), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.ok(all(1).every((c) => [1, 2].includes(c.b)) && all(1).some((c) => c.op === "-"));
  assert.ok(all(2).every((c) => c.b === 10 && u(c.n) === u(c.a)));
  assert.ok(all(3).every((c) => c.b % 10 === 0 && c.b >= 20 && u(c.n) === u(c.a)));
  assert.ok(all(4).every((c) => c.op === "+" && t(c.n) === t(c.a)));
  assert.ok(all(5).every((c) => c.op === "-" && t(c.n) === t(c.a)));
  assert.ok(all(6).every((c) => c.b === 9 && c.op === "+"));
  assert.ok(all(7).every((c) => c.op === "+" && t(c.n) === t(c.a) + 1 && u(c.n) !== 0));
  assert.ok(all(8).every((c) => c.b >= 11 && u(c.a) + u(c.b) <= 9));
  assert.ok(all(9).every((c) => c.op === "-" && t(c.n) === t(c.a) - 1 && u(c.a) >= 1));
  for (let n = 1; n <= 9; n++) assert.ok(all(n).length >= 60 && all(n).every((c) => c.n >= 1 && c.n <= 100), `niveau ${n}`);
  // tirés au hasard : pas deux fois le même calcul parmi les 6 derniers
  const r = rng(3), seen = []; for (let i = 0; i < 40; i++) { const q = makeCalc(cfg(7), r, { eviter: seen.slice(-6) }); assert.ok(!seen.slice(-6).includes(`${q.a}${q.op}${q.b}`)); seen.push(`${q.a}${q.op}${q.b}`); }
});

test("le chemin des ponts : 38 → + 2 → 40 → + 3 → 43 ; 34 → + 10 → 44 → − 1 → 43 ; 42 → − 2 → 40 → − 3 → 37", () => {
  const path = (a, op, b, type) => chemin({ a, op, b, type }).map((s) => `${s.op}${s.k}>${s.a}`).join(" ");
  assert.equal(path(38, "+", 5, "passerPlus"), "+2>40 +3>43");
  assert.equal(path(34, "+", 9, "plus9"), "+10>44 -1>43");
  assert.equal(path(42, "-", 5, "passerMoins"), "-2>40 -3>37");
  assert.equal(path(23, "+", 30, "dizaines"), "+10>33 +10>43 +10>53");
  assert.equal(path(23, "+", 14, "deuxNombres"), "+10>33 +4>37");
  assert.equal(path(47, "+", 2, "petit"), "+2>49");
  for (let n = 1; n <= 9; n++) for (const c of calcsOf(cfg(n))) { const p = chemin({ ...c, type: cfg(n).type }); assert.equal(p.at(-1).a, c.n); assert.ok(p.length <= (cfg(n).type === "dizaines" ? c.b / 10 : 2), `${c.a}${c.op}${c.b}`); }
  // bornes élargies (décision du parent du 28 septembre) : les exemples de docs/SPEC.md sont tous dans leur niveau
  const has = (n, a, op, b) => calcsOf(cfg(n)).some((c) => c.a === a && c.op === op && c.b === b);
  for (const [n, a, op, b] of [[1, 47, "+", 2], [1, 60, "-", 1], [2, 34, "+", 10], [2, 57, "-", 10], [3, 23, "+", 30], [3, 68, "-", 20], [4, 34, "+", 5], [4, 62, "+", 7], [5, 38, "-", 5], [5, 47, "-", 3], [6, 34, "+", 9], [6, 56, "+", 9], [7, 38, "+", 5], [8, 23, "+", 14], [9, 42, "-", 5]]) assert.ok(has(n, a, op, b), `niveau ${n} : ${a} ${op} ${b}`);
  assert.equal(path(23, "+", 34, "deuxNombres"), "+30>53 +4>57");
});

test("erreurs C1, C3, C4, C5 reconnues ; forme à trou", () => {
  const q = (a, op, b, type) => ({ a, op, b, type, forme: "directe" });
  assert.equal(classifyCalc(q(34, "+", 10, "dizaine"), 35), "C1");
  assert.equal(classifyCalc(q(57, "-", 10, "dizaine"), 56), "C1");
  assert.equal(classifyCalc(q(23, "+", 30, "dizaines"), 26), "C1");
  assert.equal(classifyCalc(q(34, "+", 9, "plus9"), 44), "C3");
  assert.equal(classifyCalc(q(38, "+", 5, "passerPlus"), 33), "C4");
  assert.equal(classifyCalc(q(42, "-", 5, "passerMoins"), 43), "C5");
  assert.equal(classifyCalc(q(42, "-", 5, "passerMoins"), 37), null);
  assert.equal(classifyCalc(q(42, "-", 5, "passerMoins"), 30), "autre");
  assert.equal(answerOf({ a: 38, op: "+", b: 5, forme: "trou" }), 5); assert.equal(apply(42, "-", 5), 37);
});

test("niveau conseillé et déblocage : 1 dès le début ; 2 et 6 après 1 et 2 ; 4 quand les maisons de 5 à 7 sont en boîte 2 ; 7 avec les amis de 10 en boîte 3", () => {
  const st = (acquis) => ({ ...initialCalcState(), acquis });
  assert.equal(recommended(m3, st([])), 1);
  assert.equal(recommended(m3, st([1])), 2);
  assert.equal(recommended(m3, st([1, 2])), 3);
  assert.equal(recommended(m3, st([1, 2, 3])), 6, "4 attend les maisons de 5 à 7 ; 5 attend 4");
  assert.equal(recommended(m3, st([1, 2, 3]), { familyShare: (f, b) => (f === 4 && b === 2 ? 1 : 0) }), 4);
  assert.equal(recommended(m3, st([1, 2, 3, 4, 5, 6]), { familyShare: () => 0 }), 8);
  assert.equal(recommended(m3, st([1, 2, 3, 4, 5, 6, 8]), { familyShare: (f, b) => (f === 3 && b === 3 ? 0.9 : 1) }), 7);
  assert.equal(calcMastery(m3, st([1, 2, 3])), 3 / 9);
});

async function play(o = {}, n = 20, answer = () => true, ms = 3000) {
  const store = o.store ?? (await open()), R = await new Module3Runner({ store, content: m3, content2: m2, rnd: rng(5), seance: 1, cran: () => o.cran ?? "conseille", choix: o.choix ?? null }).load(), out = [], ev = [];
  for (let i = 0; i < n; i++) { const { q, cfg: c } = R.next(), ok = answer(q, i); out.push(q); const r = await R.record({ q, value: ok ? (q.forme === "trouDroite" ? q.b : q.n) : q.n + 1, ok, ms, listens: 1 }, c); ev.push(...r.events); }
  return { R, qs: out, ev, store };
}
test("déroulé d'un nouveau niveau : 3 calculs guidés (l'enfant remplit les ponts), puis le chemin au coquillage ; montée ; niveau suivant avec sa leçon", async () => {
  const { R, qs, ev } = await play({}, 16);
  assert.ok(qs.slice(0, 3).every((q) => q.guide && q.remplir && q.niveau === 1)); assert.ok(qs.slice(3, 6).every((q) => !q.guide && q.cheminMode === "coquillage"));
  assert.ok(ev.some((e) => e.type === "montee" && e.niveau === 1), "voie rapide : 5 justes et rapides");
  assert.ok(R.st.acquis.includes(1)); assert.ok(R.niveau >= 2);
  assert.ok(ev.some((e) => e.type === "lecon" && e.id === "L7" && e.raison === "niveau"), "L7 à l'entrée du niveau 2");
  assert.ok(lecons.L7 && lecons.L8 && lecons.L9, "leçons L7 à L9 dans le contenu");
});

test("crans : plus facile = le chemin d'emblée, sans promotion ; plus dur = sans chemin ; très dur = sans chemin, formes à trou", async () => {
  const store = await open(); await store.put("niveaux", { ...initialCalcState(), vus: { 3: 10 }, acquis: [1, 2] });
  const f = await play({ store, cran: "facile", choix: 3 }, 14); assert.ok(f.qs.every((q) => q.aideDEmblee && q.cheminMode === "emblee")); assert.ok(!f.R.st.acquis.includes(3), "plus facile : pas de montée");
  const d = await play({ cran: "dur", choix: 3, store: await (async () => { const s = await open(); await s.put("niveaux", { ...initialCalcState(), vus: { 3: 10 } }); return s; })() }, 6); assert.ok(d.qs.every((q) => q.cheminMode === "non" && q.forme === "directe"));
  const td = await play({ cran: "tresdur", choix: 3, store: await (async () => { const s = await open(); await s.put("niveaux", { ...initialCalcState(), vus: { 3: 10 } }); return s; })() }, 6); assert.ok(td.qs.every((q) => q.cheminMode === "non"));
  // lot 3 bis (A2) : au niveau 3 (pas fixe), la forme directe et le trou sur le nombre de départ, à parts égales ; au niveau 4, le trou sur le second nombre
  assert.deepEqual(td.qs.filter((q) => !q.revient).map((q) => q.forme), ["directe", "trouGauche", "directe", "trouGauche", "directe", "trouGauche"].slice(0, td.qs.filter((q) => !q.revient).length));
  const t4 = await play({ cran: "tresdur", choix: 4, store: await (async () => { const s = await open(); await s.put("niveaux", { ...initialCalcState(), vus: { 4: 10 } }); return s; })() }, 4); assert.ok(t4.qs.every((q) => q.forme === "trouDroite"));
  const t9 = await play({ cran: "tresdur", choix: 9, store: await (async () => { const s = await open(); await s.put("niveaux", { ...initialCalcState(), vus: { 9: 10 } }); return s; })() }, 4); assert.ok(t9.qs.every((q) => q.forme === "directe"), "niveau 9 : la forme à trou n'a pas de sens");
});

test("niveau choisi : toutes les questions à ce niveau (même au-dessus du conseillé) ; réussi, il est acquis ; échouer ne retire rien", async () => {
  const { R, qs } = await play({ choix: 7 }, 20);
  assert.ok(qs.every((q) => q.niveau === 7)); assert.ok(R.st.acquis.includes(7));
  const f = await play({ choix: 8 }, 20, () => false); assert.ok(f.qs.every((q) => q.niveau === 8)); assert.deepEqual(f.R.st.acquis, []);
});

test("la même erreur C4 deux fois : la leçon L9 (une fois) ; C2, juste mais lent, noté sans rien retirer", async () => {
  const store = await open(); await store.put("niveaux", { ...initialCalcState(), vus: { 7: 10 }, lecons: ["L9"] });
  const R = await new Module3Runner({ store, content: m3, content2: m2, rnd: rng(2), seance: 1, choix: 7 }).load(), ev = [];
  for (let i = 0; i < 4; i++) { const { q, cfg: c } = R.next(); const wrong = Math.floor(q.a / 10) * 10 + ((q.a % 10) + q.b) % 10; ev.push(...(await R.record({ q, value: wrong, ok: false, ms: 4000, listens: 1 }, c)).events); }
  assert.equal(ev.filter((e) => e.type === "lecon" && e.id === "L9").length, 1);
  const { q, cfg: c } = R.next(), r = await R.record({ q, value: q.n, ok: true, ms: R.lentMs + 500, listens: 1 }, c);
  assert.equal(r.code, "C2"); assert.equal(r.etoiles >= 1, true);
  const rep = (await store.all("reponses")).at(-1); assert.equal(rep.erreur, "C2"); assert.equal(rep.juste, true); assert.equal(rep.module, 3);
});

test("déblocage du niveau 4 : les maisons de 5 à 7 (famille 4) en boîte 2 ou plus", async () => {
  const store = await open(); await store.put("niveaux", { ...initialCalcState(), acquis: [1, 2, 3] });
  for (const f of ruleFacts(m2, 4)) await store.put("faits", { fait: f.fait, a: f.a, b: f.b, boite: 2, prochain: Date.now() + 5 * DAY, historique: [] });
  assert.equal((await new Module3Runner({ store, content: m3, content2: m2, rnd: rng(1) }).load()).niveau, 4);
});

test("« jouer » : rotation entre les trois modules, le moins maîtrisé d'abord, jamais deux fois de suite (sauf si les autres n'ont rien)", () => {
  const seance = load("seance.json"), s = (module, debut) => ({ module, debut, terminee: true });
  assert.deepEqual(seance.alternance.modules, [1, 2, 3]);
  assert.equal(chooseModule(seance, []).module, 1);
  assert.equal(chooseModule(seance, [s(1, 1)]).module, 2); assert.equal(chooseModule(seance, [s(1, 1), s(2, 2)]).module, 3); assert.equal(chooseModule(seance, [s(2, 2), s(3, 3)]).module, 1);
  const mastery = (m) => ({ 1: 0.5, 2: 0.4, 3: 0.1 })[m];
  assert.equal(chooseModule(seance, [s(1, 1)], null, () => true, mastery).module, 3, "le moins maîtrisé");
  assert.equal(chooseModule(seance, [s(3, 1)], null, () => true, mastery).module, 2, "jamais deux fois de suite");
  assert.equal(chooseModule(seance, [s(3, 1)], null, (m) => m === 3, mastery).module, 3, "sauf si les autres n'ont rien à proposer");
  assert.deepEqual(chooseModule(seance, [s(1, 1)], 3), { module: 3, impose: true }, "module imposé par le parent");
});
