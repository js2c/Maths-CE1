// MODULE 2 · LA NOTION DU JOUR (lot 2, étape 6 ; docs/SPEC-LOT2.md, section 3, « Le module 2 comme notion du
// jour »). Même interface que Module1Runner (session/notion.js : next, record, entryLesson, lessonPlayed,
// lessonSeen, finish, simpler) ; l'enregistrement des réponses et la révision espacée sont ceux de
// l'échauffement (warmup.js : mêmes boîtes, une boîte au plus par séance, limite commune de faits nouveaux).
//  - la famille en cours : la plus basse des familles ouvertes pas encore acquise (sinon le mélange) ;
//  - la première fois qu'une famille est la notion du jour : sa leçon (L4 doubles, L5 amis de 10, L6 maison),
//    sinon deux exemples guidés avec l'appui visuel de la famille (session/notion.js) ; lot 3 (docs/SPEC-LOT3.md,
//    section 4) : une leçon n'est jouée que pour la famille travaillée ; les maisons de 8 et 9 jouent L6, les
//    presque-doubles L4, si elle n'a jamais été vue (module2.json, leconSiJamaisVue) ; le mélange, aucune ; chaque
//    question des presque-doubles rappelle le double (`q.rappel`) ;
//  - lot 3 : au moins 80 % des questions sur les faits de la règle de la famille en cours (module2.json,
//    notion.partFamille ; faits nouveaux compris, dans la limite commune de la séance et de la boîte 1), le reste
//    sur les faits introduits les plus faibles des autres familles (boîte la plus basse, puis temps médian le plus
//    long) ; un même fait au plus 3 fois, sauf un fait de la famille quand elle n'a plus d'autre fait disponible ;
//  - lot 3 (docs/SPEC-LOT3.md, section 2) : la famille choisie par l'enfant (`choix`) est la famille en cours de
//    la séance ; elle s'ouvre si elle ne l'était pas (sans étoile arc-en-ciel) ; ses faits nouveaux ne sont limités
//    ni par la limite commune de la séance ni par la boîte 1 ;
//  - une erreur fait revenir le fait 3 questions plus loin ; 3 erreurs sur 5 : la leçon de la famille (une fois
//    par séance) puis un fait déjà bien su ;
//  - une famille acquise pendant la séance est un niveau franchi (événement « montee » : étoile arc-en-ciel) ;
//  - sélecteur de difficulté (module2.json, notion.crans) : « plus facile » = formes directes de la famille en
//    cours, aide affichée d'emblée ; « plus dur » = formes à trou et faits de la famille suivante ; « très dur » =
//    formes à trou, toutes les familles ouvertes mêlées, et la famille suivante ; une réussite avec l'aide
//    affichée d'emblée ne fait pas monter le fait (elle ne le fait pas redescendre non plus) ;
//  - stagnation (module2.json, familles2.stagnation) : une famille pas acquise après 6 séances où elle était la
//    notion du jour est dépassée : la suivante devient la famille en cours (avec sa leçon), elle reste en révision.
import { aidFor, catalog, expected, familyOf, formFor, key, newFact, roomForNew, ruleFacts, trouPartOf, trouTurn } from "./facts.js";
import { MANQUE, Variete } from "../variete.js";
import { currentFamily, isAcquired, noteNotion, openChosen, trouOpenFor, updateFamilies, withOpen } from "./families.js";
import { Warmup } from "./warmup.js";

