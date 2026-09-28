// SAUVEGARDES DE TEST (lot 3, docs/SPEC-LOT3.md, section 5) : fabrique, à partir de la simulation des séances
// (tests/sim-recette.mjs, les modules réels de l'application), un fichier de sauvegarde que l'espace parent sait
// restaurer (Données et réglages, « Restaurer une sauvegarde »). Pour essayer l'application après un mois ou trois
// mois d'usage, ou avec une enfant en difficulté, sans attendre.
//   node tools/sauvegarde-test.mjs <profil> <séances par semaine> <semaines> [--sortie fichier.json]
//   profils : sait, reel (le profil de l'évaluation), diff (en difficulté), tresdur, facile
//   exemples : node tools/sauvegarde-test.mjs reel 2 4     (un mois)
//              node tools/sauvegarde-test.mjs reel 3 12    (trois mois)
//              node tools/sauvegarde-test.mjs diff 2 6     (une enfant en difficulté)
// Les séances tombent aux jours habituels (2 par semaine : lundi et jeudi ; 3 : lundi, mercredi, vendredi ; 5 : du
// lundi au vendredi), la dernière la veille du jour de fabrication ; toutes les dates suivent l'horloge simulée, même
// celles que le moteur prend à Date.now(). Le nom de la pieuvre est « Pili » ; le code parent n'est pas dans le fichier
// (la restauration garde celui de la tablette). ATTENTION : restaurer remplace toutes les données de la tablette.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { simulate, PROFILS } from "../tests/sim-recette.mjs";
import { cleanDump } from "../app/js/parent/data.js";

const argv = process.argv.slice(2), val = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const [profil, perWeekS, weeksS] = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--sortie");
const perWeek = Number(perWeekS), weeks = Number(weeksS);
if (!PROFILS[profil] || ![1, 2, 3, 4, 5].includes(perWeek) || !(weeks >= 1 && weeks <= 45)) {
  console.error("usage : node tools/sauvegarde-test.mjs <sait|reel|diff|tresdur|facile> <séances par semaine : 1 à 5> <semaines : 1 à 45> [--sortie fichier.json]");
  process.exit(1);
}
// les jours de séance, du plus ancien au plus récent ; la dernière séance est la veille
export function seanceDays(perWeek, weeks, today = new Date()) {
  const WD = { 1: [3], 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5] }[perWeek];
  const y = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), start = new Date(y.getFullYear(), y.getMonth(), y.getDate() - weeks * 7 + 1), out = [];
  for (let d = new Date(start); d <= y; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) if (WD.includes(d.getDay())) out.push(new Date(d));
  if (!out.length || out.at(-1).getTime() !== y.getTime()) { out.pop(); out.push(y); }
  return out;
}
const jours = seanceDays(perWeek, weeks);
const res = await simulate({ profil, jours, seed: 11, zonesPretes: false, horloge: true });
const store = res.store;
await store.setSetting("mascotte", "Pili");
await store.setSetting("premierLancement", new Date(jours[0].getTime() + 18 * 3600000 - 60000).toISOString());
const dump = cleanDump(await store.dump());
const file = resolve(val("--sortie") ?? `sauvegarde-test-${profil}-${perWeek}par-semaine-${weeks}semaines.json`);
writeFileSync(file, JSON.stringify(dump, null, 1));
const n1 = (await store.get("niveaux", 1))?.niveau, n2 = await store.get("niveaux", 2);
console.log(`${file}\n${PROFILS[profil].nom} : ${res.length} séances du ${jours[0].toLocaleDateString("fr-FR")} au ${jours.at(-1).toLocaleDateString("fr-FR")} ; ligne graduée niveau ${n1 ?? 1} ; familles ouvertes ${n2?.ouvertes?.join(", ") ?? "1, 2"}, acquises ${n2?.acquises?.join(", ") || "aucune"} ; ${res.at(-1).nbCartes} cartes, ${res.at(-1).reste} étoiles en réserve.`);
console.log("Attention : restaurer ce fichier remplace toutes les données de la tablette. Faire d'abord une sauvegarde complète.");
