// GRILLE DES RÉGLAGES DES SÉANCES D'ADDITIONS (lot « Correctifs de la confrontation 2 », écarts 2.6 et 6.10 ; réponse du parent
// du 3 novembre 2026 : essayer le plafond des faits nouveaux à 10, à 12 et sans plafond, les révisions seulement avant la moitié
// de l'étape ou à tout moment, profils reel et diff, 2 et 3 séances par semaine, une année ; docs/JOURNAL-CONCEPTION.md).
// Pour chaque combinaison : l'année simulée (tests/sim-recette.mjs, le moteur de l'application, graine 7), et
//  - la progression dans les familles : la séance où chaque famille s'ouvre et celle où elle est dépassée (acquise ou passée par la
//    stagnation), comparées à celles d'avant le lot (--base, le fichier écrit par ce même outil sur `main`) ; la plus longue durée
//    (en séances) pendant laquelle une famille reste la famille en cours ;
//  - les faits nouveaux par séance (le maximum, les séances à plus de 10) ;
//  - la durée des séances d'additions (moyenne, sous 7 et sous 9 minutes) ;
//  - la part des questions sur la famille du jour.
//   node tests/recette-fonctionnelle/grille-additions.mjs [--combos tel-quel|grille|temoin] [--plafonds 10,12,99] [--graines 7] [--json sortie.json] [--base main.json]
//   (--reunir a.json,b.json,… : le tableau des fichiers écrits par --json, sans simulation ; --synthese : une ligne par combinaison)
import { readFileSync, writeFileSync } from "node:fs";
import { simulate, contenu } from "../sim-recette.mjs";
import { dateOf } from "../../app/js/session/rewards.js";
const cal = JSON.parse(readFileSync(new URL("../../app/content/calendrier.json", import.meta.url)));
const hol = cal.vacances.map((v) => [new Date(dateOf(v.debut)), new Date(dateOf(v.reprise))]), fin = new Date(dateOf("2027-07-02") + 86400000);
const days = (perWeek) => { const out = []; let d = new Date("2026-09-28T00:00:00"); const wd = { 2: [1, 4], 3: [1, 3, 5] }[perWeek];
  while (d < fin) { if (!hol.some(([a, b]) => d >= a && d < b) && wd.includes(d.getDay())) out.push(new Date(d)); d = new Date(d.getTime() + 86400000); } return out; };
