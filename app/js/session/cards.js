// UNE CARTE À L'ÉCRAN (docs/SPEC.md, « Coquillages et cartes »). Trois faces, chacune un canvas dessiné
// une fois : le dos (la coquille dorée), le recto (l'illustration dans sa fenêtre, le cadre et la plaque
// aux couleurs de la rareté, le nom écrit au feutre) et le verso (le nom et l'anecdote, écrits). La carte
// se retourne par une rotation CSS (le compositeur la fait) ; on ne l'agrandit jamais au-delà de sa taille.
// L'illustration : l'image générée (content/cartes.json, `illustration`, dans app/assets/cards/) si elle
// existe, sinon le dessin provisoire de l'atelier (sprite `carte.illu.<id>`). L'application y ajoute le
// cadre, la rareté et le nom ; il n'y a jamais de texte dans l'image.
import * as R from "../art/runtime.js";

export const CARD = { W: 316, H: 456, win: [24, 22, 252, 336], plate: [30, 372, 240, 50] };
const images = new Map();
// l'illustration générée, chargée une fois (null si absente ou illisible : le dessin provisoire la remplace)
const illustration = (src) => { if (!src) return Promise.resolve(null); if (!images.has(src)) images.set(src, fetch(src).then((r) => (r.ok ? r.blob() : null)).then((b) => (b ? createImageBitmap(b) : null)).catch(() => null)); return images.get(src); };

// un nom, au plus grand qui tienne dans `width` (em : hauteur d'une capitale)
const fitWord = (text, width, max) => Math.min(max, width / Math.max(0.1, R.wordWidth(text)));
// coupe un texte en lignes qui tiennent dans `width` px au corps `em`
export const wrap = (text, width, em) => {
  const lines = []; let cur = "";
  for (const w of text.split(" ")) { const next = cur ? `${cur} ${w}` : w; if (R.wordWidth(next) * em > width && cur) { lines.push(cur); cur = w; } else cur = next; }
  if (cur) lines.push(cur);
  return lines;
};

// dessine une face dans un contexte en pixels d'écran (px : pixels d'écran par pixel logique)
export async function paintFace(ctx, px, sprites, card, face) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const rar = card.rarete === "rare" ? "rare" : "commune", [wx, wy, ww, wh] = CARD.win;
  if (face === "dos") { sprites.draw(ctx, "carte.dos", 0, 0, 0); return; }
  if (face === "verso") {
    sprites.draw(ctx, `carte.verso.${rar}`, 0, 0, 0);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    const em = fitWord(card.nom, 240, 32); R.drawWord(ctx, card.nom, 150, 44, em, { w: em * 0.14, seed: 720 });
    const lines = wrap(card.anecdote, 236, 21), top = 118 + Math.max(0, (6 - lines.length) * 16);
    lines.forEach((l, i) => R.drawWord(ctx, l, 150, top + i * 42, 21, { w: 3.1, seed: 740 + i * 7 }));
    return;
  }
  sprites.draw(ctx, `carte.recto.${rar}`, 0, 0, 0);
  const img = await illustration(card.illustration);
  if (img) {
    // l'image générée couvre la fenêtre (recadrée au centre, jamais agrandie au-delà de sa taille)
    const W = ww * px, H = wh * px, k = Math.max(W / img.width, H / img.height), sw = W / k, sh = H / k;
    ctx.save(); ctx.beginPath(); ctx.roundRect(wx * px, wy * px, W, H, 12 * px); ctx.clip();
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, wx * px, wy * px, W, H); ctx.restore();
  } else {
    ctx.save(); ctx.beginPath(); ctx.roundRect(wx * px, wy * px, ww * px, wh * px, 12 * px); ctx.clip();
    sprites.draw(ctx, `carte.illu.${card.id}`, 0, wx + ww / 2, wy + wh / 2); ctx.restore();
  }
  sprites.draw(ctx, `carte.bord.${rar}`, 0, 0, 0);
  ctx.setTransform(px, 0, 0, px, 0, 0);
  const [px0, py0, pw, ph] = CARD.plate, em = fitWord(card.nom, pw - 34, 30);
  R.drawWord(ctx, card.nom, px0 + pw / 2, py0 + ph / 2 - em * 0.55, em, { w: em * 0.14, seed: 700 + card.nom.length });
}

// l'élément HTML d'une carte : deux faces dos à dos dans un conteneur qui tourne. `front` : « recto »
// (au départ, face visible) ; `back` : « dos » ou « verso ». Renvoie l'élément, prêt (faces dessinées).
export async function cardElement(app, card, { x, y, front = "recto", back = "dos", brillante = false } = {}) {
  const { stage, sprites } = app, px = stage.px, el = document.createElement("div"), inner = document.createElement("div");
  el.className = `card${brillante ? " shiny" : ""}`; inner.className = "card-inner";
  Object.assign(el.style, { left: `${x}px`, top: `${y}px`, width: `${CARD.W}px`, height: `${CARD.H}px` });
  const face = async (name, cls) => { const c = document.createElement("canvas"); c.width = Math.round(CARD.W * px); c.height = Math.round(CARD.H * px); c.className = `card-face ${cls}`; await paintFace(c.getContext("2d"), px, sprites, card, name); return c; };
  const [a, b] = await Promise.all([face(front, "front"), face(back, "back")]);
  inner.append(a, b); el.append(inner);
  if (brillante) for (let i = 0; i < 3; i++) { const s = document.createElement("canvas"), q = 80; s.width = s.height = Math.round(q * px); s.className = `glint g${i}`; sprites.draw(s.getContext("2d"), "eclat", 0, q / 2, q / 2); el.append(s); }
  el.flip = (v = !el.classList.contains("flipped")) => el.classList.toggle("flipped", v);
  el.faces = { front: a, back: b };
  el.repaintBack = (name) => paintFace(b.getContext("2d"), px, sprites, card, name);
  stage.ui.append(el);
  return el;
}
