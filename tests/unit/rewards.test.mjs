// Récompenses : tirage des cartes (pas de doublon avant une zone complète, raretés, brillantes),
// coquillages, série qui se met en pause, étoile dorée de la semaine, contenu des 15 cartes du lagon.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { addCard, goldenStar, nextSeries, pickCard, Rewards, weekStart } from "../../app/js/session/rewards.js";

const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));
const lagon = { zones: ["lagon"], poids: cartes.poids };

test("le lagon : 15 cartes, noms uniques, communes et rares, une anecdote et une place dans le récif chacune", () => {
  const L = cartes.cartes.filter((c) => c.zone === "lagon");
  assert.equal(L.length, 15); assert.equal(new Set(L.map((c) => c.id)).size, 15);
  assert.ok(L.every((c) => ["commune", "rare"].includes(c.rarete) && c.anecdote.length > 20 && c.nom && Array.isArray(c.recif)));
  assert.ok(L.every((c) => /^[a-z-]+$/.test(c.id) && (c.illustration === null || c.illustration === `assets/cards/${c.id}.webp`)));
  assert.deepEqual(cartes.zones.filter((z) => z.ouverte).map((z) => z.id), ["lagon"]);
});

test("pas de doublon tant que la zone n'est pas complète ; ensuite des doublons ; les raretés pèsent", () => {
  const r = rng(7); let owned = {}; const seen = [];
  for (let i = 0; i < 15; i++) { const c = pickCard(cartes.cartes, owned, lagon, r); seen.push(c.id); owned = addCard(owned, c, 3).owned; }
  assert.equal(new Set(seen).size, 15);
  const again = pickCard(cartes.cartes, owned, lagon, r); assert.ok(owned[again.id]);
  // sur beaucoup de premiers tirages, une commune sort plus souvent qu'une rare (poids 3 contre 1)
  const first = { commune: 0, rare: 0 }; const r2 = rng(3);
  for (let i = 0; i < 2000; i++) first[pickCard(cartes.cartes, {}, lagon, r2).rarete]++;
  const pc = first.commune / 11, pr = first.rare / 4; assert.ok(pc > 2.3 * pr && pc < 3.8 * pr, JSON.stringify(first));
  assert.equal(pickCard(cartes.cartes, {}, { zones: ["abysses"], poids: cartes.poids }, r), null);
});

test("une carte devient brillante au troisième doublon", () => {
  const c = cartes.cartes[0]; let o = {}, r;
  for (let i = 1; i <= 4; i++) { r = addCard(o, c, 3, 1000 * i); o = r.owned; assert.equal(r.devientBrillante, i === 4); assert.equal(r.nouvelle, i === 1); }
  assert.deepEqual(o[c.id], { n: 4, premiere: 1000, brillante: true });
  assert.equal(addCard(o, c, 3).devientBrillante, false);
});

test("la série : une séance par jour compte, un jour manqué ne la fait pas retomber, bonus toutes les 3 séances", () => {
  const day = (d, h = 18) => new Date(2026, 8, d, h).getTime(), R = cartes.serie;
  let s = null, got = [];
  for (const t of [day(21), day(22), day(22, 20), day(23), day(26), day(27), day(28)]) { const r = nextSeries(s, t, R); s = r.serie; got.push(r.etoiles); }
  assert.deepEqual(got, [0, 0, 0, 5, 0, 0, 5]); assert.equal(s.seances, 6);
});

test("l'étoile dorée : la 5e séance terminée de la semaine (lundi à dimanche), une seule fois", () => {
  const day = (d) => new Date(2026, 8, d, 18).getTime(); // le 21 septembre 2026 est un lundi
  assert.equal(weekStart(day(27)), new Date(2026, 8, 21).getTime());
  const five = [21, 22, 23, 25, 27].map(day);
  assert.equal(goldenStar(five, day(27), cartes.semaine), true);
  assert.equal(goldenStar(five.slice(0, 4), day(25), cartes.semaine), false);
  assert.equal(goldenStar([...five, day(20)], day(27), cartes.semaine), true); // le dimanche d'avant est une autre semaine
  assert.equal(goldenStar([...five, day(27) + 1000], day(27), cartes.semaine), false);
});

test("un coquillage coûte 40 étoiles, donne une carte rangée dans la collection ; tout est enregistré", async () => {
  const store = await Store.open(new IDBFactory()), rw = await new Rewards(store, cartes).load();
  await rw.add(39); assert.equal(rw.canOpen(), false); assert.equal(await rw.openShell(rng(1)), null);
  await rw.add(45); const o = await rw.openShell(rng(1));
  assert.ok(o.carte && o.nouvelle); assert.equal(rw.total, 44); assert.equal(rw.st.cumul, 84); assert.equal(rw.st.coquillages, 1);
  await rw.special("arcEnCiel"); await rw.special("dorees");
  const again = await new Rewards(store, cartes).load();
  assert.equal(again.total, 44); assert.equal(again.collection().length, 1); assert.equal(again.collection()[0].id, o.carte.id); assert.equal(again.st.arcEnCiel, 1); assert.equal(again.st.dorees, 1);
  assert.equal(await again.endOfSession(new Date(2026, 8, 26).getTime()), 0); assert.equal((await store.get("recompenses", "serie")).seances, 1);
});
