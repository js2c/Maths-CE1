// L'ÉCRAN « CHOISIR » (lot 3, docs/SPEC-LOT3.md, section 2) : sans texte à lire, des pictogrammes.
//   - le bouton « choisir » de l'accueil : quatre petites plaques en carré, l'une entourée d'or (« j'en prends une ») ;
//   - les exercices : la ligne graduée (la tortue sur sa corde), les additions (le « + » de l'entraînement libre,
//     déjà dessiné dans ui.ts), les leçons (un livre ouvert, un saut de tortue sur ses pages) ; le calcul rapide
//     (le mur de corail) viendra à l'étape 3 ;
//   - une vignette par niveau de la ligne graduée (1 à 13) : une plaque de nacre et, dedans, la ligne du niveau en
//     petit, dessinée avec les primitives de la ligne de l'application (runtime.ts : même corde, mêmes bouées, mêmes
//     chiffres) : corde courte à bouées, ligne de 0 à 100, ligne sans graduations avec un « ? »… ;
//   - une vignette par famille d'additions (1 à 7) avec son appui : la tortue qui saute, le poisson et son reflet,
//     le cadre de 10, la maison (le 7, puis le 9 sur le toit), le double + 1, et pour le mélange un peu de tout ;
//   - la plaque des leçons (le livre en petit ; l'application écrit dessous les nombres de la leçon) ;
//   - la lueur du niveau conseillé, derrière sa plaque.
// Même main que le reste (oceanMarker.ts) : aplats, une ombre nette, contour qui s'épaissit du côté de l'ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble, drawFish } from "./decor";
import { rrect } from "./treasure";
import { drawTurtle, TURTLE_REST } from "./turtle";
import { drawBonusBubble, drawHouseBase, drawHouseFloor, drawHouseRoof, drawTenFrame, HOUSE, TEN_H, TEN_W } from "./aids";
import { drawJumpArc, drawLine, drawNumber, type LineSpec, RED, tickP } from "./runtime";

const SH = "#0a3f49", NACRE = "#fffaf0", NACRE_S = "#e3d6bb", SEA = "#35b3c1", GOLD = "#ffd23a";
// une vignette : plaque de nacre de TILE_W × TILE_H, centrée
export const TILE_W = 150, TILE_H = 136, TILE_R = 22;
// lot 3 bis (docs/SPEC-LOT3BIS.md, B1) : chaque plaque porte son NUMÉRO en grand, en haut (le parent peut dire « fais le 7 »
// quel que soit l'exercice) ; la vignette du niveau est posée en petit dessous, dans la moitié basse (VIGN_Y : son centre,
// VIGN_S : sa réduction par rapport à la vignette du lot 3)
export const NUM_EM = 40, NUM_TOP = -TILE_H / 2 + 9, VIGN_Y = 30, VIGN_S = 0.8;
// le numéro d'une plaque : l'encre la plus sombre de l'écran, un trait épais
export const drawTileNumber = (g: Gfx, cx: number, cy: number, n: number) => {
  const ctx = g.cur as CanvasRenderingContext2D, t = String(n), em = NUM_EM;
  drawNumber(ctx, t, cx, cy + NUM_TOP, em, { color: INK, w: em * 0.17, seed: 5860 + n });
  g.mark([[cx - 30, cy + NUM_TOP], [cx + 30, cy + NUM_TOP + em + 4]]);
};
// un filet clair sous le numéro, qui sépare le numéro de la vignette
export const underline = (g: Gfx, cx: number, cy: number, seed: number) => ink(g, smooth([[cx - 44, cy + NUM_TOP + NUM_EM + 9], [cx, cy + NUM_TOP + NUM_EM + 7], [cx + 44, cy + NUM_TOP + NUM_EM + 9]], false, 6), NACRE_S, { w: 2.4, shadow: 0, taper: [0.3, 0.3], seed }, 0.9);
export const plaque = (g: Gfx, cx: number, cy: number, seed: number) => g.group("plain", () => {
  const s = rrect(cx - TILE_W / 2, cy - TILE_H / 2, TILE_W, TILE_H, TILE_R);
  fillShape(g, shift(s, 6, 8), SH, 0.28);
  cel(g, s, NACRE, NACRE_S, 6, [smooth([[cx - TILE_W / 2 + 14, cy - TILE_H / 2 + 10], [cx - 10, cy - TILE_H / 2 + 7], [cx - 20, cy - TILE_H / 2 + 14], [cx - TILE_W / 2 + 16, cy - TILE_H / 2 + 18]], true, 4), "#ffffff"]);
  contour(g, s, 3.6, seed);
});
// l'intérieur de la plaque (le dessin ne déborde pas du bord : il est découpé par la plaque, marge comprise)
export const inside = (cx: number, cy: number): P[] => rrect(cx - TILE_W / 2 + 5, cy - TILE_H / 2 + 5, TILE_W - 10, TILE_H - 10, TILE_R - 4);
// dessine `fn` à l'échelle s, l'origine (0, 0) de fn en (x, y) ; les primitives de runtime.ts dessinent dans g.cur
const scaled = (g: Gfx, x: number, y: number, s: number, fn: () => void) => { g.push(x, y, s); fn(); g.pop(); };

