// LES IMAGES DES PROBLÈMES (lot « Problèmes », fiche 20 ; lot « Mise en scène des problèmes », fiche 23 ; décisions du parent du
// 30 octobre et du 6 novembre 2026). Une seule commande pour tout ce que le parent a déposé, que l'application lit dans
// app/assets/problemes/ (et sa liste, index.json) :
//  - LES LIEUX : art/problemes/sources/<lieu>.png|jpg|jpeg|webp (générés en 16:9, le cinquième du haut sans détail ;
//    art/problemes/contextes.json), et l'étal (l'image de l'étal du pêcheur, art/etal/sources/etal-beau-temps.jpg). Chacun est
//    recadré à la forme de l'image de la scène (IMAGE : 860 × 350), la largeur entière, COLLÉ EN BAS : le haut est retiré, jamais
//    le sol (un lieu peut donner le haut de son recadrage, `recadrage.haut`, en fraction de sa hauteur : l'étal, autour de sa
//    glace) ; une source plus large que la scène perd ses deux côtés, également. Réduit en WebP @1x (860 × 350) et @2x (au plus
//    1720 × 700, jamais agrandi au-delà de la source).
//  - LES OBJETS DE L'HISTOIRE : art/problemes/mise-en-scene/sources/<objet>.png|jpg ou <objet>-<variante>.png|jpg (Nano Banana,
//    fond vert franc, ou magenta pour un objet qui a du vert : `fond` dans art/problemes/mise-en-scene/objets.json). Le fond est
//    retiré (comme les produits de l'étal, art/etal/outils/5-produits.py : la transparence suit l'écart à la couleur du fond, le
//    reflet coloré des bords est ramené, les petites taches isolées sont effacées), l'objet cadré au plus juste et réduit à sa
//    hauteur dans la scène (`h`) en @1x, au double en @2x : app/assets/problemes/objets/<objet>[-<variante>]@1x|2x.webp.
// index.json dit ce qui a son image (les lieux, les objets et leur taille à @1x) : un lieu sans image a le papier du cadre, un objet
// sans image son étiquette seule. Déterministe : une même source donne les mêmes fichiers ; les sources ne sont jamais modifiées.
//   node art/tools/export-problemes.mjs           (depuis la racine du dépôt ou depuis art/)
//   puis : node tools/precache.mjs
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { detect } from "./detect.mjs";

const ICI = dirname(fileURLToPath(import.meta.url)), ART = resolve(ICI, ".."), ROOT = resolve(ART, "..");
const OUT = join(ROOT, "app/assets/problemes"), OUT_OBJ = join(OUT, "objets"), SRC = join(ART, "problemes/sources"), SRC_OBJ = join(ART, "problemes/mise-en-scene/sources");
// l'image du lieu dans la scène (modules/problemes/screen.js : le cadre de 884 × 374, bord de 12 px)
export const IMAGE = { w: 860, h: 350 }, QUALITE = 0.86, QUALITE_OBJET = 0.9;
const EXT = ["png", "jpg", "jpeg", "webp"];
const MIME = (f) => (f.endsWith(".png") ? "image/png" : f.endsWith(".webp") ? "image/webp" : "image/jpeg");

// LE RECADRAGE D'UN LIEU (fonction pure, testée : tests/unit/export-problemes.test.mjs) : la zone de la source à garder, à la forme
// de la scène ; collée en bas sauf `haut` (fraction de la hauteur de la source où commence la zone)
export function recadrage(W, H, { haut = null } = {}) {
  const r = IMAGE.w / IMAGE.h;
  if (W / H < r) { const h = Math.round(W / r), y = haut == null ? H - h : Math.min(H - h, Math.max(0, Math.round(haut * H))); return { x: 0, y, w: W, h }; }
  const w = Math.round(H * r); return { x: Math.round((W - w) / 2), y: 0, w, h: H };
}
// le nom d'un fichier d'objet : son objet et sa variante, d'après la bibliothèque (le plus long identifiant qui convient)
export function nomObjet(base, objets) {
  const ids = objets.map((o) => o.id).sort((a, b) => b.length - a.length);
  for (const id of ids) {
    if (base === id) return { id, variante: null };
    if (base.startsWith(`${id}-`)) { const v = base.slice(id.length + 1), o = objets.find((x) => x.id === id); if ((o.variantes ?? []).includes(v)) return { id, variante: v }; }
  }
  return null;
}
const sourceLieu = (id) => {
  if (id === "etal") return join(ART, "etal/sources/etal-beau-temps.jpg");
  for (const ext of EXT) { const f = join(SRC, `${id}.${ext}`); if (existsSync(f)) return f; }
  return null;
};

