// LE CONTRÔLE DES DURÉES (lot « Recette de l'enfant et nettoyage des couches », point 0.3 ; docs/LOTS.md, fiche 9).
// Le 11 octobre 2026, le parent entend « 2, 4, 2, 6 » à l'étal : le fichier de la phrase « 4 » dure 1,6 s, en deux morceaux
// de paroles séparés par 0,6 s de silence, alors que « 2 », « 3 », « 6 » et « 8 » durent de 0,5 à 0,8 s, d'un seul tenant
// (« 0 » et « 9 » de même, 1,9 s). Le contrôle par retranscription ne l'avait pas vu : Whisper entend bien « 4 ».
// Ce contrôle-ci écoute la forme du son, pas les mots :
//  - les MORCEAUX DE PAROLES : l'énergie du son par tranches de 10 ms ; une tranche est parlée au-dessus de `seuilDb` sous la
//    plus forte ; deux morceaux séparés de moins de `pauseMinMs` n'en font qu'un (les silences des consonnes) ; un morceau
//    de moins de `morceauMinMs` (un clic) ne compte pas ;
//  - une phrase d'UN SEUL MOT dit coupée par une pause d'au moins `pauseMotMs` est refusée ;
//  - une phrase BIEN PLUS LENTE QUE CELLES DE SA FAMILLE est refusée. La famille : le même texte, nombres mis à part
//    (« # plus # ? », « Ça fait #. », « # ») ; une famille de moins de `familleMin` phrases est remplacée par le genre (le
//    nombre de mots dits : 1, 2, 3-4, 5-8, 9 et plus). La vitesse d'une phrase : ses secondes de paroles par lettre dite.
//    Refusée si elle s'écarte de la médiane de sa famille de plus de `ecarts` écarts robustes (1,4826 × l'écart médian),
//    et dure plus de `fois` fois, et au moins `margeS` secondes de plus, que ce que donne cette médiane.
// Les seuils et les références des familles (médiane, écart) sont dans tools/voix/durees.json, partagé avec la fabrication
// (chatterbox_lot.py, qui refait elle-même les tirages refusés, comme ceux de la retranscription) ; ils ont été réglés sur les
// 11 382 phrases fabriquées le 11 octobre 2026 : 51 refusées, dont « 0 », « 4 », « 9 » et « 30 ».
//   node tools/voix/durees.mjs              contrôle toutes les phrases fabriquées : liste, tools/voix/durees-a-reecouter.html
//   node tools/voix/durees.mjs --a-refaire  écrit aussi tools/voix/a-refaire.txt (docs/VOIX.md, « De nouveaux tirages »)
//   node tools/voix/durees.mjs --reference  refait aussi les références des familles (durees.json), d'après toutes les phrases
// Le décodage des fichiers Opus demande ffmpeg (variable FFMPEG, ou celui de imageio-ffmpeg, ou ffmpeg dans le PATH).
import { execFileSync, spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ICI = fileURLToPath(new URL(".", import.meta.url)), FICHIER_REF = join(ICI, "durees.json");
export const reference = () => JSON.parse(readFileSync(FICHIER_REF, "utf8"));
const TRANCHE = 0.01; // s

// les morceaux de paroles d'un son mono (échantillons entre -1 et 1)
export function morceaux(ech, sr, R = reference().regles) {
  const L = Math.round(sr * TRANCHE), n = Math.floor(ech.length / L), db = new Float64Array(n);
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    let s = 0; for (let j = i * L; j < (i + 1) * L; j++) s += ech[j] * ech[j];
    db[i] = 10 * Math.log10(s / L + 1e-12); if (db[i] > max) max = db[i];
  }
  const seuil = Math.max(max - R.seuilDb, R.plancherDb), bruts = [];
  for (let i = 0, a = -1; i <= n; i++) {
    const parle = i < n && db[i] > seuil;
    if (parle && a < 0) a = i; else if (!parle && a >= 0) { bruts.push([a, i]); a = -1; }
  }
  const fusion = [];
  for (const m of bruts) { const d = fusion.at(-1); if (d && (m[0] - d[1]) * 10 < R.pauseMinMs) d[1] = m[1]; else fusion.push([...m]); }
  const mx = fusion.filter(([a, b]) => (b - a) * 10 >= R.morceauMinMs);
  const pauses = mx.slice(1).map((m, i) => (m[0] - mx[i][1]) * 10);
  return { total: Math.round((ech.length / sr) * 1000) / 1000, morceaux: mx.length, pauses, parole: mx.length ? Math.round((mx.at(-1)[1] - mx[0][0]) * 10) / 1000 : 0 };
}

