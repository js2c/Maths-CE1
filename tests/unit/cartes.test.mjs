// Cartes et rythme (docs/SPEC-LOT2.md, section 5 ; jamais de doublon depuis le 5 octobre 2026) : calendrier et quota, brillantes (tirage de 20 %),
// ouverture des zones, semaines réussies et étoiles dorées, légendaires et coquillage doré, étoile arc-en-ciel
// de l'entraînement libre, contenu de la zone 2.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { addCard, dateOf, goldenStar, goodWeeks, legendaryFor, nextZone, pickShell, quotaAt, Rewards, schoolWeek, schoolWeeks, shinyChance, shinyDraw } from "../../app/js/session/rewards.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const cartes = load("cartes.json"), cal = load("calendrier.json");
const at = (s, h = 18) => dateOf(s) + h * 3600000;
const byZone = (z, withLeg = false) => cartes.cartes.filter((c) => c.zone === z && (withLeg || c.rarete !== "legendaire"));
const own = (list) => Object.fromEntries(list.map((c) => [c.id, { n: 1, premiere: 0, brillante: false }]));
// les zones 3 et 4 « prêtes » (contenu fictif, comme dans la simulation de l'année)
const allReady = { ...cartes, cartes: cartes.cartes.map((c) => ({ ...c, illustration: c.illustration ?? `fictif/${c.id}.webp`, anecdote: c.anecdote ?? "Anecdote fictive." })) };
const fresh = async (content = cartes, calendrier = cal, now = at("2026-09-28")) => { const store = await Store.open(new IDBFactory()); return { store, rw: await new Rewards(store, content, calendrier).load(now) }; };

test("calendrier : 32 semaines d'école du 28 septembre 2026 au 2 juillet 2027, vacances exclues", () => {
  assert.equal(schoolWeeks(cal, at("2026-09-28"), at("2027-07-02")), 32);
  assert.equal(schoolWeek(cal, dateOf("2026-10-12")), true);
  assert.equal(schoolWeek(cal, dateOf("2026-10-19")), false); // Toussaint
  assert.equal(schoolWeek(cal, dateOf("2026-10-26")), false);
  assert.equal(schoolWeek(cal, dateOf("2026-11-02")), true); // reprise le lundi
  assert.equal(schoolWeek(cal, dateOf("2026-12-28")), false); // Noël
  assert.equal(schoolWeek(cal, dateOf("2027-02-22")), true);
  assert.equal(schoolWeek(cal, dateOf("2027-06-28")), true); // dernière semaine (jusqu'au vendredi 2 juillet)
  assert.equal(schoolWeek(cal, dateOf("2027-07-05")), false); // été
});

test("quota : base + 2 par semaine d'école commencée, semaine de la base comprise, au plus 60", () => {
  const Q = cartes.quota, base = { date: at("2026-09-28", 17), cartes: 0 };
  assert.equal(quotaAt(base, cal, at("2026-09-28"), Q), 2);
  assert.equal(quotaAt(base, cal, at("2026-10-04"), Q), 2); // dimanche : même semaine
  assert.equal(quotaAt(base, cal, at("2026-10-05", 0), Q), 4); // lundi, dès minuit
  assert.equal(quotaAt(base, cal, at("2026-10-25"), Q), 6); // pendant les vacances, le quota n'augmente pas
  assert.equal(quotaAt(base, cal, at("2026-11-02"), Q), 8);
  assert.equal(quotaAt(base, cal, at("2027-06-28"), Q), 60); // 32 semaines : 64, plafonné à 60
  // base posée un dimanche avec 7 cartes : sa semaine (du lundi 21) est une semaine d'école
  assert.equal(quotaAt({ date: at("2026-09-27"), cartes: 7 }, cal, at("2026-09-27"), Q), 9);
  assert.equal(quotaAt({ date: at("2026-09-27"), cartes: 7 }, null, at("2026-09-27"), Q), 60); // sans calendrier : pas de limite
});

