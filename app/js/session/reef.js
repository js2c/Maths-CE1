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
//    ne sont chargées qu'à l'entrée et libérées en sortant ; si le temps d'image moyen dépasse 20 ms, le récif se dessine
//    en densité 1 (`alleger`).
// Remplace le récif en pages (lot 3, étape 5) depuis le 5 octobre 2026 (décision du parent).
import { CardView, forgetPictures } from "./cards.js";
import { spriteBox } from "./screens.js";
import { onBrief } from "../engine/ui.js";
import { startRecif } from "../recif/recif-vivant.js";

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
// la densité de dessin : celle de l'écran (au plus 2), ou 1 quand l'allègement le demande
const densite = (lent) => (lent ? 1 : Math.min(2, devicePixelRatio || 1));
// l'allègement : passé les 3 premières secondes, si l'intervalle moyen des dernières images (60 au plus, 10 au moins)
// dépasse 20 ms. Un intervalle de plus d'une seconde (onglet caché, appareil en veille) n'est pas compté ; une image
// lente, si : sur une tablette très lente, c'est elle qu'il faut alléger (`gaps` : les intervalles retenus, en ms ;
// `ecoule` : le temps depuis l'entrée, en ms)
export const garderIntervalle = (dt) => dt > 0 && dt < 1000;
export const alleger = (gaps, ecoule) => ecoule > 3000 && gaps.length >= 10 && gaps.reduce((a, b) => a + b, 0) / gaps.length > 20;

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

export class Reef {
  constructor(app) { this.app = app; this.open = false; this.view = new CardView(app); this.donnees = null; }
  // la visite ; la promesse se résout quand l'enfant touche la maison
  async visit() {
    const { app } = this, { sprites, ocean, voice, text, rewards, stage } = app;
    this.open = true; this.els = []; this.lent = false;
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
    this.cache = { octo: ocean.octoVisible, etoiles: stage.ui.querySelector(".hud.stars") };
    ocean.octoVisible = false; this.cache.etoiles?.classList.add("recif-masque");
    const ecoute = []; this.ecoute = ecoute;
    const gaps = []; let last = 0, t0 = 0;
    this.api = startRecif({
      cv, glc, donnees: this.donnees, owned, brillantes,
      size: () => ({ w: stage.root.clientWidth, h: stage.root.clientHeight }), rect: () => cv.getBoundingClientRect(),
      dpr: () => densite(this.lent),
      on: (cible, type, f, o) => { cible.addEventListener(type, f, o); ecoute.push([cible, type, f, o]); },
      onFiche: (id) => this.fiche(id), scintille,
      // l'allègement (`alleger`) : la densité passe à 1
      mesure: (t) => {
        t0 ||= t; if (last && garderIntervalle(t - last)) gaps.push(t - last); last = t; if (gaps.length > 60) gaps.shift();
        if (!this.lent && alleger(gaps, t - t0)) { this.lent = true; this.api?.resize(); }
      },
    });
    const home = spriteBox(app, { x: 90 - 70, y: 712 - 70, w: 140, h: 140, cls: "bubble homekey", label: "revenir", paint: (ctx) => sprites.draw(ctx, "maison", 0, 70, 70) });
    // l'album, par-dessus le récif (docs/SPEC.md : « depuis l'accueil et depuis le récif »)
    const book = spriteBox(app, { x: 90 - 70, y: 560 - 70, w: 140, h: 140, cls: "bubble albumkey", label: "l'album", paint: (ctx) => { const q = sprites.frame("album", 0), k = 140 / 180, px = sprites.px; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 70 * px + q.dx * k, 70 * px + q.dy * k, q.w * k, q.h * k); } });
    onBrief(app, book, async () => { pop(book); await this.view.close(); if (app.album && !app.album.open) { await app.album.visit(); voice.say(text.data.recifBienvenue, { instruction: true }); } }, "album");
    this.els.push(home, book);
    voice.stop(); voice.say(text.data[owned.size ? "recifBienvenue" : "recifVide"], { instruction: true });
    await new Promise((r) => onBrief(app, home, () => { if (app.album?.open) return; pop(home); r(); }, "maison"));
    await this.view.close();
    voice.stop(); this.leave();
  }
  // une créature touchée : sa carte en grand
  fiche(id) {
    const c = this.app.rewards.collection().find((x) => x.id === versCarte(id));
    if (c && !this.app.album?.open) this.view.show(c);
  }
  leave() {
    const { app } = this;
    this.api?.stop(); this.api = null;
    for (const [cible, type, f, o] of this.ecoute ?? []) cible.removeEventListener(type, f, o);
    this.ecoute = [];
    this.canvases?.forEach((c) => { c.width = c.height = 0; c.remove(); }); this.canvases = null;
    app.stage.ui.classList.remove("ui-recif"); app.lagon?.pause(false);
    if (this.cache) { app.ocean.octoVisible = this.cache.octo; this.cache.etoiles?.classList.remove("recif-masque"); this.cache = null; }
    this.els.forEach((e) => e.remove()); this.els = []; this.open = false;
    app.sprites.unload("cartes"); forgetPictures();
  }
}
