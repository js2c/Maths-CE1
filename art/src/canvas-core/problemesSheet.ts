// PLANCHE SPÉCIMEN · maquette de l'exercice « Problèmes » (docs/maquettes/problemes/PROPOSITION.md) sur l'eau de
// l'application : les 13 objets qu'on compte (en grand, puis à la taille des aides), les contenants avec leurs objets, le
// schéma en barres (la question, puis la correction), la comparaison, les étiquettes des données et la plaque de la réponse.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawPlancheProblemes } from "./sea/problemes";

const W = 1340, H = 900;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 650], [W, 650], [W, H], [0, H]], SAND); });
  drawPlancheProblemes(g);
  void frame;
};
export const problemesSheet: Film = { meta: { title: "Maquette « Problèmes » · objets, contenants, barres", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
