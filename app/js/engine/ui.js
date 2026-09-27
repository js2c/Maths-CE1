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
