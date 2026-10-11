// LA BOUTIQUE DU RÉCIF (lot « La boutique du récif » ; décisions du parent des 10 et 11 octobre 2026, art/boutique/README.md).
// Les pictogrammes de la maquette (art/boutique/source.html : SVG_BOUTIQUE, SVG_COCHE, SVG_CROIX, SVG_BRILLER, SVG_SABLIER,
// SVG_CADENAS, SVG_ETINCELLE) étaient des dessins rapides ; ils sont redessinés ici en style A (aplats, une ombre nette par
// forme, contour d'encre qui s'épaissit du côté de l'ombre, lumière en haut à gauche), à leur taille de la maquette :
//  - la boutique : un étal à auvent rayé corail et crème, une étoile de mer et un petit poisson posés sur le comptoir, dans la
//    bulle crème des boutons ;
//  - la coche verte (acheter) et la croix rouge (annuler), dans une bulle de 88 px ;
//  - l'étincelle « briller » devant un prix, le sablier (pas encore arrivée), le cadenas (zone fermée), l'étincelle des brillantes ;
//  - L'ÉTOILE DE DIAMANT (les légendaires ; nom interne : dorée), le dessin le plus précieux de l'application : une étoile
//    taillée comme une pierre, dix facettes irisées (rose, lilas, bleu, vert d'eau, or pâle) éclairées d'en haut à gauche, une
//    table nacrée au centre, deux éclats blancs, un halo. Le reflet qui la traverse et les étincelles qui scintillent sont
//    dessinés en direct par l'application (runtime.ts, drawDiamantVif : troisième niveau de CLAUDE.md), sur la même géométrie
//    (`diamantPts`).
// Le coquillage de diamant est le grand coquillage de treasure.ts, en nacre irisée (SHELL_DIAMOND).
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";
import { rrect } from "./treasure";

const SH = "#0a3f49", TAU = Math.PI * 2;

// ---------------------------------------------------------------- l'étoile de diamant
// la géométrie, partagée avec le dessin en direct : les dix sommets (pointe, creux, pointe…), la pointe du haut d'abord
export const DIAMANT_K = 0.444; // le creux : 20 / 45 dans la maquette
export const diamantPts = (cx: number, cy: number, R: number): P[] => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? R * DIAMANT_K : R; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as P; });
// les teintes des facettes, une par branche (deux facettes par branche, l'une éclairée, l'autre dans l'ombre)
export const DIAMANT_TEINTES = ["#ff9ccf", "#b39bff", "#86d3ff", "#93edc2", "#ffdc7d"];
export const drawDiamondStar = (g: Gfx, cx: number, cy: number, R = 44) => g.group("plain", () => {
  const pts = diamantPts(cx, cy, R), L: P = [-Math.SQRT1_2, -Math.SQRT1_2];
  // le halo : trois anneaux de lumière laiteuse, du lilas au bleu glacier
  // (douze anneaux à peine opaques, du bleu glacier au blanc : une lueur douce, sans bord)
  for (let i = 0; i < 12; i++) { const k = 1.22 - i * 0.035; fillShape(g, blob(cx, cy + R * 0.04, R * k, R * k, 5101 + i, 0.015, 28), i < 4 ? "#bfeeff" : i < 8 ? "#e6dcff" : "#ffffff", 0.07); }
  // l'ombre nette portée
  fillShape(g, shift(pts, R * 0.09, R * 0.11), SH, 0.3);
  // les facettes : un triangle du centre à chaque arête ; la teinte de la branche, éclaircie côté lumière, assombrie (lilas
  // profond) côté ombre, d'après l'orientation de l'arête
  clipped(g, pts, () => {
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % 10], m: P = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy], n = Math.hypot(m[0], m[1]) || 1;
      const lum = 0.5 + 0.5 * ((m[0] / n) * L[0] + (m[1] / n) * L[1]), t = DIAMANT_TEINTES[Math.floor(i / 2) % 5];
      const c = lum > 0.5 ? mix(t, "#ffffff", 0.12 + 0.62 * (lum - 0.5) * 2) : mix(t, "#4b3f8f", 0.05 + 0.3 * (0.5 - lum) * 2);
      fillShape(g, [[cx, cy], a, b], c);
    });
    // les arêtes internes, fines (de l'encre très diluée) ; plus marquées dans l'ombre
    pts.forEach((p, i) => ink(g, [[cx, cy], p], INK, { w: i % 2 ? 0.9 : 1.2, shadow: 0, taper: [0.5, 0.1], seed: 5120 + i }, 0.22));
    // la table : un petit décagone nacré au centre, cerné de lilas
    const table = pts.map(([x, y]) => [cx + (x - cx) * 0.36, cy + (y - cy) * 0.36] as P);
    fillShape(g, table, "#fbf8ff");
    fillShape(g, smooth([[cx - R * 0.12, cy - R * 0.1], [cx - R * 0.02, cy - R * 0.14], [cx - R * 0.08, cy - R * 0.02]], true, 3), "#e6dcff", 0.8);
    ink(g, [...table, table[0]], "#8f7ff0", { w: 1.3, shadow: 0, seed: 5131 }, 0.7);
  });
  // le contour d'encre, épaissi du côté de l'ombre
  contour(g, pts, R * 0.095, 5140);
  // deux éclats blancs, côté lumière (la pointe du haut, la branche de gauche)
  ink(g, [[cx - R * 0.08, cy - R * 0.67], [cx - R * 0.03, cy - R * 0.83]], "#ffffff", { w: R * 0.075, shadow: 0, taper: [0.3, 0.4], seed: 5150 });
  ink(g, [[cx - R * 0.5, cy - R * 0.2], [cx - R * 0.37, cy - R * 0.19]], "#ffffff", { w: R * 0.06, shadow: 0, taper: [0.3, 0.4], seed: 5151 });
});

