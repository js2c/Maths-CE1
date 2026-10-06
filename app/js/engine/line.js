// LA LIGNE GRADUÉE À L'ÉCRAN. Elle est dessinée par un Worker (art/line-worker.js) dans une bande de la
// scène, puis affichée par un canvas « bitmaprenderer » : afficher une image prête ne coûte presque rien
// au fil principal, et le navigateur n'a pas à la recopier à chaque image.
import { clock } from "./clock.js";

export const BAND = [300, 310]; // haut et hauteur de la bande en px logiques (arcs de saut, bouées, poteaux, nombres)

export class LineView {
  constructor(stage) {
    this.st = stage; this.c = stage.root.querySelector("#line"); this.ctx = this.c.getContext("bitmaprenderer");
    this.worker = new Worker(new URL("../art/line-worker.js", import.meta.url), { type: "module" });
    this.seq = 0; this.wait = new Map();
    this.worker.onmessage = ({ data }) => { this.wait.get(data.id)?.(data.bitmaps); this.wait.delete(data.id); };
    // calque d'effets de la même bande (arcs de saut, surbrillances) : dessiné seulement pendant un retour
    // ou une leçon, vidé ensuite (un canvas qui ne change pas ne coûte rien)
    // (lot 2 : posé au-dessus de la mascotte, comme la tortue : arcs et filets ne passent jamais derrière elle)
    this.fx = document.createElement("canvas"); this.fx.id = "fx"; (stage.root.querySelector("#mascotte") ?? this.c).after(this.fx); this.fxCtx = this.fx.getContext("2d"); this.fxUsed = false;
    this.place(); stage.onResize(() => this.place());
  }
  place() {
    const k = this.st.k, px = this.st.px;
    for (const c of [this.c, this.fx]) Object.assign(c.style, { top: `${BAND[0] * k}px`, height: `${BAND[1] * k}px` });
    this.fx.width = Math.round(1280 * px); this.fx.height = Math.round(BAND[1] * px);
  }
  // dessine sur le calque d'effets en coordonnées de la scène (px logiques)
  fxDraw(fn) { const x = this.fxCtx, px = this.st.px; x.setTransform(px, 0, 0, px, 0, -BAND[0] * px); fn(x); this.fxUsed = true; }
  fxClear() { if (!this.fxUsed) return; this.fxCtx.setTransform(1, 0, 0, 1, 0, 0); this.fxCtx.clearRect(0, 0, this.fx.width, this.fx.height); this.fxUsed = false; }
  // prépare une ou plusieurs versions de la ligne ; renvoie leurs images (chacune s'affiche une fois)
  render(specs) { const id = ++this.seq, g = clock.hold(); return new Promise((res) => { this.wait.set(id, res); this.worker.postMessage({ id, px: this.st.px, band: BAND, specs }); }).then(g); }
  // (lot 3, étape 5) une leçon jouée pendant une pause dessine dans des calques neufs, posés sur ceux de la séance (qui
  // gardent leur ligne, qu'on ne peut pas relire d'un canvas « bitmaprenderer ») ; `restore()` rend ceux de la séance
  swap() {
    const old = { c: this.c, ctx: this.ctx, fx: this.fx, fxCtx: this.fxCtx, fxUsed: this.fxUsed, affichee: this.affichee };
    const c = old.c.cloneNode(false), fx = old.fx.cloneNode(false);
    for (const e of [c, fx]) { e.classList.remove("stash"); e.style.opacity = ""; e.style.transition = ""; }
    old.c.after(c); old.fx.after(fx);
    Object.assign(this, { c, ctx: c.getContext("bitmaprenderer"), fx, fxCtx: fx.getContext("2d"), fxUsed: false, affichee: false }); this.place();
    return () => { this.c.remove(); this.fx.remove(); Object.assign(this, old); };
  }
  // (lot « Mascotte ») `affichee` : une ligne est à l'écran (la bulle de la mascotte ne couvre jamais sa bande)
  show(bitmap) { this.ctx.transferFromImageBitmap(bitmap); this.affichee = !!bitmap; }
  clear() { this.ctx.transferFromImageBitmap(null); this.affichee = false; }
  get bande() { const c = this.c; return this.affichee && c.style.opacity !== "0" && !c.classList.contains("stash") ? [0, BAND[0], 1280, BAND[0] + BAND[1]] : null; }
}
