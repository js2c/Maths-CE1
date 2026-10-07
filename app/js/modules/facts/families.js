// MODULE 2 · LES FAMILLES (lot 2, étape 6 ; docs/SPEC-LOT2.md, section 3), fonctions pures sur l'état du
// module 2 (magasin « niveaux », clé module 2) et les faits (magasin « faits »).
//  - ouvertes : les familles ouvertes ; au départ celles de `famillesActives` (1 et 2). La famille suivante
//    s'ouvre quand 80 % des faits déjà introduits sont en boîte 2 ou plus, ou quand le parent la marque connue
//    (point de départ) ; une famille sans fait nouveau à introduire s'ouvre de la même façon (elle a des faits
//    à pratiquer). Une famille à la fois ; lot « Correctifs » (écart 6.2, décision du parent du 6 octobre 2026) : au
//    plus une par jour, toutes voies confondues (notion du jour, échauffement, stagnation : `openedToday`) ; seuls le
//    choix (écran « choisir ») et le point de départ du parent y échappent (ils ouvrent quand même, et comptent pour le
//    jour) ;
//  - acquise : 80 % des faits de sa RÈGLE en boîte 3 ou plus (les amis de 10 comptent 9 + 1, 8 + 2 et 5 + 5,
//    déjà rencontrés dans les familles 1 et 2) ; une famille acquise est un niveau franchi (une étoile
//    arc-en-ciel), sauf si c'est le parent qui l'a marquée connue ;
//  - trou : les formes à trou s'ouvrent pour une famille quand la moitié des faits de sa règle atteignent la
//    boîte 3 ; c'est définitif (des erreurs qui font redescendre des faits ne les referment pas) ;
//  - famille en cours (notion du jour) : la plus basse des familles ouvertes pas encore acquise ni dépassée ;
//    quand toutes le sont, la famille 7 (mélange) ;
//  - stagnation (décision du parent du 27 septembre ; `familles2.stagnation`) : une famille pas acquise après
//    6 séances où elle était la notion du jour est « dépassée » : la suivante devient la famille en cours (elle
//    s'ouvre si besoin, et joue sa leçon à sa première notion du jour) ; la famille dépassée reste travaillée en
//    révision (échauffement, autres familles de la notion du jour) et peut encore être acquise. Si une famille s'est déjà
//    ouverte ce jour-là, l'ouverture attend la séance suivante d'un autre jour (`ouvertureEnAttente`, `openPending`).
import { catalog, familyOf, median, ruleFacts, startOfDay } from "./facts.js";

