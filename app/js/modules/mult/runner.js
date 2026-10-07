// MODULE 5 · LE DÉROULEMENT DE LA MULTIPLICATION (la notion du jour ; lot « Multiplication » ; docs/SPEC.md, section 7 ter).
// Même interface que les autres modules pour session/notion.js (next, record, entryLesson, lessonPlayed, lessonSeen, finish,
// simpler), sur le modèle du calcul rapide (modules/calc/runner.js) :
//  - l'état (magasin « niveaux », clé 5) : les niveaux acquis, les questions vues à chaque niveau, la fenêtre des dernières
//    réponses de chaque niveau, les leçons vues ;
//  - le niveau conseillé : le plus bas des niveaux ouverts (module5.json, debloque : niveaux acquis) pas encore acquis ;
//  - avec « jouer » : le niveau conseillé, et une question sur cinq (melange) prise dans les niveaux déjà acquis ; avec
//    « choisir » (`choix`) : toutes les questions au niveau choisi ;
//  - déroulé d'un nouveau niveau : la leçon (L13 au niveau 1, L14 au niveau 6), puis 2 exemples guidés (les rangées
//    comptées, la réponse donnée) ; l'image des rangées : toujours là aux niveaux 1 et 2, au coquillage ailleurs (cran
//    « plus facile » : d'emblée ; « plus dur » et « très dur » : sans image ni coquillage ; « très dur » : formes à trou) ;
//  - montée (acquis) : 8 bonnes réponses sur les 10 dernières du niveau, au plus une aide, ou la voie rapide (progress.js) ;
//  - erreurs : une erreur revient 3 questions plus loin ; la même erreur (M1, M2) deux fois : la leçon L13, une fois par
//    séance ; 3 erreurs sur 5 : la leçon du niveau puis une question plus simple (un niveau acquis plus bas).
import { afterAnswer } from "../progress.js";
import { classifyMult, makeMult, multAnswer, multKey, multQuestion, multUnlocked } from "./mult.js";
import { MANQUE, Variete } from "../variete.js";

export const initialMultState = (now = Date.now()) => ({ module: 5, acquis: [], obtenus: [{ niveau: 1, date: now }], vus: {}, fenetres: {}, lecons: [], seances: 0 });
export function recommendedMult(c, st) {
  const ok = (cfg) => !st.acquis.includes(cfg.niveau) && (cfg.niveau <= (st.depart ?? 0) || multUnlocked(cfg, st.acquis));
  return c.niveaux.find(ok)?.niveau ?? Math.max(1, ...st.acquis);
}
export const multMastery = (c, st) => (st?.acquis?.length ?? 0) / c.niveaux.length;

