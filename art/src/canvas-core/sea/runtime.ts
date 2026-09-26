// LE DESSIN EN DIRECT DE L'APPLICATION (troisième niveau de CLAUDE.md, « Animation »).
// Ce module est empaqueté par `tools/export-app.mjs` en `app/js/art/runtime.js` (module ES, sans
// dépendance). Il ne contient que ce qui change à chaque question et reste léger : la ligne graduée
// (corde, bouées, poteaux ou ligne d'école, graduations, nombres) et les chiffres encrés des réponses.
// Mêmes primitives que la scène de référence : encre `ink` de gallery.ts, chiffres de `ocean.ts`,
// aplats + ombre nette de `oceanMarker.ts`. Aucun accès au DOM : l'application fournit le contexte.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, lerpP, mix, smooth } from "../gallery";
import { numberStrokes, taper } from "../ocean";
import { cel, contour, INK } from "../oceanMarker";

export { INK };
// les primitives du style n'ont besoin que du contexte courant : un Gfx minimal suffit
const shim = (ctx: CanvasRenderingContext2D) => ({ cur: ctx, touch() { /* rien à suivre ici */ } }) as unknown as Gfx;

// ---------------------------------------------------------------- nombres
export const RED = "#c0302a";
// un nombre encré, centré sur cx, le haut des chiffres en `top`, corps `em`
export const drawNumber = (ctx: CanvasRenderingContext2D, text: string, cx: number, top: number, em: number, o: { color?: string; w?: number; seed?: number } = {}) => {
  const g = shim(ctx), color = o.color ?? INK, w = o.w ?? em * 0.145, seed = o.seed ?? 200, n = numberStrokes(text, cx, top, em);
  n.strokes.forEach((s, k) => ink(g, s, color, { w, shadow: 0.3, taper: [0.1, 0.12], seed: seed + k, min: 0.55 }));
  n.dots.forEach((d, k) => fillShape(g, blob(d[0], d[1], w * 0.7, w * 0.7, seed + 60 + k, 0.1, 8), color));
};

// ---------------------------------------------------------------- la ligne graduée
// `k` fait passer de la corde à bouées (0, niveaux 1 et 2) à la ligne d'école (1) : la corde s'affine
// et fonce vers l'encre, les bouées rapetissent et laissent place à des traits de graduation.
export type LineSpec = {
  x0: number; x1: number; y: number; // extrémités de la corde (px logiques), hauteur
  n: number; // nombre de graduations (0 : aucune, niveau 8)
  labels: (string | null)[]; // texte sous chaque graduation (null : rien)
  ends?: [string, string]; // niveau 8 : les nombres aux deux bouts, sans graduation entre
  k: number; // 0 corde, 1 ligne d'école
  mark?: number; // graduation marquée d'un « ? » rouge (format lire)
  lit?: number[]; // graduations allumées (retours, leçons)
};
export const LABEL_DY = 80, LABEL_EM = 36;
// la corde pend un peu entre ses deux poteaux ; la ligne d'école est droite
export const lineY = (L: LineSpec, x: number) => L.y + 9 * (1 - L.k) * (1 - Math.pow((2 * (x - L.x0)) / (L.x1 - L.x0) - 1, 2));
// abscisse de la graduation i : la première et la dernière à 40 px des poteaux, comme la référence
export const tickX = (L: LineSpec, i: number) => { const a = L.x0 + 40, b = L.x1 - 40; return L.n > 1 ? a + ((b - a) * i) / (L.n - 1) : a; };
export const tickP = (L: LineSpec, i: number): P => { const x = tickX(L, i); return [x, lineY(L, x)]; };
export const buoyR = (L: LineSpec) => { const gap = L.n > 1 ? (L.x1 - L.x0 - 80) / (L.n - 1) : 90; return Math.min(15, gap * 0.3) * (1 - 0.55 * L.k); };

