// L'APPLICATION INSTALLÉE SE RELANCE (lot « Correctifs de l'installation et de la veille », point 1 ; docs/LOTS.md, fiche 12 ;
// passé sur le banc Android au lot « Banc Android et recette en conditions réelles », fiche 13).
// Sur la tablette, l'application installée ne se relançait plus : l'écran de lancement d'Android restait sans fin. La cause :
// le service worker cherchait chaque fichier dans le cache avec `ignoreSearch`, ce qui oblige Chrome à lire toutes les
// entrées du cache (plus de 11 800) à chaque requête. Ce parcours joue comme la tablette, sur le banc Android
// (tests/e2e/appareils.mjs : un profil de navigateur persistant, la vraie voix, la lecture automatique refusée, l'écran de
// démarrage touché pour de vrai, le processeur du profil ralenti) :
//   1. le premier lancement : le service worker met tout en cache ;
//   2. dix relances avec le réseau, puis dix sans réseau (le serveur coupé) ; une relance sur deux, le navigateur est TUÉ (le
//      processus arrêté net, comme Android ferme Chrome) au lieu d'être fermé ;
//   3. une nouvelle version publiée : dix relances pendant qu'elle s'installe (interrompue à chaque fermeture), puis qu'elle
//      prend la main ; puis une troisième version, le réseau lent, puis instable (une requête sur trois coupée) ;
//   4. le secours du service worker : ni cache ni réseau, la page de secours (« Vérifiez le Wi-Fi… ») ;
//   5. le secours de la page : un chargement bloqué, « Chargement… » puis « Toucher pour réessayer », noté au lancement suivant ;
//   6. le journal technique : les lancements et le service worker y sont notés ;
//   7. (lot « Banc Android », point 2) le stockage trop petit pour l'application entière (quota limité) : l'application le dit
//      au parent (journal technique, espace parent) et reste utilisable avec le réseau ; les données de l'enfant s'enregistrent.
// À chaque relance : le temps jusqu'à la première image (l'écran de démarrage), jusqu'à « prêt » (« Toucher pour continuer »)
// et jusqu'à l'accueil après le toucher.
//   node tests/e2e/installation.mjs [--profil s5e] [--racine dossier] [--relances 10] [--seuil 4000] [--seul 1,2,3,4,5,6,7]
//   (--racine : servir une autre copie de app/, par exemple celle de main, pour mesurer le défaut d'avant ; les étapes 4 à 7 ne
//   valent que pour le nouveau code)
// BANC ANDROID, raccourcis : sans service worker
// (raison : seule l'étape 5 bloque le service worker, pour rendre un chargement de la page impossible à finir et voir le secours
// de la page elle-même ; toutes les autres étapes jouent l'application installée.)
import { chromium } from "./navigateur.mjs";
import { Appareil, serveurBanc, CHROMIUM, optionsProfil, REFERENCE } from "./appareils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PROFIL = arg("--profil", REFERENCE), N = Number(arg("--relances", 10)), SEUIL = Number(arg("--seuil", 4000)), SEUL = arg("--seul")?.split(","), faire = (n) => !SEUL || SEUL.includes(String(n));
const ancien = args.includes("--racine");
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const OUT = `tests/e2e/out/installation/${PROFIL}`; mkdirSync(OUT, { recursive: true });
const serveur = await serveurBanc({ racine: arg("--racine", "app") });
console.log(`profil : ${PROFIL} ; racine servie : ${arg("--racine", "app")}`);
const a = new Appareil(PROFIL, { serveur, journal: console.log });
const resume = (l) => { const ok = l.filter((r) => !r.echec), q = (k) => { const v = ok.map((r) => r[k]).filter(Number.isFinite).sort((x, y) => x - y); return { min: v[0], med: v[v.length >> 1], max: v.at(-1) }; }; return { n: l.length, ok: ok.length, image: q("image"), pret: q("pret"), app: q("app") }; };
const mesures = { profil: PROFIL };
// une relance : fermée (ou tuée, une fois sur deux), rouverte ; `garder` : la page reste ouverte ce temps (ms) avant
const relances = async (n, nom, { garder = 0 } = {}) => {
  const l = [];
  for (let i = 1; i <= n; i++) {
    const r = i % 2 === 0 ? await a.tuerEtRelancer() : await a.relancer();
    r.nom = `${nom} ${i}${i % 2 === 0 ? " (tuée)" : ""}`; r.sw = await a.etatSW().catch(() => null); l.push(r);
    if (r.echec) await a.page?.screenshot({ path: `${OUT}/echec-${nom}-${i}.png` }).catch(() => {});
    if (garder) await a.page.waitForTimeout(garder);
  }
  return l;
};
const dire = (m) => `première image ${m.image.min} à ${m.image.max} ms (médiane ${m.image.med}) ; prête ${m.pret.min} à ${m.pret.max} ms (médiane ${m.pret.med}) ; accueil ${m.app.min} à ${m.app.max} ms`;

