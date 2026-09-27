// PLANCHE SPÉCIMEN · lot 2 : le coquillage doré à quatre moments de son ouverture, le reflet irisé d'une
// carte brillante (posé sur une carte de secours, puis seul), les quatre cadeaux du récif sur le sable.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { clipped, fillShape } from "./gallery";
import { SAND, WATER, WATER_D } from "./oceanMarker";
import { CARD_H, CARD_W, drawBigShell, drawCardBanner, drawCardFrame, drawCardWater, drawGift, drawShinySweep, GIFTS, rrect } from "./sea/treasure";

const W = 1720, H = 820;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[8, 8], [W - 8, 8], [W - 8, 300], [8, 300]], WATER); fillShape(g, [[8, 640], [W - 8, 640], [W - 8, H - 8], [8, H - 8]], SAND); });
  [0, 0.35, 0.65, 1].forEach((o, i) => drawBigShell(g, o, 150 + i * 270, 170, true));
  const x = 1140, y = 30; drawCardWater(g, x, y); g.group("plain", () => clipped(g, rrect(x, y, CARD_W, CARD_H, 20), () => drawShinySweep(g, x - 60, y - 40))); drawCardBanner(g, x, y); drawCardFrame(g, x, y, "rare");
  g.group("plain", () => fillShape(g, [[40, 330], [440, 330], [440, 610], [40, 610]], "#0a3f49")); drawShinySweep(g, 50, 40 + 300);
  GIFTS.forEach((id, i) => drawGift(g, id, 560 + i * 150, 720));
  void frame;
};
export const giftsSheet: Film = { meta: { title: "Lot 2 · coquillage doré, brillante, cadeaux", W, H, fps: 8, bpm: 120, durationFrames: 12 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 12, draw }] };
