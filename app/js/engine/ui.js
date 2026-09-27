// LES BOUTONS DE L'ÉCRAN : un élément HTML dans #ui qui porte un petit canvas dessiné une fois (sprites de
// l'atelier, chiffres et lettres encrés en direct), et le toucher franc.
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
export const pop = (el) => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); };
