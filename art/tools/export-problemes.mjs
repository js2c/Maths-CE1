// LES ILLUSTRATIONS DES PROBLÈMES (lot « Problèmes », docs/LOTS.md, fiche 20 ; décision du parent du 30 octobre 2026 : une
// image par lieu, 22 lieux, art/problemes/contextes.json, générées par le parent avec le prompt de chaque lieu). Lit
// art/problemes/sources/<lieu>.png (ou .jpg, .jpeg, .webp ; 1920 × 1080 conseillé) et, pour l'étal, l'image de l'étal du pêcheur
// (art/etal/sources/etal-beau-temps.jpg) ; recadre chaque image au format de l'intérieur du cadre de l'exercice (« cover » centré,
// rien de déformé) et la réduit en WebP @1x et @2x dans app/assets/problemes/ ; écrit app/assets/problemes/index.json, la liste
// des lieux qui ont leur image (un lieu absent : l'exercice pose une image de remplacement neutre, le papier du cadre, sans
// texte). L'application ne lit que ce dossier ; la liste du service worker est refaite par tools/precache.mjs.
// Déterministe : une même source donne les mêmes fichiers. Rien d'autre n'est touché (les sources ne sont jamais modifiées).
//   node art/tools/export-problemes.mjs           (depuis la racine du dépôt ou depuis art/)
//   puis : node tools/precache.mjs
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { detect } from "./detect.mjs";

const ICI = dirname(fileURLToPath(import.meta.url)), ART = resolve(ICI, ".."), ROOT = resolve(ART, "..");
const OUT = join(ROOT, "app/assets/problemes"), SRC = join(ART, "problemes/sources");
// l'intérieur du cadre de l'illustration (modules/problemes/screen.js, CADRE : 620 × 350, bord de 12 px)
export const INTERIEUR = { w: 596, h: 326 }, QUALITE = 0.86;
const contextes = JSON.parse(readFileSync(join(ART, "problemes/contextes.json"), "utf8")).contextes;
const source = (id) => {
  if (id === "etal") return join(ART, "etal/sources/etal-beau-temps.jpg");
  for (const ext of ["png", "jpg", "jpeg", "webp"]) { const f = join(SRC, `${id}.${ext}`); if (existsSync(f)) return f; }
  return null;
};

export async function exportProblemes() {
  mkdirSync(OUT, { recursive: true });
  const env = detect();
  if (!env.pw.ok || !env.browser.ok) throw new Error(`export-problemes : pas de navigateur (${env.report.playwright} / ${env.report.browser})`);
  const browser = await env.pw.lib.chromium.launch({ executablePath: env.browser.executablePath, args: ["--disable-gpu"] });
  const page = await (await browser.newContext()).newPage();
  await page.goto("about:blank");
  const faits = [], manquent = [];
  for (const c of contextes) {
    const f = source(c.id);
    if (!f) { manquent.push(c.id); continue; }
    const b64 = readFileSync(f).toString("base64"), mime = f.endsWith(".png") ? "image/png" : f.endsWith(".webp") ? "image/webp" : "image/jpeg";
    const out = await page.evaluate(async ([data, W, H, q]) => {
      const img = new Image(); img.src = data; await img.decode();
      const res = {};
      for (const k of [1, 2]) {
        const w = W * k, h = H * k, c = new OffscreenCanvas(w, h), x = c.getContext("2d"), s = Math.max(w / img.width, h / img.height);
        x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
        x.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s);
        const blob = await c.convertToBlob({ type: "image/webp", quality: q }), u8 = new Uint8Array(await blob.arrayBuffer()); let str = "";
        for (let i = 0; i < u8.length; i += 0x8000) str += String.fromCharCode(...u8.subarray(i, i + 0x8000));
        res[k] = btoa(str);
      }
      return res;
    }, [`data:${mime};base64,${b64}`, INTERIEUR.w, INTERIEUR.h, QUALITE]);
    for (const k of [1, 2]) writeFileSync(join(OUT, `${c.id}@${k}x.webp`), Buffer.from(out[k], "base64"));
    faits.push(c.id);
  }
  await browser.close();
  // les images d'un lieu qui n'a plus de source disparaissent
  for (const f of readdirSync(OUT)) if (f.endsWith(".webp") && !faits.includes(f.replace(/@\dx\.webp$/, ""))) unlinkSync(join(OUT, f));
  writeFileSync(join(OUT, "index.json"), `${JSON.stringify({ _doc: "Généré par art/tools/export-problemes.mjs : les lieux des problèmes qui ont leur illustration (app/assets/problemes/<lieu>@1x.webp et @2x.webp). Les autres lieux ont l'image de remplacement neutre.", lieux: faits, manquent }, null, 1)}\n`);
  console.log(`problèmes : ${faits.length} illustrations (${faits.join(", ")}) ; sans image : ${manquent.length}${manquent.length ? ` (${manquent.join(", ")})` : ""}`);
  return { faits, manquent };
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await exportProblemes();
