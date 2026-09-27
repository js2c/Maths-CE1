// LEÇONS ANIMÉES · LE LECTEUR (docs/SPEC.md, « Leçons animées » ; CLAUDE.md, « Leçons animées »).
// Joue une leçon de content/lecons.json sur la scène de la ligne graduée (l'écran du module 1 prête sa
// tortue, son étoile et son calque d'effets). Chaque phrase est découpée en temps : la voix dit la phrase
// pendant que l'animation se joue, et le temps suivant attend la fin des deux (la durée de la synthèse
// vocale varie). Deux boutons restent visibles pendant toute la leçon, dès sa première vue : « rejouer »
// (reprend la leçon au début) et « passer » (la leçon s'arrête ; la séance enchaîne sur « À toi ! » et
// l'exercice guidé). Pour y répondre, la phrase en cours est abandonnée (jeton), la scène est remise dans
// l'état exact du début de la phrase demandée (script.js, `stateAt`), puis la lecture reprend.
// Rien de ce qui bouge n'est redessiné à chaque image : la tortue et l'étoile sont des acteurs, les filets,
// la loupe et le compteur ont leur petit canvas dessiné une fois, le calque d'effets n'est repeint que
// quand l'état change (un arc se termine, un nombre s'écrit, un clignotement bascule).
import * as R from "../art/runtime.js";
import { Actor } from "../engine/actor.js";
import { arcHeight } from "../engine/turtle.js";
import { onTap, spriteBox } from "../session/screens.js";
import { skipKey } from "../engine/ui.js";
import { actions, countLabel, lessonLineSpec, settle, stateAt, tickOf } from "./script.js";
import { wait } from "../engine/clock.js";
import { Lesson2Player } from "./player2.js";

