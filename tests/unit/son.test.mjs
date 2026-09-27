// Sons du lot 2 (étape 3) : fabrication déterministe, bruitages courts et au bon niveau, musiques lentes,
// pentatoniques et bouclables sans raccord, échantillons à jour et assez légers.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { SR, sonie } from "../../tools/son/synth.mjs";
import { BRUITAGES, fabriquerBruitage } from "../../tools/son/bruitages.mjs";
import { composer, duree, fabriquerMusique } from "../../tools/son/musiques.mjs";
import { REGLAGES, empreinte, regler } from "../../tools/son/fabriquer.mjs";
import { rng } from "../../tools/son/synth.mjs";

const DOSSIER = new URL("../../docs/son-echantillons/", import.meta.url);
const man = JSON.parse(readFileSync(new URL("echantillons.json", DOSSIER), "utf8"));
const G = REGLAGES.graine;

test("les bruitages demandés par la SPEC existent tous", () => {
  const types = new Set(Object.keys(BRUITAGES).map((k) => k.replace(/-[ab]$/, "")));
  for (const t of ["bonne", "erreur", "etoile", "coquillage", "carte", "brillante", "bouton", "zone"]) assert.ok(types.has(t), t);
});

test("fabrication déterministe : même graine, mêmes échantillons", () => {
  for (const k of ["bonne-a", "coquillage", "zone"]) assert.equal(empreinte([fabriquerBruitage(k, G)]), empreinte([fabriquerBruitage(k, G)]), k);
  const cfg = REGLAGES.musiques.harpe;
  assert.equal(empreinte(fabriquerMusique(cfg, G, { mesures: 2 }).canaux), empreinte(fabriquerMusique(cfg, G, { mesures: 2 }).canaux));
  assert.notEqual(empreinte([fabriquerBruitage("coquillage", G)]), empreinte([fabriquerBruitage("coquillage", G + 1)]));
});

test("bruitages : moins d'une seconde (sauf le coquillage), sonie visée, pas de saturation", () => {
  for (const k of Object.keys(BRUITAGES)) {
    const c = [fabriquerBruitage(k, G)], d = c[0].length / SR;
    if (k === "coquillage") assert.ok(d <= 2.5, `${k} : ${d} s`);
    else assert.ok(d < 1, `${k} : ${d} s`);
    const cible = REGLAGES.sonieParBruitage[k.replace(/-[ab]$/, "")] ?? REGLAGES.sonieBruitages;
    const s = regler(c, cible, "bruitage");
    assert.ok(Math.abs(s.momentaneeMax - cible) <= 0.5, `${k} : ${s.momentaneeMax} LUFS pour ${cible}`);
    assert.ok(s.crete <= REGLAGES.creteMax + 0.1, `${k} : crête ${s.crete}`);
    assert.ok(s.limitation <= 6, `${k} : limitation ${s.limitation} dB`);
    assert.ok(Math.abs(c[0][c[0].length - 1]) < 1e-3, `${k} : se termine sans clic`);
  }
});

test("l'erreur est plus douce que la bonne réponse (jamais un son d'échec)", () => {
  const cible = (t) => REGLAGES.sonieParBruitage[t] ?? REGLAGES.sonieBruitages;
  assert.ok(cible("erreur") < cible("bonne"));
});

test("musiques : lentes (60 à 72 battements par minute), boucles de 2 à 3 minutes, gamme pentatonique", () => {
  for (const [k, cfg] of Object.entries(REGLAGES.musiques)) {
    assert.ok(cfg.tempo >= 60 && cfg.tempo <= 72, `${k} : ${cfg.tempo}`);
    const s = duree(cfg) / SR;
    assert.ok(s >= 120 && s <= 180, `${k} : ${s} s`);
    assert.equal(cfg.gamme.length, 5);
    const { notes } = composer(cfg, rng(G));
    for (const n of notes) assert.ok(cfg.gamme.includes((((n.midi - cfg.tonique) % 12) + 12) % 12), `${k} : note ${n.midi} hors gamme`);
  }
});

