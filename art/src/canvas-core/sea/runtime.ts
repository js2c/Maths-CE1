// LE DESSIN EN DIRECT DE L'APPLICATION (troisième niveau de CLAUDE.md, « Animation »).
// Ce module est empaqueté par `tools/export-app.mjs` en `app/js/art/runtime.js` (module ES, sans
// dépendance). Il ne contient que ce qui change à chaque question et reste léger : la ligne graduée
// (corde, bouées, poteaux ou ligne d'école, graduations, nombres) et les chiffres encrés des réponses.
// Mêmes primitives que la scène de référence : encre `ink` de gallery.ts, chiffres de `ocean.ts`,
// aplats + ombre nette de `oceanMarker.ts`. Aucun accès au DOM : l'application fournit le contexte.
import { rng, type Gfx, type P } from "../core";
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
  centaines?: number[]; // lot 2, étape 8 : graduations des centaines (un petit chalut au-dessus)
  geant?: boolean; // lot 3 bis (B9) : les bouées géantes de la leçon L2 (un saut vaut dix), nettement plus grosses que celles de L1
};
export const LABEL_DY = 80, LABEL_EM = 36;
// la corde pend un peu entre ses deux poteaux ; la ligne d'école est droite
export const lineY = (L: LineSpec, x: number) => L.y + 9 * (1 - L.k) * (1 - Math.pow((2 * (x - L.x0)) / (L.x1 - L.x0) - 1, 2));
// abscisse de la graduation i : la première et la dernière à 40 px des poteaux, comme la référence
export const tickX = (L: LineSpec, i: number) => { const a = L.x0 + 40, b = L.x1 - 40; return L.n > 1 ? a + ((b - a) * i) / (L.n - 1) : a; };
export const tickP = (L: LineSpec, i: number): P => { const x = tickX(L, i); return [x, lineY(L, x)]; };
export const buoyR = (L: LineSpec) => { const gap = L.n > 1 ? (L.x1 - L.x0 - 80) / (L.n - 1) : 90; return L.geant ? Math.min(28, gap * 0.34) : Math.min(15, gap * 0.3) * (1 - 0.55 * L.k); };

const shiftP = (pts: P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy]);
// une bouée de la corde (rouge, ou allumée en jaune), à la graduation i
const buoy = (g: Gfx, L: LineSpec, i: number, lit: boolean) => {
  const [x, y] = tickP(L, i), r = buoyR(L), s = blob(x, y, r, r * 1.08, 40 + i, 0.03, 16), bandB = smooth([[x - r, y - r * 0.27], [x + r, y - r * 0.27], [x + r, y + r * 0.27], [x - r, y + r * 0.27]], true, 3);
  fillShape(g, shiftP(s, 7, 10), "#0a3f49", 0.3);
  // (lot 3 bis : la bouée géante porte un anneau d'amarrage sur le dessus)
  if (L.geant) { const ring = blob(x, y - r - 4, r * 0.32, r * 0.26, 80 + i, 0.03, 12); ink(g, ring, INK, { w: 5, closed: true, shadow: 0, seed: 82 + i }); ink(g, ring, "#c9d3d8", { w: 2.6, closed: true, shadow: 0, seed: 84 + i }); }
  cel(g, s, lit ? "#ffe45c" : "#ff5a45", lit ? "#e0a21c" : "#c0302a", L.geant ? 8 : 5);
  clipped(g, s, () => { fillShape(g, bandB, "#e6ecf0"); fillShape(g, shiftP(bandB, -3, -2), "#ffffff"); fillShape(g, blob(x - r * 0.33, y - r * 0.47, r * 0.27, r * 0.17, 60 + i, 0.1, 8), "#ffffff", 0.9); });
  contour(g, s, L.geant ? 4.4 : 3.2, 70 + i);
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
  // lot 2, étape 8 : un petit chalut au-dessus de chaque graduation de centaine (docs/SPEC-COMPLEMENTS.md, partie A)
  (L.centaines ?? []).forEach((i) => { const [x, y] = tickP(L, i); drawTrawlBadge(ctx, x, y - 34); });
  // nombres sur le sable, sous leur graduation ; le « ? » rouge sous la graduation demandée
  L.labels.forEach((t, i) => { const x = tickX(L, i), m = i === L.mark; if (t || m) drawNumber(ctx, m ? "?" : t!, x, L.y + LABEL_DY, LABEL_EM, { color: m ? RED : INK, w: 5.2, seed: 200 + i * 5 }); });
  if (L.ends) L.ends.forEach((t, i) => { const x = i ? L.x1 - 40 : L.x0 + 40, y = lineY(L, x); ink(g, [[x, y - 24], [x, y + 24]], INK, { w: 5, shadow: 0, taper: [0.12, 0.12], seed: 95 + i }); drawNumber(ctx, t, x, L.y + LABEL_DY, LABEL_EM, { w: 5.2, seed: 400 + i * 5 }); });
  (L.marks ?? []).forEach((m, i) => { const x = L.x0 + 40 + (L.x1 - L.x0 - 80) * m.t, y = lineY(L, x), c = m.color ?? RED; fillShape(g, blob(x, y, 9, 9, 450 + i, 0.05, 12), "#ffe45c"); ink(g, [[x, y - 28], [x, y + 28]], c, { w: 5.5, shadow: 0, taper: [0.12, 0.12], seed: 460 + i }); if (m.label) drawNumber(ctx, m.label, x, L.y + LABEL_DY, LABEL_EM, { color: c, w: 5.2, seed: 470 + i }); });
};

