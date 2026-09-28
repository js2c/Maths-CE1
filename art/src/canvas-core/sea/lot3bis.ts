// LOT 3 BIS, PARTIE B (docs/SPEC-LOT3BIS.md, B8 ; constats R13 à R24 de docs/RECETTE-LOT3.md) : ce qui est fabriqué à
// l'avance pour les écrans que le lot corrige. Même main que le reste (oceanMarker.ts) : aplats, une ombre nette, contour
// épais qui s'épaissit du côté de l'ombre, lumière en haut à gauche.
//   - le bouton de la LÉGENDE (un petit livre ouvert couvert de lignes d'écriture, dans une bulle plus petite et plus pâle
//     que les boutons de l'enfant : il est pour le parent) et la CROIX qui ferme le panneau ;
//   - « JE NE SAIS PAS » : la pieuvre qui hausse les bras (R23 : l'ancien « ? » se confondait avec celui des questions) ;
//   - le COQUILLAGE D'AIDE : un triton en spirale bleu-violet (R23 : il ressemblait au coquillage rose de la récompense) ;
//   - les POISSONS DES MAISONS (B5) : un petit poisson par unité, orange pour le premier nombre, bleu pour le second ;
//   - le POISSON PORTEUR D'ÉTIQUETTE du format « placer » (B7) : il tient dans sa bouche le fil d'une étiquette de nacre en
//     goutte, dont la pointe touche la ligne là où il est posé ; l'application écrit le nombre dans l'étiquette ;
//   - la TRAÎNÉE d'une étoile arc-en-ciel qui vole vers l'album (B6) ;
//   - le GRAND DRAPEAU du record, qui flotte à la fin du défi (B6) ;
//   - le FILET HAUT de la leçon L2 (B9) : dix poissons en deux colonnes, pendu sous la corde entre deux bouées géantes ;
//   - les ONGLETS DE ZONE de l'album (R23 : ils étaient dessinés comme des cartes) : un médaillon rond par zone.
import { rng, type Gfx, type P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, FISHC, INK, shift } from "../oceanMarker";
import { drawAnswerBubble } from "./decor";
import { rrect } from "./treasure";

const SH = "#0a3f49", NACRE = "#fffaf0", NACRE_S = "#e3d6bb", CORAL = "#ff7a5c", CORAL_S = "#c64d3c", TAU = Math.PI * 2;
const shadowed = (g: Gfx, s: P[], lit: string, shade: string, w: number, seed: number, k = 3, d: P = [3, 4]) => { fillShape(g, shift(s, d[0], d[1]), SH, 0.25); cel(g, s, lit, shade, k); contour(g, s, w, seed); };
// une capsule (bout rond) de a à b, demi-épaisseur r
const capsule = (a: P, b: P, r: number): P[] => { const th = Math.atan2(b[1] - a[1], b[0] - a[0]), out: P[] = []; for (let i = 0; i <= 10; i++) { const t = th + Math.PI / 2 + (Math.PI * i) / 10; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]); } for (let i = 0; i <= 10; i++) { const t = th - Math.PI / 2 + (Math.PI * i) / 10; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]); } return out; };

