// LA BOUTIQUE DU RÉCIF (lot « La boutique du récif » ; décisions du parent des 10 et 11 octobre 2026 ; docs/SPEC.md, section 10 ;
// la maquette art/boutique/source.html fixe ce que l'enfant voit, entend et touche). L'enfant y achète les créatures de son
// récif avec ses étoiles de mer. On y entre par le bouton de la boutique du récif (hors séance) ou par le bouton de fin de la
// récompense quand un achat est possible ; le bouton du récif, en haut à gauche, y ramène.
//  - la vitrine d'une zone : ses 15 places, dans l'ordre de l'album ; les 4 zones en onglets (les pictogrammes de l'album, un
//    cadenas sur les zones fermées, 15 perles : les créatures de la zone déjà dans le récif) ; le compteur d'étoiles ; la mascotte ;
//  - une place selon son état (rewards.js, etatPlace) : à vendre (la créature, son prix), pas encore arrivée (son ombre, un
//    sablier), déjà dans le récif (le petit récif dans le coin, le prix pour la faire briller), brillante (reflet irisé,
//    étincelles), légendaire (son ombre dorée, l'étoile de diamant), zone fermée (son ombre, plus sombre) ; une arrivée pas
//    encore touchée a un halo doré qui respire ;
//  - toucher une tuile la SÉLECTIONNE comme sur les écrans de choix (bordure corail, elle se balance) ; la mascotte dit ce que
//    c'est, dans une bulle qui part de la tuile (session/selection.js, bulleTuile) ; si l'enfant a assez d'étoiles, une croix
//    rouge et une coche verte (88 px) se posent sous la tuile (au-dessus pour la dernière rangée). SEULE LA COCHE ACHÈTE ;
//    toucher encore la tuile redit seulement ce que c'est ; la croix, ou un toucher ailleurs, annule. Pas de double toucher
//    rapide ici (lot « Correctifs : passage… », point 11 : il ne s'applique pas aux tuiles de la boutique) ;
//  - l'achat (rewards.acheter) est ENREGISTRÉ AVANT l'animation, en une seule écriture : les étoiles volent du compteur à la
//    créature, le compteur descend avec elles ; la créature sort de la vitrine, grandit au milieu dans une gerbe d'étincelles,
//    puis file vers le bouton du récif ; « faire briller » : les étoiles volent, une gerbe, la tuile s'irise.
// La règle d'une place (ce que dit la mascotte) est `texteTuile`, testée (tests/unit/boutique-ecran.test.mjs).
import * as R from "../art/runtime.js";
import { entourage, onBrief, pop } from "../engine/ui.js";
import { MASCOTTE, MENTON, PLACES } from "../engine/bulle.js";
import { manque } from "./rewards.js";
import { bulleTuile, rectStyle } from "./selection.js";
import { versMaquette } from "./reef.js";
import { fill } from "../modules/numberline/screen.js";

