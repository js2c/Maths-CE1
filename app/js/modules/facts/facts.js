// MODULE 2 · LES FAITS D'ADDITION (docs/SPEC.md, « Module 2 »), la partie sans écran : le catalogue des
// faits, la révision espacée en 5 boîtes, le seuil « rapide » et le plan d'un échauffement.
// Fonctions pures, ou presque (le magasin « faits » est lu et écrit par Warmup) ; l'heure est injectée.
//  - un fait est une addition ordonnée « a+b » (a, b >= 1, a + b <= 10) : 3+1 et 1+3 sont deux faits ;
//  - boîte 1 : revient à chaque séance ; 2, 3, 4, 5 : dans 2, 4, 8, 15 jours (content/module2.json) ;
//  - juste et rapide : boîte suivante ; juste mais lent : reste ; faux : boîte 1 ; juste avec l'aide : reste ;
//  - lot 2 (docs/SPEC-LOT2.md, section 3) : places réservées aux faits nouveaux (3), même quand les faits dus
//    remplissent la liste (les dus en trop attendent, les plus en retard d'abord), dans la limite de la
//    boîte 1 (8 faits) et de la limite commune de la séance (6 faits nouveaux) ; voie rapide : un fait
//    rencontré pour la première fois, juste, rapide et sans aide entre en boîte 3 ; une boîte au plus par
//    séance (un fait déjà monté dans la séance ne peut plus que redescendre) ;
//  - rapide : temps de réponse < temps de base + 4 s (3 s quand la moitié des faits rencontrés sont en
//    boîte 3 ou plus). Le temps de base est la médiane des réponses à des questions triviales (« 4 + 0 »).
export const DAY = 86400000;
export const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
export const key = (a, b) => `${a}+${b}`;