test("musiques : aucun motif répété (pas deux mesures identiques de 3 notes ou plus)", () => {
  for (const [k, cfg] of Object.entries(REGLAGES.musiques)) {
    const { notes, mesure } = composer(cfg, rng(G)), vues = new Set();
    const parMesure = new Map();
    for (const n of notes) {
      const m = Math.floor((n.t + 0.05) / mesure);
      parMesure.set(m, [...(parMesure.get(m) ?? []), `${n.midi}@${Math.round(((n.t - m * mesure) / mesure) * 8)}`]);
    }
    for (const [, v] of parMesure) {
      if (v.length < 3) continue;
      const cle = v.join(" ");
      assert.ok(!vues.has(cle), `${k} : mesure répétée ${cle}`);
      vues.add(cle);
    }
  }
});

test("musiques : la fin se raccorde au début comme n'importe quel autre instant", () => {
  for (const [k, cfg] of Object.entries(REGLAGES.musiques)) {
    const { canaux } = fabriquerMusique(cfg, G, { mesures: 2 });
    for (const c of canaux) {
      const L = c.length, f = Math.round(0.1 * SR);
      // saut d'un échantillon au raccord : pas plus grand que le plus grand saut ailleurs
      let max = 0;
      for (let i = 1; i < L; i++) max = Math.max(max, Math.abs(c[i] - c[i - 1]));
      assert.ok(Math.abs(c[0] - c[L - 1]) <= max, `${k} : saut au raccord`);
      // la fin n'est pas coupée : les 100 dernières millisecondes ne tombent pas au silence
      const rms = (a) => Math.sqrt(Array.from({ length: f }, (_, i) => c[a + i] ** 2).reduce((s, x) => s + x, 0) / f);
      const moyenne = Math.sqrt(c.reduce((s, x) => s + x * x, 0) / L);
      assert.ok(rms(L - f) > 0.2 * moyenne, `${k} : fin coupée`);
    }
  }
});

test("échantillons : chaque son existe en Opus et en MP3, et correspond au code actuel", () => {
  for (const [k, b] of Object.entries(man.bruitages)) {
    for (const ext of ["ogg", "mp3"]) assert.ok(existsSync(new URL(`bruitage-${k}.${ext}`, DOSSIER)), `${k}.${ext}`);
    const c = [fabriquerBruitage(k, G)];
    regler(c, REGLAGES.sonieParBruitage[k.replace(/-[ab]$/, "")] ?? REGLAGES.sonieBruitages, "bruitage");
    assert.equal(empreinte(c), b.pcm, `${k} : relancer node tools/son/fabriquer.mjs`);
  }
  assert.deepEqual(Object.keys(man.bruitages).sort(), Object.keys(BRUITAGES).sort());
  assert.deepEqual(Object.keys(man.musiques).sort(), Object.keys(REGLAGES.musiques).sort());
  assert.ok(Object.keys(man.musiques).length >= 2 && Object.keys(man.musiques).length <= 3);
  for (const k of Object.keys(man.musiques)) for (const ext of ["ogg", "mp3"]) assert.ok(existsSync(new URL(`musique-${k}.${ext}`, DOSSIER)), `${k}.${ext}`);
  for (const k of Object.keys(man.voix)) assert.ok(existsSync(new URL(`voix-${k}.mp3`, DOSSIER)), k);
});

test("poids : la musique choisie et tous les bruitages tiennent sous 3 Mo (Opus)", () => {
  const bruitages = Object.values(man.bruitages).reduce((s, b) => s + b.opus, 0);
  const musique = Math.max(...Object.values(man.musiques).map((m) => m.opus));
  assert.ok(bruitages + musique < 3e6, `${bruitages + musique} octets`);
  for (const m of Object.values(man.musiques)) assert.ok(Math.abs(m.sonie - REGLAGES.sonieMusique) <= 0.5 && m.crete <= REGLAGES.creteMax + 0.1, m.nom);
});

test("sonie : un sinus à 1 kHz de crête 1 (mono) mesure -3 LUFS (valeur de référence de la norme)", () => {
  const s = new Float32Array(SR * 2).map((_, i) => Math.sin((2 * Math.PI * 1000 * i) / SR));
  assert.ok(Math.abs(sonie([s]).integree + 3.01) < 0.05);
});
