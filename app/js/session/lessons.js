// LES LEÇONS (lot « Les leçons », octobre 2026 ; docs/SPEC.md, section 3, « Les leçons » ; maquette validée par le parent le
// 7 octobre 2026 : art/lecons/, docs/maquettes/lecons/). Trois écrans, ouverts par main.js :
//  - `lessonsMenu` : le menu de la bulle « les leçons ». Une rangée par exercice (seance.json, menuLecons.rangees), le
//    pictogramme plat de l'exercice à gauche (il ne réagit pas au toucher), puis une tuile par leçon : le numéro de la leçon
//    en grand et la vignette du moment clé (planche « lecons », chargée le temps du menu) ; une leçon déjà vue porte la
//    petite étoile. Dernière rangée : les tables à consulter (la table d'addition ; la table de multiplication viendra à sa
//    droite). Un toucher bref dit le nom et lance (comme « choisir ») ; un appui long montre l'étiquette ; le petit livre
//    ouvre la légende du parent. Renvoie { lecon } | { table } | null (quitté par la maison : `app.lessonsCancel`).
//  - `lessonEnd` : la fin d'une leçon du menu, regardée ou passée : la bulle « À toi ! » (la tuile du niveau associé dedans,
//    planche « lecons-atoi ») et la grande maison. Renvoie "atoi" ou "maison" ; rien ne se lance sans toucher.
//  - `additionTable` : la table d'addition (de 0 + 0 à max + max). La grille est dessinée une fois (runtime.js,
//    drawAddTable) ; une case touchée (au premier contact, comme le pavé) est allumée sur un calque posé par-dessus (`bare`),
//    son calcul s'écrit à droite avec l'appui de la famille (`tableAid`, les aides des additions : modules/facts/aids.js),
//    et la voix dit « 7 plus 5, 12. ». Pas d'étoiles. Se termine par la maison (`app.tableCancel`).
// Fonctions pures testées (tests/unit/lecons-menu.test.mjs) : `menuLayout`, `tableAid`, `tableHit`, `exerciseOf`.
import * as R from "../art/runtime.js";
import { onBrief, onTap, pop, spriteBox } from "../engine/ui.js";
import { MENTON } from "../engine/bulle.js";
import { closeLegend, legendKey } from "./legend.js";
import { paintDoublePlus, paintHouse, paintTenFrame, paintTwoFrames } from "../modules/facts/aids.js";
import { paintRows } from "../modules/mult/screen.js";

// ---------------------------------------------------------------- le menu
// la grille du menu (px de la scène) : 4 rangées, la colonne des pictogrammes puis 5 colonnes de tuiles, entre la bulle de
// la mascotte (sous sa tête, jusqu'à x 404) et le petit livre de la légende (1218, 214)
// (lot « Sommes jusqu'à 30 » : la rangée des additions a cinq leçons, L11 et L12 en plus ; les colonnes se resserrent, de
// 165 à 155 px, pour en tenir cinq ; la cinquième colonne n'a rien sur la rangée de la ligne, sous le petit livre)
export const MENU = { rowY: [205, 361, 517, 673], colX: [575, 730, 885, 1040, 1195], iconX: 452, tile: { w: 150, h: 136 }, icon: { w: 92, h: 90 } };
// les éléments du menu et leur place : { kind: "icone", ex } | { kind: "lecon", id } | { kind: "table", id }, avec x, y
export function menuLayout(menu, M = MENU) {
  const out = [];
  (menu.rangees ?? []).forEach((r, i) => {
    out.push({ kind: "icone", ex: r.exercice, x: M.iconX, y: M.rowY[i] });
    r.lecons.forEach((id, j) => out.push({ kind: "lecon", id, x: M.colX[j], y: M.rowY[i] }));
  });
  // (lot « Multiplication » : les tables peuvent partager la dernière rangée, à droite de ses leçons : `tablesPlace`, la
  // rangée et la première colonne ; sinon une rangée à elles, sous les autres)
  const P = menu.tablesPlace ?? { rangee: (menu.rangees ?? []).length, colonne: 0 };
  (menu.tables ?? []).forEach((id, j) => out.push({ kind: "table", id, x: M.colX[P.colonne + j], y: M.rowY[P.rangee] }));
  return out;
}
// le numéro d'une leçon (« L10 » : 10)
export const lessonNumber = (id) => Number(String(id).replace(/^L/, ""));
// l'exercice associé à une leçon (lecons.json, « exercice ») : ce que « À toi ! » lance, avec la leçon jouée
export const exerciseOf = (lecons, id) => { const e = lecons?.[id]?.exercice; return e ? { ...e, apresLecon: id } : null; };
const TABLE_SPRITE = { addition: "lecons.table.plus", multiplication: "lecons.table.fois" };
// la clé de légende et le signe de chaque table
export const TABLE_SIGNE = { addition: "+", multiplication: "×" };