// le petit chalut des centaines (lot 2, étape 8) : un sac de mailles pendu à un flotteur orange, (x, y) : bas du sac
export const drawTrawlBadge = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const g = shim(ctx), bag = smooth([[x - 12, y - 22], [x + 12, y - 22], [x + 13, y - 12], [x + 6, y - 3], [x, y], [x - 6, y - 3], [x - 13, y - 12]], true, 6);
  fillShape(g, bag.map(([a, b]) => [a + 3, b + 3.5] as P), "#0a3f49", 0.25);
  cel(g, bag, "#1d8a98", "#0f6f7c", 2);
  clipped(g, bag, () => { for (let k = -2; k <= 2; k++) { ink(g, [[x + k * 7 - 10, y - 24], [x + k * 7 + 10, y + 2]], "#f3e6c8", { w: 1, shadow: 0, taper: [0.05, 0.05], seed: 480 + k }, 0.7); ink(g, [[x + k * 7 + 10, y - 24], [x + k * 7 - 10, y + 2]], "#f3e6c8", { w: 1, shadow: 0, taper: [0.05, 0.05], seed: 490 + k }, 0.7); } });
  ink(g, bag, "#8a6238", { w: 2.2, closed: true, shadow: 0.3, seed: 495 });
  const f = blob(x, y - 26, 7, 5, 497, 0.04, 12); cel(g, f, "#ff8a3d", "#c85a1f", 1.5); contour(g, f, 1.8, 498);
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
// lot 3 : la plaque choisie de l'écran « choisir » : un rectangle arrondi doré au feutre, avec son ombre d'encre
export const drawTileRing = (ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, r = 26, color = "#ffd23a") => {
  const g = shim(ctx), x = cx - w / 2, y = cy - h / 2, pts: P[] = [];
  const arc = (ax: number, ay: number, a0: number) => { for (let i = 0; i <= 6; i++) { const t = a0 + (i / 6) * (Math.PI / 2); pts.push([ax + Math.cos(t) * r, ay + Math.sin(t) * r]); } };
  arc(x + w - r, y + r, -Math.PI / 2); arc(x + w - r, y + h - r, 0); arc(x + r, y + h - r, Math.PI / 2); arc(x + r, y + r, Math.PI);
  ink(g, pts, INK, { w: 10, closed: true, shadow: 0, seed: 79 }, 0.35);
  ink(g, pts, color, { w: 7, closed: true, shadow: 0.2, light: [-0.55, -0.83], seed: 80 });
};
// ---------------------------------------------------------------- la frise d'avancement
// la corde fine où sont enfilés les pictogrammes et les petites bulles : `knots` les centres, dans l'ordre ;
// la corde pend un peu entre deux nœuds et dépasse de `tail` aux deux bouts. Couleur de sable, quelques
// marques de torsade, pas d'ombre (elle ne doit rien avoir d'un bouton)
export const drawCord = (ctx: CanvasRenderingContext2D, knots: P[], tail = 14) => {
  if (!knots.length) return;
  const g = shim(ctx), ends: P[] = [[knots[0][0] - tail, knots[0][1] - 2], ...knots, [knots[knots.length - 1][0] + tail, knots[knots.length - 1][1] - 2]], pts: P[] = [];
  for (let i = 0; i < ends.length - 1; i++) {
    const [a, b] = [ends[i], ends[i + 1]], d = Math.abs(b[0] - a[0]), sag = Math.min(6, d * 0.08), n = Math.max(2, Math.round(d / 6));
    for (let k = i ? 1 : 0; k <= n; k++) { const t = k / n; pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + sag * Math.sin(Math.PI * t)]); }
  }
  ink(g, pts, "#e9d3a6", { w: 2.4, shadow: 0, taper: [0.25, 0.25], seed: 3600 }, 0.9);
  for (let i = 3; i < pts.length - 3; i += 2) { const [x, y] = pts[i]; ink(g, [[x - 1.3, y - 1.3], [x + 1.3, y + 1.3]], "#b88e58", { w: 1, shadow: 0, taper: [0.3, 0.3], seed: 3601 + i }, 0.6); }
};

