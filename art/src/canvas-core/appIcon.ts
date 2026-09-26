// L'ICÔNE DE L'APPLICATION : la pieuvre au repos sur l'eau, pleine page (Android découpe l'icône en rond
// ou en carré arrondi : le personnage reste dans le disque central de 80 %, la « zone sûre »).
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { blob, fillShape, mix } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { drawOctopus, restPose } from "./sea/octopus";

const S = 512;
const draw = (ctx: Ctx, _f: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => {
    fillShape(g, [[0, 0], [S, 0], [S, S], [0, S]], WATER_D);
    fillShape(g, blob(256, 230, 300, 260, 401, 0.08, 20), WATER);
    fillShape(g, blob(230, 170, 190, 120, 402, 0.12, 18, -0.2), mix(WATER, "#37a9b3", 0.3));
  });
  drawOctopus(g, { ...restPose(0), s: 0.98, tilt: -4 }, 258, 240);
  g.paper("paper", 0.05);
};
export const appIcon: Film = { meta: { title: "Icône", W: S, H: S, fps: 12, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "icone", start: 0, end: 1, draw }] };
