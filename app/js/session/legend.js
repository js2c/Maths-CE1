// LA LÉGENDE DES NIVEAUX (lot 3 bis, docs/SPEC-LOT3BIS.md, B2 ; décision du parent). Sur les écrans de niveaux de
// « choisir » (ligne graduée, additions, calcul rapide, voiliers) et sur l'écran des leçons, un bouton discret (un petit livre
// ouvert, sprite « legende »), en haut à droite sous « réécouter », hors de la zone des plaques. Il ouvre un panneau par-
// dessus l'écran (plaque de nacre dessinée en direct, runtime.js, drawPanel) : une ligne par niveau, sa vignette (la même
// que la plaque), ce qui est travaillé et un exemple, écrits au feutre ; le tableau défile si nécessaire. La croix, ou
// un toucher en dehors du panneau, le ferme. Ouvrir ou fermer ne choisit rien, ne lance rien, et la voix ne lit rien :
// la légende est pour le parent. Texte : content/legendes.json (repris par l'espace parent et le guide du parent).
import * as R from "../art/runtime.js";
import { onBrief, pop, spriteBox } from "../engine/ui.js";

export const LEGEND_AT = [1218, 214], PANEL = { x: 130, y: 44, w: 1020, h: 730 };
const COL = { vign: 70, travail: 160, exemple: 670, fin: 925 }, EM = 23, EX_EM = 23, ROW_PAD = 16;

// la vignette d'un niveau, comme sur sa plaque de « choisir »
export const legendSprite = (ex, n) => (ex === "ligne" ? `choix.ligne.${n}` : ex === "additions" ? `choix.famille.${n}` : ex === "calcul" ? `choix.calcul.${n}` : ex === "voiliers" ? `choix.voiliers.${n}` : "choix.lecon");
// les lignes du tableau d'un exercice, dans l'ordre des plaques (`keys`) : { n, travail: [lignes], exemple: [lignes] }
export function legendRows(legendes, ex, keys = null) {
  const rows = legendes?.[ex] ?? [], by = new Map(rows.map((r) => [String(r.n), r]));
  return (keys ? keys.map((k) => by.get(String(k))).filter(Boolean) : rows).map((r) => ({ n: r.n, travail: R.wrapWords(r.travail, (COL.exemple - COL.travail - 30) / EM), exemple: R.wrapWords(r.exemple, (COL.fin - COL.exemple) / EX_EM) }));
}

// le bouton ; `labels` : les nombres écrits sur la vignette des leçons (choice.js, LESSON_LABELS)
export function legendKey(app, ex, { keys = null, labels = {}, els }) {
  const { sprites } = app, r = 40;
  const b = spriteBox(app, { x: LEGEND_AT[0] - r - 12, y: LEGEND_AT[1] - r - 12, w: 2 * r + 24, h: 2 * r + 24, cls: "bubble legende", label: "légende", paint: (ctx) => sprites.draw(ctx, "legende", 0, r + 12, r + 12) });
  els.push(b);
  onBrief(app, b, () => { pop(b); openLegend(app, ex, { keys, labels, els }); }, "legende");
  return b;
}

