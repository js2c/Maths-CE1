// MODULE 7 · LE DÉROULEMENT DES PROBLÈMES (lot « Problèmes », docs/LOTS.md, fiche 20 ; docs/SPEC.md, section 7 quinquies).
// Même interface que les autres modules pour session/notion.js (next, record, entryLesson, lessonPlayed, lessonSeen, finish,
// simpler), sur le modèle de la multiplication (modules/mult/runner.js). Deux usages :
//  - L'EXERCICE (la notion du jour, avec « choisir », imposé par le parent, l'entraînement libre) : le niveau de l'enfant (ou le
//    niveau choisi), la leçon L19 la première fois à un niveau qui a le schéma en barres, une erreur qui revient plus loin dans la
//    séance (`retourErreur`, une fois), la même erreur deux fois qui relance la leçon, la règle « une réponse qui varie » ;
//  - L'ÉTAPE FIXE « PROBLÈME DU JOUR » (`etape` vrai, session/probleme.js) : 1 à 2 problèmes au niveau de l'enfant, la durée
//    prime (un deuxième problème n'est commencé que s'il reste `etape.minResteS` secondes ; `this.reste`, posé par notion.js) ;
//    ni leçon, ni retour dans la séance (l'énoncé manqué revient à une séance suivante), ni question « pour finir sur une
//    réussite ». Ses réponses comptent pour la montée (décision du parent du 30 octobre 2026).
// L'état (magasin « niveaux », clé 7) : le niveau, les niveaux acquis, les énoncés passés du tour en cours de chaque niveau
// (`tour`), les énoncés manqués à reprendre (`manques`), la fenêtre des dernières réponses de chaque niveau, les jours, les leçons.
//  - LA RÉPÉTITION : un énoncé ne revient pas dans la même séance (sauf son retour après une erreur, dans l'exercice), ni avant
//    que tous ceux de son niveau soient passés (le tour) ; un énoncé manqué revient à une séance suivante, avant les autres ;
//  - LA MONTÉE : 8 bonnes réponses sur les 10 dernières du niveau, au plus une aide (le coquillage ; l'aide d'une erreur ne compte
//    pas : la réponse est déjà fausse), sur deux jours au moins, sans voie rapide ; au cran « plus facile », les réponses ne comptent
//    pas pour la montée ; un niveau choisi plus haut ou plus bas que le sien compte pour son propre niveau (comme la multiplication) ;
//  - LES CRANS : « plus facile » (`objets`, `redire`), « plus dur » et « très dur » sans coquillage, « très dur » une difficulté
//    au-dessus (problemes.js, poolTresDur).
import { afterAnswer } from "../progress.js";
import { startOfDay } from "../facts/facts.js";
import { aideDe, classer, etiquettes, poolTresDur, structureDe } from "./problemes.js";
import { MANQUE, Variete } from "../variete.js";

export const initialProblemesState = (depart = 2, now = Date.now()) => ({ module: 7, niveau: depart, acquis: [], obtenus: [{ niveau: depart, date: now }], tour: {}, manques: [], fenetres: {}, essais: {}, jours: {}, lecons: [], passes: [], seances: 0 });
export const problemesMastery = (c, st) => (st?.acquis?.length ?? 0) / c.niveaux.length;

