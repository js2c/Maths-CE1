// LES IMAGES D'ESSAI DES OBJETS DE L'HISTOIRE (lot « Mise en scène des problèmes ») : les dessins provisoires de la maquette
// (art/problemes/mise-en-scene/provisoires.js), rendus sur fond transparent à la taille de chaque objet dans la scène
// (objets.json, `h`), en @1x et @2x, avec leur index.json. Elles ne sont JAMAIS dans l'application : le parcours tests/e2e/problemes.mjs
// les sert à la place de app/assets/problemes/objets/ (et de la liste des objets d'index.json), pour éprouver la scène avec des
// objets tant que le parent n'a pas déposé les siens.
//   node tests/e2e/fixtures/fabriquer-objets.mjs
import { chromium } from "../../../art/node_modules/playwright-core/index.mjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = resolve(fileURLToPath(new URL("../../..", import.meta.url))), OUT = join(RACINE, "tests/e2e/fixtures/problemes-objets");
const LIB = JSON.parse(readFileSync(join(RACINE, "art/problemes/mise-en-scene/objets.json"), "utf8")).objets, H = (id) => LIB.find((o) => o.id === id).h;
// chaque image : son nom, sa hauteur, le dessin (V : provisoires.js ; cx, pied : le centre et le sol d'un canvas de 600 × 600 à 2×)
const DESSINS = {
  papa: "V.personnage(c, 300, 560, 500, V.PERSONNAGES.papa)", maitresse: "V.personnage(c, 300, 560, 500, V.PERSONNAGES.maitresse)",
  pecheur: "V.personnage(c, 300, 560, 500, V.PERSONNAGES.pecheur)", voisine: "V.personnage(c, 300, 560, 400, V.PERSONNAGES.voisine)",
  copain: "V.personnage(c, 300, 560, 400, V.PERSONNAGES.copain)", chien: "V.retourne(c, 300, () => V.chien(c, 300, 560, 320))",
  "sachet-ferme": "V.sachet(c, 300, 560, 250)", "sachet-ouvert": "V.sachetVide(c, 300, 560, 220)", gamelle: "V.gamelle(c, 300, 560, 380)",
  "seau-plage": "V.seau(c, 300, 560, 300)", "trousse-bleue": "V.trousse(c, 300, 560, 380)", "trousse-jaune": "V.trousse(c, 300, 560, 380, [\"#ffcf3a\", \"#d9a11a\"])",
  pot: "V.pot(c, 300, 560, 220)", "boite-fermee": "V.paquet(c, 300, 560, 190)", "boite-ouverte": "V.paquet(c, 300, 560, 190, { ouvert: true })",
  assiette: "V.assiette(c, 300, 540, 340)", "table-cuisine": "V.tableCuisine(c, 40, 560, 420, 560)",
};
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
await page.setContent("<html><body></body></html>");
await page.addScriptTag({ type: "module", content: `${readFileSync(join(RACINE, "art/problemes/mise-en-scene/provisoires.js"), "utf8").replace(/^export /gm, "")}\nwindow.V = { personnage, PERSONNAGES, retourne, chien, sachet, sachetVide, gamelle, seau, trousse, pot, paquet, assiette, tableCuisine };` });
await page.waitForFunction(() => window.V);
mkdirSync(join(OUT, "objets"), { recursive: true });
const index = {};
for (const [nom, code] of Object.entries(DESSINS)) {
  const h = H(nom.replace(/-(ferme|ouvert|plage|bleue|jaune|fermee|ouverte|cuisine)$/, ""));
  const out = await page.evaluate(async ([code, h]) => {
    const c0 = document.createElement("canvas"); c0.width = 600; c0.height = 600; const c = c0.getContext("2d"), V = window.V;
    // (l'ombre au sol des dessins provisoires est retirée : l'application pose la sienne)
    const ombre = V.ombreSol; eval(code);
    const d = c.getImageData(0, 0, 600, 600).data; let x0 = 600, y0 = 600, x1 = 0, y1 = 0;
    for (let y = 0; y < 600; y++) for (let x = 0; x < 600; x++) if (d[4 * (y * 600 + x) + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1, res = {};
    for (const k of [1, 2]) { const hh = h * k, ww = Math.round((cw * hh) / ch), o = document.createElement("canvas"); o.width = ww; o.height = hh; o.getContext("2d").drawImage(c0, x0, y0, cw, ch, 0, 0, ww, hh); res[k] = { url: o.toDataURL("image/webp", 0.9), w: ww, h: hh }; }
    return res;
  }, [code, h]);
  for (const k of [1, 2]) writeFileSync(join(OUT, "objets", `${nom}@${k}x.webp`), Buffer.from(out[k].url.split(",")[1], "base64"));
  index[nom] = { w: out[1].w, h: out[1].h, c: LIB.find((o) => o.id === nom.replace(/-(ferme|ouvert|plage|bleue|jaune|fermee|ouverte|cuisine)$/, "")).categorie };
}
await browser.close();
writeFileSync(join(OUT, "objets.json"), `${JSON.stringify({ _doc: "Images d'essai (dessins provisoires) : tests/e2e/fixtures/fabriquer-objets.mjs. Jamais dans l'application.", objets: index }, null, 1)}\n`);
console.log(`${Object.keys(index).length} images d'essai dans tests/e2e/fixtures/problemes-objets/`);
