// PLANCHE SPÉCIMEN · l'écran de démarrage (lot « Correctifs de la tablette ») : la barre de chargement vide et pleine, sur l'eau
// profonde du démarrage, à la taille de la scène. (Le logo est celui de la maquette art/logo/ : lot « Correctifs : passage… », point 9.)
// node tools/still.mjs demarrageSheet --frame 0 --out out/demarrage.png --scale 2
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { BAR_W, drawBar } from "./sea/demarrage";

const W = 1280, H = 800;
const draw = (ctx: Ctx, _frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], "#0b5563"); });
  drawBar(g, 640, 600, false);
  // la barre aux deux tiers : le plein, dévoilé jusqu'à 2/3
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 640 - BAR_W / 2 + (BAR_W * 2) / 3, H); ctx.clip(); drawBar(g, 640, 600, true); ctx.restore();
  drawBar(g, 640, 690, true);
};
export const demarrageSheet: Film = { meta: { title: "Le démarrage · planche spécimen", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
