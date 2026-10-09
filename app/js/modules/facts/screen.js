// MODULE 2 · L'ÉCRAN DE L'ÉCHAUFFEMENT. Une ardoise en haut (« 5 + 2 = ? », encré en direct), un pavé
// numérique géant en bas : deux rangées de cinq chiffres (0 à 4, 5 à 9, comme le cadre de dix), une
// touche pour effacer et la coche pour valider. Le coquillage, à gauche, montre l'aide de la famille
// (docs/SPEC.md, « Aide disponible ») : la tortue qui fait 1 ou 2 sauts sur la ligne (famille 1), le
// poisson et son reflet (famille 2). Un fait résolu avec l'aide n'avance pas de boîte.
import { TapGate } from "../../engine/toucher.js";
import * as R from "../../art/runtime.js";
import { onTap, spriteBox } from "../../session/screens.js";
import { fill } from "../numberline/screen.js";
import { clock, wait } from "../../engine/clock.js";
import { onBrief, skipKey } from "../../engine/ui.js";
import { aidFor, expected } from "./facts.js";
import { vary, varyIndex } from "./warmup.js";
import { AidBoard, paintBigDouble, paintDoublePlus, paintFishHouse, paintTenFrame, paintTwoFrames } from "./aids.js";

const SKIPPED = Symbol("correction passée");

const SLATE = [790, 222], KEY = 112, ROWS = [540, 668], COLS = [390, 508, 626, 744, 862], SIDE = 1010;
const pop = (el, cls = "pop") => { el.classList.remove("pop", "shake"); void el.offsetWidth; el.classList.add(cls); };

