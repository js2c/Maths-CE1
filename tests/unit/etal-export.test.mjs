// LOT « L'ÉTAL DU PÊCHEUR » : la scène de l'exercice de monnaie est la maquette art/etal/index.html, transportée par l'atelier
// (art/tools/export-etal.mjs). Le module de l'application et ses images sont à jour (la maquette n'a pas changé sans nouvel
// export), rien de la page de la maquette ne reste (boutons, panneau, compteur, bulle, capitaine), et les réglages de
// app/content/etal.json sont ceux du panneau de la maquette (mêmes noms, dans leurs bornes ; aujourd'hui les valeurs de
// départ, demandées par le parent).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { exportEtal, styles } from "../../art/tools/export-etal.mjs";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const html = read("art/etal/index.html");

test("le module de l'étal et ses images sont ceux que fabrique l'export (maquette inchangée)", () => {
  const r = exportEtal({ ecrire: false, log: () => {} });
  assert.equal(read("app/js/etal/etal-scene.js"), r.module, "relancer : cd art && node tools/export-etal.mjs");
  assert.match(r.module, new RegExp(`empreinte ${r.empreinte}`));
  // toutes les images, à l'octet près : le décor, les 12 produits, la monnaie, la soucoupe, le portefeuille (35 images)
  assert.equal(r.images.length, 75);
  for (const f of r.images) { const a = new URL(`../../app/assets/etal/${f}`, import.meta.url); assert.ok(existsSync(a), f); assert.equal(statSync(a).size, statSync(new URL(`../../art/etal/img/${f}`, import.meta.url)).size, f); }
  assert.ok(r.poids > 1.8e6 && r.poids < 2.6e6, `${r.poids} octets`);
});

test("la scène : les raccords de l'application, rien de la page de la maquette", () => {
  const m = read("app/js/etal/etal-scene.js");
  for (const t of ["export function startEtal(OPTS)", "Object.assign(R, OPTS.reglages);", "OPTS.fige?.()", "OPTS.toucher(e)", "return API;", "remplir(valeurs)", "question({ remplacer = [], prix = {}, allumes = [] } = {})"]) assert.ok(m.includes(t), t);
  for (const t of ["document.getElementById", "localStorage", "creerMascotte", "window.MAQ", "bMeteo", "construireReglages", "'compteur'", "Chargement"]) assert.ok(!m.includes(t), t);
  // le décor, la pluie, la lampe, la pêche et le portefeuille de la maquette, intacts
  for (const t of ["function composerEtal() {", "function effets() {", "function dessinerBateau(b) {", "function ardoise(c, x, y, txt, lum = 1) {", "function sortirTout() {", "function versSoucoupe(it) {", "const LARG = { 500: 190, 1000: 201, 2000: 211, 5000: 222, 10: 67, 20: 76, 50: 82, 100: 79, 200: 88 };", "if (meteo > 0.5 && dtMoy > 0.021 && qualite > 0.45)"]) { assert.ok(html.includes(t), t); assert.ok(m.includes(t), t); }
  // les styles : rien de la page, les éléments préfixés
  const css = styles(html.match(/<style>\n([\s\S]*?)\n<\/style>/)[1]);
  assert.ok(!/#(bulle|commandes|reglages|compteur|chargement|cadre|capt)(?![A-Za-z])|html|body|:root/.test(css));
  assert.match(css, /#etal-soucoupe\{position:absolute;left:283px;top:597px/);
});

test("les réglages de etal.json sont ceux du panneau de la maquette, dans leurs bornes (aujourd'hui : les valeurs de départ)", () => {
  const E = JSON.parse(read("app/content/etal.json")).reglages, script = html.match(/const REGLAGES = \[([\s\S]*?)\n\];/)[1];
  const R = [...script.matchAll(/\['(\w+)', '[^']*(?:\\'[^']*)*', ([\d.]+), ([\d.]+), [\d.]+, ([\d.]+)\]/g)].map(([, k, min, max, def]) => ({ k, min: +min, max: +max, def: +def }));
  assert.equal(R.length, 22);
  assert.deepEqual(Object.keys(E).sort(), R.map((r) => r.k).sort());
  for (const r of R) { assert.ok(E[r.k] >= r.min && E[r.k] <= r.max, r.k); assert.equal(E[r.k], r.def, `${r.k} : valeur de départ de la maquette`); }
});

test("les répliques de l'orage sont celles de la maquette et de PHRASES.md, dites par la voix de l'application", () => {
  const T = JSON.parse(read("app/content/textes.json")), P = read("art/etal/PHRASES.md");
  const M = html.match(/const REPLIQUES_ORAGE = \[([\s\S]*?)\];/)[1].match(/'((?:\\'|[^'])*)'/g).map((s) => s.slice(1, -1).replace(/\\'/g, "'"));
  assert.deepEqual(T.etalOrage, M);
  for (const r of M) assert.ok(P.includes(`- ${r}`), r);
});
