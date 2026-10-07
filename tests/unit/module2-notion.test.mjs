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
import { canOpenNext, currentFamily, initialFamilies, isAcquired, noteNotion, trouOpenFor, updateFamilies } from "../../app/js/modules/facts/families.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { chooseModule, Session } from "../../app/js/session/session.js";
import { markFamilyKnown } from "../../app/js/parent/depart.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const c = load("module2.json"), seance = load("seance.json");
const NOW = new Date(2026, 9, 1, 18, 0).getTime();
const open = () => Store.open(new IDBFactory());
const fact = (k, boite, extra = {}) => { const [a, b] = k.split("+").map(Number); return { fait: k, a, b, boite, prochain: NOW + 30 * DAY, historique: [{ t: NOW - DAY, juste: true, ms: 2000 }], ...extra }; };

test("familles 3 à 7 : règles, ordre d'introduction, 45 faits (a, b de 1 à 9, somme au plus 10), appui visuel", () => {
  assert.equal(catalog(c).filter((f) => f.famille <= 7).length, 45); // (lot « Sommes jusqu'à 30 » : 60 faits de plus, familles 8 à 13)
  const r = (id) => ruleFacts(c, id).map((f) => f.fait);
  assert.deepEqual(r(3).sort(), ["1+9", "2+8", "3+7", "4+6", "5+5", "6+4", "7+3", "8+2", "9+1"]);
  assert.equal(r(4).length, 15); assert.ok(r(4).every((k) => { const [a, b] = k.split("+").map(Number); return a + b >= 5 && a + b <= 7; }));
  assert.equal(r(5).length, 15);
  assert.deepEqual(r(6).sort(), ["1+2", "2+1", "2+3", "3+2", "3+4", "4+3", "4+5", "5+4"]); // les presque-doubles : 8 faits
  assert.equal(r(7).length, 45);
  // introduction : la première famille qui contient le fait (les familles 1 et 2 en introduisent 33 ; 6 et 7, aucun)
  const by = {}; for (const f of catalog(c)) if (f.famille <= 7) by[f.famille] = (by[f.famille] ?? 0) + 1;
  assert.deepEqual(by, { 1: 30, 2: 3, 3: 4, 4: 2, 5: 6 });
  assert.equal(aidFor(7, 3), "cadre"); assert.equal(aidFor(4, 4), "reflet"); assert.equal(aidFor(3, 4), "doublePlus"); assert.equal(aidFor(6, 2), "ligne"); assert.equal(aidFor(5, 3), "maison");
  // réglages dans le contenu, jamais en dur
  { const { derniere, ...o } = c.familles2.ouverture; assert.deepEqual(o, { part: 0.8, boite: 2, parJour: 1 }); assert.deepEqual([derniere.part, derniere.boite, derniere.aPartirDe], [0.8, 2, 9]); } assert.deepEqual(c.familles2.trou, { part: 0.5, boite: 3 }); assert.equal(c.notion.memeFaitMax, 3);
  assert.deepEqual(seance.alternance.modules, [1, 2, 3]); // (lot 3 : le calcul rapide rejoint la rotation)
});

