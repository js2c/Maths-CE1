// Lot « Correctifs : passage de l'échauffement aux voiliers », point 12 : la mise à jour (app/sw.js, engine/miseajour.js) et la
// voix sans synthèse du navigateur (engine/voice.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { decider } from "../../app/js/engine/miseajour.js";
import { Voice } from "../../app/js/engine/voice.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

test("une nouvelle version ne prend la main que pendant l'écran de démarrage, avant le toucher (ou au lancement suivant)", () => {
  assert.equal(decider({ attend: true, controlee: true, touche: false }), true, "écran de démarrage : on active et on recharge");
  assert.equal(decider({ attend: true, controlee: true, touche: true }), false, "en cours de partie : elle attend le lancement suivant");
  assert.equal(decider({ attend: false, controlee: true, touche: false }), false, "rien n'attend");
  assert.equal(decider({ attend: true, controlee: false, touche: false }), false, "premier lancement : pas d'ancienne version");
  assert.equal(decider({ attend: true, controlee: true, touche: false, recharge: true }), false, "une seule fois par lancement");
});

test("le service worker : pas de prise de main à l'installation, par paquets avec reprises, l'ancien cache supprimé à l'activation seulement", () => {
  const sw = read("app/sw.js").replace(/^\s*\/\/.*$/gm, ""); // (le code seul, sans les commentaires)
  const install = sw.slice(sw.indexOf('addEventListener("install"'), sw.indexOf('addEventListener("message"'));
  assert.ok(!install.includes("skipWaiting"), "pas de skipWaiting à l'installation");
  assert.ok(!sw.includes("cache.addAll"), "plus d'installation d'un seul bloc");
  assert.match(sw, /const PAQUET = \d+, ESSAIS = \d+;/);
  assert.match(sw, /self\.addEventListener\("message", \(e\) => \{ if \(e\.data === "activer"\) self\.skipWaiting\(\); \}\);/);
  const activate = sw.slice(sw.indexOf('addEventListener("activate"'), sw.indexOf('addEventListener("fetch"'));
  assert.match(activate, /caches\.delete/);
  assert.ok(!install.includes("caches.delete"), "l'installation ne supprime rien");
  assert.match(install, /cache\.keys\(\)/, "une installation interrompue reprend là où elle s'est arrêtée");
});

test("plus de synthèse du navigateur : une phrase sans fichier est notée, écrite par la bulle le temps qu'elle aurait duré, jamais dite par une autre voix", async () => {
  const src = read("app/js/engine/voice.js");
  assert.ok(!/speechSynthesis|SpeechSynthesisUtterance|\.synth\b/.test(src));
  const v = new Voice({ fast: true }).setIndex({ phrases: { "Bonjour.": ["aaaaaaaaaaaa.ogg", 1000] } }), notes = [], dits = [];
  v.onManque = (p, c) => notes.push([p, c]); v.onTalk = (t, ms) => dits.push([t, Math.round(ms)]);
  const t0 = Date.now(); await v.say("Une phrase qui n'existe pas."); const dt = Date.now() - t0;
  assert.deepEqual(notes, [["Une phrase qui n'existe pas.", "absente de l'index"]]);
  assert.equal(dits.length, 1, "la bulle l'écrit (la mascotte « parle »)");
  assert.ok(dt >= v.fallbackMs("Une phrase qui n'existe pas.") - 20, "le temps qu'elle aurait duré");
  assert.ok(v.misses.has("Une phrase qui n'existe pas."));
});

test("Piper est retiré de l'outil de fabrication : aucune fabrication ne peut mêler deux voix", async () => {
  const { existsSync } = await import("node:fs");
  const src = read("tools/voix/fabriquer.mjs").replace(/^\/\/.*$/gm, "");
  assert.ok(!/piper|PIPER/.test(src));
  assert.ok(!existsSync(new URL("../../tools/voix/piper_lot.py", import.meta.url)));
  const { REGLAGES } = await import("../../tools/voix/fabriquer.mjs");
  assert.equal(REGLAGES.moteur, "chatterbox");
});