const argv = process.argv.slice(2), val = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const PROFILS = (val("--profils") ?? "reel,diff").split(","), RYTHMES = [2, 3];
// les combinaisons : le plafond (nouveauxMaxException ; 99 : sans plafond) et la part du temps de l'étape avant laquelle une
// famille épuisée (ou le plafond atteint) finit sur des révisions (revisionsAvantPart : 0,5 la moitié, 1 à tout moment)
const GRILLE = [];
for (const plafond of (val("--plafonds") ?? "10,12,99").split(",").map(Number)) for (const part of [0.5, 1]) GRILLE.push({ nom: `${plafond === 99 ? "sans plafond" : `plafond ${plafond}`}, révisions ${part === 1 ? "à tout moment" : "avant la moitié"}`, plafond, part });
// le témoin : le code du lot, sans les deux règles (pas de révisions, pas de plafond) : la part des écarts à `main` qui vient des
// autres changements du lot (6.12, 7 ter, 3.8 changent le tirage au hasard des séances suivantes), pas des règles essayées
const TEMOIN = { nom: "témoin (le lot sans les règles 2.6 et 6.10)", plafond: 99, part: 0.5, sans: true };
const combos = val("--combos") === "grille" ? GRILLE : val("--combos") === "temoin" ? [TEMOIN] : [{ nom: "tel quel", plafond: null, part: null }];
const moy = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const out = val("--reunir") ? val("--reunir").split(",").flatMap((f) => JSON.parse(readFileSync(f))) : [];
const GRAINES = (val("--graines") ?? "7").split(",").map(Number);
if (!val("--reunir")) for (const graine of GRAINES) for (const c of combos) for (const profil of PROFILS) for (const r of RYTHMES) {
  if (c.plafond != null) { contenu.module2.notion.nouveauxMaxException = c.plafond; contenu.module2.notion.revisionsAvantPart = c.part; contenu.module2.notion.revisionsFamilleEpuisee = !c.sans; }
  const res = await simulate({ profil, jours: days(r), seed: graine });
  const add = res.filter((x) => x.module === 2), d = add.map((x) => x.duree), part = add.map((x) => x.partFamille).filter((x) => x != null), nv = res.map((x) => x.nouveaux);
  const familles = {};
  for (const x of res) {
    for (const f of x.fOuvertes ?? []) (familles[f] ??= {}).ouverte ??= x.n;
    for (const f of [...(x.fAcquises ?? []), ...(x.fDepassees ?? [])]) (familles[f] ??= {}).depassee ??= x.n;
  }
  out.push({ combo: c.nom, graine, profil, rythme: r, seances: res.length, add: add.length, duree: moy(d), sous7: d.filter((x) => x < 7).length, sous9: d.filter((x) => x < 9).length,
    part: moy(part), partMin: Math.min(...part), nouveauxMax: Math.max(...nv), plus10: nv.filter((x) => x > 10).length, familles });
  console.error(`graine ${graine} · ${c.nom} · ${profil} ${r}/sem : ${add.length} séances d'additions, ${moy(d).toFixed(2)} min`);
}
if (val("--json")) writeFileSync(val("--json"), JSON.stringify(out, null, 1));
// le tableau, comparé à la base
const base = val("--base") ? JSON.parse(readFileSync(val("--base"))) : null;
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : "-");
const ecart = (o) => {
  const b = base?.find((x) => x.profil === o.profil && x.rythme === o.rythme && (x.graine ?? 7) === (o.graine ?? 7)); if (!b) return { retard: "-", bloque: "-" };
  let pire = 0, quoi = "";
  for (const [f, v] of Object.entries(b.familles)) for (const k of ["ouverte", "depassee"]) {
    if (v[k] == null) continue; const a = o.familles[f]?.[k] ?? o.seances + 1, dd = a - v[k];
    if (dd > pire) { pire = dd; quoi = `famille ${f} ${k === "ouverte" ? "ouverte" : "dépassée"} ${a > o.seances ? "jamais" : `séance ${a}`} (avant : ${v[k]})`; }
  }
  return { retard: pire, quoi };
};
const span = (o) => { let m = 0, q = ""; for (const [f, v] of Object.entries(o.familles)) if (v.ouverte != null) { const s = (v.depassee ?? o.seances + 1) - v.ouverte; if (s > m) { m = s; q = `famille ${f}`; } } return `${m} (${q})`; };
console.log("| combinaison | profil | rythme | retard le plus grand sur `main` (séances) | famille en cours le plus longtemps (séances) | faits nouveaux : max, séances à plus de 10 | séances d'additions | durée moyenne (min) | sous 7 min | sous 9 min | part de la famille : moyenne, min |");
console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const o of out) { const e = ecart(o); console.log(`| ${o.combo} | ${o.profil} | ${o.rythme}/sem | ${e.retard}${e.quoi ? ` : ${e.quoi}` : ""} | ${span(o)} | ${o.nouveauxMax}, ${o.plus10} | ${o.add} | ${f1(o.duree)} | ${o.sous7} | ${o.sous9} | ${Math.round(o.part * 100)} %, ${Math.round(o.partMin * 100)} % |`); }
// --synthese : une ligne par combinaison, sur toutes les graines et les quatre cas (profils reel et diff, 2 et 3 séances par
// semaine), dans l'ordre des critères du parent du 3 novembre 2026 : (1) la progression (retard sur `main` : cas tenus, au plus
// une séance ; le retard médian et le plus grand ; cas où une famille reste la famille en cours plus de 4 séances de plus que sur
// `main`, environ deux semaines) ; (2) les faits nouveaux (le maximum) ; (3) la durée (moyenne des cas, séances sous 7 minutes) ;
// (4) la part de la famille du jour (moyenne des cas, le cas le plus bas)
if (argv.includes("--synthese") && base) {
  const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor((s.length - 1) / 2)]; };
  const spanN = (o) => Math.max(0, ...Object.values(o.familles).filter((v) => v.ouverte != null).map((v) => (v.depassee ?? o.seances + 1) - v.ouverte));
  console.log("\n| combinaison | cas | (1) retard ≤ 1 séance | (1) retard médian, le plus grand | (1) famille en cours bien plus longtemps que sur `main` | (2) faits nouveaux, max | (3) durée moyenne (min) | (3) séances sous 7 min | (4) part de la famille : moyenne, cas le plus bas |");
  console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const nom of [...new Set(out.map((o) => o.combo))]) {
    const os = out.filter((o) => o.combo === nom), rs = os.map((o) => { const e = ecart(o); return typeof e.retard === "number" ? e.retard : 0; });
    const longs = os.filter((o) => { const b = base.find((x) => x.profil === o.profil && x.rythme === o.rythme && (x.graine ?? 7) === (o.graine ?? 7)); return b && spanN(o) > spanN(b) + 4; }).length;
    const parts = os.map((o) => o.part);
    console.log(`| ${nom} | ${os.length} | ${rs.filter((x) => x <= 1).length} | ${med(rs)}, ${Math.max(...rs)} | ${longs} | ${Math.max(...os.map((o) => o.nouveauxMax))} | ${f1(moy(os.map((o) => o.duree)))} | ${os.reduce((a, o) => a + o.sous7, 0)} | ${Math.round(moy(parts) * 100)} %, ${Math.round(Math.min(...parts) * 100)} % |`);
  }
}
