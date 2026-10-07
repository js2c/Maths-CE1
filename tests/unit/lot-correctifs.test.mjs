// Lot « Correctifs » (docs/LOTS.md, fiche 2 bis) : les décisions du parent du 6 octobre 2026 sur le rapport de
// confrontation de la spécification avec le code (docs/ECARTS-SPEC.md). Les numéros sont ceux du rapport.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { makeEstimate, makeJump, makePlace, makeRead, makeWrite } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { DAY, catalog } from "../../app/js/modules/facts/facts.js";
import { initialFamilies, noteNotion, openChosen, openPending, openedToday, updateFamilies } from "../../app/js/modules/facts/families.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { markFamilyKnown } from "../../app/js/parent/depart.js";
import { Module3Runner, calcAnswer, calcQuestion, initialCalcState } from "../../app/js/modules/calc/runner.js";
import { fill, sentences } from "../../app/js/engine/phrases.js";
import { inventaire, lireContenu } from "../../tools/voix/inventaire.mjs";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const src = (f) => readFileSync(new URL(`../../app/js/${f}`, import.meta.url), "utf8");
const m1 = load("module1.json"), m2 = load("module2.json"), m3 = load("module3.json"), textes = load("textes.json");
const NOW = new Date(2026, 9, 12, 18, 0).getTime();
const gen = (c, r, o = {}) => (o.format === "ecrire" ? makeWrite(c, r, o) : o.format === "sauter" ? makeJump(c, r) : o.format === "placer" ? makePlace(c, r, o) : o.format === "estimer" ? makeEstimate(c, r, o) : makeRead(c, r, o));
const juste = (n, ms = 2000) => ({ q: n.q, value: n.q.answer, ok: true, code: null, ms, listens: 1 });

test("10.1 et 12.3 : l'espace parent ne montre plus les cadeaux de la surprise (supprimés le 5 octobre 2026)", () => {
  assert.ok(!/cadeaux de la surprise dans le récif|K\.cadeaux/.test(src("parent/parent.js")));
});

test("4.2 : à la ligne avec « jouer », une réponse au cran « plus facile » ne fait jamais monter, même au niveau conseillé (niveau 1)", async () => {
  // conseillé au niveau 1 : « plus facile » (décalage − 1) reste au niveau 1, qui est le conseillé
  const R = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(5), seance: 1, offset: () => -1, cran: () => "facile" }).load(), ev = [];
  assert.equal(R.eff(), 1);
  for (let i = 0; i < 14; i++) { const n = R.next(); ev.push(...(await R.record(juste(n, 1500), n.cfg)).events); }
  assert.ok(!ev.some((e) => e.type === "montee"), "ni montée, ni voie rapide (5 réponses justes et rapides)");
  assert.equal(R.st.niveau, 1);
  // au cran conseillé, les mêmes réponses font monter (voie rapide) : le cran seul fait la différence
  const C = await new Module1Runner({ screen: { generate: gen }, store: await Store.open(new IDBFactory()), content: m1, rnd: rng(5), seance: 1, offset: () => 0, cran: () => "conseille" }).load(), evC = [];
  for (let i = 0; i < 14; i++) { const n = C.next(); evC.push(...(await C.record(juste(n, 1500), n.cfg)).events); }
  assert.ok(evC.some((e) => e.type === "montee"));
});

// ---- 6.2 : au plus une famille d'additions ouverte par jour, toutes voies confondues
const fait = (k, boite) => { const [a, b] = k.split("+").map(Number); return { fait: k, a, b, boite, prochain: NOW + 30 * DAY, historique: [{ t: NOW - DAY, juste: true, ms: 2000 }] }; };
const faitsSus = (fams, boite = 2) => catalog(m2).filter((f) => fams.includes(f.famille)).map((f) => fait(f.fait, boite));

test("6.2 : la notion du jour n'ouvre pas une deuxième famille le même jour, quelle que soit la voie de la première ; le lendemain, si", () => {
  const faits = faitsSus([1, 2, 3]);
  for (const voie of [{ seance: 4 }, { echauffement: true, seance: 4 }, { stagnation: true, seance: 3 }, { choix: true }, { parent: true }]) {
    const st = { ...initialFamilies(m2, NOW - 30 * DAY), ouvertes: [1, 2, 3], ouvertures: [{ famille: 1, date: NOW - 30 * DAY }, { famille: 2, date: NOW - 30 * DAY }, { famille: 3, date: NOW - 3600e3, ...voie }] };
    assert.ok(openedToday(m2, st, NOW));
    assert.deepEqual(updateFamilies(m2, st, faits, NOW, { seance: 5 }).st.ouvertes, [1, 2, 3], JSON.stringify(voie));
    assert.deepEqual(updateFamilies(m2, st, faits, NOW + DAY, { seance: 6 }).st.ouvertes, [1, 2, 3, 4], "le lendemain");
  }
  // les familles ouvertes au départ (1 et 2, le jour de la création de la base) ne sont pas des ouvertures
  const neuf = initialFamilies(m2, NOW - 3600e3);
  assert.ok(!openedToday(m2, neuf, NOW));
  assert.deepEqual(updateFamilies(m2, neuf, faitsSus([1, 2]), NOW, { seance: 1 }).st.ouvertes, [1, 2, 3]);
});

