// LOT 3 TER (docs/SPEC-LOT3TER.md) : passer l'échauffement (T1), l'échauffement qui s'ajuste (T2), l'appui long (T3),
// testés sans navigateur.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { catalog, DAY } from "../../app/js/modules/facts/facts.js";
import { answerFact, initialFamilies, openByWarmup, warmupOpening } from "../../app/js/modules/facts/families.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { runWarmup } from "../../app/js/modules/facts/screen.js";
import { WarmupSkip } from "../../app/js/modules/facts/warmupskip.js";

const json = (p) => JSON.parse(readFileSync(new URL(`../../app/content/${p}`, import.meta.url), "utf8"));
const m2 = json("module2.json"), seance = json("seance.json"), textes = json("textes.json");
const NOW = new Date(2026, 9, 12, 18, 0).getTime();
const open = () => Store.open(new IDBFactory());
const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };

// ---------------------------------------------------------------- T1 : passer l'échauffement
test("T1 : réglages et phrase dans le contenu (délai 5 s, place hors du pavé)", () => {
  assert.equal(seance.passerEchauffement.attenteMs, 5000);
  const [x, y] = seance.passerEchauffement.place, r = seance.passerEchauffement.taille / 2;
  // le pavé : touches de x 334 à 1066, y 484 à 724 ; « je ne sais pas » : x 1090 à 1240, y 529 à 679 ; « passer » : y 148 à 288
  assert.ok(y + r < 484 && y - r > 288, "entre « passer » (aide, correction) et le pavé");
  assert.ok(x + r <= 1280 && x - r >= 1066);
  assert.equal(textes.passerEchauffementQuestion, "Tu veux passer l'échauffement ? Touche la coche pour dire oui.");
});

test("T1 : le bouton reste présent pendant tout l'échauffement (il ne disparaît plus à la première réponse)", async () => {
  const store = await open(), w = await new Warmup({ store, content: m2, rnd: rng(3), seance: 1, clock: () => NOW }).load();
  let asked = 0, removedAt = null;
  const screen = { show() {}, keys() {}, leave() {}, abandon() {}, ask: async () => { asked++; if (screen.beforeSubmit) screen.beforeSubmit(); return { value: 2, ms: 2000, listens: 1 }; } };
  const session = { rec: {}, progress: { faites: 0 }, expect() {}, over: () => false, answered: async function () { this.progress.faites++; }, stars: async () => {}, nouveaux: 0 };
  await runWarmup({ session, step: { questions: [10, 10] }, warmup: w, screen, rnd: rng(1), skip: () => ({ remove() { removedAt = asked; } }) });
  assert.ok(asked >= 10, `${asked} questions posées`);
  assert.equal(removedAt, asked, "le bouton n'est retiré qu'après la dernière question");
  assert.equal(session.rec.echauffementPasse, undefined);
});

test("T1 : un toucher met en attente (voix coupée, pavé fermé, coche), la coche passe l'échauffement", async () => {
  const log = [];
  const ws = new WarmupSkip({ attenteMs: 5000, pause: () => log.push("pause"), ask: async () => log.push("question"), resume: () => log.push("reprise"), confirm: () => log.push("passé"), showKey: (v) => log.push(`bouton ${v}`), showCheck: (v) => log.push(`coche ${v}`) });
  assert.deepEqual(log, ["bouton true", "coche false"]); log.length = 0;
  assert.ok(ws.tap()); assert.ok(ws.pending);
  assert.deepEqual(log, ["pause", "bouton false", "coche true", "question"]);
  assert.equal(ws.tap(), false, "un second toucher sur le bouton ne fait rien"); log.length = 0;
  assert.ok(ws.check());
  assert.deepEqual(log, ["coche false", "passé"]); assert.equal(ws.state, "passe");
  assert.equal(ws.check(), false); assert.equal(ws.timeout(), false);
});

