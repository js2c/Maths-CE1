// Espace parent : les calculs des tableaux de bord et des exports (app/js/parent/data.js), et la
// restauration d'une sauvegarde (Store.restore).
import "fake-indexeddb/auto";
import { test } from "node:test";
import assert from "node:assert/strict";
import * as D from "../../app/js/parent/data.js";
import { readFileSync } from "node:fs";
import { DB_NAME, MIGRATIONS, Store, STORES } from "../../app/js/engine/store.js";

const at = (y, m, d, h = 18) => new Date(y, m - 1, d, h).getTime();

test("grille du mois : semaines du lundi au dimanche", () => {
  const g = D.monthGrid(2026, 8); // septembre 2026 commence un mardi
  assert.equal(g[0][0], null); assert.equal(new Date(g[0][1]).getDate(), 1);
  assert.ok(g.every((w) => w.length === 7));
  assert.equal(g.flat().filter(Boolean).length, 30);
});

test("séances par jour et bilan du mois", () => {
  const S = [
    { id: 1, debut: at(2026, 9, 1), dureeS: 400, questions: 10, justes: 8, terminee: true },
    { id: 2, debut: at(2026, 9, 1, 19), dureeS: 60, questions: 2, justes: 0, terminee: false },
    { id: 3, debut: at(2026, 9, 3), dureeS: 380, questions: 10, justes: 5, terminee: true },
    { id: 4, debut: at(2026, 8, 30), dureeS: 380, questions: 10, justes: 10, terminee: true },
  ];
  const d = D.byDay(S).get("2026-09-01");
  assert.equal(d.seances.length, 2); assert.equal(d.dureeS, 460); assert.equal(d.reussite, 8 / 12); assert.equal(d.terminee, true);
  const m = D.monthSummary(S, 2026, 8);
  assert.deepEqual({ ...m, reussite: +m.reussite.toFixed(3) }, { jours: 2, seances: 3, terminees: 2, dureeS: 840, reussite: +(13 / 22).toFixed(3) });
  assert.equal(D.level(0.8, { bien: 0.8, moyen: 0.5 }), "bien"); assert.equal(D.level(0.49, { bien: 0.8, moyen: 0.5 }), "faible"); assert.equal(D.level(null, { bien: 0.8, moyen: 0.5 }), null);
});

test("réponses d'une séance groupées par module, dans l'ordre", () => {
  const R = [{ seance: 1, t: 3, module: 1 }, { seance: 1, t: 1, module: 2 }, { seance: 2, t: 2, module: 2 }, { seance: 1, t: 2, module: 2 }];
  const g = D.answersOf(R, 1);
  assert.deepEqual(g.map((x) => [x.module, x.reponses.map((r) => r.t)]), [[2, [1, 2]], [1, [3]]]);
});

test("semaine par semaine : sans exemples guidés ni temps de base, semaines vides gardées", () => {
  const R = [
    { module: 1, t: at(2026, 9, 1), juste: true, tempsMs: 4000 }, { module: 1, t: at(2026, 9, 2), juste: false, tempsMs: 9000 }, { module: 1, t: at(2026, 9, 2), juste: true, tempsMs: 6000 },
    { module: 1, t: at(2026, 9, 2), juste: false, guide: true }, { module: 2, t: at(2026, 9, 2), juste: true, forme: "base" },
    { module: 1, t: at(2026, 9, 17), juste: true, tempsMs: 3000 },
  ];
  const W = D.weekly(R, 1, at(2026, 9, 18));
  assert.equal(W.length, 3);
  assert.deepEqual([W[0].n, W[0].justes, W[0].medianeMs], [3, 2, 5000]);
  assert.equal(W[1].n, 0); assert.equal(W[1].taux, null);
  assert.equal(W[2].taux, 1);
  assert.deepEqual(D.weekly(R, 2, at(2026, 9, 18)), []);
});

