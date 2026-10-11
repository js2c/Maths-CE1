// L'ERGONOMIE DU LOT 1 BIS (docs/SPEC.md, « Ergonomie et voix ») : les boutons « je ne sais pas »,
// « passer », « Encore ! » et « album », les pictogrammes de la frise d'avancement (un pictogramme plat
// par étape de la séance, une petite bulle par question, la lueur de l'étape en cours), les perles de l'album, la lune « à demain » en décor (sans
// bulle : elle ne doit pas ressembler à un bouton) et les pictogrammes de l'entraînement libre. Même main
// que le reste (oceanMarker.ts) : aplats, une ombre nette, contour qui s'épaissit du côté de l'ombre.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";

const SH = "#0a3f49", CORAL = "#ff7a5c", CORAL_S = "#c64d3c", GOLD = "#ffd84a", GOLD_S = "#e08d1c", TAU = Math.PI * 2;
const shadowed = (g: Gfx, s: P[], lit: string, shade: string, w: number, seed: number, k = 3) => { fillShape(g, shift(s, 3, 4), SH, 0.25); cel(g, s, lit, shade, k); contour(g, s, w, seed); };
// un triangle « lecture » aux coins à peine arrondis : base verticale en x, pointe à droite
const tri = (x: number, cy: number, w: number, h: number): P[] => { const c: P[] = [[x, cy - h], [x + w, cy], [x, cy + h]], out: P[] = []; c.forEach((p, i) => { const a = c[(i + 2) % 3], b = c[(i + 1) % 3], r = 7, towards = (q: P) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + ((q[0] - p[0]) * r) / d, p[1] + ((q[1] - p[1]) * r) / d] as P; }; out.push(towards(a), [p[0], p[1]], towards(b)); }); return smooth(out, true, 4); };
// le même, rétréci vers son centre (le remplissage reste sous le trait, même dans les angles aigus)
const inset = (pts: P[], k = 0.93): P[] => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]); };
// un « ? » au feutre, dans la main des chiffres de la ligne (ocean.ts, numberStrokes)
const question = (g: Gfx, cx: number, top: number, em: number, color: string, seed: number) => {
  const n = O.numberStrokes("?", cx, top, em);
  n.strokes.forEach((s, i) => { ink(g, shift(s, 2, 3), SH, { w: em * 0.2, shadow: 0, taper: [0.15, 0.15], seed: seed + i }, 0.25); ink(g, s, color, { w: em * 0.2, light: O.LIGHT, shadow: 0.6, taper: [0.15, 0.15], seed: seed + 10 + i }); });
  n.dots.forEach((d, i) => { const b = blob(d[0], d[1], em * 0.1, em * 0.1, seed + 20 + i, 0.05, 10); fillShape(g, shift(b, 2, 3), SH, 0.25); fillShape(g, b, color); ink(g, b, INK, { w: 1.6, closed: true, shadow: 0.4, seed: seed + 30 + i }); });
};

