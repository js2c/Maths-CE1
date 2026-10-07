// MODULE 5 · L'ÉCRAN DE LA MULTIPLICATION (lot « Multiplication » ; docs/SPEC.md, section 7 ter). Le même écran que les
// additions (l'ardoise, le pavé, « je ne sais pas », le coquillage, réécouter : modules/facts/screen.js), comme le calcul
// rapide, avec ce qui est propre à la multiplication :
//  - LES RANGÉES : « a × b », ce sont a rangées de b poissons, dessinées en direct sur le calque des aides avec les poissons des
//    aides (planche « aides ») : en petit au-dessus du pavé pendant la question (niveaux 1 et 2, a et b jusqu'à 5), en grand à
//    la place du pavé pour l'aide (coquillage), l'aide d'emblée, l'exemple guidé et la correction ;
//  - en grand, les rangées se comptent une à une : chaque rangée s'allume (les poissons deviennent orange), le total écrit au
//    bout de la rangée et dit (« 4… 8… 12 ») ; puis « 3 fois 4, ça fait 12. » ;
//  - « tourner » (niveau 6) : la multiplication donnée est écrite sur une plaque (« 3 × 7 = 21 »), on demande son tour ;
//  - la correction : M1 (a additionné) a sa phrase, puis les rangées comptées ; « passer » dès le début, comme partout.
import * as R from "../../art/runtime.js";
import { fill } from "../numberline/screen.js";
import { wait } from "../../engine/clock.js";
import { skipKey } from "../../engine/ui.js";
import { num, put, putScaled } from "../facts/aids.js";
import { astuceOf, classifyMult, multAnswer } from "./mult.js";

const SKIPPED = Symbol("passé");
// la place des rangées : en petit, la bande entre l'ardoise et le pavé ; en grand, à la place du pavé
export const ROWS_SMALL = { cx: 790, top: 342, h: 136, w: 640 }, ROWS_BIG = { cx: 700, top: 350, h: 430, w: 820 };
const FISH = { w: 64, h: 44 };

// les rangées : a rangées de b poissons, centrées dans la zone Z ; `lit` : les rangées allumées (comptées), `totals` : le total
// écrit au bout de chaque rangée allumée ; `ghost` : les rangées d'un nombre qui manque, en places vides (formes à trou)
export function rowsLayout(a, b, Z) {
  const pitchX = Math.min(FISH.w, Z.w / Math.max(1, b + 1.2)), pitchY = Math.min(FISH.h + 6, Z.h / Math.max(1, a)), k = Math.min(1, pitchX / FISH.w, pitchY / (FISH.h + 6));
  const w = (b - 1) * pitchX, h = (a - 1) * pitchY, x0 = Z.cx - w / 2 - pitchX * 0.4, y0 = Z.top + (Z.h - h) / 2;
  return { k, at: (i, j) => [x0 + j * pitchX, y0 + i * pitchY], end: (i) => [x0 + b * pitchX + 10, y0 + i * pitchY], pitchX, pitchY };
}
export function paintRows(ctx, sprites, a, b, Z, { lit = 0, totals = false, ghost = false } = {}) {
  const L = rowsLayout(a, b, Z);
  for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) {
    const [x, y] = L.at(i, j);
    if (ghost) putScaled(ctx, sprites, "aide.cadre.lueur", x, y, L.k * 0.5);
    else putScaled(ctx, sprites, i < lit ? "aide.poisson.0" : "aide.poisson.1", x, y, L.k);
  }
  if (totals) for (let i = 0; i < Math.min(lit, a); i++) { const [x, y] = L.end(i); num(ctx, (i + 1) * b, x + 18, y, Math.max(22, 34 * L.k), R.INK); }
  return L;
}

