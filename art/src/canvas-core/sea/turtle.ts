// LA TORTUE DE MER · le module du personnage guide du module 1 (ligne graduée).
//
// Réalisme (craft bar, `references/realism-and-craft.md`) : une jeune tortue verte stylisée, d'après
// l'anatomie connue de l'espèce (aucune photographie ouverte pour ce dessin : l'écaillure suit le schéma
// classique des carapaces de chéloniens). Vue de trois quarts, un peu de dessus, tête de profil vers la
// droite (elle saute vers les nombres qui grandissent). Parties nommées :
//   - carapace en dôme ovale : 5 écailles vertébrales sur l'arête, 4 costales de chaque côté (on voit
//     celles du côté proche), un bord de petites écailles marginales ;
//   - plastron (ventre) clair, visible sous le bord ;
//   - tête : bec corné (la mâchoire supérieure recouvre l'inférieure), narine près de la pointe, une paire
//     d'écailles préfrontales sur le museau (signe de la tortue verte), grand œil, écaille de joue ;
//   - nageoires avant longues en palette, une griffe au bord d'attaque ; nageoires arrière courtes et
//     arrondies ; queue courte.
// Même main que la pieuvre (oceanMarker.ts) : aplats, une ombre nette par forme, contour qui s'épaissit à
// l'opposé de la lumière (en haut à gauche). Origine du dessin : sous le plastron, là où elle se pose.
import type { Gfx, P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";

const SKIN = "#9fd37c", SKIN_S = "#5c9a4c", SKIN_D = "#4a8540";
const SHELL = "#d08c42", SHELL_S = "#9a5f27", SHELL_L = "#e8ab5e", SCUTE = "#6e4219";
const BELLY = "#f6e2a4", BELLY_S = "#d9ba70";
export const TURTLE_FPS = 12;

export type TurtlePose = {
  s: number; dx: number; dy: number; pitch: number; sx: number; sy: number; // corps (pitch en degrés, nez vers le bas si > 0)
  front: number; frontFar: number; rear: number; // angles des nageoires (degrés) : 0 vers le bas et l'avant, 28 droit en bas, 90 et plus vers l'arrière
  head: number; blink: number; happy: boolean; // tête : décalage vertical ; clignement 0..1 ; yeux plissés
  ground?: boolean; // posée : ombre de contact sous le ventre
};
export const TURTLE_REST: TurtlePose = { s: 1, dx: 0, dy: 0, pitch: 0, sx: 1, sy: 1, front: 72, frontFar: 64, rear: 0, head: 0, blink: 0, happy: false };

// ---------------------------------------------------------------- géométrie (locale, origine sous le ventre)
const SHELL_OUT: P[] = smooth([[-38, -16], [-35, -27], [-24, -37], [-6, -42], [13, -41], [27, -35], [34, -25], [33, -17], [19, -10], [0, -7], [-18, -8], [-32, -10]], true, 8);
const SHELL_LIT: P[] = smooth([[-31, -23], [-22, -33], [-6, -39], [10, -38], [18, -32], [8, -26], [-8, -23], [-22, -20]], true, 6);
// l'arête des vertébrales, vue un peu de dessus : elle court près du haut du dôme
const RIDGE: P[] = smooth([[-32, -21], [-16, -33], [2, -37], [19, -33], [31, -24]], false, 8);
// le bord marginal : courbe intérieure parallèle au bas de la carapace
const RIM_IN: P[] = smooth([[-33, -19], [-24, -14], [-8, -12], [8, -13], [22, -16], [31, -22]], false, 8);
const RIM_OUT: P[] = smooth([[-36, -16], [-27, -10], [-8, -7], [10, -8], [24, -12], [33, -18]], false, 8);
const PLASTRON: P[] = smooth([[-26, -9], [-10, -7], [8, -7], [22, -11], [18, -4], [4, 0], [-12, 0], [-23, -4]], true, 6);
const HEAD: P[] = smooth([[33, -21], [36, -36], [45, -43], [56, -41], [63, -35], [66, -29], [61, -23], [51, -20], [41, -17], [34, -14]], true, 8);
const HEAD_LIT: P[] = smooth([[38, -33], [45, -40], [55, -39], [58, -34], [48, -31], [40, -28]], true, 6);
const NECK: P[] = smooth([[26, -22], [36, -24], [41, -16], [30, -10]], true, 5);
const EYE: { c: P; rx: number; ry: number } = { c: [51, -33.5], rx: 6.5, ry: 7.2 };
const MOUTH: P[] = smooth([[65.5, -27], [61, -24], [55, -23], [50.5, -24.5]], false, 6);
// nageoire avant, dans son repère : racine en (0, 0), le long de +x ; bord d'attaque en haut
const FLIP: P[] = smooth([[0, -7], [10, -10], [22, -9], [33, -4], [40, 3], [32, 7], [20, 10], [9, 9], [0, 6]], true, 6);
const FLIP_R: P[] = smooth([[0, -5], [8, -6], [15, -3], [18, 2], [12, 6], [4, 6], [0, 4]], true, 6);

// ---------------------------------------------------------------- dessin
export const drawTurtle = (g: Gfx, p: TurtlePose, x: number, y: number) => {
  const a = (p.pitch * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a), S = p.s;
  // écrasement depuis le sol (y = 0), puis bascule autour du centre de la carapace, puis position
  const place = (q: P): P => { const X = q[0] * p.sx * S, Y = q[1] * p.sy * S, cy = -28 * p.sy * S; return [x + p.dx + X * c - (Y - cy) * sn, y + p.dy + cy + X * sn + (Y - cy) * c]; };
  const PP = (pts: P[]) => pts.map(place);
  // une nageoire : sa forme tournée de `deg` autour de sa racine (0 = pendante vers le bas et l'avant)
  const flipper = (shape: P[], root: P, deg: number, len: number) => { const t = ((deg + 62) * Math.PI) / 180, k = len / 40; return PP(shape.map(([u, v]) => [root[0] + (u * Math.cos(t) - v * Math.sin(t)) * k, root[1] + (u * Math.sin(t) + v * Math.cos(t)) * k] as P)); };
  const farFront = flipper(FLIP, [18, -14], p.frontFar - 14, 30), farRear = flipper(FLIP_R, [-22, -11], p.rear - 8, 15);
  const nearFront = flipper(FLIP, [22, -13], p.front, 40), nearRear = flipper(FLIP_R, [-25, -10], p.rear, 19);
  const tail = PP(smooth([[-33, -13], [-44, -10], [-33, -8]], true, 4));
  // 0. posée sur une bouée : ombre de contact sous le ventre (elle ne suit pas l'écrasement)
  if (p.ground) g.group("plain", () => fillShape(g, blob(x + p.dx - 2 * S, y + p.dy + 1.5 * S, 21 * S, 4 * S, 899, 0.08, 12), "#0a3f49", 0.28));
  // 1. ce qui est derrière la carapace : nageoires du côté lointain, queue
  g.group("plain", () => {
    [farFront, farRear].forEach((f, i) => { cel(g, f, mix(SKIN, SKIN_S, 0.45), SKIN_D, 3); contour(g, f, 2.6, 900 + i); });
    cel(g, tail, SKIN, SKIN_S, 2); contour(g, tail, 2.4, 903);
  });
  // 2. cou et tête (le cou passe sous le bord avant de la carapace)
  g.group("plain", () => {
    const neck = PP(NECK), head = PP(HEAD);
    cel(g, neck, SKIN, SKIN_S, 3);
    fillShape(g, shift(head, 4, 5), "#0a3f49", 0.18);
    cel(g, head, SKIN, SKIN_S, 5, [PP(HEAD_LIT), mix(SKIN, "#ffffff", 0.22)]);
    // écailles de la tête : la paire de préfrontales sur le museau, l'écaille de joue derrière l'œil
    clipped(g, head, () => {
      ink(g, PP(smooth([[53, -41], [57, -36.5], [62, -35]], false, 5)), SKIN_D, { w: 1.4, shadow: 0, taper: [0.2, 0.3], seed: 910 }, 0.8);
      ink(g, PP(smooth([[56, -41.5], [59, -38.5]], false, 3)), SKIN_D, { w: 1.2, shadow: 0, taper: [0.3, 0.3], seed: 911 }, 0.7);
      ink(g, PP(smooth([[44, -27], [47, -23], [53, -22]], false, 5)), SKIN_D, { w: 1.4, shadow: 0, taper: [0.2, 0.3], seed: 912 }, 0.7);
      fillShape(g, blob(...place([47, -25]), 3.4 * S, 2.2 * S, 913, 0.1, 8), "#ff7c7c", 0.45);
    });
    contour(g, head, 3, 914);
    // bec : ligne de la bouche (sourire), narine
    ink(g, PP(MOUTH), INK, { w: 2.2, shadow: 0, taper: [0.15, 0.35], seed: 915 });
    fillShape(g, blob(...place([62.5, -33.5]), 1.1 * S, 0.9 * S, 916, 0.05, 6), INK);
    // l'œil : blanc, pupille, deux reflets, paupière ; plissé de joie ou fermé au clignement
    const e = place(EYE.c), rx = EYE.rx * S, ry = EYE.ry * S * p.sy;
    if (p.happy) ink(g, smooth([[e[0] - rx, e[1] + 2], [e[0] - rx * 0.3, e[1] - 4], [e[0] + rx * 0.4, e[1] - 4], [e[0] + rx, e[1] + 2]], false, 6), INK, { w: 2.8, shadow: 0, taper: [0.2, 0.2], seed: 917 });
    else if (p.blink > 0.55) ink(g, smooth([[e[0] - rx, e[1]], [e[0], e[1] + 3], [e[0] + rx, e[1]]], false, 6), INK, { w: 2.6, shadow: 0, taper: [0.2, 0.2], seed: 918 });
    else {
      const s = blob(e[0], e[1], rx, ry * (1 - 0.8 * p.blink), 919, 0.02, 14);
      cel(g, s, "#ffffff", "#dfe6ee", 2);
      clipped(g, s, () => { fillShape(g, blob(e[0] + 1.6 * S, e[1] + 0.8 * S, rx * 0.66, ry * 0.7, 920, 0.02, 12), "#1f1a36"); fillShape(g, blob(e[0] + 0.2 * S, e[1] - 2.2 * S, 1.9 * S, 1.9 * S, 921, 0.02, 8), "#ffffff"); fillShape(g, blob(e[0] + 3 * S, e[1] + 2.6 * S, 0.9 * S, 0.9 * S, 922, 0.02, 6), "#ffffff", 0.9); });
      contour(g, s, 2.2, 923);
      ink(g, smooth([[e[0] - rx - 1, e[1] - ry * 0.4], [e[0] - rx * 0.2, e[1] - ry - 2.5], [e[0] + rx * 0.8, e[1] - ry - 1.5]], false, 5), INK, { w: 2, shadow: 0, taper: [0.2, 0.5], seed: 924, side: -1 });
    }
  });
  // 3. plastron, puis carapace par-dessus (le dôme couvre la racine du cou et des nageoires)
  g.group("plain", () => {
    const pl = PP(PLASTRON); cel(g, pl, BELLY, BELLY_S, 3); contour(g, pl, 2.4, 930);
    // plaques du plastron : deux sillons en travers
    clipped(g, pl, () => [[-8, -8, -6, 0], [8, -8, 7, -1]].forEach(([x0, y0, x1, y1], i) => ink(g, PP([[x0, y0], [x1, y1]]), BELLY_S, { w: 1.3, shadow: 0, taper: [0.2, 0.2], seed: 931 + i }, 0.9)));
    const sh = PP(SHELL_OUT);
    fillShape(g, shift(sh, 5, 7), "#0a3f49", 0.2);
    cel(g, sh, SHELL, SHELL_S, 7);
    clipped(g, sh, () => {
      fillShape(g, PP(SHELL_LIT), SHELL_L, 0.8);
      // bord marginal : une bande plus sombre, découpée en petites écailles
      fillShape(g, PP([...RIM_OUT, ...RIM_IN.slice().reverse()]), mix(SHELL_S, SHELL, 0.35), 0.9);
      for (let i = 1; i < 9; i++) { const t = i / 9, o = RIM_OUT[Math.round(t * (RIM_OUT.length - 1))], n = RIM_IN[Math.round(t * (RIM_IN.length - 1))]; ink(g, PP([o, n]), SCUTE, { w: 1.3, shadow: 0, taper: [0.1, 0.1], seed: 940 + i }, 0.85); }
      ink(g, PP(RIM_IN), SCUTE, { w: 1.6, shadow: 0, taper: [0.1, 0.1], seed: 950 }, 0.9);
      // vertébrales : l'arête et ses 4 séparations ; costales : 3 sillons qui descendent vers le bord
      ink(g, PP(RIDGE), SCUTE, { w: 1.7, shadow: 0, taper: [0.15, 0.15], seed: 951 }, 0.85);
      [0.2, 0.4, 0.6, 0.8].forEach((t, i) => { const q = RIDGE[Math.round(t * (RIDGE.length - 1))]; ink(g, PP([[q[0] - 2, q[1] - 5], [q[0] + 1, q[1] + 1.5]]), SCUTE, { w: 1.5, shadow: 0, taper: [0.2, 0.2], seed: 952 + i }, 0.85); });
      [0.28, 0.52, 0.76].forEach((t, i) => { const q = RIDGE[Math.round(t * (RIDGE.length - 1))], r = RIM_IN[Math.round(t * (RIM_IN.length - 1))]; ink(g, PP(smooth([[q[0], q[1] + 1.5], [(q[0] + r[0]) / 2 - 2, (q[1] + r[1]) / 2], [r[0] - 1, r[1]]], false, 5)), SCUTE, { w: 1.6, shadow: 0, taper: [0.15, 0.25], seed: 956 + i }, 0.85); });
      // reflet mouillé sur le dôme
      ink(g, PP(smooth([[-21, -32], [-9, -37], [3, -38]], false, 5)), "#fff4d6", { w: 3.4, shadow: 0, taper: [0.35, 0.45], seed: 960 }, 0.85);
    });
    contour(g, sh, 3.6, 961);
  });
  // 4. nageoires du côté proche, devant : la griffe au bord d'attaque de l'avant
  g.group("plain", () => {
    cel(g, nearRear, SKIN, SKIN_S, 3); contour(g, nearRear, 2.8, 970);
    cel(g, nearFront, SKIN, SKIN_S, 4, [flipper(smooth([[4, -4], [16, -5], [28, -2], [16, 0], [5, 0]], true, 5), [22, -13], p.front, 40), mix(SKIN, "#ffffff", 0.2)]);
    // écailles du bord d'attaque et la griffe
    const cl = flipper(smooth([[13, -7], [16, -10.5], [17, -7]], true, 3), [22, -13], p.front, 40);
    fillShape(g, cl, "#e9e1c8"); ink(g, cl, INK, { w: 1.2, closed: true, shadow: 0, seed: 971 });
    ink(g, flipper(smooth([[6, 0], [18, 1], [30, 2.5]], false, 5), [22, -13], p.front, 40), SKIN_D, { w: 1.3, shadow: 0, taper: [0.2, 0.4], seed: 972 }, 0.7);
    contour(g, nearFront, 3, 973);
  });
};

// ---------------------------------------------------------------- clips (12 images/s)
export type TurtleClip = { name: string; frames: number; loop: boolean; pose: (f: number) => TurtlePose; path?: number[][] };
const TAU = Math.PI * 2;
// posée sur une bouée : elle respire, pagaie un peu des nageoires, cligne une fois
const rest: TurtleClip = {
  name: "repos", frames: 24, loop: true,
  pose: (f) => { const u = f / 24; return { ...TURTLE_REST, head: 1.2 * Math.sin(TAU * u), front: 72 + 7 * Math.sin(TAU * u + 0.6), frontFar: 64 + 6 * Math.sin(TAU * u + 1.9), rear: 4 * Math.sin(TAU * u + 2.6), sy: 1 + 0.02 * Math.sin(TAU * u), blink: [0, 0.6, 1, 0.5][f - 15] ?? 0, ground: true }; },
};
// un saut de bouée en bouée : ramassée, poussée, vol nageoires ouvertes (le nez monte puis plonge),
// réception écrasée, retour. `path` : pour chaque image, [avancée 0..1 entre les deux bouées, hauteur
// 0..1 de l'arc] ; l'application déplace le sprite le long de l'arc réel (l'écart varie selon la ligne).
const JUMP_S = [0, 0, 0.1, 0.3, 0.5, 0.7, 0.88, 1, 1, 1];
const jump: TurtleClip = {
  name: "saut", frames: 10, loop: false,
  path: JUMP_S.map((s, f) => [s, f >= 1 && f <= 7 ? Math.sin(Math.PI * s) : 0]),
  pose: (f) => {
    const P: Partial<TurtlePose>[] = [
      { sy: 0.86, sx: 1.06, front: 20, frontFar: 26, rear: 10, head: 2 }, // ramassée, nageoires en appui devant
      { sy: 1.1, sx: 0.95, front: 78, frontFar: 72, rear: 30, pitch: -10, head: -2 }, // poussée : elles balaient vers l'arrière
      { front: 108, frontFar: 100, rear: 40, pitch: -14, head: -2 }, // vol : nageoires tendues en arrière, sous le bord
      { front: 96, frontFar: 90, rear: 30, pitch: -8, head: -1 },
      { front: 112, frontFar: 104, rear: 36, pitch: 0, head: 0 },
      { front: 88, frontFar: 84, rear: 20, pitch: 8, head: 1 },
      { front: 40, frontFar: 44, rear: 8, pitch: 12, head: 1 }, // le nez plonge, les nageoires viennent devant pour se poser
      { front: 18, frontFar: 24, rear: 6, pitch: 4, head: 1 },
      { sy: 0.84, sx: 1.07, front: 30, frontFar: 34, rear: 6, head: 3 }, // réception
      { sy: 1.03, sx: 0.99, front: 60, frontFar: 56, rear: 2, head: 0 },
    ];
    return { ...TURTLE_REST, ...P[f], happy: f >= 2 && f <= 6, ground: f <= 0 || f >= 8 };
  },
};
// nage : grands battements des nageoires avant (comme des ailes), corps presque horizontal
const swim: TurtleClip = {
  name: "nage", frames: 16, loop: true,
  pose: (f) => { const u = f / 16, w = Math.sin(TAU * u); return { ...TURTLE_REST, pitch: -4 + 2 * Math.sin(TAU * u + 1), front: 98 + 28 * w, frontFar: 94 + 26 * Math.sin(TAU * u - 0.5), rear: -10 + 8 * Math.sin(TAU * u + 2), head: 1.5 * Math.sin(TAU * u + 0.8), dy: -3 * Math.sin(TAU * u + 0.3) }; },
};
export const TURTLE_CLIPS: TurtleClip[] = [rest, jump, swim];
