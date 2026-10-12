// LA LIGNE GRADUÉE À L'ÉCRAN. Elle est dessinée par un Worker (art/line-worker.js) dans une bande de la
// scène, puis affichée par un canvas « bitmaprenderer » : afficher une image prête ne coûte presque rien
// au fil principal, et le navigateur n'a pas à la recopier à chaque image.
// (lot « Recette de l'enfant », point 0.1 : la barre noire vue sur la tablette, de y = 300 à 610 dans tous les exercices,
// exactement la bande de la ligne) un canvas « bitmaprenderer » vidé par transferFromImageBitmap(null) devrait être
// transparent ; Chrome et Brave pour Android, avec la carte graphique, l'affichent parfois en noir opaque (non reproduit
// dans le Chromium des parcours, sans carte graphique). Aucun calque de la bande ne reste donc visible sans image :
// `#line` et `#fx` sont cachés (classe `vide`, display: none) dès qu'ils n'ont rien à montrer, et l'image de `#line`
// n'est libérée qu'une fois le calque caché.
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
    this.c.classList.add("vide"); this.fx.classList.add("vide");
    this.place(); stage.onResize(() => this.place());
  }
  place() {
    const k = this.st.k, px = this.st.px;
    for (const c of [this.c, this.fx]) Object.assign(c.style, { top: `${BAND[0] * k}px`, height: `${BAND[1] * k}px` });
    this.fx.width = Math.round(1280 * px); this.fx.height = Math.round(BAND[1] * px);
  }
  // dessine sur le calque d'effets en coordonnées de la scène (px logiques)
  fxDraw(fn) { const x = this.fxCtx, px = this.st.px; x.setTransform(px, 0, 0, px, 0, -BAND[0] * px); fn(x); this.fxUsed = true; this.fx.classList.remove("vide"); }
  fxClear() { if (!this.fxUsed) return; this.fx.classList.add("vide"); this.fxCtx.setTransform(1, 0, 0, 1, 0, 0); this.fxCtx.clearRect(0, 0, this.fx.width, this.fx.height); this.fxUsed = false; }
  // prépare une ou plusieurs versions de la ligne ; renvoie leurs images (chacune s'affiche une fois)
  render(specs) { const id = ++this.seq, g = clock.hold(); return new Promise((res) => { this.wait.set(id, res); this.worker.postMessage({ id, px: this.st.px, band: BAND, specs }); }).then(g); }
  // (lot 3, étape 5) une leçon jouée pendant une pause dessine dans des calques neufs, posés sur ceux de la séance (qui
  // gardent leur ligne, qu'on ne peut pas relire d'un canvas « bitmaprenderer ») ; `restore()` rend ceux de la séance
  swap() {
    const old = { c: this.c, ctx: this.ctx, fx: this.fx, fxCtx: this.fxCtx, fxUsed: this.fxUsed, affichee: this.affichee, montree: this.montree };
    const c = old.c.cloneNode(false), fx = old.fx.cloneNode(false);
    for (const e of [c, fx]) { e.classList.remove("stash"); e.classList.add("vide"); e.style.opacity = ""; e.style.transition = ""; }
    old.c.after(c); old.fx.after(fx);
    Object.assign(this, { c, ctx: c.getContext("bitmaprenderer"), fx, fxCtx: fx.getContext("2d"), fxUsed: false, affichee: false, montree: null }); this.place();
    return () => { this.c.remove(); this.fx.remove(); Object.assign(this, old); };
  }
  // (lot « Mascotte ») `affichee` : une ligne est à l'écran (la bulle de la mascotte ne couvre jamais sa bande)
  // (lot « Recette de l'enfant et nettoyage des couches », l'enfant imprévisible, graine 1062 : « passer la correction » montrait
  // une seconde fois l'image de la correction, déjà donnée au calque ; une image donnée est « détachée », et l'appel échouait,
  // en erreur de la page) : la même image déjà à l'écran n'est pas redonnée ; une image détachée (largeur nulle) est ignorée
  show(bitmap) {
    if (!bitmap) return this.clear();
    if (bitmap === this.montree && this.affichee) return;
    if (bitmap.width === 0) return;
    this.ctx.transferFromImageBitmap(bitmap); this.montree = bitmap; this.affichee = true; this.c.classList.remove("vide");
  }
  clear() { this.c.classList.add("vide"); if (this.affichee) this.ctx.transferFromImageBitmap(null); this.affichee = false; }
  get bande() { const c = this.c; return this.affichee && c.style.opacity !== "0" && !c.classList.contains("stash") ? [0, BAND[0], 1280, BAND[0] + BAND[1]] : null; }
}
