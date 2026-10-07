// LES CENTAINES (lot 2, étape 8 ; docs/SPEC-COMPLEMENTS.md, partie A) : une dizaine est un FILET de 10 poissons
// (comme dans la leçon L2) ; une centaine est un grand CHALUT qui contient 10 filets. Fabriqués ici :
//   - le filet de dix poissons (deux rangées de cinq petits poissons jaunes dans un sac de mailles) ;
//   - le chalut, en 11 images : vide, puis 1 à 10 filets rangés dedans (la leçon L10 les fait entrer un à un) ;
// le petit chalut qui marque les centaines sur la ligne est dessiné en direct (runtime.ts, drawTrawlBadge).
// Même main que la scène (oceanMarker.ts) : aplats, une ombre nette, contour épais côté ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";

const SH = "#0a3f49", ROPE = "#c89c62", ROPE_S = "#8a6238", MESH = "#f3e6c8", FLOAT = "#ff8a3d", FLOAT_S = "#c85a1f";
const YEL = "#ffd84a", YEL_S = "#e08d1c";

// un petit poisson jaune (le même dessin que les poissons de la scène, en tout petit)
const miniFish = (g: Gfx, cx: number, cy: number, len: number, seed: number) => {
  const s = O.fishShape({ c: [cx, cy], len, dir: 1, tilt: 0, color: 2, wag: 0 } as O.Fish);
  cel(g, s.tail, YEL, YEL_S, 1.5); cel(g, s.body, YEL, YEL_S, 2);
  fillShape(g, blob(s.eye[0], s.eye[1], Math.max(1.3, s.eyeR * 0.9), Math.max(1.3, s.eyeR * 0.9), seed, 0.05, 8), INK);
  contour(g, s.tail, 1.4, seed + 1); contour(g, s.body, 1.8, seed + 2);
};
// des mailles en losange, clippées par la forme `shape`, sur le rectangle [x0, y0, x1, y1]
const mesh = (g: Gfx, shape: P[], x0: number, y0: number, x1: number, y1: number, step: number, w: number, seed: number) => clipped(g, shape, () => {
  for (let x = x0 - (y1 - y0); x < x1; x += step) {
    ink(g, [[x, y0], [x + (y1 - y0), y1]], MESH, { w, shadow: 0, taper: [0.05, 0.05], seed: seed + Math.round(x) }, 0.75);
    ink(g, [[x + (y1 - y0), y0], [x, y1]], MESH, { w, shadow: 0, taper: [0.05, 0.05], seed: seed + 500 + Math.round(x) }, 0.75);
  }
});

// ---------------------------------------------------------------- le filet de dix poissons
export const NET_W = 172, NET_H = 82;
// (x, y) : coin haut gauche
export const drawFishNet = (g: Gfx, x: number, y: number, seed = 7000) => g.group("plain", () => {
  const r = 16, bag = smooth([[x + r, y], [x + NET_W - r, y + 1], [x + NET_W, y + r], [x + NET_W - 2, y + NET_H - r], [x + NET_W - r, y + NET_H + 2], [x + r, y + NET_H + 1], [x + 1, y + NET_H - r], [x, y + r]], true, 5);
  fillShape(g, shift(bag, 5, 6), SH, 0.25);
  fillShape(g, bag, "#1d8a98", 0.55);
  for (let i = 0; i < 10; i++) miniFish(g, x + 22 + (i % 5) * 32, y + 24 + Math.floor(i / 5) * 34, 29, seed + 10 + i * 5);
  mesh(g, bag, x, y, x + NET_W, y + NET_H, 13, 1.3, seed + 100);
  ink(g, bag, ROPE_S, { w: 3.6, closed: true, shadow: 0.35, seed: seed + 200 });
  // le nœud qui ferme le filet, en haut au milieu
  const knot = blob(x + NET_W / 2, y + 1, 6, 4.5, seed + 210, 0.05, 10); cel(g, knot, ROPE, ROPE_S, 1.5); contour(g, knot, 1.8, seed + 211);
});

