// MODULE 7 · LA MISE EN SCÈNE D'UN PROBLÈME, FONCTIONS PURES (lot « Mise en scène des problèmes », docs/LOTS.md, fiche 23 ;
// docs/SPEC.md, section 7 quinquies ; décisions du parent du 6 novembre 2026 ; la maquette : art/problemes/mise-en-scene/).
// Testées par tests/unit/problemes-scene.test.mjs.
//  - LA SCÈNE : 884 × 374 (x 244 à 1128, y 106 à 480), l'image du lieu dedans 860 × 350 ; LA BANDE DE LA BULLE, en haut à gauche
//    (x < 760, y < 300), ne reçoit rien qu'on touche ni rien qu'on lit (la bulle de la mascotte s'y écrit) ;
//  - LES OBJETS de l'énoncé (son champ `scene`, la banque), de gauche à droite, le pied sur le sol du lieu, chacun à la taille de son
//    image (app/assets/problemes/index.json, `objets` : leur taille à @1x, déjà à l'échelle commune de la scène) ; un groupe, autant
//    de fois que la donnée le dit ; tout est réduit d'un même facteur quand la rangée est trop longue. UN OBJET SANS IMAGE n'est pas
//    dessiné : ses étiquettes sont posées au sol, à sa place (décision du 6 novembre, 8) ;
//  - LES ÉTIQUETTES sur l'objet qu'elles décrivent (sur chaque objet d'un groupe), le nombre d'un groupe au-dessus de sa rangée,
//    l'écart d'une comparaison entre les deux premiers objets, les autres sur le sol ; LA PLAQUE DE LA RÉPONSE sur le dépôt de la
//    réponse. Chacune prend la première place libre parmi les siennes : dans l'image, hors de la bande de la bulle, sans couvrir
//    une autre étiquette (ni, si elle peut, un objet).
export const CADRE = { x: 244, y: 106, w: 884, h: 374 }, BORD = 12;
export const IMAGE = { x: CADRE.x + BORD, y: CADRE.y + BORD, w: CADRE.w - 2 * BORD, h: CADRE.h - 2 * BORD };
export const BANDE_BULLE = { x0: CADRE.x, y0: CADRE.y, x1: 760, y1: 300 };
export const PLAQUE = { w: 196, h: 84 };
const MARGE = 10;

const recouvre = (a, b, m = 0) => a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m;
const dansImage = (r) => r.x >= IMAGE.x + 4 && r.y >= IMAGE.y + 4 && r.x + r.w <= IMAGE.x + IMAGE.w - 4 && r.y + r.h <= IMAGE.y + IMAGE.h - 2;
export const dansBande = (r) => r.x < BANDE_BULLE.x1 && r.y < BANDE_BULLE.y1 && r.x + r.w > BANDE_BULLE.x0 && r.y + r.h > BANDE_BULLE.y0;

// l'image d'un objet (sa variante d'abord, sinon l'objet seul) ; `rang` : sa place dans un groupe (les enfants : a, b, c, d tour à
// tour, retournés au-delà de quatre)
export function imageDe(x, images, rang = 0) {
  if (x.o === "enfants") { const V = ["a", "b", "c", "d"], k = (V.indexOf(x.v ?? "a") + rang) % 4, c = `enfants-${V[k]}`; return images[c] ? { cle: c, retourne: rang >= 4 } : images.enfants ? { cle: "enfants", retourne: rang % 2 === 1 } : null; }
  const c = x.v ? `${x.o}-${x.v}` : x.o;
  if (images[c]) return { cle: c, retourne: false };
  if (images[x.o]) return { cle: x.o, retourne: false };
  return null;
}
// la variante ouverte d'un contenant fermé (la correction, le partage manipulé, les groupes du niveau 3)
export const OUVERT = { ferme: "ouvert", fermee: "ouverte", couvert: "vide", couverte: "vide" };
export const ouvert = (x) => (x.v && OUVERT[x.v] ? { ...x, v: OUVERT[x.v] } : x);