// la largeur utile de l'ardoise pour l'écriture du calcul (px de la scène)
const SLATE_W = 430;
export class FactsScreen {
  constructor(app, content) {
    this.app = app; this.c = content; this.typed = ""; this.locked = true; this.q = null; this.ring = false; this.els = [];
    const { sprites } = app;
    this.slate = spriteBox(app, { x: SLATE[0] - 295, y: SLATE[1] - 110, w: 590, h: 220, cls: "hud slate", still: true, paint: (ctx, px) => this.paintSlate(ctx, px) });
    // une touche : la bulle-réponse réduite (jamais agrandie) et son chiffre encré
    const key = (x, y, label, paint) => { const b = spriteBox(app, { x: x - KEY / 2, y: y - KEY / 2, w: KEY, h: KEY, cls: "bubble key", label, paint }); b.dataset.key = label; this.els.push(b); return b; };
    const small = (name, k) => (ctx, px) => { const q = sprites.frame(name, 0); ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (KEY / 2) * px + q.dx * k, (KEY / 2) * px + q.dy * k, q.w * k, q.h * k); return px; };
    const digits = [];
    for (let d = 0; d <= 9; d++) {
      const b = key(COLS[d % 5], ROWS[Math.floor(d / 5)], String(d), (ctx, px) => { small("reponse", 0.9)(ctx, px); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawNumber(ctx, String(d), KEY / 2, KEY / 2 - 25, 50, { w: 7, seed: 900 + d }); });
      onTap(b, () => this.type(String(d), b)); digits.push(b);
    }
    const del = key(SIDE, ROWS[0], "effacer", small("effacer", 0.8)), erase = () => { if (!this.typed || !this.tap("effacer")) return; pop(del); this.typed = this.typed.slice(0, -1); this.slate.repaint(); this.onTyped?.(this.typed); };
    onBrief(app, del, erase, "effacer", { first: true });
    const ok = key(SIDE, ROWS[1], "valider", small("valider", 0.7)), validate = () => { if (!this.typed || !this.tap("valider")) return; pop(ok); this.submit(); };
    ok.classList.add("check"); onBrief(app, ok, validate, "valider", { first: true });
    // (lot « Correctifs de la tablette », point 6) LE CLAVIER DE L'ORDINATEUR fait comme le pavé : les chiffres (pavé
    // numérique compris), « Retour arrière » efface, « Entrée » vaut la coche. Seulement quand le pavé est à l'écran (ni en
    // pause, ni pendant une visite, ni dans l'espace parent, qui a son propre clavier) ; mêmes règles que le toucher
    // (la porte du pavé : rien pendant un retour). Rien ne change sur la tablette.
    this.onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || app.parent?.root?.isConnected) return;
      const k = /^[0-9]$/.test(e.key) ? e.key : /^Numpad[0-9]$/.test(e.code) ? e.code.slice(6) : e.key === "Backspace" ? "effacer" : e.key === "Enter" ? "valider" : null;
      const b = k === "effacer" ? del : k === "valider" ? ok : k ? digits[Number(k)] : null;
      if (!b || !(b.checkVisibility ? b.checkVisibility({ visibilityProperty: true }) : getComputedStyle(b).visibility === "visible") || b.closest(".stash")) return;
      e.preventDefault();
      if (k === "effacer") erase(); else if (k === "valider") validate(); else this.type(k, b);
    };
    addEventListener("keydown", this.onKey);
    // (lot 3 ter, T3 : le pavé répond toujours au premier contact ; « effacer » et la coche montrent en plus leur étiquette à
    // l'appui long ; « je ne sais pas » et le coquillage d'aide valident au lever du doigt)
    // « je ne sais pas » (lot 1 bis) : compte comme une erreur (code NSP), montre la réponse, le fait revient
    this.nsp = spriteBox(app, { x: 1165 - 75, y: 604 - 75, w: 150, h: 150, cls: "bubble nsp", label: "je ne sais pas", paint: (ctx) => sprites.draw(ctx, "nsp", 0, 75, 75) });
    onBrief(app, this.nsp, () => { if (this.locked) return; pop(this.nsp); this.submit({ nsp: true }); }, "nsp");
    this.help = spriteBox(app, { x: 222 - 75, y: 580 - 75, w: 150, h: 150, cls: "bubble help", label: "aide", paint: (ctx) => sprites.draw(ctx, "aide", 0, 75, 75) });
    onBrief(app, this.help, () => this.showHelp(), "aide");
    this.show(false);
  }
  // (lot « Correctifs de la tablette », point 4 : l'ardoise n'apparaît qu'avec un calcul à montrer ; avant, elle restait vide
  // pendant les phrases d'annonce (« Maintenant, le calcul rapide ! », l'échauffement, le défi), derrière la bulle)
  show(v) { for (const e of [this.help, this.nsp, ...this.els]) e.style.visibility = v ? "visible" : "hidden"; this.showSlate(v); }
  showSlate(v = true) { this.slate.style.visibility = v && (this.q || this.slateQ) ? "visible" : "hidden"; }
  keys(v) { for (const e of [this.help, this.nsp, ...this.els]) e.style.visibility = v ? "visible" : "hidden"; }
  // l'ardoise : « a + b = » puis la case réponse (« ? » rouge, les chiffres tapés, ou la correction) ; formes à
  // trou (lot 2) : « a + ? = n » ou « ? + b = n », la case à la place du nombre qui manque
  paintSlate(ctx, px) {
    this.app.sprites.draw(ctx, "ardoise", 0, 295, 110);
    if (!this.q) return;
    ctx.setTransform(px, 0, 0, px, 0, 0);
    // (lot 3 : le calcul rapide, soustractions comprises : `q.op`, `q.n`)
    // (lot 3 bis, B4 : pendant un calcul guidé, l'ardoise garde le calcul demandé, `slateQ`, avec « ? » : les étapes
    // s'écrivent sur les cailloux du chemin)
    // (lot « Multiplication » : le signe « × » ; `q.addition`, l'addition répétée du niveau 1 : « 4 + 4 + 4 = ? »)
    const q = this.slateQ ?? this.q, n = q.n ?? q.a + q.b, f = q.forme ?? "directe", sg = q.op === "-" ? "−" : q.op === "×" ? "×" : "+";
    const [left, right] = q.dictee ? ["", ""] : q.addition && f === "directe" ? [`${Array(q.a).fill(q.b).join(" + ")} =`, ""] : f === "trouDroite" ? [`${q.a} ${sg}`, `= ${n}`] : f === "trouGauche" ? ["", `${sg} ${q.b} = ${n}`] : [`${q.a} ${sg} ${q.b} =`, ""];
    // (lot 3 bis : l'écriture se resserre si elle dépasserait de l'ardoise, « ? + 10 = 57 », « ? − 2 = 45 »)
    const slot = (this.slateQ ? "" : this.typed) || "?", W = (x) => (x ? R.wordWidth(x) : 0), u = W(left) + (left ? 0.4 : 0) + Math.max(1.36, W(slot)) + (right ? 0.4 : 0) + W(right);
    const em = Math.min(76, SLATE_W / u), lw = W(left) * em, rw = W(right) * em, sw = Math.max(1.36, W(slot)) * em, gap = 0.4 * em;
    const total = lw + (left ? gap : 0) + sw + (right ? gap : 0) + rw, x0 = 295 - total / 2;
    // (relecture du lot « Multiplication » : le trait suit la taille de l'écriture, sinon « 2 + 2 + 2 + 2 + 2 » écrasait ses signes)
    const sw0 = Math.min(10, em * 0.135);
    if (left) R.drawWord(ctx, left, x0 + lw / 2, 110 - em / 2, em, { w: sw0, seed: 950 });
    const sx = x0 + lw + (left ? gap : 0) + sw / 2;
    if (right) R.drawWord(ctx, right, sx + sw / 2 + gap + rw / 2, 110 - em / 2, em, { w: sw0, seed: 960 });
    if (this.ring) R.drawRing(ctx, sx, 110, 56);
    R.drawNumber(ctx, slot, sx, 110 - em / 2, em, { w: 10.5, color: slot !== "?" ? R.INK : R.RED, seed: 970 });
  }
  // lot 3 bis (A5) : la porte du pavé (un rebond de doigt sur la même touche est ignoré ; fermée pendant un retour)
  get gate() { return (this._gate ??= new TapGate(this.app.toucher ?? {})); }
  tap(key) { return !this.locked && this.gate.accept(key, performance.now()); }
  type(d, b) {
    if (!this.tap(d)) return; pop(b);
    const max = this.q?.dictee ? 5 : this.q?.module === 3 || this.q?.module === 5 ? 3 : 2; // (lot « Multiplication » : jusqu'à 100) // (le calcul rapide : jusqu'à 100) // deux chiffres au plus (les sommes vont jusqu'à 10) ; la dictée : cinq (3007, 30017 sont des erreurs à reconnaître)
    this.typed = (this.typed.length >= max ? "" : this.typed) + d;
    this.slate.repaint();
    this.onTyped?.(this.typed); // (lot 3 : le tableau de la dictée)
  }
  // pose la question et attend la réponse ; la promesse se résout après le retour
  ask(q) {
    const { voice } = this.app;
    this.q = q; this.typed = ""; this.ring = false; this.aide = false; this.locked = false; this.app.starFrom = SLATE; this.gate.open();
    this.help.style.visibility = q.base || q.cheminMode === "non" || q.image === "non" || q.pont ? "hidden" : "visible"; // pas d'aide pour « 4 + 0 » (lot 3 : ni sans chemin)
    this.slate.repaint(); this.showSlate(); pop(this.slate);
    // lot 2, étape 6 : un exemple guidé (l'appui visuel montre la réponse, on peut le passer), ou l'aide
    // affichée d'emblée (cran « plus facile » en notion du jour)
    const p = new Promise((res) => { this.resolve = res; });
    // (l'appui est rangé quand le pavé revient : il occupe la même place ; la multiplication remet ses petites rangées)
    const then = () => { this.app.aidBoard?.clear(); if (q.module === 5) this.mult?.paintBand(q); this.locked = false; this.keys(true); this.t0 = clock.now(); voice.say(this.consigne(q), { instruction: true }); };
    // (lot « Multiplication » : l'exemple guidé et l'aide d'emblée de la multiplication sont les siens, modules/mult/screen.js)
    if (q.guide) { this.locked = true; (q.module === 5 && this.mult ? this.mult.demo(q) : this.demo(q)).then(then); return p; }
    if (q.aideDEmblee && q.module === 5 && this.mult) { this.locked = true; this.keys(false); this.mult.autoAid(q).then(() => { this.locked = false; this.keys(true); this.t0 = clock.now(); voice.say(this.consigne(q), { instruction: true }); }); return p; }
    if (q.aideDEmblee && q.module !== 3) { this.locked = true; this.keys(false); this.autoAid(q).then(then); return p; }
    this.t0 = clock.now();
    voice.stop(); voice.say(this.consigne(q), { instruction: true });
    return p;
  }
  // ---------------------------------------------------------------- la dictée de nombres (lot 2, étape 8)
  // le module 1, niveau 12 : l'ardoise ne montre que le nombre tapé (ou « ? »), la voix dit la consigne ; la
  // réponse est rendue telle quelle à la coche (le retour est fait par modules/numberline/dictation.js)
  askNumber(q, consigne) {
    const { voice } = this.app;
    this.defi = null; this.dictee = consigne; this.q = { ...q, dictee: true }; this.typed = ""; this.ring = false; this.aide = false; this.locked = false; this.app.starFrom = SLATE; this.gate.open();
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
    this.defi = { apresErreurMs }; this.q = q; this.typed = ""; this.ring = false; this.aide = false; this.locked = false; this.app.starFrom = SLATE; this.gate.open();
    this.help.style.visibility = "hidden";
    this.slate.repaint(); this.showSlate(); pop(this.slate); this.t0 = clock.now();
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
  // (lot « Sommes jusqu'à 30 » : le reflet d'un double au-delà de 10 + 10, c'est le filet de dix et son reflet)
  aidKind(q) { const fam = this.c.familles.find((f) => f.id === q.famille)?.aide, k = q.appui ?? (fam && fam !== "fait" ? fam : aidFor(q.a, q.b)); return k === "reflet" && q.a > 10 ? "grandDouble" : k; }
  // lot « Sommes jusqu'à 30 » : les deux boîtes de dix. Forme directe (ou résolue) : le plus grand nombre d'abord (le 10 de
  // « 4 + 10 » aussi), puis les poissons de l'autre qui complètent la première boîte (entourés de lumière), le reste dans la
  // seconde ; forme à trou : le nombre connu en poissons, les places du nombre qui manque allumées (on les compte)
  framesOf(q, solved) {
    const f = solved ? "directe" : q.forme ?? "directe", n = q.a + q.b;
    if (f !== "directe") { const k = f === "trouDroite" ? q.a : q.b; return { first: k, second: n - k, places: true }; }
    const hi = Math.max(q.a, q.b); return { first: hi, second: n - hi, places: false };
  }
  paintFramesAid(ctx, q, solved) { const { sprites } = this.app, m = sprites.atlas.sprites["aide.cadre10"].meta; paintTwoFrames(ctx, sprites, 700 - m.w / 2, 350, this.framesOf(q, solved)); }
  get board() { return (this.app.aidBoard ??= new AidBoard(this.app)); }
  paintAid(q, solved) {
    const { sprites } = this.app, kind = this.aidKind(q), f = q.forme ?? "directe", n = q.a + q.b;
    const A = f === "trouGauche" && !solved ? "?" : q.a, B = f === "trouDroite" && !solved ? "?" : q.b, N = f === "directe" && !solved ? "?" : n;
    if (kind === "ligne") return kind;
    this.keys(false); this.hermit?.play("montrer", { hold: 2500 });
    this.board.draw((ctx) => {
      if (kind === "cadre") { const k = f === "trouGauche" ? q.b : q.a, rest = n - k; paintTenFrame(ctx, sprites, 700 - 228, 495, { n: k, extra: solved || f === "directe" ? rest : 0, glow: solved || f === "directe" ? [] : Array.from({ length: rest }, (_, i) => k + i) }); }
      else if (kind === "maison") this.paintHouseAid(ctx, q, solved, 0);
      else if (kind === "doublePlus") paintDoublePlus(ctx, sprites, Math.min(q.a, q.b), { cx: 700, y: 500, panel: Math.max(q.a, q.b) > 5 });
      else if (kind === "deuxCadres") this.paintFramesAid(ctx, q, solved);
      else if (kind === "grandDouble") paintBigDouble(ctx, sprites, q.a, { cx: 700, y: 372, k: 0.8, panel: true });
      else paintDoublePlus(ctx, sprites, q.a, { cx: 700, y: 500, bonus: false, panel: q.a > 5 }); // (au-delà de 5 + 5, sur nacre : relecture du lot « Sommes jusqu'à 30 »)
    });
    if (kind === "maison") this.animateHouse(q, solved);
    return kind;
  }
  // (lot 3 bis, B5 ; R5) la maison aux poissons : les poissons des deux nombres dans leurs pièces, puis ils montent se ranger
  // sous le toit (les places vides s'allument aux formes à trou) ; la famille 5 (et le mélange, à partir de 8) reçoit en
  // plus le cadre de 10, à droite de la maison, avec les mêmes poissons (docs/SPEC.md, « Maison et cadre de 10 »)
  withFrame(q) { const fam = this.c.familles.find((f) => f.id === q.famille); return !!fam?.cadreAussi || (fam?.aide === "fait" && q.a + q.b >= 8); }
  paintHouseAid(ctx, q, solved, t) {
    const { sprites } = this.app, f = solved ? "directe" : q.forme ?? "directe", n = q.a + q.b, frame = this.withFrame(q), cx = frame ? 470 : 700;
    paintFishHouse(ctx, sprites, cx, 545, { a: q.a, b: q.b, total: n, forme: f, t, roofLabel: f === "directe" && !solved ? "?" : n });
    if (frame) {
      const k = f === "trouGauche" ? q.b : q.a, known = f === "directe" ? n : k;
      paintTenFrame(ctx, sprites, 740, 450, { n: f === "trouGauche" ? 0 : q.a, extra: f === "directe" ? q.b : f === "trouGauche" ? q.b : 0, glow: f === "directe" ? [] : Array.from({ length: n - known }, (_, i) => known + i), fish: ["aide.poisson.0", "aide.poisson.1"] });
    }
  }
  async animateHouse(q, solved) {
    const k = this.app.vitesse ?? 1;
    let gen = this.board.gen;
    await wait(700 / k);
    for (let i = 1; i <= 20; i++) {
      if (this.board.gen !== gen) return;
      gen = this.board.draw((ctx) => this.paintHouseAid(ctx, q, solved, i / 20));
      await wait(55 / k);
    }
  }
  aidSpeech(q, kind, solved = false) {
    const t = this.app.text.data, k = q.forme === "trouGauche" ? q.b : q.a;
    // (lot 3 bis, R21 : « un poisson », jamais « 1 poissons »)
    // (lot « Sommes jusqu'à 30 » : les deux boîtes ; le grand double ; le reflet et le double + 1 jusqu'à 10)
    if (kind === "deuxCadres") { const F = this.framesOf(q, solved), c = 10 - F.first, r = F.second - c; return F.places ? fill(t.aideCadresTrou, { n: q.a + q.b }) : c === 0 ? fill(t.aideDix, { r }) : solved ? fill(t.aideDeuxCadresSolu, { c, r }) : t.aideDeuxCadres; }
    if (kind === "grandDouble") { const u = q.a - 10; return fill(t.aideGrandDouble, { a: q.a, u, d: 2 * u }); }
    return kind === "cadre" ? (k === 1 ? t.aideCadreUn : fill(t.aideCadre, { k })) : kind === "maison" ? (solved || (q.forme ?? "directe") === "directe" ? t.aideMaison : fill(t.aideMaisonTrou, { n: q.a + q.b })) : kind === "doublePlus" ? fill(t.aideDoublePlus, { d: Math.min(q.a, q.b) }) : q.a === 1 ? t.aideRefletUn : fill(t.aideReflet, { a: q.a });
  }
  // l'aide (coquillage, aide affichée d'emblée) peut être passée dès qu'elle commence (décision du parent du
  // 27 septembre) : le bouton « passer » habituel ; un toucher coupe la voix et l'animation, range l'appui et
  // rend le pavé aussitôt. `body(g, dead)` : `g` garde chaque attente, `dead()` dit si l'aide a été passée.
  async skippable(label, body) {
    let abort = null, dead = false; const abortP = new Promise((_, rej) => { abort = () => { dead = true; rej(SKIPPED); }; }); abortP.catch(() => {});
    const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), label);
    this.abortAid = () => abort(); // (lot 3 ter : l'échauffement passé pendant l'aide l'arrête, abandon)
    try { await body(g, () => dead); } catch (e) { if (e !== SKIPPED) throw e; this.app.voice.stop(); }
    finally { this.abortAid = null; skip.remove(); this.board.clear(); }
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
      else { this.paintAid(q, true); await g(voice.say(this.aidSpeech(q, kind, true))); }
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
    if (q.module === 3) return this.calc?.consigne(q) ?? `${q.a} ${q.op === "-" ? "moins" : "plus"} ${q.b} ?`; // lot 3 (calc/screen.js)
    if (q.module === 5) return this.mult?.consigne(q) ?? `${q.a} fois ${q.b} ?`; // lot « Multiplication » (mult/screen.js)
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
    const r = { value, ms, listens: voice.listens, aide: this.aide, nsp }, tok = this.tok;
    // lot 3 : le calcul rapide a sa correction (le chemin, le mur de corail et le poisson) et son retour « juste mais lent »
    if (q.module === 3 && this.calc) { await this.calc.feedback(q, r, ok); this.app.aidBoard?.clear(); const done = this.resolve; this.resolve = null; return done?.(r); }
    if (q.module === 5 && this.mult) { await this.mult.feedback(q, r, ok); this.app.aidBoard?.clear(); const done = this.resolve; this.resolve = null; return done?.(r); }
    ocean.mascotte.play(ok ? "rejouir" : "encourager");
    if (ok) this.app.sound?.play("bonne"); else if (!nsp) this.app.sound?.play("erreur");
    const answer = () => { this.typed = String(expected(q)); this.ring = true; this.slate.repaint(); };
    if (ok) { pop(this.slate); if (this.notion && (q.guide || q.revient)) this.hermit?.play("rejouir"); await voice.say(text.pick("bravo")); await wait(250); }
    else {
      let abort = null;
      const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
      const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer la correction");
      this.abortFix = () => abort(); // (lot 3 ter : l'échauffement passé pendant une correction l'arrête, abandon)
      try {
        if (nsp) await g(voice.say(text.data.faitNSP)); else { pop(this.slate, "shake"); await g(wait(500 / k)); }
        answer();
        // en notion du jour (lot 2, étape 6) : l'appui visuel de la famille, avec la réponse
        if (this.notion && !q.base) { const kind = this.aidKind(q); if (kind === "ligne") await g(this.lineAid(q, false, { g })); else { this.paintAid(q, true); await g(voice.say(this.aidSpeech(q, kind, true))); } }
        await g(voice.say(fill(text.data.faitCorrection, { a: q.a, b: q.b, n: q.a + q.b })));
        await g(wait(700 / k));
      } catch (e) {
        if (e !== SKIPPED) throw e;
        voice.stop();
        if (tok === this.tok) { r.correctionPassee = true; answer(); pop(this.slate); await wait(1000); }
      }
      this.abortFix = null; skip.remove();
    }
    if (tok !== this.tok) return; // l'échauffement a été passé pendant le retour : rien de plus à l'écran
    this.app.aidBoard?.clear();
    const done = this.resolve; this.resolve = null; done?.(r);
  }
  // ---------------------------------------------------------------- l'aide (coquillage)
  async showHelp() {
    if (this.locked || !this.q || this.q.base) return;
    // lot 3 : le coquillage du calcul rapide montre le chemin (les ponts), qui reste pendant la réponse
    if (this.q.module === 3 && this.calc) { if (this.aide) return; this.aide = true; pop(this.help); return this.calc.showHelp(this.q); }
    if (this.q.module === 5 && this.mult) { if (this.aide) return; this.aide = true; pop(this.help); return this.mult.showHelp(this.q); }
    const { voice } = this.app, q = this.q, kind = this.aidKind(q), tok = this.tok;
    this.locked = true; this.aide = true; pop(this.help); this.keys(false); voice.stop();
    await this.skippable("passer l'aide", async (g, dead) => {
      if (kind === "ligne") return this.lineAid(q, false, { g, dead });
      this.paintAid(q, false); await g(voice.say(this.aidSpeech(q, kind))); await g(wait(2200));
    });
    if (this.q !== q || tok !== this.tok) return;
    this.keys(true); this.locked = false;
    voice.say(this.consigne(q));
  }
  // la tortue part du grand nombre et fait 1 ou 2 sauts (la ligne de 0 à 10, tous les nombres écrits) ;
  // `g`, `dead` : l'aide passée (skippable) arrête la voix, les sauts et range la ligne aussitôt
  // (lot 3 bis, B5 ; R5) aux formes à trou, l'aide ne donne plus la réponse : la tortue part du nombre connu et saute jusqu'au
  // total demandé (« Compte les sauts avec la tortue jusqu'à 10. »), un « Hop ! » par saut, sans dire combien il y en a ;
  // à la forme directe, elle fait les sauts et l'enfant lit où elle arrive
  async lineAid(q, solved, { g = (p) => p, dead = () => false } = {}) {
    const { voice, text, line } = this.app, nl = this.app.lineScreen(), f = solved ? "directe" : q.forme ?? "directe";
    const trou = f !== "directe", big = trou ? (f === "trouDroite" ? q.a : q.b) : Math.max(q.a, q.b), small = trou ? q.a + q.b - big : Math.min(q.a, q.b), n = q.a + q.b;
    this.keys(false); this.hermit?.play("montrer", { hold: 2000 });
    const spec = { x0: 150, x1: 1134, y: 452, n: 11, labels: Array.from({ length: 11 }, (_, i) => String(i)), k: 0, lit: trou ? [big, n] : [big] };
    const [bmp] = await g(line.render([spec])); line.show(bmp);
    nl.spec = spec; nl.q = { min: 0, max: 10, step: 1 }; nl.arcs = []; nl.overlay = []; line.fxClear();
    nl.turtle.sitOn(spec, big);
    try {
      if (trou) {
        await g(voice.say(fill(text.data.aideLigneTrou, { n })));
        await g(nl.countJumps(big, n, { label: () => "+1", say: () => text.data.hop, stop: dead, guard: g }));
      } else {
        await g(voice.say(fill(text.data.aideLigne, { a: big, sauts: small === 1 ? text.data.unSaut : `${small} ${text.data.sauts}` })));
        await g(nl.countJumps(big, big + small, { label: (k) => `+${k}`, say: (k) => String(k), stop: dead, guard: g }));
      }
      await g(wait(solved ? 600 : 1600));
    } finally { nl.turtle.hide(); nl.arcs = []; line.fxClear(); line.clear(); }
  }
  // lot 3 : l'échauffement est passé pendant une question : elle est abandonnée (plus de réponse attendue)
  // (lot 3 ter : l'échauffement peut être passé à tout moment ; une correction ou une aide en cours s'arrête aussitôt, et
  // ce qui la suivait ne touche plus à l'écran : `tok`)
  abandon() { this.tok = (this.tok ?? 0) + 1; this.locked = true; this.resolve = null; this.abortFix?.(); this.abortAid?.(); this.app.voice.stop(); this.reset(); }
  leave() { this.show(false); this.q = null; this.defi = null; this.dictee = null; this.reset(); }
  // (correctif du 28 septembre 2026) rien de ce qu'un exercice quitté en cours a posé sur l'écran ne doit survivre : le
  // rappel de la saisie (le chemin d'un calcul guidé, le tableau de la dictée) redessinait l'ancien chemin au premier
  // chiffre tapé dans l'exercice suivant ; la saisie, l'anneau, l'aide et le « passer » de l'échauffement sont remis à zéro
  reset() { this.slateQ = null; this.onTyped = null; this.beforeSubmit = null; this.typed = ""; this.ring = false; this.aide = false; this.locked = true; this.app.aidBoard?.clear(); this.slate?.repaint(); }
}

