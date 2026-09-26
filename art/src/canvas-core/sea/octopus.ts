// LA PIEUVRE · le module du personnage (mascotte de l'application).
//
// Une seule source de vérité : la géométrie de la scène de référence (`ocean.ts` : manteau, yeux,
// paupières, joues, bouche, les huit bras et leurs ventouses) et la main du marqueur
// (`oceanMarker.ts` : aplats, une ombre nette par forme, contour qui s'épaissit à l'opposé de la
// lumière). Ce module ne redessine rien d'autre : il POSE le personnage. Une pose, c'est la
// position des huit bras (angle de départ, courbure, enroulement de la pointe, longueur), le
// corps (inclinaison, décalage, écrasement) et le visage (yeux, regard, paupières, bouche).
//
// Anatomie tenue (voir ocean.ts) : le dôme est le MANTEAU, pas une tête ; les yeux sont bas sur les
// côtés, juste au-dessus du départ des bras ; huit bras partent d'un anneau sous la tête, chacun
// effilé jusqu'à une pointe fine qui s'enroule ; deux rangées de ventouses sur la face INTERNE,
// visibles seulement quand un bras se retourne. Les gestes lèvent des bras : c'est alors la face
// interne qui se présente, donc les ventouses se voient (c'est juste, pas décoratif).
//
// Horloge : les boucles sont dessinées à 12 images/s (animation « en deux », comme au dessin animé).
// Le repos dure 36 images (3 s) ; un geste commence et finit sur une phase connue du repos, pour que
// l'application enchaîne sans saut (voir `OCTO_CLIPS`).
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, OCT, OCT_L, OCT_S, shift } from "../oceanMarker";

const SUCK = "#ffe0d2", SUCK_S = "#f0a894";
export const OCTO_FPS = 12;
export const IDLE_N = 36;

export type ArmP = { th: number; bend: number; curl: number; len: number };
export type OctoPose = {
  s: number; tilt: number; dx: number; dy: number; sx: number; sy: number; // corps
  arms: ArmP[];
  eyes: "open" | "happy" | "winkR"; blink: number; look: P; lid: [number, number]; // visage
  mouth: "smile" | "open" | "hmm"; cheek: number;
};

// ---------------------------------------------------------------- repos
// Les bras 0..6 sont ceux de la référence. Le bras 5 (qui salue) et le bras 7 (qui montre) sont
// ramenés en position détendue : au repos la pieuvre ne montre rien, elle flotte.
const REST_ARMS: ArmP[] = O.ARM_SPECS.map((a) => ({ th: a.th, bend: a.bend, curl: a.curl, len: a.len }));
REST_ARMS[5] = { th: 2.62, bend: 0.75, curl: 2.5, len: 150 };
REST_ARMS[7] = { th: 0.62, bend: -0.55, curl: -2.9, len: 150 };
export const POINT_ARM: ArmP = { th: O.ARM_SPECS[7].th, bend: O.ARM_SPECS[7].bend, curl: O.ARM_SPECS[7].curl, len: O.ARM_SPECS[7].len };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpArm = (a: ArmP, b: ArmP, t: number): ArmP => ({ th: lerp(a.th, b.th, t), bend: lerp(a.bend, b.bend, t), curl: lerp(a.curl, b.curl, t), len: lerp(a.len, b.len, t) });
const TAU = Math.PI * 2;
// chaque bras respire à sa propre phase (décalage 0,9 rad d'un bras au suivant : aucun ne bouge en même temps)
// Le décalage est un nombre entier d'images (5 sur 36, soit 0,87 rad, au lieu de 0,9 dans la référence) et
// la courbure suit la même onde que la pointe : un bras repasse alors par les mêmes poses à l'aller et au
// retour, et l'export ne fabrique que ~19 poses par bras au lieu de 36 (moitié moins de mémoire).
const breathe = (arms: ArmP[], u: number, k = 1): ArmP[] => arms.map((a, i) => {
  const ph = TAU * ((Math.round(u * IDLE_N) + 5 * i) % IDLE_N) / IDLE_N, w = Math.sin(ph), amp = O.AMP[i] * k;
  return { ...a, curl: a.curl + amp * w * (a.curl >= 0 ? 1 : -1), bend: a.bend + amp * 0.35 * w };
});
const restBody = (u: number) => ({ tilt: -6 + 2.2 * Math.sin(TAU * u + 1.1) });
export const restPose = (u: number, s = 1.12): OctoPose => ({
  s, tilt: restBody(u).tilt, dx: 0, dy: 0, sx: 1, sy: 1, arms: breathe(REST_ARMS, u),
  eyes: "open", blink: 0, look: [0, 0], lid: [0, 0], mouth: "smile", cheek: 0.55,
});

