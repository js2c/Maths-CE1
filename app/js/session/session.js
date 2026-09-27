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
// Aucun accès au DOM ici : l'horloge et les gestionnaires sont injectés (tests : tests/unit/session.test.mjs).

export const sameDay = (a, b) => { const x = new Date(a), y = new Date(b); return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate(); };
// une séance a-t-elle déjà été terminée aujourd'hui ?
// (l'entraînement libre, marqué `libre`, n'est jamais une séance terminée)
export const doneToday = async (store, now = Date.now()) => (await store.all("seances")).some((s) => s.terminee && !s.libre && sameDay(s.debut, now));
// la notion du jour : au lot 1, toujours la ligne graduée (décision notée dans docs/AVANCEMENT.md)
export const chooseModule = () => 1;
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

export class Session {
  // content : seance.json ; handlers : { accueil, echauffement, notion, defi, probleme, recompense } ;
  // rewards : les étoiles (rewards.js) ; clock : l'heure en ms
  // onCranDown(de, a) : la protection vient de redescendre d'un cran (la voix le dit)
  constructor({ store, content, handlers, rewards = null, clock = () => Date.now(), paused = () => 0, onProgress = null, onCranDown = null }) {
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
  active() { return this.clock() - (this.paused() - this.p0); }
  // l'heure après laquelle on ne pose plus de nouvelle question
  get deadline() { return this.rec.debut + this.c.dureeMaxMin * 60000 - this.c.reserveRecompenseS * 1000; }
  // faut-il arrêter de poser des questions (plafond de la séance, ou fin de l'étape en cours) ?
  over(stageEnd = Infinity) { const t = this.active(); return t >= this.deadline || t >= stageEnd; }
  async start() {
    this.p0 = this.paused();
    this.rec = { debut: this.clock(), fin: null, dureeS: null, terminee: false, module: chooseModule(), questions: 0, justes: 0, reussite: null, etoiles: 0, etapes: [] };
    this.rec.id = await this.store.add("seances", this.rec);
    return this;
  }
  save() {
    this.rec.fin = this.clock(); this.rec.dureeS = Math.round((this.active() - this.rec.debut) / 1000);
    const p = Math.round((this.paused() - this.p0) / 1000); if (p > 0) this.rec.pauseS = p;
    return this.store.put("seances", this.rec);
  }
  // la frise : combien de questions l'étape en cours prévoit au moins (le nombre ne fait que grandir : une
  // erreur fait revenir une question, une leçon relancée ajoute son exercice guidé)
  expect(n) { this.progress.prevues = Math.max(this.progress.prevues, n, this.progress.faites); this.onProgress?.(this.progress); }
  // une réponse donnée (les exemples guidés comptent comme des questions posées)
  async answered(ok) {
    await this.protect(ok);
    this.rec.questions++; if (ok) this.rec.justes++; this.rec.reussite = +(this.rec.justes / this.rec.questions).toFixed(3); this.lastOk = ok;
    this.progress.faites++; this.progress.prevues = Math.max(this.progress.prevues, this.progress.faites); this.onProgress?.(this.progress);
    await this.save();
  }
  // la protection : à un cran au-dessus du conseillé, 3 erreurs sur les 5 dernières réponses -> un cran de moins
  async protect(ok) {
    if (this.cranIdx <= 1) return;
    const P = this.sel.protection; this.win = [...this.win, ok].slice(-P.sur);
    if (this.win.length < P.sur || this.win.filter((x) => !x).length < P.erreurs) return;
    const de = this.cran; this.cranIdx--; this.win = [];
    this.rec.cran = this.cran; (this.rec.descentes ??= []).push({ de, a: this.cran, apres: this.rec.questions + 1, etape: this.progress.etape });
    this.cranDown = true; // lu par l'étape en cours (échauffement : les faits nouveaux « bonus » sont retirés)
    await this.save();
    await this.onCranDown?.(de, this.cran);
  }
  // une pause (bouton « maison ») : comptée dans l'enregistrement
  async notePause() { this.rec.pauses = (this.rec.pauses ?? 0) + 1; await this.save(); }
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
      const h = this.handlers[step.id], t0 = this.active();
      if (step.actif !== false && h && step.id === "defi" && !(await challengeReady(this.store, step))) { this.rec.etapes.push({ id: step.id, sautee: "pas encore" }); continue; }
      if (step.actif === false || !h) { this.rec.etapes.push({ id: step.id, sautee: step.actif === false ? "désactivée" : "pas encore construite" }); continue; }
      const asks = step.id !== "accueil" && step.id !== "recompense";
      if (asks && this.over()) { this.rec.etapes.push({ id: step.id, sautee: "temps écoulé" }); continue; }
      // la séance est terminée quand vient la récompense : si l'enfant ferme pendant, elle compte quand même
      if (step.id === "recompense") this.rec.terminee = true;
      this.progress = { etape: step.id, faites: 0, prevues: 0 }; this.onProgress?.(this.progress);
      await h({ session: this, step, end: step.minutes ? t0 + step.minutes * 60000 : Infinity });
      this.rec.etapes.push({ id: step.id, dureeS: Math.round((this.active() - t0) / 1000) });
      await this.save();
    }
    this.rec.terminee = true; this.progress = { etape: null, faites: 0, prevues: 0 }; this.onProgress?.(this.progress); await this.save();
    return this.rec;
  }
}
