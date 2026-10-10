// MODULE 6 · L'ÉTAL DU PÊCHEUR, la partie sans écran (docs/SPEC.md, section 7 quater ; lot « L'étal du pêcheur »). Fonctions
// pures, testées par tests/unit/etal.test.mjs. Tous les montants sont en CENTIMES (300 : 3 €, 250 : 2,50 €).
//  - les prix d'un niveau (`prixPossibles`) : tous ont une phrase (`montantDit`), le haut de la fourchette aux crans « plus dur »
//    et « très dur » ;
//  - le portefeuille (`tirerPortefeuille`) : tiré à chaque question selon le niveau ; niveaux « payer » et « deux » : le compte
//    juste existe toujours ; « restreint » : il existe, d'une ou deux façons seulement ; « monnaie » : il n'existe jamais, et un
//    paiement sans pièce de trop existe toujours ;
//  - la règle de validation (`juger`) : le compte juste quand il est possible ; sinon assez, sans pièce de trop ; les codes M1 à
//    M7 ; ce que le pêcheur rend quand il y a trop (`enTrop`) ; une bonne façon de payer (`solution`) ; la monnaie qu'il rend,
//    comptée à partir du prix (`rendu`) ; ce qu'il dit en comptant (`comptes`).
export const VALEURS = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10];
export const estBillet = (v) => v >= 500;
const somme = (xs) => xs.reduce((a, b) => a + b, 0);

// ---------------------------------------------------------------- les montants dits et écrits
// un montant tel que la voix le dit (textes.json, etalMontant) : « 3 euros. », « 1 euro. », « 3 euros 50. », « 1 euro 20. »,
// « 50 centimes. » ; T : textes.json
export function montantDit(T, c) {
  const M = T.etalMontant, e = Math.floor(c / 100), r = c % 100;
  if (!e) return M.centimes.replace("{c}", r);
  if (!r) return (e === 1 ? M.euro : M.euros).replace("{e}", e);
  return (e === 1 ? M.euroCentimes : M.eurosCentimes).replace("{e}", e).replace("{c}", r);
}
// un montant écrit (ardoise, total) : « 3 € », « 2,50 € », « 0,30 € » (comme la maquette, fmtPrix)
export const montantEcrit = (c) => (c % 100 ? `${Math.floor(c / 100)},${String(c % 100).padStart(2, "0")} €` : `${c / 100} €`);
// le nombre dit pendant un compte (« 2… 13… ») : en euros ronds, le nombre seul ; sinon le montant
export const compteDit = (T, c, dernier = false) => (!dernier && c % 100 === 0 ? String(c / 100) : montantDit(T, c));

// ---------------------------------------------------------------- les prix
const range = (a, b, s) => { const o = []; for (let v = a; v <= b; v += s) o.push(v); return o; };
// les prix d'un niveau (au cran « plus dur » et « très dur » : la moitié haute de la fourchette)
export function prixPossibles(cfg, effet = {}) {
  if (!cfg.prix) return [];
  const [a, b, s] = cfg.prix, all = range(a, b, s);
  return effet.hautDeFourchette ? all.slice(Math.floor(all.length / 2)) : all;
}