// ---------------------------------------------------------------- lot 3 : le calcul rapide (docs/SPEC.md, « Module 3 »)
// Dessinés une fois par question (ou une fois pour toutes, le mur), dans la même main que la ligne.
const rr = (x: number, y: number, w: number, h: number, r: number): P[] => {
  const pts: P[] = [], arc = (ax: number, ay: number, a0: number) => { for (let i = 0; i <= 5; i++) { const t = a0 + (i / 5) * (Math.PI / 2); pts.push([ax + Math.cos(t) * r, ay + Math.sin(t) * r]); } };
  arc(x + w - r, y + r, -Math.PI / 2); arc(x + w - r, y + h - r, 0); arc(x + r, y + h - r, Math.PI / 2); arc(x + r, y + r, Math.PI);
  return pts;
};
const shiftP2 = (pts: P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy]);
// LE MUR DE CORAIL : le tableau des nombres de 1 à 100, 10 rangées de 10 ; ajouter 10, c'est descendre d'une rangée.
// x, y : le coin haut gauche de la première case ; `split` : les dizaines en corail et les unités en bleu (leçon L7) ;
// `lit` : des cases allumées (jaune) ; `dim` : les nombres estompés sauf les cases allumées
export type WallSpec = { x: number; y: number; cell: number; gap: number; split?: boolean; lit?: number[]; dim?: boolean; upTo?: number }; // upTo : les cases jusqu'à ce nombre seulement (le mur qui se construit, L7)
export const WALL_TENS = "#c64d3c", WALL_UNITS = "#1d7f8f";
export const wallCell = (W: WallSpec, n: number): P => { const r = Math.floor((n - 1) / 10), c = (n - 1) % 10; return [W.x + c * (W.cell + W.gap) + W.cell / 2, W.y + r * (W.cell + W.gap) + W.cell / 2]; };
export const wallSize = (W: WallSpec) => 10 * W.cell + 9 * W.gap;
export const drawWall = (ctx: CanvasRenderingContext2D, W: WallSpec) => {
  const g = shim(ctx), S = wallSize(W), pad = Math.round(W.cell * 0.34), em = W.cell * 0.42;
  // le bloc de corail : bords irréguliers, une ombre nette, des pores
  const slab = smooth([[W.x - pad + 6, W.y - pad], [W.x + S / 2, W.y - pad - 4], [W.x + S + pad - 5, W.y - pad + 2], [W.x + S + pad + 2, W.y + S / 2], [W.x + S + pad - 3, W.y + S + pad], [W.x + S / 2, W.y + S + pad + 4], [W.x - pad + 3, W.y + S + pad - 1], [W.x - pad - 3, W.y + S / 2]], true, 10);
  fillShape(g, shiftP2(slab, 10, 12), "#0a3f49", 0.3);
  cel(g, slab, "#ff8f70", "#d0573f", 9, [smooth([[W.x - pad + 16, W.y - pad + 10], [W.x + S * 0.45, W.y - pad + 6], [W.x + S * 0.4, W.y - pad + 16], [W.x - pad + 18, W.y - pad + 20]], true, 5), "#ffb29a"]);
  contour(g, slab, 4.2, 6900);
  for (let n = 1; n <= (W.upTo ?? 100); n++) {
    const [cx, cy] = wallCell(W, n), cell = rr(cx - W.cell / 2, cy - W.cell / 2, W.cell, W.cell, W.cell * 0.22), lit = W.lit?.includes(n);
    fillShape(g, shiftP2(cell, -2, -2), "#a63e2e", 0.55); // l'alvéole creusée : l'ombre du bord en haut à gauche
    fillShape(g, cell, lit ? "#ffe45c" : "#fff4e6");
    ink(g, cell, lit ? "#e0a21c" : "#d9b8a4", { w: 1.6, closed: true, shadow: 0.4, seed: 6910 + n });
    const faded = W.dim && !lit, t = String(n);
    ctx.globalAlpha = faded ? 0.3 : 1;
    if (W.split && n < 100 && n >= 10) {
      const dx = em * 0.3;
      drawNumber(ctx, t[0], cx - dx, cy - em / 2, em, { color: WALL_TENS, w: em * 0.15, seed: 7000 + n });
      drawNumber(ctx, t[1], cx + dx, cy - em / 2, em, { color: WALL_UNITS, w: em * 0.15, seed: 7200 + n });
    } else drawNumber(ctx, t, cx, cy - em / 2, n === 100 ? em * 0.82 : em, { color: W.split && n < 10 ? WALL_UNITS : INK, w: em * 0.15, seed: 7000 + n });
    ctx.globalAlpha = 1;
  }
};
// UN CAILLOU DU CHEMIN (les ponts du calcul : 38 → + 2 → 40 → + 3 → 43) : un galet gris-bleu et son nombre ; `ask` : le
// nombre à trouver (un « ? » rouge, ou ce que l'enfant a tapé), `lit` : entouré d'or
export const STONE_R = 40;
export const drawStone = (ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string, o: { ask?: boolean; lit?: boolean; seed?: number; r?: number } = {}) => {
  const g = shim(ctx), r = o.r ?? STONE_R, seed = o.seed ?? 7400, s = blob(cx, cy, r * 1.12, r * 0.86, seed, 0.05, 18);
  fillShape(g, shiftP2(s, 6, 8), "#0a3f49", 0.3);
  cel(g, s, o.ask ? "#fffaf0" : "#c3cfd3", o.ask ? "#e3d6bb" : "#8fa0a6", 5, [blob(cx - r * 0.4, cy - r * 0.42, r * 0.34, r * 0.16, seed + 1, 0.1, 8), "#ffffff"]);
  contour(g, s, 3.4, seed + 2);
  if (o.lit) ink(g, blob(cx, cy, r * 1.26, r * 1.0, seed + 3, 0.03, 20), "#ffd23a", { w: 6, closed: true, shadow: 0.2, seed: seed + 4 });
  const em = r * (text.length > 2 ? 0.66 : 0.8);
  if (text) drawNumber(ctx, text, cx, cy - em / 2, em, { color: text === "?" ? RED : INK, w: em * 0.15, seed: seed + 5 });
};
// UN PONT entre deux cailloux : une passerelle de bois en arc, et sa plaque de nacre avec le pas (« + 2 », « − 3 ») ;
// `p` : la part déjà construite (0 à 1), pour l'animation ; `lit` : le pont en cours
// (`r` : le rayon des cailloux qu'il relie ; `em` : la taille de l'écriture de la plaque)
export const drawBridge = (ctx: CanvasRenderingContext2D, a: P, b: P, label: string, o: { p?: number; lit?: boolean; seed?: number; r?: number; em?: number } = {}) => {
  const g = shim(ctx), p = o.p ?? 1, seed = o.seed ?? 7500; if (p <= 0) return;
  const r = o.r ?? STONE_R, x0 = a[0] + r * 0.8, x1 = b[0] - r * 0.8, h = Math.min(r * 1.4, (x1 - x0) * 0.42), yb = (a[1] + b[1]) / 2 - r * 0.35, n = Math.max(3, Math.round(20 * p));
  const pts: P[] = []; for (let i = 0; i <= n; i++) { const t = (i / n) * p; pts.push([x0 + (x1 - x0) * t, yb - Math.sin(Math.PI * t) * h]); }
  const deck = taper(pts, () => 8).outline;
  fillShape(g, shiftP2(deck, 4, 6), "#0a3f49", 0.3);
  cel(g, deck, o.lit ? "#e8b25c" : "#c8965a", "#8a6238", 3); contour(g, deck, 2.8, seed);
  // les planches : de petits traits en travers
  for (let i = 1; i < n; i += 2) { const [px, py] = pts[i]; ink(g, [[px, py - 7], [px, py + 7]], "#6d4a2a", { w: 1.6, shadow: 0, seed: seed + i }); }
  if (p < 1 || !label) return;
  const em = o.em ?? 30, [mx, my] = pts[Math.floor(n / 2)], w = Math.max(em * 1.9, wordWidth(label) * em + em * 0.7), ph = em * 1.34, plate = rr(mx - w / 2, my - ph - em * 0.6, w, ph, em * 0.5);
  fillShape(g, shiftP2(plate, 3, 4), "#0a3f49", 0.25);
  cel(g, plate, o.lit ? "#fff3b8" : "#fffaf0", "#e3d6bb", 3); contour(g, plate, 2.6, seed + 40);
  drawWord(ctx, label, mx, my - ph - em * 0.6 + em * 0.17, em, { color: INK, w: em * 0.147, seed: seed + 41 });
};

