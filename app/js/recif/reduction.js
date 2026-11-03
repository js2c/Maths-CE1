// LES CRÉATURES DU RÉCIF, DÉJÀ RÉDUITES (lot « Netteté du récif », docs/SPEC.md, section 10, « Le récif vivant »). Chaque
// créature de la maquette est une image d'environ 600 px, affichée 4 à 8 fois plus petite. La maquette la réduit à chaque image,
// bande par bande : sans mipmap, une réduction aussi forte saute des pixels (crénelage : contours qui scintillent, détails
// pixelisés), et elle coûte, parce que toute la grande image est relue à chaque image.
// Ici, une fois par créature (et de nouveau si la densité du dessin change), l'image est réduite par moitiés successives : chaque
// moitié fait la moyenne exacte de 2 × 2 pixels (comme une pyramide de mipmaps), puis une dernière étape, de moins de moitié, en
// qualité haute, jusqu'au double de sa taille d'affichage. Le récif dessine ensuite cette petite image, réduite de moins de deux
// fois : à ce rapport, l'interpolation du dessin ne saute aucun pixel (pas de crénelage) et garde le trait aussi net que la
// grande image (captures comparées pour la marge 1,1, 1,5 et 2 : docs/maquettes/recif-nettete/).
// Le module généré (recif/recif-vivant.js) la demande par OPTS.reduite (art/tools/export-recif.mjs, « lagBlit »).

// la marge : l'image réduite fait le double de la taille d'affichage (à 1,1, l'image réduite puis redessinée s'adoucissait)
export const MARGE = 2;
// au-delà de cet écart entre l'échelle demandée et celle de l'image réduite, l'image est refaite (la densité a changé)
export const ECART = 1.15;
// au plus tant de réductions par image (les autres créatures sont dessinées depuis la grande image en attendant)
export const PAR_IMAGE = 2;

// l'échelle de l'image réduite : `k` px d'écran par px de l'image ; jamais plus grande que l'image
export const echelleReduite = (k) => Math.min(1, k * MARGE);
// les tailles successives, de `w` × `h` à l'échelle `r` : des moitiés tant qu'on reste au-dessus du double de la cible, puis la cible
export function etapes(w, h, r) {
  const W = Math.max(1, Math.round(w * r)), H = Math.max(1, Math.round(h * r)), l = [];
  let a = w, b = h;
  while (a / 2 >= W && b / 2 >= H && a >= 2 && b >= 2) { a = Math.round(a / 2); b = Math.round(b / 2); l.push([a, b]); }
  if (!l.length || l.at(-1)[0] !== W || l.at(-1)[1] !== H) l.push([W, H]);
  return l;
}
// faut-il refaire l'image réduite (échelle `r0`) pour l'échelle demandée `r` ?
export const aRefaire = (r0, r) => r0 == null || r / r0 > ECART || r0 / r > ECART;

// la réduction elle-même : un canvas de la taille finale (`creer()` : un canvas neuf)
export function reduire(src, w, h, r, creer = () => document.createElement("canvas")) {
  let im = src, sw = w, sh = h;
  const l = etapes(w, h, r);
  l.forEach(([a, b], i) => {
    const cv = creer(); cv.width = a; cv.height = b;
    const g = cv.getContext("2d");
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = i === l.length - 1 ? "high" : "low";
    g.drawImage(im, 0, 0, sw, sh, 0, 0, a, b);
    if (im !== src) im.width = im.height = 0; // (l'étape précédente est rendue aussitôt)
    im = cv; sw = a; sh = b;
  });
  return im;
}

// les images réduites d'une visite du récif : par image source (la créature, ou son halo)
export class Reductions {
  constructor({ creer, parImage = PAR_IMAGE } = {}) { this.creer = creer; this.parImage = parImage; this.faites = new Map(); this.image = -1; this.cetteImage = 0; this.nombre = 0; }
  // l'image réduite de `src` (`w` × `h` px) pour `k` px d'écran par px de l'image : { img, r }, ou null (la grande image en attendant) ;
  // `n` : le numéro de l'image en cours (pour le plafond par image)
  pour(src, w, h, k, n) {
    const r = echelleReduite(k), f = this.faites.get(src);
    if (r >= 1) return null;
    if (f && !aRefaire(f.r, r)) return f;
    if (n !== this.image) { this.image = n; this.cetteImage = 0; }
    if (this.cetteImage >= this.parImage) return f ?? null;
    this.cetteImage++;
    try {
      const img = reduire(src, w, h, r, this.creer);
      if (f) f.img.width = f.img.height = 0;
      const g = { img, r }; this.faites.set(src, g); this.nombre = this.faites.size; return g;
    } catch { return f ?? null; }
  }
  // en sortant du récif : tout est rendu
  vider() { for (const f of this.faites.values()) f.img.width = f.img.height = 0; this.faites.clear(); this.nombre = 0; }
}
