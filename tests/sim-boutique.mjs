// LE BILAN DE LA BOUTIQUE ET DES RÉSERVES SUR UNE ANNÉE (lot « Réserves d'étoiles et étoiles arc-en-ciel », décisions du parent du
// 2 novembre 2026) : pour chaque niveau de prix de cartes.json, chaque profil et chaque rythme de séances, une simulation d'une
// année (tests/sim-recette.mjs, mode Arrivages, le contenu des zones 3 et 4 à ses dates) ; un tableau en Markdown :
// créatures, date de la collection complète, séances sans rien de nouveau en vitrine, étoiles arc-en-ciel (gagnées, utilisées
// pour les zones et pour faire briller, restantes), étoiles de diamant (gagnées, utilisées), dates d'ouverture des zones.
//   node tests/sim-boutique.mjs [--prix 2,3,4] [--profils reel,sait,diff] [--rythmes 2,3,4] [--arc aucun,un,zones] [--json fichier]
// Chaque simulation tourne dans son propre processus (4 à la fois).
import { readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cpus } from "node:os";

const argv = process.argv.slice(2), val = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const days = (perWeek) => {
  const cal = JSON.parse(readFileSync(new URL("../app/content/calendrier.json", import.meta.url)));
  const dateOf = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const hol = cal.vacances.map((v) => [dateOf(v.debut), dateOf(v.reprise)]), fin = new Date(dateOf("2027-07-02").getTime() + 86400000);
  const wd = perWeek === 2 ? [1, 4] : perWeek === 3 ? [1, 3, 5] : perWeek === 4 ? [1, 2, 4, 5] : [1, 2, 3, 4, 5], out = [];
  for (let d = new Date("2026-09-28T00:00:00"); d < fin; d = new Date(d.getTime() + 86400000)) if (!hol.some(([a, b]) => d >= a && d < b) && wd.includes(d.getDay())) out.push(new Date(d));
  return out;
};

// un processus fils : une simulation, son résumé en JSON sur la sortie
if (argv[0] === "--un") {
  const [, prix, profil, rythme, arc] = argv, { simulate } = await import("./sim-recette.mjs");
  const res = await simulate({ profil, jours: days(+rythme), seed: 7, zonesPretes: "dates", rythme: "arrivages", prix, arcBriller: arc });
  const last = res.at(-1), first = (f) => res.find(f)?.date ?? null;
  process.stdout.write(JSON.stringify({
    prix, profil, rythme: +rythme, arc, seances: res.length, cartes: last.nbCartes, complete: first((r) => r.nbCartes >= 60), sansNouveau: res.filter((r) => r.vitrineVide).length,
    zones: Object.fromEntries(["corail", "large", "abysses"].map((z) => [z, first((r) => r.zones.includes(z))])),
    arcGagnees: last.arcGagnees, arcZones: last.arcZones, arcBrillees: last.arcBrillees, arcRestantes: last.arcDispo,
    doreesGagnees: last.doreesGagnees, doreesDepensees: last.doreesDepensees, brillantes: last.brillantes, etoilesFin: last.reste,
    // le plus grand nombre d'étoiles arc-en-ciel en réserve, et la première date où la réserve atteint 10
    arcMax: Math.max(...res.map((r) => r.arcDispo)), doreesMax: Math.max(...res.map((r) => r.doreesDispo)),
  }) + "\n");
  process.exit(0);
}

const PRIX = val("--prix", "2,3,4").split(","), PROFILS = val("--profils", "reel,sait,diff").split(","), RYTHMES = val("--rythmes", "2,3,4").split(","), ARCS = val("--arc", "zones").split(",");
const jobs = PRIX.flatMap((p) => PROFILS.flatMap((pr) => RYTHMES.flatMap((r) => ARCS.map((a) => [p, pr, r, a]))));
const self = fileURLToPath(import.meta.url), out = [];
const run = ([p, pr, r, a]) => new Promise((ok, ko) => {
  const c = spawn(process.execPath, [self, "--un", p, pr, r, a]); let s = "";
  c.stdout.on("data", (d) => { s += d; }); c.stderr.on("data", () => {});
  c.on("close", (code) => (code ? ko(new Error(`échec : ${p} ${pr} ${r} ${a}`)) : ok(JSON.parse(s.trim().split("\n").at(-1)))));
});
const queue = [...jobs]; const workers = Array.from({ length: Math.min(4, cpus().length) }, async () => { while (queue.length) { const j = queue.shift(); out.push(await run(j)); process.stderr.write(`· ${j.join(" ")}\n`); } });
await Promise.all(workers);
const ordre = (x) => [PRIX.indexOf(x.prix), PROFILS.indexOf(x.profil), RYTHMES.indexOf(String(x.rythme)), ARCS.indexOf(x.arc)];
out.sort((a, b) => { const A = ordre(a), B = ordre(b); for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) return A[i] - B[i]; return 0; });
if (val("--json")) writeFileSync(val("--json"), JSON.stringify(out, null, 1));
const court = (d) => (d ? d.slice(0, 5) : "—");
console.log(`| Prix pour | Profil | Séances par semaine | ${ARCS.length > 1 ? "Règle | " : ""}Créatures (sur 60) | Collection complète | Séances sans rien de nouveau | Arc-en-ciel gagnées | pour les zones | pour faire briller | restantes | Diamant gagnées | utilisées | Zones ouvertes (corail, large, abysses) |`);
console.log(`| --- | --- | --- | ${ARCS.length > 1 ? "--- | " : ""}--- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`);
for (const x of out) console.log(`| ${x.prix} séances | ${x.profil} | ${x.rythme} | ${ARCS.length > 1 ? `${x.arc} | ` : ""}${x.cartes} | ${x.complete ?? "non"} | ${x.sansNouveau}/${x.seances} | ${x.arcGagnees} | ${x.arcZones} | ${x.arcBrillees} | ${x.arcRestantes} | ${x.doreesGagnees} | ${x.doreesDepensees} | ${court(x.zones.corail)}, ${court(x.zones.large)}, ${court(x.zones.abysses)} |`);
