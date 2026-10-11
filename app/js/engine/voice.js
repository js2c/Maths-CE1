// LA VOIX. Chaque phrase est un fichier son fabriqué à l'avance (Chatterbox, la voix du parent, tools/voix/publier.mjs ;
// docs/SPEC.md, section 11, et docs/VOIX.md).
//  - une file de textes : chaque `say` attend la fin du précédent ;
//  - un texte est découpé en phrases (engine/phrases.js) ; chacune a son fichier, joué l'un après l'autre ;
//  - (lot « Correctifs : passage de l'échauffement aux voiliers », point 12 ; demande du parent du 10 octobre 2026) PLUS DE
//    SYNTHÈSE DU NAVIGATEUR : une phrase sans fichier lisible n'est plus dite par une autre voix. La bulle de la mascotte
//    l'écrit le temps qu'elle aurait duré (sa durée dans l'index, ou une durée estimée sur la longueur du texte), et
//    l'incident est noté (`onManque(phrase, cause)` : « absente de l'index » ou « fichier illisible » ; main.js le range
//    pour l'espace parent, « Phrases sans voix ») ;
//  - la fin d'un fichier est l'événement `ended`, ou sa durée (index) plus une marge : le premier des deux gagne ;
//  - la voix ne peut démarrer qu'après un premier toucher (règle des navigateurs) : `unlock()` est appelé dans ce premier
//    toucher (celui de l'écran de démarrage) ;
//  - `replay()` redit la dernière consigne (la mascotte touchée, donc le même fichier) et compte les écoutes ;
//  - `misses` : les phrases sans fichier lisible (vérifiées par les tests de parcours ; lot « Correctifs de la tablette » :
//    chacune est aussi signalée à `__voixManquee`, posé par le navigateur des parcours, tests/e2e/navigateur.mjs) ;
//  - `pause()` / `resume()` (bouton « maison ») : la phrase en cours s'arrête, ce qui suit attend ; à la
//    reprise, la phrase interrompue est redite depuis son début ; `abandon()` : tout ce qui était prévu est
//    oublié sans jamais se terminer (l'activité quittée reste figée, voir engine/clock.js) ;
//  - `suspend()` / `restore(s)` (lot 3, étape 5) : pendant une pause, une visite (récif, album, choisir, leçon) parle
//    avec une file neuve ; au retour, ce qu'elle disait est coupé et la séance retrouve sa voix en pause (la phrase
//    interrompue, la file qui attend, la consigne que « réécouter » redit) ;
//  - (lot « Mascotte ») deux crochets pour la mascotte et sa bulle : `onTalk(texte, ms, { instruction })` quand un texte
//    commence à être dit (ms : sa durée, celle des fichiers et des silences entre eux, ou la durée estimée d'une phrase sans
//    fichier ; redit au début de la phrase reprise après une pause), `onSilence()` quand il s'arrête (fini, coupé, mis en pause,
//    abandonné ou mis de côté).
import { sentences } from "./phrases.js";

const GAP_MS = 140; // silence entre deux phrases d'un même texte

