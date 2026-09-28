// LES AIDES VISUELLES DU MODULE 2 (docs/SPEC-LOT2.md, « Aides visuelles et personnage guide ») : ce qui est
// fixe est dessiné ici une fois ; ce qui change à chaque question (les poissons dans les alvéoles, les
// nombres écrits sur le toit et dans les pièces, les bulles) est posé ou écrit en direct par l'application
// avec les sprites existants et les chiffres de runtime.js.
//   - le CADRE DE 10 : une boîte de corail de 2 × 5 alvéoles (famille 3, leçon L5) ; `TEN` donne le centre
//     de chaque alvéole ; la lueur d'une alvéole à remplir ;
//   - la MAISON DES NOMBRES : une maison-coquillage (familles 4 et 5, leçon L6) empilée en trois morceaux :
//     le toit (une coquille Saint-Jacques, le total dans son médaillon), un étage (deux pièces, chacune avec
//     sa plaque de nacre pour un nombre) répété autant de fois qu'il faut, le seuil (sable, porte) ;
//   - DOUBLE + 1 : le poisson et son reflet (déjà dans l'application) plus une bulle dorée, la « une de plus ».
// Même main que la scène (oceanMarker.ts) : aplats, une ombre nette, contour épais côté ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";
import { rrect } from "./treasure";

const SH = "#0a3f49";
const CORAL = "#ff8f70", CORAL_S = "#d0573f", CORAL_L = "#ffb29a", CELL = "#0f6f7c", CELL_S = "#0a4f5a";

// ---------------------------------------------------------------- le cadre de 10
export const TEN = { cell: 76, gap: 10, pad: 18, rows: 2, cols: 5 };
export const TEN_W = TEN.cols * TEN.cell + (TEN.cols - 1) * TEN.gap + 2 * TEN.pad, TEN_H = TEN.rows * TEN.cell + (TEN.rows - 1) * TEN.gap + 2 * TEN.pad;
// centre de l'alvéole i (0 à 9 : la première rangée de gauche à droite, puis la seconde), par rapport au coin haut gauche
export const tenCell = (i: number): P => { const r = Math.floor(i / TEN.cols), c = i % TEN.cols; return [TEN.pad + c * (TEN.cell + TEN.gap) + TEN.cell / 2, TEN.pad + r * (TEN.cell + TEN.gap) + TEN.cell / 2]; };
export const drawTenFrame = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  // la boîte : un bloc de corail aux bords irréguliers (pas un rectangle parfait), des pores sur le dessus
  const box = smooth([[x + 6, y + 2], [x + TEN_W * 0.5, y - 3], [x + TEN_W - 4, y + 3], [x + TEN_W + 2, y + TEN_H * 0.5], [x + TEN_W - 3, y + TEN_H + 1], [x + TEN_W * 0.5, y + TEN_H + 4], [x + 3, y + TEN_H - 1], [x - 3, y + TEN_H * 0.5]], true, 8);
  fillShape(g, shift(box, 9, 11), SH, 0.28);
  cel(g, box, CORAL, CORAL_S, 8, [smooth([[x + 14, y + 10], [x + TEN_W * 0.45, y + 6], [x + TEN_W * 0.4, y + 14], [x + 16, y + 18]], true, 5), CORAL_L]);
  clipped(g, box, () => { for (let i = 0; i < 40; i++) { const px = x + 8 + ((i * 97) % (TEN_W - 16)), py = y + 6 + ((i * 53) % (TEN_H - 12)); fillShape(g, blob(px, py, 2.4, 2, 6000 + i, 0.2, 6), CORAL_S, 0.55); } });
  contour(g, box, 4, 6050);
  // les dix alvéoles, creusées : ombre en haut à gauche (le bord les cache de la lumière)
  for (let i = 0; i < 10; i++) {
    const [cx, cy] = tenCell(i), c = rrect(x + cx - TEN.cell / 2, y + cy - TEN.cell / 2, TEN.cell, TEN.cell, 16);
    fillShape(g, c, CELL);
    clipped(g, c, () => { fillShape(g, shift(c, 7, 8), mix(CELL, "#37a9b3", 0.35)); fillShape(g, blob(x + cx + 16, y + cy + 20, 12, 5, 6100 + i, 0.2, 8), "#37a9b3", 0.35); });
    ink(g, c, CELL_S, { w: 3, closed: true, shadow: 0.6, seed: 6110 + i });
  }
  // la séparation des deux rangées de cinq, gravée dans le corail
  ink(g, [[x + TEN.pad - 4, y + TEN_H / 2], [x + TEN_W - TEN.pad + 4, y + TEN_H / 2]], CORAL_S, { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 6130 }, 0.7);
});
// la lueur d'une alvéole (une place vide qui clignote, la boîte qui brille)
export const drawCellGlow = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const r = rrect(cx - TEN.cell / 2 - 3, cy - TEN.cell / 2 - 3, TEN.cell + 6, TEN.cell + 6, 18);
  ink(g, r, "#ffe066", { w: 7, closed: true, shadow: 0, seed: 6140 }, 0.85);
  ink(g, rrect(cx - TEN.cell / 2 + 4, cy - TEN.cell / 2 + 4, TEN.cell - 8, TEN.cell - 8, 13), "#fff6c0", { w: 2.4, closed: true, shadow: 0, seed: 6141 }, 0.7);
});