export function openLegend(app, ex, { keys = null, labels = {}, els = [] } = {}) {
  const { sprites, stage } = app, L = app.legendes, rows = legendRows(L, ex, keys);
  closeLegend(app);
  // le voile : tout l'écran ; un toucher dessus (hors du panneau) ferme
  const veil = document.createElement("div"); veil.className = "legende-voile";
  const panel = spriteBox(app, { x: PANEL.x, y: PANEL.y, w: PANEL.w, h: PANEL.h, cls: "hud legende-panneau", still: true, paint: (ctx, px) => { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawPanel(ctx, 14, 10, PANEL.w - 34, PANEL.h - 30); } });
  panel.style.pointerEvents = "auto";
  // l'en-tête (les titres des colonnes), fixe ; puis le tableau, qui défile
  const head = spriteBox(app, { x: PANEL.x + 30, y: PANEL.y + 28, w: PANEL.w - 150, h: 52, cls: "hud legende-tete", still: true, paint: (ctx, px) => {
    ctx.setTransform(px, 0, 0, px, 0, 0);
    R.drawWord(ctx, L.titres.travail, COL.travail + R.wordWidth(L.titres.travail) * 13, 12, 26, { color: "#1f6f78", w: 3, seed: 8800 });
    R.drawWord(ctx, L.titres.exemple, COL.exemple + R.wordWidth(L.titres.exemple) * 13, 12, 26, { color: "#1f6f78", w: 3, seed: 8810 });
  } });
  const scroll = document.createElement("div"); scroll.className = "legende-defile";
  Object.assign(scroll.style, { left: `${PANEL.x + 30}px`, top: `${PANEL.y + 86}px`, width: `${PANEL.w - 64}px`, height: `${PANEL.h - 126}px` });
  rows.forEach((row, i) => {
    const lines = Math.max(row.travail.length, row.exemple.length), h = Math.max(96, lines * EM * 1.55 + 2 * ROW_PAD), c = document.createElement("canvas");
    c.width = Math.round((PANEL.w - 64) * stage.px); c.height = Math.round(h * stage.px); c.style.width = `${PANEL.w - 64}px`; c.style.height = `${h}px`; c.className = "legende-ligne"; c.dataset.n = String(row.n);
    const ctx = c.getContext("2d");
    // la vignette, réduite (0,6), centrée dans sa colonne
    const q = sprites.frame(legendSprite(ex, row.n), 0), k = 0.6, cy = h / 2;
    ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (COL.vign * stage.px) + q.dx * k, cy * stage.px + q.dy * k, q.w * k, q.h * k);
    ctx.setTransform(stage.px, 0, 0, stage.px, 0, 0);
    if (ex === "lecons" && labels[row.n]) { const em = Math.min(20, 70 / R.wordWidth(labels[row.n])); R.drawWord(ctx, labels[row.n], COL.vign, cy + 4, em, { w: em * 0.15, seed: 8830 + i }); }
    const top = (n) => cy - (n * EM * 1.55 - EM * 0.55) / 2;
    row.travail.forEach((t, j) => R.drawWord(ctx, t, COL.travail + R.wordWidth(t) * EM / 2, top(row.travail.length) + j * EM * 1.55, EM, { w: EM * 0.12, seed: 8840 + i * 13 + j }));
    row.exemple.forEach((t, j) => R.drawWord(ctx, t, COL.exemple + R.wordWidth(t) * EX_EM / 2, top(row.exemple.length) + j * EX_EM * 1.55, EX_EM, { color: "#b0402f", w: EX_EM * 0.12, seed: 8870 + i * 13 + j }));
    // un filet entre deux lignes
    if (i < rows.length - 1) { ctx.strokeStyle = "rgba(160,140,110,0.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, h - 1); ctx.lineTo(PANEL.w - 90, h - 1); ctx.stroke(); }
    scroll.append(c);
  });
  const close = spriteBox(app, { x: PANEL.x + PANEL.w - 118, y: PANEL.y - 18, w: 124, h: 124, cls: "bubble legende-fermer", label: "fermer", paint: (ctx) => sprites.draw(ctx, "fermer", 0, 62, 62) });
  stage.ui.append(veil); stage.ui.append(panel); stage.ui.append(head); stage.ui.append(scroll); stage.ui.append(close);
  const all = [veil, panel, head, scroll, close];
  app.legendOpen = { els: all };
  els.push(...all);
  onBrief(app, close, () => closeLegend(app), "fermer");
  onBrief(app, veil, () => closeLegend(app)); // (lot 3 ter : un toucher dehors ferme aussi au lever du doigt, jamais un appui long)
  return app.legendOpen;
}
export function closeLegend(app) { app.legendOpen?.els.forEach((e) => e.remove()); app.legendOpen = null; }
