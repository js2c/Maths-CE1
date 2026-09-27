// L'ÉCRAN « CHOISIR » (lot 3, docs/SPEC-LOT3.md, section 2) : l'enfant choisit l'exercice, puis le niveau (ligne
// graduée : les 13 niveaux ; additions : les 7 familles ; leçons : toutes, vues ou non). Tout est accessible, même
// ce qui n'a jamais été atteint. Sans texte à lire : des pictogrammes et des vignettes de l'atelier
// (art/src/canvas-core/sea/choice.ts, planche « choix », chargée le temps du choix) ; toucher une image dit son nom et
// l'entoure d'or ; la toucher encore, ou toucher la coche, la valide (content/seance.json, choix.validation :
// « double », ou « simple » : le premier toucher valide). Le niveau conseillé est entouré d'une lueur ; les niveaux
// déjà validés portent une petite étoile. À l'étape du niveau, la bulle de l'exercice (en haut) ramène au choix de
// l'exercice ; la maison (main.js) ramène à l'accueil.
// Renvoie { module: 1, niveau } | { module: 2, famille } | { lecon }. Fonctions pures (`levelItems`) testées par
// tests/unit/choix.test.mjs.
import * as R from "../art/runtime.js";
import { onTap, pop, spriteBox } from "../engine/ui.js";
import { currentFamily, initialFamilies, ruleShare } from "../modules/facts/families.js";
import { initialCalcState, recommended } from "../modules/calc/runner.js";

export const TILE = { w: 170, h: 140, pitchX: 170, pitchY: 146, cx: 850, top: 262, cols: 5 }, EX_Y = 470, CHECK = [850, 712], BACK = [420, 120];
// les exercices proposés, dans l'ordre
export const EXERCISES = [
  { id: "ligne", sprite: "choix.ex.ligne", module: 1 },
  { id: "additions", sprite: "libre.faits", module: 2 },
  { id: "calcul", sprite: "choix.ex.calcul", module: 3 },
  { id: "lecons", sprite: "choix.ex.lecons" },
];
// les nombres que la tortue écrit dans chaque leçon (repris de l'entraînement libre)
export const LESSON_LABELS = { L1: "1 2 3", L2: "10 20", L3: "30 31", L4: "3+3", L5: "7+3", L6: "5+2", L10: "100", L7: "34+10", L8: "+9", L9: "38+5" };

// les vignettes de l'étape « niveau » d'un exercice : { key, sprite, conseille, valide, label? }
// st1 : l'état du module 1 (magasin « niveaux », clé 1) ; st2 : celui du module 2 ; module1, module2 : le contenu ;
// lecons : les leçons proposées (seance.json, choix.lecons)
// (lot 3, étape 4 : st3, module3 : le calcul rapide, ses 9 niveaux ; conseillé : `recommended`, validés : les acquis)
export function levelItems(ex, { st1 = null, st2 = null, st3 = null, module1, module2, module3 = null, lecons = [], familyShare = () => 0 }) {
  if (ex === "calcul") {
    const st = st3 ?? initialCalcState(), cur = recommended(module3, st, { familyShare });
    return module3.niveaux.map((c) => ({ key: c.niveau, sprite: `choix.calcul.${c.niveau}`, conseille: c.niveau === cur, valide: (st.acquis ?? []).includes(c.niveau) }));
  }
  if (ex === "ligne") {
    const n = module1.niveaux.length, cur = Math.min(n, st1?.niveau ?? 1);
    return module1.niveaux.map((c) => ({ key: c.niveau, sprite: `choix.ligne.${c.niveau}`, conseille: c.niveau === cur, valide: c.niveau < cur }));
  }
  if (ex === "additions") {
    const st = st2 ?? initialFamilies(module2), cur = currentFamily(module2, st);
    return module2.familles.map((f) => ({ key: f.id, sprite: `choix.famille.${f.id}`, conseille: f.id === cur, valide: (st.acquises ?? []).includes(f.id) }));
  }
  const seen = new Set([...(st1?.lecons ?? []), ...(st2?.lecons ?? []), ...(st3?.lecons ?? [])]);
  return lecons.map((id) => ({ key: id, sprite: "choix.lecon", conseille: false, valide: seen.has(id), label: LESSON_LABELS[id] ?? id }));
}
// où va la vignette i sur n : rangées de `cols`, centrées
export function tilePos(i, n, T = TILE) {
  const rows = Math.ceil(n / T.cols), r = Math.floor(i / T.cols), inRow = Math.min(T.cols, n - r * T.cols), c = i - r * T.cols;
  return [T.cx + (c - (inRow - 1) / 2) * T.pitchX, T.top + r * T.pitchY + (rows < 3 ? T.pitchY / 2 : 0)];
}

