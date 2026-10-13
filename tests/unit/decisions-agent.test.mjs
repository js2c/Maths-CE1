// LOT « DÉCISIONS SUR LES CONSTATS DE L'AGENT » (docs/LOTS.md, fiche 11 ; décisions du parent du 13 octobre 2026) : les règles
// testées sans navigateur. Décision 5, la répétition des additions : dans un bloc (la notion du jour, l'échauffement), un même
// fait au plus 2 fois, et au moins 4 autres questions entre deux passages du même fait (module2.json, repetition).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { expected, key } from "../../app/js/modules/facts/facts.js";
import { Module2Runner } from "../../app/js/modules/facts/runner.js";
import { repetition, warmupIndex } from "../../app/js/modules/facts/warmup.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const m2 = load("module2.json");
const NOW = new Date(2026, 9, 13, 18, 0).getTime();
const open = () => Store.open(new IDBFactory());
// le plus grand nombre de passages d'un même fait, et le plus petit nombre d'autres questions entre deux passages
const reps = (faits) => { const n = new Map(), last = new Map(); let max = 0, ecart = Infinity; faits.forEach((k, i) => { n.set(k, (n.get(k) ?? 0) + 1); max = Math.max(max, n.get(k)); if (last.has(k)) ecart = Math.min(ecart, i - last.get(k) - 1); last.set(k, i); }); return { max, ecart }; };

test("décision 5 : les réglages sont dans le contenu (module2.json, repetition : 2 passages, 4 questions d'écart)", () => {
  assert.deepEqual({ parBlocMax: m2.repetition.parBlocMax, ecartMin: m2.repetition.ecartMin }, { parBlocMax: 2, ecartMin: 4 });
  assert.equal(m2.notion.memeFaitMax, undefined, "l'ancien réglage (3 passages) a disparu");
  assert.deepEqual(repetition(m2), { ...m2.repetition });
});

test("décision 5 : notion du jour des additions, chaque famille et chaque cran, avec des erreurs : au plus 2 passages, 4 questions d'écart", async () => {
  for (const famille of [1, 2, 3, 4, 6, 8, 9, 11]) for (const cran of ["facile", "conseille", "dur", "tresdur"]) for (const seed of [3, 11]) {
    const store = await open(), r = rng(seed);
    const m = await new Module2Runner({ store, content: m2, rnd: rng(seed + 1), seance: 1, clock: () => NOW, cran: () => cran, choix: famille }).load(), faits = [];
    for (let i = 0; i < 60; i++) {
      const x = m.next(); if (!x) break;
      const { q, cfg } = x, ok = r() < 0.6; faits.push(q.fait);
      await m.record({ q, value: ok ? expected(q) : 99, ok, ms: 2500, listens: 1 }, cfg);
    }
    const { max, ecart } = reps(faits);
    assert.ok(max <= 2, `famille ${famille}, ${cran}, graine ${seed} : un fait ${max} fois (${faits.join(" ")})`);
    assert.ok(ecart >= 4, `famille ${famille}, ${cran}, graine ${seed} : deux passages à ${ecart} question(s) d'écart (${faits.join(" ")})`);
  }
});

test("décision 5 : une erreur fait revenir le fait après au moins 4 autres questions, une seule fois", async () => {
  const store = await open(), m = await new Module2Runner({ store, content: m2, rnd: rng(2), seance: 1, clock: () => NOW, cran: () => "conseille", choix: 3 }).load();
  const qs = [];
  for (let i = 0; i < 30; i++) { const x = m.next(); if (!x) break; qs.push(x.q); await m.record({ q: x.q, value: i === 0 ? 99 : expected(x.q), ok: i !== 0, ms: 2500, listens: 1 }, x.cfg); }
  const f0 = qs[0].fait, again = qs.findIndex((q, i) => i > 0 && q.fait === f0);
  assert.ok(again >= 5, `le fait raté revient à la question ${again + 1}`);
  assert.ok(qs[again].revient, "c'est le retour de l'erreur (« erreur corrigée »)");
  assert.equal(qs.filter((q) => q.fait === f0).length, 2);
});

