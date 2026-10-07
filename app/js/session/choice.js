// L'ÉCRAN « CHOISIR » (lot 3, docs/SPEC-LOT3.md, section 2) : l'enfant choisit l'exercice, puis le niveau (ligne
// graduée : les 13 niveaux ; additions : les 13 familles (7 avant le lot « Sommes jusqu'à 30 ») ; calcul rapide et voiliers : 9 niveaux). (Lot « Les leçons » : les
// leçons n'y sont plus ; elles ont leur bulle à l'accueil, session/lessons.js.) Tout est accessible, même
// ce qui n'a jamais été atteint. Sans texte à lire : des pictogrammes et des vignettes de l'atelier
// (art/src/canvas-core/sea/choice.ts, planche « choix », chargée le temps du choix) ; toucher une image dit son nom et
// l'entoure d'or ; la toucher encore, ou toucher la coche, la valide (content/seance.json, choix.validation :
// « double », ou « simple » : le premier toucher valide). Le niveau conseillé est entouré d'une lueur ; les niveaux
// déjà validés portent une petite étoile. À l'étape du niveau, la bulle de l'exercice (en haut) ramène au choix de
// l'exercice ; la maison (main.js) ramène à l'accueil.
// Renvoie { module: 1, niveau } | { module: 2, famille } | { module: 3 ou 4, niveau } (| null : quitté sans valider, `app.choiceCancel`). Fonctions pures (`levelItems`) testées par
// tests/unit/choix.test.mjs.
import * as R from "../art/runtime.js";
import { onBrief, pop, spriteBox } from "../engine/ui.js";
import { closeLegend, legendKey } from "./legend.js";
import { currentFamily, initialFamilies, ruleShare } from "../modules/facts/families.js";
import { initialCalcState, recommended } from "../modules/calc/runner.js";

// (lot 3 bis, B1 : plaques de 150 × 136 numérotées, en 4 colonnes de x 496 à 1084, entre les bras de la pieuvre et les
// algues de droite ; le calcul rapide : ses neuf plaques sur le chemin de cailloux, CALC_AT = le centre de la plaque 1)
export const TILE = { w: 150, h: 136, pitchX: 196, pitchY: 152, cx: 790, top: 246, cols: 4 }, EX_Y = 470, CHECK = [850, 712], BACK = [420, 108];
export const CALC_AT = [573, 250], GLOW = { w: 214, h: 200 };
// les exercices proposés, dans l'ordre
export const EXERCISES = [
  { id: "ligne", sprite: "choix.ex.ligne", module: 1 },
  { id: "additions", sprite: "libre.faits", module: 2 },
  { id: "calcul", sprite: "choix.ex.calcul", module: 3 },
  { id: "voiliers", sprite: "choix.ex.voiliers", module: 4 },
];
// (lot « Les voiliers » : les exercices sur une rangée, entre la tête de la mascotte et le bord droit)
export const EX_PITCH = 190, EX_CX = 780;

