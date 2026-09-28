import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { DESIGN_SIZE, entriesByDepth, validateScene } from "../../art/v2/scene-manifest.js";

const scenePath = fileURLToPath(new URL("../../art/v2/ocean-01/scene.json", import.meta.url));
const scene = JSON.parse(await readFile(scenePath, "utf8"));
const bundlePath = fileURLToPath(new URL("../../art/v2/ocean-01/assets/background.bundle.json", import.meta.url));

test("le manifeste ocean-01 est valide et reste dans le repère du moteur", () => {
  assert.deepEqual(validateScene(scene), []);
  assert.deepEqual(scene.design, DESIGN_SIZE);
});

test("le décor V2 est un seul fond couvrant les 1280 × 800 logiques", () => {
  const bg = scene.layers.filter((x) => x.slot === "background");
  assert.equal(bg.length, 1);
  assert.deepEqual([bg[0].x, bg[0].y, bg[0].w, bg[0].h], [0, 0, 1280, 800]);
  assert.equal(bg[0].assetBundle, "assets/background.bundle.json");
});

test("le bundle reconstruit un vrai WebP", async () => {
  const bundle = JSON.parse(await readFile(bundlePath, "utf8"));
  const base = new URL("../../art/v2/ocean-01/assets/", import.meta.url);
  const parts = await Promise.all(bundle.parts.map((part) => readFile(new URL(part, base), "utf8")));
  const bytes = Buffer.from(parts.join(""), "base64");
  assert.equal(bytes.length, 52210);
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP");
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

test("un bundle réseau ou qui remonte l'arborescence est refusé", () => {
  for (const path of ["https://example.org/fond.json", "../fond.json", "/fond.json"]) {
    const invalid = structuredClone(scene);
    invalid.layers[0].assetBundle = path;
    assert.match(validateScene(invalid).join("\n"), /assetBundle/);
  }
});