test("la base du quota est enregistrée au premier lancement avec les cartes déjà gagnées, puis gardée", async () => {
  const store = await Store.open(new IDBFactory());
  await store.put("recompenses", { id: "cartes", cartes: own(byZone("lagon").slice(0, 5)) });
  const rw = await new Rewards(store, cartes, cal).load(at("2026-09-27"));
  assert.deepEqual({ date: rw.base.date, cartes: rw.base.cartes }, { date: at("2026-09-27"), cartes: 5 });
  assert.equal(rw.quota(at("2026-09-28")), 9);
  const again = await new Rewards(store, cartes, cal).load(at("2026-11-02"));
  assert.equal(again.base.date, at("2026-09-27"));
});

test("jamais de doublon (décision du parent du 5 octobre 2026) : sous le quota une créature nouvelle ; au-dessus, une créature possédée devient brillante ; toutes brillantes, rien", () => {
  const lagon = { zones: ["lagon"], poids: cartes.poids }, r = rng(5), L = byZone("lagon");
  assert.equal(pickShell(cartes.cartes, {}, { ...lagon, nouvelle: false }, r).sorte, "nouvelle"); // aucune carte : une nouvelle
  const owned = own(L.slice(0, 3)); owned[L[0].id].brillante = true; owned[L[1].id].brillante = true;
  for (let i = 0; i < 100; i++) assert.deepEqual([pickShell(cartes.cartes, owned, { ...lagon, nouvelle: false }, r).carte.id, pickShell(cartes.cartes, owned, { ...lagon, nouvelle: false }, r).sorte], [L[2].id, "brillante"]);
  for (let i = 0; i < 50; i++) { const g = pickShell(cartes.cartes, owned, { ...lagon, nouvelle: true }, r); assert.ok(!owned[g.carte.id] && g.sorte === "nouvelle"); }
  // toutes brillantes, au-dessus du quota : rien (le coquillage attend)
  owned[L[2].id].brillante = true; assert.equal(pickShell(cartes.cartes, owned, { ...lagon, nouvelle: false }, r), null);
  // zone complète sous le quota : une brillante (rien d'autre à gagner), jamais un doublon
  const full = own(L), g = pickShell(cartes.cartes, full, { ...lagon, nouvelle: true }, r); assert.equal(g.sorte, "brillante");
});

test("brillantes : 20 % pour une créature nouvelle (graine fixe, 1 000 tirages, écart de moins de 3 points) ; une brillante le reste", () => {
  assert.equal(cartes.brillanteNouvelle, 0.2);
  assert.ok(!("brillanteDoublon" in cartes) && !("brillante" in cartes) && !("brillanteHasard" in cartes), "anciens réglages retirés de cartes.json");
  const c = cartes.cartes[0];
  assert.equal(shinyChance(cartes), 0.2);
  const r = rng(2026); let n = 0; for (let i = 0; i < 1000; i++) if (shinyDraw(r, 0.2)) n++;
  assert.ok(Math.abs(n / 1000 - 0.2) < 0.03, `${n} brillantes sur 1000`);
  const o = addCard({}, c, 1, true); assert.deepEqual([o.nouvelle, o.devientBrillante, o.parTirage], [true, true, true]);
  // une carte déjà brillante sur la tablette le reste
  const p = addCard({ [c.id]: { n: 4, premiere: 1, brillante: true } }, c, 9, false); assert.equal(p.owned[c.id].brillante, true);
});

test("le trésor : une créature nouvelle sort brillante à 20 % ; une créature possédée rendue brillante au-dessus du quota", async () => {
  const { rw } = await fresh(cartes, cal, at("2026-09-28")), c = cartes.cartes[0];
  let g = await rw.win(c, () => 0.1, at("2026-09-28")); assert.equal(g.brillante, true);
  const d = cartes.cartes[1]; g = await rw.win(d, () => 0.9, at("2026-09-28")); assert.equal(g.brillante, false);
  g = await rw.shine(d, at("2026-09-29")); assert.deepEqual([g.nouvelle, g.brillante, g.devientBrillante, g.rendueBrillante], [false, true, true, true]);
  assert.equal(rw.owned[d.id].brillante, true); assert.equal(rw.owned[d.id].n, 1, "pas de doublon : la carte n'est pas comptée deux fois");
});

