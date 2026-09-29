// LE RÉCIF (docs/SPEC.md, « Le récif ») : chaque créature obtenue y vit, animée (boucles fabriquées par l'atelier). On y
// entre depuis l'accueil, depuis la lune, ou depuis l'accueil en pause ; la visite est libre et ne rapporte rien. Toucher
// une créature ouvre sa carte (la voix dit son nom et son anecdote une fois ; toucher la carte la retourne ; la coche
// verte la range : cards.js, CardView). La maison ramène à l'accueil ; le livre ouvre l'album (album.js).
// Lot 3, étape 5 (décision du parent du 28 septembre 2026) : LE RÉCIF EN PAGES, UNE PAR ZONE, dans l'ordre des cartes et
// de l'album ; une zone a sa page si elle est ouverte et si au moins une de ses créatures a un dessin et une place
// (reefpages.js ; aujourd'hui, seul le lagon). Glisser le doigt à l'horizontale fait passer à la zone voisine : le décor
// (le fond, les algues, les poissons) et les créatures suivent le doigt, puis se calent au relâcher (au-delà d'un tiers de
// l'écran ou d'un geste rapide, sinon retour) ; en bout de liste, une résistance et un léger rebond. Un toucher bref sur
// une créature ouvre toujours sa carte, même pendant que la page se cale. Une rangée de perles (`recif.perle`, de la
// même main que celles de l'album) montre la page et mène à une zone quand on la touche ; elle n'apparaît qu'à partir de deux
// pages. À l'entrée : la zone de la dernière carte gagnée (sinon le lagon). Les cadeaux restent dans le lagon.
// Mémoire : seule la planche de la page affichée est chargée, plus celle de la voisine dès que le glisser commence ; les
// autres sont libérées quand la page est calée. La pieuvre, guide de la visite, ne suit pas le doigt.
import { CardView, forgetPictures } from "./cards.js";
import { spriteBox } from "./screens.js";
import { onBrief } from "../engine/ui.js";
import { GIFT_SPOTS } from "./surprise.js";
import { reefDecor } from "./rewards.js";
import { dragShift, entryZone, isDrag, isTap, pageCreatures, pageSheets, pagesConf, reefPages, settleTarget } from "./reefpages.js";

const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
const ease = (u) => 1 - Math.pow(1 - u, 3);
// comment chaque créature bouge dans le récif (le reste de son mouvement est dans sa boucle)
const MOVES = {
  "poisson-clown": (t) => [16 * Math.sin(t * 0.7), 8 * Math.sin(t * 1.3)], // reste près de son anémone
  "poisson-chirurgien": (t) => [60 * Math.sin(t * 0.35), 12 * Math.sin(t * 0.9)],
  "poisson-ballon": (t) => [20 * Math.sin(t * 0.4), 10 * Math.sin(t * 0.8)],
  hippocampe: (t) => [0, 8 * Math.sin(t * 1.1)],
  crevette: (t) => [10 * Math.sin(t * 0.6), 5 * Math.sin(t * 1.4)],
  "raie-pastenague": (t) => [40 * Math.sin(t * 0.3), 6 * Math.sin(t * 0.6)],
  crabe: (t) => [34 * Math.sin(t * 0.5), 0], // marche de côté
  "bernard-l-ermite": (t) => [18 * Math.sin(t * 0.25), 0],
};
const PEARL = { y: 770, gap: 72, size: 64 };

