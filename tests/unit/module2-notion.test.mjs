// Lot 2, étape 6 (docs/SPEC-LOT2.md, sections 2, 3 et 7) : familles 3 à 7 (règles, ouverture, famille acquise,
// formes à trou définitives), le module 2 comme notion du jour (famille en cours, leçon d'entrée, part de la
// famille, même fait au plus 3 fois, cran du sélecteur, erreur qui revient, famille acquise = étoile
// arc-en-ciel), alternance séance après séance et module imposé, point de départ étendu aux familles 3 à 7.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { aidFor, catalog, DAY, expected, ruleFacts } from "../../app/js/modules/facts/facts.js";
import { canOpenNext, currentFamily, initialFamilies, isAcquired, trouOpenFor, updateFamilies } from "../../app/js/modules/facts/families.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { chooseModule, Session } from "../../app/js/session/session.js";
import { markFamilyKnown } from "../../app/js/parent/depart.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const c = load("module2.json"), seance = load("seance.json");
const NOW = new Date(2026, 9, 1, 18, 0).getTime();
const open = () => Store.open(new IDBFactory());
const fact = (k, boite, extra = {}) => { const [a, b] = k.split("+").map(Number); return { fait: k, a, b, boite, prochain: NOW + 30 * DAY, historique: [{ t: NOW - DAY, juste: true, ms: 2000 }], ...extra }; };

test("familles 3 à 7 : règles, ordre d'introduction, 45 faits (a, b de 1 à 9, somme au plus 10), appui visuel", () => {
  assert.equal(catalog(c).length, 45);
  const r = (id) => ruleFacts(c, id).map((f) => f.fait);
  assert.deepEqual(r(3).sort(), ["1+9", "2+8", "3+7", "4+6", "5+5", "6+4", "7+3", "8+2", "9+1"]);
  assert.equal(r(4).length, 15); assert.ok(r(4).every((k) => { const [a, b] = k.split("+").map(Number); return a + b >= 5 && a + b <= 7; }));
  assert.equal(r(5).length, 15);
  assert.deepEqual(r(6).sort(), ["1+2", "2+1", "2+3", "3+2", "3+4", "4+3", "4+5", "5+4"]); // les presque-doubles : 8 faits
  assert.equal(r(7).length, 45);
  // introduction : la première famille qui contient le fait (les familles 1 et 2 en introduisent 33 ; 6 et 7, aucun)
  const by = {}; for (const f of catalog(c)) by[f.famille] = (by[f.famille] ?? 0) + 1;
  assert.deepEqual(by, { 1: 30, 2: 3, 3: 4, 4: 2, 5: 6 });
  assert.equal(aidFor(7, 3), "cadre"); assert.equal(aidFor(4, 4), "reflet"); assert.equal(aidFor(3, 4), "doublePlus"); assert.equal(aidFor(6, 2), "ligne"); assert.equal(aidFor(5, 3), "maison");
  // réglages dans le contenu, jamais en dur
  assert.deepEqual(c.familles2.ouverture, { part: 0.8, boite: 2 }); assert.deepEqual(c.familles2.trou, { part: 0.5, boite: 3 }); assert.equal(c.notion.memeFaitMax, 3);
  assert.deepEqual(seance.alternance.modules, [1, 2]);
});

test("ouverture : 80 % des faits introduits en boîte 2 ou plus ; une famille à la fois, au plus une par séance", () => {
  const st = initialFamilies(c, NOW);
  assert.deepEqual(st.ouvertes, [1, 2]);
  const some = ["1+1", "2+1", "1+2", "3+1", "1+3"];
  assert.equal(canOpenNext(c, st, some.map((k, i) => fact(k, i === 0 ? 1 : 2))), 3); // 4 sur 5 = 80 %
  assert.equal(canOpenNext(c, st, some.map((k, i) => fact(k, i < 2 ? 1 : 2))), null); // 3 sur 5
  const a = updateFamilies(c, st, some.map((k) => fact(k, 2)), NOW, { seance: 7 });
  assert.deepEqual(a.st.ouvertes, [1, 2, 3]); assert.ok(a.events.some((e) => e.type === "ouverte" && e.famille === 3));
  assert.deepEqual(updateFamilies(c, a.st, some.map((k) => fact(k, 2)), NOW, { seance: 7 }).st.ouvertes, [1, 2, 3], "pas deux familles dans la même séance");
  assert.deepEqual(updateFamilies(c, a.st, some.map((k) => fact(k, 2)), NOW, { seance: 8 }).st.ouvertes, [1, 2, 3, 4]);
  // une famille sans fait nouveau à introduire (6, presque-doubles) s'ouvre de la même façon
  const st5 = { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3, 4, 5] };
  assert.equal(canOpenNext(c, st5, some.map((k) => fact(k, 3))), 6);
});

