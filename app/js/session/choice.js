// L'ÉCRAN « CHOISIR » (lot 3, docs/SPEC-LOT3.md, section 2) : l'enfant choisit l'exercice, puis le niveau (ligne
// graduée : les 13 niveaux ; additions : les 13 familles (7 avant le lot « Sommes jusqu'à 30 ») ; calcul rapide et voiliers : 9 niveaux). (Lot « Les leçons » : les
// leçons n'y sont plus ; elles ont leur bulle à l'accueil, session/lessons.js.) Tout est accessible, même
// ce qui n'a jamais été atteint. Sans texte à lire : des pictogrammes et des vignettes de l'atelier
// (art/src/canvas-core/sea/choice.ts, planche « choix », chargée le temps du choix) ; (lot « Correctifs de la tablette ») toucher
// une image la sélectionne (bordure corail), la mascotte dit son nom et une courte description, écrits dans une bulle partie de
// l'image ; la toucher encore la lance (session/selection.js). Le niveau conseillé est entouré d'une lueur ; les niveaux
// déjà validés portent une petite étoile. À l'étape du niveau, la bulle de l'exercice (en haut) ramène au choix de
// l'exercice ; la maison (main.js) ramène à l'accueil.
// Renvoie { module: 1, niveau } | { module: 2, famille } | { module: 3 ou 4, niveau } (| null : quitté sans valider, `app.choiceCancel`). Fonctions pures (`levelItems`) testées par
// tests/unit/choix.test.mjs.
import * as R from "../art/runtime.js";
import { onBrief, pop, spriteBox } from "../engine/ui.js";
import { closeLegend, legendKey } from "./legend.js";
import { deuxTouchers } from "./selection.js";
import { currentFamily, initialFamilies, ruleShare } from "../modules/facts/families.js";
import { initialCalcState, recommended } from "../modules/calc/runner.js";
import { initialMultState, recommendedMult } from "../modules/mult/runner.js";

// (lot 3 bis, B1 : plaques de 150 × 136 numérotées, en 4 colonnes de x 496 à 1084, entre les bras de la pieuvre et les
// algues de droite ; le calcul rapide : ses neuf plaques sur le chemin de cailloux, CALC_AT = le centre de la plaque 1)
export const TILE = { w: 150, h: 136, r: 22, pitchX: 196, pitchY: 152, cx: 790, top: 246, cols: 4 }, EX_Y = 470, CHECK = [850, 712], BACK = [420, 108];
export const CALC_AT = [573, 250], GLOW = { w: 214, h: 200 };
// les exercices proposés, dans l'ordre
// (lot « Correctifs : passage de l'échauffement aux voiliers », point 8 : `graine`, celle de la bulle de l'exercice dans l'atelier,
// drawAnswerBubble(g, cx, cy, i, 70) : graine 300 + i ; l'entourage de sélection reprend sa forme : tests/unit/passages.test.mjs)
export const EXERCISES = [
  { id: "ligne", sprite: "choix.ex.ligne", module: 1, graine: 325 },
  { id: "additions", sprite: "libre.faits", module: 2, graine: 322 },
  { id: "calcul", sprite: "choix.ex.calcul", module: 3, graine: 327 },
  { id: "voiliers", sprite: "choix.ex.voiliers", module: 4, graine: 328 },
  { id: "multiplication", sprite: "choix.ex.multiplication", module: 5, graine: 328 },
  { id: "etal", sprite: "choix.ex.etal", module: 6, graine: 328 },
];
// la bulle d'un exercice (rayon 70 dans l'atelier, son trait compris : 75) ; l'entourage passe à 6 px de son bord
export const EX_BULLE_R = 70, EX_ENTOURAGE_R = 81;
// (lot « Les voiliers » : les exercices sur une rangée, entre la tête de la mascotte et le bord droit ; lot « Multiplication » :
// cinq exercices, l'écart resserré de 190 à 172 px)
// (lot « L'étal du pêcheur » : six exercices, de x 350 à 1180 : entre la tête de la mascotte et le bord droit)
export const EX_PITCH = 166, EX_CX = 765;

