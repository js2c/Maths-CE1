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
import { aidFor, expected } from "./facts.js";
import { AidBoard, paintDoublePlus, paintHouse, paintTenFrame } from "./aids.js";

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
    const del = key(SIDE, ROWS[0], "effacer", small("effacer", 0.8)); onTap(del, () => { if (this.locked || !this.typed) return; pop(del); this.typed = this.typed.slice(0, -1); this.slate.repaint(); this.onTyped?.(this.typed); });
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
  // l'ardoise : « a + b = » puis la case réponse (« ? » rouge, les chiffres tapés, ou la correction) ; formes à
  // trou (lot 2) : « a + ? = n » ou « ? + b = n », la case à la place du nombre qui manque
  paintSlate(ctx, px) {
    this.app.sprites.draw(ctx, "ardoise", 0, 295, 110);
    if (!this.q) return;
    ctx.setTransform(px, 0, 0, px, 0, 0);
    const q = this.q, n = q.a + q.b, f = q.forme ?? "directe";
    const [left, right] = q.dictee ? ["", ""] : f === "trouDroite" ? [`${q.a} +`, `= ${n}`] : f === "trouGauche" ? ["", `+ ${q.b} = ${n}`] : [`${q.a} + ${q.b} =`, ""];
    const em = 76, slot = this.typed || "?", lw = left ? R.wordWidth(left) * em : 0, rw = right ? R.wordWidth(right) * em : 0, sw = Math.max(1.36, R.wordWidth(slot)) * em, gap = 0.4 * em;
    const total = lw + (left ? gap : 0) + sw + (right ? gap : 0) + rw, x0 = 295 - total / 2;
    if (left) R.drawWord(ctx, left, x0 + lw / 2, 110 - em / 2, em, { w: 10, seed: 950 });
    const sx = x0 + lw + (left ? gap : 0) + sw / 2;
    if (right) R.drawWord(ctx, right, sx + sw / 2 + gap + rw / 2, 110 - em / 2, em, { w: 10, seed: 960 });
    if (this.ring) R.drawRing(ctx, sx, 110, 56);
    R.drawNumber(ctx, slot, sx, 110 - em / 2, em, { w: 10.5, color: this.typed ? R.INK : R.RED, seed: 970 });
  }
  type(d, b) {
    if (this.locked) return; pop(b);
    const max = this.q?.dictee ? 5 : 2; // deux chiffres au plus (les sommes vont jusqu'à 10) ; la dictée : cinq (3007, 30017 sont des erreurs à reconnaître)
    this.typed = (this.typed.length >= max ? "" : this.typed) + d;
    this.slate.repaint();
    this.onTyped?.(this.typed); // (lot 3 : le tableau de la dictée)
  }
  // pose la question et attend la réponse ; la promesse se résout après le retour
  ask(q) {
    const { voice } = this.app;
    this.q = q; this.typed = ""; this.ring = false; this.aide = false; this.locked = false; this.app.starFrom = SLATE;
    this.help.style.visibility = q.base ? "hidden" : "visible"; // pas d'aide pour « 4 + 0 »
    this.slate.repaint(); pop(this.slate);
    // lot 2, étape 6 : un exemple guidé (l'appui visuel montre la réponse, on peut le passer), ou l'aide
    // affichée d'emblée (cran « plus facile » en notion du jour)
    const p = new Promise((res) => { this.resolve = res; });
    // (l'appui est rangé quand le pavé revient : il occupe la même place)
    const then = () => { this.app.aidBoard?.clear(); this.locked = false; this.keys(true); this.t0 = clock.now(); voice.say(this.consigne(q), { instruction: true }); };
    if (q.guide) { this.locked = true; this.demo(q).then(then); return p; }
    if (q.aideDEmblee) { this.locked = true; this.keys(false); this.autoAid(q).then(then); return p; }
    this.t0 = clock.now();
    voice.stop(); voice.say(this.consigne(q), { instruction: true });
    return p;
  }
  // ---------------------------------------------------------------- la dictée de nombres (lot 2, étape 8)
  // le module 1, niveau 12 : l'ardoise ne montre que le nombre tapé (ou « ? »), la voix dit la consigne ; la
  // réponse est rendue telle quelle à la coche (le retour est fait par modules/numberline/dictation.js)
  askNumber(q, consigne) {
    const { voice } = this.app;
    this.defi = null; this.dictee = consigne; this.q = { ...q, dictee: true }; this.typed = ""; this.ring = false; this.aide = false; this.locked = false; this.app.starFrom = SLATE;
    this.show(true); this.help.style.visibility = "hidden";
    this.slate.repaint(); pop(this.slate); this.t0 = clock.now();
    voice.stop(); voice.say(consigne, { instruction: true });
    return new Promise((res) => { this.resolve = res; });
  }
  // montre un nombre sur l'ardoise (correction, exemple guidé), entouré ou non
  write(n, ring = true) { this.typed = String(n); this.ring = ring; this.slate.repaint(); }
  // ---------------------------------------------------------------- le défi record (lot 2, étape 7)
  // une question du défi : pas de consigne lue (le temps compte ; l'ardoise suffit), pas d'aide ; la réponse
  // est rendue dès la coche, avec `after` : la fin du petit retour (bulle claire, ou la bonne réponse montrée
  // un instant après une erreur, sans correction)
  askDefi(q, { apresErreurMs = 900 } = {}) {
    this.defi = { apresErreurMs }; this.q = q; this.typed = ""; this.ring = false; this.aide = false; this.locked = false; this.app.starFrom = SLATE;
    this.help.style.visibility = "hidden";
    this.slate.repaint(); pop(this.slate); this.t0 = clock.now();
    return new Promise((res) => { this.resolve = res; });
  }
  // la minute est finie : la question en cours est abandonnée
  cancel() { this.locked = true; const done = this.resolve; this.resolve = null; done?.({ timeout: true }); }
  // fin du défi : plus de question, l'ardoise est rangée (les perles et le drapeau restent)
  blank() { this.locked = true; this.q = null; this.typed = ""; this.slate.repaint(); this.slate.style.visibility = "hidden"; }
  submitDefi(nsp) {
    const q = this.q, value = nsp ? null : Number(this.typed), ok = value === expected(q), ms = Math.round(clock.now() - this.t0);
    this.locked = true; const pauseMs = this.defi.apresErreurMs;
    if (ok) this.app.sound?.play("bonne"); else if (!nsp) this.app.sound?.play("erreur");
    const after = (async () => {
      if (ok) { pop(this.slate); await wait(180); return; }
      if (!nsp) pop(this.slate, "shake");
      this.typed = String(expected(q)); this.ring = true; this.slate.repaint();
      await wait(pauseMs);
    })();
    const done = this.resolve; this.resolve = null; done?.({ value, ms, listens: 0, aide: false, nsp, after });
  }
  // ---------------------------------------------------------------- l'appui visuel de la famille (lot 2, étape 6)
  // cadre de 10, maison des nombres, double + 1, reflet des doubles (la ligne de la famille 1 est la tortue,
  // voir showHelp) ; `solved` : avec la réponse (exemple guidé, correction), sinon avec « ? » et des places vides
  // l'appui d'une question : celui que la notion du jour a choisi (`q.appui`), sinon celui de la famille du fait
  aidKind(q) { const fam = this.c.familles.find((f) => f.id === q.famille)?.aide; return q.appui ?? (fam && fam !== "fait" ? fam : aidFor(q.a, q.b)); }
  get board() { return (this.app.aidBoard ??= new AidBoard(this.app)); }
  paintAid(q, solved) {
    const { sprites } = this.app, kind = this.aidKind(q), f = q.forme ?? "directe", n = q.a + q.b;
    const A = f === "trouGauche" && !solved ? "?" : q.a, B = f === "trouDroite" && !solved ? "?" : q.b, N = f === "directe" && !solved ? "?" : n;
    if (kind === "ligne") return kind;
    this.keys(false); this.hermit?.play("montrer", { hold: 2500 });
    this.board.draw((ctx) => {
      if (kind === "cadre") { const k = f === "trouGauche" ? q.b : q.a, rest = n - k; paintTenFrame(ctx, sprites, 700 - 228, 495, { n: k, extra: solved || f === "directe" ? rest : 0, glow: solved || f === "directe" ? [] : Array.from({ length: rest }, (_, i) => k + i) }); }
      else if (kind === "maison") paintHouse(ctx, sprites, 700, 580, N, [[A, B]]);
      else if (kind === "doublePlus") paintDoublePlus(ctx, sprites, Math.min(q.a, q.b), { cx: 700, y: 500 });
      else paintDoublePlus(ctx, sprites, q.a, { cx: 700, y: 500, bonus: false });
    });
    return kind;
  }
  aidSpeech(q, kind) {
    const t = this.app.text.data, k = q.forme === "trouGauche" ? q.b : q.a;
    return kind === "cadre" ? fill(t.aideCadre, { k }) : kind === "maison" ? t.aideMaison : kind === "doublePlus" ? fill(t.aideDoublePlus, { d: Math.min(q.a, q.b) }) : fill(t.aideReflet, { a: q.a });
  }
  // l'aide (coquillage, aide affichée d'emblée) peut être passée dès qu'elle commence (décision du parent du
  // 27 septembre) : le bouton « passer » habituel ; un toucher coupe la voix et l'animation, range l'appui et
  // rend le pavé aussitôt. `body(g, dead)` : `g` garde chaque attente, `dead()` dit si l'aide a été passée.
  async skippable(label, body) {
    let abort = null, dead = false; const abortP = new Promise((_, rej) => { abort = () => { dead = true; rej(SKIPPED); }; }); abortP.catch(() => {});
    const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), label);
    try { await body(g, () => dead); } catch (e) { if (e !== SKIPPED) throw e; this.app.voice.stop(); }
    finally { skip.remove(); this.board.clear(); }
  }
  // cran « plus facile » : l'appui est montré d'emblée (sans la réponse), puis le pavé revient ; un fait réussi
  // ainsi ne change pas de boîte (runner.js, `aideDEmblee`) ; « passer » rend le pavé aussitôt
  async autoAid(q) {
    const { voice } = this.app, kind = this.aidKind(q);
    voice.stop(); voice.say(this.consigne(q));
    await this.skippable("passer l'aide", async (g, dead) => {
      if (kind === "ligne") return this.lineAid(q, false, { g, dead });
      this.paintAid(q, false); await g(voice.say(this.aidSpeech(q, kind))); await g(wait(1500));
    });
  }
  // un exemple guidé : l'appui avec la réponse, « a plus b, ça fait n », puis « À toi ! » ; « passer » l'arrête
  async demo(q) {
    const { voice, text } = this.app, k = this.app.vitesse ?? 1;
    this.keys(false); voice.stop();
    let abort = null; const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
    const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer l'exemple");
    try {
      const kind = this.aidKind(q);
      if (kind === "ligne") await g(this.lineAid(q, true, { g }));
      else { this.paintAid(q, true); await g(voice.say(this.aidSpeech(q, kind))); }
      await g(voice.say(fill(text.data.faitCorrection, { a: q.a, b: q.b, n: q.a + q.b })));
      await g(wait(500 / k));
      await g(voice.say(text.data.aToiFait));
    } catch (e) { if (e !== SKIPPED) throw e; voice.stop(); q.passe = true; this.app.line.fxClear(); }
    skip.remove();
  }
  // la notion du jour (session/notion.js) : la question, puis ce que le déroulement attend (juste ou non, code)
  async askNotion(q) {
    this.show(true);
    const r = await this.ask(q), ok = r.value === expected(q);
    return { ...r, q, ok, code: ok ? null : r.nsp ? "NSP" : "autre" };
  }
  // la consigne lue : « 5 plus 2 ? », ou la forme à trou (« 3 plus combien, ça fait 7 ? »)
  consigne(q) {
    if (q.dictee) return this.dictee;
    const { text } = this.app, v = { a: q.a, b: q.b, n: q.a + q.b };
    // lot 3 : les presque-doubles rappellent le double (« 3 plus 4, c'est 3 plus 3, et encore 1 »), runner.js
    if (q.rappel && (q.forme ?? "directe") === "directe") return `${fill(text.pick("fait"), v)} ${fill(text.data.rappelDouble, { ...v, d: q.rappel.d })}`;
    return q.forme === "trouDroite" ? fill(text.data.faitTrouDroite, v) : q.forme === "trouGauche" ? fill(text.data.faitTrouGauche, v) : fill(text.pick("fait"), v);
  }
  // la correction (erreur ou « je ne sais pas ») peut être passée dès qu'elle commence : la voix se tait,
  // le résultat reste écrit sur l'ardoise environ une seconde, puis le fait suivant ; noté « correction passée ».
  // Ses pauses suivent la vitesse des corrections (content/seance.json, vitesseAnimations).
  async submit({ nsp = false } = {}) {
    this.beforeSubmit?.(); // (lot 3 : le « passer » de l'échauffement disparaît dès la première réponse)
    if (this.defi) return this.submitDefi(nsp);
    if (this.q?.dictee) { this.locked = true; this.app.voice.stop(); const done = this.resolve; this.resolve = null; return done?.({ value: nsp ? null : Number(this.typed), ms: Math.round(clock.now() - this.t0), listens: this.app.voice.listens, nsp }); }
    const { voice, text, ocean } = this.app, q = this.q, value = nsp ? null : Number(this.typed), ok = value === expected(q), ms = Math.round(clock.now() - this.t0), k = this.app.vitesse ?? 1;
    this.locked = true; voice.stop();
    const r = { value, ms, listens: voice.listens, aide: this.aide, nsp };
    ocean.octo.play(ok ? "rejouir" : "encourager");
    if (ok) this.app.sound?.play("bonne"); else if (!nsp) this.app.sound?.play("erreur");
    const answer = () => { this.typed = String(expected(q)); this.ring = true; this.slate.repaint(); };
    if (ok) { pop(this.slate); if (this.notion && (q.guide || q.revient)) this.hermit?.play("rejouir"); await voice.say(text.pick("bravo")); await wait(250); }
    else {
      let abort = null;
      const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
      const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer la correction");
      try {
        if (nsp) await g(voice.say(text.data.faitNSP)); else { pop(this.slate, "shake"); await g(wait(500 / k)); }
        answer();
        // en notion du jour (lot 2, étape 6) : l'appui visuel de la famille, avec la réponse
        if (this.notion && !q.base) { const kind = this.aidKind(q); if (kind === "ligne") await g(this.lineAid(q, false, { g })); else { this.paintAid(q, true); await g(voice.say(this.aidSpeech(q, kind))); } }
        await g(voice.say(fill(text.data.faitCorrection, { a: q.a, b: q.b, n: q.a + q.b })));
        await g(wait(700 / k));
      } catch (e) {
        if (e !== SKIPPED) throw e;
        voice.stop(); r.correctionPassee = true; answer(); pop(this.slate);
        await wait(1000);
      }
      skip.remove();
    }
    this.app.aidBoard?.clear();
    const done = this.resolve; this.resolve = null; done?.(r);
  }
  // ---------------------------------------------------------------- l'aide (coquillage)
  async showHelp() {
    if (this.locked || !this.q || this.q.base) return;
    const { voice } = this.app, q = this.q, kind = this.aidKind(q);
    this.locked = true; this.aide = true; pop(this.help); this.keys(false); voice.stop();
    await this.skippable("passer l'aide", async (g, dead) => {
      if (kind === "ligne") return this.lineAid(q, false, { g, dead });
      this.paintAid(q, false); await g(voice.say(this.aidSpeech(q, kind))); await g(wait(2200));
    });
    if (this.q !== q) return;
    this.keys(true); this.locked = false;
    voice.say(this.consigne(q));
  }
  // la tortue part du grand nombre et fait 1 ou 2 sauts (la ligne de 0 à 10, tous les nombres écrits) ;
  // `g`, `dead` : l'aide passée (skippable) arrête la voix, les sauts et range la ligne aussitôt
  async lineAid(q, solved, { g = (p) => p, dead = () => false } = {}) {
    const { voice, text, line } = this.app, nl = this.app.lineScreen(), big = Math.max(q.a, q.b), small = Math.min(q.a, q.b);
    this.keys(false); this.hermit?.play("montrer", { hold: 2000 });
    const spec = { x0: 150, x1: 1134, y: 452, n: 11, labels: Array.from({ length: 11 }, (_, i) => String(i)), k: 0, lit: [big] };
    const [bmp] = await g(line.render([spec])); line.show(bmp);
    nl.spec = spec; nl.q = { min: 0, max: 10, step: 1 }; nl.arcs = []; nl.overlay = []; line.fxClear();
    nl.turtle.sitOn(spec, big);
    try {
      await g(voice.say(fill(text.data.aideLigne, { a: big, sauts: small === 1 ? text.data.unSaut : `${small} ${text.data.sauts}` })));
      await g(nl.countJumps(big, big + small, { label: (k) => `+${k}`, say: (k) => String(k), stop: dead, guard: g }));
      await g(wait(solved ? 600 : 1600));
    } finally { nl.turtle.hide(); nl.arcs = []; line.fxClear(); line.clear(); }
  }
  // lot 3 : l'échauffement est passé pendant une question : elle est abandonnée (plus de réponse attendue)
  abandon() { this.locked = true; this.resolve = null; this.app.voice.stop(); this.app.aidBoard?.clear(); }
  leave() { this.show(false); this.q = null; this.defi = null; this.dictee = null; this.app.aidBoard?.clear(); }
}

