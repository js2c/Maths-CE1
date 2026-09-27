// LE SON (lot 2, docs/SPEC-LOT2.md, section 6) : les bruitages et la musique de fond, fabriqués à l'avance
// par tools/son/ (app/assets/son/, index.json), mixés ici avec la Web Audio API.
//  - un seul AudioContext à 48 kHz (la fréquence des fichiers : la boucle de la musique se raccorde à
//    l'échantillon près), créé au premier toucher (`unlock`, règle de Chrome) ;
//  - bruitages : décodés une fois (quelques dizaines de ko), joués par `play(nom)` ;
//  - musique : une seule chargée et décodée à la fois (environ 58 Mo décodée), jouée en boucle ; fondu à
//    l'entrée et à la sortie ; environ 18 dB sous les bruitages ; baisse de 10 dB pendant que la voix parle
//    (`duck`, suivi de `voice.speaking`) ; encore plus bas pendant la pause (`pauseLevel`) ;
//  - réglages du parent : musique oui/non, son volume (doux, moyen, fort), bruitages oui/non (`setPrefs`) ;
//  - `suspend()` / `resume()` : l'espace parent coupe tout.
// Sans Web Audio (ou `?son=non` pour les tests), tout est silencieux et rien ne casse.

export const db = (x) => 10 ** (x / 20);
// le gain d'un bruitage (dB)
export const effectGainDb = (c, name) => (c.bruitages.gain ?? 0) + (c.bruitages.parBruitage?.[name] ?? 0);
// le gain de la musique (dB) : `musiqueSousBruitages` sous les bruitages, corrigé de la sonie des fichiers,
// plus le volume choisi par le parent
export function musicGainDb(c, volume = c.musique.volumeParDefaut) {
  const m = c.musique, sfx = m.sonieFichiers.bruitages + (c.bruitages.gain ?? 0);
  return sfx - m.musiqueSousBruitages - m.sonieFichiers.musique + (m.volumes[volume] ?? 0);
}
// la musique d'une séance : l'une des musiques, tirée au hasard (choix du parent, 27 septembre 2026)
export const pickMusic = (index, rnd) => { const k = Object.keys(index?.musiques ?? {}); return k.length ? k[Math.floor(rnd() * k.length) % k.length] : null; };
// les réglages du parent, avec leurs valeurs par défaut
export const soundPrefs = (s) => (s ??= {}, { musique: s.musique !== false, volume: s.volume ?? "moyen", bruitages: s.bruitages !== false });

export class Sound {
  constructor({ content, index, base = "assets/son/", off = false }) {
    this.c = content; this.index = index; this.base = base; this.off = off || !index || typeof AudioContext === "undefined";
    this.ctx = null; this.buffers = {}; this.prefs = soundPrefs(); this.music = null; this.ducked = false; this.paused = false; this.played = [];
  }
  // au premier toucher : le contexte audio, et le chargement des bruitages
  unlock() {
    if (this.off) return;
    if (!this.ctx) {
      try { this.ctx = new AudioContext({ sampleRate: this.c.frequenceEchantillonnage ?? 48000 }); } catch { this.ctx = new AudioContext(); }
      this.sfx = this.ctx.createGain(); this.sfx.connect(this.ctx.destination);
      this.bus = this.ctx.createGain(); this.bus.gain.value = 0; this.bus.connect(this.ctx.destination); // musique
      this.loading = Promise.all(Object.entries(this.index.bruitages).map(async ([k, e]) => { this.buffers[k] = await this.decode(e.fichier); }));
    }
    if (this.ctx.state === "suspended" && !this.held) this.ctx.resume().catch(() => {});
  }
  async decode(f) {
    try { return await this.ctx.decodeAudioData(await (await fetch(this.base + f)).arrayBuffer()); } catch { return null; }
  }
  setPrefs(p) { this.prefs = soundPrefs(p); this.level(); if (!this.prefs.musique) this.stopMusic(0.3); }
  // un bruitage (bonne, erreur, etoile, coquillage, carte, brillante, bouton, zone)
  play(name) {
    this.played.push(name);
    if (this.off || !this.ctx || !this.prefs.bruitages || this.held) return;
    const b = this.buffers[name]; if (!b) return;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = b; g.gain.value = db(effectGainDb(this.c, name)); s.connect(g).connect(this.sfx); s.start();
  }
  // le niveau de la musique : volume du parent, moins la baisse sous la voix, moins la baisse de la pause
  target() {
    const m = this.c.musique;
    if (!this.prefs.musique) return 0;
    return db(musicGainDb(this.c, this.prefs.volume) - (this.ducked ? m.baisseSousVoix : 0) - (this.paused ? m.baissePause : 0));
  }
  level(tau = this.c.musique.fonduBaisse / 3) {
    if (!this.ctx || !this.music) return;
    const t = this.ctx.currentTime; this.bus.gain.cancelScheduledValues(t); this.bus.gain.setTargetAtTime(this.target(), t, tau);
  }
  // la voix parle-t-elle ? (appelé à chaque image : ne fait rien si rien ne change)
  duck(on) { if (on === this.ducked) return; this.ducked = on; this.level(); }
  pauseLevel(on) { if (on === this.paused) return; this.paused = on; this.level(this.c.musique.fonduBaisse); }
  // la musique `key` en boucle, avec son fondu d'entrée ; une autre musique en cours s'arrête
  async startMusic(key) {
    if (this.off || !this.ctx || !key || !this.prefs.musique) return;
    if (this.music?.key === key) return;
    this.stopMusic(0.5);
    const me = { key, src: null }; this.music = me;
    const buf = await this.decode(this.index.musiques[key].fichier);
    if (this.music !== me || !buf) return;
    const s = this.ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.connect(this.bus); me.src = s;
    const t = this.ctx.currentTime, g = this.bus.gain;
    g.cancelScheduledValues(t); g.setValueAtTime(0, t); g.linearRampToValueAtTime(this.target(), t + this.c.musique.fonduEntree);
    s.start();
  }
  // fondu de sortie, puis la musique est libérée (sa mémoire aussi)
  stopMusic(fade = this.c.musique.fonduSortie) {
    const me = this.music; if (!me) return; this.music = null;
    if (!this.ctx || !me.src) return;
    const t = this.ctx.currentTime, g = this.bus.gain;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + fade);
    try { me.src.stop(t + fade + 0.05); } catch { /* déjà arrêtée */ }
    me.src.onended = () => me.src.disconnect();
  }
  get musicKey() { return this.music?.key ?? null; }
  // l'espace parent : tout se tait
  suspend() { this.held = true; this.ctx?.suspend().catch(() => {}); }
  resume() { this.held = false; this.ctx?.resume().catch(() => {}); }
}