// ---------------------------------------------------------------- les boutons
// « je ne sais pas » : une bulle de parole blanche, sa pointe en bas à gauche, et un grand « ? » corail
export const drawDontKnowKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 17, 54);
  g.group("plain", () => {
    const w = 30, h = 24, y = cy - 6, speech = smooth([[cx - w, y - h + 8], [cx - w + 8, y - h], [cx + w - 8, y - h], [cx + w, y - h + 8], [cx + w, y + h - 8], [cx + w - 8, y + h], [cx - 6, y + h], [cx - 18, y + h + 14], [cx - 16, y + h], [cx - w + 8, y + h], [cx - w, y + h - 8]], true, 3);
    shadowed(g, speech, "#fffdf6", "#d7e7ea", 3.2, 3400, 4);
    question(g, cx + 1, y - 19, 38, CORAL, 3410);
  });
};
// « passer » : deux triangles jaunes l'un derrière l'autre (l'avance rapide d'un lecteur)
export const drawSkipKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 18, 52);
  g.group("plain", () => {
    [[-22, 0], [2, 1]].forEach(([dx, k]) => { const t = tri(cx + dx, cy, 24, 21); fillShape(g, shift(t, 3, 4), SH, 0.25); cel(g, inset(t), GOLD, GOLD_S, 3); ink(g, t, INK, { w: 3.6, closed: true, shadow: 0, seed: 3420 + k }); });
  });
};
// « Encore ! » : le triangle de « jouer », doré cette fois, et une petite étoile de mer qui le suit
export const drawAgainKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 19, 60);
  drawAgainIcon(g, cx, cy);
};
// (lot « Correctifs : passage… », point 10 : le pictogramme seul, repris agrandi sur le galet de l'accueil)
export const drawAgainIcon = (g: Gfx, cx: number, cy: number) => {
  g.group("plain", () => {
    const t = tri(cx - 20, cy, 42, 25);
    fillShape(g, shift(t, 3, 4), SH, 0.25); cel(g, inset(t), GOLD, GOLD_S, 4); ink(g, t, INK, { w: 4.2, closed: true, shadow: 0, seed: 3430 });
    const st = O.starShape([cx + 30, cy - 26], 13, 5.6, 0.2); cel(g, st, "#ffc93a", "#e08d1c", 2); contour(g, st, 2.6, 3431);
    const st2 = O.starShape([cx + 34, cy + 24], 9, 4, 0.5); cel(g, st2, "#ff9a7a", CORAL_S, 2); contour(g, st2, 2.2, 3432);
  });
};
// « album » : un livre fermé, couverture turquoise et tranche crème, un coquillage doré sur la couverture
export const drawAlbumKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 20, 60);
  drawAlbumIcon(g, cx, cy);
};
// (lot « Correctifs : passage… », point 10 : le pictogramme seul, repris agrandi sur le galet de l'accueil)
export const drawAlbumIcon = (g: Gfx, cx: number, cy: number) => {
  g.group("plain", () => {
    const x0 = cx - 30, x1 = cx + 30, y0 = cy - 34, y1 = cy + 34;
    const pages = smooth([[x0 + 6, y0 + 4], [x1 + 6, y0 + 4], [x1 + 6, y1 + 6], [x0 + 6, y1 + 6]], true, 1);
    shadowed(g, pages, "#fffaf0", "#e0d4bc", 3, 3440, 2);
    clipped(g, pages, () => { for (let i = 1; i < 4; i++) ink(g, [[x1 - 1 + i * 2, y0 + 8], [x1 - 1 + i * 2, y1 + 2]], "#c9b48f", { w: 1.2, shadow: 0, seed: 3441 + i }); });
    const cover = smooth([[x0, y0 + 6], [x0 + 6, y0], [x1 - 4, y0], [x1, y0 + 4], [x1, y1 - 4], [x1 - 4, y1], [x0 + 6, y1], [x0, y1 - 6]], true, 3);
    cel(g, cover, "#37a9b3", "#1f7d88", 4); contour(g, cover, 3.6, 3445);
    ink(g, [[x0 + 8, y0 + 3], [x0 + 8, y1 - 3]], "#1a6a74", { w: 3, shadow: 0, taper: [0.1, 0.1], seed: 3446 });
    const frame = smooth([[x0 + 14, y0 + 8], [x1 - 7, y0 + 8], [x1 - 7, y1 - 8], [x0 + 14, y1 - 8]], true, 1);
    ink(g, frame, GOLD, { w: 2, closed: true, shadow: 0, seed: 3447 }, 0.9);
  });
  drawGoldShell(g, cx + 3, cy - 2, 0.62);
};
// un coquillage doré (la couverture de l'album)
const drawGoldShell = (g: Gfx, cx: number, cy: number, k: number) => g.group("plain", () => {
  const hinge: P = [cx, cy + 24 * k], R = 34 * k, a0 = -Math.PI * 0.86, a1 = -Math.PI * 0.14, n = 7, edge: P[] = [];
  for (let i = 0; i <= n * 6; i++) { const t = i / (n * 6), a = a0 + (a1 - a0) * t, r = R * (1 + 0.07 * Math.abs(Math.sin(Math.PI * n * t))); edge.push([hinge[0] + Math.cos(a) * r, hinge[1] - 8 * k + Math.sin(a) * r]); }
  const f = smooth([...edge, [hinge[0] + 9 * k, hinge[1] + 1], [hinge[0] - 9 * k, hinge[1] + 1]], true, 2);
  fillShape(g, shift(f, 2, 3), SH, 0.3); cel(g, f, GOLD, "#c07f12", 4 * k);
  for (let i = 1; i < n; i++) { const a = a0 + ((a1 - a0) * i) / n; ink(g, [[hinge[0] + Math.cos(a) * 6 * k, hinge[1] - 4 * k + Math.sin(a) * 6 * k], [hinge[0] + Math.cos(a) * R * 0.95, hinge[1] - 8 * k + Math.sin(a) * R * 0.95]], "#b87a10", { w: 1.8, shadow: 0, taper: [0.4, 0.2], seed: 3450 + i }); }
  contour(g, f, 2.6, 3458);
});

