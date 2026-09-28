// Le récif en pages, une par zone (lot 3, étape 5 ; décision du parent du 28 septembre 2026) : les pages et leurs
// conditions, la page d'entrée, toucher ou glisser, la résistance en bout de liste, la page où se caler, les planches.
// Données de test seulement : une deuxième zone « fictive » (le récif de corail) peuplée de créatures du lagon ; rien de
// cela n'est dans app/content.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dragShift, entryZone, isDrag, isTap, pageCreatures, pageSheets, pagesConf, PAGES, reefPages, settleTarget } from "../../app/js/session/reefpages.js";

const cartes = JSON.parse(readFileSync(new URL("../../app/content/cartes.json", import.meta.url)));
const atlas = JSON.parse(readFileSync(new URL("../../app/assets/art/atlas.json", import.meta.url)));
const hasSprite = (id) => !!atlas.sprites[`creature.${id}`];
// la zone fictive : les cartes du récif de corail prennent la place et le dessin de créatures du lagon (planche « recif-test »)
function withTestZone() {
  const lagon = cartes.cartes.filter((c) => c.zone === "lagon"), corail = cartes.cartes.filter((c) => c.zone === "corail");
  const C = { ...cartes, cartes: cartes.cartes.map((c) => { const k = corail.indexOf(c); return k >= 0 && k < 5 ? { ...c, recif: lagon[k].recif } : c; }) };
  const A = { ...atlas, sprites: { ...atlas.sprites } };
  corail.slice(0, 5).forEach((c, k) => { A.sprites[`creature.${c.id}`] = { ...atlas.sprites[`creature.${lagon[k].id}`], sheet: "recif-test" }; });
  return { C, A, ids: corail.slice(0, 5).map((c) => c.id) };
}

test("aujourd'hui : une seule page, le lagon (seule zone ouverte avec des créatures dessinées et placées)", () => {
  assert.deepEqual(reefPages(cartes, { zoneOpen: (z) => z === "lagon", hasSprite }), ["lagon"]);
  // même si toutes les zones étaient ouvertes : les zones 2 à 4 n'ont encore ni dessin ni place dans le récif
  assert.deepEqual(reefPages(cartes, { zoneOpen: () => true, hasSprite }), ["lagon"]);
});

test("une page seulement si la zone est ouverte ET a au moins une créature dessinée et placée", () => {
  const { C, A } = withTestZone(), has = (id) => !!A.sprites[`creature.${id}`];
  assert.deepEqual(reefPages(C, { zoneOpen: () => true, hasSprite: has }), ["lagon", "corail"]);
  assert.deepEqual(reefPages(C, { zoneOpen: (z) => z === "lagon", hasSprite: has }), ["lagon"], "zone fermée : pas de page");
  const sansPlace = { ...C, cartes: C.cartes.map((c) => (c.zone === "corail" ? { ...c, recif: undefined } : c)) };
  assert.deepEqual(reefPages(sansPlace, { zoneOpen: () => true, hasSprite: has }), ["lagon"], "des dessins mais aucune place : pas de page");
  assert.deepEqual(reefPages(C, { zoneOpen: () => true, hasSprite }), ["lagon"], "des places mais aucun dessin : pas de page");
  // l'ordre est celui des cartes et de l'album, même si la liste des cartes est dans un autre ordre
  assert.deepEqual(reefPages({ ...C, cartes: [...C.cartes].reverse() }, { zoneOpen: () => true, hasSprite: has }), ["lagon", "corail"]);
});

test("la page d'entrée : la zone de la dernière carte gagnée, sinon le lagon", () => {
  const pages = ["lagon", "corail"];
  assert.equal(entryZone(pages, []), "lagon");
  assert.equal(entryZone(pages, [{ zone: "lagon", premiere: 10 }, { zone: "corail", premiere: 20 }]), "corail");
  assert.equal(entryZone(pages, [{ zone: "lagon", premiere: 10, derniere: 30 }, { zone: "corail", premiere: 20 }]), "lagon", "un doublon gagné plus tard compte (derniere)");
  assert.equal(entryZone(["lagon"], [{ zone: "corail", premiere: 20 }]), "lagon", "la zone de la dernière carte n'a pas de page : le lagon");
  assert.equal(entryZone([], []), null);
});

test("les créatures et les planches d'une page", () => {
  const { C, A, ids } = withTestZone(), owned = Object.fromEntries([...ids.slice(0, 2), "crabe"].map((id) => [id, { n: 1 }]));
  const col = C.cartes.filter((c) => owned[c.id]);
  assert.deepEqual(pageCreatures(col, "corail", (id) => !!A.sprites[`creature.${id}`]).map((c) => c.id), ids.slice(0, 2));
  assert.deepEqual([...pageSheets(A, C, "corail", owned)], ["recif-test"]);
  assert.deepEqual([...pageSheets(A, C, "lagon", owned)], ["recif"]);
  assert.deepEqual([...pageSheets(A, C, "lagon", {})], [], "aucune créature gagnée : aucune planche");
});

test("toucher ou glisser ; résistance et rebond en bout de liste ; page où se caler", () => {
  const P = PAGES;
  assert.ok(isTap(4, 3, 200) && !isTap(30, 0, 200) && !isTap(0, 0, 1500), "toucher bref, sans bouger");
  assert.ok(isDrag(20, 5) && !isDrag(8, 0) && !isDrag(15, 40), "glisser : horizontal, au-delà de 12 px");
  assert.equal(dragShift(-300, 0, 2), -300, "le décor suit le doigt vers la page voisine");
  assert.ok(Math.abs(dragShift(300, 0, 2)) <= P.rebondMax && dragShift(300, 0, 2) > 0, "avant la première page : résistance, bornée");
  assert.ok(Math.abs(dragShift(-900, 0, 1)) <= P.rebondMax, "une seule page : résistance des deux côtés");
  assert.equal(settleTarget(-500, 0, 0, 2), 1, "au-delà d'un tiers de l'écran : la page suivante");
  assert.equal(settleTarget(-300, 0, 0, 2), 0, "en deçà : retour");
  assert.equal(settleTarget(-120, -0.9, 0, 2), 1, "un geste rapide suffit");
  assert.equal(settleTarget(-120, 0.9, 0, 2), 0, "un geste rapide dans l'autre sens : retour");
  assert.equal(settleTarget(500, 0, 1, 2), -1, "vers la page précédente");
  assert.equal(settleTarget(-900, -2, 0, 1), 0, "une seule page : jamais de changement (le rebond)");
  assert.equal(settleTarget(900, 2, 0, 2), 0, "avant la première : rebond");
  assert.equal(pagesConf({ recifPages: { seuil: 0.5 } }).seuil, 0.5, "réglable dans cartes.json");
});
