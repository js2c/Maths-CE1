// PLANCHE SPÉCIMEN · les 15 créatures du lagon (sea/creatures.ts), chacune dans sa case, sur l'eau et un
// peu de sable, à la taille de l'application. L'image F montre l'image F de chaque boucle.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER, WATER_D } from "./oceanMarker";
import { CREATURE_N, CREATURES } from "./sea/creatures";

const CW = 240, CH = 190, COLS = 5, W = CW * COLS, H = CH * 3;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); CREATURES.forEach((_, i) => { const x = (i % COLS) * CW, y = Math.floor(i / COLS) * CH; fillShape(g, [[x + 4, y + 4], [x + CW - 4, y + 4], [x + CW - 4, y + CH - 4], [x + 4, y + CH - 4]], WATER); fillShape(g, [[x + 4, y + CH - 40], [x + CW - 4, y + CH - 40], [x + CW - 4, y + CH - 4], [x + 4, y + CH - 4]], SAND); }); });
  CREATURES.forEach((c, i) => { const x = (i % COLS) * CW, y = Math.floor(i / COLS) * CH; c.draw(g, (frame % CREATURE_N) / CREATURE_N, x + CW / 2 - c.W / 2 + c.origin[0], c.ground ? y + CH - 20 : y + CH / 2 - 10); });
};
export const creaturesSheet: Film = { meta: { title: "Créatures du lagon · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: CREATURE_N }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: CREATURE_N, draw }] };