// ---------------------------------------------------------------- dessin (la main du marqueur, reprise de oceanMarker)
type Arm = O.Arm;
type Place = (q: P) => P;
const buildArm = (p: OctoPose, i: number, place: Place): Arm => {
  const a = p.arms[i], spec = O.ARM_SPECS[i], spine = O.armSpine(spec.base, a.th, a.bend, a.curl, a.len), t = O.taper(spine, (v) => 2.4 + (spec.r0 - 2.4) * Math.pow(1 - v, 0.85));
  const side: P[] = []; for (let k = Math.round(spine.length * 0.38); k < spine.length - 3; k += 2) side.push([spine[k][0] - t.nrm[k][0] * t.r[k] * 0.45 * spec.under, spine[k][1] - t.nrm[k][1] * t.r[k] * 0.45 * spec.under]);
  const S = p.s * (p.sx + p.sy) / 2;
  return { spine: spine.map(place), r: t.r.map((v) => v * S), outline: t.outline.map(place), side: side.map(place), under: spec.under, front: spec.front };
};
const armFill = (g: Gfx, a: Arm, lit: string, shade: string) => cel(g, a.outline, lit, shade, 5);
const suckers = (g: Gfx, a: Arm, seed: number) => a.side.forEach((p, k) => { const r = O.suckerR(a, k), s = blob(p[0], p[1], r, r * 0.9, seed + k, 0.05, 10); fillShape(g, s, SUCK_S); fillShape(g, shift(s, -r * 0.2, -r * 0.25), SUCK); ink(g, s, mix(OCT_S, INK, 0.3), { w: Math.max(1, r * 0.28), closed: true, shadow: 0, seed: seed + 50 + k }, 0.8); });
const armLine = (g: Gfx, a: Arm, w: number, seed: number) => { const n = a.outline.length; contour(g, a.outline.slice(3, n - 3), w, seed, false); };

// le rebord : la partie basse du contour du manteau, et le croissant qu'elle borde (bord intérieur en arc)
const RIM: P[] = (() => { const k = O.MANTLE.findIndex(([, y]) => y > 30), out: P[] = []; for (let i = 0; i < O.MANTLE.length; i++) { const q = O.MANTLE[(k + i) % O.MANTLE.length]; if (q[1] > 30) out.push(q); else if (out.length) break; } return out; })();
const LIP: P[] = [...RIM, ...Array.from({ length: 21 }, (_, i) => { const x = RIM[RIM.length - 1][0] + ((RIM[0][0] - RIM[RIM.length - 1][0]) * i) / 20; return [x, 30 + 18 * (1 - (x / 88) ** 2)] as P; })];

