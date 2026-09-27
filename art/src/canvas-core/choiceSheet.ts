// PLANCHE SPÉCIMEN · lot 3 : l'écran « choisir » (sea/choice.ts) sur l'eau de l'application : le bouton de l'accueil, les
// exercices, les 13 niveaux de la ligne graduée (le 5 avec la lueur du conseillé), les 7 familles d'additions, la plaque
// des leçons.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER } from "./oceanMarker";
import { drawChooseKey, drawExerciseLessons, drawExerciseLine, drawFamilyTile, drawLessonTile, drawLineTile, drawTileGlow } from "./sea/choice";
import { drawFreeFacts } from "./sea/ui";

const W = 1320, H = 800;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER));
  drawChooseKey(g, 110, 110); drawExerciseLine(g, 330, 110); drawFreeFacts(g, 550, 110); drawExerciseLessons(g, 770, 110);
  drawLessonTile(g, 1000, 110);
  for (let i = 0; i < 13; i++) { const x = 100 + (i % 7) * 170, y = 290 + Math.floor(i / 7) * 150; if (i === 4) drawTileGlow(g, x, y); drawLineTile(g, x, y, i + 1); }
  for (let i = 0; i < 7; i++) drawFamilyTile(g, 100 + i * 170, 640, i + 1);
  void frame;
};
export const choiceSheet: Film = { meta: { title: "Lot 3 · l'écran « choisir »", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
