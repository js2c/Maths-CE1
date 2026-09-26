// Règles d'adaptation (docs/SPEC.md), avec les seuils de content/module1.json.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterAnswer, afterSession, initialLevelState } from "../../app/js/modules/progress.js";

const rules = JSON.parse(readFileSync(new URL("../../app/content/module1.json", import.meta.url))).reglesAdaptation;
const play = (st, answers) => { const ev = []; for (const a of answers) { const r = afterAnswer(st, a, rules, 8, 0); st = r.st; ev.push(...r.events); } return { st, ev }; };
const ok = (ms = 3000) => ({ juste: true, aide: false, ms }), ko = { juste: false, aide: false, ms: 4000 };

test("voie rapide : 5 premières justes, sans aide, en moins de 6 s", () => {
  const { st, ev } = play(initialLevelState(1, 0), [ok(), ok(), ok(), ok(), ok(5900)]);
  assert.equal(st.niveau, 2); assert.deepEqual(ev, [{ type: "montee", de: 1, a: 2, rapide: true }]);
});
test("pas de voie rapide si une réponse est lente", () => {
  const { st } = play(initialLevelState(1, 0), [ok(), ok(7000), ok(), ok(), ok()]);
  assert.equal(st.niveau, 1);
});
test("montée : 8 justes sur les 10 dernières", () => {
  const { st, ev } = play(initialLevelState(1, 0), [ko, ok(), ok(), ok(), ok(), ok(), ok(), ok(9000), ko, ok()]);
  assert.equal(st.niveau, 2); assert.equal(ev.at(-1).rapide, false);
});
test("pas de montée avec deux aides", () => {
  const a = { juste: true, aide: true, ms: 3000 };
  const { st } = play(initialLevelState(1, 0), [ok(9000), a, a, ok(), ok(), ok(), ok(), ok(), ok(), ok()]);
  assert.equal(st.niveau, 1);
});
test("difficulté persistante : 3 erreurs sur 5", () => {
  const { ev } = play(initialLevelState(1, 0), [ok(9000), ko, ok(), ko, ko]);
  assert.deepEqual(ev, [{ type: "difficulte", niveau: 1 }]);
});
test("redescente après deux séances de suite sous 50 %, jamais sous le niveau 1", () => {
  let st = { ...initialLevelState(1, 0), niveau: 3 };
  st = afterSession(st, 0.4, rules, 0).st; assert.equal(st.niveau, 3);
  const r = afterSession(st, 0.3, rules, 0); assert.equal(r.st.niveau, 2); assert.equal(r.events[0].type, "redescente");
  let s1 = initialLevelState(1, 0); s1 = afterSession(s1, 0.1, rules).st; assert.equal(afterSession(s1, 0.1, rules).st.niveau, 1);
  st = afterSession({ ...initialLevelState(1, 0), niveau: 3 }, 0.4, rules).st; assert.equal(afterSession(st, 0.6, rules).st.niveau, 3);
});
