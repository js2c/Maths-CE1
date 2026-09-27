// LES RÉCOMPENSES DESSINÉES (docs/SPEC.md, « Coquillages et cartes ») : le grand coquillage qui
// s'ouvre sur une perle, l'éclat de la perle, les étoiles dorée et arc-en-ciel, les faces des cartes
// (dos, recto par rareté avec son fond provisoire, bord de la fenêtre d'illustration, verso de
// l'anecdote), les boutons « récif » et « maison ». Même main que tout le reste (oceanMarker.ts).
import { rng, type Gfx, type P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, L, shift, WATER, WATER_D } from "../oceanMarker";
import { drawAnswerBubble, drawBubble } from "./decor";

const SH = "#0a3f49", TAU = Math.PI * 2;

// ---------------------------------------------------------------- le grand coquillage
// Une palourde géante rose vue de face et un peu de dessus, charnière au fond. La valve du dessus tourne
// autour de la charnière : on voit d'abord son dos côtelé, qui se relève et s'amincit, puis sa face
// intérieure nacrée quand elle a dépassé la verticale de la vue ; dans la valve du dessous, la nacre et la
// perle. Projection : un point de la valve à la distance d de la charnière, valve ouverte de l'angle θ,
// tombe en y = H + d·(cos θ·sin φ − sin θ·cos φ) (φ : la vue plonge de 53°). `o` de 0 (fermé) à 1.
export const SHELL_N = 12;
const H0 = -44, SIN_P = 0.8, COS_P = 0.6;
// le contour d'une valve dans son plan : (x, d), charnière (d = 0) au fond, bord libre (d ≈ 92) devant
const VALVE: P[] = (() => { const out: P[] = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * (i / 40), r = 1 + 0.035 * Math.abs(Math.sin(a * 9)); out.push([-Math.cos(a) * 112 * r, 10 + Math.sin(a) * 82 * r]); } out.push([26, 4], [24, 0], [-24, 0], [-26, 4]); return out; })();
const project = (pts: P[], k: number, cx: number, cy: number): P[] => pts.map(([x, d]) => [cx + x, cy + H0 + d * k]);
// les deux coquillages : le rose (ordinaire) et le doré (celui des étoiles dorées, pour une légendaire)
const SHELL_PINK = { bowl: "#f5a08e", bowlS: "#c8645a", valve: "#ff9e8e", valveS: "#cf6a5e", valveL: "#ffc4b6", rib: "#ffd0c4", ear: "#ffb0a0", pearlSh: "#d89aa8", nacre: "#fff0f4", nacreS: "#f2c0cc", nacreS2: "#e8b4c4" };
const SHELL_GOLD = { bowl: "#f0bc3a", bowlS: "#b87a10", valve: "#ffd84a", valveS: "#c88a14", valveL: "#fff0a0", rib: "#fff2b0", ear: "#ffe070", pearlSh: "#d8a850", nacre: "#fff8e4", nacreS: "#f2dca8", nacreS2: "#e8cc90" };
export const drawBigShell = (g: Gfx, o: number, cx: number, cy: number, gold = false) => g.group("plain", () => {
  const P = gold ? SHELL_GOLD : SHELL_PINK, th = (o * 102 * Math.PI) / 180, k = Math.cos(th) * SIN_P - Math.sin(th) * COS_P, rim = project(VALVE, SIN_P, cx, cy);
  // la valve du dessous : son dos bombé sous le bord
  const bowl = smooth([...rim.slice(0, 41).map(([x, y], i) => { const a = Math.PI * (i / 40); return [x, y + 30 * Math.pow(Math.sin(a), 1.4)] as P; }), ...rim.slice(0, 41).reverse()], true, 2);
  fillShape(g, shift(bowl, 10, 12), SH, 0.3);
  cel(g, bowl, P.bowl, P.bowlS, 6);
  clipped(g, bowl, () => { for (let i = 1; i < 12; i++) { const p = rim[Math.round((i / 12) * 40)]; ink(g, [[p[0], p[1]], [p[0] * 0.96, p[1] + 34]], P.bowlS, { w: 3, shadow: 0, taper: [0.2, 0.2], seed: 3000 + i }, 0.7); } });
  contour(g, bowl, 4.4, 3015);
  // l'intérieur nacré et la perle (cachés tant que la valve du dessus est fermée)
  const nacre = smooth(rim, true, 2);
  cel(g, nacre, P.nacre, P.nacreS, 8, [blob(cx - 30, cy + H0 + 40, 40, 16, 3020, 0.2, 10), "#ffffff"]);
  clipped(g, nacre, () => { ink(g, smooth([[cx - 80, cy + H0 + 30], [cx - 20, cy + H0 + 52], [cx + 60, cy + H0 + 40]], false, 8), "#b8e0f0", { w: 5, shadow: 0, taper: [0.3, 0.3], seed: 3021 }, 0.5); ink(g, smooth([[cx - 60, cy + H0 + 60], [cx + 10, cy + H0 + 72], [cx + 80, cy + H0 + 56]], false, 8), "#e0c8f5", { w: 4, shadow: 0, taper: [0.3, 0.3], seed: 3022 }, 0.5); });
  ink(g, nacre, P.bowlS, { w: 2.4, closed: true, shadow: 0, seed: 3023 }, 0.9);
  const pc: P = [cx, cy + H0 + 52], pearl = blob(pc[0], pc[1], 17, 16, 3024, 0.01, 18);
  fillShape(g, blob(pc[0] + 4, pc[1] + 9, 18, 6, 3025, 0.05, 10), P.pearlSh, 0.6);
  cel(g, pearl, "#fffdf8", "#d8cbe8", 5, [blob(pc[0] - 6, pc[1] - 6, 6, 4.5, 3026, 0.05, 8), "#ffffff"]);
  contour(g, pearl, 2.6, 3027);
  // la valve du dessus : dos côtelé (k > 0) ou face nacrée (k < 0) ; presque de profil vers k = 0
  if (Math.abs(k) < 0.04) { ink(g, [[cx - 112, cy + H0 + 2], [cx + 112, cy + H0 + 2]], INK, { w: 7, shadow: 0, taper: [0.1, 0.1], seed: 3030 }); return; }
  const up = smooth(project(VALVE, k, cx, cy), true, 2), outside = k > 0;
  fillShape(g, shift(up, 8, 10), SH, outside ? 0.25 : 0.12);
  if (outside) {
    cel(g, up, P.valve, P.valveS, 6, [smooth(project([[-80, 40], [-40, 70], [10, 78], [-10, 50], [-50, 30]], k, cx, cy), true, 4), P.valveL]);
    clipped(g, up, () => { for (let i = 1; i < 14; i++) { const a = Math.PI * (i / 14), d = project([[-Math.cos(a) * 112, 10 + Math.sin(a) * 82]], k, cx, cy)[0], h = project([[0, 6]], k, cx, cy)[0]; ink(g, [h, d], i % 2 ? P.valveS : P.rib, { w: i % 2 ? 4 : 2.4, shadow: 0, taper: [0.5, 0.1], seed: 3040 + i }, 0.75); } });
  } else {
    cel(g, up, P.nacre, P.nacreS2, 5);
    clipped(g, up, () => ink(g, smooth(project([[-70, 30], [0, 60], [70, 30]], k, cx, cy), false, 8), "#b8e0f0", { w: 5, shadow: 0, taper: [0.3, 0.3], seed: 3060 }, 0.5));
  }
  contour(g, up, 4.4, 3070);
  // les oreilles de la charnière
  const ears = smooth([[cx - 28, cy + H0 + 4], [cx - 22, cy + H0 - 8], [cx + 22, cy + H0 - 8], [cx + 28, cy + H0 + 4]], true, 3);
  cel(g, ears, P.ear, P.valveS, 2); contour(g, ears, 3, 3071);
});
// l'éclat de la perle (et des cartes brillantes) : une étoile de lumière à quatre branches
export const drawGlint = (g: Gfx, cx: number, cy: number, R = 30) => g.group("plain", () => {
  const pts: P[] = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU - Math.PI / 2, r = i % 4 === 0 ? R : i % 2 === 0 ? R * 0.18 : R * 0.3; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  fillShape(g, blob(cx, cy, R * 0.5, R * 0.5, 3080, 0.05, 12), "#fff6c8", 0.45);
  const s = smooth(pts, true, 3); fillShape(g, s, "#fffbe8"); ink(g, s, "#ffd84a", { w: 2.2, closed: true, shadow: 0, seed: 3081 });
});

