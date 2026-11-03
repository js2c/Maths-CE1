// LOT « PROBLÈMES » (docs/LOTS.md, fiche 20) : la banque des énoncés, app/content/problemes.json, la seule source depuis le lot
// (avant : art/problemes/enonces.json). Ses contrôles sont ceux de la maquette (art/problemes/verifier.mjs, fonction
// `controler`) : la réponse et le calcul recalculés depuis la structure et les données, l'aide (barres, comparaison, groupes,
// étapes), le niveau et la difficulté selon leur règle, les données dites, la réponse jamais dite, la ponctuation (une phrase =
// un fichier son), le nombre 1 écrit en lettres, les mots de la correction (ceux de l'histoire), le contexte et l'objet dessiné.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CONTENANTS, controler, niveau, OBJETS } from "../../art/problemes/verifier.mjs";

const banque = JSON.parse(readFileSync(new URL("../../app/content/problemes.json", import.meta.url), "utf8")).enonces;
const contextes = JSON.parse(readFileSync(new URL("../../art/problemes/contextes.json", import.meta.url), "utf8")).contextes;
const m7 = JSON.parse(readFileSync(new URL("../../app/content/module7.json", import.meta.url), "utf8"));

test("la banque des problèmes passe tous les contrôles de la maquette (200 énoncés)", () => {
  const defauts = controler(banque, contextes);
  assert.deepEqual(defauts, []);
  assert.equal(banque.length, 200);
});

test("chaque niveau du module 7 a ses énoncés, et chaque énoncé le niveau de sa règle", () => {
  for (const c of m7.niveaux) assert.ok(banque.filter((e) => e.niveau === c.niveau).length >= 14, `niveau ${c.niveau}`);
  for (const e of banque) assert.equal(niveau(e), e.niveau, e.id);
  assert.equal(m7.depart, 2, "le niveau de départ : 2 (décision du parent du 30 octobre 2026)");
});

test("les objets et les contenants des énoncés sont ceux de l'atelier", () => {
  for (const e of banque) assert.ok(OBJETS.includes(e.objet), e.id);
  // (un groupe sans contenant nommé dans l'histoire, « 4 enfants ont chacun 3 billes » : l'anneau de corde, art/problemes)
  for (const e of banque) if (e.contenant) assert.ok(CONTENANTS.includes(e.contenant), e.id);
});
