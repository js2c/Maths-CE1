// L'ÉTAL DU PÊCHEUR (lot « L'étal du pêcheur », docs/SPEC.md, section 7 quater) : ce que l'atelier dessine pour l'application.
// L'exercice lui-même (le port, l'étal, la pêche, le portefeuille, les vraies pièces et les vrais billets) est la maquette
// art/etal/, transportée telle quelle (tools/export-etal.mjs) ; ici, seulement ce qui l'annonce dans l'application, de la
// même main que le reste (oceanMarker.ts : aplats, une ombre nette, contour qui s'épaissit du côté de l'ombre, lumière en haut
// à gauche) :
//   - le pictogramme de l'exercice (écran « choisir ») : un billet et deux pièces ;
//   - une plaque par niveau (1 à 10) : son numéro en grand, et dessous le moment clé du niveau (une ardoise de prix et l'argent
//     qui paie juste, la monnaie rendue, le billet et le « ? », deux ardoises, les centimes) ;
//   - le pictogramme plat de la frise et de la rangée du menu des leçons (une pièce et son « € », sans contour) ;
//   - les vignettes des leçons L15 à L18 (menu des leçons).
// Pièces et billets sont STYLISÉS (décision BCE/2013/10, docs/IDEES.md) : des couleurs d'euro, leur valeur écrite, rien d'autre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";
import { rrect } from "./treasure";
import { drawTileNumber, inside, plaque, TILE_H, TILE_W, underline, VIGN_Y } from "./choice";
import { drawNumber, drawWord, RED, wordWidth } from "./runtime";

const SH = "#0a3f49", NACRE = "#fffaf0";
const cx2d = (g: Gfx) => g.cur as CanvasRenderingContext2D;
// les couleurs : les pièces d'un et deux euros (or et argent), les centimes (or rouge), les billets (gris-vert, rouge, bleu, orange)
const OR: [string, string] = ["#f6cf5a", "#c8962c"], ARGENT: [string, string] = ["#e3e8ec", "#a9b3ba"], CUIVRE: [string, string] = ["#f0b75a", "#b9792a"];
const BILLET: Record<number, [string, string, string]> = { 5: ["#d9e2cf", "#a9b89c", "#5d7a55"], 10: ["#f3c3b4", "#d48a78", "#a3443a"], 20: ["#bcd7ee", "#86acd0", "#2f5f8f"], 50: ["#f7cf96", "#d99a52", "#a35d1d"] };

