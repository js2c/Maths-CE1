// LOT « LES VOILIERS » (docs/SPEC.md, section 7 bis ; docs/LOTS.md, lot 2) : les règles du module 4.
//  - les niveaux et le tirage des bouées et des nombres sont ceux de la maquette validée (art/voiliers/index.html) :
//    mêmes valeurs, mêmes tirages dans le même ordre (le script de la maquette est évalué ici) ;
//  - erreurs V1 et V2, explications, la mer selon le cran, le déroulement (étoiles, retours, exemple guidé, montée).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { annonce, candidates, codeErreur, entre, explication, genBuoys, lv, merApres, merDepart, merDuCran, passage, pickNumber, pourquoi, tensWindow } from "../../app/js/modules/voiliers/voiliers.js";
import { Module4Runner, passageTexte, voiliersQuestion } from "../../app/js/modules/voiliers/runner.js";
import { checkSequence } from "../../app/js/modules/variete.js";
import { bulleNombre, qualiteSuivante } from "../../app/js/modules/voiliers/screen.js";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const M4 = JSON.parse(read("app/content/module4.json")), seance = JSON.parse(read("app/content/seance.json"));
// le script de la maquette : ses règles du jeu (tableau LV, bouées, nombres), évaluées avec un hasard fourni
const script = read("art/voiliers/index.html").match(/<script>\n([\s\S]*?)\n<\/script>/)[1];
const bout = (debut, fin) => { const i = script.indexOf(debut), j = script.indexOf(fin, i); assert.ok(i > 0 && j > i, debut); return script.slice(i, j); };
const regles = bout("const LV=[null,", "const U=['zéro'") + bout("function tensWindow", "function startTravel"), outils = script.match(/^const rnd=.*$/m)[0];
const maquette = (R) => new Function("Math0", "R", `const Math={...Object.fromEntries(Object.getOwnPropertyNames(Math0).map(k=>[k,Math0[k]])),random:R};${outils}\n${regles}\nreturn {LV,G,genBuoys,candidates,pickNumber,tensWindow,gapOfChenal};`)(Math, R);

test("les niveaux de module4.json sont ceux de la maquette (LV)", () => {
  const { LV } = maquette(Math.random);
  assert.equal(M4.niveaux.length, 9);
  for (const c of M4.niveaux) { const m = LV[c.niveau]; const { d, ...rest } = m; void d; assert.deepEqual(lv(c), rest, `niveau ${c.niveau}`); }
});

test("bouées, nombres et rangée des dizaines : les mêmes tirages que la maquette", () => {
  for (let seed = 1; seed <= 60; seed++) for (const c of M4.niveaux) {
    const L = lv(c), kinds = L.kind === "alt" ? ["hundred", "ten"] : [L.kind];
    for (const kind of kinds) {
      const r1 = rng(seed * 97 + c.niveau), r2 = rng(seed * 97 + c.niveau), m = maquette(r1);
      const n = kind === "double" ? 4 : L.n, a = m.genBuoys(kind, n, L.max), b = genBuoys(kind, n, L.max, r2);
      assert.deepEqual(b, a, `niveau ${c.niveau} (${kind}), graine ${seed}`);
      Object.assign(m.G, { grade: c.niveau, buoys: a, kindUsed: kind, lastV: seed % 3 ? null : a[0] + 1, row1: a });
      const va = m.pickNumber(), vb = pickNumber(b, kind, L, r2, { lastV: m.G.lastV, row1: b });
      assert.equal(vb, va, `nombre, niveau ${c.niveau}, graine ${seed}`);
      if (kind === "double") assert.deepEqual(tensWindow(vb, r2), m.tensWindow(va));
    }
  }
});

test("le nombre respecte la place voulue par le niveau, la rangée des dizaines l'encadre", () => {
  const R = rng(5);
  for (const c of M4.niveaux) for (let i = 0; i < 200; i++) {
    const L = lv(c), kind = L.kind === "alt" ? (i % 2 ? "ten" : "hundred") : L.kind, b = genBuoys(kind, kind === "double" ? 4 : L.n, L.max, R), v = pickNumber(b, kind, L, R, { row1: b });
    assert.ok(v >= 1 && v <= (L.max === 100 ? 99 : 999), `${v}`);
    assert.ok(!b.includes(v));
    const k = passage(b, v), d = Math.min(k > 0 ? v - b[k - 1] : Infinity, k < b.length ? b[k] - v : Infinity);
    if (L.mode === "far" && candidates(b, kind, k, L).length) assert.ok(d >= L.farD, `niveau ${c.niveau} : ${v} entre ${b}`);
    if (kind === "double") { assert.ok(v > b[0] && v < b[3] && v % 10 !== 0); const t = tensWindow(v, R); assert.ok(t[0] < v && v < t[4] && t.every((x, j) => x === t[0] + 10 * j)); }
    if (kind === "odd") assert.ok(b.every((x) => x % 10 !== 0));
  }
});

