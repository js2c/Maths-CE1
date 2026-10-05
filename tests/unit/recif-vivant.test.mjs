// LE RÉCIF VIVANT (docs/SPEC.md, section 10, « Le récif vivant ») : la collection est la maquette du récif vivant
// (art/recif-vivant/index.html), transportée telle quelle par l'atelier (art/tools/export-recif.mjs) ; ses créatures sont
// des images de la maquette, plus des créatures dessinées en code.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { alleger, garderIntervalle, recifCreatures, versCarte, versMaquette } from "../../app/js/session/reef.js";

const root = new URL("../../", import.meta.url), read = (p) => readFileSync(new URL(p, root), "utf8");
const cartes = JSON.parse(read("app/content/cartes.json")), donnees = JSON.parse(read("app/assets/recif/donnees.json"));
const moduleJs = read("app/js/recif/recif-vivant.js"), reefJs = read("app/js/session/reef.js");
const ZONES = ["LAGON_SPR", "CORAIL_SPR", "LARGE_SPR", "ABYSSES_SPR"];

test("le module et les images viennent de la maquette telle qu'elle est (sinon : node tools/export-recif.mjs dans art/)", () => {
  const h = createHash("sha256").update(readFileSync(new URL("art/recif-vivant/index.html", root))).digest("hex").slice(0, 12);
  assert.match(donnees.source, new RegExp(`empreinte ${h}\\)$`));
  assert.match(moduleJs, new RegExp(`empreinte ${h}\\)`));
  assert.match(moduleJs, /export function startRecif\(OPTS\)/);
  assert.ok(!/document\.getElementById/.test(moduleJs), "aucun élément de la page de la maquette");
  assert.ok(!/data:image\//.test(moduleJs), "les images sont sorties du module");
});

test("chaque carte de la collection a sa créature dans le récif, et chaque créature du récif est une carte", () => {
  const ids = new Set(ZONES.flatMap((k) => Object.keys(donnees[k])));
  assert.equal(ids.size, cartes.cartes.length);
  for (const c of cartes.cartes) {
    assert.ok(ids.has(versMaquette(c.id)), `${c.id} : pas de créature dans le récif`);
    assert.equal(versCarte(versMaquette(c.id)), c.id);
  }
});

test("chaque image citée par les données existe, et aucune image n'est orpheline", () => {
  const cites = new Set(JSON.stringify(donnees).match(/assets\/recif\/[^"]+/g));
  for (const f of cites) assert.ok(existsSync(new URL(`app/${f}`, root)), f);
  for (const f of readdirSync(new URL("app/assets/recif/", root))) if (f !== "donnees.json") assert.ok(cites.has(`assets/recif/${f}`), `orpheline : ${f}`);
  const sw = new Set(JSON.parse(read("app/sw-files.json")).files);
  for (const f of [...cites, "assets/recif/donnees.json", "js/recif/recif-vivant.js"]) assert.ok(sw.has(f), `liste hors ligne : ${f}`);
});

test("seules les créatures possédées vivent dans le récif ; les brillantes scintillent", () => {
  const { owned, brillantes } = recifCreatures([{ id: "crabe" }, { id: "benitier-geant", brillante: true }, { id: "requin-groenland" }]);
  assert.deepEqual([...owned], ["crabe", "benitier", "requin-du-groenland"]);
  assert.deepEqual([...brillantes], ["benitier"]);
  assert.match(moduleJs, /LAGON\.filter\(\(c\) => OPTS\.owned\.has\(c\.id\)\)/);
  assert.match(moduleJs, /if \(OPTS\.brillantes\.has\(c\.id\)\) OPTS\.scintille\(/);
});

test("plus de créatures dessinées en code ni de récif en pages, de décors ou de cadeaux", () => {
  const atlas = JSON.parse(read("app/assets/art/atlas.json"));
  assert.ok(!Object.keys(atlas.sheets).some((k) => /^(recif|decors)@/.test(k)), "planches recif ou decors");
  assert.ok(!Object.keys(atlas.sprites).some((n) => /^(creature|cadeau|decor)\./.test(n)), "sprites de créatures, cadeaux ou décors");
  assert.ok(!existsSync(new URL("app/js/session/reefpages.js", root)));
  assert.ok(!/\.creature\b|reef-swipe|gifts/.test(reefJs));
  assert.match(read("art/tools/export-app.mjs"), /exportRecif\(/);
});

test("pendant la visite : le lagon en pause, ni la pieuvre ni le compteur d'étoiles, tout est rendu en sortant", () => {
  assert.match(reefJs, /lagon\?\.pause\(true\)/); assert.match(reefJs, /lagon\?\.pause\(false\)/);
  assert.match(reefJs, /ocean\.octoVisible = false/); assert.match(reefJs, /classList\.remove\("recif-masque"\)/);
  assert.match(reefJs, /this\.api\?\.stop\(\)/); assert.match(reefJs, /removeEventListener/);
});

test("l'allègement : après 3 s, au-delà de 20 ms d'intervalle moyen, même quand chaque image est très lente", () => {
  const n = (k, ms) => Array(k).fill(ms);
  assert.equal(alleger(n(60, 16), 5000), false, "60 images/s : rien");
  assert.equal(alleger(n(60, 25), 5000), true, "40 images/s : allégé");
  assert.equal(alleger(n(60, 25), 2000), false, "pas avant 3 s");
  assert.equal(alleger(n(12, 350), 4200), true, "une image toutes les 350 ms (machine très lente) : allégé dès 3 s");
  assert.equal(alleger(n(5, 350), 4200), false, "trop peu de mesures");
  assert.ok(garderIntervalle(350) && !garderIntervalle(4000), "un onglet caché (plusieurs secondes) n'est pas compté");
});