// les vignettes de l'étape « niveau » d'un exercice : { key, sprite, conseille, valide }
// st1 : l'état du module 1 (magasin « niveaux », clé 1) ; st2 : celui du module 2 ; module1, module2 : le contenu
// (lot 3, étape 4 : st3, module3 : le calcul rapide, ses 9 niveaux ; conseillé : `recommended`, validés : les acquis)
// (lot « Les voiliers » : st4, module4 : ses 9 niveaux ; conseillé : le niveau atteint, validés : ceux d'avant)
export function levelItems(ex, { st1 = null, st2 = null, st3 = null, st4 = null, module1, module2, module3 = null, module4 = null, familyShare = () => 0 }) {
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
// (lot 3 ter, T3) l'étiquette d'une tuile de niveau ou de famille : sa ligne de la légende (legendes.json),
// « 7 · Ajouter en passant la dizaine, on complète d'abord jusqu'à 10 », sans le point final
export function tileLabel(legendes, ex, k) {
  const row = (legendes?.[ex] ?? []).find((r) => String(r.n) === String(k));
  return row ? `${k} · ${row.travail.replace(/\.$/, "")}` : null;
}
// où va la vignette i sur n : rangées de `cols`, centrées ; le calcul rapide : sur le chemin de cailloux (R.CALC_STOPS)
export function tilePos(i, n, T = TILE, ex = null, stops = null) {
  if (ex === "calcul" && stops?.[i]) return [CALC_AT[0] + stops[i][0], CALC_AT[1] + stops[i][1]];
  const rows = Math.ceil(n / T.cols), r = Math.floor(i / T.cols), inRow = Math.min(T.cols, n - r * T.cols), c = i - r * T.cols;
  return [T.cx + (c - (inRow - 1) / 2) * T.pitchX, T.top + r * T.pitchY + (rows < 3 ? T.pitchY / 2 : 0)];
}

// l'écran : o = { stars (false : entraînement libre), content: { module1, module2, seance }, store }
export async function choose(app, o) {
  const { sprites, voice, text } = app, store = o.store, C = o.content.seance.choix ?? {}, double = (C.validation ?? "double") === "double";
  await sprites.load("choix");
  const [st1, st2, st3, st4, faits] = await Promise.all([store.get("niveaux", 1), store.get("niveaux", 2), store.get("niveaux", 3), store.get("niveaux", 4), store.all("faits")]);
  const familyShare = (id, boite) => ruleShare(o.content.module2, faits, id, boite);
  const els = [], clear = () => { closeLegend(app); els.forEach((e) => e.remove()); els.length = 0; };
  app.choiceClear = () => { clear(); sprites.unload("choix"); };
  // (lot 3, étape 5) quitter sans rien valider (la maison, depuis l'accueil en pause) : `app.choiceCancel()`, choose renvoie null
  const CANCEL = Symbol("annulé"), cancelled = new Promise((res) => { app.choiceCancel = () => res(CANCEL); });
  const done = () => { clear(); sprites.unload("choix"); app.choiceClear = null; app.choiceCancel = null; voice.stop(); return null; };
  // une étape : des boutons (b.dataset.key), le premier toucher les nomme, le second (ou la coche) valide (« double ») ;
  // « simple » : le premier toucher nomme et valide
  // (sel.key : la clé de l'image entourée, lue par les dessins)
  const sel = { key: null };
  // (lot 3 bis, B3 : les pictogrammes des exercices ; lot 3 ter, T3 : toutes les tuiles, la coche et le retour : un toucher
  // bref valide au lever du doigt, un appui long montre l'étiquette et ne lance rien ; `label(clé)` : le texte de l'étiquette)
  const pick = (buttons, name, check, label = (k) => k) => new Promise((res) => {
    let cur = null; sel.key = null;
    const select = (b) => {
      if (cur === b && double) return res(b.dataset.key);
      const prev = cur; cur = b; sel.key = b.dataset.key;
      if (prev) { prev.classList.remove("chosen"); prev.repaint(); }
      b.classList.add("chosen"); b.repaint(); pop(b); voice.stop(); voice.say(name(b.dataset.key));
      // « simple » (décision du parent du 28 septembre) : le toucher valide ; l'image reste entourée un instant et son nom
      // est dit jusqu'au bout (la consigne suivante attend dans la file de la voix)
      if (!double) setTimeout(() => res(b.dataset.key), 300);
      else if (check) check.style.visibility = "visible";
    };
    buttons.forEach((b) => onBrief(app, b, () => select(b), () => label(b.dataset.key)));
    if (check) onBrief(app, check, () => { if (cur) { pop(check); res(cur.dataset.key); } }, "validerChoix");
  });
  const checkKey = () => { const c = spriteBox(app, { x: CHECK[0] - 80, y: CHECK[1] - 80, w: 160, h: 160, cls: "bubble check choix-ok", label: "valider", paint: (ctx) => sprites.draw(ctx, "valider", 0, 80, 80) }); c.style.visibility = "hidden"; els.push(c); return c; };
  for (;;) {
    // 1. l'exercice
    const xs = EXERCISES, exBtn = xs.map((e, i) => {
      const b = spriteBox(app, { x: EX_CX + (i - (xs.length - 1) / 2) * EX_PITCH - 90, y: EX_Y - 90, w: 180, h: 180, cls: "bubble choix-ex", label: e.id, paint: (ctx, px) => { sprites.draw(ctx, e.sprite, 0, 90, 90); if (sel.key === e.id) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawRing(ctx, 90, 90, 80); } } });
      b.dataset.key = e.id; els.push(b); return b;
    });
    voice.stop(); voice.say(text.data.choixExercice, { instruction: true });
    const ex = await Promise.race([pick(exBtn, (k) => text.data.choixNom[k], checkKey(), (k) => app.legendes?.etiquettes?.[k]), cancelled]);
    if (ex === CANCEL) return done();
    clear();
    // 2. le niveau, la famille ou la leçon
    const exo = xs.find((e) => e.id === ex), items = levelItems(ex, { st1, st2, st3, st4, module1: o.content.module1, module2: o.content.module2, module3: o.content.module3, module4: o.content.module4, familyShare });
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
        if (sel.key === String(it.key)) R.drawTileRing(ctx, W / 2, H / 2, W - 12, H - 12);
        if (it.valide) { ctx.setTransform(1, 0, 0, 1, 0, 0); const q = sprites.frame("etoile.doree", 0), k = 0.42; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (W - 24) * px + q.dx * k, 24 * px + q.dy * k, q.w * k, q.h * k); }
      } });
      b.dataset.key = String(it.key); b.dataset.conseille = it.conseille ? "1" : ""; b.dataset.valide = it.valide ? "1" : ""; els.push(b); return b;
    });
    // (lot 3 bis, B2) la légende des niveaux, pour le parent : ne choisit rien, ne lance rien
    legendKey(app, ex, { keys: items.map((it) => it.key), els });
    if (double) voice.stop();
    voice.say(text.data.choixNiveau, { instruction: true });
    const name = (k) => (ex === "ligne" ? text.data.choixLigne[k] : ex === "additions" ? text.data.choixFamille[k] : ex === "calcul" ? text.data.choixCalcul[k] : text.data.choixVoiliers[k]);
    const backP = new Promise((res) => onBrief(app, back, () => { pop(back); res(null); }, "retourExercices"));
    const key = await Promise.race([pick(tiles, name, checkKey(), (k) => tileLabel(app.legendes, ex, k)), backP, cancelled]);
    if (key === CANCEL) return done();
    clear();
    if (key === null) continue;
    if (double) voice.stop();
    sprites.unload("choix"); app.choiceClear = null; app.choiceCancel = null;
    if (ex === "ligne") return { module: 1, niveau: Number(key) };
    if (ex === "additions") return { module: 2, famille: Number(key) };
    if (ex === "calcul") return { module: 3, niveau: Number(key) };
    return { module: 4, niveau: Number(key) };
  }
}