// ---- les pièces, chacune dessinée seule (l'application les recompose ; drawOctopus les enchaîne)
// l'écrasement se fait autour de l'anneau des bras (y = 60) : quand elle rebondit, le dôme s'aplatit
const placer = (p: OctoPose, cx: number, cy: number): Place => { const a = (p.tilt * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a), S = p.s; return (q) => { const x = q[0] * p.sx * S, y = (60 + (q[1] - 60) * p.sy) * S; return [cx + p.dx + x * c - y * sn, cy + p.dy + x * sn + y * c]; }; };
const scaleOf = (p: OctoPose) => p.s * (p.sx + p.sy) / 2;
const drawArm = (g: Gfx, p: OctoPose, i: number, place: Place) => g.group("plain", () => {
  const q = buildArm(p, i, place);
  if (!q.front) { armFill(g, q, mix(OCT, OCT_S, 0.35), mix(OCT_S, INK, 0.2)); armLine(g, q, 4, 600 + i); }
  else { armFill(g, q, OCT, OCT_S); suckers(g, q, 700 + (i - 4) * 60); armLine(g, q, 4.6, 660 + i - 4); }
});
const drawMantle = (g: Gfx, p: OctoPose, place: Place) => g.group("plain", () => {
  const M = O.MANTLE.map(place), SS = scaleOf(p);
  cel(g, M, OCT, OCT_S, 12);
  clipped(g, M, () => { fillShape(g, O.MANTLE_LIT.map(place), OCT_L, 0.75); O.SPOTS.forEach(([x, y, r], i) => { const q = place([x, y]); fillShape(g, blob(q[0], q[1], r * SS, r * SS * 0.85, 620 + i, 0.15, 8), OCT_S, 0.7); }); });
  ink(g, O.GLOSS.map(place), "#ffffff", { w: 7, shadow: 0, taper: [0.35, 0.45], seed: 640 }, 0.85);
  fillShape(g, blob(...place([-20, -104]), 7, 4, 641, 0.1, 8, -0.4), "#ffffff", 0.85);
  contour(g, M, 6.2, 650);
});
// Le rebord du manteau, repassé PAR-DESSUS la racine des bras de devant : les bras sortent de sous la
// tête (c'est là qu'ils s'attachent), et le bout coupé d'un bras levé ne se voit plus sur la joue.
const drawLip = (g: Gfx, place: Place) => g.group("plain", () => {
  clipped(g, LIP.map(place), () => cel(g, O.MANTLE.map(place), OCT, OCT_S, 12));
  contour(g, RIM.map(place), 6.2, 651, false);
});
const drawCheeks = (g: Gfx, p: OctoPose, place: Place) => g.group("plain", () => { const SS = scaleOf(p); O.CHEEKS.forEach((c, i) => { const q = place(c); fillShape(g, blob(q[0], q[1], 15 * SS / 1.12, 9 * SS / 1.12, 800 + i, 0.1, 10), "#ff5d6c", p.cheek); }); });
const drawEye = (g: Gfx, p: OctoPose, i: number, place: Place) => g.group("plain", () => {
  const e = O.EYES[i], SS = scaleOf(p), c = place(e.c), rx = e.rx * SS, ry = e.ry * SS;
  const happy = p.eyes === "happy" || (p.eyes === "winkR" && i === 1);
  if (happy) {
    // œil plissé de joie : un arc bombé vers le haut, épais, avec le pli de la paupière dessous
    ink(g, smooth([[c[0] - rx * 0.95, c[1] + 6], [c[0] - rx * 0.45, c[1] - 7], [c[0] + rx * 0.45, c[1] - 7], [c[0] + rx * 0.95, c[1] + 6]], false, 6), INK, { w: 4.6, shadow: 0, taper: [0.22, 0.22], seed: 880 + i });
    ink(g, smooth([[c[0] - rx * 0.5, c[1] + 10], [c[0], c[1] + 6], [c[0] + rx * 0.5, c[1] + 10]], false, 5), mix(OCT_S, INK, 0.35), { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 885 + i }, 0.8);
    return;
  }
  if (p.blink > 0.55) { ink(g, smooth([[c[0] - rx, c[1] + 2], [c[0], c[1] + 9], [c[0] + rx, c[1] + 2]], false, 6), INK, { w: 3.6, shadow: 0, taper: [0.2, 0.2], seed: 855 + i }); return; }
  const s = blob(c[0], c[1], rx, ry * (1 - 0.8 * p.blink), 810 + i, 0.02, 16);
  cel(g, s, "#ffffff", "#dfe6ee", 3);
  const pc: P = [c[0] + 3 + p.look[0], c[1] + 4 + p.look[1]], pu = blob(pc[0], pc[1], rx * 0.62, ry * 0.66, 820 + i, 0.02, 14);
  clipped(g, s, () => { fillShape(g, pu, "#1f1a36"); fillShape(g, blob(pc[0] - 5, pc[1] - 7, 5.4, 5.4, 830 + i, 0.02, 10), "#ffffff"); fillShape(g, blob(pc[0] + 5, pc[1] + 6, 2.4, 2.4, 840 + i, 0.02, 8), "#ffffff", 0.9); });
  contour(g, s, 3.4, 850 + i);
  ink(g, O.LIDS[i].map(([x, y]) => place([x, y + p.lid[i]])), INK, { w: 3.2, shadow: 0, taper: [0.2, 0.5], seed: 860 + i, side: -1 });
});
const drawMouth = (g: Gfx, p: OctoPose, place: Place) => g.group("plain", () => {
  const SS = scaleOf(p);
  if (p.mouth === "smile") ink(g, O.MOUTH.map(place), INK, { w: 3.6, shadow: 0, taper: [0.25, 0.25], seed: 870 });
  else if (p.mouth === "hmm") ink(g, smooth([[-8, 46], [0, 42], [8, 46], [17, 42]], false, 6).map(place), INK, { w: 3.4, shadow: 0, taper: [0.25, 0.3], seed: 871 });
  else {
    // bouche ouverte de joie : lèvre haute en sourire, fond sombre, langue qui dépasse du bas
    const m = smooth([[-15, 39], [-5, 42], [5, 42], [15, 38], [12, 50], [4, 57], [-5, 57], [-12, 50]], true, 6).map(place);
    fillShape(g, m, "#5b1b33");
    clipped(g, m, () => fillShape(g, blob(...place([1, 57]), 10 * SS, 6.5 * SS, 872, 0.08, 10), "#ff8d95"));
    ink(g, m, INK, { w: 3.2, closed: true, shadow: 0.3, light: O.LIGHT, seed: 873 });
  }
});

