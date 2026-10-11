// LE LOGO, LE BOUTON DE L'ESPACE PARENT ET LES ICÔNES DANS L'APPLICATION (lot « Correctifs : passage de l'échauffement aux
// voiliers », points 9, 13 et 14 ; décisions du parent du 10 octobre 2026). Trois exceptions à « tout est dessiné dans
// l'atelier » (CLAUDE.md) : des images découpées dans celles du parent, par les outils des maquettes, déterministes :
//   - art/logo/decoupe.py   -> art/logo/images/   le texte « Maths CE1 », l'étoile, l'ombre et leurs places (position.json) ;
//   - art/logo/icone.py     -> art/logo/icone/    les icônes de l'application (any 192 et 512, maskable 512, 180 pour l'iPhone) ;
//   - art/boutons/decoupe.py -> art/boutons/images/ le bouton de l'espace parent et sa taille (parents-forme.json).
// Cet outil les copie dans l'application, sans jamais modifier les maquettes : app/assets/logo/, app/assets/boutons/,
// app/icons/. On ne les copie jamais à la main. Les anciennes icônes (la pieuvre, icon-192.png et icon-512.png) sont retirées.
// Contrôles : chaque copie est identique à sa source (empreinte) ; une seconde exécution ne change rien.
//
//   cd art && node tools/export-logo.mjs            (appelé aussi par tools/export-app.mjs)
//   cd art && node tools/export-logo.mjs --verifier  (seulement vérifier que l'application est à jour)
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const HERE = resolve(new URL(".", import.meta.url).pathname, ".."), APP = resolve(HERE, "../app");
// [source (dans art/), destination (dans app/)]
export const COPIES = [
  ...["texte@1x.webp", "texte@2x.webp", "etoile@1x.webp", "etoile@2x.webp", "ombre.webp", "position.json"].map((f) => [`logo/images/${f}`, `assets/logo/${f}`]),
  ...["parents@1x.webp", "parents@2x.webp", "parents-forme.json"].map((f) => [`boutons/images/${f}`, `assets/boutons/${f}`]),
  ...["icone-192.png", "icone-512.png", "icone-maskable-512.png", "icone-180.png"].map((f) => [`logo/icone/${f}`, `icons/${f}`]),
];
// ce qui ne sert plus (l'icône de la pieuvre)
export const RETIRES = ["icons/icon-192.png", "icons/icon-512.png"];
const empreinte = (b) => createHash("sha256").update(b).digest("hex").slice(0, 12);

export function exportLogo({ log = console.log, ecrire = true } = {}) {
  const ecarts = [];
  for (const [src, dst] of COPIES) {
    const a = join(HERE, src), b = join(APP, dst);
    if (!existsSync(a)) throw new Error(`export-logo : ${src} introuvable (relancer l'outil de la maquette)`);
    const buf = readFileSync(a);
    if (!existsSync(b) || empreinte(readFileSync(b)) !== empreinte(buf)) {
      ecarts.push(dst);
      if (ecrire) { mkdirSync(resolve(b, ".."), { recursive: true }); writeFileSync(b, buf); }
    }
  }
  for (const f of RETIRES) if (existsSync(join(APP, f))) { ecarts.push(`(retiré) ${f}`); if (ecrire) unlinkSync(join(APP, f)); }
  // rien d'autre dans les dossiers de l'outil
  for (const dir of ["assets/logo", "assets/boutons", "icons"]) {
    if (!existsSync(join(APP, dir))) continue;
    for (const f of readdirSync(join(APP, dir))) if (!COPIES.some(([, d]) => d === `${dir}/${f}`)) { ecarts.push(`(en trop) ${dir}/${f}`); if (ecrire) unlinkSync(join(APP, dir, f)); }
  }
  if (ecrire) {
    // contrôle : chaque copie est identique à sa source
    for (const [src, dst] of COPIES) if (empreinte(readFileSync(join(HERE, src))) !== empreinte(readFileSync(join(APP, dst)))) throw new Error(`export-logo : ${dst} diffère de ${src}`);
  }
  log(`logo, bouton, icônes : ${COPIES.length} fichiers ; ${ecarts.length ? `mis à jour : ${ecarts.join(", ")}` : "déjà à jour"}`);
  return { ecarts };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--verifier")) {
    const { ecarts } = exportLogo({ ecrire: false, log: () => {} });
    if (ecarts.length) { console.error(`export-logo : l'application n'est pas à jour (${ecarts.join(", ")}) ; lancer : cd art && node tools/export-logo.mjs`); process.exit(1); }
    console.log("export-logo : à jour");
  } else {
    exportLogo();
    const { ecarts } = exportLogo({ ecrire: false, log: () => {} });
    if (ecarts.length) { console.error(`export-logo : une seconde exécution changerait encore ${ecarts.join(", ")}`); process.exit(1); }
    console.log("seconde exécution : rien à changer");
  }
}
