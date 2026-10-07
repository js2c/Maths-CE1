// Lot 3, étape 1 (docs/SPEC-LOT3.md, sections 2 et 4) : choix de l'exercice et du niveau (vignettes, conseillé,
// validés), niveau choisi de la ligne graduée (toutes les questions à ce niveau, validation au-dessus du conseillé,
// jamais de baisse), famille choisie (ouverte sans étoile, limite des faits nouveaux levée), 80 % sur la famille
// (« jouer » et « choisir »), suppression de leconSiPasVue (leçons cohérentes), rappel du double, séance de
// l'exercice choisi, échauffement passé ou retiré par le parent.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { DAY, expected, ruleFacts } from "../../app/js/modules/facts/facts.js";
import { initialFamilies } from "../../app/js/modules/facts/families.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { runWarmup } from "../../app/js/modules/facts/screen.js";
import { makeEstimate, makeJump, makePlace, makeRead, makeWrite } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { EXERCISES, levelItems, tilePos, TILE } from "../../app/js/session/choice.js";
import { CALC_STOPS } from "../../app/js/art/runtime.js";
import { Session } from "../../app/js/session/session.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m1 = load("module1.json"), m2 = load("module2.json"), m3 = load("module3.json"), seance = load("seance.json"), textes = load("textes.json");
const NOW = new Date(2026, 9, 1, 18, 0).getTime();
const open = () => Store.open(new IDBFactory());
const fact = (k, boite) => { const [a, b] = k.split("+").map(Number); return { fait: k, a, b, boite, prochain: NOW + 30 * DAY, historique: [{ t: NOW - DAY, juste: true, ms: 2000 }] }; };
const gen = (cfg, r, o = {}) => (o.format === "ecrire" ? makeWrite(cfg, r, o) : o.format === "sauter" ? makeJump(cfg, r) : o.format === "placer" ? makePlace(cfg, r, o) : o.format === "estimer" ? makeEstimate(cfg, r, o) : makeRead(cfg, r, o));
const res = (q, ok, ms = 3000, code = ok ? null : "E1") => ({ q, value: ok ? q.answer : q.answer + 1, ok, code, ms, listens: 1 });
const mk1 = async (o = {}) => new Module1Runner({ screen: { generate: gen }, store: await open(), content: m1, rnd: rng(4), seance: 1, ...o }).load();
async function notion(store, { n = 40, answer = () => true, cran = "conseille", choix = null } = {}) {
  const m = await new Module2Runner({ store, content: m2, rnd: rng(5), seance: 1, clock: () => NOW, cran: () => cran, choix }).load(), qs = [];
  for (let i = 0; i < n; i++) { const x = m.next(); if (!x) break; const { q, cfg } = x, ok = answer(q); qs.push(q); await m.record({ q, value: ok ? expected(q) : 99, ok, ms: 2500, listens: 1 }, cfg); }
  return { m, qs };
}

