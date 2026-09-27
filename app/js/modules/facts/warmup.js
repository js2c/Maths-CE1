// MODULE 2 · L'ÉCHAUFFEMENT (docs/SPEC.md, « Cadre d'une séance », étape 2 ; docs/SPEC-LOT2.md, section 3) :
// 10 à 14 faits d'addition (dus et nouveaux, places réservées), précédés, une séance sur cinq, de questions
// triviales (« 4 + 0 ») qui mesurent le temps de base. Une erreur fait revenir le fait 3 questions plus loin
// (ou à la fin). Voie rapide : si les faits nouveaux réservés passent tous directement en boîte 3, jusqu'à 3
// autres s'ajoutent à la fin. Le cran du sélecteur de difficulté (content/module2.json, crans) décide des
// faits nouveaux en plus et des formes à trou. Chaque réponse est enregistrée (magasins « reponses » et
// « faits ») ; le temps de base est rangé dans les réglages (« tempsDeBase »).
import { afterFact, catalog, expected, formFor, key, median, newFact, plan, pool, roomForNew, threshold } from "./facts.js";
import { initialFamilies, trouOpenFor, updateFamilies, withOpen } from "./families.js";

export class Warmup {
  // cran : () => le nom du cran en cours (« facile », « conseille », « dur », « tresdur ») ; nouveaux : faits
  // nouveaux déjà introduits dans la séance (limite commune)
  constructor({ store, content, rnd, seance = null, clock = () => Date.now(), cran = () => "conseille", dejaNouveaux = 0 }) {
    this.store = store; this.c0 = content; this.c = content; this.rnd = rnd; this.seance = seance; this.clock = clock; this.cran = cran; this.nouveaux = dejaNouveaux;
  }
  async load() {
    this.facts = await this.store.all("faits");
    // lot 2, étape 6 : les familles ouvertes (et leurs formes à trou) ; le plan ne pose que des faits des familles ouvertes
    this.fam = (await this.store.get("niveaux", 2)) ?? initialFamilies(this.c0, this.clock());
    this.c = withOpen(this.c0, this.fam);
    this.base = (await this.store.setting("tempsDeBase")) ?? { mesures: [] };
    return this;
  }
  get baseMs() { return median(this.base.mesures) ?? this.c.base.defautS * 1000; }
  get limitMs() { return threshold(this.c, this.baseMs, this.facts); }
  // ce que le cran change à l'échauffement (content/module2.json, crans)
  get effet() { return this.c.crans?.[this.cran()] ?? {}; }
  // la liste des questions : triviales d'abord (au premier échauffement, puis une séance sur cinq), puis les
  // faits ; n : nombre de faits voulu (10 à 14)
  questions(n, min = n) {
    const B = this.c.base, first = !this.base.mesures.length, depuis = this.base.depuis ?? 0;
    const k = first ? B.premiere : depuis + 1 >= (B.uneSeanceSur ?? 1) ? B.ensuite : 0, triv = [];
    // le compteur des séances sans mesure (les triviales reviennent une séance sur `uneSeanceSur`)
    if (!first && !this.libre) { this.base = { ...this.base, depuis: k ? 0 : depuis + 1 }; this.store.setSetting("tempsDeBase", this.base); }
    for (let i = 0; i < k; i++) { const a = 2 + Math.floor(this.rnd() * 7); triv.push(this.rnd() < 0.5 ? { a, b: 0 } : { a: 0, b: a }); }
    const e = this.effet, facts = plan(this.c, this.facts, this.clock(), n, min, { nouveaux: e.nouveaux, complementMax: e.complementMax, enPlus: e.nouveauxEnPlus ?? 0, dejaNouveaux: this.nouveaux, familleSuivante: !!e.familleSuivante });
    // les faits nouveaux au-delà des places réservées sans bonus (cran au-dessus) : retirés si le cran redescend
    let base = this.c.placesReservees ?? 3; this.bonus = new Set();
    for (const f of facts) if (f.nouveau && !f.anticipe && base-- <= 0 && e.nouveauxEnPlus) this.bonus.add(f.fait);
    for (const f of facts) if (this.bonus.has(f.fait)) f.bonus = true;
    this.reserved = facts.filter((f) => f.nouveau).length; this.fast = 0; this.extras = false;
    this.queue = [...triv.map((t) => ({ ...t, fait: key(t.a, t.b), base: true })), ...facts];
    return this.queue;
  }
  // juste avant de poser une question : sa forme (selon le cran en cours) ; null si elle n'a plus lieu d'être
  // (second passage d'un fait nouveau qui vient d'entrer en boîte 3 : la voie rapide l'a déjà validé)
  prepare(q) {
    if (q.anticipe && q.nouveau) { const cur = this.facts.find((f) => f.fait === q.fait); if (cur && cur.boite > 1) return null; }
    if (!q.forme) q.forme = formFor(this.facts.find((f) => f.fait === q.fait) ?? q, this.effet.trouDesBoite, this.rnd, { trouFamille: !q.base && trouOpenFor(this.c, this.fam, q.a, q.b), directe: this.cran() === "facile" && this.notion });
    return q;
  }
  // fin de l'étape : les familles (ouverture de la suivante, famille acquise, formes à trou) ; renvoie les
  // événements (une famille acquise rapporte une étoile arc-en-ciel, session.levelUp)
  async families(now = this.clock()) {
    const { st, events } = updateFamilies(this.c0, this.fam, this.facts, now, { seance: this.libre ? null : this.seance });
    this.fam = st; this.c = withOpen(this.c0, st);
    await this.store.put("niveaux", st);
    return events;
  }
  // le cran vient de redescendre (protection) : les faits nouveaux « bonus » pas encore posés sont retirés
  // (avec leurs seconds passages)
  drop(rest) { for (let i = rest.length - 1; i >= 0; i--) if (rest[i].bonus && !this.facts.some((f) => f.fait === rest[i].fait)) rest.splice(i, 1); }
  // enregistre une réponse ; renvoie { juste, rapide, etoiles, ajoutes } ; une erreur replace le fait plus
  // loin dans la file ; la voie rapide peut ajouter des faits nouveaux à la fin (`ajoutes`)
  async record(q, r, rest) {
    const now = this.clock(), forme = q.base ? "base" : q.forme ?? "directe", juste = r.value === expected({ ...q, forme });
    await this.store.add("reponses", {
      t: now, seance: this.seance, module: 2, niveau: q.famille ?? 0, question: describeFact(q, forme), forme, donnee: r.value, attendue: expected({ ...q, forme }),
      juste, tempsMs: r.ms, ecoutes: r.listens, aide: !!r.aide, erreur: juste ? null : r.nsp ? "NSP" : "autre", revient: !!q.revient, anticipe: !!q.anticipe,
      ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(this.libre ? { libre: true } : {}), ...(q.guide ? { guide: true } : {}), ...(q.passe ? { passe: true } : {}), ...(this.notion ? { notion: true } : {}), ...(this.defi ? { defi: true } : {}), ...(this.cran() !== "conseille" ? { cran: this.cran() } : {}),
    });
    if (q.base) {
      // temps de base : seulement les réponses justes, on garde les dernières
      if (juste) { this.base = { ...this.base, mesures: [...this.base.mesures, r.ms].slice(-this.c.base.garder) }; await this.store.setSetting("tempsDeBase", this.base); }
      return { juste, etoiles: juste ? 1 : 0, ajoutes: 0 };
    }
    const known = this.facts.find((f) => f.fait === q.fait), cur = known ?? q, limit = this.limitMs;
    if (!known && q.nouveau) this.nouveaux++;
    const { nouveau, anticipe, revient, bonus, forme: _f, extra, ...clean } = cur; void nouveau; void anticipe; void revient; void bonus; void _f; void extra;
    // une question qui revient, ou un second passage, ne fait pas monter de boîte (mais une erreur fait redescendre)
    const f = afterFact(this.c, clean, { juste, ms: r.ms, aide: r.aide, anticipe: q.anticipe || q.revient, seance: this.seance, forme }, limit, now);
    this.facts = [...this.facts.filter((x) => x.fait !== f.fait), f];
    await this.store.put("faits", f);
    if (!juste && !q.revient) rest.splice(Math.min(rest.length, 3), 0, { ...q, revient: true });
    // voie rapide : les faits nouveaux réservés sont tous entrés en boîte 3 -> jusqu'à 3 autres à la fin
    let ajoutes = 0;
    if (q.nouveau && !q.anticipe && !q.revient && f.historique.at(-1).voieRapide && ++this.fast === this.reserved && !this.extras && this.c.voieRapide) {
      this.extras = true;
      const queued = new Set(rest.map((x) => x.fait)), fresh = pool(this.c, { familleSuivante: !!this.effet.familleSuivante }).filter((x) => !queued.has(x.fait) && !this.facts.some((y) => y.fait === x.fait));
      const room = Math.min(this.c.voieRapide.ajoutMax, roomForNew(this.c, this.facts, this.nouveaux + rest.filter((x) => x.nouveau && !x.anticipe && !x.revient).length));
      for (const x of fresh.slice(0, room)) { rest.push({ ...newFact(x, now), extra: true }); ajoutes++; }
    }
    return { juste, rapide: juste && r.ms < limit, etoiles: juste ? (q.revient ? 2 : 1) : 0, ajoutes };
  }
}
// la question telle que le parent la lira dans l'historique
export const describeFact = (q, forme = q.forme) => (forme === "trouDroite" ? `${q.a} + ? = ${q.a + q.b}` : forme === "trouGauche" ? `? + ${q.b} = ${q.a + q.b}` : `${q.a} + ${q.b}`);
export { catalog };