test("un coquillage ne donne jamais plus de créatures nouvelles que le quota ; ensuite il rend brillantes celles qu'on a ; toutes brillantes, il attend", async () => {
  const { rw } = await fresh(cartes, cal, at("2026-09-28")), r = rng(3);
  await rw.add(25 * 12);
  const got = []; for (let i = 0; i < 6; i++) { const g = await rw.openShell(r, at("2026-09-29")); if (g) got.push(g); }
  assert.equal(got.filter((g) => g.nouvelle).length, 2); assert.equal(rw.count, 2);
  // au-dessus du quota : les deux créatures deviennent brillantes (si elles ne l'étaient pas déjà), puis le coquillage attend
  assert.ok(got.filter((g) => !g.nouvelle).every((g) => g.rendueBrillante));
  assert.ok(Object.values(rw.owned).every((o) => o.brillante), "toutes brillantes");
  assert.equal(got.length, 2 + got.filter((g) => !g.nouvelle).length);
  assert.equal(rw.canOpen(at("2026-09-29")), false, "rien à donner : le coquillage attend");
  assert.equal(await rw.openShell(r, at("2026-09-29")), null);
  assert.ok(rw.total >= 25 * (12 - got.length) && rw.total === 25 * 12 - 25 * got.length, "les étoiles restent au compteur");
  // la semaine suivante : de nouveau deux créatures nouvelles
  const later = []; for (let i = 0; i < 2; i++) later.push(await rw.openShell(r, at("2026-10-06")));
  assert.equal(rw.count, 4); assert.equal(later.filter((g) => g.nouvelle).length, 2);
});

test("zones : la suivante s'ouvre avec une étoile arc-en-ciel quand communes et rares sont gagnées, si son contenu est prêt", async () => {
  const L = byZone("lagon"), C = byZone("corail");
  assert.equal(nextZone(cartes, own(L.slice(1)), ["lagon"]), null);
  assert.equal(nextZone(cartes, own(L), ["lagon"]).id, "corail");
  assert.equal(nextZone(cartes, own([...L, ...C]), ["lagon", "corail"]), null); // le grand large n'a pas encore son contenu
  assert.equal(nextZone(allReady, own([...L, ...C]), ["lagon", "corail"]).id, "large");
  const { store, rw } = await fresh();
  rw.owned = own(L);
  assert.equal(await rw.openZone(), null); // pas d'étoile arc-en-ciel en réserve
  await rw.special("arcEnCiel", 2);
  assert.equal((await rw.openZone(at("2026-11-30"))).id, "corail"); assert.equal(rw.arcDispo, 1); assert.equal(rw.st.arcEnCiel, 2);
  assert.equal(await rw.openZone(), null);
  const again = await new Rewards(store, cartes, cal).load();
  assert.equal(again.zoneOpen("corail"), true); assert.equal(again.zoneOpen("large"), false); assert.equal(again.arcDispo, 1);
});

test("semaines réussies : une étoile dorée toutes les 4 semaines d'au moins 2 séances, consécutives ou non", () => {
  const R = cartes.semaine, days = [];
  // semaine 1 : 2 séances ; semaine 2 : 1 séance ; semaines 3, 4 : 2 séances ; semaine 5 : 3 séances
  const plan = [["2026-09-28", "2026-10-01"], ["2026-10-05"], ["2026-10-12", "2026-10-15"], ["2026-11-02", "2026-11-05"], ["2026-11-09", "2026-11-12", "2026-11-13"]];
  const stars = [];
  for (const w of plan) for (const d of w) { days.push(at(d)); if (goldenStar(days, at(d), R)) stars.push(d); }
  assert.deepEqual(stars, ["2026-11-12"]); // la 4e semaine réussie, à sa 2e séance ; pas à la 3e
  assert.equal(goodWeeks(days, R), 4);
  assert.deepEqual(R, { seances: 2, semainesParDoree: 4 });
});

