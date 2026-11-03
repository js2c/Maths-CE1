// MESURE DES SÉANCES D'ADDITIONS (lot « Correctifs de la confrontation 2 », écarts 2.6, 6.10 et 6.11 de docs/ECARTS-SPEC-2.md) :
// sur l'année simulée (tests/sim-recette.mjs, le moteur de l'application), pour chaque profil et chaque rythme, les séances dont
// la notion du jour est les additions (« jouer ») : leur durée, la durée de la notion du jour, la part des questions sur la
// famille en cours, les faits nouveaux par séance (échauffement et notion du jour).
//   node tests/recette-fonctionnelle/mesure-additions.mjs [--profils reel,sait,diff] [--rythmes 2,3] [--detail]
import { readFileSync } from "node:fs";
import { simulate } from "../sim-recette.mjs";
import { dateOf } from "../../app/js/session/rewards.js";
const cal = JSON.parse(readFileSync(new URL("../../app/content/calendrier.json", import.meta.url)));
const hol = cal.vacances.map((v) => [new Date(dateOf(v.debut)), new Date(dateOf(v.reprise))]), fin = new Date(dateOf("2027-07-02") + 86400000);
const days = (perWeek) => { const out = []; let d = new Date("2026-09-28T00:00:00"); const wd = { 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5] }[perWeek];
  while (d < fin) { if (!hol.some(([a, b]) => d >= a && d < b) && wd.includes(d.getDay())) out.push(new Date(d)); d = new Date(d.getTime() + 86400000); } return out; };
const argv = process.argv.slice(2), val = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const profils = (val("--profils") ?? "reel,sait,diff").split(","), rythmes = (val("--rythmes") ?? "2,3").split(",").map(Number);
const moy = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN), f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : "-");
console.log("| profil | rythme | séances d'additions | durée moyenne (min) | durée min – max | sous 9 min | notion du jour moyenne (min) | part de la famille : moyenne, min | faits nouveaux : moyenne, max | séances à plus de 8 faits nouveaux |");
console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const profil of profils) for (const r of rythmes) {
  const res = await simulate({ profil, jours: days(r), seed: 7 });
  const add = res.filter((x) => x.module === 2), d = add.map((x) => x.duree), part = add.map((x) => x.partFamille).filter((x) => x != null), nv = res.map((x) => x.nouveaux);
  console.log(`| ${profil} | ${r}/sem | ${add.length} | ${f1(moy(d))} | ${f1(Math.min(...d))} – ${f1(Math.max(...d))} | ${d.filter((x) => x < 9).length} | ${f1(moy(add.map((x) => x.notionS / 60)))} | ${Math.round(moy(part) * 100)} %, ${Math.round(Math.min(...part) * 100)} % | ${f1(moy(nv))}, ${Math.max(...nv)} | ${nv.filter((x) => x > 8).length} |`);
  if (argv.includes("--detail")) for (const x of add) console.log(`    séance ${x.n} (${x.date}) famille ${x.famille} : ${x.duree} min, notion ${f1(x.notionS / 60)} min, ${x.asked.length} questions, part ${Math.round((x.partFamille ?? 0) * 100)} %, ${x.nouveaux} faits nouveaux`);
}
