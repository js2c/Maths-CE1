// LOT « LES LEÇONS » (docs/SPEC.md, section 3, « Les leçons » ; docs/LOTS.md, fiche 3). Ce qui est fabriqué à l'avance :
//   - la bulle « les leçons » de l'accueil : le livre ouvert de l'écran « choisir » (un saut de tortue sur ses pages) ;
//   - le menu des leçons : une plaque par leçon, son NUMÉRO en grand (comme les niveaux : le parent peut dire « fais la
//     leçon 7 ») et, dessous, une vignette du MOMENT CLÉ de la leçon (pas un exemple de calcul) :
//       1 la tortue et ses deux sauts comptés,   2 le saut qui vaut dix (bouées géantes, un filet de dix poissons),
//       3 la loupe sur 30 et les sauts depuis 30, 10 le filet et le chalut plein de dix filets,
//       4 le poisson et son reflet,               5 le cadre de 10, sept poissons et trois places qui s'allument,
//       6 la maison du 7 (5 et 2 à l'étage),       7 sur le mur, 34 puis 44 : seules les dizaines changent,
//       8 sur le mur, + 10 puis un pas en arrière, 9 les deux ponts, 38 → 40 → 43 ;
//   - les plaques des tables à consulter : le signe en grand (« + », plus tard « × ») et une petite grille ;
//   - le pictogramme plat de chaque rangée du menu (celui de la frise, en grand : il ne ressemble pas à un bouton) ;
//   - la bulle « À toi ! » de la fin d'une leçon : la plaque du niveau de l'exercice associé (celle de l'écran « choisir »)
//     dans une grande bulle, et un petit triangle de lecture ; la bulle de la maison, à côté.
// La grille de la table d'addition change à chaque toucher (la case allumée) : elle est dessinée en direct (runtime.ts,
// drawAddTable). Même main que le reste (oceanMarker.ts) : aplats, une ombre nette, contour qui s'épaissit côté ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";
import { rrect, drawHomeKey } from "./treasure";
import { drawTurtle, TURTLE_REST } from "./turtle";
import { drawFishNet, drawTrawl } from "./hundreds";
import { drawTenFrame, drawHouseRoof, drawHouseFloor, drawHouseBase, HOUSE, TEN, TEN_H, TEN_W, tenCell } from "./aids";
import { drawStepLine, drawStepPlus } from "./ui";
import { drawSmallFish, HOUSE_FISH } from "./lot3bis";
import { drawStepCalc, drawCalcTile } from "./calc";
import { drawFamilyTile, drawLineTile, drawOpenBook, inside, plaque, reflet, TILE_H, TILE_W, underline, VIGN_Y, NUM_EM, NUM_TOP } from "./choice";
import { drawBridge, drawJumpArc, drawLens, drawLine, drawNumber, drawStone, drawWord, type LineSpec, tickP, WALL_TENS, WALL_UNITS } from "./runtime";

const SH = "#0a3f49", GOLD = "#ffd23a", LIT = "#ffe45c", LIT_S = "#e0a21c", CELL = "#fff4e6";
const scaled = (g: Gfx, x: number, y: number, s: number, fn: () => void) => { g.push(x, y, s); fn(); g.pop(); };
const cx2d = (g: Gfx) => g.cur as CanvasRenderingContext2D;

// ---------------------------------------------------------------- la bulle « les leçons » de l'accueil
// (même taille que jouer, choisir, le récif et l'album : rayon 60)
export const drawLessonsKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 26, 60);
  drawOpenBook(g, cx, cy + 4, 0.88, 5620);
};

// ---------------------------------------------------------------- les vignettes des leçons
// Chaque vignette est dessinée autour de (0, 0), dans une boîte d'environ 200 × 100 (de y −56 à y 44), puis réduite à 0,7
// dans la moitié basse de la plaque, comme celles des familles d'additions.
const tortueSur = (g: Gfx, L: LineSpec, i: number, k: number, ox: number, oy: number, s = 0.62) => { const [bx, by] = tickP(L, i); scaled(g, ox + bx * k - 4, oy + by * k - 5, s, () => drawTurtle(g, TURTLE_REST, 0, 0)); };
const corde = (n: number, k: number, extra: Partial<LineSpec> = {}): LineSpec => ({ x0: 0, x1: 260, y: 0, n, labels: Array.from({ length: n }, () => null), k, ...extra });

