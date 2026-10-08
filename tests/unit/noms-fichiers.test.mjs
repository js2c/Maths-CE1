// Chaque fichier du dépôt doit pouvoir être copié sous Windows, où le parent fabrique les voix (docs/VOIX.md).
// Le 8 octobre 2026, trois captures nommées « 9+?=13 » ont fait échouer la copie du dépôt sur son ordinateur :
// Windows refuse les caractères < > : " | ? * dans un nom, un nom qui finit par un point ou une espace, et les
// noms réservés (CON, PRN, AUX, NUL, COM1…, LPT1…).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("aucun nom de fichier du dépôt n'est refusé par Windows", (t) => {
  let fichiers;
  try { fichiers = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean); }
  catch { return t.skip("git indisponible"); }
  const mauvais = fichiers.filter((f) => f.split("/").some((p) => /[<>:"|?*\\]/.test(p) || /[. ]$/.test(p) || /^(con|prn|aux|nul|com\d|lpt\d)(\.|$)/i.test(p)));
  assert.deepEqual(mauvais, [], "noms à changer (caractères < > : \" | ? * interdits sous Windows)");
});
