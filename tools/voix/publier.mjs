// FABRIQUER ET PUBLIER LES VOIX EN UNE COMMANDE, sur l'ordinateur du parent (docs/VOIX.md, « En une commande »).
// Décision du parent du 6 octobre 2026 : les lots sont fusionnés sans attendre leurs voix ; les voix de
// plusieurs lots se fabriquent ensuite d'un coup, sur main. Tant qu'elles manquent, GitHub ne publie pas
// (.github/workflows/pages.yml) : la version en ligne reste la précédente.
//
// Enchaîne : se mettre sur main à jour ; trouver Python (Chatterbox) ; dire combien de phrases sont à fabriquer
// et demander confirmation ; fabriquer (fabriquer.mjs) ; laisser écouter les phrases refusées ; liste du mode
// hors ligne (precache.mjs) ; test de la voix ; enregistrer et envoyer sur GitHub, qui publie.
//
//   node tools/voix/publier.mjs                      depuis le dossier du jeu ; référence : ..\ref-posee.wav
//   node tools/voix/publier.mjs --ref D:\voix.wav    une autre référence (ou la variable VOIX_REF)
//   node tools/voix/publier.mjs --branche claude/x   sur la branche d'un lot, avant sa fusion (puis retour sur main)
//   node tools/voix/publier.mjs --sans-envoi         tout sauf l'envoi sur GitHub
//   node tools/voix/publier.mjs --oui                sans les deux questions (pour laisser tourner la nuit)
// Python : la variable PYTHON, sinon un environnement .venv-voix dans le dossier du jeu ou à côté, sinon « python ».
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const WIN = process.platform === "win32";
const option = (nom) => { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : undefined; };
const drapeau = (nom) => process.argv.includes(nom);
const stop = (...l) => { console.error("\n" + l.join("\n")); process.exit(1); };
const titre = (t) => console.log(`\n=== ${t} ===`);

// une commande ; stdio hérité (on voit tout) ou capturé
function lancer(cmd, args, { capter = false, env, accepterEchec = false } = {}) {
  const r = spawnSync(cmd, args, { cwd: RACINE, stdio: capter ? ["ignore", "pipe", "pipe"] : "inherit", encoding: "utf8", env: { ...process.env, ...env } });
  if (r.error) { if (accepterEchec) return { ok: false, out: "", err: r.error.message }; stop(`Impossible de lancer « ${cmd} » : ${r.error.message}`); }
  if (r.status !== 0 && !accepterEchec) stop(`Échec de : ${cmd} ${args.join(" ")}`, capter ? (r.stderr || r.stdout || "").trim() : "");
  return { ok: r.status === 0, out: (r.stdout || "").trim(), err: (r.stderr || "").trim() };
}
const git = (args, o) => lancer("git", args, o);
const noeud = (args, o) => lancer(process.execPath, args, o);

async function question(q) {
  if (drapeau("--oui")) return true;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const r = (await rl.question(q)).trim().toLowerCase();
  rl.close();
  return r === "" || r === "o" || r === "oui";
}

// 1. le dépôt : propre, sur la bonne branche, à jour
titre("1. Le jeu à jour");
const branche = option("--branche") || "main";
const sale = git(["status", "--porcelain", "--untracked-files=no"], { capter: true }).out;
if (sale) stop("Des fichiers du jeu sont modifiés sur cet ordinateur :", sale, "", "Les mettre de côté avec « git stash », puis relancer. Dans le doute, coller ce message à Claude.");
git(["fetch", "origin"]);
git(["checkout", branche]);
git(["pull", "--ff-only", "origin", branche]);

// 2. ce qu'il y a à faire (sans Python)
titre("2. Les phrases à fabriquer");
const { bilan } = await import("./fabriquer.mjs");
const { afaire, index, phrases } = bilan();
const perimees = Object.keys(index.phrases).filter((k) => !phrases.has(k));
if (!afaire.length && !perimees.length) {
  console.log(`Rien à fabriquer : les ${phrases.size} phrases ont leur voix.`);
  if (branche !== "main") git(["checkout", "main"]);
  process.exit(0);
}
const minutes = Math.max(1, Math.round((afaire.length * 4) / 60));
console.log(`${afaire.length} phrases à fabriquer (environ ${minutes} min), ${perimees.length} qui ne servent plus (leur fichier sera effacé).`);
for (const k of afaire.slice(0, 8)) console.log(`  « ${k} »`);
if (afaire.length > 8) console.log(`  … et ${afaire.length - 8} autres`);

