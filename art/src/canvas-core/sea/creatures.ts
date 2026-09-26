// LES CRÉATURES DU LAGON · 15 cartes (docs/SPEC.md, « Coquillages et cartes » ; app/content/cartes.json).
// Chaque créature est un module dessiné une fois ; l'application les pose dans le récif (boucles de
// 12 images à 8 images/s : 1,5 s, sans raccord) et, tant que l'illustration générée de la carte n'existe
// pas, sur la carte elle-même (illustration provisoire).
//
// Réalisme (craft bar, `references/realism-and-craft.md`) : aucune photographie n'a été ouverte ; chaque
// animal suit l'anatomie connue de l'espèce la plus courante de son nom, simplifiée pour un enfant de
// 7 ans mais sans rien d'inventé. Les parties nommées sont listées au-dessus de chaque dessin.
// Même main que la pieuvre et la tortue (oceanMarker.ts) : aplats, une ombre nette par forme, contour qui
// s'épaissit à l'opposé de la lumière (en haut à gauche), une ombre portée sur le décor.
// Origine : le point de contact avec le sol pour les animaux posés, le centre du corps pour les nageurs.
import { rng, type Gfx, type P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import { taper } from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";

export const CREATURE_N = 12, CREATURE_FPS = 8;
const TAU = Math.PI * 2, SH = "#0a3f49", SAND_SH = "#8d6f45";
type Xf = (p: P) => P;
// repère local -> scène : échelle, sens (1 vers la droite), rotation autour de l'origine
const xf = (x: number, y: number, s = 1, dir = 1, rot = 0): Xf => ([px, py]) => { const X = px * dir * s, Y = py * s, c = Math.cos(rot), n = Math.sin(rot); return [x + X * c - Y * n, y + X * n + Y * c]; };
const M = (T: Xf, pts: P[]) => pts.map(T);
const S = (pts: P[], per = 6) => smooth(pts, true, per);
const O = (pts: P[], per = 6) => smooth(pts, false, per);
// tourne des points autour de `o`
const turn = (pts: P[], o: P, a: number): P[] => pts.map(([x, y]) => [o[0] + (x - o[0]) * Math.cos(a) - (y - o[1]) * Math.sin(a), o[1] + (x - o[0]) * Math.sin(a) + (y - o[1]) * Math.cos(a)]);
// une forme : ombre portée, aplat et ombre nette, contour
const form = (g: Gfx, pts: P[], lit: string, shade: string, seed: number, o: { k?: number; w?: number; cast?: P; castA?: number; hi?: [P[], string] } = {}) => {
  if (o.cast) fillShape(g, shift(pts, o.cast[0], o.cast[1]), SH, o.castA ?? 0.22);
  cel(g, pts, lit, shade, o.k ?? 5, o.hi); contour(g, pts, o.w ?? 3, seed);
};
// un trait intérieur (sillon, rayure, jonction) : plus fin que le contour
const line = (g: Gfx, pts: P[], color: string, w: number, seed: number, a = 0.85) => ink(g, pts, color, { w, shadow: 0, taper: [0.2, 0.3], seed }, a);
// un membre effilé le long d'une épine
const limb = (spine: P[], r0: number, r1: number) => taper(O(spine, 6), (t) => r0 + (r1 - r0) * t).outline;
// un œil rond : blanc, pupille qui regarde vers `look`, deux reflets, paupière supérieure
const eye = (g: Gfx, c: P, r: number, seed: number, o: { look?: P; iris?: string; lid?: boolean; dark?: boolean } = {}) => {
  const [lx, ly] = o.look ?? [0.25, 0], s = blob(c[0], c[1], r, r, seed, 0.02, 14);
  if (o.dark) { cel(g, s, "#2a2440", INK, r * 0.25); fillShape(g, blob(c[0] - r * 0.3, c[1] - r * 0.35, r * 0.3, r * 0.3, seed + 1, 0.02, 8), "#ffffff"); contour(g, s, Math.max(1.4, r * 0.28), seed + 2); return; }
  cel(g, s, "#ffffff", "#dfe6ee", r * 0.25);
  clipped(g, s, () => {
    if (o.iris) fillShape(g, blob(c[0] + lx * r * 0.3, c[1] + ly * r * 0.3, r * 0.74, r * 0.74, seed + 3, 0.02, 12), o.iris);
    fillShape(g, blob(c[0] + lx * r * 0.34, c[1] + ly * r * 0.34, r * 0.5, r * 0.55, seed + 4, 0.02, 12), "#1f1a36");
    fillShape(g, blob(c[0] + lx * r * 0.2 - r * 0.2, c[1] - r * 0.28, r * 0.24, r * 0.24, seed + 5, 0.02, 8), "#ffffff");
    fillShape(g, blob(c[0] + lx * r * 0.4 + r * 0.26, c[1] + r * 0.3, r * 0.1, r * 0.1, seed + 6, 0.02, 6), "#ffffff", 0.9);
  });
  contour(g, s, Math.max(1.3, r * 0.26), seed + 7);
  if (o.lid !== false) ink(g, O([[c[0] - r - 1, c[1] - r * 0.3], [c[0] - r * 0.1, c[1] - r - 1.5], [c[0] + r * 0.9, c[1] - r * 0.55]]), INK, { w: Math.max(1.2, r * 0.26), shadow: 0, taper: [0.2, 0.5], seed: seed + 8, side: -1 });
};
// l'ombre de contact sur le sable (les animaux posés)
const ground = (g: Gfx, x: number, y: number, rx: number, ry: number, seed: number) => fillShape(g, blob(x + rx * 0.12, y + 1, rx, ry, seed, 0.06, 14), SAND_SH, 0.3);
const sn = (u: number, k = 1, ph = 0) => Math.sin(TAU * k * u + ph);

// ---------------------------------------------------------------- 1. poisson-clown
// Amphiprion ocellaris, de profil vers la droite. Corps ovale orange ; trois bandes blanches bordées de
// noir (derrière l'œil, au milieu avec une pointe vers l'avant, sur le pédoncule) ; nageoire dorsale en
// deux parties (épineuse basse, molle haute) ; nageoires arrondies bordées de noir ; grand œil à iris
// orangé ; petite bouche au bout du museau. Boucle : battement de queue, pectorale qui rame.
const CLOWN = "#ff8a1e", CLOWN_S = "#cf5a0e", CLOWN_L = "#ffac52";
export const drawClownfish = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y, s, dir), wag = 0.26 * sn(u), fl = 0.35 * sn(u, 2, 0.8);
  const body = S([[52, 3], [47, -12], [31, -25], [6, -30], [-19, -27], [-37, -16], [-46, -7], [-46, 7], [-37, 15], [-17, 24], [8, 27], [32, 21], [47, 12]]);
  const tail = S(turn([[-44, -9], [-60, -22], [-70, -10], [-71, 3], [-66, 17], [-58, 23], [-44, 9]], [-45, 0], wag));
  const dorsal = S([[12, -28], [4, -38], [-4, -36], [-10, -42], [-21, -47], [-32, -42], [-40, -29], [-44, -12], [-30, -24], [-10, -29]]);
  const anal = S([[-6, 25], [-14, 38], [-27, 38], [-37, 26], [-40, 14], [-24, 22]]);
  const pelvic = S([[16, 24], [9, 39], [3, 36], [2, 25]]);
  const pect = S(turn([[18, 4], [6, -6], [-6, -2], [-6, 10], [6, 16]], [18, 5], fl));
  fillShape(g, shift(M(T, body), 6 * dir, 8), SH, 0.2);
  // nageoires derrière le corps : bord noir (la marque de l'espèce)
  [[dorsal, 1], [anal, 2], [tail, 3]].forEach(([f, k]) => { const F = M(T, f as P[]); cel(g, F, CLOWN, CLOWN_S, 3); ink(g, F, INK, { w: 4.2, closed: true, shadow: 0.5, seed: 1000 + (k as number) }); });
  const B = M(T, body);
  cel(g, B, CLOWN, CLOWN_S, 6, [M(T, S([[40, -12], [26, -24], [4, -27], [-16, -22], [-4, -14], [22, -10]])), CLOWN_L]);
  clipped(g, B, () => {
    const bands = [[[15, -36], [22, -16], [24, 0], [22, 18], [16, 34], [5, 34], [10, 17], [11, 0], [9, -16], [3, -36]], [[-5, -36], [-4, -12], [3, 0], [-4, 12], [-6, 32], [-19, 32], [-15, 9], [-12, 0], [-15, -9], [-18, -36]], [[-35, -24], [-37, 0], [-35, 24], [-44, 24], [-46, 0], [-44, -24]]] as P[][];
    bands.forEach((b, i) => { const Bd = M(T, S(b)); fillShape(g, Bd, "#fffaf0"); fillShape(g, shift(Bd, 2 * dir, 3), "#dfe6ee", 0.6); fillShape(g, Bd.map(([px, py]) => [px - 1.5 * dir, py - 2] as P), "#fffaf0"); ink(g, Bd, INK, { w: 2.2, closed: true, shadow: 0.3, seed: 1010 + i }); });
  });
  contour(g, B, 3.4, 1020);
  // pectorale, pelviennes par-dessus
  [pelvic, pect].forEach((f, k) => { const F = M(T, f); cel(g, F, CLOWN_L, CLOWN, 2); ink(g, F, INK, { w: 2.6, closed: true, shadow: 0.5, seed: 1030 + k }); });
  line(g, M(T, O([[27, -18], [22, 0], [27, 16]])), CLOWN_S, 1.8, 1040);
  eye(g, T([36, -8]), 7.2, 1050, { iris: "#ffb347", look: [0.3, 0] });
  line(g, M(T, [[51, 6], [44, 9]]), INK, 1.8, 1060, 1);
});

