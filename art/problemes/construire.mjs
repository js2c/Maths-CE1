// Empaquette les dessins de la maquette « Problèmes » (art/src/hosts/problemes-maquette.ts) en art/problemes/dessins.js,
// que la page art/problemes/index.html importe. À relancer après toute modification de art/src/canvas-core/sea/problemes.ts.
//   cd art && node problemes/construire.mjs
import { build } from "esbuild";
await build({ entryPoints: ["src/hosts/problemes-maquette.ts"], bundle: true, format: "esm", target: "es2020", minify: true, outfile: "problemes/dessins.js", banner: { js: "// FICHIER GÉNÉRÉ par art/problemes/construire.mjs depuis art/src/hosts/problemes-maquette.ts : ne pas modifier à la main." }, legalComments: "none" });
console.log("problemes/dessins.js");
