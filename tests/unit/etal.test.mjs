// LOT « L'ÉTAL DU PÊCHEUR » (docs/SPEC.md, section 7 quater) : les règles du module 6 (modules/etal/etal.js, runner.js).
//  - le tirage des portefeuilles : le compte juste existe toujours aux niveaux « payer » et « deux », d'une ou deux façons au
//    niveau 5, jamais au niveau 6 (où un paiement sans pièce de trop existe toujours) ; jamais plus que totalMax ;
//  - la validation : compte juste exigé quand il est possible ; « aucune pièce de trop » sinon ; les codes M1 à M7 ;
//  - ce que le pêcheur rend (trop, pièce de trop, monnaie), une bonne façon de payer, le compte ;
//  - les prix tirés : tous ont leur phrase (l'inventaire de la voix) ;
//  - le déroulement : niveaux, leçons d'entrée, exemple guidé, réponse qui varie, étoiles, retours.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { compteJuste, comptes, compteDit, enTrop, facons, juger, jugerRendu, montantDit, montantEcrit, prixPossibles, PRODUITS, rendu, sansPieceDeTrop, solution, tirerPortefeuille } from "../../app/js/modules/etal/etal.js";
import { etalQuestion, Module6Runner, soucoupeTexte } from "../../app/js/modules/etal/runner.js";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";

const read = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), "utf8"));
const M6 = read("app/content/module6.json"), T = read("app/content/textes.json"), seance = read("app/content/seance.json");
const N = (n) => M6.niveaux[n - 1];
const somme = (xs) => xs.reduce((a, b) => a + b, 0);

test("les montants dits et écrits", () => {
  assert.equal(montantDit(T, 300), "3 euros."); assert.equal(montantDit(T, 100), "1 euro."); assert.equal(montantDit(T, 350), "3 euros 50.");
  assert.equal(montantDit(T, 120), "1 euro 20."); assert.equal(montantDit(T, 50), "50 centimes."); assert.equal(montantDit(T, 1270), "12 euros 70.");
  assert.equal(montantEcrit(250), "2,50 €"); assert.equal(montantEcrit(30), "0,30 €"); assert.equal(montantEcrit(1700), "17 €");
  assert.equal(compteDit(T, 1300), "13"); assert.equal(compteDit(T, 1300, true), "13 euros."); assert.equal(compteDit(T, 250), "2 euros 50.");
});

test("les prix des niveaux : la fourchette, le haut de la fourchette aux crans « plus dur » et « très dur »", () => {
  assert.deepEqual(prixPossibles(N(2)), [200, 300, 400, 500, 600, 700, 800, 900, 1000]);
  // (la moitié haute, au moins six prix : relecture du lot, la réponse qui varie)
  assert.deepEqual(prixPossibles(N(2), M6.crans.dur), [500, 600, 700, 800, 900, 1000]);
  assert.deepEqual(prixPossibles(N(3), M6.crans.dur), [1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000]);
  assert.equal(prixPossibles(N(9)).length, 18); assert.equal(prixPossibles(N(10)).at(0), 30); assert.equal(prixPossibles(N(10)).at(-1), 1000);
  assert.deepEqual(prixPossibles(N(1)), []);
});

test("le tirage des portefeuilles : compte juste possible, restreint, impossible ; jamais plus que totalMax", () => {
  const R = rng(7);
  for (const cfg of M6.niveaux.filter((c) => c.portefeuille)) for (const cran of ["facile", "conseille", "dur", "tresdur"]) {
    const ps = prixPossibles(cfg, M6.crans[cran]);
    for (let i = 0; i < 60; i++) {
      const prix = ps[Math.floor(R() * ps.length)], w = tirerPortefeuille(cfg, prix, R, M6.crans[cran]);
      assert.ok(w, `niveau ${cfg.niveau}, ${prix}`);
      assert.ok(somme(w) >= prix && somme(w) <= cfg.totalMax, `niveau ${cfg.niveau} : ${w}`);
      for (const v of w) assert.ok(Object.keys(cfg.portefeuille).includes(String(v)), `niveau ${cfg.niveau} : ${v}`);
      if (cfg.type === "monnaie") { assert.ok(!compteJuste(w, prix), `niveau 6 : ${prix} avec ${w}`); const s = solution(cfg, prix, w); assert.ok(s && sansPieceDeTrop(s, prix), `niveau 6 : ${prix} avec ${w}`); }
      else if (cfg.type === "restreint") { const f = facons(w, prix); assert.ok(f >= 1 && f <= 2, `niveau 5 : ${prix} avec ${w} (${f})`); assert.equal(somme(solution(cfg, prix, w)), prix); }
      else { assert.ok(compteJuste(w, prix), `niveau ${cfg.niveau} : ${prix} avec ${w}`); assert.equal(somme(solution(cfg, prix, w)), prix); }
    }
  }
  // très dur : plus de petites pièces
  const R2 = rng(3), w1 = tirerPortefeuille(N(2), 700, R2), w2 = tirerPortefeuille(N(2), 700, R2, M6.crans.tresdur);
  assert.ok(w2.filter((v) => v === 100).length >= 3 && w1.filter((v) => v === 100).length <= 3);
  // niveau 1 : un de chaque, de 1 à 50 euros
  assert.deepEqual(tirerPortefeuille(N(1), 0, R2), [5000, 2000, 1000, 500, 200, 100]);
});

