// LOT 3 TER (docs/SPEC-LOT3TER.md, T1) : le bouton « PASSER L'ÉCHAUFFEMENT ». Le parent ne trouvait pas le « passer » de
// l'échauffement : il avait le même dessin que « passer » (deux triangles jaunes) des exemples et des corrections. Ce bouton
// a son propre pictogramme, nettement distinct : une VAGUE bleue au rouleau d'écume, franchie d'un bond par une grande
// FLÈCHE dorée en arc, qui retombe de l'autre côté. Même main que le reste (oceanMarker.ts) : aplats, une ombre nette,
// contour épais qui s'épaissit du côté de l'ombre, lumière en haut à gauche.
import type { Gfx, P } from "../core";
import { clipped, fillShape, ink, smooth } from "../gallery";
import { cel, contour, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";

const SH = "#0a3f49", GOLD = "#ffd84a", GOLD_S = "#e08d1c", SEA = "#43a9d6", SEA_S = "#1f6f9e", FOAM = "#fffdf6", FOAM_S = "#cfe6ea", TAU = Math.PI * 2;
export const WARMUP_SKIP_R = 54;

// une bande épaisse le long d'une courbe (demi-épaisseurs w0 au départ, w1 à l'arrivée) : le corps de la flèche
const ribbon = (c: P[], w0: number, w1: number): P[] => {
  const L: P[] = [], Rt: P[] = [];
  c.forEach((p, i) => {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = w0 + ((w1 - w0) * i) / (c.length - 1);
    L.push([p[0] - (dy / d) * w, p[1] + (dx / d) * w]); Rt.push([p[0] + (dy / d) * w, p[1] - (dx / d) * w]);
  });
  return [...L, ...Rt.reverse()];
};
// un point d'une courbe de Bézier quadratique
const quad = (a: P, c: P, b: P, t: number): P => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];

export const drawWarmupSkipKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 23, WARMUP_SKIP_R);
  g.group("plain", () => {
    // la vague : un corps qui monte de la gauche jusqu'à la crête, un rouleau qui retombe vers la droite, un creux derrière
    // (la vague à gauche, l'eau calme derrière elle à droite, là où la flèche retombe)
    // la mer remplit le bas de la bulle (coupée par son bord : pas de fond plat qui ferait un objet posé) ; seule la
    // surface est encrée
    const X = cx - 6, inside: P[] = Array.from({ length: 48 }, (_, i) => [cx + Math.cos((i / 48) * TAU) * (WARMUP_SKIP_R - 3), cy + Math.sin((i / 48) * TAU) * (WARMUP_SKIP_R - 3)]);
    const top: P[] = [
      [cx - 60, cy + 16], [cx - 44, cy + 12], [X - 26, cy + 2], [X - 16, cy - 6], [X - 5, cy - 10], [X + 4, cy - 8],
      [X + 9, cy - 1], [X + 11, cy + 8], [X + 17, cy + 15], [X + 26, cy + 19], [cx + 34, cy + 19], [cx + 60, cy + 21],
    ];
    const surf = smooth(top, false, 3), wave = [...surf, [cx + 60, cy + 70], [cx - 60, cy + 70]] as P[];
    clipped(g, inside, () => {
      fillShape(g, shift(surf, 3, 4).concat([[cx + 60, cy + 70], [cx - 60, cy + 70]]), SH, 0.25);
      cel(g, wave, SEA, SEA_S, 4);
      ink(g, smooth([[X - 24, cy + 12], [X - 16, cy + 4], [X - 7, cy + 1]], false, 4), "#bfe8f7", { w: 3, shadow: 0, taper: [0.4, 0.4], seed: 9510 });
      ink(g, smooth([[X - 25, cy + 22], [X - 13, cy + 15]], false, 3), "#bfe8f7", { w: 2.4, shadow: 0, taper: [0.4, 0.4], seed: 9511 }, 0.8);
      ink(g, smooth([[cx + 12, cy + 27], [cx + 30, cy + 27]], false, 2), "#bfe8f7", { w: 2.2, shadow: 0, taper: [0.4, 0.4], seed: 9517 }, 0.8);
      contour(g, surf, 3.4, 9512, false);
    });
    // l'écume du rouleau : une lèvre blanche qui coiffe la crête et se recourbe devant la face de la vague
    const foam = smooth([[X - 16, cy - 6], [X - 7, cy - 13], [X + 4, cy - 12], [X + 12, cy - 6], [X + 15, cy + 1], [X + 13, cy + 6], [X + 10, cy + 2], [X + 8, cy - 3], [X + 2, cy - 7], [X - 7, cy - 8]], true, 3);
    fillShape(g, shift(foam, 2, 3), SH, 0.2);
    cel(g, foam, FOAM, FOAM_S, 1.6);
    contour(g, foam, 2.2, 9513);
    // la flèche : un grand arc doré qui part devant la vague, passe haut au-dessus de la crête et retombe sur l'eau calme derrière
    const a: P = [cx - 36, cy - 4], c: P = [cx - 4, cy - 66], b: P = [cx + 33, cy + 12], N = 26, curve: P[] = [];
    // (le corps s'enfonce sous la tête : son bout n'est jamais encré par-dessus elle)
    for (let i = 0; i <= N; i++) curve.push(quad(a, c, b, 0.02 + (0.84 * i) / N));
    const body = ribbon(curve, 3.2, 5.4);
    const tip = quad(a, c, b, 1), end = quad(a, c, b, 0.8), dx = tip[0] - end[0], dy = tip[1] - end[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const head = smooth([[end[0] - uy * 11 - ux * 2, end[1] + ux * 11 - uy * 2], [tip[0], tip[1]], [end[0] + uy * 11 - ux * 2, end[1] - ux * 11 - uy * 2]], true, 1);
    fillShape(g, shift(body, 3, 4), SH, 0.25); cel(g, body, GOLD, GOLD_S, 2.4); contour(g, body, 3, 9514);
    fillShape(g, shift(head, 3, 4), SH, 0.25); cel(g, head, GOLD, GOLD_S, 3); contour(g, head, 3.2, 9515);
    // le reflet du feutre sur le haut de l'arc
    ink(g, curve.slice(3, 12).map(([x, y]) => [x - 1, y - 2] as P), "#fff3b0", { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 9516 }, 0.9);
  });
};
