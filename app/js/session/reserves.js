// LES RÉSERVES D'ÉTOILES (lot « Réserves d'étoiles et étoiles arc-en-ciel », décisions du parent du 2 novembre 2026 ; docs/SPEC.md,
// section 10 ; maquette validée : art/reserves/, docs/maquettes/reserves/README.md). À droite du compteur d'étoiles de mer, là où
// il est affiché (l'accueil, les exercices, la récompense, la boutique ; ni le récif vivant ni les leçons, où il est caché) : une
// petite étoile arc-en-ciel et une petite étoile de diamant, chacune avec son nombre en réserve, montrée même à 0 (lot « Suites des
// correctifs du 5 novembre », décision du parent du 6 novembre 2026 ; avant, masquée à 0).
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
import { dessinerEtoileRangee, poserBoite } from "./screens.js";

// (lot « Correctifs du 5 novembre ») les deux réserves sont posées par la rangée des compteurs (screens.js, rangeeCompteurs), à droite
// du compteur d'étoiles de mer, chaque étoile à gauche de son nombre ; les deux sont toujours montrées, même à 0 : les trois compteurs
// sont toujours visibles (décision du parent du 6 novembre 2026, lot « Suites des correctifs du 5 novembre » ; le 5 novembre, le
// diamant seul ; avant, masquées à 0 toutes les deux)
export const SORTES = ["arc", "diamant"];
export const toujoursMontree = () => true;
// les réserves montrées, de gauche à droite, pour les nombres `n`
export const reservesMontrees = (n) => SORTES.filter((s) => toujoursMontree(s) || n[s] > 0);