// ---------------------------------------------------------------- étoiles dorée et arc-en-ciel
export const drawGoldStar = (g: Gfx, cx: number, cy: number, R = 44) => g.group("plain", () => {
  const s = O.starShape([cx, cy], R, R * 0.43, 0.12);
  fillShape(g, shift(s, 7, 9), SH, 0.3);
  cel(g, s, "#ffd84a", "#d08a10", 7, [O.starShape([cx - 4, cy - 5], R * 0.55, R * 0.24, 0.12), "#fff2a0"]);
  ink(g, smooth([[cx - R * 0.5, cy - R * 0.05], [cx - R * 0.25, cy - R * 0.35], [cx + R * 0.05, cy - R * 0.45]], false, 6), "#ffffff", { w: 4, shadow: 0, taper: [0.3, 0.4], seed: 3101 }, 0.9);
  contour(g, s, 4, 3102);
});
const RAINBOW = ["#ff5a5a", "#ff9e3d", "#ffd84a", "#5ccf6a", "#4aa8ff"];
export const drawRainbowStar = (g: Gfx, cx: number, cy: number, R = 44) => g.group("plain", () => {
  const s = O.starShape([cx, cy], R, R * 0.43, 0.12);
  fillShape(g, shift(s, 7, 9), SH, 0.3);
  clipped(g, s, () => RAINBOW.forEach((c, i) => { const a0 = -Math.PI / 2 + 0.12 + ((i - 0.5) * TAU) / 5, a1 = a0 + TAU / 5, wedge: P[] = [[cx, cy], [cx + Math.cos(a0) * R * 2, cy + Math.sin(a0) * R * 2], [cx + Math.cos(a1) * R * 2, cy + Math.sin(a1) * R * 2]]; fillShape(g, wedge, mix(c, "#000000", 0.18)); fillShape(g, shift(wedge, -3, -4), c); }));
  cel(g, blob(cx, cy, R * 0.16, R * 0.16, 3110, 0.05, 12), "#fffaf0", "#e8e0f0", 1);
  contour(g, s, 4, 3111);
});

