// PLANCHE SPÉCIMEN · les lettres au feutre (sea/letters.ts) : l'alphabet, les accents et les six noms
// proposés pour la pieuvre, sur l'étiquette de l'application, en grand pour contrôler les jonctions.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { WATER, WATER_D } from "./oceanMarker";
import { drawNameTag } from "./sea/decor";
import { drawWord } from "./sea/runtime";

const W = 1600, H = 1000;
const draw = (ctx: Ctx, _f: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D); fillShape(g, [[10, 10], [W - 10, 10], [W - 10, 330], [10, 330]], "#fffaf0"); fillShape(g, [[10, 340], [W - 10, 340], [W - 10, H - 10], [10, H - 10]], WATER); });
  drawWord(ctx, "abcdefghijklmnopqrstuvwxyz", W / 2, 30, 80);
  drawWord(ctx, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", W / 2, 150, 60);
  drawWord(ctx, "é è ê ë à â ù û î ï ô ç - 0123456789 !", W / 2, 245, 60);
  ["Pili", "Octavie", "Bulle", "Coralie", "Plouf", "Mimosa"].forEach((n, i) => {
    const cx = 290 + (i % 3) * 510, cy = 470 + Math.floor(i / 3) * 170;
    drawNameTag(g, cx, cy, i);
    drawWord(ctx, n, cx, cy - 22, 44);
  });
  drawWord(ctx, "v y w Octavie, Mimosa ?", W / 2, 820, 110, { color: "#fffaf0" });
};
export const lettersSheet: Film = { meta: { title: "Lettres · planche spécimen", W, H, fps: 12, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
