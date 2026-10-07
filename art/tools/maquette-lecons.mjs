// MAQUETTE DU LOT « LES LEÇONS » : empaquette les dessins nouveaux du lot (src/hosts/maquette-lecons.ts) en
// art/lecons/dessins.js, module ES que la page de maquette (art/lecons/index.html) importe. Rien sous app/ n'est touché.
//   node tools/maquette-lecons.mjs
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("lecons/dessins.js");
const banner = "// FICHIER GÉNÉRÉ par art/tools/maquette-lecons.mjs depuis art/src/hosts/maquette-lecons.ts : ne pas modifier à la main.\n";
await build({ entryPoints: ["src/hosts/maquette-lecons.ts"], bundle: true, format: "esm", target: "es2020", minify: true, outfile: OUT, banner: { js: banner }, legalComments: "none" });
console.log(`dessins -> ${OUT} (${(readFileSync(OUT).length / 1024).toFixed(1)} Ko)`);