// ---------------------------------------------------------------- 2. étoile de mer
// Une étoile de mer commune vue de dessus : cinq bras arrondis au bout (pas des pointes), disque central,
// deux rangées de tubercules clairs par bras, la plaque madréporique (le petit rond clair) sur le disque.
// Rouge-orangé, pour ne pas la confondre avec l'étoile jaune des étoiles gagnées. Boucle : deux bras
// relèvent le bout l'un après l'autre (l'étoile respire sur le sable).
export const drawSeaStar = (g: Gfx, u: number, x: number, y: number, s = 1) => g.group("plain", () => {
  const c: P = [x, y - 30 * s], R = 54 * s, rot = -Math.PI / 2 + 0.2, arms: { sp: P[]; w: (t: number) => number }[] = [];
  for (let i = 0; i < 5; i++) {
    const a = rot + (i * TAU) / 5, bend = (i === 1 ? 0.22 * Math.max(0, sn(u)) : i === 3 ? 0.22 * Math.max(0, sn(u, 1, Math.PI)) : 0) + 0.05 * sn(u, 1, i), sp: P[] = [];
    for (let k = 0; k <= 8; k++) { const t = k / 8, aa = a + bend * t * t * (i % 2 ? 1 : -1), r = R * t * (1 - (i === 1 || i === 3 ? 0.08 * bend : 0)); sp.push([c[0] + Math.cos(aa) * r, c[1] + Math.sin(aa) * r * 0.62]); }
    arms.push({ sp, w: (t) => s * (16 - 9.5 * t) });
  }
  // un seul contour : bord gauche de chaque bras, bout arrondi, bord droit, puis le creux vers le suivant
  const out: P[] = [];
  arms.forEach(({ sp, w }, i) => {
    const nrm = (k: number): P => { const a = sp[Math.max(0, k - 1)], b = sp[Math.min(8, k + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
    for (let k = 3; k <= 8; k++) { const n = nrm(k); out.push([sp[k][0] - n[0] * w(k / 8), sp[k][1] - n[1] * w(k / 8) * 0.8]); }
    const tip = sp[8], n8 = nrm(8), d: P = [n8[1], -n8[0]];
    out.push([tip[0] + d[0] * w(1) * 1.2, tip[1] + d[1] * w(1) * 1.0]);
    for (let k = 8; k >= 3; k--) { const n = nrm(k); out.push([sp[k][0] + n[0] * w(k / 8), sp[k][1] + n[1] * w(k / 8) * 0.8]); }
    const a1 = rot + ((i + 0.5) * TAU) / 5; out.push([c[0] + Math.cos(a1) * 22 * s, c[1] + Math.sin(a1) * 22 * s * 0.62]);
  });
  const star = S(out, 3);
  ground(g, x, y - 24 * s, R * 0.95, R * 0.5, 1100);
  fillShape(g, shift(star, 4 * s, 6 * s), SAND_SH, 0.3);
  cel(g, star, "#ff7a4a", "#c9412a", 5 * s, [blob(c[0] - 6 * s, c[1] - 6 * s, 16 * s, 9 * s, 1101, 0.1, 10), "#ff9a6a"]);
  clipped(g, star, () => arms.forEach(({ sp }, i) => {
    // les tubercules : deux rangées le long du bras, plus petits vers le bout
    for (let k = 1; k <= 7; k++) { const t = k / 8, p = sp[k], q = sp[k + 1], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, n: P = [-dy / l, dx / l], r = s * (2.8 - 1.6 * t);
      [-1, 1].forEach((side, j) => { const o: P = [p[0] + n[0] * side * s * (8 - 5 * t), p[1] + n[1] * side * s * (8 - 5 * t) * 0.8]; fillShape(g, blob(o[0], o[1], r, r * 0.85, 1110 + i * 20 + k * 2 + j, 0.1, 7), "#ffd0a8", 0.95); }); }
    line(g, sp.slice(1, 8), "#b8382a", 1.6 * s, 1150 + i, 0.5);
  }));
  fillShape(g, blob(c[0] + 7 * s, c[1] + 3 * s, 4 * s, 3 * s, 1160, 0.05, 8), "#ffe0b0"); ink(g, blob(c[0] + 7 * s, c[1] + 3 * s, 4 * s, 3 * s, 1160, 0.05, 8), "#b8382a", { w: 1.2, closed: true, shadow: 0, seed: 1161 });
  contour(g, star, 3.4 * s, 1162);
});

// ---------------------------------------------------------------- 3. crabe
// Un crabe de face : carapace plus large que haute, bord avant finement denté ; deux yeux au bout de
// courts pédoncules ; deux pinces (le « doigt » fixe et le doigt mobile qui s'ouvre) ; quatre pattes
// marcheuses de chaque côté, articulées (genou haut, pointe au sol) : dix pattes en tout, comme le dit la
// carte. Boucle : il pince, piétine, et se balance d'un côté à l'autre.
const CRAB = "#e8553a", CRAB_S = "#b3372a", CRAB_L = "#ff7d57";
export const drawCrab = (g: Gfx, u: number, x: number, y: number, s = 1) => g.group("plain", () => {
  const sway = 3 * sn(u), T = xf(x + sway * s, y, s);
  ground(g, x, y, 78 * s, 9 * s, 1200);
  // pattes marcheuses : derrière la carapace ; une sur deux se lève à tour de rôle
  for (const side of [-1, 1]) for (let k = 0; k < 4; k++) {
    const lift = 5 * Math.max(0, sn(u, 1, k * 1.6 + (side > 0 ? Math.PI : 0))), b: P = [side * (34 - 5 * k), -30 + 5 * k], knee: P = [side * (60 + 3 * k), -46 + 11 * k - lift], tip: P = [side * (70 + 4 * k) - sway * 0.3, -1 - lift * 0.4];
    const L = M(T, limb([b, knee, tip], 5.5, 2));
    cel(g, L, k % 2 ? CRAB : CRAB_L, CRAB_S, 2); contour(g, L, 2.4, 1210 + k + (side > 0 ? 10 : 0));
    line(g, M(T, [[knee[0] - side * 3, knee[1] + 3], [knee[0] + side * 2, knee[1] + 6]]), CRAB_S, 1.4, 1230 + k);
  }
  const shell = M(T, S([[-47, -36], [-43, -52], [-30, -63], [-12, -68], [0, -69], [12, -68], [30, -63], [43, -52], [47, -36], [41, -24], [22, -15], [0, -13], [-22, -15], [-41, -24]]));
  fillShape(g, shift(shell, 5, 7), SH, 0.18);
  cel(g, shell, CRAB, CRAB_S, 6, [M(T, S([[-36, -50], [-24, -60], [-6, -64], [4, -58], [-8, -48], [-28, -42]])), CRAB_L]);
  clipped(g, shell, () => {
    // le sillon en H du dos et quelques granules
    const r = rng(1241); for (let i = 0; i < 12; i++) { const px = -36 + r() * 72, py = -58 + r() * 34; fillShape(g, blob(...T([px, py]), 1.6 * s, 1.4 * s, 1242 + i, 0.1, 6), CRAB_S, 0.6); }
  });
  contour(g, shell, 3.4, 1260);
  // bord avant denté : petites dents entre les yeux et les côtés
  for (const side of [-1, 1]) for (let k = 0; k < 3; k++) { const px = side * (24 + k * 7), py = -64 + k * 5, tooth = M(T, [[px - side * 3, py + 1], [px + side * 1, py - 4], [px + side * 3, py + 2]]); fillShape(g, tooth, CRAB); ink(g, tooth, INK, { w: 1.4, closed: true, shadow: 0, seed: 1270 + k }); }
  // yeux sur pédoncules
  for (const side of [-1, 1]) { const st = M(T, limb([[side * 9, -64], [side * 12, -74], [side * 14, -81]], 3.4, 2.6)); cel(g, st, CRAB_L, CRAB, 1.5); contour(g, st, 2, 1280 + side); eye(g, T([side * 14, -84]), 6, 1284 + side, { look: [0, -0.1], lid: false }); }
  // la bouche : les pièces buccales, une petite fente sous le front
  line(g, M(T, O([[-6, -47], [0, -44.5], [6, -47]])), INK, 1.8, 1290, 1);
  // pinces : bras replié vers le haut, main renflée, doigt fixe et doigt mobile qui s'ouvre
  for (const side of [-1, 1]) {
    const open = 0.1 + 0.28 * Math.max(0, sn(u, 2, side > 0 ? 0 : 1.6)), arm = M(T, limb([[side * 38, -34], [side * 58, -48], [side * 58, -66]], 7.5, 6));
    cel(g, arm, CRAB, CRAB_S, 2); contour(g, arm, 2.8, 1300 + side);
    // la main (propode) : un ovale renflé ; le doigt fixe prolonge son bord extérieur, le doigt mobile
    // (dactyle) s'articule en haut du bord intérieur ; les deux pointes se rejoignent quand elle ferme
    const hand: P = [side * 60, -80], palm = M(T, blob(hand[0], hand[1], 15, 13, 1318 + side, 0.03, 14, -side * 0.35));
    const fixed = M(T, limb([[hand[0] + side * 9, hand[1] - 8], [hand[0] + side * 8, hand[1] - 22], [hand[0] + side * 1, hand[1] - 34]], 6.5, 1.2));
    const hinge: P = [hand[0] - side * 7, hand[1] - 10], dact = M(T, limb(turn([hinge, [hand[0] - side * 8, hand[1] - 24], [hand[0] - side * 1, hand[1] - 35]], hinge, -side * open), 5.5, 1.2));
    [dact, fixed].forEach((f, k) => { cel(g, f, CRAB_L, CRAB_S, 1.5); clipped(g, f, () => fillShape(g, shift(f, 0, -22 * s), "#7a2418")); contour(g, f, 2.4, 1310 + k + side); });
    cel(g, palm, CRAB_L, CRAB, 3); contour(g, palm, 3, 1320 + side);
    line(g, M(T, O([[hand[0] - side * 8, hand[1] + 5], [hand[0] + side * 6, hand[1] + 3]])), CRAB_S, 1.4, 1325 + side);
  }
});

// ---------------------------------------------------------------- 4. crevette
// Une crevette de profil, tournée vers la droite : carapace (céphalothorax) avec son rostre dentelé,
// œil noir sur pédoncule, deux longues antennes qui repartent vers l'arrière, cinq pattes marcheuses
// fines ; abdomen en six anneaux qui se courbe vers le bas ; pléopodes (petites rames) sous l'abdomen ;
// éventail de la queue (telson et uropodes). Translucide rose-orangé, bandes rouges. Boucle : les
// pléopodes rament en vague, les antennes ondulent.
const SHR = "#ffab8e", SHR_S = "#e0705a", SHR_L = "#ffd0bc", SHR_R = "#d84a3a";
export const drawShrimp = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y, s, dir);
  const spine: P[] = [[50, -8], [30, -14], [10, -14], [-10, -10], [-26, -2], [-38, 10], [-44, 24]], rad = (t: number) => (t < 0.35 ? 13 : 13 - (t - 0.35) * 14);
  const body = M(T, taper(O(spine, 6), rad).outline);
  // antennes : du front vers l'avant, puis longues et souples vers l'arrière
  [0, 1].forEach((k) => { const w = 6 * sn(u, 1, k * 1.2), a = M(T, O([[54, -10 - k * 3], [70, -24 - k * 4], [72, -40 - k * 6 + w * 0.3], [48, -56 - k * 4 + w], [4, -60 - k * 8 + w * 1.5], [-40, -50 - k * 12 + w * 2]], 8)); ink(g, a, SHR_R, { w: 1.8 - k * 0.3, shadow: 0, taper: [0.1, 0.9], seed: 1400 + k }); });
  // pattes marcheuses et pléopodes (sous le corps, derrière)
  for (let k = 0; k < 5; k++) { const bx = 40 - k * 7, L = M(T, O([[bx, -2], [bx + 2, 10], [bx - 3, 20 + (k % 2)]])); ink(g, L, SHR_S, { w: 2, shadow: 0, taper: [0.1, 0.5], seed: 1410 + k }); }
  for (let k = 0; k < 4; k++) { const t = 0.42 + k * 0.12, i = Math.round(t * (spine.length - 1)), p = spine[Math.min(spine.length - 1, i)], beat = 0.5 * sn(u, 2, -k * 1.1), pl = M(T, S(turn([[p[0] + 3, p[1] + 8], [p[0] + 5, p[1] + 20], [p[0] - 1, p[1] + 21], [p[0] - 3, p[1] + 9]], [p[0], p[1] + 8], beat))); fillShape(g, pl, SHR_L, 0.9); ink(g, pl, SHR_S, { w: 1.3, closed: true, shadow: 0, seed: 1420 + k }); }
  fillShape(g, shift(body, 5, 7), SH, 0.18);
  cel(g, body, SHR, SHR_S, 5, [M(T, S([[44, -16], [24, -22], [2, -20], [-14, -14], [2, -12], [26, -12]])), SHR_L]);
  clipped(g, body, () => {
    // anneaux de l'abdomen : bandes rouges, et le sillon de la carapace
    for (let k = 0; k < 6; k++) { const t = 0.4 + k * 0.1, i = t * (spine.length - 1), a = spine[Math.floor(i)], b = spine[Math.min(spine.length - 1, Math.floor(i) + 1)], f = i - Math.floor(i), p: P = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], d: P = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...d), n: P = [-d[1] / l, d[0] / l];
      const band = M(T, [[p[0] - n[0] * 16, p[1] - n[1] * 16], [p[0] + n[0] * 16, p[1] + n[1] * 16], [p[0] + n[0] * 16 - d[0] / l * 3, p[1] + n[1] * 16 - d[1] / l * 3], [p[0] - n[0] * 16 - d[0] / l * 3, p[1] - n[1] * 16 - d[1] / l * 3]]);
      fillShape(g, band, SHR_R, 0.55); line(g, M(T, [[p[0] - n[0] * 16, p[1] - n[1] * 16], [p[0] + n[0] * 16, p[1] + n[1] * 16]]), SHR_S, 1.4, 1430 + k, 0.8); }
    line(g, M(T, O([[42, -20], [30, -8], [16, 0]])), SHR_S, 1.6, 1440, 0.7);
    for (const [px, py] of [[34, -18], [20, -16], [8, -12], [-6, -8]] as P[]) fillShape(g, blob(...T([px, py]), 1.6 * s, 1.6 * s, 1441 + px, 0.1, 6), SHR_R, 0.7);
  });
  contour(g, body, 3, 1450);
  // rostre dentelé, œil pédonculé
  const rost = M(T, [[46, -18], [72, -26], [66, -22], [64, -25], [60, -20], [58, -23], [52, -14]]); cel(g, rost, SHR_L, SHR_S, 1); ink(g, rost, INK, { w: 1.8, closed: true, shadow: 0.4, seed: 1460 });
  const st = M(T, limb([[44, -14], [50, -20]], 3, 2.6)); cel(g, st, SHR, SHR_S, 1); contour(g, st, 1.6, 1461);
  eye(g, T([51, -22]), 5, 1462, { dark: true });
  // l'éventail de la queue : telson au milieu, deux uropodes de chaque côté
  const e = spine[spine.length - 1], fan = [[-0.5, 20], [-0.1, 22], [0.3, 20]].map(([a, l], k) => M(T, S(turn([[e[0], e[1] - 2], [e[0] - 7, e[1] + l], [e[0] + 1, e[1] + l + 3], [e[0] + 6, e[1] + 2]], [e[0], e[1]], a + 0.1 * sn(u, 2)))));
  fan.forEach((f, k) => { cel(g, f, SHR_L, SHR, 1.5); ink(g, f, INK, { w: 2, closed: true, shadow: 0.5, seed: 1470 + k }); });
});

