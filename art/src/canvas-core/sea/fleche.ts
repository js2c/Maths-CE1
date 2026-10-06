// LA FLÈCHE (lot « Mascotte », docs/SPEC.md, section 11 ; décision du parent du 6 octobre 2026) : là où la pieuvre montrait
// du bras, une flèche bien faite se pose au-dessus de ce qui est montré. Même main que le reste (oceanMarker.ts) : un aplat
// corail (la couleur de la pieuvre, qui montrait avant elle), la lumière en haut à gauche (un aplat plus clair poussé vers
// elle et un reflet le long de la hampe), une seule ombre nette portée, un contour au feutre qui s'épaissit du côté de
// l'ombre. La hampe se courbe un peu, comme tracée d'un seul geste ; la pointe est franche mais pas coupante.
// Ancrage : la pointe, en (0, 0) ; la flèche monte au-dessus. Taille : environ 70 × 100 px logiques.
import type { Gfx, P } from "../core";
import { fillShape, ink, smooth } from "../gallery";
import { cel, contour, shift } from "../oceanMarker";

const SH = "#0a3f49", LIT = "#ff8a6a", SHADE = "#c64d3c", GLINT = "#ffd0c0";
export const FLECHE_W = 120, FLECHE_H = 132, FLECHE_O: P = [60, 118]; // calque et ancrage (la pointe)
// le contour, pointe en (x, y) : la hampe (large de 24 px) se courbe un peu vers la gauche en montant ; la tête (66 px) a
// des flancs légèrement creusés, comme une pointe de flèche dessinée au feutre
export const flecheShape = (x: number, y: number): P[] => {
  const pts: P[] = [
    [x - 13, y - 92], [x - 9, y - 97], [x + 9, y - 98], [x + 13, y - 93], // le haut de la hampe, arrondi
    [x + 12, y - 70], [x + 12, y - 47],                                     // le flanc droit de la hampe
    [x + 31, y - 49], [x + 35, y - 45],                                     // l'aile droite de la tête
    [x + 14, y - 20], [x + 3, y - 2], [x, y], [x - 3, y - 2], [x - 14, y - 21], // la pointe
    [x - 34, y - 44], [x - 30, y - 48],                                     // l'aile gauche
    [x - 11, y - 46], [x - 14, y - 70],                                     // le flanc gauche de la hampe, un peu cintré
  ];
  return smooth(pts, true, 5);
};
export const drawFleche = (g: Gfx, x: number, y: number) => g.group("plain", () => {
  const s = flecheShape(x, y);
  fillShape(g, shift(s, 4, 5), SH, 0.28);       // l'ombre portée, nette, en bas à droite
  cel(g, s, LIT, SHADE, 7);                       // l'aplat clair poussé vers la lumière (haut gauche), l'ombre de forme
  // le reflet : un trait clair le long de la hampe, côté lumière, et un petit sur l'aile gauche
  ink(g, smooth([[x - 6, y - 89], [x - 7, y - 72], [x - 6, y - 55]], false, 6), GLINT, { w: 3.4, shadow: 0, taper: [0.5, 0.6], seed: 9101 }, 0.9);
  ink(g, smooth([[x - 26, y - 45], [x - 17, y - 33]], false, 4), GLINT, { w: 2.4, shadow: 0, taper: [0.5, 0.5], seed: 9102 }, 0.8);
  contour(g, s, 4, 9103);
});