// ---------------------------------------------------------------- la maison des nombres
export const HOUSE = { w: 300, roof: 150, floor: 96, base: 46, plaque: 34 };
const NACRE = "#fdf3e4", NACRE_S = "#e3cfb4", WALL = "#f6c9a6", WALL_S = "#d99a74", SCAL = "#ff9a8a", SCAL_S = "#cf5f55", SCAL_L = "#ffc0b2";
// une plaque de nacre (le nombre y est écrit en direct)
const plaque = (g: Gfx, cx: number, cy: number, r: number, seed: number) => { const s = blob(cx, cy, r, r * 0.9, seed, 0.03, 16); fillShape(g, shift(s, 3, 4), SH, 0.2); cel(g, s, NACRE, NACRE_S, 3, [blob(cx - r * 0.35, cy - r * 0.4, r * 0.35, r * 0.2, seed + 1, 0.1, 8), "#ffffff"]); contour(g, s, 2.6, seed + 2); };
// le toit : une coquille Saint-Jacques posée (ses côtes en éventail), le médaillon du total au milieu.
// Origine : milieu du bas du toit ; il déborde un peu des murs.
export const drawHouseRoof = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  const w = HOUSE.w / 2 + 16, h = HOUSE.roof;
  const fan = smooth([[x - w, y], [x - w * 0.9, y - h * 0.45], [x - w * 0.55, y - h * 0.86], [x, y - h], [x + w * 0.55, y - h * 0.86], [x + w * 0.9, y - h * 0.45], [x + w, y], [x, y + 8]], true, 10);
  fillShape(g, shift(fan, 9, 10), SH, 0.25);
  cel(g, fan, SCAL, SCAL_S, 7, [smooth([[x - w * 0.8, y - h * 0.4], [x - w * 0.45, y - h * 0.8], [x - w * 0.1, y - h * 0.9], [x - w * 0.3, y - h * 0.6]], true, 5), SCAL_L]);
  // les côtes rayonnent depuis la charnière (en bas au milieu)
  clipped(g, fan, () => { for (let k = -5; k <= 5; k++) { const a = -Math.PI / 2 + k * 0.26; ink(g, [[x, y + 6], [x + Math.cos(a) * w * 1.3, y + 6 + Math.sin(a) * h * 1.25]], SCAL_S, { w: 2.6, shadow: 0, taper: [0.6, 0.1], seed: 6200 + k + 5 }, 0.6); } });
  contour(g, fan, 4, 6220);
  // les oreillettes de la charnière
  const ear = smooth([[x - 26, y + 6], [x - 16, y - 8], [x + 16, y - 8], [x + 26, y + 6], [x, y + 12]], true, 5);
  cel(g, ear, SCAL, SCAL_S, 2); contour(g, ear, 2.6, 6221);
  plaque(g, x, y - h * 0.5, HOUSE.plaque + 6, 6230);
});
// un étage : deux pièces côte à côte, chacune avec sa fenêtre ronde et sa plaque. Origine : milieu du haut.
// (lot 3 bis, B5 : `plaques: false`, l'étage sans plaques, dont les pièces reçoivent les poissons des deux nombres)
export const drawHouseFloor = (g: Gfx, x: number, y: number, plaques = true) => g.group("plain", () => {
  const w = HOUSE.w / 2, h = HOUSE.floor, wall = smooth([[x - w, y], [x - w + 8, y - 0.5], [x, y + 0.5], [x + w - 8, y], [x + w, y], [x + w + 0.5, y + 8], [x + w + 1, y + h / 2], [x + w + 1, y + h - 8], [x + w + 1, y + h], [x + w - 8, y + h], [x, y + h + 0.5], [x - w + 8, y + h], [x - w - 1, y + h], [x - w - 1, y + h - 8], [x - w - 0.5, y + h / 2], [x - w, y + 8]], true, 2);
  fillShape(g, shift(wall, 9, 6), SH, 0.22);
  cel(g, wall, WALL, WALL_S, 6);
  // des galets et des petits coquillages dans le mur, la cloison entre les deux pièces
  clipped(g, wall, () => { for (let i = 0; i < 12; i++) fillShape(g, blob(x - w + 10 + ((i * 71) % (2 * w - 20)), y + 8 + ((i * 37) % (h - 16)), 5, 3.5, 6300 + i, 0.25, 7), WALL_S, 0.5); });
  ink(g, [[x, y + 4], [x, y + h - 4]], mix(WALL_S, INK, 0.3), { w: 3.4, shadow: 0, taper: [0.1, 0.1], seed: 6320 });
  contour(g, wall, 3.4, 6321);
  if (plaques) [-1, 1].forEach((sd, i) => plaque(g, x + sd * w * 0.5, y + h / 2, HOUSE.plaque, 6330 + i * 5));
  // sans plaques : le sol de chaque pièce, une bande de sable plus claire où les poissons se posent
  else [-1, 1].forEach((sd, i) => fillShape(g, blob(x + sd * w * 0.5, y + h - 12, w * 0.4, 5, 6340 + i, 0.05, 12), "#fbe3c6", 0.8));
});
// le seuil : une marche de sable et une petite porte ronde entre les deux pièces du bas. Origine : milieu du haut.
export const drawHouseBase = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  // (lot 3 : des points près de chaque coin, comme l'étage ; avec les seuls quatre coins, la courbe lissée
  // débordait de 40 px de chaque côté et sortait de son calque)
  const w = HOUSE.w / 2 + 10, h = HOUSE.base, step = smooth([[x - w, y], [x - w + 10, y - 0.5], [x, y + 0.5], [x + w - 10, y], [x + w, y], [x + w + 2, y + 10], [x + w + 5, y + h - 10], [x + w + 6, y + h], [x + w - 10, y + h + 0.5], [x, y + h], [x - w + 10, y + h + 0.5], [x - w - 6, y + h], [x - w - 5, y + h - 10], [x - w - 2, y + 10]], true, 3);
  fillShape(g, shift(step, 8, 6), SH, 0.2);
  // (lot 3 : une marche de pierre, comme les galets du décor : la marche de sable se perdait sur le sable)
  cel(g, step, "#c3cfd3", "#8fa0a6", 5); contour(g, step, 3.2, 6400);
  const door = smooth([[x - 18, y + h - 2], [x - 18, y + 14], [x, y + 4], [x + 18, y + 14], [x + 18, y + h - 2]], true, 6);
  fillShape(g, door, "#6a3e28"); clipped(g, door, () => fillShape(g, shift(door, 4, 4), "#8a5638")); contour(g, door, 2.6, 6401);
});

