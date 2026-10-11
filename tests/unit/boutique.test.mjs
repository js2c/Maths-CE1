// LA BOUTIQUE DU RÉCIF (lot « La boutique du récif », docs/LOTS.md, fiche 10 ; art/boutique/README.md, « Les décisions du
// parent ») : prix, vitrine et états des places, arrivages, achat (jamais à moitié, ni deux fois), faire briller, coquillage de
// la série, premier habitant d'une zone, « il te manque », sauvegarde d'avant la boutique.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { arrivees, coutPlace, dateOf, etatPlace, manque, ordreArrivages, Rewards } from "../../app/js/session/rewards.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const cartes = load("cartes.json"), cal = load("calendrier.json"), textes = load("textes.json");
const at = (s, h = 18) => dateOf(s) + h * 3600000;
const byZone = (z, withLeg = false) => cartes.cartes.filter((c) => c.zone === z && (withLeg || c.rarete !== "legendaire"));
const own = (list, extra = {}) => Object.fromEntries(list.map((c) => [c.id, { n: 1, premiere: 0, brillante: false, ...extra }]));
const allReady = { ...cartes, cartes: cartes.cartes.map((c) => ({ ...c, illustration: c.illustration ?? `fictif/${c.id}.webp`, anecdote: c.anecdote ?? "Anecdote fictive." })) };
const fresh = async (now = at("2026-09-28"), content = cartes) => { const store = await Store.open(new IDBFactory()); return { store, rw: await new Rewards(store, content, cal).load(now) }; };
const B = cartes.boutique;

test("les règles du parent sont dans cartes.json : prix 40 et 100, briller 150 et 300, une chance sur cinq, 2 arrivages par semaine", () => {
  assert.deepEqual([B.mode, B.parSemaine, B.prix, B.briller, B.brillanteAchat], ["arrivages", 2, { commune: 40, rare: 100 }, { commune: 150, rare: 300 }, 0.2]);
  assert.deepEqual([cartes.serie.bonusChaque, cartes.serie.bonus, cartes.serie.coquillageChaque, cartes.serie.coquillageEtoiles], [3, 5, 10, 20]);
  assert.ok(!("coquillage" in cartes) && !("quota" in cartes) && !("poids" in cartes), "le coquillage ordinaire, le quota et les poids ne servent plus");
});

test("l'ordre des arrivages : zone par zone, une rare toutes les 3 ou 4 communes, jamais une légendaire", () => {
  const o = ordreArrivages(cartes), R = new Map(cartes.cartes.map((c) => [c.id, c]));
  assert.equal(o.length, 55); assert.equal(new Set(o).size, 55);
  assert.ok(o.every((id) => R.get(id).rarete !== "legendaire"));
  assert.deepEqual(o.slice(0, 15).map((id) => R.get(id).zone), Array(15).fill("lagon"));
  assert.deepEqual(o.slice(0, 15).map((id) => R.get(id).rarete[0]).join(""), "cccrcccrcccrccr");
});

test("la vitrine : chaque état de place, et ce qu'elle coûte", () => {
  const L = byZone("lagon"), o = ordreArrivages(cartes), owned = own(L.slice(0, 2)); owned[L[1].id].brillante = true;
  const arrived = arrivees(cartes, owned, ["lagon"], 4, o), ctx = { owned, open: ["lagon"], arrived };
  const R = Object.fromEntries(cartes.cartes.map((c) => [c.id, etatPlace(c, ctx)]));
  assert.equal(R[L[0].id], "terne"); assert.equal(R[L[1].id], "brillante");
  assert.equal(arrived.size, 4); assert.deepEqual([...arrived].filter((id) => !owned[id]).map((id) => R[id]), ["vendre", "vendre"]);
  assert.equal(Object.values(R).filter((e) => e === "bientot").length, 15 - 4);
  assert.ok(byZone("corail").every((c) => R[c.id] === "fermee"));
  assert.ok(cartes.cartes.filter((c) => c.rarete === "legendaire").every((c) => R[c.id] === "legende"));
  // le coût : 40 ou 100 à vendre, 150 ou 300 pour briller ; rien pour les autres (pas de coche)
  const rare = L.find((c) => c.rarete === "rare");
  assert.equal(coutPlace(B, L[0], "vendre"), 40); assert.equal(coutPlace(B, rare, "vendre"), 100);
  assert.equal(coutPlace(B, L[0], "terne"), 150); assert.equal(coutPlace(B, rare, "terne"), 300);
  for (const e of ["bientot", "fermee", "legende", "legendeAToi", "brillante"]) assert.equal(coutPlace(B, L[0], e), null, e);
  // une légendaire possédée, pas brillante : elle ne s'achète pas, ne brille pas à la boutique
  assert.equal(etatPlace(cartes.cartes.find((c) => c.id === "orque"), { ...ctx, owned: { "grand-requin-blanc": { n: 1 } } }), "legende");
  assert.equal(etatPlace(cartes.cartes.find((c) => c.id === "grand-requin-blanc"), { ...ctx, owned: { "grand-requin-blanc": { n: 1 } } }), "legendeAToi");
});

