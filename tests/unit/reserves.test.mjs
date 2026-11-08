// LES RÉSERVES D'ÉTOILES ET LES ÉTOILES ARC-EN-CIEL (lot « Réserves d'étoiles et étoiles arc-en-ciel », docs/LOTS.md, fiche 17 ;
// décisions du parent du 2 novembre 2026 ; docs/maquettes/reserves/README.md) : la règle de réserve (une étoile arc-en-ciel gardée
// par zone encore fermée : l'ouverture d'une zone n'est jamais retardée), faire briller avec une étoile arc-en-ciel (une, commune ou
// rare ; jamais à moitié ni deux fois), le changement de prix annoncé une fois, les phrases des réserves et de la boutique selon
// l'état, les sauvegardes d'avant le lot.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { Store } from "../../app/js/engine/store.js";
import { rng } from "../../app/js/engine/ocean.js";
import { arcLibres, auNiveau, dateOf, Rewards, zonesFermees } from "../../app/js/session/rewards.js";
import { etatReserves, texteReserve } from "../../app/js/session/reserves.js";
import { placeConfirmation, texteTuile } from "../../app/js/session/boutique.js";
import { inventaire } from "../../tools/voix/inventaire.mjs";
import { sentences } from "../../app/js/engine/phrases.js";

const load = (f) => JSON.parse(readFileSync(new URL(`../../app/content/${f}`, import.meta.url)));
const cartes = load("cartes.json"), cal = load("calendrier.json"), T = load("textes.json");
const at = (s, h = 18) => dateOf(s) + h * 3600000;
const byZone = (z) => cartes.cartes.filter((c) => c.zone === z && c.rarete !== "legendaire");
const own = (list) => Object.fromEntries(list.map((c) => [c.id, { n: 1, premiere: 0, brillante: false }]));
const carte = (id) => cartes.cartes.find((c) => c.id === id);
const allReady = { ...cartes, cartes: cartes.cartes.map((c) => ({ ...c, illustration: c.illustration ?? `fictif/${c.id}.webp`, anecdote: c.anecdote ?? "Anecdote fictive." })) };
const fresh = async (content = cartes) => { const store = await Store.open(new IDBFactory()); return { store, rw: await new Rewards(store, content, cal).load(at("2026-09-28")) }; };
const B = auNiveau(cartes.boutique);

test("la règle de réserve : une étoile arc-en-ciel gardée par zone encore fermée", () => {
  assert.equal(zonesFermees(cartes, ["lagon"]), 3); assert.equal(zonesFermees(cartes, ["lagon", "corail", "large", "abysses"]), 0);
  assert.deepEqual([0, 1, 3, 4, 7].map((n) => arcLibres(n, 3)), [0, 0, 0, 1, 4]);
  assert.equal(arcLibres(2, 0), 2);
});

test("la règle garantit qu'aucune ouverture de zone n'est retardée (comparée à une enfant qui ne fait jamais briller)", () => {
  // des suites au hasard de gains, d'essais de faire briller et d'ouvertures de zone : avec la règle, la réserve R′ vaut toujours au
  // moins le plus petit de R (sans jamais faire briller) et du nombre de zones fermées ; donc, quand une zone peut s'ouvrir, R ≥ 1
  // entraîne R′ ≥ 1
  const r = rng(7);
  for (let essai = 0; essai < 400; essai++) {
    let R = 0, Rp = 0, Z = 3;
    for (let pas = 0; pas < 120; pas++) {
      const x = r();
      if (x < 0.35) { R++; Rp++; } else if (x < 0.8) { if (arcLibres(Rp, Z) >= 1) Rp--; } else if (Z > 0) {
        // une zone devient prête à s'ouvrir
        if (R >= 1) { assert.ok(Rp >= 1, `R=${R} R′=${Rp} Z=${Z}`); R--; Rp--; Z--; } else assert.equal(Rp, 0);
      }
      assert.ok(Rp >= Math.min(R, Z), `invariant : R=${R} R′=${Rp} Z=${Z}`);
    }
  }
});

