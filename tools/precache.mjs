// LISTE DES FICHIERS DE L'APPLICATION POUR LE MODE HORS LIGNE.
// Écrit app/sw-files.json (tous les fichiers de app/, sauf le service worker et cette liste) et la
// version (empreinte de tout le contenu) dans la ligne VERSION de app/sw.js.
//   node tools/precache.mjs          met à jour
//   node tools/precache.mjs --check  échoue si la liste n'est pas à jour (tests, déploiement)
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const APP = fileURLToPath(new URL("../app/", import.meta.url)), SKIP = new Set(["sw.js", "sw-files.json"]);
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
export const compute = () => {
  const files = walk(APP).map((p) => relative(APP, p).split(sep).join("/")).filter((f) => !SKIP.has(f) && !f.startsWith(".")).sort();
  const h = createHash("sha256"); for (const f of files) h.update(f).update(readFileSync(join(APP, f)));
  const version = h.digest("hex").slice(0, 12);
  return { version, files: ["./", ...files] };
};
if (import.meta.url === `file://${process.argv[1]}`) {
  const c = compute(), jsonPath = join(APP, "sw-files.json"), swPath = join(APP, "sw.js");
  const json = JSON.stringify(c, null, 1) + "\n", sw = readFileSync(swPath, "utf8").replace(/^const VERSION = ".*";$/m, `const VERSION = "${c.version}";`);
  if (process.argv.includes("--check")) {
    let cur = ""; try { cur = readFileSync(jsonPath, "utf8"); } catch { /* absent */ }
    if (cur !== json || readFileSync(swPath, "utf8") !== sw) { console.error("precache : app/sw-files.json ou app/sw.js n'est pas à jour. Lancer : node tools/precache.mjs"); process.exit(1); }
    console.log(`precache à jour (${c.files.length} fichiers, version ${c.version})`);
  } else { writeFileSync(jsonPath, json); writeFileSync(swPath, sw); console.log(`precache : ${c.files.length} fichiers, version ${c.version}`); }
}
