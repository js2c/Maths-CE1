// L'erreur « Cannot read properties of undefined (reading '0') » (vue une fois dans seance.mjs au lot 3, une fois dans
// centaines.mjs au lot 2 ; lot 3, étape 5, point 5). Cause trouvée par lecture du code : les images des boucles sont
// choisies d'après le temps de l'animation (tortue : `Math.floor((t - t0) * 12) % n`, saut : `path[Math.floor(u)]`) ; si
// ce temps recule d'une image à l'autre (horodatage de requestAnimationFrame non monotone), l'indice devient négatif,
// `path[-1]` ou `rects[-1]` vaut undefined, et `p0[0]` ou `q[0]` (Sprites.frame) lève cette erreur. Ces tests la
// reproduisent sur la tortue, avec la vraie classe Sprites et un atlas minimal, puis vérifient les gardes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Sprites, frameIndex } from "../../app/js/engine/sprites.js";
import { Turtle } from "../../app/js/engine/turtle.js";

const rects = (n) => ({ 1: Array.from({ length: n }, (_, i) => [0, i, 0, 10, 10, -5, -5]) });
const atlas = { sheets: {}, sprites: {
  "tortue.repos": { sheet: "tortue", frames: 24, rects: rects(24) },
  "tortue.nage": { sheet: "tortue", frames: 12, rects: rects(12) },
  "tortue.saut": { sheet: "tortue", frames: 10, rects: rects(10), meta: { path: Array.from({ length: 10 }, (_, i) => [i / 9, Math.sin((Math.PI * i) / 9)]) } },
} };
function scene() {
  const sp = new Sprites(atlas, 1); sp.pages.set("tortue", { pages: [{}], r: 1 });
  const drawn = [], ocean = { sp, front: [], frontEl: null, spriteActor: (p, name) => ({ vis: true, show(v) { this.vis = v; }, draw(f, n = name) { const q = sp.frame(n, f); drawn.push([n, f, !!q]); }, moveTo() {} }) };
  const T = new Turtle(ocean); T.seat = (i) => [i * 60, 400]; T.at = 0; T.a.vis = true;
  return { T, ocean, drawn, sp };
}
const tick = (ocean, t) => ocean.front.forEach((f) => f(t));

test("un temps qui recule pendant un saut ne fait plus planter la tortue", async () => {
  const { T, ocean, drawn } = scene();
  tick(ocean, 10); const p = T.jump(1);
  assert.doesNotThrow(() => tick(ocean, 9.97), "saut : le temps recule de 30 ms");
  for (let t = 10; t < 11.2; t += 0.02) tick(ocean, t);
  await p;
  assert.ok(drawn.every(([, f, ok]) => ok && Number.isInteger(f) && f >= 0), "chaque image dessinée existe");
});

test("un temps qui recule au repos ou à la nage ne demande jamais une image négative", () => {
  const { T, ocean, drawn } = scene();
  tick(ocean, 5); T.swimTo(null, 2).catch(() => {});
  T.seat = (i) => [i * 60, 400];
  assert.doesNotThrow(() => { tick(ocean, 4.9); tick(ocean, 4.95); });
  T.clip = "tortue.repos"; T.anim = null; T.t0 = 6;
  assert.doesNotThrow(() => tick(ocean, 5.5));
  assert.ok(drawn.every(([, f, ok]) => ok && f >= 0), JSON.stringify(drawn.filter(([, f, ok]) => !ok || f < 0)));
});

test("Sprites.frame : un indice négatif, non entier ou NaN donne une image de la boucle, jamais une exception", () => {
  const sp = new Sprites(atlas, 1); sp.pages.set("tortue", { pages: [{}], r: 1 });
  for (const f of [-1, -25, 2.5, NaN, Infinity, 23, 24, 49]) assert.ok(sp.frame("tortue.repos", f), `image ${f}`);
  assert.equal(frameIndex(-1, 24), 23); assert.equal(frameIndex(25, 24), 1); assert.equal(frameIndex(2.7, 24), 2); assert.equal(frameIndex(NaN, 24), 0);
});