// ---------------------------------------------------------------- la légende (pour le parent)
export const LEGEND_R = 40;
export const drawLegendKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 31, LEGEND_R);
  g.group("plain", () => {
    const w = 25, h = 16, sag = 4;
    const cover = smooth([[cx - w - 4, cy - h + 4], [cx, cy - h + 6], [cx + w + 4, cy - h + 4], [cx + w + 4, cy + h + 4], [cx, cy + h + 8], [cx - w - 4, cy + h + 4]], true, 4);
    fillShape(g, shift(cover, 2, 3), SH, 0.25); cel(g, cover, "#8fa9b0", "#5e7c85", 2); contour(g, cover, 2.4, 8000);
    [-1, 1].forEach((sd, i) => {
      const page = smooth([[cx, cy - h + sag], [cx + sd * w * 0.5, cy - h - 1], [cx + sd * w, cy - h + 1], [cx + sd * w, cy + h], [cx + sd * w * 0.5, cy + h - 2], [cx, cy + h + 3]], true, 4);
      cel(g, page, NACRE, NACRE_S, 1.6); contour(g, page, 1.8, 8001 + i);
      // des lignes d'écriture (grises : c'est du texte, pas un dessin de leçon)
      for (let k = 0; k < 4; k++) { const y = cy - h + 7 + k * 6.5, x0 = cx + sd * 4, x1 = cx + sd * (w - 4 - (k === 3 ? 8 : 0)); ink(g, [[x0, y + 1], [x1, y]], "#7d8f95", { w: 1.5, shadow: 0, taper: [0.2, 0.2], seed: 8004 + i * 5 + k }, 0.9); }
    });
    ink(g, [[cx, cy - h + sag], [cx, cy + h + 3]], mix(NACRE_S, INK, 0.4), { w: 1.5, shadow: 0, taper: [0.2, 0.2], seed: 8015 });
  });
};
// la croix qui ferme le panneau : deux barres corail en croix, dans une bulle blanche bien visible
export const drawCloseKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 32, 48);
  g.group("plain", () => {
    const d = 17, r = 6.5, a = capsule([cx - d, cy - d], [cx + d, cy + d], r), b = capsule([cx + d, cy - d], [cx - d, cy + d], r);
    [a, b].forEach((s) => fillShape(g, shift(s, 3, 4), SH, 0.25));
    cel(g, b, CORAL, CORAL_S, 2.5); contour(g, b, 3, 8020);
    cel(g, a, CORAL, CORAL_S, 2.5); contour(g, a, 3, 8021);
  });
};

// ---------------------------------------------------------------- « je ne sais pas » : la pieuvre hausse les bras
export const drawShrugKey = (g: Gfx, cx: number, cy: number) => {
  drawAnswerBubble(g, cx, cy, 33, 54);
  g.group("plain", () => {
    const L = "#ff9c7c", M = "#f2765a", S = "#c64d3c", my = cy - 6;
    // quatre bouts de bras sous le manteau, posés
    [-15, -5, 5, 15].forEach((dx, i) => { const arm = O.taper(smooth([[cx + dx * 0.6, my + 12], [cx + dx, my + 22], [cx + dx * 1.3 + (i < 2 ? -3 : 3), my + 29]], false, 5), (u) => 5.2 * (1 - 0.6 * u)).outline; cel(g, arm, M, S, 1.5); contour(g, arm, 2, 8030 + i); });
    // les deux bras levés de chaque côté, paumes vers le ciel : « je ne sais pas »
    [-1, 1].forEach((sd, i) => {
      const arm = O.taper(smooth([[cx + sd * 14, my + 6], [cx + sd * 27, my + 4], [cx + sd * 34, my - 8], [cx + sd * 36, my - 19], [cx + sd * 31, my - 23]], false, 6), (u) => 5.6 * (1 - 0.55 * u)).outline;
      fillShape(g, shift(arm, 2, 3), SH, 0.25); cel(g, arm, M, S, 1.6); contour(g, arm, 2.1, 8034 + i);
    });
    // le manteau, un peu penché, les yeux levés vers le haut et un sourcil relevé
    const mantle = blob(cx, my - 2, 17, 15, 8040, 0.04, 18, 0.05);
    fillShape(g, shift(mantle, 2.5, 3.5), SH, 0.25);
    cel(g, mantle, L, S, 3, [blob(cx - 6, my - 10, 6, 3, 8041, 0.05, 10, -0.4), "#ffc0b2"]);
    contour(g, mantle, 2.6, 8042);
    [-6, 6].forEach((dx, i) => { const e = blob(cx + dx, my, 4.6, 5.4, 8043 + i, 0.02, 12); fillShape(g, e, "#fffaf0"); ink(g, e, INK, { w: 1.3, closed: true, shadow: 0.3, seed: 8045 + i }); fillShape(g, blob(cx + dx + 1, my - 2.2, 2.3, 2.6, 8047 + i, 0.02, 8), INK); fillShape(g, blob(cx + dx + 0.2, my - 3.2, 0.8, 0.8, 8049 + i, 0, 6), "#ffffff"); });
    ink(g, smooth([[cx - 9, my - 9], [cx - 6, my - 11], [cx - 3, my - 10]], false, 4), INK, { w: 1.4, shadow: 0, taper: [0.3, 0.3], seed: 8051 });
    ink(g, smooth([[cx + 3, my - 11], [cx + 6, my - 13.5], [cx + 9, my - 12]], false, 4), INK, { w: 1.4, shadow: 0, taper: [0.3, 0.3], seed: 8052 });
    // la bouche : une petite moue ondulée
    ink(g, smooth([[cx - 4, my + 8], [cx - 1.5, my + 6.8], [cx + 1.5, my + 8.2], [cx + 4, my + 7]], false, 5), INK, { w: 1.4, shadow: 0, taper: [0.3, 0.3], seed: 8053 });
  });
};