test("faire briller avec une étoile arc-en-ciel : une étoile, commune ou rare ; jamais une étoile gardée ; enregistré une fois", async () => {
  const { rw, store } = await fresh(), now = at("2026-11-30"), L = byZone("lagon"), rare = L.find((c) => c.rarete === "rare"), commune = L.find((c) => c.rarete === "commune");
  rw.owned = own([rare, commune]);
  // 3 zones fermées : 3 étoiles gardées
  await rw.special("arcEnCiel", 3);
  assert.equal(rw.arcPourBriller, 0); assert.equal(rw.acheter(rare.id, now, Math.random, { arc: true }), null);
  await rw.special("arcEnCiel", 2);
  assert.equal(rw.arcPourBriller, 2);
  const total = rw.total, g = rw.acheter(rare.id, now, Math.random, { arc: true });
  assert.deepEqual([g.arc, g.prix, g.briller, g.brillante], [true, 0, true, true]);
  // (un second toucher très rapide : rien)
  assert.equal(rw.acheter(rare.id, now, Math.random, { arc: true }), null);
  await g.ecrit;
  assert.equal(rw.total, total); assert.equal(rw.arcDispo, 4); assert.equal(rw.arcPourBriller, 1); assert.equal(rw.owned[rare.id].brillante, true);
  assert.deepEqual(rw.achats.liste.at(-1), { t: now, carte: rare.id, prix: 0, briller: true, brillante: true, arc: true });
  const g2 = rw.acheter(commune.id, now, Math.random, { arc: true }); await g2.ecrit;
  assert.equal(rw.arcPourBriller, 0); assert.equal(rw.arcDispo, 3);
  // relu de la base : le compte est juste
  const st = await store.get("recompenses", "etoiles"); assert.deepEqual([st.arcEnCiel, st.arcDepensees, st.arcBrillees], [5, 0, 2]);
  // une créature à vendre, une légendaire, une brillante : jamais avec une étoile arc-en-ciel
  await rw.special("arcEnCiel", 3);
  const vendre = L.find((c) => !rw.owned[c.id]);
  assert.equal(rw.acheter(vendre.id, now, Math.random, { arc: true, vitrine: new Map([[vendre.id, "vendre"]]) }), null);
  assert.equal(rw.acheter(rare.id, now, Math.random, { arc: true }), null);
});

test("une zone s'ouvre avec l'étoile gardée, puis une étoile de moins est gardée", async () => {
  const { rw } = await fresh(allReady), now = at("2026-12-07");
  rw.owned = own(byZone("lagon")); await rw.special("arcEnCiel", 3);
  assert.equal(rw.arcPourBriller, 0);
  const z = await rw.openZone(now, () => 0); assert.equal(z.zone.id, "corail");
  assert.deepEqual([rw.arcDispo, rw.fermees, rw.arcPourBriller], [2, 2, 0]);
  await rw.special("arcEnCiel"); assert.equal(rw.arcPourBriller, 1);
});

test("un achat possible compte faire briller avec une étoile arc-en-ciel", async () => {
  const { rw } = await fresh(), now = at("2026-11-30");
  rw.owned = own(byZone("lagon")); await rw.setMode("libre");
  assert.equal(rw.peutAcheter(now), false);
  await rw.special("arcEnCiel", 3); assert.equal(rw.peutAcheter(now), false, "toutes gardées");
  await rw.special("arcEnCiel"); assert.equal(rw.peutAcheter(now), true);
});

test("le changement de prix est annoncé une seule fois, à la visite qui suit ; rien pour une sauvegarde d'avant le lot", async () => {
  const { rw, store } = await fresh();
  assert.equal(await rw.prixAnnonce(), false);
  await rw.setPrix("2"); assert.equal(await rw.prixAnnonce(), false, "le même niveau : rien");
  await rw.setPrix("3");
  const relu = await new Rewards(store, cartes, cal).load(at("2026-10-01"));
  assert.equal(await relu.prixAnnonce(), true); assert.equal(await relu.prixAnnonce(), false);
  const relu2 = await new Rewards(store, cartes, cal).load(at("2026-10-02")); assert.equal(await relu2.prixAnnonce(), false);
});

