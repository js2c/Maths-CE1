// LA JOURNÉE D'USAGE (lot « Banc Android et recette en conditions réelles », point 4 ; docs/LOTS.md, fiche 13). Sur le banc
// Android (tests/e2e/appareils.mjs), un seul profil de navigateur, à la vraie vitesse, SANS RIEN REMETTRE À ZÉRO entre les
// étapes, comme une tablette qui sert tous les soirs :
//   1. l'installation (le service worker met l'application en cache) ;
//   2. trois séances « jouer » complètes (après chacune, la séance est datée de la veille au soir : la suivante est celle du
//      lendemain ; c'est la seule chose que le parcours change dans les données) ;
//   3. chaque exercice par « choisir » (la ligne, les additions, le calcul rapide, les voiliers, la multiplication, l'étal) :
//      quelques questions, puis la maison ; l'exercice suivant est choisi depuis l'accueil en pause ;
//   4. l'espace parent (appui long, le code, les onglets) : il termine la séance laissée en pause ;
//   5. chaque leçon (L1 à L18) depuis le menu des leçons, regardée jusqu'au bout ;
//   6. la boutique et un achat ; le récif et l'album ;
//   7. trente minutes sans toucher sur l'accueil, puis trente minutes sur une question d'un exercice (ses relances comprises) ;
//   8. dix relances : fermée ou tuée (Android arrête Chrome), dont une pendant une séance (la reprise), une pendant
//      l'installation d'une nouvelle version, une sans réseau ;
//   9. une heure en arrière-plan (la page cachée et gelée), puis un retour.
// Après chaque étape, sur l'accueil : une phrase est bien jouée par un vrai lecteur (la mascotte touchée la redit ; le lecteur
// a joué, jusqu'au bout), un galet touché deux fois ouvre son écran, aucun écran n'est noir (part de pixels noirs mesurée), les
// budgets sont tenus (appareils.mjs, BUDGETS : le code du journal technique) et ce qui doit revenir à son niveau de départ y
// revient. Le résumé : tests/e2e/out/journee/<profil>/journee.json et journee.md.
//   node tests/e2e/journee.mjs [--profil s5e] [--court] [--seul 1,2,…] [--graine 1]
//   --ci : la version courte des tests de GitHub (environ 15 minutes ; voir CI ci-dessous)
//   --court : les inactivités de 3 minutes, l'arrière-plan de 5 minutes, une séance au lieu de trois, six leçons au lieu de
//   dix-huit (pour un contrôle rapide ; la recette du lot se fait sans)
import { Appareil, serveurBanc, REFERENCE, BUDGETS, depasse, resumeEtat } from "./appareils.mjs";
import { ATTEND, CIBLES, ECRAN, REPONDRE } from "./jeu.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
// (--ci : le travail « android » des tests de GitHub, environ 15 minutes : l'installation, une séance courte à la vraie voix, cinq
// minutes sans toucher, trois relances (fermée, tuée, sans réseau), deux minutes en arrière-plan gelée ; les contrôles et les
// budgets après chaque étape, comme la journée)
const CI = args.includes("--ci");
const PROFIL = arg("--profil", REFERENCE), COURT = args.includes("--court") || CI, SEUL = (CI ? "1,2,7,9,10" : arg("--seul"))?.split(","), faire = (n) => !SEUL || SEUL.includes(String(n));
const MIN_INACTIF = CI ? 5 : COURT ? 3 : 30, MIN_FOND = CI ? 2 : COURT ? 5 : 60;
const OUT = resolve(`tests/e2e/out/journee${CI ? "-ci" : ""}/${PROFIL}`); mkdirSync(OUT, { recursive: true });
const seance = JSON.parse(readFileSync("app/content/seance.json", "utf8"));
const LECONS = seance.menuLecons.rangees.flatMap((r) => r.lecons);
let graine = Number(arg("--graine", 1)); const rnd = () => { graine = (graine * 16807) % 2147483647; return graine / 2147483647; };