// ---------------------------------------------------------------- les cartes
// Une carte de 330 × 440 (portrait 3:4, docs/SPEC.md, « La carte et l'album ») : l'illustration générée
// remplit toute la carte ; l'application pose par-dessus un cadre fin aux coins arrondis dont la matière
// dit la rareté (nacre, argent, or) et, en bas, un bandeau semi-transparent où elle écrit le nom. Le verso
// porte l'anecdote (écrite en direct). Le dos d'une carte est l'image de sa zone (générée à part) ; le dos
// dessiné ici ne sert que si cette image manque.
export const CARD_W = 330, CARD_H = 440, CARD_R = 20, FRAME = 9, BANNER_H = 64;
// un rectangle aux coins arrondis : de vrais quarts de cercle, et des côtés découpés en petits pas (le
// trait du feutre reste régulier, sans à-coup aux angles)
export const rrect = (x: number, y: number, w: number, h: number, r: number): P[] => {
  const out: P[] = [], side = (a: P, b: P) => { const n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 12)); for (let i = 0; i < n; i++) out.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]); };
  const corner = (cx: number, cy: number, a0: number) => { for (let i = 0; i < 8; i++) { const a = a0 + (i / 8) * (Math.PI / 2); out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  corner(x + w - r, y + r, -Math.PI / 2); side([x + w, y + r], [x + w, y + h - r]); corner(x + w - r, y + h - r, 0); side([x + w - r, y + h], [x + r, y + h]);
  corner(x + r, y + h - r, Math.PI / 2); side([x, y + h - r], [x, y + r]); corner(x + r, y + r, Math.PI); side([x + r, y], [x + w - r, y]);
  return out;
};
// les trois matières du cadre : [clair, ombre, reflet]
const MATTER: Record<string, [string, string, string]> = { commune: ["#f7efe9", "#cdbfcc", "#ffffff"], rare: ["#eef3f7", "#8f9eaa", "#ffffff"], legendaire: ["#ffd84a", "#bf7c10", "#fff2a0"] };
const outer = (x: number, y: number) => rrect(x, y, CARD_W, CARD_H, CARD_R), inner = (x: number, y: number) => rrect(x + FRAME, y + FRAME, CARD_W - 2 * FRAME, CARD_H - 2 * FRAME, CARD_R - FRAME + 2);
// le cadre : un anneau de matière (le contour extérieur, puis l'intérieur parcouru à rebours : un trou)
export const drawCardFrame = (g: Gfx, x: number, y: number, rarete: string) => g.group("plain", () => {
  const [lit, shade, hi] = MATTER[rarete] ?? MATTER.commune, o = outer(x, y), i = inner(x, y), ring = [...o, o[0], ...[...i, i[0]].reverse()];
  cel(g, ring, lit, shade, 4);
  clipped(g, ring, () => {
    // la nacre chatoie (reflets roses, bleus, mauves) ; l'argent et l'or ont un long reflet blanc côté lumière
    if (rarete === "commune") ["#f6c4d8", "#bfe4f2", "#dccdf4", "#f6c4d8"].forEach((c, k) => ink(g, smooth(o.filter((_, n) => n % 3 === 0).map(([px, py]) => [px + (k % 2 ? 2.5 : -2.5) + (k - 1.5) * 1.2, py + (k - 1.5) * 1.4] as P), true, 4), c, { w: 2.6, closed: true, shadow: 0, seed: 3600 + k }, 0.55));
    ink(g, smooth([[x + 4, y + CARD_H * 0.55], [x + 4, y + CARD_R + 4], [x + CARD_R + 4, y + 4], [x + CARD_W * 0.6, y + 4]], false, 8), hi, { w: 3, shadow: 0, taper: [0.4, 0.4], seed: 3605 }, 0.9);
  });
  ink(g, o, INK, { w: 3, closed: true, light: L, shadow: 0.9, seed: 3606 });
  ink(g, i, mix(shade, INK, 0.45), { w: 1.8, closed: true, shadow: 0, seed: 3607 });
  // aux quatre coins, une touche de la rareté : une perle, une étincelle d'argent, une étoile d'or
  const corners: P[] = [[x + FRAME + 1, y + FRAME + 1], [x + CARD_W - FRAME - 1, y + FRAME + 1], [x + FRAME + 1, y + CARD_H - FRAME - 1], [x + CARD_W - FRAME - 1, y + CARD_H - FRAME - 1]];
  corners.forEach(([cx, cy], k) => {
    if (rarete === "commune") { const p = blob(cx, cy, 6.5, 6.5, 3610 + k, 0.01, 12); cel(g, p, "#fffdf8", "#d8cbe8", 2, [blob(cx - 2, cy - 2, 2, 1.6, 3614 + k, 0.05, 8), "#ffffff"]); ink(g, p, INK, { w: 1.6, closed: true, shadow: 0.5, seed: 3618 + k }); }
    else { const st = O.starShape([cx, cy], rarete === "rare" ? 10 : 12, rarete === "rare" ? 3.6 : 5, rarete === "rare" ? 0 : 0.2); cel(g, st, rarete === "rare" ? "#ffffff" : "#ffe98a", rarete === "rare" ? "#9aa8b3" : "#d08a10", 2); ink(g, st, INK, { w: 1.8, closed: true, shadow: 0.5, seed: 3622 + k }); }
  });
});
// le bandeau du nom, en bas, dans le cadre : de l'eau sombre à demi transparente, un filet de lumière dessus
export const drawCardBanner = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  const x0 = x + FRAME, x1 = x + CARD_W - FRAME, y1 = y + CARD_H - FRAME, y0 = y1 - BANNER_H, r = CARD_R - FRAME + 2, pts: P[] = [[x0, y0]];
  for (let k = 0; k <= 8; k++) { const a = Math.PI + (k / 8) * (Math.PI / 2); pts.push([x0 + r + Math.cos(a) * r, y1 - r - Math.sin(a) * r]); }
  for (let k = 0; k <= 8; k++) { const a = Math.PI * 1.5 + (k / 8) * (Math.PI / 2); pts.push([x1 - r + Math.cos(a) * r, y1 - r - Math.sin(a) * r]); }
  pts.push([x1, y0]);
  fillShape(g, pts, "#0b3a45", 0.58);
  ink(g, smooth([[x0 + 6, y0 + 1], [x + CARD_W / 2, y0 - 1], [x1 - 6, y0 + 1]], false, 8), "#bff3ee", { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 3630 }, 0.7);
});
// le fond d'une carte sans illustration : l'eau, le sable, deux bulles
export const drawCardWater = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  const card = outer(x, y), ww = CARD_W, wh = CARD_H;
  fillShape(g, card, WATER_D);
  clipped(g, card, () => {
    fillShape(g, blob(x + ww * 0.5, y + wh * 0.4, ww * 0.8, wh * 0.45, 3210, 0.12, 14), WATER);
    [0.2, 0.55, 0.85].forEach((t, i) => ink(g, smooth([[x + ww * t - 30, y + 50 + i * 60], [x + ww * t, y + 45 + i * 60], [x + ww * t + 28, y + 52 + i * 60]], false, 6), "#37a9b3", { w: 4, shadow: 0, taper: [0.4, 0.4], seed: 3211 + i }, 0.6));
    const sand = smooth([[x - 4, y + wh - 110], [x + ww * 0.4, y + wh - 124], [x + ww + 4, y + wh - 104], [x + ww + 4, y + wh + 4], [x - 4, y + wh + 4]], true, 6);
    fillShape(g, sand, "#d8b577"); fillShape(g, shift(sand, 0, 8), "#f1d79f");
    drawBubble(g, 8, x + 50, y + 70, 1); drawBubble(g, 5, x + 68, y + 44, 2);
  });
});
// le dos de secours : bleu nuit, une grande coquille dorée, des vagues
export const drawCardBack = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  const c = outer(x, y); fillShape(g, shift(c, 10, 12), SH, 0.3); cel(g, c, "#1f6f8a", "#0f4a60", 6);
  clipped(g, c, () => {
    for (let r = 0; r < 7; r++) ink(g, smooth(Array.from({ length: 10 }, (_, i) => [x - 10 + i * 42, y + 40 + r * 64 + (i % 2 ? 10 : -6)] as P), false, 6), "#2f8aa8", { w: 5, shadow: 0, taper: [0.1, 0.1], seed: 3240 + r }, 0.7);
    ink(g, rrect(x + 18, y + 18, CARD_W - 36, CARD_H - 36, 14), "#ffd84a", { w: 4, closed: true, shadow: 0, seed: 3250 }, 0.9);
  });
  contour(g, c, 5, 3251);
  const cx = x + CARD_W / 2, cy = y + CARD_H / 2 + 20, hinge: P = [cx, cy + 40], R = 78, fan: P[] = [];
  for (let i = 0; i <= 42; i++) { const t = i / 42, a = -Math.PI * 0.86 + Math.PI * 0.72 * t, r = R * (1 + 0.06 * Math.abs(Math.sin(Math.PI * 7 * t))); fan.push([hinge[0] + Math.cos(a) * r, hinge[1] - 16 + Math.sin(a) * r]); }
  fan.push([hinge[0] + 18, hinge[1] + 2], [hinge[0] - 18, hinge[1] + 2]);
  const f = smooth(fan, true, 2); fillShape(g, shift(f, 6, 8), "#08303e", 0.4); cel(g, f, "#ffd84a", "#d08a10", 8);
  clipped(g, f, () => { for (let i = 1; i < 7; i++) { const a = -Math.PI * 0.86 + (Math.PI * 0.72 * i) / 7; ink(g, [[hinge[0] + Math.cos(a) * 14, hinge[1] - 10 + Math.sin(a) * 14], [hinge[0] + Math.cos(a) * R * 0.95, hinge[1] - 16 + Math.sin(a) * R * 0.95]], "#c07f12", { w: 4, shadow: 0, taper: [0.4, 0.2], seed: 3260 + i }); } });
  contour(g, f, 4, 3270);
  const ears = smooth([[hinge[0] - 36, hinge[1] - 12], [hinge[0] + 36, hinge[1] - 12], [hinge[0] + 30, hinge[1] + 8], [hinge[0] - 30, hinge[1] + 8]], true, 3); cel(g, ears, "#ffe08a", "#d08a10", 3); contour(g, ears, 3.4, 3271);
});
// le verso de l'anecdote : le papier dans le cadre de la rareté ; le texte est écrit en direct
export const drawCardVerso = (g: Gfx, x: number, y: number, rarete: string) => {
  g.group("plain", () => { const c = outer(x, y); fillShape(g, shift(c, 10, 12), SH, 0.3); cel(g, inner(x, y), "#fffaf0", "#e8dcc4", 6); });
  drawCardFrame(g, x, y, rarete);
  g.group("plain", () => { const r = rng(3281); for (let i = 0; i < 4; i++) drawBubble(g, [4, 6, 8, 5][i], x + 50 + r() * 230, y + 392 + r() * 20, 3 + i); });
};

