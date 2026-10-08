// L'OCÉAN VIVANT : la mascotte et les acteurs posés par-dessus le décor, composés en direct à partir des sprites de
// l'atelier. Le décor lui-même (le fond, les poissons, les algues, les faisceaux, le miroitement) est le lagon du récif
// vivant : engine/lagon.js (lot « Lagon en fond d'exercices » ; l'ancien fond, ses reflets, ses algues, ses poissons
// et ses bulles ont été retirés).
//
// Chaque élément mobile est un acteur (actor.js) : son petit canvas n'est redessiné que quand son image
// change, ses déplacements sont faits par le compositeur.
//
// La mascotte (lot « Mascotte ») : le capitaine en vidéo (engine/mascotte.js), dans son calque #mascotte, à la place de la
// pieuvre : en haut à gauche, sous la maison (MASCOTTE, engine/bulle.js). Elle ne bouge pas : ce qu'elle cacherait est
// déplacé, pas elle. `mascotteVisible` (le récif vivant la cache) ; elle a sa propre boucle d'images.
import { Actor } from "./actor.js";
import { creerMascotte } from "./mascotte.js";
import { MASCOTTE } from "./bulle.js";

// le même générateur pseudo-aléatoire que l'atelier (core.ts, rng)
export const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

export class Ocean {
  // options : { rapide } (le mode accéléré des tests : la mascotte ne fait rien attendre), { journal } (ses raccords)
  // (lot « Correctifs de la tablette » : { progres }, appelé à chaque vidéo chargée, pour la barre de l'écran de démarrage)
  constructor(stage, sprites, atlas, { rapide = false, journal = () => {}, progres = () => {} } = {}) {
    this.st = stage; this.sp = sprites; this.atlas = atlas;
    const layer = (id) => { const d = document.createElement("div"); d.id = id; d.className = "actors"; return d; };
    // ordre d'empilement : fond et lagon (lagon.js), ligne graduée, visiteurs (backEl), mascotte, premier plan (étoile, tortue), boutons
    this.backEl = layer("back"); this.frontEl = layer("front");
    const el = (this.mascotteEl = stage.root.querySelector("#mascotte")), canvas = el.querySelector("canvas");
    stage.root.insertBefore(this.backEl, el); stage.root.insertBefore(this.frontEl, stage.ui);
    this.mascotte = creerMascotte({ canvas, rapide, journal, progres, niveau: () => stage.perf.level });
    this.mascotteVisible = true; this.shown = true;
    this.front = []; // rappels appelés à chaque image pour les acteurs du premier plan : f(t)
    this.t = 0; this.actors = [];
    this.placeMascotte();
    stage.onResize(() => { this.placeMascotte(); this.actors.forEach((a) => a.resize()); });
  }
  placeMascotte() {
    const k = this.st.k, m = MASCOTTE;
    Object.assign(this.mascotteEl.style, { left: `${m.x * k}px`, top: `${m.y * k}px`, width: `${m.w * k}px`, height: `${m.h * k}px` });
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
  update(t) { this.t = t; }
  render() {
    const t = this.t;
    if (this.mascotteVisible !== this.shown) { this.shown = this.mascotteVisible; this.mascotteEl.style.visibility = this.shown ? "visible" : "hidden"; this.mascotte.afficher(this.shown); }
    for (const f of this.front) f(t);
  }
}