const serveur = await serveurBanc();
const a = new Appareil(PROFIL, { serveur, journal: console.log });
const fail = [], etapes = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); return ok; };
const t0 = Date.now(), minutes = () => ((Date.now() - t0) / 60000).toFixed(1);
const ecran = () => a.page.evaluate(ECRAN).catch(() => "?");
const attendre = (ms) => a.page.waitForTimeout(ms);
const visible = (sel) => a.page.evaluate((s) => [...document.querySelectorAll(s)].some((e) => e.isConnected && !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true }) && e.getBoundingClientRect().width > 4), sel).catch(() => false);
const attendreVisible = async (sel, ms = 30000) => { const fin = Date.now() + ms; while (Date.now() < fin) { if (await visible(sel)) return true; await attendre(300); } return false; };
const silence = (ms = 40000) => a.attendre(() => !window.__app.voice.speaking, ms).catch(() => {});
// l'accueil : ni séance en cours, ni visite, ni espace parent (l'accueil en pause compte : ses galets sont là)
const surAccueil = () => a.page.evaluate(() => { const x = window.__app; return !x.modeEcran?.() && !x.reef?.open && !x.album?.open && !x.boutique?.open && !x.parent?.root?.isConnected; }).catch(() => false);
// revenir à l'accueil : la maison, le retour de la boutique, ou attendre
async function versAccueil(ms = 60000) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {
    if (await surAccueil()) return true;
    for (const s of [".boutique-retour", ".lecons-maison", ".homekey", ".session-home"]) if (await visible(s)) { await a.toucher(s).catch(() => {}); break; }
    await attendre(1500);
  }
  return surAccueil();
}

// ---------------------------------------------------------------- le contrôle après chaque étape
let depart = null;
async function controle(nom, debut) {
  const r = { etape: nom, minutes: +((Date.now() - debut) / 60000).toFixed(1), a: +minutes() };
  r.accueil = await versAccueil();
  await silence();
  // une phrase jouée par un vrai lecteur : la mascotte touchée la redit
  const l0 = await a.lectures();
  await a.toucher(".mascotte-tap").catch(() => {});
  const joue = await a.attendre((n) => window.__lectures.jouees > n, 10000, l0.jouees).then(() => true, () => false);
  await silence();
  const l1 = await a.lectures();
  r.phrase = { jouees: l1.jouees - l0.jouees, finies: l1.finies - l0.finies, refusees: l1.refusees - l0.refusees, manquees: l1.manquees.length - l0.manquees.length };
  check(joue && r.phrase.finies > 0 && !r.phrase.refusees && !r.phrase.manquees, `${nom} : la mascotte touchée redit sa phrase, jouée jusqu'au bout par un vrai lecteur (${JSON.stringify(r.phrase)})`);
  // aucun écran noir
  r.noir = +(await a.noir()).toFixed(3);
  check(r.noir <= 0.2, `${nom} : l'écran n'est pas noir (${(r.noir * 100).toFixed(1)} % de pixels noirs)`);
  if (r.noir > 0.2) await a.page.screenshot({ path: join(OUT, `noir-${etapes.length}.png`) });
  // les budgets (et, sur l'accueil, le retour au niveau de départ), mesurés au repos : 20 s sans toucher ni phrase (juste après un
  // lancement ou une phrase, une vingtaine de minuteries courtes sont en attente ; elles s'éteignent d'elles-mêmes)
  await silence(); await attendre(20000);
  r.etat = await a.budgets();
  // (le retour au niveau de départ ne se compare que sur l'accueil hors pause : l'accueil en pause garde l'exercice en cours)
  r.pause = await a.page.evaluate(() => !!window.__app.enPause).catch(() => false);
  // (le niveau de départ : l'accueil hors pause après le premier passage par tous les écrans, l'étape 6 ; avant, les réserves
  // voulues se remplissent, l'étal et l'album : seuls les plafonds comptent)
  if (!r.pause && etapes.length >= 5) depart ??= r.etat;
  const d = depasse(r.etat, r.pause || etapes.length < 5 ? null : depart);
  check(!d.length, `${nom} : budgets tenus (${resumeEtat(r.etat)})${d.length ? ` ; dépassés : ${d.join(" ; ")}` : ""}`);
  // un galet touché deux fois ouvre son écran (« choisir », ou « Encore ! » si la séance du jour est faite) ; la maison ramène
  const g = (await visible(".galet.choisir")) ? ".galet.choisir" : ".galet.again";
  await a.deuxTouchers(g);
  r.galet = await attendreVisible(".choix-ex", 15000);
  check(r.galet, `${nom} : le galet ${g === ".galet.choisir" ? "« choisir »" : "« Encore ! »"} touché deux fois ouvre son écran`);
  await a.page.screenshot({ path: join(OUT, `etape-${String(etapes.length + 1).padStart(2, "0")}-${nom.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\W+/g, "-").slice(0, 40)}.png`) });
  await versAccueil();
  r.erreurs = a.erreurs.length; r.refusLecteurs = a.refusLecteurs;
  etapes.push(r);
  writeFileSync(join(OUT, "journee.json"), JSON.stringify({ profil: PROFIL, court: COURT, budgets: BUDGETS, etapes, lancements: a.lancements }, null, 1));
  console.log(`     … ${nom} : ${r.minutes} min (journée : ${minutes()} min)`);
}
const etape = async (n, nom, f) => { if (!faire(n)) return; const d = Date.now(); console.log(`\n${n}. ${nom}`); try { await f(); } catch (e) { check(false, `${nom} : ${e.message.split("\n")[0]}`); await a.page?.screenshot({ path: join(OUT, `echec-${n}.png`) }).catch(() => {}); } await controle(nom, d); };

