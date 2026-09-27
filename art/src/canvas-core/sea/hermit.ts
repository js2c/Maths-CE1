// LE BERNARD-L'ERMITE · le module du personnage guide du module 2 (faits d'addition ; docs/SPEC-LOT2.md,
// « Aides visuelles et personnage guide »). Dessiné une fois ici ; les leçons, les exemples guidés et les
// corrections du module 2 le POSENT (`HermitPose`), ils ne le redessinent jamais
// (`references/workflows/character-consistency.md`).
//
// Identité (ce qu'un enfant dessinerait de mémoire) : un petit crabe corail dans une coquille de bulot crème
// rayée de brun ; deux gros yeux ronds au bout de deux pédoncules ; une grosse pince (la droite, devant) et
// une petite ; deux longues antennes qui fouettent ; des pattes rayées de clair ; un sourire.
//
// Réalisme (craft bar) : aucune photographie ouverte ; l'anatomie suit celle des pagures (Pagurus) :
//   - céphalothorax court, le bouclier (dessus de la carapace) sort de l'ouverture de la coquille ;
//   - deux pédoncules oculaires, deux antennes longues et deux antennules courtes et fourchues ;
//   - chélipèdes inégaux (la pince droite nettement plus grosse, pouce fixe en bas, doigt mobile en haut) ;
//   - deux paires de pattes marcheuses (bras, carpe, propode, dactyle pointu) qui touchent le sable ; les
//     deux dernières paires restent dans la coquille ;
//   - abdomen mou, pâle, enroulé vers la droite (on ne le voit que quand il change de coquille).
// Stylisé pour un enfant de 7 ans : les yeux sont de grands yeux blancs à pupille (comme la pieuvre), un
// sourire est posé sous les yeux. Vue de profil, un peu de trois quarts, tourné vers la droite.
// Même main que la pieuvre et la tortue (oceanMarker.ts) : aplats, une ombre nette par forme, contour qui
// s'épaissit à l'opposé de la lumière (en haut à gauche), ombre de contact sur le sable.
// Origine : sur le sable, sous l'ouverture de la coquille.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import { taper } from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";

export const HERMIT_FPS = 8, HERMIT_VERSION = 1;
const TAU = Math.PI * 2, SH = "#0a3f49", SAND_SH = "#8d6f45";
// le corps (rôles de palette)
export const HER = "#ff6b3d", HER_S = "#c4452a", HER_L = "#ff9468", HER_D = "#9a3320", BAND = "#fff0e0", BELLY = "#ffd9c2", BELLY_S = "#e8a98c";
// les coquilles : 0 = le bulot (sa maison), 1 = la nouvelle coquille (une turbo nacrée, plus grande)
export const SHELLS = [
  { c: "#f1dfc0", s: "#c7a57a", l: "#fbf0dc", band: "#a8683a", k: 0.86 },
  { c: "#f3b6c6", s: "#c77a93", l: "#ffd8e2", band: "#8e4a78", k: 1 },
];

export type HermitPose = {
  dx: number; dy: number; tilt: number; // tout le personnage (tilt en degrés, autour du point d'appui)
  out: number; // 1 : sorti ; 0 : rentré dans la coquille
  bx: number; by: number; // le corps par rapport à la coquille (changer de coquille)
  naked: number; // 0..1 : l'abdomen sort de la coquille (on le voit)
  shell: number; sx: number; sy: number; stilt: number; // la coquille portée : laquelle, décalage, rotation
  other: null | { shell: number; x: number; y: number; tilt: number }; // une coquille posée à côté (vide)
  claw: number; open: number; // grosse pince : rotation (degrés, négatif = levée), ouverture 0..1
  point: number; // 0..1 : bras tendu pour montrer (pince fermée, pointe vers l'avant)
  small: number; // petite pince : rotation (degrés)
  legs: number[]; // levée de chaque patte (4 : deux lointaines, deux proches), 0..1
  ant: number; // phase des antennes
  look: P; blink: number; eyes: "open" | "happy"; mouth: "smile" | "open";
  stalks: number; // pédoncules : inclinaison (degrés)
  ground?: boolean;
};
export const HERMIT_REST: HermitPose = {
  dx: 0, dy: 0, tilt: 0, out: 1, bx: 0, by: 0, naked: 0, shell: 0, sx: 0, sy: 0, stilt: 0, other: null,
  claw: 0, open: 0.25, point: 0, small: 0, legs: [0, 0, 0, 0], ant: 0, look: [0.3, 0], blink: 0, eyes: "open", mouth: "smile", stalks: 0, ground: true,
};