// ---------------------------------------------------------------- le bouton « choisir » de l'accueil
export const drawChooseKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 24, 60);
  g.group("plain", () => {
    // quatre petites plaques colorées (les exercices), la dernière entourée d'or : on en choisit une
    const cols: [string, string][] = [[SEA, "#1d7f8f"], ["#ff8f70", "#d0573f"], ["#ffc93a", "#e08d1c"], ["#9fd36a", "#5f9a3a"]];
    [[-17, -17], [17, -17], [-17, 17], [17, 17]].forEach(([dx, dy], i) => {
      const s = rrect(cx + dx - 13, cy + dy - 13, 26, 26, 7);
      fillShape(g, shift(s, 2, 3), SH, 0.25); cel(g, s, cols[i][0], cols[i][1], 2.6); contour(g, s, 2.6, 5600 + i);
    });
    const ring = rrect(cx + 17 - 20, cy + 17 - 20, 40, 40, 11);
    ink(g, ring, INK, { w: 7.5, closed: true, shadow: 0, seed: 5610 }, 0.35);
    ink(g, ring, GOLD, { w: 5, closed: true, shadow: 0, seed: 5611 });
  });
};

// ---------------------------------------------------------------- les exercices
// la ligne graduée : la tortue posée sur une corde à bouées, un arc de saut devant elle
export const drawExerciseLine = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 25, 70);
  const L: LineSpec = { x0: -110, x1: 110, y: 0, n: 4, labels: [null, null, null, null], k: 0 };
  g.group("plain", () => {
    clipped(g, blob(cx, cy, 64, 64, 300 + 25, 0.02, 20), () => scaled(g, cx, cy + 22, 0.5, () => { drawLine(g.cur as CanvasRenderingContext2D, L); drawJumpArc(g.cur as CanvasRenderingContext2D, tickP(L, 1), tickP(L, 2), 1, { h: 40 }); }));
    g.mark([[cx - 64, cy - 64], [cx + 64, cy + 64]]);
  });
  const [bx, by] = tickP(L, 1);
  scaled(g, cx + bx * 0.5 - 2, cy + 22 + by * 0.5 - 6, 0.62, () => drawTurtle(g, TURTLE_REST, 0, 0));
};
// le livre ouvert, sur ses pages une petite corde et un saut numéroté (lot « Les leçons » : la bulle « les leçons » de
// l'accueil, sea/lecons.ts ; jusque-là l'image des leçons de l'écran « choisir »)
export const drawOpenBook = (g: Gfx, cx: number, cy: number, k: number, seed: number) => g.group("plain", () => {
  const w = 44 * k, h = 30 * k, sag = 7 * k;
  // la couverture sous les pages (turquoise, comme l'album)
  const cover = smooth([[cx - w - 6 * k, cy - h + 6 * k], [cx - w * 0.5, cy - h + 2 * k], [cx, cy - h + 8 * k], [cx + w * 0.5, cy - h + 2 * k], [cx + w + 6 * k, cy - h + 6 * k], [cx + w + 6 * k, cy + h + 6 * k], [cx, cy + h + 12 * k], [cx - w - 6 * k, cy + h + 6 * k]], true, 4);
  fillShape(g, shift(cover, 3 * k, 4 * k), SH, 0.28); cel(g, cover, "#35b3c1", "#1d7f8f", 3 * k); contour(g, cover, 3 * k, seed);
  // deux pages qui se creusent vers la reliure
  [-1, 1].forEach((sd, i) => {
    const page = smooth([[cx, cy - h + sag], [cx + sd * w * 0.5, cy - h - 2 * k], [cx + sd * w, cy - h + 2 * k], [cx + sd * w, cy + h], [cx + sd * w * 0.5, cy + h - 3 * k], [cx, cy + h + 4 * k]], true, 4);
    cel(g, page, NACRE, NACRE_S, 2.5 * k); contour(g, page, 2.4 * k, seed + 1 + i);
  });
  // sur les pages : trois graduations et un arc de saut jaune (ce que montrent les leçons)
  const y = cy + 8 * k, xs = [cx - 30 * k, cx - 12 * k, cx + 12 * k, cx + 30 * k];
  ink(g, [[cx - 36 * k, y], [cx - 4 * k, y + 2 * k]], INK, { w: 2.2 * k, shadow: 0, taper: [0.1, 0.1], seed: seed + 4 });
  ink(g, [[cx + 4 * k, y + 2 * k], [cx + 36 * k, y]], INK, { w: 2.2 * k, shadow: 0, taper: [0.1, 0.1], seed: seed + 5 });
  xs.forEach((x, i) => fillShape(g, blob(x, y + (i === 1 || i === 2 ? 1.5 * k : 0), 3.6 * k, 3.6 * k, seed + 6 + i, 0.05, 10), "#ff5a4a"));
  [[0, 1], [2, 3]].forEach(([a, b], i) => { const arc = smooth([[xs[a], y - 4 * k], [(xs[a] + xs[b]) / 2, y - 22 * k], [xs[b], y - 4 * k]], false, 8); ink(g, arc, INK, { w: 5 * k, shadow: 0, taper: [0.1, 0.1], seed: seed + 10 + i }, 0.35); ink(g, arc, "#ffe45c", { w: 3.4 * k, shadow: 0, taper: [0.1, 0.1], seed: seed + 12 + i }); });
  // la reliure
  ink(g, [[cx, cy - h + sag], [cx, cy + h + 4 * k]], mix(NACRE_S, INK, 0.4), { w: 2 * k, shadow: 0, taper: [0.2, 0.2], seed: seed + 14 });
});

