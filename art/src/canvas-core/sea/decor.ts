// LE DÉCOR SOUS-MARIN, découpé pour l'application. Même géométrie que la scène de référence
// (`ocean.ts`) et même main (`oceanMarker.ts`) ; seule la découpe change :
//
//   fond fixe      l'eau en grands aplats, le sable et ses rides, les rochers        -> une image
//   rayons         les puits de lumière, seuls sur transparent                     -> une image (respiration en CSS)
//   algues         chaque brin dessiné dans sa forme de repos ; l'application le fait onduler en
//                  décalant ses rangées de pixels (le mouvement de référence ne déplace l'axe du brin
//                  qu'en x : le décalage par rangée le reproduit exactement, sans redessiner)
//   poissons       une boucle de battement de queue par poisson et par sens de nage
//   bulles, reflets, étoile de mer, bulle-réponse, bouton « réécouter » : de petits sprites fixes
import { rng, type P } from "../core";
import type { Gfx } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, FISHC, INK, L, shift, WATER, WATER_D } from "../oceanMarker";

const WATER_L = "#37a9b3", SAND = "#f1d79f", SAND_S = "#d8b577", SAND_L = "#fbe9c0";
export const W = O.W, H = O.H;

// ---------------------------------------------------------------- fond fixe
export const drawBackground = (g: Gfx) => {
  g.group("plain", () => {
    fillShape(g, [[0, 0], [W, 0], [W, H], [0, H]], WATER_D);
    fillShape(g, blob(640, 260, 760, 330, 401, 0.1, 20, 0), WATER);
    fillShape(g, blob(600, 200, 520, 190, 402, 0.12, 18, -0.1), mix(WATER, WATER_L, 0.25));
  });
  g.group("plain", () => {
    fillShape(g, O.SAND, SAND_S);
    clipped(g, O.SAND, () => { fillShape(g, shift(O.SAND, 0, 16), SAND); fillShape(g, blob(640, 760, 520, 90, 71, 0.2, 16), SAND_L, 0.55); });
    O.SAND_RIPPLES.forEach((s, i) => { ink(g, s, SAND_S, { w: 5, shadow: 0, taper: [0.3, 0.3], seed: 60 + i }, 0.9); ink(g, shift(s, -2, -5), SAND_L, { w: 3, shadow: 0, taper: [0.3, 0.3], seed: 80 + i }, 0.9); });
    contour(g, O.SAND_TOP, 5, 90, false);
  });
  g.group("plain", () => O.ROCKS.forEach((k) => { const s = blob(k.c[0], k.c[1], k.rx, k.ry, k.seed, 0.12, 14); fillShape(g, shift(s, 12, 10), "#8d6f45", 0.35); cel(g, s, "#9aa6b4", "#66728a", 12, [blob(k.c[0] - k.rx * 0.35, k.c[1] - k.ry * 0.45, k.rx * 0.3, k.ry * 0.2, k.seed + 5, 0.2, 10), "#c3ccd6"]); contour(g, s, 4.5, k.seed); }));
};
export const drawRays = (g: Gfx) => g.group("plain", () => O.RAYS.forEach((r) => fillShape(g, r, "#bff3ee", 0.1)));

