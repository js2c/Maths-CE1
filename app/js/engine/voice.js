// LA VOIX. Synthèse vocale du navigateur (Web Speech API), voix française, un peu ralentie.
//  - une file de phrases : chaque `say` attend la fin de la précédente ;
//  - la fin d'une phrase est l'événement `end`, OU un délai de secours calculé sur la longueur du
//    texte (sur Android, `end` n'arrive pas toujours) : le premier des deux gagne ; une erreur de
//    synthèse attend le délai de secours ;
//  - la voix ne peut démarrer qu'après un premier toucher (règle des navigateurs) : `unlock()` est
//    appelé dans ce premier toucher ;
//  - `replay()` relit la dernière consigne (bouton « réécouter ») et compte les écoutes.
export class Voice {
  // `fast` : délai de secours raccourci (tests automatiques, où aucune voix n'est installée)
  constructor({ rate = 0.9, fast = false } = {}) {
    this.synth = typeof speechSynthesis !== "undefined" ? speechSynthesis : null;
    this.rate = rate; this.fast = fast; this.voice = null; this.unlocked = false; this.queue = Promise.resolve();
    this.instruction = null; this.listens = 0; this.speaking = false; this.gen = 0;
    if (this.synth) { this.pick(); this.synth.addEventListener?.("voiceschanged", () => this.pick()); }
  }
  // une voix fr-FR, de préférence Google (la plus naturelle sur Android)
  pick() {
    const all = this.synth.getVoices(), fr = all.filter((v) => /^fr[-_]FR/i.test(v.lang)), anyFr = all.filter((v) => /^fr/i.test(v.lang));
    this.voice = fr.find((v) => /google/i.test(v.name)) ?? fr.find((v) => v.localService) ?? fr[0] ?? anyFr[0] ?? null;
  }
  unlock() {
    if (this.unlocked || !this.synth) { this.unlocked = true; return; }
    const u = new SpeechSynthesisUtterance(" "); u.volume = 0; this.synth.speak(u); this.unlocked = true;
  }
  // durée de secours : environ 70 ms par caractère à débit 1, plus une marge
  fallbackMs(text) { return (900 + (text.length * 70) / this.rate) * (this.fast ? 0.12 : 1); }
  speakNow(text) {
    return new Promise((resolve) => {
      let done = false; const finish = () => { if (!done) { done = true; this.speaking = false; clearTimeout(timer); resolve(); } };
      const timer = setTimeout(finish, this.fallbackMs(text));
      this.speaking = true;
      if (!this.synth) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "fr-FR"; u.rate = this.rate; if (this.voice) u.voice = this.voice;
      // une vraie fin de lecture libère aussitôt ; une erreur (pas de voix française, synthèse
      // indisponible) laisse courir le délai de secours : la phrase n'est pas dite, mais l'enfant garde
      // le temps de voir ce qu'elle accompagnait (la correction, par exemple)
      u.onend = finish; u.onerror = () => {};
      this.synth.speak(u);
    });
  }
  // met une phrase dans la file ; `instruction: true` en fait la consigne que « réécouter » relira
  say(text, { instruction = false } = {}) {
    if (instruction) { this.instruction = text; this.listens = 1; }
    const gen = this.gen;
    this.queue = this.queue.then(() => (gen === this.gen ? this.speakNow(text) : null));
    return this.queue;
  }
  // coupe tout ce qui était prévu (changement d'écran, réponse donnée pendant la consigne)
  stop() { this.gen++; this.synth?.cancel(); this.queue = Promise.resolve(); }
  replay() { if (!this.instruction) return Promise.resolve(); this.stop(); this.listens++; return this.say(this.instruction); }
}
