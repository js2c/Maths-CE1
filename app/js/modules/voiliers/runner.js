// MODULE 4 · LE DÉROULEMENT DES VOILIERS (la notion du jour ; docs/SPEC.md, section 7 bis). Même interface que les autres
// modules pour session/notion.js (next, record, entryLesson, lessonPlayed, lessonSeen, finish, simpler).
//  - une question = un bateau : son nombre, la rangée de bouées, le bon passage ; au niveau 9 (double encadrement), la
//    seconde rangée (les dizaines) est tirée avec lui ;
//  - le niveau : le conseillé (« jouer », module imposé par le parent) ou le choisi (« choisir ») ; le cran ne change pas le
//    niveau, il change la mer (module4.json, mer) ; les règles d'adaptation sont celles des autres modules (progress.js) :
//    montée à 8 bonnes réponses sur les 10 dernières, voie rapide, redescente après deux séances sous 50 % ; au cran
//    « plus facile », ni montée ni validation ; un niveau choisi au-dessus du conseillé et réussi est validé, le
//    conseillé passe au suivant ;
//  - la rangée de bouées change tous les `nouvellesBoueesApres` bateaux, et avec le niveau ;
//  - le nombre est tiré dans un passage au hasard ; plusieurs tirages, le premier qui respecte les règles de la réponse
//    qui varie (modules/variete.js : la « réponse » est le passage, ce que fait l'enfant ; la « question », le nombre) ;
//  - un bateau rangé du premier coup : une étoile ; rangé au deuxième essai (ou, au double encadrement, une rangée sur
//    deux du premier coup) : « erreur corrigée », une étoile, mais une erreur pour l'adaptation ; manqué (deux erreurs,
//    pirates, « je ne sais pas ») : le nombre revient 3 à 5 bateaux plus loin, avec ses bouées ;
//  - pas de leçon : la première fois qu'un niveau est joué (au début de la partie, ou après une montée), un exemple guidé
//    (module4.json, exemples), donné par `next` avant le premier bateau du niveau ; la difficulté
//    persistante (3 erreurs sur 5) donne un nombre loin des bouées (`simpler`) ;
//  - la mer : celle du cran au début, puis selon les réussites et les échecs (voiliers.js, merApres) ; un changement
//    est annoncé au bateau suivant (`q.annonce`).
import { afterAnswer, afterSession, initialLevelState } from "../progress.js";
import { MANQUE, Variete } from "../variete.js";
import { genBuoys, lv, merApres, merDepart, merDuCran, passage, pickNumber, tensWindow } from "./voiliers.js";

export const initialVoiliersState = (now = Date.now()) => ({ ...initialLevelState(4, now), exemples: [] });
// la maîtrise (pour le tableau de l'espace parent ; les voiliers ne sont pas dans la rotation de « jouer »)
export const voiliersMastery = (c, st) => ((st?.niveau ?? 1) - 1) / c.niveaux.length;
// la question telle que le parent la lira dans l'historique
export const voiliersQuestion = (q) => (q.double ? `${q.num} entre ${q.bouees.join(" · ")} puis ${q.rangee2.join(" · ")}` : `${q.num} entre ${q.bouees.join(" · ")}`);
// un passage tel que le parent le lit : « avant 40 », « entre 40 et 50 », « après 60 »
export const passageTexte = (b, c) => (c <= 0 ? `avant ${b[0]}` : c >= b.length ? `après ${b.at(-1)}` : `entre ${b[c - 1]} et ${b[c]}`);

