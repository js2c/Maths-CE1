// PLANCHE DE MODÈLE · la pieuvre dans ses six clips. L'image F montre chaque clip à son image F
// (modulo sa longueur) : on lit les gestes côte à côte, à la taille où l'application les montre.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { drawOctopus, OCTO_CLIPS } from "./sea/octopus";

const CW = 700, CH = 600, W = CW * 3, H = CH * 3;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); OCTO_CLIPS.forEach((_, i) => { const x = (i % 3) * CW, y = Math.floor(i / 3) * CH; fillShape(g, [[x + 6, y + 6], [x + CW - 6, y + 6], [x + CW - 6, y + CH - 6], [x + 6, y + CH - 6]], WATER); }); });
  OCTO_CLIPS.forEach((c, i) => { const x = (i % 3) * CW, y = Math.floor(i / 3) * CH; drawOctopus(g, c.pose(frame % c.frames), x + CW * 0.46, y + CH * 0.4); });
};
export const octoSheet: Film = {
  meta: { title: "Pieuvre · planche de modèle", W, H, fps: 12, bpm: 120, durationFrames: 60 },
  assets: { images: {} },
  shots: [{ id: "sheet", start: 0, end: 60, draw }],
};