test("une sauvegarde d'avant le lot (sans arcBrillees) garde sa réserve", async () => {
  const store = await Store.open(new IDBFactory());
  await store.put("recompenses", { id: "etoiles", total: 120, cumul: 400, dorees: 2, doreesDepensees: 0, arcEnCiel: 9, arcDepensees: 1, arcLibre: 0, coquillages: 3, coquillagesDores: 0 });
  const rw = await new Rewards(store, cartes, cal).load(at("2026-11-02"));
  assert.deepEqual([rw.arcDispo, rw.doreesDispo, rw.total], [8, 2, 120]);
});

test("ce que dit la mascotte quand on touche une réserve, selon l'état", async () => {
  const X = T.reserves, t = (s, e) => texteReserve(T, cartes, s, e);
  assert.equal(t("arc", { n: 4, fermees: 3, zonePrete: false }), "Tu as 4 étoiles arc-en-ciel. Elles ouvrent les nouvelles zones du récif, et font briller tes créatures.");
  assert.equal(t("arc", { n: 1, fermees: 3, zonePrete: false }), `${X.arcUne} ${X.arcProchaineZone}`);
  assert.equal(t("arc", { n: 2, fermees: 2, zonePrete: false }), `Tu as 2 étoiles arc-en-ciel. ${X.arcProchainesZones}`);
  assert.equal(t("arc", { n: 1, fermees: 0, zonePrete: false }), `${X.arcUne} ${X.arcBrillerUne}`);
  assert.equal(t("arc", { n: 51, fermees: 0, zonePrete: false }), `${X.arcBeaucoup} ${X.arcBriller}`);
  assert.equal(t("arc", { n: 2, fermees: 2, zonePrete: true }), `Tu as 2 étoiles arc-en-ciel. ${X.arcProchainesZones} ${T.boutique.zoneBientot}`);
  // (lot « Suites des correctifs du 5 novembre », décisions du parent du 6 novembre 2026) à 0 : la prochaine zone et les étoiles
  // arc-en-ciel nommées (la phrase de l'album), puis la phrase du diamant à 0, sans règle exacte ; aucune phrase nouvelle
  const corail = cartes.zones.find((z) => z.id === "corail"), large = cartes.zones.find((z) => z.id === "large");
  assert.equal(t("arc", { n: 0, fermees: 3, zonePrete: false, prochaine: corail }), "Le récif de corail s'ouvrira un jour, grâce à tes étoiles arc-en-ciel. Viens jouer souvent : tu en gagneras une !");
  // (lot « Nouveaux boutons… », décision du parent du 7 novembre 2026) toutes les zones ouvertes, à 0
  assert.equal(t("arc", { n: 0, fermees: 0, zonePrete: false, prochaine: null }), `${X.arcZero} ${X.diamantGagner}`);
  assert.equal(X.arcZero, "Tu n'as pas encore d'étoile arc-en-ciel.");
  assert.equal(t("arc", { n: 0, fermees: 2, zonePrete: true, prochaine: large }), `${large.fermeeLu} ${X.diamantGagner} ${T.boutique.zoneBientot}`);
  assert.equal(X.diamantGagner, "Viens jouer souvent : tu en gagneras une !");
  const inv0 = inventaire();
  for (const z of [...cartes.zones.filter((z) => !z.ouverte), null]) for (const p of [false, true]) for (const ph of sentences(t("arc", { n: 0, fermees: z ? 1 : 0, zonePrete: p, prochaine: z }))) assert.ok(inv0.has(ph), ph);
  const abysses = cartes.zones.find((z) => z.id === "abysses");
  assert.equal(t("diamant", { n: 2, maintenant: false, zone: large }), "Tu as 2 étoiles de diamant. Elles t'offriront les créatures légendaires, quand tu auras toutes les créatures du grand large.");
  assert.equal(t("diamant", { n: 1, maintenant: false, zone: abysses }), `${X.diamantUne} Elle t'offrira une créature légendaire, quand tu auras toutes les créatures des abysses.`);
  assert.equal(t("diamant", { n: 3, maintenant: true, zone: large }), `Tu as 3 étoiles de diamant. ${X.diamantMaintenant}`);
  assert.equal(t("diamant", { n: 3, maintenant: false, zone: null }), `Tu as 3 étoiles de diamant. ${X.diamantTout}`);
  assert.equal(t("diamant", { n: 16, maintenant: false, zone: null }), `${X.diamantBeaucoup} ${X.diamantTout}`);
  // l'état, d'après la sauvegarde
  const { rw } = await fresh(allReady); rw.owned = own(byZone("lagon"));
  const e = etatReserves(rw, { arc: 2, diamant: 1 });
  assert.deepEqual(e.arc, { n: 2, fermees: 3, zonePrete: true, prochaine: corail }); assert.equal(e.diamant.zone.id, "large"); assert.equal(e.diamant.maintenant, false);
});