// ---------------------------------------------------------------- la frise d'avancement
// Correctifs du 27 septembre 2026 : l'ancienne frise (pictogrammes dans des disques blancs en relief) se
// confondait avec les boutons. Les pictogrammes sont désormais plats et petits : aplats sans contour
// épais ni ombre, sans disque, enfilés sur une corde fine (runtime.ts, `drawCord`) ; l'étape en cours se
// reconnaît à une lueur douce posée derrière elle (`drawStepGlow`). Rien ne s'y touche.
export const STEP_R = 18;
const CREAM = "#fff4de", CORAL_F = "#ff9a86", CORAL_D = "#e2705d", PINK_F = "#ffb896", PINK_D = "#d9765a";
// accueil : la tête de la pieuvre qui dit bonjour (manteau corail, trois bouts de bras, deux yeux)
export const drawStepHello = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  [-9, 0, 9].forEach((dx, i) => fillShape(g, blob(cx + dx, cy + 10, 4.2, 5.4, 3459 + i, 0.05, 10), CORAL_D));
  fillShape(g, blob(cx, cy - 1, 15, 13, 3460, 0.04, 16), CORAL_F);
  fillShape(g, blob(cx - 5, cy - 8, 5, 2.6, 3461, 0.05, 10, -0.4), "#ffc0b2");
  [-5.5, 5.5].forEach((dx, i) => { fillShape(g, blob(cx + dx, cy - 1, 3.4, 4, 3462 + i, 0.02, 10), CREAM); fillShape(g, blob(cx + dx + 0.7, cy, 1.8, 2.2, 3466 + i, 0.02, 8), INK); });
  ink(g, smooth([[cx - 3.5, cy + 5], [cx, cy + 6.6], [cx + 3.5, cy + 5]], false, 4), INK, { w: 1.3, shadow: 0, taper: [0.3, 0.3], seed: 3468 });
});
// échauffement : un « + » corail, aux bouts arrondis
export const drawStepPlus = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  // deux barres aux bouts ronds (des capsules), un reflet clair sur la barre verticale
  const a = 4.4, b = 13, bar = (x0: number, y0: number, x1: number, y1: number): P[] => { const th = Math.atan2(y1 - y0, x1 - x0), out: P[] = [], n = 10; for (let i = 0; i <= n; i++) { const t = th + Math.PI / 2 + (Math.PI * i) / n; out.push([x0 + a * Math.cos(t), y0 + a * Math.sin(t)]); } for (let i = 0; i <= n; i++) { const t = th - Math.PI / 2 + (Math.PI * i) / n; out.push([x1 + a * Math.cos(t), y1 + a * Math.sin(t)]); } return out; };
  fillShape(g, bar(cx - b + a, cy, cx + b - a, cy), CORAL_F); fillShape(g, bar(cx, cy - b + a, cx, cy + b - a), CORAL_F);
  fillShape(g, blob(cx - 1.4, cy - b + 5, 1.5, 3.4, 3470, 0.02, 10), "#ffc6b8");
});
// notion du jour : une petite ligne graduée (trois traits crème), l'étoile de mer au-dessus
export const drawStepLine = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  ink(g, [[cx - 15, cy + 9], [cx + 15, cy + 9]], CREAM, { w: 3.2, shadow: 0, taper: [0.1, 0.1], seed: 3480 });
  [-11, 0, 11].forEach((dx, i) => ink(g, [[cx + dx, cy + 3.5], [cx + dx, cy + 14.5]], CREAM, { w: 2.8, shadow: 0, taper: [0.1, 0.1], seed: 3481 + i }));
  const st = O.starShape([cx, cy - 5], 10, 4.4, 0.2); fillShape(g, st, "#ffc93a");
  fillShape(g, O.starShape([cx - 1.2, cy - 6.2], 4.2, 1.9, 0.2), "#ffe594");
});
// récompense : le coquillage rose, à plat (côtes d'un trait fin, sans contour)
export const drawStepShell = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const k = 0.44, hinge: P = [cx, cy + 12], R = 34 * k, a0 = -Math.PI * 0.86, a1 = -Math.PI * 0.14, n = 7, edge: P[] = [];
  for (let i = 0; i <= n * 6; i++) { const t = i / (n * 6), a = a0 + (a1 - a0) * t, r = R * (1 + 0.08 * Math.abs(Math.sin(Math.PI * n * t))); edge.push([hinge[0] + Math.cos(a) * r, hinge[1] - 5 + Math.sin(a) * r]); }
  fillShape(g, smooth([[hinge[0] - 9, hinge[1] - 3], [hinge[0] + 9, hinge[1] - 3], [hinge[0] + 7.5, hinge[1] + 2.5], [hinge[0] - 7.5, hinge[1] + 2.5]], true, 3), PINK_D);
  fillShape(g, smooth([...edge, [hinge[0] + 4, hinge[1]], [hinge[0] - 4, hinge[1]]], true, 2), PINK_F);
  for (let i = 1; i < n; i++) { const a = a0 + ((a1 - a0) * i) / n; ink(g, [[hinge[0] + Math.cos(a) * 3, hinge[1] - 2 + Math.sin(a) * 3], [hinge[0] + Math.cos(a) * R * 0.92, hinge[1] - 5 + Math.sin(a) * R * 0.92]], PINK_D, { w: 1.3, shadow: 0, taper: [0.4, 0.2], seed: 3471 + i }); }
});
// la lueur de l'étape en cours : un halo chaud et doux, sans bord
export const GLOW_R = 34;
export const drawStepGlow = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  // beaucoup de disques très légers, du plus grand au plus petit : le halo s'éclaire vers le centre sans palier visible
  for (let i = 23; i >= 0; i--) fillShape(g, blob(cx, cy, 8 + i * 1.1, 8 + i * 1.1, 3486, 0, 32), "#fff3b8", 0.028);
});
// une question de l'étape en cours : une petite bulle vide (0) ou remplie d'or (1)
export const drawProgressDot = (g: Gfx, cx: number, cy: number, full: boolean) => g.group("plain", () => {
  const r = 9, s = blob(cx, cy, r, r, 3490 + (full ? 1 : 0), 0.02, 14);
  if (full) { fillShape(g, shift(s, 2, 2.5), SH, 0.3); cel(g, s, "#ffe27a", "#e0a21c", 2.5, [blob(cx - 3, cy - 3.5, 2.6, 2, 3492, 0.05, 8), "#fffbe0"]); contour(g, s, 2.2, 3493); }
  else { fillShape(g, s, "#e8f8f6", 0.35); ink(g, s, "#fffdf6", { w: 2.4, closed: true, shadow: 0, seed: 3494 }, 0.95); fillShape(g, blob(cx - 3, cy - 3.5, 2.2, 1.6, 3495, 0.05, 8), "#ffffff", 0.9); }
});