export class Module5Runner {
  constructor({ store, content, rnd, seance = null, cran = () => "conseille", choix = null, clock = () => Date.now(), baseMs = 3000, variete = {} }) {
    this.var = new Variete(variete); this.store = store; this.c = content; this.rnd = rnd; this.seance = seance; this.cran = cran; this.choix = choix; this.clock = clock; this.baseMs = baseMs;
    this.replays = []; this.recent = []; this.errors = {}; this.played = new Set(); this.simpler = false; this.k = 0; this.count = 0; this.ok = 0; this.events = [];
  }
  async load() {
    this.st = (await this.store?.get("niveaux", 5)) ?? initialMultState(this.clock());
    for (const k of ["acquis", "obtenus", "lecons"]) this.st[k] ??= []; this.st.vus ??= {}; this.st.fenetres ??= {};
    this.niveau = this.choix ?? recommendedMult(this.c, this.st);
    return this;
  }
  cfg(n) { return this.c.niveaux[Math.min(this.c.niveaux.length, Math.max(1, n)) - 1]; }
  get effet() { return this.c.crans?.[this.cran()] ?? {}; }
  get lentMs() { return this.baseMs + (this.c.lenteurS ?? 10) * 1000; }
  entryLesson() { const l = this.cfg(this.niveau).lecon; return l && !this.st.lecons.includes(l) && !this.played.has(l) ? l : null; }
  lessonPlayed(id) { this.played.add(id); }
  async lessonSeen(id) { if (!this.st.lecons.includes(id)) this.st.lecons.push(id); await this.save(); }
  next({ guide = false } = {}) {
    if (!guide) this.replays.forEach((r) => r.in--);
    const due = guide || this.simpler ? -1 : this.replays.findIndex((r) => r.in <= 0 && this.var.cost(this.cand(r.q), { retour: true }) < 50);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ q: { ...r.q, revient: true, guide: false }, cfg: r.cfg }); }
    let n = this.niveau;
    const acquired = this.st.acquis.filter((x) => x !== n), vus = this.st.vus[n] ?? 0, D = this.c.deroule ?? { guides: 2 };
    if (this.choix == null && !guide && acquired.length && vus >= D.guides + 3 && this.rnd() < (this.c.melange ?? 0)) n = acquired[Math.floor(this.rnd() * acquired.length)];
    if (this.simpler) { this.simpler = false; const low = this.st.acquis.filter((x) => x < n); if (low.length && this.choix == null) n = low.at(-1); }
    const cfg = this.cfg(n), e = this.effet;
    // au cran « très dur », la forme à trou aux niveaux des tables, un côté puis l'autre (« 3 × ? = 12 », « ? × 4 = 12 »)
    let forme = "directe";
    if (e.trou && !guide && (this.c.trou?.niveaux ?? []).includes(n)) forme = (this.trouK = (this.trouK ?? 0) + 1) % 2 ? "trouDroite" : "trouGauche";
    const tries = [];
    for (let i = 0; i < 24; i++) { const x = makeMult(cfg, this.rnd, { eviter: i < 12 ? this.recent.slice(-6) : [] }); x.forme = forme; tries.push(x); }
    const best = this.var.pick(tries.map((x) => this.cand(x)), (c) => ({ attente: this.replays.filter((r) => multKey(r.q) === c.cle).length }));
    if (best.cout >= MANQUE) return null;
    const q = tries[best.i];
    q.cran = this.cran(); q.lentMs = this.lentMs;
    // l'image des rangées : toujours (niveaux 1 et 2, sauf « plus dur » et « très dur »), d'emblée (« plus facile »), au
    // coquillage (cran conseillé), ou pas du tout
    q.image = e.image === "non" ? "non" : cfg.image === "toujours" ? "toujours" : e.image === "emblee" ? "emblee" : "aide";
    if (q.image === "emblee") q.aideDEmblee = true;
    if (guide) q.guide = true;
    this.recent.push(`${q.a}x${q.b}`); this.k++;
    return this.ret({ q, cfg });
  }
  cand(q) { return { cle: multKey(q), reponse: multAnswer(q) }; }
  ret(x) { this.var.note(this.cand(x.q)); return x; }
  async record(r, cfg) {
    const q = r.q, events = [], code = r.nsp ? "NSP" : r.ok ? null : classifyMult(q, r.value);
    await this.store?.add("reponses", {
      t: Date.now(), seance: this.seance, module: 5, niveau: q.niveau, question: multQuestion(q), forme: q.forme, donnee: r.value, attendue: multAnswer(q),
      juste: !!r.ok, tempsMs: r.ms, ecoutes: r.listens, aide: !!r.aide, ...(q.aideDEmblee ? { aideDEmblee: true } : {}), erreur: code, revient: !!q.revient, guide: !!q.guide, notion: true,
      ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(this.libre ? { libre: true } : {}), ...(q.cran && q.cran !== "conseille" ? { cran: q.cran } : {}),
    });
    this.st.vus[q.niveau] = (this.st.vus[q.niveau] ?? 0) + 1;
    if (q.guide) { await this.save(); return { etoiles: r.ok ? 1 : 0, events }; }
    this.count++; if (r.ok) this.ok++;
    let etoiles = r.ok ? 1 : 0; if (r.ok && q.revient) etoiles += 1;
    if (!r.ok && !q.revient && this.var.times(multKey(q)) < this.var.c.memeQuestionMax) this.replays.push({ q, cfg, in: 3 });
    const relaunch = (id, raison) => { if (id && !this.played.has(id)) { this.played.add(id); events.push({ type: "lecon", id, raison }); } };
    // la fenêtre du niveau (montée), sauf au cran « plus facile » et pour un niveau déjà acquis
    if (q.cran !== "facile" && !this.st.acquis.includes(q.niveau)) {
      const w0 = { niveau: q.niveau, fenetre: this.st.fenetres[q.niveau] ?? [], vus: (this.st.essais ??= {})[q.niveau] ?? 0, obtenus: [] };
      const a = afterAnswer(w0, { juste: r.ok, aide: !!r.aide || !!q.aideDEmblee, ms: r.ms }, this.c.reglesAdaptation, 99, this.clock());
      this.st.fenetres[q.niveau] = a.st.fenetre; this.st.essais[q.niveau] = a.st.vus;
      if (a.events.some((x) => x.type === "montee")) {
        this.st.acquis = [...this.st.acquis, q.niveau]; this.st.obtenus = [...this.st.obtenus, { niveau: q.niveau, date: this.clock(), acquis: true, ...(this.choix != null ? { choix: true } : {}) }];
        delete this.st.fenetres[q.niveau];
        events.push({ type: "montee", niveau: q.niveau, rapide: a.events.find((x) => x.type === "montee").rapide });
        this.events.push({ type: "acquis", niveau: q.niveau });
        if (this.choix == null) { this.niveau = recommendedMult(this.c, this.st); this.replays = []; const l = this.entryLesson(); if (l) { this.played.add(l); events.push({ type: "lecon", id: l, raison: "niveau" }); } }
      }
      if (a.events.some((x) => x.type === "difficulte")) { this.simpler = true; relaunch(this.cfg(q.niveau).lecon, "difficulte"); }
    }
    if (code && this.c.erreurs?.[code]) { this.errors[code] = (this.errors[code] ?? 0) + 1; if (this.errors[code] === (this.c.reglesAdaptation.memeErreurLecon ?? 2)) relaunch(this.c.erreurs[code], code); }
    await this.save();
    return { etoiles, events, code };
  }
  async finish() { this.st.seances = (this.st.seances ?? 0) + 1; await this.save(); return { rate: this.count ? this.ok / this.count : null, events: this.events }; }
  save() { return this.store?.put("niveaux", this.st); }
}