test("le bon passage, les erreurs V1 et V2, ce que la voix explique", () => {
  const b = [40, 50, 60];
  assert.equal(passage(b, 47), 1); assert.equal(passage(b, 12), 0); assert.equal(passage(b, 75), 3);
  assert.equal(codeErreur(0, 1), "V1"); assert.equal(codeErreur(3, 1), "V2"); assert.equal(codeErreur(2, 0), "V2");
  // passage trop à gauche : plus grand que la bouée de droite du passage choisi ; trop à droite : plus petit que celle de gauche
  assert.deepEqual(explication(b, 0, 47), { cle: "plusGrand", b: 40, bouee: 0 });
  assert.deepEqual(explication(b, 3, 47), { cle: "plusPetit", b: 60, bouee: 2 });
  assert.deepEqual(explication(b, 2, 47), { cle: "plusPetit", b: 50, bouee: 1 });
  assert.equal(explication(b, 1, 47), null);
  // une bouée qui n'est pas ronde : « cette bouée » (elle s'allume)
  assert.deepEqual(explication([23, 28, 34], 0, 31), { cle: "plusGrandBouee", b: 23, bouee: 0 });
  // entre deux dizaines ou deux centaines voisines : « C'est entre 40 et 50 ! »
  assert.deepEqual(entre(b, 1), [40, 50]); assert.equal(entre(b, 0), null); assert.equal(entre([23, 28, 34], 1), null);
  assert.deepEqual(entre([300, 400, 500], 2), [400, 500]); assert.equal(entre([240, 250, 350], 2), null);
  assert.deepEqual(pourquoi(b, 47), { cle: "entre", a: 40, b: 50, bouee: null });
  assert.deepEqual(pourquoi(b, 12), { cle: "plusPetit", b: 40, bouee: 0 });
  assert.deepEqual(pourquoi(b, 75), { cle: "plusGrand", b: 60, bouee: 2 });
  assert.deepEqual(pourquoi([412, 417, 425, 431], 426), { cle: "plusGrandBouee", b: 425, bouee: 2 });
  assert.equal(passageTexte(b, 0), "avant 40"); assert.equal(passageTexte(b, 2), "entre 50 et 60"); assert.equal(passageTexte(b, 3), "après 60");
  assert.equal(voiliersQuestion({ num: 47, bouees: b }), "47 entre 40 · 50 · 60");
});

test("la mer selon le cran : départ, montée après 3 réussites de suite, descente après 2 échecs", () => {
  const M = M4.mer;
  assert.deepEqual(["facile", "conseille", "dur", "tresdur"].map((c) => merDepart(M, c)), ["calme", "calme", "vent", "pirates"]);
  let e = { mer: "calme", gains: 0, echecs: 0 };
  for (const r of ["ok", "ok"]) { e = merApres(M, "conseille", e, r); assert.equal(e.mer, "calme"); }
  e = merApres(M, "conseille", e, "ok"); assert.equal(e.mer, "vent"); assert.equal(e.annonce, "vent");
  e = merApres(M, "conseille", e, "ok"); e = merApres(M, "conseille", e, "ok"); e = merApres(M, "conseille", e, "ok"); assert.equal(e.mer, "vent"); // le cran conseillé ne va pas jusqu'aux pirates
  e = merApres(M, "conseille", e, "echec"); assert.equal(e.mer, "vent");
  e = merApres(M, "conseille", e, "demi"); assert.equal(e.mer, "vent"); // une rangée sur deux : ni l'un ni l'autre
  e = merApres(M, "conseille", e, "echec"); assert.equal(e.mer, "calme"); assert.equal(e.annonce, "calme");
  // « de suite » : un échec remet le compte des réussites à zéro
  e = { mer: "vent", gains: 0, echecs: 0 };
  for (const r of ["ok", "ok", "echec", "ok", "ok"]) e = merApres(M, "dur", e, r);
  assert.equal(e.mer, "vent"); e = merApres(M, "dur", e, "ok"); assert.equal(e.mer, "pirates"); assert.equal(e.annonce, "pirates");
  e = merApres(M, "dur", e, "echec"); e = merApres(M, "dur", e, "echec"); assert.equal(e.mer, "vent"); assert.equal(e.annonce, "ventRetour");
  // « plus facile » : calme toute la partie ; « très dur » : les pirates toute la partie
  e = { mer: "calme", gains: 0, echecs: 0 }; for (let i = 0; i < 9; i++) e = merApres(M, "facile", e, "ok"); assert.equal(e.mer, "calme");
  e = { mer: "pirates", gains: 0, echecs: 0 }; for (let i = 0; i < 9; i++) e = merApres(M, "tresdur", e, "echec"); assert.equal(e.mer, "pirates");
  // le cran redescend en cours de partie (protection) : la mer la plus forte que connaît le nouveau cran
  assert.equal(merDuCran(M, "conseille", "pirates"), "vent"); assert.equal(merDuCran(M, "dur", "calme"), "vent"); assert.equal(merDuCran(M, "facile", "vent"), "calme");
  assert.equal(annonce("vent", "vent"), null);
});

