// LOT « PROBLÈMES » : les dessins de l'exercice (sea/problemes.ts) pour l'application, empaquetés par tools/export-app.mjs en
// app/js/art/problemes.js (module ES généré, comme runtime.js). Ils sont dessinés une fois par question (ou à chaque objet posé),
// dans des canvas mis en cache par modules/problemes/screen.js, jamais à chaque image. `gfx` : un Gfx sur un contexte 2D.
import { Gfx, PENCIL, type Ctx, type Layer } from "../canvas-core/core";
export * from "../canvas-core/sea/problemes";

const surface = (w: number, h: number): Layer => { const c = Object.assign(document.createElement("canvas"), { width: w, height: h }); return { canvas: c, ctx: c.getContext("2d") as Ctx } as Layer; };
const envs = new Map<string, { W: number; H: number; scale: number; cache: Map<string, unknown>; canvas: typeof surface }>();
export const gfx = (ctx: Ctx, W: number, H: number, scale: number) => {
  const k = `${W}x${H}@${scale}`; let env = envs.get(k); if (!env) { env = { W, H, scale, cache: new Map(), canvas: surface }; envs.set(k, env); }
  ctx.setTransform(scale, 0, 0, scale, 0, 0); return new Gfx(ctx, env as never, 0, PENCIL);
};
