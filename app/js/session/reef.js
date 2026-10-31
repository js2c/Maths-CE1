// LE RÉCIF VIVANT (docs/SPEC.md, section 10, « Le récif vivant ») : la collection de l'enfant. C'est la maquette du
// récif vivant, validée par le parent, intégrée telle quelle : le module recif/recif-vivant.js est fabriqué par l'atelier
// (art/tools/export-recif.mjs) à partir du script de la maquette ; ses images sont dans assets/recif/. Ce fichier-ci
// fait seulement le lien avec l'application :
//  - les créatures montrées sont celles que l'enfant possède (cartes gagnées), les brillantes scintillent ;
//  - un toucher bref sur une créature ouvre sa carte en grand (cards.js, CardView : la voix dit son nom et son anecdote
//    une fois) ; doigt posé : son halo ; doigt posé puis glissé : on la déplace (oublié à la visite suivante) ; ailleurs,
//    glisser fait défiler la mer (tout cela est le code de la maquette) ;
//  - on entre toujours par le lagon ; la maison ramène à l'accueil ; le livre ouvre l'album ; ni la pieuvre ni le compteur
//    d'étoiles par-dessus la mer (comme dans la maquette) ;
//  - pendant la visite, le lagon de l'application (le fond, lagon.js) se met en pause sous le récif ; les images du récif
//    ne sont chargées qu'à l'entrée et libérées en sortant ; les créatures sont dessinées depuis une image déjà réduite à
//    leur taille d'affichage (recif/reduction.js) ; si l'intervalle moyen entre deux images dépasse 33 ms, le récif s'allège
//    d'un cran : d'abord l'ondulation des créatures, la densité du dessin seulement ensuite (`niveauxRecif`, `alleger`), et
//    chaque allègement est noté dans le journal technique (lot « Netteté du récif »).
// Remplace le récif en pages (lot 3, étape 5) depuis le 5 octobre 2026 (décision du parent).
import { CardView, forgetPictures } from "./cards.js";
import { spriteBox } from "../engine/ui.js";
import { onBrief } from "../engine/ui.js";
import { startRecif } from "../recif/recif-vivant.js";
import { Reductions } from "../recif/reduction.js";
import { noter } from "../engine/journal.js";

const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
// les quatre créatures qui ne portent pas le même nom dans la maquette et dans cartes.json
export const NOM_MAQUETTE = { "benitier-geant": "benitier", "meduse-criniere": "meduse", "ver-tubicole-geant": "ver-tubicole", "requin-groenland": "requin-du-groenland" };
export const NOM_CARTE = Object.fromEntries(Object.entries(NOM_MAQUETTE).map(([c, m]) => [m, c]));
export const versMaquette = (id) => NOM_MAQUETTE[id] ?? id;
export const versCarte = (id) => NOM_CARTE[id] ?? id;
// les créatures du récif (noms de la maquette) : possédées, et brillantes
export function recifCreatures(collection) {
  return { owned: new Set(collection.map((c) => versMaquette(c.id))), brillantes: new Set(collection.filter((c) => c.brillante).map((c) => versMaquette(c.id))) };
}
// (lot « Netteté du récif », constat du parent du 31 octobre 2026 : les créatures très pixelisées sur la tablette, nettes les
// premières secondes puis floues) L'ALLÈGEMENT DU RÉCIF, PAR CRANS. Avant ce lot, passé 3 s au-delà de 20 ms par image, le récif
// passait d'un coup en densité 1 pour toute la visite : dessiné en 1 138 × 711 et étiré sur les 2 560 × 1 600 pixels de la
// tablette. Désormais le seuil est le budget de CLAUDE.md (30 images/s au minimum : 33 ms), et chaque cran retire d'abord ce qui
// coûte sans rien ôter à la netteté ; la densité ne baisse qu'ensuite, d'abord à 1,5, et la densité 1 est le dernier recours :
//  0. complet : la densité de l'écran (au plus 2), l'ondulation des créatures recalculée à chaque image ;
//  1. l'ondulation des créatures recalculée au plus 15 fois par seconde et au plus une image sur deux (chaque créature déformée
//     est gardée dans une image entre-temps, et dessinée d'un seul appel), avec deux fois moins de bandes de déformation ;
//  2. en plus, la densité 1,5 (si l'écran est plus dense) ;
//  3. en plus, la densité 1 (si l'écran est plus dense).
export const SEUIL_MS = 33;
export function niveauxRecif(dpr) {
  const d0 = Math.min(2, dpr || 1), leger = { cadence: 15, bandes: 0.5 };
  const l = [{ nom: "complet", densite: d0, cadence: 0, bandes: 1 }, { nom: "ondulation des créatures ralentie", densite: d0, ...leger }];
  if (d0 > 1.5) l.push({ nom: "définition un peu réduite", densite: 1.5, ...leger });
  if (d0 > 1) l.push({ nom: "définition réduite de moitié", densite: 1, ...leger });
  return l;
}
// un cran de plus : passé les 3 premières secondes (ou les 2 secondes qui suivent un cran), si l'intervalle moyen des dernières
// images (60 au plus, 10 au moins) dépasse 33 ms. Un intervalle de plus d'une seconde (onglet caché, appareil en veille) n'est
// pas compté ; une image lente, si : sur une tablette très lente, c'est elle qu'il faut alléger (`gaps` : les intervalles
// retenus, en ms ; `ecoule` : le temps depuis l'entrée ou le dernier cran, en ms)
export const garderIntervalle = (dt) => dt > 0 && dt < 1000;
export const moyenneIntervalles = (gaps) => gaps.reduce((a, b) => a + b, 0) / gaps.length;
export const alleger = (gaps, ecoule) => ecoule > 3000 && gaps.length >= 10 && moyenneIntervalles(gaps) > SEUIL_MS;
// après un cran, on laisse le récif se redessiner à son nouveau niveau (les images réduites refaites si la densité change) :
// la mesure reprend de zéro, et le cran suivant ne peut venir qu'après 2 s
export const APRES_CRAN_MS = 2000;