// Une pose découpée en pièces, dans l'ordre de peinture. Chaque pièce porte une clé : deux pièces de même
// clé sont les mêmes pixels (l'export ne les fabrique qu'une fois). Les pièces sont dessinées droites ; la
// pose donne à part l'inclinaison, le décalage et l'écrasement que l'application applique au tout.
export type Part = { layer: string; key: string; draw: (g: Gfx, cx: number, cy: number) => void };
export type Transform = { tilt: number; dx: number; dy: number; sx: number; sy: number };
const q4 = (v: number) => v.toFixed(4);
export const octoParts = (p: OctoPose): { parts: Part[]; tf: Transform } => {
  const flat: OctoPose = { ...p, tilt: 0, dx: 0, dy: 0, sx: 1, sy: 1 }, at = (cx: number, cy: number) => placer(flat, cx, cy);
  const arm = (i: number): Part => { const a = p.arms[i]; return { layer: `bras.${i}`, key: [a.th, a.bend, a.curl, a.len].map(q4).join(","), draw: (g, cx, cy) => drawArm(g, flat, i, at(cx, cy)) }; };
  const eyeKey = (i: number) => { const happy = p.eyes === "happy" || (p.eyes === "winkR" && i === 1); return happy ? "joie" : p.blink > 0.55 ? "ferme" : `${q4(p.blink)}|${p.look.map(q4)}|${q4(p.lid[i])}`; };
  return {
    parts: [
      arm(0), arm(1), arm(2), arm(3),
      { layer: "manteau", key: "-", draw: (g, cx, cy) => drawMantle(g, flat, at(cx, cy)) },
      arm(4), arm(5), arm(6), arm(7),
      { layer: "levre", key: "-", draw: (g, cx, cy) => drawLip(g, at(cx, cy)) },
      { layer: "joues", key: q4(p.cheek), draw: (g, cx, cy) => drawCheeks(g, flat, at(cx, cy)) },
      { layer: "oeil.0", key: eyeKey(0), draw: (g, cx, cy) => drawEye(g, flat, 0, at(cx, cy)) },
      { layer: "oeil.1", key: eyeKey(1), draw: (g, cx, cy) => drawEye(g, flat, 1, at(cx, cy)) },
      { layer: "bouche", key: p.mouth, draw: (g, cx, cy) => drawMouth(g, flat, at(cx, cy)) },
    ],
    tf: { tilt: p.tilt, dx: p.dx, dy: p.dy, sx: p.sx, sy: p.sy },
  };
};
// l'anneau des bras, autour duquel se fait l'écrasement (en px logiques depuis le centre du manteau)
export const RING_Y = 60;

