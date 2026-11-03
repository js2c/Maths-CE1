// MAQUETTE DE L'EXERCICE « PROBLÈMES » : les dessins de l'atelier (sea/problemes.ts) pour la page art/problemes/index.html,
// empaquetés par art/problemes/construire.mjs en art/problemes/dessins.js. `gfx` : un Gfx sur le contexte de la page.
import { Gfx, PENCIL, type Ctx, type Layer } from "../canvas-core/core";
export * from "../canvas-core/sea/problemes";

const surface = (w: number, h: number): Layer => { const c = Object.assign(document.createElement("canvas"), { width: w, height: h }); return { canvas: c, ctx: c.getContext("2d") as Ctx } as Layer; };
export const gfx = (ctx: Ctx, W: number, H: number, scale: number) => { ctx.setTransform(scale, 0, 0, scale, 0, 0); return new Gfx(ctx, { W, H, scale, cache: new Map(), canvas: surface }, 0, PENCIL); };