const S = (pts: P[], per = 6) => smooth(pts, true, per);
const O = (pts: P[], per = 6) => smooth(pts, false, per);
const rot = (q: P, o: P, deg: number): P => { const a = (deg * Math.PI) / 180, c = Math.cos(a), n = Math.sin(a); return [o[0] + (q[0] - o[0]) * c - (q[1] - o[1]) * n, o[1] + (q[0] - o[0]) * n + (q[1] - o[1]) * c]; };
const limb = (spine: P[], r0: number, r1: number) => taper(O(spine, 6), (t) => r0 + (r1 - r0) * t).outline;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------- la coquille (dans son repère : origine = sous l'ouverture)
// bulot : dernier tour large, spire de trois tours vers l'arrière et le haut, ouverture ovale à l'avant,
// canal siphonal en bas ; les bandes suivent les tours.
const WHORLS: [P, number, number, number][] = [[[-34, -46], 44, 36, -0.32], [[-68, -80], 22, 17, -0.5], [[-86, -97], 12.5, 10, -0.6], [[-96, -107], 6.5, 5.5, -0.6]];
const APERTURE: P[] = [[-2, -80], [10, -70], [15, -48], [12, -24], [2, -10], [-8, -16], [-12, -40], [-10, -66]];
const LIP: P[] = [[-4, -84], [12, -74], [19, -48], [16, -22], [4, -6], [-4, -10], [2, -24], [6, -48], [2, -70], [-8, -80]];
const drawShellBack = (g: Gfx, k: number, T: (p: P) => P, seed: number) => {
  const C = SHELLS[k], sc = C.k;
  const shapes = WHORLS.map(([c, rx, ry, rt], i) => { const q = T([c[0] * sc, c[1] * sc]); return blob(q[0], q[1], rx * sc, ry * sc, seed + i, 0.035, 18, rt); });
  fillShape(g, shift(shapes[0], 6, 8), SH, 0.2);
  [3, 2, 1, 0].forEach((i) => {
    cel(g, shapes[i], C.c, C.s, 5, i === 0 ? [blob(...T([-50 * sc, -64 * sc]), 16 * sc, 9 * sc, seed + 9, 0.1, 10, -0.4), C.l] : undefined);
    clipped(g, shapes[i], () => {
      const [c, rx, ry] = WHORLS[i];
      if (k === 0) for (let j = -1; j <= 1; j++) ink(g, O([[c[0] - rx * 0.95, c[1] + j * ry * 0.46 - rx * 0.2], [c[0], c[1] + j * ry * 0.52 + ry * 0.12], [c[0] + rx * 0.95, c[1] + j * ry * 0.46 + rx * 0.16]]).map(([x, y]) => T([x * sc, y * sc])), C.band, { w: 4 * (i ? 0.6 : 1), shadow: 0, taper: [0.2, 0.2], seed: seed + 20 + i * 3 + j }, 0.72);
      else for (let j = 0; j < 7; j++) { const a = (j / 7) * TAU + i; fillShape(g, blob(...T([(c[0] + Math.cos(a) * rx * 0.55) * sc, (c[1] + Math.sin(a) * ry * 0.5) * sc]), 3 * sc * (i ? 0.6 : 1), 2.4 * sc * (i ? 0.6 : 1), seed + 40 + i * 9 + j, 0.2, 7), "#ffffff", 0.75); }
    });
    // la suture entre deux tours : un trait intérieur fin
    contour(g, shapes[i], i ? 2.6 : 3.4, seed + 60 + i);
  });
  // le canal siphonal, court, sous l'ouverture
  const can = S([[-6, -14], [6, -8], [8, 0], [0, 2], [-6, -4]].map(([x, y]) => T([x * sc, y * sc])));
  cel(g, can, C.c, C.s, 2); contour(g, can, 2.4, seed + 70);
  // l'ouverture, sombre ; son labre (bord) clair
  const ap = S(APERTURE.map(([x, y]) => T([x * sc, y * sc])));
  fillShape(g, ap, "#4a2c1c"); fillShape(g, S(APERTURE.map(([x, y]) => T([(x - 4) * sc, (y + 2) * sc]))), "#2a1810", 0.6);
  ink(g, ap, INK, { w: 2.6, closed: true, shadow: 0.3, seed: seed + 80 });
  return { ap };
};
// le labre, devant le corps quand il rentre (il cache ce qui est dans la coquille)
const drawLip = (g: Gfx, k: number, T: (p: P) => P, seed: number) => {
  const C = SHELLS[k], sc = C.k, lip = S(LIP.map(([x, y]) => T([x * sc, y * sc])), 5);
  cel(g, lip, C.l, C.s, 2); contour(g, lip, 2.2, seed);
};
// une coquille vide posée (l'ancienne, ou la nouvelle avant qu'il y entre)
export const drawEmptyShell = (g: Gfx, k: number, x: number, y: number, tilt = 0, seed = 5000) => g.group("plain", () => {
  const T = (q: P): P => rot([x + q[0], y + q[1]], [x, y], tilt);
  fillShape(g, blob(x - 26 * SHELLS[k].k, y + 1, 52 * SHELLS[k].k, 7, seed - 1, 0.06, 14), SAND_SH, 0.3);
  drawShellBack(g, k, T, seed); drawLip(g, k, T, seed + 90);
});

// ---------------------------------------------------------------- un œil au bout de son pédoncule (comme ceux de la pieuvre)
const drawEye = (g: Gfx, c: P, r: number, p: HermitPose, seed: number) => {
  if (p.eyes === "happy") {
    // œil plissé de joie : le globe reste là (sinon le pédoncule serait nu), paupière fermée en arc bombé
    const s = blob(c[0], c[1], r, r * 0.9, seed, 0.02, 14);
    cel(g, s, "#ffffff", "#dfe6ee", 2.5); contour(g, s, Math.max(1.6, r * 0.26), seed + 4);
    ink(g, O([[c[0] - r * 0.7, c[1] + r * 0.25], [c[0] - r * 0.3, c[1] - r * 0.35], [c[0] + r * 0.3, c[1] - r * 0.35], [c[0] + r * 0.7, c[1] + r * 0.25]]), INK, { w: Math.max(2.4, r * 0.3), shadow: 0, taper: [0.22, 0.22], seed: seed + 6 });
    return;
  }
  if (p.blink > 0.55) { ink(g, O([[c[0] - r, c[1]], [c[0], c[1] + r * 0.6], [c[0] + r, c[1]]]), INK, { w: 2.8, shadow: 0, taper: [0.2, 0.2], seed }); return; }
  const s = blob(c[0], c[1], r, r * (1 - 0.8 * p.blink), seed, 0.02, 14);
  cel(g, s, "#ffffff", "#dfe6ee", 2.5);
  const pc: P = [c[0] + p.look[0] * r * 0.38, c[1] + p.look[1] * r * 0.38 + r * 0.12];
  clipped(g, s, () => {
    fillShape(g, blob(pc[0], pc[1], r * 0.58, r * 0.62, seed + 1, 0.02, 12), "#1f1a36");
    fillShape(g, blob(pc[0] - r * 0.24, pc[1] - r * 0.3, r * 0.24, r * 0.24, seed + 2, 0.02, 8), "#ffffff");
    fillShape(g, blob(pc[0] + r * 0.24, pc[1] + r * 0.26, r * 0.1, r * 0.1, seed + 3, 0.02, 6), "#ffffff", 0.9);
  });
  contour(g, s, Math.max(1.6, r * 0.26), seed + 4);
  ink(g, O([[c[0] - r - 1, c[1] - r * 0.25], [c[0] - r * 0.1, c[1] - r - 1.5], [c[0] + r * 0.9, c[1] - r * 0.5]]), INK, { w: Math.max(1.4, r * 0.26), shadow: 0, taper: [0.2, 0.5], seed: seed + 5, side: -1 });
};

// ---------------------------------------------------------------- une patte marcheuse : 3 articles et un dactyle pointu
const leg = (g: Gfx, T: (p: P) => P, base: P, knee: P, ankle: P, tip: P, w: number, dark: boolean, seed: number) => {
  const col = dark ? mix(HER, HER_S, 0.4) : HER;
  // le dactyle se courbe un peu vers l'avant avant de piquer le sable
  const mid: P = [lerp(ankle[0], tip[0], 0.55) + 3, lerp(ankle[1], tip[1], 0.55)];
  const a = S(limb([base, knee], w, w * 0.85).map(T), 4), b = S(limb([knee, ankle], w * 0.85, w * 0.72).map(T), 4), c = S(limb([ankle, mid, tip], w * 0.72, 0.6).map(T), 4);
  [a, b, c].forEach((part, i) => {
    cel(g, part, col, dark ? HER_D : HER_S, 1.6);
    // la bande claire au milieu de chaque article (elle suit l'article)
    if (i < 2) { const [p0, p1] = i ? [knee, ankle] : [base, knee], m: P = [lerp(p0[0], p1[0], 0.55), lerp(p0[1], p1[1], 0.55)], d = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]); clipped(g, part, () => fillShape(g, blob(...T(m), w * 0.7, w * 1.4, seed + 7 + i, 0.08, 8, d), BAND, dark ? 0.6 : 0.85)); }
    contour(g, part, dark ? 1.8 : 2.1, seed + i);
  });
  // l'articulation : un petit trait de jonction
  line(g, [T([knee[0] - 2, knee[1] - 2]), T([knee[0] + 2, knee[1] + 2])], 1.2, seed + 5);
};
const line = (g: Gfx, pts: P[], w: number, seed: number, color = INK, a = 0.85) => ink(g, pts, color, { w, shadow: 0, taper: [0.2, 0.3], seed }, a);

