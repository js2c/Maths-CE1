// LA LEÇON DES PROBLÈMES (L19, « Le schéma en barres » ; lot « Problèmes », docs/LOTS.md, fiche 20 ; docs/SPEC.md, sections 7 quinquies
// et 8). Même règle que les autres lecteurs (lessons/player.js, lessons/etal.js) : chaque phrase est découpée en temps ; la voix dit
// pendant que les actions se jouent, le temps suivant attend la fin des deux ; « rejouer » reprend au début, « passer » l'arrête, dès
// la première vue. La scène est celle de l'exercice (modules/problemes/screen.js : le cadre de l'illustration, les étiquettes, la
// plaque de la réponse, le schéma à la place du pavé), sans pavé.
// Actions (content/lecons.json, `module: 7`) : histoire { contexte, objet, etiquettes: [nombres] } (une histoire nouvelle : son lieu,
// ses étiquettes, la plaque « ? ») ; allumer i (l'étiquette i apparaît et s'allume ; -1 : aucune) ; barres { tout, parties, inconnue,
// voir } (le schéma : « tout », la grande barre seule ; « tout+parties », le schéma entier) ; trouver (le « ? » trouvé : la barre et
// la plaque) ; attendre ms.
import { wait } from "../engine/clock.js";
import { onBrief, pop, skipKey, spriteBox } from "../engine/ui.js";

const ABORT = Symbol("leçon interrompue"), REPLAY_AT = [1050, 215];

export class LessonProblemesPlayer {
  constructor(app, content) { this.app = app; this.c = content; this.tok = 0; this.keys = null; }
  get s() { return this.app.prob; }
  async play(id) {
    const { app } = this, lesson = this.c[id], t0 = Date.now(), stats = { rejouees: 0 };
    if (!lesson) return { vue: false };
    this.quitte = false; this.lesson = lesson;
    // (une leçon relancée pendant l'exercice : le pavé est rangé le temps de la leçon ; la question suivante le remet)
    app.facts?.keys(false); app.facts?.help && (app.facts.help.style.visibility = "hidden");
    this.p = 0; this.skipped = false; this.abort = null; this.goto = undefined;
    const jump = (to) => { this.goto = to; app.voice.stop(); if (this.abort) this.abort(); else this.p = to; };
    const again = spriteBox(app, { x: REPLAY_AT[0] - 70, y: REPLAY_AT[1] - 70, w: 140, h: 140, cls: "bubble lessonkey rejouer", label: "rejouer la leçon", paint: (ctx) => app.sprites.draw(ctx, "rejouer", 0, 70, 70) });
    onBrief(app, again, () => { if (!this.abort) return; pop(again); stats.rejouees++; jump(0); }, "rejouer");
    const skip = skipKey(app, () => { this.skipped = true; jump(lesson.phrases.length); }, "passer la leçon");
    skip.classList.add("lessonkey");
    this.keys = [again, skip];
    while (this.p < lesson.phrases.length) {
      if (this.quitte) return new Promise(() => {});
      const tok = ++this.tok;
      this.abortP = new Promise((_, rej) => { this.abort = () => rej(ABORT); }); this.abortP.catch(() => {});
      if (this.p === 0) this.q = null;
      try { await this.phrase(this.p, tok); this.p++; }
      catch (err) { if (err !== ABORT) throw err; this.p = this.goto ?? this.p; }
    }
    this.abort = null; this.tok++;
    this.keys.forEach((k) => k.remove()); this.keys = null;
    if (!this.skipped) { app.ocean.mascotte.play("rejouir"); await wait(600); }
    this.clear();
    return { vue: !this.skipped, passee: this.skipped, dureeS: Math.round((Date.now() - t0) / 1000), ...stats };
  }
  g(p) { return Promise.race([p, this.abortP]); }
  async phrase(p) {
    const { voice, ocean } = this.app;
    ocean.mascotte.hold("montrer");
    for (const beat of this.lesson.phrases[p]) {
      if (this.quitte) return new Promise(() => {});
      const said = beat.dire ? voice.say(beat.dire, { instruction: true }) : Promise.resolve();
      const done = (async () => { for (const a of beat.faire ?? []) await this.g(this.act(a)); })();
      await this.g(Promise.all([said, done]));
    }
    ocean.mascotte.release();
  }
  async act(x) {
    const [[name, v]] = Object.entries(x), s = this.s;
    if (name === "histoire") {
      const e = { contexte: v.contexte, objet: v.objet, reponse: null, enonce: [], barres: null, scene: v.scene }; // (la scène : ses objets, lot « Mise en scène des problèmes »)
      this.q = { lecon: true, e, etiquettes: v.etiquettes.map((n) => ({ n, objet: v.objet, phrase: 0 })), aide: "barres" };
      s.effacerAide(); await s.scene(this.q); return wait(300);
    }
    if (name === "allumer") { s.lit = v; if (v >= 0) s.vues.add(v); s.repaint(); return; }
    if (name === "barres") { this.q.e.barres = { tout: v.tout, parties: v.parties, inconnue: v.inconnue }; this.q.e.reponse = v.inconnue === "tout" ? v.tout : v.parties[v.inconnue]; this.voir = v.voir; s.paintAide(this.q, { voir: v.voir === "tout" ? "tout" : null }); this.app.sound?.play("bouton"); return wait(500); }
    if (name === "trouver") { s.montre = true; s.juste = true; s.repaint(); s.paintAide(this.q, { montre: true }); this.app.sound?.play("bonne"); return wait(400); }
    if (name === "attendre") return wait(v);
  }
  // (la scène qui charge encore ses images ne se pose plus après : le jeton de l'écran change ; sans cela, la leçon quittée par la
  // maison pendant le chargement laissait le cadre des problèmes sur l'accueil : l'enfant imprévisible des tests de GitHub, 7 novembre 2026)
  clear() { this.s?.effacerAide(); if (this.s) this.s.tok = (this.s.tok ?? 0) + 1; this.s?.leaveQuestion(); if (this.s) { this.s.q = null; this.s.montre = false; this.s.juste = false; } }
  abandon() {
    this.quitte = true;
    if (!this.keys) return;
    this.tok++; this.abort = null; this.keys.forEach((k) => k.remove()); this.keys = null; this.clear();
  }
}
