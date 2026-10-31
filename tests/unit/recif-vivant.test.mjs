// LE RÉCIF VIVANT (docs/SPEC.md, section 10, « Le récif vivant ») : la collection est la maquette du récif vivant
// (art/recif-vivant/index.html), transportée telle quelle par l'atelier (art/tools/export-recif.mjs) ; ses créatures sont
// des images de la maquette, plus des créatures dessinées en code.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { alleger, garderIntervalle, niveauxRecif, recifCreatures, SEUIL_MS, versCarte, versMaquette } from "../../app/js/session/reef.js";
import { aRefaire, echelleReduite, etapes, MARGE, reduire, Reductions } from "../../app/js/recif/reduction.js";
import { ligneJournal } from "../../app/js/parent/data.js";

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

test("pendant la visite : le lagon en pause, ni la mascotte ni le compteur d'étoiles, tout est rendu en sortant", () => {
  assert.match(reefJs, /lagon\?\.pause\(true\)/); assert.match(reefJs, /lagon\?\.pause\(false\)/);
  assert.match(reefJs, /ocean\.mascotteVisible = false/); assert.match(reefJs, /classList\.remove\("recif-masque"\)/);
  assert.match(reefJs, /this\.api\?\.stop\(\)/); assert.match(reefJs, /removeEventListener/);
});

test("l'allègement : après 3 s, au-delà de 33 ms d'intervalle moyen (30 images/s, CLAUDE.md), même quand chaque image est très lente", () => {
  const n = (k, ms) => Array(k).fill(ms);
  assert.equal(SEUIL_MS, 33);
  assert.equal(alleger(n(60, 16), 5000), false, "60 images/s : rien");
  assert.equal(alleger(n(60, 25), 5000), false, "40 images/s : rien (avant le lot « Netteté du récif » : allégé)");
  assert.equal(alleger(n(60, 30), 5000), false, "33 images/s : rien");
  assert.equal(alleger(n(60, 40), 5000), true, "25 images/s : allégé");
  assert.equal(alleger(n(60, 40), 2000), false, "pas avant 3 s");
  assert.equal(alleger(n(12, 350), 4200), true, "une image toutes les 350 ms (machine très lente) : allégé dès 3 s");
  assert.equal(alleger(n(5, 350), 4200), false, "trop peu de mesures");
  assert.ok(garderIntervalle(350) && !garderIntervalle(4000), "un onglet caché (plusieurs secondes) n'est pas compté");
});

