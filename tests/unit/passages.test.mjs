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
  // (point 8, relecture : l'entourage des tuiles est posé autour d'elles, 7 px au-dehors, et ne rogne pas leur dessin)
  for (const f of ["choice.js", "lessons.js"]) assert.match(src(f), /entourage\(app, b, [^\n]*R\.drawSelectTile\([^\n]*, -7\)\)/, f);
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

test("point 11 : le double toucher rapide lance aussitôt ; trop lent, ce sont deux touchers ordinaires ; un rebond est ignoré", async () => {
  const { Selection } = await import("../../app/js/session/selection.js");
  const seance = JSON.parse(readFileSync(new URL("../../app/content/seance.json", import.meta.url)));
  const o = { rebondMs: seance.toucher.rebondMs, rapideMs: seance.toucher.doubleRapideMs };
  assert.equal(o.rebondMs, 60); assert.equal(o.rapideMs, 600);
  // double toucher rapide (180 ms) : lancé, la mascotte se tait (rapide)
  let s = new Selection(o);
  assert.equal(s.toucher("jouer", 1000), "choisie"); assert.equal(s.toucher("jouer", 1180), "lancee"); assert.equal(s.rapide, true);
  // trop lent (1,5 s) : deux touchers ordinaires, la description a été dite ; lancé quand même, sans « rapide »
  s = new Selection(o);
  assert.equal(s.toucher("jouer", 1000), "choisie"); assert.equal(s.toucher("jouer", 2500), "lancee"); assert.equal(s.rapide, false);
  // rebond (30 ms) : ignoré, la tuile reste sélectionnée ; le toucher suivant la lance
  s = new Selection(o);
  assert.equal(s.toucher("3", 1000), "choisie"); assert.equal(s.toucher("3", 1030), "rebond"); assert.equal(s.toucher("3", 1200), "lancee");
  // une autre tuile vite après : elle prend la sélection (pas de lancement)
  s = new Selection(o);
  assert.equal(s.toucher("3", 1000), "choisie"); assert.equal(s.toucher("4", 1100), "choisie"); assert.equal(s.toucher("4", 1150), "rebond");
});

test("point 10 : les galets de l'accueil, chacun sa forme, au moins 200 px de large, sans se chevaucher ni toucher le bouton de l'espace parent", async () => {
  const main = readFileSync(new URL("../../app/js/main.js", import.meta.url), "utf8"), T = JSON.parse(readFileSync(new URL("../../app/content/textes.json", import.meta.url)));
  const R = await import("../../app/js/art/runtime.js");
  const ids = ["jouer", "choisir", "encore", "lecons", "recif", "album"];
  assert.deepEqual(Object.keys(R.GALETS).sort(), [...ids].sort());
  assert.equal(new Set(ids.map((k) => JSON.stringify({ ...R.GALETS[k], seed: 0 }))).size, ids.length, "des formes différentes");
  const X = JSON.parse(main.match(/const GALET_X = (\[[^\]]+\])/)[1]);
  for (const [i, k] of ["jouer", "choisir", "lecons", "recif", "album"].entries()) {
    const f = R.GALETS[k];
    assert.ok(2 * f.rx >= 200, `${k} : ${2 * f.rx} px`);
    if (i) assert.ok(X[i] - f.rx > X[i - 1] + R.GALETS[["jouer", "choisir", "lecons", "recif", "album"][i - 1]].rx, `${k} ne chevauche pas son voisin`);
  }
  assert.ok(X[0] - R.GALETS.jouer.rx > 134, "à droite du bouton de l'espace parent (x 26 à 134)");
  assert.ok(X[4] + R.GALETS.album.rx < 1272, "dans l'écran");
  // les phrases (validées par le parent le 10 octobre 2026)
  assert.deepEqual(T.accueilDescription, { jouer: "Jouer. Je choisis les exercices du soir pour toi.", encore: "Encore ! Tu rejoues autant que tu veux.", choisir: "Choisir. C'est toi qui choisis l'exercice.", lecons: "Les leçons. Je t'explique avec des images.", recif: "Le récif. Viens voir tes créatures.", album: "L'album. Toutes tes cartes sont rangées ici." });
  assert.equal(T.accueilConsigne, "Touche une bulle : je te dis ce que c'est. Touche-la encore pour y aller.");
  assert.ok(T.accueilConsigneFaite.endsWith(T.accueilConsigne));
});
