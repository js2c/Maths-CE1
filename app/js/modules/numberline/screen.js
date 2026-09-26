// MODULE 1 · L'ÉCRAN D'EXERCICE. La ligne est dessinée une fois par question, dans le style A, avec les
// primitives de l'atelier (runtime.js, dans un Worker). L'enfant touche le bon nombre parmi 3 ou 4 bulles.
//  - « lire » : une étoile de mer est posée sur une graduation ;
//  - « sauter » : la tortue est sur une bouée et va faire quelques sauts.
// Retour immédiat : juste -> la bulle s'entoure d'or, la pieuvre se réjouit, une étoile de mer gagnée ;
// faux -> la bonne bulle s'entoure, la pieuvre encourage (jamais triste), la voix dit pourquoi, et le
// retour animé de l'erreur est joué (E1 : la tortue repart de 0 et compte ses sauts, chacun s'allume).
import * as R from "../../art/runtime.js";
import { arcHeight, Turtle } from "../../engine/turtle.js";
import { classify, lineSpec, makeJump, makeRead } from "./generator.js";

const ANSWER_Y = 700, BUB = 140; // centre des bulles, taille de leur calque (px logiques)

export class NumberLineScreen {
  constructor(app) {
    this.app = app; this.ui = app.stage.ui; this.q = null; this.buttons = []; this.arcs = [];
    // l'étoile de mer : un acteur du premier plan, posé sur la graduation demandée, qui respire un peu
    this.star = app.ocean.spriteActor(app.ocean.frontEl, "etoile"); this.star.draw(0); this.star.show(false);
    app.ocean.front.push((t) => { this.star.show(!!this.starAt); if (this.starAt) this.star.moveTo(this.starAt[0], this.starAt[1] + 1.5 * Math.sin(t * 2.1)); });
    this.turtle = new Turtle(app.ocean);
    // arcs de saut en cours de tracé (retours, leçons) : redessinés tant qu'un arc avance
    app.ocean.front.push(() => this.paintArcs());
  }
  // pose une question : ligne, repère (étoile ou tortue), bulles, consigne lue. Les deux versions de la
  // ligne (la question, puis la correction avec le nombre et la bouée allumée) sont préparées ensemble
  // par le Worker : au moment de la réponse, il n'y a plus qu'à afficher la seconde.
  async show(q, cfg) {
    const { voice, text, line } = this.app;
    this.q = q; this.cfg = cfg; this.locked = true; this.arcs = []; line.fxClear();
    this.spec = lineSpec(q, cfg);
    const labels = this.spec.labels.slice(); labels[q.target] = String(q.answer);
    const [ask, fix] = await line.render([this.spec, { ...this.spec, labels, mark: undefined, lit: [q.target] }]);
    this.fix = fix; line.show(ask); this.t0 = performance.now(); this.locked = false;
    if (q.format === "sauter") { this.starAt = null; this.turtle.sitOn(this.spec, q.start); }
    else { const [x, y] = R.tickP(this.spec, q.target); this.starAt = [x, y - 42]; this.turtle.hide(); }
    this.clearButtons();
    const n = q.choices.length, gap = n > 3 ? 132 : 118;
    q.choices.forEach((c, i) => {
      const cx = 640 + (i - (n - 1) / 2) * gap, b = this.bubble(cx, ANSWER_Y, String(c.value));
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); this.answer(c.value, b); });
      this.buttons.push(b);
    });
    voice.stop();
    const say = q.format === "sauter" ? text.pick("sauter", { a: q.min + q.start * q.step, sauts: q.jumps === 1 ? text.data.unSaut : `${q.jumps} ${text.data.sauts}` }) : text.pick("lire");
    // pendant la consigne, la pieuvre montre la ligne ; elle relâche quand la phrase est finie
    this.app.ocean.octo.hold("montrer");
    return voice.say(say, { instruction: true }).then(() => this.app.ocean.octo.release());
  }
  // une bulle-réponse : le sprite de l'atelier + le nombre encré en direct
  bubble(cx, cy, label, ring = null) {
    const px = this.app.sprites.px, b = document.createElement("button"), cv = document.createElement("canvas");
    b.className = "bubble answer"; b.style.left = `${cx - BUB / 2}px`; b.style.top = `${cy - BUB / 2}px`; b.dataset.value = label;
    b.setAttribute("aria-label", label);
    cv.width = Math.round(BUB * px); cv.height = Math.round(BUB * px); b.append(cv); this.ui.append(b);
    this.paintBubble(cv, label, ring);
    return b;
  }
  paintBubble(cv, label, ring) {
    const px = this.app.sprites.px, ctx = cv.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    this.app.sprites.draw(ctx, "reponse", 0, BUB / 2, BUB / 2);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    if (ring) R.drawRing(ctx, BUB / 2 - 1, BUB / 2 - 1, 52, ring);
    const em = label.length > 2 ? 40 : 54;
    R.drawNumber(ctx, label, BUB / 2, BUB / 2 - em / 2, em, { w: em * 0.14, seed: 330 + label.length });
  }
  clearButtons() { this.buttons.forEach((b) => b.remove()); this.buttons = []; }
  // ---------------------------------------------------------------- arcs de saut comptés
  paintArcs(force = false) {
    const live = this.arcs.find((a) => a.live);
    if (!live && !force) return;
    if (live) live.p = this.turtle.jumpS;
    const line = this.app.line; line.fxClear();
    line.fxDraw((ctx) => this.arcs.forEach((a) => R.drawJumpArc(ctx, a.a, a.b, a.p, { h: a.h, label: a.p >= 1 ? a.label : undefined })));
  }
  // la tortue saute de la graduation `from` à `to`, un saut à la fois ; chaque saut laisse un arc
  // lumineux numéroté et la voix compte (« un, deux, trois… »)
  async countJumps(from, to) {
    const { voice } = this.app, t = this.turtle;
    for (let k = 1; from + k <= to; k++) {
      const a = t.seat(from + k - 1), b = t.seat(from + k), arc = { a: [a[0], a[1] + 4], b: [b[0], b[1] + 4], h: arcHeight(Math.abs(b[0] - a[0])) - 4, label: String(k), live: true, p: 0 };
      this.arcs.push(arc);
      await t.jump(from + k);
      arc.live = false; arc.p = 1; this.paintArcs(true);
      await Promise.race([voice.say(String(k)), wait(700)]);
    }
  }
  async answer(value, btn) {
    if (this.locked) return; this.locked = true;
    const { voice, ocean, text } = this.app, q = this.q, ms = performance.now() - this.t0, ok = value === q.answer, code = classify(q, value);
    voice.stop();
    const result = { q, value, ok, code, ms: Math.round(ms), listens: voice.listens };
    const good = this.buttons.find((b) => Number(b.dataset.value) === q.answer);
    this.paintBubble(good.firstChild, String(q.answer), "#ffd23a");
    if (ok) { good.classList.add("pop"); ocean.octo.play("rejouir"); }
    else { btn.classList.add("shake", "dim"); ocean.octo.play("encourager"); }
    if (q.format === "sauter") {
      // dans tous les cas, la tortue fait ses sauts en les comptant : c'est la preuve
      if (ok) await voice.say(text.pick("bravo"));
      else await voice.say(code === "E1" ? text.data.erreur.E1 : text.data.erreur.autre);
      await this.countJumps(q.start, q.target);
      this.app.line.show(this.fix);
      if (!ok) await voice.say(fill(text.data.bonneReponse, { n: q.answer }));
      await wait(ok ? 600 : 900);
    } else if (ok) {
      // le nombre caché apparaît sous l'étoile et sa bouée s'allume (version préparée avec la question)
      this.app.line.show(this.fix);
      await voice.say(text.pick("bravo"));
      await wait(700);
    } else {
      const t = text.data.erreur, n = q.answer;
      await voice.say(code && t[code] ? fill(t[code], { a: q.min, d: Math.floor(n / 10), u: n % 10 }) : t.autre);
      // E1 : la tortue part de 0 et compte les sauts jusqu'à l'étoile, chaque saut s'allume
      if (code === "E1" && q.step === 1 && q.target <= 12) { await this.turtle.swimTo(this.spec, 0); await this.countJumps(0, q.target); }
      this.app.line.show(this.fix);
      await voice.say(fill(text.data.bonneReponse, { n }));
      await wait(900);
    }
    const done = this.resolve; this.resolve = null; done?.(result);
  }
  // pose la question et attend la réponse ; la promesse se résout après le retour, avec le résultat
  ask(q, cfg) { return new Promise((resolve) => { this.resolve = resolve; this.show(q, cfg); }); }
  generate(cfg, rnd, opts = {}) { return (opts.format ?? "lire") === "sauter" ? makeJump(cfg, rnd) : makeRead(cfg, rnd, opts); }
  leave() { this.clearButtons(); this.starAt = null; this.turtle.hide(); this.app.line.clear(); this.app.line.fxClear(); }
}
export { NumberLineScreen as ReadScreen };

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