// o = { store, seance, lecons } ; renvoie { lecon } | { table } | null
export async function lessonsMenu(app, o) {
  const { sprites, voice, text } = app, menu = o.seance.menuLecons ?? { rangees: [], tables: [] };
  await sprites.load("lecons");
  const sts = await Promise.all([1, 2, 3, 5].map((k) => o.store.get("niveaux", k)));
  const seen = new Set(sts.flatMap((st) => st?.lecons ?? []));
  const els = [], clear = () => { closeLegend(app); els.forEach((e) => e.remove()); els.length = 0; sprites.unload("lecons"); app.lessonsCancel = null; };
  let sel = null;
  const result = new Promise((res) => {
    app.lessonsCancel = () => res(null);
    const { w: W, h: H } = MENU.tile;
    for (const it of menuLayout(menu)) {
      if (it.kind === "icone") {
        const { w, h } = MENU.icon;
        els.push(spriteBox(app, { x: it.x - w / 2, y: it.y - h / 2, w, h, cls: "hud lecons-rangee", still: true, paint: (ctx) => sprites.draw(ctx, `lecons.rangee.${it.ex}`, 0, w / 2, h / 2) }));
        continue;
      }
      const key = it.kind === "lecon" ? it.id : `table.${it.id}`, sprite = it.kind === "lecon" ? `lecons.tuile.${it.id}` : TABLE_SPRITE[it.id];
      if (!sprite) continue;
      const valide = it.kind === "lecon" && seen.has(it.id);
      const b = spriteBox(app, { x: it.x - W / 2, y: it.y - H / 2, w: W, h: H, cls: "bubble lecons-tuile", label: key, paint: (ctx, px) => {
        sprites.draw(ctx, sprite, 0, W / 2, H / 2);
        if (sel === key) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawTileRing(ctx, W / 2, H / 2, W - 12, H - 12); ctx.setTransform(1, 0, 0, 1, 0, 0); }
        if (valide) { const q = sprites.frame("etoile.doree", 0), k = 0.42; ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (W - 24) * px + q.dx * k, 24 * px + q.dy * k, q.w * k, q.h * k); }
      } });
      b.dataset.key = key; if (valide) b.dataset.valide = "1"; els.push(b);
      const name = it.kind === "lecon" ? text.data.choixLeconNom?.[it.id] ?? it.id : it.id === "multiplication" ? text.data.choixTableMult : text.data.choixTable;
      // (comme « choisir », validation « simple » : le toucher dit le nom et lance ; le nom est dit jusqu'au bout)
      onBrief(app, b, () => {
        if (sel) return; sel = key; b.repaint(); pop(b); voice.stop(); voice.say(name);
        setTimeout(() => res(it.kind === "lecon" ? { lecon: it.id } : { table: it.id }), 300);
      }, () => tileLabel(app.legendes, it.kind === "lecon" ? it.id : TABLE_SIGNE[it.id]));
    }
    // la légende du parent (le petit livre) : une ligne par leçon, et une pour la table d'addition
    legendKey(app, "lecons", { keys: [...menu.rangees.flatMap((r) => r.lecons), ...menu.tables.map((t) => TABLE_SIGNE[t]).filter(Boolean)], els });
    voice.say(text.data.choixLecon, { instruction: true });
  });
  const r = await result;
  clear();
  return r;
}
// l'étiquette d'une tuile (appui long) : « 7 · Plus 10 sur le mur de corail, on descend d'une rangée », « + · La table… »
export function tileLabel(legendes, key) {
  const row = (legendes?.lecons ?? []).find((r) => r.n === key);
  return row ? `${key === "+" || key === "×" ? key : lessonNumber(key)} · ${row.travail.replace(/\.$/, "")}` : null;
}

