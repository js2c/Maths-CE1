// LES PROBLÈMES (maquette : docs/maquettes/problemes/PROPOSITION.md ; banque : art/problemes/enonces.json). Ce que le code
// dessine, dans la main du reste (oceanMarker.ts : aplats, une ombre nette, contour épais côté ombre, lumière en haut à
// gauche) ; l'illustration du lieu, elle, est une image générée à part (art/problemes/contextes.json), sans quantité :
//  - LES OBJETS QU'ON COMPTE (13) : bille, biscuit, pomme, œuf, crayon, ballon, bonbon, fleur, perle, livre, poisson,
//    personne (un petit personnage de bois, comme ceux des classes) et jeton (le pion rond, pour tout le reste) ; ~46 px de
//    haut à l'échelle 1, centrés sur (cx, cy) ;
//  - LES CONTENANTS (5) et l'anneau de corde (les groupes sans contenant) : sachet transparent, assiette, boîte (cagette),
//    panier, vase ; dessinés en deux temps (le fond, puis le devant après les objets) ;
//  - LES ÉTIQUETTES des données (le nombre et l'objet) posées au bas de l'illustration, la plaque de la réponse, le cadre
//    de l'illustration ;
//  - LE SCHÉMA EN BARRES (le tout et ses deux parties), LA COMPARAISON (deux barres et l'écart), LES GROUPES (objets à
//    grouper dans leurs contenants, les totaux comptés dessous).
// Les nombres sont écrits avec les chiffres de l'application (runtime.ts), le « ? » en rouge.
import { turn, type Gfx, type P } from "../core";
import { blob, clipped, fillShape, ink, mix, smooth } from "../gallery";
import { cel, contour, INK, shift } from "../oceanMarker";
import { rrect } from "./treasure";
import { drawNumber, drawWord, RED, wordWidth } from "./runtime";

const SH = "#0a3f49", NACRE = "#fffaf0", NACRE_S = "#e3d6bb", LIT = "#ffe45c", ORANGE = "#ffb13b", ORANGE_S = "#d5781a", BLUE = "#5cb8f0", BLUE_S = "#2f7fb8";
export type Objet = "bille" | "biscuit" | "pomme" | "oeuf" | "crayon" | "ballon" | "bonbon" | "fleur" | "perle" | "livre" | "poisson" | "personne" | "jeton";
export const OBJETS: Objet[] = ["bille", "biscuit", "pomme", "oeuf", "crayon", "ballon", "bonbon", "fleur", "perle", "livre", "poisson", "personne", "jeton"];
export type Contenant = "sachet" | "assiette" | "boite" | "panier" | "vase" | "anneau";

// une forme posée : ombre portée nette, aplat et ombre propre, reflet, contour
const piece = (g: Gfx, s: P[], lit: string, shade: string, k: number, seed: number, w: number, hi?: [P[], string]) => {
  fillShape(g, shift(s, 3 * k, 4 * k), SH, 0.22); cel(g, s, lit, shade, 4 * k, hi); contour(g, s, w, seed);
};
// un tracé fermé à partir de points relatifs au centre, à l'échelle k
const at = (cx: number, cy: number, k: number, pts: P[]): P[] => pts.map(([x, y]) => [cx + x * k, cy + y * k]);
const reflet = (cx: number, cy: number, k: number, x: number, y: number, rx: number, ry: number, seed: number) => blob(cx + x * k, cy + y * k, rx * k, ry * k, seed, 0.08, 8);

