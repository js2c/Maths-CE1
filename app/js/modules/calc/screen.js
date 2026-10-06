// MODULE 3 · L'ÉCRAN DU CALCUL RAPIDE (lot 3, docs/SPEC-LOT3.md, section 6) : le même écran que les additions (l'ardoise,
// le pavé, « je ne sais pas », le coquillage d'aide, réécouter : modules/facts/screen.js), avec ce qui est propre au calcul :
//  - le CHEMIN (les ponts : 38 → + 2 → 40 → + 3 → 43), dessiné en direct sur le calque des aides (runtime.js :
//    drawStone, drawBridge) : en petit au-dessus du pavé quand il aide à répondre (coquillage, cran « plus facile »,
//    calculs guidés), en grand à la place du pavé pour montrer la procédure (correction, juste mais lent) ;
//  - les calculs guidés (`q.remplir`) : l'enfant remplit chaque caillou, pont après pont (« Plus 2 ? ») ;
//  - la correction : la phrase de l'erreur type (C1 à C5), puis la procédure : sur le MUR DE CORAIL (niveaux 2, 3, 6, 8 :
//    le petit poisson jaune descend d'une rangée pour + 10, glisse d'une case pour ± 1) ou sur le chemin (les autres),
//    puis « C'était 43. » ; « passer » dès le début, comme partout ;
//  - C2 (juste mais lent) : pas de reproche, le chemin est rejoué une fois à la fin de la question.
import * as R from "../../art/runtime.js";
import { fill } from "../numberline/screen.js";
import { wait } from "../../engine/clock.js";
import { skipKey } from "../../engine/ui.js";
import { answerOf, classifyCalc } from "./calc.js";
import { WallFish } from "./wallfish.js";

const SKIPPED = Symbol("passé");
// le mur des corrections (à la place du pavé) ; le chemin en petit (au-dessus du pavé) et en grand (à la place du pavé)
export const CALC_WALL = { x: 790 - 213, y: 348, cell: 40, gap: 3 }, PATH_SMALL = { y: 440, r: 34, em: 26, span: 820 }, PATH_BIG = { y: 600, r: 40, em: 30, span: 900 };
const sign = (op) => (op === "-" ? "moins" : "plus");

