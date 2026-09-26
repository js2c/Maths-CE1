// UNE CARTE À L'ÉCRAN (docs/SPEC.md, « La carte et l'album »). Une carte est un portrait 3:4 de 330 × 440 :
//  - le recto : l'illustration générée en pleine page (content/cartes.json, `illustration`, dans
//    app/assets/cards/), un cadre fin aux coins arrondis dont la matière dit la rareté (nacre, argent, or)
//    et, en bas, un bandeau semi-transparent où le nom est écrit au feutre (cadre et bandeau : atelier,
//    sea/treasure.ts). Il n'y a jamais de texte dans l'image ;
//  - le verso : le nom et l'anecdote, écrits, dans le cadre de la rareté ;
//  - le dos : l'image de la zone (générée à part), ou le dos doré des légendaires.
// Chaque face est un canvas dessiné une fois ; la carte se retourne par une rotation CSS (le compositeur).
// On ne l'agrandit jamais au-delà de sa taille. Les images sont décodées directement à la taille voulue.
import * as R from "../art/runtime.js";
import { wait } from "../engine/clock.js";
import { onTap, spriteBox } from "../engine/ui.js";
import { fill } from "../engine/phrases.js";

export const CARD = { W: 330, H: 440, R: 20, FRAME: 9, BANNER: 64 };
const images = new Map();
// une image générée, décodée à w × h pixels d'écran (null si absente ou illisible)
export const picture = (src, w, h) => {
  if (!src) return Promise.resolve(null);
  const k = `${src}@${w}x${h}`;
  if (!images.has(k)) images.set(k, fetch(src).then((r) => (r.ok ? r.blob() : null)).then((b) => (b ? createImageBitmap(b, { resizeWidth: w, resizeHeight: h, resizeQuality: "high" }) : null)).catch(() => null));
  return images.get(k);
};
// libère les images décodées (fin de la visite de l'album ou du récif)
export const forgetPictures = () => { for (const p of images.values()) p.then((b) => b?.close?.()); images.clear(); };
// le dos d'une carte : celui de sa zone, doré pour une légendaire
export const backOf = (cartes, card) => (card.rarete === "legendaire" ? cartes.dosLegendaire : cartes.zones.find((z) => z.id === card.zone)?.dos) ?? null;

// un nom, au plus grand qui tienne dans `width` (em : hauteur d'une capitale)
const fitWord = (text, width, max) => Math.min(max, width / Math.max(0.1, R.wordWidth(text)));
// coupe un texte en lignes qui tiennent dans `width` px au corps `em`
export const wrap = (text, width, em) => {
  const lines = []; let cur = "";
  for (const w of text.split(" ")) { const next = cur ? `${cur} ${w}` : w; if (R.wordWidth(next) * em > width && cur) { lines.push(cur); cur = w; } else cur = next; }
  if (cur) lines.push(cur);
  return lines;
};
const rarityOf = (card) => (["rare", "legendaire"].includes(card.rarete) ? card.rarete : "commune");
// une image posée en « couverture » dans la carte (coins arrondis), à l'échelle k de la carte
const cover = (ctx, img, px, k) => { const W = CARD.W * k * px, H = CARD.H * k * px; ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, H, CARD.R * k * px); ctx.clip(); ctx.drawImage(img, 0, 0, W, H); ctx.restore(); };
// un sprite de l'atelier réduit à l'échelle k (jamais agrandi)
const sprite = (ctx, sprites, name, k) => { const q = sprites.frame(name, 0); if (!q) return; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, Math.round(q.dx * k), Math.round(q.dy * k), Math.round(q.w * k), Math.round(q.h * k)); };

