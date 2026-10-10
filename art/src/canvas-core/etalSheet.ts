// PLANCHE SPÉCIMEN · l'étal du pêcheur (lot « L'étal du pêcheur ») : le pictogramme de l'exercice, celui de la frise, les dix
// plaques de niveaux et les vignettes des leçons L15 à L18, sur le fond de l'écran « choisir », pour juger le dessin.
// node tools/still.mjs etalSheet --frame 0 --out out/etal.png --scale 2
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { drawEtalTile, drawExerciseEtal, drawStepEtal } from "./sea/etal";
import { drawLessonMenuTile } from "./sea/lecons";

const W = 1080, H = 760;
const draw = (ctx: Ctx, _frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 0], [180, 0], [180, H], [0, H]], WATER_D); });
  drawExerciseEtal(g, 90, 100);
  drawStepEtal(g, 90, 240);
  for (let i = 0; i < 10; i++) drawEtalTile(g, 270 + (i % 5) * 170, 100 + Math.floor(i / 5) * 160, i + 1);
  ["L15", "L16", "L17", "L18"].forEach((id, i) => drawLessonMenuTile(g, 270 + i * 170, 460, id));
};
export const etalSheet: Film = { meta: { title: "L'étal du pêcheur · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
