// L'ÉCRAN DE DÉMARRAGE (lot « Correctifs de la tablette », décision du parent du 8 octobre 2026) : la barre de chargement, un
// tube de verre (vide, puis plein), dont l'application dévoile le plein peu à peu. Style A, « BD au marqueur ».
// (Lot « Correctifs : passage de l'échauffement aux voiliers », point 9 : le logo « Maths CE1 » dessiné ici n'existe plus ;
// celui de l'écran de démarrage est découpé dans l'image du parent, maquette art/logo/, art/tools/export-logo.mjs.)
import type { Gfx, P } from "../core";
import { blob, fillShape, ink, smooth } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";

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

// (lot « Banc Android et recette en conditions réelles », point 5) « TOURNE TON TÉLÉPHONE » : la page ouverte en portrait sur un
// téléphone (dans un onglet, avant l'installation) montre ce dessin au lieu d'une scène écrasée. Un téléphone tenu droit, son
// écran ouvert sur le lagon (l'eau, un poisson corail, le reflet de la vitre), que l'application fait pivoter d'un quart de tour
// (une seule couche tournée, app/js/engine/tourner.js) ; une flèche dorée, courbe, montre le sens. Pas de texte.
export const PHONE_W = 150, PHONE_H = 262;
const rrect = (cx: number, cy: number, w: number, h: number, r: number): P[] => {
  const out: P[] = [], c: [number, number, number][] = [[cx + w / 2 - r, cy - h / 2 + r, -Math.PI / 2], [cx + w / 2 - r, cy + h / 2 - r, 0], [cx - w / 2 + r, cy + h / 2 - r, Math.PI / 2], [cx - w / 2 + r, cy - h / 2 + r, Math.PI]];
  for (const [x, y, a0] of c) for (let i = 0; i <= 6; i++) { const a = a0 + (Math.PI / 2) * (i / 6); out.push([x + r * Math.cos(a), y + r * Math.sin(a)]); }
  return out;
};
export const drawPhone = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const body = rrect(cx, cy, PHONE_W, PHONE_H, 26), screen = rrect(cx, cy + 2, PHONE_W - 26, PHONE_H - 52, 12);
  fillShape(g, shift(body, 6, 9), SHADOW, 0.45);
  cel(g, body, "#35556e", "#1d3346", 6);
  // l'écran : le lagon, plus clair en haut ; une ride à la surface, un poisson corail
  cel(g, screen, "#6fd6d2", "#2f9fa9", 0, [shift(rrect(cx, cy - 58, PHONE_W - 26, 70, 12), 0, -24), "#a8ece4"]);
  ink(g, [[cx - 50, cy - 46], [cx - 30, cy - 52], [cx - 10, cy - 46], [cx + 10, cy - 52], [cx + 30, cy - 46], [cx + 50, cy - 52]], "#e9fffb", { w: 3.4, shadow: 0, taper: [0.2, 0.2], seed: 9431 }, 0.85);
  const fx = cx + 4, fy = cy + 30, fish = blob(fx, fy, 26, 16, 9440, 0.06, 12), tail: P[] = [[fx + 20, fy], [fx + 44, fy - 17], [fx + 40, fy], [fx + 44, fy + 17]];
  fillShape(g, shift(tail, 2, 3), SHADOW, 0.3); cel(g, tail, "#ff9a7a", "#c64d3c", 2); contour(g, tail, 2.4, 9441);
  fillShape(g, shift(fish, 2, 3), SHADOW, 0.3); cel(g, fish, "#ff8a6a", "#d4553f", 3); contour(g, fish, 2.8, 9442);
  ink(g, [[fx + 6, fy - 13], [fx + 9, fy], [fx + 6, fy + 13]], INK, { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 9443 }, 0.8); // l'ouïe
  fillShape(g, blob(fx - 12, fy - 4, 4.2, 4.2, 9444, 0.03, 10), INK); fillShape(g, blob(fx - 13.2, fy - 5.4, 1.4, 1.4, 9445, 0.02, 8), "#ffffff");
  for (const [bx, by, r] of [[cx - 38, cy + 4, 5], [cx - 30, cy - 14, 3.4], [cx - 44, cy - 24, 2.4]] as const) ink(g, blob(bx, by, r, r, 9450 + r, 0.05, 10), "#e9fffb", { w: 1.6, closed: true, shadow: 0, seed: 9460 + r }, 0.9);
  contour(g, screen, 2.6, 9446);
  // le reflet de la vitre, en haut à gauche
  ink(g, [[cx - PHONE_W / 2 + 26, cy - 60], [cx - PHONE_W / 2 + 46, cy - 92]], "#ffffff", { w: 5, shadow: 0, taper: [0.3, 0.3], seed: 9447 }, 0.55);
  // l'écouteur en haut, le bouton du côté
  ink(g, [[cx - 18, cy - PHONE_H / 2 + 14], [cx + 18, cy - PHONE_H / 2 + 14]], "#0d1d2a", { w: 5, shadow: 0, taper: [0.25, 0.25], seed: 9448 });
  const bouton = rrect(cx + PHONE_W / 2 + 3, cy - 46, 7, 36, 3); cel(g, bouton, "#35556e", "#1d3346", 1); contour(g, bouton, 2, 9449);
  contour(g, body, 4.6, 9439);
});
// la flèche : un arc d'un quart de tour, au-dessus à droite du téléphone, sa pointe vers le bas
export const ARROW_R = 190;
export const drawTurnArrow = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  // (de -125° à -25° autour du centre du téléphone, dans le sens des aiguilles d'une montre : le sens du quart de tour)
  const pts: P[] = []; for (let i = 0; i <= 28; i++) { const a = ((-125 + (100 * i) / 28) * Math.PI) / 180, r = ARROW_R + Math.sin((i / 28) * Math.PI) * 6; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  ink(g, shift(pts, 4, 6), SHADOW, { w: 22, shadow: 0, taper: [0.18, 0.001], seed: 9470 }, 0.4);
  ink(g, pts, INK, { w: 26, shadow: 0, taper: [0.18, 0.001], seed: 9471 });
  ink(g, pts, "#ffc93a", { w: 16, shadow: 0, taper: [0.2, 0.001], seed: 9472 });
  ink(g, pts.slice(2, -3).map(([x, y]) => { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy); return [x - (dx / d) * 3, y - (dy / d) * 3] as P; }), "#fff1b8", { w: 4, shadow: 0, taper: [0.2, 0.2], seed: 9473 }, 0.8);
  // la pointe, dans le sens de l'arc
  const [x1, y1] = pts.at(-1)!, [x0, y0] = pts.at(-3)!, d = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / d, uy = (y1 - y0) / d, nx = -uy, ny = ux;
  const head: P[] = [[x1 + ux * 40, y1 + uy * 40], [x1 + nx * 27 - ux * 6, y1 + ny * 27 - uy * 6], [x1 - nx * 27 - ux * 6, y1 - ny * 27 - uy * 6]];
  fillShape(g, shift(head, 4, 6), SHADOW, 0.4); cel(g, head, "#ffc93a", "#e08d1c", 3); contour(g, head, 3.6, 9474);
});
