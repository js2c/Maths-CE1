// LE LAGON, FOND DE L'APPLICATION (docs/SPEC.md, section 11, « Le lagon, fond de toute l'application »).
// Le début du panorama de la maquette du récif vivant (art/recif-vivant/index.html), à la hauteur de l'écran, et ce
// qui y vit : les poissons, les algues, les faisceaux de lumière, le miroitement de la surface. Les images sont
// extraites de la maquette par l'atelier (art/tools/export-lagon.mjs : planches « lagon » et « lagon-vie ») ; les
// mouvements sont ceux du code de la maquette, repris ici avec ses réglages (on calcule en px du panorama, comme
// elle, puis on convertit : k = 800 / 1 774 px de la scène par px du panorama).
//
// Ordre des plans (celui de la maquette), tous sous la ligne graduée : #bg (le fond, composé une fois), puis dans
// #lagon : le miroitement (WebGL, la bande du haut seulement), les poissons, les algues, les faisceaux.
//
// Ce qui coûte, et comment on le tient :
//   - le fond : une image fixe confiée à #bg (bitmaprenderer), jamais redessinée ;
//   - poissons et algues : des acteurs (actor.js), petits canvas redessinés seulement quand leur image change ;
//     l'inclinaison des poissons est dessinée dans leur canvas (pas de rotation par le compositeur : CLAUDE.md) ;
//   - faisceaux : un canvas à la résolution 1x de la scène, redessiné 15 fois par seconde au plus ;
//   - miroitement : un canvas WebGL limité à la bande où la surface ondule (196 px de haut sur 800).
// Allègement automatique (stage.perf.level, voir stage.js) :
//   niveau 1 : algues et ondulation des poissons à 8 images/s, miroitement à 15 images/s, un faisceau sur deux ;
//   niveau 2 : algues, miroitement et faisceaux figés (faisceaux fondus une fois dans le fond), poissons sans
//              ondulation, au plus trois groupes de poissons à l'écran.
import { Actor } from "./actor.js";
import { W, H } from "./stage.js";

// ---- les réglages de la maquette (mêmes noms qu'elle, en px du panorama)
const REEF_END = 5750, VANISH = 6900, WANT_LAGON = 6, WANT_REEF = 7, MAX_SCHOOLS = 5, STRIPS = 14;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const noise = (p) => (Math.sin(p) + Math.sin(p * 2.31 + 1.7) * 0.5 + Math.sin(p * 0.53 + 4.1) * 0.8) / 2.3;
const distScale = (x) => 1 - 0.55 * smooth(REEF_END - 150, VANISH, x);
const distFade = (x) => 1 - smooth(REEF_END, VANISH, x);
const lightAt = (x) => (x < 2600 ? 1 : x < 5900 ? 0.85 : 0.55 * (1 - smooth(7300, 8300, x)));
// la bande où la surface ondule : l'amplitude s'annule à 430 px du panorama (194 px de la scène) ; +2 px de marge
export const SURFACE_H = 196;
// cadences (images/s) par niveau d'allègement
const FPS = { algues: [15, 8, 0], poissons: [15, 8, 0], surface: [30, 15, 0], faisceaux: [15, 8, 0] };

// le tirage de la maquette (Park-Miller, graine 11)
const parkMiller = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;

