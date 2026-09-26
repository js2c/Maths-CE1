// LES ÉCRANS DE LA SÉANCE autour des exercices : le compteur d'étoiles (en haut), le choix du nom de la
// pieuvre (premier lancement), la récompense et « à demain ». Tout est posé dans #ui (boutons HTML
// portant chacun un petit canvas dessiné une fois) et dans le premier plan de l'océan (étoiles qui volent).
import * as R from "../art/runtime.js";
import { fill } from "../modules/numberline/screen.js";
import { CARD, cardElement } from "./cards.js";
import { goldenStar } from "./rewards.js";

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
      this.flights.push({ a, t0, dur: dur / 1000, from, to: HUD_STAR, dx, done: () => { this.set(this.shown + v); pop(this.box); this.pool.push(a); res(); } });
    })));
  }
  // n étoiles dépensées (un coquillage) : elles quittent le compteur une à une et volent vers `to`
  spend(n, to, { gap = 60, dur = 700 } = {}) {
    const k = Math.min(n, 10), per = Array.from({ length: k }, (_, i) => Math.floor((n * (i + 1)) / k) - Math.floor((n * i) / k));
    return Promise.all(per.map((v, i) => new Promise((res) => {
      const a = this.pool.pop() ?? this.app.ocean.spriteActor(this.app.ocean.frontEl, "etoile");
      a.draw(0); a.show(false);
      setTimeout(() => { this.set(this.shown - v); pop(this.box); }, i * gap);
      this.flights.push({ a, t0: performance.now() / 1000 + (i * gap) / 1000, dur: dur / 1000, from: HUD_STAR, to, dx: (i % 2 ? 1 : -1) * (20 + 8 * i), done: () => { this.pool.push(a); res(); } });
    })));
  }
  tick(t) {
    this.flights = this.flights.filter((f) => {
      const u = (t - f.t0) / f.dur;
      if (u < 0) return true;
      if (u >= 1) { f.a.show(false); f.done(); return false; }
      const e = ease(u), [x0, y0] = f.from, [x1, y1] = f.to;
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
// que la voix le dit ; puis les dix étoiles de la séance terminée s'envolent vers le compteur ; puis les
// bonus (série, étoile dorée, étoiles arc-en-ciel) et les coquillages. « À demain » vient ensuite (main.js).
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
  await bonuses(app, { session });
  tally.remove(); document.querySelectorAll(".special").forEach((e) => e.remove());
  await shells(app, { session, hud });
}

// la série (une séance sur trois : 5 étoiles), l'étoile dorée (5 séances dans la semaine), les étoiles
// arc-en-ciel (un niveau franchi pendant la séance) ; les étoiles spéciales s'alignent sous le bilan
async function bonuses(app, { session }) {
  const { rewards, store, voice, text, ocean } = app, specials = [];
  if (!rewards.c) return;
  app.starFrom = [635, 305];
  const b = await rewards.endOfSession(session.rec.debut);
  if (b) { const said = voice.say(fill(text.data.serieBonus, { n: b })); await session.stars(b, "série"); await said; await wait(600); }
  const others = (await store.all("seances")).filter((x) => x.terminee && x.id !== session.id).map((x) => x.debut);
  if (goldenStar([...others, session.rec.debut], session.rec.debut, rewards.c.semaine)) { await rewards.special("dorees"); session.rec.doree = true; await session.save(); specials.push(["etoile.doree", text.data.etoileDoree]); }
  for (let i = 0; i < (session.rec.arcEnCiel ?? 0); i++) specials.push(["etoile.arc", text.data.etoileArc]);
  for (const [i, [sprite, say]] of specials.entries()) {
    spriteBox(app, { x: 640 - 60 + (i - (specials.length - 1) / 2) * 130, y: 440, w: 120, h: 120, cls: "hud special pop", still: true, paint: (ctx) => app.sprites.draw(ctx, sprite, 0, 60, 60) });
    ocean.octo.play("rejouir"); await voice.say(say); await wait(500);
  }
}

// les coquillages : tant qu'il y a assez d'étoiles (au plus `parSeance` à la fin d'une séance)
export async function shells(app, { session, hud }) {
  const { rewards, sprites } = app;
  if (!rewards.c) return;
  for (let k = 0; k < rewards.c.coquillage.parSeance && rewards.canOpen(); k++) {
    await sprites.load("cartes");
    await openShell(app, { session, hud, first: k === 0 });
  }
  sprites.unload("cartes");
}
// un coquillage : les étoiles de son prix s'y envolent ; l'enfant le touche (ou il s'ouvre tout seul
// au bout de quelques secondes) ; il s'entrouvre, la perle brille, la carte en sort et se retourne ; la
// voix dit le nom et l'anecdote ; la coche verte (ou le temps) referme le tout
export async function openShell(app, { session, hud, first = true, C = [640, 640] }) {
  const { voice, text, ocean, rewards, rnd, sprites } = app, prix = rewards.c.coquillage.prix;
  const shell = ocean.spriteActor(ocean.frontEl, "coquillage"), glint = ocean.spriteActor(ocean.frontEl, "eclat");
  let frame = 0, t0 = null, wob = true, gl = null;
  shell.draw(0); glint.show(false);
  const tick = (t) => {
    if (t0 === null) t0 = t;
    shell.draw(frame); shell.moveTo(C[0] + (wob ? 4 * Math.sin((t - t0) * 9) * Math.max(0, Math.sin((t - t0) * 1.6)) : 0), C[1]);
    if (gl !== null) { const u = (t - gl) / 1.4; glint.show(u < 1); if (u < 1) glint.moveTo(C[0], C[1] + 8, 0.35 + 0.65 * Math.sin(Math.PI * u), Math.round(Math.sin(Math.PI * u) * 20) / 20); }
  };
  ocean.front.push(tick);
  voice.stop(); voice.say(text.data[first ? "coquillage" : "coquillageEncore"], { instruction: true });
  await hud.spend(prix, [C[0], C[1] - 20]);
  const got = await rewards.openShell(rnd);
  hud.set(rewards.total);
  (session.rec.cartes ??= []).push(got.carte.id); await session.save();
  // toucher le coquillage (ou attendre)
  const tap = document.createElement("button"); tap.className = "bubble shelltap invite"; tap.setAttribute("aria-label", "ouvrir le coquillage");
  Object.assign(tap.style, { left: `${C[0] - 130}px`, top: `${C[1] - 110}px`, width: "260px", height: "200px" }); app.stage.ui.append(tap);
  await Promise.race([new Promise((r) => onTap(tap, r)), wait(9000)]);
  tap.remove(); wob = false; voice.stop(); voice.unlock();
  const opened = voice.say(text.data.coquillageOuvre);
  for (let f = 1; f < 12; f++) { frame = f; await wait(1000 / 12); }
  gl = performance.now() / 1000; await wait(1300);
  // la carte sort du coquillage, face cachée, puis se retourne
  const owned = rewards.owned[got.carte.id];
  const el = await cardElement(app, got.carte, { x: C[0] - CARD.W / 2, y: 128, front: "dos", back: "recto", brillante: owned.brillante });
  el.classList.add("enter"); await wait(900); await opened;
  el.flip(true); ocean.octo.play("rejouir"); await wait(800);
  const nom = got.carte.nomLu ?? got.carte.nom;
  const say = got.nouvelle ? `${fill(text.data.carteNouvelle, { nom })} ${got.carte.anecdote} ${text.data.carteRecif}` : `${fill(text.data.carteDoublon, { nom })}${got.devientBrillante ? ` ${text.data.carteBrillante}` : ""}`;
  await voice.say(say, { instruction: true });
  const ok = spriteBox(app, { x: 1000 - 80, y: 560, w: 160, h: 160, cls: "bubble check invite", label: "c'est bon", paint: (ctx) => sprites.draw(ctx, "valider", 0, 80, 80) });
  await Promise.race([new Promise((r) => onTap(ok, r)), wait(20000)]);
  ok.remove(); voice.stop();
  el.classList.add("leave"); await wait(650); el.remove();
  ocean.front.splice(ocean.front.indexOf(tick), 1); shell.show(false); glint.show(false); shell.remove(); glint.remove();
  ocean.actors.splice(ocean.actors.indexOf(shell), 1); ocean.actors.splice(ocean.actors.indexOf(glint), 1);
  return got;
}
// « à demain » : la pieuvre salue, la lune apparaît ; la toucher redit « à demain »
export async function goodNight(app, { first = true } = {}) {
  const { voice, text, ocean } = app;
  const moon = spriteBox(app, { x: 550, y: 330, w: 180, h: 180, cls: "bubble moon invite", label: "à demain", paint: (ctx) => app.sprites.draw(ctx, "lune", 0, 90, 90) });
  onTap(moon, () => { voice.unlock(); pop(moon); ocean.octo.play("saluer"); voice.stop(); voice.say(text.pick("dejaJoue"), { instruction: true }); });
  if (first) { ocean.octo.play("saluer"); await voice.say(text.pick("aDemain"), { instruction: true }); }
  return moon;
}
