// FABRICATION DE LA VOIX (docs/SPEC.md, « Voix enregistrée à l'avance » ; docs/ARCHITECTURE.md, « La voix »).
// Tourne sur un ordinateur, jamais sur la tablette. Pour chaque phrase de l'inventaire (inventaire.mjs) :
// nombres et symboles en lettres (lettres.mjs), synthèse, compression en Opus mono, fichier nommé par
// l'empreinte de son contenu dans app/assets/voix/, et l'index de l'application
// (app/assets/voix/index.json : phrase -> [fichier, durée en ms]).
//
// Deux moteurs (REGLAGES.moteur) :
// - « chatterbox » : Chatterbox Multilingual V3 sur la carte graphique du parent, qui imite un
//   enregistrement de référence (la voix du parent, gardée hors du dépôt). Chaque phrase est retranscrite
//   et comparée à son texte, refaite si besoin (chatterbox_lot.py). Les sons bruts restent dans
//   tools/voix/travail/ (non versionné) : un lot interrompu reprend où il s'était arrêté.
// - « piper » : l'ancienne voix (piper_lot.py), modèle téléchargé dans tools/voix/modeles/ (non versionné).
//
// La synthèse n'est pas déterministe : une phrase déjà fabriquée n'est refabriquée que si son texte lu ou
// les réglages de la voix changent (tools/voix/fabrique.json garde ce qui a servi). Les fichiers qui ne
// servent plus sont supprimés.
//
//   pip install imageio-ffmpeg                  (une fois, dans l'environnement de Chatterbox ; ou un ffmpeg avec libopus dans la variable FFMPEG)
//   node tools/voix/fabriquer.mjs --ref ma-voix.wav --essai 80   répétition : 80 phrases fabriquées et contrôlées, sans toucher à l'application
//   node tools/voix/fabriquer.mjs --ref ma-voix.wav              fabrique ce qui manque ou a changé
//   node tools/voix/fabriquer.mjs --ref ma-voix.wav --refaire    nouveaux tirages pour les phrases que le contrôle a refusées
//                                                                (ou seulement celles de tools/voix/a-refaire.txt, s'il existe)
//   node tools/voix/fabriquer.mjs --ref ma-voix.wav --tout       refabrique tout (les sons bruts déjà faits avec cette référence sont repris)
//   node tools/voix/fabriquer.mjs --verifier    échoue si une phrase n'a pas son fichier (sans rien fabriquer)
// La marche à suivre du parent : docs/VOIX.md. La référence peut aussi être donnée par la variable VOIX_REF. Changer de référence : relancer avec --tout.
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { cpus, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inventaire } from "./inventaire.mjs";
import { pourLaVoix } from "./lettres.mjs";

// Les écritures particulières (tools/voix/ecritures.json : phrase du jeu -> texte donné à la voix), pour une
// phrase que la voix dit mal malgré les règles de lettres.mjs (« 900 » -> « neuf sans »). Le contrôle compare
// toujours la retranscription au texte normal de la phrase.
const FICHIER_ECRITURES = join(dirname(fileURLToPath(import.meta.url)), "ecritures.json");
const ECRITURES = existsSync(FICHIER_ECRITURES) ? JSON.parse(readFileSync(FICHIER_ECRITURES, "utf8")) : {};
export const lire = (k) => ECRITURES[k] ?? pourLaVoix(k);

const ICI = fileURLToPath(new URL(".", import.meta.url));
export const VOIX = fileURLToPath(new URL("../../app/assets/voix/", import.meta.url));
const ETAT = join(ICI, "fabrique.json"), MODELES = join(ICI, "modeles");
// la voix choisie par le parent (essai d'écoute du 3 octobre 2026) : Chatterbox, la voix du parent en
// référence « posée », réglage « régulier ». L'ancienne voix (26 septembre 2026) : PIPER, plus bas.
export const REGLAGES = {
  moteur: "chatterbox", modele: "chatterbox-multilingual-v3",
  exaggeration: 0.5, cfg_weight: 0.5, temperature: 0.5, // expressivité, fidélité au rythme de la référence, part de hasard
  essais: 4, whisper: "openai/whisper-large-v3-turbo", // tirages au plus par phrase ; le modèle qui retranscrit pour le contrôle
  opus: "24k", finMs: 60, // débit Opus ; silence ajouté en fin de phrase
};
export const PIPER = {
  moteur: "piper", modele: "fr_FR-siwis-medium", source: "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/siwis/medium/",
  locuteur: null, vitesse: 1.0, // length_scale de Piper
  opus: "24k", finMs: 60,
};
const cle = (r) => JSON.stringify(r.moteur === "piper" ? [r.modele, r.locuteur, r.vitesse, r.opus, r.finMs] : [r.modele, r.exaggeration, r.cfg_weight, r.temperature, r.opus, r.finMs]);
const PYTHON = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const option = (nom) => { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : undefined; };
const sha = (x, n = 12) => createHash("sha256").update(x).digest("hex").slice(0, n);

