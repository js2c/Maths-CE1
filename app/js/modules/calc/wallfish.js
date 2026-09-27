// LE PETIT POISSON JAUNE DU MUR DE CORAIL (lot 3, module 3) : un acteur du premier plan (sprites « mur.poisson.d|g » de
// l'atelier, planche « calcul »), sa queue bat à 12 images/s ; il se pose sur une case du mur (ou une graduation de la
// ligne) et nage d'un point à un autre (descendre d'une rangée = + 10, glisser d'une case = ± 1). Le déplacement est
// une transformation CSS (le compositeur) ; il se tourne vers où il va.
import { wait } from "../../engine/clock.js";

export class WallFish {
  constructor(app) {
    this.app = app; const { ocean, stage } = app;
    this.a = ocean.spriteActor(ocean.frontEl, "mur.poisson.d", ["mur.poisson.g"]); this.dir = "d"; this.x = 0; this.y = 0; this.t0 = performance.now();
    this.tick = () => { const f = Math.floor(((performance.now() - this.t0) / 1000) * 12) % 12; this.a.draw(f, `mur.poisson.${this.dir}`); };
    stage.ticks.add(this.tick); this.a.show(false);
  }
  at(x, y) { this.x = x; this.y = y; this.a.moveTo(x, y); this.a.show(true); }
  // nage jusqu'à (x, y) en `ms` (temps actif : la pause l'arrête), en courbe douce ; `stop()` : arrêter en route
  async swim(x, y, ms = 650, stop = () => false) {
    const x0 = this.x, y0 = this.y; if (x !== x0) this.dir = x > x0 ? "d" : "g";
    const n = Math.max(6, Math.round(ms / 40));
    for (let i = 1; i <= n && !stop(); i++) { const t = i / n, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; this.at(x0 + (x - x0) * e, y0 + (y - y0) * e - Math.sin(Math.PI * t) * (x === x0 ? 0 : 10)); await wait(ms / n); }
    this.at(x, y);
  }
  remove() { this.app.stage.ticks.delete(this.tick); this.a.remove(); const L = this.app.ocean.actors, i = L.indexOf(this.a); if (i >= 0) L.splice(i, 1); }
}
