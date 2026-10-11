// L'ÉCRAN DE LA BOUTIQUE (session/boutique.js) : ce que dit la mascotte pour chaque état d'une place (chaque phrase dite a sa
// place dans l'inventaire de la voix), la place de la coche et de la croix, la zone montrée à l'entrée.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sentences } from "../../app/js/engine/phrases.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";

// (le module de l'écran importe des modules du navigateur : seules ses fonctions pures sont essayées, sans DOM)
globalThis.document ??= { createElement: () => ({ getContext: () => null, style: {} }), fonts: { load: async () => {} } };
const { CONF, placeConfirmation, placeTuile, texteTuile, zoneParDefaut, parZone } = await import("../../app/js/session/boutique.js");
const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const cartes = load("cartes.json"), T = load("textes.json"), inv = inventaire();
const carte = (id) => cartes.cartes.find((c) => c.id === id);

test("chaque état d'une place a sa phrase, et chaque phrase est dans l'inventaire de la voix", () => {
  const crabe = carte("crabe"), hippo = carte("hippocampe"), requin = carte("grand-requin-blanc"), dauphin = carte("dauphin");
  const cas = [
    [crabe, "vendre", 40, 50, /^C'est le crabe ! Pour l'avoir, il faut 40 étoiles\. Si tu es d'accord, touche la coche verte\.$/],
    [hippo, "vendre", 100, 58, /^C'est l'hippocampe ! Pour l'avoir, il faut 100 étoiles\. Il te manque 42 étoiles\.$/],
    [crabe, "vendre", 40, 39, /Il te manque une étoile\.$/],
    [crabe, "terne", 150, 58, /^C'est le crabe ! Cette créature est déjà dans ton récif\. Pour la faire briller, il faut 150 étoiles\. Il te manque 92 étoiles\.$/],
    [hippo, "terne", 300, 0, /il faut 300 étoiles\.$/], // (300 qui manquent : seul le prix est dit)
    [crabe, "brillante", null, 0, /^C'est le crabe ! Cette créature brille déjà dans ton récif\.$/],
    [crabe, "bientot", null, 0, /^Cette créature arrive bientôt à la boutique !$/],
    [requin, "legende", null, 999, /^C'est une créature légendaire ! Elle se gagne avec les étoiles de diamant\.$/],
    [requin, "legendeAToi", null, 0, /^C'est le grand requin blanc ! Cette créature est déjà dans ton récif\.$/],
    [dauphin, "fermee", null, 0, /^Le grand large s'ouvrira un jour, grâce à tes étoiles arc-en-ciel\.$/],
  ];
  for (const [c, e, cout, total, re] of cas) {
    const t = texteTuile(T, cartes, c, e, cout, total);
    assert.equal(typeof t, "string", `${c.id} ${e}`); assert.match(t, re);
    // (une créature dont la carte n'est pas encore prête ne peut pas être dans le récif : son nom entre dans l'inventaire avec
    // son anecdote ; ici, le grand requin blanc du récif est un cas d'école)
    for (const s of sentences(t)) if (c.anecdote || !s.startsWith("C'est le grand")) assert.ok(inv.has(s), `« ${s} » (${e}) dans l'inventaire`);
  }
});

test("la coche et la croix : sous la tuile, au-dessus pour la dernière rangée, dans l'écran ; 88 px", () => {
  assert.equal(CONF, 88);
  for (let i = 0; i < 15; i++) {
    const { x, y } = placeTuile(i), r = [x, y, x + 170, y + 196], p = placeConfirmation(r);
    assert.ok(p.x >= 0 && p.x + 2 * CONF + 18 <= 1280 && p.y >= 0 && p.y + CONF <= 800, `tuile ${i}`);
    if (i < 10) assert.ok(p.y >= r[3] - 2, `tuile ${i} : sous la tuile`); else assert.ok(p.y < r[3], `tuile ${i} : au-dessus du bas`);
  }
});

test("la zone montrée à l'entrée : une arrivée pas encore vue, sinon quelque chose à vendre, sinon la dernière ouverte", () => {
  const v = new Map(cartes.cartes.map((c) => [c.id, "terne"]));
  assert.equal(zoneParDefaut(cartes, v, new Set(), ["lagon", "corail"]), "corail");
  v.set("crabe", "vendre"); assert.equal(zoneParDefaut(cartes, v, new Set(), ["lagon", "corail"]), "lagon");
  assert.equal(zoneParDefaut(cartes, v, new Set(["murene"]), ["lagon", "corail"]), "corail");
  assert.deepEqual(parZone(cartes, "lagon").map((c) => c.rarete).join(" "), "commune ".repeat(11) + "rare rare rare rare");
});