export class Lagon {
  constructor(stage, sprites, atlas, { seed = 11 } = {}) {
    this.st = stage; this.sp = sprites;
    const m = atlas.sprites["lagon.fond"].meta;
    this.PH = m.panorama.H; this.VUE = m.vue; this.k = H / this.PH; this.TOP = m.top;
    this.HEAD = m.tete; this.SOLOS = m.solos; this.SCHOOLS = m.bancs; this.atlasSprites = atlas.sprites;
    this.rnd = parkMiller(seed);
    this.level = 0; this.t = 0;
    // le calque du lagon, juste au-dessus du fond et sous la ligne graduée
    this.el = document.createElement("div"); this.el.id = "lagon"; this.el.className = "actors";
    stage.bg.after(this.el);
    this.surface = this.makeSurface();
    this.fishEl = document.createElement("div"); this.fishEl.className = "actors"; this.el.append(this.fishEl);
    this.weeds = Object.keys(atlas.sprites).filter((n) => n.startsWith("lagon.algue.")).sort().map((name, i) => this.makeWeed(name, atlas.sprites[name].meta, i));
    this.rays = this.makeRays();
    // les poissons : la population de la maquette, simulée sur tout le panorama ; seuls ceux de la partie visible
    // ont un acteur
    this.groups = []; this.spawnT = 0;
    for (let i = 0; i < WANT_LAGON; i++) this.newGroup(this.rnd() < 0.3, "here", this.R(150, 2450));
    for (let i = 0; i < WANT_REEF; i++) this.newGroup(this.rnd() < 0.4, "here", this.R(2800, 5500));
    stage.onResize(() => { this.weeds.forEach((w) => w.a.resize()); for (const g of this.groups) for (const mb of g.members) mb.a?.resize(); this.sizeCanvases(); this.paintStatic(); });
    this.sizeCanvases();
  }
  R(a, b) { return a + (b - a) * this.rnd(); }
  pick(arr) { return arr[Math.floor(this.rnd() * arr.length)]; }
  topAt(x) { const T = this.TOP; return x < 0 ? T[0] : x >= 5800 ? this.PH : T[Math.min(T.length - 1, Math.round(x / 20))]; }
  ceilAhead(x, dir, span) { let m = this.PH; for (let d = 0; d <= span; d += 40) m = Math.min(m, this.topAt(x + dir * d)); return m; }

  // ------------------------------------------------------------------ le fond (#bg) : composé une fois
  // (au niveau 2, les faisceaux y sont fondus, à leur pose du moment)
  paintStatic() {
    const W2 = this.st.bg.width, H2 = this.st.bg.height, off = (this.bgOff ??= new OffscreenCanvas(W2, H2));
    if (off.width !== W2 || off.height !== H2) { off.width = W2; off.height = H2; }
    const c = off.getContext("2d"), q = this.sp.frame("lagon.fond", 0);
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (q) c.drawImage(q.img, q.sx, q.sy, q.w, q.h, 0, 0, W2, H2);
    if (this.level === 2) { c.setTransform(W2 / W, 0, 0, H2 / H, 0, 0); this.drawRays(c, this.t, 1); c.setTransform(1, 0, 0, 1, 0, 0); }
    (this.bgCtx ??= this.st.bg.getContext("bitmaprenderer")).transferFromImageBitmap(off.transferToImageBitmap());
  }

