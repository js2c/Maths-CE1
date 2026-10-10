// LES GALETS DE L'ACCUEIL (lot « Correctifs : passage de l'échauffement aux voiliers », point 10 ; demande du parent du
// 10 octobre 2026, capture 06). Les cinq boutons de l'accueil (jouer ou « Encore ! », choisir, les leçons, le récif, l'album)
// deviennent plus grands (au moins 200 px de large) et « patatoïdes » : chacun sa forme de galet, irrégulière, différente
// des autres. Style A : la nacre des bulles-réponses (aplat clair, ombre propre bleutée du côté opposé à la lumière, reflet en
// haut à gauche), une ombre nette portée sur le sable, le contour d'encre qui s'épaissit du côté de l'ombre ; le pictogramme
// de chaque bulle d'avant, agrandi (×1,5). La forme d'un galet est un `blob` (graine, rayons, irrégularité, rotation) :
// `GALETS`, repris tel quel par le dessin en direct (runtime.ts, drawSelectGalet) pour l'entourage de sélection, qui en suit
// exactement le bord (comme les tuiles, point 8).
import type { Gfx, P } from "../core";
import { blob, fillShape, ink, smooth } from "../gallery";
import { cel, contour, shift } from "../oceanMarker";

export type Galet = { rx: number; ry: number; seed: number; k: number; n: number; rot: number };
// (rayons en px de la scène ; k : l'irrégularité ; n : le nombre de points du contour avant lissage, peu nombreux : des bosses
// larges ; rot : l'inclinaison) ; de 202 à 209 px de large (tests/unit/passages.test.mjs)
export const GALETS: Record<string, Galet> = {
  jouer: { rx: 105, ry: 88, seed: 4101, k: 0.14, n: 5, rot: -0.1 },
  choisir: { rx: 104, ry: 93, seed: 4117, k: 0.15, n: 6, rot: 0.25 },
  encore: { rx: 107, ry: 90, seed: 4129, k: 0.14, n: 5, rot: 0.06 },
  lecons: { rx: 104, ry: 86, seed: 4133, k: 0.15, n: 6, rot: -0.2 },
  recif: { rx: 105, ry: 95, seed: 4141, k: 0.16, n: 5, rot: 0.5 },
  album: { rx: 106, ry: 88, seed: 4157, k: 0.14, n: 6, rot: -0.35 },
};
// la taille d'un sprite de galet (ombre comprise) et le grossissement des pictogrammes
export const GALET_W = 290, GALET_H = 260, ICONE_K = 1.5;
// l'entourage de sélection : son trait passe à `ENTOURAGE` px du bord du galet
export const ENTOURAGE = 13;
// le contour d'un galet centré sur (cx, cy)
export const galetForme = (cx: number, cy: number, f: Galet, plus = 0): P[] => blob(cx, cy, f.rx + plus, f.ry + plus, f.seed, f.k, f.n, f.rot);
// le contour décalé vers l'extérieur de `d` px, point par point, le long de la normale : l'entourage à distance égale du bord
export const decale = (pts: P[], d: number): P[] => {
  const n = pts.length - (pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1] ? 1 : 0), out: P[] = [];
  let aire = 0; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; aire += a[0] * b[1] - b[0] * a[1]; }
  const sens = aire > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    out.push([pts[i][0] + (sens * dy / L) * d, pts[i][1] - (sens * dx / L) * d]);
  }
  out.push(out[0]);
  return out;
};

// le galet : ombre portée, nacre, reflet, contour ; puis le pictogramme, agrandi, au centre
export const drawGalet = (g: Gfx, cx: number, cy: number, id: string, icone: (g: Gfx, cx: number, cy: number) => void, i = 0) => {
  const f = GALETS[id], s = galetForme(cx, cy, f);
  g.group("plain", () => {
    fillShape(g, shift(s, 9, 11), "#8d6f45", 0.35);
    const hi = smooth([[cx - f.rx * 0.55, cy - f.ry * 0.18], [cx - f.rx * 0.42, cy - f.ry * 0.5], [cx - f.rx * 0.12, cy - f.ry * 0.66]], false, 4);
    cel(g, s, "#fffaf0", "#cfe6ea", 12, [shift(hi, 0, 0), "#ffffff"]);
    ink(g, smooth([[cx - f.rx * 0.6, cy - f.ry * 0.14], [cx - f.rx * 0.46, cy - f.ry * 0.5], [cx - f.rx * 0.16, cy - f.ry * 0.68]], false, 6), "#ffffff", { w: 7, shadow: 0, taper: [0.3, 0.4], seed: 4210 + i });
    contour(g, s, 6.5, 4220 + i);
  });
  g.push(cx, cy, ICONE_K); icone(g, 0, 0); g.pop();
};