// ---------------------------------------------------------------- le chalut
export const TRAWL = { w: 250, h: 250, bar: 34 };
// un petit filet rangé dans le chalut : dix petits poissons jaunes en deux rangées de cinq, comme le filet de dix poissons et
// le cadre de 10 (lot « Les leçons », constat du parent du 30 septembre 2026 : il n'en montrait que cinq), sous les mailles
export const PACKED = { w: 88, h: 34 };
const packedNet = (g: Gfx, x: number, y: number, w: number, h: number, seed: number) => {
  const s = smooth([[x + 6, y], [x + w - 6, y], [x + w, y + 6], [x + w, y + h - 6], [x + w - 6, y + h], [x + 6, y + h], [x, y + h - 6], [x, y + 6]], true, 3);
  fillShape(g, shift(s, 2, 2.5), SH, 0.25); fillShape(g, s, "#1d8a98");
  const dx = (w - 18) / 4;
  for (let i = 0; i < 10; i++) miniFish(g, x + 9 + (i % 5) * dx, y + h * (i < 5 ? 0.3 : 0.72), dx * 0.92, seed + i * 3);
  mesh(g, s, x, y, x + w, y + h, 9, 0.8, seed + 40);
  ink(g, s, ROPE_S, { w: 2.2, closed: true, shadow: 0.3, seed: seed + 9 });
};
// (cx, top) : milieu de la barre du haut ; k : nombre de filets dedans (0 à 10)
export const drawTrawl = (g: Gfx, cx: number, top: number, k: number) => g.group("plain", () => {
  const W = TRAWL.w, H = TRAWL.h, y0 = top + 10, x0 = cx - W / 2 + 10, x1 = cx + W / 2 - 10;
  // le sac : large en haut, qui se resserre vers le bas jusqu'au nœud du fond
  const bag = smooth([[x0, y0], [x1, y0], [x1 + 6, y0 + H * 0.35], [x1 - 14, y0 + H * 0.72], [cx + 22, y0 + H - 24], [cx, y0 + H - 12], [cx - 22, y0 + H - 24], [x0 + 14, y0 + H * 0.72], [x0 - 6, y0 + H * 0.35]], true, 10);
  fillShape(g, shift(bag, 9, 11), SH, 0.26);
  fillShape(g, bag, "#0f6f7c", 0.5);
  // les filets rangés : deux colonnes de cinq, du fond vers le haut
  const nw = PACKED.w, nh = PACKED.h, gx = 6;
  for (let i = 0; i < k; i++) { const row = Math.floor(i / 2), col = i % 2, x = cx - nw - gx / 2 + col * (nw + gx) + (row % 2 ? 3 : -3), y = y0 + H - 74 - row * (nh + 5); packedNet(g, x, y, nw, nh, 7300 + i * 13); }
  mesh(g, bag, x0 - 10, y0, x1 + 10, y0 + H, 17, 2.1, 7400);
  ink(g, bag, ROPE_S, { w: 4.2, closed: true, shadow: 0.4, seed: 7410 });
  // le nœud du fond
  const knot = blob(cx, y0 + H - 12, 10, 8, 7420, 0.05, 12); cel(g, knot, ROPE, ROPE_S, 2.5); contour(g, knot, 2.6, 7421);
  ink(g, [[cx - 4, y0 + H - 4], [cx - 9, y0 + H + 10]], ROPE_S, { w: 3, shadow: 0, taper: [0.2, 0.6], seed: 7422 });
  ink(g, [[cx + 4, y0 + H - 4], [cx + 8, y0 + H + 12]], ROPE_S, { w: 3, shadow: 0, taper: [0.2, 0.6], seed: 7423 });
  // la ralingue du haut : une corde épaisse et ses flotteurs orange
  const rope = smooth([[x0 - 14, y0 + 2], [cx, y0 - 3], [x1 + 14, y0 + 2]], false, 8);
  ink(g, shift(rope, 3, 4), SH, { w: 9, shadow: 0, taper: [0.1, 0.1], seed: 7430 }, 0.25);
  ink(g, rope, ROPE, { w: 8, shadow: 0.5, taper: [0.1, 0.1], seed: 7431 });
  for (let i = 0; i < 4; i++) {
    const fx = x0 + 6 + i * ((x1 - x0 - 12) / 3), f = blob(fx, y0 - 8, 15, 11, 7440 + i, 0.04, 14);
    fillShape(g, shift(f, 3, 4), SH, 0.28); cel(g, f, FLOAT, FLOAT_S, 3.5, [blob(fx - 5, y0 - 13, 4.5, 3, 7450 + i, 0.05, 8), "#ffc59a"]); contour(g, f, 2.6, 7460 + i);
  }
});
