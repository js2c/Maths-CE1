// LES IMAGES PROVISOIRES DE LA MAQUETTE « MISE EN SCÈNE » (art/problemes/mise-en-scene/index.html). Elles tiennent la place des
// images que le parent générera avec Nano Banana (objets.json, lieux.json) : mêmes rôles, mêmes tailles, mêmes places, pour juger
// la mise en page. Dessinées vite, à la manière du style A (aplats, une ombre nette en bas à droite, contour épais qui s'épaissit du
// côté de l'ombre, lumière en haut à gauche) ; elles ne sont pas faites pour rester. Toutes les mesures en px de la scène 1280 × 800.
const INK = "#211c18";

// ---------------------------------------------------------------- la main
const P = () => new Path2D();
export const rr = (x, y, w, h, r) => { const p = P(); p.roundRect(x, y, w, h, r); return p; };
export const ell = (cx, cy, rx, ry, a = 0) => { const p = P(); p.ellipse(cx, cy, rx, ry, a, 0, Math.PI * 2); return p; };
export const poly = (pts, close = true) => { const p = P(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); if (close) p.closePath(); return p; };
// une forme lisse par ses points (courbes quadratiques entre les milieux)
export const lisse = (pts) => { const p = P(), n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; const s = m(pts[n - 1], pts[0]); p.moveTo(...s); for (let i = 0; i < n; i++) { const a = pts[i], b = m(a, pts[(i + 1) % n]); p.quadraticCurveTo(a[0], a[1], b[0], b[1]); } p.closePath(); return p; };
// une forme : l'aplat, l'ombre nette (le croissant du bas à droite), le contour, plus épais du côté de l'ombre
export function forme(ctx, p, couleur, ombre, { trait = 4, ox = 5, oy = 6, contour = true } = {}) {
  ctx.save(); ctx.clip(p); ctx.fillStyle = ombre ?? couleur; ctx.fill(p); if (ombre) { ctx.translate(-ox, -oy); ctx.fillStyle = couleur; ctx.fill(p); } ctx.restore();
  if (!contour) return;
  ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = INK; ctx.lineWidth = trait; ctx.stroke(p); ctx.translate(trait * 0.35, trait * 0.45); ctx.lineWidth = trait * 0.7; ctx.stroke(p); ctx.restore();
}
export function trait(ctx, pts, w = 3.5, couleur = INK) { ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = couleur; ctx.lineWidth = w; ctx.stroke(poly(pts, false)); ctx.restore(); }
export function courbe(ctx, f, w = 3.5, couleur = INK) { ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = couleur; ctx.lineWidth = w; const p = P(); f(p); ctx.stroke(p); ctx.restore(); }
// l'ombre portée au sol (une ellipse nette, comme les objets de l'application)
export const ombreSol = (ctx, cx, y, rx, ry = rx * 0.18) => { ctx.save(); ctx.fillStyle = "rgba(10, 40, 50, 0.22)"; ctx.fill(ell(cx + rx * 0.12, y, rx, ry)); ctx.restore(); };

