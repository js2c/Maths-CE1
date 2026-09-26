// LA SÉANCE (docs/SPEC.md, « Cadre d'une séance »). Elle enchaîne les étapes de content/seance.json :
// accueil, échauffement, notion du jour, défi record, problème du jour, récompense. Chaque étape est
// jouée par un « gestionnaire » fourni par l'application (l'écran) ; une étape désactivée, ou sans
// gestionnaire (pas encore construite), est sautée et notée comme telle dans l'enregistrement.
//  - plafond : au bout de dureeMaxMin minutes, on ne pose plus de question (on garde de quoi faire la
//    récompense) ; chaque étape a aussi sa durée maximale ;
//  - la séance est enregistrée dès son début (magasin « seances ») et mise à jour après chaque réponse :
//    une séance interrompue reste dans l'historique, « terminée : non » ;
//  - une seule séance terminée par jour : ensuite, l'application dit « à demain » (doneToday).
// Aucun accès au DOM ici : l'horloge et les gestionnaires sont injectés (tests : tests/unit/session.test.mjs).

export const sameDay = (a, b) => { const x = new Date(a), y = new Date(b); return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate(); };
// une séance a-t-elle déjà été terminée aujourd'hui ?
export const doneToday = async (store, now = Date.now()) => (await store.all("seances")).some((s) => s.terminee && sameDay(s.debut, now));
// la notion du jour : au lot 1, toujours la ligne graduée (décision notée dans docs/AVANCEMENT.md)
export const chooseModule = () => 1;

export class Session {
  // content : seance.json ; handlers : { accueil, echauffement, notion, defi, probleme, recompense } ;
  // rewards : les étoiles (rewards.js) ; clock : l'heure en ms
  constructor({ store, content, handlers, rewards = null, clock = () => Date.now() }) {
    this.store = store; this.c = content; this.handlers = handlers; this.rewards = rewards; this.clock = clock;
    this.rec = null; this.lastOk = null;
  }
  get id() { return this.rec?.id ?? null; }
  // l'heure après laquelle on ne pose plus de nouvelle question
  get deadline() { return this.rec.debut + this.c.dureeMaxMin * 60000 - this.c.reserveRecompenseS * 1000; }
  // faut-il arrêter de poser des questions (plafond de la séance, ou fin de l'étape en cours) ?
  over(stageEnd = Infinity) { const t = this.clock(); return t >= this.deadline || t >= stageEnd; }
  async start() {
    this.rec = { debut: this.clock(), fin: null, dureeS: null, terminee: false, module: chooseModule(), questions: 0, justes: 0, reussite: null, etoiles: 0, etapes: [] };
    this.rec.id = await this.store.add("seances", this.rec);
    return this;
  }
  save() { this.rec.fin = this.clock(); this.rec.dureeS = Math.round((this.rec.fin - this.rec.debut) / 1000); return this.store.put("seances", this.rec); }
  // une réponse donnée (les exemples guidés comptent comme des questions posées)
  async answered(ok) { this.rec.questions++; if (ok) this.rec.justes++; this.rec.reussite = +(this.rec.justes / this.rec.questions).toFixed(3); this.lastOk = ok; await this.save(); }
  // des étoiles gagnées : aussitôt ajoutées au trésor (on ne perd jamais rien, même si la séance s'arrête)
  async stars(n, raison) { if (!n) return; this.rec.etoiles += n; await this.rewards?.add(n, raison); await this.save(); }
  // un niveau franchi dans un module : une étoile arc-en-ciel (montrée à la récompense ; elles ouvriront
  // les zones du récif, lot 4)
  async levelUp() { this.rec.arcEnCiel = (this.rec.arcEnCiel ?? 0) + 1; await this.rewards?.special("arcEnCiel"); await this.save(); }
  async run() {
    if (!this.rec) await this.start();
    for (const step of this.c.etapes) {
      const h = this.handlers[step.id], t0 = this.clock();
      if (step.actif === false || !h) { this.rec.etapes.push({ id: step.id, sautee: step.actif === false ? "désactivée" : "pas encore construite" }); continue; }
      const asks = step.id !== "accueil" && step.id !== "recompense";
      if (asks && this.over()) { this.rec.etapes.push({ id: step.id, sautee: "temps écoulé" }); continue; }
      // la séance est terminée quand vient la récompense : si l'enfant ferme pendant, elle compte quand même
      if (step.id === "recompense") this.rec.terminee = true;
      await h({ session: this, step, end: step.minutes ? t0 + step.minutes * 60000 : Infinity });
      this.rec.etapes.push({ id: step.id, dureeS: Math.round((this.clock() - t0) / 1000) });
      await this.save();
    }
    this.rec.terminee = true; await this.save();
    return this.rec;
  }
}
