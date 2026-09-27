// Lot 2, étape 2 (docs/SPEC-LOT2.md, section 3) : places réservées, voie rapide des faits, une boîte au plus par
// séance, limite commune de 6 faits nouveaux, questions triviales une séance sur cinq, effets du cran du
// sélecteur de difficulté sur l'échauffement (faits nouveaux, formes à trou).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { afterFact, catalog, DAY, expected, formFor, plan } from "../../app/js/modules/facts/facts.js";
import { Warmup, describeFact } from "../../app/js/modules/facts/warmup.js";

const c = JSON.parse(readFileSync(new URL("../../app/content/module2.json", import.meta.url)));
const NOW = new Date(2026, 9, 1, 18, 0).getTime();
const open = () => Store.open(new IDBFactory());
// joue une file de questions : answer(q) -> { juste, ms }
async function play(W, rest, answer) {
  const asked = [];
  while (rest.length) {
    const q = W.prepare(rest.shift()); if (!q) continue;
    const a = answer(q); asked.push(q);
    await W.record(q, { value: a.juste ? expected(q) : 99, ms: a.ms ?? 2500, listens: 1 }, rest);
  }
  return asked;
}

test("réglages du lot 2 dans module2.json (jamais en dur dans le code)", () => {
  assert.equal(c.placesReservees, 3); assert.equal(c.nouveauxMaxSeance, 6); assert.deepEqual(c.voieRapide, { boite: 3, ajoutMax: 3 }); assert.equal(c.base.uneSeanceSur, 5);
});

test("voie rapide : un fait nouveau juste, rapide et sans aide entre en boîte 3 ; lent, avec aide ou faux : boîte 1 ou 2", () => {
  const f = { fait: "3+1", a: 3, b: 1, famille: 1, boite: 1, prochain: NOW, historique: [] };
  assert.equal(afterFact(c, f, { juste: true, ms: 2000, seance: 1 }, 7000, NOW).boite, 3);
  assert.equal(afterFact(c, f, { juste: true, ms: 9000, seance: 1 }, 7000, NOW).boite, 1);
  assert.equal(afterFact(c, f, { juste: true, ms: 2000, aide: true, seance: 1 }, 7000, NOW).boite, 1);
  assert.equal(afterFact(c, f, { juste: false, ms: 2000, seance: 1 }, 7000, NOW).boite, 1);
  // déjà rencontré : une boîte à la fois
  const seen = { ...f, historique: [{ t: NOW - DAY, juste: false }] };
  assert.equal(afterFact(c, seen, { juste: true, ms: 2000, seance: 1 }, 7000, NOW).boite, 2);
});

test("une boîte au plus par séance : un fait déjà monté dans la séance ne remonte pas, mais redescend après une erreur", () => {
  const f = { fait: "4+1", a: 4, b: 1, famille: 1, boite: 2, prochain: NOW, historique: [{ t: NOW - DAY, juste: true }] };
  const up = afterFact(c, f, { juste: true, ms: 2000, seance: 9 }, 7000, NOW); assert.equal(up.boite, 3); assert.equal(up.montee, 9);
  assert.equal(afterFact(c, up, { juste: true, ms: 2000, seance: 9 }, 7000, NOW).boite, 3);
  assert.equal(afterFact(c, up, { juste: false, ms: 2000, seance: 9 }, 7000, NOW).boite, 1);
  assert.equal(afterFact(c, up, { juste: true, ms: 2000, seance: 10 }, 7000, NOW).boite, 4);
});

test("voie rapide : si les faits nouveaux réservés passent tous en boîte 3, jusqu'à 3 autres s'ajoutent à la fin (au plus 6 dans la séance)", async () => {
  const cat = catalog(c), store = await open();
  // 12 faits dus (déjà rencontrés, boîtes 2 à 4) : la liste est pleine, 3 places réservées
  for (const [i, f] of cat.slice(0, 12).entries()) await store.put("faits", { ...f, boite: 2 + (i % 3), prochain: NOW - DAY, historique: [{ t: NOW - 5 * DAY, juste: true }] });
  await store.setSetting("tempsDeBase", { mesures: [2000], depuis: 0 });
  const W = await new Warmup({ store, content: c, rnd: rng(3), seance: 5, clock: () => NOW }).load();
  const qs = W.questions(12, 10); assert.equal(qs.filter((q) => q.nouveau).length, 3); assert.equal(qs.length, 12);
  const asked = await play(W, [...qs], () => ({ juste: true, ms: 2000 }));
  const fresh = asked.filter((q) => q.nouveau);
  assert.equal(fresh.length, 6, "3 réservés + 3 ajoutés"); assert.equal(asked.length, 15); assert.ok(asked.slice(-3).every((q) => q.extra));
  assert.equal(W.nouveaux, 6);
  const faits = await store.all("faits"); assert.ok(fresh.every((q) => faits.find((f) => f.fait === q.fait).boite === 3));
  // un seul raté parmi les réservés : rien n'est ajouté
  const store2 = await open(); for (const [i, f] of cat.slice(0, 12).entries()) await store2.put("faits", { ...f, boite: 2 + (i % 3), prochain: NOW - DAY, historique: [{ t: 0, juste: true }] });
  await store2.setSetting("tempsDeBase", { mesures: [2000], depuis: 0 });
  const W2 = await new Warmup({ store: store2, content: c, rnd: rng(3), seance: 5, clock: () => NOW }).load();
  let k = 0; const asked2 = await play(W2, W2.questions(12, 10), (q) => ({ juste: !(q.nouveau && k++ === 0) }));
  assert.equal(asked2.filter((q) => q.extra).length, 0);
});