// ---------------------------------------------------------------- les étincelles
// une étincelle à quatre branches incurvées (celle des brillantes, des gerbes), crème ou bleu glacier, cernée d'encre
const sparklePts = (cx: number, cy: number, r: number): P[] => {
  const out: P[] = [];
  for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 2, b = a + Math.PI / 4; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); out.push([cx + Math.cos(b) * r * 0.2, cy + Math.sin(b) * r * 0.2]); }
  return smooth(out, true, 3);
};
export const drawSparkle = (g: Gfx, cx: number, cy: number, r = 11, color = "#fff6c4") => g.group("plain", () => {
  const s = sparklePts(cx, cy, r);
  cel(g, s, color, mix(color, "#c9a640", 0.35), r * 0.12);
  contour(g, s, Math.max(1.4, r * 0.15), 5160 + Math.round(r));
});
// « faire briller » devant un prix : une grande étincelle jaune et une petite bleue, en haut à droite
export const drawShineIcon = (g: Gfx, cx: number, cy: number) => {
  drawSparkle(g, cx - 2, cy + 1, 12.5, "#ffe36b");
  drawSparkle(g, cx + 9, cy - 9, 5.5, "#bfe9ff");
};

// ---------------------------------------------------------------- le sablier et le cadenas
// le sablier (pas encore arrivée) : deux plateaux de bois, le verre bleuté, le sable d'or qui coule
export const drawHourglass = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const glass = smooth([[cx - 12, cy - 17], [cx + 12, cy - 17], [cx + 12, cy - 13], [cx + 3, cy - 2], [cx + 3, cy + 2], [cx + 12, cy + 13], [cx + 12, cy + 17], [cx - 12, cy + 17], [cx - 12, cy + 13], [cx - 3, cy + 2], [cx - 3, cy - 2], [cx - 12, cy - 13]], true, 3);
  fillShape(g, shift(glass, 2.5, 3), SH, 0.25);
  cel(g, glass, "#e8f7fa", "#b6dde4", 2);
  const top = smooth([[cx - 8, cy - 11], [cx + 8, cy - 11], [cx + 2, cy - 4], [cx - 2, cy - 4]], true, 3), bottom = smooth([[cx - 9, cy + 15], [cx - 5, cy + 9], [cx, cy + 7], [cx + 5, cy + 9], [cx + 9, cy + 15]], true, 3);
  cel(g, top, "#f6cf66", "#d8a238", 1); cel(g, bottom, "#f6cf66", "#d8a238", 1);
  ink(g, [[cx, cy - 3], [cx, cy + 8]], "#d8a238", { w: 1.6, shadow: 0, seed: 5170 });
  contour(g, glass, 2.6, 5171);
  for (const y of [cy - 19, cy + 19]) { const p = smooth([[cx - 15, y - 2.5], [cx + 15, y - 2.5], [cx + 15, y + 2.5], [cx - 15, y + 2.5]], true, 2); fillShape(g, shift(p, 2, 2.5), SH, 0.25); cel(g, p, "#c48a52", "#94603a", 1.5); contour(g, p, 2.4, 5172 + y); }
  ink(g, [[cx - 9, cy - 15], [cx - 7, cy - 12]], "#ffffff", { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 5175 });
});
// le cadenas (zone fermée), posé sur l'onglet de la zone
export const drawPadlock = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const anse = smooth([[cx - 9, cy - 1], [cx - 9, cy - 9], [cx - 6, cy - 16], [cx, cy - 18], [cx + 6, cy - 16], [cx + 9, cy - 9], [cx + 9, cy - 1]], false, 5);
  ink(g, anse, INK, { w: 9, shadow: 0, seed: 5180 });
  ink(g, anse, "#c9cdd3", { w: 4, shadow: 0.3, seed: 5181 });
  const body = smooth([[cx - 16, cy - 3], [cx + 16, cy - 3], [cx + 16, cy + 17], [cx - 16, cy + 17]], true, 2);
  fillShape(g, shift(body, 3, 3), SH, 0.3);
  cel(g, body, "#f7c04a", "#d08a20", 3, [smooth([[cx - 12, cy], [cx - 2, cy], [cx - 12, cy + 6]], true, 2), "#ffe08a"]);
  contour(g, body, 3, 5182);
  fillShape(g, blob(cx, cy + 5, 3.2, 3.2, 5183, 0.05, 10), INK);
  ink(g, [[cx, cy + 6], [cx, cy + 11]], INK, { w: 2.8, shadow: 0, seed: 5184 });
});

