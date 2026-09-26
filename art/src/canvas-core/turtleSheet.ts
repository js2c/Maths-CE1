// PLANCHE SPÉCIMEN · la tortue de mer : grande, au repos sur une bouée (contrôle de l'anatomie et des
// détails), puis les poses clés du saut et de la nage à la taille de l'application. L'image F avance
// tous les clips d'une image.
import { Gfx, PENCIL, type Ctx, type Env, type P } from "./core";
import type { Film } from "./film";
import { blob, clipped, fillShape, smooth } from "./gallery";
import { cel, contour, shift, WATER, WATER_D } from "./oceanMarker";
import { drawTurtle, TURTLE_CLIPS } from "./sea/turtle";

const W = 1600, H = 820;
const buoy = (g: Gfx, x: number, y: number, R: number) => g.group("plain", () => {
  const s = blob(x, y, R, R * 1.08, 44, 0.03, 16), band = smooth([[x - R, y - R * 0.27], [x + R, y - R * 0.27], [x + R, y + R * 0.27], [x - R, y + R * 0.27]], true, 3) as P[];
  fillShape(g, shift(s, 7, 10), "#0a3f49", 0.3); cel(g, s, "#ff5a45", "#c0302a", 5);
  clipped(g, s, () => { fillShape(g, band, "#e6ecf0"); fillShape(g, shift(band, -3, -2), "#ffffff"); });
  contour(g, s, 3.2, 70);
});
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL), [rest, jump, swim] = TURTLE_CLIPS;
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[10, 10], [700, 10], [700, H - 10], [10, H - 10]], WATER); fillShape(g, [[710, 10], [W - 10, 10], [W - 10, H - 10], [710, H - 10]], WATER); });
  // spécimen : échelle 4, posée sur une bouée à l'échelle 4 aussi
  buoy(g, 350, 560, 15 * 3);
  drawTurtle(g, { ...rest.pose(frame % rest.frames), s: 3 }, 350, 560 - 15 * 3 * 1.08 + 5);
  // saut à la taille de l'application (échelle 1.6 ici pour qu'on voie), le long de son arc
  const a = 780, b = 1500, yb = 330, R = 15 * 1.6;
  buoy(g, a, yb, R); buoy(g, b, yb, R);
  [0, 1, 3, 4, 6, 8].forEach((f) => { const [s, h] = jump.path![f]; drawTurtle(g, { ...jump.pose(f), s: 1.6 }, a + (b - a) * s, yb - R * 1.08 + 3 - h * 170); });
  [0, 4, 8, 12].forEach((f, i) => drawTurtle(g, { ...swim.pose((f + frame) % swim.frames), s: 1.6 }, 830 + i * 190, 690));
};
export const turtleSheet: Film = { meta: { title: "Tortue · planche spécimen", W, H, fps: 12, bpm: 120, durationFrames: 48 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 48, draw }] };