const lireJson = (p, def) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return def; } };
const ffmpeg = () => process.env.FFMPEG || execFileSync(PYTHON, ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8" }).trim();

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

// le modèle de Piper (moteur « piper »)
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
  const p = spawn(PYTHON, [join(ICI, "piper_lot.py")], { stdio: ["pipe", "inherit", "inherit"] });
  p.on("exit", (c) => (c === 0 ? ok() : ko(new Error(`piper_lot.py : code ${c}`))));
  p.stdin.end(JSON.stringify({ modele: onnx, locuteur: REGLAGES.locuteur, vitesse: REGLAGES.vitesse, dossier, phrases }));
});
// Chatterbox : un seul processus (la carte graphique), qui fabrique, retranscrit, compare et refait ; il passe
// les phrases déjà faites. Le dossier de travail dépend de la référence et des réglages.
function travail() {
  const ref = option("--ref") || process.env.VOIX_REF;
  if (!ref || !existsSync(ref)) { console.error("voix : donner l'enregistrement de référence, par exemple : node tools/voix/fabriquer.mjs --ref ..\\ref-posee.wav"); process.exit(1); }
  return { ref, dossier: join(ICI, "travail", `${sha(readFileSync(ref), 8)}-${sha(cle(REGLAGES), 8)}`) };
}
const chatterbox = ({ ref, dossier }, phrases) => new Promise((ok, ko) => {
  const p = spawn(PYTHON, [join(ICI, "chatterbox_lot.py")], { stdio: ["pipe", "inherit", "inherit"] });
  p.on("exit", (c) => (c === 0 ? ok() : ko(new Error(`chatterbox_lot.py : code ${c}`))));
  const { exaggeration, cfg_weight, temperature, essais, whisper } = REGLAGES;
  p.stdin.end(JSON.stringify({ ref, dossier, essais, whisper, refaire: process.argv.includes("--refaire") && !existsSync(join(ICI, "a-refaire.txt")), cpu: process.argv.includes("--cpu"), reglages: { exaggeration, cfg_weight, temperature }, phrases }));
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
  const afaire = [...phrases.keys()].filter((k) => !memes || !index.phrases[k] || etat.lu[k] !== lire(k) || !existsSync(join(VOIX, index.phrases[k][0])));
  return { phrases, index, etat, afaire };
}

async function main() {
  const { phrases, index, etat, afaire } = bilan(), tout = process.argv.includes("--tout"), piper = REGLAGES.moteur === "piper";
  let liste = tout ? [...phrases.keys()] : afaire;
  if (process.argv.includes("--verifier")) {
    if (afaire.length) { console.error(`voix : ${afaire.length} phrases sans fichier à jour, par exemple « ${afaire[0]} ». Lancer : node tools/voix/fabriquer.mjs`); process.exit(1); }
    return console.log(`voix à jour (${phrases.size} phrases)`);
  }
  const choisies = new Set();
  const job = (k) => ({ id: sha(lire(k), 16), cle: k, texte: lire(k), attendu: pourLaVoix(k), forcer: choisies.has(k) });
  // --refaire : les phrases que le contrôle a refusées repassent, même si elles ont déjà leur fichier. Si le fichier
  // tools/voix/a-refaire.txt existe (une phrase par ligne, telle qu'elle est écrite dans a-reecouter.html), seules
  // ces phrases-là repassent, refusées ou non : c'est le moyen de refaire un son jugé mauvais à l'oreille.
  if (process.argv.includes("--refaire") && !piper && !tout) {
    const f = join(ICI, "a-refaire.txt"), d = travail().dossier;
    if (existsSync(f)) {
      for (const l of readFileSync(f, "utf8").split(/\r?\n/).map((x) => x.trim()).filter(Boolean)) { if (phrases.has(l)) choisies.add(l); else console.error(`voix : phrase inconnue dans a-refaire.txt, ignorée : « ${l} »`); }
      liste = [...new Set([...liste, ...choisies])];
    } else liste = [...new Set([...liste, ...[...phrases.keys()].filter((k) => lireJson(join(d, `${job(k).id}.json`), {}).juste === false)])];
  }
  // la répétition : un échantillon de l'inventaire, fabriqué et contrôlé, sans toucher à l'application
  if (option("--essai")) {
    const toutes = [...phrases.keys()], n = Math.min(toutes.length, Number(option("--essai")) || 80), t = travail(), t0 = Date.now();
    // moitié de phrases très courtes (un ou deux mots, les plus fragiles), moitié de phrases de toutes sortes
    const courtes = toutes.filter((k) => pourLaVoix(k).split(" ").length <= 2), pris = (l, m) => Array.from({ length: Math.min(m, l.length) }, (_, i) => l[Math.floor((i * l.length) / Math.min(m, l.length))]);
    const choix = [...new Set([...pris(courtes, Math.floor(n / 2)), ...pris(toutes, Math.ceil(n / 2))])];
    await chatterbox(t, choix.map(job));
    const s = (Date.now() - t0) / 1000;
    return console.log(`répétition : ${choix.length} phrases en ${Math.round(s)} s, soit environ ${((s / choix.length) * toutes.length / 3600).toFixed(1)} h pour les ${toutes.length} phrases (chargement des modèles compris). Phrases refusées : ${join(t.dossier, "a-reecouter.html")}`);
  }
  mkdirSync(VOIX, { recursive: true });
  const nom = piper ? `Piper ${REGLAGES.modele}${REGLAGES.locuteur != null ? ` #${REGLAGES.locuteur}` : ""}, vitesse ${REGLAGES.vitesse}` : `Chatterbox Multilingual V3, voix du parent (exagération ${REGLAGES.exaggeration}, cfg ${REGLAGES.cfg_weight}, température ${REGLAGES.temperature})`;
  const nouvel = { voix: nom, phrases: {} }, lu = {}, refaites = new Set(liste);
  for (const k of phrases.keys()) if (!refaites.has(k) && index.phrases[k]) { nouvel.phrases[k] = index.phrases[k]; lu[k] = etat.lu[k]; }
  if (liste.length) {
    const tmp = mkdtempSync(join(tmpdir(), "voix-")), ff = ffmpeg(), t0 = Date.now();
    let jobs, wavDe;
    console.log(`synthèse de ${liste.length} phrases…`);
    if (piper) {
      const onnx = modele();
      jobs = liste.map((k, i) => ({ id: String(i), cle: k, texte: lire(k) })); wavDe = (j) => join(tmp, `${j.id}.wav`);
      const n = Math.max(1, Math.min(4, cpus().length)), part = Math.ceil(jobs.length / n);
      await Promise.all(Array.from({ length: n }, (_, j) => synthese(onnx, tmp, jobs.slice(j * part, (j + 1) * part).map(({ id, texte }) => ({ id, texte })))));
    } else {
      const t = travail();
      jobs = liste.map(job); wavDe = (j) => join(t.dossier, `${j.id}.wav`);
      await chatterbox(t, jobs);
      const refusees = jobs.filter((j) => !lireJson(join(t.dossier, `${j.id}.json`), {}).juste);
      if (refusees.length) console.log(`contrôle : ${refusees.length} phrases refusées, gardées avec leur meilleur essai. À réécouter : ${join(t.dossier, "a-reecouter.html")} (nouveaux tirages : relancer avec --refaire)`);
    }
    console.log(`compression en Opus…`);
    await parLots(jobs.map((j, i) => ({ ...j, n: i })), cpus().length, async (j) => {
      const wav = wavDe(j), ogg = join(tmp, `${j.n}.ogg`);
      await encoder(ff, wav, ogg);
      const data = readFileSync(ogg), f = `${sha(data)}.ogg`;
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
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(); // (comparaison valable aussi sous Windows)