// ---------------------------------------------------------------- 5. bernard-l'ermite
// De profil vers la droite : une coquille de bulot vide (spire à trois tours vers l'arrière, dernier tour
// large, ouverture ovale à l'avant, bandes brunes qui suivent les tours) ; le bernard en sort par
// l'ouverture : deux yeux sur pédoncules, deux antennes, une grosse pince droite et une petite gauche,
// deux paires de pattes marcheuses rayées qui touchent le sable. Boucle : il piétine, ses antennes
// fouettent, sa grosse pince se soulève.
const SHELL_C = "#f1dfc0", SHELL_CS = "#c7a57a", SHELL_B = "#a8683a", HER = "#ff6b3d", HER_S = "#c4452a", HER_L = "#ff9468";
export const drawHermitCrab = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y, s, dir), bob = 1.5 * sn(u, 2);
  ground(g, x, y, 62 * s, 8 * s, 1500);
  // pattes marcheuses (derrière d'abord)
  for (let k = 0; k < 4; k++) {
    const lift = 5 * Math.max(0, sn(u, 1, k * 1.7)), b: P = [8 + k * 7, -16 + bob], knee: P = [24 + k * 9, -30 + k * 3 - lift], tip: P = [26 + k * 12, -1 - lift * 0.3];
    const L = M(T, limb([b, knee, tip], 4.6, 1.8)); cel(g, L, k < 2 ? mix(HER, HER_S, 0.3) : HER, HER_S, 2);
    clipped(g, L, () => [0.35, 0.7].forEach((t, j) => { const p = [b[0] + (knee[0] - b[0]) * t, b[1] + (knee[1] - b[1]) * t] as P; fillShape(g, blob(...T(p), 3.4 * s, 3.4 * s, 1510 + k * 3 + j, 0.1, 6), "#fff0e0", 0.9); }));
    contour(g, L, 2.2, 1520 + k);
  }
  // la coquille (bulot) : spire vers l'arrière, dernier tour, ouverture
  const whorls: [P, number, number, number][] = [[[-20, -36 + bob], 36, 29, -0.35], [[-46, -62 + bob], 18, 14, -0.5], [[-60, -75 + bob], 10, 8, -0.6], [[-68, -83 + bob], 5.5, 4.5, -0.6]];
  const shapes = whorls.map(([c, rx, ry, rt], i) => blob(...T(c), rx * s, ry * s, 1530 + i, 0.04, 16, rt * dir));
  fillShape(g, shift(shapes[0], 6, 8), SH, 0.2);
  [3, 2, 1, 0].forEach((i) => {
    cel(g, shapes[i], SHELL_C, SHELL_CS, 4);
    clipped(g, shapes[i], () => { const [c, rx, ry] = whorls[i]; for (let k = -1; k <= 1; k++) ink(g, M(T, O([[c[0] - rx * 0.9, c[1] + k * ry * 0.45 - rx * 0.2], [c[0], c[1] + k * ry * 0.5 + ry * 0.1], [c[0] + rx * 0.9, c[1] + k * ry * 0.45 + rx * 0.15]])), SHELL_B, { w: 3.4 * s * (i ? 0.6 : 1), shadow: 0, taper: [0.2, 0.2], seed: 1540 + i * 3 + k }, 0.75); });
    contour(g, shapes[i], i ? 2.4 : 3.2, 1550 + i);
  });
  // l'ouverture, sombre, d'où sort le bernard
  const ap = M(T, S([[2, -58 + bob], [12, -46 + bob], [14, -26 + bob], [6, -12 + bob], [-4, -18 + bob], [-6, -40 + bob]]));
  fillShape(g, ap, "#5a3a24"); ink(g, ap, INK, { w: 2.6, closed: true, shadow: 0.4, seed: 1560 });
  // corps, pédoncules, yeux, antennes
  const head = M(T, S([[2, -40 + bob], [16, -46 + bob], [24, -36 + bob], [20, -22 + bob], [6, -20 + bob]])); cel(g, head, HER, HER_S, 3); contour(g, head, 2.6, 1570);
  [0, 1].forEach((k) => { const a = M(T, O([[20, -44 + bob], [34 + k * 6, -60 - k * 4 + 5 * sn(u, 2, k)], [50 + k * 8, -58 - k * 8 + 8 * sn(u, 2, k + 0.6)]], 8)); ink(g, a, HER_S, { w: 1.6, shadow: 0, taper: [0.1, 0.9], seed: 1580 + k }); });
  [0, 1].forEach((k) => { const st = M(T, limb([[12 + k * 5, -44 + bob], [14 + k * 6, -58 + bob]], 2.8, 2.2)); cel(g, st, HER_L, HER, 1); contour(g, st, 1.6, 1590 + k); eye(g, T([14 + k * 6, -61 + bob]), 4.6, 1594 + k * 10, { dark: true }); });
  // petite pince (derrière), grosse pince (devant)
  const small = M(T, S([[18, -26 + bob], [30, -30 + bob], [36, -24 + bob], [30, -18 + bob], [20, -18 + bob]])); cel(g, small, HER_L, HER_S, 2); contour(g, small, 2.2, 1600);
  const lift = 3 * sn(u, 1, 0.5), big = M(T, S([[14, -18 + bob], [24, -24 + bob - lift], [40, -24 - lift], [50, -16 - lift], [46, -6 - lift * 0.5], [30, -4], [16, -8 + bob]]));
  cel(g, big, HER_L, HER, 3, [M(T, S([[24, -20 - lift], [38, -21 - lift], [30, -16 - lift]])), "#ffb08a"]);
  clipped(g, big, () => { const r = rng(1610); for (let i = 0; i < 8; i++) fillShape(g, blob(...T([22 + r() * 24, -20 + r() * 12 - lift]), 1.5 * s, 1.5 * s, 1611 + i, 0.1, 6), "#fff0e0", 0.8); });
  contour(g, big, 2.8, 1620);
  line(g, M(T, O([[40, -14 - lift], [50, -12 - lift * 0.6]])), INK, 1.8, 1621, 1);
});

