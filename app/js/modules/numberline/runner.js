// MODULE 1 · LE DÉROULEMENT DES QUESTIONS (la « notion du jour » quand c'est la ligne graduée).
// Il choisit la question suivante, applique les règles d'adaptation (progress.js), enregistre chaque
// réponse dans la base et signale ce que la séance doit faire (leçon à relancer, niveau franchi).
//  - formats : ceux du niveau, en alternance ;
//  - après une erreur, la même question revient 3 à 5 questions plus loin (docs/SPEC.md) ; réussie, c'est
//    une « erreur corrigée » (une étoile de plus) ;
//  - difficulté persistante (3 erreurs sur 5) : la leçon du niveau est relancée si elle existe, puis une
//    question plus simple (niveau inférieur, ou au niveau 1 une cible proche de 0) ;
//  - la même erreur deux fois dans la séance relance la leçon correspondante (E1 -> L1, E2 -> L2, E3 -> L3, E6 -> L10) ;
//  - leçon d'entrée : L1 au niveau 1, L3 au niveau 4, L2 au niveau 5, L10 au niveau 9 (lot 2, étape 8), la première fois ;
//  - « je ne sais pas » : une erreur de code NSP (elle compte pour l'adaptation et la question revient) ;
//  - correction passée (bouton « passer ») : notée `correctionPassee`, rien d'autre ne change (pas
//    d'étoile, la question revient comme après toute erreur) ;
//    `libre` : entraînement libre (réponses marquées « libre », mêmes règles d'adaptation, pas d'étoiles) ;
//  - lot 2 (docs/SPEC-LOT2.md, sections 2 et 4) : la voie rapide peut faire franchir plusieurs niveaux dans une
//    séance (avec la leçon d'entrée de chaque niveau) ; une même leçon au plus une fois par séance : si la
//    difficulté persiste ensuite, les questions suivantes sont prises au niveau inférieur et la prochaine
//    erreur est corrigée à vitesse 1 (`lent`) au lieu de relancer la leçon ; sélecteur de difficulté :
//    `offset()` (écart du cran au conseillé, -1 à 2) décale le niveau joué, borné au premier et au dernier
//    niveau ; réussir au-dessus du conseillé (règle habituelle, ou voie rapide) valide ce niveau et fait
//    monter le conseillé au suivant ; échouer au-dessus ne le fait jamais baisser (la protection de la
//    séance redescend le cran, session.js) et ces questions ne comptent pas dans le taux de la séance ;
//  - lot 3 (docs/SPEC-LOT3.md, section 2) : le niveau choisi par l'enfant (`choix`, écran « choisir ») : toutes
//    les questions sont posées à ce niveau (le cran ne le décale plus ; une question « plus simple » reste à ce
//    niveau, avec une cible facile) ; au-dessus du conseillé, le réussir le valide et le conseillé passe au niveau
//    suivant ; en dessous ou au-dessus, ces questions ne comptent jamais pour faire redescendre le conseillé.
import { afterAnswer, afterSession, initialLevelState } from "../progress.js";
import { applyCran, questionKey, toleranceFor } from "./generator.js";
import { MANQUE, Variete } from "../variete.js";

// lot 2, étape 8 : L10 (les centaines) à l'entrée du niveau 9, et quand E6 (dizaines et centaines confondues) revient
export const LESSON_OF_ERROR = { E1: "L1", E2: "L2", E3: "L3", E6: "L10" };
export const LESSON_OF_LEVEL = { 1: "L1", 4: "L3", 5: "L2", 9: "L10" };

