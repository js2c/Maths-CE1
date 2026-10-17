// LA SÉANCE (docs/SPEC.md, « Cadre d'une séance »). Elle enchaîne les étapes de content/seance.json :
// accueil, échauffement, notion du jour, défi record, problème du jour, récompense. Chaque étape est
// jouée par un « gestionnaire » fourni par l'application (l'écran) ; une étape désactivée, ou sans
// gestionnaire (pas encore construite), est sautée et notée comme telle dans l'enregistrement.
//  - plafond : au bout de dureeMaxMin minutes, on ne pose plus de question (on garde de quoi faire la
//    récompense) ; chaque étape a aussi sa durée maximale ;
//  - la séance est enregistrée dès son début (magasin « seances ») et mise à jour après chaque réponse :
//    une séance interrompue reste dans l'historique, « terminée : non » ;
//  - une seule séance terminée par jour : ensuite, l'application dit « à demain » (doneToday) ;
//  - pause (bouton « maison », lot 1 bis) : le temps passé en pause ne compte ni dans le plafond, ni dans
//    la durée des étapes, ni dans la durée enregistrée (`paused` : ms de pause depuis le lancement) ;
//  - frise d'avancement : `progress` (étape en cours, questions faites et prévues), signalé à `onProgress` ;
//  - sélecteur de difficulté (lot 2, docs/SPEC-LOT2.md, section 2) : le cran choisi (`setCran`) vaut pour toute
//    la séance ; il multiplie les étoiles des bonnes réponses et des erreurs corrigées (les fractions
//    s'accumulent : une étoile tombe quand le total atteint un entier) ; protection : 3 erreurs sur les 5
//    dernières réponses à un cran au-dessus du conseillé font redescendre d'un cran (`onCranDown`) ;
//  - défi record (lot 2) : l'étape n'a lieu qu'à partir de la 5e séance terminée et si assez de faits sont
//    en boîte 3 ou plus (`challengeReady`) ; sinon elle est sautée sans rien dire.
//  - lot 3 (docs/SPEC-LOT3.md, sections 2 et 4) : l'exercice choisi par l'enfant (écran « choisir » : `choix`,
//    { module, niveau } ou { module, famille }) est la notion du jour de la séance, qui compte comme la séance du
//    jour ; le module imposé par le parent n'est alors pas consommé (il vaut pour la prochaine séance « jouer ») ;
//    `sans` : les étapes retirées par un réglage du parent (« Échauffement : non »), sautées et notées comme telles
//    (lot 3, étape 5 : `sansRaison`, une autre raison, par exemple l'échauffement déjà fait ou passé ce jour-là).
// Aucun accès au DOM ici : l'horloge et les gestionnaires sont injectés (tests : tests/unit/session.test.mjs).

export const sameDay = (a, b) => { const x = new Date(a), y = new Date(b); return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate(); };
// une séance a-t-elle déjà été terminée aujourd'hui ?
// (l'entraînement libre, marqué `libre`, n'est jamais une séance terminée)
export const doneToday = async (store, now = Date.now()) => (await store.all("seances")).some((s) => s.terminee && !s.libre && sameDay(s.debut, now));
// la notion du jour (lot 2, étape 6 ; docs/SPEC-LOT2.md, section 2) : elle alterne SÉANCE APRÈS SÉANCE entre les
// modules de `alternance.modules` (ligne graduée, additions) : jamais deux fois de suite le même, sauf module
// imposé par le parent (réglage « moduleImpose », valable une séance) ou si l'autre n'a rien à proposer
// (`has(module)`). Sans alternance (lot 1) : toujours la ligne graduée.
// lot 3 (docs/SPEC-LOT3.md, section 6) : trois modules ; parmi ceux qui ne sont pas le dernier joué, le moins maîtrisé
// d'abord (`mastery(module)`, de 0 à 1 ; à égalité, l'ordre de la rotation) ; le dernier seulement si aucun autre n'a
// rien à proposer. Une séance d'exercice choisi compte comme la dernière jouée.
// lot « Les voiliers » : le module 4 n'est pas dans la rotation (seance.json, alternance.horsRotation) ; on y vient par
// « choisir », ou le parent l'impose pour la prochaine séance « jouer ».
// (lot « Multiplication » : un module de la rotation peut n'y entrer qu'à une date, `alternance.aPartirDe` : la multiplication à
// la rentrée de janvier ; avant, on y vient par « choisir » ou parce que le parent l'impose ; `now` : l'heure de la séance)
export const chooseModule = (c = {}, seances = [], impose = null, has = () => true, mastery = () => 0, now = Date.now()) => {
  const from = c.alternance?.aPartirDe ?? {}, mods = (c.alternance?.modules ?? [1]).filter((m) => !from[m] || new Date(`${from[m]}T00:00:00`).getTime() <= now);
  const all = c.alternance?.modules ?? [1];
  // (lot « Les voiliers » : un module hors de la rotation, `horsRotation`, peut être imposé par le parent)
  if (impose && (all.includes(impose) || (c.alternance?.horsRotation ?? []).includes(impose))) return { module: impose, impose: true };
  const last = [...seances].filter((s) => s.terminee && !s.libre && s.module).sort((x, y) => x.debut - y.debut).at(-1)?.module;
  const i = mods.indexOf(last), order = i < 0 ? mods : [...mods.slice(i + 1), ...mods.slice(0, i + 1)];
  const others = order.filter((m) => m !== last && has(m)), m = [...others].sort((x, y) => mastery(x) - mastery(y) || others.indexOf(x) - others.indexOf(y))[0];
  return { module: m ?? order.find((x) => has(x)) ?? mods[0] };
};
// les crans du sélecteur de difficulté (content/seance.json, selecteur)
export const CRANS = ["facile", "conseille", "dur", "tresdur"];
// le défi record peut-il avoir lieu ? (docs/SPEC-LOT2.md, section 2 : à partir de la 5e séance terminée,
// seulement si au moins 8 faits sont en boîte 3 ou plus)
export async function challengeReady(store, step) {
  if ((await store.setting("defiActif")) === false) return false; // le parent l'a désactivé
  const done = (await store.all("seances")).filter((s) => s.terminee && !s.libre).length;
  const solid = (await store.all("faits")).filter((f) => f.boite >= 3).length;
  return done >= (step.aPartirDeSeance ?? 0) && solid >= (step.faitsBoite3Min ?? 0);
}

