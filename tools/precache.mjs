// LISTE DES FICHIERS DE L'APPLICATION POUR LE MODE HORS LIGNE.
// Écrit app/sw-files.json (tous les fichiers de app/, sauf le service worker et cette liste) et la
// version (empreinte de tout le contenu) dans la ligne VERSION de app/sw.js, et dans app/version.json (lot « Correctifs de
// la tablette » : l'écran de démarrage l'affiche ; hors de l'empreinte, mais dans la liste du mode hors ligne).
//   node tools/precache.mjs          met à jour
//   node tools/precache.mjs --check  échoue si la liste n'est pas à jour (tests, déploiement)
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const APP = fileURLToPath(new URL("../app/", import.meta.url)), SKIP = new Set(["sw.js", "sw-files.json", "version.json"]);
// (lot « Correctifs de la tablette ») l'empreinte d'un fichier texte est prise avec des fins de ligne LF : une copie du dépôt
// faite sous Windows avant le .gitattributes (fichiers en CRLF) donne la même version que GitHub
const TEXTE = /\.(js|mjs|json|html|css|webmanifest|svg|txt|md)$/i;
export const contenu = (f, buf) => (TEXTE.test(f) && buf.includes(13) ? Buffer.from(buf.toString("utf8").replace(/\r\n/g, "\n"), "utf8") : buf);
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
export const compute = () => {
  const files = walk(APP).map((p) => relative(APP, p).split(sep).join("/")).filter((f) => !SKIP.has(f) && !f.startsWith(".")).sort();
  const h = createHash("sha256"); for (const f of files) h.update(f).update(contenu(f, readFileSync(join(APP, f))));
  const version = h.digest("hex").slice(0, 12);
  return { version, files: ["./", ...files, "version.json"] };
};
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) { // (comparaison valable aussi sous Windows)
  const c = compute(), jsonPath = join(APP, "sw-files.json"), swPath = join(APP, "sw.js"), versionPath = join(APP, "version.json"), version = JSON.stringify({ version: c.version }) + "\n";
  const json = JSON.stringify(c, null, 1) + "\n", sw = readFileSync(swPath, "utf8").replace(/^const VERSION = ".*";$/m, `const VERSION = "${c.version}";`);
  if (process.argv.includes("--check")) {
    let cur = ""; try { cur = readFileSync(jsonPath, "utf8"); } catch { /* absent */ }
    // (la liste et sw.js eux-mêmes sont comparés sans tenir compte des fins de ligne)
    const lf = (t) => t.replace(/\r\n/g, "\n");
    let curV = ""; try { curV = readFileSync(versionPath, "utf8"); } catch { /* absent */ }
    if (lf(cur) !== json || lf(readFileSync(swPath, "utf8")) !== lf(sw) || lf(curV) !== version) { console.error("precache : app/sw-files.json ou app/sw.js n'est pas à jour. Lancer : node tools/precache.mjs"); process.exit(1); }
    console.log(`precache à jour (${c.files.length} fichiers, version ${c.version})`);
  } else { writeFileSync(jsonPath, json); writeFileSync(swPath, sw); writeFileSync(versionPath, version); console.log(`precache : ${c.files.length} fichiers, version ${c.version}`); }
}