// ---------------------------------------------------------------- les personnages
const PEAU = ["#f6c9a0", "#d89a6c"], PEAU_B = ["#c98a5c", "#9a603a"];
const visage = (ctx, cx, cy, r, { barbe = null, peau = PEAU } = {}) => {
  forme(ctx, ell(cx, cy, r, r * 1.05), peau[0], peau[1], { trait: 3.5, ox: r * 0.16, oy: r * 0.14 });
  if (barbe) forme(ctx, lisse([[cx - r * 0.86, cy + r * 0.1], [cx - r * 0.7, cy + r * 0.9], [cx, cy + r * 1.22], [cx + r * 0.7, cy + r * 0.9], [cx + r * 0.86, cy + r * 0.1], [cx + r * 0.5, cy + r * 0.55], [cx - r * 0.5, cy + r * 0.55]]), barbe[0], barbe[1], { trait: 3 });
  for (const s of [-1, 1]) { ctx.fillStyle = INK; ctx.fill(ell(cx + s * r * 0.36, cy - r * 0.05, r * 0.1, r * 0.14)); ctx.fillStyle = "#fff"; ctx.fill(ell(cx + s * r * 0.36 - r * 0.03, cy - r * 0.1, r * 0.035, r * 0.04)); ctx.fillStyle = "rgba(230, 110, 100, 0.35)"; ctx.fill(ell(cx + s * r * 0.58, cy + r * 0.3, r * 0.15, r * 0.1)); }
  courbe(ctx, (p) => { p.moveTo(cx + r * 0.02, cy + r * 0.05); p.quadraticCurveTo(cx + r * 0.16, cy + r * 0.25, cx - r * 0.04, cy + r * 0.28); }, 2.4);
  courbe(ctx, (p) => { p.moveTo(cx - r * 0.3, cy + r * 0.44); p.quadraticCurveTo(cx, cy + r * 0.66, cx + r * 0.3, cy + r * 0.44); }, 3);
};
// un personnage debout, de face. h : sa hauteur ; o : ses couleurs et ce qui le distingue
export function personnage(ctx, cx, pied, h, o = {}) {
  const enfant = !!o.enfant, r = h * (enfant ? 0.135 : 0.105), tete = pied - h + r * 1.05, ep = h * (enfant ? 0.17 : 0.155), haut = o.haut ?? ["#4f86c6", "#335f99"], bas = o.bas ?? ["#3b4f7a", "#26365a"];
  const taille = pied - h * (enfant ? 0.42 : 0.46), epaule = tete + r * 1.25;
  ombreSol(ctx, cx, pied - 2, h * 0.2);
  // les jambes, les chaussures
  const jw = h * (enfant ? 0.075 : 0.07);
  for (const s of [-1, 1]) { forme(ctx, rr(cx + s * jw * 0.75 - jw / 2, taille - 6, jw, pied - taille - 2, jw * 0.4), o.jambes?.[0] ?? bas[0], o.jambes?.[1] ?? bas[1], { trait: 3.5 }); forme(ctx, ell(cx + s * jw * 0.95, pied - 6, jw * 0.85, jw * 0.42), o.chaussures?.[0] ?? "#5a3b2a", o.chaussures?.[1] ?? "#3a2418", { trait: 3 }); }
  // la jupe ou la robe
  if (o.jupe) forme(ctx, poly([[cx - ep * 0.95, taille - 8], [cx + ep * 0.95, taille - 8], [cx + ep * 1.35, taille + (pied - taille) * (enfant ? 0.42 : 0.6)], [cx - ep * 1.35, taille + (pied - taille) * (enfant ? 0.42 : 0.6)]]), o.jupe[0], o.jupe[1], { trait: 3.5 });
  // les bras (derrière le corps), les mains
  const main = taille + h * 0.02;
  for (const s of [-1, 1]) { forme(ctx, poly([[cx + s * ep * 0.86, epaule + 4], [cx + s * ep * 1.32, main - 6], [cx + s * ep * 1.05, main + 2], [cx + s * ep * 0.62, epaule + 30]]), haut[0], haut[1], { trait: 3.5 }); forme(ctx, ell(cx + s * ep * 1.2, main + 4, r * 0.32, r * 0.34), (o.peau ?? PEAU)[0], (o.peau ?? PEAU)[1], { trait: 3 }); }
  // le corps
  forme(ctx, lisse([[cx - ep, epaule], [cx + ep, epaule], [cx + ep * 1.02, taille + 4], [cx - ep * 1.02, taille + 4]]), haut[0], haut[1], { trait: 4, ox: 8, oy: 6 });
  if (o.tablier) forme(ctx, rr(cx - ep * 0.62, epaule + 18, ep * 1.24, pied - epaule - h * 0.18, 10), o.tablier[0], o.tablier[1], { trait: 3 });
  if (o.col) forme(ctx, poly([[cx - ep * 0.4, epaule - 2], [cx, epaule + 18], [cx + ep * 0.4, epaule - 2]]), o.col[0], o.col[1], { trait: 3 });
  // la tête, les cheveux
  if (o.cheveuxDerriere) o.cheveuxDerriere(ctx, cx, tete, r);
  visage(ctx, cx, tete, r, { barbe: o.barbe, peau: o.peau ?? PEAU });
  o.cheveux?.(ctx, cx, tete, r);
}
// les coiffures
export const COIFFURES = {
  court: (c) => (ctx, cx, cy, r) => forme(ctx, lisse([[cx - r * 1.02, cy - r * 0.05], [cx - r * 1.05, cy - r * 0.9], [cx - r * 0.2, cy - r * 1.32], [cx + r * 0.8, cy - r * 1.1], [cx + r * 1.06, cy - r * 0.2], [cx + r * 0.7, cy - r * 0.62], [cx - r * 0.1, cy - r * 0.6], [cx - r * 0.7, cy - r * 0.5]]), c[0], c[1], { trait: 3.5 }),
  bonnet: (c) => (ctx, cx, cy, r) => { forme(ctx, lisse([[cx - r * 1.08, cy - r * 0.32], [cx - r * 0.95, cy - r * 1.15], [cx, cy - r * 1.45], [cx + r * 0.95, cy - r * 1.15], [cx + r * 1.08, cy - r * 0.32]]), c[0], c[1], { trait: 3.5 }); forme(ctx, rr(cx - r * 1.12, cy - r * 0.52, r * 2.24, r * 0.34, r * 0.15), c[1], c[1], { trait: 3 }); },
  queue: (c) => (ctx, cx, cy, r) => { forme(ctx, lisse([[cx + r * 0.6, cy - r * 0.6], [cx + r * 1.6, cy - r * 0.5], [cx + r * 1.7, cy + r * 0.6], [cx + r * 1.25, cy + r * 1.2], [cx + r * 1.0, cy + r * 0.2]]), c[0], c[1], { trait: 3 }); forme(ctx, lisse([[cx - r * 1.04, cy + r * 0.05], [cx - r * 1.0, cy - r * 0.95], [cx, cy - r * 1.3], [cx + r * 1.0, cy - r * 0.95], [cx + r * 1.04, cy + r * 0.05], [cx + r * 0.7, cy - r * 0.55], [cx - r * 0.3, cy - r * 0.72]]), c[0], c[1], { trait: 3.5 }); },
  boules: (c) => (ctx, cx, cy, r) => { for (const s of [-1, 1]) forme(ctx, ell(cx + s * r * 1.05, cy - r * 0.75, r * 0.5, r * 0.5), c[0], c[1], { trait: 3 }); forme(ctx, lisse([[cx - r * 1.04, cy - r * 0.05], [cx - r * 1.0, cy - r * 0.9], [cx, cy - r * 1.22], [cx + r * 1.0, cy - r * 0.9], [cx + r * 1.04, cy - r * 0.05], [cx + r * 0.6, cy - r * 0.6], [cx - r * 0.6, cy - r * 0.6]]), c[0], c[1], { trait: 3.5 }); },
};
export const PERSONNAGES = {
  papa: { haut: ["#5d9bd6", "#3a6fa6"], bas: ["#3d5b8c", "#273e66"], barbe: ["#7a4a2a", "#5a321a"], cheveux: COIFFURES.court(["#7a4a2a", "#5a321a"]), col: ["#e9f2fb", "#bcd0e6"] },
  maitresse: { haut: ["#d9524a", "#a8352f"], jupe: ["#2f3f6e", "#1f2a4c"], jambes: ["#f0c49c", "#c98a5c"], cheveux: COIFFURES.queue(["#8a5a32", "#64401f"]), chaussures: ["#2f3f6e", "#1f2a4c"] },
  pecheur: { haut: ["#ffcf3a", "#d9a11a"], bas: ["#2f3f6e", "#1f2a4c"], barbe: ["#b8b2a8", "#8a847a"], cheveux: COIFFURES.bonnet(["#c0453a", "#8e2e26"]), chaussures: ["#3e4a40", "#262e28"] },
  voisine: { enfant: true, haut: ["#9a6ad0", "#7048a6"], jupe: ["#9a6ad0", "#7048a6"], jambes: ["#ffd9e8", "#e7a9c2"], cheveux: COIFFURES.boules(["#3a2618", "#24160c"]), peau: PEAU_B, chaussures: ["#e0484a", "#a83234"] },
};

