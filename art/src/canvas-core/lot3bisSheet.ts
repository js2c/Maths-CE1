// PLANCHE SPÉCIMEN · lot 3 bis, partie B (sea/lot3bis.ts) sur l'eau et le sable de l'application : la légende et sa croix,
// « je ne sais pas » (la pieuvre qui hausse les bras) à côté de l'ancien « ? » de la question, le coquillage d'aide (le
// triton) à côté du coquillage de la récompense, les poissons des maisons, le poisson porteur d'étiquette (quatre images),
// la traînée d'une étoile arc-en-ciel, le grand drapeau du record, le filet haut de L2, les onglets de zone de l'album.
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawBigShell, drawRainbowStar } from "./sea/treasure";
import { drawBigFlag, drawCloseKey, drawHintKey, drawLegendKey, drawShrugKey, drawSmallFish, drawStarTrail, drawTagFish, drawTallNet, drawZoneTab, HOUSE_FISH, TAG } from "./sea/lot3bis";
import { drawLabel, drawLine, drawNumber, drawPanel, tickP, wrapWords } from "./sea/runtime";
import { NETV_H } from "./sea/lot3bis";

const W = 1400, H = 1500;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 620], [W, 620], [W, H], [0, H]], SAND); });
  drawLegendKey(g, 80, 80); drawCloseKey(g, 200, 80); drawShrugKey(g, 340, 80); drawHintKey(g, 480, 80);
  drawBigShell(g, 0, 660, 110);
  for (let i = 0; i < 5; i++) drawSmallFish(g, 820 + i * 44, 60, 34, HOUSE_FISH[0], 9000 + i * 7);
  for (let i = 0; i < 3; i++) drawSmallFish(g, 820 + i * 44, 110, 34, HOUSE_FISH[1], 9100 + i * 7);
  for (let f = 0; f < 4; f++) { const ax = 110 + f * 170, ay = 460; drawTagFish(g, f * 3, ax, ay); drawNumber(g.cur as CanvasRenderingContext2D, ["7", "34", "700", "1000"][f], ax + TAG.cx, ay + TAG.cy - 15, f === 3 ? 26 : 32, { w: 5, seed: 9200 + f }); }
  drawStarTrail(g, 1000, 300); drawRainbowStar(g, 1000, 300, 30);
  drawBigFlag(g, 830, 600, frame % 12);
  drawTallNet(g, 1250, 220);
  const c = g.cur as CanvasRenderingContext2D;
  drawPanel(c, 640, 660, 700, 300);
  drawLabel(c, 900, 1000, wrapWords("La séance du jour, préparée par l'application.", 16));
  drawLabel(c, 1200, 900, wrapWords("Des astuces pour calculer sans compter un par un.", 16));
  // L2 : la corde de 0 à 100 aux bouées géantes, deux filets hauts
  const L = { x0: 40, x1: 1360, y: 1120, n: 11, labels: Array.from({ length: 11 }, (_, i) => String(i * 10)), k: 0, geant: true };
  drawLine(c, L); drawLine(c, { ...L, y: 1400, geant: false });
  [0, 1].forEach((i) => { const [a] = tickP(L, i), [b] = tickP(L, i + 1); drawTallNet(g, (a + b) / 2, 1120 + 14); void NETV_H; });
  ["lagon", "corail", "large", "abysses"].forEach((z, i) => drawZoneTab(g, 110 + i * 130, 740, z));
};
export const lot3bisSheet: Film = { meta: { title: "Lot 3 bis · partie B", W, H, fps: 8, bpm: 120, durationFrames: 12 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 12, draw }] };
