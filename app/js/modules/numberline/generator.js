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
// lot 2, étape 8 (docs/SPEC-COMPLEMENTS.md, partie A), nombres jusqu'à 1 000 :
// E6 confond dizaines et centaines           -> 70 au lieu de 700, 37 au lieu de 370, 37 ou 370 au lieu de 307,
//                                               437 au lieu de 347
// E7 écrit le nombre comme il l'entend        -> 3007 au lieu de 307, 30017 au lieu de 317 (dictée seulement :
//                                               ces nombres ne tiennent pas sur la ligne de 0 à 1 000)
export const e6Values = (a) => {
  if (a < 100 || a > 999) return [];
  const c = Math.floor(a / 100), d = Math.floor(a / 10) % 10, u = a % 10;
  if (u === 0) return [a / 10]; // 700 -> 70, 370 -> 37
  if (d === 0) return [c * 10 + u, c * 100 + u * 10]; // 307 -> 37, 370
  return d !== c ? [d * 100 + c * 10 + u] : []; // 347 -> 437
};
export const e7Value = (a) => (a >= 100 && a <= 999 && a % 100 ? Number(`${Math.floor(a / 100) * 100}${a % 100}`) : null);
export const TRAPS = {
  E1: (q) => q.answer + q.step,
  E2: (q) => (q.step === 10 && q.answer % 10 === 0 ? q.answer / 10 : null),
  E3: (q) => (q.min !== 0 ? q.answer - q.min : null),
  E4: (q) => q.min + q.max - q.answer,
  E5: (q) => { const a = q.answer, t = Math.floor(a / 10), u = a % 10; return a >= 10 && a < 100 && u !== 0 && u !== t ? u * 10 + t : null; },
  E6: (q) => e6Values(q.answer)[0] ?? null,
};
// ordre de priorité des pièges selon ce que la ligne rend possible (au-delà de 100, E6 remplace E2 et E5)
const PRIORITY = ["E1", "E3", "E2", "E5", "E4"], PRIORITY_1000 = ["E1", "E3", "E6", "E4"];
const priority = (q) => (q.max > 100 ? PRIORITY_1000 : PRIORITY);
// le plus grand nombre d'une question (les propositions restent sur la ligne : jusqu'à 100, ou jusqu'à 1 000)
const top = (q) => (q.max > 100 ? 1000 : 100);

const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

