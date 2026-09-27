// LE CALCUL RAPIDE (lot 3, étape 3 ; docs/SPEC-LOT3.md, section 6) : ce qui est fabriqué à l'avance. Le mur de
// corail, les cailloux et les ponts du chemin changent à chaque question : ils sont dessinés en direct par
// runtime.ts (drawWall, drawStone, drawBridge). Ici :
//   - le PETIT POISSON JAUNE qui se déplace sur le mur (descendre = + 10, monter = − 10, glisser d'une case = ± 1) : la
//     silhouette des poissons de la scène (ocean.ts, fishShape), en jaune, à la taille d'une case ; sa queue bat en
//     12 images (boucle sans raccord), de face vers la droite ou vers la gauche ;
//   - le pictogramme du calcul rapide pour l'écran « choisir » (un coin du mur de corail et le poisson), celui de la
//     frise (plat, sans bulle), et une plaque par niveau (1 à 9) avec un calcul du niveau à l'ardoise.
// Même main que le reste (oceanMarker.ts) : aplats, une ombre nette, contour épais côté ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";
import { rrect } from "./treasure";
import { drawWord, wordWidth } from "./runtime";
import { TILE_H, TILE_R, TILE_W } from "./choice";

const SH = "#0a3f49", YELLOW: [string, string] = ["#ffd84a", "#e0a21c"], CORAL = "#ff8f70", CORAL_S = "#d0573f", CELL = "#fff4e6";
export const WALL_FISH_N = 12;
// le petit poisson jaune, centré sur (cx, cy), longueur `len`, tourné vers `dir` ; f : image de la boucle (0 à 11)
export const drawWallFish = (g: Gfx, f: number, cx: number, cy: number, dir: 1 | -1 = 1, len = 40) => g.group("plain", () => {
  const fish: O.Fish = { c: [cx, cy], len, dir, tilt: 0, color: 1, wag: 0.3 * Math.sin((2 * Math.PI * f) / WALL_FISH_N) };
  const s = O.fishShape(fish), [lit, sh] = YELLOW, w = Math.max(2, len / 22);
  fillShape(g, shift(s.body, 3, 4), SH, 0.25);
  [s.tail, s.fin].forEach((p, q) => { cel(g, p, lit, sh, 2); contour(g, p, w * 0.8, 7600 + q); });
  cel(g, s.body, lit, sh, 3);
  clipped(g, s.body, () => { fillShape(g, s.stripe, "#fffaf0"); ink(g, s.stripe, INK, { w: w * 0.5, closed: true, shadow: 0, seed: 7610 }); });
  fillShape(g, blob(s.eye[0], s.eye[1], s.eyeR, s.eyeR, 7620, 0.05, 10), INK); fillShape(g, blob(s.eye[0] - s.eyeR * 0.3, s.eye[1] - s.eyeR * 0.35, s.eyeR * 0.38, s.eyeR * 0.38, 7621, 0.05, 8), "#ffffff");
  ink(g, s.mouth, mix(sh, INK, 0.5), { w: w * 0.45, shadow: 0, taper: [0.3, 0.3], seed: 7622 }, 0.9);
  contour(g, s.body, w, 7623);
});

// un coin du mur de corail, en petit : `rows` × `cols` cases, la case (lr, lc) allumée
const miniWall = (g: Gfx, x: number, y: number, cell: number, rows: number, cols: number, lit: [number, number] | null, seed: number) => {
  const gap = cell * 0.12, W = cols * cell + (cols - 1) * gap, H = rows * cell + (rows - 1) * gap, pad = cell * 0.3;
  const slab = rrect(x - pad, y - pad, W + 2 * pad, H + 2 * pad, cell * 0.4);
  fillShape(g, shift(slab, 4, 5), SH, 0.28); cel(g, slab, CORAL, CORAL_S, 4); contour(g, slab, 3, seed);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = x + c * (cell + gap), cy = y + r * (cell + gap), s = rrect(cx, cy, cell, cell, cell * 0.24), on = lit && lit[0] === r && lit[1] === c;
    fillShape(g, shift(s, -1.5, -1.5), "#a63e2e", 0.55); fillShape(g, s, on ? "#ffe45c" : CELL); ink(g, s, on ? "#e0a21c" : "#d9b8a4", { w: 1.2, closed: true, shadow: 0.4, seed: seed + 1 + r * cols + c });
  }
  return { cellAt: (r: number, c: number): P => [x + c * (cell + gap) + cell / 2, y + r * (cell + gap) + cell / 2] };
};

// le pictogramme du calcul rapide (écran « choisir ») : un coin du mur, le poisson qui descend d'une rangée (+ 10)
export const drawExerciseCalc = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 27, 70);
  let at: (r: number, c: number) => P = () => [0, 0];
  g.group("plain", () => { at = miniWall(g, cx - 46, cy - 40, 20, 3, 4, [2, 1], 7640).cellAt; });
  const [ax, ay] = at(0, 1), [bx, by] = at(2, 1);
  // la flèche de la descente (une rangée plus bas : + 10), jaune cernée d'encre
  g.group("plain", () => { const p: P[] = [[ax + 16, ay], [ax + 22, (ay + by) / 2], [bx + 16, by - 4]]; ink(g, p, INK, { w: 7, shadow: 0, taper: [0.1, 0.1], seed: 7650 }, 0.4); ink(g, p, "#ffe45c", { w: 4.6, shadow: 0, taper: [0.1, 0.1], seed: 7651 }); });
  drawWallFish(g, 3, ax - 2, ay, 1, 30);
};
// le pictogramme plat de la frise (sans bulle, comme les autres étapes) : trois cases de mur et le poisson
export const drawStepCalc = (g: Gfx, cx: number, cy: number) => {
  g.group("plain", () => miniWall(g, cx - 13, cy - 13, 8, 3, 3, [1, 1], 7660));
  drawWallFish(g, 2, cx + 1, cy - 1, 1, 16);
};
// une plaque par niveau (1 à 9) : l'ardoise avec un calcul du niveau (les exemples de docs/SPEC.md)
export const CALC_EXAMPLES = ["47+2", "34+10", "23+30", "34+5", "38−5", "34+9", "38+5", "23+14", "42−5"];
export const drawCalcTile = (g: Gfx, cx: number, cy: number, level: number) => {
  g.group("plain", () => {
    const s = rrect(cx - TILE_W / 2, cy - TILE_H / 2, TILE_W, TILE_H, TILE_R);
    fillShape(g, shift(s, 6, 8), SH, 0.28); cel(g, s, "#fffaf0", "#e3d6bb", 6); contour(g, s, 3.6, 7670 + level);
    const sl = rrect(cx - 62, cy - 34, 124, 68, 12);
    fillShape(g, shift(sl, 3, 4), SH, 0.25); cel(g, sl, "#2f6d78", "#21545d", 3); contour(g, sl, 3, 7680 + level);
    const t = CALC_EXAMPLES[level - 1], em = Math.min(34, 104 / wordWidth(t));
    drawWord(g.cur as CanvasRenderingContext2D, t, cx, cy - em / 2, em, { color: "#fffaf0", w: em * 0.14, seed: 7690 + level });
    g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]);
  });
};