export class Module1Runner {
  // screen : l'écran (generate) ; store : la base ; content : module1.json ; rnd : hasard
  // offset : () => l'écart du cran choisi au conseillé (session.offset)
  // choix : le niveau choisi par l'enfant (écran « choisir », lot 3), sinon null (« jouer » : le conseillé décalé du cran)
  // variete : les règles de la réponse qui varie (lot 3 bis, content/seance.json, `variete`)
  constructor({ screen, store, content, rnd, seance = null, offset = () => 0, cran = () => null, choix = null, variete = {} }) {
    this.var = new Variete(variete); this.screen = screen; this.store = store; this.content = content; this.rnd = rnd; this.seance = seance; this.offset = offset; this.cran = cran; this.choix = choix;
    this.levels = content.niveaux; this.rules = content.reglesAdaptation;
    this.replays = []; this.recent = []; this.errors = {}; this.count = 0; this.ok = 0; this.k = 0; this.simpler = false;
    this.played = new Set(); this.lower = false; this.slowNext = false; this.up = null; this.rateN = 0; this.rateOk = 0;
  }
  // le niveau joué : le conseillé décalé du cran, borné au premier et au dernier niveau
  eff() { return Math.min(this.levels.length, Math.max(1, this.choix ?? this.st.niveau + (this.offset() ?? 0))); }
  async load() {
    this.st = (await this.store?.get("niveaux", 1)) ?? initialLevelState(1); this.st.justesNiveau ??= 0;
    // (lot « Correctifs », écart 5.4 : les estimations justes comptées par niveau ; une base d'avant reprend celles du conseillé)
    if (!this.st.estimer) this.st.estimer = this.cfg().formats.includes("estimer") && this.st.justesNiveau ? { [this.st.niveau]: this.st.justesNiveau } : {};
    return this;
  }
  // lot « Correctifs » (écart 5.4, décision du parent du 6 octobre 2026) : la tolérance d'« estimer » se resserre d'après les
  // estimations justes du niveau joué, qu'il soit le conseillé ou non (avant : seulement au conseillé)
  justesEstimer(n) { return this.st.estimer?.[n] ?? 0; }
  cfg(n = this.st.niveau) { return this.levels[Math.min(this.levels.length, Math.max(1, n)) - 1]; }
  // la leçon à jouer avant de commencer, s'il y en a une pour ce niveau et qu'elle n'a jamais été vue
  entryLesson() { const l = LESSON_OF_LEVEL[this.eff()]; return l && !this.st.lecons.includes(l) && !this.played.has(l) ? l : null; }
  // une leçon jouée dans cette séance (vue, passée ou arrêtée) : elle ne sera pas relancée
  lessonPlayed(id) { this.played.add(id); }
  async lessonSeen(id) { if (!this.st.lecons.includes(id)) this.st.lecons.push(id); await this.save(); }
  // la question suivante : une question qui revient, sinon une nouvelle
  // `guide` : un exemple guidé (docs/SPEC.md, « Notion du jour ») : jamais une question qui revient
  // `format` : le format voulu s'il existe au niveau (après une leçon : « lire », celui de la leçon)
  next({ guide = false, format: want = null } = {}) {
    if (!guide) this.replays.forEach((r) => r.in--);
    // (lot 3 bis : un retour qui ferait une troisième fois de suite la même réponse, ou une suite prévisible, attend la suivante)
    const due = guide || this.simpler ? -1 : this.replays.findIndex((r) => r.in <= 0 && this.var.cost(this.cand(r.q), { retour: true }) < 50);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ q: { ...r.q, revient: true }, cfg: r.cfg }); }
    // difficulté persistante après la leçon déjà vue dans la séance : le niveau inférieur jusqu'à la fin
    // (niveau choisi : jamais d'autre niveau que le sien ; la question « plus simple » y prend une cible facile)
    const lv = this.eff() - (this.lower && this.choix == null ? 1 : 0);
    let cfg = this.cfg(Math.max(1, lv)), opts = { eviter: this.recent.slice(-3), ...(lv < 1 ? { eviter: [5, 6, 7, 8, 9, 10] } : {}) };
    if (this.simpler) { this.simpler = false; if (lv > 1 && this.choix == null) cfg = this.cfg(lv - 1); else if (lv === 1) opts = { ...opts, eviter: [5, 6, 7, 8, 9, 10] }; }
    // lot 3 : niveau choisi, le cran rend ce niveau plus facile ou plus exigeant (module1.json, crans)
    if (this.choix != null) cfg = applyCran(cfg, this.cran());
    opts.k = this.k;
    const fmts = cfg.formats, format = want && fmts.includes(want) ? want : fmts[this.k++ % fmts.length];
    if (format === "estimer") opts.tolerance = toleranceFor(cfg, this.justesEstimer(cfg.niveau));
    // lot 3 bis (docs/SPEC-LOT3BIS.md, §0) : plusieurs tirages, le premier qui respecte les règles de la réponse qui varie ;
    // si le format du tour n'a plus de question possible, les autres formats du niveau ; plus rien : la notion s'arrête
    const tries = [], T = this.tries ?? 24;
    for (const f of [format, ...fmts.filter((x) => x !== format)]) {
      // (lot 3 bis, A3 : les cibles de « lire », « placer » et « estimer » tirées sans remise, module1.json, tirageSansRemise)
      const bag = this.content.tirageSansRemise && ["lire", "placer", "estimer"].includes(f) ? `${cfg.niveau}:${cfg.cran ?? ""}:${f === "estimer" ? "e" : "l"}` : null;
      for (let i = 0; i < T; i++) { const x = this.screen.generate(cfg, this.rnd, { ...opts, ...(i >= T / 2 ? { eviter: undefined } : {}), format: f, ...(bag ? { pick: this.picker(bag) } : {}), ...(f === "estimer" ? { tolerance: toleranceFor(cfg, this.justesEstimer(cfg.niveau)) } : {}) }); if (bag) x.bag = bag; tries.push(x); }
      const best = this.var.pick(tries.map((x) => this.cand(x)), (c) => ({ attente: this.waiting(c.cle) }));
      if (best.cout < MANQUE) { const q = tries[best.i]; if (cfg.cran) q.cran = cfg.cran; this.recent.push(q.answer); if (guide) q.guide = true; else if (this.slowNext) q.lent = true; return this.ret({ q, cfg }); }
    }
    return null;
  }
  // lot 3 bis : la question vue par les règles de la réponse qui varie ; ses retours prévus ; une question posée
  cand(q) { return { cle: questionKey(q), reponse: q.answer }; }
  waiting(cle) { return this.replays.filter((r) => questionKey(r.q) === cle).length; }
  ret(x) {
    this.var.note(this.cand(x.q));
    // (tirage sans remise : la cible est retirée du sac ; un fait qui revient ne compte pas)
    const q = x.q, b = q.bag && !q.revient ? this.bags?.[q.bag] : null;
    if (b) { const t = q.format === "estimer" ? q.answer : q.target; b.used.add(t); b.last = t; b.fresh = false; }
    return x;
  }
  // lot 3 bis (docs/SPEC-LOT3BIS.md, A3) : le sac d'une série de cibles ; `pick(liste, tour)` : une cible pas encore tirée de
  // la liste, au hasard ; toutes tirées et `tour` (la liste est la série entière) : un nouveau tour, dont la première n'est
  // pas la dernière du tour d'avant ; sinon null (le générateur essaie une autre liste)
  picker(key) {
    const b = ((this.bags ??= {})[key] ??= { used: new Set(), last: null, fresh: true });
    return (list, tour) => {
      let free = list.filter((t) => !b.used.has(t));
      if (!free.length) { if (!tour) return null; b.used = new Set(); b.fresh = true; free = [...list]; }
      if (b.fresh && free.length > 1) free = free.filter((t) => t !== b.last);
      return free[Math.floor(this.rnd() * free.length)];
    };
  }
  // enregistre une réponse ; renvoie { etoiles, events } (events : montee, difficulte, lecon)
  async record(r, cfg) {
    const q = r.q, events = [];
    await this.store?.add("reponses", {
      t: Date.now(), seance: this.seance, module: 1, niveau: q.niveau, question: describe(q), forme: q.format, donnee: r.value, attendue: q.answer,
      juste: r.ok, tempsMs: r.ms, ecoutes: r.listens, aide: !!q.guide, erreur: r.code, revient: !!q.revient, guide: !!q.guide,
      ...(q.passe ? { passe: true } : {}), ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(this.libre ? { libre: true } : {}), ...(this.cran() && this.cran() !== "conseille" ? { cran: this.cran() } : {}),
    });
    // un exemple guidé (la méthode vient d'être montrée) : une étoile s'il est réussi, mais il ne compte
    // ni pour les règles d'adaptation, ni pour le taux de la séance, et ne revient pas
    if (q.guide) return { etoiles: r.ok ? 1 : 0, events };
    this.count++; if (r.ok) this.ok++;
    let etoiles = r.ok ? 1 : 0;
    if (r.ok && q.revient) etoiles += 1; // erreur corrigée
    // (lot 3 bis : pas de retour pour une question déjà posée assez de fois)
    if (!r.ok && !q.revient && this.var.times(questionKey(q)) < this.var.c.memeQuestionMax) this.replays.push({ q, cfg, in: 3 + Math.floor(this.rnd() * 3) });
    if (!r.ok && q.lent) this.slowNext = false; // l'erreur corrigée lentement : c'est fait
    // le taux de la séance (redescente) : pas les questions au-dessus du conseillé (échouer au-dessus ne fait jamais baisser)
    // (niveau choisi : seulement s'il est le conseillé)
    if (this.choix == null ? q.niveau <= this.st.niveau : q.niveau === this.st.niveau) { this.rateN++; if (r.ok) this.rateOk++; }
    // une leçon à relancer ; déjà jouée dans la séance : le niveau inférieur et une correction lente à la place
    const relaunch = (id, raison) => {
      if (!this.played.has(id)) { events.push({ type: "lecon", id, raison }); this.played.add(id); return; }
      if (!this.lower) events.push({ type: "plusBas", id, raison });
      this.lower = true; this.slowNext = true;
    };
    // les règles d'adaptation ne comptent que les questions du niveau conseillé (pas les plus simples) ; lot 3 : au
    // niveau choisi, le cran « plus facile » consolide sans faire progresser (docs/SPEC-LOT2.md, section 2) ; lot
    // « Correctifs » (écart 4.2, décision du 27 septembre) : avec « jouer » aussi, même quand le niveau joué est le
    // conseillé (conseillé au niveau 1, que « plus facile » ne peut pas décaler) : ni montée, ni voie rapide
    if (q.cran === "facile" || this.cran() === "facile") { /* ni montée, ni validation */ }
    else if (q.niveau === this.st.niveau) {
      const a = afterAnswer(this.st, { juste: r.ok, aide: false, ms: r.ms }, this.rules, this.levels.length);
      this.st = { ...a.st, justesNiveau: a.events.some((e) => e.type === "montee") ? 0 : (this.st.justesNiveau ?? 0) + (r.ok ? 1 : 0) };
      events.push(...a.events);
      if (a.events.some((e) => e.type === "difficulte")) { this.simpler = true; const l = LESSON_OF_LEVEL[this.st.niveau] ?? (this.st.niveau <= 3 ? "L1" : null); if (l) relaunch(l, "difficulte"); }
      const up = a.events.find((e) => e.type === "montee"); if (up) this.climbed(events);
    } else if (q.niveau > this.st.niveau) {
      // au-dessus du conseillé (sélecteur) : une fenêtre à part pour ce niveau ; la réussir valide le niveau
      if (this.up?.niveau !== q.niveau) this.up = { ...initialLevelState(1), niveau: q.niveau, obtenus: [] };
      // (maxLevel + 1 : réussir le dernier niveau joué au-dessus le valide aussi ; le conseillé devient alors ce dernier niveau)
      const a = afterAnswer(this.up, { juste: r.ok, aide: false, ms: r.ms }, this.rules, this.levels.length + 1);
      this.up = a.st;
      const m = a.events.find((e) => e.type === "montee");
      if (m) {
        const de = this.st.niveau, now = Date.now(), to = Math.min(this.levels.length, m.a);
        this.st = { ...this.st, niveau: to, fenetre: [], vus: 0, justesNiveau: 0, obtenus: [...this.st.obtenus, { niveau: to, date: now, cran: true }] };
        events.push({ type: "montee", de, a: to, rapide: m.rapide, cran: true }); this.up = null; this.climbed(events);
      }
    }
    // une estimation juste au niveau joué (lot « Correctifs », écart 5.4 ; pas au cran « plus facile », qui consolide)
    if (q.format === "estimer" && r.ok && q.cran !== "facile" && this.cran() !== "facile") this.st = { ...this.st, estimer: { ...this.st.estimer, [q.niveau]: this.justesEstimer(q.niveau) + 1 } };
    // la même erreur deux fois dans la séance : la leçon correspondante
    // (lot 3 bis, docs/SPEC-LOT3BIS.md, A3 : L3 parle d'une corde qui ne commence pas à zéro ; elle n'est relancée que pour E3 au
    // format « lire » sur une telle corde ; E3 en « sauter », oublier le départ de la tortue, garde sa correction habituelle)
    const lessonFor = (q, code) => (code === "E3" && !(q.format === "lire" && q.min !== 0) ? null : LESSON_OF_ERROR[code]);
    if (r.code && lessonFor(q, r.code)) { this.errors[r.code] = (this.errors[r.code] ?? 0) + 1; if (this.errors[r.code] === this.rules.memeErreurLecon) relaunch(LESSON_OF_ERROR[r.code], r.code); }
    await this.save();
    return { etoiles, events };
  }
  // un niveau franchi : les questions en attente de retour sont oubliées, la leçon d'entrée du nouveau niveau
  // joué (voie rapide : plusieurs niveaux dans la même séance) ; la difficulté d'avant ne compte plus
  climbed(events) { this.replays = []; this.lower = false; const l = this.entryLesson(); if (l) { events.push({ type: "lecon", id: l, raison: "niveau" }); this.played.add(l); } }
  // fin de séance : taux de réussite (sans les questions au-dessus du conseillé), éventuelle redescente (invisible pour l'enfant)
  async finish() { const rate = this.rateN ? this.rateOk / this.rateN : null, a = afterSession(this.st, rate, this.rules); this.st = a.st; await this.save(); return { rate, events: a.events }; }
  save() { return this.store?.put("niveaux", this.st); }
}
// la question telle que le parent la lira dans l'historique
export const describe = (q) => q.format === "ecrire" ? `dictée ${q.answer}` : q.format === "sauter" ? `tortue sur ${q.min + q.start * q.step}, ${q.jumps} saut(s) -> ${q.answer}` : q.format === "estimer" ? `ligne ${q.min}-${q.max} sans graduations, placer ${q.answer} (±${q.tolerance})` : `${q.format} ${q.answer} sur la ligne ${q.min}-${q.max} (pas ${q.step})`;
