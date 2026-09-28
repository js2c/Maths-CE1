// RECETTE FONCTIONNELLE DU LOT 3, PARTIE D : la synthèse des séances à vitesse réelle et l'index de la partie.
// Lit les relevés de d-vitesse-reelle.mjs (D-<cas>.json) et, s'ils ont été copiés dans le dossier, ceux de
// tests/e2e/recette.mjs --delai 4.5 --module N (recette-moduleN.json : sa chronologie.json).
//   node tests/recette-fonctionnelle/d-index.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUT, ecrireIndex, indexPartie } from "./commun.mjs";

const DIR = join(OUT, "D-vitesse-reelle"), fmt = (x) => x.toFixed(1).replace(".", ","), mn = (s) => `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, "0")} s`;
const CAS = ["ligne", "additions", "calcul", "famille3"], lignes = [], L = ["# Partie D · séances à vitesse réelle : synthèse", "",
  "Voix réelle, base neuve (première séance), l'enfant répond 4,5 s après pouvoir répondre (« je ne sais pas » une fois, une erreur une fois par exercice ; bulles hors questions touchées au bout de 2 s). Détail dans chaque `D-<cas>-chronologie.md`.", "",
  "## tests/recette-fonctionnelle/d-vitesse-reelle.mjs (avec le relevé de la voix)", "", "| séance | durée totale | durée par étape | attentes sans rien à toucher (≥ 1,5 s) | temps cumulé sans rien à toucher | erreurs de page |", "| --- | --- | --- | --- | --- | --- |"];
for (const c of CAS) {
  const f = join(DIR, `D-${c}.json`); if (!existsSync(f)) { L.push(`| ${c} | non produite | | | | |`); continue; }
  const d = JSON.parse(readFileSync(f, "utf8"));
  L.push(`| ${d.nom} | ${mn(d.total)} | ${Object.entries(d.etapes).map(([k, v]) => `${k} ${fmt(v)} s`).join(" ; ")} | ${d.idle} | ${fmt(d.idleS)} s | ${d.errors.length ? [...new Set(d.errors)].join(" / ") : "aucune"} |`);
  lignes.push([`D-${c}-chronologie.md`, `${d.nom} : chronologie (ce qui est dit, affiché, attendu, durée de chaque moment), attentes sans rien à toucher, durée totale (${mn(d.total)})`]);
  for (const p of d.planches) lignes.push([p.file, `${d.nom} : les moments clés (${p.contenu})`]);
  lignes.push([`D-${c}.json`, `${d.nom} : le relevé brut (durées, attentes, erreurs, planches)`]);
}
L.push("", "## tests/e2e/recette.mjs --delai 4.5 (l'outil de recette du dépôt, lancé tel quel)", "", "Même enfant, sans le relevé de la voix ; « attente » : le temps entre la fin de l'action précédente et le moment où l'enfant peut répondre (la consigne comprise).", "", "| module | durée totale | questions | attente avant de pouvoir répondre : moyenne / plus longue (étape) | erreurs de page |", "| --- | --- | --- | --- | --- |");
for (const m of [1, 2, 3]) {
  const f = join(DIR, `recette-module${m}.json`); if (!existsSync(f)) { L.push(`| ${m} | non lancée | | | |`); continue; }
  const d = JSON.parse(readFileSync(f, "utf8")), tot = d.tl.find(([, w]) => /durée totale/.test(w))?.[1] ?? "", s = Number(/([\d.]+) s/.exec(tot)?.[1] ?? d.tl.at(-1)[0]);
  const w = d.waits, max = w.reduce((a, x) => (x.attenteS > a.attenteS ? x : a), { attenteS: 0 });
  L.push(`| ${m} | ${mn(s)} | ${w.length} | ${fmt(w.reduce((a, x) => a + x.attenteS, 0) / Math.max(1, w.length))} s / ${fmt(max.attenteS)} s (${max.etape ?? "—"}, ${max.q ?? ""}) | ${d.errors.length ? [...new Set(d.errors)].join(" / ") : "aucune"} |`);
  lignes.push([`recette-module${m}.json`, `la chronologie brute de tests/e2e/recette.mjs --delai 4.5 --module ${m} (notes horodatées, attentes, erreurs)`]);
}
L.push("");
writeFileSync(join(DIR, "SYNTHESE.md"), L.join("\n"));
indexPartie(DIR, "Partie D · une séance à vitesse réelle par exercice", [["SYNTHESE.md", "durées totales, durées par étape, attentes sans rien à toucher, pour chaque séance (et les relevés de tests/e2e/recette.mjs)"], ...lignes], "Commencer par `SYNTHESE.md`, puis la chronologie de chaque séance ; les planches montrent les moments clés (début de chaque étape, première question, « je ne sais pas », une erreur, la récompense, la fin).");
ecrireIndex();
console.log(L.slice(0, 14).join("\n"));
