// Lot « Correctifs : passage de l'échauffement aux voiliers », point 1 : la portée d'une étape (engine/portee.js) et la
// séance interrompue qui ne passe plus jamais à l'étape suivante (session/session.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { fermerTout, Portee } from "../../app/js/engine/portee.js";
import { Session } from "../../app/js/session/session.js";
import { Rewards } from "../../app/js/session/rewards.js";

const seance = JSON.parse(readFileSync(new URL("../../app/content/seance.json", import.meta.url)));

test("une portée range tout ce qu'on lui a confié, une seule fois, dans l'ordre inverse", () => {
  const log = [], ouvertes = new Set(), p = new Portee("échauffement", ouvertes);
  const el = { remove: () => log.push("élément") };
  assert.equal(p.el(el), el);
  p.fin(() => log.push("pavé"));
  const cible = { l: new Set(), addEventListener(t, f) { this.l.add(f); }, removeEventListener(t, f) { this.l.delete(f); } };
  p.ecoute(cible, "keydown", () => {});
  assert.equal(cible.l.size, 1);
  let tire = false; p.minuterie(setTimeout(() => { tire = true; }, 5));
  assert.ok(ouvertes.has(p));
  assert.equal(p.fermer(), true);
  assert.deepEqual(log, ["pavé", "élément"]);
  assert.equal(cible.l.size, 0);
  assert.ok(!ouvertes.has(p));
  assert.equal(p.fermer(), false, "une seule fois");
  assert.deepEqual(log, ["pavé", "élément"]);
  // ce qui arrive après la fermeture (un déroulement qui se réveille en retard) est rangé aussitôt
  p.el({ remove: () => log.push("en retard") });
  assert.deepEqual(log, ["pavé", "élément", "en retard"]);
  return new Promise((res) => setTimeout(() => { assert.equal(tire, false, "la minuterie est arrêtée"); res(); }, 20));
});

test("fermerTout ferme les portées encore ouvertes (l'activité abandonnée)", () => {
  const ouvertes = new Set(), log = [];
  const a = new Portee("a", ouvertes), b = new Portee("b", ouvertes);
  a.fin(() => log.push("a")); b.fin(() => log.push("b"));
  b.fermer();
  fermerTout(ouvertes);
  assert.deepEqual(log, ["b", "a"]);
  assert.equal(ouvertes.size, 0);
});

test("une séance interrompue ne passe jamais à l'étape suivante, même si l'étape abandonnée se réveille", async () => {
  const store = await Store.open(new IDBFactory()), rewards = await new Rewards(store).load(), seen = [];
  let reveil = null;
  const handlers = {
    accueil: async () => { seen.push("accueil"); },
    // l'échauffement est « abandonné » (pause, puis un autre exercice) ; plus tard, il se réveille (avant le correctif : un
    // bouton « passer l'échauffement » oublié à l'écran)
    echauffement: () => { seen.push("echauffement"); return new Promise((res) => { reveil = res; }); },
    notion: async () => { seen.push("notion"); },
    recompense: async () => { seen.push("recompense"); },
  };
  const s = new Session({ store, content: seance, rewards, handlers });
  const fin = s.run();
  while (!reveil) await new Promise((r) => setTimeout(r, 1));
  await s.interrupt({ par: "enfant", raison: "autre exercice choisi par l'enfant" });
  reveil();
  const rec = await fin;
  assert.deepEqual(seen, ["accueil", "echauffement"]);
  assert.equal(rec.terminee, false);
  const enBase = await store.get("seances", rec.id);
  assert.equal(enBase.terminee, false);
  assert.equal(enBase.interruption.raison, "autre exercice choisi par l'enfant");
});

test("point 7 : sur les écrans de choix, l'appui long d'une tuile ne montre plus d'étiquette (seule la bulle de la mascotte)", () => {
  const src = (f) => readFileSync(new URL(`../../app/js/session/${f}`, import.meta.url), "utf8");
  assert.match(src("selection.js"), /\}, null\); \/\/ \(point 7 : sans étiquette\)/);
  for (const f of ["choice.js", "lessons.js", "selection.js"]) assert.doesNotMatch(src(f), /tileLabel|etiquette:/, f);
});

test("point 8 : l'entourage d'un exercice reprend la forme de sa bulle (la même graine que dans l'atelier)", async () => {
  const { EXERCISES } = await import("../../app/js/session/choice.js");
  const art = (f) => readFileSync(new URL(`../../art/src/canvas-core/sea/${f}`, import.meta.url), "utf8");
  const fichiers = { ligne: ["choice.ts", "drawExerciseLine"], additions: ["ui.ts", "drawFreeFacts"], calcul: ["calc.ts", "drawExerciseCalc"], voiliers: ["voiliers.ts", "drawExerciseVoiliers"], multiplication: ["mult.ts", "drawExerciseMult"], etal: ["etal.ts", "drawExerciseEtal"] };
  for (const e of EXERCISES) {
    const [f, fn] = fichiers[e.id], s = art(f), corps = s.slice(s.indexOf(`export const ${fn} =`));
    const i = Number(corps.match(/drawAnswerBubble\(g, cx, cy, (\d+), 70\)/)[1]);
    assert.equal(e.graine, 300 + i, e.id);
  }
});
