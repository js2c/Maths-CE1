// PLANCHE SPÉCIMEN · lot 2 : les aides visuelles du module 2 (sea/aids.ts), composées comme l'application le
// fera : le cadre de 10 avec 7 poissons et la lueur d'une place vide ; la maison du 7 (toit, trois étages, seuil)
// avec ses nombres ; le double + 1 (3 poissons, leur reflet, la bulle dorée).
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawBonusBubble, drawCellGlow, drawHouseBase, drawHouseFloor, drawHouseRoof, drawTenFrame, HOUSE, tenCell } from "./sea/aids";
import { drawFish } from "./sea/decor";
import { drawNumber } from "./sea/runtime";

const W = 1500, H = 820;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 700], [W, 700], [W, H], [0, H]], SAND); });
  const tx = 40, ty = 120; drawTenFrame(g, tx, ty);
  for (let i = 0; i < 7; i++) { const [cx, cy] = tenCell(i); drawFish(g, 2, 1, i, tx + cx, ty + cy); }
  const [gx, gy] = tenCell(7); drawCellGlow(g, tx + gx, ty + gy);
  // la maison du 7
  const hx = 750, top = 190; drawHouseRoof(g, hx, top);
  [0, 1, 2].forEach((k) => drawHouseFloor(g, hx, top + k * HOUSE.floor));
  drawHouseBase(g, hx, top + 3 * HOUSE.floor);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  drawNumber(ctx, "7", hx, top - HOUSE.roof * 0.5 - 22, 44, { w: 6 });
  [[6, 1], [5, 2], [4, "?"]].forEach(([a, b], k) => { const y = top + k * HOUSE.floor + HOUSE.floor / 2 - 18; drawNumber(ctx, String(a), hx - HOUSE.w / 4, y, 36, { w: 5 }); drawNumber(ctx, String(b), hx + HOUSE.w / 4, y, 36, { w: 5, color: b === "?" ? "#d7263d" : undefined }); });
  // double + 1 : 3 poissons, leur reflet, la bulle dorée
  const g2 = new Gfx(ctx, env, 0, PENCIL);
  for (let i = 0; i < 3; i++) drawFish(g2, 1, 1, i, 1050 + i * 92, 330);
  g2.group("plain", () => fillShape(g2, [[1000, 378], [1330, 378], [1330, 382], [1000, 382]], "#bff3ee", 0.8));
  for (let i = 0; i < 3; i++) drawFish(g2, 1, 1, i, 1050 + i * 92, 430);
  drawBonusBubble(g2, 1390, 430);
  void frame;
};
export const aidsSheet: Film = { meta: { title: "Lot 2 · aides visuelles du module 2", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
