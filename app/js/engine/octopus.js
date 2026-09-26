// LA PIEUVRE EN DIRECT. L'atelier a fabriqué ses pièces (bras, manteau, rebord, yeux, bouche, joues) et
// une frise par geste (atlas.octo) : pour chaque image, quelles pièces poser et comment incliner,
// décaler et écraser le tout. Ici on ne dessine rien : on joue la frise à 12 images/s et on recompose
// la pieuvre DROITE dans son propre canvas, seulement quand l'image change (de simples copies de
// pièces, au pixel près). L'inclinaison, l'écrasement et le flottement sont confiés au compositeur du
// navigateur (transform CSS) : sur la tablette c'est le processeur graphique qui les fait, hors du fil
// principal. Mesuré (processeur ÷4, dessin logiciel) : recomposer en tournant coûtait ~40 ms, droite ~9 ms.
//
// Enchaînements sans saut : un geste commence sur une phase donnée du repos (entry) et y rend la main
// (exit). Pour lancer un geste, on amène d'abord le repos à sa phase d'entrée en jouant ses images à
// vitesse triple, dans le sens le plus court (au plus une demi-seconde) : on dirait une petite
// anticipation, pas un saut.
const SEEK_FPS = 36;

export class Octopus {
  constructor(sprites, timeline, canvas, stage) {
    this.sp = sprites; this.tl = timeline; this.fps = timeline.fps; this.idleN = timeline.idleFrames; this.stage = stage;
    this.clip = "repos"; this.f = 0; this.acc = 0; this.pending = null; this.holding = false; this.onEnd = null;
    this.cache = canvas; this.cx = canvas.getContext("2d");
    this.key = ""; this.tf = [0, 0, 0, 1, 1]; this.css = ""; this.resize();
  }
  // le canvas épouse l'enveloppe de la pieuvre sur toutes les images de tous ses gestes (et pas le calque
  // de l'atelier, bien plus grand) : c'est la surface recopiée vers le compositeur à chaque recomposition
  resize() {
    const px = this.sp.px, k = this.stage.k, c = this.cache, at = this.sp.atlas.sprites, src = this.sp.src;
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    for (const clip of Object.values(this.tl.clips)) for (const fr of clip.tl) for (const [n, i] of fr[5]) {
      const q = at[n].rects[src] ?? at[n].rects[1], r = q[i], m = px / (at[n].rects[src] ? src : 1);
      x0 = Math.min(x0, r[5] * m); y0 = Math.min(y0, r[6] * m); x1 = Math.max(x1, (r[5] + r[3]) * m); y1 = Math.max(y1, (r[6] + r[4]) * m);
    }
    this.cx0 = Math.ceil(-x0) + 2; this.cy0 = Math.ceil(-y0) + 2; // position du centre du manteau dans le canvas (px d'écran)
    c.width = Math.ceil(x1 - x0) + 4; c.height = Math.ceil(y1 - y0) + 4;
    Object.assign(c.style, { width: `${(c.width / px) * k}px`, height: `${(c.height / px) * k}px`, transformOrigin: `${(this.cx0 / px) * k}px ${(this.cy0 / px) * k}px` });
    this.key = ""; this.css = "";
  }
  // première copie d'une grande planche dans ce canvas = son téléversement (mesuré : ~180 ms, processeur
  // ÷4) ; on le fait à un moment calme (écran d'accueil) plutôt qu'au milieu d'un geste
  warm(sheet) {
    const pages = this.sp.pages.get(sheet)?.pages ?? [];
    for (const p of pages) this.cx.drawImage(p, 0, 0, 1, 1, 0, 0, 1, 1);
    this.key = ""; // l'image suivante recompose tout (efface ce pixel)
  }
  // joue un geste une fois (saluer, rejouir, encourager) ; la promesse se résout quand il est fini
  play(name) { return new Promise((res) => { this.pending = { name, res }; this.holding = false; }); }
  // tient un geste qui a une boucle (montrer, reflechir) jusqu'à release()
  hold(name) { this.pending = { name, res: null }; this.holding = true; }
  release() { this.holding = false; }
  update(dt) {
    const c = this.tl.clips[this.clip];
    if (this.clip === "repos" && this.pending) {
      // amener le repos à la phase d'entrée du geste demandé
      const entry = this.tl.clips[this.pending.name].entry, fwd = (entry - this.f + this.idleN) % this.idleN;
      if (fwd === 0) { this.clip = this.pending.name; this.onEnd = this.pending.res; this.pending = null; this.f = 0; this.acc = 0; return; }
      this.acc += dt * SEEK_FPS;
      while (this.acc >= 1 && this.f !== entry) { this.acc -= 1; this.f = (this.f + (fwd <= this.idleN / 2 ? 1 : this.idleN - 1)) % this.idleN; }
      return;
    }
    const inHold = c.hold && this.f >= c.hold[0] && this.f < c.hold[1];
    // une réaction demandée pendant un geste tenu (la pieuvre montre la ligne, l'enfant répond) : le geste
    // est relâché, sa boucle finie en vitesse triple et sa sortie en double (au plus ~1 s) ; un geste
    // simplement relâché finit sa boucle en vitesse double
    if (this.pending && c.hold) this.holding = false;
    const speed = this.pending && c.hold ? (this.f < c.hold[1] ? 3 : 2) : inHold && !this.holding ? 2 : 1;
    this.acc += dt * this.fps * speed;
    while (this.acc >= 1) {
      this.acc -= 1; this.f++;
      if (c.hold && this.holding && this.f === c.hold[1]) this.f = c.hold[0];
      if (this.f >= c.frames) {
        if (this.clip === "repos") { this.f = 0; continue; }
        const done = this.onEnd; this.onEnd = null;
        this.f = c.exit % this.idleN; this.clip = "repos"; done?.();
        return;
      }
    }
  }
  // recompose le canvas si l'image de la frise a changé : les pièces posées droites, au pixel près
  compose() {
    const key = `${this.clip}:${this.f}`;
    if (key === this.key) return;
    const [tilt, dx, dy, sx, sy, refs] = this.tl.clips[this.clip].tl[this.f];
    const frames = refs.map(([n, i]) => this.sp.frame(n, i));
    if (frames.some((q) => !q)) return; // planche des gestes pas encore chargée : on garde l'image précédente
    const x = this.cx, X = this.cx0, Y = this.cy0;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.cache.width, this.cache.height);
    for (const q of frames) x.drawImage(q.img, q.sx, q.sy, q.w, q.h, X + Math.round(q.dx), Y + Math.round(q.dy), q.w, q.h);
    this.key = key; this.tf = [tilt, dx, dy, sx, sy];
  }
  // place la pieuvre, centre du manteau en (x, y) logiques. Même géométrie que `placer` (octopus.ts) :
  // écrasement autour de l'anneau des bras, puis inclinaison autour du centre, puis décalage non tourné.
  place(x, y) {
    this.compose();
    const k = this.stage.k, [tilt, dx, dy, sx, sy] = this.tf, ring = this.tl.ring * k, r = (v) => Math.round(v * 100) / 100, ox = this.cx0 / this.sp.px, oy = this.cy0 / this.sp.px;
    const css = `translate(${r((x + dx - ox) * k)}px, ${r((y + dy - oy) * k)}px) rotate(${tilt}deg) translate(0px, ${r(ring)}px) scale(${sx}, ${sy}) translate(0px, ${r(-ring)}px)`;
    if (css !== this.css) { this.cache.style.transform = css; this.css = css; }
  }
}
