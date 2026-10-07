// MODULE 3 · LE DÉROULEMENT DU CALCUL RAPIDE (la notion du jour ; docs/SPEC.md, « Module 3 » ; lot 3, docs/SPEC-LOT3.md,
// section 6). Même interface que Module1Runner pour session/notion.js (next, record, entryLesson, lessonPlayed,
// lessonSeen, finish, simpler).
//  - l'état (magasin « niveaux », clé 3) : les niveaux acquis, leur date, les questions vues à chaque niveau (`vus`),
//    la fenêtre des dernières réponses de chaque niveau, les leçons vues ;
//  - le niveau conseillé : le plus bas des niveaux débloqués (module3.json, debloque : niveaux acquis, familles
//    d'additions bien sues) pas encore acquis ; le niveau 1 est débloqué dès le début ;
//  - avec « jouer » : le niveau conseillé, et une question sur cinq (melange) prise dans les niveaux déjà acquis ; avec
//    « choisir » (`choix`) : toutes les questions au niveau choisi, tous les niveaux sont accessibles ;
//  - déroulé d'un nouveau niveau : la leçon (L7 au niveau 2, L8 au 6, L9 au 7), puis 3 calculs guidés où l'enfant
//    remplit chaque pont du chemin (`q.guide`, `q.remplir`), puis des calculs où le chemin vient au coquillage (cran
//    conseillé) ; crans : « plus facile » le chemin affiché d'emblée (sans promotion), « plus dur » sans chemin, « très
//    dur » sans chemin et forme à trou (tous les niveaux : sur le second nombre aux niveaux 4, 5, 7, 8 et 9, le niveau 9
//    depuis le lot « Correctifs », écart 7.3 ; sur le nombre de départ aux niveaux à pas fixe) ;
//  - montée (acquis) : 8 bonnes réponses sur les 10 dernières du niveau, au plus une aide, ou la voie rapide (progress.js) ;
//    un niveau choisi au-dessus du conseillé et réussi est acquis ; échouer ne retire rien ;
//  - erreurs : une erreur revient 3 questions plus loin ; la même erreur C1, C3 ou C4 deux fois : sa leçon (L7, L8, L9),
//    une fois par séance ; 3 erreurs sur 5 : la leçon du niveau puis un calcul plus simple ; C2 (juste mais lent : au-delà
//    du temps de base + lenteurS) : noté, sans reproche, l'écran rejoue le chemin une fois.
import { afterAnswer } from "../progress.js";
import { calcKey, chemin, classifyCalc, makeCalc, unlocked } from "./calc.js";
import { ruleShare } from "../facts/families.js";
import { MANQUE, Variete } from "../variete.js";

export const initialCalcState = (now = Date.now()) => ({ module: 3, acquis: [], obtenus: [{ niveau: 1, date: now }], vus: {}, fenetres: {}, lecons: [], seances: 0 });
// le niveau conseillé : le plus bas des niveaux débloqués pas encore acquis ; un niveau débloqué le reste (`ouverts`), même
// si les additions qui l'ont débloqué redescendent de boîte ; s'il n'y en a pas (tout ce qui est débloqué est acquis), le
// plus haut niveau acquis (révision), ou le niveau 1
export function recommended(c, st, { familyShare = () => 0 } = {}) {
  // (un niveau choisi par le parent comme point de départ, `depart`, est conseillable sans sa condition de déblocage)
  const ok = (cfg) => !st.acquis.includes(cfg.niveau) && (cfg.niveau <= (st.depart ?? 0) || (st.ouverts ?? []).includes(cfg.niveau) || unlocked(cfg, { acquis: st.acquis, familyShare, part: c.debloquePart ?? 0.8 }));
  return c.niveaux.find(ok)?.niveau ?? Math.max(1, ...st.acquis);
}
// la maîtrise du module (pour la rotation de « jouer ») : la part des niveaux acquis
export const calcMastery = (c, st) => (st?.acquis?.length ?? 0) / c.niveaux.length;

