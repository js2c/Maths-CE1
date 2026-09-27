// Lot 2, étape 5 : le bernard-l'ermite (app/js/engine/hermit.js, planche « ermite ») et les aides visuelles
// du module 2 (planche « aides »), tels que l'atelier les a exportés dans app/assets/art/atlas.json.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Hermit } from "../../app/js/engine/hermit.js";

const atlas = JSON.parse(readFileSync(new URL("../../app/assets/art/atlas.json", import.meta.url), "utf8"));
const S = atlas.sprites;

test("atlas : les gestes du bernard-l'ermite, ses deux coquilles, les aides visuelles", () => {
  for (const c of ["repos", "sortir", "montrer", "rejouir", "changer"]) {
    const s = S[`ermite.${c}`]; assert.ok(s, c); assert.equal(s.sheet, "ermite");
    assert.equal(s.meta.comp.length, s.frames, `${c} : une composition par image`);
  }
  assert.ok(S["ermite.coquille.0"] && S["ermite.coquille.1"]);
  assert.equal(S["ermite.repos"].meta.loop, true);
  assert.deepEqual(S["ermite.montrer"].meta.hold.length, 2);
  assert.deepEqual(S["ermite.changer"].meta.to, [120, 0]);
  // « changer » : il commence dans le bulot (coquille 0), finit dans la nouvelle (1), l'autre coquille change de place
  const cc = S["ermite.changer"].meta.comp; assert.equal(cc[0][0], 0); assert.equal(cc.at(-1)[0], 1); assert.equal(cc[0][4], 1); assert.equal(cc.at(-1)[4], 0);
  for (const n of ["aide.cadre10", "aide.cadre.lueur", "aide.maison.toit", "aide.maison.etage", "aide.maison.seuil", "aide.bulle.doree"]) { assert.ok(S[n], n); assert.equal(S[n].sheet, "aides"); }
  assert.equal(S["aide.cadre10"].meta.cells.length, 10);
  // deux rangées de cinq : les cinq premières alvéoles sur la même ligne, la sixième en dessous de la première
  const cells = S["aide.cadre10"].meta.cells; assert.ok(cells.slice(0, 5).every((c) => c[1] === cells[0][1])); assert.equal(cells[5][0], cells[0][0]); assert.ok(cells[5][1] > cells[0][1]);
});

test("planches : « ermite » et « aides » en @1x et @2x ; « ermite » raisonnable une fois décodée (moins de 64 Mo en @2x)", () => {
  for (const k of ["ermite@1", "ermite@2", "aides@1", "aides@2"]) assert.ok(atlas.sheets[k], k);
  const mo = atlas.sheets["ermite@2"].reduce((t, p) => t + p.w * p.h * 4, 0) / 1e6;
  assert.ok(mo < 64, `${mo.toFixed(1)} Mo`);
});

test("gestes : l'entrée, la boucle intérieure de « montrer » tant qu'on la demande, la sortie, la fin", () => {
  const h = Object.create(Hermit.prototype); h.sp = { atlas }; h.holdUntil = 0;
  const m = S["ermite.montrer"], fps = m.fps, [a, b] = m.meta.hold;
  assert.equal(h.frameAt("montrer", 0), 0);
  assert.equal(h.frameAt("montrer", (a + 0.5) / fps), a);
  h.holdUntil = 3000;
  const inHold = [1, 1.5, 2, 2.5].map((t) => h.frameAt("montrer", a / fps + t));
  assert.ok(inHold.every((f) => f >= a && f < b), `boucle intérieure : ${inHold}`);
  assert.equal(h.frameAt("montrer", a / fps + 3 + 0.01), b);
  assert.equal(h.frameAt("montrer", a / fps + 3 + 10), null);
  assert.equal(h.frameAt("repos", 100), Math.floor(100 * S["ermite.repos"].fps) % S["ermite.repos"].frames);
  assert.equal(h.frameAt("rejouir", 100), null);
});