test("écran de choix : 13 niveaux, 13 familles (lot « Sommes jusqu'à 30 »), 9 niveaux du calcul ; le conseillé et les niveaux validés ; plus de leçons (lot « Les leçons »)", () => {
  const L = levelItems("ligne", { st1: { niveau: 4, lecons: ["L1"] }, module1: m1, module2: m2 });
  assert.equal(L.length, 13); assert.deepEqual(L.filter((x) => x.conseille).map((x) => x.key), [4]); assert.deepEqual(L.filter((x) => x.valide).map((x) => x.key), [1, 2, 3]);
  assert.ok(L.every((x) => x.sprite === `choix.ligne.${x.key}`));
  // base vide : le niveau 1 conseillé, rien de validé, mais tout est proposé
  const L0 = levelItems("ligne", { module1: m1, module2: m2 }); assert.equal(L0.length, 13); assert.equal(L0.find((x) => x.conseille).key, 1); assert.ok(!L0.some((x) => x.valide));
  const F = levelItems("additions", { st2: { ...initialFamilies(m2, NOW), ouvertes: [1, 2, 3], acquises: [1, 2] }, module1: m1, module2: m2 });
  assert.equal(F.length, 13); assert.equal(F.find((x) => x.conseille).key, 3); assert.deepEqual(F.filter((x) => x.valide).map((x) => x.key), [1, 2]);
  // (lot « Les leçons » : les leçons ont quitté l'écran « choisir » pour leur bulle de l'accueil, session/lessons.js)
  assert.deepEqual(EXERCISES.map((e) => e.id), ["ligne", "additions", "calcul", "voiliers"]);
  // lot 3, étape 4 : le calcul rapide, 9 niveaux, tous accessibles
  const C = levelItems("calcul", { st3: { acquis: [1, 2], lecons: ["L7"] }, module1: m1, module2: m2, module3: m3 });
  assert.equal(C.length, 9); assert.equal(C.find((x) => x.conseille).key, 3); assert.deepEqual(C.filter((x) => x.valide).map((x) => x.key), [1, 2]);
  for (const x of C) assert.ok(textes.choixCalcul[x.key]);
  // chaque vignette a son nom dit par la voix
  for (const x of L) assert.ok(textes.choixLigne[x.key]); for (const x of F) assert.ok(textes.choixFamille[x.key]);
  // les vignettes tiennent dans la scène (1280 × 800), entre les bras de la pieuvre et les algues de droite (lot 3 bis, B1 :
  // 4 colonnes, sous le bouton de retour) ; le calcul rapide sur son chemin de cailloux
  const inScene = ([x, y]) => x - TILE.w / 2 >= 410 && x + TILE.w / 2 <= 1165 && y - TILE.h / 2 >= 172 && y + TILE.h / 2 <= 790;
  for (const n of [13, 7, 10, m2.familles.length]) for (let i = 0; i < n; i++) assert.ok(inScene(tilePos(i, n)), `${n}, ${i} : ${tilePos(i, n)}`);
  for (let i = 0; i < 9; i++) assert.ok(inScene(tilePos(i, 9, TILE, "calcul", CALC_STOPS)), `calcul ${i} : ${tilePos(i, 9, TILE, "calcul", CALC_STOPS)}`);
});

test("ligne graduée, niveau choisi : toutes les questions à ce niveau (niveau 8 dès une base vide), le cran ne le décale pas", async () => {
  const R = await mk1({ choix: 8, offset: () => 2 });
  for (let i = 0; i < 12; i++) { const n = R.next(); assert.equal(n.q.niveau, 8); assert.equal(n.q.format, "estimer"); await R.record(res(n.q, i % 3 !== 0, 4000, "autre"), n.cfg); }
  R.simpler = true; assert.equal(R.next().q.niveau, 8, "la question « plus simple » reste au niveau choisi");
  R.lower = true; assert.equal(R.next().q.niveau, 8, "le niveau inférieur après une leçon déjà vue : pas avec un niveau choisi");
  // niveau 1 choisi au niveau 1 : la leçon d'entrée L1 la première fois
  assert.equal((await mk1({ choix: 1 })).entryLesson(), "L1"); assert.equal((await mk1({ choix: 9 })).entryLesson(), "L10"); assert.equal((await mk1({ choix: 8 })).entryLesson(), null);
});

test("ligne graduée, niveau choisi au-dessus du conseillé : le réussir le valide (conseillé = suivant) ; échouer ne fait jamais baisser", async () => {
  const R = await mk1({ choix: 5 }); R.st.niveau = 2; const ev = [];
  for (let i = 0; i < 10; i++) { const n = R.next(); assert.equal(n.q.niveau, 5); ev.push(...(await R.record(res(n.q, i !== 3, 7000), n.cfg)).events); }
  assert.ok(ev.some((e) => e.type === "montee" && e.a === 6), JSON.stringify(ev)); assert.equal(R.st.niveau, 6);
  assert.equal(R.next().q.niveau, 5, "la séance reste au niveau choisi");
  const D = await mk1({ choix: 7 }); D.st.niveau = 3; D.st.taux = [0.2];
  for (let i = 0; i < 12; i++) { const n = D.next(); await D.record(res(n.q, false, 9000, "autre"), n.cfg); }
  const f = await D.finish(); assert.equal(D.st.niveau, 3); assert.equal(f.rate, null, "rien ne compte pour la redescente");
  // en dessous du conseillé : pas de redescente non plus
  const B = await mk1({ choix: 2 }); B.st.niveau = 5; B.st.taux = [0.2];
  for (let i = 0; i < 12; i++) { const n = B.next(); assert.equal(n.q.niveau, 2); await B.record(res(n.q, false, 9000, "autre"), n.cfg); }
  await B.finish(); assert.equal(B.st.niveau, 5);
});