const ABORT = Symbol("leçon interrompue");
const ease = (u) => 1 - Math.pow(1 - u, 3);
// une animation de `ms` millisecondes, f(u) à chaque image, u de 0 à 1
const tween = (ms, f) => new Promise((res) => { const t0 = performance.now(), step = (now) => { const u = Math.min(1, (now - t0) / ms); f(u); if (u < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
const REPLAY_AT = [1180, 712], COUNTER = [700, 172]; // « rejouer » en bas à droite ; « passer » : engine/ui.js
const NET_W = 62, NET_H = 34;

export class LessonPlayer {
  constructor(app, content) { this.app = app; this.c = content; this.tok = 0; this.nets = new Map(); }
  get nl() { return this.app.lineScreen(); }

  // joue la leçon `id` jusqu'au bout ; renvoie { vue, passee, dureeS, rejouees }.
  // « passer » (dès la première vue) l'arrête : passee, pas d'étoiles (notion.js).
  async play(id) {
    // les leçons du module 2 (L4 à L6) ont leur propre scène (lessons/player2.js)
    // (lot 2, étape 8 : L10, les centaines, a aussi sa scène : chaluts et filets sur le calque des aides)
    if (this.c[id]?.module === 2 || this.c[id]?.scene) return (this.p2 ??= new Lesson2Player(this.app, this.c)).play(id);
    const { app } = this, lesson = this.c[id], nl = this.nl, t0 = Date.now(), stats = { rejouees: 0 };
    if (!lesson) return { vue: false };
    nl.leave();
    // les deux boutons, visibles tout de suite et pendant toute la leçon ; un toucher abandonne la phrase en cours
    this.p = 0; this.skipped = false; this.abort = null; this.goto = undefined;
    const jump = (to) => { this.goto = to; app.voice.stop(); if (this.abort) this.abort(); else this.p = to; };
    const again = spriteBox(app, { x: REPLAY_AT[0] - 70, y: REPLAY_AT[1] - 70, w: 140, h: 140, cls: "bubble lessonkey rejouer", label: "rejouer la leçon", paint: (ctx) => app.sprites.draw(ctx, "rejouer", 0, 70, 70) });
    onTap(again, () => { if (!this.abort) return; pop(again); stats.rejouees++; jump(0); });
    const skip = skipKey(app, () => { this.skipped = true; jump(lesson.phrases.length); }, "passer la leçon");
    skip.classList.add("lessonkey");
    const keys = [again, skip]; this.keys = keys;
    // la pieuvre remonte un peu : ses bras dégagent le début de la ligne, où se tracent les premiers arcs
    const home = [...app.ocean.octoAt], up = [home[0] - 20, home[1] - 56];
    this.home = home;
    tween(900, (u) => { const e = ease(u); app.ocean.octoAt = [home[0] + (up[0] - home[0]) * e, home[1] + (up[1] - home[1]) * e]; });
    if (this.netsOf !== id) { this.nets.forEach((n) => n.a.remove()); this.nets.clear(); this.netsOf = id; }
    this.lesson = lesson; this.spec = lessonLineSpec(lesson);
    nl.spec = this.spec; nl.q = { min: 0, max: 1, step: 1 }; nl.turtle.spec = this.spec;
    const rendered = app.line.render([this.spec]);
    // ce qui a son propre petit canvas (filets, loupe) est dessiné maintenant, caché, pendant que le
    // Worker prépare la ligne : pas d'à-coup au moment où il apparaît
    for (const ph of lesson.phrases) for (const beat of ph) for (const [n, v] of actions(beat)) {
      if (n === "filet") [].concat(v).forEach((x) => this.net(tickOf(lesson.ligne, x)));
      if (n === "loupe") this.lensFor(tickOf(lesson.ligne, v)).show(false);
    }
    const [bmp] = await rendered;
    Object.assign(app.line.c.style, { transition: "opacity 0.6s", opacity: "0" }); app.line.show(bmp);
    while (this.p < lesson.phrases.length) {
      const tok = ++this.tok;
      this.abortP = new Promise((_, rej) => { this.abort = () => rej(ABORT); }); this.abortP.catch(() => {});
      this.apply(stateAt(lesson, this.p));
      try { await this.phrase(this.p, tok); this.p++; }
      catch (e) { if (e !== ABORT) throw e; this.p = this.goto ?? this.p; }
    }
    this.abort = null; this.tok++;
    keys.forEach((k) => k.remove()); this.keys = null;
    if (!this.skipped) { app.ocean.octo.play("rejouir"); await wait(500); }
    this.clear();
    tween(900, (u) => { const e = ease(u); app.ocean.octoAt = [up[0] + (home[0] - up[0]) * e, up[1] + (home[1] - up[1]) * e]; });
    return { vue: !this.skipped, passee: this.skipped, dureeS: Math.round((Date.now() - t0) / 1000), ...stats };
  }
  // une phrase : ses temps l'un après l'autre ; dans un temps, la voix et les actions ensemble
  async phrase(p, tok) {
    const { voice, ocean } = this.app;
    ocean.octo.hold("montrer");
    for (const beat of this.lesson.phrases[p]) {
      const acts = actions(beat), doing = (async () => { for (const a of acts) await this.act(a, tok); })();
      const said = beat.dire ? voice.say(beat.dire, { instruction: true }) : Promise.resolve();
      await this.guard(Promise.all([said, doing]), tok);
      await this.guard(wait(250), tok);
    }
    ocean.octo.release();
  }
  // attend `promise`, mais s'arrête net si la phrase a été abandonnée entre-temps
  async guard(promise, tok) { const r = await Promise.race([promise, this.abortP]); if (tok !== this.tok) throw ABORT; return r; }

  // ---------------------------------------------------------------- les actions, animées
  async act(a, tok) {
    const [name, arg] = a, nl = this.nl, T = nl.turtle, L = this.lesson.ligne, spec = this.spec, g = (p) => this.guard(p, tok);
    const done = () => { this.S = settle(this.S, a, L); this.paint(); };
    switch (name) {
      case "ligne": this.app.line.c.style.opacity = "1"; await g(wait(600)); return done();
      case "allumer":
        for (let i = 1; i <= spec.n; i++) { this.flash = i; this.paint(); await g(wait(230)); }
        await g(wait(600)); this.flash = 0; return done();
      case "tortue": {
        const i = tickOf(L, arg);
        if (T.a.vis) T.sitOn(spec, i); else await g(T.swimTo(spec, i));
        return done();
      }
      case "sauter": { await g(this.jump(tickOf(L, arg[0]), arg[1])); return done(); }
      case "retour": {
        this.S = { ...this.S, arcs: [], note: null }; this.paint(); T.hide();
        await g(T.swimTo(spec, tickOf(L, arg))); return done();
      }
      case "compter": {
        const to = tickOf(L, arg.jusqua);
        for (let k = 1, i = this.S.tortue + 1; i <= to; i++, k++) {
          const label = countLabel(L, arg.arcs, k, i);
          await g(this.jump(i, label));
          this.S = { ...this.S, arcs: [...this.S.arcs, { de: i - 1, a: i, texte: label }], tortue: i, note: null, ecrits: arg.ecrire ? [...new Set([...this.S.ecrits, i])] : this.S.ecrits };
          this.paint();
          await g(Promise.race([this.app.voice.say(countLabel(L, arg.dire, k, i)), wait(750)]));
        }
        return done();
      }
      case "clignoter":
        for (let k = 0; k < 7; k++) { this.hideArcs = k % 2 === 0; this.paint(); await g(wait(320)); }
        this.hideArcs = false; return done();
      case "filet":
        for (const v of [].concat(arg)) {
          const i = tickOf(L, v), n = this.net(i); if (this.S.filets.includes(i)) continue;
          n.a.show(true);
          await g(tween(700, (u) => { const e = ease(u); n.a.moveTo(n.x + 70 * (1 - e), n.y - 30 * (1 - e) * (1 - e), 1, Math.round(e * 20) / 20); }));
          this.S = { ...this.S, filets: [...this.S.filets, i] };
        }
        return done();
      case "loupe": {
        const i = tickOf(L, arg), lens = this.lensFor(i);
        for (let k = 0; k < 7; k++) { lens.show(k % 2 === 0); this.lensRing = k % 2 === 0 ? i : null; this.paint(); await g(wait(300)); }
        lens.show(true); this.lensRing = i; this.paint();
        return done();
      }
      case "compteur": done(); if (this.counter) pop(this.counter); return;
      default: return done(); // note, ecrire, etoile, entourer, arc, eclairer : un changement d'état, repeint aussitôt
    }
  }
  // un saut de la tortue vers la graduation i ; l'arc lumineux se trace pendant le saut (acteur de l'écran)
  async jump(i, label) {
    const nl = this.nl, T = nl.turtle, A = T.seat(T.at), B = T.seat(i);
    const arc = { a: [A[0], A[1] + 4], b: [B[0], B[1] + 4], h: arcHeight(Math.abs(B[0] - A[0])) - 4, label, live: true, p: 0 };
    this.S = { ...this.S, note: null }; this.paint(); nl.arcs.push(arc);
    await T.jump(i);
  }

  // ---------------------------------------------------------------- la scène d'après l'état
  // au début de chaque phrase : tout est remis d'après l'état (la tortue posée, les filets en place…)
  apply(S) {
    const nl = this.nl, T = nl.turtle;
    this.S = S; this.flash = 0; this.hideArcs = false; this.lensRing = null; this.lens?.show(false);
    this.app.line.c.style.opacity = S.ligne ? "1" : "0";
    if (S.tortue === null) T.hide(); else T.sitOn(this.spec, S.tortue);
    this.nets.forEach((n, i) => { n.a.show(S.filets.includes(i)); n.a.moveTo(n.x, n.y); });
    S.filets.forEach((i) => { const n = this.net(i); n.a.show(true); n.a.moveTo(n.x, n.y); });
    this.paint();
  }
  // repeint ce qui dépend de l'état : l'étoile, les arcs finis, le calque d'effets, le compteur
  paint() {
    const S = this.S, nl = this.nl, spec = this.spec, T = nl.turtle;
    nl.starAt = S.etoile === null ? null : [R.tickP(spec, S.etoile)[0], R.tickP(spec, S.etoile)[1] - 42];
    const arc = (a) => { const A = T.seat(a.de), B = T.seat(a.a); return { a: [A[0], A[1] + 4], b: [B[0], B[1] + 4], h: arcHeight(Math.abs(B[0] - A[0])) - 4, label: a.texte, p: 1 }; };
    nl.arcs = this.hideArcs ? [] : S.arcs.map(arc);
    nl.overlay = [(ctx) => this.overlay(ctx)];
    nl.paintFx(true);
    this.paintCounter();
  }
  // ce qui s'écrit ou s'allume sur la ligne, de la même plume qu'elle (runtime.js)
  overlay(ctx) {
    const S = this.S, spec = this.spec, top = spec.y + R.LABEL_DY, x = (i) => R.tickX(spec, i);
    const lit = new Set([...S.allumees, ...Array.from({ length: this.flash }, (_, i) => i)]);
    lit.forEach((i) => R.drawLitTick(ctx, spec, i));
    S.ecrits.forEach((i) => { if (!spec.labels[i]) R.drawNumber(ctx, String(this.lesson.ligne.min + i * this.lesson.ligne.pas), x(i), top, R.LABEL_EM, { w: 5.2, seed: 200 + i * 5 }); });
    if (S.etoile !== null && !S.ecrits.includes(S.etoile) && !spec.labels[S.etoile]) R.drawNumber(ctx, "?", x(S.etoile), top, R.LABEL_EM, { color: R.RED, w: 5.2, seed: 200 + S.etoile * 5 });
    [...S.anneaux, ...(this.lensRing === null ? [] : [this.lensRing])].forEach((i) => R.drawRing(ctx, x(i), top + 18, 32));
    if (S.note && S.tortue !== null) { const [nx, ny] = this.nl.turtle.seat(S.tortue); R.drawWord(ctx, S.note.texte, nx + 10, ny - 104, 30, { color: "#fffaf0", w: 4.6, seed: 610 }); }
  }
  // le compteur (L2) : une bulle en haut, le nombre encré en direct
  paintCounter() {
    const v = this.S.compteur;
    if (v === null) { this.counter?.remove(); this.counter = null; return; }
    const paint = (ctx, px) => { this.app.sprites.draw(ctx, "reponse", 0, 70, 70); ctx.setTransform(px, 0, 0, px, 0, 0); const s = String(v), em = s.length > 2 ? 40 : 54; R.drawNumber(ctx, s, 70, 70 - em / 2, em, { w: em * 0.14, seed: 333 }); };
    if (!this.counter) this.counter = spriteBox(this.app, { x: COUNTER[0] - 70, y: COUNTER[1] - 70, w: 140, h: 140, cls: "hud counter", still: true, paint });
    else if (this.counter.value !== v) this.counter.repaint(paint);
    this.counter.value = v;
  }
  // un filet de dix poissons, suspendu sous la corde entre la graduation i et la suivante (dessiné une fois)
  net(i) {
    if (this.nets.has(i)) return this.nets.get(i);
    const { stage, ocean, sprites } = this.app, spec = this.spec, mx = (R.tickX(spec, i) + R.tickX(spec, i + 1)) / 2;
    const a = new Actor(stage, ocean.frontEl, NET_W + 8, NET_H + 8, (NET_W + 8) / 2, 0); ocean.frontEl.prepend(a.c); ocean.actors.push(a);
    a.paint("filet", (ctx) => {
      const px = stage.px; ctx.setTransform(px, 0, 0, px, 0, 0); R.drawNet(ctx, 4, 3, NET_W, NET_H, 30 + i);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (let k = 0; k < 10; k++) { const q = sprites.frame(`poisson.${k % 3}.${k % 2 ? "g" : "d"}`, (k * 5) % 12), s = 0.2, cx = (4 + 7 + (k % 5) * 12) * px, cy = (3 + 10 + Math.floor(k / 5) * 15) * px; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, Math.round(cx + q.dx * s), Math.round(cy + q.dy * s), Math.round(q.w * s), Math.round(q.h * s)); }
    });
    const n = { a, x: mx, y: R.lineY(spec, mx) + 17 };
    a.show(false); this.nets.set(i, n); return n;
  }
  // la loupe de L3 : le nombre de la graduation i, en grand, sous la ligne à droite de ce nombre
  lensFor(i) {
    const { stage, ocean } = this.app, spec = this.spec, text = String(this.lesson.ligne.min + i * this.lesson.ligne.pas);
    if (!this.lens) { this.lens = new Actor(stage, ocean.frontEl, 270, 290, 150, 110); ocean.actors.push(this.lens); }
    const A = this.lens, px = stage.px;
    A.paint(`loupe:${text}`, (ctx) => { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawLens(ctx, 150, 110, 66); R.drawNumber(ctx, text, 150, 110 - 32, 64, { w: 9.5, seed: 490 }); });
    A.moveTo(R.tickX(spec, i) + 140, 672); A.show(true);
    return A;
  }
  // la leçon est quittée pour de bon (entraînement libre : bouton « maison ») ; le déroulement abandonné
  // reste figé (engine/clock.js), on range la scène
  abandon() {
    this.p2?.abandon();
    if (!this.keys) return;
    this.tok++; this.abort = null; this.keys.forEach((k) => k.remove()); this.keys = null; this.clear();
    if (this.home) this.app.ocean.octoAt = [...this.home];
  }
  // fin de leçon : la scène redevient celle des exercices
  clear() {
    const nl = this.nl;
    this.nets.forEach((n) => n.a.show(false)); this.lens?.show(false); this.counter?.remove(); this.counter = null;
    nl.arcs = []; nl.overlay = []; nl.starAt = null; nl.turtle.hide(); this.app.line.fxClear();
    this.app.line.clear(); this.app.line.c.style.opacity = "1";
  }
}
