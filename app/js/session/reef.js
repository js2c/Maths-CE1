// LE RÉCIF (docs/SPEC.md, « Le récif ») : chaque créature obtenue y vit, animée (boucles fabriquées par
// l'atelier, planche « recif », chargée seulement pendant la visite puis libérée). On y entre depuis
// l'écran de départ ou depuis la lune ; la visite est libre et ne rapporte rien. Toucher une créature
// montre sa carte (recto) et la voix dit son nom et son anecdote ; toucher la carte la retourne (le verso
// porte l'anecdote écrite) ; la coche verte la range (cards.js, CardView). La maison ramène à l'écran de
// départ ; le livre ouvre l'album (album.js).
// Au lot 1, seule la première zone (le lagon) est ouverte : c'est le décor de l'océan lui-même.
import { CardView, forgetPictures } from "./cards.js";
import { onTap, spriteBox } from "./screens.js";
import { GIFT_SPOTS } from "./surprise.js";

const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
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

export class Reef {
  constructor(app) { this.app = app; this.open = false; this.view = new CardView(app); }
  // la visite ; la promesse se résout quand l'enfant touche la maison
  async visit() {
    const { app } = this, { sprites, ocean, voice, text, rewards } = app;
    this.open = true; this.els = []; this.beings = [];
    await sprites.load("recif");
    // les cadeaux de la surprise, posés sur le sable, derrière les créatures
    this.gifts = rewards.gifts.filter((id) => GIFT_SPOTS[id] && sprites.atlas.sprites[`cadeau.${id}`]).map((id) => { const a = ocean.spriteActor(ocean.frontEl, `cadeau.${id}`); a.draw(0); a.moveTo(...GIFT_SPOTS[id]); return a; });
    // les créatures qui ont leur dessin dans l'atelier (les zones 2 à 4 viendront au lot 4 : d'ici là, leurs
    // cartes vivent seulement dans l'album)
    for (const c of rewards.collection().filter((x) => x.recif && sprites.atlas.sprites[`creature.${x.id}`])) {
      const a = ocean.spriteActor(ocean.frontEl, `creature.${c.id}`), spec = sprites.atlas.sprites[`creature.${c.id}`], ph = c.id.length * 1.7;
      const b = { c, a, ph, move: MOVES[c.id] ?? ((t) => [0, spec.meta?.ground ? 0 : 5 * Math.sin(t)]) };
      // la zone à toucher : toute la créature, et au moins 96 px (des doigts de 7 ans)
      const q = sprites.frame(`creature.${c.id}`, 0), px = sprites.px, w = Math.max(96, q.w / px), h = Math.max(96, q.h / px);
      b.hit = document.createElement("button"); b.hit.className = "bubble creature"; b.hit.dataset.id = c.id; b.hit.setAttribute("aria-label", c.nom);
      b.box = { dx: q.dx / px + q.w / px / 2, dy: q.dy / px + q.h / px / 2, w, h };
      Object.assign(b.hit.style, { width: `${w}px`, height: `${h}px` }); app.stage.ui.append(b.hit);
      onTap(b.hit, () => this.view.show(c));
      if (c.brillante) { b.glint = ocean.spriteActor(ocean.frontEl, "eclat"); b.glint.draw(0); }
      this.beings.push(b);
    }
    this.tick = (t) => this.beings.forEach((b) => {
      const [dx, dy] = b.move(t + b.ph), x = b.c.recif[0] + dx, y = b.c.recif[1] + dy;
      b.a.draw(Math.floor(t * 8 + b.ph) % 12); b.a.moveTo(x, y);
      Object.assign(b.hit.style, { left: `${x + b.box.dx - b.box.w / 2}px`, top: `${y + b.box.dy - b.box.h / 2}px` });
      if (b.glint) { const u = (t * 0.6 + b.ph) % 1; b.glint.moveTo(x + b.box.dx + 30, y + b.box.dy - 30, 0.3 + 0.7 * Math.sin(Math.PI * u), Math.round(Math.sin(Math.PI * u) * 20) / 20); }
    });
    ocean.front.push(this.tick);
    const home = spriteBox(app, { x: 90 - 70, y: 712 - 70, w: 140, h: 140, cls: "bubble homekey", label: "revenir", paint: (ctx) => sprites.draw(ctx, "maison", 0, 70, 70) });
    // l'album, par-dessus le récif (docs/SPEC.md : « depuis l'accueil et depuis le récif »)
    const book = spriteBox(app, { x: 90 - 70, y: 560 - 70, w: 140, h: 140, cls: "bubble albumkey", label: "l'album", paint: (ctx) => { const q = sprites.frame("album", 0), k = 140 / 180, px = sprites.px; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 70 * px + q.dx * k, 70 * px + q.dy * k, q.w * k, q.h * k); } });
    onTap(book, async () => { pop(book); await this.view.close(); if (app.album && !app.album.open) { await app.album.visit(); voice.say(text.data.recifBienvenue, { instruction: true }); } });
    this.els.push(home, book);
    ocean.octo.play("saluer");
    voice.stop(); voice.say(text.data[this.beings.length || this.gifts.length ? "recifBienvenue" : "recifVide"], { instruction: true });
    await new Promise((r) => onTap(home, () => { if (app.album?.open) return; pop(home); r(); }));
    await this.view.close();
    voice.stop(); this.leave();
  }
  leave() {
    const { ocean, sprites } = this.app;
    ocean.front.splice(ocean.front.indexOf(this.tick), 1);
    for (const b of this.beings) { b.hit.remove(); for (const a of [b.a, b.glint].filter(Boolean)) { a.remove(); ocean.actors.splice(ocean.actors.indexOf(a), 1); } }
    for (const a of this.gifts ?? []) { a.remove(); ocean.actors.splice(ocean.actors.indexOf(a), 1); }
    this.els.forEach((e) => e.remove()); this.beings = []; this.gifts = []; this.open = false;
    sprites.unload("recif"); sprites.unload("cartes"); forgetPictures();
  }
}