// ---------------------------------------------------------------- la coche et la croix
// la coche verte (acheter) : le geste du feutre, en une fois, sur la bulle crème
export const drawConfirmYes = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 21, 40);
  g.group("plain", () => {
    const c: P[] = smooth([[cx - 19, cy + 2], [cx - 6, cy + 14], [cx - 6, cy + 14], [cx + 20, cy - 17]], false, 6);
    ink(g, c.map(([x, y]) => [x + 3, y + 4] as P), SH, { w: 14, shadow: 0, taper: [0.25, 0.3], seed: 5190 }, 0.3);
    ink(g, c, INK, { w: 15, shadow: 0, taper: [0.2, 0.25], seed: 5191 });
    ink(g, c, "#3fb76a", { w: 9, shadow: 0.45, taper: [0.25, 0.3], seed: 5192 });
    ink(g, c.slice(0, Math.ceil(c.length * 0.4)).map(([x, y]) => [x - 1.2, y - 1.6] as P), "#a8ecbe", { w: 2.6, shadow: 0, taper: [0.3, 0.3], seed: 5193 });
  });
};
// la croix rouge (annuler) : deux traits croisés, le premier tracé du haut à gauche
export const drawConfirmNo = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 22, 40);
  g.group("plain", () => {
    const a: P[] = smooth([[cx - 14, cy - 14], [cx + 14, cy + 14]], false, 4), b: P[] = smooth([[cx + 14, cy - 14], [cx - 14, cy + 14]], false, 4);
    for (const [s, k] of [[a, 0], [b, 1]] as const) ink(g, s.map(([x, y]) => [x + 3, y + 4] as P), SH, { w: 13, shadow: 0, taper: [0.15, 0.15], seed: 5200 + k }, 0.3);
    for (const [s, k] of [[a, 0], [b, 1]] as const) ink(g, s, INK, { w: 14, shadow: 0, taper: [0.12, 0.12], seed: 5202 + k });
    for (const [s, k] of [[a, 0], [b, 1]] as const) ink(g, s, "#e5484d", { w: 8, shadow: 0.45, taper: [0.15, 0.15], seed: 5204 + k });
    ink(g, [[cx - 12, cy - 13], [cx - 6, cy - 7]], "#ffb3b5", { w: 2.4, shadow: 0, taper: [0.3, 0.3], seed: 5206 });
  });
};

