// LA REPRISE À LA QUESTION PRÈS (lot « Banc Android et recette en conditions réelles » ; décision du parent du 17 octobre 2026 :
// après un rechargement, la séance ne repart plus au début de l'étape). Sur le banc Android (tests/e2e/appareils.mjs, la tablette
// de référence, l'application installée), la page est rechargée à chaque étape d'une séance et au milieu de chaque exercice :
//  - une question à l'écran, sans réponse : après « continuer », la même question est reposée ; la frise garde ses ronds ;
//  - une réponse fausse, la correction à l'écran : la réponse est enregistrée (comptée fausse, dans les réponses du parent), la
//    frise a un rond de plus, et c'est la question suivante ;
//  - une leçon en cours : elle est rejouée ; l'exercice guidé qui suit une leçon : reposé ;
//  - la récompense : la séance est terminée, rien à reprendre.
// (Le défi record repart à son début, comme avant : une minute chronométrée ne se reprend pas au milieu ; il est vérifié par
// tests/e2e/decisions-agent.mjs, partie 1.)
//   node tests/e2e/reprise.mjs [--profil s5e] [--seul seance|exercices]
// BANC ANDROID, raccourcis : voix rapide
// (raison : le parcours recharge la page une trentaine de fois, à des moments précis d'une séance et de six exercices ; la voix à
// sa vitesse réelle ne changerait rien à ce qui est repris, mais triplerait sa durée ; la vraie voix après un rechargement est
// éprouvée par journee.mjs, étape 9, et enfant.mjs --android.)
import { Appareil, serveurBanc, REFERENCE } from "./appareils.mjs";
import { ATTEND, REPONDRE } from "./jeu.mjs";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PROFIL = arg("--profil", REFERENCE), SEUL = arg("--seul", null);
const OUT = resolve("tests/e2e/out/reprise"); mkdirSync(OUT, { recursive: true });
const fail = []; const check = (ok, what) => { console.log(`${ok ? "ok  " : "ÉCHEC"} ${what}`); if (!ok) fail.push(what); };
const serveur = await serveurBanc();
const a = new Appareil(PROFIL, { serveur, ralenti: false });
const Q = "?voix=rapide&cran=conseille&meteo=beau";

// l'état de la séance, vu de la page : l'étape, la frise, les réponses comptées, la question posée (ses données qui comptent)
const ETAT = () => {
  const s = window.__app.session, q = s?.enCours, k = {};
  if (q) for (const f of ["module", "format", "forme", "a", "b", "op", "n", "answer", "fait", "k", "lo", "hi", "type", "prix", "valeur", "niveau", "cible", "revient"]) if (q[f] !== undefined && (typeof q[f] !== "object" || q[f] === null)) k[f] = q[f];
  return s?.rec ? { id: s.rec.id, etape: s.progress.etape, faites: s.progress.faites, prevues: s.progress.prevues, frise: window.__app.frieze.p.faites, questions: s.rec.questions, justes: s.rec.justes, cle: q ? JSON.stringify(k) : null, lecon: s.rec.pointReprise?.encours?.lecon ?? null } : null;
};
const etat = () => a.page.evaluate(ETAT);
const reponses = (id) => a.page.evaluate(async (id) => (await window.__app.store.all("reponses")).filter((r) => r.seance === id).map((r) => ({ juste: r.juste, t: r.t })), id);
const attendreQuestion = async (ms = 120000) => { await a.attendre(ATTEND, ms); await a.page.waitForTimeout(400); };
const repondre = async (juste) => { const n0 = (await etat()).questions; await a.page.evaluate(REPONDRE, juste); await a.attendre((n0) => (window.__app.session?.rec?.questions ?? 0) > n0, 30000, n0); };
const vis = (s, ms = 30000) => a.attendre((s) => [...document.querySelectorAll(s)].some((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true })), ms, s);
let captures = 0;
const capture = (nom) => a.page.screenshot({ path: join(OUT, `${String(++captures).padStart(2, "0")}-${nom}.png`) }).catch(() => {});

