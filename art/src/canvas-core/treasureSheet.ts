// PLANCHE SPÉCIMEN · les récompenses : le coquillage à quatre moments de son ouverture, l'éclat, les
// étoiles dorée et arc-en-ciel, les boutons récif et maison, puis trois cartes (dos, recto commune avec
// l'illustration provisoire, recto rare, verso).
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { clipped, fillShape, smooth } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { CREATURES } from "./sea/creatures";
import { CARD_H, CARD_W, drawBigShell, drawCardBack, drawCardFront, drawCardVerso, drawGlint, drawGoldStar, drawHomeKey, drawRainbowStar, drawReefKey, WIN } from "./sea/treasure";

const W = 1640, H = 800;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[8, 8], [W - 8, 8], [W - 8, 300], [8, 300]], WATER); });
  [0, 0.35, 0.65, 1].forEach((o, i) => drawBigShell(g, o, 150 + i * 270, 170));
  drawGlint(g, 1130, 90); drawGoldStar(g, 1250, 90); drawRainbowStar(g, 1370, 90); drawReefKey(g, 1250, 220); drawHomeKey(g, 1380, 220);
  const y = 330;
  drawCardBack(g, 20, y);
  const card = (x: number, id: string, rar: string) => { drawCardFront(g, x, y, rar); const c = CREATURES.find((k) => k.id === id)!, [wx, wy, ww, wh] = WIN; clipped(g, smooth([[x + wx, y + wy], [x + wx + ww, y + wy], [x + wx + ww, y + wy + wh], [x + wx, y + wy + wh]], true, 1), () => c.draw(g, (frame % 12) / 12, x + wx + ww / 2 + (c.origin[0] - c.W / 2) * 1.35, c.ground ? y + wy + wh - 26 : y + wy + wh * 0.45, 1.35)); };
  card(360, "crabe", "commune"); card(700, "hippocampe", "rare"); card(1040, "poisson-clown", "commune");
  drawCardVerso(g, 1330, y);
  void CARD_W; void CARD_H;
};
export const treasureSheet: Film = { meta: { title: "Récompenses · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 12 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 12, draw }] };