// ---------------------------------------------------------------- jouer comme une enfant
// avancer d'un pas : répondre (juste le plus souvent) à une question qui attend, sinon toucher ce qui fait avancer (coche, carte,
// coquillage, fin de la récompense), sinon attendre ; `sansFin` : ne pas toucher la fin de la récompense
async function pas() {
  if (await a.page.evaluate(ATTEND).catch(() => false)) {
    await attendre(1500 + rnd() * 2500); // (le temps de réfléchir)
    await a.page.evaluate(REPONDRE, rnd() < 0.85).catch(() => {}); await attendre(800); return "réponse";
  }
  const c = (await a.page.evaluate(CIBLES).catch(() => [])).filter((x) => /check|shelltap|fin-recompense|carte|coquillage/.test(x.cls) && !/boutique/.test(x.cls));
  if (c.length) { await attendre(1200); await a.toucher([c[0].x, c[0].y]); await attendre(1200); return c[0].cls; }
  await attendre(1000); return null;
}
const faite = () => a.page.evaluate(() => !window.__app.modeEcran?.() && !window.__app.enPause && !!document.querySelector(".galet.again")).catch(() => false);
// une séance « jouer » jusqu'au bout (« à demain », l'accueil avec la lune) ; la boutique de la fin est quittée
async function jouerSeance(maxMin = 30) {
  await versAccueil();
  await a.deuxTouchers(".galet.play");
  const fin = Date.now() + maxMin * 60000; let n = 0;
  while (Date.now() < fin) {
    if (await faite()) break;
    // (la fin de la récompense mène à la boutique, ou au récif quand il n'y a pas de quoi acheter : l'enfant en revient)
    if (await a.page.evaluate(() => !!window.__app.boutique?.open).catch(() => false)) { await attendre(3000); await a.toucher(".boutique-retour").catch(() => {}); }
    else if (await a.page.evaluate(() => !!window.__app.reef?.open).catch(() => false)) { await attendre(4000); await a.toucher(".homekey").catch(() => {}); }
    if ((await pas()) === "réponse") n++;
  }
  const ok = await faite();
  const rec = await a.page.evaluate(async () => (await window.__app.store.all("seances")).filter((s) => !s.libre).at(-1));
  check(ok && rec?.terminee, `séance « jouer » terminée (${n} réponses, ${rec?.questions ?? "?"} questions, ${rec?.etoiles ?? "?"} étoiles, ${rec?.dureeS ?? "?"} s)`);
  return rec;
}
// la séance du jour, datée de la veille au soir (la suivante sera celle du lendemain)
const hier = () => a.page.evaluate(async () => { const st = window.__app.store; for (const s of await st.all("seances")) { if (s.debut > Date.now() - 20 * 3600000) { s.debut -= 86400000; if (s.fin) s.fin -= 86400000; await st.put("seances", s); } } });

