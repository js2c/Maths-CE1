// L'ENTRAÎNEMENT LIBRE (docs/SPEC.md, « Fin de séance ») : après la séance du jour, le bouton « Encore ! »
// ouvre la liste des activités déjà débloquées : la ligne graduée à son niveau actuel, les additions de
// l'échauffement, la revue des leçons déjà vues.
//  - il ne rapporte ni étoiles de mer ni coquillages ; un niveau franchi y gagne son étoile arc-en-ciel, remise
//    à la récompense de la séance suivante (lot 2) ;
//  - ses réponses sont enregistrées, marquées « libre », dans une séance marquée « libre » (elle ne compte
//    jamais comme la séance du jour) ; elles comptent pour les règles d'adaptation et la révision espacée ;
//  - pas de limite de durée ; au bout de 10 minutes, la voix propose d'arrêter (une fois) ;
//  - la maison le quitte à tout moment (main.js : l'activité en cours est abandonnée, engine/clock.js) ;
//  - lot 2 : la ligne et les additions commencent par le sélecteur de difficulté, sans étoiles (donc sans
//    multiplicateur) ni protection ; le cran décale le niveau de la ligne et règle l'échauffement ;
//  - lot 3 (docs/SPEC-LOT3.md, section 2) : « Encore ! » ouvre le même écran « choisir » que l'accueil (session/choice.js),
//    sans étoiles : la ligne au niveau choisi, les additions de la famille choisie (même déroulement que la notion
//    du jour, Module2Runner), une leçon (toutes, vues ou non), puis retour à l'écran de choix.
import { Module1Runner } from "../modules/numberline/runner.js";
import { Module2Runner } from "../modules/facts/runner.js";
import { FactsScreen } from "../modules/facts/screen.js";
import { chooseModule, CRANS } from "./session.js";
import { allowedCrans, chooseCran } from "./selector.js";
import { choose } from "./choice.js";

const PROPOSE_STOP_MS = 10 * 60000;

export class FreeTraining {
  constructor(app, { store, module1, module2, rnd, seance = null }) { this.app = app; this.store = store; this.m1 = module1; this.m2 = module2; this.rnd = rnd; this.seance = seance; this.rec = null; this.cran = "conseille"; }
  // le sélecteur, sans étoiles
  async pickCran() {
    const sel = this.seance?.selecteur; if (!sel?.actif) return (this.cran = "conseille");
    this.cran = await chooseCran(this.app, { allowed: allowedCrans(await this.store.setting("cransAutorises")), stars: false, attenteS: sel.attenteS, cls: "free" });
    await this.seanceId(); this.rec.cran = this.cran; await this.store.put("seances", this.rec);
    return this.cran;
  }
  get offset() { return this.seance?.selecteur?.decalages?.[CRANS.indexOf(this.cran)] ?? 0; }
  // la séance « libre » : créée quand une activité commence, mise à jour après chaque réponse
  async seanceId() {
    if (!this.rec) { const now = Date.now(); this.rec = { debut: now, fin: now, dureeS: 0, terminee: false, libre: true, module: chooseModule().module, questions: 0, justes: 0, reussite: null, etoiles: 0, etapes: [] }; this.rec.id = await this.store.add("seances", this.rec); }
    return this.rec.id;
  }
  async answered(ok) {
    const now = Date.now();
    await this.seanceId();
    this.rec.questions++; if (ok) this.rec.justes++; this.rec.reussite = +(this.rec.justes / this.rec.questions).toFixed(3);
    this.rec.fin = now; this.rec.dureeS = Math.round((now - this.rec.debut) / 1000);
    await this.store.put("seances", this.rec);
    if (!this.told && this.app.clock.now() - this.t0 > PROPOSE_STOP_MS) { this.told = true; await this.app.voice.say(this.app.text.data.libreLongtemps); }
  }
  // le menu : l'écran « choisir » (lot 3), sans étoiles ; une leçon ramène à ce menu
  async menu() {
    const { app } = this;
    this.t0 ??= app.clock.now();
    app.voice.stop(); await app.voice.say(`${app.text.data.encore} ${app.text.data.libre}`);
    for (;;) {
      const c = await choose(app, { stars: false, store: this.store, content: { module1: this.m1, module2: this.m2, seance: this.seance ?? {} } });
      if (c.module === 1) return this.line(c.niveau);
      if (c.module === 2) return this.facts(c.famille);
      await this.lesson(c.lecon);
    }
  }
  // la ligne graduée au niveau choisi, sans fin
  async line(niveau = null) {
    const { app } = this, screen = app.lineScreen();
    await this.pickCran();
    const runner = await new Module1Runner({ screen, store: this.store, content: this.m1, rnd: this.rnd, seance: await this.seanceId(), offset: () => this.offset, cran: () => this.cran, choix: niveau }).load();
    runner.libre = true; this.runner = runner;
    for (;;) {
      const { q, cfg } = runner.next(), r = await screen.ask(q, cfg);
      // les étoiles de mer qu'elle rendrait sont ignorées ; un niveau franchi compte, et son étoile arc-en-ciel
      // est gardée pour la récompense de la séance suivante (docs/SPEC-LOT2.md, « Autres règles »)
      const { events } = await runner.record(r, cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      await this.answered(r.ok);
    }
  }
  // les additions de la famille choisie, sans fin (le déroulement de la notion du jour, réponses marquées « libre »)
  async facts(famille = null) {
    const { app } = this, screen = (app.facts ??= new FactsScreen(app, this.m2));
    await this.pickCran();
    const runner = await new Module2Runner({ store: this.store, content: this.m2, rnd: this.rnd, seance: await this.seanceId(), cran: () => this.cran, choix: famille }).load();
    runner.w.libre = true; this.runner = runner;
    screen.show(true); screen.notion = true;
    for (;;) {
      const { q, cfg } = runner.next(), r = await screen.askNotion(q, cfg);
      const { events } = await runner.record(r, cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      await this.answered(r.ok);
    }
  }
  // une leçon (sans étoiles), puis retour au menu
  async lesson(id) {
    const r = await this.app.lessons.play(id);
    await this.seanceId(); (this.rec.lecons ??= []).push({ id, raison: "libre", ...r }); await this.store.put("seances", this.rec);
  }
}