test("6.2 : le choix (écran « choisir ») et le point de départ du parent y échappent : ils ouvrent même si une famille s'est ouverte le jour même", async () => {
  const st = { ...initialFamilies(m2, NOW - 30 * DAY), ouvertes: [1, 2, 3], ouvertures: [{ famille: 3, date: NOW - 3600e3, seance: 4 }] };
  assert.deepEqual(openChosen(st, 5, NOW, 5).ouvertes, [1, 2, 3, 5]);
  const store = await Store.open(new IDBFactory()); await store.put("niveaux", st);
  await markFamilyKnown(store, m2, 4, NOW);
  assert.ok((await store.get("niveaux", 2)).ouvertes.includes(4));
});

test("6.2 : une famille dépassée (stagnation) le jour où une autre s'est ouverte : la suivante s'ouvre à la séance d'additions d'un autre jour", async () => {
  // famille 3 ouverte ce matin par le choix, puis travaillée ; la famille 4, en cours depuis 6 séances, est dépassée ce soir
  const st0 = { ...initialFamilies(m2, NOW - 60 * DAY), ouvertes: [1, 2, 3, 4], acquises: [1, 2, 3], ouvertures: [{ famille: 3, date: NOW - 7200e3, choix: true }, { famille: 4, date: NOW - 30 * DAY, seance: 2 }], seancesNotion: { 4: 5 } };
  const n = noteNotion(m2, st0, 4, NOW, { seance: 9 });
  assert.ok(n.events.some((e) => e.type === "depassee" && e.famille === 4));
  assert.ok(!n.events.some((e) => e.type === "ouverte"), "pas ce jour-là");
  assert.deepEqual(n.st.ouvertes, [1, 2, 3, 4]); assert.ok(n.st.ouvertureEnAttente);
  assert.equal(openPending(m2, n.st, NOW + 3600e3).st, n.st, "toujours pas le même jour");
  // une autre séance d'additions le même soir : la famille dépassée ne redevient pas la famille en cours (relecture du lot)
  const store0 = await Store.open(new IDBFactory()); await store0.put("niveaux", n.st);
  for (const f of faitsSus([1, 2, 3, 4], 3)) await store0.put("faits", f);
  assert.equal((await new Module2Runner({ store: store0, content: m2, rnd: rng(1), seance: 9.5, clock: () => NOW + 3600e3 }).load()).famille, 3, "la dernière famille ouverte non dépassée");
  // le lendemain, au début de la notion du jour des additions (« jouer ») : la famille 5 s'ouvre et devient la famille en cours
  const store = await Store.open(new IDBFactory()); await store.put("niveaux", n.st);
  for (const f of faitsSus([1, 2, 3, 4], 3)) await store.put("faits", f);
  const R = await new Module2Runner({ store, content: m2, rnd: rng(1), seance: 10, clock: () => NOW + DAY }).load();
  assert.equal(R.famille, 5);
  const st = await store.get("niveaux", 2);
  assert.ok(st.ouvertes.includes(5) && !st.ouvertureEnAttente);
  assert.ok(st.ouvertures.some((o) => o.famille === 5 && o.stagnation));
  // sans autre ouverture ce jour-là, la stagnation ouvre la suivante aussitôt, comme avant
  const st1 = { ...st0, ouvertures: [{ famille: 3, date: NOW - 10 * DAY }, { famille: 4, date: NOW - 9 * DAY }] };
  assert.deepEqual(noteNotion(m2, st1, 4, NOW, { seance: 9 }).st.ouvertes, [1, 2, 3, 4, 5]);
});

// ---- 7.3 : niveau 9 du calcul rapide, la forme à trou au cran « très dur », comme aux niveaux 4 à 8
test("7.3 : au niveau 9, « très dur » pose le trou sur le second nombre (« 42 moins combien ? Ça fait 37. ») ; chaque phrase est dans l'inventaire de la voix", async () => {
  assert.equal(m3.niveaux[8].trou, true);
  const store = await Store.open(new IDBFactory()); await store.put("niveaux", { ...initialCalcState(), vus: { 9: 10 } });
  const R = await new Module3Runner({ store, content: m3, content2: m2, rnd: rng(11), seance: 1, cran: () => "tresdur", choix: 9 }).load(), inv = inventaire(lireContenu()), reponses = new Set();
  for (let i = 0; i < 30; i++) {
    const { q, cfg } = R.next();
    assert.equal(q.forme, "trouDroite"); assert.equal(q.op, "-"); assert.equal(q.n, q.a - q.b);
    assert.equal(calcAnswer(q), q.b); assert.equal(calcQuestion(q), `${q.a} − ? = ${q.n}`);
    for (const s of sentences(fill(textes.calcTrouMoins, { a: q.a, n: q.n }))) assert.ok(inv.has(s), s);
    reponses.add(calcAnswer(q));
    await R.record({ q, value: q.b, ok: true, ms: 3000, listens: 1 }, cfg);
  }
  assert.ok(reponses.size >= 5, "la réponse varie");
});