// ---------------------------------------------------------------- lot 3 : la difficulté à l'intérieur du niveau
// (docs/SPEC-LOT3.md, section 3) : quand l'enfant a choisi son niveau, le cran du sélecteur rend CE niveau plus
// facile ou plus exigeant. Chaque niveau de content/module1.json a un bloc `crans` (facile, dur, tresdur ; le
// conseillé est le niveau lui-même) : des paramètres du niveau remplacés (labels, choix, formats, etendue, departs,
// tolerances, nombres…) et quelques options propres aux crans :
//   cibleMilieu : la cible dans le tiers du milieu de la ligne (plus d'aide des extrémités) ;
//   sautsApres [a, b] : niveau 7, la cible a à b sauts après la seconde graduation écrite ;
//   premierSaut : niveau 1, la tortue montre le premier saut (écran) ;
//   repere : estimer, le milieu de la ligne est marqué et écrit ;
//   filtre (dictée) : « sansZero » (347), « zeroUnSurDeux » (un nombre sur deux avec un zéro), « zerosEtDix »
//   (310, 715, 970) ; tableau : le tableau centaines, dizaines, unités affiché pendant la dictée.
export function applyCran(cfg, cran) {
  const o = cran && cran !== "conseille" ? cfg.crans?.[cran] : null;
  if (!o) return cfg;
  const { crans, ...base } = cfg; void crans;
  return { ...base, ...o, cran };
}
// les nombres de la dictée selon le filtre du cran (toujours pris dans la liste du niveau : chacun a sa voix)
const hasZero = (v) => String(v).includes("0"), withTen = (v) => Math.floor(v / 10) % 10 === 1;
export function dictationPool(cfg, k = 0) {
  const all = cfg.nombres;
  if (cfg.filtre === "sansZero") return all.filter((v) => !hasZero(v));
  if (cfg.filtre === "zerosEtDix") return all.filter((v) => hasZero(v) || withTen(v));
  if (cfg.filtre === "zeroUnSurDeux") return all.filter((v) => (k % 2 === 0 ? hasZero(v) : !hasZero(v)));
  return all;
}
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
    case "extremites-milieu": return new Set([0, Math.round((L.n - 1) / 2), L.n - 1]); // lot 3 : le milieu aussi écrit
    case "dizaines": return new Set(all.filter((i) => valueAt(L, i) % 10 === 0));
    case "cinq": return new Set(all.filter((i) => valueAt(L, i) % 5 === 0)); // lot 3 : les dizaines et les 5 (35, 45)
    case "deux-voisines": { const j = Math.floor(rnd() * 4); return new Set([j, j + 1]); }
    case "trois-voisines": { const j = Math.floor(rnd() * 3); return new Set([j, j + 1, j + 2]); } // lot 3, niveau 7 plus facile
    case "deux-espacees": { const j = Math.floor(rnd() * 3); return new Set([j, j + 2]); } // lot 3, niveau 7 très dur
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
  if (["deux-voisines", "trois-voisines", "deux-espacees"].includes(cfg.labels)) { const hi = Math.max(...lab), [a, b] = cfg.sautsApres ?? [2, Infinity]; pool = pool.filter((i) => i >= hi + a && i <= hi + b); }
  // lot 3 : la cible dans le tiers du milieu (plus dur : les extrémités n'aident plus)
  if (cfg.cibleMilieu) { const m = pool.filter((i) => i >= (L.n - 1) / 3 && i <= (2 * (L.n - 1)) / 3); if (m.length) pool = m; }
  if (opts.eviter) { const f = pool.filter((i) => !opts.eviter.includes(valueAt(L, i))); if (f.length) pool = f; }
  if (!pool.length) pool = range(1, L.n - 2).filter((i) => !lab.has(i) || cfg.labels === "tous-sauf-cible");
  let chosen = null;
  // un quart près d'une extrémité (niveaux 2 à 7) : les deux graduations libres les plus proches de chaque bout
  if (cfg.niveau >= 2 && cfg.niveau <= 7 && !["deux-voisines", "trois-voisines", "deux-espacees"].includes(cfg.labels) && !cfg.cibleMilieu) {
    const sorted = [...pool].sort((a, b) => a - b), near = [...new Set([sorted[0], sorted[1], sorted[sorted.length - 1], sorted[sorted.length - 2]])].filter((i) => i !== undefined);
    const far = pool.filter((i) => !near.includes(i));
    const prefer = rnd() < 0.25 || !far.length ? near : far;
    // (lot 3 bis, A3 : tirage sans remise, opts.pick ; la moitié préférée n'a plus de cible libre : l'autre)
    if (!opts.pick) pool = prefer; else chosen = opts.pick(prefer, false);
  }
  // lot 3 bis (docs/SPEC-LOT3BIS.md, A3) : `opts.pick(liste, tour)` (le déroulement) tire la cible sans remise ; `tour` : la
  // liste est la série entière, un nouveau tour peut commencer
  const target = chosen ?? (opts.pick ? opts.pick(pool, true) ?? pick(rnd, pool) : pick(rnd, pool)), answer = valueAt(L, target);
  if (cfg.labels === "tous-sauf-cible") { lab.delete(target); hideAround(lab, target, cfg.cacherVoisins ?? 0, L.n); }
  const q = { module: 1, niveau: cfg.niveau, format: "lire", ...L, target, answer, labelled: [...lab].sort((a, b) => a - b), ...(cfg.premierSaut ? { premierSaut: true } : {}), ...(cfg.cran ? { cran: cfg.cran } : {}) };
  q.choices = choicesFor(q, opts.choix ?? cfg.choix ?? 3, rnd);
  return q;
}

// lot 3 bis (A3) : au niveau 1 (« lire »), les voisins de la cible sont cachés aussi (0 1 ? ? ? 5 6…), sauf les extrémités
function hideAround(lab, target, k, n) { for (let d = 1; d <= k; d++) for (const i of [target - d, target + d]) if (i > 0 && i < n - 1) lab.delete(i); }
// les propositions : la bonne, les pièges possibles par priorité, puis des voisines si besoin ; triées
export function choicesFor(q, count, rnd) {
  const out = [{ value: q.answer, code: null }], has = (v) => out.some((c) => c.value === v);
  const ok = (v) => v !== null && Number.isInteger(v) && v >= 0 && v <= top(q) && !has(v);
  // au niveau 1, les pièges parlants sont E1 et E4 ; l'autre voisine complète
  const order = q.niveau === 1 ? ["E1", "E4"] : priority(q);
  for (const code of order) { if (out.length >= count) break; const v = TRAPS[code](q); if (ok(v)) out.push({ value: v, code }); }
  for (const d of [-1, 2, -2, 3]) { if (out.length >= count) break; const v = q.answer + d * q.step; if (ok(v)) out.push({ value: v, code: null }); }
  void rnd;
  return out.sort((a, b) => a.value - b.value);
}

