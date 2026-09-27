// LES RÉCOMPENSES (docs/SPEC.md, « Univers marin et récompenses » ; docs/SPEC-LOT2.md, section 5, qui prévaut).
// Tout est rangé dans le magasin « recompenses », une fiche par clé :
//   etoiles  { total, cumul, dorees, doreesDepensees, arcEnCiel, arcDepensees, arcLibre, coquillages,
//            coquillagesDores } : `total` ce qui reste à dépenser en coquillages, `cumul` tout ce qui a été
//            gagné depuis le début ; `dorees` les étoiles dorées gagnées (4 semaines réussies), dont
//            `doreesDepensees` ont ouvert un coquillage doré ; `arcEnCiel` les étoiles arc-en-ciel gagnées
//            (niveaux franchis), dont `arcDepensees` ont ouvert une zone ; `arcLibre` celles gagnées pendant
//            l'entraînement libre, remises à la récompense de la séance suivante ; on ne perd jamais rien ;
//   cartes   { cartes: { id: { n, premiere, brillante } } } : la collection (n : combien de fois obtenue) ;
//   serie    { seances, derniere } : la série de séances (elle se met en pause quand un jour manque) ;
//   quota    { date, cartes } : la base du quota de cartes nouvelles (enregistrée au premier lancement de
//            cette version, ou après « tout effacer ») ;
//   zones    { ouvertes: [id], dates: { id: t } } : les zones ouvertes (au départ, celles que cartes.json
//            marque `ouverte`).
// Les règles (prix d'un coquillage, poids des raretés, quota, brillantes, série, semaines réussies) viennent
// de content/cartes.json ; les semaines d'école, de content/calendrier.json. Les fonctions pures sont
// testées par tests/unit/rewards.test.mjs et tests/unit/cartes.test.mjs.
import { sameDay } from "./session.js";

// ---------------------------------------------------------------- dates
const DAY = 86400000;
// une date du calendrier (« 2026-10-17 ») : minuit, heure locale
export const dateOf = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d).getTime(); };
// début de la semaine (lundi, 0 h) d'une date
export const weekStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
const addDays = (t, n) => { const d = new Date(t); d.setDate(d.getDate() + n); return d.getTime(); };
// un jour de classe : entre la rentrée et la fin de l'année, hors vacances, du lundi au vendredi
export const schoolDay = (cal, t) => {
  const d = new Date(t); if (d.getDay() === 0 || d.getDay() === 6) return false;
  if (t < dateOf(cal.rentree) || t >= dateOf(cal.finAnnee)) return false;
  return !cal.vacances.some((v) => t >= dateOf(v.debut) && t < dateOf(v.reprise));
};
// une semaine d'école : au moins un jour de classe du lundi au vendredi (lundi : son début)
export const schoolWeek = (cal, monday) => [0, 1, 2, 3, 4].some((i) => schoolDay(cal, addDays(monday, i)));
// les semaines d'école dont le lundi est passé, depuis la semaine de `from` (comprise) jusqu'à `now`
export function schoolWeeks(cal, from, now) {
  let n = 0;
  for (let w = weekStart(from); w <= now; w = addDays(w, 7)) if (schoolWeek(cal, w)) n++;
  return n;
}
// le quota de cartes nouvelles : base + parSemaine × semaines d'école commencées depuis la base, au plus max.
// Sans calendrier : pas de limite (ancien comportement).
export const quotaAt = (base, cal, now, { parSemaine, max }) => (cal && base ? Math.min(max, base.cartes + parSemaine * schoolWeeks(cal, base.date, now)) : max);