// ---------------------------------------------------------------- la journée
await etape(1, "installation", async () => {
  const r = await a.ouvrir(); const e = await a.installer();
  check(!r.echec && e.actif === "activated", `installation : première image ${r.image} ms, prête ${r.pret} ms ; l'application mise en cache ${e.dureeS} s après`);
  await a.relancer(); // (la première relance : servie par le service worker)
});

await etape(2, "trois séances « jouer »", async () => {
  // (--ci : une séance courte, trois questions par étape, sans défi)
  if (CI) await a.relancer({ q: "?questions=3&faits=3&sans=defi" });
  for (let i = 1; i <= (COURT ? 1 : 3); i++) { await jouerSeance(); await hier(); await a.relancer(); }
});

const EXOS = ["ligne", "additions", "calcul", "voiliers", "multiplication", "etal"];
await etape(3, "chaque exercice par « choisir »", async () => {
  for (const ex of EXOS) {
    await a.deuxTouchers(".galet.choisir, .choisir.keep");
    if (!(await attendreVisible(`.choix-ex[data-key="${ex}"]`, 20000))) { check(false, `choisir : l'exercice ${ex} n'est pas proposé`); continue; }
    await attendre(800); await a.deuxTouchers(`.choix-ex[data-key="${ex}"]`);
    await attendreVisible(".choix-tuile", 20000); await attendre(800);
    await a.deuxTouchers(".choix-tuile");
    // quelques questions de l'exercice (après l'échauffement s'il y en a un)
    const fin = Date.now() + 8 * 60000; let n = 0;
    while (Date.now() < fin && n < 4) { const e = await ecran(); if ((await pas()) === "réponse" && /notion/.test(e)) n++; }
    check(n >= 4, `choisir ${ex} : ${n} questions de l'exercice jouées`);
    await a.toucher(".session-home").catch(() => {}); await a.attendre(() => window.__app.enPause, 20000).catch(() => {});
    await silence();
  }
});

await etape(4, "l'espace parent", async () => {
  await versAccueil(); await silence();
  await a.toucher(".logo", { ms: 2400 });
  await attendreVisible(".pa-gate", 10000);
  const taper = async (c) => { for (const d of c) { await a.toucher(`.pa-keys [data-key="${d}"]`); await attendre(250); } };
  await taper("2468"); await attendre(500); await taper("2468");
  check(await attendreVisible(".pa-sheet", 15000), "espace parent : le code choisi, les tableaux s'ouvrent");
  for (const t of ["seances", "progression", "donnees", "calendrier"]) { await a.toucher(`[data-tab="${t}"]`); await attendre(1500); }
  // la séance laissée en pause est terminée par le parent
  if (await visible(".pa-pause .pa-btn")) { await a.toucher(".pa-pause .pa-btn"); await attendre(500); await a.toucher(".pa-confirm .danger"); }
  else await a.page.evaluate(() => [...document.querySelectorAll(".pa-link, .pa-btn")].find((b) => /Retour/.test(b.textContent))?.click());
  check(await versAccueil(), "espace parent : retour à l'accueil");
});

await etape(5, "chaque leçon", async () => {
  for (const id of COURT ? ["L1", "L4", "L7", "L13", "L15", "L18"] : LECONS) {
    await versAccueil(); await silence(15000);
    await a.deuxTouchers(".galet.leconskey");
    if (!(await attendreVisible(`.lecons-tuile[data-key="${id}"]`, 20000))) { check(false, `leçon ${id} : pas dans le menu`); continue; }
    await attendre(1000); await a.deuxTouchers(`.lecons-tuile[data-key="${id}"]`);
    const d = Date.now(); let pire = 0;
    // regardée jusqu'au bout (« À toi ! ») ; la part de noir regardée toutes les 20 s
    while (Date.now() - d < 6 * 60000 && !(await visible(".lecons-atoi"))) { await attendre(5000); if ((Date.now() - d) % 20000 < 5000) pire = Math.max(pire, await a.noir().catch(() => 0)); }
    const fin = await visible(".lecons-atoi");
    check(fin && pire <= 0.2, `leçon ${id} : regardée jusqu'au bout en ${Math.round((Date.now() - d) / 1000)} s, au plus ${(pire * 100).toFixed(1)} % de noir`);
    await a.toucher(".lecons-maison").catch(() => {}); await attendre(1500);
  }
});

