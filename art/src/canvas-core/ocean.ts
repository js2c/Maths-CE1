// OCEAN LESSON · shared geometry for the maths-CE1 look test. One scene, three hands.
// The geometry (where things are, what shape they have) is authored ONCE here; each hand
// (oceanMarker, oceanPaper, oceanPencil) decides how the marks are made: marker cels + brush
// contour, torn and cut paper, pencil + watercolour. Nothing here draws.
//
// The scene: under the sea, a little octopus (the app's mascot) floats top left and points at a
// rope stretched across the water. Eleven buoys on the rope are the graduations 0..10; a starfish
// sits on the 6th and its number is a "?". The digits sit on the sand under the rope. Three
// answer bubbles wait at the bottom. 1280 x 800, landscape tablet.
//
// Octopus anatomy, simplified for a mascot but kept true: the big dome is the MANTLE (the body,
// not a head), the eyes sit low on the sides of the head just above where the arms start, eight
// arms leave from a ring under the head, each tapering to a fine curling tip, with two rows of
// suckers on the UNDERSIDE, visible only where an arm curls over and shows its underside.
import { rng, type P } from "./core";
import { lerpP, smooth } from "./gallery";

export const W = 1280, H = 800;
export const SAND_Y = 512;

// ---------------------------------------------------------------- a tapered tube with its own normals
export type Arm = { spine: P[]; r: number[]; outline: P[]; side: P[]; under: number; front: boolean };
const normalsOf = (s: P[]): P[] => s.map((_, i) => { const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
export const taper = (spine: P[], r: (t: number) => number): { outline: P[]; r: number[]; nrm: P[] } => {
  const nrm = normalsOf(spine), rr = spine.map((_, i) => r(i / (spine.length - 1))), L: P[] = [], R: P[] = [];
  spine.forEach((p, i) => { L.push([p[0] + nrm[i][0] * rr[i], p[1] + nrm[i][1] * rr[i]]); R.push([p[0] - nrm[i][0] * rr[i], p[1] - nrm[i][1] * rr[i]]); });
  const e = spine[spine.length - 1], e0 = spine[spine.length - 2], ex = e[0] - e0[0], ey = e[1] - e0[1], el = Math.hypot(ex, ey) || 1, tip: P = [e[0] + (ex / el) * rr[rr.length - 1], e[1] + (ey / el) * rr[rr.length - 1]];
  return { outline: [...L, tip, ...R.reverse()], r: rr, nrm };
};
// an arm grows from its root by turning steadily (bend) and then winding up into a curl (curl t^3)
const armSpine = (base: P, th0: number, bend: number, curl: number, len: number, n = 44): P[] => {
  const out: P[] = [base]; let p = base;
  for (let i = 1; i <= n; i++) { const t = i / n, th = th0 + bend * t + curl * t * t * t; p = [p[0] + Math.cos(th) * (len / n), p[1] + Math.sin(th) * (len / n)]; out.push(p); }
  return out;
};

// ---------------------------------------------------------------- the octopus (the mascot)
export const OCTO = { x: 262, y: 222, s: 1.12, tilt: -6 };
const place = (p: P): P => { const a = (OCTO.tilt * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), x = p[0] * OCTO.s, y = p[1] * OCTO.s; return [OCTO.x + x * c - y * s, OCTO.y + x * s + y * c]; };
export const P_ = (pts: P[]): P[] => pts.map(place);
export const at = (p: P): P => place(p);
export const OS = OCTO.s;

// the dome of the mantle; slightly fuller on top, the head narrows a touch where the arms start
export const MANTLE: P[] = smooth([[0, -118], [46, -111], [79, -84], [95, -40], [93, 2], [82, 34], [60, 56], [30, 66], [0, 69], [-30, 66], [-60, 56], [-82, 34], [-93, 2], [-95, -40], [-79, -84], [-46, -111]], true, 8);
// light from the upper left (the surface): the lit side of the dome, and a wet highlight
export const LIGHT: P = [-0.55, -0.83];
export const MANTLE_LIT: P[] = smooth([[-8, -114], [36, -108], [62, -86], [66, -52], [44, -26], [6, -14], [-34, -10], [-66, -18], [-84, -46], [-70, -88], [-40, -108]], true, 8);
export const GLOSS: P[] = [[-58, -64], [-48, -86], [-26, -100]];
export const SPOTS: [number, number, number][] = [[30, -78, 7], [48, -56, 5], [14, -96, 4.5], [-14, -70, 4], [56, -84, 3.5], [66, -30, 5]];
// the face: eyes low on the head, cheeks, a small smile
export const EYES: { c: P; rx: number; ry: number }[] = [{ c: [-36, 12], rx: 19, ry: 23 }, { c: [34, 10], rx: 19, ry: 23 }];
export const LIDS: P[][] = EYES.map(({ c, rx, ry }) => smooth([[c[0] - rx - 3, c[1] - ry * 0.35], [c[0] - rx * 0.4, c[1] - ry - 6], [c[0] + rx * 0.5, c[1] - ry - 5], [c[0] + rx + 3, c[1] - ry * 0.45]], false, 6));
export const CHEEKS: P[] = [[-64, 38], [62, 36]];
export const MOUTH: P[] = smooth([[-12, 40], [-5, 47], [4, 47], [11, 40]], false, 6);

// eight arms: four behind (drawn first), four in front. Angles: 0 = right, PI/2 = down (y down).
const ARM_SPECS: { base: P; th: number; bend: number; curl: number; len: number; r0: number; front: boolean; under: number }[] = [
  { base: [-34, 60], th: 1.95, bend: 0.55, curl: 2.7, len: 122, r0: 15, front: false, under: 1 },
  { base: [30, 60], th: 1.18, bend: -0.55, curl: -2.7, len: 126, r0: 15, front: false, under: -1 },
  { base: [-12, 66], th: 1.64, bend: -0.7, curl: -2.9, len: 106, r0: 14, front: false, under: -1 },
  { base: [12, 66], th: 1.48, bend: 0.7, curl: 3.1, len: 112, r0: 14, front: false, under: 1 },
  { base: [-58, 52], th: 2.2, bend: -0.35, curl: -3.3, len: 144, r0: 17, front: true, under: -1 },      // front left, curls out and up
  { base: [-68, 50], th: 2.95, bend: 1.35, curl: 2.1, len: 172, r0: 16, front: true, under: 1 },        // the wave: out left, up, and over
  { base: [56, 52], th: 0.95, bend: 0.3, curl: -3.4, len: 140, r0: 17, front: true, under: -1 },        // front right, curls in and up
  { base: [68, 50], th: 0.42, bend: 0.1, curl: -0.95, len: 232, r0: 16, front: true, under: -1 },        // the pointer: toward the starfish, tip lifting
];
// arm motion over the loop: each arm breathes its curl in and out on its own phase; the wave arm
// swings widest, the pointer barely moves so it keeps pointing. u is the loop position 0..1.
const AMP = [0.28, 0.28, 0.24, 0.24, 0.3, 0.55, 0.3, 0.1];
const buildArms = (u: number): Arm[] => ARM_SPECS.map((a, i) => {
  const w = Math.sin(2 * Math.PI * u + i * 0.9), curl = a.curl + AMP[i] * w * (a.curl >= 0 ? 1 : -1), bend = a.bend + AMP[i] * 0.35 * Math.sin(2 * Math.PI * u + i * 0.9 + 1.2);
  const spine = armSpine(a.base, a.th, bend, curl, a.len), t = taper(spine, (v) => 2.4 + (a.r0 - 2.4) * Math.pow(1 - v, 0.85));
  // `side` is a row of sucker centres on the underside, from 40% along to near the tip
  const side: P[] = []; for (let k = Math.round(spine.length * 0.38); k < spine.length - 3; k += 2) side.push([spine[k][0] - t.nrm[k][0] * t.r[k] * 0.45 * a.under, spine[k][1] - t.nrm[k][1] * t.r[k] * 0.45 * a.under]);
  return { spine: P_(spine), r: t.r.map((v) => v * OS), outline: P_(t.outline), side: P_(side), under: a.under, front: a.front };
});
export let ARMS: Arm[] = buildArms(0);
export const suckerR = (arm: Arm, k: number) => Math.max(1.6, arm.r[Math.round(arm.spine.length * 0.38) + k * 2] * 0.36);

// ---------------------------------------------------------------- the rope and its buoys (the number line)
export const ROPE = { x0: 150, x1: 1134, y: 452, sag: 9 };
export const ropeY = (x: number) => ROPE.y + ROPE.sag * (1 - Math.pow((2 * (x - ROPE.x0)) / (ROPE.x1 - ROPE.x0) - 1, 2));
export const ROPE_PTS: P[] = Array.from({ length: 60 }, (_, i) => { const x = ROPE.x0 + ((ROPE.x1 - ROPE.x0) * i) / 59; return [x, ropeY(x)] as P; });
export const BUOY_X = Array.from({ length: 11 }, (_, i) => 190 + i * 90.4);
export const BUOYS: P[] = BUOY_X.map((x) => [x, ropeY(x)] as P);
export const BUOY_R = 15;
export const TARGET = 6;
export const POSTS: { top: P; foot: P }[] = [{ top: [ROPE.x0, ROPE.y - 8], foot: [ROPE.x0 - 4, 576] }, { top: [ROPE.x1, ROPE.y - 8], foot: [ROPE.x1 + 4, 576] }];

// the starfish on buoy 6: five arms, each a rounded petal, slightly turned
export const STAR_C: P = [BUOY_X[TARGET], ropeY(BUOY_X[TARGET]) - 42];
export const starShape = (c: P, R: number, r: number, rot: number): P[] => {
  const pts: P[] = [];
  for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + (i * Math.PI) / 5, k = i % 2 ? r : R; pts.push([c[0] + Math.cos(a) * k, c[1] + Math.sin(a) * k]); }
  return smooth(pts, true, 5);
};
export const STAR = starShape(STAR_C, 40, 17, 0.12);

// ---------------------------------------------------------------- digits, authored as a school hand writes them
// em box: x 0..0.62, y 0..1, y DOWN. A doubled point is a corner (the pen stops and turns).
const D: Record<string, P[][]> = {
  "0": [[[0.31, 0], [0.54, 0.12], [0.6, 0.5], [0.54, 0.88], [0.31, 1], [0.08, 0.88], [0.02, 0.5], [0.08, 0.12], [0.31, 0], [0.4, 0.03]]],
  "1": [[[0.1, 0.24], [0.36, 0.02], [0.36, 0.02], [0.36, 1]]],
  "2": [[[0.05, 0.24], [0.18, 0.05], [0.36, 0], [0.54, 0.12], [0.55, 0.34], [0.36, 0.6], [0.04, 1], [0.04, 1], [0.6, 1]]],
  "3": [[[0.06, 0.12], [0.26, 0], [0.48, 0.05], [0.53, 0.24], [0.44, 0.4], [0.26, 0.47], [0.26, 0.47], [0.46, 0.53], [0.57, 0.72], [0.5, 0.92], [0.3, 1], [0.04, 0.9]]],
  "4": [[[0.44, 1], [0.44, 0], [0.44, 0], [0.02, 0.68], [0.02, 0.68], [0.62, 0.68]]],
  "5": [[[0.56, 0.01], [0.56, 0.01], [0.13, 0.01], [0.13, 0.01], [0.09, 0.44], [0.09, 0.44], [0.32, 0.38], [0.52, 0.48], [0.58, 0.72], [0.48, 0.93], [0.28, 1], [0.04, 0.9]]],
  "6": [[[0.52, 0.06], [0.33, 0], [0.13, 0.14], [0.04, 0.5], [0.08, 0.86], [0.3, 1], [0.52, 0.9], [0.58, 0.68], [0.46, 0.5], [0.28, 0.46], [0.1, 0.56], [0.05, 0.66]]],
  "7": [[[0.02, 0.01], [0.02, 0.01], [0.62, 0.01], [0.62, 0.01], [0.24, 1]]],
  "8": [[[0.31, 0.47], [0.5, 0.36], [0.54, 0.16], [0.42, 0.02], [0.2, 0.02], [0.08, 0.16], [0.12, 0.36], [0.31, 0.47], [0.52, 0.6], [0.58, 0.8], [0.46, 0.97], [0.31, 1], [0.16, 0.97], [0.04, 0.8], [0.1, 0.6], [0.31, 0.47], [0.4, 0.42]]],
  "9": [[[0.55, 0.36], [0.4, 0.5], [0.2, 0.5], [0.06, 0.34], [0.08, 0.12], [0.28, 0], [0.5, 0.08], [0.56, 0.36], [0.5, 0.72], [0.36, 0.94], [0.14, 1]]],
  "?": [[[0.06, 0.22], [0.2, 0.03], [0.4, 0], [0.56, 0.14], [0.54, 0.34], [0.34, 0.52], [0.3, 0.72]]],
};
export const DIGIT_DOT: Record<string, P> = { "?": [0.3, 0.95] };
export const ADV = 0.74; // advance between two digits of one number, in em
// one number's strokes, centred on (cx, top), each stroke smoothed as the pen would run it
export const numberStrokes = (text: string, cx: number, top: number, em: number): { strokes: P[][]; dots: P[] } => {
  const w = (text.length - 1) * ADV + 0.62, x0 = cx - (w * em) / 2, strokes: P[][] = [], dots: P[] = [];
  [...text].forEach((ch, k) => {
    const ox = x0 + k * ADV * em;
    (D[ch] ?? []).forEach((s) => strokes.push(smooth(s.map(([x, y]) => [ox + x * em, top + y * em] as P), false, 8)));
    const d = DIGIT_DOT[ch]; if (d) dots.push([ox + d[0] * em, top + d[1] * em]);
  });
  return { strokes, dots };
};
export const LABEL_TOP = 532, LABEL_EM = 36;
export const LABELS = BUOY_X.map((x, i) => numberStrokes(i === TARGET ? "?" : String(i), x, LABEL_TOP, LABEL_EM));

// ---------------------------------------------------------------- the answer bubbles
export const ANSWERS: { c: P; text: string }[] = [{ c: [522, 700], text: "5" }, { c: [640, 700], text: "6" }, { c: [758, 700], text: "7" }];
export const ANSWER_R = 47;

// ---------------------------------------------------------------- the setting
// the sand: a soft dune line, higher on the right
export const SAND_TOP: P[] = smooth([[-20, 526], [140, 514], [330, 522], [520, 512], [720, 520], [900, 506], [1080, 498], [1300, 486]], false, 10);
export const SAND: P[] = [...SAND_TOP, [1300, 820], [-20, 820]];
// ripples in the sand (lines of light and shade across the dune)
export const SAND_RIPPLES: P[][] = (() => { const r = rng(88), out: P[][] = []; for (let i = 0; i < 14; i++) { const x = 30 + r() * 1220, y = 600 + r() * 180, l = 60 + r() * 110; if (y > 640 && x > 430 && x < 850) continue; out.push(smooth([[x, y], [x + l * 0.5, y - 4 - r() * 4], [x + l, y + 1]], false, 8)); } return out; })();
// light from the surface: shafts that widen as they go down and die out before the sand
export const RAYS: P[][] = [[140, 60, 250, 190], [420, 44, 580, 160], [700, 64, 820, 150], [960, 40, 1100, 190]].map(([x0, w0, x1, w1]) => [[x0, -10], [x0 + w0, -10], [x1 + w1, 520], [x1, 520]] as P[]);
// seaweed: tall strands that sway from a root in the sand
export type Weed = { spine: P[]; r0: number; color: 0 | 1 };
let U = 0;
const weed = (x: number, y: number, h: number, lean: number, ph: number, r0: number, color: 0 | 1): Weed => ({ spine: Array.from({ length: 30 }, (_, i) => { const t = i / 29, sway = Math.sin(2 * Math.PI * U + ph) * 14 * t * t; return [x + lean * t * h + Math.sin(t * 5.2 + ph - 2 * Math.PI * U) * 16 * t + sway, y - t * h] as P; }), r0, color });
const buildWeeds = (): Weed[] => [
  weed(1188, 560, 300, -0.08, 0.2, 12, 0), weed(1222, 566, 360, -0.12, 1.4, 14, 1), weed(1252, 560, 250, -0.1, 2.6, 11, 0), weed(1154, 572, 190, 0.05, 3.3, 10, 1),
  weed(40, 600, 240, 0.1, 0.9, 12, 1), weed(74, 606, 180, 0.12, 2.1, 10, 0), weed(18, 612, 150, 0.06, 3.7, 9, 0),
];
export let WEEDS: Weed[] = buildWeeds();
export const ROCKS: { c: P; rx: number; ry: number; seed: number }[] = [{ c: [1086, 632], rx: 60, ry: 30, seed: 11 }, { c: [1158, 642], rx: 40, ry: 22, seed: 12 }, { c: [110, 640], rx: 54, ry: 26, seed: 13 }];
// a school of three small fish, top right, swimming left toward the octopus
export type Fish = { c: P; len: number; dir: 1 | -1; tilt: number; color: 0 | 1 | 2; wag?: number };
const FISH0: Fish[] = [{ c: [1010, 150], len: 74, dir: -1, tilt: -4, color: 0 }, { c: [1100, 212], len: 58, dir: -1, tilt: 3, color: 1 }, { c: [936, 236], len: 52, dir: -1, tilt: -8, color: 2 }];
export const fishShape = (f: Fish) => {
  const L = f.len, h = L * 0.3, a = (f.tilt * Math.PI) / 180, T = (p: P): P => { const x = p[0] * f.dir, y = p[1]; return [f.c[0] + x * Math.cos(a) - y * Math.sin(a), f.c[1] + x * Math.sin(a) + y * Math.cos(a)]; };
  // local: nose at +L/2 (it swims toward +x, flipped by dir), tail root at -L/2
  const bodyPts = smooth([[L * 0.5, 0], [L * 0.36, -h * 0.72], [L * 0.05, -h], [-L * 0.3, -h * 0.66], [-L * 0.46, -h * 0.2], [-L * 0.46, h * 0.2], [-L * 0.3, h * 0.62], [L * 0.05, h * 0.92], [L * 0.36, h * 0.66]], true, 8).map(T);
  const wg = f.wag ?? 0, rot = (p: P): P => { const x = p[0] + L * 0.42, y = p[1]; return [-L * 0.42 + x * Math.cos(wg) - y * Math.sin(wg), x * Math.sin(wg) + y * Math.cos(wg)]; };
  const tail = smooth([[-L * 0.42, 0], [-L * 0.72, -h * 0.95], [-L * 0.64, 0], [-L * 0.72, h * 0.95]].map((p) => rot(p as P)), true, 5).map(T);
  const fin = smooth([[L * 0.02, -h * 0.9], [-L * 0.14, -h * 1.45], [-L * 0.26, -h * 0.76]], true, 5).map(T);
  const stripe = smooth([[L * 0.2, -h * 0.9], [L * 0.12, 0], [L * 0.2, h * 0.9], [L * 0.07, h * 0.95], [-L * 0.01, 0], [L * 0.07, -h * 0.97]], true, 5).map(T);
  const eye = T([L * 0.3, -h * 0.18]), gill = smooth([[L * 0.22, -h * 0.55], [L * 0.16, 0], [L * 0.22, h * 0.5]], false, 5).map(T);
  const mouth = [T([L * 0.49, h * 0.04]), T([L * 0.42, h * 0.1])];
  return { body: bodyPts, tail, fin, stripe, eye, eyeR: L * 0.06, gill, mouth };
};
// bubbles rising from the octopus toward the surface
const COLS: { x: number; y0: number; span: number; r: number[] }[] = [{ x: 390, y0: 150, span: 150, r: [9, 6, 11] }, { x: 144, y0: 128, span: 120, r: [6, 9, 5] }, { x: 620, y0: 330, span: 130, r: [7, 10, 5] }];
const bubblesAt = (u: number): [number, number, number][] => COLS.flatMap((c, ci) => c.r.map((r, j) => { const k = (j / 3 + u) % 1; return [c.x + 5 * Math.sin(2 * Math.PI * (2 * u + k) + ci + j), c.y0 - k * c.span, r * (0.75 + 0.35 * k) * Math.min(1, k * 7, (1 - k) * 10)] as [number, number, number]; }));
export let FISH: Fish[] = FISH0;
export let BUBBLES: [number, number, number][] = bubblesAt(0);
export let BLINK = 0;
const OCTO0 = { y: OCTO.y, tilt: OCTO.tilt };
// THE CLOCK. Everything above that moves is rebuilt for loop position u = frame / total. Every motion
// is periodic over the loop, so the last frame runs into the first without a seam.
export const setTime = (frame: number, total: number) => {
  const u = (((frame % total) + total) % total) / total, S = (k: number, ph = 0) => Math.sin(2 * Math.PI * k * u + ph);
  U = u;
  OCTO.y = OCTO0.y + 7 * S(1); OCTO.tilt = OCTO0.tilt + 2.2 * S(1, 1.1);
  ARMS = buildArms(u); WEEDS = buildWeeds();
  FISH = FISH0.map((f, i) => ({ ...f, c: [f.c[0] + 10 * S(1, i * 2), f.c[1] + 5 * S(2, i * 1.3)] as P, tilt: f.tilt + 3 * S(2, i * 1.3 + 1.2), wag: 0.28 * S(4, i * 0.7) }));
  // bubbles rise from three sources and are reborn at the bottom of their column
  BUBBLES = bubblesAt(u);
  // one blink per loop, a quick close and a slower open
  const b = u * total; BLINK = b >= 70 && b < 78 ? Math.sin(((b - 70) / 8) * Math.PI) : 0;
};
export const mid = lerpP;
