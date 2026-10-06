// MODULE 4 · LES VOILIERS, la partie sans écran (docs/SPEC.md, section 7 bis ; maquette validée : art/voiliers/index.html).
// Fonctions pures, testées par tests/unit/voiliers.test.mjs (qui les compare au script de la maquette, tirage par tirage) :
//  - `genBuoys` : une rangée de bouées (la fonction `genBuoys` de la maquette, mêmes tirages dans le même ordre) ;
//  - `pickNumber` : le nombre d'un bateau, dans un passage tiré au hasard (tous également probables), selon la place
//    voulue par le niveau (loin des bouées, près d'une bouée, partout) : `candidates` et `pickNumber` de la maquette ;
//  - `tensWindow` : la seconde rangée du double encadrement (5 bouées de 10 en 10 autour du nombre) ;
//  - `passage` (le bon passage), `codeErreur` (V1 : passage voisin, V2 : plus loin), `explication` et `pourquoi` (ce que
//    la voix dit après une erreur, ou quand le bateau va seul au bon passage), `entre` (deux bouées rondes voisines) ;
//  - la mer selon le cran (`merDepart`, `merApres`, `merDuCran`) : calme, vent, pirates (content/module4.json, mer).
// Les noms de la maquette (ten, odd, hundred, alt, mix, double ; far, near, any) sont ceux de module4.json traduits.
export const ECART = { dizaine: "ten", impair: "odd", centaine: "hundred", alterne: "alt", melange: "mix", double: "double" };
export const PLACE = { loin: "far", pres: "near", partout: "any" };
// un niveau de module4.json, dans les mots de la maquette (`LV`)
export const lv = (c) => ({ max: c.max, n: c.bouees, kind: ECART[c.ecart], mode: PLACE[c.place], ...(c.loin != null ? { farD: c.loin } : {}) });

// les tirages de la maquette : rnd(a, b) entier de a à b, pick(liste)
const tirages = (R) => ({ rnd: (a, b) => a + Math.floor(R() * (b - a + 1)), pick: (a) => a[Math.floor(R() * a.length)] });

