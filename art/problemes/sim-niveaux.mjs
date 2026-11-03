// SIMULATION : COMBIEN DE TEMPS POUR PARCOURIR LES 9 NIVEAUX DES PROBLÈMES ? (demande du parent du 30 octobre 2026 ; fiche
// « Problèmes » de docs/LOTS.md). Modèle volontairement simple, à reprendre par le lot dans tests/sim-seances.mjs :
//  - chaque séance a l'étape fixe « Problème du jour » : 1 ou 2 problèmes, pris au niveau de l'enfant (les réponses comptent
//    pour la montée, décision du parent) ; pas de séance « choisir » de problèmes (le cas le plus lent) ;
//  - un énoncé ne revient pas avant que tous ceux de son niveau soient passés ; un énoncé manqué revient à une séance suivante ;
//  - l'enfant réussit avec une probabilité qui dépend de son profil et du niveau ; elle touche le coquillage parfois ;
//  - départ au niveau 2 (décision du parent) ; on compte les séances jusqu'à l'acquisition du niveau 9.
// Deux règles de montée comparées : la règle commune (8 bonnes sur les 10 dernières, au plus une aide, sur deux jours au moins :
// docs/SPEC.md, section 9 ; la multiplication) et une règle courte (4 bonnes sur les 5 dernières, au plus une aide, sur deux
// jours au moins).
//   node art/problemes/sim-niveaux.mjs
import { readFileSync } from "node:fs";

const banque = JSON.parse(readFileSync(new URL("enonces.json", import.meta.url), "utf8")).enonces;
const parNiveau = (n) => banque.filter((e) => e.niveau === n).map((e) => e.id);
// un tirage déterministe
const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
// la réussite selon le niveau (le niveau 1 n'est pas joué : départ au niveau 2)
const PROFILS = {
  "à l'aise": { p: [0, 0.97, 0.96, 0.95, 0.93, 0.93, 0.92, 0.9, 0.88, 0.85], aide: 0.05 },
  "l'évaluation (2,5/3)": { p: [0, 0.93, 0.9, 0.88, 0.85, 0.82, 0.85, 0.82, 0.75, 0.72], aide: 0.12 },
  "en difficulté": { p: [0, 0.85, 0.78, 0.75, 0.68, 0.65, 0.7, 0.62, 0.55, 0.5], aide: 0.25 },
};
const REGLES = { "8 sur 10": { n: 10, ok: 8 }, "4 sur 5": { n: 5, ok: 4 } };
// une progression simulée : les séances jusqu'au niveau 9 acquis (ou null), le niveau atteint à `horizon` séances
function enfant(profil, regle, parSeance, seed, horizon) {
  const r = rng(seed), P = PROFILS[profil], R = REGLES[regle];
  let niveau = 2, hist = [], jours = new Set(), file = [], vus = new Set(), aHorizon = null;
  for (let s = 1; s <= 400; s++) {
    for (let q = 0; q < parSeance; q++) {
      const ids = parNiveau(niveau);
      // l'énoncé : d'abord un énoncé manqué d'une séance précédente, sinon un pas encore vu du tour en cours
      let id = file.find((x) => x.s < s && ids.includes(x.id))?.id;
      if (id) file = file.filter((x) => x.id !== id);
      else { if (ids.every((x) => vus.has(x))) ids.forEach((x) => vus.delete(x)); id = ids.find((x) => !vus.has(x)); }
      vus.add(id);
      const aide = r() < P.aide, juste = r() < Math.min(0.99, P.p[niveau] + (aide ? 0.08 : 0));
      if (!juste) file.push({ id, s });
      hist.push({ juste, aide }); jours.add(s);
      const der = hist.slice(-R.n);
      if (der.length === R.n && der.filter((h) => h.juste).length >= R.ok && der.filter((h) => h.aide).length <= 1 && jours.size >= 2) {
        if (niveau === 9) return { fin: s, aHorizon: aHorizon ?? 10 };
        niveau += 1; hist = []; jours = new Set(); file = [];
      }
    }
    if (s === horizon) aHorizon = niveau;
  }
  return { fin: null, aHorizon: aHorizon ?? niveau };
}
// l'année : environ 28 semaines d'école entre la mi-novembre 2026 et la fin juin 2027, vacances retirées
const SEMAINES = 28;
const med = (t) => { const v = t.filter((x) => x !== null).sort((a, b) => a - b); return v.length < t.length / 2 ? null : v[Math.floor(t.length / 2)]; };
const lignes = ["| Profil | Séances par semaine | Problèmes par soir | Règle de montée | Niveau 9 acquis après (médiane) | Niveau atteint fin juin (médiane) |", "| --- | --- | --- | --- | --- | --- |"];
for (const profil of Object.keys(PROFILS)) for (const parSemaine of [2, 5]) for (const parSeance of [1, 2]) for (const regle of Object.keys(REGLES)) {
  const horizon = SEMAINES * parSemaine, runs = Array.from({ length: 200 }, (_, i) => enfant(profil, regle, parSeance, 1000 + i * 7, horizon));
  const fin = med(runs.map((x) => x.fin)), niv = med(runs.map((x) => x.aHorizon));
  lignes.push(`| ${profil} | ${parSemaine} | ${parSeance} | ${regle} | ${fin === null ? "jamais (moins d'une sur deux)" : `${fin} séances, ${Math.round(fin / parSemaine)} semaines`} | ${niv === 10 ? "tous acquis" : niv} |`);
}
console.log(`Banque : ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `niveau ${n} : ${parNiveau(n).length}`).join(", ")}. Départ au niveau 2 ; 200 enfants simulés par ligne.\n`);
console.log(lignes.join("\n"));
