// PLANCHE SPÉCIMEN · lot 2, étape 8 : les centaines. Le filet de dix poissons, le chalut vide, avec 3 filets et
// plein (10 filets), et le petit chalut des graduations de centaines sur une ligne d'école.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER } from "./oceanMarker";
import { drawFishNet, drawTrawl } from "./sea/hundreds";
import { drawLine } from "./sea/runtime";

const W = 1280, H = 720;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER));
  drawFishNet(g, 40, 60);
  [0, 3, 10].forEach((k, i) => drawTrawl(g, 380 + i * 300, 40, k));
  const labels = Array.from({ length: 11 }, (_, i) => (i % 5 === 0 ? String(i * 100) : null));
  drawLine(ctx, { x0: 150, x1: 1134, y: 520, n: 11, labels, k: 1, centaines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
  void frame;
};
export const hundredsSheet: Film = { meta: { title: "Lot 2 · les centaines", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