export class Module2Runner {
  // choix : la famille choisie par l'enfant (écran « choisir », lot 3), sinon null (« jouer »)
  // variete : les règles de la réponse qui varie (lot 3 bis, content/seance.json, `variete`)
  constructor({ store, content, rnd, seance = null, clock = () => Date.now(), cran = () => "conseille", dejaNouveaux = 0, choix = null, variete = {} }) {
    this.var = new Variete({ ...variete, memeQuestionMax: content.notion?.memeFaitMax ?? variete.memeQuestionMax }); this.store = store; this.c0 = content; this.rnd = rnd; this.seance = seance; this.clock = clock; this.cran = cran; this.choix = choix;
    this.w = new Warmup({ store, content, rnd, seance, clock, cran, dejaNouveaux }); this.w.notion = true;
    this.replays = []; this.asked = new Map(); this.last = []; this.k = 0; this.win = []; this.count = 0; this.ok = 0;
    this.played = new Set(); this.simpler = false; this.events = [];
  }
  async load() {
    await this.w.load(); this.fam = this.w.fam;
    if (this.choix != null && familyOf(this.c0, this.choix)) {
      // la famille choisie s'ouvre si elle ne l'était pas (sans étoile arc-en-ciel : ce n'est pas une famille acquise)
      if (!this.fam.ouvertes.includes(this.choix)) { this.fam = openChosen(this.fam, this.choix, this.clock(), this.seance); this.w.fam = this.fam; this.w.c = withOpen(this.c0, this.fam); await this.save(); }
      this.famille = this.choix;
    } else this.famille = currentFamily(this.c0, this.fam);
    return this;
  }
  get c() { return this.w.c; }
  get N() { return this.c0.notion ?? { partFamille: 0.8, memeFaitMax: 3, difficulte: { sur: 5, erreurs: 3 }, crans: {} }; }
  // (lot 3 : famille choisie, les crans à l'intérieur de la famille, notion.cransChoix)
  get effet() { return (this.choix != null ? this.N.cransChoix : this.N.crans)?.[this.cran()] ?? {}; }
  get nouveaux() { return this.w.nouveaux; }
  // la leçon de la famille, la première fois qu'elle est la notion du jour (jamais vue, pas encore jouée dans la séance)
  // lot 3 : une famille sans leçon qui reprend la représentation d'une autre (maisons de 8 et 9 : la maison ; presque-
  // doubles : les doubles) joue cette leçon si elle n'a jamais été vue (module2.json, leconSiJamaisVue) ; le mélange,
  // aucune ; jamais la leçon d'une autre famille
  entryLesson() {
    const f = familyOf(this.c0, this.famille), seen = (id) => (this.fam.lecons ?? []).includes(id) || this.played.has(id);
    if (f?.lecon) return (this.fam.notion ?? []).includes(this.famille) || seen(f.lecon) ? null : f.lecon;
    return f?.leconSiJamaisVue && !seen(f.leconSiJamaisVue) ? f.leconSiJamaisVue : null;
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
    const e = this.choix != null ? {} : this.effet, ids = new Set(e.melange ? this.fam.ouvertes : [this.famille]);
    if (e.familleSuivante) { const nx = this.c0.familles.find((f) => !this.fam.ouvertes.includes(f.id)); if (nx) ids.add(nx.id); }
    const cat = new Map(catalog(this.c0).map((f) => [f.fait, f])), out = new Map();
    for (const id of ids) for (const r of familyOf(this.c0, id)?.regle === "melange" ? [...cat.values()].filter((f) => this.stored(f.fait)) : ruleFacts(this.c0, id)) if (!out.has(r.fait)) out.set(r.fait, { ...cat.get(r.fait), src: id });
    return [...out.values()];
  }
  weakest(list) {
    const score = (f) => { const s = this.stored(f.fait); return [s?.boite ?? 0, -(s?.tempsMedian ?? 0)]; };
    return [...list].sort((x, y) => { const [a1, a2] = score(x), [b1, b2] = score(y); return a1 - b1 || a2 - b2; });
  }
  // (lot 3 bis : les retours prévus comptent, un fait au plus `memeFaitMax` fois dans la séance, retours compris ; `tried` :
  // les faits déjà essayés pour la question en cours)
  pending(fait) { return this.replays.filter((r) => r.q.fait === fait).length; }
  under(f) { return (this.asked.get(f.fait) ?? 0) + this.pending(f.fait) < this.N.memeFaitMax; }
  usable(f) { return this.under(f) && !this.last.slice(-2).includes(f.fait) && !this.tried?.has(f.fait); }
  // lot 3 : quand tous les faits de la famille ont été posés... (lot 3 bis : seulement ceux qui n'ont pas atteint la limite)
  leastAsked(list) {
    const n = (f) => this.asked.get(f.fait) ?? 0, ok = list.filter((f) => this.under(f) && !this.tried?.has(f.fait)), fresh = ok.filter((f) => !this.last.slice(-2).includes(f.fait)), l = fresh.length ? fresh : ok;
    return this.weakest(l).sort((x, y) => n(x) - n(y))[0] ?? null;
  }
  // un fait de la famille : un fait nouveau une fois sur deux s'il y en a et si la place le permet, sinon le plus faible déjà rencontré
  // lot 3 : la famille en cours seule (la règle de sa famille ; le mélange : tous les faits introduits) : c'est elle qui
  // compte pour les 80 % ; les faits que le cran « plus dur » ou « très dur » ajoute (famille suivante, familles ouvertes
  // mêlées) passent dans la part des autres (au plus 20 %)
  // lot 3 bis (A4) : le mélange choisi alors que moins de 3 familles ont des faits introduits reçoit aussi les faits des
  // familles 1 à 3 (module2.json, notion.melangeNeuf), comme faits nouveaux
  corePool() {
    const cat = new Map(catalog(this.c0).map((f) => [f.fait, f])), fam = familyOf(this.c0, this.famille);
    let list = fam?.regle === "melange" ? [...cat.values()].filter((f) => this.stored(f.fait)) : ruleFacts(this.c0, this.famille).map((r) => cat.get(r.fait));
    const M = this.N.melangeNeuf;
    if (fam?.regle === "melange" && this.choix != null && M && new Set(this.w.facts.map((f) => cat.get(f.fait)?.famille).filter(Boolean)).size < M.famillesMin) list = [...list, ...[...cat.values()].filter((f) => !this.stored(f.fait) && M.familles.includes(f.famille))];
    return list.filter(Boolean).map((f) => ({ ...f, src: this.famille }));
  }
  extraPool() { const core = new Set(this.corePool().map((f) => f.fait)); return this.familyPool().filter((f) => !core.has(f.fait)); }
  // lot 3 bis (A1) : les faits nouveaux tirés au hasard (un rang tiré une fois par séance), l'autre ordre des termes du
  // dernier fait nouveau d'abord (7 + 3, puis 3 + 7)
  rank(f) { (this.ranks ??= new Map()).has(f.fait) || this.ranks.set(f.fait, this.rnd()); return this.ranks.get(f.fait) - (this.lastNew && f.a === this.lastNew.b && f.b === this.lastNew.a ? 1 : 0); }
  pickFamily(allowNew = true, pool = this.corePool()) {
    const fresh0 = pool.filter((f) => !this.stored(f.fait) && !this.asked.has(f.fait) && !this.tried?.has(f.fait)).sort((x, y) => this.rank(x) - this.rank(y));
    // plusieurs familles (crans « plus dur », « très dur ») : les faits nouveaux alternent d'une famille à l'autre
    const srcs = [...new Set(fresh0.map((f) => f.src))], nth = srcs.map((id) => fresh0.filter((f) => f.src === id)), fresh = [];
    for (let i = 0; fresh.length < fresh0.length; i++) for (const l of nth) if (l[i]) fresh.push(l[i]);
    const f0 = srcs.length > 1 ? fresh[(this.turn ?? 0) % Math.min(fresh.length, srcs.length)] ?? fresh[0] : fresh[0];
    // (famille choisie : ni la limite commune de la séance, ni celle de la boîte 1)
    const room = this.choix != null ? Infinity : roomForNew(this.c, this.w.facts, this.w.nouveaux);
    const nouveau = () => { const { src, ...f } = f0; void src; return newFact(f, this.clock()); };
    if (allowNew && fresh.length && room > 0 && (this.k % 2 === 0 || !pool.some((f) => this.stored(f.fait) && this.usable(f)))) return nouveau();
    const known = this.weakest(pool.filter((f) => this.stored(f.fait) && this.usable(f)));
    if (known[0]) return { ...this.stored(known[0].fait), famille: known[0].famille };
    if (allowNew && fresh.length && room > 0) return nouveau();
    const any = this.leastAsked(pool.filter((f) => this.stored(f.fait)));
    return any ? { ...this.stored(any.fait), famille: any.famille } : null;
  }
  // un fait d'une autre famille : les plus faibles des faits introduits hors de la règle de la famille en cours
  pickOther() {
    const inFam = new Set(this.corePool().map((f) => f.fait)), cat = new Map(catalog(this.c0).map((f) => [f.fait, f]));
    const list = this.weakest(this.w.facts.filter((f) => !inFam.has(f.fait) && cat.has(f.fait) && this.usable(f)));
    return list[0] ? { ...list[0], famille: cat.get(list[0].fait).famille } : null;
  }
  // lot 3 bis : plus rien d'utilisable dans la famille ni dans les faits introduits : un fait nouveau d'une famille ouverte
  // (dans la limite de la séance), sinon rien (la notion du jour s'arrête : un fait ne revient pas plus de 3 fois)
  pickNewOther() {
    if (roomForNew(this.c, this.w.facts, this.w.nouveaux) <= 0) return null;
    const f = catalog(this.c0).filter((x) => this.fam.ouvertes.includes(x.famille) && !this.stored(x.fait) && !this.asked.has(x.fait) && !this.tried?.has(x.fait)).sort((x, y) => this.rank(x) - this.rank(y))[0];
    return f ? newFact(f, this.clock()) : null;
  }
  // un fait déjà bien su (question plus simple, pour finir sur une réussite ou après une difficulté)
  // (lot 3 : de préférence dans la famille en cours, pour garder les 80 %)
  pickEasy() {
    const fam = new Set(this.corePool().map((f) => f.fait)), by = (x, y) => y.boite - x.boite || (x.tempsMedian ?? 9e9) - (y.tempsMedian ?? 9e9);
    const all = [...this.w.facts].filter((f) => this.usable(f)), inFam = all.filter((f) => fam.has(f.fait)).sort(by);
    return inFam[0] ?? (this.otherAllowed() ? all.sort(by)[0] : null) ?? all.sort(by)[0] ?? null;
  }
  // lot 3 : la question suivante peut-elle sortir de la famille sans passer sous la part voulue (80 %) ?
  otherAllowed() { const part = this.effet.familleSeule ? 1 : this.N.partFamille ?? 0.8; return (this.nFam ?? 0) >= part * ((this.nAll ?? 0) + 1) - 1e-9; }
  inFamily(fait) { return this.corePool().some((f) => f.fait === fait); }
  // lot 3 bis (A1) : la famille dont un fait prend la part de formes à trou : la famille en cours s'il relève de sa règle,
  // sinon sa propre famille
  formFamily(q) { return ruleFacts(this.c0, this.famille).some((r) => r.fait === q.fait) ? this.famille : q.famille; }
  question(f, { guide = false } = {}) {
    const cat = catalog(this.c0).find((x) => x.fait === f.fait), e = this.effet;
    const q = { ...f, a: cat.a, b: cat.b, famille: f.famille ?? cat.famille, fait: f.fait };
    delete q.forme;
    const tf = this.formFamily(q), part = trouPartOf(this.c0, tf, this.cran());
    if (part != null) {
      // lot 3 bis (A1) : amis de 10 et maisons, la part de formes à trou de la famille à ce cran (exemples guidés compris) ;
      // les deux formes à trou alternent (compteurs engagés quand la question est posée : `ret`)
      const k = (this.formeK?.[tf] ?? 0) + 1, trou = trouTurn(part, k);
      q.forme = trou ? ((this.trouAlt ?? 0) % 2 ? "trouGauche" : "trouDroite") : "directe"; q._forme = { tf, trou };
    } else {
      q.forme = guide ? "directe" : formFor(this.stored(f.fait) ?? q, null, this.rnd, { trouFamille: !!e.trou || trouOpenFor(this.c0, this.fam, q.a, q.b), directe: !!e.directe });
      // lot 3, famille choisie : « plus dur » une question sur deux à trou, « très dur » toutes, même pas encore ouvertes
      if (!guide && e.trouPart) { const k = (this.trouK ?? 0) + 1, want = trouTurn(e.trouPart, k); q.forme = want ? (this.rnd() < 0.5 ? "trouDroite" : "trouGauche") : "directe"; q._trouK = true; }
    }
    if (guide) q.guide = true;
    if (e.aideDEmblee) q.aideDEmblee = true;
    // lot 3 : les presque-doubles rappellent le double à chaque question (forme directe : sinon il donnerait la réponse)
    const fc = familyOf(this.c0, this.famille);
    if (fc?.rappelDouble && !guide && q.forme === "directe" && ruleFacts(this.c0, fc.id).some((r) => r.fait === q.fait)) q.rappel = { d: Math.min(q.a, q.b) };
    // l'appui visuel : celui de la famille en cours si le fait relève de sa règle, sinon celui de sa famille
    const cur = familyOf(this.c0, this.famille), own = familyOf(this.c0, q.famille)?.aide;
    q.appui = cur?.aide !== "fait" && ruleFacts(this.c0, cur.id).some((r) => r.fait === q.fait) ? cur.aide : own && own !== "fait" ? own : aidFor(q.a, q.b);
    return q;
  }
  // un candidat pour la question en cours (ordre de préférence d'avant le lot 3 bis)
  choose(guide) {
    let f = null;
    if (this.simpler) f = this.pickEasy();
    // exemples guidés : un fait de la famille déjà rencontré de préférence (l'exemple montre la méthode)
    if (!f && guide) f = this.pickFamily(false) ?? this.pickFamily(true);
    // lot 3 : au moins 80 % sur la famille en cours (partFamille ; toutes au cran « plus facile ») : une question sur
    // cinq pour les autres familles, la 5e, la 10e…
    const famTurn = !this.otherAllowed();
    const extra = famTurn ? [] : this.extraPool();
    if (!f) f = famTurn ? this.pickFamily() ?? this.pickOther() : (extra.length ? this.pickFamily(true, extra) : null) ?? this.pickOther() ?? this.pickFamily();
    return f ?? this.pickOther() ?? this.pickNewOther() ?? this.pickOverflow();
  }
  // lot 3 bis : la famille en cours n'a plus rien d'utilisable (ses faits connus déjà posés 3 fois, §0), la limite de faits
  // nouveaux de la séance est atteinte (souvent par l'échauffement) et les autres familles aussi sont épuisées : un fait
  // nouveau de la famille quand même, tant que la boîte 1 ne compte pas `boite1Max` faits RATÉS (la protection de l'enfant
  // qui se trompe beaucoup ; les faits nouveaux de la séance, pas encore ratés, n'y comptent pas) ; comme pour une famille
  // choisie (lot 3), plutôt que d'arrêter la notion du jour au bout de quelques minutes ou de tourner sur les mêmes faits
  pickOverflow() {
    const ratés = this.w.facts.filter((f) => f.boite === 1 && (f.historique ?? []).some((h) => h.juste === false)).length;
    if (ratés >= this.c.boite1Max) return null;
    const f0 = this.corePool().filter((f) => !this.stored(f.fait) && !this.asked.has(f.fait) && !this.tried?.has(f.fait)).sort((x, y) => this.rank(x) - this.rank(y))[0];
    if (!f0) return null;
    const { src, ...f } = f0; void src; return newFact(f, this.clock());
  }
  cand(q) { return { cle: `fait:${q.fait}`, reponse: expected(q) }; }
  next({ guide = false } = {}) {
    if (!guide) this.replays.forEach((r) => r.in--);
    // (une question qui revient d'une autre famille attend si elle ferait passer la famille sous 80 % ; lot 3 bis : ou si elle
    // ferait une troisième fois de suite la même réponse, ou une suite prévisible)
    const due = guide || this.simpler ? -1 : this.replays.findIndex((r) => r.in <= 0 && (this.inFamily(r.q.fait) || this.otherAllowed()) && this.var.cost(this.cand(r.q), { retour: true }) < 50);
    if (due >= 0) { const r = this.replays.splice(due, 1)[0]; return this.ret({ ...r.q, revient: true }); }
    // lot 3 bis (docs/SPEC-LOT3BIS.md, §0) : plusieurs candidats, le premier qui respecte les règles de la réponse qui varie ;
    // aucun sous la limite de passages : la notion du jour s'arrête (null)
    this.tried = new Set(); let best = null;
    for (let i = 0; i < 16; i++) {
      const f = this.choose(guide); if (!f) break;
      const q = this.question(f, { guide }), cout = this.var.cost(this.cand(q), { attente: this.pending(q.fait) });
      if (!best || cout < best.cout) best = { q, cout };
      if (!cout) break;
      this.tried.add(f.fait);
    }
    this.tried = null;
    if (!best || best.cout >= MANQUE) return null;
    this.simpler = false;
    if (!guide) this.k++;
    return this.ret(best.q);
  }
  ret(q) {
    this.asked.set(q.fait, (this.asked.get(q.fait) ?? 0) + 1); this.last.push(q.fait); this.var.note(this.cand(q));
    if (q._forme) { (this.formeK ??= {})[q._forme.tf] = (this.formeK[q._forme.tf] ?? 0) + 1; if (q._forme.trou) this.trouAlt = (this.trouAlt ?? 0) + 1; }
    if (q._trouK) this.trouK = (this.trouK ?? 0) + 1;
    delete q._forme; delete q._trouK;
    if (q.nouveau && !q.revient) { this.lastNew = q; this.turn = (this.turn ?? 0) + 1; }
    if (!q.guide) { this.nAll = (this.nAll ?? 0) + 1; if (this.inFamily(q.fait)) this.nFam = (this.nFam ?? 0) + 1; }
    return { q, cfg: this.cfgOf(q) };
  }