// ---------------------------------------------------------------- boutons : le récif, la maison
// « récif » : une branche de corail rose et une petite anémone dans la bulle
export const drawReefKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 15, 60);
  g.group("plain", () => {
    const base: P = [cx - 6, cy + 30], branch = (pts: P[], w: number, seed: number) => { const t = O.taper(smooth(pts, false, 5), (u) => w * (1 - 0.45 * u)).outline; cel(g, t, "#ff8aa8", "#d0506e", 2); contour(g, t, 2.6, seed); };
    branch([base, [cx - 8, cy + 8], [cx - 20, cy - 12], [cx - 24, cy - 28]], 7, 3300);
    branch([[cx - 8, cy + 8], [cx + 4, cy - 8], [cx + 6, cy - 26]], 6, 3301);
    branch([[cx - 16, cy - 4], [cx - 30, cy - 10], [cx - 34, cy - 20]], 4.5, 3302);
    const sand = smooth([[cx - 44, cy + 34], [cx - 10, cy + 26], [cx + 40, cy + 30], [cx + 44, cy + 38], [cx - 44, cy + 40]], true, 4); fillShape(g, sand, "#f1d79f"); ink(g, sand, INK, { w: 2.2, closed: true, shadow: 0.3, seed: 3303 });
    const st = O.starShape([cx + 22, cy + 22], 13, 5.6, 0.2); cel(g, st, "#ffc93a", "#e08d1c", 2); contour(g, st, 2.4, 3304);
  });
};
// « maison » : une petite maison (toit corail, porte) pour revenir à l'écran de départ
export const drawHomeKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 16, 52);
  g.group("plain", () => {
    const wall: P[] = [[cx - 20, cy - 4], [cx + 20, cy - 4], [cx + 20, cy + 24], [cx - 20, cy + 24]], roof: P[] = [[cx - 30, cy - 2], [cx, cy - 28], [cx + 30, cy - 2]], door: P[] = [[cx - 6, cy + 24], [cx - 6, cy + 8], [cx + 6, cy + 8], [cx + 6, cy + 24]];
    fillShape(g, shift(wall, 3, 4), SH, 0.25); cel(g, wall, "#fffaf0", "#e0d4bc", 3); contour(g, wall, 3, 3310);
    fillShape(g, shift(roof, 3, 4), SH, 0.25); cel(g, roof, "#ff7a5c", "#c64d3c", 3); contour(g, roof, 3.2, 3311);
    cel(g, door, "#5ab4c0", "#2f7d88", 2); contour(g, door, 2.4, 3312);
  });
};