// ---------------------------------------------------------------- les objets
// palette de quelques objets qui changent de couleur d'un exemplaire à l'autre (crayons, perles, personnages)
const TEINTES: [string, string][] = [["#ff5a5f", "#c23a45"], ["#5cb8f0", "#2f7fb8"], ["#7fcf6a", "#4a9a3d"], ["#ffd23a", "#e0a21a"], ["#c58cf0", "#8f5bc0"]];
export const drawObjet = (g: Gfx, kind: Objet, cx: number, cy: number, k = 1, seed = 1, teinte = 0) => g.group("plain", () => {
  const S = 13000 + seed * 17, w = 2.4 * Math.max(0.7, k), T = TEINTES[teinte % TEINTES.length];
  switch (kind) {
    case "bille": { // une bille de verre : le bleu, la flamme jaune tournée dedans, un reflet net
      const s = blob(cx, cy, 16 * k, 16 * k, S, 0.015, 18);
      fillShape(g, shift(s, 3 * k, 4 * k), SH, 0.22); cel(g, s, BLUE, BLUE_S, 4 * k);
      clipped(g, s, () => { ink(g, smooth(at(cx, cy, k, [[-11, 6], [-4, -2], [4, -3], [10, -10]]), false, 6), LIT, { w: 5 * k, shadow: 0, taper: [0.5, 0.2], seed: S + 1 }); ink(g, smooth(at(cx, cy, k, [[-6, 12], [2, 5], [9, 6]]), false, 5), "#ff8a5c", { w: 3 * k, shadow: 0, taper: [0.4, 0.4], seed: S + 2 }); });
      fillShape(g, reflet(cx, cy, k, -6, -8, 4.5, 3, S + 3), "#ffffff", 0.9); contour(g, s, w, S + 4); break;
    }
    case "biscuit": { // un biscuit rond aux pépites de chocolat, le bord un peu bosselé
      const s = blob(cx, cy, 18 * k, 17 * k, S, 0.05, 16);
      piece(g, s, "#e9b36a", "#c4823f", k, S + 1, w, [reflet(cx, cy, k, -6, -8, 7, 4, S + 2), "#f6d39a"]);
      ([[-7, -4], [5, -8], [8, 4], [-3, 8], [-10, 6], [1, 0]] as P[]).forEach(([x, y], i) => fillShape(g, blob(cx + x * k, cy + y * k, 2.6 * k, 2.2 * k, S + 10 + i, 0.2, 7), "#5a3420"));
      break;
    }
    case "pomme": { // une pomme : deux bosses en haut, la queue, une feuille
      const s = smooth(at(cx, cy + 2, k, [[0, -12], [8, -17], [17, -10], [17, 5], [9, 16], [0, 14], [-9, 16], [-17, 5], [-17, -10], [-8, -17]]), true, 6);
      piece(g, s, "#e8423a", "#b12a2a", k, S, w, [reflet(cx, cy, k, -8, -6, 4, 6, S + 1), "#ff8c7a"]);
      ink(g, at(cx, cy, k, [[0, -10], [1, -16], [3, -21]]), "#6a3e28", { w: 3 * k, shadow: 0, taper: [0.1, 0.3], seed: S + 2 });
      const f = smooth(at(cx, cy, k, [[3, -18], [9, -24], [16, -22], [11, -16]]), true, 5); cel(g, f, "#7fcf6a", "#4a9a3d", 2 * k); contour(g, f, 1.8 * Math.max(0.7, k), S + 3);
      break;
    }
    case "oeuf": { // un œuf roux, plus fin en haut, quelques taches
      const s = smooth(at(cx, cy, k, [[0, -20], [11, -12], [14, 3], [9, 15], [0, 18], [-9, 15], [-14, 3], [-11, -12]]), true, 6);
      piece(g, s, "#f3dcc0", "#d6b48c", k, S, w, [reflet(cx, cy, k, -5, -9, 3.5, 6, S + 1), "#fff6ea"]);
      ([[5, 2], [-4, 9], [7, 11]] as P[]).forEach(([x, y], i) => fillShape(g, blob(cx + x * k, cy + y * k, 1.3 * k, 1.1 * k, S + 5 + i, 0.2, 6), "#b58a62", 0.7));
      break;
    }
    case "crayon": { // un crayon de couleur couché en biais : le corps à pans, le bois taillé, la mine, la gomme
      const r = -32, body = turn(at(cx, cy, k, [[-20, -5], [11, -5], [11, 5], [-20, 5]]), cx, cy, r), tip = turn(at(cx, cy, k, [[11, -5], [22, 0], [11, 5]]), cx, cy, r);
      const lead = turn(at(cx, cy, k, [[18.5, -1.6], [22, 0], [18.5, 1.6]]), cx, cy, r), ferrule = turn(at(cx, cy, k, [[-24, -5], [-20, -5], [-20, 5], [-24, 5]]), cx, cy, r), gum = turn(smooth(at(cx, cy, k, [[-24, -5], [-29, -4], [-30, 0], [-29, 4], [-24, 5]]), true, 3), cx, cy, r);
      fillShape(g, shift([...gum, ...tip], 3 * k, 4 * k), SH, 0.22);
      cel(g, gum, "#ff9fb0", "#d76a80", 1.5 * k); contour(g, gum, w * 0.8, S);
      cel(g, ferrule, "#d8dde2", "#9aa4ad", 1.5 * k); contour(g, ferrule, w * 0.8, S + 1);
      cel(g, tip, "#f3d2a2", "#d6ad73", 1.5 * k); fillShape(g, lead, T[1]); contour(g, tip, w * 0.8, S + 2);
      cel(g, body, T[0], T[1], 2 * k); ink(g, turn(at(cx, cy, k, [[-19, -1], [10, -1]]), cx, cy, r), mix(T[0], "#ffffff", 0.45), { w: 1.6 * k, shadow: 0, seed: S + 3 }); contour(g, body, w, S + 4);
      break;
    }
    case "ballon": { // un ballon de football : le cuir crème, les pièces sombres qui suivent la sphère
      const s = blob(cx, cy, 17 * k, 17 * k, S, 0.015, 18);
      fillShape(g, shift(s, 3 * k, 4 * k), SH, 0.22); cel(g, s, NACRE, "#d4cbbb", 4 * k);
      clipped(g, s, () => {
        const pent = (x: number, y: number, r: number, a: number) => Array.from({ length: 5 }, (_, i) => [cx + (x + Math.cos(a + (i * Math.PI * 2) / 5) * r) * k, cy + (y + Math.sin(a + (i * Math.PI * 2) / 5) * r) * k] as P);
        fillShape(g, pent(1, 1, 6.5, -Math.PI / 2), "#2a2a3a");
        ([[15, -6, 0.2], [-13, -9, 2.4], [-11, 12, 1.4], [10, 14, -0.6], [2, -19, 1]] as [number, number, number][]).forEach(([x, y, a]) => fillShape(g, pent(x, y, 5.5, a), "#2a2a3a"));
      });
      fillShape(g, reflet(cx, cy, k, -8, -8, 4, 2.6, S + 1), "#ffffff", 0.85); contour(g, s, w, S + 2); break;
    }
    case "bonbon": { // un bonbon dans son papier tortillé aux deux bouts
      const c = blob(cx, cy, 12 * k, 9 * k, S, 0.03, 14), L = smooth(at(cx, cy, k, [[-10, -2], [-22, -10], [-19, 0], [-22, 10], [-10, 2]]), true, 3), R = smooth(at(cx, cy, k, [[10, -2], [22, -10], [19, 0], [22, 10], [10, 2]]), true, 3);
      fillShape(g, shift([...L, ...R], 3 * k, 4 * k), SH, 0.2);
      for (const [p, i] of [[L, 0], [R, 1]] as [P[], number][]) { cel(g, p, "#ffc2d6", "#e08aa8", 1.5 * k); contour(g, p, w * 0.8, S + 1 + i); }
      piece(g, c, "#ff7aa8", "#d14d7c", k * 0.6, S + 3, w);
      clipped(g, c, () => ink(g, at(cx, cy, k, [[-8, 8], [7, -9]]), "#ffffff", { w: 3 * k, shadow: 0, seed: S + 4 }, 0.8));
      break;
    }
    case "fleur": { // une tulipe : la tige, une feuille, la coupe à trois pétales
      ink(g, smooth(at(cx, cy, k, [[1, 22], [0, 10], [0, -2]]), false, 5), "#4a9a3d", { w: 3.2 * k, shadow: 0.4, seed: S });
      const f = smooth(at(cx, cy, k, [[1, 18], [-9, 6], [-12, -2], [-4, 6]]), true, 5); cel(g, f, "#7fcf6a", "#4a9a3d", 2 * k); contour(g, f, w * 0.8, S + 1);
      const c = smooth(at(cx, cy, k, [[-11, -4], [-13, -17], [-6, -12], [0, -21], [6, -12], [13, -17], [11, -4], [0, 2]]), true, 4);
      piece(g, c, "#ff5a5f", "#c23a45", k * 0.7, S + 2, w, [reflet(cx, cy, k, -6, -10, 2.5, 4, S + 3), "#ff9a96"]);
      ink(g, at(cx, cy, k, [[0, -1], [0, -14]]), "#c23a45", { w: 1.6 * k, shadow: 0, taper: [0.2, 0.4], seed: S + 4 });
      break;
    }
    case "perle": { // une perle à enfiler : ronde, son trou, un reflet
      const s = blob(cx, cy, 13 * k, 12 * k, S, 0.02, 14);
      piece(g, s, T[0], T[1], k, S, w, [reflet(cx, cy, k, -5, -6, 3.5, 2.5, S + 1), "#ffffff"]);
      const h = blob(cx + 1 * k, cy + 1 * k, 3.4 * k, 2.6 * k, S + 2, 0.05, 8); fillShape(g, h, "#3b2a4a"); ink(g, h, INK, { w: 1.2 * k, closed: true, shadow: 0, seed: S + 3 });
      break;
    }
    case "livre": { // un livre fermé, posé un peu de biais : la couverture, la tranche des pages, le dos
      const r = -8, cover = turn(at(cx, cy, k, [[-14, -18], [13, -18], [13, 18], [-14, 18]]), cx, cy, r), pages = turn(at(cx, cy, k, [[13, -16], [17, -14], [17, 20], [13, 18]]), cx, cy, r);
      fillShape(g, shift([...cover, ...pages], 3 * k, 4 * k), SH, 0.22);
      cel(g, pages, NACRE, NACRE_S, 1.5 * k); [0, 1, 2].forEach((i) => ink(g, turn(at(cx, cy, k, [[14 + i, -14 + i * 0.6], [14 + i, 18]]), cx, cy, r), NACRE_S, { w: 0.9 * k, shadow: 0, seed: S + 10 + i })); contour(g, pages, w * 0.8, S);
      cel(g, cover, T[0], T[1], 2.5 * k); fillShape(g, turn(at(cx, cy, k, [[-14, -18], [-9, -18], [-9, 18], [-14, 18]]), cx, cy, r), T[1]);
      const lab = turn(at(cx, cy, k, [[-4, -10], [8, -10], [8, -3], [-4, -3]]), cx, cy, r); fillShape(g, lab, NACRE); ink(g, lab, INK, { w: 1.2 * k, closed: true, shadow: 0, seed: S + 1 });
      contour(g, cover, w, S + 2); break;
    }
    case "poisson": { // un petit poisson orange, comme ceux des aides : le corps, la queue, la nageoire, l'œil, la bouche
      const b = smooth(at(cx, cy, k, [[20, 0], [12, -9], [0, -11], [-11, -7], [-15, 0], [-11, 7], [0, 11], [12, 8]]), true, 5), t = smooth(at(cx, cy, k, [[-13, 0], [-22, -9], [-20, 0], [-22, 9]]), true, 3);
      fillShape(g, shift([...b, ...t], 3 * k, 4 * k), SH, 0.22);
      cel(g, t, ORANGE, ORANGE_S, 2 * k); contour(g, t, w * 0.8, S);
      cel(g, b, ORANGE, ORANGE_S, 3 * k, [reflet(cx, cy, k, 2, -6, 7, 2.5, S + 1), "#ffd27a"]);
      ink(g, smooth(at(cx, cy, k, [[-2, -9], [3, -1], [-1, 6]]), false, 4), ORANGE_S, { w: 1.6 * k, shadow: 0, taper: [0.3, 0.3], seed: S + 2 });
      fillShape(g, blob(cx + 11 * k, cy - 2.5 * k, 3.2 * k, 3.2 * k, S + 3, 0.05, 8), "#ffffff"); fillShape(g, blob(cx + 11.8 * k, cy - 2.3 * k, 1.6 * k, 1.7 * k, S + 4, 0.05, 6), INK);
      ink(g, at(cx, cy, k, [[16, 3], [19, 2.5]]), INK, { w: 1.2 * k, shadow: 0, seed: S + 5 });
      contour(g, b, w, S + 6); break;
    }
    case "personne": { // un petit personnage de bois (comme les pions des classes) : la robe en cloche, la tête, les cheveux, le visage
      const body = smooth(at(cx, cy, k, [[-5, -6], [5, -6], [9, 6], [12, 19], [0, 21], [-12, 19], [-9, 6]]), true, 4), head = blob(cx, cy - 13 * k, 8.5 * k, 8.5 * k, S, 0.02, 14);
      fillShape(g, shift(body, 3 * k, 4 * k), SH, 0.22); cel(g, body, T[0], T[1], 3 * k); contour(g, body, w, S + 1);
      cel(g, head, "#f4c9a0", "#d9a27a", 2 * k);
      clipped(g, head, () => fillShape(g, smooth(at(cx, cy, k, [[-10, -14], [-6, -22], [4, -23], [10, -15], [4, -18], [-4, -17]]), true, 4), "#5a3420"));
      [-3.2, 3.2].forEach((x, i) => fillShape(g, blob(cx + x * k, cy - 12 * k, 1.2 * k, 1.4 * k, S + 2 + i, 0.05, 6), INK));
      ink(g, smooth(at(cx, cy, k, [[-2.6, -8.6], [0, -7.4], [2.6, -8.6]]), false, 4), INK, { w: 1.1 * k, shadow: 0, taper: [0.3, 0.3], seed: S + 4 });
      contour(g, head, w * 0.9, S + 5); break;
    }
    case "jeton": { // un jeton rond : le pion des classes, l'anneau gravé
      const s = blob(cx, cy, 16 * k, 15 * k, S, 0.015, 18);
      piece(g, s, "#ffd23a", "#e0a21a", k, S, w, [reflet(cx, cy, k, -6, -7, 4, 2.6, S + 1), "#fff1a8"]);
      ink(g, blob(cx + 0.5 * k, cy + 0.5 * k, 10 * k, 9.4 * k, S + 2, 0.015, 16), "#c98a12", { w: 1.6 * k, closed: true, shadow: 0, seed: S + 3 });
      break;
    }
  }
});

