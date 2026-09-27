// PLANCHE SPÉCIMEN · l'ergonomie du lot 1 bis : « je ne sais pas », « passer », « Encore ! », l'album, les
// pictogrammes de la frise et ses petites bulles, les perles de l'album, la lune « à demain » en décor et
// les trois bulles de l'entraînement libre.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { drawAgainKey, drawAlbumKey, drawDontKnowKey, drawFreeFacts, drawFreeLessons, drawFreeLine, drawMoonDecor, drawPearl, drawProgressDot, drawSkipKey, drawStepGlow, drawStepHello, drawStepLine, drawStepPlus, drawStepShell } from "./sea/ui";
import { drawCord } from "./sea/runtime";
import type { P } from "./core";

const W = 1280, H = 560;
const draw = (ctx: Ctx, _frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[8, 8], [W - 8, 8], [W - 8, 280], [8, 280]], WATER); });
  drawDontKnowKey(g, 100, 100); drawSkipKey(g, 260, 100); drawAgainKey(g, 430, 100); drawAlbumKey(g, 620, 100);
  drawMoonDecor(g, 850, 120);
  // la frise : les quatre pictogrammes plats sur leur corde, la notion du jour en cours (lueur), 8 questions dont 5 faites
  const knots: P[] = [[1000, 200], [1050, 200], [1100, 200], ...Array.from({ length: 8 }, (_, i): P => [1130 + i * 18, 200]), [1290, 200]].map(([x, y]) => [x - 60, y] as P);
  drawCord(ctx, knots);
  drawStepGlow(g, knots[2][0], 200);
  [drawStepHello, drawStepPlus, drawStepLine].forEach((f, i) => f(g, knots[i][0], 200));
  for (let i = 0; i < 8; i++) drawProgressDot(g, knots[3 + i][0], 200, i < 5);
  drawStepShell(g, knots[11][0], 200);
  [drawStepHello, drawStepPlus, drawStepLine, drawStepShell].forEach((f, i) => f(g, 1010 + i * 60, 80));
  for (let i = 0; i < 8; i++) drawProgressDot(g, 60 + i * 28, 240, i < 5);
  for (let i = 0; i < 15; i++) drawPearl(g, 340 + i * 26, 240, i < 6);
  drawFreeLine(g, 200, 420); drawFreeFacts(g, 420, 420); drawFreeLessons(g, 640, 420);
};
export const uiSheet: Film = { meta: { title: "Ergonomie · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
