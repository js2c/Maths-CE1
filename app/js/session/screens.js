// LES ÉCRANS DE LA SÉANCE autour des exercices : le compteur d'étoiles (en haut), le choix du nom de la
// pieuvre (premier lancement), la récompense et « à demain ». Tout est posé dans #ui (boutons HTML
// portant chacun un petit canvas dessiné une fois) et dans le premier plan de l'océan (étoiles qui volent).
import * as R from "../art/runtime.js";
import { fill } from "../modules/numberline/screen.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ease = (u) => 1 - Math.pow(1 - u, 3);

// un bouton (ou un simple calque si `still`) : un canvas à la taille de la boîte, `paint(ctx)` en px logiques
export function spriteBox(app, { x, y, w, h, cls = "bubble", label = "", still = false, paint }) {
  const { stage } = app, b = document.createElement(still ? "div" : "button"), c = document.createElement("canvas");
  b.className = cls; Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  if (label) b.setAttribute("aria-label", label);
  c.width = Math.round(w * stage.px); c.height = Math.round(h * stage.px); b.append(c); stage.ui.append(b);
  b.repaint = (f = paint) => { const ctx = c.getContext("2d"); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); f(ctx, stage.px); };
  b.repaint();
  return b;
}
// un toucher franc : pointerdown (pas de délai de clic), une seule fois tant que `busy`
export const onTap = (el, f) => el.addEventListener("pointerdown", (e) => { e.preventDefault(); f(e); });
const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };

// ---------------------------------------------------------------- le compteur d'étoiles et leur vol
// Le compteur montre le trésor (rewards.total). Chaque gain fait voler des étoiles de mer jusqu'à lui ;
// il avance d'un cran à chaque arrivée. Au plus 10 étoiles en vol pour un gain (chacune en vaut alors plus).
export const HUD_STAR = [1010, 72];
export class StarHud {
  constructor(app, rewards) {
    this.app = app; this.shown = rewards.total; this.pool = []; this.flights = [];
    this.box = spriteBox(app, { x: 960, y: 22, w: 170, h: 100, cls: "hud stars", still: true, paint: (ctx, px) => this.paint(ctx, px) });
    app.ocean.front.push((t) => this.tick(t));
  }
  paint(ctx, px) {
    const q = this.app.sprites.frame("etoile", 0), k = 0.62; // l'étoile, réduite (jamais agrandie)
    ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 50 * px + q.dx * k, 50 * px + q.dy * k, q.w * k, q.h * k);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    const s = String(this.shown); R.drawNumber(ctx, s, 118 + (s.length > 2 ? 6 : 0), 32, s.length > 2 ? 34 : 40, { w: 5.6 });
  }
  set(v) { if (v !== this.shown) { this.shown = v; this.box.repaint(); } }
  // n étoiles gagnées, qui partent de `from` (px logiques) ; la promesse se résout à la dernière arrivée
  fly(n, from, { gap = 110, dur = 750 } = {}) {
    if (n <= 0) return Promise.resolve();
    const k = Math.min(n, 10), per = Array.from({ length: k }, (_, i) => Math.floor((n * (i + 1)) / k) - Math.floor((n * i) / k));
    return Promise.all(per.map((v, i) => new Promise((res) => {
      const a = this.pool.pop() ?? this.app.ocean.spriteActor(this.app.ocean.frontEl, "etoile");
      a.draw(0); a.show(false);
      const t0 = performance.now() / 1000 + (i * gap) / 1000, dx = (i % 2 ? 1 : -1) * (30 + 12 * i);
      this.flights.push({ a, t0, dur: dur / 1000, from, dx, done: () => { this.set(this.shown + v); pop(this.box); this.pool.push(a); res(); } });
    })));
  }
  tick(t) {
    this.flights = this.flights.filter((f) => {
      const u = (t - f.t0) / f.dur;
      if (u < 0) return true;
      if (u >= 1) { f.a.show(false); f.done(); return false; }
      const e = ease(u), [x0, y0] = f.from, [x1, y1] = HUD_STAR;
      // une courbe : l'étoile s'écarte un peu, monte, puis file vers le compteur en rapetissant
      f.a.show(true); f.a.moveTo(x0 + (x1 - x0) * e + f.dx * Math.sin(Math.PI * u), y0 + (y1 - y0) * e - 60 * Math.sin(Math.PI * u), 0.9 - 0.45 * e);
      return true;
    });
  }
}