// ---------------------------------------------------------------- 6. moule
// Une moule posée sur un galet : coquille allongée en goutte (pointe = crochet à gauche, bord arrondi à
// droite), bleu-noir avec des stries de croissance concentriques et un reflet nacré violet ; entrouverte
// sur le bord : le liseré brun-orangé du manteau et ses franges ; le byssus (les fils) part sous la
// coquille et s'agrippe au galet. Une seconde moule, plus petite, derrière. Boucle : elle s'entrouvre et se
// referme doucement, les franges ondulent.
const MUS = "#2f3a5c", MUS_S = "#1b2139", MUS_L = "#4c5b8c";
const mussel = (g: Gfx, u: number, T: Xf, s: number, seed: number) => {
  const gape = 1.5 + 2.2 * (0.5 + 0.5 * sn(u)), shell = M(T, S([[-46, 4], [-38, -6], [-14, -16], [14, -22], [36, -21], [48, -9], [45, 5], [28, 13], [2, 15], [-26, 12]]));
  // le liseré du manteau et ses franges, dans l'entrebâillement sous la coquille
  const lip = M(T, S([[-20, 10], [2, 13], [28, 11], [42, 5], [40, 5 + gape], [26, 12 + gape], [2, 15 + gape], [-18, 12 + gape * 0.6]]));
  cel(g, lip, "#e0934e", "#a8582a", 1); for (let k = 0; k < 9; k++) { const px = -12 + k * 6, py = 13 + gape * 0.8; line(g, M(T, [[px, py - 1], [px + 2 * sn(u, 2, k), py + 3]]), "#8a4520", 1.3 * s, seed + 30 + k, 0.9); }
  ink(g, lip, INK, { w: 1.8, closed: true, shadow: 0.3, seed: seed + 20 });
  fillShape(g, shift(shell, 5, 7), SH, 0.22);
  cel(g, shell, MUS, MUS_S, 5, [M(T, S([[-30, -4], [-8, -13], [18, -18], [34, -16], [14, -8], [-10, -2]])), MUS_L]);
  clipped(g, shell, () => {
    // stries de croissance : des arcs parallèles au bord libre, qui se resserrent vers le crochet
    for (let k = 1; k <= 5; k++) { const f = k / 6; ink(g, M(T, O([[-46 + 40 * f, 6 - 2 * f], [-20 + 30 * f, -16 * f], [14 + 20 * f, -22 * f], [30 + 14 * f, -12 * f], [26 + 14 * f, 12 * f]], 6)), MUS_S, { w: 1.4 * s, shadow: 0, taper: [0.2, 0.2], seed: seed + 40 + k }, 0.9); }
    ink(g, M(T, O([[-24, -8], [0, -16], [22, -18]])), "#b8a8e8", { w: 3 * s, shadow: 0, taper: [0.3, 0.4], seed: seed + 50 }, 0.55);
  });
  contour(g, shell, 3, seed + 60);
};
export const drawMussel = (g: Gfx, u: number, x: number, y: number, s = 1) => g.group("plain", () => {
  // le galet
  const rock = blob(x + 4 * s, y - 12 * s, 58 * s, 16 * s, 1650, 0.1, 14);
  fillShape(g, shift(rock, 6, 5), SAND_SH, 0.35); cel(g, rock, "#9aa6b4", "#66728a", 5, [blob(x - 16 * s, y - 20 * s, 18 * s, 5 * s, 1651, 0.2, 10), "#c3ccd6"]); contour(g, rock, 3.2, 1652);
  mussel(g, u + 0.3, xf(x + 30 * s, y - 38 * s, s * 0.62, -1, 0.2), s * 0.62, 1700);
  // byssus : fils fins, du dessous de la coquille au galet
  for (let k = 0; k < 6; k++) { const a: P = [x + (-18 + k * 4) * s, y - 30 * s], b: P = [x + (-34 + k * 9) * s, y - 20 * s + (k % 2) * 2 * s]; ink(g, O([a, [(a[0] + b[0]) / 2 + 2 * s, (a[1] + b[1]) / 2], b]), "#d8c79a", { w: 1.2 * s, shadow: 0, taper: [0.2, 0.2], seed: 1660 + k }, 0.95); fillShape(g, blob(b[0], b[1], 2 * s, 1.4 * s, 1670 + k, 0.1, 6), "#d8c79a"); }
  mussel(g, u, xf(x - 4 * s, y - 44 * s, s, 1, -0.12), s, 1750);
});