// ---------------------------------------------------------------- les cartes
const weighted = (pool, poids, rnd) => {
  if (!pool.length) return null;
  const w = pool.map((c) => poids[c.rarete] ?? 1), sum = w.reduce((a, b) => a + b, 0);
  let x = rnd() * sum;
  for (let i = 0; i < pool.length; i++) { x -= w[i]; if (x < 0) return pool[i]; }
  return pool.at(-1);
};
// la carte d'un coquillage ordinaire : jamais une légendaire (elles viennent des coquillages dorés).
//  - `nouvelle` (sous le quota), ou aucune carte possédée : une carte pas encore obtenue d'une zone ouverte ;
//  - sinon, ou s'il n'en reste aucune à gagner dans les zones ouvertes : un doublon d'une carte déjà
//    obtenue, de préférence une carte qui n'est pas encore brillante.
// Tirage pondéré par la rareté (poids de content/cartes.json).
export function pickCard(cards, owned, { zones, poids, nouvelle = true }, rnd = Math.random) {
  const open = cards.filter((c) => zones.includes(c.zone) && c.rarete !== "legendaire");
  const fresh = open.filter((c) => !owned[c.id]), mine = cards.filter((c) => owned[c.id] && c.rarete !== "legendaire");
  if ((nouvelle || !mine.length) && fresh.length) return weighted(fresh, poids, rnd);
  const dull = mine.filter((c) => !owned[c.id].brillante);
  return weighted(dull.length ? dull : mine, poids, rnd);
}
// range une carte dans la collection. Elle est brillante si elle l'était déjà, si le tirage `tirage` l'a
// rendue brillante (20 % de chances, cartes.json, brillanteHasard) ou au `brillante`-ième doublon.
export function addCard(owned, card, brillante, now = Date.now(), tirage = false) {
  const had = owned[card.id], n = (had?.n ?? 0) + 1, shiny = !!had?.brillante || tirage || n - 1 >= brillante;
  return { owned: { ...owned, [card.id]: { n, premiere: had?.premiere ?? now, brillante: shiny } }, nouvelle: !had, devientBrillante: shiny && !had?.brillante, parTirage: tirage && !had?.brillante };
}
// une carte prête : son illustration et son anecdote existent
export const ready = (c) => !!(c.illustration && c.anecdote);
// les communes et rares d'une zone sont-elles toutes gagnées ?
export const zoneDone = (cards, owned, zone) => cards.filter((c) => c.zone === zone && c.rarete !== "legendaire").every((c) => owned[c.id]);
// la zone qui peut s'ouvrir : celle qui suit la dernière zone ouverte, quand toutes les communes et rares de
// celle-ci sont gagnées et que toutes ses cartes à elle sont prêtes (sinon elle attend son contenu)
export function nextZone(content, owned, open) {
  const Z = content.zones, last = Math.max(...Z.map((z, i) => (open.includes(z.id) ? i : -1))), next = Z[last + 1];
  if (!next || last < 0 || !zoneDone(content.cartes, owned, Z[last].id)) return null;
  return content.cartes.filter((c) => c.zone === next.id).every(ready) ? next : null;
}
// la légendaire que peut donner un coquillage doré : la première, dans l'ordre du contenu, d'une zone ouverte
// dont les communes et rares sont toutes gagnées, pas encore obtenue et prête
export const legendaryFor = (content, owned, open) => content.cartes.find((c) => c.rarete === "legendaire" && open.includes(c.zone) && !owned[c.id] && ready(c) && zoneDone(content.cartes, owned, c.zone)) ?? null;