test("décision 5 : l'échauffement (warmupIndex) : la file attend l'écart, retire ce qui ne peut plus être posé", () => {
  const f = (a, b, o = {}) => ({ a, b, fait: key(a, b), ...o }), rp = { parBlocMax: 2, ecartMin: 4 };
  // le premier de la file a été posé il y a 2 questions : on prend le suivant
  let rest = [f(3, 4), f(2, 5)];
  assert.equal(warmupIndex(rest, [7, 9, 3], ["3+4", "6+3", "1+2"], rp), 1);
  // déjà posé deux fois : retiré de la file
  rest = [f(3, 4, { revient: true }), f(2, 5)];
  assert.equal(warmupIndex(rest, [], ["3+4", "1+1", "1+2", "2+2", "4+1", "3+4"], rp), 0); assert.deepEqual(rest.map((q) => q.fait), ["2+5"]);
  // plus rien d'autre à poser que des faits trop récents : la file se vide (-1)
  rest = [f(1, 2, { revient: true })];
  assert.equal(warmupIndex(rest, [], ["1+2", "5+1"], rp), -1); assert.equal(rest.length, 0);
  // les questions du temps de base (a + 0) passent toujours
  rest = [f(4, 0, { base: true }), f(1, 2)];
  assert.equal(warmupIndex(rest, [], ["1+2"], rp), 0);
  // la règle des réponses égales s'applique parmi les questions permises : 9 puis 9, la première qui ne peut pas donner 9
  rest = [f(8, 1), f(2, 3)];
  assert.equal(warmupIndex(rest, [9, 9], [], rp), 1);
});

// ---------------------------------------------------------------- décision 6 : les voiliers
import { Module4Runner } from "../../app/js/modules/voiliers/runner.js";
import { gapOfChenal, passage } from "../../app/js/modules/voiliers/voiliers.js";
const M4 = load("module4.json"), seance = load("seance.json"), T = load("textes.json");

test("décision 6 : aux niveaux « partout », hors des bouées, le nombre reste à moins d'un intervalle de la première ou de la dernière bouée (contrôle sur les tirages)", async () => {
  const partout = M4.niveaux.filter((c) => c.place === "partout" && c.ecart !== "double");
  assert.deepEqual(partout.map((c) => [c.niveau, c.horsBouees]), [[2, 1]], "le niveau 2, réglé dans module4.json");
  for (const c of partout) for (const seed of [1, 2, 3, 4, 5]) {
    const r = await new Module4Runner({ store: await open(), content: M4, rnd: rng(seed), variete: seance.variete, choix: c.niveau }).load();
    let hors = 0;
    for (let i = 0; i < 400; i++) {
      const x = r.next({ guide: false }); if (!x) break;
      const q = x.q, b = q.bouees, k = passage(b, q.num);
      if (k === 0 || k === b.length) {
        hors++;
        const d = k === 0 ? b[0] - q.num : q.num - b.at(-1), g = gapOfChenal(b, q.ecart, k);
        assert.ok(d < c.horsBouees * g, `niveau ${c.niveau}, graine ${seed} : ${q.num} devant ${b.join(", ")} (${d} pour un intervalle de ${g})`);
      }
      await r.record({ q, ok: true, ms: 3000 }, x.cfg);
    }
    assert.ok(hors > 50, `niveau ${c.niveau} : des bateaux hors des bouées restent possibles (${hors})`);
  }
});

test("décision 6 : la phrase du toucher sur un passage", () => {
  assert.equal(T.voiliersGlisser, "Fais glisser le bateau jusqu'au passage !");
});

// ---------------------------------------------------------------- décision 4 : la bulle plus courte
import { COLONNE, largeurMax, poser, premierePhrase } from "../../app/js/engine/bulle.js";
test("décision 4 : sans place, la bulle n'écrit que la première phrase ; une phrase seule n'a pas de version courte", () => {
  assert.equal(premierePhrase("42 plus 6 ? Suis le chemin : tape le nombre de chaque caillou."), "42 plus 6 ?");
  assert.equal(premierePhrase("La tortue est sur 7. Elle fait un saut. Compte avec elle !"), "La tortue est sur 7.");
  assert.equal(premierePhrase("Il est plus petit que cette bouée : il passe avant."), null);
  assert.equal(premierePhrase("Fais glisser le bateau jusqu'au passage !"), null);
  // la dernière place, la colonne entre la tête et l'ardoise des additions (x 495), au-dessus de la bande de la ligne (y 300)
  const r = poser(COLONNE, largeurMax(COLONNE.boite), 70).rect;
  assert.ok(r[2] <= 495 && r[3] <= 300 && r[0] >= 232, JSON.stringify(r));
});