test("additions, « jouer » : au moins 80 % des questions sur la famille en cours ; une petite famille (les doubles) s'arrête à 3 passages par fait (lot 3 bis, §0)", async () => {
  const store = await open();
  for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "4+1", "1+4", "5+1", "1+5"]) await store.put("faits", fact(k, 3));
  await store.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2], acquises: [1] });
  const { m, qs } = await notion(store, { n: 40 });
  assert.equal(m.famille, 2);
  const rule = new Set(ruleFacts(m2, 2).map((f) => f.fait)), inFam = qs.filter((q) => rule.has(q.fait)).length;
  const first = qs.slice(0, 15).filter((q) => rule.has(q.fait)).length; assert.ok(first >= 0.8 * 15, `${first} sur 15 dans les doubles`);
  assert.equal(inFam, 15, "5 doubles, 3 passages chacun au plus");
  const count = {}; qs.forEach((q) => { count[q.fait] = (count[q.fait] ?? 0) + 1; }); assert.ok(Object.values(count).every((x) => x <= 3), JSON.stringify(count));
  assert.ok(qs.every((q, i) => i < 1 || q.fait !== qs[i - 1].fait || q.revient), "jamais deux fois de suite le même fait");
  assert.equal(m2.notion.partFamille, 0.8, "le réglage est dans module2.json");
});

test("additions, famille choisie pas encore ouverte : elle s'ouvre sans étoile, devient la famille en cours ; limite des faits nouveaux levée", async () => {
  const store = await open();
  await store.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2], acquises: [] });
  // la boîte 1 est déjà pleine (8 faits) : sans le choix, aucun fait nouveau ne pourrait entrer
  for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "4+1", "1+4", "2+2"]) await store.put("faits", fact(k, 1));
  const { m, qs } = await notion(store, { n: 40, choix: 5 });
  assert.equal(m.famille, 5);
  const st = await store.get("niveaux", 2);
  assert.ok(st.ouvertes.includes(5)); assert.ok(st.ouvertures.some((o) => o.famille === 5 && o.choix));
  const rule = new Set(ruleFacts(m2, 5).map((f) => f.fait)), inFam = qs.filter((q) => rule.has(q.fait)).length;
  assert.ok(inFam >= 0.8 * qs.length, `${inFam} sur ${qs.length} dans les maisons de 8 et 9`);
  const nouveaux = qs.filter((q) => q.nouveau && !q.revient).length;
  assert.ok(nouveaux > m2.nouveauxMaxSeance, `${nouveaux} faits nouveaux (au-delà de ${m2.nouveauxMaxSeance})`);
  // (réponses fausses : les faits nouveaux restent en boîte 1)
  const s3 = await open(); await s3.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2], acquises: [] });
  for (const k of ["1+1", "2+1", "1+2", "3+1", "1+3", "4+1", "1+4", "2+2"]) await s3.put("faits", fact(k, 1));
  await notion(s3, { n: 24, choix: 5, answer: () => false });
  assert.ok((await s3.all("faits")).filter((f) => f.boite === 1).length > m2.boite1Max, "la boîte 1 peut dépasser 8 faits ce jour-là");
  // la famille choisie ne joue que sa leçon (maisons de 8 et 9 : L6 si jamais vue), jamais celle d'une autre famille
  assert.equal(m.entryLesson(), "L6");
  const s2 = await open(); await s2.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2, 3, 4, 5, 6, 7], lecons: [] });
  assert.equal((await new Module2Runner({ store: s2, content: m2, rnd: rng(1), choix: 7 }).load()).entryLesson(), null, "le mélange ne joue aucune leçon");
  assert.equal((await new Module2Runner({ store: s2, content: m2, rnd: rng(1), choix: 3 }).load()).entryLesson(), "L5");
  assert.equal((await new Module2Runner({ store: s2, content: m2, rnd: rng(1), choix: 6 }).load()).entryLesson(), "L4");
  assert.ok(!m2.familles.some((f) => f.leconSiPasVue), "la règle leconSiPasVue est supprimée");
});