test("journal des erreurs : par semaine, avec des exemples", () => {
  const R = [
    { t: at(2026, 9, 1), juste: false, erreur: "E1", question: "q1", donnee: 7, attendue: 6 }, { t: at(2026, 9, 2), juste: false, erreur: "E1", question: "q2" },
    { t: at(2026, 9, 2), juste: false, erreur: "E1", question: "q3" }, { t: at(2026, 9, 9), juste: false, erreur: "E3" }, { t: at(2026, 9, 9), juste: true, erreur: null },
  ];
  const J = D.errorJournal(R);
  assert.equal(J.length, 2); assert.equal(J[1].codes.E1.n, 3); assert.equal(J[1].codes.E1.exemples.length, 2); assert.equal(J[0].codes.E3.n, 1);
});

test("niveaux et faits", () => {
  const h = D.levelHistory({ obtenus: [{ niveau: 1, date: 1 }, { niveau: 2, date: 5 }], redescentes: [{ de: 2, a: 1, date: 9 }] });
  assert.deepEqual(h.map((e) => [e.type, e.niveau]), [["obtenu", 1], ["obtenu", 2], ["redescente", 1]]);
  const F = D.factsSummary([{ fait: "2+1", boite: 1, historique: [{ juste: false }, { juste: false }] }, { fait: "3+1", boite: 3, historique: [{ juste: true }] }, { fait: "4+1", boite: 1, historique: [{ juste: true }, { juste: true }, { juste: true }] }]);
  assert.deepEqual(F.boites, [2, 0, 1, 0, 0]); assert.deepEqual(F.resistent.map((f) => f.fait), ["2+1", "4+1"]);
});

test("CSV : point-virgule, virgule décimale, guillemets, oui/non", () => {
  const csv = D.toCSV([["a", (r) => r.a], ["b", (r) => r.b], ["c", (r) => r.c]], [{ a: 1.5, b: 'dit "non"; puis', c: true }, { a: null, b: "x", c: false }]);
  assert.equal(csv, 'a;b;c\r\n1,5;"dit ""non""; puis";oui\r\n;x;non\r\n');
  const row = D.toCSV(D.ANSWER_COLUMNS, [{ id: 1, seance: 2, t: at(2026, 9, 1), module: 1, niveau: 3, question: "lire 14", forme: "lire", donnee: 15, attendue: 14, juste: false, tempsMs: 4260, ecoutes: 2, aide: false, erreur: "E1" }]).split("\r\n")[1];
  assert.equal(row, "1;2;2026-09-01 18:00:00;1;3;lire 14;lire;15;14;non;4,3;2;non;E1;non;non;non;non;non");
});

test("sauvegarde : pas de code parent ; contrôle avant restauration", () => {
  const dump = { base: DB_NAME, version: MIGRATIONS.length, reglages: [{ cle: "codeParent", valeur: "1234" }, { cle: "mascotte", valeur: "Pili" }], ...Object.fromEntries(STORES.filter((s) => s !== "reglages").map((s) => [s, []])) };
  const clean = D.cleanDump(dump);
  assert.deepEqual(clean.reglages.map((r) => r.cle), ["mascotte"]);
  const ctx = { base: DB_NAME, version: MIGRATIONS.length, stores: STORES };
  assert.equal(D.restoreProblem(clean, ctx), null);
  assert.match(D.restoreProblem({ base: "autre" }, ctx), /pas une sauvegarde/);
  assert.match(D.restoreProblem({ ...clean, version: 99 }, ctx), /plus récente/);
  assert.match(D.restoreProblem({ ...clean, faits: undefined }, ctx), /faits/);
});

test("rappel d'export chaque semaine", () => {
  const DAY = 86400000, now = at(2026, 9, 20);
  assert.equal(D.exportDue({ premiereSeance: null, now }), false);
  assert.equal(D.exportDue({ premiereSeance: now - 3 * DAY, now }), false);
  assert.equal(D.exportDue({ premiereSeance: now - 8 * DAY, now }), true);
  assert.equal(D.exportDue({ dernierExport: now - 2 * DAY, premiereSeance: now - 30 * DAY, now }), false);
  assert.equal(D.fileName("reponses", "csv", now), "ocean-des-nombres-reponses-2026-09-20.csv");
});