// la scène de la maquette : tuiles de 170 × 196 en 5 colonnes à partir de x 340 (à droite de la tête de la mascotte), onglets
// de 96 px, coche et croix de 88 px
export const VITRINE = { x: 340, y: 150, w: 170, h: 196, gx: 18, gy: 14, cols: 5 }, ONGLET = { x: 410, y: 22, d: 96, pitch: 116 }, CONF = 88, CONF_GAP = 18;
export const RETOUR = { x: 22, y: 14, w: 112, h: 116 };
// sur la boutique, la bulle de la mascotte se met d'abord sous la tête (les tuiles commencent à x 340)
export const PLACES_BOUTIQUE = [{ nom: "dessous", boite: [8, MASCOTTE.y + MASCOTTE.h + 34, 326, 792], pointe: MENTON, haut: true }, ...PLACES];
// la place d'une tuile (i : son rang dans la zone)
export const placeTuile = (i) => ({ x: VITRINE.x + (i % VITRINE.cols) * (VITRINE.w + VITRINE.gx), y: VITRINE.y + Math.floor(i / VITRINE.cols) * (VITRINE.h + VITRINE.gy) });
// la coche et la croix, sous la tuile (au-dessus pour la dernière rangée), gardées dans l'écran : { x, y } du coin du couple
export function placeConfirmation([x0, y0, x1, y1]) {
  const l = 2 * CONF + CONF_GAP;
  return { x: Math.min(1272 - l, (x0 + x1) / 2 - l / 2), y: y1 + CONF + 4 > 800 ? y0 - CONF + 22 : y1 + 2 };
}
// dans une zone : ses créatures dans l'ordre de l'album (communes, rares, légendaires)
export const parZone = (cartes, z) => ["commune", "rare", "legendaire"].flatMap((r) => cartes.cartes.filter((c) => c.zone === z && c.rarete === r));
// CE QUE DIT LA MASCOTTE quand on touche une place (art/boutique/README.md, « Une place de la vitrine, selon son état »)
// `T` : textes.json ; `cartes` : cartes.json ; `etat` : l'état de la place ; `cout` : son prix (null s'il ne s'achète pas) ;
// `total` : les étoiles de l'enfant. « Il te manque N étoiles. » n'est dit que de 1 à boutique.manqueDitMax (299) : une
// rare à faire briller (300) sans aucune étoile, seul le prix est dit.
export function texteTuile(T, cartes, c, etat, cout, total) {
  const B = T.boutique, nom = fill(T.carteNouvelle, { nom: c.nomLu ?? c.nom });
  const suite = () => { const n = manque(cout, total); if (n === null) return B.daccord; if (n > (cartes.boutique.manqueDitMax ?? 299)) return null; return n === 1 ? B.manqueUn : fill(B.manque, { n }); };
  const j = (...xs) => xs.filter(Boolean).join(" ");
  if (etat === "vendre") return j(nom, fill(B.prix, { n: cout }), suite());
  if (etat === "terne") return j(nom, B.dejaLa, fill(B.briller, { n: cout }), suite());
  if (etat === "brillante") return j(nom, B.brilleDeja);
  if (etat === "legendeAToi") return j(nom, B.dejaLa);
  if (etat === "bientot") return B.bientot;
  if (etat === "legende") return B.legendaire;
  if (etat === "fermee") return cartes.zones.find((z) => z.id === c.zone)?.fermeeLu ?? B.bientot;
  return nom;
}
// la zone montrée à l'entrée : celle d'une arrivée pas encore touchée, sinon celle où il y a quelque chose à vendre, sinon la
// dernière ouverte
export function zoneParDefaut(cartes, vitrine, aVoir, ouvertes) {
  for (const z of ouvertes) if (parZone(cartes, z).some((c) => aVoir.has(c.id))) return z;
  for (const z of ouvertes) if (parZone(cartes, z).some((c) => vitrine.get(c.id) === "vendre")) return z;
  return ouvertes.at(-1);
}

// L'IMAGE D'UNE CRÉATURE : celle du récif vivant (assets/recif/, sans sa marge), décodée à la taille qui tient dans w × h px
// logiques (et la densité de l'écran) : jamais l'image entière en mémoire ; null si elle manque
export async function imageCreature(app, c, w, h) {
  try {
    const D = (app.recifDonnees ??= await (await fetch("assets/recif/donnees.json")).json()), id = versMaquette(c.id), sp = D.LAGON_SPR[id] ?? D.CORAIL_SPR[id] ?? D.LARGE_SPR[id] ?? D.ABYSSES_SPR[id];
    if (!sp) return null;
    const blob = await (await fetch(sp.src)).blob(), iw = sp.w - 2 * sp.m, ih = sp.h - 2 * sp.m, k = Math.min(w / iw, h / ih) * app.stage.px;
    return await createImageBitmap(blob, sp.m, sp.m, iw, ih, { resizeWidth: Math.max(1, Math.round(iw * k)), resizeHeight: Math.max(1, Math.round(ih * k)), resizeQuality: "high" });
  } catch { return null; }
}
// un sprite de l'atelier posé avec son ancrage en (x, y) logiques, réduit de k (jamais agrandi)
const poser = (sprites, ctx, px, name, f, x, y, k = 1) => { const q = sprites.frame(name, f); if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, x * px + q.dx * k, y * px + q.dy * k, q.w * k, q.h * k); };
// la marge du canvas d'une tuile, pour son ombre et le petit récif qui déborde dans le coin
const M = 18;