// le signe « € » : un arc ouvert à droite et ses deux barres, à l'encre ; s : la hauteur
export const drawEuro = (g: Gfx, x: number, y: number, s: number, color = INK, seed = 9900, k = 1) => {
  const r = s / 2, arc: P[] = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.27 + 1.46 * (i / 12)); arc.push([x + r * 0.2 + Math.cos(a) * r * 0.78, y - Math.sin(a) * r * 0.95]); }
  ink(g, smooth(arc, false, 4), color, { w: Math.max(1.2, s * 0.15) * k, shadow: 0, taper: [0.12, 0.12], seed });
  for (const dy of [-0.13, 0.13]) ink(g, [[x - r * 0.98, y + dy * s], [x + r * 0.38, y + dy * s]], color, { w: Math.max(1, s * 0.11) * k, shadow: 0, taper: [0.05, 0.05], seed: seed + (dy > 0 ? 2 : 1) });
};
// une pièce vue de face, de rayon r : deux euros (couronne d'argent, cœur d'or), un euro (l'inverse), les centimes (or rouge) ;
// sa valeur écrite au milieu (« 2 », « 1 », « 50 »)
export const drawCoin = (g: Gfx, x: number, y: number, r: number, v: number, seed: number) => g.group("plain", () => {
  const out = blob(x, y, r, r, seed, 0.015, 22), cent = v < 100, [ring, core] = v === 200 ? [ARGENT, OR] : v === 100 ? [OR, ARGENT] : [CUIVRE, CUIVRE];
  fillShape(g, shift(out, r * 0.12, r * 0.16), SH, 0.28);
  cel(g, out, ring[0], ring[1], r * 0.12);
  if (!cent) { const inn = blob(x, y, r * 0.66, r * 0.66, seed + 1, 0.015, 18); cel(g, inn, core[0], core[1], r * 0.1); ink(g, inn, mix(core[1], INK, 0.3), { w: Math.max(0.8, r * 0.05), closed: true, shadow: 0, seed: seed + 2 }, 0.7); }
  else ink(g, blob(x, y, r * 0.8, r * 0.8, seed + 1, 0.015, 18), mix(CUIVRE[1], INK, 0.2), { w: Math.max(0.8, r * 0.05), closed: true, shadow: 0, seed: seed + 2 }, 0.6);
  // le reflet, en haut à gauche
  ink(g, smooth([[x - r * 0.62, y - r * 0.2], [x - r * 0.5, y - r * 0.5], [x - r * 0.2, y - r * 0.64]], false, 5), "#ffffff", { w: Math.max(1, r * 0.1), shadow: 0, taper: [0.3, 0.3], seed: seed + 3 }, 0.75);
  contour(g, out, Math.max(1.4, r * 0.1), seed + 4);
  const t = String(cent ? v : v / 100), em = r * (t.length > 1 ? 0.62 : 0.86);
  drawNumber(cx2d(g), t, x, y - em / 2, em, { color: INK, w: em * 0.16, seed: seed + 5 });
});
// un billet, centré en (x, y), de largeur w, tourné de rot (radians) : son aplat, sa bande plus sombre, sa valeur en grand
export const drawBill = (g: Gfx, x: number, y: number, w: number, v: number, rot: number, seed: number) => g.group("plain", () => {
  const h = w * 0.54, [c, s, d] = BILLET[v], cos = Math.cos(rot), sin = Math.sin(rot), at = ([px, py]: P): P => [x + px * cos - py * sin, y + px * sin + py * cos];
  const shape = rrect(-w / 2, -h / 2, w, h, w * 0.06).map(at);
  fillShape(g, shift(shape, w * 0.05, w * 0.07), SH, 0.26);
  cel(g, shape, c, s, w * 0.05);
  clipped(g, shape, () => {
    fillShape(g, rrect(w * 0.12, -h / 2, w * 0.26, h, 0).map(at), mix(c, d, 0.22), 0.8);
    ink(g, [at([-w * 0.42, h * 0.3]), at([-w * 0.05, h * 0.3])], mix(s, d, 0.4), { w: Math.max(0.8, w * 0.02), shadow: 0, taper: [0.2, 0.2], seed: seed + 1 }, 0.8);
  });
  contour(g, shape, Math.max(1.4, w * 0.035), seed + 2);
  const t = String(v), em = h * 0.5, [nx, ny] = at([-w * 0.2, -h * 0.02]);
  const ctx = cx2d(g); ctx.save(); ctx.translate(nx, ny); ctx.rotate(rot); drawNumber(ctx, t, 0, -em / 2, em, { color: d, w: em * 0.17, seed: seed + 3 }); ctx.restore();
});
// une ardoise de prix (comme celles de l'étal) : bois, ardoise sombre, le prix à la craie et son « € »
export const drawPriceTag = (g: Gfx, x: number, y: number, txt: string, em: number, seed: number) => g.group("plain", () => {
  const tw = wordWidth(txt) * em, w = tw + em * 1.5, h = em * 1.55, frame = rrect(x - w / 2 - 4, y - h / 2 - 4, w + 8, h + 8, 5), slate = rrect(x - w / 2, y - h / 2, w, h, 3);
  ink(g, [[x, y + h / 2], [x, y + h / 2 + em * 0.6]], "#3b2a1c", { w: Math.max(1.4, em * 0.12), shadow: 0, seed: seed + 1 });
  fillShape(g, shift(frame, 3, 4), SH, 0.25); cel(g, frame, "#b7804c", "#8a5c32", 2); contour(g, frame, Math.max(1.4, em * 0.1), seed + 2);
  fillShape(g, slate, "#2a3034");
  const x0 = x - (tw + em * 0.75) / 2;
  drawWord(cx2d(g), txt, x0 + tw / 2, y - em / 2, em, { color: "#f4f1e8", w: em * 0.15, seed: seed + 3 });
  drawEuro(g, x0 + tw + em * 0.45, y + em * 0.02, em * 0.82, "#f4f1e8", seed + 4);
});
// une petite flèche, de a vers b (la monnaie rendue)
const fleche = (g: Gfx, a: P, b: P, seed: number) => {
  ink(g, smooth([a, [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 8], b], false, 6), INK, { w: 2.6, shadow: 0, taper: [0.1, 0.05], seed });
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + 0.35, L = 7;
  ink(g, [[b[0] - Math.cos(ang - 0.6) * L, b[1] - Math.sin(ang - 0.6) * L], b, [b[0] - Math.cos(ang + 0.6) * L, b[1] - Math.sin(ang + 0.6) * L]], INK, { w: 2.4, shadow: 0, taper: [0.1, 0.1], seed: seed + 1 });
};