export class CalcScreen {
  // facts : () => l'écran des additions (FactsScreen), qui prête l'ardoise et le pavé
  constructor(app, facts) { this.app = app; this.facts = facts; }
  get fs() { const fs = this.facts(); fs.calc = this; return fs; }
  // les cailloux et les ponts d'un chemin : `shown` cailloux écrits (les autres : « ? », ou `typed` dans le caillou en cours)
  paintPath(ctx, q, L, { shown = Infinity, typed = null, lit = -1, grow = 1 } = {}) {
    const steps = q.chemin, m = steps.length + 1, gap = Math.min(L.r * 5.2, L.span / Math.max(1, m - 1)), cx = Math.min(790, 1250 - L.r - ((m - 1) * gap) / 2), x0 = cx - ((m - 1) * gap) / 2; // (un long chemin, jusqu'à 9 ponts, se décale à gauche pour tenir à l'écran)
    const at = (i) => [x0 + i * gap, L.y], vals = [q.a, ...steps.map((s) => s.a)];
    steps.forEach((s, i) => R.drawBridge(ctx, at(i), at(i + 1), `${s.op === "-" ? "−" : "+"}${s.k}`, { r: L.r, em: L.em, lit: i + 1 === lit, p: i + 1 < shown || i + 1 === lit ? 1 : i + 1 === shown ? grow : 1, seed: 7500 + i * 50 }));
    vals.forEach((v, i) => R.drawStone(ctx, ...at(i), i < shown ? String(v) : i === lit && typed ? typed : "?", { r: L.r, ask: i >= shown, lit: i === lit, seed: 7400 + i * 10 }));
  }
  get board() { return this.app.aidBoard; }
  consigne(q) {
    const T = this.app.text.data;
    if (q.pont) return fill(q.op === "-" ? T.calcPont.moins : T.calcPont.plus, { k: q.b }).replace(/\.$/, " ?");
    if (q.forme === "trouDroite") return fill(q.op === "-" ? T.calcTrouMoins : T.calcTrouPlus, { a: q.a, n: q.n });
    // (lot 3 bis : le trou sur le nombre de départ, « Combien plus 10 ? Ça fait 57. »)
    if (q.forme === "trouGauche") return fill(q.op === "-" ? T.calcTrouDepartMoins : T.calcTrouDepartPlus, { b: q.b, n: q.n });
    return fill(q.op === "-" ? T.calcMoins : T.calcPlus, { a: q.a, b: q.b });
  }
  // le coquillage (et le cran « plus facile », d'emblée) : le chemin en petit, le premier caillou écrit, les autres à trouver
  // (`shown` : les cailloux écrits ; lot 3 bis, B4 : le premier pont d'un chemin de plusieurs ponts est donné)
  help(q, shown = 1) { this.board.draw((ctx) => this.paintPath(ctx, q, PATH_SMALL, { shown })); }
  // (lot 3 bis, B4 ; R6) l'aide du coquillage, dite et montrée. Au mur (niveaux 2, 3, 6, 8) : le mur de corail et le petit
  // poisson apparaissent à la place du pavé, le poisson fait le premier pas et la voix le dit (« Plus dix : le poisson
  // descend d'une rangée »), puis le pavé revient avec le chemin en petit. Sur le chemin : un chemin de plusieurs ponts,
  // la voix dit le premier (« D'abord, on va jusqu'à 40 ») et il est écrit ; d'un seul pont, « On part de 47. Suis le
  // pont. Plus 2. ». « passer » l'arrête, comme l'aide des additions ; la consigne est redite ensuite.
  async showHelp(q) {
    const fs = this.fs, { voice, text } = this.app, T = text.data, k = this.app.vitesse ?? 1, steps = q.chemin ?? [], s0 = steps[0];
    const direct = (q.forme ?? "directe") === "directe";
    if (!s0 || !direct) return this.help(q);
    const pont = (s) => fill(s.op === "-" ? T.calcPont.moins : T.calcPont.plus, { k: s.k });
    fs.locked = true; voice.stop();
    await fs.skippable("passer l'aide", async (g, dead) => {
      if (q.support === "mur") {
        fs.keys(false);
        await g(this.app.sprites.load("calcul"));
        const lit = [q.a], draw = () => this.board.draw((ctx) => R.drawWall(ctx, { ...CALC_WALL, lit }));
        draw(); this.fish ??= new WallFish(this.app); this.fish.at(...R.wallCell(CALC_WALL, q.a));
        const M = T.aideMur, say = s0.k === 10 ? (s0.op === "-" ? M.moins10 : M.plus10) : fill(s0.op === "-" ? M.moinsDizaines : M.plusDizaines, { k: s0.k, r: s0.k / 10 });
        await g(voice.say(String(q.a)));
        const talk = voice.say(say);
        await g(wait(300 / k)); await g(this.fish.swim(...R.wallCell(CALC_WALL, s0.a), 800 / k, dead));
        lit.push(s0.a); draw(); await g(talk); await g(wait(900 / k));
        return;
      }
      if (steps.length > 1) { this.help(q, 2); await g(voice.say(fill(T.aideCheminPont, { n: s0.a }))); }
      else { this.help(q, 1); await g(voice.say(fill(T.aideChemin1, { a: q.a }))); await g(voice.say(pont(s0))); }
    });
    this.fishDone();
    if (fs.q !== q) return;
    // le chemin en petit reste pendant la réponse (au mur : le départ écrit ; sur un chemin de plusieurs ponts : le premier)
    this.help(q, q.support !== "mur" && steps.length > 1 ? 2 : 1);
    fs.keys(true); fs.locked = false;
    voice.say(this.consigne(q));
  }
  // une question du calcul rapide (session/notion.js : ask(q) -> { q, value, ok, code, ms, listens, aide, nsp, … })
  async askNotion(q) {
    const fs = this.fs; fs.show(true); this.board.clear();
    if (q.remplir) return this.guided(q);
    if (q.aideDEmblee) this.help(q);
    const r = await fs.ask(q), code = r.nsp ? "NSP" : r.value === answerOf(q) ? null : classifyCalc(q, r.value);
    return { ...r, q, ok: code === null, code: code ?? (r.lent ? "C2" : null), aide: r.aide || !!q.aideDEmblee };
  }
  // un calcul guidé : le chemin en petit, chaque caillou à remplir au pavé (« Plus 2 ? »), le suivant quand il est trouvé
  async guided(q) {
    const fs = this.fs, { voice, text } = this.app, t0 = performance.now();
    voice.stop(); await voice.say(`${this.consigne({ ...q, remplir: false })} ${text.data.calcGuide}`);
    let allOk = true, aide = false;
    // (lot 3 bis, B4 ; R8) l'ardoise garde le calcul demandé (« 36 + 6 = ? ») ; chaque étape s'écrit sur son caillou
    fs.slateQ = q;
    try {
      for (let i = 0; i < q.chemin.length; i++) {
        const s = q.chemin[i], step = { module: 3, pont: true, a: s.de, op: s.op, b: s.k, n: s.a, forme: "directe", niveau: q.niveau, parent: q, i };
        const draw = (typed = null) => this.board.draw((ctx) => this.paintPath(ctx, q, PATH_SMALL, { shown: i + 1, lit: i + 1, typed }));
        draw(); fs.onTyped = (t) => draw(t || null);
        const r = await fs.ask(step); fs.onTyped = null; aide ||= !!r.aide;
        if (r.value !== s.a) allOk = false;
      }
    } finally { fs.slateQ = null; }
    this.board.draw((ctx) => this.paintPath(ctx, q, PATH_SMALL, { shown: Infinity }));
    // le résultat est écrit dans la bulle, à la fin
    fs.q = q; fs.write(q.n); await wait(700);
    this.board.clear();
    return { q, value: allOk ? q.n : null, ok: allOk, code: allOk ? null : "autre", ms: Math.round(performance.now() - t0), listens: voice.listens, aide };
  }
  // après la réponse (FactsScreen.submit) : juste (et, si c'était lent, le chemin rejoué une fois), ou la correction
  async feedback(q, r, ok) {
    const fs = this.fs, { voice, text, ocean, sound } = this.app, T = text.data, k = this.app.vitesse ?? 1;
    ocean.mascotte.play(ok ? "rejouir" : "encourager");
    if (ok) sound?.play("bonne"); else if (!r.nsp) sound?.play("erreur");
    const answer = () => { fs.typed = String(answerOf(q)); fs.ring = true; fs.slate.repaint(); };
    if (q.pont) { // un caillou d'un calcul guidé : bravo, ou la correction du pont
      if (ok) { await voice.say(text.pick("bravo")); return; }
      return this.bridgeFix(q, r);
    }
    const slow = ok && r.ms > (q.lentMs ?? Infinity);
    if (ok && !slow) { fs.slate.classList.add("pop"); await voice.say(text.pick("bravo")); await wait(250); return; }
    // la correction ou le raccourci (C2) : « passer » dès le début
    let abort = null; const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
    const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), ok ? "passer" : "passer la correction");
    try {
      // (lot 3 bis, B4 ; R7) une erreur : la réponse fausse n'est jamais laissée écrite comme une égalité ; la bonne réponse
      // est entourée dès le début, comme aux additions. Au mur : la phrase de l'erreur (C1, C3), le poisson, « C'était 64. » ;
      // sur le chemin : « Ce n'est pas grave, regardons ensemble », les ponts rejoués, puis la phrase de C4 ou C5
      const code = ok ? null : r.nsp ? "NSP" : classifyCalc(q, r.value), E = T.erreurCalc, wall = q.support === "mur";
      const why = code === "C1" ? (q.op === "-" ? E.C1moins : E.C1) : code === "C4" ? fill(E.C4, { u: q.a % 10, b: q.b }) : code === "C5" ? fill(E.C5, { b: q.b, u: q.a % 10 }) : code === "C3" ? E.C3 : null;
      if (ok) { r.lent = true; await g(voice.say(T.calcLent)); }
      else {
        if (!r.nsp) fs.slate.classList.add("shake");
        answer();
        await g(voice.say(wall ? (r.nsp ? T.faitNSP : why ?? E.autre) : T.faitNSP));
      }
      await this.procedure(q, g);
      if (!ok && wall) await g(voice.say(fill(T.bonneReponse, { n: answerOf(q) })));
      if (!ok && !wall && why) await g(voice.say(why));
      await g(wait(600 / k));
    } catch (e) {
      if (e !== SKIPPED) throw e;
      voice.stop(); if (!ok) { r.correctionPassee = true; answer(); await wait(1000); }
    } finally { skip.remove(); this.fishDone(); fs.keys(true); }
  }
  // la procédure montrée en grand, à la place du pavé : sur le mur (le poisson) ou sur le chemin (les ponts un à un)
  async procedure(q, g) {
    const fs = this.fs, { voice, text } = this.app, T = text.data, k = this.app.vitesse ?? 1;
    fs.keys(false);
    const say = (s) => g(voice.say(s)), pont = (s) => fill(s.op === "-" ? T.calcPont.moins : T.calcPont.plus, { k: s.k });
    if (q.support === "mur") {
      await g(this.app.sprites.load("calcul"));
      const lit = [q.a], draw = () => this.board.draw((ctx) => R.drawWall(ctx, { ...CALC_WALL, lit }));
      draw(); this.fish ??= new WallFish(this.app); this.fish.at(...R.wallCell(CALC_WALL, q.a));
      await say(String(q.a));
      for (const s of q.chemin) {
        await say(pont(s));
        await g(this.fish.swim(...R.wallCell(CALC_WALL, s.a), 700 / k));
        lit.push(s.a); draw();
        await say(String(s.a));
      }
      return;
    }
    const draw = (shown, grow = 1) => this.board.draw((ctx) => this.paintPath(ctx, q, PATH_BIG, { shown, grow }));
    draw(1); await say(String(q.a));
    for (let i = 0; i < q.chemin.length; i++) {
      const s = q.chemin[i];
      for (let p = 0.25; p <= 1.001; p += 0.25) { draw(i + 1, p); await g(wait(90 / k)); }
      await say(pont(s)); draw(i + 2); await say(String(s.a));
    }
  }
  // (lot 3 bis, B4 ; R7) une erreur (ou « je ne sais pas ») sur un caillou d'un calcul guidé : la voix rassure, le pont en
  // cause est rejoué sur le chemin (il pousse, puis la bonne valeur s'inscrit sur le caillou, dite), puis la phrase de
  // l'erreur type du niveau (C4 en ajoutant, C5 en retirant, C3 pour + 9) ; « passer » l'arrête
  async bridgeFix(step, r) {
    const fs = this.fs, { voice, text } = this.app, T = text.data, E = T.erreurCalc, k = this.app.vitesse ?? 1, q = step.parent, i = step.i ?? 0;
    const pont = fill(step.op === "-" ? T.calcPont.moins : T.calcPont.plus, { k: step.b });
    const why = !q ? null : q.type === "passerPlus" ? fill(E.C4, { u: q.a % 10, b: q.b }) : q.type === "passerMoins" ? fill(E.C5, { b: q.b, u: q.a % 10 }) : q.type === "plus9" ? E.C3 : null;
    let abort = null; const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
    const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer la correction");
    const draw = (o) => q && this.board.draw((ctx) => this.paintPath(ctx, q, PATH_SMALL, o));
    try {
      if (!r.nsp) fs.slate.classList.add("shake");
      await g(voice.say(T.faitNSP));
      if (q) {
        draw({ shown: i + 1 }); await g(wait(250 / k));
        for (let p = 0.25; p <= 1.001; p += 0.25) { draw({ shown: i + 1, grow: p }); await g(wait(110 / k)); }
        await g(voice.say(pont));
        draw({ shown: i + 2, lit: i + 1 });
        await g(voice.say(String(step.n)));
      }
      if (why) await g(voice.say(why));
      await g(wait(400 / k));
    } catch (e) {
      if (e !== SKIPPED) throw e;
      voice.stop(); r.correctionPassee = true; draw({ shown: i + 2, lit: i + 1 }); await wait(800);
    } finally { skip.remove(); }
  }
  // (lot 3 bis, B4) l'annonce du calcul rapide aux niveaux du mur : le mur et le poisson, qui nage vers le milieu du mur
  async introWall(phrase) {
    const { voice } = this.app, fs = this.fs;
    fs.keys(false); fs.slate.style.visibility = "hidden"; await this.app.sprites.load("calcul");
    this.board.draw((ctx) => R.drawWall(ctx, { ...CALC_WALL, lit: [] }));
    this.fish ??= new WallFish(this.app); this.fish.at(CALC_WALL.x - 40, CALC_WALL.y + 60);
    const talk = voice.say(phrase);
    await this.fish.swim(...R.wallCell(CALC_WALL, 45), 1400);
    await talk; await wait(300);
    this.fishDone(); this.board.clear(); fs.slate.style.visibility = "visible";
  }
  fishDone() { if (this.fish) { this.fish.remove(); this.fish = null; } }
  leave() { this.fishDone(); this.board?.clear(); this.facts().leave(); }
}