// ce qui est dit (le texte donné à la voix) : ses mots et ses lettres ; la famille et le genre d'une phrase
const mots = (lu) => lu.trim().split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m)).length;
const lettres = (lu) => (lu.match(/[\p{L}\p{N}]/gu) ?? []).length;
export const famille = (cle) => cle.replace(/\d+/g, "#");
export const genre = (lu) => { const n = mots(lu); return n <= 1 ? "1 mot" : n === 2 ? "2 mots" : n <= 4 ? "3-4 mots" : n <= 8 ? "5-8 mots" : "9 mots et plus"; };
const mediane = (v) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const stat = (v) => { const md = mediane(v); return [Math.round(md * 1e5) / 1e5, Math.round(mediane(v.map((x) => Math.abs(x - md))) * 1.4826 * 1e5) / 1e5]; };

// les références des familles et des genres, d'après un ensemble de phrases mesurées [{ cle, lu, mesure }]
export function references(phrases, regles = reference().regles) {
  const par = (f) => { const m = {}; for (const p of phrases) if (p.mesure.parole > 0) (m[f(p)] ??= []).push(p.mesure.parole / Math.max(1, lettres(p.lu))); return m; };
  const familles = Object.fromEntries(Object.entries(par((p) => famille(p.cle))).filter(([, v]) => v.length >= regles.familleMin).map(([k, v]) => [k, stat(v)]).sort(([a], [b]) => a.localeCompare(b, "fr")));
  const genres = Object.fromEntries(Object.entries(par((p) => genre(p.lu))).map(([k, v]) => [k, stat(v)]));
  return { regles, familles, genres };
}

// le jugement d'une phrase : la cause du refus, ou null
export function juger(cle, lu, m, ref = reference()) {
  const R = ref.regles, causes = [];
  if (!m.morceaux) return "aucune parole";
  const pause = Math.max(0, ...m.pauses);
  if (mots(lu) <= 1 && pause >= R.pauseMotMs) causes.push(`un seul mot, en ${m.morceaux} morceaux (pause de ${(pause / 1000).toFixed(1)} s)`);
  const [md, ec] = ref.familles[famille(cle)] ?? ref.genres[genre(lu)] ?? ref.genres["5-8 mots"], n = Math.max(1, lettres(lu)), attendu = md * n;
  if (m.parole / n - md > R.ecarts * ec && m.parole > attendu * R.fois && m.parole - attendu >= R.margeS) causes.push(`${m.parole.toFixed(1)} s de paroles, pour environ ${attendu.toFixed(1)} s dans sa famille`);
  return causes.length ? causes.join(" ; ") : null;
}
export const controler = (phrases, ref = reference()) => phrases.map((p) => ({ ...p, cause: juger(p.cle, p.lu, p.mesure, ref) })).filter((p) => p.cause);