// le bateau suivant, après l'exemple guidé s'il y en a un (le bateau va seul : rien à répondre)
const bateau = async (r) => { let x = r.next(); while (x?.q.guide) { await r.record({ q: x.q, ok: true, ms: 0 }, x.cfg); x = r.next(); } return x; };
const runner = async (o = {}) => new Module4Runner({ store: await Store.open(new IDBFactory()), content: M4, rnd: rng(o.seed ?? 3), variete: seance.variete, ...o }).load();

test("déroulement : exemple guidé du niveau, étoiles, nombre manqué qui revient avec ses bouées", async () => {
  const r = await runner();
  assert.equal(r.niveau, 1); assert.ok(r.exempleDu);
  const g = r.next({ guide: true }).q;
  assert.deepEqual([g.num, g.bouees, g.k, g.guide], [36, [30, 40, 50], 1, true]);
  assert.equal((await r.record({ q: g, ok: true, ms: 0 }, r.cfg())).etoiles, 0);
  assert.equal(r.exempleDu, false);
  const a = r.next().q;
  assert.equal(a.premier, false); assert.equal(a.mer, "calme"); assert.equal(a.bouees.length, 3);
  assert.equal((await r.record({ q: a, ok: true, ms: 3000 }, r.cfg())).etoiles, 1);
  // rangé au deuxième essai : erreur corrigée, une étoile, ne revient pas
  const b = r.next().q;
  assert.equal((await r.record({ q: b, ok: false, corrigee: true, code: "V1", ms: 3000 }, r.cfg())).etoiles, 1);
  // manqué : revient 3 à 5 bateaux plus loin, avec ses bouées
  const c = r.next().q;
  assert.equal((await r.record({ q: c, ok: false, code: "V2", ms: 3000 }, r.cfg())).etoiles, 0);
  let back = null;
  for (let i = 0; i < 6 && !back; i++) { const x = r.next().q; if (x.revient) back = { x, i }; else await r.record({ q: x, ok: true, ms: 3000 }, r.cfg()); }
  assert.ok(back && back.i >= 2 && back.i <= 4, `revient au bateau ${back?.i}`);
  assert.equal(back.x.num, c.num); assert.deepEqual(back.x.bouees, c.bouees);
  assert.equal((await r.record({ q: back.x, ok: true, ms: 3000 }, r.cfg())).etoiles, 2);
  const rep = await r.store.all("reponses");
  assert.equal(rep.length, 5 + back.i); assert.equal(rep[0].forme, "exemple"); assert.equal(rep[0].question, "36 entre 30 · 40 · 50");
  assert.ok(rep.every((x) => x.module === 4)); assert.equal(rep.find((x) => x.erreur === "V2").juste, false);
});

test("déroulement : la mer change après 3 réussites et l'annonce vient au bateau suivant ; la rangée change tous les 5 bateaux", async () => {
  const r = await runner({ cran: () => "conseille" });
  const vus = [];
  for (let i = 0; i < 4; i++) { const q = (await bateau(r)).q; vus.push(q); await r.record({ q, ok: true, ms: 2000 }, r.cfg()); }
  assert.deepEqual(vus.map((q) => q.mer), ["calme", "calme", "calme", "vent"]);
  assert.deepEqual(vus.map((q) => q.annonce ?? null), [null, null, null, "vent"]);
  const q5 = (await bateau(r)).q, q6 = (await bateau(r)).q;
  assert.deepEqual(vus[0].bouees, q5.bouees); assert.notDeepEqual(q5.bouees, q6.bouees);
  // un cran agité dès le départ : annoncé au premier bateau
  const d = await runner({ cran: () => "tresdur" });
  const p = (await bateau(d)).q; assert.equal(p.mer, "pirates"); assert.equal(p.annonce, "pirates"); // (après l'exemple guidé, qui a eu la consigne)
});

