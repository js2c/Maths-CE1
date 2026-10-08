// Lot « Correctifs de la tablette » (docs/LOTS.md, fiche 6) : les décisions du parent du 8 octobre 2026, après le premier
// essai sur la tablette. Les numéros sont ceux de la fiche.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { contenu } from "../../tools/precache.mjs";

const racine = (f) => new URL(`../../${f}`, import.meta.url);

test("8 : fins de ligne LF partout (.gitattributes), binaires marqués ; l'empreinte du mode hors ligne ignore les CRLF", () => {
  const ga = readFileSync(racine(".gitattributes"), "utf8");
  assert.match(ga, /^\* text=auto eol=lf$/m);
  for (const ext of ["png", "webp", "jpg", "ogg", "mp3", "webm", "mp4", "woff2"]) assert.match(ga, new RegExp(`^\\*\\.${ext} binary$`, "m"), ext);
  const lf = Buffer.from('{\n "a": 1\n}\n'), crlf = Buffer.from('{\r\n "a": 1\r\n}\r\n');
  assert.deepEqual(contenu("content/x.json", crlf), lf);
  assert.deepEqual(contenu("js/x.js", crlf), lf);
  const bin = Buffer.from([1, 13, 10, 2]);
  assert.equal(contenu("assets/voix/x.ogg", bin), bin, "un binaire n'est jamais modifié");
});
