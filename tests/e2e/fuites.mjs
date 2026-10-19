// AUCUNE FUITE (lot « Banc Android et recette en conditions réelles », point 3 ; docs/LOTS.md, fiche 13). Sur le banc Android
// (tests/e2e/appareils.mjs, l'application installée, le profil de la tablette de référence), des allers-retours répétés depuis
// l'accueil : le menu des leçons, une leçon, le récif, la boutique, l'album, chaque exercice par « choisir », l'espace parent.
// Après chaque tour, sur l'accueil, au repos et après un passage du ramasse-miettes, l'état de la page est mesuré par le code
// du journal technique (app/js/engine/etat-page.js) : canvas (nombre et mégapixels), images en mémoire, minuteries répétées,
// écouteurs, lecteurs de médias, mémoire. Rien ne doit croître d'un tour à l'autre après le premier (qui remplit les réserves
// voulues : l'album garde ses pages, la boutique ses vignettes) ; les canvas détachés restants sont listés par origine.
// (Leçon du banc : une poignée Playwright gardée sur un élément le retient en mémoire, avec tout ce qui s'y rattache ; le banc
// libère les siennes, Appareil.attendre et Appareil.toucher. Et la mesure ne garde de chaque contexte de dessin qu'une
// référence faible : sinon, c'est elle qui retenait les canvas.)
//   node tests/e2e/fuites.mjs [--tours 4] [--profil s5e]
// BANC ANDROID, raccourcis : voix rapide
// (raison : ce parcours mesure la mémoire après des dizaines d'allers-retours ; la voix à sa vitesse réelle ne changerait rien à
// ce qui est retenu, mais multiplierait sa durée ; la vraie voix et ses lecteurs sont éprouvés par journee.mjs et veille.mjs.)
import { Appareil, serveurBanc, REFERENCE, resumeEtat } from "./appareils.mjs";
import { ATTEND, REPONDRE } from "./jeu.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const TOURS = Number(arg("--tours", 4)), PROFIL = arg("--profil", REFERENCE);
const OUT = resolve("tests/e2e/out/fuites"); mkdirSync(OUT, { recursive: true });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const serveur = await serveurBanc();
const a = new Appareil(PROFIL, { serveur, ralenti: false });
await a.ouvrir(); await a.installer();
// (la séance du jour faite : l'accueil propose « Encore ! » ; l'échauffement retiré ; des étoiles pour la boutique)
await a.page.evaluate(async () => { const st = window.__app.store; await st.setSetting("echauffement", false); await st.setSetting("mascotteTouchee", true); await st.add("seances", { debut: Date.now() - 600000, fin: Date.now() - 60000, terminee: true, module: 1, questions: 20, justes: 18, etapes: [] }); await st.put("recompenses", { id: "etoiles", total: 400, cumul: 400, dorees: 0, arcEnCiel: 0, coquillages: 0 }); });
const Q = "?voix=rapide&sansReprise&sansLecon&guides=0&cran=conseille&meteo=beau";
await a.relancer({ q: Q });
const vis = (s, ms = 30000) => a.attendre((s) => [...document.querySelectorAll(s)].some((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true })), ms, s);
const accueil = () => a.page.evaluate(() => { const x = window.__app; return !x.modeEcran?.() && !x.reef?.open && !x.album?.open && !x.boutique?.open && !x.parent?.root?.isConnected; });
const versAccueil = async () => { for (let i = 0; i < 30 && !(await accueil()); i++) { for (const s of [".boutique-retour", ".lecons-maison", ".homekey"]) { if (await a.page.evaluate((s) => [...document.querySelectorAll(s)].some((e) => e.checkVisibility({ visibilityProperty: true })), s)) { await a.toucher(s).catch(() => {}); break; } } await a.page.waitForTimeout(1500); } };
const mesure = async () => { await versAccueil(); await a.page.waitForTimeout(8000); const e = await a.budgets(); const d = await a.page.evaluate(() => window.__etatPageDetails?.() ?? []); return { e, d }; };
const tour = async () => {
  await a.deuxTouchers(".galet.leconskey"); await vis(".lecons-tuile"); await a.page.waitForTimeout(800); await a.toucher(".homekey"); await versAccueil();
  await a.deuxTouchers(".galet.leconskey"); await vis('.lecons-tuile[data-key="L15"]'); await a.page.waitForTimeout(800); await a.deuxTouchers('.lecons-tuile[data-key="L15"]'); await vis(".lecons-atoi", 180000); await a.toucher(".lecons-maison"); await versAccueil();
  await a.deuxTouchers(".galet.reefkey"); await vis(".boutique-cle"); await a.page.waitForTimeout(2500); await a.toucher(".boutique-cle"); await vis(".boutique-tuile"); await a.page.waitForTimeout(2500); await a.toucher(".boutique-retour"); await vis(".boutique-cle"); await a.page.waitForTimeout(2000); await a.toucher(".homekey"); await versAccueil();
  await a.deuxTouchers(".galet.albumkey"); await a.attendre(() => window.__app.album?.open, 20000); await a.page.waitForTimeout(2500); await a.toucher(".homekey"); await versAccueil();
  for (const ex of ["ligne", "additions", "calcul", "voiliers", "multiplication", "etal"]) {
    await a.deuxTouchers(".galet.again"); await vis(`.choix-ex[data-key="${ex}"]`); await a.page.waitForTimeout(700); await a.deuxTouchers(`.choix-ex[data-key="${ex}"]`); await vis(".choix-tuile"); await a.page.waitForTimeout(700); await a.deuxTouchers(".choix-tuile");
    // (décision du parent du 19 octobre 2026 : l'exercice choisi, le sélecteur ne part plus seul ; la coche le lance)
    await vis(".cran-ok"); await a.page.waitForTimeout(700); await a.toucher(".cran-ok");
    for (let n = 0; n < 2; n++) { await a.attendre(ATTEND, 120000); await a.page.waitForTimeout(800); await a.page.evaluate(REPONDRE, true); await a.page.waitForTimeout(1500); }
    await a.toucher(".session-home"); await versAccueil();
  }
  await a.toucher(".logo", { ms: 2400 }); await vis(".pa-keys");
  // (le code : choisi et confirmé la première fois, tapé une fois ensuite)
  for (let k = 0; k < 2 && (await a.page.evaluate(() => !!document.querySelector(".pa-keys") && !document.querySelector(".pa-sheet"))); k++) { for (const d of "2468") { await a.toucher(`.pa-keys [data-key="${d}"]`); await a.page.waitForTimeout(150); } await a.page.waitForTimeout(600); }
  if (await a.page.evaluate(() => !!document.querySelector(".pa-sheet")).catch(() => false)) { await a.toucher('[data-tab="donnees"]'); await a.page.waitForTimeout(800); }
  await a.page.evaluate(() => [...document.querySelectorAll(".pa-link, .pa-btn, button")].find((b) => /Fermer|Retour/.test(b.textContent))?.click()); await versAccueil();
};
const releves = [await mesure()];
console.log(`     départ : ${resumeEtat(releves[0].e)}`);
for (let t = 1; t <= TOURS; t++) { await tour(); releves.push(await mesure()); console.log(`     tour ${t} : ${resumeEtat(releves.at(-1).e)}\n       détachés : ${releves.at(-1).d.slice(0, 5).map((x) => `${x.n} × ${x.mpx} Mpx ${x.origine}`).join(" ; ")}`); }
writeFileSync(join(OUT, `fuites-${PROFIL}.json`), JSON.stringify(releves, null, 1));
// d'un tour à l'autre, après le premier : rien ne croît (une marge pour les poissons du lagon qui vont et viennent)
const [, un, ...suite] = releves.map((r) => r.e), dernier = releves.at(-1).e;
const marges = { canvas: 12, canvasMpx: 3, images: 4, imagesMpx: 6, intervalles: 1, ecouteurs: 8, medias: 1, memoireMo: 15 };
for (const [k, mg] of Object.entries(marges)) check(dernier[k] - un[k] <= mg, `${k} : ${un[k]} après le premier tour, ${dernier[k]} après le ${TOURS}e (au plus +${mg})${suite.length ? ` ; tours : ${releves.map((r) => r.e[k]).join(", ")}` : ""}`);
console.log(`     canvas détachés restants, par origine : ${releves.at(-1).d.slice(0, 6).map((x) => `${x.n} × ${x.origine}`).join(" ; ") || "aucun"}`);
check(!a.erreurs.length, `aucune erreur dans la page${a.erreurs.length ? ` (${a.erreurs[0]})` : ""}`);
await a.detruire(); await serveur.fermer();
console.log(fail.length ? `\n${fail.length} échec(s)` : `\nfuites : rien ne croît en ${TOURS} tours`);
process.exitCode = fail.length ? 1 : 0;
