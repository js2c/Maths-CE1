// LES DÉCORS DU RÉCIF (lot 3 bis, docs/SPEC-LOT3BIS.md, A6 et B8) : chaque doublon apporte un décor, dans l'ordre de
// app/content/cartes.json (decors.liste). Quinze objets du fond de la mer, chacun avec sa raison d'être là (ce qu'on voit
// dans un vrai lagon, ou ce qu'un bateau y a perdu), posés sur le sable par leur ancrage : le milieu de leur base.
// Même main que le reste (oceanMarker.ts) : aplats, une ombre nette par forme, contour épais qui s'épaissit du côté de
// l'ombre, lumière en haut à gauche ; les détails intérieurs (côtes, pores, veines, planches, maillons) en traits plus fins.
import { rng, type Gfx, type P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import * as O from "../ocean";
import { cel, contour, INK, shift } from "../oceanMarker";

const SH = "#0a3f49", TAU = Math.PI * 2;
export const DECOR_W = 240, DECOR_H = 220, DECOR_ORIGIN: P = [120, 200];
// l'ombre posée sur le sable, sous l'objet (décalée côté ombre)
const ground = (g: Gfx, cx: number, by: number, rx: number, seed: number) => fillShape(g, blob(cx + rx * 0.18, by - 2, rx, rx * 0.16, seed, 0.1, 14), SH, 0.25);
// une branche effilée, ombrée et cernée
const branch = (g: Gfx, pts: P[], w: number, lit: string, shade: string, seed: number, k = 0.55) => { const t = O.taper(smooth(pts, false, 6), (u) => w * (1 - k * u)).outline; fillShape(g, shift(t, 4, 5), SH, 0.22); cel(g, t, lit, shade, 2.5); contour(g, t, 2.6, seed); return t; };

// ---------------------------------------------------------------- 1 · le corail branchu (corne de cerf, lilas, bouts clairs)
const coralStag = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  const L = "#c79be8", S = "#8f62b8", TIP = "#f3e2ff";
  ground(g, cx, by, 70, 9000);
  const B: [P[], number][] = [
    [[[cx - 6, by], [cx - 10, by - 40], [cx - 34, by - 80], [cx - 44, by - 128]], 15],
    [[[cx - 8, by - 36], [cx + 14, by - 74], [cx + 10, by - 120], [cx + 18, by - 150]], 13],
    [[[cx + 4, by], [cx + 22, by - 30], [cx + 52, by - 58], [cx + 62, by - 100]], 13],
    [[[cx - 28, by - 72], [cx - 58, by - 88], [cx - 72, by - 110]], 9],
    [[[cx + 12, by - 90], [cx + 40, by - 104], [cx + 46, by - 128]], 8],
    [[[cx + 40, by - 50], [cx + 70, by - 56], [cx + 84, by - 74]], 8],
  ];
  B.forEach(([pts, w], i) => branch(g, pts, w, L, S, 9001 + i, 0.45));
  // les bouts clairs, là où le corail pousse
  B.forEach(([pts], i) => { const [x, y] = pts[pts.length - 1]; fillShape(g, blob(x, y + 3, 4.2, 5, 9010 + i, 0.08, 8), TIP); });
  const r = rng(9020); B.forEach(([pts], i) => { const sp = smooth(pts, false, 6); for (let k = 3; k < sp.length - 2; k += 4) fillShape(g, blob(sp[k][0] + (r() - 0.5) * 4, sp[k][1], 1.8, 1.6, 9021 + i * 11 + k, 0.1, 6), S, 0.8); });
});
// ---------------------------------------------------------------- 2 · l'anémone (colonne rose, couronne de tentacules)
const anemone = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 58, 9030);
  const col = smooth([[cx - 30, by], [cx - 26, by - 40], [cx - 36, by - 64], [cx + 36, by - 64], [cx + 26, by - 40], [cx + 30, by]], true, 5);
  fillShape(g, shift(col, 5, 6), SH, 0.25); cel(g, col, "#ff9fb8", "#cf5f7e", 5);
  clipped(g, col, () => { for (let i = 0; i < 6; i++) ink(g, [[cx - 24 + i * 10, by - 4], [cx - 28 + i * 11, by - 60]], "#e67a98", { w: 2, shadow: 0, taper: [0.3, 0.3], seed: 9031 + i }, 0.8); });
  contour(g, col, 3, 9040);
  // la couronne : des tentacules épais qui ondulent, du fond vers l'avant, bouts violets
  const r = rng(9050), tent = (a: number, len: number, i: number, back: boolean) => {
    const base: P = [cx + Math.cos(a) * 30, by - 64 + Math.sin(a) * 8], dir = a + (r() - 0.5) * 0.4, mid: P = [base[0] + Math.cos(dir) * len * 0.5 + (r() - 0.5) * 10, base[1] - len * 0.55], tip: P = [base[0] + Math.cos(dir) * len * 0.9 + (r() - 0.5) * 14, base[1] - len * (0.9 + r() * 0.2)];
    const t = O.taper(smooth([base, mid, tip], false, 6), (u) => 9 * (1 - 0.5 * u)).outline;
    cel(g, t, back ? "#f58aa8" : "#ffb4c8", back ? "#c85478" : "#d9708e", 2); contour(g, t, 2.2, 9051 + i);
    fillShape(g, blob(tip[0], tip[1], 5, 5, 9080 + i, 0.05, 8), "#b86ad8"); ink(g, blob(tip[0], tip[1], 5, 5, 9080 + i, 0.05, 8), INK, { w: 1.4, closed: true, shadow: 0.4, seed: 9120 + i });
  };
  for (let i = 0; i < 8; i++) tent(Math.PI + (i / 7) * Math.PI, 52 + r() * 14, i, true);
  for (let i = 0; i < 7; i++) tent(Math.PI * 1.08 + (i / 6) * Math.PI * 0.84, 42 + r() * 16, 20 + i, false);
  fillShape(g, blob(cx, by - 66, 12, 4, 9095, 0.05, 10), "#8a3a58", 0.6);
});
// ---------------------------------------------------------------- 3 · la gorgone (un éventail rouge orangé, ajouré)
const gorgonian = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  const r = rng(9100), foot: P = [cx, by - 10];
  ground(g, cx, by, 50, 9101);
  const edge: P[] = []; for (let i = 0; i <= 22; i++) { const a = -Math.PI * 0.95 + Math.PI * 0.9 * (i / 22), rr = 120 * (0.92 + 0.08 * Math.sin(i * 2.1) * Math.sin(i * 0.8)); edge.push([cx + Math.cos(a) * rr * 0.75, by - 16 + Math.sin(a) * rr]); }
  const fan = smooth([...edge, [cx + 8, by - 12], [cx - 8, by - 12]], true, 3);
  fillShape(g, shift(fan, 6, 7), SH, 0.2); cel(g, fan, "#ffae8a", "#e0785a", 6);
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI * 0.92 + Math.PI * 0.84 * (i / 7), mid: P = [cx + Math.cos(a) * 45 * 0.75, by - 16 + Math.sin(a) * 50];
    ink(g, smooth([foot, mid], false, 4), "#c8462e", { w: 4.4, shadow: 0.5, taper: [0.1, 0.3], seed: 9102 + i });
    for (const d of [-0.1, 0.1]) { const tip: P = [cx + Math.cos(a + d) * 108 * 0.75, by - 16 + Math.sin(a + d) * 108]; ink(g, smooth([mid, [(mid[0] + tip[0]) / 2 + (r() - 0.5) * 6, (mid[1] + tip[1]) / 2], tip], false, 4), "#d8543a", { w: 2.4, shadow: 0.3, taper: [0.2, 0.6], seed: 9110 + i * 2 + (d > 0 ? 1 : 0) }); }
  }
  for (let k = 1; k < 6; k++) { const pts = Array.from({ length: 14 }, (_, j) => { const a = -Math.PI * 0.92 + Math.PI * 0.84 * (j / 13), rr = 22 + k * 17 + (r() - 0.5) * 6; return [cx + Math.cos(a) * rr * 0.75, by - 16 + Math.sin(a) * rr] as P; }); ink(g, smooth(pts, false, 3), "#ffd0bc", { w: 1.4, shadow: 0, taper: [0.2, 0.2], seed: 9130 + k }, 0.9); }
  contour(g, fan, 3, 9140);
  const stem = smooth([[cx - 8, by], [cx - 5, by - 14], [cx + 5, by - 14], [cx + 8, by]], true, 2); cel(g, stem, "#c8462e", "#8e2e1e", 2); contour(g, stem, 2.6, 9141);
});
// ---------------------------------------------------------------- 4 · le coquillage géant (un bénitier, le manteau bleu)
const giantClam = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 84, 9150);
  const w = 84, h = 96, lipY = by - 40, wave = (sd: number): P[] => Array.from({ length: 41 }, (_, i) => { const t = i / 40, x = cx - w + 2 * w * t, z = Math.abs(((t * 5) % 1) - 0.5) * 2; return [x, lipY + sd * (14 * z - 7) - (1 - Math.pow(2 * t - 1, 2)) * 14] as P; });
  // la valve du bas : côtes en éventail
  const low = smooth([...wave(1), [cx + w - 14, by - 12], [cx, by + 2], [cx - w + 14, by - 12]], true, 6);
  fillShape(g, shift(low, 6, 7), SH, 0.25); cel(g, low, "#f2e8d8", "#c9b89a", 6);
  clipped(g, low, () => { for (let i = 1; i < 10; i++) { const x = cx - w + (2 * w * i) / 10; ink(g, [[x, lipY + 6], [cx + (x - cx) * 0.4, by]], "#b8a482", { w: 2.6, shadow: 0, taper: [0.2, 0.4], seed: 9151 + i }, 0.8); } });
  contour(g, low, 3.4, 9160);
  // le manteau, entre les valves : bleu-vert, tacheté
  const mantle = smooth([...wave(1).map(([x, y]) => [x, y - 2] as P), ...wave(-1).reverse().map(([x, y]) => [x, y - 14] as P)], true, 3);
  cel(g, mantle, "#4ac0c8", "#1f7f9a", 3);
  const r = rng(9165); clipped(g, mantle, () => { for (let i = 0; i < 22; i++) fillShape(g, blob(cx - w + r() * 2 * w, lipY - 18 + r() * 18, 2.4, 2, 9166 + i, 0.1, 6), i % 3 ? "#9ff0e8" : "#2c5fa8", 0.9); });
  contour(g, mantle, 2.4, 9190);
  // la valve du haut (vue par sa tranche ondulée, derrière)
  const up = smooth([...wave(-1).map(([x, y]) => [x, y - 14] as P), [cx + w + 2, lipY - 34], [cx + w * 0.62, lipY - h + 18], [cx, lipY - h], [cx - w * 0.62, lipY - h + 18], [cx - w - 2, lipY - 34]], true, 6);
  fillShape(g, up, "#e8dcc4"); clipped(g, up, () => { for (let i = 1; i < 10; i++) { const x = cx - w + (2 * w * i) / 10; ink(g, [[x, lipY - 16], [cx + (x - cx) * 0.6, lipY - h + 10]], "#c9b89a", { w: 2.2, shadow: 0, taper: [0.2, 0.4], seed: 9191 + i }, 0.8); } });
  contour(g, up, 3, 9200);
});
// ---------------------------------------------------------------- 5 · l'étoile de mer rouge (bras un peu relevés)
const redStar = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 62, 9210);
  const c: P = [cx, by - 26], flat = 0.58, st = smooth(O.starShape([0, 0], 62, 24, 0.5).map(([x, y]) => [c[0] + x, c[1] + y * flat] as P), true, 5);
  fillShape(g, shift(st, 6, 6), SH, 0.3);
  cel(g, st, "#ff6a4a", "#c0302a", 5, [smooth([[c[0] - 30, c[1] - 6], [c[0] - 8, c[1] - 14], [c[0] + 10, c[1] - 8], [c[0] - 12, c[1] - 2]], true, 4), "#ff9a7a"]);
  const r = rng(9211); clipped(g, st, () => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + 0.5 + (i * TAU) / 5; for (let k = 1; k < 7; k++) { const t = k / 7.5; fillShape(g, blob(c[0] + Math.cos(a) * 62 * t + (r() - 0.5) * 3, c[1] + Math.sin(a) * 62 * t * flat, 2.6, 2.2, 9212 + i * 9 + k, 0.1, 8), "#fff0d8", 0.85); } } });
  contour(g, st, 3.2, 9260);
});
// ---------------------------------------------------------------- 6 · l'oursin violet (piquants en rayons)
const urchin = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 54, 9270);
  const c: P = [cx, by - 30], R = 30, r = rng(9271);
  // les piquants de derrière, puis le corps, puis ceux de devant
  const spine = (a: number, len: number, i: number, front: boolean) => { const b: P = [c[0] + Math.cos(a) * R * 0.8, c[1] + Math.sin(a) * R * 0.7], e: P = [c[0] + Math.cos(a) * (R + len), c[1] + Math.sin(a) * (R + len) * 0.9]; ink(g, [b, e], INK, { w: 6.4, shadow: 0, taper: [0.05, 0.92], seed: 9272 + i }, 0.9); ink(g, [b, e], front ? "#8a5ac0" : "#5a3488", { w: 4.2, shadow: 0, taper: [0.05, 0.92], seed: 9372 + i }); };
  for (let i = 0; i < 13; i++) { const a = -Math.PI + (i / 12) * Math.PI, l = 22 + r() * 16; spine(a, l, i, false); }
  const body = blob(c[0], c[1], R, R * 0.82, 9300, 0.05, 20);
  fillShape(g, shift(body, 5, 6), SH, 0.25); cel(g, body, "#8a58c0", "#4e2c80", 6, [blob(c[0] - 10, c[1] - 12, 9, 5, 9301, 0.1, 8), "#b890e0"]);
  clipped(g, body, () => { for (let k = 0; k < 5; k++) ink(g, smooth([[c[0] - R + k * 14, c[1] + R], [c[0] - 10 + k * 5, c[1]], [c[0] - 4 + k * 2, c[1] - R]], false, 5), "#3a1e62", { w: 1.6, shadow: 0, taper: [0.2, 0.2], seed: 9302 + k }, 0.6); });
  contour(g, body, 2.8, 9310);
  for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.92 + (i / 8) * Math.PI * 0.84 + (r() - 0.5) * 0.1, l = 16 + r() * 16; spine(a, l, 40 + i, true); }
});
// ---------------------------------------------------------------- 7 · l'herbier (une touffe de posidonies)
const seagrass = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 60, 9320);
  const r = rng(9321), cols: [string, string][] = [["#5fb86a", "#2f7f44"], ["#7ccf6a", "#3f9a4c"], ["#4aa05e", "#256a3a"]];
  for (let i = 0; i < 11; i++) {
    const x = cx - 44 + i * 9 + (r() - 0.5) * 4, h = 90 + r() * 70, lean = (x - cx) * 0.5 + (r() - 0.5) * 30, [lit, sh] = cols[i % 3];
    const pts: P[] = [[x, by], [x + lean * 0.3, by - h * 0.45], [x + lean * 0.8 + (r() - 0.5) * 12, by - h * 0.8], [x + lean, by - h]];
    const t = O.taper(smooth(pts, false, 6), (u) => 5.5 * (1 - 0.5 * u)).outline;
    cel(g, t, lit, sh, 2); ink(g, smooth(pts, false, 6).slice(3, -3), mix(sh, INK, 0.3), { w: 1.2, shadow: 0, taper: [0.1, 0.4], seed: 9322 + i }, 0.6); contour(g, t, 2.2, 9340 + i);
  }
});
// ---------------------------------------------------------------- 8 · l'amphore (couchée, à moitié dans le sable)
const amphora = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 86, 9360);
  const tilt = -0.18, rot = (p: P): P => { const dx = p[0] - cx, dy = p[1] - (by - 44); return [cx + dx * Math.cos(tilt) - dy * Math.sin(tilt), by - 44 + dx * Math.sin(tilt) + dy * Math.cos(tilt)]; };
  const bodyP: P[] = [[cx - 84, by - 44], [cx - 70, by - 64], [cx - 40, by - 80], [cx + 10, by - 78], [cx + 50, by - 64], [cx + 66, by - 56], [cx + 88, by - 54], [cx + 96, by - 56], [cx + 96, by - 34], [cx + 88, by - 36], [cx + 66, by - 32], [cx + 50, by - 24], [cx + 10, by - 10], [cx - 40, by - 8], [cx - 70, by - 24]];
  const body = smooth(bodyP.map(rot), true, 5);
  fillShape(g, shift(body, 6, 7), SH, 0.25); cel(g, body, "#e2915a", "#a8582e", 7, [smooth([[cx - 60, by - 64], [cx - 20, by - 76], [cx + 20, by - 72], [cx - 20, by - 66]].map(rot), true, 4), "#f4b484"]);
  // les deux anses, et deux bandes peintes
  [[[cx + 42, by - 66], [cx + 56, by - 92], [cx + 78, by - 60]]].forEach((h, i) => { const t = O.taper(smooth((h as P[]).map(rot), false, 6), () => 4).outline; cel(g, t, "#e2915a", "#a8582e", 1.5); contour(g, t, 2.4, 9361 + i); });
  clipped(g, body, () => { [-30, -10].forEach((x, i) => ink(g, smooth([[cx + x, by - 90], [cx + x + 4, by - 44], [cx + x, by]].map(rot), false, 5), "#7a3a1e", { w: 3, shadow: 0, taper: [0.1, 0.1], seed: 9363 + i }, 0.7)); });
  contour(g, body, 3.4, 9370);
  // l'ouverture du col, sombre
  const mouth = blob(...rot([cx + 96, by - 45]), 5, 11, 9371, 0.05, 10, tilt); fillShape(g, mouth, "#3a1e12"); ink(g, mouth, INK, { w: 2, closed: true, shadow: 0, seed: 9372 });
  // le sable qui la recouvre à moitié, devant
  const sand = smooth([[cx - 96, by + 2], [cx - 60, by - 14], [cx - 10, by - 6], [cx + 40, by - 16], [cx + 100, by - 4], [cx + 104, by + 4]], true, 5);
  cel(g, sand, "#fbe9c0", "#e3c88e", 3); ink(g, sand.slice(0, sand.length - 12), mix("#d8b577", INK, 0.3), { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 9373 }, 0.8);
});
// ---------------------------------------------------------------- 9 · l'ancre (plantée de biais, sa chaîne)
const anchor = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 60, 9380);
  const IRON = "#6f7f86", IRON_S = "#3c4a52", tilt = 0.28, rot = (x: number, y: number): P => [cx + x * Math.cos(tilt) - y * Math.sin(tilt), by + x * Math.sin(tilt) + y * Math.cos(tilt)];
  // la chaîne, qui court sur le sable vers la gauche
  for (let i = 0; i < 6; i++) { const [x, y] = [cx - 30 - i * 16, by - 6 + Math.sin(i) * 2], l = blob(x, y, 9, i % 2 ? 3.5 : 6, 9381 + i, 0.03, 12); ink(g, l, INK, { w: 4.6, closed: true, shadow: 0, seed: 9390 + i }); ink(g, l, i % 2 ? IRON_S : IRON, { w: 2.4, closed: true, shadow: 0, seed: 9396 + i }); }
  // la tige, le jas (la barre du haut), l'anneau, les bras et leurs pattes
  const shank = O.taper([rot(0, -8), rot(0, -70), rot(0, -132)], () => 7).outline;
  const stock = O.taper([rot(-34, -112), rot(0, -114), rot(34, -112)], () => 5).outline;
  const arms = O.taper(smooth([rot(-54, -44), rot(-40, -14), rot(0, -6), rot(40, -14), rot(54, -44)], false, 8), () => 7).outline;
  [arms, shank, stock].forEach((s, i) => { fillShape(g, shift(s, 5, 6), SH, 0.25); cel(g, s, IRON, IRON_S, 3); contour(g, s, 3, 9400 + i); });
  [-1, 1].forEach((sd, i) => { const tip = smooth([rot(sd * 54, -44), rot(sd * 66, -40), rot(sd * 52, -58)], true, 3); cel(g, tip, IRON, IRON_S, 2); contour(g, tip, 2.6, 9404 + i); });
  const ring = blob(...rot(0, -142), 10, 10, 9406, 0.02, 14); ink(g, ring, INK, { w: 7, closed: true, shadow: 0, seed: 9407 }); ink(g, ring, IRON, { w: 3.6, closed: true, shadow: 0, seed: 9408 });
  // un peu de rouille et le sable qui recouvre le bas
  [[-20, -30], [14, -80]].forEach(([x, y], i) => fillShape(g, blob(...rot(x, y), 4, 3, 9409 + i, 0.2, 8), "#b86a3a", 0.7));
  const sand = smooth([[cx - 70, by + 3], [cx - 20, by - 8], [cx + 30, by - 6], [cx + 70, by + 3]], true, 5); cel(g, sand, "#fbe9c0", "#e3c88e", 3);
});
// ---------------------------------------------------------------- 10 · le coffre (le couvercle entrouvert, de l'or dedans)
const chest = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 78, 9420);
  const WOOD = "#b27a44", WOOD_S = "#7a4e26", BAND = "#d8a840", BAND_S = "#a07418", w = 66, h = 56, top = by - h;
  const box: P[] = [[cx - w, by - 4], [cx - w, top], [cx + w, top], [cx + w, by - 4], [cx + w - 4, by], [cx - w + 4, by]];
  // l'or qui dépasse, derrière le couvercle
  const gold = smooth([[cx - w + 8, top + 4], [cx - 30, top - 16], [cx, top - 22], [cx + 34, top - 14], [cx + w - 8, top + 4]], true, 5);
  cel(g, gold, "#ffd84a", "#d09a18", 4); const r = rng(9421); clipped(g, gold, () => { for (let i = 0; i < 12; i++) ink(g, blob(cx - 50 + r() * 100, top - 14 + r() * 16, 6, 3, 9422 + i, 0.05, 10), "#b07a10", { w: 1.4, closed: true, shadow: 0, seed: 9440 + i }, 0.8); }); contour(g, gold, 2.4, 9455);
  // le couvercle entrouvert, bombé, vu par-dessous
  const lid = smooth([[cx - w - 4, top + 2], [cx - w + 2, top - 34], [cx, top - 48], [cx + w - 2, top - 34], [cx + w + 4, top + 2], [cx + w - 4, top - 10], [cx - w + 4, top - 10]], true, 4);
  fillShape(g, shift(lid, 5, 6), SH, 0.25); cel(g, lid, WOOD, WOOD_S, 5); clipped(g, lid, () => { [-24, 24].forEach((x, i) => ink(g, [[cx + x, top - 50], [cx + x, top + 4]], BAND, { w: 8, shadow: 0, seed: 9456 + i })); }); contour(g, lid, 3.2, 9458);
  fillShape(g, shift(box, 6, 7), SH, 0.25); cel(g, box, WOOD, WOOD_S, 6);
  clipped(g, box, () => { for (let i = 1; i < 4; i++) ink(g, [[cx - w, top + (h * i) / 4], [cx + w, top + (h * i) / 4]], WOOD_S, { w: 1.8, shadow: 0, seed: 9459 + i }, 0.8); [-24, 24].forEach((x, i) => { const b: P[] = [[cx + x - 5, top], [cx + x + 5, top], [cx + x + 5, by], [cx + x - 5, by]]; cel(g, b, BAND, BAND_S, 2); ink(g, b, INK, { w: 1.6, closed: true, shadow: 0, seed: 9463 + i }); }); });
  contour(g, box, 3.4, 9465);
  // la serrure, et un éclat sur une pièce
  const lock = smooth([[cx - 9, top + 8], [cx + 9, top + 8], [cx + 9, top + 28], [cx - 9, top + 28]], true, 2); cel(g, lock, BAND, BAND_S, 2); contour(g, lock, 2.2, 9466); fillShape(g, blob(cx, top + 17, 2.4, 3.4, 9467, 0.05, 8), INK);
  const gl = O.starShape([cx + 22, top - 20], 8, 2.2, 0); fillShape(g, gl, "#fffbe0"); ink(g, gl, "#ffd84a", { w: 1.4, closed: true, shadow: 0, seed: 9468 });
});
// ---------------------------------------------------------------- 11 · le corail cerveau (un dôme aux sillons sinueux)
const brainCoral = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 76, 9480);
  const dome = smooth([[cx - 76, by], [cx - 70, by - 40], [cx - 40, by - 76], [cx, by - 86], [cx + 44, by - 74], [cx + 72, by - 38], [cx + 76, by]], true, 6);
  fillShape(g, shift(dome, 6, 7), SH, 0.25); cel(g, dome, "#e8c46a", "#b08a30", 8, [smooth([[cx - 50, by - 50], [cx - 20, by - 76], [cx + 10, by - 78], [cx - 20, by - 62]], true, 4), "#f6dc94"]);
  // les sillons : des méandres qui suivent le dôme
  clipped(g, dome, () => { for (let k = 0; k < 7; k++) { const y0 = by - 10 - k * 11, rx = 76 - k * 9, pts: P[] = Array.from({ length: 30 }, (_, i) => { const t = i / 29, a = Math.PI + t * Math.PI; return [cx + Math.cos(a) * rx + Math.sin(t * 28 + k) * 3.5, y0 + Math.sin(a) * (rx * 0.9 - k * 2) * 0.1 + Math.cos(t * 23 + k * 2) * 3.5] as P; }); ink(g, smooth(pts, false, 3), "#9a7424", { w: 2.4, shadow: 0, taper: [0.1, 0.1], seed: 9481 + k }, 0.85); ink(g, shift(smooth(pts, false, 3), -1, -2), "#fff0c0", { w: 1.2, shadow: 0, taper: [0.1, 0.1], seed: 9490 + k }, 0.7); } });
  contour(g, dome, 3.4, 9499);
});
// ---------------------------------------------------------------- 12 · l'éponge (des tubes jaunes, ouverts en haut)
const sponge = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 60, 9500);
  const tubes: [number, number, number][] = [[-34, 90, 15], [-8, 136, 18], [22, 110, 16], [46, 70, 13], [-54, 58, 11]];
  tubes.sort((a, b) => b[1] - a[1]).forEach(([dx, h, w], i) => {
    const x = cx + dx, t = smooth([[x - w, by], [x - w - 3, by - h * 0.5], [x - w + 1, by - h], [x + w - 1, by - h], [x + w + 3, by - h * 0.5], [x + w, by]], true, 4);
    fillShape(g, shift(t, 5, 6), SH, 0.22); cel(g, t, "#ffcf4a", "#d08a1c", 4);
    const r = rng(9510 + i); clipped(g, t, () => { for (let k = 0; k < 14; k++) fillShape(g, blob(x - w + r() * 2 * w, by - r() * h, 1.8, 1.6, 9520 + i * 20 + k, 0.1, 6), "#b87414", 0.8); });
    contour(g, t, 2.8, 9600 + i);
    const hole = blob(x, by - h, w - 2, 5, 9610 + i, 0.03, 12); fillShape(g, hole, "#7a4a10"); ink(g, hole, INK, { w: 2, closed: true, shadow: 0, seed: 9620 + i });
  });
});
// ---------------------------------------------------------------- 13 · l'arche de pierre (un rocher percé, des algues dessus)
const arch = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 100, 9630);
  const outer: P[] = [[cx - 100, by], [cx - 96, by - 70], [cx - 70, by - 128], [cx - 20, by - 150], [cx + 36, by - 146], [cx + 82, by - 112], [cx + 100, by - 60], [cx + 98, by]];
  const hole: P[] = [[cx + 44, by], [cx + 42, by - 50], [cx + 16, by - 86], [cx - 16, by - 88], [cx - 40, by - 60], [cx - 44, by]];
  const rock = [...smooth(outer, false, 6), ...smooth(hole, false, 6)];
  fillShape(g, shift(rock, 8, 9), SH, 0.28); cel(g, rock, "#9aa8ae", "#5e6e76", 8, [smooth([[cx - 80, by - 80], [cx - 50, by - 126], [cx - 10, by - 140], [cx - 40, by - 110]], true, 4), "#c3cfd3"]);
  // les fissures et le creux sombre du dessous de l'arche
  clipped(g, rock, () => { ink(g, smooth([[cx - 60, by - 118], [cx - 52, by - 90], [cx - 64, by - 60]], false, 5), "#4e5c64", { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 9631 }, 0.8); ink(g, smooth([[cx + 60, by - 110], [cx + 70, by - 70]], false, 4), "#4e5c64", { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 9632 }, 0.8); fillShape(g, smooth(hole.map(([x, y]) => [x + (x > cx ? 10 : 6), y - 6] as P), true, 5), "#4e5c64", 0.5); });
  contour(g, rock, 3.8, 9633);
  // deux touffes d'algues sur le dessus, un petit corail rose sur le flanc
  [[-30, -148], [20, -146]].forEach(([dx, dy], i) => { for (let k = 0; k < 3; k++) branch(g, [[cx + dx + k * 6, by + dy + 4], [cx + dx + k * 6 - 6 + k * 5, by + dy - 20], [cx + dx + k * 8 - 4, by + dy - 34 - k * 4]], 4, "#6cc96a", "#3a9a4c", 9640 + i * 3 + k, 0.6); });
  branch(g, [[cx + 90, by - 50], [cx + 104, by - 66], [cx + 108, by - 84]], 4.5, "#ff8aa8", "#d0506e", 9650, 0.5);
});
// ---------------------------------------------------------------- 14 · l'algue rouge (des frondes qui se divisent)
const redAlga = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 48, 9660);
  const L = "#e8506a", S = "#a82a44";
  const grow = (p: P, a: number, len: number, w: number, d: number, seed: number) => {
    const e: P = [p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len], m: P = [(p[0] + e[0]) / 2 + Math.cos(a + Math.PI / 2) * len * 0.12, (p[1] + e[1]) / 2];
    const t = O.taper(smooth([p, m, e], false, 6), (u) => w * (1 - 0.35 * u)).outline; cel(g, t, L, S, 2); contour(g, t, 2, seed);
    if (d > 0) { grow(e, a - 0.42, len * 0.78, w * 0.72, d - 1, seed + 3); grow(e, a + 0.38, len * 0.74, w * 0.7, d - 1, seed + 7); }
    else fillShape(g, blob(e[0], e[1], w * 0.9, w * 1.2, seed + 1, 0.1, 8, a), "#ff8aa0");
  };
  grow([cx - 10, by], -Math.PI / 2 - 0.3, 48, 8, 3, 9661); grow([cx + 8, by], -Math.PI / 2 + 0.25, 52, 8, 3, 9700);
});
// ---------------------------------------------------------------- 15 · le gouvernail (la roue d'un bateau, à demi enfouie)
const helm = (g: Gfx, cx: number, by: number) => g.group("plain", () => {
  ground(g, cx, by, 76, 9740);
  const WOOD = "#b27a44", WOOD_S = "#7a4e26", c: P = [cx, by - 58], R = 60, tilt = -0.12;
  // les poignées (huit rayons qui dépassent de la jante)
  for (let i = 0; i < 8; i++) { const a = tilt + (i * TAU) / 8, s: P = [c[0] + Math.cos(a) * 14, c[1] + Math.sin(a) * 14], e: P = [c[0] + Math.cos(a) * (R + 22), c[1] + Math.sin(a) * (R + 22)]; const t = O.taper([s, [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2], e], (u) => 4.6 + 2.4 * Math.sin(Math.PI * Math.max(0, u - 0.72) / 0.28)).outline; fillShape(g, shift(t, 4, 5), SH, 0.22); cel(g, t, WOOD, WOOD_S, 2); contour(g, t, 2.4, 9741 + i); }
  // la jante (un anneau), le moyeu de laiton
  const out = blob(c[0], c[1], R + 7, R + 7, 9750, 0.01, 36), inn = blob(c[0], c[1], R - 7, R - 7, 9751, 0.01, 36), ring = [...out, out[0], ...[...inn, inn[0]].reverse()];
  fillShape(g, shift(ring, 5, 6), SH, 0.25); cel(g, ring, WOOD, WOOD_S, 4); clipped(g, ring, () => ink(g, blob(c[0], c[1], R, R, 9752, 0.01, 36), WOOD_S, { w: 1.4, closed: true, shadow: 0, seed: 9753 }, 0.7)); ink(g, out, INK, { w: 3.2, closed: true, light: O.LIGHT, shadow: 0.9, seed: 9754 }); ink(g, inn, INK, { w: 2.4, closed: true, shadow: 0.5, seed: 9755 });
  const hub = blob(c[0], c[1], 15, 15, 9756, 0.02, 16); cel(g, hub, "#e8c060", "#a8801e", 3); contour(g, hub, 2.6, 9757);
  // le sable qui en cache le bas
  const sand = smooth([[cx - 96, by + 4], [cx - 60, by - 22], [cx - 10, by - 14], [cx + 40, by - 24], [cx + 96, by + 4]], true, 5); cel(g, sand, "#fbe9c0", "#e3c88e", 3); ink(g, sand.slice(0, sand.length - 10), mix("#d8b577", INK, 0.3), { w: 2, shadow: 0, taper: [0.2, 0.2], seed: 9758 }, 0.8);
});

export const DECORS: Record<string, (g: Gfx, cx: number, by: number) => void> = {
  "corail-branchu": coralStag, "anemone-rose": anemone, gorgone: gorgonian, "coquillage-geant": giantClam, "etoile-rouge": redStar,
  "oursin-violet": urchin, herbier: seagrass, amphore: amphora, ancre: anchor, coffre: chest,
  "corail-cerveau": brainCoral, eponge: sponge, arche: arch, "algue-rouge": redAlga, gouvernail: helm,
};
export const drawDecor = (g: Gfx, id: string, cx: number, by: number) => DECORS[id]?.(g, cx, by);