// 1. le premier lancement : rien n'est en cache, le service worker s'installe
if (faire(1) || faire(2) || faire(3) || faire(4) || faire(6)) {
  const r = await a.ouvrir();
  const e = await a.installer();
  mesures.premier = { ...r, installationS: e.dureeS };
  console.log(`     premier lancement : première image ${r.image} ms, prête ${r.pret} ms, accueil ${r.app} ms ; installation finie ${e.dureeS} s après`);
  check(e.actif === "activated" && e.caches.includes("ocean-aaaaaaaaaaaa"), `premier lancement : le service worker a tout mis en cache (${e.caches.join(", ")})`);
  const l = await a.lectures();
  check(l.jouees > 0 && !l.refusees && !l.manquees.length, `premier lancement : la bienvenue est jouée par un vrai lecteur (${l.jouees} lecture(s), ${l.refusees} refusée(s))`);
}

// 2. dix relances avec le réseau, dix sans
if (faire(2)) {
  const avec = await relances(N, "réseau"); serveur.reseau("coupe");
  const sans = await relances(N, "sans réseau"); serveur.reseau("ok");
  mesures.avecReseau = resume(avec); mesures.sansReseau = resume(sans); mesures.relances = [...avec, ...sans];
  for (const [nom, l] of [["avec le réseau", avec], ["sans réseau", sans]]) {
    const m = resume(l);
    check(m.ok === l.length && l.every((r) => r.controle), `${l.length} relances ${nom} (une sur deux après un arrêt net) : toutes servies par le service worker et prêtes (${m.ok}/${l.length})`);
    check(m.image.max <= SEUIL, `${nom} : ${dire(m)} ; seuil de la première image ${SEUIL} ms`);
  }
  const l = await a.lectures();
  check(l.jouees > 0 && !l.refusees && !l.manquees.length, `sans réseau : la bienvenue est jouée depuis le cache par un vrai lecteur (${l.jouees} lecture(s))`);
}

