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
//    du jour, Module2Runner). (Lot « Les leçons » : plus de leçon ici, elles ont leur bulle à l'accueil ; « À toi ! », à la
//    fin d'une leçon, lance directement l'exercice associé en entraînement libre si la séance du jour est faite : `start`.)
import { Module1Runner } from "../modules/numberline/runner.js";
import { Module2Runner } from "../modules/facts/runner.js";
import { FactsScreen } from "../modules/facts/screen.js";
import { chooseModule, CRANS } from "./session.js";
import { allowedCrans, chooseCran } from "./selector.js";
import { choose } from "./choice.js";
import { Module3Runner } from "../modules/calc/runner.js";
import { median } from "../modules/facts/facts.js";
import { Module4Runner } from "../modules/voiliers/runner.js";
import { Module5Runner } from "../modules/mult/runner.js";
import { Module6Runner } from "../modules/etal/runner.js";

const PROPOSE_STOP_MS = 10 * 60000;
// (lot « Correctifs de la confrontation 2 », écart 3.8, décision du parent du 3 novembre 2026) l'entraînement libre qui suit une leçon
// (« À toi ! », la séance du jour déjà faite) commence par les exemples guidés de l'exercice associé, comme la séance du jour : autant
// que la notion du jour en donne (seance.json, `notion.moduleN.guides`), moins si l'exercice le décide (la multiplication :
// `guidesDus`). Le calcul rapide, les voiliers et l'étal décident eux-mêmes de leurs exemples, ici comme dans la séance du jour.
export const guidesApresLecon = (seance, module, runner, apresLecon) => {
  if (!apresLecon) return 0;
  const N = seance?.etapes?.find((e) => e.id === "notion") ?? {}, n = N[`module${module}`]?.guides ?? N.guides ?? 0;
  return runner?.guidesDus ? runner.guidesDus(n) : n;
};