export class Module4Runner {
  // content : module4.json ; cran : () => le cran de la séance ; choix : le niveau choisi (écran « choisir »), sinon null
  constructor({ store, content, rnd, seance = null, cran = () => "conseille", choix = null, variete = {}, clock = () => Date.now() }) {
    this.var = new Variete(variete); this.store = store; this.c = content; this.rnd = rnd; this.seance = seance; this.cran = cran; this.choix = choix; this.clock = clock;
    this.rules = content.reglesAdaptation; this.levels = content.niveaux;
    this.replays = []; this.count = 0; this.ok = 0; this.simpler = false; this.up = null; this.rateN = 0; this.rateOk = 0;
    this.rangee = null; this.lastV = null; this.premier = true; this.events = [];
  }
  async load() {
    this.st = (await this.store?.get("niveaux", 4)) ?? initialVoiliersState(this.clock());
    this.st.exemples ??= []; this.st.lecons ??= [];
    this.mer = { mer: merDepart(this.c.mer, this.cran()), gains: 0, echecs: 0 }; this.merCran = this.cran();
    // une mer agitée dès le début est annoncée au premier bateau
    this.annonce = this.mer.mer === "vent" ? "vent" : this.mer.mer === "pirates" ? "pirates" : null;
    return this;
  }
  get niveau() { return this.eff(); }
  eff() { return Math.min(this.levels.length, Math.max(1, this.choix ?? this.st.niveau)); }
  cfg(n = this.eff()) { return this.levels[Math.min(this.levels.length, Math.max(1, n)) - 1]; }
  // pas de leçon dans ce module ; l'exemple guidé du niveau, la première fois qu'il est joué (`next`)
  entryLesson() { return null; }
  lessonPlayed() {}
  async lessonSeen() {}
  get exempleDu() { return !this.st.exemples.includes(this.eff()) && !!this.c.exemples?.[this.eff()]; }
  // la mer du prochain bateau (le cran a pu redescendre : la protection de la séance)
  merCourante() {
    const cran = this.cran();
    if (cran !== this.merCran) { const m = merDuCran(this.c.mer, cran, this.mer.mer); if (m !== this.mer.mer) this.annonce = m === "vent" ? "ventRetour" : "calme"; this.mer = { mer: m, gains: 0, echecs: 0 }; this.merCran = cran; }
    return this.mer.mer;
  }
  // la rangée de bouées du niveau : nouvelle au changement de niveau et tous les `nouvellesBoueesApres` bateaux
  bouees(n) {
    const L = lv(this.cfg(n)), R = this.rangee;
    if (R && R.niveau === n && R.bateaux < (this.c.nouvellesBoueesApres ?? 5)) return R;
    let kind = L.kind;
    if (kind === "alt") { this.alt = !this.alt; kind = this.alt ? "hundred" : "ten"; }
    this.rangee = { niveau: n, kind, vals: genBuoys(kind, kind === "double" ? 4 : L.n, L.max, this.rnd), bateaux: 0 };
    return this.rangee;
  }
  // la question suivante : un nombre qui revient, sinon un nouveau bateau ; `guide` : l'exemple guidé du niveau
  // (l'exemple vient aussi de lui-même avant le premier bateau d'un niveau jamais joué, au début comme après une montée)
  next({ guide = false } = {}) {
    const mer = this.merCourante(), an = () => { const a = this.annonce; this.annonce = null; return a; };
    if (guide || (this.exempleDu && !(this.donnes ??= new Set()).has(this.eff()))) {
      this.donnes?.add(this.eff());
      const n = this.eff(), ex = this.c.exemples[n], dbl = this.cfg(n).ecart === "double";
      const q = { module: 4, niveau: n, num: ex.nombre, bouees: ex.bouees, k: passage(ex.bouees, ex.nombre), double: dbl, ...(dbl ? { rangee2: ex.dizaines, k2: passage(ex.dizaines, ex.nombre) } : {}), guide: true, mer: "calme", cran: this.cran(), premier: this.premier };
      this.premier = false;
      return { q, cfg: this.cfg(n) };
    }
    this.replays.forEach((r) => r.in--);
    const due = this.simpler ? -1 : this.replays.findIndex((r) => r.in <= 0 && this.var.cost(this.cand(r.q), { retour: true }) < 50);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ q: { ...r.q, revient: true, mer, annonce: an(), premier: false, cran: this.cran() }, cfg: r.cfg }); }
    const n = this.eff(), cfg = this.cfg(n), L = lv(cfg), R = this.bouees(n), simple = this.simpler; this.simpler = false;
    // (difficulté persistante, finir sur une réussite : un nombre loin des bouées)
    const mode = simple ? { ...L, mode: "far", farD: L.max === 100 || R.kind === "ten" || R.kind === "odd" ? 3 : 20 } : L;
    const tries = [];
    for (let i = 0; i < (this.tries ?? 24); i++) {
      const v = pickNumber(R.vals, R.kind, mode, this.rnd, { lastV: this.lastV, row1: R.vals }), dbl = R.kind === "double";
      const r2 = dbl ? tensWindow(v, this.rnd) : null;
      tries.push({ module: 4, niveau: n, num: v, bouees: R.vals.slice(), ecart: R.kind, k: passage(R.vals, v), double: dbl, ...(dbl ? { rangee2: r2, k2: passage(r2, v) } : {}) });
    }
    const best = this.var.pick(tries.map((x) => this.cand(x)), (c) => ({ attente: this.replays.filter((r) => String(r.q.num) === c.cle).length }));
    if (best.cout >= MANQUE) return null;
    const q = { ...tries[best.i], mer, annonce: an(), cran: this.cran(), premier: this.premier, ...(simple ? { simple: true } : {}) };
    this.premier = false; R.bateaux++; this.lastV = q.num;
    return this.ret({ q, cfg });
  }
  // la question vue par les règles de la réponse qui varie : le nombre ; la réponse : le passage (au double encadrement, les
  // deux : 10 × celui des centaines + celui des dizaines)
  cand(q) { return { cle: String(q.num), reponse: q.double ? q.k * 10 + q.k2 : q.k }; }
  ret(x) { this.var.note(this.cand(x.q)); return x; }
  // r : { q, ok (rangé du premier coup), corrigee (au deuxième essai, ou une rangée sur deux), demi (double encadrement : une
  // rangée sur deux), choisi (le premier passage choisi), code (V1 à V4, NSP, rattrape), ms, listens, nsp, essais,
  // correctionPassee, exemplePasse }
  async record(r, cfg) {
    const q = r.q, events = [];
    await this.store?.add("reponses", {
      t: Date.now(), seance: this.seance, module: 4, niveau: q.niveau, question: voiliersQuestion(q), forme: q.guide ? "exemple" : q.mer,
      donnee: r.choisi == null ? null : passageTexte(q.bouees, r.choisi), attendue: passageTexte(q.bouees, q.k) + (q.double ? `, puis ${passageTexte(q.rangee2, q.k2)}` : ""),
      juste: !!r.ok, tempsMs: r.ms, ecoutes: r.listens, aide: false, erreur: r.ok ? null : r.code ?? null, revient: !!q.revient, guide: !!q.guide, notion: true,
      ...(r.corrigee ? { corrigee: true } : {}), ...(r.essais ? { essais: r.essais } : {}), ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(r.exemplePasse ? { exemplePasse: true } : {}),
      ...(this.libre ? { libre: true } : {}), ...(q.cran && q.cran !== "conseille" ? { cran: q.cran } : {}),
    });
    // l'exemple guidé : le bateau va seul ; rien à compter, il ne revient pas ; le niveau a eu son exemple
    if (q.guide) { if (!this.st.exemples.includes(q.niveau)) this.st.exemples.push(q.niveau); await this.save(); return { etoiles: 0, events }; }
    this.count++; if (r.ok) this.ok++;
    const etoiles = r.ok ? (q.revient ? 2 : 1) : r.corrigee ? 1 : 0;
    // manqué : le nombre revient 3 à 5 bateaux plus loin (pas une question déjà posée assez de fois)
    const [a, b] = this.rules.retourErreur ?? [3, 5];
    if (!r.ok && !r.corrigee && !q.revient && this.var.times(String(q.num)) < this.var.c.memeQuestionMax) this.replays.push({ q: { ...q, annonce: null }, cfg, in: a + Math.floor(this.rnd() * (b - a + 1)) });
    // la mer
    const m = merApres(this.c.mer, this.cran(), this.mer, r.ok ? "ok" : r.demi ? "demi" : "echec");
    this.mer = { mer: m.mer, gains: m.gains, echecs: m.echecs }; if (m.annonce) this.annonce = m.annonce;
    // le taux de la séance (redescente) : pas les bateaux au-dessus du conseillé
    if (this.choix == null ? q.niveau <= this.st.niveau : q.niveau === this.st.niveau) { this.rateN++; if (r.ok) this.rateOk++; }
    if (q.cran === "facile") { /* « plus facile » consolide sans faire progresser */ }
    else if (q.niveau === this.st.niveau) {
      const x = afterAnswer(this.st, { juste: !!r.ok, aide: false, ms: r.ms }, this.rules, this.levels.length, this.clock());
      this.st = { ...x.st, exemples: this.st.exemples };
      events.push(...x.events);
      if (x.events.some((e) => e.type === "difficulte")) this.simpler = true;
      if (x.events.some((e) => e.type === "montee")) this.climbed();
    } else if (q.niveau > this.st.niveau) {
      // au-dessus du conseillé (niveau choisi) : une fenêtre à part ; la réussir valide le niveau
      if (this.up?.niveau !== q.niveau) this.up = { ...initialLevelState(4), niveau: q.niveau, obtenus: [] };
      const x = afterAnswer(this.up, { juste: !!r.ok, aide: false, ms: r.ms }, this.rules, this.levels.length + 1, this.clock());
      this.up = x.st;
      const up = x.events.find((e) => e.type === "montee");
      if (up) {
        const de = this.st.niveau, to = Math.min(this.levels.length, up.a);
        this.st = { ...this.st, niveau: to, fenetre: [], vus: 0, obtenus: [...this.st.obtenus, { niveau: to, date: this.clock(), choix: true }] };
        events.push({ type: "montee", de, a: to, rapide: up.rapide, choix: true }); this.up = null; this.climbed();
      }
      if (x.events.some((e) => e.type === "difficulte")) this.simpler = true;
    }
    await this.save();
    return { etoiles, events, code: r.code ?? null };
  }
  // un niveau franchi : les nombres en attente sont oubliés (leurs bouées sont celles de l'ancien niveau)
  climbed() { if (this.choix == null) { this.replays = []; this.rangee = null; } }
  async finish() { const rate = this.rateN ? this.rateOk / this.rateN : null, a = afterSession(this.st, rate, this.rules, this.clock()); this.st = { ...a.st, exemples: this.st.exemples }; await this.save(); return { rate, events: a.events }; }
  save() { return this.store?.put("niveaux", this.st); }
}