// L'ÉTAT D'UNE RÉSERVE, pour ce qu'en dit la mascotte. `n` : le nombre montré.
//   arc : { n, fermees (zones encore fermées : autant d'étoiles gardées), zonePrete (la zone en cours est complète : une zone va
//         s'ouvrir), prochaine (la prochaine zone à ouvrir, ou null) } ;
//   diamant : { n, maintenant (une légendaire peut sortir à la prochaine récompense), zone (la zone de la prochaine légendaire,
//         ou null : elles sont toutes dans le récif) }
export function etatReserves(rewards, n) {
  const C = rewards.c, ouvertes = rewards.zones?.ouvertes ?? [], fermees = rewards.fermees, last = ouvertes.at(-1);
  const leg = C.cartes.find((c) => c.rarete === "legendaire" && !rewards.owned[c.id]);
  return {
    arc: { n: n.arc, fermees, zonePrete: fermees > 0 && !!last && zoneDone(C.cartes, rewards.owned, last), prochaine: fermees > 0 ? C.zones.find((z) => !ouvertes.includes(z.id)) ?? null : null },
    diamant: { n: n.diamant, maintenant: !!rewards.goldenCard?.(), zone: leg ? C.zones.find((z) => z.id === leg.zone) ?? null : null },
  };
}
// CE QUE DIT LA MASCOTTE quand on touche une réserve (textes.json, reserves ; cartes.json, reserves : jusqu'où les nombres sont dits)
export function texteReserve(T, cartes, sorte, e) {
  const X = T.reserves, M = cartes.reserves ?? {}, j = (...xs) => xs.filter(Boolean).join(" ");
  if (sorte === "arc") {
    // (lot « Suites des correctifs du 5 novembre ») à 0 : ce qu'elles ouvriront, en les nommant (la phrase de l'album pour la prochaine
    // zone fermée : « Le récif de corail s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. » ; relecture du lot, constat 1 : « Elles
    // ouvriront… » ne disait pas de quelle étoile on parlait), puis comment en gagner une (la phrase du diamant à 0, sans règle exacte :
    // décision du parent du 6 novembre 2026) ; toutes les zones ouvertes, à quoi elles servent ; aucune phrase nouvelle
    // (lot « Nouveaux boutons, mascotte du récif et étoiles », décision du parent du 7 novembre 2026) toutes les zones ouvertes, à 0 :
    // « Tu n'as pas encore d'étoile arc-en-ciel. » (avant : « Elles font briller tes créatures, à la boutique. », sans dire de quelles
    // étoiles on parlait), puis comment en gagner une
    if (!e.n) return j(e.prochaine?.fermeeLu ?? (!e.fermees ? X.arcZero : X.arcProchainesZones), X.diamantGagner, e.zonePrete ? T.boutique.zoneBientot : null);
    const nb = e.n === 1 ? X.arcUne : e.n > (M.arcDitMax ?? 50) ? X.arcBeaucoup : fill(X.arcN, { n: e.n });
    const role = !e.fermees ? (e.n === 1 ? X.arcBrillerUne : X.arcBriller) : e.n > e.fermees ? X.arcZonesEtBriller : e.n === 1 ? X.arcProchaineZone : X.arcProchainesZones;
    return j(nb, role, e.zonePrete ? T.boutique.zoneBientot : null);
  }
  // (lot « Correctifs du 5 novembre » : la réserve de diamant est montrée même à 0) à 0, comment en gagner une, ou rien de plus si
  // toutes les légendaires sont déjà là
  if (!e.n) return e.zone ? j(X.diamantZero, X.diamantGagner) : X.diamantTout;
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

// LES DEUX CASES, posées par la rangée des compteurs (screens.js, StarHud) ; leur visibilité suit celle du compteur
export class Reserves {
  constructor(app, hud, rewards = app.rewards) {
    this.app = app; this.hud = hud; this.place = {};
    this.n = { arc: rewards?.arcDispo ?? 0, diamant: rewards?.doreesDispo ?? 0 };
    this.els = Object.fromEntries(SORTES.map((s) => {
      const e = spriteBox(app, { x: 1136, y: 22, w: 70, h: 100, cls: `bubble reserve ${s}`, label: s === "arc" ? "étoiles arc-en-ciel" : "étoiles de diamant", paint: (ctx, px) => this.peindre(s, ctx, px) });
      onBrief(app, e, () => this.toucher(s), null);
      return [s, e];
    }));
  }
  montrees(n = this.n) { return reservesMontrees(n); }
  // la case d'une réserve : l'étoile de l'atelier à gauche, son nombre à droite, à la taille de la rangée ; sur un fond sombre (l'orage
  // de l'étal), une plaque
  peindre(s, ctx, px) {
    const b = this.place[s]; if (!b) return;
    const { etoile, d, chiffre: [nx, haut, h] } = b.dansBoite;
    if (this.hud.sombre) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawPanel(ctx, 2, 18, b.w - 4, 64); }
    dessinerEtoileRangee(this.app, ctx, px, s === "arc" ? "etoile.arc" : "etoile.diamant", etoile, d);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    R.drawNumber(ctx, String(this.n[s]), nx, haut, h, { w: 4.8, seed: s === "arc" ? 921 : 922 });
  }
  // (appelé par la rangée) chaque case à sa place ; une case pas montrée est retirée de l'affichage
  // (une case masquée est tout de même dessinée, à la place qu'elle prendra : rien de ce qui existe dans la page n'est laissé vide)
  poser(boites) {
    for (const s of SORTES) {
      const e = this.els[s], b = boites[s] ?? this.hud.rangee({ ...this.n, [s]: Math.max(1, this.n[s]) }).boites[s]; e.style.display = boites[s] ? "" : "none";
      if (b) { this.place[s] = b; poserBoite(this.app, e, b.x, b.w); }
    }
  }
  // le centre de l'étoile d'une réserve (celle qui n'est pas encore montrée : la place qu'elle prendra)
  centre(s) { return this.hud.rangee({ ...this.n, [s]: Math.max(1, this.n[s]) }).boites[s]?.etoile ?? [1170, 72]; }
  // le nombre montré ; `+1` à l'arrivée d'une étoile (elle sautille), `-1` au départ
  set(s, v) { v = Math.max(0, v); if (v === this.n[s]) return; this.n[s] = v; this.hud.disposer(); }
  plus(s) { this.set(s, this.n[s] + 1); pop(this.els[s]); }
  moins(s) { this.set(s, this.n[s] - 1); }
  // à chaque image (StarHud.tick) : la visibilité du compteur, le toucher permis ou non ; hors séance, le nombre de la sauvegarde
  suivre() {
    const { app, hud } = this, vis = hud.box.style.visibility, mode = app.modeEcran?.() ?? null, r = app.rewards;
    // (rien n'est écrit dans la page si rien n'a changé : elle est relue à chaque image)
    const inerte = !(app.reservesTouchables?.() ?? true);
    if (vis !== this.vis || inerte !== this.inerte) { this.vis = vis; this.inerte = inerte; for (const s of SORTES) { const e = this.els[s]; e.style.visibility = vis; e.classList.toggle("inerte", inerte); } }
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
