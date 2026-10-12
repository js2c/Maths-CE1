// LA BARRE NOIRE (lot « Recette de l'enfant et nettoyage des couches », point 0.1 ; docs/LOTS.md, fiche 9). Sur la tablette,
// la bande de la ligne graduée (y de 300 à 610) apparaissait en noir opaque dans tous les exercices : un canvas
// « bitmaprenderer » vidé par transferFromImageBitmap(null) n'y est pas toujours transparent. La règle : aucun calque de la
// bande (#line, #fx), ni le fond (#bg), n'est affiché sans image ; l'image de #line n'est libérée qu'une fois le calque caché.
// Le parcours tests/e2e/barre-noire.mjs vérifie la même règle dans l'application, exercice par exercice.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../../", import.meta.url), read = (p) => readFileSync(new URL(p, root), "utf8");

// un DOM réduit : juste ce que LineView touche
class Classes { constructor() { this.s = new Set(); } add(c) { this.s.add(c); } remove(c) { this.s.delete(c); } contains(c) { return this.s.has(c); } }
const journal = [];
class Canvas {
  constructor(id = "") { this.id = id; this.classList = new Classes(); this.style = {}; this.width = 300; this.height = 150; }
  getContext(type) {
    const c = this;
    return type === "bitmaprenderer"
      ? { transferFromImageBitmap: (b) => journal.push({ op: b ? "image" : "vide", cache: c.classList.contains("vide") }) }
      : { setTransform() {}, clearRect() {} };
  }
  after(e) { this.suivant = e; }
  cloneNode() { const c = new Canvas(this.id); for (const k of this.classList.s) c.classList.add(k); return c; }
  remove() {}
}
globalThis.document = { createElement: () => new Canvas() };
globalThis.Worker = class { postMessage() {} };
const { LineView } = await import("../../app/js/engine/line.js");
const ligne = new Canvas("line"), mascotte = new Canvas("mascotte");
const stage = { k: 1, px: 1, root: { querySelector: (s) => (s === "#line" ? ligne : s === "#mascotte" ? mascotte : null) }, onResize() {} };

test("la bande de la ligne : aucun calque affiché sans image, l'image libérée seulement une fois le calque caché", () => {
  const v = new LineView(stage), vide = (c) => c.classList.contains("vide");
  assert.ok(vide(v.c) && vide(v.fx), "au départ, ni ligne ni effets : les deux calques sont cachés");
  v.show({}); assert.ok(!vide(v.c) && v.affichee, "une ligne montrée : le calque est affiché");
  v.clear(); assert.ok(vide(v.c) && !v.affichee, "vidée : le calque est caché");
  assert.deepEqual(journal.at(-1), { op: "vide", cache: true }, "l'image n'est libérée qu'une fois le calque caché");
  const n = journal.length; v.clear(); assert.equal(journal.length, n, "vider un calque déjà vide ne touche plus au canvas");
  v.show(null); assert.ok(vide(v.c), "montrer « rien » revient à vider");
  v.fxDraw(() => {}); assert.ok(!vide(v.fx), "un effet dessiné : son calque est affiché");
  v.fxClear(); assert.ok(vide(v.fx), "effets effacés : le calque est caché");
  // une leçon jouée pendant une pause : des calques neufs, cachés tant qu'ils n'ont rien
  v.show({}); const rendre = v.swap(); assert.ok(vide(v.c) && vide(v.fx), "calques neufs de la leçon : cachés");
  rendre(); assert.ok(!vide(v.c), "au retour, la ligne de la séance est toujours là");
});

test("la bande et le fond : la feuille de style cache un canvas sans image ; le fond n'apparaît qu'avec la sienne", () => {
  assert.match(read("app/css/app.css"), /#stage > canvas\.vide \{ display: none; \}/);
  assert.match(read("app/js/engine/stage.js"), /this\.bg\.classList\.add\("vide"\)/);
  assert.match(read("app/js/engine/lagon.js"), /transferFromImageBitmap\(off\.transferToImageBitmap\(\)\);\s*this\.st\.bg\.classList\.remove\("vide"\)/);
  // plus aucun appel de transferFromImageBitmap(null) hors de clear(), qui cache le calque d'abord
  for (const f of ["app/js/engine/line.js", "app/js/engine/lagon.js", "app/js/main.js"]) {
    const s = read(f).split("\n").filter((l) => !/^\s*\/\//.test(l) && /transferFromImageBitmap\(null\)/.test(l));
    assert.ok(s.every((l) => /clear\(\) \{ this\.c\.classList\.add\("vide"\)/.test(l)), `${f} : transferFromImageBitmap(null) seulement dans clear(), après avoir caché le calque`);
  }
});

// (second passage de l'agent qui joue l'enfant, constat 3) le calque des aides, accéléré, gardait parfois à l'écran les rangées
// d'une correction de la multiplication après la maison, alors que chaque effacement avait eu lieu (rejeux du parcours de
// l'agent : au moins 7 sur 22 avec l'accélération du dessin 2D, 0 sur 6 sans, 0 sur 8 avec la correction) ; il est dessiné en logiciel
test("le calque des aides est une toile dessinée par le processeur (willReadFrequently), demandée avant tout autre dessin", () => {
  const aids = read("app/js/modules/facts/aids.js"), ctor = aids.slice(aids.indexOf("export class AidBoard"), aids.indexOf("  place()"));
  assert.match(ctor, /this\.c\.getContext\("2d", \{ willReadFrequently: true \}\);[\s\S]*this\.place\(\)/);
});
