// Lot « Correctifs de l'installation et de la veille » (docs/LOTS.md, fiche 12) : le service worker sans `ignoreSearch` (point 1),
// la réserve de lecteurs de la voix (point 2), la première image de l'étal toujours peinte (point 4), le journal technique
// (point 5). Les parcours : tests/e2e/installation.mjs, veille.mjs, poissons.mjs, lecons-monnaie.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import * as J from "../../app/js/engine/journal.js";
import { ligneJournal } from "../../app/js/parent/data.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const code = (p) => read(p).replace(/^\s*\/\/.*$/gm, ""); // (le code seul, sans les commentaires)

test("point 1 : le service worker cherche chaque fichier par son adresse exacte, jamais avec ignoreSearch", () => {
  const sw = code("app/sw.js");
  assert.ok(!/ignoreSearch/.test(sw), "plus d'ignoreSearch : Chrome lirait toutes les entrées du cache à chaque requête");
  assert.match(sw, /cache\.match\(cle, OPTIONS\)/);
  assert.match(sw, /cle = u\.origin \+ u\.pathname/);
  assert.match(sw, /DELAI_CACHE/, "la page de lancement a un délai de secours");
  assert.match(sw, /Toucher pour réessayer/, "la page de secours");
  assert.match(sw, /noter\("service worker", "installation finie"/, "le journal technique");
});

test("point 1 : la page affiche aussitôt le secours du lancement, retiré dès que l'écran de démarrage est là", () => {
  const html = read("app/index.html"), main = read("app/js/main.js");
  assert.match(html, /id="chargement"/);
  assert.match(html, /Chargement…/);
  assert.match(html, /Toucher pour réessayer/);
  assert.ok(html.indexOf('id="chargement"') < html.indexOf('<div id="stage">'), "le secours est la première chose de la page");
  assert.match(main, /document\.getElementById\("chargement"\)\?\.remove\(\)/);
});

test("point 2 : la voix prend ses lecteurs dans une réserve et libère leur source après chaque phrase", async () => {
  // un Audio de Node, qui compte ce qui se passe
  const crees = [];
  globalThis.Audio = class { constructor() { this.attrs = {}; this.n = crees.push(this); } set src(v) { this.attrs.src = v; } get src() { return this.attrs.src ?? ""; } hasAttribute(k) { return k in this.attrs; } removeAttribute(k) { delete this.attrs[k]; } load() { this.charges = (this.charges ?? 0) + 1; } pause() {} play() { const a = this; setTimeout(() => a.onended?.(), 5); return Promise.resolve(); } };
  const { Voice, LECTEURS } = await import(`../../app/js/engine/voice.js?essai=${Date.now()}`);
  const v = new Voice().setIndex({ phrases: { "Un.": ["a.ogg", 20], "Deux.": ["b.ogg", 20], "Trois.": ["c.ogg", 20] } });
  for (let i = 0; i < 25; i++) await v.say("Un. Deux. Trois.");
  assert.ok(crees.length <= 2, `deux lecteurs au plus pour 75 phrases (créés : ${crees.length})`);
  assert.equal(v.lecteursActifs(), 0, "plus aucun lecteur pris une fois tout dit");
  assert.ok(crees.every((a) => !a.hasAttribute("src")), "la source de chaque lecteur est libérée");
  assert.equal(LECTEURS.libres.length, crees.length);
  // une lecture refusée : notée, et le texte redit au toucher suivant
  const notes = []; v.onRefus = (p, e) => notes.push([p, e.name]);
  const play = globalThis.Audio.prototype.play; globalThis.Audio.prototype.play = function () { return Promise.reject(Object.assign(new Error("refus"), { name: "NotAllowedError" })); };
  await v.say("Un.", { instruction: true });
  assert.deepEqual(notes, [["Un.", "NotAllowedError"]]);
  assert.equal(v.aRedire?.text, "Un.");
  globalThis.Audio.prototype.play = play;
  assert.equal(v.redireSiRefus(), true); await v.queue;
  assert.equal(v.aRedire, null);
  // abandonnée en pleine phrase : ses lecteurs sont rendus
  v.say("Un. Deux. Trois."); await new Promise((r) => setTimeout(r, 2)); v.abandon();
  assert.equal(v.lecteursActifs(), 0, "abandonnée : ses lecteurs rendus");
  delete globalThis.Audio;
});

test("point 2 : la mascotte n'a que deux lecteurs vidéo ; elle signale une vidéo arrêtée et un contexte WebGL perdu", () => {
  const m = code("app/js/engine/mascotte.js");
  assert.match(m, /const lecteurs = \[0, 1\]\.map/);
  assert.equal((m.match(/createElement\("video"\)/g) ?? []).length, 1, "un seul endroit crée les vidéos : les deux lecteurs");
  assert.match(m, /webglcontextrestored/);
  assert.match(m, /vidéo de la mascotte arrêtée, relancée/);
});

test("point 4 : la première image de l'étal est toujours peinte, même figé ; la leçon n'est figée que par son propre temps", () => {
  const scene = read("app/js/etal/etal-scene.js");
  assert.match(scene, /if \(OPTS\.fige\?\.\(\) && PEINT\) \{ dernier = 0; return; \}\n {2}PEINT = true;/);
  assert.match(read("art/tools/export-etal.mjs"), /PEINT = true/, "la retouche est dans l'outil d'export, pas dans le fichier généré");
  assert.match(read("app/js/modules/etal/screen.js"), /fige: lecon \? \(\) => clock\.paused : /);
  assert.match(read("app/js/lessons/etal.js"), /enter\(\{ rnd: app\.rnd, lecon: true \}\)/);
});

test("point 5 : le journal technique garde les 300 derniers événements, se lit et s'efface", async () => {
  const idb = new IDBFactory(); J._oublier();
  for (let i = 0; i < 320; i++) J.noter("écran", `écran ${i}`, { i }, { idb });
  const l = await J.lire({ idb });
  assert.equal(l.length, 300, "300 au plus");
  assert.equal(l[0].i, 20, "les plus anciens sont retirés");
  assert.equal(l.at(-1).message, "écran 319");
  assert.equal(J.recents.length, 300);
  await J.vider({ idb });
  assert.equal((await J.lire({ idb })).length, 0);
  J._oublier();
});

test("point 5 : une ligne du journal, en français simple", () => {
  const t = new Date(2026, 9, 16, 19, 42, 5).getTime();
  assert.equal(ligneJournal({ t, type: "lancement", message: "application lancée", premiereImageMs: 280, pretMs: 2140, version: "4452ac0e8be3", affichage: "fullscreen", controlee: true }),
    "16/10 19:42:05 · lancement · application lancée (première image en 0,3 s, prête en 2,1 s, version 4452ac0, installée)");
  assert.equal(ligneJournal({ t, type: "voix", message: "lecture refusée", phrase: "Bravo !", erreur: "NotAllowedError" }), "16/10 19:42:05 · voix · lecture refusée (« Bravo ! », NotAllowedError)");
  assert.equal(ligneJournal({ t, type: "service worker", message: "installation finie", fichiers: 11804, nouveaux: 120, dureeMs: 42000 }), "16/10 19:42:05 · service worker · installation finie (11804 fichiers, dont 120 téléchargés, en 42,0 s)");
  assert.equal(ligneJournal({ t, type: "page", message: "au premier plan" }), "16/10 19:42:05 · page · au premier plan");
});

test("point 5 : la sauvegarde complète comprend le journal technique ; « tout effacer » l'efface", () => {
  const p = read("app/js/parent/parent.js");
  assert.match(p, /journalTechnique: await lireJournal\(\)/);
  assert.match(p, /await this\.store\.wipe\(\); await viderJournal\(\);/);
  assert.match(p, /Exporter le journal technique/);
});