// ---------------------------------------------------------------- une pince (chélipède) : bras, carpe, paume, pouce fixe et doigt mobile
const cheliped = (g: Gfx, T: (p: P) => P, sh: P, deg: number, k: number, open: number, point: number, dark: boolean, seed: number) => {
  const R = (q: P) => T(rot(q, sh, deg)), col = dark ? mix(HER, HER_S, 0.35) : HER_L, sha = dark ? HER_D : HER;
  // coude et poignet (tendus quand il montre)
  const el: P = [sh[0] + lerp(16, 22, point) * k, sh[1] + lerp(6, -4, point) * k], wr: P = [el[0] + lerp(12, 18, point) * k, el[1] + lerp(4, -6, point) * k];
  const arm = S(limb([sh, el], 5.2 * k, 4.6 * k).map(R), 4), carp = S(limb([el, wr], 4.8 * k, 5.6 * k).map(R), 4);
  [arm, carp].forEach((pt, i) => { cel(g, pt, col, sha, 1.6); contour(g, pt, 2.1, seed + i); });
  // la paume (grosse, bombée), le pouce fixe en bas, le doigt mobile en haut qui pivote
  const d = lerp(0, -14, point) * Math.PI / 180, dir: P = [Math.cos(d), Math.sin(d)], at = (u: number, v: number): P => [wr[0] + (dir[0] * u - dir[1] * v) * k, wr[1] + (dir[1] * u + dir[0] * v) * k];
  const palm = S([at(-2, -8), at(10, -11), at(22, -9), at(27, -2), at(24, 6), at(10, 9), at(-1, 6)], 5).map(R);
  const thumb = S([at(22, -1), at(34, 0), at(44, 4), at(40, 6), at(28, 6), at(21, 5)], 5).map(R);
  const g0 = -open * 26 + point * 4, fp: P = at(20, -6), finger = S([at(20, -8), at(33, -10), at(44, -6), at(38, -3), at(26, -3), at(19, -3)], 5).map((q) => R(rot(q, fp, g0)));
  // le doigt mobile passe derrière la paume, le pouce devant
  cel(g, finger, col, sha, 1.4); contour(g, finger, 2, seed + 3);
  cel(g, palm, col, sha, 3, [S([at(4, -6), at(16, -8), at(20, -4), at(8, -2)], 4).map(R), mix(col, "#ffffff", 0.35)]);
  // granules de la paume
  clipped(g, palm, () => [[6, -2], [12, 2], [17, -4], [3, 3], [21, 2]].forEach(([u, v], i) => fillShape(g, blob(...R(at(u, v)), 1.5 * k, 1.5 * k, seed + 10 + i, 0.1, 6), BAND, 0.85)));
  contour(g, palm, 2.6, seed + 4);
  cel(g, thumb, col, sha, 1.4); contour(g, thumb, 2, seed + 5);
  // les petites dents du bord coupant
  line(g, [R(at(26, -1)), R(at(38, 2))], 1.1, seed + 6);
};

