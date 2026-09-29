// LES BOUTONS DE L'ÉCRAN : un élément HTML dans #ui qui porte un petit canvas dessiné une fois (sprites de
// l'atelier, chiffres et lettres encrés en direct), et le toucher franc.
import * as R from "../art/runtime.js";
// un bouton (ou un simple calque si `still`) : un canvas à la taille de la boîte, `paint(ctx)` en px logiques
export function spriteBox(app, { x, y, w, h, cls = "bubble", label = "", still = false, paint }) {
  const { stage } = app, b = document.createElement(still ? "div" : "button"), c = document.createElement("canvas");
  b.className = cls; Object.assign(b.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  if (label) b.setAttribute("aria-label", label);
  c.width = Math.round(w * stage.px); c.height = Math.round(h * stage.px); b.append(c); stage.ui.append(b);
  b.repaint = (f = paint) => { const ctx = c.getContext("2d"); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); f(ctx, stage.px); };
  b.repaint();
  return b;
}
// un toucher franc : pointerdown (pas de délai de clic)
export const onTap = (el, f) => el.addEventListener("pointerdown", (e) => { e.preventDefault(); f(e); });
// (lot 3 bis, B3) L'APPUI LONG sur un pictogramme : un toucher bref (lever le doigt avant `appuiLong.ms`) valide ; un
// appui plus long montre une étiquette au-dessus du pictogramme (le texte de legendes.json, `etiquettes`), qui reste tant
// que le doigt est posé puis `gardeMs` après, et ne valide rien. La voix ne la lit pas.
export function onBrief(app, el, f, key, { show = showLabel, hide = hideLabel } = {}) {
  const A = app.legendes?.appuiLong ?? { ms: 500, gardeMs: 2000 }, txt = app.legendes?.etiquettes?.[key];
  let timer = null, long = false, down = false;
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault(); down = true; long = false; clearTimeout(timer);
    if (txt) timer = setTimeout(() => { if (!down) return; long = true; el.__label = show(app, el, txt); }, A.ms);
  });
  const up = (e, ok) => {
    if (!down) return; down = false; clearTimeout(timer);
    if (long) { const t = el.__label; setTimeout(() => { if (el.__label === t) hide(el); }, A.gardeMs); return; }
    if (ok) f(e);
  };
  el.addEventListener("pointerup", (e) => up(e, true));
  el.addEventListener("pointercancel", (e) => up(e, false));
}
// l'étiquette : dessinée en direct (runtime.js, drawLabel), la pointe vers le pictogramme, gardée dans l'écran
export function showLabel(app, el, text) {
  hideLabel(el);
  const lines = R.wrapWords(text, 13), sz = R.labelSize(lines), bw = sz.w + 24, bh = sz.h + 16 + 12;
  const cx = parseFloat(el.style.left) + parseFloat(el.style.width) / 2, top = parseFloat(el.style.top);
  const left = Math.max(8, Math.min(1272 - bw, cx - bw / 2)), y = Math.max(8, top - bh + 6);
  const lab = spriteBox(app, { x: left, y, w: bw, h: bh, cls: "hud etiquette", still: true, paint: (ctx, px) => { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawLabel(ctx, cx - left, bh - 8, lines, { dx: bw / 2 - (cx - left) }); } });
  lab.dataset.pour = el.getAttribute("aria-label") ?? ""; el.__label = lab;
  const off = new MutationObserver(() => { if (!el.isConnected) { hideLabel(el); off.disconnect(); } });
  off.observe(app.stage.ui, { childList: true });
  return lab;
}
export function hideLabel(el) { el.__label?.remove(); el.__label = null; }
export const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
// « PASSER » (docs/SPEC.md, « Ergonomie et voix ») : un seul bouton pour les leçons, les exemples guidés et
// les corrections, toujours le même dessin (deux triangles jaunes) à la même place (en haut à droite, sous
// « réécouter »), zone tactile de 140 px. Il est créé tout de suite (aucune attente avant de l'afficher) ;
// `onSkip` n'est appelé qu'une fois ; touché, le bouton s'efface aussitôt (le temps de son petit rebond) ;
// `remove()` l'enlève.
export const SKIP_AT = [1205, 218];
export function skipKey(app, onSkip, label = "passer") {
  const b = spriteBox(app, { x: SKIP_AT[0] - 70, y: SKIP_AT[1] - 70, w: 140, h: 140, cls: "bubble skip", label, paint: (ctx) => app.sprites.draw(ctx, "passer", 0, 70, 70) });
  let used = false;
  onTap(b, () => { if (used) return; used = true; pop(b); onSkip(); setTimeout(() => { b.style.visibility = "hidden"; }, 150); });
  return b;
}
