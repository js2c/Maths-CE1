// MODULE 2 · LA NOTION DU JOUR (lot 2, étape 6 ; docs/SPEC-LOT2.md, section 3, « Le module 2 comme notion du
// jour »). Même interface que Module1Runner (session/notion.js : next, record, entryLesson, lessonPlayed,
// lessonSeen, finish, simpler) ; l'enregistrement des réponses et la révision espacée sont ceux de
// l'échauffement (warmup.js : mêmes boîtes, une boîte au plus par séance, limite commune de faits nouveaux).
//  - la famille en cours : la plus basse des familles ouvertes pas encore acquise (sinon le mélange) ;
//  - la première fois qu'une famille est la notion du jour : sa leçon (L4 doubles, L5 amis de 10, L6 maison),
//    sinon deux exemples guidés avec l'appui visuel de la famille (session/notion.js) ;
//  - au moins la moitié des questions sur les faits de la règle de la famille en cours (faits nouveaux compris,
//    dans la limite commune de la séance et de la boîte 1), le reste sur les faits introduits les plus faibles
//    des autres familles (boîte la plus basse, puis temps médian le plus long) ; un même fait au plus 3 fois ;
//  - une erreur fait revenir le fait 3 questions plus loin ; 3 erreurs sur 5 : la leçon de la famille (une fois
//    par séance) puis un fait déjà bien su ;
//  - une famille acquise pendant la séance est un niveau franchi (événement « montee » : étoile arc-en-ciel) ;
//  - sélecteur de difficulté (module2.json, notion.crans) : « plus facile » = formes directes de la famille en
//    cours, aide affichée d'emblée ; « plus dur » = formes à trou et faits de la famille suivante ; « très dur » =
//    formes à trou, toutes les familles ouvertes mêlées, et la famille suivante.
import { aidFor, catalog, familyOf, formFor, key, newFact, roomForNew, ruleFacts } from "./facts.js";
import { currentFamily, isAcquired, trouOpenFor, updateFamilies } from "./families.js";
import { Warmup } from "./warmup.js";

export class Module2Runner {
  constructor({ store, content, rnd, seance = null, clock = () => Date.now(), cran = () => "conseille", dejaNouveaux = 0 }) {
    this.store = store; this.c0 = content; this.rnd = rnd; this.seance = seance; this.clock = clock; this.cran = cran;
    this.w = new Warmup({ store, content, rnd, seance, clock, cran, dejaNouveaux }); this.w.notion = true;
    this.replays = []; this.asked = new Map(); this.last = []; this.k = 0; this.win = []; this.count = 0; this.ok = 0;
    this.played = new Set(); this.simpler = false; this.events = [];
  }
  async load() { await this.w.load(); this.fam = this.w.fam; this.famille = currentFamily(this.c0, this.fam); return this; }
  get c() { return this.w.c; }
  get N() { return this.c0.notion ?? { partFamille: 0.5, memeFaitMax: 3, difficulte: { sur: 5, erreurs: 3 }, crans: {} }; }
  get effet() { return this.N.crans?.[this.cran()] ?? {}; }
  get nouveaux() { return this.w.nouveaux; }
  // la leçon de la famille, la première fois qu'elle est la notion du jour (jamais vue, pas encore jouée dans la séance)
  entryLesson() {
    const l = familyOf(this.c0, this.famille)?.lecon;
    return l && !(this.fam.lecons ?? []).includes(l) && !(this.fam.notion ?? []).includes(this.famille) && !this.played.has(l) ? l : null;
  }
  lessonPlayed(id) { this.played.add(id); }
  async lessonSeen(id) { (this.fam.lecons ??= []).includes(id) || this.fam.lecons.push(id); await this.save(); }
  // l'appui visuel et la famille d'une question (pour l'écran)
  cfgOf(f) { return { famille: this.famille, aide: familyOf(this.c0, f.famille)?.aide }; }

