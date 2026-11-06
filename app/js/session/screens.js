// LES ÉCRANS DE LA SÉANCE autour des exercices : le compteur d'étoiles (en haut), la récompense et « à demain » (le
// choix du nom de la pieuvre, au premier lancement, a disparu avec elle : lot « Mascotte »). Tout est posé dans #ui (boutons HTML
// portant chacun un petit canvas dessiné une fois) et dans le premier plan de l'océan (étoiles qui volent).
import * as R from "../art/runtime.js";
import { fill } from "../modules/numberline/screen.js";
import { CARD, cardElement } from "./cards.js";
import { goldenStar } from "./rewards.js";
import { imageCreature } from "./boutique.js";
import { wait } from "../engine/clock.js";
import { onBrief, onTap, spriteBox } from "../engine/ui.js";
import { Reserves, volVersReserve } from "./reserves.js";
import { sentences } from "../engine/phrases.js";

export { onTap, spriteBox };
const ease = (u) => 1 - Math.pow(1 - u, 3);
const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };

// ---------------------------------------------------------------- le compteur d'étoiles et leur vol
// Le compteur montre le trésor (rewards.total). Chaque gain fait voler des étoiles de mer jusqu'à lui ;
// il avance d'un cran à chaque arrivée. Au plus 10 étoiles en vol pour un gain (chacune en vaut alors plus).
// (lot « Correctifs du 5 novembre », décision du parent du 5 novembre 2026) LA RANGÉE DES COMPTEURS : les étoiles de mer, les
// étoiles arc-en-ciel et les étoiles de diamant (session/reserves.js) sur une seule ligne, en haut à droite, chaque étoile à gauche
// de son nombre, les trois étoiles à la même taille et à la même hauteur, les trois nombres aussi. Chaque compteur est une boîte
// (cible d'au moins 64 px pour les réserves, qu'on touche) ; la rangée est alignée sur le bord droit, entre la frise (jusqu'à x 950)
// et le bord ; si elle est trop longue (beaucoup d'étoiles), tout est un peu réduit pour qu'elle tienne.
//   etoile : le côté de l'étoile dessinée (px logiques) ; chiffre : la hauteur des chiffres ; cy : le milieu de la ligne
export const RANGEE = { gauche: 952, droite: 1270, y: 22, h: 100, cy: 72, etoile: 44, chiffre: 32, marge: 7, ecart: 6, entre: 3, min: 70 };
// la largeur d'un nombre écrit par R.drawNumber (mesurée : environ 0,73 fois sa hauteur par chiffre)
export const largeurNombre = (t, h) => Math.round(String(t).length * 0.735 * h);
// la taille de chaque étoile dans l'atelier (partie pleine, mesurée sur les images) : pour qu'elles se dessinent à la même taille
export const ETOILE_PLEINE = { etoile: 78, "etoile.arc": 86, "etoile.diamant": 87 };
// la rangée : `groupes`, de gauche à droite, [{ id, texte }] (seulement ceux qui sont montrés) → { k (réduction, 1 au plus), boites :
// { id: { x, w, etoile: [cx, cy] (le centre de l'étoile, px de l'écran), chiffre: [cx, haut, hauteur] (dans la boîte) } } }
export function rangeeCompteurs(groupes, R0 = RANGEE) {
  const larg = (g, k) => Math.max(R0.min, (2 * R0.marge + R0.etoile + R0.ecart) * k + largeurNombre(g.texte, R0.chiffre * k));
  const total = (k) => groupes.reduce((a, g) => a + larg(g, k), 0) + R0.entre * Math.max(0, groupes.length - 1);
  let k = 1;
  while (k > 0.6 && total(k) > R0.droite - R0.gauche) k -= 0.02;
  k = Math.round(k * 100) / 100;
  let x = R0.droite - total(k);
  const boites = {};
  for (const g of groupes) {
    const w = Math.round(larg(g, k)), D = R0.etoile * k, h = R0.chiffre * k, cyb = R0.cy - R0.y;
    const ex = R0.marge * k + D / 2, nx = R0.marge * k + D + R0.ecart * k + largeurNombre(g.texte, h) / 2;
    boites[g.id] = { x: Math.round(x), w, k, etoile: [Math.round(x) + ex, R0.cy], dansBoite: { etoile: [ex, cyb], d: D, chiffre: [nx, cyb - 0.456 * h, h] } };
    x += w + R0.entre;
  }
  return { k, boites };
}
// une étoile de l'atelier, posée à la taille commune, son centre en (cx, cy) (px logiques de la boîte)
export function dessinerEtoileRangee(app, ctx, px, sprite, [cx, cy], d) {
  const q = app.sprites.frame(sprite, 0); if (!q) return;
  // (comme partout : les images des planches sont à la densité de l'écran, `k` s'applique directement à leurs pixels)
  const k = d / ETOILE_PLEINE[sprite];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, cx * px + q.dx * k, cy * px + q.dy * k, q.w * k, q.h * k);
}
// une boîte de la rangée à sa place et à sa largeur (son canvas refait si la largeur change), puis redessinée
export function poserBoite(app, b, x, w) {
  b.style.left = `${x}px`;
  if (parseFloat(b.style.width) !== w) { b.style.width = `${w}px`; const c = b.querySelector("canvas"); if (c) c.width = Math.round(w * app.stage.px); }
  b.repaint();
}
export class StarHud {
  constructor(app, rewards) {
    this.app = app; this.shown = rewards.total; this.pool = []; this.flights = [];
    this.box = spriteBox(app, { x: 960, y: RANGEE.y, w: 170, h: RANGEE.h, cls: "hud stars", still: true, paint: (ctx, px) => this.paint(ctx, px) });
    // (lot « Réserves d'étoiles et étoiles arc-en-ciel ») les réserves d'étoiles arc-en-ciel et de diamant, à sa droite
    this.reserves = rewards?.c ? new Reserves(app, this, rewards) : null;
    this.disposer();
    app.ocean.front.push((t) => this.tick(t));
  }
  // la rangée : le compteur des étoiles de mer, puis les réserves montrées (session/reserves.js, `montrees`)
  // (relecture du lot : sur leur plaque claire, l'étoile et le nombre touchaient le bord ; la plaque prend une marge de plus, la rangée
  // est réduite d'autant si elle ne tient plus)
  rangee(n = this.reserves?.n) {
    return rangeeCompteurs([{ id: "mer", texte: String(this.shown) }, ...(this.reserves ? this.reserves.montrees(n).map((s) => ({ id: s, texte: String(n[s]) })) : [])], this.sombre ? { ...RANGEE, marge: 14, entre: 2 } : RANGEE);
  }
  disposer() {
    const r = this.rangee(); this.place = r.boites;
    const b = r.boites.mer; poserBoite(this.app, this.box, b.x, b.w);
    this.reserves?.poser(r.boites);
  }
  // le centre de l'étoile de mer du compteur (où volent les étoiles gagnées)
  centre() { return this.place?.mer?.etoile ?? [1010, 72]; }
  paint(ctx, px) {
    const b = this.place?.mer; if (!b) return;
    const { etoile, d, chiffre: [nx, haut, h] } = b.dansBoite, s = String(this.shown);
    // (lot « Décisions sur les constats de l'agent », décision 8 ; constat 14 : par temps d'orage, dans l'étal, le nombre bleu nuit
    // se fondait dans le ciel sombre) sur un fond sombre (`app.hudSombre()`), une petite plaque claire derrière le compteur
    if (this.sombre) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawPanel(ctx, 2, 18, b.w - 4, 64); }
    dessinerEtoileRangee(this.app, ctx, px, "etoile", etoile, d);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    R.drawNumber(ctx, s, nx, haut, h, { w: 4.8 });
  }
  set(v) { if (v === this.shown) return; const n0 = String(this.shown).length; this.shown = v; if (String(v).length !== n0) this.disposer(); else this.box.repaint(); }
  // n étoiles gagnées, qui partent de `from` (px logiques) ; la promesse se résout à la dernière arrivée
  fly(n, from, { gap = 110, dur = 750 } = {}) {
    if (n <= 0) return Promise.resolve();
    const k = Math.min(n, 10), per = Array.from({ length: k }, (_, i) => Math.floor((n * (i + 1)) / k) - Math.floor((n * i) / k));
    return Promise.all(per.map((v, i) => new Promise((res) => {
      const a = this.pool.pop() ?? this.app.ocean.spriteActor(this.app.ocean.frontEl, "etoile");
      a.draw(0); a.show(false);
      const t0 = performance.now() / 1000 + (i * gap) / 1000, dx = (i % 2 ? 1 : -1) * (30 + 12 * i);
      this.flights.push({ a, t0, dur: dur / 1000, from, to: this.centre(), dx, done: () => { if (i === 0) this.app.sound?.play("etoile"); this.set(this.shown + v); pop(this.box); this.pool.push(a); res(); } });
    })));
  }
  tick(t) {
    // (décision 8) le fond derrière le compteur est-il sombre ? relu deux fois par seconde
    if (!(t - (this.vuSombre ?? -1) < 0.5)) { this.vuSombre = t; const s = !!this.app.hudSombre?.(); if (s !== !!this.sombre) { this.sombre = s; this.disposer(); } }
    this.reserves?.suivre();
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

// ---------------------------------------------------------------- la récompense et « à demain »
// Le bilan des étoiles de la séance : une grande étoile au milieu et le nombre gagné, qui monte pendant
// que la voix le dit ; puis les dix étoiles de la séance terminée s'envolent vers le compteur ; puis les
// bonus (série et son coquillage, étoile de diamant, étoiles arc-en-ciel), les coquillages des occasions (zone, légendaire),
// les arrivages, l'invitation et le bouton de fin (la boutique ou le récif). « À demain » vient ensuite (main.js).
export async function reward(app, { session, hud }) {
  const { voice, text, ocean } = app, E = session.c.etoiles, earned = session.rec.etoiles;
  const phrase = (n) => (n === 1 ? text.data.uneEtoile : fill(text.data.desEtoiles, { n }));
  let shown = 0;
  const tally = spriteBox(app, { x: 720 - 210, y: 300 - 115, w: 430, h: 240, cls: "hud tally", still: true, paint: (ctx, px) => {
    app.sprites.draw(ctx, "bilan", 0, 210, 115);
    ctx.setTransform(px, 0, 0, px, 0, 0); const t = String(shown); R.drawNumber(ctx, t, 282, 70, t.length > 2 ? 76 : 92, { w: 12, seed: 810 });
  } });
  tally.classList.add("pop");
  ocean.mascotte.play("rejouir", { fort: true }); // (lot « Mascotte » : la grande joie de la fin de séance)
  // (lot 3 bis, R21 : jamais « tu as gagné 0 étoiles » : une séance sans étoile est saluée sans nombre)
  // (lot « Correctifs de la tablette », point 5 : au-delà de `bilanDitMax` étoiles, le nombre n'a pas de phrase fabriquée et
  // passait par la synthèse du navigateur, une autre voix : une phrase sans nombre, le nombre reste écrit)
  // (lot « Correctifs du 5 novembre » : chaque phrase de la récompense devient la consigne ; avant, la mascotte touchée redisait la
  // dernière question de la séance)
  const said = voice.say(!earned ? text.data.recompenseZero : earned > (E.bilanDitMax ?? 60) ? text.data.recompenseBeaucoup : fill(text.pick("recompense"), { etoiles: phrase(earned) }), { instruction: true });
  for (let i = 1; i <= 20 && shown < earned; i++) { shown = Math.round((earned * i) / 20); tally.repaint(); await wait(60); }
  shown = earned; tally.repaint();
  await said;
  await session.stars(E.seanceTerminee, "séance terminée");
  // (lot 3 bis, B6) la grande planche des cartes se charge pendant le bilan et les bonus : le coquillage est à toucher dès
  // que la voix a fini (avant, son chargement laissait jusqu'à 1,5 s sans rien à toucher ni à entendre)
  if (wantsCards(app)) app.sprites.load("cartes");
  const flown = hud.fly(E.seanceTerminee, [635, 305]);
  await voice.say(text.pick("seanceFinie"), { instruction: true }); await flown;
  await wait(400);
  await bonuses(app, { session, hud });
  tally.remove(); document.querySelectorAll(".special").forEach((e) => e.remove());
  await shells(app, { session, hud });
  // (lot « La boutique du récif ») les arrivages de la semaine, l'invitation à la boutique et le bouton de fin
  app.finVers = await finRecompense(app);
}

// la série (une séance sur trois : 5 étoiles) et son coquillage (toutes les 10 séances : il fait briller une créature, ou
// rapporte 20 étoiles si toutes brillent déjà), l'étoile de diamant (4 semaines réussies ; nom interne : dorée), les étoiles
// arc-en-ciel (un niveau franchi pendant la séance, et celles gagnées depuis en entraînement libre) ; les étoiles spéciales
// s'alignent sous le bilan
async function bonuses(app, { session, hud }) {
  const { rewards, store, voice, text, ocean, stage } = app, specials = [];
  if (!rewards.c) return;
  app.starFrom = [635, 305];
  const b = await rewards.endOfSession(session.rec.debut);
  if (b) { const said = voice.say(fill(text.data.serieBonus, { n: b }), { instruction: true }); await session.stars(b, "série"); await said; await wait(600); }
  // (lot « La boutique du récif ») le coquillage de la série
  if (rewards.coquillageSerie) {
    rewards.coquillageSerie = false; session.rec.coquillageSerie = true; await session.save();
    const g = await rewards.serieShell(app.rnd, Date.now());
    if (g.etoiles) { ocean.mascotte.play("rejouir"); const said = voice.say(fill(text.data.coquillageSerieEtoiles, { n: g.etoiles }), { instruction: true }); await session.stars(g.etoiles, "coquillage de la série"); await said; await wait(500); }
    else { await app.sprites.load("cartes"); (session.rec.brillantes ??= []).push(g.carte.id); await session.save(); await openShell(app, { session, hud, say: text.data.coquillageSerie, got: g }); }
  }
  const others = (await store.all("seances")).filter((x) => x.terminee && !x.libre && x.id !== session.id).map((x) => x.debut);
  if (goldenStar([...others, session.rec.debut], session.rec.debut, rewards.c.semaine)) { await rewards.special("dorees"); session.rec.doree = true; await session.save(); specials.push(["etoile.diamant", text.data.etoileDoree]); }
  const libres = await rewards.collectFree();
  if (libres) { session.rec.arcLibre = libres; await session.save(); }
  for (const [i, [sprite, say]] of specials.entries()) {
    // l'étoile de diamant, en grand, avec son reflet et ses étincelles (dessinés en direct, runtime.js, drawDiamantVif)
    const S = 170, el = spriteBox(app, { x: 640 - S / 2 + (i - (specials.length - 1) / 2) * 190, y: 410, w: S, h: S, cls: "hud special pop", still: true, paint: (ctx, px) => app.sprites.draw(ctx, sprite, 0, S / 2, S / 2) });
    const vif = (t) => { if (!el.isConnected) { stage.ticks.delete(vif); return; } el.repaint((ctx, px) => { const q = app.sprites.frame(sprite, 0), k = 1.5; if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (S / 2) * px + q.dx * k, (S / 2) * px + q.dy * k, q.w * k, q.h * k); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawDiamantVif(ctx, S / 2, S / 2, 66, t); }); };
    stage.ticks.add(vif);
    // (lot « Réserves d'étoiles et étoiles arc-en-ciel ») la réserve montre encore le nombre d'avant ; l'étoile y vole après sa phrase
    const res = hud.reserves; if (res && sprite === "etoile.diamant") res.set("diamant", rewards.doreesDispo - 1);
    app.sound?.play("brillante"); ocean.mascotte.play("rejouir", { fort: true }); await voice.say(say, { instruction: true }); await wait(500);
    if (res && sprite === "etoile.diamant") { const [x, y] = [parseFloat(el.style.left) + S / 2, parseFloat(el.style.top) + S / 2]; el.style.visibility = "hidden"; await volVersReserve(app, "etoile.diamant", [x, y], res.centre("diamant"), { k: 1.1 }); res.plus("diamant"); }
  }
  // (lot 3 bis, B6 ; R13) les étoiles arc-en-ciel : une seule phrase, au pluriel s'il y en a plusieurs ; elles apparaissent
  // sous le bilan puis volent, avec leur traînée, jusqu'à l'album (en bas à droite), pendant que la voix parle ; le
  // coquillage est à toucher tout de suite après
  const arcs = (session.rec.arcEnCiel ?? 0) + libres;
  if (arcs) {
    ocean.mascotte.play("rejouir");
    // (lot « Réserves d'étoiles et étoiles arc-en-ciel ») elles volent jusqu'à leur réserve, à côté du compteur, qui avance d'un
    // cran à chaque arrivée ; toutes les zones ouvertes, la phrase s'arrête à « Et une étoile arc-en-ciel ! » (« Un jour, elle
    // t'ouvrira un nouveau coin du récif » ne serait plus vrai)
    // (relecture du lot, constat 2 : « Un jour, elles t'ouvriront… », puis une zone s'ouvrait aussitôt) quand une zone va s'ouvrir à
    // cette récompense, la phrase s'arrête aussi au nombre ; (constat 1 : le bilan, avec son étoile de mer jaune, est retiré le temps
    // des étoiles arc-en-ciel)
    const t = arcs === 1 ? text.data.etoileArc : fill(text.data.etoilesArc, { n: arcs }), res = hud.reserves;
    const ouvrira = !!rewards.nextZone() && rewards.arcDispo > 0;
    document.querySelectorAll(".hud.tally").forEach((e) => e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }));
    const said = voice.say(rewards.fermees && !ouvrira ? t : sentences(t)[0], { instruction: true });
    if (res) { res.set("arc", rewards.arcDispo - arcs); await flyRainbowStars(app, arcs, { from: [640, 500 + (specials.length ? 120 : 0)], to: res.centre("arc"), album: false, arrivee: () => res.plus("arc") }); }
    else await flyRainbowStars(app, arcs, { from: [640, 500 + (specials.length ? 120 : 0)] });
    await said;
  }
}
// les étoiles arc-en-ciel qui volent vers l'album : chacune avec sa traînée (sprite « etoile.trainee », ancrée à la tête),
// tournée dans le sens du vol ; composé par le navigateur (animations CSS), rien n'est redessiné pendant le vol
export const ALBUM_AT = [1165, 650];
// (lot « Décisions sur les constats de l'agent », décision 8 ; constat 15 : « Et une étoile arc-en-ciel ! » et l'écran ne la montrait
// nulle part : elle filait vers un coin vide) l'album est posé à l'arrivée (`album`), comme à l'ouverture d'une zone ; il sautille à
// chaque étoile qui y entre, puis s'en va
// (lot « Réserves d'étoiles et étoiles arc-en-ciel ») `to` : la réserve, à côté du compteur, sans l'album ; `arrivee` : à chaque étoile
// arrivée (la réserve avance d'un cran ; au-delà de 9 étoiles dessinées, la dernière apporte le reste)
export async function flyRainbowStars(app, n, { from = [640, 500], to = ALBUM_AT, gap = 110, k = app.vitesse ?? 1, album = true, arrivee = null } = {}) {
  const { sprites } = app, W = 240, H = 130, hx = 180, hy = 65, els = [];
  const shown = Math.min(n, 9);
  const livre = album ? spriteBox(app, { x: to[0] - 90, y: to[1] - 90, w: 180, h: 180, cls: "hud special arc-album pop", still: true, paint: (ctx) => sprites.draw(ctx, "album", 0, 90, 90) }) : null;
  for (let i = 0; i < shown; i++) {
    const x = from[0] + (i - (shown - 1) / 2) * Math.min(gap, 900 / shown), y = from[1], a = Math.atan2(to[1] - y, to[0] - x);
    // d'abord l'étoile seule ; la traînée est ajoutée au départ du vol
    const el = spriteBox(app, { x: x - hx, y: y - hy, w: W, h: H, cls: "hud special etoile-vol", still: true, paint: (ctx) => sprites.draw(ctx, "etoile.arc", 0, hx, hy) });
    el.style.transformOrigin = `${hx}px ${hy}px`; el.style.opacity = "0";
    el.fly = { dx: to[0] - x, dy: to[1] - y, a };
    els.push(el);
  }
  // elles apparaissent une à une
  for (const el of els) {
    el.animate([{ transform: `rotate(${el.fly.a}rad) scale(0.3)`, opacity: 0 }, { transform: `rotate(${el.fly.a}rad) scale(1)`, opacity: 1 }], { duration: 260 / k, easing: "ease-out", fill: "forwards" });
    await wait(130 / k);
  }
  await wait(450 / k);
  els.forEach((el) => el.repaint((ctx) => { sprites.draw(ctx, "etoile.trainee", 0, hx, hy); sprites.draw(ctx, "etoile.arc", 0, hx, hy); }));
  const flights = els.map((el, i) => el.animate([
    { transform: `translate(0px, 0px) rotate(${el.fly.a}rad) scale(1)`, opacity: 1 },
    { transform: `translate(${el.fly.dx}px, ${el.fly.dy}px) rotate(${el.fly.a}rad) scale(0.45)`, opacity: 0.15 },
  ], { duration: 900 / k, delay: (i * 120) / k, easing: "cubic-bezier(.5,0,.8,.6)", fill: "forwards" }).finished.catch(() => {}).then(() => { if (livre) pop(livre); if (arrivee) for (let j = 0; j < (i === els.length - 1 ? n - shown + 1 : 1); j++) arrivee(); }));
  await Promise.all(flights);
  els.forEach((e) => e.remove());
  if (livre) { await wait(700 / k); livre.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 / k, fill: "forwards" }); await wait(300 / k); livre.remove(); }
}

