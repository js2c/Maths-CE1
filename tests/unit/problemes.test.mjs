// LOT « PROBLÈMES » (docs/LOTS.md, fiche 20 ; docs/SPEC.md, section 7 quinquies) : le module 7. Les étiquettes (une par donnée,
// la phrase qui la dit), le classement des erreurs P1 à P4, le cran « très dur » (une difficulté au-dessus), le départ au niveau 2,
// la répétition (jamais deux fois dans une séance, le tour du niveau, les manqués d'abord), la montée (8 sur 10, au plus une
// aide, sur deux jours, sans voie rapide, l'étape fixe comprise), l'étape fixe (deux problèmes au plus, le second seulement s'il
// reste assez de temps), le cran « plus facile » (jamais de schéma d'emblée), la leçon L19.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { classer, enObjets, etiquettes, operations, poolTresDur, structureDe } from "../../app/js/modules/problemes/problemes.js";
import { Module7Runner } from "../../app/js/modules/problemes/runner.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m7 = load("module7.json"), banque = load("problemes.json").enonces, E = (id) => banque.find((e) => e.id === id);
const open = () => Store.open(new IDBFactory());
const DAY = 86400e3, T0 = new Date(2027, 0, 4, 18).getTime();
const runner = async (o = {}) => new Module7Runner({ store: o.store ?? await open(), content: m7, banque, rnd: rng(o.seed ?? 3), seance: 1, clock: o.clock ?? (() => T0), cran: () => o.cran ?? "conseille", choix: o.choix ?? null, etape: !!o.etape }).load();
const repondre = async (m, x, ok, o = {}) => m.record({ q: x.q, value: ok ? x.q.e.reponse : x.q.e.reponse + 1, ms: 20000, listens: 1, aide: !!o.aide, nsp: !!o.nsp }, x.cfg);

test("les étiquettes : une par donnée, dans l'ordre, avec la phrase qui la dit ; aux groupes égaux, le nombre de groupes sans objet", () => {
  assert.deepEqual(etiquettes(E("tra-pf-13")), [{ n: 23, objet: "poisson", phrase: 0 }, { n: 9, objet: "poisson", phrase: 1 }]);
  const g = etiquettes(E("grp-19")); assert.equal(g[0].objet, null); assert.ok(g[1].objet);
  for (const e of banque) { const L = etiquettes(e); assert.ok(L.length >= 2 && L.every((x) => x.phrase >= 0 && x.phrase < e.enonce.length), e.id); }
  for (const e of banque) assert.equal(operations(e).at(-1)[3], e.reponse, e.id);
});

test("les erreurs : P1 la mauvaise opération, P2 un nombre redit, P3 une erreur de compte, P4 la réponse de la première étape", () => {
  const s = E("tra-pf-13"); // 23 − 9 = 14
  assert.equal(classer(s, 14), null); assert.equal(classer(s, 32), "P1"); assert.equal(classer(s, 23), "P2"); assert.equal(classer(s, 9), "P2");
  assert.equal(classer(s, 15), "P3"); assert.equal(classer(s, 4), "P3"); assert.equal(classer(s, 40), "autre"); assert.equal(classer(s, null, true), "NSP");
  const d = E("etp-01"); // 6 + 5 = 11 ; 11 − 3 = 8
  assert.equal(classer(d, 11), "P4"); assert.equal(classer(d, 14), "P1");
  const c = E("cmp-e-01"); // 7 billes, 4 billes : 3 de plus
  assert.equal(classer(c, 11), "P1");
});

test("le cran « très dur » : les mêmes structures, une difficulté au-dessus (au niveau 2, celles du niveau 6)", () => {
  const P = poolTresDur(banque, 2), S2 = new Set(banque.filter((e) => e.niveau === 2).map(structureDe));
  assert.ok(P.length > 0 && P.every((e) => S2.has(structureDe(e)) && e.difficulte === 3));
  const P9 = poolTresDur(banque, 9), d9 = Math.max(...banque.filter((e) => e.niveau === 9).map((e) => e.difficulte));
  assert.ok(P9.every((e) => e.difficulte >= d9));
  assert.deepEqual(enObjets(17), { dizaines: 0, unites: 17 }); assert.deepEqual(enObjets(23), { dizaines: 2, unites: 3 });
});

