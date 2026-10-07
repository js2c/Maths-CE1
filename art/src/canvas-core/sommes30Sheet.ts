// PLANCHE SPÉCIMEN · lot « Sommes jusqu'à 30 » (docs/maquettes/sommes30/PROPOSITION.md) sur l'eau de l'application : les plaques
// des familles d'additions 8 à 13 (avec, pour comparer, les familles 2, 3 et 6), les plaques des leçons L11 et L12, leurs bulles
// « À toi ! » ; la rangée des additions du menu des leçons, avec ses cinq plaques.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawFamilyTile } from "./sea/choice";
import { drawAToiKey, drawLessonMenuTile, drawRowIcon } from "./sea/lecons";

const W = 1240, H = 760;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 600], [W, 600], [W, H], [0, H]], SAND); });
  [2, 3, 6].forEach((f, i) => drawFamilyTile(g, 100 + i * 170, 100, f));
  [8, 9, 10, 11, 12, 13].forEach((f, i) => drawFamilyTile(g, 100 + i * 170, 270, f));
  drawRowIcon(g, 80, 440, "additions"); ["L4", "L5", "L6", "L11", "L12"].forEach((id, i) => drawLessonMenuTile(g, 210 + i * 170, 440, id));
  drawAToiKey(g, 160, 640, "additions", 8); drawAToiKey(g, 420, 640, "additions", 11);
  void frame;
};
export const sommes30Sheet: Film = { meta: { title: "Lot « Sommes jusqu'à 30 » · familles, leçons", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