// ---------------------------------------------------------------- 7. oursin
// Un oursin posé : le test (la coquille) en dôme violet, couvert de petits tubercules sur lesquels
// s'articulent les piquants ; longs piquants tout autour, plus courts vers le haut, pointes plus claires ;
// quelques pieds ambulacraires (petits tubes translucides) au ras du sable. Boucle : les piquants
// oscillent chacun à son rythme.
export const drawUrchin = (g: Gfx, u: number, x: number, y: number, s = 1) => g.group("plain", () => {
  const c: P = [x, y - 26 * s], R = 30 * s, r = rng(1800), sp: { a: number; len: number; ph: number }[] = [];
  for (let i = 0; i < 46; i++) sp.push({ a: Math.PI + (i / 45) * Math.PI + (r() - 0.5) * 0.06, len: (26 + r() * 14) * s * (1 - 0.25 * Math.abs(Math.sin(Math.PI + (i / 45) * Math.PI + Math.PI / 2))), ph: r() * TAU });
  ground(g, x, y, 60 * s, 8 * s, 1801);
  // piquants du fond (derrière le test)
  const spine = (a: number, len: number, ph: number, k: number, front: boolean) => {
    const w = a + 0.1 * sn(u, 1, ph), b: P = [c[0] + Math.cos(a) * R * (front ? 0.7 : 0.92), c[1] + Math.sin(a) * R * (front ? 0.62 : 0.85)], e: P = [b[0] + Math.cos(w) * len, b[1] + Math.sin(w) * len * 0.9];
    ink(g, [b, e], front ? "#4a2560" : "#3b1f4f", { w: 3.4 * s, shadow: 0, taper: [0.02, 0.95], seed: 1810 + k });
    ink(g, [[b[0] + (e[0] - b[0]) * 0.6, b[1] + (e[1] - b[1]) * 0.6], e], "#b48ad0", { w: 2 * s, shadow: 0, taper: [0.02, 0.95], seed: 1900 + k }, 0.9);
  };
  sp.forEach((q, k) => spine(q.a, q.len, q.ph, k, false));
  // pieds ambulacraires au ras du sable
  for (let k = 0; k < 7; k++) { const px = x + (-24 + k * 8) * s; ink(g, [[px, y - 4 * s], [px + 1, y]], "#e8c8f0", { w: 2 * s, shadow: 0, taper: [0.3, 0.1], seed: 1960 + k }, 0.8); }
  const test = blob(c[0], c[1] + 4 * s, R, R * 0.86, 1970, 0.03, 18);
  fillShape(g, shift(test, 5, 6), SH, 0.2);
  cel(g, test, "#8a5aa6", "#4e2a64", 6, [blob(c[0] - 10 * s, c[1] - 8 * s, 12 * s, 8 * s, 1971, 0.1, 10), "#a67cc0"]);
  clipped(g, test, () => { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.45; line(g, O([[c[0] + Math.cos(a) * 4 * s, c[1] - 20 * s], [c[0] + Math.cos(a) * R * 0.9, c[1] + Math.sin(a) * R * 0.3 + 10 * s]]), "#c9a8e0", 2.2 * s, 1975 + k, 0.5); } const rr = rng(1980); for (let i = 0; i < 26; i++) { const px = c[0] + (rr() - 0.5) * R * 1.8, py = c[1] + (rr() - 0.4) * R * 1.5; fillShape(g, blob(px, py, 1.6 * s, 1.6 * s, 1981 + i, 0.1, 6), "#3b1f4f", 0.6); } });
  contour(g, test, 3.2, 1990);
  // piquants du devant : courts, depuis la face visible
  for (let k = 0; k < 16; k++) { const a = Math.PI * 1.1 + (k / 15) * Math.PI * 0.8; spine(a, (12 + (k % 3) * 5) * s, k * 0.9, 2000 + k, true); }
});

// ---------------------------------------------------------------- 8. anémone de mer
// Une anémone posée : le pied collé au sable, la colonne (le tronc) rouge carmin, le disque oral vu un peu
// de dessus avec sa bouche fendue au centre, et une couronne de tentacules roses à bout clair (une rangée
// derrière le disque, une devant). Boucle : les tentacules ondulent dans le courant, en vague.
const ANE = "#f59ab8", ANE_S = "#c95b86", ANE_T = "#ffe2ee", COL = "#d9465e", COL_S = "#9c2a45";
export const drawAnemone = (g: Gfx, u: number, x: number, y: number, s = 1) => g.group("plain", () => {
  const T = xf(x, y, s), disc: P = [0, -48], N = 24;
  ground(g, x, y, 44 * s, 7 * s, 2100);
  const tent = (k: number, back: boolean) => {
    const a = (k / N) * TAU + (back ? 0 : 0.13), bx = Math.cos(a) * 28, by = Math.sin(a) * 8, len = 34 + 10 * Math.sin(k * 1.7) ** 2, out = Math.cos(a) * 0.7, sway = sn(u, 1, -k * 0.35);
    const sp: P[] = []; for (let i = 0; i <= 5; i++) { const t = i / 5; sp.push([disc[0] + bx + out * len * t * 0.8 + sway * 9 * t * t, disc[1] + by - len * t * (0.9 - 0.2 * Math.abs(out)) + 4 * t * t]); }
    const L = M(T, taper(O(sp, 5), (t) => 4.6 * (1 - t) + 1.8).outline);
    cel(g, L, back ? mix(ANE, ANE_S, 0.35) : ANE, ANE_S, 2); clipped(g, L, () => fillShape(g, blob(...T(sp[5]), 5 * s, 5 * s, 2110 + k, 0.1, 8), ANE_T)); contour(g, L, 2, 2120 + k + (back ? 0 : 40));
  };
  for (let k = 0; k < N; k++) if (Math.sin((k / N) * TAU) < 0) tent(k, true);
  const col = M(T, S([[-22, 0], [-18, -20], [-24, -44], [-30, -50], [30, -50], [24, -44], [18, -20], [22, 0]]));
  fillShape(g, shift(col, 5, 6), SH, 0.2);
  cel(g, col, COL, COL_S, 5); clipped(g, col, () => { for (let k = 0; k < 4; k++) line(g, M(T, O([[-14 + k * 9, -2], [-12 + k * 8, -24], [-18 + k * 12, -44]])), COL_S, 1.6, 2150 + k, 0.6); const r = rng(2155); for (let i = 0; i < 10; i++) fillShape(g, blob(...T([-16 + r() * 32, -40 + r() * 30]), 1.8 * s, 1.8 * s, 2156 + i, 0.1, 6), "#f07a8e", 0.8); });
  contour(g, col, 3, 2170);
  const d = M(T, S([[-32, -48], [-20, -56], [0, -58], [20, -56], [32, -48], [20, -41], [0, -39], [-20, -41]]));
  cel(g, d, "#f7b0c6", "#d9789c", 2); line(g, M(T, O([[-7, -49], [0, -47], [7, -49]])), "#8a2a50", 2, 2175, 0.9); contour(g, d, 2.4, 2176);
  for (let k = 0; k < N; k++) if (Math.sin((k / N) * TAU + 0.13) >= 0) tent(k, false);
});

// ---------------------------------------------------------------- 9. concombre de mer
// Couché sur le sable, tête à droite : corps en boudin couvert de papilles coniques (plus claires au
// bout), une rangée de pieds ambulacraires sous le ventre, et à l'avant la couronne de tentacules
// buccaux ramifiés qui ramassent le sable. Brun orangé. Boucle : une onde lente parcourt le corps
// (il avance en se contractant), les tentacules s'ouvrent et se referment.
export const drawSeaCucumber = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y, s, dir), spine: P[] = Array.from({ length: 11 }, (_, i) => { const t = i / 10; return [-62 + 122 * t, -17 - 5 * Math.sin(Math.PI * t)] as P; });
  const rad = (t: number) => (15 + 3 * Math.sin(Math.PI * t)) * (1 + 0.1 * sn(u - t * 1.2)) * Math.min(1, (t + 0.04) * 6, (1.04 - t) * 5);
  ground(g, x, y, 70 * s, 8 * s, 2200);
  // tentacules buccaux (derrière la tête) : de petits buissons ramifiés
  const open = 0.6 + 0.4 * (0.5 + 0.5 * sn(u, 1, 1));
  for (let k = 0; k < 6; k++) { const a = -1.2 + k * 0.48, b: P = [58, -18], e: P = [58 + Math.cos(a) * 16 * open, -18 + Math.sin(a) * 16 * open]; const st = M(T, [b, e]); ink(g, st, "#e8b48a", { w: 3 * s, shadow: 0, taper: [0.1, 0.6], seed: 2210 + k }); [-0.5, 0.5].forEach((da, j) => { const f: P = [e[0] + Math.cos(a + da) * 6 * open, e[1] + Math.sin(a + da) * 6 * open]; ink(g, M(T, [e, f]), "#f5d0a8", { w: 1.8 * s, shadow: 0, taper: [0.2, 0.5], seed: 2220 + k * 2 + j }); }); }
  const body = M(T, taper(O(spine, 6), rad).outline);
  fillShape(g, shift(body, 5, 6), SAND_SH, 0.3);
  cel(g, body, "#c46a38", "#7d3a1c", 6, [M(T, S([[-44, -34], [-10, -40], [30, -38], [46, -28], [10, -28], [-30, -26]])), "#dd8a54"]);
  clipped(g, body, () => { for (let k = 0; k < 16; k++) fillShape(g, blob(...T([-54 + k * 7, -2 - (k % 2) * 2]), 2 * s, 1.6 * s, 2230 + k, 0.1, 6), "#f5d0a8", 0.9); });
  contour(g, body, 3.2, 2250);
  // papilles : petits cônes sur le dos, pointe claire
  for (let k = 0; k < 9; k++) { const t = 0.1 + k * 0.1, i = t * 10, p = spine[Math.floor(i)], rr = rad(t), px = p[0] + (k % 2) * 3, py = p[1] - rr * 0.95; const cone = M(T, S([[px - 4, py + 3], [px, py - 6 - (k % 3)], [px + 4, py + 3]], 3)); cel(g, cone, "#e89a64", "#a8542a", 1); fillShape(g, blob(...T([px, py - 5 - (k % 3)]), 1.8 * s, 1.8 * s, 2260 + k, 0.1, 6), "#ffe6c8"); ink(g, cone, INK, { w: 1.4, closed: true, shadow: 0.3, seed: 2270 + k }); }
});

