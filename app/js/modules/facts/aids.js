// MODULE 2 · LES AIDES VISUELLES À L'ÉCRAN (docs/SPEC-LOT2.md, « Aides visuelles et personnage guide »).
// Un calque plein écran (`AidBoard`, au-dessus de la pieuvre, sous la tortue et le bernard-l'ermite), dessiné
// UNE fois par question ou par étape de leçon avec les pièces fabriquées par l'atelier (planche « aides » :
// art/src/canvas-core/sea/aids.ts) et les chiffres de runtime.js, puis simplement affiché ; vidé ensuite.
//  - cadre de 10 : `paintTenFrame` (n poissons dans les alvéoles, lueur sur des places) ;
//  - maison des nombres : `paintHouse` (le toit et son total, un étage par paire, le seuil) ;
//  - double + 1 : `paintDoublePlus` (a poissons, leur reflet, la bulle dorée « une de plus »).
import * as R from "../../art/runtime.js";

export class AidBoard {
  constructor(app) {
    this.app = app; const st = app.stage;
    this.c = document.createElement("canvas"); this.c.id = "aides"; this.c.className = "aid-board";
    // sous les acteurs du premier plan (tortue, bernard-l'ermite), au-dessus de la pieuvre et des effets
    st.root.insertBefore(this.c, st.root.querySelector("#front") ?? st.ui);
    this.used = false; this.place(); st.onResize(() => this.place());
  }
  place() { const { px, k } = this.app.stage; this.c.width = Math.round(1280 * px); this.c.height = Math.round(800 * px); Object.assign(this.c.style, { width: `${1280 * k}px`, height: `${800 * k}px` }); this.used = false; }
  // dessine en coordonnées de la scène (px logiques) ; efface d'abord
  draw(fn) { const x = this.c.getContext("2d"), px = this.app.stage.px; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.c.width, this.c.height); x.setTransform(px, 0, 0, px, 0, 0); fn(x); this.used = true; }
  clear() { if (!this.used) return; const x = this.c.getContext("2d"); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.c.width, this.c.height); this.used = false; }
}

// pose un sprite dans un contexte déjà en px logiques (sprites.draw travaille en pixels d'écran)
export const put = (ctx, sprites, name, x, y, f = 0) => { const m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0); sprites.draw(ctx, name, f, m.a * x / sprites.px + m.e / sprites.px, m.d * y / sprites.px + m.f / sprites.px); ctx.setTransform(m); };
// un nombre écrit au feutre, centré en (x, y)
export const num = (ctx, v, x, y, em = 36, color) => R.drawNumber(ctx, String(v), x, y - em / 2, em, { w: em * 0.14, color });

// ---------------------------------------------------------------- le cadre de 10
// (x, y) : coin haut gauche du cadre ; n : poissons posés dans les alvéoles, dans l'ordre (rangée du haut,
// puis du bas) ; glow : alvéoles entourées de lumière ; extra : poissons d'une autre couleur après les n premiers
export function paintTenFrame(ctx, sprites, x, y, { n = 0, glow = [], extra = 0 } = {}) {
  const m = sprites.atlas.sprites["aide.cadre10"].meta;
  put(ctx, sprites, "aide.cadre10", x, y);
  for (let i = 0; i < Math.min(10, n + extra); i++) { const [cx, cy] = m.cells[i]; put(ctx, sprites, i < n ? "poisson.2.d" : "poisson.1.d", x + cx, y + cy); }
  for (const i of glow) { const [cx, cy] = m.cells[i]; put(ctx, sprites, "aide.cadre.lueur", x + cx, y + cy); }
  return { w: m.w, h: m.h, cell: (i) => [x + m.cells[i][0], y + m.cells[i][1]] };
}

// ---------------------------------------------------------------- la maison des nombres
// cx : milieu ; top : bas du toit (haut du premier étage) ; total sur le toit ; rows : [[a, b], …] (un nombre
// ou « ? » en rouge) ; renvoie la hauteur totale et la position des plaques
export function paintHouse(ctx, sprites, cx, top, total, rows) {
  const H = sprites.atlas.sprites["aide.maison.toit"].meta, q = H.w / 4;
  rows.forEach((_, k) => put(ctx, sprites, "aide.maison.etage", cx, top + k * H.floor));
  put(ctx, sprites, "aide.maison.seuil", cx, top + rows.length * H.floor);
  put(ctx, sprites, "aide.maison.toit", cx, top);
  num(ctx, total, cx, top - H.roof * 0.5, 44);
  const slots = rows.map(([a, b], k) => { const y = top + k * H.floor + H.floor / 2; for (const [v, x] of [[a, cx - q], [b, cx + q]]) if (v !== null && v !== undefined) num(ctx, v, x, y, 36, v === "?" ? R.RED : undefined); return [[cx - q, y], [cx + q, y]]; });
  return { height: H.roof + rows.length * H.floor + H.base, slots, roof: [cx, top - H.roof * 0.5] };
}
export const houseHeight = (sprites, floors) => { const H = sprites.atlas.sprites["aide.maison.toit"].meta; return H.roof + floors * H.floor + H.base; };

// ---------------------------------------------------------------- double + 1
// a poissons en haut, les mêmes renversés sous une ligne d'eau (le miroir), puis la bulle dorée
export function paintDoublePlus(ctx, sprites, a, { cx = 640, y = 360, gap = 92, bonus = true } = {}) {
  const n = a + (bonus ? 1 : 0), x0 = cx - ((n - 1) * gap) / 2;
  const fish = (x, yy, flip, alpha) => { const f = sprites.frame("poisson.1.d", 0), m = ctx.getTransform(); ctx.setTransform(1, 0, 0, flip ? -1 : 1, 0, 0); ctx.globalAlpha = alpha; const X = Math.round(m.a * x + m.e + f.dx), Y = m.d * yy + m.f; ctx.drawImage(f.img, f.sx, f.sy, f.w, f.h, X, flip ? -Math.round(Y - f.dy) : Math.round(Y + f.dy), f.w, f.h); ctx.globalAlpha = 1; ctx.setTransform(m); };
  for (let i = 0; i < a; i++) fish(x0 + i * gap, y, false, 1);
  R.drawWave(ctx, x0 - 70, x0 + (a - 1) * gap + 70, y + 48);
  for (let i = 0; i < a; i++) fish(x0 + i * gap, y + 96, true, 0.6);
  if (bonus) put(ctx, sprites, "aide.bulle.doree", x0 + a * gap, y + 96);
  return { bonus: [x0 + a * gap, y + 96] };
}