// ---------------------------------------------------------------- double + 1 : la bulle dorée
export const drawBonusBubble = (g: Gfx, cx: number, cy: number, r = 26) => g.group("plain", () => {
  const s = blob(cx, cy, r, r, 6500, 0.03, 14);
  fillShape(g, blob(cx, cy, r + 9, r + 9, 6501, 0.04, 14), "#ffe066", 0.35);
  fillShape(g, s, "#fff1a8", 0.55);
  ink(g, s, "#ffd23a", { w: 4, closed: true, shadow: -0.5, seed: 6502 });
  ink(g, smooth([[cx - r * 0.6, cy - r * 0.1], [cx - r * 0.45, cy - r * 0.5], [cx - r * 0.1, cy - r * 0.65]], false, 5), "#ffffff", { w: 3.6, shadow: 0, taper: [0.3, 0.4], seed: 6503 });
  // trois éclats de lumière autour
  [[1.35, -0.6], [1.2, 0.8], [-1.3, 0.9]].forEach(([u, v], i) => { const px = cx + u * r, py = cy + v * r; ink(g, [[px - 5, py], [px + 5, py]], "#ffe066", { w: 2.4, shadow: 0, seed: 6510 + i }); ink(g, [[px, py - 5], [px, py + 5]], "#ffe066", { w: 2.4, shadow: 0, seed: 6515 + i }); });
});