// ---------------------------------------------------------------- le coquillage d'aide : un triton en spirale
const CONCH = "#9fb4f0", CONCH_S = "#5f6fc0", CONCH_L = "#d4defc", LIP = "#ffe6d6", LIP_S = "#e0a88e";
export const drawConch = (g: Gfx, cx: number, cy: number, k = 1) => g.group("plain", () => {
  // la coquille, couchée, pointe en haut à droite, ouverture en bas à gauche
  const body = smooth([[cx - 26 * k, cy + 6 * k], [cx - 20 * k, cy - 12 * k], [cx - 4 * k, cy - 20 * k], [cx + 12 * k, cy - 22 * k], [cx + 24 * k, cy - 30 * k], [cx + 30 * k, cy - 34 * k], [cx + 28 * k, cy - 24 * k], [cx + 26 * k, cy - 8 * k], [cx + 18 * k, cy + 10 * k], [cx + 2 * k, cy + 22 * k], [cx - 16 * k, cy + 22 * k]], true, 6);
  fillShape(g, shift(body, 3 * k, 4 * k), SH, 0.28);
  cel(g, body, CONCH, CONCH_S, 4 * k, [smooth([[cx - 16 * k, cy - 8 * k], [cx - 2 * k, cy - 16 * k], [cx + 14 * k, cy - 18 * k], [cx - 2 * k, cy - 10 * k]], true, 4), CONCH_L]);
  // les tours de la spirale : des bourrelets qui s'enroulent vers la pointe
  clipped(g, body, () => { [[-8, 0.5], [6, 0.38], [17, 0.26], [25, 0.15]].forEach(([dx, r], i) => ink(g, smooth([[cx + (dx - 14 * r) * k, cy + (-6 + 30 * r) * k], [cx + dx * k, cy + (-16 - 2 * r * 10) * k + 12 * r * k], [cx + (dx + 14 * r) * k, cy + (-10 + 10 * r) * k]], false, 6), CONCH_S, { w: 2.2 * k, shadow: 0, taper: [0.2, 0.2], seed: 8060 + i }, 0.9)); });
  // l'ouverture nacrée, crème et rose, en bas à gauche
  const lip = smooth([[cx - 24 * k, cy + 4 * k], [cx - 14 * k, cy - 4 * k], [cx + 2 * k, cy + 2 * k], [cx + 6 * k, cy + 14 * k], [cx - 8 * k, cy + 20 * k], [cx - 20 * k, cy + 16 * k]], true, 5);
  cel(g, lip, LIP, LIP_S, 2.5 * k); ink(g, smooth([[cx - 18 * k, cy + 8 * k], [cx - 8 * k, cy + 4 * k], [cx - 2 * k, cy + 12 * k]], false, 5), "#c67f6a", { w: 1.8 * k, shadow: 0, taper: [0.3, 0.3], seed: 8066 }, 0.9);
  contour(g, lip, 2 * k, 8067);
  contour(g, body, 3 * k, 8068);
  // une petite étincelle : l'aide « éclaire »
  const st = O.starShape([cx - 26 * k, cy - 22 * k], 8 * k, 3 * k, 0); cel(g, st, "#fff6b0", "#e0b03a", 1); ink(g, st, INK, { w: 1.4 * k, closed: true, shadow: 0.3, seed: 8069 });
});
export const drawHintKey = (g: Gfx, cx: number, cy: number) => { drawAnswerBubble(g, cx, cy, 12, 52); drawConch(g, cx + 2, cy + 4, 1); };

