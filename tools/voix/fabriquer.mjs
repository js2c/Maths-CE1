// FABRICATION DE LA VOIX (docs/SPEC.md, « Voix enregistrée à l'avance » ; docs/ARCHITECTURE.md, « La voix »).
// Tourne sur un ordinateur, jamais sur la tablette. Pour chaque phrase de l'inventaire (inventaire.mjs) :
// nombres et symboles en lettres (lettres.mjs), synthèse par Piper (piper_lot.py), compression en Opus
// mono, fichier nommé par l'empreinte de son contenu dans app/assets/voix/, et l'index de l'application
// (app/assets/voix/index.json : phrase -> [fichier, durée en ms]).
//
// Piper n'est pas déterministe (un peu de hasard dans le rythme) : une phrase déjà fabriquée n'est
// refabriquée que si son texte lu ou les réglages de la voix changent (tools/voix/fabrique.json garde ce
// qui a servi). Les fichiers qui ne servent plus sont supprimés.
//
//   pip install piper-tts imageio-ffmpeg        (une fois ; ou un ffmpeg avec libopus dans la variable FFMPEG)
//   node tools/voix/fabriquer.mjs               fabrique ce qui manque ou a changé
//   node tools/voix/fabriquer.mjs --tout        refabrique tout
//   node tools/voix/fabriquer.mjs --verifier    échoue si une phrase n'a pas son fichier (sans rien fabriquer)
// Le modèle de voix est téléchargé au premier lancement dans tools/voix/modeles/ (non versionné).
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { cpus, tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { inventaire } from "./inventaire.mjs";
import { pourLaVoix } from "./lettres.mjs";

const ICI = fileURLToPath(new URL(".", import.meta.url));
export const VOIX = fileURLToPath(new URL("../../app/assets/voix/", import.meta.url));
const ETAT = join(ICI, "fabrique.json"), MODELES = join(ICI, "modeles");
// la voix choisie par le parent (docs/voix-echantillons/, 26 septembre 2026) : siwis, vitesse normale
export const REGLAGES = {
  modele: "fr_FR-siwis-medium", source: "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/",
  locuteur: null, vitesse: 1.0, // length_scale de Piper
  opus: "24k", finMs: 60, // débit Opus ; silence ajouté en fin de phrase (Piper coupe parfois au ras du dernier son)
};
const cle = (r) => JSON.stringify([r.modele, r.locuteur, r.vitesse, r.opus, r.finMs]);

const lireJson = (p, def) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return def; } };
const ffmpeg = () => process.env.FFMPEG || execFileSync("python3", ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8" }).trim();

// durée d'un WAV (en-tête RIFF : fmt puis data)
function dureeWav(buf) {
  let o = 12, rate = 0, align = 0;
  while (o < buf.length) {
    const id = buf.toString("ascii", o, o + 4), size = buf.readUInt32LE(o + 4);
    if (id === "fmt ") { rate = buf.readUInt32LE(o + 12); align = buf.readUInt16LE(o + 20); }
    if (id === "data") return Math.round((size / align / rate) * 1000);
    o += 8 + size + (size % 2);
  }
  throw new Error("WAV sans données");
}

function modele() {
  mkdirSync(MODELES, { recursive: true });
  for (const f of [`${REGLAGES.modele}.onnx`, `${REGLAGES.modele}.onnx.json`, "MODEL_CARD"]) {
    const p = join(MODELES, f === "MODEL_CARD" ? `${REGLAGES.modele}.MODEL_CARD` : f);
    if (!existsSync(p)) { console.log(`téléchargement de ${f}…`); execFileSync("curl", ["-sSfL", "-o", p, REGLAGES.source + f], { stdio: "inherit" }); }
  }
  return join(MODELES, `${REGLAGES.modele}.onnx`);
}

// un lot de phrases dans un processus Python (le modèle est chargé une fois par lot)
const synthese = (onnx, dossier, phrases) => new Promise((ok, ko) => {
  const p = spawn("python3", [join(ICI, "piper_lot.py")], { stdio: ["pipe", "inherit", "inherit"] });
  p.on("exit", (c) => (c === 0 ? ok() : ko(new Error(`piper_lot.py : code ${c}`))));
  p.stdin.end(JSON.stringify({ modele: onnx, locuteur: REGLAGES.locuteur, vitesse: REGLAGES.vitesse, dossier, phrases }));
});
const encoder = (ff, wav, ogg) => new Promise((ok, ko) => {
  const p = spawn(ff, ["-y", "-loglevel", "error", "-i", wav, "-af", `apad=pad_dur=${REGLAGES.finMs / 1000}`, "-ac", "1", "-ar", "48000", "-c:a", "libopus", "-b:a", REGLAGES.opus, "-map_metadata", "-1", "-fflags", "+bitexact", ogg]);
  p.on("exit", (c) => (c === 0 ? ok() : ko(new Error(`ffmpeg : code ${c} (${wav})`))));
});
async function parLots(items, n, f) { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await f(items[i++]); })); }