// ---------------------------------------------------------------- les animaux
// le chien assis, de profil, tourné vers la gauche (vers sa gamelle)
export function chien(ctx, cx, pied, h) {
  const k = h / 160, C = ["#d9a066", "#ad7442"], B = ["#fff4e4", "#e6d2b4"];
  ombreSol(ctx, cx + 6 * k, pied - 2, 62 * k);
  forme(ctx, lisse([[cx + 52 * k, pied - 44 * k], [cx + 78 * k, pied - 70 * k], [cx + 86 * k, pied - 92 * k], [cx + 70 * k, pied - 60 * k]]), C[0], C[1], { trait: 3.5 }); // la queue
  forme(ctx, lisse([[cx - 22 * k, pied - 112 * k], [cx + 30 * k, pied - 104 * k], [cx + 62 * k, pied - 52 * k], [cx + 58 * k, pied - 4 * k], [cx - 30 * k, pied - 4 * k], [cx - 34 * k, pied - 60 * k]]), C[0], C[1], { trait: 4.5, ox: 9, oy: 7 }); // le corps assis
  forme(ctx, lisse([[cx - 30 * k, pied - 98 * k], [cx - 2 * k, pied - 92 * k], [cx + 6 * k, pied - 40 * k], [cx - 24 * k, pied - 34 * k]]), B[0], B[1], { trait: 3 }); // le poitrail
  for (const dx of [-22, 2]) forme(ctx, rr(cx + dx * k, pied - 52 * k, 18 * k, 50 * k, 8 * k), C[0], C[1], { trait: 3.5 }); // les pattes de devant
  forme(ctx, ell(cx + 36 * k, pied - 8 * k, 26 * k, 10 * k), C[0], C[1], { trait: 3.5 }); // la patte arrière
  forme(ctx, rr(cx - 32 * k, pied - 108 * k, 50 * k, 12 * k, 5 * k), "#d8393a", "#a32627", { trait: 3 }); // le collier
  forme(ctx, ell(cx - 6 * k, pied - 98 * k, 5 * k, 5 * k), "#ffd54a", "#d9a11a", { trait: 2 });
  forme(ctx, lisse([[cx - 50 * k, pied - 158 * k], [cx + 2 * k, pied - 160 * k], [cx + 12 * k, pied - 120 * k], [cx - 8 * k, pied - 104 * k], [cx - 60 * k, pied - 110 * k], [cx - 74 * k, pied - 128 * k]]), C[0], C[1], { trait: 4 }); // la tête
  forme(ctx, lisse([[cx - 76 * k, pied - 132 * k], [cx - 50 * k, pied - 136 * k], [cx - 44 * k, pied - 112 * k], [cx - 70 * k, pied - 108 * k]]), B[0], B[1], { trait: 3 }); // le museau
  forme(ctx, ell(cx - 78 * k, pied - 132 * k, 8 * k, 6 * k), INK, INK, { trait: 2 }); // la truffe
  forme(ctx, lisse([[cx - 6 * k, pied - 160 * k], [cx + 18 * k, pied - 150 * k], [cx + 20 * k, pied - 110 * k], [cx + 4 * k, pied - 118 * k], [cx - 8 * k, pied - 146 * k]]), "#9a6236", "#704422", { trait: 3.5 }); // l'oreille
  ctx.fillStyle = INK; ctx.fill(ell(cx - 36 * k, pied - 142 * k, 5 * k, 6.5 * k)); ctx.fillStyle = "#fff"; ctx.fill(ell(cx - 37.5 * k, pied - 144.5 * k, 1.8 * k, 2 * k));
  forme(ctx, lisse([[cx - 62 * k, pied - 114 * k], [cx - 52 * k, pied - 114 * k], [cx - 54 * k, pied - 100 * k], [cx - 60 * k, pied - 102 * k]]), "#f07a8a", "#c8505e", { trait: 2.5 }); // la langue
}