export class Module3Runner {
  // content : module3.json ; faits : les faits d'addition (le déblocage des niveaux 4 et 7) ; content2 : module2.json
  // baseMs : le temps de base mesuré à l'échauffement (C2)
  // variete : les règles de la réponse qui varie (lot 3 bis, content/seance.json, `variete`)
  constructor({ store, content, content2 = null, rnd, seance = null, cran = () => "conseille", choix = null, clock = () => Date.now(), baseMs = 3000, variete = {} }) {
    this.var = new Variete(variete); this.store = store; this.c = content; this.c2 = content2; this.rnd = rnd; this.seance = seance; this.cran = cran; this.choix = choix; this.clock = clock; this.baseMs = baseMs;
    this.replays = []; this.recent = []; this.errors = {}; this.played = new Set(); this.simpler = false; this.k = 0; this.count = 0; this.ok = 0; this.win = []; this.events = [];
  }
  async load() {
    this.st = (await this.store?.get("niveaux", 3)) ?? initialCalcState(this.clock());
    for (const k of ["acquis", "obtenus", "lecons"]) this.st[k] ??= []; this.st.vus ??= {}; this.st.fenetres ??= {};
    const faits = (await this.store?.all("faits")) ?? [];
    this.familyShare = (id, boite) => (this.c2 ? ruleShare(this.c2, faits, id, boite) : 0);
    this.niveau = this.choix ?? this.conseille();
    return this;
  }
  // le conseillé, noté débloqué pour de bon
  conseille() { const n = recommended(this.c, this.st, { familyShare: this.familyShare }); if (!this.st.acquis.includes(n)) this.st.ouverts = [...new Set([...(this.st.ouverts ?? []), n])]; return n; }
  cfg(n) { return this.c.niveaux[Math.min(this.c.niveaux.length, Math.max(1, n)) - 1]; }
  get effet() { return this.c.crans?.[this.cran()] ?? {}; }
  get lentMs() { return this.baseMs + (this.c.lenteurS ?? 8) * 1000; }
  // la leçon d'entrée du niveau joué, la première fois
  entryLesson() { const l = this.cfg(this.niveau).lecon; return l && !this.st.lecons.includes(l) && !this.played.has(l) ? l : null; }
  lessonPlayed(id) { this.played.add(id); }
  async lessonSeen(id) { if (!this.st.lecons.includes(id)) this.st.lecons.push(id); await this.save(); }
  // la question suivante ; `guide` (session/notion.js : exemples guidés après une leçon) : un calcul guidé
  next({ guide = false } = {}) {
    if (!guide) this.replays.forEach((r) => r.in--);
    const due = guide || this.simpler ? -1 : this.replays.findIndex((r) => r.in <= 0 && this.var.cost(this.cand(r.q), { retour: true }) < 50);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ q: { ...r.q, revient: true, guide: false, remplir: false }, cfg: r.cfg }); }
    let n = this.niveau;
    // « jouer » : une question sur cinq (melange) dans un niveau déjà acquis (pas pendant le déroulé d'un nouveau niveau)
    const acquired = this.st.acquis.filter((x) => x !== n), vus = this.st.vus[n] ?? 0, D = this.c.deroule ?? { guides: 3, cheminAide: 3 };
    if (this.choix == null && !guide && acquired.length && vus >= D.guides + D.cheminAide && this.rnd() < (this.c.melange ?? 0)) n = acquired[Math.floor(this.rnd() * acquired.length)];
    // plus simple (difficulté, finir sur une réussite) : un niveau acquis plus bas, sinon le même niveau
    if (this.simpler) { this.simpler = false; const low = this.st.acquis.filter((x) => x < n); if (low.length && this.choix == null) n = low.at(-1); }
    const cfg = this.cfg(n), e = this.effet;
    // lot 3 bis (docs/SPEC-LOT3BIS.md, A2) : aux niveaux à pas fixe (module3.json, trouDepart), le cran « très dur » alterne à
    // parts égales la forme directe et le trou sur le nombre de départ (« ? + 10 = 57 ») ; ailleurs, le trou sur le second
    // nombre (« 38 + ? = 43 ») là où il a un sens (trou) ; plusieurs tirages, le premier qui respecte la réponse qui varie (§0)
    let forme = "directe";
    if (e.trou && cfg.trouDepart) forme = (this.departK = (this.departK ?? 0) + 1) % 2 === 0 ? "trouGauche" : "directe";
    else if (e.trou && cfg.trou) forme = "trouDroite";
    const tries = [];
    for (let i = 0; i < (this.tries ?? 24); i++) { const x = makeCalc(cfg, this.rnd, { eviter: i < 12 ? this.recent.slice(-6) : [] }); x.forme = forme; tries.push(x); }
    const best = this.var.pick(tries.map((x) => this.cand(x)), (c) => ({ attente: this.replays.filter((r) => calcKey(r.q) === c.cle).length }));
    if (best.cout >= MANQUE) return null;
    const q = tries[best.i];
    q.chemin = chemin(q); q.cran = this.cran(); q.lentMs = this.lentMs;
    // les 3 premiers calculs d'un niveau (ou un exemple guidé) : l'enfant remplit chaque pont ; ensuite le chemin selon le cran
    const fill = n === this.niveau && (guide || (this.st.vus[n] ?? 0) < D.guides) && q.forme === "directe";
    if (fill) { q.guide = true; q.remplir = true; }
    else q.cheminMode = e.chemin ?? "coquillage"; // emblee | coquillage | non
    if (e.chemin === "emblee" && !fill) q.aideDEmblee = true;
    this.recent.push(calcKey(q)); this.k++;
    return this.ret({ q, cfg });
  }
  // lot 3 bis : la question vue par les règles de la réponse qui varie ; une question posée
  cand(q) { return { cle: calcKey(q), reponse: calcAnswer(q) }; }
  ret(x) { this.var.note(this.cand(x.q)); return x; }
  // r : { q, value, ok, ms, listens, aide, nsp, correctionPassee, lent }
  async record(r, cfg) {
    const q = r.q, events = [], code = r.nsp ? "NSP" : r.ok ? (r.lent || r.ms > this.lentMs ? "C2" : null) : classifyCalc(q, r.value);
    await this.store?.add("reponses", {
      t: Date.now(), seance: this.seance, module: 3, niveau: q.niveau, question: calcQuestion(q), forme: q.forme, donnee: r.value, attendue: calcAnswer(q),
      juste: !!r.ok, tempsMs: r.ms, ecoutes: r.listens, aide: !!r.aide, ...(q.aideDEmblee ? { aideDEmblee: true } : {}), erreur: code, revient: !!q.revient, guide: !!q.guide, notion: true,
      ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(this.libre ? { libre: true } : {}), ...(q.cran && q.cran !== "conseille" ? { cran: q.cran } : {}),
    });
    this.st.vus[q.niveau] = (this.st.vus[q.niveau] ?? 0) + 1;
    if (q.guide) { await this.save(); return { etoiles: r.ok ? 1 : 0, events }; }
    this.count++; if (r.ok) this.ok++;
    let etoiles = r.ok ? 1 : 0; if (r.ok && q.revient) etoiles += 1;
    if (!r.ok && !q.revient && this.var.times(calcKey(q)) < this.var.c.memeQuestionMax) this.replays.push({ q, cfg, in: 3 });
    const relaunch = (id, raison) => { if (id && !this.played.has(id)) { this.played.add(id); events.push({ type: "lecon", id, raison }); } };
    // la fenêtre du niveau (montée), sauf au cran « plus facile » (il consolide sans faire progresser) et pour un niveau déjà acquis
    if (q.cran !== "facile" && !this.st.acquis.includes(q.niveau)) {
      // (la voie rapide compte les premières questions du niveau hors calculs guidés : `essais`)
      const w0 = { niveau: q.niveau, fenetre: this.st.fenetres[q.niveau] ?? [], vus: (this.st.essais ??= {})[q.niveau] ?? 0, obtenus: [] };
      const a = afterAnswer(w0, { juste: r.ok, aide: !!r.aide, ms: r.ms }, this.c.reglesAdaptation, 99, this.clock());
      this.st.fenetres[q.niveau] = a.st.fenetre; this.st.essais[q.niveau] = a.st.vus;
      if (a.events.some((x) => x.type === "montee")) {
        this.st.acquis = [...this.st.acquis, q.niveau]; this.st.obtenus = [...this.st.obtenus, { niveau: q.niveau, date: this.clock(), acquis: true, ...(this.choix != null ? { choix: true } : {}) }];
        delete this.st.fenetres[q.niveau];
        events.push({ type: "montee", niveau: q.niveau, rapide: a.events.find((x) => x.type === "montee").rapide });
        this.events.push({ type: "acquis", niveau: q.niveau });
        // « jouer » : on passe au nouveau niveau conseillé (avec sa leçon d'entrée) ; les questions en attente sont oubliées
        if (this.choix == null) { this.niveau = this.conseille(); this.replays = []; const l = this.entryLesson(); if (l) { this.played.add(l); events.push({ type: "lecon", id: l, raison: "niveau" }); } }
      }
      if (a.events.some((x) => x.type === "difficulte")) { this.simpler = true; relaunch(this.cfg(q.niveau).lecon, "difficulte"); }
    }
    // la même erreur deux fois dans la séance : sa leçon
    if (code && this.c.erreurs?.[code]) { this.errors[code] = (this.errors[code] ?? 0) + 1; if (this.errors[code] === (this.c.reglesAdaptation.memeErreurLecon ?? 2)) relaunch(this.c.erreurs[code], code); }
    await this.save();
    return { etoiles, events, code };
  }
  async finish() { this.st.seances = (this.st.seances ?? 0) + 1; await this.save(); return { rate: this.count ? this.ok / this.count : null, events: this.events }; }
  save() { return this.store?.put("niveaux", this.st); }
}
// la question telle que le parent la lira dans l'historique
export const calcQuestion = (q) => (q.forme === "trouDroite" ? `${q.a} ${q.op === "-" ? "−" : "+"} ? = ${q.n}` : q.forme === "trouGauche" ? `? ${q.op === "-" ? "−" : "+"} ${q.b} = ${q.n}` : `${q.a} ${q.op === "-" ? "−" : "+"} ${q.b}`);
// la réponse attendue selon la forme : le résultat, le second nombre (« 38 + ? = 43 ») ou le nombre de départ (« ? + 10 = 57 »)
export const calcAnswer = (q) => (q.forme === "trouDroite" ? q.b : q.forme === "trouGauche" ? q.a : q.n);