// le type d'erreur d'une réponse donnée (null si juste ou si l'erreur n'est pas typée)
export function classify(q, value) {
  // estimer : juste dans la tolérance ; placé au symétrique (depuis la droite) : E4
  if (q.format === "estimer") return Math.abs(value - q.answer) <= q.tolerance ? null : Math.abs(value - (q.min + q.max - q.answer)) <= q.tolerance ? "E4" : "autre";
  if (q.format === "placer") return classifyPlace(q, value);
  if (q.format === "ecrire") return classifyWrite(q, value);
  if (value === q.answer) return null;
  const c = q.choices?.find((x) => x.value === value);
  if (c?.code) return c.code;
  for (const code of priority(q)) if (TRAPS[code](q) === value) return code;
  return "autre";
}

// la ligne à dessiner (runtime.js, drawLine) pour une question : positions en px logiques de la scène
// (lot 3 bis, R20 : une ligne qui va jusqu'à 1 000 s'arrête un peu avant, pour que « 1000 » ne touche ni le bord ni les algues)
export function lineSpec(q, cfg, { x0 = 150, x1 = q.max >= 1000 ? 1104 : 1134, y = 452 } = {}) {
  const labels = Array.from({ length: q.n }, (_, i) => (q.labelled.includes(i) ? String(valueAt(q, i)) : null));
  // lot 2, étape 8 : un petit chalut au-dessus des graduations de centaines (au-delà de 100)
  const centaines = q.max > 100 ? Array.from({ length: q.n }, (_, i) => i).filter((i) => { const v = valueAt(q, i); return v > 0 && v % 100 === 0; }) : undefined;
  // lot 3 : le repère du milieu (estimer, cran « plus facile »)
  const marks = q.repere ? [{ t: 0.5, label: String((q.min + q.max) / 2), color: "#1d7f8f" }] : undefined;
  return { x0, x1, y, n: q.n, labels, k: cfg.k, centaines, mark: q.format === "lire" ? q.target : undefined, ends: q.n === 0 ? [String(q.min), String(q.max)] : undefined, lit: q.format === "sauter" ? [q.start] : undefined, marks };
}

// ---------------------------------------------------------------- une question « sauter » (niveau 1)
// « La tortue est sur a et fait b sauts. Où arrive-t-elle ? » Les nombres écrits sont ceux du niveau
// (au niveau 1 : tous sauf la cible). Pièges : compter la bouée de départ comme un saut (a + b - 1, la
// même confusion traits / sauts que E1) ; oublier le point de départ (b, comme E3).
export function makeJump(cfg, rnd) {
  const L = lineFor(cfg, rnd), b = 1 + Math.floor(rnd() * 4), a = Math.floor(rnd() * (L.n - b)), target = a + b, answer = valueAt(L, target);
  const lab = labelledIndices(cfg, L, rnd); if (cfg.labels === "tous-sauf-cible") lab.delete(target);
  // lot 3 bis (A3) : au niveau 1, les nombres du trajet de la tortue sont cachés (l'arrivée n'est plus le seul trou)
  if (cfg.cacherTrajet && cfg.labels === "tous-sauf-cible") for (let i = a + 1; i < target; i++) if (i > 0 && i < L.n - 1) lab.delete(i);
  const q = { module: 1, niveau: cfg.niveau, format: "sauter", ...L, start: a, jumps: b, target, answer, labelled: [...lab].sort((x, y) => x - y) };
  const out = [{ value: answer, code: null }], has = (v) => out.some((c) => c.value === v), count = cfg.choix ?? 3;
  for (const [v, code] of [[valueAt(L, a + b - 1), "E1"], [b * L.step, "E3"], [answer + L.step, null], [answer - 2 * L.step, null], [answer + 2 * L.step, null]]) if (out.length < count && v >= L.min && v <= L.max && !has(v)) out.push({ value: v, code });
  q.choices = out.sort((x, y) => x.value - y.value);
  return q;
}

// ---------------------------------------------------------------- une question « placer » (niveaux 2 à 6)
// « Place le poisson sur le nombre 7. » L'enfant touche ou fait glisser le poisson sur une graduation.
// Même tirage de cible que « lire » (jamais une graduation numérotée, un quart près d'une extrémité).
export function makePlace(cfg, rnd, opts = {}) {
  const q = makeRead(cfg, rnd, { ...opts, choix: 1 });
  delete q.choices; q.format = "placer";
  return q;
}
// l'erreur d'un placement : symétrique (E4), un pas à côté (E1), chiffres inversés (E5), sinon « autre »
export function classifyPlace(q, value) {
  if (value === q.answer) return null;
  if (value === q.min + q.max - q.answer) return "E4";
  if (Math.abs(value - q.answer) === q.step) return "E1";
  if (TRAPS.E5(q) === value) return "E5";
  if (e6Values(q.answer).includes(value)) return "E6";
  return "autre";
}

