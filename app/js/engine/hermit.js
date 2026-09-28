// LE BERNARD-L'ERMITE EN DIRECT (lot 2, guide du module 2) : trois acteurs (actor.js) qui jouent ce que
// l'atelier a fabriqué (art/src/canvas-core/sea/hermit.ts, planche « ermite ») : la coquille posée à côté
// (pendant « changer »), la coquille portée (une image fixe, décalée et un peu tournée par le compositeur),
// le corps (une image par pose). `meta.comp` de chaque geste dit, image par image, quelle coquille il porte,
// où elle est et comment elle penche. Gestes : repos (boucle), sortir, montrer (boucle intérieure `hold`
// tant qu'on le demande), rejouir, changer (à la fin, il est dans la nouvelle coquille, `meta.to`).
// La planche doit être chargée (`sprites.load("ermite")`) ; `remove()` range tout.
import { clock } from "./clock.js";

const CLIPS = ["repos", "sortir", "montrer", "rejouir", "changer"];

export class Hermit {
  constructor(ocean, { x = 200, y = 700, scale = 1 } = {}) {
    this.o = ocean; this.sp = ocean.sp; this.x = x; this.y = y; this.s = scale; this.shell = 0;
    const names = CLIPS.map((c) => `ermite.${c}`);
    this.other = ocean.spriteActor(ocean.frontEl, "ermite.coquille.0", ["ermite.coquille.1"]);
    this.carried = ocean.spriteActor(ocean.frontEl, "ermite.coquille.0", ["ermite.coquille.1"]);
    this.body = ocean.spriteActor(ocean.frontEl, names[0], names.slice(1));
    this.all = [this.other, this.carried, this.body]; this.all.forEach((a) => a.show(false));
    this.clip = "repos"; this.t0 = null; this.done = null; this.holdUntil = 0; this.visible = false;
    this.tickFn = (t) => this.tick(t); ocean.front.push(this.tickFn);
  }
  meta(c) { return this.sp.atlas.sprites[`ermite.${c}`].meta; }
  frames(c) { return this.sp.atlas.sprites[`ermite.${c}`].frames; }
  fps(c) { return this.sp.atlas.sprites[`ermite.${c}`].fps || 8; }
  show(v = true) { this.visible = v; if (!v) this.all.forEach((a) => a.show(false)); }
  at(x, y, scale = this.s) { if (this.left != null) this.left += x - this.x; this.x = x; this.y = y; this.s = scale; }
  // joue un geste ; la promesse se résout à sa fin (`hold` : ms pendant lesquelles « montrer » reste tendu)
  play(clip, { hold = 0 } = {}) {
    this.done?.(); this.clip = clip; this.t0 = null; this.holdUntil = hold;
    const g = clock.hold(); return new Promise((res) => { this.done = res; }).then(g);
  }
  // l'image du geste au temps `el` (s) ; null quand il est fini. Avec `hold` [a, b) : l'entrée (0 à a), la
  // boucle intérieure tant que dure le temps demandé (au moins un tour), puis la sortie (b à la fin)
  frameAt(c, el) {
    const n = this.frames(c), m = this.meta(c), fps = this.fps(c);
    if (m.loop) return Math.floor(el * fps) % n;
    const h = m.hold;
    if (!h) { const f = Math.floor(el * fps); return f < n ? f : null; }
    const tIn = h[0] / fps, tHold = Math.max((h[1] - h[0]) / fps, this.holdUntil / 1000);
    if (el < tIn) return Math.floor(el * fps);
    if (el < tIn + tHold) return h[0] + (Math.floor((el - tIn) * fps) % (h[1] - h[0]));
    const f = h[1] + Math.floor((el - tIn - tHold) * fps); return f < n ? f : null;
  }
  tick(t) {
    if (!this.visible) return;
    if (this.t0 === null) this.t0 = t;
    let c = this.clip, f = this.frameAt(c, t - this.t0);
    if (f === null) {
      // fin du geste : retour au repos (après « changer », dans la nouvelle coquille ; l'ancienne reste posée)
      if (c === "changer") { this.left = this.x; this.x += this.meta(c).to[0] * this.s; this.shell = 1; }
      const r = this.done; this.done = null; this.clip = c = "repos"; this.t0 = t; f = 0; r?.();
    }
    const m = this.meta(c), comp = m.comp[f], s = this.s, sh = c === "changer" ? comp[0] : this.shell;
    this.body.show(true); this.body.draw(f, `ermite.${c}`); this.body.moveTo(this.x, this.y, s);
    this.carried.show(true); this.carried.draw(0, `ermite.coquille.${sh}`); this.carried.moveTo(this.x + comp[1] * s, this.y + comp[2] * s, s, 1, comp[3]);
    // la coquille posée : l'autre pendant « changer », l'ancienne ensuite
    if (c === "changer") { this.other.show(true); this.other.draw(0, `ermite.coquille.${comp[4]}`); this.other.moveTo(this.x + comp[5] * s, this.y, s); }
    else if (this.left != null) { this.other.show(true); this.other.draw(0, "ermite.coquille.0"); this.other.moveTo(this.left, this.y, s); }
    else this.other.show(false);
  }
  remove() {
    this.done?.(); this.done = null;
    const o = this.o; o.front.splice(o.front.indexOf(this.tickFn), 1);
    for (const a of this.all) { a.remove(); o.actors.splice(o.actors.indexOf(a), 1); }
  }
}
