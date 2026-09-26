// MODULE 2 · LES FAITS D'ADDITION (docs/SPEC.md, « Module 2 »), la partie sans écran : le catalogue des
// faits, la révision espacée en 5 boîtes, le seuil « rapide » et le plan d'un échauffement.
// Fonctions pures, ou presque (le magasin « faits » est lu et écrit par Warmup) ; l'heure est injectée.
//  - un fait est une addition ordonnée « a+b » (a, b >= 1, a + b <= 10) : 3+1 et 1+3 sont deux faits ;
//  - boîte 1 : revient à chaque séance ; 2, 3, 4, 5 : dans 2, 4, 8, 15 jours (content/module2.json) ;
//  - juste et rapide : boîte suivante ; juste mais lent : reste ; faux : boîte 1 ; juste avec l'aide : reste ;
//  - nouveaux faits : 3 au plus par séance, et seulement si la boîte 1 compte moins de 8 faits ;
//  - rapide : temps de réponse < temps de base + 4 s (3 s quand la moitié des faits rencontrés sont en
//    boîte 3 ou plus). Le temps de base est la médiane des réponses à des questions triviales (« 4 + 0 »).
export const DAY = 86400000;
export const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
export const key = (a, b) => `${a}+${b}`;

// les règles des familles : un fait (a, b) en fait-il partie ?
const RULES = {
  plus1ou2: (a, b) => Math.min(a, b) <= 2,
  doubles: (a, b) => a === b && a <= 5,
};
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
export const median = (xs) => { if (!xs.length) return null; const s = [...xs].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// le seuil « rapide », en ms
export function threshold(c, baseMs, facts) {
  const met = facts.filter((f) => f.boite), advanced = met.length > 0 && met.filter((f) => f.boite >= 3).length * 2 >= met.length;
  return baseMs + (advanced ? c.seuilAvanceS : c.seuilS) * 1000;
}
// le fait après une réponse : { juste, ms, aide, anticipe } -> nouvel état
export function afterFact(c, f0, r, limitMs, now) {
  const f = { ...f0, historique: [...(f0.historique ?? []), { t: now, juste: !!r.juste, ms: r.ms, aide: !!r.aide, boite: f0.boite }] };
  const rapide = r.juste && r.ms < limitMs;
  if (!r.juste) f.boite = 1;
  else if (rapide && !r.aide && !r.anticipe) f.boite = Math.min(5, f.boite + 1);
  f.prochain = startOfDay(now) + c.boites[f.boite - 1] * DAY;
  f.tempsMedian = median(f.historique.filter((h) => h.juste).map((h) => h.ms));
  f.historique.at(-1).rapide = rapide; f.historique.at(-1).apres = f.boite;
  return f;
}
// le plan d'un échauffement : les faits dus (boîte la plus basse d'abord, puis le retard le plus ancien),
// puis de nouveaux faits, jusqu'à n questions ; s'il en manque pour atteindre `min`, un second passage
// des faits de la boîte 1 de la séance (anticipe : ne fait pas monter de boîte)
export function plan(c, stored, now, n, min) {
  const cat = catalog(c).filter((f) => c.famillesActives.includes(f.famille)), byKey = new Map(stored.map((f) => [f.fait, f]));
  const known = cat.filter((f) => byKey.has(f.fait)).map((f) => byKey.get(f.fait));
  const due = known.filter((f) => f.prochain <= now).sort((x, y) => x.boite - y.boite || x.prochain - y.prochain);
  const out = due.slice(0, n).map((f) => ({ ...f, nouveau: false }));
  const box1 = known.filter((f) => f.boite === 1).length;
  if (box1 < c.boite1Max) for (const f of cat.filter((x) => !byKey.has(x.fait)).slice(0, Math.min(c.nouveauxMax, n - out.length, c.boite1Max - box1))) out.push({ ...f, boite: 1, prochain: now, historique: [], introduit: now, nouveau: true });
  const again = out.filter((f) => f.boite === 1);
  for (let i = 0; out.length < min && again.length; i++) out.push({ ...again[i % again.length], anticipe: true });
  return out;
}
