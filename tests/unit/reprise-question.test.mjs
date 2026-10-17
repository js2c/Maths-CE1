// LA REPRISE À LA QUESTION PRÈS (décision du parent du 17 octobre 2026, lot « Banc Android et recette en conditions réelles ») :
// après un rechargement, la séance reprise retrouve la question en cours (ou la suivante si la réponse était donnée) ; une
// réponse fausse dont la correction était à l'écran est enregistrée ; la frise garde les ronds déjà faits.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { makeRead } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { runWarmup } from "../../app/js/modules/facts/screen.js";
import { expected } from "../../app/js/modules/facts/facts.js";
import { Rewards } from "../../app/js/session/rewards.js";
import { Session } from "../../app/js/session/session.js";
import { runNotion } from "../../app/js/session/notion.js";
import { instantane, restaurer } from "../../app/js/session/instantane.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const module1 = load("module1.json"), module2 = load("module2.json"), seance = load("seance.json");
const NOTION = { ...seance.etapes.find((e) => e.id === "notion"), questions: [8, 8], guides: 0 };
const ECHAUFFEMENT = { ...seance.etapes.find((e) => e.id === "echauffement"), questions: [8, 8] };
const tick = () => new Promise((r) => setTimeout(r, 0));
const jamais = () => new Promise(() => {});
const cle = (q) => JSON.stringify([q.format, q.answer, q.lo, q.hi, q.a, q.b, q.op]);

// une séance qui commence, et la même reprise après un « rechargement » (une nouvelle Session sur la fiche enregistrée)
async function depart() {
  const store = await Store.open(new IDBFactory()), rewards = await new Rewards(store).load();
  const s = await new Session({ store, content: seance, rewards, handlers: {} }).start();
  s.rec.etapeEnCours = "notion"; return { store, rewards, s };
}
const reprendre = async (store, rewards, id) => { const rec = await store.get("seances", id); const s = new Session({ store, content: seance, rewards, handlers: {}, reprise: rec }); s.rec = rec; return s; };
const ecranLigne = { generate: (cfg, r, o) => makeRead(cfg, r, o) };

// la ligne graduée : `coupe(k, session)` décide, à la question k, de ce qui se passe avant le rechargement
async function ligneAvecRechargement(coupe) {
  const { store, rewards, s } = await depart();
  const posees1 = [], frise = [];
  s.onProgress = (p) => frise.push({ ...p });
  const r1 = await new Module1Runner({ screen: ecranLigne, store, content: module1, rnd: rng(11), seance: s.id }).load();
  const ask1 = { ...ecranLigne, ask: async (q) => { posees1.push(q); const k = posees1.length; const c = await coupe(k, s, q); if (c === "coupe") return jamais(); return { q, value: q.answer, ok: true, code: null, ms: 2000, listens: 1 }; } };
  runNotion({ session: s, step: NOTION, end: Infinity, runner: r1, screen: ask1, rnd: rng(5), lesson: async () => false });
  for (let i = 0; i < 50 && !s.rec.pointReprise?.encours?.coupe; i++) await tick();
  await tick(); await tick();
  const avant = await store.get("seances", s.id);
  // le rechargement : une nouvelle séance sur la même fiche, un runner neuf
  const s2 = await reprendre(store, rewards, s.id), frise2 = [];
  s2.onProgress = (p) => frise2.push({ ...p });
  const r2 = await new Module1Runner({ screen: ecranLigne, store, content: module1, rnd: rng(99), seance: s.id }).load();
  const posees2 = [];
  const ask2 = { ...ecranLigne, ask: async (q) => { posees2.push(q); return { q, value: q.answer, ok: true, code: null, ms: 2000, listens: 1 }; } };
  await runNotion({ session: s2, step: NOTION, end: Infinity, runner: r2, screen: ask2, rnd: rng(5), lesson: async () => false });
  return { store, avant, s2, posees1, posees2, frise2, apres: await store.get("seances", s.id) };
}