test("l'allègement par crans : la définition baisse en dernier, d'abord à 1,5, la densité 1 en dernier recours", () => {
  const s5e = niveauxRecif(2.25);
  assert.deepEqual(s5e.map((p) => p.densite), [2, 2, 1.5, 1], "tablette de référence : 2, 2, 1,5, 1");
  assert.equal(s5e[0].cadence, 0); assert.equal(s5e[0].bandes, 1);
  assert.ok(s5e[1].cadence > 0 && s5e[1].cadence < 30 && s5e[1].bandes < 1, "le premier cran : l'ondulation à cadence réduite, moins de bandes");
  assert.deepEqual(niveauxRecif(1.5).map((p) => p.densite), [1.5, 1.5, 1], "écran de densité 1,5 : pas de cran à 1,5");
  assert.deepEqual(niveauxRecif(1).map((p) => p.densite), [1, 1], "écran de densité 1 : seul l'allègement des créatures");
  assert.match(reefJs, /noter\("récif", `récif allégé : \$\{p\.nom\}`, \{ niveauRecif: this\.niveau, niveauxRecif: this\.paliers\.length - 1, densiteDessin: p\.densite, intervalleMs:/, "chaque cran est noté au journal technique");
});

test("le journal technique : un allègement du récif, en clair pour le parent (densité, intervalle mesuré)", () => {
  const l = ligneJournal({ t: new Date(2026, 9, 31, 19, 42, 5).getTime(), type: "récif", message: "récif allégé : densité 1,5", niveauRecif: 2, niveauxRecif: 3, densiteDessin: 1.5, intervalleMs: 41.2, zoneRecif: "Le lagon" });
  assert.equal(l, "31/10 19:42:05 · récif · récif allégé : densité 1,5 (niveau 2 sur 3, dessin en densité 1,5, 41,2 ms par image en moyenne, le lagon)");
});

test("les créatures réduites une fois, à leur taille d'affichage (au double), par moitiés exactes", () => {
  assert.equal(MARGE, 2);
  assert.equal(echelleReduite(0.2), 0.4); assert.equal(echelleReduite(0.7), 1, "jamais plus grande que l'image");
  assert.deepEqual(etapes(600, 400, 0.13), [[300, 200], [150, 100], [78, 52]], "des moitiés, puis la cible");
  assert.deepEqual(etapes(600, 400, 0.25), [[300, 200], [150, 100]], "la cible est une moitié exacte");
  assert.deepEqual(etapes(600, 400, 0.8), [[480, 320]], "moins d'une moitié : une seule étape");
  assert.ok(!aRefaire(0.4, 0.42) && aRefaire(0.4, 0.3) && aRefaire(null, 0.3), "refaite seulement si la densité change vraiment");
  // un faux canvas : on suit les étapes et ce qui est rendu
  const faits = [];
  const creer = () => { const c = { width: 0, height: 0, getContext: () => ({ drawImage: (im, sx, sy, sw, sh, dx, dy, dw, dh) => faits.push([sw, sh, dw, dh]) }) }; return c; };
  const out = reduire({ src: 1 }, 600, 400, 0.13, creer);
  assert.deepEqual([out.width, out.height], [78, 52]);
  assert.deepEqual(faits, [[600, 400, 300, 200], [300, 200, 150, 100], [150, 100, 78, 52]]);
  // au plus deux réductions par image ; la même image source n'est réduite qu'une fois ; tout est rendu en sortant
  const R = new Reductions({ creer }), a = {}, b = {}, c = {};
  assert.ok(R.pour(a, 600, 400, 0.1, 1) && R.pour(b, 600, 400, 0.1, 1));
  assert.equal(R.pour(c, 600, 400, 0.1, 1), null, "la troisième attend l'image suivante");
  assert.ok(R.pour(c, 600, 400, 0.1, 2));
  assert.equal(R.pour(a, 600, 400, 0.1, 3), R.pour(a, 600, 400, 0.105, 3), "gardée");
  assert.equal(R.pour(a, 600, 400, 0.7, 3), null, "à l'échelle 1 : la grande image");
  assert.equal(R.nombre, 3); R.vider(); assert.equal(R.nombre, 0);
});

test("le module dessine les créatures depuis l'image réduite, avec la déformation de la maquette (lagBlit, export-recif.mjs)", () => {
  assert.match(moduleJs, /function lagBlit\(c, src, t, X0, Y0, rec\)\{\n  const Q = OPTS\.qualite\(\), RD = \(c\.agrandi \|\| 1\) > 1\.05 \? null : OPTS\.reduite\(src, c\.w, c\.h, sc\*c\.k\)/);
  assert.match(moduleJs, /function lagDeforme\(g, c, im, r, t, X0, Y0, rec, NC, NR\)/);
  const maquette = read("art/recif-vivant/index.html");
  for (const f of ["c.col((i + 0.5)/NC, t, c)", "c.row(v, t, c)", "c.row((j + 0.5)/NR, t, c)"]) assert.ok(maquette.includes(f) && moduleJs.includes(f), `la déformation de la maquette : ${f}`);
  assert.match(reefJs, /this\.reductions\?\.vider\(\)/, "les images réduites rendues en sortant");
});

test("le grand large : les nageuses réparties sur toute la hauteur, moins de grappes (art/tools/grand-large.mjs)", async () => {
  const { NAGEUSES, mesure } = await import("../../art/tools/grand-large.mjs");
  const P = donnees.PROFONDEURS;
  assert.deepEqual(Object.keys(P).sort(), NAGEUSES.map((c) => c.id).sort(), "une profondeur pour chacune des 15 nageuses du grand large");
  assert.match(moduleJs, /c\.y = OPTS\.donnees\.PROFONDEURS\[c\.id\]/, "le module applique les profondeurs");
  const ys = Object.values(P).sort((a, b) => a - b);
  assert.ok(ys[0] <= 240 && ys.at(-1) >= 1550, `de la surface au fond (${ys[0]} à ${ys.at(-1)})`);
  const pas = ys.slice(3).map((y, i) => y - ys[i + 2]);
  assert.ok(pas.every((d) => d >= 95 && d <= 110), `couloirs réguliers sous la surface (${pas.join(", ")})`);
  for (const c of NAGEUSES) assert.ok(P[c.id] - c.h / 2 >= 80 && P[c.id] + c.h / 2 <= 1700, `${c.id} reste dans l'eau`);
  const avant = mesure(), apres = mesure(P);
  assert.ok(apres.francs < avant.francs && apres.sousMarin < avant.sousMarin && apres.grappes < avant.grappes && apres.pire < avant.pire, `moins encombré : ${JSON.stringify(avant)} → ${JSON.stringify(apres)}`);
});