test("la validation : compte juste exigé quand il est possible (M1, M2), aucune pièce de trop sinon (M1, M3), M4, M7", () => {
  assert.deepEqual(juger(N(3), { prix: 1700 }, [1000, 500, 200]), { ok: true, rendu: 0 });
  assert.equal(juger(N(3), { prix: 1700 }, [1000, 500]).code, "M1"); assert.equal(juger(N(3), { prix: 1700 }, [1000, 500]).manque, 200);
  assert.equal(juger(N(3), { prix: 1700 }, [1000, 500, 200, 100]).code, "M2");
  // le nombre au lieu de la valeur : 7 objets pour 7 euros
  assert.equal(juger(N(2), { prix: 700 }, [200, 200, 200, 100, 100, 100, 100]).code, "M4");
  assert.equal(juger(N(2), { prix: 700 }, [100, 100, 100, 100, 100, 100, 100]).ok, true);
  // niveau 6 : 13 euros avec un billet de 20 : juste ; 20 + 2 : une pièce de trop ; 10 : pas assez
  assert.deepEqual(juger(N(6), { prix: 1300 }, [2000]), { ok: true, rendu: 700 });
  assert.equal(juger(N(6), { prix: 1300 }, [2000, 200]).code, "M3");
  assert.equal(juger(N(6), { prix: 1300 }, [1000, 200]).code, "M1");
  assert.equal(juger(N(6), { prix: 1300 }, [1000, 200, 200]).ok, true);
  assert.ok(sansPieceDeTrop([1000, 200, 200], 1300) && !sansPieceDeTrop([1000, 500, 200], 1300));
  // niveau 1
  assert.equal(juger(N(1), { valeur: 1000 }, [1000]).ok, true); assert.equal(juger(N(1), { valeur: 1000 }, [2000]).code, "M7"); assert.equal(juger(N(1), { valeur: 1000 }, [1000, 100]).code, "M7");
  // niveau 7 : 13 euros payés avec 20 : 7 ; le prix rendu (M5) ; une autre erreur (M6)
  const q = { prix: 1300, billet: 2000 };
  assert.equal(jugerRendu(q, 7).ok, true); assert.equal(jugerRendu(q, 13).code, "M5"); assert.equal(jugerRendu(q, 8).code, "M6");
});

test("ce que le pêcheur rend quand il y a trop ; une bonne façon de payer ; la monnaie comptée à partir du prix", () => {
  // M2 : 17 € demandés, 10 + 5 + 2 + 1 posés : il rend 1 € (il garde 17)
  const s = [1000, 500, 200, 100];
  assert.deepEqual(enTrop(N(3), 1700, s).map((i) => s[i]), [100]);
  // M2 : 15 € demandés, 10 + 10 posés : il rend un billet de 10 (il garde le plus possible sans dépasser)
  assert.deepEqual(enTrop(N(3), 1500, [1000, 1000]).length, 1);
  // M3 : 13 € avec 20 + 2 : il rend la pièce de 2 ; avec 10 + 5 + 2 + 2 (19 €) : il rend 5 € (le plus gros d'abord), pas les deux 2
  const t = [1000, 500, 200, 200];
  assert.deepEqual(enTrop(N(6), 1300, [2000, 200]), [1]);
  assert.deepEqual(enTrop(N(6), 1300, t).map((i) => t[i]), [500]);
  // une bonne façon de payer : le moins d'objets
  assert.deepEqual(solution(N(3), 1700, [1000, 500, 500, 200, 200, 100, 100]).sort((a, b) => b - a), [1000, 500, 200]);
  assert.deepEqual(solution(N(6), 1300, [2000, 500, 500, 200, 200]).sort((a, b) => b - a), [500, 500, 200, 200]);
  assert.deepEqual(solution(N(1), 0, [], 2000), [2000]);
  // la monnaie : 7 € rendus, comptés à partir de 13 : 2 €, puis 5 € (« 13… 15… 20 »)
  assert.deepEqual(rendu(700), [200, 500]); assert.deepEqual(comptes(rendu(700), 1300), [1500, 2000]);
  assert.deepEqual(rendu(1900), [200, 200, 500, 1000]);
  assert.deepEqual(comptes([1000, 500, 100, 100]), [1000, 1500, 1600, 1700]);
});