test("ouverture : 80 % des faits introduits en boîte 2 ou plus ; une famille à la fois, au plus une par jour (lot « Correctifs », 6.2)", () => {
  const st = initialFamilies(c, NOW);
  assert.deepEqual(st.ouvertes, [1, 2]);
  const some = ["1+1", "2+1", "1+2", "3+1", "1+3"];
  assert.equal(canOpenNext(c, st, some.map((k, i) => fact(k, i === 0 ? 1 : 2))), 3); // 4 sur 5 = 80 %
  assert.equal(canOpenNext(c, st, some.map((k, i) => fact(k, i < 2 ? 1 : 2))), null); // 3 sur 5
  const a = updateFamilies(c, st, some.map((k) => fact(k, 2)), NOW, { seance: 7 });
  assert.deepEqual(a.st.ouvertes, [1, 2, 3]); assert.ok(a.events.some((e) => e.type === "ouverte" && e.famille === 3));
  assert.deepEqual(updateFamilies(c, a.st, some.map((k) => fact(k, 2)), NOW, { seance: 7 }).st.ouvertes, [1, 2, 3], "pas deux familles dans la même séance");
  // (lot « Correctifs », écart 6.2 : au plus une par jour, même dans une autre séance ; le lendemain, la suivante)
  assert.deepEqual(updateFamilies(c, a.st, some.map((k) => fact(k, 2)), NOW + 3600e3, { seance: 8 }).st.ouvertes, [1, 2, 3], "pas deux familles le même jour");
  assert.deepEqual(updateFamilies(c, a.st, some.map((k) => fact(k, 2)), NOW + DAY, { seance: 8 }).st.ouvertes, [1, 2, 3, 4]);
  // une famille sans fait nouveau à introduire (6, presque-doubles) s'ouvre de la même façon
  const st5 = { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3, 4, 5] };
  assert.equal(canOpenNext(c, st5, some.map((k) => fact(k, 3))), 6);
});

test("famille acquise : 80 % des faits de sa RÈGLE en boîte 3 (les amis de 10 comptent 9 + 1, 8 + 2, 5 + 5) ; formes à trou à 50 %, définitives", () => {
  const amis = ruleFacts(c, 3).map((f) => f.fait); // 9 faits
  // (lot 3 bis, A1 : chaque fait compté réussi au moins une fois à trou, ces réussites sur deux jours au moins)
  const trou = (k, boite, jours = [2, 1]) => fact(k, boite, { historique: jours.map((j) => ({ t: NOW - j * DAY, juste: true, ms: 2000, forme: "trouDroite" })) });
  const known = (n, boite = 3) => amis.slice(0, n).map((k) => trou(k, boite));
  assert.equal(isAcquired(c, known(7), 3), false); assert.equal(isAcquired(c, known(8), 3), true); // 8/9 >= 80 %
  assert.equal(isAcquired(c, amis.map((k) => fact(k, 3)), 3), false, "réussis seulement à la forme directe");
  assert.equal(isAcquired(c, amis.map((k) => trou(k, 3, [1])), 3), false, "réussis à trou, mais le même jour");
  assert.equal(isAcquired(c, amis.map((k, i) => trou(k, 3, [i % 2 + 1])), 3), true, "réussites réparties sur deux jours");
  assert.equal(isAcquired(c, ruleFacts(c, 2).map((f) => fact(f.fait, 3)), 2), false, "doubles : la boîte 3, mais un seul jour");
  assert.equal(isAcquired(c, ruleFacts(c, 2).map((f, i) => fact(f.fait, 3, { historique: [{ t: NOW - (i % 2 + 1) * DAY, juste: true, ms: 2000 }] })), 2), true, "doubles : deux jours, pas besoin de trou");
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
  // (les règles du lot 2, à deux modules ; le lot 3 en ajoute un troisième : tests/unit/calcul.test.mjs)
  const seance = { alternance: { modules: [1, 2] } };
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
    const x = m.next({ guide: i < guides }); if (!x) break; const { q, cfg } = x, ok = answer(q);
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
  // (lot 3 bis : des réussites à trou la veille ; celles de la séance font le second jour)
  for (const f of ruleFacts(c, 3)) await store.put("faits", fact(f.fait, f.a + f.b === 10 && f.a <= 2 || f.a === 5 ? 3 : 2, { montee: 0, historique: [{ t: NOW - DAY, juste: true, ms: 2000, forme: "trouGauche" }] }));
  await store.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  const { events, fin } = await notion(store, { n: 20 });
  assert.equal(events.filter((e) => e.type === "montee").length, 1);
  assert.ok((await store.get("niveaux", 2)).acquises.includes(3));
  assert.ok(fin.events.some((e) => e.type === "acquise" && e.famille === 3));
});

