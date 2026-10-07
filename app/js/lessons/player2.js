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
// Lot 2, étape 8 : la leçon L10 (les centaines, `scene: "centaines"`, module 1 : sans le bernard-l'ermite ; planche
// « centaines ») : filet (un filet de dix poissons) ; chalut k (le chalut avec k filets dedans) ; remplir k (un
// filet de plus entre dans le chalut, le compteur montre k × 10) ; chaluts n (le nombre n décomposé : chaluts,
// filets, poissons seuls et leurs chiffres) ; nombre { v, couleur, clignote } (le nombre écrit en grand, un
// chiffre en couleur, ou qui clignote : numéros des chiffres depuis la gauche).
// Lot 3, étape 4 : les leçons L7 à L9 du calcul rapide (`module: 3`, sans le bernard-l'ermite ; planches « calcul » et
// « aides ») : mur { construire } (le mur de corail, rangée par rangée si `construire`) ; poisson n (le petit poisson jaune
// se pose sur la case n, ou sur la graduation n de la ligne) ; nager n (il y nage) ; allumer [n…] (les cases allumées) ;
// couleurs true|false (les dizaines en corail, les unités en bleu) ; ligne { min, max } (une ligne de 1 en 1) ; sauts n
// (le poisson saute de graduation en graduation jusqu'à n, un arc par saut) ; pont n (lot 3 bis : un seul grand saut jusqu'à n, marqué « + k »).
import * as R from "../art/runtime.js";
import { onBrief } from "../engine/ui.js";
import { onTap, spriteBox } from "../session/screens.js";
import { skipKey } from "../engine/ui.js";
import { wait } from "../engine/clock.js";
import { Hermit } from "../engine/hermit.js";
import { AidBoard, num, paintHouse, paintHundreds, paintTenFrame, paintTwoFrames, put, putScaled } from "../modules/facts/aids.js";
import { WallFish } from "../modules/calc/wallfish.js";

const ABORT = Symbol("leçon interrompue");
const REPLAY_AT = [1205, 372]; // (lot 3 bis, R23 : sous « passer », plus à la place de « je ne sais pas »)
const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
const EMPTY = () => ({ miroir: null, cadre: null, cadres: null, maison: null, ecrit: null, filet: false, chalut: null, compteur: null, chaluts: null, nombre: null, mur: null, ligne: null, arcs: [] });
// lot 3 : le mur de corail et la ligne des leçons L7 à L9
// (lot 3 bis, R18 : la ligne s'arrête avant « rejouer », qui coupait le dernier nombre)
export const LESSON_WALL = { x: 580, y: 150, cell: 42, gap: 3 }, LESSON_LINE = { x0: 330, x1: 1040, y: 610 };

