// Lot 2, étape 7 : le défi record (docs/SPEC.md, « Défi record » ; docs/SPEC-LOT2.md, sections 2 et 3) : seulement
// les faits en boîte 3 ou plus, mélangés sans le même fait deux fois de suite, une minute (réglage), le score
// comparé au record de l'enfant (premier record, record battu, égalé, pas battu), 5 étoiles au nouveau record,
// réponses notées `defi` et soumises à la révision espacée (une boîte au plus par séance), pas de protection du cran.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { DAY, expected } from "../../app/js/modules/facts/facts.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { challengeFacts, challengeQueue, nextRecord, runChallenge } from "../../app/js/modules/facts/challenge.js";
import { challengeReady, Session } from "../../app/js/session/session.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const c = load("module2.json"), seance = load("seance.json"), step = seance.etapes.find((e) => e.id === "defi");
const NOW = Date.now();
const fact = (k, boite, extra = {}) => { const [a, b] = k.split("+").map(Number); return { fait: k, a, b, boite, prochain: NOW + 30 * DAY, historique: [{ t: NOW - DAY, juste: true, ms: 2000 }], ...extra }; };

test("réglages du défi dans seance.json : une minute, boîte 3 ou plus, 5 étoiles au nouveau record, à partir de la 5e séance et de 8 faits bien sus", () => {
  assert.equal(step.dureeS, 60); assert.equal(step.boiteMin, 3); assert.equal(step.aPartirDeSeance, 5); assert.equal(step.faitsBoite3Min, 8);
  assert.equal(seance.etoiles.nouveauRecord, 5); assert.notEqual(step.actif, false);
});

test("faits du défi : seulement la boîte 3 ou plus ; ordre mélangé, tous les faits avant de recommencer, jamais deux fois de suite le même", () => {
  const facts = [fact("1+1", 1), fact("2+2", 2), fact("3+1", 3), fact("4+2", 4), fact("5+5", 5), fact("2+1", 3)];
  assert.deepEqual(challengeFacts(facts).map((f) => f.fait).sort(), ["2+1", "3+1", "4+2", "5+5"]);
  const pool = challengeFacts(facts), r = rng(5);
  for (let k = 0; k < 20; k++) {
    const q = challengeQueue(pool, r, 40);
    assert.equal(q.length, 40);
    for (let i = 1; i < q.length; i++) assert.notEqual(q[i].fait, q[i - 1].fait, `le même fait deux fois de suite (${i})`);
    for (let i = 0; i + 4 <= 40; i += 4) assert.equal(new Set(q.slice(i, i + 4).map((f) => f.fait)).size, 4, "chaque tour pose tous les faits");
  }
  assert.deepEqual(challengeQueue([], r), []);
  assert.equal(challengeQueue([pool[0]], r, 5).length, 5); // un seul fait : il revient (le défi n'a lieu qu'avec 8 faits)
});

test("record : le premier défi réussi fait le premier record ; ensuite seul un score plus haut le bat ; historique des scores", () => {
  let r = nextRecord(null, 0, { now: 1, seance: 1 });
  assert.deepEqual([r.premier, r.nouveau, r.st.record], [false, false, null]); // aucune bonne réponse : pas de record
  r = nextRecord(r.st, 9, { now: 2, seance: 2 }); assert.deepEqual([r.premier, r.nouveau, r.st.record, r.ancien], [true, true, 9, null]);
  r = nextRecord(r.st, 7, { now: 3, seance: 3 }); assert.deepEqual([r.nouveau, r.egal, r.st.record, r.ancien], [false, false, 9, 9]);
  r = nextRecord(r.st, 9, { now: 4, seance: 4 }); assert.deepEqual([r.nouveau, r.egal, r.st.record], [false, true, 9]);
  r = nextRecord(r.st, 12, { now: 5, seance: 5 }); assert.deepEqual([r.premier, r.nouveau, r.st.record, r.st.date, r.st.seance], [false, true, 12, 5, 5]);
  assert.deepEqual(r.st.scores.map((s) => s.score), [0, 9, 7, 9, 12]); assert.equal(r.st.id, "defi");
});

test("le défi a lieu à partir de la 5e séance terminée, avec au moins 8 faits en boîte 3 ou plus, si le parent ne l'a pas désactivé", async () => {
  const store = await Store.open(new IDBFactory());
  for (let i = 0; i < 5; i++) await store.add("seances", { debut: i, terminee: true, module: 1 });
  for (let i = 1; i <= 7; i++) await store.put("faits", fact(`${i}+1`, 3));
  assert.equal(await challengeReady(store, step), false);
  await store.put("faits", fact("1+2", 4)); assert.equal(await challengeReady(store, step), true);
  await store.setSetting("defiActif", false); assert.equal(await challengeReady(store, step), false);
});

