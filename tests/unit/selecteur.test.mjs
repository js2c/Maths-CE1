// Lot 2, étape 2 (docs/SPEC-LOT2.md, section 2) : le sélecteur de difficulté côté séance (multiplicateur des
// étoiles avec fractions accumulées, protection qui redescend d'un cran, crans autorisés par le parent), le
// défi record activable, et les réglages de seance.json.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { Rewards } from "../../app/js/session/rewards.js";
import { challengeReady, CRANS, Session } from "../../app/js/session/session.js";
import { allowedCrans, startCran } from "../../app/js/session/selector.js";

const seance = JSON.parse(readFileSync(new URL("../../app/content/seance.json", import.meta.url)));
const mk = async () => { const store = await Store.open(new IDBFactory()), rewards = await new Rewards(store).load(); const s = await new Session({ store, content: seance, rewards, handlers: {} }).start(); return { store, rewards, s }; };

test("seance.json (lot 2) : échauffement en 3 min, notion du jour en 6 min (nombres relevés au-delà de 10 à 14 et 12 à 16 : la durée prime), sélecteur à 4 crans", () => {
  const e = Object.fromEntries(seance.etapes.map((x) => [x.id, x]));
  assert.equal(e.echauffement.minutes, 3); assert.ok(e.echauffement.questions[0] >= 10 && e.echauffement.questions[1] >= 14);
  assert.equal(e.notion.minutes, 6); assert.ok(e.notion.questions[0] >= 12 && e.notion.questions[1] >= 16);
  assert.notEqual(e.defi.actif, false); assert.equal(e.defi.aPartirDeSeance, 5); assert.equal(e.defi.faitsBoite3Min, 8);
  assert.deepEqual(seance.selecteur.crans, CRANS); assert.deepEqual(seance.selecteur.multiplicateurs, [0.5, 1, 1.5, 2]); assert.deepEqual(seance.selecteur.decalages, [-1, 0, 1, 2]);
});

test("multiplicateur : ½ -> une étoile toutes les deux bonnes réponses ; × 1,5 ; × 2 ; les autres étoiles ne changent pas", async () => {
  const cases = [["facile", 10, 5], ["conseille", 10, 10], ["dur", 10, 15], ["tresdur", 10, 20], ["dur", 3, 4]];
  for (const [cran, n, want] of cases) {
    const { s, rewards } = await mk(); await s.setCran(cran);
    for (let i = 0; i < n; i++) await s.stars(1, i % 3 ? "bonne réponse" : "erreur corrigée");
    assert.equal(rewards.total, want, `${cran} ${n}`); assert.equal(s.rec.etoiles, want);
  }
  const { s, rewards } = await mk(); await s.setCran("facile");
  await s.stars(3, "leçon L1"); await s.stars(10, "séance terminée"); assert.equal(rewards.total, 13);
  assert.equal(s.rec.cran, "facile"); assert.equal(s.rec.cranDepart, "facile");
});

test("protection : 3 erreurs sur 5 à un cran au-dessus du conseillé -> un cran de moins, le multiplicateur suit ; jamais sous le conseillé", async () => {
  const { s } = await mk(), downs = []; s.onCranDown = async (de, a) => downs.push([de, a]);
  await s.setCran("tresdur"); assert.equal(s.offset, 2); assert.equal(s.multiplier, 2);
  for (const ok of [true, false, true, false, false]) await s.answered(ok);
  assert.deepEqual(downs, [["tresdur", "dur"]]); assert.equal(s.cran, "dur"); assert.equal(s.multiplier, 1.5); assert.equal(s.rec.cran, "dur"); assert.equal(s.rec.cranDepart, "tresdur");
  for (const ok of [true, true, false, false, false]) await s.answered(ok);
  assert.equal(s.cran, "conseille"); for (let i = 0; i < 10; i++) await s.answered(false);
  assert.equal(s.cran, "conseille"); assert.equal(s.rec.descentes.length, 2);
  // au cran conseillé ou plus facile, pas de protection
  const { s: f } = await mk(); await f.setCran("facile"); for (let i = 0; i < 6; i++) await f.answered(false); assert.equal(f.cran, "facile");
});

test("crans autorisés par le parent, cran de départ", () => {
  assert.deepEqual(allowedCrans(null), CRANS);
  assert.deepEqual(allowedCrans({ min: "conseille" }), ["conseille", "dur", "tresdur"]);
  assert.deepEqual(allowedCrans({ max: "dur" }), ["facile", "conseille", "dur"]);
  assert.equal(startCran(["facile", "conseille"]), "conseille"); assert.equal(startCran(["dur", "tresdur"]), "dur"); assert.equal(startCran(["facile"]), "facile");
});

test("défi record : à partir de la 5e séance terminée, et seulement avec au moins 8 faits en boîte 3 ou plus", async () => {
  const store = await Store.open(new IDBFactory()), step = seance.etapes.find((e) => e.id === "defi");
  for (let i = 0; i < 4; i++) await store.add("seances", { debut: i, terminee: true });
  await store.add("seances", { debut: 9, terminee: true, libre: true });
  for (let i = 0; i < 8; i++) await store.put("faits", { fait: `${i + 1}+1`, boite: 3 });
  assert.equal(await challengeReady(store, step), false);
  await store.add("seances", { debut: 10, terminee: true }); assert.equal(await challengeReady(store, step), true);
  await store.put("faits", { fait: "1+1", boite: 2 }); assert.equal(await challengeReady(store, step), false);
});
