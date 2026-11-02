// LES RÉSERVES D'ÉTOILES (lot « Réserves d'étoiles et étoiles arc-en-ciel », décisions du parent du 2 novembre 2026 ; docs/SPEC.md,
// section 10 ; maquette validée : art/reserves/, docs/maquettes/reserves/README.md). À droite du compteur d'étoiles de mer, là où
// il est affiché (l'accueil, les exercices, la récompense, la boutique ; ni le récif vivant ni les leçons, où il est caché) : une
// petite étoile arc-en-ciel et une petite étoile de diamant, chacune avec son nombre en réserve, masquée tant qu'elle vaut 0.
//  - LA TOUCHER fait dire combien il y en a et ce qu'elles débloquent (texteReserve). Elles ne réagissent au toucher qu'à
//    l'accueil, dans la boutique, à la récompense et dans l'accueil en pause (app.reservesTouchables, main.js) : pendant une
//    question, le seul toucher hors réponse reste la mascotte (décision du parent du 2 novembre 2026, à la validation) ;
//  - LE NOMBRE MONTRÉ n'est pas toujours celui de la sauvegarde : pendant une séance, il reste celui du début (les étoiles gagnées
//    sont annoncées à la récompense), puis il avance d'un cran à chaque étoile qui arrive en volant (screens.js) ; ailleurs, il
//    suit la sauvegarde (une étoile dépensée à la boutique : la réserve descend quand elle s'envole) ;
//  - la bulle de la mascotte évite la réserve touchée (engine/bulle.js, eviter) : elle ne couvre jamais ce que l'enfant touche.
// Les règles des phrases (texteReserve, etatReserves) sont testées : tests/unit/reserves.test.mjs.
import * as R from "../art/runtime.js";
import { onBrief, pop, spriteBox } from "../engine/ui.js";
import { fill } from "../modules/numberline/screen.js";
import { zoneDone } from "./rewards.js";

// deux cases de 68 × 100 px logiques (cibles d'au moins 64 px), à droite du compteur (960 à 1130) ; une réserve vide n'est pas
// montrée : s'il n'y a que les étoiles de diamant, leur case prend la première place
export const CASE = { x: 1136, y: 22, w: 68, h: 100, pas: 72 };
export const SORTES = ["arc", "diamant"];
// le centre de l'étoile d'une réserve, à la case `k` (0 ou 1)
export const centreCase = (k) => [CASE.x + k * CASE.pas + CASE.w / 2, CASE.y + 34];

// L'ÉTAT D'UNE RÉSERVE, pour ce qu'en dit la mascotte. `n` : le nombre montré.
//   arc : { n, fermees (zones encore fermées : autant d'étoiles gardées), zonePrete (la zone en cours est complète : une zone va
//         s'ouvrir) } ;
//   diamant : { n, maintenant (une légendaire peut sortir à la prochaine récompense), zone (la zone de la prochaine légendaire,
//         ou null : elles sont toutes dans le récif) }
export function etatReserves(rewards, n) {
  const C = rewards.c, ouvertes = rewards.zones?.ouvertes ?? [], fermees = rewards.fermees, last = ouvertes.at(-1);
  const leg = C.cartes.find((c) => c.rarete === "legendaire" && !rewards.owned[c.id]);
  return {
    arc: { n: n.arc, fermees, zonePrete: fermees > 0 && !!last && zoneDone(C.cartes, rewards.owned, last) },
    diamant: { n: n.diamant, maintenant: !!rewards.goldenCard?.(), zone: leg ? C.zones.find((z) => z.id === leg.zone) ?? null : null },
  };
}
// CE QUE DIT LA MASCOTTE quand on touche une réserve (textes.json, reserves ; cartes.json, reserves : jusqu'où les nombres sont dits)
export function texteReserve(T, cartes, sorte, e) {
  const X = T.reserves, M = cartes.reserves ?? {}, j = (...xs) => xs.filter(Boolean).join(" ");
  if (sorte === "arc") {
    const nb = e.n === 1 ? X.arcUne : e.n > (M.arcDitMax ?? 50) ? X.arcBeaucoup : fill(X.arcN, { n: e.n });
    const role = !e.fermees ? (e.n === 1 ? X.arcBrillerUne : X.arcBriller) : e.n > e.fermees ? X.arcZonesEtBriller : e.n === 1 ? X.arcProchaineZone : X.arcProchainesZones;
    return j(nb, role, e.zonePrete ? T.boutique.zoneBientot : null);
  }
  const nb = e.n === 1 ? X.diamantUne : e.n > (M.diamantDitMax ?? 15) ? X.diamantBeaucoup : fill(X.diamantN, { n: e.n });
  const role = !e.zone ? X.diamantTout : e.maintenant ? X.diamantMaintenant : fill(e.n === 1 ? X.diamantQuandUne : X.diamantQuand, { zone: e.zone.duLu ?? e.zone.nom });
  return j(nb, role);
}