// L1 · On compte les sauts : la corde à bouées, la tortue arrivée sur la troisième bouée, ses deux sauts numérotés 1 et 2
const vL1 = (g: Gfx) => {
  const L = corde(6, 0, { x1: 300 }), k = 0.66, ox = -150 * k, oy = 26;
  scaled(g, ox, oy, k, () => { const c = cx2d(g); drawLine(c, L); drawJumpArc(c, tickP(L, 0), tickP(L, 1), 1, { h: 50, label: "1", labelColor: INK }); drawJumpArc(c, tickP(L, 1), tickP(L, 2), 1, { h: 50, label: "2", labelColor: INK }); });
  tortueSur(g, L, 2, k, ox + 10, oy, 0.5);
};
// L2 · Un saut peut valoir 10 : deux bouées géantes, le filet de dix poissons entre elles, l'arc « + 10 » au-dessus
const vL2 = (g: Gfx) => {
  const L = corde(3, 0, { geant: true, x0: 0, x1: 300 }), k = 0.62, ox = -150 * k, oy = 26;
  const [a] = tickP(L, 0), [b] = tickP(L, 1);
  scaled(g, ox + ((a + b) / 2) * k - 86 * 0.4, oy - 44, 0.4, () => drawFishNet(g, 0, 0, 7900));
  scaled(g, ox, oy, k, () => { const c = cx2d(g); drawLine(c, L); drawJumpArc(c, tickP(L, 0), tickP(L, 1), 1, { h: 100, label: "+10", labelColor: INK }); });
};
// L3 · La ligne ne commence pas toujours à 0 : la loupe sur 30, au début de la ligne ; la tortue a fait deux sauts depuis 30
const vL3 = (g: Gfx) => {
  const L = corde(5, 0.8), k = 0.6, ox = -62, oy = 0;
  scaled(g, ox, oy, k, () => { const c = cx2d(g); drawLine(c, L); drawJumpArc(c, tickP(L, 0), tickP(L, 1), 1, { h: 34, label: "1", labelColor: INK }); drawJumpArc(c, tickP(L, 1), tickP(L, 2), 1, { h: 34, label: "2", labelColor: INK }); });
  tortueSur(g, L, 2, k, ox + 6, oy, 0.48);
  const [x0] = tickP(L, 0), lx = ox + x0 * k - 26, ly = 24;
  drawLens(cx2d(g), lx, ly, 22);
  drawNumber(cx2d(g), "30", lx, ly - 10, 20, { w: 3.4, seed: 7950 });
};
// L10 · Les centaines : un filet de dix poissons, une flèche, le chalut plein de dix filets
const vL10 = (g: Gfx) => {
  scaled(g, -96, -16, 0.34, () => drawFishNet(g, 0, 0, 7960));
  const p: P[] = [[-30, 2], [-8, -2], [6, 2]];
  ink(g, p, INK, { w: 6, shadow: 0, taper: [0.1, 0.05], seed: 7970 }, 0.4); ink(g, p, LIT, { w: 4, shadow: 0, taper: [0.1, 0.05], seed: 7971 });
  const head: P[] = [[2, -6], [14, 2], [2, 10]]; fillShape(g, head, LIT); ink(g, head, INK, { w: 2.2, closed: true, shadow: 0.2, seed: 7972 });
  scaled(g, 62, -54, 0.36, () => drawTrawl(g, 0, 0, 10));
};
// L4 · Les doubles : le poisson et son reflet (trois et trois)
const vL4 = (g: Gfx) => scaled(g, 0, -4, 1.05, () => reflet(g, 0, 0, 3, false));
// L5 · Les amis de 10 : le cadre de 10, sept poissons, les trois places vides qui s'allument
const vL5 = (g: Gfx) => {
  const kf = 0.36, x = -(TEN_W * kf) / 2, y = -6 - (TEN_H * kf) / 2;
  scaled(g, x, y, kf, () => drawTenFrame(g, 0, 0));
  for (let i = 0; i < 10; i++) {
    const [px, py] = tenCell(i), X = x + px * kf, Y = y + py * kf;
    if (i < 7) drawSmallFish(g, X - 1, Y, 22, HOUSE_FISH[0], 7980 + i * 7);
    else ink(g, rrect(X - (TEN.cell * kf) / 2 - 2, Y - (TEN.cell * kf) / 2 - 2, TEN.cell * kf + 4, TEN.cell * kf + 4, 7), LIT, { w: 3.6, closed: true, shadow: 0, seed: 8000 + i });
  }
};
// L6 · La maison des nombres : le toit du 7 et un étage, 5 et 2
const vL6 = (g: Gfx) => {
  const s = 0.33, y0 = -2;
  scaled(g, 0, y0, s, () => { drawHouseRoof(g, 0, 0); drawHouseFloor(g, 0, 0); drawHouseBase(g, 0, HOUSE.floor); });
  const c = cx2d(g), em = 19;
  drawNumber(c, "7", 0, y0 - HOUSE.roof * s * 0.5 - em / 2, em, { w: 3.4, seed: 8010 });
  [["5", -1], ["2", 1]].forEach(([t, sd], i) => drawNumber(c, t as string, (sd as number) * HOUSE.w * 0.25 * s, y0 + (HOUSE.floor / 2) * s - em / 2, em, { w: 3.4, seed: 8011 + i }));
};
// un morceau du mur de corail, avec ses nombres : rangées `rows`, la case de gauche `first` ; `lit` : cases allumées ;
// `split` : les dizaines en corail, les unités en bleu (L7)
const wallPiece = (g: Gfx, x: number, y: number, cell: number, rows: number[][], lit: number[], split: boolean, rowGap = cell * 0.14, gap = cell * 0.14) => {
  const cols = rows[0].length, W = cols * cell + (cols - 1) * gap, H = rows.length * cell + (rows.length - 1) * rowGap, pad = cell * 0.3;
  const slab = rrect(x - pad, y - pad, W + 2 * pad, H + 2 * pad, cell * 0.4), at = (r: number, c: number): P => [x + c * (cell + gap) + cell / 2, y + r * (cell + rowGap) + cell / 2];
  fillShape(g, shift(slab, 4, 5), SH, 0.28); cel(g, slab, "#ff8f70", "#d0573f", 4); contour(g, slab, 3, 8020);
  rows.forEach((row, r) => row.forEach((n, c) => {
    const [cx, cy] = at(r, c), s = rrect(cx - cell / 2, cy - cell / 2, cell, cell, cell * 0.24), on = lit.includes(n), em = cell * 0.46, t = String(n);
    fillShape(g, shift(s, -1.5, -1.5), "#a63e2e", 0.55); fillShape(g, s, on ? LIT : CELL); ink(g, s, on ? LIT_S : "#d9b8a4", { w: 1.3, closed: true, shadow: 0.4, seed: 8030 + n });
    if (split) { drawNumber(cx2d(g), t[0], cx - em * 0.3, cy - em / 2, em, { color: WALL_TENS, w: em * 0.16, seed: 8100 + n }); drawNumber(cx2d(g), t[1], cx + em * 0.3, cy - em / 2, em, { color: WALL_UNITS, w: em * 0.16, seed: 8200 + n }); }
    else drawNumber(cx2d(g), t, cx, cy - em / 2, em, { w: em * 0.16, seed: 8100 + n });
  }));
  return at;
};
// une flèche jaune cernée d'encre, le long des points `p`
const arrow = (g: Gfx, p: P[], seed: number) => {
  ink(g, p, INK, { w: 6.5, shadow: 0, taper: [0.1, 0.05], seed }, 0.4); ink(g, p, LIT, { w: 4.4, shadow: 0, taper: [0.1, 0.05], seed: seed + 1 });
  const [a, b] = [p[p.length - 2], p[p.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 11, Wd = 8;
  const head: P[] = [[b[0] - Math.cos(ang) * L + Math.sin(ang) * Wd, b[1] - Math.sin(ang) * L - Math.cos(ang) * Wd], [b[0] + Math.cos(ang) * 4, b[1] + Math.sin(ang) * 4], [b[0] - Math.cos(ang) * L - Math.sin(ang) * Wd, b[1] - Math.sin(ang) * L + Math.cos(ang) * Wd]];
  fillShape(g, head, LIT); ink(g, head, INK, { w: 2.2, closed: true, shadow: 0.2, seed: seed + 2 });
};
// L7 · + 10 sur le mur : le poisson passe de 34 à 44, juste en dessous ; les dizaines en corail, les unités en bleu
const vL7 = (g: Gfx) => {
  const cell = 29, at = wallPiece(g, -49, -48, cell, [[33, 34, 35], [43, 44, 45]], [34, 44], true, 20);
  const [ax, ay] = at(0, 1), [, by] = at(1, 1);
  arrow(g, [[ax, ay + cell / 2 + 1], [ax, by - cell / 2 - 4]], 8300);
};
// L8 · L'astuce du 9 : + 10 (on descend d'une rangée), puis un pas en arrière
const vL8 = (g: Gfx) => {
  const cell = 29, at = wallPiece(g, -58, -48, cell, [[33, 34, 35], [43, 44, 45]], [34, 44, 43], false, 20, 18);
  const [ax, ay] = at(0, 1), [bx, by] = at(1, 1), [cx] = at(1, 0);
  arrow(g, [[ax, ay + cell / 2 + 1], [ax, by - cell / 2 - 4]], 8310);
  arrow(g, [[bx - cell / 2 + 1, by], [cx + cell / 2 + 4, by]], 8320);
};
// L9 · Passer la dizaine : les cailloux 38, 40 et 43, les ponts « + 2 » et « + 3 »
const vL9 = (g: Gfx) => {
  const c = cx2d(g), r = 21, y = 22, xs = [-80, -4, 80];
  drawBridge(c, [xs[0], y], [xs[1], y], "+2", { r, em: 17, seed: 8330 });
  drawBridge(c, [xs[1], y], [xs[2], y], "+3", { r, em: 17, seed: 8340 });
  ["38", "40", "43"].forEach((t, i) => drawStone(c, xs[i], y, t, { r, seed: 8350 + i * 10 }));
};
export const LESSON_VIGNETTES: Record<string, (g: Gfx) => void> = { L1: vL1, L2: vL2, L3: vL3, L4: vL4, L5: vL5, L6: vL6, L7: vL7, L8: vL8, L9: vL9, L10: vL10 };
export const drawLessonVignette = (g: Gfx, id: string, x: number, y: number, s = 1) => scaled(g, x, y, s, () => LESSON_VIGNETTES[id]?.(g));

// ---------------------------------------------------------------- les plaques du menu des leçons
// le numéro de la plaque : le numéro de la leçon (L10 : 10), dans la main des numéros des niveaux
const tileNumber = (g: Gfx, cx: number, cy: number, t: string, seed: number) => {
  const em = NUM_EM; drawNumber(cx2d(g), t, cx, cy + NUM_TOP, em, { color: INK, w: em * 0.17, seed });
  g.mark([[cx - 30, cy + NUM_TOP], [cx + 30, cy + NUM_TOP + em + 4]]);
};
export const drawLessonMenuTile = (g: Gfx, cx: number, cy: number, id: string) => {
  const n = Number(id.slice(1));
  plaque(g, cx, cy, 8400 + n);
  g.group("plain", () => {
    clipped(g, inside(cx, cy), () => { underline(g, cx, cy, 8420 + n); drawLessonVignette(g, id, cx, cy + VIGN_Y + 2, 0.7); });
    tileNumber(g, cx, cy, String(n), 8440 + n);
    g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]);
  });
};

