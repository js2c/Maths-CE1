// LOT 3 · LE CONTRÔLE DES BORDS DES SPRITES (docs/SPEC-LOT3.md, section 5). L'export de l'atelier
// (art/tools/export-app.mjs) compte, pour chaque sprite et chaque échelle, les pixels visibles sur chaque bord
// de son calque (`bords` dans atlas.json : [haut, droite, bas, gauche], le plus grand nombre sur toutes les
// images). Un dessin qui touche le bord de son calque y est coupé (la maison des nombres, relevé du 27 septembre) :
// ce test échoue, sauf pour les exceptions justifiées ci-dessous.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const atlas = JSON.parse(readFileSync(new URL("../../app/assets/art/atlas.json", import.meta.url), "utf8"));
// les exceptions, avec leur raison
export const EXCEPTIONS = {
  fond: "le fond de la scène, plein écran",
  rayons: "les rayons de lumière, plein écran : ils entrent par le haut de l'image",
  "carte.dos": "image pleine page d'une carte : le dos va jusqu'au bord de la carte (en haut et à gauche, l'ombre est à droite et en bas)",
  "carte.fond": "image pleine page d'une carte : le fond d'eau remplit toute la carte",
  "carte.cadre.commune": "image pleine page d'une carte : le cadre en suit le bord",
  "carte.cadre.rare": "image pleine page d'une carte : le cadre en suit le bord",
  "carte.cadre.legendaire": "image pleine page d'une carte : le cadre en suit le bord",
  "carte.verso.commune": "image pleine page d'une carte : le verso en suit le bord",
  "carte.verso.rare": "image pleine page d'une carte : le verso en suit le bord",
  "carte.verso.legendaire": "image pleine page d'une carte : le verso en suit le bord",
  "carte.reflet": "calque découpé à dessein : la bande du reflet glisse sur la carte et y est coupée par la carte",
};

test("atlas : chaque sprite a son relevé des bords, à chaque échelle", () => {
  for (const [name, s] of Object.entries(atlas.sprites)) for (const k of Object.keys(s.rects)) assert.ok(Array.isArray(s.bords?.[k]) && s.bords[k].length === 4, `${name} @${k}x : pas de relevé des bords (relancer node tools/export-app.mjs dans art/)`);
});

test("aucun sprite ne touche le bord de son calque (sauf exceptions justifiées)", () => {
  const cut = [];
  for (const [name, s] of Object.entries(atlas.sprites)) {
    if (EXCEPTIONS[name]) continue;
    for (const [k, b] of Object.entries(s.bords ?? {})) if (b.some((n) => n > 0)) cut.push(`${name} @${k}x [haut, droite, bas, gauche] = ${b.join(", ")}`);
  }
  assert.deepEqual(cut, [], `dessins coupés par le bord de leur calque :\n${cut.join("\n")}`);
});

test("les exceptions existent encore (une exception sans sprite est à retirer)", () => {
  for (const name of Object.keys(EXCEPTIONS)) assert.ok(atlas.sprites[name], `exception inutile : ${name}`);
});

test("la maison des nombres : le seuil est entier (relevé du 27 septembre)", () => {
  const s = atlas.sprites["aide.maison.seuil"];
  for (const k of ["1", "2"]) assert.deepEqual(s.bords[k], [0, 0, 0, 0]);
});