// ---------------------------------------------------------------- les contenants (le fond, puis le devant après les objets)
// (cx, cy) : le centre de la place des objets ; w × h : la place qu'ils occupent
export const drawContenant = (g: Gfx, kind: Contenant, cx: number, cy: number, w: number, h: number, part: "fond" | "devant", seed = 1) => g.group("plain", () => {
  const S = 14000 + seed * 23, x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
  switch (kind) {
    case "sachet": { // un sachet transparent, froncé en haut et fermé par un lien doré : on voit tout ce qu'il y a dedans
      const bag = smooth([[cx - 12, y0 - 28], [x0 - 2, y0 - 8], [x0 - 14, cy], [x0 - 8, y1 + 10], [cx, y1 + 16], [x1 + 8, y1 + 10], [x1 + 14, cy], [x1 + 2, y0 - 8], [cx + 12, y0 - 28]], true, 6);
      const ruff = smooth([[cx - 11, y0 - 28], [cx - 22, y0 - 46], [cx - 7, y0 - 40], [cx, y0 - 50], [cx + 7, y0 - 40], [cx + 22, y0 - 46], [cx + 11, y0 - 28]], true, 4);
      if (part === "fond") { fillShape(g, shift(bag, 6, 8), SH, 0.18); fillShape(g, bag, "#eaf6f8", 0.5); fillShape(g, ruff, "#eaf6f8", 0.75); }
      else {
        clipped(g, bag, () => { ink(g, smooth([[x0 + 2, y0 + 4], [x0 - 4, cy], [x0 + 2, y1 - 2]], false, 5), "#ffffff", { w: 4.5, shadow: 0, taper: [0.4, 0.4], seed: S }, 0.75); [-1, 1].forEach((sd, i) => ink(g, [[cx + sd * 8, y0 - 24], [cx + sd * (w * 0.28), y0 + 2]], "#9fc4cc", { w: 1.6, shadow: 0, taper: [0.1, 0.5], seed: S + 5 + i }, 0.8)); });
        ink(g, ruff, INK, { w: 2.2, closed: true, shadow: 0.6, seed: S + 1 }, 0.85);
        ink(g, bag, INK, { w: 2.6, closed: true, shadow: 0.8, seed: S + 3 }, 0.85);
        ink(g, smooth([[cx - 15, y0 - 29], [cx, y0 - 26], [cx + 15, y0 - 29]], false, 4), "#e0b43a", { w: 5, shadow: 0, seed: S + 2 }); ink(g, smooth([[cx + 10, y0 - 28], [cx + 18, y0 - 20], [cx + 14, y0 - 12]], false, 4), "#e0b43a", { w: 3, shadow: 0, taper: [0.1, 0.5], seed: S + 4 });
      }
      break;
    }
    case "assiette": { // une assiette vue un peu de dessus : le marli, le creux, un filet bleu
      const out = blob(cx, cy + 4, w / 2 + 22, h / 2 + 18, S, 0.01, 28), inn = blob(cx, cy + 6, w / 2 + 4, h / 2 + 4, S + 1, 0.01, 24);
      if (part === "fond") { fillShape(g, shift(out, 6, 8), SH, 0.25); cel(g, out, NACRE, "#d8e2e4", 5); fillShape(g, inn, "#eef3f2"); ink(g, blob(cx, cy + 5, w / 2 + 12, h / 2 + 11, S + 2, 0.01, 28), "#7fb2d8", { w: 2, closed: true, shadow: 0, seed: S + 3 }, 0.8); ink(g, inn, "#c9d3d4", { w: 2, closed: true, shadow: 0, seed: S + 4 }); contour(g, out, 3, S + 5); }
      break;
    }
    case "boite": { // une cagette en bois : le fond, les objets, puis la planche de devant (basse, elle ne cache rien)
      const back = [[x0 - 10, y0 - 14], [x1 + 10, y0 - 14], [x1 + 10, y1 + 6], [x0 - 10, y1 + 6]] as P[], front = rrect(x0 - 16, y1 - 2, w + 32, 26, 4);
      if (part === "fond") { fillShape(g, shift(back, 6, 8), SH, 0.22); cel(g, back, "#c99a62", "#9a6c3c", 4); [0.33, 0.66].forEach((t, i) => ink(g, [[x0 - 10, y0 - 14 + (h + 20) * t], [x1 + 10, y0 - 14 + (h + 20) * t]], "#8a5c30", { w: 2, shadow: 0, seed: S + i }, 0.7)); contour(g, back, 3, S + 3); }
      else { fillShape(g, shift(front, 4, 5), SH, 0.25); cel(g, front, "#e2b57a", "#b5824a", 3); ink(g, [[x0 - 8, y1 + 11], [x1 + 8, y1 + 11]], "#b5824a", { w: 1.6, shadow: 0, seed: S + 4 }); [x0 - 8, x1 + 8].forEach((x, i) => fillShape(g, blob(x, y1 + 11, 2, 2, S + 5 + i, 0.1, 6), "#5a3420")); contour(g, front, 3, S + 7); }
      break;
    }
    case "panier": { // un panier d'osier, son anse : les objets en tas dedans, le haut du tas au-dessus du bord
      const top = cy - h * 0.1, body = smooth([[x0 - 16, top], [x1 + 16, top], [x1 + 6, y1 + 22], [x0 - 6, y1 + 22]], true, 3), rim = blob(cx, top, w / 2 + 18, 9, S, 0.01, 22);
      if (part === "fond") {
        const handle = smooth([[x0 - 8, top], [x0 - 4, y0 - 24], [cx, y0 - 42], [x1 + 4, y0 - 24], [x1 + 8, top]], false, 8);
        ink(g, handle, "#9a6c3c", { w: 8, shadow: 0.5, seed: S }); ink(g, handle, "#d9a865", { w: 4, shadow: 0, seed: S + 1 });
        fillShape(g, shift(body, 5, 7), SH, 0.25); cel(g, body, "#d9a865", "#a8763c", 3);
        clipped(g, body, () => { for (let i = 0; i < 7; i++) ink(g, [[x0 - 16, top + 8 + i * 8], [x1 + 16, top + 8 + i * 8]], "#a8763c", { w: 1.6, shadow: 0, seed: S + 10 + i }, 0.8); for (let j = 0; j < 14; j++) { const x = x0 - 12 + ((w + 24) * j) / 13; ink(g, [[x, top], [x + (x - cx) * -0.06, y1 + 22]], "#a8763c", { w: 1.2, shadow: 0, seed: S + 30 + j }, 0.55); } });
        contour(g, body, 3, S + 3); fillShape(g, blob(cx, top + 1, w / 2 + 12, 6, S + 2, 0.01, 20), "#6a4a28"); cel(g, rim, "#e8c08a", "#b5824a", 2); contour(g, rim, 2.6, S + 4);
      }
      break;
    }
    case "vase": { // un grand bocal de verre, le bord roulé, un peu d'eau au fond : on voit les fleurs dedans
      const v = smooth([[x0 - 4, y0 - 22], [x1 + 4, y0 - 22], [x1 + 16, cy], [x1 + 10, y1 + 18], [x0 - 10, y1 + 18], [x0 - 16, cy]], true, 5), rim = blob(cx, y0 - 22, w / 2 + 8, 7, S + 2, 0.01, 20);
      if (part === "fond") { fillShape(g, shift(v, 5, 6), SH, 0.2); fillShape(g, v, "#dff1f4", 0.55); clipped(g, v, () => fillShape(g, [[x0 - 30, y1 - 4], [x1 + 30, y1 - 4], [x1 + 30, y1 + 40], [x0 - 30, y1 + 40]], "#9fd6e0", 0.5)); }
      else { clipped(g, v, () => ink(g, smooth([[x0 - 2, y0 - 10], [x0 - 10, cy], [x0 - 4, y1 + 6]], false, 5), "#ffffff", { w: 4, shadow: 0, taper: [0.4, 0.4], seed: S }, 0.8)); ink(g, v, INK, { w: 2.6, closed: true, shadow: 0.8, seed: S + 1 }, 0.9); ink(g, rim, INK, { w: 2.4, closed: true, shadow: 0.6, seed: S + 3 }, 0.85); }
      break;
    }
    case "anneau": { // un anneau de corde posé au sol : un groupe sans contenant
      const r = blob(cx, cy + 2, w / 2 + 14, h / 2 + 12, S, 0.02, 26);
      if (part === "fond") { fillShape(g, r, "#ffffff", 0.18); ink(g, r, "#8a6a3a", { w: 8, closed: true, shadow: 0.6, seed: S + 1 }); ink(g, r, "#e8c891", { w: 4.5, closed: true, shadow: 0, seed: S + 2 }); for (let i = 0; i < 22; i++) { const p = r[(i * Math.floor(r.length / 22)) % r.length]; ink(g, [[p[0] - 2, p[1] - 3], [p[0] + 2, p[1] + 3]], "#8a6a3a", { w: 1.3, shadow: 0, seed: S + 10 + i }); } }
      break;
    }
  }
});
// la place des objets d'un groupe : `n` objets rangés en lignes d'au plus `cols`, au pas `p`
export const placesGroupe = (cx: number, cy: number, n: number, p: number, cols = n <= 4 ? 2 : n <= 9 ? 3 : 5): P[] => {
  const rows = Math.ceil(n / cols); return Array.from({ length: n }, (_, i) => { const r = Math.floor(i / cols), c = i % cols, inRow = r === rows - 1 ? n - r * cols : cols; return [cx + (c - (inRow - 1) / 2) * p, cy + (r - (rows - 1) / 2) * p * 0.86] as P; });
};
export const tailleGroupe = (n: number, p: number, cols = n <= 4 ? 2 : n <= 9 ? 3 : 5): [number, number] => [Math.min(n, cols) * p, Math.ceil(n / cols) * p * 0.86];
// un groupe : le contenant, ses objets (les `plein` premiers ; les autres places restent vides), le devant
export const drawGroupe = (g: Gfx, c: Contenant, objet: Objet, cx: number, cy: number, n: number, k: number, o: { plein?: number; seed?: number; lit?: boolean } = {}) => {
  const p = 44 * k, [w, h] = tailleGroupe(n, p), plein = o.plein ?? n, seed = o.seed ?? 1;
  if (o.lit) g.group("plain", () => { const r = blob(cx, cy + 4, w / 2 + 46, h / 2 + 46, 14900 + seed, 0.02, 24); fillShape(g, r, LIT, 0.55); ink(g, r, LIT, { w: 6, closed: true, shadow: 0, seed: 14950 + seed }); });
  drawContenant(g, c, cx, cy, w, h, "fond", seed);
  placesGroupe(cx, cy, n, p).forEach(([x, y], i) => { if (i < plein) drawObjet(g, objet, x, y, k * 0.86, seed * 31 + i, i); });
  drawContenant(g, c, cx, cy, w, h, "devant", seed);
};

