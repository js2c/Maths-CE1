// EXPORT VERS L'APPLICATION. Fabrique tout ce que `app/` affiche de dessiné :
//   app/assets/art/<planche>@<1|2>x[-p].webp   les planches de sprites (WebP sans perte)
//   app/assets/art/atlas.json                  où est chaque image, son décalage par rapport à l'ancrage, sa cadence
//   app/js/art/runtime.js                      le dessin en direct (ligne graduée, chiffres), module ES généré
// puis vérifie : (1) reproductibilité : chaque planche est rendue une seconde fois dans une page neuve
// et les empreintes de toutes les images doivent être identiques ; (2) raccord des boucles et
// continuité des gestes de la pieuvre (voir `seams` dans src/hosts/export-app.ts).
//
//   node tools/export-app.mjs                 tout
//   node tools/export-app.mjs --only pieuvre  seulement les planches dont le nom contient « pieuvre »
//   node tools/export-app.mjs --no-check      sans le second rendu de contrôle
//   node tools/export-app.mjs --runtime       seulement app/js/art/runtime.js
// Le fond de l'application, le lagon, n'est pas dessiné ici : il est extrait de la maquette du récif vivant par
// tools/export-lagon.mjs, appelé à la fin (planches « lagon » et « lagon-vie »).
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { detect } from "./detect.mjs";
import { exportLagon } from "./export-lagon.mjs";

const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const only = opt("--only"), check = !args.includes("--no-check");
const ROOT = resolve(".."), OUT = join(ROOT, "app/assets/art"), RUNTIME = join(ROOT, "app/js/art/runtime.js");
const die = (m) => { console.error(`export-app: ${m}`); process.exit(1); };

// 1. le dessin en direct, empaqueté en module ES pour l'application (pas d'étape de build côté app :
//    ce fichier est un produit de l'atelier, comme les images, et il est versionné)
const banner = "// FICHIER GÉNÉRÉ par art/tools/export-app.mjs depuis art/src/canvas-core/sea/runtime.ts : ne pas modifier à la main.\n";
await build({ entryPoints: ["src/canvas-core/sea/runtime.ts"], bundle: true, format: "esm", target: "es2020", minify: true, outfile: RUNTIME, banner: { js: banner }, legalComments: "none" });
console.log(`runtime  -> ${RUNTIME} (${(readFileSync(RUNTIME).length / 1024).toFixed(1)} Ko)`);
if (args.includes("--runtime")) process.exit(0); // seulement le dessin en direct

// 2. la page d'export
const js = (await build({ entryPoints: ["src/hosts/export-app.ts"], bundle: true, format: "iife", target: "es2020", minify: true, write: false })).outputFiles[0].text;
const page = resolve("dist/export-app.html");
mkdirSync(dirname(page), { recursive: true });
writeFileSync(page, `<!doctype html><meta charset="utf-8"><title>export</title><script>${js.replace(/<\/script/g, "<\\/script")}</script>`);

const env = detect();
if (!env.pw.ok || !env.browser.ok) die(`pas de navigateur : ${env.report.playwright} / ${env.report.browser}`);
const browser = await env.pw.lib.chromium.launch({ executablePath: env.browser.executablePath, args: ["--disable-gpu"] });
const open = async () => { const p = await (await browser.newContext()).newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message)); await p.goto(pathToFileURL(page).href); if (errs.length) die(errs.join("\n")); return p; };

