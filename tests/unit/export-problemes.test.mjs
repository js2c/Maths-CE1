// L'outil des images des problèmes (art/tools/export-problemes.mjs ; lot « Mise en scène des problèmes », fiche 23) : le recadrage
// des lieux (collé en bas, le haut retiré, jamais le sol ; l'étal autour de sa glace) et la lecture du nom des objets déposés.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IMAGE, nomObjet, recadrage } from "../../art/tools/export-problemes.mjs";

const LIB = JSON.parse(readFileSync(new URL("../../art/problemes/mise-en-scene/objets.json", import.meta.url), "utf8")).objets;

test("un lieu en 16:9 garde sa largeur et perd son haut, jamais son bas", () => {
  const Z = recadrage(1376, 768);
  assert.deepEqual(Z, { x: 0, y: 208, w: 1376, h: 560 });
  assert.equal(Z.y + Z.h, 768);
  assert.ok(Math.abs(Z.w / Z.h - IMAGE.w / IMAGE.h) < 0.01);
  const G = recadrage(1920, 1080); assert.equal(G.y + G.h, 1080); assert.equal(G.x, 0);
});
test("un lieu peut donner le haut de son recadrage (l'étal, autour de sa glace)", () => {
  const Z = recadrage(2576, 1438, { haut: 0.07 });
  assert.equal(Z.y, 101); assert.equal(Z.h, 1048); assert.ok(Z.y + Z.h <= 1438);
  assert.equal(recadrage(1000, 900, { haut: 0.9 }).y + recadrage(1000, 900, { haut: 0.9 }).h, 900); // (jamais au-delà du bas)
});
test("une source plus large que la scène perd ses deux côtés, également", () => {
  const Z = recadrage(3000, 800); assert.equal(Z.h, 800); assert.equal(Z.x * 2 + Z.w, 3000);
});
test("le nom d'un objet déposé : l'objet et sa variante", () => {
  assert.deepEqual(nomObjet("sachet-ferme", LIB), { id: "sachet", variante: "ferme" });
  assert.deepEqual(nomObjet("papa", LIB), { id: "papa", variante: null });
  assert.deepEqual(nomObjet("boite-oeufs-ouverte", LIB), { id: "boite-oeufs", variante: "ouverte" });
  assert.deepEqual(nomObjet("boite-oeufs", LIB), { id: "boite-oeufs", variante: null });
  assert.equal(nomObjet("sachet-bleu", LIB), null);
  assert.equal(nomObjet("Children_bedroom", LIB), null);
});