// ---------------------------------------------------------------- 10. coquille Saint-Jacques
// Pecten maximus posée sur le sable, vue de devant, par le bord qui s'ouvre : la valve du dessus (plate,
// orangée, côtes rayonnantes, les deux oreilles de la charnière au fond), la valve du dessous (bombée,
// crème) ; dans l'entrebâillement, le bord du manteau avec ses petits tentacules et sa rangée d'yeux
// bleus brillants (l'anecdote de la carte). Boucle : elle bâille un peu plus, puis se referme.
export const drawScallop = (g: Gfx, u: number, x: number, y: number, s = 1) => g.group("plain", () => {
  const T = xf(x, y, s), gap = 6 + 5 * (0.5 + 0.5 * sn(u)), lift = gap - 6;
  ground(g, x, y, 60 * s, 8 * s, 2300);
  // valve du dessous : un bol bombé, côtes verticales
  const low = M(T, S([[-56, -22], [-40, -10], [-20, -2], [0, 0], [20, -2], [40, -10], [56, -22], [48, -26], [0, -20], [-48, -26]]));
  fillShape(g, shift(low, 5, 5), SAND_SH, 0.3);
  cel(g, low, "#f2dcc0", "#c9a47e", 3); clipped(g, low, () => { for (let k = -5; k <= 5; k++) line(g, M(T, [[k * 9, -22], [k * 9.5, 0]]), "#c9a47e", 1.6, 2310 + k, 0.8); }); contour(g, low, 2.8, 2320);
  // l'entrebâillement : manteau, tentacules, yeux
  const top = -22 - gap, mantle = M(T, S([[-50, -24], [-30, top + 2], [0, top], [30, top + 2], [50, -24], [30, -21], [0, -19], [-30, -21]]));
  fillShape(g, mantle, "#3a2030"); for (let k = 0; k < 18; k++) { const px = -44 + k * 5.2, py = -21 - Math.sin((k / 17) * Math.PI) * 2; line(g, M(T, [[px, py], [px + sn(u, 2, k) * 1.5, py - gap * 0.7]]), "#f0d8c0", 1.2 * s, 2330 + k, 0.9); }
  for (let k = 0; k < 11; k++) { const px = -40 + k * 8, py = -22.5 - gap * 0.5 - Math.sin((k / 10) * Math.PI) * 2, e = T([px, py]); fillShape(g, blob(e[0], e[1], 2.4 * s, 2.4 * s, 2350 + k, 0.05, 8), "#2f7fe0"); fillShape(g, blob(e[0] - 0.7 * s, e[1] - 0.8 * s, 0.8 * s, 0.8 * s, 2365 + k, 0.05, 6), "#dff4ff"); }
  // valve du dessus : l'éventail aplati, charnière et oreilles au fond
  const up = (p: P): P => [p[0], p[1] - lift * (1 + p[1] / 80)];
  const valve = M(T, S([[-58, -26], [-44, -46], [-26, -60], [-14, -70], [-18, -76], [18, -76], [14, -70], [26, -60], [44, -46], [58, -26], [30, -24 - gap + 3], [0, -22 - gap], [-30, -24 - gap + 3]].map(up)));
  fillShape(g, shift(valve, 5, 6), SH, 0.18);
  cel(g, valve, "#f5a468", "#c56d3a", 5, [M(T, S([[-40, -44], [-22, -58], [0, -66], [-6, -52], [-28, -40]].map(up))), "#ffc796"]);
  clipped(g, valve, () => { for (let k = -6; k <= 6; k++) { const a = up([0, -72]), b = up([k * 9.6, -24 - gap]); ink(g, M(T, O([a, [(a[0] + b[0]) / 2 + k * 0.6, (a[1] + b[1]) / 2], b])), k % 2 ? "#d9804a" : "#fff0dc", { w: (k % 2 ? 2.4 : 1.6) * s, shadow: 0, taper: [0.4, 0.1], seed: 2380 + k }, 0.8); } ink(g, M(T, O([[-52, -28 - gap], [0, -24 - gap], [52, -28 - gap]].map(up))), "#a85a2a", { w: 2 * s, shadow: 0, taper: [0.2, 0.2], seed: 2395 }, 0.6); });
  contour(g, valve, 3, 2396);
  line(g, M(T, [up([-18, -71]), up([18, -71])]), "#a85a2a", 1.6, 2397, 0.8);
});

// ---------------------------------------------------------------- 11. poisson-chirurgien
// Paracanthurus hepatus, de profil vers la droite : corps ovale haut et aplati, bleu roi ; la grande
// marque noire en « palette de peintre » (de l'œil vers la queue, qui entoure une tache bleue) ; nageoires
// dorsale et anale bordées de noir ; queue jaune bordée de noir ; sur le pédoncule jaune, la petite lame
// blanche (le « scalpel » de l'anecdote) ; pectorale jaune au bout ; petite bouche pointue. Boucle :
// battement de queue, la pectorale rame.
const TANG = "#2f62d8", TANG_S = "#1c3c9a", TANG_L = "#5a8cf2", YEL = "#ffd23a", YEL_S = "#d99a18";
export const drawSurgeonfish = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y, s, dir), wag = 0.22 * sn(u), fl = 0.4 * sn(u, 2, 0.6);
  const body = S([[54, 3], [48, -10], [30, -30], [4, -38], [-24, -32], [-40, -16], [-48, -6], [-48, 6], [-40, 15], [-22, 31], [4, 37], [30, 28], [47, 12]]);
  const tail = S(turn([[-46, -7], [-60, -24], [-72, -30], [-66, -8], [-66, 8], [-72, 30], [-60, 24], [-46, 7]], [-47, 0], wag));
  const dorsal = S([[34, -28], [22, -40], [-2, -46], [-26, -42], [-42, -26], [-46, -10], [-28, -30], [0, -36]]), anal = S([[20, 32], [0, 44], [-24, 40], [-40, 26], [-44, 10], [-26, 30]]);
  fillShape(g, shift(M(T, body), 6 * dir, 8), SH, 0.2);
  [dorsal, anal].forEach((f, k) => { const F = M(T, f); cel(g, F, TANG_L, TANG, 2); ink(g, F, INK, { w: 4, closed: true, shadow: 0.5, seed: 2400 + k }); });
  const Tl = M(T, tail); cel(g, Tl, YEL, YEL_S, 3); clipped(g, Tl, () => { fillShape(g, M(T, turn([[-58, -22], [-72, -34], [-64, -26]], [-47, 0], wag)), INK); fillShape(g, M(T, turn([[-58, 22], [-72, 34], [-64, 26]], [-47, 0], wag)), INK); }); ink(g, Tl, INK, { w: 3.4, closed: true, shadow: 0.5, seed: 2402 });
  const B = M(T, body);
  cel(g, B, TANG, TANG_S, 6, [M(T, S([[40, -12], [24, -28], [0, -33], [-10, -24], [14, -16]])), TANG_L]);
  clipped(g, B, () => {
    const pal = M(T, S([[30, -16], [18, -28], [-8, -32], [-32, -24], [-44, -6], [-40, 10], [-24, 14], [-6, 6], [10, 0], [26, -4]])), hole = M(T, S([[-4, -18], [-22, -20], [-32, -10], [-26, 2], [-10, 0]]));
    fillShape(g, pal, "#141a3a"); cel(g, hole, TANG_L, TANG, 2);
    fillShape(g, M(T, S([[-38, -10], [-50, -8], [-50, 8], [-38, 10]])), YEL);
    const blade = M(T, [[-40, -1], [-33, -3], [-40, 2]]); fillShape(g, blade, "#ffffff"); ink(g, blade, INK, { w: 1.2, closed: true, shadow: 0, seed: 2410 });
  });
  contour(g, B, 3.4, 2420);
  const pect = M(T, S(turn([[20, 6], [6, 0], [-6, 6], [4, 16]], [20, 7], fl))); cel(g, pect, TANG_L, TANG, 2); clipped(g, pect, () => fillShape(g, M(T, turn([[-2, 2], [-8, 8], [0, 14], [4, 6]], [20, 7], fl)), YEL)); ink(g, pect, INK, { w: 2.4, closed: true, shadow: 0.5, seed: 2430 });
  eye(g, T([38, -8]), 6.6, 2440, { iris: "#4a3a8a", look: [0.3, 0] });
  line(g, M(T, [[53, 5], [47, 7]]), INK, 1.8, 2450, 1);
});