// l'écran : o = { stars (false : entraînement libre), content: { module1, module2, seance }, store }
export async function choose(app, o) {
  const { sprites, voice, text } = app, store = o.store, C = o.content.seance.choix ?? {}, double = (C.validation ?? "double") === "double";
  await sprites.load("choix");
  const [st1, st2, st3, faits] = await Promise.all([store.get("niveaux", 1), store.get("niveaux", 2), store.get("niveaux", 3), store.all("faits")]);
  const familyShare = (id, boite) => ruleShare(o.content.module2, faits, id, boite);
  const els = [], clear = () => { els.forEach((e) => e.remove()); els.length = 0; };
  app.choiceClear = () => { clear(); sprites.unload("choix"); };
  // une étape : des boutons (b.dataset.key), le premier toucher les nomme, le second (ou la coche) valide
  // (sel.key : la clé de l'image entourée, lue par les dessins)
  const sel = { key: null };
  const pick = (buttons, name, check) => new Promise((res) => {
    let cur = null; sel.key = null;
    const select = (b) => {
      if (cur === b && double) return res(b.dataset.key);
      const prev = cur; cur = b; sel.key = b.dataset.key;
      if (prev) { prev.classList.remove("chosen"); prev.repaint(); }
      b.classList.add("chosen"); b.repaint(); pop(b); voice.stop(); voice.say(name(b.dataset.key));
      if (!double) res(b.dataset.key);
      else if (check) check.style.visibility = "visible";
    };
    buttons.forEach((b) => onTap(b, () => select(b)));
    if (check) onTap(check, () => { if (cur) { pop(check); res(cur.dataset.key); } });
  });
  const checkKey = () => { const c = spriteBox(app, { x: CHECK[0] - 80, y: CHECK[1] - 80, w: 160, h: 160, cls: "bubble check choix-ok", label: "valider", paint: (ctx) => sprites.draw(ctx, "valider", 0, 80, 80) }); c.style.visibility = "hidden"; els.push(c); return c; };
  for (;;) {
    // 1. l'exercice
    const xs = EXERCISES, exBtn = xs.map((e, i) => {
      const b = spriteBox(app, { x: TILE.cx + (i - (xs.length - 1) / 2) * 205 - 90, y: EX_Y - 90, w: 180, h: 180, cls: "bubble choix-ex", label: e.id, paint: (ctx, px) => { sprites.draw(ctx, e.sprite, 0, 90, 90); if (sel.key === e.id) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawRing(ctx, 90, 90, 80); } } });
      b.dataset.key = e.id; els.push(b); return b;
    });
    voice.stop(); voice.say(text.data.choixExercice, { instruction: true });
    const ex = await pick(exBtn, (k) => text.data.choixNom[k], checkKey());
    clear();
    // 2. le niveau, la famille ou la leçon
    const exo = xs.find((e) => e.id === ex), items = levelItems(ex, { st1, st2, st3, module1: o.content.module1, module2: o.content.module2, module3: o.content.module3, lecons: C.lecons ?? [], familyShare });
    const back = spriteBox(app, { x: BACK[0] - 60, y: BACK[1] - 60, w: 120, h: 120, cls: "bubble choix-retour", label: "retour", paint: (ctx, px) => { const q = sprites.frame(exo.sprite, 0), k = 120 / 180; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, 60 * px + q.dx * k, 60 * px + q.dy * k, q.w * k, q.h * k); } });
    els.push(back);
    const tiles = items.map((it, i) => {
      const [x, y] = tilePos(i, items.length), W = TILE.w, H = TILE.h;
      if (it.conseille) els.push(spriteBox(app, { x: x - 105, y: y - 90, w: 210, h: 180, cls: "hud choix-lueur", still: true, paint: (ctx) => sprites.draw(ctx, "choix.lueur", 0, 105, 90) }));
      const b = spriteBox(app, { x: x - W / 2, y: y - H / 2, w: W, h: H, cls: "bubble choix-tuile", label: `${ex} ${it.key}`, paint: (ctx, px) => {
        sprites.draw(ctx, it.sprite, 0, W / 2, H / 2);
        ctx.setTransform(px, 0, 0, px, 0, 0);
        if (it.label) { const em = Math.min(30, 118 / R.wordWidth(it.label)); R.drawWord(ctx, it.label, W / 2, H / 2 + 8, em, { w: em * 0.15, seed: 860 + i }); }
        if (sel.key === String(it.key)) R.drawTileRing(ctx, W / 2, H / 2, 154, 124);
        if (it.valide) { ctx.setTransform(1, 0, 0, 1, 0, 0); const q = sprites.frame("etoile.doree", 0), k = 0.42; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (W - 22) * px + q.dx * k, 20 * px + q.dy * k, q.w * k, q.h * k); }
      } });
      b.dataset.key = String(it.key); b.dataset.conseille = it.conseille ? "1" : ""; b.dataset.valide = it.valide ? "1" : ""; els.push(b); return b;
    });
    voice.stop(); voice.say(ex === "lecons" ? text.data.choixLecon : text.data.choixNiveau, { instruction: true });
    const name = (k) => (ex === "ligne" ? text.data.choixLigne[k] : ex === "additions" ? text.data.choixFamille[k] : ex === "calcul" ? text.data.choixCalcul[k] : text.data.choixLeconNom[k] ?? k);
    const backP = new Promise((res) => onTap(back, () => { pop(back); res(null); }));
    const key = await Promise.race([pick(tiles, name, checkKey()), backP]);
    clear();
    if (key === null) continue;
    voice.stop();
    sprites.unload("choix"); app.choiceClear = null;
    if (ex === "ligne") return { module: 1, niveau: Number(key) };
    if (ex === "additions") return { module: 2, famille: Number(key) };
    if (ex === "calcul") return { module: 3, niveau: Number(key) };
    return { lecon: key };
  }
}
