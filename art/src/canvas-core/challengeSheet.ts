// PLANCHE SPÉCIMEN · lot 2, étape 7 : le défi record. La bulle-sablier à six niveaux d'eau (du plein au vide),
// les perles des bonnes réponses et le drapeau du record, le pictogramme de la frise, sur l'eau de l'application.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER } from "./oceanMarker";
import { DEFI_N, drawRecordFlag, drawScorePearl, drawStepChallenge, drawTimerBubble } from "./sea/challenge";

const W = 1160, H = 420;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER));
  [0, 6, 12, 18, 24, DEFI_N - 1].forEach((f, i) => drawTimerBubble(g, 100 + i * 190, 110, f));
  for (let i = 0; i < 9; i++) drawScorePearl(g, 120 + i * 40, 300);
  drawRecordFlag(g, 120 + 6 * 40 - 20, 318);
  for (let i = 9; i < 14; i++) drawScorePearl(g, 120 + i * 40, 300);
  drawStepChallenge(g, 800, 300); drawStepChallenge(g, 880, 300);
  void frame;
};
export const challengeSheet: Film = { meta: { title: "Lot 2 · défi record", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
