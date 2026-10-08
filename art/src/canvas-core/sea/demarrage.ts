// L'ÉCRAN DE DÉMARRAGE (lot « Correctifs de la tablette », décision du parent du 8 octobre 2026) : le logo « Maths CE1 »,
// au lieu de l'écran bleu du chargement. Style A, « BD au marqueur » : des lettres en gros boudins de couleur (l'écriture
// scripte d'école de letters.ts, la même que celle des étiquettes et de la légende, tracée en très épais), un contour d'encre
// qui s'épaissit du côté de l'ombre, une ombre nette par forme, la lumière en haut à gauche. « Maths » en jaune d'or (les
// étoiles de mer), « CE1 » en corail (la flèche, l'ancienne pieuvre), une étoile de mer posée sur le « M » et trois bulles qui
// montent. Et la barre de chargement : un tube de verre (vide, puis plein), dont l'application dévoile le plein peu à peu.
import type { Gfx, P } from "../core";
import { blob, fillShape, ink } from "../gallery";
import { cel, contour, INK, L, shift } from "../oceanMarker";
import { smooth } from "../gallery";
import { wordStrokes, wordWidth } from "./letters";
import { drawStar } from "./decor";

export const LOGO_W = 620, LOGO_H = 330;
const SHADOW = "#06323b";

// les traits d'un mot, lettre par lettre ; le « a » du logo a sa panse fermée et sa jambe collée (celui des étiquettes, la
// jambe détachée, se lisait « cl » une fois tracé en boudin)
const X = 0.42, MID = (1 + X) / 2, RY = (1 - X) / 2;
const A_LOGO: P[][] = [
  Array.from({ length: 19 }, (_, i): P => { const a = ((-20 - i * 20) * Math.PI) / 180; return [0.25 + 0.21 * Math.cos(a), MID + RY * Math.sin(a)]; }),
  [[0.47, X - 0.02], [0.47, 0.86], [0.5, 0.97], [0.58, 1]],
];
const logoStrokes = (text: string, cx: number, top: number, em: number) => {
  const strokes: P[][] = [], dots: P[] = [];
  let x = cx - (wordWidth(text) * em) / 2;
  for (const ch of text) {
    const w = wordWidth(ch);
    if (ch === "a") A_LOGO.forEach((s) => strokes.push(smooth(s.map(([u, v]): P => [x + u * em, top + v * em]), false, 8)));
    else { const n = wordStrokes(ch, x + (w * em) / 2, top, em); strokes.push(...n.strokes); dots.push(...n.dots); }
    x += (wordWidth(ch + "x") - wordWidth("x")) * em;
  }
  return { strokes, dots };
};
// les traits d'un mot en boudins : ombre portée, contour d'encre, aplat (ombre puis lumière décalée vers la lumière), reflet
const chunky = (g: Gfx, text: string, cx: number, top: number, em: number, lit: string, shade: string, hi: string, seed: number) => {
  const { strokes, dots } = logoStrokes(text, cx, top, em);
  const w = em * 0.3, o = em * 0.075;
  // un point est un petit trait (le même boudin)
  const all: P[][] = [...strokes, ...dots.map(([x, y]): P[] => [[x - 0.5, y - 0.5], [x + 0.5, y + 0.5]])];
  const caps = (pts: P[]) => [pts[0], pts[pts.length - 1]];
  const pass = (ww: number, color: string, dx = 0, dy = 0, alpha = 1, s0 = 0, rough = 0.12, bouts = true) => { // (bouts : les extrémités arrondies)
    all.forEach((s, k) => {
      const p = shift(s, dx, dy);
      ink(g, p, color, { w: ww, light: L, shadow: 0.25, taper: bouts ? [0, 0] : [0.25, 0.25], min: bouts ? 1 : 0.2, swell: 0.04, rough, seed: seed + s0 + k }, alpha);
      if (bouts) for (const [x, y] of caps(p)) fillShape(g, blob(x, y, ww / 2, ww / 2, seed + s0 + 40 + k, 0.03, 14), color, alpha);
    });
  };
  pass(w + 2 * o, SHADOW, 7, 9, 0.55, 100, 0.05); // l'ombre nette, en bas à droite
  pass(w + 2.6 * o, INK, o * 0.5, o * 0.7, 1, 200); // le contour, plus épais du côté de l'ombre
  pass(w + 2 * o, INK, 0, 0, 1, 300);
  pass(w, shade, 0, 0, 1, 400, 0.08); // l'aplat : l'ombre propre de la lettre…
  pass(w * 0.86, lit, L[0] * w * 0.16, L[1] * w * 0.16, 1, 500, 0.08); // … et sa face éclairée
  // le reflet : un court éclat effilé au début de chaque trait (le haut de la lettre, du côté de la lumière)
  all.forEach((s0, k) => {
    if (s0.length < 4) return;
    const n = Math.max(3, Math.round(s0.length * 0.28)), p = shift(s0.slice(0, n), L[0] * w * 0.26, L[1] * w * 0.26);
    ink(g, p, hi, { w: w * 0.16, light: L, shadow: 0, taper: [0.5, 0.5], min: 0.2, rough: 0.2, seed: seed + 600 + k }, 0.85);
  });
};