test("T1 : sans toucher 5 s après la question, la coche disparaît, le bouton revient et l'échauffement reprend", async () => {
  mock.timers.enable({ apis: ["setTimeout"] });
  try {
    const log = []; let say = null;
    const ws = new WarmupSkip({ attenteMs: seance.passerEchauffement.attenteMs, pause: () => log.push("pause"), ask: () => new Promise((res) => { say = res; }), resume: () => log.push("reprise"), confirm: () => log.push("passé"), showKey: (v) => log.push(`bouton ${v}`), showCheck: (v) => log.push(`coche ${v}`) });
    log.length = 0; ws.tap();
    // le délai part de la fin de la question
    mock.timers.tick(8000); await flush(); assert.ok(ws.pending, "la question n'est pas finie : on attend");
    say(); await flush();
    mock.timers.tick(4999); assert.ok(ws.pending);
    mock.timers.tick(1); assert.equal(ws.pending, false);
    assert.deepEqual(log.slice(-3), ["coche false", "bouton true", "reprise"]);
    // on peut recommencer : cette fois, la coche
    ws.tap(); say(); await flush(); mock.timers.tick(3000); assert.ok(ws.check()); mock.timers.tick(5000);
    assert.equal(log.filter((x) => x === "reprise").length, 1, "pas de reprise après la coche"); assert.equal(log.at(-1), "passé");
    // fin de l'échauffement : plus de bouton ni de coche
    const ws2 = new WarmupSkip({ showKey: (v) => log.push(`b2 ${v}`), showCheck: (v) => log.push(`c2 ${v}`) }); ws2.stop();
    assert.deepEqual(log.slice(-2), ["b2 false", "c2 false"]); assert.equal(ws2.tap(), false);
  } finally { mock.timers.reset(); }
});

test("T1 : la coche touchée pendant l'échauffement le passe à la question en cours ; noté dans la séance", async () => {
  const store = await open(), w = await new Warmup({ store, content: m2, rnd: rng(3), seance: 1, clock: () => NOW }).load();
  let skip = null, asked = 0, removed = false;
  const screen = { show() {}, keys() {}, leave() {}, abandon() { this.abandoned = true; }, ask: () => { asked++; if (asked === 4) skip(); return new Promise((res) => { if (asked < 4) res({ value: 2, ms: 2000, listens: 1 }); }); } };
  const session = { rec: {}, progress: { faites: 0 }, expect() {}, over: () => false, answered: async function () { this.progress.faites++; }, stars: async () => {}, nouveaux: 0 };
  await runWarmup({ session, step: { questions: [12, 12] }, warmup: w, screen, rnd: rng(1), skip: (onSkip) => { skip = onSkip; return { remove() { removed = true; } }; } });
  assert.equal(asked, 4); assert.ok(screen.abandoned); assert.ok(removed); assert.deepEqual(session.rec.echauffementPasse, { apres: 3 });
});

// ---------------------------------------------------------------- T2 : l'échauffement s'ajuste seul
const cat = catalog(m2);
const factsOf = (fams, boite = 2, skip = 0) => cat.filter((f) => fams.includes(f.famille)).slice(skip).map((f) => ({ fait: f.fait, a: f.a, b: f.b, famille: f.famille, boite, prochain: NOW + DAY, historique: [{ t: NOW - DAY, juste: true, ms: 2000 }] }));
const answers = (fams, n, { juste = () => true, ms = 2000, t0 = NOW - 3600e3, extra = {} } = {}) => {
  const pool = cat.filter((f) => fams.includes(f.famille));
  return Array.from({ length: n }, (_, i) => { const f = pool[i % pool.length]; return { t: t0 + i * 1000, module: 2, seance: 9, question: `${f.a} + ${f.b}`, fait: f.fait, forme: "directe", juste: juste(i), tempsMs: ms, aide: false, ...extra }; });
};
const L = 6000;

test("T2 : les trois conditions remplies, la famille suivante s'ouvre (au plus une)", () => {
  const st = initialFamilies(m2, NOW - 30 * DAY), o = warmupOpening(m2, st, factsOf([1, 2]), answers([1, 2], 12), NOW, { limitMs: L });
  assert.equal(o.famille, 3); assert.deepEqual(o.conditions, [true, true, true]);
  const st2 = openByWarmup(st, 3, NOW, 7);
  assert.deepEqual(st2.ouvertes, [1, 2, 3]); assert.deepEqual(st2.ouvertures.at(-1), { famille: 3, date: NOW, echauffement: true, seance: 7 });
});

test("T2, condition 1 : tous les faits des familles ouvertes introduits, 80 % en boîte 2 ou plus", () => {
  const st = initialFamilies(m2, NOW - 30 * DAY), rep = answers([1, 2], 12);
  assert.equal(warmupOpening(m2, st, factsOf([1, 2], 2, 1), rep, NOW, { limitMs: L }).famille, null, "un fait pas encore introduit");
  const all = factsOf([1, 2]), k = Math.floor(all.length * 0.2);
  all.slice(0, k).forEach((f) => { f.boite = 1; });
  assert.equal(warmupOpening(m2, st, all, rep, NOW, { limitMs: L }).famille, 3, `80 % ou plus en boîte 2 (${k} sur ${all.length} en boîte 1)`);
  all[k].boite = 1;
  const o = warmupOpening(m2, st, all, rep, NOW, { limitMs: L });
  assert.equal(o.famille, null, "moins de 80 % en boîte 2"); assert.equal(o.conditions[0], false);
});

