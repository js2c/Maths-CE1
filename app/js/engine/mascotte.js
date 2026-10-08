// LA MASCOTTE, LE CAPITAINE (lot « Mascotte », docs/SPEC.md, section 11 ; maquette validée : art/mascotte/, son README.md).
// Une tête dessinée, en vidéo (17 clips WebM, fond vert retiré par la carte graphique), qui remplace la pieuvre partout,
// à sa place, en haut à gauche sous la maison. Elle ne se déplace pas.
//
// Le moteur est celui de la maquette (art/mascotte/mascotte-moteur.js), repris TEL QUEL : même table de clips (raccords
// mesurés image par image), mêmes ambiances, mêmes règles de tirage, mêmes délais. tests/unit/mascotte.test.mjs vérifie que
// les tables sont identiques à celles de la maquette. Il garde l'interface de la pieuvre (play, hold, release) : les
// exercices n'ont pas changé. Seuls ses raccords avec l'application sont nouveaux, et marqués « RACCORD » :
//  - la voix : parole(texte, ms, {consigne}) et silence(), appelés par engine/voice.js (onTalk, onSilence) ;
//  - le toucher : activite(), à chaque toucher (comme dans la maquette) ;
//  - la pause (la maison) : suspendre(true|false) : la parole cesse, la surveillance d'inactivité s'arrête ;
//  - l'écran : afficher(true|false) (le récif vivant la cache, comme la pieuvre) ; seulement les WebM (le Chromium des
//    tests ne lit pas le H.264 ; Chrome pour Android lit le VP9) ;
//  - le mode accéléré des tests (`rapide`) : play() se résout tout de suite, la mascotte ne fait rien attendre ;
//  - l'allègement automatique (`niveau()`, celui de la scène) : au niveau 2, une image sur deux est envoyée à la carte
//    graphique (12 images/s au lieu de 24) ;
//  - le journal des raccords (`journal`) : gardé pour la recette (combien de fondus forcés).
// La bulle n'est pas gérée ici : engine/bulle.js.
export function creerMascotte({ canvas, base = "assets/mascotte/", journal = () => {}, statut = null, rapide = false, niveau = () => 0, progres = () => {} }) {
  const W = 450, H = 600;
  const T0 = performance.now();
  const now = () => (performance.now() - T0) / 1000;
  const vids = document.createElement("div");
  vids.setAttribute("aria-hidden", "true");
  vids.style.cssText = "position:fixed;left:0;bottom:0;width:2px;height:2px;overflow:hidden;opacity:.01;pointer-events:none";
  document.body.appendChild(vids);
  let pret = false, visible = true, suspendue = false;
  // 1. LES CLIPS — mesurés image par image sur les vidéos coupées.
  //    d : durée (s) ; n : moments où le visage entier est dans la pose de référence (raccord invisible) ;
  //    s : moments où la tête est dans la pose de référence et où seule la bouche diffère (fondu court = bouche qui se ferme).
  // ======================================================================================================
  const CLIPS = {
    'encourage':        { d: 5.292, n: [[0.208, 1.042], [5.208, 5.292]], s: [[0.167, 1.417]] },
    'idle-amuse':       { d: 2.25,  n: [[0.0, 0.083], [0.208, 0.958], [2.167, 2.25]], s: [[0.167, 1.875], [2.083, 2.25]] },
    'idle-approbation': { d: 2.0,   n: [[0.0, 0.083], [0.208, 0.375], [1.917, 2.0]], s: [[0.167, 0.417]] },
    'idle-clin-oeil':   { d: 2.125, n: [[0.0, 0.083], [2.0, 2.125]], s: [[1.875, 2.125]] },
    'idle-coup-oeil':   { d: 1.75,  n: [[0.292, 0.625], [1.625, 1.75]], s: [[0.208, 0.625]] },
    'idle-curiosite':   { d: 2.458, n: [[0.0, 0.083], [0.208, 0.833], [2.375, 2.458]], s: [[0.167, 0.833]] },
    'idle-hochement':   { d: 5.208, n: [[0.0, 0.083], [3.833, 4.833], [5.0, 5.208]], s: [[0.0, 0.167], [3.75, 4.875], [4.958, 5.208]] },
    'idle-immobile':    { d: 1.292, n: [[0.0, 0.083], [0.583, 0.792], [1.125, 1.292]], s: [[0.333, 0.833], [1.042, 1.292]] },
    'idle-reflexion':   { d: 1.625, n: [[0.0, 0.083], [1.458, 1.625]], s: [[1.375, 1.625]] },
    'idle-respiration': { d: 2.375, n: [[0.0, 0.292], [2.292, 2.375]], s: [[0.0, 0.958]] },
    'idle-sourcils':    { d: 2.792, n: [[0.292, 1.042], [2.625, 2.792]], s: [[0.208, 1.042], [2.375, 2.792]] },
    'idle-sourire':     { d: 1.583, n: [[0.0, 0.083], [1.458, 1.583]], s: [[1.333, 1.583]] },
    'idle-travail':     { d: 1.833, n: [[0.0, 0.125], [1.542, 1.833]], s: [[1.458, 1.833]] },
    'success':          { d: 8.708, n: [[0.0, 0.083], [8.417, 8.708]], s: [[1.792, 3.083], [3.625, 6.292], [8.375, 8.708]] },
    'talk-a':           { d: 7.125, n: [[0.0, 0.083], [6.958, 7.125]], s: [[1.417, 1.708], [1.875, 3.042], [4.333, 5.583], [5.792, 7.125]] },
    'talk-b':           { d: 7.875, n: [[7.75, 7.875]], s: [[0.0, 0.167]] },
    'wrong':            { d: 6.542, n: [[0.0, 0.125], [5.417, 6.0], [6.25, 6.542]], s: [[0.0, 0.583], [5.375, 6.042], [6.208, 6.542]] }
  };
  const inWin = (wins, t) => wins.some(([a, b]) => t >= a && t <= b - 0.04);

  // ======================================================================================================
  // 2. LE RENDU — détourage du fond vert par la carte graphique, deux textures pour le fondu entre deux clips.
  // ======================================================================================================
  const EXT = "webm"; // RACCORD : l'application ne livre que les WebM (VP9), lus par Chrome pour Android et par le Chromium des tests
  const videos = {};
  async function loadVideo(k) {
    const src = `${base}${k}.${EXT}`;
    let url = src;
    try { const r = await fetch(src); if (r.ok) url = URL.createObjectURL(await r.blob()); } catch (e) {}
    const v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.preload = "auto";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    v.addEventListener("ended", () => { if (L.cur && L.cur.video === v) L.ended(); });
    v.src = url; vids.appendChild(v);
    videos[k] = v;
    await new Promise(res => {
      if (v.readyState >= 2) return res();
      v.addEventListener("loadeddata", res, { once: true }); v.addEventListener("error", res, { once: true });
      setTimeout(res, 15000);
    });
  }
  const face = canvas;
  const R = makeGL(face) || make2D(face);
  function makeGL(cv) {
    const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return null;
    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, `attribute vec2 p; varying vec2 uv;
      void main() { uv = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }`));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 uv;
      uniform sampler2D a, b; uniform float t;
      vec4 key(vec4 c) {
        float m = max(c.r, c.b);
        float al = 1. - smoothstep(.098, .275, c.g - m);
        return vec4(vec3(c.r, min(c.g, m), c.b) * al, al);
      }
      void main() { gl_FragColor = mix(key(texture2D(a, uv)), key(texture2D(b, uv)), t); }`));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = [0, 1].map(i => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));
      return t;
    });
    const uA = gl.getUniformLocation(prog, "a"), uB = gl.getUniformLocation(prog, "b"), uT = gl.getUniformLocation(prog, "t");
    let curI = 0;
    return {
      kind: "WebGL",
      swap() { curI = 1 - curI; },
      upload(v) { gl.activeTexture(gl.TEXTURE0 + curI); gl.bindTexture(gl.TEXTURE_2D, tex[curI]);
                  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v); },
      draw(t) { gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
                gl.uniform1i(uA, 1 - curI); gl.uniform1i(uB, curI); gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
    };
  }
  function make2D(cv) {
    const ctx = cv.getContext("2d"), work = document.createElement("canvas"); work.width = W; work.height = H;
    const w = work.getContext("2d", { willReadFrequently: true });
    const frames = [document.createElement("canvas"), document.createElement("canvas")];
    frames.forEach(f => { f.width = W; f.height = H; });
    let curI = 0;
    return {
      kind: "2D",
      swap() { curI = 1 - curI; },
      upload(v) {
        w.drawImage(v, 0, 0, W, H); const img = w.getImageData(0, 0, W, H), d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2], m = r > b ? r : b, k = g - m;
          if (k > 25) { let x = (k - 25) / 45; if (x > 1) x = 1; d[i + 3] = 255 * (1 - x * x * (3 - 2 * x)); }
          if (g > m) d[i + 1] = m;
        }
        frames[curI].getContext("2d").putImageData(img, 0, 0);
      },
      draw(t) { ctx.clearRect(0, 0, W, H); ctx.globalAlpha = 1 - t; ctx.drawImage(frames[1 - curI], 0, 0);
                ctx.globalAlpha = t; ctx.drawImage(frames[curI], 0, 0); ctx.globalAlpha = 1; }
    };
  }

  // ======================================================================================================
  // 3. LE LECTEUR — un clip à la fois. Une demande de changement attend un moment de raccord du clip en cours :
  //    neutre exact (fondu 0,1 s) ; tête neutre si la demande l'accepte (fondu 0,2 s) ; fin du clip ;
  //    ou, si la demande a un délai maximal, un fondu forcé de 0,3 s (noté dans le journal).
  //    Un clip de réaction a une durée minimale (minPlay) avant laquelle il ne cède pas la place.
  // ======================================================================================================
  const FADE = { exact: 100, doux: 200, fin: 100, force: 300, direct: 0 };
  const L = {
    cur: null, pending: null, fresh: false, fadeT0: 0, fadeMs: 100, mix: 1, needDraw: true,
    frames: 0, fps: 0, fpsT0: performance.now(), onIdle: null,
    request(req) {
      req.t = now();
      if (this.pending && this.pending.onCancel) this.pending.onCancel();
      this.pending = req;
      if (!this.cur || this.cur.video.ended) return this.start(req, this.cur ? "fin" : "direct");
      this.check();
    },
    cancel(tag) { if (this.pending && (!tag || this.pending.tag === tag)) { this.pending.onCancel?.(); this.pending = null; } },
    check() {
      const q = this.pending, c = this.cur;
      if (!q || !c) return;
      if (!this.fresh) return c.minPlay || c.offset ? undefined : this.start(q, "exact"); // la 1re image du clip n'est pas encore là : la pose affichée est neutre
      const t = c.video.currentTime, info = CLIPS[c.clip];
      if (t < c.minPlay) return;
      if (inWin(info.n, t)) return this.start(q, "exact");
      if (q.doux && inWin(info.s, t)) return this.start(q, "doux");
      if (q.forceAfter != null && now() - q.t >= q.forceAfter && this.prochainRaccord(info, t, q.doux) - t > 0.45) return this.start(q, "force");
    },
    // le prochain moment de raccord du clip en cours (ou sa fin)
    prochainRaccord(info, t, doux) {
      let best = info.d;
      for (const [a] of doux ? info.n.concat(info.s) : info.n) if (a > t && a < best) best = a;
      return best;
    },
    ended() {
      if (this.pending) return this.start(this.pending, "fin");
      this.onIdle && this.onIdle();
    },
    start(req, how) {
      const v = videos[req.clip]; if (!v) return;
      const prev = this.cur, waited = now() - req.t;
      if (prev && prev.video !== v) prev.video.pause();
      if (prev) { R.swap(); this.mix = 0; this.fadeMs = FADE[how]; }
      const off = req.offset || 0;
      this.cur = { clip: req.clip, video: v, t0: performance.now(), offset: off, minPlay: off + (req.minPlay || 0), tag: req.tag || "attente", onLeave: req.onLeave };
      this.fresh = false; this.pending = null;
      if (off && how !== "force") { this.fadeMs = FADE.doux; how = how === "exact" || how === "fin" ? "entrée tête neutre" : how; }
      try { v.currentTime = off; } catch (e) {}
      if (visible) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } // RACCORD : cachée (récif), la vidéo attend
      watchFrames(v);
      const lab = { exact: "neutre", doux: "tête neutre", fin: "fin du clip", force: "fondu forcé", direct: "début" }[how] || how;
      if (req.log) journal(`${req.log}${off ? ` (depuis ${off.toFixed(1)} s)` : ""} · ${lab}${waited > 0.05 ? ` après ${waited.toFixed(1)} s` : ""}`, how === "force" ? "force" : "", { clip: req.clip, raccord: how, attente: +waited.toFixed(2) });
      req.onStart && req.onStart();
      if (prev && prev.onLeave) prev.onLeave();
    }
  };
  const hasRVFC = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
  function watchFrames(v) {
    if (!hasRVFC || v._watched) return; v._watched = true;
    const cb = (n, meta) => { if (L.cur && L.cur.video === v) newFrame(v, meta && meta.mediaTime); v.requestVideoFrameCallback(cb); };
    v.requestVideoFrameCallback(cb);
  }
  let lastT = -1, lastUp = 0;
  function newFrame(v, mediaTime) {
    if (v.readyState < 2) return;
    const t = mediaTime != null ? mediaTime : v.currentTime;
    if (!L.fresh && Math.abs(t - L.cur.offset) > 0.5 && performance.now() - L.cur.t0 < 400) return; // image d'avant le saut
    // RACCORD (allègement) : au niveau 2, au plus 12 images/s envoyées à la carte graphique ; cachée, aucune
    if (!visible || (L.fresh && niveau() >= 2 && performance.now() - lastUp < 80)) return;
    R.upload(v); L.frames++; L.needDraw = true; lastUp = performance.now();
    if (!L.fresh) { L.fresh = true; L.fadeT0 = performance.now(); }
  }
  function tick(ts) {
    if (L.cur && visible) {
      const v = L.cur.video;
      if (!hasRVFC && v.readyState >= 2 && !v.seeking && v.currentTime !== lastT) { lastT = v.currentTime; newFrame(v); }
      L.check();
      if (L.mix < 1 && L.fresh) { L.mix = Math.min(1, (ts - L.fadeT0) / L.fadeMs); L.needDraw = true; }
      if (L.needDraw) { R.draw(L.fresh ? L.mix : 0); L.needDraw = false; }
      if (ts - L.fpsT0 >= 1000) { L.fps = Math.round(L.frames * 1000 / (ts - L.fpsT0)); L.frames = 0; L.fpsT0 = ts; }
      if (statut) statut(`${L.cur.clip} · ${v.currentTime.toFixed(1)} / ${CLIPS[L.cur.clip].d.toFixed(1)} s · ambiance ${M.amb} · ${L.fps} img/s · ${R.kind}`);
    }
    requestAnimationFrame(tick);
  }

  // ======================================================================================================
  // 4. LE COMPORTEMENT — même interface que la pieuvre de l'application :
  //    play(geste, options) → promesse ; hold(geste) / release() ; plus parole(texte, ms, {consigne}) et silence()
  //    appelés par la voix, activite() à chaque toucher de l'enfant, ambiance(nom) pour les écrans sans exercice.
  // ======================================================================================================
  // ambiances : quels clips d'attente tirer, avec quels poids
  const AMBIANCES = {
    pause:     { 'idle-respiration': 3, 'idle-immobile': 3, 'idle-sourire': 2, 'idle-hochement': 1, 'idle-sourcils': 1, 'idle-curiosite': 1, 'idle-coup-oeil': 1, 'idle-reflexion': 1, 'idle-amuse': 1, 'idle-clin-oeil': .5 },
    ecoute:    { 'idle-immobile': 3, 'idle-respiration': 3, 'idle-travail': 3, 'idle-reflexion': 2, 'idle-sourire': 1, 'idle-approbation': 1 },
    montre:    { 'idle-travail': 4, 'idle-immobile': 2, 'idle-reflexion': 1 },
    reflechit: { 'idle-reflexion': 4, 'idle-immobile': 2, 'idle-travail': 1 },
    bravo:     { 'idle-sourire': 3, 'idle-amuse': 2, 'idle-approbation': 2, 'idle-immobile': 2, 'idle-respiration': 1, 'idle-clin-oeil': 1 },
    soutien:   { 'idle-respiration': 3, 'idle-immobile': 3, 'idle-travail': 2, 'idle-approbation': 1, 'idle-sourire': 1 }
  };
  const CALMES = new Set(['idle-immobile', 'idle-respiration', 'idle-travail', 'idle-reflexion', 'idle-sourire']);
  // délai minimal (s) avant de rejouer un geste marqué
  const ECART_MIN = { 'idle-clin-oeil': 45, 'idle-coup-oeil': 30, 'idle-amuse': 20, 'idle-curiosite': 20, 'idle-sourcils': 20, 'idle-hochement': 15, 'idle-approbation': 8 };
  const RELANCE = ['idle-sourcils', 'idle-curiosite'];
  const PETITES_REUSSITES = ['idle-approbation', 'idle-sourire', 'idle-amuse'];
  // durée minimale d'une réaction avant qu'une parole ou une autre réaction la remplace
  const MIN_REACTION = { success: 1.8, wrong: 5.4, encourage: 5.2 };
  const RELANCE_GESTE = 12, RELANCE_PHRASE = 25; // secondes sans toucher, pendant une question

  const M = {
    amb: "pause", ambAvant: null, bravoTimer: 0,
    consigne: null, erreurs: 0, serie: 0,
    parle: false, finParole: 0, dernierTalk: null,
    hist: [], vu: {}, gesteAvant: false,
    derniereActivite: now(), relance1: false, relance2: false, relanceDue: false, onRelance: null,

    // --- attente : tirage pondéré dans l'ambiance, sans répéter, en respectant les écarts, un calme après un geste ---
    choisirAttente() {
      const w = AMBIANCES[this.amb] || AMBIANCES.pause, t = now();
      let c = Object.entries(w).filter(([k]) => !this.hist.slice(-2).includes(k) && t - (this.vu[k] ?? -1e9) >= (ECART_MIN[k] || 0));
      if (this.gesteAvant) { const calmes = c.filter(([k]) => CALMES.has(k)); if (calmes.length) c = calmes; }
      if (!c.length) c = [["idle-immobile", 1]];
      let r = Math.random() * c.reduce((s, [, p]) => s + p, 0);
      for (const [k, p] of c) { if ((r -= p) <= 0) return k; }
      return c[c.length - 1][0];
    },
    noter(clip) { this.hist.push(clip); if (this.hist.length > 6) this.hist.shift(); this.vu[clip] = now(); this.gesteAvant = !CALMES.has(clip); },
    attente(raison) {
      let clip, why = raison || `attente (${this.amb})`;
      if (this.relanceDue) {
        this.relanceDue = false;
        const r = RELANCE.filter(k => now() - (this.vu[k] ?? -1e9) >= 8);
        clip = r[Math.floor(Math.random() * r.length)] || "idle-sourcils"; why = `relance : ${RELANCE_GESTE} s sans toucher`;
      } else clip = this.choisirAttente();
      L.request({ clip, tag: "attente", log: `${why} → ${clip}`, onStart: () => this.noter(clip) });
    },
    // --- appelé quand un clip finit sans demande en attente ---
    suivant() {
      const reste = this.finParole - now();
      if (this.parle && reste > 0.4) return this.lancerParole("suite de la parole");
      this.attente();
    },

    // --- parole : branchée sur la voix ; ms = durée connue du fichier (index des voix, app/assets/voix/index.json) ---
    // talk-a peut commencer à l'un de ses moments « tête neutre » : la bouche s'ouvre en fondu, les gestes varient d'une phrase à l'autre
    ENTREES: { "talk-a": [0, 1.9, 2.5, 4.35, 5.0, 5.8], "talk-b": [0] },
    choisirParole() {
      const reste = this.finParole - now();
      const clip = reste > 7.4 && this.dernierTalk !== "talk-b" ? "talk-b" : "talk-a";
      const d = CLIPS[clip].d, e = this.ENTREES[clip];
      let ok = e.filter(o => o + reste <= d - 0.15 && o !== this.derniereEntree);
      if (!ok.length) ok = [0];
      return { clip, offset: ok[Math.floor(Math.random() * ok.length)] };
    },
    lancerParole(why) {
      const { clip, offset } = this.choisirParole();
      L.request({ clip, offset, tag: "parole", doux: true, forceAfter: 0.8, log: `${why} → ${clip}`,
        onStart: () => { this.dernierTalk = clip; this.derniereEntree = offset; this.gesteAvant = false; } });
    },
    parole(texte, ms, { consigne = false } = {}) {
      this.parle = true; this.finParole = now() + ms / 1000;
      if (consigne) { this.consigne = texte; this.erreurs = 0; this.setAmb("ecoute"); this.activite(); }
      journal(`voix : « ${texte.length > 48 ? texte.slice(0, 46) + "…" : texte} » (${(ms / 1000).toFixed(1)} s)`, "ev");
      if (L.cur && L.cur.tag === "parole") { L.cancel("attente"); return; }  // il parle déjà : il continue
      if (L.pending && L.pending.tag === "reaction") return;  // la réaction demandée passe d'abord ; la parole suivra (voir play)
      this.lancerParole(consigne ? "consigne" : "parole");      // pendant une réaction, attend sa durée minimale
    },
    silence() {
      this.parle = false;
      L.cancel("parole");                                       // une parole très courte pendant une réaction : rien à jouer
      if (L.cur && L.cur.tag === "parole") {
        const clip = this.choisirAttente();
        L.request({ clip, tag: "attente", doux: true, log: `fin de la parole → ${clip}`, onStart: () => this.noter(clip) });
      }
    },

    // --- gestes : mêmes noms que la pieuvre ---
    play(geste, opts = {}) {
      let clip, apres = this.amb, why = geste;
      if (geste === "rejouir") {
        this.serie++;
        const fort = opts.fort || this.erreurs > 0 || this.serie % 3 === 0;
        why = opts.fort ? "réussite marquante" : this.erreurs > 0 ? "réussie après une erreur" : this.serie % 3 === 0 ? `${this.serie} réussites de suite` : "réussite simple";
        clip = fort ? "success" : this.piocher(PETITES_REUSSITES);
        this.erreurs = 0; apres = "bravo";
      } else if (geste === "encourager") {
        this.erreurs++; this.serie = 0;
        clip = this.erreurs === 1 ? "wrong" : "encourage";
        why = this.erreurs === 1 ? "première erreur" : `${this.erreurs}e erreur`;
        apres = "soutien";
      } else if (geste === "saluer") {
        clip = "idle-sourcils"; why = "bonjour";
      } else return Promise.resolve();
      // RACCORD (mode accéléré des tests) : la réaction est jouée, mais rien ne l'attend
      const fini = (p) => (rapide ? Promise.resolve() : p);
      if (L.cur && L.cur.tag === "reaction" && L.cur.clip === clip && !L.pending) {   // la même réaction est déjà à l'écran : elle continue
        journal(`${geste} (${why}) → ${clip} déjà en cours`);
        return fini(new Promise(res => { const prev = L.cur.onLeave; L.cur.onLeave = () => { prev && prev(); res(); }; }));
      }
      return fini(new Promise(res => {
        L.request({
          clip, tag: "reaction", doux: true, forceAfter: 1.2,
          minPlay: MIN_REACTION[clip] ?? CLIPS[clip].d,
          log: `${geste} (${why}) → ${clip}`,
          onStart: () => { this.noter(clip); this.setAmb(apres); if (this.parle) this.lancerParole("parole après la réaction"); },
          onLeave: res, onCancel: res
        });
      }));
    },
    piocher(liste) {
      const c = liste.filter(k => !this.hist.slice(-2).includes(k));
      return (c.length ? c : liste)[Math.floor(Math.random() * (c.length ? c.length : liste.length))];
    },
    hold(geste) {
      if (!this.ambAvant) this.ambAvant = this.amb;
      this.setAmb(geste === "reflechir" ? "reflechit" : "montre");
      journal(`hold('${geste}') → ambiance ${this.amb}`, "ev");
    },
    release() { if (this.ambAvant) { this.setAmb(this.ambAvant); this.ambAvant = null; journal("release()", "ev"); } },

    // --- ambiance et inactivité ---
    setAmb(a) {
      clearTimeout(this.bravoTimer);
      this.amb = a;
      if (a === "bravo") this.bravoTimer = setTimeout(() => { if (this.amb === "bravo") this.amb = this.consigne ? "ecoute" : "pause"; }, 7000);
    },
    ambiance(a) { this.consigne = a === "pause" ? null : this.consigne; this.setAmb(a); journal(`ambiance('${a}')`, "ev"); },
    activite() { this.derniereActivite = now(); this.relance1 = this.relance2 = false; },
    surveiller() {
      if (suspendue || !visible) return; // RACCORD : en pause (la maison) ou cachée, personne n'attend de réponse
      if (!["ecoute", "soutien"].includes(this.amb) || this.parle || (L.cur && L.cur.tag !== "attente")) return;
      const dt = now() - this.derniereActivite;
      if (dt > RELANCE_GESTE && !this.relance1) { this.relance1 = true; this.relanceDue = true; }
      if (dt > RELANCE_PHRASE && !this.relance2) { this.relance2 = true; this.onRelance && this.onRelance(); }
    }
  };
  L.onIdle = () => M.suivant();
  setInterval(() => M.surveiller(), 500);
  // tant que les vidéos ne sont pas chargées, les demandes sont ignorées (la mascotte démarre en attente)
  const request0 = L.request.bind(L);
  L.request = (req) => { if (pret) request0(req); else if (req.onCancel) req.onCancel(); };
  // RACCORD (lot « Correctifs de la tablette ») : chaque vidéo chargée fait avancer la barre de l'écran de démarrage
  M.nbVideos = Object.keys(CLIPS).length;
  M.pret = Promise.all(Object.keys(CLIPS).map((k) => loadVideo(k).then(() => { try { progres(); } catch (e) {} }))).then(() => { pret = true; M.attente("départ"); requestAnimationFrame(tick); });
  document.addEventListener("pointerdown", () => { M.activite(); if (visible && L.cur && L.cur.video.paused && !L.cur.video.ended) L.cur.video.play().catch(() => {}); }, { passive: true });
  M.etat = () => ({ clip: L.cur && L.cur.clip, tag: L.cur && L.cur.tag, ambiance: M.amb, fps: L.fps, rendu: R.kind, attente: !!L.pending, pret, visible, suspendue, parle: M.parle });

  // ======================================================================================================
  // 5. RACCORDS AVEC L'APPLICATION (nouveaux) : la pause, l'écran, les tables pour les tests
  // ======================================================================================================
  // la pause (la maison) : la parole cesse, la relance est suspendue ; à la reprise, l'inactivité repart de zéro
  M.suspendre = (on) => { suspendue = !!on; if (on) { if (M.parle) M.silence(); } else M.activite(); };
  // cachée (le récif vivant) : la vidéo en cours s'arrête, plus rien n'est envoyé à la carte graphique ; montrée : elle reprend
  M.afficher = (on) => {
    on = !!on; if (on === visible) return; visible = on;
    const v = L.cur && L.cur.video;
    if (!v) return;
    if (on) { if (!v.ended) v.play().catch(() => {}); M.activite(); } else v.pause();
  };
  // (correctif de la maquette) un toucher annule aussi le geste de relance déjà dû mais pas encore joué (12 s sans toucher
  // pendant un clip qui ne cédait pas encore) : sinon le geste arrivait après le toucher, à contretemps
  const activite0 = M.activite.bind(M);
  M.activite = () => { activite0(); M.relanceDue = false; };
  M.tables = { CLIPS, AMBIANCES, CALMES: [...CALMES], ECART_MIN, RELANCE, PETITES_REUSSITES, MIN_REACTION, RELANCE_GESTE, RELANCE_PHRASE, FADE, ENTREES: M.ENTREES };
  return M;
}
