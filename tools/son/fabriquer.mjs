// Fabrique les échantillons sonores du lot 2 (étape 3) dans docs/son-echantillons/ :
// bruitages et musiques en Ogg Opus (le format prévu pour l'application) et en MP3 (lisible partout),
// avec echantillons.json (durées, sonies, poids) lu par la page d'écoute index.html.
//
//   pip install imageio-ffmpeg        (une fois ; ou un ffmpeg avec libopus et libmp3lame dans la variable FFMPEG)
//   node tools/son/fabriquer.mjs                 tout
//   node tools/son/fabriquer.mjs bruitages       seulement les bruitages (ou : musiques)
//   node tools/son/fabriquer.mjs app             copie les sons choisis par le parent (reglages.json,
//                                                « application ») dans app/assets/son/, puis : node tools/precache.mjs
//
// Déterministe : même source, mêmes échantillons (empreinte « pcm » dans echantillons.json).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SR, db, gain, limiter, sonie } from "./synth.mjs";
import { BRUITAGES, fabriquerBruitage } from "./bruitages.mjs";
import { fabriquerMusique } from "./musiques.mjs";

const ICI = dirname(fileURLToPath(import.meta.url)), RACINE = join(ICI, "../..");
const SORTIE = join(RACINE, "docs/son-echantillons");
export const REGLAGES = JSON.parse(readFileSync(join(ICI, "reglages.json"), "utf8"));
const ffmpeg = () => process.env.FFMPEG || execFileSync("python3", ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8" }).trim();

// règle la sonie (momentanée maximale pour un bruitage, intégrée pour une musique), sans dépasser la crête
export function regler(canaux, cible, mode) {
  const s = sonie(canaux), mesure = mode === "bruitage" ? s.momentaneeMax : s.integree;
  gain(canaux, db(cible - mesure));
  const avant = sonie(canaux).crete;
  // une musique n'est jamais limitée (le limiteur casserait le régime périodique de la boucle) : si sa crête
  // dépasse, elle est baissée d'autant
  if (mode === "musique") {
    if (avant > REGLAGES.creteMax) gain(canaux, db(REGLAGES.creteMax - avant));
    return { ...sonie(canaux), limitation: 0 };
  }
  // bruitage : au plus 6 dB de limitation ; au-delà, on baisse plutôt que d'écraser le son
  for (let essai = 0; essai < 12; essai++) {
    const c = sonie(canaux).crete;
    if (c > REGLAGES.creteMax + 6) gain(canaux, db(REGLAGES.creteMax + 6 - c));
    if (c > REGLAGES.creteMax) limiter(canaux, REGLAGES.creteMax - 0.1);
    const s2 = sonie(canaux), ecart = cible - s2.momentaneeMax;
    if (Math.abs(ecart) <= 0.2 || s2.crete + ecart > REGLAGES.creteMax + 6) break;
    gain(canaux, db(ecart * 1.3));
  }
  if (sonie(canaux).crete > REGLAGES.creteMax) limiter(canaux, REGLAGES.creteMax - 0.1);
  return { ...sonie(canaux), limitation: Math.max(0, avant - REGLAGES.creteMax) };
}

export const empreinte = (canaux) => {
  const h = createHash("sha256");
  for (const c of canaux) h.update(Buffer.from(c.buffer, c.byteOffset, c.byteLength));
  return h.digest("hex").slice(0, 16);
};

function encoder(ff, canaux, nom, debits) {
  const tmp = mkdtempSync(join(tmpdir(), "son-")), brut = join(tmp, "x.f32");
  const n = canaux[0].length, entrelace = new Float32Array(n * canaux.length);
  for (let i = 0; i < n; i++) for (let c = 0; c < canaux.length; c++) entrelace[i * canaux.length + c] = canaux[c][i];
  writeFileSync(brut, Buffer.from(entrelace.buffer));
  const entree = ["-y", "-loglevel", "error", "-f", "f32le", "-ar", String(SR), "-ac", String(canaux.length), "-i", brut, "-map_metadata", "-1", "-fflags", "+bitexact"];
  execFileSync(ff, [...entree, "-c:a", "libopus", "-b:a", debits.opus, "-application", "audio", join(SORTIE, `${nom}.ogg`)]);
  execFileSync(ff, [...entree, "-c:a", "libmp3lame", "-b:a", debits.mp3, "-write_xing", "1", join(SORTIE, `${nom}.mp3`)]);
  rmSync(tmp, { recursive: true, force: true });
  return { opus: statSync(join(SORTIE, `${nom}.ogg`)).size, mp3: statSync(join(SORTIE, `${nom}.mp3`)).size };
}

const arrondi = (x, k = 1) => Math.round(x * 10 ** k) / 10 ** k;

// quelques phrases de la voix de l'application, pour entendre le mélange dans la page d'écoute
const VOIX = { consigne: "Place le poisson sur le nombre 37.", bravo: "Bravo !", erreur: "Ce n'est pas grave, regardons ensemble." };

// les sons de l'application : les fichiers Opus des échantillons choisis, nommés par l'empreinte de leur contenu
// (le service worker ne les retélécharge pas d'une version à l'autre), et app/assets/son/index.json
export const SON_APP = join(RACINE, "app/assets/son");
export function exporterApp() {
  const man = JSON.parse(readFileSync(join(SORTIE, "echantillons.json"), "utf8")), A = REGLAGES.application;
  rmSync(SON_APP, { recursive: true, force: true }); mkdirSync(SON_APP, { recursive: true });
  const copie = (src) => {
    const buf = readFileSync(join(SORTIE, `${src}.ogg`)), nom = `${src}-${createHash("sha256").update(buf).digest("hex").slice(0, 8)}.ogg`;
    writeFileSync(join(SON_APP, nom), buf); return nom;
  };
  const index = { _: "Fabriqué par node tools/son/fabriquer.mjs app (ne pas modifier à la main). Durées en secondes.", bruitages: {}, musiques: {} };
  for (const [role, cle] of Object.entries(A.bruitages)) index.bruitages[role] = { fichier: copie(`bruitage-${cle}`), duree: man.bruitages[cle].duree };
  for (const cle of A.musiques) index.musiques[cle] = { fichier: copie(`musique-${cle}`), duree: man.musiques[cle].duree, nom: man.musiques[cle].nom };
  writeFileSync(join(SON_APP, "index.json"), JSON.stringify(index, null, 1) + "\n");
  return index;
}

async function principal() {
  if (process.argv[2] === "app") { const i = exporterApp(); console.log(`app/assets/son : ${Object.keys(i.bruitages).length} bruitages, ${Object.keys(i.musiques).length} musiques`); return; }
  const quoi = process.argv[2] || "tout", ff = ffmpeg(), g = REGLAGES.graine;
  mkdirSync(SORTIE, { recursive: true });
  const fichier = join(SORTIE, "echantillons.json");
  const man = existsSync(fichier) ? JSON.parse(readFileSync(fichier, "utf8")) : {};
  man.fabrique = "node tools/son/fabriquer.mjs (synthèse, sans enregistrement ni banque de sons)";
  man.mixageEcoute = REGLAGES.mixageEcoute;
  man.sonieBruitages = REGLAGES.sonieBruitages;
  man.sonieMusique = REGLAGES.sonieMusique;

  if (quoi === "tout" || quoi === "bruitages") {
    man.bruitages = {};
    for (const [cle, def] of Object.entries(BRUITAGES)) {
      const canaux = [fabriquerBruitage(cle, g)];
      const cible = REGLAGES.sonieParBruitage[cle.replace(/-[ab]$/, "")] ?? REGLAGES.sonieBruitages;
      const s = regler(canaux, cible, "bruitage");
      const poids = encoder(ff, canaux, `bruitage-${cle}`, { opus: REGLAGES.opus.bruitages, mp3: REGLAGES.mp3.bruitages });
      man.bruitages[cle] = { nom: def.nom, duree: arrondi(canaux[0].length / SR, 2), sonie: arrondi(s.momentaneeMax), crete: arrondi(s.crete), limitation: arrondi(s.limitation), pcm: empreinte(canaux), ...poids };
      console.log(`bruitage ${cle} : ${man.bruitages[cle].duree} s, ${man.bruitages[cle].sonie} LUFS, limitation ${man.bruitages[cle].limitation} dB, ${poids.opus} o`);
    }
  }
  if (quoi === "tout" || quoi === "musiques") {
    man.musiques = {};
    for (const [cle, cfg] of Object.entries(REGLAGES.musiques)) {
      const t0 = Date.now(), { canaux, notes } = fabriquerMusique(cfg, g);
      const s = regler(canaux, REGLAGES.sonieMusique, "musique");
      const poids = encoder(ff, canaux, `musique-${cle}`, { opus: REGLAGES.opus.musiques, mp3: REGLAGES.mp3.musiques });
      man.musiques[cle] = { nom: cfg.nom, tempo: cfg.tempo, instrument: cfg.instrument, duree: arrondi(canaux[0].length / SR, 2), notes: notes.length, sonie: arrondi(s.integree), crete: arrondi(s.crete), limitation: arrondi(s.limitation), pcm: empreinte(canaux), ...poids };
      console.log(`musique ${cle} : ${man.musiques[cle].duree} s, ${notes.length} notes, ${man.musiques[cle].sonie} LUFS, ${poids.opus} o (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
    }
  }
  // voix : copie en MP3 de trois phrases déjà fabriquées pour l'application
  const index = JSON.parse(readFileSync(join(RACINE, "app/assets/voix/index.json"), "utf8")).phrases;
  man.voix = {};
  for (const [cle, phrase] of Object.entries(VOIX)) {
    const src = join(RACINE, "app/assets/voix", index[phrase][0]);
    execFileSync(ff, ["-y", "-loglevel", "error", "-i", src, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", "-map_metadata", "-1", "-fflags", "+bitexact", join(SORTIE, `voix-${cle}.mp3`)]);
    man.voix[cle] = { phrase, duree: arrondi(index[phrase][1] / 1000, 2) };
  }
  writeFileSync(fichier, JSON.stringify(man, null, 2) + "\n");
  // la page d'écoute porte ses données (elle doit marcher sans serveur de fichiers JSON)
  const page = join(SORTIE, "index.html"), balise = '<script type="application/json" id="donnees">';
  const html = readFileSync(page, "utf8"), a = html.indexOf(balise) + balise.length, b = html.indexOf("</script>", a);
  writeFileSync(page, html.slice(0, a) + JSON.stringify(man) + html.slice(b));
  const opus = Object.values(man.bruitages ?? {}).reduce((s, b) => s + b.opus, 0), mus = Object.values(man.musiques ?? {}).map((m) => m.opus);
  console.log(`Opus : bruitages ${(opus / 1e6).toFixed(2)} Mo ; musiques ${mus.map((x) => (x / 1e6).toFixed(2)).join(", ")} Mo`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await principal();
