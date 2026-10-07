// RECETTE : simule N séances pour un profil d'enfant (voir tests/sim-recette.mjs) et affiche, séance par séance,
// le niveau de la ligne, les additions posées, les étoiles et les cartes ; puis le bilan des cartes (lot 2) :
// dates où chaque zone s'ouvre et se complète, légendaires, brillantes, quota jamais dépassé.
//   node tests/sim-seances.mjs [sait|reel|diff|tresdur|facile] [séances par semaine : 2|3|5] [nombre de séances, ou « annee » : jusqu'au 2 juillet 2027] [--court]
//   lot 3 : [--choix 1:5 | 2:4] l'enfant choisit toujours cet exercice (ligne, niveau 5 ; additions, famille 4) ; [--cran facile|conseille|dur|tresdur]
//   lot « Correctifs » (écart 6.2) : [--deux-par-jour] deux séances chaque soir (la seconde une heure après la première,
//   comme une séance interrompue suivie d'une autre) : au plus une famille d'additions ouverte par jour, toutes voies confondues.
// Les zones 3 et 4 sont considérées prêtes (contenu fictif). --court : seulement le bilan.
import { readFileSync } from "node:fs";
import { simulate, PROFILS } from "./sim-recette.mjs";
import { dateOf } from "../app/js/session/rewards.js";
const cal = JSON.parse(readFileSync(new URL("../app/content/calendrier.json", import.meta.url)));
const M2 = JSON.parse(readFileSync(new URL("../app/content/module2.json", import.meta.url))), FAMS = M2.familles.map((f) => f.id), NONMIX = M2.familles.filter((f) => f.regle !== "melange").map((f) => f.id);
const hol = cal.vacances.map((v) => [new Date(dateOf(v.debut)), new Date(dateOf(v.reprise))]), fin = new Date(dateOf("2027-07-02") + 86400000);
const days = (perWeek, n) => { const out = []; let d = new Date("2026-09-28T00:00:00"); const wd = perWeek === 2 ? [1, 4] : perWeek === 3 ? [1, 3, 5] : [1, 2, 3, 4, 5];
  while (n === "annee" ? d < fin : out.length < n) { if (!hol.some(([a, b]) => d >= a && d < b) && wd.includes(d.getDay())) out.push(new Date(d)); d = new Date(d.getTime() + 86400000); } return out; };
