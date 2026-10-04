// LOT « LAGON EN FOND D'EXERCICES » (docs/SPEC.md, section 11, « Le lagon, fond de toute l'application »).
// Le fond de l'application est le lagon du récif vivant, extrait de la maquette par l'atelier
// (art/tools/export-lagon.mjs) ; rien de l'ancien décor ne reste ; aucune créature à gagner, ni sous-marin, dans le décor.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const root = new URL("../../", import.meta.url), read = (p) => readFileSync(new URL(p, root), "utf8");
const atlas = JSON.parse(read("app/assets/art/atlas.json")), cartes = JSON.parse(read("app/content/cartes.json"));
const lagonJs = read("app/js/engine/lagon.js"), mainJs = read("app/js/main.js"), oceanJs = read("app/js/engine/ocean.js");
const names = Object.keys(atlas.sprites);

test("le lagon : son fond (1x et 2x), ses 3 algues, ses 22 poissons, ses 6 faisceaux", () => {
  const fond = atlas.sprites["lagon.fond"];
  assert.ok(fond && fond.rects[1] && fond.rects[2], "lagon.fond aux deux échelles");
  assert.deepEqual(fond.rects[1][0].slice(3, 5), [1280, 800]); assert.deepEqual(fond.rects[2][0].slice(3, 5), [2560, 1600]);
  assert.equal(names.filter((n) => n.startsWith("lagon.algue.")).length, 3);
  assert.equal(names.filter((n) => n.startsWith("lagon.poisson.")).length, 22);
  assert.equal(names.filter((n) => n.startsWith("lagon.faisceau.")).length, 6);
  // ce dont le moteur a besoin : le relief du récif, le sens de la tête de chaque poisson, les solitaires et les bancs
  const m = fond.meta;
  assert.equal(m.panorama.H, 1774); assert.ok(Math.abs(m.vue - (1774 * 1280) / 800) < 1e-6, "la vue : la scène à la hauteur du panorama");
  assert.ok(Array.isArray(m.top) && m.top.length > 100);
  for (const n of names.filter((n) => n.startsWith("lagon.poisson."))) assert.ok([1, -1].includes(m.tete[n.slice(14)]), `${n} : sens de la tête`);
  for (const [k] of m.solos) assert.ok(atlas.sprites[`lagon.poisson.${k}`], `solitaire ${k}`);
  for (const b of m.bancs) for (const k of b.keys) assert.ok(atlas.sprites[`lagon.poisson.${k}`], `banc ${k}`);
});

test("les images du lagon viennent de la maquette telle qu'elle est (sinon : node tools/export-lagon.mjs dans art/)", () => {
  const h = createHash("sha256").update(readFileSync(new URL("art/recif-vivant/index.html", root))).digest("hex").slice(0, 12);
  assert.match(atlas.sprites["lagon.fond"].meta.source, new RegExp(`empreinte ${h}\\)$`));
});

test("rien de l'ancien décor : ni fond, ni rayons, ni algues, ni reflets (sprites, planches, liste hors ligne, code)", () => {
  for (const n of names) assert.ok(!["fond", "rayons"].includes(n) && !/^(algue|reflet)\./.test(n), `sprite de l'ancien décor : ${n}`);
  for (const k of Object.keys(atlas.sheets)) assert.ok(!/^(fond|rayons|algues)@/.test(k), `planche de l'ancien décor : ${k}`);
  for (const f of readdirSync(new URL("app/assets/art/", root))) assert.ok(!/^(fond|rayons|algues)@/.test(f), `fichier de l'ancien décor : ${f}`);
  const sw = JSON.parse(read("app/sw-files.json")).files;
  assert.ok(!sw.some((f) => /assets\/art\/(fond|rayons|algues)@/.test(f)), "la liste hors ligne ne garde pas l'ancien fond");
  assert.ok(sw.includes("assets/art/lagon@2x.webp") && sw.includes("assets/art/lagon-vie@2x.webp") && sw.includes("js/engine/lagon.js"));
  assert.ok(!/"fond"|"rayons"|"algues"/.test(mainJs), "main.js ne charge plus l'ancien fond");
  assert.ok(!/reflet\.|bulle\.12|algue\./.test(oceanJs), "ocean.js ne pose plus ni reflets, ni bulles, ni algues");
});

test("aucune créature à gagner ni sous-marin dans le décor du lagon", () => {
  const ids = new Set(cartes.cartes.map((c) => c.id));
  for (const n of names.filter((n) => n.startsWith("lagon."))) assert.ok(![...ids].some((id) => n.endsWith(`.${id}`)), `${n} : une créature de la collection`);
  assert.ok(!/creature\.|"recif"|sous-marin|SUB\b/i.test(lagonJs.replace(/^\s*\/\/.*$/gm, "")), "lagon.js ne pose ni créature, ni sous-marin");
});

test("ordre des plans : le lagon est posé juste au-dessus du fond, donc sous la ligne graduée", () => {
  assert.match(lagonJs, /stage\.bg\.after\(this\.el\)/);
  assert.match(read("app/index.html"), /<canvas id="bg"><\/canvas>\s*<canvas id="line"><\/canvas>/);
});

test("l'atelier fabrique le lagon avec l'export complet", () => {
  assert.ok(existsSync(new URL("art/tools/export-lagon.mjs", root)));
  assert.match(read("art/tools/export-app.mjs"), /exportLagon\(/);
  assert.ok(!/name: "fond"|name: "rayons"|`algue\.|`reflet\./.test(read("art/src/canvas-core/sea/catalog.ts")), "le catalogue ne fabrique plus l'ancien décor");
});
