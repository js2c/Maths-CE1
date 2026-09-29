// RECETTE FONCTIONNELLE, PARTIE B (lot 3 ter, docs/SPEC-LOT3TER.md, T2) : les échauffements d'un mois, profil par profil.
// Le moteur réel (tests/sim-recette.mjs, `simulate`), base neuve, 2 séances par semaine pendant un mois : pour chaque
// séance, les familles ouvertes, les additions posées à l'échauffement (✗ : erreur, et la réponse donnée), et, à la fin de
// l'échauffement, la famille ouverte par l'échauffement avec ses mesures (les trois conditions). Deux façons de jouer :
// « jouer » (la notion du jour tourne) et « l'enfant choisit toujours la ligne » (seul l'échauffement ouvre des familles).
// Rien n'est jugé. Écrit B-sequences/ECHAUFFEMENTS.md.
//   node tests/recette-fonctionnelle/b-echauffements.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { simulate, PROFILS } from "../sim-recette.mjs";

const ROOT = new URL("../../", import.meta.url).pathname, OUT = join(ROOT, process.env.RECETTE_OUT ?? "tests/recette-fonctionnelle/out", "B-sequences");
mkdirSync(OUT, { recursive: true });
const jours = []; for (let d = new Date("2026-09-28T00:00:00"); jours.length < 9; d = new Date(d.getTime() + 864e5)) if ([1, 4].includes(d.getDay())) jours.push(new Date(d));
const fam = { 1: "+ 1 et + 2", 2: "doubles", 3: "amis de 10", 4: "maisons de 5 à 7", 5: "maisons de 8 et 9", 6: "presque-doubles", 7: "mélange" };
const out = ["# Partie B · les échauffements d'un mois, profil par profil (lot 3 ter)", "", "Le moteur réel, base neuve, 2 séances par semaine (lundi et jeudi) du 28 septembre au 26 octobre 2026 (9 séances). Pour chaque séance : les familles ouvertes au début, les additions de l'échauffement dans l'ordre (hors « 4 + 0 » du temps de base ; ✗ : erreur, avec la réponse donnée), la réussite, et la famille ouverte **par l'échauffement** à sa fin, avec les mesures des trois conditions (docs/SPEC-LOT3TER.md, T2 : tous les faits des familles ouvertes introduits et 80 % en boîte 2 ; 12 dernières réponses d'échauffement à 90 % justes, temps médian sous le seuil « rapide » ; une famille par jour au plus). Rien n'est jugé.", ""];
for (const [mode, choix] of [["« jouer » (la notion du jour tourne entre les trois exercices)", null], ["l'enfant choisit toujours la ligne graduée, niveau 5 (les additions ne sont jamais la notion du jour)", { module: 1, niveau: 5 }]]) {
  out.push(`## ${mode[0].toUpperCase()}${mode.slice(1)}`, "");
  for (const profil of ["sait", "reel", "diff", "tresdur", "facile"]) {
    const res = await simulate({ profil, jours, seed: 7, choix });
    out.push(`### ${PROFILS[profil].nom}`, "", "| séance | familles ouvertes | notion du jour | échauffement (dans l'ordre) | justes | ouverture à la fin de l'échauffement |", "| --- | --- | --- | --- | --- | --- |");
    let prev = [1, 2];
    for (const r of res) {
      const ok = r.chauffeTxt.filter((t) => !t.includes("✗") && !t.includes("ne sait pas")).length, m = r.opening?.mesures;
      const ouv = r.opening?.famille ? `**famille ${r.opening.famille} (${fam[r.opening.famille]})** : ${Math.round(m.part * 100)} % en boîte 2, ${m.reponses} réponses à ${Math.round(m.justes * 100)} %, médiane ${(m.medianeMs / 1000).toFixed(1)} s (seuil ${(m.limitMs / 1000).toFixed(1)} s)` : m ? `non (${[m.introduits < m.faits ? `${m.introduits}/${m.faits} faits introduits` : `${Math.round(m.part * 100)} % en boîte 2`, `${m.reponses} réponses à ${Math.round(m.justes * 100)} %`, `médiane ${(m.medianeMs / 1000).toFixed(1)} s`].join(", ")})` : "—";
      const autres = r.fOuvertes.filter((f) => !prev.includes(f) && f !== r.opening?.famille);
      out.push(`| ${r.n} (${r.date}) | ${prev.join(", ")} | ${r.module === 2 ? `additions, famille ${r.famille}` : r.module === 3 ? "calcul rapide" : "ligne graduée"}${autres.length ? ` (ouvre ${autres.join(", ")})` : ""} | ${r.chauffeTxt.join(" · ") || "—"} | ${ok}/${r.chauffeTxt.length} | ${ouv} |`);
      prev = r.fOuvertes;
    }
    out.push("");
  }
}
writeFileSync(join(OUT, "ECHAUFFEMENTS.md"), out.join("\n") + "\n");
console.log(`écrit : ${join(OUT, "ECHAUFFEMENTS.md")}`);
