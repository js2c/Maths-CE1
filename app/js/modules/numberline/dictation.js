// MODULE 1 · LA DICTÉE DE NOMBRES (lot 2, étape 8 ; docs/SPEC-COMPLEMENTS.md, partie A, niveau 12 : « Trois-cent-sept »
// -> 307). La voix dit le nombre, l'enfant le tape au pavé numérique de l'écran des additions (FactsScreen,
// askNumber : l'ardoise ne montre que le nombre tapé). Même interface que l'écran de la ligne pour
// session/notion.js : ask(q, cfg, { guide, lesson }) -> { q, value, ok, code, ms, listens, correctionPassee? }.
//  - exemple guidé : le nombre décomposé (chaluts, filets, poissons seuls ; planche « centaines ») et dit
//    (« 307 : 3 centaines, 0 dizaine, 7 unités. »), puis écrit sur l'ardoise, puis « À toi ! » ;
//  - erreur (E6 : dizaines et centaines confondues ; E7 : écrit comme il l'entend, 3007 ; ou autre) : la phrase
//    de l'erreur, le nombre décomposé et son chiffre des places vides, la bonne réponse sur l'ardoise, « C'était
//    307. » ; « passer » comme partout.
import { classify } from "./generator.js";
import { fill } from "./screen.js";
import { hundredsWords } from "../../engine/phrases.js";
import { wait } from "../../engine/clock.js";
import { skipKey } from "../../engine/ui.js";
import { paintHundreds, paintPlaceTable } from "../facts/aids.js";

const SKIPPED = Symbol("correction passée");
// (lot « Mascotte ») la pointe de la flèche à gauche du nombre décomposé (paintHundreds, posé en 760, 340, entre x 420 et 990),
// pointée vers lui : au-dessus, elle passait sous l'ardoise (relecture du lot)
const PARTS_FLECHE = [412, 400];

export class Dictation {
  // facts : () => l'écran des additions (créé à la demande)
  constructor(app, facts) { this.app = app; this.facts = facts; }
  get board() { return this.app.aidBoard; }
  hide() { this.fs?.leave(); this.app.aidBoard?.clear(); this.finParts(); }
  // le nombre décomposé sur le calque des aides (le pavé est caché : même place)
  async showParts(n, lit = null) {
    await this.app.sprites.load("centaines");
    this.fs.keys(false);
    // (lot « Mascotte ») la mascotte regarde, la flèche montre le nombre décomposé (la pieuvre le montrait du bras)
    this.app.ocean.mascotte.hold("montrer"); this.app.fleche?.montrer(PARTS_FLECHE, { angle: -90 });
    this.app.aidBoard.draw((ctx) => paintHundreds(ctx, this.app.sprites, n, 760, 340, { lit, fit: [420, 990] }));
  }
  finParts() { this.app.ocean.mascotte.release(); this.app.fleche?.cacher(); }
  parts(n) { return fill(this.app.text.data.erreur.E6, { n, ...hundredsWords(this.app.text.data, n) }); }
  async ask(q, cfg, { guide = false, lesson = null } = {}) {
    const { voice, text, sound, ocean } = this.app, k = this.app.vitesse ?? 1;
    this.fs = this.facts(); this.fs.show(true); this.fs.keys(false); this.app.starFrom = [790, 222];
    const n = q.answer, consigne = text.pick("ecrire", { n });
    // l'exemple guidé : on montre d'abord, on peut passer
    if (guide && !lesson) {
      let abort = null; const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
      const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer l'exemple");
      try {
        await g(voice.say(text.pick("guideEcrire")));
        await g(this.showParts(n)); this.fs.write("", false);
        await g(voice.say(this.parts(n)));
        this.fs.write(n, false); await g(wait(900 / k));
      } catch (e) { if (e !== SKIPPED) throw e; voice.stop(); q.passe = true; }
      skip.remove(); this.app.aidBoard.clear(); this.finParts();
    }
    const say = lesson ? `${this.app.lecons?.[lesson]?.aToi ?? text.pick("aToi")} ${consigne}` : guide ? `${text.pick("aToi")} ${consigne}` : consigne;
    // lot 3, cran « plus facile » (module1.json, crans) : le tableau centaines, dizaines, unités sous l'ardoise
    if (q.tableau) { await this.app.sprites.load("centaines"); const paint = (t) => this.app.aidBoard.draw((ctx) => paintPlaceTable(ctx, this.app.sprites, t)); this.fs.onTyped = paint; paint(""); }
    const r = await this.fs.askNumber(q, say); this.fs.onTyped = null; if (q.tableau) this.app.aidBoard.clear();
    const code = r.nsp ? "NSP" : classify(q, r.value), ok = code === null;
    const result = { q, value: r.value, ok, code, ms: r.ms, listens: r.listens };
    ocean.mascotte.play(ok ? "rejouir" : "encourager");
    if (ok) { sound?.play("bonne"); this.fs.write(n, false); await voice.say(text.pick("bravo")); await wait(500); }
    else {
      if (!r.nsp) sound?.play("erreur");
      let abort = null; const abortP = new Promise((_, rej) => { abort = () => rej(SKIPPED); }); abortP.catch(() => {});
      const g = (p) => Promise.race([p, abortP]), skip = skipKey(this.app, () => abort(), "passer la correction"), T = text.data.erreur;
      try {
        const first = code === "NSP" ? T.NSP : code === "E7" ? fill(T.E7, e7Words(n, text.data)) : code === "E6" ? null : T.autre;
        if (first) await g(voice.say(first));
        // le nombre décomposé ; le chiffre de la place vide (ou des dizaines) en couleur
        const d = Math.floor(n / 10) % 10, u = n % 10;
        await g(this.showParts(n, d === 0 ? 1 : u === 0 ? 2 : null));
        await g(voice.say(this.parts(n)));
        this.fs.write(n, false);
        await g(voice.say(fill(text.data.bonneReponse, { n })));
        await g(wait(900 / k));
      } catch (e) { if (e !== SKIPPED) throw e; voice.stop(); result.correctionPassee = true; this.fs.write(n, false); await wait(1000); }
      skip.remove(); this.app.aidBoard.clear(); this.finParts();
    }
    this.fs.leave();
    return result;
  }
}
// E7 : « On n'écrit pas 300 puis 7 : le 7 prend la place des unités. »
export const e7Words = (n, T) => { const reste = n % 100; return { cents: n - reste, reste, places: reste < 10 ? T.placesUnites : T.placesDizainesUnites }; };