// ---------------------------------------------------------------- la lueur du conseillé
// (lot 3 bis, B1 : la lueur du lot 3 se voyait à peine ; elle est désormais un halo épais, doré au bord de la plaque et qui
// s'éteint vers l'extérieur, cerné d'un fil d'or ; l'application la fait respirer doucement, en opacité et en taille)
export const GLOW_PAD = 26;
export const drawTileGlow = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  for (let i = GLOW_PAD; i >= 0; i--) fillShape(g, rrect(cx - TILE_W / 2 - i, cy - TILE_H / 2 - i, TILE_W + 2 * i, TILE_H + 2 * i, TILE_R + i), i > 12 ? "#fff3b8" : "#ffe066", i > 12 ? 0.1 : 0.16);
  ink(g, rrect(cx - TILE_W / 2 - 7, cy - TILE_H / 2 - 7, TILE_W + 14, TILE_H + 14, TILE_R + 7), "#ffd23a", { w: 7, closed: true, shadow: 0, seed: 5801 }, 0.95);
});

// ---------------------------------------------------------------- les niveaux de la ligne graduée
// la ligne de chaque niveau, en petit : mêmes spécifications que l'application (niveaux de module1.json),
// réduites à ce qui se lit dans une vignette
const L = (n: number, labels: Record<number, string>, k: number, extra: Partial<LineSpec> = {}): LineSpec => ({ x0: 0, x1: 300, y: 0, n, labels: Array.from({ length: n }, (_, i) => labels[i] ?? null), k, ...extra });
export const LINE_TILES: Record<number, LineSpec> = {
  1: L(6, { 0: "0", 1: "1", 2: "2", 3: "3", 5: "5" }, 0, { mark: 4 }), // corde courte, tous les nombres sauf la cible
  2: L(11, { 0: "0", 5: "5", 10: "10" }, 0), // 0, 5 et 10
  3: L(21, { 0: "0", 10: "10", 20: "20" }, 0.5), // 0 à 20
  4: L(11, { 0: "30", 10: "40" }, 0.8, { mark: 4 }), // dix graduations qui ne partent pas de 0
  5: L(11, { 0: "0", 5: "50", 10: "100" }, 1), // de 10 en 10
  6: L(21, { 0: "30", 10: "40", 20: "50" }, 1), // segment de 20
  7: L(4, { 0: "40", 1: "50" }, 1, { mark: 3 }), // pas à déduire
  8: { x0: 0, x1: 300, y: 0, n: 0, labels: [], ends: ["0", "100"], k: 1, marks: [{ t: 0.5, label: "?" }] }, // sans graduations
  9: L(11, { 0: "0", 5: "500", 10: "1000" }, 1), // 0 à 1 000
  10: L(11, { 0: "300", 10: "400" }, 1, { mark: 4 }), // une centaine de 10 en 10
  11: L(21, { 0: "340", 10: "350", 20: "360" }, 1), // 20 graduations de 1
  13: { x0: 0, x1: 300, y: 0, n: 0, labels: [], ends: ["0", "1000"], k: 1, marks: [{ t: 0.3, label: "?" }] },
};
export const drawLineTile = (g: Gfx, cx: number, cy: number, level: number) => {
  plaque(g, cx, cy, 5700 + level);
  g.group("plain", () => {
    clipped(g, inside(cx, cy), () => {
      underline(g, cx, cy, 5840 + level);
      if (level === 12) return scaled(g, cx, cy + VIGN_Y + 2, 0.72, () => dictationTile(g, 0, 0));
      // la ligne tient dans la moitié basse de la plaque, centrée : 300 de large (114 à l'écran), de la réglette (-30) au bas
      // des nombres (+116) ; la corde garde ses poteaux
      const spec = LINE_TILES[level], s = 0.38;
      scaled(g, cx - 150 * s, cy + VIGN_Y - 21, s, () => drawLine(g.cur as CanvasRenderingContext2D, spec));
    });
    drawTileNumber(g, cx, cy, level);
    g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]);
  });
};
// la dictée (niveau 12) : l'ardoise et un nombre avec un zéro au milieu, le zéro en rouge
const dictationTile = (g: Gfx, cx: number, cy: number) => {
  const s = rrect(cx - 52, cy - 32, 104, 64, 12);
  fillShape(g, shift(s, 3, 4), SH, 0.25); cel(g, s, "#2f6d78", "#21545d", 3); contour(g, s, 3, 5720);
  const ctx = g.cur as CanvasRenderingContext2D;
  drawNumber(ctx, "3", cx - 26, cy - 18, 36, { color: NACRE, w: 5.2, seed: 5721 });
  drawNumber(ctx, "0", cx, cy - 18, 36, { color: "#ff8f70", w: 5.2, seed: 5722 });
  drawNumber(ctx, "7", cx + 26, cy - 18, 36, { color: NACRE, w: 5.2, seed: 5723 });
};

