// LE NUMÉRO DE VERSION LISIBLE (demande du parent du 3 novembre 2026, lot « Correctifs de la confrontation 2 ») : l'écran de
// démarrage écrit « version 0.72 03/11/2026 » au lieu de l'empreinte « version f2f4954 » : le numéro de la demande de fusion
// divisé par 100 (la 72 donne 0.72, la 100 donnera 1.00), puis la date de la dernière fusion sur `main`.
//  - le numéro : le plus grand numéro de demande de fusion fusionnée dans l'histoire de `main` (une demande ancienne fusionnée
//    après une plus récente, la 67 après la 72, ne fait pas reculer le numéro) ;
//  - la date : celle de la dernière fusion (l'heure de Paris).
// Lancé par la publication (.github/workflows/pages.yml) après tools/precache.mjs : il ajoute `libelle` à app/version.json.
// Le libellé n'entre pas dans l'empreinte (sw.js, VERSION) : une fusion qui ne change pas l'application (la documentation
// seule) ne fait pas retélécharger les 12 000 fichiers à la tablette, qui garde alors le libellé de la version qu'elle sert.
// Sans libellé (dans le dépôt, sur l'ordinateur), l'écran écrit l'empreinte, comme avant.
//   node tools/version-libelle.mjs            (écrit app/version.json)
//   node tools/version-libelle.mjs --montrer  (écrit seulement le libellé)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// le numéro d'une demande de fusion dans le message d'un commit de `main` : « Merge pull request #72 from … » (fusion) ou
// « Titre (#72) » (fusion écrasée)
export const numeroPR = (sujet) => { const m = /^Merge pull request #(\d+)\b/.exec(sujet) ?? /\(#(\d+)\)\s*$/.exec(sujet); return m ? Number(m[1]) : null; };
export const numeroVersion = (n) => (n / 100).toFixed(2);
export const dateParis = (iso) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
// `commits` : [{ sujet, date }] du plus récent au plus ancien (git log --first-parent)
export function libelle(commits) {
  const fusions = commits.map((c) => ({ ...c, n: numeroPR(c.sujet) })).filter((c) => c.n != null);
  if (!fusions.length) return null;
  return `${numeroVersion(Math.max(...fusions.map((c) => c.n)))} ${dateParis(fusions[0].date)}`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = execFileSync("git", ["log", "--first-parent", "--format=%s%x09%cI", "HEAD"], { encoding: "utf8", maxBuffer: 64 << 20 });
  const commits = out.split("\n").filter(Boolean).map((l) => { const i = l.lastIndexOf("\t"); return { sujet: l.slice(0, i), date: l.slice(i + 1) }; });
  const lib = libelle(commits);
  if (process.argv.includes("--montrer")) { console.log(lib ?? "(aucune demande de fusion trouvée)"); process.exit(0); }
  const p = fileURLToPath(new URL("../app/version.json", import.meta.url)), v = JSON.parse(readFileSync(p, "utf8"));
  if (lib) v.libelle = lib; else delete v.libelle;
  writeFileSync(p, JSON.stringify(v) + "\n");
  console.log(`version.json : ${JSON.stringify(v)}`);
}
