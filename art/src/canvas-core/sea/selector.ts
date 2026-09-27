// LE SÉLECTEUR DE DIFFICULTÉ (lot 2, docs/SPEC-LOT2.md, section 2) : quatre grandes bulles, une par cran, sans
// texte. Chaque bulle montre une vague de plus en plus grosse (une ride, une vague, une vague qui déferle,
// une grosse vague et ses embruns) et, en dessous, ce qu'elle rapporte en étoiles de mer par bonne réponse
// (une demi-étoile, une, une et demie, deux). Le cran conseillé est entouré d'une lueur. Même main que le
// reste (oceanMarker.ts) : aplats, une ombre nette, contour qui s'épaissit du côté de l'ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";

const SH = "#0a3f49", SEA = "#35b3c1", SEA_S = "#1d7f8f", FOAM = "#fffdf6", FOAM_S = "#cfe6ea";
export const CRAN_R = 96; // rayon de la bulle d'un cran
export const CRAN_W = 2 * CRAN_R + 64; // (lot 3 : de la place pour l'ombre, coupée en bas avec + 40)
// la vague d'un cran (0 : plus facile … 3 : très dur), sa base en y0, centrée en cx ; clippée par la bulle
const WAVES = [
  { h: 16, curl: 0, crest: 0.05 },
  { h: 36, curl: 0.35, crest: 0.08 },
  { h: 58, curl: 0.75, crest: 0.12 },
  { h: 76, curl: 1, crest: 0.16 },
];
const waveShape = (cx: number, y0: number, lv: number): { body: P[]; crest: P[]; lip: P[] } => {
  const w = WAVES[lv], H = w.h, c = w.curl, x0 = cx - 88, x1 = cx + 88, xc = cx + 8 - 10 * c, yc = y0 - H;
  if (lv === 0) {
    // une ride : deux bosses douces
    const top: P[] = [[x0, y0], [cx - 50, y0 - H * 0.6], [cx - 18, y0 - 2], [cx + 14, y0 - H], [cx + 50, y0 - 3], [x1, y0 - 6]];
    const s = smooth(top, false, 10);
    return { body: [...s, [x1, y0 + 70], [x0, y0 + 70]], crest: s, lip: [] };
  }
  // la face arrière monte doucement depuis la gauche ; la lèvre de la crête s'avance et retombe en s'enroulant
  // (le creux du rouleau laisse voir le fond de la bulle) ; la face avant descend jusqu'au creux
  const L = H * (0.55 + 0.45 * c);
  const D = xc - x0, back: P[] = [[x0, y0 - 2], [x0 + D * 0.38, y0 - H * 0.2], [x0 + D * 0.7, y0 - H * 0.6], [xc - D * 0.14, yc + H * 0.07], [xc, yc]];
  const tip: P = [xc + L * 0.72, yc + L * 0.42], lipIn: P = [xc + L * 0.5, yc + L * 0.5];
  const front: P[] = [[xc + L * 0.45, yc + L * 0.06], [xc + L * 0.7, yc + L * 0.22], tip, lipIn, [xc + L * 0.34, yc + L * 0.36], [xc + L * 0.22, yc + L * 0.55], [xc + L * 0.3, y0 - H * 0.2], [xc + L * 0.75, y0 - 3], [x1, y0 - 2]];
  const top = smooth([...back, ...front], false, 8);
  const body: P[] = [...top, [x1, y0 + 70], [x0, y0 + 70]];
  const crest = smooth([back[2], back[3], [xc, yc], [xc + L * 0.45, yc + L * 0.06], [xc + L * 0.7, yc + L * 0.22]], false, 8).map(([x, y]) => [x, y + 4] as P);
  // l'intérieur du rouleau, sous la lèvre : plus sombre
  const lip = c > 0.2 ? smooth([lipIn, [xc + L * 0.34, yc + L * 0.36], [xc + L * 0.22, yc + L * 0.55], [xc + L * 0.3, y0 - H * 0.2], [xc + L * 0.5, yc + L * 0.62]], true, 6) : [];
  return { body, crest, lip };
};
// une étoile de mer entière, ou sa moitié gauche (la moitié droite en pointillé clair : « une demi-étoile »)
const star = (g: Gfx, x: number, y: number, R: number, half: boolean, seed: number) => {
  const s = O.starShape([x, y], R, R * 0.44, 0.2);
  if (half) {
    ink(g, s, "#fff3c4", { w: 2.4, closed: true, shadow: 0, seed: seed + 5 }, 0.8);
    const left: P[] = [[x - R - 4, y - R - 4], [x, y - R - 4], [x, y + R + 4], [x - R - 4, y + R + 4]];
    clipped(g, left, () => { fillShape(g, shift(s, 2, 3), SH, 0.25); cel(g, s, "#ffc93a", "#e08d1c", 2.4); });
    clipped(g, left, () => contour(g, s, 2.8, seed));
    return;
  }
  fillShape(g, shift(s, 2, 3), SH, 0.25); cel(g, s, "#ffc93a", "#e08d1c", 2.4); contour(g, s, 2.8, seed);
};
// les étoiles d'un cran : ½, 1, 1½, 2 ; `withStars` false : l'entraînement libre (pas d'étoiles)
export const drawCranKey = (g: Gfx, cx: number, cy: number, lv: number, withStars = true) => {
  drawAnswerBubble(g, cx, cy, 40 + lv, CRAN_R);
  const bubble = blob(cx, cy, CRAN_R - 6, CRAN_R - 6, 300 + 40 + lv, 0.02, 20);
  const y0 = withStars ? cy + 22 : cy + 34;
  g.group("plain", () => {
    const { body, crest, lip } = waveShape(cx, y0, lv);
    clipped(g, bubble, () => {
      fillShape(g, shift(body, 4, 5), SH, 0.22);
      cel(g, body, SEA, SEA_S, 5);
      if (lip.length) fillShape(g, lip, "#15606d", 0.85);
      // l'écume de la crête, épaisse du côté de la lumière
      ink(g, crest, FOAM, { w: 5 + 2 * lv, shadow: 0, taper: [0.5, 0.2], seed: 3600 + lv });
      ink(g, crest.map(([x, y]) => [x + 1.5, y + 3] as P), FOAM_S, { w: 2, shadow: 0, taper: [0.5, 0.3], seed: 3605 + lv }, 0.8);
      contour(g, body, 3.4, 3610 + lv);
      // embruns des grosses vagues
      if (lv >= 2) { const n = lv === 3 ? 6 : 3; for (let i = 0; i < n; i++) { const b = blob(cx + 28 + i * 9 - lv * 4, y0 - WAVES[lv].h - 10 - (i % 3) * 9, 3.2 - (i % 2), 3.2 - (i % 2), 3620 + i, 0.08, 8); fillShape(g, b, FOAM); ink(g, b, "#1d2b35", { w: 1.3, closed: true, shadow: 0, seed: 3630 + i }, 0.7); } }
    });
    if (!withStars) return;
    // les étoiles, sur le sable crème du bas de la bulle
    const n = [0.5, 1, 1.5, 2][lv], full = Math.floor(n), half = n - full > 0, count = full + (half ? 1 : 0), R = 21, gap = 48, sx = cx - ((count - 1) * gap) / 2, sy = cy + 56;
    for (let i = 0; i < count; i++) star(g, sx + i * gap, sy, R, half && i === count - 1, 3640 + lv * 4 + i);
  });
};
// la lueur du cran conseillé : un halo chaud autour de la bulle
export const GLOW_CR = CRAN_R + 30;
export const drawCranGlow = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  for (let i = 20; i >= 0; i--) fillShape(g, blob(cx, cy, CRAN_R - 10 + i * 2, CRAN_R - 10 + i * 2, 3650, 0, 40), "#fff3b8", 0.045);
});