test("« il te manque N étoiles » : N entre 1 et 299, et chaque N a sa phrase ; rien quand l'enfant a assez", () => {
  const inv = inventaire(), costs = [...Object.values(B.prix), ...Object.values(B.briller)];
  assert.equal(manque(40, 40), null); assert.equal(manque(40, 39), 1); assert.equal(manque(null, 0), null);
  for (const c of costs) for (let t = 0; t < c; t++) {
    const n = manque(c, t);
    assert.ok(n >= 1 && n <= c);
    if (n <= B.manqueDitMax) assert.ok(inv.has(n === 1 ? textes.boutique.manqueUn : textes.boutique.manque.replace("{n}", n)), `${n}`);
  }
  // 300 (aucune étoile devant une rare à faire briller) n'est pas dit : seul le prix l'est (session/boutique.js)
  assert.equal(B.manqueDitMax, 299); assert.equal(Math.max(...costs) - 1, 299);
  for (const n of [...Object.values(B.prix), ...Object.values(B.briller)]) assert.ok(inv.has(textes.boutique.prix.replace("{n}", n)) || inv.has(textes.boutique.briller.replace("{n}", n)));
});

test("arrivages : 2 le lundi de chaque semaine d'école ; une semaine sans séance n'en perd aucune ; les vacances n'en apportent pas", async () => {
  const { rw } = await fresh(at("2026-09-28")); // base : lundi 28 septembre, aucune carte
  const vendre = (t) => [...rw.vitrine(t).values()].filter((e) => e === "vendre").length;
  assert.equal(vendre(at("2026-09-28")), 2); assert.equal(vendre(at("2026-10-04", 23)), 2);
  assert.equal(vendre(at("2026-10-05", 0)), 4); // lundi, dès minuit (le dimanche soir en pleine visite : la visite garde sa vitrine)
  assert.equal(vendre(at("2026-10-12")), 6); assert.equal(vendre(at("2026-10-26")), 6, "les vacances de la Toussaint n'apportent rien");
  assert.equal(vendre(at("2026-11-02")), 8);
  // trois semaines sans séance puis une séance : tout ce qui est arrivé est là (rien n'est perdu)
  assert.equal(vendre(at("2026-11-23")), 14);
  // une créature achetée compte dans les arrivées : la vitrine n'en gagne pas une de plus
  await rw.add(1000); const id = [...rw.vitrine(at("2026-11-23"))].find(([, e]) => e === "vendre")[0];
  await rw.acheter(id, at("2026-11-23"), () => 0.9).ecrit;
  assert.equal(vendre(at("2026-11-23")), 13); assert.equal(rw.vitrine(at("2026-11-23")).get(id), "terne");
  // le mode Libre (réglage du parent) : toute la zone ouverte est en vitrine
  await rw.setMode("libre"); assert.equal(vendre(at("2026-09-28")), 14);
});

test("arrivages : les arrivées déjà annoncées ne le sont plus ; le halo s'éteint quand la tuile est touchée", async () => {
  const { store, rw } = await fresh(at("2026-09-28"));
  const n1 = rw.nouvelles(at("2026-09-29")); assert.equal(n1.length, 2);
  await rw.annoncer(n1); assert.deepEqual(rw.nouvelles(at("2026-09-30")), []);
  assert.deepEqual(rw.nouvelles(at("2026-10-05")).length, 2);
  assert.equal(rw.aVoir(at("2026-09-30")).size, 2); await rw.voir(n1[0]); assert.equal(rw.aVoir(at("2026-09-30")).size, 1);
  const again = await new Rewards(store, cartes, cal).load(at("2026-10-01"));
  assert.deepEqual(again.nouvelles(at("2026-10-01")), []); assert.equal(again.aVoir(at("2026-10-01")).size, 1);
  assert.equal(await again.visite(), true); assert.equal(await again.visite(), false);
});

