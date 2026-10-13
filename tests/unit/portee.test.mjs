// LA PORTÉE D'UNE ÉTAPE (engine/portee.js ; lot « Correctifs : passage de l'échauffement aux voiliers », point 1 ; lot
// « Recette de l'enfant et nettoyage des couches », point 2 : la règle de sortie unique, généralisée à toutes les étapes de la
// séance, à l'entraînement libre, à l'écran « choisir » et aux leçons seules). Le fichier citait ce test, qui n'existait pas.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fermerTout, Portee } from "../../app/js/engine/portee.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

test("une portée retire tout ce qui y est inscrit, une seule fois, dans l'ordre inverse", () => {
  const ouvertes = new Set(), journal = [], p = new Portee("échauffement", ouvertes);
  assert.ok(ouvertes.has(p));
  const el = { remove: () => journal.push("élément") };
  assert.equal(p.el(el), el);
  const cible = { l: new Set(), addEventListener(t, f) { this.l.add(f); }, removeEventListener(t, f) { this.l.delete(f); journal.push("écouteur"); } };
  const f = p.ecoute(cible, "pointerdown", () => {});
  assert.ok(cible.l.has(f));
  const id = setTimeout(() => journal.push("minuterie partie"), 5); p.minuterie(id);
  p.fin(() => journal.push("rangement"));
  assert.equal(p.fermer(), true);
  assert.deepEqual(journal, ["rangement", "écouteur", "élément"]);
  assert.equal(p.fermer(), false, "une seule fois");
  assert.ok(!ouvertes.has(p) && !cible.l.size);
  // ce qui arrive en retard, une fois fermée, est rangé aussitôt
  p.fin(() => journal.push("en retard")); assert.equal(journal.at(-1), "en retard");
});

test("fermerTout ferme toutes les portées ouvertes (l'activité abandonnée) ; une erreur n'arrête pas les autres rangements", () => {
  const ouvertes = new Set(), vu = [];
  const a = new Portee("a", ouvertes), b = new Portee("b", ouvertes);
  a.fin(() => vu.push("a")); b.fin(() => { throw new Error("raté"); }); b.fin(() => vu.push("b"));
  const warn = console.warn; console.warn = () => {};
  try { fermerTout(ouvertes); } finally { console.warn = warn; }
  assert.deepEqual(vu.sort(), ["a", "b"]); assert.equal(ouvertes.size, 0);
});

test("la règle de sortie unique est appliquée : chaque étape de la séance a sa portée, les nettoyages au cas par cas sont partis", () => {
  const main = read("app/js/main.js");
  // toutes les étapes passent par la même enveloppe, qui ouvre la portée et la ferme quelle que soit la sortie
  assert.match(main, /for \(const \[id, h\] of Object\.entries\(handlers\)\) handlers\[id\] = async \(ctx\) => \{\s*const portee = new Portee\(id, app\.portees\);/);
  assert.match(main, /try \{ return await h\(\{ \.\.\.ctx, portee \}\); \} finally \{ portee\.fermer\(\); \}/);
  // l'abandon ne range plus rien au cas par cas : il ferme les portées
  const abandon = main.slice(main.indexOf("function abandonActivity() {"), main.indexOf("// quitter l'entraînement libre"));
  assert.match(abandon, /fermerTout\(app\.portees\)/);
  for (const ancien of ["app.screen?.leave", "app.facts?.leave", "app.voiliers?.leave", "app.etal?.leave", "app.hermit", "app.challenge", "app.choiceClear", "lessons.abandon", "app.calc", "app.mult"]) assert.ok(!abandon.includes(ancien), `abandonActivity ne range plus ${ancien}`);
  // l'entraînement libre, l'écran « choisir » et la leçon seule ont la leur
  assert.match(main, /new Portee\("entraînement libre", app\.portees\)/);
  assert.match(main, /new Portee\("leçon", app\.portees\)/);
  assert.match(read("app/js/session/choice.js"), /new Portee\("choisir", app\.portees\)/);
  // les écrans de la ligne et des additions se détruisent (et ne posent plus rien ensuite)
  for (const f of ["app/js/modules/numberline/screen.js", "app/js/modules/facts/screen.js"]) { const s = read(f); assert.match(s, /detruire\(\) \{/); assert.match(s, /if \(this\.detruit\) return new Promise\(\(\) => \{\}\);/); }
  assert.match(read("app/js/modules/facts/screen.js"), /removeEventListener\("keydown", this\.onKey\)/);
});