test("sélecteur en notion du jour : facile = la famille seule, aide d'emblée (amis de 10 : toutes à trou, lot 3 bis) ; dur = formes à trou et famille suivante ; très dur = tout mêlé", async () => {
  const mk = async () => { const s = await open(); for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "2+2", "9+1", "8+2", "5+5"]) await s.put("faits", fact(k, 3)); await s.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] }); return s; };
  const f = await notion(await mk(), { n: 12, cran: "facile" });
  const rule3 = new Set(ruleFacts(c, 3).map((x) => x.fait));
  assert.ok(f.qs.every((q) => q.aideDEmblee && (q.forme !== "directe" || !rule3.has(q.fait))));
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
  // 3, 4, 5 ouvertes par le parent ; 3 et 4 ne sont pas toutes acquises (les amis de 10 ne le sont pas) : 6 attend
  assert.deepEqual(st.ouvertes.slice(0, 5), [1, 2, 3, 4, 5]); assert.ok(st.ouvertures.filter((o) => o.parent).length >= 3);
  const s2 = await open(); await markFamilyKnown(s2, c, 1, NOW); await markFamilyKnown(s2, c, 2, NOW);
  const st2 = await s2.get("niveaux", 2); assert.deepEqual(st2.acquises, [1, 2]); assert.deepEqual(st2.ouvertes, [1, 2, 3], "familles 1 et 2 connues : la 3 s'ouvre");
  assert.ok(st.acquises.includes(5) && st.obtenus.find((o) => o.famille === 5).parent);
  const faits = await store.all("faits");
  assert.ok(ruleFacts(c, 5).every((r) => faits.find((f) => f.fait === r.fait)?.boite >= 3));
  assert.ok(isAcquired(c, faits, 5));
  const parent = load("parent.json"); assert.deepEqual(parent.pointDeDepart.familles, c.familles.map((f) => f.id)); // (lot « Sommes jusqu'à 30 » : 1 à 13)
});

// lot 3 (docs/SPEC-LOT3.md, section 4) : la règle leconSiPasVue du lot 2 est supprimée ; une leçon n'est jouée que pour ce
// qu'on va travailler
test("lot 3 : leçon jamais vue : les maisons de 8 et 9 jouent L6, les presque-doubles L4 (jamais L6), le mélange aucune", async () => {
  const st = (famille, lecons = []) => ({ ...initialFamilies(c, NOW), ouvertes: [1, 2, 3, 4, 5, 6, 7], acquises: [1, 2, 3, 4, 5, 6, 7].filter((id) => id < famille), lecons });
  const entry = async (famille, lecons) => { const s = await open(); await s.put("niveaux", st(famille, lecons)); return (await new Module2Runner({ store: s, content: c, rnd: rng(1), cran: () => "conseille" }).load()).entryLesson(); };
  assert.equal(await entry(5), "L6");
  assert.equal(await entry(5, ["L6"]), null);
  assert.equal(await entry(6), "L4");
  assert.equal(await entry(6, ["L4"]), null);
  assert.equal(await entry(7), null);
  assert.equal(await entry(7, ["L4", "L6"]), null);
  // les familles 2 à 4 : leur propre leçon, la première fois
  assert.equal(await entry(2), "L4"); assert.equal(await entry(3), "L5"); assert.equal(await entry(4), "L6");
  assert.equal(await entry(4, ["L6"]), null);
});