// (dans le navigateur) LE DÉTOURAGE : la transparence selon l'écart à la couleur du fond ; le reflet des bords ramené ; les taches
// de moins de `taches` pixels effacées ; le cadrage au plus juste (alpha > 10)
const DETOURER = async ([data, fond, hauteur, q, taches]) => {
  const img = new Image(); img.src = data; await img.decode();
  const W = img.width, H = img.height, c = new OffscreenCanvas(W, H), x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, W, H), p = d.data, a = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = p[4 * i], g = p[4 * i + 1], b = p[4 * i + 2];
    const ecart = fond === "magenta" ? Math.min(r, b) - g : g - Math.max(r, b);
    let t = 1 - Math.min(1, Math.max(0, (ecart - 40) / 70)); t = t * t * (3 - 2 * t); a[i] = t;
    // le reflet du fond sur les bords : l'excès de la couleur du fond ramené, d'autant plus que le pixel est transparent
    const f = 1 - (1 - t) ** 0.5;
    if (fond === "magenta") { const e = Math.min(r, b) - g; if (e > 0) { p[4 * i] = r - e * (1 - f); p[4 * i + 2] = b - e * (1 - f); } }
    else { const m = Math.max(r, b); if (g > m) p[4 * i + 1] = m + (g - m) * f; }
  }
  // les taches isolées (composantes connexes de moins de `taches` pixels) : effacées
  const vu = new Uint8Array(W * H), pile = new Int32Array(W * H);
  for (let s = 0; s < W * H; s++) {
    if (vu[s] || a[s] <= 0.16) continue;
    let n = 0, top = 0; pile[top++] = s; vu[s] = 1; const membres = [];
    while (top) { const k = pile[--top]; membres.push(k); n++; const kx = k % W, ky = (k / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = kx + dx, ny = ky + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const j = ny * W + nx; if (!vu[j] && a[j] > 0.16) { vu[j] = 1; pile[top++] = j; } } }
    if (n < taches) for (const k of membres) a[k] = 0;
  }
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let i = 0; i < W * H; i++) { p[4 * i + 3] = Math.round(a[i] * 255); if (p[4 * i + 3] > 10) { const ix = i % W, iy = (i / W) | 0; if (ix < x0) x0 = ix; if (ix > x1) x1 = ix; if (iy < y0) y0 = iy; if (iy > y1) y1 = iy; } }
  if (x1 < 0) return { vide: true };
  x.putImageData(d, 0, 0);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, res = {};
  for (const k of [1, 2]) {
    const h = Math.round(hauteur * k), w = Math.max(1, Math.round((cw * h) / ch)), o = new OffscreenCanvas(w, h), ox = o.getContext("2d");
    ox.imageSmoothingEnabled = true; ox.imageSmoothingQuality = "high"; ox.drawImage(c, x0, y0, cw, ch, 0, 0, w, h);
    const blob = await o.convertToBlob({ type: "image/webp", quality: q }), u8 = new Uint8Array(await blob.arrayBuffer()); let s = "";
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    res[k] = { b64: btoa(s), w, h };
  }
  return { res, source: [W, H], cadre: [x0, y0, cw, ch] };
};
// (dans le navigateur) un lieu : la zone gardée, réduite en @1x et @2x
const LIEU = async ([data, Z, W1, H1, q]) => {
  const img = new Image(); img.src = data; await img.decode();
  const res = {};
  for (const k of [1, 2]) {
    const w = Math.min(W1 * k, Math.max(W1, Z.w)), h = Math.round((w * H1) / W1), c = new OffscreenCanvas(w, h), x = c.getContext("2d");
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high"; x.drawImage(img, Z.x, Z.y, Z.w, Z.h, 0, 0, w, h);
    const blob = await c.convertToBlob({ type: "image/webp", quality: q }), u8 = new Uint8Array(await blob.arrayBuffer()); let s = "";
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    res[k] = { b64: btoa(s), w, h };
  }
  return { res, source: [img.width, img.height] };
};