test("code : 4 chiffres ; question de secours", () => {
  assert.ok(D.validCode("0427")); assert.ok(!D.validCode("427")); assert.ok(!D.validCode("12a4"));
  const q = D.gateQuestion(() => 0.5);
  assert.equal(q.texte, "8 × 8 + 20"); assert.equal(q.reponse, 84);
});

test("durées et pourcentages en français", () => {
  assert.equal(D.fmtDuration(45), "45 s"); assert.equal(D.fmtDuration(492), "8 min 12 s"); assert.equal(D.fmtDuration(3900), "1 h 05 min"); assert.equal(D.fmtDuration(null), "—");
  assert.equal(D.fmtPct(0.784), "78 %"); assert.equal(D.fmtSeconds(4260), "4,3 s");
});

test("restauration : tout est remplacé, le code actuel est gardé", async () => {
  const st = await Store.open(globalThis.indexedDB, "test-restore");
  await st.add("seances", { debut: 1 }); await st.setSetting("codeParent", "1111"); await st.setSetting("mascotte", "Bulle");
  const dump = D.cleanDump(await st.dump());
  await st.wipe(); await st.setSetting("codeParent", "2222"); await st.add("seances", { debut: 2 }); await st.add("seances", { debut: 3 });
  await st.restore(dump, ["codeParent"]);
  assert.deepEqual((await st.all("seances")).map((s) => s.debut), [1]);
  assert.equal(await st.setting("codeParent"), "2222"); assert.equal(await st.setting("mascotte"), "Bulle");
});

test("cartes (lot 2) : cartes et brillantes, quota restant, zone suivante et ce qu'elle attend, semaines réussies", async () => {
  const { cardsSummary } = await import("../../app/js/parent/data.js");
  const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url))), cal = JSON.parse(readFileSync(new URL("../../app/content/calendrier.json", import.meta.url)));
  const L = cartes.cartes.filter((c) => c.zone === "lagon"), at = (d) => new Date(`${d}T18:00:00`).getTime();
  const owned = Object.fromEntries(L.slice(0, 13).map((c, i) => [c.id, { n: 1, premiere: 0, brillante: i < 2 }]));
  const R = { cartes: { cartes: owned }, quota: { date: at("2026-09-28"), cartes: 10 }, etoiles: { dorees: 1, doreesDepensees: 0, arcEnCiel: 3, arcDepensees: 0, arcLibre: 1 } };
  const seances = ["2026-09-28", "2026-10-01", "2026-10-05", "2026-10-06"].map((d) => ({ debut: at(d), terminee: true })).concat([{ debut: at("2026-10-07"), libre: true }]);
  const K = cardsSummary(R, cartes, cal, seances, at("2026-10-07"));
  assert.deepEqual([K.cartes, K.brillantes, K.quota, K.gagnables], [13, 2, 14, 1]);
  assert.equal(K.semaines, 2); assert.equal(K.prochaineDoree, 2);
  assert.equal(K.zones[0].gagnees, 13); assert.equal(K.zones[0].ouverte, true); assert.equal(K.zones[1].pret, true); assert.equal(K.zones[2].pret, false);
  assert.match(K.suivante.attend, /il reste 2 cartes/);
  const all = Object.fromEntries(L.map((c) => [c.id, { n: 1 }]));
  assert.match(cardsSummary({ ...R, cartes: { cartes: all } }, cartes, cal, seances, at("2026-10-07")).suivante.attend, /étoile arc-en-ciel/);
  assert.match(cardsSummary({ ...R, cartes: { cartes: all }, zones: { ouvertes: ["lagon", "corail"] } }, cartes, cal, seances).suivante.attend, /il reste 15/);
});