test("légendaires : un coquillage doré par étoile dorée, quand la zone a toutes ses communes et rares, et sous le quota", async () => {
  const L = byZone("lagon"), C = byZone("corail"), G = byZone("large"), open = ["lagon", "corail", "large"];
  assert.equal(legendaryFor(allReady, own([...L, ...C, ...G.slice(1)]), open), null);
  assert.equal(legendaryFor(allReady, own([...L, ...C, ...G]), open).id, "grand-requin-blanc");
  assert.equal(legendaryFor(cartes, own([...L, ...C, ...G]), open), null); // contenu pas prêt
  const { rw } = await fresh(allReady, cal, at("2026-09-28"));
  rw.owned = own([...L, ...C, ...G]); rw.zones.ouvertes = open;
  assert.equal(rw.goldenCard(at("2027-04-26")), null); // pas d'étoile dorée
  await rw.special("dorees", 2);
  assert.equal(rw.goldenCard(at("2026-10-01")), null); // pas de place sous le quota
  const before = rw.total, g = await rw.openGolden(rng(1), at("2027-04-26"));
  assert.equal(g.carte.id, "grand-requin-blanc"); assert.equal(g.nouvelle, true); assert.equal(rw.total, before); assert.equal(rw.doreesDispo, 1);
  assert.equal((await rw.openGolden(rng(1), at("2027-04-26"))).carte.id, "orque");
  assert.equal(await rw.openGolden(rng(1), at("2027-04-26")), null);
  // un coquillage ordinaire ne donne jamais de légendaire
  for (let i = 0; i < 100; i++) assert.notEqual(pickShell(allReady.cartes, {}, { zones: ["large", "abysses"], poids: cartes.poids }, rng(i)).carte.rarete, "legendaire");
});

test("étoile arc-en-ciel de l'entraînement libre : gardée, puis remise à la séance suivante", async () => {
  const { store, rw } = await fresh();
  await rw.arcFromFree(); await rw.arcFromFree();
  assert.equal(rw.arcDispo, 0);
  const again = await new Rewards(store, cartes, cal).load();
  assert.equal(await again.collectFree(), 2); assert.equal(again.st.arcEnCiel, 2); assert.equal(again.st.arcLibre, 0); assert.equal(await again.collectFree(), 0);
});

test("zone 2 : 15 cartes prêtes (illustration et anecdote), nom lu ; zones 3 et 4 encore sans contenu", () => {
  const C = byZone("corail", true);
  assert.equal(C.length, 15); assert.ok(C.every((c) => c.illustration && c.anecdote && c.anecdote.length > 20 && c.nomLu));
  assert.ok(cartes.cartes.filter((c) => ["large", "abysses"].includes(c.zone)).every((c) => !c.anecdote));
  assert.ok(cartes.zones.slice(1).every((z) => z.ouvertureLu && z.fermeeLu));
});

test("surprise : environ une séance sur cinq, jamais deux de suite, toujours un visiteur (plus de cadeau depuis le 5 octobre 2026)", async () => {
  const { drawSurprise, previousSession, VISITORS } = await import("../../app/js/session/surprise.js");
  const r = rng(11); let prev = null, n = 0, twice = 0;
  for (let i = 0; i < 2000; i++) {
    const s = drawSurprise(r, cartes.surprise, prev);
    if (s) { n++; if (prev?.surprise) twice++; assert.ok(s.type === "visite" && VISITORS.includes(s.id)); }
    prev = { surprise: s };
  }
  assert.equal(twice, 0); assert.ok(Math.abs(n / 2000 - 0.2) < 0.03, `${n} surprises sur 2000 séances`);
  assert.equal(previousSession([{ id: 1, debut: 1 }, { id: 2, debut: 5, libre: true }, { id: 3, debut: 3 }, { id: 4, debut: 9 }], 4).id, 3);
});