export class Voice {
  // `fast` : on n'attend qu'une fraction de la durée, sans rien jouer (tests automatiques)
  // (`rate` : le débit de la voix du parent, environ 0,9 : il ne sert plus qu'à estimer la durée d'une phrase sans fichier)
  constructor({ rate = 0.9, fast = false, base = "assets/voix/" } = {}) {
    this.rate = rate; this.fast = fast; this.base = base; this.unlocked = false; this.queue = Promise.resolve();
    this.instruction = null; this.listens = 0; this.speaking = false; this.gen = 0;
    this.index = null; this.misses = new Set(); this.files = 0; this.abort = null;
    this.paused = false; this.held = []; this.cur = null; this.epoch = 0; this.seq = 0; this.stack = [];
    this.onTalk = null; this.onSilence = null; this.onManque = null; this.talking = null;
  }
  // l'index des fichiers (app/assets/voix/index.json) : { phrases: { phrase: [fichier, durée ms] } }
  setIndex(index) { this.index = index?.phrases ?? null; return this; }
  // le premier toucher : les fichiers peuvent être joués (règle des navigateurs)
  unlock() { this.unlocked = true; }
  // les fichiers d'un texte, dans l'ordre, ou null si une de ses phrases n'en a pas
  plan(text) {
    if (!this.index) return null;
    const parts = sentences(text).map((s) => { const e = this.index[s]; return e ? { s, src: this.base + e[0], ms: e[1] } : null; });
    return parts.length && parts.every(Boolean) ? parts : null;
  }
  speakNow(text, { instruction = false } = {}) {
    const parts = this.plan(text), talk = { text, instruction };
    if (parts) return this.playFiles(parts, talk);
    for (const s of sentences(text)) if (!this.index?.[s]) this.miss(s, "absente de l'index");
    return this.sansVoix(text, talk);
  }
  // une phrase sans fichier lisible : notée (les parcours de test, l'espace parent), jamais dite par une autre voix
  miss(s, cause = "absente de l'index") {
    this.misses.add(s);
    try { globalThis.__voixManquee?.(s)?.catch?.(() => {}); } catch { /* (hors des tests) */ }
    try { this.onManque?.(s, cause); } catch (e) { console.warn(e); }
  }
  // (lot « Mascotte ») un texte commence (ou recommence après une pause) ; il s'arrête
  talk(t) { if (!t) return; this.talking = t; try { this.onTalk?.(t.text, t.ms, { instruction: t.instruction }); } catch (e) { console.warn(e); } }
  quiet(t) { if (!this.talking || (t && this.talking !== t)) return; this.talking = null; try { this.onSilence?.(); } catch (e) { console.warn(e); } }
  playFiles(parts, talk = null) {
    return new Promise((resolve) => {
      const gen = this.gen, ep = this.epoch; let i = 0, timer = 0, done = false, audio = null, rearm = null;
      const total = parts.reduce((t, p) => t + p.ms, 0) + GAP_MS * (parts.length - 1), t = talk && { ...talk, ms: total * (this.fast ? 0.12 : 1) };
      const finish = () => { if (done) return; done = true; clearTimeout(timer); audio?.pause(); this.speaking = false; this.abort = null; this.cur = null; this.quiet(t); if (ep === this.epoch) resolve(); };
      this.abort = finish; this.speaking = true;
      // en pause : la phrase en cours s'arrête ; à la reprise, elle repart de son début (le texte entier pour la mascotte)
      const me = { pause: () => { clearTimeout(timer); audio?.pause(); this.quiet(t); }, resume: () => { this.talk(t); rearm?.(); } }; this.cur = me;
      this.talk(t);
      if (this.fast) { const ms = parts.reduce((t, p) => t + p.ms, 0) * 0.12; rearm = () => { clearTimeout(timer); timer = setTimeout(finish, ms); }; rearm(); return; }
      // les fichiers du texte se chargent tous dès le début : pas d'attente entre deux phrases
      const els = parts.map((p) => { const a = new Audio(p.src); a.preload = "auto"; return a; });
      const next = () => {
        if (done || gen !== this.gen) return finish();
        if (i >= parts.length) return finish();
        const p = parts[i]; audio = els[i++]; let over = false;
        const go = () => { if (over) return; over = true; clearTimeout(timer); timer = setTimeout(next, i < parts.length ? GAP_MS : 0); };
        rearm = () => { if (over) { timer = setTimeout(next, GAP_MS); return; } clearTimeout(timer); timer = setTimeout(go, p.ms + 1500); audio.currentTime = 0; audio.play().catch(() => {}); };
        timer = setTimeout(go, p.ms + 1500); // secours : `ended` n'est pas arrivé
        audio.onended = go;
        // fichier illisible (absent du cache, format refusé) : la phrase n'est pas dite (plus de synthèse : point 12) ; la bulle
        // l'écrit le temps qu'elle aurait duré (sa durée dans l'index), puis la suite
        audio.onerror = () => { if (over) return; this.miss(p.s, "fichier illisible"); clearTimeout(timer); timer = setTimeout(go, p.ms * (this.fast ? 0.12 : 1)); };
        this.files++;
        audio.play().catch(() => {}); // lecture refusée (pas encore de toucher) : le délai de secours fait avancer
      };
      next();
    });
  }
  // la durée estimée d'une phrase sans fichier : environ 70 ms par caractère à débit 1, plus une marge
  fallbackMs(text) { return (900 + (text.length * 70) / this.rate) * (this.fast ? 0.12 : 1); }
  // un texte dont une phrase n'a pas de fichier : rien n'est dit ; la mascotte et sa bulle « parlent » le temps estimé (la bulle
  // l'écrit), puis la suite (point 12 : avant, la synthèse du navigateur le lisait, une autre voix)
  sansVoix(text, talk = null) {
    return new Promise((resolve) => {
      const ep = this.epoch, t = talk && { ...talk, ms: this.fallbackMs(text) }; let done = false, timer = 0;
      const finish = () => { if (!done) { done = true; this.speaking = false; this.cur = null; clearTimeout(timer); if (this.abort === finish) this.abort = null; this.quiet(t); if (ep === this.epoch) resolve(); } };
      const start = () => { timer = setTimeout(finish, this.fallbackMs(text)); this.speaking = true; if (talk) this.abort = finish; };
      // en pause, elle s'arrête ; à la reprise, le texte est « redit » depuis le début
      this.cur = { pause: () => { clearTimeout(timer); this.quiet(t); }, resume: () => { if (!done) { this.talk(t); start(); } } };
      this.talk(t); start();
    });
  }
  // met un texte dans la file ; `instruction: true` en fait la consigne que « réécouter » redira
  say(text, { instruction = false } = {}) {
    if (instruction) { this.instruction = text; this.listens = 1; }
    const gen = this.gen, ep = this.epoch;
    this.queue = this.queue.then(() => this.hold(ep)).then(() => (gen === this.gen ? this.speakNow(text, { instruction }) : null));
    return this.queue;
  }
  // attend la fin d'une pause ; jamais si l'activité a été abandonnée
  // (lot 3, étape 5 : un texte d'une activité mise de côté, qui arrive à son tour pendant une visite, attend avec elle)
  hold(ep) { return new Promise((res) => { const go = () => { if (ep !== this.epoch) { this.stack.find((x) => x.epoch === ep)?.held.push(go); return; } if (this.paused) this.held.push(go); else res(); }; go(); }); }
  pause() { if (this.paused) return; this.paused = true; this.cur?.pause(); }
  resume() { if (!this.paused) return; this.paused = false; this.cur?.resume(); const h = this.held; this.held = []; h.forEach((f) => f()); }
  // tout ce qui était prévu est oublié, sans jamais se terminer (engine/clock.js, `abandon`)
  abandon() { this.quiet(); this.epoch = ++this.seq; this.held = []; this.paused = false; const c = this.cur; this.cur = null; c?.pause(); this.abort = null; this.speaking = false; this.gen = ++this.seq; this.queue = Promise.resolve(); }
  suspend() {
    this.quiet();
    const s = { queue: this.queue, held: this.held, paused: this.paused, cur: this.cur, abort: this.abort, speaking: this.speaking, instruction: this.instruction, listens: this.listens, gen: this.gen, epoch: this.epoch };
    this.stack.push(s);
    this.queue = Promise.resolve(); this.held = []; this.paused = false; this.cur = null; this.abort = null; this.speaking = false; this.gen = ++this.seq; this.epoch = ++this.seq;
    return s;
  }
  restore(s) { this.stack = this.stack.filter((x) => x !== s); this.epoch = ++this.seq; this.gen = ++this.seq; const c = this.cur; this.cur = null; c?.pause(); Object.assign(this, s); }
  // coupe tout ce qui était prévu (changement d'écran, réponse donnée pendant la consigne)
  stop() { this.gen = ++this.seq; this.abort?.(); this.queue = Promise.resolve(); }
  replay() { if (!this.instruction) return Promise.resolve(); this.stop(); this.listens++; return this.say(this.instruction); }
}
