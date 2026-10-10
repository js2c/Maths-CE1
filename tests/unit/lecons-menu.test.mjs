// Lot « Les leçons » (docs/SPEC.md, section 3, « Les leçons ») : le menu des leçons (rangées, places, exercice associé à
// chaque leçon), la table d'addition (la case sous le doigt, l'appui montré, la place dans l'écran), les textes lus.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { END, exerciseOf, lessonNumber, MENU, menuLayout, TABLE, TABLE_PLACES, tableAid, tableHit, tileLabel } from "../../app/js/session/lessons.js";
import { aidFor } from "../../app/js/modules/facts/facts.js";
import { LESSON_OF_LEVEL } from "../../app/js/modules/numberline/runner.js";
import { BOUCHE, MASCOTTE } from "../../app/js/engine/bulle.js";
import { LEGEND_AT } from "../../app/js/session/legend.js";

const read = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}.json`, import.meta.url), "utf8"));
const [seance, lecons, textes, legendes, m1, m2, m3, m5] = ["seance", "lecons", "textes", "legendes", "module1", "module2", "module3", "module5"].map(read);
const menu = seance.menuLecons;

test("menu : les dix-huit leçons (lot « Sommes jusqu'à 30 » : L11 et L12 ; lot « Multiplication » : L13 et L14 ; lot « L'étal du pêcheur » : L15 à L18, une cinquième rangée), chacune une fois, rangées par exercice ; les tables d'addition et de multiplication au bout de la dernière rangée", () => {
  const ids = menu.rangees.flatMap((r) => r.lecons);
  assert.deepEqual([...ids].sort(), Object.keys(lecons).filter((k) => k !== "_doc").sort());
  assert.deepEqual(menu.rangees.map((r) => r.exercice), ["ligne", "additions", "calcul", "multiplication", "etal"]);
  assert.deepEqual(menu.rangees.map((r) => r.lecons), [["L1", "L2", "L3", "L10"], ["L4", "L5", "L6", "L11", "L12"], ["L7", "L8", "L9"], ["L13", "L14"], ["L15", "L16", "L17", "L18"]]);
  assert.deepEqual(menu.tables, ["addition", "multiplication"]);
  const L = menuLayout(menu);
  assert.equal(L.filter((x) => x.kind === "lecon").length, 18); assert.equal(L.filter((x) => x.kind === "icone").length, 5); assert.deepEqual(L.filter((x) => x.kind === "table").map((x) => x.id), ["addition", "multiplication"]);
  // les deux tables : dans la rangée de la multiplication, à droite de ses deux leçons (tablesPlace : rangée 4, colonnes 4 et 5)
  const last = L.filter((x) => x.y === L.find((y) => y.id === "L13").y).map((x) => x.id ?? x.ex); assert.deepEqual(last, ["multiplication", "L13", "L14", "addition", "multiplication"]);
  // chaque leçon a son nom dit au toucher, sa ligne de légende et son numéro
  for (const id of ids) { assert.ok(textes.choixLeconNom[id], id); assert.ok(tileLabel(legendes, id)?.startsWith(`${lessonNumber(id)} · `), id); }
  assert.ok(tileLabel(legendes, "+").startsWith("+ · ")); assert.ok(tileLabel(legendes, "×").startsWith("× · ")); assert.equal(lessonNumber("L10"), 10);
});

test("menu : les tuiles tiennent dans la scène, ne se chevauchent pas, évitent la bulle sous la tête et le petit livre", () => {
  const { w, h } = MENU.tile, L = menuLayout(menu), tiles = L.filter((x) => x.kind !== "icone"), rect = (x) => [x.x - w / 2, x.y - h / 2, x.x + w / 2, x.y + h / 2];
  const inter = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
  for (const t of tiles) {
    const r = rect(t);
    assert.ok(r[0] >= 420 && r[2] <= 1275 && r[1] >= 130 && r[3] <= 790, `${t.id} dans la scène : ${r}`);
    assert.ok(!inter(r, [MENU.legende[0] - 52, MENU.legende[1] - 52, MENU.legende[0] + 52, MENU.legende[1] + 52]), `${t.id} et le petit livre`);
    assert.ok(w >= 64 && h >= 64);
  }
  for (let i = 0; i < tiles.length; i++) for (let j = i + 1; j < tiles.length; j++) assert.ok(!inter(rect(tiles[i]), rect(tiles[j])), `${tiles[i].id} / ${tiles[j].id}`);
  // les pictogrammes des rangées : à gauche des tuiles, à droite de la bulle posée sous la tête (jusqu'à x 404)
  for (const ic of L.filter((x) => x.kind === "icone")) assert.ok(ic.x - MENU.icon.w / 2 > 404 && ic.x + MENU.icon.w / 2 < MENU.colX[0] - w / 2, ic.ex);
  // la fin d'une leçon : « À toi ! » et la maison, côte à côte, sous la bulle de la mascotte (à droite de sa tête)
  assert.ok(END.atoi[0] < END.maison[0] && END.atoi[1] === END.maison[1] && END.atoi[1] - 140 > 300);
});

test("« À toi ! » : chaque leçon a son exercice associé (le tableau de la spécification), dont elle est la leçon d'entrée", () => {
  const want = { L15: [6, 1], L16: [6, 2], L17: [6, 7], L18: [6, 9], L1: [1, 1], L2: [1, 5], L3: [1, 4], L10: [1, 9], L4: [2, 2], L5: [2, 3], L6: [2, 4], L7: [3, 2], L8: [3, 6], L9: [3, 7], L11: [2, 8], L12: [2, 11], L13: [5, 1], L14: [5, 6] };
  for (const [id, [mod, n]] of Object.entries(want)) {
    const e = exerciseOf(lecons, id);
    assert.equal(e.module, mod, id); assert.equal(e.apresLecon, id);
    if (mod === 1) { assert.equal(e.niveau, n); assert.ok(m1.niveaux.some((c) => c.niveau === n)); assert.equal(LESSON_OF_LEVEL[n], id); }
    if (mod === 2) { assert.equal(e.famille, n); assert.equal(m2.familles.find((f) => f.id === n).lecon, id); }
    if (mod === 3) { assert.equal(e.niveau, n); assert.equal(m3.niveaux.find((c) => c.niveau === n).lecon, id); }
    if (mod === 5) { assert.equal(e.niveau, n); assert.equal(m5.niveaux.find((c) => c.niveau === n).lecon, id); }
  }
  assert.equal(exerciseOf(lecons, "L99"), null);
});

test("table d'addition : la case sous le doigt (64 px), les en-têtes ne répondent pas", () => {
  const max = menu.table.max;
  assert.equal(max, 10); assert.ok(TABLE.pitch >= 64);
  for (let a = 0; a <= max; a++) for (let b = 0; b <= max; b++) {
    const cx = TABLE.x + TABLE.head + b * TABLE.pitch + TABLE.pitch / 2, cy = TABLE.y + TABLE.head + a * TABLE.pitch + TABLE.pitch / 2;
    assert.deepEqual(tableHit(TABLE, max, cx, cy), [a, b]);
    assert.deepEqual(tableHit(TABLE, max, cx - TABLE.pitch / 2 + 1, cy + TABLE.pitch / 2 - 1), [a, b]); // un coin de la case
  }
  assert.equal(tableHit(TABLE, max, TABLE.x + 10, TABLE.y + 200), null); // la colonne d'en-tête
  assert.equal(tableHit(TABLE, max, TABLE.x + 200, TABLE.y + 10), null); // la rangée d'en-tête
  assert.equal(tableHit(TABLE, max, TABLE.x + TABLE.head + 11 * TABLE.pitch + 5, TABLE.y + 200), null);
  // la grille tient dans l'écran, à droite de la bulle posée sous la tête, à gauche du panneau du calcul
  const side = TABLE.head + (max + 1) * TABLE.pitch;
  assert.ok(TABLE.x - TABLE.pad > TABLE_PLACES[0].boite[2] + 8 && TABLE.y - TABLE.pad >= 0 && TABLE.y + side + TABLE.pad <= 800 && TABLE.x + side + TABLE.pad < TABLE.panel.x);
  assert.ok(TABLE.x - TABLE.pad > MASCOTTE.x + MASCOTTE.w && TABLE_PLACES[0].boite[1] > MASCOTTE.y + MASCOTTE.h && TABLE_PLACES[0].boite[2] < BOUCHE[0] + 34);
});

// (lot « Sommes jusqu'à 30 » : au-delà de 10, les deux boîtes de dix, celles des familles 8, 11 et 12)
test("table d'addition : l'appui montré est celui des aides des additions jusqu'à 10 ; au-delà, les deux boîtes", () => {
  const conv = { cadre: "cadre", reflet: "reflet", doublePlus: "doublePlus", ligne: "ligne", maison: "maison", deuxCadres: "deuxCadres" };
  for (let a = 0; a <= 10; a++) for (let b = 0; b <= 10; b++) {
    const k = tableAid(a, b);
    assert.ok(["rien", "cadre", "reflet", "doublePlus", "ligne", "maison", "deuxCadres"].includes(k), `${a}+${b}`);
    assert.equal(k, tableAid(b, a), `${a}+${b} : le même appui dans les deux sens`);
    if (a === 0 || b === 0) assert.equal(k, "rien");
    else if (a + b <= 10) assert.equal(k, conv[aidFor(a, b)], `${a}+${b}`);
    else assert.equal(k, "deuxCadres", `${a}+${b}`);
  }
  assert.equal(tableAid(7, 5), "deuxCadres"); assert.equal(tableAid(7, 3), "cadre"); assert.equal(tableAid(3, 3), "reflet"); assert.equal(tableAid(3, 4), "doublePlus");
  assert.equal(tableAid(6, 2), "ligne"); assert.equal(tableAid(5, 3), "maison"); assert.equal(tableAid(8, 0), "rien"); assert.equal(tableAid(9, 2), "deuxCadres"); assert.equal(tableAid(6, 6), "deuxCadres"); assert.equal(tableAid(10, 4), "deuxCadres");
});

test("les phrases du lot : accueil à cinq bulles, fin de leçon, table d'addition (« 7 plus 5, 12. »)", () => {
  assert.equal(textes.accueilConsigne, "Touche une bulle : jouer, choisir, les leçons, le récif ou l'album.");
  assert.match(textes.accueilConsigneFaite, /regarder les leçons/);
  assert.equal(textes.finLecon, "À toi ! Touche la grande bulle pour t'entraîner.");
  assert.equal(textes.choixTable, "La table d'addition."); assert.equal(textes.tableConsigne, "Touche une case : je te dis le calcul.");
  assert.equal(textes.tableCase.replace("{a}", 7).replace("{b}", 5).replace("{n}", 12), "7 plus 5, 12.");
  assert.ok(textes.choixNom.lecons && textes.choixLecon);
  assert.ok(!("lecons" in (seance.choix ?? {})), "les leçons ne sont plus proposées par l'écran « choisir »");
});