test("tout ce que le pêcheur peut dire a sa phrase : prix, montants comptés, manques, monnaie rendue", () => {
  const inv = inventaire(), manque = [];
  const dit = (s) => { if (!inv.has(s)) manque.push(s); };
  for (const cfg of M6.niveaux) {
    for (const p of prixPossibles(cfg)) dit(montantDit(T, p));
    if (cfg.portefeuille) { const pas = cfg.niveau >= 10 ? 10 : cfg.niveau === 9 ? 50 : 100; for (let c = pas; c <= cfg.totalMax; c += pas) { dit(montantDit(T, c)); if (c % 100 === 0) dit(String(c / 100)); } }
  }
  for (const n of PRODUITS) for (const k of ["achete", "coute", "nom"]) dit(T.etalProduit[n][k]);
  for (const v of N(1).valeurs) { dit(T.etalPoser[v]); dit(T.etalCestUn[v]); dit(T.etalCestCeluiLa[v]); }
  dit(T.etalPaire); dit(T.etalPaieLesDeux);
  for (const c of [1, 2, 7, 19]) dit(String(c));
  assert.deepEqual(manque, []);
  // l'étal : moins de 600 phrases nouvelles (fiche du lot)
  const etal = [...inv.values()].filter((o) => /^etal|choixEtal|choixDescription\.etal|choixDescription\.exercices\.etal|choixNom\.etal|lecons\.L1[5-8]/.test(o));
  assert.ok(etal.length < 600, `${etal.length} phrases`);
});

const runner = async (o = {}) => new Module6Runner({ store: await Store.open(new IDBFactory()), content: M6, rnd: rng(o.seed ?? 5), variete: seance.variete, ...o }).load();

test("le déroulement : la leçon d'entrée (niveaux 1, 2, 7, 9), sinon un exemple guidé la première fois ; les questions de chaque genre", async () => {
  for (const n of [1, 2, 7, 9]) { const r = await runner({ choix: n }); assert.equal(r.entryLesson(), N(n).lecon); }
  const r3 = await runner({ choix: 3 });
  assert.equal(r3.entryLesson(), null);
  const ex = r3.next(); assert.ok(ex.q.guide, "exemple guidé au premier achat du niveau 3");
  await r3.record({ q: ex.q, ok: true, ms: 0 }, ex.cfg);
  assert.ok(!r3.next().q.guide); assert.deepEqual(r3.st.exemples, [3]);
  for (let n = 1; n <= 10; n++) {
    const r = await runner({ choix: n, seed: n }); r.st.exemples = M6.niveaux.map((c) => c.niveau);
    for (let i = 0; i < 12; i++) {
      const { q } = r.next(), cfg = N(n);
      assert.equal(q.type, cfg.type); assert.ok(etalQuestion(q).length > 3);
      if (cfg.type === "poser") assert.ok(cfg.valeurs.includes(q.valeur));
      else if (cfg.type === "rendre") { assert.ok(q.billet > q.prix && cfg.billets.includes(q.billet)); assert.equal(q.portefeuille.length, 0); }
      else { assert.ok(q.prix >= cfg.prix[0] && q.prix <= cfg.prix[1]); assert.ok(somme(q.portefeuille) >= q.prix); }
      if (cfg.type === "deux") { assert.equal(q.produits.length, 2); assert.equal(somme(q.prixProduits), q.prix); assert.ok(PRODUITS.indexOf(q.produits[0]) < PRODUITS.indexOf(q.produits[1])); }
      await r.record({ q, ok: true, ms: 8000, soucoupe: [] }, cfg);
    }
  }
});

