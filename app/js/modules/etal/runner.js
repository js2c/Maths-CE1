// MODULE 6 · LE DÉROULEMENT DE L'ÉTAL DU PÊCHEUR (la notion du jour ; docs/SPEC.md, section 7 quater). Même interface que les
// autres modules pour session/notion.js (next, record, entryLesson, lessonPlayed, lessonSeen, finish, simpler), sur le modèle
// des voiliers (modules/voiliers/runner.js) pour le niveau, et de la multiplication pour les leçons :
//  - une question = un achat : le produit (ou les deux produits, niveau 8), son prix, le portefeuille de l'enfant (regarni à
//    chaque question) ; au niveau 1, la pièce ou le billet à poser ; au niveau 7, le billet déjà dans la soucoupe ;
//  - le niveau : le conseillé (« jouer », module imposé par le parent) ou le choisi (« choisir ») ; le cran ne change pas le
//    niveau (comme aux voiliers) : il change l'aide (le total, la valeur écrite), les prix (le haut de la fourchette) et le
//    portefeuille (« très dur » : plus de petites pièces) ; montée, voie rapide, redescente : les règles communes
//    (progress.js) ; au cran « plus facile », ni montée ni validation ; un niveau choisi au-dessus du conseillé et réussi est
//    validé, le conseillé passe au suivant ;
//  - la réponse qui varie (modules/variete.js) : la « réponse » est le prix (au niveau 1, la valeur à poser ; au niveau 7, ce
//    que le pêcheur rend), la « question » le prix (au niveau 7, le prix et le billet) ;
//  - un achat payé du premier coup : une étoile ; au deuxième essai : « erreur corrigée », une étoile, mais une erreur pour
//    l'adaptation ; manqué (deux erreurs, M4, M7, niveau 7, « je ne sais pas ») : il revient 3 à 5 questions plus loin ;
//  - la leçon d'entrée du niveau (L15 au niveau 1, L16 au niveau 2, L17 au niveau 7, L18 au niveau 9), la première fois ;
//    aux autres niveaux, un exemple guidé la première fois (le pêcheur paie en comptant) ; la difficulté persistante (3 erreurs
//    sur 5) relance la leçon du niveau puis donne un prix plus simple ; la même erreur deux fois relance sa leçon.
import { afterAnswer, afterSession, initialLevelState } from "../progress.js";
import { MANQUE, Variete } from "../variete.js";
import { deuxPrix, montantEcrit, paire, prixPossibles, PRODUITS, tirerPortefeuille } from "./etal.js";

export const initialEtalState = (now = Date.now()) => ({ ...initialLevelState(6, now), exemples: [] });
export const etalMastery = (c, st) => ((st?.niveau ?? 1) - 1) / c.niveaux.length;
// la leçon d'un niveau : la sienne, sinon celle de son genre (les centimes : L18 ; rendre : L17 ; payer : L16)
export const leconDuNiveau = (c, cfg) => cfg.lecon ?? (cfg.niveau >= 9 ? c.leconCentimes : cfg.type === "rendre" ? "L17" : "L16");
// la question telle que le parent la lira dans l'historique
export function etalQuestion(q) {
  if (q.type === "poser") return `poser ${montantEcrit(q.valeur)}`;
  if (q.type === "rendre") return `${q.produits[0]} à ${montantEcrit(q.prix)}, payé avec ${montantEcrit(q.billet)} : combien rendre ?`;
  if (q.type === "deux") return `${q.produits[0]} (${montantEcrit(q.prixProduits[0])}) et ${q.produits[1]} (${montantEcrit(q.prixProduits[1])}) : ${montantEcrit(q.prix)}`;
  return `${q.produits[0]} à ${montantEcrit(q.prix)}`;
}
// le contenu de la soucoupe tel que le parent le lit : « 10 € + 5 € + 2 € (17 €) »
export const soucoupeTexte = (vs) => (vs?.length ? `${vs.map(montantEcrit).join(" + ")} (${montantEcrit(vs.reduce((a, b) => a + b, 0))})` : "rien");

