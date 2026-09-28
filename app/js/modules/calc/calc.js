// MODULE 3 · LE CALCUL RAPIDE, la partie sans écran (docs/SPEC.md, « Module 3 » ; lot 3, docs/SPEC-LOT3.md, section 6).
// Fonctions pures, testées par tests/unit/calcul.test.mjs :
//  - `calcsOf(cfg)` : tous les calculs d'un niveau (content/module3.json : type, ops, a, b) ; le générateur en tire un au
//    hasard, l'inventaire de la voix fabrique une phrase pour chacun ;
//  - `chemin(q)` : les ponts de la procédure (38 → + 2 → 40 → + 3 → 43 ; 34 → + 10 → 44 → − 1 → 43…) ;
//  - `answerOf(q)` : la réponse attendue (forme directe : le résultat ; forme à trou « 38 plus combien, ça fait 43 ? » :
//    le second nombre) ;
//  - `classifyCalc(q, v)` : l'erreur C1 (+ 10 change les unités), C3 (+ 9 sans reculer d'un pas), C4 (sans changer de
//    dizaine en ajoutant), C5 (les unités retirées à l'envers) ; C2 (juste mais lent) est décidée par le déroulement,
//    au temps de réponse.
const range = (a, b) => { const out = []; for (let v = a; v <= b; v++) out.push(v); return out; };
const tens = (n) => Math.floor(n / 10) * 10, units = (n) => n % 10;
export const apply = (a, op, b) => (op === "+" ? a + b : a - b);
// la règle de chaque type : le calcul (a op b) fait-il partie du niveau ?
export const KEEP = {
  petit: (a, op, b) => { const r = apply(a, op, b); return r >= 1 && r <= 100; },
  dizaine: (a, op, b) => { const r = apply(a, op, b); return r >= 1 && r <= 100; },
  dizaines: (a, op, b) => { const r = apply(a, op, b); return r >= 1 && r <= 99; },
  unitesPlus: (a, op, b) => units(a) >= 1 && units(a) + b <= 9,
  unitesMoins: (a, op, b) => units(a) - b >= 0 && units(a) > b - 1 && a - b >= 10,
  plus9: (a, op, b) => units(a) !== 0 && a + b <= 99,
  passerPlus: (a, op, b) => units(a) + b >= 11 && a + b <= 99,
  deuxNombres: (a, op, b) => units(a) + units(b) <= 9 && a + b <= 99 && tens(a) >= 10,
  passerMoins: (a, op, b) => units(a) >= 1 && units(a) < b && a - b >= 10,
};
export function calcsOf(cfg) {
  const out = [], keep = KEEP[cfg.type];
  for (const op of cfg.ops) for (const a of range(cfg.a[0], cfg.a[1])) for (const b of cfg.b) if (keep(a, op, b)) out.push({ a, op, b, n: apply(a, op, b) });
  return out;
}
// les ponts : [{ op, k, de, a }] de la procédure du niveau
export function chemin(q) {
  const { a, op, b } = q, steps = [];
  let cur = a;
  const step = (o, k) => { const to = apply(cur, o, k); steps.push({ op: o, k, de: cur, a: to }); cur = to; };
  switch (q.type) {
    case "dizaines": for (let i = 0; i < b / 10; i++) step(op, 10); break;
    case "plus9": step("+", 10); step("-", 1); break;
    case "passerPlus": step("+", 10 - units(a)); step("+", b - (10 - units(a))); break;
    case "passerMoins": step("-", units(a)); step("-", b - units(a)); break;
    // (lot 3, étape 5 : les dizaines d'un seul pont, puis les unités : 23 + 34 → + 30 → 53 → + 4 → 57, comme 23 + 10 + 4)
    case "deuxNombres": step("+", tens(b)); if (units(b)) step("+", units(b)); break;
    default: step(op, b);
  }
  return steps;
}
// la réponse attendue selon la forme (directe, ou « trou » : le second nombre manque)
// (lot 3 bis : « trouGauche », le nombre de départ manque : « ? + 10 = 57 »)
export const answerOf = (q) => (q.forme === "trou" || q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : apply(q.a, q.op, q.b));
// l'erreur type d'une mauvaise réponse (null si juste ; « autre » si elle ne se reconnaît pas)
export function classifyCalc(q, v) {
  if (v === answerOf(q)) return null;
  if (v === null || v === undefined || (q.forme && q.forme !== "directe")) return "autre";
  const { a, op, b } = q;
  // C1 : + 10 (ou − 10, + 20…) change les unités au lieu des dizaines (34 + 10 = 35)
  if (b % 10 === 0 && v === apply(a, op, b / 10)) return "C1";
  if (q.type === "deuxNombres" && v === a + Math.floor(b / 10) + units(b)) return "C1";
  // C3 : + 9, on ajoute 10 sans reculer d'un pas (34 + 9 = 44)
  if (b === 9 && op === "+" && v === a + 10) return "C3";
  // C4 : on ajoute les unités sans passer à la dizaine suivante (38 + 5 = 33)
  if (op === "+" && units(a) + units(b) >= 10 && b < 10 && v === tens(a) + ((units(a) + b) % 10)) return "C4";
  // C5 : on retire les unités à l'envers (42 − 5 = 43 : 5 − 2 au lieu de casser une dizaine)
  if (op === "-" && b < 10 && units(a) < b && v === tens(a) + (b - units(a))) return "C5";
  return "autre";
}
// le calcul tel que l'ardoise et le parent le montrent
export const calcText = (q) => (q.forme === "trou" ? `${q.a} ${q.op === "+" ? "+" : "−"} ? = ${apply(q.a, q.op, q.b)}` : `${q.a} ${q.op === "+" ? "+" : "−"} ${q.b}`);
// un calcul du niveau, au hasard, en évitant les `eviter` derniers (clés « a op b »)
export const calcKey = (c) => `${c.a}${c.op}${c.b}`;
export function makeCalc(cfg, rnd, { eviter = [], forme = "directe" } = {}) {
  const all = calcsOf(cfg), pool = all.filter((c) => !eviter.includes(calcKey(c)));
  const c = (pool.length ? pool : all)[Math.floor(rnd() * (pool.length ? pool : all).length)];
  return { module: 3, niveau: cfg.niveau, type: cfg.type, support: cfg.support, a: c.a, op: c.op, b: c.b, n: c.n, forme: forme === "trou" && cfg.trou ? "trou" : "directe" };
}
// le niveau est-il conseillable ? (module3.json, debloque : niveaux acquis ; famille d'additions dont `part` des faits de
// la règle sont en boîte `boite` ou plus)
export function unlocked(cfg, { acquis = [], familyShare = () => 0, part = 0.8 } = {}) {
  const d = cfg.debloque ?? {};
  if ((d.niveaux ?? []).some((n) => !acquis.includes(n))) return false;
  if (d.famille && familyShare(d.famille, d.boite ?? 2) < part - 1e-9) return false;
  return true;
}