// ---------------------------------------------------------------- le personnage
// `part` : "tout" ; "corps" (seulement le crabe, ce qui est rentré dans la coquille est coupé) ; "coquille" (la
// coquille portée, son ombre et la coquille posée à côté). L'application pose la coquille (sprite fixe, qu'elle
// décale et tourne) et le corps (une image par pose) l'un sur l'autre : la pieuvre fait de même (pièces).
export const drawHermit = (g: Gfx, p: HermitPose, x: number, y: number, part: "tout" | "corps" | "coquille" = "tout") => g.group("plain", () => {
  const W = (q: P): P => rot([x + p.dx + q[0], y + p.dy + q[1]], [x + p.dx, y + p.dy], p.tilt); // repère du personnage
  const SHX = (q: P): P => W(rot([q[0] + p.sx, q[1] + p.sy], [p.sx, p.sy], p.stilt)); // repère de la coquille portée
  // le corps rentre dans la coquille le long de l'axe de l'ouverture
  // le corps est dessiné 1,25 fois plus grand que ses coordonnées (autour du point d'appui : les pattes restent sur le sable)
  const tuck = 1 - p.out, BS = 1.25, BX = (q: P): P => SHX([(q[0] + 4) * BS + p.bx - 78 * tuck, q[1] * BS + p.by + 26 * tuck]);
  // 0. ombre de contact
  const shellOn = part !== "corps", bodyOn = part !== "coquille";
  if (p.ground && shellOn) fillShape(g, blob(x + p.dx + p.sx - 18, y + p.dy + 1.5, 64 * SHELLS[p.shell].k, 8, 5199, 0.06, 14), SAND_SH, 0.3);
  // 1. la coquille posée à côté
  if (p.other && shellOn) drawEmptyShell(g, p.other.shell, x + p.other.x, y + p.other.y, p.other.tilt, 5300);
  // 2. ce qui est derrière : pattes lointaines, petite pince (côté lointain), antennes
  const bob = 0;
  const lift = (i: number) => p.legs[i] ?? 0;
  // chaque patte : le méros monte en avant (genou haut), le carpe redescend, le propode et le dactyle
  // (pointu, un peu courbé) vont au sable ; les pattes lointaines un peu en arrière des proches
  const legSet = [
    { b: [20, -34], k: [40, -50], a: [52, -34], t: [58, -1] }, { b: [12, -30], k: [26, -48], a: [34, -32], t: [36, -1] },
    { b: [22, -32], k: [48, -46], a: [64, -30], t: [72, -1] }, { b: [14, -28], k: [32, -44], a: [44, -28], t: [48, -1] },
  ] as { b: P; k: P; a: P; t: P }[];
  const L = (i: number) => { const q = legSet[i], h = lift(i) * 9; return [q.b, [q.k[0], q.k[1] - h], [q.a[0] + h * 0.3, q.a[1] - h], [q.t[0] + h * 0.5, q.t[1] - h * 0.8]] as P[]; };
  const shellParts = { k: p.shell };
  // l'intérieur : tout ce qui est « dans » la coquille est caché par le labre (dessiné après le corps)
  const body = () => {
    // les antennes (derrière la tête) : deux longues qui fouettent, deux antennules fourchues
    [0, 1].forEach((i) => { const w = Math.sin(TAU * p.ant + i * 1.3); const a = O([[30, -70], [44 + i * 6, -94 - i * 4 + 4 * w], [66 + i * 10, -104 - i * 6 + 9 * w], [86 + i * 8, -98 - i * 10 + 12 * Math.sin(TAU * p.ant + i + 0.8)]], 8).map(BX); ink(g, a, HER_S, { w: 2, shadow: 0, taper: [0.1, 0.95], seed: 5210 + i }); });
    [0, 1].forEach((i) => { const s0: P = [38, -64 + i * 3], s1: P = [50 + i * 3, -72 + i * 4 + 2 * Math.sin(TAU * p.ant + 2 + i)]; ink(g, [s0, s1].map(BX), HER_S, { w: 1.8, shadow: 0, taper: [0.2, 0.6], seed: 5215 + i }); [-1, 1].forEach((f) => ink(g, [s1, [s1[0] + 5, s1[1] + f * 2.5]].map(BX), HER_S, { w: 1.3, shadow: 0, taper: [0.3, 0.8], seed: 5217 + i * 2 + (f > 0 ? 1 : 0) })); });
    // pattes lointaines
    [0, 1].forEach((i) => { const [b, k, a, t] = L(i); leg(g, BX, b, k, a, t, 4.4, true, 5220 + i * 10); });
    // petite pince, côté lointain
    cheliped(g, BX, [22, -36], 10 + p.small, 0.62, 0.15, 0, true, 5250);
    // l'abdomen (quand il sort de la coquille) : mou, pâle, enroulé, avec ses segments
    if (p.naked > 0) {
      const n = p.naked, ab = S([[6, -44], [-6 * n - 4, -52], [-24 * n - 4, -48], [-34 * n - 4, -36], [-30 * n - 2, -24], [-18 * n, -22], [-10 * n + 2, -30], [6, -26]].map(([u, v]) => [u, v] as P), 6).map(BX);
      cel(g, ab, BELLY, BELLY_S, 4);
      clipped(g, ab, () => [0.3, 0.55, 0.8].forEach((t, i) => line(g, O([[6 - 30 * n * t, -50 + 4 * t], [2 - 30 * n * t, -40], [4 - 26 * n * t, -28]]).map(BX), 1.3, 5260 + i, BELLY_S, 0.9)));
      contour(g, ab, 2.2, 5265);
    }
    // le céphalothorax : le bouclier (dessus) et les flancs
    const shield = S([[2, -62], [14, -71], [30, -72], [44, -66], [50, -55], [44, -41], [26, -32], [8, -35], [0, -48]], 6).map(BX);
    fillShape(g, shift(shield, 3, 4), SH, 0.18);
    cel(g, shield, HER, HER_S, 4, [S([[10, -66], [22, -71], [32, -68], [26, -62], [14, -60]], 5).map(BX), HER_L]);
    // le sillon du bouclier, les taches claires
    // le sillon cervical (à l'arrière du bouclier, loin du visage), les taches claires, la joue
    clipped(g, shield, () => { line(g, O([[13, -69], [11, -58], [14, -46]]).map(BX), 1.4, 5270, HER_D, 0.6); [[20, -42], [8, -44], [26, -62]].forEach(([u, v], i) => fillShape(g, blob(...BX([u, v]), 2, 1.6, 5271 + i, 0.1, 6), BAND, 0.7)); fillShape(g, blob(...BX([37, -55]), 5, 3.2, 5274, 0.1, 8), "#ff3d5a", 0.4); });
    contour(g, shield, 2.6, 5275);
    // la bouche (sous les yeux, à l'avant du bouclier)
    if (p.mouth === "smile") ink(g, O([[40, -61], [44, -57.5], [48.5, -60.5]]).map(BX), INK, { w: 2.6, shadow: 0, taper: [0.25, 0.25], seed: 5280 });
    else { const m = S([[39, -62], [44, -59], [49, -62], [47.5, -55], [43, -53.5], [40, -56]], 5).map(BX); fillShape(g, m, "#6b1f2a"); clipped(g, m, () => fillShape(g, blob(...BX([43.5, -53.8]), 3.2, 2.2, 5281, 0.1, 6), "#ff8a8a")); ink(g, m, INK, { w: 1.8, closed: true, shadow: 0, seed: 5282 }); }
    // les pédoncules et les yeux (l'œil lointain d'abord)
    [0, 1].forEach((i) => {
      const base: P = [26 + i * 8, -68 + i * 1], top0: P = [23 + i * 11, -86 + i * 2], top = rot(top0, base, p.stalks + (i ? 4 : -4));
      const st = S(limb([base, top], 3.4, 2.6).map(BX), 4); cel(g, st, i ? HER_L : mix(HER, HER_S, 0.3), HER_S, 1); contour(g, st, 1.7, 5285 + i);
      drawEye(g, BX(top), i ? 12 : 11, p, 5290 + i * 10);
    });
    // pattes proches (devant le corps)
    [2, 3].forEach((i) => { const [b, k, a, t] = L(i); leg(g, BX, b, k, a, t, 5, false, 5320 + i * 10); });
    // la grosse pince, devant tout
    cheliped(g, BX, [28, -40], p.claw - lerp(0, 34, p.point), 1, p.open, p.point, false, 5360);
  };
  // la coquille portée (derrière, avec le bord de son ouverture), puis le corps : ce qui est rentré est coupé
  if (shellOn) { drawShellBack(g, p.shell, SHX, 5100); drawLip(g, p.shell, SHX, 5190); }
  if (!bodyOn) return;
  const C = SHELLS[p.shell];
  // ce qui est à droite du bord intérieur de l'ouverture est visible ; le reste est dans la coquille
  const cut = S([[-6 * C.k, -120], [200, -140], [200, 30], [-6 * C.k, 20], [-12 * C.k, -16 * C.k], [-14 * C.k, -44 * C.k], [-12 * C.k, -70 * C.k]], 4).map(SHX);
  if (p.naked > 0) body(); else clipped(g, cut, body);
  void bob; void shellParts;
});

