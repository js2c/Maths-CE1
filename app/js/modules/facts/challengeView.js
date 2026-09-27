// LE DÉFI RECORD À L'ÉCRAN (lot 2, étape 7). Le chronomètre est une grosse bulle de verre pleine d'eau qui se
// vide (atelier : sea/challenge.ts, « defi.bulle », DEFI_N niveaux d'eau fabriqués ; on montre l'image qui
// correspond au temps écoulé, sans chiffre de secondes), en bas à gauche, à la place du coquillage d'aide.
// Sous l'ardoise, une rangée de perles d'or : une par bonne réponse ; le drapeau rouge marque le record à battre
// (après la perle du record). Planche « defi », chargée le temps du défi (main.js).
import { spriteBox } from "../../engine/ui.js";
import { clock } from "../../engine/clock.js";

const TIMER = [215, 585], ROW = { x0: 470, x1: 1110, y: 410 }, GAP = 34;

export class ChallengeView {
  constructor(app) {
    this.app = app; this.f = 0; this.n = 0; this.rec = null; this.tick = null;
    const W = 190;
    this.timer = spriteBox(app, { x: TIMER[0] - W / 2, y: TIMER[1] - W / 2, w: W, h: W, cls: "hud defi-timer", still: true, paint: (ctx) => app.sprites.draw(ctx, "defi.bulle", this.f, W / 2, W / 2) });
    this.row = spriteBox(app, { x: ROW.x0 - 30, y: ROW.y - 80, w: ROW.x1 - ROW.x0 + 60, h: 110, cls: "hud defi-row", still: true, paint: (ctx) => this.paintRow(ctx) });
    this.show(false);
  }
  get frames() { return this.app.sprites.atlas.sprites["defi.bulle"]?.frames ?? 30; }
  show(v, { record = null } = {}) {
    if (v) { this.rec = record; this.n = 0; this.f = 0; this.row.repaint(); this.timer.repaint(); }
    for (const e of [this.timer, this.row]) e.style.visibility = v ? "visible" : "hidden";
  }
  remove() { this.stop(); this.timer.remove(); this.row.remove(); }
  // l'eau baisse : l'image suit le temps écoulé (horloge active : la pause l'arrêterait)
  start(t0, dur) {
    const N = this.frames;
    this.tick = () => { const f = Math.min(N - 1, Math.floor(((clock.now() - t0) / dur) * (N - 1))); if (f !== this.f) { this.f = f; this.timer.repaint(); } };
    this.app.stage.ticks.add(this.tick);
  }
  stop() { if (this.tick) this.app.stage.ticks.delete(this.tick); this.tick = null; this.f = this.frames - 1; this.timer.repaint(); }
  // une bonne réponse de plus : une perle
  pearl(n) { this.n = n; this.row.repaint(); }
  // un nouveau record : le drapeau passe après la dernière perle
  record(n) { this.rec = n; this.row.repaint(); }
  // x de la perle i (0…) : les perles se serrent s'il y en a beaucoup
  slots() { const count = Math.max(this.n, (this.rec ?? 0) + 1, 1), gap = Math.min(GAP, (ROW.x1 - ROW.x0) / count); return (i) => 30 + gap * (i + 0.5); }
  paintRow(ctx) {
    const { sprites } = this.app, x = this.slots(), gap = x(1) - x(0), y = 80;
    for (let i = 0; i < this.n; i++) sprites.draw(ctx, "defi.perle", 0, x(i), y);
    if (this.rec) sprites.draw(ctx, "defi.record", 0, x(this.rec - 1) + gap / 2, y + 18);
  }
}