const argv = process.argv.slice(2), val = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const args = argv.filter((a, i) => !a.startsWith("--") && !["--choix", "--cran"].includes(argv[i - 1])), court = argv.includes("--court");
const ch = val("--choix")?.split(":").map(Number), choix = ch ? (ch[0] === 2 ? { module: 2, famille: ch[1] } : { module: ch[0], niveau: ch[1] }) : null;
const [profil = "reel", perWeek = "2", n = "30"] = args;
const jours0 = days(+perWeek, n === "annee" ? "annee" : +n), jours = argv.includes("--deux-par-jour") ? jours0.flatMap((d) => [d, new Date(d.getTime() + 3600000)]) : jours0;
const res = await simulate({ profil, jours, seed: 7, choix, cran: val("--cran") });
if (choix) console.log(`# lot 3 : l'enfant choisit toujours ${choix.module === 4 ? (choix.niveau ? `les voiliers, niveau ${choix.niveau}` : "les voiliers, au niveau conseillé") : choix.module === 3 ? `le calcul rapide, niveau ${choix.niveau}` : choix.module === 1 ? `la ligne, niveau ${choix.niveau}` : `les additions, famille ${choix.famille}`}, cran ${val("--cran") ?? PROFILS[profil].cran ?? "conseille"} : réussite de la notion du jour (10 premières séances, exemples guidés exclus) ${(() => { const xs = res.slice(0, 10).flatMap((r) => r.notionOk ?? []); return Math.round((100 * xs.filter(Boolean).length) / Math.max(1, xs.length)); })()} % ; descentes de cran ${res.slice(0, 10).reduce((a, r) => a + r.descentes, 0)}`);
console.log(`# profil ${PROFILS[profil].nom}, ${perWeek}/sem, ${res.length} séances`);
if (!court) for (const r of res) console.log(`${r.n}\t${r.date}\t${r.cranDepart}${r.descentes ? `->${r.cran}` : ""}\t${r.module === 2 ? "additions" : r.module === 3 ? `calcul ${r.niv0}->${r.niv1}` : r.module === 4 ? `voiliers ${r.niv0}->${r.niv1}` : `niv ${r.niv0}->${r.niv1}`}\tq=${r.questions} ${Math.round((r.reussite ?? 0) * 100)}% nsp ${r.nsp} nouveaux ${r.nouveaux}\t${r.duree}min\tm${r.module}${r.defi !== undefined ? ` défi ${r.defi}${r.record ? "!" : ""}` : ""}${r.module === 2 ? ` f${r.famille}` : ""}\t★${r.etoiles}\tarc${r.arc}${r.doree ? " DORÉE" : ""}${r.surprise ? ` surprise ${r.surprise}` : ""}\tcartes ${r.nbCartes}/${r.quota} [${r.cartes.join(",")}]${r.zones.length ? ` ZONE ${r.zones.join(",")}` : ""}\tfaits vus ${r.faitsVus} boîtes ${r.boites.join("/")}\tchauffe: ${r.faits.join(" ")}\tligne: ${r.ligne.join(" ")}${r.lecons.length ? " leçons " + r.lecons.join(",") : ""}`);
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
const m2f = (rs) => rs.filter((r) => r.module === 2).map((r) => r.famille).join(" ");
const famDate = (k, id) => res.find((r) => r[k].includes(id))?.n ?? "-";
console.log(`familles (séance où elle s'ouvre / est acquise / ouvre ses formes à trou) : ${FAMS.map((id) => `${id}: ${famDate("fOuvertes", id)}/${famDate("fAcquises", id)}/${famDate("fTrou", id)}`).join(" ; ")}`);
// décision du parent du 27 septembre : stagnation (famille dépassée après 6 séances d'additions sans être acquise)
console.log(`familles dépassées (séance) : ${NONMIX.filter((id) => res.at(-1).fDepassees.includes(id)).map((id) => `${id} (${famDate("fDepassees", id)})`).join(", ") || "aucune"} ; familles ouvertes à la fin : ${res.at(-1).fOuvertes.join(", ")} ; acquises : ${res.at(-1).fAcquises.join(", ") || "aucune"} ; famille en cours, séance par séance d'additions : ${m2f(res)}`);
console.log(`leçons jouées sur l'année : ${res.flatMap((r) => r.lecons.map((l) => `${l} (${r.n})`)).join(", ") || "aucune"}`);
console.log(`45 faits vus à la séance ${res.find((r) => r.faitsVus >= 45)?.n ?? "jamais"} ; leçons du module 2 : ${res.flatMap((r) => r.lecons.filter((l) => ["L4", "L5", "L6"].includes(l)).map((l) => `${l} (séance ${r.n})`)).join(", ") || "aucune"}`);
const m2 = res.filter((r) => r.module === 2);
console.log(`séances d'additions : ${moy(m2.map((r) => r.add.filter((x) => !x.includes("g")).length)).toFixed(1)} questions en moyenne, durée estimée ${moy(m2.map((r) => r.duree)).toFixed(1)} min ; formes à trou ${m2.reduce((a, r) => a + r.add.filter((x) => x.includes("?")).length, 0)} sur ${m2.reduce((a, r) => a + r.add.length, 0)}`);
// lot « Sommes jusqu'à 30 » (docs/maquettes/sommes30/PROPOSITION.md) : les familles 8 à 14, les faits au-delà de 10
{
  const big = M2.familles.filter((f) => f.id >= 8).map((f) => f.id), q = (r) => r.add.filter((x) => !x.includes("g")), gt10 = (x) => { const m = /^(\?|\d+)\+(\?|\d+)/.exec(x); return m && m[1] !== "?" && m[2] !== "?" ? +m[1] + +m[2] > 10 : null; };
  const quart = (k) => res.slice(Math.floor((k * res.length) / 4), Math.floor(((k + 1) * res.length) / 4));
  console.log(`\n## sommes jusqu'à 30 (${PROFILS[profil].nom})`);
  console.log(`familles 8 à 13 (séance où elle s'ouvre / est acquise) : ${big.map((id) => `${id}: ${famDate("fOuvertes", id)}/${famDate("fAcquises", id)}`).join(" ; ")}`);
  console.log(`faits au-delà de 10 (60) : rencontrés à la fin ${res.at(-1).vus20 ?? 0}, en boîte 3 ou plus ${res.at(-1).sus20 ?? 0} ; par quart d'année (rencontrés / bien sus à la fin du quart) : ${[0, 1, 2, 3].map((k) => `${quart(k).at(-1)?.vus20 ?? "-"}/${quart(k).at(-1)?.sus20 ?? "-"}`).join(" ; ")}`);
  console.log(`séances d'additions par quart d'année : ${[0, 1, 2, 3].map((k) => quart(k).filter((r) => r.module === 2).length + "/" + quart(k).length).join(" ; ")} ; leçons L11 et L12 : ${res.flatMap((r) => r.lecons.filter((l) => ["L11", "L12"].includes(l)).map((l) => `${l} (séance ${r.n})`)).join(", ") || "jamais"}`);
  const defq = (k) => quart(k).filter((r) => r.defi !== undefined).map((r) => r.defi);
  console.log(`défi record, score moyen par quart d'année : ${[0, 1, 2, 3].map((k) => { const d = defq(k); return d.length ? moy(d).toFixed(1) : "-"; }).join(" ; ")} ; records battus par quart : ${[0, 1, 2, 3].map((k) => quart(k).filter((r) => r.record).length).join(" ; ")}`);
  void q; void gt10;
}
// lot 3, étape 1 (docs/SPEC-LOT3.md, section 7) : leçon et exercice cohérents
{
  const LF = { L4: [2, 6, 9, 10], L5: [3], L6: [4, 5], L11: [8], L12: [11, 12] }, bad = m2.filter((r) => r.lecons.some((l) => LF[l] && !LF[l].includes(r.famille)));
  const apresL4 = m2.filter((r) => r.lecons.includes("L4"));
  console.log(`\n## lot 3 : leçons et exercice (${PROFILS[profil].nom})`);
  console.log(`part des questions sur la famille en cours (additions) : minimum ${Math.round(Math.min(...m2.map((r) => r.partFamille ?? 1)) * 100)} %, moyenne ${Math.round(moy(m2.map((r) => r.partFamille ?? 1)) * 100)} % (seuil 80 %) ; leçon de famille jouée pour une autre famille : ${bad.length ? bad.map((r) => `${r.n} (${r.lecons.join(",")} pour f${r.famille})`).join(" ; ") : "jamais"} ; après L4 : ${apresL4.map((r) => `${Math.round((r.doubles ?? 0) * 100)} % de doubles ou presque-doubles (f${r.famille})`).join(", ") || "L4 jamais jouée"}`);
}
// lot 3 bis (docs/SPEC-LOT3BIS.md, A1) : aucune famille acquise en une seule séance
{
  const acq = NONMIX.map((id) => { const i = res.findIndex((r) => r.fAcquises.includes(id)); if (i < 0) return null; const avant = res.slice(0, i + 1).filter((r) => (r.fPratique ?? []).includes(id)).length; return { id, n: res[i].n, avant }; }).filter(Boolean);
  const une = acq.filter((a) => a.avant < 2);
  console.log(`\n## lot 3 bis : acquisition des familles (${PROFILS[profil].nom})`);
  console.log(`familles acquises (séance, séances où elle a été réussie jusque-là) : ${acq.map((a) => `${a.id} (${a.n}, ${a.avant})`).join(" ; ") || "aucune"} ; acquise en une seule séance : ${une.length ? une.map((a) => a.id).join(", ") + " (ERREUR)" : "aucune"}`);
}
// lot 3 ter (docs/SPEC-LOT3TER.md, T2) : l'échauffement s'ajuste seul (familles ouvertes par l'échauffement)
{
  const last = res.at(-1).fOuvertures ?? [], day = (t) => new Date(t).toDateString(), src = (o) => (o.echauffement ? "échauffement" : o.choix ? "choix" : o.parent ? "parent" : o.stagnation ? "stagnation" : "notion du jour");
  const opened = last.filter((o) => ![1, 2].includes(o.famille)).map((o) => ({ ...o, n: res.find((r) => (r.fOuvertures ?? []).some((x) => x.famille === o.famille))?.n, src: src(o) }));
  const byDay = new Map(); for (const o of opened) byDay.set(day(o.date), [...(byDay.get(day(o.date)) ?? []), o.famille]);
  const deux = [...byDay.entries()].filter(([, f]) => f.length > 1);
  const month = res[0] ? new Date(res[0].date.split("/").reverse().join("-")).getTime() : 0, firstMonth = opened.filter((o) => o.date < month + 28 * 864e5);
  const fmt = (r) => r.opening ? `${Math.round(r.opening.mesures.part * 100)} % en boîte 2, ${r.opening.mesures.reponses} réponses à ${Math.round(r.opening.mesures.justes * 100)} %, médiane ${(r.opening.mesures.medianeMs / 1000).toFixed(1)} s (seuil ${(r.opening.mesures.limitMs / 1000).toFixed(1)} s)` : "";
  const warm = res.filter((r) => r.chauffe?.length), trois = warm.filter((r) => r.chauffe.some((v, i) => i >= 2 && v === r.chauffe[i - 1] && v === r.chauffe[i - 2])), peu = warm.filter((r) => new Set(r.chauffe).size < 5);
  console.log(`\n## lot 3 ter : l'échauffement s'ajuste (${PROFILS[profil].nom})`);
  console.log(`familles ouvertes (séance, par quoi) : ${opened.map((o) => `${o.famille} (${o.n}, ${o.src})`).join(" ; ") || "aucune"}`);
  for (const o of opened.filter((x) => x.echauffement)) { const r = res.find((x) => x.n === o.n); console.log(`  famille ${o.famille} ouverte par l'échauffement à la séance ${o.n} : ${fmt(r)}`); }
  console.log(`amis de 10 (famille 3) ouverts à la séance ${opened.find((o) => o.famille === 3)?.n ?? "jamais"} ; deux familles ouvertes le même jour : ${deux.length ? deux.map(([d, f]) => `${d} (${f.join(", ")})`).join(" ; ") + " (ERREUR)" : "jamais"}`);
  console.log(`premier mois : ${firstMonth.length} famille(s) ouverte(s), ${(firstMonth.length / 4).toFixed(2)} par semaine`);
  console.log(`variété à l'échauffement, ${warm.length} échauffements : 3 fois de suite la même réponse : ${trois.length ? `${trois.length} (${trois.slice(0, 3).map((r) => `séance ${r.n} [${r.chauffe.join(" ")}]`).join(" ; ")})` : "jamais"} ; moins de 5 réponses différentes : ${peu.length ? `${peu.length} (${peu.slice(0, 3).map((r) => `séance ${r.n} [${r.chauffe.join(" ")}]`).join(" ; ")})` : "jamais"}`);
}
// lot 3, étape 4 : le calcul rapide
{
  const m3 = res.filter((r) => r.module === 3), acq = (n) => res.find((r) => (r.acquis3 ?? []).includes(n))?.n ?? "jamais", last3 = [...res].reverse().find((r) => r.acquis3);
  console.log(`\n## lot 3 : calcul rapide (${PROFILS[profil].nom})`);
  console.log(`séances de calcul rapide : ${m3.length} sur ${res.length} ; niveau acquis (séance) : ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${n}: ${acq(n)}`).join(" ; ")} ; acquis à la fin : ${last3?.acquis3?.join(", ") || "aucun"} ; leçons L7 à L9 : ${res.flatMap((r) => r.lecons.filter((l) => ["L7", "L8", "L9"].includes(l)).map((l) => `${l} (${r.n})`)).join(", ") || "aucune"} ; durée moyenne des séances de calcul rapide ${moy(m3.map((r) => r.duree)).toFixed(1)} min, ${moy(m3.map((r) => (r.calc ?? []).length)).toFixed(0)} calculs`);
}
// lot « Les voiliers » : le module 4 (choisi : --choix 4:N, ou --choix 4:0 pour le niveau conseillé chaque fois)
{
  const m4 = res.filter((r) => r.module === 4);
  if (m4.length) {
    console.log(`\n## les voiliers (${PROFILS[profil].nom}, cran ${val("--cran") ?? PROFILS[profil].cran ?? "conseille"})`);
    const mers = m4.flatMap((r) => r.mers), part = (m) => Math.round((mers.filter((x) => x === m).length / Math.max(1, mers.length)) * 100);
    console.log(`séances : ${m4.length} ; bateaux par séance : ${moy(m4.map((r) => r.voiliers.filter((x) => !x.startsWith("ex")).length)).toFixed(1)} (min ${Math.min(...m4.map((r) => r.voiliers.length))}, max ${Math.max(...m4.map((r) => r.voiliers.length))}) ; durée estimée ${moy(m4.map((r) => r.duree)).toFixed(1)} min ; réussite ${Math.round(moy(m4.map((r) => r.reussite ?? 0)) * 100)} % ; étoiles par séance ${moy(m4.map((r) => r.etoiles)).toFixed(1)}`);
    console.log(`mer : calme ${part("calme")} %, vent ${part("vent")} %, pirates ${part("pirates")} % des bateaux ; niveau (séance où il est atteint) : ${[2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${n}: ${m4.find((r) => r.niv1 >= n)?.n ?? "jamais"}`).join(" ; ")}`);
    if (!court) for (const r of m4.slice(0, 6)) console.log(`  séance ${r.n} (niveau ${r.niv0} -> ${r.niv1}) : ${r.voiliers.join(" ")}`);
  }
}
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
console.log(`coquillages : ${res.reduce((a, r) => a + r.cartes.length, 0)} (${res.reduce((a, r) => a + (r.nouvelles ?? 0), 0)} cartes nouvelles, ${res.reduce((a, r) => a + r.cartes.filter((c) => c.includes("rendue brillante")).length, 0)} créatures rendues brillantes, aucun doublon : ${res.some((r) => r.cartes.some((c) => c.includes("doublon"))) ? "FAUX" : "vrai"}) ; séances sans coquillage : ${res.filter((r) => !r.cartes.length).length}
coquillages qui attendent (assez d'étoiles, rien à donner : toutes les créatures possédées déjà brillantes) : ${res.reduce((a, r) => a + (r.attentes ?? 0), 0)} ; étoiles au compteur à la fin : ${res.at(-1).reserve ?? "?"}`);
console.log(`quota dépassé : ${res.some((r) => r.depasse) ? "OUI (erreur)" : "jamais"} ; surprises : ${res.filter((r) => r.surprise).length} sur ${res.length} séances`);
void zoneDone;
