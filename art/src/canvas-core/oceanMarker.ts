// OCEAN LESSON · marker comic (the koi's hand). Flat cel fills, each form given ONE hard-edged
// shadow shape away from the light (upper left, the surface), a lighter cel pushed toward it, and a
// single heavy brush-pen contour that thickens on the side turned from the light. Water is laid
// in big flats: deep in the corners, lit through the middle, with pale streaks for movement.
// The numbers are inked like the contour: the heaviest, darkest marks on the page, so they read
// first after the octopus.
import { Gfx, PENCIL, rng, type Ctx, type Env, type P } from "./core";
import type { Film } from "./film";
import { blob, clipped, fillShape, ink, lerpP, mix, smooth } from "./gallery";
import * as O from "./ocean";

const INK = "#15122a", L = O.LIGHT;
const WATER = "#138493", WATER_D = "#0b5563", WATER_L = "#37a9b3", SAND = "#f1d79f", SAND_S = "#d8b577", SAND_L = "#fbe9c0";
const OCT = "#f2765a", OCT_S = "#c64d3c", OCT_L = "#ff9c7c", SUCK = "#ffe0d2", SUCK_S = "#f0a894";
const shift = (pts: P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy]);
// a cel: shadow colour, then the lit colour pushed toward the light and clipped to the form
const cel = (g: Gfx, pts: P[], lit: string, shade: string, k = 10, hi?: [P[], string]) => { fillShape(g, pts, shade); clipped(g, pts, () => { fillShape(g, shift(pts, L[0] * k, L[1] * k), lit); if (hi) fillShape(g, hi[0], hi[1]); }); };
const contour = (g: Gfx, pts: P[], w: number, seed: number, closed = true) => ink(g, pts, INK, closed ? { w, closed: true, light: L, shadow: 0.9, seed } : { w, light: L, shadow: 0.9, seed, taper: [0.08, 0.08], side: -1, min: 0.3 });

const water = (g: Gfx, u: number) => g.group("plain", () => {
  fillShape(g, [[0, 0], [O.W, 0], [O.W, O.H], [0, O.H]], WATER_D);
  fillShape(g, blob(640, 260, 760, 330, 401, 0.1, 20, 0), WATER);
  fillShape(g, blob(600, 200, 520, 190, 402, 0.12, 18, -0.1), mix(WATER, WATER_L, 0.25));
  O.RAYS.forEach((r) => fillShape(g, r, "#bff3ee", 0.1));
  const r = rng(311);
  for (let i = 0; i < 14; i++) { const x = 40 + r() * 1200 + 14 * Math.sin(2 * Math.PI * u + i), y = 30 + r() * 420, l = 60 + r() * 120; ink(g, smooth([[x, y], [x + l * 0.5, y - 5], [x + l, y + 2]], false, 6), WATER_L, { w: 4 + r() * 4, shadow: 0, taper: [0.4, 0.4], seed: 500 + i }, 0.5); }
});

const seabed = (g: Gfx) => {
  g.group("plain", () => {
    fillShape(g, O.SAND, SAND_S);
    clipped(g, O.SAND, () => { fillShape(g, shift(O.SAND, 0, 16), SAND); fillShape(g, blob(640, 760, 520, 90, 71, 0.2, 16), SAND_L, 0.55); });
    O.SAND_RIPPLES.forEach((s, i) => { ink(g, s, SAND_S, { w: 5, shadow: 0, taper: [0.3, 0.3], seed: 60 + i }, 0.9); ink(g, shift(s, -2, -5), SAND_L, { w: 3, shadow: 0, taper: [0.3, 0.3], seed: 80 + i }, 0.9); });
    contour(g, O.SAND_TOP, 5, 90, false);
  });
  // rocks, then the weed that grows in front of them
  g.group("plain", () => O.ROCKS.forEach((k) => { const s = blob(k.c[0], k.c[1], k.rx, k.ry, k.seed, 0.12, 14); fillShape(g, shift(s, 12, 10), "#8d6f45", 0.35); cel(g, s, "#9aa6b4", "#66728a", 12, [blob(k.c[0] - k.rx * 0.35, k.c[1] - k.ry * 0.45, k.rx * 0.3, k.ry * 0.2, k.seed + 5, 0.2, 10), "#c3ccd6"]); contour(g, s, 4.5, k.seed); }));
  g.group("plain", () => O.WEEDS.forEach((w, i) => {
    const t = O.taper(w.spine, (u) => 2 + w.r0 * Math.pow(1 - u, 0.7)).outline, lit = w.color ? "#46b35d" : "#6cc96a", sh = w.color ? "#227a43" : "#3a9a4c";
    cel(g, t, lit, sh, 6); ink(g, w.spine.slice(2, -3), mix(sh, INK, 0.3), { w: 1.6, shadow: 0, taper: [0.1, 0.4], seed: 700 + i }, 0.6); contour(g, t, 3.6, 720 + i);
  }));
};