// ---------------------------------------------------------------- les contenants et les dépôts
// le sachet de papier, fermé par un ruban (ou ouvert, vide)
export function sachet(ctx, cx, pied, h, { ouvert = false, lit = false } = {}) {
  const w = h * 0.74, K = ["#dcae72", "#b4834a"];
  ombreSol(ctx, cx, pied - 2, w * 0.55);
  if (lit) { ctx.save(); ctx.strokeStyle = "#ffe45c"; ctx.lineWidth = 9; ctx.globalAlpha = 0.9; ctx.stroke(rr(cx - w / 2 - 12, pied - h - 12, w + 24, h + 18, 22)); ctx.restore(); }
  if (ouvert) {
    forme(ctx, poly([[cx - w / 2, pied - h * 0.78], [cx + w / 2, pied - h * 0.78], [cx + w / 2 + 4, pied - 4], [cx - w / 2 - 4, pied - 4]]), K[0], K[1], { trait: 4 });
    forme(ctx, ell(cx, pied - h * 0.78, w / 2, h * 0.07), "#6e4a24", "#6e4a24", { trait: 3.5 });
    return;
  }
  forme(ctx, lisse([[cx - w / 2 - 2, pied - h * 0.66], [cx - w * 0.24, pied - h * 0.8], [cx + w * 0.24, pied - h * 0.8], [cx + w / 2 + 2, pied - h * 0.66], [cx + w / 2 + 6, pied - 2], [cx - w / 2 - 6, pied - 2]]), K[0], K[1], { trait: 4, ox: 8, oy: 6 });
  forme(ctx, lisse([[cx - w * 0.3, pied - h * 0.98], [cx - w * 0.08, pied - h * 0.86], [cx + w * 0.08, pied - h * 0.86], [cx + w * 0.3, pied - h * 0.98], [cx + w * 0.16, pied - h * 0.78], [cx - w * 0.16, pied - h * 0.78]]), K[0], K[1], { trait: 3.5 });
  forme(ctx, rr(cx - w * 0.22, pied - h * 0.84, w * 0.44, h * 0.08, 5), "#d8393a", "#a32627", { trait: 3 });
  for (const s of [-1, 1]) forme(ctx, lisse([[cx, pied - h * 0.8], [cx + s * w * 0.28, pied - h * 0.9], [cx + s * w * 0.3, pied - h * 0.76]]), "#d8393a", "#a32627", { trait: 2.5 });
  trait(ctx, [[cx - w * 0.2, pied - h * 0.6], [cx - w * 0.24, pied - h * 0.1]], 2, "rgba(120, 80, 40, 0.5)");
}
// la gamelle, vue un peu de dessus ; `dedans` : ce qu'on y pose (un dessin dans l'ouverture, ou rien)
export function gamelle(ctx, cx, pied, w, dedans = null) {
  const h = w * 0.36, top = pied - h, S = ["#cdd6de", "#8e9aa6"];
  ombreSol(ctx, cx, pied - 2, w * 0.55);
  forme(ctx, poly([[cx - w / 2, top], [cx + w / 2, top], [cx + w * 0.4, pied - 4], [cx - w * 0.4, pied - 4]]), S[0], S[1], { trait: 4, ox: 10, oy: 4 });
  forme(ctx, ell(cx, top, w / 2, h * 0.32), "#e6ecf1", "#aab5bf", { trait: 4 });
  forme(ctx, ell(cx, top + 2, w * 0.4, h * 0.22), "#7d8995", "#5f6b77", { trait: 2.5, contour: true });
  if (dedans) { ctx.save(); ctx.clip(ell(cx, top + 2, w * 0.4, h * 0.22)); ctx.restore(); dedans(cx, top - 4, w * 0.8); }
}
// le seau de plage, la pelle
export function seau(ctx, cx, pied, h, { transparent = false } = {}) {
  const wt = h * 0.92, wb = h * 0.66, top = pied - h, R = ["#e8473e", "#b32c26"];
  ombreSol(ctx, cx, pied - 2, wt * 0.55);
  courbe(ctx, (p) => { p.moveTo(cx - wt / 2 + 4, top + 6); p.bezierCurveTo(cx - wt / 2, top - h * 0.55, cx + wt / 2, top - h * 0.55, cx + wt / 2 - 4, top + 6); }, 7, INK);
  courbe(ctx, (p) => { p.moveTo(cx - wt / 2 + 4, top + 6); p.bezierCurveTo(cx - wt / 2, top - h * 0.55, cx + wt / 2, top - h * 0.55, cx + wt / 2 - 4, top + 6); }, 3.5, "#ffd23a");
  forme(ctx, ell(cx, top, wt / 2, h * 0.11), "#7e1f1a", "#7e1f1a", { trait: 3.5 });
  forme(ctx, poly([[cx - wt / 2, top], [cx + wt / 2, top], [cx + wb / 2, pied - 4], [cx - wb / 2, pied - 4]]), R[0], R[1], { trait: 4.5, ox: 12, oy: 4 });
  forme(ctx, poly([[cx - wt / 2 - 2, top - 2], [cx + wt / 2 + 2, top - 2], [cx + wt / 2 - 2, top + h * 0.13], [cx - wt / 2 + 2, top + h * 0.13]]), "#f2675e", "#c23a33", { trait: 3.5 });
}
export function pelle(ctx, x, pied, h) {
  forme(ctx, rr(x - 5, pied - h, 10, h * 0.68, 4), "#ffd23a", "#d9a11a", { trait: 3 });
  forme(ctx, lisse([[x - 22, pied - h * 0.34], [x + 22, pied - h * 0.34], [x + 18, pied - 4], [x - 18, pied - 4]]), "#ffd23a", "#d9a11a", { trait: 3.5 });
}
// la trousse (fermée), le pupitre de la classe, le pot à crayons, le paquet de crayons, le cornet de papier
export function trousse(ctx, cx, pied, w, couleur = ["#4f92d6", "#2f6aa6"]) {
  const h = w * 0.36; ombreSol(ctx, cx, pied - 2, w * 0.5);
  forme(ctx, rr(cx - w / 2, pied - h, w, h - 2, h * 0.45), couleur[0], couleur[1], { trait: 4, ox: 6, oy: 7 });
  trait(ctx, [[cx - w * 0.42, pied - h * 0.72], [cx + w * 0.42, pied - h * 0.72]], 3); for (let i = -9; i <= 9; i++) trait(ctx, [[cx + i * w * 0.045, pied - h * 0.78], [cx + i * w * 0.045, pied - h * 0.66]], 1.6);
  forme(ctx, rr(cx + w * 0.3, pied - h * 0.8, 12, 22, 4), "#ffd23a", "#d9a11a", { trait: 2.5 });
}
export function pupitre(ctx, x0, x1, dessus, pied) {
  const W = ["#e7bd82", "#c0915a"], F = ["#3f9a6b", "#2b7350"];
  for (const x of [x0 + 26, x1 - 40]) forme(ctx, rr(x, dessus + 10, 14, pied - dessus - 10, 4), F[0], F[1], { trait: 3 });
  forme(ctx, rr(x0 + 10, dessus + 18, x1 - x0 - 20, 56, 6), "#d3a66c", "#a87b45", { trait: 3.5 });
  forme(ctx, poly([[x0 + 16, dessus - 14], [x1 - 16, dessus - 14], [x1, dessus + 18], [x0, dessus + 18]]), W[0], W[1], { trait: 4, ox: 4, oy: 8 });
}
export function pot(ctx, cx, pied, h, couleur = ["#e8473e", "#b32c26"], { lit = false } = {}) {
  const w = h * 0.7; ombreSol(ctx, cx, pied - 2, w * 0.55);
  if (lit) { ctx.save(); ctx.strokeStyle = "#ffe45c"; ctx.lineWidth = 9; ctx.stroke(rr(cx - w / 2 - 12, pied - h - 16, w + 24, h + 22, 20)); ctx.restore(); }
  forme(ctx, rr(cx - w / 2, pied - h, w, h - 2, 10), couleur[0], couleur[1], { trait: 4, ox: 9, oy: 4 });
  forme(ctx, ell(cx, pied - h, w / 2, h * 0.1), "#5c1a16", "#5c1a16", { trait: 3.5 });
  trait(ctx, [[cx - w / 2 + 3, pied - h * 0.78], [cx + w / 2 - 3, pied - h * 0.78]], 2.2, "rgba(255,255,255,0.55)");
}
// l'intérieur du pot redessiné devant les crayons (le bord avant)
export function bordPot(ctx, cx, pied, h, couleur = ["#e8473e", "#b32c26"]) { const w = h * 0.7; ctx.save(); ctx.clip(rr(cx - w / 2 - 6, pied - h, w + 12, h + 4, 0)); forme(ctx, rr(cx - w / 2, pied - h, w, h - 2, 10), couleur[0], couleur[1], { trait: 4, ox: 9, oy: 4 }); ctx.restore(); }
export function paquet(ctx, cx, pied, h, { ouvert = false } = {}) {
  const w = h * 0.9; ombreSol(ctx, cx, pied - 2, w * 0.55);
  forme(ctx, rr(cx - w / 2, pied - h, w, h - 2, 6), "#ff9d3b", "#d16a18", { trait: 4, ox: 8, oy: 5 });
  forme(ctx, rr(cx - w / 2 + 8, pied - h * 0.62, w - 16, h * 0.32, 5), "#fff6e6", "#e6d2b4", { trait: 2.5 });
  if (ouvert) forme(ctx, poly([[cx - w / 2, pied - h], [cx + w / 2, pied - h], [cx + w / 2 + 14, pied - h - 26], [cx - w / 2 + 14, pied - h - 26]]), "#ffb35e", "#d9813a", { trait: 3.5 });
  else forme(ctx, rr(cx - w / 2 - 3, pied - h - 6, w + 6, 16, 5), "#ffb35e", "#d9813a", { trait: 3.5 });
}
export function cornet(ctx, cx, cy, h) {
  forme(ctx, poly([[cx - h * 0.34, cy - h / 2], [cx + h * 0.34, cy - h / 2], [cx, cy + h / 2]]), "#f4f7fb", "#c8d2de", { trait: 4 });
  for (const t of [0.18, 0.42]) trait(ctx, [[cx - h * 0.34 * (1 - t * 1.1), cy - h / 2 + h * t], [cx + h * 0.34 * (1 - t * 1.1), cy - h / 2 + h * t]], 4, "#5b9bd8");
}
// le coquillage (l'icône d'unité qui manque à l'atelier : un pecten)
export function coquillage(ctx, cx, cy, r, couleur = ["#fbf3ea", "#e2cdb8"]) {
  forme(ctx, lisse([[cx - r, cy - r * 0.1], [cx - r * 0.7, cy - r * 0.85], [cx, cy - r * 1.05], [cx + r * 0.7, cy - r * 0.85], [cx + r, cy - r * 0.1], [cx + r * 0.25, cy + r * 0.62], [cx - r * 0.25, cy + r * 0.62]]), couleur[0], couleur[1], { trait: 2.6, ox: r * 0.2, oy: r * 0.2 });
  for (const a of [-0.55, -0.27, 0, 0.27, 0.55]) trait(ctx, [[cx, cy + r * 0.5], [cx + Math.sin(a) * r * 0.95, cy + r * 0.5 - Math.cos(a) * r * 1.35]], 1.4, "rgba(60,40,30,0.55)");
  forme(ctx, rr(cx - r * 0.34, cy + r * 0.45, r * 0.68, r * 0.34, r * 0.1), couleur[1], couleur[1], { trait: 2.2 });
}