// ---------------------------------------------------------------- gestes (12 images/s)
export type HermitClip = { name: string; frames: number; loop: boolean; pose: (f: number) => HermitPose; hold?: [number, number]; meta?: Record<string, unknown> };
const sn = (u: number, k = 1, ph = 0) => Math.sin(TAU * k * u + ph);
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const blinkAt = (f: number, at: number) => [0, 0.6, 1, 0.5][f - at] ?? 0;
// au repos : il respire, piétine un peu, ses antennes fouettent, sa grosse pince se soulève ; un clignement
const rest = (shell: number): HermitClip => ({
  name: shell ? "repos.b" : "repos", frames: 12, loop: true,
  pose: (f) => { const u = f / 12; return { ...HERMIT_REST, shell, dy: -1.2 * sn(u), stilt: 0, legs: [0.3 * Math.max(0, sn(u, 2)), 0, 0.4 * Math.max(0, sn(u, 2, Math.PI)), 0], ant: u, claw: -4 * Math.max(0, sn(u, 1, 0.6)), open: 0.25 + 0.15 * sn(u, 2), small: 3 * sn(u, 1, 1.4), look: [0.35, 0.05 * sn(u)], stalks: 2 * sn(u, 1, 0.3), blink: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0.4, 0, 0][f] }; },
});
// sortir de sa coquille : il rentre tout entier (on ne voit plus que la coquille qui bouge un peu), puis
// ressort, yeux d'abord, et regarde l'enfant
const sortir: HermitClip = {
  name: "sortir", frames: 14, loop: false,
  pose: (f) => {
    // 0-2 rentre, 3-6 caché (la coquille remue), 7-13 ressort, yeux d'abord
    const t = f / 13, out = f < 3 ? 1 - ease(f / 2) : f < 7 ? 0 : ease((f - 7) / 5);
    return { ...HERMIT_REST, out, stilt: f >= 3 && f < 7 ? 3 * Math.sin(f * 1.9) : 0, sy: f >= 3 && f < 7 ? -2 * Math.abs(Math.sin(f * 1.9)) : 0, legs: [1 - out, 1 - out, 1 - out, 1 - out], ant: t * 2, claw: -10 * (1 - out), open: 0.1, stalks: (1 - out) * -30 + (f >= 10 && f < 12 ? 6 : 0), look: f >= 9 ? [0.1, 0.2] : [0.4, 0], eyes: f >= 12 ? "happy" : "open", mouth: f >= 11 ? "open" : "smile" };
  },
};
// montrer : la grosse pince se tend vers l'avant, fermée (la pointe montre) ; boucle intérieure pendant le geste
const montrer: HermitClip = {
  name: "montrer", frames: 12, loop: false, hold: [4, 8],
  pose: (f) => {
    const w = f < 4 ? ease(f / 3) : f < 8 ? 1 : 1 - ease((f - 8) / 3), u = (f - 4) / 4;
    return { ...HERMIT_REST, point: w, open: 0.25 * (1 - w), claw: 3 * w * sn(u), dx: 3 * w, ant: f / 12, look: [0.6 * w + 0.3, 0.3 * w], small: -6 * w, legs: [0, 0.4 * Math.max(0, sn(f / 12, 1)), 0, 0], stalks: 6 * w };
  },
};
// se réjouir : les deux pinces se lèvent et claquent, il sautille, yeux plissés, bouche ouverte
const rejouir: HermitClip = {
  name: "rejouir", frames: 10, loop: false,
  pose: (f) => {
    const u = f / 10, w = Math.sin(Math.PI * Math.min(1, f / 9)), hop = Math.max(0, Math.sin(TAU * 2 * u));
    return { ...HERMIT_REST, dy: -9 * hop * w, sy: 0, claw: -38 * w + 8 * sn(u, 4) * w, open: 0.2 + 0.6 * Math.max(0, sn(u, 4)) * w, small: -42 * w + 6 * sn(u, 4, 1) * w, eyes: w > 0.35 ? "happy" : "open", mouth: w > 0.3 ? "open" : "smile", ant: u * 2, legs: [hop * 0.8, hop * 0.5, hop, hop * 0.6], ground: true, stalks: 8 * w * sn(u, 2) };
  },
};
// changer de coquille : une coquille plus grande l'attend à droite ; il en fait le tour des yeux, sort de
// son bulot (on voit son abdomen mou), va s'y glisser à reculons, et se réjouit. `meta.to` : où il est à la
// fin (l'application le pose là, dans la nouvelle coquille) ; l'ancienne coquille reste posée.
const NEW_X = 120;
const changer: HermitClip = {
  name: "changer", frames: 20, loop: false, meta: { to: [NEW_X, 0], vide: [0, 0] },
  pose: (fr) => {
    // en 20 images (sur le rythme de 36) : regarde la nouvelle coquille ; sort (le corps avance, l'abdomen
    // apparaît) ; marche vers elle ; y entre à reculons (la coquille se soulève un peu) ; content
    const f = [0, 3, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 27, 28, 29, 31, 33, 34, 35][fr];
    const see = ease(f / 6), exit = ease((f - 8) / 7), walk = ease((f - 16) / 9), enter = ease((f - 26) / 5), joy = ease((f - 32) / 3);
    const bodyX = 18 * exit + (NEW_X - 18) * walk, inNew = f >= 26;
    const step = f >= 16 && f < 26 ? Math.max(0, Math.sin(Math.PI * (f - 16) / 2)) : 0;
    const base = { ...HERMIT_REST, ant: f / 18, look: [0.8 * see, 0.1] as P, stalks: 8 * see * (1 - exit), legs: [step, 1 - step, 1 - step, step].map((v) => (f >= 16 && f < 26 ? v * 0.8 : 0)), eyes: (joy > 0.4 ? "happy" : "open") as HermitPose["eyes"], mouth: (joy > 0.3 || (f >= 3 && f < 8) ? "open" : "smile") as HermitPose["mouth"], claw: -30 * joy, small: -30 * joy };
    if (!inNew) return { ...base, shell: 0, other: { shell: 1, x: NEW_X, y: 0, tilt: 0 }, bx: bodyX, by: -2 * exit * (1 - walk), naked: exit, out: 1, ground: false };
    // dans la nouvelle coquille : le repère du personnage est posé sur elle ; l'ancienne est à -NEW_X
    return { ...base, shell: 1, dx: NEW_X, other: { shell: 0, x: 0, y: 0, tilt: 0 }, naked: 1 - enter, out: 0.6 + 0.4 * enter, sy: -4 * Math.sin(Math.PI * enter), stilt: -4 * Math.sin(Math.PI * enter), ground: true };
  },
};
export const HERMIT_CLIPS: HermitClip[] = [rest(0), rest(1), sortir, montrer, rejouir, changer];