const rope = (g: Gfx) => {
  g.group("plain", () => {
    O.POSTS.forEach((p, i) => { const s = O.taper([p.foot, lerpP(p.foot, p.top, 0.5), p.top], () => 7).outline; fillShape(g, shift(s, 10, 6), "#0a3f49", 0.35); cel(g, s, "#b98752", "#7d5431", 4); contour(g, s, 3.6, 30 + i); });
    const band = O.taper(O.ROPE_PTS, () => 4).outline;
    fillShape(g, shift(band, 5, 9), "#0a3f49", 0.3); cel(g, band, "#f0d3a0", "#c89c62", 2.5);
    for (let x = O.ROPE.x0 + 8; x < O.ROPE.x1; x += 13) { const y = O.ropeY(x); ink(g, [[x - 3, y - 3.5], [x + 3, y + 3.5]], "#8a6238", { w: 1.7, shadow: 0, taper: [0.3, 0.3], seed: x }); }
    contour(g, band, 2.8, 33);
  });
  g.group("plain", () => O.BUOYS.forEach(([x, y], i) => {
    const R = O.BUOY_R, s = blob(x, y, R, R * 1.08, 40 + i, 0.03, 16), band = smooth([[x - R, y - 4], [x + R, y - 4], [x + R, y + 4], [x - R, y + 4]], true, 3);
    fillShape(g, shift(s, 7, 10), "#0a3f49", 0.3);
    cel(g, s, "#ff5a45", "#c0302a", 5);
    clipped(g, s, () => { fillShape(g, band, "#e6ecf0"); fillShape(g, shift(band, -3, -2), "#ffffff"); fillShape(g, blob(x - 5, y - 7, 4, 2.6, 60 + i, 0.1, 8), "#ffffff", 0.9); });
    contour(g, s, 3.2, 70 + i);
  }));
};

const starfish = (g: Gfx) => g.group("plain", () => {
  const s = O.STAR, c = O.STAR_C;
  fillShape(g, shift(s, 8, 10), "#0a3f49", 0.3);
  cel(g, s, "#ffc93a", "#e08d1c", 6);
  const r = rng(7); for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = 4 + r() * 22; fillShape(g, blob(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, 2.2, 2.2, 90 + i, 0.1, 6), "#fff0b8", 0.95); }
  contour(g, s, 3.6, 91);
});

const numbers = (g: Gfx) => g.group("plain", () => {
  O.LABELS.forEach((l, i) => { const col = i === O.TARGET ? "#c0302a" : INK; l.strokes.forEach((s, k) => ink(g, s, col, { w: 5.2, shadow: 0.3, taper: [0.1, 0.12], seed: 200 + i * 5 + k, min: 0.55 })); l.dots.forEach((d) => fillShape(g, blob(d[0], d[1], 3.6, 3.6, 260 + i, 0.1, 8), col)); });
});

