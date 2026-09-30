// PLANCHE SPÉCIMEN · lot 3 ter (sea/lot3ter.ts) sur l'eau et le sable de l'application : le bouton « passer l'échauffement »
// à la taille de l'écran, à côté de « passer » (qui ne change pas), de la coche qui
// confirme et de « je ne sais pas ».
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawCheck } from "./sea/decor";
import { drawShrugKey } from "./sea/lot3bis";
import { drawSkipKey } from "./sea/ui";
import { drawWarmupSkipKey } from "./sea/lot3ter";

const W = 900, H = 520;
const draw = (ctx: Ctx, _frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 330], [W, 330], [W, H], [0, H]], SAND); });
  // à la taille de l'écran (contrôle des détails : `--scale 6`)
  drawWarmupSkipKey(g, 90, 90);
  drawSkipKey(g, 420, 90); drawWarmupSkipKey(g, 560, 90); drawCheck(g, 700, 90); drawShrugKey(g, 830, 90);
  drawWarmupSkipKey(g, 420, 420); drawCheck(g, 560, 420);
};
export const lot3terSheet: Film = { meta: { title: "Lot 3 ter", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