export class Reef {
  constructor(app) { this.app = app; this.open = false; this.view = new CardView(app); }
  get conf() { return pagesConf(this.app.cartes); }
  // la visite ; la promesse se résout quand l'enfant touche la maison
  async visit() {
    const { app } = this, { sprites, ocean, voice, text, rewards, cartes } = app;
    this.open = true; this.els = []; this.zones = new Map(); this.shift = 0; this.anim = null; this.gesture = null;
    const has = (id) => !!sprites.atlas.sprites[`creature.${id}`];
    this.pages = reefPages(cartes, { zoneOpen: (z) => rewards.zoneOpen(z), hasSprite: has });
    if (!this.pages.length) this.pages = [cartes.zones[0].id]; // (aucune page : le lagon, vide)
    this.idx = Math.max(0, this.pages.indexOf(entryZone(this.pages, rewards.collection())));
    // la surface du glisser : sous les créatures et les boutons
    this.swipe = document.createElement("div"); this.swipe.className = "reef-swipe"; app.stage.ui.append(this.swipe); this.els.push(this.swipe);
    this.swipe.addEventListener("pointerdown", (e) => this.down(e, null));
    this.onMove = (e) => this.move(e); this.onUp = (e) => this.up(e);
    addEventListener("pointermove", this.onMove); addEventListener("pointerup", this.onUp); addEventListener("pointercancel", this.onUp);
    await this.build(this.idx);
    this.tick = (t) => this.frame(t);
    ocean.front.push(this.tick);
    const home = spriteBox(app, { x: 90 - 70, y: 712 - 70, w: 140, h: 140, cls: "bubble homekey", label: "revenir", paint: (ctx) => sprites.draw(ctx, "maison", 0, 70, 70) });
    // l'album, par-dessus le récif (docs/SPEC.md : « depuis l'accueil et depuis le récif »)
    const book = spriteBox(app, { x: 90 - 70, y: 560 - 70, w: 140, h: 140, cls: "bubble albumkey", label: "l'album", paint: (ctx) => { const q = sprites.frame("album", 0), k = 140 / 180, px = sprites.px; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 70 * px + q.dx * k, 70 * px + q.dy * k, q.w * k, q.h * k); } });
    // (lot 3 ter, T3 : les boutons de navigation valident au lever du doigt ; l'appui long montre leur nom)
    onBrief(app, book, async () => { pop(book); await this.view.close(); if (app.album && !app.album.open) { await app.album.visit(); voice.say(text.data.recifBienvenue, { instruction: true }); } }, "album");
    this.els.push(home, book);
    this.pearls();
    ocean.octo.play("saluer");
    const any = [...this.zones.values()].some((z) => z.beings.length) || this.gifts?.length;
    voice.stop(); voice.say(text.data[any ? "recifBienvenue" : "recifVide"], { instruction: true });
    await new Promise((r) => onBrief(app, home, () => { if (app.album?.open) return; pop(home); r(); }, "maison"));
    await this.view.close();
    voice.stop(); this.leave();
  }
  // ---------------------------------------------------------------- les pages
  // les créatures d'une page (et, pour le lagon, les cadeaux) : sa planche est chargée d'abord
  async build(i) {
    const { app } = this, { sprites, ocean, rewards, cartes } = app, zone = this.pages[i];
    if (this.zones.has(zone)) return this.zones.get(zone).ready;
    const z = { zone, beings: [], gifts: [] }; this.zones.set(zone, z);
    z.ready = (async () => {
      await Promise.all([...this.sheetsOf(zone)].map((s) => sprites.load(s)));
      if (!this.open || this.zones.get(zone) !== z) return;
      // (lot 3 bis, A6 : les décors gagnés par les doublons, et dans le lagon les cadeaux de la surprise)
      z.gifts = reefDecor(cartes, rewards, zone, GIFT_SPOTS).filter((d) => sprites.atlas.sprites[d.sprite] && sprites.ready(sprites.sheetOf(d.sprite))).map((d) => { const a = ocean.spriteActor(ocean.frontEl, d.sprite); a.draw(0); return { a, at: d.at, s: d.s ?? 1 }; });
      this.gifts = [...this.zones.values()].flatMap((x) => x.gifts);
      for (const c of pageCreatures(rewards.collection(), zone, (id) => !!sprites.atlas.sprites[`creature.${id}`])) {
        if (!sprites.ready(sprites.sheetOf(`creature.${c.id}`))) continue;
        const a = ocean.spriteActor(ocean.frontEl, `creature.${c.id}`), spec = sprites.atlas.sprites[`creature.${c.id}`], ph = c.id.length * 1.7;
        const b = { c, a, ph, move: MOVES[c.id] ?? ((t) => [0, spec.meta?.ground ? 0 : 5 * Math.sin(t)]) };
        // la zone à toucher : toute la créature, et au moins 96 px (des doigts de 7 ans)
        const q = sprites.frame(`creature.${c.id}`, 0), px = sprites.px, w = Math.max(96, q.w / px), h = Math.max(96, q.h / px);
        b.hit = document.createElement("button"); b.hit.className = "bubble creature"; b.hit.dataset.id = c.id; b.hit.dataset.zone = zone; b.hit.setAttribute("aria-label", c.nom);
        b.box = { dx: q.dx / px + q.w / px / 2, dy: q.dy / px + q.h / px / 2, w, h };
        Object.assign(b.hit.style, { width: `${w}px`, height: `${h}px` }); app.stage.ui.insertBefore(b.hit, this.swipe.nextSibling);
        // un toucher bref ouvre la carte ; un glisser qui part d'une créature fait tourner la page
        b.hit.addEventListener("pointerdown", (e) => this.down(e, b));
        if (c.brillante) { b.glint = ocean.spriteActor(ocean.frontEl, "eclat"); b.glint.draw(0); }
        z.beings.push(b);
      }
    })();
    return z.ready;
  }
  // une page n'est plus à l'écran : ses acteurs sont retirés, ses planches libérées (sauf celles de la page affichée)
  drop(zone) {
    const { ocean, sprites, cartes, rewards } = this.app, z = this.zones.get(zone); if (!z) return;
    this.zones.delete(zone);
    for (const b of z.beings) { b.hit.remove(); for (const a of [b.a, b.glint].filter(Boolean)) { a.remove(); ocean.actors.splice(ocean.actors.indexOf(a), 1); } }
    for (const g of z.gifts) { g.a.remove(); ocean.actors.splice(ocean.actors.indexOf(g.a), 1); }
    const keep = new Set([...this.zones.keys()].flatMap((k) => [...this.sheetsOf(k)]));
    for (const s of this.sheetsOf(zone)) if (!keep.has(s)) sprites.unload(s);
    void cartes; void rewards;
  }
  // les planches d'une page : ses créatures gagnées (et son décor) ; pour le lagon, aussi les cadeaux de la surprise
  sheetsOf(zone) {
    const { sprites, cartes, rewards } = this.app, out = pageSheets(sprites.atlas, cartes, zone, rewards.owned);
    for (const d of reefDecor(cartes, rewards, zone, GIFT_SPOTS)) if (sprites.atlas.sprites[d.sprite]) out.add(sprites.sheetOf(d.sprite));
    return out;
  }
  // chaque image : les créatures de chaque page chargée, décalées de leur page ; le décor suit la page affichée
  frame(t) {
    const W = this.conf.largeur, k = this.app.stage.k, s = this.shift;
    for (const [zone, z] of this.zones) {
      const off = (this.pages.indexOf(zone) - this.idx) * W + s, on = Math.abs(off) < W + 200;
      for (const b of z.beings) {
        const [dx, dy] = b.move(t + b.ph), x = b.c.recif[0] + dx + off, y = b.c.recif[1] + dy;
        b.a.show(on); b.hit.style.visibility = on ? "" : "hidden"; if (!on) continue;
        b.a.draw(Math.floor(t * 8 + b.ph) % 12); b.a.moveTo(x, y);
        Object.assign(b.hit.style, { left: `${x + b.box.dx - b.box.w / 2}px`, top: `${y + b.box.dy - b.box.h / 2}px` });
        if (b.glint) { const u = (t * 0.6 + b.ph) % 1; b.glint.moveTo(x + b.box.dx + 30, y + b.box.dy - 30, 0.3 + 0.7 * Math.sin(Math.PI * u), Math.round(Math.sin(Math.PI * u) * 20) / 20); }
      }
      for (const g of z.gifts) { g.a.show(on); g.a.moveTo(g.at[0] + off, g.at[1], g.s); }
    }
    // le fond et le décor mobile (algues, poissons, reflets, bulles) suivent la page affichée ; la copie du fond montre la voisine
    const css = s ? `translateX(${Math.round(s * k * 100) / 100}px)` : "";
    for (const el of [this.app.stage.bg, this.app.ocean.backEl]) if (el.style.transform !== css) el.style.transform = css;
    if (this.bgCopy) { this.bgCopy.style.visibility = s ? "visible" : "hidden"; if (s) this.bgCopy.style.transform = `translateX(${Math.round((s - Math.sign(s) * W) * k * 100) / 100}px)`; }
  }
  // ---------------------------------------------------------------- toucher et glisser
  down(e, being) {
    if (this.gesture || this.view.card) return;
    e.preventDefault();
    const k = this.app.stage.k;
    // un glisser qui part pendant que la page se cale : elle se cale d'abord, tout de suite
    this.gesture = { id: e.pointerId, x0: e.clientX / k, y0: e.clientY / k, t0: performance.now(), being, drag: false, base: 0, last: [[performance.now(), e.clientX / k]] };
  }
  move(e) {
    const g = this.gesture; if (!g || e.pointerId !== g.id) return;
    const k = this.app.stage.k, dx = e.clientX / k - g.x0, dy = e.clientY / k - g.y0;
    g.last.push([performance.now(), e.clientX / k]); if (g.last.length > 6) g.last.shift();
    if (!g.drag && isDrag(dx, dy, this.conf)) {
      g.drag = true;
      if (this.anim) this.finishAnim();
      // le fond fixe, recopié au premier glisser : il montre la page voisine (le vrai fond suit la page affichée)
      this.bgCopy ??= this.copyBackground();
    }
    if (!g.drag) return;
    const d = e.clientX / k - g.x0;
    // la planche de la page voisine, dès que le glisser part vers elle
    const nb = this.idx + (d < 0 ? 1 : -1); if (nb >= 0 && nb < this.pages.length) this.build(nb);
    this.shift = dragShift(d, this.idx, this.pages.length, this.conf);
  }
  up(e) {
    const g = this.gesture; if (!g || e.pointerId !== g.id) return;
    this.gesture = null;
    const k = this.app.stage.k, dx = e.clientX / k - g.x0, dy = e.clientY / k - g.y0, ms = performance.now() - g.t0;
    if (!g.drag) { if (g.being && isTap(dx, dy, ms, this.conf)) this.view.show(g.being.c); return; }
    const [t1, x1] = g.last[0], v = (e.clientX / k - x1) / Math.max(16, performance.now() - t1);
    const dir = settleTarget(dx, v, this.idx, this.pages.length, this.conf);
    this.settle(dir);
  }
  // la page se cale : sur la voisine (dir ±1) ou revient (0 : retour, ou rebond en bout de liste)
  settle(dir) {
    const from = this.shift, to = -dir * this.conf.largeur, t0 = performance.now(), ms = this.conf.dureeMs * (dir ? 1 : 0.8 + Math.min(1, Math.abs(from) / 400) * 0.4);
    if (dir) { this.build(this.idx + dir); this.bgCopy ??= this.copyBackground(); }
    this.anim = { dir, done: false };
    const anim = this.anim, step = (now) => {
      if (anim.done) return;
      const u = Math.min(1, (now - t0) / ms);
      // un léger rebond au retour (dépasse un peu, puis revient)
      const e = dir ? ease(u) : 1 - Math.pow(1 - u, 2) * Math.cos(u * Math.PI * 1.5);
      this.shift = from + (to - from) * e;
      if (u < 1) requestAnimationFrame(step); else this.finishAnim();
    };
    requestAnimationFrame(step);
  }
  finishAnim() {
    const a = this.anim; if (!a || a.done) return; a.done = true; this.anim = null;
    this.shift = 0;
    if (!a.dir) return;
    const old = this.pages[this.idx]; this.idx += a.dir;
    // la page affichée a changé : le décor mobile revient en douceur, les autres pages sont libérées
    const back = this.app.ocean.backEl; back.style.transition = "none"; back.style.opacity = "0"; void back.offsetWidth; back.style.transition = "opacity 0.5s"; back.style.opacity = "";
    for (const zone of [...this.zones.keys()]) if (zone !== this.pages[this.idx]) this.drop(zone);
    this.paintPearls(); void old;
    this.app.sound?.play("bouton");
  }
  // aller à une page en touchant sa perle
  async goTo(i) {
    if (i === this.idx || this.gesture) return;
    if (this.anim) this.finishAnim();
    if (Math.abs(i - this.idx) === 1) { await this.build(i); return this.settle(i - this.idx); }
    // une page plus loin : directement, le décor revient en douceur
    await this.build(i);
    this.anim = { dir: i - this.idx, done: false }; this.finishAnim();
  }
  // ---------------------------------------------------------------- les perles (à partir de deux pages)
  pearls() {
    this.pearlEls = [];
    if (this.pages.length < 2) return;
    const { app } = this, n = this.pages.length, x0 = 640 - ((n - 1) * PEARL.gap) / 2;
    this.pages.forEach((zone, i) => {
      const b = spriteBox(app, { x: x0 + i * PEARL.gap - PEARL.size / 2, y: PEARL.y - PEARL.size / 2, w: PEARL.size, h: PEARL.size, cls: "bubble reef-pearl", label: app.cartes.zones.find((z) => z.id === zone)?.nom ?? zone, paint: (ctx, px) => this.paintPearl(ctx, px, i) });
      b.dataset.zone = zone; onBrief(app, b, () => { pop(b); this.goTo(i); }, () => app.cartes.zones.find((z) => z.id === zone)?.nom ?? null);
      this.els.push(b); this.pearlEls.push(b);
    });
    this.paintPearls();
  }
  // la perle de la page (atelier : `recif.perle`, de la même main que celles de l'album, dans la planche « petits ») : pleine
  // et un peu plus grande pour la page affichée, vide pour les autres
  paintPearl(ctx, px, i) { this.app.sprites.draw(ctx, "recif.perle", i === this.idx ? 1 : 0, PEARL.size / 2, PEARL.size / 2); void px; }
  paintPearls() { this.pearlEls?.forEach((b) => { b.classList.toggle("sel", b.dataset.zone === this.pages[this.idx]); b.repaint(); }); }
  // le fond fixe (eau, sable, rayons), recopié dans un canvas posé à côté du vrai
  copyBackground() {
    const { stage, sprites } = this.app;
    const c = document.createElement("canvas"); c.className = "reef-bgcopy"; c.width = stage.bg.width; c.height = stage.bg.height;
    Object.assign(c.style, { position: "absolute", left: "0", top: "0", width: "100%", height: "100%", visibility: "hidden" });
    const ctx = c.getContext("2d"), q = sprites.frame("fond", 0), r = sprites.frame("rayons", 0);
    if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 0, 0, c.width, c.height);
    if (r) ctx.drawImage(r.img, r.sx, r.sy, r.w, r.h, 0, 0, c.width, c.height);
    // le bord de la page : une ombre douce de chaque côté, là où elle touche la page affichée (sinon, une cassure nette)
    for (const [x0, x1] of [[0, 48], [c.width, c.width - 48]]) { const g = ctx.createLinearGradient(x0 * 1, 0, x0 + (x1 - x0) * stage.px, 0); g.addColorStop(0, "rgba(6, 34, 44, 0.38)"); g.addColorStop(1, "rgba(6, 34, 44, 0)"); ctx.fillStyle = g; ctx.fillRect(Math.min(x0, x0 + (x1 - x0) * stage.px), 0, 48 * stage.px, c.height); }
    stage.bg.after(c);
    return c;
  }
  leave() {
    const { ocean, sprites } = this.app;
    removeEventListener("pointermove", this.onMove); removeEventListener("pointerup", this.onUp); removeEventListener("pointercancel", this.onUp);
    if (this.anim) this.anim.done = true; this.anim = null; this.gesture = null;
    ocean.front.splice(ocean.front.indexOf(this.tick), 1);
    for (const zone of [...this.zones.keys()]) this.drop(zone);
    this.shift = 0; for (const el of [this.app.stage.bg, ocean.backEl]) { el.style.transform = ""; el.style.opacity = ""; el.style.transition = ""; }
    this.bgCopy?.remove(); this.bgCopy = null;
    this.els.forEach((e) => e.remove()); this.gifts = []; this.open = false;
    sprites.unload("recif"); sprites.unload("cartes"); sprites.unload("decors"); forgetPictures();
  }
}
