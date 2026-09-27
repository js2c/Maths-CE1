// MODULE 1 · LE DÉROULEMENT DES QUESTIONS (la « notion du jour » quand c'est la ligne graduée).
// Il choisit la question suivante, applique les règles d'adaptation (progress.js), enregistre chaque
// réponse dans la base et signale ce que la séance doit faire (leçon à relancer, niveau franchi).
//  - formats : ceux du niveau, en alternance ;
//  - après une erreur, la même question revient 3 à 5 questions plus loin (docs/SPEC.md) ; réussie, c'est
//    une « erreur corrigée » (une étoile de plus) ;
//  - difficulté persistante (3 erreurs sur 5) : la leçon du niveau est relancée si elle existe, puis une
//    question plus simple (niveau inférieur, ou au niveau 1 une cible proche de 0) ;
//  - la même erreur deux fois dans la séance relance la leçon correspondante (E1 -> L1, E2 -> L2, E3 -> L3) ;
//  - leçon d'entrée : L1 au niveau 1, L3 au niveau 4, L2 au niveau 5, la première fois ;
//  - « je ne sais pas » : une erreur de code NSP (elle compte pour l'adaptation et la question revient) ;
//  - correction passée (bouton « passer ») : notée `correctionPassee`, rien d'autre ne change (pas
//    d'étoile, la question revient comme après toute erreur) ;
//    `libre` : entraînement libre (réponses marquées « libre », mêmes règles d'adaptation, pas d'étoiles).
import { afterAnswer, afterSession, initialLevelState } from "../progress.js";
import { toleranceFor } from "./generator.js";

export const LESSON_OF_ERROR = { E1: "L1", E2: "L2", E3: "L3" };
export const LESSON_OF_LEVEL = { 1: "L1", 4: "L3", 5: "L2" };

export class Module1Runner {
  // screen : l'écran (generate) ; store : la base ; content : module1.json ; rnd : hasard
  constructor({ screen, store, content, rnd, seance = null }) {
    this.screen = screen; this.store = store; this.content = content; this.rnd = rnd; this.seance = seance;
    this.levels = content.niveaux; this.rules = content.reglesAdaptation;
    this.replays = []; this.recent = []; this.errors = {}; this.count = 0; this.ok = 0; this.k = 0; this.simpler = false;
  }
  async load() { this.st = (await this.store?.get("niveaux", 1)) ?? initialLevelState(1); this.st.justesNiveau ??= 0; return this; }
  cfg(n = this.st.niveau) { return this.levels[Math.min(this.levels.length, Math.max(1, n)) - 1]; }
  // la leçon à jouer avant de commencer, s'il y en a une pour ce niveau et qu'elle n'a jamais été vue
  entryLesson() { const l = LESSON_OF_LEVEL[this.st.niveau]; return l && !this.st.lecons.includes(l) ? l : null; }
  async lessonSeen(id) { if (!this.st.lecons.includes(id)) this.st.lecons.push(id); await this.save(); }
  // la question suivante : une question qui revient, sinon une nouvelle
  // `guide` : un exemple guidé (docs/SPEC.md, « Notion du jour ») : jamais une question qui revient
  // `format` : le format voulu s'il existe au niveau (après une leçon : « lire », celui de la leçon)
  next({ guide = false, format: want = null } = {}) {
    if (!guide) this.replays.forEach((r) => r.in--);
    const due = guide ? -1 : this.replays.findIndex((r) => r.in <= 0);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return { q: { ...r.q, revient: true }, cfg: r.cfg }; }
    let cfg = this.cfg(), opts = { eviter: this.recent.slice(-3) };
    if (this.simpler) { this.simpler = false; if (this.st.niveau > 1) cfg = this.cfg(this.st.niveau - 1); else opts = { ...opts, eviter: [5, 6, 7, 8, 9, 10] }; }
    const fmts = cfg.formats, format = want && fmts.includes(want) ? want : fmts[this.k++ % fmts.length];
    if (format === "estimer") opts.tolerance = toleranceFor(cfg, this.st.justesNiveau);
    const q = this.screen.generate(cfg, this.rnd, { ...opts, format });
    this.recent.push(q.answer);
    if (guide) q.guide = true;
    return { q, cfg };
  }
  // enregistre une réponse ; renvoie { etoiles, events } (events : montee, difficulte, lecon)
  async record(r, cfg) {
    const q = r.q, events = [];
    await this.store?.add("reponses", {
      t: Date.now(), seance: this.seance, module: 1, niveau: q.niveau, question: describe(q), forme: q.format, donnee: r.value, attendue: q.answer,
      juste: r.ok, tempsMs: r.ms, ecoutes: r.listens, aide: !!q.guide, erreur: r.code, revient: !!q.revient, guide: !!q.guide,
      ...(q.passe ? { passe: true } : {}), ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(this.libre ? { libre: true } : {}),
    });
    // un exemple guidé (la méthode vient d'être montrée) : une étoile s'il est réussi, mais il ne compte
    // ni pour les règles d'adaptation, ni pour le taux de la séance, et ne revient pas
    if (q.guide) return { etoiles: r.ok ? 1 : 0, events };
    this.count++; if (r.ok) this.ok++;
    let etoiles = r.ok ? 1 : 0;
    if (r.ok && q.revient) etoiles += 1; // erreur corrigée
    if (!r.ok && !q.revient) this.replays.push({ q, cfg, in: 3 + Math.floor(this.rnd() * 3) });
    // les règles d'adaptation ne comptent que les questions du niveau courant (pas les plus simples)
    if (q.niveau === this.st.niveau) {
      const a = afterAnswer(this.st, { juste: r.ok, aide: false, ms: r.ms }, this.rules, this.levels.length);
      this.st = { ...a.st, justesNiveau: a.events.some((e) => e.type === "montee") ? 0 : (this.st.justesNiveau ?? 0) + (r.ok ? 1 : 0) };
      events.push(...a.events);
      if (a.events.some((e) => e.type === "difficulte")) { this.simpler = true; const l = LESSON_OF_LEVEL[this.st.niveau] ?? (this.st.niveau <= 3 ? "L1" : null); if (l) events.push({ type: "lecon", id: l, raison: "difficulte" }); }
      const up = a.events.find((e) => e.type === "montee"); if (up) { this.replays = []; const l = this.entryLesson(); if (l) events.push({ type: "lecon", id: l, raison: "niveau" }); }
    }
    // la même erreur deux fois dans la séance : la leçon correspondante
    if (r.code && LESSON_OF_ERROR[r.code]) { this.errors[r.code] = (this.errors[r.code] ?? 0) + 1; if (this.errors[r.code] === this.rules.memeErreurLecon) events.push({ type: "lecon", id: LESSON_OF_ERROR[r.code], raison: r.code }); }
    await this.save();
    return { etoiles, events };
  }
  // fin de séance : taux de réussite, éventuelle redescente (invisible pour l'enfant)
  async finish() { const rate = this.count ? this.ok / this.count : null, a = afterSession(this.st, rate, this.rules); this.st = a.st; await this.save(); return { rate, events: a.events }; }
  save() { return this.store?.put("niveaux", this.st); }
}
// la question telle que le parent la lira dans l'historique
export const describe = (q) => q.format === "sauter" ? `tortue sur ${q.min + q.start * q.step}, ${q.jumps} saut(s) -> ${q.answer}` : q.format === "estimer" ? `ligne ${q.min}-${q.max} sans graduations, placer ${q.answer} (±${q.tolerance})` : `${q.format} ${q.answer} sur la ligne ${q.min}-${q.max} (pas ${q.step})`;