// ---------------------------------------------------------------- un petit poisson (maisons, filets)
// orange (0) ou bleu (1), vers la droite, la queue au repos ; une boucle de nage n'a pas de sens à cette taille
export const HOUSE_FISH: [string, string][] = [["#ff9a3d", "#cf5a0e"], ["#5cb8f0", "#2a78b8"]];
export const drawSmallFish = (g: Gfx, cx: number, cy: number, len: number, pal: [string, string], seed: number, wag = 0) => g.group("plain", () => {
  const s = O.fishShape({ c: [cx, cy], len, dir: 1, tilt: 0, color: 0, wag } as O.Fish), w = Math.max(1.6, len / 20);
  fillShape(g, shift(s.body, len / 18, len / 14), SH, 0.25);
  [s.tail, s.fin].forEach((p, q) => { cel(g, p, pal[0], pal[1], len / 25); contour(g, p, w * 0.8, seed + q); });
  cel(g, s.body, pal[0], pal[1], len / 16);
  clipped(g, s.body, () => fillShape(g, s.stripe, "#fffaf0"));
  fillShape(g, blob(s.eye[0], s.eye[1], s.eyeR, s.eyeR, seed + 3, 0.05, 10), INK); fillShape(g, blob(s.eye[0] - s.eyeR * 0.3, s.eye[1] - s.eyeR * 0.35, s.eyeR * 0.4, s.eyeR * 0.4, seed + 4, 0.05, 8), "#ffffff");
  contour(g, s.body, w, seed + 5);
});

// ---------------------------------------------------------------- le poisson porteur d'étiquette (« placer »)
// Ancrage : la pointe de l'étiquette (elle touche la ligne à la graduation où le poisson est posé). TAG : le centre de
// l'étiquette par rapport à l'ancrage, sa largeur et sa hauteur ; l'application y écrit le nombre.
export const TAG = { cx: 0, cy: -52, w: 92, h: 60 }, TAG_FISH_N = 12;
export const drawTagFish = (g: Gfx, f: number, ax: number, ay: number) => {
  const wag = 0.3 * Math.sin((TAU * f) / TAG_FISH_N), tx = ax + TAG.cx, ty = ay + TAG.cy, fy = ty - TAG.h / 2 - 40, fx = tx - 34;
  const s = O.fishShape({ c: [fx, fy], len: 96, dir: 1, tilt: -0.06, color: 0, wag } as O.Fish), [lit, sh] = FISHC[0];
  const mouth = s.mouth[Math.floor(s.mouth.length / 2)], top: P = [tx, ty - TAG.h / 2 + 5], sway = 3 * Math.sin((TAU * f) / TAG_FISH_N);
  // le fil, de la bouche du poisson à l'œillet de l'étiquette (il se balance un peu avec la nage) : sous le poisson
  g.group("plain", () => {
    const thread = smooth([mouth, [(mouth[0] + top[0]) / 2 + 8 + sway, (mouth[1] + top[1]) / 2], top], false, 6);
    ink(g, thread, "#fffaf0", { w: 4.2, shadow: 0, taper: [0.2, 0.2], seed: 8099 }, 0.7); ink(g, thread, INK, { w: 2.2, shadow: 0, taper: [0.2, 0.2], seed: 8100 });
  });
  // l'étiquette de nacre en goutte : ronde en haut, pointue en bas (la pointe dit « ici »)
  g.group("plain", () => {
    const w = TAG.w / 2, h = TAG.h / 2, tag = smooth([[tx - w + 10, ty - h], [tx + w - 10, ty - h], [tx + w, ty - h + 10], [tx + w, ty + h - 14], [tx + w - 10, ty + h - 4], [tx + 12, ty + h], [ax, ay], [tx - 12, ty + h], [tx - w + 10, ty + h - 4], [tx - w, ty + h - 14], [tx - w, ty - h + 10]], true, 4);
    shadowed(g, tag, NACRE, NACRE_S, 3.4, 8101, 4, [4, 5]);
    ink(g, smooth([[tx - w + 8, ty - h + 7], [tx - 6, ty - h + 5]], false, 4), "#ffffff", { w: 3, shadow: 0, taper: [0.3, 0.3], seed: 8102 }, 0.9);
    const eye = blob(tx, ty - h + 5, 3.4, 3.4, 8103, 0.05, 10); fillShape(g, eye, "#c9b48f"); ink(g, eye, INK, { w: 1.4, closed: true, shadow: 0, seed: 8104 });
  });
  // le poisson, au-dessus, qui tient le fil dans sa bouche
  g.group("plain", () => {
    fillShape(g, shift(s.body, 5, 7), SH, 0.25);
    [s.tail, s.fin].forEach((p, q) => { cel(g, p, lit, sh, 3); contour(g, p, 3, 8110 + q); });
    cel(g, s.body, lit, sh, 5, [blob(fx - 12, fy - 12, 16, 5, 8112, 0.1, 8, -0.1), mix(lit, "#ffffff", 0.35)]);
    clipped(g, s.body, () => { fillShape(g, s.stripe, "#fffaf0"); ink(g, s.stripe, INK, { w: 1.8, closed: true, shadow: 0, seed: 8113 }); });
    fillShape(g, blob(s.eye[0], s.eye[1], s.eyeR, s.eyeR, 8114, 0.05, 10), INK); fillShape(g, blob(s.eye[0] - s.eyeR * 0.3, s.eye[1] - s.eyeR * 0.35, s.eyeR * 0.38, s.eyeR * 0.38, 8115, 0.05, 8), "#ffffff");
    ink(g, s.mouth, mix(sh, INK, 0.5), { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 8116 }, 0.9);
    contour(g, s.body, 4, 8117);
    // le bout du fil, pincé entre les lèvres
    fillShape(g, blob(mouth[0], mouth[1], 2.6, 2.6, 8118, 0.05, 8), INK);
  });
};

