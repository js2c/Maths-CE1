// La voix des cartes en grand (décision du parent du 28 septembre 2026 ; docs/SPEC.md, « La carte et l'album ») : la voix
// dit le nom et l'anecdote UNE fois, à l'ouverture ; toucher la carte la retourne dans un sens comme dans l'autre sans
// relancer la voix (le bruitage du retournement sonne ; si la voix parle encore, elle continue).
// Un petit DOM factice suffit : CardView ne fait que poser des éléments et écouter des touchers.
import { test } from "node:test";
import assert from "node:assert/strict";

// ---------------------------------------------------------------- un DOM factice (le strict nécessaire)
const ctx2d = () => new Proxy({}, { get: (t, k) => (k in t ? t[k] : k === "getTransform" ? () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }) : k === "measureText" ? () => ({ width: 10 }) : () => {}), set: (t, k, v) => { t[k] = v; return true; } });
class El {
  constructor(tag) { this.tag = tag; this.children = []; this.style = {}; this.attrs = {}; this.dataset = {}; this.listeners = {}; this.parent = null; this.cls = new Set(); this.width = 0; this.height = 0; }
  get className() { return [...this.cls].join(" "); }
  set className(v) { this.cls = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get classList() { const c = this.cls; return { add: (...x) => x.forEach((y) => c.add(y)), remove: (...x) => x.forEach((y) => c.delete(y)), contains: (x) => c.has(x), toggle: (x, v = !c.has(x)) => { if (v) c.add(x); else c.delete(x); return v; } }; }
  append(...xs) { for (const x of xs) { x.parent = this; this.children.push(x); } }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter((x) => x !== this); this.parent = null; }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener(t, f) { (this.listeners[t] ??= []).push(f); }
  getContext() { const c = ctx2d(); c.canvas = this; return c; }
  get offsetWidth() { return 0; }
  tap() { for (const f of this.listeners.pointerdown ?? []) f({ preventDefault() {} }); }
}
globalThis.document = { createElement: (t) => new El(t) };
const find = (root, pred) => { if (pred(root)) return root; for (const c of root.children) { const r = find(c, pred); if (r) return r; } return null; };

const { CardView, cardLine } = await import("../../app/js/session/cards.js");

function fakeApp() {
  const said = [], sounds = [], ui = new El("div");
  const voice = { said, stops: 0, say(t) { said.push(t); return Promise.resolve(); }, stop() { this.stops++; } };
  const app = {
    stage: { ui, px: 1 }, voice, text: { data: { recifCarte: "Voici {nom} !" } }, cartes: { zones: [], dosLegendaire: null },
    sound: { play: (n) => sounds.push(n) },
    sprites: { load: async () => {}, frame: () => null, draw: () => null, atlas: { sprites: {} } },
  };
  return { app, said, sounds, ui, voice };
}
const CARTE = { id: "crabe", nom: "Le crabe", nomLu: "le crabe", anecdote: "Le crabe marche de côté.", rarete: "commune", zone: "lagon" };

test("la voix dit le nom et l'anecdote une seule fois, à l'ouverture de la carte", async () => {
  const { app, said } = fakeApp(), view = new CardView(app);
  await view.show(CARTE);
  assert.deepEqual(said, [cardLine(app.text, CARTE)]);
  assert.equal(said[0], "Voici le crabe ! Le crabe marche de côté.");
});

test("retourner la carte, dans un sens puis dans l'autre, ne relance pas la voix ni ne la coupe ; le bruitage sonne", async () => {
  const { app, said, sounds, ui, voice } = fakeApp(), view = new CardView(app);
  await view.show(CARTE);
  const card = find(ui, (e) => e.cls.has("card")), stops = voice.stops;
  card.tap(); assert.ok(card.cls.has("flipped"), "premier toucher : le verso (l'anecdote écrite)");
  card.tap(); assert.ok(!card.cls.has("flipped"), "second toucher : le recto");
  card.tap();
  assert.equal(said.length, 1, `aucune phrase au retournement (${said.length - 1} de plus)`);
  assert.equal(voice.stops, stops, "la voix n'est pas coupée : si elle parle encore, elle continue");
  assert.deepEqual(sounds, ["carte", "carte", "carte"]);
});

test("rouvrir une autre carte la fait dire (une fois par ouverture)", async () => {
  const { app, said } = fakeApp(), view = new CardView(app);
  view.close = async function () { if (!this.card) return; const { veil, el, ok } = this.card; this.card = null; this.tok++; veil.remove(); el.remove(); ok.remove(); };
  await view.show(CARTE); await view.show({ ...CARTE, id: "moule", nom: "La moule", nomLu: "la moule", anecdote: "La moule filtre l'eau." });
  assert.equal(said.length, 2);
});