// (lot « Réserves d'étoiles et étoiles arc-en-ciel ») UNE ÉTOILE QUI VOLE d'un point à un autre (vers sa réserve, ou depuis elle), en
// arc, en tournant ; composé par le navigateur, rien n'est redessiné pendant le vol
export async function volVersReserve(app, sprite, [x0, y0], [x1, y1], { k = 0.7, dur = 900 } = {}) {
  const S = 140, el = spriteBox(app, { x: x0 - S / 2, y: y0 - S / 2, w: S, h: S, cls: "hud special etoile-vol", still: true, paint: (ctx, px) => { const q = app.sprites.frame(sprite, 0); if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (S / 2) * px + q.dx * k, (S / 2) * px + q.dy * k, q.w * k, q.h * k); } });
  const mx = (x0 + x1) / 2 + (x1 > x0 ? -80 : 80), my = Math.min(y0, y1) - 70, kf = [], v = app.vitesse ?? 1, fin = x1 > 1000 && y1 < 200 ? 0.45 : 1;
  for (let j = 0; j <= 16; j++) { const u = j / 16, x = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u * u * x1, y = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * my + u * u * y1; kf.push({ transform: `translate(${x - x0}px, ${y - y0}px) rotate(${u * 200}deg) scale(${1 + (fin - 1) * u})` }); }
  await el.animate(kf, { duration: dur / v, easing: "cubic-bezier(.45,.05,.55,.95)", fill: "forwards" }).finished.catch(() => {});
  el.remove();
}

// LES DEUX CASES, posées par le compteur (screens.js, StarHud) ; leur visibilité suit celle du compteur
export class Reserves {
  constructor(app, hud, rewards = app.rewards) {
    this.app = app; this.hud = hud;
    this.n = { arc: rewards?.arcDispo ?? 0, diamant: rewards?.doreesDispo ?? 0 };
    this.els = Object.fromEntries(SORTES.map((s) => {
      const e = spriteBox(app, { x: CASE.x, y: CASE.y, w: CASE.w, h: CASE.h, cls: `bubble reserve ${s}`, label: s === "arc" ? "étoiles arc-en-ciel" : "étoiles de diamant", paint: (ctx, px) => this.peindre(s, ctx, px) });
      onBrief(app, e, () => this.toucher(s), null);
      return [s, e];
    }));
    this.placer();
  }
  // la case d'une réserve : l'étoile de l'atelier en haut, son nombre dessous ; sur un fond sombre (l'orage de l'étal), une plaque
  peindre(s, ctx, px) {
    const q = this.app.sprites.frame(s === "arc" ? "etoile.arc" : "etoile.diamant", 0), k = s === "arc" ? 0.6 : 0.56, cx = CASE.w / 2, cy = 34;
    if (this.hud.sombre) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawPanel(ctx, 2, 4, CASE.w - 4, CASE.h - 8); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, cx * px + q.dx * k, cy * px + q.dy * k, q.w * k, q.h * k);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    const t = String(this.n[s]), h = t.length > 1 ? 28 : 32; R.drawNumber(ctx, t, cx, 62 + (32 - h) / 2, h, { w: 4.8, seed: s === "arc" ? 921 : 922 });
  }
  // les cases visibles, de gauche à droite (la case de l'arc-en-ciel d'abord)
  placer() {
    let k = 0;
    for (const s of SORTES) { const e = this.els[s], on = this.n[s] > 0; e.style.display = on ? "" : "none"; if (on) { e.style.left = `${CASE.x + k * CASE.pas}px`; e.k = k++; } }
  }
  // le centre de l'étoile d'une réserve (celle qui n'est pas encore montrée : la place qu'elle prendra)
  centre(s) { return centreCase(s === "arc" ? 0 : this.n.arc > 0 ? 1 : 0); }
  // le nombre montré ; `+1` à l'arrivée d'une étoile (elle sautille), `-1` au départ
  set(s, v) { if (v === this.n[s]) return; this.n[s] = Math.max(0, v); this.els[s].repaint(); this.placer(); }
  plus(s) { this.set(s, this.n[s] + 1); pop(this.els[s]); }
  moins(s) { this.set(s, this.n[s] - 1); }
  // à chaque image (StarHud.tick) : la visibilité du compteur, le toucher permis ou non ; hors séance, le nombre de la sauvegarde
  suivre() {
    const { app, hud } = this, vis = hud.box.style.visibility, mode = app.modeEcran?.() ?? null, r = app.rewards;
    for (const s of SORTES) { const e = this.els[s]; if (e.style.visibility !== vis) e.style.visibility = vis; e.classList.toggle("inerte", !(app.reservesTouchables?.() ?? true)); }
    if (r && mode !== "seance" && mode !== "fin") { this.set("arc", r.arcDispo); this.set("diamant", r.doreesDispo); }
    if (this.sombre !== !!hud.sombre) { this.sombre = !!hud.sombre; SORTES.forEach((s) => this.els[s].repaint()); }
  }
  // TOUCHER UNE RÉSERVE : elle sautille, la mascotte dit combien il y en a et ce qu'elles débloquent ; la bulle part de la mascotte
  // et évite la réserve touchée
  toucher(s) {
    const { app } = this, { voice, bulle, text, cartes, rewards } = app;
    if (!(app.reservesTouchables?.() ?? true) || !rewards?.c) return;
    pop(this.els[s]);
    const t = texteReserve(text.data, cartes, s, etatReserves(rewards, this.n)[s]);
    voice.stop(); bulle.eviter?.("reserve", this.els[s]);
    voice.say(t).finally?.(() => bulle.eviter?.("reserve", null));
  }
}
