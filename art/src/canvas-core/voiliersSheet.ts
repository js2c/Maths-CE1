// PLANCHE SPÉCIMEN · les voiliers (lot « Les voiliers ») : le pictogramme de l'exercice, le pictogramme de la frise et les
// neuf plaques de niveaux, sur le fond de l'écran « choisir », pour juger la lecture des nombres et le dessin.
// node tools/still.mjs voiliersSheet --frame 0 --out out/voiliers.png --scale 2
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { drawExerciseVoiliers, drawStepVoiliers, drawVoiliersTile } from "./sea/voiliers";

const W = 900, H = 560;
const draw = (ctx: Ctx, _frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 0], [180, 0], [180, H], [0, H]], WATER_D); });
  drawExerciseVoiliers(g, 90, 100);
  drawStepVoiliers(g, 90, 240);
  for (let i = 0; i < 9; i++) drawVoiliersTile(g, 270 + (i % 4) * 180, 100 + Math.floor(i / 4) * 170, i + 1);
};
export const voiliersSheet: Film = { meta: { title: "Les voiliers · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
