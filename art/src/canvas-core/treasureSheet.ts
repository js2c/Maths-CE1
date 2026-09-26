// PLANCHE SPÉCIMEN · les récompenses : le coquillage à quatre moments de son ouverture, l'éclat, les
// étoiles dorée et arc-en-ciel, les boutons récif et maison, puis les cartes : le dos de secours, les
// trois cadres (nacre, argent, or) avec le bandeau du nom sur le fond de secours, un verso.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { clipped, fillShape, smooth } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { CARD_H, CARD_W, drawBigShell, drawCardBack, drawCardBanner, drawCardFrame, drawCardVerso, drawCardWater, drawGlint, drawGoldStar, drawHomeKey, drawRainbowStar, drawReefKey } from "./sea/treasure";

const W = 1720, H = 800;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[8, 8], [W - 8, 8], [W - 8, 300], [8, 300]], WATER); });
  [0, 0.35, 0.65, 1].forEach((o, i) => drawBigShell(g, o, 150 + i * 270, 170));
  drawGlint(g, 1130, 90); drawGoldStar(g, 1250, 90); drawRainbowStar(g, 1370, 90); drawReefKey(g, 1250, 220); drawHomeKey(g, 1380, 220);
  const y = 340;
  drawCardBack(g, 10, y);
  ["commune", "rare", "legendaire"].forEach((r, i) => { const x = 360 + i * 340; drawCardWater(g, x, y); drawCardBanner(g, x, y); drawCardFrame(g, x, y, r); });
  drawCardVerso(g, 1380, y);
  void CARD_W; void CARD_H; void frame; void clipped; void smooth;
};
export const treasureSheet: Film = { meta: { title: "Récompenses · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 12 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 12, draw }] };
