// DÉCISIONS DU PARENT DU 5 OCTOBRE 2026 (docs/SPEC.md, section 10) : jamais de doublon ; au-dessus du quota, une créature
// possédée devient brillante ; plus de décors des doublons ni de cadeaux de la surprise.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cardSpeech } from "../../app/js/session/screens.js";
import { cardsSummary } from "../../app/js/parent/data.js";
import { fill, sentences } from "../../app/js/engine/phrases.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const cartes = load("cartes.json"), T = load("textes.json"), cal = load("calendrier.json");

test("une créature rendue brillante : « C'est le crabe ! Oh ! Elle est brillante ! » (phrases dont la voix existe)", () => {
  const crabe = cartes.cartes.find((c) => c.id === "crabe");
  const dit = cardSpeech({ data: T }, { carte: crabe, nouvelle: false, devientBrillante: true, rendueBrillante: true }, true);
  assert.equal(dit, `${fill(T.carteNouvelle, { nom: crabe.nomLu })} ${T.carteBrillanteTirage}`);
  assert.ok(!/Encore|déjà cette carte|offre/.test(dit));
  const voix = JSON.parse(readFileSync(new URL("../../app/assets/voix/index.json", import.meta.url))).phrases;
  for (const p of sentences(dit)) assert.ok(voix[p], `voix de « ${p} »`);
});

test("plus de doublon, de décor ni de cadeau dans le contenu", () => {
  for (const k of ["carteDoublon", "carteDoublonDecor", "surpriseCadeau"]) assert.ok(!(k in T), k);
  for (const k of ["decors", "brillanteDoublon", "recifPages"]) assert.ok(!(k in cartes), k);
  assert.ok(cartes.cartes.every((c) => !("recif" in c)));
});

test("espace parent : plus de ligne « décors » ; les brillantes sont comptées", () => {
  const owned = { crabe: { n: 1, brillante: true }, moule: { n: 1, brillante: false } };
  const K = cardsSummary({ cartes: { cartes: owned }, etoiles: {}, decors: { ids: ["corail-branchu"] }, cadeaux: { ids: ["etoile"] } }, cartes, cal, []);
  assert.ok(!("decors" in K) && !("cadeaux" in K));
  assert.equal(K.cartes, 2); assert.equal(K.brillantes, 1);
});