export class MultScreen {
  // facts : () => l'écran des additions (FactsScreen), qui prête l'ardoise et le pavé
  constructor(app, facts) { this.app = app; this.facts = facts; }
  get fs() { const fs = this.facts(); fs.mult = this; return fs; }
  get board() { return this.fs.board; }
  get T() { return this.app.text.data; }
  rangees(a, b) { const T = this.T; return a === 1 ? fill(T.multRangee1, { b }) : b === 1 ? fill(T.multRangeesUn, { a }) : fill(T.multRangees, { a, b }); }
  consigne(q) {
    const T = this.T;
    if (q.addition) return `${this.rangees(q.a, q.b)} ${T.multCombien}`;
    if (q.forme === "trouDroite") return fill(T.multTrouDroite, { a: q.a, n: q.n });
    if (q.forme === "trouGauche") return fill(T.multTrouGauche, { b: q.b, n: q.n });
    if (q.tour) return `${fill(T.multCorrection, { a: q.tour.a, b: q.tour.b, n: q.n })} ${fill(T.multEt, { a: q.a, b: q.b })}`;
    return fill(T.multFois, { a: q.a, b: q.b });
  }
  // ce que montre la bande au-dessus du pavé pendant la question : les rangées en petit (niveaux 1 et 2), la plaque du tour
  paintBand(q) {
    const { sprites } = this.app;
    this.board.draw((ctx) => {
      if (q.tour) { const t = `${q.tour.a} × ${q.tour.b} = ${q.n}`, em = 44, w = R.wordWidth(t) * em + 60; R.drawPanel(ctx, ROWS_SMALL.cx - w / 2, 372, w, em + 40); R.drawWord(ctx, t, ROWS_SMALL.cx, 392, em, { w: 6.5, seed: 9600 }); }
      else if (q.image === "toujours" && (q.forme ?? "directe") === "directe") paintRows(ctx, sprites, q.a, q.b, ROWS_SMALL);
    });
  }
  async askNotion(q) {
    const fs = this.fs; fs.show(true); this.board.clear();
    await this.app.sprites.load("aides");
    this.paintBand(q);
    const r = await fs.ask(q), code = r.nsp ? "NSP" : r.value === multAnswer(q) ? null : classifyMult(q, r.value);
    return { ...r, q, ok: code === null, code, aide: r.aide || !!q.aideDEmblee };
  }
  // les rangées en grand, comptées rangée par rangée (la voix dit chaque total) ; `g` garde chaque attente (« passer »)
  async count(q, g, { say = true } = {}) {
    const { sprites, voice } = this.app, k = this.app.vitesse ?? 1, a = q.a, b = q.b;
    this.fs.keys(false);
    const draw = (lit) => this.board.draw((ctx) => paintRows(ctx, sprites, a, b, ROWS_BIG, { lit, totals: true }));
    draw(0);
    if (say) await g(voice.say(this.rangees(a, b)));
    const t = astuceOf(q); if (say && t) await g(voice.say(this.T.multAstuce[t]));
    for (let i = 1; i <= a; i++) { draw(i); this.app.sound?.play("bouton"); await g(voice.say(String(i * b))); await g(wait(150 / k)); }
  }
  // l'aide (coquillage) : les rangées comptées ; puis le pavé revient, la consigne redite
  async showHelp(q) {
    const fs = this.fs, { voice } = this.app;
    if (q.forme && q.forme !== "directe") {
      // à trou : les rangées du nombre connu, les places du nombre qui manque (« 3 × ? = 12 » : 3 rangées de places, 12 en tout)
      fs.locked = true; voice.stop();
      await fs.skippable("passer l'aide", async (g) => {
        fs.keys(false);
        this.board.draw((ctx) => paintRows(ctx, this.app.sprites, q.forme === "trouDroite" ? q.a : q.b, q.forme === "trouDroite" ? q.b : q.a, ROWS_BIG, { ghost: true }));
        await g(voice.say(fill(this.T.multAideTrou, { n: q.n })));
        await g(wait(1400));
      });
    } else {
      fs.locked = true; voice.stop();
      await fs.skippable("passer l'aide", async (g) => { await this.count({ ...q }, g); await g(wait(900)); });
    }
    if (fs.q !== q) return;
    this.paintBand(q); fs.keys(true); fs.locked = false;
    voice.say(this.consigne(q));
  }
  // le cran « plus facile » : les rangées comptées d'emblée, sans la réponse dite, puis le pavé
  async autoAid(q) {
    const fs = this.fs, { voice } = this.app;
    voice.stop(); voice.say(this.consigne(q));
    await fs.skippable("passer l'aide", async (g) => { await g(wait(400)); await this.count(q, g); await g(wait(1200)); });
    this.paintBand(q);
  }
  // un exemple guidé : les rangées comptées, la réponse dite, puis « À toi ! »
  async demo(q) {
    const fs = this.fs, { voice } = this.app, T = this.T, k = this.app.vitesse ?? 1;
    fs.keys(false); voice.stop();
    let abort = null; const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
    const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer l'exemple");
    try {
      await this.count(q, g);
      fs.write(multAnswer(q)); await g(voice.say(fill(T.multCorrection, { a: q.a, b: q.b, n: q.n })));
      await g(wait(500 / k)); await g(voice.say(T.aToiFait));
    } catch (e) { if (e !== SKIPPED) throw e; voice.stop(); q.passe = true; }
    skip.remove(); this.paintBand(q);
  }
  // après la réponse (FactsScreen.submit) : bravo, ou la correction (la phrase de l'erreur, les rangées comptées, le calcul)
  async feedback(q, r, ok) {
    const fs = this.fs, { voice, text, ocean, sound } = this.app, T = this.T, k = this.app.vitesse ?? 1;
    ocean.mascotte.play(ok ? "rejouir" : "encourager");
    if (ok) sound?.play("bonne"); else if (!r.nsp) sound?.play("erreur");
    const answer = () => { fs.typed = String(multAnswer(q)); fs.ring = true; fs.slate.repaint(); };
    if (ok) { fs.slate.classList.add("pop"); await voice.say(text.pick("bravo")); await wait(250); return; }
    let abort = null; const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
    const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer la correction");
    try {
      const code = r.nsp ? "NSP" : classifyMult(q, r.value);
      if (!r.nsp) fs.slate.classList.add("shake");
      answer();
      await g(voice.say(r.nsp ? T.faitNSP : code === "M1" ? T.erreurMult.M1 : T.faitNSP));
      await this.count(q, g, { say: true });
      await g(voice.say(fill(T.multCorrection, { a: q.a, b: q.b, n: q.n })));
      await g(wait(600 / k));
    } catch (e) {
      if (e !== SKIPPED) throw e;
      voice.stop(); r.correctionPassee = true; answer(); await wait(1000);
    } finally { skip.remove(); fs.keys(true); }
  }
  leave() { this.board?.clear(); this.facts().leave(); }
}
void put;
