// LE SÉLECTEUR DE DIFFICULTÉ (lot 2, docs/SPEC-LOT2.md, section 2), juste après l'accueil. Quatre grandes
// bulles sans texte (dessins de l'atelier, art/src/canvas-core/sea/selector.ts) : des vagues de plus en plus
// grosses et ce qu'elles rapportent en étoiles de mer (½, 1, 1½, 2). Le cran conseillé est entouré d'une lueur
// et choisi d'avance. Toucher une bulle la choisit et la voix dit ce qu'elle rapporte ; la grosse coche
// valide ; sans toucher pendant `attenteS` secondes, la séance commence sur le cran affiché. Le parent peut
// limiter les crans proposés (réglage « cransAutorises » : { min, max }). Entraînement libre : les mêmes
// bulles sans étoiles (pas de multiplicateur).
import * as R from "../art/runtime.js";
import { CRANS } from "./session.js";
import { onTap, pop, spriteBox } from "../engine/ui.js";

export const CRAN_ROW = { y: 420, cx: 810, gap: 220 } /* à droite de la pieuvre */, CRAN_BOX = 240, CHECK_AT = [810, 668];
// les crans que le parent autorise, dans l'ordre (au moins un) ; réglage { min, max } par noms de crans
export function allowedCrans(setting) {
  const lo = Math.max(0, CRANS.indexOf(setting?.min ?? "facile")), hi = Math.max(lo, CRANS.indexOf(setting?.max ?? "tresdur") < 0 ? 3 : CRANS.indexOf(setting?.max ?? "tresdur"));
  return CRANS.slice(lo, hi + 1);
}
// le cran de départ : le conseillé s'il est autorisé, sinon le plus proche
export const startCran = (allowed) => (allowed.includes("conseille") ? "conseille" : allowed[0] === "dur" || allowed[0] === "tresdur" ? allowed[0] : allowed.at(-1));

// montre le sélecteur ; renvoie le nom du cran choisi. o : { allowed, stars (false : entraînement libre), attenteS,
// cls (classe de plus : « free » dans l'entraînement libre, rangé par la maison) }
export async function chooseCran(app, { allowed = CRANS, stars = true, attenteS = 15, cls = "" } = {}) {
  const { sprites, voice, text } = app;
  if (allowed.length <= 1) return allowed[0] ?? "conseille";
  await sprites.load("selecteur");
  let cur = startCran(allowed);
  const n = allowed.length, els = [], xOf = (i) => CRAN_ROW.cx + (i - (n - 1) / 2) * CRAN_ROW.gap;
  // la lueur du conseillé, sous sa bulle
  const ci = allowed.indexOf("conseille");
  if (ci >= 0) { const G = 252; els.push(spriteBox(app, { x: xOf(ci) - G / 2, y: CRAN_ROW.y - G / 2, w: G, h: G, cls: `hud cran-glow ${cls}`, still: true, paint: (ctx) => sprites.draw(ctx, "cran.lueur", 0, G / 2, G / 2) })); }
  const bubbles = allowed.map((name, i) => {
    const lv = CRANS.indexOf(name), sprite = stars ? `cran.${lv}` : `cran.libre.${lv}`, H = CRAN_BOX / 2;
    const b = spriteBox(app, { x: xOf(i) - H, y: CRAN_ROW.y - H, w: CRAN_BOX, h: CRAN_BOX, cls: `bubble cran ${cls}`, label: name, paint: (ctx, px) => { sprites.draw(ctx, sprite, 0, H, H); if (name === cur) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawRing(ctx, H, H, 104, "#ffd23a"); } } });
    b.dataset.cran = name; els.push(b); return b;
  });
  const check = spriteBox(app, { x: CHECK_AT[0] - 80, y: CHECK_AT[1] - 80, w: 160, h: 160, cls: `bubble check cran-ok ${cls}`, label: "valider", paint: (ctx) => sprites.draw(ctx, "valider", 0, 80, 80) });
  els.push(check);
  const show = () => bubbles.forEach((b) => { b.classList.toggle("chosen", b.dataset.cran === cur); b.repaint(); });
  show();
  voice.stop(); voice.say(stars ? text.data.selecteur : text.data.selecteurLibre, { instruction: true });
  const said = (name) => (stars ? text.data.cran[name] : text.data.cranLibre[name]);
  const name = await new Promise((res) => {
    let timer = null;
    const arm = () => { clearTimeout(timer); timer = setTimeout(() => res(cur), attenteS * 1000); };
    bubbles.forEach((b) => onTap(b, () => { cur = b.dataset.cran; pop(b); show(); voice.stop(); voice.say(said(cur)); arm(); }));
    onTap(check, () => { clearTimeout(timer); pop(check); res(cur); });
    arm();
  });
  voice.stop();
  await new Promise((r) => setTimeout(r, 250));
  els.forEach((e) => e.remove());
  sprites.unload("selecteur");
  return name;
}
