// LA BULLE DE L'ÉTAL EN DERNIER RECOURS DANS LE CIEL (lot « Correctifs des relectures », constat R14 de sa relecture : dans les
// leçons de la monnaie, l'argent sorti du portefeuille, déclaré à la bulle, prenait toutes ses places ; elle renonçait alors que
// le ciel était vide). engine/bulle.js : `placeCiel`, `dernierRecours`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { choisirPlace, avecLarges, placesPoste, placeCiel, dernierRecours } from "../../app/js/engine/bulle.js";

const poste = { x: 25.6, y: 170, w: 198, h: 264 }; // la mascotte dans la fenêtre de la cabane (etal.json)
const mesure = () => [360, 72]; // une phrase sur deux lignes
const places = avecLarges(placesPoste(poste));

test("le ciel n'est essayé que si la place choisie touche ce que l'enfant touche ou ce dont parle la voix", () => {
  const libre = choisirPlace([], mesure, places);
  assert.equal(dernierRecours(libre, [], mesure, poste).place.nom, libre.place.nom, "une place libre : rien ne change");
  // l'argent sorti du portefeuille (billets vers y 318, pièces vers y 420) et la soucoupe, le portefeuille : tout le bas de la scène
  // (et la lampe, et les boutons « rejouer » et « passer » des leçons : les obstacles relevés dans L16)
  const durs = [[300, 263, 1280, 800], [258, 55, 344, 232], [980, 145, 1120, 285], [1135, 148, 1275, 288]];
  const p = choisirPlace(durs, mesure, places);
  assert.ok(p.touche, "sans le ciel, aucune place libre");
  const c = dernierRecours(p, durs, mesure, poste);
  assert.equal(c.place.nom, "ciel"); assert.ok(!c.touche);
  assert.ok(c.rect[3] <= 263, "la bulle reste au-dessus de l'argent");
});

test("le ciel occupé aussi : la place d'avant reste (et la bulle renonce, comme avant)", () => {
  const durs = [[200, 80, 1280, 800]];
  const p = choisirPlace(durs, mesure, places);
  assert.equal(dernierRecours(p, durs, mesure, poste), p);
});

test("sans mascotte posée ailleurs (les autres écrans), jamais de ciel", () => {
  const durs = [[0, 0, 1280, 800]], p = choisirPlace(durs, mesure, places);
  assert.equal(dernierRecours(p, durs, mesure, null), p);
  assert.deepEqual(placeCiel(poste).boite, [356, 92, 970, 252]);
});