// l'état de la voix : ce qui manque ou a changé par rapport à l'inventaire
export function bilan() {
  const phrases = inventaire(), index = lireJson(join(VOIX, "index.json"), { phrases: {} }), etat = lireJson(ETAT, { reglages: null, lu: {} });
  const memes = etat.reglages === cle(REGLAGES);
  const afaire = [...phrases.keys()].filter((k) => !memes || !index.phrases[k] || etat.lu[k] !== pourLaVoix(k) || !existsSync(join(VOIX, index.phrases[k][0])));
  return { phrases, index, etat, afaire };
}

async function main() {
  const { phrases, index, etat, afaire } = bilan(), tout = process.argv.includes("--tout");
  const liste = tout ? [...phrases.keys()] : afaire;
  if (process.argv.includes("--verifier")) {
    if (afaire.length) { console.error(`voix : ${afaire.length} phrases sans fichier à jour, par exemple « ${afaire[0]} ». Lancer : node tools/voix/fabriquer.mjs`); process.exit(1); }
    return console.log(`voix à jour (${phrases.size} phrases)`);
  }
  mkdirSync(VOIX, { recursive: true });
  const nouvel = { voix: `Piper ${REGLAGES.modele}${REGLAGES.locuteur != null ? ` #${REGLAGES.locuteur}` : ""}, vitesse ${REGLAGES.vitesse}`, phrases: {} }, lu = {};
  for (const k of phrases.keys()) if (!liste.includes(k) && index.phrases[k]) { nouvel.phrases[k] = index.phrases[k]; lu[k] = etat.lu[k]; }
  if (liste.length) {
    const onnx = modele(), tmp = mkdtempSync(join(tmpdir(), "voix-")), ff = ffmpeg(), t0 = Date.now();
    const jobs = liste.map((k, i) => ({ id: String(i), cle: k, texte: pourLaVoix(k) }));
    console.log(`synthèse de ${jobs.length} phrases…`);
    const n = Math.max(1, Math.min(4, cpus().length)), part = Math.ceil(jobs.length / n);
    await Promise.all(Array.from({ length: n }, (_, j) => synthese(onnx, tmp, jobs.slice(j * part, (j + 1) * part).map(({ id, texte }) => ({ id, texte })))));
    console.log(`compression en Opus…`);
    await parLots(jobs, cpus().length, async (j) => {
      const wav = join(tmp, `${j.id}.wav`), ogg = join(tmp, `${j.id}.ogg`);
      await encoder(ff, wav, ogg);
      const data = readFileSync(ogg), f = `${createHash("sha256").update(data).digest("hex").slice(0, 12)}.ogg`;
      writeFileSync(join(VOIX, f), data);
      nouvel.phrases[j.cle] = [f, dureeWav(readFileSync(wav)) + REGLAGES.finMs]; lu[j.cle] = j.texte;
    });
    rmSync(tmp, { recursive: true, force: true });
    console.log(`${jobs.length} phrases fabriquées en ${Math.round((Date.now() - t0) / 1000)} s`);
  }
  // l'index trié (diff lisible), les fichiers orphelins supprimés
  nouvel.phrases = Object.fromEntries(Object.entries(nouvel.phrases).sort(([a], [b]) => a.localeCompare(b, "fr")));
  writeFileSync(join(VOIX, "index.json"), JSON.stringify(nouvel, null, 0).replace(/\],"/g, '],\n"') + "\n");
  writeFileSync(ETAT, JSON.stringify({ reglages: cle(REGLAGES), lu: Object.fromEntries(Object.entries(lu).sort(([a], [b]) => a.localeCompare(b, "fr"))) }, null, 1) + "\n");
  const gardes = new Set(Object.values(nouvel.phrases).map(([f]) => f));
  let supprimes = 0; for (const f of readdirSync(VOIX)) if (f.endsWith(".ogg") && !gardes.has(f)) { unlinkSync(join(VOIX, f)); supprimes++; }
  const poids = readdirSync(VOIX).reduce((s, f) => s + statSync(join(VOIX, f)).size, 0);
  console.log(`voix : ${gardes.size} fichiers, ${(poids / 1e6).toFixed(2)} Mo${supprimes ? `, ${supprimes} fichiers supprimés` : ""}. Relancer ensuite : node tools/precache.mjs`);
}
if (import.meta.url === `file://${process.argv[1]}`) await main();
