// LA MULTIPLICATION (lot « Multiplication » ; docs/maquettes/multiplication/PROPOSITION.md) : ce qui est fabriqué à l'avance.
// Les rangées de poissons d'une question changent à chaque fois : l'application les compose avec les poissons des aides
// (app/js/modules/mult/screen.js, paintRows). Ici, dans la main du reste (aplats, une ombre nette, contour épais côté ombre) :
//   - le pictogramme de l'exercice pour l'écran « choisir » : trois rangées de quatre poissons sur une plaque de nacre, et le
//     signe « × » ;
//   - celui de la frise (plat, sans bulle) : trois rangées de pastilles et une petite croix ;
//   - une plaque par niveau (1 à 9) : le numéro en grand, un calcul du niveau à l'ardoise (comme le calcul rapide) ;
//   - les vignettes des leçons L13 (trois rangées de quatre, comptées : 4, 8, 12) et L14 (l'image qui tourne : 3 × 5 et 5 × 3).
import type { Gfx, P } from "../core";
import { blob, fillShape, ink } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";
import { rrect } from "./treasure";
import { drawNumber, drawWord, wordWidth } from "./runtime";
import { drawTileNumber, TILE_H, TILE_R, TILE_W, VIGN_Y } from "./choice";

const SH = "#0a3f49", ORANGE = "#ffb13b", BLUE = "#5cb8f0", LIT = "#ffe45c";
// une pastille-poisson (à cette taille, un poisson ne se lit plus : une pastille ronde cernée, comme les vignettes des familles)
const dot = (g: Gfx, x: number, y: number, r: number, col: string, seed: number) => { const s = blob(x, y, r, r * 0.85, seed, 0.05, 10); fillShape(g, s, col); ink(g, s, INK, { w: Math.max(1.2, r * 0.26), closed: true, shadow: 0.5, seed: seed + 1 }); };
// a rangées de b pastilles, centrées en (cx, cy), au pas `p` ; les `lit` premières rangées orange, les autres bleues
export const dotRows = (g: Gfx, cx: number, cy: number, a: number, b: number, p: number, lit = a, seed = 9700) => {
  const x0 = cx - ((b - 1) * p) / 2, y0 = cy - ((a - 1) * p) / 2;
  for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) dot(g, x0 + j * p, y0 + i * p, p * 0.36, i < lit ? ORANGE : BLUE, seed + i * 13 + j);
};
// le signe « × », deux traits d'encre épais en croix penchée
const cross = (g: Gfx, cx: number, cy: number, r: number, seed: number, col = INK) => [0, Math.PI / 2].forEach((a, i) => { const c = Math.cos(a + Math.PI / 4) * r, d = Math.sin(a + Math.PI / 4) * r; ink(g, [[cx - c, cy - d], [cx + c, cy + d]], col, { w: r * 0.55, shadow: 0.3, taper: [0.1, 0.12], seed: seed + i, min: 0.7 }); });

// le pictogramme de l'exercice (écran « choisir ») : trois rangées de quatre sur une plaque, le « × » à côté
export const drawExerciseMult = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 28, 70);
  g.group("plain", () => {
    const s = rrect(cx - 52, cy - 34, 76, 62, 12);
    fillShape(g, shift(s, 3, 4), SH, 0.25); cel(g, s, "#fffaf0", "#e3d6bb", 3); contour(g, s, 2.6, 9600);
    dotRows(g, cx - 14, cy - 3, 3, 4, 17, 3, 9610);
    cross(g, cx + 38, cy - 2, 11, 9620);
  });
};
// le pictogramme plat de la frise : trois rangées de trois pastilles crème et une petite croix
export const drawStepMult = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) fillShape(g, blob(cx - 13 + j * 8, cy - 8 + i * 8, 2.9, 2.6, 9630 + i * 3 + j, 0.05, 8), i === 0 ? "#ffc93a" : "#fff4de");
  cross(g, cx + 11, cy, 5.4, 9640, "#ff9a86");
});
// une plaque par niveau : l'ardoise avec un calcul du niveau
export const MULT_EXAMPLES = ["4+4+4", "3×4", "2×7", "10×4", "5×6", "5×3=3×5", "3×7", "4×6", "?×5=20"];
export const drawMultTile = (g: Gfx, cx: number, cy: number, level: number) => {
  g.group("plain", () => {
    const s = rrect(cx - TILE_W / 2, cy - TILE_H / 2, TILE_W, TILE_H, TILE_R);
    fillShape(g, shift(s, 6, 8), SH, 0.28); cel(g, s, "#fffaf0", "#e3d6bb", 6); contour(g, s, 3.6, 9650 + level);
    const sy = cy + VIGN_Y + 4, sl = rrect(cx - 60, sy - 22, 120, 44, 10);
    fillShape(g, shift(sl, 3, 4), SH, 0.25); cel(g, sl, "#2f6d78", "#21545d", 3); contour(g, sl, 2.6, 9660 + level);
    const t = MULT_EXAMPLES[level - 1], em = Math.min(24, 100 / wordWidth(t));
    drawWord(g.cur as CanvasRenderingContext2D, t, cx, sy - em / 2, em, { color: "#fffaf0", w: em * 0.14, seed: 9670 + level });
    drawTileNumber(g, cx, cy, level);
    g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]);
  });
};
// les vignettes des leçons (autour de (0, 0), dans une boîte d'environ 200 × 100, comme celles de sea/lecons.ts)
// L13 · Des rangées égales : trois rangées de quatre, comptées (4, 8, 12 écrits au bout)
export const vL13 = (g: Gfx) => {
  dotRows(g, -26, -4, 3, 4, 24, 3, 9680);
  [4, 8, 12].forEach((v, i) => drawNumber(g.cur as CanvasRenderingContext2D, String(v), 52, -4 + (i - 1) * 24 - 10, 20, { w: 3.2, seed: 9690 + i }));
};
// L14 · On tourne les rangées : trois rangées de cinq, une flèche courbe qui tourne, cinq rangées de trois
export const vL14 = (g: Gfx) => {
  dotRows(g, -56, 8, 3, 5, 15, 3, 9700);
  const arc: P[] = Array.from({ length: 9 }, (_, i) => { const t = Math.PI * (0.92 - (0.8 * i) / 8); return [-4 + Math.cos(t) * 24, -10 - Math.sin(t) * 20] as P; });
  const [hx, hy] = arc[8], head: P[] = [[hx - 10, hy - 6], [hx + 3, hy + 1], [hx - 6, hy + 11]];
  ink(g, arc, INK, { w: 6.5, shadow: 0, taper: [0.1, 0.02], seed: 9710 });
  ink(g, head, INK, { w: 6, shadow: 0, taper: [0.05, 0.05], seed: 9712 });
  ink(g, arc, LIT, { w: 3.2, shadow: 0, taper: [0.1, 0.02], seed: 9711 });
  dotRows(g, 50, 0, 5, 3, 15, 5, 9720);
};