// l'échauffement dans la séance : n faits (10 à 14), précédés, une séance sur cinq, des questions du temps de
// base ; la voie rapide peut en ajouter à la fin ; si la protection fait redescendre le cran, les faits
// nouveaux « bonus » du cran pas encore posés sont retirés (et les formes à trou suivent le nouveau cran)
// lot 3 (docs/SPEC-LOT3.md, section 4) : `skip(onSkip)` crée le bouton qui passe l'échauffement ; la séance enchaîne sur
// l'exercice (noté `echauffementPasse` dans l'enregistrement de la séance). Lot 3 ter (T1) : un bouton dédié, présent
// pendant TOUT l'échauffement (il ne disparaît plus à la première réponse), avec une confirmation par la coche
// (modules/facts/warmupskip.js) : `onSkip` n'est appelé qu'une fois la coche touchée
export async function runWarmup({ session, step, end, warmup, screen, intro, rnd = Math.random, skip = null }) {
  const [a, b] = step.questions, n = a + Math.floor(rnd() * (b - a + 1)), rest = warmup.questions(n, a);
  let skipped = false, abort = null; const abortP = new Promise((res) => { abort = res; });
  const btn = skip?.(() => { skipped = true; abort(); }), g = (p) => (btn ? Promise.race([p, abortP]) : p);
  screen.show(true); screen.keys(false);
  session.expect?.(rest.length);
  await g(intro?.(() => skipped));
  if (!skipped) screen.keys(true);
  const answers = []; // (lot 3 ter : jamais 3 fois de suite la même réponse, warmup.js, varyIndex)
  while (!skipped && rest.length && !session.over(end)) {
    const q = warmup.prepare(rest.splice(varyIndex(rest, answers), 1)[0]);
    if (q) vary(q, answers);
    if (!q) { session.expect?.(session.progress.faites + rest.length); continue; }
    const r = await g(screen.ask(q));
    if (skipped) break;
    if (!q.base) answers.push(expected(q));
    const res = await warmup.record(q, r, rest);
    session.expect?.(session.progress.faites + 1 + rest.length); // un fait raté revient, la voie rapide en ajoute : des bulles de plus
    session.cranDown = false;
    await session.answered(res.juste);
    if (session.cranDown) warmup.drop(rest);
    await session.stars(res.etoiles, q.revient && res.juste ? "erreur corrigée" : "bonne réponse");
  }
  btn?.remove();
  if (skipped) { screen.abandon?.(); if (session.rec) session.rec.echauffementPasse = { apres: session.progress.faites }; }
  session.nouveaux = warmup.nouveaux; if (session.rec) session.rec.faitsNouveaux = warmup.nouveaux;
  // lot 2, étape 6 : une famille acquise est un niveau franchi (étoile arc-en-ciel) ; ouverture de la suivante
  for (const e of (await warmup.families?.()) ?? []) { if (e.type === "acquise" && !e.parent) await session.levelUp(); if (session.rec) (session.rec.familles ??= []).push(e); }
  screen.leave();
}
