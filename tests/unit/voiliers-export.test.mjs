// LOT « LES VOILIERS » : la scène du jeu est la maquette art/voiliers/index.html, transportée par l'atelier
// (art/tools/export-voiliers.mjs). Le module de l'application et ses données sont à jour (la maquette n'a pas changé
// sans nouvel export), la maquette n'est jamais modifiée par l'export, et rien de la page de la maquette ne reste.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { exportVoiliers } from "../../art/tools/export-voiliers.mjs";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

test("le module des voiliers et ses données sont ceux que fabrique l'export (maquette inchangée)", () => {
  const r = exportVoiliers({ ecrire: false, log: () => {} });
  assert.equal(read("app/js/voiliers/voiliers-scene.js"), r.module, "relancer : cd art && node tools/export-voiliers.mjs");
  assert.equal(read("app/assets/voiliers/donnees.json"), r.json);
  assert.match(r.module, new RegExp(`empreinte ${r.empreinte}`));
  // les images : toutes là, environ 2,7 Mo
  const d = JSON.parse(r.json), chemins = JSON.stringify(d).match(/assets\/voiliers\/[a-z0-9-]+\.(webp|png)/g);
  assert.equal(new Set(chemins).size, r.images);
  for (const c of chemins) assert.ok(existsSync(new URL(`../../app/${c}`, import.meta.url)), c);
  const poids = [...new Set(chemins)].reduce((s, c) => s + statSync(new URL(`../../app/${c}`, import.meta.url)).size, 0);
  assert.ok(poids > 2e6 && poids < 3.2e6, `${poids} octets`);
});

test("la scène : les raccords de l'application, rien de la page ni de la séance de la maquette", () => {
  const m = read("app/js/voiliers/voiliers-scene.js");
  for (const t of ["export function startVoiliers(OPTS)", "OPTS.temps(now)", "OPTS.fige?.()", "OPTS.toucher(e)", "WAIT={x:OPTS.attente?.x??430", "attendreLacher()", "traversee(row2)", "function startPirates(){", "return API;"]) assert.ok(m.includes(t), t);
  for (const t of ["document.getElementById", "creerMascotte", "drawBalloon", "openPanel", "window.__game", "say("]) assert.ok(!m.includes(t), t);
  // les formules de la mer et des bateaux sont celles de la maquette, intactes
  const html = read("art/voiliers/index.html");
  for (const t of ["const WAVES=[[-1.75,40,.85,0]", "function rideWaves(o,t,dt){", "function addRow(vals,row,wz,fadeIn){", "const Z_LINE=F*HC/(LINE_Y-HY),PULL=29;"]) { assert.ok(html.includes(t), t); assert.ok(m.includes(t), t); }
});