// ---------------------------------------------------------------- le pictogramme de l'exercice (écran « choisir »)
export const drawExerciseEtal = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 28, 70);
  drawBill(g, cx - 6, cy - 14, 92, 20, -0.16, 9910);
  drawCoin(g, cx + 26, cy + 26, 25, 200, 9920);
  drawCoin(g, cx - 28, cy + 30, 19, 100, 9930);
  g.group("plain", () => g.mark([[cx - 70, cy - 70], [cx + 70, cy + 70]]));
};
// le pictogramme plat de la frise (et de la rangée du menu des leçons) : une pièce d'or, sa couronne plus claire et son « € »,
// sans contour (comme les autres étapes)
export const drawStepEtal = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  fillShape(g, blob(cx, cy, 15, 15, 9940, 0.02, 18), "#ffc93a");
  fillShape(g, blob(cx, cy, 10.5, 10.5, 9941, 0.02, 16), "#fff4de");
  drawEuro(g, cx, cy + 0.5, 14, "#c8862c", 9942, 1.5);
});

// ---------------------------------------------------------------- les plaques des niveaux
// le moment clé de chaque niveau, posé sous le numéro (VIGN_Y : le centre de la vignette)
const VIGNETTES: Record<number, (g: Gfx, x: number, y: number) => void> = {
  // 1 · pièces et billets : un billet de 10, une pièce de 2, une pièce de 1
  1: (g, x, y) => { drawBill(g, x - 26, y, 62, 10, -0.08, 9950); drawCoin(g, x + 22, y + 2, 14, 200, 9952); drawCoin(g, x + 50, y + 4, 12, 100, 9954); },
  // 2 · 7 € avec des pièces : 2, 2, 2, 1
  2: (g, x, y) => { drawPriceTag(g, x - 46, y - 6, "7", 14, 9960); [200, 200, 200, 100].forEach((v, i) => drawCoin(g, x - 12 + i * 24, y + 6, v === 200 ? 12 : 11, v, 9962 + i * 7)); },
  // 3 · 17 € : 10, 5, 2
  3: (g, x, y) => { drawPriceTag(g, x - 46, y - 8, "17", 13, 9990); drawBill(g, x + 2, y - 2, 44, 10, -0.1, 9992); drawBill(g, x + 26, y + 10, 42, 5, 0.06, 9994); drawCoin(g, x + 56, y + 4, 12, 200, 9996); },
  // 4 · 34 € : 20, 10, 2, 2
  4: (g, x, y) => { drawPriceTag(g, x - 46, y - 8, "34", 13, 10000); drawBill(g, x + 6, y - 4, 44, 20, -0.12, 10002); drawBill(g, x + 26, y + 10, 42, 10, 0.06, 10004); drawCoin(g, x + 52, y - 6, 10, 200, 10006); drawCoin(g, x + 58, y + 14, 10, 200, 10008); },
  // 5 · portefeuille restreint : 7 € sans pièce de 1 € ; la pièce de 1 € barrée, le billet de 5 et la pièce de 2
  5: (g, x, y) => {
    drawPriceTag(g, x - 46, y - 8, "7", 14, 10010); drawBill(g, x + 6, y + 2, 46, 5, -0.08, 10012); drawCoin(g, x + 46, y + 4, 12, 200, 10014);
    g.group("plain", () => { const cx = x + 30, cy = y - 18; const c = blob(cx, cy, 10, 10, 10016, 0.02, 14); cel(g, c, mix(OR[0], "#ffffff", 0.35), mix(OR[1], "#ffffff", 0.35), 1.2); contour(g, c, 1.8, 10019); drawNumber(cx2d(g), "1", cx, cy - 6, 12, { color: mix(INK, "#ffffff", 0.3), w: 2, seed: 10015 }); ink(g, [[cx - 12, cy - 12], [cx + 12, cy + 12]], RED, { w: 3.4, shadow: 0, seed: 10017 }); ink(g, [[cx + 12, cy - 12], [cx - 12, cy + 12]], RED, { w: 3.4, shadow: 0, seed: 10018 }); });
  },
  // 6 · la monnaie rendue : 13 €, un billet de 20, la monnaie qui revient (2 et 5)
  6: (g, x, y) => { drawPriceTag(g, x - 48, y - 8, "13", 13, 10020); drawBill(g, x - 4, y + 6, 42, 20, -0.06, 10022); g.group("plain", () => fleche(g, [x + 18, y + 4], [x + 34, y + 4], 10024)); drawCoin(g, x + 50, y - 8, 10, 200, 10026); drawBill(g, x + 52, y + 14, 32, 5, 0.08, 10028); },
  // 7 · combien je te rends ? 13 €, un billet de 20 et le « ? » rouge
  7: (g, x, y) => { drawPriceTag(g, x - 46, y - 8, "13", 13, 10030); drawBill(g, x + 6, y + 2, 50, 20, -0.08, 10032); g.group("plain", () => drawNumber(cx2d(g), "?", x + 50, y - 16, 28, { color: RED, w: 4.4, seed: 10034 })); },
  // 8 · deux produits : deux ardoises, 3 et 4
  8: (g, x, y) => { drawPriceTag(g, x - 40, y - 6, "3", 13, 10040); drawPriceTag(g, x - 6, y - 6, "4", 13, 10042); [200, 200, 200, 100].forEach((v, i) => drawCoin(g, x + 26 + (i % 2) * 20, y - 8 + Math.floor(i / 2) * 20, 9, v, 10044 + i * 7)); },
  // 9 · les centimes : 3,50 € = 2 + 1 + 50 c
  9: (g, x, y) => { drawPriceTag(g, x - 40, y - 8, "3,50", 12, 10070); drawCoin(g, x + 10, y + 4, 12, 200, 10072); drawCoin(g, x + 34, y + 6, 11, 100, 10074); drawCoin(g, x + 57, y + 8, 10, 50, 10076); },
  // 10 · les centimes : 2,70 € = 2 + 50 c + 20 c
  10: (g, x, y) => { drawPriceTag(g, x - 40, y - 8, "2,70", 12, 10080); drawCoin(g, x + 10, y + 4, 12, 200, 10082); drawCoin(g, x + 34, y + 6, 10, 50, 10084); drawCoin(g, x + 55, y + 8, 9, 20, 10086); },
};
export const drawEtalTile = (g: Gfx, cx: number, cy: number, level: number) => {
  plaque(g, cx, cy, 10100 + level);
  g.group("plain", () => clipped(g, inside(cx, cy), () => underline(g, cx, cy, 10120 + level)));
  VIGNETTES[level]?.(g, cx, cy + VIGN_Y + 2);
  g.group("plain", () => { drawTileNumber(g, cx, cy, level); g.mark([[cx - TILE_W / 2, cy - TILE_H / 2], [cx + TILE_W / 2, cy + TILE_H / 2]]); });
};