test("limite commune : pas plus de 6 faits nouveaux dans la séance (déjà introduits ailleurs compris)", () => {
  assert.equal(plan(c, [], NOW, 14, 10, { dejaNouveaux: 4 }).filter((f) => f.nouveau && !f.anticipe).length, 2);
  assert.equal(plan(c, [], NOW, 14, 10, { enPlus: 3 }).filter((f) => f.nouveau && !f.anticipe).length, 6);
});

test("questions triviales (a + 0) : au premier échauffement, puis une séance sur cinq", async () => {
  const store = await open(), counts = [];
  for (let s = 0; s < 11; s++) {
    const W = await new Warmup({ store, content: c, rnd: rng(s + 1), seance: s, clock: () => NOW + s * DAY }).load();
    const qs = W.questions(10, 10); counts.push(qs.filter((q) => q.base).length);
    for (const q of qs.filter((x) => x.base)) await W.record(q, { value: q.a + q.b, ms: 2000, listens: 1 }, []);
  }
  assert.deepEqual(counts, [3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
});

test("cran « plus facile » : seulement des faits dus, aucun fait nouveau ; « plus dur » : 2 nouveaux de plus et formes à trou dès la boîte 3", () => {
  const cat = catalog(c), stored = cat.slice(0, 4).map((f) => ({ ...f, boite: 3, prochain: NOW - DAY, historique: [{ juste: true }] }));
  const easy = plan(c, stored, NOW, 12, 10, { nouveaux: false }); assert.ok(easy.every((f) => !f.nouveau));
  // plus facile, sans aucun fait connu : au plus 3 faits nouveaux pour qu'il y ait un échauffement
  assert.equal(plan(c, [], NOW, 12, 10, { nouveaux: false, complementMax: 3 }).filter((f) => f.nouveau && !f.anticipe).length, 3);
  const many = cat.slice(0, 14).map((f) => ({ ...f, boite: 2, prochain: NOW - DAY, historique: [{ juste: true }] }));
  assert.equal(plan(c, many, NOW, 12, 10, { nouveaux: false, complementMax: 3 }).filter((f) => f.nouveau).length, 0, "liste pleine de faits dus : rien de nouveau");
  assert.equal(plan(c, stored, NOW, 12, 10, { enPlus: 2 }).slice(0, 9).filter((f) => f.nouveau).length, 5);
  const r = rng(4), forms = new Set(Array.from({ length: 60 }, () => formFor({ boite: 3 }, 3, r)));
  assert.deepEqual([...forms].sort(), ["directe", "trouDroite", "trouGauche"]);
  assert.equal(formFor({ boite: 2 }, 3, r), "directe"); assert.equal(formFor({ boite: 3 }, undefined, r), "directe");
  assert.ok(Array.from({ length: 30 }, () => formFor({ boite: 2 }, 2, r)).some((f) => f !== "directe"), "très dur : trou dès la boîte 2");
});

test("formes à trou : la réponse attendue, l'historique du parent, une réponse juste et rapide fait monter le fait", async () => {
  const q = { a: 3, b: 4, fait: "3+4" };
  assert.equal(expected({ ...q, forme: "trouDroite" }), 4); assert.equal(expected({ ...q, forme: "trouGauche" }), 3); assert.equal(expected(q), 7);
  assert.equal(describeFact(q, "trouDroite"), "3 + ? = 7"); assert.equal(describeFact(q, "trouGauche"), "? + 4 = 7");
  const store = await open(), f = catalog(c).find((x) => x.fait === "3+1");
  await store.put("faits", { ...f, boite: 3, prochain: NOW - DAY, historique: [{ juste: true }] });
  await store.setSetting("tempsDeBase", { mesures: [2000], depuis: 0 });
  const W = await new Warmup({ store, content: c, rnd: () => 0.5, seance: 2, clock: () => NOW, cran: () => "dur" }).load();
  const one = W.prepare({ ...W.facts[0], nouveau: false }); assert.equal(one.forme, "trouDroite");
  await W.record(one, { value: 1, ms: 2000, listens: 1 }, []);
  const rep = (await store.all("reponses"))[0]; assert.equal(rep.forme, "trouDroite"); assert.equal(rep.question, "3 + ? = 4"); assert.equal(rep.cran, "dur"); assert.ok(rep.juste);
  assert.equal((await store.all("faits"))[0].boite, 4);
});

test("protection : quand le cran redescend, les faits nouveaux « bonus » pas encore posés sont retirés", async () => {
  const store = await open(), W = await new Warmup({ store, content: c, rnd: rng(1), seance: 1, clock: () => NOW, cran: () => "tresdur" }).load();
  await store.setSetting("tempsDeBase", { mesures: [2000] }); W.base = { mesures: [2000] };
  const qs = W.questions(12, 10).filter((q) => !q.base); assert.equal(qs.filter((q) => q.bonus && !q.anticipe).length, 3);
  W.drop(qs); assert.equal(qs.filter((q) => q.bonus).length, 0); assert.equal(qs.filter((q) => q.nouveau && !q.anticipe).length, 3);
});

test("second passage d'un fait nouveau : sauté s'il vient d'entrer en boîte 3 par la voie rapide", async () => {
  const store = await open(), W = await new Warmup({ store, content: c, rnd: rng(1), seance: 1, clock: () => NOW }).load();
  await store.setSetting("tempsDeBase", { mesures: [2000] }); W.base = { mesures: [2000] };
  const qs = W.questions(12, 10), again = qs.filter((q) => q.anticipe && q.nouveau);
  assert.ok(again.length > 0);
  const asked = await play(W, [...qs], () => ({ juste: true }));
  assert.equal(asked.filter((q) => q.anticipe).length, 0);
});