/**
 * La composition d'une scène.
 * e : l'énoncé (son champ `scene`) ; donnees : les nombres des étiquettes (dans leur ordre) ; largeurs : la largeur de chaque
 * étiquette (px de la scène) ; hauteurEtiquette ; images : { cle: { w, h } } ; o.pied : la ligne du sol (y du pied des objets) ;
 * o.ouverts : la variante ouverte des contenants ; o.rangeeMax, o.ecart, o.echelleMin.
 * Rend { pieces: [{ k, copies: [{ x, y, w, h, cle, retourne }], boite, manque }], etiquettes: [{ i, x, y, w, h, k, echo }], plaque }
 */
export function composer(e, donnees, largeurs, hauteurEtiquette, images, o = {}) {
  const S = e.scene ?? { objets: [] }, pied = o.pied ?? 462, rangeeMax = o.rangeeMax ?? 440, ECART = o.ecart ?? 28, H = hauteurEtiquette;
  // 1. les pièces : leur taille naturelle (une rangée pour un groupe)
  const pieces = S.objets.map((x0, k) => {
    const x = o.ouverts ? ouvert(x0) : x0, c = x.n == null ? 1 : x.n === "?" ? 1 : Math.max(1, donnees[x.n] ?? 1);
    const ims = Array.from({ length: c }, (_, r) => imageDe(x, images, r)).map((im) => (im ? { ...im, ...images[im.cle] } : null));
    const manque = ims.some((im) => !im);
    if (manque) { const w = (x0.d ?? []).reduce((s, i) => s + largeurs[i] + 8, 0); return { k, x: x0, manque: true, n: c, w, h: H, ims: [] }; }
    const gap = 10, w = ims.reduce((s, im) => s + im.w, 0) + gap * (c - 1), sr = Math.min(1, rangeeMax / w);
    return { k, x: x0, manque: false, n: c, ims, sr, w: w * sr, h: Math.max(...ims.map((im) => im.h)) * sr, gap: gap * sr };
  }).filter((p) => !(p.manque && p.w === 0) || p.x.rep);
  // 2. le facteur commun, la répartition de gauche à droite (les marges égales)
  const dispo = IMAGE.w - 40, larg = pieces.reduce((s, p) => s + (p.manque && p.w === 0 ? PLAQUE.w : p.w), 0), total = larg + ECART * Math.max(0, pieces.length - 1);
  const s = Math.max(o.echelleMin ?? 0.55, Math.min(1, dispo / Math.max(1, total)));
  const libre = Math.max(0, dispo - total * s), pas = libre / (pieces.length + 1);
  let cx = IMAGE.x + 20 + pas;
  for (const p of pieces) {
    const w = (p.manque && p.w === 0 ? PLAQUE.w : p.w) * (p.manque ? 1 : s);
    p.boite = { x: cx, y: pied - p.h * (p.manque ? 1 : s), w, h: p.h * (p.manque ? 1 : s) };
    if (!p.manque) { let xx = cx; p.copies = p.ims.map((im) => { const k2 = p.sr * s, c = { x: xx, y: pied - im.h * k2, w: im.w * k2, h: im.h * k2, cle: im.cle, retourne: im.retourne }; xx += c.w + p.gap * s; return c; }); }
    else p.copies = [];
    cx += w + ECART * s + pas;
  }
  // 3. les étiquettes et la plaque : chacune à la première de ses places libres
  const posees = [], objetsBoites = pieces.filter((p) => !p.manque).flatMap((p) => p.copies);
  const libreIci = (r, eviterObjets) => dansImage(r) && !dansBande(r) && !posees.some((q) => recouvre(r, q, 4)) && (!eviterObjets || !objetsBoites.some((b) => recouvre(r, b, -6)));
  const choisir = (cands, w, h) => {
    for (const eviter of [true, false]) for (const [x, y] of cands) { const r = { x: Math.round(x), y: Math.round(y), w, h }; if (libreIci(r, eviter)) return r; }
    // (en dernier recours : la place libre la plus proche de la première, n'importe où dans l'image)
    const [x0, y0] = cands[0], grille = [];
    for (let y = IMAGE.y + 4; y + h <= IMAGE.y + IMAGE.h - 2; y += 8) for (let x = IMAGE.x + 4; x + w <= IMAGE.x + IMAGE.w - 4; x += 8) grille.push([x, y, (x - x0) ** 2 + (y - y0) ** 2]);
    grille.sort((a, b) => a[2] - b[2]);
    for (const eviter of [true, false]) for (const [x, y] of grille) { const r = { x, y, w, h }; if (libreIci(r, eviter)) return r; }
    const [x, y] = cands[0]; return { x: Math.round(Math.min(Math.max(x, IMAGE.x + 4), IMAGE.x + IMAGE.w - w - 4)), y: Math.round(Math.min(Math.max(y, IMAGE.y + 4), IMAGE.y + IMAGE.h - h - 2)), w, h };
  };
  // les places au sol, de gauche à droite (pour ce qui n'a pas d'objet)
  const sol = (w, h, depuis = IMAGE.x + 16) => { const L = []; for (let x = depuis; x + w <= IMAGE.x + IMAGE.w - 8; x += 16) L.push([x, pied - h - 4]); for (let x = depuis - 16; x >= IMAGE.x + 8; x -= 16) L.push([x, pied - h - 4]); return L; };
  // sur un objet (sur son ventre), au-dessus, à droite, à gauche ; `rang` : la deuxième étiquette d'un même objet, sous la première
  const autour = (b, w, h, rang = 0) => {
    const cxo = b.x + b.w / 2, sous = rang * (h + 6);
    return [[cxo - w / 2, b.y + b.h * 0.5 - h / 2 + sous], [cxo - w / 2, b.y + b.h - h - 6 - sous], [cxo - w / 2, b.y - h - 10 - sous], [b.x + b.w + 8, b.y + b.h * 0.45 - h / 2 + sous], [b.x - w - 8, b.y + b.h * 0.45 - h / 2 + sous]];
  };
  const etiquettes = [], entre = S.entre ?? [], pieceDe = (k) => pieces.find((p) => p.k === k);
  // a. le nombre de chaque groupe, au-dessus de sa rangée (ou à côté)
  for (const p of pieces) if (Number.isInteger(p.x.n)) {
    const i = p.x.n, w = largeurs[i], b = p.boite;
    const r = p.manque ? choisir(sol(w, H, b.x), w, H) : choisir([[b.x + b.w / 2 - w / 2, b.y - H - 14], [b.x + b.w + 8, b.y + b.h / 2 - H / 2], [b.x - w - 8, b.y + b.h / 2 - H / 2], [b.x + b.w / 2 - w / 2, b.y + 6]], w, H);
    posees.push(r); etiquettes.push({ i, ...r, k: p.k, accolade: !p.manque && p.n > 1 ? { x0: b.x, x1: b.x + b.w, y: b.y - 8 } : null });
  }
  // b. les étiquettes posées sur les objets (sur chaque objet d'un groupe : la première se touche, les autres en sont l'écho)
  for (const p of pieces) (p.x.d ?? []).forEach((i, rang) => {
    const w = largeurs[i];
    if (p.manque) { const r = choisir(sol(w, H, p.boite.x), w, H); posees.push(r); etiquettes.push({ i, ...r, k: p.k }); return; }
    p.copies.forEach((c, j) => {
      const r = j === 0 ? choisir(autour(c, w, H, rang), w, H) : (() => { const t = etiquettes.find((q) => q.i === i && q.k === p.k && !q.echo); const dx = c.x - p.copies[0].x; const r2 = { x: t.x + dx, y: t.y, w, h: H }; return r2; })();
      if (j === 0 || dansImage(r)) { posees.push(r); etiquettes.push({ i, ...r, k: p.k, echo: j > 0 }); }
    });
  });
  // c. entre les deux premiers objets (l'écart d'une comparaison)
  const deux = pieces.filter((p) => !p.manque).slice(0, 2);
  const entreCands = (w, h) => {
    if (deux.length < 2) return sol(w, h, IMAGE.x + IMAGE.w / 2 - w / 2);
    const a = deux[0].boite, b = deux[1].boite, mx = (a.x + a.w + b.x) / 2, haut = Math.min(a.y, b.y);
    return [[mx - w / 2, haut - h - 12], [mx - w / 2, Math.max(a.y + a.h, b.y + b.h) - h - 8], [mx - w / 2, (haut + pied) / 2 - h / 2], ...sol(w, h, mx - w / 2)];
  };
  for (const i of entre) if (i !== "rep") { const w = largeurs[i], r = choisir(entreCands(w, H), w, H); posees.push(r); etiquettes.push({ i, ...r, k: null, entre: true }); }
  // d. les données sans objet : sur le sol, de gauche à droite (ce qui est à l'enfant, « tu », est devant)
  const placees = new Set(etiquettes.map((t) => t.i));
  donnees.forEach((_, i) => { if (placees.has(i)) return; const w = largeurs[i], r = choisir(sol(w, H), w, H); posees.push(r); etiquettes.push({ i, ...r, k: null, sol: true }); });
  // e. la plaque de la réponse : sur le dépôt de la réponse (au-dessus, à côté, dessus), entre les deux objets, ou sur le sol
  const kr = S.objets.findIndex((x) => x.rep), pr = kr >= 0 ? pieceDe(kr) : null, { w: pw, h: ph } = PLAQUE;
  let plaque;
  if (pr && !pr.manque) { const b = pr.boite; plaque = choisir([[b.x + b.w / 2 - pw / 2, b.y - ph - 12], [b.x + b.w + 10, b.y + b.h / 2 - ph / 2], [b.x - pw - 10, b.y + b.h / 2 - ph / 2], [b.x + b.w / 2 - pw / 2, b.y + b.h / 2 - ph / 2], [b.x + b.w + 10, pied - ph - 4], [b.x - pw - 10, pied - ph - 4]], pw, ph); plaque.k = kr; }
  else if (entre.includes("rep")) plaque = choisir(entreCands(pw, ph), pw, ph);
  else plaque = choisir(sol(pw, ph, pr ? pr.boite.x : IMAGE.x + IMAGE.w / 2 - pw / 2), pw, ph);
  posees.push(plaque);
  return { pieces: pieces.map(({ k, x, manque, boite, copies, n }) => ({ k, o: x.o, manque, boite, copies, n, p: x.p ?? 0, groupe: x.n != null })), etiquettes, plaque, echelle: s, pied };
}

// la place des unités montrées (la correction, jusqu'à `max` ; le cran « plus facile » : une collection par étiquette) : une zone au
// sol libre, au plus près de `pres` (une boîte), où tient une collection de `n` objets au pas `p`
export function zoneSol(L, n, p, pres, eviter = []) {
  const cols = n <= 4 ? 2 : n <= 9 ? 3 : 5, w = Math.min(n, cols) * p + 8, h = Math.ceil(n / cols) * p * 0.86 + 8;
  const occupe = [...L.etiquettes, L.plaque, ...L.pieces.flatMap((q) => q.copies), ...eviter];
  const cands = [];
  for (let dx = 0; dx < IMAGE.w; dx += 12) for (const s of [1, -1]) cands.push([pres.x + pres.w / 2 - w / 2 + s * dx, L.pied - h - 2]);
  for (const [x, y] of cands) { const r = { x, y, w, h }; if (dansImage(r) && !dansBande(r) && !occupe.some((q) => recouvre(r, q, 2))) return { ...r, cols }; }
  return null;
}
