// DESSIN DE LA LIGNE GRADUÉE HORS DU FIL PRINCIPAL. runtime.js (généré par l'atelier) ne touche pas au
// DOM : il dessine ici dans un OffscreenCanvas, et l'image est renvoyée toute prête (ImageBitmap).
// Mesuré avant ce déplacement : 120 à 180 ms de dessin par question sur le fil principal (processeur ÷4),
// soit un à-coup visible dans l'animation.
import { drawLine } from "./runtime.js";

// message : { id, px, band: [y0, h], specs: [LineSpec, ...] } -> { id, bitmaps: [ImageBitmap, ...] }
self.onmessage = ({ data }) => {
  const { id, px, band: [y0, h], specs } = data, W = Math.round(1280 * px), H = Math.round(h * px);
  const bitmaps = specs.map((spec) => {
    const c = new OffscreenCanvas(W, H), ctx = c.getContext("2d");
    ctx.setTransform(px, 0, 0, px, 0, -y0 * px);
    drawLine(ctx, spec);
    return c.transferToImageBitmap();
  });
  self.postMessage({ id, bitmaps }, bitmaps);
};