test("le départ au niveau 2 ; un énoncé ne revient pas dans la séance ; le tour du niveau ; un manqué revient à la séance suivante, d'abord", async () => {
  const store = await open(), m = await runner({ store });
  assert.equal(m.niveau, 2);
  const vus = [];
  for (let i = 0; i < 20; i++) { const x = m.next(); if (!x) break; vus.push(x.q.id); await repondre(m, x, i !== 0); }
  const premiers = vus.filter((id, i) => vus.indexOf(id) === i);
  assert.ok(vus.filter((id) => id === vus[0]).length <= 2, "le manqué revient une fois plus loin, pas plus");
  assert.equal(new Set(premiers).size, premiers.length);
  assert.ok(premiers.every((id) => E(id).niveau === 2));
  // séance suivante : le manqué d'abord (s'il est encore manqué)
  const st = await store.get("niveaux", 7); st.manques = [vus[3]]; await store.put("niveaux", st);
  const m2 = await new Module7Runner({ store, content: m7, banque, rnd: rng(9), seance: 2, clock: () => T0 + DAY, etape: true }).load();
  assert.equal(m2.next().q.id, vus[3]);
});

test("la montée : 8 bonnes réponses sur 10, au plus une aide, sur deux jours, sans voie rapide ; l'étape fixe compte", async () => {
  const store = await open();
  let m = await runner({ store, etape: true });
  // l'étape fixe, 2 problèmes par jour ; la voie rapide n'existe pas (5 justes rapides ne montent pas)
  let t = T0, montee = null;
  for (let j = 0; j < 8 && !montee; j++) {
    m = await new Module7Runner({ store, content: m7, banque, rnd: rng(j + 1), seance: j + 1, clock: () => t, etape: true }).load();
    for (let i = 0; i < 3; i++) { const x = m.next(); if (!x) break; const r = await repondre(m, x, true); montee ??= r.events.find((e) => e.type === "montee") ? j : null; }
    t += DAY;
  }
  assert.equal(montee, 4, "10 réponses justes à deux par séance : la montée à la cinquième séance");
  assert.equal((await store.get("niveaux", 7)).niveau, 3);
  // en une seule journée : pas de montée
  const s2 = await open(), m3 = await runner({ store: s2 });
  for (let i = 0; i < 12; i++) { const x = m3.next(); if (!x) break; await repondre(m3, x, true); }
  assert.equal((await s2.get("niveaux", 7)).niveau, 2);
});

test("l'étape fixe : deux problèmes au plus, le second seulement s'il reste assez de temps, ni leçon ni retour dans la séance", async () => {
  const m = await runner({ etape: true });
  assert.equal(m.entryLesson(), null);
  let reste = 80000; m.reste = () => reste;
  const a = m.next(); await repondre(m, a, false);
  reste = 30000; assert.equal(m.next(), null, "moins de 45 s : pas de second problème");
  const m2 = await runner({ etape: true }); m2.reste = () => 90000;
  assert.ok(m2.next() && m2.next()); assert.equal(m2.next(), null, "deux au plus");
});

test("les crans : « plus facile » donne les objets et redit, jamais de schéma d'emblée ; « plus dur » et « très dur » sans coquillage", async () => {
  const f = (await runner({ cran: "facile" })).next().q;
  assert.ok(f.objets && f.redire && f.coquillage && !f.aideDEmblee && !f.schemaDEmblee);
  for (const cran of ["dur", "tresdur"]) assert.equal((await runner({ cran })).next().q.coquillage, false);
  const t = (await runner({ cran: "tresdur" })).next().q; assert.equal(t.e.difficulte, 3);
});

test("la leçon L19 : la première fois, dans l'exercice, à un niveau qui a le schéma en barres ; la même erreur deux fois la relance", async () => {
  const m = await runner();
  assert.equal(m.entryLesson(), "L19");
  m.lessonPlayed("L19"); assert.equal(m.entryLesson(), null);
  const m2 = await runner({ choix: 4 }); let lecon = null;
  for (let i = 0; i < 6 && !lecon; i++) { const x = m2.next(); const r = await m2.record({ q: x.q, value: x.q.e.donnees?.[0] ?? 1, ms: 9000, listens: 1 }, x.cfg); lecon ??= r.events.find((e) => e.type === "lecon"); }
  assert.equal(lecon?.id, "L19"); assert.equal(lecon?.raison, "P2");
});