// les vignettes de l'étape « niveau » d'un exercice : { key, sprite, conseille, valide }
// st1 : l'état du module 1 (magasin « niveaux », clé 1) ; st2 : celui du module 2 ; module1, module2 : le contenu
// (lot 3, étape 4 : st3, module3 : le calcul rapide, ses 9 niveaux ; conseillé : `recommended`, validés : les acquis)
// (lot « Les voiliers » : st4, module4 : ses 9 niveaux ; conseillé : le niveau atteint, validés : ceux d'avant)
// (lot « Multiplication » : st5, module5 : ses 9 niveaux ; conseillé : `recommendedMult`, validés : les acquis)
// (lot « L'étal du pêcheur » : st6, module6 : ses 10 niveaux ; conseillé : le niveau atteint, validés : ceux d'avant)
export function levelItems(ex, { st1 = null, st2 = null, st3 = null, st4 = null, st5 = null, st6 = null, module1, module2, module3 = null, module4 = null, module5 = null, module6 = null, familyShare = () => 0 }) {
  if (ex === "etal") {
    const n = module6.niveaux.length, cur = Math.min(n, st6?.niveau ?? 1);
    return module6.niveaux.map((c) => ({ key: c.niveau, sprite: `choix.etal.${c.niveau}`, conseille: c.niveau === cur, valide: c.niveau < cur }));
  }
  if (ex === "multiplication") {
    const st = st5 ?? initialMultState(), cur = recommendedMult(module5, st);
    return module5.niveaux.map((c) => ({ key: c.niveau, sprite: `choix.multiplication.${c.niveau}`, conseille: c.niveau === cur, valide: (st.acquis ?? []).includes(c.niveau) }));
  }
  if (ex === "voiliers") {
    const n = module4.niveaux.length, cur = Math.min(n, st4?.niveau ?? 1);
    return module4.niveaux.map((c) => ({ key: c.niveau, sprite: `choix.voiliers.${c.niveau}`, conseille: c.niveau === cur, valide: c.niveau < cur }));
  }
  if (ex === "calcul") {
    const st = st3 ?? initialCalcState(), cur = recommended(module3, st, { familyShare });
    return module3.niveaux.map((c) => ({ key: c.niveau, sprite: `choix.calcul.${c.niveau}`, conseille: c.niveau === cur, valide: (st.acquis ?? []).includes(c.niveau) }));
  }
  if (ex === "ligne") {
    const n = module1.niveaux.length, cur = Math.min(n, st1?.niveau ?? 1);
    return module1.niveaux.map((c) => ({ key: c.niveau, sprite: `choix.ligne.${c.niveau}`, conseille: c.niveau === cur, valide: c.niveau < cur }));
  }
  const st = st2 ?? initialFamilies(module2), cur = currentFamily(module2, st);
  return module2.familles.map((f) => ({ key: f.id, sprite: `choix.famille.${f.id}`, conseille: f.id === cur, valide: (st.acquises ?? []).includes(f.id) }));
}
// où va la vignette i sur n : rangées de `cols`, centrées ; le calcul rapide : sur le chemin de cailloux (R.CALC_STOPS)
export function tilePos(i, n, T = TILE, ex = null, stops = null) {
  if (ex === "calcul" && stops?.[i]) return [CALC_AT[0] + stops[i][0], CALC_AT[1] + stops[i][1]];
  const rows = Math.ceil(n / T.cols), r = Math.floor(i / T.cols), inRow = Math.min(T.cols, n - r * T.cols), c = i - r * T.cols;
  return [T.cx + (c - (inRow - 1) / 2) * T.pitchX, T.top + r * T.pitchY + (rows < 3 ? T.pitchY / 2 : 0)];
}

