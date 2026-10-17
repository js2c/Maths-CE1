// « TOURNE TON TÉLÉPHONE » (lot « Banc Android et recette en conditions réelles », point 5 ; docs/LOTS.md, fiche 13).
// Installée, l'application est en paysage (manifest.webmanifest, « orientation »). Ouverte dans un onglet en portrait (un
// téléphone tenu droit, avant l'installation), la scène de 1 280 × 800 deviendrait minuscule : à la place, un écran clair
// couvre tout, sans texte, avec un dessin de l'atelier (art/src/canvas-core/sea/demarrage.ts : un téléphone et une flèche
// courbe, sur la planche du démarrage, chargée la première) ; le téléphone pivote d'un quart de tour, en boucle (une seule
// couche tournée, par le navigateur). Tourné en paysage, l'écran disparaît et l'application est là, telle qu'elle était.
// Le CSS décide seul quand il se montre (app.css, `@media (orientation: portrait)`) ; ce module pose les deux dessins, à la
// taille de l'écran, chaque fois qu'il devient visible.
import { Sprites } from "./sprites.js";

const FLECHE = "demarrage.tourner.fleche", TEL = "demarrage.tourner.telephone";
export function installerTourner(atlas) {
  const el = document.createElement("div"); el.id = "tourner"; el.setAttribute("role", "img"); el.setAttribute("aria-label", "Tourne le téléphone");
  const fleche = document.createElement("canvas"), tel = document.createElement("canvas"), pivot = document.createElement("div");
  const centre = document.createElement("div"); centre.className = "tourner-centre";
  fleche.className = "tourner-fleche"; pivot.className = "tourner-pivot"; tel.className = "tourner-tel";
  pivot.append(tel); centre.append(fleche, pivot); el.append(centre); document.body.append(el);
  const portrait = matchMedia("(orientation: portrait)");
  let fait = null;
  const peindre = async () => {
    if (!portrait.matches) return;
    const qF = atlas.sprites?.[FLECHE], qT = atlas.sprites?.[TEL]; if (!qF || !qT) return;
    // (la boîte logique : la flèche au-dessus, et le cercle que parcourt le téléphone en pivotant, autour de l'ancrage commun)
    const rect = (q) => { const [, , , w, h, dx, dy] = q.rects["1"][0]; return { w, h, dx, dy }; }, rF = rect(qF), rT = rect(qT);
    const rayon = Math.hypot(Math.max(-rT.dx, rT.w + rT.dx), Math.max(-rT.dy, rT.h + rT.dy));
    const haut = Math.max(-rF.dy, rayon), bas = rayon, large = 2 * Math.max(rayon, -rF.dx, rF.w + rF.dx);
    const s = Math.min((innerWidth * 0.86) / large, (innerHeight * 0.8) / (haut + bas)), dpr = devicePixelRatio || 1, cle = `${innerWidth}×${innerHeight}×${dpr}`;
    if (fait === cle) return; fait = cle;
    el.style.setProperty("--tourner-y", `${((haut - bas) / 2) * s}px`);
    const sp = new Sprites(atlas, s * dpr);
    await sp.load("demarrage").catch(() => {});
    const poser = (c, r, nom) => {
      c.width = Math.ceil(r.w * s * dpr) + 2; c.height = Math.ceil(r.h * s * dpr) + 2;
      Object.assign(c.style, { width: `${c.width / dpr}px`, height: `${c.height / dpr}px`, left: `${r.dx * s}px`, top: `${r.dy * s}px` });
      const ctx = c.getContext("2d"); ctx.clearRect(0, 0, c.width, c.height); sp.draw(ctx, nom, 0, -r.dx, -r.dy);
    };
    poser(fleche, rF, FLECHE); poser(tel, rT, TEL);
    sp.unload?.("demarrage");
  };
  portrait.addEventListener?.("change", peindre); addEventListener("resize", peindre);
  peindre();
  return el;
}