// ---------------------------------------------------------------- 12. hippocampe
// Debout, tourné vers la droite : tête avec son long museau en tube (petite bouche au bout), la couronne
// (coronet) sur le dessus, un grand œil ; cou arqué, ventre bombé (la poche du papa), corps fait d'anneaux
// osseux ; queue enroulée (préhensile) ; nageoire dorsale en éventail au milieu du dos, petite pectorale
// derrière la tête. Jaune-orangé. Boucle : la dorsale et la pectorale vibrent vite (comme chez le vrai),
// le corps flotte, la queue se serre et se desserre.
const SEA = "#f4b53e", SEA_S = "#c98a22", SEA_L = "#ffd26e", SEA_R = "#a86a18";
export const drawSeahorse = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y + 3 * sn(u) * s, s, dir), curl = 0.12 * sn(u, 1, 0.5);
  const spine: P[] = O([[4, -58], [-4, -44], [2, -28], [0, -10], [-8, 6], [-16, 20], [-12, 34], [0, 36], [4, 26], [-2, 20]], 6);
  const r = (t: number) => (t < 0.08 ? 8 : t < 0.35 ? 8 + (t - 0.08) * 28 : t < 0.5 ? 15.5 - (t - 0.35) * 40 : Math.max(1.6, 9.5 - (t - 0.5) * 17));
  const tailSp = spine.map((p, i) => (i > spine.length * 0.55 ? turn([p], [-10, 8], curl * ((i / spine.length - 0.55) * 2))[0] : p));
  const body = M(T, taper(tailSp, r).outline);
  // dorsale : éventail de rayons sur le dos (derrière le corps)
  const flut = sn(u, 3), dors = M(T, S([[-10, -32], [-24, -38 + flut * 2], [-28, -24 + flut * 3], [-24, -12 + flut * 2], [-12, -12]]));
  fillShape(g, dors, "#ffe8a8", 0.85); for (let k = 0; k < 5; k++) line(g, M(T, [[-11, -30 + k * 4.4], [-25 - Math.sin(k) * 2, -36 + k * 6 + flut * 2.4]]), SEA_S, 1.2, 2500 + k, 0.8); ink(g, dors, SEA_S, { w: 1.8, closed: true, shadow: 0, seed: 2510 });
  fillShape(g, shift(body, 5, 7), SH, 0.2);
  cel(g, body, SEA, SEA_S, 5, [M(T, S([[-2, -50], [-6, -38], [-2, -24], [4, -30], [2, -46]])), SEA_L]);
  clipped(g, body, () => {
    // les anneaux osseux : de petits traits en travers du corps
    for (let i = 1; i < tailSp.length - 2; i++) { const p = tailSp[i], q = tailSp[i + 1], d: P = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(...d) || 1, n: P = [-d[1] / l, d[0] / l], rr = r(i / (tailSp.length - 1)) + 1; line(g, M(T, [[p[0] - n[0] * rr, p[1] - n[1] * rr], [p[0] + n[0] * rr, p[1] + n[1] * rr]]), SEA_R, 1.3, 2520 + i, 0.7); }
    // la poche du ventre, plus claire
    fillShape(g, M(T, S([[8, -26], [10, -12], [4, 0], [2, -18]])), SEA_L, 0.8);
  });
  contour(g, body, 3, 2540);
  // la tête : crâne, museau en tube, couronne
  const head = M(T, S([[-6, -64], [0, -74], [12, -76], [20, -70], [36, -64], [42, -62], [42, -56], [34, -56], [18, -54], [6, -50], [-4, -52]]));
  cel(g, head, SEA, SEA_S, 4, [M(T, S([[0, -70], [12, -73], [18, -68], [8, -66]])), SEA_L]); contour(g, head, 3, 2550);
  const crown = M(T, S([[0, -73], [2, -84], [6, -80], [8, -86], [12, -78], [14, -74]], 3)); cel(g, crown, SEA_L, SEA_S, 1.5); ink(g, crown, INK, { w: 2, closed: true, shadow: 0.4, seed: 2560 });
  line(g, M(T, [[42, -59], [39, -58]]), INK, 1.6, 2561, 1);
  line(g, M(T, O([[24, -66], [32, -62], [40, -61]])), SEA_S, 1.4, 2562, 0.7);
  // pectorale derrière la tête
  const pf = M(T, S([[-2, -52], [-12, -58 + flut * 2], [-12, -46 + flut * 2]])); fillShape(g, pf, "#ffe8a8", 0.9); ink(g, pf, SEA_S, { w: 1.6, closed: true, shadow: 0, seed: 2563 });
  eye(g, T([10, -66]), 5, 2570, { iris: "#6a9a3a", look: [0.35, 0] });
});

// ---------------------------------------------------------------- 13. poisson-ballon
// Un tétrodon, de profil vers la droite, un peu gonflé : corps rond, dos jaune-sable tacheté de brun,
// ventre blanc ; gros yeux hauts sur la tête ; bouche en bec (quatre dents soudées, lèvres épaisses) ;
// petites nageoires : pectorale derrière l'œil qui vibre, dorsale et anale tout à l'arrière, queue
// arrondie. Boucle : il respire (le corps enfle et se dégonfle un peu), la pectorale bourdonne.
export const drawPuffer = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const b = 1 + 0.035 * sn(u), T = xf(x, y, s, dir), P2 = (pts: P[]) => M(T, pts.map(([px, py]) => [px * b, py * b] as P)), fl = 0.5 * sn(u, 3), wag = 0.2 * sn(u, 1, 1);
  const body = S([[48, 4], [44, -16], [28, -36], [4, -44], [-22, -40], [-40, -24], [-48, -6], [-46, 12], [-34, 30], [-10, 42], [16, 42], [36, 28]]);
  const tail = M(T, S(turn([[-46, -6], [-62, -16], [-68, 0], [-62, 16], [-46, 6]], [-47, 0], wag)));
  cel(g, tail, "#e8c86a", "#b08a30", 2); ink(g, tail, INK, { w: 2.6, closed: true, shadow: 0.5, seed: 2600 });
  [S([[-30, -34], [-40, -48], [-48, -38], [-42, -28]]), S([[-30, 34], [-40, 46], [-48, 36], [-42, 28]])].forEach((f, k) => { const F = P2(f); cel(g, F, "#e8c86a", "#b08a30", 1.5); ink(g, F, INK, { w: 2.2, closed: true, shadow: 0.5, seed: 2601 + k }); });
  const B = P2(body);
  fillShape(g, shift(B, 6 * dir, 8), SH, 0.2);
  cel(g, B, "#dcb65c", "#a8842f", 7, [P2(S([[30, -26], [8, -38], [-18, -34], [-4, -24], [18, -18]])), "#f2d488"]);
  clipped(g, B, () => {
    fillShape(g, P2(S([[46, 8], [30, 6], [0, 8], [-30, 10], [-46, 14], [-34, 34], [-10, 46], [18, 44], [38, 28]])), "#fff6df");
    fillShape(g, P2(S([[40, 18], [10, 20], [-24, 22], [-10, 40], [20, 38]])), "#e8dcc0", 0.7);
    const r = rng(2610); for (let i = 0; i < 22; i++) { const px = -40 + r() * 76, py = -38 + r() * 40; if (px > 16 && py > -24 && py < -6) continue; fillShape(g, blob(...T([px * b, py * b]), (1.8 + r() * 1.4) * s, (1.8 + r() * 1.2) * s, 2611 + i, 0.1, 7), "#6e4a1e", 0.85); }
    for (let i = 0; i < 12; i++) { const px = -30 + i * 6, py = 26 + (i % 2) * 4; fillShape(g, blob(...T([px * b, py * b]), 0.9 * s, 0.9 * s, 2640 + i, 0.1, 5), "#c9b890", 0.9); }
  });
  contour(g, B, 3.4, 2660);
  // la bouche en bec
  const beak = P2(S([[46, -2], [53, 0], [54, 6], [48, 10], [44, 6]], 3)); cel(g, beak, "#f2d488", "#b08a30", 1); ink(g, beak, INK, { w: 2.2, closed: true, shadow: 0.3, seed: 2670 }); line(g, P2([[53, 4], [46, 4]]), INK, 1.4, 2671, 1);
  const pect = M(T, S(turn([[16, 0], [6, -8], [2, 4], [8, 10]], [16, 2], fl))); cel(g, pect, "#f2d488", "#c9a24a", 1); ink(g, pect, INK, { w: 2, closed: true, shadow: 0.4, seed: 2672 });
  eye(g, T([28 * b, -18 * b]), 9, 2680, { iris: "#3aa08a", look: [0.3, -0.1] });
});