  // ---------------------------------------------------------------- une réponse
  // r (screen.ask) : { q, value, ok, ms, listens, aide, nsp, correctionPassee }
  async record(r, cfg) {
    void cfg;
    const q = r.q, events = [], scratch = [];
    // (cran « plus facile », décision du parent du 27 septembre : un fait réussi avec l'aide affichée d'emblée ne
    // change pas de boîte, comme « juste avec une aide » ; il n'est pas renvoyé en boîte 1 pour autant)
    const res = await this.w.record(q, { value: r.value, ms: r.ms, listens: r.listens, aide: !!r.aide || !!q.guide, aideDEmblee: !!q.aideDEmblee, nsp: r.nsp, correctionPassee: r.correctionPassee }, scratch);
    if (q.guide) return { etoiles: res.juste ? 1 : 0, events };
    this.count++; if (res.juste) this.ok++;
    // l'erreur : le fait revient 3 questions plus loin (une seule fois)
    if (!res.juste && !q.revient && (this.asked.get(q.fait) ?? 0) < this.N.memeFaitMax) this.replays.push({ q: { ...q, revient: undefined }, in: 3 });
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
  // stagnation : la séance compte pour la famille en cours ; au seuil, elle est dépassée (families.js, noteNotion)
  async finish() {
    if (!(this.fam.notion ?? []).includes(this.famille)) this.fam = { ...this.fam, notion: [...(this.fam.notion ?? []), this.famille] };
    const u = updateFamilies(this.c0, this.fam, this.w.facts, this.clock(), { seance: this.seance });
    const n = noteNotion(this.c0, u.st, this.famille, this.clock(), { seance: this.seance });
    this.fam = n.st; this.w.fam = n.st; await this.save();
    return { rate: this.count ? this.ok / this.count : null, events: [...this.events, ...u.events, ...n.events] };
  }
  save() { return this.store?.put("niveaux", this.fam); }
}
export { key };