// ---------------------------------------------------------------- l'album : les perles d'une zone
// une perle gagnée (nacre, reflet) ou son emplacement vide (un petit creux dans le sable)
export const drawPearl = (g: Gfx, cx: number, cy: number, full: boolean) => g.group("plain", () => {
  const r = 10;
  if (full) { const s = blob(cx, cy, r, r, 3500, 0.01, 16); fillShape(g, blob(cx + 2, cy + 5, r, 3.5, 3501, 0.05, 10), SH, 0.3); cel(g, s, "#fffdf8", "#d8cbe8", 3, [blob(cx - 3.5, cy - 3.5, 3.4, 2.6, 3502, 0.05, 8), "#ffffff"]); contour(g, s, 2.2, 3503); }
  else { const s = blob(cx, cy, r - 1, r - 2, 3504, 0.03, 14); fillShape(g, s, "#0a3f49", 0.35); ink(g, s, "#8fd8dc", { w: 1.8, closed: true, shadow: 0, seed: 3505 }, 0.7); }
});

// lot 3, étape 5 : la perle d'une page du récif (une par zone), de la même main que celle de l'album ; la page affichée :
// la perle pleine, un peu plus grande ; les autres : vides. Sans texte ni chiffre.
export const drawPagePearl = (g: Gfx, cx: number, cy: number, full: boolean) => g.group("plain", () => {
  if (full) { const r = 14, s = blob(cx, cy, r, r, 3520, 0.01, 18); fillShape(g, blob(cx + 3, cy + 7, r, 4.5, 3521, 0.05, 10), SH, 0.3); cel(g, s, "#fffdf8", "#d8cbe8", 4, [blob(cx - 5, cy - 5, 4.6, 3.4, 3522, 0.05, 8), "#ffffff"]); contour(g, s, 2.8, 3523); }
  else { const r = 11, s = blob(cx, cy, r, r - 1, 3524, 0.03, 14); fillShape(g, s, "#0a3f49", 0.4); ink(g, s, "#8fd8dc", { w: 2.2, closed: true, shadow: 0, seed: 3525 }, 0.8); }
});