// ---------------------------------------------------------------- les lieux provisoires (à la place des illustrations à générer)
const bandes = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
export const LIEUX = {
  plage(ctx, x, y, w, h) {
    bandes(ctx, x, y, w, h * 0.5, "#bfe6f6"); bandes(ctx, x, y + h * 0.18, w, h * 0.32, "#aadcf1");
    forme(ctx, ell(x + w * 0.9, y + h * 0.16, 30, 30), "#ffe27a", "#f5c33b", { trait: 3 });
    for (const [cx, cy, s] of [[0.62, 0.14, 1], [0.78, 0.26, 0.7]]) forme(ctx, lisse([[x + w * cx - 50 * s, y + h * cy + 8], [x + w * cx - 30 * s, y + h * cy - 14], [x + w * cx + 10 * s, y + h * cy - 20], [x + w * cx + 46 * s, y + h * cy - 4], [x + w * cx + 52 * s, y + h * cy + 10]]), "#ffffff", "#dbeef7", { trait: 3 });
    forme(ctx, rr(x - 10, y + h * 0.4, w + 20, h * 0.22, 0), "#3fa7cf", "#2f87ae", { trait: 4, ox: 0, oy: 8 });
    for (let i = 0; i < 9; i++) courbe(ctx, (p) => { const a = x + 60 + i * w / 9 + (i % 2) * 30, b = y + h * (0.46 + (i % 3) * 0.045); p.moveTo(a, b); p.quadraticCurveTo(a + 18, b - 7, a + 36, b); }, 3, "#e8f7fc");
    forme(ctx, lisse([[x + w * 0.7, y + h * 0.6], [x + w * 0.8, y + h * 0.45], [x + w * 0.95, y + h * 0.42], [x + w + 30, y + h * 0.5], [x + w + 30, y + h * 0.64]]), "#f6dc9e", "#dcb873", { trait: 4 });
    for (let i = 0; i < 7; i++) trait(ctx, [[x + w * (0.8 + i * 0.025), y + h * 0.47], [x + w * (0.79 + i * 0.025), y + h * 0.38]], 3, "#4f9a3a");
    forme(ctx, rr(x - 10, y + h * 0.58, w + 20, h * 0.5, 0), "#f4d897", "#dfbb72", { trait: 4, ox: 0, oy: 10 });
    for (let i = 0; i < 12; i++) courbe(ctx, (p) => { const a = x + 40 + ((i * 173) % (w - 80)), b = y + h * (0.68 + ((i * 37) % 30) / 100); p.moveTo(a, b); p.quadraticCurveTo(a + 22, b - 5, a + 44, b); }, 2.5, "#d9b46e");
    // un parasol au loin, à droite
    trait(ctx, [[x + w * 0.94, y + h * 0.58], [x + w * 0.94, y + h * 0.36]], 4);
    forme(ctx, lisse([[x + w * 0.89, y + h * 0.38], [x + w * 0.94, y + h * 0.29], [x + w * 0.99, y + h * 0.38]]), "#ff8a5c", "#d65f36", { trait: 3.5 });
  },
  animaux(ctx, x, y, w, h) {
    bandes(ctx, x, y, w, h * 0.64, "#f6e1b6"); for (let i = 0; i < 26; i++) bandes(ctx, x + i * 36, y, 12, h * 0.64, "#f1d8a6");
    forme(ctx, rr(x + w * 0.5, y + h * 0.12, w * 0.18, h * 0.26, 6), "#a8d6ee", "#7fb4d2", { trait: 4 });
    forme(ctx, lisse([[x + w * 0.51, y + h * 0.36], [x + w * 0.56, y + h * 0.24], [x + w * 0.6, y + h * 0.3], [x + w * 0.64, y + h * 0.2], [x + w * 0.67, y + h * 0.36]]), "#6fb35a", "#4f8f3e", { trait: 3 });
    forme(ctx, rr(x + w * 0.82, y + h * 0.04, w * 0.16, h * 0.62, 6), "#b98552", "#8c5e33", { trait: 4.5 });
    forme(ctx, rr(x + w * 0.845, y + h * 0.09, w * 0.11, h * 0.26, 4), "#bfe4c4", "#8fc49a", { trait: 3.5 });
    forme(ctx, ell(x + w * 0.85, y + h * 0.42, 6, 6), "#ffd54a", "#d9a11a", { trait: 2.5 });
    forme(ctx, rr(x - 10, y + h * 0.62, w + 20, 14, 0), "#fff4dc", "#e3cfa6", { trait: 3.5 });
    forme(ctx, rr(x - 10, y + h * 0.66, w + 20, h * 0.4, 0), "#cf9a62", "#b07f48", { trait: 4, ox: 0, oy: 8 });
    for (let i = 1; i < 4; i++) trait(ctx, [[x, y + h * (0.66 + i * 0.09)], [x + w, y + h * (0.66 + i * 0.09)]], 2.4, "#a8733f");
    for (let i = 0; i < 10; i++) trait(ctx, [[x + 50 + i * 92 + (i % 2) * 40, y + h * (0.66 + (i % 3) * 0.09)], [x + 50 + i * 92 + (i % 2) * 40, y + h * (0.75 + (i % 3) * 0.09)]], 2.2, "#a8733f");
  },
  classe(ctx, x, y, w, h) {
    bandes(ctx, x, y, w, h * 0.64, "#f3e6c6"); bandes(ctx, x, y + h * 0.5, w, h * 0.14, "#e8d6ac");
    forme(ctx, rr(x + w * 0.46, y + h * 0.07, w * 0.36, h * 0.32, 6), "#2f6b4f", "#24553e", { trait: 6, ox: 0, oy: 0 });
    forme(ctx, rr(x + w * 0.46, y + h * 0.39, w * 0.36, 10, 3), "#b98552", "#8c5e33", { trait: 3 });
    forme(ctx, rr(x + w * 0.87, y + h * 0.08, w * 0.12, h * 0.42, 6), "#cfeaf7", "#a6d1e8", { trait: 4.5 });
    trait(ctx, [[x + w * 0.93, y + h * 0.08], [x + w * 0.93, y + h * 0.5]], 4); trait(ctx, [[x + w * 0.87, y + h * 0.29], [x + w * 0.99, y + h * 0.29]], 4);
    forme(ctx, rr(x + w * 0.885, y + h * 0.42, 26, 22, 4), "#d9824a", "#a85a2a", { trait: 3 }); forme(ctx, ell(x + w * 0.885 + 13, y + h * 0.4, 20, 14), "#6fb35a", "#4f8f3e", { trait: 3 });
    forme(ctx, rr(x - 10, y + h * 0.64, w + 20, h * 0.42, 0), "#dfbd8a", "#c49c63", { trait: 4, ox: 0, oy: 8 });
    for (let i = 0; i < 14; i++) trait(ctx, [[x + i * 70, y + h * 0.64], [x + i * 70 - 60, y + h]], 2.2, "#c39a62");
  },
};

