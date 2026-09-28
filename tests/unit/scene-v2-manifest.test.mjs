import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { DESIGN_SIZE, entriesByDepth, validateScene } from "../../art/v2/scene-manifest.js";

const scenePath = fileURLToPath(new URL("../../art/v2/ocean-01/scene.json", import.meta.url));
const scene = JSON.parse(await readFile(scenePath, "utf8"));

test("le manifeste ocean-01 est valide et reste dans le repère du moteur", () => {
  assert.deepEqual(validateScene(scene), []);
  assert.deepEqual(scene.design, DESIGN_SIZE);
});

test("les quatre tuiles du décor couvrent exactement les 1280 × 800 logiques", () => {
  const bg = scene.layers.filter((x) => x.slot === "background");
  assert.equal(bg.length, 4);
  assert.deepEqual(
    bg.map(({ x, y, w, h }) => [x, y, w, h]).sort(),
    [[0, 0, 640, 400], [0, 400, 640, 400], [640, 0, 640, 400], [640, 400, 640, 400]].sort()
  );
});

test("les entrées sont uniques et triables par profondeur", () => {
  const entries = entriesByDepth(scene);
  assert.equal(new Set(entries.map((x) => x.id)).size, entries.length);
  assert.ok(entries.every((x, i) => i === 0 || entries[i - 1].depth <= x.depth));
});

test("un changement accidentel de repère est refusé", () => {
  const invalid = structuredClone(scene);
  invalid.design = { width: 1536, height: 1024 };
  assert.match(validateScene(invalid).join("\n"), /1280 × 800/);
});

test("un id dupliqué est refusé", () => {
  const invalid = structuredClone(scene);
  invalid.actors[0].id = invalid.layers[0].id;
  assert.match(validateScene(invalid).join("\n"), /dupliqué/);
});

test("un asset réseau ou qui remonte l'arborescence est refusé", () => {
  for (const asset of ["https://example.org/fond.webp", "../fond.webp", "/fond.webp"]) {
    const invalid = structuredClone(scene);
    invalid.layers[0].asset = asset;
    assert.match(validateScene(invalid).join("\n"), /asset/);
  }
});
