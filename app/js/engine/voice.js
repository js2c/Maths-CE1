// LA VOIX. Chaque phrase est un fichier son fabriqué à l'avance (Chatterbox, tools/voix/fabriquer.mjs ;
// docs/SPEC.md, section 11, et docs/VOIX.md) ; la synthèse du navigateur (Web Speech API) ne sert plus que de
// secours, pour un texte dont une phrase n'a pas encore de fichier.
//  - une file de textes : chaque `say` attend la fin du précédent ;
//  - un texte est découpé en phrases (engine/phrases.js) ; si chacune a son fichier, les fichiers sont
//    joués l'un après l'autre, sinon tout le texte est lu par la synthèse (jamais deux voix mêlées) ;
//  - la fin d'un fichier est l'événement `ended`, ou sa durée (index) plus une marge ; la fin d'une
//    synthèse est `end`, ou un délai de secours calculé sur la longueur du texte (sur Android, `end`
//    n'arrive pas toujours) : le premier des deux gagne ;
//  - la voix ne peut démarrer qu'après un premier toucher (règle des navigateurs) : `unlock()` est
//    appelé dans ce premier toucher ;
//  - `replay()` redit la dernière consigne (bouton « réécouter », donc le même fichier) et compte les écoutes ;
//  - `misses` : les phrases dites sans fichier (vérifiées par les tests de parcours ; lot « Correctifs de la tablette » :
//    chacune est aussi signalée à `__voixManquee`, posé par le navigateur des parcours, tests/e2e/navigateur.mjs) ;
//  - `pause()` / `resume()` (bouton « maison ») : la phrase en cours s'arrête, ce qui suit attend ; à la
//    reprise, la phrase interrompue est redite depuis son début ; `abandon()` : tout ce qui était prévu est
//    oublié sans jamais se terminer (l'activité quittée reste figée, voir engine/clock.js) ;
//  - `suspend()` / `restore(s)` (lot 3, étape 5) : pendant une pause, une visite (récif, album, choisir, leçon) parle
//    avec une file neuve ; au retour, ce qu'elle disait est coupé et la séance retrouve sa voix en pause (la phrase
//    interrompue, la file qui attend, la consigne que « réécouter » redit) ;
//  - (lot « Mascotte ») deux crochets pour la mascotte et sa bulle : `onTalk(texte, ms, { instruction })` quand un texte
//    commence à être dit (ms : sa durée, celle des fichiers et des silences entre eux, ou la durée estimée de la synthèse ;
//    redit au début de la phrase reprise après une pause), `onSilence()` quand il s'arrête (fini, coupé, mis en pause,
//    abandonné ou mis de côté).
import { sentences } from "./phrases.js";

const GAP_MS = 140; // silence entre deux phrases d'un même texte

