// PLANCHE SPÉCIMEN · la flèche de la mascotte (lot « Mascotte ») : sur l'eau claire et l'eau profonde, au-dessus d'une
// étoile de mer et d'une bouée de la ligne (là où elle se pose dans l'application), pour juger le contraste et la forme.
// node tools/still.mjs flecheSheet --frame 0 --out out/fleche.png --scale 4
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { blob, fillShape } from "./gallery";
import { cel, contour, WATER, WATER_D, SAND } from "./oceanMarker";
import { drawFleche } from "./sea/fleche";
import { drawStar } from "./sea/decor";

const W = 640, H = 300;
const draw = (ctx: Ctx, _frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[0, 0], [W / 2, 0], [W / 2, H], [0, H]], WATER); fillShape(g, [[0, 250], [W, 250], [W, H], [0, H]], SAND); });
  drawFleche(g, 110, 128);
  drawStar(g, 110, 190);
  g.group("plain", () => { const b = blob(430, 232, 16, 17, 4, 0.03, 16); cel(g, b, "#ff5a45", "#c0302a", 5); contour(g, b, 3.2, 5); });
  drawFleche(g, 430, 196);
  drawFleche(g, 560, 160);
};
export const flecheSheet: Film = { meta: { title: "La flèche · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