// ---------------------------------------------------------------- lot 3 bis (docs/SPEC-LOT3BIS.md, B2, B3)
// LE PANNEAU de la légende des niveaux (pour le parent) : une grande plaque de nacre posée par-dessus l'écran, une ombre
// nette, un fil d'or à l'intérieur du bord ; le texte (un tableau) est posé dessus par l'application. Dessiné une fois,
// à la taille voulue, quand on l'ouvre.
export const drawPanel = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  const g = shim(ctx), s = rr(x, y, w, h, 28), inner = rr(x + 12, y + 12, w - 24, h - 24, 18);
  fillShape(g, shiftP2(s, 12, 14), "#0a3f49", 0.35);
  cel(g, s, "#fffaf0", "#e8dcc4", 10, [smooth([[x + 30, y + 16], [x + w * 0.45, y + 12], [x + w * 0.42, y + 24], [x + 32, y + 28]], true, 5), "#ffffff"]);
  ink(g, inner, "#e0b43a", { w: 2.4, closed: true, shadow: 0, seed: 8400 }, 0.8);
  contour(g, s, 4.4, 8401);
};
// L'ÉTIQUETTE d'un appui long sur un pictogramme : une plaque de nacre à la pointe tournée vers le pictogramme (en bas,
// au milieu), le texte écrit au feutre, de la même main que les nombres ; une à trois lignes. (cx, bottom) : la pointe.
// Renvoie la boîte occupée [x, y, w, h], pour que l'application la garde dans l'écran.
export const TAG_EM = 22, TAG_LH = 1.62, TAG_PAD = 18;
export const labelSize = (lines: string[], em = TAG_EM) => ({ w: Math.max(...lines.map((l) => wordWidth(l))) * em + 2 * TAG_PAD, h: lines.length * em * TAG_LH + 2 * TAG_PAD - em * (TAG_LH - 1) + 6 });
export const drawLabel = (ctx: CanvasRenderingContext2D, cx: number, bottom: number, lines: string[], o: { em?: number; dx?: number } = {}) => {
  const g = shim(ctx), em = o.em ?? TAG_EM, { w, h } = labelSize(lines, em), tip = 16, x = cx - w / 2 + (o.dx ?? 0), y = bottom - tip - h;
  const px = Math.max(x + 26, Math.min(x + w - 26, cx)), plate = [...rr(x, y, w, h, 16)];
  // la plaque et sa pointe, d'un seul contour : la pointe est insérée dans le côté du bas
  const k = plate.findIndex(([, py], i) => i > 0 && py >= y + h - 0.5 && plate[i - 1][1] >= y + h - 0.5 && plate[i][0] < px);
  const shape: P[] = k > 0 ? [...plate.slice(0, k), [px + 12, y + h], [px, y + h + tip], [px - 12, y + h], ...plate.slice(k)] : plate;
  fillShape(g, shiftP2(shape, 5, 6), "#0a3f49", 0.3);
  cel(g, shape, "#fffaf0", "#e8dcc4", 4); contour(g, shape, 3, 8410);
  lines.forEach((l, i) => drawWord(ctx, l, x + w / 2, y + TAG_PAD + 3 + i * em * TAG_LH, em, { w: em * 0.12, seed: 8420 + i * 7 }));
  return [x - 2, y - 2, w + 10, h + tip + 10];
};
// coupe un texte en lignes d'au plus `max` em de large (les mots entiers)
export const wrapWords = (text: string, max: number) => { const out: string[] = []; let cur = ""; for (const wd of text.split(" ")) { const t = cur ? `${cur} ${wd}` : wd; if (cur && wordWidth(t) > max) { out.push(cur); cur = wd; } else cur = t; } if (cur) out.push(cur); return out; };

