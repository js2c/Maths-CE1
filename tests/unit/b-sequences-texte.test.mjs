// L'OUTIL DES SÉQUENCES DIT CE QUI SE PASSE EN MOTS SIMPLES (lot « Correctifs des relectures » ; relecture du lot « Décisions
// sur les constats de l'agent », questions 3 et 4 : l'en-tête « étapes : accueil, echauffement, notion, defi… » se lisait
// « accueil, echauffement » seulement ; « acquise famille 7 » pendant une séance sur la famille 3 et « trou famille 3 » pour une
// enfant qui a tout juste semblaient des erreurs de l'outil). tests/recette-fonctionnelle/b-texte.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { etapesTexte, evenementFamilleTexte } from "../recette-fonctionnelle/b-texte.mjs";

const familles = JSON.parse(readFileSync(new URL("../../app/content/module2.json", import.meta.url))).familles;

test("les étapes : jouées en mots simples, puis les sautées avec leur raison", () => {
  const t = etapesTexte([{ id: "accueil" }, { id: "echauffement" }, { id: "notion" }, { id: "defi", sautee: "pas encore" }, { id: "probleme", sautee: "désactivée" }, { id: "recompense" }]);
  assert.equal(t, "accueil, échauffement, notion du jour, récompense ; sautées : défi record (pas encore (moins de 5 séances terminées, ou trop peu de faits bien sus)), problème du jour (pas encore construit)");
  assert.equal(etapesTexte([{ id: "accueil" }, { id: "defi" }]), "accueil, défi record");
  assert.ok(!/echauffement|\bdefi\b|probleme/.test(t), "plus de noms internes");
});

test("une famille acquise qui n'est pas celle de la séance le dit ; celle de la séance, non", () => {
  const autre = evenementFamilleTexte({ type: "acquise", famille: 7 }, 3, familles);
  assert.match(autre, /^la famille 7 \(mélange\) est acquise : ce n'est pas la famille de la séance/);
  assert.equal(evenementFamilleTexte({ type: "acquise", famille: 3 }, 3, familles), "la famille 3 (amis de 10) est acquise");
});

test("« trou » : les formes à trou s'ouvrent, dit en clair (et, pour les familles 3 à 5, à quoi cela sert)", () => {
  assert.equal(evenementFamilleTexte({ type: "trou", famille: 6 }, 3, familles), "les formes à trou s'ouvrent pour la famille 6 (presque-doubles) : la moitié de ses faits sont bien sus");
  assert.match(evenementFamilleTexte({ type: "trou", famille: 3 }, 3, familles), /cela compte pour le mélange/);
  for (const e of [{ type: "trou", famille: 3 }, { type: "ouverte", famille: 8 }, { type: "depassee", famille: 4 }]) assert.ok(!/^(trou|ouverte|depassee) famille/.test(evenementFamilleTexte(e, 3, familles)));
  assert.match(evenementFamilleTexte({ type: "ouverte", famille: 9, stagnation: true }, 8, familles), /s'ouvre \(la famille d'avant n'avançait plus\)/);
});