// une séance, un écran et une vue factices : l'enfant répond en `ms`, juste sauf pour les faits de `faux`
async function play({ record = null, faux = [], ms = 15, dureeS = 0.4, cran = "conseille" } = {}) {
  const store = await Store.open(new IDBFactory());
  const facts = ["1+1", "2+1", "3+1", "2+2", "4+1", "5+1", "3+3", "6+1"].map((k, i) => fact(k, 3 + (i % 3)));
  facts.push(fact("1+2", 1), fact("2+3", 2));
  for (const f of facts) await store.put("faits", f);
  if (record != null) await store.put("recompenses", { id: "defi", record, scores: [] });
  const stars = []; const rewards = { add: async (n, raison) => stars.push([n, raison]), special: async () => {} };
  const session = await new Session({ store, content: seance, handlers: {}, rewards }).start();
  await session.setCran(cran);
  const warmup = await new Warmup({ store, content: c, rnd: rng(3), seance: session.id, cran: () => "conseille" }).load(); warmup.defi = true;
  const asked = [], said = [], view = { pearls: 0, show() {}, start() {}, stop() {}, pearl(n) { this.pearls = n; }, record(n) { this.rec = n; } };
  const screen = {
    show() {}, keys() {}, leave() {}, cancel() { this.cancelled = true; },
    askDefi(q) { asked.push(q); const v = faux.includes(q.fait) ? expected(q) + 1 : expected(q); return new Promise((res) => setTimeout(() => res({ value: v, ms: 1500, listens: 0, aide: false, nsp: false, after: Promise.resolve() }), ms)); },
  };
  const res = await runChallenge({ session, step: { ...step, dureeS }, warmup, screen, view, store, rnd: rng(9), stars: seance.etoiles, say: async (k, v) => said.push([k, v?.n]) });
  return { res, store, session, asked, said, stars, view, screen };
}

test("déroulement : seuls les faits en boîte 3 ou plus sont posés, le score est compté, le chronomètre arrête le défi", async () => {
  const { res, asked, session, view, screen, store } = await play({ faux: ["2+1"] });
  assert.ok(asked.length >= 5, `${asked.length} questions en 0,4 s`);
  assert.ok(asked.every((q) => q.boite >= 3), "faits de boîte 3 ou plus seulement");
  assert.equal(view.pearls, res.score);
  assert.equal(session.rec.defi.score, res.score); assert.equal(session.rec.defi.nouveauRecord, true);
  const rep = (await store.all("reponses")).filter((r) => r.defi);
  assert.equal(rep.length, session.rec.defi.questions); assert.equal(rep.filter((r) => r.juste).length, res.score);
  assert.ok(rep.filter((r) => r.question === "2 + 1").every((r) => !r.juste));
  assert.ok(screen.cancelled || asked.length === rep.length); // la question coupée par la fin n'est pas notée assert.ok(rep.every((r) => r.module === 2 && r.seance === session.id));
  assert.equal((await store.get("recompenses", "defi")).record, res.score);
});

test("premier record : 5 étoiles ; pas battu : pas d'étoiles de record, « Presque ! » et le score ; battu : « Nouveau record ! » et 5 étoiles (lot 3 bis, B6)", async () => {
  let p = await play();
  assert.ok(p.said.some(([k]) => k === "defiIntroPremier") && p.said.some(([k]) => k === "defiPremierRecord"));
  assert.deepEqual(p.stars.filter(([, r]) => r === "nouveau record"), [[5, "nouveau record"]]);
  assert.equal(p.stars.filter(([, r]) => r === "bonne réponse").length, p.res.score);
  p = await play({ record: 99 });
  assert.equal(p.res.nouveau, false); assert.ok(p.said.some(([k, n]) => (k === "defiPresque" && n === p.res.score) || (k === "defiPresqueUn" && p.res.score === 1)), "« Presque ! Tu as fait 9 perles. »"); assert.ok(p.said.some(([k]) => k === "defiIntro"));
  assert.equal(p.stars.filter(([, r]) => r === "nouveau record").length, 0);
  p = await play({ record: 1 });
  assert.equal(p.res.nouveau, true); assert.ok(p.said.some(([k, n]) => k === "defiNouveauRecord" && n === p.res.score), "« Nouveau record ! 12 perles ! »"); assert.equal(p.stars.filter(([, r]) => r === "nouveau record").length, 1);
});

test("révision espacée : une bonne réponse rapide fait monter le fait d'une boîte au plus dans la séance ; une erreur le fait redescendre ; pas de protection du cran", async () => {
  const { store, session, asked } = await play({ faux: ["3+3"], cran: "tresdur", dureeS: 0.6 });
  const f = Object.fromEntries((await store.all("faits")).map((x) => [x.fait, x]));
  const posés = new Set(asked.map((q) => q.fait));
  if (posés.has("3+3")) assert.equal(f["3+3"].boite, 1);
  assert.ok(Object.values(f).every((x) => x.boite <= 5));
  assert.equal(session.cran, "tresdur"); assert.ok(!session.rec.descentes, "le défi ne redescend jamais le cran");
  // « 1+1 » était en boîte 3 : au plus la boîte 4, même posé plusieurs fois
  if (posés.has("1+1")) assert.ok(f["1+1"].boite <= 4);
});
