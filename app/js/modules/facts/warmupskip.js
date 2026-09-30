// LOT 3 TER (docs/SPEC-LOT3TER.md, T1 ; décision du parent) : PASSER L'ÉCHAUFFEMENT, avec confirmation. Sans DOM ni
// horloge : testé par tests/unit/lot3ter.test.mjs ; l'écran (main.js) lui fournit ses crochets.
//  - le bouton dédié reste présent pendant tout l'échauffement (de la phrase d'introduction à la dernière question) ;
//  - un toucher bref met l'échauffement EN ATTENTE (`pause` : la voix s'arrête, le pavé se ferme, la question reste
//    affichée), la voix demande « Tu veux passer l'échauffement ? Touche la coche pour dire oui. » (`ask`), la coche
//    remplace le bouton ;
//  - un toucher sur la coche PASSE l'échauffement (`confirm`) ;
//  - sans toucher `attenteMs` après la question (content/seance.json, `passerEchauffement.attenteMs` : 5 000), la coche
//    disparaît, le bouton revient et l'échauffement REPREND (`resume` : la consigne de la question en cours est redite).
// États : « pret » (le bouton), « attente » (la coche), « passe » (fini), « fini » (l'échauffement est terminé).
export class WarmupSkip {
  constructor({ attenteMs = 5000, timer = { set: (f, ms) => setTimeout(f, ms), clear: (t) => clearTimeout(t) }, pause, ask, resume, confirm, showKey, showCheck }) {
    Object.assign(this, { attenteMs, timer, hooks: { pause, ask, resume, confirm, showKey, showCheck } });
    this.state = "pret"; this.t = null; this.turn = 0;
    showKey?.(true); showCheck?.(false);
  }
  get pending() { return this.state === "attente"; }
  // le bouton touché : l'échauffement en attente, la question de confirmation, puis le délai (compté après la question)
  tap() {
    if (this.state !== "pret") return false;
    const turn = ++this.turn, h = this.hooks;
    this.state = "attente"; h.pause?.(); h.showKey?.(false); h.showCheck?.(true);
    Promise.resolve(h.ask?.()).then(() => { if (this.state === "attente" && this.turn === turn) this.t = this.timer.set(() => this.timeout(turn), this.attenteMs); });
    return true;
  }
  // la coche touchée : l'échauffement est passé
  check() {
    if (this.state !== "attente") return false;
    this.timer.clear(this.t); this.t = null; this.state = "passe";
    this.hooks.showCheck?.(false); this.hooks.confirm?.();
    return true;
  }
  // pas de toucher dans le délai (ou la maison touchée pendant l'attente) : la coche s'en va, le bouton revient, l'échauffement reprend
  timeout(turn = this.turn) {
    if (this.state !== "attente" || turn !== this.turn) return false;
    this.timer.clear(this.t); this.t = null; this.state = "pret";
    this.hooks.showCheck?.(false); this.hooks.showKey?.(true); this.hooks.resume?.();
    return true;
  }
  // fin de l'échauffement (ou échauffement quitté) : plus de bouton ni de coche
  stop() { this.timer.clear(this.t); this.t = null; if (this.state !== "passe") this.state = "fini"; this.hooks.showKey?.(false); this.hooks.showCheck?.(false); }
}