// ---------------------------------------------------------------- les cartes brillantes
// Le reflet irisé qui balaie une carte brillante (docs/SPEC-LOT2.md, « Cartes brillantes ») : une bande
// oblique d'aplats translucides (mauve, bleu glacier, blanc, jaune pâle, rose), aux bords tracés à la main.
// Dessiné une fois ; l'application le fait glisser sur la carte par une translation CSS (le compositeur).
export const SWEEP_W = 380, SWEEP_H = 560;
const SWEEP: [string, number, number][] = [["#e4d4ff", 22, 0.3], ["#c8f4ff", 26, 0.38], ["#ffffff", 16, 0.62], ["#fff2b0", 22, 0.42], ["#ffd0e8", 20, 0.32]];
export const drawShinySweep = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  const slant = 190, x0 = x + 70, r = rng(3700);
  let off = 0;
  SWEEP.forEach(([c, w, a], i) => {
    // une bande : bord gauche et bord droit, légèrement ondulés
    const left: P[] = [], right: P[] = [];
    for (let k = 0; k <= 8; k++) { const t = k / 8, cx = x0 + off + slant * (1 - t), yy = y + t * SWEEP_H; left.push([cx + (r() - 0.5) * 3, yy]); right.push([cx + w + (r() - 0.5) * 3, yy]); }
    fillShape(g, smooth([...left, ...right.reverse()], true, 3), c, a);
    off += w - (i === 2 ? 2 : 4);
  });
});

