// L'ALBUM DES CARTES (docs/SPEC.md, « La carte et l'album »). Ouvert par le livre-coquillage, depuis
// l'accueil et depuis le récif ; la visite est libre et ne rapporte rien.
//  - une page par zone (quatre onglets à droite : les dos de chaque zone, assombris et fermés d'un
//    coquillage tant que la zone n'est pas ouverte) ; chaque zone a ses 15 emplacements (5 × 3) ;
//  - une carte obtenue est visible (son illustration dans son cadre) ; une carte pas encore découverte
//    montre son dos (doré pour une légendaire) ; une zone fermée montre ses dos assombris ;
//  - sous la zone, 15 perles se remplissent au fil des cartes gagnées (pas de chiffre) ;
//  - toucher une carte obtenue la montre en grand (cards.js, CardView) ; toucher un dos fait dire où elle
//    attend (cartes.json, zones[].dosLu, legendaireLu) ; une zone fermée, quand elle s'ouvrira (fermeeLu).
// Les vignettes sont dessinées une fois ; les images sont décodées à leur taille (cards.js, picture).
import { onTap, pop, spriteBox } from "../engine/ui.js";
import { CARD, CardView, forgetPictures, paintFace, shine } from "./cards.js";

const K = 0.36, TW = CARD.W * K, TH = CARD.H * K; // une vignette : 119 × 158
const GRID = { x: 300, y: 118, gx: 18, gy: 20 }, TAB = { x: 1090, y: 150, k: 0.27, gap: 22 }, PEARLS_Y = 680;

export class Album {
  constructor(app) { this.app = app; this.open = false; this.view = new CardView(app); }
  // la visite ; la promesse se résout quand l'enfant touche la maison
  async visit({ zone = null } = {}) {
    const { app } = this, { sprites, voice, text, cartes } = app;
    this.open = true; this.els = [];
    await sprites.load("cartes");
    const veil = document.createElement("div"); veil.className = "veil album-veil"; app.stage.ui.append(veil); this.els.push(veil);
    this.page = document.createElement("div"); this.page.className = "album-page"; app.stage.ui.append(this.page); this.els.push(this.page);
    // les onglets des zones : le dos de chaque zone, en petit
    this.tabs = cartes.zones.map((z, i) => {
      const t = this.thumb({ id: `dos-${z.id}`, zone: z.id, rarete: "commune" }, "dos", TAB.x, TAB.y + i * (CARD.H * TAB.k + TAB.gap), TAB.k, { cls: `album-tab${app.rewards.zoneOpen(z.id) ? "" : " closed"}`, label: z.nom });
      onTap(t, () => { pop(t); this.showZone(z.id, { say: true }); });
      this.els.push(t); return t;
    });
    const home = spriteBox(app, { x: 90 - 70, y: 712 - 70, w: 140, h: 140, cls: "bubble homekey", label: "revenir", paint: (ctx) => sprites.draw(ctx, "maison", 0, 70, 70) });
    this.els.push(home);
    const first = zone ?? cartes.zones.find((z) => app.rewards.zoneOpen(z.id))?.id ?? cartes.zones[0].id;
    await this.showZone(first);
    voice.stop(); voice.say(text.data.album, { instruction: true });
    await new Promise((r) => onTap(home, () => { pop(home); r(); }));
    await this.view.close();
    voice.stop(); this.leave();
  }
  // une vignette : un bouton qui porte une face de carte à l'échelle k
  thumb(card, face, x, y, k, { cls = "", label = "", name = false } = {}) {
    const { app } = this, px = app.stage.px, w = CARD.W * k, h = CARD.H * k, b = document.createElement("button"), c = document.createElement("canvas");
    b.className = `bubble album-card ${cls}`; b.setAttribute("aria-label", label || card.nom || "");
    Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
    c.width = Math.round(w * px); c.height = Math.round(h * px); b.append(c); (cls.includes("album-tab") ? app.stage.ui : this.page).append(b);
    b.ready = paintFace(c.getContext("2d"), px, app.sprites, card, face, { k, cartes: app.cartes, name });
    return b;
  }
  // la page d'une zone : ses 15 emplacements, puis ses perles
  async showZone(id, { say = false } = {}) {
    const { app } = this, { cartes, rewards, voice, sprites } = app, z = cartes.zones.find((x) => x.id === id), owned = rewards.owned, open = rewards.zoneOpen(id);
    this.zone = id; this.page.replaceChildren();
    this.tabs.forEach((t, i) => t.classList.toggle("sel", cartes.zones[i].id === id));
    const cards = cartes.cartes.filter((c) => c.zone === id), ready = [];
    cards.forEach((c, i) => {
      const x = GRID.x + (i % 5) * (TW + GRID.gx), y = GRID.y + Math.floor(i / 5) * (TH + GRID.gy), got = open && owned[c.id];
      const t = this.thumb(got ? { ...c, ...owned[c.id] } : c, got ? "recto" : "dos", x, y, K, { cls: `${got ? "got" : "back"}${open ? "" : " closed"}${got && owned[c.id].brillante ? " shiny" : ""}`, label: got ? c.nom : "carte à découvrir" });
      t.dataset.id = c.id; ready.push(t.ready);
      if (got && owned[c.id].brillante) t.ready.then(() => shine(app, t, { k: K }));
      onTap(t, () => {
        pop(t);
        if (got) return this.view.show({ ...c, ...owned[c.id] });
        voice.stop(); voice.say(!open ? z.fermeeLu : c.rarete === "legendaire" ? cartes.legendaireLu : z.dosLu, { instruction: true });
      });
    });
    // une zone fermée : un coquillage fermé posé sur ses dos
    if (!open) {
      const lock = spriteBox(app, { x: GRID.x + (5 * TW + 4 * GRID.gx) / 2 - 150, y: GRID.y + (3 * TH + 2 * GRID.gy) / 2 - 150, w: 300, h: 280, cls: "hud album-lock", still: true, paint: (ctx) => sprites.draw(ctx, "coquillage", 0, 150, 150) });
      this.page.append(lock);
    }
    // les perles : une par carte gagnée dans la zone, sans chiffre
    const n = open ? cards.filter((c) => owned[c.id]).length : 0, W = 15 * 28;
    const pearls = spriteBox(app, { x: GRID.x + (5 * TW + 4 * GRID.gx) / 2 - W / 2 - 10, y: PEARLS_Y - 20, w: W + 20, h: 40, cls: "hud pearls", still: true, paint: (ctx) => { for (let i = 0; i < 15; i++) sprites.draw(ctx, "perle", i < n ? 1 : 0, 24 + i * 28, 20); } });
    this.page.append(pearls);
    if (say && !open) { voice.stop(); voice.say(z.fermeeLu, { instruction: true }); }
    await Promise.all(ready);
  }
  leave() {
    this.els.forEach((e) => e.remove()); this.els = []; this.open = false;
    if (!this.app.reef?.open) { this.app.sprites.unload("cartes"); forgetPictures(); }
  }
}
