// LEÇONS ANIMÉES DU MODULE 2 (L4 les doubles, L5 les amis de 10, L6 la maison des nombres ; docs/SPEC.md,
// « Leçons animées » ; lot 2, étape 6). Même règle que le lecteur du module 1 (lessons/player.js) : chaque
// phrase est découpée en temps ; la voix dit pendant que les actions se jouent, le temps suivant attend la
// fin des deux. « rejouer » (en bas à droite) reprend au début, « passer » (en haut à droite) l'arrête, dès la
// première vue. La scène : le calque des aides (modules/facts/aids.js), redessiné seulement quand l'état change,
// et le bernard-l'ermite, qui montre, se réjouit, change de coquille.
// Actions (content/lecons.json, `module: 2`) : ermite « sortir | montrer | rejouir | changer » ; miroir n (un
// poisson devant un miroir, n bulles de chaque côté) ; ecrire « 3 + 3 = 6 » (écrit en grand au feutre) ;
// defiler [[a, b], …] (les égalités s'écrivent l'une après l'autre) ; cadre { n, extra, lueur } (la boîte à dix
// places) ; entrer n (les poissons entrent un à un jusqu'à n) ; maison { total, etages } ; effacer ; attendre ms.
import * as R from "../art/runtime.js";
import { onTap, spriteBox } from "../session/screens.js";
import { skipKey } from "../engine/ui.js";
import { wait } from "../engine/clock.js";
import { Hermit } from "../engine/hermit.js";
import { AidBoard, num, paintHouse, paintTenFrame, put } from "../modules/facts/aids.js";

const ABORT = Symbol("leçon interrompue");
const REPLAY_AT = [1180, 712];
const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
const EMPTY = () => ({ miroir: null, cadre: null, maison: null, ecrit: null });

