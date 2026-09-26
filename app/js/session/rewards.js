// LES RÉCOMPENSES (docs/SPEC.md, « Univers marin et récompenses »). Tout est rangé dans le magasin
// « recompenses », une fiche par clé :
//   etoiles  { total, cumul, dorees, arcEnCiel, coquillages } : `total` ce qui reste à dépenser en
//            coquillages, `cumul` tout ce qui a été gagné depuis le début ; les étoiles dorées (5 séances
//            dans la semaine) et arc-en-ciel (un niveau franchi) se gardent à part ; on ne perd jamais rien ;
//   cartes   { cartes: { id: { n, premiere, brillante } } } : la collection (n : combien de fois obtenue) ;
//   serie    { seances, derniere } : la série de séances (elle se met en pause quand un jour manque, au
//            lieu de retomber à zéro).
// Les règles (prix d'un coquillage, poids des raretés, doublons, série, semaine) viennent de
// content/cartes.json. Les fonctions pures sont testées par tests/unit/rewards.test.mjs.
import { sameDay } from "./session.js";

// ---------------------------------------------------------------- fonctions pures
// la carte d'un coquillage : jamais une légendaire (elles viennent des étoiles dorées, lot 4) ; pas de
// doublon tant qu'une zone ouverte n'est pas complète ; sinon, un doublon d'une carte déjà obtenue.
// Tirage pondéré par la rareté (poids de content/cartes.json).
export function pickCard(cards, owned, { zones, poids }, rnd = Math.random) {
  const open = cards.filter((c) => zones.includes(c.zone) && c.rarete !== "legendaire");
  if (!open.length) return null;
  const fresh = open.filter((c) => !owned[c.id]), pool = fresh.length ? fresh : open;
  const w = pool.map((c) => poids[c.rarete] ?? 1), sum = w.reduce((a, b) => a + b, 0);
  let x = rnd() * sum;
  for (let i = 0; i < pool.length; i++) { x -= w[i]; if (x < 0) return pool[i]; }
  return pool.at(-1);
}
// range une carte dans la collection ; au `brillante`-ième doublon, la carte devient brillante
export function addCard(owned, card, brillante, now = Date.now()) {
  const had = owned[card.id], n = (had?.n ?? 0) + 1, shiny = had?.brillante || n - 1 >= brillante;
  return { owned: { ...owned, [card.id]: { n, premiere: had?.premiere ?? now, brillante: shiny } }, nouvelle: !had, devientBrillante: shiny && !had?.brillante };
}
// une séance terminée de plus dans la série ; toutes les `bonusChaque` séances, un bonus d'étoiles.
// Un jour sans séance ne fait pas retomber la série : elle attend (règle de protection de la SPEC).
export function nextSeries(serie, now, { bonusChaque, bonus }) {
  if (serie?.derniere && sameDay(serie.derniere, now)) return { serie, etoiles: 0 };
  const seances = (serie?.seances ?? 0) + 1;
  return { serie: { seances, derniere: now }, etoiles: seances % bonusChaque === 0 ? bonus : 0 };
}
// début de la semaine (lundi, 0 h) d'une date
export const weekStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
// les séances terminées de la semaine de `now` atteignent-elles juste le nombre voulu (une étoile dorée) ?
export const goldenStar = (debuts, now, { seances }) => debuts.filter((t) => weekStart(t) === weekStart(now)).length === seances;

// ---------------------------------------------------------------- le trésor
export class Rewards {
  constructor(store, content = null) {
    this.store = store; this.c = content; this.listeners = new Set();
    this.st = { id: "etoiles", total: 0, cumul: 0, dorees: 0, arcEnCiel: 0, coquillages: 0 }; this.owned = {}; this.serie = null;
  }
  async load() {
    this.st = { ...this.st, ...((await this.store.get("recompenses", "etoiles")) ?? {}) };
    this.owned = (await this.store.get("recompenses", "cartes"))?.cartes ?? {};
    this.serie = await this.store.get("recompenses", "serie") ?? null;
    return this;
  }
  get total() { return this.st.total; }
  save() { return this.store.put("recompenses", this.st); }
  // des étoiles de mer gagnées : aussitôt dans le trésor
  async add(n, raison = "") { this.st = { ...this.st, total: this.st.total + n, cumul: this.st.cumul + n }; await this.save(); this.listeners.forEach((f) => f(n, raison)); }
  onChange(f) { this.listeners.add(f); }
  // une étoile dorée ou arc-en-ciel
  async special(kind, n = 1) { this.st = { ...this.st, [kind]: (this.st[kind] ?? 0) + n }; await this.save(); }
  // peut-on ouvrir un coquillage ?
  canOpen() { return !!this.c && this.st.total >= this.c.coquillage.prix; }
  // ouvre un coquillage : dépense son prix, tire une carte et la range ; renvoie { carte, nouvelle, devientBrillante, n }
  async openShell(rnd = Math.random, now = Date.now()) {
    const c = this.c, zones = c.zones.filter((z) => z.ouverte).map((z) => z.id), card = pickCard(c.cartes, this.owned, { zones, poids: c.poids }, rnd);
    if (!card || !this.canOpen()) return null;
    const r = addCard(this.owned, card, c.brillante, now);
    this.owned = r.owned; this.st = { ...this.st, total: this.st.total - c.coquillage.prix, coquillages: this.st.coquillages + 1 };
    await this.store.put("recompenses", { id: "cartes", cartes: this.owned }); await this.save();
    return { carte: card, nouvelle: r.nouvelle, devientBrillante: r.devientBrillante, n: this.owned[card.id].n };
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