// l'écran : o = { stars (false : entraînement libre), content: { module1, module2, seance }, store }
export async function choose(app, o) {
  const { sprites, voice, text } = app, store = o.store;
  await sprites.load("choix");
  const [st1, st2, st3, st4, st5, st6, faits] = await Promise.all([store.get("niveaux", 1), store.get("niveaux", 2), store.get("niveaux", 3), store.get("niveaux", 4), store.get("niveaux", 5), store.get("niveaux", 6), store.all("faits")]);
  const familyShare = (id, boite) => ruleShare(o.content.module2, faits, id, boite);
  const els = [], clear = () => { closeLegend(app); els.forEach((e) => e.remove()); els.length = 0; app.bulle?.ancrer(null); };
  app.choiceClear = () => { clear(); sprites.unload("choix"); };
  // (lot 3, étape 5) quitter sans rien valider (la maison, depuis l'accueil en pause) : `app.choiceCancel()`, choose renvoie null
  const CANCEL = Symbol("annulé"), cancelled = new Promise((res) => { app.choiceCancel = () => res(CANCEL); });
  const done = () => { clear(); sprites.unload("choix"); app.choiceClear = null; app.choiceCancel = null; voice.stop(); return null; };
  // (lot « Correctifs de la tablette ») CHOISIR EN DEUX TOUCHERS (session/selection.js) : le premier toucher sélectionne
  // l'image (bordure corail) et la mascotte dit son nom et une courte description, écrits dans une bulle qui part d'un coin
  // de l'image ; le second toucher sur la même image la lance. (Avant : un toucher disait le nom et lançait, décision du
  // 28 septembre ; le mode « double » d'avant, avec une coche, n'existe plus.)
  // (sel.key : la clé de l'image sélectionnée, lue par les dessins)
  const sel = { key: null };
  // (lot 3 bis, B3 : les pictogrammes des exercices ; lot 3 ter, T3 : toutes les tuiles et le retour : un toucher bref agit au
  // lever du doigt, un appui long montre l'étiquette et ne lance rien ; `label(clé)` : le texte de l'étiquette)
  const pick = (buttons, name) => { sel.key = null; return deuxTouchers(app, { tuiles: buttons, texte: name, peindre: (k) => { sel.key = k; } }); };
  const D = text.data.choixDescription ?? {}, dire = (nom, desc) => [nom, desc].filter(Boolean).join(" ");
  for (;;) {
    // 1. l'exercice
    const xs = EXERCISES, exBtn = xs.map((e, i) => {
      const b = spriteBox(app, { x: EX_CX + (i - (xs.length - 1) / 2) * EX_PITCH - 90, y: EX_Y - 90, w: 180, h: 180, cls: "bubble choix-ex", label: e.id, paint: (ctx, px) => { sprites.draw(ctx, e.sprite, 0, 90, 90); if (sel.key === e.id) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawSelectRound(ctx, 90, 90, EX_ENTOURAGE_R, e.graine); } } });
      b.dataset.key = e.id; els.push(b); return b;
    });
    voice.stop(); voice.say(text.data.choixExercice, { instruction: true });
    const ex = await Promise.race([pick(exBtn, (k) => dire(text.data.choixNom[k], D.exercices?.[k])), cancelled]);
    if (ex === CANCEL) return done();
    clear();
    // 2. le niveau, la famille ou la leçon
    const exo = xs.find((e) => e.id === ex), items = levelItems(ex, { st1, st2, st3, st4, st5, st6, module1: o.content.module1, module2: o.content.module2, module3: o.content.module3, module4: o.content.module4, module5: o.content.module5, module6: o.content.module6, familyShare });
    const back = spriteBox(app, { x: BACK[0] - 60, y: BACK[1] - 60, w: 120, h: 120, cls: "bubble choix-retour", label: "retour", paint: (ctx, px) => { const q = sprites.frame(exo.sprite, 0), k = 120 / 180; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 60 * px + q.dx * k, 60 * px + q.dy * k, q.w * k, q.h * k); } });
    els.push(back);
    // (lot 3 bis, B1) le chemin de cailloux du calcul rapide, dessiné en direct une fois par ouverture, sous les plaques
    if (ex === "calcul") { const P = R.CALC_PATH_BOX, w = P.x1 - P.x0, h = P.y1 - P.y0; els.push(spriteBox(app, { x: CALC_AT[0] + P.x0, y: CALC_AT[1] + P.y0, w, h, cls: "hud choix-chemin", still: true, paint: (ctx, px) => { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawStonePath(ctx, -P.x0, -P.y0); } })); }
    const tiles = items.map((it, i) => {
      const [x, y] = tilePos(i, items.length, TILE, ex, R.CALC_STOPS), W = TILE.w, H = TILE.h;
      // la lueur du conseillé : épaisse, et qui respire doucement (animation CSS, sur le compositeur)
      if (it.conseille) els.push(spriteBox(app, { x: x - GLOW.w / 2, y: y - GLOW.h / 2, w: GLOW.w, h: GLOW.h, cls: "hud choix-lueur", still: true, paint: (ctx) => sprites.draw(ctx, "choix.lueur", 0, GLOW.w / 2, GLOW.h / 2) }));
      const b = spriteBox(app, { x: x - W / 2, y: y - H / 2, w: W, h: H, cls: "bubble choix-tuile", label: `${ex} ${it.key}`, paint: (ctx, px) => {
        sprites.draw(ctx, it.sprite, 0, W / 2, H / 2);
        ctx.setTransform(px, 0, 0, px, 0, 0);
        if (sel.key === String(it.key)) R.drawSelectTile(ctx, W / 2, H / 2, W, H, TILE.r); // (point 8 : la forme de la tuile)
        if (it.valide) { ctx.setTransform(1, 0, 0, 1, 0, 0); const q = sprites.frame("etoile.doree", 0), k = 0.42; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (W - 24) * px + q.dx * k, 24 * px + q.dy * k, q.w * k, q.h * k); }
      } });
      b.dataset.key = String(it.key); b.dataset.conseille = it.conseille ? "1" : ""; b.dataset.valide = it.valide ? "1" : ""; els.push(b); return b;
    });
    // (lot 3 bis, B2) la légende des niveaux, pour le parent : ne choisit rien, ne lance rien
    legendKey(app, ex, { keys: items.map((it) => it.key), els });
    voice.stop();
    voice.say(text.data.choixNiveau, { instruction: true });
    const name = (k) => dire(ex === "ligne" ? text.data.choixLigne[k] : ex === "additions" ? text.data.choixFamille[k] : ex === "calcul" ? text.data.choixCalcul[k] : ex === "multiplication" ? text.data.choixMult[k] : ex === "etal" ? text.data.choixEtal[k] : text.data.choixVoiliers[k], D[ex]?.[k]);
    const backP = new Promise((res) => onBrief(app, back, () => { pop(back); res(null); }, "retourExercices"));
    const key = await Promise.race([pick(tiles, name), backP, cancelled]);
    if (key === CANCEL) return done();
    clear();
    if (key === null) continue;
    voice.stop();
    sprites.unload("choix"); app.choiceClear = null; app.choiceCancel = null;
    if (ex === "ligne") return { module: 1, niveau: Number(key) };
    if (ex === "additions") return { module: 2, famille: Number(key) };
    if (ex === "calcul") return { module: 3, niveau: Number(key) };
    if (ex === "multiplication") return { module: 5, niveau: Number(key) };
    if (ex === "etal") return { module: 6, niveau: Number(key) };
    return { module: 4, niveau: Number(key) };
  }
}
