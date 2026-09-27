// PLANCHE SPÉCIMEN · lot 2 : le sélecteur de difficulté (quatre crans, la lueur du conseillé), puis les mêmes
// bulles sans étoiles (entraînement libre), sur l'eau de l'application.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER } from "./oceanMarker";
import { drawCranGlow, drawCranKey } from "./sea/selector";

const W = 1160, H = 560;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER));
  drawCranGlow(g, 140 + 290, 140);
  [0, 1, 2, 3].forEach((lv) => drawCranKey(g, 140 + lv * 290, 140, lv));
  [0, 1, 2, 3].forEach((lv) => drawCranKey(g, 140 + lv * 290, 410, lv, false));
  void frame;
};
export const selectorSheet: Film = { meta: { title: "Lot 2 · sélecteur de difficulté", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