// l'échauffement dans la séance : n faits (10 à 14), précédés, une séance sur cinq, des questions du temps de
// base ; la voie rapide peut en ajouter à la fin ; si la protection fait redescendre le cran, les faits
// nouveaux « bonus » du cran pas encore posés sont retirés (et les formes à trou suivent le nouveau cran)
// lot 3 (docs/SPEC-LOT3.md, section 4) : `skip(onSkip)` crée le bouton « passer » habituel, montré au début de
// l'échauffement (consigne et première question) ; un toucher l'arrête aussitôt et la séance enchaîne sur
// l'exercice (noté `echauffementPasse` dans l'enregistrement de la séance)
export async function runWarmup({ session, step, end, warmup, screen, intro, rnd = Math.random, skip = null }) {
  const [a, b] = step.questions, n = a + Math.floor(rnd() * (b - a + 1)), rest = warmup.questions(n, a);
  let skipped = false, abort = null; const abortP = new Promise((res) => { abort = res; });
  const btn = skip?.(() => { skipped = true; abort(); }), g = (p) => (btn ? Promise.race([p, abortP]) : p);
  if (btn) screen.beforeSubmit = () => { btn.remove(); screen.beforeSubmit = null; };
  screen.show(true); screen.keys(false);
  session.expect?.(rest.length);
  await g(intro?.(() => skipped));
  if (!skipped) screen.keys(true);
  while (!skipped && rest.length && !session.over(end)) {
    const q = warmup.prepare(rest.shift());
    if (!q) { session.expect?.(session.progress.faites + rest.length); continue; }
    const r = await g(screen.ask(q));
    if (skipped) break;
    const res = await warmup.record(q, r, rest);
    session.expect?.(session.progress.faites + 1 + rest.length); // un fait raté revient, la voie rapide en ajoute : des bulles de plus
    session.cranDown = false;
    await session.answered(res.juste);
    if (session.cranDown) warmup.drop(rest);
    await session.stars(res.etoiles, q.revient && res.juste ? "erreur corrigée" : "bonne réponse");
  }
  btn?.remove(); screen.beforeSubmit = null;
  if (skipped) { screen.abandon?.(); if (session.rec) session.rec.echauffementPasse = { apres: session.progress.faites }; }
  session.nouveaux = warmup.nouveaux; if (session.rec) session.rec.faitsNouveaux = warmup.nouveaux;
  // lot 2, étape 6 : une famille acquise est un niveau franchi (étoile arc-en-ciel) ; ouverture de la suivante
  for (const e of (await warmup.families?.()) ?? []) { if (e.type === "acquise" && !e.parent) await session.levelUp(); if (session.rec) (session.rec.familles ??= []).push(e); }
  screen.leave();
}
