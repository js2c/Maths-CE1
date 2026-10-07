// PLANCHE SPÉCIMEN · lot « Multiplication » (docs/maquettes/multiplication/PROPOSITION.md) sur l'eau de l'application : le
// pictogramme de l'exercice et celui de la frise, les neuf plaques de niveaux (avec, pour comparer, deux plaques du calcul
// rapide), les plaques des leçons L13 et L14 et de la table de multiplication, la rangée du menu, les bulles « À toi ! ».
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawCalcTile } from "./sea/calc";
import { drawExerciseMult, drawMultTile, drawStepMult } from "./sea/mult";
import { drawAToiKey, drawLessonMenuTile, drawRowIcon, drawTableTile } from "./sea/lecons";

const W = 1640, H = 760;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 600], [W, 600], [W, H], [0, H]], SAND); });
  for (let i = 0; i < 9; i++) drawMultTile(g, 100 + i * 170, 100, i + 1);
  drawCalcTile(g, 100, 270, 2); drawCalcTile(g, 270, 270, 6);
  drawExerciseMult(g, 470, 270); drawStepMult(g, 620, 270);
  drawRowIcon(g, 760, 270, "multiplication"); ["L13", "L14"].forEach((id, i) => drawLessonMenuTile(g, 900 + i * 170, 270, id));
  drawTableTile(g, 1240, 270, "+"); drawTableTile(g, 1410, 270, "×");
  drawAToiKey(g, 160, 500, "multiplication", 1); drawAToiKey(g, 420, 500, "multiplication", 6);
  void frame;
};
export const multSheet: Film = { meta: { title: "Lot « Multiplication » · niveaux, leçons, table", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
