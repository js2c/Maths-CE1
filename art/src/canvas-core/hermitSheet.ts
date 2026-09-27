// PLANCHE DE MODÈLE · lot 2 : le bernard-l'ermite (sea/hermit.ts), guide du module 2. En haut : le repos,
// rentré dans sa coquille, montrer, se réjouir, dans sa nouvelle coquille ; au milieu : « changer de
// coquille » en six moments ; le contrôle des détails se fait sur un rendu à l'échelle 3 (--scale 3). `frame` choisit l'image des boucles (planche animée : node tools/still.mjs hermitSheet --frame N).
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER, WATER_D } from "./oceanMarker";
import { drawHermit, HERMIT_CLIPS } from "./sea/hermit";

const W = 1600, H = 680;
const clip = (n: string) => HERMIT_CLIPS.find((c) => c.name === n)!;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); [[0, 330], [0, 660]].forEach(([, y]) => fillShape(g, [[8, y - 150], [W - 8, y - 150], [W - 8, y - 8], [8, y - 8]], WATER)); [[0, 330], [0, 660]].forEach(([, y]) => fillShape(g, [[8, y - 60], [W - 8, y - 60], [W - 8, y - 8], [8, y - 8]], SAND)); });
  const at = (name: string, f: number, x: number, y: number) => { const c = clip(name); drawHermit(g, c.pose(Math.min(c.frames - 1, f)), x, y); };
  at("repos", frame % 24, 180, 290); at("sortir", 8, 470, 290); at("montrer", 10, 740, 290); at("rejouir", 7, 1060, 290); at("repos.b", frame % 24, 1380, 290);
  [4, 12, 22, 35].forEach((f, i) => at("changer", f, 130 + i * 390 - (f >= 26 ? 120 : 0), 620));
};
export const hermitSheet: Film = { meta: { title: "Lot 2 · bernard-l'ermite (modèle)", W, H, fps: 12, bpm: 120, durationFrames: 24 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 24, draw }] };