const answers = (g: Gfx) => g.group("plain", () => O.ANSWERS.forEach((a, i) => {
  const s = blob(a.c[0], a.c[1], O.ANSWER_R, O.ANSWER_R, 300 + i, 0.02, 20);
  fillShape(g, shift(s, 8, 10), "#8d6f45", 0.35);
  cel(g, s, "#fffaf0", "#cfe6ea", 9, [smooth([[a.c[0] - 30, a.c[1] - 16], [a.c[0] - 20, a.c[1] - 32], [a.c[0] - 4, a.c[1] - 38]], false, 4), "#ffffff"]);
  ink(g, smooth([[a.c[0] - 34, a.c[1] - 12], [a.c[0] - 24, a.c[1] - 30], [a.c[0] - 8, a.c[1] - 38]], false, 6), "#ffffff", { w: 5, shadow: 0, taper: [0.3, 0.4], seed: 310 + i });
  contour(g, s, 5, 320 + i);
  O.numberStrokes(a.text, a.c[0], a.c[1] - 27, 54).strokes.forEach((st, k) => ink(g, st, INK, { w: 7.5, shadow: 0.3, taper: [0.1, 0.12], seed: 330 + i * 3 + k, min: 0.55 }));
}));

const FISHC: [string, string][] = [["#ff8a1e", "#cf5a0e"], ["#ffb02e", "#d5781a"], ["#ff7040", "#c9481e"]];
const fishes = (g: Gfx) => g.group("plain", () => O.FISH.forEach((f, i) => {
  const s = O.fishShape(f), [lit, sh] = FISHC[f.color];
  [s.tail, s.fin].forEach((p, k) => { cel(g, p, lit, sh, 3); contour(g, p, 2.8, 400 + i * 10 + k); });
  cel(g, s.body, lit, sh, 6);
  clipped(g, s.body, () => { fillShape(g, s.stripe, "#fffaf0"); ink(g, s.stripe, INK, { w: 1.8, closed: true, shadow: 0, seed: 420 + i }); });
  ink(g, s.gill, mix(sh, INK, 0.4), { w: 2, shadow: 0, taper: [0.2, 0.3], seed: 430 + i }, 0.8);
  fillShape(g, blob(s.eye[0], s.eye[1], s.eyeR, s.eyeR, 440 + i, 0.05, 10), INK); fillShape(g, blob(s.eye[0] - s.eyeR * 0.3, s.eye[1] - s.eyeR * 0.35, s.eyeR * 0.35, s.eyeR * 0.35, 450 + i, 0.05, 8), "#ffffff");
  contour(g, s.body, 3.6, 460 + i);
}));

const bubbles = (g: Gfx) => g.group("plain", () => O.BUBBLES.forEach(([x, y, r], i) => {
  if (r < 1.2) return;
  fillShape(g, blob(x, y, r, r, 500 + i, 0.03, 12), "#bff3ee", 0.25);
  ink(g, blob(x, y, r, r, 500 + i, 0.03, 12), "#e8fffb", { w: Math.max(1.6, r * 0.28), closed: true, light: L, shadow: -0.6, seed: 510 + i });
  fillShape(g, blob(x - r * 0.35, y - r * 0.35, r * 0.22, r * 0.16, 520 + i, 0.05, 8), "#ffffff");
}));