// ---------------------------------------------------------------- la boutique
// l'étal : deux montants de bois, un comptoir, l'auvent festonné à rayures corail et crème sous un toit bleu canard ; sur le
// comptoir, une étoile de mer jaune et un petit poisson bleu (ce qu'on y « achète » : des créatures) ; centré sur (cx, cy)
export const drawShopIcon = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const x = (v: number) => cx + v - 68, y = (v: number) => cy + v - 69; // les coordonnées de la maquette (viewBox 140)
  // les montants
  for (const x0 of [40, 90]) { const p = smooth([[x(x0), y(58)], [x(x0 + 6), y(58)], [x(x0 + 6), y(102)], [x(x0), y(102)]], true, 2); cel(g, p, "#a8703f", "#7d4f2a", 1.5); contour(g, p, 2.4, 5210 + x0); }
  // le comptoir, ses planches
  const comptoir = smooth([[x(31), y(90)], [x(105), y(90)], [x(105), y(112)], [x(31), y(112)]], true, 2);
  fillShape(g, shift(comptoir, 4, 5), SH, 0.25);
  cel(g, comptoir, "#d39a60", "#a96d3c", 3);
  ink(g, [[x(33), y(100)], [x(103), y(100)]], "#a96d3c", { w: 2.2, shadow: 0, seed: 5220 });
  ink(g, [[x(87), y(92)], [x(87), y(110)]], "#a96d3c", { w: 2.2, shadow: 0, seed: 5221 });
  contour(g, comptoir, 3.2, 5222);
  // le toit
  const toit = smooth([[x(34), y(40)], [x(39), y(29)], [x(97), y(29)], [x(102), y(40)]], true, 2);
  fillShape(g, shift(toit, 3, 4), SH, 0.25);
  cel(g, toit, "#3a9fac", "#24707b", 2.5); contour(g, toit, 3, 5223);
  // l'auvent : quatre festons ; rayures corail et crème
  const festons: P[] = [[x(27), y(40)], [x(109), y(40)], [x(113), y(60)]];
  for (let i = 4; i >= 0; i--) { const a = 23 + i * 18; festons.push([x(a + 9), y(67)], [x(a), y(60)]); }
  const auvent = smooth(festons, true, 3);
  fillShape(g, shift(auvent, 3, 4), SH, 0.3);
  cel(g, auvent, "#fffdf6", "#e9dfcc", 2);
  clipped(g, auvent, () => { for (const a of [23, 59, 95]) { const band = [[x(a + 4), y(38)], [x(a + 18), y(38)], [x(a + 18), y(70)], [x(a), y(70)]] as P[]; cel(g, band, "#ff7a52", "#d8573a", 2); } });
  contour(g, auvent, 3, 5224);
  // l'étoile de mer et le petit poisson
  const st = O.starShape([x(58), y(82)], 13, 5.6, -0.14);
  fillShape(g, shift(st, 2, 2.5), SH, 0.25); cel(g, st, "#ffcf3a", "#e09a1c", 2); contour(g, st, 2.4, 5225);
  const fish = smooth([[x(74), y(86)], [x(80), y(79)], [x(91), y(79)], [x(96), y(86)], [x(103), y(80)], [x(103), y(92)], [x(96), y(86)], [x(91), y(93)], [x(80), y(93)]], true, 3);
  fillShape(g, shift(fish, 2, 2.5), SH, 0.25); cel(g, fish, "#86d0dc", "#4a9fae", 2); contour(g, fish, 2.4, 5226);
  fillShape(g, blob(x(80), y(85), 1.9, 1.9, 5227, 0.05, 8), INK);
});
// le bouton de la boutique : la bulle crème des boutons (maison, album, récif), l'étal dessus
export const drawShopKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 23, 60);
  drawShopIcon(g, cx, cy);
};
void TAU;

// ---------------------------------------------------------------- la tuile de la vitrine
// une place de la vitrine : la tuile crème des écrans de choix, 170 × 196, coins de 22 px, cernée d'encre, une ombre nette ;
// un filet sous la créature, au-dessus du prix. Sa matière dit la rareté (comme le cadre des cartes) : commune crème, rare
// argent (un liseré gris perle), légendaire or ; une place pas encore arrivée est d'un crème éteint, une zone fermée grise.
// (x, y) : le coin en haut à gauche de la tuile.
export const TUILE_W = 170, TUILE_H = 196, TUILE_R = 22;
const TUILES: Record<string, { lit: string; shade: string; liseré?: [string, string, string] }> = {
  commune: { lit: "#fdf9f0", shade: "#efe5d2" },
  rare: { lit: "#fbfcff", shade: "#dfe6ee", liseré: ["#b9c3cf", "#eef2f7", "#8c97a5"] },
  legendaire: { lit: "#fff6d2", shade: "#f0d27a", liseré: ["#e7b93a", "#fff1b8", "#b98516"] },
  bientot: { lit: "#ece5d6", shade: "#ddd3be" },
  fermee: { lit: "#d9d3c6", shade: "#c8c0ae" },
};
export const drawShopTile = (g: Gfx, x: number, y: number, sorte: string) => g.group("plain", () => {
  const T = TUILES[sorte] ?? TUILES.commune, s = rrect(x, y, TUILE_W, TUILE_H, TUILE_R);
  fillShape(g, shift(s, 7, 8), SH, 0.26);
  cel(g, s, T.lit, T.shade, 6);
  if (T.liseré) { const [a, b, c] = T.liseré; ink(g, rrect(x + 6, y + 6, TUILE_W - 12, TUILE_H - 12, TUILE_R - 5), a, { w: 5, closed: true, shadow: 0, seed: 5240 }); ink(g, rrect(x + 6, y + 6, TUILE_W - 12, TUILE_H - 12, TUILE_R - 5), b, { w: 1.6, closed: true, shadow: 0, seed: 5241 }); ink(g, rrect(x + 9, y + 9, TUILE_W - 18, TUILE_H - 18, TUILE_R - 8), c, { w: 1.2, closed: true, shadow: 0, seed: 5242 }, 0.8); }
  ink(g, [[x + 16, y + 149], [x + TUILE_W - 16, y + 149]], INK, { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 5243 }, 0.14);
  ink(g, smooth([[x + 16, y + 30], [x + 22, y + 16], [x + 36, y + 11]], false, 4), "#ffffff", { w: 4, shadow: 0, taper: [0.3, 0.4], seed: 5244 }, 0.8);
  contour(g, s, 4.2, 5245);
});