// ---------------------------------------------------------------- la traînée d'une étoile arc-en-ciel qui vole
// Une comète de lumière : cinq rubans des couleurs de l'étoile qui s'amincissent vers l'arrière, et quelques étincelles.
// Ancrage : la tête (là où l'application pose l'étoile) ; elle file vers la gauche ; l'application la tourne dans le sens du vol.
export const TRAIL_W = 190, TRAIL_H = 70;
export const drawStarTrail = (g: Gfx, hx: number, hy: number) => g.group("plain", () => {
  const cols = ["#ff5a5a", "#ff9e3d", "#ffd84a", "#5ccf6a", "#4aa8ff"], r = rng(8130);
  cols.forEach((c, i) => {
    const dy = (i - 2) * 8, pts: P[] = Array.from({ length: 12 }, (_, k) => { const t = k / 11; return [hx - 10 - t * (TRAIL_W - 40), hy + dy * (1 - t * 0.7) + Math.sin(t * 5 + i) * 3 * t] as P; });
    ink(g, pts, c, { w: 11 - 1.5 * Math.abs(i - 2), shadow: 0, taper: [0.02, 0.9], seed: 8131 + i }, 0.85);
  });
  for (let i = 0; i < 6; i++) { const x = hx - 30 - r() * (TRAIL_W - 60), y = hy + (r() - 0.5) * 34, s = 3 + r() * 5, st = O.starShape([x, y], s, s * 0.4, r()); fillShape(g, st, "#fff6c8"); ink(g, st, "#ffd84a", { w: 1.2, closed: true, shadow: 0, seed: 8140 + i }, 0.9); }
});

