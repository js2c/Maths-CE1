// Lot « Sommes jusqu'à 30 » (docs/maquettes/sommes30/PROPOSITION.md ; docs/SPEC.md, section 6) : les familles 8 à 13 du
// module 2 (faits de 11 à 20, doubles jusqu'à 15 + 15), leur ouverture, leurs appuis (les deux boîtes de dix, le grand double),
// l'erreur « a oublié la dizaine », les leçons L11 et L12, les phrases de la voix.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { aidFor, catalog, classifyFact, expected, ruleFacts } from "../../app/js/modules/facts/facts.js";
import { canOpenNext, currentFamily, initialFamilies, lastFamilyReady, warmupOpening } from "../../app/js/modules/facts/families.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { FactsScreen } from "../../app/js/modules/facts/screen.js";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { fill } from "../../app/js/modules/numberline/screen.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";

const read = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}.json`, import.meta.url), "utf8"));
const c = read("module2"), textes = read("textes"), lecons = read("lecons"), seance = read("seance");
const NOW = new Date("2026-10-12T18:00:00").getTime();
const facts = (id) => catalog(c).filter((f) => f.famille === id).map((f) => f.fait);
const rule = (id) => ruleFacts(c, id).map((f) => f.fait).sort();

test("familles 8 à 13 : les faits de 11 à 20 (termes jusqu'à 10) et les doubles jusqu'à 15 + 15, chacun dans la première famille qui le contient", () => {
  const cat = catalog(c), big = cat.filter((f) => f.famille >= 8);
  assert.equal(cat.filter((f) => f.famille <= 7).length, 45); // les familles 1 à 7 ne changent pas
  assert.equal(big.length, 60); assert.ok(big.every((f) => f.a + f.b > 10 && f.a + f.b <= 30));
  // tous les faits de 11 à 20 dont les termes vont jusqu'à 10 : 55, plus les cinq grands doubles
  for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) if (a + b > 10) assert.ok(big.some((f) => f.a === a && f.b === b), `${a}+${b}`);
  assert.deepEqual(cat.filter((f) => f.a > 10).map((f) => f.fait), ["11+11", "12+12", "13+13", "14+14", "15+15"]);
  assert.equal(new Set(cat.map((f) => f.fait)).size, cat.length);
  const by = {}; for (const f of big) by[f.famille] = (by[f.famille] ?? 0) + 1;
  assert.deepEqual(by, { 8: 19, 9: 9, 10: 8, 11: 12, 12: 12 });
  assert.deepEqual(facts(9), ["6+6", "7+7", "8+8", "9+9", "11+11", "12+12", "13+13", "14+14", "15+15"]);
  assert.ok(facts(8).includes("10+10") && facts(8).includes("9+10") && facts(10).includes("8+9"));
  // la pratique d'une famille porte sur tous les faits de sa règle (la famille 12 pratique aussi 6 + 6, 7 + 8…)
  assert.equal(rule(8).length, 19); assert.ok(rule(9).includes("10+10")); assert.equal(rule(10).length, 10); assert.equal(rule(11).length, 15);
  assert.equal(rule(12).length, 21); assert.ok(rule(12).includes("6+6") && rule(12).includes("7+8"));
  // les mélanges : la famille 7 jusqu'à 10, la famille 13 tous les faits
  assert.equal(ruleFacts(c, 7).length, 45); assert.equal(ruleFacts(c, 13).length, 105);
});

test("l'appui de chaque fait au-delà de 10 : les deux boîtes, le reflet jusqu'à 10 + 10, le double + 1, le grand double", () => {
  assert.equal(aidFor(8, 5), "deuxCadres"); assert.equal(aidFor(10, 4), "deuxCadres"); assert.equal(aidFor(9, 2), "deuxCadres"); assert.equal(aidFor(2, 9), "deuxCadres");
  assert.equal(aidFor(7, 7), "reflet"); assert.equal(aidFor(10, 10), "reflet"); assert.equal(aidFor(13, 13), "grandDouble");
  assert.equal(aidFor(7, 8), "doublePlus"); assert.equal(aidFor(10, 9), "doublePlus");
  // jusqu'à 10, rien ne change
  assert.equal(aidFor(7, 3), "cadre"); assert.equal(aidFor(3, 4), "doublePlus"); assert.equal(aidFor(6, 2), "ligne"); assert.equal(aidFor(5, 3), "maison");
  const fam = (id) => c.familles.find((f) => f.id === id);
  assert.deepEqual([8, 9, 10, 11, 12, 13].map((id) => fam(id).aide), ["deuxCadres", "reflet", "doublePlus", "deuxCadres", "deuxCadres", "fait"]);
  assert.deepEqual([fam(8).lecon, fam(11).lecon, fam(9).leconSiJamaisVue, fam(10).leconSiJamaisVue, fam(12).leconSiJamaisVue], ["L11", "L12", "L4", "L4", "L12"]);
  assert.ok(fam(10).rappelDouble);
});

test("les deux boîtes : le plus grand nombre d'abord, la première boîte complétée ; à trou, les places du nombre qui manque ; ce que dit la voix", () => {
  const S = { app: { text: { data: textes } }, c }; Object.setPrototypeOf(S, FactsScreen.prototype);
  assert.deepEqual(S.framesOf({ a: 5, b: 8, forme: "directe" }, false), { first: 8, second: 5, places: false });
  assert.deepEqual(S.framesOf({ a: 4, b: 10, forme: "directe" }, true), { first: 10, second: 4, places: false });
  assert.deepEqual(S.framesOf({ a: 8, b: 5, forme: "trouDroite" }, false), { first: 8, second: 5, places: true });
  assert.deepEqual(S.framesOf({ a: 8, b: 5, forme: "trouGauche" }, false), { first: 5, second: 8, places: true });
  assert.deepEqual(S.framesOf({ a: 8, b: 5, forme: "trouGauche" }, true), { first: 8, second: 5, places: false }); // résolue : comme la forme directe
  assert.equal(S.aidSpeech({ a: 8, b: 5, forme: "directe" }, "deuxCadres", true), "2 pour faire dix, il en reste 3.");
  assert.equal(S.aidSpeech({ a: 8, b: 5, forme: "directe" }, "deuxCadres", false), textes.aideDeuxCadres);
  assert.equal(S.aidSpeech({ a: 10, b: 4, forme: "directe" }, "deuxCadres", true), "Une boîte pleine, c'est dix. Et encore 4.");
  assert.equal(S.aidSpeech({ a: 9, b: 4, forme: "trouGauche" }, "deuxCadres", false), "Il faut 13 poissons en tout. Compte les places qui brillent !");
  assert.equal(S.aidSpeech({ a: 13, b: 13, forme: "directe" }, "grandDouble", true), "13, c'est dix et 3. Dix et dix, vingt. 3 et 3, 6.");
  assert.equal(S.aidKind({ a: 13, b: 13, appui: "reflet" }), "grandDouble"); assert.equal(S.aidKind({ a: 7, b: 7, appui: "reflet" }), "reflet");
});

test("l'erreur « a oublié la dizaine » : au-delà de 10, seules les unités (7 + 6 → 3)", () => {
  assert.equal(classifyFact({ a: 7, b: 6 }, 3), "dizaine"); assert.equal(classifyFact({ a: 9, b: 4 }, 3), "dizaine");
  assert.equal(classifyFact({ a: 8, b: 5 }, 3), "soustraction"); // 8 − 5 = 3 aussi : la soustraction passe d'abord assert.equal(classifyFact({ a: 13, b: 13 }, 6), "dizaine");
  assert.equal(classifyFact({ a: 8, b: 5 }, 12), "plusOuMoins1"); assert.equal(classifyFact({ a: 3, b: 4 }, 7), null);
  assert.equal(classifyFact({ a: 8, b: 5, forme: "trouDroite" }, 13), "soustraction"); // à trou : a donné le total
  const parent = read("parent"); assert.ok(parent.erreurs.dizaine && parent.erreursExercice.dizaine === "additions");
});

test("ouverture : à partir de la famille 9, la dernière famille ouverte qui apporte des faits doit être en boîte 2 ou plus pour 80 % de ses faits", () => {
  const st = { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3, 4, 5, 6, 7, 8], acquises: [1, 2, 3, 4, 5, 6, 7] };
  const small = catalog(c).filter((f) => f.famille <= 7).map((f) => ({ fait: f.fait, boite: 4 })), eight = facts(8);
  // les 45 faits jusqu'à 10 sus, ceux de la famille 8 à peine commencés : la règle des 80 % passerait, la famille 9 attend
  const few = [...small, ...eight.slice(0, 4).map((fait) => ({ fait, boite: 2 })), ...eight.slice(4, 8).map((fait) => ({ fait, boite: 1 }))];
  assert.equal(lastFamilyReady(c, st, few, 9), false); assert.equal(canOpenNext(c, st, few), null);
  const ready = [...small, ...eight.map((fait, i) => ({ fait, boite: i < 16 ? 2 : 1 }))];
  assert.equal(lastFamilyReady(c, st, ready, 9), true); assert.equal(canOpenNext(c, st, ready), 9);
  // la famille 8 n'y est pas soumise (la 7, le mélange, n'apporte aucun fait) ; ni les familles d'avant
  assert.equal(lastFamilyReady(c, { ...st, ouvertes: [1, 2, 3, 4, 5, 6, 7] }, small, 8), true);
  // l'échauffement aussi : condition 1 refusée tant que la famille 8 n'est pas prête
  const o = warmupOpening(c, st, few, [], NOW, { limitMs: 1e9 }); assert.equal(o.conditions[0], false);
});

test("famille en cours : la plus basse famille ouverte pas acquise, hors mélanges ; tout acquis : le grand mélange", () => {
  const base = { ...initialFamilies(c, NOW) };
  assert.equal(currentFamily(c, { ...base, ouvertes: [1, 2, 3, 4, 5, 6, 7], acquises: [1, 2, 3, 4, 5, 6] }), 7);
  assert.equal(currentFamily(c, { ...base, ouvertes: [1, 2, 3, 4, 5, 6, 7, 8], acquises: [1, 2, 3, 4, 5, 6] }), 8);
  assert.equal(currentFamily(c, { ...base, ouvertes: c.familles.map((f) => f.id), acquises: c.familles.map((f) => f.id) }), 13);
});

test("notion du jour, famille 11 (+ 9) : 80 % des questions sur sa règle, l'appui des deux boîtes ; le mélange 7 ne mêle que les faits jusqu'à 10", async () => {
  const open = async () => Store.open(new IDBFactory());
  const store = await open(), sus = catalog(c).filter((f) => f.famille <= 10).map((f) => ({ ...f, boite: 3, prochain: NOW + 864e5 * 4, historique: [{ t: NOW - 864e5, juste: true, ms: 2000 }] }));
  for (const f of sus) await store.put("faits", f);
  await store.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], acquises: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], lecons: ["L12"] });
  const m = await new Module2Runner({ store, content: c, rnd: rng(3), seance: 1, clock: () => NOW, cran: () => "conseille" }).load();
  assert.equal(m.famille, 11); assert.equal(m.entryLesson(), null); // L12 déjà vue, mais c'est la leçon propre de la famille : vue, pas rejouée
  const qs = [];
  for (let i = 0; i < 20; i++) { const x = m.next(); if (!x) break; qs.push(x.q); await m.record({ q: x.q, value: expected(x.q), ok: true, ms: 2500, listens: 1 }, x.cfg); }
  const inRule = qs.filter((q) => rule(11).includes(q.fait));
  assert.ok(inRule.length >= 0.8 * qs.length - 1, `${inRule.length} sur ${qs.length}`);
  assert.ok(inRule.every((q) => q.appui === "deuxCadres"));
  // le mélange 7 choisi : seulement des faits jusqu'à 10, même quand des faits plus grands sont sus
  const s7 = await open(); for (const f of sus) await s7.put("faits", f);
  await s7.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], acquises: [] });
  const m7 = await new Module2Runner({ store: s7, content: c, rnd: rng(4), seance: 1, clock: () => NOW, cran: () => "conseille", choix: 7 }).load(), q7 = [];
  for (let i = 0; i < 15; i++) { const x = m7.next(); if (!x) break; q7.push(x.q); await m7.record({ q: x.q, value: expected(x.q), ok: true, ms: 2500, listens: 1 }, x.cfg); }
  assert.ok(q7.filter((q) => m7.inFamily(q.fait)).every((q) => q.a + q.b <= 10));
});

test("les leçons L11 et L12 : dans le menu (rangée des additions), leur exercice, leurs actions, leur nom", () => {
  assert.deepEqual(seance.menuLecons.rangees.find((r) => r.exercice === "additions").lecons, ["L4", "L5", "L6", "L11", "L12"]);
  assert.deepEqual(lecons.L11.exercice, { module: 2, famille: 8 }); assert.deepEqual(lecons.L12.exercice, { module: 2, famille: 11 });
  const known = new Set(["cadres", "entrer", "entrerB", "sauter", "ecrire", "effacer", "ermite", "attendre"]);
  for (const id of ["L11", "L12"]) {
    assert.equal(lecons[id].module, 2); assert.ok(textes.choixLeconNom[id]);
    for (const ph of lecons[id].phrases) for (const beat of ph) { assert.ok(beat.dire); for (const a of beat.faire ?? []) assert.ok(known.has(Object.keys(a)[0]), `${id} : ${JSON.stringify(a)}`); }
  }
  for (const id of [8, 9, 10, 11, 12, 13]) assert.ok(textes.choixFamille[id], `nom de la famille ${id}`);
});

test("voix : chaque fait de 11 à 30 sous ses trois formes et sa correction, les phrases des appuis, celles des leçons", () => {
  const inv = inventaire();
  for (const f of catalog(c).filter((x) => x.a + x.b > 10)) {
    const v = { a: f.a, b: f.b, n: f.a + f.b };
    for (const k of ["faitTrouDroite", "faitTrouGauche", "faitCorrection"]) assert.ok(inv.has(fill(textes[k], v)), `${k} ${f.fait}`);
    for (const t of textes.fait) assert.ok(inv.has(fill(t, v)), `fait ${f.fait}`);
  }
  for (const s of ["2 pour faire dix, il en reste 3.", "1 pour faire dix, il en reste 8.", "Une boîte pleine, c'est dix.", "Et encore 10.", "Il faut 20 poissons en tout.", "15, c'est dix et 5.", "5 et 5, 10.", "9 poissons, et dans le reflet, encore 9 poissons.", "8 plus 9, c'est 8 plus 8, et encore 1.", "Huit plus cinq, ça fait treize."]) assert.ok(inv.has(s), s);
});
