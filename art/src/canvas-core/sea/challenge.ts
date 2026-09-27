// LE DÉFI RECORD (lot 2, étape 7 ; docs/SPEC.md, « Défi record » ; docs/SPEC-LOT2.md, section 3) : le seul
// chronomètre visible de l'application, sans chiffre de secondes. C'est une grosse bulle de verre pleine
// d'eau qui se vide : l'eau baisse d'une image à l'autre (DEFI_N niveaux, fabriqués ici ; l'application montre
// l'image qui correspond au temps restant). Plus : le pictogramme de la frise (une petite bulle à moitié
// pleine), la perle d'or d'une bonne réponse et le drapeau rouge du record (même rouge que les bouées).
// Même main que le reste (oceanMarker.ts) : aplats, une ombre nette, contour qui s'épaissit du côté de l'ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, smooth } from "../gallery";
import { cel, contour, shift } from "../oceanMarker";

const SH = "#0a3f49", SEA = "#62dcdc", SEA_S = "#23a0ad", SEA_D = "#177c8a", FOAM = "#fffdf6", GLASS = "#f2fffd";
const RED = "#e8513f", RED_S = "#b23a2e", WOOD = "#b98552", WOOD_S = "#8a5d34";

export const DEFI_N = 30; // niveaux d'eau, du plein (image 0) au vide (dernière image)
export const TIMER_R = 70; // rayon de la bulle
export const TIMER_W = 2 * TIMER_R + 44;

// la surface de l'eau au niveau `level` (1 : pleine, 0 : vide) : une ligne à peine ondulée, qui penche un peu
// (l'eau clapote), dont l'ondulation change d'une image à l'autre sans jamais sauter
const surface = (cx: number, cy: number, R: number, level: number, f: number): P[] => {
  const y = cy + R - level * 2 * R * 0.96 - R * 0.02, out: P[] = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16, x = cx - R - 6 + t * (2 * R + 12); out.push([x, y + Math.sin(t * Math.PI * 3 + f * 0.9) * 2.4 + (t - 0.5) * 3 * Math.sin(f * 0.5)]); }
  return out;
};

// la bulle-sablier : verre, eau au niveau de l'image f, petites bulles qui montent dans l'eau, reflet du verre
export const drawTimerBubble = (g: Gfx, cx: number, cy: number, f: number, R = TIMER_R) => g.group("plain", () => {
  const level = 1 - f / (DEFI_N - 1), glass = blob(cx, cy, R, R, 3700, 0.015, 24), inner = blob(cx, cy, R - 5, R - 5, 3701, 0.015, 24);
  // ombre portée et verre (très clair, un peu d'eau derrière)
  fillShape(g, shift(glass, 7, 9), SH, 0.3);
  fillShape(g, glass, GLASS, 0.4);
  if (level > 0.005) {
    const top = surface(cx, cy, R - 5, level, f), body: P[] = [...top, [cx + R + 8, cy + R + 8], [cx - R - 8, cy + R + 8]];
    clipped(g, inner, () => {
      // l'eau : claire en haut à gauche, plus sombre côté ombre ; le fond de la bulle encore plus sombre
      cel(g, body, SEA, SEA_S, 7);
      clipped(g, body, () => fillShape(g, blob(cx + R * 0.35, cy + R * 0.7, R * 0.75, R * 0.45, 3702, 0.05, 16), SEA_D, 0.35));
      // quelques bulles dans l'eau (elles montent d'une image à l'autre et restent sous la surface)
      const yTop = top[8][1];
      for (let i = 0; i < 4; i++) {
        const bx = cx - R * 0.45 + i * R * 0.3, span = cy + R - yTop - 14;
        if (span < 12) continue;
        const by = cy + R - 10 - ((f * 5 + i * 17) % Math.max(1, span));
        const b = blob(bx, by, 3.2 + (i % 2), 3.2 + (i % 2), 3710 + i, 0.08, 8);
        fillShape(g, b, "#bff3ee", 0.5); ink(g, b, FOAM, { w: 1.4, closed: true, shadow: 0, seed: 3715 + i }, 0.9);
      }
      // l'écume de la surface, épaisse côté lumière
      ink(g, top, FOAM, { w: 5, shadow: 0, taper: [0.15, 0.3], seed: 3720 }, 0.95);
      ink(g, top.map(([x, y]) => [x + 1, y + 3.5] as P), "#bfe9ec", { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 3721 }, 0.8);
    });
  }
  // le reflet du verre (en haut à gauche, du côté de la lumière) et le contour
  ink(g, smooth([[cx - R * 0.72, cy - R * 0.1], [cx - R * 0.62, cy - R * 0.48], [cx - R * 0.3, cy - R * 0.72]], false, 6), "#ffffff", { w: 7, shadow: 0, taper: [0.3, 0.45], seed: 3730 }, 0.95);
  fillShape(g, blob(cx - R * 0.2, cy - R * 0.76, 4.5, 3.4, 3731, 0.05, 8), "#ffffff", 0.95);
  contour(g, glass, 5, 3732);
});

// frise : une petite bulle à moitié pleine d'eau (le défi)
export const drawStepChallenge = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const R = 13, s = blob(cx, cy, R, R, 3740, 0.02, 16);
  fillShape(g, s, GLASS, 0.5);
  clipped(g, s, () => fillShape(g, [[cx - R - 2, cy + 1], [cx + R + 2, cy - 1], [cx + R + 2, cy + R + 2], [cx - R - 2, cy + R + 2]], SEA));
  ink(g, s, "#fffdf6", { w: 2.6, closed: true, shadow: 0, seed: 3741 }, 0.95);
  fillShape(g, blob(cx - 5, cy - 6, 2.6, 2, 3742, 0.05, 8), "#ffffff");
});

// une bonne réponse du défi : une perle d'or (la même que les bulles pleines de la frise, en plus grand)
export const drawScorePearl = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const r = 14, s = blob(cx, cy, r, r, 3750, 0.02, 16);
  fillShape(g, shift(s, 3, 3.5), SH, 0.3);
  cel(g, s, "#ffe27a", "#e0a21c", 3.5, [blob(cx - 4.5, cy - 5, 4, 3, 3751, 0.05, 8), "#fffbe0"]);
  contour(g, s, 2.8, 3752);
});

// le record : un petit drapeau rouge sur un mât de bois, planté à la hauteur du record (ancrage : pied du mât)
export const drawRecordFlag = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  const pole: P[] = [[x - 2.5, y], [x - 2.5, y - 58], [x + 2.5, y - 58], [x + 2.5, y]];
  fillShape(g, shift(pole, 2, 2), SH, 0.3); cel(g, pole, WOOD, WOOD_S, 1.5); contour(g, pole, 2.2, 3760);
  const flag = smooth([[x + 2, y - 57], [x + 20, y - 54], [x + 36, y - 49], [x + 26, y - 44], [x + 34, y - 36], [x + 18, y - 35], [x + 2, y - 33]], true, 4);
  fillShape(g, shift(flag, 3, 3), SH, 0.28); cel(g, flag, RED, RED_S, 3); contour(g, flag, 2.6, 3761);
  const knob = blob(x, y - 60, 4.2, 4.2, 3762, 0.03, 10); cel(g, knob, "#ffd84a", "#e08d1c", 1.5); contour(g, knob, 1.8, 3763);
});
