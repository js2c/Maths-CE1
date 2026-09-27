// Correctifs d'ergonomie du 27 septembre 2026 : « passer » dès la première vue (leçons, exemples guidés,
// corrections), correction passée notée dans la réponse (historique et CSV du parent), réglage de vitesse.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { makeRead } from "../../app/js/modules/numberline/generator.js";
import { Module1Runner } from "../../app/js/modules/numberline/runner.js";
import { Warmup } from "../../app/js/modules/facts/warmup.js";
import { Rewards } from "../../app/js/session/rewards.js";
import { Session } from "../../app/js/session/session.js";
import { runNotion } from "../../app/js/session/notion.js";
import * as D from "../../app/js/parent/data.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const module1 = load("module1.json"), module2 = load("module2.json"), seance = load("seance.json");
const src = (f) => readFileSync(new URL(`../../app/js/${f}`, import.meta.url), "utf8");
const screen = { generate: (cfg, r, o) => makeRead(cfg, r, o) };

test("correction passée (ligne graduée) : notée dans la réponse, aucune étoile en plus, la question revient", async () => {
  const store = await Store.open(new IDBFactory()), runner = await new Module1Runner({ screen, store, content: module1, rnd: rng(7), seance: 1 }).load();
  const { q, cfg } = runner.next();
  const r = await runner.record({ q, value: q.answer + 1, ok: false, code: "E1", ms: 3000, listens: 1, correctionPassee: true }, cfg);
  assert.equal(r.etoiles, 0);
  const [rep] = await store.all("reponses");
  assert.equal(rep.correctionPassee, true); assert.equal(rep.juste, false); assert.equal(rep.erreur, "E1");
  assert.equal(runner.count, 1); assert.equal(runner.st.fenetre.at(-1).juste, false); // compte comme toute erreur
  // la question revient 3 à 5 questions plus loin, comme après une correction regardée
  let back = null;
  for (let i = 0; i < 6 && !back; i++) { const n = runner.next(); if (n.q.revient) back = n; else await runner.record({ q: n.q, value: n.q.answer, ok: true, code: null, ms: 2000, listens: 1 }, n.cfg); }
  assert.ok(back, "la question revient"); assert.equal(back.q.answer, q.answer);
  // réussie ensuite : l'étoile de l'erreur corrigée, comme d'habitude (rien de plus, rien de moins)
  assert.equal((await runner.record({ q: back.q, value: back.q.answer, ok: true, code: null, ms: 2000, listens: 1 }, back.cfg)).etoiles, 2);
  // une correction regardée jusqu'au bout n'a pas la marque
  const n2 = runner.next(); await runner.record({ q: n2.q, value: null, ok: false, code: "NSP", ms: 2000, listens: 1 }, n2.cfg);
  assert.equal((await store.all("reponses")).at(-1).correctionPassee, undefined);
});

test("correction passée (additions) : notée dans la réponse, aucune étoile, le fait revient", async () => {
  const store = await Store.open(new IDBFactory()), w = await new Warmup({ store, content: module2, rnd: rng(2), seance: 1, clock: () => 1e12 }).load();
  const rest = w.questions(5, 5).filter((x) => !x.base), q = rest.shift();
  const res = await w.record(q, { value: q.a + q.b + 1, ms: 2000, listens: 1, aide: false, nsp: false, correctionPassee: true }, rest);
  assert.equal(res.juste, false); assert.equal(res.etoiles, 0);
  const rep = (await store.all("reponses")).at(-1);
  assert.equal(rep.correctionPassee, true); assert.equal(rep.erreur, "autre");
  assert.ok(rest.some((x) => x.fait === q.fait && x.revient));
});

test("correction passée : visible dans l'export CSV des réponses", () => {
  const i = D.ANSWER_COLUMNS.findIndex(([h]) => h === "correction passée");
  assert.ok(i >= 0);
  const row = D.toCSV(D.ANSWER_COLUMNS, [{ id: 1, seance: 2, t: 0, module: 2, question: "3 + 4", juste: false, erreur: "autre", correctionPassee: true }]).split("\r\n")[1].split(";");
  assert.equal(row[i], "oui");
});

test("leçon passée dès la première vue : pas de 3 étoiles, « À toi ! » et l'exercice guidé, notée dans la séance", async () => {
  const store = await Store.open(new IDBFactory()), rewards = await new Rewards(store).load();
  let t = new Date(2026, 8, 27, 18).getTime(); const clock = () => t;
  const s = await new Session({ store, content: seance, rewards, clock, handlers: {} }).start(), log = [];
  const ask = { generate: screen.generate, ask: async (q, cfg, o) => { log.push({ guide: !!o?.guide, lesson: o?.lesson ?? null, format: q.format }); t += 10000; return { q, value: q.answer, ok: true, code: null, ms: 3000, listens: 1 }; } };
  const runner = await new Module1Runner({ screen: ask, store, content: module1, rnd: rng(3), seance: s.id }).load();
  assert.deepEqual(runner.st.lecons, []); // jamais vue
  const played = [];
  await runNotion({ session: s, step: { ...seance.etapes[2], questions: [3, 3] }, end: Infinity, runner, screen: ask, rnd: rng(5), lesson: async (id, raison) => { played.push([id, raison]); return { vue: false, passee: true, dureeS: 2, rejouees: 0 }; } });
  assert.deepEqual(played, [["L1", "niveau"]]);
  assert.deepEqual(log[0], { guide: true, lesson: "L1", format: "lire" }); // « À toi ! » et l'exercice guidé
  assert.equal(log.filter((x) => x.guide).length, 1);
  assert.equal(rewards.total, log.length); // une étoile par bonne réponse, pas les 3 de la leçon
  assert.deepEqual(runner.st.lecons, ["L1"]); assert.equal(runner.entryLesson(), null); // pas relancée comme leçon d'entrée
  const rec = await store.get("seances", s.id);
  assert.equal(rec.lecons.length, 1); assert.equal(rec.lecons[0].passee, true); assert.equal(rec.lecons[0].raison, "niveau");
  assert.equal(D.lessonNote(rec.lecons[0]), " (passée)");
});

test("« passer » sans condition de vue ; leçons : « rejouer » et « passer », plus de « phrase précédente »", () => {
  const player = src("lessons/player.js"), nl = src("modules/numberline/screen.js"), main = src("main.js");
  assert.ok(!/skippable|vues/.test(player + nl + main), "plus de règle « à partir de la deuxième vue »");
  assert.ok(!/precedent/.test(player), "plus de bouton « phrase précédente »");
  assert.ok(/skipKey/.test(player) && /skipKey/.test(nl) && /skipKey/.test(src("modules/facts/screen.js")), "le même bouton « passer » partout");
});

test("vitesse des exemples guidés et des corrections : réglage de seance.json, 1,5", () => {
  assert.equal(seance.vitesseAnimations, 1.5);
});