await etape(6, "la boutique, le récif et l'album", async () => {
  await versAccueil(); await silence();
  await a.deuxTouchers(".galet.reefkey");
  check(await attendreVisible(".boutique-cle", 30000), "le récif s'ouvre, avec son bouton de la boutique");
  await attendre(3000); await a.toucher(".boutique-cle");
  await a.attendre(() => window.__app.boutique?.open && document.querySelectorAll(".boutique-tuile").length >= 15, 30000);
  await attendre(2500); await silence();
  // une créature à vendre, au prix le plus bas
  const choix = await a.page.evaluate(() => { const b = window.__app.boutique, v = [...b.vit].filter(([, e]) => e === "vendre").map(([k]) => k); return v[0] ?? null; });
  const avant = await a.page.evaluate(() => window.__app.rewards.achats.liste.length);
  if (choix) {
    await a.toucher(`.boutique-tuile[data-id="${choix}"]`); await attendre(2500);
    if (await visible(".boutique-conf.coche")) { await a.toucher(".boutique-conf.coche"); await a.attendre(() => !window.__app.boutique.verrou, 30000).catch(() => {}); await attendre(4000); }
  }
  const apres = await a.page.evaluate(() => window.__app.rewards.achats.liste.length);
  check(apres === avant + 1, `boutique : une créature achetée (${choix ?? "aucune à vendre"} ; achats ${avant} -> ${apres})`);
  await a.toucher(".boutique-retour").catch(() => {}); await attendre(6000); // (la créature arrive à la nage dans le récif)
  await versAccueil();
  await a.deuxTouchers(".galet.albumkey");
  check(await a.attendre(() => window.__app.album?.open, 20000).then(() => true, () => false), "l'album s'ouvre");
  await attendre(5000);
});

await etape(7, `${MIN_INACTIF} minutes sans toucher sur l'accueil`, async () => {
  await versAccueil(); await silence();
  const e0 = await a.budgets(); await attendre(MIN_INACTIF * 60000); const e1 = await a.budgets();
  check(!depasse(e1, e0).length, `accueil, ${MIN_INACTIF} min sans toucher : ${resumeEtat(e0)} -> ${resumeEtat(e1)}`);
});
await etape(8, `${MIN_INACTIF} minutes sans toucher sur une question`, async () => {
  await a.deuxTouchers(".galet.again, .galet.play");
  await attendreVisible(".choix-ex", 20000); await attendre(800);
  await a.deuxTouchers('.choix-ex[data-key="additions"]'); await attendreVisible(".choix-tuile", 20000); await attendre(800); await a.deuxTouchers(".choix-tuile");
  await a.attendre(ATTEND, 120000);
  const l0 = await a.lectures(), e0 = await a.budgets();
  await attendre(MIN_INACTIF * 60000);
  const l1 = await a.lectures(), e1 = await a.budgets();
  check(!depasse(e1, e0).length && !(l1.refusees - l0.refusees), `question, ${MIN_INACTIF} min sans toucher : ${l1.jouees - l0.jouees} relances jouées, ${l1.refusees - l0.refusees} refusées ; ${resumeEtat(e1)}`);
  await a.page.evaluate(REPONDRE, true); await attendre(3000);
  await a.toucher(".session-home").catch(() => {}); await attendre(2000);
});