// ---------------------------------------------------------------- les étiquettes, la réponse, le cadre
const num = (g: Gfx, t: string, cx: number, top: number, em: number, color = INK, seed = 13900) => (/^[\d ]+$/.test(t) ? drawNumber(g.cur as CanvasRenderingContext2D, t, cx, top, em, { color, w: em * 0.15, seed }) : drawWord(g.cur as CanvasRenderingContext2D, t, cx, top, em, { color, w: em * 0.15, seed }));
const textW = (t: string, em: number) => wordWidth(t) * em;
// une étiquette de donnée : une plaque de nacre, le nombre et l'objet. Renvoie sa largeur.
export const ETIQ_H = 66;
export const largeurEtiquette = (t: string, em = 38, objet: Objet | null = "jeton") => textW(t, em) + (objet ? em * 1.2 + 50 : 44);
export const drawEtiquette = (g: Gfx, x: number, y: number, t: string, objet: Objet | null, o: { lit?: boolean; seed?: number; em?: number; rouge?: boolean } = {}) => {
  const em = o.em ?? 38, w = largeurEtiquette(t, em, objet), seed = o.seed ?? 1;
  g.group("plain", () => { const s = rrect(x, y, w, ETIQ_H, 18); fillShape(g, shift(s, 4, 6), SH, 0.3); cel(g, s, o.lit ? "#fff3b8" : NACRE, NACRE_S, 4); if (o.lit) ink(g, rrect(x - 5, y - 5, w + 10, ETIQ_H + 10, 22), LIT, { w: 5, closed: true, shadow: 0, seed: 13800 + seed }, 0.9); contour(g, s, 3, 13810 + seed);
    num(g, t, x + 20 + textW(t, em) / 2, y + ETIQ_H / 2 - em / 2, em, o.rouge ? RED : INK, 13820 + seed * 7); });
  if (objet) drawObjet(g, objet, x + w - em, y + ETIQ_H / 2, (0.9 * em) / 38, 400 + seed);
  return w;
};
// la plaque de la réponse : plus grande, bordée d'or comme l'ardoise ; « ? » rouge tant que rien n'est tapé
export const drawReponse = (g: Gfx, x: number, y: number, w: number, t: string, objet: Objet, o: { juste?: boolean } = {}) => {
  const h = 84, em = 50;
  g.group("plain", () => { const s = rrect(x, y, w, h, 22); fillShape(g, shift(s, 5, 7), SH, 0.32); cel(g, s, o.juste ? "#eaffd8" : NACRE, NACRE_S, 5); ink(g, rrect(x + 9, y + 9, w - 18, h - 18, 14), "#e0b43a", { w: 2.4, closed: true, shadow: 0, seed: 13850 }, 0.85); contour(g, s, 4, 13851);
    num(g, t, x + 26 + Math.max(textW(t, em), 30) / 2 + 6, y + h / 2 - em / 2, em, t === "?" ? RED : INK, 13860); });
  drawObjet(g, objet, x + w - 48, y + h / 2, 1.05, 450);
};
// la plaque du calcul (la correction l'écrit : « 23 − 9 = 14 »), comme l'ardoise ; centrée sur cx
export const drawCalcul = (g: Gfx, cx: number, y: number, t: string, em = 44) => g.group("plain", () => {
  const w = textW(t, em) + 70, h = em + 44, x = cx - w / 2, s = rrect(x, y, w, h, 20);
  fillShape(g, shift(s, 5, 7), SH, 0.3); cel(g, s, NACRE, NACRE_S, 5); ink(g, rrect(x + 8, y + 8, w - 16, h - 16, 13), "#e0b43a", { w: 2.2, closed: true, shadow: 0, seed: 13880 }, 0.85); contour(g, s, 3.6, 13881);
  drawWord(g.cur as CanvasRenderingContext2D, t, cx, y + h / 2 - em / 2, em, { w: em * 0.14, seed: 13882 });
});
// le cadre de l'illustration : un bord de nacre épais, ombre nette ; `inner` : le rectangle où l'image est posée
export const CADRE_BORD = 12;
export const cadreInterieur = (x: number, y: number, w: number, h: number) => rrect(x + CADRE_BORD, y + CADRE_BORD, w - 2 * CADRE_BORD, h - 2 * CADRE_BORD, 18);
export const drawCadre = (g: Gfx, x: number, y: number, w: number, h: number, part: "fond" | "devant") => g.group("plain", () => {
  const s = rrect(x, y, w, h, 28), inn = cadreInterieur(x, y, w, h);
  if (part === "fond") { fillShape(g, shift(s, 10, 12), SH, 0.35); cel(g, s, NACRE, "#e8dcc4", 8, [smooth([[x + 30, y + 6], [x + w * 0.45, y + 4], [x + w * 0.42, y + 10], [x + 32, y + 10]], true, 5), "#ffffff"]); contour(g, s, 4.4, 13870); }
  else { ink(g, inn, INK, { w: 3, closed: true, shadow: -0.6, seed: 13871 }); }
});