  // ---------------------------------------------------------------- le choix des faits
  facts() { return this.w.facts; }
  stored(fait) { return this.w.facts.find((f) => f.fait === fait); }
  // les faits de la règle de la famille en cours (le mélange : tous les faits introduits) ; cran « très dur » :
  // toutes les familles ouvertes ; plus (dur, très dur) la famille suivante, même pas encore ouverte
  familyPool() {
    const e = this.effet, ids = new Set(e.melange ? this.fam.ouvertes : [this.famille]);
    if (e.familleSuivante) { const nx = this.c0.familles.find((f) => !this.fam.ouvertes.includes(f.id)); if (nx) ids.add(nx.id); }
    const cat = new Map(catalog(this.c0).map((f) => [f.fait, f])), out = new Map();
    for (const id of ids) for (const r of familyOf(this.c0, id)?.regle === "melange" ? [...cat.values()].filter((f) => this.stored(f.fait)) : ruleFacts(this.c0, id)) out.set(r.fait, cat.get(r.fait));
    return [...out.values()];
  }
  weakest(list) {
    const score = (f) => { const s = this.stored(f.fait); return [s?.boite ?? 0, -(s?.tempsMedian ?? 0)]; };
    return [...list].sort((x, y) => { const [a1, a2] = score(x), [b1, b2] = score(y); return a1 - b1 || a2 - b2; });
  }
  usable(f) { return (this.asked.get(f.fait) ?? 0) < this.N.memeFaitMax && !this.last.slice(-2).includes(f.fait); }
  // un fait de la famille : un fait nouveau une fois sur deux s'il y en a et si la place le permet, sinon le plus faible déjà rencontré
  pickFamily(allowNew = true) {
    const pool = this.familyPool(), fresh = pool.filter((f) => !this.stored(f.fait) && !this.asked.has(f.fait));
    const room = roomForNew(this.c, this.w.facts, this.w.nouveaux);
    if (allowNew && fresh.length && room > 0 && (this.k % 2 === 0 || !pool.some((f) => this.stored(f.fait) && this.usable(f)))) return newFact(fresh[0], this.clock());
    const known = this.weakest(pool.filter((f) => this.stored(f.fait) && this.usable(f)));
    return known[0] ? { ...this.stored(known[0].fait), famille: known[0].famille } : null;
  }
  // un fait d'une autre famille : les plus faibles des faits introduits hors de la règle de la famille en cours
  pickOther() {
    const inFam = new Set(this.familyPool().map((f) => f.fait)), cat = new Map(catalog(this.c0).map((f) => [f.fait, f]));
    const list = this.weakest(this.w.facts.filter((f) => !inFam.has(f.fait) && cat.has(f.fait) && this.usable(f)));
    return list[0] ? { ...list[0], famille: cat.get(list[0].fait).famille } : null;
  }
  // un fait déjà bien su (question plus simple, pour finir sur une réussite ou après une difficulté)
  pickEasy() { const s = [...this.w.facts].filter((f) => this.usable(f)).sort((x, y) => y.boite - x.boite || (x.tempsMedian ?? 9e9) - (y.tempsMedian ?? 9e9)); return s[0] ?? null; }
  question(f, { guide = false } = {}) {
    const cat = catalog(this.c0).find((x) => x.fait === f.fait), e = this.effet;
    const q = { ...f, a: cat.a, b: cat.b, famille: f.famille ?? cat.famille, fait: f.fait };
    delete q.forme;
    q.forme = guide ? "directe" : formFor(this.stored(f.fait) ?? q, null, this.rnd, { trouFamille: !!e.trou || trouOpenFor(this.c0, this.fam, q.a, q.b), directe: !!e.directe });
    if (guide) q.guide = true;
    if (e.aideDEmblee) q.aideDEmblee = true;
    // l'appui visuel : celui de la famille en cours si le fait relève de sa règle, sinon celui de sa famille
    const cur = familyOf(this.c0, this.famille), own = familyOf(this.c0, q.famille)?.aide;
    q.appui = cur?.aide !== "fait" && ruleFacts(this.c0, cur.id).some((r) => r.fait === q.fait) ? cur.aide : own && own !== "fait" ? own : aidFor(q.a, q.b);
    return q;
  }
  next({ guide = false } = {}) {
    if (!guide) this.replays.forEach((r) => r.in--);
    const due = guide ? -1 : this.replays.findIndex((r) => r.in <= 0);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ ...r.q, revient: true }); }
    let f = null;
    if (this.simpler) { this.simpler = false; f = this.pickEasy(); }
    // exemples guidés : un fait de la famille déjà rencontré de préférence (l'exemple montre la méthode)
    if (!f && guide) f = this.pickFamily(false) ?? this.pickFamily(true);
    // au moins la moitié sur la famille en cours : une question sur deux (toutes au cran « plus facile »)
    const famTurn = this.effet.familleSeule || this.N.partFamille >= 1 || (this.k % 2 === 0);
    if (!f) f = famTurn ? this.pickFamily() ?? this.pickOther() : this.pickOther() ?? this.pickFamily();
    // plus rien d'utilisable (tout a été posé 3 fois) : le plus faible de la famille, sans la limite
    if (!f) { const p = this.weakest(this.familyPool().filter((x) => this.stored(x.fait))); f = p[0] ? this.stored(p[0].fait) : newFact(this.familyPool()[0], this.clock()); }
    if (!guide) this.k++;
    return this.ret(this.question(f, { guide }));
  }
  ret(q) { this.asked.set(q.fait, (this.asked.get(q.fait) ?? 0) + 1); this.last.push(q.fait); return { q, cfg: this.cfgOf(q) }; }

  // ---------------------------------------------------------------- une réponse
  // r (screen.ask) : { q, value, ok, ms, listens, aide, nsp, correctionPassee }
  async record(r, cfg) {
    void cfg;
    const q = r.q, events = [], scratch = [];
    const res = await this.w.record(q, { value: r.value, ms: r.ms, listens: r.listens, aide: !!r.aide && !q.aideDEmblee || !!q.guide, nsp: r.nsp, correctionPassee: r.correctionPassee }, scratch);
    if (q.guide) return { etoiles: res.juste ? 1 : 0, events };
    this.count++; if (res.juste) this.ok++;
    // l'erreur : le fait revient 3 questions plus loin (une seule fois)
    if (!res.juste && !q.revient) this.replays.push({ q: { ...q, revient: undefined }, in: 3 });
    // difficulté persistante : la leçon de la famille (une fois par séance), puis un fait déjà bien su
    const D = this.N.difficulte; this.win = [...this.win, res.juste].slice(-D.sur);
    if (this.win.length >= D.sur && this.win.filter((x) => !x).length >= D.erreurs) {
      this.win = []; this.simpler = true;
      const l = familyOf(this.c0, this.famille)?.lecon;
      if (l && !this.played.has(l)) { this.played.add(l); events.push({ type: "lecon", id: l, raison: "difficulte" }); }
    }
    // la famille en cours vient d'être acquise : un niveau franchi (étoile arc-en-ciel), on passe à la suivante
    if (!this.fam.acquises.includes(this.famille) && familyOf(this.c0, this.famille)?.regle !== "melange" && isAcquired(this.c0, this.w.facts, this.famille)) {
      this.fam = { ...this.fam, acquises: [...this.fam.acquises, this.famille], obtenus: [...(this.fam.obtenus ?? []), { famille: this.famille, date: this.clock() }] };
      this.w.fam = this.fam; events.push({ type: "montee", famille: this.famille }); this.events.push({ type: "acquise", famille: this.famille });
      await this.save();
    }
    return { etoiles: res.etoiles, events };
  }
  // fin : la famille a été la notion du jour ; ouverture de la suivante, formes à trou ; taux de la séance
  async finish() {
    if (!(this.fam.notion ?? []).includes(this.famille)) this.fam = { ...this.fam, notion: [...(this.fam.notion ?? []), this.famille] };
    const { st, events } = updateFamilies(this.c0, this.fam, this.w.facts, this.clock(), { seance: this.seance });
    this.fam = st; this.w.fam = st; await this.save();
    return { rate: this.count ? this.ok / this.count : null, events: [...this.events, ...events] };
  }
  save() { return this.store?.put("niveaux", this.fam); }
}
export { key };
