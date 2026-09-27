// PLANCHE SPÉCIMEN · lot 3 : le calcul rapide (sea/calc.ts et runtime.ts) sur l'eau de l'application : le mur de corail
// (tel que l'application le dessine, cases 38 px), le poisson jaune sur 44 après la descente depuis 34, le mur des dizaines
// et des unités en couleurs (leçon L7), le chemin 38 → + 2 → 40 → + 3 → 43 (un caillou à trouver), les pictogrammes et
// les neuf plaques de niveaux, le poisson en quatre images de sa boucle.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER } from "./oceanMarker";
import { drawBridge, drawStone, drawWall, wallCell, type WallSpec } from "./sea/runtime";
import { drawCalcTile, drawExerciseCalc, drawStepCalc, drawWallFish } from "./sea/calc";

const W = 1700, H = 1080;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER));
  const c2 = ctx as unknown as CanvasRenderingContext2D;
  const A: WallSpec = { x: 40, y: 40, cell: 38, gap: 3, lit: [34, 44] };
  drawWall(c2, A);
  const [fx, fy] = wallCell(A, 44); drawWallFish(g, 0, fx, fy, 1, 34);
  drawWall(c2, { x: 520, y: 40, cell: 38, gap: 3, split: true });
  // le chemin
  const xs = [1060, 1250, 1440], y = 170;
  drawBridge(c2, [xs[0], y], [xs[1], y], "+2", { lit: true }); drawBridge(c2, [xs[1], y], [xs[2], y], "+3");
  drawStone(c2, xs[0], y, "38"); drawStone(c2, xs[1], y, "40", { lit: true }); drawStone(c2, xs[2], y, "?", { ask: true });
  drawBridge(c2, [1060, 330], [1250, 330], "−2", { p: 0.6 }); drawStone(c2, 1060, 330, "42"); drawStone(c2, 1250, 330, "", { ask: true });
  drawExerciseCalc(g, 1150, 520); drawStepCalc(g, 1320, 520);
  for (let i = 0; i < 4; i++) drawWallFish(g, i * 3, 1430 + (i % 2) * 90, 480 + Math.floor(i / 2) * 60, i < 2 ? 1 : -1, 40);
  for (let i = 0; i < 9; i++) drawCalcTile(g, 110 + i * 172, 980, i + 1);
  void frame;
};
export const calcSheet: Film = { meta: { title: "Lot 3 · le calcul rapide", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
