// MODULE 2 · L'ÉCRAN DE L'ÉCHAUFFEMENT. Une ardoise en haut (« 5 + 2 = ? », encré en direct), un pavé
// numérique géant en bas : deux rangées de cinq chiffres (0 à 4, 5 à 9, comme le cadre de dix), une
// touche pour effacer et la coche pour valider. Le coquillage, à gauche, montre l'aide de la famille
// (docs/SPEC.md, « Aide disponible ») : la tortue qui fait 1 ou 2 sauts sur la ligne (famille 1), le
// poisson et son reflet (famille 2). Un fait résolu avec l'aide n'avance pas de boîte.
import * as R from "../../art/runtime.js";
import { onTap, spriteBox } from "../../session/screens.js";
import { fill } from "../numberline/screen.js";
import { clock, wait } from "../../engine/clock.js";
import { skipKey } from "../../engine/ui.js";

const SKIPPED = Symbol("correction passée");

const SLATE = [790, 222], KEY = 112, ROWS = [540, 668], COLS = [390, 508, 626, 744, 862], SIDE = 1010;
const pop = (el, cls = "pop") => { el.classList.remove("pop", "shake"); void el.offsetWidth; el.classList.add(cls); };

export class FactsScreen {
  constructor(app, content) {
    this.app = app; this.c = content; this.typed = ""; this.locked = true; this.q = null; this.ring = false; this.els = [];
    const { sprites } = app;
    this.slate = spriteBox(app, { x: SLATE[0] - 295, y: SLATE[1] - 110, w: 590, h: 220, cls: "hud slate", still: true, paint: (ctx, px) => this.paintSlate(ctx, px) });
    // une touche : la bulle-réponse réduite (jamais agrandie) et son chiffre encré
    const key = (x, y, label, paint) => { const b = spriteBox(app, { x: x - KEY / 2, y: y - KEY / 2, w: KEY, h: KEY, cls: "bubble key", label, paint }); b.dataset.key = label; this.els.push(b); return b; };
    const small = (name, k) => (ctx, px) => { const q = sprites.frame(name, 0); ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (KEY / 2) * px + q.dx * k, (KEY / 2) * px + q.dy * k, q.w * k, q.h * k); return px; };
    for (let d = 0; d <= 9; d++) {
      const b = key(COLS[d % 5], ROWS[Math.floor(d / 5)], String(d), (ctx, px) => { small("reponse", 0.9)(ctx, px); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawNumber(ctx, String(d), KEY / 2, KEY / 2 - 25, 50, { w: 7, seed: 900 + d }); });
      onTap(b, () => this.type(String(d), b));
    }
    const del = key(SIDE, ROWS[0], "effacer", small("effacer", 0.8)); onTap(del, () => { if (this.locked || !this.typed) return; pop(del); this.typed = this.typed.slice(0, -1); this.slate.repaint(); });
    const ok = key(SIDE, ROWS[1], "valider", small("valider", 0.7)); ok.classList.add("check"); onTap(ok, () => { if (this.locked || !this.typed) return; pop(ok); this.submit(); });
    // « je ne sais pas » (lot 1 bis) : compte comme une erreur (code NSP), montre la réponse, le fait revient
    this.nsp = spriteBox(app, { x: 1165 - 75, y: 604 - 75, w: 150, h: 150, cls: "bubble nsp", label: "je ne sais pas", paint: (ctx) => sprites.draw(ctx, "nsp", 0, 75, 75) });
    onTap(this.nsp, () => { if (this.locked) return; pop(this.nsp); this.submit({ nsp: true }); });
    this.help = spriteBox(app, { x: 222 - 75, y: 580 - 75, w: 150, h: 150, cls: "bubble help", label: "aide", paint: (ctx) => sprites.draw(ctx, "aide", 0, 75, 75) });
    onTap(this.help, () => this.showHelp());
    this.show(false);
  }
  show(v) { for (const e of [this.slate, this.help, this.nsp, ...this.els]) e.style.visibility = v ? "visible" : "hidden"; }
  keys(v) { for (const e of [this.help, this.nsp, ...this.els]) e.style.visibility = v ? "visible" : "hidden"; }
  // l'ardoise : « a + b = » puis la case réponse (« ? » rouge, les chiffres tapés, ou la correction)
  paintSlate(ctx, px) {
    this.app.sprites.draw(ctx, "ardoise", 0, 295, 110);
    if (!this.q) return;
    ctx.setTransform(px, 0, 0, px, 0, 0);
    const em = 76, eq = `${this.q.a} + ${this.q.b} =`, slot = this.typed || "?", ew = R.wordWidth(eq) * em, sw = Math.max(1.36, R.wordWidth(slot)) * em, gap = 0.4 * em, x0 = 295 - (ew + gap + sw) / 2;
    R.drawWord(ctx, eq, x0 + ew / 2, 110 - em / 2, em, { w: 10, seed: 950 });
    const sx = x0 + ew + gap + sw / 2;
    if (this.ring) R.drawRing(ctx, sx, 110, 56);
    R.drawNumber(ctx, slot, sx, 110 - em / 2, em, { w: 10.5, color: this.typed ? R.INK : R.RED, seed: 970 });
  }
  type(d, b) {
    if (this.locked) return; pop(b);
    this.typed = (this.typed.length >= 2 ? "" : this.typed) + d; // deux chiffres au plus (les sommes vont jusqu'à 10)
    this.slate.repaint();
  }
  // pose la question et attend la réponse ; la promesse se résout après le retour
  ask(q) {
    const { voice, text } = this.app;
    this.q = q; this.typed = ""; this.ring = false; this.aide = false; this.locked = false; this.app.starFrom = SLATE;
    this.help.style.visibility = q.base ? "hidden" : "visible"; // pas d'aide pour « 4 + 0 »
    this.slate.repaint(); pop(this.slate);
    this.t0 = clock.now();
    voice.stop(); voice.say(fill(text.pick("fait"), { a: q.a, b: q.b }), { instruction: true });
    return new Promise((res) => { this.resolve = res; });
  }
  // la correction (erreur ou « je ne sais pas ») peut être passée dès qu'elle commence : la voix se tait,
  // le résultat reste écrit sur l'ardoise environ une seconde, puis le fait suivant ; noté « correction passée ».
  // Ses pauses suivent la vitesse des corrections (content/seance.json, vitesseAnimations).
  async submit({ nsp = false } = {}) {
    const { voice, text, ocean } = this.app, q = this.q, value = nsp ? null : Number(this.typed), ok = value === q.a + q.b, ms = Math.round(clock.now() - this.t0), k = this.app.vitesse ?? 1;
    this.locked = true; voice.stop();
    const r = { value, ms, listens: voice.listens, aide: this.aide, nsp };
    ocean.octo.play(ok ? "rejouir" : "encourager");
    const answer = () => { this.typed = String(q.a + q.b); this.ring = true; this.slate.repaint(); };
    if (ok) { pop(this.slate); await voice.say(text.pick("bravo")); await wait(250); }
    else {
      let abort = null;
      const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
      const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer la correction");
      try {
        if (nsp) await g(voice.say(text.data.faitNSP)); else { pop(this.slate, "shake"); await g(wait(500 / k)); }
        answer();
        await g(voice.say(fill(text.data.faitCorrection, { a: q.a, b: q.b, n: q.a + q.b })));
        await g(wait(700 / k));
      } catch (e) {
        if (e !== SKIPPED) throw e;
        voice.stop(); r.correctionPassee = true; answer(); pop(this.slate);
        await wait(1000);
      }
      skip.remove();
    }
    const done = this.resolve; this.resolve = null; done?.(r);
  }
  // ---------------------------------------------------------------- l'aide (coquillage)
  async showHelp() {
    if (this.locked || !this.q || this.q.base) return;
    const { voice, text, line, sprites } = this.app, q = this.q, fam = this.c.familles.find((f) => f.id === q.famille);
    this.locked = true; this.aide = true; pop(this.help); this.keys(false); voice.stop();
    if (fam?.aide === "ligne") {
      // la tortue part du grand nombre et fait 1 ou 2 sauts (la ligne de 0 à 10, tous les nombres écrits)
      const nl = this.app.lineScreen(), big = Math.max(q.a, q.b), small = Math.min(q.a, q.b);
      const spec = { x0: 150, x1: 1134, y: 452, n: 11, labels: Array.from({ length: 11 }, (_, i) => String(i)), k: 0, lit: [big] };
      const [bmp] = await line.render([spec]); line.show(bmp);
      nl.spec = spec; nl.q = { min: 0, max: 10, step: 1 }; nl.arcs = []; nl.overlay = []; line.fxClear();
      nl.turtle.sitOn(spec, big);
      await voice.say(fill(text.data.aideLigne, { a: big, sauts: small === 1 ? text.data.unSaut : `${small} ${text.data.sauts}` }));
      await nl.countJumps(big, big + small, { label: (k) => `+${k}`, say: (k) => String(k) });
      await wait(1600);
      nl.turtle.hide(); nl.arcs = []; line.fxClear(); line.clear();
    } else if (fam?.aide === "reflet") {
      // le poisson et son reflet : a poissons en haut, les mêmes renversés sous la surface d'un miroir d'eau
      const n = q.a, gap = 92, x0 = 640 - ((n - 1) * gap) / 2;
      const fishAt = (ctx, x, y, flip, alpha) => { const f = sprites.frame("poisson.1.d", 0), m = ctx.getTransform(); ctx.setTransform(1, 0, 0, flip ? -1 : 1, 0, 0); ctx.globalAlpha = alpha; const X = Math.round(m.a * x + m.e + f.dx), Y = m.d * y + m.f; ctx.drawImage(f.img, f.sx, f.sy, f.w, f.h, X, flip ? -Math.round(Y - f.dy) : Math.round(Y + f.dy), f.w, f.h); ctx.globalAlpha = 1; ctx.setTransform(m); };
      line.fxClear();
      line.fxDraw((ctx) => {
        for (let i = 0; i < n; i++) fishAt(ctx, x0 + i * gap, 388, false, 1);
        R.drawWave(ctx, x0 - 70, x0 + (n - 1) * gap + 70, 436);
        for (let i = 0; i < n; i++) fishAt(ctx, x0 + i * gap, 484, true, 0.6);
      });
      await voice.say(fill(text.data.aideReflet, { a: q.a }));
      await wait(2200);
      line.fxClear();
    }
    this.keys(true); this.locked = false;
    voice.say(fill(text.pick("fait"), { a: q.a, b: q.b }));
  }
  leave() { this.show(false); this.q = null; }
}

// l'échauffement dans la séance : n faits (5 à 8), précédés des questions du temps de base
export async function runWarmup({ session, step, end, warmup, screen, intro, rnd = Math.random }) {
  const [a, b] = step.questions, n = a + Math.floor(rnd() * (b - a + 1)), rest = warmup.questions(n, a);
  screen.show(true); screen.keys(false);
  session.expect?.(rest.length);
  await intro?.();
  screen.keys(true);
  while (rest.length && !session.over(end)) {
    const q = rest.shift(), r = await screen.ask(q), res = await warmup.record(q, r, rest);
    session.expect?.(session.progress.faites + 1 + rest.length); // un fait raté revient : une bulle de plus
    await session.answered(res.juste);
    await session.stars(res.etoiles, q.revient && res.juste ? "erreur corrigée" : "bonne réponse");
  }
  screen.leave();
}