test("presque-doubles : chaque question (forme directe) de la famille rappelle le double", async () => {
  const store = await open();
  for (const f of ruleFacts(m2, 6)) await store.put("faits", fact(f.fait, 2));
  await store.put("niveaux", { ...initialFamilies(m2, NOW), ouvertes: [1, 2, 3, 4, 5, 6], acquises: [1, 2, 3, 4, 5], lecons: ["L4"] });
  const { m, qs } = await notion(store, { n: 20 });
  assert.equal(m.famille, 6);
  const rule = new Set(ruleFacts(m2, 6).map((f) => f.fait));
  for (const q of qs) if (rule.has(q.fait) && q.forme === "directe") assert.deepEqual(q.rappel, { d: Math.min(q.a, q.b) }); else assert.equal(q.rappel, undefined);
  assert.ok(qs.some((q) => q.rappel));
  assert.equal(textes.rappelDouble.replace("{a}", 3).replace("{b}", 4).replaceAll("{d}", 3), "3 plus 4, c'est 3 plus 3, et encore 1.");
});

const fakeStore = async () => { const s = await open(); return s; };
test("séance de l'exercice choisi : la notion du jour est l'exercice choisi, le module imposé n'est pas consommé ; échauffement retiré par le parent", async () => {
  const store = await fakeStore(); await store.setSetting("moduleImpose", { module: 2, t: NOW });
  const seen = [];
  const handlers = { accueil: async () => {}, echauffement: async () => seen.push("echauffement"), notion: async ({ session }) => seen.push(`notion ${session.rec.module} ${JSON.stringify(session.choix)}`), recompense: async () => {} };
  const s = new Session({ store, content: seance, handlers, clock: () => NOW, choix: { module: 1, niveau: 8 }, sans: ["echauffement"] });
  const rec = await s.run();
  assert.deepEqual(rec.choix, { module: 1, niveau: 8 }); assert.equal(rec.module, 1); assert.ok(rec.terminee, "elle compte comme la séance du jour");
  assert.deepEqual(seen, ['notion 1 {"module":1,"niveau":8}']);
  assert.ok(rec.etapes.some((e) => e.id === "echauffement" && e.sautee === "réglage du parent"));
  assert.equal((await store.setting("moduleImpose"))?.module, 2, "le module imposé attend la prochaine séance « jouer »");
});

test("passer l'échauffement : arrêté aussitôt, noté dans la séance", async () => {
  const store = await open(), w = await new Warmup({ store, content: m2, rnd: rng(3), seance: 1, clock: () => NOW }).load();
  let skip = null, asked = 0, removed = false;
  const screen = { show() {}, keys() {}, leave() {}, abandon() { this.abandoned = true; }, ask: () => { asked++; if (asked === 2) skip(); return new Promise((res) => { if (asked < 2) res({ value: 2, ms: 2000, listens: 1 }); }); } };
  const session = { rec: {}, progress: { faites: 0 }, expect() {}, over: () => false, answered: async function () { this.progress.faites++; }, stars: async () => {}, nouveaux: 0 };
  await runWarmup({ session, step: { questions: [12, 12] }, warmup: w, screen, rnd: rng(1), skip: (onSkip) => { skip = onSkip; return { remove() { removed = true; } }; } });
  assert.equal(asked, 2); assert.ok(screen.abandoned); assert.ok(removed); assert.deepEqual(session.rec.echauffementPasse, { apres: 1 });
});