// La pieuvre entière, avec le centre de son manteau en (cx, cy) du calque (planche de modèle, contrôles).
export const drawOctopus = (g: Gfx, p: OctoPose, cx: number, cy: number) => {
  const place = placer(p, cx, cy);
  [0, 1, 2, 3].forEach((i) => drawArm(g, p, i, place));
  drawMantle(g, p, place);
  [4, 5, 6, 7].forEach((i) => drawArm(g, p, i, place));
  drawLip(g, place); drawCheeks(g, p, place); drawEye(g, p, 0, place); drawEye(g, p, 1, place); drawMouth(g, p, place);
};

// ---------------------------------------------------------------- gestes
// Un clip = une suite d'images. `entry` : la phase du repos (image 0..35) où il commence ; `exit` : celle
// où il rend la main au repos. `hold` : une boucle intérieure (montrer, réfléchir) que l'application
// répète tant que le geste dure. Chaque bras modifié passe du repos au geste par une enveloppe w.
export type Clip = { name: string; frames: number; entry: number; exit: number; hold?: [number, number]; pose: (f: number) => OctoPose };
const ease = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };
// enveloppe : montée en `a` images, descente sur les `b` dernières
const env = (f: number, n: number, a: number, b: number) => Math.min(ease(f / a), ease((n - 1 - f) / b)); // 0 à la première ET à la dernière image
const sinT = (f: number, n: number, k: number, ph = 0) => Math.sin((TAU * k * f) / n + ph);

const idle: Clip = {
  name: "repos", frames: IDLE_N, entry: 0, exit: 0,
  pose: (f) => { const p = restPose(f / IDLE_N); p.blink = [0, 0.6, 1, 0.5][Math.max(0, f - 25)] ?? 0; return p; },
};

// Saluer : le bras 5 se lève à gauche, pointe en l'air, et la pointe balance deux fois (le « coucou »).
const wave: Clip = {
  name: "saluer", frames: 36, entry: 0, exit: 0,
  pose: (f) => {
    const n = 36, u = f / IDLE_N, w = env(f, n, 6, 7), p = restPose(u), up: ArmP = { th: 3.6, bend: 0.95, curl: 1.3 + 0.9 * sinT(f, n, 3), len: 178 };
    up.bend += 0.28 * sinT(f, n, 3, -0.8);
    p.arms[5] = lerpArm(p.arms[5], up, w);
    p.tilt += -4 * w; p.mouth = w > 0.4 ? "open" : "smile"; p.look = [-4 * w, -2 * w]; p.cheek = 0.55 + 0.2 * w;
    return p;
  },
};

// Montrer : le bras 7 se tend vers la droite et le bas (la ligne de l'exercice), la pointe se relève.
const point: Clip = {
  name: "montrer", frames: 60, entry: 0, exit: 24, hold: [12, 48],
  pose: (f) => {
    const u = f / IDLE_N, w = f < 12 ? ease(f / 9) : f < 48 ? 1 : ease((59 - f) / 11), p = restPose(u);
    const tgt = { ...POINT_ARM, curl: POINT_ARM.curl + 0.12 * Math.sin(TAU * u) };
    p.arms[7] = lerpArm(p.arms[7], tgt, w);
    p.look = [5 * w, 3 * w]; p.tilt += 3 * w;
    return p;
  },
};

