// LES VOILIERS (lot « Les voiliers », docs/SPEC.md, section 7 bis) : ce que l'atelier dessine pour l'application. Le jeu
// lui-même (la mer, les bateaux, les bouées) est la maquette art/voiliers/, transportée telle quelle (tools/export-voiliers.mjs) ;
// ici, seulement ce qui l'annonce dans l'application, de la même main que le reste (oceanMarker.ts : aplats, une ombre
// nette, contour qui s'épaissit du côté de l'ombre, lumière en haut à gauche) :
//   - le pictogramme de l'exercice (écran « choisir ») : un voilier qui passe entre deux bouées, sur une vague ;
//   - une plaque par niveau (1 à 9) : son numéro en grand, et dessous la rangée de bouées du niveau avec leurs nombres et
//     le voilier au-dessus du bon passage (les exemples de module4.json et de la légende) ; au niveau 9, la rangée des
//     centaines au loin, celle des dizaines devant ;
//   - le pictogramme plat de la frise (une voile et sa coque, sans contour).
// Le voilier : coque rouge à liston crème, mât, grand-voile et foc de nacre, le nombre sur la grand-voile (comme les bateaux
// de la maquette) ; les bouées : rouges et jaunes, coiffées d'un voyant, posées sur l'eau avec leur petit remous.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";
import { drawNumber } from "./runtime";
import { drawTileNumber, inside, plaque, TILE_H, TILE_W, underline } from "./choice";

const SH = "#0a3f49", NACRE = "#fffaf0", NACRE_S = "#e3d6bb", HULL: [string, string] = ["#ef5b45", "#b9372a"], WATER = "#7fd3df", WATER_D = "#3a9fb0";
const BUOY: [string, string][] = [["#ff6a52", "#c23d2c"], ["#ffd23a", "#d79a17"]];

// un voilier, la quille en (cx, cy) (la ligne de flottaison), tourné vers la droite ; k : l'échelle (1 : 80 px de haut)
export const drawSailboat = (g: Gfx, cx: number, cy: number, k: number, num: string | null, seed: number) => g.group("plain", () => {
  const p = (x: number, y: number): P => [cx + x * k, cy + y * k];
  // la coque : un pont presque droit, l'étrave relevée à droite, le fond arrondi
  const hull = smooth([p(-34, -10), p(-6, -8), p(26, -9), p(42, -15), p(34, -3), p(20, 6), p(-18, 7), p(-31, 1)], true, 6);
  // grand-voile (derrière le mât, vers l'arrière) et foc (devant), leur chute légèrement creusée
  const main = smooth([p(-1, -72), p(-4, -40), p(-30, -14), p(-2, -13)], true, 6);
  const jib = smooth([p(3, -66), p(14, -40), p(34, -16), p(4, -15)], true, 6);
  fillShape(g, shift(hull, 4 * k, 5 * k), SH, 0.25);
  [main, jib].forEach((s, i) => { fillShape(g, shift(s, 3 * k, 4 * k), SH, 0.18); cel(g, s, NACRE, NACRE_S, 4 * k); contour(g, s, Math.max(1.6, 2.6 * k), seed + i); });
  // les coutures de la grand-voile
  for (let i = 1; i < 3; i++) ink(g, [p(-4 + i * 0.8, -72 + i * 18), p(-2 - i * 9, -13 - i * 0.5)], mix(NACRE_S, INK, 0.25), { w: Math.max(0.8, 1.1 * k), shadow: 0, taper: [0.3, 0.3], seed: seed + 5 + i }, 0.7);
  // le mât et la bôme
  ink(g, [p(0, -76), p(0, -9)], INK, { w: Math.max(1.6, 3 * k), shadow: 0, taper: [0.2, 0], seed: seed + 3 });
  ink(g, [p(-31, -12), p(1, -11)], INK, { w: Math.max(1.2, 2.2 * k), shadow: 0, taper: [0.1, 0.1], seed: seed + 4 });
  cel(g, hull, HULL[0], HULL[1], 4 * k);
  clipped(g, hull, () => ink(g, smooth([p(-34, -6), p(0, -4.5), p(40, -10)], false, 6), NACRE, { w: Math.max(1.4, 2.4 * k), shadow: 0, seed: seed + 8 }));
  contour(g, hull, Math.max(1.8, 3 * k), seed + 9);
  // le nombre, sur la grand-voile
  if (num) drawNumber(g.cur as CanvasRenderingContext2D, num, cx - 12 * k, cy - 46 * k, Math.min(24 * k, 40 * k / Math.max(2, num.length) * 1.4), { color: INK, w: Math.max(1.2, 3.4 * k), seed: seed + 10 });
  // le remous au pied de la coque
  ink(g, smooth([p(-40, 7), p(-20, 10), p(0, 9), p(22, 10), p(46, 6)], false, 6), "#ffffff", { w: Math.max(1.2, 2.2 * k), shadow: 0, taper: [0.3, 0.3], seed: seed + 11 }, 0.85);
  g.mark([p(-44, -78), p(48, 12)]);
});
// une bouée posée sur l'eau en (x, y) ; k : l'échelle (1 : 34 px de haut) ; c : sa couleur (0 rouge, 1 jaune)
export const drawBuoy = (g: Gfx, x: number, y: number, k: number, c: number, seed: number) => g.group("plain", () => {
  const p = (dx: number, dy: number): P => [x + dx * k, y + dy * k];
  const body = smooth([p(-11, 0), p(-9, -14), p(-4, -22), p(4, -22), p(9, -14), p(11, 0), p(0, 4)], true, 5);
  fillShape(g, shift(body, 3 * k, 3 * k), SH, 0.22);
  cel(g, body, BUOY[c][0], BUOY[c][1], 3 * k);
  clipped(g, body, () => fillShape(g, smooth([p(-12, -11), p(12, -11), p(12, -6), p(-12, -6)], true, 2), NACRE));
  contour(g, body, Math.max(1.4, 2.4 * k), seed);
  // le voyant au sommet
  ink(g, [p(0, -22), p(0, -29)], INK, { w: Math.max(1.1, 1.8 * k), shadow: 0, seed: seed + 1 });
  const top = blob(x, y - 31 * k, 3.6 * k, 3.6 * k, seed + 2, 0.05, 10); cel(g, top, BUOY[1 - c][0], BUOY[1 - c][1], 1.4 * k); contour(g, top, Math.max(1, 1.6 * k), seed + 3);
  ink(g, smooth([p(-15, 3), p(0, 6), p(15, 3)], false, 5), "#ffffff", { w: Math.max(1, 1.8 * k), shadow: 0, taper: [0.3, 0.3], seed: seed + 4 }, 0.85);
});
// une vague : la surface de l'eau, de x0 à x1, ondulée
const vague = (g: Gfx, x0: number, x1: number, y: number, a: number, w: number, seed: number) => {
  const pts: P[] = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([x0 + (x1 - x0) * t, y + a * Math.sin(t * Math.PI * 4 + seed)]); }
  ink(g, smooth(pts, false, 6), WATER_D, { w: w + 1.4, shadow: 0, taper: [0.2, 0.2], seed }, 0.5);
  ink(g, smooth(pts, false, 6), WATER, { w, shadow: 0, taper: [0.2, 0.2], seed: seed + 1 });
};

