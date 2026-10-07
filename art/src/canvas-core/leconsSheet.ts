// PLANCHE SPÉCIMEN · lot « Les leçons » (sea/lecons.ts) sur l'eau de l'application : la bulle « les leçons » de l'accueil,
// les plaques des dix leçons rangées par exercice avec le pictogramme de chaque rangée, les plaques des tables (et la place
// réservée de la table de multiplication), les bulles « À toi ! » des trois exercices et la maison ; le chalut plein de dix
// filets (L10 corrigée : dix poissons par filet) ; la table d'addition, une case allumée (7 + 5).
import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import type { Film } from "./film";
import { fillShape } from "./gallery";
import { SAND, WATER } from "./oceanMarker";
import { drawAToiKey, drawBigHomeKey, drawLessonMenuTile, drawLessonsKey, drawReservedTile, drawRowIcon, drawTableTile, LESSON_ROWS } from "./sea/lecons";
import { drawTrawl } from "./sea/hundreds";
import { drawAddTable } from "./sea/runtime";

const W = 1700, H = 1500;
const draw = (ctx: Ctx, frame: number, env: Env) => {
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const g = new Gfx(ctx, env, 0, PENCIL);
  g.group("plain", () => { fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER); fillShape(g, [[0, 1180], [W, 1180], [W, H], [0, H]], SAND); });
  drawLessonsKey(g, 90, 90);
  LESSON_ROWS.forEach((row, r) => { const y = 260 + r * 160; drawRowIcon(g, 80, y, row.ex); row.ids.forEach((id, i) => drawLessonMenuTile(g, 210 + i * 170, y, id)); });
  drawTableTile(g, 210, 740, "+"); drawTableTile(g, 380, 740, "×"); drawReservedTile(g, 550, 740);
  drawAToiKey(g, 160, 960, "ligne", 1); drawAToiKey(g, 420, 960, "additions", 2); drawAToiKey(g, 680, 960, "calcul", 6); drawBigHomeKey(g, 880, 960);
  drawTrawl(g, 1100, 60, 10);
  drawAddTable(ctx as unknown as CanvasRenderingContext2D, { x: 880, y: 420, pitch: 64, cell: 58, head: 52, max: 10, lit: [7, 5], tint: true });
  void frame;
};
export const leconsSheet: Film = { meta: { title: "Lot « Les leçons » · menu, tables, À toi !", W, H, fps: 8, bpm: 120, durationFrames: 1 }, assets: { images: {} }, shots: [{ id: "sheet", start: 0, end: 1, draw }] };