test("famille acquise : 80 % des faits de sa RÈGLE en boîte 3 (les amis de 10 comptent 9 + 1, 8 + 2, 5 + 5) ; formes à trou à 50 %, définitives", () => {
  const amis = ruleFacts(c, 3).map((f) => f.fait); // 9 faits
  const known = (n, boite = 3) => amis.slice(0, n).map((k) => fact(k, boite));
  assert.equal(isAcquired(c, known(7), 3), false); assert.equal(isAcquired(c, known(8), 3), true); // 8/9 >= 80 %
  const st0 = { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3] };
  let u = updateFamilies(c, st0, known(5), NOW, { open: false }); // 5/9 en boîte 3 : trou ouvert, pas acquise
  assert.deepEqual(u.st.trou, [3]); assert.deepEqual(u.st.acquises, []);
  assert.ok(trouOpenFor(c, u.st, 7, 3)); assert.ok(!trouOpenFor(c, u.st, 3, 3));
  u = updateFamilies(c, u.st, known(9, 1), NOW, { open: false }); // des erreurs : tout redescend en boîte 1
  assert.deepEqual(u.st.trou, [3], "l'ouverture des formes à trou ne se referme pas");
  u = updateFamilies(c, u.st, known(9), NOW, { open: false });
  assert.deepEqual(u.st.acquises, [3]); assert.ok(u.events.some((e) => e.type === "acquise" && e.famille === 3 && !e.parent));
  // la famille en cours : la plus basse ouverte pas encore acquise ; toutes acquises -> le mélange
  assert.equal(currentFamily(c, { ...st0, acquises: [1] }), 2);
  assert.equal(currentFamily(c, { ...st0, ouvertes: [1, 2, 3, 4, 5, 6, 7], acquises: [1, 2, 3, 4, 5, 6] }), 7);
});

test("alternance séance après séance ; module imposé par le parent (une séance) ; l'autre module sans rien à proposer", () => {
  const s = (module, debut, o = {}) => ({ module, debut, terminee: true, ...o });
  assert.equal(chooseModule(seance, []).module, 1);
  assert.equal(chooseModule(seance, [s(1, 1)]).module, 2);
  assert.equal(chooseModule(seance, [s(1, 1), s(2, 2)]).module, 1);
  assert.equal(chooseModule(seance, [s(1, 1), s(2, 2, { terminee: false })]).module, 2, "une séance interrompue ne compte pas");
  assert.equal(chooseModule(seance, [s(2, 2), s(1, 3, { libre: true })]).module, 1, "l'entraînement libre ne compte pas");
  assert.deepEqual(chooseModule(seance, [s(2, 1)], 2), { module: 2, impose: true });
  assert.equal(chooseModule(seance, [s(1, 1)], null, (m) => m !== 2).module, 1);
  assert.equal(chooseModule({}, [s(1, 1)]).module, 1); // sans alternance (lot 1)
});

test("séance : le module imposé est noté et le réglage consommé", async () => {
  const store = await open(); await store.setSetting("moduleImpose", { module: 2, t: NOW });
  const S = new Session({ store, content: seance, handlers: {}, clock: () => NOW });
  await S.start();
  assert.equal(S.rec.module, 2); assert.equal(S.rec.moduleImpose, true); assert.equal(await store.setting("moduleImpose"), null);
  const S2 = new Session({ store, content: seance, handlers: {}, clock: () => NOW + DAY }); await S2.start();
  assert.equal(S2.rec.module, 1); // la séance d'avant n'est pas terminée : ligne graduée
});

// joue n questions de la notion du jour : answer(q) -> juste ?
async function notion(store, { n = 20, answer = () => true, cran = "conseille", guides = 0 } = {}) {
  const R = rng(5), m = await new Module2Runner({ store, content: c, rnd: R, seance: 1, clock: () => NOW, cran: () => cran }).load(), qs = [], events = [];
  for (let i = 0; i < guides + n; i++) {
    const { q, cfg } = m.next({ guide: i < guides }), ok = answer(q);
    qs.push(q);
    const r = await m.record({ q, value: ok ? expected(q) : 99, ok, ms: 2500, listens: 1 }, cfg); events.push(...r.events);
  }
  return { m, qs, events, fin: await m.finish() };
}

test("notion du jour : famille en cours, moitié au moins sur sa règle, faits nouveaux dans la limite de la séance, même fait au plus 3 fois", async () => {
  const store = await open();
  for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "2+2", "4+1", "1+4"]) await store.put("faits", fact(k, 2));
  await store.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  const { m, qs } = await notion(store, { n: 20 });
  assert.equal(m.famille, 3);
  const rule = new Set(ruleFacts(c, 3).map((f) => f.fait));
  assert.ok(qs.filter((q) => rule.has(q.fait)).length >= 10, `${qs.filter((q) => rule.has(q.fait)).length} sur 20 dans la règle des amis de 10`);
  assert.ok(qs.filter((q) => q.nouveau && !q.revient).length <= 6, "au plus 6 faits nouveaux dans la séance");
  const count = {}; qs.forEach((q) => { count[q.fait] = (count[q.fait] ?? 0) + 1; });
  assert.ok(Object.values(count).every((x) => x <= 3), JSON.stringify(count));
  assert.ok(qs.every((q) => q.appui), "chaque question a son appui visuel");
  assert.ok(qs.filter((q) => rule.has(q.fait)).every((q) => q.appui === "cadre"), "les amis de 10 : le cadre de 10");
  // la leçon d'entrée : L5 la première fois que la famille 3 est la notion du jour, plus ensuite
  assert.equal((await new Module2Runner({ store, content: c, rnd: rng(1), cran: () => "conseille" }).load()).entryLesson(), null);
  const store2 = await open(); await store2.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  assert.equal((await new Module2Runner({ store: store2, content: c, rnd: rng(1), cran: () => "conseille" }).load()).entryLesson(), "L5");
});