export class Module6Runner {
  // content : module6.json ; cran : () => le cran de la séance ; choix : le niveau choisi (écran « choisir »), sinon null
  constructor({ store, content, rnd, seance = null, cran = () => "conseille", choix = null, variete = {}, clock = () => Date.now() }) {
    this.var = new Variete(variete); this.store = store; this.c = content; this.rnd = rnd; this.seance = seance; this.cran = cran; this.choix = choix; this.clock = clock;
    this.rules = content.reglesAdaptation; this.levels = content.niveaux;
    this.replays = []; this.count = 0; this.ok = 0; this.simpler = false; this.up = null; this.rateN = 0; this.rateOk = 0;
    this.played = new Set(); this.errors = {}; this.premier = true; this.dernierProduit = null; this.events = [];
  }
  async load() {
    this.st = (await this.store?.get("niveaux", 6)) ?? initialEtalState(this.clock());
    this.st.exemples ??= []; this.st.lecons ??= [];
    return this;
  }
  get niveau() { return this.eff(); }
  eff() { return Math.min(this.levels.length, Math.max(1, this.choix ?? this.st.niveau)); }
  cfg(n = this.eff()) { return this.levels[Math.min(this.levels.length, Math.max(1, n)) - 1]; }
  get effet() { return this.c.crans?.[this.cran()] ?? {}; }
  // la leçon d'entrée du niveau, la première fois (une même leçon au plus une fois par séance)
  entryLesson() { const l = this.cfg().lecon; return l && !this.st.lecons.includes(l) && !this.played.has(l) ? l : null; }
  lessonPlayed(id) { this.played.add(id); }
  async lessonSeen(id) { if (!this.st.lecons.includes(id)) this.st.lecons.push(id); await this.save(); }
  // l'exemple guidé du niveau (les niveaux sans leçon), la première fois qu'il est joué
  get exempleDu() { const cfg = this.cfg(); return !cfg.lecon && !this.st.exemples.includes(cfg.niveau); }
  // un produit (jamais deux fois de suite le même)
  produit() { let p; do { p = PRODUITS[Math.floor(this.rnd() * PRODUITS.length)]; } while (p === this.dernierProduit); return p; }
  // une question tirée au niveau n
  tirer(n, simple) {
    const cfg = this.cfg(n), e = this.effet, R = this.rnd, base = { module: 6, niveau: n, type: cfg.type };
    if (cfg.type === "poser") { const v = cfg.valeurs[Math.floor(R() * cfg.valeurs.length)]; return { ...base, valeur: v, portefeuille: tirerPortefeuille(cfg, 0, R) }; }
    let ps = prixPossibles(cfg, simple ? {} : e);
    if (simple) ps = ps.slice(0, Math.max(1, Math.ceil(ps.length / 2)));
    const prix = ps[Math.floor(R() * ps.length)];
    if (cfg.type === "rendre") { const bs = cfg.billets.filter((b) => b > prix); return { ...base, prix, billet: bs[Math.floor(R() * bs.length)], produits: [this.produit()], portefeuille: [] }; }
    const portefeuille = tirerPortefeuille(cfg, prix, R, simple ? {} : e);
    if (!portefeuille) return null;
    if (cfg.type === "deux") { let a = this.produit(), b; do { b = PRODUITS[Math.floor(R() * PRODUITS.length)]; } while (b === a); const [x, y] = paire(a, b); return { ...base, prix, produits: [x, y], prixProduits: deuxPrix(cfg, prix, R), portefeuille }; }
    return { ...base, prix, produits: [this.produit()], portefeuille };
  }
  // la question suivante : un achat qui revient, sinon un nouveau ; `guide` : l'exemple guidé (après une leçon, ou la première
  // fois qu'un niveau sans leçon est joué)
  next({ guide = false } = {}) {
    if (!guide && this.exempleDu && !(this.donnes ??= new Set()).has(this.eff())) { this.donnes.add(this.eff()); guide = true; }
    if (!guide) this.replays.forEach((r) => r.in--);
    const due = guide || this.simpler ? -1 : this.replays.findIndex((r) => r.in <= 0 && this.var.cost(this.cand(r.q), { retour: true }) < 50);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ q: { ...r.q, revient: true, guide: false, premier: false, cran: this.cran() }, cfg: r.cfg }); }
    const n = this.eff(), simple = this.simpler; this.simpler = false;
    const tries = [];
    for (let i = 0; i < 24; i++) { const x = this.tirer(n, simple); if (x) tries.push(x); }
    if (!tries.length) return null;
    const best = this.var.pick(tries.map((x) => this.cand(x)), (c) => ({ attente: this.replays.filter((r) => this.cand(r.q).cle === c.cle).length }));
    if (best.cout >= MANQUE) return null;
    const q = { ...tries[best.i], cran: this.cran(), premier: this.premier, ...(guide ? { guide: true } : {}), ...(simple ? { simple: true } : {}) };
    this.premier = false; if (q.produits) this.dernierProduit = q.produits.at(-1);
    return this.ret({ q, cfg: this.cfg(n) });
  }
  // la réponse qui varie : la « question » et la « réponse » (en centimes)
  cand(q) { return q.type === "poser" ? { cle: `poser:${q.valeur}`, reponse: q.valeur } : q.type === "rendre" ? { cle: `${q.prix}/${q.billet}`, reponse: q.billet - q.prix } : { cle: String(q.prix), reponse: q.prix }; }
  ret(x) { this.var.note(this.cand(x.q)); return x; }
  // r : { q, ok (du premier coup), corrigee (au deuxième essai), code (M1 à M7, NSP), soucoupe (ce qui a été posé au premier
  // essai, valeurs), soucoupe2 (au deuxième), rendu (la monnaie rendue), tape (niveau 7), ms, listens, nsp, essais, aide,
  // aideDEmblee, correctionPassee, exemplePasse }
  async record(r, cfg) {
    const q = r.q, events = [], code = r.ok ? null : r.code ?? null;
    await this.store?.add("reponses", {
      t: Date.now(), seance: this.seance, module: 6, niveau: q.niveau, question: etalQuestion(q), forme: q.guide ? "exemple" : q.type,
      donnee: q.type === "rendre" ? (r.tape ?? null) : r.soucoupe ? soucoupeTexte(r.soucoupe) : null,
      attendue: q.type === "poser" ? montantEcrit(q.valeur) : q.type === "rendre" ? (q.billet - q.prix) / 100 : montantEcrit(q.prix),
      juste: !!r.ok, tempsMs: r.ms, ecoutes: r.listens, aide: !!r.aide, ...(r.aideDEmblee ? { aideDEmblee: true } : {}), erreur: code, revient: !!q.revient, guide: !!q.guide, notion: true,
      etal: { prix: q.prix ?? q.valeur, soucoupe: r.soucoupe ?? null, ...(r.soucoupe2 ? { soucoupe2: r.soucoupe2 } : {}), ...(r.rendu ? { rendu: r.rendu } : {}), ...(q.billet ? { billet: q.billet } : {}), portefeuille: q.portefeuille },
      ...(r.corrigee ? { corrigee: true } : {}), ...(r.essais ? { essais: r.essais } : {}), ...(r.correctionPassee ? { correctionPassee: true } : {}), ...(r.exemplePasse ? { exemplePasse: true } : {}),
      ...(this.libre ? { libre: true } : {}), ...(q.cran && q.cran !== "conseille" ? { cran: q.cran } : {}),
    });
    // l'exemple guidé : le pêcheur paie ; rien à compter, il ne revient pas ; le niveau a eu son exemple
    if (q.guide) { if (!this.st.exemples.includes(q.niveau)) this.st.exemples.push(q.niveau); await this.save(); return { etoiles: 0, events }; }
    this.count++; if (r.ok) this.ok++;
    const etoiles = r.ok ? (q.revient ? 2 : 1) : r.corrigee ? 1 : 0;
    const [a, b] = this.rules.retourErreur ?? [3, 5];
    if (!r.ok && !r.corrigee && !q.revient && this.var.times(this.cand(q).cle) < this.var.c.memeQuestionMax) this.replays.push({ q: { ...q }, cfg, in: a + Math.floor(this.rnd() * (b - a + 1)) });
    // (simulation du lot : sans limite, une enfant en difficulté revoyait la même leçon à chaque séance, vingt séances de suite ;
    // une leçon relancée par une difficulté ou une erreur répétée ne l'est plus pendant `relanceJours` jours ; choix de la session)
    const relaunch = (id, raison) => {
      const der = this.st.relances?.[id], jours = this.c.relanceJours ?? 7;
      if (!id || this.played.has(id) || (der && this.clock() - der < jours * 86400000)) return;
      this.played.add(id); (this.st.relances ??= {})[id] = this.clock(); events.push({ type: "lecon", id, raison });
    };
    // le taux de la séance (redescente) : pas les achats au-dessus du conseillé
    if (this.choix == null ? q.niveau <= this.st.niveau : q.niveau === this.st.niveau) { this.rateN++; if (r.ok) this.rateOk++; }
    const aide = !!r.aide || !!r.aideDEmblee;
    if (q.cran === "facile") { /* « plus facile » consolide sans faire progresser */ }
    else if (q.niveau === this.st.niveau) {
      const x = afterAnswer(this.st, { juste: !!r.ok, aide, ms: r.ms }, this.rules, this.levels.length, this.clock());
      this.st = { ...x.st, exemples: this.st.exemples, lecons: this.st.lecons };
      events.push(...x.events);
      if (x.events.some((e) => e.type === "difficulte")) { this.simpler = true; relaunch(leconDuNiveau(this.c, this.cfg(q.niveau)), "difficulte"); }
      if (x.events.some((e) => e.type === "montee")) this.climbed(events);
    } else if (q.niveau > this.st.niveau) {
      // au-dessus du conseillé (niveau choisi) : une fenêtre à part ; la réussir valide le niveau
      if (this.up?.niveau !== q.niveau) this.up = { ...initialLevelState(6), niveau: q.niveau, obtenus: [] };
      const x = afterAnswer(this.up, { juste: !!r.ok, aide, ms: r.ms }, this.rules, this.levels.length + 1, this.clock());
      this.up = x.st;
      const up = x.events.find((e) => e.type === "montee");
      if (up) {
        const de = this.st.niveau, to = Math.min(this.levels.length, up.a);
        this.st = { ...this.st, niveau: to, fenetre: [], vus: 0, obtenus: [...this.st.obtenus, { niveau: to, date: this.clock(), choix: true }] };
        events.push({ type: "montee", de, a: to, rapide: up.rapide, choix: true }); this.up = null; this.climbed(events);
      }
      if (x.events.some((e) => e.type === "difficulte")) this.simpler = true;
    }
    // la même erreur deux fois dans la séance : sa leçon (aux centimes, celle des centimes)
    if (code && code !== "NSP" && this.c.erreurs?.[code]) {
      this.errors[code] = (this.errors[code] ?? 0) + 1;
      if (this.errors[code] === (this.rules.memeErreurLecon ?? 2)) relaunch(q.niveau >= 9 ? this.c.leconCentimes : this.c.erreurs[code], code);
    }
    await this.save();
    return { etoiles, events, code };
  }
  // un niveau franchi : les achats en attente sont oubliés (ils étaient de l'ancien niveau) ; la leçon du nouveau niveau
  climbed(events) {
    if (this.choix != null) return;
    this.replays = [];
    const l = this.entryLesson(); if (l) { this.played.add(l); events.push({ type: "lecon", id: l, raison: "niveau" }); }
  }
  async finish() { const rate = this.rateN ? this.rateOk / this.rateN : null, a = afterSession(this.st, rate, this.rules, this.clock()); this.st = { ...a.st, exemples: this.st.exemples, lecons: this.st.lecons }; await this.save(); return { rate, events: a.events }; }
  save() { return this.store?.put("niveaux", this.st); }
}