test("un achat ne se fait jamais à moitié, ni deux fois ; le compteur n'est jamais négatif", async () => {
  const { store, rw } = await fresh(at("2026-09-28")), now = at("2026-09-29");
  const [id] = [...rw.vitrine(now)].find(([, e]) => e === "vendre"), prix = rw.cout(id, "vendre");
  await rw.add(prix + 10);
  // trois touchers très rapides de la coche, avant toute écriture : un seul achat
  const a = rw.acheter(id, now, () => 0.9), b = rw.acheter(id, now, () => 0.9), c = rw.acheter(id, now, () => 0.9);
  assert.ok(a); assert.equal(b, null); assert.equal(c, null);
  assert.equal(rw.total, 10);
  // la page rechargée pendant le vol des étoiles : l'achat est déjà écrit, une seule fois
  await a.ecrit;
  const again = await new Rewards(store, cartes, cal).load(now);
  assert.equal(again.total, 10); assert.ok(again.owned[id]); assert.equal(again.achats.liste.length, 1); assert.equal(again.owned[id].origine, "achat");
  // pas assez d'étoiles : rien, et le compteur ne bouge pas
  const [id2] = [...again.vitrine(now)].find(([, e]) => e === "vendre");
  assert.equal(again.acheter(id2, now), null); assert.equal(again.total, 10); assert.ok(again.total >= 0);
  // jamais une créature pas encore arrivée, légendaire ou d'une zone fermée, même avec beaucoup d'étoiles
  await again.add(5000);
  for (const [k, e] of again.vitrine(now)) if (["bientot", "fermee", "legende", "brillante", "legendeAToi"].includes(e)) assert.equal(again.acheter(k, now), null, `${k} (${e})`);
});

test("l'achat sort brillant une fois sur cinq ; faire briller coûte 150 ou 300 et rend la créature brillante", async () => {
  const { rw } = await fresh(at("2026-09-28")), now = at("2026-11-30");
  await rw.setMode("libre"); await rw.add(10000);
  const r = rng(42); let shiny = 0, n = 0;
  for (const c of byZone("lagon")) { const g = rw.acheter(c.id, now, r); await g.ecrit; n++; if (g.brillante) shiny++; }
  assert.equal(n, 15); assert.ok(shiny >= 1 && shiny <= 7, `${shiny} brillantes sur 15`);
  const terne = byZone("lagon").find((c) => !rw.owned[c.id].brillante), before = rw.total;
  assert.equal(rw.vitrine(now).get(terne.id), "terne");
  const g = rw.acheter(terne.id, now, r); await g.ecrit;
  assert.deepEqual([g.briller, g.brillante, g.prix], [true, true, B.briller[terne.rarete]]);
  assert.equal(rw.total, before - B.briller[terne.rarete]); assert.equal(rw.owned[terne.id].brillante, true); assert.equal(rw.owned[terne.id].n, 1);
  assert.equal(rw.vitrine(now).get(terne.id), "brillante"); assert.equal(rw.acheter(terne.id, now), null);
  assert.equal(rw.achats.liste.at(-1).briller, true);
});

test("le coquillage de la série : il fait briller une créature possédée tirée au hasard ; 20 étoiles quand toutes brillent", async () => {
  const { rw } = await fresh(at("2026-09-28")), L = byZone("lagon");
  rw.owned = own(L.slice(0, 3)); rw.owned[L[0].id].brillante = true;
  const g = await rw.serieShell(() => 0.99, at("2026-10-01"));
  assert.ok([L[1].id, L[2].id].includes(g.carte.id)); assert.equal(g.rendueBrillante, true); assert.equal(rw.owned[g.carte.id].brillante, true);
  await rw.serieShell(() => 0, at("2026-10-02"));
  assert.ok(L.slice(0, 3).every((c) => rw.owned[c.id].brillante));
  assert.deepEqual(await rw.serieShell(() => 0, at("2026-10-03")), { etoiles: 20 });
  // au bon rang : la 10e séance de la série
  const flags = []; for (let d = 1; d <= 20; d++) { await rw.endOfSession(at(`2026-11-${String(d).padStart(2, "0")}`)); flags.push(rw.coquillageSerie); }
  assert.deepEqual(flags.map((f, i) => (f ? i + 1 : 0)).filter(Boolean), [10, 20]);
});