// Se réjouir : les quatre bras de devant montent, deux petits bonds (écrasement à l'atterrissage), yeux plissés.
// les bras de devant en V (« youpi ») : ils partent sur le côté et montent à 45°, la pointe se recourbe
const JOY: [number, ArmP][] = [[4, { th: 2.55, bend: 0.85, curl: 0.95, len: 150 }], [5, { th: 3.35, bend: 1.2, curl: 0.6, len: 180 }], [6, { th: 0.62, bend: -0.9, curl: -0.95, len: 150 }], [7, { th: -0.18, bend: -1.25, curl: -0.6, len: 170 }]];
const joy: Clip = {
  name: "rejouir", frames: 36, entry: 0, exit: 0,
  pose: (f) => {
    const n = 36, u = f / IDLE_N, w = env(f, n, 5, 7), p = restPose(u);
    JOY.forEach(([i, a], k) => { p.arms[i] = lerpArm(p.arms[i], { ...a, curl: a.curl + 0.5 * sinT(f, n, 4, k * 1.3) * Math.sign(a.curl) }, w); });
    [0, 1].forEach((i) => { p.arms[i] = { ...p.arms[i], th: p.arms[i].th + (i ? -0.35 : 0.35) * w }; });
    // deux bonds : hauteur |sin|, écrasement quand elle touche le bas de la trajectoire
    const hop = Math.abs(Math.sin((Math.PI * 2 * Math.min(f, 30)) / 30)), land = 1 - hop;
    p.dy = -26 * hop * w; p.sy = 1 + (0.06 * hop - 0.07 * land * land) * w; p.sx = 1 - (0.04 * hop - 0.05 * land * land) * w;
    p.eyes = w > 0.3 ? "happy" : "open"; p.mouth = w > 0.3 ? "open" : "smile"; p.cheek = 0.55 + 0.25 * w; p.tilt += 3 * sinT(f, n, 2) * w;
    return p;
  },
};

// Réfléchir : le bras 6 remonte le long du manteau et sa pointe se gratte le haut de la tête ; regard en l'air,
// une paupière relevée, la bouche de travers. Pas de tristesse : elle cherche.
const THINK: ArmP = { th: 0.57, bend: -3.6, curl: -0.5, len: 200 }; // résolu : le bras longe le côté du manteau sans le couvrir, la pointe se pose en (76, -34)
const think: Clip = {
  name: "reflechir", frames: 60, entry: 0, exit: 24, hold: [12, 48],
  pose: (f) => {
    const u = f / IDLE_N, w = f < 12 ? ease(f / 10) : f < 48 ? 1 : ease((59 - f) / 11), p = restPose(u);
    const tap = f >= 12 && f < 48 ? 0.09 * Math.sin((TAU * (f - 12)) / 6) : 0; // gratte : deux allers-retours par seconde
    p.arms[6] = lerpArm(p.arms[6], { ...THINK, curl: THINK.curl + tap }, w);
    p.look = [-6 * w, -10 * w]; p.lid = [-4 * w, 2 * w]; p.mouth = w > 0.5 ? "hmm" : "smile"; p.tilt += 5 * w; p.cheek = 0.55 - 0.35 * w;
    return p;
  },
};

// Encourager : le bras 7 se lève, pointe enroulée serrée (un poing), et fait deux « allez ! » ; clin d'œil.
const CHEER: ArmP = { th: 0.15, bend: -1.5, curl: -5.2, len: 150 };
const cheer: Clip = {
  name: "encourager", frames: 36, entry: 0, exit: 0,
  pose: (f) => {
    const n = 36, u = f / IDLE_N, w = env(f, n, 6, 7), p = restPose(u), pump = Math.max(0, sinT(f - 6, 24, 2));
    p.arms[7] = lerpArm(p.arms[7], { ...CHEER, bend: CHEER.bend - 0.35 * pump * (f > 6 && f < 30 ? 1 : 0) }, w);
    p.eyes = f >= 14 && f < 22 ? "winkR" : "open"; p.mouth = w > 0.4 ? "open" : "smile"; p.tilt += (4 - 2 * pump) * w; p.dy = -6 * pump * w;
    return p;
  },
};

// Arrondis du visage (regard et paupières au pixel, joues au vingtième) : moins de variantes d'yeux à fabriquer.
const tidy = (c: Clip): Clip => ({ ...c, pose: (f) => { const p = c.pose(f); return { ...p, look: [Math.round(p.look[0]), Math.round(p.look[1])], lid: [Math.round(p.lid[0]), Math.round(p.lid[1])], cheek: Math.round(p.cheek * 20) / 20 }; } });
export const OCTO_CLIPS: Clip[] = [idle, wave, point, joy, think, cheer].map(tidy);