// ---------------------------------------------------------------- une question « écrire » (niveau 12, dictée)
// « Écris le nombre 307. » : la voix dit le nombre, l'enfant le tape au pavé numérique. Les nombres dictés
// sont ceux de content/module1.json (niveau 12, `nombres`).
export function makeWrite(cfg, rnd, opts = {}) {
  const all = dictationPool(cfg, opts.k ?? 0), pool = all.filter((v) => !opts.eviter?.includes(v)), answer = pick(rnd, pool.length ? pool : all.length ? all : cfg.nombres);
  return { module: 1, niveau: cfg.niveau, format: "ecrire", min: 0, max: 1000, step: 1, n: 0, target: null, answer, labelled: [], ...(cfg.tableau ? { tableau: true } : {}), ...(cfg.cran ? { cran: cfg.cran } : {}) };
}
// l'erreur d'une dictée : E6 (37 ou 370 pour 307), E7 (3007 pour 307), sinon « autre »
export function classifyWrite(q, value) {
  if (value === q.answer) return null;
  if (e6Values(q.answer).includes(value)) return "E6";
  if (value === e7Value(q.answer)) return "E7";
  return "autre";
}

// ---------------------------------------------------------------- une question « estimer » (niveau 8)
// Ligne 0-100 sans graduations, 0 et 100 écrits : « Où mettrais-tu 50 ? ». Juste si l'écart ne dépasse pas
// la tolérance (±8 au début du niveau, puis ±5 : voir `tolerance`).
export function makeEstimate(cfg, rnd, opts = {}) {
  const all = cfg.cibles ?? [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90], pool = all.filter((v) => !opts.eviter?.includes(v));
  // (lot 3 bis, A3 : tirage sans remise, opts.pick)
  const answer = (opts.pick && opts.pick(all, true)) ?? pick(rnd, pool.length ? pool : [(cfg.min + cfg.max) / 2]);
  return { module: 1, niveau: cfg.niveau, format: "estimer", min: cfg.min, max: cfg.max, step: 1, n: 0, target: null, answer, labelled: [], tolerance: opts.tolerance ?? cfg.tolerances[0], ...(cfg.repere ? { repere: true } : {}), ...(cfg.cran ? { cran: cfg.cran } : {}) };
}
// tolérance du niveau 8 : la première tant que 5 estimations n'ont pas été justes au niveau, puis la seconde
export const toleranceFor = (cfg, justesAuNiveau) => (justesAuNiveau >= 5 ? cfg.tolerances[1] : cfg.tolerances[0]);

// ---------------------------------------------------------------- les nombres d'un niveau (pour la voix)
// tous les nombres qu'un niveau peut montrer, demander ou compter : ceux de ses lignes (graduations,
// cibles, départs), ses nombres dictés, ses cibles « estimer » et le milieu de sa ligne. L'inventaire de la
// voix (tools/voix/inventaire.mjs) fabrique une phrase pour chacun, au-delà de 100.
export function levelValues(cfg0) {
  // (lot 3 : avec les lignes que ses crans peuvent produire : étendue plus grande, autres départs)
  if (cfg0.crans) return [...new Set([cfg0, ...Object.keys(cfg0.crans).map((k) => applyCran(cfg0, k))].flatMap((c) => levelValues({ ...c, crans: undefined })))].sort((x, y) => x - y);
  const cfg = cfg0, out = new Set(), steps = Array.isArray(cfg.pas) ? cfg.pas : [cfg.pas ?? 1];
  if (cfg.nombres) cfg.nombres.forEach((v) => out.add(v));
  if (cfg.cibles) { cfg.cibles.forEach((v) => out.add(v)); out.add((cfg.min + cfg.max) / 2); out.add(cfg.min); out.add(cfg.max); }
  const lines = cfg.etendue ? cfg.departs.map((d) => [d, d + cfg.etendue]) : cfg.min !== undefined && cfg.graduations !== false ? [[cfg.min, cfg.max]] : [];
  for (const [a, b] of lines) for (const st of steps) for (let v = a; v <= b; v += st) out.add(v);
  return [...out].sort((x, y) => x - y);
}

// ---------------------------------------------------------------- lot 3 bis : une même question (docs/SPEC-LOT3BIS.md, §0)
// ce qui fait qu'une question est « la même » : le format, la ligne et la cible (au format « sauter » : le départ et le
// nombre de sauts) ; une dictée ou une estimation : le nombre
export const questionKey = (q) => (q.format === "sauter" ? `sauter:${q.min}-${q.max}:${q.start}+${q.jumps}` : q.format === "ecrire" || q.format === "estimer" ? `${q.format}:${q.answer}` : `${q.format}:${q.min}-${q.max}:${q.answer}`);
