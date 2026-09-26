// MODULE 1 · L'ÉCRAN D'EXERCICE. La ligne est dessinée une fois par question, dans le style A, avec les
// primitives de l'atelier (runtime.js, dans un Worker). Quatre formats (docs/SPEC.md, Module 1) :
//  - « lire » : une étoile de mer est posée sur une graduation ; l'enfant touche le bon nombre (3 ou 4 bulles) ;
//  - « sauter » : la tortue est sur une bouée et va faire quelques sauts ; où arrive-t-elle ?
//  - « placer » : l'enfant pose le poisson sur un nombre, en touchant la ligne ou en le faisant glisser ;
//  - « estimer » : ligne sans graduations, l'enfant pose le poisson où il mettrait le nombre.
// Retour immédiat : juste -> la pieuvre se réjouit ; faux -> la pieuvre encourage (jamais triste), la voix
// dit pourquoi, et l'animation propre à l'erreur est jouée (tableau des erreurs E1 à E5 de la SPEC).
import * as R from "../../art/runtime.js";
import { arcHeight, Turtle } from "../../engine/turtle.js";
import { classify, lineSpec, makeEstimate, makeJump, makePlace, makeRead } from "./generator.js";

const ANSWER_Y = 700, BUB = 140; // centre des bulles, taille de leur calque (px logiques)
const FISH_WAIT = [790, 690]; // où le poisson attend d'être posé : à côté du nombre à placer

