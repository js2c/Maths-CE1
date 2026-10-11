// FABRIQUE art/boutique/index.html, la maquette autonome de la boutique (un seul fichier, à ouvrir sur la tablette) :
//  - la source : art/boutique/source.html ;
//  - les images : art/boutique/img/ (faites par outils/preparer.py, à partir des fichiers de l'application), embarquées en data: ;
//  - la police Shantell Sans : app/assets/polices/ ;
//  - la bulle de la mascotte : app/js/engine/bulle.js, repris tel quel (les mots « export » retirés) ;
//  - les créatures et les zones : app/content/cartes.json (id, nom, nom lu, zone, rareté ; phrases des zones).
// Aucun fichier de app/ n'est modifié.
//   node art/boutique/outils/fabriquer.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = join(dirname(fileURLToPath(import.meta.url)), ".."), RACINE = join(ICI, "..", ".."), APP = join(RACINE, "app");
const lire = (p) => readFileSync(p, "utf8");

// les images (et la police), par leur chemin dans la source
const TYPES = { webp: "image/webp", png: "image/png", woff2: "font/woff2" };
const images = {};
const parcourir = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) parcourir(p); else { const ext = f.split(".").pop(); if (TYPES[ext]) images[relative(ICI, p).split("\\").join("/")] = `data:${TYPES[ext]};base64,${readFileSync(p).toString("base64")}`; } } };
parcourir(join(ICI, "img"));
if (!Object.keys(images).length) throw new Error("pas d'images : lancer d'abord python3 art/boutique/outils/preparer.py");
images["img/shantell-sans-600.woff2"] = `data:font/woff2;base64,${readFileSync(join(APP, "assets/polices/shantell-sans-600.woff2")).toString("base64")}`;

// les données : les 60 créatures, les zones, la phrase des légendaires
const C = JSON.parse(lire(join(APP, "content/cartes.json")));
const donnees = {
  cartes: C.cartes.map(({ id, nomLu, nom, zone, rarete }) => ({ id, nomLu, nom, zone, rarete })),
  zones: C.zones.map(({ id, nom, ouvertureLu, fermeeLu }) => ({ id, nom, ouvertureLu: ouvertureLu ?? "", fermeeLu: fermeeLu ?? "" })),
  legendaireLu: C.legendaireLu,
};
for (const c of donnees.cartes) if (!images[`img/creatures/${c.id}.webp`]) throw new Error(`image manquante : ${c.id}`);

// la bulle de l'application, sans ses « export »
const bulle = lire(join(APP, "js/engine/bulle.js")).replace(/^export /gm, "");
if (/^import /m.test(bulle)) throw new Error("bulle.js importe un module : à embarquer aussi");

let html = lire(join(ICI, "source.html"));
const remplacer = (marque, valeur) => { if (!html.includes(marque)) throw new Error(`marque absente : ${marque}`); html = html.replace(marque, () => valeur); };
remplacer("/*DONNEES*/null", JSON.stringify(donnees));
remplacer("/*IMAGES*/{}", JSON.stringify(images));
remplacer("/*BULLE*/", bulle);
html = html.replace("<!--\n  MAQUETTE", "<!--\n  FICHIER FABRIQUÉ par art/boutique/outils/fabriquer.mjs à partir de source.html : ne pas le modifier à la main.\n  MAQUETTE");
writeFileSync(join(ICI, "index.html"), html);
console.log(`art/boutique/index.html : ${(html.length / 1e6).toFixed(2)} Mo, ${Object.keys(images).length} images`);
