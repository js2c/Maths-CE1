// RECETTE : simule N séances pour un profil d'enfant (voir tests/sim-recette.mjs) et affiche, séance par séance,
// le niveau de la ligne, les additions posées, les étoiles et les cartes ; puis le bilan des cartes (lot 2) :
// dates où chaque zone s'ouvre et se complète, légendaires, brillantes, quota jamais dépassé.
//   node tests/sim-seances.mjs [sait|reel|diff|tresdur|facile] [séances par semaine : 2|3|5] [nombre de séances, ou « annee » : jusqu'au 2 juillet 2027] [--court]
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
if (!court) for (const r of res) console.log(`${r.n}\t${r.date}\t${r.cranDepart}${r.descentes ? `->${r.cran}` : ""}\t${r.module === 2 ? "additions" : `niv ${r.niv0}->${r.niv1}`}\tq=${r.questions} ${Math.round((r.reussite ?? 0) * 100)}% nsp ${r.nsp} nouveaux ${r.nouveaux}\t${r.duree}min\tm${r.module}${r.defi !== undefined ? ` défi ${r.defi}${r.record ? "!" : ""}` : ""}${r.module === 2 ? ` f${r.famille}` : ""}\t★${r.etoiles}\tarc${r.arc}${r.doree ? " DORÉE" : ""}${r.surprise ? ` surprise ${r.surprise}` : ""}\tcartes ${r.nbCartes}/${r.quota} [${r.cartes.join(",")}]${r.zones.length ? ` ZONE ${r.zones.join(",")}` : ""}\tfaits vus ${r.faitsVus} boîtes ${r.boites.join("/")}\tchauffe: ${r.faits.join(" ")}\tligne: ${r.ligne.join(" ")}${r.lecons.length ? " leçons " + r.lecons.join(",") : ""}`);
// lot 2, étape 2 : faits nouveaux, familles 1 et 2, niveaux, sélecteur de difficulté (docs/SPEC-LOT2.md, section 8)
const avant7 = res.slice(0, 6).at(-1), withRoom = res.filter((r, i) => i === 0 || res[i - 1].faitsVus < 33);
const moy = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
console.log(`\n## séance et progression (${PROFILS[profil].nom})`);
console.log(`faits vus avant la 7e séance : ${avant7?.faitsVus ?? "-"} sur 33 ; 33 faits vus à la séance ${res.find((r) => r.faitsVus >= 33)?.n ?? "jamais"}`);
console.log(`faits nouveaux par séance tant qu'il en reste : ${withRoom.map((r) => r.nouveaux).join(" ")} (moyenne ${moy(withRoom.map((r) => r.nouveaux)).toFixed(1)}, minimum ${Math.min(...withRoom.map((r) => r.nouveaux))}) ; boîte 1 au début de ces séances : ${withRoom.map((r, i) => (i ? res[i - 1].boites[0] : 0)).join(" ")}`);
console.log(`ligne graduée : niveau 8 atteint à la séance ${res.find((r) => r.niv1 >= 8)?.n ?? "jamais"} ; niveau 9 (nombres jusqu'à 1 000) à la séance ${res.find((r) => r.niv1 >= 9)?.n ?? "jamais"}, niveau 13 à la séance ${res.find((r) => r.niv1 >= 13)?.n ?? "jamais"}, niveau à la fin ${res.filter((r) => r.niv1).at(-1)?.niv1 ?? "-"} ; séances avec plusieurs niveaux franchis : ${res.filter((r) => r.niv1 - r.niv0 >= 2).length} ; leçons revues deux fois dans une séance : ${res.filter((r) => new Set(r.lecons).size < r.lecons.length).length}`);
const first10 = res.slice(0, 10);
console.log(`sélecteur (10 premières séances) : réussite moyenne ${Math.round(moy(first10.map((r) => r.reussite ?? 0)) * 100)} % ; « je ne sais pas » ${moy(first10.map((r) => r.nsp)).toFixed(1)} par séance ; descentes de cran ${first10.reduce((a, r) => a + r.descentes, 0)} ; étoiles par séance ${moy(first10.map((r) => r.etoiles)).toFixed(1)} ; durée estimée ${moy(first10.map((r) => r.duree)).toFixed(1)} min`);
// lot 2, étape 6 : alternance de la notion du jour, familles du module 2
const mods = res.map((r) => r.module), deux = mods.filter((m, i) => i && m === mods[i - 1]).length;
console.log(`\n## module 2 et alternance (${PROFILS[profil].nom})`);
console.log(`notion du jour : ${mods.filter((m) => m === 1).length} séances de ligne graduée, ${mods.filter((m) => m === 2).length} d'additions ; deux fois de suite le même module : ${deux}`);
const famDate = (k, id) => res.find((r) => r[k].includes(id))?.n ?? "-";
console.log(`familles (séance où elle s'ouvre / est acquise / ouvre ses formes à trou) : ${[1, 2, 3, 4, 5, 6, 7].map((id) => `${id}: ${famDate("fOuvertes", id)}/${famDate("fAcquises", id)}/${famDate("fTrou", id)}`).join(" ; ")}`);
console.log(`45 faits vus à la séance ${res.find((r) => r.faitsVus >= 45)?.n ?? "jamais"} ; leçons du module 2 : ${res.flatMap((r) => r.lecons.filter((l) => ["L4", "L5", "L6"].includes(l)).map((l) => `${l} (séance ${r.n})`)).join(", ") || "aucune"}`);
const m2 = res.filter((r) => r.module === 2);
console.log(`séances d'additions : ${moy(m2.map((r) => r.add.filter((x) => !x.includes("g")).length)).toFixed(1)} questions en moyenne, durée estimée ${moy(m2.map((r) => r.duree)).toFixed(1)} min ; formes à trou ${m2.reduce((a, r) => a + r.add.filter((x) => x.includes("?")).length, 0)} sur ${m2.reduce((a, r) => a + r.add.length, 0)}`);
// lot 2, étape 7 : le défi record
const defis = res.filter((r) => r.defi !== undefined), sautes = {};
for (const r of res) if (r.defiSaute) sautes[r.defiSaute] = (sautes[r.defiSaute] ?? 0) + 1;
console.log(`\n## défi record (${PROFILS[profil].nom})`);
console.log(`premier défi à la séance ${defis[0]?.n ?? "jamais"} ; ${defis.length} défis sur ${res.length} séances (sautés : ${Object.entries(sautes).map(([k, n]) => `${k} ${n}`).join(", ") || "aucun"}) ; scores : ${defis.slice(0, 5).map((r) => r.defi).join(" ")}${defis.length > 5 ? ` … ${defis.slice(-3).map((r) => r.defi).join(" ")}` : ""} ; meilleur ${Math.max(0, ...defis.map((r) => r.defi))} ; records battus ${defis.filter((r) => r.record).length} ; durée moyenne des séances avec défi ${moy(defis.map((r) => r.duree)).toFixed(1)} min`);
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