export class Boutique {
  constructor(app) { this.app = app; this.open = false; this.images = new Map(); }
  // LA VISITE ; la promesse se résout quand l'enfant touche le bouton du récif
  async visit() {
    const { app } = this, { sprites, voice, text, rewards, stage, bulle, cartes } = app;
    this.open = true; this.els = []; this.fini = false; this.verrou = false; this.sel = null; this.anims = [];
    this.t = Date.now(); // (l'heure de la visite : une visite garde sa vitrine, même au passage du dimanche au lundi)
    voice.stop(); bulle.ancrer(null); bulle.cacher(true);
    await sprites.load("boutique");
    if (this.fini) return;
    this.placesAvant = bulle.places; bulle.places = PLACES_BOUTIQUE;
    app.hud?.set(rewards.total);
    const premiere = await rewards.visite(), nouvelles = rewards.nouvelles(this.t);
    await rewards.annoncer(nouvelles);
    this.vit = rewards.vitrine(this.t); this.aVoir = rewards.aVoir(this.t);
    this.zone = zoneParDefaut(cartes, this.vit, this.aVoir, rewards.zones.ouvertes);
    // le retour au récif (en haut à gauche, à la place de la maison)
    const retour = document.createElement("button"); retour.className = "bubble homekey boutique-retour"; retour.setAttribute("aria-label", "le récif");
    Object.assign(retour.style, { left: `${RETOUR.x}px`, top: `${RETOUR.y}px`, width: `${RETOUR.w}px`, height: `${RETOUR.h}px` });
    const rc = document.createElement("canvas"); rc.width = Math.round(RETOUR.w * stage.px); rc.height = Math.round(RETOUR.h * stage.px); retour.append(rc);
    poser(sprites, rc.getContext("2d"), stage.px, "recif", 0, RETOUR.w / 2, RETOUR.h / 2, RETOUR.w / 180 * 1.18);
    stage.ui.append(retour); this.retour = retour; this.els.push(retour);
    // la coche et la croix
    this.conf = ["croix", "coche"].map((k) => {
      const b = document.createElement("button"); b.className = `bubble boutique-conf ${k}${k === "coche" ? " invite" : ""}`; b.setAttribute("aria-label", k === "coche" ? "acheter" : "annuler");
      Object.assign(b.style, { width: `${CONF}px`, height: `${CONF}px`, visibility: "hidden" });
      const c = document.createElement("canvas"); c.width = c.height = Math.round(CONF * stage.px); b.append(c);
      poser(sprites, c.getContext("2d"), stage.px, `boutique.${k}`, 0, CONF / 2 - 2, CONF / 2 - 2, 1.05);
      stage.ui.append(b); this.els.push(b); return b;
    });
    onBrief(app, this.conf[1], () => this.acheter(), null);
    onBrief(app, this.conf[0], () => { if (this.verrou) return; pop(this.conf[0]); voice.stop(); bulle.silence(); setTimeout(() => this.deselection(), 150); }, null);
    // un toucher ailleurs (ni une tuile, ni la coche ou la croix, ni un onglet, ni la mascotte) désélectionne
    this.dehors = (e) => { if (!this.open || this.verrou || !this.sel) return; if (e.target.closest?.(".boutique-tuile, .boutique-conf, .boutique-onglet, .mascotte-tap, .boutique-retour")) return; this.deselection(); voice.stop(); };
    document.addEventListener("pointerdown", this.dehors, true);
    // ce qui vit : l'étoile de diamant des légendaires (son reflet, ses étincelles)
    this.tick = (t) => { for (const d of this.diamants ?? []) d.repaint(t); };
    stage.ticks.add(this.tick);
    this.dessinerOnglets(); await this.dessinerVitrine();
    // la consigne (et, à la première visite, la bienvenue ; s'il y a des arrivées pas encore annoncées, l'annonce)
    const B = text.data.boutique;
    if (premiere) voice.say(B.bienvenue); else if (nouvelles.length) voice.say(B.arrivees);
    voice.say(B.consigne, { instruction: true });
    await new Promise((r) => onBrief(app, retour, () => { pop(retour); r(); }, "recif"));
    this.leave();
  }
  // ---------------------------------------------------------------- les onglets
  dessinerOnglets() {
    const { app } = this, { sprites, stage, rewards, cartes, voice } = app;
    this.onglets?.forEach((o) => o.remove());
    this.onglets = cartes.zones.map((z, i) => {
      const ouverte = rewards.zoneOpen(z.id), b = document.createElement("button"), d = ONGLET.d, m = 16;
      b.className = `bubble boutique-onglet${ouverte ? "" : " fermee"}${z.id === this.zone ? " actif" : ""}`; b.setAttribute("aria-label", z.nom); b.dataset.zone = z.id;
      Object.assign(b.style, { left: `${ONGLET.x + i * ONGLET.pitch}px`, top: `${ONGLET.y}px`, width: `${d}px`, height: `${d}px` });
      const c = document.createElement("canvas"), W = d + 2 * m, H = d + 2 * m + 14, px = stage.px; c.width = Math.round(W * px); c.height = Math.round(H * px);
      Object.assign(c.style, { position: "absolute", left: `${-m}px`, top: `${-m}px`, width: `${W}px`, height: `${H}px` });
      const ctx = c.getContext("2d");
      // le médaillon de la zone (celui de l'album), le cadenas d'une zone fermée, l'entourage corail de la zone montrée
      if (!ouverte) ctx.filter = "grayscale(0.7) brightness(0.92) opacity(0.8)";
      poser(sprites, ctx, px, `album.zone.${z.id}`, 0, W / 2, m + d / 2, d / 112);
      ctx.filter = "none";
      if (!ouverte) poser(sprites, ctx, px, "boutique.cadenas", 0, W / 2 + 36, m + d / 2 + 32);
      ctx.setTransform(px, 0, 0, px, 0, 0);
      if (z.id === this.zone) R.drawSelectRound(ctx, W / 2, m + d / 2, d / 2 + 6);
      // les 15 perles : les créatures de la zone déjà dans le récif (sans chiffre)
      const cs = parZone(cartes, z.id);
      cs.forEach((cc, k) => { const x = W / 2 + (k - 7) * 6.2, y = m + d + 11, on = !!rewards.owned[cc.id]; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fillStyle = on ? "#fff3c4" : "rgba(255,255,255,0.35)"; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = on ? "#18132a" : "rgba(10,30,40,0.35)"; ctx.stroke(); });
      b.append(c); stage.ui.append(b);
      onBrief(app, b, () => {
        if (this.verrou) return;
        pop(b); this.deselection(); voice.stop();
        if (this.zone !== z.id) { this.zone = z.id; this.dessinerOnglets(); this.dessinerVitrine(); }
        if (!ouverte) voice.say(z.fermeeLu);
      }, null);
      return b;
    });
    this.els.push(...this.onglets);
  }
  // ---------------------------------------------------------------- la vitrine
  async dessinerVitrine() {
    const { app } = this, { stage, cartes } = app;
    this.tuiles?.forEach((t) => t.remove()); this.diamants = [];
    const cs = parZone(cartes, this.zone);
    this.tuiles = cs.map((c, i) => {
      const { x, y } = placeTuile(i), b = document.createElement("button");
      b.className = "bubble boutique-tuile"; b.dataset.id = c.id; b.setAttribute("aria-label", c.nom);
      Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${VITRINE.w}px`, height: `${VITRINE.h}px` });
      const cv = document.createElement("canvas"), W = VITRINE.w + 2 * M, H = VITRINE.h + 2 * M; cv.width = Math.round(W * stage.px); cv.height = Math.round(H * stage.px);
      Object.assign(cv.style, { position: "absolute", left: `${-M}px`, top: `${-M}px`, width: `${W}px`, height: `${H}px` });
      b.append(cv); b.cv = cv; b.carte = c;
      b.repaint = () => this.peindre(b);
      b.repaint(); this.decorer(b);
      onBrief(app, b, () => this.toucher(b), null);
      stage.ui.append(b); return b;
    });
    this.els.push(...this.tuiles);
    // les créatures, décodées à la taille de la tuile (la zone montrée seulement)
    await Promise.all(cs.map(async (c, i) => { await this.image(c); if (this.tuiles?.[i]?.carte === c) this.tuiles[i].repaint(); }));
  }
  etat(c) { return this.vit.get(c.id); }
  // l'image d'une créature, décodée à la taille de sa place sur la tuile (une fois par visite)
  image(c) {
    if (!this.images.has(c.id)) this.images.set(c.id, imageCreature(this.app, c, 146, 128));
    return this.images.get(c.id);
  }
  // le dessin d'une tuile : la tuile de sa matière, la créature (ou son ombre), le prix, le petit récif d'une créature possédée
  async peindre(b) {
    const { app } = this, { sprites, stage, rewards } = app, px = stage.px, c = b.carte, e = this.etat(c), ctx = b.cv.getContext("2d"), cout = rewards.cout(c.id, e);
    const img = this.images.has(c.id) ? await this.images.get(c.id) : null;
    if (b.carte !== c || !b.isConnected && this.fini) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, b.cv.width, b.cv.height);
    const sorte = c.rarete === "legendaire" ? "legendaire" : e === "bientot" ? "bientot" : e === "fermee" ? "fermee" : c.rarete;
    poser(sprites, ctx, px, `boutique.tuile.${sorte}`, 0, M, M);
    if (img && !b.sansImage) {
      const w = img.width / px, h = img.height / px, x = M + 12 + (146 - w) / 2, y = M + 12 + (128 - h) / 2;
      ctx.filter = e === "bientot" ? "brightness(0) opacity(0.28)" : e === "fermee" ? "brightness(0) opacity(0.22)" : e === "legende" ? "brightness(0) sepia(1) saturate(4) hue-rotate(5deg) brightness(0.75) opacity(0.6)" : "drop-shadow(3px 4px 0 rgba(10,30,40,0.18))";
      ctx.drawImage(img, x * px, y * px, img.width, img.height); ctx.filter = "none";
    }
    // le prix : le nombre encré et une étoile de mer ; pour briller, l'étincelle devant
    const cy = M + 171;
    if (cout !== null) {
      const s = String(cout), em = e === "terne" ? 30 : 33, wn = s.length * em * 0.62, wi = e === "terne" ? 30 : 0, ws = 34, l = wi + wn + ws + 6, x0 = M + 85 - l / 2;
      if (wi) poser(sprites, ctx, px, "boutique.briller", 0, x0 + 14, cy);
      ctx.setTransform(px, 0, 0, px, 0, 0); R.drawNumber(ctx, s, x0 + wi + wn / 2, cy - em * 0.5, em, { w: em * 0.16, seed: 870 + cout });
      ctx.setTransform(1, 0, 0, 1, 0, 0); poser(sprites, ctx, px, "etoile", 0, x0 + wi + wn + 6 + ws / 2, cy, 0.3);
    } else if (e === "bientot") poser(sprites, ctx, px, "boutique.sablier", 0, M + 85, cy);
    if (rewards.owned[c.id]) poser(sprites, ctx, px, "recif", 0, M + 9, M + 9, 50 / 180);
  }
  // ce qui vit sur une tuile : l'étoile de diamant d'une légendaire, le reflet et les étincelles d'une brillante, le halo d'une
  // arrivée pas encore touchée
  decorer(b) {
    const { app } = this, { stage, sprites } = app, c = b.carte, e = this.etat(c);
    b.classList.toggle("nouvelle", this.aVoir.has(c.id) && e === "vendre");
    b.querySelectorAll(".boutique-reflet, .boutique-etincelle, .boutique-diamant").forEach((x) => x.remove());
    if (e === "brillante") {
      // (le reflet irisé : une bande de lumière qui la balaie toutes les 3,5 s, dessinée par le navigateur, comme la maquette)
      const host = document.createElement("div"); host.className = "boutique-reflet"; b.append(host);
      [[18, 22, 0], [128, 30, 0.8], [132, 112, 1.5], [26, 108, 2.1]].forEach(([x, y, d], i) => {
        const s = document.createElement("canvas"), px = stage.px; s.width = s.height = Math.round(24 * px); s.className = "boutique-etincelle";
        Object.assign(s.style, { left: `${x}px`, top: `${y}px`, width: "24px", height: "24px", animationDelay: `${d}s` }); poser(sprites, s.getContext("2d"), px, "etincelle", i % 2, 12, 12, 0.8); b.append(s);
      });
    }
    if (e === "legende") {
      const s = document.createElement("canvas"), px = stage.px, S = 66; s.width = s.height = Math.round(S * px); s.className = "boutique-diamant";
      Object.assign(s.style, { left: `${85 - S / 2}px`, top: `${168 - S / 2}px`, width: `${S}px`, height: `${S}px` }); b.append(s);
      const k = 26 / 44, ctx = s.getContext("2d");
      this.diamants.push({ repaint: (t) => { if (!s.isConnected) return; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, s.width, s.height); poser(sprites, ctx, px, "etoile.diamant", 0, S / 2, S / 2, k); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawDiamantVif(ctx, S / 2, S / 2, 44 * k, t); } });
    }
  }
  // ---------------------------------------------------------------- toucher une tuile
  toucher(b) {
    if (this.verrou) return;
    const { app } = this, { voice, rewards, text, cartes } = app, c = b.carte, e = this.etat(c), cout = rewards.cout(c.id, e);
    if (this.aVoir.has(c.id)) { this.aVoir.delete(c.id); rewards.voir(c.id); b.classList.remove("nouvelle"); }
    if (this.sel !== b) { this.deselection(); this.sel = b; this.entourer(b, true); setTimeout(() => { if (this.sel === b && !this.verrou) b.classList.add("choisie"); }, 450); }
    pop(b);
    // la coche et la croix, seulement s'il y a de quoi acheter
    const r = rectStyle(b), assez = cout !== null && rewards.total >= cout;
    if (assez) { const p = placeConfirmation(r); this.conf.forEach((k, i) => Object.assign(k.style, { left: `${p.x + i * (CONF + CONF_GAP)}px`, top: `${p.y}px`, visibility: "visible" })); }
    else this.conf.forEach((k) => { k.style.visibility = "hidden"; });
    const t = texteTuile(text.data, cartes, c, e, cout, rewards.total);
    bulleTuile(app, b, this.tuiles, t, { commandes: ".boutique-retour, .boutique-onglet, .boutique-conf" });
    // (lot « Recette de l'enfant et nettoyage des couches », second passage de l'agent, constat 8) tant que la tuile est
    // choisie, toucher la mascotte redit ce qu'elle a dit de la créature (son prix, « touche la coche verte »), pas la
    // consigne générale ; la tuile quittée, la consigne générale revient
    voice.stop(); voice.say(t, { instruction: true });
  }
  entourer(b, oui) { entourage(this.app, b, oui, (ctx, x, y) => R.drawSelectTile(ctx, x + VITRINE.w / 2, y + VITRINE.h / 2, VITRINE.w, VITRINE.h, 22, -7)); }
  deselection() {
    const b = this.sel; this.sel = null;
    if (b) { b.classList.remove("choisie"); this.entourer(b, false); }
    this.conf?.forEach((k) => { k.style.visibility = "hidden"; });
    this.app.bulle.ancrer(null);
    if (b) this.app.voice.instruction = this.app.text.data.boutique.consigne;
  }
  // ---------------------------------------------------------------- la coche : acheter, ou faire briller
  async acheter() {
    if (this.verrou || !this.sel) return;
    const { app } = this, { rewards, rnd, voice, bulle, hud, text, ocean, cartes } = app, b = this.sel, c = b.carte, e = this.etat(c);
    pop(this.conf[1]);
    // L'ACHAT, enregistré tout de suite (rien si ce n'est plus possible : un second toucher très rapide, pas assez d'étoiles)
    const got = rewards.acheter(c.id, Date.now(), rnd, { vitrine: this.vit });
    if (!got) return;
    this.verrou = true;
    await got.ecrit;
    this.vit = rewards.vitrine(this.t);
    this.conf.forEach((k) => { k.style.visibility = "hidden"; }); this.deselection(); voice.stop(); bulle.cacher(true);
    const [x0, y0, x1, y1] = rectStyle(b), centre = [(x0 + x1) / 2, (y0 + y1) / 2];
    // les étoiles volent du compteur jusqu'à la créature, le compteur descend avec elles
    await this.volEtoiles(got.prix, centre, b);
    if (this.fini) return;
    hud.set(rewards.total);
    if (got.briller) {
      this.gerbe(centre, 16, 130); ocean.mascotte.play("rejouir");
      b.repaint(); this.decorer(b); pop(b);
      app.sound?.play("brillante");
      const t = `${fill(text.data.carteNouvelle, { nom: c.nomLu ?? c.nom })} ${text.data.carteBrillanteTirage}`;
      bulleTuile(app, b, this.tuiles, t, { commandes: ".boutique-retour, .boutique-onglet" });
      await voice.say(t);
    } else await this.sortie(b, got);
    if (this.fini) return;
    this.dessinerOnglets(); b.repaint(); this.decorer(b);
    this.verrou = false;
    // la zone est complète : la mascotte le dit (une nouvelle zone s'ouvrira à une prochaine récompense)
    const Z = cartes.zones.map((z) => z.id), last = rewards.zones.ouvertes.at(-1);
    if (!got.briller && c.zone === last && cartes.cartes.filter((x) => x.zone === c.zone && x.rarete !== "legendaire").every((x) => rewards.owned[x.id])) {
      voice.say([text.data.boutique.zoneFinie, Z.indexOf(c.zone) < Z.length - 1 ? text.data.boutique.zoneBientot : null].filter(Boolean).join(" "));
    }
  }
  // la créature sort de la vitrine : elle grandit au milieu de l'écran dans une gerbe d'étincelles, puis file vers le récif
  async sortie(b, got) {
    const { app } = this, { stage, voice, text, ocean } = app, img = await this.images.get(b.carte.id), [x0, y0] = rectStyle(b);
    const el = document.createElement("canvas"), px = stage.px, w = img ? img.width / px : 146, h = img ? img.height / px : 128;
    el.width = Math.round(w * px); el.height = Math.round(h * px); el.className = "boutique-vol";
    if (img) el.getContext("2d").drawImage(img, 0, 0);
    const sx = x0 + 12 + (146 - w) / 2, sy = y0 + 12 + (128 - h) / 2;
    Object.assign(el.style, { left: "0px", top: "0px", width: `${w}px`, height: `${h}px` });
    const voile = document.createElement("div"); voile.className = "boutique-voile"; stage.ui.append(voile, el); this.els.push(voile, el);
    b.sansImage = true; b.repaint();
    requestAnimationFrame(() => voile.classList.add("on"));
    ocean.mascotte.play("rejouir", { fort: true });
    const dep = `translate(${sx}px, ${sy}px) scale(1)`, mil = `translate(${640 - w / 2}px, ${390 - h / 2}px) scale(2.3)`;
    await this.animer(el, [{ transform: dep }, { transform: mil }], { duration: 700, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "forwards" });
    if (this.fini) return;
    this.gerbe([640, 390], 18, 190); app.sound?.play(got.brillante ? "brillante" : "carte");
    if (got.brillante) el.style.filter = "drop-shadow(0 0 10px #fff7c8) drop-shadow(0 0 22px rgba(190,230,255,0.9))";
    const flotte = el.animate([{ transform: mil }, { transform: `${mil.replace("scale(2.3)", "scale(2.38)")} rotate(-2deg)` }, { transform: mil }], { duration: 1600, iterations: Infinity, easing: "ease-in-out" });
    const B = text.data.boutique;
    await voice.say(got.brillante ? `${B.achat} ${text.data.carteBrillanteTirage}` : B.achat);
    flotte.cancel();
    if (this.fini) return;
    voile.classList.remove("on");
    const r = rectStyle(this.retour), to = `translate(${(r[0] + r[2]) / 2 - w / 2}px, ${(r[1] + r[3]) / 2 - h / 2}px) scale(0.25)`;
    await this.animer(el, [{ transform: mil, opacity: 1 }, { transform: to, opacity: 0.2 }], { duration: 750, easing: "cubic-bezier(.6,0,.8,.4)", fill: "forwards" });
    el.remove(); voile.remove(); b.sansImage = false; pop(this.retour);
  }
  // LES ÉTOILES DU PRIX volent du compteur jusqu'à la créature (6 à 16 étoiles, comme la maquette), au-dessus de la vitrine ;
  // le compteur descend avec elles, d'un pas à chaque étoile partie, jamais d'un coup
  async volEtoiles(prix, [cx, cy], cible) {
    const { stage, sprites, hud, rewards } = this.app, px = stage.px, n = Math.max(6, Math.min(16, Math.round(prix / 8))), dur = 820, ecart = 70, [sx, sy] = [1004, 76];
    const de = rewards.total + prix, vols = [];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("canvas"), S = 46; el.width = el.height = Math.round(S * px); el.className = "boutique-vol etoile";
      Object.assign(el.style, { width: `${S}px`, height: `${S}px`, opacity: "0" }); poser(sprites, el.getContext("2d"), px, "etoile", 0, S / 2, S / 2, 0.42);
      stage.ui.append(el); this.els.push(el);
      const mx = (sx + cx) / 2 + (i % 2 ? 60 : -60), my = Math.min(sy, cy) - 90 - (i % 3) * 30, kf = [];
      for (let j = 0; j <= 12; j++) { const t = j / 12, x = (1 - t) ** 2 * sx + 2 * (1 - t) * t * mx + t * t * cx, y = (1 - t) ** 2 * sy + 2 * (1 - t) * t * my + t * t * cy; kf.push({ transform: `translate(${x - S / 2}px, ${y - S / 2}px) rotate(${t * 220}deg) scale(${1 - 0.45 * t})`, opacity: t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1 }); }
      // (le compteur perd une part du prix quand chaque étoile arrive à mi-chemin : il descend pendant tout le vol)
      setTimeout(() => { if (!this.fini) hud?.set(Math.round(de - (prix * (i + 1)) / n)); }, i * ecart + dur / 2);
      vols.push(this.animer(el, kf, { duration: dur, delay: i * ecart, easing: "cubic-bezier(.45,.05,.55,.95)", fill: "forwards" }).then(() => { el.remove(); if (i % 2 === 0) pop(cible); }));
    }
    await Promise.all(vols);
  }
  animer(el, kf, o) { const a = el.animate(kf, o); this.anims.push(a); return a.finished.catch(() => {}); }
  // une gerbe d'étincelles (crème et bleu glacier) qui part de (x, y)
  gerbe([x, y], n = 14, r = 120) {
    const { stage, sprites } = this.app, px = stage.px;
    for (let i = 0; i < n; i++) {
      const d = document.createElement("canvas"), s = 18 + (i % 4) * 6; d.width = d.height = Math.round(s * px); d.className = "boutique-gerbe";
      Object.assign(d.style, { width: `${s}px`, height: `${s}px` }); poser(sprites, d.getContext("2d"), px, "etincelle", i % 3 ? 0 : 1, s / 2, s / 2, s / 30);
      stage.ui.append(d);
      const a = (i / n) * Math.PI * 2 + (i * 0.37) % 0.3, rr = r * (0.7 + ((i * 7) % 5) / 10);
      d.animate([{ transform: `translate(${x - s / 2}px, ${y - s / 2}px) scale(0.2)`, opacity: 1 }, { transform: `translate(${x - s / 2 + Math.cos(a) * rr}px, ${y - s / 2 + Math.sin(a) * rr}px) scale(1) rotate(90deg)`, opacity: 0 }], { duration: 900 + (i % 5) * 80, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }).finished.then(() => d.remove(), () => d.remove());
    }
  }
  // ---------------------------------------------------------------- la sortie
  leave() {
    const { app } = this, { stage, bulle, voice, rewards, sprites } = app;
    this.fini = true; this.open = false;
    this.anims.forEach((a) => { try { a.cancel(); } catch { /* déjà fini */ } }); this.anims = [];
    document.removeEventListener("pointerdown", this.dehors, true);
    if (this.tick) stage.ticks.delete(this.tick);
    voice.stop(); bulle.ancrer(null); bulle.cacher(true); bulle.places = this.placesAvant ?? null;
    this.els.forEach((e) => e.remove()); this.els = []; this.tuiles = []; this.onglets = []; this.diamants = []; this.sel = null;
    document.querySelectorAll("#ui .boutique-gerbe, #ui .boutique-vol, #ui .boutique-voile").forEach((e) => e.remove());
    // (les étoiles en vol, s'il y en avait : le compteur montre le trésor)
    app.hud?.set(rewards.total);
    for (const p of this.images.values()) p.then((b) => b?.close?.());
    this.images = new Map();
    sprites.unload("boutique");
  }
}