// le logo, centré sur (cx, cy) ; il occupe LOGO_W × LOGO_H
export const drawLogo = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const x0 = cx - LOGO_W / 2, y0 = cy - LOGO_H / 2;
  chunky(g, "Maths", cx - 10, y0 + 30, 150, "#ffc93a", "#e08d1c", "#fff1b8", 9100);
  chunky(g, "CE1", cx + 120, y0 + 212, 96, "#ff8a6e", "#c64d3c", "#ffd4c4", 9200);
  // l'étoile de mer, à gauche de « CE1 », sous le « M »
  drawStar(g, cx - 80, cy + 116);
  // trois bulles qui montent, à droite du « s »
  ([[x0 + 590, y0 + 150, 13], [x0 + 604, y0 + 104, 9], [x0 + 592, y0 + 70, 6]] as const).forEach(([x, y, r], i) => {
    const s = blob(x, y, r, r, 9300 + i, 0.03, 12);
    fillShape(g, s, "#bff3ee", 0.35);
    ink(g, s, "#e8fffb", { w: Math.max(2, r * 0.3), closed: true, light: L, shadow: -0.6, seed: 9310 + i });
    fillShape(g, blob(x - r * 0.35, y - r * 0.38, r * 0.22, r * 0.16, 9320 + i, 0.05, 8), "#ffffff", 0.9);
  });
});

// LA BARRE DE CHARGEMENT : un tube de verre arrondi (BAR_W × BAR_H), vide ou plein d'eau dorée
export const BAR_W = 520, BAR_H = 44;
const tube = (cx: number, cy: number, w: number, h: number): P[] => {
  const r = h / 2, out: P[] = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI / 2 + (Math.PI * i) / 12; out.push([cx - w / 2 + r + r * Math.cos(a), cy + r * Math.sin(a)]); }
  for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (Math.PI * i) / 12; out.push([cx + w / 2 - r + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return out;
};
export const drawBar = (g: Gfx, cx: number, cy: number, full: boolean) => g.group("plain", () => {
  const outer = tube(cx, cy, BAR_W, BAR_H), inner = tube(cx, cy, BAR_W - 14, BAR_H - 14);
  fillShape(g, shift(outer, 5, 7), SHADOW, 0.45);
  cel(g, outer, "#e8fffb", "#9fd8d6", 3);
  if (full) {
    cel(g, inner, "#ffc93a", "#e08d1c", 4, [shift(tube(cx, cy - 6, BAR_W - 40, 6), 0, 0), "#fff1b8"]);
    // de petites bulles dans l'eau dorée
    for (let i = 0; i < 9; i++) { const x = cx - BAR_W / 2 + 40 + i * 55 + ((i * 37) % 17), y = cy + ((i * 13) % 9) - 3; fillShape(g, blob(x, y, 3.2, 3.2, 9400 + i, 0.05, 8), "#fff7d6", 0.8); }
  } else fillShape(g, inner, "#0e6470", 0.55);
  contour(g, outer, 4.2, 9410);
  // le reflet du verre, en haut à gauche
  ink(g, [[cx - BAR_W / 2 + 26, cy - BAR_H / 2 + 9], [cx - BAR_W / 2 + 120, cy - BAR_H / 2 + 7]], "#ffffff", { w: 4, shadow: 0, taper: [0.3, 0.3], seed: 9420 }, 0.8);
});