export class Voice {
  // `fast` : on n'attend qu'une fraction de la durée, sans rien jouer (tests automatiques)
  constructor({ rate = 0.9, fast = false, base = "assets/voix/" } = {}) {
    this.synth = typeof speechSynthesis !== "undefined" ? speechSynthesis : null;
    this.rate = rate; this.fast = fast; this.base = base; this.voice = null; this.unlocked = false; this.queue = Promise.resolve();
    this.instruction = null; this.listens = 0; this.speaking = false; this.gen = 0;
    this.index = null; this.misses = new Set(); this.files = 0; this.abort = null;
    this.paused = false; this.held = []; this.cur = null; this.epoch = 0; this.seq = 0; this.stack = [];
    this.onTalk = null; this.onSilence = null; this.talking = null;
    if (this.synth) { this.pick(); this.synth.addEventListener?.("voiceschanged", () => this.pick()); }
  }
  // l'index des fichiers (app/assets/voix/index.json) : { phrases: { phrase: [fichier, durée ms] } }
  setIndex(index) { this.index = index?.phrases ?? null; return this; }
  // une voix fr-FR, de préférence Google (la plus naturelle sur Android)
  pick() {
    const all = this.synth.getVoices(), fr = all.filter((v) => /^fr[-_]FR/i.test(v.lang)), anyFr = all.filter((v) => /^fr/i.test(v.lang));
    this.voice = fr.find((v) => /google/i.test(v.name)) ?? fr.find((v) => v.localService) ?? fr[0] ?? anyFr[0] ?? null;
  }
  unlock() {
    if (this.unlocked || !this.synth) { this.unlocked = true; return; }
    const u = new SpeechSynthesisUtterance(" "); u.volume = 0; this.synth.speak(u); this.unlocked = true;
  }
  // les fichiers d'un texte, dans l'ordre, ou null si une de ses phrases n'en a pas
  plan(text) {
    if (!this.index) return null;
    const parts = sentences(text).map((s) => { const e = this.index[s]; return e ? { s, src: this.base + e[0], ms: e[1] } : null; });
    return parts.length && parts.every(Boolean) ? parts : null;
  }
  speakNow(text, { instruction = false } = {}) {
    const parts = this.plan(text), talk = { text, instruction };
    if (parts) return this.playFiles(parts, talk);
    if (this.index) for (const s of sentences(text)) if (!this.index[s]) this.miss(s);
    return this.speakSynth(text, talk);
  }
  miss(s) { this.misses.add(s); try { globalThis.__voixManquee?.(s)?.catch?.(() => {}); } catch { /* (hors des tests) */ } }
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
        // fichier illisible (absent du cache, format refusé) : cette phrase est lue par la synthèse
        audio.onerror = () => { if (over) return; over = true; clearTimeout(timer); this.miss(p.s); this.speakSynth(p.s, null).then(() => { if (done) return; this.cur = me; this.speaking = true; timer = setTimeout(next, GAP_MS); }); };
        this.files++;
        audio.play().catch(() => {}); // lecture refusée (pas encore de toucher) : le délai de secours fait avancer
      };
      next();
    });
  }
  // durée de secours : environ 70 ms par caractère à débit 1, plus une marge
  fallbackMs(text) { return (900 + (text.length * 70) / this.rate) * (this.fast ? 0.12 : 1); }
  speakSynth(text, talk = null) {
    return new Promise((resolve) => {
      const ep = this.epoch, t = talk && { ...talk, ms: this.fallbackMs(text) }; let done = false, timer = 0, u = null;
      const finish = () => { if (!done) { done = true; this.speaking = false; this.cur = null; clearTimeout(timer); if (this.abort === finish) this.abort = null; this.quiet(t); if (ep === this.epoch) resolve(); } };
      const start = () => {
        timer = setTimeout(finish, this.fallbackMs(text));
        this.speaking = true;
        // (lot « Les voiliers ») `stop` (« passer », une réponse donnée pendant la phrase) arrête aussi une phrase de
        // synthèse : sans cela, son délai de secours courait jusqu'au bout (une phrase pas encore fabriquée)
        if (talk) this.abort = finish;
        if (!this.synth) return;
        u = new SpeechSynthesisUtterance(text);
        u.lang = "fr-FR"; u.rate = this.rate; if (this.voice) u.voice = this.voice;
        // une vraie fin de lecture libère aussitôt ; une erreur (pas de voix française, synthèse
        // indisponible) laisse courir le délai de secours : la phrase n'est pas dite, mais l'enfant garde
        // le temps de voir ce qu'elle accompagnait (la correction, par exemple)
        const mine = u; u.onend = () => { if (mine === u) finish(); }; u.onerror = () => {};
        this.synth.speak(u);
      };
      // en pause, la synthèse se tait ; à la reprise, le texte est redit depuis le début
      this.cur = { pause: () => { clearTimeout(timer); u = null; this.synth?.cancel(); this.quiet(t); }, resume: () => { if (!done) { this.talk(t); start(); } } };
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
  pause() { if (this.paused) return; this.paused = true; this.cur?.pause(); this.synth?.cancel(); }
  resume() { if (!this.paused) return; this.paused = false; this.cur?.resume(); const h = this.held; this.held = []; h.forEach((f) => f()); }
  // tout ce qui était prévu est oublié, sans jamais se terminer (engine/clock.js, `abandon`)
  abandon() { this.quiet(); this.epoch = ++this.seq; this.held = []; this.paused = false; const c = this.cur; this.cur = null; c?.pause(); this.abort = null; this.speaking = false; this.gen = ++this.seq; this.synth?.cancel(); this.queue = Promise.resolve(); }
  suspend() {
    this.quiet();
    const s = { queue: this.queue, held: this.held, paused: this.paused, cur: this.cur, abort: this.abort, speaking: this.speaking, instruction: this.instruction, listens: this.listens, gen: this.gen, epoch: this.epoch };
    this.stack.push(s);
    this.queue = Promise.resolve(); this.held = []; this.paused = false; this.cur = null; this.abort = null; this.speaking = false; this.gen = ++this.seq; this.epoch = ++this.seq;
    return s;
  }
  restore(s) { this.stack = this.stack.filter((x) => x !== s); this.epoch = ++this.seq; this.gen = ++this.seq; const c = this.cur; this.cur = null; c?.pause(); this.synth?.cancel(); Object.assign(this, s); }
  // coupe tout ce qui était prévu (changement d'écran, réponse donnée pendant la consigne)
  stop() { this.gen = ++this.seq; this.abort?.(); this.synth?.cancel(); this.queue = Promise.resolve(); }
  replay() { if (!this.instruction) return Promise.resolve(); this.stop(); this.listens++; return this.say(this.instruction); }
}
