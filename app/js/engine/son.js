// LE SON (lot 2, docs/SPEC-LOT2.md, section 6) : les bruitages et la musique de fond, fabriqués à l'avance
// par tools/son/ (app/assets/son/, index.json), mixés ici avec la Web Audio API.
//  - un seul AudioContext à 48 kHz (la fréquence des fichiers : la boucle de la musique se raccorde à
//    l'échantillon près), créé au premier toucher (`unlock`, règle de Chrome) ;
//  - bruitages : décodés une fois (quelques dizaines de ko), joués par `play(nom)` ;
//  - musique : jouée en boucle, environ 18 dB sous les bruitages ; baisse de 10 dB pendant que la voix parle (`duck`, suivi de
//    `voice.speaking`) ; encore plus bas pendant la pause (`pauseLevel`) : ces niveaux sont ceux du bus de la musique ;
//  - (lot « Correctifs du 5 novembre », décision du parent du 5 novembre 2026) UNE MUSIQUE HORS SÉANCE ET LES ENCHAÎNEMENTS : chaque
//    musique a son propre gain sous le bus ; demander une autre musique (`startMusic`) la décode pendant que celle qui joue continue,
//    puis les enchaîne en fondu (`fonduEnchaine`, à puissance constante : l'une baisse pendant que l'autre monte, sans silence entre
//    les deux ni deux musiques à leur plein niveau en même temps) ; la même musique demandée de nouveau continue sans rien changer ;
//    une demande remplacée avant la fin de son décodage est oubliée ; la musique voulue est retenue (`voulue`) : quand le parent
//    rallume la musique, ou au premier toucher, c'est elle qui démarre. Au plus deux musiques décodées en même temps, le temps
//    d'un fondu (environ 58 Mo chacune) ;
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
    this.ctx = null; this.buffers = {}; this.prefs = soundPrefs(); this.music = null; this.joue = null; this.voulue = null; this.ducked = false; this.paused = false; this.played = [];
  }
  // au premier toucher : le contexte audio, et le chargement des bruitages ; la musique voulue démarre (lot « Correctifs du
  // 5 novembre » : la musique hors séance, demandée avant que le son soit permis)
  unlock() {
    if (this.off) return;
    if (!this.ctx) {
      try { this.ctx = new AudioContext({ sampleRate: this.c.frequenceEchantillonnage ?? 48000 }); } catch { this.ctx = new AudioContext(); }
      // (lot « Correctifs de l'installation et de la veille », point 2 : chaque changement d'état du contexte, pour le journal
      // technique : `onEtat(état)`)
      this.ctx.onstatechange = () => { try { this.onEtat?.(this.ctx.state); } catch { /* rien */ } };
      this.sfx = this.ctx.createGain(); this.sfx.connect(this.ctx.destination);
      this.bus = this.ctx.createGain(); this.bus.gain.value = this.target(); this.bus.connect(this.ctx.destination); // musique
      this.loading = Promise.all(Object.entries(this.index.bruitages).map(async ([k, e]) => { this.buffers[k] = await this.decode(e.fichier); }));
      if (this.voulue) this.startMusic(this.voulue);
    }
    // (point 2 : « interrupted », l'état d'un contexte coupé par le système, se reprend aussi)
    if ((this.ctx.state === "suspended" || this.ctx.state === "interrupted") && !this.held) this.ctx.resume().catch(() => {});
  }
  async decode(f) {
    try { return await this.ctx.decodeAudioData(await (await fetch(this.base + f)).arrayBuffer()); } catch { return null; }
  }
  // (la musique rallumée par le parent : la musique voulue reprend)
  setPrefs(p) { this.prefs = soundPrefs(p); this.level(); if (!this.prefs.musique) this.stopMusic(0.3, { oublier: false }); else if (this.voulue && !this.music) this.startMusic(this.voulue); }
  // un bruitage (bonne, erreur, etoile, coquillage, carte, brillante, bouton, zone)
  play(name) {
    this.played.push(name);
    if (this.off || !this.ctx || !this.prefs.bruitages || this.held) return;
    const b = this.buffers[name]; if (!b) return;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = b; g.gain.value = db(effectGainDb(this.c, name)); s.connect(g).connect(this.sfx); s.start();
  }
  // le niveau de la musique (celui du bus) : volume du parent, moins la baisse sous la voix, moins la baisse de la pause
  target() {
    const m = this.c.musique;
    if (!this.prefs.musique) return 0;
    return db(musicGainDb(this.c, this.prefs.volume) - (this.ducked ? m.baisseSousVoix : 0) - (this.paused ? m.baissePause : 0));
  }
  level(tau = this.c.musique.fonduBaisse / 3) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime; this.bus.gain.cancelScheduledValues(t); this.bus.gain.setTargetAtTime(this.target(), t, tau);
  }
  // la voix parle-t-elle ? (appelé à chaque image : ne fait rien si rien ne change)
  duck(on) { if (on === this.ducked) return; this.ducked = on; this.level(); }
  pauseLevel(on) { if (on === this.paused) return; this.paused = on; this.level(this.c.musique.fonduBaisse); }
  // le gain propre d'une musique, de sa valeur du moment à `v` en `d` secondes, en quart de sinus (montée : sin, descente : cos ;
  // deux musiques enchaînées gardent ainsi la même puissance totale)
  fondu(g, v, d) {
    const t = this.ctx.currentTime, p = g.gain, v0 = p.value, n = 32, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) { const u = i / (n - 1); curve[i] = v > v0 ? v0 + (v - v0) * Math.sin((u * Math.PI) / 2) : v + (v0 - v) * Math.cos((u * Math.PI) / 2); }
    // (un fondu en cours est arrêté là où il en est : `cancelAndHoldAtTime` ; la nouvelle courbe part un instant après, jamais par-dessus)
    if (p.cancelAndHoldAtTime) p.cancelAndHoldAtTime(t); else { p.cancelScheduledValues(t); p.setValueAtTime(v0, t); }
    if (d <= 0) { p.setValueAtTime(v, t + 0.01); return; }
    try { p.setValueCurveAtTime(curve, t + 0.01, d); } catch { p.linearRampToValueAtTime(v, t + 0.01 + d); }
  }
  // LA MUSIQUE `key`, en boucle. Rien ne change si c'est déjà elle ; sinon elle est décodée pendant que l'autre continue, puis elles
  // s'enchaînent en fondu (au tout début, la première monte seule, en `fonduEntree`)
  async startMusic(key) {
    if (!key) return;
    this.voulue = key;
    if (this.off || !this.ctx || !this.prefs.musique) return;
    if (this.music?.key === key) return;
    // (celle qui joue est redemandée pendant qu'une autre se décodait : elle reste, et remonte si elle avait commencé à baisser)
    if (this.joue?.key === key) { this.music = this.joue; this.fondu(this.joue.g, 1, this.c.musique.fonduEnchaine ?? 2); return; }
    const me = { key, src: null, g: null }; this.music = me;
    const buf = await this.decode(this.index.musiques[key].fichier);
    if (this.music !== me || !buf || !this.ctx) return;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain(); s.buffer = buf; s.loop = true; g.gain.value = 0;
    s.connect(g); g.connect(this.bus); me.src = s; me.g = g;
    const avant = this.joue, d = avant ? this.c.musique.fonduEnchaine ?? 2 : this.c.musique.fonduEntree;
    this.joue = me;
    s.start();
    this.fondu(g, 1, d);
    if (avant) this.arreter(avant, d);
  }
  // une musique qui s'efface en `d` secondes, puis est libérée (sa mémoire aussi)
  arreter(m, d) {
    if (!m?.src) return;
    this.fondu(m.g, 0, d);
    try { m.src.stop(this.ctx.currentTime + d + 0.05); } catch { /* déjà arrêtée */ }
    m.src.onended = () => { m.src.disconnect(); m.g.disconnect(); };
  }
  // fondu de sortie, puis la musique est libérée ; `oublier` : plus aucune musique voulue (sinon, le parent qui rallume la musique
  // la retrouve)
  stopMusic(fade = this.c.musique.fonduSortie, { oublier = true } = {}) {
    if (oublier) this.voulue = null;
    const m = this.joue; this.music = null; this.joue = null;
    if (!this.ctx || !m) return;
    this.arreter(m, fade);
  }
  get musicKey() { return this.music?.key ?? null; }
  // la musique qu'on entend (pas celle qui se décode encore)
  get musiqueJouee() { return this.joue?.key ?? null; }
  // l'espace parent : tout se tait
  suspend() { this.held = true; this.ctx?.suspend().catch(() => {}); }
  resume() { this.held = false; this.ctx?.resume().catch(() => {}); }
}
