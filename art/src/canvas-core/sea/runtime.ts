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
import { wordStrokes, wordWidth } from "./letters";

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

// un mot encré (le nom de la pieuvre, plus tard ceux des cartes), même plume que les nombres ; `em` :
// hauteur d'une capitale, `top` : le haut des capitales
export const drawWord = (ctx: CanvasRenderingContext2D, text: string, cx: number, top: number, em: number, o: { color?: string; w?: number; seed?: number } = {}) => {
  const g = shim(ctx), color = o.color ?? INK, w = o.w ?? em * 0.13, seed = o.seed ?? 700, n = wordStrokes(text, cx, top, em);
  n.strokes.forEach((s, k) => ink(g, s, color, { w, shadow: 0.3, taper: [0.1, 0.12], seed: seed + k, min: 0.55 }));
  n.dots.forEach((d, k) => fillShape(g, blob(d[0], d[1], w * 0.7, w * 0.7, seed + 90 + k, 0.1, 8), color));
};
export { wordWidth };

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
  marks?: { t: number; label?: string; color?: string }[]; // repères posés hors graduation (estimer) : t de 0 à 1
};
export const LABEL_DY = 80, LABEL_EM = 36;
// la corde pend un peu entre ses deux poteaux ; la ligne d'école est droite
export const lineY = (L: LineSpec, x: number) => L.y + 9 * (1 - L.k) * (1 - Math.pow((2 * (x - L.x0)) / (L.x1 - L.x0) - 1, 2));
// abscisse de la graduation i : la première et la dernière à 40 px des poteaux, comme la référence
export const tickX = (L: LineSpec, i: number) => { const a = L.x0 + 40, b = L.x1 - 40; return L.n > 1 ? a + ((b - a) * i) / (L.n - 1) : a; };
export const tickP = (L: LineSpec, i: number): P => { const x = tickX(L, i); return [x, lineY(L, x)]; };
export const buoyR = (L: LineSpec) => { const gap = L.n > 1 ? (L.x1 - L.x0 - 80) / (L.n - 1) : 90; return Math.min(15, gap * 0.3) * (1 - 0.55 * L.k); };

