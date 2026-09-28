// L'HORLOGE DES ACTIVITÉS : le temps « actif », qui ne compte pas les pauses (bouton « maison » pendant la
// séance, docs/SPEC.md, « Navigation pendant la séance »).
//  - `wait(ms)` attend ms de temps actif : pendant une pause, l'attente est suspendue ;
//  - `now()` : le temps actif en ms (pour mesurer le temps de réponse, sans la pause) ;
//  - `pause()` / `resume()` : la séance s'arrête et repart exactement où elle en était (la voix fait de
//    même, voice.js) ;
//  - `abandon()` : l'activité en cours est quittée pour de bon (entraînement libre) : les attentes en
//    cours ne se terminent jamais, le déroulement abandonné reste figé là où il était et ne touche plus
//    à l'écran ;
//  - `suspend()` / `restore(s)` (lot 3, étape 5 : l'accueil complet pendant une pause) : la séance en pause est mise de
//    côté telle quelle (pause en cours, attentes suspendues) ; une visite (récif, album, écran « choisir », leçon seule)
//    a son propre temps, qui avance ; au retour, la visite est abandonnée et la séance retrouve sa pause : le temps de la
//    visite compte comme du temps de pause. Chaque activité a un numéro unique (`seq`) : une attente abandonnée ne se
//    réveille jamais.
// Les enchaînements de la séance (écrans, leçons, récompense) attendent avec `wait` au lieu de setTimeout.
export class Clock {
  constructor(perf = () => performance.now()) { this.perf = perf; this.paused = false; this.pausedMs = 0; this.since = 0; this.held = []; this.epoch = 0; this.seq = 0; this.stack = []; }
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
  // une attente d'une activité mise de côté (suspend) qui se réveille pendant la visite : rangée avec cette activité, elle
  // repartira à sa reprise ; celle d'une activité abandonnée ne se réveille jamais
  park(ep, f) { const s = this.stack.find((x) => x.epoch === ep); if (s) s.held.push(f); }
  // une porte liée à l'activité qui la demande (lot 3, étape 5) : `promesse.then(clock.hold())` ne continue que quand cette
  // activité est là et n'est pas en pause. Pour ce qui avance sans l'horloge (un saut de la tortue, une animation
  // requestAnimationFrame, un geste, un chargement) : sans elle, une séance en pause pouvait reprendre pendant une visite
  // (et prendre alors l'horloge de la visite).
  hold() { const ep = this.epoch; return (v) => new Promise((res) => { const go = () => { if (ep !== this.epoch) return this.park(ep, go); if (this.paused) return void this.held.push(go); res(v); }; go(); }); }
  gate() { const ep = this.epoch; return new Promise((res) => { const go = () => { if (ep !== this.epoch) return this.park(ep, go); res(); }; if (this.paused) this.held.push(go); else go(); }); }
  wait(ms) {
    const ep = this.epoch, end = this.now() + ms;
    return new Promise((res) => {
      const tick = () => {
        if (ep !== this.epoch) return this.park(ep, tick);
        if (this.paused) return void this.held.push(tick);
        const left = end - this.now();
        if (left <= 0) res(); else setTimeout(tick, left);
      };
      tick();
    });
  }
  suspend() { const s = { paused: this.paused, since: this.since, held: this.held, epoch: this.epoch, pausedMs: this.pausedMs }; this.stack.push(s); this.held = []; this.paused = false; this.epoch = ++this.seq; return s; }
  restore(s) { this.stack = this.stack.filter((x) => x !== s); Object.assign(this, s); }
  abandon() { this.epoch = ++this.seq; this.held = []; if (this.paused) { this.pausedMs += this.perf() - this.since; this.paused = false; } }
}
export const clock = new Clock();
export const wait = (ms) => clock.wait(ms);