// ---------------------------------------------------------------- la fin d'une leçon du menu
export const END = { atoi: [560, 480], maison: [815, 480] };
export async function lessonEnd(app, { id }) {
  const { sprites, voice, text } = app;
  await sprites.load("lecons-atoi");
  const els = [];
  const q = sprites.frame(`lecons.atoi.${id}`, 0), R2 = Math.ceil(Math.max(-q.dx, -q.dy) / sprites.px) + 12;
  const atoi = spriteBox(app, { x: END.atoi[0] - R2, y: END.atoi[1] - R2, w: 2 * R2, h: 2 * R2, cls: "bubble lecons-atoi", label: "à toi", paint: (ctx) => sprites.draw(ctx, `lecons.atoi.${id}`, 0, R2, R2) });
  const home = spriteBox(app, { x: END.maison[0] - 90, y: END.maison[1] - 90, w: 180, h: 180, cls: "bubble lecons-maison", label: "maison", paint: (ctx) => sprites.draw(ctx, "maison.grande", 0, 90, 90) });
  els.push(atoi, home);
  voice.stop(); voice.say(text.data.finLecon, { instruction: true });
  const r = await new Promise((res) => {
    app.lessonEndCancel = () => res("maison");
    onBrief(app, atoi, () => { pop(atoi); res("atoi"); }, "aToi");
    onBrief(app, home, () => { pop(home); res("maison"); }, "maison");
  });
  app.lessonEndCancel = null; els.forEach((e) => e.remove()); sprites.unload("lecons-atoi");
  return r;
}