const shiftP = (pts: P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy]);
export const drawLine = (ctx: CanvasRenderingContext2D, L: LineSpec) => {
  const g = shim(ctx), k = L.k, pts: P[] = Array.from({ length: 60 }, (_, i) => { const x = L.x0 + ((L.x1 - L.x0) * i) / 59; return [x, lineY(L, x)] as P; });
  // poteaux (la corde) ; ils s'effacent quand la corde devient une ligne d'école
  if (k < 0.75) [[L.x0, L.x0 - 4], [L.x1, L.x1 + 4]].forEach(([xt, xf], i) => { const foot: P = [xf, L.y + 124], top: P = [xt, L.y - 8], s = taper([foot, lerpP(foot, top, 0.5), top], () => 7).outline; fillShape(g, shiftP(s, 10, 6), "#0a3f49", 0.35); cel(g, s, "#b98752", "#7d5431", 4); contour(g, s, 3.6, 30 + i); });
  // la corde : bande torsadée claire, qui fonce et s'affine vers le trait d'encre
  const half = 4 - 1.2 * k, band = taper(pts, () => half).outline;
  fillShape(g, shiftP(band, 5, 9), "#0a3f49", 0.3 * (1 - k));
  cel(g, band, mix("#f0d3a0", "#fffaf0", k), mix("#c89c62", "#dfe6ee", k), 2.5);
  if (k < 0.6) for (let x = L.x0 + 8; x < L.x1; x += 13) { const y = lineY(L, x); ink(g, [[x - 3, y - 3.5], [x + 3, y + 3.5]], "#8a6238", { w: 1.7, shadow: 0, taper: [0.3, 0.3], seed: x }, 1 - k / 0.6); }
  contour(g, band, 2.8 + 0.8 * k, 33);
  // graduations : un trait d'encre (ligne d'école), puis la bouée par-dessus (corde)
  const R = buoyR(L);
  for (let i = 0; i < L.n; i++) {
    const [x, y] = tickP(L, i), lit = L.lit?.includes(i);
    if (k > 0) { const h = (L.labels[i] ? 20 : 14) * k; ink(g, [[x, y - h], [x, y + h]], INK, { w: 4.2, shadow: 0, taper: [0.15, 0.15], seed: 90 + i }); }
    if (k < 1) {
      const r = R, s = blob(x, y, r, r * 1.08, 40 + i, 0.03, 16), bandB = smooth([[x - r, y - r * 0.27], [x + r, y - r * 0.27], [x + r, y + r * 0.27], [x - r, y + r * 0.27]], true, 3);
      fillShape(g, shiftP(s, 7, 10), "#0a3f49", 0.3);
      cel(g, s, lit ? "#ffe45c" : "#ff5a45", lit ? "#e0a21c" : "#c0302a", 5);
      clipped(g, s, () => { fillShape(g, bandB, "#e6ecf0"); fillShape(g, shiftP(bandB, -3, -2), "#ffffff"); fillShape(g, blob(x - 5, y - 7, 4, 2.6, 60 + i, 0.1, 8), "#ffffff", 0.9); });
      contour(g, s, 3.2, 70 + i);
    } else if (lit) fillShape(g, blob(x, y, 9, 9, 40 + i, 0.05, 12), "#ffe45c");
  }
  // nombres sur le sable, sous leur graduation ; le « ? » rouge sous la graduation demandée
  L.labels.forEach((t, i) => { const x = tickX(L, i), m = i === L.mark; if (t || m) drawNumber(ctx, m ? "?" : t!, x, L.y + LABEL_DY, LABEL_EM, { color: m ? RED : INK, w: 5.2, seed: 200 + i * 5 }); });
  if (L.ends) L.ends.forEach((t, i) => drawNumber(ctx, t, i ? L.x1 - 40 : L.x0 + 40, L.y + LABEL_DY, LABEL_EM, { w: 5.2, seed: 400 + i * 5 }));
};

// ---------------------------------------------------------------- surbrillances (en direct, légères)
// un arc de saut entre deux graduations, numéroté (leçons, retours E1) ; `p` de 0 à 1 le trace ;
// `h` : sa hauteur (la même que celle du saut de la tortue) ; `label` : le numéro du saut, au sommet
export const drawJumpArc = (ctx: CanvasRenderingContext2D, a: P, b: P, p: number, o: { h?: number; color?: string; label?: string; labelColor?: string } = {}) => {
  if (p <= 0) return;
  const g = shim(ctx), h = o.h ?? Math.min(60, Math.abs(b[0] - a[0]) * 0.55), n = Math.max(2, Math.round(24 * p)), pts: P[] = [];
  for (let i = 0; i <= n; i++) { const t = (i / n) * p, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t - Math.sin(Math.PI * t) * h; pts.push([x, y]); }
  ink(g, pts, INK, { w: 8.5, shadow: 0, taper: [0.05, p < 1 ? 0.02 : 0.2], seed: 11 }, 0.35);
  ink(g, pts, o.color ?? "#ffe45c", { w: 6, shadow: 0, taper: [0.05, p < 1 ? 0.02 : 0.2], seed: 11 });
  if (o.label && p >= 1) drawNumber(ctx, o.label, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - h - 34, 28, { color: o.labelColor ?? "#fffaf0", w: 4.4, seed: 600 });
};
// un anneau d'encre autour d'une bulle (bonne réponse, surbrillance)
export const drawRing = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color = "#ffd23a", w = 7) =>
  ink(shim(ctx), blob(cx, cy, r, r, 77, 0.02, 20), color, { w, closed: true, shadow: 0.2, light: [-0.55, -0.83], seed: 78 });