export class NumberLineScreen {
  constructor(app) {
    this.app = app; this.ui = app.stage.ui; this.q = null; this.buttons = []; this.arcs = []; this.overlay = [];
    const o = app.ocean;
    // l'étoile de mer (lire) et le poisson à poser (placer, estimer) : des acteurs du premier plan
    this.star = o.spriteActor(o.frontEl, "etoile"); this.star.draw(0); this.star.show(false);
    this.fish = o.spriteActor(o.frontEl, "poisson.0.d"); this.fish.show(false); this.fishAt = null; this.fishGoal = null;
    o.front.push((t) => {
      this.star.show(!!this.starAt); if (this.starAt) this.star.moveTo(this.starAt[0], this.starAt[1] + 1.5 * Math.sin(t * 2.1));
      this.fish.show(!!this.fishAt);
      if (this.fishAt) {
        const g = this.fishGoal ?? this.fishAt; this.fishAt = [this.fishAt[0] + (g[0] - this.fishAt[0]) * 0.35, this.fishAt[1] + (g[1] - this.fishAt[1]) * 0.35];
        this.fish.draw(Math.floor(t * 12) % 12); this.fish.moveTo(this.fishAt[0], this.fishAt[1] + 3 * Math.sin(t * 3));
      }
    });
    this.turtle = new Turtle(o);
    // effets tracés en direct (arcs de saut, flèche, filets) : redessinés tant qu'un effet avance
    o.front.push(() => this.paintFx());
    // la zone tactile de la ligne (placer, estimer) : toute la bande, pour des doigts de 7 ans
    this.band = document.createElement("div"); this.band.className = "touchband"; this.ui.append(this.band);
    const pos = (e) => { const r = this.band.getBoundingClientRect(), k = r.width / this.band.offsetWidth; return (e.clientX - r.left) / k + this.band.offsetLeft; };
    this.band.addEventListener("pointerdown", (e) => { if (this.locked || !this.input) return; e.preventDefault(); this.band.setPointerCapture(e.pointerId); this.dragging = true; this.aim(pos(e)); });
    this.band.addEventListener("pointermove", (e) => { if (this.dragging) this.aim(pos(e)); });
    const up = (e) => { if (!this.dragging) return; this.dragging = false; this.aim(pos(e)); this.answer(this.aimed, null); };
    this.band.addEventListener("pointerup", up); this.band.addEventListener("pointercancel", () => { this.dragging = false; });
  }
  // ---------------------------------------------------------------- géométrie de la ligne
  get a() { return this.spec.x0 + 40; }
  get b() { return this.spec.x1 - 40; }
  xOf(v) { const q = this.q; return this.a + ((v - q.min) / (q.max - q.min)) * (this.b - this.a); }
  // placer : le poisson va à la graduation la plus proche ; estimer : exactement sous le doigt
  aim(x) {
    const q = this.q, t = Math.min(1, Math.max(0, (x - this.a) / (this.b - this.a)));
    this.aimed = q.format === "placer" ? q.min + Math.round((t * (q.max - q.min)) / q.step) * q.step : Math.round(q.min + t * (q.max - q.min));
    const X = this.xOf(this.aimed); this.fishGoal = [X, R.lineY(this.spec, X) - 50];
  }
  // ---------------------------------------------------------------- une question
  // Les deux versions de la ligne (la question, puis la correction avec le nombre et la graduation
  // allumée) sont préparées ensemble par le Worker : au moment de la réponse, il suffit d'afficher la seconde.
  async show(q, cfg) {
    const { voice, text, line } = this.app;
    this.q = q; this.cfg = cfg; this.locked = true; this.arcs = []; this.overlay = []; line.fxClear();
    this.spec = lineSpec(q, cfg);
    const fix = q.format === "estimer" ? { ...this.spec, marks: [{ t: (q.answer - q.min) / (q.max - q.min), label: String(q.answer), color: R.INK }] } : { ...this.spec, labels: this.spec.labels.map((l, i) => (i === q.target ? String(q.answer) : l)), mark: undefined, lit: [q.target] };
    const [ask, fixed] = await line.render([this.spec, fix]);
    this.fix = fixed; line.show(ask); this.t0 = performance.now();
    this.starAt = q.format === "lire" ? [R.tickP(this.spec, q.target)[0], R.tickP(this.spec, q.target)[1] - 42] : null;
    if (q.format === "sauter") this.turtle.sitOn(this.spec, q.start); else this.turtle.hide();
    this.input = q.format === "placer" || q.format === "estimer";
    this.fishAt = this.input ? [...FISH_WAIT] : null; this.fishGoal = this.fishAt ? [...FISH_WAIT] : null;
    Object.assign(this.band.style, { display: this.input ? "block" : "none", left: `${this.spec.x0 - 30}px`, width: `${this.spec.x1 - this.spec.x0 + 60}px` });
    this.clearButtons();
    if (q.choices) {
      const n = q.choices.length, gap = n > 3 ? 132 : 118;
      q.choices.forEach((c, i) => {
        const b = this.bubble(640 + (i - (n - 1) / 2) * gap, ANSWER_Y, String(c.value));
        b.addEventListener("pointerdown", (e) => { e.preventDefault(); this.answer(c.value, b); });
        this.buttons.push(b);
      });
    } else this.buttons.push(this.bubble(640, ANSWER_Y, String(q.answer), null, true)); // le nombre à placer, en grand
    this.locked = false;
    voice.stop();
    const v = { n: q.answer, a: q.format === "sauter" ? q.min + q.start * q.step : q.min, sauts: q.jumps === 1 ? text.data.unSaut : `${q.jumps} ${text.data.sauts}` };
    // pendant la consigne, la pieuvre montre la ligne ; elle relâche quand la phrase est finie
    this.app.ocean.octo.hold("montrer");
    return voice.say(text.pick(q.format, v), { instruction: true }).then(() => this.app.ocean.octo.release());
  }
  // une bulle-réponse : le sprite de l'atelier + le nombre encré en direct ; `still` : simple affichage
  bubble(cx, cy, label, ring = null, still = false) {
    const px = this.app.sprites.px, b = document.createElement(still ? "div" : "button"), cv = document.createElement("canvas");
    b.className = `bubble answer${still ? " still" : ""}`; b.style.left = `${cx - BUB / 2}px`; b.style.top = `${cy - BUB / 2}px`; b.dataset.value = label;
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
  // ---------------------------------------------------------------- effets tracés en direct
  // arcs : { a, b, h, label, p, live, bubbles } ; overlay : fonctions (ctx) => void (flèche, filets, anneaux)
  paintFx(force = false) {
    const live = this.arcs.find((a) => a.live);
    if (!live && !force && !this.fxAnimating) return;
    if (live) live.p = this.turtle.jumpS;
    const line = this.app.line, sp = this.app.sprites; line.fxClear();
    line.fxDraw((ctx) => {
      this.overlay.forEach((f) => f(ctx));
      this.arcs.forEach((a) => {
        R.drawJumpArc(ctx, a.a, a.b, a.p, { h: a.h, label: a.p >= 1 ? a.label : undefined });
        // E2 : un paquet de dix bulles au-dessus de chaque saut qui vaut dix
        if (a.bubbles && a.p >= 1) { const cx = (a.a[0] + a.b[0]) / 2, cy = (a.a[1] + a.b[1]) / 2 - a.h - 64; R.drawNet(ctx, cx - 40, cy - 16, 80, 34, 40); for (let i = 0; i < 10; i++) this.bubbleAt(ctx, sp, cx - 32 + (i % 5) * 16, cy - 8 + Math.floor(i / 5) * 16, 6); }
      });
    });
  }
  bubbleAt(ctx, sp, x, y, r) { const q = sp.frame(`bulle.${r}`, 0), px = sp.px, m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, Math.round(m.a * x + m.e + q.dx), Math.round(m.d * y + m.f + q.dy), q.w, q.h); ctx.setTransform(m); void px; }
  // la tortue saute de la graduation `from` à `to`, un saut à la fois ; chaque saut laisse un arc lumineux
  // numéroté et la voix compte. `label(k, i)` : ce qui s'écrit sur l'arc (k-ième saut, arrivée en i)
  async countJumps(from, to, { label = (k) => String(k), say = label, bubbles = false } = {}) {
    const { voice } = this.app, t = this.turtle;
    for (let k = 1; from + k <= to; k++) {
      const i = from + k, a = t.seat(i - 1), b = t.seat(i), arc = { a: [a[0], a[1] + 4], b: [b[0], b[1] + 4], h: arcHeight(Math.abs(b[0] - a[0])) - 4, label: label(k, i), live: true, p: 0, bubbles };
      this.arcs.push(arc);
      await t.jump(i);
      arc.live = false; arc.p = 1; this.paintFx(true);
      await Promise.race([voice.say(say(k, i)), wait(750)]);
    }
  }
  // une animation d'effet (flèche qui se trace, anneau qui clignote) pendant `ms`
  async animateFx(ms) { this.fxAnimating = true; await wait(ms); this.fxAnimating = false; this.paintFx(true); }
  // ---------------------------------------------------------------- la réponse et son retour
  async answer(value, btn) {
    if (this.locked) return; this.locked = true;
    const { voice, ocean, text, line } = this.app, q = this.q, ms = performance.now() - this.t0, ok = classify(q, value) === null, code = classify(q, value);
    voice.stop();
    const result = { q, value, ok, code, ms: Math.round(ms), listens: voice.listens };
    if (q.choices) {
      const good = this.buttons.find((b) => Number(b.dataset.value) === q.answer);
      this.paintBubble(good.firstChild, String(q.answer), "#ffd23a");
      if (ok) good.classList.add("pop"); else btn?.classList.add("shake", "dim");
    }
    ocean.octo.play(ok ? "rejouir" : "encourager");
    const n = q.answer, T = text.data.erreur;
    if (ok) {
      if (q.format === "sauter") { await voice.say(text.pick("bravo")); await this.countJumps(q.start, q.target); }
      line.show(this.fix);
      if (q.format !== "sauter") await voice.say(text.pick("bravo"));
      await wait(700);
    } else {
      await voice.say(code && T[code] ? fill(T[code], { a: q.min, d: Math.floor(n / 10), u: n % 10 }) : T.autre);
      if (this.input) { const X = this.xOf(n); this.fishGoal = [X, R.lineY(this.spec, X) - 50]; } // le poisson va à la bonne place
      await this.explain(code);
      line.show(this.fix);
      await voice.say(fill(text.data.bonneReponse, { n }));
      await wait(900);
    }
    this.band.style.display = "none";
    const done = this.resolve; this.resolve = null; done?.(result);
  }
  // l'animation qui explique l'erreur (docs/SPEC.md, tableau des erreurs du module 1)
  async explain(code) {
    const q = this.q, T = this.turtle, idx = (v) => Math.round((v - q.min) / q.step), tgt = idx(q.answer), far = q.n > 0 && tgt <= 12;
    if (q.format === "sauter") return this.countJumps(q.start, q.target);
    if (code === "E1" && far) {
      // la tortue saute depuis le début de la ligne, chaque saut s'allume et se compte
      await T.swimTo(this.spec, 0); return this.countJumps(0, tgt, { label: (k, i) => (q.min === 0 ? String(k) : String(q.min + i * q.step)) });
    }
    if (code === "E2" && far) {
      // comptage 10, 20, 30… avec un paquet de dix bulles par saut
      await T.swimTo(this.spec, 0); return this.countJumps(0, tgt, { label: (k, i) => String(q.min + i * q.step), bubbles: q.step === 10 });
    }
    if (code === "E3" && far) {
      // le départ clignote, puis comptage depuis le départ : 31, 32, 33, 34
      const [x, y] = R.tickP(this.spec, 0);
      this.overlay.push((ctx) => { if (Math.floor(performance.now() / 300) % 2 === 0) R.drawRing(ctx, x, y + R.LABEL_DY + 18, 30); });
      await this.animateFx(1800); this.overlay = [(ctx) => R.drawRing(ctx, x, y + R.LABEL_DY + 18, 30)];
      T.sitOn(this.spec, 0); await wait(300);
      return this.countJumps(0, tgt, { label: (k, i) => String(q.min + i * q.step) });
    }
    if (code === "E4" && q.n > 0) {
      // la flèche de croissance se trace de gauche à droite, puis la tortue repart de la gauche
      const y = this.spec.y - 96, t0 = performance.now();
      this.overlay.push((ctx) => R.drawArrow(ctx, this.a - 10, this.b + 10, y, Math.min(1, (performance.now() - t0) / 1400)));
      await this.animateFx(1500);
      if (far) { await T.swimTo(this.spec, 0); return this.countJumps(0, tgt, { label: (k, i) => String(q.min + i * q.step) }); }
      return;
    }
    if (code === "E5") {
      // le nombre se décompose : des filets de dix bulles et des bulles seules
      const d = Math.floor(q.answer / 10), u = q.answer % 10, NW = 104, NH = 46, x0 = 640 - (d * (NW + 14) + u * 24) / 2, y0 = 318;
      this.overlay.push((ctx) => {
        for (let j = 0; j < d; j++) { const x = x0 + j * (NW + 14); R.drawNet(ctx, x, y0, NW, NH, 50 + j); for (let i = 0; i < 10; i++) this.bubbleAt(ctx, this.app.sprites, x + 12 + (i % 5) * 20, y0 + 12 + Math.floor(i / 5) * 22, 8); }
        for (let i = 0; i < u; i++) this.bubbleAt(ctx, this.app.sprites, x0 + d * (NW + 14) + 12 + i * 24, y0 + 23, 10);
      });
      this.paintFx(true);
      return wait(2500);
    }
  }
  // pose la question et attend la réponse ; la promesse se résout après le retour, avec le résultat
  ask(q, cfg) { return new Promise((resolve) => { this.resolve = resolve; this.show(q, cfg); }); }
  generate(cfg, rnd, opts = {}) {
    const f = opts.format ?? "lire";
    return f === "sauter" ? makeJump(cfg, rnd) : f === "placer" ? makePlace(cfg, rnd, opts) : f === "estimer" ? makeEstimate(cfg, rnd, opts) : makeRead(cfg, rnd, opts);
  }
  leave() { this.clearButtons(); this.starAt = null; this.fishAt = null; this.turtle.hide(); this.band.style.display = "none"; this.app.line.clear(); this.app.line.fxClear(); }
}
export { NumberLineScreen as ReadScreen };

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