test("chaque phrase des réserves, jusqu'aux nombres dits, est dans l'inventaire de la voix", () => {
  const inv = inventaire(), X = T.reserves, M = cartes.reserves;
  const toutes = [X.arcUne, X.arcBeaucoup, X.diamantUne, X.diamantBeaucoup, X.arcZonesEtBriller, X.arcProchaineZone, X.arcProchainesZones, X.arcBrillerUne, X.arcBriller, X.arcZero, X.diamantMaintenant, X.diamantTout,
    ...Array.from({ length: M.arcDitMax - 1 }, (_, i) => `Tu as ${i + 2} étoiles arc-en-ciel.`), ...Array.from({ length: M.diamantDitMax - 1 }, (_, i) => `Tu as ${i + 2} étoiles de diamant.`),
    ...["du grand large", "des abysses"].flatMap((z) => [X.diamantQuandUne, X.diamantQuand].map((g) => g.replace("{zone}", z))), T.boutique.prixChanges];
  for (const p of toutes) assert.ok(inv.has(p), p);
  assert.equal(M.arcDitMax, 50); assert.equal(M.diamantDitMax, 15);
});

test("la boutique, une créature du récif : les phrases courtes, avec et sans étoile arc-en-ciel", () => {
  const crabe = carte("crabe"), crevette = carte("crevette"), B2 = T.boutique, t = (c, total, arc) => texteTuile(T, cartes, c, "terne", 150, total, arc);
  assert.equal(t(crabe, 260, { dispo: 4, libres: 1 }), "C'est le crabe ! Il est déjà dans ton récif. Pour le faire briller : 150 étoiles, ou une étoile arc-en-ciel. Touche la coche de l'étoile que tu veux donner.");
  // (relecture du lot, constat 3 : sans assez d'étoiles de mer, seule l'étoile arc-en-ciel est dite)
  assert.equal(t(crabe, 60, { dispo: 4, libres: 1 }), `C'est le crabe ! Il est déjà dans ton récif. Pour le faire briller : une étoile arc-en-ciel. ${B2.daccord}`);
  assert.equal(t(crevette, 260, { dispo: 2, libres: 0 }), "C'est la crevette ! Elle est déjà dans ton récif. Pour la faire briller : 150 étoiles. Tes étoiles arc-en-ciel sont gardées pour les nouvelles zones. Si tu es d'accord, touche la coche verte.");
  assert.equal(t(crevette, 58, { dispo: 1, libres: 0 }), `C'est la crevette ! Elle est déjà dans ton récif. Pour la faire briller : 150 étoiles. ${B2.arcGardeeUne} Il te manque 92 étoiles.`);
  assert.equal(t(crabe, 260, { dispo: 0, libres: 0 }), `C'est le crabe ! Il est déjà dans ton récif. Pour le faire briller : 150 étoiles. ${B2.daccord}`);
  // chaque créature a son genre ; chaque phrase, à chaque niveau de prix, est dans l'inventaire
  assert.ok(cartes.cartes.every((c) => c.genre === "m" || c.genre === "f"));
  const inv = inventaire();
  for (const n of cartes.boutique.niveauxPrix) for (const c of [crabe, crevette, carte("hippocampe"), carte("raie-pastenague")]) for (const arc of [{ dispo: 0, libres: 0 }, { dispo: 4, libres: 1 }, { dispo: 1, libres: 0 }]) {
    for (const total of [0, 10000]) for (const s of sentences(texteTuile(T, cartes, c, "terne", n.briller[c.rarete], total, arc))) if (!s.startsWith("C'est ")) assert.ok(inv.has(s), s);
  }
});