// (lot « Décisions sur les constats de l'agent », décision 1 du parent du 13 octobre 2026 ; constat 1 de l'agent : après un
// rechargement de la page, la séance du soir était perdue) LA SÉANCE À REPRENDRE après un rechargement (Android a fermé le
// navigateur, ou une nouvelle version a pris la main au lancement) : la dernière séance (hors entraînement libre et leçons seules),
// commencée le jour même, ni terminée ni interrompue (par le parent, ou un autre exercice choisi), notée par cette version
// (`etapeEnCours`, écrit à chaque changement d'étape ; une fiche d'une version d'avant n'en a pas et n'est pas reprise), et aucune
// séance terminée ce jour-là. Le lendemain, elle reste « interrompue », comme avant.
export async function repriseDuJour(store, now = Date.now()) {
  const S = (await store.all("seances")).filter((s) => !s.libre);
  if (S.some((s) => s.terminee && sameDay(s.debut, now))) return null;
  const s = S.sort((a, b) => a.debut - b.debut).at(-1);
  if (!s || s.terminee || s.interruption || s.arreteeParParent || !s.etapeEnCours || !sameDay(s.debut, now)) return null;
  return s;
}

// (décision du 17 octobre 2026) le point de reprise de l'étape en cours, s'il peut servir : écrit par la même version de
// l'application (une nouvelle version qui prend la main au lancement suivant peut avoir changé ce que garde un exercice : la
// séance reprend alors au début de l'étape, comme avant)
const pointValide = (r) => (r?.pointReprise && r.pointReprise.etape === r.etapeEnCours && (r.pointReprise.version ?? null) === Session.version ? r.pointReprise : null);
export class Session {
  // la version de l'application (main.js, version.json), écrite avec chaque point de reprise
  static version = null;
  // content : seance.json ; handlers : { accueil, echauffement, notion, defi, probleme, recompense } ;
  // rewards : les étoiles (rewards.js) ; clock : l'heure en ms
  // onCranDown(de, a) : la protection vient de redescendre d'un cran (la voix le dit)
  // (décision 1) `reprise` : la fiche d'une séance à reprendre (repriseDuJour) ; elle continue à l'étape en cours (décision du
  // parent du 17 octobre 2026 : à la question près, `point`)
  constructor({ store, content, handlers, rewards = null, clock = () => Date.now(), paused = () => 0, onProgress = null, onCranDown = null, choix = null, sans = [], sansRaison = {}, mastery = () => 0, reprise = null }) {
    this.choix = reprise?.choix ?? choix; this.sans = sans; this.sansRaison = sansRaison; this.mastery = mastery; this.reprise = reprise;
    this.store = store; this.c = content; this.handlers = handlers; this.rewards = rewards; this.clock = clock; this.paused = paused; this.onProgress = onProgress; this.onCranDown = onCranDown;
    this.rec = null; this.lastOk = null; this.progress = { etape: null, faites: 0, prevues: 0 };
    this.cranIdx = 1; this.frac = 0; this.win = []; this.nouveaux = 0;
  }
  // ---------------------------------------------------------------- le cran de la séance
  get sel() { return this.c.selecteur ?? { multiplicateurs: [0.5, 1, 1.5, 2], decalages: [-1, 0, 1, 2], protection: { sur: 5, erreurs: 3 } }; }
  get cran() { return CRANS[this.cranIdx]; }
  // l'écart au conseillé en crans (-1 à 2) et le multiplicateur des étoiles du cran en cours
  get offset() { return this.sel.decalages[this.cranIdx]; }
  get multiplier() { return this.sel.multiplicateurs[this.cranIdx]; }
  async setCran(name) {
    this.cranIdx = Math.max(0, CRANS.indexOf(name)); this.win = [];
    if (this.rec) { this.rec.cran = name; this.rec.cranDepart = name; await this.save(); }
  }
  get id() { return this.rec?.id ?? null; }
  // l'heure « active » : l'heure moins le temps passé en pause depuis le début de la séance
  // (décision 1 : une séance reprise ne compte pas le temps passé entre la dernière écriture et la reprise, `decalage`)
  active() { return this.clock() - (this.paused() - this.p0) - (this.decalage ?? 0); }
  // l'heure après laquelle on ne pose plus de nouvelle question
  get deadline() { return this.rec.debut + this.c.dureeMaxMin * 60000 - this.c.reserveRecompenseS * 1000; }
  // faut-il arrêter de poser des questions (plafond de la séance, ou fin de l'étape en cours) ?
  over(stageEnd = Infinity) { const t = this.active(); return t >= this.deadline || t >= stageEnd; }
  async start() {
    this.p0 = this.paused();
    // (décision 1) la séance reprise : la même fiche, qui continue (ses réponses, ses étoiles, son cran, l'ordre de ses étapes) ;
    // son temps actif repart d'où il en était ; la reprise est notée pour l'historique du parent
    if (this.reprise) {
      const r = (this.rec = this.reprise);
      this.decalage = this.clock() - (r.debut + (r.dureeS ?? 0) * 1000); this.pause0 = r.pauseS ?? 0;
      this.cranIdx = Math.max(0, CRANS.indexOf(r.cran ?? "conseille"));
      // (décision du 17 octobre 2026) où l'étape reprend : à la question en cours, à la suivante (la réponse donnée avant le
      // rechargement est comptée), à la leçon en cours, ou au début de l'étape (le défi, l'accueil, une étape sans question posée)
      const p = pointValide(r), e = p?.encours;
      const ou = !p ? "debut" : e?.lecon ? "lecon" : e?.q && !e.reponse ? "question" : "suivante";
      (r.reprises ??= []).push({ t: this.clock(), etape: r.etapeEnCours, questions: (r.questions ?? 0) + (ou === "suivante" ? 1 : 0), ou });
      await this.save();
      return this;
    }
    // (relecture des demandes, constat 8) une séance d'avant qui ne sera plus reprise ne garde pas son point de reprise (ni dans la
    // base, ni dans l'export du parent)
    try { for (const r of await this.store.all("seances")) if (r.pointReprise) { delete r.pointReprise; delete r.etapeDebut; await this.store.put("seances", r); } } catch { /* (une base de test sans séances) */ }
    // le module du jour ; un module imposé par le parent ne vaut qu'une séance
    // (exercice choisi par l'enfant : c'est lui ; le module imposé attend la prochaine séance « jouer »)
    const impose = this.choix ? null : (await this.store.setting("moduleImpose"))?.module ?? null, pick = this.choix ? { module: this.choix.module } : chooseModule(this.c, await this.store.all("seances"), impose, this.has ?? (() => true), this.mastery, this.clock());
    if (impose) await this.store.setSetting("moduleImpose", null);
    this.rec = { debut: this.clock(), fin: null, dureeS: null, terminee: false, module: pick.module, ...(pick.impose ? { moduleImpose: true } : {}), ...(this.choix ? { choix: { ...this.choix } } : {}), questions: 0, justes: 0, reussite: null, etoiles: 0, etapes: [] };
    this.rec.id = await this.store.add("seances", this.rec);
    return this;
  }
  save() {
    if (this.stopped) return Promise.resolve();
    this.rec.fin = this.clock(); this.rec.dureeS = Math.round((this.active() - this.rec.debut) / 1000);
    const p = (this.pause0 ?? 0) + Math.round((this.paused() - this.p0) / 1000); if (p > 0) this.rec.pauseS = p;
    return this.store.put("seances", this.rec);
  }
  // la frise : combien de questions l'étape en cours prévoit au moins (le nombre ne fait que grandir : une
  // erreur fait revenir une question, une leçon relancée ajoute son exercice guidé)
  expect(n) { this.progress.prevues = Math.max(this.progress.prevues, n, this.progress.faites); this.onProgress?.(this.progress); }
  // une réponse donnée (les exemples guidés comptent comme des questions posées)
  // (le défi record ne déclenche pas la protection du cran : `protect` false)
  async answered(ok, { protect = true } = {}) {
    // (la reprise à la question près, relecture des demandes, constat 7) la réponse est comptée, et la frise avance, avant la
    // protection : sa phrase (la descente du cran, environ 3 s) ne vient qu'une fois la fiche enregistrée avec la réponse comptée
    this.rec.questions++; if (ok) this.rec.justes++; this.rec.reussite = +(this.rec.justes / this.rec.questions).toFixed(3); this.lastOk = ok;
    this.progress.faites++; this.progress.prevues = Math.max(this.progress.prevues, this.progress.faites); this.onProgress?.(this.progress);
    if (protect) await this.protect(ok);
    await this.save();
  }
  // la protection : à un cran au-dessus du conseillé, 3 erreurs sur les 5 dernières réponses -> un cran de moins
  async protect(ok) {
    if (this.cranIdx <= 1) return;
    const P = this.sel.protection; this.win = [...this.win, ok].slice(-P.sur);
    if (this.win.length < P.sur || this.win.filter((x) => !x).length < P.erreurs) return;
    const de = this.cran; this.cranIdx--; this.win = [];
    this.rec.cran = this.cran; (this.rec.descentes ??= []).push({ de, a: this.cran, apres: this.rec.questions, etape: this.progress.etape });
    this.cranDown = true; // lu par l'étape en cours (échauffement : les faits nouveaux « bonus » sont retirés)
    await this.save();
    await this.onCranDown?.(de, this.cran);
  }
  // (décision du parent du 17 octobre 2026 : la reprise à la question près) LE POINT DE REPRISE de l'étape en cours, gardé dans la
  // fiche (`rec.pointReprise`) : où en est la suite de questions (session/notion.js, modules/facts/screen.js, runWarmup), la frise,
  // l'état de l'exercice (session/instantane.js), la question en cours et, dès que l'enfant a répondu, sa réponse (avant la
  // correction). `point(etape)` : celui à reprendre, une seule fois, si la séance reprise en était à cette étape.
  point(etape) {
    const p = this.reprise && !this.pointPris && pointValide(this.rec)?.etape === etape ? this.rec.pointReprise : null;
    if (p) { this.pointPris = true; this.progress = { ...p.progress, etape }; this.onProgress?.(this.progress); }
    return p;
  }
  // (sans le prendre) la séance reprend-elle cette étape à la question près ? (la phrase d'entrée de l'étape n'est alors pas redite)
  reprendAuPoint(etape) { return !!(this.reprise && !this.pointPris && pointValide(this.rec)?.etape === etape); }
  // écrit le point (`sauver` false : il part avec la prochaine écriture de la fiche, la réponse comptée par exemple)
  async notePoint(p, { sauver = true } = {}) { if (this.stopped || !this.rec) return; this.rec.pointReprise = { ...p, version: Session.version, progress: { ...this.progress } }; if (sauver) await this.save(); }
  // la réponse de l'enfant, à l'instant où elle est donnée (avant la correction) : ajoutée au point ; une réponse provisoire (la
  // première erreur des voiliers, de l'étal) est remplacée par la réponse finale
  // (avec son heure : enregistrée après un rechargement, elle garde sa place dans l'historique du parent)
  async noteReponse(r) { const p = this.rec?.pointReprise; if (this.stopped || !p?.encours) return; p.encours.reponse = { ...r, t: this.clock() }; await this.save(); }
  // une pause (bouton « maison ») : comptée dans l'enregistrement
  async notePause() { this.rec.pauses = (this.rec.pauses ?? 0) + 1; await this.save(); }
  // le parent termine la séance en pause (espace parent) : interrompue, sans récompense ; le déroulement en
  // cours est abandonné (main.js), plus rien n'est enregistré ensuite
  // (lot 3, étape 5) ou l'enfant, depuis l'accueil en pause, choisit un autre exercice : même effet, avec la raison, pour
  // l'historique du parent (`par` : « parent » ou « enfant » ; `raison`)
  async interrupt({ par = "parent", raison = null } = {}) {
    this.rec.terminee = false; if (par === "parent") this.rec.arreteeParParent = true;
    this.rec.interruption = { par, ...(raison ? { raison } : {}), t: this.clock() };
    this.rec.pointReprise = null; this.rec.etapeDebut = null; // (plus rien à reprendre : le point ne reste pas dans la fiche)
    await this.save(); this.stopped = true;
  }
  // des étoiles gagnées : aussitôt ajoutées au trésor (on ne perd jamais rien, même si la séance s'arrête)
  // les étoiles des bonnes réponses et des erreurs corrigées suivent le multiplicateur du cran
  async stars(n, raison) {
    if (n && (raison === "bonne réponse" || raison === "erreur corrigée") && this.multiplier !== 1) { const t = this.frac + n * this.multiplier; n = Math.floor(t + 1e-9); this.frac = t - n; }
    if (!n) return; this.rec.etoiles += n; await this.rewards?.add(n, raison); await this.save(); }
  // un niveau franchi dans un module : une étoile arc-en-ciel (montrée à la récompense ; elles ouvriront
  // les zones du récif, lot 4)
  async levelUp() { this.rec.arcEnCiel = (this.rec.arcEnCiel ?? 0) + 1; await this.rewards?.special("arcEnCiel"); await this.save(); }
  async run() {
    if (!this.rec) await this.start();
    for (const step of this.c.etapes) {
      // (lot « Correctifs : passage de l'échauffement aux voiliers », point 1) une séance interrompue (« Terminer la séance »,
      // un autre exercice choisi depuis la pause) ne passe jamais à l'étape suivante, même si l'étape abandonnée se réveille
      if (this.stopped) return this.rec;
      // (décision 1) une séance reprise : les étapes déjà faites ou sautées ne sont pas refaites ; elle repart au début de la sienne
      if (this.reprise && this.rec.etapes.some((e) => e.id === step.id)) continue;
      // (la reprise à la question près, relecture des demandes, constat 4) l'étape reprise garde l'heure de son début, en temps actif :
      // son temps ne repart pas de zéro (sa limite, sa durée dans l'historique)
      const h = this.handlers[step.id], t0 = this.reprise && this.rec.etapeEnCours === step.id && this.rec.etapeDebut != null ? this.rec.etapeDebut : this.active();
      if (step.actif !== false && h && step.id === "defi" && !(await challengeReady(this.store, step))) { this.rec.etapes.push({ id: step.id, sautee: "pas encore" }); continue; }
      if (this.sans.includes(step.id)) { this.rec.etapes.push({ id: step.id, sautee: this.sansRaison[step.id] ?? "réglage du parent" }); continue; }
      if (step.actif === false || !h) { this.rec.etapes.push({ id: step.id, sautee: step.actif === false ? "désactivée" : "pas encore construite" }); continue; }
      const asks = step.id !== "accueil" && step.id !== "recompense";
      // (constat 5 de la même relecture : une réponse donnée juste avant le rechargement est enregistrée, même si le temps est écoulé)
      if (asks && this.over() && !(this.reprendAuPoint(step.id) && this.rec.pointReprise.encours?.reponse)) { this.rec.etapes.push({ id: step.id, sautee: "temps écoulé" }); continue; }
      // la séance est terminée quand vient la récompense : si l'enfant ferme pendant, elle compte quand même
      if (step.id === "recompense") this.rec.terminee = true;
      this.progress = { etape: step.id, faites: 0, prevues: 0 }; this.onProgress?.(this.progress);
      // (décision 1) l'étape en cours, écrite à chaque changement d'étape : c'est d'elle que repartirait une reprise ; (décision du
      // 17 octobre) son point de reprise, gardé si la séance reprise en était là, effacé sinon
      if (!(this.reprise && this.rec.pointReprise?.etape === step.id)) this.rec.pointReprise = null;
      this.rec.etapeEnCours = step.id; this.rec.etapeDebut = t0; await this.save();
      await h({ session: this, step, end: step.minutes ? t0 + step.minutes * 60000 : Infinity });
      if (this.stopped) return this.rec;
      this.rec.etapes.push({ id: step.id, dureeS: Math.round((this.active() - t0) / 1000) });
      await this.save();
    }
    if (this.stopped) return this.rec;
    this.rec.terminee = true; this.rec.pointReprise = null; this.rec.etapeDebut = null; this.progress = { etape: null, faites: 0, prevues: 0 }; this.onProgress?.(this.progress); await this.save();
    return this.rec;
  }
}
