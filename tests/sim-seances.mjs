// RECETTE : simule N séances pour un profil d'enfant (voir tests/sim-recette.mjs) et affiche, séance par séance,
// le niveau de la ligne, les additions posées, les étoiles et les cartes.
//   node tests/sim-seances.mjs [sait|reel|diff] [séances par semaine : 2|3|5] [nombre de séances]
import { simulate, PROFILS } from "./sim-recette.mjs";
const hol=[["2026-10-17","2026-11-02"],["2026-12-19","2027-01-04"],["2027-02-06","2027-02-22"],["2027-04-03","2027-04-19"]].map(([a,b])=>[new Date(a),new Date(b)]);
const days = (perWeek, n) => { const out=[]; let d=new Date("2026-09-28T00:00:00"); const wd = perWeek===2?[1,4]:perWeek===3?[1,3,5]:[1,2,3,4,5];
  while(out.length<n){ if(!hol.some(([a,b])=>d>=a&&d<b) && wd.includes(d.getDay())) out.push(new Date(d)); d=new Date(d.getTime()+86400000);} return out; };
const [profil="reel", perWeek="2", n="30"] = process.argv.slice(2);
const res = await simulate({ profil, jours: days(+perWeek, +n), seed: 7 });
console.log(`# profil ${PROFILS[profil].nom}, ${perWeek}/sem`);
for (const r of res) console.log(`${r.n}\t${r.date}\tniv ${r.niv0}->${r.niv1}\tq=${r.questions}\t${r.duree}min\t★${r.etoiles}\tarc${r.arc}${r.doree?" DORÉE":""}\tcartes ${r.nbCartes} [${r.cartes.join(",")}]\tfaits vus ${r.faitsVus} boîtes ${r.boites.join("/")}\tchauffe: ${r.faits.join(" ")}\tligne: ${r.ligne.join(" ")}${r.lecons.length?" leçons "+r.lecons.join(","):""}`);