// ---------------------------------------------------------------- les tables à consulter
// une petite grille : la rangée et la colonne d'en-tête en bleu de l'ardoise, une case allumée et ses deux en-têtes
const miniTable = (g: Gfx, cx: number, cy: number, op: "+" | "×") => {
  const n = 4, cell = 12.5, gap = 2.2, W = n * cell + (n - 1) * gap, x0 = cx - W / 2, y0 = cy - W / 2;
  const slab = rrect(x0 - 5, y0 - 5, W + 10, W + 10, 7);
  fillShape(g, shift(slab, 3, 4), SH, 0.25); cel(g, slab, "#fffaf0", "#e3d6bb", 2.5); contour(g, slab, 2.4, 8500);
  const lit: [number, number] = [2, 3];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const x = x0 + c * (cell + gap), y = y0 + r * (cell + gap), s = rrect(x, y, cell, cell, 3.5), head = r === 0 || c === 0, on = r === lit[0] && c === lit[1], hl = head && ((r === 0 && c === lit[1]) || (c === 0 && r === lit[0]));
    if (r === 0 && c === 0) { drawWord(cx2d(g), op, x + cell / 2, y + 2, cell - 4, { color: INK, w: 2.2, seed: 8510 }); continue; }
    fillShape(g, s, on ? LIT : hl ? "#7fd0da" : head ? "#2f6d78" : CELL);
    ink(g, s, on ? LIT_S : head ? "#21545d" : "#d9c7ae", { w: 1.1, closed: true, shadow: 0.3, seed: 8520 + r * n + c });
  }
};
// le signe de la table, en grand, à la place du numéro
export const drawTableTile = (g: Gfx, cx: number, cy: number, op: "+" | "×") => {
  plaque(g, cx, cy, op === "+" ? 8560 : 8561);
  g.group("plain", () => {
    clipped(g, inside(cx, cy), () => { underline(g, cx, cy, 8562); miniTable(g, cx, cy + VIGN_Y + 2, op); });
    // le signe, du trait des numéros : deux traits d'encre épais (« + » droit, « × » penché)
    const r = NUM_EM * 0.44, y = cy + NUM_TOP + NUM_EM / 2 + 1, q = op === "+" ? 0 : Math.PI / 4;
    [0, Math.PI / 2].forEach((a, i) => { const c = Math.cos(a + q) * r, d = Math.sin(a + q) * r; ink(g, [[cx - c, y - d], [cx + c, y + d]], INK, { w: NUM_EM * 0.24, shadow: 0.3, taper: [0.1, 0.12], seed: 8571 + i, min: 0.7 }); });
    g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]);
  });
};
// la place réservée d'une table à venir (maquette seulement) : le contour de la plaque en pointillé
export const drawReservedTile = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const s = rrect(cx - TILE_W / 2, cy - TILE_H / 2, TILE_W, TILE_H, 22);
  for (let i = 0; i < s.length - 1; i += 2) ink(g, [s[i], s[i + 1]], "#e8fffb", { w: 3, shadow: 0, taper: [0.2, 0.2], seed: 8580 + i }, 0.55);
});