test("T2, condition 2 : 12 dernières réponses d'échauffement, 90 % justes, temps médian sous le seuil rapide", () => {
  const st = initialFamilies(m2, NOW - 30 * DAY), faits = factsOf([1, 2]);
  const op = (rep) => warmupOpening(m2, st, faits, rep, NOW, { limitMs: L });
  assert.equal(op(answers([1, 2], 11)).famille, null, "11 réponses seulement");
  assert.equal(op(answers([1, 2], 12, { juste: (i) => i !== 3 })).famille, 3, "11 sur 12 (92 %)");
  assert.equal(op(answers([1, 2], 12, { juste: (i) => i !== 3 && i !== 7 })).famille, null, "10 sur 12 (83 %)");
  assert.equal(op(answers([1, 2], 12, { ms: L })).famille, null, "temps médian au seuil");
  // seules comptent les 12 dernières : deux erreurs anciennes ne bloquent pas
  assert.equal(op([...answers([1, 2], 5, { juste: () => false, t0: NOW - 9e6 }), ...answers([1, 2], 12)]).famille, 3);
  // réponses de la notion du jour, du défi, de l'entraînement libre, avec aide, temps de base : ne comptent pas
  for (const extra of [{ notion: true }, { defi: true }, { libre: true }, { forme: "base" }]) assert.equal(op(answers([1, 2], 12, { extra })).famille, null, JSON.stringify(extra));
  assert.equal(op(answers([1, 2], 12).map((r, i) => (i < 2 ? { ...r, aide: true } : r))).famille, null, "deux réponses avec aide : 83 %");
  // les réponses sur une famille pas ouverte ne comptent pas (échauffement du cran « très dur »)
  assert.equal(op(answers([3], 12)).famille, null);
  // réponses d'avant le lot 3 ter (sans `fait`) : le fait est relu dans la question
  assert.equal(op(answers([1, 2], 12).map(({ fait, ...r }) => (void fait, r))).famille, 3);
});

test("T2 : le fait d'une réponse, relu dans la question", () => {
  assert.equal(answerFact({ question: "3 + 4" }), "3+4");
  assert.equal(answerFact({ question: "3 + ? = 7" }), "3+4");
  assert.equal(answerFact({ question: "? + 4 = 7" }), "3+4");
  assert.equal(answerFact({ question: "2 + 0", fait: "2+0" }), "2+0");
});

test("T2, condition 3 : au plus une famille ouverte par l'échauffement le même jour", () => {
  const faits = factsOf([1, 2, 3]), rep = answers([1, 2, 3], 12);
  const st = openByWarmup(initialFamilies(m2, NOW - 30 * DAY), 3, NOW - 3600e3, 5);
  const o = warmupOpening(m2, st, faits, rep, NOW, { limitMs: L });
  assert.equal(o.famille, null); assert.deepEqual(o.conditions, [true, true, false]);
  assert.equal(warmupOpening(m2, st, faits, rep, NOW + DAY, { limitMs: L }).famille, 4, "le lendemain");
  // une famille ouverte autrement le même jour (notion du jour, parent, choix) ne compte pas dans ce plafond
  const st2 = { ...initialFamilies(m2, NOW - 30 * DAY), ouvertes: [1, 2, 3], ouvertures: [{ famille: 3, date: NOW - 60e3, choix: true }] };
  assert.equal(warmupOpening(m2, st2, faits, rep, NOW, { limitMs: L }).famille, 4);
});

test("T2 : l'échauffement de la séance ouvre la famille (notée « par l'échauffement ») ; l'entraînement libre n'en ouvre pas", async () => {
  for (const libre of [false, true]) {
    const store = await open();
    for (const f of factsOf([1, 2], 3)) await store.put("faits", f);
    for (const r of answers([1, 2], 12)) await store.add("reponses", r);
    await store.setSetting("tempsDeBase", { mesures: [1500, 1500, 1500] });
    const w = await new Warmup({ store, content: m2, rnd: rng(3), seance: 9, clock: () => NOW }).load();
    w.libre = libre;
    const events = await w.families(NOW);
    const st = await store.get("niveaux", 2);
    if (libre) { assert.deepEqual(st.ouvertes, [1, 2]); assert.ok(!events.some((e) => e.type === "ouverte")); }
    else { assert.deepEqual(st.ouvertes, [1, 2, 3]); assert.ok(events.some((e) => e.type === "ouverte" && e.famille === 3 && e.echauffement)); assert.ok(st.ouvertures.at(-1).echauffement); }
  }
});
