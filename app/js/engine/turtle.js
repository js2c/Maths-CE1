// LA TORTUE EN DIRECT : un acteur (actor.js) qui joue les boucles fabriquées par l'atelier (repos, saut,
// nage) et se déplace sur la ligne graduée. Le saut est une boucle de 10 images dont l'atelier donne, pour
// chaque image, l'avancée entre les deux bouées et la hauteur relative de l'arc (meta.path) : ici on
// l'étire à l'écart réel entre deux graduations, qui change d'un niveau à l'autre.
import { buoyR, lineY, tickP } from "../art/runtime.js";
import { clock } from "./clock.js";

const FPS = 12;

export class Turtle {
  constructor(ocean) {
    this.o = ocean; this.sp = ocean.sp;
    this.a = ocean.spriteActor(ocean.frontEl, "tortue.repos", ["tortue.saut", "tortue.nage"]);
    this.a.show(false); this.spec = null; this.pos = [0, 0]; this.clip = "tortue.repos"; this.t0 = 0; this.anim = null; this.jumpS = 0;
    this.speed = 1; // exemples guidés et corrections : content/seance.json, vitesseAnimations (les leçons gardent 1)
    ocean.front.push((t) => this.tick(t));
    this.path = this.sp.atlas.sprites["tortue.saut"].meta.path;
  }
  // où poser l'ancrage (sous le ventre) sur la graduation i : sur le haut de la bouée, ou sur le trait
  // (sur la réglette de la ligne d'école, dès qu'elle apparaît, la tortue se pose sur son bord haut)
  seat(i) { const [x, y] = tickP(this.spec, i); return [x, this.spec.k > 0.3 ? this.spec.y - 29 : y - buoyR(this.spec) * 1.08 + 2]; }
  sitOn(spec, i) { this.spec = spec; this.at = i; this.pos = this.seat(i); this.clip = "tortue.repos"; this.anim = null; this.a.show(true); }
  hide() { this.a.show(false); this.anim = null; }
  // (le temps ne recule jamais : un horodatage d'image plus ancien que le précédent donnait un indice négatif, lot 3, étape 5)
  tick(t) {
    t = Math.max(t, this.now ?? t); this.now = t;
    if (!this.a.vis) return;
    if (this.anim) { const done = this.anim(t); if (done) { const r = this.animDone; this.anim = null; this.clip = "tortue.repos"; this.t0 = t; r?.(); } }
    const n = this.sp.atlas.sprites[this.clip].frames, f = this.clip === "tortue.saut" ? this.jf : Math.max(0, Math.floor((t - this.t0) * FPS)) % n;
    this.a.draw(f, this.clip);
    this.a.moveTo(this.pos[0], this.pos[1]);
  }
  // (la fin de l'animation passe par la porte de l'activité qui l'a demandée : engine/clock.js, `hold`)
  run(fn) { const g = clock.hold(); return new Promise((res) => { this.t0 = this.now ?? 0; this.animDone = res; this.anim = fn; }).then(g); }
  // un saut de la graduation i à la graduation j (voisines ou non) ; onLand à l'atterrissage
  jump(j, { onTakeOff } = {}) {
    const a = this.seat(this.at), b = this.seat(j), d = Math.abs(b[0] - a[0]), h = Math.min(70, 22 + d * 0.45), n = this.path.length;
    this.clip = "tortue.saut"; this.jf = 0; this.jumpS = 0; onTakeOff?.();
    return this.run((t) => {
      const fps = FPS * this.speed, f = Math.max(0, Math.min(n - 1, Math.floor((t - this.t0) * fps))), u = Math.max(0, Math.min(n - 1, (t - this.t0) * fps)), k = Math.floor(u), r = u - k;
      const p0 = this.path[k], p1 = this.path[Math.min(n - 1, k + 1)], s = p0[0] + (p1[0] - p0[0]) * r, z = p0[1] + (p1[1] - p0[1]) * r;
      this.jf = f; this.pos = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s - z * h];
      this.jumpS = s;
      if (f >= n - 1) { this.at = j; this.pos = b; return true; }
      return false;
    });
  }
  // arrive à la nage depuis la gauche et se pose sur la graduation i
  swimTo(spec, i) {
    this.spec = spec; this.a.show(true); const b = this.seat(i), a = [-120, b[1] - 40];
    this.clip = "tortue.nage"; this.pos = a;
    return this.run((t) => { const u = Math.min(1, ((t - this.t0) * this.speed) / 1.6), e = 1 - (1 - u) * (1 - u); this.pos = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - 10 * Math.sin(Math.PI * u)]; if (u >= 1) { this.at = i; this.pos = b; return true; } return false; });
  }
}
// hauteur d'un arc de saut, la même que celle de la tortue (pour les arcs lumineux)
export const arcHeight = (d) => Math.min(70, 22 + d * 0.45);
export { lineY };
