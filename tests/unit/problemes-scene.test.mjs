// La mise en scène d'un problème (app/js/modules/problemes/scene.js ; lot « Mise en scène des problèmes », fiche 24) : pour les 200
// énoncés, sans aucune image d'objet, avec toutes (à leur taille dans la scène, objets.json), avec celles que le parent a déposées
// (index.json), fermées puis ouvertes (une étiquette ne couvre pas un contenant ouvert), chaque étiquette et la plaque tiennent dans l'image du lieu, hors de la bande de la bulle, sans se
// couvrir ; les groupes ont leur nombre exact d'objets ; un objet sans image laisse ses étiquettes au sol.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { composer, dansBande, IMAGE, imageDe } from "../../app/js/modules/problemes/scene.js";
import { etiquettes } from "../../app/js/modules/problemes/problemes.js";

const lire = (u) => JSON.parse(readFileSync(new URL(u, import.meta.url), "utf8"));
const BANQUE = lire("../../app/content/problemes.json").enonces, LIB = lire("../../art/problemes/mise-en-scene/objets.json").objets;
const RAPPORT = { "1:1": 1, "3:4": 0.62, "4:3": 1.35, "16:9": 2.2 };
// toutes les images, à leur hauteur dans la scène (une largeur plausible selon leur format)
const TOUTES = {};
for (const o of LIB) for (const v of [null, ...(o.variantes ?? [])]) TOUTES[v ? `${o.id}-${v}` : o.id] = { w: Math.round(o.h * (RAPPORT[o.format] ?? 1)), h: o.h, c: o.categorie };
const larg = (n) => 22 * String(n).length + 96; // (l'ordre de grandeur de largeurEtiquette, nombre et icône)
const recouvre = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
const dans = (r) => r.x >= IMAGE.x && r.y >= IMAGE.y && r.x + r.w <= IMAGE.x + IMAGE.w && r.y + r.h <= IMAGE.y + IMAGE.h;

// les images déposées par le parent (app/assets/problemes/index.json : leur taille réelle et leur catégorie)
const VRAIES = lire("../../app/assets/problemes/index.json").objets;
for (const [nom, images, ouverts] of [["sans image", {}], ["toutes les images", TOUTES], ["les images déposées", VRAIES], ["les images déposées, contenants ouverts", VRAIES, true]]) {
  test(`les 200 scènes, ${nom} : étiquettes et plaque dans l'image, hors de la bande de la bulle, sans se couvrir`, () => {
    const defauts = [];
    for (const e of BANQUE) {
      const E = etiquettes(e), D = E.map((t) => t.n), L = composer(e, D, D.map(larg), 66, images, { ouverts });
      // (ouverts, leur contenu montré : l'étiquette d'un groupe n'en couvre aucun contenant, à peine un coin : 15 % au plus, la marge
      // que la composition s'accorde faute de place)
      if (ouverts) for (const t of L.etiquettes) { const p = L.pieces.find((x) => x.k === t.k); if (p?.groupe && !p.manque && !t.accolade && p.copies.some((c) => inter(t, c) > 0.15 * c.w * c.h)) defauts.push(`${e.id} : l'étiquette ${t.i} couvre un ${p.o} ouvert`); }
      const boites = [...L.etiquettes.filter((t) => !t.echo), L.plaque];
      for (const b of boites) { if (!dans(b)) defauts.push(`${e.id} : hors de l'image`); if (dansBande(b)) defauts.push(`${e.id} : dans la bande de la bulle`); }
      for (let i = 0; i < boites.length; i++) for (let j = i + 1; j < boites.length; j++) if (recouvre(boites[i], boites[j])) defauts.push(`${e.id} : deux étiquettes se couvrent`);
      const uniques = L.etiquettes.filter((t) => !t.echo).map((t) => t.i); if (new Set(uniques).size !== uniques.length) defauts.push(`${e.id} : une donnée posée deux fois`);
      const vues = new Set(L.etiquettes.map((t) => t.i)); D.forEach((_, i) => { if (!vues.has(i)) defauts.push(`${e.id} : l'étiquette ${i} n'est pas posée`); });
      for (const p of L.pieces) if (!p.manque && p.groupe && Number.isInteger(e.scene.objets[p.k].n) && p.copies.length !== D[e.scene.objets[p.k].n]) defauts.push(`${e.id} : ${p.copies.length} ${p.o} au lieu de ${D[e.scene.objets[p.k].n]}`);
      for (const p of L.pieces) for (const c of p.copies) if (c.x < IMAGE.x || c.x + c.w > IMAGE.x + IMAGE.w + 1) defauts.push(`${e.id} : ${p.o} dépasse de l'image`);
    }
    assert.deepEqual([...new Set(defauts)], []);
  });
}
test("les gourmandises : le chien, la gamelle (la plaque), 3 sachets fermés marqués 6, Papa", () => {
  const e = BANQUE.find((x) => x.id === "grp-07"), D = etiquettes(e).map((t) => t.n), L = composer(e, D, D.map(larg), 66, TOUTES);
  assert.deepEqual(L.pieces.map((p) => `${p.o}×${p.copies.length}`), ["chien×1", "gamelle×1", "sachet×3", "papa×1"]);
  assert.equal(L.pieces[2].copies[0].cle, "sachet-ferme");
  assert.equal(L.plaque.k, 1);
  assert.equal(L.etiquettes.filter((t) => t.i === 1).length, 3); // (le 6 sur chaque sachet)
  assert.ok(L.etiquettes.find((t) => t.i === 0).accolade); // (le 3 au-dessus des sachets)
  const ouverts = composer(e, D, D.map(larg), 66, TOUTES, { ouverts: true });
  assert.equal(ouverts.pieces[2].copies[0].cle, "sachet-ouvert");
});
test("un objet sans image : son étiquette seule, au sol ; un groupe d'enfants : quatre enfants différents tour à tour", () => {
  const e = BANQUE.find((x) => x.id === "grp-07"), D = etiquettes(e).map((t) => t.n), L = composer(e, D, D.map(larg), 66, { chien: TOUTES.chien, papa: TOUTES.papa });
  assert.ok(L.pieces.find((p) => p.o === "sachet").manque);
  assert.ok(L.etiquettes.filter((t) => t.i === 1).length === 1);
  const enf = { o: "enfants", v: "a" }, I = { "enfants-a": {}, "enfants-b": {}, "enfants-c": {}, "enfants-d": {} };
  assert.deepEqual([0, 1, 2, 3, 4].map((r) => imageDe(enf, I, r).cle), ["enfants-a", "enfants-b", "enfants-c", "enfants-d", "enfants-a"]);
  assert.equal(imageDe(enf, I, 4).retourne, true);
});