test("notion du jour : une erreur revient 3 questions plus loin ; 3 erreurs sur 5 : la leçon de la famille, une fois", async () => {
  const store = await open();
  await store.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  let k = 0; const { qs, events } = await notion(store, { n: 14, answer: () => ++k > 6 });
  const firstWrong = qs[0]; assert.equal(qs[4]?.fait === firstWrong.fait || qs.slice(3, 6).some((q) => q.fait === firstWrong.fait && q.revient), true);
  assert.equal(events.filter((e) => e.type === "lecon" && e.id === "L5").length, 1);
});

test("notion du jour : la famille acquise pendant la séance est un niveau franchi (étoile arc-en-ciel)", async () => {
  const store = await open();
  for (const f of ruleFacts(c, 3)) await store.put("faits", fact(f.fait, f.a + f.b === 10 && f.a <= 2 || f.a === 5 ? 3 : 2, { montee: 0 }));
  await store.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  const { events, fin } = await notion(store, { n: 20 });
  assert.equal(events.filter((e) => e.type === "montee").length, 1);
  assert.ok((await store.get("niveaux", 2)).acquises.includes(3));
  assert.ok(fin.events.some((e) => e.type === "acquise" && e.famille === 3));
});

test("sélecteur en notion du jour : facile = formes directes de la famille, aide d'emblée ; dur = formes à trou et famille suivante ; très dur = tout mêlé", async () => {
  const mk = async () => { const s = await open(); for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "2+2", "9+1", "8+2", "5+5"]) await s.put("faits", fact(k, 3)); await s.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] }); return s; };
  const f = await notion(await mk(), { n: 12, cran: "facile" });
  assert.ok(f.qs.every((q) => q.forme === "directe" && q.aideDEmblee));
  const rule3 = new Set(ruleFacts(c, 3).map((x) => x.fait));
  assert.ok(f.qs.every((q) => rule3.has(q.fait) || q.revient), "facile : la famille en cours seulement");
  const d = await notion(await mk(), { n: 18, cran: "dur" });
  assert.ok(d.qs.filter((q) => q.forme !== "directe").length >= 6, "dur : des formes à trou");
  const rule4 = new Set(ruleFacts(c, 4).map((x) => x.fait));
  assert.ok(d.qs.some((q) => rule4.has(q.fait) && !rule3.has(q.fait)), "dur : des faits de la famille suivante");
});

test("point de départ du parent étendu aux familles 3 à 7 : la famille ouverte et acquise (choix du parent, sans étoile), pas la suivante", async () => {
  const store = await open();
  await markFamilyKnown(store, c, 5, NOW);
  const st = await store.get("niveaux", 2);
  assert.deepEqual(st.ouvertes, [1, 2, 3, 4, 5]); assert.ok(st.ouvertures.filter((o) => o.parent).length === 3);
  assert.ok(st.acquises.includes(5) && st.obtenus.find((o) => o.famille === 5).parent);
  const faits = await store.all("faits");
  assert.ok(ruleFacts(c, 5).every((r) => faits.find((f) => f.fait === r.fait)?.boite >= 3));
  assert.ok(isAcquired(c, faits, 5));
  const parent = load("parent.json"); assert.deepEqual(parent.pointDeDepart.familles, [1, 2, 3, 4, 5, 6, 7]);
});

test("leçon d'appui jamais vue : les maisons de 8 et 9 jouent L6, les presque-doubles L4 (puis L6), le mélange la première qui manque", async () => {
  const st = (famille, lecons = []) => ({ ...initialFamilies(c, NOW), ouvertes: [1, 2, 3, 4, 5, 6, 7], acquises: [1, 2, 3, 4, 5, 6, 7].filter((id) => id < famille), lecons });
  const entry = async (famille, lecons) => { const s = await open(); await s.put("niveaux", st(famille, lecons)); return (await new Module2Runner({ store: s, content: c, rnd: rng(1), cran: () => "conseille" }).load()).entryLesson(); };
  assert.equal(await entry(5), "L6");
  assert.equal(await entry(5, ["L6"]), null);
  assert.equal(await entry(6), "L4");
  assert.equal(await entry(6, ["L4"]), "L6");
  assert.equal(await entry(7, ["L4", "L6"]), "L5");
  assert.equal(await entry(7, ["L4", "L5", "L6"]), null);
});