await etape(9, CI ? "trois relances" : "dix relances", async () => {
  if (CI) {
    await a.relancer(); await a.tuerEtRelancer(); serveur.reseau("coupe"); const r = await a.relancer(); serveur.reseau("ok");
    const ls = a.lancements.slice(-3);
    check(ls.every((x) => !x.echec && x.controle), `trois relances (fermée, tuée, sans réseau) : servies par le service worker ; première image au plus ${Math.max(...ls.map((x) => x.image))} ms, prête au plus ${Math.max(...ls.map((x) => x.pret))} ms`);
    void r; return;
  }
  // 1 à 3 : fermée, tuée, fermée
  await a.relancer(); await a.tuerEtRelancer(); await a.relancer();
  // 4 : pendant une séance (la reprise) ; le navigateur tué en pleine question
  await versAccueil();
  // (la séance du jour faite : elle passe à la veille pour en commencer une autre)
  await hier(); await a.relancer();
  await a.deuxTouchers(".galet.play");
  for (let n = 0; n < 3;) if ((await pas()) === "réponse") n++;
  await a.tuerEtRelancer();
  const offerte = await attendreVisible(".keep.play", 20000);
  await silence(); await a.deuxTouchers(".keep.play");
  const reprise = await a.attendre(() => !window.__app.enPause && window.__app.session?.rec, 20000).then(() => true, () => false);
  check(offerte && reprise, "relance pendant une séance : « continuer » la reprend");
  for (let n = 0; n < 2;) if ((await pas()) === "réponse") n++;
  await a.toucher(".session-home").catch(() => {});
  // 5 et 6 : une nouvelle version publiée ; relancée pendant son installation, puis une fois installée
  serveur.publier("B");
  await a.relancer(); await attendre(5000); await a.tuerEtRelancer(); await a.installer();
  await a.relancer();
  const v = await a.page.evaluate(async () => (await (await fetch("version.json")).json()).version);
  check(v === "bbbbbbbbbbbb", `relance pendant l'installation d'une nouvelle version : elle prend la main au lancement suivant (${v})`);
  // 7 : sans réseau ; 8 à 10 : fermée, tuée, fermée
  serveur.reseau("coupe"); const r7 = await a.relancer(); serveur.reseau("ok");
  check(!r7.echec && r7.controle, `relance sans réseau : servie par le service worker (première image ${r7.image} ms)`);
  await a.relancer(); await a.tuerEtRelancer(); await a.relancer();
  const ls = a.lancements.slice(-10), max = Math.max(...ls.map((r) => r.image)), maxP = Math.max(...ls.map((r) => r.pret));
  check(ls.every((r) => !r.echec), `dix relances : toutes prêtes ; première image au plus ${max} ms, prête au plus ${maxP} ms`);
});

await etape(10, `${MIN_FOND} minutes en arrière-plan`, async () => {
  await versAccueil();
  await a.cacher(MIN_FOND * 60000, { geler: true });
  await attendre(2000);
});

// ---------------------------------------------------------------- le résumé
const md = [`# Journée d'usage sur le banc Android : ${PROFIL}${CI ? " (tests de GitHub)" : COURT ? " (courte)" : ""}`, "", `${new Date().toISOString()} ; durée ${minutes()} min ; ${fail.length ? `**${fail.length} échec(s)**` : "aucun échec"}.`, "",
  "| Étape | Durée (min) | Phrase jouée | Noir | Galet | Médias | Canvas (Mpx) | Images (Mpx) | Mémoire (Mo) | Minuteries | Écouteurs |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...etapes.map((r) => `| ${r.etape} | ${r.minutes} | ${r.phrase.finies ? "oui" : "NON"} | ${(r.noir * 100).toFixed(1)} % | ${r.galet ? "oui" : "NON"} | ${r.etat?.medias} | ${r.etat?.canvasMpx} | ${r.etat?.imagesMpx} | ${r.etat?.memoireMo} | ${r.etat?.minuteries} | ${r.etat?.ecouteurs} |`),
  "", "## Lancements", "", "| # | Première image (ms) | Prête (ms) | Accueil (ms) | Service worker |", "| --- | --- | --- | --- | --- |",
  ...a.lancements.map((r, i) => `| ${i + 1} | ${r.image ?? "-"} | ${r.pret ?? "-"} | ${r.app ?? "-"} | ${r.echec ? `ÉCHEC ${r.echec}` : r.controle ? "oui" : "non"} |`),
  ...(fail.length ? ["", "## Échecs", "", ...fail.map((f) => `- ${f}`)] : [])];
writeFileSync(join(OUT, "journee.md"), md.join("\n") + "\n");
check(!a.erreurs.length, `aucune erreur dans la page${a.erreurs.length ? ` (${a.erreurs.slice(0, 3).join(" | ")})` : ""}`);
check(!a.refusLecteurs, `aucun lecteur de médias refusé par le navigateur (${a.refusLecteurs})`);
await a.detruire(); await serveur.fermer();
console.log(fail.length ? `\n${fail.length} échec(s)` : `\njournée d'usage (${PROFIL}) : aucun défaut en ${minutes()} min`);
process.exitCode = fail.length ? 1 : 0;