// ---------------------------------------------------------------- lot 3 bis (B1) : le chemin de cailloux des neuf niveaux
// Les neuf plaques sont posées dans l'ordre sur un chemin de galets, en trois rangées qui serpentent (1 2 3 vers la
// droite, 6 5 4 au retour, 7 8 9) : on suit le chemin comme sur un jeu de l'oie. CALC_STOPS : le centre de chaque plaque
// par rapport à l'ancrage du chemin (le centre de la plaque 1) ; l'application pose le chemin, puis les plaques dessus.
export const CALC_PITCH: P = [216, 186];
export const CALC_STOPS: P[] = Array.from({ length: 9 }, (_, i) => { const r = Math.floor(i / 3), c = i % 3; return [(r === 1 ? 2 - c : c) * CALC_PITCH[0], r * CALC_PITCH[1]]; });
// le tracé du chemin : de plaque en plaque, avec un demi-tour arrondi au bout de chaque rangée
const pathSpine = (ox: number, oy: number): P[] => {
  const [px, py] = CALC_PITCH, out: P[] = [], at = (i: number): P => [ox + CALC_STOPS[i][0], oy + CALC_STOPS[i][1]];
  const seg = (a: P, b: P) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6); for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n + 6 * Math.sin((Math.PI * k) / n)]); };
  const turn = (a: P, b: P, side: 1 | -1) => { const cx = a[0], cy = (a[1] + b[1]) / 2, r = (b[1] - a[1]) / 2; for (let k = 0; k < 24; k++) { const t = -Math.PI / 2 + (Math.PI * k) / 24; out.push([cx + side * Math.cos(t) * (px * 0.55), cy + Math.sin(t) * r]); } };
  seg(at(0), at(1)); seg(at(1), at(2)); turn(at(2), at(3), 1); seg(at(3), at(4)); seg(at(4), at(5)); turn(at(5), at(6), -1); seg(at(6), at(7)); seg(at(7), at(8)); out.push(at(8));
  return out;
};
export const CALC_PATH_BOX = { x0: -150, y0: -110, x1: 2 * CALC_PITCH[0] + 150, y1: 2 * CALC_PITCH[1] + 110 };
// des galets plats le long du tracé : tailles et teintes variées, espacés à la main (graine fixe), une ombre nette chacun
export const drawStonePath = (ctx: CanvasRenderingContext2D, ox: number, oy: number) => {
  const g = shim(ctx), spine = pathSpine(ox, oy), r = rng(7700);
  // le sable foulé sous le chemin : une bande plus claire, sans contour
  ink(g, spine, "#fbe9c0", { w: 46, shadow: 0, taper: [0.02, 0.02], seed: 7701 }, 0.55);
  let d = 0;
  for (let i = 1; i < spine.length; i++) {
    d += Math.hypot(spine[i][0] - spine[i - 1][0], spine[i][1] - spine[i - 1][1]);
    if (d < 30 + r() * 10) continue;
    d = 0;
    const [x, y] = spine[i], side = (r() - 0.5) * 16, rx = 10 + r() * 7, ry = rx * (0.62 + r() * 0.2), rot = (r() - 0.5) * 0.8;
    const stone = blob(x + side * 0.3, y + side, rx, ry, 7710 + i, 0.08, 12, rot);
    const tint = ["#c3cfd3", "#b6c4c9", "#d3d9d4", "#c9c0b3"][Math.floor(r() * 4)];
    fillShape(g, shiftP2(stone, 3, 4), "#0a3f49", 0.28);
    cel(g, stone, tint, mix(tint, "#5d7078", 0.45), 2.5, [blob(x + side * 0.3 - rx * 0.35, y + side - ry * 0.4, rx * 0.35, ry * 0.2, 7720 + i, 0.1, 6), "#ffffff"]);
    contour(g, stone, 2.2, 7730 + i);
  }
};