// ---------------------------------------------------------------- les vignettes des leçons (menu des leçons)
// L15 · Pièces et billets : une pièce de 2 € = deux pièces de 1 €
export const vL15 = (g: Gfx) => {
  drawCoin(g, -50, 0, 22, 200, 10200);
  g.group("plain", () => drawWord(cx2d(g), "=", -14, -14, 28, { color: INK, w: 4.4, seed: 10202 }));
  drawCoin(g, 22, 0, 19, 100, 10204); drawCoin(g, 62, 0, 19, 100, 10206);
};
// L16 · Payer juste : 17 €, du plus gros au plus petit : 10, 15, 16, 17
export const vL16 = (g: Gfx) => {
  drawBill(g, -58, 6, 50, 10, -0.06, 10210); drawBill(g, -10, 8, 46, 5, 0.04, 10212); drawCoin(g, 30, 8, 13, 100, 10214); drawCoin(g, 60, 8, 13, 100, 10216);
  g.group("plain", () => ["10", "15", "16", "17"].forEach((t, i) => drawNumber(cx2d(g), t, [-58, -10, 30, 60][i], -30, 17, { color: i === 3 ? RED : INK, w: 2.8, seed: 10218 + i })));
};
// L17 · Rendre la monnaie : de 13 à 20, le saut « + 7 »
// (relecture du lot, R11 : les nombres dans leur propre groupe, après les traits ; tracés dans le même groupe qu'eux, ils
// partaient dans la tuile voisine)
export const vL17 = (g: Gfx) => {
  const x0 = -70, x1 = 70, y = 14;
  g.group("plain", () => {
    ink(g, [[x0 - 6, y], [x1 + 6, y]], INK, { w: 3, shadow: 0, taper: [0.1, 0.1], seed: 10230 });
    for (let i = 0; i <= 7; i++) { const x = x0 + (i * (x1 - x0)) / 7; ink(g, [[x, y - 6], [x, y + 6]], INK, { w: 2.2, shadow: 0, seed: 10231 + i }); }
    ink(g, smooth([[x0, y - 6], [0, y - 46], [x1, y - 6]], false, 10), "#ffd23a", { w: 5, shadow: 0, taper: [0.05, 0.2], seed: 10240 });
  });
  g.group("plain", () => {
    const ctx = cx2d(g);
    drawWord(ctx, "+7", 0, y - 66, 18, { color: INK, w: 3, seed: 10241 });
    drawNumber(ctx, "13", x0, y + 10, 16, { color: INK, w: 2.6, seed: 10242 }); drawNumber(ctx, "20", x1, y + 10, 16, { color: INK, w: 2.6, seed: 10243 });
  });
};
// L18 · Les centimes : deux pièces de 50 centimes = une pièce de 1 €
export const vL18 = (g: Gfx) => {
  drawCoin(g, -62, 0, 18, 50, 10250); drawCoin(g, -24, 0, 18, 50, 10252);
  g.group("plain", () => drawWord(cx2d(g), "=", 12, -14, 28, { color: INK, w: 4.4, seed: 10254 }));
  drawCoin(g, 56, 0, 21, 100, 10256);
};
void NACRE;