const shiftP = (pts: P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy]);
// une bouée de la corde (rouge, ou allumée en jaune), à la graduation i
const buoy = (g: Gfx, L: LineSpec, i: number, lit: boolean) => {
  const [x, y] = tickP(L, i), r = buoyR(L), s = blob(x, y, r, r * 1.08, 40 + i, 0.03, 16), bandB = smooth([[x - r, y - r * 0.27], [x + r, y - r * 0.27], [x + r, y + r * 0.27], [x - r, y + r * 0.27]], true, 3);
  fillShape(g, shiftP(s, 7, 10), "#0a3f49", 0.3);
  cel(g, s, lit ? "#ffe45c" : "#ff5a45", lit ? "#e0a21c" : "#c0302a", 5);
  clipped(g, s, () => { fillShape(g, bandB, "#e6ecf0"); fillShape(g, shiftP(bandB, -3, -2), "#ffffff"); fillShape(g, blob(x - 5, y - 7, 4, 2.6, 60 + i, 0.1, 8), "#ffffff", 0.9); });
  contour(g, s, 3.2, 70 + i);
};
// allume une graduation par-dessus la ligne déjà dessinée (leçons) : la bouée devient jaune ; sur la
// ligne d'école, une pastille jaune sous le trait
export const drawLitTick = (ctx: CanvasRenderingContext2D, L: LineSpec, i: number) => {
  const g = shim(ctx), [x, y] = tickP(L, i);
  if (L.k < 1) buoy(g, L, i, true);
  else { fillShape(g, blob(x, y, 9, 9, 40 + i, 0.05, 12), "#ffe45c"); ink(g, [[x, y - 24], [x, y + 24]], INK, { w: 5, shadow: 0, taper: [0.12, 0.12], seed: 90 + i }); }
};
export const drawLine = (ctx: CanvasRenderingContext2D, L: LineSpec) => {
  const g = shim(ctx), k = L.k, pts: P[] = Array.from({ length: 60 }, (_, i) => { const x = L.x0 + ((L.x1 - L.x0) * i) / 59; return [x, lineY(L, x)] as P; });
  // poteaux (la corde) ; ils s'effacent quand la corde devient une ligne d'école
  if (k < 0.75) [[L.x0, L.x0 - 4], [L.x1, L.x1 + 4]].forEach(([xt, xf], i) => { const foot: P = [xf, L.y + 124], top: P = [xt, L.y - 8], s = taper([foot, lerpP(foot, top, 0.5), top], () => 7).outline; fillShape(g, shiftP(s, 10, 6), "#0a3f49", 0.35); cel(g, s, "#b98752", "#7d5431", 4); contour(g, s, 3.6, 30 + i); });
  // la réglette de la ligne d'école : une planchette claire derrière le trait (bois peint, ombre nette,
  // contour), qui apparaît pendant que la corde se transforme ; elle donne au trait le contraste du papier
  if (k > 0.3) {
    const a = Math.min(1, (k - 0.3) / 0.5), y0 = L.y - 30, y1 = L.y + 34, x0 = L.x0 - 14, x1 = L.x1 + 14;
    const plank = smooth([[x0 + 8, y0], [x1 - 8, y0 - 1], [x1, y0 + 8], [x1, y1 - 8], [x1 - 8, y1], [x0 + 8, y1 + 1], [x0, y1 - 8], [x0, y0 + 8]], true, 4);
    fillShape(g, shiftP(plank, 8, 11), "#0a3f49", 0.3 * a);
    ctx.globalAlpha = a; cel(g, plank, "#fffaf0", "#e3d6bb", 6); ctx.globalAlpha = 1;
    contour(g, plank, 3.4, 35);
  }
  // la corde : bande torsadée claire, qui fonce et s'affine vers le trait d'encre
  const half = 4 - 1.5 * k, band = taper(pts, () => half).outline;
  fillShape(g, shiftP(band, 5, 9), "#0a3f49", 0.3 * (1 - k));
  cel(g, band, mix("#f0d3a0", INK, k), mix("#c89c62", INK, k), 2.5);
  if (k < 0.6) for (let x = L.x0 + 8; x < L.x1; x += 13) { const y = lineY(L, x); ink(g, [[x - 3, y - 3.5], [x + 3, y + 3.5]], "#8a6238", { w: 1.7, shadow: 0, taper: [0.3, 0.3], seed: x }, 1 - k / 0.6); }
  contour(g, band, 2.8 + 0.8 * k, 33);
  // graduations : un trait d'encre (ligne d'école), puis la bouée par-dessus (corde)
  const R = buoyR(L);
  for (let i = 0; i < L.n; i++) {
    const [x, y] = tickP(L, i), lit = L.lit?.includes(i);
    if (k > 0) { const h = (L.labels[i] ? 24 : 16) * Math.min(1, k * 1.25); ink(g, [[x, y - h], [x, y + h]], INK, { w: 5, shadow: 0, taper: [0.12, 0.12], seed: 90 + i }); }
    if (k < 1) buoy(g, L, i, !!lit);
    else if (lit) fillShape(g, blob(x, y, 9, 9, 40 + i, 0.05, 12), "#ffe45c");
  }
  // nombres sur le sable, sous leur graduation ; le « ? » rouge sous la graduation demandée
  L.labels.forEach((t, i) => { const x = tickX(L, i), m = i === L.mark; if (t || m) drawNumber(ctx, m ? "?" : t!, x, L.y + LABEL_DY, LABEL_EM, { color: m ? RED : INK, w: 5.2, seed: 200 + i * 5 }); });
  if (L.ends) L.ends.forEach((t, i) => { const x = i ? L.x1 - 40 : L.x0 + 40, y = lineY(L, x); ink(g, [[x, y - 24], [x, y + 24]], INK, { w: 5, shadow: 0, taper: [0.12, 0.12], seed: 95 + i }); drawNumber(ctx, t, x, L.y + LABEL_DY, LABEL_EM, { w: 5.2, seed: 400 + i * 5 }); });
  (L.marks ?? []).forEach((m, i) => { const x = L.x0 + 40 + (L.x1 - L.x0 - 80) * m.t, y = lineY(L, x), c = m.color ?? RED; fillShape(g, blob(x, y, 9, 9, 450 + i, 0.05, 12), "#ffe45c"); ink(g, [[x, y - 28], [x, y + 28]], c, { w: 5.5, shadow: 0, taper: [0.12, 0.12], seed: 460 + i }); if (m.label) drawNumber(ctx, m.label, x, L.y + LABEL_DY, LABEL_EM, { color: c, w: 5.2, seed: 470 + i }); });
};

