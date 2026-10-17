// L'ÉTAT DE LA PAGE (lot « Banc Android et recette en conditions réelles », point 3 ; docs/LOTS.md, fiche 13). Ce qu'une
// tablette ne dit pas d'elle-même et qu'un ordinateur n'émule pas : ses lecteurs de médias, sa mémoire graphique, sa mémoire.
// Ce module compte, dans la page, ce qui les consomme :
//  - les lecteurs de médias qui ont une source (les <audio> et <video>, dans la page ou non : la voix, la mascotte) ;
//  - les canvas vivants, leur surface totale en mégapixels, et les contextes WebGL non perdus ;
//  - les images chargées en mémoire (éléments <img> et ImageBitmap non fermés), en mégapixels ;
//  - la mémoire de la page (performance.memory, si Chrome la donne) ;
//  - les minuteries en attente (setTimeout, setInterval) et les écouteurs posés sur ce qui est encore dans la page.
// Le MÊME code sert au journal technique de la tablette (main.js, « état de la page », toutes les 10 minutes) et au banc
// d'essai (tests/e2e/appareils.mjs, `budgets`) : un dépassement vu dans le journal et un dépassement vu par le banc sont le
// même chiffre. Les valeurs des budgets : docs/ARCHITECTURE.md, « Le banc Android ».
// `installer()` doit passer avant tout le reste (le premier import de main.js) : il enveloppe les fonctions qui créent ces
// ressources pour en garder une référence faible (WeakRef : le compte ne retient rien en mémoire). Ce qui est créé dans un
// Worker (la ligne graduée, line-worker.js) n'est pas compté.
const vivants = { medias: new Set(), canvas: new Set(), images: new Set(), bitmaps: new Set() };
const typeContexte = new WeakMap();
const minuteries = new Set();
// les écouteurs : par cible, le nombre d'écouteurs distincts (type, fonction, phase) ; les cibles en référence faible
const ecoutes = new WeakMap(), cibles = new Set(), idFonction = new WeakMap();
let nFonctions = 0, installe = false;
const connus = new WeakSet();
const garder = (ens, objet) => { try { if (!connus.has(objet)) { connus.add(objet); ens.add(new WeakRef(objet)); } } catch { /* rien */ } };
const vivantsDe = (ens) => { const l = []; for (const r of ens) { const o = r.deref(); if (o) l.push(o); else ens.delete(r); } return l; };

