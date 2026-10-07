// MODULE 5 · LA MULTIPLICATION, la partie sans écran (lot « Multiplication » ; docs/SPEC.md, section 7 ter ;
// docs/maquettes/multiplication/PROPOSITION.md). Fonctions pures, testées par tests/unit/multiplication.test.mjs :
//  - `multsOf(cfg)` : toutes les multiplications d'un niveau (content/module5.json : type, rangees, parRangee, table, tables) ;
//    « a × b » se lit « a rangées de b poissons » et se dit « a fois b » ;
//  - `makeMult(cfg, rnd)` : un tirage, sans reprendre les dernières ;
//  - `multAnswer(q)` : la réponse attendue (forme directe : le produit ; « 3 × ? = 12 » : 4 ; « ? × 4 = 12 » : 3) ;
//  - `classifyMult(q, v)` : M1 (a additionné les deux nombres, 3 × 4 → 7), M2 (une rangée de trop ou de moins, 3 × 4 → 8 ou
//    16, ou une colonne : 9 ou 15), sinon « autre ».
const range = (a, b) => { const out = []; for (let v = a; v <= b; v++) out.push(v); return out; };
const uniq = (xs) => [...new Map(xs.map((x) => [`${x.a}x${x.b}`, x])).values()];
const fact = (a, b) => ({ a, b, n: a * b, op: "×" });
// les faits d'une table, dans les deux sens (2 × 7 et 7 × 2), de 1 à 10
export const tableFacts = (t) => uniq(range(1, 10).flatMap((k) => [fact(t, k), fact(k, t)]));
export function multsOf(cfg) {
  switch (cfg.type) {
    case "groupes": return range(...cfg.rangees).flatMap((a) => range(...cfg.parRangee).map((b) => fact(a, b)));
    // tourner : une multiplication et son tour (3 × 4 est donnée, on demande 4 × 3) ; jamais un carré (3 × 3 ne tourne pas)
    case "tourner": return range(...cfg.rangees).flatMap((a) => range(...cfg.parRangee).filter((b) => b !== a).map((b) => fact(b, a)));
    case "table": return tableFacts(cfg.table);
    case "tables": return uniq(cfg.tables.flatMap(tableFacts));
    default: return [];
  }
}
// toutes les multiplications que l'application peut poser (la voix en fabrique les phrases)
export const allMults = (c) => uniq(c.niveaux.flatMap(multsOf));
export const multKey = (q) => `${q.forme ?? "directe"}:${q.a}x${q.b}`;
export const multAnswer = (q) => (q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.a * q.b);
export function makeMult(cfg, rnd, { eviter = [] } = {}) {
  const all = multsOf(cfg), pool = all.filter((x) => !eviter.includes(`${x.a}x${x.b}`)), list = pool.length ? pool : all;
  const x = list[Math.floor(rnd() * list.length)];
  return { ...x, module: 5, type: cfg.type, niveau: cfg.niveau, forme: "directe", ...(cfg.table ? { table: cfg.table } : {}), ...(cfg.type === "tourner" ? { tour: { a: x.b, b: x.a } } : {}), ...(cfg.type === "groupes" && cfg.ecriture === "addition" ? { addition: true } : {}) };
}
export function classifyMult(q, v) {
  if (v === multAnswer(q)) return null;
  if (v === null || v === undefined || (q.forme && q.forme !== "directe")) return "autre";
  const { a, b } = q, n = a * b;
  if (v === a + b && !(a === 2 && b === 2)) return "M1";
  if (v === n + b || v === n - b || v === n + a || v === n - a) return "M2";
  return "autre";
}
// la question telle que le parent la lira (et l'ardoise l'écrit)
export const multQuestion = (q) => (q.forme === "trouDroite" ? `${q.a} × ? = ${q.n}` : q.forme === "trouGauche" ? `? × ${q.b} = ${q.n}` : q.addition ? `${Array(q.a).fill(q.b).join(" + ")}` : `${q.a} × ${q.b}`);
// l'astuce d'une table, dite avant de compter les rangées (le lien avec les doubles et les moitiés : fois 2, c'est le double ;
// fois 4, le double du double ; fois 5, la moitié de fois 10 ; fois 10, des dizaines) : la table du niveau, sinon le premier
// facteur qui en a une ; aux niveaux des rangées (1, 2, tourner), aucune
export const ASTUCES = [2, 10, 5, 4];
export const astuceOf = (q) => (q.type === "table" || q.type === "tables" ? (q.table && ASTUCES.includes(q.table) ? q.table : ASTUCES.find((t) => q.a === t || q.b === t)) ?? null : null);
// le niveau est-il ouvert (« jouer ») ? les niveaux de `debloque.niveaux` sont acquis
export const multUnlocked = (cfg, acquis) => (cfg.debloque?.niveaux ?? []).every((n) => acquis.includes(n));
