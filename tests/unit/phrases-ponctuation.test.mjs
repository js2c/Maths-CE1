// LA PHRASE « … » DITE SEULE (lot « Recette de l'enfant et nettoyage des couches », point 0.2 ; docs/LOTS.md, fiche 9).
// Des répliques des leçons de l'étal commençaient par « … » (« … 15… ») ; le découpage en phrases en faisait une phrase à
// elle seule, fabriquée par la voix : 5 s de mots incompréhensibles. Une phrase sans lettre ni chiffre n'est jamais dite ni
// fabriquée, et aucune réplique ne commence plus par « … ».
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dicible, sentences } from "../../app/js/engine/phrases.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";

const root = new URL("../../", import.meta.url), read = (p) => readFileSync(new URL(p, root), "utf8");

test("une phrase faite seulement de ponctuation n'est jamais une phrase à dire", () => {
  assert.deepEqual(sentences("… 15…"), ["15…"]);
  assert.deepEqual(sentences("… 16, 17 !"), ["16, 17 !"]);
  assert.deepEqual(sentences("…"), []);
  assert.deepEqual(sentences("Bravo ! … !"), ["Bravo !"]);
  assert.deepEqual(sentences("trente…"), ["trente…"]);
  assert.ok(dicible("0") && dicible("À") && !dicible("… ! ?") && !dicible("—"));
});

test("aucune phrase de l'inventaire de la voix n'est faite seulement de ponctuation", () => {
  const vides = [...inventaire().keys()].filter((s) => !dicible(s));
  assert.deepEqual(vides, []);
});

test("aucune réplique des leçons ne commence par « … »", () => {
  const debut = [];
  const voir = (v) => { if (typeof v === "string") { if (/^\s*(…|\.\.\.)/.test(v)) debut.push(v); } else if (v && typeof v === "object") Object.values(v).forEach(voir); };
  voir(JSON.parse(read("app/content/lecons.json")));
  voir(JSON.parse(read("app/content/textes.json")));
  assert.deepEqual(debut, []);
});

test("la voix ne dit rien, et la bulle n'écrit rien, pour un texte sans phrase à dire", async () => {
  const { Voice } = await import("../../app/js/engine/voice.js");
  const v = new Voice(); let parle = 0; v.onTalk = () => parle++;
  await v.speakNow("…");
  assert.equal(parle, 0);
});