test("la rangée de coches se pose à côté du départ de la bulle (le milieu du bas de la tuile), dans l'écran", () => {
  const r = [716, 150, 886, 346], p = placeConfirmation(r, 3);
  assert.ok(p.x >= (r[0] + r[2]) / 2 + 10, "à droite du milieu"); assert.equal(p.y, 348);
  const droite = placeConfirmation([1092, 150, 1262, 346], 3);
  assert.ok(droite.x + 3 * 88 + 2 * 18 <= (1092 + 1262) / 2 - 10, "à gauche du milieu, près du bord droit");
  assert.ok(placeConfirmation([340, 570, 510, 766], 2).y < 570, "au-dessus pour la dernière rangée");
});

test("B, le niveau par défaut, garde ses prix (la règle de réserve ne change rien aux prix)", () => {
  assert.deepEqual([B.briller.commune, B.briller.rare], [150, 300]);
});

// (lot « Correctifs du 5 novembre », décision du parent du 5 novembre 2026) LA RANGÉE DES COMPTEURS : une seule ligne, chaque étoile à
// gauche de son nombre, même taille et même hauteur ; entre la frise et le bord droit. (Lot « Suites des correctifs du 5 novembre »,
// décision du parent du 6 novembre 2026 : les trois compteurs toujours visibles, la réserve arc-en-ciel montrée à 0 comme le diamant)
test("la rangée des compteurs : une ligne, l'étoile à gauche de son nombre, même taille, les trois montrés même à 0, cibles de 64 px", async () => {
  const { rangeeCompteurs, RANGEE } = await import("../../app/js/session/screens.js");
  const { reservesMontrees } = await import("../../app/js/session/reserves.js");
  assert.deepEqual(reservesMontrees({ arc: 0, diamant: 0 }), ["arc", "diamant"]);
  assert.deepEqual(reservesMontrees({ arc: 3, diamant: 0 }), ["arc", "diamant"]);
  assert.deepEqual(reservesMontrees({ arc: 0, diamant: 2 }), ["arc", "diamant"]);
  for (const [mer, arc, diamant] of [["0", "0", "0"], ["0", "1", "0"], ["123", "2", "0"], ["999", "44", "3"], ["1234", "50", "15"], ["12345", "50", "15"]]) {
    const { k, boites } = rangeeCompteurs([{ id: "mer", texte: mer }, { id: "arc", texte: arc }, { id: "diamant", texte: diamant }]);
    const B = ["mer", "arc", "diamant"].map((id) => boites[id]);
    assert.ok(B[0].x >= RANGEE.gauche - 1 && B[2].x + B[2].w <= RANGEE.droite + 1, `${mer} : dans sa place (${B[0].x} à ${B[2].x + B[2].w})`);
    for (let i = 1; i < 3; i++) assert.ok(B[i].x >= B[i - 1].x + B[i - 1].w, "sans se chevaucher, de gauche à droite");
    assert.ok(B.every((b) => b.w >= 64), "cibles d'au moins 64 px");
    assert.equal(new Set(B.map((b) => b.etoile[1])).size, 1, "les trois étoiles à la même hauteur");
    assert.equal(new Set(B.map((b) => b.dansBoite.d)).size, 1, "à la même taille");
    assert.equal(new Set(B.map((b) => b.dansBoite.chiffre[2])).size, 1, "les nombres à la même taille");
    for (const b of B) assert.ok(b.dansBoite.etoile[0] + b.dansBoite.d / 2 <= b.dansBoite.chiffre[0], "l'étoile à gauche de son nombre");
    if (mer.length <= 3 && arc.length === 1 && diamant.length === 1) assert.equal(k, 1, "pas réduite quand elle tient (le cas courant)");
  }
});
