// LOT 3 BIS, PARTIE B (docs/SPEC-LOT3BIS.md) : les règles de l'intégration (étape 4), testées sans navigateur.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { onBrief } from "../../app/js/engine/ui.js";
import { legendRows } from "../../app/js/session/legend.js";

const json = (p) => JSON.parse(readFileSync(new URL(`../../app/content/${p}`, import.meta.url), "utf8"));
const legendes = json("legendes.json"), m1 = json("module1.json"), m2 = json("module2.json"), m3 = json("module3.json"), seance = json("seance.json");

test("B3 : appui long sans validation ; toucher bref : validé ; l'étiquette reste 2 s après le lever du doigt", () => {
  mock.timers.enable({ apis: ["setTimeout"] });
  const app = { legendes }, el = new EventTarget(), shown = [], hidden = [];
  let valid = 0;
  onBrief(app, el, () => valid++, "choisir", { show: (a, e, t) => { shown.push(t); return { t }; }, hide: (e) => { hidden.push(1); e.__label = null; } });
  const ev = (type) => el.dispatchEvent(new Event(type, { cancelable: true }));
  // toucher bref (0,2 s) : validé, pas d'étiquette
  ev("pointerdown"); mock.timers.tick(200); ev("pointerup");
  assert.equal(valid, 1); assert.equal(shown.length, 0);
  // appui de 0,8 s : étiquette dès 0,5 s (réglage), rien de validé au lever du doigt
  ev("pointerdown"); mock.timers.tick(legendes.appuiLong.ms - 1); assert.equal(shown.length, 0);
  mock.timers.tick(1); assert.deepEqual(shown, [legendes.etiquettes.choisir]);
  mock.timers.tick(300); ev("pointerup");
  assert.equal(valid, 1, "relâcher après un appui long ne valide pas");
  mock.timers.tick(legendes.appuiLong.gardeMs - 1); assert.equal(hidden.length, 0, "l'étiquette reste affichée");
  mock.timers.tick(1); assert.equal(hidden.length, 1, "puis disparaît 2 s après");
  // un appui annulé (le système reprend le geste) ne valide pas
  ev("pointerdown"); mock.timers.tick(100); ev("pointercancel"); assert.equal(valid, 1);
  mock.timers.reset();
});

test("B3 : une étiquette pour chaque pictogramme de l'accueil et de « choisir »", () => {
  for (const k of ["jouer", "choisir", "recif", "album", "ligne", "additions", "calcul", "lecons"]) assert.ok(legendes.etiquettes[k]?.length > 10, k);
  assert.ok(legendes.appuiLong.ms >= 300 && legendes.appuiLong.ms <= 800);
});

test("B2 : la légende a une ligne par niveau (13, 7, 9) et par leçon proposée, chacune avec ce qui est travaillé et un exemple", () => {
  const keys = { ligne: m1.niveaux.map((n) => n.niveau), additions: m2.familles.map((f) => f.id), calcul: m3.niveaux.map((n) => n.niveau), lecons: seance.choix.lecons };
  for (const [ex, ks] of Object.entries(keys)) {
    const rows = legendRows(legendes, ex, ks);
    assert.equal(rows.length, ks.length, ex);
    for (const r of rows) { assert.ok(r.travail.length >= 1 && r.travail.length <= 3, `${ex} ${r.n}`); assert.ok(r.exemple.length >= 1 && r.exemple.length <= 2, `${ex} ${r.n} exemple`); }
  }
  // écrit au feutre : seulement des caractères que l'atelier sait tracer
  const ok = /^[A-Za-z0-9éèêëàâùûîïôçÉÈœ +=\-'!.,? ]*$/;
  for (const ex of Object.keys(keys)) for (const r of legendes[ex]) { assert.match(r.travail, ok, r.travail); assert.match(r.exemple, ok, r.exemple); }
  for (const t of Object.values(legendes.etiquettes)) assert.match(t, ok, t);
  // le tableau du calcul rapide de la spécification (B2)
  assert.equal(legendes.calcul.find((r) => r.n === 7).exemple, "38 + 5 = 38 + 2 + 3");
});
