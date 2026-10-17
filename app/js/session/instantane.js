// L'INSTANTANÉ D'UN EXERCICE EN COURS (lot « Banc Android et recette en conditions réelles » ; décision du parent du 17 octobre
// 2026 : la reprise après un rechargement se fait à la question près). Un « runner » (la suite de questions d'un exercice, ou
// l'échauffement) garde en mémoire ce qui fait la suite de sa partie : les questions à revoir (une erreur revient plus loin),
// les dernières réponses (la réponse qui varie), ses compteurs, ses tirages. `instantane(runner)` en fait une copie en données
// simples, gardée dans la fiche de la séance après chaque question ; `restaurer(runner, copie)` la remet dans un runner neuf,
// après le rechargement. Ce qui vient d'ailleurs n'est pas copié : le contenu (les niveaux, les réglages), la base, l'écran, les
// fonctions, le hasard ; l'état enregistré dans la base (`st`, le niveau) l'est, pour rester cohérent avec la copie.
const EXCLUS = new Set(["store", "c", "c0", "c2", "content", "content2", "rnd", "seance", "cran", "choix", "clock", "baseMs", "screen", "offset", "levels", "rules", "dejaNouveaux"]);
const simple = (v) => v === null || ["string", "number", "boolean"].includes(typeof v);
const proto = (v) => Object.getPrototypeOf(v);
function copie(v, prof = 0) {
  if (prof > 12) return undefined;
  if (simple(v)) return typeof v === "number" && !Number.isFinite(v) ? { __nombre: String(v) } : v;
  if (v === undefined || typeof v === "function" || typeof v === "symbol") return undefined;
  if (Array.isArray(v)) return v.map((x) => copie(x, prof + 1) ?? null);
  if (v instanceof Set) return { __set: [...v].map((x) => copie(x, prof + 1)) };
  if (v instanceof Map) return { __map: [...v].map(([k, x]) => [copie(k, prof + 1), copie(x, prof + 1)]) };
  if (typeof v === "object") {
    const o = {};
    for (const [k, x] of Object.entries(v)) { if (prof === 0 || proto(v) !== Object.prototype ? EXCLUS.has(k) : false) continue; const c = copie(x, prof + 1); if (c !== undefined) o[k] = c; }
    return o;
  }
  return undefined;
}
function lire(v) {
  if (simple(v)) return v;
  if (Array.isArray(v)) return v.map(lire);
  if (v && typeof v === "object") {
    if ("__nombre" in v) return Number(v.__nombre);
    if ("__set" in v) return new Set(v.__set.map(lire));
    if ("__map" in v) return new Map(v.__map.map(([k, x]) => [lire(k), lire(x)]));
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, lire(x)]));
  }
  return v;
}
export const instantane = (runner) => copie(runner);
// remet la copie dans le runner : champ par champ ; un objet d'une classe (le tirage varié, l'échauffement d'un runner) garde
// sa classe et reçoit ses champs
export function restaurer(cible, c) {
  if (!cible || !c) return cible;
  for (const [k, x] of Object.entries(c)) {
    if (EXCLUS.has(k)) continue;
    const cur = cible[k];
    if (cur && typeof cur === "object" && !Array.isArray(cur) && !(cur instanceof Set) && !(cur instanceof Map) && proto(cur) !== Object.prototype && x && typeof x === "object" && !("__set" in x) && !("__map" in x)) restaurer(cur, x);
    else cible[k] = lire(x);
  }
  return cible;
}
// une copie en données simples d'une question ou d'une réponse (pour la fiche de la séance)
export const donnees = (v) => lire(copie(v, 1));
export const enDonnees = (v) => copie(v, 1);
