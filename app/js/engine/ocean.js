// L'OCÉAN VIVANT : le décor et la pieuvre, composés en direct à partir des sprites de l'atelier.
// Rien n'est jamais figé : l'eau miroite, les poissons nagent en battant de la queue, les algues
// ondulent, des bulles montent, la pieuvre flotte, respire et cligne des yeux.
//
// Chaque élément mobile est un acteur (actor.js) : son petit canvas n'est redessiné que quand son image
// change, ses déplacements sont faits par le compositeur. Le fond fixe (#bg) n'est redessiné qu'une fois
// par question (il porte la ligne graduée).
//
// Allègement automatique (stage.perf.level, voir stage.js) :
//   niveau 1 : algues à 8 images/s au lieu de 15, moitié moins de reflets
//   niveau 2 : algues figées, pas de reflets, un poisson de moins
import { Actor } from "./actor.js";
import { Octopus } from "./octopus.js";
import { W } from "./stage.js";

// le même générateur pseudo-aléatoire que l'atelier (core.ts, rng)
export const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const TAU = Math.PI * 2;

// l'axe d'une algue : exactement weedX de art/src/canvas-core/sea/decor.ts
const weedX = (w, t, U) => w.x + w.lean * t * w.h + Math.sin(t * 5.2 + w.ph - TAU * U) * 16 * t + Math.sin(TAU * U + w.ph) * 14 * t * t;
const WEED_MARGIN = 40; // ondulation maximale de part et d'autre (px logiques)