let pg = await open();
const specs = await pg.evaluate(() => window.EXPORT.specs());
const sheets = [...new Set(specs.map((s) => s.sheet))].filter((s) => !only || s.includes(only));
mkdirSync(OUT, { recursive: true });
const atlasPath = join(OUT, "atlas.json");
const atlas = existsSync(atlasPath) && only ? JSON.parse(readFileSync(atlasPath, "utf8")) : { version: 1, generated: "art/tools/export-app.mjs", sheets: {}, sprites: {} };
if (sheets.some((s) => s.startsWith("pieuvre"))) atlas.octo = await pg.evaluate(() => window.EXPORT.octo());
if (!only) for (const f of readdirSync(OUT)) if (f.endsWith(".webp") && !f.startsWith("lagon") && !sheets.some((s) => f.startsWith(`${s}@`))) unlinkSync(join(OUT, f)); // planches qui n'existent plus (le lagon : plus bas)
let bad = 0;
const report = [];
for (const sheet of sheets) {
  const scales = [...new Set(specs.filter((s) => s.sheet === sheet).flatMap((s) => s.scales))];
  for (const scale of scales) {
    const r = await pg.evaluate(([s, k]) => window.EXPORT.sheet(s, k, true, 1), [sheet, scale]);
    // les anciennes pages de cette planche disparaissent (une planche peut avoir changé de nombre de pages)
    for (const f of readdirSync(OUT)) if (f.startsWith(`${sheet}@${scale}x`)) unlinkSync(join(OUT, f));
    const names = r.files.map((b64, p) => { const n = r.files.length > 1 ? `${sheet}@${scale}x-${p}.webp` : `${sheet}@${scale}x.webp`; writeFileSync(join(OUT, n), Buffer.from(b64, "base64")); return n; });
    atlas.sheets[`${sheet}@${scale}`] = names.map((n, p) => ({ file: n, w: r.sizes[p][0], h: r.sizes[p][1] }));
    for (const [name, frames] of Object.entries(r.frames)) {
      const s = specs.find((x) => x.name === name);
      atlas.sprites[name] ??= { sheet, fps: s.fps, frames: s.frames, meta: s.meta, rects: {} };
      Object.assign(atlas.sprites[name], { sheet, fps: s.fps, frames: s.frames, meta: s.meta });
      atlas.sprites[name].rects[scale] = frames; // [page, x, y, w, h, dx, dy] ; dx, dy : coin haut-gauche moins l'ancrage, en px de la planche
      // lot 3 : pixels visibles sur les bords du calque [haut, droite, bas, gauche], le plus grand nombre sur toutes les images
      (atlas.sprites[name].bords ??= {})[scale] = r.edges[name];
    }
    let same = "non vérifié";
    if (check) {
      const p2 = await open();
      const r2 = await p2.evaluate(([s, k]) => window.EXPORT.sheet(s, k, false), [sheet, scale]);
      await p2.context().close();
      const diffs = Object.keys(r.hashes).filter((n) => r.hashes[n].join() !== r2.hashes[n].join());
      same = diffs.length ? `NON REPRODUCTIBLE (${diffs.join(", ")})` : "reproductible";
      if (diffs.length) bad++;
    }
    const bytes = names.reduce((a, n) => a + readFileSync(join(OUT, n)).length, 0), mem = r.sizes.reduce((a, [w, h]) => a + w * h * 4, 0);
    report.push({ planche: `${sheet}@${scale}x`, pages: names.length, taille: `${r.sizes.map((s) => s.join("×")).join(" + ")}`, fichier: `${(bytes / 1024).toFixed(0)} Ko`, memoire: `${(mem / 1048576).toFixed(1)} Mo`, dessin: `${(r.drawMs / 1000).toFixed(1)} s`, controle: same });
    console.log(`${`${sheet}@${scale}x`.padEnd(26)} ${names.length} page(s) ${report.at(-1).taille.padEnd(20)} ${report.at(-1).fichier.padStart(8)}  décodé ${report.at(-1).memoire.padStart(8)}  ${same}`);
  }
}
// le lagon (tools/export-lagon.mjs) : avec l'export complet, ou avec --only lagon ; sinon ses entrées restent dans l'atlas
if (!only || only.includes("lagon")) bad += await exportLagon({ browser, atlas, OUT, check });
atlas.hash = createHash("md5").update(JSON.stringify(atlas.sprites)).digest("hex").slice(0, 10);
writeFileSync(atlasPath, JSON.stringify(atlas));
console.log(`atlas    -> ${atlasPath} (${Object.keys(atlas.sprites).length} sprites, empreinte ${atlas.hash})`);

if (check && (!only || ["pieuvre", "poisson", "tortue"].some((k) => only.includes(k)))) {
  const seams = await pg.evaluate(() => window.EXPORT.seams());
  console.log("raccords (écart moyen 0..255 ; un raccord doit rester sous l'écart maximal entre deux images voisines) :");
  for (const [n, v] of Object.entries(seams)) {
    const ok = v.seam !== undefined ? v.seam <= v.stepMax * 1.05 : v.diff <= 6;
    if (!ok) bad++;
    console.log(`  ${n.padEnd(34)} ${JSON.stringify(v)}  ${ok ? "ok" : "SAUT VISIBLE"}`);
  }
}
mkdirSync("out", { recursive: true }); writeFileSync("out/rapport-export.json", JSON.stringify(report, null, 1));
await browser.close();
if (bad) die(`${bad} contrôle(s) en échec`);