// ---------------------------------------------------------------- les familles d'additions
export const drawFamilyTile = (g: Gfx, cx: number, cy: number, fam: number) => {
  plaque(g, cx, cy, 5740 + fam);
  g.group("plain", () => {
    clipped(g, inside(cx, cy), () => { underline(g, cx, cy, 5850 + fam); scaled(g, cx, cy + VIGN_Y + 2, 0.7, () => FAMILY[fam]?.(g, 0, 0)); });
    drawTileNumber(g, cx, cy, fam);
    g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]);
  });
};
export const reflet = (g: Gfx, cx: number, cy: number, n: number, bonus: boolean) => {
  const gap = 34, x0 = cx - ((n - 1) * gap) / 2 - (bonus ? 16 : 0);
  // le miroir d'eau, puis les poissons au-dessus et leur reflet en dessous (plus pâle)
  ink(g, smooth([[x0 - 22, cy + 1], [cx, cy - 1], [x0 + (n - 1) * gap + 22, cy + 1]], false, 6), "#9fdfe6", { w: 3, shadow: 0, taper: [0.2, 0.2], seed: 5760 });
  for (let i = 0; i < n; i++) {
    scaled(g, x0 + i * gap, cy - 20, 0.55, () => drawFish(g, 1, 1, i, 0, 0));
    scaled(g, x0 + i * gap, cy + 22, 0.55, () => drawFish(g, 1, 1, i, 0, 0));
  }
  if (bonus) scaled(g, x0 + (n - 1) * gap + 40, cy + 22, 0.6, () => drawBonusBubble(g, 0, 0));
};
export const house = (g: Gfx, cx: number, cy: number, top: string) => {
  const s = 0.3, y0 = cy - 8;
  scaled(g, cx, y0, s, () => { drawHouseRoof(g, 0, 0); drawHouseFloor(g, 0, 0); drawHouseBase(g, 0, HOUSE.floor); });
  drawNumber(g.cur as CanvasRenderingContext2D, top, cx, y0 - HOUSE.roof * s * 0.5 - 11, 22, { w: 3.6, seed: 5770 });
};
export const tenFrame = (g: Gfx, cx: number, cy: number, n: number, k = 0.24) => {
  const x = cx - (TEN_W * k) / 2, y = cy - (TEN_H * k) / 2;
  scaled(g, x, y, k, () => drawTenFrame(g, 0, 0));
  // des poissons dans les premières alvéoles : des pastilles orangées (à cette taille, un poisson ne se lit plus)
  for (let i = 0; i < n; i++) { const r = Math.floor(i / 5), c = i % 5, px = x + (18 + c * 86 + 38) * k, py = y + (18 + r * 86 + 38) * k; fillShape(g, blob(px, py, 6.5, 5.5, 5780 + i, 0.05, 10), "#ffb13b"); ink(g, blob(px, py, 6.5, 5.5, 5780 + i, 0.05, 10), INK, { w: 1.6, closed: true, shadow: 0.5, seed: 5790 + i }); }
};
export const FAMILY: Record<number, (g: Gfx, cx: number, cy: number) => void> = {
  // + 1 et + 2 : la tortue sur la corde et son saut « + 1 »
  1: (g, cx, cy) => {
    const Ls: LineSpec = { x0: 0, x1: 260, y: 0, n: 3, labels: [null, null, null], k: 0 }, k = 0.46, x = cx - 130 * k, y = cy + 18;
    scaled(g, x, y, k, () => { drawLine(g.cur as CanvasRenderingContext2D, Ls); drawJumpArc(g.cur as CanvasRenderingContext2D, tickP(Ls, 1), tickP(Ls, 2), 1, { h: 70, label: "+1", labelColor: INK }); });
    const [bx, by] = tickP(Ls, 0); scaled(g, x + bx * k - 4, y + by * k - 5, 0.62, () => drawTurtle(g, TURTLE_REST, 0, 0));
  },
  2: (g, cx, cy) => reflet(g, cx, cy, 3, false), // les doubles : le poisson et son reflet
  3: (g, cx, cy) => tenFrame(g, cx, cy, 7), // les amis de 10 : le cadre de 10
  4: (g, cx, cy) => house(g, cx, cy, "7"), // les maisons de 5, 6 et 7
  5: (g, cx, cy) => house(g, cx, cy, "9"), // les maisons de 8 et 9
  6: (g, cx, cy) => reflet(g, cx, cy, 2, true), // les presque-doubles : le double et une bulle dorée
  // le mélange : un peu de tout, le cadre, la maison, le poisson
  7: (g, cx, cy) => {
    tenFrame(g, cx - 26, cy - 22, 3, 0.16);
    scaled(g, cx + 38, cy - 10, 0.2, () => { drawHouseRoof(g, 0, 0); drawHouseFloor(g, 0, 0); });
    scaled(g, cx - 18, cy + 30, 0.6, () => drawFish(g, 0, 1, 2, 0, 0));
    fillShape(g, blob(cx + 34, cy + 32, 8, 8, 5795, 0.05, 10), "#fff1a8", 0.8);
  },
};

// un « ? » rouge et des nombres encrés : repris de runtime.ts (RED) pour rester dans la même main
export { RED, O };