  // ------------------------------------------------------------------ le miroitement (WebGL, la bande du haut)
  // le programme de la maquette (« fond en WebGL : la surface ondule »), sur la bande où il agit ; sans WebGL, la
  // bande n'existe pas et le fond reste fixe
  makeSurface() {
    const c = document.createElement("canvas"); c.className = "lagon-surface";
    let gl = null;
    try { gl = c.getContext("webgl", { premultipliedAlpha: false, antialias: false, alpha: false, preserveDrawingBuffer: false }); } catch { gl = null; }
    if (!gl) return null;
    const vs = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }";
    const fs = `precision highp float;
      uniform sampler2D tex; uniform vec2 res; uniform float toPan, t, texW, texH;
      void main(){
        float sy = res.y - gl_FragCoord.y;
        float wx = gl_FragCoord.x * toPan, wy = sy * toPan;
        float amp = 1.0 - smoothstep(170.0, 430.0, wy);
        float dx = amp*(7.0*sin(wx*0.010 + wy*0.034 + t*1.15) + 3.5*sin(wx*0.023 - wy*0.05 - t*0.8));
        float dy = amp*(4.5*sin(wx*0.016 + wy*0.02 + t*0.9) + 2.0*sin(wx*0.031 - t*1.35));
        float sx = max(wx + dx, 6.0);
        vec2 uv = vec2(sx / texW, (wy + dy) / texH);
        gl_FragColor = vec4(texture2D(tex, clamp(uv, vec2(0.0), vec2(1.0))).rgb, 1.0);
      }`;
    try {
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
      gl.useProgram(prog);
      const buf = gl.createBuffer(), loc = gl.getAttribLocation(prog, "p");
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = {}; for (const n of ["tex", "res", "toPan", "t", "texW", "texH"]) U[n] = gl.getUniformLocation(prog, n);
      this.gl = { gl, U, tex: null };
    } catch { return null; }
    this.el.append(c);
    return c;
  }
  // la texture : la bande du haut du fond, à la résolution de l'écran
  async surfaceTexture() {
    const S = this.gl, q = this.sp.frame("lagon.fond", 0); if (!S || !q) return;
    const px = this.st.px, w = Math.round(W * px), h = Math.round((SURFACE_H + 8) * px), rows = (q.h / H) * (SURFACE_H + 8);
    const bmp = await createImageBitmap(q.img, q.sx, q.sy, q.w, Math.round(rows), { resizeWidth: w, resizeHeight: h, resizeQuality: "high" });
    const { gl } = S; S.tex ??= gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, S.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp); bmp.close?.();
    for (const [p, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, p, v);
    S.texRows = SURFACE_H + 8; S.key = null;
  }
  drawSurface(t) {
    const S = this.gl; if (!S?.tex) return;
    const { gl, U } = S, c = this.surface, toPan = 1 / (this.k * this.st.px);
    gl.viewport(0, 0, c.width, c.height);
    gl.uniform2f(U.res, c.width, c.height); gl.uniform1f(U.toPan, toPan); gl.uniform1f(U.t, t);
    gl.uniform1f(U.texW, W / this.k); gl.uniform1f(U.texH, S.texRows / this.k); gl.uniform1i(U.tex, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // ------------------------------------------------------------------ les faisceaux (maquette : « faisceaux de lumière »)
  makeRays() {
    const r = parkMiller(97), R = (a, b) => a + (b - a) * r(), list = [];
    for (let x = -500; x < 8400; x += R(55, 130)) {
      list.push({ x, tex: Math.floor(r() * 6), w: R(70, 240), len: R(850, 1550), a: R(0.1, 0.21), ang: 0.24 + R(-0.035, 0.035), sw: R(0.012, 0.03), drift: R(15, 45), sp: R(0.05, 0.12), fl: R(0.12, 0.3), ph: R(0, 20) });
    }
    // seuls ceux qui peuvent toucher la partie visible
    this.rayList = list.filter((q) => q.x + q.len * Math.sin(q.ang) + q.w + q.drift >= 0 && q.x - q.w - q.drift <= this.VUE);
    const c = document.createElement("canvas"); c.className = "lagon-rayons"; this.el.append(c);
    return c;
  }
  // dessine les faisceaux dans `ctx`, en px de la scène (le contexte est déjà à l'échelle de son canvas) ; `every` : un sur n
  drawRays(ctx, t, every) {
    const k = this.k;
    ctx.save(); ctx.globalCompositeOperation = "screen";
    this.rayList.forEach((q, i) => {
      if (i % every) return;
      const I = lightAt(q.x + q.len * 0.12); if (I <= 0.01) return;
      const f = this.sp.frame(`lagon.faisceau.${q.tex}`, 0); if (!f) return;
      const band = 0.3 + 0.95 * (0.5 + 0.5 * noise(q.x * 0.0011 + t * 0.07));
      const breath = 0.35 + 0.65 * (0.5 + 0.5 * noise(t * q.fl + q.ph));
      ctx.globalAlpha = clamp(q.a * I * band * breath, 0, 1);
      const x0 = q.x + q.drift * noise(t * q.sp * 0.8 + q.ph * 1.7);
      ctx.save(); ctx.translate(x0 * k, 0); ctx.rotate(-(q.ang + q.sw * noise(t * q.sp + q.ph)));
      ctx.drawImage(f.img, f.sx + 1, f.sy + 1, f.w - 2, f.h - 2, (-q.w * k) / 2, -20 * k, q.w * k, q.len * k);
      ctx.restore();
    });
    ctx.restore();
  }

  // ------------------------------------------------------------------ les algues (maquette : « le pied reste fixe »)
  makeWeed(name, meta, i) {
    const k = this.k, A = meta.h * 0.075, margin = Math.ceil(1.4 * A * k) + 2;
    const w = { name, ...meta, A, ph: i * 2.1 + 0.7, ph2: i * 1.3, margin };
    w.a = new Actor(this.st, this.el, meta.w * k + 2 * margin, meta.h * k + 2, margin, 1);
    return w;
  }
  paintWeed(w, t) {
    const q = this.sp.frame(w.name, 0); if (!q) return;
    const px = this.st.px, k = this.k, step = Math.max(2, Math.round(3 * k * px)), X = Math.round(w.margin * px) + Math.round(q.dx), Y0 = Math.round(px) + Math.round(q.dy);
    w.a.paint(`${t}`, (ctx) => {
      for (let r = 0; r < q.h; r += step) {
        const h = Math.min(step, q.h - r), hb = 1 - (r + h / 2) / q.h, bend = Math.pow(smooth(0.42, 1, hb), 1.3);
        const dx = bend * (w.A * Math.sin(t * 0.85 + w.ph - hb * 1.4) + w.A * 0.35 * Math.sin(t * 1.9 + w.ph2 - hb * 2.2));
        ctx.drawImage(q.img, q.sx, q.sy + r, q.w, h, X + Math.round(dx * k * px), Y0 + r, q.w, h);
      }
    });
    w.a.moveTo(w.x * k, w.y * k);
  }

  // ------------------------------------------------------------------ les poissons (maquette : « les nageurs »)
  newGroup(school, how, x) {
    const R = (a, b) => this.R(a, b), rnd = () => this.rnd();
    const g = { school, dir: 1, x: 0, y: 0, vy: 0, base: school ? R(55, 85) : R(38, 70), ph: R(0, 100), ty: 0, tyT: 0, dive: null, rising: false, diving: false, members: [], id: (this.gid = (this.gid ?? 0) + 1) };
    if (how === "left") { g.dir = 1; g.x = x ?? R(-420, -260); g.y = R(340, 900); }
    else if (how === "deep") { g.dir = -1; g.x = x ?? R(6850, 7000); g.y = R(420, 820); }
    else if (how === "here") { g.dir = rnd() < 0.5 ? -1 : 1; g.x = x; g.y = R(340, Math.max(360, Math.min(900, this.topAt(x) - 120))); }
    else { g.dir = rnd() < 0.5 ? -1 : 1; g.x = x ?? R(3000, 5300); g.y = this.topAt(g.x) + 140; g.rising = true; }
    if (!g.rising && rnd() < 0.25) {
      const lo = g.dir > 0 ? Math.max(g.x + 600, 3000) : 3000, hi = g.dir > 0 ? 5300 : Math.min(g.x - 600, 5300);
      if (hi > lo) g.dive = { x: R(lo, hi) };
    }
    g.ty = g.rising ? this.topAt(g.x) - R(180, 320) : g.y;
    if (school) {
      const S = this.pick(this.SCHOOLS), slots = [];
      S.keys.forEach((key) => {
        let ox, oy, ok = false, n = 0;
        while (!ok && n++ < 80) { ox = R(-170, 170); oy = R(-100, 100); ok = slots.every((s) => Math.hypot(s.ox - ox, s.oy - oy) > S.len * 0.8); }
        slots.push({ ox, oy });
        g.members.push({ key, len: S.len * R(0.88, 1.08), ox, oy, k: R(1.4, 2.4), x: g.x + ox, y: g.y + oy, vx: 0, vy: 0, tilt: 0, ph: R(0, 50), wph: R(0, 6), hidden: false });
      });
    } else {
      const [key, len] = this.pick(this.SOLOS);
      g.members.push({ key, len: len * R(0.9, 1.1), ox: 0, oy: 0, k: 0, x: g.x, y: g.y, vx: 0, vy: 0, tilt: 0, ph: R(0, 50), wph: 0, hidden: false });
    }
    this.groups.push(g);
  }
  stepGroup(g, dt, t) {
    const s = distScale(g.x), sp = g.base * (0.85 + 0.22 * noise(t * 0.21 + g.ph)) * (0.45 + 0.55 * s);
    g.x += g.dir * sp * dt; g.tyT -= dt;
    const roof = 330, floor = Math.min(980, this.ceilAhead(g.x, g.dir, 500) - 110);
    if (g.rising) { if (g.y < g.ty + 30) g.rising = false; }
    else if (g.dive && (g.dir > 0 ? g.x > g.dive.x : g.x < g.dive.x)) { g.ty = this.topAt(g.x) + 320; g.diving = true; }
    else if (g.x > REEF_END && g.dir > 0) g.ty += (560 - g.ty) * dt * 0.3;
    else if (g.tyT < 0) { g.ty = this.R(roof, Math.max(roof + 40, floor)); g.tyT = this.R(4, 9); }
    if (!g.rising && !g.diving) g.ty = clamp(g.ty, roof, Math.max(roof, floor));
    const want = clamp((g.ty - g.y) * 0.22, -24, 24) + 7 * Math.sin(t * 0.45 + g.ph);
    g.vy += (want - g.vy) * (1 - Math.exp(-0.9 * dt)); g.y += g.vy * dt; g.vx = g.dir * sp;
    const sc = distScale(g.x);
    for (const m of g.members) {
      if (g.members.length === 1) { m.x = g.x; m.y = g.y; m.vx = g.vx; m.vy = g.vy; }
      else {
        const tx = g.x + m.ox * sc, ty = g.y + m.oy * sc + Math.sin(t * 0.6 + m.wph) * 10 * sc, kk = 1 - Math.exp(-m.k * dt);
        const nx = m.x + (tx - m.x) * kk, ny = m.y + (ty - m.y) * kk;
        m.vx = (nx - m.x) / Math.max(dt, 1e-3); m.vy = (ny - m.y) / Math.max(dt, 1e-3); m.x = nx; m.y = ny;
      }
      const w = clamp(Math.atan2(m.vy, Math.abs(m.vx) + 25), -0.22, 0.22);
      m.tilt += (w - m.tilt) * (1 - Math.exp(-2 * dt));
      m.ph += dt * (1.2 + Math.min(2.2, Math.hypot(m.vx, m.vy) / 40)) * Math.PI;
      m.hidden = m.y - m.len * 0.3 * distScale(m.x) > this.topAt(m.x) + 20;
    }
  }
  finished(g) { return (g.dir < 0 && g.x < -700) || (g.dir > 0 && g.x > VANISH + 250) || (g.diving && g.members.every((m) => m.hidden)); }
  spawnTick() {
    const nLag = this.groups.filter((g) => g.x < 2600).length, nReef = this.groups.filter((g) => g.x >= 2600 && g.x < 7100).length;
    const school = this.groups.filter((g) => g.school).length < MAX_SCHOOLS && this.rnd() < 0.35;
    if (nLag < WANT_LAGON) this.newGroup(school, "left");
    else if (nReef < WANT_REEF) this.newGroup(school, this.rnd() < 0.6 ? "deep" : "coral");
  }
  // un poisson visible : son acteur, assez grand pour l'ondulation et l'inclinaison ; rangé du plus petit au plus grand
  fishActor(m) {
    const k = this.k, sp = this.SPR(m.key), L = m.len * distScale(m.x) * k, h = (L * sp.h) / sp.w, amp = h * 0.06;
    const cw = Math.ceil(L * Math.cos(0.22) + (h + 2 * amp) * Math.sin(0.22)) + 6, ch = Math.ceil(L * Math.sin(0.22) + (h + 2 * amp) * Math.cos(0.22)) + 6;
    const a = new Actor(this.st, this.fishEl, cw, ch, cw / 2, ch / 2);
    a.size = m.len; a.L = L; a.h = h; a.amp = amp;
    const after = [...this.fishEl.children].find((c) => c.__size > m.len); if (after) this.fishEl.insertBefore(a.c, after);
    a.c.__size = m.len;
    return a;
  }
  SPR(key) { return this.atlasSprites[`lagon.poisson.${key}`].meta; }
  // `key` : l'instant quantifié à la cadence du niveau (le poisson n'est redessiné que quand il change)
  paintFish(m, dir, key) {
    const a = m.a, q = this.sp.frame(`lagon.poisson.${m.key}`, 0); if (!q) return;
    const px = this.st.px, head = this.HEAD[m.key], flip = dir * head, ph = m.ph, tilt = m.tilt;
    a.paint(key, (ctx) => {
      ctx.setTransform(px, 0, 0, px, a.ax * px, a.ay * px); ctx.rotate(tilt * dir); ctx.scale(flip, 1);
      // l'image de la planche a 1 px de marge transparente de chaque côté : on ne prend que le dessin
      const sx = q.sx + 1, sy = q.sy + 1, sw = q.w - 2, sh = q.h - 2, w = a.L, h = a.h, amp = a.amp;
      for (let i = 0; i < STRIPS; i++) {
        const u0 = i / STRIPS, u1 = (i + 1) / STRIPS, uh = head < 0 ? (u0 + u1) / 2 : 1 - (u0 + u1) / 2, b = Math.max(0, uh - 0.3) / 0.7;
        const dy = amp * b * b * Math.sin(ph - uh * 3.0);
        ctx.drawImage(q.img, sx + u0 * sw, sy, (u1 - u0) * sw + (0.8 / px) * (sw / w), sh, -w / 2 + u0 * w, -h / 2 + dy, (u1 - u0) * w + 0.8 / px, h);
      }
    });
  }

  // ------------------------------------------------------------------ l'image
  sizeCanvases() {
    const px = this.st.px, k = this.st.k;
    if (this.surface) { this.surface.width = Math.round(W * px); this.surface.height = Math.round(SURFACE_H * px); Object.assign(this.surface.style, { width: `${W * k}px`, height: `${SURFACE_H * k}px` }); this.surfaceTexture(); }
    // les faisceaux : flous et doux, la résolution 1x de la scène suffit (comme les rayons d'avant)
    const rk = Math.min(1, px); this.rays.width = Math.round(W * rk); this.rays.height = Math.round(H * rk); this.rayScale = rk;
    Object.assign(this.rays.style, { width: `${W * k}px`, height: `${H * k}px` });
    this.keys = {};
  }
  // `due(nom, t)` : l'instant quantifié à la cadence du niveau, ou null si rien à redessiner (cadence nulle : figé)
  due(name, t) { const fps = FPS[name][this.level]; if (!fps) return this.keys[name] === undefined ? (this.keys[name] = t) : null; const q = Math.floor(t * fps) / fps; if (this.keys[name] === q) return null; this.keys[name] = q; return q; }
  update(t, dt) {
    dt = Math.min(0.05, dt); this.t = t;
    for (const g of this.groups) this.stepGroup(g, dt, t);
    for (let i = this.groups.length - 1; i >= 0; i--) if (this.finished(this.groups[i])) { for (const m of this.groups[i].members) this.drop(m); this.groups.splice(i, 1); }
    this.spawnT -= dt; if (this.spawnT < 0) { this.spawnTick(); this.spawnT = this.R(0.8, 2.2); }
  }
  drop(m) { if (m.a) { m.a.remove(); m.a = null; } }
  render() {
    const t = this.t, lvl = this.st.perf.level;
    if (lvl !== this.level) { this.level = lvl; this.keys = {}; this.paintStatic(); this.rays.style.visibility = lvl === 2 ? "hidden" : ""; if (this.surface) this.surface.style.visibility = lvl === 2 ? "hidden" : ""; }
    // le miroitement
    if (this.surface && lvl < 2) { const q = this.due("surface", t); if (q !== null) this.drawSurface(q); }
    // les faisceaux
    if (lvl < 2) {
      const q = this.due("faisceaux", t);
      if (q !== null) { const c = this.rays.getContext("2d"), s = this.rayScale; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.rays.width, this.rays.height); c.setTransform(s, 0, 0, s, 0, 0); this.drawRays(c, q, lvl === 1 ? 2 : 1); }
    }
    // les algues
    const qa = this.due("algues", t); if (qa !== null) this.weeds.forEach((w) => this.paintWeed(w, qa));
    // les poissons de la partie visible (au niveau 2 : au plus trois groupes)
    const qf = FPS.poissons[lvl], k = this.k; let shown = 0;
    for (const g of this.groups) {
      const inView = g.members.some((m) => m.x * k > -m.len * k && m.x * k < W + m.len * k);
      const on = inView && (lvl < 2 || shown < 3); if (inView && on) shown++;
      for (const m of g.members) {
        const x = m.x * k, y = m.y * k, vis = on && !m.hidden && x > -m.len * k && x < W + m.len * k && distFade(m.x) > 0.01;
        if (!vis) { this.drop(m); continue; }
        m.a ??= this.fishActor(m);
        this.paintFish(m, g.dir, qf ? `${Math.floor(t * qf)}` : "fige");
        m.a.moveTo(x, y, 1, Math.round(distFade(m.x) * 20) / 20);
      }
    }
  }
}