// ---------------------------------------------------------------- algues
// [x racine, y racine, hauteur, inclinaison, phase, épaisseur, teinte] : les brins de la référence
export type WeedSpec = { x: number; y: number; h: number; lean: number; ph: number; r0: number; color: 0 | 1 };
export const WEEDS: WeedSpec[] = ([
  [1188, 560, 300, -0.08, 0.2, 12, 0], [1222, 566, 360, -0.12, 1.4, 14, 1], [1252, 560, 250, -0.1, 2.6, 11, 0], [1154, 572, 190, 0.05, 3.3, 10, 1],
  [40, 600, 240, 0.1, 0.9, 12, 1], [74, 606, 180, 0.12, 2.1, 10, 0], [18, 612, 150, 0.06, 3.7, 9, 0],
] as const).map(([x, y, h, lean, ph, r0, color]) => ({ x, y, h, lean, ph, r0, color: color as 0 | 1 }));
// décalage horizontal de l'axe à la hauteur t (0 racine .. 1 pointe), à la phase U de la boucle :
// exactement la formule de ocean.ts. L'application utilise la même (voir app/js/scene/weeds.js).
export const weedX = (w: WeedSpec, t: number, U: number) => w.x + w.lean * t * w.h + Math.sin(t * 5.2 + w.ph - 2 * Math.PI * U) * 16 * t + Math.sin(2 * Math.PI * U + w.ph) * 14 * t * t;
export const drawWeed = (g: Gfx, w: WeedSpec, i: number) => g.group("plain", () => {
  const spine = Array.from({ length: 30 }, (_, k) => { const t = k / 29; return [weedX(w, t, 0), w.y - t * w.h] as P; });
  const t = O.taper(spine, (u) => 2 + w.r0 * Math.pow(1 - u, 0.7)).outline, lit = w.color ? "#46b35d" : "#6cc96a", sh = w.color ? "#227a43" : "#3a9a4c";
  cel(g, t, lit, sh, 6); ink(g, spine.slice(2, -3), mix(sh, INK, 0.3), { w: 1.6, shadow: 0, taper: [0.1, 0.4], seed: 700 + i }, 0.6); contour(g, t, 3.6, 720 + i);
});

// ---------------------------------------------------------------- poissons
// Trois poissons de la référence (tailles et couleurs), dessinés centrés sur (cx, cy), sans inclinaison
// (le déplacement et le flottement sont faits en direct). La queue bat une fois par boucle de 12 images.
export const FISH_N = 12;
export const FISH_KINDS = [{ len: 74, color: 0 as const }, { len: 58, color: 1 as const }, { len: 52, color: 2 as const }];
export const drawFish = (g: Gfx, kind: number, dir: 1 | -1, f: number, cx: number, cy: number) => g.group("plain", () => {
  const k = FISH_KINDS[kind], fish: O.Fish = { c: [cx, cy], len: k.len, dir, tilt: 0, color: k.color, wag: 0.3 * Math.sin((2 * Math.PI * f) / FISH_N) };
  const s = O.fishShape(fish), [lit, sh] = FISHC[fish.color], i = kind;
  [s.tail, s.fin].forEach((p, q) => { cel(g, p, lit, sh, 3); contour(g, p, 2.8, 400 + i * 10 + q); });
  cel(g, s.body, lit, sh, 6);
  clipped(g, s.body, () => { fillShape(g, s.stripe, "#fffaf0"); ink(g, s.stripe, INK, { w: 1.8, closed: true, shadow: 0, seed: 420 + i }); });
  ink(g, s.gill, mix(sh, INK, 0.4), { w: 2, shadow: 0, taper: [0.2, 0.3], seed: 430 + i }, 0.8);
  fillShape(g, blob(s.eye[0], s.eye[1], s.eyeR, s.eyeR, 440 + i, 0.05, 10), INK); fillShape(g, blob(s.eye[0] - s.eyeR * 0.3, s.eye[1] - s.eyeR * 0.35, s.eyeR * 0.35, s.eyeR * 0.35, 450 + i, 0.05, 8), "#ffffff");
  // la bouche : un petit trait à l'avant de la tête (le détail que la silhouette seule n'a pas)
  ink(g, s.mouth, mix(sh, INK, 0.5), { w: 1.6, shadow: 0, taper: [0.3, 0.3], seed: 470 + i }, 0.9);
  contour(g, s.body, 3.6, 460 + i);
});