// ---------------------------------------------------------------- 14. limace de mer
// Un nudibranche doridien, de profil vers la droite : le manteau allongé (violet vif, liseré jaune puis
// blanc sur le bord, une ligne blanche sur le dos), le pied qui dépasse à l'arrière, deux rhinophores
// orangés (des cornes lamellées) sur la tête, et à l'arrière du dos le bouquet de branchies en plumes
// (l'anecdote de la carte). Boucle : les branchies se balancent et s'ouvrent, les rhinophores oscillent,
// une vague parcourt le bord du manteau.
export const drawNudibranch = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y, s, dir);
  ground(g, x, y, 64 * s, 7 * s, 2700);
  const foot = M(T, S([[-66, -2], [-40, -8], [40, -8], [58, -6], [60, 0], [-60, 1]])); cel(g, foot, "#8a74e0", "#5a44b0", 2); contour(g, foot, 2.4, 2701);
  const wave = (px: number) => 1.6 * sn(u, 1, -px / 18);
  const mantle = M(T, S([[-58, -8 + wave(-58)], [-50, -24], [-26, -34], [4, -37], [30, -33], [50, -22], [58, -10 + wave(58)], [30, -6 + wave(30)], [0, -5 + wave(0)], [-30, -6 + wave(-30)]]));
  // branchies (derrière la ligne du dos) : un bouquet de 7 plumes
  const sway = 0.12 * sn(u), spread = 1 + 0.12 * sn(u, 1, 1.2);
  for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.32 * spread + sway, b: P = [-34, -30], e: P = [b[0] + Math.cos(a) * 30, b[1] + Math.sin(a) * 30], st = M(T, O([b, [(b[0] + e[0]) / 2 + sway * 6, (b[1] + e[1]) / 2], e])); ink(g, st, "#ff9a3d", { w: 3.2 * s, shadow: 0, taper: [0.1, 0.6], seed: 2710 + k }); for (let j = 1; j <= 4; j++) { const t = j / 5, p: P = [b[0] + (e[0] - b[0]) * t, b[1] + (e[1] - b[1]) * t]; [-1, 1].forEach((sd, q) => ink(g, M(T, [p, [p[0] + Math.cos(a + sd * 0.9) * 7, p[1] + Math.sin(a + sd * 0.9) * 7]]), "#ffc27a", { w: 1.4 * s, shadow: 0, taper: [0.2, 0.5], seed: 2720 + k * 8 + j * 2 + q })); } }
  fillShape(g, shift(mantle, 5, 6), SAND_SH, 0.25);
  cel(g, mantle, "#7a58e8", "#4630b0", 5, [M(T, S([[-40, -24], [-10, -33], [24, -31], [8, -24], [-24, -20]])), "#9c80f5"]);
  clipped(g, mantle, () => {
    ink(g, M(T, O([[-56, -10], [-30, -8], [0, -7], [30, -8], [56, -12]])), "#ffe45c", { w: 5 * s, shadow: 0, taper: [0.1, 0.1], seed: 2750 }, 0.95);
    ink(g, M(T, O([[-40, -24], [-10, -34], [24, -32], [44, -22]])), "#ffffff", { w: 2.2 * s, shadow: 0, taper: [0.3, 0.3], seed: 2751 }, 0.9);
  });
  contour(g, mantle, 3, 2760);
  // rhinophores : cornes orange, lamelles en anneaux
  [0, 1].forEach((k) => { const a = -1.9 + k * 0.5 + 0.12 * sn(u, 1, k), b: P = [34 + k * 8, -32 + k * 2], e: P = [b[0] + Math.cos(a) * 18, b[1] + Math.sin(a) * 18], R = M(T, limb([b, [(b[0] + e[0]) / 2, (b[1] + e[1]) / 2], e], 3.6, 2.4)); cel(g, R, "#ff9a3d", "#c85a1a", 1.2); clipped(g, R, () => { for (let j = 1; j < 5; j++) { const t = 0.35 + j * 0.13, p: P = [b[0] + (e[0] - b[0]) * t, b[1] + (e[1] - b[1]) * t]; line(g, M(T, [[p[0] - 4, p[1] + 1], [p[0] + 4, p[1] - 1]]), "#c85a1a", 1.2, 2770 + k * 5 + j, 0.9); } }); contour(g, R, 2, 2780 + k); });
});

// ---------------------------------------------------------------- 15. raie pastenague
// Vue de dessus, un peu de biais (on la voit posée sur le sable depuis au-dessus), tête vers la droite :
// le disque (nageoires pectorales soudées à la tête), les yeux sur le dessus avec les évents juste
// derrière, une arête au milieu du dos, de petites nageoires pelviennes à l'arrière, la longue queue fine
// avec son aiguillon dentelé. Sable, tachetée, pour se cacher. Boucle : une vague court le long du bord
// des « ailes » de l'avant vers l'arrière, la queue ondule.
export const drawStingray = (g: Gfx, u: number, x: number, y: number, s = 1, dir = 1) => g.group("plain", () => {
  const T = xf(x, y, s, dir), sq = 0.58, P2 = (pts: P[]) => M(T, pts.map(([px, py]) => [px, py * sq] as P));
  const edge = (px: number) => 5 * sn(u, 1, px / 22);
  const disc = S([[52, 0], [44, -22], [20, -52 + edge(20)], [-8, -60 + edge(-8)], [-30, -44 + edge(-30)], [-44, -12], [-46, 0], [-44, 12], [-30, 44 - edge(-30)], [-8, 60 - edge(-8)], [20, 52 - edge(20)], [44, 22]]);
  ground(g, x - 6 * s, y + 18 * s, 60 * s, 10 * s, 2800);
  const tw = sn(u, 1, 0.6), tail = M(T, taper(O([[-40, 0], [-70, 4 * tw * sq], [-100, -6 * tw * sq], [-128, 8 * tw * sq]], 6), (t) => 5 * (1 - t) + 0.8).outline);
  cel(g, tail, "#c9a878", "#8c6d42", 1.5); contour(g, tail, 2.2, 2801);
  const spine = M(T, [[-62, -1 * sq], [-80, -4 * sq + 2 * tw], [-64, 2 * sq]]); fillShape(g, spine, "#f0e0c0"); ink(g, spine, INK, { w: 1.4, closed: true, shadow: 0, seed: 2802 });
  [-1, 1].forEach((sd, k) => { const pv = P2(S([[-38, sd * 8], [-50, sd * 20], [-54, sd * 10]], 3)); cel(g, pv, "#c9a878", "#8c6d42", 1.5); contour(g, pv, 2.2, 2803 + k); });
  const D = P2(disc);
  fillShape(g, shift(D, 7, 9), SAND_SH, 0.3);
  cel(g, D, "#d4b482", "#9c7c4f", 6, [P2(S([[36, -14], [14, -40], [-10, -46], [-24, -30], [0, -18], [22, -8]])), "#e6cc9e"]);
  clipped(g, D, () => {
    const r = rng(2810); for (let i = 0; i < 24; i++) { const px = -38 + r() * 80, py = -48 + r() * 96; fillShape(g, blob(...T([px, py * sq]), (1.8 + r() * 2) * s, (1.4 + r() * 1.4) * s, 2811 + i, 0.15, 7), "#8c6d42", 0.55); }
    line(g, P2(O([[40, 0], [0, 0], [-40, 0]])), "#9c7c4f", 2.2, 2840, 0.8);
    line(g, P2(O([[30, -14], [10, -30], [-14, -40]])), "#9c7c4f", 1.4, 2841, 0.5); line(g, P2(O([[30, 14], [10, 30], [-14, 40]])), "#9c7c4f", 1.4, 2842, 0.5);
  });
  contour(g, D, 3.2, 2843);
  // yeux sur le dessus, évents derrière
  [-1, 1].forEach((sd, k) => { const e = T([24, sd * 11 * sq]); fillShape(g, blob(e[0], e[1] - 1.5 * s, 6 * s, 4.6 * s, 2850 + k, 0.05, 10), "#c9a878"); eye(g, [e[0], e[1] - 2 * s], 4 * s, 2852 + k * 10, { iris: "#6a5030", look: [0.3, sd * 0.2], lid: false }); const sp = T([12, sd * 13 * sq]); fillShape(g, blob(sp[0], sp[1], 3.4 * s, 2 * s, 2870 + k, 0.1, 8), "#6e5230"); });
});

// ---------------------------------------------------------------- le catalogue
// taille du calque (px logiques), origine (sol ou centre), et la fonction de dessin de l'image u (0..1)
export type CreatureSpec = { id: string; W: number; H: number; origin: P; draw: (g: Gfx, u: number, x: number, y: number, s?: number) => void; ground: boolean };
export const CREATURES: CreatureSpec[] = [
  { id: "poisson-clown", W: 170, H: 110, origin: [95, 55], ground: false, draw: (g, u, x, y, s = 1) => drawClownfish(g, u, x, y, s) },
  { id: "etoile-de-mer", W: 150, H: 110, origin: [75, 96], ground: true, draw: (g, u, x, y, s = 1) => drawSeaStar(g, u, x, y, s) },
  { id: "crabe", W: 200, H: 150, origin: [100, 138], ground: true, draw: (g, u, x, y, s = 1) => drawCrab(g, u, x, y, s) },
  { id: "crevette", W: 190, H: 130, origin: [95, 80], ground: false, draw: (g, u, x, y, s = 1) => drawShrimp(g, u, x, y, s) },
  { id: "bernard-l-ermite", W: 190, H: 130, origin: [95, 118], ground: true, draw: (g, u, x, y, s = 1) => drawHermitCrab(g, u, x, y, s) },
  { id: "moule", W: 160, H: 110, origin: [80, 98], ground: true, draw: (g, u, x, y, s = 1) => drawMussel(g, u, x, y, s) },
  { id: "oursin", W: 170, H: 120, origin: [85, 108], ground: true, draw: (g, u, x, y, s = 1) => drawUrchin(g, u, x, y, s) },
  { id: "anemone", W: 160, H: 150, origin: [80, 138], ground: true, draw: (g, u, x, y, s = 1) => drawAnemone(g, u, x, y, s) },
  { id: "concombre-de-mer", W: 190, H: 90, origin: [90, 76], ground: true, draw: (g, u, x, y, s = 1) => drawSeaCucumber(g, u, x, y, s) },
  { id: "coquille-saint-jacques", W: 150, H: 120, origin: [75, 104], ground: true, draw: (g, u, x, y, s = 1) => drawScallop(g, u, x, y, s) },
  { id: "poisson-chirurgien", W: 170, H: 120, origin: [90, 60], ground: false, draw: (g, u, x, y, s = 1) => drawSurgeonfish(g, u, x, y, s) },
  { id: "hippocampe", W: 110, H: 150, origin: [45, 84], ground: false, draw: (g, u, x, y, s = 1) => drawSeahorse(g, u, x, y, s) },
  { id: "poisson-ballon", W: 150, H: 120, origin: [80, 60], ground: false, draw: (g, u, x, y, s = 1) => drawPuffer(g, u, x, y, s) },
  { id: "limace-de-mer", W: 160, H: 90, origin: [80, 74], ground: true, draw: (g, u, x, y, s = 1) => drawNudibranch(g, u, x, y, s) },
  { id: "raie-pastenague", W: 220, H: 110, origin: [120, 52], ground: false, draw: (g, u, x, y, s = 1) => drawStingray(g, u, x, y, s) },
];
