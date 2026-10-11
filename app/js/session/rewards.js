// LES RÉCOMPENSES (docs/SPEC.md, section 10). Depuis le lot « La boutique du récif » (décisions du parent des 10 et 11 octobre
// 2026, art/boutique/README.md) : l'enfant ACHÈTE les créatures du récif avec ses étoiles de mer, à la boutique
// (session/boutique.js) ; le coquillage tiré tous les 25 étoiles n'existe plus. Il reste pour les occasions : la série (toutes
// les 10 séances, il fait briller une créature), l'ouverture d'une zone (son premier habitant) et les légendaires (le coquillage
// de diamant). Tout est rangé dans le magasin « recompenses », une fiche par clé :
//   etoiles  { total, cumul, dorees, doreesDepensees, arcEnCiel, arcDepensees, arcLibre, coquillages,
//            coquillagesDores } : `total` ce qui reste à dépenser (à la boutique), `cumul` tout ce qui a été gagné depuis le
//            début ; `dorees` les étoiles de diamant gagnées (4 semaines réussies ; le nom interne reste), dont `doreesDepensees`
//            ont ouvert un coquillage de diamant ; `arcEnCiel` les étoiles arc-en-ciel gagnées (niveaux franchis), dont
//            `arcDepensees` ont ouvert une zone ; `arcLibre` celles gagnées pendant l'entraînement libre, remises à la récompense
//            de la séance suivante ; `coquillages` les coquillages ordinaires ouverts avant la boutique ; on ne perd jamais rien ;
//   cartes   { cartes: { id: { n, premiere, brillante, origine } } } : la collection ; `origine` : « achat » (la boutique),
//            « zone » (le premier habitant offert à l'ouverture d'une zone), « diamant » (une légendaire) ; absente pour les
//            créatures gagnées avant la boutique ;
//   serie    { seances, derniere } : la série de séances (elle se met en pause quand un jour manque) ;
//   quota    { date, cartes } : la base des arrivages de la boutique (c'était celle du quota de cartes nouvelles, enregistrée
//            au premier lancement de la version du lot 2, ou après « tout effacer ») : rien n'est converti ;
//   zones    { ouvertes: [id], dates: { id: t } } : les zones ouvertes (au départ, celles que cartes.json marque `ouverte`) ;
//   boutique { annoncees: [id], vues: [id], visites } : les arrivées déjà annoncées (fin de séance ou entrée de la boutique),
//            celles dont la tuile a été touchée (leur halo s'éteint), le nombre de visites (« Bienvenue » à la première) ;
//   achats   { liste: [{ t, carte, prix, briller, brillante }] } : le journal des achats, pour l'espace parent ;
//   cadeaux, decors : les décors du récif (cadeaux de la surprise, décors des doublons) ; supprimés le 5 octobre 2026
//            (décision du parent), ces fiches restent dans les données mais ne sont plus lues.
// Le rythme de la boutique (Arrivages ou Libre) est un réglage du parent (reglages, « boutiqueRythme »).
// Les règles (prix, arrivages, brillantes, série, semaines réussies) viennent de content/cartes.json ; les semaines d'école, de
// content/calendrier.json. Les fonctions pures sont testées par tests/unit/rewards.test.mjs, tests/unit/cartes.test.mjs et
// tests/unit/boutique.test.mjs.
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
// le nombre d'arrivées à la boutique (c'était le quota de cartes nouvelles, d'où son nom) : base + parSemaine × semaines d'école
// commencées depuis la base, au plus max. Sans calendrier : pas de limite.
export const quotaAt = (base, cal, now, { parSemaine, max }) => (cal && base ? Math.min(max, base.cartes + parSemaine * schoolWeeks(cal, base.date, now)) : max);