// ---------------------------------------------------------------- le choix du nom (premier lancement)
// Six propositions (content/seance.json, « noms »), écrites au feutre sur des galets. Toucher un nom le
// fait dire à voix haute et fait apparaître la coche verte ; la coche le garde. Aucun clavier.
export function chooseName(app, names) {
  const { voice, text, ocean } = app, boxes = [];
  let chosen = null, told = false;
  ocean.octo.play("saluer");
  voice.say(text.pick("nomDemande"), { instruction: true });
  return new Promise((resolve) => {
    const W = 236, H = 104, cols = [616, 874, 1132], rows = [290, 432];
    const paintTag = (name) => (ctx, px) => {
      app.sprites.draw(ctx, "nom", 0, W / 2 + 20, H / 2 + 20);
      ctx.setTransform(px, 0, 0, px, 0, 0);
      const em = name.length > 6 ? 38 : 42, ww = R.wordWidth(name) * em, k = Math.min(1, 200 / ww);
      R.drawWord(ctx, name, W / 2 + 20, H / 2 + 20 - (em * k) / 2 - 4, em * k, { w: em * k * 0.13, seed: 700 + name.length });
    };
    const ok = spriteBox(app, { x: 874 - 80, y: 530, w: 160, h: 160, cls: "bubble check", label: "c'est bon", paint: (ctx) => app.sprites.draw(ctx, "valider", 0, 80, 80) });
    ok.style.visibility = "hidden";
    names.forEach((name, i) => {
      const cx = cols[i % 3], cy = rows[Math.floor(i / 3)];
      const b = spriteBox(app, { x: cx - W / 2 - 20, y: cy - H / 2 - 20, w: W + 40, h: H + 40, cls: "bubble name", label: name, paint: paintTag(name) });
      b.dataset.value = name; boxes.push(b);
      onTap(b, () => {
        chosen = name; boxes.forEach((o) => o.classList.toggle("chosen", o === b)); pop(b);
        voice.stop(); voice.say(fill(text.data.nomTouche, { nom: name }));
        if (!told) { told = true; voice.say(fill(text.data.nomValider, { nom: name })); }
        ok.style.visibility = "visible"; ok.classList.add("invite");
      });
    });
    onTap(ok, () => { if (!chosen) return; voice.stop(); [...boxes, ok].forEach((e) => e.remove()); resolve(chosen); });
  });
}

// ---------------------------------------------------------------- la récompense et « à demain »
// Le bilan des étoiles de la séance : une grande étoile au milieu et le nombre gagné, qui monte pendant
// que la voix le dit ; puis les dix étoiles de la séance terminée s'envolent vers le compteur.
// (Coquillage et carte : étape 10.)
export async function reward(app, { session, hud }) {
  const { voice, text, ocean } = app, E = session.c.etoiles, earned = session.rec.etoiles;
  const phrase = (n) => (n === 1 ? text.data.uneEtoile : fill(text.data.desEtoiles, { n }));
  let shown = 0;
  const tally = spriteBox(app, { x: 720 - 210, y: 300 - 115, w: 430, h: 240, cls: "hud tally", still: true, paint: (ctx, px) => {
    app.sprites.draw(ctx, "bilan", 0, 210, 115);
    ctx.setTransform(px, 0, 0, px, 0, 0); const t = String(shown); R.drawNumber(ctx, t, 282, 70, t.length > 2 ? 76 : 92, { w: 12, seed: 810 });
  } });
  tally.classList.add("pop");
  ocean.octo.play("rejouir");
  const said = voice.say(fill(text.pick("recompense"), { etoiles: phrase(earned) }));
  for (let i = 1; i <= 20 && shown < earned; i++) { shown = Math.round((earned * i) / 20); tally.repaint(); await wait(60); }
  shown = earned; tally.repaint();
  await said;
  await session.stars(E.seanceTerminee, "séance terminée");
  const flown = hud.fly(E.seanceTerminee, [635, 305]);
  await voice.say(text.pick("seanceFinie")); await flown;
  await wait(400);
  tally.remove();
  await goodNight(app);
}
// « à demain » : la pieuvre salue, la lune apparaît ; la toucher redit « à demain »
export async function goodNight(app, { first = true } = {}) {
  const { voice, text, ocean } = app;
  const moon = spriteBox(app, { x: 550, y: 330, w: 180, h: 180, cls: "bubble moon invite", label: "à demain", paint: (ctx) => app.sprites.draw(ctx, "lune", 0, 90, 90) });
  onTap(moon, () => { voice.unlock(); pop(moon); ocean.octo.play("saluer"); voice.stop(); voice.say(text.pick("dejaJoue"), { instruction: true }); });
  if (first) { ocean.octo.play("saluer"); await voice.say(text.pick("aDemain"), { instruction: true }); }
  return moon;
}