export class Ocean {
  constructor(stage, sprites, atlas) {
    this.st = stage; this.sp = sprites; this.atlas = atlas;
    const layer = (id) => { const d = document.createElement("div"); d.id = id; d.className = "actors"; return d; };
    // ordre d'empilement : fond, décor mobile, pieuvre, premier plan (étoile, tortue), boutons
    this.backEl = layer("back"); this.frontEl = layer("front");
    const octoEl = stage.root.querySelector("#octo");
    stage.root.insertBefore(this.backEl, octoEl); stage.root.insertBefore(this.frontEl, stage.ui);
    this.octo = new Octopus(sprites, atlas.octo, octoEl, stage);
    this.octoAt = [262, 222]; this.octoVisible = true;
    this.front = []; // rappels appelés à chaque image pour les acteurs du premier plan : f(t)
    this.t = 0; this.actors = [];
    // reflets : les traînées claires de l'eau, qui dérivent doucement
    const r = rng(311);
    this.shimmer = Array.from({ length: 12 }, (_, i) => { const s = { x: 40 + r() * 1200, y: 30 + r() * 420, ph: r() * TAU, a: this.spriteActor(this.backEl, `reflet.${i % 6}`) }; s.a.draw(0); return s; });
    // algues : un acteur par brin, ses bandes décalées selon la formule de référence
    this.weeds = Object.keys(atlas.sprites).filter((n) => n.startsWith("algue.")).map((n) => {
      const w = { name: n, ...atlas.sprites[n].meta }, q = sprites.frame(n, 0), px = sprites.px;
      w.a = new Actor(stage, this.backEl, q.w / px + 2 * WEED_MARGIN, q.h / px, -q.dx / px + WEED_MARGIN, -q.dy / px);
      this.actors.push(w.a); return w;
    });
    // trois poissons, comme la référence : deux vers la gauche, un vers la droite
    this.fish = [{ kind: 0, dir: -1, y: 150, v: 38, x0: 1010, ph: 0 }, { kind: 1, dir: -1, y: 212, v: 52, x0: 1100, ph: 3 }, { kind: 2, dir: 1, y: 300, v: 44, x0: 300, ph: 7 }]
      .map((f) => ({ ...f, a: this.spriteActor(this.backEl, `poisson.${f.kind}.${f.dir < 0 ? "g" : "d"}`) }));
    // bulles : trois colonnes (celles de la référence) ; chaque bulle est la plus grande, réduite par le compositeur
    this.bubbleCols = [{ x: 390, y0: 150, span: 150, r: [9, 6, 11] }, { x: 144, y0: 128, span: 120, r: [6, 9, 5] }, { x: 620, y0: 330, span: 130, r: [7, 10, 5] }];
    this.bubbles = this.bubbleCols.flatMap((c) => c.r.map(() => { const a = this.spriteActor(this.backEl, "bulle.12"); a.draw(0); return a; }));
    stage.onResize(() => { this.octo.resize(); this.actors.forEach((a) => a.resize()); this.shimmer.forEach((s) => s.a.draw(0)); this.bubbles.forEach((a) => a.draw(0)); this.paintStatic(); });
  }
  // un acteur qui montre un sprite (ou plusieurs, de même ancrage : les boucles d'un personnage) : canvas
  // à la taille de la plus grande image, ancré comme le sprite
  spriteActor(parent, name, others = []) {
    const sp = this.sp, px = sp.px;
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    for (const n of [name, ...others]) for (let f = 0; f < sp.atlas.sprites[n].frames; f++) { const r = sp.frame(n, f); x0 = Math.min(x0, r.dx); y0 = Math.min(y0, r.dy); x1 = Math.max(x1, r.dx + r.w); y1 = Math.max(y1, r.dy + r.h); }
    const a = new Actor(this.st, parent, (x1 - x0) / px + 2, (y1 - y0) / px + 2, -x0 / px + 1, -y0 / px + 1);
    a.draw = (f, n = name) => a.paint(`${n}:${f}`, (ctx) => sp.draw(ctx, n, f, a.ax, a.ay));
    this.actors.push(a); return a;
  }
  // le fond fixe : eau et sable, rayons. Composé hors écran une fois, puis confié au canvas #bg en « bitmaprenderer » : une image
  // fixe que le navigateur n'a plus à recopier à chaque image (mesuré : un canvas 2D plein écran était
  // recopié à chaque image, ~11 ms avec le processeur ÷4, même sans être modifié).
  paintStatic() {
    const W2 = this.st.bg.width, H2 = this.st.bg.height, off = (this.bgOff ??= new OffscreenCanvas(W2, H2));
    if (off.width !== W2 || off.height !== H2) { off.width = W2; off.height = H2; }
    const c = off.getContext("2d"), q = this.sp.frame("fond", 0), rays = this.sp.frame("rayons", 0);
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (q) c.drawImage(q.img, q.sx, q.sy, q.w, q.h, 0, 0, W2, H2);
    if (rays) c.drawImage(rays.img, rays.sx, rays.sy, rays.w, rays.h, 0, 0, W2, H2);
    (this.bgCtx ??= this.st.bg.getContext("bitmaprenderer")).transferFromImageBitmap(off.transferToImageBitmap());
  }
  update(t, dt) { this.t = t; this.octo.update(dt); }
  render() {
    const t = this.t, lvl = this.st.perf.level, px = this.sp.px;
    this.shimmer.forEach((s, i) => { s.a.show(lvl === 0 || (lvl === 1 && i % 2 === 0)); s.a.moveTo(s.x + 14 * Math.sin((TAU * t) / 4 + i), s.y, 1, Math.round((0.8 + 0.2 * Math.sin((TAU * t) / 5 + s.ph)) * 20) / 20); });
    this.fish.forEach((f, i) => {
      f.a.show(!(lvl === 2 && i === 2));
      // traverse l'écran puis revient après un temps hors champ ; nage ondulée, queue à 12 images/s
      const span = W + 400, x = f.dir < 0 ? W + 200 - ((W + 200 - f.x0 + f.v * t) % span) : ((f.x0 + 200 + f.v * t) % span) - 200;
      f.a.draw(Math.floor(t * 12 + f.ph) % 12);
      f.a.moveTo(x, f.y + 6 * Math.sin((TAU * t) / 3 + f.ph) + 3 * Math.sin((TAU * t) / 1.3 + f.ph));
    });
    // algues : chaque bande horizontale du brin au repos est décalée de ce que la formule de référence
    // donne à sa hauteur (on déplace des pixels déjà dessinés, on ne redessine rien). 15 images/s suffisent
    // à un mouvement aussi lent ; c'est aussi la cadence des sprites.
    const fps = lvl === 0 ? 15 : lvl === 1 ? 8 : 0, U = fps ? (Math.floor(t * fps) / fps / 4) % 1 : 0, band = Math.max(4, Math.round(4 * px));
    for (const w of this.weeds) {
      w.a.paint(`${U}`, (ctx) => {
        const q = this.sp.frame(w.name, 0), X = Math.round(WEED_MARGIN * px);
        for (let y = 0; y < q.h; y += band) {
          const h = Math.min(band, q.h - y), tt = Math.min(1, Math.max(0, (-q.dy - y - h / 2) / (w.h * px)));
          ctx.drawImage(q.img, q.sx, q.sy + y, q.w, h, X + Math.round((weedX(w, tt, U) - weedX(w, tt, 0)) * px), y, q.w, h);
        }
      });
      w.a.moveTo(w.x, w.y);
    }
    // bulles : chacune renaît en bas de sa colonne quand elle arrive en haut ; grossit en montant
    const u = (t / 4) % 1; let i = 0;
    this.bubbleCols.forEach((c, ci) => c.r.forEach((r, j) => {
      const k = (j / 3 + u) % 1, rr = r * (0.75 + 0.35 * k) * Math.min(1, k * 7, (1 - k) * 10), a = this.bubbles[i++];
      a.show(rr > 1.5); a.moveTo(c.x + 5 * Math.sin(TAU * (2 * u + k) + ci + j), c.y0 - k * c.span, Math.round((rr / 12) * 50) / 50);
    }));
    if (this.octoVisible) { const [ox, oy] = this.octoAt; this.octo.place(ox, oy + 7 * Math.sin((TAU * t) / 3)); }
    this.octo.cache.style.visibility = this.octoVisible ? "visible" : "hidden";
    for (const f of this.front) f(t);
  }
}
