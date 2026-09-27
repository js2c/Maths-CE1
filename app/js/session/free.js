// L'ENTRAÎNEMENT LIBRE (docs/SPEC.md, « Fin de séance ») : après la séance du jour, le bouton « Encore ! »
// ouvre la liste des activités déjà débloquées : la ligne graduée à son niveau actuel, les additions de
// l'échauffement, la revue des leçons déjà vues.
//  - il ne rapporte ni étoiles ni coquillages ;
//  - ses réponses sont enregistrées, marquées « libre », dans une séance marquée « libre » (elle ne compte
//    jamais comme la séance du jour) ; elles comptent pour les règles d'adaptation et la révision espacée ;
//  - pas de limite de durée ; au bout de 10 minutes, la voix propose d'arrêter (une fois) ;
//  - la maison le quitte à tout moment (main.js : l'activité en cours est abandonnée, engine/clock.js).
import { onTap, pop, spriteBox } from "../engine/ui.js";
import * as R from "../art/runtime.js";
import { Module1Runner } from "../modules/numberline/runner.js";
import { Warmup } from "../modules/facts/warmup.js";
import { FactsScreen } from "../modules/facts/screen.js";
import { chooseModule } from "./session.js";

const PROPOSE_STOP_MS = 10 * 60000;
// les leçons, telles que l'enfant les reconnaît : les nombres que la tortue écrit
const LESSON_LABELS = { L1: "1 2 3", L2: "10 20", L3: "30 31" };

export class FreeTraining {
  constructor(app, { store, module1, module2, rnd }) { this.app = app; this.store = store; this.m1 = module1; this.m2 = module2; this.rnd = rnd; this.rec = null; }
  // la séance « libre » : créée quand une activité commence, mise à jour après chaque réponse
  async seanceId() {
    if (!this.rec) { const now = Date.now(); this.rec = { debut: now, fin: now, dureeS: 0, terminee: false, libre: true, module: chooseModule(), questions: 0, justes: 0, reussite: null, etoiles: 0, etapes: [] }; this.rec.id = await this.store.add("seances", this.rec); }
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
  // le menu : trois grandes bulles (la troisième seulement si une leçon a déjà été vue)
  async menu() {
    const { app } = this, { voice, text } = app, n1 = (await this.store.get("niveaux", 1)) ?? { lecons: [] }, seen = n1.lecons ?? [];
    this.t0 ??= app.clock.now();
    const items = [["ligne", "la ligne des nombres", "libreLigne"], ["faits", "les additions", "libreFaits"], ...(seen.length ? [["lecons", "les leçons", "libreLecons"]] : [])];
    const els = items.map(([id, label], i) => spriteBox(app, { x: 640 + (i - (items.length - 1) / 2) * 230 - 90, y: 520, w: 180, h: 180, cls: "bubble free", label, paint: (ctx) => app.sprites.draw(ctx, `libre.${id}`, 0, 90, 90) }));
    voice.stop(); voice.say(`${text.data.encore} ${text.data.libre}`, { instruction: true });
    const pick = await new Promise((res) => els.forEach((e, i) => onTap(e, () => { pop(e); res(items[i]); })));
    els.forEach((e) => e.remove());
    voice.stop(); voice.say(text.data[pick[2]]);
    if (pick[0] === "ligne") return this.line();
    if (pick[0] === "faits") return this.facts();
    return this.lessons(seen);
  }
  // la ligne graduée au niveau actuel, sans fin
  async line() {
    const { app } = this, screen = app.lineScreen();
    const runner = await new Module1Runner({ screen, store: this.store, content: this.m1, rnd: this.rnd, seance: await this.seanceId() }).load();
    runner.libre = true; this.runner = runner;
    for (;;) {
      const { q, cfg } = runner.next(), r = await screen.ask(q, cfg);
      await runner.record(r, cfg); // les étoiles qu'elle rendrait sont ignorées ; un niveau franchi compte (sans étoile arc-en-ciel)
      await this.answered(r.ok);
    }
  }
  // les additions : les faits dus d'abord, puis des faits déjà rencontrés (qui ne montent pas de boîte)
  async facts() {
    const { app } = this, screen = (app.facts ??= new FactsScreen(app, this.m2));
    const warmup = await new Warmup({ store: this.store, content: this.m2, rnd: this.rnd, seance: await this.seanceId() }).load();
    warmup.libre = true;
    screen.show(true);
    for (;;) {
      let rest = warmup.questions(6, 5).filter((q) => !q.base);
      if (!rest.length) rest = [...warmup.facts].sort(() => this.rnd() - 0.5).slice(0, 6).map((f) => ({ ...f, anticipe: true }));
      if (!rest.length) return;
      while (rest.length) { const q = rest.shift(), r = await screen.ask(q), res = await warmup.record(q, r, rest); await this.answered(res.juste); }
    }
  }
  // la revue des leçons déjà vues : une bulle par leçon (les nombres que la tortue y écrit)
  async lessons(seen) {
    const { app } = this;
    for (;;) {
      const els = seen.map((id, i) => spriteBox(app, { x: 640 + (i - (seen.length - 1) / 2) * 200 - 80, y: 540, w: 160, h: 160, cls: "bubble free lesson", label: `leçon ${id}`, paint: (ctx, px) => {
        const q = app.sprites.frame("reponse", 0), k = 160 / 140; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 80 * px + q.dx * k, 80 * px + q.dy * k, q.w * k, q.h * k);
        ctx.setTransform(px, 0, 0, px, 0, 0); const t = LESSON_LABELS[id] ?? id, em = Math.min(34, 110 / R.wordWidth(t)); R.drawWord(ctx, t, 80, 80 - em / 2, em, { w: em * 0.15, seed: 860 + i });
      } }));
      const id = await new Promise((res) => els.forEach((e, i) => onTap(e, () => { pop(e); res(seen[i]); })));
      els.forEach((e) => e.remove());
      const r = await app.lessons.play(id, { skippable: true });
      await this.seanceId(); (this.rec.lecons ??= []).push({ id, raison: "libre", ...r }); await this.store.put("seances", this.rec);
    }
  }
}