// 3. une nouvelle version publiée : on relance pendant qu'elle s'installe (chaque fermeture interrompt son installation, la
// suivante reprend), jusqu'à ce qu'elle prenne la main ; puis une troisième, réseau lent puis instable
if (faire(3)) {
  serveur.publier("B");
  const pendant = await relances(N, "nouvelle version", { garder: 4000 });
  await a.relancer(); const e = await a.installer(); console.log(`     nouvelle version : ${JSON.stringify(e)}`);
  pendant.push(...(await relances(2, "nouvelle version installée")));
  mesures.pendant = resume(pendant);
  check(mesures.pendant.ok === pendant.length, `${pendant.length} relances pendant l'installation de la nouvelle version : toutes prêtes (${mesures.pendant.ok}/${pendant.length})`);
  check(mesures.pendant.image.max <= SEUIL, `pendant l'installation : ${dire(mesures.pendant)}`);
  const v = await a.page.evaluate(async () => (await (await fetch("version.json")).json()).version).catch(() => "?"), sw = await a.etatSW();
  check(v === "bbbbbbbbbbbb" && sw.caches.length === 1, `la nouvelle version a pris la main, l'ancien cache est effacé (${v} ; ${sw.caches.join(", ")})`);
  // le réseau lent (0,4 s par fichier, 200 Ko/s), puis instable : une troisième version s'installe quand même, et les relances
  // restent rapides (elles sont servies par le cache)
  serveur.publier("C"); serveur.reseau("lent");
  const lent = await relances(4, "réseau lent", { garder: 6000 });
  serveur.reseau("instable", { perte: 3 });
  const instable = await relances(4, "réseau instable", { garder: 6000 });
  serveur.reseau("ok"); await a.relancer(); const e2 = await a.installer(); await a.relancer();
  const m = resume([...lent, ...instable]); mesures.reseauLent = m;
  check(m.ok === lent.length + instable.length && m.image.max <= SEUIL, `réseau lent puis instable pendant une mise à jour : ${m.ok}/${lent.length + instable.length} relances prêtes ; ${dire(m)}`);
  const v3 = await a.page.evaluate(async () => (await (await fetch("version.json")).json()).version).catch(() => "?");
  check(v3 === "cccccccccccc", `après le réseau lent et instable, la troisième version a fini par s'installer et prendre la main (${v3} ; installée ${e2.dureeS} s après le retour du réseau)`);
}

if (!ancien && faire(4)) {
  // 4. le secours du service worker : le cache perdu et pas de réseau ; la page de l'application ne peut venir de nulle part
  await a.relancer();
  await a.page.evaluate(async () => { for (const k of await caches.keys()) await caches.delete(k); });
  serveur.reseau("coupe");
  const t0 = Date.now();
  await a.page.goto(a.url).catch(() => {});
  const texte = await a.page.waitForFunction(() => document.body?.innerText.includes("touchez l'écran pour réessayer") && document.body.innerText, null, { timeout: 15000 }).then((h) => h.jsonValue(), () => null);
  await a.page.screenshot({ path: `${OUT}/secours-service-worker.png` });
  check(!!texte, `ni cache ni réseau : la page de secours du service worker, « Vérifiez le Wi-Fi, puis touchez l'écran pour réessayer », en ${Date.now() - t0} ms`);
  serveur.reseau("ok");
  await a.toucher([100, 100]);
  const repart = await a.attendre(() => document.querySelector(".demarrage") || window.__ready !== undefined, 120000).then(() => true, () => false);
  check(repart, "le réseau revenu, un toucher relance l'application");
  await a.installer();
}

if (!ancien && faire(5)) {
  // 5. le secours de la page : un chargement qui ne finit pas (sans service worker, un fichier qui ne vient jamais)
  const browser = await chromium.launch({ executablePath: CHROMIUM });
  const ctx = await browser.newContext({ ...optionsProfil(PROFIL), serviceWorkers: "block" }), page = await ctx.newPage();
  let bloque = true; const retenus = [];
  await page.route("**/assets/art/atlas.json", (r) => (bloque ? retenus.push(r) : r.continue()));
  await page.goto(serveur.url + "?nosw");
  await page.waitForTimeout(3200);
  const t1 = await page.evaluate(() => document.getElementById("chargement")?.innerText ?? null);
  await page.screenshot({ path: `${OUT}/secours-page-chargement.png` });
  check(/Chargement…/.test(t1 ?? ""), `un chargement qui tarde : « Chargement… » (${JSON.stringify(t1)})`);
  await page.waitForTimeout(13000);
  const t2 = await page.evaluate(() => document.getElementById("chargement")?.innerText ?? null);
  await page.screenshot({ path: `${OUT}/secours-page-reessayer.png` });
  check(/Toucher pour réessayer/.test(t2 ?? ""), `au bout de 15 s : « Toucher pour réessayer » (${JSON.stringify(t2)})`);
  bloque = false; retenus.forEach((r) => r.abort().catch(() => {}));
  await page.locator("#chargement").tap();
  const repart = await page.waitForFunction(() => window.__ready !== undefined || document.querySelector(".demarrage.pret"), null, { timeout: 120000 }).then(() => true, () => false);
  check(repart && !(await page.evaluate(() => !!document.getElementById("chargement"))), "touché : l'application repart, le secours a disparu");
  await page.waitForTimeout(500);
  const note = await page.evaluate(() => window.__journalTechnique.some((e) => /lancement précédent/.test(e.message)));
  check(note, "le lancement bloqué est noté dans le journal technique au lancement suivant");
  await browser.close();
}

