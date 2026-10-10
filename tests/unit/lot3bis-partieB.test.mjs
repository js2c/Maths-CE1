// LOT 3 BIS, PARTIE B (docs/SPEC-LOT3BIS.md) : les règles de l'intégration (étape 4), testées sans navigateur.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { onBrief } from "../../app/js/engine/ui.js";
import { legendRows } from "../../app/js/session/legend.js";

const json = (p) => JSON.parse(readFileSync(new URL(`../../app/content/${p}`, import.meta.url), "utf8"));
const legendes = json("legendes.json"), m1 = json("module1.json"), m2 = json("module2.json"), m3 = json("module3.json"), m5 = json("module5.json"), seance = json("seance.json");

test("B3, T3 : appui long sans validation ; toucher bref : validé au lever du doigt ; l'étiquette s'efface 0,5 s après", () => {
  mock.timers.enable({ apis: ["setTimeout"] });
  const app = { legendes }, el = new EventTarget(), shown = [], hidden = [];
  let valid = 0;
  onBrief(app, el, () => valid++, "choisir", { show: (a, e, t, inMs) => { shown.push([t, inMs]); return { t }; }, hide: (e, outMs) => { hidden.push(outMs); e.__label = null; } });
  const ev = (type) => el.dispatchEvent(new Event(type, { cancelable: true }));
  // toucher bref (0,2 s) : rien au premier contact, validé au lever du doigt, pas d'étiquette
  ev("pointerdown"); assert.equal(valid, 0, "pas de validation au premier contact"); mock.timers.tick(200); ev("pointerup");
  assert.equal(valid, 1); assert.equal(shown.length, 0);
  // appui de 0,8 s : étiquette dès 0,5 s (réglage), en fondu de 0,2 s ; rien de validé au lever du doigt
  ev("pointerdown"); mock.timers.tick(legendes.appuiLong.ms - 1); assert.equal(shown.length, 0);
  mock.timers.tick(1); assert.deepEqual(shown, [[legendes.etiquettes.choisir, legendes.appuiLong.fonduEntreeMs]]);
  mock.timers.tick(300); ev("pointerup");
  assert.equal(valid, 1, "relâcher après un appui long ne valide pas");
  assert.deepEqual(hidden, [legendes.appuiLong.sortieMs], "l'étiquette s'efface en fondu, disparue 0,5 s après");
  // un appui annulé (le système reprend le geste) ne valide pas
  ev("pointerdown"); mock.timers.tick(100); ev("pointercancel"); assert.equal(valid, 1);
  mock.timers.reset();
});

test("B3 : une étiquette pour chaque pictogramme de l'accueil et de « choisir »", () => {
  for (const k of ["jouer", "choisir", "recif", "album", "ligne", "additions", "calcul", "lecons"]) assert.ok(legendes.etiquettes[k]?.length > 10, k);
  assert.ok(legendes.appuiLong.ms >= 300 && legendes.appuiLong.ms <= 800);
});

