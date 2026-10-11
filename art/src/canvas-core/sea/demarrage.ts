// L'ÉCRAN DE DÉMARRAGE (lot « Correctifs de la tablette », décision du parent du 8 octobre 2026) : la barre de chargement, un
// tube de verre (vide, puis plein), dont l'application dévoile le plein peu à peu. Style A, « BD au marqueur ».
// (Lot « Correctifs : passage de l'échauffement aux voiliers », point 9 : le logo « Maths CE1 » dessiné ici n'existe plus ;
// celui de l'écran de démarrage est découpé dans l'image du parent, maquette art/logo/, art/tools/export-logo.mjs.)
import type { Gfx, P } from "../core";
import { blob, fillShape, ink } from "../gallery";
import { cel, contour, shift } from "../oceanMarker";

const SHADOW = "#06323b";

// LA BARRE DE CHARGEMENT : un tube de verre arrondi (BAR_W × BAR_H), vide ou plein d'eau dorée
export const BAR_W = 520, BAR_H = 44;
const tube = (cx: number, cy: number, w: number, h: number): P[] => {
  const r = h / 2, out: P[] = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI / 2 + (Math.PI * i) / 12; out.push([cx - w / 2 + r + r * Math.cos(a), cy + r * Math.sin(a)]); }
  for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (Math.PI * i) / 12; out.push([cx + w / 2 - r + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return out;
};
export const drawBar = (g: Gfx, cx: number, cy: number, full: boolean) => g.group("plain", () => {
  const outer = tube(cx, cy, BAR_W, BAR_H), inner = tube(cx, cy, BAR_W - 14, BAR_H - 14);
  fillShape(g, shift(outer, 5, 7), SHADOW, 0.45);
  cel(g, outer, "#e8fffb", "#9fd8d6", 3);
  if (full) {
    cel(g, inner, "#ffc93a", "#e08d1c", 4, [shift(tube(cx, cy - 6, BAR_W - 40, 6), 0, 0), "#fff1b8"]);
    // de petites bulles dans l'eau dorée
    for (let i = 0; i < 9; i++) { const x = cx - BAR_W / 2 + 40 + i * 55 + ((i * 37) % 17), y = cy + ((i * 13) % 9) - 3; fillShape(g, blob(x, y, 3.2, 3.2, 9400 + i, 0.05, 8), "#fff7d6", 0.8); }
  } else fillShape(g, inner, "#0e6470", 0.55);
  contour(g, outer, 4.2, 9410);
  // le reflet du verre, en haut à gauche
  ink(g, [[cx - BAR_W / 2 + 26, cy - BAR_H / 2 + 9], [cx - BAR_W / 2 + 120, cy - BAR_H / 2 + 7]], "#ffffff", { w: 4, shadow: 0, taper: [0.3, 0.3], seed: 9420 }, 0.8);
});