test("déroulement : montée de niveau (voie rapide), « plus facile » ne fait pas monter, double encadrement au niveau 9", async () => {
  const r = await runner();
  for (let i = 0; i < 5; i++) { const q = (await bateau(r)).q; await r.record({ q, ok: true, ms: 3000 }, r.cfg()); }
  assert.equal(r.st.niveau, 2); assert.ok(r.exempleDu);
  const f = await runner({ cran: () => "facile" });
  for (let i = 0; i < 12; i++) { const q = (await bateau(f)).q; await f.record({ q, ok: true, ms: 3000 }, f.cfg()); }
  assert.equal(f.st.niveau, 1);
  const d = await runner({ choix: 9 });
  for (let i = 0; i < 20; i++) {
    const q = (await bateau(d)).q;
    assert.ok(q.double); assert.equal(q.bouees.length, 4); assert.equal(q.rangee2.length, 5);
    assert.ok(q.k >= 1 && q.k <= 3 && q.k2 >= 1 && q.k2 <= 4); assert.equal(q.k2, passage(q.rangee2, q.num));
    await d.record({ q, ok: i % 2 === 0, demi: i % 2 === 1, corrigee: i % 2 === 1, code: i % 2 ? "V3" : null, ms: 3000 }, d.cfg());
  }
  // un niveau choisi au-dessus du conseillé et réussi est validé : le conseillé passe au suivant
  const u = await runner({ choix: 4 });
  for (let i = 0; i < 5; i++) { const q = (await bateau(u)).q; await u.record({ q, ok: true, ms: 3000 }, u.cfg()); }
  assert.equal(u.st.niveau, 5);
});

test("la réponse qui varie : le passage visé change, jamais 3 fois de suite le même, aucune suite prévisible", async () => {
  for (const niveau of [1, 2, 3, 4, 5, 6, 7, 8, 9]) for (const seed of [1, 2, 3]) {
    const r = await runner({ choix: niveau, seed }), seq = [];
    for (let i = 0; i < 30; i++) { const x = await bateau(r); if (!x) break; seq.push(r.cand(x.q)); await r.record({ q: x.q, ok: (i * 7 + seed) % 5 !== 0, ms: 3000 }, r.cfg()); }
    const passages = niveau === 9 ? 5 : M4.niveaux[niveau - 1].bouees + 1;
    assert.deepEqual(checkSequence(seq, { ...seance.variete, valeursMin: Math.min(seance.variete.valeursMin, passages) }), [], `niveau ${niveau}, graine ${seed}`);
  }
});

test("la qualité de la mer suit le temps d'image ; la bulle écrit le nombre du bateau en lettres", () => {
  const n = (ms, k) => Array(k).fill(ms);
  assert.equal(qualiteSuivante(1, n(25, 12), 3500), 0); // trop lent : un cran de moins
  assert.equal(qualiteSuivante(1, n(1000, 12), 3500), 0); // très lent (une tablette sans carte graphique) : aussi
  assert.equal(qualiteSuivante(0, n(1000, 12), 3500), 0); // déjà au plus bas
  assert.equal(qualiteSuivante(1, n(25, 8), 3500), 1); // trop tôt pour juger
  assert.equal(qualiteSuivante(1, n(25, 12), 1000), 1);
  assert.equal(qualiteSuivante(1, n(10, 12), 5000), 1); // fluide, mais pas encore assez d'images pour remonter
  assert.equal(qualiteSuivante(1, n(10, 40), 5000), 2); // fluide : un cran de plus
  assert.equal(qualiteSuivante(2, n(10, 40), 5000), 2);
  assert.equal(qualiteSuivante(1, n(17, 40), 5000), 1); // entre les deux : rien ne change
  assert.equal(bulleNombre("Les bouées sont rangées du plus petit au plus grand. Fais passer chaque bateau par le bon passage. 347"), "Les bouées sont rangées du plus petit au plus grand. Fais passer chaque bateau par le bon passage. 347 « trois-cent-quarante-sept »");
  assert.equal(bulleNombre("71"), "71 « soixante-et-onze »");
  assert.equal(bulleNombre("Il est plus grand que 40 : il passe après."), "Il est plus grand que 40 : il passe après.");
});
