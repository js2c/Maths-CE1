// UN ACTEUR : un élément qui bouge à l'écran, porté par son propre petit canvas.
// Pourquoi pas un grand canvas animé ? Parce qu'un canvas modifié doit être recopié en entier vers le
// compositeur à chaque image : mesuré dans Chromium sans processeur graphique, un canvas plein écran
// (2560 × 1600) coûtait ~880 ms de copie par seconde avec le processeur ÷4. Ici, un acteur ne redessine
// son petit canvas que quand son image change (12 à 15 fois par seconde au plus), et ses déplacements,
// sa taille (jamais au-dessus de 1) et son opacité sont confiés au compositeur (transform CSS).
export class Actor {
  // w, h : taille du canvas en px logiques ; (ax, ay) : le point d'ancrage dans ce canvas
  constructor(stage, parent, w, h, ax, ay) {
    this.st = stage; this.w = w; this.h = h; this.ax = ax; this.ay = ay;
    this.c = document.createElement("canvas"); this.c.className = "actor"; this.ctx = this.c.getContext("2d");
    parent.append(this.c); this.key = null; this.css = ""; this.op = 1; this.vis = true; this.resize();
  }
  resize() {
    const { px, k } = this.st;
    this.c.width = Math.ceil(this.w * px); this.c.height = Math.ceil(this.h * px);
    Object.assign(this.c.style, { width: `${this.w * k}px`, height: `${this.h * k}px`, transformOrigin: `${this.ax * k}px ${this.ay * k}px` });
    this.key = null; this.css = "";
  }
  // redessine seulement si `key` a changé ; `paint(ctx)` dessine en pixels d'écran, l'ancrage en (ax·px, ay·px)
  paint(key, paint) {
    if (key === this.key) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    paint(this.ctx); this.key = key;
  }
  // place l'ancrage en (x, y) logiques ; s <= 1 : réduction seulement (jamais agrandir une image)
  moveTo(x, y, s = 1, opacity = 1) {
    const k = this.st.k, r = (v) => Math.round(v * 100) / 100;
    const css = `translate(${r((x - this.ax) * k)}px, ${r((y - this.ay) * k)}px)${s !== 1 ? ` scale(${r(Math.min(1, s))})` : ""}`;
    if (css !== this.css) { this.c.style.transform = css; this.css = css; }
    if (opacity !== this.op) { this.c.style.opacity = String(opacity); this.op = opacity; }
  }
  show(v) { if (v !== this.vis) { this.c.style.visibility = v ? "visible" : "hidden"; this.vis = v; } }
  remove() { this.c.remove(); }
}
