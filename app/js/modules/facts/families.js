// MODULE 2 · LES FAMILLES (lot 2, étape 6 ; docs/SPEC-LOT2.md, section 3), fonctions pures sur l'état du
// module 2 (magasin « niveaux », clé module 2) et les faits (magasin « faits »).
//  - ouvertes : les familles ouvertes ; au départ celles de `famillesActives` (1 et 2). La famille suivante
//    s'ouvre quand 80 % des faits déjà introduits sont en boîte 2 ou plus, ou quand le parent la marque connue
//    (point de départ) ; une famille sans fait nouveau à introduire s'ouvre de la même façon (elle a des faits
//    à pratiquer). Une famille à la fois, au plus une par séance (`seance`) ;
//  - acquise : 80 % des faits de sa RÈGLE en boîte 3 ou plus (les amis de 10 comptent 9 + 1, 8 + 2 et 5 + 5,
//    déjà rencontrés dans les familles 1 et 2) ; une famille acquise est un niveau franchi (une étoile
//    arc-en-ciel), sauf si c'est le parent qui l'a marquée connue ;
//  - trou : les formes à trou s'ouvrent pour une famille quand la moitié des faits de sa règle atteignent la
//    boîte 3 ; c'est définitif (des erreurs qui font redescendre des faits ne les referment pas) ;
//  - famille en cours (notion du jour) : la plus basse des familles ouvertes pas encore acquise ; quand toutes
//    le sont, la famille 7 (mélange).
import { catalog, familyOf, ruleFacts } from "./facts.js";

export const initialFamilies = (c, now = Date.now()) => ({ module: 2, ouvertes: [...c.famillesActives], ouvertures: c.famillesActives.map((id) => ({ famille: id, date: now })), acquises: [], trou: [], notion: [], lecons: [] });
export const cfgOf = (c) => ({ ouverture: { part: 0.8, boite: 2 }, acquise: { part: 0.8, boite: 3 }, trou: { part: 0.5, boite: 3 }, ...(c.familles2 ?? {}) });
// le contenu avec les familles ouvertes (ce que lisent le plan de l'échauffement et `pool`)
export const withOpen = (c, st) => ({ ...c, famillesActives: st?.ouvertes ?? c.famillesActives });
const byKey = (faits) => new Map(faits.map((f) => [f.fait, f]));
// part des faits de la règle de la famille en boîte `boite` ou plus
export function ruleShare(c, faits, id, boite) {
  const rule = ruleFacts(c, id), m = byKey(faits);
  return rule.length ? rule.filter((r) => (m.get(r.fait)?.boite ?? 0) >= boite).length / rule.length : 0;
}
export const isAcquired = (c, faits, id) => { const k = cfgOf(c).acquise; return ruleShare(c, faits, id, k.boite) >= k.part - 1e-9; };
// la famille suivante peut-elle s'ouvrir ? (80 % des faits introduits en boîte 2 ou plus)
export function canOpenNext(c, st, faits) {
  const next = c.familles.find((f) => !st.ouvertes.includes(f.id));
  if (!next) return null;
  const k = cfgOf(c).ouverture, met = faits.filter((f) => f.boite);
  return met.length && met.filter((f) => f.boite >= k.boite).length >= k.part * met.length - 1e-9 ? next.id : null;
}
// met l'état à jour ; renvoie { st, events } : { type: "ouverte" | "acquise" | "trou", famille, parent? }
// `parent` : un changement dû au point de départ du parent (noté comme tel, ne rapporte rien)
export function updateFamilies(c, st0, faits, now = Date.now(), { parent = false, seance = null, open = true } = {}) {
  const st = structuredClone(st0), events = [], K = cfgOf(c);
  for (const id of st.ouvertes) {
    if (!st.acquises.includes(id) && isAcquired(c, faits, id)) { st.acquises.push(id); (st.obtenus ??= []).push({ famille: id, date: now, ...(parent ? { parent: true } : {}) }); events.push({ type: "acquise", famille: id, ...(parent ? { parent: true } : {}) }); }
    if (!st.trou.includes(id) && ruleShare(c, faits, id, K.trou.boite) >= K.trou.part - 1e-9) { st.trou.push(id); events.push({ type: "trou", famille: id }); }
  }
  const next = !open || (seance != null && st.ouvertures.at(-1)?.seance === seance) ? null : canOpenNext(c, st, faits);
  if (next) { st.ouvertes.push(next); st.ouvertures.push({ famille: next, date: now, ...(parent ? { parent: true } : {}), ...(seance != null ? { seance } : {}) }); events.push({ type: "ouverte", famille: next }); }
  return { st, events };
}
// la famille en cours : la plus basse ouverte pas encore acquise, sinon la dernière (le mélange)
export function currentFamily(c, st) {
  const open = c.familles.filter((f) => st.ouvertes.includes(f.id));
  return (open.find((f) => !st.acquises.includes(f.id) && f.regle !== "melange") ?? (st.ouvertes.includes(c.familles.at(-1).id) ? c.familles.at(-1) : open.at(-1))).id;
}
// les familles dont le fait (a, b) relève de la règle (un fait peut relever de plusieurs)
export const familiesOfFact = (c, a, b) => c.familles.filter((f) => ruleFacts(c, f.id).some((r) => r.a === a && r.b === b)).map((f) => f.id);
// les formes à trou sont-elles ouvertes pour ce fait ? (une famille de sa règle les a ouvertes ; pas le mélange)
export const trouOpenFor = (c, st, a, b) => familiesOfFact(c, a, b).some((id) => st.trou.includes(id) && familyOf(c, id)?.regle !== "melange");
// le module 2 a-t-il quelque chose à proposer en notion du jour ? (au moins une famille ouverte avec des faits)
export const hasSomething = (c, st) => (st?.ouvertes ?? c.famillesActives).some((id) => ruleFacts(c, id).length);
export { catalog };