// ---------------------------------------------------------------- la série et les semaines réussies
// une séance terminée de plus dans la série ; toutes les `bonusChaque` séances, un bonus d'étoiles.
// Un jour sans séance ne fait pas retomber la série : elle attend (règle de protection de la SPEC).
export function nextSeries(serie, now, { bonusChaque, bonus }) {
  if (serie?.derniere && sameDay(serie.derniere, now)) return { serie, etoiles: 0 };
  const seances = (serie?.seances ?? 0) + 1;
  return { serie: { seances, derniere: now }, etoiles: seances % bonusChaque === 0 ? bonus : 0 };
}
// les semaines réussies (lundi à dimanche, au moins `seances` séances terminées), depuis la toute première
export const goodWeeks = (debuts, { seances }) => {
  const by = new Map(); for (const t of debuts) { const w = weekStart(t); by.set(w, (by.get(w) ?? 0) + 1); }
  return [...by.values()].filter((n) => n >= seances).length;
};
// la séance de `now` (comprise dans `debuts`) rapporte-t-elle une étoile dorée ? Oui si elle rend sa semaine
// réussie (elle en est juste la `seances`-ième) et que cette semaine est la 4e, 8e, 12e… semaine réussie
// (consécutives ou non : on ne perd jamais rien).
export function goldenStar(debuts, now, rules) {
  const w = weekStart(now);
  if (debuts.filter((t) => weekStart(t) === w).length !== rules.seances) return false;
  return goodWeeks(debuts, rules) % rules.semainesParDoree === 0;
}
// une carte sort-elle brillante (tirage de 20 %) ?
export const shinyDraw = (rnd, p) => rnd() < p;