// ---------------------------------------------------------------- le schéma en barres
type Barre = { x: number; y: number; w: number; t: string; teinte: "tout" | "a" | "b" | "inconnue" | "trouvee"; objet?: Objet };
export const BARRE_H = 70;
const COUL = { tout: [NACRE, NACRE_S], a: [ORANGE, ORANGE_S], b: [BLUE, BLUE_S], inconnue: ["#fff6e0", "#ead8b0"], trouvee: ["#fff3b8", "#e8cf6a"] } as const;
const drawBarre = (g: Gfx, B: Barre, seed: number) => {
  const em = 40, tw = textW(B.t, em), withIcon = B.objet && B.w >= tw + 110, cx = B.x + B.w / 2 - (withIcon ? 24 : 0);
  g.group("plain", () => {
    const s = rrect(B.x, B.y, B.w, BARRE_H, 14), [lit, sh] = COUL[B.teinte];
    fillShape(g, shift(s, 5, 7), SH, 0.3); cel(g, s, lit, sh, 5);
    if (B.teinte === "inconnue") clipped(g, s, () => { for (let i = -4; i < B.w / 16 + 4; i++) ink(g, [[B.x + i * 16, B.y + BARRE_H + 4], [B.x + i * 16 + 40, B.y - 4]], "#ead8b0", { w: 3, shadow: 0, seed: seed + 50 + i }, 0.8); });
    if (B.teinte === "trouvee") ink(g, rrect(B.x - 5, B.y - 5, B.w + 10, BARRE_H + 10, 18), LIT, { w: 6, closed: true, shadow: 0, seed: seed + 3 }, 0.9);
    contour(g, s, 3.4, seed);
    num(g, B.t, cx, B.y + BARRE_H / 2 - em / 2, em, B.t === "?" ? RED : INK, seed + 10);
  });
  // (l'objet après le groupe de la barre : un groupe dessiné dans un autre serait recouvert par lui)
  if (withIcon) drawObjet(g, B.objet!, cx + tw / 2 + 34, B.y + BARRE_H / 2, 0.8, seed);
};
// largeur des barres : proportionnelle, avec un minimum pour que le nombre et l'objet tiennent
const largeurs = (vals: number[], W: number, min = 120) => { const tot = vals.reduce((a, b) => a + b, 0), raw = vals.map((v) => (v / tot) * W), short = raw.map((r) => Math.max(min, r)), over = short.reduce((a, b) => a + b, 0) - W; const big = short.map((r, i) => (raw[i] > min ? r : 0)), bt = big.reduce((a, b) => a + b, 0); return short.map((r, i) => (big[i] ? r - (over * big[i]) / bt : r)); };
// le tout (en haut) et ses deux parties (en dessous) ; `inconnue` : « tout » ou l'indice de la partie ; `montre` : la réponse écrite
export const drawBarres = (g: Gfx, x: number, y: number, W: number, b: { tout: number; parties: [number, number]; inconnue: "tout" | 0 | 1 }, objet: Objet, o: { montre?: boolean; seed?: number } = {}) => {
  const seed = 13900 + (o.seed ?? 0) * 40, [wa, wb] = largeurs(b.parties, W), gap = 22, lbl = (v: number, unk: boolean) => (unk && !o.montre ? "?" : String(v));
  const tUnk = b.inconnue === "tout", teinte = (unk: boolean, base: Barre["teinte"]): Barre["teinte"] => (unk ? (o.montre ? "trouvee" : "inconnue") : base);
  drawBarre(g, { x, y, w: W, t: lbl(b.tout, tUnk), teinte: teinte(tUnk, "tout"), objet }, seed);
  // le crochet qui dit « le tout, c'est les deux parties ensemble » : deux traits d'encre qui descendent aux bords
  g.group("plain", () => [x + 10, x + W - 10].forEach((xx, i) => ink(g, [[xx, y + BARRE_H + 4], [xx, y + BARRE_H + gap - 4]], INK, { w: 2.4, shadow: 0, seed: seed + 20 + i }, 0.7)));
  drawBarre(g, { x, y: y + BARRE_H + gap, w: wa, t: lbl(b.parties[0], b.inconnue === 0), teinte: teinte(b.inconnue === 0, "a"), objet }, seed + 1);
  drawBarre(g, { x: x + wa, y: y + BARRE_H + gap, w: wb, t: lbl(b.parties[1], b.inconnue === 1), teinte: teinte(b.inconnue === 1, "b"), objet }, seed + 2);
  return { h: 2 * BARRE_H + gap };
};
// la comparaison : le plus grand en haut, le plus petit en dessous, aligné à gauche ; l'écart prolonge le plus petit, en pointillés
export const drawComparaison = (g: Gfx, x: number, y: number, W: number, c: { grand: number; petit: number; ecart: number; inconnue: "grand" | "petit" | "ecart" }, objet: Objet, o: { montre?: boolean; seed?: number } = {}) => {
  const seed = 14300 + (o.seed ?? 0) * 40, [wp, we] = largeurs([c.petit, c.ecart], W, 110), gap = 26, lbl = (v: number, unk: boolean) => (unk && !o.montre ? "?" : String(v)), U = (k: string) => c.inconnue === k;
  const teinte = (unk: boolean, base: Barre["teinte"]): Barre["teinte"] => (unk ? (o.montre ? "trouvee" : "inconnue") : base);
  drawBarre(g, { x, y, w: W, t: lbl(c.grand, U("grand")), teinte: teinte(U("grand"), "a"), objet }, seed);
  drawBarre(g, { x, y: y + BARRE_H + gap, w: wp, t: lbl(c.petit, U("petit")), teinte: teinte(U("petit"), "b"), objet }, seed + 1);
  // l'écart : une case en pointillés au bout du plus petit, sous ce qui dépasse
  g.group("plain", () => {
    const ex = x + wp + 8, ey = y + BARRE_H + gap, s = rrect(ex, ey, we - 8, BARRE_H, 14), em = 40, t = lbl(c.ecart, U("ecart"));
    if (U("ecart") && o.montre) fillShape(g, s, "#fff3b8");
    fillShape(g, s, "#fffaf0", 0.92);
    // le pointillé : des tirets réguliers le long du bord (un trait d'encre plein dirait « une barre connue »)
    const cv = g.cur; g.touch(ex - 4, ey - 4, ex + we, ey + BARRE_H + 4); cv.save(); cv.setLineDash([14, 10]); cv.lineWidth = 4; cv.lineJoin = "round"; cv.strokeStyle = U("ecart") && !o.montre ? RED : INK; cv.beginPath(); s.forEach(([a, b], i) => (i ? cv.lineTo(a, b) : cv.moveTo(a, b))); cv.closePath(); cv.stroke(); cv.restore();
    num(g, t, ex + (we - 8) / 2, ey + BARRE_H / 2 - em / 2, em, t === "?" ? RED : INK, seed + 12);
    ink(g, [[x + wp, y + BARRE_H + 6], [x + wp, y + 2 * BARRE_H + gap + 10]], INK, { w: 2, shadow: 0, seed: seed + 40 }, 0.5);
  });
  return { h: 2 * BARRE_H + gap };
};