// ---------------------------------------------------------------- le portefeuille
// le nombre de façons de faire exactement `prix` avec les objets d'un portefeuille (multiensembles distincts)
export function facons(valeurs, prix, max = 99) {
  const n = new Map(); for (const v of valeurs) n.set(v, (n.get(v) ?? 0) + 1);
  let w = new Map([[0, 1]]);
  for (const [v, k] of n) {
    const w2 = new Map();
    for (const [s, f] of w) for (let i = 0; i <= k && s + i * v <= prix; i++) w2.set(s + i * v, Math.min(max, (w2.get(s + i * v) ?? 0) + f));
    w = w2;
  }
  return w.get(prix) ?? 0;
}
export const compteJuste = (valeurs, prix) => facons(valeurs, prix, 1) > 0;
// assez, et aucune pièce de trop : retirer n'importe quel objet ne suffirait plus
export const sansPieceDeTrop = (soucoupe, prix) => soucoupe.length > 0 && somme(soucoupe) >= prix && somme(soucoupe) - Math.min(...soucoupe) < prix;
// un portefeuille pour une question ; R : le hasard ; renvoie les valeurs, des plus grosses aux plus petites
export function tirerPortefeuille(cfg, prix, R, effet = {}) {
  if (cfg.type === "poser") return [...cfg.valeurs].sort((a, b) => b - a);
  if (cfg.type === "rendre") return [];
  const P = cfg.portefeuille, max = cfg.totalMax ?? Infinity;
  for (let essai = 0; essai < 4000; essai++) {
    const vs = [];
    for (const k of Object.keys(P)) { const [a, b] = P[k]; const n = a + Math.floor(R() * (b - a + 1)); for (let i = 0; i < n; i++) vs.push(Number(k)); }
    if (effet.petites && cfg.petitesTresDur) for (const k of Object.keys(cfg.petitesTresDur)) for (let i = 0; i < cfg.petitesTresDur[k]; i++) vs.push(Number(k));
    const t = somme(vs);
    if (t < prix || t > max) continue;
    if (cfg.type === "monnaie") { if (compteJuste(vs, prix)) continue; }
    else if (cfg.type === "restreint") { const f = facons(vs, prix); if (f < cfg.facons[0] || f > cfg.facons[1] || t < prix + 200) continue; }
    else if (!compteJuste(vs, prix)) continue;
    return vs.sort((a, b) => b - a);
  }
  return null;
}

// ---------------------------------------------------------------- la validation
// cfg : le niveau ; q : { prix, valeur (niveau 1) } ; soucoupe : les valeurs posées. Renvoie { ok, code, manque, trop }.
//  - niveau 1 : la pièce ou le billet demandé, seul (M7 sinon) ;
//  - compte juste possible : il est exigé (M1 pas assez, M2 trop) ; compte juste impossible (« monnaie ») : assez, sans pièce
//    de trop (M1 pas assez, M3 une pièce de trop) ;
//  - M4 « le nombre au lieu de la valeur » (heuristique) : autant d'objets que le prix en euros, sans que la somme soit juste.
export function juger(cfg, q, soucoupe) {
  if (cfg.type === "poser") return soucoupe.length === 1 && soucoupe[0] === q.valeur ? { ok: true } : { ok: false, code: "M7" };
  const s = somme(soucoupe), prix = q.prix;
  if (cfg.type === "monnaie" ? sansPieceDeTrop(soucoupe, prix) : s === prix) return { ok: true, rendu: s - prix };
  if (prix % 100 === 0 && soucoupe.length === prix / 100 && soucoupe.some((v) => v !== 100)) return { ok: false, code: "M4", manque: Math.max(0, prix - s), trop: Math.max(0, s - prix) };
  if (s < prix) return { ok: false, code: "M1", manque: prix - s };
  return { ok: false, code: cfg.type === "monnaie" ? "M3" : "M2", trop: s - prix };
}
// le niveau 7 : la réponse tapée (ce que le pêcheur rend) ; M5 : le prix au lieu de la différence ; M6 : une autre erreur
// (n : le nombre tapé, en euros)
export const jugerRendu = (q, n) => (n * 100 === q.billet - q.prix ? { ok: true } : { ok: false, code: n * 100 === q.prix ? "M5" : "M6" });