// ---------------------------------------------------------------- le pictogramme de l'exercice (écran « choisir »)
export const drawExerciseVoiliers = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 28, 70);
  g.group("plain", () => clipped(g, blob(cx, cy, 64, 64, 300 + 28, 0.02, 20), () => {
    fillShape(g, smooth([[cx - 70, cy + 26], [cx, cy + 22], [cx + 70, cy + 26], [cx + 70, cy + 70], [cx - 70, cy + 70]], true, 4), "#bfeef3", 0.9);
    vague(g, cx - 64, cx + 64, cy + 24, 2, 3, 7710);
  }));
  drawBuoy(g, cx - 44, cy + 26, 0.85, 0, 7720);
  drawBuoy(g, cx + 44, cy + 26, 0.85, 1, 7725);
  drawSailboat(g, cx + 2, cy + 24, 0.78, null, 7730);
  g.group("plain", () => g.mark([[cx - 70, cy - 70], [cx + 70, cy + 70]]));
};
// le pictogramme plat de la frise : une voile crème et sa coque corail, sans contour (comme les autres étapes)
export const drawStepVoiliers = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  fillShape(g, smooth([[cx - 1, cy - 15], [cx - 3, cy - 2], [cx - 13, cy + 5], [cx - 1, cy + 5]], true, 4), "#fff4de");
  fillShape(g, smooth([[cx + 2, cy - 13], [cx + 7, cy - 2], [cx + 13, cy + 5], [cx + 2, cy + 5]], true, 4), "#ffe2c6");
  fillShape(g, smooth([[cx - 15, cy + 7], [cx + 14, cy + 6], [cx + 17, cy + 3], [cx + 12, cy + 12], [cx - 11, cy + 13]], true, 4), "#ff9a86");
  ink(g, smooth([[cx - 16, cy + 16], [cx - 6, cy + 14.5], [cx + 4, cy + 16], [cx + 16, cy + 14.5]], false, 5), "#fff4de", { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 7740 });
});