// le scintillement d'une créature brillante : trois étoiles à quatre branches qui s'allument tour à tour, posées sur la
// créature (dans son repère : `k` px d'écran par px de son image) ; dessiné en direct, comme les bulles
function scintille(ctx, c, x0, y0, t, k) {
  let h = 0; for (const ch of c.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const r0 = (0.011 * ctx.canvas.height) / k;
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const u = 0.22 + 0.56 * (((h >> (i * 5)) & 31) / 31), v = 0.2 + 0.5 * (((h >> (i * 5 + 15)) & 31) / 31);
    const a = Math.pow(Math.max(0, Math.sin(t * 2.1 + i * 2.1 + (h & 7))), 3); if (a < 0.02) continue;
    const x = x0 + u * c.w, y = y0 + v * c.h, r = r0 * (0.7 + 0.5 * a);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6); g.addColorStop(0, `rgba(255,248,214,${(0.55 * a).toFixed(3)})`); g.addColorStop(1, "rgba(255,248,214,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,255,240,${a.toFixed(3)})`; ctx.beginPath();
    for (let j = 0; j < 8; j++) { const ang = (j * Math.PI) / 4, rr = j % 2 ? r * 0.22 : r; ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); }
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// (lot « La boutique du récif ») l'arrivée de la créature qui vient d'être achetée : elle entre par la gauche de la vue, nage en
// arc jusqu'à sa place en 3,6 s (deux fois plus grande au milieu de l'arc, comme la maquette de la boutique), avec son halo, qu'elle garde encore un peu une fois arrivée (rien ensuite : null). `A` : { id,
// t0, dx0 } (t0 et dx0 posés au premier appel) ; t en secondes ; x : sa place à l'écran (px du panorama), depuis le bord gauche
export const ARRIVEE_S = 3.6;
export function arriveeNage(A, id, t, x) {
  if (!A || id !== A.id) return null;
  A.t0 ??= t; A.dx0 ??= -(Math.max(0, x) + 320);
  const u = (t - A.t0) / ARRIVEE_S;
  if (u >= 1.6) { A.fini = true; return null; }
  if (u >= 1) return { dx: 0, dy: 0, s: 1, halo: true };
  const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  return { dx: A.dx0 * (1 - e), dy: -140 * Math.sin(Math.PI * u), s: 1 + Math.sin(Math.PI * Math.min(1, u * 1.15)), halo: true };
}

export class Reef {
  constructor(app) { this.app = app; this.open = false; this.view = new CardView(app); this.donnees = null; }
  // les niveaux d'allègement de cet écran (pour les parcours de test et le journal)
  niveaux() { return niveauxRecif(devicePixelRatio).map((p) => ({ ...p })); }
  // la visite ; la promesse se résout quand l'enfant touche la maison. (Lot « La boutique du récif » : le bouton de la boutique,
  // au-dessus de l'album, hors séance ; il se balance quand un achat est possible ; touché, la boutique s'ouvre, et son bouton
  // du récif ramène ici, où la créature achetée arrive à la nage. `boutique` : la visite commence par la boutique : la fin de
  // la récompense, quand un achat est possible.)
  async visit({ boutique = false } = {}) {
    for (let vers = boutique ? "boutique" : "recif"; ;) {
      if (vers === "boutique") { this.dansBoutique = true; try { await this.app.boutique.visit(); } finally { this.dansBoutique = false; } }
      vers = await this.visite();
      if (vers !== "boutique") return;
    }
  }
  async visite() {
    const { app } = this, { sprites, ocean, voice, text, rewards, stage } = app;
    this.open = true; this.els = [];
    // (les parcours de test peuvent tenir un niveau : window.__recifNiveau)
    this.paliers = niveauxRecif(devicePixelRatio);
    const tenu = Number.isInteger(globalThis.__recifNiveau) ? Math.min(this.paliers.length - 1, Math.max(0, globalThis.__recifNiveau)) : null;
    this.niveau = tenu ?? 0;
    const travail = []; this.travail = travail;
    this.reductions = new Reductions({ creer: () => { const c = document.createElement("canvas"); travail.push(c); return c; } });
    let nImage = 0;
    this.donnees ??= await (await fetch("assets/recif/donnees.json")).json();
    const { owned, brillantes } = recifCreatures(rewards.collection());
    // les deux canvas du récif, au-dessus du lagon (mis en pause) et sous la pieuvre et les boutons
    const glc = document.createElement("canvas"), cv = document.createElement("canvas");
    glc.className = "recif-vivant recif-gl"; cv.className = "recif-vivant recif-dessin";
    const line = stage.root.querySelector("#line"); stage.root.insertBefore(glc, line); stage.root.insertBefore(cv, line);
    this.canvases = [glc, cv];
    app.lagon?.pause(true); stage.ui.classList.add("ui-recif");
    // comme dans la maquette : ni la pieuvre (fixe, elle cachait des créatures et le sous-marin) ni le compteur d'étoiles
    // (illisible sur le noir des abysses) par-dessus la mer
    this.cache = { mascotte: ocean.mascotteVisible, etoiles: stage.ui.querySelector(".hud.stars") };
    ocean.mascotteVisible = false; this.cache.etoiles?.classList.add("recif-masque");
    // la créature qui vient d'être achetée (pas celle qu'on vient de faire briller) arrive à la nage
    const arr = rewards.arrivee; rewards.arrivee = null;
    this.arr = arr && !arr.briller && owned.has(versMaquette(arr.id)) ? { id: versMaquette(arr.id) } : null;
    const ecoute = []; this.ecoute = ecoute;
    const gaps = []; let last = 0, t0 = 0;
    const palier = () => this.paliers[this.niveau];
    // (la qualité demandée par le module à chaque créature : le cran, et le numéro de l'image, pour la cadence de l'ondulation)
    const qualite = { ...palier(), image: 0 };
    this.api = startRecif({
      cv, glc, donnees: this.donnees, owned, brillantes,
      size: () => ({ w: stage.root.clientWidth, h: stage.root.clientHeight }), rect: () => cv.getBoundingClientRect(),
      dpr: () => palier().densite,
      qualite: () => qualite, reduite: (src, w, h, k) => this.reductions.pour(src, w, h, k, nImage),
      canvas: () => { const c = document.createElement("canvas"); travail.push(c); return c; },
      on: (cible, type, f, o) => { cible.addEventListener(type, f, o); ecoute.push([cible, type, f, o]); },
      onFiche: (id) => this.fiche(id), scintille, arrivee: (id, t, x) => arriveeNage(this.arr, id, t, x),
      // l'allègement (`alleger`) : un cran de plus, noté dans le journal technique (le niveau, la densité du dessin, l'intervalle
      // moyen mesuré, la zone de la mer)
      mesure: (t) => {
        nImage++; qualite.image = nImage;
        t0 ||= t; if (last && garderIntervalle(t - last)) gaps.push(t - last); last = t; if (gaps.length > 60) gaps.shift();
        if (tenu == null && this.niveau < this.paliers.length - 1 && alleger(gaps, t - t0)) {
          const ms = moyenneIntervalles(gaps), avant = palier().densite;
          this.niveau++; gaps.length = 0; t0 = t - (3000 - APRES_CRAN_MS);
          const p = palier(); Object.assign(qualite, p);
          if (p.densite !== avant) this.api?.resize();
          noter("récif", `allégé : ${p.nom}`, { niveauRecif: this.niveau, niveauxRecif: this.paliers.length - 1, densiteDessin: p.densite, intervalleMs: Math.round(ms * 10) / 10, zoneRecif: this.api?.zone || null });
        }
      },
    });
    const home = spriteBox(app, { x: 90 - 70, y: 712 - 70, w: 140, h: 140, cls: "bubble homekey", label: "revenir", paint: (ctx) => sprites.draw(ctx, "maison", 0, 70, 70) });
    // l'album, par-dessus le récif (docs/SPEC.md : « depuis l'accueil et depuis le récif »)
    const book = spriteBox(app, { x: 90 - 70, y: 560 - 70, w: 140, h: 140, cls: "bubble albumkey", label: "l'album", paint: (ctx) => { const q = sprites.frame("album", 0), k = 140 / 180, px = sprites.px; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 70 * px + q.dx * k, 70 * px + q.dy * k, q.w * k, q.h * k); } });
    onBrief(app, book, async () => { pop(book); await this.view.close(); if (app.album && !app.album.open) { await app.album.visit(); voice.say(text.data.recifBienvenue, { instruction: true }); } }, "album");
    this.els.push(home, book);
    // (lot « La boutique du récif ») la boutique : hors séance seulement (pendant une séance en pause, pas de bouton)
    let vers = null;
    const fin = new Promise((r) => { vers = r; });
    if (!app.enPause && app.boutique) {
      const shop = spriteBox(app, { x: 90 - 70, y: 408 - 70, w: 140, h: 140, cls: `bubble boutique-cle${rewards.peutAcheter() ? " invite" : ""}`, label: "la boutique", paint: (ctx) => { const q = sprites.frame("boutique", 0), k = 140 / 150, px = sprites.px; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 70 * px + q.dx * k, 70 * px + q.dy * k, q.w * k, q.h * k); } });
      onBrief(app, shop, () => { if (app.album?.open) return; pop(shop); setTimeout(() => vers("boutique"), 200); }, "boutique");
      this.els.push(shop);
    }
    // (une créature achetée qui vit plus loin que le lagon : la mer s'ouvre à sa place pour qu'on la voie arriver)
    if (this.arr && app.cartes.cartes.find((c) => c.id === versCarte(this.arr.id))?.zone !== "lagon") this.api.aller(this.arr.id);
    voice.stop(); voice.say(text.data[owned.size ? "recifBienvenue" : "recifVide"], { instruction: true });
    if (!owned.size && !app.enPause && rewards.peutAcheter()) voice.say(text.data.boutique.invitation);
    onBrief(app, home, () => { if (app.album?.open) return; pop(home); vers("maison"); }, "maison");
    const r = await fin;
    await this.view.close();
    voice.stop(); this.leave();
    return r;
  }
  // une créature touchée : sa carte en grand
  fiche(id) {
    const c = this.app.rewards.collection().find((x) => x.id === versCarte(id));
    if (c && !this.app.album?.open) this.view.show(c);
  }
  leave() {
    const { app } = this;
    this.api?.stop(); this.api = null;
    // (les images réduites et les canvas de travail des créatures : rendus aussitôt)
    this.reductions?.vider(); for (const c of this.travail ?? []) c.width = c.height = 0; this.travail = [];
    for (const [cible, type, f, o] of this.ecoute ?? []) cible.removeEventListener(type, f, o);
    this.ecoute = [];
    this.canvases?.forEach((c) => { c.width = c.height = 0; c.remove(); }); this.canvases = null;
    app.stage.ui.classList.remove("ui-recif"); app.lagon?.pause(false);
    if (this.cache) { app.ocean.mascotteVisible = this.cache.mascotte; this.cache.etoiles?.classList.remove("recif-masque"); this.cache = null; }
    this.els.forEach((e) => e.remove()); this.els = []; this.open = false;
    app.sprites.unload("cartes"); forgetPictures();
  }
}