// ---------------------------------------------------------------- les cadeaux du récif (surprise)
// Un décor offert une séance sur cinq environ (docs/SPEC-LOT2.md, « Autres règles ») ; il rejoint le récif
// et y reste. Chacun est posé sur le sable par son ancrage (le milieu de sa base).
export const GIFTS = ["corail", "gorgone", "etoile", "coquille"] as const;
const branchOf = (g: Gfx, pts: P[], w: number, lit: string, shade: string, seed: number) => { const t = O.taper(smooth(pts, false, 6), (u) => w * (1 - 0.5 * u)).outline; cel(g, t, lit, shade, 2); contour(g, t, 2.8, seed); return t; };
// une branche de corail rouge orangé, ses polypes en petits points clairs
const drawGiftCoral = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  const L = "#ff7a52", S = "#c8462e";
  fillShape(g, blob(cx + 8, by - 2, 52, 9, 3710, 0.1, 12), SH, 0.25);
  const B: [P[], number][] = [
    [[[cx, by], [cx - 2, by - 44], [cx - 14, by - 84], [cx - 20, by - 124]], 17],
    [[[cx - 3, by - 42], [cx + 20, by - 70], [cx + 28, by - 112]], 12],
    [[[cx - 10, by - 72], [cx - 36, by - 90], [cx - 50, by - 112]], 10],
    [[[cx + 18, by - 68], [cx + 44, by - 80], [cx + 54, by - 100]], 9],
    [[[cx - 16, by - 100], [cx - 2, by - 120], [cx + 2, by - 136]], 8],
  ];
  B.forEach(([b, w], i) => branchOf(g, b, w, L, S, 3711 + i));
  const r = rng(3720);
  B.forEach(([b], i) => { const sp = smooth(b, false, 6); for (let k = 2; k < sp.length - 1; k += 3) { const p = sp[k]; fillShape(g, blob(p[0] - 2 + (r() - 0.5) * 5, p[1], 2.6, 2.4, 3721 + i * 13 + k, 0.1, 8), "#ffd6c0"); } });
});
// une gorgone en éventail, violette : une dentelle de branches fines sur un pied court, ajourée
const drawGiftFan = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  const foot: P = [cx, by - 12], r = rng(3730);
  fillShape(g, blob(cx + 8, by - 2, 44, 8, 3731, 0.1, 12), SH, 0.25);
  const edge: P[] = []; for (let i = 0; i <= 20; i++) { const a = -Math.PI * 0.94 + Math.PI * 0.88 * (i / 20), rr = 100 * (0.94 + 0.08 * Math.sin(i * 2.3) * Math.sin(i * 0.7)); edge.push([cx + Math.cos(a) * rr * 0.8, by - 18 + Math.sin(a) * rr]); }
  const fan = smooth([...edge, [cx + 8, by - 14], [cx - 8, by - 14]], true, 3);
  fillShape(g, shift(fan, 5, 6), SH, 0.2);
  cel(g, fan, "#caa6f2", "#a37ed8", 5); // la chair, entre les branches
  // les branches : de gros rameaux depuis le pied, qui se divisent, puis un treillis de rameaux fins
  const tips: P[] = [];
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * 0.9 + Math.PI * 0.8 * (i / 6) + (r() - 0.5) * 0.08, mid: P = [cx + Math.cos(a) * 38 * 0.8, by - 18 + Math.sin(a) * 42];
    ink(g, smooth([foot, mid], false, 4), "#7a4fb0", { w: 4.4, light: L, shadow: 0.5, taper: [0.1, 0.3], seed: 3732 + i });
    for (const d of [-0.12, 0.12]) { const tip: P = [cx + Math.cos(a + d) * 88 * 0.8, by - 18 + Math.sin(a + d) * 88]; tips.push(tip); ink(g, smooth([mid, [(mid[0] + tip[0]) / 2 + (r() - 0.5) * 6, (mid[1] + tip[1]) / 2], tip], false, 4), "#8e62c6", { w: 2.6, shadow: 0.3, taper: [0.2, 0.6], seed: 3740 + i * 2 + (d > 0 ? 1 : 0) }); }
  }
  for (let rI = 1; rI < 5; rI++) { const pts = Array.from({ length: 13 }, (_, k) => { const a = -Math.PI * 0.9 + Math.PI * 0.8 * (k / 12), rr = 20 + rI * 17 + (r() - 0.5) * 6; return [cx + Math.cos(a) * rr * 0.8, by - 18 + Math.sin(a) * rr] as P; }); ink(g, smooth(pts, false, 3), "#d8c0f8", { w: 1.5, shadow: 0, taper: [0.2, 0.2], seed: 3760 + rI }, 0.9); }
  contour(g, fan, 3, 3765);
  const stem = smooth([[cx - 8, by], [cx - 5, by - 16], [cx + 5, by - 16], [cx + 8, by]], true, 2); cel(g, stem, "#8a5ec0", "#5e3a8c", 2); contour(g, stem, 2.6, 3766);
});
// une étoile de mer bleue aux bras longs (comme celles des récifs), posée à plat, vue un peu de biais
const drawGiftStar = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  const c: P = [cx, by - 30], flat = 0.64;
  const star = smooth(O.starShape([0, 0], 58, 25, 0.3).map(([x, y]) => [c[0] + x, c[1] + y * flat] as P), true, 5);
  fillShape(g, shift(star, 7, 7), SH, 0.3);
  cel(g, star, "#5a9cf0", "#2f66b8", 5, [smooth([[c[0] - 26, c[1] - 10], [c[0] - 6, c[1] - 16], [c[0] + 12, c[1] - 8], [c[0] - 10, c[1] - 3]], true, 4), "#8cc0f8"]);
  const r = rng(3780);
  clipped(g, star, () => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + 0.3 + (i * Math.PI * 2) / 5; for (let k = 1; k < 6; k++) { const t = k / 6.2; fillShape(g, blob(c[0] + Math.cos(a) * 60 * t + (r() - 0.5) * 3, c[1] + Math.sin(a) * 60 * t * flat, 2.4, 2, 3781 + i * 7 + k, 0.1, 8), "#24508e", 0.75); } } });
  contour(g, star, 3.2, 3795);
});
// une petite coquille rose (un pétoncle) : l'éventail côtelé et ses deux oreilles
const drawGiftScallop = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  const hinge: P = [cx, by - 12], R = 52, a0 = -Math.PI * 0.88, a1 = -Math.PI * 0.12, n = 9, edge: P[] = [];
  fillShape(g, blob(cx + 8, by - 2, 42, 8, 3770, 0.1, 12), SH, 0.25);
  for (let i = 0; i <= n * 6; i++) { const t = i / (n * 6), a = a0 + (a1 - a0) * t, rr = R * (1 + 0.06 * Math.abs(Math.sin(Math.PI * n * t))); edge.push([hinge[0] + Math.cos(a) * rr, hinge[1] - 10 + Math.sin(a) * rr]); }
  const f = smooth([...edge, [hinge[0] + 12, hinge[1] + 2], [hinge[0] - 12, hinge[1] + 2]], true, 2);
  fillShape(g, shift(f, 5, 6), SH, 0.25); cel(g, f, "#ffb0c4", "#d06a88", 5);
  clipped(g, f, () => { for (let i = 1; i < n; i++) { const a = a0 + ((a1 - a0) * i) / n; ink(g, [[hinge[0] + Math.cos(a) * 8, hinge[1] - 6 + Math.sin(a) * 8], [hinge[0] + Math.cos(a) * R * 0.97, hinge[1] - 10 + Math.sin(a) * R * 0.97]], "#c0587a", { w: 2.8, shadow: 0, taper: [0.4, 0.2], seed: 3771 + i }); }
    for (const rr of [22, 36]) ink(g, smooth(Array.from({ length: 12 }, (_, k) => { const a = a0 + ((a1 - a0) * k) / 11; return [hinge[0] + Math.cos(a) * rr, hinge[1] - 10 + Math.sin(a) * rr] as P; }), false, 4), "#ffd8e2", { w: 1.6, shadow: 0, taper: [0.2, 0.2], seed: 3785 + rr }, 0.8); });
  contour(g, f, 3.2, 3790);
  const ears = smooth([[hinge[0] - 17, hinge[1] - 5], [hinge[0] + 17, hinge[1] - 5], [hinge[0] + 13, hinge[1] + 5], [hinge[0] - 13, hinge[1] + 5]], true, 3); cel(g, ears, "#ffc4d4", "#d06a88", 2); contour(g, ears, 2.6, 3791);
});
export const drawGift = (g: Gfx, id: string, cx: number, by: number) => ({ corail: drawGiftCoral, gorgone: drawGiftFan, etoile: drawGiftStar, coquille: drawGiftScallop } as Record<string, typeof drawGiftCoral>)[id](g, cx, by);
