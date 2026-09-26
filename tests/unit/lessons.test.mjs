// Leçons animées : le contenu (content/lecons.json) est cohérent, et l'état de la scène au début de
// chaque phrase (« phrase précédente », « rejouer ») se calcule sans rien jouer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { check, emptyState, lessonLineSpec, stateAt } from "../../app/js/lessons/script.js";
import { LESSON_OF_ERROR, LESSON_OF_LEVEL } from "../../app/js/modules/numberline/runner.js";

const lecons = JSON.parse(readFileSync(new URL("../../app/content/lecons.json", import.meta.url)));

test("les leçons L1 à L3 existent, sont celles que le module 1 déclenche, et leur contenu est cohérent", () => {
  for (const id of new Set([...Object.values(LESSON_OF_ERROR), ...Object.values(LESSON_OF_LEVEL)])) {
    assert.ok(lecons[id], id); assert.deepEqual(check(lecons[id]), [], id); assert.ok(lecons[id].aToi.startsWith("À toi"));
  }
});

test("L1 : scène vide au début ; au début de la phrase 5, la tortue sur 2 après deux sauts, 1 et 2 écrits ; à la fin, six sauts depuis 0", () => {
  const L1 = lecons.L1;
  assert.deepEqual(stateAt(L1, 0), emptyState());
  const s5 = stateAt(L1, 4); assert.equal(s5.tortue, 2); assert.deepEqual(s5.arcs.map((a) => a.texte), ["1", "2"]); assert.deepEqual(s5.ecrits, [1, 2]); assert.equal(s5.note, null);
  const end = stateAt(L1, L1.phrases.length);
  assert.equal(end.etoile, 6); assert.equal(end.tortue, 6); assert.deepEqual(end.arcs.map((a) => [a.de, a.a, a.texte]), [[0, 1, "1"], [1, 2, "2"], [2, 3, "3"], [3, 4, "4"], [4, 5, "5"], [5, 6, "6"]]); assert.deepEqual(end.ecrits, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(stateAt(L1, 2).note, { texte: "0 saut" });
  assert.deepEqual(lessonLineSpec(L1).labels, ["0", null, null, null, null, null, null, null, null, null, null]);
});

test("L2 : trois sauts de dix, un filet par intervalle, le premier arc devient « +10 » ; L3 : quatre sauts depuis 30", () => {
  const e2 = stateAt(lecons.L2, lecons.L2.phrases.length);
  assert.deepEqual(e2.filets, [0, 1, 2]); assert.deepEqual(e2.arcs.map((a) => a.texte), ["+10", "20", "30"]); assert.equal(e2.compteur, 30); assert.deepEqual(e2.anneaux, [0, 1]);
  const e3 = stateAt(lecons.L3, lecons.L3.phrases.length);
  assert.equal(e3.tortue, 4); assert.deepEqual(e3.ecrits, [1, 2, 3, 4]); assert.deepEqual(e3.allumees, [0]);
  assert.deepEqual(lessonLineSpec(lecons.L3).labels.filter(Boolean), ["30", "40"]);
});

test("les erreurs de contenu sont signalées", () => {
  const bad = { ligne: { min: 0, max: 10, pas: 1, k: 0, ecrits: [0] }, phrases: [[{ faire: [{ sauter: [3, "3"] }, { ecrire: [12] }, { voler: 1 }] }]] };
  const errs = check(bad);
  assert.ok(errs.some((e) => e.includes("pas encore posée"))); assert.ok(errs.some((e) => e.includes("12 n'est pas sur la ligne"))); assert.ok(errs.some((e) => e.includes("inconnue")));
});
