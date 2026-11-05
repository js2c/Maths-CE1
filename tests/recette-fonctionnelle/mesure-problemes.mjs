// MESURES DU LOT « PROBLÈMES » (docs/LOTS.md, fiche 20) : l'année simulée (tests/sim-recette.mjs, le moteur de l'application, graine
// 7 ; --graines pour d'autres), pour chaque profil et chaque rythme :
//  - l'étape fixe « Problème du jour » : la part des séances « jouer » où elle est sautée faute de temps (au-delà d'une sur vingt, la
//    fiche demande de s'arrêter), sa durée, le nombre de problèmes qu'elle tient ;
//  - le temps pour parcourir les 9 niveaux (départ au niveau 2) : la semaine où chaque niveau est acquis, à 1 et à 2 problèmes par soir
//    (module7.json, etape.problemes) ;
//  - la durée des séances et celle de la notion du jour, avant le lot (l'étape fixe désactivée : la notion garde ses 6 minutes) et
//    après ; en particulier dans les séances d'additions ;
//  - les étoiles de mer gagnées par séance, avant et après.
//   node tests/recette-fonctionnelle/mesure-problemes.mjs [--profils reel,sait,diff] [--rythmes 2,3,5] [--problemes 1,2] [--avant] [--json f]
import { readFileSync, writeFileSync } from "node:fs";
import { simulate, contenu } from "../sim-recette.mjs";
import { dateOf } from "../../app/js/session/rewards.js";
const cal = JSON.parse(readFileSync(new URL("../../app/content/calendrier.json", import.meta.url)));
const hol = cal.vacances.map((v) => [new Date(dateOf(v.debut)), new Date(dateOf(v.reprise))]), DEBUT = new Date("2026-09-28T00:00:00"), fin = new Date(dateOf("2027-07-02") + 86400000);
const days = (perWeek) => { const out = []; let d = new Date(DEBUT); const wd = { 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5] }[perWeek];
  while (d < fin) { if (!hol.some(([a, b]) => d >= a && d < b) && wd.includes(d.getDay())) out.push(new Date(d)); d = new Date(d.getTime() + 86400000); } return out; };
const argv = process.argv.slice(2), val = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const PROFILS = (val("--profils") ?? "reel,sait,diff").split(","), RYTHMES = (val("--rythmes") ?? "2,3,5").split(",").map(Number), NB = (val("--problemes") ?? "2").split(",").map(Number), GRAINES = (val("--graines") ?? "7").split(",").map(Number);
const etape = contenu.seance.etapes.find((e) => e.id === "probleme"), actif0 = etape.actif;
const moy = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN), f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : "-");
const semaine = (date) => { const [j, m, a] = date.split("/").map(Number); return Math.floor((new Date(a, m - 1, j) - DEBUT) / (7 * 86400000)) + 1; };
const out = [];
for (const graine of GRAINES) for (const profil of PROFILS) for (const r of RYTHMES) for (const nb of [...(argv.includes("--avant") ? [0] : []), ...NB]) {
  etape.actif = nb > 0 ? actif0 : false; contenu.module7.etape.problemes = nb || 2;
  const res = await simulate({ profil, jours: days(r), seed: graine });
  const jouer = res.filter((x) => x.module !== 7), pb = jouer.filter((x) => x.problemeSaute !== "exercice du jour");
  const sautees = pb.filter((x) => x.problemeSaute === "temps écoulé").length, faites = pb.filter((x) => x.problemeS != null);
  // les niveaux acquis : la séance où chacun l'est (la fiche de la séance garde les niveaux acquis à sa fin)
  const acquis = {}; for (const x of res) for (const n of x.acquis7 ?? []) acquis[n] ??= { seance: x.n, semaine: semaine(x.date), date: x.date };
  const add = res.filter((x) => x.module === 2);
  const o = { graine, profil, rythme: r, problemes: nb, seances: res.length, sautees, avecEtape: pb.length, etapeS: moy(faites.map((x) => x.problemeS)), parEtape: moy(faites.map((x) => (x.problemeDuJour ?? []).length)), un: faites.filter((x) => (x.problemeDuJour ?? []).length === 1).length,
    duree: moy(res.map((x) => x.duree)), sous9: res.filter((x) => x.duree < 9).length, notion: moy(res.map((x) => x.notionS2).filter((x) => x != null)) / 60, dureeAdd: moy(add.map((x) => x.duree)), sous9Add: add.filter((x) => x.duree < 9).length, nAdd: add.length,
    etoiles: moy(res.map((x) => x.etoiles)), niveauFin: res.at(-1).nivProbleme1 ?? res.at(-1).nivProbleme0 ?? null, acquis };
  out.push(o);
  console.error(`graine ${graine} · ${profil} ${r}/sem · ${nb ? `${nb} problème(s) au plus` : "avant (sans étape fixe)"} : ${sautees}/${pb.length} sautées, niveau ${o.niveauFin}`);
}
etape.actif = actif0;
if (val("--json")) writeFileSync(val("--json"), JSON.stringify(out, null, 1));
const lbl = (o) => (o.problemes ? `${o.problemes} au plus` : "avant le lot");
console.log("| profil | rythme | problèmes par soir | étape sautée (temps écoulé) | durée de l'étape (s) | problèmes par étape | étapes à un seul problème | séance : durée moyenne (min), sous 9 min | notion du jour (min) | séances d'additions : durée (min), sous 9 min | étoiles de mer par séance |");
console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const o of out) console.log(`| ${o.profil} | ${o.rythme}/sem | ${lbl(o)} | ${o.problemes ? `${o.sautees} sur ${o.avecEtape} (${Math.round((100 * o.sautees) / Math.max(1, o.avecEtape))} %)` : "-"} | ${f1(o.etapeS)} | ${f1(o.parEtape)} | ${o.problemes ? o.un : "-"} | ${f1(o.duree)}, ${o.sous9} sur ${o.seances} | ${f1(o.notion)} | ${f1(o.dureeAdd)}, ${o.sous9Add} sur ${o.nAdd} | ${f1(o.etoiles)} |`);
console.log("\n| profil | rythme | problèmes par soir | semaine où chaque niveau est acquis (2 à 9) | niveau en fin d'année |");
console.log("| --- | --- | --- | --- | --- |");
for (const o of out.filter((x) => x.problemes)) console.log(`| ${o.profil} | ${o.rythme}/sem | ${lbl(o)} | ${[2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${n} : ${o.acquis[n] ? `s. ${o.acquis[n].semaine}` : "—"}`).join(" · ")} | ${o.niveauFin} |`);