// ---------------------------------------------------------------- les pictogrammes des rangées du menu
// ceux de la frise (plats, sans bulle : ils ne ressemblent à aucun bouton), en grand
export const ROW_ICON_S = 2.1;
export const drawRowIcon = (g: Gfx, cx: number, cy: number, ex: "ligne" | "additions" | "calcul") => scaled(g, cx, cy, ROW_ICON_S, () => (ex === "ligne" ? drawStepLine : ex === "additions" ? drawStepPlus : drawStepCalc)(g, 0, 0));

// ---------------------------------------------------------------- la fin d'une leçon : « À toi ! » et la maison
// « À toi ! » : une grande bulle (rayon 104) avec, dedans, la plaque du niveau de l'exercice associé (celle de l'écran
// « choisir », numéro compris) et, en bas à droite, une petite bulle au triangle de lecture (« on y va »)
export const ATOI_R = 104;
export const drawAToiKey = (g: Gfx, cx: number, cy: number, ex: "ligne" | "additions" | "calcul", level: number) => {
  drawAnswerBubble(g, cx, cy, 31, ATOI_R);
  scaled(g, cx, cy - 4, 0.9, () => (ex === "ligne" ? drawLineTile : ex === "additions" ? drawFamilyTile : drawCalcTile)(g, 0, 0, level));
  const px = cx + ATOI_R * 0.7, py = cy + ATOI_R * 0.7;
  drawAnswerBubble(g, px, py, 32, 32);
  g.group("plain", () => { const t: P[] = [[px - 8, py - 13], [px + 15, py], [px - 8, py + 13]]; fillShape(g, shift(t, 2, 3), SH, 0.25); cel(g, t, "#ff7a5c", "#c64d3c", 2.5); contour(g, t, 2.8, 8600); });
};
// la maison, en grande bulle (la même que celle du coin haut gauche, agrandie)
export const HOME_BIG_S = 1.3;
export const drawBigHomeKey = (g: Gfx, cx: number, cy: number) => scaled(g, cx, cy, HOME_BIG_S, () => drawHomeKey(g, 0, 0));

// pour la planche spécimen
export const LESSON_ROWS: { ex: "ligne" | "additions" | "calcul"; ids: string[] }[] = [
  { ex: "ligne", ids: ["L1", "L2", "L3", "L10"] },
  { ex: "additions", ids: ["L4", "L5", "L6"] },
  { ex: "calcul", ids: ["L7", "L8", "L9"] },
];
export { GOLD };
