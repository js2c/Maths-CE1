// L'HORLOGE DES ACTIVITÉS : le temps « actif », qui ne compte pas les pauses (bouton « maison » pendant la
// séance, docs/SPEC.md, « Navigation pendant la séance »).
//  - `wait(ms)` attend ms de temps actif : pendant une pause, l'attente est suspendue ;
//  - `now()` : le temps actif en ms (pour mesurer le temps de réponse, sans la pause) ;
//  - `pause()` / `resume()` : la séance s'arrête et repart exactement où elle en était (la voix fait de
//    même, voice.js) ;
//  - `abandon()` : l'activité en cours est quittée pour de bon (entraînement libre) : les attentes en
//    cours ne se terminent jamais, le déroulement abandonné reste figé là où il était et ne touche plus
//    à l'écran.
// Les enchaînements de la séance (écrans, leçons, récompense) attendent avec `wait` au lieu de setTimeout.
export class Clock {
  constructor(perf = () => performance.now()) { this.perf = perf; this.paused = false; this.pausedMs = 0; this.since = 0; this.held = []; this.epoch = 0; }
  now() { return this.perf() - this.pausedMs - (this.paused ? this.perf() - this.since : 0); }
  // ms passées en pause depuis le lancement (la pause en cours comprise)
  pausedTotal() { return this.pausedMs + (this.paused ? this.perf() - this.since : 0); }
  pause() { if (this.paused) return; this.paused = true; this.since = this.perf(); }
  resume() {
    if (!this.paused) return;
    this.pausedMs += this.perf() - this.since; this.paused = false;
    const h = this.held; this.held = []; h.forEach((f) => f());
  }
  // se résout quand l'activité n'est pas (ou plus) en pause ; jamais si elle a été abandonnée entre-temps
  gate() { const ep = this.epoch; return new Promise((res) => { const go = () => { if (ep === this.epoch) res(); }; if (this.paused) this.held.push(go); else go(); }); }
  wait(ms) {
    const ep = this.epoch, end = this.now() + ms;
    return new Promise((res) => {
      const tick = () => {
        if (ep !== this.epoch) return;
        if (this.paused) return void this.held.push(tick);
        const left = end - this.now();
        if (left <= 0) res(); else setTimeout(tick, left);
      };
      tick();
    });
  }
  abandon() { this.epoch++; this.held = []; if (this.paused) { this.pausedMs += this.perf() - this.since; this.paused = false; } }
}
export const clock = new Clock();
export const wait = (ms) => clock.wait(ms);
