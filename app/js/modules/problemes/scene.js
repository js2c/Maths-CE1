// MODULE 7 · LA MISE EN SCÈNE D'UN PROBLÈME, FONCTIONS PURES (lot « Mise en scène des problèmes », docs/LOTS.md, fiche 24 ;
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
  const S = e.scene ?? { objets: [] }, pied = o.pied ?? 462, piedActeurs = o.piedActeurs ?? pied, solX = IMAGE.x + IMAGE.w * (o.solX ?? 0), rangeeMax = o.rangeeMax ?? 440, ECART = o.ecart ?? 28, H = hauteurEtiquette;
  // 1. les pièces : leur taille naturelle (une rangée pour un groupe)
  const pieces = S.objets.map((x0, k) => {
    const x = o.ouverts ? ouvert(x0) : x0, c = x.n == null ? 1 : x.n === "?" ? 1 : Math.max(1, donnees[x.n] ?? 1);
    const ims = Array.from({ length: c }, (_, r) => imageDe(x, images, r)).map((im) => (im ? { ...im, ...images[im.cle] } : null));
    const manque = ims.some((im) => !im);
    if (manque) { const w = (x0.d ?? []).reduce((s, i) => s + largeurs[i] + 8, 0); return { k, x: x0, manque: true, n: c, w, h: H, ims: [], acteur: false }; }
    const acteur = ims.some((im) => im.c === "personnage" || im.c === "animal");
    const gap = 10, w = ims.reduce((s, im) => s + im.w, 0) + gap * (c - 1), sr = Math.min(1, rangeeMax / w);
    return { k, x: x0, manque: false, n: c, ims, sr, w: w * sr, h: Math.max(...ims.map((im) => im.h)) * sr, gap: gap * sr, acteur };
  }).filter((p) => !(p.manque && p.w === 0) || p.x.rep);
  // 2. le facteur commun, la répartition de gauche à droite (les marges égales)
  const dispo = IMAGE.x + IMAGE.w - 20 - Math.max(IMAGE.x + 20, solX), larg = pieces.reduce((s, p) => s + (p.manque && p.w === 0 ? PLAQUE.w : p.w), 0), total = larg + ECART * Math.max(0, pieces.length - 1);
  const s = Math.max(o.echelleMin ?? 0.55, Math.min(1, dispo / Math.max(1, total)));
  const libre = Math.max(0, dispo - total * s), pas = libre / (pieces.length + 1);
  let cx = Math.max(IMAGE.x + 20, solX) + pas;
  for (const p of pieces) {
    const w = (p.manque && p.w === 0 ? PLAQUE.w : p.w) * (p.manque ? 1 : s);
    const pp = p.acteur ? piedActeurs : pied; p.pied = pp;
    p.boite = { x: cx, y: pp - p.h * (p.manque ? 1 : s), w, h: p.h * (p.manque ? 1 : s) };
    if (!p.manque) { let xx = cx; p.copies = p.ims.map((im) => { const k2 = p.sr * s, c = { x: xx, y: pp - im.h * k2, w: im.w * k2, h: im.h * k2, cle: im.cle, retourne: im.retourne }; xx += c.w + p.gap * s; return c; }); }
    else p.copies = [];
    cx += w + ECART * s + pas;
  }
  // 3. les étiquettes et la plaque : chacune à la première de ses places libres
  const posees = [], objetsBoites = pieces.filter((p) => !p.manque).flatMap((p) => p.copies);
  // `seuil` : la part de la place qui peut couvrir un objet (sauf le sien) : 0, à peine (15 %), ou n'importe (null)
  const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const libreIci = (r, seuil, propres) => dansImage(r) && !dansBande(r) && !posees.some((q) => recouvre(r, q, 4)) && (seuil == null || objetsBoites.every((b) => propres.includes(b) || (seuil === 0 ? !recouvre(r, b, -6) : inter(r, b) <= seuil * r.w * r.h)));
  const choisir = (cands0, w, h, propres = []) => {
    // (chaque place, et la même un peu décalée à gauche ou à droite ; descendue sous la bande de la bulle si elle y entre)
    const decale = cands0.flatMap(([x, y]) => [0, -24, 24, -48, 48, -80, 80].map((dx) => [x + dx, y]));
    const cands = decale.flatMap(([x, y]) => (dansBande({ x, y, w, h }) && y < BANDE_BULLE.y1 + 2 ? [[x, y], [x, BANDE_BULLE.y1 + 2]] : [[x, y]]));
    // (les places de l'objet, puis la place libre la plus proche n'importe où dans l'image ; couvrir un objet voisin seulement à peine,
    // puis, en tout dernier recours, n'importe comment)
    const [x0, y0] = cands[0], grille = [];
    for (let y = IMAGE.y + 4; y + h <= IMAGE.y + IMAGE.h - 2; y += 8) for (let x = IMAGE.x + 4; x + w <= IMAGE.x + IMAGE.w - 4; x += 8) grille.push([x, y, (x - x0) ** 2 + (y - y0) ** 2]);
    grille.sort((a, b) => a[2] - b[2]);
    for (const [L, seuil] of [[cands, 0], [cands, 0.15], [grille, 0], [grille, 0.15], [cands, null], [grille, null]]) for (const [x, y] of L) { const r = { x: Math.round(x), y: Math.round(y), w, h }; if (libreIci(r, seuil, propres)) return r; }
    const [x, y] = cands[0]; return { x: Math.round(Math.min(Math.max(x, IMAGE.x + 4), IMAGE.x + IMAGE.w - w - 4)), y: Math.round(Math.min(Math.max(y, IMAGE.y + 4), IMAGE.y + IMAGE.h - h - 2)), w, h };
  };
  // les places au sol, de gauche à droite (pour ce qui n'a pas d'objet)
  const sol = (w, h, depuis = Math.max(IMAGE.x + 16, solX)) => { const L = [], x0 = Math.max(depuis, solX); for (let x = x0; x + w <= IMAGE.x + IMAGE.w - 8; x += 16) L.push([x, pied - h - 4]); for (let x = x0 - 16; x >= Math.max(IMAGE.x + 8, solX); x -= 16) L.push([x, pied - h - 4]); return L; };
  // les places d'une étiquette autour d'un objet : sur son ventre (plusieurs étiquettes empilées quand l'objet est assez haut : `nd`,
  // combien il en porte, quand elles en couvrent au plus les deux tiers ; `rang`, la place de celle-ci), dessous, au-dessus, à droite, à gauche ; un objet plus petit que l'étiquette
  // la reçoit au-dessus de lui ou à côté (sur lui, elle le cacherait : la trousse sous son « 8 »)
  const places = (b, w, h, rang = 0, nd = 1) => {
    const cxo = b.x + b.w / 2, pile = nd * (h + 6) <= 0.65 * b.h, sous = rang * (h + 6);
    return { pile, ventre: [cxo - w / 2, pile ? b.y + (b.h - nd * (h + 6)) / 2 + 3 + sous : b.y + b.h * 0.5 - h / 2 + sous], bas: [cxo - w / 2, b.y + b.h - h - 6 - sous], dessus: [cxo - w / 2, b.y - h - 10 - sous], droite: [b.x + b.w + 8, b.y + b.h * 0.45 - h / 2], gauche: [b.x - w - 8, b.y + b.h * 0.45 - h / 2] };
  };
  // (les étiquettes ne couvrent pas plus des deux tiers de l'objet : au-delà, la deuxième va à côté de lui)
  const autour = (b, w, h, rang = 0, nd = 1) => {
    const P = places(b, w, h, rang, nd);
    if (b.h < 1.6 * h) return [P.dessus, P.droite, P.gauche, P.ventre, P.bas];
    return rang > 0 && !P.pile ? [P.droite, P.gauche, P.dessus, P.bas, P.ventre] : [P.ventre, P.bas, P.dessus, P.droite, P.gauche];
  };
  const etiquettes = [], entre = S.entre ?? [], pieceDe = (k) => pieces.find((p) => p.k === k);
  // SANS AUCUNE IMAGE D'OBJET (tant que le parent n'en a pas déposé) : les étiquettes sur le sol, dans l'ordre de l'histoire, la
  // plaque après elles, comme avant le lot
  if (!pieces.some((p) => !p.manque)) {
    let x = IMAGE.x + 28;
    donnees.forEach((_, i) => { const w = largeurs[i], r = choisir(sol(w, H, x), w, H); posees.push(r); etiquettes.push({ i, ...r, k: null, sol: true }); x = r.x + w + 14; });
    const plaque = choisir(sol(PLAQUE.w, PLAQUE.h, Math.max(x + 20, IMAGE.x + IMAGE.w - 28 - PLAQUE.w)).concat(sol(PLAQUE.w, PLAQUE.h, x)), PLAQUE.w, PLAQUE.h);
    return { pieces: pieces.map(({ k, x: xx, manque, boite, copies, n }) => ({ k, o: xx.o, manque, boite, copies, n, p: xx.p ?? 0, groupe: xx.n != null })), etiquettes, plaque, echelle: s, pied };
  }
  // a. le nombre de chaque groupe, au-dessus de sa rangée (ou à côté)
  for (const p of pieces) if (Number.isInteger(p.x.n)) {
    const i = p.x.n, w = largeurs[i], b = p.boite;
    const r = p.manque ? choisir(sol(w, H, b.x), w, H) : choisir([[b.x + b.w / 2 - w / 2, b.y - H - 14], [b.x + b.w + 8, b.y + b.h / 2 - H / 2], [b.x - w - 8, b.y + b.h / 2 - H / 2], [b.x + b.w / 2 - w / 2, b.y + 6]], w, H, p.copies);
    posees.push(r); etiquettes.push({ i, ...r, k: p.k, accolade: !p.manque && p.n > 1 ? { x0: b.x, x1: b.x + b.w, y: b.y - 8 } : null });
  }
  // b. les étiquettes posées sur les objets (sur chaque objet d'un groupe : la première se touche, les autres en sont l'écho)
  // (un groupe de contenants ouverts : son étiquette après la plaque, qui garde sa place sur le dépôt de la réponse)
  const differes = [];
  for (const p of pieces) (p.x.d ?? []).forEach((i, rang) => {
    const w = largeurs[i], nd = p.x.d.length;
    if (o.ouverts && p.x.n != null && !p.manque) { differes.push([p, i, rang]); return; }
    if (p.manque) { const r = choisir(sol(w, H, p.boite.x), w, H); posees.push(r); etiquettes.push({ i, ...r, k: p.k }); return; }
    // (un groupe de contenants ouverts, leur contenu montré : une seule étiquette, à côté de la rangée, jamais sur ce qu'ils contiennent ;
    // comme la maquette validée, où les « 6 » des sachets s'effacent quand on les ouvre)
    // (le dépôt de la réponse qui porte aussi des données, « le seau » de « 8 coquillages blancs et 5 roses » : la première à sa
    // gauche, les autres sur lui, la plaque à sa droite : « 8 5 ? » se lit dans l'ordre de l'histoire et le seau reste visible)
    const avecRep = nd > 1 && S.objets[p.k]?.rep && p.x.n == null;
    const placesDe = (c) => (!avecRep ? autour(c, w, H, rang, nd) : rang === 0 ? [places(c, w, H).gauche, ...autour(c, w, H, 0, 1)] : autour(c, w, H, rang - 1, nd - 1));
    p.copies.forEach((c, j) => {
      const r = j === 0 ? choisir(placesDe(c), w, H, [c]) : (() => { const t = etiquettes.find((q) => q.i === i && q.k === p.k && !q.echo); const dx = c.x - p.copies[0].x; const r2 = { x: t.x + dx, y: t.y, w, h: H }; return r2; })();
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
  const placees = new Set([...etiquettes.map((t) => t.i), ...differes.map(([, i]) => i)]);
  // (après les étiquettes des données dites avant elle : l'ordre de l'histoire, de gauche à droite)
  donnees.forEach((_, i) => { if (placees.has(i)) return; const avant = etiquettes.filter((t) => t.i < i && !t.echo), depuis = avant.length ? Math.max(...avant.map((t) => t.x + t.w)) + 14 : IMAGE.x + 16, w = largeurs[i], r = choisir(sol(w, H, depuis), w, H); posees.push(r); etiquettes.push({ i, ...r, k: null, sol: true }); });
  // e. la plaque de la réponse : sur le dépôt de la réponse (au-dessus, à côté, dessus), entre les deux objets, ou sur le sol
  const kr = S.objets.findIndex((x) => x.rep), pr = kr >= 0 ? pieceDe(kr) : null, { w: pw, h: ph } = PLAQUE;
  let plaque;
  if (pr && !pr.manque) { const b = pr.boite, au = [b.x + b.w / 2 - pw / 2, b.y - ph - 12], cotes = [[b.x + b.w + 10, b.y + b.h / 2 - ph / 2], [b.x - pw - 10, b.y + b.h / 2 - ph / 2], [b.x + b.w + 10, pr.pied - ph - 4], [b.x - pw - 10, pr.pied - ph - 4]];
    plaque = choisir(pr.n > 1 ? [...cotes, au] : [au, ...cotes, [b.x + b.w / 2 - pw / 2, b.y + b.h / 2 - ph / 2]], pw, ph, pr.n > 1 ? [] : pr.copies); plaque.k = kr; }
  else if (entre.includes("rep")) plaque = choisir(entreCands(pw, ph), pw, ph);
  else plaque = choisir(sol(pw, ph, pr ? pr.boite.x : IMAGE.x + IMAGE.w / 2 - pw / 2), pw, ph);
  // les étiquettes des groupes de contenants ouverts, leur contenu montré : une seule, à côté de la rangée, jamais sur ce qu'ils
  // contiennent (comme la maquette validée, où les « 6 » des sachets s'effacent quand on les ouvre) ; ni sur la plaque
  if (differes.length) {
    posees.push(plaque);
    for (const [p, i, rang] of differes) {
      const w = largeurs[i], b = p.boite, y = b.y + b.h * 0.45 - H / 2 + rang * (H + 6), P = places(p.copies[0], w, H, rang), pp = p.pied ?? pied;
      const r = choisir([[b.x + b.w + 8, y], [b.x - w - 8, y], [b.x + b.w + 8, pp - H - 4 - rang * (H + 6)], [b.x - w - 8, pp - H - 4 - rang * (H + 6)], P.dessus, P.ventre], w, H);
      posees.push(r); etiquettes.push({ i, ...r, k: p.k });
    }
    posees.splice(posees.indexOf(plaque), 1);
  }
  posees.push(plaque);
  return { pieces: pieces.map(({ k, x, manque, boite, copies, n, pied: pp }) => ({ k, o: x.o, manque, boite, copies, n, p: x.p ?? 0, groupe: x.n != null, pied: pp ?? pied })), etiquettes, plaque, echelle: s, pied };
}

// la place des unités montrées (la correction, jusqu'à `max` ; le cran « plus facile » : une collection par étiquette) : une zone au
// sol libre, au plus près de `pres` (une boîte), où tient une collection de `n` objets au pas `p`
// `ou` : « pres », juste sous la boîte ou juste au-dessus (relecture du 7 novembre 2026 : la collection d'une étiquette, ou les unités
// de la réponse, posées près d'une autre étiquette trompaient sur ce qu'elles comptent) ; « sol », sur le sol, au plus près
export function zoneSol(L, n, p, pres, eviter = [], taille = null, ou = "sol") {
  const cols = n <= 4 ? 2 : n <= 9 ? 3 : 5, w = taille?.w ?? Math.min(n, cols) * p + 8, h = taille?.h ?? Math.ceil(n / cols) * p * 0.86 + 8;
  const occupe = [...L.etiquettes, { ...L.plaque, w: PLAQUE.w, h: PLAQUE.h }, ...L.pieces.flatMap((q) => q.copies), ...eviter];
  const cands = [], x0 = pres.x + pres.w / 2 - w / 2;
  if (ou === "pres") { for (const y of [pres.y + pres.h + 6, pres.y - h - 6]) for (const dx of [0, -24, 24, -48, 48, -72, 72]) cands.push([x0 + dx, y]); }
  else for (let dx = 0; dx < IMAGE.w; dx += 12) for (const s of [1, -1]) cands.push([x0 + s * dx, L.pied - h - 2]);
  for (const [x, y] of cands) { const r = { x, y, w, h }; if (dansImage(r) && !dansBande(r) && !occupe.some((q) => recouvre(r, q, 2))) return { ...r, cols }; }
  return null;
}