// ---------------------------------------------------------------- aides visuelles des retours d'erreur
// la flèche de croissance (E4) : un grand trait d'encre de gauche à droite au-dessus de la ligne ; p la trace
export const drawArrow = (ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, p: number, color = "#ffe45c") => {
  if (p <= 0) return;
  const g = shim(ctx), xe = x0 + (x1 - x0) * p, pts: P[] = smooth([[x0, y + 4], [(x0 + xe) / 2, y - 6], [xe, y]], false, 12);
  ink(g, pts, INK, { w: 11, shadow: 0, taper: [0.1, 0.02], seed: 21 }, 0.35); ink(g, pts, color, { w: 8, shadow: 0, taper: [0.1, 0.02], seed: 21 });
  if (p >= 1) { const head: P[] = [[xe - 26, y - 16], [xe + 6, y], [xe - 26, y + 16]]; fillShape(g, shiftP(head, 3, 4), INK, 0.35); fillShape(g, head, color); ink(g, head, INK, { w: 3, closed: true, shadow: 0.2, seed: 22 }); }
};
// un filet (un paquet de dix) : cadre arrondi à mailles, dans lequel l'application pose dix bulles
export const drawNet = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed = 30) => {
  const g = shim(ctx), r = 10, box = smooth([[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r]], true, 4);
  fillShape(g, box, "#e8fffb", 0.18);
  for (let i = 1; i < 5; i++) ink(g, [[x + (w * i) / 5, y + 3], [x + (w * i) / 5, y + h - 3]], "#e8fffb", { w: 1.4, shadow: 0, taper: [0.1, 0.1], seed: seed + i }, 0.6);
  ink(g, [[x + 3, y + h / 2], [x + w - 3, y + h / 2]], "#e8fffb", { w: 1.4, shadow: 0, taper: [0.1, 0.1], seed: seed + 9 }, 0.6);
  ink(g, box, "#8a6238", { w: 3.4, closed: true, shadow: 0.3, light: [-0.55, -0.83], seed: seed + 10 });
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
  if (o.label && p >= 1) drawWord(ctx, o.label, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - h - 34, 28, { color: o.labelColor ?? "#fffaf0", w: 4.4, seed: 600 });
};
// un miroir d'eau (aide des doubles) : une ligne claire ondulée entre le poisson et son reflet
export const drawWave = (ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number) => {
  const g = shim(ctx), pts: P[] = [];
  for (let x = x0; x <= x1; x += 8) pts.push([x, y + 4 * Math.sin((x - x0) / 22)]);
  ink(g, pts, "#0a3f49", { w: 7, shadow: 0, taper: [0.08, 0.08], seed: 57 }, 0.3);
  ink(g, pts, "#e8fffb", { w: 4.5, shadow: 0, taper: [0.08, 0.08], seed: 58 });
};
// une loupe (leçon L3, « zoom sur 30 ») : verre clair, cerclage de laiton, manche de bois vers le bas à
// gauche ; l'application écrit le nombre agrandi dedans. (cx, cy) centre du verre, r son rayon
export const drawLens = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  const g = shim(ctx), a = Math.PI * 0.75, hx = Math.cos(a), hy = Math.sin(a), base: P = [cx + hx * r * 1.05, cy + hy * r * 1.05], tip: P = [cx + hx * r * 1.95, cy + hy * r * 1.95];
  const handle = taper([base, lerpP(base, tip, 0.5), tip], (u) => r * (0.13 + 0.04 * u)).outline;
  fillShape(g, shiftP(handle, 6, 8), "#0a3f49", 0.3); cel(g, handle, "#b98752", "#7d5431", 4); contour(g, handle, 3.4, 481);
  const rim = blob(cx, cy, r * 1.1, r * 1.1, 482, 0.01, 28), glass = blob(cx, cy, r * 0.93, r * 0.93, 483, 0.01, 28);
  fillShape(g, shiftP(rim, 7, 9), "#0a3f49", 0.3);
  cel(g, rim, "#f2c14e", "#b9832a", 4);
  fillShape(g, glass, "#fffaf0", 0.94);
  clipped(g, glass, () => fillShape(g, blob(cx - r * 0.45, cy - r * 0.5, r * 0.36, r * 0.16, 484, 0.1, 10, -0.6), "#ffffff"));
  contour(g, rim, 4, 485); ink(g, glass, INK, { w: 2.4, closed: true, shadow: 0, seed: 486 }, 0.8);
};
// un anneau d'encre autour d'une bulle (bonne réponse, surbrillance)
export const drawRing = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color = "#ffd23a", w = 7) =>
  ink(shim(ctx), blob(cx, cy, r, r, 77, 0.02, 20), color, { w, closed: true, shadow: 0.2, light: [-0.55, -0.83], seed: 78 });