test("reprise à la question près : une question sans réponse au rechargement est reposée telle quelle", async () => {
  const { avant, posees1, posees2, apres, frise2 } = await ligneAvecRechargement(async (k, s) => { if (k === 4) { s.rec.pointReprise.encours.coupe = true; return "coupe"; } });
  assert.equal(avant.questions, 3, "trois réponses comptées avant le rechargement");
  assert.equal(avant.pointReprise.k, 3); assert.ok(avant.pointReprise.encours?.q, "la question en cours est dans la fiche");
  assert.equal(cle(posees2[0]), cle(posees1[3]), "la même question est reposée");
  assert.equal(posees2.length, 5, "puis la suite, jusqu'aux 8 prévues"); assert.equal(apres.questions, 8);
  assert.equal(frise2[0]?.faites, 3, "la frise garde les ronds déjà faits"); assert.equal(frise2[0]?.prevues, avant.pointReprise.progress.prevues);
  assert.equal(apres.pointReprise.encours, null, "plus de question en cours");
});

test("reprise à la question près : une réponse fausse donnée (la correction à l'écran) est enregistrée, et c'est la question suivante", async () => {
  const { store, avant, posees1, posees2, apres } = await ligneAvecRechargement(async (k, s, q) => {
    if (k !== 4) return;
    // l'écran signale la réponse dès qu'elle est donnée, puis la correction commence… et la page se recharge
    await s.surReponse({ q, value: q.answer + 1, ok: false, code: "E1", ms: 2500, listens: 1 }); await tick();
    s.rec.pointReprise.encours.coupe = true; return "coupe";
  });
  assert.equal(avant.pointReprise.encours.reponse.value, posees1[3].answer + 1, "la réponse est dans la fiche avant la correction");
  assert.ok(!posees2.some((q) => cle(q) === cle(posees1[3]) && !q.revient), "la question répondue n'est pas reposée telle quelle");
  assert.equal(apres.questions, 8); assert.equal(apres.justes, 7, "la réponse fausse est comptée");
  const reps = (await store.all("reponses")).filter((r) => r.seance === apres.id);
  assert.equal(reps.length, 8); assert.equal(reps.filter((r) => !r.juste).length, 1); assert.equal(reps.find((r) => !r.juste).erreur, "E1");
});

test("reprise à la question près : l'échauffement reprend ses questions restantes, sans redire son introduction", async () => {
  const store = await Store.open(new IDBFactory()), rewards = await new Rewards(store).load();
  await store.setSetting("tempsDeBase", { mesures: [2000, 2100, 2200], depuis: 1 });
  const s = await new Session({ store, content: seance, rewards, handlers: {} }).start(); s.rec.etapeEnCours = "echauffement";
  const w1 = await new Warmup({ store, content: module2, rnd: rng(3), seance: s.id }).load();
  const posees1 = []; let intros = 0;
  const ecran = (posees, couper) => ({ show() {}, keys() {}, leave() {}, ask: async (q) => { posees.push(q); if (couper && posees.length === 4) { await s.surReponse({ value: expected(q) + 2, ms: 2000, listens: 1, aide: false, nsp: false }); await tick(); s.rec.pointReprise.encours.coupe = true; return jamais(); } return { value: expected(q), ms: 2000, listens: 1, aide: false, nsp: false }; } });
  runWarmup({ session: s, step: { ...ECHAUFFEMENT, id: "echauffement" }, end: Infinity, warmup: w1, screen: ecran(posees1, true), rnd: rng(1), intro: async () => { intros++; } });
  for (let i = 0; i < 80 && !s.rec.pointReprise?.encours?.coupe; i++) await tick();
  await tick();
  const avant = await store.get("seances", s.id), resteAvant = avant.pointReprise.rest.length;
  assert.equal(avant.questions, 3); assert.equal(avant.pointReprise.encours.reponse.value, expected(posees1[3]) + 2);
  const s2 = await reprendre(store, rewards, s.id), w2 = await new Warmup({ store, content: module2, rnd: rng(42), seance: s.id }).load(), posees2 = [];
  await runWarmup({ session: s2, step: { ...ECHAUFFEMENT, id: "echauffement" }, end: Infinity, warmup: w2, screen: ecran(posees2, false), rnd: rng(1), intro: async () => { intros++; } });
  const apres = await store.get("seances", s.id);
  assert.equal(intros, 1, "l'introduction n'est pas redite");
  // la même partie sans rechargement (mêmes tirages, même réponse fausse à la 4e question) : les mêmes faits, dans le même ordre
  const st0 = await Store.open(new IDBFactory()), rw0 = await new Rewards(st0).load();
  await st0.setSetting("tempsDeBase", { mesures: [2000, 2100, 2200], depuis: 1 });
  const s0 = await new Session({ store: st0, content: seance, rewards: rw0, handlers: {} }).start(), temoin = [];
  const ecran0 = { show() {}, keys() {}, leave() {}, ask: async (q) => { temoin.push(q); return { value: expected(q) + (temoin.length === 4 ? 2 : 0), ms: 2000, listens: 1, aide: false, nsp: false }; } };
  await runWarmup({ session: s0, step: { ...ECHAUFFEMENT, id: "echauffement" }, end: Infinity, warmup: await new Warmup({ store: st0, content: module2, rnd: rng(3), seance: s0.id }).load(), screen: ecran0, rnd: rng(1), intro: async () => {} });
  assert.deepEqual([...posees1.slice(0, 3), ...posees2].map((q) => q.fait), temoin.filter((_, i) => i !== 3).map((q) => q.fait), "les mêmes questions que sans rechargement");
  assert.ok(posees2.length >= resteAvant - 2, "les questions qui restaient sont posées");
  assert.equal(apres.justes, apres.questions - 1, "la réponse fausse d'avant le rechargement est comptée");
  assert.equal((await store.get("seances", s.id)).questions, (await st0.get("seances", s0.id)).questions, "autant de questions comptées que sans rechargement");
});