export async function exportProblemes() {
  mkdirSync(OUT_OBJ, { recursive: true });
  const contextes = JSON.parse(readFileSync(join(ART, "problemes/contextes.json"), "utf8")).contextes;
  const LIB = JSON.parse(readFileSync(join(ART, "problemes/mise-en-scene/objets.json"), "utf8")).objets;
  const env = detect();
  if (!env.pw.ok || !env.browser.ok) throw new Error(`export-problemes : pas de navigateur (${env.report.playwright} / ${env.report.browser})`);
  const browser = await env.pw.lib.chromium.launch({ executablePath: env.browser.executablePath, args: ["--disable-gpu"] });
  const page = await (await browser.newContext()).newPage();
  await page.goto("about:blank");
  const lieux = [], manquent = [], recadres = {};
  for (const c of contextes) {
    const f = sourceLieu(c.id);
    if (!f) { manquent.push(c.id); continue; }
    const data = `data:${MIME(f)};base64,${readFileSync(f).toString("base64")}`;
    const [W, H] = await page.evaluate(async (s) => { const i = new Image(); i.src = s; await i.decode(); return [i.width, i.height]; }, data);
    const Z = recadrage(W, H, c.recadrage ?? {});
    const out = await page.evaluate(LIEU, [data, Z, IMAGE.w, IMAGE.h, QUALITE]);
    for (const k of [1, 2]) writeFileSync(join(OUT, `${c.id}@${k}x.webp`), Buffer.from(out.res[k].b64, "base64"));
    lieux.push(c.id); recadres[c.id] = { source: [W, H], garde: Z, x2: [out.res[2].w, out.res[2].h] };
    console.log(`  lieu ${c.id} : ${W} × ${H}, gardé ${Z.w} × ${Z.h} à partir de y ${Z.y} (${Math.round((100 * Z.y) / H)} % retirés en haut, ${Math.round((100 * (H - Z.y - Z.h)) / H)} % en bas) ; @2x ${out.res[2].w} × ${out.res[2].h}`);
  }
  const objets = {}, inconnus = [];
  const fichiers = existsSync(SRC_OBJ) ? readdirSync(SRC_OBJ).filter((f) => EXT.some((e) => f.toLowerCase().endsWith(`.${e}`))).sort() : [];
  for (const f of fichiers) {
    const base = f.replace(/\.[^.]+$/, ""), n = nomObjet(base, LIB);
    if (!n) { inconnus.push(f); continue; }
    const o = LIB.find((x) => x.id === n.id), chemin = join(SRC_OBJ, f);
    const out = await page.evaluate(DETOURER, [`data:${MIME(chemin)};base64,${readFileSync(chemin).toString("base64")}`, o.fond ?? "vert", o.h, QUALITE_OBJET, 400]);
    if (out.vide) { inconnus.push(`${f} (rien après le détourage : le fond est-il bien ${o.fond ?? "vert"} ?)`); continue; }
    for (const k of [1, 2]) writeFileSync(join(OUT_OBJ, `${base}@${k}x.webp`), Buffer.from(out.res[k].b64, "base64"));
    objets[base] = { w: out.res[1].w, h: out.res[1].h, c: o.categorie };
    console.log(`  objet ${base} : ${out.source.join(" × ")}, cadré ${out.cadre[2]} × ${out.cadre[3]}, @1x ${out.res[1].w} × ${out.res[1].h}`);
  }
  await browser.close();
  // les images d'un lieu ou d'un objet qui n'a plus de source disparaissent
  for (const f of readdirSync(OUT)) if (f.endsWith(".webp") && !lieux.includes(f.replace(/@\dx\.webp$/, ""))) unlinkSync(join(OUT, f));
  for (const f of readdirSync(OUT_OBJ)) if (f.endsWith(".webp") && !objets[f.replace(/@\dx\.webp$/, "")]) unlinkSync(join(OUT_OBJ, f));
  writeFileSync(join(OUT, "index.json"), `${JSON.stringify({ _doc: "Généré par art/tools/export-problemes.mjs : les lieux des problèmes qui ont leur illustration (app/assets/problemes/<lieu>@1x.webp et @2x.webp, 860 × 350 à @1x) et les objets de l'histoire qui ont leur image (objets/<objet>[-<variante>]@1x|2x.webp, leur taille à @1x, leur catégorie). Un lieu sans image a le papier du cadre ; un objet sans image, son étiquette seule.", lieux, manquent, objets }, null, 1)}\n`);
  console.log(`problèmes : ${lieux.length} lieux (${lieux.join(", ")}) ; sans image : ${manquent.length} ; ${Object.keys(objets).length} images d'objets${inconnus.length ? ` ; NON RECONNUS : ${inconnus.join(", ")} (nom attendu : <objet>.png ou <objet>-<variante>.png, objets.json)` : ""}`);
  return { lieux, manquent, objets, inconnus, recadres };
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await exportProblemes();