// ---------------------------------------------------------------- the octopus
const armFill = (g: Gfx, a: O.Arm, lit: string, shade: string) => cel(g, a.outline, lit, shade, 5);
const suckers = (g: Gfx, a: O.Arm, seed: number) => a.side.forEach((p, k) => { const r = O.suckerR(a, k), s = blob(p[0], p[1], r, r * 0.9, seed + k, 0.05, 10); fillShape(g, s, SUCK_S); fillShape(g, shift(s, -r * 0.2, -r * 0.25), SUCK); ink(g, s, mix(OCT_S, INK, 0.3), { w: Math.max(1, r * 0.28), closed: true, shadow: 0, seed: seed + 50 + k }, 0.8); });
// an arm's contour runs root -> tip -> root, left OPEN at the root so it grows out of the head
const armLine = (g: Gfx, a: O.Arm, w: number, seed: number) => { const n = a.outline.length; contour(g, a.outline.slice(3, n - 3), w, seed, false); };
const octopus = (g: Gfx) => {
  const back = O.ARMS.filter((a) => !a.front), front = O.ARMS.filter((a) => a.front), M = O.P_(O.MANTLE);
  g.group("plain", () => back.forEach((a, i) => { armFill(g, a, mix(OCT, OCT_S, 0.35), mix(OCT_S, INK, 0.2)); armLine(g, a, 4, 600 + i); }));
  g.group("plain", () => {
    cel(g, M, OCT, OCT_S, 12);
    clipped(g, M, () => { fillShape(g, O.P_(O.MANTLE_LIT), OCT_L, 0.75); O.SPOTS.forEach(([x, y, r], i) => { const c = O.at([x, y]); fillShape(g, blob(c[0], c[1], r * O.OS, r * O.OS * 0.85, 620 + i, 0.15, 8), OCT_S, 0.7); }); });
    ink(g, O.P_(O.GLOSS), "#ffffff", { w: 7, shadow: 0, taper: [0.35, 0.45], seed: 640 }, 0.85);
    fillShape(g, blob(...O.at([-20, -104]), 7, 4, 641, 0.1, 8, -0.4), "#ffffff", 0.85);
    contour(g, M, 6.2, 650);
  });
  g.group("plain", () => front.forEach((a, i) => { armFill(g, a, OCT, OCT_S); suckers(g, a, 700 + i * 60); armLine(g, a, 4.6, 660 + i); }));
  // the face last: cheeks, eyes with lids and two lights each, the smile
  g.group("plain", () => {
    O.CHEEKS.forEach((c, i) => { const p = O.at(c); fillShape(g, blob(p[0], p[1], 15, 9, 800 + i, 0.1, 10), "#ff5d6c", 0.55); });
    O.EYES.forEach((e, i) => {
      const c = O.at(e.c);
      if (O.BLINK > 0.55) { ink(g, smooth([[c[0] - e.rx * O.OS, c[1] + 2], [c[0], c[1] + 9], [c[0] + e.rx * O.OS, c[1] + 2]], false, 6), INK, { w: 3.6, shadow: 0, taper: [0.2, 0.2], seed: 855 + i }); return; }
      const s = blob(c[0], c[1], e.rx * O.OS, e.ry * O.OS * (1 - 0.8 * O.BLINK), 810 + i, 0.02, 16);
      cel(g, s, "#ffffff", "#dfe6ee", 3);
      const pc: P = [c[0] + 3, c[1] + 4], pu = blob(pc[0], pc[1], e.rx * O.OS * 0.62, e.ry * O.OS * 0.66, 820 + i, 0.02, 14);
      clipped(g, s, () => { fillShape(g, pu, "#1f1a36"); fillShape(g, blob(pc[0] - 5, pc[1] - 7, 5.4, 5.4, 830 + i, 0.02, 10), "#ffffff"); fillShape(g, blob(pc[0] + 5, pc[1] + 6, 2.4, 2.4, 840 + i, 0.02, 8), "#ffffff", 0.9); });
      contour(g, s, 3.4, 850 + i);
      ink(g, O.P_(O.LIDS[i]), INK, { w: 3.2, shadow: 0, taper: [0.2, 0.5], seed: 860 + i, side: -1 });
    });
    ink(g, O.P_(O.MOUTH), INK, { w: 3.6, shadow: 0, taper: [0.25, 0.25], seed: 870 });
  });
};

export const LOOP = 120;
export const drawOceanMarker = (ctx: Ctx, frame: number, env: Env) => {
  O.setTime(frame, LOOP);
  const g = new Gfx(ctx, env, 0, PENCIL), u = (frame % LOOP) / LOOP;
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  water(g, u); seabed(g); fishes(g); bubbles(g); rope(g); starfish(g); octopus(g); numbers(g); answers(g);
  g.paper("paper", 0.05);
};

export const oceanMarker: Film = {
  meta: { title: "Ocean lesson · marker comic", W: O.W, H: O.H, fps: 30, bpm: 120, durationFrames: 240 },
  assets: { images: {} },
  shots: [{ id: "marker", start: 0, end: 240, draw: drawOceanMarker }],
};