test("B2 : la légende a une ligne par niveau (13, 7, 9) et par leçon proposée, chacune avec ce qui est travaillé et un exemple", () => {
  const keys = { ligne: m1.niveaux.map((n) => n.niveau), additions: m2.familles.map((f) => f.id), calcul: m3.niveaux.map((n) => n.niveau), multiplication: m5.niveaux.map((n) => n.niveau), etal: JSON.parse(readFileSync(new URL("../../app/content/module6.json", import.meta.url), "utf8")).niveaux.map((n) => n.niveau), lecons: [...seance.menuLecons.rangees.flatMap((r) => r.lecons), "+", "×"] }; // (lot « Les leçons » : les leçons du menu, et la table d'addition ; lot « Multiplication » : ses niveaux, sa table)
  for (const [ex, ks] of Object.entries(keys)) {
    const rows = legendRows(legendes, ex, ks);
    assert.equal(rows.length, ks.length, ex);
    for (const r of rows) { assert.ok(r.travail.length >= 1 && r.travail.length <= 3, `${ex} ${r.n}`); assert.ok(r.exemple.length >= 1 && r.exemple.length <= 2, `${ex} ${r.n} exemple`); }
  }
  // écrit au feutre : seulement des caractères que l'atelier sait tracer
  const ok = /^[A-Za-z0-9éèêëàâùûîïôçÉÈœ +=\-'!.,? ×]*$/; // (« × » : lot « Multiplication »)
  for (const ex of Object.keys(keys)) for (const r of legendes[ex]) { assert.match(r.travail, ok, r.travail); assert.match(r.exemple, ok, r.exemple); }
  for (const t of Object.values(legendes.etiquettes)) assert.match(t, ok, t);
  // le tableau du calcul rapide de la spécification (B2)
  assert.equal(legendes.calcul.find((r) => r.n === 7).exemple, "38 + 5 = 38 + 2 + 3");
});

test("B10 : erreurs d'additions détaillées (se trompe de 1, un des deux nombres, soustraction, autre), chacune avec sa phrase pour le parent", async () => {
  const { classifyFact } = await import("../../app/js/modules/facts/facts.js");
  const parent = JSON.parse(readFileSync(new URL("../../app/content/parent.json", import.meta.url), "utf8"));
  const d = (a, b) => ({ a, b, forme: "directe" }), tD = (a, b) => ({ a, b, forme: "trouDroite" }), tG = (a, b) => ({ a, b, forme: "trouGauche" });
  assert.equal(classifyFact(d(5, 3), 8), null);
  assert.equal(classifyFact(d(5, 3), 9), "plusOuMoins1"); assert.equal(classifyFact(d(5, 3), 7), "plusOuMoins1");
  assert.equal(classifyFact(d(5, 3), 5), "unDesNombres"); assert.equal(classifyFact(d(5, 3), 3), "unDesNombres");
  assert.equal(classifyFact(d(5, 3), 2), "soustraction");
  assert.equal(classifyFact(d(5, 3), 6), "autre"); assert.equal(classifyFact(d(3, 3), 0), "autre");
  // à trou : donner le total, c'est la soustraction non faite ; redonner le nombre connu, « un des deux nombres »
  assert.equal(classifyFact(tD(4, 3), 7), "soustraction"); assert.equal(classifyFact(tD(4, 3), 4), "unDesNombres"); assert.equal(classifyFact(tD(4, 3), 2), "plusOuMoins1");
  assert.equal(classifyFact(tG(4, 3), 7), "soustraction"); assert.equal(classifyFact(tG(4, 3), 3), "unDesNombres"); assert.equal(classifyFact(tG(4, 3), 5), "plusOuMoins1");
  assert.equal(classifyFact(d(5, 3), null), "autre");
  for (const k of ["plusOuMoins1", "unDesNombres", "soustraction", "autre"]) assert.ok(parent.erreurs[k] && parent.erreursExercice[k], k);
  // aucun sigle ni mot de conception dans les textes du parent
  assert.doesNotMatch(parent.journalNote, /\b[EC][1-7]\b|SPEC|l'une des deux/);
});

test("B12 : le guide du parent reprend la légende des niveaux (le même texte que legendes.json) et les durées d'appui", () => {
  const guide = readFileSync(new URL("../../docs/GUIDE-PARENT.md", import.meta.url), "utf8"), nb = (s) => s.replace(/ /g, " ");
  for (const ex of ["ligne", "additions", "calcul", "multiplication", "etal", "lecons"]) for (const r of legendes[ex]) assert.ok(guide.includes(`| ${r.n} | ${nb(r.travail)} | ${nb(r.exemple)} |`), `${ex} ${r.n} : la ligne du guide diffère du contenu`);
  const parent = JSON.parse(readFileSync(new URL("../../app/content/parent.json", import.meta.url), "utf8"));
  assert.match(guide, new RegExp(`garder le doigt ${parent.appuiLongMs / 1000} secondes|dure \\*\\*${parent.appuiLongMs / 1000} secondes`));
  assert.equal(legendes.appuiLong.ms, 500); assert.match(guide, /une demi-seconde/);
});
