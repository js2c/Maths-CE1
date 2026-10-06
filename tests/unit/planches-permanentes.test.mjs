// CORRECTIF DU 5 OCTOBRE 2026 : après une visite du récif où un cadeau de la surprise était posé, les boutons de l'accueil
// étaient invisibles (présents et cliquables) : le récif libérait la planche « petits », celle des cadeaux mais aussi de
// tous les boutons. Les planches permanentes (main.js, ALWAYS) ne sont plus jamais libérées.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Sprites } from "../../app/js/engine/sprites.js";

const page = () => { const p = { closed: false, close() { p.closed = true; } }; return p; };

test("une planche permanente n'est jamais libérée ; les autres le sont", () => {
  const s = new Sprites({ sprites: {}, sheets: {} }, 2), petits = page(), recif = page();
  s.pages.set("petits", { pages: [petits], r: 1 }); s.pages.set("recif", { pages: [recif], r: 1 });
  s.keep = new Set(["petits"]);
  s.unload("petits"); s.unload("recif");
  assert.ok(s.ready("petits") && !petits.closed, "« petits » reste chargée");
  assert.ok(!s.ready("recif") && recif.closed, "« recif » est libérée");
});

test("main.js déclare les planches permanentes, dont celle des boutons", () => {
  const main = readFileSync(new URL("../../app/js/main.js", import.meta.url), "utf8");
  assert.match(main, /sprites\.keep = ALWAYS/);
  const always = main.match(/const ALWAYS = new Set\((\[[^\]]*\])\)/)[1];
  for (const k of ["petits", "lagon", "lagon-vie"]) assert.ok(JSON.parse(always).includes(k), k);
  assert.ok(!/pieuvre/.test(always), "plus de planches de la pieuvre (lot « Mascotte »)");
});