test("ouverture d'une zone : son premier habitant est une commune tirée au hasard (jamais une rare) ; une zone pas prête ne s'ouvre pas", async () => {
  const L = byZone("lagon"), C = byZone("corail");
  const seen = new Set();
  for (let i = 0; i < 40; i++) {
    const { rw } = await fresh(at("2026-09-28")); rw.owned = own(L); await rw.special("arcEnCiel");
    const z = await rw.openZone(at("2026-11-30"), rng(i));
    assert.equal(z.id, "corail"); assert.equal(z.habitant.carte.zone, "corail"); assert.equal(z.habitant.carte.rarete, "commune");
    assert.equal(rw.owned[z.habitant.carte.id].origine, "zone"); seen.add(z.habitant.carte.id);
  }
  assert.ok(seen.size >= 5, `${seen.size} habitants différents`);
  // le premier habitant ne prend pas la place d'une arrivée
  const { rw } = await fresh(at("2026-09-28")); rw.owned = own(L); await rw.special("arcEnCiel"); const z = await rw.openZone(at("2026-11-30"), rng(1));
  const arr = rw.arrived(at("2026-11-30")); assert.ok(arr.has(z.habitant.carte.id));
  assert.equal([...arr].filter((id) => !rw.owned[id] && C.some((c) => c.id === id)).length, Math.min(14, rw.nbArrivees(at("2026-11-30")) - 15));
  // le grand large n'a pas encore son contenu : il ne s'ouvre pas, même quand le récif de corail est complet
  const { rw: r2 } = await fresh(at("2026-09-28")); r2.owned = own([...L, ...C]); r2.zones.ouvertes = ["lagon", "corail"]; await r2.special("arcEnCiel");
  assert.equal(await r2.openZone(at("2027-01-10")), null);
  const { rw: r3 } = await fresh(at("2026-09-28"), allReady); r3.owned = own([...L, ...C]); r3.zones.ouvertes = ["lagon", "corail"]; await r3.special("arcEnCiel");
  assert.equal((await r3.openZone(at("2027-02-01"), rng(2))).id, "large");
});

test("une sauvegarde d'avant la boutique se restaure : cartes, brillantes, série, étoiles accumulées, étoile dorée ; la vitrine est la bonne", async () => {
  // une sauvegarde de la version en ligne : 8 créatures gagnées au hasard des coquillages (dont 2 brillantes), 187 étoiles
  // accumulées (un coquillage qui attendait), une étoile dorée pas encore dépensée, la base du quota au 28 septembre
  const L = byZone("lagon"), gagnees = [L[0], L[3], L[5], L[7], L[9], L[11], L[12], L[14]];
  const owned = own(gagnees); owned[L[3].id].brillante = true; owned[L[12].id].brillante = true;
  const dump = { base: "ocean-des-nombres", version: 1, seances: [], reponses: [], faits: [], niveaux: [], bilans: [], reglages: [],
    recompenses: [
      { id: "etoiles", total: 187, cumul: 387, dorees: 1, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 8, coquillagesDores: 0 },
      { id: "cartes", cartes: owned }, { id: "serie", seances: 17, derniere: at("2026-11-05") },
      { id: "quota", date: at("2026-09-28", 17), cartes: 0 }, { id: "zones", ouvertes: ["lagon"], dates: {} },
      { id: "cadeaux", liste: ["algue"] },
    ] };
  const store = await Store.open(new IDBFactory()); await store.restore(dump);
  const rw = await new Rewards(store, cartes, cal).load(at("2026-11-09"));
  assert.equal(rw.total, 187); assert.equal(rw.count, 8); assert.equal(rw.doreesDispo, 1); assert.equal(rw.serie.seances, 17);
  assert.equal(rw.collection().filter((c) => c.brillante).length, 2);
  // le 9 novembre : 2 × 6 semaines d'école (28/9, 5/10, 12/10, 2/11, 9/11 et la semaine du 28 septembre comptée) = 10 arrivées ;
  // 8 sont déjà dans le récif : 2 à vendre, les 5 autres créatures du lagon arrivent bientôt
  const v = rw.vitrine(at("2026-11-09")), n = rw.nbArrivees(at("2026-11-09"));
  assert.equal(n, 10);
  assert.equal([...v.values()].filter((e) => e === "vendre").length, 2);
  assert.equal([...v.values()].filter((e) => e === "terne").length, 6); assert.equal([...v.values()].filter((e) => e === "brillante").length, 2);
  assert.equal([...v.values()].filter((e) => e === "bientot").length, 5);
  assert.equal(rw.peutAcheter(at("2026-11-09")), true);
  // rien n'est converti : l'ancienne fiche des cadeaux reste
  assert.deepEqual((await store.get("recompenses", "cadeaux")).liste, ["algue"]);
});