// ---------------------------------------------------------------- « à demain » : la lune, décor
// Le croissant dans son halo, sans bulle ni contour de bouton : il flotte au-dessus de l'eau, avec deux
// petites étoiles. (L'ancienne lune était posée dans une bulle-réponse et se touchait.)
export const drawMoonDecor = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  for (let i = 3; i >= 1; i--) fillShape(g, blob(cx, cy, 44 + i * 15, 44 + i * 15, 3510 + i, 0.02, 24), "#fff6c8", 0.06 + 0.03 * (3 - i));
  const c1: P = [cx - 7, cy + 4], R = 44, c2: P = [cx + 13, cy - 11], r = 38, N = 128, pts: P[] = [];
  const inside = (p: P, c: P, rr: number) => Math.hypot(p[0] - c[0], p[1] - c[1]) < rr;
  const on = (c: P, rr: number, a: number): P => [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)];
  let k0 = 0; while (!(inside(on(c1, R, (TAU * k0) / N), c2, r) && !inside(on(c1, R, (TAU * (k0 + 1)) / N), c2, r))) k0++;
  for (let k = 1; k <= N; k++) { const p = on(c1, R, (TAU * (k0 + k)) / N); if (inside(p, c2, r)) break; pts.push(p); }
  const back: P[] = []; for (let k = 0; k < N; k++) { const p = on(c2, r, (TAU * k) / N); if (inside(p, c1, R)) back.push(p); }
  const end = pts[pts.length - 1], near = (q: P) => Math.hypot(q[0] - end[0], q[1] - end[1]);
  let j = back.reduce((bi, q, i) => (near(q) < near(back[bi]) ? i : bi), 0);
  const inner: P[] = []; for (let n = 0; n < back.length; n++) { inner.push(back[j]); j = (j - 1 + back.length) % back.length; }
  if (near(inner[inner.length - 1]) < near(inner[0])) inner.reverse();
  const moon = smooth([...pts, ...inner], true, 1);
  fillShape(g, shift(moon, 6, 7), SH, 0.22);
  cel(g, moon, "#ffe27a", "#e0a21c", 6);
  // deux cratères doux, côté ombre
  [[-24, 16, 6], [-10, 28, 4]].forEach(([dx, dy, rr], i) => fillShape(g, blob(cx + dx, cy + dy, rr, rr * 0.8, 3520 + i, 0.08, 10), "#e8b23a", 0.7));
  contour(g, moon, 4.4, 3522);
  [[cx + 40, cy - 30, 13], [cx + 58, cy + 18, 9], [cx - 52, cy - 34, 8]].forEach(([x, y, s], i) => { const st = O.starShape([x, y], s, s * 0.44, 0.2 + i); cel(g, st, "#fff2a0", "#e0a21c", 2); contour(g, st, 2.2, 3524 + i); });
});

