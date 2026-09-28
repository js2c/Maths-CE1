// PLANCHE SPÉCIMEN · lot 3 bis (A6, B8) : les quinze décors du récif (sea/reefdecor.ts), sur le sable, dans l'ordre où les
// doublons les apportent.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { DECORS, drawDecor } from "./sea/reefdecor";

const W = 1300, H = 780;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); [220, 480, 740].forEach((y) => fillShape(g, [[0, y - 30], [W, y - 30], [W, y + 30], [0, y + 30]], SAND)); });
  Object.keys(DECORS).forEach((id, i) => drawDecor(g, id, 130 + (i % 5) * 260, 220 + Math.floor(i / 5) * 260));
  void frame;
};
export const decorsSheet: Film = { meta: { title: "Lot 3 bis · les décors du récif", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