test("l'instantané d'un runner : données simples, Set, Map, Infinity, objets d'une classe ; ce qui vient d'ailleurs n'est pas copié", () => {
  class Tirage { constructor() { this.vus = new Set([1, 2]); this.n = 3; } suivant() { return this.n; } }
  const r = { store: { x: 1 }, content: { gros: true }, rnd: () => 0, compte: 4, fin: Infinity, t: new Tirage(), m: new Map([["a", [1, 2]]]), liste: [{ a: 1 }] };
  const c = JSON.parse(JSON.stringify(instantane(r)));
  assert.equal(c.store, undefined); assert.equal(c.content, undefined); assert.equal(c.rnd, undefined);
  const neuf = { store: "garde", compte: 0, fin: 0, t: new Tirage(), m: new Map(), liste: [] };
  neuf.t.n = 0; neuf.t.vus = new Set();
  restaurer(neuf, c);
  assert.equal(neuf.store, "garde"); assert.equal(neuf.compte, 4); assert.equal(neuf.fin, Infinity);
  assert.ok(neuf.t instanceof Tirage); assert.equal(neuf.t.suivant(), 3); assert.deepEqual([...neuf.t.vus], [1, 2]);
  assert.deepEqual([...neuf.m], [["a", [1, 2]]]); assert.deepEqual(neuf.liste, [{ a: 1 }]);
});

test("une nouvelle version de l'application ne reprend pas le point d'une autre : l'étape repart à son début", async () => {
  const { store, rewards, s } = await depart();
  Session.version = "A";
  const r1 = await new Module1Runner({ screen: ecranLigne, store, content: module1, rnd: rng(11), seance: s.id }).load();
  let n = 0;
  runNotion({ session: s, step: NOTION, end: Infinity, runner: r1, screen: { ...ecranLigne, ask: async (q) => (++n === 3 ? jamais() : { q, value: q.answer, ok: true, code: null, ms: 2000, listens: 1 }) }, rnd: rng(5), lesson: async () => false });
  for (let i = 0; i < 50 && n < 3; i++) await tick();
  await tick();
  Session.version = "B";
  const s2 = await reprendre(store, rewards, s.id);
  await s2.start();
  assert.equal(s2.point("notion"), null, "le point écrit par la version A n'est pas repris par B");
  assert.equal(s2.rec.reprises.at(-1).ou, "debut");
  Session.version = null;
});
