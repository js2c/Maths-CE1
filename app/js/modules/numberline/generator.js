// MODULE 1 · GÉNÉRATION DES QUESTIONS (fonctions pures, sans DOM : testées par tests/unit).
// Tout vient des paramètres de niveau de content/module1.json et de docs/SPEC.md, « Module 1 » :
//  - la cible n'est jamais une graduation numérotée ;
//  - aux niveaux 2 à 7, un quart des cibles sont près d'une extrémité (là où l'erreur E1 se voit) ;
//  - au format « lire », les propositions fausses sont les pièges E1 à E5 : chaque mauvaise réponse
//    dit donc quel type d'erreur a été fait.

// ---------------------------------------------------------------- les pièges
// E1 compte les traits au lieu des sauts   -> bonne réponse + un pas
// E2 ignore la valeur du saut (pas de 10)   -> 7 au lieu de 70
// E3 ignore le point de départ              -> 4 au lieu de 34
// E4 compte depuis la droite                -> le nombre symétrique
// E5 inverse dizaines et unités             -> 43 au lieu de 34
export const TRAPS = {
  E1: (q) => q.answer + q.step,
  E2: (q) => (q.step === 10 && q.answer % 10 === 0 ? q.answer / 10 : null),
  E3: (q) => (q.min !== 0 ? q.answer - q.min : null),
  E4: (q) => q.min + q.max - q.answer,
  E5: (q) => { const a = q.answer, t = Math.floor(a / 10), u = a % 10; return a >= 10 && a < 100 && u !== 0 && u !== t ? u * 10 + t : null; },
};
// ordre de priorité des pièges selon ce que la ligne rend possible
const PRIORITY = ["E1", "E3", "E2", "E5", "E4"];

const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
const range = (a, b, s = 1) => { const out = []; for (let v = a; v <= b + 1e-9; v += s) out.push(Math.round(v)); return out; };

// ---------------------------------------------------------------- la ligne d'un niveau
// renvoie { min, max, step, n, labelled: Set d'indices numérotés }
export function lineFor(cfg, rnd) {
  let min, max, step;
  if (cfg.niveau === 7) {
    step = pick(rnd, cfg.pas);
    min = step === 10 ? 0 : pick(rnd, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
    max = min + 10 * step;
  } else if (cfg.etendue) { min = pick(rnd, cfg.departs); max = min + cfg.etendue; step = cfg.pas; }
  else { min = cfg.min; max = cfg.max; step = cfg.pas; }
  const n = cfg.graduations === false ? 0 : Math.round((max - min) / step) + 1;
  return { min, max, step, n };
}
const valueAt = (L, i) => L.min + i * L.step;

// quelles graduations portent leur nombre (hors cible, gérée à part)
function labelledIndices(cfg, L, rnd) {
  const all = range(0, L.n - 1);
  switch (cfg.labels) {
    case "tous-sauf-cible": return new Set(all);
    case "extremites": return new Set([0, L.n - 1]);
    case "dizaines": return new Set(all.filter((i) => valueAt(L, i) % 10 === 0));
    case "deux-voisines": { const j = Math.floor(rnd() * 4); return new Set([j, j + 1]); }
    default: return new Set(all.filter((i) => cfg.labels.includes(valueAt(L, i))));
  }
}

// ---------------------------------------------------------------- une question « lire »
// options : { choix } pour forcer le nombre de propositions, { eviter } : valeurs à ne pas reprendre
export function makeRead(cfg, rnd, opts = {}) {
  const L = lineFor(cfg, rnd), lab = labelledIndices(cfg, L, rnd);
  // cibles possibles : jamais une graduation numérotée (au niveau 1, toutes le sont : la cible est
  // alors celle dont on retire le nombre), jamais une extrémité
  let pool = range(1, L.n - 2).filter((i) => cfg.labels === "tous-sauf-cible" || !lab.has(i));
  if (cfg.labels === "deux-voisines") { const hi = Math.max(...lab); pool = pool.filter((i) => i >= hi + 2); }
  if (opts.eviter) { const f = pool.filter((i) => !opts.eviter.includes(valueAt(L, i))); if (f.length) pool = f; }
  if (!pool.length) pool = range(1, L.n - 2).filter((i) => !lab.has(i) || cfg.labels === "tous-sauf-cible");
  // un quart près d'une extrémité (niveaux 2 à 7) : les deux graduations libres les plus proches de chaque bout
  if (cfg.niveau >= 2 && cfg.niveau <= 7 && cfg.labels !== "deux-voisines") {
    const sorted = [...pool].sort((a, b) => a - b), near = [...new Set([sorted[0], sorted[1], sorted[sorted.length - 1], sorted[sorted.length - 2]])].filter((i) => i !== undefined);
    const far = pool.filter((i) => !near.includes(i));
    pool = rnd() < 0.25 || !far.length ? near : far;
  }
  const target = pick(rnd, pool), answer = valueAt(L, target);
  if (cfg.labels === "tous-sauf-cible") lab.delete(target);
  const q = { module: 1, niveau: cfg.niveau, format: "lire", ...L, target, answer, labelled: [...lab].sort((a, b) => a - b) };
  q.choices = choicesFor(q, opts.choix ?? cfg.choix ?? 3, rnd);
  return q;
}

// les propositions : la bonne, les pièges possibles par priorité, puis des voisines si besoin ; triées
export function choicesFor(q, count, rnd) {
  const out = [{ value: q.answer, code: null }], has = (v) => out.some((c) => c.value === v);
  const ok = (v) => v !== null && Number.isInteger(v) && v >= 0 && v <= 100 && !has(v);
  // au niveau 1, les pièges parlants sont E1 et E4 ; l'autre voisine complète
  const order = q.niveau === 1 ? ["E1", "E4"] : PRIORITY;
  for (const code of order) { if (out.length >= count) break; const v = TRAPS[code](q); if (ok(v)) out.push({ value: v, code }); }
  for (const d of [-1, 2, -2, 3]) { if (out.length >= count) break; const v = q.answer + d * q.step; if (ok(v)) out.push({ value: v, code: null }); }
  void rnd;
  return out.sort((a, b) => a.value - b.value);
}

// le type d'erreur d'une réponse donnée (null si juste ou si l'erreur n'est pas typée)
export function classify(q, value) {
  if (value === q.answer) return null;
  const c = q.choices?.find((x) => x.value === value);
  if (c?.code) return c.code;
  for (const code of PRIORITY) if (TRAPS[code](q) === value) return code;
  return "autre";
}

// la ligne à dessiner (runtime.js, drawLine) pour une question : positions en px logiques de la scène
export function lineSpec(q, cfg, { x0 = 150, x1 = 1134, y = 452 } = {}) {
  const labels = Array.from({ length: q.n }, (_, i) => (q.labelled.includes(i) ? String(valueAt(q, i)) : null));
  return { x0, x1, y, n: q.n, labels, k: cfg.k, mark: q.format === "lire" ? q.target : undefined, ends: q.n === 0 ? [String(q.min), String(q.max)] : undefined };
}