export class FreeTraining {
  constructor(app, { store, module1, module2, module3 = null, module4 = null, module5 = null, module6 = null, rnd, seance = null }) { this.app = app; this.store = store; this.m1 = module1; this.m2 = module2; this.m3 = module3; this.m4 = module4; this.m5 = module5; this.m6 = module6; this.rnd = rnd; this.seance = seance; this.rec = null; this.cran = "conseille"; }
  // le sélecteur, sans étoiles ; l'exercice a été choisi : il ne part jamais seul (décision du parent du 19 octobre 2026)
  async pickCran() {
    const sel = this.seance?.selecteur; if (!sel?.actif) return (this.cran = "conseille");
    this.cran = await chooseCran(this.app, { allowed: allowedCrans(await this.store.setting("cransAutorises")), stars: false, attenteS: null, cls: "free" });
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
  // le menu : l'écran « choisir » (lot 3), sans étoiles
  async menu() {
    const { app } = this;
    this.t0 ??= app.clock.now();
    const c = await choose(app, { intro: `${app.text.data.encore} ${app.text.data.libre}`, stars: false, store: this.store, content: { module1: this.m1, module2: this.m2, module3: this.m3, module4: this.m4, module5: this.m5, module6: this.m6, seance: this.seance ?? {} } });
    return this.start(c);
  }
  // l'exercice choisi ({ module, niveau } ou { module: 2, famille }), sans fin ; (lot « Les leçons » : `apresLecon`, la leçon
  // qui vient d'être vue depuis le menu des leçons, notée dans la séance libre)
  async start(c) {
    this.t0 ??= this.app.clock.now();
    if (c.apresLecon) { await this.seanceId(); this.rec.apresLecon = c.apresLecon; await this.store.put("seances", this.rec); }
    this.apresLecon = c.apresLecon ?? null;
    if (c.module === 1) return this.line(c.niveau);
    if (c.module === 2) return this.facts(c.famille);
    if (c.module === 3) return this.calc(c.niveau);
    if (c.module === 5) return this.mult(c.niveau);
    if (c.module === 6) return this.etal(c.niveau);
    return this.voiliers(c.niveau);
  }
  // la ligne graduée au niveau choisi, sans fin
  async line(niveau = null) {
    const { app } = this, screen = app.lineScreen();
    await this.pickCran(); if (this.fini) return;
    const runner = await new Module1Runner({ screen, store: this.store, content: this.m1, rnd: this.rnd, seance: await this.seanceId(), variete: this.seance?.variete, offset: () => this.offset, cran: () => this.cran, choix: niveau }).load();
    runner.libre = true; this.runner = runner;
    let g = guidesApresLecon(this.seance, 1, runner, this.apresLecon);
    for (;;) {
      if (this.fini) return; // (lot « Recette de l'enfant », point 2 : la maison a fermé la portée de l'entraînement libre)
      const guide = g-- > 0, { q, cfg } = runner.next({ guide }), r = await screen.ask(q, cfg, { guide });
      // les étoiles de mer qu'elle rendrait sont ignorées ; un niveau franchi compte, et son étoile arc-en-ciel
      // est gardée pour la récompense de la séance suivante (docs/SPEC-LOT2.md, « Autres règles »)
      const { events } = await runner.record(r, cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      if (!guide) await this.answered(r.ok);
    }
  }
  // les additions de la famille choisie, sans fin (le déroulement de la notion du jour, réponses marquées « libre »)
  async facts(famille = null) {
    const { app } = this, screen = (app.facts ??= new FactsScreen(app, this.m2));
    await this.pickCran(); if (this.fini) return;
    const runner = await new Module2Runner({ store: this.store, content: this.m2, rnd: this.rnd, seance: await this.seanceId(), variete: this.seance?.variete, cran: () => this.cran, choix: famille }).load();
    runner.w.libre = true; this.runner = runner;
    screen.show(true); screen.notion = true;
    let g = guidesApresLecon(this.seance, 2, runner, this.apresLecon);
    for (;;) {
      if (this.fini) return;
      const guide = g-- > 0, { q, cfg } = runner.next({ guide }), r = await screen.askNotion(q, cfg, { guide });
      const { events } = await runner.record(r, cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      if (!guide) await this.answered(r.ok);
    }
  }
  // lot 3 : le calcul rapide au niveau choisi, sans fin (réponses marquées « libre »)
  async calc(niveau) {
    const { app } = this; await this.pickCran(); if (this.fini) return; await app.sprites.load("calcul");
    const base = median((await this.store.setting("tempsDeBase"))?.mesures ?? []) ?? this.m2.base.defautS * 1000;
    const runner = await new Module3Runner({ store: this.store, content: this.m3, content2: this.m2, rnd: this.rnd, seance: await this.seanceId(), variete: this.seance?.variete, cran: () => this.cran, choix: niveau, baseMs: base }).load();
    runner.libre = true; this.runner = runner;
    const fs = (app.facts ??= new FactsScreen(app, this.m2)); fs.show(true);
    for (;;) {
      if (this.fini) return;
      const { q, cfg } = runner.next(), r = await app.calc.askNotion(q);
      const { events } = await runner.record(r, cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      await this.answered(r.ok);
    }
  }
  // lot « Multiplication » : la multiplication au niveau choisi, sans fin (réponses marquées « libre »)
  async mult(niveau) {
    const { app } = this; await this.pickCran(); if (this.fini) return; await app.sprites.load("aides");
    const base = median((await this.store.setting("tempsDeBase"))?.mesures ?? []) ?? this.m2.base.defautS * 1000;
    const runner = await new Module5Runner({ store: this.store, content: this.m5, rnd: this.rnd, seance: await this.seanceId(), variete: this.seance?.variete, cran: () => this.cran, choix: niveau, baseMs: base }).load();
    runner.libre = true; this.runner = runner;
    const fs = (app.facts ??= new FactsScreen(app, this.m2)); fs.show(true);
    let g = guidesApresLecon(this.seance, 5, runner, this.apresLecon);
    for (;;) {
      if (this.fini) return;
      const guide = g-- > 0, x = runner.next({ guide }); if (!x) { runner.var = new runner.var.constructor(runner.var.c); continue; }
      const r = await app.mult.askNotion(x.q);
      const { events } = await runner.record(r, x.cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      if (!guide) await this.answered(r.ok);
    }
  }
  // lot « Les voiliers » : les voiliers au niveau choisi, sans fin (réponses marquées « libre ») ; la maison les quitte
  // (main.js, abandonActivity : la scène s'en va)
  async voiliers(niveau) {
    const { app } = this; await this.pickCran(); if (this.fini) return;
    const runner = await new Module4Runner({ store: this.store, content: this.m4, rnd: this.rnd, seance: await this.seanceId(), variete: this.seance?.variete, cran: () => this.cran, choix: niveau }).load();
    runner.libre = true; this.runner = runner;
    // (lot « Correctif : l'étal resté actif à l'accueil ») la maison pendant l'installation : la portée de l'entraînement libre a
    // déjà appelé `leave()`, qui l'arrête net (`enter` rend null) ; rien n'est posé ni relancé ensuite
    if (this.fini) return;
    // (quittée en route, elle a déjà été rangée : la ranger encore retirerait la scène d'un exercice suivant)
    const ok = await app.voiliers.enter(); if (ok === null) return; if (this.fini) return app.voiliers.leave(); if (!ok) return this.menu();
    for (;;) {
      if (this.fini) return;
      const x = runner.next(); if (!x) { runner.var = new runner.var.constructor(runner.var.c); continue; }
      const r = await app.voiliers.ask(x.q);
      const { events } = await runner.record(r, x.cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      if (!x.q.guide) await this.answered(r.ok);
    }
  }
  // lot « L'étal du pêcheur » : l'étal au niveau choisi, sans fin (réponses marquées « libre ») ; la maison le quitte (main.js,
  // abandonActivity : la scène s'en va) ; pas de leçon ici (le menu des leçons les propose), l'exemple guidé la première fois
  async etal(niveau) {
    const { app } = this; await this.pickCran(); if (this.fini) return;
    const runner = await new Module6Runner({ store: this.store, content: this.m6, rnd: this.rnd, seance: await this.seanceId(), variete: this.seance?.variete, cran: () => this.cran, choix: niveau }).load();
    runner.libre = true; this.runner = runner;
    // (lot « Correctif : l'étal resté actif à l'accueil ») la maison pendant l'installation l'arrête net (`enter` rend false : la
    // portée de l'entraînement libre a déjà rangé la scène ; la ranger encore retirerait celle d'un exercice suivant)
    if (this.fini) return;
    if (!(await app.etal.enter({ rnd: this.rnd }))) return; if (this.fini) return app.etal.leave();
    for (;;) {
      if (this.fini) return;
      const x = runner.next(); if (!x) { runner.var = new runner.var.constructor(runner.var.c); continue; }
      const r = await app.etal.ask(x.q);
      const { events } = await runner.record(r, x.cfg);
      for (const e of events) if (e.type === "montee") await app.rewards.arcFromFree();
      if (!x.q.guide) await this.answered(r.ok);
    }
  }
}