// le rechargement, puis « continuer » à l'accueil en pause ; renvoie l'état repris
async function recharger(nom, { photo = false } = {}) {
  const avant = await etat();
  await a.recharger();
  await vis(".keep.play", 60000).catch(() => {});
  const offerte = await a.page.evaluate(() => ({ attente: !!window.__app.repriseEnAttente, id: window.__app.repriseEnAttente?.id ?? null }));
  if (photo) await capture(`${nom}-accueil-en-pause`);
  // (l'enfant imprévisible, graine 20 : à la reprise d'un échauffement dont la réponse était donnée, le pavé paraissait le temps
  // d'enregistrer cette réponse, sans question à l'écran ; regardé à chaque image, de « continuer » à la question)
  await a.page.evaluate(() => { window.__paveSansQuestion = 0; const f = () => { const x = window.__app; const k = [...document.querySelectorAll(".key:not(.etal-key)")].some((e) => !e.closest(".stash") && e.checkVisibility({ visibilityProperty: true, opacityProperty: true })); if (k && !x.enPause && !x.facts?.q && !x.dictation?.on && !x.warmupPending && !x.challenge) window.__paveSansQuestion++; requestAnimationFrame(f); }; requestAnimationFrame(f); });
  check(offerte.attente && offerte.id === avant.id, `${nom} : rechargée, la séance attend à l'accueil en pause, « continuer » offert`);
  await a.deuxTouchers(".keep.play");
  await a.attendre((id) => { const x = window.__app; return !x.enPause && !x.repriseEnAttente && x.session?.rec?.id === id; }, 30000, avant.id);
  return avant;
}
// la question sans réponse : la même, reposée
async function sansReponse(nom) {
  await attendreQuestion();
  const avant = await recharger(`${nom}, question sans réponse`, { photo: true });
  await attendreQuestion(); const apres = await etat();
  await capture(`${nom}-question-reposee`);
  check(apres.cle === avant.cle && apres.etape === avant.etape && apres.questions === avant.questions && apres.frise === avant.frise && apres.faites === avant.faites,
    `${nom}, question sans réponse : la même question est reposée (${avant.cle === apres.cle ? "même question" : `${avant.cle} -> ${apres.cle}`}) ; la frise garde ses ${apres.frise} rond(s) (questions comptées ${avant.questions} -> ${apres.questions})`);
  return apres;
}
// la réponse fausse, la correction à l'écran : enregistrée ; la question suivante
async function reponseFausse(nom, repondreFaux = null) {
  await attendreQuestion();
  const avant = await etat(), reps0 = await reponses(avant.id);
  if (repondreFaux) await a.page.evaluate(repondreFaux); else await a.page.evaluate(REPONDRE, false);
  // (dès que la réponse est écrite dans la base : la correction commence à peine)
  for (let i = 0; i < 150 && !(await a.page.evaluate(async (id) => !!(await window.__app.store.get("seances", id))?.pointReprise?.encours?.reponse, avant.id).catch(() => false)); i++) await a.page.waitForTimeout(100);
  const enCorrection = await a.page.evaluate(() => (window.__app.session?.rec?.questions ?? 0));
  await recharger(`${nom}, réponse fausse`);
  await attendreQuestion(); const apres = await etat(), reps = await reponses(avant.id);
  const pave = await a.page.evaluate(() => window.__paveSansQuestion ?? 0);
  check(pave === 0, `${nom}, réponse fausse : jamais le pavé sans question pendant la reprise (${pave} image(s))`);
  check(apres.questions === avant.questions + 1 && apres.justes === avant.justes && apres.frise === avant.frise + 1 && reps.length === reps0.length + 1 && reps.at(-1).juste === false && apres.cle !== avant.cle,
    `${nom}, réponse fausse pendant sa correction${enCorrection === avant.questions ? "" : " (déjà comptée)"} : enregistrée (questions ${avant.questions} -> ${apres.questions}, justes ${avant.justes} -> ${apres.justes}, réponses du parent ${reps0.length} -> ${reps.length}, la dernière ${reps.at(-1)?.juste === false ? "fausse" : "?"}) ; la frise : ${avant.frise} -> ${apres.frise} ; la question suivante (${apres.cle !== avant.cle ? "une autre" : "LA MÊME"})`);
}

await a.ouvrir({ q: Q }); await a.installer();