export function installer(w = globalThis) {
  if (installe || !w.document) return; installe = true;
  // les contextes des canvas (2D, WebGL), et les canvas eux-mêmes
  for (const C of [w.HTMLCanvasElement, w.OffscreenCanvas].filter(Boolean)) {
    const gc = C.prototype.getContext;
    C.prototype.getContext = function (type, ...a) {
      const ctx = gc.call(this, type, ...a);
      if (ctx && !typeContexte.has(this)) { typeContexte.set(this, { type: String(type), ctx }); garder(vivants.canvas, this); }
      return ctx;
    };
  }
  // les images : chaque <img> qui reçoit une source ; chaque ImageBitmap
  const img = Object.getOwnPropertyDescriptor(w.HTMLImageElement.prototype, "src");
  if (img?.set) Object.defineProperty(w.HTMLImageElement.prototype, "src", { ...img, set(v) { garder(vivants.images, this); return img.set.call(this, v); } });
  if (w.createImageBitmap) { const cib = w.createImageBitmap; w.createImageBitmap = function (...a) { return cib.apply(this, a).then((b) => { garder(vivants.bitmaps, b); return b; }); }; }
  // les lecteurs de médias : chaque <audio> ou <video> qui reçoit une source (y compris new Audio(adresse))
  const md = Object.getOwnPropertyDescriptor(w.HTMLMediaElement.prototype, "src");
  if (md?.set) Object.defineProperty(w.HTMLMediaElement.prototype, "src", { ...md, set(v) { garder(vivants.medias, this); return md.set.call(this, v); } });
  const sa = w.Element.prototype.setAttribute;
  w.Element.prototype.setAttribute = function (n, v) { if (n === "src" && this instanceof w.HTMLMediaElement) garder(vivants.medias, this); return sa.call(this, n, v); };
  if (w.Audio) { const A = w.Audio; w.Audio = function Audio(...a) { const e = new A(...a); garder(vivants.medias, e); return e; }; w.Audio.prototype = A.prototype; }
  // les minuteries en attente
  const st = w.setTimeout, si = w.setInterval, ct = w.clearTimeout, ci = w.clearInterval;
  w.setTimeout = function (f, ms, ...a) { const id = st.call(w, typeof f === "function" ? (...b) => { minuteries.delete(id); return f(...b); } : f, ms, ...a); minuteries.add(id); return id; };
  w.setInterval = function (f, ms, ...a) { const id = si.call(w, f, ms, ...a); minuteries.add(id); return id; };
  w.clearTimeout = function (id) { minuteries.delete(id); return ct.call(w, id); };
  w.clearInterval = function (id) { minuteries.delete(id); return ci.call(w, id); };
  // les écouteurs (les écouteurs « once » ne sont pas comptés : ils se retirent d'eux-mêmes)
  const add = w.EventTarget.prototype.addEventListener, rem = w.EventTarget.prototype.removeEventListener;
  const cle = (type, f, o) => { if (!idFonction.has(f)) idFonction.set(f, ++nFonctions); return `${type}|${typeof o === "boolean" ? o : !!o?.capture}|${idFonction.get(f)}`; };
  w.EventTarget.prototype.addEventListener = function (type, f, o) {
    if (f && (typeof f === "function" || typeof f === "object") && !o?.once) {
      try { let s = ecoutes.get(this); if (!s) { s = new Set(); ecoutes.set(this, s); garder(cibles, this); } s.add(cle(type, f, o)); } catch { /* rien */ }
    }
    return add.call(this, type, f, o);
  };
  w.EventTarget.prototype.removeEventListener = function (type, f, o) { if (f) ecoutes.get(this)?.delete(cle(type, f, o)); return rem.call(this, type, f, o); };
}

// la mesure : un objet de nombres, le même pour le journal et pour le banc
// (`voix` : les lecteurs que la voix tient hors de la page, s'ils ne sont pas déjà vus ici ; `canvasDom` et `mediasDom` : ceux
// qui sont dans la page, pour comparer)
export function mesurer() {
  const w = globalThis, d = w.document;
  const medias = vivantsDe(vivants.medias).filter((m) => m.getAttribute("src") || m.srcObject);
  for (const m of d.querySelectorAll("audio, video")) if ((m.getAttribute("src") || m.srcObject) && !medias.includes(m)) medias.push(m);
  const canvas = vivantsDe(vivants.canvas), dom = [...d.getElementsByTagName("canvas")];
  for (const c of dom) if (!canvas.includes(c)) canvas.push(c);
  const mpx = (l) => +(l.reduce((s, c) => s + (c.width || 0) * (c.height || 0), 0) / 1e6).toFixed(2);
  const webgl = canvas.filter((c) => { const t = typeContexte.get(c); return t && /webgl/.test(t.type) && !t.ctx.isContextLost?.(); }).length;
  const images = vivantsDe(vivants.images).filter((i) => i.complete && i.naturalWidth > 0);
  for (const i of d.images) if (i.complete && i.naturalWidth > 0 && !images.includes(i)) images.push(i);
  const bitmaps = vivantsDe(vivants.bitmaps).filter((b) => b.width > 0);
  let nEcouteurs = 0;
  for (const c of vivantsDe(cibles)) { if (c instanceof w.Node && c !== d && !c.isConnected) continue; nEcouteurs += ecoutes.get(c)?.size ?? 0; }
  return {
    medias: medias.length, mediasVideo: medias.filter((m) => m.tagName === "VIDEO").length,
    canvas: canvas.length, canvasMpx: mpx(canvas), webgl,
    images: images.length + bitmaps.length, imagesMpx: +((images.reduce((s, i) => s + i.naturalWidth * i.naturalHeight, 0) + bitmaps.reduce((s, b) => s + b.width * b.height, 0)) / 1e6).toFixed(2),
    memoireMo: w.performance?.memory ? Math.round(w.performance.memory.usedJSHeapSize / 1e6) : null,
    minuteries: minuteries.size, ecouteurs: nEcouteurs, elements: d.getElementsByTagName("*").length,
  };
}

installer();