// ---------------------------------------------------------------- la table d'addition
// la grille (px de la scène) : la case d'angle en (x, y), les en-têtes de `head`, les cases au pas de `pitch` (64 px : la
// zone tactile minimale) ; le panneau du calcul à droite ; la bulle de la mascotte sous sa tête, à gauche de la grille
export const TABLE = { x: 262, y: 26, pitch: 64, cell: 58, head: 52, pad: 16, panel: { x: 1040, y: 150, w: 230, h: 640 } };
export const TABLE_PLACES = [{ nom: "dessous-table", boite: [8, MENTON[1] + 30, 234, 792], pointe: MENTON, haut: true }];
// la case sous un point de la scène : [a, b] (a : la rangée, b : la colonne) ou null (en-têtes, bord)
// (lot « Multiplication » : `min`, la première valeur : 1 pour la table de multiplication)
export function tableHit(T, max, x, y, min = 0) {
  const b = Math.floor((x - T.x - T.head) / T.pitch) + min, a = Math.floor((y - T.y - T.head) / T.pitch) + min;
  return a >= min && b >= min && a <= max && b <= max ? [a, b] : null;
}
// l'appui montré pour a + b : celui des aides des additions (facts.js, aidFor : le cadre pour les amis de 10, le reflet
// pour les doubles jusqu'à 5, le double + 1 pour les presque-doubles jusqu'à 5, les sauts pour + 1 et + 2, sinon la
// maison) ; au-delà de 10, deux cadres de 10 (le passage de la dizaine), sauf + 1 et + 2 ; rien pour + 0
export const tableAid = (a, b) => {
  const lo = Math.min(a, b), hi = Math.max(a, b), n = a + b;
  if (lo === 0) return "rien";
  if (n === 10) return "cadre";
  // (lot « Sommes jusqu'à 30 » : au-delà de 10, toujours les deux boîtes, celles des familles 8, 11 et 12, + 9 et + 2
  // compris ; le reflet et le double + 1 de 7 + 8 ou 9 + 9 feraient une rangée de poissons trop petite dans le panneau)
  if (n > 10) return "deuxCadres";
  if (a === b && a <= 5) return "reflet";
  if (hi - lo === 1 && hi <= 5) return "doublePlus";
  if (lo <= 2) return "ligne";
  return "maison";
};
// o = { seance, op } ; la promesse se résout quand la maison quitte la table (`app.tableCancel`)
// (lot « Multiplication » : `op` « × », la table de multiplication, de 1 × 1 à 10 × 10 : seance.json, menuLecons.tableMult ;
// la case dit « 7 fois 5, 35. » et montre les rangées)
export async function additionTable(app, o) {
  const mul = o.op === "×", { sprites, voice, text, stage } = app, C = (mul ? o.seance.menuLecons?.tableMult : o.seance.menuLecons?.table) ?? {}, max = C.max ?? 10, min = C.min ?? 0, T = { ...TABLE, max, min, op: mul ? "×" : "+", tint: true };
  await sprites.load("aides");
  const els = [], S = T.head + (max - min + 1) * T.pitch, side = S + 2 * T.pad, G = { ...T, x: T.pad, y: T.pad };
  // la grille, dessinée une fois ; dessus, le calque de la case touchée
  const grid = spriteBox(app, { x: T.x - T.pad, y: T.y - T.pad, w: side, h: side, cls: "bubble table-grille", label: mul ? "table de multiplication" : "table d'addition", paint: (ctx, px) => { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawAddTable(ctx, G); } });
  let lit = null, last = { k: "", t: -1e9 };
  const over = spriteBox(app, { x: T.x - T.pad, y: T.y - T.pad, w: side, h: side, cls: "hud table-case", still: true, paint: (ctx, px) => { if (!lit) return; ctx.setTransform(px, 0, 0, px, 0, 0); R.drawAddTable(ctx, { ...G, lit, bare: true }); } });
  over.style.pointerEvents = "none";
  const P = T.panel, panel = spriteBox(app, { x: P.x, y: P.y, w: P.w, h: P.h, cls: "hud table-calcul", still: true, paint: (ctx, px) => (mul ? paintPanelMult : paintPanel)(app, ctx, px, lit) });
  panel.dataset.bulleSouple = "";
  els.push(grid, over, panel);
  // le compteur d'étoiles n'est pas affiché (rien à gagner ici) ; la bulle se met sous la tête
  const hud = app.hud?.box; if (hud) hud.style.visibility = "hidden";
  app.bulle.places = TABLE_PLACES;
  onTap(grid, (e) => {
    const r = grid.getBoundingClientRect(), k = stage.k, hit = tableHit(T, max, T.x - T.pad + (e.clientX - r.left) / k, T.y - T.pad + (e.clientY - r.top) / k, min);
    if (!hit) return;
    const key = hit.join("+"), now = performance.now();
    if (key === last.k && now - last.t < (C.doubleToucherMs ?? 150)) return; // un second toucher trop rapide de la même case
    last = { k: key, t: now };
    lit = hit; over.repaint(); panel.repaint(); pop(over); grid.dataset.case = key;
    app.ocean?.mascotte?.activite?.();
    voice.stop(); voice.say(mul ? text.pick("tableCaseMult", { a: hit[0], b: hit[1], n: hit[0] * hit[1] }) : text.pick("tableCase", { a: hit[0], b: hit[1], n: hit[0] + hit[1] }));
  });
  voice.stop(); voice.say(text.data.tableConsigne, { instruction: true });
  await new Promise((res) => { app.tableCancel = res; });
  app.tableCancel = null; app.bulle.places = null; app.bulle.cacher?.();
  if (hud) hud.style.visibility = "";
  els.forEach((e) => e.remove());
}
// (lot « Multiplication ») le panneau de la table de multiplication : le calcul, et dessous les rangées (a rangées de b), réduites
function paintPanelMult(app, ctx, px, lit) {
  if (!lit) return;
  const { sprites } = app, [a, b] = lit, P = TABLE.panel, w = P.w, txt = `${a} × ${b} = ${a * b}`;
  ctx.setTransform(px, 0, 0, px, 0, 0);
  const em = Math.min(34, (w - 44) / R.wordWidth(txt));
  R.drawPanel(ctx, 6, 6, w - 12, em * 1.5 + 30);
  R.drawWord(ctx, txt, w / 2, 21 + em * 0.2, em, { w: em * 0.14 });
  const top = em * 1.5 + 60, lw = 660, lh = Math.max(120, a * 52);
  const c = document.createElement("canvas"); c.width = Math.round(lw * px); c.height = Math.round(lh * px);
  const x = c.getContext("2d"); x.setTransform(px, 0, 0, px, 0, 0);
  paintRows(x, sprites, a, b, { cx: lw / 2, top: 0, h: lh, w: lw - 20 });
  const k = Math.min((w - 10) / lw, (P.h - top - 10) / lh);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(c, (w / 2 - (lw * k) / 2) * px, top * px, lw * k * px, lh * k * px);
}
// le panneau : le calcul sur une plaque de nacre, et dessous l'appui de la famille, dessiné à sa taille dans un calque à
// part puis réduit dans le panneau (les aides posent leurs sprites sans les réduire)
const AID_SIZE = { cadre: [470, 210], deuxCadres: [470, 440], maison: [360, 330] };
function paintPanel(app, ctx, px, lit) {
  if (!lit) return;
  const { sprites } = app, [a, b] = lit, n = a + b, P = TABLE.panel, w = P.w, txt = `${a} + ${b} = ${n}`;
  ctx.setTransform(px, 0, 0, px, 0, 0);
  const em = Math.min(34, (w - 44) / R.wordWidth(txt));
  R.drawPanel(ctx, 6, 6, w - 12, em * 1.5 + 30);
  R.drawWord(ctx, txt, w / 2, 21 + em * 0.2, em, { w: em * 0.14 });
  const kind = tableAid(a, b); if (kind === "rien") return;
  const lo = Math.min(a, b), hi = Math.max(a, b), top = em * 1.5 + 60;
  const fishW = (lo + (kind === "doublePlus" ? 2 : 0) - 1) * 92 + 120; // (double + 1 : une place de plus, le premier poisson n'est plus coupé)
  const [lw, lh] = AID_SIZE[kind] ?? (kind === "ligne" ? [150 + lo * 120, 250] : [fishW, 230]);
  const c = document.createElement("canvas"); c.width = Math.round(lw * px); c.height = Math.round(lh * px);
  const x = c.getContext("2d"); x.setTransform(px, 0, 0, px, 0, 0);
  if (kind === "cadre") paintTenFrame(x, sprites, 7, 6, { n: hi, extra: lo });
  if (kind === "deuxCadres") paintTwoFrames(x, sprites, 7, 6, { first: hi, second: lo, gap: 24 });
  if (kind === "reflet" || kind === "doublePlus") paintDoublePlus(x, sprites, lo, { cx: lw / 2 - (kind === "doublePlus" ? 46 : 0), y: 60, gap: 92, bonus: kind === "doublePlus", maxW: Infinity });
  if (kind === "maison") paintHouse(x, sprites, lw / 2, 160, n, [[a, b]]);
  if (kind === "ligne") paintJumps(x, sprites, 10, 100, lw - 20, hi, lo);
  const k = Math.min((w - 10) / lw, (P.h - top - 10) / lh);
  // (relecture de l'étape 0 du bloc : l'appui posé sur une plaque de nacre, lisible même devant le corail du décor)
  R.drawPanel(ctx, 4, top - 12, w - 8, lh * k + 24);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(c, (w / 2 - (lw * k) / 2) * px, top * px, lw * k * px, lh * k * px);
}
// les sauts de + 1 et + 2 : la corde de a à a + b, ses nombres, la tortue arrivée et ses sauts numérotés (comme l'aide de la
// famille 1, sans animation)
function paintJumps(ctx, sprites, x, y, w, a, b) {
  const n = b + 2, L = { x0: x, x1: x + w, y, n, labels: Array.from({ length: n }, (_, i) => (i <= b ? String(a + i) : null)), k: 0 };
  R.drawLine(ctx, L);
  for (let i = 0; i < b; i++) R.drawJumpArc(ctx, R.tickP(L, i), R.tickP(L, i + 1), 1, { h: 44, label: String(i + 1), labelColor: "#fffaf0" });
  const [tx, ty] = R.tickP(L, b), m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  sprites.draw(ctx, "tortue.repos", 0, (m.a * tx + m.e) / sprites.px, (m.d * ty + m.f) / sprites.px);
  ctx.setTransform(m);
}