// ce que le pêcheur rend quand il y a trop (indices des objets de la soucoupe) :
//  - M2 : il garde le plus possible sans dépasser le prix (à somme égale, le moins d'objets rendus) et rend le reste ;
//  - M3 : il rend les objets inutiles, le plus gros d'abord, tant que le reste suffit (« Celle-là, garde-la ! »).
export function enTrop(cfg, prix, soucoupe) {
  const n = soucoupe.length;
  if (cfg.type === "monnaie") {
    const garde = soucoupe.map((v, i) => ({ v, i })), rend = [];
    for (;;) {
      const s = somme(garde.map((x) => x.v)), c = garde.filter((x) => s - x.v >= prix).sort((a, b) => b.v - a.v)[0];
      if (!c) break; rend.push(c.i); garde.splice(garde.indexOf(c), 1);
    }
    return rend;
  }
  let best = null;
  for (let m = 0; m < 1 << n; m++) {
    let s = 0, k = 0; for (let i = 0; i < n; i++) if (m & (1 << i)) { s += soucoupe[i]; k++; }
    if (s > prix) continue;
    if (!best || s > best.s || (s === best.s && k > best.k)) best = { s, k, m };
  }
  return soucoupe.map((_, i) => i).filter((i) => !(best.m & (1 << i)));
}

// une bonne façon de payer avec ce portefeuille (la correction, l'exemple guidé) : le compte juste avec le moins d'objets
// (à nombre égal, les plus gros) ; au niveau « monnaie », le paiement sans pièce de trop qui dépasse le moins le prix
export function solution(cfg, prix, portefeuille, valeur = null) {
  if (cfg.type === "poser") return [valeur];
  const vs = [...portefeuille].sort((a, b) => b - a), n = vs.length;
  // (programmation dynamique sur les sommes : le moins d'objets pour chaque somme, les plus gros d'abord)
  const best = new Map([[0, []]]);
  for (const v of vs) for (const [s, xs] of [...best.entries()].sort((a, b) => b[0] - a[0])) {
    const t = s + v, cur = best.get(t);
    if (t > prix + 5000) continue;
    if (!cur || cur.length > xs.length + 1) best.set(t, [...xs, v]);
  }
  void n;
  if (cfg.type !== "monnaie") return best.get(prix) ?? null;
  const ok = [...best.entries()].filter(([s, xs]) => s >= prix && sansPieceDeTrop(xs, prix)).sort((a, b) => a[0] - b[0] || a[1].length - b[1].length);
  return ok[0]?.[1] ?? null;
}
// la monnaie que rend le pêcheur, dans l'ordre où il la compte à partir du prix : les plus petites d'abord
// (13 € payés avec 20 € : 2 €, puis 5 € ; « 13… 15… 20 »)
export function rendu(montant) {
  const out = []; let r = montant;
  for (const v of VALEURS.filter((x) => x <= 2000)) while (r >= v) { out.push(v); r -= v; }
  return out.reverse();
}
// les sous-totaux d'un compte (« 10… 15… 17 euros »), objet par objet, du plus gros au plus petit (`depuis` : à partir d'un
// prix, pour la monnaie rendue)
export const comptes = (valeurs, depuis = 0) => { let s = depuis; return valeurs.map((v) => (s += v)); };

// ---------------------------------------------------------------- les produits
// les douze produits de la maquette (art/etal/index.html, PRODUITS), dans l'ordre de textes.json (etalProduit)
export const PRODUITS = ["sardines", "maquereau", "bar", "dorade", "sole", "seiche", "crevettes", "moules", "huitres", "saint-jacques", "homard", "tourteau"];
// deux produits (niveau 8) : toujours dans l'ordre de PRODUITS (« Achète les deux. », puis le premier, puis le second)
export const paire = (a, b) => (PRODUITS.indexOf(a) < PRODUITS.indexOf(b) ? [a, b] : [b, a]);
// le prix d'un produit du niveau 8 : deux prix dont le total est dans la fourchette du niveau
export function deuxPrix(cfg, total, R) {
  const [a, , s] = cfg.prixProduit, m = cfg.prixProduit[1];
  const ps = range(a, Math.min(m, total - a), s);
  const p = ps[Math.floor(R() * ps.length)]; return [p, total - p];
}
