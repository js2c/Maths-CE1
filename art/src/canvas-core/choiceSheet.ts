// PLANCHE SPÉCIMEN · lot 3 : l'écran « choisir » (sea/choice.ts) sur l'eau de l'application : le bouton de l'accueil, les
// exercices, les 13 niveaux de la ligne graduée (le 5 avec la lueur du conseillé), les 7 familles d'additions, la plaque
// des leçons. Lot 3 bis (B1) : les plaques numérotées, et le chemin de cailloux des neuf niveaux du calcul rapide.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawChooseKey, drawExerciseLine, drawFamilyTile, drawLineTile, drawTileGlow } from "./sea/choice";
import { CALC_STOPS, drawCalcTile, drawStonePath } from "./sea/calc";
import { drawFreeFacts } from "./sea/ui";

const W = 1320, H = 1480;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 820], [W, 820], [W, H], [0, H]], SAND); });
  drawChooseKey(g, 110, 110); drawExerciseLine(g, 330, 110); drawFreeFacts(g, 550, 110);
  for (let i = 0; i < 13; i++) { const x = 100 + (i % 7) * 170, y = 300 + Math.floor(i / 7) * 160; if (i === 4) drawTileGlow(g, x, y); drawLineTile(g, x, y, i + 1); }
  for (let i = 0; i < 7; i++) drawFamilyTile(g, 100 + i * 170, 650, i + 1);
  const ox = 300, oy = 980; drawStonePath(g.cur as CanvasRenderingContext2D, ox, oy);
  CALC_STOPS.forEach(([x, y], i) => { if (i === 2) drawTileGlow(g, ox + x, oy + y); drawCalcTile(g, ox + x, oy + y, i + 1); });
  void frame;
};
export const choiceSheet: Film = { meta: { title: "Lot 3 · l'écran « choisir »", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