// décisions du parent du 27 septembre (relecture extérieure), corrections 3 et 4
test("cran « plus facile » : un fait réussi avec l'aide affichée d'emblée ne change pas de boîte (ni montée, ni retour en boîte 1) ; une erreur le renvoie en boîte 1", async () => {
  const store = await open();
  for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "2+2"]) await store.put("faits", fact(k, 3));
  for (const f of ruleFacts(c, 3)) await store.put("faits", fact(f.fait, 2));
  await store.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  const before = new Map((await store.all("faits")).map((f) => [f.fait, f.boite]));
  const { qs } = await notion(store, { n: 12, cran: "facile" });
  assert.ok(qs.every((q) => q.aideDEmblee));
  const after = await store.all("faits");
  for (const f of after) if (before.has(f.fait)) assert.equal(f.boite, before.get(f.fait), `${f.fait} : boîte ${before.get(f.fait)} -> ${f.boite}`);
  const rep = await store.all("reponses");
  assert.ok(rep.every((r) => r.aideDEmblee && !r.aide), "noté « aide d'emblée », pas « aide demandée »");
  // une erreur avec l'aide d'emblée : boîte 1, comme toute erreur
  const s2 = await open(); await s2.put("faits", fact("9+1", 3)); for (const f of ruleFacts(c, 3)) if (f.fait !== "9+1") await s2.put("faits", fact(f.fait, 2));
  await s2.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  await notion(s2, { n: 12, cran: "facile", answer: (q) => q.fait !== "9+1" });
  const f91 = (await s2.all("faits")).find((f) => f.fait === "9+1"); if (f91.historique.length > 1) assert.equal(f91.boite, 1);
  // au cran conseillé, la même réussite fait monter
  const s3 = await open(); for (const f of ruleFacts(c, 3)) await s3.put("faits", fact(f.fait, 2));
  await s3.put("niveaux", { ...initialFamilies(c, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] });
  await notion(s3, { n: 12 });
  assert.ok((await s3.all("faits")).some((f) => f.boite === 3));
});

test("stagnation : une famille pas acquise après 6 séances en notion du jour est dépassée ; la suivante devient la famille en cours, avec sa leçon ; l'autre reste en révision", async () => {
  assert.deepEqual(c.familles2.stagnation, { seances: 6 });
  // familles 1 et 2 ouvertes, la 1 jamais acquise : après 6 séances, la famille en cours est la 2 (L4)
  let st = initialFamilies(c, NOW);
  for (let i = 1; i <= 5; i++) { const n = noteNotion(c, st, 1, NOW, { seance: i }); st = n.st; assert.deepEqual(n.events, []); assert.equal(currentFamily(c, st), 1); }
  const n6 = noteNotion(c, st, 1, NOW, { seance: 6 }); st = n6.st;
  assert.deepEqual(n6.events, [{ type: "depassee", famille: 1 }]); assert.equal(currentFamily(c, st), 2);
  assert.deepEqual(st.ouvertes, [1, 2], "la famille 2 était déjà ouverte");
  // la famille suivante pas encore ouverte : elle s'ouvre (notée « stagnation »)
  let s2 = { ...initialFamilies(c, NOW), acquises: [1] };
  for (let i = 1; i <= 6; i++) s2 = noteNotion(c, s2, 2, NOW, { seance: i }).st;
  assert.deepEqual(s2.ouvertes, [1, 2, 3]); assert.ok(s2.ouvertures.at(-1).stagnation); assert.equal(currentFamily(c, s2), 3);
  // une famille acquise entre-temps n'est jamais dépassée ; le mélange non plus
  let s3 = { ...initialFamilies(c, NOW), acquises: [1] };
  for (let i = 1; i <= 8; i++) s3 = noteNotion(c, s3, 1, NOW).st;
  assert.equal((s3.depassees ?? []).length, 0);
  // dans la notion du jour : la séance compte, la leçon de la famille suivante se joue, la famille dépassée revient parmi les « autres familles »
  const store = await open();
  for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "4+1", "1+4", "2+2"]) await store.put("faits", fact(k, 1));
  await store.put("niveaux", { ...initialFamilies(c, NOW), seancesNotion: { 1: 5 }, notion: [1] });
  const { m, fin } = await notion(store, { n: 12, answer: () => false });
  assert.equal(m.famille, 1); assert.ok(fin.events.some((e) => e.type === "depassee" && e.famille === 1));
  const m2 = await new Module2Runner({ store, content: c, rnd: rng(3), seance: 2, clock: () => NOW, cran: () => "conseille" }).load();
  assert.equal(m2.famille, 2); assert.equal(m2.entryLesson(), "L4");
  const qs = []; for (let i = 0; i < 12; i++) { const { q, cfg } = m2.next(); qs.push(q); await m2.record({ q, value: expected(q), ok: true, ms: 2500, listens: 1 }, cfg); }
  const rule2 = new Set(ruleFacts(c, 2).map((f) => f.fait));
  assert.ok(qs.some((q) => !rule2.has(q.fait)), "la famille dépassée reste travaillée");
});