test("la réponse qui varie : au moins 5 prix par séance, jamais trois fois de suite le même, jamais deux fois de suite le même produit", async () => {
  for (const n of [2, 3, 6, 7, 9]) {
    const r = await runner({ choix: n, seed: 11 + n }); r.st.exemples = M6.niveaux.map((c) => c.niveau);
    const rep = [], prod = [];
    for (let i = 0; i < 20; i++) { const { q, cfg } = r.next(); rep.push(r.cand(q).reponse); prod.push(q.produits?.[0]); await r.record({ q, ok: true, ms: 8000 }, cfg); }
    assert.ok(new Set(rep).size >= 5, `niveau ${n} : ${rep}`);
    for (let i = 2; i < rep.length; i++) assert.ok(!(rep[i] === rep[i - 1] && rep[i] === rep[i - 2]), `niveau ${n}`);
    for (let i = 1; i < prod.length; i++) assert.notEqual(prod[i], prod[i - 1]);
  }
});

test("les étoiles, les retours, la montée, la leçon relancée par la même erreur", async () => {
  const r = await runner({ choix: null, seed: 2 }); r.st.niveau = 3; r.st.exemples = [3];
  let x = r.next(); let o = await r.record({ q: x.q, ok: true, ms: 9000, soucoupe: [1000] }, x.cfg); assert.equal(o.etoiles, 1);
  x = r.next(); o = await r.record({ q: x.q, ok: false, corrigee: true, code: "M1", ms: 9000 }, x.cfg); assert.equal(o.etoiles, 1); assert.equal(r.replays.length, 0, "payé au deuxième essai : il ne revient pas");
  x = r.next(); o = await r.record({ q: x.q, ok: false, code: "M1", ms: 9000 }, x.cfg); assert.equal(o.etoiles, 0); assert.equal(r.replays.length, 1);
  assert.deepEqual(o.events.filter((e) => e.type === "lecon").map((e) => e.id), ["L16"], "la même erreur deux fois : la leçon L16");
  // la montée : 8 justes sur 10 au niveau conseillé ; la leçon d'entrée suit si le nouveau niveau en a une (ici, niveau 4 : non)
  const r2 = await runner({ seed: 4 }); r2.st.niveau = 3; r2.st.exemples = [3, 4];
  let up = null;
  for (let i = 0; i < 12 && !up; i++) { const y = r2.next(); const z = await r2.record({ q: y.q, ok: true, ms: 30000 }, y.cfg); up = z.events.find((e) => e.type === "montee"); }
  assert.equal(up?.a, 4); assert.equal(r2.st.niveau, 4);
  // au cran « plus facile », pas de montée
  const r3 = await runner({ seed: 6, cran: () => "facile" }); r3.st.exemples = [1, 2]; r3.st.lecons = ["L15"]; r3.played.add("L15");
  for (let i = 0; i < 12; i++) { const y = r3.next(); await r3.record({ q: y.q, ok: true, ms: 3000 }, y.cfg); }
  assert.equal(r3.st.niveau, 1);
  // ce que le parent lit
  assert.equal(soucoupeTexte([1000, 500, 200]), "10 € + 5 € + 2 € (17 €)");
  assert.equal(etalQuestion({ type: "payer", produits: ["sardines"], prix: 350 }), "sardines à 3,50 €");
});

test("relecture du lot : niveau 6, « un seul billet » au plus un achat sur trois et jamais deux fois de suite ; niveau 7, jamais la moitié du billet ; niveau 9, trois prix sur quatre avec des centimes", async () => {
  const M6c = read("app/content/module6.json");
  for (const n of [6, 7, 9]) {
    let tot = 0, seul = 0, suite = 0, moitie = 0, ronds = 0;
    for (let k = 0; k < 12; k++) {
      const r = await new Module6Runner({ store: null, content: M6c, rnd: rng(100 + k), choix: n }).load();
      r.st.exemples = [n]; let avant = false;
      for (let i = 0; i < 20; i++) {
        const x = r.next(); if (!x) break; const q = x.q; tot++;
        if (n === 6) { const s1 = solution(x.cfg, q.prix, q.portefeuille).length === 1; if (s1) seul++; if (s1 && avant) suite++; avant = s1; }
        if (n === 7 && q.billet === 2 * q.prix) moitie++;
        if (n === 9 && q.prix % 100 === 0) ronds++;
      }
    }
    if (n === 6) { assert.ok(seul <= tot / 3, `niveau 6 : ${seul} sur ${tot}`); assert.equal(suite, 0); }
    if (n === 7) assert.equal(moitie, 0);
    if (n === 9) assert.ok(ronds <= tot / 4, `niveau 9 : ${ronds} prix ronds sur ${tot}`);
  }
});