// ---------------------------------------------------------------- les cartes
// range une carte dans la collection. Elle est brillante si elle l'était déjà (une brillante le reste) ou si
// le tirage `tirage` l'a rendue brillante (cartes.json : boutique.brillanteAchat, brillanteNouvelle) ; `origine` : d'où elle vient
// (« achat », « zone », « diamant »).
export function addCard(owned, card, now = Date.now(), tirage = false, origine = null) {
  const had = owned[card.id], n = (had?.n ?? 0) + 1, shiny = !!had?.brillante || tirage;
  return { owned: { ...owned, [card.id]: { n, premiere: had?.premiere ?? now, derniere: now, brillante: shiny, ...(had?.origine ?? origine ? { origine: had?.origine ?? origine } : {}) } }, nouvelle: !had, devientBrillante: shiny && !had?.brillante, parTirage: tirage && !had?.brillante };
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
// la légendaire que peut donner un coquillage de diamant : la première, dans l'ordre du contenu, d'une zone ouverte
// dont les communes et rares sont toutes gagnées, pas encore obtenue et prête
export const legendaryFor = (content, owned, open) => content.cartes.find((c) => c.rarete === "legendaire" && open.includes(c.zone) && !owned[c.id] && ready(c) && zoneDone(content.cartes, owned, c.zone)) ?? null;

// ---------------------------------------------------------------- la boutique
// l'ordre des arrivages (mode Arrivages) : zone par zone, une rare toutes les 3 ou 4 communes (la maquette de la boutique et sa
// simulation : art/boutique/source.html, ORDRE), dans l'ordre de cartes.json ; jamais les légendaires
export function ordreArrivages(content) {
  return content.zones.flatMap((z) => {
    const c = content.cartes.filter((x) => x.zone === z.id && x.rarete === "commune"), r = content.cartes.filter((x) => x.zone === z.id && x.rarete === "rare"), out = [];
    const k = Math.ceil(c.length / (r.length + 1));
    while (c.length || r.length) { out.push(...c.splice(0, k)); if (r.length) out.push(r.shift()); }
    return out.map((x) => x.id);
  });
}
// les créatures arrivées à la boutique (jamais les légendaires) : en mode Libre (`n` infini), toutes celles des zones ouvertes ;
// en mode Arrivages, `n` créatures en tout : celles déjà dans le récif comptent (sauf un premier habitant offert, origine « zone »,
// qui est en plus), puis les suivantes de l'ordre des arrivages qui ne sont pas encore dans le récif. Ainsi une sauvegarde
// d'avant la boutique (créatures gagnées au hasard des coquillages) garde exactement son rythme : la base du quota devient
// celle des arrivages (art/boutique/README.md, « Ce que l'intégration changerait »).
export function arrivees(content, owned, open, n, ordre = ordreArrivages(content)) {
  const zoneOf = new Map(content.cartes.map((c) => [c.id, c])), pool = ordre.filter((id) => open.includes(zoneOf.get(id).zone));
  const mine = pool.filter((id) => owned[id]), out = new Set(mine);
  let reste = n === Infinity ? Infinity : n - mine.filter((id) => owned[id].origine !== "zone").length;
  for (const id of pool) { if (reste <= 0) break; if (!owned[id]) { out.add(id); reste--; } }
  return out;
}
// l'état d'une place de la vitrine (art/boutique/README.md, « Une place de la vitrine, selon son état ») :
//   « legende » (une légendaire pas encore dans le récif : elle se gagne avec les étoiles de diamant), « legendeATsoi » (une
//   légendaire du récif, pas brillante), « brillante », « terne » (dans le récif, elle peut briller), « fermee » (zone pas encore
//   ouverte), « bientot » (pas encore arrivée), « vendre »
export function etatPlace(c, { owned, open, arrived }) {
  const o = owned[c.id];
  if (c.rarete === "legendaire") return o ? (o.brillante ? "brillante" : "legendeAToi") : "legende";
  if (o) return o.brillante ? "brillante" : "terne";
  if (!open.includes(c.zone)) return "fermee";
  return arrived.has(c.id) ? "vendre" : "bientot";
}
// ce que coûte une place : une créature à vendre (boutique.prix), une créature du récif à faire briller (boutique.briller) ;
// rien sinon (null : elle ne s'achète pas)
export const coutPlace = (B, c, etat) => (etat === "vendre" ? B.prix[c.rarete] : etat === "terne" ? B.briller[c.rarete] ?? null : null);
// ce qui manque pour l'acheter : null si l'enfant a assez d'étoiles, sinon le nombre d'étoiles qui manquent
export const manque = (cout, total) => (cout === null || total >= cout ? null : cout - total);

// ---------------------------------------------------------------- la série et les semaines réussies
// une séance terminée de plus dans la série ; toutes les `bonusChaque` séances, un bonus d'étoiles ; toutes les
// `coquillageChaque` séances (lot « La boutique du récif »), le coquillage de la série (`coquillage`).
// Un jour sans séance ne fait pas retomber la série : elle attend (règle de protection de la SPEC).
export function nextSeries(serie, now, { bonusChaque, bonus, coquillageChaque = 0 }) {
  if (serie?.derniere && sameDay(serie.derniere, now)) return { serie, etoiles: 0, coquillage: false };
  const seances = (serie?.seances ?? 0) + 1;
  return { serie: { seances, derniere: now }, etoiles: seances % bonusChaque === 0 ? bonus : 0, coquillage: !!coquillageChaque && seances % coquillageChaque === 0 };
}
// les semaines réussies (lundi à dimanche, au moins `seances` séances terminées), depuis la toute première
export const goodWeeks = (debuts, { seances }) => {
  const by = new Map(); for (const t of debuts) { const w = weekStart(t); by.set(w, (by.get(w) ?? 0) + 1); }
  return [...by.values()].filter((n) => n >= seances).length;
};
// la séance de `now` (comprise dans `debuts`) rapporte-t-elle une étoile de diamant (nom interne : dorée) ? Oui si elle rend sa semaine
// réussie (elle en est juste la `seances`-ième) et que cette semaine est la 4e, 8e, 12e… semaine réussie
// (consécutives ou non : on ne perd jamais rien).
export function goldenStar(debuts, now, rules) {
  const w = weekStart(now);
  if (debuts.filter((t) => weekStart(t) === w).length !== rules.seances) return false;
  return goodWeeks(debuts, rules) % rules.semainesParDoree === 0;
}
// une créature nouvelle sort-elle brillante ? `p` : sa chance (cartes.json, boutique.brillanteAchat, brillanteNouvelle : 20 %)
export const shinyDraw = (rnd, p) => rnd() < p;
export const shinyChance = (content) => content.brillanteNouvelle ?? 0;

// ---------------------------------------------------------------- le trésor
const uniq = (xs) => [...new Set(xs)];
export class Rewards {
  // content : cartes.json ; calendrier : calendrier.json (les arrivages de la boutique ; sans lui, tout est arrivé)
  constructor(store, content = null, calendrier = null) {
    this.store = store; this.c = content; this.cal = calendrier; this.listeners = new Set();
    this.st = { id: "etoiles", total: 0, cumul: 0, dorees: 0, doreesDepensees: 0, arcEnCiel: 0, arcDepensees: 0, arcLibre: 0, coquillages: 0, coquillagesDores: 0 };
    this.owned = {}; this.serie = null; this.base = null; this.zones = null;
    this.bq = { id: "boutique", annoncees: [], vues: [], visites: 0 }; this.achats = { id: "achats", liste: [] }; this.rythme = null;
    this.arrivee = null; // la dernière créature achetée (ou rendue brillante) : elle arrive à la nage dans le récif
    this.ordre = content?.zones ? ordreArrivages(content) : [];
  }
  async load(now = Date.now()) {
    this.st = { ...this.st, ...((await this.store.get("recompenses", "etoiles")) ?? {}) };
    this.owned = (await this.store.get("recompenses", "cartes"))?.cartes ?? {};
    this.serie = await this.store.get("recompenses", "serie") ?? null;
    // la base des arrivages (l'ancienne base du quota) : au premier lancement, les cartes déjà gagnées
    this.base = await this.store.get("recompenses", "quota");
    if (!this.base) { this.base = { id: "quota", date: now, cartes: Object.keys(this.owned).length }; await this.store.put("recompenses", this.base); }
    this.zones = await this.store.get("recompenses", "zones");
    if (!this.zones) this.zones = { id: "zones", ouvertes: (this.c?.zones ?? []).filter((z) => z.ouverte).map((z) => z.id), dates: {} };
    // (lot « La boutique du récif » : deux fiches de plus, créées à leur première écriture ; pas de nouvelle version du schéma)
    this.bq = { ...this.bq, ...((await this.store.get("recompenses", "boutique")) ?? {}) };
    this.achats = { ...this.achats, ...((await this.store.get("recompenses", "achats")) ?? {}) };
    this.rythme = this.store.setting ? await this.store.setting("boutiqueRythme", null) : null;
    return this;
  }
  get total() { return this.st.total; }
  save() { return this.store.put("recompenses", this.st); }
  // plusieurs fiches d'un coup, en une seule transaction (engine/store.js, putMany)
  ecrire(fiches) { return this.store.putMany ? this.store.putMany("recompenses", fiches) : Promise.all(fiches.map((f) => this.store.put("recompenses", f))); }
  // des étoiles de mer gagnées : aussitôt dans le trésor
  async add(n, raison = "") { this.st = { ...this.st, total: this.st.total + n, cumul: this.st.cumul + n }; await this.save(); this.listeners.forEach((f) => f(n, raison)); }
  onChange(f) { this.listeners.add(f); }
  // une étoile de diamant (nom interne : dorees) ou arc-en-ciel
  async special(kind, n = 1) { this.st = { ...this.st, [kind]: (this.st[kind] ?? 0) + n }; await this.save(); }
  // les réserves : étoiles de diamant et arc-en-ciel pas encore dépensées
  get doreesDispo() { return (this.st.dorees ?? 0) - (this.st.doreesDepensees ?? 0); }
  get arcDispo() { return (this.st.arcEnCiel ?? 0) - (this.st.arcDepensees ?? 0); }
  // les cartes possédées (légendaires comprises)
  get count() { return Object.keys(this.owned).length; }
  // les zones ouvertes
  zoneOpen(id) { return this.zones.ouvertes.includes(id); }
  // ---------------------------------------------------------------- la boutique
  // le rythme : « arrivages » (par défaut, cartes.json) ou « libre » (réglage du parent)
  get mode() { return this.rythme ?? this.c?.boutique?.mode ?? "arrivages"; }
  async setMode(m) { this.rythme = m; await this.store.setSetting?.("boutiqueRythme", m); }
  // combien de créatures sont arrivées en vitrine (mode Arrivages) : la base, plus `parSemaine` par semaine d'école commencée
  // depuis elle ; en mode Libre, ou sans calendrier, toutes
  nbArrivees(now = Date.now()) { return this.mode === "libre" ? Infinity : quotaAt(this.base, this.cal, now, { parSemaine: this.c.boutique.parSemaine, max: Infinity }); }
  arrived(now = Date.now()) { return arrivees(this.c, this.owned, this.zones.ouvertes, this.nbArrivees(now), this.ordre); }
  // l'état de chaque place de la vitrine (Map id -> état), à l'instant `now` (une visite garde le sien : le passage du dimanche
  // au lundi en pleine visite ne change rien sous le doigt de l'enfant)
  vitrine(now = Date.now()) { const ctx = { owned: this.owned, open: this.zones.ouvertes, arrived: this.arrived(now) }; return new Map(this.c.cartes.map((c) => [c.id, etatPlace(c, ctx)])); }
  carte(id) { return this.c.cartes.find((c) => c.id === id) ?? null; }
  cout(id, etat) { const c = this.carte(id); return c ? coutPlace(this.c.boutique, c, etat) : null; }
  // un achat est-il possible ? (une créature à vendre, ou à faire briller, avec assez d'étoiles)
  peutAcheter(now = Date.now()) { for (const [id, e] of this.vitrine(now)) { const k = this.cout(id, e); if (k !== null && this.total >= k) return true; } return false; }
  // les créatures arrivées, pas encore dans le récif, et pas encore annoncées (fin de séance, entrée de la boutique)
  nouvelles(now = Date.now()) { const v = this.vitrine(now); return this.ordre.filter((id) => v.get(id) === "vendre" && !this.bq.annoncees.includes(id)); }
  // les créatures arrivées dont la tuile n'a pas encore été touchée (leur halo)
  aVoir(now = Date.now()) { const v = this.vitrine(now); return new Set(this.ordre.filter((id) => v.get(id) === "vendre" && !this.bq.vues.includes(id))); }
  async annoncer(ids) { if (!ids.length) return; this.bq = { ...this.bq, annoncees: uniq([...this.bq.annoncees, ...ids]) }; await this.store.put("recompenses", this.bq); }
  async voir(id) { if (this.bq.vues.includes(id)) return; this.bq = { ...this.bq, vues: [...this.bq.vues, id] }; await this.store.put("recompenses", this.bq); }
  async visite() { const premiere = !this.bq.visites; this.bq = { ...this.bq, visites: (this.bq.visites ?? 0) + 1 }; await this.store.put("recompenses", this.bq); return premiere; }
  // ACHETER (ou faire briller) : tout se décide et se range en mémoire AVANT la première attente (un second toucher, même
  // très rapide, voit la créature déjà achetée et n'achète rien), puis les étoiles, la collection et le journal sont écrits
  // en une seule transaction (jamais à moitié) ; l'animation vient après. Renvoie ce qui s'est passé, ou null (rien acheté).
  acheter(id, now = Date.now(), rnd = Math.random, { vitrine = null } = {}) {
    const c = this.carte(id), e = (vitrine ?? this.vitrine(now)).get(id), prix = this.cout(id, e);
    if (!c || (e !== "vendre" && e !== "terne") || prix === null || this.total < prix) return null;
    const briller = e === "terne", brillante = briller || shinyDraw(rnd, this.c.boutique.brillanteAchat ?? 0);
    this.st = { ...this.st, total: this.st.total - prix };
    const had = this.owned[id];
    this.owned = briller ? { ...this.owned, [id]: { ...had, brillante: true, brillanteLe: now } } : addCard(this.owned, c, now, brillante, "achat").owned;
    this.achats = { ...this.achats, liste: [...this.achats.liste, { t: now, carte: id, prix, briller, brillante }] };
    this.arrivee = { id, briller };
    const ecrit = this.ecrire([this.st, { id: "cartes", cartes: this.owned }, this.achats]);
    return { carte: c, prix, briller, brillante, nouvelle: !briller, ecrit };
  }
  // ---------------------------------------------------------------- entraînement libre
  // un niveau franchi pendant l'entraînement libre : l'étoile arc-en-ciel attend la séance suivante
  async arcFromFree() { await this.special("arcLibre"); }
  // à la récompense : les étoiles arc-en-ciel de l'entraînement libre rejoignent la réserve ; renvoie leur nombre
  async collectFree() { const n = this.st.arcLibre ?? 0; if (n) { this.st = { ...this.st, arcLibre: 0, arcEnCiel: (this.st.arcEnCiel ?? 0) + n }; await this.save(); } return n; }
  // ---------------------------------------------------------------- zones
  // la zone qui s'ouvrirait si une étoile arc-en-ciel était disponible
  nextZone() { return this.c ? nextZone(this.c, this.owned, this.zones.ouvertes) : null; }
  // ouvre la zone suivante en dépensant une étoile arc-en-ciel, et offre son premier habitant : une commune de la zone tirée au
  // hasard (décision du parent du 10 octobre 2026), jamais une rare ; renvoie { zone, habitant } (habitant : comme win), ou null
  async openZone(now = Date.now(), rnd = Math.random) {
    const z = this.nextZone();
    if (!z || this.arcDispo < 1) return null;
    this.zones = { ...this.zones, ouvertes: [...this.zones.ouvertes, z.id], dates: { ...this.zones.dates, [z.id]: now } };
    this.st = { ...this.st, arcDepensees: (this.st.arcDepensees ?? 0) + 1 };
    const communes = this.c.cartes.filter((c) => c.zone === z.id && c.rarete === "commune" && !this.owned[c.id] && ready(c));
    const offerte = communes.length ? communes[Math.min(communes.length - 1, Math.floor(rnd() * communes.length))] : null;
    if (offerte) this.owned = addCard(this.owned, offerte, now, false, "zone").owned;
    await this.ecrire([this.zones, this.st, { id: "cartes", cartes: this.owned }]);
    return { zone: z, ...z, habitant: offerte ? { carte: offerte, nouvelle: true, devientBrillante: false, parTirage: false, brillante: false, n: 1 } : null };
  }
  // ---------------------------------------------------------------- les coquillages des occasions
  // range une carte gagnée (tirage de la brillante compris) et renvoie ce qu'il faut montrer
  async win(card, rnd, now, origine = null) {
    const r = addCard(this.owned, card, now, shinyDraw(rnd, shinyChance(this.c)), origine);
    this.owned = r.owned;
    await this.store.put("recompenses", { id: "cartes", cartes: this.owned });
    return { carte: card, nouvelle: r.nouvelle, devientBrillante: r.devientBrillante, parTirage: r.parTirage, brillante: this.owned[card.id].brillante, n: this.owned[card.id].n };
  }
  // une créature possédée devient brillante (le coquillage de la série)
  async shine(card, now) {
    const had = this.owned[card.id];
    this.owned = { ...this.owned, [card.id]: { ...had, brillante: true, brillanteLe: now } };
    await this.store.put("recompenses", { id: "cartes", cartes: this.owned });
    return { carte: card, nouvelle: false, devientBrillante: true, parTirage: false, brillante: true, rendueBrillante: true, n: had.n };
  }
  // le coquillage de la série (toutes les 10 séances) : il fait briller une créature possédée tirée au hasard ; si toutes brillent
  // déjà, il rapporte des étoiles (serie.coquillageEtoiles) ; renvoie { carte… } (comme shine) ou { etoiles }
  async serieShell(rnd = Math.random, now = Date.now()) {
    const ternes = this.c.cartes.filter((c) => this.owned[c.id] && !this.owned[c.id].brillante);
    if (ternes.length) return this.shine(ternes[Math.min(ternes.length - 1, Math.floor(rnd() * ternes.length))], now);
    return { etoiles: this.c.serie.coquillageEtoiles ?? 20 };
  }
  // la légendaire qu'un coquillage de diamant donnerait maintenant (une étoile de diamant en réserve, une légendaire gagnable :
  // sa zone ouverte et finie), ou null
  goldenCard() {
    if (!this.c || this.doreesDispo < 1) return null;
    return legendaryFor(this.c, this.owned, this.zones.ouvertes);
  }
  // ouvre un coquillage de diamant : dépense une étoile de diamant (pas d'étoiles de mer) ; renvoie comme win
  async openGolden(rnd = Math.random, now = Date.now()) {
    const card = this.goldenCard(now);
    if (!card) return null;
    this.st = { ...this.st, doreesDepensees: (this.st.doreesDepensees ?? 0) + 1, coquillagesDores: (this.st.coquillagesDores ?? 0) + 1 };
    await this.save();
    return this.win(card, rnd, now, "diamant");
  }
  // fin de séance : la série avance (et rapporte peut-être des étoiles, ou le coquillage de la série) ; renvoie les étoiles du
  // bonus (et `coquillage`, dans `this.coquillageSerie`)
  async endOfSession(now = Date.now()) {
    const r = nextSeries(this.serie, now, this.c.serie);
    this.serie = r.serie; await this.store.put("recompenses", { id: "serie", ...r.serie });
    this.coquillageSerie = r.coquillage;
    return r.etoiles;
  }
  // les cartes obtenues, dans l'ordre du contenu
  collection() { return (this.c?.cartes ?? []).filter((c) => this.owned[c.id]).map((c) => ({ ...c, ...this.owned[c.id] })); }
}
