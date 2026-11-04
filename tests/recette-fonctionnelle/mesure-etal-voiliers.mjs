// L'ÉTAL ET LES VOILIERS AVEC LE PROBLÈME DU JOUR (décision du parent du 4 novembre 2026 : le problème du jour ne prend pas sur leur
// notion du jour, il s'ajoute à la séance) : des séances simulées (tests/sim-recette.mjs, graine 7) où l'enfant choisit toujours l'étal ou
// les voiliers, à quelques niveaux, profils reel, sait et diff : la durée de la séance (le plafond : seance.json, dureeMaxMin, 12
// minutes), la notion du jour, le problème du jour (sauté ou non, sa durée).
//   node tests/recette-fonctionnelle/mesure-etal-voiliers.mjs [--seances 12]
import { simulate, contenu } from "../sim-recette.mjs";
const argv = process.argv.slice(2), N = Number(argv.includes("--seances") ? argv[argv.indexOf("--seances") + 1] : 12);
const jours = []; for (let d = new Date("2026-11-09T00:00:00"); jours.length < N; d = new Date(d.getTime() + 86400000)) if ([1, 3, 5].includes(d.getDay())) jours.push(new Date(d));
const moy = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN), f1 = (x) => (Number.isFinite(x) ? x.toFixed(1).replace(".", ",") : "-");
console.log(`Plafond de la séance : ${contenu.seance.dureeMaxMin} min. ${N} séances par ligne (lundi, mercredi, vendredi), l'enfant choisit toujours l'exercice et le niveau.\n`);
console.log("| exercice | niveau | profil | séance : moyenne, la plus longue (min) | notion du jour (min) | problème du jour : fait, sauté | durée du problème du jour (s) |");
console.log("| --- | --- | --- | --- | --- | --- | --- |");
let max = 0, sautes = 0, total = 0;
for (const [module, nom, niveaux] of [[6, "étal", [1, 4, 7, 10]], [4, "voiliers", [1, 5, 9]]]) for (const niveau of niveaux) for (const profil of ["reel", "sait", "diff"]) {
  const res = await simulate({ profil, jours, seed: 7, choix: { module, niveau } });
  const d = res.map((x) => x.duree), fait = res.filter((x) => x.problemeS != null), saute = res.filter((x) => x.problemeSaute === "temps écoulé");
  max = Math.max(max, ...d); sautes += saute.length; total += res.length;
  console.log(`| ${nom} | ${niveau} | ${profil} | ${f1(moy(d))}, ${f1(Math.max(...d))} | ${f1(moy(res.map((x) => x.notionS2).filter((x) => x != null)) / 60)} | ${fait.length}, ${saute.length} | ${f1(moy(fait.map((x) => x.problemeS)))} |`);
}
console.log(`\nLa séance la plus longue : ${f1(max)} min (plafond ${contenu.seance.dureeMaxMin}) ; problème du jour sauté faute de temps : ${sautes} séances sur ${total}.`);