// ---------------------------------------------------------------- les plaques des niveaux
// la rangée de chaque niveau (les exemples de module4.json et de la légende) : les bouées, leurs nombres, le bon passage
export const VOILIER_TILES: Record<number, { bouees: number[]; num: number; loin?: number[] }> = {
  1: { bouees: [40, 50, 60], num: 45 },
  2: { bouees: [23, 28, 34], num: 31 },
  3: { bouees: [300, 400, 500], num: 450 },
  4: { bouees: [530, 540, 550, 560], num: 534 },
  5: { bouees: [600, 700, 800, 900], num: 698 },
  6: { bouees: [412, 417, 425, 431], num: 426 },
  7: { bouees: [350, 360, 370, 380, 390], num: 369 },
  8: { bouees: [240, 250, 350, 357, 367], num: 349 },
  9: { bouees: [340, 350], num: 347, loin: [300, 400] },
};
// (chaque bouée et le voilier sont des groupes à eux : un groupe se compose sur la planche à sa fin, donc après les dessins
// des groupes déjà fermés ; le fond, puis les bouées, puis le voilier, puis les nombres)
export const drawVoiliersTile = (g: Gfx, cx: number, cy: number, level: number) => {
  plaque(g, cx, cy, 7750 + level);
  const T = VOILIER_TILES[level], n = T.bouees.length, k = T.bouees.findIndex((b) => b > T.num), pass = k < 0 ? n : k;
  // (relecture du lot : la rangée de chaque niveau, 3, 4 ou 5 bouées, sans que les nombres débordent de la plaque)
  const wy = cy + 43, x0 = cx - 64, x1 = cx + 64, m = T.bouees.length >= 5 ? 14 : T.bouees.length === 4 ? 13 : 10;
  const xs = T.bouees.map((_, i) => (n === 2 ? cx + (i ? 30 : -30) : x0 + m + ((x1 - x0 - 2 * m) * i) / (n - 1)));
  const bx = pass === 0 ? xs[0] - 22 : pass === n ? xs[n - 1] + 22 : (xs[pass - 1] + xs[pass]) / 2, kb = T.loin || n >= 5 ? 0.3 : 0.34, by = wy - (T.loin ? 6 : n >= 5 ? 16 : 13);
  const farX = (i: number) => (i ? x1 - 16 : x0 + 16);
  // le ciel pâle (les voiles blanches s'y détachent) et l'eau, découpés par la plaque
  g.group("plain", () => clipped(g, inside(cx, cy), () => {
    underline(g, cx, cy, 7760 + level);
    fillShape(g, smooth([[x0 - 4, cy - 1], [x1 + 4, cy - 1], [x1 + 8, wy], [x0 - 8, wy]], true, 3), "#e2f3f9");
    fillShape(g, [[x0 - 8, wy - 2], [x1 + 8, wy - 2], [x1 + 8, cy + 70], [x0 - 8, cy + 70]], "#cdeff4");
    if (T.loin) vague(g, x0 + 2, x1 - 2, cy + 22, 0.8, 1.6, 7765); // au niveau 9 : la rangée des centaines, au loin
    vague(g, x0, x1, wy, 1.2, 2.2, 7780 + level);
  }));
  T.loin?.forEach((_, i) => drawBuoy(g, farX(i), cy + 22, 0.28, i % 2, 7770 + i));
  T.bouees.forEach((_, i) => drawBuoy(g, xs[i], wy, n >= 5 ? 0.42 : 0.5, i % 2, 7790 + level * 10 + i));
  // le voilier au-dessus du bon passage (le geste de l'enfant), son nombre en rouge au-dessus du mât
  drawSailboat(g, bx, by, kb, null, 7830 + level);
  g.group("plain", () => {
    const ctx = g.cur as CanvasRenderingContext2D, em = n >= 5 ? (T.bouees.some((b) => b >= 100) ? 8.5 : 9.5) : n === 4 ? (T.bouees.some((b) => b >= 100) ? 10 : 11) : 12.5;
    clipped(g, inside(cx, cy), () => {
      T.loin?.forEach((b, i) => drawNumber(ctx, String(b), farX(i) + (i ? -22 : 22), cy + 12, 10, { color: mix(INK, "#ffffff", 0.3), w: 1.6, seed: 7772 + i }));
      T.bouees.forEach((b, i) => drawNumber(ctx, String(b), xs[i], wy + 4, em, { color: INK, w: em * 0.17, seed: 7800 + level * 10 + i }));
      const t = String(T.num), en = t.length > 2 ? 12 : 13;
      drawNumber(ctx, t, bx - 1, by - 80 * kb - en - 1, en, { color: "#e5412e", w: en * 0.19, seed: 7840 + level });
    });
    drawTileNumber(g, cx, cy, level);
    g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]);
  });
};