// un crayon debout dans un pot (la pointe en haut), un peu penché de `a` radians
export function crayonDebout(ctx, x, bas, long, couleur, a = 0) {
  ctx.save(); ctx.translate(x, bas); ctx.rotate(a);
  forme(ctx, rr(-7, -long + 16, 14, long - 16, 2), couleur[0], couleur[1], { trait: 2.6, ox: 3, oy: 0 });
  forme(ctx, poly([[-7, -long + 16], [7, -long + 16], [0, -long - 4]]), "#f3d2a2", "#d6ad78", { trait: 2.6 });
  ctx.fillStyle = INK; ctx.fill(poly([[-2.6, -long + 3], [2.6, -long + 3], [0, -long - 4]]));
  ctx.restore();
}
// un personnage ou un animal retourné (regarde vers la droite)
export function retourne(ctx, cx, f) { ctx.save(); ctx.translate(2 * cx, 0); ctx.scale(-1, 1); f(); ctx.restore(); }
// le sachet vidé : ouvert, le haut froissé, posé un peu de travers
export function sachetVide(ctx, cx, pied, h) {
  const w = h * 0.74, K = ["#e2b77e", "#b4834a"]; ombreSol(ctx, cx, pied - 2, w * 0.55);
  ctx.save(); ctx.translate(cx, pied); ctx.rotate(-0.12);
  forme(ctx, poly([[-w / 2, -h * 0.62], [-w * 0.3, -h * 0.7], [-w * 0.08, -h * 0.6], [w * 0.14, -h * 0.72], [w * 0.34, -h * 0.6], [w / 2, -h * 0.66], [w / 2 + 6, -2], [-w / 2 - 6, -2]]), K[0], K[1], { trait: 4 });
  forme(ctx, lisse([[-w * 0.42, -h * 0.6], [-w * 0.1, -h * 0.66], [w * 0.4, -h * 0.6], [w * 0.1, -h * 0.52]]), "#6e4a24", "#6e4a24", { trait: 2.5 });
  ctx.restore();
}