// un fichier son décodé en échantillons mono à 16 kHz (ffmpeg)
export const FFMPEG = () => process.env.FFMPEG || (() => { try { return execFileSync(process.env.PYTHON || (process.platform === "win32" ? "python" : "python3"), ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return "ffmpeg"; } })();
export const decoder = (ff, fichier, sr = 16000) => new Promise((ok, ko) => {
  const p = spawn(ff, ["-loglevel", "error", "-i", fichier, "-ac", "1", "-ar", String(sr), "-f", "f32le", "-"]), parts = [];
  p.stdout.on("data", (d) => parts.push(d)); p.on("error", ko);
  p.on("close", (c) => { if (c !== 0) return ko(new Error(`ffmpeg : code ${c} (${fichier})`)); const b = Buffer.concat(parts); ok(new Float32Array(b.buffer, b.byteOffset, b.length / 4)); });
});
// un WAV PCM 16 bits (les sons bruts de tools/voix/travail/) en échantillons mono
export function lireWav(buf) {
  let o = 12, sr = 0, voies = 1, bits = 16;
  while (o < buf.length) {
    const id = buf.toString("ascii", o, o + 4), size = buf.readUInt32LE(o + 4);
    if (id === "fmt ") { voies = buf.readUInt16LE(o + 10); sr = buf.readUInt32LE(o + 12); bits = buf.readUInt16LE(o + 22); }
    if (id === "data") {
      if (bits !== 16) throw new Error(`WAV en ${bits} bits`);
      const n = size / 2 / voies, ech = new Float32Array(n);
      for (let i = 0; i < n; i++) ech[i] = buf.readInt16LE(o + 8 + i * 2 * voies) / 32768;
      return { ech, sr };
    }
    o += 8 + size + (size % 2);
  }
  throw new Error("WAV sans données");
}

// la page d'écoute des phrases refusées par ce contrôle
export const page = (refus, src) => {
  const e = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const rangs = refus.map((p) => `<tr><td>${e(p.cle)}</td><td>${e(p.cause)}</td><td><audio controls preload="none" src="${e(src(p))}"></audio></td></tr>`).join("\n");
  return `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Durées à réécouter</title>
<style>body{font:15px system-ui,sans-serif;margin:24px}td,th{border:1px solid #c9d6dc;padding:6px 10px;text-align:left}table{border-collapse:collapse}</style>
<h1>${refus.length} phrase(s) à réécouter : durée anormale</h1>
<p>Le contrôle des durées a trouvé un son coupé en plusieurs morceaux, ou bien plus long que les phrases du même genre
(docs/VOIX.md, « Ce que le contrôle entend »). Si le son est mauvais à l'oreille : mettre la phrase dans
<code>tools/voix/a-refaire.txt</code> et relancer avec <code>--refaire</code>. S'il est bon, il n'y a rien à faire.</p>
<table><tr><th>Phrase</th><th>Ce que le contrôle a mesuré</th><th>Son</th></tr>
${rangs}</table></html>
`;
};

async function parLots(items, n, f) { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await f(items[i++]); })); }

// toutes les phrases déjà fabriquées (app/assets/voix/index.json)
async function main() {
  const { lire, VOIX } = await import("./fabriquer.mjs");
  const index = JSON.parse(readFileSync(join(VOIX, "index.json"), "utf8")).phrases, ff = FFMPEG(), t0 = Date.now();
  // (les phrases qui ne servent plus, encore dans l'index jusqu'à la prochaine fabrication, ne sont pas contrôlées)
  const inv = (await import("./inventaire.mjs")).inventaire();
  const phrases = Object.entries(index).filter(([cle, [f]]) => inv.has(cle) && existsSync(join(VOIX, f))).map(([cle, [f]]) => ({ cle, lu: lire(cle), fichier: f }));
  console.log(`contrôle des durées : ${phrases.length} phrases…`);
  let n = 0;
  await parLots(phrases, cpus().length, async (p) => { p.mesure = morceaux(await decoder(ff, join(VOIX, p.fichier)), 16000); if (++n % 2000 === 0) console.log(`  ${n}/${phrases.length}`); });
  let ref = reference();
  if (process.argv.includes("--reference")) { ref = references(phrases, ref.regles); writeFileSync(FICHIER_REF, JSON.stringify(ref, null, 1) + "\n"); console.log(`références : ${Object.keys(ref.familles).length} familles (tools/voix/durees.json)`); }
  const refus = controler(phrases, ref).sort((a, b) => a.cle.localeCompare(b.cle, "fr", { numeric: true }));
  for (const p of refus) console.log(`  « ${p.cle} » : ${p.cause} (${p.fichier})`);
  writeFileSync(join(ICI, "durees-a-reecouter.html"), page(refus, (p) => `../../app/assets/voix/${p.fichier}`));
  if (process.argv.includes("--a-refaire")) writeFileSync(join(ICI, "a-refaire.txt"), refus.map((p) => p.cle).join("\n") + "\n");
  console.log(`${refus.length} phrase(s) refusée(s) sur ${phrases.length}, en ${Math.round((Date.now() - t0) / 1000)} s : tools/voix/durees-a-reecouter.html${process.argv.includes("--a-refaire") ? ", tools/voix/a-refaire.txt" : ""}`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