// ---------------------------------------------------------------- le grand drapeau du record (fin du défi)
// Le drapeau rouge du défi, en grand, sur un mât planté dans une petite motte de sable ; il flotte (FLAG_N images en
// boucle, l'onde court du mât vers le bout) ; une étoile d'or à la pointe du mât. Ancrage : le pied du mât.
export const FLAG_N = 8;
export const drawBigFlag = (g: Gfx, x: number, y: number, f: number) => g.group("plain", () => {
  const H = 150, ph = (TAU * f) / FLAG_N;
  const mound = smooth([[x - 38, y + 6], [x - 20, y - 8], [x + 20, y - 8], [x + 38, y + 6]], true, 4); fillShape(g, shift(mound, 3, 4), SH, 0.2); cel(g, mound, "#f1d79f", "#d8b577", 3); contour(g, mound, 2.6, 8150);
  const pole: P[] = [[x - 4, y - 2], [x - 4, y - H], [x + 4, y - H], [x + 4, y - 2]];
  fillShape(g, shift(pole, 4, 4), SH, 0.3); cel(g, pole, "#b98552", "#8a5d34", 2.5); contour(g, pole, 3, 8151);
  // le drapeau : bord haut et bord bas ondulés, l'onde part du mât
  const top: P[] = [], bot: P[] = [], L = 96, Hh = 58;
  for (let k = 0; k <= 12; k++) { const t = k / 12, wv = Math.sin(t * 5 - ph) * 7 * t; top.push([x + 4 + t * L, y - H + 4 + wv + t * 6]); bot.push([x + 4 + t * L * 0.94, y - H + 4 + Hh + wv - t * 4]); }
  const flag = smooth([...top, [x + 4 + L * 0.8, y - H + 4 + Hh / 2 + Math.sin(5 - ph) * 7], ...bot.reverse()], true, 3);
  fillShape(g, shift(flag, 5, 6), SH, 0.28); cel(g, flag, "#e8513f", "#b23a2e", 5);
  clipped(g, flag, () => { const st = O.starShape([x + 42, y - H + 34 + Math.sin(2 - ph) * 3], 14, 6, 0.2); cel(g, st, "#ffd84a", "#e08d1c", 2); ink(g, st, INK, { w: 1.8, closed: true, shadow: 0.4, seed: 8152 }); });
  contour(g, flag, 3.2, 8153);
  const knob = O.starShape([x, y - H - 10], 13, 5.6, 0.2); cel(g, knob, "#ffd84a", "#e08d1c", 2); contour(g, knob, 2.4, 8154);
});

// ---------------------------------------------------------------- le filet haut de la leçon L2
// Dix poissons jaunes en deux colonnes de cinq, dans un sac de mailles pendu par son nœud (ancrage : le nœud, en haut au
// milieu) ; assez étroit pour tenir entre deux bouées géantes, assez grand pour qu'on voie chaque poisson sur la tablette.
export const NETV_W = 100, NETV_H = 196;
export const drawTallNet = (g: Gfx, cx: number, top: number) => {
  const x0 = cx - NETV_W / 2, y0 = top + 12, x1 = cx + NETV_W / 2, y1 = top + NETV_H, bag = smooth([[x0 + 10, y0], [x1 - 10, y0], [x1, y0 + 14], [x1 + 2, y1 - 30], [x1 - 12, y1 - 4], [cx, y1 + 4], [x0 + 12, y1 - 4], [x0 - 2, y1 - 30], [x0, y0 + 14]], true, 5);
  // le fond du sac (l'eau vue à travers, un peu plus sombre), puis les poissons, puis les mailles et le cordage par-dessus
  g.group("plain", () => { fillShape(g, shift(bag, 5, 6), SH, 0.25); fillShape(g, bag, "#0f6f7c", 0.4); });
  for (let i = 0; i < 10; i++) drawSmallFish(g, cx + (i % 2 ? 23 : -21), y0 + 22 + Math.floor(i / 2) * 34, 34, ["#ffd84a", "#e08d1c"], 8160 + i * 7);
  g.group("plain", () => {
    clipped(g, bag, () => { for (let x = x0 - 200; x < x1 + 10; x += 20) { ink(g, [[x, y0], [x + 200, y1 + 10]], "#f3e6c8", { w: 1.1, shadow: 0, taper: [0.05, 0.05], seed: 8240 + x }, 0.32); ink(g, [[x + 200, y0], [x, y1 + 10]], "#f3e6c8", { w: 1.1, shadow: 0, taper: [0.05, 0.05], seed: 8540 + x }, 0.32); } });
    ink(g, bag, "#8a6238", { w: 3.6, closed: true, shadow: 0.35, seed: 8260 });
    // la ralingue du haut et le nœud
    ink(g, [[x0 + 6, y0 + 2], [x1 - 6, y0 + 2]], "#c89c62", { w: 5, shadow: 0.4, seed: 8261 });
    const knot = blob(cx, top + 4, 6, 5, 8262, 0.05, 10); cel(g, knot, "#c89c62", "#8a6238", 1.5); contour(g, knot, 2, 8263);
  });
};