// 3. Python et la référence (seulement s'il y a à fabriquer)
const env = {};
if (afaire.length) {
  titre("3. Chatterbox");
  const ref = resolve(RACINE, option("--ref") || process.env.VOIX_REF || join("..", "ref-posee.wav"));
  if (!existsSync(ref)) stop(`L'enregistrement de référence est introuvable : ${ref}`, "Le donner avec --ref, par exemple : node tools\\voix\\publier.mjs --ref D:\\ref-posee.wav");
  env.VOIX_REF = ref;
  const candidats = process.env.PYTHON ? [process.env.PYTHON] : [
    ...[RACINE, resolve(RACINE, "..")].flatMap((d) => [join(d, ".venv-voix", WIN ? "Scripts\\python.exe" : "bin/python")]).filter(existsSync),
    WIN ? "python" : "python3",
  ];
  const python = candidats.find((p) => lancer(p, ["-c", "import chatterbox, imageio_ffmpeg"], { capter: true, accepterEchec: true }).ok);
  if (!python) stop("Python ne trouve pas Chatterbox. Essayés : " + candidats.join(", "), "Activer d'abord l'environnement où il est installé (par exemple .venv-voix\\Scripts\\activate), ou donner son Python : $env:PYTHON = \"C:\\chemin\\python.exe\"");
  env.PYTHON = python;
  console.log(`Python : ${python}`);
  console.log(`Référence : ${ref}`);
}
if (!(await question("\nFabriquer maintenant ? (O/n) "))) stop("Arrêté, rien n'a changé.");

// 4. fabriquer (reprend où elle s'était arrêtée si on relance)
titre("4. Fabrication");
noeud([join("tools", "voix", "fabriquer.mjs")], { env });
console.log("\nSi une ligne « contrôle : … phrases refusées » s'affiche plus haut, ouvrir la page a-reecouter.html qu'elle indique et écouter ces phrases.");
console.log("Une phrase bonne à l'oreille : rien à faire. Une phrase mauvaise : arrêter ici (n) et voir docs\\VOIX.md, « Quand une phrase est mal dite ».");
if (!(await question("\nContinuer : vérifier et envoyer sur GitHub ? (O/n) "))) stop("Arrêté avant l'envoi. Les sons fabriqués restent sur cet ordinateur ; relancer la même commande pour reprendre.");

// 5. vérifier
titre("5. Vérification");
noeud([join("tools", "precache.mjs")]);
noeud(["--test", join("tests", "unit", "voix.test.mjs")]);

// 6. enregistrer et envoyer
titre("6. Envoi sur GitHub");
git(["add", "app", join("tools", "voix")]);
if (!git(["diff", "--cached", "--quiet"], { accepterEchec: true }).ok) {
  git(["commit", "-m", `Voix : ${afaire.length} phrases nouvelles${perimees.length ? `, ${perimees.length} retirées` : ""}`]);
  if (drapeau("--sans-envoi")) console.log("Enregistré sur cet ordinateur, pas envoyé (--sans-envoi) : « git push » pour envoyer.");
  else if (!git(["push", "origin", branche], { accepterEchec: true }).ok) { git(["pull", "--no-rebase", "--no-edit", "origin", branche]); git(["push", "origin", branche]); }
} else console.log("Rien de nouveau à enregistrer.");
if (branche !== "main") git(["checkout", "main"]);
console.log(branche === "main"
  ? "\nTerminé. GitHub publie la nouvelle version dans quelques minutes (onglet « Actions » du dépôt) ; la tablette la prend à sa prochaine ouverture avec le Wi-Fi."
  : `\nTerminé. Les voix sont sur la branche ${branche} : fusionner sa demande de fusion quand la coche est verte.`);
