// Récompenses : les cartes (jamais de doublon depuis le 5 octobre 2026, brillantes), l'achat à la boutique (lot « La boutique
// du récif » : tests/unit/boutique.test.mjs pour ses règles), série qui se met en pause, contenu des 15 cartes du lagon. Les règles du lot 2 (quota, brillantes,
// zones, étoiles dorées, légendaires) : tests/unit/cartes.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { addCard, nextSeries, Rewards } from "../../app/js/session/rewards.js";

const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));

test("le lagon : 15 cartes, noms uniques, communes et rares, une anecdote et une place dans le récif chacune", () => {
  const L = cartes.cartes.filter((c) => c.zone === "lagon");
  assert.equal(L.length, 15); assert.equal(new Set(L.map((c) => c.id)).size, 15);
  assert.ok(L.every((c) => ["commune", "rare"].includes(c.rarete) && c.anecdote.length > 20 && c.nom));
  assert.ok(L.every((c) => /^[a-z-]+$/.test(c.id) && (c.illustration === null || c.illustration === `assets/cards/${c.id}.webp`)));
  assert.deepEqual(cartes.zones.filter((z) => z.ouverte).map((z) => z.id), ["lagon"]);
});

test("une carte ne devient plus brillante au troisième doublon (décision du parent du 27 septembre 2026)", () => {
  const c = cartes.cartes[0]; let o = {}, r;
  for (let i = 1; i <= 4; i++) { r = addCard(o, c, 1000 * i); o = r.owned; assert.equal(r.devientBrillante, false); assert.equal(r.nouvelle, i === 1); }
  assert.deepEqual(o[c.id], { n: 4, premiere: 1000, derniere: 4000, brillante: false }); // (lot 3, étape 5 : derniere, la date du dernier gain, pour la page d'entrée du récif)
});

test("la série : une séance par jour compte, un jour manqué ne la fait pas retomber, bonus toutes les 3 séances", () => {
  const day = (d, h = 18) => new Date(2026, 8, d, h).getTime(), R = cartes.serie;
  let s = null, got = [];
  for (const t of [day(21), day(22), day(22, 20), day(23), day(26), day(27), day(28)]) { const r = nextSeries(s, t, R); s = r.serie; got.push(r.etoiles); }
  assert.deepEqual(got, [0, 0, 0, 5, 0, 0, 5]); assert.equal(s.seances, 6);
  // (lot « La boutique du récif ») le coquillage de la série : à la 10e, la 20e… séance de la série
  const coq = []; s = null; for (let d = 1; d <= 25; d++) { const r = nextSeries(s, new Date(2026, 9, d, 18).getTime(), R); s = r.serie; if (r.coquillage) coq.push(s.seances); }
  assert.deepEqual(coq, [10, 20]); assert.deepEqual([R.coquillageChaque, R.coquillageEtoiles], [10, 20]);
});

test("un achat coûte son prix en étoiles (cartes.json, boutique), range la créature dans la collection ; tout est enregistré", async () => {
  const store = await Store.open(new IDBFactory()), rw = await new Rewards(store, cartes).load(), c = cartes.cartes[0], P = cartes.boutique.prix[c.rarete];
  await rw.add(P - 1); assert.equal(rw.acheter(c.id, Date.now(), rng(1)), null);
  await rw.add(45); const o = rw.acheter(c.id, Date.now(), () => 0.9); await o.ecrit;
  assert.ok(o.carte && o.nouvelle && !o.brillante); assert.equal(rw.total, P + 44 - P); assert.equal(rw.st.cumul, P + 44);
  await rw.special("arcEnCiel"); await rw.special("dorees");
  const again = await new Rewards(store, cartes).load();
  assert.equal(again.total, 44); assert.equal(again.collection().length, 1); assert.equal(again.collection()[0].id, c.id); assert.equal(again.st.arcEnCiel, 1); assert.equal(again.st.dorees, 1);
  assert.deepEqual(again.achats.liste.map((a) => [a.carte, a.prix, a.briller]), [[c.id, P, false]]);
  assert.equal(await again.endOfSession(new Date(2026, 8, 26).getTime()), 0); assert.equal((await store.get("recompenses", "serie")).seances, 1);
});
