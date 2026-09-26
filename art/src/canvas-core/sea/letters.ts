// LES LETTRES, écrites comme les chiffres de la scène de référence (ocean.ts, `numberStrokes`) : une
// écriture scripte d'école, tracée au feutre, que l'enfant retrouve dans ses cahiers. Chaque lettre est un
// ou plusieurs traits de plume dans une boîte où la capitale va de y = 0 à y = 1 (y vers le BAS), la
// hauteur d'x commence à X = 0.42 et les jambages descendent jusqu'à 1.3. Un point doublé est un angle
// (la plume s'arrête et repart), comme dans les chiffres. Les chiffres eux-mêmes sont ceux de ocean.ts.
import type { P } from "../core";
import { smooth } from "../gallery";
import { ADV, numberStrokes } from "../ocean";

const X = 0.42; // haut des minuscules
type Glyph = { w: number; s: P[][]; dots?: P[] };

// un tracé droit : chaque point intérieur est un angle
const poly = (...p: P[]): P[] => p.flatMap((q, i) => (i > 0 && i < p.length - 1 ? [q, q] : [q]));
// un arc d'ellipse, angles en degrés (0 à droite, 90 en bas) ; a0 -> a1 dans un sens ou dans l'autre
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): P[] => {
  const n = Math.max(3, Math.ceil(Math.abs(a1 - a0) / 20)), out: P[] = [];
  for (let i = 0; i <= n; i++) { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  return out;
};
const MID = (1 + X) / 2, RY = (1 - X) / 2; // centre et demi-hauteur d'une panse de minuscule
const bowlL = (cx: number, rx = 0.24) => arc(cx, MID, rx, RY, -25, -335); // panse ouverte à droite (a, d, g, q)

const G: Record<string, Glyph> = {
  a: { w: 0.54, s: [bowlL(0.25), [[0.49, X], [0.49, 1]]] },
  b: { w: 0.56, s: [[[0.05, 0], [0.05, 1]], arc(0.3, MID, 0.24, RY, 200, 520)] },
  c: { w: 0.5, s: [arc(0.27, MID, 0.24, RY, -40, -320)] },
  d: { w: 0.54, s: [bowlL(0.25), [[0.49, 0], [0.49, 1]]] },
  e: { w: 0.54, s: [[[0.04, MID], [0.51, MID], [0.51, MID], ...arc(0.27, MID, 0.24, RY, -5, -318)]] },
  f: { w: 0.42, s: [[...arc(0.36, 0.18, 0.15, 0.17, -20, -180), [0.21, 0.5], [0.21, 1]], [[0.04, X + 0.02], [0.4, X + 0.02]]] },
  g: { w: 0.54, s: [arc(0.25, MID - 0.02, 0.24, RY - 0.02, -25, -335), [[0.49, X], [0.49, 1.1], ...arc(0.27, 1.1, 0.22, 0.2, 0, 160)]] },
  h: { w: 0.54, s: [[[0.05, 0], [0.05, 1]], [[0.05, 0.66], ...arc(0.27, 0.64, 0.22, 0.2, 190, 360), [0.49, 1]]] },
  i: { w: 0.2, s: [[[0.1, X], [0.1, 1]]], dots: [[0.1, 0.2]] },
  j: { w: 0.3, s: [[[0.22, X], [0.22, 1.12], ...arc(0.06, 1.12, 0.16, 0.18, 0, 150)]], dots: [[0.22, 0.2]] },
  k: { w: 0.5, s: [[[0.05, 0], [0.05, 1]], poly([0.44, X], [0.07, 0.76]), [[0.19, 0.66], [0.47, 1]]] },
  l: { w: 0.26, s: [[[0.08, 0], [0.08, 0.84], [0.13, 0.97], [0.24, 1]]] },
  m: { w: 0.74, s: [[[0.05, X], [0.05, 1]], [[0.05, 0.62], ...arc(0.21, 0.6, 0.16, 0.18, 190, 360), [0.37, 1]], [[0.37, 0.62], ...arc(0.53, 0.6, 0.16, 0.18, 190, 360), [0.69, 1]]] },
  n: { w: 0.52, s: [[[0.05, X], [0.05, 1]], [[0.05, 0.64], ...arc(0.26, 0.62, 0.21, 0.2, 190, 360), [0.47, 1]]] },
  o: { w: 0.54, s: [arc(0.27, MID, 0.25, RY, -80, -440)] },
  p: { w: 0.56, s: [[[0.05, X], [0.05, 1.3]], arc(0.3, MID, 0.24, RY, 200, 520)] },
  q: { w: 0.54, s: [bowlL(0.25), [[0.49, X], [0.49, 1.3]]] },
  r: { w: 0.38, s: [[[0.05, X], [0.05, 1]], [[0.05, 0.66], ...arc(0.24, 0.64, 0.19, 0.2, 190, 300)]] },
  s: { w: 0.48, s: [[[0.43, 0.5], [0.33, X + 0.01], [0.19, X + 0.01], [0.07, 0.5], [0.08, 0.62], [0.2, 0.69], [0.34, 0.74], [0.44, 0.83], [0.42, 0.95], [0.29, 1], [0.14, 1], [0.03, 0.92]]] },
  t: { w: 0.4, s: [[[0.17, 0.16], [0.17, 0.88], [0.24, 0.99], [0.36, 0.98]], [[0.02, X + 0.02], [0.37, X + 0.02]]] },
  u: { w: 0.52, s: [[[0.05, X], [0.05, 0.78], ...arc(0.26, 0.78, 0.21, 0.22, 180, 0)], [[0.47, X], [0.47, 1]]] },
  v: { w: 0.48, s: [[[0.02, X], [0.24, 1]], [[0.24, 1], [0.46, X]]] },
  w: { w: 0.72, s: [[[0.02, X], [0.18, 1]], [[0.18, 1], [0.36, 0.54]], [[0.36, 0.54], [0.54, 1]], [[0.54, 1], [0.7, X]]] },
  x: { w: 0.48, s: [[[0.04, X], [0.44, 1]], [[0.44, X], [0.04, 1]]] },
  y: { w: 0.48, s: [[[0.02, X], [0.24, 0.98]], [[0.46, X], [0.24, 1], [0.13, 1.22], [0.02, 1.28]]] },
  z: { w: 0.48, s: [poly([0.04, X], [0.44, X], [0.04, 1], [0.46, 1])] },

  A: { w: 0.64, s: [[[0.02, 1], [0.32, 0]], [[0.32, 0], [0.62, 1]], [[0.13, 0.66], [0.51, 0.66]]] },
  B: { w: 0.6, s: [[[0.06, 0], [0.06, 1]], [[0.06, 0], [0.32, 0], [0.48, 0.08], [0.5, 0.25], [0.38, 0.44], [0.2, 0.47], [0.06, 0.47], [0.06, 0.47], [0.36, 0.47], [0.54, 0.58], [0.57, 0.78], [0.44, 0.96], [0.28, 1], [0.06, 1]]] },
  C: { w: 0.64, s: [arc(0.35, 0.5, 0.32, 0.5, -40, -320)] },
  D: { w: 0.64, s: [[[0.06, 0], [0.06, 1]], [[0.06, 0], [0.28, 0], [0.5, 0.1], [0.6, 0.5], [0.5, 0.9], [0.28, 1], [0.06, 1]]] },
  E: { w: 0.56, s: [poly([0.52, 0], [0.06, 0], [0.06, 1], [0.54, 1]), [[0.06, 0.48], [0.44, 0.48]]] },
  F: { w: 0.54, s: [poly([0.52, 0], [0.06, 0], [0.06, 1]), [[0.06, 0.48], [0.42, 0.48]]] },
  G: { w: 0.68, s: [arc(0.35, 0.5, 0.32, 0.5, -40, -358), poly([0.4, 0.56], [0.66, 0.56], [0.66, 0.92])] },
  H: { w: 0.62, s: [[[0.06, 0], [0.06, 1]], [[0.56, 0], [0.56, 1]], [[0.06, 0.5], [0.56, 0.5]]] },
  I: { w: 0.24, s: [[[0.12, 0], [0.12, 1]]] },
  J: { w: 0.52, s: [[[0.46, 0], [0.46, 0.7], ...arc(0.26, 0.7, 0.2, 0.3, 0, 165)]] },
  K: { w: 0.58, s: [[[0.06, 0], [0.06, 1]], [[0.54, 0], [0.08, 0.58]], [[0.24, 0.42], [0.57, 1]]] },
  L: { w: 0.52, s: [poly([0.06, 0], [0.06, 1], [0.5, 1])] },
  M: { w: 0.74, s: [[[0.05, 1], [0.09, 0]], [[0.09, 0], [0.37, 0.64]], [[0.37, 0.64], [0.65, 0]], [[0.65, 0], [0.69, 1]]] },
  N: { w: 0.62, s: [[[0.06, 1], [0.06, 0]], [[0.06, 0], [0.56, 1]], [[0.56, 1], [0.56, 0]]] },
  O: { w: 0.72, s: [arc(0.36, 0.5, 0.34, 0.5, -80, -440)] },
  P: { w: 0.58, s: [[[0.06, 0], [0.06, 1]], [[0.06, 0], [0.32, 0], [0.5, 0.1], [0.53, 0.3], [0.4, 0.49], [0.06, 0.52]]] },
  Q: { w: 0.74, s: [arc(0.36, 0.5, 0.34, 0.5, -80, -440), [[0.44, 0.74], [0.72, 1.04]]] },
  R: { w: 0.6, s: [[[0.06, 0], [0.06, 1]], [[0.06, 0], [0.32, 0], [0.5, 0.1], [0.53, 0.3], [0.4, 0.49], [0.06, 0.52]], [[0.28, 0.52], [0.58, 1]]] },
  S: { w: 0.58, s: [[[0.52, 0.12], [0.38, 0], [0.18, 0], [0.06, 0.12], [0.08, 0.3], [0.28, 0.44], [0.46, 0.54], [0.56, 0.72], [0.5, 0.92], [0.3, 1], [0.12, 0.98], [0.02, 0.86]]] },
  T: { w: 0.62, s: [[[0.02, 0], [0.6, 0]], [[0.31, 0], [0.31, 1]]] },
  U: { w: 0.62, s: [[[0.06, 0], [0.06, 0.66], ...arc(0.31, 0.68, 0.25, 0.32, 180, 0), [0.56, 0]]] },
  V: { w: 0.62, s: [[[0.02, 0], [0.31, 1]], [[0.31, 1], [0.6, 0]]] },
  W: { w: 0.84, s: [[[0.02, 0], [0.22, 1]], [[0.22, 1], [0.42, 0.3]], [[0.42, 0.3], [0.62, 1]], [[0.62, 1], [0.82, 0]]] },
  X: { w: 0.6, s: [[[0.04, 0], [0.56, 1]], [[0.56, 0], [0.04, 1]]] },
  Y: { w: 0.6, s: [[[0.02, 0], [0.3, 0.52]], poly([0.58, 0], [0.3, 0.52], [0.3, 1])] },
  Z: { w: 0.62, s: [poly([0.04, 0], [0.56, 0], [0.04, 1], [0.58, 1])] },
  "+": { w: 0.62, s: [[[0.31, 0.3], [0.31, 0.9]], [[0.03, 0.6], [0.59, 0.6]]] },
  "=": { w: 0.62, s: [[[0.04, 0.48], [0.58, 0.48]], [[0.04, 0.74], [0.58, 0.74]]] },
  "-": { w: 0.36, s: [[[0.04, 0.68], [0.32, 0.68]]] },
  "'": { w: 0.16, s: [[[0.1, 0], [0.06, 0.2]]] },
  "!": { w: 0.2, s: [[[0.1, 0], [0.1, 0.72]]], dots: [[0.1, 0.95]] },
  ".": { w: 0.18, s: [], dots: [[0.09, 0.95]] },
  ",": { w: 0.18, s: [[[0.11, 0.94], [0.1, 1.04], [0.03, 1.14]]] },
  "?": { w: 0.62, s: [[[0.06, 0.22], [0.2, 0.03], [0.4, 0], [0.56, 0.14], [0.54, 0.34], [0.34, 0.52], [0.3, 0.72]]], dots: [[0.3, 0.95]] },
};
// les accents : une lettre de base et un signe posé au-dessus (ou la cédille dessous)
const ACC: Record<string, [string, string]> = {
  é: ["e", "aigu"], è: ["e", "grave"], ê: ["e", "circ"], ë: ["e", "trema"], à: ["a", "grave"], â: ["a", "circ"], ù: ["u", "grave"], û: ["u", "circ"],
  î: ["ı", "circ"], ï: ["ı", "trema"], ô: ["o", "circ"], ç: ["c", "cedille"], É: ["E", "aigu"], È: ["E", "grave"],
};
G["ı"] = { w: 0.2, s: [[[0.1, X], [0.1, 1]]] }; // le i sans point, pour î et ï
const mark = (kind: string, c: number, top: number): { s: P[][]; dots: P[] } => {
  const y = top === 0 ? -0.2 : 0.2; // au-dessus d'une capitale, ou d'une minuscule
  if (kind === "aigu") return { s: [[[c - 0.06, y + 0.08], [c + 0.08, y - 0.08]]], dots: [] };
  if (kind === "grave") return { s: [[[c - 0.08, y - 0.08], [c + 0.06, y + 0.08]]], dots: [] };
  if (kind === "circ") return { s: [poly([c - 0.12, y + 0.07], [c, y - 0.07], [c + 0.12, y + 0.07])], dots: [] };
  if (kind === "trema") return { s: [], dots: [[c - 0.1, y], [c + 0.1, y]] };
  return { s: [[[c + 0.02, 1], [c + 0.06, 1.1], [c - 0.04, 1.22]]], dots: [] }; // cédille
};
const glyph = (ch: string): { g: Glyph; acc?: string } => {
  const a = ACC[ch]; if (a) return { g: G[a[0]], acc: a[1] };
  return { g: G[ch] ?? G[ch.toLowerCase()] ?? { w: 0.4, s: [] } };
};
const TRACK = 0.1, SPACE = 0.34, DIGIT_W = 0.62;
const isDigit = (ch: string) => ch >= "0" && ch <= "9";
const advance = (ch: string) => (ch === " " ? SPACE : isDigit(ch) ? ADV : glyph(ch).g.w + TRACK);
// largeur d'un mot, en em (sans l'approche finale)
export const wordWidth = (text: string) => { const cs = [...text]; return cs.reduce((a, ch) => a + advance(ch), 0) - (cs.length ? (isDigit(cs.at(-1)!) ? ADV - DIGIT_W : TRACK) : 0); };
// les traits d'un mot centré sur cx ; `top` : le haut des capitales ; `em` : hauteur d'une capitale
export const wordStrokes = (text: string, cx: number, top: number, em: number): { strokes: P[][]; dots: P[] } => {
  const strokes: P[][] = [], dots: P[] = [], at = (ox: number) => ([x, y]: P): P => [ox + x * em, top + y * em];
  let x = cx - (wordWidth(text) * em) / 2;
  for (const ch of text) {
    if (isDigit(ch)) { const n = numberStrokes(ch, x + (DIGIT_W * em) / 2, top, em); strokes.push(...n.strokes); dots.push(...n.dots); }
    else if (ch !== " ") {
      const { g, acc } = glyph(ch), f = at(x);
      g.s.forEach((s) => strokes.push(smooth(s.map(f), false, 8)));
      (g.dots ?? []).forEach((d) => dots.push(f(d)));
      if (acc) { const m = mark(acc, g.w / 2, /[A-Z]/.test(ACC[ch][0]) ? 0 : X); m.s.forEach((s) => strokes.push(smooth(s.map(f), false, 8))); m.dots.forEach((d) => dots.push(f(d))); }
    }
    x += advance(ch) * em;
  }
  return { strokes, dots };
};
export const LETTERS = Object.keys(G).filter((k) => k !== "ı").concat(Object.keys(ACC));
