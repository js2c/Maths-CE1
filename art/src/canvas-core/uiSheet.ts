// PLANCHE SPÉCIMEN · l'ergonomie du lot 1 bis : « je ne sais pas », « passer », « Encore ! », l'album, les
// pictogrammes de la frise et ses petites bulles, les perles de l'album, la lune « à demain » en décor et
// les trois bulles de l'entraînement libre.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { drawAgainKey, drawAlbumKey, drawDontKnowKey, drawFreeFacts, drawFreeLessons, drawFreeLine, drawMoonDecor, drawPearl, drawProgressDot, drawSkipKey, drawStepHello, drawStepLine, drawStepPlus, drawStepShell } from "./sea/ui";

const W = 1280, H = 560;
const draw = (ctx: Ctx, _frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[8, 8], [W - 8, 8], [W - 8, 280], [8, 280]], WATER); });
  drawDontKnowKey(g, 100, 100); drawSkipKey(g, 260, 100); drawAgainKey(g, 430, 100); drawAlbumKey(g, 620, 100);
  drawMoonDecor(g, 850, 120);
  [drawStepHello, drawStepPlus, drawStepLine, drawStepShell].forEach((f, i) => f(g, 1030 + (i % 2) * 90, 70 + Math.floor(i / 2) * 90));
  for (let i = 0; i < 8; i++) drawProgressDot(g, 60 + i * 28, 240, i < 5);
  for (let i = 0; i < 15; i++) drawPearl(g, 340 + i * 26, 240, i < 6);
  drawFreeLine(g, 200, 420); drawFreeFacts(g, 420, 420); drawFreeLessons(g, 640, 420);
};
export const uiSheet: Film = { meta: { title: "Ergonomie · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
