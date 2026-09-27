// RECETTE : simule N séances pour un profil d'enfant (voir tests/sim-recette.mjs) et affiche, séance par séance,
// le niveau de la ligne, les additions posées, les étoiles et les cartes ; puis le bilan des cartes (lot 2) :
// dates où chaque zone s'ouvre et se complète, légendaires, brillantes, quota jamais dépassé.
//   node tests/sim-seances.mjs [sait|reel|diff] [séances par semaine : 2|3|5] [nombre de séances, ou « annee » : jusqu'au 2 juillet 2027] [--court]
// Les zones 3 et 4 sont considérées prêtes (contenu fictif). --court : seulement le bilan.
import { readFileSync } from "node:fs";
import { simulate, PROFILS } from "./sim-recette.mjs";
import { dateOf } from "../app/js/session/rewards.js";
const cal = JSON.parse(readFileSync(new URL("../app/content/calendrier.json", import.meta.url)));
const hol = cal.vacances.map((v) => [new Date(dateOf(v.debut)), new Date(dateOf(v.reprise))]), fin = new Date(dateOf("2027-07-02") + 86400000);
const days = (perWeek, n) => { const out = []; let d = new Date("2026-09-28T00:00:00"); const wd = perWeek === 2 ? [1, 4] : perWeek === 3 ? [1, 3, 5] : [1, 2, 3, 4, 5];
  while (n === "annee" ? d < fin : out.length < n) { if (!hol.some(([a, b]) => d >= a && d < b) && wd.includes(d.getDay())) out.push(new Date(d)); d = new Date(d.getTime() + 86400000); } return out; };
const args = process.argv.slice(2).filter((a) => !a.startsWith("--")), court = process.argv.includes("--court");
const [profil = "reel", perWeek = "2", n = "30"] = args;
const res = await simulate({ profil, jours: days(+perWeek, n === "annee" ? "annee" : +n), seed: 7 });
console.log(`# profil ${PROFILS[profil].nom}, ${perWeek}/sem, ${res.length} séances`);
if (!court) for (const r of res) console.log(`${r.n}\t${r.date}\tniv ${r.niv0}->${r.niv1}\tq=${r.questions}\t${r.duree}min\t★${r.etoiles}\tarc${r.arc}${r.doree ? " DORÉE" : ""}${r.surprise ? ` surprise ${r.surprise}` : ""}\tcartes ${r.nbCartes}/${r.quota} [${r.cartes.join(",")}]${r.zones.length ? ` ZONE ${r.zones.join(",")}` : ""}\tfaits vus ${r.faitsVus} boîtes ${r.boites.join("/")}\tchauffe: ${r.faits.join(" ")}\tligne: ${r.ligne.join(" ")}${r.lecons.length ? " leçons " + r.lecons.join(",") : ""}`);
// bilan des cartes
const first = (f) => res.find(f)?.date ?? "jamais";
const zoneDone = (z, k) => first((r) => r.ouvertes.includes(z) && r.nbCartes >= k);
console.log(`\n## cartes (${perWeek} séances par semaine, zones 3 et 4 prêtes)`);
console.log(`ouverture : récif de corail ${first((r) => r.zones.includes("corail"))}, grand large ${first((r) => r.zones.includes("large"))}, abysses ${first((r) => r.zones.includes("abysses"))}`);
console.log(`cartes : 15 ${first((r) => r.nbCartes >= 15)}, 30 ${first((r) => r.nbCartes >= 30)}, 45 ${first((r) => r.nbCartes >= 45)}, 60 ${first((r) => r.nbCartes >= 60)} ; fin : ${res.at(-1).nbCartes} cartes dont ${res.at(-1).legendaires} légendaires, ${res.at(-1).brillantes} brillantes`);
console.log(`étoiles dorées gagnées : ${res.filter((r) => r.doree).length} (en réserve à la fin : ${res.at(-1).doreesDispo}) ; étoiles arc-en-ciel en réserve à la fin : ${res.at(-1).arcDispo}`);
console.log(`coquillages : ${res.reduce((a, r) => a + r.cartes.length, 0)} (${res.reduce((a, r) => a + (r.nouvelles ?? 0), 0)} cartes nouvelles, ${res.reduce((a, r) => a + r.cartes.filter((c) => c.includes("doublon")).length, 0)} doublons) ; séances sans coquillage : ${res.filter((r) => !r.cartes.length).length}`);
console.log(`quota dépassé : ${res.some((r) => r.depasse) ? "OUI (erreur)" : "jamais"} ; surprises : ${res.filter((r) => r.surprise).length} sur ${res.length} séances`);
void zoneDone;