// les règles des familles : un fait (a, b) en fait-il partie ?
// (lot 2, étape 6 : familles 3 à 7 ; docs/SPEC-LOT2.md, section 3)
export const RULES = {
  plus1ou2: (a, b) => Math.min(a, b) <= 2,
  doubles: (a, b) => a === b && a <= 5,
  amis10: (a, b) => a + b === 10,
  maisons567: (a, b) => a + b >= 5 && a + b <= 7,
  maisons89: (a, b) => a + b === 8 || a + b === 9,
  presqueDoubles: (a, b) => Math.abs(a - b) === 1 && Math.max(a, b) <= 5,
  melange: () => true,
};
// l'appui visuel qui montre le mieux un fait (aide du coquillage, correction, exemple guidé) : le plus
// parlant d'abord (ami de 10, double, presque-double), puis les sauts pour + 1 et + 2, sinon la maison
export const aidFor = (a, b) => (a + b === 10 ? "cadre" : a === b && a <= 5 ? "reflet" : Math.abs(a - b) === 1 && Math.max(a, b) <= 5 ? "doublePlus" : Math.min(a, b) <= 2 ? "ligne" : "maison");
// le catalogue, dans l'ordre d'apprentissage : famille par famille ; dans une famille, du plus petit
// total au plus grand, + 1 avant + 2, le grand nombre d'abord (on part du grand et on fait 1 ou 2 sauts)
export function catalog(c) {
  const out = [], seen = new Set();
  for (const fam of c.familles) {
    const list = [];
    for (let a = 1; a < c.sommeMax; a++) for (let b = 1; a + b <= c.sommeMax; b++) if (RULES[fam.regle](a, b) && !seen.has(key(a, b))) list.push({ fait: key(a, b), a, b, famille: fam.id });
    list.sort((x, y) => Math.min(x.a, x.b) - Math.min(y.a, y.b) || x.a + x.b - (y.a + y.b) || y.a - x.a);
    list.forEach((f) => seen.add(f.fait)); out.push(...list);
  }
  return out;
}
export const familyOf = (c, id) => c.familles.find((f) => f.id === id);
// les faits qui relèvent de la règle d'une famille (lot 2 : la pratique d'une famille, et le « point de départ »
// du parent), même ceux déjà rencontrés dans une famille précédente
export function ruleFacts(c, id) {
  const fam = familyOf(c, id), out = [];
  if (!fam || !RULES[fam.regle]) return out;
  for (let a = 1; a < c.sommeMax; a++) for (let b = 1; a + b <= c.sommeMax; b++) if (RULES[fam.regle](a, b)) out.push({ fait: key(a, b), a, b });
  return out;
}
export const median = (xs) => { if (!xs.length) return null; const s = [...xs].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// le seuil « rapide », en ms
export function threshold(c, baseMs, facts) {
  const met = facts.filter((f) => f.boite), advanced = met.length > 0 && met.filter((f) => f.boite >= 3).length * 2 >= met.length;
  return baseMs + (advanced ? c.seuilAvanceS : c.seuilS) * 1000;
}
// le fait après une réponse : { juste, ms, aide, anticipe, seance, forme } -> nouvel état
// voie rapide : première rencontre (historique vide), juste, rapide, sans aide -> boîte c.voieRapide.boite ;
// `montee` garde la séance où le fait est monté pour la dernière fois (une boîte au plus par séance)
export function afterFact(c, f0, r, limitMs, now) {
  const first = !(f0.historique ?? []).length;
  const f = { ...f0, historique: [...(f0.historique ?? []), { t: now, juste: !!r.juste, ms: r.ms, aide: !!r.aide, boite: f0.boite, ...(r.forme && r.forme !== "directe" ? { forme: r.forme } : {}) }] };
  const rapide = r.juste && r.ms < limitMs, dejaMonte = r.seance != null && f0.montee === r.seance;
  if (!r.juste) f.boite = 1;
  else if (rapide && !r.aide && !r.anticipe && !dejaMonte) {
    f.boite = first && c.voieRapide ? Math.max(f.boite, c.voieRapide.boite) : Math.min(5, f.boite + 1);
    if (r.seance != null) f.montee = r.seance;
    if (first && c.voieRapide) f.historique.at(-1).voieRapide = true;
  }
  f.prochain = startOfDay(now) + c.boites[f.boite - 1] * DAY;
  f.tempsMedian = median(f.historique.filter((h) => h.juste).map((h) => h.ms));
  f.historique.at(-1).rapide = rapide; f.historique.at(-1).apres = f.boite;
  return f;
}
// les faits que l'échauffement peut poser : ceux des familles actives, plus (cran « très dur ») ceux de la
// famille suivante même si elle n'est pas encore ouverte
export function pool(c, { familleSuivante = false } = {}) {
  const act = new Set(c.famillesActives), next = familleSuivante ? c.familles.find((f) => !act.has(f.id)) : null;
  if (next) act.add(next.id);
  return catalog(c).filter((f) => act.has(f.famille));
}
// combien de faits nouveaux peuvent encore entrer : la limite commune de la séance et la boîte 1
export function roomForNew(c, stored, dejaNouveaux = 0) {
  const box1 = stored.filter((f) => f.boite === 1).length;
  return Math.max(0, Math.min((c.nouveauxMaxSeance ?? c.nouveauxMax) - dejaNouveaux, c.boite1Max - box1));
}
// le plan d'un échauffement (lot 2) : `reservees` places pour des faits nouveaux (3, plus le bonus du cran)
// tant qu'il en reste à introduire et que la boîte 1 et la limite de la séance le permettent ; le reste
// pour les faits dus, les plus en retard d'abord (les dus en trop attendent la séance suivante) ; s'il
// manque des questions pour atteindre `min` : d'autres faits nouveaux (mêmes limites), puis des faits déjà
// rencontrés pas encore dus (révision en avance, sans montée de boîte), enfin un second passage des faits
// de la boîte 1.
// o : { nouveaux (false : pas de place réservée, cran « plus facile »), complementMax, enPlus (faits nouveaux de plus),
//       dejaNouveaux (déjà introduits dans la séance), familleSuivante }
export function plan(c, stored, now, n, min, o = {}) {
  const cat = pool(c, o), byKey = new Map(stored.map((f) => [f.fait, f]));
  const known = cat.filter((f) => byKey.has(f.fait)).map((f) => byKey.get(f.fait));
  const fresh = cat.filter((x) => !byKey.has(x.fait));
  const nNew = o.nouveaux === false ? 0 : Math.min((c.placesReservees ?? c.nouveauxMax) + (o.enPlus ?? 0), fresh.length, roomForNew(c, stored, o.dejaNouveaux ?? 0), n);
  const due = known.filter((f) => f.prochain <= now).sort((x, y) => x.prochain - y.prochain || x.boite - y.boite);
  const out = due.slice(0, n - nNew).map((f) => ({ ...f, nouveau: false }));
  for (const f of fresh.slice(0, nNew)) out.push(newFact(f, now));
  // liste trop courte (peu de faits dus) : d'autres faits nouveaux, dans les mêmes limites, avant de réviser
  // (cran « plus facile » : pas de place réservée, mais au plus `complementMax` faits nouveaux pour compléter une
  // liste trop courte, sans quoi une enfant qui choisit toujours « plus facile » n'aurait jamais d'échauffement)
  { const cap = o.nouveaux === false ? (o.complementMax ?? 0) : Infinity, more = Math.min(min - out.length, fresh.length - nNew, roomForNew(c, stored, o.dejaNouveaux ?? 0) - nNew, cap); for (const f of fresh.slice(nNew, nNew + Math.max(0, more))) out.push(newFact(f, now)); }
  const ahead = known.filter((f) => f.prochain > now).sort((x, y) => x.prochain - y.prochain);
  for (const f of ahead) { if (out.length >= min) break; out.push({ ...f, nouveau: false, anticipe: true }); }
  const again = out.filter((f) => f.boite === 1 && !f.anticipe);
  for (let i = 0; out.length < min && again.length; i++) out.push({ ...again[i % again.length], anticipe: true });
  return out;
}
export const newFact = (f, now) => ({ ...f, boite: 1, prochain: now, historique: [], introduit: now, nouveau: true });
// la forme d'une question : directe, ou à trou (« 3 + ? = 7 », « ? + 4 = 6 ») pour un fait dont la boîte le
// permet (cran « plus dur » : boîte 3 ou plus ; « très dur » : boîte 2 ou plus) ; un tiers chacune
// lot 2, étape 6 : `trouFamille` (la famille du fait a ouvert ses formes à trou) vaut aussi, sauf `directe`
// (cran « plus facile » en notion du jour : formes directes seulement)
export function formFor(f, trouDesBoite, rnd, { trouFamille = false, directe = false } = {}) {
  if (directe || f.base) return "directe";
  if (!trouFamille && (!trouDesBoite || (f.boite ?? 1) < trouDesBoite)) return "directe";
  const u = rnd(); return u < 1 / 3 ? "directe" : u < 2 / 3 ? "trouDroite" : "trouGauche";
}
// ce que l'enfant doit trouver, selon la forme
export const expected = (q) => (q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.a + q.b);