// ---------------------------------------------------------------- lot « Les leçons » : la table d'addition à consulter
// Une grille posée sur une plaque de nacre : la rangée et la colonne d'en-tête (0 à `max`) en bleu de l'ardoise, chiffres
// clairs ; dans chaque case, la somme. `lit` : la case touchée [a, b] (a : la rangée, b : la colonne), allumée en jaune, ses
// deux en-têtes éclaircis et le chemin qui y mène (la rangée depuis son en-tête, la colonne depuis le sien) teinté ;
// `tint` : l'appui de la famille, en teinte très légère : les doubles (le reflet, bleu) et les amis de 10 (le cadre, corail).
// (x, y) : le coin haut gauche de la case d'angle ; `pitch` : le pas des cases (la zone tactile), `cell` : leur taille dessinée,
// `head` : la largeur de la rangée et de la colonne d'en-tête.
// `bare` : seulement ce que la case touchée change (ses deux en-têtes, son chemin, elle-même), sur un calque posé par-dessus la
// grille dessinée une fois : un toucher ne redessine pas les 121 cases.
// (lot « Multiplication » : `op` « × » pour la table de multiplication, les produits dans les cases ; `min`, la première
// rangée et la première colonne : 1 pour la multiplication, 0 pour l'addition)
export type AddTableSpec = { x: number; y: number; pitch: number; cell: number; head: number; max: number; min?: number; op?: "+" | "×"; lit?: [number, number] | null; tint?: boolean; bare?: boolean };
export const addTableCell = (T: AddTableSpec, a: number, b: number): P => [T.x + T.head + (b - (T.min ?? 0)) * T.pitch + T.pitch / 2, T.y + T.head + (a - (T.min ?? 0)) * T.pitch + T.pitch / 2];
export const addTableSize = (T: AddTableSpec) => T.head + (T.max - (T.min ?? 0) + 1) * T.pitch;
export const ADD_TINT = { double: "#d4eef2", amis10: "#ffe1d6" };
export const drawAddTable = (ctx: CanvasRenderingContext2D, T: AddTableSpec) => {
  const g = shim(ctx), S = addTableSize(T), pad = 12, lit = T.lit ?? null, em = T.cell * 0.4, hc = T.head - (T.pitch - T.cell);
  if (!T.bare) {
    const slab = rr(T.x - pad, T.y - pad, S + 2 * pad, S + 2 * pad, 26);
    fillShape(g, shiftP2(slab, 10, 12), "#0a3f49", 0.3);
    cel(g, slab, "#fffaf0", "#e8dcc4", 8, [smooth([[T.x + 10, T.y - 4], [T.x + S * 0.45, T.y - 8], [T.x + S * 0.42, T.y + 2], [T.x + 12, T.y + 6]], true, 5), "#ffffff"]);
    contour(g, slab, 4.2, 8700);
    // le signe, dans la case d'angle
    drawWord(ctx, T.op ?? "+", T.x + hc / 2, T.y + hc / 2 - em * 0.6, em * 1.2, { color: INK, w: em * 0.2, seed: 8701 });
  }
  const head = (cx: number, cy: number, w: number, h: number, v: number, on: boolean, seed: number) => {
    const s = rr(cx - w / 2, cy - h / 2, w, h, Math.min(w, h) * 0.24);
    fillShape(g, shiftP2(s, 2, 3), "#0a3f49", 0.25); cel(g, s, on ? "#9fe2ea" : "#2f6d78", on ? "#5fb9c4" : "#21545d", 2.5); contour(g, s, 2.2, seed);
    drawNumber(ctx, String(v), cx, cy - em / 2, v === 10 ? em * 0.86 : em, { color: on ? INK : "#fffaf0", w: em * 0.16, seed: seed + 1 });
  };
  const lo = T.min ?? 0, mul = T.op === "×";
  for (let v = lo; v <= T.max; v++) {
    const [cx] = addTableCell(T, lo, v), [, cy] = addTableCell(T, v, lo);
    if (!T.bare || (lit && lit[1] === v)) head(cx, T.y + hc / 2, T.cell, hc, v, !!lit && lit[1] === v, 8710 + v * 3);
    if (!T.bare || (lit && lit[0] === v)) head(T.x + hc / 2, cy, hc, T.cell, v, !!lit && lit[0] === v, 8760 + v * 3);
  }
  for (let a = lo; a <= T.max; a++) for (let b = lo; b <= T.max; b++) {
    const [cx, cy] = addTableCell(T, a, b), s = rr(cx - T.cell / 2, cy - T.cell / 2, T.cell, T.cell, T.cell * 0.22);
    const on = !!lit && lit[0] === a && lit[1] === b, path = !!lit && ((a === lit[0] && b < lit[1]) || (b === lit[1] && a < lit[0]));
    if (T.bare && !on && !path) continue;
    // (la multiplication : seulement la diagonale teintée, les carrés, 3 × 3 ; pas d'amis de 10)
    const fill = on ? "#ffe45c" : path ? "#fff1b0" : T.tint && a === b ? ADD_TINT.double : T.tint && !mul && a + b === 10 ? ADD_TINT.amis10 : "#fff8ee";
    fillShape(g, shiftP2(s, -1.5, -1.5), "#c9b48f", 0.45); fillShape(g, s, fill);
    ink(g, s, on ? "#e0a21c" : "#dcc9ab", { w: on ? 2.6 : 1.4, closed: true, shadow: 0.4, seed: 8820 + a * 11 + b });
    const t = String(mul ? a * b : a + b), e2 = t.length > 2 ? em * 0.72 : t.length > 1 ? em * 0.9 : em;
    drawNumber(ctx, t, cx, cy - (mul ? e2 : em) / 2, e2, { color: INK, w: em * 0.15, seed: 9000 + a * 11 + b });
  }
};