// ---------------------------------------------------------------- petits sprites
export const BUBBLE_R = [4, 6, 8, 10, 12];
export const drawBubble = (g: Gfx, r: number, cx: number, cy: number, i: number) => g.group("plain", () => {
  const s = blob(cx, cy, r, r, 500 + i, 0.03, 12);
  fillShape(g, s, "#bff3ee", 0.25);
  ink(g, s, "#e8fffb", { w: Math.max(1.6, r * 0.28), closed: true, light: L, shadow: -0.6, seed: 510 + i });
  fillShape(g, blob(cx - r * 0.35, cy - r * 0.35, r * 0.22, r * 0.16, 520 + i, 0.05, 8), "#ffffff");
});
// les traînées claires de l'eau (le miroitement), telles que la référence les pose, une par sprite
export const SHIMMER_N = 6;
export const drawShimmer = (g: Gfx, i: number, x: number, y: number) => g.group("plain", () => {
  const r = rng(311 + i * 17), l = 70 + r() * 110;
  ink(g, smooth([[x - l / 2, y], [x, y - 5], [x + l / 2, y + 2]], false, 6), WATER_L, { w: 4 + r() * 4, shadow: 0, taper: [0.4, 0.4], seed: 500 + i }, 0.5);
});
export const drawStar = (g: Gfx, cx: number, cy: number) => g.group("plain", () => {
  const c: P = [cx, cy], s = O.starShape(c, 40, 17, 0.12);
  fillShape(g, shift(s, 8, 10), "#0a3f49", 0.3);
  cel(g, s, "#ffc93a", "#e08d1c", 6);
  const r = rng(7); for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = 4 + r() * 22; fillShape(g, blob(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, 2.2, 2.2, 90 + i, 0.1, 6), "#fff0b8", 0.95); }
  contour(g, s, 3.6, 91);
});
// la bulle-réponse, sans chiffre : le chiffre change à chaque question, il est encré en direct
export const ANSWER_R = O.ANSWER_R;
export const drawAnswerBubble = (g: Gfx, cx: number, cy: number, i: number, R = ANSWER_R) => g.group("plain", () => {
  const s = blob(cx, cy, R, R, 300 + i, 0.02, 20), k = R / ANSWER_R;
  fillShape(g, shift(s, 8 * k, 10 * k), "#8d6f45", 0.35);
  cel(g, s, "#fffaf0", "#cfe6ea", 9 * k, [smooth([[cx - 30 * k, cy - 16 * k], [cx - 20 * k, cy - 32 * k], [cx - 4 * k, cy - 38 * k]], false, 4), "#ffffff"]);
  ink(g, smooth([[cx - 34 * k, cy - 12 * k], [cx - 24 * k, cy - 30 * k], [cx - 8 * k, cy - 38 * k]], false, 6), "#ffffff", { w: 5 * k, shadow: 0, taper: [0.3, 0.4], seed: 310 + i });
  contour(g, s, 5 * k, 320 + i);
});
// le bouton « réécouter » : la même bulle, un haut-parleur encré et deux ondes
export const drawSpeaker = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 7, 44);
  g.group("plain", () => {
    const body = smooth([[cx - 20, cy - 8], [cx - 9, cy - 8], [cx + 3, cy - 19], [cx + 3, cy - 19], [cx + 3, cy + 19], [cx + 3, cy + 19], [cx - 9, cy + 8], [cx - 20, cy + 8]], true, 3);
    cel(g, body, "#ff7a5c", "#c64d3c", 3); contour(g, body, 3.4, 330);
    [[10, 9], [18, 17]].forEach(([dx, h], k) => ink(g, smooth([[cx + dx, cy - h], [cx + dx + h * 0.45, cy], [cx + dx, cy + h]], false, 6), INK, { w: 3.8, shadow: 0, taper: [0.25, 0.25], seed: 340 + k }));
  });
};
// le bouton « commencer » : la bulle, un triangle de lecture corail
export const drawPlay = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 8, 60);
  g.group("plain", () => { const t = smooth([[cx - 14, cy - 24], [cx - 14, cy - 24], [cx + 26, cy], [cx + 26, cy], [cx - 14, cy + 24], [cx - 14, cy + 24]], true, 3); cel(g, t, "#ff7a5c", "#c64d3c", 4); contour(g, t, 4, 350); });
};
// l'étiquette d'un nom (choix du nom de la pieuvre) : la bulle-réponse étirée en galet, sans texte (le
// nom est encré en direct)
export const NAME_W = 236, NAME_H = 104;
export const drawNameTag = (g: Gfx, cx: number, cy: number, i: number) => g.group("plain", () => {
  const w = NAME_W / 2, h = NAME_H / 2, r = h * 0.92, s = smooth([[cx - w + r, cy - h], [cx + w - r, cy - h - 2], [cx + w, cy - 4], [cx + w - r, cy + h], [cx - w + r, cy + h + 1], [cx - w, cy + 3]], true, 10);
  fillShape(g, shift(s, 8, 10), "#8d6f45", 0.35);
  cel(g, s, "#fffaf0", "#cfe6ea", 9, [smooth([[cx - w + 16, cy - 6], [cx - w + 30, cy - h + 12], [cx - w + 58, cy - h + 5]], false, 4), "#ffffff"]);
  ink(g, smooth([[cx - w + 14, cy - 4], [cx - w + 28, cy - h + 12], [cx - w + 56, cy - h + 4]], false, 6), "#ffffff", { w: 5, shadow: 0, taper: [0.3, 0.4], seed: 360 + i });
  contour(g, s, 5, 370 + i);
});
// le bilan des étoiles (récompense) : un grand galet-bulle et une grosse étoile de mer à gauche ; le
// nombre gagné est encré en direct à droite de l'étoile
export const TALLY_W = 380, TALLY_H = 190;
// l'ardoise de l'échauffement (« 5 + 2 = ? ») : le même galet, plus large, sans étoile
export const SLATE_W = 540, SLATE_H = 170;
export const drawSlate = (g: Gfx, cx: number, cy: number) => drawTally(g, cx, cy, SLATE_W, SLATE_H, false);
export const drawTally = (g: Gfx, cx: number, cy: number, W = TALLY_W, H = TALLY_H, star = true) => {
  g.group("plain", () => {
    const w = W / 2, h = H / 2, r = h * 0.9, s = smooth([[cx - w + r, cy - h], [cx + w - r, cy - h - 3], [cx + w, cy - 6], [cx + w - r, cy + h], [cx - w + r, cy + h + 2], [cx - w, cy + 4]], true, 12);
    fillShape(g, shift(s, 10, 13), "#0a3f49", 0.3);
    cel(g, s, "#fffaf0", "#cfe6ea", 12, [smooth([[cx - w + 30, cy - 12], [cx - w + 48, cy - h + 24], [cx - w + 90, cy - h + 13]], false, 4), "#ffffff"]);
    ink(g, smooth([[cx - w + 30, cy - 12], [cx - w + 48, cy - h + 24], [cx - w + 90, cy - h + 13]], false, 6), "#ffffff", { w: 6, shadow: 0, taper: [0.3, 0.4], seed: 395 });
    contour(g, s, 6, 396);
    if (!star) return;
    const c: P = [cx - w + 105, cy + 4], st = O.starShape(c, 64, 27, 0.12);
    fillShape(g, shift(st, 8, 10), "#8d6f45", 0.3);
    cel(g, st, "#ffc93a", "#e08d1c", 8);
    const rr = rng(17); for (let i = 0; i < 22; i++) { const a = rr() * 6.28, d = 6 + rr() * 34; fillShape(g, blob(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, 3, 3, 397 + i, 0.1, 6), "#fff0b8", 0.95); }
    contour(g, st, 4.6, 398);
  });
};
// le bouton « c'est bon » : la bulle, une coche verte encrée
export const drawCheck = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 9, 56);
  g.group("plain", () => {
    const c: P[] = smooth([[cx - 26, cy + 2], [cx - 9, cy + 20], [cx - 9, cy + 20], [cx + 27, cy - 22]], false, 6);
    ink(g, c.map(([x, y]) => [x + 4, y + 5] as P), "#0a3f49", { w: 19, shadow: 0, taper: [0.25, 0.3], seed: 380 }, 0.3);
    ink(g, c, INK, { w: 19, shadow: 0, taper: [0.2, 0.25], seed: 383 }); // le contour du feutre
    ink(g, c, "#2f9e5a", { w: 12, shadow: 0.45, taper: [0.25, 0.3], seed: 381 });
    ink(g, c.slice(0, Math.ceil(c.length * 0.4)).map(([x, y]) => [x - 1.5, y - 2] as P), "#7fd69a", { w: 3, shadow: 0, taper: [0.3, 0.3], seed: 382 });
  });
};
// « à demain » : la bulle, un croissant de lune jaune et une petite étoile (la séance du jour est faite)
export const drawMoon = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 10, 60);
  g.group("plain", () => {
    // le croissant : le disque de la lune moins un disque décalé vers le haut à droite. On suit le bord
    // extérieur hors du second disque, puis le bord du second disque à l'intérieur du premier.
    const c1: P = [cx - 5, cy + 3], R = 31, c2: P = [cx + 9, cy - 8], r = 27, pts: P[] = [];
    const inside = (p: P, c: P, rr: number) => Math.hypot(p[0] - c[0], p[1] - c[1]) < rr;
    const N = 96, on = (c: P, rr: number, a: number): P => [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)];
    // premier point du bord extérieur qui sort du second disque (en tournant dans le sens horaire)
    let k0 = 0; while (!(inside(on(c1, R, (2 * Math.PI * k0) / N), c2, r) && !inside(on(c1, R, (2 * Math.PI * (k0 + 1)) / N), c2, r))) k0++;
    for (let k = 1; k <= N; k++) { const p = on(c1, R, (2 * Math.PI * (k0 + k)) / N); if (inside(p, c2, r)) break; pts.push(p); }
    const back: P[] = []; for (let k = 0; k < N; k++) { const p = on(c2, r, (2 * Math.PI * k) / N); if (inside(p, c1, R)) back.push(p); }
    // le bord intérieur, parcouru à rebours de la fin du bord extérieur vers son début
    const end = pts[pts.length - 1], near = (q: P) => Math.hypot(q[0] - end[0], q[1] - end[1]);
    let j = back.reduce((bi, q, i) => (near(q) < near(back[bi]) ? i : bi), 0);
    const inner: P[] = []; for (let n = 0; n < back.length; n++) { inner.push(back[j]); j = (j - 1 + back.length) % back.length; }
    if (near(inner[inner.length - 1]) < near(inner[0])) inner.reverse();
    pts.push(...inner);
    const moon = smooth(pts, true, 1);
    fillShape(g, shift(moon, 4, 5), "#0a3f49", 0.25);
    cel(g, moon, "#ffd84a", "#e08d1c", 4);
    contour(g, moon, 3.6, 390);
    const st = O.starShape([cx + 22, cy - 18], 11, 5, 0.2);
    cel(g, st, "#ffe98a", "#e0a21c", 2); contour(g, st, 2.6, 391);
  });
};
// la touche « effacer » du pavé : la bulle, une flèche corail qui revient vers la gauche
export const drawEraseKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 11, 48);
  g.group("plain", () => {
    const a = smooth([[cx - 26, cy], [cx - 26, cy], [cx - 8, cy - 18], [cx - 8, cy - 18], [cx - 8, cy - 8], [cx - 8, cy - 8], [cx + 24, cy - 8], [cx + 24, cy - 8], [cx + 24, cy + 8], [cx + 24, cy + 8], [cx - 8, cy + 8], [cx - 8, cy + 8], [cx - 8, cy + 18], [cx - 8, cy + 18]], true, 3);
    fillShape(g, shift(a, 3, 4), "#0a3f49", 0.25); cel(g, a, "#ff7a5c", "#c64d3c", 3); contour(g, a, 3.4, 400);
  });
};
// le coquillage d'aide : une coquille Saint-Jacques rose (éventail côtelé, deux oreilles à la charnière)
export const drawShell = (g: Gfx, cx: number, cy: number, k = 1) => g.group("plain", () => {
  const hinge: P = [cx, cy + 24 * k], R = 34 * k, a0 = -Math.PI * 0.86, a1 = -Math.PI * 0.14, n = 7, edge: P[] = [];
  // le bord : une vague par côte
  for (let i = 0; i <= n * 6; i++) { const t = i / (n * 6), a = a0 + (a1 - a0) * t, r = R * (1 + 0.07 * Math.abs(Math.sin(Math.PI * n * t))); edge.push([hinge[0] + Math.cos(a) * r, hinge[1] - 8 * k + Math.sin(a) * r]); }
  const fan: P[] = [...edge, [hinge[0] + 9 * k, hinge[1] + 1], [hinge[0] - 9 * k, hinge[1] + 1]];
  const ears: P[] = smooth([[hinge[0] - 20 * k, hinge[1] - 7 * k], [hinge[0] + 20 * k, hinge[1] - 7 * k], [hinge[0] + 17 * k, hinge[1] + 5 * k], [hinge[0] - 17 * k, hinge[1] + 5 * k]], true, 3);
  fillShape(g, shift(fan, 4 * k, 5 * k), "#0a3f49", 0.25);
  cel(g, ears, "#ffc2a6", "#d9785a", 3 * k); contour(g, ears, 3 * k, 410);
  const f = smooth(fan, true, 2); cel(g, f, "#ffb896", "#dd7a5c", 6 * k);
  for (let i = 1; i < n; i++) { const a = a0 + ((a1 - a0) * i) / n; ink(g, [[hinge[0] + Math.cos(a) * 7 * k, hinge[1] - 4 * k + Math.sin(a) * 7 * k], [hinge[0] + Math.cos(a) * R * 0.95, hinge[1] - 8 * k + Math.sin(a) * R * 0.95]], "#b8583f", { w: 2.4 * k, shadow: 0, taper: [0.4, 0.2], seed: 411 + i }); }
  contour(g, f, 3.6 * k, 420);
});
export const drawShellKey = (g: Gfx, cx: number, cy: number) => { drawAnswerBubble(g, cx, cy, 12, 52); drawShell(g, cx, cy - 2, 1); };
// les boutons des leçons animées : « phrase précédente » (une flèche jaune qui revient en arrière,
// butée comprise, comme sur un lecteur) et « rejouer » (une flèche corail qui fait le tour)
export const drawBackKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 13, 52);
  g.group("plain", () => {
    const bar: P[] = [[cx - 24, cy - 19], [cx - 15, cy - 19], [cx - 15, cy + 19], [cx - 24, cy + 19]];
    const tri: P[] = [[cx + 23, cy - 22], [cx + 23, cy + 22], [cx - 12, cy]];
    [bar, tri].forEach((s, k) => { fillShape(g, shift(s, 3, 4), "#0a3f49", 0.25); cel(g, s, "#ffd84a", "#e08d1c", 3); contour(g, s, 3.4, 430 + k); });
  });
};
export const drawReplayKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 14, 52);
  g.group("plain", () => {
    // un anneau ouvert en haut (de -55° à 215°, dans le sens des aiguilles d'une montre) ; la pointe, au
    // bout de droite, repart dans l'autre sens : elle court après sa queue
    const R = 19, w = 5.5, a0 = (-55 * Math.PI) / 180, a1 = (215 * Math.PI) / 180, N = 30, out: P[] = [], inn: P[] = [];
    for (let i = 0; i <= N; i++) { const a = a0 + ((a1 - a0) * i) / N; out.push([cx + Math.cos(a) * (R + w), cy + 3 + Math.sin(a) * (R + w)]); inn.push([cx + Math.cos(a) * (R - w), cy + 3 + Math.sin(a) * (R - w)]); }
    const ring = [...out, ...inn.reverse()];
    const e: P = [cx + Math.cos(a0) * R, cy + 3 + Math.sin(a0) * R], t: P = [Math.sin(a0), -Math.cos(a0)], n: P = [Math.cos(a0), Math.sin(a0)];
    const head: P[] = [[e[0] + n[0] * 14 + t[0] * 2, e[1] + n[1] * 14 + t[1] * 2], [e[0] + t[0] * 19, e[1] + t[1] * 19], [e[0] - n[0] * 14 + t[0] * 2, e[1] - n[1] * 14 + t[1] * 2]];
    [ring, head].forEach((s) => fillShape(g, shift(s, 3, 4), "#0a3f49", 0.25));
    cel(g, ring, "#ff7a5c", "#c64d3c", 3); cel(g, head, "#ff7a5c", "#c64d3c", 3);
    contour(g, ring, 3.2, 440); contour(g, head, 3.2, 441);
  });
};