if (!ancien && faire(6)) {
  // 6. le journal technique : les lancements (temps jusqu'à la première image) et le service worker
  await a.relancer(); await a.page.waitForTimeout(500);
  const j = await a.journalTechnique();
  writeFileSync(`${OUT}/journal.json`, JSON.stringify(j, null, 1));
  const lanc = j.filter((e) => e.type === "lancement" && e.premiereImageMs !== undefined), sw = j.filter((e) => e.source === "service worker");
  check(lanc.length >= 5 && lanc.every((e) => e.premiereImageMs > 0 && e.version), `journal : ${lanc.length} lancements notés, avec le temps jusqu'à la première image et la version`);
  check(["installation commencée", "installation finie", "version activée"].every((m) => sw.some((e) => e.message === m)), `journal : le service worker (${[...new Set(sw.map((e) => e.message))].join(", ")})`);
  check(j.length <= 300, `journal : au plus 300 événements (${j.length})`);
}
await a.detruire();

if (!ancien && faire(7)) {
  // 7. le stockage trop petit : 60 Mo pour une application de 140 Mo ; l'installation ne peut pas finir
  serveur.publier("A");
  const q = new Appareil(PROFIL, { serveur, quota: 60e6, journal: console.log });
  const r = await q.ouvrir();
  // (le service worker essaie, échoue sur le quota, et libère la place qu'il avait prise)
  const fin = Date.now() + 300000; let j = [];
  while (Date.now() < fin) { j = await q.journalTechnique().catch(() => []); if (j.some((e) => e.message === "stockage plein")) break; await q.page.waitForTimeout(2000); }
  const plein = j.find((e) => e.message === "stockage plein");
  check(!!plein, `quota de 60 Mo : l'installation qui ne tient pas est notée « stockage plein » dans le journal technique${plein ? ` (${plein.erreur ?? ""})` : ""}`);
  const est = await q.page.evaluate(async () => { const e = await navigator.storage.estimate(); return { usage: Math.round(e.usage / 1e6), quota: Math.round(e.quota / 1e6) }; });
  check(est.usage < 30, `la place prise par l'installation inachevée est rendue (${est.usage} Mo utilisés sur ${est.quota})`);
  // l'application reste utilisable : une séance commence, ses réponses s'enregistrent
  await q.deuxTouchers(".galet.play");
  const ok = await q.attendre(() => !!window.__app.session?.rec?.id, 60000).then(() => true, () => false);
  const enreg = ok && (await q.page.evaluate(async () => (await window.__app.store.all("seances")).length > 0));
  check(r.app > 0 && enreg, "le stockage plein, l'application reste utilisable avec le réseau : une séance commence et s'enregistre");
  // l'espace parent le dit
  const avis = await q.page.evaluate(async () => (await import("./js/engine/stockage.js")).avisStockage?.());
  check(!!avis && /place/i.test(avis.texte ?? ""), `l'espace parent dit au parent que la tablette manque de place (« ${avis?.texte ?? "rien"} »)`);
  await q.page.screenshot({ path: `${OUT}/stockage-plein.png` });
  await q.detruire();
}

writeFileSync(`${OUT}/mesures${ancien ? "-avant" : ""}.json`, JSON.stringify(mesures, null, 1));
check(!a.erreurs.length, `aucune erreur dans les pages${a.erreurs.length ? ` (${a.erreurs.slice(0, 3).join(" | ")})` : ""}`);
check(!a.refusLecteurs, `aucun lecteur de médias refusé par le navigateur (${a.refusLecteurs})`);
await serveur.fermer();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\ninstallation : chaque relance s'affiche vite, avec ou sans réseau, pendant une mise à jour comme après");
process.exitCode = fail.length ? 1 : 0;