// ---------------------------------------------------------------- une séance : chaque étape
if (!SEUL || SEUL === "seance") {
  console.log("\nune séance, à chaque étape");
  await a.relancer({ q: `${Q}&questions=8&faits=8&guides=0` });
  await a.deuxTouchers(".galet.play");
  // l'accueil (avant la première question)
  await a.attendre(() => window.__app.session?.progress?.etape === "accueil", 30000).catch(() => {});
  if ((await etat())?.etape === "accueil") { const av = await recharger("accueil"); const ap = await etat(); check(ap.id === av.id && ["accueil", "echauffement"].includes(ap.etape), `accueil : la séance reprend (étape « ${ap.etape} »)`); }
  else console.log("     (l'accueil est passé trop vite pour y recharger la page)");
  // l'échauffement
  await a.attendre(() => window.__app.session?.progress?.etape === "echauffement", 60000);
  await attendreQuestion(); await repondre(true); await attendreQuestion(); await repondre(true);
  await sansReponse("échauffement");
  await reponseFausse("échauffement");
  await sansReponse("échauffement, après une reprise");
  // jusqu'à la notion du jour
  for (let i = 0; i < 40 && (await etat())?.etape === "echauffement"; i++) { if (await a.page.evaluate(ATTEND)) await repondre(true).catch(() => {}); else await a.page.waitForTimeout(500); }
  // la notion du jour : la leçon d'entrée, rejouée
  await a.attendre(() => window.__app.session?.progress?.etape === "notion", 60000);
  const lecon = await a.attendre(() => window.__app.session?.rec?.pointReprise?.encours?.lecon ?? (window.__app.screen?.resolve ? "aucune" : null), 60000);
  if (lecon !== "aucune") {
    await a.page.waitForTimeout(3000);
    await recharger(`notion du jour, leçon ${lecon} en cours`);
    const l2 = await a.attendre(() => window.__app.session?.rec?.pointReprise?.encours?.lecon ?? null, 30000).catch(() => null);
    await a.page.waitForTimeout(1500); await capture("lecon-rejouee");
    check(l2 === lecon, `notion du jour, leçon en cours : la leçon ${lecon} est rejouée`);
    // l'exercice guidé qui suit la leçon (« À toi ! »)
    await attendreQuestion(240000);
    await sansReponse("notion du jour, l'exercice guidé après la leçon");
    await repondre(true);
  }
  await attendreQuestion(); await repondre(true);
  await sansReponse("notion du jour");
  await reponseFausse("notion du jour");
  // jusqu'à la récompense : la séance est terminée, plus rien à reprendre
  for (let i = 0; i < 60 && ["notion", "defi"].includes((await etat())?.etape); i++) { if (await a.page.evaluate(ATTEND)) await repondre(true).catch(() => {}); else await a.page.waitForTimeout(500); }
  await a.attendre(() => window.__app.session?.progress?.etape === "recompense", 120000).catch(() => {});
  const fin = await etat();
  await a.page.waitForTimeout(1500);
  await a.recharger(); await a.page.waitForTimeout(2500);
  const r = await a.page.evaluate(async (id) => ({ attente: !!window.__app.repriseEnAttente, rec: await window.__app.store.get("seances", id) }), fin.id);
  check(fin.etape === "recompense" && !r.attente && r.rec?.terminee === true && r.rec?.reprises?.length >= 5, `récompense : rechargée, la séance est terminée, rien à reprendre ; ${r.rec?.reprises?.length} reprises notées pour le parent (${(r.rec?.reprises ?? []).map((x) => `${x.etape} ${x.ou}`).join(", ")})`);
  // ce que lit le parent
  await a.page.evaluate(async () => { await window.__app.store.setSetting("codeParent", "2468"); });
  await a.toucher(".logo", { ms: 2400 }); await vis(".pa-keys");
  for (const d of "2468") { await a.toucher(`.pa-keys [data-key="${d}"]`); await a.page.waitForTimeout(150); }
  await a.page.waitForTimeout(1200);
  await a.toucher('[data-tab="seances"]'); await a.page.waitForTimeout(1000);
  await a.toucher(".pa-session > button"); await a.page.waitForTimeout(1200);
  const texte = await a.page.evaluate(() => document.body.innerText);
  await capture("parent-historique");
  check(/a repris à la question en cours/.test(texte) && /à la question suivante \(la réponse donnée juste avant est comptée\)/.test(texte) && /à la leçon en cours/.test(texte), "l'espace parent dit où chaque étape a repris (« à la question en cours », « à la question suivante… »)");
  await a.page.evaluate(() => [...document.querySelectorAll(".pa-link, .pa-btn, button")].find((b) => /Fermer|Retour/.test(b.textContent))?.click());
}

// ---------------------------------------------------------------- au milieu de chaque exercice
if (!SEUL || SEUL === "exercices") {
  console.log("\nau milieu de chaque exercice");
  // (une séance finie aujourd'hui : l'accueil proposerait « Encore ! », l'entraînement libre ; on repart d'une base neuve)
  if (!SEUL) { await a.effacerDonnees(); await a.relancer({ q: Q }); }
  for (const [choix, nom] of [["1:3", "ligne graduée"], ["1:12", "dictée des nombres"], ["2:1", "additions"], ["3:1", "calcul rapide"], ["4:1", "voiliers"], ["5:1", "multiplication"], ["6:2", "étal"]]) {
    // (la séance précédente, arrêtée par le parent : rien à reprendre)
    await a.page.evaluate(async () => { const s = await window.__app.store.all("seances"); for (const r of s) if (!r.terminee && !r.interruption) { r.interruption = { par: "parent", t: Date.now() }; await window.__app.store.put("seances", r); } });
    await a.relancer({ q: `${Q}&sans=echauffement&sansLecon&guides=0&choix=${choix}` });
    await a.deuxTouchers(".galet.play");
    await attendreQuestion(); await repondre(true);
    await reponseFausse(nom);
    await sansReponse(nom);
    // (relecture des demandes, constat 2) aux voiliers, « je ne sais pas » est noté avant que le bateau ne soit montré
    if (choix === "4:1") await reponseFausse(`${nom}, « je ne sais pas »`, () => window.__app.voiliers.onNsp?.());
    await repondre(true);
    const e = await etat();
    check(e.questions >= 3, `${nom} : la partie continue après les reprises (${e.questions} questions comptées)`);
  }
}
check(!a.erreurs.length, `aucune erreur dans la page${a.erreurs.length ? ` (${a.erreurs[0]})` : ""}`);
await a.detruire(); await serveur.fermer();
console.log(fail.length ? `\n${fail.length} échec(s)` : "\nreprise : à la question près, à chaque étape et dans chaque exercice");
process.exitCode = fail.length ? 1 : 0;
