// Stockage : ouverture, schéma, réglages, export complet (IndexedDB simulé par fake-indexeddb).
import { test } from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { MIGRATIONS, Store, STORES } from "../../app/js/engine/store.js";

test("ouverture : toutes les tables de la SPEC existent", async () => {
  const s = await Store.open(new IDBFactory());
  assert.deepEqual([...s.db.objectStoreNames].sort(), [...STORES].sort());
  assert.equal(s.db.version, MIGRATIONS.length);
});

test("réponses, séances, réglages, export et réinitialisation", async () => {
  const s = await Store.open(new IDBFactory());
  const id = await s.add("seances", { debut: 1, module: 1 });
  await s.add("reponses", { seance: id, t: 2, module: 1, niveau: 1, question: "lire 6", forme: "lire", donnee: 7, juste: false, tempsMs: 3000, ecoutes: 1, aide: false, erreur: "E1" });
  await s.put("faits", { fait: "3+1", a: 3, b: 1, boite: 1, prochain: 0, historique: [] });
  await s.setSetting("codeParent", "1234");
  assert.equal(await s.setting("codeParent"), "1234");
  assert.equal(await s.setting("absent", "défaut"), "défaut");
  const parSeance = await s.all("reponses", "seance", id);
  assert.equal(parSeance.length, 1); assert.equal(parSeance[0].erreur, "E1");
  const d = await s.dump();
  assert.equal(d.seances.length, 1); assert.equal(d.faits[0].fait, "3+1"); assert.equal(d.version, MIGRATIONS.length);
  await s.wipe();
  assert.equal((await s.all("reponses")).length, 0);
});