// dessine une face dans un contexte en pixels d'écran ; k : échelle de la carte (1 : 330 × 440 logiques ;
// l'album la montre plus petite). face : "recto", "verso", "dos" ; cartes : content/cartes.json
export async function paintFace(ctx, px, sprites, card, face, { k = 1, cartes = null, name = true } = {}) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const rar = rarityOf(card), W = Math.round(CARD.W * k * px), H = Math.round(CARD.H * k * px);
  if (face === "dos") {
    const img = await picture(cartes ? backOf(cartes, card) : null, W, H);
    if (img) cover(ctx, img, px, k); else sprite(ctx, sprites, "carte.dos", k);
    return;
  }
  if (face === "verso") {
    sprite(ctx, sprites, `carte.verso.${rar}`, k);
    ctx.setTransform(px * k, 0, 0, px * k, 0, 0);
    const em = fitWord(card.nom, 260, 32); R.drawWord(ctx, card.nom, CARD.W / 2, 46, em, { w: em * 0.14, seed: 720 });
    const lines = wrap(card.anecdote ?? "", 262, 21), top = 122 + Math.max(0, (6 - lines.length) * 16);
    lines.forEach((l, i) => R.drawWord(ctx, l, CARD.W / 2, top + i * 42, 21, { w: 3.1, seed: 740 + i * 7 }));
    return;
  }
  const img = await picture(card.illustration, W, H);
  if (img) cover(ctx, img, px, k); else sprite(ctx, sprites, "carte.fond", k);
  if (name) sprite(ctx, sprites, "carte.bandeau", k);
  sprite(ctx, sprites, `carte.cadre.${rar}`, k);
  if (!name) return;
  ctx.setTransform(px * k, 0, 0, px * k, 0, 0);
  const em = fitWord(card.nom, CARD.W - 2 * CARD.FRAME - 44, 30), cy = CARD.H - CARD.FRAME - CARD.BANNER / 2;
  R.drawWord(ctx, card.nom, CARD.W / 2, cy - em * 0.55, em, { color: "#fffaf0", w: em * 0.14, seed: 700 + card.nom.length });
}

// l'élément HTML d'une carte : deux faces dos à dos dans un conteneur qui tourne. `front` : « recto »
// (au départ, face visible) ; `back` : « dos » ou « verso ». Renvoie l'élément, prêt (faces dessinées).
export async function cardElement(app, card, { x, y, front = "recto", back = "dos", brillante = false } = {}) {
  const { stage, sprites } = app, px = stage.px, el = document.createElement("div"), inner = document.createElement("div"), cartes = app.cartes;
  el.className = `card${brillante ? " shiny" : ""}`; inner.className = "card-inner";
  Object.assign(el.style, { left: `${x}px`, top: `${y}px`, width: `${CARD.W}px`, height: `${CARD.H}px` });
  const face = async (name, cls) => { const c = document.createElement("canvas"); c.width = Math.round(CARD.W * px); c.height = Math.round(CARD.H * px); c.className = `card-face ${cls}`; await paintFace(c.getContext("2d"), px, sprites, card, name, { cartes }); return c; };
  const [a, b] = await Promise.all([face(front, "front"), face(back, "back")]);
  inner.append(a, b); el.append(inner);
  if (brillante) for (let i = 0; i < 3; i++) { const s = document.createElement("canvas"), q = 80; s.width = s.height = Math.round(q * px); s.className = `glint g${i}`; sprites.draw(s.getContext("2d"), "eclat", 0, q / 2, q / 2); el.append(s); }
  el.flip = (v = !el.classList.contains("flipped")) => el.classList.toggle("flipped", v);
  el.faces = { front: a, back: b };
  stage.ui.append(el);
  return el;
}

// UNE CARTE EN GRAND (récif, album) : au milieu, sur un voile ; la voix dit son nom et son anecdote ;
// toucher la carte la retourne (le verso porte l'anecdote écrite) ; la coche verte ou le voile la range.
export class CardView {
  constructor(app) { this.app = app; this.card = null; this.tok = 0; }
  async show(c) {
    const { app } = this, { sprites, voice, text } = app;
    if (this.card) await this.close();
    const token = ++this.tok;
    await sprites.load("cartes");
    if (token !== this.tok) return;
    const veil = document.createElement("div"); veil.className = "veil"; app.stage.ui.append(veil);
    const el = await cardElement(app, c, { x: 640 - CARD.W / 2, y: 150, front: "recto", back: "verso", brillante: c.brillante });
    if (token !== this.tok) { veil.remove(); el.remove(); return; }
    el.classList.add("enter");
    const ok = spriteBox(app, { x: 1000 - 80, y: 560, w: 160, h: 160, cls: "bubble check", label: "c'est bon", paint: (ctx) => sprites.draw(ctx, "valider", 0, 80, 80) });
    this.card = { veil, el, ok };
    const read = () => { voice.stop(); voice.say(`${fill(text.data.recifCarte, { nom: c.nomLu ?? c.nom })} ${c.anecdote}`, { instruction: true }); };
    onTap(el, () => { el.flip(); read(); });
    onTap(veil, () => this.close()); onTap(ok, () => this.close());
    read();
  }
  async close() {
    if (!this.card) return;
    const { veil, el, ok } = this.card; this.card = null; this.tok++;
    this.app.voice.stop(); ok.remove(); el.classList.add("leave"); veil.remove(); await wait(400); el.remove();
  }
}
