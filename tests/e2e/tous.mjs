// TOUS LES PARCOURS, L'UN APRÈS L'AUTRE (lot « Banc Android et recette en conditions réelles » : la règle des parcours lourds).
// Le banc ralentit le processeur d'un facteur fixe par rapport à l'ordinateur (×4 pour la tablette de référence) : si plusieurs
// parcours tournent en même temps, le ralentissement réel n'est plus celui de la tablette, et les attentes mesurées (une aide qui
// passe, un sélecteur qui attend 15 s, une animation) deviennent fausses ; c'est ce qui faisait échouer aide-passer, crans et
// lot3bis quand d'autres parcours lourds tournaient (docs/JOURNAL-CONCEPTION.md). La règle : les parcours tournent l'un après
// l'autre, jamais en même temps qu'un autre parcours ou qu'un travail lourd. Ce lanceur les enchaîne, garde le journal de chacun
// (tests/e2e/out/tous/<parcours>.log) et écrit le bilan (tests/e2e/out/tous/bilan.md) ; aucun n'est relancé : un échec est un
// défaut à expliquer, de l'application ou du banc (docs/LOTS.md, fiche 13, point 4).
//   node tests/e2e/tous.mjs [--sauf a,b] [--seul a,b] [--depuis parcours] [--racine dossier]
//   (--racine : la même chose sur une autre copie de app/, par exemple celle de main, pour savoir si un échec existe déjà)
import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync, createWriteStream } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2), arg = (k, d = null) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
// les modules du banc (pas des parcours) et les parcours qui demandent des outils ou des réglages à part
const PAS_DES_PARCOURS = new Set(["appareils.mjs", "navigateur.mjs", "jeu.mjs", "tous.mjs"]);
const A_PART = { "video.mjs": "demande ffmpeg (FFMPEG), une vidéo pour le parent", "perf.mjs": "les mesures de temps d'image, lancées avant et après le lot (méthode commune)", "recette.mjs": "la séance à vitesse réelle, lancée avec --delai 4.5 (méthode commune)", "recette-durees.mjs": "les attentes, lancées avec et sans --passer (méthode commune)", "enfant.mjs": "les séries de graines, lancées à part (--graines, --android)", "journee.mjs": "la journée d'usage, plusieurs heures par profil, lancée à part", "cibles.mjs": "la taille des cibles, lancée à part sur les quatre profils" };
const sauf = new Set(arg("--sauf", "").split(",").filter(Boolean)), seul = arg("--seul")?.split(","), depuis = arg("--depuis");
let liste = readdirSync("tests/e2e").filter((f) => f.endsWith(".mjs") && !PAS_DES_PARCOURS.has(f) && !A_PART[f]).map((f) => f.replace(/\.mjs$/, "")).sort();
if (seul) liste = liste.filter((f) => seul.includes(f));
liste = liste.filter((f) => !sauf.has(f));
if (depuis) liste = liste.slice(Math.max(0, liste.indexOf(depuis)));
const OUT = resolve("tests/e2e/out/tous"); mkdirSync(OUT, { recursive: true });
const env = { ...process.env, ...(arg("--racine") ? { RACINE_APP: resolve(arg("--racine")) } : {}) };
const bilan = [];
for (const p of liste) {
  const t0 = Date.now(), log = createWriteStream(join(OUT, `${p}.log`));
  const code = await new Promise((ok) => { const c = spawn(process.execPath, [`tests/e2e/${p}.mjs`], { env, stdio: ["ignore", "pipe", "pipe"] }); c.stdout.pipe(log); c.stderr.pipe(log); c.on("close", ok); });
  log.end();
  const r = { parcours: p, ok: code === 0, minutes: +((Date.now() - t0) / 60000).toFixed(1) };
  bilan.push(r); console.log(`${r.ok ? "ok  " : "ÉCHEC"} ${p} (${r.minutes} min)`);
}
const md = ["# Tous les parcours, l'un après l'autre", "", `${new Date().toISOString()} ; ${bilan.filter((r) => r.ok).length}/${bilan.length} passent ; ${bilan.reduce((s, r) => s + r.minutes, 0).toFixed(0)} min.`, "", "| Parcours | Résultat | Durée (min) |", "| --- | --- | --- |", ...bilan.map((r) => `| ${r.parcours} | ${r.ok ? "ok" : "**échec**"} | ${r.minutes} |`), "", "Lancés à part :", ...Object.entries(A_PART).map(([f, w]) => `- ${f} : ${w}`)];
writeFileSync(join(OUT, "bilan.md"), md.join("\n") + "\n");
process.exitCode = bilan.every((r) => r.ok) ? 0 : 1;