// ---- 5.4 : la tolérance d'« estimer » se resserre d'après les estimations justes du niveau joué
test("5.4 : niveau 8 choisi (conseillé au niveau 3) : après 5 estimations justes, la tolérance passe de ± 8 à ± 5, et le reste à la séance suivante", async () => {
  const store = await Store.open(new IDBFactory()), mk = (cran = "conseille") => new Module1Runner({ screen: { generate: gen }, store, content: m1, rnd: rng(2), seance: 1, choix: 8, cran: () => cran }).load();
  await store.put("niveaux", { ...(await (await mk()).st), niveau: 3 });
  const R = await mk(), tol = [];
  // (réponses lentes : pas de voie rapide, qui validerait le niveau 8)
  for (let i = 0; i < 7; i++) { const n = R.next(); tol.push(n.q.tolerance); await R.record(juste(n, 7000), n.cfg); }
  assert.deepEqual(tol, [8, 8, 8, 8, 8, 5, 5]);
  assert.equal(R.st.niveau, 3, "le conseillé n'a pas bougé (7 réponses justes, pas 8 sur 10)");
  assert.equal((await mk()).next().q.tolerance, 5, "séance suivante");
  // au cran « plus facile » (± 10, repère), les estimations justes ne comptent pas
  const store2 = await Store.open(new IDBFactory()), F = await new Module1Runner({ screen: { generate: gen }, store: store2, content: m1, rnd: rng(2), seance: 1, choix: 8, cran: () => "facile" }).load();
  for (let i = 0; i < 6; i++) { const n = F.next(); await F.record(juste(n), n.cfg); }
  assert.equal(F.justesEstimer(8), 0);
});

test("5.4 : une base d'avant reprend les estimations justes comptées au niveau conseillé (sauvegarde restaurée)", async () => {
  const store = await Store.open(new IDBFactory());
  await store.put("niveaux", { module: 1, niveau: 13, fenetre: [], vus: 3, taux: [], obtenus: [], lecons: [], justesNiveau: 5 });
  const R = await new Module1Runner({ screen: { generate: gen }, store, content: m1, rnd: rng(4), seance: 1, offset: () => 0, cran: () => "conseille" }).load();
  assert.equal(R.justesEstimer(13), 5); assert.equal(R.next().q.tolerance, 40);
});

// ---- 6.9 : difficulté persistante aux maisons de 8 et 9 (L6) et aux presque-doubles (L4), au plus une fois par séance
test("6.9 : 3 erreurs sur 5 relancent L6 aux maisons de 8 et 9, L4 aux presque-doubles (même déjà vues), une seule fois par séance ; le mélange, aucune", async () => {
  for (const [famille, lecon] of [[5, "L6"], [6, "L4"], [7, null]]) {
    const store = await Store.open(new IDBFactory());
    await store.put("niveaux", { ...initialFamilies(m2, NOW - 30 * DAY), ouvertes: [1, 2, 3, 4, 5, 6, 7].filter((x) => x <= famille), acquises: [1, 2, 3, 4, 5, 6].filter((x) => x < famille), lecons: ["L4", "L5", "L6"], notion: [famille] });
    for (const f of faitsSus([1, 2, 3, 4, 5], 2)) await store.put("faits", f);
    const R = await new Module2Runner({ store, content: m2, rnd: rng(3), seance: 1, clock: () => NOW }).load(), lecons = [];
    assert.equal(R.famille, famille); assert.equal(R.entryLesson(), null, "leçon déjà vue : pas de leçon d'entrée");
    for (let i = 0; i < 15; i++) {
      const x = R.next(); if (!x) break;
      const r = await R.record({ q: x.q, value: -1, ok: false, ms: 4000, listens: 1 }, x.cfg);
      lecons.push(...r.events.filter((e) => e.type === "lecon").map((e) => `${e.id}:${e.raison}`));
    }
    assert.deepEqual(lecons, lecon ? [`${lecon}:difficulte`] : [], `famille ${famille}`);
  }
});

// ---- 7.6 : au mur, une erreur non reconnue ne parle pas du chemin
test("7.6 : au mur, l'erreur non reconnue dit « Hmm, regardons ensemble. » (la phrase de la ligne, qui a déjà sa voix)", () => {
  assert.equal(textes.erreurCalc.autre, "Hmm, regardons ensemble."); assert.equal(textes.erreurCalc.autre, textes.erreur.autre);
  const index = JSON.parse(readFileSync(new URL("../../app/assets/voix/index.json", import.meta.url), "utf8"));
  assert.ok(index.phrases["Hmm, regardons ensemble."], "voix déjà fabriquée");
  // (elle n'est dite qu'au mur : sur le chemin, « Ce n'est pas grave, regardons ensemble. » puis les ponts rejoués)
  assert.match(src("modules/calc/screen.js"), /wall \? \(r\.nsp \? T\.faitNSP : why \?\? E\.autre\) : T\.faitNSP/);
});