// une rangée de bouées (maquette, `genBuoys`)
export function genBuoys(kind, n, max, R) {
  const { rnd, pick } = tirages(R);
  if (kind === "double") { const h0 = 100 * rnd(1, 6); return [h0, h0 + 100, h0 + 200, h0 + 300]; }
  const top = max === 100 ? 90 : 990;
  for (let t = 0; t < 800; t++) {
    const b = [];
    if (kind === "ten" || kind === "hundred") {
      const step = kind === "ten" ? 10 : 100, lo = kind === "hundred" ? 100 : (max === 100 ? 10 : 20), hi = (kind === "hundred" ? 900 : top) - step * (n - 1);
      if (hi < lo) continue;
      const s = lo + step * rnd(0, Math.floor((hi - lo) / step)); for (let i = 0; i < n; i++) b.push(s + i * step);
    } else if (kind === "odd") { b.push(rnd(12, max === 100 ? Math.max(12, top - 9 * (n - 1)) : 900)); for (let i = 1; i < n; i++) b.push(b[i - 1] + rnd(3, 9)); if (b.some((x) => x % 10 === 0)) continue; }
    else { b.push(rnd(15, max === 100 ? 40 : 450)); for (let i = 1; i < n; i++) b.push(b[i - 1] + pick([100, 10, rnd(3, 9)])); }
    if (b[0] < 10 || b[b.length - 1] > top) continue;
    return b;
  }
  return [40, 50, 60].slice(0, n);
}
// l'écart d'un passage (avant la première bouée, après la dernière : celui de la bouée voisine)
export function gapOfChenal(b, kindUsed, c) { const n = b.length; if (n === 1) return kindUsed === "hundred" ? 100 : 10; if (c === 0) return b[1] - b[0]; if (c === n) return b[n - 1] - b[n - 2]; return b[c] - b[c - 1]; }
// la distance d'un nombre à la plus proche des bouées de son passage
export function distIn(b, v, c) { let d = Infinity; if (c > 0) d = Math.min(d, v - b[c - 1]); if (c < b.length) d = Math.min(d, b[c] - v); return d; }
// les nombres possibles dans le passage c (maquette, `candidates`) ; `lastV` : le nombre du bateau d'avant (jamais deux fois)
export function candidates(b, kindUsed, c, cfg, lastV = null) {
  const n = b.length, maxB = cfg.max === 100 ? 99 : 999, lo = c === 0 ? 1 : b[c - 1] + 1, hi = c === n ? maxB : b[c] - 1, out = [];
  for (let v = lo; v <= hi; v++) {
    if (v === lastV) continue;
    const d = distIn(b, v, c);
    if (cfg.mode === "far" && d < cfg.farD) continue;
    if (cfg.mode === "near" && d > (gapOfChenal(b, kindUsed, c) >= 100 ? 9 : 2)) continue;
    out.push(v);
  }
  return out;
}
// le nombre d'un bateau (maquette, `pickNumber`) : le passage d'abord, puis un nombre de ce passage ; au double
// encadrement, un nombre entre la première et la dernière centaine, jamais une dizaine ronde
export function pickNumber(b, kindUsed, cfg, R, { lastV = null, row1 = null } = {}) {
  const { rnd, pick } = tirages(R), n = b.length;
  if (cfg.kind === "double") { const r = row1 ?? b; let v; do { v = rnd(r[0] + 1, r[3] - 1); } while (v % 10 === 0 || v === lastV); return v; }
  const w = n === 2 ? [0.25, 0.5, 0.25] : Array(n + 1).fill(1 / (n + 1));
  let r = R(), c = 0; for (; c < n; c++) { if (r < w[c]) break; r -= w[c]; }
  let cand = candidates(b, kindUsed, c, cfg, lastV);
  for (let k = 0; k <= n && !cand.length; k++) cand = candidates(b, kindUsed, k, cfg, lastV);
  for (let k = 0; k <= n && !cand.length; k++) cand = candidates(b, kindUsed, k, { max: cfg.max, mode: "any" }, lastV);
  return pick(cand);
}
// la seconde rangée du double encadrement (maquette, `tensWindow`) : 5 bouées de 10 en 10, dans la centaine du nombre
export function tensWindow(v, R) {
  const { pick } = tirages(R), H = Math.floor(v / 100) * 100, t = Math.floor(v / 10) * 10, opts = [];
  for (let s = t - 30; s <= t; s += 10) if (s >= H && s + 40 <= H + 100 && t + 10 <= s + 40) opts.push(s);
  const s = pick(opts); return [s, s + 10, s + 20, s + 30, s + 40];
}
// le bon passage : le nombre de bouées plus petites que le nombre (0 : avant la première ; n : après la dernière)
export const passage = (b, v) => b.filter((x) => x < v).length;
// une erreur : V1, le passage voisin du bon ; V2, deux passages ou plus d'écart
export const codeErreur = (c, k) => (Math.abs(c - k) === 1 ? "V1" : "V2");
export const rond = (x) => x % 10 === 0;
// deux bouées rondes voisines qui encadrent le passage k (deux dizaines, ou deux centaines, voisines), sinon null
export function entre(b, k) {
  if (k <= 0 || k >= b.length) return null;
  const a = b[k - 1], c = b[k];
  return (c - a === 10 && rond(a)) || (c - a === 100 && a % 100 === 0) ? [a, c] : null;
}
// ce que la voix dit après une erreur : le nombre est plus grand que la bouée à droite du passage choisi (il passe
// après), ou plus petit que celle de gauche (il passe avant) ; la bouée se nomme si elle est ronde, sinon « cette
// bouée », qui s'allume. Renvoie { cle, b, bouee } : la clé de textes.json (voiliersErreur), la valeur, son rang.
export function explication(b, c, v) {
  const k = passage(b, v);
  if (c === k) return null;
  const i = c < k ? c : c - 1, apres = c < k;
  return { cle: `${apres ? "plusGrand" : "plusPetit"}${rond(b[i]) ? "" : "Bouee"}`, b: b[i], bouee: i };
}
// pourquoi le bon passage est le bon (le bateau y va seul) : par rapport à la bouée de gauche (il passe après), ou à la
// première (il passe avant). (Relecture du lot : « C'est entre 40 et 50 ! » est réservé aux réussites ; dit aussi pour une
// correction, l'enfant ne savait plus si elle avait réussi.)
export function pourquoi(b, v) {
  const k = passage(b, v);
  const i = k > 0 ? k - 1 : 0, apres = k > 0;
  return { cle: `${apres ? "plusGrand" : "plusPetit"}${rond(b[i]) ? "" : "Bouee"}`, b: b[i], bouee: i };
}

// ---------------------------------------------------------------- la mer
// la mer d'un cran au début de la partie
export const merDepart = (M, cran) => (M.crans[cran] ?? M.crans.conseille).mers[0];
// la mer gardée quand le cran change en cours de partie (la protection redescend d'un cran) : la même si le nouveau
// cran la connaît, sinon la plus forte qu'il connaît (ou la plus douce, si la mer était plus douce que toutes)
const ORDRE = ["calme", "vent", "pirates"];
export function merDuCran(M, cran, mer) {
  const mers = (M.crans[cran] ?? M.crans.conseille).mers;
  if (mers.includes(mer)) return mer;
  return ORDRE.indexOf(mer) > ORDRE.indexOf(mers.at(-1)) ? mers.at(-1) : mers[0];
}
// ce qu'on annonce quand la mer change (textes.json, voiliersMer)
export const annonce = (de, a) => (de === a ? null : a === "vent" ? (de === "pirates" ? "ventRetour" : "vent") : a === "pirates" ? "pirates" : "calme");
// après un bateau : `res` « ok » (rangé du premier coup), « demi » (double encadrement : une rangée sur deux) ou « echec » ;
// e = { mer, gains, echecs } -> nouvel état et annonce
export function merApres(M, cran, e, res) {
  const mers = (M.crans[cran] ?? M.crans.conseille).mers, i = Math.max(0, mers.indexOf(e.mer));
  let { gains, echecs } = e, mer = e.mer;
  if (res === "ok") { gains++; echecs = 0; if (gains >= M.monteeApres && i < mers.length - 1) { mer = mers[i + 1]; gains = 0; } }
  else if (res === "echec") { echecs++; gains = 0; if (echecs >= M.descenteApres && i > 0) { mer = mers[i - 1]; echecs = 0; } }
  return { mer, gains, echecs, annonce: annonce(e.mer, mer) };
}