// LES COQUILLAGES DES OCCASIONS (lot « La boutique du récif » : plus de coquillages ordinaires, les créatures s'achètent à la
// boutique) : d'abord la zone suivante si elle peut s'ouvrir (une étoile arc-en-ciel), et son premier habitant, une commune tirée
// au hasard, qui sort d'un coquillage ; puis au plus un coquillage de diamant (une étoile de diamant, une légendaire)
// les coquillages auront-ils lieu ? (un coquillage de diamant ou une zone à ouvrir)
const wantsCards = (app) => { const r = app.rewards; return !!r.c && (!!r.goldenCard(Date.now()) || (!!r.nextZone() && r.arcDispo > 0) || (!!r.coquillageSerie && r.collection().some((c) => !c.brillante))); };
export async function shells(app, { session, hud }) {
  const { rewards, sprites, text, rnd } = app, now = () => Date.now();
  if (!rewards.c) return;
  // la planche des cartes (grande) n'est chargée que si elle sert
  if (!(rewards.goldenCard(now()) || (rewards.nextZone() && rewards.arcDispo > 0))) { sprites.unload("cartes"); return; }
  await sprites.load("cartes");
  const z = await rewards.openZone(now(), rnd);
  if (z) {
    (session.rec.zones ??= []).push(z.id); await session.save();
    await zoneCeremony(app, { zone: z, hud });
    if (z.habitant) { (session.rec.cartes ??= []).push(z.habitant.carte.id); await session.save(); await openShell(app, { session, hud, say: text.data.premierHabitant, got: z.habitant }); }
  }
  if (rewards.goldenCard(now())) {
    const got = await rewards.openGolden(rnd, now());
    if (got) {
      (session.rec.cartes ??= []).push(got.carte.id); if (got.parTirage) (session.rec.brillantes ??= []).push(got.carte.id); session.rec.coquillageDore = got.carte.id; await session.save();
      // (lot « Réserves d'étoiles et étoiles arc-en-ciel ») l'étoile de diamant part de sa réserve jusqu'au coquillage
      const res = hud?.reserves; if (res) { const de = res.centre("diamant"); res.moins("diamant"); await volVersReserve(app, "etoile.diamant", de, [640, 640], { k: 0.9 }); }
      await openShell(app, { session, hud, gold: true, say: text.data.coquillageDore, got });
    }
  }
  sprites.unload("cartes");
}
// LA FIN DE LA RÉCOMPENSE (lot « La boutique du récif », décisions du parent du 10 octobre 2026) : en mode Arrivages, les créatures
// arrivées cette semaine (leurs petites images, « De nouvelles créatures sont arrivées à la boutique ! », une fois chacune) ; s'il
// y a de quoi acheter, « Tu peux choisir une créature à la boutique ! » ; puis le bouton de fin, en bas à droite : la boutique
// quand un achat est possible, sinon le récif, et la maison. Renvoie « boutique » ou « recif » (touché), ou null : la maison
// touchée, ou rien touché en `boutique.finAttenteS` secondes (« à demain » vient alors, main.js). (`window.__finSansBouton` : les parcours écrits avant la
// boutique passent le bouton, tests/e2e/navigateur.mjs)
export async function finRecompense(app) {
  const { rewards, voice, text, stage, sprites, ocean } = app;
  if (!rewards.c?.boutique) return null;
  const now = Date.now(), nouvelles = rewards.mode === "arrivages" ? rewards.nouvelles(now) : [];
  if (nouvelles.length) {
    // (leurs petites tuiles : celles de la vitrine, réduites, sans prix)
    await sprites.load("boutique");
    const ids = nouvelles.slice(0, 4), k = 0.8, W = 170 * k, H = 150 * k, G = 22, x0 = 640 - (ids.length * W + (ids.length - 1) * G) / 2, minis = [];
    for (const [i, id] of ids.entries()) {
      const c = rewards.carte(id), tuile = (ctx, px) => { const q = sprites.frame(`boutique.tuile.${c.rarete}`, 0); if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 2 * px + q.dx * k, 2 * px + q.dy * k, q.w * k, q.h * k); };
      const el = spriteBox(app, { x: x0 + i * (W + G) - 2, y: 300, w: W + 14, h: 196 * k + 14, cls: "hud boutique-mini pop", still: true, paint: tuile });
      minis.push(el);
      imageCreature(app, c, 146 * k, 128 * k).then((img) => { if (img && el.isConnected) el.repaint((ctx, px) => { tuile(ctx, px); ctx.drawImage(img, (2 + 12 * k + (146 * k) / 2) * px - img.width / 2, (2 + 12 * k + (128 * k) / 2) * px - img.height / 2 + 12 * k * px); }); });
    }
    ocean.mascotte.play("rejouir");
    await voice.say(text.data.boutique.arrivees, { instruction: true }); await rewards.annoncer(nouvelles);
    await wait(400); minis.forEach((m) => m.remove()); if (!app.boutique?.open) sprites.unload("boutique");
  }
  const versBoutique = rewards.peutAcheter(now);
  if (versBoutique) await voice.say(text.data.boutique.invitation, { instruction: true });
  if (window.__finSansBouton) return null;
  const S = 150, b = spriteBox(app, { x: 1175 - S / 2, y: 688 - S / 2, w: S, h: S, cls: `bubble invite fin-recompense ${versBoutique ? "vers-boutique" : "vers-recif"}`, label: versBoutique ? "la boutique" : "le récif", paint: (ctx, px) => { const q = sprites.frame(versBoutique ? "boutique" : "recif", 0), k = versBoutique ? S / 150 : S / 180; if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (S / 2) * px + q.dx * k, (S / 2) * px + q.dy * k, q.w * k, q.h * k); } });
  voice.instruction = versBoutique ? text.data.boutique.invitation : voice.instruction;
  // (lot « Décisions sur les constats de l'agent », décision 2 : constat 2 de l'agent, environ 50 s sans moyen de revenir) la maison
  // s'ajoute au bouton de fin (main.js, `maisonFin`) : elle ramène tout de suite à « à demain » ; sans toucher, « à demain » vient
  // au bout de `finAttenteS` (15 s)
  const maison = new Promise((res) => { app.finMaison = () => res("maison"); });
  app.maisonFin?.(true);
  const r = await Promise.race([new Promise((res) => onBrief(app, b, () => { pop(b); res(versBoutique ? "boutique" : "recif"); }, versBoutique ? "boutique" : "recif")), maison, wait((rewards.c.boutique.finAttenteS ?? 15) * 1000).then(() => null)]);
  app.finMaison = null; app.maisonFin?.(false);
  await wait(r && r !== "maison" ? 200 : 0); b.remove();
  void stage;
  return r === "maison" ? null : r;
}
// l'ouverture d'une zone (docs/SPEC-LOT2.md, « Zones ») : le dos de la zone, assombri, au milieu ; une étoile
// arc-en-ciel vole jusqu'à lui et il s'éclaire ; la voix dit que la zone est ouverte ; puis la carte file
// vers l'album (le livre, en bas à droite)
export async function zoneCeremony(app, { zone, hud }) {
  const { voice, text, ocean, sprites } = app;
  voice.stop();
  const back = await cardElement(app, { id: `dos-${zone.id}`, zone: zone.id, rarete: "commune", nom: zone.nom }, { x: 640 - CARD.W / 2, y: 150, front: "dos", back: "dos" });
  back.classList.add("zone-closed", "enter");
  const book = spriteBox(app, { x: 1080 - 90, y: 650 - 90, w: 180, h: 180, cls: "hud zone-book pop", still: true, paint: (ctx) => sprites.draw(ctx, "album", 0, 90, 90) });
  await wait(900);
  // l'étoile arc-en-ciel vole du bas de l'écran jusqu'au dos de la zone
  const star = ocean.spriteActor(ocean.frontEl, "etoile.arc");
  star.draw(0); star.show(false);
  // (lot « Réserves d'étoiles et étoiles arc-en-ciel ») elle part de sa réserve, à côté du compteur, qui descend d'un cran
  const res = hud.reserves, de = res ? res.centre("arc") : [640, 760]; res?.moins("arc");
  await new Promise((done) => hud.flights.push({ a: star, t0: performance.now() / 1000, dur: 1.1, from: de, to: [640, 370], dx: -60, done }));
  star.show(false); star.remove(); ocean.actors.splice(ocean.actors.indexOf(star), 1);
  back.classList.remove("zone-closed"); app.sound?.play("zone");
  const glint = ocean.spriteActor(ocean.frontEl, "eclat"), t0 = performance.now() / 1000, tick = (t) => { const u = (t - t0) / 1.4; glint.show(u < 1); if (u < 1) glint.moveTo(640, 370, 0.5 + 1.2 * Math.sin(Math.PI * u), Math.round(Math.sin(Math.PI * u) * 20) / 20); };
  glint.draw(0); ocean.front.push(tick);
  ocean.mascotte.play("rejouir");
  await voice.say(zone.ouvertureLu ?? text.data.etoileArc, { instruction: true });
  await wait(400);
  back.classList.add("to-album"); await wait(950);
  back.remove(); book.remove();
  ocean.front.splice(ocean.front.indexOf(tick), 1); glint.show(false); glint.remove(); ocean.actors.splice(ocean.actors.indexOf(glint), 1);
}
// ce que dit la voix quand la carte est retournée : son nom (et « légendaire »), « elle est brillante », son
// anecdote et où elle vit (le récif si elle y est dessinée, sinon l'album) ; pour un doublon, « encore … »
export function cardSpeech(text, got, inReef) {
  const nom = got.carte.nomLu ?? got.carte.nom, d = text.data;
  const shiny = got.devientBrillante ? d.carteBrillanteTirage : null;
  // (décision du parent du 5 octobre 2026 : jamais de doublon) une créature possédée qui devient brillante : « C'est le
  // crabe ! Oh ! Elle est brillante ! » (des phrases dont la voix existe déjà)
  if (!got.nouvelle) return [fill(d.carteNouvelle, { nom }), shiny].filter(Boolean).join(" ");
  return [got.carte.rarete === "legendaire" ? d.carteLegendaire : null, fill(d.carteNouvelle, { nom }), shiny, got.carte.anecdote, inReef ? d.carteRecif : d.carteAlbum].filter(Boolean).join(" ");
}
// un coquillage des occasions (la série, le premier habitant d'une zone, une légendaire dans le coquillage de diamant) : la voix
// l'annonce (`say`) ; l'enfant le touche (ou il s'ouvre tout seul au bout de quelques secondes) ; il s'entrouvre, la perle
// brille, la carte en sort et se retourne (une brillante s'irise dès le retournement) ; la voix dit le nom (et l'anecdote d'une
// créature nouvelle) ; la coche verte (ou le temps) referme le tout. `got` : ce que le coquillage donne, déjà rangé dans la
// collection (rewards.js : serieShell, openZone, openGolden)
export async function openShell(app, { session, hud, gold = false, say, got, C = [640, 640] }) {
  const { voice, text, ocean, rewards, sprites } = app;
  void session; void hud;
  const shell = ocean.spriteActor(ocean.frontEl, gold ? "coquillage.diamant" : "coquillage"), glint = ocean.spriteActor(ocean.frontEl, "eclat");
  let frame = 0, t0 = null, wob = true, gl = null;
  shell.draw(0); glint.show(false);
  const tick = (t) => {
    if (t0 === null) t0 = t;
    shell.draw(frame); shell.moveTo(C[0] + (wob ? 4 * Math.sin((t - t0) * 9) * Math.max(0, Math.sin((t - t0) * 1.6)) : 0), C[1]);
    if (gl !== null) { const u = (t - gl) / 1.4; glint.show(u < 1); if (u < 1) glint.moveTo(C[0], C[1] + 8, 0.35 + 0.65 * Math.sin(Math.PI * u), Math.round(Math.sin(Math.PI * u) * 20) / 20); }
  };
  ocean.front.push(tick);
  voice.stop(); ocean.mascotte.play("rejouir"); voice.say(say, { instruction: true });
  // toucher le coquillage (ou attendre)
  const tap = document.createElement("button"); tap.className = "bubble shelltap invite"; tap.setAttribute("aria-label", "ouvrir le coquillage");
  Object.assign(tap.style, { left: `${C[0] - 130}px`, top: `${C[1] - 110}px`, width: "260px", height: "200px" }); app.stage.ui.append(tap);
  await Promise.race([new Promise((r) => onBrief(app, tap, r, "coquillage")), wait(9000)]);
  tap.remove(); wob = false; voice.stop(); voice.unlock();
  const opened = voice.say(text.data.coquillageOuvre); app.sound?.play("coquillage");
  for (let f = 1; f < 12; f++) { frame = f; await wait(1000 / 12); }
  gl = performance.now() / 1000; await wait(1300);
  // la carte sort du coquillage, face cachée, puis se retourne
  const owned = rewards.owned[got.carte.id];
  const el = await cardElement(app, got.carte, { x: C[0] - CARD.W / 2, y: 128, front: "dos", back: "recto", brillante: owned.brillante });
  el.classList.add("enter"); await wait(900); await opened;
  el.flip(true); app.sound?.play("carte"); if (owned.brillante) setTimeout(() => app.sound?.play("brillante"), 350);
  ocean.mascotte.play("rejouir"); await wait(800);
  // toutes les créatures vivent dans le récif vivant (session/recif.js) : « Cette créature va vivre dans ton récif ! »
  const inReef = true;
  await voice.say(cardSpeech(text, got, inReef), { instruction: true });
  const ok = spriteBox(app, { x: 1000 - 80, y: 560, w: 160, h: 160, cls: "bubble check invite", label: "c'est bon", paint: (ctx) => sprites.draw(ctx, "valider", 0, 80, 80) });
  await Promise.race([new Promise((r) => onBrief(app, ok, r, "cestBon")), wait(20000)]);
  ok.remove(); voice.stop();
  el.classList.add("leave"); await wait(650); el.remove();
  ocean.front.splice(ocean.front.indexOf(tick), 1); shell.show(false); glint.show(false); shell.remove(); glint.remove();
  ocean.actors.splice(ocean.actors.indexOf(shell), 1); ocean.actors.splice(ocean.actors.indexOf(glint), 1);
  return got;
}
// « à demain » : la mascotte salue, la lune se lève. La lune est un décor, pas un bouton (lot 1 bis) :
// sans bulle, elle flotte doucement au-dessus des bulles de l'écran d'accueil, et rien ne se passe si
// on la touche. La voix dit « À demain ! » quand la séance vient de finir.
// (lot « Recette de l'enfant », point 0.6 : la phrase n'est plus attendue. L'accueil attendait la fin de « À demain ! »
// avant d'accepter les touchers : pendant ce temps, les galets étaient là, et les toucher ne faisait rien. Un galet touché
// coupe la phrase, comme partout.)
export function goodNight(app, { first = true } = {}) {
  const { voice, text, ocean } = app;
  const moon = spriteBox(app, { x: 640 - 120, y: 250 - 110, w: 240, h: 220, cls: "hud moon", still: true, paint: (ctx) => app.sprites.draw(ctx, "lune.decor", 0, 120, 110) });
  // (relecture du lot « Décisions sur les constats de l'agent », R7 : la bulle « à demain » cachait la lune) la bulle l'évite, comme ce
  // dont parle la voix (engine/bulle.js ; retirée de l'écran, la lune n'est plus une zone)
  app.bulle?.eviter("lune", moon);
  // (lot « Correctifs du 5 novembre », relecture : « à demain » n'est pas la consigne ; touchée, la mascotte redit celle de l'accueil,
  // « La séance du jour est finie. Touche une bulle… », posée par showHome)
  if (first) { ocean.mascotte.play("saluer"); voice.say(text.pick("aDemain")); }
  return moon;
}