// ---------------------------------------------------------------- le trésor
export class Rewards {
  // content : cartes.json ; calendrier : calendrier.json (quota des cartes nouvelles ; sans lui, pas de quota)
  constructor(store, content = null, calendrier = null) {
    this.store = store; this.c = content; this.cal = calendrier; this.listeners = new Set();
    this.st = { id: "etoiles", total: 0, cumul: 0, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 };
    this.owned = {}; this.serie = null; this.base = null; this.zones = null;
  }
  async load(now = Date.now()) {
    this.st = { ...this.st, ...((await this.store.get("recompenses", "etoiles")) ?? {}) };
    this.owned = (await this.store.get("recompenses", "cartes"))?.cartes ?? {};
    this.serie = await this.store.get("recompenses", "serie") ?? null;
    // la base du quota : au premier lancement de cette version, les cartes déjà gagnées
    this.base = await this.store.get("recompenses", "quota");
    if (!this.base) { this.base = { id: "quota", date: now, cartes: Object.keys(this.owned).length }; await this.store.put("recompenses", this.base); }
    this.zones = await this.store.get("recompenses", "zones");
    if (!this.zones) this.zones = { id: "zones", ouvertes: (this.c?.zones ?? []).filter((z) => z.ouverte).map((z) => z.id), dates: {} };
    return this;
  }
  get total() { return this.st.total; }
  save() { return this.store.put("recompenses", this.st); }
  // des étoiles de mer gagnées : aussitôt dans le trésor
  async add(n, raison = "") { this.st = { ...this.st, total: this.st.total + n, cumul: this.st.cumul + n }; await this.save(); this.listeners.forEach((f) => f(n, raison)); }
  onChange(f) { this.listeners.add(f); }
  // une étoile dorée ou arc-en-ciel
  async special(kind, n = 1) { this.st = { ...this.st, [kind]: (this.st[kind] ?? 0) + n }; await this.save(); }
  // les réserves : étoiles dorées et arc-en-ciel pas encore dépensées
  get doreesDispo() { return (this.st.dorees ?? 0) - (this.st.doreesDepensees ?? 0); }
  get arcDispo() { return (this.st.arcEnCiel ?? 0) - (this.st.arcDepensees ?? 0); }
  // les cartes possédées (légendaires comprises) et le quota du moment
  get count() { return Object.keys(this.owned).length; }
  quota(now = Date.now()) { return quotaAt(this.base, this.cal, now, this.c.quota); }
  // les zones ouvertes
  zoneOpen(id) { return this.zones.ouvertes.includes(id); }
  // ---------------------------------------------------------------- entraînement libre
  // un niveau franchi pendant l'entraînement libre : l'étoile arc-en-ciel attend la séance suivante
  async arcFromFree() { await this.special("arcLibre"); }
  // à la récompense : les étoiles arc-en-ciel de l'entraînement libre rejoignent la réserve ; renvoie leur nombre
  async collectFree() { const n = this.st.arcLibre ?? 0; if (n) { this.st = { ...this.st, arcLibre: 0, arcEnCiel: (this.st.arcEnCiel ?? 0) + n }; await this.save(); } return n; }
  // ---------------------------------------------------------------- zones
  // la zone qui s'ouvrirait si une étoile arc-en-ciel était disponible
  nextZone() { return this.c ? nextZone(this.c, this.owned, this.zones.ouvertes) : null; }
  // ouvre la zone suivante en dépensant une étoile arc-en-ciel ; renvoie la zone ouverte, ou null
  async openZone(now = Date.now()) {
    const z = this.nextZone();
    if (!z || this.arcDispo < 1) return null;
    this.zones = { ...this.zones, ouvertes: [...this.zones.ouvertes, z.id], dates: { ...this.zones.dates, [z.id]: now } };
    this.st = { ...this.st, arcDepensees: (this.st.arcDepensees ?? 0) + 1 };
    await this.store.put("recompenses", this.zones); await this.save();
    return z;
  }
  // ---------------------------------------------------------------- coquillages
  // peut-on ouvrir un coquillage ?
  canOpen() { return !!this.c && this.st.total >= this.c.coquillage.prix; }
  // range une carte gagnée (tirage de la brillante compris) et renvoie ce qu'il faut montrer
  async win(card, rnd, now) {
    const r = addCard(this.owned, card, this.c.brillante, now, shinyDraw(rnd, this.c.brillanteHasard ?? 0));
    this.owned = r.owned;
    await this.store.put("recompenses", { id: "cartes", cartes: this.owned });
    return { carte: card, nouvelle: r.nouvelle, devientBrillante: r.devientBrillante, parTirage: r.parTirage, brillante: this.owned[card.id].brillante, n: this.owned[card.id].n };
  }
  // ouvre un coquillage : dépense son prix, tire une carte (nouvelle sous le quota, sinon un doublon) et la
  // range ; renvoie { carte, nouvelle, devientBrillante, parTirage, brillante, n }
  async openShell(rnd = Math.random, now = Date.now()) {
    if (!this.canOpen()) return null;
    const c = this.c, card = pickCard(c.cartes, this.owned, { zones: this.zones.ouvertes, poids: c.poids, nouvelle: this.count < this.quota(now) }, rnd);
    if (!card) return null;
    this.st = { ...this.st, total: this.st.total - c.coquillage.prix, coquillages: this.st.coquillages + 1 };
    await this.save();
    return this.win(card, rnd, now);
  }
  // la légendaire qu'un coquillage doré donnerait maintenant (une étoile dorée en réserve, une place sous le
  // quota, une légendaire gagnable), ou null
  goldenCard(now = Date.now()) {
    if (!this.c || this.doreesDispo < 1 || this.count >= this.quota(now)) return null;
    return legendaryFor(this.c, this.owned, this.zones.ouvertes);
  }
  // ouvre un coquillage doré : dépense une étoile dorée (pas d'étoiles de mer) ; renvoie comme openShell
  async openGolden(rnd = Math.random, now = Date.now()) {
    const card = this.goldenCard(now);
    if (!card) return null;
    this.st = { ...this.st, doreesDepensees: (this.st.doreesDepensees ?? 0) + 1, coquillagesDores: (this.st.coquillagesDores ?? 0) + 1 };
    await this.save();
    return this.win(card, rnd, now);
  }
  // fin de séance : la série avance (et rapporte peut-être des étoiles) ; renvoie les étoiles du bonus
  async endOfSession(now = Date.now()) {
    const r = nextSeries(this.serie, now, this.c.serie);
    this.serie = r.serie; await this.store.put("recompenses", { id: "serie", ...r.serie });
    return r.etoiles;
  }
  // les cartes obtenues, dans l'ordre du contenu
  collection() { return (this.c?.cartes ?? []).filter((c) => this.owned[c.id]).map((c) => ({ ...c, ...this.owned[c.id] })); }
}