export class Lesson2Player {
  constructor(app, content) { this.app = app; this.c = content; this.tok = 0; this.keys = null; }
  get board() { return (this.app.aidBoard ??= new AidBoard(this.app)); }
  async play(id) {
    const { app } = this, lesson = this.c[id], t0 = Date.now(), stats = { rejouees: 0 };
    if (!lesson) return { vue: false };
    app.facts?.show(false);
    this.guide = lesson.module === 2; // le bernard-l'ermite est le guide du module 2 seulement
    await Promise.all(this.guide ? [app.sprites.load("ermite"), app.sprites.load("aides")] : lesson.module === 3 ? [app.sprites.load("calcul"), app.sprites.load("aides")] : [app.sprites.load("centaines"), app.sprites.load("aides")]);
    if (lesson.module === 3) this.fish ??= new WallFish(app);
    this.own = false; this.h = null; this.back = null;
    if (this.guide) {
      // le bernard-l'ermite : celui de la notion du jour, sinon le sien (entraînement libre)
      // pendant la leçon, il vient au milieu du sable, en grand ; il retrouve sa place ensuite
      this.own = !app.hermit; this.h = app.hermit ?? new Hermit(app.ocean, { x: 150, y: 776, scale: 0.85 }); this.h.show(true);
      this.back = [this.h.x, this.h.y, this.h.s]; this.h.at(300, 780, 1);
      if (this.own) this.h.play("sortir");
    }
    this.p = 0; this.skipped = false; this.abort = null; this.goto = undefined;
    const jump = (to) => { this.goto = to; app.voice.stop(); if (this.abort) this.abort(); else this.p = to; };
    const again = spriteBox(app, { x: REPLAY_AT[0] - 70, y: REPLAY_AT[1] - 70, w: 140, h: 140, cls: "bubble lessonkey rejouer", label: "rejouer la leçon", paint: (ctx) => app.sprites.draw(ctx, "rejouer", 0, 70, 70) });
    onBrief(this.app, again, () => { if (!this.abort) return; pop(again); stats.rejouees++; jump(0); }, "rejouer");
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
    if (!this.skipped) { app.ocean.mascotte.play("rejouir"); this.h?.play("rejouir"); await wait(600); }
    this.clear();
    return { vue: !this.skipped, passee: this.skipped, dureeS: Math.round((Date.now() - t0) / 1000), ...stats };
  }
  g(p) { return Promise.race([p, this.abortP]); }
  async phrase(p) {
    const { voice, ocean } = this.app;
    ocean.mascotte.hold("montrer"); this.app.fleche?.cacher();
    for (const beat of this.lesson.phrases[p]) {
      const said = beat.dire ? voice.say(beat.dire, { instruction: true }) : Promise.resolve();
      const done = (async () => { for (const a of beat.faire ?? []) await this.g(this.act(a)); })();
      await this.g(Promise.all([said, done]));
    }
    ocean.mascotte.release(); this.app.fleche?.cacher();
  }
  async act(a) {
    const [[name, v]] = Object.entries(a), st = this.st;
    if (name === "ermite") { if (!this.h) return; const p = this.h.play(v, { hold: 1800 }); if (v === "changer") await p; return; }
    // L10, les centaines
    if (name === "filet") { st.filet = !!v; return this.paint(); }
    if (name === "chalut") { st.filet = false; st.chalut = v; st.compteur = null; return this.paint(); }
    if (name === "remplir") { st.filet = false; st.chalut = v; st.compteur = v * 10; this.app.sound?.play("bouton"); return this.paint(); }
    if (name === "chaluts") { st.filet = false; st.chalut = null; st.compteur = null; st.chaluts = v; return this.paint(); }
    if (name === "nombre") {
      // (lot 3 bis, R20 : le nombre écrit en grand remplace le compteur du chalut : « 100 » n'est plus écrit deux fois)
      st.compteur = null; st.nombre = { ...v, cache: false }; this.paint();
      if (v.clignote !== undefined) for (let i = 0; i < 6; i++) { await wait(320); st.nombre.cache = !st.nombre.cache; this.paint(); }
      st.nombre.cache = false; return this.paint();
    }
    // lot 3 : le mur de corail, la ligne des leçons L7 à L9 et le petit poisson
    if (name === "mur") {
      st.mur = { upTo: v.construire ? 0 : 100, lit: [], split: false }; st.ecrit = null; st.ligne = null; this.paint();
      if (v.construire) for (let r = 1; r <= 10; r++) { st.mur.upTo = r * 10; this.paint(); this.app.sound?.play("bouton"); await wait(300); }
      return;
    }
    if (name === "allumer") { if (st.mur) { st.mur.lit = v; this.paint(); } return; }
    if (name === "couleurs") { if (st.mur) { st.mur.split = v; this.paint(); } return; }
    if (name === "ligne") { st.ligne = v; st.arcs = []; st.mur = null; this.paint(); return; }
    if (name === "poisson" || name === "nager") {
      const p = this.fishAt(v); if (!p) return;
      // (lot « Mascotte ») le petit poisson posé : la flèche le montre, jusqu'à la fin de la phrase
      // (sur le mur, la flèche est posée au bord gauche de la grille, à la hauteur du poisson, pointée vers lui : au-dessus de sa
      // case, elle cachait les nombres de la colonne, relecture du lot)
      if (name === "poisson" || !this.fish.a.vis) { this.fish.at(...p); this.fishN = v; if (name === "poisson") this.app.fleche?.montrer(st.mur ? [LESSON_WALL.x - 6, p[1]] : [p[0], p[1] - 34], { angle: st.mur ? -90 : 0 }); return; }
      const from = this.fishN; this.fishN = v;
      // sur le mur : d'abord les rangées (± 10), puis les cases (± 1)
      if (st.mur && Math.floor((from - 1) / 10) !== Math.floor((v - 1) / 10) && (from - 1) % 10 !== (v - 1) % 10) { await this.fish.swim(...this.fishAt(from + 10 * (Math.floor((v - 1) / 10) - Math.floor((from - 1) / 10))), 700); }
      return this.fish.swim(...p, 700);
    }
    // (lot 3 bis, B9 : L9 en deux tableaux) un pont : le poisson saute d'un coup jusqu'à n, un grand arc marqué « + k »
    if (name === "pont") {
      const a = this.fishN, k = v - a; st.arcs.push([a, v, `+${k}`]); this.paint(); await this.fish.swim(...this.fishAt(v), 800); this.fishN = v; this.app.sound?.play("bouton"); return;
    }
    if (name === "sauts") {
      while (this.fishN < v) { const a = this.fishN, b = a + 1; st.arcs.push([a, b]); this.paint(); await this.fish.swim(...this.fishAt(b), 420); this.fishN = b; this.app.sound?.play("bouton"); await wait(120); }
      return;
    }
    if (name === "attendre") return wait(v);
    if (name === "effacer") { this.st = EMPTY(); this.fish?.a.show(false); return this.paint(); }
    if (name === "miroir") { st.miroir = v; st.cadre = null; st.maison = null; return this.paint(); }
    if (name === "ecrire") { st.ecrit = v; return this.paint(); }
    if (name === "defiler") { for (const [x, y] of v) { st.ecrit = `${x} + ${y} = ${x + y}`; this.paint(); await wait(950); } return; }
    if (name === "cadre") { st.cadre = { n: 0, extra: 0, lueur: [], ...v }; st.miroir = null; return this.paint(); }
    // lot « Sommes jusqu'à 30 » (L11, L12) : deux boîtes de dix ; les poissons entrent, puis sautent compléter la première
    if (name === "cadres") { st.cadres = { a: 0, b: 0, moved: 0, lueur: [], ...v }; st.cadre = null; st.miroir = null; st.maison = null; return this.paint(); }
    if (name === "entrer" && st.cadres) { const c = st.cadres; while (c.a < v) { c.a++; this.paint(); this.app.sound?.play("bouton"); await wait(220); } return; }
    if (name === "entrerB") { const c = st.cadres ?? (st.cadres = { a: 0, b: 0, moved: 0, lueur: [] }); while (c.b < v) { c.b++; this.paint(); this.app.sound?.play("bouton"); await wait(260); } return; }
    if (name === "sauter") { const c = st.cadres; if (!c) return; c.lueur = []; while (c.moved < v) { c.moved++; this.paint(); this.app.sound?.play("bouton"); await wait(520); } return; }
    if (name === "entrer") { const c = st.cadre ?? (st.cadre = { n: 0, extra: 0, lueur: [] }); while (c.n < v) { c.n++; this.paint(); this.app.sound?.play("bouton"); await wait(260); } return; }
    if (name === "maison") { st.maison = v; st.miroir = null; st.cadre = null; return this.paint(); }
  }
  // l'état de la scène, dessiné une fois (le calque des aides)
  paint() {
    // (lot « Les leçons » : une leçon passée pendant une animation, « entrer » par exemple, ne peint plus rien une fois
    // terminée ; sinon le cadre restait dessiné derrière l'écran « À toi ! »)
    if (!this.keys) return;
    const { sprites } = this.app, st = this.st;
    this.board.draw((ctx) => {
      if (st.miroir) paintMirror(ctx, sprites, st.miroir, 700, 470);
      if (st.cadre) paintTenFrame(ctx, sprites, 700 - 228, 400, { n: st.cadre.n, extra: st.cadre.extra ?? 0, glow: st.cadre.lueur ?? [] });
      if (st.maison) paintHouse(ctx, sprites, 700, 400, st.maison.total, st.maison.etages ?? []);
      if (st.cadres) paintTwoFrames(ctx, sprites, 700 - 228, 340, { first: st.cadres.a, second: st.cadres.b, moved: st.cadres.moved, glow: st.cadres.lueur ?? [] });
      // lot 3 : le mur de corail, la ligne de L9 (et ses arcs)
      if (st.mur) R.drawWall(ctx, { ...LESSON_WALL, lit: st.mur.lit, split: st.mur.split, upTo: st.mur.upTo });
      if (st.ligne) { const L = this.lineSpec(); R.drawLine(ctx, L); for (const [a, b, label] of st.arcs) R.drawJumpArc(ctx, R.tickP(L, a - st.ligne.min), R.tickP(L, b - st.ligne.min), 1, { label: label ?? "+1" }); }
      // (lot 3 bis, R20 : les égalités et le nombre en grand sont posés sur une plaque de nacre : les poissons du décor passent
      // derrière elle, plus à travers l'écriture)
      if (st.ecrit) { const em = 64, y = st.mur ? 700 : 262, w = R.wordWidth(st.ecrit) * em + 70; R.drawPanel(ctx, 720 - w / 2, y - em / 2 - 26, w, em + 52); R.drawWord(ctx, st.ecrit, 720, y - em / 2, em, { w: 9, seed: 990 }); }
      // L10 (les centaines)
      if (st.filet) putScaled(ctx, sprites, "aide.filet", 560, 330, 1.4);
      if (st.chalut !== null) { putScaled(ctx, sprites, "aide.chalut", 640, 250, 1, st.chalut); if (st.compteur !== null) num(ctx, st.compteur, 960, 400, 84); }
      if (st.chaluts !== null) paintHundreds(ctx, sprites, st.chaluts, 700, 300, { lit: st.nombre?.couleur ?? null, fit: [380, 990] });
      if (st.nombre) { const w = R.wordWidth(String(st.nombre.v)) * 96 + 90; R.drawPanel(ctx, 700 - w / 2, 200 - 48 - 30, w, 96 + 56); paintBigNumber(ctx, st.nombre, 700, 200); }
    });
  }
  // la ligne de L9 : de 1 en 1, tous les nombres écrits
  lineSpec() { const { min, max } = this.st.ligne, n = max - min + 1; return { ...LESSON_LINE, n, labels: Array.from({ length: n }, (_, i) => String(min + i)), k: 1 }; }
  // où se pose le poisson : la case n du mur, ou la graduation n de la ligne (un peu au-dessus)
  fishAt(n) {
    if (this.st.mur) return R.wallCell({ ...LESSON_WALL }, n);
    if (this.st.ligne) { const [x, y] = R.tickP(this.lineSpec(), n - this.st.ligne.min); return [x, y - 30]; }
    return null;
  }
  abandon() { if (!this.keys) return; this.tok++; this.abort = null; this.keys.forEach((k) => k.remove()); this.keys = null; this.clear(); }
  clear() {
    this.app.aidBoard?.clear(); this.app.fleche?.cacher(); this.app.ocean.mascotte.release();
    if (this.fish) { this.fish.remove(); this.fish = null; }
    if (this.own) { this.h?.remove(); this.app.sprites.unload("ermite"); } else if (this.h && this.back) { this.h.left = null; this.h.at(...this.back); } // (l'ancienne coquille reste dans la leçon)
    this.h = null;
  }
}
// un nombre écrit en grand, chiffre par chiffre : `couleur` (numéro du chiffre depuis la gauche) en rouge,
// `clignote` : ce chiffre caché une fois sur deux (st.cache)
export function paintBigNumber(ctx, { v, couleur, clignote, cache }, cx, cy, em = 96) {
  const t = String(v), w = t.split("").map((ch) => R.wordWidth(ch) * em), gap = em * 0.12, total = w.reduce((a, b) => a + b, 0) + gap * (t.length - 1);
  let x = cx - total / 2;
  t.split("").forEach((ch, i) => { if (!(cache && i === clignote)) R.drawNumber(ctx, ch, x + w[i] / 2, cy - em / 2, em, { w: em * 0.13, color: i === couleur || i === clignote ? R.RED : undefined, seed: 1000 + i }); x += w[i] + gap; });
}

// un poisson devant un miroir (une ligne de lumière verticale), son reflet de l'autre côté, n bulles de chaque côté
export function paintMirror(ctx, sprites, n, cx, cy) {
  const glow = [[cx, cy - 150], [cx + 6, cy], [cx, cy + 150]];
  ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = "#e8fffb"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(...glow[0]); ctx.quadraticCurveTo(...glow[1], ...glow[2]); ctx.stroke(); ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = "#ffffff"; ctx.stroke(); ctx.restore();
  put(ctx, sprites, "poisson.0.d", cx - 110, cy + 30); put(ctx, sprites, "poisson.0.g", cx + 110, cy + 30);
  for (let i = 0; i < n; i++) { const dy = -60 - i * 46, dx = 40 + (i % 2) * 22; put(ctx, sprites, "aide.bulle.doree", cx - dx - 60, cy + dy); put(ctx, sprites, "aide.bulle.doree", cx + dx + 60, cy + dy); }
  void num;
}