// (relecture indépendante du 7 novembre 2026) le dépôt de la réponse qui porte aussi les données : « 8 5 ? » dans l'ordre de
// l'histoire, la plaque à droite, le seau pas couvert par la plaque
test("le seau des coquillages : les étiquettes dans l'ordre de l'histoire, la plaque après elles, le seau visible", () => {
  const e = BANQUE.find((x) => x.id === "reu-t-07"), D = etiquettes(e).map((t) => t.n), L = composer(e, D, D.map(larg), 66, VRAIES);
  const t = (i) => L.etiquettes.find((x) => x.i === i && !x.echo), seau = L.pieces.find((p) => p.o === "seau").copies[0];
  assert.ok(t(0).x < t(1).x && t(1).x < L.plaque.x, `ordre ${t(0).x} ${t(1).x} ${L.plaque.x}`);
  const couvre = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  assert.ok(couvre({ ...L.plaque, w: 196, h: 84 }, seau) <= 0.1 * seau.w * seau.h, "la plaque couvre le seau");
});
// plusieurs sortes comptées : chaque étiquette a l'image de la sienne (scenes.mjs, unitesDe), écrite dans la banque et connue
test("plusieurs sortes comptées : une unité par étiquette, chacune avec son image", () => {
  const avec = BANQUE.filter((e) => e.scene?.unites);
  assert.ok(avec.length >= 20, `${avec.length} énoncés`);
  const e = BANQUE.find((x) => x.id === "reu-t-07");
  assert.deepEqual(e.scene.unites, ["u-coquillage-blanc", "u-coquillage-rose"]);
  assert.equal(e.scene.unite, undefined, "« combien de coquillages » réunit les deux : pas d'unité de la réponse");
  assert.deepEqual(BANQUE.find((x) => x.id === "reu-t-08").scene.unites, ["vache", "u-animal-mouton"]);
  // (toutes ont leur image, sauf les personnes : leur étiquette n'a alors pas d'image, screen.js, preparer)
  for (const x of avec) for (const u of x.scene.unites) if (u && u !== "u-personne") assert.ok(VRAIES[u], `${x.id} : ${u} sans image`);
});
