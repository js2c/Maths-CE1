// Lot 2, étape 4 : le son dans l'application (app/js/engine/son.js, app/assets/son/, app/content/son.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { db, effectGainDb, musicGainDb, pickMusic, Sound, soundPrefs } from "../../app/js/engine/son.js";

const read = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), "utf8"));
const C = read("app/content/son.json"), INDEX = read("app/assets/son/index.json"), REG = read("tools/son/reglages.json");
const SON = new URL("../../app/assets/son/", import.meta.url);

test("mixage : la musique est 18 dB sous les bruitages (sonie des fichiers comprise), le volume du parent s'y ajoute", () => {
  const sfx = C.musique.sonieFichiers.bruitages + effectGainDb(C, "bonne");
  assert.equal(C.musique.sonieFichiers.musique + musicGainDb(C, "moyen"), sfx - 18);
  assert.equal(musicGainDb(C, "doux"), musicGainDb(C, "moyen") - 6);
  assert.equal(musicGainDb(C, "fort"), musicGainDb(C, "moyen") + 4);
  assert.ok(C.musique.baisseSousVoix === 10 && C.musique.fonduBaisse > 0 && C.musique.fonduBaisse <= 0.5);
});

test("les sons de l'application sont les choix du parent (bruitages « a », trois musiques), copiés à l'identique", () => {
  const A = REG.application;
  assert.deepEqual(Object.keys(INDEX.bruitages).sort(), ["bonne", "bouton", "brillante", "carte", "coquillage", "erreur", "etoile", "zone"]);
  assert.match(INDEX.bruitages.bonne.fichier, /^bruitage-bonne-a-/); assert.match(INDEX.bruitages.erreur.fichier, /^bruitage-erreur-a-/);
  assert.deepEqual(Object.keys(INDEX.musiques), A.musiques);
  const all = [...Object.entries(INDEX.bruitages).map(([r, e]) => [`bruitage-${A.bruitages[r]}`, e]), ...Object.entries(INDEX.musiques).map(([k, e]) => [`musique-${k}`, e])];
  for (const [src, e] of all) {
    const app = readFileSync(new URL(e.fichier, SON)), ech = readFileSync(new URL(`../../docs/son-echantillons/${src}.ogg`, import.meta.url));
    assert.ok(app.equals(ech), `${e.fichier} n'est pas l'échantillon ${src} : relancer node tools/son/fabriquer.mjs app`);
    assert.equal(e.fichier, `${src}-${createHash("sha256").update(app).digest("hex").slice(0, 8)}.ogg`);
  }
  // aucun fichier orphelin
  const files = readdirSync(SON).filter((f) => f !== "index.json").sort();
  assert.deepEqual(files, all.map(([, e]) => e.fichier).sort());
});

test("poids des sons : moins de 4 Mo (3 Mo visés ; les trois musiques à 64 kbit/s, choix par défaut)", () => {
  const total = readdirSync(SON).reduce((t, f) => t + statSync(new URL(f, SON)).size, 0);
  assert.ok(total < 4e6, `${(total / 1e6).toFixed(2)} Mo`);
});

test("musique tirée au hasard parmi les trois ; réglages du parent par défaut", () => {
  const seen = new Set();
  for (let i = 0; i < 30; i++) seen.add(pickMusic(INDEX, () => i / 30));
  assert.deepEqual([...seen].sort(), ["harpe", "marimba", "profondeurs"]);
  assert.equal(pickMusic(null, Math.random), null);
  assert.deepEqual(soundPrefs(), { musique: true, volume: "moyen", bruitages: true });
  assert.deepEqual(soundPrefs({ musique: false, bruitages: false, volume: "doux" }), { musique: false, volume: "doux", bruitages: false });
});

// un faux AudioContext : assez pour suivre les gains programmés
class FakeParam { constructor(v = 1) { this.value = v; this.log = []; } setTargetAtTime(v) { this.value = v; this.log.push(["cible", v]); } setValueAtTime(v) { this.value = v; } linearRampToValueAtTime(v) { this.value = v; this.log.push(["rampe", v]); } cancelScheduledValues() {} }
class FakeNode { constructor() { this.gain = new FakeParam(); } connect(n) { return n; } disconnect() {} }
class FakeCtx {
  constructor(o) { this.sampleRate = o?.sampleRate; this.currentTime = 0; this.state = "running"; this.destination = {}; this.started = []; FakeCtx.last = this; }
  createGain() { return new FakeNode(); }
  createBufferSource() { const s = new FakeNode(); s.start = () => this.started.push(s); s.stop = () => { s.stopped = true; }; return s; }
  decodeAudioData() { return Promise.resolve({ duration: 1 }); }
  resume() { return Promise.resolve(); } suspend() { return Promise.resolve(); }
}

test("moteur : contexte à 48 kHz au premier toucher, bruitages, musique en boucle, baisse sous la voix et en pause, réglages", async () => {
  globalThis.AudioContext = FakeCtx; globalThis.fetch = async () => ({ arrayBuffer: async () => new ArrayBuffer(8) });
  try {
    const s = new Sound({ content: C, index: INDEX });
    s.play("bonne"); assert.equal(FakeCtx.last, undefined); // rien avant le premier toucher
    s.unlock(); await s.loading;
    assert.equal(FakeCtx.last.sampleRate, 48000);
    s.play("bonne"); assert.equal(FakeCtx.last.started.length, 1);
    await s.startMusic("marimba");
    const src = FakeCtx.last.started.at(-1); assert.equal(src.loop, true); assert.equal(s.musicKey, "marimba");
    const base = db(musicGainDb(C)); assert.ok(Math.abs(s.bus.gain.value - base) < 1e-9);
    s.duck(true); assert.ok(Math.abs(s.bus.gain.value - base * db(-10)) < 1e-9);
    s.duck(false); s.pauseLevel(true); assert.ok(Math.abs(s.bus.gain.value - base * db(-C.musique.baissePause)) < 1e-9);
    s.pauseLevel(false);
    s.setPrefs({ bruitages: false, volume: "fort" }); const n = FakeCtx.last.started.length; s.play("etoile"); assert.equal(FakeCtx.last.started.length, n);
    assert.ok(Math.abs(s.bus.gain.value - db(musicGainDb(C, "fort"))) < 1e-9);
    s.setPrefs({ musique: false }); assert.equal(s.musicKey, null); assert.equal(s.bus.gain.value, 0); assert.ok(src.stopped);
    await s.startMusic("harpe"); assert.equal(s.musicKey, null); // musique désactivée par le parent
    // l'espace parent : silence
    s.setPrefs({}); s.suspend(); const k = FakeCtx.last.started.length; s.play("bonne"); assert.equal(FakeCtx.last.started.length, k); s.resume(); s.play("bonne"); assert.equal(FakeCtx.last.started.length, k + 1);
  } finally { delete globalThis.AudioContext; }
});

test("sans Web Audio, ou ?son=non : silencieux, sans erreur", async () => {
  const s = new Sound({ content: C, index: INDEX, off: true });
  s.unlock(); s.play("bonne"); await s.startMusic("harpe"); s.duck(true); s.pauseLevel(true); s.stopMusic(); s.suspend(); s.resume();
  assert.equal(s.musicKey, null);
});
