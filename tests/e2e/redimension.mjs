// LA FENÊTRE REDIMENSIONNÉE EN PLEINE PARTIE (lot « Banc Android et recette en conditions réelles » ; demande du parent du
// 17 octobre 2026 : faire apparaître les boutons d'Android, en glissant le doigt en bas de l'écran, rechargeait toute
// l'application, qui rechargeait la page dès que l'échelle changeait). Sur le banc Android, pour chaque profil et sur chaque
// écran (l'accueil, « choisir », le menu des leçons, une leçon, chaque exercice en pleine question, l'accueil en pause, le récif,
// la boutique, l'album, l'espace parent), la fenêtre est réduite puis rendue, plusieurs fois : les boutons d'Android (48 px de
// moins en hauteur), le clavier ou la moitié d'écran (la moitié de la hauteur), une fenêtre plus étroite (multi-fenêtre). Le
// parcours échoue si la page se recharge ; il vérifie aussi que la scène tient dans la fenêtre, qu'elle n'est pas noire, et
// que l'écran répond encore (une question attend toujours sa réponse et l'accepte ; un galet s'ouvre).
//   node tests/e2e/redimension.mjs [--profils s5e,…] [--cycles 3]
// BANC ANDROID, raccourcis : voix rapide
// (raison : le parcours passe par une quinzaine d'écrans sur quatre profils, chacun redimensionné plusieurs fois ; la voix à sa
// vitesse réelle ne changerait rien à ce qu'il vérifie, mais multiplierait sa durée.)
import { Appareil, PROFILS, serveurBanc } from "./appareils.mjs";
import { ATTEND, ECRAN, REPONDRE } from "./jeu.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const NOMS = arg("--profils", Object.keys(PROFILS).join(",")).split(","), CYCLES = Number(arg("--cycles", 3));
const OUT = resolve("tests/e2e/out/redimension"); mkdirSync(OUT, { recursive: true });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const serveur = await serveurBanc();
const Q = "?voix=rapide&sansReprise&sansLecon&guides=0&sans=echauffement&cran=conseille&meteo=beau";
for (const nom of NOMS) {
  const p = PROFILS[nom], a = new Appareil(nom, { serveur, ralenti: false });
  console.log(`\n${nom} : ${p.largeur} × ${p.hauteur}`);
  await a.ouvrir({ q: Q }); await a.installer();
  const vis = (s, ms = 30000) => a.attendre((s) => [...document.querySelectorAll(s)].some((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true })), ms, s);
  // une série de redimensionnements sur l'écran du moment
  const secouer = async (ecran, { question = false } = {}) => {
    await a.page.evaluate(() => { window.__marque = (window.__marque ?? 0) + 1; });
    const nav = await a.page.evaluate(() => performance.getEntriesByType("navigation").length);
    for (let c = 0; c < CYCLES; c++) {
      await a.redimensionner({ dh: 48 });
      await a.redimensionner({ dh: Math.round(p.hauteur / 2) });
      await a.redimensionner({ dw: Math.round(p.largeur * 0.4) });
    }
    const r = await a.page.evaluate(() => { const b = document.getElementById("stage").getBoundingClientRect(); return { marque: window.__marque ?? 0, nav: performance.getEntriesByType("navigation").length, dedans: b.left >= -0.5 && b.top >= -0.5 && b.right <= innerWidth + 0.5 && b.bottom <= innerHeight + 0.5, plein: Math.abs(b.width - innerWidth) < 1 || Math.abs(b.height - innerHeight) < 1 }; }).catch(() => ({ marque: 0 }));
    const noir = await a.noir().catch(() => 1);
    let repond = true;
    // (la réponse acceptée : le compteur de questions de la séance avance)
    if (question) { repond = await a.page.evaluate(ATTEND).catch(() => false); if (repond) { const n0 = await a.page.evaluate(() => window.__app.session?.rec?.questions ?? 0); await a.page.evaluate(REPONDRE, true); repond = await a.attendre((n0) => (window.__app.session?.rec?.questions ?? 0) > n0, 30000, n0).then(() => true, () => false); } }
    await a.page.screenshot({ path: join(OUT, `${nom}-${ecran.replace(/\W+/g, "-")}.png`) });
    check(r.marque > 0 && r.nav === nav && r.dedans && r.plein && noir < 0.2 && repond, `${nom}, ${ecran} : ${CYCLES * 3} redimensionnements, la page ne se recharge pas, la scène tient dans la fenêtre${question ? ", la question attend encore et accepte sa réponse" : ""} (noir ${(noir * 100).toFixed(1)} %)`);
  };
  // (un écran pas atteint : un échec, avec la capture et l'état de la page, et le parcours continue)
  const ecran = async (nomE, fn) => { try { await fn(); } catch (e) { const etat = await a.page.evaluate(ECRAN).catch(() => "?"); await a.page.screenshot({ path: join(OUT, `${nom}-${nomE.replace(/\W+/g, "-")}-ECHEC.png`) }).catch(() => {}); check(false, `${nom}, ${nomE} : pas atteint (${e.message.split("\n")[0]} ; écran : ${etat})`); } };
  const exercice = async (choix, nomEx) => { await a.relancer({ q: `${Q}&choix=${choix}` }); await a.deuxTouchers(".galet.play"); await a.attendre(ATTEND, 120000); await a.page.waitForTimeout(800); await secouer(nomEx, { question: true }); };
  await ecran("accueil", async () => { await a.relancer({ q: Q }); await vis(".galet.play"); await secouer("accueil"); });
  await ecran("choisir", async () => { await a.deuxTouchers(".galet.choisir"); await vis(".choix-ex"); await secouer("choisir"); });
  await ecran("menu des leçons", async () => { await a.relancer({ q: Q }); await a.deuxTouchers(".galet.leconskey"); await vis(".lecons-tuile"); await secouer("menu des leçons"); });
  await ecran("une leçon", async () => { await a.deuxTouchers('.lecons-tuile[data-key="L1"]'); await a.page.waitForTimeout(4000); await secouer("une leçon"); });
  for (const [c, n] of [["1:3", "ligne graduée"], ["2:1", "additions"], ["3:1", "calcul rapide"], ["4:1", "voiliers"], ["5:1", "multiplication"], ["6:2", "étal"]]) await ecran(n, () => exercice(c, n));
  await ecran("accueil en pause", async () => { await a.attendre(ATTEND, 60000).catch(() => {}); await a.page.waitForTimeout(800); await a.toucher(".session-home"); await vis(".keep.play"); await secouer("accueil en pause"); });
  await ecran("récif", async () => { await a.relancer({ q: Q }); await a.deuxTouchers(".galet.reefkey"); await vis(".boutique-cle"); await a.page.waitForTimeout(1500); await secouer("récif"); });
  await ecran("boutique", async () => { await a.toucher(".boutique-cle"); await vis(".boutique-tuile"); await secouer("boutique"); });
  await ecran("album", async () => { await a.relancer({ q: Q }); await a.deuxTouchers(".galet.albumkey"); await a.attendre(() => window.__app.album?.open, 20000); await secouer("album"); });
  await ecran("espace parent", async () => { await a.relancer({ q: Q }); await a.page.waitForTimeout(1000); await a.toucher(".logo", { ms: 2400 }); await vis(".pa-keys"); await secouer("espace parent"); });
  check(!a.erreurs.length, `${nom} : aucune erreur dans la page${a.erreurs.length ? ` (${a.erreurs[0]})` : ""}`);
  await a.detruire();
}
await serveur.fermer();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nredimension : jamais de rechargement, la scène se remet à l'échelle");
process.exitCode = fail.length ? 1 : 0;