export const initialFamilies = (c, now = Date.now()) => ({ module: 2, ouvertes: [...c.famillesActives], ouvertures: c.famillesActives.map((id) => ({ famille: id, date: now })), acquises: [], trou: [], notion: [], lecons: [] });
export const cfgOf = (c) => ({ ouverture: { part: 0.8, boite: 2, parJour: 1 }, acquise: { part: 0.8, boite: 3 }, trou: { part: 0.5, boite: 3 }, stagnation: { seances: 6 }, ...(c.familles2 ?? {}) });
// le contenu avec les familles ouvertes (ce que lisent le plan de l'échauffement et `pool`)
export const withOpen = (c, st) => ({ ...c, famillesActives: st?.ouvertes ?? c.famillesActives });
const byKey = (faits) => new Map(faits.map((f) => [f.fait, f]));
// part des faits de la règle de la famille en boîte `boite` ou plus
export function ruleShare(c, faits, id, boite) {
  const rule = ruleFacts(c, id), m = byKey(faits);
  return rule.length ? rule.filter((r) => (m.get(r.fait)?.boite ?? 0) >= boite).length / rule.length : 0;
}
// lot 3 bis (docs/SPEC-LOT3BIS.md, A1) : une famille est acquise quand `part` (80 %) des faits de sa règle sont en boîte
// `boite` (3) ou plus ET, pour les familles de `trouFamilles` (3 à 5), chacun de ces faits a été réussi au moins une fois
// à une forme à trou ; ces réussites (les réussites à trou pour les familles 3 à 5, toutes les réussites sinon) sont
// réparties sur au moins `jours` (2) jours différents : la voie rapide ne peut plus faire acquérir une famille en une
// seule séance. `parent` : le point de départ du parent (la règle des boîtes seule).
export function isAcquired(c, faits, id, { parent = false } = {}) {
  const k = cfgOf(c).acquise;
  if (parent || !(k.jours || k.trouFamilles)) return ruleShare(c, faits, id, k.boite) >= k.part - 1e-9;
  const rule = ruleFacts(c, id), m = byKey(faits), trou = (k.trouFamilles ?? []).includes(id);
  const wins = (f) => (f.historique ?? []).filter((h) => h.parent || (h.juste && (!trou || (h.forme && h.forme !== "directe"))));
  const ok = rule.map((r) => m.get(r.fait)).filter((f) => f && (f.boite ?? 0) >= k.boite && wins(f).length);
  if (!rule.length || ok.length < k.part * rule.length - 1e-9) return false;
  // (les faits marqués connus par le parent ne comptent pas pour les jours)
  const kid = ok.filter((f) => !wins(f).some((h) => h.parent));
  return !kid.length || new Set(kid.flatMap((f) => wins(f).map((h) => startOfDay(h.t)))).size >= (k.jours ?? 1);
}
// lot « Correctifs » (écart 6.2) : les familles ouvertes le jour de `now`, toutes voies confondues (les familles ouvertes
// au départ, `famillesActives`, ne sont pas des ouvertures) ; `openedToday` : la limite du jour (`ouverture.parJour`, 1)
// est-elle atteinte ?
export const openingsOfDay = (c, st, now) => (st.ouvertures ?? []).filter((o) => !c.famillesActives.includes(o.famille) && startOfDay(o.date) === startOfDay(now));
export const openedToday = (c, st, now) => openingsOfDay(c, st, now).length >= (cfgOf(c).ouverture.parJour ?? 1);
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
    if (!st.acquises.includes(id) && isAcquired(c, faits, id, { parent })) { st.acquises.push(id); (st.obtenus ??= []).push({ famille: id, date: now, ...(parent ? { parent: true } : {}) }); events.push({ type: "acquise", famille: id, ...(parent ? { parent: true } : {}) }); }
    if (!st.trou.includes(id) && ruleShare(c, faits, id, K.trou.boite) >= K.trou.part - 1e-9) { st.trou.push(id); events.push({ type: "trou", famille: id }); }
  }
  const next = !open || openedToday(c, st, now) ? null : canOpenNext(c, st, faits);
  if (next) { st.ouvertes.push(next); st.ouvertures.push({ famille: next, date: now, ...(parent ? { parent: true } : {}), ...(seance != null ? { seance } : {}) }); events.push({ type: "ouverte", famille: next }); }
  return { st, events };
}
// LOT 3 TER (docs/SPEC-LOT3TER.md, T2 ; décision du parent) : L'ÉCHAUFFEMENT S'AJUSTE SEUL. À la fin d'un échauffement de
// séance, la famille suivante (dans l'ordre des familles) s'ouvre si (réglages module2.json, `familles2.echauffement`) :
//  1. tous les faits des familles ouvertes ont été introduits, et au moins `part` (80 %) d'entre eux sont en boîte `boite`
//     (2) ou plus ;
//  2. sur les `dernieres` (12) dernières réponses d'échauffement portant sur les familles ouvertes, au moins `justes` (90 %)
//     sont justes (sans aide), et leur temps médian est sous le seuil « rapide » (`limitMs`, celui de la voie rapide) ;
//  3. aucune famille ne s'est ouverte le même jour, par quelque voie que ce soit (lot « Correctifs », écart 6.2 : jusque-là,
//     seules les ouvertures par l'échauffement comptaient ; `ouverture.parJour`, 1).
// Elle est ensuite une famille ouverte comme les autres (notée `echauffement: true` dans les ouvertures) ; aucune leçon
// n'est imposée ; pas de fermeture automatique. `reponses` : le magasin « reponses » (ou une partie, la plus récente).
// Renvoie { famille (ou null), conditions: [1, 2, 3 remplies ?], mesures } : la simulation et les tests lisent le détail.
export const warmupCfg = (c) => ({ part: 0.8, boite: 2, dernieres: 12, justes: 0.9, ...(c.familles2?.echauffement ?? {}) });
// une réponse est-elle une réponse d'échauffement ? (ni notion du jour, ni défi, ni entraînement libre, ni temps de base)
export const isWarmupAnswer = (r) => r.module === 2 && !r.notion && !r.defi && !r.libre && !r.guide && r.forme !== "base";
// le fait d'une réponse : `fait` (depuis le lot 3 ter), sinon relu dans la question (« 3 + 4 », « 3 + ? = 7 », « ? + 4 = 7 »)
export function answerFact(r) {
  if (r.fait) return r.fait;
  const m = /^(\?|\d+) \+ (\?|\d+)(?: = (\d+))?$/.exec(r.question ?? "");
  if (!m) return null;
  const n = Number(m[3]), a = m[1] === "?" ? n - Number(m[2]) : Number(m[1]), b = m[2] === "?" ? n - Number(m[1]) : Number(m[2]);
  return `${a}+${b}`;
}
export function warmupOpening(c, st, faits, reponses, now, { limitMs = Infinity } = {}) {
  const K = warmupCfg(c), next = c.familles.find((f) => !st.ouvertes.includes(f.id)) ?? null;
  const cat = catalog(c), famOf = new Map(cat.map((f) => [f.fait, f.famille])), open = cat.filter((f) => st.ouvertes.includes(f.famille));
  const by = byKey(faits), met = open.filter((f) => by.get(f.fait)?.boite);
  const part = open.length ? met.filter((f) => by.get(f.fait).boite >= K.boite).length / open.length : 0;
  const c1 = met.length === open.length && part >= K.part - 1e-9;
  const last = reponses.filter((r) => isWarmupAnswer(r) && st.ouvertes.includes(famOf.get(answerFact(r)))).sort((x, y) => x.t - y.t).slice(-K.dernieres);
  const justes = last.length ? last.filter((r) => r.juste && !r.aide).length / last.length : 0, med = median(last.map((r) => r.tempsMs)) ?? Infinity;
  const c2 = last.length >= K.dernieres && justes >= K.justes - 1e-9 && med < limitMs;
  const c3 = !openedToday(c, st, now);
  return { famille: next && c1 && c2 && c3 ? next.id : null, conditions: [c1, c2, c3], mesures: { introduits: met.length, faits: open.length, part, reponses: last.length, justes, medianeMs: med, limitMs } };
}
// la famille ouverte par l'échauffement, rangée dans l'état (une ouverture comme les autres, marquée `echauffement`)
export function openByWarmup(st0, id, now, seance = null) {
  const st = structuredClone(st0);
  st.ouvertes.push(id); st.ouvertures.push({ famille: id, date: now, echauffement: true, ...(seance != null ? { seance } : {}) });
  return st;
}
// la famille en cours : la plus basse ouverte pas encore acquise ni dépassée, sinon la dernière (le mélange)
const passed = (st) => (st.depassees ?? []).map((d) => d.famille);
const firstLive = (c, st) => c.familles.find((f) => st.ouvertes.includes(f.id) && !st.acquises.includes(f.id) && !passed(st).includes(f.id) && f.regle !== "melange") ?? null;
export function currentFamily(c, st) {
  const open = c.familles.filter((f) => st.ouvertes.includes(f.id));
  return (firstLive(c, st) ?? (st.ouvertes.includes(c.familles.at(-1).id) ? c.familles.at(-1) : open.at(-1))).id;
}
// fin d'une séance dont la notion du jour était la famille `id` : on compte la séance ; au seuil, si elle n'est
// toujours pas acquise, elle est dépassée et la famille suivante s'ouvre (si aucune autre ne peut prendre la
// relève) ; renvoie { st, events } ({ type: "depassee", famille }, { type: "ouverte", famille, stagnation })
export function noteNotion(c, st0, id, now = Date.now(), { seance = null } = {}) {
  const st = structuredClone(st0), events = [], N = cfgOf(c).stagnation?.seances;
  st.seancesNotion = { ...(st.seancesNotion ?? {}), [id]: (st.seancesNotion?.[id] ?? 0) + 1 };
  const f = familyOf(c, id);
  if (!N || !f || f.regle === "melange" || st.acquises.includes(id) || passed(st).includes(id) || st.seancesNotion[id] < N) return { st, events };
  (st.depassees ??= []).push({ famille: id, date: now, ...(seance != null ? { seance } : {}) }); events.push({ type: "depassee", famille: id });
  if (!firstLive(c, st) && c.familles.some((x) => !st.ouvertes.includes(x.id))) {
    // (lot « Correctifs », écart 6.2 : une famille déjà ouverte aujourd'hui, l'ouverture attend un autre jour)
    st.ouvertureEnAttente = { stagnation: true, date: now };
    const o = openPending(c, st, now, { seance }); events.push(...o.events); return { st: o.st, events };
  }
  return { st, events };
}
// lot « Correctifs » (écart 6.2) : l'ouverture due à la stagnation qui attendait un autre jour ; à la fin de la séance où
// la famille est dépassée, puis au début de chaque séance d'additions (runner.js, load). Abandonnée si une famille est
// redevenue « en cours » entre-temps (ouverte par l'échauffement ou par le choix, par exemple).
export function openPending(c, st0, now = Date.now(), { seance = null } = {}) {
  if (!st0.ouvertureEnAttente) return { st: st0, events: [] };
  const next = c.familles.find((x) => !st0.ouvertes.includes(x.id));
  if (next && !firstLive(c, st0) && openedToday(c, st0, now)) return { st: st0, events: [] };
  const st = structuredClone(st0); delete st.ouvertureEnAttente;
  if (!next || firstLive(c, st)) return { st, events: [] };
  st.ouvertes.push(next.id); st.ouvertures.push({ famille: next.id, date: now, stagnation: true, ...(seance != null ? { seance } : {}) });
  return { st, events: [{ type: "ouverte", famille: next.id, stagnation: true }] };
}
// lot 3 : une famille choisie par l'enfant (écran « choisir ») s'ouvre si elle ne l'était pas ; notée `choix` dans les
// ouvertures, elle ne rapporte rien (ce n'est pas une famille acquise)
export function openChosen(st0, id, now = Date.now(), seance = null) {
  if (st0.ouvertes.includes(id)) return st0;
  const st = structuredClone(st0);
  st.ouvertes.push(id); st.ouvertures.push({ famille: id, date: now, choix: true, ...(seance != null ? { seance } : {}) });
  return st;
}
// les familles dont le fait (a, b) relève de la règle (un fait peut relever de plusieurs)
export const familiesOfFact = (c, a, b) => c.familles.filter((f) => ruleFacts(c, f.id).some((r) => r.a === a && r.b === b)).map((f) => f.id);
// les formes à trou sont-elles ouvertes pour ce fait ? (une famille de sa règle les a ouvertes ; pas le mélange)
export const trouOpenFor = (c, st, a, b) => familiesOfFact(c, a, b).some((id) => st.trou.includes(id) && familyOf(c, id)?.regle !== "melange");
// le module 2 a-t-il quelque chose à proposer en notion du jour ? (au moins une famille ouverte avec des faits)
export const hasSomething = (c, st) => (st?.ouvertes ?? c.famillesActives).some((id) => ruleFacts(c, id).length);
export { catalog };
