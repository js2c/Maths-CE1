// LES LEÇONS DE LA MONNAIE (L15 à L18 ; lot « L'étal du pêcheur », docs/SPEC.md, sections 7 quater et 8). Même règle que les
// autres lecteurs (lessons/player.js, player2.js) : chaque phrase est découpée en temps ; la voix dit pendant que les actions se
// jouent, le temps suivant attend la fin des deux ; « rejouer » reprend au début, « passer » l'arrête, dès la première vue.
// La scène est l'étal lui-même (modules/etal/screen.js) : celle de la notion du jour si elle est là (une leçon relancée entre
// deux achats), sinon une scène installée le temps de la leçon (menu des leçons, entraînement libre, pause).
// Actions (content/lecons.json, `module: 6`) : remplir [valeurs] (le portefeuille) ; ouvrir ; sortir ; poser v (une pièce ou
// un billet du portefeuille glisse dans la soucoupe) ; monnaie v (le pêcheur pose une pièce de sa caisse) ; vider (il prend
// l'argent) ; rendre (l'argent revient au portefeuille) ; total true|false (le total écrit au-dessus de la soucoupe) ;
// etiquettes true|false (la valeur écrite sous l'argent) ; compter (un halo sur chaque objet de la soucoupe, du plus gros au
// plus petit) ; produit { n, prix } (un produit allumé, son prix sur l'ardoise, en centimes) ; produits [[n, prix], …] ;
// eteindre ; ligne { de, a } (la ligne graduée du prix au billet, en euros) ; saut (la tortue saute du prix au billet, « + 7 ») ;
// visible true|false (le portefeuille) ; attendre ms.
import { clock, wait } from "../engine/clock.js";
import { onBrief, pop, skipKey, spriteBox } from "../engine/ui.js";
import { EtalScreen } from "../modules/etal/screen.js";

const ABORT = Symbol("leçon interrompue");
// (relecture du lot, R10 : dans le ciel, à gauche de « passer » ; plus bas, il cachait la colonne de droite de l'étal)
const REPLAY_AT = [1050, 215];

export class LessonEtalPlayer {
  constructor(app, content) { this.app = app; this.c = content; this.tok = 0; this.keys = null; }
  async play(id) {
    const { app } = this, lesson = this.c[id], t0 = Date.now(), stats = { rejouees: 0 };
    if (!lesson) return { vue: false };
    // la scène : celle de la notion du jour (sauf pendant une visite en pause, où elle est mise de côté), sinon la sienne
    const e = app.etal;
    this.own = !(e?.actif && !e.x.scene.classList.contains("stash"));
    this.s = this.own ? new EtalScreen(app, app.module6, e.conf) : e;
    if (this.own) { await this.s.enter({ rnd: app.rnd }); app.etalLecon = this.s; }
    this.p = 0; this.skipped = false; this.abort = null; this.goto = undefined;
    const jump = (to) => { this.goto = to; app.voice.stop(); if (this.abort) this.abort(); else this.p = to; };
    const again = spriteBox(app, { x: REPLAY_AT[0] - 70, y: REPLAY_AT[1] - 70, w: 140, h: 140, cls: "bubble lessonkey rejouer", label: "rejouer la leçon", paint: (ctx) => app.sprites.draw(ctx, "rejouer", 0, 70, 70) });
    onBrief(app, again, () => { if (!this.abort) return; pop(again); stats.rejouees++; jump(0); }, "rejouer");
    const skip = skipKey(app, () => { this.skipped = true; jump(lesson.phrases.length); }, "passer la leçon");
    skip.classList.add("lessonkey");
    this.keys = [again, skip];
    this.lesson = lesson;
    while (this.p < lesson.phrases.length) {
      const tok = ++this.tok;
      this.abortP = new Promise((_, rej) => { this.abort = () => rej(ABORT); }); this.abortP.catch(() => {});
      if (this.p === 0) await this.debut();
      try { await this.phrase(this.p, tok); this.p++; }
      catch (err) { if (err !== ABORT) throw err; this.p = this.goto ?? this.p; }
    }
    this.abort = null; this.tok++;
    this.keys.forEach((k) => k.remove()); this.keys = null;
    if (!this.skipped) { app.ocean.mascotte.play("rejouir"); await wait(600); }
    await this.clear();
    return { vue: !this.skipped, passee: this.skipped, dureeS: Math.round((Date.now() - t0) / 1000), ...stats };
  }
  g(p) { return Promise.race([p, this.abortP]); }
  // la scène remise à zéro (au début, et quand la leçon est rejouée)
  async debut() {
    const a = this.s.api;
    this.s.ligne(null); a.vitesse(1); a.totalVu(false); a.etiquettes(false); a.verrou(true); a.visible(true); a.remplir([]); a.eteindre();
  }
  async phrase(p) {
    const { voice, ocean } = this.app;
    ocean.mascotte.hold("montrer");
    for (const beat of this.lesson.phrases[p]) {
      const said = beat.dire ? voice.say(beat.dire, { instruction: true }) : Promise.resolve();
      const done = (async () => { for (const a of beat.faire ?? []) await this.g(this.act(a)); })();
      await this.g(Promise.all([said, done]));
    }
    ocean.mascotte.release();
  }
  async act(x) {
    const [[name, v]] = Object.entries(x), s = this.s, a = s.api, g = clock.hold();
    if (name === "remplir") { a.remplir(v); return; }
    if (name === "visible") { a.visible(!!v); return; }
    if (name === "ouvrir") return a.ouvrir().then(g);
    if (name === "sortir") { a.sortir(); return wait(450); }
    if (name === "poser") { await a.deposer(v).then(g); this.app.sound?.play("bouton"); return wait(420); }
    if (name === "monnaie") { await a.poserMonnaie(v).then(g); this.app.sound?.play("bouton"); return wait(200); }
    if (name === "vider") return a.prendre().then(g);
    if (name === "rendre") return a.rendre().then(g);
    if (name === "total") { a.totalVu(!!v); return; }
    if (name === "etiquettes") { a.etiquettes(!!v); return; }
    if (name === "compter") { for (const it of a.objets()) { a.halo(it); await wait(620); a.halo(it, false); } return; }
    if (name === "produit") { s.installer({ produits: [v.n], prix: v.prix }); return wait(350); }
    if (name === "produits") { s.installer({ produits: v.map((p) => p[0]), prixProduits: v.map((p) => p[1]), prix: v[0][1] }); return wait(350); }
    if (name === "eteindre") { a.eteindre(); return; }
    if (name === "ligne") return s.ligne({ prix: v.de * 100, billet: v.a * 100 });
    if (name === "saut") return s.sauter();
    if (name === "attendre") return wait(v);
  }
  // la scène rangée : l'argent rentre, la ligne s'en va ; une scène installée pour la leçon s'en va aussi
  async clear() {
    const s = this.s; if (!s?.actif) return;
    s.ligne(null); s.api.totalVu(false); s.api.etiquettes(false); s.api.sansHalo(); s.api.eteindre(); s.api.remplir([]);
    if (this.own) { s.leave(); if (this.app.etalLecon === s) this.app.etalLecon = null; }
    this.s = null;
  }
  abandon() { if (!this.keys) return; this.tok++; this.abort = null; this.keys.forEach((k) => k.remove()); this.keys = null; this.clear(); }
}