// ---------------------------------------------------------------- les onglets de zone de l'album
// Un médaillon rond par zone (pas une carte) : le lagon (une île et son palmier), le récif de corail (une branche de
// corail), le grand large (une vague et la queue d'une baleine), les abysses (un poisson-lanterne dans le noir).
export const ZONE_TAB_R = 44;
const ZONE_BG: Record<string, [string, string]> = { lagon: ["#7fe0e0", "#35b3c1"], corail: ["#ffb8a8", "#e47a64"], large: ["#5aa8e0", "#2a6fb0"], abysses: ["#3a4a78", "#1c2548"] };
export const drawZoneTab = (g: Gfx, cx: number, cy: number, zone: string) => g.group("plain", () => {
  const R = ZONE_TAB_R, disc = blob(cx, cy, R, R, 8300, 0.015, 24), [lit, sh] = ZONE_BG[zone] ?? ZONE_BG.lagon;
  fillShape(g, shift(disc, 5, 6), SH, 0.3);
  cel(g, disc, lit, sh, 6);
  clipped(g, disc, () => ({ lagon: tabLagoon, corail: tabCoral, large: tabOpen, abysses: tabDeep } as Record<string, (g: Gfx, cx: number, cy: number) => void>)[zone]?.(g, cx, cy));
  ink(g, blob(cx, cy, R - 5, R - 5, 8301, 0.015, 24), "#ffffff", { w: 2, closed: true, shadow: 0, seed: 8302 }, 0.5);
  contour(g, disc, 4, 8303);
});
const tabLagoon = (g: Gfx, cx: number, cy: number) => {
  const sand = smooth([[cx - 50, cy + 18], [cx - 16, cy + 6], [cx + 20, cy + 8], [cx + 50, cy + 20], [cx + 50, cy + 50], [cx - 50, cy + 50]], true, 5); cel(g, sand, "#fbe9c0", "#d8b577", 3); contour(g, sand, 2.2, 8310);
  const trunk = O.taper(smooth([[cx - 2, cy + 10], [cx + 4, cy - 8], [cx + 12, cy - 22]], false, 6), (u) => 4.5 * (1 - 0.4 * u)).outline; cel(g, trunk, "#c89c62", "#8a6238", 2); contour(g, trunk, 2.2, 8311);
  [[-1.1, 26], [-0.4, 24], [0.3, 24], [0.9, 20], [-1.9, 20]].forEach(([a, len], i) => { const b: P = [cx + 12, cy - 22], e: P = [b[0] + Math.cos(a - Math.PI / 2 + 0.2) * len, b[1] + Math.sin(a - Math.PI / 2 + 0.2) * len * 0.8 + 6], leaf = O.taper(smooth([b, [(b[0] + e[0]) / 2, (b[1] + e[1]) / 2 - 5], e], false, 6), (u) => 5 * Math.sin(Math.PI * Math.min(0.98, u + 0.05))).outline; cel(g, leaf, "#6cc96a", "#3a9a4c", 2); contour(g, leaf, 1.8, 8312 + i); });
  const st = O.starShape([cx - 22, cy + 24], 9, 4, 0.3); cel(g, st, "#ffc93a", "#e08d1c", 1.5); contour(g, st, 1.8, 8318);
};
const tabCoral = (g: Gfx, cx: number, cy: number) => {
  const base: P = [cx, cy + 34], br = (pts: P[], w: number, seed: number) => { const t = O.taper(smooth(pts, false, 5), (u) => w * (1 - 0.5 * u)).outline; cel(g, t, "#ff7a8a", "#c84a5e", 2); contour(g, t, 2.2, seed); };
  br([base, [cx - 2, cy + 8], [cx - 12, cy - 14], [cx - 16, cy - 30]], 8, 8320); br([[cx - 2, cy + 8], [cx + 12, cy - 8], [cx + 16, cy - 26]], 6.5, 8321); br([[cx - 10, cy - 8], [cx - 26, cy - 14], [cx - 30, cy - 26]], 5, 8322); br([[cx + 10, cy - 6], [cx + 26, cy - 4], [cx + 30, cy - 16]], 4.5, 8323);
  const f = O.fishShape({ c: [cx + 18, cy + 18], len: 24, dir: -1, tilt: 0, color: 1, wag: 0 } as O.Fish); cel(g, f.tail, "#ffd84a", "#e0a21c", 1); cel(g, f.body, "#ffd84a", "#e0a21c", 1.5); fillShape(g, blob(f.eye[0], f.eye[1], 1.6, 1.6, 8324, 0.05, 8), INK); contour(g, f.body, 1.6, 8325); contour(g, f.tail, 1.2, 8326);
};
const tabOpen = (g: Gfx, cx: number, cy: number) => {
  const wave = smooth([[cx - 50, cy + 12], [cx - 30, cy + 4], [cx - 12, cy + 12], [cx + 8, cy + 4], [cx + 28, cy + 12], [cx + 50, cy + 4], [cx + 50, cy + 50], [cx - 50, cy + 50]], true, 6); cel(g, wave, "#2f8ac8", "#1c5a90", 3); ink(g, smooth([[cx - 44, cy + 10], [cx - 30, cy + 5], [cx - 14, cy + 11]], false, 5), "#e8fffb", { w: 2.4, shadow: 0, taper: [0.2, 0.2], seed: 8330 }, 0.9); contour(g, wave, 2.2, 8331);
  // la queue de la baleine qui sort de l'eau
  const tail = smooth([[cx - 3, cy + 10], [cx - 2, cy - 2], [cx - 10, cy - 10], [cx - 26, cy - 16], [cx - 32, cy - 26], [cx - 18, cy - 24], [cx - 6, cy - 18], [cx + 4, cy - 12], [cx + 14, cy - 18], [cx + 26, cy - 24], [cx + 40, cy - 26], [cx + 34, cy - 16], [cx + 18, cy - 10], [cx + 10, cy - 2], [cx + 11, cy + 10]], true, 4);
  fillShape(g, shift(tail, 3, 4), SH, 0.25); cel(g, tail, "#6a7fa8", "#3c4c74", 3); contour(g, tail, 2.4, 8332);
  [[-30, -34], [40, -34]].forEach(([dx, dy], i) => fillShape(g, blob(cx + dx, cy + dy, 2.4, 2.4, 8333 + i, 0.05, 8), "#e8fffb", 0.9));
};
const tabDeep = (g: Gfx, cx: number, cy: number) => {
  for (let i = 3; i >= 1; i--) fillShape(g, blob(cx - 18, cy - 20, 6 + i * 6, 6 + i * 6, 8340 + i, 0.02, 16), "#fff6b0", 0.12);
  const f = O.fishShape({ c: [cx + 4, cy + 4], len: 52, dir: -1, tilt: 0.05, color: 0, wag: 0 } as O.Fish);
  cel(g, f.tail, "#5a4a7a", "#342848", 2); cel(g, f.body, "#6a5a8e", "#3a2c58", 3);
  // les dents de la baudroie et sa lanterne
  ink(g, smooth([[cx - 16, cy + 6], [cx - 20, cy - 10], [cx - 18, cy - 20]], false, 5), "#8a7aa8", { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 8345 });
  const lamp = blob(cx - 18, cy - 20, 4.5, 4.5, 8346, 0.05, 10); fillShape(g, lamp, "#fff6b0"); ink(g, lamp, "#ffd84a", { w: 1.4, closed: true, shadow: 0, seed: 8347 });
  fillShape(g, blob(f.eye[0], f.eye[1], 3, 3, 8348, 0.05, 8), "#ffe8a0"); fillShape(g, blob(f.eye[0], f.eye[1], 1.4, 1.4, 8349, 0.05, 8), INK);
  contour(g, f.body, 2.4, 8350); contour(g, f.tail, 2, 8351);
};
