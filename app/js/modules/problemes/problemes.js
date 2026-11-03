// MODULE 7 · LES PROBLÈMES, FONCTIONS PURES (lot « Problèmes », docs/SPEC.md, section 7 quinquies ; la banque :
// content/problemes.json, contrôlée par art/problemes/verifier.mjs et tests/unit/problemes-banque.test.mjs). Testées par
// tests/unit/problemes.test.mjs.
//  - LES ÉTIQUETTES : une par donnée de l'énoncé (le nombre et l'objet dessiné), dans l'ordre où elles sont dites, chacune avec la
//    phrase qui la dit (elle s'allume quand cette phrase est dite ; la toucher redit cette phrase) ; aux groupes égaux, le nombre de
//    groupes n'a pas d'objet (le contenant viendra avec les objets) ; au partage, le nombre de parts non plus ;
//  - LE CLASSEMENT DES ERREURS (P1 à P4, docs/LOTS.md, fiche 20) : P4 (deux étapes : la réponse de la première), P2 (un nombre
//    de l'énoncé redit), P1 (la mauvaise opération : ajouter au lieu d'enlever, ou l'inverse ; multiplier au lieu d'ajouter), P3
//    (la bonne opération, une erreur de compte à 1 ou à 10 près), sinon « autre » ; « je ne sais pas » : NSP ;
//  - LE CRAN « TRÈS DUR » : les énoncés des mêmes structures, une difficulté au-dessus (au niveau 2, ceux du niveau 6 de même
//    structure) ; là où il n'y en a pas, les plus difficiles du niveau.

// la clé d'une structure (la transformation selon son sens et ce qui est inconnu)
export const structureDe = (e) => (e.structure === "transformation" ? `transformation/${e.sens}/${e.inconnue}` : e.inconnue ? `${e.structure}/${e.inconnue}` : e.structure);
// les données dites, dans l'ordre du calcul (deux étapes : les nombres des deux opérations, sans le résultat de la première)
export const donneesDe = (e) => (e.structure === "deux-etapes" ? e.operations.flatMap(([, a, b]) => [a, b]).filter((n) => n !== "_") : e.donnees);
// l'aide après une erreur : « barres », « comparaison », « groupes » (groupes égaux, partage) ou « etapes » (deux schémas)
export const aideDe = (e) => (e.structure === "deux-etapes" ? "etapes" : e.comparaison ? "comparaison" : e.groupes ? "groupes" : "barres");
const mot = (n) => new RegExp(`(^|[^0-9])${n}([^0-9]|$)`);
// les étiquettes : [{ n, objet, phrase }] ; `phrase` : l'indice de la phrase de l'énoncé qui dit le nombre (la première à partir
// de celle de l'étiquette précédente ; un nombre qui n'est pas dit, « entre toi et ton copain » : la dernière phrase)
export function etiquettes(e) {
  const D = donneesDe(e), out = []; let from = 0;
  D.forEach((n, i) => {
    let p = e.enonce.findIndex((s, j) => j >= from && mot(n).test(s));
    if (p < 0) p = e.enonce.findIndex((s) => mot(n).test(s));
    if (p < 0) p = e.enonce.length - 1;
    from = p;
    const sansObjet = (e.structure === "groupes-egaux" && i === 0) || (e.structure === "partage" && i === 1 && e.inconnue === "part");
    out.push({ n, objet: sansObjet ? null : e.objet, phrase: p });
  });
  return out;
}
// les opérations du calcul juste [signe, a, b, résultat] (comme art/problemes/verifier.mjs, `etapes`)
const op = (o, x, y) => (o === "+" ? x + y : o === "−" ? x - y : o === "×" ? x * y : x / y);
export function operations(e) {
  const [x, y] = e.donnees ?? [];
  if (e.structure === "deux-etapes") { let p = null; return e.operations.map(([o, a, b]) => { const A = a === "_" ? p : a, B = b === "_" ? p : b; p = op(o, A, B); return [o, A, B, p]; }); }
  if (e.structure === "groupes-egaux") return [["×", x, y, x * y]];
  if (e.structure === "partage") return [["÷", x, y, x / y]];
  if (e.structure === "transformation") {
    const L = { "gain/fin": ["+", x, y], "perte/fin": ["−", x, y], "gain/changement": ["−", y, x], "perte/changement": ["−", x, y], "gain/debut": ["−", y, x], "perte/debut": ["+", y, x] }[`${e.sens}/${e.inconnue}`];
    return [[...L, op(...L)]];
  }
  if (e.structure === "comparaison") { const L = e.inconnue === "ecart" ? ["−", Math.max(x, y), Math.min(x, y)] : e.inconnue === "grand" ? ["+", x, y] : ["−", x, y]; return [[...L, op(...L)]]; }
  const L = e.inconnue === "tout" ? ["+", x, y] : ["−", x, y];
  return [[...L, op(...L)]];
}
// ce qu'aurait donné la mauvaise opération (ajouter au lieu d'enlever, et l'inverse ; ajouter au lieu de grouper ou de partager)
const contraires = ([o, a, b]) => (o === "+" ? [Math.abs(a - b)] : o === "−" ? [a + b] : o === "×" ? [a + b] : [a - b, a + b]);
export function classer(e, v, nsp = false) {
  if (nsp) return "NSP";
  if (v === e.reponse) return null;
  const O = operations(e), D = donneesDe(e);
  if (e.structure === "deux-etapes" && v === O[0][3]) return "P4";
  if (D.includes(v)) return "P2";
  // la mauvaise opération : à la dernière étape (deux étapes : à l'une ou l'autre, la suite calculée juste)
  const mauvaises = new Set(contraires(O.at(-1)));
  if (O.length === 2) { const [o2, , b2] = O[1], r1 = contraires(O[0]); for (const r of r1) { const A = O[1][1] === O[0][3] ? r : O[1][1], B = O[1][2] === O[0][3] ? r : b2; mauvaises.add(op(o2, A, B)); } }
  if (mauvaises.has(v)) return "P1";
  if ([1, 10].includes(Math.abs(v - e.reponse))) return "P3";
  return "autre";
}
// le calcul écrit sur la plaque (« 23 − 9 = 14 » ; deux étapes : les deux, l'un après l'autre)
export const calculDe = (e) => e.calcul.split(" ; ");
// la réponse attendue
export const reponseDe = (e) => e.reponse;

// les énoncés d'un niveau, au cran « très dur » : ceux des mêmes structures une difficulté au-dessus, sinon les plus difficiles
export function poolTresDur(banque, niveau) {
  const L = banque.filter((e) => e.niveau === niveau);
  if (!L.length) return [];
  const S = new Set(L.map(structureDe)), dmax = Math.max(...L.map((e) => e.difficulte));
  const dessus = banque.filter((e) => S.has(structureDe(e)) && e.difficulte === dmax + 1);
  return dessus.length ? dessus : L.filter((e) => e.difficulte === dmax);
}
// les objets d'une donnée, au cran « plus facile » : jusqu'à `max`, un à un ; au-delà, des paquets de dix et les objets seuls
export const enObjets = (n, max = 20) => (n <= max ? { dizaines: 0, unites: n } : { dizaines: Math.floor(n / 10), unites: n % 10 });