// ---------------------------------------------------------------- la planche : tous les dessins, pour les regarder en grand
export const drawPlancheProblemes = (g: Gfx) => {
  OBJETS.forEach((o, i) => drawObjet(g, o, 80 + i * 100, 80, 1.6, i + 1, i));
  OBJETS.forEach((o, i) => drawObjet(g, o, 80 + i * 100, 170, 1, i + 20, i + 1));
  (["sachet", "assiette", "boite", "panier", "vase", "anneau"] as Contenant[]).forEach((c, i) => drawGroupe(g, c, (["biscuit", "biscuit", "oeuf", "pomme", "fleur", "personne"] as Objet[])[i], 120 + i * 210, 330, i === 4 ? 3 : 6, 0.9, { seed: i + 1 }));
  drawBarres(g, 60, 470, 560, { tout: 23, parties: [14, 9], inconnue: 0 }, "poisson");
  drawBarres(g, 700, 470, 560, { tout: 23, parties: [14, 9], inconnue: 0 }, "poisson", { montre: true, seed: 1 });
  drawComparaison(g, 60, 680, 560, { grand: 13, petit: 8, ecart: 5, inconnue: "grand" }, "crayon");
  drawEtiquette(g, 700, 690, "23", "poisson", { seed: 1 }); drawEtiquette(g, 880, 690, "9", "poisson", { seed: 2, lit: true }); drawReponse(g, 1040, 680, 220, "?", "poisson");
};