export class Module7Runner {
  // banque : content/problemes.json ; c : content/module7.json ; depart : le niveau de départ (réglage du parent, 2 par défaut)
  constructor({ store, content, banque, rnd, seance = null, cran = () => "conseille", choix = null, clock = () => Date.now(), variete = {}, etape = false, depart = null }) {
    this.var = new Variete(variete); this.store = store; this.c = content; this.banque = banque.enonces ?? banque; this.rnd = rnd; this.seance = seance; this.cran = cran; this.choix = choix; this.clock = clock; this.etape = etape; this.depart = depart;
    this.replays = []; this.poses = new Set(); this.errors = {}; this.played = new Set(); this.simpler = false; this.count = 0; this.ok = 0; this.events = []; this.k = 0;
  }
  async load() {
    this.st = (await this.store?.get("niveaux", 7)) ?? initialProblemesState(this.depart ?? this.c.depart, this.clock());
    for (const k of ["acquis", "obtenus", "lecons", "manques", "passes"]) this.st[k] ??= []; for (const k of ["tour", "fenetres", "essais", "jours"]) this.st[k] ??= {};
    this.niveau = this.choix ?? this.st.niveau; this.niveau0 = this.niveau;
    return this;
  }
  get effet() { return this.c.crans?.[this.cran()] ?? {}; }
  // la leçon L19, la première fois, à un niveau qui a le schéma en barres (pas à l'étape fixe : 1 min 30)
  entryLesson() { const l = this.c.lecons?.[this.niveau]; return !this.etape && l && !this.st.lecons.includes(l) && !this.played.has(l) ? l : null; }
  lessonPlayed(id) { this.played.add(id); }
  async lessonSeen(id) { if (!this.st.lecons.includes(id)) this.st.lecons.push(id); await this.save(); }
  guidesDus() { return 0; }
  // les énoncés possibles au niveau n, pour ce cran
  pool(n) { return this.effet.difficulteDessus ? poolTresDur(this.banque, n) : this.banque.filter((e) => e.niveau === n); }
  // l'énoncé suivant : le retour d'une erreur (exercice), un énoncé manqué d'une séance précédente, puis ceux du tour pas encore
  // passés ; jamais un énoncé déjà posé dans la séance
  pick(n) {
    // (parcours de test : `force`, des identifiants d'énoncés posés d'abord, dans l'ordre ; main.js, ?enonce=…)
    while (this.force?.length) { const id = this.force.shift(), e = this.banque.find((x) => x.id === id); if (e) return e; }
    const P = this.pool(n), libre = (e) => !this.poses.has(e.id);
    if (!P.length) return null;
    // (une question plus simple, après une difficulté persistante : un énoncé de difficulté plus basse du même niveau, sinon du
    // niveau d'en dessous)
    if (this.simpler) { this.simpler = false; const dmin = Math.min(...P.map((e) => e.difficulte)), bas = P.filter((e) => e.difficulte === dmin && libre(e)); const L = bas.length ? bas : this.banque.filter((e) => e.niveau === Math.max(1, n - 1) && libre(e)); if (L.length) return L[Math.floor(this.rnd() * L.length)]; }
    if (this.c.repetition?.["manquesD'abord"] !== false) { const m = this.st.manques.map((id) => P.find((e) => e.id === id)).find((e) => e && libre(e)); if (m) return m; }
    const tour = new Set(this.st.tour[n] ?? []);
    let L = P.filter((e) => libre(e) && !tour.has(e.id));
    if (!L.length) { this.st.tour[n] = []; L = P.filter(libre); }
    if (!L.length) return null;
    // la règle « une réponse qui varie » (section 9), dans l'exercice ; à l'étape fixe, un ou deux problèmes : le premier possible
    const c = L.map((e) => this.cand(e)), best = this.etape ? { i: Math.floor(this.rnd() * L.length), cout: 0 } : this.var.pick(this.shuffle(c), () => ({}));
    if (best.cout >= MANQUE) return null;
    return this.etape ? L[best.i] : L.find((e) => e.id === this.ordre[best.i].cle);
  }
  shuffle(c) { const a = [...c]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } this.ordre = a; return a; }
  cand(e) { return { cle: e.id, reponse: e.reponse }; }
  next({ guide = false } = {}) {
    // l'étape fixe : un deuxième problème seulement s'il reste assez de temps ; jamais de question « pour finir sur une réussite »
    if (this.etape && (this.k >= (this.c.etape?.problemes ?? 2) || (this.k >= 1 && (this.reste?.() ?? Infinity) < (this.c.etape?.minResteS ?? 45) * 1000) || (this.simpler && this.k >= 1))) { this.simpler = false; return null; }
    if (!guide && !this.etape) this.replays.forEach((r) => r.in--);
    const due = guide || this.etape ? -1 : this.replays.findIndex((r) => r.in <= 0);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ ...r.q, revient: true, guide: false }); }
    const e = this.pick(this.niveau);
    if (!e) return null;
    this.poses.add(e.id); this.k++;
    const eff = this.effet, q = { module: 7, id: e.id, niveau: this.niveau, niveauEnonce: e.niveau, e, etiquettes: etiquettes(e), aide: aideDe(e), cran: this.cran(), structure: structureDe(e),
      coquillage: eff.coquillage !== false, objets: !!eff.objets, redire: !!eff.redire, manipuler: (this.c.manipuler ?? []).includes(e.niveau) && !!e.groupes, etape: this.etape };
    if (guide) q.guide = true;
    return this.ret(q);
  }
  ret(q) { this.var.note(this.cand(q.e)); return { q, cfg: { niveau: q.niveau } }; }
  async record(r, cfg) {
    const q = r.q, e = q.e, events = [], code = r.nsp ? "NSP" : classer(e, r.value);
    await this.store?.add("reponses", {
      t: r.t ?? Date.now(), seance: this.seance, module: 7, niveau: q.niveau, enonce: e.id, question: e.question, donnee: r.value ?? null, attendue: e.reponse,
      juste: code === null, tempsMs: r.ms, ecoutes: r.listens, aide: !!r.aide, erreur: code, revient: !!q.revient, guide: !!q.guide, notion: !this.etape, ...(this.etape ? { etape: "probleme" } : {}),
      ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(this.libre ? { libre: true } : {}), ...(q.cran && q.cran !== "conseille" ? { cran: q.cran } : {}),
    });
    // le tour du niveau de l'énoncé ; les manqués (repris à une séance suivante, avant les autres)
    (this.st.tour[e.niveau] ??= []).includes(e.id) || this.st.tour[e.niveau].push(e.id);
    this.st.manques = this.st.manques.filter((id) => id !== e.id); if (code !== null && !q.guide) this.st.manques.push(e.id);
    if (q.guide) { await this.save(); return { etoiles: code === null ? 1 : 0, events }; }
    this.count++; if (code === null) this.ok++;
    let etoiles = code === null ? 1 : 0; if (code === null && q.revient) etoiles += 1;
    if (code !== null && !q.revient && !this.etape) this.replays.push({ q, in: this.c.repetition?.retourErreur ?? 3 });
    const relaunch = (id, raison) => { if (id && !this.etape && !this.played.has(id)) { this.played.add(id); events.push({ type: "lecon", id, raison }); } };
    // la montée : le niveau de la question (le sien ou celui choisi), sauf au cran « plus facile » et pour un niveau déjà acquis
    const n = q.niveau;
    if (q.cran !== "facile" && !this.st.acquis.includes(n)) {
      const w0 = { niveau: n, fenetre: this.st.fenetres[n] ?? [], vus: this.st.essais[n] ?? 0, obtenus: [] };
      const a = afterAnswer(w0, { juste: code === null, aide: !!r.aide, ms: r.ms }, this.c.reglesAdaptation, 99, this.clock());
      const day = startOfDay(this.clock()), jours = new Set([...(this.st.jours[n] ?? []), day]);
      this.st.jours[n] = [...jours].slice(-5);
      if (jours.size < (this.c.acquisJours ?? 1)) a.events = a.events.filter((x) => x.type !== "montee");
      this.st.fenetres[n] = a.st.fenetre; this.st.essais[n] = a.st.vus;
      if (a.events.some((x) => x.type === "montee")) {
        this.st.acquis = [...this.st.acquis, n]; delete this.st.fenetres[n];
        // le niveau de l'enfant monte s'il était à ce niveau ou en dessous (le plus bas des niveaux pas encore acquis au-dessus)
        if (n >= this.st.niveau) { const nx = this.c.niveaux.map((x) => x.niveau).find((x) => x > n && !this.st.acquis.includes(x)); if (nx) this.st.niveau = nx; }
        this.st.obtenus = [...this.st.obtenus, { niveau: n, date: this.clock(), acquis: true, ...(this.choix != null ? { choix: true } : {}), ...(this.etape ? { etape: true } : {}) }];
        events.push({ type: "montee", niveau: n });
        this.events.push({ type: "acquis", niveau: n });
        if (this.choix == null) { this.niveau = this.st.niveau; this.replays = []; }
      }
      if (a.events.some((x) => x.type === "difficulte")) { this.simpler = true; relaunch(this.c.lecons?.[n] ?? this.c.lecon, "difficulte"); }
    }
    if (code && this.c.erreurs?.[code] !== undefined) { this.errors[code] = (this.errors[code] ?? 0) + 1; if (this.errors[code] === (this.c.reglesAdaptation.memeErreurLecon ?? 2)) relaunch(this.c.erreurs[code], code); }
    await this.save();
    return { etoiles, events, code };
  }
  async finish() { if (!this.etape) this.st.seances = (this.st.seances ?? 0) + 1; await this.save(); return { rate: this.count ? this.ok / this.count : null, events: this.events }; }
  save() { return this.store?.put("niveaux", this.st); }
}
