// Le numéro de version lisible de l'écran de démarrage (demande du parent du 3 novembre 2026 ; tools/version-libelle.mjs)
import { test } from "node:test";
import assert from "node:assert/strict";
import { libelle, numeroPR, numeroVersion } from "../../tools/version-libelle.mjs";

test("version lisible : le numéro de la demande de fusion divisé par 100, la date de la dernière fusion (heure de Paris)", () => {
  assert.equal(numeroPR("Merge pull request #72 from js2c/claude/awesome-sagan-0v5slw"), 72);
  assert.equal(numeroPR("Lot : Problèmes (#105)"), 105);
  assert.equal(numeroPR("Fusion de main (PR #71 « Carte graphique perdue »)"), null);
  assert.equal(numeroVersion(72), "0.72"); assert.equal(numeroVersion(100), "1.00"); assert.equal(numeroVersion(7), "0.07");
  // la 67 fusionnée après la 72 ne fait pas reculer le numéro ; la date est celle de la dernière fusion (21 h 10 à Paris, le 3)
  const commits = [
    { sujet: "Merge pull request #67 from js2c/claude/problemes-fiche", date: "2026-11-03T21:10:33+01:00" },
    { sujet: "Fusion de main", date: "2026-11-03T20:04:43+00:00" },
    { sujet: "Merge pull request #72 from js2c/claude/awesome-sagan-0v5slw", date: "2026-11-03T10:00:00+01:00" },
  ];
  assert.deepEqual(libelle(commits), { numero: "0.72", date: "03/11/2026" });
  // 23 h 30 à Paris le 3 novembre, 22 h 30 en temps universel : c'est le 3 ; minuit et demi à Paris, c'est le 4
  assert.deepEqual(libelle([{ sujet: "Merge pull request #100 from x", date: "2026-11-03T22:30:00Z" }]), { numero: "1.00", date: "03/11/2026" });
  assert.deepEqual(libelle([{ sujet: "Merge pull request #100 from x", date: "2026-11-03T23:30:00Z" }]), { numero: "1.00", date: "04/11/2026" });
  assert.equal(libelle([{ sujet: "Un commit", date: "2026-11-03T22:30:00Z" }]), null);
});