// ---------------------------------------------------------------- l'entraînement libre
// trois grandes bulles : la ligne graduée, les additions, les leçons déjà vues
export const drawFreeLine = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 21, 70);
  g.group("plain", () => {
    const y = cy + 16, band = smooth([[cx - 46, y - 4], [cx + 46, y - 4], [cx + 46, y + 4], [cx - 46, y + 4]], true, 1);
    cel(g, band, "#f0d3a0", "#c89c62", 2); contour(g, band, 2.6, 3530);
    [-36, -18, 0, 18, 36].forEach((dx, i) => ink(g, [[cx + dx, y - 12], [cx + dx, y + 12]], INK, { w: 3, shadow: 0, taper: [0.1, 0.1], seed: 3531 + i }));
    const st = O.starShape([cx + 18, cy - 20], 17, 7.4, 0.2); cel(g, st, "#ffc93a", "#e08d1c", 3); contour(g, st, 3, 3537);
  });
};
export const drawFreeFacts = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 22, 70);
  g.group("plain", () => {
    const slate = smooth([[cx - 44, cy - 28], [cx + 44, cy - 28], [cx + 44, cy + 28], [cx - 44, cy + 28]], true, 1);
    shadowed(g, slate, "#2f6d78", "#21545d", 3.4, 3540, 3);
    const a = 4.5, b = 14, p = (x: number, y: number): P[] => [[x - a, y - b], [x + a, y - b], [x + a, y - a], [x + b, y - a], [x + b, y + a], [x + a, y + a], [x + a, y + b], [x - a, y + b], [x - a, y + a], [x - b, y + a], [x - b, y - a], [x - a, y - a]];
    const plus = p(cx, cy); fillShape(g, plus, "#fffaf0"); ink(g, plus, "#d7e7ea", { w: 1.4, closed: true, shadow: 0, seed: 3541 });
    [-30, 30].forEach((dx, i) => fillShape(g, blob(cx + dx, cy, 6, 6, 3542 + i, 0.05, 10), "#fffaf0", 0.9));
  });
};
export const drawFreeLessons = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 23, 70);
  g.group("plain", () => {
    // trois arcs de saut numérotés, comme dans les leçons
    const y = cy + 18, xs = [cx - 42, cx - 14, cx + 14, cx + 42];
    ink(g, [[cx - 50, y], [cx + 50, y]], INK, { w: 3, shadow: 0, taper: [0.1, 0.1], seed: 3550 });
    xs.forEach((x, i) => fillShape(g, blob(x, y, 5, 5, 3551 + i, 0.05, 10), "#ff5a4a"));
    for (let i = 0; i < 3; i++) { const a = xs[i], b = xs[i + 1], arc = smooth([[a, y - 6], [(a + b) / 2, y - 30], [b, y - 6]], false, 8); ink(g, arc, INK, { w: 6, shadow: 0, taper: [0.1, 0.1], seed: 3555 + i }, 0.35); ink(g, arc, "#ffe45c", { w: 4, shadow: 0, taper: [0.1, 0.1], seed: 3558 + i }); }
    const lb = mix("#ffe45c", "#ffffff", 0.3); fillShape(g, blob(cx, cy - 30, 8, 8, 3561, 0.05, 10), lb, 0.9);
  });
};