export class Lesson2Player {
  constructor(app, content) { this.app = app; this.c = content; this.tok = 0; this.keys = null; }
  get board() { return (this.app.aidBoard ??= new AidBoard(this.app)); }
  async play(id) {
    const { app } = this, lesson = this.c[id], t0 = Date.now(), stats = { rejouees: 0 };
    if (!lesson) return { vue: false };
    app.facts?.show(false);
    await app.sprites.load("ermite");
    // le bernard-l'ermite : celui de la notion du jour, sinon le sien (entraînement libre)
    this.own = !app.hermit; this.h = app.hermit ?? new Hermit(app.ocean, { x: 150, y: 795, scale: 0.85 }); this.h.show(true);
    if (this.own) this.h.play("sortir");
    this.p = 0; this.skipped = false; this.abort = null; this.goto = undefined;
    const jump = (to) => { this.goto = to; app.voice.stop(); if (this.abort) this.abort(); else this.p = to; };
    const again = spriteBox(app, { x: REPLAY_AT[0] - 70, y: REPLAY_AT[1] - 70, w: 140, h: 140, cls: "bubble lessonkey rejouer", label: "rejouer la leçon", paint: (ctx) => app.sprites.draw(ctx, "rejouer", 0, 70, 70) });
    onTap(again, () => { if (!this.abort) return; pop(again); stats.rejouees++; jump(0); });
    const skip = skipKey(app, () => { this.skipped = true; jump(lesson.phrases.length); }, "passer la leçon");
    skip.classList.add("lessonkey");
    this.keys = [again, skip];
    this.lesson = lesson;
    while (this.p < lesson.phrases.length) {
      const tok = ++this.tok;
      this.abortP = new Promise((_, rej) => { this.abort = () => rej(ABORT); }); this.abortP.catch(() => {});
      if (this.p === 0) { this.st = EMPTY(); this.paint(); }
      try { await this.phrase(this.p, tok); this.p++; }
      catch (e) { if (e !== ABORT) throw e; this.p = this.goto ?? this.p; }
    }
    this.abort = null; this.tok++;
    this.keys.forEach((k) => k.remove()); this.keys = null;
    if (!this.skipped) { app.ocean.octo.play("rejouir"); this.h.play("rejouir"); await wait(600); }
    this.clear();
    return { vue: !this.skipped, passee: this.skipped, dureeS: Math.round((Date.now() - t0) / 1000), ...stats };
  }
  g(p) { return Promise.race([p, this.abortP]); }
  async phrase(p) {
    const { voice, ocean } = this.app;
    ocean.octo.hold("montrer");
    for (const beat of this.lesson.phrases[p]) {
      const said = beat.dire ? voice.say(beat.dire, { instruction: true }) : Promise.resolve();
      const done = (async () => { for (const a of beat.faire ?? []) await this.g(this.act(a)); })();
      await this.g(Promise.all([said, done]));
    }
  }
  async act(a) {
    const [[name, v]] = Object.entries(a), st = this.st;
    if (name === "ermite") { const p = this.h.play(v, { hold: 1800 }); if (v === "changer") await p; return; }
    if (name === "attendre") return wait(v);
    if (name === "effacer") { this.st = EMPTY(); return this.paint(); }
    if (name === "miroir") { st.miroir = v; st.cadre = null; st.maison = null; return this.paint(); }
    if (name === "ecrire") { st.ecrit = v; return this.paint(); }
    if (name === "defiler") { for (const [x, y] of v) { st.ecrit = `${x} + ${y} = ${x + y}`; this.paint(); await wait(950); } return; }
    if (name === "cadre") { st.cadre = { n: 0, extra: 0, lueur: [], ...v }; st.miroir = null; return this.paint(); }
    if (name === "entrer") { const c = st.cadre ?? (st.cadre = { n: 0, extra: 0, lueur: [] }); while (c.n < v) { c.n++; this.paint(); this.app.sound?.play("bouton"); await wait(260); } return; }
    if (name === "maison") { st.maison = v; st.miroir = null; st.cadre = null; return this.paint(); }
  }
  // l'état de la scène, dessiné une fois (le calque des aides)
  paint() {
    const { sprites } = this.app, st = this.st;
    this.board.draw((ctx) => {
      if (st.miroir) paintMirror(ctx, sprites, st.miroir, 700, 470);
      if (st.cadre) paintTenFrame(ctx, sprites, 700 - 228, 400, { n: st.cadre.n, extra: st.cadre.extra ?? 0, glow: st.cadre.lueur ?? [] });
      if (st.maison) paintHouse(ctx, sprites, 700, 400, st.maison.total, st.maison.etages ?? []);
      if (st.ecrit) { const em = 64; R.drawWord(ctx, st.ecrit, 760, 196 - em / 2, em, { w: 9, seed: 990 }); }
    });
  }
  abandon() { if (!this.keys) return; this.tok++; this.abort = null; this.keys.forEach((k) => k.remove()); this.keys = null; this.clear(); }
  clear() {
    this.app.aidBoard?.clear();
    if (this.own) { this.h?.remove(); this.app.sprites.unload("ermite"); }
    this.h = null;
  }
}

// un poisson devant un miroir (une ligne de lumière verticale), son reflet de l'autre côté, n bulles de chaque côté
export function paintMirror(ctx, sprites, n, cx, cy) {
  const glow = [[cx, cy - 150], [cx + 6, cy], [cx, cy + 150]];
  ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = "#e8fffb"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(...glow[0]); ctx.quadraticCurveTo(...glow[1], ...glow[2]); ctx.stroke(); ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = "#ffffff"; ctx.stroke(); ctx.restore();
  put(ctx, sprites, "poisson.0.d", cx - 110, cy + 30); put(ctx, sprites, "poisson.0.g", cx + 110, cy + 30);
  for (let i = 0; i < n; i++) { const dy = -60 - i * 46, dx = 40 + (i % 2) * 22; put(ctx, sprites, "aide.bulle.doree", cx - dx - 60, cy + dy); put(ctx, sprites, "aide.bulle.doree", cx + dx + 60, cy + dy); }
  void num;
}
