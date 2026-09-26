// LA LIGNE GRADUÉE À L'ÉCRAN. Elle est dessinée par un Worker (art/line-worker.js) dans une bande de la
// scène, puis affichée par un canvas « bitmaprenderer » : afficher une image prête ne coûte presque rien
// au fil principal, et le navigateur n'a pas à la recopier à chaque image.
export const BAND = [370, 240]; // haut et hauteur de la bande en px logiques (bouées, poteaux, nombres)

export class LineView {
  constructor(stage) {
    this.st = stage; this.c = stage.root.querySelector("#line"); this.ctx = this.c.getContext("bitmaprenderer");
    this.worker = new Worker(new URL("../art/line-worker.js", import.meta.url), { type: "module" });
    this.seq = 0; this.wait = new Map();
    this.worker.onmessage = ({ data }) => { this.wait.get(data.id)?.(data.bitmaps); this.wait.delete(data.id); };
    this.place(); stage.onResize(() => this.place());
  }
  place() { const k = this.st.k; Object.assign(this.c.style, { top: `${BAND[0] * k}px`, height: `${BAND[1] * k}px` }); }
  // prépare une ou plusieurs versions de la ligne ; renvoie leurs images (chacune s'affiche une fois)
  render(specs) { const id = ++this.seq; return new Promise((res) => { this.wait.set(id, res); this.worker.postMessage({ id, px: this.st.px, band: BAND, specs }); }); }
  show(bitmap) { this.ctx.transferFromImageBitmap(bitmap); }
  clear() { this.ctx.transferFromImageBitmap(null); }
}
